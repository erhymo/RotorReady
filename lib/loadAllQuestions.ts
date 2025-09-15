// Utility to load and merge all questions from all JSON files in public/quiz-data/all-questions/
export async function loadAllQuestions(): Promise<any[]> {
  // This will run on the client, so we fetch the file list from a manifest endpoint
  const res = await fetch('/quiz-data/all-questions/manifest.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load question manifest');
  const files: string[] = await res.json();
  const all: any[] = [];
  for (const file of files) {
    const r = await fetch(`/quiz-data/all-questions/${file}`);
    if (r.ok) {
      const items = await r.json();
      if (Array.isArray(items)) all.push(...items);
    }
  }
  // Deduplicate by id
  const seen = new Set();
  const filtered = all.filter(q => {
    if (seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  });
  // Fix answer: convert from string to index-array if needed
  for (const q of filtered) {
    if (typeof q.answer === "string" && Array.isArray(q.options)) {
      const idx = q.options.findIndex((opt: string) => opt === q.answer);
      q.answer = idx >= 0 ? [idx] : [];
    }
    // If answer is a single number, wrap in array
    if (typeof q.answer === "number") q.answer = [q.answer];
  }
  return filtered;
}
