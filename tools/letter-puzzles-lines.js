// Writes letter-puzzles-lines.json (every line Hamed says in letter-puzzles.html) and checks that
// every puzzle's steps really make its answer.
// usage: node tools/letter-puzzles-lines.js   then
//        python3 tools/game-voices.py letter-puzzles-lines.json --out letter-puzzles/voices
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'letter-puzzles.html'), 'utf8');
const js = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const m = { exports: {} };
new Function('module', js)(m);
const { LEVELS, allLines, steps } = m.exports;
let bad = 0;
LEVELS.forEach((lv, li) => lv.P.forEach((pz, pi) => {
  const w = steps(pz).pop();
  if (w !== pz.a) { bad++; console.log(`level ${li} puzzle ${pi}: steps make ${w}, answer is ${pz.a}`); }
  (pz.x || []).forEach(x => { if (x === pz.a) { bad++; console.log(`level ${li} puzzle ${pi}: a wrong choice equals the answer`); } });
}));
const lines = allLines();
fs.writeFileSync(path.join(root, 'letter-puzzles-lines.json'),
  JSON.stringify({ voice: 'ar-SA-HamedNeural', lines }, null, 1) + '\n');
console.log(`${lines.length} lines written; ${bad ? bad + ' puzzle problems' : 'every puzzle adds up'}`);
process.exit(bad ? 1 : 0);
