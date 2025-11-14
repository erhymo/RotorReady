#!/usr/bin/env node
import fs from "fs";
import path from "path";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const QRH_PDF = path.resolve("aw139/02. QRH - REV31 - 19NOV24 (1).pdf");

async function extractPageLines(doc, pageNo) {
  const page = await doc.getPage(pageNo);
  const content = await page.getTextContent();
  const items = content.items || [];
  const tol = 2;
  const rows = [];
  for (const it of items) {
    const s = (it.str || "").replace(/\s+/g, " ").trim();
    if (!s) continue;
    const tr = it.transform || it?.transform?.matrix || [0, 0, 0, 0, it.x || 0, it.y || 0];
    const x = Math.round(tr[4]);
    const y = Math.round(tr[5]);
    let row = rows.find((r) => Math.abs(r.y - y) <= tol);
    if (!row) rows.push((row = { y, parts: [] }));
    row.parts.push({ x, s });
  }
  rows.sort((a, b) => b.y - a.y);
  return rows
    .map((r) => r.parts.sort((a, b) => a.x - b.x).map((p) => p.s).join(" ").replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

async function main() {
  if (!fs.existsSync(QRH_PDF)) {
    console.error("QRH PDF not found:", QRH_PDF);
    process.exit(2);
  }

  const data = new Uint8Array(fs.readFileSync(QRH_PDF));
  const doc = await pdfjs.getDocument({ data, disableFontFace: true }).promise;

  const target = "EEC FAIL";
  for (let p = 1; p <= doc.numPages; p++) {
    const lines = await extractPageLines(doc, p);
    if (lines.some((s) => s.toUpperCase().includes(target))) {
      console.log(`=== DOC PAGE ${p} ===`);
      for (const line of lines) console.log(line);
      console.log("");
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

