"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { applyTheme, getStoredTheme, setStoredTheme, getThemeSource, setThemeSource, type Theme, type ThemeSource } from "@/lib/theme";

function readThemeDebugSnapshot() {
  if (typeof window === "undefined") {
    return {
      stored: null as Theme | null,
      source: null as ThemeSource | null,
      htmlDark: false,
      bodyDark: false,
      prefersDark: false,
    };
  }

  return {
    stored: getStoredTheme(),
    source: getThemeSource(),
    htmlDark: document.documentElement.classList.contains("dark"),
    bodyDark: document.body?.classList.contains("dark") || false,
    prefersDark: window.matchMedia("(prefers-color-scheme: dark)").matches,
  };
}

export default function ThemeDebugBadge() {
  const pathname = usePathname();
  const initialSnapshot = readThemeDebugSnapshot();
  const [stored, setStored] = useState<Theme | null>(initialSnapshot.stored);
  const [source, setSource] = useState<ThemeSource | null>(initialSnapshot.source);
  const [htmlDark, setHtmlDark] = useState(initialSnapshot.htmlDark);
  const [bodyDark, setBodyDark] = useState(initialSnapshot.bodyDark);
  const [prefersDark, setPrefersDark] = useState(initialSnapshot.prefersDark);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme" || e.key === "theme_source") {
        const snapshot = readThemeDebugSnapshot();
        setStored(snapshot.stored);
        setSource(snapshot.source);
        setHtmlDark(snapshot.htmlDark);
        setBodyDark(snapshot.bodyDark);
        setPrefersDark(snapshot.prefersDark);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Always show for now to help debugging across pages
  // Previously hidden unless path === "/account".

  const force = (theme: Theme) => {
    setThemeSource("manual");
    setStoredTheme(theme);
    applyTheme(theme);
    setStored(theme);
    setSource("manual");
    setHtmlDark(document.documentElement.classList.contains("dark"));
    setBodyDark(document.body?.classList.contains("dark") || false);
  };

  const useSystem = () => {
    setThemeSource("system");
    // apply immediately based on current OS
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
    setSource("system");
    setHtmlDark(document.documentElement.classList.contains("dark"));
    setBodyDark(document.body?.classList.contains("dark") || false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg border border-slate-300 bg-white/90 backdrop-blur px-3 py-2 text-xs text-slate-700 shadow dark:border-zinc-700 dark:bg-zinc-800/90 dark:text-zinc-200">
      <div className="font-semibold mb-1">Theme Debug</div>
      <div className="mb-1 text-[10px] opacity-70">path: {pathname || "(loading)"}</div>
      <div>stored: <span className="font-mono">{stored ?? "(none)"}</span></div>
      <div>source: <span className="font-mono">{source ?? "(none)"}</span></div>
      <div>html.dark: {htmlDark ? "true" : "false"}</div>
      <div>body.dark: {bodyDark ? "true" : "false"}</div>
      <div>prefers-dark: {prefersDark ? "true" : "false"}</div>
      <div className="mt-2 flex gap-2">
        <button onClick={() => force("light")} className="rounded border px-2 py-1 hover:bg-slate-100 dark:hover:bg-zinc-700">Force light</button>
        <button onClick={() => force("dark")} className="rounded border px-2 py-1 hover:bg-slate-100 dark:hover:bg-zinc-700">Force dark</button>
        <button onClick={useSystem} className="rounded border px-2 py-1 hover:bg-slate-100 dark:hover:bg-zinc-700">Use system</button>
      </div>
    </div>
  );
}

