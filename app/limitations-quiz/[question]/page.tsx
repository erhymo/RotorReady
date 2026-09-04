import { getQuestionIndexParams, getQuestionRangeForSection } from "@/lib/build/staticParams";
import LimitationsQuestionClient from "./LimitationsQuestionClient";

export function generateStaticParams() {
  return getQuestionIndexParams("question", getQuestionRangeForSection("limitations"));
}

export default function QuestionPage() {
  return <LimitationsQuestionClient />;
}
