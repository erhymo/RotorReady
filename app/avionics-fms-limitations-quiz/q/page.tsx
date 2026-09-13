import { Suspense } from "react";

import AvionicsQuestionClient from "./AvionicsQuestionClient";

// One static page for every question index, selected by `?n=`.
export default function AvionicsQuestionPage() {
  return (
    <Suspense fallback={null}>
      <AvionicsQuestionClient />
    </Suspense>
  );
}
