import { Suspense } from "react";

import ProcedureDetailPage from "@/app/components/ProcedureDetailPage";

// One static page for every R22 procedure, selected by `?slug=`.
export default function R22ProcedureDetail() {
  return (
    <Suspense fallback={null}>
      <ProcedureDetailPage variantId="R22" backHref="/training/procedures/r22" />
    </Suspense>
  );
}
