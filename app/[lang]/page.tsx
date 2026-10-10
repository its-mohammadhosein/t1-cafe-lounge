import { getDictionary } from "@/lib/dictionaries";
import type { Lang } from "@/lib/i18n";

export default async function HomePage({
  params,
}: PageProps<"/[lang]">) {
  const { lang } = await params;
  const dict = getDictionary(lang as Lang);

  return (
    <main>
      <h1>{dict.home.title}</h1>
      <p>{dict.home.subtitle}</p>
    </main>
  );
}
