"use client";

import { useParams } from "next/navigation";

import SystemNoteDetailPage from "@/app/components/SystemNoteDetailPage";
import { S92_SYSTEM_NOTES } from "@/data/s92/systemNotes";

export default function S92SystemNoteDetail() {
  const params = useParams<{ slug: string }>();
  const note = S92_SYSTEM_NOTES.find((n) => n.slug === params.slug);

  return <SystemNoteDetailPage note={note} />;
}
