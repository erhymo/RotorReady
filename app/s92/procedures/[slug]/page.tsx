import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getProcedureSlugs } from "@/lib/build/staticParams";

// Superseded by /s92/procedures/detail?slug=… — kept for old links.
export function generateStaticParams() {
  return getProcedureSlugs("S92").map((slug) => ({ slug }));
}

export default async function LegacyS92ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRouteRedirect to="/s92/procedures/detail" param="slug" value={slug} />;
}
