"use client";

import SystemNotesPage from "@/app/components/SystemNotesPage";
import { AW189_SYSTEM_NOTES } from "@/data/aw189/systemNotes";

export default function AW189SystemNotes() {
  return (
    <SystemNotesPage
      title="AW189 SYSTEM NOTES"
      basePath="/aw189/system-notes"
      data={AW189_SYSTEM_NOTES}
    />
  );
}
