#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

const RFM_PATH = path.resolve('aw189/AW189 RFM Issue 2_Rev_14_[E] - CHSC.pdf');

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

function hasAny(lineSet, patterns) {
  return patterns.some((re) => Array.from(lineSet).some((line) => re.test(line)));
}

async function main() {
  if (!fs.existsSync(RFM_PATH)) {
    console.error('RFM PDF not found:', RFM_PATH);
    process.exit(2);
  }
  const data = new Uint8Array(fs.readFileSync(RFM_PATH));
  const doc = await pdfjs.getDocument({ data, disableFontFace: true }).promise;

  const OUT_DIR = path.resolve('public/model-data/AW189/derived');
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const results = [];
  const keyPages = [];
  const LIM_RE = [/^LIMITATIONS\b/i, /OPERATING LIMITATIONS/i, /AIRCRAFT LIMITATIONS/i];
  const SUB_RE = [
    /WEIGHT/i,
    /CENTER OF GRAVITY|CENTRE OF GRAVITY|C.G\./i,
    /SLOPE|SLOPED/i,
    /CROSSWIND|TAILWIND/i,
    /ICING|PITOT/i,
    /BAGGAGE|CARGO/i,
    /DOOR/i,
    /FUEL/i,
    /ENGINE|MGB|HYDRAULIC|ROTOR/i,
  ];

  for (let p = 1; p <= doc.numPages; p++) {
    const lines = await extractPageLines(doc, p);
    const U = lines.map(s => s.toUpperCase());
    const ups = new Set(U);
    const isLim = hasAny(ups, LIM_RE);
    const hasSub = hasAny(ups, SUB_RE);
    if (isLim || hasSub) {
      results.push({ page: p, lines });
      if (isLim) keyPages.push(p);
    }
  }

  const outPath = path.join(OUT_DIR, 'rfm-limitations-scan.json');
  fs.writeFileSync(outPath, JSON.stringify({ scannedAt: new Date().toISOString(), keyPages, pages: results }, null, 2));
  console.log('Wrote', outPath);
  console.log('Key limitation pages:', keyPages.slice(0, 30).join(','));
}

main().catch((e) => { console.error(e); process.exit(1); });

