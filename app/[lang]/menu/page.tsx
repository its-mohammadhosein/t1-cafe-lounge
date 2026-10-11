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
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 pt-10 pb-6 sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight">{dict.menu.title}</h1>
        </div>
      </div>
      <CategoryNav categories={categories} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {categories.map((category, categoryIndex) => (
          <section
            key={category.id}
            id={category.slug}
            className={`py-10 ${categoryIndex > 0 ? "border-t border-border" : ""}`}
          >
            <h2 className="mb-5 text-xl font-semibold tracking-tight">{category.name}</h2>
            {category.items.length === 0 ? (
              <p className="rounded-(--radius-lg) border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
                {dict.menu.emptyCategory}
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {category.items.map((item, itemIndex) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    lang={lang as Lang}
                    unavailableLabel={dict.common.unavailable}
                    currencyLabel={dict.common.currency}
                    index={itemIndex}
                  />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
