#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mupdf from "mupdf";

async function main() {
  const [, , pdfPathArg, pageArg, outPathArg] = process.argv;
  if (!pdfPathArg || !pageArg || !outPathArg) {
    console.error("Usage: node scripts/extract-qrh-svg.mjs <pdfPath> <pageNumber> <outPath>");
    process.exit(1);
  }
  const pdfPath = path.resolve(pdfPathArg);
  const outPath = path.resolve(outPathArg);
  const pageNumber = parseInt(pageArg, 10);
  if (!Number.isFinite(pageNumber) || pageNumber < 1) {
    console.error("Invalid page number:", pageArg);
    process.exit(1);
  }
  if (!fs.existsSync(pdfPath)) {
    console.error("PDF not found:", pdfPath);
    process.exit(1);
  }

  // Open document via official MuPDF.js
  const doc = mupdf.Document.openDocument(pdfPath);
  const total = doc.countPages();
  const zeroBasedIndex = pageNumber - 1;
  if (zeroBasedIndex < 0 || zeroBasedIndex >= total) {
    console.error(`Page ${pageNumber} out of range (1..${total})`);
    process.exit(1);
  }
  const page = doc.loadPage(zeroBasedIndex);
  const mediabox = page.getBounds();

  // Write a single-page SVG using DocumentWriter
  const outBuf = new mupdf.Buffer();
  const writer = new mupdf.DocumentWriter(outBuf, "svg", "");
  const device = writer.beginPage(mediabox);
  page.run(device, mupdf.Matrix.identity);
  writer.endPage();
  writer.close();

  // Get SVG text and inject white background
  let svgText = outBuf.asString();
  svgText = svgText.replace(/<svg([^>]*)>/, (m, attrs) => `<svg${attrs}><rect width='100%' height='100%' fill='white'/>`);

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, svgText, "utf8");
  console.log(`Wrote SVG for page ${pageNumber} to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

