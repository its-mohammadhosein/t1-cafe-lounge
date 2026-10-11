import { getDictionary } from "@/lib/dictionaries";
import { getContent } from "@/lib/db";
import type { Lang } from "@/lib/i18n";
import { SiteHeader } from "@/components/SiteHeader";

export default async function SiteLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  const dict = getDictionary(lang as Lang);
  const content = getContent(lang as Lang, ["cafe_name"]);

  return (
    <>
      <SiteHeader lang={lang as Lang} dict={dict} cafeName={content.cafe_name} />
      {children}
    </>
  );
}
