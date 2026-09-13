"use client";

import ProceduresListPage from "@/app/components/ProceduresListPage";

export default function R22ProceduresListPage() {
  return (
    <ProceduresListPage
      variantId="R22"
      detailHref="/r22/procedures/detail"
      abbreviationsHref="/r22/abbreviations"
    />
  );
}
