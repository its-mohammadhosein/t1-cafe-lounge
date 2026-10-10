import type { Metadata } from "next";
import { langCodes, type Lang } from "./i18n";

export function buildMetadata({
  lang,
  pathWithoutLang,
  title,
  description,
}: {
  lang: Lang;
  pathWithoutLang: string;
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}${pathWithoutLang}`,
      languages: Object.fromEntries(
        langCodes.map((l) => [l, `/${l}${pathWithoutLang}`]),
      ),
    },
  };
}
