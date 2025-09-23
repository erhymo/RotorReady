import Link from "next/link";
import { BookIcon } from "@/components/Icons";

const quizTypes = [
  { href: "/limitations-quiz", title: "Limitations" },
  { href: "/performance-quiz", title: "Performance" },
  { href: "/procedures-quiz", title: "Procedures" },
  { href: "/engine-systems-quiz", title: "Engine, Fuel, Lubricants, Hydraulics & System Limitations" },
  // Legg til flere quiztyper her etter behov
];

import BackButton from "@/components/BackButton";

export default function QuizTypeSelectPage() {
  return (
  <div className="max-w-2xl mx-auto p-6 space-y-8 bg-white dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700 border rounded-xl">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <BookIcon className="h-6 w-6" />
        Velg quiztype
      </h1>
      <div className="space-y-4">
        {quizTypes.map(q => (
          <Link key={q.href} href={q.href} className="block w-full rounded-xl border-l-4 border-blue-600 bg-blue-50/40 hover:bg-blue-50 dark:bg-zinc-900 dark:text-zinc-100 dark:border-blue-400 transition px-5 py-4 font-semibold">
            {q.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
