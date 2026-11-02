# Family game workshop

This repo holds small browser games made with Claude. An adult (the son's mother) does the typing;
her 9-year-old son comes up with the ideas. Replies get read out or shown to him.

## The games

| Game | File | Play link (never changes) |
|---|---|---|
| عالم الألوان (Arabic colors) | `arabic-colors.html` | https://claude.ai/artifact/WgJDPdkMmw2MBJbLH14UjG |
| لوحة نجوم البطل (star board, behavior chart) | `stars.html` (icon `stars-icon.png`) | https://claude.ai/artifact/NBqa4CeS5jvizkcKZhARA8 |
| أبطال جدول الضرب: حرس القلعة (times tables 1–12 as castle defense: 12 kingdoms, monster armies in rows × columns, fog/train/gold waves, bosses, 12 dragons that teach each table's secrets, endless tower; shared hero and shop) | `times.html` (icon `times-icon-v2.png`) | https://claude.ai/artifact/CmKzHECmNEE6h54e6fMF3v |
| مدينة الكلام Talk Town (English speaking by voice: Robo's maze driven by spoken commands, a painter that draws what you describe plus copy-the-picture challenges, Leo the alien who asks questions and reacts; star scoring for full sentences, typing fallback, my-words collection; shared hero and shop) | `talk-town.html` (icon `talk-town-icon-v2.png`) | https://claude.ai/artifact/2RVpNvvYo4R255Mp6wT7vQ |
| قراصنة القسمة (division 1–12 as a pirate voyage: share treasure fairly with the crew, pack barrels, Koko the parrot takes the remainder, torn maps, message bottles, gold ship, kraken and Captain Shanbo bosses, 12 crew animals that teach each number's secrets, shipyard, stormy sea; shared hero and shop) | `division.html` (icon `division-icon-v2.png`) | https://claude.ai/artifact/KxUGqCXTyvSjDuDXns71mK |
| صاروخ القراءة Reading Rocket (English reading as space missions: word monsters to zap for sounds and sight words, a detective office where clues are read to catch the thief, escape rooms solved by reading notes with on/under/in/behind, choose-your-path stories with read-aloud stars and many endings, tap any word for its meaning; shared hero and shop) | `reading-rocket.html` (icon `reading-rocket-icon-v2.png`) | https://claude.ai/artifact/KQ8qtJN2HdDmqH6fGvqY6d |
| عالم الأبطال الصغار (behavior program for parents and kids: daily missions with stars and real rewards, a star-sprout friend that hatches and grows, 7 mini games, 7 choose-your-path stories plus Claude-written ones, calm corner with breathing, badges and certificate, protected parent area with approvals, behavior tracking, reports and tips; its own stars and gems, not the shared hero) | `little-heroes.html` | https://claude.ai/artifact/8vPtRDZAXhNvkq1EyfuakR |
| النجمة الصغيرة (short illustrated story read aloud sentence by sentence with the Azure voice, clips in `little-star/voices/`) | `little-star.html` | https://claude.ai/artifact/5WGrZYdLs2hk3EVd8cxjAA |

Add a row here for every new game.

Shared hero: the games share one hero and one gem wallet (browser storage key `rakan-world-v1`). This only
works on the GitHub Pages links, where all games live on the same site; each play link keeps its own copy.
Some games are built from `src/` (a shared kit plus one folder per game): for those, step 1 of "Changing a game"
means editing the files in `src/` and then running `python3 src/build.py <game>`, which rewrites `<game>.html`.

Each game is one standalone HTML file in the repo root: a full `<!DOCTYPE html>` document with all
its CSS and JavaScript inline, made for phone screens and touch, with a start button.

## No music

She asked for no music at all, in every game: no background music, melodies, jingles or musical tones.
Spoken voices (speech) are fine. Avoid music-themed content too (songs, singing, dancing, musical chairs).

## Making a new game

When she describes a game that isn't in the table yet:

1. Build it as a new file named after the game, such as `cat-jump.html`. Make it fun and polished:
   drawn characters (canvas or SVG, not plain shapes), sound effects that start after the first tap,
   a score, and a way to play again.
2. Then do steps 2 to 5 of "Changing a game". In step 3, publish it as a new artifact (no `url`) and
   add its row to the table above, with the play link the publish returns, in the same commit.

## Changing a game

Unless she names another game, "the game" means the one changed most recently.
These steps are the routine: do all of them, every time, without stopping to ask first.

1. Make the change in the game file.
2. Check it still works: `node tools/check-game.js <file>`. Fix anything it reports before going on.
   It saves a screenshot; look at it when the change is visual.
3. Update the play link in place, so it stays the same:
   - `python3 tools/artifact-page.py <file> <scratchpad>/<file>` writes the page version
     (the same game without the outer html/head/body tags, which the Artifact tool adds itself).
   - If this session hasn't read or published that artifact yet, read it first
     (Artifact `action: "read"` with its play link).
   - Publish the page version with `url` set to the game's play link from the table.
     Never make a second artifact for a game that already has one.
4. Commit with a short message that says what changed, and push straight to `main`.
   The repo owner allows this: no branches or pull requests.
5. Reply, and end with both links: first the play link, then the GitHub Pages link that opens the
   game directly: `https://<owner>.github.io/<repo>/<file>` (owner and repo come from `git remote get-url origin`).
   She asked for a GitHub link at the end of every update, one that opens the game, not the code. No technical details in the reply,
   unless something is broken and she has to act.

"Undo that" or "put it back" means revert the last change to that game (`git revert`), then do steps 2 to 5.

## How to reply

- Write so it can be read out to a 9-year-old: short sentences, simple words, no code or tech terms.
- Say what changed in one to three short bullet points, then suggest two or three fun ideas to try next.
- End every reply, even one that changed no game, with the GitHub Pages link that opens the game page
  itself (`https://<owner>.github.io/<repo>/<file>`, for the game being talked about or the one changed most
  recently), never a link to the code on GitHub.
- Be encouraging. If something can't be done, say why in simple words and offer the closest thing that can.
- Keep everything kid-friendly: cartoon action is fine; no gore, horror, bad language, or real brands and logos.
- Don't ask for personal details such as the boy's full name, school or address.

## Helper scripts

If `tools/check-game.js` or `tools/artifact-page.py` is missing, create it with the code below
and commit it together with the first game.

### tools/check-game.js

```js
// Opens a game in headless Chromium, presses its first button (Start / Launch / Play),
// flies around for a few seconds and reports script errors.
// usage: node tools/check-game.js my-game.html
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const file = path.resolve(process.argv[2] || 'my-game.html');
  const shot = path.join(os.tmpdir(), path.basename(file, '.html') + '-check.png');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 2 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto('file://' + file);
  await page.waitForTimeout(2000);
  const start = page.locator('button:visible').first();
  if (await start.count()) await start.click().catch(() => {});
  for (let i = 0; i < 80; i++) {
    await page.mouse.move(195 + Math.sin(i / 6) * 140, 620);
    await page.waitForTimeout(50);
  }
  await page.screenshot({ path: shot });
  await browser.close();

  console.log('screenshot: ' + shot);
  if (errors.length) {
    console.log('ERRORS:\n' + errors.map(e => '  ' + e).join('\n'));
    process.exit(1);
  }
  console.log('OK: no errors');
})();
```

### tools/artifact-page.py

```python
#!/usr/bin/env python3
"""Turn a standalone game file into the page version the Artifact tool publishes.

The Artifact tool wraps every page in its own <!DOCTYPE html>/<head>/<body>
skeleton, so the published file keeps only what goes inside those tags.

usage: python3 tools/artifact-page.py my-game.html /path/to/out.html
"""
import re
import sys

src, out = sys.argv[1], sys.argv[2]
html = open(src, encoding='utf-8').read()
head = re.search(r'<head[^>]*>(.*?)</head>', html, re.S | re.I)
body = re.search(r'<body[^>]*>(.*)</body>', html, re.S | re.I)
if not head or not body:
    sys.exit(f'{src}: expected a full HTML document with <head> and <body>')

# the skeleton already has the charset and viewport tags
head_inner = re.sub(r'<meta\s+(charset|name="viewport")[^>]*>\s*', '', head.group(1), flags=re.I)
with open(out, 'w', encoding='utf-8') as f:
    f.write(head_inner.strip() + '\n\n' + body.group(1).strip() + '\n')
print(f'wrote {out}')
```

# Spoken voices in games and programs

Spoken lines in games and programs here come from Microsoft Azure neural text-to-speech; the owner picked
it after listening to it, Gemini and the device's own voice. Lines are generated ahead of time with
`tools/game-voices.py` and shipped as MP3 files next to the game, so games work offline, cost nothing per
player and never hold the key. Never call Azure from a page: anyone who opens it could take the key.

The owner wants this voice only: every game and story that speaks uses these Azure clips, never the
device's own voice (speechSynthesis). New games are built that way, and older games move over to it one
at a time, each after the owner has checked its vowelled lines.

## Writing the lines

- Full tashkeel on every word. Azure follows the diacritics it is given and guesses the rest, and its
  guesses were wrong often enough to hear. The script warns about any Arabic word with no haraka. Write
  the grammatical case ending on a sentence's last word too; Azure pauses there by itself («قَادِمٌ.» is
  read «قَادِمْ»).
- Show the owner the vowelled lines before generating, so they can check the tashkeel.
- Voice: `ar-SA-HamedNeural` (male, Saudi) by default; `ar-SA-ZariyahNeural` (female, Saudi) is the other
  one the owner liked. `python3 tools/game-voices.py --check` lists every Arabic voice.

## Generating

Keep the lines in a JSON file beside the game, e.g. `star-blaster-lines.json`:

```json
{"voice": "ar-SA-HamedNeural",
 "lines": [{"id": "start", "text": "مَرْحَبًا يَا بَطَلُ!"},
           {"id": "boss",  "text": "تَحْذِيرٌ! التِّنِّينُ قَادِمٌ."}]}
```

```
python3 tools/game-voices.py star-blaster-lines.json --out star-blaster/voices
```

It writes `<id>.mp3` per line and `manifest.json`, and remakes only lines whose text or voice changed.
Commit the lines file, the clips and the manifest. When a game is published as an Artifact, pass the clips
and the manifest in `files` under the same `voices/` path the game loads them from.

## Playing them in a game

```js
// voices.start() inside the first tap (the Start button), then voices.say('boss') from anywhere.
// A game with its own Web Audio context passes it and its output node: voices.start(AU.ctx, AU.master).
const voices = {
  ctx: null, out: null, buf: {},
  async start(ctx, out, dir = 'voices'){
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = ctx || (AC ? new AC() : null);
    if (!this.ctx) return;
    this.out = out || this.ctx.destination;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    try {
      const m = await (await fetch(dir + '/manifest.json')).json();
      await Promise.all(m.lines.map(async l => {
        this.buf[l.id] = await this.ctx.decodeAudioData(await (await fetch(dir + '/' + l.file)).arrayBuffer());
      }));
    } catch (e) { console.warn('voices not loaded', e); }
  },
  say(id){
    const b = this.buf[id];
    if (!b) return;
    const s = this.ctx.createBufferSource();
    s.buffer = b; s.connect(this.out); s.start();
  },
};
```

Web Audio unlocked by that first tap is what lets a line play later from a game event on iPhone; there,
`new Audio(...).play()` outside a tap is blocked.

## Games moving over

- Times tables (`times.html`) and Division (`division.html`): every line is drafted in `times-lines.json`
  and `division-lines.json`. They are built by `python3 src/voices/make-lines.py`, so fix the script, not the JSON;
  the facts are made from its number words. Sent to the owner for the tashkeel check on 2 Nov 2026.
  Both games already play these clips and no longer use the device voice (`src/kit/clips.js`, `CLIPS.say(id)`;
  it loads `times/voices/manifest.json` or `division/voices/manifest.json` and stays silent until they exist).
  Each line id says when it is spoken: `intro-N` on the intro pages, `tut-N` in the first lesson,
  `m-A-B` / `d-D-Q` after every answer and on the learn pages, `dragon-N` / `mate-N` when a friend joins,
  and the rest for waves, rounds, bosses, wins and losses.
  What is left, once she approves: run `tools/game-voices.py` for both files into `times/voices` and
  `division/voices`, commit the clips, and republish both games with their clips in `files`
  (e.g. `"times/voices/m-3-4.mp3": "times/voices/m-3-4.mp3"` for every clip, plus the manifest).

## Setup and limits

- `AZURE_SPEECH_KEY` is an environment variable in the cloud environment (not a Network secret: Azure
  reads the key from its own header). Network access is Full, or Limited with
  `qatarcentral.tts.speech.microsoft.com` under Allowed domains. The region is qatarcentral unless
  `AZURE_SPEECH_REGION` says otherwise.
- Azure's free tier: 500,000 characters a month (about 10,000 vowelled lines) and about 20 requests a
  minute; the script waits when told to slow down. When the month's quota runs out, Azure refuses until
  the next month and nothing is charged.
