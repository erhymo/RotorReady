import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getProcedureSlugs } from "@/lib/build/staticParams";

// Superseded by /aw169/procedures/detail?slug=… — kept for old links. The
// static "single-engine" route still wins over this dynamic one, which is
// intended: that procedure is still a hand-written page.
export function generateStaticParams() {
  return getProcedureSlugs("AW169").map((slug) => ({ slug }));
}

export default async function LegacyAW169ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRouteRedirect to="/aw169/procedures/detail" param="slug" value={slug} />;
}
