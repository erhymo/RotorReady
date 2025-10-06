"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useActiveModelVariant } from "@/lib/models/hooks";
import TopBarBackButton from "@/components/TopBarBackButton";

type Section = { id: string; title: string };

type SectionResponse = {
  sections?: Section[];
};

const STATIC_QUIZ_TYPES = [
  { href: "/limitations-quiz", title: "Limitations" },
  { href: "/performance-quiz", title: "Performance" },
  { href: "/procedures-quiz", title: "Procedures" },
  {
    href: "/engine-systems-quiz",
    title: "Engine, Fuel, Lubricants, Hydraulics & System Limitations",
  },
  { href: "/avionics-fms-limitations-quiz", title: "Avionics & FMS Limitations" },
];

const SECTION_ROUTE_MAP: Record<string, string> = {
  limitations: "/limitations-quiz",
  avionics_fms_limitations: "/avionics-fms-limitations-quiz",
  emergency_procedures: "/emergency-quiz",
};

function resolveSectionRoute(sectionId: string): string {
  return SECTION_ROUTE_MAP[sectionId] ?? `/quiz/${encodeURIComponent(sectionId)}`;
}

export default function QuizTypeSelectPage() {
  const { variant: activeVariant, loading: variantLoading } = useActiveModelVariant();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dynamicVariant = activeVariant.productId === "H125";

  useEffect(() => {
    if (!dynamicVariant || variantLoading) {
      setSections([]);
      setLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const urls = [
      `/model-data/${activeVariant.id}/index.json`,
      "/quiz-data/index.json",
    ];
    (async () => {
      for (const url of urls) {
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) continue;
          const data: SectionResponse = await res.json();
          if (!Array.isArray(data.sections)) continue;
          if (!cancelled) {
            setSections(data.sections);
            setError(null);
            return;
          }
        } catch (err) {
          console.warn("Could not fetch sections", url, err);
        }
      }
      if (!cancelled) {
        setSections([]);
        setError("No sections found for the selected model");
      }
    })().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [activeVariant.id, variantLoading, dynamicVariant]);

  if (!dynamicVariant) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-8 rounded-xl border-l-4 border-blue-600 bg-white dark:border-blue-400 dark:bg-zinc-900">
        <div className="mb-2"><TopBarBackButton href="/" /></div>
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
          Choose quiz type
        </h1>
        <div className="space-y-4">
          {STATIC_QUIZ_TYPES.map((quiz) => (
            <Link
              key={quiz.href}
              href={quiz.href}
              className="block w-full rounded-xl border-l-4 border-blue-600 bg-blue-50/40 hover:bg-blue-600 hover:text-white dark:bg-zinc-900 dark:text-white dark:border-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition px-5 py-4 font-semibold"
            >
              {quiz.title}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="max-w-2xl mx-auto p-6">Loading sections …</div>;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (!sections.length) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 p-6 text-center text-slate-600 dark:text-zinc-300">
          No sections available for {activeVariant.label} yet.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 rounded-xl border-l-4 border-blue-600 bg-white dark:border-blue-400 dark:bg-zinc-900">
      <div className="mb-2"><TopBarBackButton href="/" /></div>
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
        Choose quiz type
      </h1>
      <div className="space-y-4">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={resolveSectionRoute(section.id)}
            className="block w-full rounded-xl border-l-4 border-blue-600 bg-blue-50/40 hover:bg-blue-600 hover:text-white dark:bg-zinc-900 dark:text-white dark:border-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition px-5 py-4 font-semibold"
          >
            {section.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
