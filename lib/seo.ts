import type { Metadata } from "next";
import { langCodes, languages, getLanguageConfig, type Lang } from "./i18n";

export function buildMetadata({
  lang,
  pathWithoutLang,
  title,
  description,
  siteName,
  image,
}: {
  lang: Lang;
  pathWithoutLang: string;
  title: string;
  description: string;
  /** Pass the cafe's name when the caller already has it, for openGraph.siteName. */
  siteName?: string;
  /**
   * Overrides the default per-language Open Graph image — used by item
   * pages that have a real photo. Omit to fall back to the language's
   * default OG image (the opengraph-image.tsx route).
   *
   * Next does not deep-merge `openGraph` across route segments — a page
   * that defines its own `openGraph` object replaces the ancestor's
   * entirely, so the auto-detected opengraph-image file only survives for
   * pages co-located with it (the home page). Every other page must set
   * this explicitly rather than relying on inheritance.
   */
  image?: string;
}): Metadata {
  const { locale } = getLanguageConfig(lang);
  const alternateLocale = languages.filter((l) => l.code !== lang).map((l) => l.locale);
  const url = `/${lang}${pathWithoutLang}`;
  const resolvedImage = image ?? `/${lang}/opengraph-image`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        langCodes.map((l) => [l, `/${l}${pathWithoutLang}`]),
      ),
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale,
      alternateLocale,
      type: "website",
      images: [{ url: resolvedImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolvedImage],
    },
  };
}
