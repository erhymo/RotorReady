import { getQuizSectionIds } from "@/lib/build/staticParams";
import H125ResultClient from "./H125ResultClient";

export function generateStaticParams() {
  return getQuizSectionIds().map((section) => ({ section }));
}

export default function H125ResultPage() {
  return <H125ResultClient />;
}
