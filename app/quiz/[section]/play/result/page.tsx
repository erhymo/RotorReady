import { getQuizSectionIds } from "@/lib/build/staticParams";
import ResultClient from "./ResultClient";

export function generateStaticParams() {
  return getQuizSectionIds().map((section) => ({ section }));
}

export default function QuizResultPage() {
  return <ResultClient />;
}
