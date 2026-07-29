const CACHE_NAME = "rr-audio-offline-v1";

export function offlineDownloadsSupported(): boolean {
  return typeof window !== "undefined" && "caches" in window;
}

export async function isEpisodeDownloaded(url: string): Promise<boolean> {
  if (!offlineDownloadsSupported()) return false;
  try {
    const cache = await caches.open(CACHE_NAME);
    const match = await cache.match(url);
    return !!match;
  } catch {
    return false;
  }
}

export async function downloadEpisode(url: string): Promise<void> {
  if (!offlineDownloadsSupported()) return;
  const cache = await caches.open(CACHE_NAME);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
  await cache.put(url, response);
}

export async function removeDownloadedEpisode(url: string): Promise<void> {
  if (!offlineDownloadsSupported()) return;
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.delete(url);
  } catch {
    // ignore
  }
}

export async function getOfflineAudioBlobUrl(url: string): Promise<string | null> {
  if (!offlineDownloadsSupported()) return null;
  try {
    const cache = await caches.open(CACHE_NAME);
    const match = await cache.match(url);
    if (!match) return null;
    const blob = await match.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

export async function getDownloadedEpisodesSummary(): Promise<{ count: number; bytes: number }> {
  if (!offlineDownloadsSupported()) return { count: 0, bytes: 0 };
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    let bytes = 0;
    for (const request of requests) {
      const response = await cache.match(request);
      if (!response) continue;
      const blob = await response.clone().blob();
      bytes += blob.size;
    }
    return { count: requests.length, bytes };
  } catch {
    return { count: 0, bytes: 0 };
  }
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  if (mb < 1000) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}
