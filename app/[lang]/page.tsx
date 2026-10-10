import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";
import { getContent } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import type { Lang } from "@/lib/i18n";
import { MenuImage } from "@/components/MenuImage";

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
  const content = getContent(lang as Lang, ["cafe_name", "tagline"]);

  return (
    <main>
      <MenuImage image={null} kind="hero" alt="" priority />
      <h1>{content.cafe_name}</h1>
      <p>{content.tagline}</p>
      <p>{dict.home.subtitle}</p>
      <Link href={`/${lang}/menu/`}>{dict.common.viewMenu}</Link>
    </main>
  );
}
