import { Suspense } from "react";

import { getQuizSectionIds } from "@/lib/build/staticParams";
import H125QuestionClient from "./H125QuestionClient";

// One static page per section for every question index, selected by `?n=`.
export function generateStaticParams() {
  return getQuizSectionIds().map((section) => ({ section }));
}

export default function H125QuestionPage() {
  return (
    <Suspense fallback={null}>
      <H125QuestionClient />
    </Suspense>
  );
}
