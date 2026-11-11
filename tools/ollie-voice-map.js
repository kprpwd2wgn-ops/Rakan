// Makes an Ollie part's clip map and the list of its lines that still need recording.
//  - writes ollie/voices/part<N>.json: s = sentence -> clip id, w = lowercase word -> clip id, slow = ids with a slow copy
//  - writes <lines.json> for tools/english-voices.py with only the lines that have no clip yet (and their slow copies),
//    and adds them to ollie-lines.json, the list of everything Ollie says.
// Clip ids are the first 12 hex digits of the sha1 of the text, as in english-voices.py. A word already recorded
// in another casing keeps that clip.
// usage: node tools/ollie-voice-map.js <part> <lines.json>
//        then: python3 tools/english-voices.py <lines.json> --out ollie/voices
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const part = +process.argv[2], out = process.argv[3];
if (!part || !out) { console.log('usage: node tools/ollie-voice-map.js <part> <lines.json>'); process.exit(1); }
const root = path.resolve(__dirname, '..'), V = path.join(root, 'ollie/voices');
const engine = fs.readFileSync(path.join(root, 'src/ollie/engine.js'), 'utf8');
const pure = engine.slice(engine.indexOf('/*PURE-START*/'), engine.indexOf('/*PURE-END*/'));
const sayBlock = engine.slice(engine.indexOf('/*SAY-START*/'), engine.indexOf('/*SAY-END*/'));
const box = {};
vm.createContext(box);
vm.runInContext(fs.readFileSync(path.join(root, `src/ollie/data/part${part}.js`), 'utf8') + pure + sayBlock +
  ';Object.assign(this,{LV,V,splitS,SAY})', box);
const { LV, splitS, SAY } = box;
const id = t => crypto.createHash('sha1').update(t).digest('hex').slice(0, 12);
const has = i => fs.existsSync(path.join(V, i + '.mp3'));

// words already recorded in any part, by lowercase form
const known = {};
for (const f of fs.readdirSync(V).filter(f => /^part\d+\.json$/.test(f)))
  Object.assign(known, JSON.parse(fs.readFileSync(path.join(V, f), 'utf8')).w);

const S = new Set(), W = new Map(), slow = new Set();
const add = t => splitS(t).forEach(x => S.add(x));
const word = w => { const k = w.toLowerCase(); if (!W.has(k)) W.set(k, w); };
for (const lv of LV) for (const L of lv.lessons) {
  L.v.split(';').forEach(x => word(x.split('|')[0]));
  L.c.forEach(r => { add(r[0]); add(r[1]); });
  [L.l, L.r].forEach(t => { add(t); splitS(t).forEach(x => slow.add(x)); });
  [...L.lq, ...L.rq].forEach(q => add(q[0]));
  L.r.split(/\s+/).forEach(w => { const x = w.replace(/[^A-Za-z0-9'-]/g, ''); if (x) word(x); });
}
Object.values(SAY).flat().forEach(add);

const m = { s: {}, w: {}, slow: [] }, todo = [];
for (const t of S) { m.s[t] = id(t); if (!has(id(t))) todo.push(t); }
for (const [k, w] of W) {
  if (known[k] && has(known[k])) { m.w[k] = known[k]; continue; }
  m.w[k] = id(w); if (!has(id(w))) todo.push(w);
}
m.slow = [...new Set([...slow].map(id))].sort();
const slowTodo = [...slow].filter(t => !fs.existsSync(path.join(V, id(t) + '-slow.mp3')));
fs.writeFileSync(path.join(V, `part${part}.json`), JSON.stringify(m));
const uniq = [...new Set(todo)];
fs.writeFileSync(out, JSON.stringify({ voice: 'en-US-AvaNeural', lines: uniq, slow: slowTodo }, null, 0));
const all = path.join(root, 'ollie-lines.json'), A = JSON.parse(fs.readFileSync(all, 'utf8'));
const seen = new Set(A.lines);
A.lines.push(...uniq.filter(t => !seen.has(t)));
const seenSlow = new Set(A.slow);
A.slow.push(...[...slow].filter(t => !seenSlow.has(t)));
fs.writeFileSync(all, JSON.stringify(A, null, 0));
console.log(`part ${part}: ${S.size} sentences, ${W.size} words; to record: ${uniq.length} lines, ` +
  `${uniq.reduce((n, t) => n + t.length, 0)} characters, ${slowTodo.length} slow copies -> ${out}`);
