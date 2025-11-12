#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// Parse small rectangular band paths like: M152.94 564.26H154.02V619.22H152.94Z
const RECT_BAND_RE = /d="M\s*([0-9.]+)\s+([0-9.]+)\s*H\s*([0-9.]+)\s*V\s*([0-9.]+)\s*H\s*([0-9.]+)\s*Z"/g;
const TRANSFORM_RE = /transform="matrix\(1,0,0,-1,\s*([-0-9.]+),\s*([-0-9.]+)\)"/;

function parseBands(svgText) {
  const bands = [];
  // We need to find the transform used for coordinates on these <path> nodes.
  // In MuPDF output, each <path> has its own transform; however it is usually identical.
  // We'll read transform that appears preceding the d attribute within the tag.
  // We'll run a global regex over <path ...> tags to capture per-element values.
  const PATH_TAG_RE = /<path\s+([^>]*?)\/>/g;
  let m;
  while ((m = PATH_TAG_RE.exec(svgText))) {
    const tag = m[1];
    const dMatch = tag.match(/d="([^"]+)"/);
    if (!dMatch) continue;
    const d = dMatch[1];
    const r = /M\s*([0-9.]+)\s+([0-9.]+)\s*H\s*([0-9.]+)\s*V\s*([0-9.]+)\s*H\s*([0-9.]+)\s*Z/;
    const dm = d.match(r);
    if (!dm) continue;
    const t = tag.match(TRANSFORM_RE);
    if (!t) continue; // only consider transformed shapes (page coords)
    const tx = parseFloat(t[1]);
    const ty = parseFloat(t[2]);
    const x1 = parseFloat(dm[1]);
    const y1 = parseFloat(dm[2]);
    const x2 = parseFloat(dm[3]);
    const y2 = parseFloat(dm[4]);
    const x3 = parseFloat(dm[5]);
    // Determine orientation and band bounds in original PDF coords
    const minX = Math.min(x1, x2, x3);
    const maxX = Math.max(x1, x2, x3);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    const width = maxX - minX;
    const height = maxY - minY;
    // Convert to page (SVG) coordinate space using the element's transform
    // x' = x + tx; but in file transform is matrix(1,0,0,-1, -89.856, 746.096) and coordinates are applied before transform
    // After transform: x' = x + tx, y' = ty - y
    const toPage = (x, y) => ({ x: x + tx, y: ty - y });
    const p1 = toPage(minX, minY);
    const p2 = toPage(maxX, maxY);
    const band = {
      x1: Math.min(p1.x, p2.x),
      y1: Math.min(p1.y, p2.y),
      x2: Math.max(p1.x, p2.x),
      y2: Math.max(p1.y, p2.y),
      width: Math.abs(p2.x - p1.x),
      height: Math.abs(p2.y - p1.y),
    };
    // Only consider thin bands (stroke simulated by filled thin rect)
    const tmin = Math.min(band.width, band.height);
    if (tmin <= 5.0) {
      bands.push(band);
    }
  }
  return bands;
}

function findMemoryRect(bands, pageW, pageH) {
  // Heuristic: rectangle formed by 2 horizontals + 2 verticals. Prefer wide and short boxes away from page header/footer.
  const eps = 2.5; // coordinate tolerance in page units
  const horizontals = bands.filter(b => b.height <= b.width && b.height <= 4.8);
  const verticals = bands.filter(b => b.width < b.height && b.width <= 4.8);

  let best = null;
  // Rank: primarily by smallest height, secondarily by widest width
  const better = (a, b) => {
    if (!a) return true;
    if (!b) return false;
    if (a.h !== b.h) return b.h < a.h; // prefer smaller height
    return b.w > a.w; // then prefer wider
  };

  for (const top of horizontals) {
    for (const bottom of horizontals) {
      if (bottom.y1 <= top.y1 + 0.5) continue; // bottom must be below top
      // Overlapping x-span between top and bottom
      const leftX = Math.max(top.x1, bottom.x1);
      const rightX = Math.min(top.x2, bottom.x2);
      const wOverlap = rightX - leftX;
      if (wOverlap < pageW * 0.6) continue; // memory box is fairly wide

      // Candidate verticals near the overlap edges
      const candLeft = verticals.filter(v => Math.abs(v.x1 - leftX) < 8 || Math.abs(v.x2 - leftX) < 8);
      const candRight = verticals.filter(v => Math.abs(v.x1 - rightX) < 8 || Math.abs(v.x2 - rightX) < 8);

      for (const left of candLeft) {
        for (const right of candRight) {
          if (Math.max(right.x1, right.x2) <= Math.min(left.x1, left.x2) + 1) continue;
          // verticals must cover from just above top to just below bottom
          const vTop = Math.min(left.y1, right.y1);
          const vBottom = Math.max(left.y2, right.y2);
          if (vTop > top.y1 + eps) continue;
          if (vBottom < bottom.y2 - eps) continue;

          // Use only the band edges for the rectangle bounds (tight to border)
          const x1 = Math.min(left.x1, left.x2);
          const x2 = Math.max(right.x1, right.x2);
          const y1 = Math.min(top.y1, top.y2);
          const y2 = Math.max(bottom.y1, bottom.y2);
          const w = x2 - x1;
          const h = y2 - y1;
          const ny = y1 / pageH;
          // Constraints tailored for memory box
          if (w >= pageW * 0.6 && w <= pageW * 0.98 && h >= 14 && h <= 110 && ny >= 0.03 && ny <= 0.92) {
            const cand = { x: x1, y: y1, w, h };
            if (!best || better(best, cand)) {
              best = cand;
            }
          }
        }
      }
    }
  }

  // Fallback: pick the shortest wide rectangle formed by two horizontals if verticals not found
  if (!best) {
    let fallback = null;
    for (const top of horizontals) {
      for (const bottom of horizontals) {
        if (bottom.y1 <= top.y1 + 0.5) continue;
        const x1 = Math.max(top.x1, bottom.x1);
        const x2 = Math.min(top.x2, bottom.x2);
        const w = x2 - x1;
        const y1 = Math.min(top.y1, bottom.y1);
        const h = (bottom.y2 - top.y1);
        const ny = y1 / pageH;
        if (w >= pageW * 0.6 && h >= 14 && h <= 110 && ny >= 0.03 && ny <= 0.92) {
          const cand = { x: x1, y: top.y1, w, h };
          if (!fallback || better(fallback, cand)) {
            fallback = cand;
          }
        }
      }
    }
    if (fallback) best = fallback;
  }

  return best;
}

function normalizeRect(rect, pageW, pageH) {
  return [rect.x / pageW, rect.y / pageH, rect.w / pageW, rect.h / pageH].map(v => Number(v.toFixed(6)));
}

async function main() {
  const pagesDir = path.resolve('public/training/lights/pages');
  const files = fs.readdirSync(pagesDir).filter(f => f.startsWith('aw169-') && f.endsWith('.svg'));
  const PAGE_W = 415.508; // consistent for AW169 output
  const PAGE_H = 650.192;
  const mapping = {};

  for (const file of files) {
    const svgPath = path.join(pagesDir, file);
    const svg = fs.readFileSync(svgPath, 'utf8');
    const bands = parseBands(svg);
    let rect = findMemoryRect(bands, PAGE_W, PAGE_H);

    // Special loose fallback for ENG FIRE pages if strict detection fails
    if (!rect && /eng-fire-/.test(file)) {
      const horizontals = bands.filter(b => b.height <= b.width && b.height <= 5.0);
      let best = null;
      for (const top of horizontals) {
        for (const bottom of horizontals) {
          if (bottom.y1 <= top.y1 + 0.5) continue;
          const x1 = Math.max(top.x1, bottom.x1);
          const x2 = Math.min(top.x2, bottom.x2);
          const w = x2 - x1;
          const h = (bottom.y2 - top.y1);
          if (w >= PAGE_W * 0.62 && h >= 16 && h <= 140) {
            const cand = { x: x1, y: top.y1, w, h };
            if (!best || cand.h < best.h || (cand.h === best.h && cand.w > best.w)) {
              best = cand;
            }
          }
        }
      }
      if (best) rect = best;
    }

    if (!rect) {
      // No memory box detected; skip
      continue;
    }
    // Convert filename to light id (strip aw169- and .svg)
    const id = file.replace(/^aw169-/, '').replace(/\.svg$/, '');
    mapping[id] = normalizeRect(rect, PAGE_W, PAGE_H);
  }

  const outDir = path.resolve('public/training/lights/memory');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'aw169-memory-crops.json');
  fs.writeFileSync(outPath, JSON.stringify(mapping, null, 2));
  console.log(`Wrote memory crops for ${Object.keys(mapping).length} files to ${outPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });

