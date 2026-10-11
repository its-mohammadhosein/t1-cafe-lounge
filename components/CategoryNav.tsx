"use client";

import { useEffect, useState } from "react";
import type { MenuCategory } from "@/lib/db";

export function CategoryNav({ categories }: { categories: MenuCategory[] }) {
  const [active, setActive] = useState(categories[0]?.slug ?? "");

  useEffect(() => {
    const sections = categories
      .map((category) => document.getElementById(category.slug))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [categories]);

  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-0 z-10 border-b border-border bg-(--background)/90 backdrop-blur-sm"
    >
      <ul className="mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
        {categories.map((category) => {
          const isActive = category.slug === active;
          return (
            <li key={category.id} className="flex-none">
              <a
                href={`#${category.slug}`}
                aria-current={isActive ? "true" : undefined}
                className={`pressable inline-flex min-h-11 items-center whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-(--duration-base) ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-(--foreground)/80"
                }`}
              >
                {category.name}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
