"use client";

import { useEffect, useMemo, useState } from "react";

const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "rotorready2025";

type AdminFlag = {
  id: string;
  section: string;
  sectionId?: string;
  questionId: string;
  dataSource?: "sections" | "all-questions";
  dataFile?: string | null;
  snapshot?: {
    question?: string;
    options?: string[];
    explanation?: string;
    references?: string[];
    answer?: number[];
  };
  reason?: string;
  userId?: string;
  createdAt: string;
  status: "open" | "reviewed-OK" | "rejected";
};

export default function AdminPage() {
  const [flags, setFlags] = useState<AdminFlag[]>([]);
  const [flagsLoading, setFlagsLoading] = useState(true);
  const [flagsError, setFlagsError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  async function refreshFlags() {
    setFlagsLoading(true);
    try {
      const res = await fetch("/api/admin/flags", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setFlags(Array.isArray(data?.flags) ? data.flags : []);
      setFlagsError(null);
    } catch (error: any) {
      setFlagsError(error?.message || "Kunne ikke hente flaggede spørsmål");
    } finally {
      setFlagsLoading(false);
    }
  }

  useEffect(() => {
    refreshFlags();
  }, []);

  async function reviewFlag(id: string, status: "reviewed-OK" | "rejected") {
    const res = await fetch("/api/admin/flags/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) throw new Error("Kunne ikke oppdatere flaggstatus");
  }

  async function handleKeep(flag: AdminFlag) {
    setActionId(flag.id);
    try {
      await reviewFlag(flag.id, "reviewed-OK");
      setFlags((prev) => prev.map((f) => (f.id === flag.id ? { ...f, status: "reviewed-OK" } : f)));
    } catch (error: any) {
      setFlagsError(error?.message || "Klarte ikke å markere som beholdt");
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(flag: AdminFlag) {
    setActionId(flag.id);
    try {
      const res = await fetch("/api/admin/questions/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: flag.sectionId || flag.section || "all-questions",
          id: flag.questionId,
          dataSource: flag.dataSource,
          dataFile: flag.dataFile,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Klarte ikke å slette spørsmål");
      }
      await reviewFlag(flag.id, "rejected");
      setFlags((prev) => prev.map((f) => (f.id === flag.id ? { ...f, status: "rejected" } : f)));
    } catch (error: any) {
      setFlagsError(error?.message || "Klarte ikke å slette spørsmål");
    } finally {
      setActionId(null);
    }
  }

  const openFlags = useMemo(
    () => flags.filter((flag) => flag.status === "open").sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [flags],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-12 px-4">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Admin</h1>
          <p className="text-sm text-slate-600 dark:text-zinc-300">
            Gå gjennom flaggede spørsmål og administrer innholdet i RotorReady.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Flaggede spørsmål</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Spørsmål som er flagget fra quizer vises her for manuell vurdering.</p>
            </div>
            <button
              onClick={refreshFlags}
              disabled={flagsLoading}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Oppdater
            </button>
          </div>

          {flagsError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/30 dark:text-red-200">
              {flagsError}
            </div>
          )}

          {flagsLoading ? (
            <p className="mt-6 text-sm text-slate-600 dark:text-zinc-300">Laster flaggede spørsmål …</p>
          ) : openFlags.length === 0 ? (
            <p className="mt-6 text-sm text-slate-600 dark:text-zinc-300">Ingen åpne flagg akkurat nå.</p>
          ) : (
            <ul className="mt-6 space-y-4">
              {openFlags.map((flag) => {
                const snapshot = flag.snapshot || {};
                const answers = snapshot.answer || [];
                return (
                  <li
                    key={flag.id}
                    className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-400">{flag.section}</div>
                        <div className="text-sm text-slate-600 dark:text-zinc-300">ID: {flag.questionId}</div>
                      </div>
                      <div className="text-xs text-slate-400 dark:text-zinc-500">
                        {new Date(flag.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
                      {snapshot.question || "(Spørsmålstekst mangler)"}
                    </div>
                    {snapshot.options && snapshot.options.length > 0 && (
                      <ul className="mt-3 space-y-1 text-sm">
                        {snapshot.options.map((option, index) => {
                          const isCorrect = answers.includes(index);
                          return (
                            <li
                              key={index}
                              className={`rounded-lg border px-3 py-2 ${
                                isCorrect
                                  ? "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-900/40 dark:text-emerald-100"
                                  : "border-slate-200 text-slate-700 dark:border-zinc-700 dark:text-zinc-200"
                              }`}
                            >
                              <span className="mr-2 text-xs font-semibold opacity-60">{index + 1}.</span>
                              {option}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    {snapshot.explanation && (
                      <p className="mt-3 text-sm text-slate-600 dark:text-zinc-300">
                        Forklaring: {snapshot.explanation}
                      </p>
                    )}
                    {flag.reason && (
                      <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">Brukerkommentar: {flag.reason}</p>
                    )}
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                      <span>Kilde: {flag.dataSource === "all-questions" ? "Master (all-questions)" : (flag.sectionId || flag.section)}</span>
                      {flag.userId && <span>• Rapportert av: {flag.userId}</span>}
                      {flag.dataFile && <span>• Fil: {flag.dataFile}</span>}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleKeep(flag)}
                        disabled={actionId === flag.id}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                      >
                        Behold
                      </button>
                      <button
                        onClick={() => handleDelete(flag)}
                        disabled={actionId === flag.id}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                      >
                        Slett fra databasen
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Hurtigtilgang</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-zinc-300">
            <li>• Oppdater quiz-innhold og seksjoner</li>
            <li>• Se brukers tilbakemeldinger og flagg</li>
            <li>• Administrer Stripe/tilgang og nedlastinger</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Påloggingsinfo</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-zinc-300">
            Standard admin-bruker: <span className="font-mono">{ADMIN_USERNAME}</span>
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300">
            Standard passord: <span className="font-mono">{ADMIN_PASSWORD}</span>
          </p>
          <p className="mt-3 text-xs text-slate-500 dark:text-zinc-400">
            Tips: Sett miljøvariablene <span className="font-mono">NEXT_PUBLIC_ADMIN_USERNAME</span> og <span className="font-mono">NEXT_PUBLIC_ADMIN_PASSWORD</span> for å overstyre disse verdiene.
          </p>
        </section>

        <footer className="text-xs text-slate-500 dark:text-zinc-400">
          Flere verktøy og paneler kommer her etter hvert.
        </footer>
      </div>
    </div>
  );
}
