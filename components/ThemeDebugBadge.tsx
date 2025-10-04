"use client";

import { useEffect, useState } from "react";
import { applyTheme, getStoredTheme, setStoredTheme, getThemeSource, setThemeSource, type Theme, type ThemeSource } from "@/lib/theme";

export default function ThemeDebugBadge() {
  const [stored, setStored] = useState<Theme | null>(null);
  const [source, setSource] = useState<ThemeSource | null>(null);
  const [htmlDark, setHtmlDark] = useState(false);
  const [bodyDark, setBodyDark] = useState(false);
  const [prefersDark, setPrefersDark] = useState(false);
  const [path, setPath] = useState<string>("");

  useEffect(() => {
    setPath(typeof window !== "undefined" ? window.location.pathname : "");
    const s = getStoredTheme();
    setStored(s);
    setSource(getThemeSource());
    setHtmlDark(document.documentElement.classList.contains("dark"));
    setBodyDark(document.body?.classList.contains("dark") || false);
    setPrefersDark(window.matchMedia("(prefers-color-scheme: dark)").matches);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme") {
        const v = (e.newValue as Theme | null) ?? null;
        setStored(v);
        setHtmlDark(document.documentElement.classList.contains("dark"));
        setBodyDark(document.body?.classList.contains("dark") || false);
      }
      if (e.key === "theme_source") {
        setSource(getThemeSource());
        setHtmlDark(document.documentElement.classList.contains("dark"));
        setBodyDark(document.body?.classList.contains("dark") || false);
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
      <div className="mb-1 text-[10px] opacity-70">path: {path || "(loading)"}</div>
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

