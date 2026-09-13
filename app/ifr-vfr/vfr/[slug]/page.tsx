import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getVfrTopicSlugs } from "@/lib/build/staticParams";

// Superseded by /ifr-vfr/vfr/topic?slug=… — kept for old links.
export function generateStaticParams() {
  return getVfrTopicSlugs().map((slug) => ({ slug }));
}

export default async function LegacyVfrTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRouteRedirect to="/ifr-vfr/vfr/topic" param="slug" value={slug} />;
}
