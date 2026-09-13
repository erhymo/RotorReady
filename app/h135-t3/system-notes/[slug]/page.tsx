import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getSystemNoteSlugs } from "@/lib/build/staticParams";

// Superseded by /h135-t3/system-notes/note?slug=… — kept for old links.
export function generateStaticParams() {
  return getSystemNoteSlugs("H135_T3").map((slug) => ({ slug }));
}

export default async function LegacyH135T3SystemNotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRouteRedirect to="/h135-t3/system-notes/note" param="slug" value={slug} />;
}
