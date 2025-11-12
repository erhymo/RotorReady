#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const PAGE_W = 415.508;
const PAGE_H = 650.192;

function parseBands(svgText) {
  const bands = [];
  const PATH_TAG_RE = /<path\s+([^>]*?)\/>/g;
  const TRANSFORM_RE = /transform="matrix\(1,0,0,-1,\s*([-0-9.]+),\s*([-0-9.]+)\)"/;
  let m;
  while ((m = PATH_TAG_RE.exec(svgText))) {
    const tag = m[1];
    const dMatch = tag.match(/d="([^"]+)"/);
    if (!dMatch) continue;
    const d = dMatch[1];
    const dm = d.match(/M\s*([0-9.]+)\s+([0-9.]+)\s*H\s*([0-9.]+)\s*V\s*([0-9.]+)\s*H\s*([0-9.]+)\s*Z/);
    if (!dm) continue;
    const t = tag.match(TRANSFORM_RE);
    if (!t) continue;
    const tx = parseFloat(t[1]);
    const ty = parseFloat(t[2]);
    const x1 = parseFloat(dm[1]);
    const y1 = parseFloat(dm[2]);
    const x2 = parseFloat(dm[3]);
    const y2 = parseFloat(dm[4]);
    const x3 = parseFloat(dm[5]);
    const minX = Math.min(x1, x2, x3);
    const maxX = Math.max(x1, x2, x3);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
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
    const tmin = Math.min(band.width, band.height);
    if (tmin <= 5.0) bands.push(band);
  }
  return bands;
}

function enumerateRects(bands) {
  const horizontals = bands.filter(b => b.height <= b.width && b.height <= 4.8);
  const verticals = bands.filter(b => b.width < b.height && b.width <= 4.8);
  const eps = 2.5;
  const rects = [];
  for (const top of horizontals) {
    for (const bottom of horizontals) {
      if (bottom.y1 <= top.y1 + 0.5) continue;
      const leftX = Math.max(top.x1, bottom.x1);
      const rightX = Math.min(top.x2, bottom.x2);
      const wOverlap = rightX - leftX;
      if (wOverlap < PAGE_W * 0.6) continue;
      const candLeft = verticals.filter(v => Math.abs(v.x1 - leftX) < 8 || Math.abs(v.x2 - leftX) < 8);
      const candRight = verticals.filter(v => Math.abs(v.x1 - rightX) < 8 || Math.abs(v.x2 - rightX) < 8);
      for (const left of candLeft) {
        for (const right of candRight) {
          if (Math.max(right.x1, right.x2) <= Math.min(left.x1, left.x2) + 1) continue;
          const vTop = Math.min(left.y1, right.y1);
          const vBottom = Math.max(left.y2, right.y2);
          if (vTop > top.y1 + eps) continue;
          if (vBottom < bottom.y2 - eps) continue;
          const x1 = Math.min(left.x1, left.x2);
          const x2 = Math.max(right.x1, right.x2);
          const y1 = Math.min(top.y1, top.y2);
          const y2 = Math.max(bottom.y1, bottom.y2);
          const w = x2 - x1;
          const h = y2 - y1;
          const ny = y1 / PAGE_H;
          if (w >= PAGE_W * 0.6 && w <= PAGE_W * 0.98 && h >= 14 && h <= 140 && ny >= 0.03 && ny <= 0.92) {
            rects.push({ x: x1, y: y1, w, h });
          }
        }
      }
    }
  }
  rects.sort((a, b) => (a.h - b.h) || (b.w - a.w) || (a.y - b.y));
  return rects;
}

function enumerateRectsWide(bands) {
  const horizontals = bands.filter(b => b.height <= b.width && b.height <= 6.5);
  const verticals = bands.filter(b => b.width < b.height && b.width <= 8.0);
  const eps = 3.0;
  const rects = [];
  for (const top of horizontals) {
    for (const bottom of horizontals) {
      if (bottom.y1 <= top.y1 + 0.5) continue;
      const leftX = Math.max(top.x1, bottom.x1);
      const rightX = Math.min(top.x2, bottom.x2);
      const wOverlap = rightX - leftX;
      if (wOverlap < PAGE_W * 0.6) continue;
      const candLeft = verticals.filter(v => Math.abs(v.x1 - leftX) < 10 || Math.abs(v.x2 - leftX) < 10);
      const candRight = verticals.filter(v => Math.abs(v.x1 - rightX) < 10 || Math.abs(v.x2 - rightX) < 10);
      for (const left of candLeft) {
        for (const right of candRight) {
          if (Math.max(right.x1, right.x2) <= Math.min(left.x1, left.x2) + 1) continue;
          const vTop = Math.min(left.y1, right.y1);
          const vBottom = Math.max(left.y2, right.y2);
          if (vTop > top.y1 + eps) continue;
          if (vBottom < bottom.y2 - eps) continue;
          const x1 = Math.min(left.x1, left.x2);
          const x2 = Math.max(right.x1, right.x2);
          const y1 = Math.min(top.y1, top.y2);
          const y2 = Math.max(bottom.y1, bottom.y2);
          const w = x2 - x1;
          const h = y2 - y1;
          const ny = y1 / PAGE_H;
          if (w >= PAGE_W * 0.6 && w <= PAGE_W * 0.98 && h >= 14 && h <= 160 && ny >= 0.03 && ny <= 0.92) {
            rects.push({ x: x1, y: y1, w, h });
          }
        }
      }
    }
  }
  rects.sort((a, b) => (a.h - b.h) || (b.w - a.w) || (a.y - b.y));
  return rects;
}


function enumerateFallbackHorizontals(bands) {
  const horizontals = bands.filter(b => b.height <= b.width && b.height <= 4.8);
  const rects = [];
  for (const top of horizontals) {
    for (const bottom of horizontals) {
      if (bottom.y1 <= top.y1 + 0.5) continue;
      const x1 = Math.max(top.x1, bottom.x1);
      const x2 = Math.min(top.x2, bottom.x2);
      const w = x2 - x1;
      const h = bottom.y2 - top.y1;
      const ny = Math.min(top.y1, bottom.y1) / PAGE_H;
      if (w >= PAGE_W * 0.6 && h >= 14 && h <= 110 && ny >= 0.03 && ny <= 0.92) {
        rects.push({ x: x1, y: top.y1, w, h });
      }
    }
  }
  rects.sort((a, b) => (a.h - b.h) || (b.w - a.w) || (a.y - b.y));
  return rects;
}

function norm(r) {
  return [r.x / PAGE_W, r.y / PAGE_H, r.w / PAGE_W, r.h / PAGE_H].map(v => Number(v.toFixed(6)));
}

function inspect(file) {
  const svgPath = path.resolve('public/training/lights/pages', file);
  const svg = fs.readFileSync(svgPath, 'utf8');
  const bands = parseBands(svg);
  console.log(`\nFile: ${file}`);

  const rects = enumerateRects(bands);
  if (rects.length) {
    console.log('With verticals (tight):');
    rects.slice(0, 10).forEach((r, i) => {
      console.log(`#${i+1}`, JSON.stringify(norm(r)), ` px=(${r.x.toFixed(1)},${r.y.toFixed(1)}, ${r.w.toFixed(1)}x${r.h.toFixed(1)})`);
    });
  } else {
    console.log('With verticals (tight): none');
  }

  const rectsWide = enumerateRectsWide(bands);
  if (rectsWide.length) {
    console.log('With verticals (wide):');
    rectsWide.slice(0, 10).forEach((r, i) => {
      console.log(`#${i+1}`, JSON.stringify(norm(r)), ` px=(${r.x.toFixed(1)},${r.y.toFixed(1)}, ${r.w.toFixed(1)}x${r.h.toFixed(1)})`);
    });
  } else {
    console.log('With verticals (wide): none');
  }

  const rects2 = enumerateFallbackHorizontals(bands);
  if (rects2.length) {
    console.log('Horizontals-only (fallback):');
    rects2.slice(0, 10).forEach((r, i) => {
      console.log(`#${i+1}`, JSON.stringify(norm(r)), ` px=(${r.x.toFixed(1)},${r.y.toFixed(1)}, ${r.w.toFixed(1)}x${r.h.toFixed(1)})`);
    });
  } else {
    console.log('Horizontals-only (fallback): none');
  }
}

const files = process.argv.slice(2);
if (!files.length) {
  console.log('Usage: node scripts/debug2-aw169-candidates.mjs aw169-eng-fire-ground.svg [aw169-eng-fire-flight.svg]');
  process.exit(0);
}
files.forEach(inspect);

