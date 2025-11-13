#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import * as mupdf from 'mupdf';

const QRH_PDF = path.resolve('aw189/AW189 QRH_Rev 14_Phase 8_[E].pdf');
const OUT_PAGES_DIR = path.resolve('public/training/lights/pages');
const OUT_MEMORY_DIR = path.resolve('public/training/lights/memory');
const OUT_MODEL_DATA = path.resolve('public/model-data/AW189/training/lights');

// Target red warning lights for AW189 (ids mirror AW169 where applicable)
const TARGETS = [
  { id: 'eng-fire-flight',  label: '1(2) ENG FIRE', anyHints: ['FLIGHT','IN FLIGHT'] },
  { id: 'eng-fire-ground',  label: '1(2) ENG FIRE', anyHints: ['GROUND','ON GROUND'] },
  { id: 'bag-fire-flight',  label: 'BAG', anyHints: ['FIRE','BAGGAGE'] },
  { id: 'bag-fire-ground',  label: 'BAG', anyHints: ['FIRE','BAGGAGE'] },
  { id: 'elec-fail-double-dc-gen', label: 'ELEC FAIL', anyHints: ['DOUBLE DC','DOUBLE DC GENERATOR','2 DC GEN'] },
  { id: 'eng-drive-shaft-failure', label: 'DRIVE SHAFT', anyHints: ['FAIL'] },
  // EECU FAIL is a CAUTION (yellow) on AW189 → exclude from red warning targets
  // { id: 'eng-eecu-fail',    label: 'EECU', anyHints: ['FAIL'] },
  // AW189 uses ENG GOV LOSS instead of ENG FAIL (FIXED)
  { id: 'eng-gov-loss',     label: '1(2) ENG GOV LOSS' },
  { id: 'eng-idle',         label: 'ENG IDLE' },
  { id: 'eng-oil-press',    label: 'ENG OIL PRESS' },
  { id: 'eng-out',          label: 'ENG OUT' },
  { id: 'mgb-oil-press',    label: 'MGB OIL PRESS' },
  { id: 'mgb-oil-temp',     label: 'MGB OIL TEMP' },
  { id: 'rotor-high',       label: 'ROTOR HIGH' },
  { id: 'rotor-low',        label: 'ROTOR LOW' },
];

function isUpperHeading(s) {
  const t = String(s || '').trim();
  if (!t) return false;
  if (t.length < 3 || t.length > 80) return false;
  const letters = t.replace(/[^A-Za-z]+/g, '');
  if (!letters) return false;
  const ratio = letters.replace(/[A-Z]/g, '').length / letters.length;
  return ratio < 0.1;
}

async function extractPageLines(doc, pageNo) {
  const page = await doc.getPage(pageNo);
  const content = await page.getTextContent();
  const items = content.items || [];
  const tol = 2;
  const rows = [];
  for (const it of items) {
    const s = (it.str || '').replace(/\s+/g, ' ').trim();
    if (!s) continue;
    const tr = it.transform || it?.transform?.matrix || [0,0,0,0,it.x||0,it.y||0];
    const x = Math.round(tr[4]);
    const y = Math.round(tr[5]);
    let row = rows.find(r => Math.abs(r.y - y) <= tol);
    if (!row) { row = { y, parts: [] }; rows.push(row); }
    row.parts.push({ x, s });
  }
  rows.sort((a,b)=>b.y-a.y);
  const lines = rows.map(r => r.parts.sort((a,b)=>a.x-b.x).map(p=>p.s).join(' ').replace(/\s+/g,' ').trim()).filter(Boolean);
  return lines;
}

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
    const r = /M\s*([0-9.]+)\s+([0-9.]+)\s*H\s*([0-9.]+)\s*V\s*([0-9.]+)\s*H\s*([0-9.]+)\s*Z/;
    const dm = d.match(r);
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

// Parse filled red rectangles (AW189 QRH uses red bars for memory items)
function parseRedRects(svgText) {
  const rects = [];
  const PATH_TAG_RE = /<path\s+([^>]*?)\/>/g;
  const TRANSFORM_RE = /transform="matrix\(1,0,0,-1,\s*([-0-9.]+),\s*([-0-9.]+)\)"/;
  let m;
  while ((m = PATH_TAG_RE.exec(svgText))) {
    const tag = m[1];
    const lower = tag.toLowerCase();
    if (!lower.includes('fill="#ff0000"')) continue;
    const dMatch = tag.match(/d="([^"]+)"/);
    if (!dMatch) continue;
    const d = dMatch[1];
    // Axis-aligned rectangle pattern
    const r = /M\s*([0-9.]+)\s+([0-9.]+)\s*H\s*([0-9.]+)\s*V\s*([0-9.]+)\s*H\s*([0-9.]+)\s*Z/;
    const dm = d.match(r);
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
    const rect = {
      x: Math.min(p1.x, p2.x),
      y: Math.min(p1.y, p2.y),
      w: Math.abs(p2.x - p1.x),
      h: Math.abs(p2.y - p1.y),
    };
    rects.push(rect);
  }
  return rects;
}

function findMemoryRectFromRed(svgText, pageW, pageH) {
  const rects = parseRedRects(svgText);
  if (!rects.length) return null;
  // 1) Try to detect two long horizontal red bands (top/bottom of memory box)
  const horizontals = rects
    .filter(r => r.h <= 24 && r.w >= pageW * 0.45)
    .sort((a, b) => a.y - b.y);
  if (horizontals.length >= 2) {
    const top = horizontals[0];
    const bottom = horizontals[horizontals.length - 1];
    const yTop = top.y - 6;
    const yBottom = bottom.y + bottom.h + 6;
    let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
    for (const r of rects) {
      const cy = r.y + r.h / 2;
      if (cy >= yTop && cy <= yBottom) {
        x1 = Math.min(x1, r.x);
        y1 = Math.min(y1, r.y);
        x2 = Math.max(x2, r.x + r.w);
        y2 = Math.max(y2, r.y + r.h);
      }
    }
    if (isFinite(x1)) {
      const w = x2 - x1;
      const h = y2 - y1;
      if (w >= pageW * 0.25 && h >= 14 && h <= pageH * 0.75) {
        return { x: x1, y: y1, w, h };
      }
    }
  }
  // 2) Fallback: slide a vertical window and count likely bullet bars
  const candidates = rects.filter(r => r.h >= 6 && r.h <= 26 && r.w >= 24 && r.w <= pageW * 0.55);
  if (!candidates.length) return null;
  const step = Math.max(4, Math.floor(pageH / 120));
  const winH = Math.max(60, Math.floor(pageH * 0.2));
  let bestY1 = 0, bestY2 = winH, bestCount = 0;
  for (let y = 0; y + winH <= pageH; y += step) {
    const y2 = y + winH;
    const cnt = candidates.reduce((acc, r) => acc + ((r.y + r.h/2 >= y && r.y + r.h/2 <= y2) ? 1 : 0), 0);
    if (cnt > bestCount) { bestCount = cnt; bestY1 = y; bestY2 = y2; }
  }
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  for (const r of rects) {
    const cy = r.y + r.h / 2;
    if (cy >= bestY1 && cy <= bestY2) {
      x1 = Math.min(x1, r.x);
      y1 = Math.min(y1, r.y);
      x2 = Math.max(x2, r.x + r.w);
      y2 = Math.max(y2, r.y + r.h);
    }
  }
  if (!isFinite(x1)) return null;
  const w = x2 - x1;
  const h = y2 - y1;
  if (w < pageW * 0.1 || h < 8 || h > pageH * 0.85) return null;
  return { x: x1, y: y1, w, h };
}


function findMemoryRect(bands, pageW, pageH) {
  const eps = 2.5;
  const horizontals = bands.filter(b => b.height <= b.width && b.height <= 4.8);
  const verticals = bands.filter(b => b.width < b.height && b.width <= 4.8);
  let best = null;
  const better = (a, b) => { if (!a) return true; if (!b) return false; if (a.h !== b.h) return b.h < a.h; return b.w > a.w; };
  for (const top of horizontals) {
    for (const bottom of horizontals) {
      if (bottom.y1 <= top.y1 + 0.5) continue;
      const leftX = Math.max(top.x1, bottom.x1);
      const rightX = Math.min(top.x2, bottom.x2);
      const wOverlap = rightX - leftX;
      if (wOverlap < pageW * 0.6) continue;
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
          const ny = y1 / pageH;
          if (w >= pageW * 0.6 && w <= pageW * 0.98 && h >= 14 && h <= 110 && ny >= 0.03 && ny <= 0.92) {
            const cand = { x: x1, y: y1, w, h };
            if (!best || better(best, cand)) best = cand;
          }
        }
      }
    }
  }
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
          if (!fallback || better(fallback, cand)) fallback = cand;
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

function pageMatches(linesU, target) {
  // Focus on the top-of-page heading area to avoid matching index/summary pages
  const header = linesU.slice(0, 14);
  const bad = /(TABLE OF CONTENTS|CONTENTS|INDEX|ABBREVIATIONS|GLOSSARY)/i;
  if (header.some((s) => bad.test(s))) return false;

  const hasLabel = header.some((s) => s.includes(target.label));
  if (!hasLabel) return false;

  if (target.anyHints && target.anyHints.length) {
    const hasHint = target.anyHints.some((h) => header.some((s) => s.includes(h)));
    if (!hasHint) return false;
  }

  // Disambiguate FLIGHT vs GROUND when applicable
  if (target.id === 'eng-fire-flight' || target.id === 'bag-fire-flight') {
    if (!header.some((s) => /(FLIGHT|IN\s+FLIGHT)/.test(s))) return false;
  }
  if (target.id === 'eng-fire-ground' || target.id === 'bag-fire-ground') {
    if (!header.some((s) => /(GROUND|ON\s+GROUND)/.test(s))) return false;
  }

  // Disambiguate ROTOR HIGH vs ROTOR LOW: require only the specific one to be present in header
  if (target.id === 'rotor-high') {
    const hasHigh = header.some((s) => /ROTOR\s+HIGH/.test(s));
    const hasLow = header.some((s) => /ROTOR\s+LOW/.test(s));
    if (!hasHigh || hasLow) return false;
  }
  if (target.id === 'rotor-low') {
    const hasLow = header.some((s) => /ROTOR\s+LOW/.test(s));
    const hasHigh = header.some((s) => /ROTOR\s+HIGH/.test(s));
    if (!hasLow || hasHigh) return false;
  }

  return true;
}

async function renderSvg(pdfPath, pageNumber) {
  const doc = mupdf.Document.openDocument(pdfPath);
  const total = doc.countPages();
  if (pageNumber < 1 || pageNumber > total) throw new Error('Invalid page');
  const page = doc.loadPage(pageNumber - 1);
  const mediabox = page.getBounds(); // {x0,y0,x1,y1}
  const pageW = mediabox.x1 - mediabox.x0;
  const pageH = mediabox.y1 - mediabox.y0;
  const outBuf = new mupdf.Buffer();
  const writer = new mupdf.DocumentWriter(outBuf, 'svg', '');
  const device = writer.beginPage(mediabox);
  page.run(device, mupdf.Matrix.identity);
  writer.endPage();
  writer.close();
  let svgText = outBuf.asString();
  svgText = svgText.replace(/<svg([^>]*)>/, (m, attrs) => `<svg${attrs}><rect width='100%' height='100%' fill='white'/>`);
  return { svgText, pageW, pageH };
}

async function main() {
  if (!fs.existsSync(QRH_PDF)) {
    console.error('QRH PDF not found:', QRH_PDF);
    process.exit(2);
  }
  const data = new Uint8Array(fs.readFileSync(QRH_PDF));
  const doc = await pdfjs.getDocument({ data, disableFontFace: true }).promise;

  // Preload uppercase text per page for fast scanning
  const pagesUpper = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const lines = await extractPageLines(doc, p);
    pagesUpper.push(lines.map((s) => s.toUpperCase()));
  }

  // 1) Locate the "TABLE OF CAS WARNING MESSAGES" page (user referenced Emerg-Malfunc Page 11)
  let casTablePage = -1;
  for (let p = 1; p <= pagesUpper.length; p++) {
    const U = pagesUpper[p - 1];
    if (U.some((s) => s.includes('TABLE OF CAS WARNING MESSAGES'))) {
      casTablePage = p;
      break;
    }
  }
  if (casTablePage < 0) {
    console.error('Could not find "TABLE OF CAS WARNING MESSAGES" page in QRH.');
    process.exit(2);
  }

  // Use authoritative mapping from the CAS WARNING table (Emerg-Malfunc Page 11)
  const labelToPrinted = {
    'ROTOR LOW': 37,
    '1(2) ENG OUT': 17,
    '1(2) ENG FIRE': 29,
    'ROTOR HIGH': 37,
    '1(2) ENG IDLE': 18,
    '1(2) ENG GOV LOSS': 19,
    'MGB OIL PRESS': 39,
    'MGB OIL TEMP': 38,
    '1(2) ENG OIL P LOW': 20,
    'ELEC FAIL': 13,
    'BAG FIRE': 31,
  };

  // Helper: find the document page for a given printed Emerg-Malfunc page number
  function findDocPageForEmergPrinted(n) {
    const needle = `PAGE ${n}`;
    for (let p = 1; p <= pagesUpper.length; p++) {
      if (p === casTablePage) continue; // never return the CAS table page itself
      const U = pagesUpper[p - 1];
      const tail = U.slice(Math.max(0, U.length - 8)); // look only at footer area
      const footerHasPrintedAndEmerg = tail.some((s) => s.includes(needle) && (s.includes('EMERG') || s.includes('EMERGENCY PROCEDURES')));
      if (footerHasPrintedAndEmerg) return p;
    }
    return -1;
  }

  // Map our known AW189 red lights to labels found in the CAS table
  const ID_TO_TABLE_LABEL = {
    'eng-fire-flight': '1(2) ENG FIRE',
    'eng-fire-ground': '1(2) ENG FIRE',
    'bag-fire-flight': 'BAG FIRE',
    'bag-fire-ground': 'BAG FIRE',
    'elec-fail-double-dc-gen': 'ELEC FAIL',
    'eng-gov-loss': '1(2) ENG GOV LOSS',
    'eng-idle': '1(2) ENG IDLE',
    'eng-oil-press': '1(2) ENG OIL P LOW',
    'eng-out': '1(2) ENG OUT',
    'mgb-oil-press': 'MGB OIL PRESS',
    'mgb-oil-temp': 'MGB OIL TEMP',
    'rotor-high': 'ROTOR HIGH',
    'rotor-low': 'ROTOR LOW',
    // Note: ENG DRIVE SHAFT FAILURE is not listed in the CAS WARNING table (likely not a red CAS warning on AW189)
  };

  const filteredTargets = TARGETS.filter((t) => ID_TO_TABLE_LABEL[t.id]);

  const found = {};
  const memoryCrops = {};

  for (const t of filteredTargets) {
    const tableLabel = ID_TO_TABLE_LABEL[t.id];
    const printed = labelToPrinted[tableLabel];
    if (!printed) {
      console.warn(`[skip] No printed page mapping for ${t.id} (${tableLabel})`);
      continue;
    }
    const docPage = findDocPageForEmergPrinted(printed);
    if (docPage < 0) {
      console.warn(`[skip] Could not locate document page for printed Emerg-Malfunc Page ${printed} (${t.id})`);
      continue;
    }

    try {
      const { svgText, pageW, pageH } = await renderSvg(QRH_PDF, docPage);
      found[t.id] = docPage;
      console.log(`[map] ${t.id} -> printed ${printed} (doc page ${docPage})`);
      try {
        let rect = findMemoryRectFromRed(svgText, pageW, pageH);
        if (!rect) {
          const bands = parseBands(svgText);
          rect = findMemoryRect(bands, pageW, pageH);
        }
        if (rect) memoryCrops[t.id] = normalizeRect(rect, pageW, pageH);
      } catch {}
      // Write page SVG
      fs.mkdirSync(OUT_PAGES_DIR, { recursive: true });
      const outSvg = path.join(OUT_PAGES_DIR, `aw189-${t.id}.svg`);
      fs.writeFileSync(outSvg, svgText, 'utf8');
    } catch (e) {
      console.warn(`[render-failed] ${t.id} printed ${printed} doc ${docPage}:`, e?.message || e);
    }
  }

  // Write memory crops JSON
  fs.mkdirSync(OUT_MEMORY_DIR, { recursive: true });
  const outCrops = path.join(OUT_MEMORY_DIR, 'aw189-memory-crops.json');
  fs.writeFileSync(outCrops, JSON.stringify(memoryCrops, null, 2));
  console.log(`Wrote memory crops for ${Object.keys(memoryCrops).length} lights to ${outCrops}`);

  // Create minimal light JSON files in model-data
  fs.mkdirSync(OUT_MODEL_DATA, { recursive: true });
  const manifest = [];
  for (const t of filteredTargets) {
    if (!found[t.id]) continue; // only include those with page/memory found
    const item = [{
      id: t.id,
      name: guessNameFromId(t.id),
      severity: 'warning',
      system: guessSystemFromId(t.id),
      description: '',
      pageImage: `/training/lights/pages/aw189-${t.id}.svg`,
      modelIds: ['AW189']
    }];
    const jsonPath = path.join(OUT_MODEL_DATA, `${t.id}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(item, null, 2));
    manifest.push(`${t.id}.json`);
  }
  const manifestPath = path.join(OUT_MODEL_DATA, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify({ files: manifest }, null, 2));
  console.log(`Wrote manifest with ${manifest.length} files at ${manifestPath}`);
}

function guessNameFromId(id) {
  const map = {
    'eng-fire-flight': '1(2) ENG FIRE',
    'eng-fire-ground': '1(2) ENG FIRE',
    'bag-fire-flight': 'BAG FIRE',
    'bag-fire-ground': 'BAG FIRE',
    'elec-fail-double-dc-gen': 'ELEC FAIL (DOUBLE DC GEN)',
    'eng-drive-shaft-failure': 'ENG DRIVE SHAFT FAILURE',
    // 'eng-eecu-fail': 'ENG EECU FAIL', // excluded (caution)
    // 'eng-fail-fixed': 'ENG FAIL (FIXED)', // replaced by ENG GOV LOSS
    'eng-gov-loss': '1 (2) ENG GOV LOSS',
    'eng-idle': 'ENG IDLE',
    'eng-oil-press': 'ENG OIL PRESS',
    'eng-out': 'ENG OUT',
    'mgb-oil-press': 'MGB OIL PRESS',
    'mgb-oil-temp': 'MGB OIL TEMP',
    'rotor-high': 'ROTOR HIGH',
    'rotor-low': 'ROTOR LOW',
  };
  return map[id] || id.replace(/-/g,' ').toUpperCase();
}
function guessSystemFromId(id) {
  if (id.includes('fire')) return 'FIRE';
  if (id.includes('elec')) return 'ELEC';
  if (id.includes('mgb')) return 'MGB';
  if (id.includes('rotor')) return 'ROTOR';
  if (id.includes('eng-')) return 'ENG';
  if (id.includes('oil')) return 'ENG';
  if (id.includes('eecu')) return 'ENG';
  if (id.includes('drive-shaft')) return 'ENG';
  return undefined;
}

main().catch(err => { console.error(err); process.exit(1); });

