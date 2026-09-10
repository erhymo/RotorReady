"use client";

import SystemNotesPage from "@/app/components/SystemNotesPage";
import { R22_SYSTEM_NOTES } from "@/data/r22/systemNotes";

export default function R22SystemNotes() {
  return (
    <SystemNotesPage
      title="R22 SYSTEM NOTES"
      basePath="/r22/system-notes"
      data={R22_SYSTEM_NOTES}
    />
  );
}
