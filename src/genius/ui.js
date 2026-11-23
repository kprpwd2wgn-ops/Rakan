if (typeof document !== 'undefined') (function(){
const $ = id => document.getElementById(id);
const rnd = a => a[Math.floor(Math.random() * a.length)];
const mix = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// keeps sound on when the iPhone silent switch is on
const UNMUTE = { a:null,
  url(){ const sr = 8000, n = sr, b = new ArrayBuffer(44 + n * 2), v = new DataView(b), w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
    return URL.createObjectURL(new Blob([b], { type:'audio/wav' })); },
  go(){ try { if (navigator.audioSession && navigator.audioSession.type !== 'playback') navigator.audioSession.type = 'playback'; } catch(e){}
    if (document.hidden) return;
    try { if (!this.a) { const a = document.createElement('audio'); a.setAttribute('playsinline', ''); a.setAttribute('x-webkit-airplay', 'deny'); a.loop = true; a.preload = 'auto'; a.src = this.url(); this.a = a; }
      if (this.a.paused) { const p = this.a.play(); if (p && p.catch) p.catch(() => {}); } } catch(e){} }
};
['touchend', 'click', 'keydown'].forEach(ev => document.addEventListener(ev, () => UNMUTE.go(), { capture:true, passive:true }));
document.addEventListener('visibilitychange', () => { if (UNMUTE.a) { if (document.hidden) UNMUTE.a.pause(); else UNMUTE.go(); } });

// Hamed's recorded voice. The clips sit in a few pack files (genius-challenge/voices/pack-*.mp3);
// packs.json says where each line is. A line plays only if its clip was made from the very same text.
const VO = {
  dir:'genius-challenge/voices', ctx:null, idx:null, packs:{}, bufs:{}, src:null, ready:null, tok:0,
  start(){
    if (this.ready) return this.ready;
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = AC ? new AC() : null;
    if (!this.ctx) return this.ready = Promise.resolve();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    if (location.protocol === 'file:') return this.ready = Promise.resolve(); // opened as a file: no voice files to fetch
    return this.ready = fetch(this.dir + '/packs.json').then(r => r.json()).then(j => { this.idx = j; this.pack('core'); }).catch(e => console.warn('voices not loaded', e));
  },
  pack(name){
    if (!this.idx || !this.idx.packs[name]) return Promise.resolve(null);
    return this.packs[name] || (this.packs[name] = fetch(this.dir + '/' + this.idx.packs[name]).then(r => r.ok ? r.arrayBuffer() : null).catch(() => null));
  },
  clip(id){
    if (this.bufs[id]) return this.bufs[id];
    const e = this.idx && this.idx.c[id];
    if (!e || !SAY[id] || e[3] !== hash(SAY[id]).toString(36)) return Promise.resolve(null);
    return this.bufs[id] = this.pack(e[0]).then(ab => ab ? new Promise(res => {
      try { const p = this.ctx.decodeAudioData(ab.slice(e[1], e[1] + e[2]), res, () => res(null)); if (p && p.catch) p.catch(() => res(null)); } catch(err){ res(null); }
    }) : null);
  },
  pre(ids){ if (this.idx) ids.forEach(id => this.clip(id)); },
  stop(){ this.tok++; if (this.src) { try { this.src.onended = null; this.src.stop(); } catch(e){} this.src = null; } },
  async play(id, tok){
    if (!this.ctx) return;
    await this.ready;
    const b = await this.clip(id);
    if (!b || tok !== this.tok) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return new Promise(res => { const s = this.ctx.createBufferSource(); s.buffer = b; s.connect(this.ctx.destination);
      s.onended = () => { if (this.src === s) this.src = null; res(); }; this.src = s; s.start(); });
  },
  async say(ids){ this.stop(); const tok = this.tok; for (const id of [].concat(ids)) { if (tok !== this.tok) return; await this.play(id, tok); } },
};

window.VO = VO; // for the test bot

// sound effects: short noise bursts only, no notes or tunes
const SFX = {
  on:true,
  noise(dur, from, to, vol = .35, type = 'bandpass'){
    const c = VO.ctx; if (!c || !this.on) return;
    const n = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
    const s = c.createBufferSource(); s.buffer = b; const f = c.createBiquadFilter(); f.type = type; f.Q.value = 1.2;
    f.frequency.setValueAtTime(from, c.currentTime); f.frequency.exponentialRampToValueAtTime(to, c.currentTime + dur);
    const g = c.createGain(); g.gain.value = vol; s.connect(f); f.connect(g); g.connect(c.destination); s.start();
  },
  tap(){ this.noise(.05, 2500, 1800, .25); },
  tick(){ this.noise(.03, 3500, 3000, .18, 'highpass'); },
  good(){ this.noise(.35, 800, 5000, .3); },
  bad(){ this.noise(.25, 400, 150, .45, 'lowpass'); },
  win(){ [0, 120, 240].forEach(t => setTimeout(() => this.noise(.3, 1200, 6000, .25), t)); },
};

// progress kept in this browser
const KEY = 'rakan-genius-v1';
let save = { b:{}, best:-1, tests:0, sfx:true };
try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.b) save = Object.assign(save, s); } catch(e){}
const store = () => { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch(e){} };
SFX.on = save.sfx !== false;
const starsOf = id => (save.b[id] || []).reduce((a, b) => a + (b || 0), 0);
const solvedOf = id => (save.b[id] || []).filter(Boolean).length;
const ALL = Object.keys(TYPES).reduce((a, id) => a + TYPES[id].n, 0);
const totalStars = () => Object.keys(TYPES).reduce((a, id) => a + starsOf(id), 0);
const RANKS = [[0, '🌱 مُبْتَدِئٌ'], [30, '⭐ ذَكِيٌّ'], [120, '💡 لَامِعٌ'], [300, '🧠 عَبْقَرِيٌّ'], [700, '🚀 عَبْقَرِيٌّ خَارِقٌ'], [1500, '👑 أُسْطُورَةُ الذَّكَاءِ']];
const rankName = s => RANKS.filter(r => s >= r[0]).pop()[1];

function show(id){ document.querySelectorAll('.scr').forEach(s => s.classList.toggle('on', s.id === id)); window.scrollTo(0, 0); }
function brainDo(el, cls){ el.classList.remove('hop', 'shake'); void el.getBoundingClientRect(); el.classList.add(cls); }

// ---------- home ----------
function home(speak){
  show('homeScr'); stopTimer();
  const ts = totalStars();
  $('rank').textContent = 'رُتْبَتُكَ: ' + rankName(ts) + '  ⭐ ' + dg(ts);
  $('snd').textContent = SFX.on ? '🔊' : '🔇';
  $('testBest').textContent = save.best >= 0 ? `🏆 أَفْضَلُ نَتِيجَةٍ: ${dg(save.best)} مِنْ ${dg(15)}` : '';
  $('worlds').innerHTML = '';
  for (const w of ['v', 'l', 'm']) {
    const W = WORLDS[w], ids = ORDER[w], n = ids.reduce((a, id) => a + TYPES[id].n, 0), s = ids.reduce((a, id) => a + solvedOf(id), 0);
    const b = document.createElement('button'); b.className = 'world';
    b.innerHTML = `<span class="ico" style="background:${W.color}">${W.icon}</span><span style="flex:1"><b>${W.name}</b><small>${W.note}</small>` +
      `<small>🧩 ${dg(s)} مِنْ ${dg(n)} لُغْزًا</small><div class="prog"><i style="width:${Math.round(s * 100 / n)}%"></i></div></span>`;
    b.onclick = () => { SFX.tap(); world(w, true); };
    $('worlds').appendChild(b);
  }
  $('totalLine').textContent = `فِي اللُّعْبَةِ ${dg(ALL)} لُغْزًا وَأَكْثَرُ مِنْ ${dg(Object.keys(TYPES).length)} نَوْعًا مِنَ الْأَلْغَازِ`;
  if (speak) VO.say('home');
}
$('snd').onclick = () => { SFX.on = !SFX.on; save.sfx = SFX.on; store(); $('snd').textContent = SFX.on ? '🔊' : '🔇'; SFX.tap(); };

// ---------- a world: its kinds of puzzles ----------
let curW = 'v';
function world(w, speak){
  curW = w; show('worldScr'); stopTimer();
  const W = WORLDS[w];
  $('wTitle').innerHTML = W.icon + ' ' + W.name;
  $('wStars').textContent = '⭐ ' + dg(ORDER[w].reduce((a, id) => a + starsOf(id), 0));
  $('kinds').innerHTML = '';
  ORDER[w].forEach(id => {
    const t = TYPES[id], s = solvedOf(id), b = document.createElement('button'); b.className = 'kind';
    b.innerHTML = `<span class="k">${t.icon}</span><b>${t.name}</b><small>${dg(s)} / ${dg(t.n)}</small><div class="prog"><i style="width:${Math.round(s * 100 / t.n)}%"></i></div>`;
    b.onclick = () => { SFX.tap(); startKind(id); };
    $('kinds').appendChild(b);
  });
  if (speak) VO.say('w-' + w);
}
$('wBack').onclick = () => { SFX.tap(); VO.stop(); home(false); };
$('mixBtn').onclick = () => { SFX.tap(); startMix(curW); };

// ---------- rounds ----------
// mode: 'kind' (ten of one kind, the first unsolved ones), 'mix' (ten of one world), 'test' (fifteen, timed)
let R = null;
const ROUND = 10, TEST_SEC = 15;
function firstUnsolved(id, k, avoid = []){
  const b = save.b[id] || [], n = TYPES[id].n, out = [];
  for (let i = 0; i < n && out.length < k; i++) if (!b[i] && !avoid.includes(i)) out.push(i);
  if (out.length < k) mix(range(n).filter(i => !out.includes(i) && !avoid.includes(i))).slice(0, k - out.length).forEach(i => out.push(i));
  return out;
}
function startKind(id){
  R = { mode:'kind', id, w:TYPES[id].w, list:firstUnsolved(id, ROUND).map(i => [id, i]), at:0, got:[] };
  VO.pack(id); begin(['h-' + id]);
}
function startMix(w){
  const kinds = mix(ORDER[w]), list = [];
  for (let k = 0; list.length < ROUND; k++) { const id = kinds[k % kinds.length]; const i = firstUnsolved(id, 1, list.filter(x => x[0] === id).map(x => x[1]))[0]; list.push([id, i]); }
  R = { mode:'mix', w, list, at:0, got:[] };
  begin(['mix']);
}
function startTest(){
  const list = [];
  for (const w of ['v', 'l', 'm']) mix(ORDER[w]).slice(0, 5).forEach(id => { const n = TYPES[id].n; list.push([id, Math.floor(n / 4) + Math.floor(Math.random() * Math.max(1, n / 2))]); });
  R = { mode:'test', list, at:0, got:[] };
  list.forEach(([id]) => VO.pack(id));
  begin(['test']);
}
$('testBtn').onclick = () => { SFX.tap(); startTest(); };
function begin(intro){ show('playScr'); R.intro = intro; puzzle(); }

// ---------- one puzzle ----------
let P = null, tries = 0, locked = false, memoT = 0, asking = false;
window.puzzleNow = () => P; // lets the test bot see the puzzle on screen
window.showPuzzle = (id, i) => { R = { mode:'kind', id, w:TYPES[id].w, list:[[id, i]], at:0, got:[] }; begin([]); }; // and open any puzzle
function puzzle(){
  const [id, i] = R.list[R.at];
  P = make(id, i); tries = 0; locked = false; asking = false; clearTimeout(memoT); stopTimer();
  const t = TYPES[id];
  $('pKind').textContent = t.icon + ' ' + t.name;
  $('pNum').textContent = dg(R.at + 1) + ' / ' + dg(R.list.length);
  $('dots').innerHTML = R.list.map((_, k) => `<i class="${k < R.at ? (R.got[k] ? 'ok' : 'no') : k === R.at ? 'now' : ''}"></i>`).join('');
  $('timer').hidden = R.mode !== 'test';
  const intro = [];
  if (R.intro) { intro.push(...R.intro); R.intro = null; }
  if (R.mode === 'test' && R.at % 5 === 0) intro.push('test-' + ['v', 'l', 'm'][R.at / 5]);
  // the next puzzle's lines start loading now
  const nx = R.list[R.at + 1]; if (nx) { try { const q = make(nx[0], nx[1]); VO.pre([...(q.say || []), ...(q.exSay || [])]); } catch(e){} }
  if (P.memo) {
    // the pictures show only after any opening words, so the child gets the whole time to look
    const me = P;
    $('qText').innerHTML = P.memo.q; $('opts').innerHTML = ''; $('opts').className = '';
    $('board').innerHTML = '<div class="txt" style="font-size:54px">⏳</div>';
    (intro.length ? VO.say(intro) : Promise.resolve()).then(() => {
      if (P !== me) return;
      $('board').innerHTML = P.memo.board + `<div class="memobar"><i style="animation-duration:${P.memo.ms}ms"></i></div>`;
      VO.say(P.memo.say);
      memoT = setTimeout(() => { if (P === me) ask(); }, P.memo.ms);
    });
    return;
  }
  ask(intro);
}
function ask(intro = []){
  $('qText').innerHTML = P.q + (P.top ? ` <span class="top">${P.top}</span>` : '');
  $('board').innerHTML = P.board;
  const o = $('opts'); o.innerHTML = '';
  if (P.opts) {
    const n = P.opts.length, cols = P.cols || (n === 3 ? 3 : 2);
    o.className = cols === 3 ? 'three' : cols === 1 ? 'one' : '';
    P.opts.forEach(op => { const b = document.createElement('button'); b.innerHTML = op.h; if (op.pic) b.classList.add('pic'); if (op.w) b.classList.add('w');
      b.onclick = () => choose(b, op); o.appendChild(b); });
  } else o.className = '';
  asking = true;
  if (R.mode !== 'test') { VO.say([...intro, ...P.say]); return; }
  // the test: the clock starts once the opening words are over
  left = TEST_SEC; drawTimer();
  const me = P;
  (intro.length ? VO.say(intro) : Promise.resolve()).then(() => { if (P !== me || locked) return; VO.say(P.say); startTimer(); });
}
$('board').addEventListener('click', e => {
  if (!P || !P.tap || locked || !asking) return;
  const g = e.target.closest('[data-k]'); if (!g) return;
  if (g.dataset.k === P.k) right();
  else { g.classList.add('pick'); setTimeout(() => g.classList.remove('pick'), 900); wrong(); }
});
$('replay').onclick = () => { if (P) VO.say(!asking && P.memo ? P.memo.say : P.say); };
$('pBack').onclick = () => { SFX.tap(); VO.stop(); stopTimer(); clearTimeout(memoT); P = null; $('panel').classList.remove('on'); R.mode === 'test' ? home(false) : world(R.w || curW, false); };

function choose(b, op){
  if (locked || b.classList.contains('no')) return;
  if (op.ok) { b.classList.add('ok'); right(); } else { b.classList.add('no'); wrong(); }
}
function right(){
  locked = true; stopTimer();
  const st = R.mode === 'test' ? 3 : tries === 0 ? 3 : tries === 1 ? 2 : 1;
  R.got[R.at] = st; record(st);
  SFX.good(); brainDo($('brainP'), 'hop'); confetti(36);
  setTimeout(() => panel(true, st), 420);
}
function wrong(){
  tries++; SFX.bad(); brainDo($('brainP'), 'shake');
  const left = P.opts ? P.opts.length - 1 - tries : 3 - tries;
  if (R.mode === 'test' || left <= 0) { locked = true; stopTimer(); R.got[R.at] = 0; markRight(); setTimeout(() => panel(false, 0), 700); return; }
  VO.say('no-' + Math.min(tries - 1, 2));
}
function markRight(){ if (P.opts) [...$('opts').children].forEach((b, k) => { if (P.opts[k].ok) b.classList.add('ok'); }); }
function record(st){ const [id, i] = R.list[R.at]; const b = save.b[id] || (save.b[id] = []); b[i] = Math.max(b[i] || 0, st); store(); }

// ---------- the answer panel ----------
let animT = 0;
function panel(ok, st, late){
  clearInterval(animT);
  $('okTitle').textContent = ok ? rnd(['أَحْسَنْتَ! 🎉', 'مُمْتَازٌ! 🌟', 'رَائِعٌ! 🎉', 'عَبْقَرِيٌّ! 🧠']) : late ? 'انْتَهَى الْوَقْتُ ⏰' : 'هَذَا هُوَ الْحَلُّ 👇';
  $('okTitle').className = ok ? '' : 'no';
  $('exText').innerHTML = (P.ex || '').replace(/\n/g, '<br>');
  $('pStars').textContent = R.mode === 'test' ? (ok ? '✅' : '❌') : '⭐'.repeat(st) + '☆'.repeat(3 - st);
  const eb = $('exBoard');
  if (P.anim) {
    eb.innerHTML = P.anim.base.replace('</svg>', '<g id="hl"></g></svg>') + `<div class="cnt" id="hlN"></div>`;
    let k = 0; const L = P.anim.list, every = Math.max(260, Math.min(700, 9000 / L.length));
    animT = setInterval(() => { if (k >= L.length) { clearInterval(animT); return; } $('hl').innerHTML = L[k]; k++; $('hlN').textContent = dg(k); SFX.tick(); }, every);
  } else eb.innerHTML = P.exBoard || '';
  $('panel').classList.add('on');
  $('nextQ').textContent = R.at + 1 < R.list.length ? 'التَّالِي ◀︎' : 'النَّتِيجَةُ 🏁';
  VO.say([ok ? 'ok-' + Math.floor(Math.random() * 6) : late ? 'late' : R.mode === 'test' ? 'miss' : 'show', ...(P.exSay || [])]);
}
$('nextQ').onclick = () => {
  SFX.tap(); clearInterval(animT); $('panel').classList.remove('on');
  R.at++; if (R.at < R.list.length) puzzle(); else R.mode === 'test' ? result() : done();
};

// ---------- the 15-second timer (the test) ----------
let timerT = 0, left = 0;
function startTimer(){
  stopTimer(); left = TEST_SEC; drawTimer();
  timerT = setInterval(() => { left--; drawTimer(); if (left <= 5 && left > 0) SFX.tick();
    if (left <= 0) { stopTimer(); if (locked) return; locked = true; R.got[R.at] = 0; SFX.bad(); markRight(); setTimeout(() => panel(false, 0, true), 500); } }, 1000);
}
function stopTimer(){ clearInterval(timerT); timerT = 0; }
function drawTimer(){ $('tNum').textContent = dg(Math.max(0, left)); $('tArc').style.strokeDashoffset = 119.4 * (1 - left / TEST_SEC); $('timer').classList.toggle('low', left <= 5); }

// ---------- end of a round ----------
function done(){
  show('doneScr'); SFX.win(); confetti(110);
  const got = R.got.reduce((a, b) => a + (b || 0), 0), max = R.list.length * 3;
  $('doneStars').textContent = '⭐ ' + dg(got) + ' / ' + dg(max);
  const id = R.id, all = id && solvedOf(id) >= TYPES[id].n;
  $('doneTitle').textContent = all ? 'حَلَلْتَ كُلَّ الْأَلْغَازِ! 🏆' : got >= max * .8 ? 'عَقْلٌ لَامِعٌ! 🌟' : 'أَحْسَنْتَ! 🎉';
  $('doneText').textContent = id ? `حَلَلْتَ ${dg(solvedOf(id))} مِنْ ${dg(TYPES[id].n)} لُغْزًا فِي «${TYPES[id].name}».` : 'جَوْلَةٌ مُنَوَّعَةٌ رَائِعَةٌ!';
  VO.say(all ? 'alldone' : 'done');
}
$('againBtn').onclick = () => { SFX.tap(); R.mode === 'kind' ? startKind(R.id) : startMix(R.w); };
$('toWorld').onclick = () => { SFX.tap(); world(R.w || curW, false); };
$('toHome').onclick = () => { SFX.tap(); home(false); };

// ---------- the IQ test result ----------
function result(){
  show('resScr'); SFX.win();
  const sc = R.got.filter(Boolean).length, tier = sc >= 11 ? 2 : sc >= 7 ? 1 : 0;
  save.tests = (save.tests || 0) + 1; if (sc > save.best) save.best = sc; store();
  $('score').textContent = dg(sc) + ' / ' + dg(15);
  const T3 = [['#e63946', '٠–٦', 'عَقْلٌ يَتَدَرَّبُ', '🌱'], ['#f4b400', '٧–١٠', 'ذَكِيٌّ جِدًّا', '⭐'], ['#2fbf71', '١١–١٥', 'عَبْقَرِيٌّ', '👑']];
  $('tiers').innerHTML = T3.map((t, k) => `<div class="tier${k === tier ? ' on' : ''}" style="background:${t[0]}"><span>${t[1]}: ${t[2]}</span><span class="cr">${t[3]}</span></div>`).join('');
  $('parts').innerHTML = ['v', 'l', 'm'].map((w, k) => `<div>${WORLDS[w].icon}<b>${dg(R.got.slice(k * 5, k * 5 + 5).filter(Boolean).length)}/${dg(5)}</b>${WORLDS[w].name}</div>`).join('');
  confetti(tier === 2 ? 160 : 70);
  VO.say('res-' + tier);
}
$('testAgain').onclick = () => { SFX.tap(); startTest(); };
$('resHome').onclick = () => { SFX.tap(); home(false); };

// ---------- start ----------
$('go').onclick = () => {
  $('go').hidden = true; $('loading').hidden = false;
  VO.start().then(() => { home(false); VO.say('intro'); });
  setTimeout(() => { if ($('startScr').classList.contains('on')) { home(false); } }, 4000);
};

// confetti
const cv = $('confetti'), cx = cv.getContext('2d'); let bits = [];
function confetti(n){ cv.width = innerWidth; cv.height = innerHeight;
  for (let i = 0; i < n; i++) bits.push({ x:innerWidth / 2, y:innerHeight * .45, vx:(Math.random() - .5) * 12, vy:-Math.random() * 12 - 3, r:Math.random() * 6 + 4,
    c:rnd(['#ffd23f', '#3ddc84', '#59c3ff', '#ff8a5c', '#ff6bd6']), a:Math.random() * 6, life:90 });
  if (bits.length === n) requestAnimationFrame(tick); }
function tick(){ cx.clearRect(0, 0, cv.width, cv.height);
  bits.forEach(b => { b.x += b.vx; b.y += b.vy; b.vy += .35; b.a += .2; b.life--; cx.save(); cx.translate(b.x, b.y); cx.rotate(b.a); cx.fillStyle = b.c; cx.fillRect(-b.r / 2, -b.r / 4, b.r, b.r / 2); cx.restore(); });
  bits = bits.filter(b => b.life > 0 && b.y < cv.height + 20); if (bits.length) requestAnimationFrame(tick); else cx.clearRect(0, 0, cv.width, cv.height); }
})();
