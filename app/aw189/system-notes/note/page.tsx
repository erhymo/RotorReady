import { Suspense } from "react";

import SystemNoteDetailClient from "@/app/components/SystemNoteDetailClient";

// One static page for every AW189 note, selected by `?slug=`.
export default function Aw189SystemNotePage() {
  return (
    <Suspense fallback={null}>
      <SystemNoteDetailClient variantId="AW189" />
    </Suspense>
  );
}
