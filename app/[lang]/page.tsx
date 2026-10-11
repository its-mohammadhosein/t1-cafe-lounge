import Link from "next/link";
import { ArrowRight, Phone, Clock } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";
import { getContent, getAvailableMenu } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import type { Lang } from "@/lib/i18n";
import { MenuImage } from "@/components/MenuImage";
import { DirectionalIcon } from "@/components/DirectionalIcon";

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const content = getContent(lang as Lang, ["cafe_name", "tagline"]);
  return buildMetadata({
    lang: lang as Lang,
    pathWithoutLang: "/",
    title: content.cafe_name,
    description: content.tagline,
  });
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const dict = getDictionary(lang as Lang);
  const content = getContent(lang as Lang, [
    "cafe_name",
    "tagline",
    "about_story",
    "reserve_text",
    "phone",
    "phone_display",
    "hours",
  ]);
  const categories = getAvailableMenu(lang as Lang);

  return (
    <main>
      <section>
        <MenuImage image={null} kind="hero" alt="" priority className="w-full object-cover" />
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.cafe_name}</h1>
          <p className="mt-2 text-lg text-muted">{content.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/${lang}/menu/`}
              className="pressable inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground"
            >
              {dict.common.viewMenu}
            </Link>
            <Link
              href={`/${lang}/reserve/`}
              className="pressable inline-flex min-h-11 items-center justify-center rounded-full border border-border px-6 py-3 font-medium text-foreground"
            >
              {dict.common.reserveTable}
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {categories.length > 0 && (
          <section className="border-t border-border py-10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold tracking-tight">{dict.menu.title}</h2>
              <Link
                href={`/${lang}/menu/`}
                className="pressable inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary"
              >
                {dict.common.viewMenu}
                <DirectionalIcon icon={ArrowRight} size={16} />
              </Link>
            </div>
            <ul className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/${lang}/menu/#${category.slug}`}
                    className="pressable inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="border-t border-border py-10">
          <div className="flex gap-4">
            <MenuImage
              image={null}
              kind="about"
              alt=""
              className="h-24 w-24 flex-none rounded-lg object-cover sm:h-28 sm:w-28"
            />
            <div className="flex min-w-0 flex-col justify-center gap-2">
              <Link
                href={`/${lang}/about/`}
                className="pressable inline-flex min-h-11 items-center gap-1 text-xl font-semibold tracking-tight"
              >
                {dict.about.title}
                <DirectionalIcon icon={ArrowRight} size={18} />
              </Link>
              <p className="line-clamp-2 text-sm text-muted">{content.about_story}</p>
            </div>
          </div>
        </section>

        <section className="border-t border-border py-10">
          <div className="rounded-lg border border-border bg-surface p-6 text-center">
            <h2 className="text-xl font-semibold tracking-tight">{dict.reserve.title}</h2>
            <p className="mt-2 text-sm text-muted">{content.reserve_text}</p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted">
              <Clock aria-hidden size={16} />
              <span>{content.hours}</span>
            </div>
            <a
              href={`tel:${content.phone}`}
              className="pressable mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-foreground px-6 py-3 font-medium text-background"
            >
              <Phone aria-hidden size={18} />
              {dict.common.call} — {content.phone_display}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
