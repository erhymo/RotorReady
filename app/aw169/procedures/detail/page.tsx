import { Suspense } from "react";

import AW169ProcedureDetailPage from "@/app/components/AW169ProcedureDetailPage";

// One static page for every AW169 procedure, selected by `?slug=`.
export default function AW169ProcedureDetail() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-zinc-900" />}>
      <AW169ProcedureDetailPage />
    </Suspense>
  );
}
