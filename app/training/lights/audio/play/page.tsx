import { Suspense } from "react";

import LightAudioPlayerClient from "./LightAudioPlayerClient";

// One static page for every light walkthrough, selected by `?lightId=`.
export default function LightAudioPlayerPage() {
  return (
    <Suspense fallback={null}>
      <LightAudioPlayerClient />
    </Suspense>
  );
}
