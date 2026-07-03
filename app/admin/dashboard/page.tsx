import DedupeControls from "./DedupeControls";
import FlagsList from "./FlagsList";

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

  type Flag = {
    id: string;
    questionId: string;
    section: string;
    userId: string;
    email?: string;
    name?: string;
    createdAt: string;
    status: string;
    reason?: string;
  };


  const openFlags = (flags?.flags as Flag[] || []).filter((f: Flag) => f.status === "open");
  const genCount = (generated?.items || []).length;
  const flagsWarning: string | null = (flags?.error || flags?.devWarning) ? (flags?.error || flags?.devWarning) : null;

  type Section = {
    id: string;
    title: string;
    // Add other fields if needed
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Admin dashboard</h1>

	      <section className="bg-white dark:bg-zinc-800 dark:border-zinc-700 rounded-xl p-4 shadow border">
	        <h2 className="font-semibold">Sections</h2>
        <ul className="list-disc ml-5">
          {sections?.map((s: Section) => (
            <li key={s.id} className="mt-1">
              <a href={`/admin/sections/${s.id}`} className="text-blue-600 underline">{s.title}</a>
              <span className="text-gray-500 ml-2">({s.id})</span>
            </li>
          ))}
        </ul>
	        <div className="mt-3 flex gap-2 flex-wrap">
	          <a href="/admin/generated" className="px-3 py-2 rounded bg-blue-600 text-white text-sm">Generated ({genCount})</a>
	        </div>
	        <div className="mt-3">
	          <DedupeControls />
	        </div>
      </section>
      {flagsWarning && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded">
          {flagsWarning}
        </div>
      )}


	      <section className="bg-white dark:bg-zinc-800 dark:border-zinc-700 rounded-xl p-4 shadow border">
	        <FlagsList initialFlags={openFlags} />
      </section>

	      <section className="bg-white dark:bg-zinc-800 dark:border-zinc-700 rounded-xl p-4 shadow border">
	        <h2 className="font-semibold">Contact messages</h2>
        <pre className="text-sm bg-gray-50 dark:bg-zinc-800 p-3 rounded border overflow-auto">{JSON.stringify(messages, null, 2)}</pre>
      </section>

	      <form action="/api/auth/logout" method="post">
	        <button className="rounded bg-gray-800 text-white px-4 py-2">Log out</button>
	      </form>
    </div>
  );
}
