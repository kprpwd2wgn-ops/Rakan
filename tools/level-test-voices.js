// اختبار المستوى (level-test.html): finds a recorded clip for every line the test says and packs them into one file.
// English lines are Ollie's Azure voice (en-US-AvaNeural) in ollie/voices/<sha1>.mp3; lines with no clip yet go to
// level-test-en-lines.json. Hamed's Arabic lines (LT_AR in src/leveltest/items.js) go to level-test-lines.json and are
// recorded into level-test/ar/. Then everything is joined into level-test/voices/pack-core.mp3 with packs.json
// (keyed by a hash of the text, the same as the page's), so the play link carries two voice files.
// To record what is missing (needs AZURE_SPEECH_KEY):
//   python3 tools/english-voices.py level-test-en-lines.json --out ollie/voices
//   python3 tools/game-voices.py level-test-lines.json --out level-test/ar
//   node tools/level-test-voices.js
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.join(__dirname, '..'), VO = path.join(ROOT, 'ollie/voices'), AR_DIR = path.join(ROOT, 'level-test/ar'), OUT = path.join(ROOT, 'level-test/voices');
const { LT_SECTIONS, LT_AR } = require(path.join(ROOT, 'src/leveltest/items.js'));
const cid = t => crypto.createHash('sha1').update(t).digest('hex').slice(0, 12);
function fnv(text) { let h = 2166136261; for (const ch of text) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36); }

const english = new Set();
for (const s of LT_SECTIONS) for (const it of s.items) {
  if (typeof it.say === 'string') english.add(it.say);
  if (Array.isArray(it.say)) it.say.forEach(t => english.add(t));
}
const items = [], want = [];
for (const t of english) {
  const f = path.join(VO, cid(t) + '.mp3');
  if (fs.existsSync(f)) items.push(['e' + fnv(t), f]); else want.push(t);
}
fs.writeFileSync(path.join(ROOT, 'level-test-en-lines.json'), JSON.stringify({ voice: 'en-US-AvaNeural', lines: want }, null, 1) + '\n');

const problems = [];
for (const [id, text] of Object.entries(LT_AR)) {
  const bare = text.split(/\s+/).filter(x => /[ء-ي]/.test(x) && !/[ً-ْ]/.test(x));
  if (bare.length) problems.push(`${id}: words without haraka: ${bare.join(' ')}`);
}
for (const s of LT_SECTIONS) for (const it of s.items) for (const q of [it, ...(it.qs || [])]) if (q.qa && !LT_AR[q.qa]) problems.push(`${q.id}: no Arabic line ${q.qa}`);
if (problems.length) { console.log('PROBLEMS:\n  ' + problems.join('\n  ')); process.exit(1); }
fs.writeFileSync(path.join(ROOT, 'level-test-lines.json'), JSON.stringify({ voice: 'ar-SA-HamedNeural', lines: Object.entries(LT_AR).map(([id, text]) => ({ id, text })) }, null, 1) + '\n');
let manifest = {};
try { for (const l of JSON.parse(fs.readFileSync(path.join(AR_DIR, 'manifest.json'), 'utf8')).lines) manifest[l.id] = l; } catch (e) {}
let arMissing = 0;
for (const [id, text] of Object.entries(LT_AR)) {
  const m = manifest[id], f = path.join(AR_DIR, id + '.mp3');
  if (m && m.text === text && fs.existsSync(f)) items.push(['a' + id, f, fnv(text)]); else arMissing++;
}

fs.mkdirSync(OUT, { recursive: true });
const bufs = [], index = {}; let off = 0;
for (const [key, file, h] of items) { const d = fs.readFileSync(file); index[key] = h ? ['core', off, d.length, h] : ['core', off, d.length]; bufs.push(d); off += d.length; }
fs.writeFileSync(path.join(OUT, 'pack-core.mp3'), Buffer.concat(bufs));
fs.writeFileSync(path.join(OUT, 'packs.json'), JSON.stringify({ packs: { core: 'pack-core.mp3' }, c: index }) + '\n');
console.log(`English: ${english.size} lines, ${want.length} to record; Arabic: ${Object.keys(LT_AR).length} lines, ${arMissing} to record; packed ${items.length} clips (${(off / 1e6).toFixed(1)} MB)`);
