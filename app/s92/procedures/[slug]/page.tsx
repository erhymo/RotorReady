import { notFound } from "next/navigation";
import { S92_PROCEDURES, findS92Procedure } from "@/lib/s92Procedures/data";
import ProcedureDetail from "@/app/s92/procedures/ProcedureDetail";

export function generateStaticParams() {
  return S92_PROCEDURES.map((p) => ({ slug: p.slug }));
}

export default async function S92ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const procedure = findS92Procedure(slug);
  if (!procedure) notFound();

  return <ProcedureDetail procedure={procedure} />;
}
