import SystemNoteDetailPage from "@/app/components/SystemNoteDetailPage";
import { AW189_SYSTEM_NOTES } from "@/data/aw189/systemNotes";

export function generateStaticParams() {
  return AW189_SYSTEM_NOTES.map((n) => ({ slug: n.slug }));
}

export default async function AW189SystemNoteDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = AW189_SYSTEM_NOTES.find((n) => n.slug === slug);

  return <SystemNoteDetailPage note={note} />;
}
