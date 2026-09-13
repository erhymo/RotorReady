import { Suspense } from "react";

import SystemNoteDetailClient from "@/app/components/SystemNoteDetailClient";

// One static page for every H135_T3 note, selected by `?slug=`.
export default function H135T3SystemNotePage() {
  return (
    <Suspense fallback={null}>
      <SystemNoteDetailClient variantId="H135_T3" />
    </Suspense>
  );
}
