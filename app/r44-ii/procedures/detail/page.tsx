import { Suspense } from "react";

import ProcedureDetailPage from "@/app/components/ProcedureDetailPage";

// One static page for every R44_II procedure, selected by `?slug=`.
export default function R44IiProcedureDetail() {
  return (
    <Suspense fallback={null}>
      <ProcedureDetailPage variantId="R44_II" backHref="/training/procedures/r44-ii" />
    </Suspense>
  );
}
