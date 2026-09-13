import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getProcedureSlugs } from "@/lib/build/staticParams";

// Superseded by /h135-t3/procedures/detail?slug=… — kept for old links.
export function generateStaticParams() {
  return getProcedureSlugs("H135_T3").map((slug) => ({ slug }));
}

export default async function LegacyH135T3ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRouteRedirect to="/h135-t3/procedures/detail" param="slug" value={slug} />;
}
