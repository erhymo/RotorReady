#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

const PDF_PATH = path.resolve('AW189/AW189 RFM Issue 2_Rev_14_[E] - CHSC.pdf');
const OUT_PATH = path.resolve('aw189-rfm-pages.txt');

async function extractPageLines(doc, pageNo) {
  const page = await doc.getPage(pageNo);
  const content = await page.getTextContent();
  const items = content.items || [];
  const tol = 2;
  const rows = [];
  for (const it of items) {
    const s = (it.str || '').replace(/\s+/g, ' ').trim();
    if (!s) continue;
    const tr = it.transform || it?.transform?.matrix || [0, 0, 0, 0, it.x || 0, it.y || 0];
    const x = Math.round(tr[4]);
    const y = Math.round(tr[5]);
    let row = rows.find((r) => Math.abs(r.y - y) <= tol);
    if (!row) { row = { y, parts: [] }; rows.push(row); }
    row.parts.push({ x, s });
  }
  rows.sort((a, b) => b.y - a.y);
  return rows.map((r) => r.parts.sort((a, b) => a.x - b.x).map((p) => p.s).join(' ').replace(/\s+/g, ' ').trim()).filter(Boolean);
}

async function main() {
  if (!fs.existsSync(PDF_PATH)) {
    console.error('RFM PDF not found:', PDF_PATH);
    process.exit(2);
  }
  const data = new Uint8Array(fs.readFileSync(PDF_PATH));
  const doc = await pdfjs.getDocument({ data, disableFontFace: true }).promise;
  console.log('total pages', doc.numPages);

  const out = fs.createWriteStream(OUT_PATH);
  for (let p = 1; p <= doc.numPages; p++) {
    const lines = await extractPageLines(doc, p);
    out.write(`=== DOC PAGE ${p} ===\n`);
    out.write(lines.join(' '));
    out.write('\n\n---PAGE-DELIM---\n\n');
    if (p % 50 === 0) console.log('processed', p);
  }
  out.end();
  console.log('wrote', OUT_PATH);
}

main().catch((err) => { console.error(err); process.exit(1); });
