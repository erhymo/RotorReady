import { getLightAudioIds } from "@/lib/build/staticParams";
import LightAudioPlayerClient from "./LightAudioPlayerClient";

export function generateStaticParams() {
  return getLightAudioIds().map((lightId) => ({ lightId }));
}

export default function LightAudioPlayerPage() {
  return <LightAudioPlayerClient />;
}
