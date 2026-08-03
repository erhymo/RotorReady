import { notFound } from "next/navigation";
import { AW139_PROCEDURES, findAW139Procedure } from "@/lib/aw139Procedures/data";
import ProcedureDetail from "@/app/aw139/procedures/ProcedureDetail";

export function generateStaticParams() {
  return AW139_PROCEDURES.map((p) => ({ slug: p.slug }));
}

export default async function AW139ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const procedure = findAW139Procedure(slug);
  if (!procedure) notFound();

  return <ProcedureDetail procedure={procedure} />;
}
