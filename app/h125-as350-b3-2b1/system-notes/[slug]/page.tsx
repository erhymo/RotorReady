import SystemNoteDetailPage from "@/app/components/SystemNoteDetailPage";
import { H125B32B1_SYSTEM_NOTES } from "@/data/h125b32b1/systemNotes";

export function generateStaticParams() {
  return H125B32B1_SYSTEM_NOTES.map((n) => ({ slug: n.slug }));
}

export default async function H125B32B1SystemNoteDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = H125B32B1_SYSTEM_NOTES.find((n) => n.slug === slug);

  return <SystemNoteDetailPage note={note} />;
}
