#!/usr/bin/env python3
"""Two-host podcast TTS via the Gemini API (the production voice pipeline since 2026-09-20).

    python3 scripts/podcast-tts.py <script.txt> <out.mp3> [--model gemini-2.5-pro-preview-tts]
                                   [--lead Orus] [--co Aoede] [--chunk 8]

<script.txt> holds `ASH|text` / `SAGE|text` lines. Turns are sent in chunks (default 8) so both voices
share context inside a chunk; chunks are joined with a short gap, then loudnormed to -16 LUFS.
Reads GEMINI_API_KEY from the repo .env. Needs the Gemini API billing/credits active on that key's project.
Always verify the finished file against the script (whisper) before publishing.
"""
import os,sys,json,base64,urllib.request,subprocess,tempfile,wave,time,argparse,pathlib
ap=argparse.ArgumentParser(); ap.add_argument('script'); ap.add_argument('out')
ap.add_argument('--model',default='gemini-2.5-pro-preview-tts'); ap.add_argument('--lead',default='Orus'); ap.add_argument('--co',default='Aoede'); ap.add_argument('--chunk',type=int,default=8)
a=ap.parse_args()
env=pathlib.Path(__file__).resolve().parent.parent/'.env'
if 'GEMINI_API_KEY' not in os.environ and env.exists():
    for l in env.read_text().splitlines():
        if l.startswith('GEMINI_API_KEY='): os.environ['GEMINI_API_KEY']=l.split('=',1)[1].strip()
key=os.environ['GEMINI_API_KEY']; script,out,model,va,vb,chunk=a.script,a.out,a.model,a.lead,a.co,a.chunk
STYLE=("Read this as a real podcast conversation between two experienced helicopter instructors, ASH and SAGE, who enjoy explaining this to a colleague. "
"Warm, relaxed, natural, with genuine reactions in the short replies; vary pace and pitch, speed up through familiar detail, slow down on the important numbers and warnings. "
"Do not sound like an announcer. Say every word of the script exactly as written, do not add or change words.")
turns=[l.strip().split('|',1) for l in open(script) if '|' in l]
groups=[turns[i:i+chunk] for i in range(0,len(turns),chunk)]
w=tempfile.mkdtemp(); files=[]
subprocess.run(["ffmpeg","-y","-loglevel","error","-f","lavfi","-i","anullsrc=r=24000:cl=mono","-t","0.35","-c:a","pcm_s16le",w+"/gap.wav"],check=True)
for gi,g in enumerate(groups):
    text=STYLE+"\n\n"+"\n".join(f"{s}: {t}" for s,t in g)
    body={"contents":[{"parts":[{"text":text}]}],"generationConfig":{"responseModalities":["AUDIO"],"speechConfig":{"multiSpeakerVoiceConfig":{"speakerVoiceConfigs":[
      {"speaker":"ASH","voiceConfig":{"prebuiltVoiceConfig":{"voiceName":va}}},{"speaker":"SAGE","voiceConfig":{"prebuiltVoiceConfig":{"voiceName":vb}}}]}}}}
    for attempt in range(4):
        req=urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",json.dumps(body).encode(),{"Content-Type":"application/json","x-goog-api-key":key})
        try:
            r=json.load(urllib.request.urlopen(req,timeout=300)); pcm=base64.b64decode(r['candidates'][0]['content']['parts'][0]['inlineData']['data']); break
        except Exception as e:
            print("  retry",gi,attempt,str(e)[:120]); time.sleep(5*(attempt+1)); pcm=None
    if pcm is None: sys.exit("failed chunk %d"%gi)
    p=f"{w}/c{gi:02d}.wav"; x=wave.open(p,'wb'); x.setnchannels(1); x.setsampwidth(2); x.setframerate(24000); x.writeframes(pcm); x.close()
    files+=[p,w+"/gap.wav"]; print(f"  chunk {gi+1}/{len(groups)} {len(g)} turns {len(pcm)/48000:.1f}s")
open(w+"/l.txt","w").write("".join(f"file '{f}'\n" for f in files))
subprocess.run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",w+"/l.txt","-af","loudnorm=I=-16:TP=-1.5:LRA=11,aresample=44100","-c:a","libmp3lame","-q:a","3","-ac","2",out],check=True)
print("->",out)
