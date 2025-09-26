export type Theme = "light" | "dark";

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem("theme") as Theme) || null;
}

export function setStoredTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("theme", theme);
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
  
  setStoredTheme(newTheme);
  applyTheme(newTheme);
  
  return newTheme;
}

export function initializeTheme(): void {
  if (typeof window === "undefined") return;
  
  const stored = getStoredTheme();
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored || (prefersDark ? "dark" : "light");
  
  if (!stored) {
    setStoredTheme(theme);
  }
  
  applyTheme(theme);
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

