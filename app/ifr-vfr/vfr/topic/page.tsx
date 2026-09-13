import { Suspense } from "react";

import VfrTopicClient from "./VfrTopicClient";

// One static page for every VFR topic, selected by `?slug=`.
export default function VfrTopicPage() {
  return (
    <Suspense fallback={null}>
      <VfrTopicClient />
    </Suspense>
  );
}
