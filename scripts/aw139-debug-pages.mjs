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

  const pagesToDump = [
    { label: "ROTOR LOW", page: 37 },
    { label: "ROTOR HIGH", page: 37 },
    { label: "1(2) EEC FAIL", page: 20 },
    { label: "MAIN BATT HOT", page: 16 },
    { label: "AUX BATT HOT", page: 16 },
  ];

  const outLines = [];

  for (const item of pagesToDump) {
    const lines = await extractPageLines(doc, item.page);
    outLines.push(`=== DOC PAGE ${item.page} (${item.label}) ===`);
    outLines.push(...lines);
    outLines.push("");
  }

  fs.writeFileSync("aw139-debug-pages.txt", outLines.join("\n"), "utf8");
  console.log("Wrote aw139-debug-pages.txt");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

