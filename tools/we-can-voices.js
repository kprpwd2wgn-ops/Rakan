// We Can! 3 review (we-can-3-review.html): finds a recorded Ollie clip (en-US-AvaNeural) for every line the page
// can say, copies those clips into we-can-3-review/voices/ and writes voices/map.json ({s:{text:id}, slow:[ids]}).
// Lines with no clip yet go to we-can-3-review-en-lines.json; the page says them with the device voice.
// To record them in a session with AZURE_SPEECH_KEY:
//   python3 tools/english-voices.py we-can-3-review-en-lines.json --out ollie/voices
//   node tools/we-can-voices.js        (picks up the new clips)
// usage: node tools/we-can-voices.js
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.join(__dirname, '..'), VO = path.join(ROOT, 'ollie/voices'), OUT = path.join(ROOT, 'we-can-3-review/voices');
const html = fs.readFileSync(path.join(ROOT, 'we-can-3-review.html'), 'utf8');
const data = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1];
const G = new Function(data + ';return {Q,P,UNITS,SOUNDS};')();

const lines = new Set();
G.Q.forEach(q => {
  if (q.say) lines.add(q.say);
  if (q.t === 'speak') { lines.add(q.model); if (!q.pron) lines.add(q.q.replace(/\(.*?\)/g, '').trim()); }
  if (q.t === 'order') lines.add(q.ans);
  if (q.t === 'match') q.pairs.forEach(p => { if (/[A-Za-z]/.test(p[1])) lines.add(p[1]); });
});
Object.values(G.P).forEach(p => lines.add(p.x.replace(/Word bank:[^\n]*\n/, '').replace(/\(\d\) ____/g, 'blank')));
G.UNITS.forEach(u => u.ph.forEach(x => lines.add(x)));
G.SOUNDS.forEach(s => s.w.forEach(w => lines.add(w)));

// every text Ollie, Talk Town and Reading Rocket already have a clip for
const S = {}, W = {};
for (const f of fs.readdirSync(VO)) {
  if (!f.endsWith('.json') || f === 'manifest.json') continue;
  try { const d = JSON.parse(fs.readFileSync(path.join(VO, f), 'utf8')); Object.assign(S, d.s || {}); Object.assign(W, d.w || {}); } catch (e) {}
}
const cid = t => crypto.createHash('sha1').update(t).digest('hex').slice(0, 12);
const exists = id => fs.existsSync(path.join(VO, id + '.mp3'));
function find(t) {
  for (const v of [t, t.replace(/'/g, '’')]) {
    if (S[v] && exists(S[v])) return S[v];
    if (exists(cid(v))) return cid(v);
  }
  if (/^[A-Za-z]+$/.test(t) && W[t.toLowerCase()] && exists(W[t.toLowerCase()])) return W[t.toLowerCase()];
  return null;
}
const sents = t => t.split(/(?<=[.!?])\s+|\n+/).map(x => x.trim()).filter(Boolean);

const map = { s: {}, slow: [] }, missing = [];
for (const t of lines) {
  const id = find(t);
  if (id) { map.s[t] = id; continue; }
  const ss = sents(t);
  if (ss.length > 1 && ss.every(find)) { ss.forEach(x => map.s[x] = find(x)); continue; }
  (ss.length > 1 ? ss.filter(x => !find(x)) : [t]).forEach(x => missing.push(x));
}
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
for (const id of new Set(Object.values(map.s))) {
  fs.copyFileSync(path.join(VO, id + '.mp3'), path.join(OUT, id + '.mp3'));
  if (exists(id + '-slow')) { fs.copyFileSync(path.join(VO, id + '-slow.mp3'), path.join(OUT, id + '-slow.mp3')); map.slow.push(id); }
}
fs.writeFileSync(path.join(OUT, 'map.json'), JSON.stringify(map));
const todo = [...new Set(missing)];
fs.writeFileSync(path.join(ROOT, 'we-can-3-review-en-lines.json'),
  JSON.stringify({ voice: 'en-US-AvaNeural', lines: todo, slow: todo.filter(t => t.split(' ').length > 1) }, null, 1));
console.log(`${lines.size} lines: ${Object.keys(map.s).length} texts with clips (${new Set(Object.values(map.s)).size} files), ${todo.length} still to record`);
