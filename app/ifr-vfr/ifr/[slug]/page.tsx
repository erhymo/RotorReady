import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getIfrTopicSlugs } from "@/lib/build/staticParams";

// Superseded by /ifr-vfr/ifr/topic?slug=… — kept for old links.
export function generateStaticParams() {
  return getIfrTopicSlugs().map((slug) => ({ slug }));
}

export default async function LegacyIfrTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRouteRedirect to="/ifr-vfr/ifr/topic" param="slug" value={slug} />;
}
