import { notFound } from "next/navigation";
import { AW189_PROCEDURES, findAW189Procedure } from "@/lib/aw189Procedures/data";
import ProcedureDetail from "@/app/aw189/procedures/ProcedureDetail";

export function generateStaticParams() {
  return AW189_PROCEDURES.map((p) => ({ slug: p.slug }));
}

export default async function AW189ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const procedure = findAW189Procedure(slug);
  if (!procedure) notFound();

  return <ProcedureDetail procedure={procedure} />;
}
