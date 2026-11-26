/* صقر الكلمات — the question engine: one session of questions for a lesson, a review or a test.
   Kinds: lp listen→picture, wp read→picture, pw picture→word, aw Arabic→word, wa word→Arabic, gap fill the sentence,
   sp spell with letter tiles, tf true or false, say speak into the mic, sit which class phrase fits, ord put the words in order. */
const INS = {
  lp: ['q-lp', 'اسمع، ثم اختر الصورة.'], wp: ['q-wp', 'اقرأ الكلمة، ثم اختر صورتها.'], pw: ['q-pw', 'ما اسم هذه الصورة بالإنجليزية؟'],
  aw: ['q-aw', 'اختر الكلمة الإنجليزية الصحيحة.'], wa: ['q-wa', 'ما معنى هذه الكلمة؟'], gap: ['q-gap', 'اختر الكلمة التي تكمل الجملة.'],
  sp: ['q-sp', 'رتّب الحروف لتكتب الكلمة.'], tf: ['q-tf', 'هل هذه الكلمة تناسب الصورة؟'], say: ['q-say', 'انطق الكلمة بصوت واضح.'],
  sit: ['q-sit', 'ماذا تقول في هذا الموقف؟'], ord: ['q-ord', 'رتّب الكلمات لتكوّن جملة صحيحة.'],
};
/* n wrong answers for w. mode: pic (they are shown as pictures), en, ar, gap (only one may fit the sentence).
   In parts 2-6 every word says what kind of word it is (flags v verb, a adjective or adverb, x small word, else a noun),
   and the wrong answers of a sentence question are words of another kind, so only one choice can fit. */
const pos = w => w.fl.includes('v') ? 'v' : w.fl.includes('a') ? 'a' : w.fl.includes('x') ? 'x' : 'n';
function others(w, n, mode) {
  const T = TOPIC[w.t], words = s => s.split(' ').length;
  const fits = x => x !== w && x.k !== w.k && isPhrase(x) === isPhrase(w) && !similar(x, w)
    && (mode !== 'pic' || (!weak(x) && x.pic !== w.pic))
    && (mode !== 'ar' || x.ar !== w.ar)
    && (mode !== 'gap' || ((PNO > 1 ? pos(x) !== pos(w) : KIND[x.t] !== KIND[w.t]) && !isPhrase(x) && !x.gx));   // big words (own wrong answers) could fit other sentences
  const tiers = mode === 'gap' ? [WORDS.filter(x => words(x.en) === words(w.en)), WORDS]
    : [lessonOf(w), T.words, WORDS.filter(x => TOPIC[x.t].stage === T.stage), WORDS];
  const out = [];
  for (const tier of tiers) for (const x of mix(tier)) {
    if (out.length >= n) return out;
    if (fits(x) && !out.includes(x) && !out.some(y => similar(x, y) || (mode === 'pic' && y.pic === x.pic) || (mode === 'ar' && y.ar === x.ar))) out.push(x);
  }
  return out;
}
const easyType = w => isPhrase(w) || weak(w) ? 'wa' : 'lp';
function lessonItems(L) {
  const r1 = mix(L).map(w => ({ w, type: easyType(w) }));
  const r2 = mix(L).map(w => ({ w, type: isPhrase(w) ? 'sit' : weak(w) ? (w.ex ? pick(['aw', 'gap']) : 'aw') : pick(['pw', 'wp', 'tf', 'aw']) }));
  const sp = mix(L.filter(spellable)).slice(0, 3);
  const r3 = mix([...sp.map(w => ({ w, type: 'sp' })),
    ...mix(L.filter(w => !sp.includes(w) && (isPhrase(w) || w.ex))).slice(0, Math.max(1, 4 - sp.length)).map(w => ({ w, type: isPhrase(w) ? 'ord' : 'gap' }))]);
  const r4 = canMic() ? mix(L.filter(w => !isPhrase(w))).slice(0, 2).map(w => ({ w, type: 'say' })) : [];
  const all = [...r1, ...r2, ...r3, ...r4];
  for (let i = 1; i < all.length; i++) if (all[i].w === all[i - 1].w && i + 1 < all.length) [all[i], all[i + 1]] = [all[i + 1], all[i]];
  return all;
}

/* runSession({items, mode: lesson|review|check|place, requeue, quick, dunno, onAnswer(q, ok), onEnd(S)}) */
function runSession(o) {
  const S = { i: 0, items: o.items.slice(), res: [], again: new Set(), heard: {}, run: 0, over: false };
  const quit = () => confirmSheet(o.mode === 'lesson' ? 'هل تريد الخروج من الدرس؟' : 'هل تريد الخروج؟', 'نعم، اخرج', 'أكمل', () => { S.over = true; back(); });
  const next = () => {
    if (S.over) return;
    if (S.i >= S.items.length) { S.over = true; return o.onEnd(S); }
    const q = S.items[S.i]; q.mode = o.mode; app.dataset.qn = (+app.dataset.qn || 0) + 1;
    app.innerHTML = `<div class="qtop"><button class="x" id="qx" aria-label="خروج">✕</button><div class="pbar"><i style="width:${Math.round(S.i / S.items.length * 100)}%"></i></div><span class="fe">🪶 ${num(ST.fe)}</span></div>
      <p class="qins"><button id="qsay" aria-label="اسمع السؤال">🔊</button><span>${INS[q.type][1]}</span></p><div id="qb"></div>`;
    app.querySelector('#qx').onclick = () => { sfx('tap'); quit(); };
    app.querySelector('#qsay').onclick = () => VO.say({ a: INS[q.type][0] });
    const intro = S.heard[q.type] || o.quick ? [] : [{ a: INS[q.type][0] }, 250];
    S.heard[q.type] = true;
    let answered = false;
    const body = app.querySelector('#qb');
    TYPES[q.type](q, body, intro, (ok, x = {}) => { if (answered || S.over) return; answered = true; respond(q, ok, x); });
    if (o.dunno && !['sp', 'ord', 'say'].includes(q.type)) {
      const d = document.createElement('button'); d.className = 'btn soft small'; d.style.marginTop = '14px'; d.textContent = '🤷 لا أعرف';
      d.onclick = () => { if (answered) return; answered = true; sfx('tap'); const r = body.querySelector('.opt[data-right]'); if (r) r.classList.add('ok'); respond(q, false, { silent: true, fast: true }); };
      body.appendChild(d);
    }
  };
  const done = (q, ok) => {
    if (S.over) return;
    S.res.push({ w: q.w, type: q.type, ok, retry: !!q.retry });
    if (o.onAnswer) o.onAnswer(q, ok);
    const st = today(); if (!q.retry && o.mode !== 'place') { st.q++; if (ok) st.c++; }
    if (!ok && o.requeue && !S.again.has(q.w.k)) { S.again.add(q.w.k); S.items.push({ w: q.w, type: easyType(q.w), retry: true }); }
    save(); S.i++; next();
  };
  const respond = (q, ok, x) => {
    const opts = app.querySelector('#qb .opts'); if (opts) opts.classList.add('locked');
    if (ok) {
      sfx('ok'); S.run++;
      if (x.el) { x.el.classList.add('ok'); const r = x.el.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + r.height / 2); }
      if (!x.silent && o.mode !== 'place') addFeathers(1, x.el || app.querySelector('#qb'));
      const lines = [...(x.say || [])];
      if (!o.quick && S.run % 3 === 0) lines.push(200, praise());
      Promise.all([VO.say(lines), wait(o.quick ? 550 : 900)]).then(() => done(q, true));
      return;
    }
    sfx('no'); S.run = 0;
    if (x.el) { x.el.classList.add('bad'); x.el.classList.remove('shake'); void x.el.offsetWidth; x.el.classList.add('shake'); }
    if (x.right) x.right.classList.add('ok');
    app.querySelectorAll('#qb .cap').forEach(c => { c.hidden = false; });
    if (o.quick || x.fast) { setTimeout(() => done(q, false), 1100); return; }
    const w = q.w, fb = document.createElement('div');
    fb.innerHTML = `<div class="feedback bad"><span>الإجابة الصحيحة:</span> <b class="en">${esc(w.en)}</b> <span class="muted">${esc(w.ar)}</span></div>
      <div class="qfoot"><button class="btn" id="cont">متابعة ◀︎</button></div>`;
    app.querySelector('#qb').appendChild(fb);
    VO.say([...(x.say || [w.en]), 250, x.sayAr || { r: w.ar }]);
    fb.querySelector('#cont').onclick = () => { sfx('tap'); done(q, false); };
    fb.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'nearest' });
  };
  next();
}
/* options: tap one; cb(ok, el, rightEl) */
function bindOpts(body, opts, target, cb) {
  body.querySelectorAll('.opt[data-i]').forEach(el => el.addEventListener('click', () => {
    if (el.closest('.opts').classList.contains('locked')) return;
    cb(opts[+el.dataset.i] === target, el, body.querySelector('.opt[data-right]'));
  }));
}
const optWords = (opts, w) => `<div class="opts ${opts.some(x => x.en.length > 11) ? '' : 'g2'}">${opts.map((x, i) => `<button class="opt en" data-i="${i}"${x === w ? ' data-right' : ''}>${esc(x.en)}</button>`).join('')}</div>`;
const optPics = (opts, w) => `<div class="opts g2">${opts.map((x, i) => `<button class="opt picopt" data-i="${i}"${x === w ? ' data-right' : ''} aria-label="صورة">${pic(x)}<span class="cap" hidden>${esc(x.en)}</span></button>`).join('')}</div>`;
function blanked(ex, en) {
  const re = new RegExp('(^|[^A-Za-z])(' + en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?=[^A-Za-z]|$)', 'i'), m = re.exec(ex);
  if (!m) return esc(ex);
  const at = m.index + m[1].length;
  return esc(ex.slice(0, at)) + '<span class="blank">&nbsp;</span>' + esc(ex.slice(at + m[2].length));
}
const TYPES = {
  lp(q, body, intro, R) {
    const opts = mix([q.w, ...others(q.w, 3, 'pic')]);
    body.innerHTML = `<div class="prompt"><button class="spkbig" id="spk" aria-label="اسمع الكلمة">🔊</button></div>${optPics(opts, q.w)}`;
    VO.say([...intro, q.w.en]);
    body.querySelector('#spk').onclick = () => VO.say(q.w.en);
    bindOpts(body, opts, q.w, (ok, el, right) => R(ok, { el, right, say: ok ? [] : [q.w.en] }));
  },
  wp(q, body, intro, R) {
    const opts = mix([q.w, ...others(q.w, 3, 'pic')]);
    body.innerHTML = `<div class="prompt"><div class="wbig en">${esc(q.w.en)}</div></div>${optPics(opts, q.w)}`;
    VO.say(intro);
    bindOpts(body, opts, q.w, (ok, el, right) => R(ok, { el, right, say: [q.w.en] }));
  },
  pw(q, body, intro, R) {
    const opts = mix([q.w, ...others(q.w, 3, 'en')]);
    body.innerHTML = `<div class="prompt">${pic(q.w)}</div>${optWords(opts, q.w)}`;
    VO.say(intro);
    bindOpts(body, opts, q.w, (ok, el, right) => R(ok, { el, right, say: [q.w.en] }));
  },
  aw(q, body, intro, R) {
    const opts = mix([q.w, ...others(q.w, 3, 'en')]);
    body.innerHTML = `<div class="prompt"><div class="arbig">${esc(q.w.ar)}</div><button class="tbtn" id="hear">🔊 اسمع</button></div>${optWords(opts, q.w)}`;
    VO.say([...intro, { r: q.w.ar }]);
    body.querySelector('#hear').onclick = () => VO.say({ r: q.w.ar });
    bindOpts(body, opts, q.w, (ok, el, right) => R(ok, { el, right, say: [q.w.en] }));
  },
  wa(q, body, intro, R) {
    const opts = mix([q.w, ...others(q.w, 3, 'ar')]);
    const long = q.w.en.length > 14;
    body.innerHTML = `<div class="prompt"><div class="wbig en" style="${long ? 'font-size:26px' : ''}">${esc(q.w.en)}</div><button class="tbtn" id="hear">🔊 اسمع</button></div>
      <div class="opts${opts.some(x => x.ar.length > 14) ? '' : ' g2'}">${opts.map((x, i) => `<button class="opt" data-i="${i}"${x === q.w ? ' data-right' : ''}>${esc(x.ar)}</button>`).join('')}</div>`;
    VO.say([...intro, q.w.en]);
    body.querySelector('#hear').onclick = () => VO.say(q.w.en);
    bindOpts(body, opts, q.w, (ok, el, right) => R(ok, { el, right, say: ok ? [q.w.en, 250, { r: q.w.ar }] : [q.w.en] }));
  },
  gap(q, body, intro, R) {
    const w = q.w, opts = mix([w, ...(w.gx ? w.gx.map(k => BYK[k]).filter(Boolean) : others(w, 3, 'gap'))]);
    body.innerHTML = `<div class="prompt">${weak(w) || q.mode === 'review' ? '' : `<span style="--ps:56px">${pic(w)}</span>`}<div class="gapline en" id="gl">${blanked(w.ex, w.en)}</div>
      ${ST.set.arHide ? '' : `<div class="muted small">${esc(w.exAr)}</div>`}</div>${optWords(opts, w)}`;
    VO.say(intro);
    bindOpts(body, opts, w, (ok, el, right) => { body.querySelector('#gl').innerHTML = markWord(w.ex, w.en); R(ok, { el, right, say: [w.ex], sayAr: { r: w.exAr } }); });
  },
  tf(q, body, intro, R) {
    const w = q.w, yes = Math.random() < .5, shown = yes ? w : (others(w, 1, 'pic')[0] || w), truth = shown === w;
    body.innerHTML = `<div class="prompt">${pic(w)}<div class="wbig en" style="font-size:32px">${esc(shown.en)}</div><button class="tbtn" id="hear">🔊 اسمع</button></div>
      <div class="opts tf"><button class="opt" data-v="1"${truth ? ' data-right' : ''}>✓ صح</button><button class="opt" data-v="0"${truth ? '' : ' data-right'}>✗ خطأ</button></div>`;
    VO.say([...intro, shown.en]);
    body.querySelector('#hear').onclick = () => VO.say(shown.en);
    body.querySelectorAll('.opt').forEach(el => el.addEventListener('click', () => {
      if (el.closest('.opts').classList.contains('locked')) return;
      const ok = (el.dataset.v === '1') === truth;
      R(ok, { el, right: body.querySelector('.opt[data-right]'), say: truth ? [] : [w.en] });
    }));
  },
  sp(q, body, intro, R) {
    const w = q.w, chars = [...w.en], isL = c => /[A-Za-z]/.test(c), at = chars.map((c, i) => isL(c) ? i : -1).filter(i => i >= 0);
    const need = at.map(i => chars[i]), extra = q.mode === 'review' ? 2 : q.mode === 'game' ? 1 : 0;
    const abc = 'abcdefghijklmnoprstuwy'.split('').filter(c => !need.some(x => x.toLowerCase() === c));
    let pool = mix([...need, ...mix(abc).slice(0, extra)]);
    if (pool.join('') === need.join('') && pool.length > 1) pool = [...pool.slice(1), pool[0]];
    body.innerHTML = `<div class="prompt">${pic(w)}<div style="font-size:21px;font-weight:800">${esc(w.ar)}</div><button class="tbtn" id="hear">🔊 اسمع</button></div>
      <div class="slots">${chars.map((c, i) => isL(c) ? `<span class="slot" data-s="${i}"></span>` : `<span class="slot sp">${c === ' ' ? '' : esc(c)}</span>`).join('')}</div>
      <div class="tiles">${pool.map((c, i) => `<button class="tile" data-t="${i}">${esc(c)}</button>`).join('')}</div>
      <div class="row qfoot"><button class="btn soft small" id="hint">💡 ساعدني بحرف</button></div>`;
    VO.say([...intro, { r: w.ar }, 300, w.en]);
    body.querySelector('#hear').onclick = () => VO.say(w.en);
    body.dataset.w = w.en; // for the test bot (tools/falcon-play.js)
    let pos = 0, miss = 0;
    const fill = tile => {
      const slot = body.querySelector(`.slot[data-s="${at[pos]}"]`); slot.textContent = chars[at[pos]]; slot.classList.add('f', 'pop');
      tile.classList.add('used'); pos++;
      if (pos === at.length) { body.querySelector('#hint').disabled = true; R(miss <= 1, { el: null, say: [w.en] }); }
    };
    body.querySelectorAll('.tile').forEach(tile => tile.addEventListener('click', () => {
      if (pos >= at.length || tile.classList.contains('used')) return;
      if (pool[+tile.dataset.t].toLowerCase() === chars[at[pos]].toLowerCase()) { sfx('tap'); fill(tile); }
      else { miss++; sfx('no'); tile.classList.remove('shake'); void tile.offsetWidth; tile.classList.add('shake'); }
    }));
    body.querySelector('#hint').onclick = () => {
      if (pos >= at.length) return;
      const t = Array.from(body.querySelectorAll('.tile:not(.used)')).find(x => pool[+x.dataset.t].toLowerCase() === chars[at[pos]].toLowerCase());
      if (t) { miss++; sfx('tap'); fill(t); }
    };
  },
  ord(q, body, intro, R) {
    const w = q.w, text = q.text || w.en, toks = text.split(' ');
    let pool = mix(toks.map((t, i) => ({ t, i })));
    if (pool.every((p, i) => p.t === toks[i]) && pool.length > 1) pool = [...pool.slice(1), pool[0]];
    body.innerHTML = `<div class="prompt"><div style="font-size:22px;font-weight:800">${esc(q.textAr || w.ar)}</div>${isPhrase(w) && !q.text ? `<div class="sit">🗣️ ${esc(w.exAr)}</div>` : ''}</div>
      <div class="built" id="built"></div><div class="tiles">${pool.map((p, i) => `<button class="tile w" data-t="${i}">${esc(p.t)}</button>`).join('')}</div>`;
    VO.say([...intro, { r: q.textAr || w.ar }]);
    body.dataset.w = text; // for the test bot
    let pos = 0, miss = 0;
    body.querySelectorAll('.tile').forEach(tile => tile.addEventListener('click', () => {
      if (pos >= toks.length || tile.classList.contains('used')) return;
      if (pool[+tile.dataset.t].t === toks[pos]) {
        sfx('tap'); tile.classList.add('used'); const s = document.createElement('span'); s.textContent = toks[pos]; body.querySelector('#built').appendChild(s); pos++;
        if (pos === toks.length) R(miss <= 1, { say: [text] });
      } else { miss++; sfx('no'); tile.classList.remove('shake'); void tile.offsetWidth; tile.classList.add('shake'); }
    }));
  },
  sit(q, body, intro, R) {
    const opts = mix([q.w, ...others(q.w, 2, 'en')]);
    body.innerHTML = `<div class="prompt"><span class="pic emo" style="--ps:54px">${q.w.pic}</span><div style="font-size:22px;font-weight:800">${esc(q.w.exAr)}</div></div>${optWords(opts, q.w)}`;
    VO.say([...intro, { r: q.w.exAr }]);
    bindOpts(body, opts, q.w, (ok, el, right) => R(ok, { el, right, say: [q.w.en] }));
  },
  say(q, body, intro, R) {
    const w = q.w;
    body.innerHTML = `<div class="prompt">${pic(w)}<div class="wbig en">${esc(w.en)}</div><button class="tbtn" id="hear">🔊 اسمع أولًا</button></div>
      <button class="micbtn" id="mic" aria-label="اضغط وتكلم">🎤</button><div class="heard" id="heard">اضغط على الميكروفون وقل الكلمة</div>
      <div class="row qfoot"><button class="btn soft small" id="skip">⏭ تخطَّ</button><button class="btn soft small" id="self" hidden>✓ قلتها</button></div>`;
    VO.say([...intro, w.en]);
    body.querySelector('#hear').onclick = () => VO.say(w.en);
    let tries = 0;
    body.querySelector('#skip').onclick = () => { sfx('tap'); R(true, { silent: true }); };
    body.querySelector('#self').onclick = () => { sfx('tap'); R(true, { silent: true }); };
    body.querySelector('#mic').onclick = async () => {
      const b = body.querySelector('#mic'), out = body.querySelector('#heard');
      VO.stop(); b.classList.add('on'); out.textContent = '… أستمع';
      const r = await listen(); b.classList.remove('on');
      if (r.err) { out.textContent = r.msg; body.querySelector('#self').hidden = false; return; }
      if (heardIt(r.alts, w.en)) { out.innerHTML = `<span class="en">${esc(r.alts[0] || w.en)}</span> ✅`; R(true, { el: b }); return; }
      tries++; out.innerHTML = r.alts.length ? `سمعت: <span class="en">${esc(r.alts[0])}</span> · حاول مرة أخرى` : 'لم أسمع شيئًا، اقترب وتكلم بوضوح.';
      VO.say([{ a: 'again' }, 200, w.en]);
      if (tries >= 2) body.querySelector('#self').hidden = false;
    };
  },
};

/* ---------- the microphone: the browser's own speech recognition (no device voice is used) ---------- */
function listen() {
  return new Promise(res => {
    let r; try { r = new MIC(); } catch (e) { micBlocked = true; return res({ err: 1, msg: 'الميكروفون غير متاح هنا.' }); }
    r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 5; r.continuous = false;
    const alts = []; let fin = false, tm = 0;
    const end = x => { if (fin) return; fin = true; clearTimeout(tm); res(x || { alts }); };
    r.onresult = e => { for (let i = 0; i < e.results.length; i++) for (let j = 0; j < e.results[i].length; j++) alts.push(e.results[i][j].transcript); };
    r.onerror = e => { if (['not-allowed', 'service-not-allowed', 'audio-capture'].includes(e.error)) { micBlocked = true; end({ err: 1, msg: 'الميكروفون غير متاح هنا. اضغط «قلتها» بعد أن تنطقها.' }); } else end({ alts }); };
    r.onend = () => end({ alts });
    tm = setTimeout(() => { try { r.stop(); } catch (e) {} }, 6500);
    try { r.start(); } catch (e) { end({ err: 1, msg: 'تعذّر تشغيل الميكروفون.' }); }
  });
}
const normE = s => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z' ]+/g, ' ').replace(/\s+/g, ' ').trim();
function lev(a, b) { const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i]); for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[m][n]; }
function heardIt(alts, target) {
  const t = normE(target), tw = t.split(' ');
  return alts.some(a => { const x = normE(a); if ((' ' + x + ' ').includes(' ' + t + ' ')) return true;
    const xw = x.split(' '), hit = tw.filter(v => xw.some(y => y === v || (v.length >= 5 && lev(v, y) <= 1))).length;
    return hit / tw.length >= (tw.length > 2 ? .6 : 1); });
}
