"use client";

import SystemNotesPage from "@/app/components/SystemNotesPage";
import { useActiveModelVariant } from "@/lib/models/hooks";

export default function AW169SystemNotes() {
  const { variant } = useActiveModelVariant();
  const isEnhancedPerformance = variant?.id === "AW169_EP";

  return (
    <SystemNotesPage
      title={isEnhancedPerformance ? "AW169 EP SYSTEM NOTES" : "AW169 SYSTEM NOTES"}
      basePath="/aw169/system-notes"
      variantId={isEnhancedPerformance ? "AW169_EP" : "AW169"}
    />
  );
}
