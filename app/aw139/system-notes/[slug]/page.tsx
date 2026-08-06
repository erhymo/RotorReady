"use client";

import { useParams } from "next/navigation";

import SystemNoteDetailPage from "@/app/components/SystemNoteDetailPage";
import { AW139_SYSTEM_NOTES } from "@/data/aw139/systemNotes";

export default function AW139SystemNoteDetail() {
  const params = useParams<{ slug: string }>();
  const note = AW139_SYSTEM_NOTES.find((n) => n.slug === params.slug);

  return <SystemNoteDetailPage note={note} />;
}
