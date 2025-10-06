"use client";

import { useEffect, useState } from "react";
import { toggleTheme, onThemeChange } from "@/lib/theme";

export default function ThemeToggleButton({ className = "" }: { className?: string }) {
  // Avoid hydration mismatch: don't depend on window during initial render
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
    // Sync from DOM (set by no-flash script / initializer)
    try {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    } catch {}

    const unsub = onThemeChange(({ theme }) => setTheme(theme));
    return () => unsub?.();
  }, []);

  const handleClick = () => {
    try {
      const next = toggleTheme();
      setTheme(next);
    } catch {}
  };

  const label = mounted
    ? theme === "light"
      ? "Switch to dark theme"
      : "Switch to light theme"
    : "Switch theme";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 transition-colors ${className}`}
      aria-label={label}
      title={label}
    >
      {mounted ? (theme === "light" ? "🌙" : "☀️") : "🌗"}
    </button>
  );
}

