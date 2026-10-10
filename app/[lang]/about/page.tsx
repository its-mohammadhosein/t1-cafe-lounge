import { MapPin, Phone, Clock } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";
import { getContent } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import type { Lang } from "@/lib/i18n";
import { MenuImage } from "@/components/MenuImage";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  const dict = getDictionary(lang as Lang);
  const content = getContent(lang as Lang, ["cafe_name", "about_story"]);
  return buildMetadata({
    lang: lang as Lang,
    pathWithoutLang: "/about/",
    title: `${dict.about.title} | ${content.cafe_name}`,
    description: content.about_story,
  });
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  const dict = getDictionary(lang as Lang);
  const content = getContent(lang as Lang, [
    "cafe_name",
    "about_story",
    "hours",
    "address",
    "map_url",
    "phone",
    "phone_display",
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: content.cafe_name,
    description: content.about_story,
    address: content.address,
    telephone: content.phone,
    openingHours: content.hours,
    url: content.map_url,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MenuImage image={null} kind="about" alt="" />
      <h1 className="p-4 text-2xl font-semibold">{dict.about.title}</h1>
      <p className="px-4">{content.about_story}</p>
      <dl className="flex flex-col gap-3 p-4">
        <div className="flex items-start gap-2">
          <Clock aria-hidden size={20} className="mt-0.5 flex-none" />
          <div>
            <dt className="text-sm text-[var(--foreground)]/70">{dict.about.hoursLabel}</dt>
            <dd>{content.hours}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin aria-hidden size={20} className="mt-0.5 flex-none" />
          <div>
            <dt className="text-sm text-[var(--foreground)]/70">{dict.about.addressLabel}</dt>
            <dd>
              {content.address}
              {" — "}
              <a href={content.map_url} target="_blank" rel="noopener noreferrer">
                {dict.about.mapLink}
              </a>
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Phone aria-hidden size={20} className="mt-0.5 flex-none" />
          <div>
            <dt className="text-sm text-[var(--foreground)]/70">{dict.about.phoneLabel}</dt>
            <dd>
              <a href={`tel:${content.phone}`}>{content.phone_display}</a>
            </dd>
          </div>
        </div>
      </dl>
    </main>
  );
}
