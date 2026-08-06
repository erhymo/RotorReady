"use client";

import { useRouter } from "next/navigation";

import type { SystemNote } from "@/data/aw169/systemNotes";

export default function SystemNoteDetailPage({ note }: { note: SystemNote | undefined }) {
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
          <h1 className="min-w-0 max-w-[60vw] truncate text-sm font-semibold tracking-widest opacity-80">
            {note?.title ?? "Not found"}
          </h1>
          <div className="w-[64px]" aria-hidden />
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto p-4 sm:p-6">
          {!note && (
            <p className="text-sm text-slate-500 dark:text-zinc-400 py-6 text-center">System note not found.</p>
          )}

          {note && (
            <article className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{note.title}</h2>
                {note.subtitle && (
                  <p className="mt-1.5 text-slate-600 dark:text-zinc-300">{note.subtitle}</p>
                )}
                <p className="mt-3 text-xs text-slate-400 dark:text-zinc-500">Source: {note.rfmReference}</p>
              </div>

              {note.sections.map((section, i) => (
                <section key={i} className="space-y-3">
                  {section.heading && (
                    <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-100">{section.heading}</h3>
                  )}
                  {section.paragraphs?.map((p, j) => (
                    <p key={j} className="text-sm leading-relaxed text-slate-700 dark:text-zinc-300">
                      {p}
                    </p>
                  ))}
                  {section.table && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-700">
                      {section.table.caption && (
                        <div className="border-b border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {section.table.caption}
                        </div>
                      )}
                      <table className="w-full text-sm tabular-nums">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-zinc-800">
                            {section.table.columns.map((col, k) => (
                              <th
                                key={k}
                                className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-zinc-200 whitespace-nowrap"
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-zinc-700">
                          {section.table.rows.map((row, r) => (
                            <tr key={r}>
                              {row.map((cell, c) => (
                                <td key={c} className="px-3 py-2 text-slate-700 dark:text-zinc-300 align-top">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {section.note && (
                    <div className="rounded-lg border-l-4 border-blue-300 bg-blue-50/60 px-3 py-2 text-xs leading-relaxed text-slate-700 dark:border-blue-500/50 dark:bg-blue-950/30 dark:text-zinc-300">
                      {section.note}
                    </div>
                  )}
                </section>
              ))}
            </article>
          )}
        </div>
      </main>
    </div>
  );
}
