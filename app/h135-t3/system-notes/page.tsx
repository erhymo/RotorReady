"use client";

import SystemNotesPage from "@/app/components/SystemNotesPage";
import { H135T3_SYSTEM_NOTES } from "@/data/h135-t3/systemNotes";

export default function H135T3SystemNotes() {
  return (
    <SystemNotesPage
      title="H135 T3 SYSTEM NOTES"
      basePath="/h135-t3/system-notes"
      data={H135T3_SYSTEM_NOTES}
    />
  );
}
