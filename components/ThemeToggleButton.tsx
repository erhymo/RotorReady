"use client";

import { useEffect, useState } from "react";
import { toggleTheme, getEffectiveTheme, onThemeChange } from "@/lib/theme";

export default function ThemeToggleButton({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    try {
      return getEffectiveTheme();
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    const unsub = onThemeChange(({ theme }) => setTheme(theme));
    return () => unsub?.();
  }, []);

  const handleClick = () => {
    try {
      const next = toggleTheme();
      setTheme(next);
    } catch {}
  };

  const label = theme === "light" ? "Bytt til mørkt tema" : "Bytt til lyst tema";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 transition-colors ${className}`}
      aria-label={label}
      title={label}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

