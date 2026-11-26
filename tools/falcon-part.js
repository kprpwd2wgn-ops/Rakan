// صقر الكلمات — turns a later part's source (src/falcon/parts/p<N>/src.txt) into the two files the page and the voice
// tool read: words.js (the words, talk questions and topic kinds, with the Arabic shown as plain letters) and arvoice.js
// (Hamed's fully vowelled lines). Each Arabic text is written once, vowelled, and the plain text shown on screen is
// made from it, so the two always have the same letters.
//
// src.txt, one item per line (blank lines and lines starting with # are skipped):
//   @topic id | vowelled Arabic name | English name | icon | colour | stage (1-3) | kind (for the sentence questions)
//   english | picture | example sentence | flags | vowelled meaning | vowelled Arabic of the sentence | wrong answers
//   @talk question | vowelled Arabic of the question | answer frame with ___ | model answer      (for the last topic)
// For a class phrase (flag p) the sentence column is empty and the last Arabic column says when to say it.
// usage: node tools/falcon-part.js <N>
const fs = require('fs'), path = require('path');
const N = +process.argv[2];
if (!(N >= 2)) { console.log('usage: node tools/falcon-part.js <N>   (N = 2..6)'); process.exit(1); }
const DIR = path.join(__dirname, '..', 'src/falcon/parts', 'p' + N);
const plain = t => t.replace(/[ً-ْٰـ]/g, '');
const js = s => JSON.stringify(s);
const lines = fs.readFileSync(path.join(DIR, 'src.txt'), 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
const topics = [], talk = [], problems = [];
let cur = null;
for (const l of lines) {
  const f = l.split('|').map(x => x.trim());
  if (l.startsWith('@topic')) {
    const [id, ar, en, icon, color, stage, kind] = [f[0].replace('@topic', '').trim(), ...f.slice(1)];
    cur = { id, ar, en, icon, color, stage: +stage, kind, rows: [] };
    if (!kind || !(cur.stage >= 1 && cur.stage <= 3)) problems.push(`topic ${id}: needs a stage 1-3 and a kind`);
    topics.push(cur); continue;
  }
  if (l.startsWith('@talk')) {
    const [q, qAr, fr, a] = [f[0].replace('@talk', '').trim(), ...f.slice(1)];
    if (!cur || !a) { problems.push('talk line without a topic or a model answer: ' + l); continue; }
    talk.push({ t: cur.id, q, qAr, f: fr, a }); continue;
  }
  if (!cur) { problems.push('a word before any @topic: ' + l); continue; }
  if (f.length < 6) { problems.push(`${cur.id}: needs 6 columns: ${l}`); continue; }
  const [en, pic, ex, fl, mean, exAr, gx] = f;
  cur.rows.push({ en, pic, ex, fl, mean, exAr, gx: gx || '' });
}
if (problems.length) { console.log('PROBLEMS:\n  ' + problems.join('\n  ')); process.exit(1); }

const head = `/* صقر الكلمات — part ${N}: made by \`node tools/falcon-part.js ${N}\` from src.txt in this folder. Edit src.txt, not this file. */\n`;
let w = head;
for (const t of topics) {
  w += `\nT(${js(t.id)}, ${js(plain(t.ar))}, ${js(t.en)}, ${js(t.icon)}, ${js(t.color)}, ${t.stage}, \`\n`;
  for (const r of t.rows) w += [r.en, plain(r.mean), r.pic, r.ex, plain(r.exAr), r.fl, r.gx].join(' | ').replace(/( \| )+$/, '') + '\n';
  w += '`);\n';
}
w += `\nconst TALK = [\n${talk.map(q => ` [${[q.t, q.q, plain(q.qAr), q.f, q.a].map(js).join(',')}],`).join('\n')}\n].map(([t, q, qAr, f, a]) => ({ t, q, qAr, f, a }));\n`;
w += `const KIND_PART = ${js(Object.fromEntries(topics.map(t => [t.id, t.kind])))};\n`;
w += `const AR_TOPICS = {\n${topics.map(t => `  ${js('t-' + t.id)}: ${js(t.ar.replace(/[.!؟]$/, '') + '.')},`).join('\n')}\n};\n`;
w += `const WORDS = [].concat(...TOPICS.map(t => t.words));\nif (typeof module !== 'undefined') module.exports = { TOPICS, TALK, WORDS, KIND_PART, AR_TOPICS };\n`;
fs.writeFileSync(path.join(DIR, 'words.js'), w);

let a = head;
for (const t of topics) a += `\nV(${js(t.id)}, \`\n${t.rows.map(r => r.mean + ' | ' + r.exAr).join('\n')}\n\`);\n`;
a += `\nconst TALKV = [\n${talk.map(q => '  ' + js(q.qAr) + ',').join('\n')}\n];\nif (typeof module !== 'undefined') module.exports = { ARV, TALKV };\n`;
fs.writeFileSync(path.join(DIR, 'arvoice.js'), a);
const n = topics.reduce((s, t) => s + t.rows.length, 0);
console.log(`part ${N}: ${topics.length} topics, ${n} words and phrases (stage 1: ${topics.filter(t => t.stage === 1).reduce((s, t) => s + t.rows.length, 0)}, stage 2: ${topics.filter(t => t.stage === 2).reduce((s, t) => s + t.rows.length, 0)}, stage 3: ${topics.filter(t => t.stage === 3).reduce((s, t) => s + t.rows.length, 0)}), ${talk.length} talk questions`);
