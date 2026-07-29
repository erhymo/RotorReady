"use client";

import { useEffect, useState } from "react";

import { CheckCircleIcon, DownloadIcon } from "@/components/Icons";
import {
  downloadEpisode,
  isEpisodeDownloaded,
  offlineDownloadsSupported,
  removeDownloadedEpisode,
} from "@/lib/audioOffline";

type Status = "checking" | "not-downloaded" | "downloading" | "downloaded" | "error";

export default function DownloadButton({ url, className = "" }: { url: string; className?: string }) {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let cancelled = false;
    if (!offlineDownloadsSupported()) {
      queueMicrotask(() => {
        if (!cancelled) setStatus("not-downloaded");
      });
      return;
    }
    queueMicrotask(() => {
      if (!cancelled) setStatus("checking");
    });
    isEpisodeDownloaded(url).then((yes) => {
      if (!cancelled) setStatus(yes ? "downloaded" : "not-downloaded");
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (!offlineDownloadsSupported()) return null;

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (status === "checking" || status === "downloading") return;

    if (status === "downloaded") {
      await removeDownloadedEpisode(url);
      setStatus("not-downloaded");
      return;
    }

    setStatus("downloading");
    try {
      await downloadEpisode(url);
      setStatus("downloaded");
    } catch {
      setStatus("error");
    }
  };

  const label =
    status === "downloaded"
      ? "Downloaded — tap to remove"
      : status === "downloading"
      ? "Downloading…"
      : status === "error"
      ? "Download failed — tap to retry"
      : "Download for offline listening";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={status === "checking"}
      className={`inline-grid h-8 w-8 shrink-0 place-items-center rounded-lg transition disabled:opacity-40 ${
        status === "downloaded"
          ? "text-emerald-600 dark:text-emerald-400"
          : status === "error"
          ? "text-red-600 dark:text-red-400"
          : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100"
      } ${className}`}
    >
      {status === "downloading" ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 dark:border-zinc-600 dark:border-t-blue-400" />
      ) : status === "downloaded" ? (
        <CheckCircleIcon className="h-5 w-5" />
      ) : (
        <DownloadIcon className="h-5 w-5" />
      )}
    </button>
  );
}
