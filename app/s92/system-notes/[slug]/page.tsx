import SystemNoteDetailPage from "@/app/components/SystemNoteDetailPage";
import { S92_SYSTEM_NOTES } from "@/data/s92/systemNotes";

export function generateStaticParams() {
  return S92_SYSTEM_NOTES.map((n) => ({ slug: n.slug }));
}

export default async function S92SystemNoteDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = S92_SYSTEM_NOTES.find((n) => n.slug === slug);

  return <SystemNoteDetailPage note={note} />;
}
