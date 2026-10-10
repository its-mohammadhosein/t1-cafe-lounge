import type { Lang } from "./i18n";
import fa from "@/dictionaries/fa.json";
import en from "@/dictionaries/en.json";

export type Dictionary = typeof fa;

const dictionaries: Record<Lang, Dictionary> = { fa, en };

export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang];
}
