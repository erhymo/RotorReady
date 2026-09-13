import LegacyRouteRedirect from "@/components/LegacyRouteRedirect";
import { getLightAudioIds } from "@/lib/build/staticParams";

// Superseded by /training/lights/audio/play?lightId=… — kept for old links.
export function generateStaticParams() {
  return getLightAudioIds().map((lightId) => ({ lightId }));
}

export default async function LegacyLightAudioPage({ params }: { params: Promise<{ lightId: string }> }) {
  const { lightId } = await params;
  return <LegacyRouteRedirect to="/training/lights/audio/play" param="lightId" value={lightId} />;
}
