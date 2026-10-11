import type { MetadataRoute } from "next";
import { getAllItemParams, getDbLastModified } from "@/lib/db";
import { langCodes } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

const STATIC_PATHS = ["/", "/menu/", "/about/", "/reserve/"];

function alternates(siteUrl: string, pathWithoutLang: string) {
  return Object.fromEntries(
    langCodes.map((l) => [l, `${siteUrl}/${l}${pathWithoutLang}`]),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = getDbLastModified();

  const staticEntries: MetadataRoute.Sitemap = langCodes.flatMap((lang) =>
    STATIC_PATHS.map((pathWithoutLang) => ({
      url: `${siteUrl}/${lang}${pathWithoutLang}`,
      lastModified,
      alternates: { languages: alternates(siteUrl, pathWithoutLang) },
    })),
  );

  const itemEntries: MetadataRoute.Sitemap = getAllItemParams().map(({ lang, slug }) => ({
    url: `${siteUrl}/${lang}/menu/${slug}/`,
    lastModified,
    alternates: { languages: alternates(siteUrl, `/menu/${slug}/`) },
  }));

  return [...staticEntries, ...itemEntries];
}
