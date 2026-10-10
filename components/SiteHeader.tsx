import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function SiteHeader({ lang, dict }: { lang: Lang; dict: Dictionary }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b p-4">
      <nav aria-label="Main navigation" className="flex gap-4">
        <Link href={`/${lang}/`} className="min-h-11 content-center">
          {dict.nav.home}
        </Link>
        <Link href={`/${lang}/menu/`} className="min-h-11 content-center">
          {dict.nav.menu}
        </Link>
        <Link href={`/${lang}/about/`} className="min-h-11 content-center">
          {dict.nav.about}
        </Link>
        <Link href={`/${lang}/reserve/`} className="min-h-11 content-center">
          {dict.nav.reserve}
        </Link>
      </nav>
      <LanguageSwitcher currentLang={lang} />
    </header>
  );
}
