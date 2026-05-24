import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const desktopDir = path.join(process.env.HOME || ".", "Desktop", "RotorReady-Flat-Icon-Exact-Website");
fs.mkdirSync(desktopDir, { recursive: true });

const outputs = [
  ["ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png", 1024],
  ["android/app/src/main/res/mipmap-mdpi/ic_launcher.png", 48],
  ["android/app/src/main/res/mipmap-hdpi/ic_launcher.png", 72],
  ["android/app/src/main/res/mipmap-xhdpi/ic_launcher.png", 96],
  ["android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png", 144],
  ["android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png", 192],
  ["android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png", 48],
  ["android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png", 72],
  ["android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png", 96],
  ["android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png", 144],
  ["android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png", 192],
  ["android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png", 108],
  ["android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png", 162],
  ["android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png", 216],
  ["android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png", 324],
  ["android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png", 432],
  ["public/icon-512x512.png", 512],
  ["public/icon-192x192.png", 192],
  ["public/apple-touch-icon.png", 180],
  ["public/apple-icon-180.png", 180],
  ["public/icon-512x512-maskable.png", 512],
  ["public/icon-192x192-maskable.png", 192],
  ["public/manifest-icon-512.maskable.png", 512],
  ["public/manifest-icon-192.maskable.png", 192],
  [path.join(desktopDir, "rotorready-app-icon-1024.png"), 1024],
  [path.join(desktopDir, "rotorready-app-icon-512.png"), 512],
  [path.join(desktopDir, "rotorready-app-icon-192.png"), 192],
  [path.join(desktopDir, "rotorready-apple-touch-icon-180.png"), 180],
];

function findInterLatinFont() {
  const cssDir = path.join(".next", "static", "css");
  if (!fs.existsSync(cssDir)) return null;

  for (const file of fs.readdirSync(cssDir)) {
    if (!file.endsWith(".css")) continue;
    const css = fs.readFileSync(path.join(cssDir, file), "utf8");
    const faces = css.match(/@font-face\{[^}]+\}/g) || [];
    const latinFace = faces.find((face) => face.includes("font-family:Inter") && face.includes("u+00??"));
    const fontPath = latinFace?.match(/url\(([^)]+\.woff2)\)/)?.[1];
    if (fontPath) return path.join(".next", fontPath.replace("/_next/", ""));
  }

  return null;
}

function htmlForIcon(size, interFontPath) {
  const fontUrl = interFontPath
    ? `data:font/woff2;base64,${fs.readFileSync(interFontPath).toString("base64")}`
    : null;
  const logoSvg = fs
    .readFileSync("public/app-icon.svg", "utf8")
    .replace("<svg ", `<svg width="${size}" height="${size}" style="display:block;background:#fff" `);

  return `<!doctype html>
<html>
  <head>
    <style>
      ${fontUrl ? `@font-face{font-family:Inter;src:url("${fontUrl}") format("woff2");font-weight:100 900;font-style:normal;font-display:block;}` : ""}
      html,body{margin:0;width:${size}px;height:${size}px;background:#fff;overflow:hidden;font-synthesis:none;}
      svg{width:${size}px;height:${size}px;background:#fff;}
    </style>
  </head>
  <body>${logoSvg}</body>
</html>`;
}

function browserExecutablePath() {
  const candidates = [
    chromium.executablePath(),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ];

  return candidates.find((candidate) => candidate && fs.existsSync(candidate));
}

const interFontPath = findInterLatinFont();
if (!interFontPath) {
  console.warn("Inter font not found in .next. Run `npm run build` first for exact website font rendering.");
}

const browser = await chromium.launch({ executablePath: browserExecutablePath() });
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });

for (const [file, size] of outputs) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(htmlForIcon(size, interFontPath), { waitUntil: "load" });
  const interLoaded = await page.evaluate(async () => {
    await document.fonts.load("800 58px Inter");
    await document.fonts.ready;
    return document.fonts.check("800 58px Inter");
  });
  if (!interLoaded) throw new Error("Inter font failed to load; refusing to render fallback-font icons.");

  const png = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: size, height: size } });
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await sharp(png)
    .flatten({ background: "#ffffff" })
    .removeAlpha()
    .png({ compressionLevel: 9 })
    .toFile(file);

  const meta = await sharp(file).metadata();
  console.log(`${file} ${meta.width}x${meta.height} alpha=${Boolean(meta.hasAlpha)}`);
}

await browser.close();

fs.writeFileSync(
  path.join(desktopDir, "README.txt"),
  [
    "RotorReady flat icon assets",
    "",
    "Use rotorready-app-icon-1024.png for App Store / iOS app icon uploads if Apple asks for a 1024x1024 icon.",
    "The iOS project icon has also been updated at ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png.",
    "",
    "Design: dark RotorReady app icon matching the website mark: #09090B background, #2E6EA1 circle, white RR, no alpha.",
  ].join("\n"),
);
