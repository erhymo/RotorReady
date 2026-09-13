"use client";

import { Suspense } from "react";

import SystemNoteDetailClient from "@/app/components/SystemNoteDetailClient";
import { useActiveModelVariant } from "@/lib/models/hooks";

// One static page for every AW169 note, selected by `?slug=`. Which note set
// applies (Standard vs EP) is only known client-side, from the active variant.
export default function AW169SystemNotePage() {
  const { variant } = useActiveModelVariant();
  const variantId = variant?.id === "AW169_EP" ? "AW169_EP" : "AW169";

  return (
    <Suspense fallback={null}>
      <SystemNoteDetailClient variantId={variantId} />
    </Suspense>
  );
}
