"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import SystemNoteDetailPage from "@/app/components/SystemNoteDetailPage";
import { fetchContentJson } from "@/lib/contentUrl";
import { findSystemNote, systemNotesPath, type SystemNote } from "@/lib/systemNotes/data";

// Note slug comes from `?slug=` rather than a dynamic route segment, so this one
// bundled page serves every note — including ones written after the last native
// build. See app/audio/play/AudioPlayerClient.tsx for the full reasoning.
export default function SystemNoteDetailClient({ variantId }: { variantId: string }) {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const [note, setNote] = useState<SystemNote | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setNote(undefined);
    });
    fetchContentJson<{ notes?: SystemNote[] }>(systemNotesPath(variantId))
      .then((json) => {
        if (cancelled) return;
        const notes = Array.isArray(json?.notes) ? json.notes : [];
        setNote(findSystemNote(notes, slug) ?? null);
      })
      .catch(() => {
        if (!cancelled) setNote(null);
      });
    return () => {
      cancelled = true;
    };
  }, [variantId, slug]);

  if (note === undefined) {
    return <div className="p-6 text-sm text-slate-500 dark:text-zinc-400">Loading…</div>;
  }
  return <SystemNoteDetailPage note={note ?? undefined} />;
}
