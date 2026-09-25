"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import AppTopBar from "@/components/AppTopBar";
import { contentUrl, fetchContentJson } from "@/lib/contentUrl";
import { renderInline, type InlineNode } from "@/lib/procedures/inline";

type Step = { left: string; right: InlineNode[] };
type Group = { heading?: string; steps: Step[] };

export type Procedure = {
  slug: string;
  title: string;
  subtitle?: string;
  reference: string;
  intro?: InlineNode[];
  warnings?: string[];
  cautions?: string[];
  groups: Group[];
  notes?: string[];
  image?: { src: string; alt: string; caption?: string };
  /**
   * RFM figures for this procedure. A separate field from `image` on purpose:
   * app versions released before it existed ignore it, so a figure added to the
   * content can never show up as a broken image in an older installed app.
   */
  figures?: Figure[];
};

type Figure = { src: string; alt: string; caption?: string; width?: number; height?: number };

/**
 * A figure from public/. In the native app it loads from the live site first, so a
 * figure published after the last store release still appears, and falls back to
 * the bundled copy at the same path when offline.
 */
function ProcedureFigure({ figure }: { figure: Figure }) {
  const [src, setSrc] = useState(() => contentUrl(figure.src));
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  // Opening pushes a history entry, so the Android back button (NativeBackButton
  // calls history.back()) and the browser's back close the figure instead of
  // leaving the procedure.
  useEffect(() => {
    if (!open) return;
    window.history.pushState({ rrFigure: true }, "");
    const onPop = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") window.history.back();
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  const onError = () => {
    if (src !== figure.src) setSrc(figure.src);
  };

  return (
    <figure className="rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700 p-2">
      <button
        type="button"
        onClick={() => {
          setZoomed(false);
          setOpen(true);
        }}
        className="block w-full"
        aria-label={`Open full screen: ${figure.caption ?? figure.alt}`}
      >
        <img
          src={src}
          alt={figure.alt}
          width={figure.width}
          height={figure.height}
          loading="lazy"
          className="w-full h-auto rounded-lg bg-white"
          onError={onError}
        />
      </button>
      <figcaption className="mt-1 text-center text-xs text-slate-500 dark:text-zinc-400">Tap to enlarge</figcaption>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={figure.caption ?? figure.alt}
          className="fixed inset-0 z-[1000] flex flex-col bg-white"
          style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-3 py-2">
            <span className="text-xs text-slate-600">{zoomed ? "Tap to fit the screen" : "Tap the figure to zoom"}</span>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-800 active:scale-95"
            >
              Close
            </button>
          </div>
          <div className={`flex-1 overflow-auto ${zoomed ? "" : "flex items-center justify-center"}`}>
            <img
              src={src}
              alt={figure.alt}
              width={figure.width}
              height={figure.height}
              onClick={() => setZoomed((z) => !z)}
              onError={onError}
              className={zoomed ? "max-w-none" : "max-h-full max-w-full object-contain"}
              style={zoomed ? { width: `${Math.max(figure.width ?? 1600, 1200) / 1.4}px` } : undefined}
            />
          </div>
        </div>
      )}
    </figure>
  );
}

type ProceduresDoc = { footerNote?: string; procedures?: Procedure[] };

/**
 * One procedure, chosen by `?slug=`. The content used to be JSX inside
 * lib/procedures/<model>/data.tsx — compiled into the bundle, and reachable only
 * through a per-procedure build-time route — so neither a correction nor a new
 * procedure could reach an installed native app without a store release.
 */
export default function ProcedureDetailPage({
  variantId,
  backHref,
}: {
  variantId: string;
  backHref: string;
}) {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const [doc, setDoc] = useState<ProceduresDoc | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setDoc(undefined);
    });
    fetchContentJson<ProceduresDoc>(`/procedures/${variantId}.json`)
      .then((json) => {
        if (!cancelled) setDoc(json);
      })
      .catch(() => {
        if (!cancelled) setDoc(null);
      });
    return () => {
      cancelled = true;
    };
  }, [variantId]);

  const procedure = doc?.procedures?.find((p) => p.slug === slug);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar title="Procedure" backHref={backHref} backLabel="Procedures" />
      <main className="mx-auto max-w-3xl p-6 space-y-6">
        {doc === undefined && <p className="text-sm text-slate-500 dark:text-zinc-400">Loading…</p>}

        {doc !== undefined && !procedure && (
          <div className="rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700 p-4">
            <div className="text-slate-900 dark:text-zinc-100 font-semibold mb-2">Procedure not found</div>
            <p className="text-sm text-slate-700 dark:text-zinc-300">
              Use the flight manual directly for reference.
            </p>
          </div>
        )}

        {procedure && (
          <>
            <header className="rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700 p-4">
              <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">{procedure.title}</h1>
              {procedure.subtitle && (
                <div className="mt-1 text-sm text-slate-600 dark:text-zinc-300">{procedure.subtitle}</div>
              )}
              {procedure.intro && (
                <p className="mt-3 text-sm text-slate-700 dark:text-zinc-300">{renderInline(procedure.intro)}</p>
              )}
            </header>

            {procedure.figures?.map((figure) => (
              <ProcedureFigure key={figure.src} figure={figure} />
            ))}

            {!procedure.figures?.length && procedure.image && (
              <figure className="rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={procedure.image.src} alt={procedure.image.alt} className="w-full h-auto rounded-lg" />
                {procedure.image.caption && (
                  <figcaption className="mt-2 text-xs text-slate-500 dark:text-zinc-400 text-center">
                    {procedure.image.caption}
                  </figcaption>
                )}
              </figure>
            )}

            {procedure.warnings?.map((w, i) => (
              <div
                key={i}
                className="rounded-xl border-2 border-red-600 bg-red-50 dark:bg-red-900/30 dark:border-red-500 p-4 text-sm text-red-900 dark:text-red-100"
              >
                <div className="font-bold text-center mb-1">WARNING</div>
                <p className="text-center">{w}</p>
              </div>
            ))}

            {procedure.cautions?.map((c, i) => (
              <div
                key={i}
                className="rounded-xl border-2 border-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-500 p-4 text-sm text-amber-900 dark:text-amber-100"
              >
                <div className="font-bold text-center mb-1">CAUTION</div>
                <p className="text-center">{c}</p>
              </div>
            ))}

            {procedure.groups.map((g, gi) => (
              <section key={gi} className="rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700 p-4">
                {g.heading && (
                  <div className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-zinc-200 mb-3">
                    {g.heading}
                  </div>
                )}
                <div className="divide-y divide-slate-200/70 dark:divide-zinc-700/60">
                  {g.steps.map((s, i) => (
                    <div key={i} className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-6 py-2">
                      <div className="text-sm text-slate-700 dark:text-zinc-300">
                        <span className="inline-block w-8 text-right mr-2">{s.left || "•"}</span>
                      </div>
                      <div className="text-sm text-slate-800 dark:text-zinc-100 sm:mt-0 mt-1">
                        {renderInline(s.right)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {procedure.notes && procedure.notes.length > 0 && (
              <section className="rounded-xl border-l-4 border-blue-500/60 bg-blue-50 dark:bg-zinc-800 dark:border-blue-400 p-4 space-y-2">
                <div className="font-semibold text-sm text-slate-900 dark:text-zinc-100">Note</div>
                {procedure.notes.map((n, i) => (
                  <p key={i} className="text-sm text-slate-800 dark:text-zinc-200">
                    {n}
                  </p>
                ))}
              </section>
            )}

            <p className="text-xs text-slate-500 dark:text-zinc-400">Source: {procedure.reference}</p>
            {doc?.footerNote && (
              <footer className="pt-2 text-center text-xs text-slate-500 dark:text-zinc-400">{doc.footerNote}</footer>
            )}
          </>
        )}
      </main>
    </div>
  );
}
