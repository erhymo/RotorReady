import { AW169_EP_SYSTEM_NOTES, AW169_STANDARD_SYSTEM_NOTES } from "@/data/aw169/systemNotes";
import AW169SystemNoteDetailClient from "./SystemNoteDetailClient";

// The active variant (Standard vs EP) is only known client-side (read from
// localStorage), so which note set applies can't be resolved at build time —
// generate params for the union of both sets and let the client pick.
export function generateStaticParams() {
  const slugs = new Set<string>();
  for (const n of AW169_EP_SYSTEM_NOTES) slugs.add(n.slug);
  for (const n of AW169_STANDARD_SYSTEM_NOTES) slugs.add(n.slug);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export default async function AW169SystemNoteDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AW169SystemNoteDetailClient slug={slug} />;
}
