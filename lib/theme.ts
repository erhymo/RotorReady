export type Theme = "light" | "dark";
export type ThemeSource = "manual" | "system";

const THEME_EVENT = "rr-theme-change";

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem("rr_theme") || localStorage.getItem("theme");
  return v === "light" || v === "dark" ? (v as Theme) : null;
}

export function getThemeSource(): ThemeSource | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem("rr_theme_source") || localStorage.getItem("theme_source");
  return v === "manual" || v === "system" ? (v as ThemeSource) : null;
}

export function setStoredTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("rr_theme", theme);
  localStorage.setItem("theme", theme); // legacy sync
  broadcastThemeChange();
}

export function setThemeSource(source: ThemeSource): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("rr_theme_source", source);
  localStorage.setItem("theme_source", source); // legacy sync
  broadcastThemeChange();
}

export function applyTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function getEffectiveTheme(): Theme {
  const source = getThemeSource() || "system";
  const stored = getStoredTheme();
  if (source === "manual" && stored) return stored;
  const prefersDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function toggleTheme(): Theme {
  const current = getEffectiveTheme();
  const next: Theme = current === "light" ? "dark" : "light";
  setThemeSource("manual");
  setStoredTheme(next);
  applyTheme(next);
  return next;
}

export function useSystemTheme(): Theme {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function onThemeChange(handler: (t: { theme: Theme; source: ThemeSource }) => void) {
  if (typeof window === "undefined") return () => {};
  const listener = () => {
    const theme = getEffectiveTheme();
    const source = (getThemeSource() || "system") as ThemeSource;
    handler({ theme, source });
  };
  window.addEventListener(THEME_EVENT, listener as any);
  return () => window.removeEventListener(THEME_EVENT, listener as any);
}

function broadcastThemeChange() {
  if (typeof window === "undefined") return;
  const theme = getEffectiveTheme();
  const source = (getThemeSource() || "system") as ThemeSource;
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { theme, source } }));
}

export function initializeTheme(): void {
  if (typeof window === "undefined") return;

  const source = getThemeSource() || "system";
  if (!getThemeSource()) setThemeSource("system");

  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const resolveTheme = (): Theme => {
    if (source === "manual") {
      const stored = getStoredTheme();
      if (stored) return stored;
    }
    return mql.matches ? "dark" : "light";
  };

  const theme = resolveTheme();
  applyTheme(theme);
  if (!getStoredTheme() && source === "system") {
    // Seed stored to keep legacy codepaths happy
    setStoredTheme(theme);
  }
  broadcastThemeChange();

  // React to OS changes only when source === 'system'
  const onChange = () => {
    const s = getThemeSource();
    if (s === "system") {
      const t = mql.matches ? "dark" : "light";
      applyTheme(t);
      broadcastThemeChange();
    }
  };
  mql.addEventListener?.("change", onChange);

  // Keep in sync if theme or source is changed from another tab
  window.addEventListener("storage", (e) => {
    if (e.key === "rr_theme" || e.key === "theme" || e.key === "rr_theme_source" || e.key === "theme_source") {
      const t = getEffectiveTheme();
      applyTheme(t);
      broadcastThemeChange();
    }
  });
}

// Standard color palette for consistent theming
export const themeColors = {
  // Background colors
  bg: {
    primary: "bg-slate-50 dark:bg-zinc-900",
    secondary: "bg-white dark:bg-zinc-800", 
    tertiary: "bg-slate-100 dark:bg-zinc-700",
    card: "bg-white dark:bg-zinc-800",
    overlay: "bg-white/80 dark:bg-zinc-900/90"
  },
  // Text colors
  text: {
    primary: "text-slate-900 dark:text-white",
    secondary: "text-slate-600 dark:text-zinc-300", 
    tertiary: "text-slate-500 dark:text-zinc-400",
    muted: "text-gray-400 dark:text-zinc-500"
  },
  // Border colors
  border: {
    primary: "border-slate-200 dark:border-zinc-700",
    secondary: "border-slate-300 dark:border-zinc-600"
  },
  // Interactive elements
  interactive: {
    hover: "hover:bg-slate-100 dark:hover:bg-zinc-700",
    focus: "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
  }
} as const;

