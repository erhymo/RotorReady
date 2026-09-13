import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getProcedureSlugs } from "@/lib/build/staticParams";

// Superseded by /h125-as350-b3-2b1/procedures/detail?slug=… — kept for old links.
export function generateStaticParams() {
  return getProcedureSlugs("H125_AS350_B3_2B1").map((slug) => ({ slug }));
}

export default async function LegacyH125AS350B32B1ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRouteRedirect to="/h125-as350-b3-2b1/procedures/detail" param="slug" value={slug} />;
}
