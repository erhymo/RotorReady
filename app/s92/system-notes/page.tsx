"use client";

import SystemNotesPage from "@/app/components/SystemNotesPage";
import { S92_SYSTEM_NOTES } from "@/data/s92/systemNotes";

export default function S92SystemNotes() {
  return (
    <SystemNotesPage
      title="S-92 SYSTEM NOTES"
      basePath="/s92/system-notes"
      data={S92_SYSTEM_NOTES}
    />
  );
}
