import { getImageSrc, type ImageKind } from "@/lib/images";

const DIMENSIONS: Record<ImageKind, { width: number; height: number }> = {
  item: { width: 800, height: 600 },
  hero: { width: 1600, height: 900 },
  about: { width: 1600, height: 900 },
};

type MenuImageProps = {
  image: string | null;
  kind: ImageKind;
  alt: string;
  priority?: boolean;
  className?: string;
};

export function MenuImage({ image, kind, alt, priority = false, className }: MenuImageProps) {
  const src = getImageSrc(image, kind);
  const { width, height } = DIMENSIONS[kind];

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      className={className}
      style={{ aspectRatio: `${width} / ${height}` }}
    />
  );
}
