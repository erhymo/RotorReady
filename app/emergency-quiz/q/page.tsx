import { Suspense } from "react";

import EmergencyQuestionClient from "./EmergencyQuestionClient";

// One static page for every question index, selected by `?n=`.
export default function EmergencyQuestionPage() {
  return (
    <Suspense fallback={null}>
      <EmergencyQuestionClient />
    </Suspense>
  );
}
