"use client";

import SystemNotesPage from "@/app/components/SystemNotesPage";
import { H125B32B1_SYSTEM_NOTES } from "@/data/h125b32b1/systemNotes";

export default function H125B32B1SystemNotes() {
  return (
    <SystemNotesPage
      title="H125 / AS350 B3 (2B1) SYSTEM NOTES"
      basePath="/h125-as350-b3-2b1/system-notes"
      data={H125B32B1_SYSTEM_NOTES}
    />
  );
}
