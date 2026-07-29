"use client";

import { useEffect, useState } from "react";

import { getOfflineAudioBlobUrl } from "@/lib/audioOffline";

/**
 * Resolves to the downloaded blob URL if this episode was saved for offline listening,
 * otherwise falls back to the normal network URL. Returns undefined while resolving.
 */
export function useOfflineAudioSrc(networkUrl: string | undefined): string | undefined {
  const [src, setSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    if (!networkUrl) {
      queueMicrotask(() => {
        if (!cancelled) setSrc(undefined);
      });
      return;
    }

    queueMicrotask(() => {
      if (!cancelled) setSrc(undefined);
    });
    getOfflineAudioBlobUrl(networkUrl).then((offlineUrl) => {
      if (cancelled) return;
      if (offlineUrl) {
        objectUrl = offlineUrl;
        setSrc(offlineUrl);
      } else {
        setSrc(networkUrl);
      }
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [networkUrl]);

  return src;
}
