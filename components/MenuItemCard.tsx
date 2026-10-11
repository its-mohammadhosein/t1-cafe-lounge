import type { MenuItem } from "@/lib/db";
import type { Lang } from "@/lib/i18n";
import { formatPrice } from "@/lib/i18n";
import { MenuImage } from "@/components/MenuImage";

const CARD_CLASS =
  "menu-card flex gap-4 rounded-(--radius-lg) border border-border bg-surface p-3 sm:p-4";

export function MenuItemCard({
  item,
  lang,
  unavailableLabel,
  currencyLabel,
  index = 0,
}: {
  item: MenuItem;
  lang: Lang;
  unavailableLabel: string;
  currencyLabel: string;
  index?: number;
}) {
  const content = (
    <>
      <div className="relative h-24 w-24 flex-none sm:h-28 sm:w-28">
        <MenuImage
          image={item.image}
          kind="item"
          alt=""
          className={`h-full w-full rounded-md object-cover ${
            item.isAvailable ? "" : "opacity-70 grayscale"
          }`}
          style={{ viewTransitionName: `item-image-${item.slug}` }}
        />
        {!item.isAvailable && (
          <span className="absolute left-1 top-1 rounded-full bg-danger px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary-foreground">
            {unavailableLabel}
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <span className="font-medium leading-snug">{item.name}</span>
          <span className="whitespace-nowrap text-sm font-semibold text-primary">
            {formatPrice(item.price, lang)}{" "}
            <span className="text-xs font-normal text-muted">{currencyLabel}</span>
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-muted">{item.description}</p>
        {item.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 pt-0.5">
            {item.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );

  const style = { animationDelay: `${Math.min(index * 40, 240)}ms` };

  if (!item.isAvailable) {
    return (
      <div className={`${CARD_CLASS} opacity-90`} style={style} aria-disabled="true">
        {content}
      </div>
    );
  }

  // A plain <a> (not next/link) triggers a real document navigation, which
  // is what the browser's native View Transition between this thumbnail
  // and the item detail's hero image needs to fire.
  return (
    <a href={`/${lang}/menu/${item.slug}/`} className={`${CARD_CLASS} pressable`} style={style}>
      {content}
    </a>
  );
}
