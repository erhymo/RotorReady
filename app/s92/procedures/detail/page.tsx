import { Suspense } from "react";

import ProcedureDetailPage from "@/app/components/ProcedureDetailPage";

// One static page for every S92 procedure, selected by `?slug=`.
export default function S92ProcedureDetail() {
  return (
    <Suspense fallback={null}>
      <ProcedureDetailPage variantId="S92" backHref="/training/procedures/s92" />
    </Suspense>
  );
}
