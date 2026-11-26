/* صقر الكلمات — his plan from the level test (plan.js): today's plan, the spelling workshop and the rule of the day.
   Built after games.js by `python3 src/build.py falcon`. */

/* ---------- the plan: applied once in this browser, shown on the home screen and in the parents' corner ---------- */
function applyPlan() {
  if (typeof PLAN === 'undefined' || ST.plan === PLAN.id) return false;
  ST.plan = PLAN.id;
  if ((ST.set.start || 1) < PLAN.start) ST.set.start = PLAN.start;
  ST.set.big = PLAN.big; ST.alt = 1;   // the plan's first lesson is big words, which begin with the ones of his test
  save(); return true;
}
function planSteps() {
  const t = today();
  return [
    { id: 'lesson', ico: '📘', ar: 'درس جديد', done: t.l >= ST.set.goal || !nextLesson() },
    { id: 'spell', ico: '✏️', ar: 'الإملاء', done: (t.sp || 0) >= 1 },
    { id: 'rule', ico: '🧩', ar: 'قاعدة اليوم', done: (t.g || 0) >= 1 },
    { id: 'talk', ico: '🎤', ar: 'تحدّث', done: (t.tk || 0) >= 2 },
    { id: 'review', ico: '🔁', ar: 'المراجعة', done: dueWords().length === 0 },
  ];
}
function planCard() {
  const st = planSteps(), n = st.filter(s => s.done).length;
  return `<div class="card plan" style="margin-top:14px"><div class="today"><div class="ring" style="--p:${Math.round(n / st.length * 100)}"><span>${num(n)}/${num(st.length)}</span></div>
      <div class="t"><b>${n === st.length ? 'أنهيت خطة اليوم! 🌟' : 'خطة اليوم'}</b><span class="small muted">${n === st.length ? 'أنت بطل! عُد غدًا لخطة جديدة.' : 'نحو ٢٠ دقيقة. اضغط على أي خطوة.'}</span></div></div>
    <div class="steps">${st.map(s => `<button class="step${s.done ? ' done' : ''}" data-step="${s.id}"><span class="si">${s.done ? '✓' : s.ico}</span><span>${s.ar}</span></button>`).join('')}</div></div>`;
}
def('planHello', () => {
  app.innerHTML = `<div class="splash" style="min-height:auto;padding-top:18px"><div class="fbig" style="width:160px">${falcon({ mood: 'happy', pose: 'cheer' })}</div>
    <div class="bubble">${esc(AR_PLAIN('plan-1'))} ${esc(AR_PLAIN('plan-2'))}</div>
    <div class="card stack planlist">
      <div class="pl"><span>📘</span><div><b>درس جديد</b><small>درس من كلمات المستوى الرابع، ثم درس من «كلمات كبيرة»</small></div></div>
      <div class="pl"><span>✏️</span><div><b>ورشة الإملاء</b><small>٦ كلمات: تنظر إليها، ثم تكتبها من ذاكرتك</small></div></div>
      <div class="pl"><span>🧩</span><div><b>قاعدة اليوم</b><small>شرح قصير، ثم ثماني جمل تكملها</small></div></div>
      <div class="pl"><span>🎤</span><div><b>تحدّث</b><small>سؤالان كل يوم، وأجب بجملتين</small></div></div>
      <div class="pl"><span>🔁</span><div><b>المراجعة الذكية</b><small>حتى لا تنسى ما تعلمته</small></div></div></div>
    <button class="btn" id="go">هيا بنا! ◀︎</button></div>`;
  VO.say([{ a: 'plan-1' }, 300, { a: 'plan-2' }, 300, { a: 'plan-3' }]);
  on('#go', home);
});
function planParents() {
  if (typeof PLAN === 'undefined') return '';
  const spelled = WORDS.filter(spGood).length, B = TOPIC.big;
  return `<div class="sec">خطة اختبار المستوى <small>${esc(PLAN.day)}</small></div><div class="card stack planpar">
    <div><b>المستوى:</b> ${bidi(PLAN.level)}</div>
    <div class="stack" style="gap:6px">${PLAN.skills.map(([n, v]) => `<div><div class="row" style="justify-content:space-between"><span>${n}</span><span class="num">${num(v)}٪</span></div><div class="pbar${v >= 80 ? ' green' : ''}"><i style="width:${v}%"></i></div></div>`).join('')}
      ${PLAN.speak ? `<div class="small muted">${bidi(PLAN.speak)}</div>` : ''}</div>
    <div><b>أقوى ما عنده</b><ul>${PLAN.strong.map(x => `<li>${bidi(x)}</li>`).join('')}</ul></div>
    <div><b>ما نعمل عليه الآن</b><ul>${PLAN.needs.map(x => `<li>${bidi(x)}</li>`).join('')}</ul></div>
    <p class="small muted" style="margin:0">كل يوم نحو ٢٠ دقيقة: درس جديد (درس من كلمات المستوى الرابع ثم درس من «كلمات كبيرة»)، وورشة الإملاء، وقاعدة اليوم، وسؤالان في «تحدّث» يجيب عن كل منهما بجملتين، والمراجعة الذكية. أعيدوا اختبار المستوى بعد ستة أسابيع ليظهر تقدمه.</p>
    <div class="chips2"><span>✏️ يكتب ${num(spelled)} كلمة بلا خطأ</span><span>🧩 أتقن ${num(RULES.filter(ruleMastered).length)} من ${num(RULES.length)} قواعد</span><span>🦅 كلمات كبيرة ${num(topicLearned(B))}/${num(B.words.length)}</span></div>
    <div class="setrow"><span>الدروس الجديدة تبدأ من</span><div class="seg">${['الأساس', 'المستوى ٤', 'أبعد'].map((n, i) => `<button data-st="${i + 1}" class="${(ST.set.start || 1) === i + 1 ? 'on' : ''}">${n}</button>`).join('')}</div></div>
    <div class="setrow"><span>درس من «كلمات كبيرة» بعد كل درس</span><button class="switch${ST.set.big ? ' on' : ''}" data-s="big" aria-label="كلمات كبيرة"></button></div></div>`;
}

/* ---------- the spelling workshop: look at the word, cover it, write it, check it ----------
   Each word has its own spelling box (ST.sp): right the first time moves it on (back after 1, 3, 7, 14, 30 days),
   a mistake brings it back tomorrow. A new or missed word is shown first with its letter teams coloured;
   a word he has spelled before is written from memory. */
const SPGAP = [0, 1, 3, 7, 14, 30];
const TEAMS = ['tch', 'igh', 'sh', 'ch', 'th', 'ph', 'wh', 'ck', 'ng', 'qu', 'kn', 'wr', 'ee', 'oo', 'ea', 'ai', 'ay', 'oa', 'ow', 'ou', 'oi', 'oy', 'aw', 'ew', 'ue', 'ar', 'er', 'ir', 'or', 'ur'];
// the word cut into the letters that are written together (sh, ee, tt ...): [[from, length], ...]
function teams(word) {
  const lo = word.toLowerCase(), out = [];
  for (let i = 0; i < lo.length;) {
    let n = 1;
    if (/[a-z]/.test(lo[i])) {
      if (lo[i + 1] === lo[i] && /[bcdfgklmnprstz]/.test(lo[i])) n = 2;
      else { const t = TEAMS.find(x => lo.startsWith(x, i) && !(x === 'ng' && /[eiy]/.test(lo[i + 2] || ''))); if (t) n = t.length; }
    }
    out.push([i, n]); i += n;
  }
  return out;
}
const teamHTML = word => teams(word).map(([i, n]) => { const s = word.slice(i, i + n);
  return n > 1 ? `<b class="tm">${esc(s)}</b>` : /[A-Za-z]/.test(s) ? `<span>${esc(s)}</span>` : `<span class="nl">${s === ' ' ? '&nbsp;' : esc(s)}</span>`; }).join('');
const spOf = w => ST.sp && ST.sp[w.k];
const spGood = w => !!(spOf(w) && spOf(w).n >= 3);
const spDue = () => WORDS.filter(w => spOf(w) && spOf(w).d <= DAY()).length;
function spellRound(n = 6) {
  const D = DAY(), all = WORDS.filter(spellable), len = w => letters(w).length, bucket = w => len(w) <= 4 ? 0 : len(w) <= 6 ? 1 : 2;
  const due = all.filter(w => spOf(w) && spOf(w).d <= D).sort((a, b) => spOf(a).d - spOf(b).d || spOf(a).n - spOf(b).n);
  const first = (ST.plan && typeof PLAN !== 'undefined' ? PLAN.spell : []).map(k => BYK[k]).filter(w => w && !spOf(w));
  const learned = all.filter(w => !spOf(w) && isLearned(w) && !first.includes(w)).sort((a, b) => bucket(a) - bucket(b));
  const rest = all.filter(w => !spOf(w) && !isLearned(w) && !first.includes(w))
    .sort((a, b) => TOPIC[a.t].stage - TOPIC[b.t].stage || bucket(a) - bucket(b) || TOPIC[a.t].i - TOPIC[b.t].i);
  const out = due.slice(0, 4);
  for (const w of [...first, ...learned, ...rest]) { if (out.length >= n) break; out.push(w); }
  for (const w of due.slice(4)) { if (out.length >= n) break; out.push(w); }
  return out;
}
def('spell', () => {
  const list = spellRound();
  app.innerHTML = `<div class="splash"><div class="fbig" style="width:170px">${falcon({ mood: 'wow' })}</div>
    <div class="bubble">ورشة الإملاء ✏️ انظر إلى الكلمة جيدًا، ثم نخفيها، فتكتبها أنت بالحروف.</div>
    <div class="wlist">${list.map(w => `<span>${pic(w)}</span>`).join('')}</div>
    <button class="btn" id="st">ابدأ ◀︎</button><button class="btn soft" id="bk2" style="max-width:320px">رجوع</button></div>`;
  VO.say({ a: 'sp-intro' }); VO.pre(list.map(w => w.en));
  on('#st', () => spellRun(list)); on('#bk2', back);
});
function spellRun(list) {
  let k = 0, said = {}, over = false;
  const res = [];
  onLeave(() => { over = true; });
  const top = () => `<div class="qtop"><button class="x" id="qx" aria-label="خروج">✕</button><div class="pbar"><i style="width:${Math.round(k / list.length * 100)}%"></i></div><span class="fe">🪶 ${num(ST.fe)}</span></div>`;
  const bindTop = () => { $('#qx').onclick = () => { sfx('tap'); confirmSheet('هل تريد الخروج من الورشة؟', 'نعم، اخرج', 'أكمل', () => { over = true; back(); }); }; };
  const once = id => { if (said[id]) return []; said[id] = 1; return [{ a: id }, 250]; };
  const next = () => {
    if (over) return;
    if (k >= list.length) { over = true; return spellDone(res); }
    const w = list[k], s = spOf(w);
    app.dataset.qn = (+app.dataset.qn || 0) + 1;
    if (!s || s.n === 0) look(w); else build(w, 'memory');
  };
  const record = (w, firstTry) => {
    const s = ST.sp[w.k] || (ST.sp[w.k] = { n: 0, d: 0, x: 0 });
    if (firstTry) { s.n = Math.min(5, s.n + 1); ST.spN = (ST.spN || 0) + 1; } else { s.n = 0; s.x++; }
    s.d = DAY() + SPGAP[Math.max(1, s.n)]; s.l = DAY();
    res.push({ w, ok: firstTry }); const t = today(); t.q++; if (firstTry) t.c++;
    save();
  };
  // look: the word with its letter teams, its sound and its meaning
  const look = w => {
    app.innerHTML = top() + `<p class="qins"><button id="qsay" aria-label="اسمع">🔊</button><span>انظر إلى الكلمة، وإلى الحروف الملونة التي تأتي معًا.</span></p>
      <div class="card meet splook">${pic(w)}<div class="sword en">${teamHTML(w.en)}</div><button class="mean" id="mn">${esc(w.ar)}</button>
        <div class="tools"><button class="tbtn" id="hw">🔊 الكلمة</button></div></div>
      <div class="qfoot"><button class="btn" id="go">✏️ أخفِها، وسأكتبها ◀︎</button></div>`;
    bindTop();
    $('#qsay').onclick = () => VO.say({ a: 'sp-look' });
    $('#hw').onclick = () => VO.say(w.en);
    $('#mn').onclick = () => VO.say({ r: w.ar });
    $('.splook .pic').onclick = () => VO.say(w.en);
    VO.say([w.en, 300, { r: w.ar }, 400, ...once('sp-look'), w.en]);
    on('#go', () => build(w, 'look'));
  };
  // write: free tiles (two extra letters) and a check at the end; 'fix' is the guided second try after a mistake
  const build = (w, mode) => {
    if (over) return;
    const s = spOf(w), guided = mode === 'fix', chars = [...w.en], isL = c => /[A-Za-z]/.test(c);
    const at = chars.map((c, i) => isL(c) ? i : -1).filter(i => i >= 0), need = at.map(i => chars[i]);
    const abc = 'abcdefghijklmnoprstuwy'.split('').filter(c => !need.some(x => x.toLowerCase() === c));
    let pool = mix([...need, ...(guided ? [] : mix(abc).slice(0, 2))]);
    if (pool.join('') === need.join('') && pool.length > 1) pool = [...pool.slice(1), pool[0]];
    const showTeams = guided || !s || s.n < 2, long = need.length > 7;
    const slotsHTML = teams(w.en).map(([i, n]) => `<span class="grp${showTeams && n > 1 ? ' tm' : ''}">${chars.slice(i, i + n).map((c, j) =>
      isL(c) ? `<span class="slot" data-s="${i + j}"></span>` : `<span class="slot sp">${c === ' ' ? '' : esc(c)}</span>`).join('')}</span>`).join('');
    const ins = guided ? 'اكتبها مرة أخرى، حرفًا حرفًا.' : mode === 'memory' ? 'هل تتذكرها؟ اكتبها من ذاكرتك.' : 'الآن اكتب الكلمة بالحروف.';
    app.innerHTML = top() + `<p class="qins"><button id="qsay" aria-label="اسمع">🔊</button><span>${ins}</span></p>
      <div class="prompt">${pic(w)}<div style="font-size:21px;font-weight:800">${esc(w.ar)}</div><button class="tbtn" id="hear">🔊 اسمع</button></div>
      <div class="slots spslots${long ? ' long' : ''}">${slotsHTML}</div>
      <div class="tiles${long ? ' long' : ''}">${pool.map((c, i) => `<button class="tile" data-t="${i}">${esc(c)}</button>`).join('')}</div>
      <div class="row qfoot"><button class="btn soft small" id="hint">💡 ساعدني بحرف</button></div>`;
    bindTop();
    body().dataset.w = w.en; // for the test bot
    $('#qsay').onclick = () => VO.say({ a: guided ? 'sp-fix' : mode === 'memory' ? 'sp-memory' : 'sp-build' });
    $('#hear').onclick = () => VO.say(w.en);
    VO.say([...(guided ? [] : once(mode === 'memory' ? 'sp-memory' : 'sp-build')), ...(mode === 'memory' ? [{ r: w.ar }, 300] : []), w.en]);
    const fill = {}, slots = $$('.spslots .slot[data-s]'), order = slots.map(el => +el.dataset.s);
    let hinted = false, done = false;
    const used = () => Object.values(fill);
    const draw = () => {
      slots.forEach(el => { const t = fill[el.dataset.s]; el.textContent = t == null ? '' : pool[t]; el.classList.toggle('f', t != null); });
      $$('.tiles .tile').forEach(b => b.classList.toggle('used', used().includes(+b.dataset.t)));
    };
    const firstEmpty = () => order.find(i => fill[i] == null);
    const place = (pos, t) => { fill[pos] = t; draw(); const el = slots.find(x => +x.dataset.s === pos); el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); if (order.every(i => fill[i] != null)) setTimeout(check, 250); };
    $$('.tiles .tile').forEach(b => b.addEventListener('click', () => {
      const t = +b.dataset.t, pos = firstEmpty();
      if (done || over || used().includes(t) || pos == null) return;
      if (guided && pool[t].toLowerCase() !== chars[pos].toLowerCase()) { sfx('no'); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); return; }
      sfx('tap'); place(pos, t);
    }));
    slots.forEach(el => el.addEventListener('click', () => { const i = +el.dataset.s; if (done || over || guided || fill[i] == null) return; sfx('tap'); delete fill[i]; draw(); }));
    $('#hint').onclick = () => {
      if (done || over) return;
      const pos = order.find(i => fill[i] == null || pool[fill[i]].toLowerCase() !== chars[i].toLowerCase());
      if (pos == null) return;
      const want = chars[pos].toLowerCase();
      let t = pool.findIndex((c, j) => c.toLowerCase() === want && !used().includes(j));
      if (t < 0) { const from = order.find(i => i !== pos && fill[i] != null && pool[fill[i]].toLowerCase() === want && pool[fill[i]].toLowerCase() !== chars[i].toLowerCase()); if (from == null) return; t = fill[from]; delete fill[from]; }
      hinted = true; sfx('tap'); place(pos, t); slots.find(x => +x.dataset.s === pos).classList.add('hinted');
    };
    const check = () => {
      if (done || over) return; done = true;
      const bad = order.filter(i => pool[fill[i]].toLowerCase() !== chars[i].toLowerCase());
      slots.forEach(el => el.classList.add(bad.includes(+el.dataset.s) ? 'bad' : 'good'));
      $('#hint').disabled = true;
      if (!bad.length) {
        const first = !hinted && !guided;
        if (mode !== 'fix') record(w, first);
        sfx('ok'); const r = $('.spslots').getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + r.height / 2);
        if (first) addFeathers(2, $('.spslots'));
        Promise.all([VO.say(first ? [w.en, 200, praise()] : [w.en]), wait(1100)]).then(() => { if (over) return; k++; next(); });
        return;
      }
      record(w, false); sfx('no');
      const tried = order.map(i => `<span class="${bad.includes(i) ? 'x' : ''}">${esc(pool[fill[i]])}</span>`).join('');
      setTimeout(() => { if (over) return;
        app.querySelector('.row.qfoot').outerHTML = `<div class="card spfix"><div class="small muted">كتبتَ:</div><div class="sword small en">${tried}</div>
          <div class="small muted">والصحيح:</div><div class="sword en">${teamHTML(w.en)}</div></div><div class="qfoot"><button class="btn" id="again">✏️ اكتبها مرة أخرى ◀︎</button></div>`;
        VO.say([{ a: 'sp-fix' }, 250, w.en]);
        on('#again', () => build(w, 'fix'));
        app.querySelector('.spfix').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'nearest' });
      }, 900);
    };
  };
  const body = () => app;
  next();
}
function spellDone(res) {
  const ok = res.filter(r => r.ok).length, fe = 3;
  ST.fe += fe; const t = today(); t.sp = (t.sp || 0) + 1; save();
  const streakUp = touchStreak();
  app.innerHTML = `<div class="result"><div class="fres hop">${falcon({ mood: 'happy', pose: 'cheer' })}</div><h2>أنهيت ورشة الإملاء!</h2>
    <div class="bigstars">${Array.from({ length: 3 }, (_, j) => j < (ok >= res.length - 1 ? 3 : ok >= res.length / 2 ? 2 : 1) ? '★' : '<span class="off">★</span>').join('')}</div>
    <div class="gain"><span>✏️ ${num(ok)} من ${num(res.length)} من أول مرة</span><span>🪶 +${num(fe + ok * 2)}</span>${streakUp ? `<span>🔥 ${num(streakNow())}</span>` : ''}</div>
    <div class="wlist">${res.map(r => `<span class="${r.ok ? '' : 'again'}">${pic(r.w)}${esc(r.w.en)} ${r.ok ? '✓' : '🔁'}</span>`).join('')}</div>
    <p class="muted small" style="margin:0">${res.some(r => !r.ok) ? 'الكلمات التي عليها 🔁 تعود غدًا لتكتبها مرة أخرى.' : 'رائع! ستعود الكلمات بعد أيام لتتأكد أنك ما زلت تتذكرها.'}</p>
    <div class="stack" style="width:100%"><button class="btn" id="more">✏️ ٦ كلمات أخرى</button><button class="btn soft" id="hm">🏠 الرئيسية</button></div></div>`;
  FX.confetti(); sfx('win');
  celebrate([{ a: 'sp-done' }]);
  on('#more', () => { clean(); cur = { name: 'spell' }; render(); });
  on('#hm', home);
}

/* ---------- the rule of the day: a short explanation (Hamed and Ollie), then 8 sentences to complete ----------
   A rule is learned after two rounds with at most one mistake, on two different days. */
const grOf = r => ST.gr[r.id] || (ST.gr[r.id] = { d: [], best: 0, n: 0, last: -1 });
const ruleMastered = r => !!(ST.gr && ST.gr[r.id] && ST.gr[r.id].d.length >= 2);
function ruleOfDay() {
  const left = RULES.filter(r => !ruleMastered(r));
  return left.length ? left[0] : RULES.slice().sort((a, b) => grOf(a).last - grOf(b).last)[0];
}
// English words to light up; 'like+s' lights up likes and shows the added s in its own colour
const hlHTML = (text, hl) => text.split(/([A-Za-z']+)/).map(t => { const h = (hl || []).find(x => x.replace('+', '') === t);
  if (!h) return esc(t); const [base, add] = h.split('+'); return `<span class="mark">${esc(base)}${add ? `<b class="sfx">${esc(add)}</b>` : ''}</span>`; }).join('');
// Arabic text with English words in it: each English run is isolated so it keeps its place in the sentence
const bidi = s => String(s).split(/([A-Za-z][A-Za-z0-9 '’\/.-]*[A-Za-z0-9]|[A-Za-z])/).map((p, i) => i % 2 ? `<span class="en nb">${esc(p)}</span>` : esc(p)).join('');
def('rules', () => {
  const R = ruleOfDay();
  app.innerHTML = bar('القواعد') + `<p class="center muted small" style="margin-top:0">خمس قواعد اختارها شاهين من اختبار المستوى. تتقن القاعدة بجولتين ممتازتين في يومين.</p>
    <div class="stack">${RULES.map((r, i) => { const g = ST.gr[r.id], m = ruleMastered(r);
      return `<button class="lcard${r === R ? ' today-rule' : ''}" data-r="${r.id}"><span class="ln" style="background:${m ? 'var(--ok)' : '#6366f1'}">${m ? '✓' : r.icon}</span>
        <span class="lx"><b>${bidi(r.ar)}</b><span class="en small muted">${esc(r.en)}</span></span>${r === R && !m ? '<span class="chip today">اليوم</span>' : starsHTML(g ? Math.min(2, g.d.length) : 0, 2)}</button>`; }).join('')}</div>`;
  bindBar(); VO.say({ a: 'rules' });
  on('[data-r]', el => go('rule', el.dataset.r));
});
def('rule', id => {
  const r = RULES.find(x => x.id === id) || ruleOfDay();
  const part = (p, i) => p.a ? `<p class="rp ar" data-p="${i}">${esc(AR_PLAIN(p.a))}</p>`
    : p.e ? `<p class="rp en ex" data-p="${i}"><button class="rsay" aria-label="اسمع">🔊</button><span class="t">${hlHTML(p.e, p.hl)}</span></p>`
    : `<p class="rp en wrong" data-p="${i}"><span>✗</span> <s>${esc(p.x)}</s></p>`;
  app.innerHTML = bar(bidi(r.ar), { right: `<button class="ib" id="all" aria-label="كل القواعد">📋</button>` }) + `<div class="card rulecard">
      <div class="rhead"><span class="ricon">${r.icon}</span><div><b>${bidi(r.ar)}</b><div class="en muted">${esc(r.en)}</div></div></div>
      <div class="rparts">${r.parts.map(part).join('')}</div>
      <div class="tools"><button class="tbtn" id="again">🔊 أعد الشرح</button></div></div>
    <div class="qfoot"><button class="btn" id="go">🧩 هيا نتدرب ◀︎</button></div>`;
  bindBar();
  let run = 0;
  const here = cur, els = $$('.rparts [data-p]');
  const play = async () => {
    const me = ++run; els.forEach(el => el.classList.remove('on'));
    if (!grOf(r).n) { await VO.say({ a: 'rule-intro' }); }
    for (let i = 0; i < r.parts.length; i++) {
      if (me !== run || cur !== here) return;
      const p = r.parts[i]; els[i].classList.add('on');
      if (p.a) await VO.say({ a: p.a }); else if (p.e) await VO.say(p.e); else await wait(800);
      await wait(200);
    }
  };
  onLeave(() => { run++; });
  play();
  on('#again', () => play());
  on('#all', () => go('rules'));
  $$('.rparts .ex').forEach(el => { const i = +el.dataset.p; el.querySelector('.rsay').onclick = () => { run++; VO.say(r.parts[i].e); }; });
  on('#go', () => { run++; VO.stop(); ruleQuiz(r); });
});
function ruleQuiz(r) {
  const qs = mix(r.qs); let k = 0, right = 0, over = false;
  onLeave(() => { over = true; });
  const next = () => {
    if (over) return;
    if (k >= qs.length) { over = true; return ruleDone(r, right, qs.length); }
    const q = qs[k], opts = mix([q.ans, ...q.wrong]);
    app.dataset.qn = (+app.dataset.qn || 0) + 1;
    app.innerHTML = `<div class="qtop"><button class="x" id="qx" aria-label="خروج">✕</button><div class="pbar"><i style="width:${Math.round(k / qs.length * 100)}%"></i></div><span class="fe">🪶 ${num(ST.fe)}</span></div>
      <p class="qins"><button id="qsay" aria-label="اسمع السؤال">🔊</button><span>اختر الكلمة التي تكمل الجملة.</span></p>
      <div class="prompt"><span class="rchip">${r.icon} ${bidi(r.ar)}</span><div class="gapline en" id="gl">${esc(q.text).replace('___', '<span class="blank">&nbsp;</span>')}</div></div>
      <div class="opts">${opts.map((o, i) => `<button class="opt en" data-i="${i}"${o === q.ans ? ' data-right' : ''}>${esc(o)}</button>`).join('')}</div><div id="fb"></div>`;
    $('#qx').onclick = () => { sfx('tap'); confirmSheet('هل تريد الخروج؟', 'نعم، اخرج', 'أكمل', () => { over = true; back(); }); };
    $('#qsay').onclick = () => VO.say({ a: 'q-gap' });
    if (k === 0) VO.say({ a: 'q-gap' });
    let answered = false;
    $$('.opt').forEach(el => el.addEventListener('click', () => {
      if (answered || over) return; answered = true;
      const ok = opts[+el.dataset.i] === q.ans, rt = $('.opt[data-right]');
      $('.opts').classList.add('locked');
      $('#gl').innerHTML = esc(q.text).replace('___', `<span class="mark">${esc(q.ans)}</span>`);
      if (ok) {
        right++; sfx('ok'); el.classList.add('ok'); const b = el.getBoundingClientRect(); FX.burst(b.left + b.width / 2, b.top + b.height / 2); addFeathers(1, el);
        Promise.all([VO.say(q.full), wait(1000)]).then(() => { if (!over) { k++; next(); } });
        return;
      }
      sfx('no'); el.classList.add('bad', 'shake'); rt.classList.add('ok');
      $('#fb').innerHTML = `<div class="feedback bad"><span>الصحيح:</span> <b class="en">${esc(q.full)}</b></div><div class="qfoot"><button class="btn" id="cont">متابعة ◀︎</button></div>`;
      VO.say(q.full);
      $('#cont').onclick = () => { sfx('tap'); k++; next(); };
      $('#fb').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'nearest' });
    }));
  };
  next();
}
function ruleDone(r, right, n) {
  const g = grOf(r), D = DAY(), great = right >= n - 1, before = ruleMastered(r);
  g.n++; g.best = Math.max(g.best, right); g.last = D;
  if (great && !g.d.includes(D)) g.d.push(D);
  const mastered = !before && ruleMastered(r), t = today(); t.g = (t.g || 0) + 1;
  const fe = 3, stars = great ? 3 : right >= n - 3 ? 2 : 1; ST.fe += fe; save();
  const streakUp = touchStreak();
  const msg = mastered ? 'أتقنت هذه القاعدة! 🎉' : great ? (g.d.length < 2 ? 'ممتاز! جولة ممتازة أخرى في يوم آخر وتتقنها.' : 'ممتاز! ما زلت تتذكرها جيدًا.') : 'جيد! سنتدرب عليها مرة أخرى حتى تتقنها.';
  app.innerHTML = `<div class="result"><div class="fres hop">${falcon({ mood: 'happy', pose: 'cheer' })}</div><h2>${bidi(r.ar)}</h2>
    <div class="bigstars">${Array.from({ length: 3 }, (_, j) => j < stars ? '★' : '<span class="off">★</span>').join('')}</div>
    <div class="gain"><span>✅ ${num(right)} من ${num(n)}</span><span>🪶 +${num(fe + right)}</span>${streakUp ? `<span>🔥 ${num(streakNow())}</span>` : ''}</div>
    <p style="margin:0;font-weight:800">${msg}</p>
    <div class="stack" style="width:100%"><button class="btn" id="again">🔁 تدرب مرة أخرى</button><button class="btn soft" id="all">🧩 كل القواعد</button><button class="btn soft" id="hm">🏠 الرئيسية</button></div></div>`;
  FX.confetti(); sfx('win');
  celebrate([{ a: mastered ? (RULES.some(x => !ruleMastered(x)) ? 'rule-master' : 'rule-great') : great ? 'rule-great' : 'rule-more' }]);
  on('#again', () => { clean(); cur = { name: 'rule', arg: r.id }; render(); });
  on('#all', () => { clean(); stack = [{ name: 'home' }]; cur = { name: 'rules' }; render(); });
  on('#hm', home);
}
