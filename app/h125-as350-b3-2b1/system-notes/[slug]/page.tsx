import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getSystemNoteSlugs } from "@/lib/build/staticParams";

// Superseded by /h125-as350-b3-2b1/system-notes/note?slug=… — kept for old links.
export function generateStaticParams() {
  return getSystemNoteSlugs("H125_AS350_B3_2B1").map((slug) => ({ slug }));
}

export default async function LegacyH125As350B32b1SystemNotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRouteRedirect to="/h125-as350-b3-2b1/system-notes/note" param="slug" value={slug} />;
}
