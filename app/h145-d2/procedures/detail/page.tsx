import { Suspense } from "react";

import ProcedureDetailPage from "@/app/components/ProcedureDetailPage";

// One static page for every H145_D2 procedure, selected by `?slug=`.
export default function H145D2ProcedureDetail() {
  return (
    <Suspense fallback={null}>
      <ProcedureDetailPage variantId="H145_D2" backHref="/training/procedures/h145-d2" />
    </Suspense>
  );
}
