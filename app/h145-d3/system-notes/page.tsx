"use client";

import SystemNotesPage from "@/app/components/SystemNotesPage";
import { H145D3_SYSTEM_NOTES } from "@/data/h145-d3/systemNotes";

export default function H145D3SystemNotes() {
  return (
    <SystemNotesPage
      title="H145 D3 SYSTEM NOTES"
      basePath="/h145-d3/system-notes"
      data={H145D3_SYSTEM_NOTES}
    />
  );
}
