import type { Metadata } from "next";
import { langCodes, getLanguageConfig, type Lang } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import "../globals.css";

export function generateStaticParams() {
  return langCodes.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    alternates: {
      languages: Object.fromEntries(langCodes.map((l) => [l, `/${l}/`])),
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  const { dir } = getLanguageConfig(lang as Lang);

  return (
    <html lang={lang} dir={dir}>
      <body className="min-h-full flex flex-col antialiased">
        <LanguageSwitcher currentLang={lang as Lang} />
        {children}
      </body>
    </html>
  );
}
