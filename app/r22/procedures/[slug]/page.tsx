import { notFound } from "next/navigation";
import { R22_PROCEDURES, findR22Procedure } from "@/lib/procedures/r22/data";
import ProcedureDetail from "@/app/r22/procedures/ProcedureDetail";

export function generateStaticParams() {
  return R22_PROCEDURES.map((p) => ({ slug: p.slug }));
}

export default async function R22ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const procedure = findR22Procedure(slug);
  if (!procedure) notFound();

  return <ProcedureDetail procedure={procedure} />;
}
