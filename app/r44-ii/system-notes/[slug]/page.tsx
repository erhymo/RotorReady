import SystemNoteDetailPage from "@/app/components/SystemNoteDetailPage";
import { R44_SYSTEM_NOTES } from "@/data/r44/systemNotes";

export function generateStaticParams() {
  return R44_SYSTEM_NOTES.map((n) => ({ slug: n.slug }));
}

export default async function R44IISystemNoteDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = R44_SYSTEM_NOTES.find((n) => n.slug === slug);

  return <SystemNoteDetailPage note={note} />;
}
