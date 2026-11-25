// صقر الكلمات Word Falcon (word-falcon.html): checks the word data and gathers its recorded voice into a few pack files.
//
// English (Ollie's voice, en-US-AvaNeural): every word, example sentence, class phrase, talk question and answer, and
// the short remarks in EN_UI. Clips live in the shared folder ollie/voices/<sha1>.mp3 (many words were recorded for
// Ollie already); lines with no clip yet go to word-falcon-en-lines.json.
// Arabic (Hamed, ar-SA-HamedNeural): the guide lines AR in src/falcon/say.js (word-falcon-lines.json -> word-falcon/ar/<id>.mp3),
// and the Arabic shown with every word: its meaning, its sentence's Arabic and each talk question's Arabic, written fully vowelled
// in src/falcon/arvoice1-3.js (word-falcon-ar2-lines.json -> word-falcon/arw/<sha1>.mp3). The page asks for those by the text it shows.
//
// Then it joins the clips into word-falcon/voices/pack-<name>.mp3 (one pack of words, one of sentences and one of slow
// sentences per topic, plus core and talk) and writes word-falcon/voices/packs.json. An Artifact play link holds about
// 500 files, so the page fetches a pack once and cuts each clip out of it.
//
// To record what is missing (needs AZURE_SPEECH_KEY):
//   python3 tools/english-voices.py word-falcon-en-lines.json --out ollie/voices
//   python3 tools/game-voices.py word-falcon-lines.json --out word-falcon/ar
//   python3 tools/english-voices.py word-falcon-ar2-lines.json --out word-falcon/arw
//   node tools/falcon-voices.js
// usage: node tools/falcon-voices.js [--check]     (--check: only check the data, write nothing)
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.join(__dirname, '..'), SRC = path.join(ROOT, 'src/falcon');
const VO = path.join(ROOT, 'ollie/voices'), AR_DIR = path.join(ROOT, 'word-falcon/ar'), OUT = path.join(ROOT, 'word-falcon/voices');
const code = ['words1.js', 'words2.js', 'words3.js', 'say.js', 'arvoice1.js', 'arvoice2.js', 'arvoice3.js'].map(f => fs.readFileSync(path.join(SRC, f), 'utf8').replace(/^if \(typeof module.*$/mg, '')).join('\n');
const { TOPICS, TALK, WORDS, AR, EN_UI, ARV, TALKV } = new Function(code + ';return {TOPICS,TALK,WORDS,AR,EN_UI,ARV,TALKV};')();
const ARW = path.join(ROOT, 'word-falcon/arw');

// ---------- checks ----------
const problems = [], seen = {}, strongPic = {};
const ARABIC = /[ء-ي]/;
for (const w of WORDS) {
  const k = w.en.toLowerCase();
  if (seen[k]) problems.push(`"${w.en}" is in ${seen[k]} and ${w.t}`);
  seen[k] = w.t;
  if (!w.ar || !ARABIC.test(w.ar)) problems.push(`"${w.en}": no Arabic meaning`);
  if (!w.pic) problems.push(`"${w.en}": no picture`);
  if (/p/.test(w.fl)) { if (!w.exAr) problems.push(`"${w.en}": a phrase needs its situation in column 5`); continue; }
  if (!w.ex) { problems.push(`"${w.en}": no example sentence`); continue; }
  if (!w.exAr || !ARABIC.test(w.exAr)) problems.push(`"${w.en}": no Arabic for the sentence`);
  const re = new RegExp('(^|[^A-Za-z])' + w.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^A-Za-z]|$)', 'i');
  if (!re.test(w.ex)) problems.push(`"${w.en}": its sentence does not contain it: ${w.ex}`);
  if (!/w/.test(w.fl) && !w.pic.startsWith('@')) {
    if (strongPic[w.pic]) problems.push(`picture ${w.pic} is used by "${strongPic[w.pic]}" and "${w.en}" (mark one of them w)`);
    strongPic[w.pic] = w.en;
  }
}
for (const t of TALK) {
  if (!TOPICS.find(x => x.id === t.t)) problems.push(`talk: no topic ${t.t}`);
  if (!t.f.includes('___')) problems.push(`talk: frame without ___: ${t.f}`);
}
for (const [id, text] of Object.entries(AR)) {
  const bare = text.split(/\s+/).filter(x => ARABIC.test(x) && !/[ً-ْ]/.test(x));
  if (bare.length) problems.push(`AR ${id}: words without haraka: ${bare.join(' ')}`);
}
TOPICS.forEach(t => { if (!AR['t-' + t.id]) problems.push(`AR t-${t.id} missing (the topic's spoken name)`); });
// Hamed's vowelled Arabic for what each word shows: same letters as the shown text, every word vowelled
const bare = t => t.replace(/[\u064B-\u0652\u0670\u0640]/g, '').replace(/[^\u0621-\u064A ]+/g, ' ').replace(/\s+/g, ' ').trim();
const unvowelled = t => t.split(/\s+/).filter(x => ARABIC.test(x) && !/[\u064b-\u0652]/.test(x));
const SPOKEN = new Map();   // shown text -> [vowelled text, pack]
const speak = (shown, vowelled, pack, where) => {
  if (!vowelled) { problems.push(`${where}: no vowelled line for "${shown}"`); return; }
  if (bare(vowelled) !== bare(shown)) problems.push(`${where}: letters differ\n      shown:  ${shown}\n      spoken: ${vowelled}`);
  const nv = unvowelled(vowelled); if (nv.length) problems.push(`${where}: words without haraka: ${nv.join(' ')}`);
  const had = SPOKEN.get(shown);
  if (had && had[0] !== vowelled) problems.push(`"${shown}" is vowelled two ways: ${had[0]} / ${vowelled}`);
  if (!had) SPOKEN.set(shown, [vowelled, pack]);
};
for (const t of TOPICS) {
  const rows = ARV[t.id] || [];
  if (rows.length !== t.words.length) problems.push(`arvoice ${t.id}: ${rows.length} rows for ${t.words.length} words`);
  t.words.forEach((w, i) => { const r = rows[i] || []; speak(w.ar, r[0], 'w-' + t.id, `arvoice ${t.id} "${w.en}" meaning`); speak(w.exAr, r[1], 's-' + t.id, `arvoice ${t.id} "${w.en}" sentence`); });
}
if (TALKV.length !== TALK.length) problems.push(`TALKV has ${TALKV.length} lines for ${TALK.length} talk questions`);
TALK.forEach((q, i) => speak(q.qAr, TALKV[i], 'talk', `TALKV ${i}`));

const total = WORDS.length, byStage = [1, 2, 3].map(s => TOPICS.filter(t => t.stage === s).reduce((n, t) => n + t.words.length, 0));
console.log(`${TOPICS.length} topics, ${total} words and phrases (stage 1: ${byStage[0]}, stage 2: ${byStage[1]}, stage 3: ${byStage[2]}), ${TALK.length} talk questions, ${Object.keys(AR).length} Arabic lines`);
if (problems.length) { console.log('PROBLEMS:\n  ' + problems.join('\n  ')); process.exit(1); }
console.log('data OK');
if (process.argv.includes('--check')) process.exit(0);

// ---------- English clips ----------
const S = {}, W = {};
for (const f of fs.readdirSync(VO)) {
  if (!f.endsWith('.json') || f === 'manifest.json') continue;
  try { const d = JSON.parse(fs.readFileSync(path.join(VO, f), 'utf8')); Object.assign(S, d.s || {}); Object.assign(W, d.w || {}); } catch (e) {}
}
const cid = t => crypto.createHash('sha1').update(t).digest('hex').slice(0, 12);
const exists = id => fs.existsSync(path.join(VO, id + '.mp3'));
function find(t) {
  for (const v of [t, t.replace(/'/g, '’')]) {
    if (exists(cid(v))) return cid(v);
    if (S[v] && exists(S[v])) return S[v];
  }
  if (/^[A-Za-z'-]+$/.test(t)) {
    const lo = t.toLowerCase();
    if (exists(cid(lo))) return cid(lo);
    if (W[lo] && exists(W[lo])) return W[lo];
  }
  return null;
}
// the page's own hash of a text (FNV-1a, base 36): the same function is in src/falcon/app.js
function fnv(text) {
  let h = 2166136261;
  for (const ch of text) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return h.toString(36);
}

const items = [];        // [key, pack, text, file]
const want = [], slow = [];
const add = (text, pack, isSlow) => {
  const id = find(text);
  if (!id) { want.push(text); if (isSlow) slow.push(text); return; }
  items.push(['e' + fnv(text), pack, path.join(VO, id + '.mp3')]);
  if (isSlow) {
    slow.push(text);
    if (exists(id + '-slow')) items.push(['z' + fnv(text), pack.replace(/^[ws]-/, 'z-'), path.join(VO, id + '-slow.mp3')]);
  }
};
for (const t of TOPICS) for (const w of t.words) {
  const phrase = /p/.test(w.fl);
  add(w.en, 'w-' + t.id, phrase);
  if (w.ex) add(w.ex, 's-' + t.id, true);
}
for (const q of TALK) { add(q.q, 'talk', true); add(q.a, 'talk', true); }
for (const list of Object.values(EN_UI)) for (const t of list) add(t, 'core', false);

const todo = [...new Set(want)];
fs.writeFileSync(path.join(ROOT, 'word-falcon-en-lines.json'),
  JSON.stringify({ voice: 'en-US-AvaNeural', lines: todo, slow: [...new Set(slow)] }, null, 1) + '\n');

// ---------- Arabic clips ----------
fs.writeFileSync(path.join(ROOT, 'word-falcon-lines.json'), JSON.stringify({ voice: 'ar-SA-HamedNeural',
  lines: Object.entries(AR).map(([id, text]) => ({ id, text })) }, null, 1) + '\n');
let manifest = {};
try { for (const l of JSON.parse(fs.readFileSync(path.join(AR_DIR, 'manifest.json'), 'utf8')).lines) manifest[l.id] = l; } catch (e) {}
const arMissing = [];
for (const [id, text] of Object.entries(AR)) {
  const m = manifest[id], f = path.join(AR_DIR, id + '.mp3');
  if (m && m.text === text && fs.existsSync(f)) items.push(['a' + id, 'core', f, fnv(text)]);
  else arMissing.push(id);
}

// the Arabic shown with the words, keyed by the shown text
const arWant = [];
for (const [shown, [vowelled, pack]] of SPOKEN) {
  const f = path.join(ARW, cid(vowelled) + '.mp3');
  if (fs.existsSync(f)) items.push(['r' + fnv(shown), pack, f]); else arWant.push(vowelled);
}
fs.writeFileSync(path.join(ROOT, 'word-falcon-ar2-lines.json'), JSON.stringify({ voice: 'ar-SA-HamedNeural', lufs: -14.5, lines: arWant }, null, 1) + '\n');

// ---------- packs ----------
const packs = {}, index = {};
for (const [key, pack, file, h] of items) {
  if (index[key]) continue;
  const data = fs.readFileSync(file), buf = packs[pack] || (packs[pack] = []);
  const off = buf.reduce((n, b) => n + b.length, 0);
  index[key] = h ? [pack, off, data.length, h] : [pack, off, data.length];
  buf.push(data);
}
fs.mkdirSync(OUT, { recursive: true });
for (const old of fs.readdirSync(OUT)) if (/^pack-.*\.mp3$/.test(old) && !packs[old.slice(5, -4)]) fs.unlinkSync(path.join(OUT, old));
let size = 0;
for (const [name, bufs] of Object.entries(packs)) { const b = Buffer.concat(bufs); size += b.length; fs.writeFileSync(path.join(OUT, `pack-${name}.mp3`), b); }
fs.writeFileSync(path.join(OUT, 'packs.json'), JSON.stringify({ packs: Object.fromEntries(Object.keys(packs).sort().map(n => [n, `pack-${n}.mp3`])), c: index }) + '\n');

console.log(`English: ${todo.length} lines to record (${todo.reduce((n, t) => n + t.length, 0)} characters); Arabic: ${arMissing.length} of ${Object.keys(AR).length} guide lines to record, ${arWant.length} of ${SPOKEN.size} word lines to record (${arWant.reduce((n, t) => n + t.length, 0)} characters)`);
console.log(`packed ${Object.keys(index).length} clips into ${Object.keys(packs).length} packs (${(size / 1e6).toFixed(1)} MB) in word-falcon/voices`);
