"use client";

import { useEffect, useState } from "react";
import { getEffectiveTheme, toggleTheme, type Theme } from "@/lib/theme";

export default function ClientThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    try {
      setTheme(getEffectiveTheme());
    } catch {}
  }, []);

  const onClick = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  const label = theme === "dark" ? "Light" : "Dark";
  const title = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label="Toggle theme"
      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
    >
      <span aria-hidden>{theme === "dark" ? "☀️" : "🌙"}</span>
      {label}
    </button>
  );
}

