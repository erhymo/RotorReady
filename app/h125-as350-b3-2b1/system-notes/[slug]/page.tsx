"use client";

import { useParams } from "next/navigation";

import SystemNoteDetailPage from "@/app/components/SystemNoteDetailPage";
import { H125B32B1_SYSTEM_NOTES } from "@/data/h125b32b1/systemNotes";

export default function H125B32B1SystemNoteDetail() {
  const params = useParams<{ slug: string }>();
  const note = H125B32B1_SYSTEM_NOTES.find((n) => n.slug === params.slug);

  return <SystemNoteDetailPage note={note} />;
}
