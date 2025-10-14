async function fetchJSON(url: string) {
  const isServer = typeof window === "undefined";
  const base = isServer ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000" : "";
  const res = await fetch(isServer ? base + url : url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default async function AdminUsersPage() {
  const { users } = await fetchJSON("/api/admin/users");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-12 px-4">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Brukere (e-post)</h1>
            <p className="text-xs text-slate-600 dark:text-zinc-300">Nyeste først. Kun e-post, ingen andre data.</p>
          </div>
          <a href="/admin" className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800" aria-label="Tilbake til admin">Tilbake</a>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100">
          {(!users || users.length === 0) ? (
            <p className="text-sm text-slate-600 dark:text-zinc-300">Ingen brukere funnet.</p>
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-zinc-800">
              {users.map((u: { email: string; createdAt?: string | null }, idx: number) => (
                <li key={`${u.email}-${idx}`} className="flex items-center justify-between py-3">
                  <span className="font-mono text-sm text-slate-900 dark:text-zinc-100">{u.email}</span>
                  {u.createdAt && (
                    <span className="text-xs text-slate-500 dark:text-zinc-400">{new Date(u.createdAt).toLocaleString()}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

