export const SESSION_COOKIE = "rr_session";

export function makeCookie(value: string, maxAgeSeconds = 60 * 60 * 8) {
  const secure = process.env.NODE_ENV === "production" ? "Secure; " : "";
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; ${secure}Max-Age=${maxAgeSeconds}`;
}

