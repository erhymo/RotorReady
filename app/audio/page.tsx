"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import AppTopBar from "@/components/AppTopBar";
import DownloadButton from "@/components/DownloadButton";
import { HeadphonesIcon } from "@/components/Icons";
import { formatBytes, getDownloadedEpisodesSummary, offlineDownloadsSupported } from "@/lib/audioOffline";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { isUnlockFlagSet } from "@/lib/unlockCodes";

type AudioItem = {
  id: string;
  title: string;
  description: string;
  filename: string;
  durationSeconds: number;
  unlockFlag?: string;
  /** Optional grouping key — consecutive items sharing one collapse under a single expandable row. */
  group?: string;
};

type Row =
  | { kind: "single"; item: AudioItem }
  | { kind: "group"; name: string; items: AudioItem[] };

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** Fold consecutive items with the same `group` into one group row; leave the rest flat. Order follows index.json. */
function toRows(items: AudioItem[]): Row[] {
  const rows: Row[] = [];
  for (const item of items) {
    const g = item.group?.trim();
    if (!g) {
      rows.push({ kind: "single", item });
      continue;
    }
    const last = rows[rows.length - 1];
    if (last && last.kind === "group" && last.name === g) {
      last.items.push(item);
    } else {
      rows.push({ kind: "group", name: g, items: [item] });
    }
  }
  return rows;
}

function EpisodeLink({ activeVariantId, item, nested }: { activeVariantId: string; item: AudioItem; nested?: boolean }) {
  return (
    <Link
      key={item.id}
      href={`/audio/${encodeURIComponent(item.id)}`}
      prefetch={false}
      className={
        nested
          ? "group block w-full rounded-lg border-l-2 border-blue-300 bg-white transition hover:bg-blue-50 dark:border-blue-500/60 dark:bg-zinc-900 dark:hover:bg-blue-900/40"
          : "group block w-full rounded-xl border-l-4 border-blue-600 bg-blue-50/40 transition hover:bg-blue-50 dark:border-blue-400 dark:bg-blue-900/40 dark:hover:bg-blue-900/60"
      }
    >
      <div className={`flex items-start justify-between gap-4 ${nested ? "px-4 py-3" : "px-5 py-4"}`}>
        <div className="flex items-start gap-3">
          {!nested && (
            <span className="inline-grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/70 text-slate-700 dark:bg-zinc-900/80 dark:text-zinc-100">
              <HeadphonesIcon className="h-4 w-4" />
            </span>
          )}
          <div>
            <div className="font-semibold text-slate-900 dark:text-zinc-100">{item.title}</div>
            <div className="mt-0.5 text-sm text-slate-600 dark:text-zinc-300">{item.description}</div>
            <div className="mt-1 text-xs text-slate-500 dark:text-zinc-400">{formatDuration(item.durationSeconds)}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <DownloadButton url={`/audio/${activeVariantId}/${item.filename}`} />
          <div className="text-xl text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-400">›</div>
        </div>
      </div>
    </Link>
  );
}

export default function AudioListPage() {
  const { variant: activeVariant } = useActiveModelVariant();
  const [items, setItems] = useState<AudioItem[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [downloadSummary, setDownloadSummary] = useState<{ count: number; bytes: number } | null>(null);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const refreshDownloadSummary = useCallback(() => {
    if (!offlineDownloadsSupported()) return;
    getDownloadedEpisodesSummary().then(setDownloadSummary);
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setItems(null);
      setLoadFailed(false);
      setOpenGroups(new Set());
    });
    // Deliberately no `cache: "no-store"` here: the server already sends
    // `Cache-Control: max-age=0, must-revalidate` so a plain fetch always
    // revalidates over the network when online. `no-store` used to be set
    // explicitly, but it stops the service worker's own NetworkFirst
    // strategy (see next.config.mjs "audio-json") from ever persisting a
    // copy of the response for the offline fallback — meaning the episode
    // list could never actually work offline, even after a prior online
    // visit and even after episodes were downloaded for offline playback.
    fetch(`/audio/${activeVariant.id}/index.json`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const allItems: AudioItem[] = Array.isArray(data?.items) ? data.items : [];
        const visible = allItems.filter((item) => !item.unlockFlag || isUnlockFlagSet(item.unlockFlag));
        setItems(visible);
      })
      .catch(() => {
        if (!cancelled) {
          setItems([]);
          setLoadFailed(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activeVariant.id]);

  useEffect(() => {
    refreshDownloadSummary();
  }, [refreshDownloadSummary, items]);

  const rows = useMemo(() => (items ? toRows(items) : []), [items]);

  const toggleGroup = (name: string) =>
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar title="Audio" backHref="/" />
      <div className="mx-auto max-w-5xl p-6 space-y-4">
        <p className="text-sm text-slate-600 dark:text-zinc-300">
          Deep-dive audio study sessions for {activeVariant.label}. Listen while you drive, fly or commute.
        </p>

        {items === null && (
          <div className="text-sm text-slate-500 dark:text-zinc-400">Loading…</div>
        )}

        {items !== null && items.length === 0 && !loadFailed && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            No audio content yet for {activeVariant.label}. Check back soon.
          </div>
        )}

        {items !== null && items.length > 0 && (
          <div className="space-y-3" onClickCapture={() => setTimeout(refreshDownloadSummary, 300)}>
            {rows.map((row) => {
              if (row.kind === "single") {
                return <EpisodeLink key={row.item.id} activeVariantId={activeVariant.id} item={row.item} />;
              }
              const open = openGroups.has(row.name);
              const total = row.items.reduce((s, it) => s + (it.durationSeconds || 0), 0);
              return (
                <div key={`group:${row.name}`} className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-blue-900/40">
                  <button
                    type="button"
                    onClick={() => toggleGroup(row.name)}
                    aria-expanded={open}
                    className="group flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition hover:bg-blue-50 dark:hover:bg-blue-900/60 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/70 text-slate-700 dark:bg-zinc-900/80 dark:text-zinc-100">
                        <HeadphonesIcon className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-zinc-100">{row.name}</div>
                        <div className="mt-0.5 text-sm text-slate-600 dark:text-zinc-300">
                          {row.items.length} part{row.items.length === 1 ? "" : "s"} · {formatDuration(total)} total
                        </div>
                      </div>
                    </div>
                    <div className={`text-xl text-slate-400 transition-transform dark:text-zinc-400 ${open ? "rotate-90" : ""}`}>›</div>
                  </button>
                  {open && (
                    <div className="space-y-2 px-3 pb-3">
                      {row.items.map((it) => (
                        <EpisodeLink key={it.id} activeVariantId={activeVariant.id} item={it} nested />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {downloadSummary && downloadSummary.count > 0 && (
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            {downloadSummary.count} episode{downloadSummary.count === 1 ? "" : "s"} downloaded — {formatBytes(downloadSummary.bytes)} used on this device.
          </p>
        )}
      </div>
    </div>
  );
}
