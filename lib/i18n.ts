export type Lang = "fa" | "en";

export type LanguageConfig = {
  code: Lang;
  dir: "rtl" | "ltr";
  label: string;
  locale: string;
};

export const languages: LanguageConfig[] = [
  { code: "fa", dir: "rtl", label: "فارسی", locale: "fa-IR" },
  { code: "en", dir: "ltr", label: "English", locale: "en-US" },
];

export const defaultLang: Lang = "fa";

export const langCodes: Lang[] = languages.map((l) => l.code);

export function isValidLang(value: string): value is Lang {
  return langCodes.includes(value as Lang);
}

export function getLanguageConfig(lang: Lang): LanguageConfig {
  return languages.find((l) => l.code === lang) ?? languages[0];
}

export function formatPrice(price: number, lang: Lang): string {
  const { locale } = getLanguageConfig(lang);
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(price);
}
