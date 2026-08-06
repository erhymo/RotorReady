"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import type { SystemNote } from "@/data/aw169/systemNotes";

export default function SystemNotesPage({
  title,
  basePath,
  data,
}: {
  title: string;
  basePath: string;
  data: SystemNote[];
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-900 dark:text-zinc-100">
      <header
        className="sticky z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border-b border-slate-200 dark:border-zinc-700"
        style={{ top: "calc(4rem + env(safe-area-inset-top, 0px))" }}
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="px-3 py-1 rounded border text-sm bg-white hover:bg-slate-50 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700"
          >
            Close
          </button>
          <h1 className="text-sm font-semibold tracking-widest opacity-80">{title}</h1>
          <div className="w-[64px]" aria-hidden />
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto p-4 space-y-3">
          {data.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-zinc-400 px-1 py-6 text-center">
              No system notes for this variant yet.
            </p>
          )}
          {data.map((note) => (
            <Link
              key={note.slug}
              href={`${basePath}/${note.slug}`}
              prefetch={false}
              className="group block rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 dark:text-zinc-100">{note.title}</div>
                  {note.subtitle && (
                    <div className="mt-0.5 text-sm text-slate-600 dark:text-zinc-300">{note.subtitle}</div>
                  )}
                </div>
                <div className="shrink-0 text-slate-400 text-xl transition-transform group-hover:translate-x-0.5 dark:text-zinc-500">
                  ›
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
