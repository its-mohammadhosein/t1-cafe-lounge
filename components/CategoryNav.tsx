import type { MenuCategory } from "@/lib/db";

export function CategoryNav({ categories }: { categories: MenuCategory[] }) {
  return (
    <nav aria-label="Menu categories" className="sticky top-0 z-10 overflow-x-auto bg-[var(--background)]">
      <ul className="flex gap-2 p-2">
        {categories.map((category) => (
          <li key={category.id}>
            <a
              href={`#${category.slug}`}
              className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-4 py-2 hover:bg-black/5 active:scale-95 focus-visible:outline focus-visible:outline-2"
            >
              {category.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
