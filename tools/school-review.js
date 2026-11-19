// School-book reviews in Arabic (third grade, first term): builds <name>-3-review.html from
// src/school-review/engine.html + src/school-review/<name>.js, and writes <name>-3-review-lines.json,
// the lines Hamed (ar-SA-HamedNeural) says, for tools/game-voices.py.
// The page plays a clip only when <name>-3-review/voices/manifest.json lists that exact text, and stays
// silent otherwise (no device voice), so recording needs no rebuild:
//   python3 tools/game-voices.py <name>-3-review-lines.json --out <name>-3-review/voices
// usage: node tools/school-review.js [lughati|math|science ...]   (no name = all three)
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.join(__dirname, '..'), SRC = path.join(ROOT, 'src/school-review');
const engine = fs.readFileSync(path.join(SRC, 'engine.html'), 'utf8');
const FIXED = ['أَحْسَنْتَ!', 'مُمْتَازٌ!', 'إِجَابَةٌ صَحِيحَةٌ!', 'رَائِعٌ، أَنْتَ بَطَلٌ!', 'انْتَبِهْ، هَذِهِ هِيَ الْإِجَابَةُ الصَّحِيحَةُ.',
  'أَنْتَ بَطَلٌ! أَنْتَ جَاهِزٌ لِلِاخْتِبَارِ.', 'مُمْتَازٌ! رَاجِعْ أَخْطَاءَكَ الْقَلِيلَةَ.', 'جَيِّدٌ! تَحْتَاجُ إِلَى مَزِيدٍ مِنَ التَّدْرِيبِ.',
  'لَا بَأْسَ، رَاجِعْ دُرُوسَكَ ثُمَّ حَاوِلْ مِنْ جَدِيدٍ.'];
const HARAKA = /[ً-ْٰ]/, LETTER = /[ء-ي]/;
const names = process.argv.slice(2).length ? process.argv.slice(2) : ['lughati', 'math', 'science'];
let bad = 0;
for (const name of names) {
  const data = fs.readFileSync(path.join(SRC, name + '.js'), 'utf8');
  const G = new Function(data + ';return {CFG,Q,P,SUM};')();
  const page = name + '-3-review';
  if (G.CFG.dir !== page + '/voices') throw new Error(name + ': CFG.dir must be ' + page + '/voices');
  const html = engine.replace('/*TITLE*/', G.CFG.title).replace('/*DATA*/', () => data);
  fs.writeFileSync(path.join(ROOT, page + '.html'), html);
  const L = new Set(FIXED);
  const spoken = q => q.v === 0 ? null : (q.v || (LETTER.test(q.q || '') ? q.q : null));
  G.Q.forEach(q => { [spoken(q), q.say, q.t === 'speak' ? (q.model || q.q) : null].forEach(t => t && L.add(String(t).trim())); });
  Object.values(G.P).forEach(p => (p.parts || [p.x]).forEach(t => L.add(t.trim())));
  const lines = [...L].map(text => ({ id: crypto.createHash('sha1').update(text).digest('hex').slice(0, 12), text }));
  fs.writeFileSync(path.join(ROOT, page + '-lines.json'), JSON.stringify({ voice: 'ar-SA-HamedNeural', lines }, null, 1) + '\n');
  const bare = [];
  lines.forEach(l => l.text.split(/\s+/).forEach(w => { if (LETTER.test(w) && !HARAKA.test(w) && w.replace(/[^ء-ي]/g, '').length > 1) bare.push(w); }));
  bad += bare.length;
  const chars = lines.reduce((a, l) => a + l.text.length, 0);
  console.log(`${page}.html: ${G.Q.length} questions, ${lines.length} spoken lines (${chars} characters)` +
    (bare.length ? `; ${bare.length} words without tashkeel: ${[...new Set(bare)].slice(0, 30).join(' ')}` : '; every word vowelled'));
}
process.exit(bad ? 1 : 0);
