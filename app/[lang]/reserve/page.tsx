import { Phone, Clock, MessageCircle, Send } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";
import { getContent } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import type { Lang } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/reserve">) {
  const { lang } = await params;
  const dict = getDictionary(lang as Lang);
  const content = getContent(lang as Lang, ["cafe_name", "reserve_text"]);
  return buildMetadata({
    lang: lang as Lang,
    pathWithoutLang: "/reserve/",
    title: `${dict.reserve.title} | ${content.cafe_name}`,
    description: content.reserve_text,
  });
}

export default async function ReservePage({ params }: PageProps<"/[lang]/reserve">) {
  const { lang } = await params;
  const dict = getDictionary(lang as Lang);
  const content = getContent(lang as Lang, [
    "reserve_text",
    "hours",
    "phone",
    "phone_display",
    "whatsapp",
    "telegram",
  ]);

  return (
    <main className="flex flex-col items-center gap-6 p-6 text-center">
      <h1 className="text-2xl font-semibold">{dict.reserve.title}</h1>
      <p>{content.reserve_text}</p>

      <a
        href={`tel:${content.phone}`}
        className="flex min-h-11 items-center gap-2 rounded-full bg-[var(--foreground)] px-8 py-4 text-lg font-medium text-[var(--background)] transition active:scale-95"
      >
        <Phone aria-hidden size={22} />
        {dict.common.call} — {content.phone_display}
      </a>

      <div className="flex items-center gap-2 text-sm text-[var(--foreground)]/70">
        <Clock aria-hidden size={18} />
        <span>{content.hours}</span>
      </div>

      {(content.whatsapp || content.telegram) && (
        <div className="flex gap-4">
          {content.whatsapp && (
            <a
              href={content.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-2 rounded-full border px-4 py-2"
            >
              <MessageCircle aria-hidden size={18} />
              {dict.reserve.whatsapp}
            </a>
          )}
          {content.telegram && (
            <a
              href={content.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-2 rounded-full border px-4 py-2"
            >
              <Send aria-hidden size={18} />
              {dict.reserve.telegram}
            </a>
          )}
        </div>
      )}
    </main>
  );
}
