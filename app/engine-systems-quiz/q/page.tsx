import { Suspense } from "react";

import EngineQuestionClient from "./EngineQuestionClient";

// One static page for every question index, selected by `?n=`.
export default function EngineQuestionPage() {
  return (
    <Suspense fallback={null}>
      <EngineQuestionClient />
    </Suspense>
  );
}
