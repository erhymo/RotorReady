import { Suspense } from "react";

import ProcedureDetailPage from "@/app/components/ProcedureDetailPage";

// One static page for every H135_T3 procedure, selected by `?slug=`.
export default function H135T3ProcedureDetail() {
  return (
    <Suspense fallback={null}>
      <ProcedureDetailPage variantId="H135_T3" backHref="/training/procedures/h135-t3" />
    </Suspense>
  );
}
