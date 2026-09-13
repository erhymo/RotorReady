import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getAudioEpisodeIds } from "@/lib/build/staticParams";

// Superseded by /audio/play?id=… — kept only so links shared or bookmarked under
// the old per-episode URL still land in the right place.
export function generateStaticParams() {
  return getAudioEpisodeIds().map((id) => ({ id }));
}

export default async function LegacyAudioEpisodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LegacyRouteRedirect to="/audio/play" param="id" value={id} />;
}
