# Family game workshop

This repo holds small browser games made with Claude. An adult (the son's mother) does the typing;
her 9-year-old son comes up with the ideas. Replies get read out or shown to him.

## The games

| Game | File | Play link (never changes) |
|---|---|---|
| عالم الألوان (Arabic colors) | `arabic-colors.html` | https://claude.ai/artifact/WgJDPdkMmw2MBJbLH14UjG |
| لوحة نجوم البطل (star board, behavior chart) | `stars.html` (icon `stars-icon.png`) | https://claude.ai/artifact/NBqa4CeS5jvizkcKZhARA8 |
| أبطال جدول الضرب: حرس القلعة (times tables 1–12 as castle defense: 12 kingdoms, monster armies in rows × columns, fog/train/gold waves, bosses, 12 dragons that teach each table's secrets, endless tower; shared hero and shop) | `times.html` (icon `times-icon-v2.png`) | https://claude.ai/artifact/CmKzHECmNEE6h54e6fMF3v |
| مدينة الكلام Talk Town (English speaking by voice: Robo's maze driven by spoken commands (18 mazes with keys and doors), a painter that draws what you describe plus 18 copy-the-picture challenges and a gallery of saved paintings, Leo the alien who asks questions and reacts, Leo's TV studio where the child is the reporter and asks Leo the questions (8 shows); star scoring for full sentences, typing fallback, my-words grouped by topic, city ranks, noise-only sound effects; shared hero and shop) | `talk-town.html` (icon `talk-town-icon-v2.png`) | https://claude.ai/artifact/2RVpNvvYo4R255Mp6wT7vQ |
| قراصنة القسمة (division 1–12 as a pirate voyage: share treasure fairly with the crew, pack barrels, Koko the parrot takes the remainder, torn maps, message bottles, gold ship, kraken and Captain Shanbo bosses, 12 crew animals that teach each number's secrets, shipyard, stormy sea; shared hero and shop) | `division.html` (icon `division-icon-v2.png`) | https://claude.ai/artifact/KxUGqCXTyvSjDuDXns71mK |
| صاروخ القراءة Reading Rocket (English reading as space missions: word monsters to zap for sounds and sight words, a picture planet where a sentence is read and the matching drawn picture chosen (12 levels: colors, numbers, sizes, on/under/in/next to/behind, not), a detective office where clues are read to catch the thief, 12 escape rooms solved by reading notes with on/under/in/behind/between, 8 choose-your-path stories with read-along word highlighting, read-aloud stars and many endings, tap any word for its meaning, a word book with a meaning quiz, astronaut ranks, noise-only sound effects; shared hero and shop) | `reading-rocket.html` (icon `reading-rocket-icon-v2.png`) | https://claude.ai/artifact/KQ8qtJN2HdDmqH6fGvqY6d |
| عالم الأبطال الصغار (behavior program for parents and kids: daily missions with stars and real rewards, a star-sprout friend that hatches and grows, 7 mini games, 7 choose-your-path stories plus Claude-written ones, calm corner with breathing, badges and certificate, protected parent area with approvals, behavior tracking, reports and tips; its own stars and gems, not the shared hero) | `little-heroes.html` | https://claude.ai/artifact/8vPtRDZAXhNvkq1EyfuakR |
| النجمة الصغيرة (short illustrated story read aloud sentence by sentence with the Azure voice, clips in `little-star/voices/`) | `little-star.html` | https://claude.ai/artifact/5WGrZYdLs2hk3EVd8cxjAA |
| My English Gap ماي إنجلش قاب (English speaking practice for the owner: the tutor asks in Arabic, you answer in English by mic or typing, it corrects in English with highlighted fixes and saves your mistakes; calls the Claude API with a key the user pastes into its settings, kept in that browser only; mic uses the browser's speech recognition, so no device voice is used; no listen buttons, since live corrections can't be pre-recorded with Azure) | `my-english-gap.html` | GitHub Pages only (the mic and API calls don't work inside a play link). In-Claude version without mic: https://claude.ai/artifact/UcquNcYuwX4hxZKwB1Vbtq |
| أولي Ollie (English course in parts, beginner to upper intermediate, then a second course at the same six levels as parts 7–12; each part has 5 worlds × 6 lessons, and a lesson is a conversation, a listening text, a reading text and a game; 19 word games, 12 of them added on 10 Nov 2026 in two rounds: true or false, hide and seek, missing word, Ollie's balloons, word search, Ollie's flight, then remember the order, word bingo, the rabbit race, missing letter, which sentence did you hear, story order; a timed challenge per world, a daily challenge with a day streak, a one-minute rush with a best score, a sticker album, Ollie's wardrobe of 12 clothes earned by progress and shared by the six parts, a story library, flashcards in every lesson, tricky-words practice, a picture dictionary, a "what is new" page and a parents corner; its own stars, which parents trade for star-board stars, not the shared hero) | `2.html` … `7.html` for parts 1–6 and `ollie-7.html` … `ollie-12.html` for parts 7–12 (built from `src/ollie/`, never edited by hand) | GitHub Pages only: https://kprpwd2wgn-ops.github.io/Rakan/2.html (its recorded voice is about 9,700 clips, too many for a play link) |
| مراجعة We Can! 3 الجزء الأول (final-exam review of the English textbook We Can! 3, Student's Book + Workbook, units 1–6: listening, speaking, reading, grammar, phonics, vocabulary, a comprehensive test, unit summaries, and a new-sounds lab of 40 phonics sounds; 564 questions with instant correction; every line recorded in Ollie's voice (`en-US-AvaNeural`) on 19 Nov 2026, so it no longer uses the device voice; `node tools/we-can-voices.js` copies the clips into `we-can-3-review/voices/` (with `map.json`) and reports what is still to record; the play link carries only the normal-speed clips (an artifact holds at most 512 files) and plays them for the slow setting too, while GitHub Pages also has the `-slow` copies; clips play through Web Audio with `UNMUTE` for the iPhone silent switch; noise-only effects) | `we-can-3-review.html` | https://claude.ai/artifact/JJnmYmqPzBYQAbrzVJNH1T |
| مراجعة لغتي الصف الثالث (final review of the grade 3 Arabic book لغتي, first term, units 1–4: listening, reading passages, sound rules, dictation, styles and word classes, vocabulary, reading aloud with the browser's Arabic speech recognition or self-check, comprehensive test, unit summaries; 144 questions; built by `node tools/school-review.js` from the shared engine `src/school-review/engine.html` and `src/school-review/lughati.js` (never edit the .html by hand); spoken only by Hamed (`ar-SA-HamedNeural`): every spoken line, fully vowelled, is in `lughati-3-review-lines.json`, and the page plays a clip only when `lughati-3-review/voices/manifest.json` lists that exact text, otherwise it stays silent and shows the text (no device voice); recorded on 20 Nov 2026 and published with every clip; after changing a line, rerun `python3 tools/game-voices.py lughati-3-review-lines.json --out lughati-3-review/voices` (only changed lines are remade) and republish with the clips and manifest under `lughati-3-review/voices/`; Web Audio + `UNMUTE`; noise-only effects) | `lughati-3-review.html` | https://claude.ai/artifact/LEiG9SG8XXzBRQHkHhVp2P |
| مراجعة الرياضيات الصف الثالث (final review of the grade 3 math book, first term, chapters 1–5: place value, addition, subtraction, multiplication 1 and 2; 115 questions, Arabic-Indic digits on screen; built by `node tools/school-review.js` from the shared engine `src/school-review/engine.html` and `src/school-review/math.js` (never edit the .html by hand); spoken only by Hamed (`ar-SA-HamedNeural`): every spoken line, fully vowelled, is in `math-3-review-lines.json`, and the page plays a clip only when `math-3-review/voices/manifest.json` lists that exact text, otherwise it stays silent and shows the text (no device voice); recorded on 20 Nov 2026 and published with every clip; after changing a line, rerun `python3 tools/game-voices.py math-3-review-lines.json --out math-3-review/voices` (only changed lines are remade) and republish with the clips and manifest under `math-3-review/voices/`; Web Audio + `UNMUTE`; noise-only effects) | `math-3-review.html` | https://claude.ai/artifact/KCgyS865wSRdaiPupuwqpN |
| مراجعة العلوم الصف الثالث (final review of the grade 3 science book, first term: work like scientists and chapters 1–6, living things, life cycles, ecosystems, changes in ecosystems, the changing Earth, Earth's resources; 94 questions; built by `node tools/school-review.js` from the shared engine `src/school-review/engine.html` and `src/school-review/science.js` (never edit the .html by hand); spoken only by Hamed (`ar-SA-HamedNeural`): every spoken line, fully vowelled, is in `science-3-review-lines.json`, and the page plays a clip only when `science-3-review/voices/manifest.json` lists that exact text, otherwise it stays silent and shows the text (no device voice); recorded on 20 Nov 2026 and published with every clip; after changing a line, rerun `python3 tools/game-voices.py science-3-review-lines.json --out science-3-review/voices` (only changed lines are remade) and republish with the clips and manifest under `science-3-review/voices/`; Web Audio + `UNMUTE`; noise-only effects) | `science-3-review.html` | https://claude.ai/artifact/JxX9nusTgBRPwfdtEcM9td |
| ألغاز الصور والحروف (picture-and-letter puzzles: an emoji stands for a word, then letters are added (+) or taken away (−, the last one of that letter) to make a new word, e.g. 🐪 جمل + ة = جملة; 4 levels of 30 puzzles (120 in all), a game is 10 of a level's puzzles, unsolved ones first, and every level is open from the start (she asked to pick any level): easy (name shown, pick 1 of 3, some with a letter before the picture like ك + 🚪 = كباب), medium (name hidden, 💡 hint, two steps, pick 1 of 4), hard (build the word from letter tiles), hardest (two pictures or a letter before the picture, more tiles); stars per puzzle; spoken only by Hamed: every line, fully vowelled, comes from the puzzle data in the page (`node tools/letter-puzzles-lines.js` writes `letter-puzzles-lines.json` and checks every puzzle adds up), then `python3 tools/game-voices.py letter-puzzles-lines.json --out letter-puzzles/voices`, and republish with the clips and manifest under `letter-puzzles/voices/`; recorded 22 Nov 2026; Web Audio + `UNMUTE`; noise-only effects) | `letter-puzzles.html` | https://claude.ai/artifact/Mm1Vc7hAEAnC1ABNGTR7ux |
| تحدي العباقرة (brain-teaser collection like the "test your IQ in 15 questions" video she sent: 3 worlds like the video's categories, visual focus, logic and investigation, mental math, with 26 kinds of puzzles and 844 puzzles in all, each kind running from easy to genius; a round is 10 puzzles of one kind (unsolved first) or a mix of a world; the IQ test is 15 questions, 5 per world, 15 seconds each, scored with the video's three levels (0–6, 7–10, 11+, worded kindly); stars per puzzle and ranks; Abqarino the brain is the mascot; built by `python3 src/build.py genius` from `src/genius/` (never edit the .html by hand: `core.js` helpers and screens' lines, `visual*.js`, `logic*.js`, `math*.js` the kinds, `ui.js` the screens); every puzzle is made from its kind and number with a fixed seed, so puzzle 7 is always the same; spoken only by Hamed: `node tools/genius-lines.js` checks every puzzle (one right answer, choices that look different) and writes `genius-challenge-lines.json` (491 lines, each with its pack), then `python3 tools/game-voices.py genius-challenge-lines.json --out genius-challenge/voices` and `python3 tools/voice-packs.py genius-challenge-lines.json genius-challenge/voices`, which joins the clips into 48 `pack-*.mp3` files with `packs.json` (an artifact holds about 500 files at most); the page plays a line only when its packed clip was made from that exact text; recorded 23 Nov 2026; republish with the packs and `packs.json` under `genius-challenge/voices/`; Web Audio + `UNMUTE`; noise-only effects) | `genius-challenge.html` | https://claude.ai/artifact/VBRWN71nCei8KnPDgakE3C |
| صقر الكلمات Word Falcon (English vocabulary for his 51Talk level 4, asked for on 25 Nov 2026: 732 words and class phrases in 32 topics on three stages (the basics, level-4 words, going further), chosen for a Muslim family (no pork, alcohol, music, magic or other faiths' holidays; Ramadan, Eid, the mosque and good manners are in); a lesson is about 6 words: he meets each one (picture, Ollie's voice, an example sentence and its Arabic), then answers 11 kinds of questions (listen and pick the picture, spell with letter tiles, fill the sentence, true or false, say it into the mic, which class phrase fits ...); smart review brings each word back after 1, 2, 4, 7, 14 and 30 days and back to the start after a mistake; a placement test and a per-topic check skip the words he knows; Shaheen the falcon grows through 6 ranks as words are learned and wears what he buys with feathers; 8 games, a word book, talk time with 64 questions like his online teacher's (mic, or word tiles where there is none), badges, and a parents' corner (behind a sum) with stats, hard words, settings and a word list to copy for the teacher; progress in `rakan-falcon-v1`, its own feathers, not the shared hero; built by `python3 src/build.py falcon` from `src/falcon/` (never edit the .html by hand: `words1-3.js` the words, `say.js` the spoken remarks, `art.js` the drawings, `app.js` screens and review, `quiz.js` the questions, `talk.js`, `games.js`); English in Ollie's voice (`en-US-AvaNeural`, clips shared in `ollie/voices/`), Arabic guide lines by Hamed (`word-falcon/ar/`), all joined into 97 pack files in `word-falcon/voices/` by `node tools/falcon-voices.js`; `node tools/falcon-play.js` plays it through; Web Audio + `UNMUTE`; noise-only effects) | `word-falcon.html` (icon `word-falcon-icon-v2.png`) | https://claude.ai/artifact/RsX7z7h8CxtFGzofTbggWU |

Add a row here for every new game.

Shared hero: the games share one hero and one gem wallet (browser storage key `rakan-world-v1`). This only
works on the GitHub Pages links, where all games live on the same site; each play link keeps its own copy.
Some games are built from `src/` (a shared kit plus one folder per game): for those, step 1 of "Changing a game"
means editing the files in `src/` and then running `python3 src/build.py <game>`, which rewrites `<game>.html`.
The six Ollie parts are built the same way from `src/ollie/` (their own engine, not the kit):
`python3 src/build.py ollie` rewrites `2.html` … `7.html`. For them, step 2 is `node tools/ollie-check.js`
(every game playable, every spoken line recorded) and `node tools/ollie-play.js <part>` (plays the part in a browser),
and step 3 is skipped, since they have no play link.

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
   - The current Artifact server (`claude-artifacts` tools) wants one complete document starting with `<!DOCTYPE html>`:
     publish the game file itself with `publish_files` (`as: index.html`, the artifact's slug and live version from `get_artifact`).
     The two steps below are for the older Artifact tool.
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

- Talk Town (`talk-town.html`) and Reading Rocket (`reading-rocket.html`), moving over since 17 Nov 2026, when she asked
  for "the new voice" (Ollie's `en-US-AvaNeural`). That session had no `AZURE_SPEECH_KEY` and could not reach Azure, so it
  recorded nothing: the games now say every line that already has an Ollie clip in that voice, and the device voice says
  the rest until it is recorded. How it works: `src/kit/enclips.js` (`EN`, loaded only by these two games) is asked first by
  `speak()` in `src/kit/voice.js`; it plays `ollie/voices/<id>.mp3` when the game's clip map `ollie/voices/<game>.json`
  (`{s:{text:id},slow:[ids]}`) has the whole line, or each of its sentences, or the `parts` the caller gives
  ("Try like this:" + the example, the two halves of an "and" clue, "Here you go!" + the painted words), or every word
  when the caller passes `words:true` (picture sentences are read word by word). Read-along lights each word in step with
  the clip. The 🐢 speed setting plays the `-slow` copies of sentences.
  `node tools/en-lines.js talk|reading` lists every line the game can say, writes its clip map and `<game>-en-lines.json`
  with the lines still to record (17 Nov: Reading Rocket 446 lines, about 10,600 characters; Talk Town 1,433 lines, about
  29,400 characters, mostly Leo's full-sentence models built from each word the child may say). In the first session
  with the key: `python3 tools/english-voices.py reading-rocket-en-lines.json --out ollie/voices`, the same for
  `talk-town-en-lines.json`, then `node tools/en-lines.js reading --slow` and `... talk --slow` (rewrites the maps, makes the
  slow copies), build both, check, publish, push. A new spoken line in either game must be added to `tools/en-lines.js`,
  or it stays in the device voice. Recorded on 17 Nov 2026 in a later session: every line of both games now has a clip
  (`en-lines.js` reports 0 to record), so on GitHub Pages they speak only in Ollie's voice. The play links do not carry the clips (about 900 and 1,800 files), so they still use
  the device voice; the GitHub Pages links are the ones with the new voice.
  Their drawn objects (`src/kit/things.js`) and noise-only sound effects (`src/kit/sfx.js`, switched off with the 🔊
  button on the home screen, kept under `rakan-sfx`) are shared by the two. Since 18 Nov 2026 the Arabic intro pages and the
  hero's voice test speak with Hamed: `ARV` in `src/kit/enclips.js` plays `APP.arvoices/<id>.mp3` (`reading-rocket/voices`,
  `talk-town/voices`, from `<game>-ar-lines.json` via `tools/game-voices.py`) when `guide()`/`speak()` get `{arclip:id}`.
  She asked for it directly; the vowelled lines were shown to her afterwards for checking.
- iPhone silent switch (18 Nov 2026, she reported "no sound at all"): Web Audio, which plays every recorded clip, is muted by
  the silent switch. `UNMUTE` (in `src/kit/base.js`, copied into `src/ollie/engine.js` and `little-star.html`) sets
  `navigator.audioSession.type='playback'` and, for older iOS, loops a silent WAV in an `<audio>` element after the first
  tap (paused when the page is hidden). Every new game that plays clips needs the same.

- Word Falcon (`word-falcon.html`, 25 Nov 2026): every English line (the 732 words and phrases, their example sentences, the 64 talk questions and answers, and the short praise in `EN_UI`) is a clip in Ollie's voice in `ollie/voices/<sha1>.mp3`; 885 were recorded that day, with `-slow` copies of the sentences. Hamed's 88 Arabic lines are `AR` in `src/falcon/say.js`, recorded into `word-falcon/ar/` the same day (they were not shown to the owner first: show them when she asks, or if a word sounds wrong). `node tools/falcon-voices.js` checks the word data (each sentence holds its word, no two clear pictures alike, every Arabic word vowelled), writes what is still to record to `word-falcon-en-lines.json` and `word-falcon-lines.json`, and packs every clip into `word-falcon/voices/` (`pack-w-<topic>` words, `pack-s-<topic>` sentences, `pack-z-<topic>` slow sentences, `pack-core`, `pack-talk`, and `packs.json`, keyed by a hash of the text, so a changed line stays silent until it is recorded). After changing a word or sentence: run it, then `python3 tools/english-voices.py word-falcon-en-lines.json --out ollie/voices` (and for Arabic `python3 tools/game-voices.py word-falcon-lines.json --out word-falcon/ar`), run it again, build, and republish with every file of `word-falcon/voices/` in `files`.
- Times tables (`times.html`) and Division (`division.html`): every line is drafted in `times-lines.json`
  and `division-lines.json`. They are built by `python3 src/voices/make-lines.py`, so fix the script, not the JSON;
  the facts are made from its number words. Sent to the owner for the tashkeel check on 2 Nov 2026.
  Both games already play these clips and no longer use the device voice (`src/kit/clips.js`, `CLIPS.say(id)`;
  it loads `times/voices/manifest.json` or `division/voices/manifest.json` and stays silent until they exist).
  Each line id says when it is spoken: `intro-N` on the intro pages, `tut-N` in the first lesson,
  `m-A-B` / `d-D-Q` after every answer and on the learn pages, `dragon-N` / `mate-N` when a friend joins,
  and the rest for waves, rounds, bosses, wins and losses.
  She approved the lines on 3 Nov 2026; the clips are in `times/voices` and `division/voices` and both games are
  published with them. After changing a line, rerun `tools/game-voices.py` for that file (only changed lines are
  remade) and republish the game with every clip and the manifest in `files`.
- Ollie English parts (`2.html` … `7.html`, parts 1–6, uploaded by the owner; GitHub Pages only, no play link):
  English, so the voice is `en-US-AvaNeural` and there is no tashkeel check. They say about 8,000 different
  sentences and words, recorded in batches by `tools/english-voices.py` from `ollie-lines.json` into the shared
  folder `ollie/voices/<hash>.mp3` (plus `-slow` copies for the listening and reading passages). Each part loads
  `ollie/voices/part<N>.json`, which maps its sentences (`s`) and lowercase words (`w`) to clip ids; `say()`
  splits text into sentences and plays each clip, and a line with no clip stays silent. After changing a part's
  text, rebuild `ollie-lines.json` and the part's json from the part's `LV` data, then rerun the script (it records
  only missing clips).
  Since 10 Nov 2026 the six pages are built from one source, `src/ollie/`: `engine.js` and `style.css` are shared,
  `data/part<N>.js` holds a part's lessons (`PART` and `LV`) and `icons/part<N>.png` its home-screen icon.
  Everything new that day (six games, daily challenge, sticker album, tricky words) reuses lines that were already
  recorded, so nothing had to be recorded; the session had no Azure key. Keep to that rule when there is no key:
  a new game may speak only a lesson's words (`v`) and its sentences (`c` answers, `l`, `r`), and Ollie's own
  remarks come from the `SAY` block at the top of `engine.js`, where each line must already be a clip
  (`src/build.py ollie` adds such a line to every part's json, or stops and names the line if no clip exists).
  Arabic meanings, pictures and wrong answers are never spoken, so they can be changed freely.
  Sound effects are short noise bursts made in the page (`sfx()`), with no notes or tunes, to keep the no-music rule.
  A part's progress lives in that browser under `ollie-english-part<N>`: `s` lesson stars (the only ones that count
  for the star board), `x` stars of extra games, `m` tricky words, `d` the daily challenge day, streak and count,
  `hi` the best one-minute rush, `rd` the library stories heard to the end, `nw` the last "what is new" seen.
  Ollie's wardrobe is the one thing the six parts share: `ollie-english-look` (`have` the clothes earned, `on` the
  piece worn in each of the slots head, eyes, neck and back, `fresh` the ones not looked at yet). The clothes are
  drawn in `ART` in the bird's own 64-unit box, and `WEAR` says what earns each one.
  The second round that day (the six later games, wardrobe, library, flashcards, one-minute rush) again recorded
  nothing: the owner asked once more for "the new voice", and Ollie has had it since 4 Nov (Azure, `en-US-AvaNeural`;
  Little Star's Hamed is an Arabic voice). She was told so, and that another English speaker means recording again
  with the key. `VER` in `engine.js` is the version shown in the parents corner and on the "what is new" page, so a
  family can tell which copy a phone is showing: raise `VER.n`, set `VER.day` and rewrite `NEWS` with every update.
  `tools/ollie-play.js` now takes about ten minutes a part; run two parts at a time at most, because its bots are
  timed, and do not rebuild while it runs (it reloads the page near the end).
  Six pictures were corrected (crow, wing, sugar, swing, beach, glass). Two of them were emoji from 2022, which
  older phones show as an empty box or as two symbols: keep to emoji from 2021 or earlier. Sentences cut inside a quotation are kept out of the two sentence games.
  The word search now accepts a word wherever its letters are found (AGREE inside DISAGREE used to count as a miss).
  Music in the owner's lesson texts was taken out on 11 Nov 2026 without recording anything: sentences were dropped
  or swapped for ones already recorded (`ollie/voices/part2.json` got seven such lines by hand), wrong answers and
  pictures were changed, and part 2's "Sounds and Rhythm" became "Loud and Quiet". Left on purpose: clapping hands,
  the referee's whistle, oud perfume, birds singing in a tree, rhyme and rhythm as words of the poetry lesson.
  She also asked for six more parts (7–12) and 12 links, and said not to ask her questions. They are planned in
  `src/ollie/plan-parts-7-12.md` but not built: about 8,000 new lines need the Azure key, and a silent Ollie would
  break her own voice rule. Build them part by part in the first session that has `AZURE_SPEECH_KEY`.
  The conversation has a microphone since 11 Nov 2026 (`micListen` in `engine.js`): after the right reply is chosen,
  the child taps the mic and says it; the browser's own speech recognition (not a device voice, so the voice rule
  holds) tells whether about 60% of the words were heard. The old "I said it" button stays, so nothing is blocked
  where recognition is missing or refused. It was tested with a pretend microphone only, not on a real phone.
  Parts 7-12 (a second course at the levels of parts 1-6, planned in `src/ollie/plan-parts-7-12.md`) are built as
  `ollie-7.html` ... `ollie-12.html` (9.html is another page). `src/build.py ollie` builds every part that has both
  `src/ollie/data/part<N>.js` and `ollie/voices/part<N>.json`, sets `PARTS` above the part's data, and the pages link
  to each other with `PAGE(n)` in `engine.js`. To add or change a part: write `data/part<N>.js` (icon
  `icons/part<N>.png`), run `node tools/ollie-voice-map.js <N> <scratch>/pN.json` (writes the clip map, lists only the
  lines without a clip and adds them to `ollie-lines.json`), then `python3 tools/english-voices.py <scratch>/pN.json
  --out ollie/voices`, then build, `ollie-check` and `ollie-play <N>`. A part costs about 20,000-45,000 Azure characters,
  since many words are already recorded. All six (7-12) were built and recorded on 11 Nov 2026.

## Setup and limits

- `AZURE_SPEECH_KEY` is an environment variable in the cloud environment (not a Network secret: Azure
  reads the key from its own header). Network access is Full, or Limited with
  `qatarcentral.tts.speech.microsoft.com` under Allowed domains. The region is qatarcentral unless
  `AZURE_SPEECH_REGION` says otherwise.
- Azure's free tier: 500,000 characters a month (about 10,000 vowelled lines) and about 20 requests a
  minute; the script waits when told to slow down. When the month's quota runs out, Azure refuses until
  the next month and nothing is charged.
