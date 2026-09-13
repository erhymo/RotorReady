import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getSystemNoteSlugs } from "@/lib/build/staticParams";

// Superseded by /h145-d3/system-notes/note?slug=… — kept for old links.
export function generateStaticParams() {
  return getSystemNoteSlugs("H145_D3").map((slug) => ({ slug }));
}

export default async function LegacyH145D3SystemNotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRouteRedirect to="/h145-d3/system-notes/note" param="slug" value={slug} />;
}
