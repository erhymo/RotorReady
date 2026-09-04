import { getAudioEpisodeIds } from "@/lib/build/staticParams";
import AudioPlayerClient from "./AudioPlayerClient";

export function generateStaticParams() {
  return getAudioEpisodeIds().map((id) => ({ id }));
}

export default function AudioPlayerPage() {
  return <AudioPlayerClient />;
}
