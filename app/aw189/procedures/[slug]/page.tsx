import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getProcedureSlugs } from "@/lib/build/staticParams";

// Superseded by /aw189/procedures/detail?slug=… — kept for old links.
export function generateStaticParams() {
  return getProcedureSlugs("AW189").map((slug) => ({ slug }));
}

export default async function LegacyAw189ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRouteRedirect to="/aw189/procedures/detail" param="slug" value={slug} />;
}
