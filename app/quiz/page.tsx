"use client";
"use client";

import Link from "next/link";

const quizTypes = [
  { href: "/limitations-quiz", title: "Limitations" },
  { href: "/performance-quiz", title: "Performance" },
  { href: "/procedures-quiz", title: "Procedures" },
  { href: "/engine-systems-quiz", title: "Engine, Fuel, Lubricants, Hydraulics & System Limitations" },
  // Legg til flere quiztyper her etter behov
];

export default function QuizTypeSelectPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 rounded-xl border-l-4 border-blue-600 bg-white dark:border-blue-400 dark:bg-zinc-900">
      {/* ...existing code... */}
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
        {/* BookIcon can be added if needed */}
        Velg quiztype
      </h1>
      <div className="space-y-4">
        {quizTypes.map(q => (
          <Link key={q.href} href={q.href} className="block w-full rounded-xl border-l-4 border-blue-600 bg-blue-50/40 hover:bg-blue-600 hover:text-white dark:bg-zinc-900 dark:text-white dark:border-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition px-5 py-4 font-semibold">
            {q.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
