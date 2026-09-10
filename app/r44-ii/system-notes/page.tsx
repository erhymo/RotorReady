"use client";

import SystemNotesPage from "@/app/components/SystemNotesPage";
import { R44_SYSTEM_NOTES } from "@/data/r44/systemNotes";

export default function R44IISystemNotes() {
  return (
    <SystemNotesPage
      title="R44 II SYSTEM NOTES"
      basePath="/r44-ii/system-notes"
      data={R44_SYSTEM_NOTES}
    />
  );
}
