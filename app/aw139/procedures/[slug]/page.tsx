import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getProcedureSlugs } from "@/lib/build/staticParams";

// Superseded by /aw139/procedures/detail?slug=… — kept for old links.
export function generateStaticParams() {
  return getProcedureSlugs("AW139").map((slug) => ({ slug }));
}

export default async function LegacyAw139ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRouteRedirect to="/aw139/procedures/detail" param="slug" value={slug} />;
}
