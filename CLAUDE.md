# Family game workshop

This repo holds small browser games made with Claude. An adult (the son's mother) does the typing;
her 9-year-old son comes up with the ideas. Replies get read out or shown to him.

## The games

| Game | File | Play link (never changes) |
|---|---|---|
| عالم الألوان (Arabic colors) | `arabic-colors.html` | https://claude.ai/artifact/WgJDPdkMmw2MBJbLH14UjG |
| لوحة نجوم البطل (star board, behavior chart) | `stars.html` (icon `stars-icon.png`) | https://claude.ai/artifact/NBqa4CeS5jvizkcKZhARA8 |
| أبطال جدول الضرب (times tables 1–12: secrets, games, challenges) | `times.html` (icon `times-icon-v2.png`) | https://claude.ai/artifact/CmKzHECmNEE6h54e6fMF3v |
| مدينة الكلام Talk Town (English speaking: conversations, mic, words, games) | `talk-town.html` (icon `talk-town-icon-v2.png`) | https://claude.ai/artifact/2RVpNvvYo4R255Mp6wT7vQ |
| أبطال القسمة (division 1–12: cookie-sharing lessons, secrets, games, challenges) | `division.html` (icon `division-icon-v2.png`) | https://claude.ai/artifact/KxUGqCXTyvSjDuDXns71mK |
| صاروخ القراءة Reading Rocket (English reading: letters, blending, sight words, sentences, stories, read aloud) | `reading-rocket.html` (icon `reading-rocket-icon-v2.png`) | https://claude.ai/artifact/KQ8qtJN2HdDmqH6fGvqY6d |

Add a row here for every new game.

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
