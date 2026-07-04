"use client";

import AppTopBar from "@/components/AppTopBar";
import type { RuleTopic } from "@/lib/ifrVfr/data";

export default function TopicDetail(props: { topic: RuleTopic; category: "IFR" | "VFR"; listHref: string }) {
  const { topic, category, listHref } = props;
  const accent = category === "VFR" ? "border-emerald-600 dark:border-emerald-400" : "border-blue-600 dark:border-blue-400";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar title={category} backHref={listHref} backLabel={category} />
      <main className="mx-auto max-w-2xl p-6 space-y-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">{topic.title}</h1>
        {topic.intro && <p className="text-sm text-slate-600 dark:text-zinc-300">{topic.intro}</p>}
        <div className={`rounded-xl border-l-4 ${accent} bg-white dark:bg-zinc-800 p-5 shadow-sm space-y-5`}>
          {topic.groups.map((g, i) => (
            <div key={i} className="space-y-2">
              {g.heading && <div className="font-semibold text-slate-900 dark:text-zinc-100 text-sm uppercase tracking-wide">{g.heading}</div>}
              <ul className="list-disc pl-5 space-y-1.5 text-[15px] leading-relaxed text-slate-800 dark:text-zinc-200">
                {g.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-zinc-400">Source: {topic.reference}</p>
      </main>
    </div>
  );
}
