import BackButton from "../../components/BackButton";

export default function DailySessionPage() {
  return (
    <div className="mx-auto max-w-2xl p-6 min-h-[60vh] w-full">
      <div className="bg-white dark:bg-zinc-900 dark:border-zinc-700 border rounded-2xl p-6">
        <BackButton />
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 mb-2">Daily Session</h1>
        <p className="text-slate-600 dark:text-zinc-300">Her kommer Daily Session-innhold senere.</p>
      </div>
    </div>
  );
}
