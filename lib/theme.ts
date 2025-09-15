export function getStoredTheme(): "light" | "dark" | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem("rr_theme");
  return v === "dark" ? "dark" : v === "light" ? "light" : null;
}
export function applyTheme(theme: "light" | "dark") {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  if (theme === "dark") el.classList.add("dark");
  else el.classList.remove("dark");
  localStorage.setItem("rr_theme", theme);
}

