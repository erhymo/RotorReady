#!/usr/bin/env node
// Cheaply classifies ECL procedure pages as warning (red), caution (yellow), or
// checklist (gray) by sampling the header banner's background color, instead of
// rendering+viewing every page as an image.
import fs from "fs";
import mupdf from "mupdf";

const ECL_PDF = "S92/CHC_HS_ECL_S92.pdf";
const doc = mupdf.Document.openDocument(ECL_PDF);
const scale = 2;

function classify(pageNumber1based) {
  const page = doc.loadPage(pageNumber1based - 1);
  const matrix = mupdf.Matrix.scale(scale, scale);
  const pixmap = page.toPixmap(matrix, mupdf.ColorSpace.DeviceRGB, false, true);
  const pixels = pixmap.getPixels();
  const width = pixmap.getWidth();
  const samples = [[100, 30], [200, 30], [450, 30]];
  for (const [xPt, yPt] of samples) {
    const x = Math.round(xPt * scale);
    const y = Math.round(yPt * scale);
    const idx = (y * width + x) * 3;
    const r = pixels[idx], g = pixels[idx + 1], b = pixels[idx + 2];
    if (r > 200 && g < 100 && b < 100) return "RED";
    if (r > 200 && g > 200 && b < 100) return "YELLOW";
    if (Math.abs(r - g) < 15 && Math.abs(g - b) < 15 && r > 180 && r < 235) return "GRAY";
  }
  return "unknown";
}

const inputFile = process.argv[2];
const lines = fs.readFileSync(inputFile, "utf8").trim().split("\n");
for (const line of lines) {
  const [pageStr, ...titleParts] = line.split("\t");
  const page = parseInt(pageStr, 10);
  const title = titleParts.join("\t");
  const color = classify(page);
  console.log(`${page}\t${color}\t${title}`);
}
