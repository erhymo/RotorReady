import { Suspense } from "react";

import SystemNoteDetailClient from "@/app/components/SystemNoteDetailClient";

// One static page for every H125_AS350_B3E note, selected by `?slug=`.
export default function H125As350B3eSystemNotePage() {
  return (
    <Suspense fallback={null}>
      <SystemNoteDetailClient variantId="H125_AS350_B3E" />
    </Suspense>
  );
}
