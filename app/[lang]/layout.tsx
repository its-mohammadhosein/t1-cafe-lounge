import type { Metadata } from "next";
import { Vazirmatn, Inter } from "next/font/google";
import { langCodes, getLanguageConfig, type Lang } from "@/lib/i18n";
import "../globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fa",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-en",
  display: "swap",
});

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
    other: {
      "view-transition": "same-origin",
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
    <html lang={lang} dir={dir} className={`${vazirmatn.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
