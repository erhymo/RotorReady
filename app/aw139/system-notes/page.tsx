"use client";

import SystemNotesPage from "@/app/components/SystemNotesPage";
import { AW139_SYSTEM_NOTES } from "@/data/aw139/systemNotes";

export default function AW139SystemNotes() {
  return (
    <SystemNotesPage
      title="AW139 SYSTEM NOTES"
      basePath="/aw139/system-notes"
      data={AW139_SYSTEM_NOTES}
    />
  );
}
