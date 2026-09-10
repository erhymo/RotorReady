"use client";

import SystemNotesPage from "@/app/components/SystemNotesPage";
import { H125B3E_SYSTEM_NOTES } from "@/data/h125-as350-b3e/systemNotes";

export default function H125B3ESystemNotes() {
  return (
    <SystemNotesPage
      title="H125 / AS350 B3e SYSTEM NOTES"
      basePath="/h125-as350-b3e/system-notes"
      data={H125B3E_SYSTEM_NOTES}
    />
  );
}
