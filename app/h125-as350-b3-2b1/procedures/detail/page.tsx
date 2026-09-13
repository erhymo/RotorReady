import { Suspense } from "react";

import H125ProcedureDetailPage from "@/app/components/H125ProcedureDetailPage";

// One static page for every H125_AS350_B3_2B1 procedure, selected by `?slug=`.
export default function H125AS350B32B1ProcedureDetail() {
  return (
    <Suspense fallback={null}>
      <H125ProcedureDetailPage
        variantId="H125_AS350_B3_2B1"
        backHref="/training/procedures/h125-as350-b3-2b1"
        footerNote="H125 / AS350 B3 (2B1) training reference. For training use only. Always cross-check with the latest approved RFM."
        notFoundNote="This H125 / AS350 B3 (2B1) procedure is not defined. Use the RFM directly for reference."
      />
    </Suspense>
  );
}
