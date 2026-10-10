import type { LucideIcon } from "lucide-react";

/**
 * Mirrors a directional icon (arrows, chevrons) in RTL so it keeps
 * pointing toward the "back"/"previous" direction of reading flow.
 */
export function DirectionalIcon({
  icon: Icon,
  className,
  size = 20,
}: {
  icon: LucideIcon;
  className?: string;
  size?: number;
}) {
  return <Icon aria-hidden size={size} className={`rtl:-scale-x-100 ${className ?? ""}`} />;
}
