export const dynamic = 'force-dynamic';

import { adminDb, adminAuth } from "@/lib/firebase/admin";

export default async function AdminUsersPage() {
  let users: { email: string; createdAt?: string | null }[] = [];
  try {
    // Collect from main users collection (email field) and from users_by_email index
    const [snap, idxSnap] = await Promise.all([
      adminDb.collection("users").get(),
      adminDb.collection("users_by_email").get(),
    ]);

    const byEmail = new Map<string, string | null>(); // email -> createdAt

    // From users collection
    for (const doc of snap.docs) {
      const data = doc.data() as any;
      const email: string | null = data?.email || null;
      if (!email) continue;
      const createdAtMeta = (doc as any).createTime?.toDate?.();
      const createdAt: string | null = createdAtMeta ? createdAtMeta.toISOString() : (data?.createdAt ?? null);
      const cur = byEmail.get(email);
      if (!cur || (createdAt && (!cur || Date.parse(createdAt) > Date.parse(cur)))) {
        byEmail.set(email, createdAt || cur || null);
      }
    }

    // From users_by_email index
    for (const doc of idxSnap.docs) {
      const email = doc.id;
      const data = doc.data() as any;
      const createdAt: string | null = data?.createdAt ?? null;
      const cur = byEmail.get(email);
      if (!cur || (createdAt && (!cur || Date.parse(createdAt) > Date.parse(cur)))) {
        byEmail.set(email, createdAt || cur || null);
      }
    }

    // From Firebase Auth (users that may not yet have Firestore profile)
    try {
      let pageToken: string | undefined = undefined;
      do {
        const res = await adminAuth.listUsers(1000, pageToken);
        for (const u of res.users) {
          const email = u.email;
          if (!email) continue;
          const creation = u.metadata?.creationTime ? new Date(u.metadata.creationTime).toISOString() : null;
          const cur = byEmail.get(email);
          if (!cur || (creation && (!cur || Date.parse(creation) > Date.parse(cur)))) {
            byEmail.set(email, creation || cur || null);
          }
        }
        pageToken = res.pageToken as any;
      } while (pageToken);
    } catch {}

    users = Array.from(byEmail.entries()).map(([email, createdAt]) => ({ email, createdAt }));

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
            <p className="text-xs text-slate-600 dark:text-zinc-300">Newest first. Email only, no other data.</p>
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
                    <span className="text-xs text-slate-500 dark:text-zinc-400">{new Date(u.createdAt).toLocaleString('nb-NO', { timeZone: 'Europe/Oslo', weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
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

