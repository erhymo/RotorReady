import { notFound } from "next/navigation";
import { H145D2_PROCEDURES, findH145D2Procedure } from "@/lib/h145d2Procedures/data";
import ProcedureDetail from "@/app/h145-d2/procedures/ProcedureDetail";

export function generateStaticParams() {
  return H145D2_PROCEDURES.map((p) => ({ slug: p.slug }));
}

export default async function H145D2ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const procedure = findH145D2Procedure(slug);
  if (!procedure) notFound();

  return <ProcedureDetail procedure={procedure} />;
}
