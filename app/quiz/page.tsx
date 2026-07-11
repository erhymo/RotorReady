"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useActiveModelVariant } from "@/lib/models/hooks";
import TopBarBackButton from "@/components/TopBarBackButton";


type Section = { id: string; title: string; count?: number };

type SectionResponse = {
  sections?: Section[];
};

type LoadedSectionsState = {
  modelId: string;
  sections: Section[];
  error: string | null;
};

const STATIC_QUIZ_TYPES = [
  { href: "/limitations-quiz", title: "Limitations" },
  { href: "/quiz/normal_procedures", title: "Normal Procedures" },
  { href: "/quiz/air_law", title: "Air Law (EASA)" },
  {
    href: "/engine-systems-quiz",
    title: "Engine, Fuel, Lubricants, Hydraulics & System Limitations",
  },
  { href: "/avionics-fms-limitations-quiz", title: "Avionics & FMS Limitations" }
];
const SECTION_ROUTE_MAP: Record<string, string> = {
  limitations: "/limitations-quiz",
  avionics_fms_limitations: "/avionics-fms-limitations-quiz",
  emergency_procedures: "/emergency-quiz",
  "engine-systems": "/engine-systems-quiz",
};

function resolveSectionRoute(sectionId: string): string {
  return SECTION_ROUTE_MAP[sectionId] ?? `/quiz/${encodeURIComponent(sectionId)}`;
}

export default function QuizTypeSelectPage() {
  const { variant: activeVariant, loading: variantLoading } = useActiveModelVariant();
  const [loadedSections, setLoadedSections] = useState<LoadedSectionsState | null>(null);

  const dynamicVariant =
    !!activeVariant &&
    (activeVariant.productId === "H125" ||
      activeVariant.productId === "AW169" ||
      activeVariant.productId === "S92" ||
      activeVariant.productId === "H135_T3" ||
      activeVariant.productId === "H145_D2" ||
      activeVariant.productId === "H145_D3" ||
      activeVariant.id === "R44_II");

  const currentLoadedSections = loadedSections?.modelId === activeVariant.id ? loadedSections : null;
  const sections = currentLoadedSections?.sections ?? [];
  const error = currentLoadedSections?.error ?? null;

  useEffect(() => {
    if (!dynamicVariant || variantLoading) {
      return;
    }

    let cancelled = false;
    const modelId = activeVariant.id;
    const urls = [
      `/model-data/${modelId}/index.json`,
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
            setLoadedSections({ modelId, sections: data.sections, error: null });
            return;
          }
        } catch (err) {
          console.warn("Could not fetch sections", url, err);
        }
      }
      if (!cancelled) {
        setLoadedSections({ modelId, sections: [], error: "No sections found for the selected model" });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeVariant.id, variantLoading, dynamicVariant]);

  const pageLoading = dynamicVariant && (variantLoading || currentLoadedSections === null);

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
          <Link
            href="/quiz/all"
            className="block w-full rounded-xl border-l-4 border-blue-600 bg-blue-50/40 hover:bg-blue-600 hover:text-white dark:bg-zinc-900 dark:text-white dark:border-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition px-5 py-4 font-semibold"
          >
            All
          </Link>

        </div>
      </div>
    );
  }

  if (pageLoading) {
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
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Choose quiz type</h1>
        <Link href="/offline" className="text-xs px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700">
          Last ned for offline
        </Link>
      </div>
      <div className="space-y-4">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={resolveSectionRoute(section.id)}
            className="block w-full rounded-xl border-l-4 border-blue-600 bg-blue-50/40 hover:bg-blue-600 hover:text-white dark:bg-zinc-900 dark:text-white dark:border-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition px-5 py-4 font-semibold"
          >
            <span>{section.title}</span>
            {typeof section.count === "number" && (
              <span className="ml-2 text-xs font-normal opacity-70">{section.count} questions</span>
            )}
          </Link>
        ))}
        <Link
          href="/quiz/all"
          className="block w-full rounded-xl border-l-4 border-blue-600 bg-blue-50/40 hover:bg-blue-600 hover:text-white dark:bg-zinc-900 dark:text-white dark:border-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition px-5 py-4 font-semibold"
        >
          All
        </Link>
      </div>
    </div>
  );
}
