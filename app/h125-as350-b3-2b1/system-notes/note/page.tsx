import { Suspense } from "react";

import SystemNoteDetailClient from "@/app/components/SystemNoteDetailClient";

// One static page for every H125_AS350_B3_2B1 note, selected by `?slug=`.
export default function H125As350B32b1SystemNotePage() {
  return (
    <Suspense fallback={null}>
      <SystemNoteDetailClient variantId="H125_AS350_B3_2B1" />
    </Suspense>
  );
}
