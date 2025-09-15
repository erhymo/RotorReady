async function fetchJSON(url: string) {
  const isServer = typeof window === "undefined";
  const base = isServer ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000" : "";
  const res = await fetch(isServer ? base + url : url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default async function AdminDashboard() {
  const [{ sections }, flags, messages, generated] = await Promise.all([
    fetchJSON("/api/admin/sections"),
    fetchJSON("/api/admin/flags"),
    fetchJSON("/api/admin/messages"),
    fetchJSON("/api/admin/generated"),
  ]);

  const openFlags = (flags?.flags || []).filter((f: any) => f.status === "open");
  const genCount = (generated?.items || []).length;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Admin dashboard</h1>

      <section className="bg-white dark:bg-zinc-900 dark:border-zinc-700 rounded-xl p-4 shadow border">
        <h2 className="font-semibold">Seksjoner</h2>
        <ul className="list-disc ml-5">
          {sections?.map((s: any) => (
            <li key={s.id} className="mt-1">
              <a href={`/admin/sections/${s.id}`} className="text-blue-600 underline">{s.title}</a>
              <span className="text-gray-500 ml-2">({s.id})</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex gap-2">
          <a href="/admin/qrh-publish" className="px-3 py-2 rounded bg-blue-600 text-white text-sm">QRH Publish</a>
          <a href="/admin/flags?status=open" className="px-3 py-2 rounded border text-sm">Flags</a>
          <a href="/admin/generated" className="px-3 py-2 rounded border text-sm">Generated ({genCount})</a>
        </div>
      </section>

      <section className="bg-white dark:bg-zinc-900 dark:border-zinc-700 rounded-xl p-4 shadow border">
        <h2 className="font-semibold mb-2">Flaggede spørsmål — åpne ({openFlags.length})</h2>
        {openFlags.length === 0 ? <p className="text-gray-600">Ingen åpne flagg.</p> : (
          <ul className="space-y-3">
            {openFlags.map((f: any) => (
              <li key={f.id} className="border dark:border-zinc-700 rounded-lg p-3">
                <div className="text-sm"><b>ID:</b> {f.questionId} <span className="text-gray-500">[{f.section}]</span></div>
                <div className="text-xs text-gray-600">Av: {f.userId} — {new Date(f.createdAt).toLocaleString()} — status: {f.status}</div>
                {f.reason && <div className="text-sm mt-1">{f.reason}</div>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white dark:bg-zinc-900 dark:border-zinc-700 rounded-xl p-4 shadow border">
        <h2 className="font-semibold">Kontaktmeldinger</h2>
        <pre className="text-sm bg-gray-50 dark:bg-zinc-800 p-3 rounded border overflow-auto">{JSON.stringify(messages, null, 2)}</pre>
      </section>

      <form action="/api/auth/logout" method="post">
        <button className="rounded bg-gray-800 text-white px-4 py-2">Logg ut</button>
      </form>
    </div>
  );
}
