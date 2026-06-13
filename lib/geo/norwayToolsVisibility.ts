export function shouldShowNorwayTools(): boolean {
  if (typeof window === "undefined") return false;

  const host = window.location.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) {
    return true;
  }

  const languages = navigator.languages?.length ? navigator.languages : [navigator.language].filter(Boolean);
  const hasNorwegianLanguage = languages.some((language) => {
    const normalized = language.toLowerCase();
    return normalized === "no" || normalized.startsWith("no-") || normalized.startsWith("nb") || normalized.startsWith("nn");
  });
  if (hasNorwegianLanguage) return true;

  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timeZone === "Europe/Oslo" || timeZone === "Arctic/Longyearbyen";
  } catch {
    return false;
  }
}