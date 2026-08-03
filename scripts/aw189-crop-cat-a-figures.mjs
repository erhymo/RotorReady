#!/usr/bin/env node
import fs from "fs";
import path from "path";
import mupdf from "mupdf";
import sharp from "sharp";

const RFM_PDF = path.resolve("AW189", "AW189 RFM Issue 2_Rev_14_[E] - CHSC.pdf");
const SCALE = 6;

const TARGETS = {
  "ground-and-elevated-heliport-vertical-take-off": {
    page: 896,
    figure: "Figure S4A-2 Take-Off Profile Vertical Heliport Procedure (RFM Supplement 4, Part A)",
    cropY: [94, 300],
  },
  "clear-area-take-off": {
    page: 942,
    figure: "Figure S4B-2 Take-Off Profile Clear Area (RFM Supplement 4, Part B)",
    cropY: [81, 250],
  },
  "offshore-helideck-take-off": {
    page: 1010,
    figure: "Figure S4C-4 Offshore Helideck Normal Take-Off Profile (RFM Supplement 4, Part C)",
    cropY: [79, 365],
  },
  "heliport-landing": {
    page: 1068,
    figure: "Figure S4E-2 Ground Heliport Landing Profile (RFM Supplement 4, Part E)",
    cropY: [94, 345],
  },
  "clear-area-landing": {
    page: 1092,
    figure: "Figure S4F-2 Clear Area Landing Profile (RFM Supplement 4, Part F)",
    cropY: [81, 290],
  },
  "offshore-helideck-landing": {
    page: 1109,
    figure: "Figure S4G-2 Offshore Helideck Landing Profile (RFM Supplement 4, Part G)",
    cropY: [79, 552],
    rotate: 90,
  },
};

async function main() {
  if (!fs.existsSync(RFM_PDF)) {
    console.error("RFM PDF not found:", RFM_PDF);
    process.exit(2);
  }
  const doc = mupdf.Document.openDocument(RFM_PDF);

  for (const [slug, { page: pageNumber, figure, cropY, rotate }] of Object.entries(TARGETS)) {
    const page = doc.loadPage(pageNumber - 1);
    const bounds = page.getBounds();
    const matrix = mupdf.Matrix.scale(SCALE, SCALE);
    const pixmap = page.toPixmap(matrix, mupdf.ColorSpace.DeviceRGB, false);
    const pngBytes = Buffer.from(pixmap.asPNG());

    const pageWidthPt = bounds[2] - bounds[0];
    const [y0pt, y1pt] = cropY;
    const left = 0;
    const top = Math.round(y0pt * SCALE);
    const width = Math.round(pageWidthPt * SCALE);
    const height = Math.round((y1pt - y0pt) * SCALE);

    let pipeline = sharp(pngBytes).extract({ left, top, width, height });
    if (rotate) pipeline = pipeline.rotate(rotate);
    const cropped = await pipeline.png().toBuffer();

    const b64 = cropped.toString("base64");
    const meta = await sharp(cropped).metadata();
    const w = meta.width;
    const h = meta.height;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<!-- ${slug}.svg : pixel-perfect crop of the original AW189 RFM vector figure, rendered at ${SCALE}x -->
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMinYMin meet">
  <title>${figure}</title>
  <image href="data:image/png;base64,${b64}" width="${w}" height="${h}" />
</svg>
`;
    const outDir = path.resolve("public", "aw189", "procedures", slug);
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `${slug}.svg`);
    fs.writeFileSync(outPath, svg, "utf8");
    console.log(`Wrote ${outPath} (${w}x${h}, from PDF page ${pageNumber}, cropY=${cropY})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
