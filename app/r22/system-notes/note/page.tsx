import { Suspense } from "react";

import SystemNoteDetailClient from "@/app/components/SystemNoteDetailClient";

// One static page for every R22 note, selected by `?slug=`.
export default function R22SystemNotePage() {
  return (
    <Suspense fallback={null}>
      <SystemNoteDetailClient variantId="R22" />
    </Suspense>
  );
}
