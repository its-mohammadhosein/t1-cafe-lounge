import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const DB_PATH = path.join(process.cwd(), "data", "cafe.db");

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL
  );

  CREATE TABLE category_translations (
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    lang TEXT NOT NULL,
    name TEXT NOT NULL,
    PRIMARY KEY (category_id, lang)
  );

  CREATE TABLE menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    price INTEGER NOT NULL,
    image TEXT,
    tags TEXT NOT NULL DEFAULT '',
    is_available INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL
  );

  CREATE TABLE menu_item_translations (
    item_id INTEGER NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    lang TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    ingredients TEXT,
    allergens TEXT,
    PRIMARY KEY (item_id, lang)
  );

  CREATE TABLE site_content (
    key TEXT NOT NULL,
    lang TEXT NOT NULL,
    value TEXT NOT NULL,
    PRIMARY KEY (key, lang)
  );
`);

type Lang = "fa" | "en";

type CategorySeed = {
  slug: string;
  sortOrder: number;
  name: Record<Lang, string>;
  items: ItemSeed[];
};

type ItemSeed = {
  slug: string;
  price: number;
  image?: string;
  tags: string[];
  isAvailable?: boolean;
  sortOrder: number;
  name: Record<Lang, string>;
  description: Record<Lang, string>;
  longDescription?: Record<Lang, string>;
  ingredients?: Record<Lang, string>;
  allergens?: Record<Lang, string>;
};

const categories: CategorySeed[] = [
  {
    slug: "hot-drinks",
    sortOrder: 1,
    name: { fa: "نوشیدنی گرم", en: "Hot Drinks" },
    items: [
      {
        slug: "espresso",
        price: 85000,
        tags: ["vegan"],
        sortOrder: 1,
        name: { fa: "اسپرسو", en: "Espresso" },
        description: {
          fa: "عصاره‌ی متمرکز قهوه، تلخ و پرانرژی.",
          en: "A concentrated shot of coffee, bold and bright.",
        },
        longDescription: {
          fa: "دانه‌های تازه آسیاب‌شده با فشار بالا دم می‌شوند تا کرمای غنی و طعم عمیق به دست بیاید.",
          en: "Freshly ground beans pulled under high pressure for a rich crema and deep flavor.",
        },
        ingredients: { fa: "دانه قهوه عربیکا", en: "Arabica coffee beans" },
        allergens: { fa: "ندارد", en: "None" },
      },
      {
        slug: "americano",
        price: 95000,
        tags: ["vegan"],
        sortOrder: 2,
        name: { fa: "امریکانو", en: "Americano" },
        description: {
          fa: "اسپرسو رقیق‌شده با آب داغ، ملایم و روان.",
          en: "Espresso diluted with hot water, smooth and light.",
        },
      },
      {
        slug: "cappuccino",
        price: 110000,
        tags: ["vegetarian"],
        sortOrder: 3,
        name: { fa: "کاپوچینو", en: "Cappuccino" },
        description: {
          fa: "اسپرسو با شیر بخاردیده و فوم ابری.",
          en: "Espresso with steamed milk and a cloud of foam.",
        },
        longDescription: {
          fa: "نسبت برابر اسپرسو، شیر و فوم، سروشده با طرح لاته‌آرت ساده.",
          en: "Equal parts espresso, milk, and foam, finished with simple latte art.",
        },
        ingredients: { fa: "اسپرسو، شیر", en: "Espresso, milk" },
        allergens: { fa: "لاکتوز", en: "Lactose" },
      },
      {
        slug: "cafe-latte",
        price: 115000,
        tags: ["vegetarian"],
        sortOrder: 4,
        name: { fa: "کافه لاته", en: "Cafe Latte" },
        description: {
          fa: "اسپرسو با شیر فراوان و لایه‌ی نازک فوم.",
          en: "Espresso with plenty of milk and a thin layer of foam.",
        },
      },
      {
        slug: "turkish-coffee",
        price: 90000,
        tags: ["vegan"],
        sortOrder: 5,
        name: { fa: "قهوه ترک", en: "Turkish Coffee" },
        description: {
          fa: "قهوه‌ی سنتی دم‌شده در قوری شنی، غلیظ و معطر.",
          en: "Traditional sand-brewed coffee, thick and aromatic.",
        },
      },
    ],
  },
  {
    slug: "cold-drinks",
    sortOrder: 2,
    name: { fa: "نوشیدنی سرد", en: "Cold Drinks" },
    items: [
      {
        slug: "iced-latte",
        price: 120000,
        image: "iced-latte.jpg",
        tags: ["vegetarian"],
        sortOrder: 1,
        name: { fa: "آیس لاته", en: "Iced Latte" },
        description: {
          fa: "اسپرسو، شیر سرد و یخ، خوشرنگ و خوش‌طعم.",
          en: "Espresso, cold milk, and ice — smooth and refreshing.",
        },
        longDescription: {
          fa: "مناسب روزهای گرم، با شیر کامل و دو شات اسپرسو تازه.",
          en: "Perfect for warm days, made with whole milk and two fresh espresso shots.",
        },
        ingredients: { fa: "اسپرسو، شیر، یخ", en: "Espresso, milk, ice" },
        allergens: { fa: "لاکتوز", en: "Lactose" },
      },
      {
        slug: "iced-americano",
        price: 100000,
        tags: ["vegan"],
        sortOrder: 2,
        name: { fa: "آیس امریکانو", en: "Iced Americano" },
        description: {
          fa: "امریکانو سرو شده روی یخ.",
          en: "Americano served over ice.",
        },
      },
      {
        slug: "lemonade",
        price: 90000,
        tags: ["vegan", "gluten-free"],
        sortOrder: 3,
        name: { fa: "لیموناد", en: "Lemonade" },
        description: {
          fa: "آب‌لیموی تازه با نعنا و یخ.",
          en: "Fresh lemon juice with mint and ice.",
        },
      },
      {
        slug: "mint-lemonade",
        price: 95000,
        tags: ["vegan", "gluten-free"],
        sortOrder: 4,
        name: { fa: "لیموناد نعنا", en: "Mint Lemonade" },
        description: {
          fa: "لیموناد با نعنای تازه و کمی شکر.",
          en: "Lemonade with fresh mint and a touch of sugar.",
        },
      },
      {
        slug: "fruit-smoothie",
        price: 135000,
        tags: ["vegetarian", "gluten-free"],
        sortOrder: 5,
        name: { fa: "اسموتی میوه", en: "Fruit Smoothie" },
        description: {
          fa: "ترکیبی از میوه‌های فصل با ماست و یخ.",
          en: "A blend of seasonal fruit with yogurt and ice.",
        },
      },
    ],
  },
  {
    slug: "pastries",
    sortOrder: 3,
    name: { fa: "شیرینی", en: "Pastries" },
    items: [
      {
        slug: "croissant",
        price: 75000,
        image: "croissant.jpg",
        tags: ["vegetarian"],
        sortOrder: 1,
        name: { fa: "کروسان", en: "Croissant" },
        description: {
          fa: "کروسان کره‌ای، لایه‌لایه و ترد.",
          en: "Buttery, flaky, layered croissant.",
        },
        longDescription: {
          fa: "هر روز صبح تازه پخته می‌شود، بیرون ترد و داخل نرم.",
          en: "Baked fresh every morning, crisp outside and soft inside.",
        },
        ingredients: { fa: "آرد، کره، شکر، مخمر", en: "Flour, butter, sugar, yeast" },
        allergens: { fa: "گلوتن، لاکتوز", en: "Gluten, lactose" },
      },
      {
        slug: "chocolate-croissant",
        price: 85000,
        tags: ["vegetarian"],
        sortOrder: 2,
        name: { fa: "کروسان شکلاتی", en: "Chocolate Croissant" },
        description: {
          fa: "کروسان با مغز شکلات تلخ.",
          en: "Croissant filled with dark chocolate.",
        },
        allergens: { fa: "گلوتن، لاکتوز", en: "Gluten, lactose" },
      },
      {
        slug: "cinnamon-roll",
        price: 95000,
        tags: ["vegetarian"],
        sortOrder: 3,
        name: { fa: "رول دارچین", en: "Cinnamon Roll" },
        description: {
          fa: "رول نرم با دارچین و گلیز وانیلی.",
          en: "Soft roll with cinnamon and vanilla glaze.",
        },
      },
      {
        slug: "cheesecake",
        price: 150000,
        tags: ["vegetarian"],
        sortOrder: 4,
        name: { fa: "چیزکیک", en: "Cheesecake" },
        description: {
          fa: "چیزکیک نیویورکی با سس توت‌فرنگی.",
          en: "New York style cheesecake with strawberry sauce.",
        },
      },
      {
        slug: "baklava",
        price: 80000,
        tags: ["vegetarian"],
        sortOrder: 5,
        name: { fa: "باقلوا", en: "Baklava" },
        description: {
          fa: "شیرینی لایه‌ای با مغز پسته و شربت عسل.",
          en: "Layered pastry with pistachio and honey syrup.",
        },
      },
    ],
  },
  {
    slug: "breakfast",
    sortOrder: 4,
    name: { fa: "صبحانه", en: "Breakfast" },
    items: [
      {
        slug: "omelette",
        price: 160000,
        tags: ["vegetarian", "gluten-free"],
        sortOrder: 1,
        name: { fa: "املت", en: "Omelette" },
        description: {
          fa: "املت سه تخم‌مرغ با سبزیجات تازه.",
          en: "Three-egg omelette with fresh vegetables.",
        },
      },
      {
        slug: "avocado-toast",
        price: 175000,
        tags: ["vegetarian"],
        sortOrder: 2,
        name: { fa: "تست آووکادو", en: "Avocado Toast" },
        description: {
          fa: "نان سبوس‌دار با آووکادو، تخم‌مرغ آب‌پز و فلفل.",
          en: "Sourdough toast with avocado, boiled egg, and chili flakes.",
        },
        longDescription: {
          fa: "آووکادوی له‌شده روی نان تست‌شده، با تخم‌مرغ نیم‌پز و کمی لیمو.",
          en: "Mashed avocado on toasted sourdough, topped with a soft-boiled egg and a squeeze of lemon.",
        },
        ingredients: { fa: "نان سبوس‌دار، آووکادو، تخم‌مرغ", en: "Sourdough bread, avocado, egg" },
        allergens: { fa: "گلوتن، تخم‌مرغ", en: "Gluten, egg" },
      },
      {
        slug: "pancakes",
        price: 145000,
        tags: ["vegetarian"],
        sortOrder: 3,
        name: { fa: "پنکیک", en: "Pancakes" },
        description: {
          fa: "پنکیک نرم با عسل و میوه‌های تازه.",
          en: "Fluffy pancakes with honey and fresh fruit.",
        },
      },
      {
        slug: "breakfast-plate",
        price: 220000,
        tags: ["vegetarian"],
        sortOrder: 4,
        name: { fa: "بشقاب صبحانه", en: "Breakfast Plate" },
        description: {
          fa: "تخم‌مرغ، پنیر، کره، مربا و نان تازه.",
          en: "Eggs, cheese, butter, jam, and fresh bread.",
        },
      },
      {
        slug: "granola-yogurt",
        price: 130000,
        tags: ["vegetarian", "gluten-free"],
        isAvailable: true,
        sortOrder: 5,
        name: { fa: "گرانولا و ماست", en: "Granola & Yogurt" },
        description: {
          fa: "ماست یونانی با گرانولا خانگی و عسل.",
          en: "Greek yogurt with house-made granola and honey.",
        },
      },
    ],
  },
];

const siteContent: Record<string, Record<Lang, string>> = {
  cafe_name: { fa: "کافه لانژ تی‌وان", en: "T1 Cafe Lounge" },
  tagline: {
    fa: "جایی برای یک فنجان آرامش",
    en: "A cup of calm, every time",
  },
  about_story: {
    fa: "کافه لانژ تی‌وان از سال ۱۳۹۸ میزبان لحظات گرم و دوستانه بوده است. ما قهوه‌ی تازه‌برشته، شیرینی‌های خانگی و فضایی آرام برای نشستن و گفتگو را کنار هم آورده‌ایم.",
    en: "T1 Cafe Lounge has been hosting warm, friendly moments since 2019. We bring together freshly roasted coffee, house-made pastries, and a calm space to sit and talk.",
  },
  hours: {
    fa: "هر روز ۸ صبح تا ۱۱ شب",
    en: "Daily, 8:00 AM – 11:00 PM",
  },
  address: {
    fa: "تهران، خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۲۳",
    en: "123 Valiasr St, near Vanak Square, Tehran",
  },
  map_url: {
    fa: "https://maps.google.com/?q=Tehran+Valiasr+St",
    en: "https://maps.google.com/?q=Tehran+Valiasr+St",
  },
  phone: { fa: "+982112345678", en: "+982112345678" },
  phone_display: { fa: "۰۲۱-۱۲۳۴۵۶۷۸", en: "021-12345678" },
  whatsapp: { fa: "https://wa.me/982112345678", en: "https://wa.me/982112345678" },
  telegram: { fa: "https://t.me/t1cafelounge", en: "https://t.me/t1cafelounge" },
  reserve_text: {
    fa: "برای رزرو میز با ما تماس بگیرید یا پیام بدهید. منتظر شما هستیم.",
    en: "Call or message us to reserve a table. We'd love to host you.",
  },
};

const insertCategory = db.prepare(
  `INSERT INTO categories (slug, sort_order) VALUES (?, ?)`,
);
const insertCategoryTranslation = db.prepare(
  `INSERT INTO category_translations (category_id, lang, name) VALUES (?, ?, ?)`,
);
const insertItem = db.prepare(
  `INSERT INTO menu_items (category_id, slug, price, image, tags, is_available, sort_order)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
);
const insertItemTranslation = db.prepare(
  `INSERT INTO menu_item_translations
     (item_id, lang, name, description, long_description, ingredients, allergens)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
);
const insertSiteContent = db.prepare(
  `INSERT INTO site_content (key, lang, value) VALUES (?, ?, ?)`,
);

const seed = db.transaction(() => {
  for (const category of categories) {
    const { lastInsertRowid: categoryId } = insertCategory.run(
      category.slug,
      category.sortOrder,
    );

    for (const lang of ["fa", "en"] as Lang[]) {
      insertCategoryTranslation.run(categoryId, lang, category.name[lang]);
    }

    for (const item of category.items) {
      const { lastInsertRowid: itemId } = insertItem.run(
        categoryId,
        item.slug,
        item.price,
        item.image ?? null,
        item.tags.join(","),
        item.isAvailable === false ? 0 : 1,
        item.sortOrder,
      );

      for (const lang of ["fa", "en"] as Lang[]) {
        insertItemTranslation.run(
          itemId,
          lang,
          item.name[lang],
          item.description[lang],
          item.longDescription?.[lang] ?? null,
          item.ingredients?.[lang] ?? null,
          item.allergens?.[lang] ?? null,
        );
      }
    }
  }

  for (const [key, values] of Object.entries(siteContent)) {
    for (const lang of ["fa", "en"] as Lang[]) {
      insertSiteContent.run(key, lang, values[lang]);
    }
  }
});

seed();

const categoryCount = db.prepare(`SELECT COUNT(*) AS n FROM categories`).get() as {
  n: number;
};
const itemCount = db.prepare(`SELECT COUNT(*) AS n FROM menu_items`).get() as {
  n: number;
};

console.log(
  `Seeded ${categoryCount.n} categories and ${itemCount.n} menu items into ${DB_PATH}`,
);

db.close();
