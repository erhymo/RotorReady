#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

const PDF_PATH = path.resolve('aw189/AW189 QRH_Rev 14_Phase 8_[E].pdf');
const pageArg = process.argv[2];
const pageNo = pageArg ? parseInt(pageArg, 10) : 11;

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
  if (pageNo < 1 || pageNo > doc.numPages) {
    console.error('Invalid page number', pageNo, 'total', doc.numPages);
    process.exit(2);
  }
  const lines = await extractPageLines(doc, pageNo);
  console.log(JSON.stringify({ page: pageNo, lines }, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); });

