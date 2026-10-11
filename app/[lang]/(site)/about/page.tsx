import Link from "next/link";
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

  const infoRows = [
    {
      icon: Clock,
      label: dict.about.hoursLabel,
      value: <span>{content.hours}</span>,
    },
    {
      icon: MapPin,
      label: dict.about.addressLabel,
      value: (
        <span>
          {content.address}
          {" — "}
          <a href={content.map_url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary">
            {dict.about.mapLink}
          </a>
        </span>
      ),
    },
    {
      icon: Phone,
      label: dict.about.phoneLabel,
      value: (
        <a href={`tel:${content.phone}`} className="font-medium text-primary">
          {content.phone_display}
        </a>
      ),
    },
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <MenuImage image={null} kind="about" alt="" priority className="w-full object-cover" />

      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{dict.about.title}</h1>
          <p className="mt-3 text-lg leading-relaxed text-muted">{content.about_story}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <section className="py-10">
          <div className="flex flex-col gap-3">
            {infoRows.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="menu-card flex items-start gap-4 rounded-lg border border-border bg-surface p-4"
              >
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon aria-hidden size={20} />
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border py-10 text-center">
          <Link
            href={`/${lang}/reserve/`}
            className="pressable inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground"
          >
            {dict.common.reserveTable}
          </Link>
        </section>
      </div>
    </main>
  );
}
