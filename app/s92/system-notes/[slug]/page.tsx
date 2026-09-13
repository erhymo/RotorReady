import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getSystemNoteSlugs } from "@/lib/build/staticParams";

// Superseded by /s92/system-notes/note?slug=… — kept for old links.
export function generateStaticParams() {
  return getSystemNoteSlugs("S92").map((slug) => ({ slug }));
}

export default async function LegacyS92SystemNotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRouteRedirect to="/s92/system-notes/note" param="slug" value={slug} />;
}
