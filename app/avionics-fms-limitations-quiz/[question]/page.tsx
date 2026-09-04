import { getQuestionIndexParams, getQuestionRangeForSection } from "@/lib/build/staticParams";
import AvionicsQuestionClient from "./AvionicsQuestionClient";

export function generateStaticParams() {
  return getQuestionIndexParams("question", getQuestionRangeForSection("avionics_fms_limitations"));
}

export default function AvionicsQuestionPage() {
  return <AvionicsQuestionClient />;
}
