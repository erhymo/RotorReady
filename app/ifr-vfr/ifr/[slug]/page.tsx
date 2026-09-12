import { getIfrTopicSlugs } from "@/lib/build/staticParams";
import IfrTopicClient from "./IfrTopicClient";

export function generateStaticParams() {
  return getIfrTopicSlugs().map((slug) => ({ slug }));
}

export default function IfrTopicPage() {
  return <IfrTopicClient />;
}
