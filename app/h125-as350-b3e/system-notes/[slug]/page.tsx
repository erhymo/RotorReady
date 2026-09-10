import SystemNoteDetailPage from "@/app/components/SystemNoteDetailPage";
import { H125B3E_SYSTEM_NOTES } from "@/data/h125-as350-b3e/systemNotes";

export function generateStaticParams() {
  return H125B3E_SYSTEM_NOTES.map((n) => ({ slug: n.slug }));
}

export default async function H125B3ESystemNoteDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = H125B3E_SYSTEM_NOTES.find((n) => n.slug === slug);

  return <SystemNoteDetailPage note={note} />;
}
