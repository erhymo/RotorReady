import { getQuizSectionIds } from "@/lib/build/staticParams";
import SectionClient from "./SectionClient";

export function generateStaticParams() {
  return getQuizSectionIds().map((section) => ({ section }));
}

export default function SectionPage() {
  return <SectionClient />;
}
