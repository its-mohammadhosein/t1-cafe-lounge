"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function SiteHeader({
  lang,
  dict,
  cafeName,
}: {
  lang: Lang;
  dict: Dictionary;
  cafeName: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${lang}/menu/`, label: dict.nav.menu },
    { href: `/${lang}/about/`, label: dict.nav.about },
    { href: `/${lang}/reserve/`, label: dict.nav.reserve },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-(--background)/90 backdrop-blur-sm">
      <div className="mx-auto flex h-(--header-height) max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href={`/${lang}/`}
          className="pressable max-w-[40%] truncate rounded-lg px-1 text-lg font-semibold tracking-tight"
        >
          {cafeName}
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 sm:flex">
          {links.map((link) => {
            const isActive = pathname?.startsWith(link.href) ?? false;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`pressable inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium ${
                  isActive ? "bg-primary text-primary-foreground" : "text-(--foreground)/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden sm:block">
          <LanguageSwitcher currentLang={lang} />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={dict.nav.menu}
          aria-expanded={open}
          className="pressable flex min-h-11 w-11 flex-none items-center justify-center rounded-full sm:hidden"
        >
          {open ? <X aria-hidden size={20} /> : <MenuIcon aria-hidden size={20} />}
        </button>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full border-t border-border bg-surface px-4 py-3 shadow-md sm:hidden">
          <nav aria-label="Main navigation" className="flex flex-col gap-1">
            {links.map((link) => {
              const isActive = pathname?.startsWith(link.href) ?? false;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`pressable flex min-h-11 items-center rounded-lg px-3 text-sm font-medium ${
                    isActive ? "bg-primary text-primary-foreground" : "text-(--foreground)/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-2 border-t border-border pt-3">
            <LanguageSwitcher currentLang={lang} />
          </div>
        </div>
      )}
    </header>
  );
}
