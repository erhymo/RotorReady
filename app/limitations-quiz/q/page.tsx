import { Suspense } from "react";

import LimitationsQuestionClient from "./LimitationsQuestionClient";

// One static page for every question index, selected by `?n=`.
export default function LimitationsQuestionPage() {
  return (
    <Suspense fallback={null}>
      <LimitationsQuestionClient />
    </Suspense>
  );
}
