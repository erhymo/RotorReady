import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getProcedureSlugs } from "@/lib/build/staticParams";

// Superseded by /h125-as350-b3e/procedures/detail?slug=… — kept for old links.
export function generateStaticParams() {
  return getProcedureSlugs("H125_AS350_B3E").map((slug) => ({ slug }));
}

export default async function LegacyH125AS350B3EProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRouteRedirect to="/h125-as350-b3e/procedures/detail" param="slug" value={slug} />;
}
