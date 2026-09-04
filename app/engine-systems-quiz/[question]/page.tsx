import { getQuestionIndexParams, getQuestionRangeForSection } from "@/lib/build/staticParams";
import EngineQuestionClient from "./EngineQuestionClient";

export function generateStaticParams() {
  return getQuestionIndexParams("question", getQuestionRangeForSection("engine-systems"));
}

export default function EngineQuestionPage() {
  return <EngineQuestionClient />;
}
