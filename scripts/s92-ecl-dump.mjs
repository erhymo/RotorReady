#!/usr/bin/env node
import fs from "fs";
import path from "path";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const ECL_PDF = path.resolve("S92", "CHC_HS_ECL_S92.pdf");

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
  if (!fs.existsSync(ECL_PDF)) {
    console.error("ECL PDF not found:", ECL_PDF);
    process.exit(2);
  }

  const data = new Uint8Array(fs.readFileSync(ECL_PDF));
  const doc = await pdfjs.getDocument({ data, disableFontFace: true }).promise;

  const outLines = [];
  const pageIndex = [];
  const maxPage = doc.numPages;

  for (let p = 1; p <= maxPage; p++) {
    const lines = await extractPageLines(doc, p);
    outLines.push(`=== DOC PAGE ${p} ===`);
    outLines.push(...lines);
    outLines.push("");
    pageIndex.push({ docPage: p, firstLine: lines[0] || "" });
  }

  fs.writeFileSync("s92-ecl-pages.txt", outLines.join("\n"), "utf8");
  fs.writeFileSync("S92/2_index.pages.json", JSON.stringify(pageIndex, null, 2), "utf8");
  console.log(`Wrote s92-ecl-pages.txt (${maxPage} pages) and S92/2_index.pages.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
