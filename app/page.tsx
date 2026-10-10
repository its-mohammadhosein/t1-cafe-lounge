"use client";

import { useEffect } from "react";
import { defaultLang, isValidLang } from "@/lib/i18n";

function detectLang(): string {
  if (typeof navigator === "undefined") return defaultLang;
  const candidates = navigator.languages ?? [navigator.language];
  for (const candidate of candidates) {
    const short = candidate.slice(0, 2).toLowerCase();
    if (isValidLang(short)) return short;
  }
  return defaultLang;
}

export default function RootRedirect() {
  useEffect(() => {
    window.location.replace(`/${detectLang()}/`);
  }, []);

  return (
    <html lang={defaultLang} dir="rtl">
      <body>
        <noscript>
          <a href={`/${defaultLang}/`}>Continue to the site / ادامه به سایت</a>
        </noscript>
      </body>
    </html>
  );
}
