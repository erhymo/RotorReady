"use client";

import { useCallback, useEffect, useState } from "react";
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
};

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function AudioListPage() {
  const { variant: activeVariant } = useActiveModelVariant();
  const [items, setItems] = useState<AudioItem[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [downloadSummary, setDownloadSummary] = useState<{ count: number; bytes: number } | null>(null);

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
    });
    fetch(`/audio/${activeVariant.id}/index.json`, { cache: "no-store" })
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
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/audio/${encodeURIComponent(item.id)}`}
                prefetch={false}
                className="group block w-full rounded-xl border-l-4 border-blue-600 bg-blue-50/40 transition hover:bg-blue-50 dark:border-blue-400 dark:bg-blue-900/40 dark:hover:bg-blue-900/60"
              >
                <div className="flex items-start justify-between gap-4 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <span className="inline-grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/70 text-slate-700 dark:bg-zinc-900/80 dark:text-zinc-100">
                      <HeadphonesIcon className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-zinc-100">{item.title}</div>
                      <div className="mt-0.5 text-sm text-slate-600 dark:text-zinc-300">{item.description}</div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-zinc-400">{formatDuration(item.durationSeconds)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <DownloadButton url={`/audio/${activeVariant.id}/${item.filename}`} />
                    <div className="text-xl text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-400">›</div>
                  </div>
                </div>
              </Link>
            ))}
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
