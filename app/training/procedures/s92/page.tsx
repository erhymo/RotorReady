"use client";

import ProceduresListPage from "@/app/components/ProceduresListPage";

export default function S92ProceduresListPage() {
  return (
    <ProceduresListPage
      variantId="S92"
      detailHref="/s92/procedures/detail"
      abbreviationsHref="/s92/abbreviations"
    />
  );
}
