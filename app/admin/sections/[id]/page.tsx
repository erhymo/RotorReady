import fs from "fs";
import path from "path";

import SectionEditorClient from "./SectionEditorClient";

function filePathFor(id: string) {
  return path.join(process.cwd(), "public", "quiz-data", "sections", `${id}.json`);
}

export default async function AdminSectionEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const file = filePathFor(id);
  const exists = fs.existsSync(file);
  const text = exists ? fs.readFileSync(file, "utf-8") : JSON.stringify({ items: [] }, null, 2);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <a href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-blue-600 underline">
        ← Dashboard
      </a>
      <div>
        <h1 className="text-2xl font-bold">Section: {id}</h1>
        <p className="text-sm text-gray-600 dark:text-zinc-300 mt-1">
          {exists ? "Editing raw section JSON." : "This section file does not exist yet — saving will create it."}
        </p>
      </div>
      <section className="bg-white dark:bg-zinc-800 dark:border-zinc-700 rounded-xl p-4 shadow border">
        <SectionEditorClient id={id} initialText={text} />
      </section>
    </div>
  );
}
