import { Suspense } from "react";

import { getQuizSectionIds } from "@/lib/build/staticParams";
import QuestionClient from "./QuestionClient";

// One static page per section for every question index, selected by `?n=`.
export function generateStaticParams() {
  return getQuizSectionIds().map((section) => ({ section }));
}

export default function QuizQuestionPage() {
  return (
    <Suspense fallback={null}>
      <QuestionClient />
    </Suspense>
  );
}
