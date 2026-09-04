import { getQuestionIndexParams, getQuestionRangeForSection } from "@/lib/build/staticParams";
import EmergencyQuestionClient from "./EmergencyQuestionClient";

export function generateStaticParams() {
  return getQuestionIndexParams("question", getQuestionRangeForSection("emergency_procedures"));
}

export default function EmergencyQuestionPage() {
  return <EmergencyQuestionClient />;
}
