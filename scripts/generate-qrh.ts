// File intentionally left blank for clean rebuild

// END OF FILE
// File intentionally left blank for clean rebuild
  const s = r.toUpperCase();
  for (let i = 0; i < s.length; i++) {
    const v = map[s[i]] || 0,
      next = map[s[i + 1]] || 0;
    n += v < next ? -v : v;
  }
  return n;
}
function detectPrintedPage(lines: string[]): number | null {
  // bottom (last 5) then top (first 3)
  const zones = [lines.slice(-5), lines.slice(0, 3)];
  const reNum = /^\s*(?:p(?:age)?\.?\s*)?(\d{1,4})\s*$/i;
  const reRoman = /^\s*(?:p(?:age)?\.?\s*)?([ivxlcdm]{1,6})\s*$/i;
  for (const zone of zones) {
    for (const raw of zone) {
      const s = raw.replace(/\s+/g, " ").trim();
      if (!s || s.length > 16) continue;
      let m = reNum.exec(s);
      if (m) {
        const n = parseInt(m[1], 10);
        if (n > 0 && n < 2000) return n;
      }
      if (m) {
        const n = romanToInt(m[1]);
        if (n > 0 && n < 2000) return n;
      }
    }
  }
  return null;
}

/* ------------------------- PDF extraction ------------------------- */

async function extractPages(pdfFile: string): Promise<PageText[]> {
  const data = new Uint8Array(fs.readFileSync(pdfFile));
  const doc = await (pdfjs as any).getDocument({ data, disableFontFace: true }).promise;
  const out: PageText[] = [];

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const items = content.items as any[];

    // group by y coord -> lines
    const tol = 2;
    const rows: { y: number; parts: { x: number; s: string }[] }[] = [];
    for (const it of items) {
      const s = (it.str || "").replace(/\s+/g, " ").trim();
      if (!s) continue;
      const tr = it.transform || it?.transform?.matrix || [0, 0, 0, 0, it.x || 0, it.y || 0];
      const x = Math.round(tr[4]);
      const y = Math.round(tr[5]);
      let row = rows.find((r) => Math.abs(r.y - y) <= tol);
      if (!row) {
        row = { y, parts: [] };
        rows.push(row);
      }
      row.parts.push({ x, s });
    }
    rows.sort((a, b) => b.y - a.y);
    const lines = rows
      .map((r) => r.parts.sort((a, b) => a.x - b.x).map((p) => p.s).join(" ").replace(/\s+/g, " ").trim())
      .filter(Boolean);

    const headings: string[] = [];
    for (const ln of lines) if (isUpperHeading(ln)) headings.push(ln);
    const printed = detectPrintedPage(lines);
    out.push({ page: p, printed, lines, headings });
  }
  return out;
}

function nearestChapter(pages: PageText[], idx: number) {
  for (let p = idx; p >= 0 && p >= idx - 4; p--) {
    const hit = (pages[p]?.headings || []).find((h) => CHAPTER_PATTERNS.some((rx) => rx.test(h)));
    if (hit) return { raw: hit, clean: cleanHeading(hit), group: inferGroupFromHeading(hit) };
  }
  const fb = pages[idx]?.headings?.[0] || pages[idx - 1]?.headings?.[0] || "QRH";
  return { raw: fb, clean: cleanHeading(fb), group: inferGroupFromHeading(fb) };
}

/* ------------------------- Token helpers ------------------------- */

const NUM_THOUS = "(?:\\d{1,3}(?:[ ,]\\d{3})+|\\d+)(?:\\.\\d+)?";
const UNIT = "(KIAS|kt|kts|kg|lbs|%|°C|C|ft|psi|bar|A|V|rpm)";
const TOKEN_RE = new RegExp(`\\b(${NUM_THOUS})\\s*${UNIT}\\b`, "gi");
const PCT_RE = /\b(\d{1,3})\s*%\b/g;

function findTokensWithUnit(text: string): string[] {
  const tokens = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = TOKEN_RE.exec(text)) !== null) {
    const token = m[0].replace(/\s+/g, " ").trim();
    tokens.add(token);
  }
  return [...tokens];
}
function findPercentTokens(text: string): string[] {
  const out = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = PCT_RE.exec(text)) !== null) out.add(`${m[1]}%`);
  return [...out];
}
function findBareIntInContext(text: string): string[] {
  const out = new Set<string>();
  const m = text.match(/\b\d{1,3}\b/g);
  if (m) m.forEach((n) => out.add(n));
  return [...out];
}
function unitOfToken(tok: string): string | null {
  const m = tok.match(/\b(KIAS|kt|kts|kg|lbs|%|°C|C|ft|psi|bar|A|V|rpm)\b/i);
  return m ? m[1].toUpperCase() : tok.toUpperCase().includes("VNE -")
    ? tok.toUpperCase().includes("KIAS")
      ? "KIAS"
      : tok.toUpperCase().includes("KT")
      ? "KT"
      : null
    : null;
}

/* --------------------------- Domains ----------------------------- */

type Domain =
  | "occupants"
  | "taxi_tow_gw"
  | "aeo_torque_over_100_airspeed"
  | "gear_ext_vne_minus"
  | "one_ap_failed_airspeed"
  | "rotor_brake_pct"
  | "afcs_coupled_approach_phrase"
  | "headwind_planning_pct"

          .map(String);
      }
      if (d === "gear_ext_vne_minus") {
        // keep only "VNE - X unit" shaped
        pool = pool.filter((t) => /^VNE - \d{1,3}\s*(KIAS|kt|kts)$/i.test(t));
      }
      if (d === "afcs_coupled_approach_phrase") {
        // keep only phrases that contain "up to ... ft" and "reduce ... per 1000 ft"
        pool = pool.filter((t) => /up to\s*[0-9 ,]+\s*ft/i.test(t) && /reduce\s*[0-9]+(?:\.[0-9]+)?\s*(?:kt|kts)\s*per\s*1000\s*ft/i.test(t));
      }

      if (pool.length < 3) {
        // strict: skip if not enough real distractors
        // console.warn(`Skip (distractors<3) [${d}] @p${pg.printed ?? pg.page} — "${line.slice(0, 90)}…"`);
        continue;
      }

      const q = domainQuestion(d, line);
      if (!q) continue;

      // Compose options (correct + first 3), shuffle
      const opts = [correct, ...pool.slice(0, 3)];
      for (let k = opts.length - 1; k > 0; k--) {
        const j = Math.floor(Math.random() * (k + 1));
        [opts[k], opts[j]] = [opts[j], opts[k]];
      }
      const answer = [opts.findIndex((o) => o === correct)];
      if (answer[0] < 0) continue;

      items.push({
        id: `qrh-${sha10(`${i}-${d}-${line}-${correct}`)}`,
        section: group,
        type: "single",
        question: q,
        options: opts,
        answer,
        explanation: `Source: ${chapter} — QRH p.${pg.printed ?? pg.page}. Snippet: “${line}”`,
        references: [`QRH p.${pg.printed ?? pg.page}`],
        difficulty: "med",
        tags: [group.toLowerCase(), "qrh", d],
        source: "QRH",
      });

      if (items.length >= count) break outer;
    }
  }

  // 3) Dedup + cap
  const map = new Map<string, MCQ>();
  for (const it of items) if (!map.has(it.id)) map.set(it.id, it);
  const final = Array.from(map.values()).slice(0, count);

  // 4) Write
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({ items: final }, null, 2));
  console.log(`✅ Wrote ${final.length} STRICT items to ${outPath}`);
  if (final.length < count) {
    console.warn(`⚠️ Fewer than requested (${final.length}/${count}). STRICT mode only uses values that actually exist in the PDF and requires ≥3 real distractors.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
// END OF FILE
async function extractPages(pdfFile: string): Promise<PageText[]> {
  const data = new Uint8Array(fs.readFileSync(pdfFile));
  const doc = await (pdfjs as any).getDocument({ data, disableFontFace:true }).promise;
  const out: PageText[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const items = content.items as any[];

    const tol = 2;
    const rows: { y:number; parts:{x:number; s:string}[] }[] = [];
    for (const it of items) {
      const s = (it.str||"").replace(/\s+/g," ").trim();
      if (!s) continue;
      const tr = it.transform || it?.transform?.matrix || [0,0,0,0, it.x||0, it.y||0];
      const x = Math.round(tr[4]); const y = Math.round(tr[5]);
      let row = rows.find(r => Math.abs(r.y - y) <= tol);
      if (!row) { row = { y, parts: [] }; rows.push(row); }
      row.parts.push({ x, s });
    }
    rows.sort((a,b)=> b.y - a.y);
    const lines = rows.map(r => r.parts.sort((a,b)=> a.x - b.x).map(p => p.s).join(" ").replace(/\s+/g," ").trim()).filter(Boolean);
    const heads: string[] = []; for (const ln of lines) if (isUpperHeading(ln)) heads.push(ln);
    const printed = detectPrintedPage(lines);
    out.push({ page: p, printed, lines, headings: heads });
  }
  return out;
}
function nearestChapter(pages: PageText[], idx: number) {
  for (let p = idx; p >= 0 && p >= idx-4; p--) {
    const hit = (pages[p]?.headings||[]).find(h => CHAPTER_PATTERNS.some(rx => rx.test(h)));
    if (hit) return { raw: hit, clean: cleanHeading(hit), group: inferGroupFromHeading(hit) };
  }
  const fb = pages[idx]?.headings?.[0] || pages[idx-1]?.headings?.[0] || "QRH";
  return { raw: fb, clean: cleanHeading(fb), group: inferGroupFromHeading(fb) };
}

/* ---------- Token helpers ---------- */
const NUM_THOUS = "(?:\\d{1,3}(?:[ ,]\\d{3})+|\\d+)(?:\\.\\d+)?";
const UNIT = "(KIAS|kt|kts|kg|lbs|%|°C|C|ft|psi|bar|A|V|rpm)";
const TOKEN_RE = new RegExp(`\\b(${NUM_THOUS})\\s*${UNIT}\\b`, "gi");
const PCT_RE = /\b(\d{1,3})\s*%\b/g;

function findTokensWithUnit(text: string): string[] {
  const tokens = new Set<string>(); let m: RegExpExecArray | null;
  while ((m = TOKEN_RE.exec(text)) !== null) tokens.add(m[0].replace(/\s+/g," ").trim());
  return [...tokens];
}
function findPercentTokens(text: string): string[] {
  const out = new Set<string>(); let m: RegExpExecArray | null;
  while ((m = PCT_RE.exec(text)) !== null) out.add(`${m[1]}%`);
  return [...out];
}
function findBareIntInContext(text: string): string[] {
  const out = new Set<string>(); const m = text.match(/\b\d{1,3}\b/g);
  if (m) m.forEach(n => out.add(n)); return [...out];
}

/* ---------- Domains ---------- */
type Domain =
  | "occupants"
  | "taxi_tow_gw"
  | "aeo_torque_over_100_airspeed"
  | "gear_ext_vne_minus"
  | "one_ap_failed_airspeed"
  | "rotor_brake_pct"
  | "afcs_coupled_approach_phrase"
  | "headwind_planning_pct";

function matchDomain(line: string): Domain | null {
  const s = line.toLowerCase();
  if (/\b(max(?:imum)?\s+)?(number\s+of\s+)?(occupants|persons|people|passengers|pax)\b/.test(s) && /crew/.test(s)) return "occupants";
  if (/\bmax(?:imum)?\s+gross\s+weight\b/.test(s) && /(tow|towing|taxi)/.test(s)) return "taxi_tow_gw";
  if (/(all\s+engines\s+operative|AEO)/i.test(line) && /\btorque\b/i.test(line) && /\babove\s*100\s*%/i.test(line) && /(KIAS|kt|kts)\b/i.test(line)) return "aeo_torque_over_100_airspeed";
  if (/\b(gear|landing\s+gear)\b/i.test(line) && /\bVNE\b/.test(line) && /\bminus\b/.test(line)) return "gear_ext_vne_minus";
  if (/\bone\s+AP\s+failed\b/i.test(line) && /(KIAS|kt|kts)\b/i.test(line)) return "one_ap_failed_airspeed";
  if (/\bmaximum\s+rotor\s+speed\b/i.test(line) && /\bnormal\s+brake\s+application\b/i.test(line) && /%/.test(line)) return "rotor_brake_pct";
  if (/\bAFCS\b/i.test(line) && /\bapproach\b/i.test(line) && /\bup to\b/i.test(line) && /\breduce\b/i.test(line)) return "afcs_coupled_approach_phrase";
  if (/\b(headwind|tailwind)\b/i.test(line) && /\b(plan|planning|use|credit)\b/i.test(line) && PCT_RE.test(line)) return "headwind_planning_pct";
  return null;
}

function domainQuestion(domain: Domain): string | null {
  switch (domain) {
    case "occupants": return "What is the maximum number of occupants, including the crew?";
    case "taxi_tow_gw": return "What is the maximum gross weight for towing and taxi?";
    case "aeo_torque_over_100_airspeed": return "What is the maximum airspeed with all engines operative and torque above 100%?";
    case "gear_ext_vne_minus": return "What is the maximum landing gear extended airspeed?";
    case "one_ap_failed_airspeed": return "What is the maximum airspeed with one AP failed?";
    case "rotor_brake_pct": return "What is the maximum rotor speed for normal brake application?";
    case "afcs_coupled_approach_phrase": return "What is the maximum airspeed for AFCS coupled approach?";
    case "headwind_planning_pct": return "For planning, what percentage of headwind may be credited?";
    default: return null;
  }
}

function tokenForDomain(line: string, domain: Domain): string | null {
  if (domain === "occupants") {
    const ints = findBareIntInContext(line);
    const n = ints.map(Number).find(v => v >= 2 && v <= 30);
    return n ? String(n) : null;
  }
  if (domain === "taxi_tow_gw") {
    const t = findTokensWithUnit(line).find(t => /\b(kg|lbs)\b/i.test(t)); return t || null;
  }
  if (domain === "aeo_torque_over_100_airspeed" || domain === "one_ap_failed_airspeed") {
    const t = findTokensWithUnit(line).find(t => /(KIAS|kt|kts)\b/i.test(t)); return t || null;
  }
  if (domain === "rotor_brake_pct") {
    const p = findPercentTokens(line)[0]; return p || null;
  }
  if (domain === "gear_ext_vne_minus") {
    const m = line.match(/\bVNE\b.*?\bminus\b\s*([0-9]{1,3})\s*(KIAS|kt|kts)\b/i);
    return m ? `VNE - ${m[1]} ${m[2]}` : null;
  }
  if (domain === "afcs_coupled_approach_phrase") {
    // capture full phrase like "130 KIAS up to 5000 ft, then reduce 2 kt per 1000 ft"
    const m = line.match(/([0-9]+(?:\.[0-9]+)?\s*(?:KIAS|kt|kts).+?up to\s*[0-9 ,]+\s*ft.*?reduce\s*[0-9]+(?:\.[0-9]+)?\s*(?:kt|kts)\s*per\s*1000\s*ft)/i);
    return m ? sanitize(m[1]) : null;
  }
  if (domain === "headwind_planning_pct") {
    const p = findPercentTokens(line)[0]; return p || null;
  }
  return null;
}

/* ---------- Global pools (built once) ---------- */
type PoolEntry = { token: string; pageIdx: number };
const domainPool = new Map<Domain, PoolEntry[]>();
const unitPool = new Map<string, PoolEntry[]>(); // unit → tokens anywhere

function addTo<K>(map: Map<K, PoolEntry[]>, key: K, val: PoolEntry) {
  const arr = map.get(key) || []; arr.push(val); map.set(key, arr);
}
function unitOfToken(tok: string): string | null {
  const m = tok.match(/\b(KIAS|kt|kts|kg|lbs|%|°C|C|ft|psi|bar|A|V|rpm)\b/i);
  return m ? m[1].toUpperCase() : (tok.includes("VNE -") ? (tok.toUpperCase().includes("KIAS") ? "KIAS" : (tok.toUpperCase().includes("KT") ? "KT" : null)) : null);
}

function collectDomainDistractors(pages: PageText[], idx: number, domain: Domain, correct: string): string[] {
  const nearby = (domainPool.get(domain) || []).filter(e => Math.abs(e.pageIdx - idx) <= 2).map(e => e.token);
  const sameDomainAny = (domainPool.get(domain) || []).map(e => e.token);
  const unit = unitOfToken(correct);
  const sameUnitAny = unit ? (unitPool.get(unit) || []).map(e => e.token) : [];

  const seen = new Set<string>(); const out: string[] = [];
  function pushMany(arr: string[]) {
    for (const t of arr) {
      if (t === correct) continue;
      if (seen.has(t)) continue;
      seen.add(t); out.push(t);
      if (out.length >= 10) break; // cap pool
    }
  }
  pushMany(nearby);
  if (out.length < 3) pushMany(sameDomainAny);
  if (out.length < 3 && sameUnitAny.length) pushMany(sameUnitAny);

  return out.slice(0, 10);
}

/* ---------- Build ---------- */
async function main() {
  const pages = await extractPages(pdfPath);

  // Pre-scan to build pools
  for (let i = 0; i < pages.length; i++) {
    for (const lineRaw of pages[i].lines) {
      const line = sanitize(lineRaw);
      // unit tokens
      for (const t of findTokensWithUnit(line)) {
        const u = unitOfToken(t); if (u) addTo(unitPool, u, { token: t, pageIdx: i });
      }
      for (const p of findPercentTokens(line)) addTo(unitPool, "%", { token: p, pageIdx: i });

      // domain tokens
      const d = matchDomain(line);
      if (d) {
        const tok = tokenForDomain(line, d);
        if (tok) addTo(domainPool, d, { token: tok, pageIdx: i });
      }
    }
  }

  const items: MCQ[] = [];
  pageLoop:
  for (let i = 0; i < pages.length; i++) {
    const pg = pages[i];
    const { clean: chapter, group } = nearestChapter(pages, i);

    for (const lineRaw of pg.lines) {
      const line = sanitize(lineRaw);
      const d = matchDomain(line); if (!d) continue;
      const correct = tokenForDomain(line, d); if (!correct) continue;

      // Build distractors from pools (no invention)
      let pool = collectDomainDistractors(pages, i, d, correct);
      // Post-filter by plausibility per domain
      if (d === "occupants") {
        const c = parseInt(correct, 10);
        pool = pool.map(x => x.replace(/\D/g,"")).filter(Boolean).map(Number)
          .filter(n => n >= 2 && n <= 30 && n !== c).map(String);
      }
      // Require at least 3 distinct distractors
      if (pool.length < 3) {
        console.warn(`⏭️  Skip (not enough distractors) [${d}] @p${pg.printed ?? pg.page} — "${line.slice(0,80)}…"`);
        continue;
      }

      const q = domainQuestion(d); if (!q) continue;

      // Compose options: correct + first 3 from pool; shuffle
      const opts = [correct, ...pool.slice(0,3)];
      for (let k=opts.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1)); [opts[k],opts[j]]=[opts[j],opts[k]];}
      const answer = [opts.findIndex(o => o === correct)]; if (answer[0] < 0) continue;

      items.push({
        id: `qrh-${sha10(`${i}-${d}-${line}-${correct}`)}`,
        section: group,
        type: "single",
        question: q,
        options: opts,
        answer,
        explanation: `Source: ${chapter} — QRH p.${pg.printed ?? pg.page}. Snippet: “${line}”`,
        references: [`QRH p.${pg.printed ?? pg.page}`],
        difficulty: "med",
        tags: [group.toLowerCase(), "qrh", d],
        source: "QRH"
      });

      if (items.length >= count) break pageLoop;
    }
  }

  // Dedup + cap
  const map = new Map<string, MCQ>();
  for (const it of items) if (!map.has(it.id)) map.set(it.id, it);
  const final = Array.from(map.values()).slice(0, count);

  // Write
  fs.mkdirSync(require("path").dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({ items: final }, null, 2));
  console.log(`✅ Wrote ${final.length} STRICT items to ${outPath}`);
  if (final.length < count) console.warn(`⚠️ Fewer than requested (strict mode with global pools).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
function romanToInt(r: string) {
  const map: Record<string, number> = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
  let n = 0;
  const s = r.toUpperCase();
  for (let i=0;i<s.length;i++){
    const v = map[s[i]]||0, next = map[s[i+1]]||0;
    n += v < next ? -v : v;
  }
  return n;
}

function detectPrintedPage(lines: string[]): number | null {
  // Sjekk bunn først (siste 5 linjer), deretter topp (første 3)
  const zones = [lines.slice(-5), lines.slice(0,3)];
  const reNum = /^\s*(?:p(?:age)?\.?\s*)?(\d{1,4})\s*$/i;
  const reRoman = /^\s*(?:p(?:age)?\.?\s*)?([ivxlcdm]{1,6})\s*$/i;
  for (const zone of zones) {
    for (const raw of zone) {
      const s = raw.replace(/\s+/g," ").trim();
      if (!s) continue;
      // Unngå vanlige setningslinjer: aksepter kun korte "rene" linjer
      if (s.length > 16) continue;
      let m = reNum.exec(s);
      if (m) {
        const n = parseInt(m[1],10);
        if (n>0 && n<2000) return n;
      }
      m = reRoman.exec(s);
      if (m) {
        const n = romanToInt(m[1]);
        if (n>0 && n<2000) return n;
      }
    }
  }
  return null;
}

type MCQ = {
  id: string;
  section: string;          // LIMITATIONS | WARNINGS | PERFORMANCE | QRH
  type: "single";
  question: string;
  options: string[];        // 4 options, exact substrings from PDF (or composed "VNE - X kt" as in source)
  answer: number[];         // [index]
  explanation?: string;
  references?: string[];
  difficulty?: "easy" | "med" | "hard";
  tags?: string[];
  source?: string;
};

function arg(name: string, def?: string) {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i+1]) return process.argv[i+1];
  return def;
}

const pdfPath = arg("pdf", "data/qrh.pdf")!;
const outPath = arg("out", "public/quiz-data/generated/qrh_batch.json")!;
const count = parseInt(arg("count", "50")!, 10);

if (!fs.existsSync(pdfPath)) { console.error(`❌ PDF not found: ${pdfPath}`); process.exit(1); }

function sha10(s: string) { return crypto.createHash("sha1").update(s).digest("hex").slice(0,10); }
function sanitize(s: string) { return s.replace(/\s+/g," ").trim(); }

function isUpperHeading(line: string) {
  const s = line.trim();
  if (s.length < 3 || s.length > 120) return false;
  const letters = s.replace(/[^A-Za-z]/g, "");
  const upp = s.replace(/[^A-Z]/g, "");
  const ratio = letters.length ? upp.length/letters.length : 0;
  return ratio >= 0.6 && !/[.?]$/.test(s);
}

const CHAPTER_PATTERNS: RegExp[] = [
  /\bLIMITATIONS\b/i, /\bPERFORMANCE\b/i,
  /\bWARNING\s+LIGHTS?\b/i, /\bCAUTION\s+LIGHTS?\b/i,
  /\bNORMAL\s+PROCEDURES\b/i, /\bEMERGENCY\s+PROCEDURES\b/i,
  /\bSYSTEMS?\b/i, /\bAFCS\b.*\bLIMITATIONS\b/i
];

function inferGroupFromHeading(h: string): "LIMITATIONS"|"WARNINGS"|"PERFORMANCE"|"QRH" {
  if (/\bWARNING\s+LIGHTS?\b|\bCAUTION\s+LIGHTS?\b/i.test(h)) return "WARNINGS";
  if (/\bLIMITATIONS\b/i.test(h)) return "LIMITATIONS";
  if (/\bPERFORMANCE\b/i.test(h)) return "PERFORMANCE";
  return "QRH";
}
function cleanHeading(h: string) {
  return sanitize(h.replace(/\s*,\s*/g, " › ").replace(/[›,;:]\s*$/g,""));
}

async function extractPages(pdfFile: string): Promise<PageText[]> {
  const data = new Uint8Array(fs.readFileSync(pdfFile));
  const doc = await (pdfjs as any).getDocument({ data }).promise;
  const out: PageText[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const items = content.items as any[];

    const tol = 2;
    const rows: { y:number; parts:{x:number; s:string}[] }[] = [];
    for (const it of items) {
      const s = (it.str||"").replace(/\s+/g," ").trim();
      if (!s) continue;
      const tr = it.transform || it?.transform?.matrix || [0,0,0,0, it.x||0, it.y||0];
      const x = Math.round(tr[4]); const y = Math.round(tr[5]);
      let row = rows.find(r => Math.abs(r.y - y) <= tol);
      if (!row) { row = { y, parts: [] }; rows.push(row); }
      row.parts.push({ x, s });
    }
    rows.sort((a,b)=> b.y - a.y);
    const lines = rows.map(r => r.parts.sort((a,b)=> a.x - b.x).map(p => p.s).join(" ").replace(/\s+/g," ").trim()).filter(Boolean);

    const heads: string[] = [];
    for (const ln of lines) if (isUpperHeading(ln)) heads.push(ln);

  const printed = detectPrintedPage(lines);
  out.push({ page: p, printed: printed ?? undefined, lines, headings: heads });
  }
  return out;
}

function nearestChapter(pages: PageText[], idx: number): { clean: string; group: "LIMITATIONS"|"WARNINGS"|"PERFORMANCE"|"QRH" } {
  for (let p = idx; p >= 0 && p >= idx-4; p--) {
    const hit = (pages[p]?.headings||[]).find(h => CHAPTER_PATTERNS.some(rx => rx.test(h)));
    if (hit) return { clean: cleanHeading(hit), group: inferGroupFromHeading(hit) };
  }
  const fb = pages[idx]?.headings?.[0] || pages[idx-1]?.headings?.[0] || "QRH";
  return { clean: cleanHeading(fb), group: inferGroupFromHeading(fb) };
}

const NUM_THOUS = "(?:\\d{1,3}(?:[ ,]\\d{3})+|\\d+)(?:\\.\\d+)?";
const UNIT = "(KIAS|kt|kts|kg|lbs|%|°C|C|ft|psi|bar|A|V|rpm)";
const TOKEN_RE = new RegExp(`\\b(${NUM_THOUS})\\s*${UNIT}\\b`, "gi");
const PCT_RE = /\b(\d{1,3})\s*%\b/g;

function findTokensWithUnit(text: string): string[] {
  const tokens = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = TOKEN_RE.exec(text)) !== null) {
    const token = m[0].replace(/\s+/g," ").trim();
    tokens.add(token);
  }
  return [...tokens];
}
function findPercentTokens(text: string): string[] {
  const out = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = PCT_RE.exec(text)) !== null) out.add(`${m[1]}%`);
  return [...out];
}
function findBareIntInContext(text: string): string[] {
  const out = new Set<string>();
  const m = text.match(/\b\d{1,3}\b/g);
  if (m) m.forEach(n => out.add(n));
  return [...out];
}

type Domain =
  | "occupants"
  | "taxi_tow_gw"
  | "aeo_torque_over_100_airspeed"
  | "gear_ext_vne_minus"
  | "one_ap_failed_airspeed"
  | "rotor_brake_pct";

function matchDomain(line: string): Domain | null {
  const s = line.toLowerCase();
  if (/\b(max(?:imum)?\s+)?(number\s+of\s+)?(occupants|persons|people|passengers|pax)\b/.test(s) && /crew/.test(s)) return "occupants";
  if (/\bmax(?:imum)?\s+gross\s+weight\b/.test(s) && /(tow|towing|taxi)/.test(s)) return "taxi_tow_gw";
  if (/(all\s+engines\s+operative|AEO)/i.test(line) && /\btorque\b/i.test(line) && /\babove\s*100\s*%/i.test(line) && /(KIAS|kt|kts)\b/i.test(line)) return "aeo_torque_over_100_airspeed";
  if (/\b(gear|landing\s+gear)\b/i.test(line) && /\b(VNE)\b/i.test(line) && /\bminus\b/i.test(line)) return "gear_ext_vne_minus";
  if (/\bone\s+AP\s+failed\b/i.test(line) && /(KIAS|kt|kts)\b/i.test(line)) return "one_ap_failed_airspeed";
  if (/\bmaximum\s+rotor\s+speed\b/i.test(line) && /\bnormal\s+brake\s+application\b/i.test(line) && /%/.test(line)) return "rotor_brake_pct";
  return null;
}

function domainQuestion(domain: Domain, line: string, token: string): string | null {
  switch (domain) {
    case "occupants": return "What is the maximum number of occupants, including the crew?";
    case "taxi_tow_gw": return "What is the maximum gross weight for towing and taxi?";
    case "aeo_torque_over_100_airspeed": return "What is the maximum airspeed with all engines operative and torque above 100%?";
    case "gear_ext_vne_minus": return "What is the maximum landing gear extended airspeed?";
    case "one_ap_failed_airspeed": return "What is the maximum airspeed with one AP failed?";
    case "rotor_brake_pct": return "What is the maximum rotor speed for normal brake application?";
  }
}

function tokenForDomain(line: string, domain: Domain): string | null {
  if (domain === "occupants") {
    const ints = findBareIntInContext(line);
    if (!ints.length) return null;
    const n = ints.map(Number).find((v: number) => v >= 1 && v <= 50);
    return n ? String(n) : null;
  }
  if (domain === "taxi_tow_gw") {
    const tks = findTokensWithUnit(line).filter((t: string) => /\b(kg|lbs)\b/i.test(t));
    return tks[0] || null;
  }
  if (domain === "aeo_torque_over_100_airspeed") {
    const tks = findTokensWithUnit(line).filter((t: string) => /(KIAS|kt|kts)\b/i.test(t));
    return tks[0] || null;
  }
  if (domain === "one_ap_failed_airspeed") {
    const tks = findTokensWithUnit(line).filter((t: string) => /(KIAS|kt|kts)\b/i.test(t));
    return tks[0] || null;
  }
  if (domain === "rotor_brake_pct") {
    const pct = findPercentTokens(line);
    return pct[0] || null;
  }
  if (domain === "gear_ext_vne_minus") {
    const m = line.match(/\bVNE\b.*?\bminus\b\s*([0-9]{1,3})\s*(KIAS|kt|kts)\b/i);
    if (!m) return null;
    const unit = m[2];
    return `VNE - ${m[1]} ${unit}`;
  }
  return null;
}

function collectDomainDistractors(pages: PageText[], idx: number, domain: Domain, correct: string): string[] {
  const from = Math.max(0, idx-2), to = Math.min(pages.length-1, idx+2);
  const pool = new Set<string>();
  for (let p = from; p <= to; p++) {
    for (const lnRaw of pages[p].lines) {
      const ln = sanitize(lnRaw);
      const d = matchDomain(ln);
      if (d !== domain) continue;
      if (domain === "occupants") {
        for (const n of findBareIntInContext(ln)) pool.add(n);
      } else if (domain === "taxi_tow_gw") {
        for (const t of findTokensWithUnit(ln).filter((t: string) => /\b(kg|lbs)\b/i.test(t))) pool.add(t);
      } else if (domain === "aeo_torque_over_100_airspeed" || domain === "one_ap_failed_airspeed") {
        for (const t of findTokensWithUnit(ln).filter((t: string) => /(KIAS|kt|kts)\b/i.test(t))) pool.add(t);
      } else if (domain === "rotor_brake_pct") {
        for (const t of findPercentTokens(ln)) pool.add(t);
      } else if (domain === "gear_ext_vne_minus") {
        const m = ln.match(/\bVNE\b.*?\bminus\b\s*([0-9]{1,3})\s*(KIAS|kt|kts)\b/i);
        if (m) pool.add(`VNE - ${m[1]} ${m[2]}`);
      }
    }
  }
  pool.delete(correct);
  return [...pool];
}

async function main() {
  // 1) Extract
  const pages = await extractPages(pdfPath);

  // 2) Build items
  const items: MCQ[] = [];
  pageLoop:
  for (let i = 0; i < pages.length; i++) {
    const pg = pages[i];
    const { clean: chapter, group } = nearestChapter(pages, i);

    for (const lineRaw of pg.lines) {
      const line = sanitize(lineRaw);
      const domain = matchDomain(line);
      if (!domain) continue;

      const correct = tokenForDomain(line, domain);
      if (!correct) continue;

      const q = domainQuestion(domain, line, correct);
      if (!q) continue;

      const distractors = collectDomainDistractors(pages, i, domain, correct).filter(v => v !== correct);

      // Post-filter to keep plausible ranges per domain
      let filtered = distractors;
      if (domain === "occupants") {
        const c = parseInt(correct, 10);
        filtered = distractors
          .map(d => d.replace(/\D/g,""))
          .filter(Boolean)
          .map(Number)
          .filter(n => n >= 2 && n <= 30 && n !== c)
          .map(String);
      }

      if (filtered.length < 3) continue; // STRICT: skip if not enough plausible choices

      // Build options (correct + first 3 distractors), shuffle
      const opts = [correct, ...filtered.slice(0,3)];
      for (let k=opts.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1)); [opts[k],opts[j]]=[opts[j],opts[k]];}
      const answer = [opts.findIndex(o => o === correct)];
      if (answer[0] < 0) continue;

      items.push({
        id: `qrh-${sha10(`${i}-${domain}-${line}-${correct}`)}`,
        section: group,
        type: "single",
        question: q,
        options: opts,
        answer,
  explanation: `Source: ${chapter} — QRH p.${pg.printed ?? pg.page}. Snippet: “${line}”`,
  references: [`QRH p.${pg.printed ?? pg.page}`],
        difficulty: "med",
        tags: [group.toLowerCase(), "qrh", domain],
        source: "QRH"
      });

      if (items.length >= count) break pageLoop;
    }
  }

  // 3) Dedup + cap
  const map = new Map<string, MCQ>();
  for (const it of items) if (!map.has(it.id)) map.set(it.id, it);
  const final = Array.from(map.values()).slice(0, count);

  // 4) Write
  fs.mkdirSync(require("path").dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({ items: final }, null, 2));
  console.log(`✅ Wrote ${final.length} STRICT+DOMAIN items to ${outPath}`);
  if (final.length < count) console.warn(`⚠️ Fewer than requested (strict mode, domain-only distractors).`);
}

main().catch(e => { console.error(e); process.exit(1); });
