import { Suspense } from "react";

import ProcedureDetailPage from "@/app/components/ProcedureDetailPage";

// One static page for every AW139 procedure, selected by `?slug=`.
export default function Aw139ProcedureDetail() {
  return (
    <Suspense fallback={null}>
      <ProcedureDetailPage variantId="AW139" backHref="/training/procedures/aw139" />
    </Suspense>
  );
}
