#!/usr/bin/env python3
"""Two-host podcast TTS via the Gemini API (the production voice pipeline since 2026-09-20).

    python3 scripts/podcast-tts.py <script.txt> <out.mp3> [--model gemini-2.5-pro-preview-tts]
        [--lead Orus] [--co Aoede] [--chunk 8] [--work DIR] [--redo 2,17] [--verify]

<script.txt> holds `ASH|text` / `SAGE|text` lines (lines without `|` are ignored, so `#` comments are fine).
Turns are sent in chunks (default 8) so both voices share context inside a chunk; chunks are joined with a short
gap, then loudnormed to -16 LUFS. Reads GEMINI_API_KEY from the repo .env. The key's project needs Gemini API credits.

Gemini sometimes DROPS or garbles text (seen 2026-09-20: a whole reply skipped, a sentence missing). Use --verify:
every chunk is transcribed with whisper (WHISPER_MODEL = a ggml *small.en* or larger model; base.en is too weak),
compared with the script, and regenerated up to 3 times if words are missing. Numbers and spelled-out acronyms are
ignored in the comparison (whisper writes digits), so a warning about numbers still needs a human ear.
--work DIR keeps the chunk wavs so an interrupted run resumes and --redo 2,17 regenerates only those chunks (1-based).
"""
import os, sys, json, base64, urllib.request, subprocess, tempfile, wave, time, argparse, pathlib, re, difflib, shutil

ap = argparse.ArgumentParser()
ap.add_argument('script'); ap.add_argument('out')
ap.add_argument('--model', default='gemini-2.5-pro-preview-tts')
ap.add_argument('--lead', default='Orus'); ap.add_argument('--co', default='Aoede')
ap.add_argument('--chunk', type=int, default=8)
ap.add_argument('--work', help='directory for chunk wavs (kept between runs)')
ap.add_argument('--redo', default='', help='comma-separated 1-based chunk numbers to regenerate')
ap.add_argument('--verify', action='store_true', help='whisper-check every new chunk and retry on missing words')
ap.add_argument('--min-cover', type=float, default=0.93)
ap.add_argument('--max-gap', type=int, default=6, help='longest tolerated run of missing words')
a = ap.parse_args()

env = pathlib.Path(__file__).resolve().parent.parent / '.env'
if 'GEMINI_API_KEY' not in os.environ and env.exists():
    for l in env.read_text().splitlines():
        if l.startswith('GEMINI_API_KEY='):
            os.environ['GEMINI_API_KEY'] = l.split('=', 1)[1].strip()
key = os.environ['GEMINI_API_KEY']

STYLE = ("Read this as a real podcast conversation between two experienced helicopter instructors, ASH and SAGE, who enjoy explaining this to a colleague. "
         "Warm, relaxed, natural, with genuine reactions in the short replies; vary pace and pitch, speed up through familiar detail, slow down on the important numbers and warnings. "
         "Do not sound like an announcer. Say every word of the script exactly as written, in the order written, and do not skip, merge, add or change any word.")

turns = [l.strip().split('|', 1) for l in open(a.script) if '|' in l]
groups = [turns[i:i + a.chunk] for i in range(0, len(turns), a.chunk)]
work = pathlib.Path(a.work) if a.work else pathlib.Path(tempfile.mkdtemp())
work.mkdir(parents=True, exist_ok=True)
redo = {int(x) for x in a.redo.split(',') if x.strip()}

NUM = set("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand and point minus plus".split())


def norm(t):
    w = re.findall(r"[a-z0-9']+", t.lower().replace('-', ' '))
    return [x for x in w if x not in NUM and not x.isdigit() and len(x) > 1]


def synth(g):
    text = STYLE + "\n\n" + "\n".join(f"{s}: {t}" for s, t in g)
    body = {"contents": [{"parts": [{"text": text}]}], "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"multiSpeakerVoiceConfig": {"speakerVoiceConfigs": [
        {"speaker": "ASH", "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": a.lead}}},
        {"speaker": "SAGE", "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": a.co}}}]}}}}
    for attempt in range(4):
        req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{a.model}:generateContent", json.dumps(body).encode(),
                                     {"Content-Type": "application/json", "x-goog-api-key": key})
        try:
            r = json.load(urllib.request.urlopen(req, timeout=300))
            return base64.b64decode(r['candidates'][0]['content']['parts'][0]['inlineData']['data'])
        except Exception as e:
            print("  retry", attempt, str(e)[:120], flush=True); time.sleep(5 * (attempt + 1))
    sys.exit("Gemini call failed")


def write_wav(path, pcm):
    x = wave.open(str(path), 'wb'); x.setnchannels(1); x.setsampwidth(2); x.setframerate(24000); x.writeframes(pcm); x.close()


def check(path, g):
    """Return (coverage, longest missing run, missing text) of the script chunk against a whisper transcript of the wav."""
    model = os.environ.get('WHISPER_MODEL')
    if not model or not shutil.which('whisper-cli'):
        sys.exit("--verify needs whisper-cli and WHISPER_MODEL=<path to ggml-small.en.bin or larger>")
    seg = pathlib.Path(tempfile.mkdtemp())
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(path), "-ar", "16000", "-ac", "1", "-f", "segment", "-segment_time", "25", str(seg / "s_%03d.wav")], check=True)
    hyp = ""
    for f in sorted(seg.glob("s_*.wav")):
        hyp += " " + subprocess.run(["whisper-cli", "-m", model, "-f", str(f), "-nt"], capture_output=True, text=True).stdout
    shutil.rmtree(seg, ignore_errors=True)
    ref = norm(" ".join(t for _, t in g)); h = norm(hyp)
    sm = difflib.SequenceMatcher(None, ref, h, autojunk=False)
    cov = sum(n for _, _, n in sm.get_matching_blocks()) / max(len(ref), 1)
    gaps = [(a2 - a1, " ".join(ref[a1:a2])) for tag, a1, a2, _, _ in sm.get_opcodes() if tag in ('delete', 'replace') and a2 > a1]
    gap = max(gaps, default=(0, ""))
    return cov, gap[0], gap[1]


subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", "0.35", "-c:a", "pcm_s16le", str(work / "gap.wav")], check=True)
files = []
report = []
for gi, g in enumerate(groups):
    n = gi + 1
    p = work / f"c{gi:02d}.wav"
    if not p.exists() or n in redo:
        best = None
        for attempt in range(3 if a.verify else 1):
            pcm = synth(g)
            write_wav(p, pcm)
            if not a.verify:
                break
            cov, gap, missing = check(p, g)
            print(f"  chunk {n}/{len(groups)} attempt {attempt + 1}: coverage {cov:.2f}, longest missing run {gap}" + (f" ({missing[:80]})" if gap > a.max_gap else ""), flush=True)
            if best is None or (gap, -cov) < (best[1], -best[0]):
                best = (cov, gap, pcm)
            if cov >= a.min_cover and gap <= a.max_gap:
                break
        if a.verify and best is not None and not (best[0] >= a.min_cover and best[1] <= a.max_gap):
            write_wav(p, best[2]); print(f"  WARNING chunk {n}: still incomplete after retries (coverage {best[0]:.2f}, gap {best[1]}) - listen to it", flush=True)
        report.append((n, best[0] if best else None, best[1] if best else None))
    else:
        print(f"  chunk {n}/{len(groups)} reused", flush=True)
    files += [str(p), str(work / "gap.wav")]
    print(f"  chunk {n}/{len(groups)} {len(g)} turns {wave.open(str(p)).getnframes() / 24000:.1f}s", flush=True)

(work / "l.txt").write_text("".join(f"file '{f}'\n" for f in files))
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(work / "l.txt"), "-af", "loudnorm=I=-16:TP=-1.5:LRA=11,aresample=44100", "-c:a", "libmp3lame", "-q:a", "3", "-ac", "2", a.out], check=True)
print("->", a.out, flush=True)
