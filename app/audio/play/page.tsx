import { Suspense } from "react";

import AudioPlayerClient from "./AudioPlayerClient";

// One static page for every episode, selected by `?id=`. See AudioPlayerClient
// for why this isn't a dynamic route segment.
export default function AudioPlayerPage() {
  return (
    <Suspense fallback={null}>
      <AudioPlayerClient />
    </Suspense>
  );
}
