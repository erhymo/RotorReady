import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getProcedureSlugs } from "@/lib/build/staticParams";

// Superseded by /r44-ii/procedures/detail?slug=… — kept for old links.
export function generateStaticParams() {
  return getProcedureSlugs("R44_II").map((slug) => ({ slug }));
}

export default async function LegacyR44IiProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRouteRedirect to="/r44-ii/procedures/detail" param="slug" value={slug} />;
}
