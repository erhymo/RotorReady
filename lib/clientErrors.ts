"use client";

import { Capacitor } from "@capacitor/core";

import { apiUrl } from "@/lib/contentUrl";

// First-party crash reporting. An error a pilot hits on their phone used to be
// invisible: nothing reported it, and the native app has no server logs of its
// own. Reports go to /api/client-error, which groups them in Firestore, and
// show up in the admin dashboard under "Errors".
//
// Everything here is best-effort and must never affect the app: a failed report
// is dropped, not retried, and nothing is thrown back to the caller.

export type ClientErrorKind = "error" | "unhandledrejection" | "boundary";

// A page that throws in a loop must not turn into a flood of requests.
const MAX_REPORTS_PER_PAGE_LOAD = 10;
let sentCount = 0;
const seen = new Set<string>();

let appVersionPromise: Promise<string> | null = null;

// The native build number tells which store release the error came from, which
// decides whether a fix is already on its way or needs a new release.
function getAppVersion(): Promise<string> {
  if (!appVersionPromise) {
    appVersionPromise = (async () => {
      if (!Capacitor.isNativePlatform()) return "";
      try {
        const { App } = await import("@capacitor/app");
        const info = await App.getInfo();
        return `${info.version} (${info.build})`;
      } catch {
        return "";
      }
    })();
  }
  return appVersionPromise;
}

function describe(value: unknown): { message: string; stack: string } {
  if (value instanceof Error) {
    return { message: `${value.name}: ${value.message}`, stack: value.stack || "" };
  }
  if (typeof value === "string") return { message: value, stack: "" };
  try {
    return { message: JSON.stringify(value) ?? String(value), stack: "" };
  } catch {
    return { message: String(value), stack: "" };
  }
}

// Noise that says nothing about our code: errors from browser extensions,
// cross-origin scripts with their details hidden, and a benign layout warning
// Chrome reports as an error.
function isNoise(message: string, stack: string): boolean {
  if (/^Script error\.?$/.test(message.trim()) && !stack) return true;
  if (message.includes("ResizeObserver loop")) return true;
  if (/(chrome|moz|safari(-web)?)-extension:\/\//.test(stack)) return true;
  return false;
}

export function reportClientError(kind: ClientErrorKind, value: unknown, extra?: { digest?: string }) {
  try {
    if (process.env.NODE_ENV !== "production") return;
    if (sentCount >= MAX_REPORTS_PER_PAGE_LOAD) return;

    const { message, stack } = describe(value);
    if (!message || isNoise(message, stack)) return;

    const key = `${kind}|${message}|${stack.split("\n")[1] || ""}`;
    if (seen.has(key)) return;
    seen.add(key);
    sentCount += 1;

    void (async () => {
      try {
        await fetch(apiUrl("/api/client-error"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind,
            message,
            stack,
            digest: extra?.digest,
            path: window.location.pathname,
            platform: Capacitor.getPlatform(),
            appVersion: await getAppVersion(),
          }),
        });
      } catch {
        // No connection, or the server is down: drop it.
      }
    })();
  } catch {
    // Reporting must never be the thing that breaks the page.
  }
}

export function installGlobalErrorReporting(): () => void {
  const onError = (event: ErrorEvent) => {
    reportClientError("error", event.error ?? event.message);
  };
  const onRejection = (event: PromiseRejectionEvent) => {
    reportClientError("unhandledrejection", event.reason);
  };
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);
  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
  };
}
