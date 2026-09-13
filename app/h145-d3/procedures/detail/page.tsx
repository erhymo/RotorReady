import { Suspense } from "react";

import ProcedureDetailPage from "@/app/components/ProcedureDetailPage";

// One static page for every H145_D3 procedure, selected by `?slug=`.
export default function H145D3ProcedureDetail() {
  return (
    <Suspense fallback={null}>
      <ProcedureDetailPage variantId="H145_D3" backHref="/training/procedures/h145-d3" />
    </Suspense>
  );
}
