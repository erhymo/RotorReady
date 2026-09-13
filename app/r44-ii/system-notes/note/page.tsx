import { Suspense } from "react";

import SystemNoteDetailClient from "@/app/components/SystemNoteDetailClient";

// One static page for every R44_II note, selected by `?slug=`.
export default function R44IiSystemNotePage() {
  return (
    <Suspense fallback={null}>
      <SystemNoteDetailClient variantId="R44_II" />
    </Suspense>
  );
}
