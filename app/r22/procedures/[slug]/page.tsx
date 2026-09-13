import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getProcedureSlugs } from "@/lib/build/staticParams";

// Superseded by /r22/procedures/detail?slug=… — kept for old links.
export function generateStaticParams() {
  return getProcedureSlugs("R22").map((slug) => ({ slug }));
}

export default async function LegacyR22ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRouteRedirect to="/r22/procedures/detail" param="slug" value={slug} />;
}
