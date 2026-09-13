import { Suspense } from "react";

import IfrTopicClient from "./IfrTopicClient";

// One static page for every IFR topic, selected by `?slug=`.
export default function IfrTopicPage() {
  return (
    <Suspense fallback={null}>
      <IfrTopicClient />
    </Suspense>
  );
}
