#!/usr/bin/env python3
"""Record many short English lines with an Azure neural voice, in batches, for games that speak thousands of them.

The Ollie English parts (2.html ... 7.html) say about 8,000 different sentences and words. One request per line
would take hours at Azure's ~20 requests a minute, so this asks for up to BATCH lines at once with a long pause
between them, cuts the audio at those pauses (ffmpeg silencedetect) and checks that the number of pieces matches;
a batch that does not split cleanly is halved and asked again, down to single lines.

Each clip is named by a hash of its text, so the same sentence in several parts is recorded once:
  <out>/<hash>.mp3        the line, trimmed, leveled to TARGET_LUFS, 48 kbps mono
  <out>/<hash>-slow.mp3   for lines listed under "slow": the same clip stretched to 75% speed, same pitch
Already-made clips are skipped. Needs ffmpeg and the same AZURE_SPEECH_KEY setup as game-voices.py.

The input is JSON: {"voice": "en-US-AvaNeural", "lines": ["Hello!", ...], "slow": ["Hello!", ...]}.
usage: python3 tools/english-voices.py lines.json --out ollie/voices
"""
import argparse
import hashlib
import importlib.util
import json
import re
import subprocess
import sys
from pathlib import Path
from xml.sax.saxutils import escape

spec = importlib.util.spec_from_file_location('gv', Path(__file__).with_name('game-voices.py'))
gv = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gv)

BATCH = 24
GAP_MS = 1800      # pause Azure puts between lines
CUT_S = 1.1        # silences at least this long are cuts
TARGET_LUFS = -16.0
RATE = gv.RATE


def clip_id(text):
    return hashlib.sha1(text.encode()).hexdigest()[:12]


def run(args, pcm=None):
    return subprocess.run(['ffmpeg', '-hide_banner', '-nostats', *args], input=pcm, capture_output=True, check=True)


def pieces(pcm):
    """Cut raw PCM at long silences; returns a list of PCM byte strings."""
    err = run(['-f', 's16le', '-ar', str(RATE), '-ac', '1', '-i', 'pipe:0',
               '-af', f'silencedetect=noise=-45dB:d={CUT_S}', '-f', 'null', '-'], pcm).stderr.decode()
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', err)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', err)]
    total = len(pcm) / 2 / RATE
    bounds, t = [], 0.0
    for s, e in zip(starts, ends):
        if s > t + 0.05:
            bounds.append((t, s))
        t = e
    if total > t + 0.05:
        bounds.append((t, total))
    out = []
    for a, b in bounds:
        i, j = int(max(0, a - 0.05) * RATE) * 2, int(min(total, b + 0.05) * RATE) * 2
        seg = pcm[i:j]
        if len(seg) > RATE * 2 * 0.12:  # drop clicks shorter than 120 ms
            out.append(seg)
    return out


def save(pcm, dest):
    measured = run(['-f', 's16le', '-ar', str(RATE), '-ac', '1', '-i', 'pipe:0', '-af', 'ebur128', '-f', 'null', '-'], pcm).stderr.decode()
    found = re.findall(r'I:\s+(-?[\d.]+) LUFS', measured)
    gain = TARGET_LUFS - float(found[-1]) if found and float(found[-1]) > -70 else 0
    run(['-y', '-f', 's16le', '-ar', str(RATE), '-ac', '1', '-i', 'pipe:0',
         '-af', f'volume={gain:.1f}dB,alimiter=limit=0.794:level=0', '-codec:a', 'libmp3lame', '-b:a', '48k', str(dest)], pcm)


def speak(key, region, voice, texts):
    lang = '-'.join(voice.split('-')[:2])
    body = f'<break time="{GAP_MS}ms"/>'.join(escape(t) for t in texts)
    ssml = (f"<speak version='1.0' xml:lang='{lang}'><voice name='{voice}'>"
            f"<break time='300ms'/>{body}</voice></speak>")
    return gv.azure(key, region, 'v1', ssml.encode())


def record(key, region, voice, texts, out, log):
    pcm = speak(key, region, voice, texts)
    parts = pieces(pcm)
    if len(parts) == len(texts):
        for t, p in zip(texts, parts):
            save(p, out / f'{clip_id(t)}.mp3')
        log(len(texts))
        return
    if len(texts) == 1:  # one line that has a long pause inside: keep it whole
        save(pcm, out / f'{clip_id(texts[0])}.mp3')
        log(1)
        return
    mid = len(texts) // 2
    record(key, region, voice, texts[:mid], out, log)
    record(key, region, voice, texts[mid:], out, log)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    ap.add_argument('lines', type=Path)
    ap.add_argument('--out', type=Path, required=True)
    args = ap.parse_args()
    if not gv.FFMPEG:
        sys.exit('needs ffmpeg')
    spec_ = json.loads(args.lines.read_text(encoding='utf-8'))
    voice = spec_.get('voice', 'en-US-AvaNeural')
    lines = list(dict.fromkeys(t.strip() for t in spec_['lines'] if t.strip()))
    args.out.mkdir(parents=True, exist_ok=True)
    todo = [t for t in lines if not (args.out / f'{clip_id(t)}.mp3').exists()]
    print(f'{len(lines)} lines, {len(todo)} to record, {sum(map(len, todo))} characters, voice {voice}', flush=True)
    done = [0]

    def log(n):
        done[0] += n
        if done[0] % 200 < n or done[0] == len(todo):
            print(f'  {done[0]}/{len(todo)}', flush=True)

    key, region = gv.credentials()
    for i in range(0, len(todo), BATCH):
        record(key, region, voice, todo[i:i + BATCH], args.out, log)

    slow = 0
    for t in dict.fromkeys(spec_.get('slow', [])):
        src, dest = args.out / f'{clip_id(t)}.mp3', args.out / f'{clip_id(t)}-slow.mp3'
        if src.exists() and not dest.exists():
            run(['-y', '-i', str(src), '-af', 'atempo=0.75', '-codec:a', 'libmp3lame', '-b:a', '48k', str(dest)])
            slow += 1
    print(f'done: {done[0]} recorded, {slow} slow copies made')


if __name__ == '__main__':
    main()
