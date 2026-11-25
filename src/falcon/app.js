/* صقر الكلمات Word Falcon — the program: sound, progress, spaced review and the screens.
   Built by `python3 src/build.py falcon` together with words*.js, say.js, art.js, quiz.js and games.js. */
'use strict';
const app = document.getElementById('app');
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pick = a => a[Math.floor(Math.random() * a.length)];
const mix = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const AD = '٠١٢٣٤٥٦٧٨٩', num = n => String(n).replace(/\d/g, d => AD[d]);
const wait = ms => new Promise(r => setTimeout(r, ms));
const MIC = window.SpeechRecognition || window.webkitSpeechRecognition;
let micBlocked = false;
const canMic = () => !!MIC && !micBlocked && ST.set.mic && location.protocol !== 'file:';

/* ---------- the recorded voice: Ollie's English and Hamed's Arabic, in pack files ---------- */
// the same hash as tools/falcon-voices.js
function fnv(text) { let h = 2166136261; for (const ch of text) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36); }
const VO = {
  dir: 'word-falcon/voices', ctx: null, idx: null, packs: {}, bufs: {}, order: [], src: null, ready: null, tok: 0, busy: false,
  start() {
    if (this.ready) return this.ready;
    const AC = window.AudioContext || window.webkitAudioContext;
    try { this.ctx = AC ? new AC() : null; } catch (e) { this.ctx = null; }
    if (!this.ctx) return this.ready = Promise.resolve();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    if (location.protocol === 'file:') return this.ready = Promise.resolve();
    return this.ready = fetch(this.dir + '/packs.json').then(r => r.json()).then(j => { this.idx = j; this.pack('core'); }).catch(e => console.warn('voices not loaded', e));
  },
  pack(name) {
    if (!this.idx || !this.idx.packs[name]) return Promise.resolve(null);
    return this.packs[name] || (this.packs[name] = fetch(this.dir + '/' + this.idx.packs[name]).then(r => r.ok ? r.arrayBuffer() : null).catch(() => null));
  },
  key(x) {
    if (typeof x === 'string') return ['e' + fnv(x)];
    if (x.a) return ['a' + x.a, fnv(AR[x.a] || '')];
    if (x.z) return ['z' + fnv(x.z)];
    return ['e' + fnv(x.e)];
  },
  has(x) { const [k] = this.key(x); return !!(this.idx && this.idx.c[k]); },
  clip(k, h) {
    if (this.bufs[k]) return this.bufs[k];
    const e = this.idx && this.idx.c[k];
    if (!e || (e[3] && e[3] !== h)) return Promise.resolve(null);
    const p = this.pack(e[0]).then(ab => ab ? new Promise(res => {
      try { const d = this.ctx.decodeAudioData(ab.slice(e[1], e[1] + e[2]), res, () => res(null)); if (d && d.catch) d.catch(() => res(null)); } catch (err) { res(null); }
    }) : null);
    this.bufs[k] = p; this.order.push(k);
    if (this.order.length > 70) delete this.bufs[this.order.shift()];
    return p;
  },
  pre(list) { if (!this.idx) return; for (const x of list) { const [k] = this.key(x), e = this.idx.c[k]; if (e) this.pack(e[0]); } },
  stop() { this.tok++; this.busy = false; if (this.src) { try { this.src.onended = null; this.src.stop(); } catch (e) {} this.src = null; } speakUI(false); },
  async play(x, tok) {
    if (!this.ctx) return;
    await this.ready;
    const [k, h] = this.key(x);
    let b = await this.clip(k, h);
    if (!b && x && x.z) b = await this.clip('e' + fnv(x.z));
    if (!b || tok !== this.tok) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return new Promise(res => {
      const s = this.ctx.createBufferSource(); s.buffer = b; s.connect(this.ctx.destination);
      s.onended = () => { if (this.src === s) this.src = null; res(); };
      this.src = s; s.start();
      setTimeout(res, b.duration * 1000 + 400);
    });
  },
  // say a list of lines in order: 'English text', {a: 'arabic-id'}, {z: 'text to say slowly'}, or a pause in ms
  async say(list) {
    this.stop(); const tok = this.tok; this.busy = true; speakUI(true);
    for (const x of [].concat(list)) {
      if (tok !== this.tok) return;
      if (typeof x === 'number') { await wait(x); continue; }
      if (x) await this.play(x, tok);
    }
    if (tok === this.tok) { this.busy = false; speakUI(false); }
  },
};
function speakUI(on) { document.querySelectorAll('.spkbig').forEach(b => b.classList.toggle('play', on)); }
const praise = () => pick(EN_UI.good);

// the iPhone silent switch mutes Web Audio: ask for media playback and keep a silent sound playing after the first tap
const UNMUTE = { a: null,
  url() { const sr = 8000, n = sr, b = new ArrayBuffer(44 + n * 2), v = new DataView(b), w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
    return URL.createObjectURL(new Blob([b], { type: 'audio/wav' })); },
  go() { try { if (navigator.audioSession && navigator.audioSession.type !== 'playback') navigator.audioSession.type = 'playback'; } catch (e) {}
    if (document.hidden) return;
    try { if (!this.a) { const a = document.createElement('audio'); a.setAttribute('playsinline', ''); a.setAttribute('x-webkit-airplay', 'deny'); a.loop = true; a.preload = 'auto'; a.src = this.url(); this.a = a; }
      if (this.a.paused) { const p = this.a.play(); if (p && p.catch) p.catch(() => {}); } } catch (e) {} },
};
['touchend', 'click', 'keydown'].forEach(ev => document.addEventListener(ev, () => { UNMUTE.go(); if (VO.ctx && VO.ctx.state === 'suspended') VO.ctx.resume(); }, { capture: true, passive: true }));
document.addEventListener('visibilitychange', () => { if (UNMUTE.a) { if (document.hidden) UNMUTE.a.pause(); else UNMUTE.go(); } });

// sound effects: short bursts of filtered noise only, never notes or tunes (no music)
const SFX = { noise: null,
  burst(at, dur, type, freq, q, vol, to) { const c = VO.ctx;
    if (!this.noise) { const n = c.createBuffer(1, c.sampleRate * .6 | 0, c.sampleRate), d = n.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; this.noise = n; }
    const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = this.noise; f.type = type; f.frequency.setValueAtTime(freq, at); f.Q.value = q;
    if (to) f.frequency.exponentialRampToValueAtTime(to, at + dur);
    g.gain.setValueAtTime(.0001, at); g.gain.exponentialRampToValueAtTime(vol, at + .008); g.gain.exponentialRampToValueAtTime(.0001, at + dur);
    s.connect(f); f.connect(g); g.connect(c.destination); s.start(at, Math.random() * .3); s.stop(at + dur + .03); },
  play(kind) { if (!ST.set.sfx) return; try { const c = VO.ctx; if (!c || c.state !== 'running') return; const t = c.currentTime + .01, B = this.burst.bind(this);
    switch (kind) {
      case 'tap': B(t, .035, 'bandpass', 1700, 1, .3); break;
      case 'ok': B(t, .045, 'bandpass', 1500, 1.4, .7); B(t + .08, .07, 'bandpass', 2300, 1.4, .6); break;
      case 'no': B(t, .2, 'lowpass', 240, .7, 1.4); break;
      case 'pop': B(t, .08, 'bandpass', 800, 1.6, 1.2); break;
      case 'flip': B(t, .09, 'bandpass', 2600, 1.2, .5, 900); break;
      case 'whoosh': B(t, .4, 'bandpass', 300, 1.2, .8, 2400); break;
      case 'win': for (let k = 0; k < 16; k++) B(t + k * .05 + Math.random() * .03, .05, 'bandpass', 1200 + Math.random() * 1800, 1, .4); break;
      case 'sparkle': for (let k = 0; k < 6; k++) B(t + k * .04, .04, 'highpass', 5000 + Math.random() * 3000, 2, .28); break;
    } } catch (e) {} },
};
const sfx = k => SFX.play(k);

// confetti and sparks on the canvas over the page
const REDUCED = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const FX = { c: null, x: null, p: [], raf: 0,
  init() { if (this.x) return; this.c = document.getElementById('fx'); if (!this.c) return; this.x = this.c.getContext('2d'); const rs = () => { const d = Math.min(2, window.devicePixelRatio || 1); this.c.width = innerWidth * d; this.c.height = innerHeight * d; this.x.setTransform(d, 0, 0, d, 0, 0); }; rs(); addEventListener('resize', rs); },
  confetti() { if (REDUCED || !this.x) return; const cols = ['#ffd95a', '#ff8a80', '#8fe3ff', '#b8f28c', '#c9a8ff', '#ffb86b'];
    for (let i = 0; i < 110; i++) this.p.push({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * .4, vx: (Math.random() - .5) * 160, vy: 80 + Math.random() * 160, g: 120, life: 0, max: 2.6 + Math.random(), r: 4 + Math.random() * 5, col: pick(cols), rot: Math.random() * 6, vr: (Math.random() - .5) * 8 });
    this.run(); },
  burst(x, y) { if (REDUCED || !this.x) return; for (let i = 0; i < 16; i++) { const a = Math.random() * 7, s = 120 + Math.random() * 160; this.p.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 60, g: 380, life: 0, max: .6 + Math.random() * .4, r: 3 + Math.random() * 3, col: pick(['#ffd95a', '#8fe3ff', '#b8f28c', '#fff']), dot: 1 }); } this.run(); },
  run() { if (this.raf) return; let last = performance.now();
    const step = t => { const dt = Math.min(.05, (t - last) / 1000); last = t; const x = this.x; x.clearRect(0, 0, innerWidth, innerHeight);
      this.p = this.p.filter(q => (q.life += dt) < q.max);
      for (const q of this.p) { q.vy += q.g * dt; q.x += q.vx * dt; q.y += q.vy * dt; x.globalAlpha = Math.max(0, Math.min(1, (1 - q.life / q.max) * 1.4)); x.fillStyle = q.col;
        if (q.dot) { x.beginPath(); x.arc(q.x, q.y, q.r, 0, 7); x.fill(); } else { q.rot += q.vr * dt; x.save(); x.translate(q.x, q.y); x.rotate(q.rot); x.fillRect(-q.r, -q.r / 2, q.r * 2, q.r); x.restore(); } }
      x.globalAlpha = 1; if (this.p.length) this.raf = requestAnimationFrame(step); else { this.raf = 0; x.clearRect(0, 0, innerWidth, innerHeight); } };
    this.raf = requestAnimationFrame(step); },
};

/* ---------- progress, kept in this browser ---------- */
const KEY = 'rakan-falcon-v1';
const DEF = () => ({ w: {}, ls: {}, fe: 0, own: {}, wear: {}, bg: 'desert', days: {}, streak: { n: 0, last: -9 }, best: {}, badges: {},
  set: { goal: 1, arHide: false, sfx: true, mic: true, rev: 15 }, placed: false, rank: 0, talk: {}, hello: false, games: 0, talkN: 0, revN: 0, perfect: 0, goalDay: -1 });
let ST = (() => { try { const r = localStorage.getItem(KEY); if (r) { const o = Object.assign(DEF(), JSON.parse(r)); o.set = Object.assign(DEF().set, o.set); return o; } } catch (e) {} return DEF(); })();
function save() { try { localStorage.setItem(KEY, JSON.stringify(ST)); } catch (e) {} }
const DAY = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 864e5);
function today() { const d = DAY(); return ST.days[d] || (ST.days[d] = { n: 0, r: 0, c: 0, q: 0, s: 0, l: 0 }); }
function streakNow() { return ST.streak.last >= DAY() - 1 ? ST.streak.n : 0; }
function touchStreak() { const d = DAY(); if (ST.streak.last === d) return false; ST.streak.n = ST.streak.last === d - 1 ? ST.streak.n + 1 : 1; ST.streak.last = d; save(); return true; }
let lastTouch = Date.now();
['pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, () => { lastTouch = Date.now(); }, { capture: true, passive: true }));
setInterval(() => { if (!document.hidden && Date.now() - lastTouch < 60000 && cur && cur.name !== 'splash') { today().s += 10; save(); } }, 10000);

/* ---------- the words ---------- */
const BYK = {};
const isPhrase = w => w.fl.includes('p'), weak = w => w.fl.includes('w') || isPhrase(w), sacred = w => w.fl.includes('s');
const letters = w => w.en.replace(/[^A-Za-z]/g, '');
const spellable = w => !isPhrase(w) && letters(w).length >= 2 && letters(w).length <= 10;
const TOPIC = {};
TOPICS.forEach((t, i) => {
  t.i = i; TOPIC[t.id] = t;
  const n = Math.max(1, Math.round(t.words.length / 6)), base = Math.floor(t.words.length / n), extra = t.words.length % n;
  t.lessons = []; let at = 0;
  for (let j = 0; j < n; j++) { const len = base + (j < extra ? 1 : 0); t.lessons.push(t.words.slice(at, at + len)); at += len; }
  t.lessons.forEach((L, j) => L.forEach(w => { w.li = j; }));
  t.words.forEach(w => {
    w.k = w.en.toLowerCase(); BYK[w.k] = w;
    let n2 = 0, prev = ''; for (const c of w.pic) { if (/\p{Extended_Pictographic}/u.test(c) && prev !== '‍') n2++; prev = c; }
    w.multi = n2 > 1;
  });
});
// what kind of word a topic holds: gap questions take their wrong answers from other kinds, so only one choice fits the sentence
const KIND = { family: 'people', jobs: 'people', body: 'body', clothes: 'clothes', food: 'food', fruit: 'food', kitchen: 'food', animals: 'animal', wild: 'animal', sea: 'animal',
  house: 'place', town: 'place', nature: 'place', school: 'school', colors: 'idea', verbs: 'verb', verbs2: 'verb', day: 'time', time: 'time', weather: 'weather',
  transport: 'move', sports: 'sport', feelings: 'adj', opposites: 'adj', describe: 'adj', health: 'health', tech: 'tech', shopping: 'shop', where: 'prep', manners: 'manners', special: 'special', class: 'phrase' };
// words that look alike in pictures or mean nearly the same: never wrong answers for each other
const SIMILAR = [
  ['book', 'notebook', 'library', 'lesson', 'page', 'paper'], ['pen', 'pencil', 'crayon', 'draw'], ['cup', 'glass', 'milk', 'coffee', 'tea', 'teapot', 'drink', 'juice'], ['shoes', 'sneakers', 'boots'],
  ['hat', 'cap'], ['glasses', 'sunglasses'], ['shirt', 't-shirt', 'clothes'], ['jacket', 'sweater', 'scarf'], ['cloud', 'cloudy', 'sky', 'weather'], ['sun', 'sunny', 'hot', 'summer', 'afternoon', 'day'],
  ['rain', 'rainy', 'umbrella', 'storm', 'wet'], ['wind', 'windy', 'sandstorm', 'storm', 'kite'], ['ship', 'boat'], ['car', 'taxi', 'police car', 'drive', 'driver'], ['bus', 'train', 'go to school'],
  ['truck', 'fire engine', 'ambulance', 'tractor'], ['doctor', 'nurse', 'dentist', 'vet'], ['shop', 'supermarket', 'market', 'mall', 'shopkeeper', 'basket'], ['hospital', 'pharmacy', 'medicine'],
  ['house', 'home', 'village', 'neighbor'], ['city', 'building', 'office'], ['road', 'street', 'bridge'], ['plate', 'bowl', 'dinner', 'eat', 'soup', 'pot'], ['sea', 'beach', 'island', 'summer'],
  ['tree', 'palm tree', 'forest', 'jungle', 'plant', 'leaf', 'grass'], ['flower', 'garden', 'spring', 'beautiful'], ['moon', 'night', 'star', 'Ramadan'], ['earth', 'world', 'planet', 'space', 'country'],
  ['phone', 'tablet', 'computer', 'screen', 'app'], ['camera', 'video', 'photo', 'photographer'], ['money', 'coin', 'wallet', 'card', 'pay', 'save', 'spend'], ['happy', 'smile', 'funny', 'laugh', 'friendly'],
  ['sad', 'cry', 'lonely', 'sorry'], ['sick', 'fever', 'cough', 'headache', 'sneeze'], ['soap', 'wash'], ['chicken', 'rooster'], ['bird', 'pigeon', 'parrot'], ['cow', 'sheep', 'goat'],
  ['bee', 'insect', 'butterfly', 'ladybug', 'beetle'], ['fish', 'shark', 'whale', 'dolphin'], ['crab', 'shrimp'], ['octopus', 'squid'], ['wolf', 'dog', 'fox'], ['frog', 'lizard'], ['eagle', 'falcon', 'owl', 'fly'],
  ['cake', 'cookie', 'sweets', 'chocolate'], ['bed', 'bedroom', 'go to bed', 'sleep', 'pajamas'], ['sofa', 'living room', 'rest'], ['door', 'open', 'close', 'room'], ['cat', 'pet'], ['mouse', 'rabbit'],
  ['tooth', 'toothbrush', 'brush', 'toothache', 'dentist'], ['hand', 'finger', 'thumb', 'arm'], ['foot', 'toe', 'leg'], ['face', 'head', 'hair'], ['mother', 'aunt', 'woman'], ['father', 'uncle', 'man'],
  ['boy', 'brother', 'son', 'child', 'cousin'], ['girl', 'sister', 'daughter'], ['family', 'parents', 'children', 'people', 'team'], ['clock', 'watch', 'time', 'hour', 'minute', "o'clock", 'half past', 'late', 'wake up'],
  ['week', 'month', 'calendar', 'weekend', 'year', 'today', 'tomorrow', 'yesterday'], ['football', 'kick', 'goal', 'sport', 'match', 'player'], ['win', 'race', 'first'], ['gift', 'give', 'generous', 'Eid', 'celebrate'],
  ['desert', 'sand', 'dry', 'camel', 'sandstorm'], ['sunset', 'evening'], ['sunrise', 'morning', 'early'], ['up', 'straight', 'above'], ['down', 'below', 'under'], ['in', 'inside'], ['on', 'above'], ['near', 'next to'],
  ['kind', 'friendly', 'polite', 'generous'], ['welcome', "you're welcome", 'greet', 'thank you'], ['scared', 'worried'], ['tired', 'bored', 'sleep'], ['help', 'hold', 'respect', 'promise'], ['big', 'tall', 'long'], ['small', 'short', 'young'],
];
const SIM = {}; SIMILAR.forEach((g, i) => g.forEach(k => { (SIM[k.toLowerCase()] = SIM[k.toLowerCase()] || []).push(i); }));
const similar = (a, b) => (SIM[a.k] || []).some(i => (SIM[b.k] || []).includes(i));
const lessonOf = w => TOPIC[w.t].lessons[w.li];

/* ---------- spaced review: boxes 1-6, each a longer wait ---------- */
const GAP = [0, 1, 2, 4, 7, 14, 30];
const sOf = w => ST.w[w.k];
const isLearned = w => !!(sOf(w) && sOf(w).b >= 1);
const isMastered = w => !!(sOf(w) && sOf(w).b >= 5);
const isHard = w => { const s = sOf(w); return !!(s && s.x >= 2 && s.b <= 3); };
function wstate(w) { return ST.w[w.k] || (ST.w[w.k] = { b: 0, d: 0, r: 0, x: 0 }); }
function introduce(w) { const s = wstate(w); if (s.b < 1) { s.b = 1; s.d = DAY() + 1; today().n++; } }
function markKnown(w) { const s = wstate(w); if (s.b < 3) { s.b = 3; s.d = DAY() + GAP[3]; s.k = 1; } }
function grade(w, ok) { const s = wstate(w); if (s.b < 1) return; if (ok) { s.r++; s.b = Math.min(6, s.b + 1); } else { s.x++; s.b = 1; } s.d = DAY() + GAP[s.b]; s.l = DAY(); }
const nLearned = () => WORDS.filter(isLearned).length;
const nMastered = () => WORDS.filter(isMastered).length;
const dueWords = () => WORDS.filter(w => { const s = sOf(w); return s && s.b >= 1 && s.d <= DAY(); }).sort((a, b) => sOf(a).d - sOf(b).d || sOf(a).b - sOf(b).b);
function nextLesson() {
  for (const t of TOPICS) for (let j = 0; j < t.lessons.length; j++) if (t.lessons[j].some(w => !isLearned(w))) return { t: t.id, i: j };
  return null;
}
const lessonsToday = () => today().l;
const topicLearned = t => t.words.filter(isLearned).length;

/* ---------- screens ---------- */
const SCREENS = {}; let cur = null, stack = [], leaving = [];
function def(name, fn) { SCREENS[name] = fn; }
function onLeave(f) { leaving.push(f); }
function clean() { VO.stop(); const l = leaving; leaving = []; l.forEach(f => { try { f(); } catch (e) {} }); document.querySelectorAll('.sheet').forEach(s => s.remove()); }
function render() { app.innerHTML = ''; document.body.dataset.screen = cur.name; window.scrollTo(0, 0); SCREENS[cur.name](cur.arg); }
function go(name, arg, push = true) { clean(); if (push && cur) stack.push(cur); cur = { name, arg }; render(); }
function back() { clean(); cur = stack.pop() || { name: 'home' }; render(); }
function home() { clean(); stack = []; cur = { name: 'home' }; render(); }
const $ = s => app.querySelector(s), $$ = s => Array.from(app.querySelectorAll(s));
function on(sel, fn) { $$(sel).forEach(el => el.addEventListener('click', e => { sfx('tap'); fn(el, e); })); }
function bar(title, o = {}) {
  return `<header class="bar">${o.noBack ? '' : `<button class="ib" id="bk" aria-label="رجوع">→</button>`}<h1>${title}</h1>${o.right || ''}${o.fe !== false ? `<span class="chip" id="fechip">🪶 <b>${num(ST.fe)}</b></span>` : ''}</header>`;
}
function bindBar() { const b = app.querySelector('#bk'); if (b) b.onclick = () => { sfx('tap'); back(); }; }
function toast(h, ms = 2600) { const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = h; document.getElementById('toasts').appendChild(t); setTimeout(() => t.remove(), ms); }
const starsHTML = (n, max = 3) => `<span class="stars">${Array.from({ length: max }, (_, i) => i < n ? '★' : '<span class="off">★</span>').join('')}</span>`;
function addFeathers(n, from) {
  if (!n) return; ST.fe += n; save();
  const chip = document.querySelector('.fe, #fechip');
  if (from && chip && !REDUCED) {
    const a = from.getBoundingClientRect(), b = chip.getBoundingClientRect(), f = document.createElement('span');
    f.className = 'flyfe'; f.textContent = '🪶'; f.style.left = (a.left + a.width / 2 - 13) + 'px'; f.style.top = (a.top + a.height / 2 - 13) + 'px';
    f.style.setProperty('--dx', (b.left - a.left - a.width / 2 + 10) + 'px'); f.style.setProperty('--dy', (b.top - a.top - a.height / 2) + 'px');
    document.body.appendChild(f); setTimeout(() => f.remove(), 850);
  }
  setTimeout(() => { document.querySelectorAll('.fe, #fechip b').forEach(el => { el.textContent = el.classList.contains('fe') ? '🪶 ' + num(ST.fe) : num(ST.fe); }); }, 600);
}
function markWord(sentence, word) {
  const re = new RegExp('(^|[^A-Za-z])(' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?=[^A-Za-z]|$)', 'i');
  const m = re.exec(sentence);
  if (!m) return esc(sentence);
  const at = m.index + m[1].length;
  return esc(sentence.slice(0, at)) + `<span class="mark">${esc(sentence.slice(at, at + m[2].length))}</span>` + esc(sentence.slice(at + m[2].length));
}
const pic = (w, cls = '') => picHTML(w.pic, (w.multi ? 'multi ' : '') + cls);
const falcon = (o = {}) => falconSVG(Object.assign({ rank: rankOf(nLearned()), wear: ST.wear }, o));

/* sheets: an in-page dialog (the play link cannot show confirm()) */
function sheet(html, bindFn) {
  const s = document.createElement('div'); s.className = 'sheet'; s.innerHTML = `<div class="in" role="dialog" aria-modal="true">${html}</div>`;
  s.addEventListener('click', e => { if (e.target === s) s.remove(); });
  document.body.appendChild(s); if (bindFn) bindFn(s); return s;
}
function confirmSheet(text, yes, no = 'لا', fn) {
  sheet(`<div class="stack center"><div class="talkf"><div class="fmid">${falcon({ mood: 'wow' })}</div></div><p style="font-size:20px;font-weight:800;margin:0">${text}</p>
    <div class="row"><button class="btn soft" data-no>${no}</button><button class="btn" data-yes>${yes}</button></div></div>`, s => {
    s.querySelector('[data-no]').onclick = () => { sfx('tap'); s.remove(); };
    s.querySelector('[data-yes]').onclick = () => { sfx('tap'); s.remove(); fn(); };
  });
}
/* the card of one word: picture, word, meaning, sentence and its sounds */
function wordSheet(w) {
  const s = sOf(w), lv = !s || s.b < 1 ? 'لم تتعلمها بعد' : s.b >= 5 ? 'أتقنتها 💎' : s.b >= 3 ? 'قوية في ذاكرتك 💪' : 'تتعلمها الآن 🌱';
  const nextRev = s && s.b >= 1 ? (s.d <= DAY() ? 'موعد مراجعتها اليوم' : `مراجعتها بعد ${num(s.d - DAY())} ${s.d - DAY() === 1 ? 'يوم' : s.d - DAY() === 2 ? 'يومين' : 'أيام'}`) : '';
  sheet(`<div class="meet">${pic(w)}<div class="word en${w.en.length > 14 ? ' long' : ''}" style="${w.en.length > 14 ? 'font-size:28px' : ''}">${esc(w.en)}</div><div class="mean">${esc(w.ar)}</div>
      <div class="tools"><button class="tbtn" data-a="w">🔊 الكلمة</button>${w.ex ? '<button class="tbtn" data-a="s">🔊 الجملة</button><button class="tbtn" data-a="z">🐢 ببطء</button>' : ''}</div>
      ${w.ex ? `<div class="ex en">${markWord(w.ex, w.en)}</div><div class="exar">${esc(w.exAr)}</div>` : `<div class="sit">🗣️ ${esc(w.exAr)}</div>`}
      <div class="muted small">${lv}${nextRev ? ' · ' + nextRev : ''}</div></div>
      <button class="btn soft" data-close>إغلاق</button>`, el => {
    el.querySelector('[data-a="w"]').onclick = () => VO.say(w.en);
    const sb = el.querySelector('[data-a="s"]'); if (sb) sb.onclick = () => VO.say(w.ex);
    const zb = el.querySelector('[data-a="z"]'); if (zb) zb.onclick = () => VO.say({ z: w.ex });
    el.querySelector('.meet .pic').onclick = () => VO.say(w.en);
    el.querySelector('[data-close]').onclick = () => { VO.stop(); el.remove(); };
  });
  VO.say([w.en, 400, ...(w.ex ? [w.ex] : [])]);
}

/* ---------- start ---------- */
def('splash', () => {
  app.innerHTML = `<div class="splash"><div class="fbig bob">${falcon({ mood: 'happy', pose: 'cheer' })}</div>
    <h1>صقر الكلمات</h1><div class="enname en">WORD FALCON</div>
    <p class="tag">كلمات إنجليزية جديدة كل يوم: صور، وصوت، وألعاب، ومراجعة ذكية لا تنسى معها شيئًا.</p>
    <button class="btn" id="go">▶︎ ابدأ</button></div>`;
  $('#go').onclick = () => { VO.start(); FX.init(); sfx('tap'); ST.hello ? home() : go('intro', 0, false); };
});
def('intro', step => {
  const lines = ['hello-1', 'hello-2', 'hello-3'];
  app.innerHTML = `<div class="splash"><div class="bubble">${esc(AR_PLAIN(lines[step]))}</div><div class="fbig">${falcon({ mood: step === 2 ? 'happy' : 'idle', pose: step === 2 ? 'cheer' : 'idle' })}</div>
    <button class="btn" id="nx">${step < 2 ? 'التالي ◀︎' : 'هيا بنا!'}</button></div>`;
  VO.say({ a: lines[step] });
  $('#nx').onclick = () => { sfx('tap'); if (step < 2) { cur.arg = step + 1; render(); } else { ST.hello = true; save(); ST.placed ? home() : go('placeAsk', null, false); } };
});
function AR_PLAIN(id) { return (AR[id] || '').replace(/[ً-ْٰ]/g, ''); }
def('placeAsk', () => {
  app.innerHTML = `<div class="splash"><div class="bubble">هل تريد اختبارًا سريعًا (٣ دقائق) لنعرف الكلمات التي تعرفها؟ ما تعرفه لن نعلّمك إياه من جديد.</div>
    <div class="fbig" style="width:180px">${falcon({ mood: 'wow' })}</div>
    <button class="btn green" id="yes">نعم، هيا!</button><button class="btn soft" id="no" style="max-width:320px">لاحقًا</button></div>`;
  VO.say({ a: 'placement-ask' });
  $('#yes').onclick = () => { sfx('tap'); go('placement', null, false); };
  $('#no').onclick = () => { sfx('tap'); ST.placed = 'later'; save(); home(); };
});

/* ---------- home ---------- */
def('home', () => {
  const nl = nLearned(), r = rankOf(nl), nx = RANKS[r + 1], due = dueWords().length, L = nextLesson(), tdy = today(), goal = ST.set.goal;
  const pct = Math.min(100, Math.round(tdy.l / goal * 100)), st = streakNow();
  const prog = nx ? Math.round((nl - RANKS[r].at) / (nx.at - RANKS[r].at) * 100) : 100;
  const T = L && TOPIC[L.t];
  app.innerHTML = bar('صقر الكلمات', { noBack: true, right: `<span class="chip" title="أيام متتالية">🔥 <b>${num(st)}</b></span><button class="ib" id="par" aria-label="ركن الوالدين">⚙️</button>` }) + `
    <section class="hero"><div class="scene">${sceneSVG(ST.bg)}</div><div class="in">
      <div class="fhome bob" id="fh">${falcon({ mood: 'happy' })}</div>
      <div class="rk"><b class="rn">${RANKS[r].ar}</b><span class="en">${RANKS[r].en}</span>
        <div class="pbar"><i style="width:${prog}%"></i></div>
        <span class="small muted">${nx ? `كلماتك <b class="num">${num(nl)}</b> · بقي ${num(nx.at - nl)} لتصبح «${nx.ar}»` : `كلماتك <b class="num">${num(nl)}</b> · أعلى رتبة!`}</span></div></div></section>
    <div class="card today" style="margin-top:14px"><div class="ring" style="--p:${pct}"><span>${num(Math.min(tdy.l, goal))}/${num(goal)}</span></div>
      <div class="t"><b>${tdy.l >= goal ? 'حققت هدف اليوم! 🎉' : 'هدف اليوم: ' + (goal === 1 ? 'درس واحد' : goal === 2 ? 'درسان' : num(goal) + ' دروس')}</b>
      <span class="small muted">تعلمت اليوم ${num(tdy.n)} كلمة · راجعت ${num(tdy.r)}</span></div></div>
    <div class="stack" style="margin-top:14px">
      ${L ? `<button class="big main" id="lesson"><span class="ico" style="background:${T.color}33">${T.icon}</span><span class="tx"><b>الدرس التالي</b><small>${esc(T.ar)} · الدرس ${num(L.i + 1)} من ${num(T.lessons.length)}</small>
        <span class="prevw">${T.lessons[L.i].slice(0, 7).map(w => pic(w)).join('')}</span></span><span class="go">◀</span></button>`
           : `<div class="card center"><b>أنهيت كل الدروس! 👑</b><div class="muted small">واصل المراجعة والألعاب لتبقى الكلمات في ذاكرتك.</div></div>`}
      <button class="big" id="review"><span class="ico" style="background:#dbeafe">🔁</span><span class="tx"><b>المراجعة الذكية</b><small>${due ? 'كلمات حان وقت مراجعتها حتى لا تنساها' : 'لا مراجعة الآن. تعود الكلمات في وقتها.'}</small></span>${due ? `<span class="badge">${num(due)}</span>` : '<span class="go">✓</span>'}</button>
    </div>
    <div class="minis" style="margin-top:14px">
      <button class="mini" data-go="map"><span>🗺️</span>المواضيع</button>
      <button class="mini" data-go="games"><span>🎮</span>الألعاب</button>
      <button class="mini" data-go="talkList"><span>🎤</span>تحدّث</button>
      <button class="mini" data-go="book"><span>📖</span>قاموسي</button>
      <button class="mini" data-go="badges"><span>🏅</span>أوسمتي</button>
      <button class="mini" data-go="shop"><span>🪺</span>عش شاهين</button>
    </div>`;
  $('#fh').onclick = () => { const f = $('#fh'); f.classList.remove('bob', 'hop'); void f.offsetWidth; f.classList.add('hop'); VO.say({ a: pick(['home-1', 'home-2']) }); };
  if (L) on('#lesson', () => go('lesson', L));
  on('#review', () => startReview());
  on('[data-go]', el => go(el.dataset.go));
  on('#par', () => go('gate'));
  on('#fechip', () => go('shop'));
  if (!ST.placed && nl === 0) setTimeout(() => { if (cur.name === 'home') go('placeAsk'); }, 400);
  if (pendingRank >= 0) { const pr = pendingRank; pendingRank = -1; setTimeout(() => rankSheet(pr), 500); }
});

/* ---------- topics ---------- */
const STAGES = [['الأساس', 'كلمات يحتاجها كل طالب'], ['كلمات المستوى الرابع', 'للمحادثة في الحصة'], ['انطلق أبعد', 'كلمات وجمل أكثر']];
def('map', () => {
  const L = nextLesson();
  app.innerHTML = bar('المواضيع') + STAGES.map(([n, sub], s) => {
    const ts = TOPICS.filter(t => t.stage === s + 1), tot = ts.reduce((a, t) => a + t.words.length, 0), got = ts.reduce((a, t) => a + topicLearned(t), 0);
    return `<div class="stagehd"><span class="st">${num(s + 1)}</span><div><b>${n}</b><small>${sub} · ${num(got)} من ${num(tot)} كلمة</small></div></div>
      <div class="topics">${ts.map(t => { const g = topicLearned(t), all = g === t.words.length;
        return `<button class="tcard${L && L.t === t.id ? ' next' : ''}" data-t="${t.id}"><span class="ti" style="background:${t.color}2e">${t.icon}</span>
          <b>${esc(t.ar)}</b><span class="en">${esc(t.en)}</span><span class="pbar${all ? ' green' : ''}"><i style="width:${Math.round(g / t.words.length * 100)}%"></i></span>
          <span class="cnt">${num(g)}/${num(t.words.length)}</span>${all ? '<span class="done">✅</span>' : ''}</button>`; }).join('')}</div>`;
  }).join('');
  bindBar(); VO.say({ a: 'map' });
  on('.tcard', el => go('topic', el.dataset.t));
});
def('topic', id => {
  const t = TOPIC[id], g = topicLearned(t), left = t.words.filter(w => !isLearned(w)).length;
  const nx = t.lessons.findIndex(L => L.some(w => !isLearned(w)));
  app.innerHTML = bar(esc(t.ar)) + `<div class="card thead"><span class="ti" style="background:${t.color}2e">${t.icon}</span><div style="flex:1;min-width:0"><b>${esc(t.ar)}</b><span class="en muted">${esc(t.en)}</span>
      <div class="pbar" style="margin-top:8px"><i style="width:${Math.round(g / t.words.length * 100)}%"></i></div><span class="small muted">${num(g)} من ${num(t.words.length)} ${isPhrase(t.words[0]) ? 'جملة' : 'كلمة'}</span></div></div>
    <div class="stack" style="margin-top:12px">
      ${nx >= 0 ? `<button class="btn" id="go">▶︎ الدرس ${num(nx + 1)}</button>` : ''}
      <div class="row">${left >= 4 ? `<button class="btn soft small" id="chk">🧪 اختبر نفسك</button>` : ''}<button class="btn soft small" id="tk">🎤 تحدث عن الموضوع</button></div>
    </div>
    <div class="sec">الدروس</div>
    <div class="lessons">${t.lessons.map((L, j) => { const done = L.every(isLearned), stars = ST.ls[t.id + ':' + j] || 0;
      return `<button class="lcard" data-l="${j}"><span class="ln" style="background:${t.color}">${num(j + 1)}</span><span class="lx"><b>الدرس ${num(j + 1)}${done ? ' ✓' : ''}</b><span class="prevw">${L.map(w => pic(w)).join('')}</span></span>${starsHTML(stars)}</button>`; }).join('')}</div>
    <div class="sec">كل الكلمات <small>اضغط على أي كلمة لتسمعها</small></div>
    <div class="wgrid">${t.words.map(w => tileHTML(w)).join('')}</div>`;
  bindBar(); VO.say({ a: 't-' + t.id });
  if (nx >= 0) on('#go', () => go('lesson', { t: id, i: nx }));
  on('#chk', () => go('check', id));
  on('#tk', () => go('talk', id));
  on('.lcard', el => go('lesson', { t: id, i: +el.dataset.l }));
  bindTiles();
});
function tileHTML(w) {
  const s = sOf(w), b = s ? s.b : 0;
  return `<button class="wtile${b < 1 ? ' new' : ''}" data-k="${esc(w.k)}">${pic(w)}<span class="en">${esc(w.en)}</span><span class="ar">${esc(w.ar)}</span>
    <span class="lv">${[1, 2, 3, 4, 5].map(i => `<i class="${b >= i ? 'on' : ''}"></i>`).join('')}</span></button>`;
}
function bindTiles() { on('.wtile', el => wordSheet(BYK[el.dataset.k])); }

/* ---------- a lesson: meet the words, practice, result ---------- */
def('lesson', ({ t, i }) => {
  const T = TOPIC[t], L = T.lessons[i];
  VO.pre([...L.map(w => w.en), ...L.filter(w => w.ex).map(w => w.ex)]);
  let k = 0;
  const show = () => {
    const w = L[k], long = w.en.length > 14;
    app.innerHTML = bar(`${esc(T.ar)} · الدرس ${num(i + 1)}`) + `<div class="dots">${L.map((_, j) => `<i class="${j < k ? 'done' : j === k ? 'on' : ''}"></i>`).join('')}</div>
      <div class="card meet">${pic(w)}<div class="word en" style="${long ? 'font-size:30px' : ''}">${esc(w.en)}</div><div class="mean">${esc(w.ar)}</div>
        <div class="tools"><button class="tbtn" data-a="w">🔊 ${isPhrase(w) ? 'الجملة' : 'الكلمة'}</button>${w.ex ? '<button class="tbtn" data-a="s">🔊 المثال</button>' : ''}<button class="tbtn" data-a="z">🐢 ببطء</button>${canMic() ? '<button class="tbtn" data-a="m">🎤 قلها</button>' : ''}</div>
        ${w.ex ? `<div class="ex en">${markWord(w.ex, w.en)}</div>${ST.set.arHide ? '<button class="tbtn" data-a="tr">👁 الترجمة</button><div class="exar" hidden>' + esc(w.exAr) + '</div>' : `<div class="exar">${esc(w.exAr)}</div>`}`
               : `<div class="sit">🗣️ متى أقولها؟ ${esc(w.exAr)}</div>`}
        <div class="heard" id="heard"></div></div>
      <div class="row qfoot">${k > 0 ? '<button class="btn soft" id="pv">→ السابق</button>' : ''}<button class="btn" id="nx">${k < L.length - 1 ? 'التالي ◀︎' : 'هيا نتدرب! ◀︎'}</button></div>`;
    bindBar();
    const sayAll = () => VO.say([w.en, 500, ...(w.ex ? [w.ex] : [])]);
    VO.say([...(k === 0 && Object.keys(ST.ls).length < 2 ? [{ a: 'meet' }, 300] : []), w.en, 500, ...(w.ex ? [w.ex] : [])]);
    on('[data-a="w"]', () => VO.say(w.en));
    on('[data-a="s"]', () => VO.say(w.ex));
    on('[data-a="z"]', () => VO.say({ z: w.ex || w.en }));
    on('[data-a="tr"]', el => { el.hidden = true; el.nextElementSibling.hidden = false; });
    on('[data-a="m"]', el => sayIt(w, el, $('#heard')));
    $('.meet .pic').onclick = () => VO.say(w.en);
    $('.meet .word').onclick = sayAll;
    on('#pv', () => { k--; show(); });
    on('#nx', () => { if (k < L.length - 1) { k++; show(); } else practice(); });
  };
  const practice = () => runSession({ title: T.ar, items: lessonItems(L), mode: 'lesson', requeue: true,
    onAnswer: (q, ok) => { if (!ok && !q.retry) wstate(q.w).x++; },
    onEnd: S => lessonDone(T, i, L, S) });
  show();
});
async function sayIt(w, btn, out) {
  VO.stop(); btn.classList.add('on'); out.textContent = '… أستمع';
  const r = await listen();
  btn.classList.remove('on');
  if (r.err) { out.textContent = r.msg; return; }
  const ok = heardIt(r.alts, w.en);
  out.innerHTML = r.alts.length ? `<span class="en">${esc(r.alts[0])}</span> ${ok ? '✅' : '🔁'}` : 'لم أسمع شيئًا، حاول مرة أخرى.';
  if (ok) { sfx('ok'); VO.say(praise()); } else if (r.alts.length) VO.say([{ a: 'again' }, 200, w.en]);
}
function lessonDone(T, i, L, S) {
  const first = S.res.filter(r => !r.retry), wrong = first.filter(r => !r.ok).length;
  const stars = wrong <= 1 ? 3 : wrong <= 4 ? 2 : 1, key = T.id + ':' + i;
  const fresh = L.filter(w => !isLearned(w));
  L.forEach(introduce);
  ST.ls[key] = Math.max(ST.ls[key] || 0, stars);
  today().l++; if (!wrong) ST.perfect++;
  const fe = 5 + stars * 2; ST.fe += fe; save();
  const streakUp = touchStreak();
  app.innerHTML = `<div class="result"><div class="fres hop">${falcon({ mood: 'happy', pose: 'cheer' })}</div><h2>أنهيت الدرس!</h2>
    <div class="bigstars">${Array.from({ length: 3 }, (_, j) => j < stars ? '★' : '<span class="off">★</span>').join('')}</div>
    <div class="gain"><span>🪶 +${num(fe + first.filter(r => r.ok).length)}</span><span>${fresh.length ? `📖 ${num(fresh.length)} كلمات جديدة` : '🔁 درس مراجعة'}</span>${streakUp ? `<span>🔥 ${num(streakNow())}</span>` : ''}</div>
    <div class="wlist">${L.map(w => `<span>${pic(w)}${esc(w.en)}</span>`).join('')}</div>
    <p class="muted small" style="margin:0">ستعود هذه الكلمات غدًا في المراجعة الذكية حتى لا تنساها.</p>
    <div class="stack" style="width:100%">${nextLesson() ? '<button class="btn" id="nxl">الدرس التالي ◀︎</button>' : ''}<button class="btn soft" id="hm">🏠 الرئيسية</button></div></div>`;
  FX.confetti(); sfx('win');
  const lines = [{ a: 'lesson-done' }]; if (streakUp && streakNow() > 1) lines.push(300, { a: 'streak' });
  celebrate(lines);
  on('#nxl', () => { const n = nextLesson(); if (n) { stack = [{ name: 'home' }]; clean(); cur = { name: 'lesson', arg: n }; render(); } });
  on('#hm', home);
}
/* after a lesson or review: rank, badges, today's goal. A new rank shows on the result screen, or on the home screen if he left it first. */
let pendingRank = -1;
function celebrate(lines) {
  const r = rankOf(nLearned());
  if (r > ST.rank) { ST.rank = r; pendingRank = r; lines.push(400, { a: 'rank-' + (r + 1) }); const here = cur; setTimeout(() => { if (cur === here && pendingRank === r) { pendingRank = -1; rankSheet(r); } }, 1600); }
  const got = newBadges();
  if (got.length) { lines.push(300, { a: 'badge' }); got.forEach((b, j) => setTimeout(() => toast(`${b[1]} وسام جديد: ${b[2]}`), 900 + j * 900)); }
  if (today().l >= ST.set.goal && ST.goalDay !== DAY()) { ST.goalDay = DAY(); lines.push(300, { a: 'goal' }); setTimeout(() => toast('🎯 حققت هدف اليوم!'), 2200); }
  save(); VO.say(lines);
}
function rankSheet(r) {
  sheet(`<div class="result"><div class="fres hop">${falcon({ rank: r, mood: 'happy', pose: 'cheer' })}</div><h2>رتبة جديدة!</h2>
    <p style="font-size:24px;font-weight:800;margin:0">${RANKS[r].ar}</p><p class="en muted" style="margin:0">${RANKS[r].en}</p><button class="btn" data-close>رائع!</button></div>`,
    el => { el.querySelector('[data-close]').onclick = () => el.remove(); });
  FX.confetti();
}

/* ---------- smart review ---------- */
function reviewType(w) {
  const b = sOf(w).b;
  if (isPhrase(w)) return b <= 1 ? 'wa' : b === 2 ? 'aw' : b === 3 ? 'sit' : 'ord';
  if (b <= 1) return !weak(w) ? 'lp' : 'wa';
  if (b === 2) return !weak(w) ? pick(['pw', 'wp']) : 'aw';
  if (b === 3) return w.ex ? 'gap' : 'aw';
  return spellable(w) ? 'sp' : w.ex ? 'gap' : 'aw';
}
function startReview() {
  const due = dueWords().slice(0, ST.set.rev);
  if (!due.length) { VO.say({ a: 'review-none' }); toast('لا مراجعة الآن ✓ تعود الكلمات في وقتها.'); return; }
  go('review', due);
}
def('review', due => {
  const ups = [], downs = [];
  const run = () => runSession({ title: 'المراجعة الذكية', items: mix(due).map(w => ({ w, type: reviewType(w) })), mode: 'review', requeue: true,
    onAnswer: (q, ok) => { if (q.retry) return; const before = sOf(q.w).b; grade(q.w, ok); today().r++; ST.revN++; (ok ? ups : downs).push([q.w, before]); save(); },
    onEnd: S => {
      const ok = S.res.filter(r => !r.retry && r.ok).length, n = S.res.filter(r => !r.retry).length, mastered = ups.filter(([w, b]) => b === 4).map(([w]) => w);
      touchStreak();
      app.innerHTML = `<div class="result"><div class="fres hop">${falcon({ mood: 'happy', pose: 'cheer' })}</div><h2>مراجعة رائعة!</h2>
        <div class="gain"><span>✅ ${num(ok)} من ${num(n)}</span><span>🪶 +${num(ok)}</span></div>
        ${mastered.length ? `<p style="margin:0;font-weight:800">💎 أتقنت: </p><div class="wlist">${mastered.map(w => `<span>${pic(w)}${esc(w.en)}</span>`).join('')}</div>` : ''}
        ${downs.length ? `<p style="margin:0" class="muted">هذه الكلمات ستعود قريبًا لتتدرب عليها أكثر:</p><div class="wlist">${downs.map(([w]) => `<span>${pic(w)}${esc(w.en)}</span>`).join('')}</div>` : ''}
        <div class="stack" style="width:100%">${dueWords().length ? '<button class="btn blue" id="more">🔁 مراجعة كلمات أخرى</button>' : ''}<button class="btn soft" id="hm">🏠 الرئيسية</button></div></div>`;
      FX.confetti(); sfx('win');
      celebrate([{ a: mastered.length ? 'mastered' : 'review-done' }]);
      on('#more', () => { const d = dueWords().slice(0, ST.set.rev); clean(); cur = { name: 'review', arg: d }; render(); });
      on('#hm', home);
    } });
  app.innerHTML = `<div class="splash"><div class="fbig" style="width:180px">${falcon({ mood: 'idle' })}</div><div class="bubble">حان وقت مراجعة ${num(due.length)} ${due.length > 10 ? 'كلمة' : 'كلمات'}. المراجعة في وقتها تجعل الكلمة لا تُنسى!</div>
    <div class="wlist">${due.slice(0, 15).map(w => `<span>${pic(w)}</span>`).join('')}</div><button class="btn blue" id="st">هيا نراجع ◀︎</button><button class="btn soft" id="bk2" style="max-width:320px">رجوع</button></div>`;
  VO.say({ a: 'review-start' }); VO.pre(due.map(w => w.en));
  on('#st', run); on('#bk2', back);
});

/* ---------- placement test and topic check: what he already knows is not taught again ---------- */
def('placement', () => {
  const picks = [];
  TOPICS.filter(t => t.stage <= 3 && t.id !== 'class').forEach(t => {
    const strong = mix(t.words.filter(w => !weak(w)));
    const n = t.stage === 1 ? 2 : t.stage === 2 ? 1 : (strong.length ? 1 : 0);
    picks.push(...strong.slice(0, n));
  });
  const items = picks.slice(0, 32).map(w => ({ w, type: 'lp' }));
  let knew = 0;
  app.innerHTML = `<div class="splash"><div class="fbig" style="width:170px">${falcon({ mood: 'wow' })}</div><div class="bubble">اسمع الكلمة واختر صورتها. لا بأس إذا لم تعرفها: اضغط «لا أعرف».</div><button class="btn green" id="st">ابدأ الاختبار ◀︎</button></div>`;
  VO.say({ a: 'placement-go' });
  on('#st', () => runSession({ title: 'اختبار تحديد المستوى', items, mode: 'place', quick: true, dunno: true,
    onAnswer: (q, ok) => { if (ok) { markKnown(q.w); knew++; } save(); },
    onEnd: () => {
      ST.placed = true; save();
      const L = nextLesson(), T = L && TOPIC[L.t];
      app.innerHTML = `<div class="result"><div class="fres hop">${falcon({ mood: 'happy', pose: 'cheer' })}</div><h2>عرفت ${num(knew)} كلمة من ${num(items.length)}</h2>
        <p style="margin:0">أحسنت! الكلمات التي عرفتها لن تتعلمها من جديد، بل ستراجعها فقط.</p>
        ${T ? `<div class="card" style="width:100%"><b>سنبدأ من:</b> ${T.icon} ${esc(T.ar)} · الدرس ${num(L.i + 1)}</div>` : ''}
        <button class="btn" id="hm">هيا نبدأ ◀︎</button></div>`;
      FX.confetti(); celebrate([{ a: 'placement-done' }]);
      on('#hm', home);
    } }));
});
def('check', id => {
  const t = TOPIC[id], words = mix(t.words.filter(w => !isLearned(w))).slice(0, 10);
  let knew = [];
  app.innerHTML = `<div class="splash"><div class="fbig" style="width:170px">${falcon({ mood: 'wow' })}</div><div class="bubble">لنختبر ما تعرفه من كلمات «${esc(t.ar)}». ما تعرفه سنضعه في قاموسك مباشرة.</div><button class="btn green" id="st">ابدأ ◀︎</button><button class="btn soft" id="bk2" style="max-width:320px">رجوع</button></div>`;
  VO.say({ a: 'check-topic' });
  on('#bk2', back);
  on('#st', () => runSession({ title: 'اختبر نفسك', items: words.map(w => ({ w, type: isPhrase(w) || weak(w) ? 'wa' : 'lp' })), mode: 'check', quick: true, dunno: true,
    onAnswer: (q, ok) => { if (ok) { markKnown(q.w); knew.push(q.w); } save(); },
    onEnd: () => {
      app.innerHTML = `<div class="result"><div class="fres hop">${falcon({ mood: knew.length ? 'happy' : 'idle', pose: knew.length ? 'cheer' : 'idle' })}</div><h2>عرفت ${num(knew.length)} من ${num(words.length)}</h2>
        ${knew.length ? `<div class="wlist">${knew.map(w => `<span>${pic(w)}${esc(w.en)}</span>`).join('')}</div><p class="muted" style="margin:0">أضيفت إلى قاموسك، وستراجعها فقط.</p>` : '<p style="margin:0">لا بأس! ستتعلمها كلها في الدروس.</p>'}
        <button class="btn" id="ok">متابعة ◀︎</button></div>`;
      if (knew.length) FX.confetti();
      celebrate(knew.length ? [{ a: 'check-done' }] : []);
      on('#ok', () => { clean(); cur = stack.pop() || { name: 'home' }; render(); });
    } }));
});

/* ---------- my word book ---------- */
def('book', tab => {
  tab = tab || (nLearned() ? 'mine' : 'all');
  const counts = { mine: nLearned(), hard: WORDS.filter(isHard).length, all: WORDS.length };
  app.innerHTML = bar('قاموسي') + `<div class="tabs"><button data-t="mine" class="${tab === 'mine' ? 'on' : ''}">كلماتي ${num(counts.mine)}</button><button data-t="hard" class="${tab === 'hard' ? 'on' : ''}">الصعبة ${num(counts.hard)}</button><button data-t="all" class="${tab === 'all' ? 'on' : ''}">كل الكلمات</button></div>
    <input class="search" id="q" type="search" placeholder="ابحث بالعربية أو بالإنجليزية…" autocomplete="off"><div id="list"></div>`;
  bindBar(); VO.say({ a: 'book' });
  const draw = () => {
    const q = $('#q').value.trim().toLowerCase();
    const keep = w => (tab === 'all' || (tab === 'mine' ? isLearned(w) : isHard(w))) && (!q || w.k.includes(q) || w.ar.includes(q));
    const html = TOPICS.map(t => { const ws = t.words.filter(keep); return ws.length ? `<div class="sec">${t.icon} ${esc(t.ar)} <small>${num(ws.length)}</small></div><div class="wgrid">${ws.map(tileHTML).join('')}</div>` : ''; }).join('');
    $('#list').innerHTML = html || `<div class="card center muted" style="margin-top:12px">${tab === 'hard' ? 'لا توجد كلمات صعبة الآن 👏' : tab === 'mine' ? 'لم تتعلم كلمات بعد. ابدأ أول درس!' : 'لا توجد نتائج.'}</div>`;
    bindTiles();
  };
  $('#q').addEventListener('input', draw);
  on('.tabs button', el => { cur.arg = el.dataset.t; render(); });
  draw();
});

/* ---------- Shaheen's nest: things to wear, places to live ---------- */
const SHOP = [
  { id: 'shades', slot: 'eyes', ar: 'نظارة شمسية', price: 30, ico: '🕶️' }, { id: 'cap', slot: 'head', ar: 'كاب أزرق', price: 40, ico: '🧢' },
  { id: 'scarf', slot: 'neck', ar: 'وشاح أخضر', price: 50, ico: '🧣' }, { id: 'headset', slot: 'head', ar: 'سماعات الحصة', price: 70, ico: '🎧' },
  { id: 'bag', slot: 'back', ar: 'حقيبة ظهر', price: 80, ico: '🎒' }, { id: 'medal', slot: 'neck', ar: 'ميدالية ذهبية', price: 120, ico: '🏅' },
  { id: 'grad', slot: 'head', ar: 'قبعة التخرج', price: 160, ico: '🎓' }, { id: 'crown', slot: 'head', ar: 'تاج', price: 250, ico: '👑' },
];
const BGS = [{ id: 'desert', ar: 'الصحراء', price: 0, ico: '🏜️' }, { id: 'sea', ar: 'البحر', price: 60, ico: '🌊' }, { id: 'mountain', ar: 'الجبال', price: 90, ico: '⛰️' },
  { id: 'city', ar: 'المدينة', price: 120, ico: '🏙️' }, { id: 'night', ar: 'ليلة النجوم', price: 150, ico: '🌙' }];
def('shop', () => {
  app.innerHTML = bar('عش شاهين') + `<section class="hero"><div class="scene">${sceneSVG(ST.bg)}</div><div class="in" style="justify-content:center"><div class="fhome bob" style="width:170px;height:170px">${falcon({ mood: 'happy' })}</div></div></section>
    <p class="muted center small">اجمع الريش 🪶 من الدروس والمراجعة والألعاب، واشترِ لشاهين أشياء جميلة.</p>
    <div class="sec">يلبس</div><div class="shopgrid">${SHOP.map(it => { const own = ST.own[it.id], wearing = ST.wear[it.slot] === it.id;
      return `<button class="item${wearing ? ' on' : ''}${!own && ST.fe < it.price ? ' lock' : ''}" data-i="${it.id}"><span>${it.ico}</span><b>${it.ar}</b><small>${own ? (wearing ? 'يلبسه الآن ✓' : 'لك ✓') : '🪶 ' + num(it.price)}</small></button>`; }).join('')}</div>
    <div class="sec">يعيش في</div><div class="shopgrid">${BGS.map(it => { const own = it.price === 0 || ST.own['bg-' + it.id], here = ST.bg === it.id;
      return `<button class="item${here ? ' on' : ''}${!own && ST.fe < it.price ? ' lock' : ''}" data-b="${it.id}"><span>${it.ico}</span><b>${it.ar}</b><small>${own ? (here ? 'هنا الآن ✓' : 'لك ✓') : '🪶 ' + num(it.price)}</small></button>`; }).join('')}</div>`;
  bindBar(); VO.say({ a: 'shop' });
  on('[data-i]', el => { const it = SHOP.find(x => x.id === el.dataset.i);
    if (!ST.own[it.id]) { if (ST.fe < it.price) { toast(`تحتاج ${num(it.price - ST.fe)} ريشة أخرى 🪶`); return; } ST.fe -= it.price; ST.own[it.id] = 1; ST.wear[it.slot] = it.id; sfx('sparkle'); FX.confetti(); }
    else ST.wear[it.slot] = ST.wear[it.slot] === it.id ? '' : it.id;
    save(); render(); });
  on('[data-b]', el => { const it = BGS.find(x => x.id === el.dataset.b), own = it.price === 0 || ST.own['bg-' + it.id];
    if (!own) { if (ST.fe < it.price) { toast(`تحتاج ${num(it.price - ST.fe)} ريشة أخرى 🪶`); return; } ST.fe -= it.price; ST.own['bg-' + it.id] = 1; sfx('sparkle'); FX.confetti(); }
    ST.bg = it.id; save(); render(); });
});

/* ---------- badges ---------- */
const stageDone = s => TOPICS.filter(t => t.stage === s).every(t => t.words.every(isLearned));
const BADGES = [
  ['first', '🐣', 'أول درس', 'أنهيت أول درس', () => Object.keys(ST.ls).length >= 1],
  ['w20', '🪶', '٢٠ كلمة', 'تعلمت ٢٠ كلمة', () => nLearned() >= 20], ['w50', '📗', '٥٠ كلمة', 'تعلمت ٥٠ كلمة', () => nLearned() >= 50],
  ['w100', '📘', '١٠٠ كلمة', 'تعلمت ١٠٠ كلمة', () => nLearned() >= 100], ['w250', '📙', '٢٥٠ كلمة', 'تعلمت ٢٥٠ كلمة', () => nLearned() >= 250],
  ['w500', '📚', '٥٠٠ كلمة', 'تعلمت ٥٠٠ كلمة', () => nLearned() >= 500], ['wall', '👑', 'كل الكلمات', 'تعلمت كل كلمات البرنامج', () => nLearned() >= WORDS.length],
  ['m25', '💎', 'أتقنت ٢٥', 'أتقنت ٢٥ كلمة', () => nMastered() >= 25], ['m100', '🏆', 'أتقنت ١٠٠', 'أتقنت ١٠٠ كلمة', () => nMastered() >= 100],
  ['s3', '🔥', '٣ أيام', 'تعلمت ٣ أيام متتالية', () => streakNow() >= 3], ['s7', '🌟', 'أسبوع كامل', '٧ أيام متتالية', () => streakNow() >= 7], ['s30', '🌙', 'شهر كامل', '٣٠ يومًا متتالية', () => streakNow() >= 30],
  ['perfect', '🎯', 'بلا أخطاء', 'درس كامل بلا خطأ', () => ST.perfect >= 1], ['rev100', '🔁', '١٠٠ مراجعة', 'أجبت ١٠٠ سؤال مراجعة', () => ST.revN >= 100],
  ['talk10', '🎤', 'متحدث', '١٠ إجابات في «تحدّث»', () => ST.talkN >= 10], ['games10', '🎮', 'لاعب ماهر', 'لعبت ١٠ ألعاب', () => ST.games >= 10],
  ['stage1', '🥉', 'المرحلة الأولى', 'أنهيت «الأساس»', () => stageDone(1)], ['stage2', '🥈', 'المرحلة الثانية', 'أنهيت «المستوى الرابع»', () => stageDone(2)],
  ['stage3', '🥇', 'المرحلة الثالثة', 'أنهيت «انطلق أبعد»', () => stageDone(3)], ['place', '🧭', 'المستكشف', 'أجريت اختبار تحديد المستوى', () => ST.placed === true],
];
function newBadges() { const got = []; BADGES.forEach(b => { if (!ST.badges[b[0]] && b[4]()) { ST.badges[b[0]] = DAY(); got.push(b); } }); return got; }
def('badges', () => {
  const n = BADGES.filter(b => ST.badges[b[0]]).length;
  app.innerHTML = bar('أوسمتي') + `<p class="center muted">حصلت على ${num(n)} من ${num(BADGES.length)} وسامًا</p>
    <div class="blist">${BADGES.map(b => `<div class="bdg${ST.badges[b[0]] ? '' : ' off'}"><span>${b[1]}</span><b>${b[2]}</b><small>${b[3]}</small></div>`).join('')}</div>`;
  bindBar();
});

/* ---------- parents' corner ---------- */
def('gate', () => {
  const a = 3 + Math.floor(Math.random() * 7), b = 4 + Math.floor(Math.random() * 6), ans = a * b, opts = mix([ans, ans + a, ans - b, ans + 2]);
  app.innerHTML = bar('ركن الوالدين', { fe: false }) + `<div class="card gatebox"><p style="margin:0">هذه الصفحة للوالدين. أجيبوا لتدخلوا:</p><div class="q">${a} × ${b} = ?</div>
    <div class="opts g2" style="width:100%">${opts.map(o => `<button class="opt" data-v="${o}"><span class="num">${o}</span></button>`).join('')}</div></div>`;
  bindBar();
  on('[data-v]', el => { if (+el.dataset.v === ans) { clean(); cur = { name: 'parents' }; render(); } else { el.classList.add('bad'); setTimeout(back, 600); } });
});
def('parents', () => {
  const nl = nLearned(), nm = nMastered(), due = dueWords().length, days = Object.keys(ST.days).map(Number).sort((x, y) => x - y);
  let q = 0, c = 0; for (let d = DAY() - 6; d <= DAY(); d++) { const x = ST.days[d]; if (x) { q += x.q; c += x.c; } }
  const mins = Math.round(Object.values(ST.days).reduce((s, x) => s + (x.s || 0), 0) / 60);
  const last14 = Array.from({ length: 14 }, (_, i) => DAY() - 13 + i), mx = Math.max(4, ...last14.map(d => ST.days[d] ? ST.days[d].n + ST.days[d].r : 0));
  const hard = WORDS.filter(isHard).sort((a, b) => sOf(b).x - sOf(a).x).slice(0, 15);
  const stg = [1, 2, 3].map(s => { const ws = WORDS.filter(w => TOPIC[w.t].stage === s); return [STAGES[s - 1][0], ws.filter(isLearned).length, ws.length]; });
  const dateOf = d => { const t = new Date(d * 864e5); return `${t.getUTCDate()}/${t.getUTCMonth() + 1}`; };
  app.innerHTML = bar('ركن الوالدين', { fe: false }) + `
    <div class="stats"><div class="stat"><b>${nl}</b><small>كلمة تعلمها من ${WORDS.length}</small></div><div class="stat"><b>${nm}</b><small>كلمة أتقنها (ثبتت أسبوعين فأكثر)</small></div>
      <div class="stat"><b>${due}</b><small>كلمة تنتظر المراجعة اليوم</small></div><div class="stat"><b>${streakNow()}</b><small>يومًا متتاليًا</small></div>
      <div class="stat"><b>${q ? Math.round(c / q * 100) + '%' : '—'}</b><small>إجابات صحيحة في آخر ٧ أيام</small></div><div class="stat"><b>${mins}</b><small>دقيقة تعلّم حتى الآن</small></div></div>
    <div class="sec">آخر أسبوعين</div><div class="card"><div class="chart">${last14.map(d => { const x = ST.days[d] || { n: 0, r: 0 };
      return `<div class="c"><i class="r" style="height:${x.r / mx * 100}%"></i><i class="n" style="height:${x.n / mx * 100}%"></i><small>${dateOf(d).split('/')[0]}</small></div>`; }).join('')}</div>
      <div class="legend"><span><i style="background:var(--gold)"></i>كلمات جديدة</span><span><i style="background:#7cb8ff"></i>مراجعات</span></div></div>
    <div class="sec">المراحل</div><div class="card stack">${stg.map(([n, g, t]) => `<div><b>${n}</b> <span class="muted small num">${g}/${t}</span><div class="pbar green" style="margin-top:4px"><i style="width:${Math.round(g / t * 100)}%"></i></div></div>`).join('')}</div>
    <div class="sec">كلمات تحتاج تدريبًا</div><div class="card">${hard.length ? hard.map(w => `<div class="hard">${pic(w)}<span class="en">${esc(w.en)}</span><span class="muted small">${esc(w.ar)}</span><button class="tbtn" data-k="${esc(w.k)}">🔊</button></div>`).join('') : '<p class="muted" style="margin:0">لا توجد كلمات صعبة الآن.</p>'}</div>
    <div class="sec">الإعدادات</div><div class="card">
      <div class="setrow"><span>هدف اليوم</span><div class="seg" id="goal">${[1, 2, 3].map(g => `<button data-g="${g}" class="${ST.set.goal === g ? 'on' : ''}">${g === 1 ? 'درس' : g === 2 ? 'درسان' : '٣ دروس'}</button>`).join('')}</div></div>
      <div class="setrow"><span>كلمات المراجعة في الجلسة</span><div class="seg" id="rev">${[10, 15, 20].map(g => `<button data-r="${g}" class="${ST.set.rev === g ? 'on' : ''}">${g}</button>`).join('')}</div></div>
      <div class="setrow"><span>إخفاء ترجمة الجمل حتى يضغط عليها</span><button class="switch${ST.set.arHide ? ' on' : ''}" data-s="arHide" aria-label="إخفاء الترجمة"></button></div>
      <div class="setrow"><span>المؤثرات الصوتية</span><button class="switch${ST.set.sfx ? ' on' : ''}" data-s="sfx" aria-label="المؤثرات"></button></div>
      <div class="setrow"><span>النطق بالميكروفون${MIC ? '' : ' (لا يدعمه هذا المتصفح)'}</span><button class="switch${ST.set.mic ? ' on' : ''}" data-s="mic" aria-label="الميكروفون"></button></div></div>
    <div class="sec">لمعلمة الحصة</div><div class="card stack"><p class="muted small" style="margin:0">انسخوا قائمة الكلمات التي تعلمها وأرسلوها لمعلمته لتستعملها معه في الحصة.</p>
      <button class="btn soft small" id="copy">📋 نسخ قائمة الكلمات</button><textarea class="copybox" id="cbox" readonly hidden></textarea></div>
    <div class="sec">كيف يعمل البرنامج؟</div><div class="card"><p style="margin:0" class="small">
      ٧٣٢ كلمة وجملة في ٣٢ موضوعًا على ثلاث مراحل، تبدأ بكلمات الأساس ثم كلمات المستوى الرابع ثم أبعد. كل درس ٦ كلمات تقريبًا: يتعرف عليها بالصورة والصوت والمثال، ثم يتدرب عليها بأسئلة متنوعة.
      بعد الدرس تدخل الكلمة «المراجعة الذكية»: تعود بعد يوم، ثم يومين، ثم ٤ أيام، ثم أسبوع، ثم أسبوعين، ثم شهر. إذا أخطأ فيها تعود من البداية. هكذا تنتقل الكلمة إلى الذاكرة الطويلة.
      يكفي ١٠–١٥ دقيقة يوميًا: درس جديد ومراجعة ما حان وقته. الأصوات مسجلة بصوت أولي بالإنجليزية وصوت حامد بالعربية، والمؤثرات بلا موسيقى.</p></div>
    <div class="sec">البدء من جديد</div><div class="card stack"><button class="btn soft small" id="place">🧭 إعادة اختبار تحديد المستوى</button><button class="btn soft small" id="reset" style="color:var(--bad2)">🗑️ مسح كل التقدم</button></div>`;
  bindBar();
  on('[data-k]', el => VO.say(BYK[el.dataset.k].en));
  on('[data-g]', el => { ST.set.goal = +el.dataset.g; save(); render(); });
  on('[data-r]', el => { ST.set.rev = +el.dataset.r; save(); render(); });
  on('[data-s]', el => { const k = el.dataset.s; ST.set[k] = !ST.set[k]; if (k === 'mic') micBlocked = false; save(); el.classList.toggle('on', ST.set[k]); });
  on('#copy', () => {
    const ws = WORDS.filter(isLearned), text = `Words I learned (${ws.length}):\n` + TOPICS.map(t => { const x = t.words.filter(isLearned); return x.length ? `${t.en}: ${x.map(w => w.en).join(', ')}` : ''; }).filter(Boolean).join('\n');
    const box = $('#cbox'); box.value = text; box.hidden = false;
    try { navigator.clipboard.writeText(text).then(() => toast('نُسخت القائمة ✓'), () => { box.select(); toast('اضغطوا على النص وانسخوه'); }); } catch (e) { box.select(); }
  });
  on('#place', () => go('placement'));
  on('#reset', () => confirmSheet('مسح كل التقدم والريش والأوسمة؟ لا يمكن التراجع.', 'نعم، امسح', 'لا', () => confirmSheet('متأكدون؟', 'امسح الآن', 'تراجع', () => { ST = DEF(); save(); stack = []; go('splash', null, false); })));
});

/* ---------- boot (called at the very end of the page, after quiz.js, talk.js and games.js) ---------- */
function boot() { FX.init(); cur = { name: 'splash' }; render(); }
window.FALCON = { get ST() { return ST; }, set ST(v) { ST = v; }, VO, WORDS, TOPICS, go, home, save, DAY }; // for the test bot
