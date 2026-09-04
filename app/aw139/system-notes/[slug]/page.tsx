import SystemNoteDetailPage from "@/app/components/SystemNoteDetailPage";
import { AW139_SYSTEM_NOTES } from "@/data/aw139/systemNotes";

export function generateStaticParams() {
  return AW139_SYSTEM_NOTES.map((n) => ({ slug: n.slug }));
}

export default async function AW139SystemNoteDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = AW139_SYSTEM_NOTES.find((n) => n.slug === slug);

  return <SystemNoteDetailPage note={note} />;
}
