import { notFound } from "next/navigation";
import { R44_PROCEDURES, findR44Procedure } from "@/lib/r44Procedures/data";
import ProcedureDetail from "@/app/r44-ii/procedures/ProcedureDetail";

export function generateStaticParams() {
  return R44_PROCEDURES.map((p) => ({ slug: p.slug }));
}

export default async function R44ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const procedure = findR44Procedure(slug);
  if (!procedure) notFound();

  return <ProcedureDetail procedure={procedure} />;
}
