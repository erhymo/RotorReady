import SystemNoteDetailPage from "@/app/components/SystemNoteDetailPage";
import { H145D3_SYSTEM_NOTES } from "@/data/h145d3/systemNotes";

export function generateStaticParams() {
  return H145D3_SYSTEM_NOTES.map((n) => ({ slug: n.slug }));
}

export default async function H145D3SystemNoteDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = H145D3_SYSTEM_NOTES.find((n) => n.slug === slug);

  return <SystemNoteDetailPage note={note} />;
}
