export type Theme = "light" | "dark";
export type ThemeSource = "manual" | "system";

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem("rr_theme") || localStorage.getItem("theme");
  return (v === "light" || v === "dark") ? (v as Theme) : null;
}

export function setStoredTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("rr_theme", theme);
  // keep legacy key in sync to avoid surprises during transition
  localStorage.setItem("theme", theme);
}

export function getThemeSource(): ThemeSource | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem("rr_theme_source") || localStorage.getItem("theme_source");
  return (v === "manual" || v === "system") ? (v as ThemeSource) : null;
}

export function setThemeSource(source: ThemeSource): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("rr_theme_source", source);
  // keep legacy key in sync
  localStorage.setItem("theme_source", source);
}

export function applyTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function toggleTheme(): Theme {
  const current = getStoredTheme() || "light";
  const newTheme: Theme = current === "light" ? "dark" : "light";

  setThemeSource("manual");
  setStoredTheme(newTheme);
  applyTheme(newTheme);

  return newTheme;
}

export function useSystemTheme(): Theme {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function initializeTheme(): void {
  if (typeof window === "undefined") return;

  const stored = getStoredTheme();
  const source = getThemeSource() || "system";

  if (!getThemeSource()) setThemeSource("system");

  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const resolveTheme = (): Theme => {
    if (source === "manual" && stored) return stored;
    return mql.matches ? "dark" : "light";
  };

  const theme = resolveTheme();
  if (!stored && source === "system") {
    setStoredTheme(theme);
  }
  applyTheme(theme);

  // React to OS changes only when source === 'system'
  const onChange = () => {
    const s = getThemeSource();
    if (s === "system") {
      applyTheme(mql.matches ? "dark" : "light");
    }
  };
  mql.addEventListener?.("change", onChange);

  // Keep in sync if theme or source is changed from another tab
  window.addEventListener("storage", (e) => {
    if (e.key === "rr_theme" || e.key === "theme") {
      const v = getStoredTheme();
      if (v) applyTheme(v);
    }
    if (e.key === "rr_theme_source" || e.key === "theme_source") {
      const s = getThemeSource();
      if (s === "system") {
        applyTheme(mql.matches ? "dark" : "light");
      } else {
        const v = getStoredTheme();
        if (v) applyTheme(v);
      }
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

