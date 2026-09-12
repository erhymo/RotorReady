import { getVfrTopicSlugs } from "@/lib/build/staticParams";
import VfrTopicClient from "./VfrTopicClient";

export function generateStaticParams() {
  return getVfrTopicSlugs().map((slug) => ({ slug }));
}

export default function VfrTopicPage() {
  return <VfrTopicClient />;
}
