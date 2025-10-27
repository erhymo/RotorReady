export type XY = { x: number; y: number };

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function linearInterpolate(x: number, pts: Array<{ x: number; y: number }>) {
  if (pts.length === 0) return NaN;
  const sorted = [...pts].sort((a, b) => a.x - b.x);
  if (x <= sorted[0].x) return sorted[0].y;
  if (x >= sorted[sorted.length - 1].x) return sorted[sorted.length - 1].y;
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (x >= a.x && x <= b.x) {
      const t = (x - a.x) / (b.x - a.x);
      return lerp(a.y, b.y, t);
    }
  }
  return NaN;
}

