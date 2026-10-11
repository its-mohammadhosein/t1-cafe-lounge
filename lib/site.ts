export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is not set. Copy .env.example to .env.local and set it " +
        "to the site's absolute origin (no trailing slash) before building.",
    );
  }
  return url.replace(/\/+$/, "");
}
