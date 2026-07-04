import { notFound } from "next/navigation";
import { IFR_TOPICS, findTopic } from "@/lib/ifrVfr/data";
import TopicDetail from "@/app/ifr-vfr/TopicDetail";

export function generateStaticParams() {
  return IFR_TOPICS.map((t) => ({ slug: t.slug }));
}

export default async function IfrTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = findTopic(IFR_TOPICS, slug);
  if (!topic) notFound();

  return <TopicDetail topic={topic} category="IFR" listHref="/ifr-vfr/ifr" />;
}
