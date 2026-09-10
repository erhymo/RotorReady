"use client";

import SystemNotesPage from "@/app/components/SystemNotesPage";
import { H145D2_SYSTEM_NOTES } from "@/data/h145-d2/systemNotes";

export default function H145D2SystemNotes() {
  return (
    <SystemNotesPage
      title="H145 D2 SYSTEM NOTES"
      basePath="/h145-d2/system-notes"
      data={H145D2_SYSTEM_NOTES}
    />
  );
}
