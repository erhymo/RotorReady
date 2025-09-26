"use client";
import { useEffect, useMemo, useState } from "react";
import BackButton from "@/components/BackButton";
import { saveSectionOffline, loadSectionOffline, clearOfflineSection, listOffline } from "@/lib/offline";
import { isPaidAsync } from "@/lib/quota";
import { useRouter } from "next/navigation";

type Section = { id: string; title: string };

async function fetchSection(id: string) {
  const res = await fetch(`/quiz-data/sections/${id}.json`, { cache: "no-store" });
  if (!res.ok) throw new Error("Could not fetch section");
  return res.json();
}

async function fetchAvailableSections(): Promise<Section[]> {
  const res = await fetch("/quiz-data/index.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Kunne ikke hente seksjoner");
  const data = await res.json();
  return Array.isArray(data.sections) ? data.sections : [];
}

export default function OfflinePage() {
  const [status, setStatus] = useState<Record<string, string>>({});
  const [sections, setSections] = useState<Section[]>([]);
  const [offlineIds, setOfflineIds] = useState<string[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);
  const [sectionsError, setSectionsError] = useState<string | null>(null);
  const [access, setAccess] = useState<"checking" | "granted" | "denied">("checking");
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const paid = await isPaidAsync();
      if (cancelled) return;
      setAccess(paid ? "granted" : "denied");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      setOfflineIds(listOffline());
    } catch {
      setOfflineIds([]);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchAvailableSections()
      .then((items) => {
        if (!mounted) return;
        setSections(items);
      })
      .catch(() => {
        if (!mounted) return;
        setSectionsError("Kunne ikke laste tilgjengelige seksjoner");
      })
      .finally(() => {
        if (!mounted) return;
        setLoadingSections(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const availableIdSet = useMemo(() => new Set(sections.map((s) => s.id)), [sections]);
  const otherOfflineIds = useMemo(
    () => offlineIds.filter((id) => !availableIdSet.has(id)),
    [offlineIds, availableIdSet]
  );

  function refreshOfflineIds() {
    setOfflineIds(listOffline());
  }

  function updateStatus(id: string, message: string) {
    setStatus((prev) => ({ ...prev, [id]: message }));
  }

  async function downloadSectionOffline(section: Section) {
    updateStatus(section.id, `Laster ned "${section.title}"…`);
    try {
      const data = await fetchSection(section.id);
      saveSectionOffline(section.id, data);
      refreshOfflineIds();
      updateStatus(section.id, `✓ "${section.title}" lagret for offline bruk`);
    } catch (error) {
      console.warn("Kunne ikke laste ned seksjon offline", section.id, error);
      updateStatus(section.id, "❌ Klarte ikke å laste ned");
    }
  }

  function clearSectionOffline(section: Section) {
    clearOfflineSection(section.id);
    refreshOfflineIds();
    updateStatus(section.id, "Slettet lokale offline-data");
  }

  const readyForActions = access === "granted";
  const showContent = access !== "denied";

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Offline pakker</h1>
      {access === "checking" && (
        <div className="rounded-xl border border-dashed border-slate-400/50 bg-slate-50 dark:bg-zinc-900/40 p-4 text-sm text-slate-600 dark:text-zinc-300">
          Sjekker tilgang …
        </div>
      )}
      {access === "denied" && (
        <section className="rounded-xl border-l-4 border-amber-500 bg-amber-50/70 dark:border-amber-400 dark:bg-amber-900/30 p-4 space-y-3">
          <p className="font-semibold text-amber-900 dark:text-amber-200">Offline krever abonnement</p>
          <p className="text-sm text-amber-900/80 dark:text-amber-100/80">
            Logg inn med en betalt konto eller kjøp tilgang for å kunne laste ned pakker til offline bruk.
          </p>
          <div className="flex gap-3">
            <a
              href="/paywall?from=/offline"
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Se priser
            </a>
            <button
              onClick={() => router.refresh()}
              className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Prøv igjen
            </button>
          </div>
        </section>
      )}
      {showContent && (
        <>
          <section className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-zinc-100">Tilgjengelige seksjoner</h2>
            {loadingSections ? (
              <p className="text-sm text-slate-600 dark:text-zinc-300">Laster seksjoner…</p>
            ) : sectionsError ? (
              <p className="text-sm text-red-600 dark:text-red-400">{sectionsError}</p>
            ) : sections.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-zinc-300">Ingen seksjoner tilgjengelig for offline lagring.</p>
            ) : (
              <ul className="space-y-4">
                {sections.map((section) => {
                  const stored = offlineIds.includes(section.id);
                  return (
                    <li key={section.id} className="rounded-lg border border-slate-200 dark:border-zinc-800 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-zinc-100">{section.title}</p>
                          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-400">{section.id}</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => downloadSectionOffline(section)}
                            disabled={!readyForActions}
                            className="rounded bg-blue-600 text-white px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:bg-blue-400/60"
                          >
                            {readyForActions ? (stored ? "Oppdater" : "Last ned") : access === "checking" ? "Kontrollerer tilgang…" : "Ingen tilgang"}
                          </button>
                          {stored && (
                            <button
                              onClick={() => clearSectionOffline(section)}
                              disabled={!readyForActions}
                              className="rounded bg-gray-200 text-gray-800 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-800 dark:text-zinc-100"
                            >
                              Fjern
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-slate-500 dark:text-zinc-400">
                        {stored ? "Lagret lokalt" : "Ikke lagret"}
                        {status[section.id] && <span className="block mt-1">{status[section.id]}</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-emerald-900/40 p-4 mt-6">
            <h2 className="font-semibold mb-2">Andre seksjoner lagret offline</h2>
            {otherOfflineIds.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-zinc-300">Ingen andre seksjoner lagret foreløpig.</p>
            ) : (
              <ul className="list-disc ml-5 text-sm text-slate-700 dark:text-zinc-200">
                {otherOfflineIds.map((id) => (
                  <li key={id}>{id}</li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
