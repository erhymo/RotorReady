import { adminDb } from "@/lib/firebase/admin";

export default async function AdminUsersPage() {
  let users: { email: string; createdAt?: string | null }[] = [];
  try {
    const snap = await adminDb.collection("users").get();
    users = snap.docs
      .map((doc) => {
        const data = doc.data() as any;
        const email: string | null = data?.email || null;
        const createdAtMeta = (doc as any).createTime?.toDate?.();
        const createdAt: string | null = createdAtMeta ? createdAtMeta.toISOString() : (data?.createdAt ?? null);
        return email ? { email, createdAt } : null;
      })
      .filter(Boolean) as { email: string; createdAt?: string | null }[];

    if (users.length === 0) {
      // Fallback to users_by_email if main collection has no email fields
      const idxSnap = await adminDb.collection("users_by_email").get();
      users = idxSnap.docs
        .map((doc) => {
          const email = doc.id;
          const data = doc.data() as any;
          const createdAt: string | null = data?.createdAt ?? null;
          return { email, createdAt };
        });
    }

    users.sort((a, b) => {
      const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
      const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
      return tb - ta; // newest first
    });
  } catch (e) {
    // If Firestore not available, keep users as empty list to avoid 500
    users = [];
  }

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

