import SystemNoteDetailPage from "@/app/components/SystemNoteDetailPage";
import { H135T3_SYSTEM_NOTES } from "@/data/h135t3/systemNotes";

export function generateStaticParams() {
  return H135T3_SYSTEM_NOTES.map((n) => ({ slug: n.slug }));
}

export default async function H135T3SystemNoteDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = H135T3_SYSTEM_NOTES.find((n) => n.slug === slug);

  return <SystemNoteDetailPage note={note} />;
}
