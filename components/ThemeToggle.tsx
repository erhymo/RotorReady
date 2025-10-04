"use client";

import { useEffect, useState } from "react";
import { getStoredTheme, toggleTheme, type Theme } from "@/lib/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = getStoredTheme();
    if (stored) setTheme(stored);
  }, []);

  const onToggle = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 transition-colors"
      title={`Bytt til ${theme === "light" ? "dark" : "light"} mode`}
      aria-label="Toggle color theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

