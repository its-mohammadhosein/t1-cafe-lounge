import { getDictionary } from "@/lib/dictionaries";
import { getMenu, getContent } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import type { Lang } from "@/lib/i18n";
import { CategoryNav } from "@/components/CategoryNav";
import { MenuItemCard } from "@/components/MenuItemCard";

export async function generateMetadata({ params }: PageProps<"/[lang]/menu">) {
  const { lang } = await params;
  const dict = getDictionary(lang as Lang);
  const content = getContent(lang as Lang, ["cafe_name"]);
  return buildMetadata({
    lang: lang as Lang,
    pathWithoutLang: "/menu/",
    title: `${dict.menu.title} | ${content.cafe_name}`,
    description: dict.home.subtitle,
  });
}

export default async function MenuPage({ params }: PageProps<"/[lang]/menu">) {
  const { lang } = await params;
  const dict = getDictionary(lang as Lang);
  const categories = getMenu(lang as Lang);

  return (
    <main>
      <h1 className="p-4 text-2xl font-semibold">{dict.menu.title}</h1>
      <CategoryNav categories={categories} />
      {categories.map((category) => (
        <section key={category.id} id={category.slug} className="p-4">
          <h2 className="mb-2 text-lg font-semibold">{category.name}</h2>
          {category.items.length === 0 ? (
            <p className="text-sm text-[var(--foreground)]/70">{dict.menu.emptyCategory}</p>
          ) : (
            <div className="flex flex-col gap-2">
              {category.items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  lang={lang as Lang}
                  unavailableLabel={dict.common.unavailable}
                  currencyLabel={dict.common.currency}
                />
              ))}
            </div>
          )}
        </section>
      ))}
    </main>
  );
}
