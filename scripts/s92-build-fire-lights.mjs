#!/usr/bin/env node
// Builds S92 "red light" (WARNING) CWP procedure cards, unit by unit (FIRE, then ENG, ...).
// Crops each source ECL page to just the procedure content (drops the unit tab-strip,
// footer and "Continued on next page" marker) and stacks multi-page procedures into a
// single seamless image, matching the existing AW139/AW169 training-lights convention.
//
// Header banner color (sampled at a fixed point within the title band) tells warning
// (red, RGB 255/0/0) apart from caution (yellow, 255/255/0) and no-light checklists
// (gray, ~220/220/220) — see scripts/s92-check-header-color.mjs.
import fs from "fs";
import path from "path";
import mupdf from "mupdf";

const ECL_PDF = path.resolve("S92", "CHC_HS_ECL_S92.pdf");
const OUT_IMAGE_DIR = path.resolve("public", "training", "lights", "pages");
const OUT_MODEL_DATA_DIR = path.resolve("public", "model-data", "S92", "training", "lights");
const SCALE = 2.5;
const GAP_PT = 6;

const TAB_X_MAX = 55; // anything left of this is the unit tab-strip column
const RIGHT_MARGIN = 8;
// Footer + "Continued on next page" only ever appear once, right at the true bottom of a
// page, so they safely act as a hard ceiling for the crop.
const TAIL_DROP_PATTERNS = [/^ECL S92A CHC HS$/, /^\d{2} \w{3} \d{4}$/, /^Page\s/i, /^Rev:\s*\d+/i, /^Continued on next page$/i];
// "----- END -----" markers can appear mid-page (closing an alternate branch of a
// conditional table) with real content continuing below, so only drop them from the
// height calculation — they must NOT clamp the crop bottom.
const MID_DROP_PATTERNS = [/^-{3,}\s*END\s*-{3,}$/i];

// FIRE unit pilot batch: only procedures with a discrete RED master-warning annunciator.
// (1.3 POST SHUTDOWN FIRE and 1.7 FIRE/SMOKE IN CABIN OR COCKPIT have no dedicated light
// and are intentionally excluded per "red lights only".)
const LIGHTS = [
  { id: "eng-fire-ground", name: "ENG FIRE (GROUND)", pages: [10, 11], severity: "warning" }, // 1.1
  { id: "eng-fire-flight", name: "ENG FIRE (FLIGHT)", pages: [12, 13], severity: "warning" }, // 1.2
  { id: "apu-fire-ground", name: "APU FIRE (GROUND)", pages: [15, 16], severity: "warning" }, // 1.4
  { id: "apu-fire-flight", name: "APU FIRE (FLIGHT)", pages: [17, 18], severity: "warning" }, // 1.5
  { id: "smoke-baggage", name: "SMOKE IN BAGGAGE", pages: [19], severity: "warning" }, // 1.6
  // Referenced-only procedures: no discrete master-warning/caution light of their own
  // (pilot-initiated checklists, not annunciator-driven), so they're excluded from the
  // red-lights CWP grid (severity "caution" keeps them out of the warning-only filter).
  // They exist purely so the cross-reference links on the FIRE-unit cards above resolve
  // to something real instead of staying inert.
  { id: "intentional-engine-shutdown", name: "INTENTIONAL ENGINE SHUTDOWN IN FLIGHT", pages: [33, 34], severity: "caution" }, // 2.7
  { id: "ditching-emergency-landing", name: "DITCHING / EMERGENCY LANDING", pages: [216, 217], severity: "caution" }, // 14.5
  { id: "emergency-evacuation-land", name: "EMERGENCY EVACUATION ON LAND", pages: [219], severity: "caution" }, // 14.7

  // ENG unit: of 22 procedures, header-color sampling found only 2 genuine red warnings
  // (the rest are caution-level or gray checklists with no discrete light).
  { id: "engine-dual-failure", name: "ENGINE - DUAL FAILURE", pages: [25, 26], severity: "warning" }, // 2.1
  { id: "engine-single-failure", name: "ENGINE - SINGLE FAILURE", pages: [27, 28], severity: "warning" }, // 2.2
  // Referenced-only (gray checklist, no discrete light) — 2.2 links to both 2.7 (already
  // built) and 2.8, so 2.8 is added purely to resolve that link.
  { id: "engine-restart-in-flight", name: "ENGINE RESTART IN FLIGHT", pages: [35, 36], severity: "caution" }, // 2.8

  // PWRTN unit: header-color scan of all procedures found 6 genuine red warnings across
  // PWRTN (5.x) and CTRL/DCU (12.x).
  { id: "swashplate-temperature-warning", name: "SWASHPLATE TEMPERATURE WARNING", pages: [72], severity: "warning" }, // 5.2
  { id: "mgb-oil-pres-warning", name: "MGB OIL PRES - WARNING", pages: [78, 79], severity: "warning" }, // 5.7
  { id: "mgb-oil-out", name: "MGB OIL OUT", pages: [80], severity: "warning" }, // 5.8
  { id: "dcp-degrade-failure", name: "DCP DEGRADE OR FAILURE", pages: [186], severity: "warning" }, // 12.8
  { id: "dcu-mfd-comm-fault", name: "DCU - MFD COMMUNICATION FAULT", pages: [187, 188], severity: "warning" }, // 12.9
  { id: "dcu-dual-failure", name: "DCU - DUAL FAILURE", pages: [192], severity: "warning" }, // 12.11
  // Referenced-only (caution, no discrete light) — 5.7 MGB OIL PRES links to both of these.
  { id: "input-acc-hot", name: "INPUT / ACC HOT", pages: [81, 82], severity: "caution" }, // 5.9
  { id: "mgb-pump-fail", name: "MGB PUMP FAIL", pages: [83, 84, 85], severity: "caution" }, // 5.10
];

function analyzePage(doc, pageNumber1based) {
  const page = doc.loadPage(pageNumber1based - 1);
  const pageBounds = page.getBounds();
  const pageWidth = pageBounds[2];
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

  let keptBottom = 40;
  let excludedTop = Infinity;
  for (const l of lines) {
    if (l.x < TAB_X_MAX) continue;
    if (MID_DROP_PATTERNS.some((re) => re.test(l.text))) continue;
    if (TAIL_DROP_PATTERNS.some((re) => re.test(l.text))) {
      if (l.y < excludedTop) excludedTop = l.y;
      continue;
    }
    const bottom = l.y + l.h;
    if (bottom > keptBottom) keptBottom = bottom;
  }
  // Pad below the last kept line, but never bleed into an excluded line (footer /
  // "Continued on next page") that starts somewhere between the last kept line and the padding.
  const contentBottom = Math.min(keptBottom + 14, excludedTop - 4);

  const crop = { left: 50, top: 0, right: pageWidth - RIGHT_MARGIN, bottom: contentBottom };

  const rawLinks = page.getLinks();
  const links = [];
  for (const l of rawLinks) {
    const b = l.getBounds();
    if (b[0] < TAB_X_MAX) continue;
    const uri = l.getURI();
    let destPage = null;
    try {
      const idx = doc.resolveLink(uri);
      destPage = idx != null ? idx + 1 : null;
    } catch {
      destPage = null;
    }
    links.push({ bounds: b, destPage });
  }

  return { page, pageWidth, crop, links };
}

function renderLightImage(doc, pageNumbers) {
  const analyses = pageNumbers.map((p) => analyzePage(doc, p));
  const cropWidth = Math.max(...analyses.map((a) => a.crop.right - a.crop.left));
  const heightsPt = analyses.map((a) => a.crop.bottom - a.crop.top);
  const totalHeightPt = heightsPt.reduce((s, h) => s + h, 0) + GAP_PT * (analyses.length - 1);

  const deviceW = Math.ceil(cropWidth * SCALE);
  const deviceH = Math.ceil(totalHeightPt * SCALE);
  const bigPixmap = new mupdf.Pixmap(mupdf.ColorSpace.DeviceRGB, [0, 0, deviceW, deviceH], false);
  bigPixmap.clear(255);
  const bigDevice = new mupdf.DrawDevice(mupdf.Matrix.identity, bigPixmap);

  let cumulativeYDevice = 0;
  const combinedLinks = [];
  for (const a of analyses) {
    const pageDeviceW = Math.ceil((a.crop.right - a.crop.left) * SCALE);
    const pageDeviceH = Math.ceil((a.crop.bottom - a.crop.top) * SCALE);

    const pagePixmap = new mupdf.Pixmap(mupdf.ColorSpace.DeviceRGB, [0, 0, pageDeviceW, pageDeviceH], false);
    pagePixmap.clear(255);
    const matrix = [SCALE, 0, 0, SCALE, -a.crop.left * SCALE, -a.crop.top * SCALE];
    const pageDevice = new mupdf.DrawDevice(matrix, pagePixmap);
    a.page.run(pageDevice, mupdf.Matrix.identity);
    pageDevice.close();

    const image = new mupdf.Image(pagePixmap);
    const ctm = [pageDeviceW, 0, 0, pageDeviceH, 0, cumulativeYDevice];
    bigDevice.fillImage(image, ctm, 1);

    for (const link of a.links) {
      const [x0, y0, x1, y1] = link.bounds;
      combinedLinks.push({
        destPage: link.destPage,
        rect: [
          Math.round((x0 - a.crop.left) * SCALE),
          Math.round((y0 - a.crop.top) * SCALE + cumulativeYDevice),
          Math.round((x1 - a.crop.left) * SCALE),
          Math.round((y1 - a.crop.top) * SCALE + cumulativeYDevice),
        ],
      });
    }

    cumulativeYDevice += pageDeviceH + GAP_PT * SCALE;
  }
  bigDevice.close();

  return { pixmap: bigPixmap, imageWidthPx: deviceW, imageHeightPx: deviceH, links: combinedLinks };
}

function main() {
  if (!fs.existsSync(ECL_PDF)) {
    console.error("ECL PDF not found:", ECL_PDF);
    process.exit(2);
  }
  fs.mkdirSync(OUT_IMAGE_DIR, { recursive: true });
  fs.mkdirSync(OUT_MODEL_DATA_DIR, { recursive: true });

  const doc = mupdf.Document.openDocument(ECL_PDF);

  // Shared registry so cross-reference links can resolve to a light once it exists.
  const pageIndexPath = path.join(OUT_MODEL_DATA_DIR, "page-index.json");
  const pageIndex = fs.existsSync(pageIndexPath)
    ? JSON.parse(fs.readFileSync(pageIndexPath, "utf8"))
    : {};

  const manifestFiles = [];

  for (const light of LIGHTS) {
    const { pixmap, imageWidthPx, imageHeightPx, links } = renderLightImage(doc, light.pages);
    const imageFileName = `s92-${light.id}.png`;
    const imagePath = path.join(OUT_IMAGE_DIR, imageFileName);
    fs.writeFileSync(imagePath, pixmap.asPNG());

    const jsonFileName = `${light.id}.json`;
    const descriptor = [
      {
        id: light.id,
        name: light.name,
        severity: light.severity || "warning",
        description: "",
        pageImage: `/training/lights/pages/${imageFileName}`,
        imageWidth: imageWidthPx,
        imageHeight: imageHeightPx,
        links,
        modelIds: ["S92"],
      },
    ];
    fs.writeFileSync(
      path.join(OUT_MODEL_DATA_DIR, jsonFileName),
      JSON.stringify(descriptor, null, 2),
      "utf8",
    );
    manifestFiles.push(jsonFileName);

    for (const p of light.pages) pageIndex[String(p)] = light.id;

    console.log(`Built ${light.id}: ${imageWidthPx}x${imageHeightPx}px, ${links.length} link(s), pages ${light.pages.join(",")}`);
  }

  fs.writeFileSync(pageIndexPath, JSON.stringify(pageIndex, null, 2), "utf8");
  fs.writeFileSync(
    path.join(OUT_MODEL_DATA_DIR, "manifest.json"),
    JSON.stringify({ files: manifestFiles }, null, 2),
    "utf8",
  );
  console.log("Wrote manifest.json and page-index.json");
}

main();
