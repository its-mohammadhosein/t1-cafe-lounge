import Link from "next/link";
import type { MenuItem } from "@/lib/db";
import type { Lang } from "@/lib/i18n";
import { formatPrice } from "@/lib/i18n";
import { MenuImage } from "@/components/MenuImage";

const CARD_CLASS =
  "flex min-h-11 gap-4 rounded-xl p-3 transition focus-visible:outline focus-visible:outline-2";
const AVAILABLE_CLASS = "hover:bg-black/5 active:scale-[0.99]";
const UNAVAILABLE_CLASS = "opacity-60";

export function MenuItemCard({
  item,
  lang,
  unavailableLabel,
  currencyLabel,
}: {
  item: MenuItem;
  lang: Lang;
  unavailableLabel: string;
  currencyLabel: string;
}) {
  const content = (
    <>
      <MenuImage
        image={item.image}
        kind="item"
        alt=""
        className="h-20 w-20 flex-none rounded-lg object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <span className="font-medium">{item.name}</span>
          <span className="whitespace-nowrap text-sm text-[var(--foreground)]/80">
            {formatPrice(item.price, lang)} {currencyLabel}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-[var(--foreground)]/70">{item.description}</p>
        {item.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1 text-xs">
            {item.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-black/5 px-2 py-0.5">
                {tag}
              </li>
            ))}
          </ul>
        )}
        {!item.isAvailable && (
          <span className="text-xs text-red-600">{unavailableLabel}</span>
        )}
      </div>
    </>
  );

  if (!item.isAvailable) {
    return (
      <div className={`${CARD_CLASS} ${UNAVAILABLE_CLASS}`} aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link href={`/${lang}/menu/${item.slug}/`} className={`${CARD_CLASS} ${AVAILABLE_CLASS}`}>
      {content}
    </Link>
  );
}
