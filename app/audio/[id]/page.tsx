"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import AppTopBar from "@/components/AppTopBar";
import { SkipBackIcon, SkipForwardIcon } from "@/components/Icons";
import { useActiveModelVariant } from "@/lib/models/hooks";

type AudioItem = {
  id: string;
  title: string;
  description: string;
  filename: string;
  durationSeconds: number;
};

const PLAYBACK_RATES = [1, 1.25, 1.5, 1.75, 2];

function resumeKey(variantId: string, itemId: string) {
  return `rr_audio_pos_${variantId}_${itemId}`;
}

export default function AudioPlayerPage() {
  const params = useParams<{ id: string }>();
  const { variant: activeVariant } = useActiveModelVariant();
  const [item, setItem] = useState<AudioItem | null | undefined>(undefined);
  const [rate, setRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resumedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setItem(undefined);
    });
    fetch(`/audio/${activeVariant.id}/index.json`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        if (cancelled) return;
        const items: AudioItem[] = Array.isArray(data?.items) ? data.items : [];
        setItem(items.find((entry) => entry.id === params.id) ?? null);
      })
      .catch(() => {
        if (!cancelled) setItem(null);
      });
    return () => {
      cancelled = true;
    };
  }, [activeVariant.id, params.id]);

  useEffect(() => {
    resumedRef.current = false;
  }, [item?.id]);

  const handleLoadedMetadata = () => {
    if (!item || resumedRef.current) return;
    resumedRef.current = true;
    const saved = Number(window.localStorage.getItem(resumeKey(activeVariant.id, item.id)) || 0);
    if (audioRef.current && saved > 0 && saved < audioRef.current.duration - 5) {
      audioRef.current.currentTime = saved;
    }
  };

  const handleTimeUpdate = () => {
    if (!item || !audioRef.current) return;
    window.localStorage.setItem(resumeKey(activeVariant.id, item.id), String(audioRef.current.currentTime));
  };

  const applyRate = (next: number) => {
    setRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const skip = (deltaSeconds: number) => {
    const el = audioRef.current;
    if (!el) return;
    const duration = Number.isFinite(el.duration) ? el.duration : Infinity;
    el.currentTime = Math.min(Math.max(el.currentTime + deltaSeconds, 0), duration);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar title="Audio" backHref="/audio" />
      <div className="mx-auto max-w-2xl p-6 space-y-5">
        {item === undefined && (
          <div className="text-sm text-slate-500 dark:text-zinc-400">Loading…</div>
        )}

        {item === null && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            Couldn&apos;t find this audio session for {activeVariant.label}.
          </div>
        )}

        {item && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <div className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              {activeVariant.label}
            </div>
            <h1 className="mt-1 text-xl font-bold text-slate-900 dark:text-zinc-100">{item.title}</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-zinc-300">{item.description}</p>

            <audio
              ref={audioRef}
              controls
              preload="metadata"
              className="mt-5 w-full"
              src={`/audio/${activeVariant.id}/${item.filename}`}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
            />

            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => skip(-15)}
                aria-label="Rewind 15 seconds"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                <SkipBackIcon className="h-4 w-4" />
                15s
              </button>
              <button
                type="button"
                onClick={() => skip(15)}
                aria-label="Forward 15 seconds"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                15s
                <SkipForwardIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Speed</span>
              {PLAYBACK_RATES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => applyRate(r)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition ${
                    rate === r
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {r}x
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
