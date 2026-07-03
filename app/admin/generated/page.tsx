import fs from "fs";
import path from "path";

import GeneratedReviewClient from "./GeneratedReviewClient";

const GEN_FILE = path.join(process.cwd(), "public", "quiz-data", "generated", "qrh_batch.json");

function readGen() {
  if (!fs.existsSync(GEN_FILE)) return { items: [] };
  try {
    return JSON.parse(fs.readFileSync(GEN_FILE, "utf-8"));
  } catch {
    return { items: [] };
  }
}

export default function AdminGeneratedPage() {
  const gen = readGen();
  const items = Array.isArray(gen.items) ? gen.items : [];

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <a href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-blue-600 underline">
        ← Dashboard
      </a>
      <div>
        <h1 className="text-2xl font-bold">Generated QRH questions</h1>
        <p className="text-sm text-gray-600 dark:text-zinc-300 mt-1">
          Review auto-generated questions. Approving moves a question into the live QRH section; rejecting discards it.
        </p>
      </div>
      <section className="bg-white dark:bg-zinc-800 dark:border-zinc-700 rounded-xl p-4 shadow border">
        <GeneratedReviewClient initialItems={items} />
      </section>
    </div>
  );
}
