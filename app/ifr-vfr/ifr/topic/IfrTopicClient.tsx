"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchContentJson } from "@/lib/contentUrl";
import { findTopic, type RuleTopic } from "@/lib/ifrVfr/data";
import TopicDetail from "@/app/ifr-vfr/TopicDetail";

// Topic slug comes from `?slug=` rather than a dynamic route segment, so this one
// bundled page serves every topic — including ones added after the last native
// build. See app/audio/play/AudioPlayerClient.tsx for the full reasoning.
export default function IfrTopicClient() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const [topic, setTopic] = useState<RuleTopic | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetchContentJson<{ topics?: RuleTopic[] }>("/ifr-vfr/ifr.json")
      .then((data) => {
        if (cancelled) return;
        const topics = Array.isArray(data?.topics) ? data.topics : [];
        setTopic(findTopic(topics, slug) ?? null);
      })
      .catch(() => {
        if (!cancelled) setTopic(null);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (topic === undefined) {
    return <div className="p-6 text-sm text-slate-500 dark:text-zinc-400">Loading…</div>;
  }
  if (topic === null) {
    return <div className="p-6 text-sm text-slate-500 dark:text-zinc-400">Topic not found.</div>;
  }
  return <TopicDetail topic={topic} category="IFR" listHref="/ifr-vfr/ifr" />;
}
