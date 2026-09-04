"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import AppTopBar from "@/components/AppTopBar";
import DownloadButton from "@/components/DownloadButton";
import { PauseIcon, PlayIcon, SkipBackIcon, SkipForwardIcon } from "@/components/Icons";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { useOfflineAudioSrc } from "@/lib/useOfflineAudioSrc";

type LightAudioItem = {
  lightId: string;
  title: string;
  filename: string;
  durationSeconds: number;
};

const PLAYBACK_RATES = [1, 1.25, 1.5, 1.75, 2];

function formatTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function LightAudioPlayerClient() {
  const params = useParams<{ lightId: string }>();
  const { variant: activeVariant } = useActiveModelVariant();
  const [item, setItem] = useState<LightAudioItem | null | undefined>(undefined);
  const [rate, setRate] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const networkUrl = item ? `/audio/${activeVariant.id}/lights/${item.filename}` : undefined;
  const playbackSrc = useOfflineAudioSrc(networkUrl);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setItem(undefined);
    });
    fetch(`/audio/${activeVariant.id}/lights/index.json`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        if (cancelled) return;
        const items: LightAudioItem[] = Array.isArray(data?.items) ? data.items : [];
        setItem(items.find((entry) => entry.lightId === params.lightId) ?? null);
      })
      .catch(() => {
        if (!cancelled) setItem(null);
      });
    return () => {
      cancelled = true;
    };
  }, [activeVariant.id, params.lightId]);

  useEffect(() => {
    queueMicrotask(() => {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    });
  }, [item?.lightId]);

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || 0);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const applyRate = (next: number) => {
    setRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const skip = (deltaSeconds: number) => {
    const el = audioRef.current;
    if (!el) return;
    const max = Number.isFinite(el.duration) ? el.duration : Infinity;
    el.currentTime = Math.min(Math.max(el.currentTime + deltaSeconds, 0), max);
    setCurrentTime(el.currentTime);
  };

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
    } else {
      el.pause();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el) return;
    const next = Number(e.target.value);
    el.currentTime = next;
    setCurrentTime(next);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar title="Light Audio" backHref="/training/lights/audio" backLabel="Back" />
      <div className="mx-auto max-w-2xl p-6 space-y-5">
        {item === undefined && (
          <div className="text-sm text-slate-500 dark:text-zinc-400">Loading…</div>
        )}

        {item === null && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            Couldn&apos;t find audio for this light on {activeVariant.label}.
          </div>
        )}

        {item && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                  {activeVariant.label}
                </div>
                <h1 className="mt-1 text-xl font-bold text-slate-900 dark:text-zinc-100">{item.title}</h1>
              </div>
              {networkUrl && <DownloadButton url={networkUrl} className="mt-1" />}
            </div>

            {playbackSrc && (
              <audio
                ref={audioRef}
                preload="metadata"
                controlsList="nodownload noplaybackrate"
                onContextMenu={(e) => e.preventDefault()}
                src={playbackSrc}
                onLoadedMetadata={handleLoadedMetadata}
                onDurationChange={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            )}

            <div className="mt-6">
              <div className="relative h-1.5 w-full rounded-full bg-slate-200 dark:bg-zinc-700">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-red-600 dark:bg-red-400"
                  style={{ width: `${progressPercent}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Seek"
                  className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-600 dark:[&::-webkit-slider-thumb]:bg-red-400"
                />
              </div>
              <div className="mt-1.5 flex justify-between text-xs text-slate-500 dark:text-zinc-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => skip(-15)}
                aria-label="Rewind 15 seconds"
                className="inline-flex items-center justify-center text-slate-600 transition hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white"
              >
                <SkipBackIcon className="h-9 w-9" />
              </button>
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="inline-grid h-16 w-16 place-items-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700 active:scale-95 dark:bg-red-500 dark:hover:bg-red-600"
              >
                {isPlaying ? <PauseIcon className="h-7 w-7" /> : <PlayIcon className="h-7 w-7 pl-0.5" />}
              </button>
              <button
                type="button"
                onClick={() => skip(15)}
                aria-label="Forward 15 seconds"
                className="inline-flex items-center justify-center text-slate-600 transition hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white"
              >
                <SkipForwardIcon className="h-9 w-9" />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Speed</span>
              {PLAYBACK_RATES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => applyRate(r)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition ${
                    rate === r
                      ? "border-red-600 bg-red-600 text-white"
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
