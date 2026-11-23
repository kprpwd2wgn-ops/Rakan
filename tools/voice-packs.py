#!/usr/bin/env python3
"""Put a game's recorded clips into a few pack files, so a page with hundreds of lines ships as a handful of files.

An Artifact play link holds at most about 500 files, and every clip was one file. A pack is the clips' MP3 files
joined end to end (an MP3 file is a run of frames, so each clip's bytes stay exactly as recorded). packs.json
says, for every line, its pack, where its bytes start, how many there are, and a hash of the text it was made
from; the page fetches a pack once, cuts one clip out with ArrayBuffer.slice and decodes it, and plays a line
only when the hash matches its own text (so a line changed since the recording stays silent instead of
saying the old words).

The lines file is the one tools/game-voices.py records from, with a "pack" name per line (default "core").
Only clips whose manifest entry has the line's current text are packed.

usage: python3 tools/voice-packs.py genius-challenge-lines.json genius-challenge/voices
       (writes genius-challenge/voices/pack-<name>.mp3 and genius-challenge/voices/packs.json)
"""
import json
import sys
from pathlib import Path


def fnv36(text):
    """FNV-1a over the text's code points, as base 36: the same as hash(text).toString(36) in the page."""
    h = 2166136261
    for ch in text:
        h ^= ord(ch)
        h = (h * 16777619) & 0xFFFFFFFF
    digits, out = '0123456789abcdefghijklmnopqrstuvwxyz', ''
    while True:
        h, r = divmod(h, 36)
        out = digits[r] + out
        if not h:
            return out


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__.split('usage: ')[1])
    lines = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))['lines']
    out = Path(sys.argv[2])
    manifest = {l['id']: l for l in json.loads((out / 'manifest.json').read_text(encoding='utf-8'))['lines']}
    packs, index, missing = {}, {}, []
    for line in lines:
        got = manifest.get(line['id'])
        clip = out / f"{line['id']}.mp3"
        if not got or got['text'] != line['text'] or not clip.exists():
            missing.append(line['id'])
            continue
        name = line.get('pack') or 'core'
        data = clip.read_bytes()
        buf = packs.setdefault(name, bytearray())
        index[line['id']] = [name, len(buf), len(data), fnv36(line['text'])]
        buf.extend(data)
    for old in out.glob('pack-*.mp3'):
        if old.stem[5:] not in packs:
            old.unlink()
    for name, buf in packs.items():
        (out / f'pack-{name}.mp3').write_bytes(bytes(buf))
    (out / 'packs.json').write_text(json.dumps({'packs': {n: f'pack-{n}.mp3' for n in sorted(packs)}, 'c': index},
                                               ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    size = sum(len(b) for b in packs.values())
    print(f'{len(index)} clips in {len(packs)} packs ({size / 1e6:.1f} MB); '
          + (f'{len(missing)} lines not recorded yet: {" ".join(missing[:12])}{" …" if len(missing) > 12 else ""}' if missing else 'every line packed'))


if __name__ == '__main__':
    main()
