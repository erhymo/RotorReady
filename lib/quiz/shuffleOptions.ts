export type ShuffleableItem = { options?: string[]; answer?: number[] };

/**
 * Returns a copy of the item with its options (and the answer indices that
 * reference them) shuffled into a new random order. Used every time a quiz
 * question is presented to a fresh session so the correct answer's position
 * can't be memorized from a fixed layout.
 */
export function shuffleOptionsForItem<T extends ShuffleableItem>(it: T): T {
  if (!Array.isArray(it.options) || !Array.isArray(it.answer)) return it;
  const idx = it.options.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const options = idx.map((i) => it.options![i]);
  const answer = it.answer
    .map((a) => idx.indexOf(a))
    .filter((n) => n >= 0)
    .sort((a, b) => a - b);
  return { ...it, options, answer };
}
