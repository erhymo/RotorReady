#!/usr/bin/env node
import fs from "fs";
import path from "path";
import mupdf from "mupdf";
import sharp from "sharp";

const RFM_PDF = path.resolve("AW139", "00. Leonardo Helicopter Flight Manual Rev. 32 (3).pdf");
const SCALE = 6; // render at 6x for crisp raster output of vector line art

// slug -> { page, figure, cropY: [y0, y1] in PDF points (full page width used) }
const TARGETS = {
  "ground-and-elevated-heliport-vertical-take-off": {
    page: 886,
    figure: "Figure 2A-1 Take-Off Profile Ground Level, Elevated Heliport/Helideck",
    cropY: [90, 302],
  },
  "offshore-helideck-take-off": {
    page: 1093,
    figure: "Figure 2E-1 Take-Off Profile Offshore Helideck",
    cropY: [78, 372],
  },
  "clear-area-take-off": {
    page: 1136,
    figure: "Figure 2F-1 Take-Off Profile Clear Area",
    cropY: [264, 496],
  },
  "heliport-landing": {
    page: 1199,
    figure: "Figure 2G-1 Normal Landing Profile (Normal LDP)",
    cropY: [112, 322],
  },
  "offshore-helideck-landing": {
    page: 1262,
    figure: "Figure 2I-1 Normal Landing Profile, PF in RH Seat",
    cropY: [78, 552],
    rotate: 90,
  },
  "clear-area-landing": {
    page: 1314,
    figure: "Figure 2J-1 Landing Profile",
    cropY: [296, 478],
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
    const bounds = page.getBounds(); // [x0,y0,x1,y1]
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
<!-- ${slug}.svg : pixel-perfect crop of the original AW139 RFM vector figure, rendered at ${SCALE}x -->
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMinYMin meet">
  <title>${figure}</title>
  <image href="data:image/png;base64,${b64}" width="${w}" height="${h}" />
</svg>
`;
    const outDir = path.resolve("public", "aw139", "procedures", slug);
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
