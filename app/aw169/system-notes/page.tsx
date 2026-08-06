"use client";

import SystemNotesPage from "@/app/components/SystemNotesPage";
import { AW169_EP_SYSTEM_NOTES, AW169_STANDARD_SYSTEM_NOTES } from "@/data/aw169/systemNotes";
import { useActiveModelVariant } from "@/lib/models/hooks";

export default function AW169SystemNotes() {
  const { variant } = useActiveModelVariant();
  const isEnhancedPerformance = variant?.id === "AW169_EP";
  const data = isEnhancedPerformance ? AW169_EP_SYSTEM_NOTES : AW169_STANDARD_SYSTEM_NOTES;

  return (
    <SystemNotesPage
      title={isEnhancedPerformance ? "AW169 EP SYSTEM NOTES" : "AW169 SYSTEM NOTES"}
      basePath="/aw169/system-notes"
      data={data}
    />
  );
}
