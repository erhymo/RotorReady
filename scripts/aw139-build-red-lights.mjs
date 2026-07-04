#!/usr/bin/env node
import fs from "fs";
import path from "path";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import mupdf from "mupdf";

const QRH_PDF = path.resolve("public/aw139/qrh/02. QRH - REV31 - 19NOV24 (1).pdf");
const OUT_PAGES_DIR = path.resolve("public/training/lights/pages");
const OUT_MODEL_DATA = path.resolve("public/model-data/AW139/training/lights");

// Drops the left-margin chapter tab (e.g. a lone "FIRE" printed sideways) and the
// bottom footer (page/rev stamp), matching the S92/AW169 training-lights convention
// so procedure cards show content only, no page furniture.
const TAB_X_MAX = 55;
const TAIL_DROP_PATTERNS = [/^Emerg-Malfunc Page\s*\d+/i, /^Rev\.\s*\d+$/i, /^Issue\s*\d+(\s*Rev\s*\d+)?$/i];

const LIGHTS = [
  { id: "rotor-low", name: "ROTOR LOW", casLabel: "ROTOR LOW", printed: 29 },
  { id: "eng-out", name: "1(2) ENG OUT", casLabel: "1(2) ENG OUT", printed: 15 },
  { id: "eng-fire", name: "1(2) ENG FIRE", casLabel: "1(2) ENG FIRE", printed: 21 },
  { id: "rotor-high", name: "ROTOR HIGH", casLabel: "ROTOR HIGH", printed: 29 },
  { id: "eng-idle", name: "1(2) ENG IDLE", casLabel: "1(2) ENG IDLE", printed: 16 },
  { id: "eec-fail", name: "1(2) EEC FAIL", casLabel: "1(2) EEC FAIL", printed: "18E" },
  { id: "mgb-oil-press", name: "MGB OIL PRESS", casLabel: "MGB OIL PRESS", printed: 30 },
  { id: "mgb-oil-temp", name: "MGB OIL TEMP", casLabel: "MGB OIL TEMP", printed: "30A" },
  { id: "eng-oil-press", name: "1(2) ENG OIL PRESS", casLabel: "1(2) ENG OIL PRESS", printed: "18E" },
  { id: "dc-gen", name: "1-2 DC GEN", casLabel: "1-2 DC GEN", printed: 11 },
  { id: "main-batt-hot", name: "MAIN BATT HOT", casLabel: "MAIN BATT HOT", printed: 14 },
  { id: "aux-batt-hot", name: "AUX BATT HOT", casLabel: "AUX BATT HOT", printed: 14 },
  { id: "bag-fire", name: "BAG FIRE", casLabel: "BAG FIRE", printed: 23 },
];

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

function findCasTablePage(pagesUpper) {
  for (let p = 1; p <= pagesUpper.length; p++) {
    const U = pagesUpper[p - 1];
    if (U.some((s) => s.includes("TABLE OF CAS WARNING MESSAGES"))) return p;
  }
  return -1;
}

function findDocPageForEmergPrinted(pagesUpper, casTablePage, printed) {
  const needle = `PAGE ${printed}`;
  for (let p = 1; p <= pagesUpper.length; p++) {
    if (p === casTablePage) continue;
    const U = pagesUpper[p - 1];
    const tail = U.slice(Math.max(0, U.length - 8));
    const has = tail.some((s) => s.includes(needle) && (s.includes("EMERG") || s.includes("EMERGENCY PROCEDURES")));
    if (has) return p;
  }
  return -1;
}

function findDocPageByHeader(pagesUpper, casLabel) {
  for (let p = 1; p <= pagesUpper.length; p++) {
    const header = pagesUpper[p - 1].slice(0, 14);
    const bad = /(TABLE OF CONTENTS|CONTENTS|INDEX|ABBREVIATIONS|GLOSSARY)/i;
    if (header.some((s) => bad.test(s))) continue;
    if (header.some((s) => s.includes(casLabel))) return p;
  }
  return -1;
}

// Distinguishes an actual chapter-tab label (short, all-caps, no digits/periods —
// e.g. "FIRE", "RTR XMSN") from body content that happens to sit near an edge, such
// as numbered step markers ("1.", "2.") or footer page refs ("Rev. 22").
function looksLikeTabLabel(text) {
  if (/[0-9.]/.test(text)) return false;
  if (text.length < 3 || text.length > 20) return false;
  return text === text.toUpperCase() && /[A-Z]/.test(text);
}

function computeCrop(mupdfDoc, pageNumber) {
  const page = mupdfDoc.loadPage(pageNumber - 1);
  const bounds = page.getBounds();
  const pageWidth = bounds[2] - bounds[0];
  const pageHeight = bounds[3] - bounds[1];
  const stext = page.toStructuredText("preserve-whitespace");
  const json = JSON.parse(stext.asJSON());

  const lines = [];
  for (const block of json.blocks || []) {
    if (block.type !== "text") continue;
    for (const line of block.lines || []) {
      const text = (line.text || "").trim();
      if (!text) continue;
      lines.push({ text, x: line.bbox.x, y: line.bbox.y, w: line.bbox.w, h: line.bbox.h });
    }
  }

  // The chapter tab (e.g. a lone "FIRE" label) sits in a narrow band at either the
  // left or right edge — printed manuals mirror it per page so it's visible from
  // either side of the bound book. Detect whichever edge it's on this page.
  let leftTabRight = 0;
  let rightTabLeft = pageWidth;
  let keptBottom = 40;
  let excludedTop = Infinity;
  for (const l of lines) {
    const inLeftZone = l.x + l.w <= TAB_X_MAX;
    const inRightZone = l.x >= pageWidth - TAB_X_MAX;
    if ((inLeftZone || inRightZone) && looksLikeTabLabel(l.text)) {
      if (inLeftZone) leftTabRight = Math.max(leftTabRight, l.x + l.w);
      if (inRightZone) rightTabLeft = Math.min(rightTabLeft, l.x);
      continue;
    }
    if (TAIL_DROP_PATTERNS.some((re) => re.test(l.text))) {
      if (l.y < excludedTop) excludedTop = l.y;
      continue;
    }
    const bottom = l.y + l.h;
    if (bottom > keptBottom) keptBottom = bottom;
  }
  const contentBottom = Number.isFinite(excludedTop)
    ? Math.min(keptBottom + 14, excludedTop - 4)
    : pageHeight - 8;
  // Tab background rectangles extend a few points past their label text, so pad
  // generously to avoid a hairline sliver of the tab color bleeding into the crop.
  const left = leftTabRight > 0 ? leftTabRight + 8 : 0;
  const right = rightTabLeft < pageWidth ? rightTabLeft - 8 : pageWidth;

  return { left, top: 0, right, bottom: contentBottom };
}

function renderSvg(mupdfDoc, pageNumber, crop) {
  const page = mupdfDoc.loadPage(pageNumber - 1);
  const cropW = crop.right - crop.left;
  const cropH = crop.bottom - crop.top;
  const outBuf = new mupdf.Buffer();
  const writer = new mupdf.DocumentWriter(outBuf, "svg", "");
  const device = writer.beginPage([0, 0, cropW, cropH]);
  const matrix = [1, 0, 0, 1, -crop.left, -crop.top];
  page.run(device, matrix);
  writer.endPage();
  writer.close();
  let svgText = outBuf.asString();
  svgText = svgText.replace(/<svg([^>]*)>/, (m, attrs) => `<svg${attrs}><rect width='100%' height='100%' fill='white'/>`);
  return svgText;
}

async function main() {
  if (!fs.existsSync(QRH_PDF)) {
    console.error("QRH PDF not found:", QRH_PDF);
    process.exit(2);
  }
  const data = new Uint8Array(fs.readFileSync(QRH_PDF));
  const doc = await pdfjs.getDocument({ data, disableFontFace: true }).promise;
  const mupdfDoc = mupdf.Document.openDocument(QRH_PDF);

  const pagesUpper = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const lines = await extractPageLines(doc, p);
    pagesUpper.push(lines.map((s) => s.toUpperCase()));
  }

  const casTablePage = findCasTablePage(pagesUpper);
  if (casTablePage < 0) {
    console.error("Could not find CAS WARNING table page in AW139 QRH.");
  }

  fs.mkdirSync(OUT_PAGES_DIR, { recursive: true });
  fs.mkdirSync(OUT_MODEL_DATA, { recursive: true });

  const manifest = [];

  for (const light of LIGHTS) {
    let docPage = -1;
    if (light.printed) {
      docPage = findDocPageForEmergPrinted(pagesUpper, casTablePage, light.printed);
    }
    if (docPage < 0) {
      docPage = findDocPageByHeader(pagesUpper, light.casLabel.toUpperCase());
    }
    if (docPage < 0) {
      console.warn(`[skip] Could not locate page for ${light.id} (${light.casLabel})`);
      continue;
    }
    try {
      const crop = computeCrop(mupdfDoc, docPage);
      const svgText = renderSvg(mupdfDoc, docPage, crop);
      const svgPath = path.join(OUT_PAGES_DIR, `aw139-${light.id}.svg`);
      fs.writeFileSync(svgPath, svgText, "utf8");
      console.log(`[map] ${light.id} -> doc page ${docPage} (printed ${light.printed})`);
      const item = [
        {
          id: light.id,
          name: light.name,
          severity: "warning",
          system: undefined,
          description: "",
          pageImage: `/training/lights/pages/aw139-${light.id}.svg`,
          modelIds: ["AW139"],
        },
      ];
      const jsonPath = path.join(OUT_MODEL_DATA, `${light.id}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(item, null, 2));
      manifest.push(`${light.id}.json`);
    } catch (e) {
      console.warn(`[render-failed] ${light.id} (doc ${docPage}):`, e?.message || e);
    }
  }

  const manifestPath = path.join(OUT_MODEL_DATA, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify({ files: manifest }, null, 2));
  console.log(`Wrote manifest with ${manifest.length} files at ${manifestPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

