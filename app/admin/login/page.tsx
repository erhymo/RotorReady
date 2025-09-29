"use client";
import { useState } from "react";

import { SESSION_COOKIE } from "@/lib/auth/session";

const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "rotorready2025";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const maxAge = 60 * 60 * 8;
      const parts = [
        `${SESSION_COOKIE}=ok`,
        "Path=/",
        "SameSite=Strict",
        window.location.protocol === "https:" ? "Secure" : null,
        `Max-Age=${maxAge}`,
      ].filter(Boolean) as string[];
      document.cookie = parts.join("; ");
      window.location.href = "/admin";
    } else {
      setError("Feil brukernavn eller passord");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
        <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/60"
            placeholder="Brukernavn"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
          />
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/60"
            placeholder="Passord"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
          {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
          <button className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600">
            Logg inn
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-500 dark:text-zinc-400">
          Standard brukernavn: <span className="font-mono">{ADMIN_USERNAME}</span>
        </p>
      </div>
    </div>
  );
}
