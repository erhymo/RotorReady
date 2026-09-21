#!/usr/bin/env python3
"""Verify app content against the official manuals by READING THE PAGE IMAGES.

Why this exists: on 2026-09-21 a wrong AFCS engagement table (GA/TD/TDH ranges) was found in the published app even
though text-based checks had passed, because `pdftotext` scrambles multi-row table cells and both the content and the
checks used the same scrambled text. This tool never trusts text dumps as evidence: for every content unit it retrieves
the most likely manual pages (text dump is used ONLY to find candidate pages), renders them to images, and asks a
vision model whether every statement in the unit is supported. Output is a per-unit ledger plus a report of anything
that is not clearly supported. It FLAGS; a human/Claude reviews the flags against the page images.

    python3 scripts/verify/verify_claims.py --model AW169_EP --kind system-notes [--only afcs] [--limit 5]
    python3 scripts/verify/verify_claims.py --model AW169_EP --kind quick-reference
    python3 scripts/verify/verify_claims.py --model AW169_EP --kind system-notes --file /tmp/old-note.json --ledger /tmp/l.json

Units already `supported` in the ledger with an unchanged text hash AND unchanged source revision are skipped, so a
scheduled run only re-checks what changed (or everything after a new RFM/QRH revision).
Needs GEMINI_API_KEY (repo .env) and poppler (pdftoppm, pdftotext).
"""
import os, sys, re, json, hashlib, base64, subprocess, argparse, pathlib, time, math, collections, urllib.request, concurrent.futures, threading

ROOT = pathlib.Path(__file__).resolve().parents[2]
CACHE = ROOT / '.verify-cache'
CACHE.mkdir(exist_ok=True)

# Source registry. `text` is a page-delimited text dump used ONLY for candidate retrieval.
SOURCES = {
    'AW169_EP': {
        'rev': 'RFM EP Issue 1 Rev 5; QRH EP Issue 1 Rev 3',
        'rfm_text': '_source/rfm/aw169-ep-rfm-pages.txt',
        'rfm_parts': [
            (1, 1858, '_source/rfm/RFM AW169/AW169 EP/AW169 RFM EP Issue 1 Rev 5 - Part 1 of 4 (pages 1-1858).pdf'),
            (1859, 2787, '_source/rfm/RFM AW169/AW169 EP/AW169 RFM EP Issue 1 Rev 5 - Part 2 of 4 (pages 1859-2787).pdf'),
            (2788, 3252, '_source/rfm/RFM AW169/AW169 EP/AW169 RFM EP Issue 1 Rev 5 - Part 3 of 4 (pages 2788-3252).pdf'),
            (3253, 3716, '_source/rfm/RFM AW169/AW169 EP/AW169 RFM EP Issue 1 Rev 5 - Part 4 of 4 (pages 3253-3716).pdf'),
        ],
        'qrh_pdf': 'public/aw169/QRH EP AW169/AW169 QRH EP Issue 1 Rev. 3.pdf',
    },
    'AW169': {
        'rev': 'RFM Standard Issue 3 Rev 1',
        'rfm_text': '_source/rfm/aw169-rfm-pages.txt',
        'rfm_parts': [(1, 3614, '_source/rfm/RFM AW169/Standard/RFM Issue 3. Rev.1.pdf')],
        'qrh_pdf': None,
    },
}

FILES = {
    'system-notes': 'public/system-notes/{m}.json',
    'quick-reference': 'public/quick-reference/{m}.json',
}


def load_env():
    if 'GEMINI_API_KEY' not in os.environ and (ROOT / '.env').exists():
        for l in (ROOT / '.env').read_text().splitlines():
            if l.startswith('GEMINI_API_KEY='):
                os.environ['GEMINI_API_KEY'] = l.split('=', 1)[1].strip()


# ----------------------------------------------------------------------------- page index (retrieval only)
TOK = re.compile(r"[a-z0-9][a-z0-9./%°-]*")


def is_toc(body):
    return len(re.findall(r'\.{5,}\s*[0-9A-Za-z-]{1,8}\s*$', body, re.M)) > 12


SYN = {'rod': 'rate descent', 'descent': 'rod', 'cat': 'category', 'agl': 'height', 'kts': 'kt knots', 'kt': 'kts knots', 'ils': 'instrument landing',
       'mtow': 'maximum weight', 'ias': 'indicated airspeed', 'ap': 'autopilot', 'wl': 'wing level'}


def toks(s):
    return [t.strip('.-/') for t in TOK.findall(s.lower()) if len(t.strip('.-/')) > 0]


class Index:
    def __init__(self, src):
        self.pages = {}   # ('RFM'|'QRH', n) -> set(tokens)
        txt = (ROOT / src['rfm_text']).read_text()
        parts = re.split(r"=== DOC PAGE (\d+) ===\n", txt)      # [pre, n1, body1, n2, body2, ...]; works with or without ---PAGE-DELIM---
        for i in range(1, len(parts) - 1, 2):
            body = parts[i + 1].split('---PAGE-DELIM---')[0]
            if is_toc(body):   # table of contents pages match everything
                continue
            self.pages[('RFM', int(parts[i]))] = set(toks(body))
        if not self.pages:
            sys.exit(f"no RFM pages could be indexed from {src['rfm_text']}: refusing to run without evidence")
        q = subprocess.run(['pdftotext', '-layout', str(ROOT / src['qrh_pdf']), '-'], capture_output=True, text=True).stdout if src.get('qrh_pdf') else ''
        for i, body in enumerate(q.split('\f'), 1):
            if body.strip() and not is_toc(body):
                self.pages[('QRH', i)] = set(toks(body))
        df = collections.Counter()
        for s in self.pages.values():
            df.update(s)
        n = len(self.pages)
        self.idf = {t: math.log(n / (1 + c)) for t, c in df.items()}

    def top(self, claim, k_rfm=4, k_qrh=2):
        q = set(toks(claim))
        for t in list(q):
            q.update(SYN.get(t, '').split())
        nums = {t for t in q if re.search(r'\d', t)}
        scores = []
        for key, s in self.pages.items():
            hit = q & s
            if not hit:
                continue
            sc = sum(self.idf.get(t, 0) for t in hit) + 1.5 * sum(self.idf.get(t, 0) for t in hit & nums)
            scores.append((sc, key))
        scores.sort(reverse=True)
        out, cr, cq = [], 0, 0
        for sc, key in scores:
            if key[0] == 'RFM' and cr < k_rfm:
                out.append((key, round(sc, 1))); cr += 1
            elif key[0] == 'QRH' and cq < k_qrh:
                out.append((key, round(sc, 1))); cq += 1
            if cr >= k_rfm and cq >= k_qrh:
                break
        return out


def render(src, key):
    kind, n = key
    out = CACHE / f"{src['name']}-{kind}-{n}.png"
    if out.exists():
        return out
    if kind == 'RFM':
        for a, b, pdf in src['rfm_parts']:
            if a <= n <= b:
                page, path = n - a + 1, pdf
                break
    else:
        page, path = n, src['qrh_pdf']
    stem = str(out)[:-4]
    subprocess.run(['pdftoppm', '-f', str(page), '-l', str(page), '-r', '110', '-png', '-singlefile', str(ROOT / path), stem], check=True)
    return out


# ----------------------------------------------------------------------------- units
def units_system_notes(data):
    for note in data['notes']:
        slug, title = note['slug'], note['title']
        for si, sec in enumerate(note.get('sections', [])):
            head = sec.get('heading', '')
            for pi, p in enumerate(sec.get('paragraphs', [])):
                if re.search(r'\d', p):
                    yield f"{slug}/{si}/p{pi}", f"System note '{title}', section '{head}', paragraph", p
            if 'table' in sec:
                cols = sec['table']['columns']
                for ri, row in enumerate(sec['table']['rows']):
                    cells = '; '.join(f"{c}: {v}" for c, v in zip(cols, row))
                    yield f"{slug}/{si}/r{ri}", f"System note '{title}', table '{head}', one row (columns {cols})", cells
            if sec.get('note') and re.search(r'\d', sec['note']):
                yield f"{slug}/{si}/note", f"System note '{title}', section '{head}', table note", sec['note']


def units_quick_reference(data):
    for gi, g in enumerate(data['groups']):
        for ii, it in enumerate(g['items']):
            yield f"qr/{gi}/{ii}", f"Quick Reference group '{g['title']}', item '{it['label']}'", ' / '.join(it['lines'])


# ----------------------------------------------------------------------------- model call
LOCK = threading.Lock()
USAGE = collections.Counter()

PROMPT = """You are a meticulous verifier for a pilot study app. The app makes the CLAIM below about a helicopter, and the manual pages (images) are the only authority.

CLAIM CONTEXT: {ctx}
CLAIM TEXT:
{claim}

Decide, from the page images ONLY, whether EVERY statement in the claim is supported: every number, unit, condition, range, and above all WHICH ITEM (row/mode/case) each value belongs to. Read tables cell by cell and row by row; do not assume that a value shown near a label belongs to it, check the row borders. Ignore differences in wording, ordering or rounding that do not change the meaning. Do not use outside knowledge.

Classify every problem you find with a severity:
- "material": a value, unit, condition or range that is wrong, attached to the wrong row/mode/case, or contradicted by the pages.
- "omission": the manual gives an ADDITIONAL VALUE or RANGE for the same parameter of the same item that the claim leaves out, so the value the claim states is incomplete (for example a second engagement range for the same mode), or the claim purports to list all members of a group and leaves some out.
- "minor": everything else, including a missing or loose unit label such as "AGL", a missing qualifier such as "low speed", extra wording such as "cruise", paraphrase, or additional behaviour/context that the claim simply does not mention. A claim is a summary: do NOT report things it does not mention as omissions.
Answer with JSON: {{"verdict": "supported" | "partially_supported" | "contradicted" | "not_found", "issues": [{{"severity": "material" | "omission" | "minor", "statement": "the exact statement from the claim", "problem": "what the pages say instead, or that it is not on the pages", "evidence": "short exact quote or cell content from the page", "page": "printed page label, e.g. 1-34"}}], "pages_used": ["printed page labels"]}}
Use "not_found" only if the pages do not contain the information at all. Use "supported" when there are no material or omission issues (minor issues may still be listed). If everything is supported and complete, issues must be an empty list."""


def call(model, ctx, claim, images):
    key = os.environ['GEMINI_API_KEY']
    parts = [{"text": PROMPT.format(ctx=ctx, claim=claim)}]
    for label, path in images:
        parts.append({"text": f"IMAGE: {label}"})
        parts.append({"inline_data": {"mime_type": "image/png", "data": base64.b64encode(path.read_bytes()).decode()}})
    body = {"contents": [{"parts": parts}], "generationConfig": {"temperature": 0, "responseMimeType": "application/json"}}
    last = None
    for attempt in range(7):
        req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent", json.dumps(body).encode(),
                                     {"Content-Type": "application/json", "x-goog-api-key": key})
        try:
            r = json.load(urllib.request.urlopen(req, timeout=240))
            u = r.get('usageMetadata', {})
            with LOCK:
                USAGE[model + ':in'] += u.get('promptTokenCount', 0)
                USAGE[model + ':out'] += u.get('candidatesTokenCount', 0) + u.get('thoughtsTokenCount', 0)
            txt = r['candidates'][0]['content']['parts'][0]['text']
            res = json.loads(txt)
            if isinstance(res, list):
                res = next((x for x in res if isinstance(x, dict)), None)
            if not isinstance(res, dict) or 'verdict' not in res:
                raise ValueError('unexpected model output: ' + txt[:100])
            return res
        except Exception as e:
            last = str(e)[:150]
            rate = '429' in last or '503' in last or '500' in last
            time.sleep(min(150, 20 * 2 ** attempt) if rate else 4 * (attempt + 1))   # back off hard on rate limits
    return {"verdict": "error", "issues": [{"statement": "-", "problem": last, "evidence": "", "page": ""}], "pages_used": []}


def judged(res):
    """pass | fail | unlocated | error for one reader result."""
    v = res.get('verdict')
    if v == 'error':
        return 'error'
    if v == 'not_found':
        return 'unlocated'
    if v == 'supported' and not res.get('pages_used'):
        return 'unlocated'                    # a pass with no cited page is not evidence
    bad = [i for i in res.get('issues', []) if i.get('severity', 'material') in ('material', 'omission')]
    if v in ('contradicted', 'partially_supported') and not res.get('issues'):
        return 'fail'
    return 'fail' if bad else 'pass'


def verify_unit(idx, src, uid, ctx, claim, models, args):
    def run(model, k_rfm, k_qrh):
        cands = idx.top(ctx + ' ' + claim, k_rfm, k_qrh)
        images = [(f"{k[0]} page {k[1]}", render(src, k)) for k, _ in cands]
        return call(model, ctx, claim, images), [f"{k[0]}:{k[1]}" for k, _ in cands]
    if not idx.top(ctx + ' ' + claim, 1, 1):
        return {"id": uid, "context": ctx, "text": claim, "hash": hashlib.sha1(claim.encode()).hexdigest()[:12], "source_rev": src['rev'], "candidates": [],
                "readers": {}, "status": "unlocated", "strong": False, "checked": time.strftime('%Y-%m-%d %H:%M')}
    first, cands = run(models[0], args.k_rfm, args.k_qrh)
    rec = {"id": uid, "context": ctx, "text": claim, "hash": hashlib.sha1(claim.encode()).hexdigest()[:12], "source_rev": src['rev'],
           "candidates": cands, "readers": {models[0]: first}}
    if judged(first) == 'unlocated':          # retrieval may have missed the page: look at many more pages before giving up
        first, cands = run(models[0], args.k_rfm + 8, args.k_qrh + 4)
        rec['readers'][models[0]] = first; rec['candidates'] = cands; rec['widened'] = True
    if judged(first) != 'pass' and len(models) > 1:   # second independent reader (different model, wider retrieval)
        second, cands2 = run(models[1], args.k_rfm + 3, args.k_qrh + 2)
        rec['readers'][models[1]] = second; rec['candidates'] = sorted(set(rec['candidates']) | set(cands2))
    js = [judged(r) for r in rec['readers'].values()]
    valid = [j for j in js if j != 'error']
    if not valid:
        rec['status'] = 'error'
    elif all(j == 'pass' for j in valid):
        rec['status'] = 'ok' if len(valid) == len(js) else 'error'
    elif 'pass' in valid:
        rec['status'] = 'disputed'            # readers disagree -> a human/Claude must look at the page
    elif all(j == 'unlocated' for j in valid):
        rec['status'] = 'unlocated'           # nobody found the page: needs a human to point at the source
    else:
        rec['status'] = 'flag'                # every working reader found a problem
    minor = [i for r in rec['readers'].values() for i in r.get('issues', []) if i.get('severity') == 'minor']
    if minor:
        rec['minor'] = minor
    rec['strong'] = 'pro' in models[0]      # units checked only by flash-class readers are re-checked when a pro reader is available
    rec['checked'] = time.strftime('%Y-%m-%d %H:%M')
    return rec


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', required=True)
    ap.add_argument('--kind', required=True, choices=list(FILES))
    ap.add_argument('--file', help='verify this JSON file instead of the one in public/ (regression tests)')
    ap.add_argument('--ledger', help='ledger path (default docs/verification/<model>/<kind>.json)')
    ap.add_argument('--only', help='only units whose id starts with this')
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--readers', default='gemini-3.1-pro-preview,gemini-3.7-flash', help='first reader, then the second opinion for non-supported units')
    ap.add_argument('--jobs', type=int, default=3)
    ap.add_argument('--k-rfm', type=int, default=4); ap.add_argument('--k-qrh', type=int, default=2)
    ap.add_argument('--recheck', action='store_true', help='ignore the ledger and check everything')
    ap.add_argument('--require-strong', action='store_true', help='re-check units that were only verified by flash-class readers')
    args = ap.parse_args()
    load_env()
    src = dict(SOURCES[args.model]); src['name'] = args.model
    data = json.load(open(args.file or ROOT / FILES[args.kind].format(m=args.model)))
    units = list((units_system_notes if args.kind == 'system-notes' else units_quick_reference)(data))
    if args.only:
        units = [u for u in units if u[0].startswith(args.only)]
    lpath = pathlib.Path(args.ledger) if args.ledger else ROOT / 'docs' / 'verification' / args.model / f'{args.kind}.json'
    lpath.parent.mkdir(parents=True, exist_ok=True)
    ledger = json.load(open(lpath)) if lpath.exists() else {}
    todo = []
    for uid, ctx, claim in units:
        h = hashlib.sha1(claim.encode()).hexdigest()[:12]
        old = ledger.get(uid)
        if not args.recheck and old and old.get('hash') == h and old.get('source_rev') == src['rev'] and old.get('status') == 'ok' and (old.get('strong') or not args.require_strong):
            continue
        todo.append((uid, ctx, claim))
    if args.limit:
        todo = todo[:args.limit]
    print(f"{len(units)} units, {len(todo)} to check ({len(units) - len(todo)} unchanged and already verified)", flush=True)
    if not todo:
        return
    idx = Index(src)
    models = args.readers.split(',')
    done = 0
    with concurrent.futures.ThreadPoolExecutor(args.jobs) as ex:
        futs = {ex.submit(verify_unit, idx, src, uid, ctx, claim, models, args): uid for uid, ctx, claim in todo}
        for f in concurrent.futures.as_completed(futs):
            rec = f.result(); ledger[rec['id']] = rec; done += 1
            print(f"  [{done}/{len(todo)}] {rec['status']:9} {rec['id']}", flush=True)
            json.dump(ledger, open(lpath, 'w'), indent=1, ensure_ascii=False)
    # keep the ledger limited to units that still exist
    live = {u[0] for u in units}
    for k in list(ledger):
        if k not in live and not args.file:
            del ledger[k]
    json.dump(ledger, open(lpath, 'w'), indent=1, ensure_ascii=False)
    # human/Claude review decisions (docs/verification/<model>/reviews.json): {kind: {unit_id: {hash, decision, note, by, date}}}
    rpath = lpath.parent / 'reviews.json'
    reviews = json.load(open(rpath)).get(args.kind, {}) if rpath.exists() else {}
    for r in ledger.values():
        rv = reviews.get(r['id'])
        if rv and rv.get('hash') == r['hash'] and r['status'] != 'ok':
            r['review'] = rv
    counts = collections.Counter('reviewed-ok' if (r.get('review') and r['status'] != 'ok') else r['status'] for r in ledger.values())
    print("ledger:", dict(counts), "| tokens:", dict(USAGE))
    # markdown report of everything not ok
    rep = [f"# Verification report: {args.model} / {args.kind}", f"Sources: {src['rev']}. Generated {time.strftime('%Y-%m-%d %H:%M')}. Status counts: {dict(counts)}", ""]
    for r in sorted(ledger.values(), key=lambda r: r['id']):
        if r['status'] == 'ok' or r.get('review'):
            continue
        rep += [f"## {r['status'].upper()}: {r['id']}", f"*{r['context']}*", "", f"> {r['text']}", ""]
        for m, res in r['readers'].items():
            rep.append(f"- **{m}**: {res.get('verdict')}")
            for i in res.get('issues', []):
                rep.append(f"  - `{i.get('statement')}` -> {i.get('problem')} (page {i.get('page')}: \"{i.get('evidence')}\")")
        rep += [f"- candidate pages: {', '.join(r['candidates'])}", ""]
    (lpath.parent / f'{args.kind}-report.md').write_text('\n'.join(rep))
    print("report ->", lpath.parent / f'{args.kind}-report.md')


if __name__ == '__main__':
    main()
