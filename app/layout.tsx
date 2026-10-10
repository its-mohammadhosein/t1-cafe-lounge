import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cafe",
  description: "Cafe website",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <>{children}</>;
}
