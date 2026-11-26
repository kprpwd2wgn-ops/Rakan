# صقر الكلمات — parts 2 to 6

Asked for on 26 Nov 2026: "the second, third, fourth, fifth and sixth part, the same in everything". Each part is a
program like part 1 (lessons, smart review, spelling workshop, rule of the day, talk time with "tell me more", games,
word book, badges, parents' corner, every English line in Ollie's Azure voice and every Arabic line by Hamed), with
harder words than the part before, its own page (`word-falcon-<N>.html`), its own play link, and its own progress
(`rakan-falcon-p<N>`). Part 1 stays where it was (`src/falcon/`, `word-falcon.html`, `rakan-falcon-v1`).

| Part | Level | Stages |
|---|---|---|
| 1 | A1 – B1 | the basics · level-4 words · going further (+ big words, his plan from the level test) |
| 2 | A2 | home and school · places and nature · actions and descriptions |
| 3 | B1 | everyday life · science and the world · thinking and feeling |
| 4 | B1+ | ... (planned when built) |
| 5 | B2 | ... |
| 6 | B2+ | ... |

A word is taught in one part only (`tools/falcon-voices.js <N>` checks this against every built part), and no word or
sentence of the level test is used, so a retest stays fair.

## Files of a part (src/falcon/parts/p<N>/)

- `src.txt` — the only file to edit for words and talk questions. One line per word:
  `english | picture | example sentence | flags | vowelled meaning | vowelled Arabic of the sentence | wrong answers`,
  under `@topic id | vowelled Arabic name | English name | icon | colour | stage | kind` lines, with
  `@talk question | vowelled Arabic | frame with ___ | model answer` lines (two per topic). `node tools/falcon-part.js <N>`
  writes `words.js` (plain Arabic made from the vowelled text) and `arvoice.js` (Hamed's vowelled lines) from it.
- `part.js` — by hand: `PARTNO`, `PART` (title, level, stages, about, similar words), `AR_PART` (Hamed's lines of the
  part: the topic names from `AR_TOPICS`, the welcome, the rules), `PLAN`, `RULES` (the rule of the day: 6 rules).

## Making a part

1. Write `src.txt` and `part.js`, then `node tools/falcon-part.js <N>` and `node tools/falcon-voices.js <N> --check`.
2. `node tools/falcon-voices.js <N>`; record what it lists (needs `AZURE_SPEECH_KEY`):
   `python3 tools/english-voices.py word-falcon-<N>-en-lines.json --out ollie/voices`,
   `python3 tools/game-voices.py word-falcon-<N>-lines.json --out word-falcon-<N>/ar`,
   `python3 tools/english-voices.py word-falcon-<N>-ar2-lines.json --out word-falcon/arw`; then run it again to pack.
3. `python3 src/build.py falcon`, `node tools/check-game.js word-falcon-<N>.html`, `node tools/falcon-play.js <N>`.
4. Publish `word-falcon-<N>.html` as a new artifact with every file of `word-falcon-<N>/voices/`, add its row to
   CLAUDE.md, commit, push.

## Status

- Part 2: built, recorded and published on 26 Nov 2026 (https://claude.ai/artifact/7AdbmScgVAHuy8wswxfQCh).
- Part 3: data written and checked; being recorded.
