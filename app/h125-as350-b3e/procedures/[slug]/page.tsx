import { PROCEDURES } from "./proceduresData";
import ProcedureClient from "./ProcedureClient";

export function generateStaticParams() {
  return Object.keys(PROCEDURES).map((slug) => ({ slug }));
}

export default function H125AS350B3eProcedurePage() {
  return <ProcedureClient />;
}
