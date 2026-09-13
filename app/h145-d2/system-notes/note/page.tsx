import { Suspense } from "react";

import SystemNoteDetailClient from "@/app/components/SystemNoteDetailClient";

// One static page for every H145_D2 note, selected by `?slug=`.
export default function H145D2SystemNotePage() {
  return (
    <Suspense fallback={null}>
      <SystemNoteDetailClient variantId="H145_D2" />
    </Suspense>
  );
}
