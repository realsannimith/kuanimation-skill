# Narrator voice with Gemini TTS. Reads narration.json, writes audio/<scene>-<i>.wav
# and voice.js (durations + 24 fps loudness envelopes for lip sync).
# Set GEMINI_API_KEY in the environment via a secure prompt or secret manager, then:
#   python tts_gemini.py [--voice Bodi] [--model gemini-3.8-flash-tts] [--style "..."]
# The free tier allows only ~10 requests a day, so scenes go out in batches of
# several: the voice pauses two seconds between numbered lines and the audio is
# cut at those pauses. Requests: ceil(scenes / 3). Needs ffmpeg and google-genai.
import argparse, array, json, os, re, struct, subprocess, sys, time
from google import genai
from google.genai import types

ap = argparse.ArgumentParser(); ap.add_argument('--voice', default='Bodi'); ap.add_argument('--model', default='gemini-3.8-flash-tts')
ap.add_argument('--style', default='A warm, gentle storyteller speaking to children. Unhurried and clear.'); ap.add_argument('--per', type=int, default=3, help='scenes per request')
ap.add_argument('--narration', default='narration.json'); ap.add_argument('--out', default='audio'); A = ap.parse_args()
NOTES = (f"## Director's notes:\n{A.style} Each numbered line is separate: leave a full two-second silence after every line. Do not read the numbers.\n\n## Transcript:\n")
client = genai.Client(api_key=os.environ['GEMINI_API_KEY'])

def wav_from_pcm(pcm, mime):
    rate, bits = 24000, 16
    for p in mime.split(';'):
        p = p.strip()
        if p.lower().startswith('rate='): rate = int(p.split('=', 1)[1])
        elif p.startswith('audio/L'): bits = int(p.split('L', 1)[1])
    ba = bits // 8
    return struct.pack('<4sI4s4sIHHIIHH4sI', b'RIFF', 36 + len(pcm), b'WAVE', b'fmt ', 16, 1, 1, rate, rate * ba, ba, bits, b'data', len(pcm)) + pcm

def speak(text, path):
    if os.path.exists(path): return
    for attempt in range(4):
        try:
            cfg = types.GenerateContentConfig(temperature=1, response_modalities=['audio'], speech_config=types.SpeechConfig(voice_config=types.VoiceConfig(prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=A.voice))))
            audio, mime = bytearray(), ''
            for ch in client.models.generate_content_stream(model=A.model, contents=[types.Content(role='user', parts=[types.Part.from_text(text=NOTES + text)])], config=cfg):
                if ch.parts and ch.parts[0].inline_data and ch.parts[0].inline_data.data: audio.extend(ch.parts[0].inline_data.data); mime = ch.parts[0].inline_data.mime_type
            if not audio: raise RuntimeError('no audio returned')
            open(path, 'wb').write(bytes(audio) if mime.startswith('audio/wav') else wav_from_pcm(bytes(audio), mime)); return
        except Exception as e:
            msg = str(e)
            if 'PerDay' in msg: raise SystemExit('Daily free-tier quota used up; finished batches are kept, run again after the reset (midnight Pacific).')
            m = re.search(r'retry in ([\d.]+)s', msg); wait = float(m.group(1)) + 2 if m else 15 * (attempt + 1)
            print(f'  retry {attempt + 1} for {path}: {msg[:120]} (waiting {wait:.0f}s)', file=sys.stderr); time.sleep(wait)
    raise SystemExit(f'failed: {path}')

def pcm16(path): return array.array('h', subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '24000', '-f', 's16le', '-'], capture_output=True).stdout)

def cut(batch_wav, n):
    # The n-1 longest silences (20 ms windows under about -40 dBFS) split the batch into its lines.
    a = pcm16(batch_wav); win = 480; quiet = [max(abs(x) for x in a[k:k + win]) < 330 for k in range(0, len(a) - win, win)]
    runs, s = [], None
    for i, q in enumerate(quiet + [False]):
        if q and s is None: s = i
        if not q and s is not None: runs.append((s, i)); s = None
    first = next(i for i, q in enumerate(quiet) if not q); last = len(quiet) - next(i for i, q in enumerate(reversed(quiet)) if not q)
    inner = [r for r in runs if r[0] > first and r[1] < last]
    splits = sorted(sorted(inner, key=lambda r: r[1] - r[0], reverse=True)[:n - 1])
    if len(splits) != n - 1: raise SystemExit(f'{batch_wav}: found {len(splits) + 1} lines, expected {n}; delete it and rerun, or lower --per')
    bounds, prev = [], first
    for s0, s1 in splits: bounds.append((prev, s0)); prev = s1
    bounds.append((prev, last)); return a, [(b0 * win, b1 * win) for b0, b1 in bounds]

os.makedirs(A.out, exist_ok=True)
scenes = json.load(open(A.narration)); data = {s['scene']: s for s in scenes}; names = [s['scene'] for s in scenes]
batches = [names[i:i + A.per] for i in range(0, len(names), A.per)]; lines_out = {}
for k, group in enumerate(batches):
    items = [(sc, i, l[0]) for sc in group for i, l in enumerate(data[sc]['lines'])]
    bw = f'{A.out}/batch-{k}.wav'; speak('\n\n'.join(f'{j + 1}. {say}' for j, (_, _, say) in enumerate(items)), bw)
    a, bounds = cut(bw, len(items))
    for (sc, i, _), (b0, b1) in zip(items, bounds):
        seg = a[max(0, b0 - 1200):b1 + 1200]; path = f'{A.out}/{sc}-{i}.wav'; open(path, 'wb').write(wav_from_pcm(seg.tobytes(), 'audio/L16;rate=24000'))
        env = [round((sum(x * x for x in seg[m * 1000:(m + 1) * 1000]) / 1000) ** .5 / 32768, 3) for m in range(len(seg) // 1000)]
        lines_out[(sc, i)] = {'file': path, 'dur': round(len(seg) / 24000, 3), 'env': env}; print(sc, i, lines_out[(sc, i)]['dur'])
out = [{'scene': sc, 'lines': [{**lines_out[(sc, i)], 'sub': l[1] or l[0], 'sub2': l[2] if len(l) > 2 else ''} for i, l in enumerate(data[sc]['lines'])]} for sc in names]
open('voice.js', 'w').write("'use strict';\n// Generated by tts_gemini.py: narrator lines, durations (s), 24 fps loudness envelopes.\nconst VOICE = " + json.dumps(out, ensure_ascii=False) + ";\n")
print('total speech', round(sum(l['dur'] for s in out for l in s['lines']), 1), 's')
