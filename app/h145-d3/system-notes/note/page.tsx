import { Suspense } from "react";

import SystemNoteDetailClient from "@/app/components/SystemNoteDetailClient";

// One static page for every H145_D3 note, selected by `?slug=`.
export default function H145D3SystemNotePage() {
  return (
    <Suspense fallback={null}>
      <SystemNoteDetailClient variantId="H145_D3" />
    </Suspense>
  );
}
