import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getProcedureSlugs } from "@/lib/build/staticParams";

// Superseded by /h145-d3/procedures/detail?slug=… — kept for old links.
export function generateStaticParams() {
  return getProcedureSlugs("H145_D3").map((slug) => ({ slug }));
}

export default async function LegacyH145D3ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRouteRedirect to="/h145-d3/procedures/detail" param="slug" value={slug} />;
}
