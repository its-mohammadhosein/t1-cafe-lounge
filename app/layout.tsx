import type { Metadata, Viewport } from "next";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Lets the page paint under the notch/home-indicator; components that sit
  // at the screen edge (SiteHeader, BackToTop) pad themselves back out with
  // env(safe-area-inset-*) rather than being letterboxed away from them.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf6ee" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1712" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return children;
}
