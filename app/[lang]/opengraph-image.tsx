import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getContent } from "@/lib/db";
import { langCodes, getLanguageConfig, type Lang } from "@/lib/i18n";

export const dynamic = "force-static";
export const alt = "Cafe branding";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return langCodes.map((lang) => ({ lang }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const { dir } = getLanguageConfig(lang as Lang);
  const content = getContent(lang as Lang, ["cafe_name", "tagline"]);

  const isFa = lang === "fa";
  const fontFamily = isFa ? "Vazirmatn" : "Inter";
  const fontFile = isFa ? "Vazirmatn" : "Inter";
  const [regular, bold] = await Promise.all([
    fs.readFile(path.join(process.cwd(), "assets", "fonts", `${fontFile}-Regular.woff`)),
    fs.readFile(path.join(process.cwd(), "assets", "fonts", `${fontFile}-Bold.woff`)),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1c1712",
          color: "#f3e9d8",
          fontFamily,
          direction: dir,
          padding: "0 96px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.2 }}>{content.cafe_name}</div>
        <div style={{ fontSize: 34, marginTop: 28, color: "#b9a98f", fontWeight: 400 }}>
          {content.tagline}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: fontFamily, data: regular, weight: 400, style: "normal" },
        { name: fontFamily, data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
