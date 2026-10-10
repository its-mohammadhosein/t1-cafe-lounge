import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  getAllItemParams,
  getItemBySlug,
  getAdjacentItems,
  getContent,
} from "@/lib/db";
import { getDictionary } from "@/lib/dictionaries";
import { formatPrice, type Lang } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getImageSrc } from "@/lib/images";
import { MenuImage } from "@/components/MenuImage";
import { DirectionalIcon } from "@/components/DirectionalIcon";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllItemParams();
}

export async function generateMetadata({ params }: PageProps<"/[lang]/menu/[slug]">) {
  const { lang, slug } = await params;
  const item = getItemBySlug(lang as Lang, slug);
  if (!item) return {};

  const content = getContent(lang as Lang, ["cafe_name"]);

  return buildMetadata({
    lang: lang as Lang,
    pathWithoutLang: `/menu/${slug}/`,
    title: `${item.name} | ${content.cafe_name}`,
    description: item.description,
  });
}

export default async function MenuItemPage({ params }: PageProps<"/[lang]/menu/[slug]">) {
  const { lang, slug } = await params;
  const item = getItemBySlug(lang as Lang, slug);
  if (!item) notFound();

  const dict = getDictionary(lang as Lang);
  const { previous, next } = getAdjacentItems(lang as Lang, slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: item.name,
    description: item.description,
    price: item.price,
    image: getImageSrc(item.image, "item"),
  };

  return (
    <main className="flex flex-col gap-4 p-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Plain <a>, not next/link: a real document navigation is required
          for the browser's native View Transition back to the matching
          thumbnail on the menu list to fire. */}
      <a href={`/${lang}/menu/`} className="pressable inline-flex min-h-11 items-center gap-2 rounded-full px-2">
        <DirectionalIcon icon={ArrowLeft} />
        {dict.common.backToMenu}
      </a>

      <MenuImage
        image={item.image}
        kind="item"
        alt={item.name}
        priority
        className="w-full rounded-xl object-cover"
        style={{ viewTransitionName: `item-image-${item.slug}` }}
      />

      <div className="flex items-start justify-between gap-2">
        <h1 className="text-2xl font-semibold">{item.name}</h1>
        <span className="whitespace-nowrap text-lg">
          {formatPrice(item.price, lang as Lang)} {dict.common.currency}
        </span>
      </div>

      <Link href={`/${lang}/menu/#${item.categorySlug}`} className="text-sm underline">
        {item.categoryName}
      </Link>

      {!item.isAvailable && (
        <span className="text-sm text-red-600">{dict.common.unavailable}</span>
      )}

      <p>{item.description}</p>

      {item.longDescription && <p className="text-[var(--foreground)]/80">{item.longDescription}</p>}

      {item.tags.length > 0 && (
        <ul className="flex flex-wrap gap-1 text-xs">
          {item.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-black/5 px-2 py-0.5">
              {tag}
            </li>
          ))}
        </ul>
      )}

      {item.ingredients && (
        <div>
          <h2 className="text-sm font-medium text-[var(--foreground)]/70">{dict.common.ingredients}</h2>
          <p>{item.ingredients}</p>
        </div>
      )}

      {item.allergens && (
        <div>
          <h2 className="text-sm font-medium text-[var(--foreground)]/70">{dict.common.allergens}</h2>
          <p>{item.allergens}</p>
        </div>
      )}

      {/* Plain <a> tags so navigating between adjacent items is a real
          document load, letting the browser cross-fade the two hero
          images via the matching view-transition-name. */}
      <nav aria-label="Adjacent items" className="flex justify-between gap-2 border-t pt-4">
        {previous ? (
          <a href={`/${lang}/menu/${previous.slug}/`} className="pressable flex min-h-11 items-center gap-2 rounded-full px-2">
            <DirectionalIcon icon={ArrowLeft} />
            <span>
              {dict.common.previousItem}: {previous.name}
            </span>
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a href={`/${lang}/menu/${next.slug}/`} className="pressable flex min-h-11 items-center gap-2 rounded-full px-2 text-end">
            <span>
              {dict.common.nextItem}: {next.name}
            </span>
            <DirectionalIcon icon={ArrowRight} />
          </a>
        ) : (
          <span />
        )}
      </nav>

      <Link
        href={`/${lang}/reserve/`}
        className="pressable flex min-h-11 items-center justify-center rounded-full bg-[var(--foreground)] px-6 py-3 text-center font-medium text-[var(--background)]"
      >
        {dict.common.reserveTable}
      </Link>
    </main>
  );
}
