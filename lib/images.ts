import fs from "node:fs";
import path from "node:path";

export type ImageKind = "item" | "hero" | "about";

const REAL_DIR: Record<ImageKind, string> = {
  item: "images/menu",
  hero: "images/hero",
  about: "images/about",
};

const PLACEHOLDER: Record<ImageKind, string> = {
  item: "/images/placeholders/menu-item.svg",
  hero: "/images/placeholders/hero.svg",
  about: "/images/placeholders/about.svg",
};

export function getImageSrc(image: string | null, kind: ImageKind): string {
  if (image) {
    const absolutePath = path.join(process.cwd(), "public", REAL_DIR[kind], image);
    if (fs.existsSync(absolutePath)) {
      return `/${REAL_DIR[kind]}/${image}`;
    }
  }
  return PLACEHOLDER[kind];
}

export function isPlaceholder(image: string | null, kind: ImageKind): boolean {
  return getImageSrc(image, kind) === PLACEHOLDER[kind];
}
