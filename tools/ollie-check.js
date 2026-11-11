// Checks the Ollie English parts without a browser:
//  - every lesson's main game can be played with that lesson's words,
//  - every sentence and word a part can say has a recorded clip in ollie/voices.
// usage: node tools/ollie-check.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'src/ollie/engine.js'), 'utf8');
const pure = engine.slice(engine.indexOf('/*PURE-START*/'), engine.indexOf('/*PURE-END*/'));
const sayBlock = engine.slice(engine.indexOf('/*SAY-START*/'), engine.indexOf('/*SAY-END*/'));
const clips = new Set(fs.readdirSync(path.join(root, 'ollie/voices')).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)));
let bad = 0;

// every part that has both its lessons and its clip map
let parts = 0;
while (fs.existsSync(path.join(root, `src/ollie/data/part${parts + 1}.js`)) && fs.existsSync(path.join(root, `ollie/voices/part${parts + 1}.json`))) parts++;
for (let part = 1; part <= parts; part++) {
  const box = {};
  vm.createContext(box);
  vm.runInContext(fs.readFileSync(path.join(root, `src/ollie/data/part${part}.js`), 'utf8') + pure + sayBlock +
    ';Object.assign(this,{LV,PART,V,splitS,canPlay,gapItems,SAY})', box);
  const { LV, V, splitS, canPlay, SAY } = box;
  const m = JSON.parse(fs.readFileSync(path.join(root, `ollie/voices/part${part}.json`), 'utf8'));
  // the page's own lookup (clipFor in the engine)
  const clipFor = (t, slow) => {
    const id = m.s[t] || m.w[t.toLowerCase()] || m.w[t.replace(/[^A-Za-z0-9' -]/g, '').trim().toLowerCase()];
    return id ? (slow && m.slow.includes(id) ? id + '-slow' : id) : null;
  };
  const silent = new Set(), games = {}, problems = [];
  let pieces = 0;
  const speak = (text, slow) => splitS(text).forEach(t => { pieces++; const id = clipFor(t, slow); if (!id || !clips.has(id)) silent.add(t); });

  if (LV.length !== 5) problems.push(`expected 5 worlds, found ${LV.length}`);
  LV.forEach((lv, l) => {
    if (lv.lessons.length !== 6 || lv.games.length !== 6) problems.push(`world ${l + 1}: needs 6 lessons and 6 games`);
    lv.lessons.forEach((L, i) => {
      const at = `world ${l + 1} lesson ${i + 1} (${L.en})`, g = lv.games[i], vs = V(L);
      games[g] = (games[g] || 0) + 1;
      if (!canPlay(g, L)) problems.push(`${at}: the game "${g}" cannot use this lesson's words`);
      if (vs.length !== 6 || vs.some(v => !v.en || !v.ar || !v.em)) problems.push(`${at}: needs 6 words as english|arabic|picture`);
      if (new Set(vs.map(v => v.em)).size < vs.length) problems.push(`${at}: two words share a picture`);
      for (const row of [...L.c, ...L.lq, ...L.rq]) {
        if (row.length !== 4) problems.push(`${at}: a row needs a question and 3 answers: ${row[0]}`);
        if (new Set(row.slice(1).map(x => x.trim().toLowerCase())).size < 3) problems.push(`${at}: repeated answer in: ${row[0]}`);
      }
      vs.forEach(v => speak(v.en));
      L.c.forEach(row => { speak(row[0]); speak(row[1]); });
      [L.l, L.r].forEach(t => { speak(t); speak(t, true); });
      [...L.lq, ...L.rq].forEach(q => speak(q[0]));
      L.r.split(/\s+/).forEach(w => { const x = w.replace(/[^A-Za-z0-9'-]/g, ''); if (x) speak(x); });
    });
  });
  Object.values(SAY).flat().forEach(t => speak(t));

  console.log(`part ${part}: ${pieces} spoken pieces, ${silent.size} without a clip; games: ` +
    Object.entries(games).map(([g, n]) => `${g} ${n}`).join(', '));
  if (silent.size) { bad++; console.log('  NOT RECORDED:\n' + [...silent].map(t => '    ' + t).join('\n')); }
  if (problems.length) { bad++; console.log('  PROBLEMS:\n' + problems.map(t => '    ' + t).join('\n')); }
}
if (bad) process.exit(1);
console.log('OK: every game is playable and every line has a clip');
