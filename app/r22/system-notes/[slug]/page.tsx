import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getSystemNoteSlugs } from "@/lib/build/staticParams";

// Superseded by /r22/system-notes/note?slug=… — kept for old links.
export function generateStaticParams() {
  return getSystemNoteSlugs("R22").map((slug) => ({ slug }));
}

export default async function LegacyR22SystemNotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRouteRedirect to="/r22/system-notes/note" param="slug" value={slug} />;
}
