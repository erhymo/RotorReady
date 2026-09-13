import { Suspense } from "react";

import SystemNoteDetailClient from "@/app/components/SystemNoteDetailClient";

// One static page for every AW139 note, selected by `?slug=`.
export default function Aw139SystemNotePage() {
  return (
    <Suspense fallback={null}>
      <SystemNoteDetailClient variantId="AW139" />
    </Suspense>
  );
}
