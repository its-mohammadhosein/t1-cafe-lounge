"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { languages, type Lang } from "@/lib/i18n";

function pathForLang(pathname: string, currentLang: Lang, targetLang: Lang): string {
  const prefix = `/${currentLang}`;
  const rest = pathname === prefix ? "" : pathname.slice(prefix.length);
  return `/${targetLang}${rest}` || `/${targetLang}/`;
}

export function LanguageSwitcher({ currentLang }: { currentLang: Lang }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Language switcher">
      {languages.map((language) => {
        if (language.code === currentLang) return null;
        return (
          <Link
            key={language.code}
            href={pathForLang(pathname, currentLang, language.code)}
            hrefLang={language.code}
          >
            {language.label}
          </Link>
        );
      })}
    </nav>
  );
}
