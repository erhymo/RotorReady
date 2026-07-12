import { notFound } from "next/navigation";
import { H145D3_PROCEDURES, findH145D3Procedure } from "@/lib/h145d3Procedures/data";
import ProcedureDetail from "@/app/h145-d3/procedures/ProcedureDetail";

export function generateStaticParams() {
  return H145D3_PROCEDURES.map((p) => ({ slug: p.slug }));
}

export default async function H145D3ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const procedure = findH145D3Procedure(slug);
  if (!procedure) notFound();

  return <ProcedureDetail procedure={procedure} />;
}
