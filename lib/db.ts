import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const DB_PATH = path.join(process.cwd(), "data", "cafe.db");

export function getDbLastModified(): Date {
  return fs.statSync(DB_PATH).mtime;
}

export type Lang = "fa" | "en";

export type MenuItem = {
  id: number;
  slug: string;
  price: number;
  image: string | null;
  tags: string[];
  isAvailable: boolean;
  sortOrder: number;
  categoryId: number;
  categorySlug: string;
  categoryName: string;
  name: string;
  description: string;
  longDescription: string | null;
  ingredients: string | null;
  allergens: string | null;
};

export type MenuCategory = {
  id: number;
  slug: string;
  name: string;
  sortOrder: number;
  items: MenuItem[];
};

type MenuItemRow = {
  id: number;
  category_id: number;
  slug: string;
  price: number;
  image: string | null;
  tags: string;
  is_available: number;
  sort_order: number;
  category_slug: string;
  category_name: string;
  name: string;
  description: string;
  long_description: string | null;
  ingredients: string | null;
  allergens: string | null;
};

let connection: Database.Database | null = null;

function getConnection(): Database.Database {
  if (!connection) {
    connection = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  }
  return connection;
}

const menuCache = new Map<Lang, MenuCategory[]>();

function loadMenu(lang: Lang): MenuCategory[] {
  const db = getConnection();

  const categoryRows = db
    .prepare(
      `SELECT c.id, c.slug, c.sort_order, ct.name
       FROM categories c
       JOIN category_translations ct ON ct.category_id = c.id AND ct.lang = ?
       ORDER BY c.sort_order`,
    )
    .all(lang) as { id: number; slug: string; sort_order: number; name: string }[];

  const itemRows = db
    .prepare(
      `SELECT
         mi.id, mi.category_id, mi.slug, mi.price, mi.image, mi.tags,
         mi.is_available, mi.sort_order,
         c.slug AS category_slug, ct.name AS category_name,
         mit.name, mit.description, mit.long_description, mit.ingredients, mit.allergens
       FROM menu_items mi
       JOIN categories c ON c.id = mi.category_id
       JOIN category_translations ct ON ct.category_id = c.id AND ct.lang = ?
       JOIN menu_item_translations mit ON mit.item_id = mi.id AND mit.lang = ?
       ORDER BY mi.category_id, mi.sort_order`,
    )
    .all(lang, lang) as MenuItemRow[];

  const itemsByCategory = new Map<number, MenuItem[]>();
  for (const row of itemRows) {
    const item: MenuItem = {
      id: row.id,
      slug: row.slug,
      price: row.price,
      image: row.image,
      tags: row.tags ? row.tags.split(",").filter(Boolean) : [],
      isAvailable: row.is_available === 1,
      sortOrder: row.sort_order,
      categoryId: row.category_id,
      categorySlug: row.category_slug,
      categoryName: row.category_name,
      name: row.name,
      description: row.description,
      longDescription: row.long_description,
      ingredients: row.ingredients,
      allergens: row.allergens,
    };
    const list = itemsByCategory.get(row.category_id) ?? [];
    list.push(item);
    itemsByCategory.set(row.category_id, list);
  }

  return categoryRows.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    sortOrder: category.sort_order,
    items: itemsByCategory.get(category.id) ?? [],
  }));
}

export function getMenu(lang: Lang): MenuCategory[] {
  let menu = menuCache.get(lang);
  if (!menu) {
    menu = loadMenu(lang);
    menuCache.set(lang, menu);
  }
  return menu;
}

export function getAvailableMenu(lang: Lang): MenuCategory[] {
  return getMenu(lang)
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => item.isAvailable),
    }))
    .filter((category) => category.items.length > 0);
}

export function getItemBySlug(lang: Lang, slug: string): MenuItem | null {
  for (const category of getMenu(lang)) {
    const item = category.items.find((i) => i.slug === slug);
    if (item) return item;
  }
  return null;
}

export function getAdjacentItems(
  lang: Lang,
  slug: string,
): { previous: MenuItem | null; next: MenuItem | null } {
  const menu = getMenu(lang);
  for (const category of menu) {
    const available = category.items.filter((item) => item.isAvailable);
    const index = available.findIndex((item) => item.slug === slug);
    if (index === -1) continue;
    return {
      previous: index > 0 ? available[index - 1] : null,
      next: index < available.length - 1 ? available[index + 1] : null,
    };
  }
  return { previous: null, next: null };
}

const contentCache = new Map<Lang, Record<string, string>>();

function loadContent(lang: Lang): Record<string, string> {
  const db = getConnection();
  const rows = db
    .prepare(`SELECT key, value FROM site_content WHERE lang = ?`)
    .all(lang) as { key: string; value: string }[];

  const content: Record<string, string> = {};
  for (const row of rows) content[row.key] = row.value;
  return content;
}

export function getContent(lang: Lang, keys?: string[]): Record<string, string> {
  let content = contentCache.get(lang);
  if (!content) {
    content = loadContent(lang);
    contentCache.set(lang, content);
  }
  if (!keys) return content;

  const subset: Record<string, string> = {};
  for (const key of keys) subset[key] = content[key] ?? "";
  return subset;
}

let itemParamsCache: { lang: Lang; slug: string }[] | null = null;

export function getAllItemParams(): { lang: Lang; slug: string }[] {
  if (itemParamsCache) return itemParamsCache;

  const db = getConnection();
  const rows = db
    .prepare(`SELECT slug FROM menu_items WHERE is_available = 1`)
    .all() as { slug: string }[];

  const langs: Lang[] = ["fa", "en"];
  itemParamsCache = langs.flatMap((lang) =>
    rows.map((row) => ({ lang, slug: row.slug })),
  );
  return itemParamsCache;
}
