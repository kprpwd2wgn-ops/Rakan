/* صقر الكلمات — eight games with the words he has learned (the first topics' words until he has enough).
   Sacred words (mosque, Ramadan, Eid, pray, Quran) are kept out of the games. Sound effects are noise only. */
const GAMES = [
  { id: 'catch', ar: 'صيد الصقر', ico: '🦅', color: '#0ea5e9', sub: 'اسمع، والمس الصورة', line: 'g-catch' },
  { id: 'memory', ar: 'بطاقات الذاكرة', ico: '🧠', color: '#8b5cf6', sub: 'الصورة وكلمتها', line: 'g-memory' },
  { id: 'tower', ar: 'برج الحروف', ico: '🧱', color: '#f97316', sub: 'اكتب لتبني برجًا', line: 'g-tower' },
  { id: 'rush', ar: 'دقيقة التحدي', ico: '⏱️', color: '#e11d48', sub: 'أكبر عدد في دقيقة', line: 'g-rush' },
  { id: 'order', ar: 'رتّب الجملة', ico: '🧩', color: '#16a34a', sub: 'جمل الأمثلة', line: 'q-ord' },
  { id: 'odd', ar: 'الكلمة الدخيلة', ico: '🔎', color: '#0d9488', sub: 'أيها لا يناسب؟', line: 'g-odd' },
  { id: 'mystery', ar: 'الكلمة الغامضة', ico: '🕵️', color: '#7c3aed', sub: 'حرفًا حرفًا', line: 'g-mystery' },
  { id: 'tf', ar: 'صح أم خطأ', ico: '✅', color: '#d97706', sub: 'أجب بسرعة!', line: 'g-tf' },
];
function gamePool(needPic, filter = () => true) {
  const ok = w => !sacred(w) && !isPhrase(w) && (!needPic || !weak(w)) && filter(w);
  let ws = WORDS.filter(w => ok(w) && isLearned(w));
  if (ws.length < 10) ws = [...ws, ...mix(WORDS.filter(w => ok(w) && !isLearned(w) && TOPIC[w.t].stage === 1))].slice(0, Math.max(14, ws.length));
  return mix(ws);
}
/* wrong answers from the game's own pool (so they are words he knows), else from all words */
function gameOthers(w, pool, n, mode) {
  const out = [], fits = x => x !== w && !similar(x, w) && (mode !== 'pic' || (!weak(x) && x.pic !== w.pic)) && !out.some(y => similar(x, y) || y.pic === x.pic);
  for (const x of mix(pool)) { if (out.length >= n) break; if (fits(x)) out.push(x); }
  if (out.length < n) others(w, n - out.length, mode).forEach(x => { if (!out.includes(x)) out.push(x); });
  return out.slice(0, n);
}
def('games', () => {
  const n = WORDS.filter(isLearned).length;
  app.innerHTML = bar('الألعاب') + (n < 10 ? `<div class="card small muted" style="margin-bottom:12px">الألعاب تستعمل الكلمات التي تعلمتها. حتى تتعلم ١٠ كلمات ستلعب بكلمات المرحلة الأولى.</div>` : '') +
    `<div class="games">${GAMES.map(g => `<button class="gcard" data-g="${g.id}" style="background:${g.color}"><span>${g.ico}</span><b>${g.ar}</b><small>${g.sub}</small><small>أفضل نتيجة: ${num(ST.best[g.id] || 0)}</small></button>`).join('')}</div>`;
  bindBar(); VO.say({ a: 'games' });
  on('.gcard', el => go('game', el.dataset.g));
});
def('game', id => { const g = GAMES.find(x => x.id === id); GAME[id](g); });
function gameEnd(g, score, fe, extra = '') {
  ST.games++; const best = score > (ST.best[g.id] || 0); if (best) ST.best[g.id] = score; ST.fe += fe; save();
  app.innerHTML = `<div class="result"><div class="fres hop">${falcon({ mood: 'happy', pose: 'cheer' })}</div><h2>${best && score ? 'رقم قياسي جديد! 🏆' : 'أحسنت!'}</h2>
    <div class="gain"><span>النتيجة: ${num(score)}</span><span>🪶 +${num(fe)}</span><span>الأفضل: ${num(ST.best[g.id] || 0)}</span></div>${extra}
    <div class="stack" style="width:100%"><button class="btn" id="again">🔁 العب مرة أخرى</button><button class="btn soft" id="gl">🎮 الألعاب</button></div></div>`;
  FX.confetti(); sfx('win'); celebrate([praise()]);
  on('#again', () => { clean(); cur = { name: 'game', arg: g.id }; render(); });
  on('#gl', () => { clean(); cur = stack.pop() || { name: 'games' }; if (cur.name !== 'games') cur = { name: 'games' }; render(); });
}
const hud = (g, parts) => bar(g.ar) + `<div class="ghud">${parts}</div>`;
function startCard(g, how, fn) {
  app.innerHTML = bar(g.ar) + `<div class="splash" style="min-height:auto;padding-top:20px"><div style="font-size:70px;font-family:var(--emo)">${g.ico}</div><div class="bubble">${how}</div>
    <div class="fbig" style="width:150px">${falcon({ mood: 'happy' })}</div><button class="btn" id="play">▶︎ ابدأ اللعب</button></div>`;
  bindBar(); VO.say({ a: g.line }); on('#play', fn);
}
const GAME = {
  /* the falcon catches the picture of the word he hears */
  catch(g) {
    startCard(g, 'اسمع الكلمة، والمس صورتها قبل أن تطير بعيدًا. لديك دقيقة واحدة!', () => {
      const pool = gamePool(true); let score = 0, left = 60, target = null, bubs = [], t0 = 0, raf = 0, round = 0, over = false;
      app.innerHTML = hud(g, `<span class="chipd">⭐ <b id="sc">٠</b></span><div class="timer"><i id="tm" style="width:100%"></i></div><button class="tbtn" id="rep">🔊</button>`) +
        `<div class="skybox" id="sky"><div class="gf" id="gf">${falcon({ pose: 'fly', mood: 'happy' })}</div></div>`;
      bindBar();
      const sky = $('#sky'), gf = $('#gf'), W = () => sky.clientWidth, H = () => sky.clientHeight;
      const perch = () => { gf.style.left = '8px'; gf.style.top = (H() - 118) + 'px'; };
      perch();
      const tick = setInterval(() => { if (over) return; left--; $('#tm').style.width = (left / 60 * 100) + '%'; if (left <= 0) end(); }, 1000);
      const end = () => { if (over) return; over = true; clearInterval(tick); cancelAnimationFrame(raf); VO.say({ a: 'time-up' }); setTimeout(() => gameEnd(g, score, Math.ceil(score / 15)), 900); };
      onLeave(() => { over = true; clearInterval(tick); cancelAnimationFrame(raf); });
      const newRound = () => {
        if (over) return; round++;
        bubs.forEach(b => b.el.remove()); bubs = [];
        target = pool[round % pool.length];
        const set = mix([target, ...gameOthers(target, pool, 2, 'pic')]), lanes = mix([.08, .33, .58]), speed = 70 + Math.min(110, score * 1.6);
        set.forEach((w, i) => {
          const el = document.createElement('button'); el.className = 'bub'; el.innerHTML = pic(w); el.setAttribute('aria-label', 'صورة');
          const b = { w, el, x: W() + 30 + i * 120, y: lanes[i] * (H() - 150) + 10, v: speed * (0.9 + Math.random() * .25) };
          el.style.transform = `translate(${b.x}px,${b.y}px)`; sky.appendChild(el); bubs.push(b);
          el.addEventListener('pointerdown', e => { e.preventDefault(); hit(b); });
        });
        t0 = performance.now(); VO.say(target.en);
      };
      const hit = b => {
        if (over || b.done) return;
        if (b.w === target) {
          b.done = true; b.el.classList.add('hit'); sfx('ok');
          const fast = performance.now() - t0 < 3000; score += fast ? 15 : 10; $('#sc').textContent = num(score);
          gf.style.left = (b.x - 10) + 'px'; gf.style.top = (b.y - 10) + 'px'; FX.burst(sky.getBoundingClientRect().left + b.x + 46, sky.getBoundingClientRect().top + b.y + 46);
          setTimeout(() => { perch(); newRound(); }, 420);
        } else { b.el.classList.add('miss', 'shake'); sfx('no'); VO.say(target.en); }
      };
      let last = performance.now();
      const loop = t => {
        if (over) return; const dt = Math.min(.05, (t - last) / 1000); last = t;
        for (const b of bubs) { if (b.done) continue; b.x -= b.v * dt; b.el.style.transform = `translate(${b.x}px,${b.y}px)`; }
        const tb = bubs.find(b => b.w === target);
        if (tb && !tb.done && tb.x < -100) { sfx('pop'); toast(`<span class="en">${esc(target.en)}</span> = ${esc(target.ar)}`, 1400); newRound(); }
        raf = requestAnimationFrame(loop);
      };
      $('#rep').onclick = () => target && VO.say(target.en);
      newRound(); raf = requestAnimationFrame(loop);
    });
  },
  /* pairs of a picture and its word */
  memory(g) {
    const ws = gamePool(true).slice(0, 6), cards = mix(ws.flatMap(w => [{ w, k: 'p' }, { w, k: 'e' }]));
    let open = [], moves = 0, got = 0, lock = false;
    app.innerHTML = hud(g, `<span class="chipd">🔁 <b id="mv">٠</b></span><span class="grow"></span><span class="chipd">✓ <b id="gt">٠</b>/٦</span>`) +
      `<div class="memgrid">${cards.map((c, i) => `<button class="mcard" data-i="${i}" aria-label="بطاقة"><span class="fc back">🪶</span><span class="fc front">${c.k === 'p' ? pic(c.w) : `<span class="en">${esc(c.w.en)}</span>`}</span></button>`).join('')}</div>`;
    bindBar(); VO.say({ a: g.line });
    $$('.mcard').forEach(el => el.addEventListener('click', () => {
      const c = cards[+el.dataset.i]; if (lock || el.classList.contains('up')) return;
      el.classList.add('up'); sfx('flip'); if (c.k === 'e') VO.say(c.w.en);
      open.push([el, c]);
      if (open.length === 2) {
        moves++; $('#mv').textContent = num(moves); const [[e1, c1], [e2, c2]] = open; open = [];
        if (c1.w === c2.w) { setTimeout(() => { e1.classList.add('got'); e2.classList.add('got'); sfx('ok'); VO.say(c1.w.en); got++; $('#gt').textContent = num(got);
            if (got === 6) setTimeout(() => { const stars = moves <= 9 ? 3 : moves <= 13 ? 2 : 1; gameEnd(g, Math.max(10, 100 - (moves - 6) * 7), stars * 3, `<div class="bigstars">${'★'.repeat(stars)}<span class="off">${'★'.repeat(3 - stars)}</span></div>`); }, 900); }, 350); }
        else { lock = true; setTimeout(() => { e1.classList.remove('up'); e2.classList.remove('up'); lock = false; }, 950); }
      }
    }));
  },
  /* spell words; each one adds a block to the tower */
  tower(g) {
    const ws = gamePool(false, w => spellable(w) && letters(w).length <= 9).slice(0, 8), cols = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
    let k = 0, blocks = [];
    const show = () => {
      if (k >= ws.length) return gameEnd(g, blocks.length, blocks.length * 2, `<div class="tower">${blocks.map(b => `<i style="width:${b[0]}px;background:${b[1]}"></i>`).join('')}<div class="ttop">${falcon({ mood: 'happy', pose: 'cheer' })}</div></div>`);
      app.innerHTML = hud(g, `<span class="chipd">🧱 <b>${num(blocks.length)}</b></span><span class="grow"></span><span class="chipd">${num(k + 1)}/${num(ws.length)}</span>`) +
        `<div class="row" style="align-items:flex-end;gap:14px"><div style="flex:0 0 96px"><div class="tower">${blocks.map(b => `<i style="width:${b[0]}px;background:${b[1]}"></i>`).join('')}<div class="ttop">${falcon({ mood: 'happy' })}</div></div></div>
          <div id="qb" style="flex:1;min-width:0"></div></div>`;
      bindBar();
      TYPES.sp({ w: ws[k], mode: 'game' }, $('#qb'), k === 0 ? [{ a: g.line }, 250] : [], ok => {
        if (ok) { blocks.push([50 + Math.min(40, letters(ws[k]).length * 5), cols[blocks.length % cols.length]]); sfx('ok'); FX.burst(innerWidth / 2, innerHeight / 3); } else sfx('pop');
        setTimeout(() => { k++; show(); }, 1100);
      });
    };
    show();
  },
  /* one minute: as many pictures as he can name */
  rush(g) {
    startCard(g, 'دقيقة واحدة! اختر اسم كل صورة بأسرع ما يمكن.', () => {
      const pool = gamePool(true); let score = 0, left = 60, k = 0, over = false;
      const tick = setInterval(() => { left--; const t = $('#tm'); if (t) t.style.width = (left / 60 * 100) + '%'; if (left <= 0) { over = true; clearInterval(tick); VO.say({ a: 'time-up' }); setTimeout(() => gameEnd(g, score, score), 800); } }, 1000);
      onLeave(() => { over = true; clearInterval(tick); });
      const show = () => {
        if (over) return; const w = pool[k++ % pool.length], opts = mix([w, ...gameOthers(w, pool, 2, 'en')]);
        app.innerHTML = hud(g, `<span class="chipd">⭐ <b>${num(score)}</b></span><div class="timer"><i id="tm" style="width:${left / 60 * 100}%"></i></div>`) +
          `<div class="prompt">${pic(w)}</div><div class="opts">${opts.map((x, i) => `<button class="opt en" data-i="${i}"${x === w ? ' data-right' : ''}>${esc(x.en)}</button>`).join('')}</div>`;
        bindBar();
        $$('.opt').forEach(el => el.addEventListener('click', () => {
          if (over || el.closest('.opts').classList.contains('locked')) return; el.closest('.opts').classList.add('locked');
          if (opts[+el.dataset.i] === w) { score++; el.classList.add('ok'); sfx('ok'); VO.say(w.en); setTimeout(show, 380); }
          else { el.classList.add('bad'); $('.opt[data-right]').classList.add('ok'); sfx('no'); VO.say(w.en); setTimeout(show, 1000); }
        }));
      };
      show();
    });
  },
  /* put the words of an example sentence in order */
  order(g) {
    const ws = gamePool(false, w => w.ex && w.ex.split(' ').length <= 9 && w.ex.split(' ').length >= 3).slice(0, 6);
    let k = 0, score = 0;
    const show = () => {
      if (k >= ws.length) return gameEnd(g, score, score * 2);
      app.innerHTML = hud(g, `<span class="chipd">⭐ <b>${num(score)}</b></span><span class="grow"></span><span class="chipd">${num(k + 1)}/${num(ws.length)}</span>`) + `<div id="qb"></div>`;
      bindBar();
      const w = ws[k];
      TYPES.ord({ w, text: w.ex, textAr: w.exAr }, $('#qb'), k === 0 ? [{ a: 'q-ord' }, 250] : [], ok => {
        if (ok) { score++; sfx('ok'); } else sfx('pop');
        VO.say(w.ex).then(() => setTimeout(() => { k++; show(); }, 400));
      });
    };
    show();
  },
  /* three pictures from one topic and one from another */
  odd(g) {
    const kinds = TOPICS.filter(t => t.stage <= 3 && t.id !== 'class' && t.words.filter(w => !weak(w) && !sacred(w)).length >= 4);
    const rounds = 8; let k = 0, score = 0;
    const show = () => {
      if (k >= rounds) return gameEnd(g, score, score);
      const learnedFirst = t => { const s = t.words.filter(w => !weak(w) && !sacred(w)); const l = s.filter(isLearned); return l.length >= 3 ? l : s; };
      const ranked = mix(kinds).sort((a, b) => topicLearned(b) - topicLearned(a)), A = ranked[k % Math.min(ranked.length, 10)], B = pick(kinds.filter(t => KIND[t.id] !== KIND[A.id]));
      const three = [];
      for (const w of mix(learnedFirst(A))) { if (three.length < 3 && !three.some(x => similar(x, w) || x.pic === w.pic)) three.push(w); }
      const oddW = pick(learnedFirst(B)), set = mix([...three, oddW]);
      app.innerHTML = hud(g, `<span class="chipd">⭐ <b>${num(score)}</b></span><span class="grow"></span><span class="chipd">${num(k + 1)}/${num(rounds)}</span>`) +
        `<p class="center" style="font-weight:800;margin:0 0 12px">أي صورة لا تنتمي إلى المجموعة؟</p>${optPics(set, oddW)}<div id="fb"></div>`;
      bindBar(); if (k === 0) VO.say({ a: g.line });
      $$('.opt').forEach(el => el.addEventListener('click', () => {
        const box = el.closest('.opts'); if (box.classList.contains('locked')) return; box.classList.add('locked');
        const ok = set[+el.dataset.i] === oddW; if (ok) { score++; el.classList.add('ok'); sfx('ok'); } else { el.classList.add('bad'); $('.opt[data-right]').classList.add('ok'); sfx('no'); }
        $$('.cap').forEach(c => { c.hidden = false; });
        $('#fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'bad'}">الثلاثة من «${esc(A.ar)}»، و<b class="en">${esc(oddW.en)}</b> من «${esc(B.ar)}».</div><div class="qfoot"><button class="btn" id="nx">التالي ◀︎</button></div>`;
        VO.say([oddW.en]);
        on('#nx', () => { k++; show(); });
      }));
    };
    show();
  },
  /* find the word letter by letter; the picture comes clear with each right letter */
  mystery(g) {
    const ws = gamePool(true, w => spellable(w) && !w.en.includes(' ') && letters(w).length <= 8).slice(0, 5);
    let k = 0, score = 0;
    const show = () => {
      if (k >= ws.length) return gameEnd(g, score, score * 3);
      const w = ws[k], word = w.en.toLowerCase(), found = new Set(), tried = new Set(); let lives = 6, finished = false;
      const draw = () => {
        const left = [...word].filter(c => /[a-z]/.test(c) && !found.has(c)).length, total = new Set([...word].filter(c => /[a-z]/.test(c))).size;
        app.innerHTML = hud(g, `<span class="chipd">⭐ <b>${num(score)}</b></span><span class="grow"></span><span class="lives">${Array.from({ length: 6 }, (_, i) => `<span class="${i < lives ? '' : 'lost'}">🪶</span>`).join('')}</span>`) +
          `<div class="prompt"><span class="mystpic" style="--bl:${finished ? 0 : Math.round(16 * (found.size / total < 1 ? 1 - found.size / total : 0))}px">${pic(w)}</span>
            <div class="slots">${[...word].map(c => /[a-z]/.test(c) ? `<span class="slot${found.has(c) || finished ? ' f' : ''}">${found.has(c) || finished ? c : ''}</span>` : `<span class="slot sp">${esc(c)}</span>`).join('')}</div>
            ${finished ? `<div style="font-weight:800">${esc(w.ar)}</div>` : ''}</div>
          ${finished ? `<button class="btn" id="nx">${k < ws.length - 1 ? 'الكلمة التالية ◀︎' : 'النتيجة ◀︎'}</button>` :
            `<div class="kb">${'abcdefghijklmnopqrstuvwxyz'.split('').map(c => `<button data-c="${c}" class="${tried.has(c) ? (word.includes(c) ? 'yes' : 'no') : ''}" ${tried.has(c) ? 'disabled' : ''}>${c}</button>`).join('')}</div>
            <div class="row qfoot"><button class="btn soft small" id="hear">🔊 اسمعها (تكلّف ريشة)</button></div>`}`;
        bindBar();
        on('#nx', () => { k++; show(); });
        on('#hear', () => { VO.say(w.en); lives--; if (lives <= 0) { finished = true; } draw(); });
        $$('.kb button').forEach(b => b.addEventListener('click', () => {
          const c = b.dataset.c; if (tried.has(c) || finished) return; tried.add(c);
          if (word.includes(c)) { found.add(c); sfx('ok'); if ([...word].filter(x => /[a-z]/.test(x)).every(x => found.has(x))) { finished = true; score++; VO.say([w.en, 200, praise()]); FX.confetti(); } }
          else { lives--; sfx('no'); if (lives <= 0) { finished = true; VO.say(w.en); } }
          draw();
        }));
      };
      if (k === 0) VO.say({ a: g.line });
      draw();
    };
    show();
  },
  /* does the word he hears match the picture? */
  tf(g) {
    startCard(g, 'سترى صورة وتسمع كلمة. هل الكلمة تناسب الصورة؟ لديك ٤٥ ثانية!', () => {
      const pool = gamePool(true); let score = 0, left = 45, k = 0, over = false;
      const tick = setInterval(() => { left--; const t = $('#tm'); if (t) t.style.width = (left / 45 * 100) + '%'; if (left <= 0) { over = true; clearInterval(tick); VO.say({ a: 'time-up' }); setTimeout(() => gameEnd(g, score, score), 800); } }, 1000);
      onLeave(() => { over = true; clearInterval(tick); });
      const show = () => {
        if (over) return; const w = pool[k++ % pool.length], yes = Math.random() < .5, shown = yes ? w : (gameOthers(w, pool, 1, 'pic')[0] || w), truth = shown === w;
        app.innerHTML = hud(g, `<span class="chipd">⭐ <b>${num(score)}</b></span><div class="timer"><i id="tm" style="width:${left / 45 * 100}%"></i></div>`) +
          `<div class="prompt">${pic(w)}<div class="wbig en" style="font-size:32px">${esc(shown.en)}</div></div>
          <div class="opts tf"><button class="opt" data-v="1">✓ صح</button><button class="opt" data-v="0">✗ خطأ</button></div>`;
        bindBar(); VO.say(shown.en);
        $$('.opt').forEach(el => el.addEventListener('click', () => {
          if (over || el.closest('.opts').classList.contains('locked')) return; el.closest('.opts').classList.add('locked');
          const ok = (el.dataset.v === '1') === truth;
          if (ok) { score++; el.classList.add('ok'); sfx('ok'); setTimeout(show, 350); }
          else { el.classList.add('bad'); sfx('no'); VO.say(w.en); toast(`<span class="en">${esc(w.en)}</span> = ${esc(w.ar)}`, 1100); setTimeout(show, 1100); }
        }));
      };
      show();
    });
  },
};
