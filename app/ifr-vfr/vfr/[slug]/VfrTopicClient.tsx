"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchContentJson } from "@/lib/contentUrl";
import { findTopic, type RuleTopic } from "@/lib/ifrVfr/data";
import TopicDetail from "@/app/ifr-vfr/TopicDetail";

export default function VfrTopicClient() {
  const params = useParams<{ slug: string }>();
  const [topic, setTopic] = useState<RuleTopic | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetchContentJson<{ topics?: RuleTopic[] }>("/ifr-vfr/vfr.json")
      .then((data) => {
        if (cancelled) return;
        const topics = Array.isArray(data?.topics) ? data.topics : [];
        setTopic(findTopic(topics, params.slug) ?? null);
      })
      .catch(() => {
        if (!cancelled) setTopic(null);
      });
    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  if (topic === undefined) {
    return <div className="p-6 text-sm text-slate-500 dark:text-zinc-400">Loading…</div>;
  }
  if (topic === null) {
    return <div className="p-6 text-sm text-slate-500 dark:text-zinc-400">Topic not found.</div>;
  }
  return <TopicDetail topic={topic} category="VFR" listHref="/ifr-vfr/vfr" />;
}
