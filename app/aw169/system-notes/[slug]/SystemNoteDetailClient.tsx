"use client";

import SystemNoteDetailPage from "@/app/components/SystemNoteDetailPage";
import { AW169_EP_SYSTEM_NOTES, AW169_STANDARD_SYSTEM_NOTES } from "@/data/aw169/systemNotes";
import { useActiveModelVariant } from "@/lib/models/hooks";

export default function AW169SystemNoteDetailClient({ slug }: { slug: string }) {
  const { variant } = useActiveModelVariant();
  const isEnhancedPerformance = variant?.id === "AW169_EP";
  const data = isEnhancedPerformance ? AW169_EP_SYSTEM_NOTES : AW169_STANDARD_SYSTEM_NOTES;
  const note = data.find((n) => n.slug === slug);

  return <SystemNoteDetailPage note={note} />;
}
