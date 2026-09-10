import SystemNoteDetailPage from "@/app/components/SystemNoteDetailPage";
import { R22_SYSTEM_NOTES } from "@/data/r22/systemNotes";

export function generateStaticParams() {
  return R22_SYSTEM_NOTES.map((n) => ({ slug: n.slug }));
}

export default async function R22SystemNoteDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = R22_SYSTEM_NOTES.find((n) => n.slug === slug);

  return <SystemNoteDetailPage note={note} />;
}
