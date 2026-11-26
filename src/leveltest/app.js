/* اختبار المستوى — the test runner. Built by `python3 src/build.py leveltest` with items.js and src/falcon/art.js (Shaheen).
   No right-or-wrong is shown while he answers. A part stops early when a band goes badly (the higher bands would only be guesses).
   Results: on the play link they are saved in the artifact's own database (collection "results", one document per attempt,
   written after every part) so Claude can read them; anywhere else the parents copy a short results code. */
'use strict';
const app = document.getElementById('app');
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const mix = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const AD = '٠١٢٣٤٥٦٧٨٩', num = n => String(n).replace(/\d/g, d => AD[d]);
const wait = ms => new Promise(r => setTimeout(r, ms));
const $ = s => app.querySelector(s), $$ = s => Array.from(app.querySelectorAll(s));
const REDUCED = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

/* ---------- voices: Ollie's English (Azure) and Hamed's Arabic, in one pack ---------- */
function fnv(text) { let h = 2166136261; for (const ch of text) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36); }
const VO = {
  dir: 'level-test/voices', ctx: null, idx: null, packs: {}, bufs: {}, src: null, ready: null, tok: 0,
  start() {
    if (this.ready) return this.ready;
    const AC = window.AudioContext || window.webkitAudioContext;
    try { this.ctx = AC ? new AC() : null; } catch (e) { this.ctx = null; }
    if (!this.ctx) return this.ready = Promise.resolve();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    if (location.protocol === 'file:') return this.ready = Promise.resolve();
    return this.ready = fetch(this.dir + '/packs.json').then(r => r.json()).then(j => { this.idx = j; this.pack('core'); }).catch(e => console.warn('voices not loaded', e));
  },
  pack(name) { if (!this.idx || !this.idx.packs[name]) return Promise.resolve(null);
    return this.packs[name] || (this.packs[name] = fetch(this.dir + '/' + this.idx.packs[name]).then(r => r.ok ? r.arrayBuffer() : null).catch(() => null)); },
  key(x) { return typeof x === 'string' ? ['e' + fnv(x)] : ['a' + x.a, fnv(LT_AR[x.a] || '')]; },
  clip(k, h) {
    if (this.bufs[k]) return this.bufs[k];
    const e = this.idx && this.idx.c[k];
    if (!e || (e[3] && e[3] !== h)) return Promise.resolve(null);
    return this.bufs[k] = this.pack(e[0]).then(ab => ab ? new Promise(res => {
      try { const d = this.ctx.decodeAudioData(ab.slice(e[1], e[1] + e[2]), res, () => res(null)); if (d && d.catch) d.catch(() => res(null)); } catch (err) { res(null); }
    }) : null);
  },
  stop() { this.tok++; if (this.src) { try { this.src.onended = null; this.src.stop(); } catch (e) {} this.src = null; } document.querySelectorAll('.spkbig').forEach(b => b.classList.remove('play')); },
  async play(x, tok) {
    if (!this.ctx) return; await this.ready;
    const [k, h] = this.key(x), b = await this.clip(k, h);
    if (!b || tok !== this.tok) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return new Promise(res => { const s = this.ctx.createBufferSource(); s.buffer = b; s.connect(this.ctx.destination);
      s.onended = () => { if (this.src === s) this.src = null; res(); }; this.src = s; s.start(); setTimeout(res, b.duration * 1000 + 400); });
  },
  async say(list) {
    this.stop(); const tok = this.tok;
    document.querySelectorAll('.spkbig').forEach(b => b.classList.add('play'));
    for (const x of [].concat(list)) { if (tok !== this.tok) return; if (typeof x === 'number') await wait(x); else if (x) await this.play(x, tok); }
    if (tok === this.tok) document.querySelectorAll('.spkbig').forEach(b => b.classList.remove('play'));
  },
};
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
// noise-only sound effects (no music)
const SFX = { noise: null,
  burst(at, dur, type, freq, q, vol, to) { const c = VO.ctx;
    if (!this.noise) { const n = c.createBuffer(1, c.sampleRate * .6 | 0, c.sampleRate), d = n.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; this.noise = n; }
    const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = this.noise; f.type = type; f.frequency.setValueAtTime(freq, at); f.Q.value = q;
    if (to) f.frequency.exponentialRampToValueAtTime(to, at + dur);
    g.gain.setValueAtTime(.0001, at); g.gain.exponentialRampToValueAtTime(vol, at + .008); g.gain.exponentialRampToValueAtTime(.0001, at + dur);
    s.connect(f); f.connect(g); g.connect(c.destination); s.start(at, Math.random() * .3); s.stop(at + dur + .03); },
  play(kind) { try { const c = VO.ctx; if (!c || c.state !== 'running') return; const t = c.currentTime + .01, B = this.burst.bind(this);
    if (kind === 'tap') B(t, .035, 'bandpass', 1700, 1, .3);
    if (kind === 'pick') { B(t, .045, 'bandpass', 1500, 1.4, .6); B(t + .07, .05, 'bandpass', 2000, 1.4, .5); }
    if (kind === 'win') for (let k = 0; k < 16; k++) B(t + k * .05 + Math.random() * .03, .05, 'bandpass', 1200 + Math.random() * 1800, 1, .4);
  } catch (e) {} },
};
const sfx = k => SFX.play(k);
const FX = { c: null, x: null, p: [], raf: 0,
  init() { if (this.x) return; this.c = document.getElementById('fx'); if (!this.c) return; this.x = this.c.getContext('2d'); const rs = () => { const d = Math.min(2, window.devicePixelRatio || 1); this.c.width = innerWidth * d; this.c.height = innerHeight * d; this.x.setTransform(d, 0, 0, d, 0, 0); }; rs(); addEventListener('resize', rs); },
  confetti() { if (REDUCED || !this.x) return; const cols = ['#ffd95a', '#ff8a80', '#8fe3ff', '#b8f28c', '#c9a8ff', '#ffb86b'];
    for (let i = 0; i < 110; i++) this.p.push({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * .4, vx: (Math.random() - .5) * 160, vy: 80 + Math.random() * 160, life: 0, max: 2.6 + Math.random(), r: 4 + Math.random() * 5, col: cols[i % cols.length], rot: Math.random() * 6, vr: (Math.random() - .5) * 8 });
    if (this.raf) return; let last = performance.now();
    const step = t => { const dt = Math.min(.05, (t - last) / 1000); last = t; const x = this.x; x.clearRect(0, 0, innerWidth, innerHeight);
      this.p = this.p.filter(q => (q.life += dt) < q.max);
      for (const q of this.p) { q.vy += 120 * dt; q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt; x.globalAlpha = Math.max(0, Math.min(1, (1 - q.life / q.max) * 1.4)); x.fillStyle = q.col; x.save(); x.translate(q.x, q.y); x.rotate(q.rot); x.fillRect(-q.r, -q.r / 2, q.r * 2, q.r); x.restore(); }
      x.globalAlpha = 1; if (this.p.length) this.raf = requestAnimationFrame(step); else { this.raf = 0; x.clearRect(0, 0, innerWidth, innerHeight); } };
    this.raf = requestAnimationFrame(step); },
};

/* ---------- the attempt, kept in this browser so a reload can carry on ---------- */
const KEY = 'rakan-leveltest-v1';
let T = null;
const newAttempt = () => ({ id: 't' + Date.now().toString(36), started: new Date().toISOString(), finished: null, sec: 0, pos: 0, answers: {}, skipped: [], speak: {}, parent: {}, ms: 0 });
function keep() { try { localStorage.setItem(KEY, JSON.stringify(T)); } catch (e) {} }
function loadKept() { try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch (e) { return null; } }

/* the artifact's database: saved after every part, so even a test stopped half way reaches Claude */
const DB = { h: null, ready: null, chain: Promise.resolve(), saved: false,
  init() { return this.ready || (this.ready = (async () => { try { if (window.claude && window.claude.use) this.h = await window.claude.use('db'); } catch (e) { this.h = null; } })()); },
  save() {
    const body = payload();
    this.chain = this.chain.then(async () => {
      await this.init(); if (!this.h) return;
      try { await Promise.race([this.h.doc('results/' + T.id).set(body), wait(12000).then(() => { throw new Error('timeout'); })]); this.saved = true; } catch (e) { this.saved = false; }
    });
    return this.chain;
  },
};

/* ---------- scoring ---------- */
const flat = s => s.kind === 'reading' ? s.items.flatMap(it => it.qs) : s.items;
function summary() {
  const bands = { 1: [0, 0], 2: [0, 0], 3: [0, 0], 4: [0, 0] }, sections = {};
  for (const s of LT_SECTIONS) {
    const per = { 1: [0, 0], 2: [0, 0], 3: [0, 0], 4: [0, 0] };
    if (s.kind === 'speak') { s.items.forEach(it => { const r = T.speak[it.id]; per[it.b] = [r == null ? 0 : r, 3]; }); sections[s.id] = per; continue; }
    for (const q of flat(s)) { const a = T.answers[q.id]; per[q.b][1]++; bands[q.b][1]++; if (a && a.ok) { per[q.b][0]++; bands[q.b][0]++; } }
    sections[s.id] = per;
  }
  const rate = b => bands[b][1] ? bands[b][0] / bands[b][1] : 0, r = [0, rate(1), rate(2), rate(3), rate(4)];
  const level = r[1] < .6 ? 'Pre-A1' : r[2] < .5 ? 'Pre-A1+' : r[3] < .5 ? 'A1' : r[4] < .5 ? 'A2' : 'B1';
  const pct = ids => { let c = 0, t = 0; ids.forEach(id => { const p = sections[id]; for (const b in p) { c += p[b][0]; t += p[b][1]; } }); return t ? Math.round(c / t * 100) : 0; };
  const skills = { vocabulary: pct(['s1', 's2']), grammar: pct(['s3']), listening: pct(['s4']), reading: pct(['s5']), spelling: pct(['s6']), speaking: pct(['s7']) };
  return { level, bands: { 1: r[1], 2: r[2], 3: r[3], 4: r[4] }, sections, skills };
}
const LEVEL_AR = { 'Pre-A1': 'مبتدئ (Pre-A1)', 'Pre-A1+': 'مبتدئ متقدم (Pre-A1 مرتفع)', A1: 'أساسي (A1)', A2: 'ما قبل المتوسط (A2)', B1: 'متوسط (B1)' };
function payload() {
  const list = [];
  for (const s of LT_SECTIONS) for (const q of (s.kind === 'speak' ? [] : flat(s))) {
    const a = T.answers[q.id];
    list.push({ id: q.id, b: q.b, ok: a ? (a.ok ? 1 : 0) : null, dunno: a && a.dunno ? 1 : 0, ms: a ? a.ms : null, replays: a ? a.replays || 0 : 0, pick: a ? a.pick : null, skipped: T.skipped.includes(q.id) ? 1 : 0 });
  }
  return { v: 1, app: 'level-test', started: T.started, finished: T.finished, minutes: Math.round(T.ms / 60000), answers: list,
    speak: LT_SECTIONS.find(s => s.kind === 'speak').items.map(it => ({ id: it.id, b: it.b, rating: T.speak[it.id] == null ? null : T.speak[it.id] })),
    parent: LT_PARENT.map(p => ({ id: p.id, answer: T.parent[p.id] == null ? null : p.opts[T.parent[p.id]] })), summary: summary() };
}
/* a short code the parents can copy when the database is not there (outside the play link) */
function code() {
  const parts = LT_SECTIONS.map(s => s.id + ':' + [1, 2, 3, 4].map(b => s.kind === 'speak'
    ? s.items.filter(it => it.b === b).map(it => T.speak[it.id] == null ? '-' : T.speak[it.id]).join('')
    : flat(s).filter(q => q.b === b).map(q => { const a = T.answers[q.id]; return !a ? '-' : a.dunno ? 'd' : a.ok ? '1' : '0'; }).join('')).join('.'));
  return `LT1|${parts.join('|')}|p:${LT_PARENT.map(p => T.parent[p.id] == null ? '-' : T.parent[p.id]).join('')}|L:${summary().level}|m:${Math.round(T.ms / 60000)}`;
}

/* ---------- screens ---------- */
let shownAt = 0, timer = 0;
function tick() { clearInterval(timer); let last = Date.now(); timer = setInterval(() => { const n = Date.now(); if (!document.hidden && n - last < 5000) T.ms += n - last; last = n; }, 1000); }
const falcon = (o = {}) => falconSVG(Object.assign({ rank: 2 }, o));
function partDots(cur) {
  return `<div class="ltparts">${LT_SECTIONS.map((s, i) => `<span class="${i < cur ? 'done' : i === cur ? 'on' : ''}" title="${esc(s.ar)}">${i < cur ? '✓' : s.icon}</span>`).join('')}</div>`;
}
function start() {
  const kept = loadKept(), resume = kept && !kept.finished && kept.pos + kept.sec > 0;
  app.innerHTML = `<div class="splash"><div class="fbig bob">${falcon({ mood: 'happy', pose: 'cheer' })}</div>
    <h1>اختبار المستوى</h1><div class="enname en">ENGLISH LEVEL CHECK</div>
    <p class="tag">٧ أجزاء قصيرة: كلمات، وقواعد، واستماع، وقراءة، وكتابة، وكلام. حوالي ١٥ دقيقة.</p>
    ${resume ? '<button class="btn green" id="res">▶︎ أكمل من حيث توقفت</button><button class="btn soft" id="new" style="max-width:320px">ابدأ من جديد</button>' : '<button class="btn" id="go">▶︎ ابدأ</button>'}
    <p class="small muted" style="max-width:24em">للوالدين: اجلسوا معه في الجزء السابع (الكلام)، وفي آخر الاختبار أسئلة قصيرة لكم.</p></div>`;
  const begin = fresh => { VO.start(); FX.init(); DB.init(); sfx('tap'); T = fresh ? newAttempt() : kept; keep(); tick(); fresh ? intro(0) : section(T.sec, true); };
  if (resume) { $('#res').onclick = () => begin(false); $('#new').onclick = () => begin(true); } else $('#go').onclick = () => begin(true);
}
function intro(step) {
  const ids = ['intro-1', 'intro-2'], text = ['أهلًا يا بطل! هذا اختبار قصير لنعرف مستواك في اللغة الإنجليزية.', 'ليس فيه نجاح ولا رسوب. أجب بهدوء، وإذا لم تعرف الإجابة فاضغط «لا أعرف».'];
  app.innerHTML = `<div class="splash"><div class="bubble">${text[step]}</div><div class="fbig" style="width:190px">${falcon({ mood: step ? 'happy' : 'idle' })}</div><button class="btn" id="nx">${step ? 'هيا نبدأ ◀︎' : 'التالي ◀︎'}</button></div>`;
  VO.say({ a: ids[step] });
  $('#nx').onclick = () => { sfx('tap'); step ? section(0) : intro(1); };
}
function section(si, resume) {
  T.sec = si; if (!resume) T.pos = 0; keep();
  if (si >= LT_SECTIONS.length) return parents();
  const s = LT_SECTIONS[si];
  app.innerHTML = `${partDots(si)}<div class="splash" style="min-height:auto;padding-top:10px"><div class="ltbig">${s.icon}</div>
    <h1 style="font-size:32px">الجزء ${num(si + 1)}: ${esc(s.ar)}</h1><div class="bubble">${esc(LT_HOW[s.kind])}</div>
    <div class="fbig" style="width:150px">${falcon({ mood: 'happy' })}</div><button class="btn" id="go">ابدأ الجزء ◀︎</button></div>`;
  VO.say({ a: s.line });
  $('#go').onclick = () => { sfx('tap'); item(); };
}
const LT_HOW = { listenPic: 'اسمع الكلمة، ثم اختر صورتها.', readMeaning: 'اقرأ الكلمة الإنجليزية، ثم اختر معناها.', grammar: 'اختر الكلمة التي تكمل الجملة.',
  listenQ: 'اسمع الكلام جيدًا، ثم أجب عن السؤال. تستطيع أن تسمعه مرة أخرى.', reading: 'اقرأ القصة القصيرة، ثم أجب عن الأسئلة.', spell: 'اسمع الكلمة، ثم اكتبها بالحروف.',
  speak: 'ستسمع سؤالًا بالإنجليزية، فأجب عنه بصوتك. ومن يجلس معك يختار كيف كانت إجابتك.' };

/* the item at T.pos in the current section; skips what the early stop removed */
function item() {
  const s = LT_SECTIONS[T.sec];
  while (T.pos < s.items.length && T.skipped.includes(s.items[T.pos].id)) T.pos++;
  if (T.pos >= s.items.length) return sectionDone();
  const it = s.items[T.pos], total = s.items.length;
  app.innerHTML = `${partDots(T.sec)}<div class="qtop"><span class="ltsec">${s.icon} ${esc(s.ar)}</span><div class="pbar"><i style="width:${Math.round(T.pos / total * 100)}%"></i></div><span class="num small muted">${num(T.pos + 1)}/${num(total)}</span></div><div id="qb"></div>`;
  shownAt = Date.now();
  KINDS[s.kind](it, $('#qb'), s);
}
function answer(q, ok, extra = {}) {
  T.answers[q.id] = Object.assign({ ok: !!ok, ms: Date.now() - shownAt }, extra);
  keep();
}
function nextItem() {
  const s = LT_SECTIONS[T.sec], it = s.items[T.pos];
  T.pos++;
  // stop a part early: when a band went badly, its higher bands are skipped
  const nextIt = s.items[T.pos];
  if (s.stop >= 0 && nextIt && nextIt.b > it.b) {
    const qs = flat(s).filter(q => q.b === it.b), got = qs.filter(q => T.answers[q.id] && T.answers[q.id].ok).length;
    if (got <= s.stop) s.items.filter(x => x.b > it.b).forEach(x => (x.qs ? x.qs : [x]).forEach(q => { if (!T.skipped.includes(q.id)) T.skipped.push(q.id); }));
  }
  keep(); item();
}
function sectionDone() {
  DB.save();
  const si = T.sec + 1;
  if (si >= LT_SECTIONS.length) return section(si);
  app.innerHTML = `${partDots(si)}<div class="splash" style="min-height:auto;padding-top:24px"><div class="fbig hop" style="width:200px">${falcon({ mood: 'happy', pose: 'cheer' })}</div>
    <h1 style="font-size:30px">أحسنت!</h1><p class="tag">أنهيت ${num(si)} من ${num(LT_SECTIONS.length)} أجزاء.</p><button class="btn" id="nx">الجزء التالي ◀︎</button></div>`;
  sfx('win'); VO.say({ a: 'next' });
  $('#nx').onclick = () => { sfx('tap'); section(si); };
}
/* choice buttons: the pick is only marked, never judged; "I don't know" counts as a miss */
function choices(body, q, opts, render, ans, after) {
  const list = mix([ans, ...opts]);
  body.insertAdjacentHTML('beforeend', `<div class="opts ${list.some(o => String(o).length > 14) ? '' : 'g2'}">${list.map((o, i) => `<button class="opt ${render.cls || ''}" data-i="${i}">${render(o)}</button>`).join('')}</div>
    <button class="btn soft small" id="dunno" style="margin-top:14px">🤷 لا أعرف</button>`);
  let done = false;
  const pickIt = (o, el) => { if (done) return; done = true; VO.stop(); sfx('pick'); if (el) el.classList.add('chosen');
    answer(q, o === ans, { pick: o == null ? null : String(o), dunno: o == null, replays: q._replays || 0 }); setTimeout(after || nextItem, 380); };
  body.querySelectorAll('.opt').forEach(el => el.addEventListener('click', () => pickIt(list[+el.dataset.i], el)));
  body.querySelector('#dunno').onclick = () => pickIt(null, null);
}
const emo = o => `<span class="pic emo" style="--ps:58px">${o}</span>`;
const KINDS = {
  listenPic(it, body) {
    body.innerHTML = `<div class="prompt"><button class="spkbig" id="spk" aria-label="اسمع">🔊</button><div class="small muted">اضغط لتسمع مرة أخرى</div></div>`;
    VO.say(it.say);
    $('#spk').onclick = () => { it._replays = (it._replays || 0) + 1; VO.say(it.say); };
    const r = emo; r.cls = 'picopt';
    choices(body, it, it.opts, r, it.ans);
  },
  readMeaning(it, body) {
    body.innerHTML = `<div class="prompt"><div class="wbig en">${esc(it.word)}</div></div>`;
    choices(body, it, it.opts, o => esc(o), it.ans);
  },
  grammar(it, body) {
    body.innerHTML = `<div class="prompt"><div class="gapline en">${esc(it.text).replace('___', '<span class="blank">&nbsp;</span>')}</div></div>`;
    const r = o => `<span class="en">${esc(o)}</span>`;
    choices(body, it, it.opts, r, it.ans);
  },
  listenQ(it, body) {
    const play = () => VO.say([...it.say.flatMap(t => [t, 250]), 300, { a: it.qa }]);
    body.innerHTML = `<div class="prompt"><button class="spkbig" id="spk" aria-label="اسمع">🔊</button><div class="small muted">اضغط لتسمع مرة أخرى</div>
      <div style="font-size:22px;font-weight:800">${esc(it.q)}</div></div>`;
    play();
    $('#spk').onclick = () => { it._replays = (it._replays || 0) + 1; play(); };
    const r = it.pics ? emo : (o => esc(o)); if (it.pics) r.cls = 'picopt';
    choices(body, it, it.opts, r, it.ans);
  },
  reading(it, body) {
    let k = 0;
    const show = () => {
      const q = it.qs[k];
      body.innerHTML = `<div class="ltstory en">${esc(it.text)}</div><div class="prompt" style="margin-top:12px"><div class="${q.en ? 'en' : ''}" style="font-size:21px;font-weight:800">${esc(q.q)}</div></div>`;
      if (q.qa) VO.say({ a: q.qa }); else VO.stop();
      shownAt = Date.now();
      const r = o => q.en ? `<span class="en">${esc(o)}</span>` : esc(o);
      choices(body, q, q.opts, r, q.ans, () => { k++; if (k < it.qs.length) show(); else nextItem(); });
    };
    show();
  },
  spell(it, body) {
    const chars = [...it.say], extra = mix('abcdeghilmnoprstu'.split('').filter(c => !chars.includes(c))).slice(0, 2);
    let pool = mix([...chars, ...extra]);
    body.innerHTML = `<div class="prompt"><span class="pic emo" style="--ps:80px">${it.pic}</span><button class="tbtn" id="hear">🔊 اسمع</button></div>
      <div class="slots">${chars.map((_, i) => `<span class="slot" data-s="${i}"></span>`).join('')}</div>
      <div class="tiles">${pool.map((c, i) => `<button class="tile" data-t="${i}">${esc(c)}</button>`).join('')}</div>
      <div class="row qfoot"><button class="btn soft small" id="undo">↩︎ امسح حرفًا</button><button class="btn soft small" id="dunno">🤷 لا أعرف</button></div>
      <button class="btn" id="ok" style="margin-top:12px" disabled>تم ◀︎</button>`;
    VO.say(it.say);
    $('#hear').onclick = () => { it._replays = (it._replays || 0) + 1; VO.say(it.say); };
    const typed = [];
    const draw = () => { $$('.slot').forEach((s, i) => { const t = typed[i]; s.textContent = t ? pool[t] : ''; s.classList.toggle('f', !!t || t === 0); });
      $$('.tile').forEach(b => b.classList.toggle('used', typed.includes(+b.dataset.t))); $('#ok').disabled = typed.length < chars.length; };
    $$('.tile').forEach(b => b.addEventListener('click', () => { if (typed.length >= chars.length || typed.includes(+b.dataset.t)) return; sfx('tap'); typed.push(+b.dataset.t); draw(); }));
    $('#undo').onclick = () => { typed.pop(); draw(); };
    let done = false;
    const finish = dunno => { if (done) return; done = true; const word = typed.map(t => pool[t]).join(''); sfx('pick');
      answer(it, !dunno && word === it.say, { pick: dunno ? null : word, dunno, replays: it._replays || 0 }); setTimeout(nextItem, 300); };
    $('#ok').onclick = () => finish(false);
    $('#dunno').onclick = () => finish(true);
  },
  speak(it, body) {
    body.innerHTML = `<div class="prompt"><button class="spkbig" id="spk" aria-label="اسمع السؤال">🔊</button><div class="en" style="font-size:24px;font-weight:800;color:var(--night)">${esc(it.say)}</div>
      <div class="small muted">الطفل يجيب بصوته، ومن معه يختار:</div></div>
      <div class="opts">${LT_RATE.map((r, i) => `<button class="opt ltrate" data-r="${i}"><span class="ltstars">${'★'.repeat(i)}<span class="off">${'★'.repeat(3 - i)}</span></span> ${esc(r)}</button>`).join('')}</div>`;
    VO.say(it.say);
    $('#spk').onclick = () => VO.say(it.say);
    let done = false;
    $$('.ltrate').forEach(b => b.addEventListener('click', () => {
      if (done) return; done = true; sfx('pick'); b.classList.add('chosen');
      T.speak[it.id] = +b.dataset.r; keep();
      body.insertAdjacentHTML('beforeend', `<div class="feedback ok" style="margin-top:12px">مثال لإجابة جيدة: <b class="en">${esc(it.model)}</b></div><button class="btn" id="nx" style="margin-top:12px">التالي ◀︎</button>`);
      VO.say(['Try like this:', 200, it.model]);
      $('#nx').onclick = () => { sfx('tap'); nextItem(); };
    }));
  },
};

/* ---------- the parents' questions, then the result ---------- */
function parents() {
  app.innerHTML = `<div class="splash" style="min-height:auto;padding-top:14px"><div class="fbig" style="width:150px">${falcon({ mood: 'happy' })}</div>
    <h1 style="font-size:28px">أسئلة قصيرة للوالدين</h1><p class="tag">تساعد Claude على وضع خطة مناسبة له.</p></div>
    <div class="stack">${LT_PARENT.map(p => `<div class="card"><b>${esc(p.q)}</b><div class="seg ltseg" data-p="${p.id}">${p.opts.map((o, i) => `<button data-i="${i}" class="${T.parent[p.id] === i ? 'on' : ''}">${esc(o)}</button>`).join('')}</div></div>`).join('')}
    <button class="btn" id="fin">عرض النتيجة ◀︎</button></div>`;
  VO.say({ a: 'parents' });
  $$('.ltseg button').forEach(b => b.addEventListener('click', () => { const p = b.parentElement.dataset.p; T.parent[p] = +b.dataset.i; keep(); sfx('tap');
    b.parentElement.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); }));
  $('#fin').onclick = () => { sfx('tap'); finish(); };
}
async function finish() {
  if (!T.finished) T.finished = new Date().toISOString();
  clearInterval(timer); keep();
  app.innerHTML = `<div class="result"><div class="fres hop">${falcon({ rank: 4, mood: 'happy', pose: 'cheer' })}</div><h2>أنهيت الاختبار! 🎉</h2>
    <div class="bigstars">★★★</div><p style="margin:0;font-size:19px">شكرًا يا بطل. أجبت عن كل الأجزاء بشجاعة!</p></div><div id="par" style="margin-top:18px"></div>`;
  FX.confetti(); sfx('win'); VO.say({ a: 'done' });
  await DB.save();
  const S = summary(), skills = [['الكلمات', S.skills.vocabulary], ['القواعد', S.skills.grammar], ['الاستماع', S.skills.listening], ['القراءة', S.skills.reading], ['الكتابة', S.skills.spelling], ['الكلام', S.skills.speaking]];
  $('#par').innerHTML = `<div class="card stack"><b style="font-size:19px">للوالدين: النتيجة</b>
    <div>تقدير أولي للمستوى: <b>${esc(LEVEL_AR[S.level])}</b></div>
    ${skills.map(([n, v]) => `<div><div class="row" style="justify-content:space-between"><span>${n}</span><span class="num">${v}%</span></div><div class="pbar green"><i style="width:${v}%"></i></div></div>`).join('')}
    ${DB.saved ? '<div class="feedback ok">✓ وصلت النتيجة إلى Claude. اكتبوا له: «انتهى الاختبار»، وسيقرأ الإجابات ويضع له خطة.</div>'
      : `<div class="feedback info">انسخوا رمز النتيجة وأرسلوه إلى Claude، وسيقرأ الإجابات ويضع له خطة.</div><textarea class="copybox" id="code" readonly>${esc(code())}</textarea><button class="btn soft small" id="cp">📋 نسخ رمز النتيجة</button>`}
    <button class="btn soft small" id="again">🔁 اختبار جديد</button></div>`;
  const cp = $('#cp'); if (cp) cp.onclick = () => { const box = $('#code'); try { navigator.clipboard.writeText(box.value).then(() => { cp.textContent = '✓ نُسخ'; }, () => box.select()); } catch (e) { box.select(); } };
  $('#again').onclick = () => { try { localStorage.removeItem(KEY); } catch (e) {} start(); };
}
window.LEVELTEST = { get T() { return T; }, summary, code, DB }; // for the test bot
start();
