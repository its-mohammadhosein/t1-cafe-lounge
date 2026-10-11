import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return children;
}
