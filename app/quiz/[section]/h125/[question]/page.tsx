import { getQuizSectionIds, getQuestionIndexParams, getQuestionRangeForSection } from "@/lib/build/staticParams";
import H125QuestionClient from "./H125QuestionClient";

export function generateStaticParams() {
  return getQuizSectionIds().flatMap((section) =>
    getQuestionIndexParams("question", getQuestionRangeForSection(section)).map((q) => ({ section, ...q }))
  );
}

export default function H125QuestionPage() {
  return <H125QuestionClient />;
}
