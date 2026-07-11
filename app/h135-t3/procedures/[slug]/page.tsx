import { notFound } from "next/navigation";
import { H135T3_PROCEDURES, findH135T3Procedure } from "@/lib/h135t3Procedures/data";
import ProcedureDetail from "@/app/h135-t3/procedures/ProcedureDetail";

export function generateStaticParams() {
  return H135T3_PROCEDURES.map((p) => ({ slug: p.slug }));
}

export default async function H135T3ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const procedure = findH135T3Procedure(slug);
  if (!procedure) notFound();

  return <ProcedureDetail procedure={procedure} />;
}
