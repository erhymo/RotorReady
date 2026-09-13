import { Suspense } from "react";

import ProcedureDetailPage from "@/app/components/ProcedureDetailPage";

// One static page for every AW189 procedure, selected by `?slug=`.
export default function Aw189ProcedureDetail() {
  return (
    <Suspense fallback={null}>
      <ProcedureDetailPage variantId="AW189" backHref="/training/procedures/aw189" />
    </Suspense>
  );
}
