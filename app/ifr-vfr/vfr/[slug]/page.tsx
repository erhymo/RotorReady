import { notFound } from "next/navigation";
import { VFR_TOPICS, findTopic } from "@/lib/ifrVfr/data";
import TopicDetail from "@/app/ifr-vfr/TopicDetail";

export function generateStaticParams() {
  return VFR_TOPICS.map((t) => ({ slug: t.slug }));
}

export default async function VfrTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = findTopic(VFR_TOPICS, slug);
  if (!topic) notFound();

  return <TopicDetail topic={topic} category="VFR" listHref="/ifr-vfr/vfr" />;
}
