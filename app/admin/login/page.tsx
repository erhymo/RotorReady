"use client";
import { useState } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || 'Feil brukernavn eller passord');
      }
      const next = new URLSearchParams(window.location.search).get('next') || '/admin';
      window.location.href = next;
    } catch (err: any) {
      setError(err?.message || 'Kunne ikke logge inn');
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
        {/* Hint (uten å eksponere verdier i bundle): kontakt systemansvarlig om du mangler brukernavn/passord */}
        <p className="mt-4 text-xs text-slate-500 dark:text-zinc-400">Har du problemer med innlogging? Kontakt administrator.</p>
      </div>
    </div>
  );
}
