// Lists every English line Talk Town or Reading Rocket can say, finds the ones already recorded with Ollie's
// Azure voice (en-US-AvaNeural, ollie/voices/<sha1[:12]>.mp3), writes the game's clip map and the lines still to record.
//
//   node tools/en-lines.js talk|reading [--slow]
//     writes ollie/voices/<game>.json   clip map the game loads: {s:{text:id}, slow:[ids that have a -slow copy]}
//            <game>-en-lines.json       {"voice","lines":[not recorded yet],"slow":[sentences]} for tools/english-voices.py
//     --slow makes the missing 75%-speed copies of recorded sentences with ffmpeg (no Azure needed)
//
// After recording:  python3 tools/english-voices.py <game>-en-lines.json --out ollie/voices
//                   node tools/en-lines.js <game> --slow && python3 src/build.py <game>
// A line the game says but this list misses is spoken by the device voice: keep the list in step with the game.
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto'), cp = require('child_process');
const ROOT = path.resolve(__dirname, '..'), V = path.join(ROOT, 'ollie', 'voices');
const game = process.argv[2], SLOW = process.argv.includes('--slow');
const NAME = { talk: 'talk-town', reading: 'reading-rocket' }[game];
if (!NAME) { console.log('usage: node tools/en-lines.js talk|reading [--slow]'); process.exit(1); }

/* load game sources the way src/build.py joins them, with just enough of a browser to define the data */
function load(files) {
  const el = () => ({ addEventListener() {}, classList: { add() {}, remove() {}, toggle() {} }, style: {}, appendChild() {} });
  const ctx = { console, Math, JSON, Object, Array, String, Number, RegExp, Set, Map, Date, Promise, setTimeout, clearTimeout,
    navigator: { userAgent: '' }, location: { hostname: '' }, localStorage: { getItem: () => null, setItem() {} },
    matchMedia: () => ({ matches: false }), fetch: () => Promise.reject(new Error('offline')), innerWidth: 390, innerHeight: 780,
    document: { addEventListener() {}, querySelector: () => null, querySelectorAll: () => [], createElement: el, body: el() } };
  ctx.window = ctx; vm.createContext(ctx);
  const src = files.map(f => fs.readFileSync(path.join(ROOT, 'src', f), 'utf8')).join('\n');
  vm.runInContext(src.replace(/(^|;)(const|let) /gm, '$1var '), ctx);
  return ctx;
}
const KIT = ['kit/base.js', 'kit/fx.js', 'kit/voice.js', 'kit/hero.js', 'kit/things.js', 'kit/sfx.js'];

const lines = new Set(), words = new Set(), sentences = new Set();
const say = t => { t = String(t).replace(/\s+/g, ' ').trim(); if (t) lines.add(t); };
let wkey = w => String(w).toLowerCase().replace(/^[^a-z']+|[^a-z']+$/g, '');
const word = w => { w = wkey(w); if (w) words.add(w); };
const wordsOf = t => String(t).split(/\s+/).forEach(word);

/* lines the kit itself says in these games */
say('Hello! I will talk like this.'); say('Hello! This is how I talk.');

if (game === 'reading') {
  const C = load([...KIT, 'reading/words.js', 'reading/data.js', 'reading/tales.js', 'reading/rooms.js', 'reading/draw.js',
    'reading/reader.js', 'reading/pictures.js', 'reading/detective.js']);
  wkey = C.wkey; // a tapped word is said the way the reader finds it ("Noor's" → noor)
  // monster targets (said as written: "I" stays "I")
  Object.values(C.CVC).forEach(v => v.words.forEach(w => word(w[0])));
  C.PATTERNS.forEach(p => p.words.forEach(w => word(w[0]))); C.MAGIC.forEach(w => word(w[0]));
  C.SIGHT.forEach(s => s.words.forEach(w => word(w[0])));
  // stories: each line is read on its own; every word can be tapped
  C.TALES.forEach(t => Object.values(t.pages).forEach(p => { p.s.forEach(s => { say(s); wordsOf(s); }); (p.c || []).forEach(c => wordsOf(c[0])); }));
  // escape rooms
  C.ROOMS.forEach(r => r.steps.forEach(s => { say(s.en); wordsOf(s.en); })); wordsOf('Open the door!');
  say('You found the key!'); say('You escaped! Great reading!'); say('You found the thief!');
  // detective clues: every fact, and both halves of "and" clues
  const facts = [];
  for (const a of Object.keys(C.VALS)) for (const v of C.VALS[a]) for (const neg of [false, true]) facts.push({ a, v, neg });
  facts.forEach(f => { const en = C.factText(f)[0]; say(en); wordsOf(en); say(en.replace(/\.$/, '')); say('and ' + en.replace(/^The thief /, '')); });
  // picture planet: read word by word, so every word of every sentence
  for (let li = 0; li < C.P_LV.length; li++) for (let k = 0; k < 400; k++) {
    const L = C.P_LV[li], Lr = L.mix ? C.P_LV[L.mix[k % L.mix.length]] : L, r = C.makeRound(Lr, Math.random);
    if (r) r.opts.forEach(o => C.specTokens(o.s).forEach(t => word(t.w)));
  }
  C.PSET.forEach(n => { word(n); word(C.pPl(n)); }); Object.keys(C.PBASE).forEach(word); C.PCOLS.forEach(word); C.PNUM.forEach(word);
  ['next', 'to', 'behind', 'under', 'on', 'in', 'is', 'are', 'not', 'it', 'they', 'the', 'a', 'an', 'and', 'i', 'see', 'big', 'small', 'teddies'].forEach(word);
  // intro pages (English guide lines)
  ['Welcome to Reading Rocket! There are many missions in space, and every mission needs a smart reader like you.',
   'Read to win! Zap the word monsters, find the right picture, read the clues to catch the thief, and read the notes to escape from the rooms.',
   'A hard word? Tap any English word to hear it, and see what it means in Arabic.'].forEach(say);
}

if (game === 'talk') {
  const C = load([...KIT, 'talk/data.js', 'talk/mazes.js', 'talk/mazecore.js', 'talk/visits.js', 'talk/mic.js', 'talk/studio.js', 'talk/paint.js', 'talk/alien.js']);
  const NUMW = C.NUMW;
  // Robo
  for (const d of ['up', 'down', 'left', 'right']) { say(`Going ${d}!`); for (let n = 1; n <= 10; n++) say(`Going ${d} ${NUMW[n]}!`); }
  for (const c of ['gold', 'red', 'blue']) { say(`Got the ${c} key!`); say(`Hmm, this key is ${c}!`); say(`It is locked! I need the ${c} key.`); }
  ['A door! It is closed.', 'Bonk! A wall!', 'There is no key here.', 'The door is open!', 'That is not the right color!', 'There is no door next to me.',
   'Yay! We did it!', "Beep? I don't understand.", "Let's try again!", "Hi! I'm Robo. Tell me where to go!", 'Ready! Where do we go?', 'Say:'].forEach(say);
  C.MAZES.forEach(L => L.words.forEach(w => say(w)));
  say('pick up'); ['up', 'down', 'left', 'right', 'key', 'open', 'door', 'and', 'gold', 'red', 'blue'].forEach(word);
  NUMW.slice(1, 11).forEach(word);
  // Mister Brush
  ['Hello! What should I paint today?', 'Can you tell me what is in this picture?', 'A clean page!', 'Okay, I took it away.', 'Hmm? What should I paint?',
   'Here you go!', 'Yes!', 'What else?', 'You already have that one!', 'Look at the color!', 'Say the color too!', 'How many? Say the number too!', 'Count again!',
   'Is it big or small?', 'Not big, not small. Just the normal size!', 'Wow! The same picture! You are an artist!', 'Try: a big yellow sun!',
   'Look at the small picture.', 'Paint something first!', 'What a beautiful picture! I put it in your gallery.'].forEach(say);
  Object.keys(C.PNOUNS).forEach(n => { say(`I don't see a ${n} in the picture.`); word(n); word(C.pluralN(n)); });
  Object.keys(C.COLHEX).forEach(word); ['big', 'small', 'a', 'an', 'and'].forEach(word);
  // Leo's visits: questions, examples, reactions, and the full sentence made from each word the child may say
  const catWords = cats => (cats || '').split(',').filter(Boolean).flatMap(c => C.CATS[c].split('|'));
  C.GENERIC.forEach(g => say(g[0]));
  ["Hmm? I don't understand. Can you say it again?", 'Try like this:', 'Perfect sentence!', "Okay! Let's go on.", 'Thank you, my Earth friend!'].forEach(say);
  C.VISITS.forEach(V => V.steps.forEach(st => {
    say(st.q); say(C.exSay(st)); (st.react || []).forEach(r => say(r[1]));
    const xs = catWords(st.cat);
    if (st.after) { if (/\{(X|x|xs|xa)\}/.test(st.after[0])) xs.forEach(x => say(C.subst(st.after[0], x))); else say(st.after[0]); }
    if (st.tpl) xs.forEach(x => say(C.modelOf(st, x)));
  }));
  // Leo's studio
  C.SHOWS.forEach(S => S.q.forEach(q => { say(q.model); say(q.ans[0]); }));
  ["Hi! Welcome to my TV show! You are the reporter. Ask me anything!", 'Hello again, reporter! I am ready for your questions.', 'What a great question!',
   'Hmm? Can you ask me again?', 'You can ask:', 'Thank you for the interview! You are a great reporter!'].forEach(say);
  // My words: every word the town can collect
  [...C.ALLW, ...C.QWORDS].forEach(w => (/ /.test(w) ? say(w) : word(w)));
  // intro pages
  ['Welcome to Talk Town! Here, your voice moves everything. Speak in English, and see what happens!',
   'Your friends are waiting. Robo walks when you tell him. Mister Brush paints what you say. Leo the alien asks you questions, and in his studio, you ask him!',
   'Tap the microphone and talk. Say what you want, all by yourself! If the microphone does not work, you can type in English.'].forEach(say);
}

/* what is recorded already */
const id = t => crypto.createHash('sha1').update(t).digest('hex').slice(0, 12);
const have = i => fs.existsSync(path.join(V, i + '.mp3'));
const S = {}, missing = [];
const split = t => (t.match(/[^.!?…]+[.!?…]*['"]?/g) || []).map(s => s.trim()).filter(Boolean);
for (const w of words) { if (have(id(w))) S[w] = id(w); else missing.push(w); }
for (const t of lines) {
  if (/^[A-Za-z'-]+$/.test(t) && S[t.toLowerCase()]) continue;          // a single word already in the map
  if (have(id(t))) { S[t] = id(t); sentences.add(t); continue; }
  const parts = split(t);
  if (parts.length > 1 && parts.every(p => have(id(p)))) { parts.forEach(p => { S[p] = id(p); sentences.add(p); }); continue; }
  missing.push(t); if (!/^[A-Za-z'-]+$/.test(t)) sentences.add(t);
}
/* 75% copies of sentences for the slow speech setting */
let made = 0;
if (SLOW) for (const t of sentences) {
  const i = id(t), src = path.join(V, i + '.mp3'), dest = path.join(V, i + '-slow.mp3');
  if (fs.existsSync(src) && !fs.existsSync(dest)) {
    cp.execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', src, '-af', 'atempo=0.75', '-codec:a', 'libmp3lame', '-b:a', '48k', dest]); made++;
  }
}
const slow = [...new Set(Object.values(S))].filter(i => fs.existsSync(path.join(V, i + '-slow.mp3'))).sort();
const sorted = {}; Object.keys(S).sort().forEach(k => { sorted[k] = S[k]; });
fs.writeFileSync(path.join(V, NAME + '.json'), JSON.stringify({ s: sorted, slow }));
fs.writeFileSync(path.join(ROOT, NAME + '-en-lines.json'), JSON.stringify({ voice: 'en-US-AvaNeural', lines: missing, slow: [...sentences].sort() }, null, 1) + '\n');
const chars = missing.reduce((a, t) => a + t.length, 0);
console.log(`${NAME}: ${lines.size} lines + ${words.size} words; recorded ${Object.keys(S).length} (slow ${slow.length}${SLOW ? `, ${made} made now` : ''}); to record ${missing.length} (${chars} characters)`);
