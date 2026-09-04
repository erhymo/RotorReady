import { getQuizSectionIds, QUIZ_AMOUNT_TOKENS } from "@/lib/build/staticParams";
import ClientQuizPageEntry from "./ClientQuizPageEntry";

export function generateStaticParams() {
  const sections = getQuizSectionIds();
  return sections.flatMap((section) => QUIZ_AMOUNT_TOKENS.map((amount) => ({ section, amount })));
}

export default function QuizPage() {
  return <ClientQuizPageEntry />;
}
