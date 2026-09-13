import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getSystemNoteSlugs } from "@/lib/build/staticParams";

// Superseded by /h125-as350-b3e/system-notes/note?slug=… — kept for old links.
export function generateStaticParams() {
  return getSystemNoteSlugs("H125_AS350_B3E").map((slug) => ({ slug }));
}

export default async function LegacyH125As350B3eSystemNotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRouteRedirect to="/h125-as350-b3e/system-notes/note" param="slug" value={slug} />;
}
