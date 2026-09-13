import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getSystemNoteSlugs } from "@/lib/build/staticParams";

// Superseded by /aw169/system-notes/note?slug=… — kept for old links.
export function generateStaticParams() {
  // Both variants' slugs: which set applies is only known client-side.
  return getSystemNoteSlugs("AW169_EP", "AW169").map((slug) => ({ slug }));
}

export default async function LegacyAw169SystemNotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRouteRedirect to="/aw169/system-notes/note" param="slug" value={slug} />;
}
