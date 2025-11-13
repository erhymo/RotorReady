#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
// Use pdfjs-dist ESM build to extract text per page (no worker needed in Node)
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';


const PDF_PATH = path.resolve('aw189/AW189 QRH_Rev 14_Phase 8_[E].pdf');

// Target red warning light headings to search for (uppercase preferred)
// We match loosely to accommodate OCR/font extraction variations.
const TARGETS = [
  { id: 'eng-fire-flight',  label: '1(2) ENG FIRE', hint: 'FLIGHT' },
  { id: 'eng-fire-ground',  label: '1(2) ENG FIRE', hint: 'GROUND' },
  { id: 'bag-fire-flight',  label: 'BAG', hint: 'FIRE' },
  { id: 'bag-fire-ground',  label: 'BAG', hint: 'FIRE' },
  { id: 'elec-fail-double-dc-gen', label: 'ELEC FAIL', hint: 'DOUBLE' },
  { id: 'eng-drive-shaft-failure', label: 'DRIVE SHAFT', hint: 'FAIL' },
  { id: 'eng-eecu-fail',    label: 'EECU', hint: 'FAIL' },
  { id: 'eng-fail-fixed',   label: 'ENG FAIL', hint: 'FIXED' },
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
  return ratio < 0.1; // mostly uppercase
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

async function main() {
  if (!fs.existsSync(PDF_PATH)) {
    console.error('QRH PDF not found:', PDF_PATH);
    process.exit(2);
  }
  const data = new Uint8Array(fs.readFileSync(PDF_PATH));
  const doc = await pdfjs.getDocument({ data, disableFontFace: true }).promise;

  const results = {};
  for (let p = 1; p <= doc.numPages; p++) {
    const lines = await extractPageLines(doc, p);
    const U = lines.map(s => s.toUpperCase());
    const ups = new Set(U);

    for (const t of TARGETS) {
      if (results[t.id]) continue; // already found first occurrence
      const hasLabel = Array.from(ups).some(s => s.includes(t.label));
      if (!hasLabel) continue;
      let ok = true;
      if (t.hint) {
        ok = U.some(s => s.includes(t.hint));
      }
      if (ok) {
        // try to disambiguate flight vs ground for ENG FIRE by checking explicit words on page
        if (t.id === 'eng-fire-flight') {
          const hit = U.some(s => /(FLIGHT|IN\s+FLIGHT)/.test(s));
          if (!hit) continue;
        }
        if (t.id === 'eng-fire-ground') {
          const hit = U.some(s => /(GROUND|ON\s+GROUND)/.test(s));
          if (!hit) continue;
        }
        results[t.id] = p; // physical page number
      }
    }
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });

