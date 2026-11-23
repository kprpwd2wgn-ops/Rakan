// Checks every puzzle of genius-challenge.html (one right answer, different choices, every spoken line written)
// and writes genius-challenge-lines.json: every line Hamed says, with the voice pack it goes in.
// usage: python3 src/build.py genius && node tools/genius-lines.js
//        python3 tools/game-voices.py genius-challenge-lines.json --out genius-challenge/voices
//        python3 tools/voice-packs.py genius-challenge-lines.json genius-challenge/voices
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'genius-challenge.html'), 'utf8');
const js = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const m = { exports:{} };
new Function('module', js)(m);
const { TYPES, ORDER, SAY, make } = m.exports;

let bad = 0, total = 0;
const used = {}; // line id -> kinds that say it
const use = (id, t) => { (used[id] = used[id] || new Set()).add(t); };
for (const w of ['v', 'l', 'm']) for (const id of ORDER[w]) {
  use('h-' + id, id);
  for (let i = 0; i < TYPES[id].n; i++) {
    let p;
    try { p = make(id, i); } catch (e) { bad++; console.log(`${id} ${i}: ${e.message}`); continue; }
    total++;
    if (p.opts) {
      const ok = p.opts.filter(o => o.ok).length, kinds = new Set(p.opts.map(o => o.h));
      if (ok !== 1) { bad++; console.log(`${id} ${i}: ${ok} right answers`); }
      if (kinds.size !== p.opts.length) { bad++; console.log(`${id} ${i}: two choices look the same`); }
    } else if (!p.tap || !p.board.includes(`data-k="${p.k}"`)) { bad++; console.log(`${id} ${i}: nothing to tap or choose`); }
    for (const s of [...p.say, ...(p.exSay || []), ...((p.memo && p.memo.say) || [])]) {
      if (!SAY[s]) { bad++; console.log(`${id} ${i}: no line "${s}"`); } else use(s, id);
    }
  }
}
// per-puzzle lines of the long kinds go in packs of ten puzzles, so a round loads little
const packOf = lid => {
  const k = used[lid];
  if (!k || k.size !== 1) return 'core';
  const t = [...k][0], m1 = lid.match(/^(rid|trk|ord|wrd|out|ana)-(\d+)(-[qa])?$/);
  return m1 ? `${t}-${Math.floor(+m1[2] / 10)}` : t;
};
// lines the screens say themselves (not a puzzle)
const UI = ['intro', 'home', 'w-v', 'w-l', 'w-m', 'mix', 'test', 'test-v', 'test-l', 'test-m', 'res-0', 'res-1', 'res-2', 'show', 'late', 'miss', 'done', 'alldone',
  ...[0, 1, 2, 3, 4, 5].map(i => 'ok-' + i), ...[0, 1, 2].map(i => 'no-' + i)];
UI.forEach(id => { if (!SAY[id]) { bad++; console.log(`no line "${id}"`); } });
const lines = Object.entries(SAY).filter(([id]) => used[id] || UI.includes(id)).map(([id, text]) => ({ id, text, pack:packOf(id) }));
const unused = Object.keys(SAY).filter(id => !used[id] && !UI.includes(id));
if (unused.length) console.log(`never said, so not recorded: ${unused.join(' ')}`);
for (const l of lines) if (/[0-9٠-٩]|\p{Extended_Pictographic}/u.test(l.text)) { bad++; console.log(`line ${l.id} has a digit or a picture: Hamed cannot say it`); }
fs.writeFileSync(path.join(root, 'genius-challenge-lines.json'), JSON.stringify({ voice:'ar-SA-HamedNeural', lines }, null, 1) + '\n');
const chars = lines.reduce((a, l) => a + l.text.length, 0), packs = new Set(lines.map(l => l.pack));
console.log(`${total} puzzles; ${lines.length} lines (${chars} characters) in ${packs.size} packs; ${bad ? bad + ' problems' : 'no problems'}`);
process.exit(bad ? 1 : 0);
