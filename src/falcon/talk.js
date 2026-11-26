/* صقر الكلمات — talk time: questions like the ones his online teacher asks; he answers with a whole sentence.
   With a microphone the browser's speech recognition listens (no device voice is used); without one he builds the answer from word tiles. */
def('talkList', () => {
  app.innerHTML = bar('تحدّث') + `<div class="talkf"><div class="bubble">ستسمع سؤالًا مثل أسئلة معلمة الحصة، فأجب بجملة كاملة. الجمل تساعدك على الكلام بثقة!</div><div class="fmid">${falcon({ mood: 'happy' })}</div></div>
    <div class="stack" style="margin-top:8px">${TOPICS.map(t => { const qs = TALK.filter(x => x.t === t.id), best = qs.reduce((s, _, j) => s + (ST.talk[t.id + ':' + j] || 0), 0), ready = topicLearned(t) >= 3;
      return `<button class="lcard" data-t="${t.id}" style="${ready ? '' : 'opacity:.72'}"><span class="ln" style="background:${t.color};font-size:24px">${t.icon}</span><span class="lx"><b>${esc(t.ar)}</b><span class="small muted">${ready ? 'جاهز للمحادثة' : 'تعلّم كلماته أولًا لتسهل عليك'} · ${num(qs.length)} أسئلة</span></span>${starsHTML(Math.round(best / Math.max(1, qs.length)))}</button>`; }).join('')}</div>`;
  bindBar(); VO.say({ a: 'talk-intro' });
  on('.lcard', el => go('talk', el.dataset.t));
});
function talkStars(alts, q, T) {
  if (!alts.length) return 0;
  const fw = normE(q.f.replace('___', ' ')).split(' ').filter(Boolean), keys = [...T.words.filter(w => !isPhrase(w)).map(w => normE(w.en)), ...normE(q.a).split(' ').filter(x => x.length > 3)];
  let best = 1;
  for (const a of alts) {
    const x = normE(a), xw = x.split(' '), m = fw.length ? fw.filter(v => xw.includes(v)).length / fw.length : 1;
    const hit = keys.some(k => (' ' + x + ' ').includes(' ' + k + ' '));
    best = Math.max(best, m >= .6 ? (hit || xw.length > fw.length ? 3 : 2) : m >= .3 ? 2 : 1);
  }
  return best;
}
def('talk', id => {
  const T = TOPIC[id], Qs = TALK.filter(x => x.t === id);
  let k = 0, total = 0;
  VO.pre(Qs.flatMap(q => [q.q, q.a]));
  const show = () => {
    const q = Qs[k], helpers = [...T.words.filter(w => !isPhrase(w) && isLearned(w)), ...T.words.filter(w => !isPhrase(w) && !isLearned(w))].slice(0, 10);
    app.innerHTML = bar('تحدّث · ' + esc(T.ar)) + `<div class="dots">${Qs.map((_, j) => `<i class="${j < k ? 'done' : j === k ? 'on' : ''}"></i>`).join('')}</div>
      <div class="card qcard"><div class="talkf"><div class="fmid" style="width:110px;height:110px">${falcon({ mood: 'wow' })}</div></div>
        <div class="qen en">${esc(q.q)}</div><button class="muted" id="qar" ${ST.set.arHide ? 'hidden' : ''}>🔊 ${esc(q.qAr)}</button>
        <div class="tools"><button class="tbtn" id="hq">🔊 السؤال</button><button class="tbtn" id="hqz">🐢 ببطء</button>${ST.set.arHide ? '<button class="tbtn" id="tr">👁 الترجمة</button>' : ''}</div></div>
      <div class="sec">أجب بجملة مثل هذه</div>
      <div class="frame en center">${esc(q.f).replace('___', '<span class="gap">_____</span>')}</div>
      <p class="small muted center" style="margin:8px 0 6px">كلمات تساعدك (اضغط لتسمعها):</p>
      <div class="helpw">${helpers.map(w => `<button data-k="${esc(w.k)}">${pic(w)}${esc(w.en)}</button>`).join('')}</div>
      <div id="act" style="margin-top:14px"></div>`;
    bindBar();
    VO.say([...(k === 0 ? [{ a: 'talk-intro' }, 300] : []), q.q, ...(ST.set.arHide ? [] : [350, { r: q.qAr }])]);
    on('#hq', () => VO.say(q.q)); on('#hqz', () => VO.say({ z: q.q }));
    on('#tr', el => { el.hidden = true; $('#qar').hidden = false; VO.say({ r: q.qAr }); });
    on('#qar', () => VO.say({ r: q.qAr }));
    on('.helpw button', el => VO.say(BYK[el.dataset.k].en));
    canMic() ? micMode(q) : buildMode(q);
  };
  const finish = (q, stars, heard) => {
    const key = id + ':' + k; ST.talk[key] = Math.max(ST.talk[key] || 0, stars); ST.talkN++; today().tk = (today().tk || 0) + 1; total += stars; addFeathers(stars, $('#act')); save();
    $('#act').innerHTML = `<div class="card center stack"><div class="bigstars" style="font-size:40px">${Array.from({ length: 3 }, (_, j) => j < stars ? '★' : '<span class="off">★</span>').join('')}</div>
      ${heard ? `<div class="muted small">سمعت: <span class="en">${esc(heard)}</span></div>` : ''}
      <div><b>إجابة نموذجية:</b></div><div class="en" style="font-size:22px;font-weight:700;color:var(--night)">${esc(q.a)}</div>
      ${heard && canMic() ? '<button class="btn green small" id="more2">➕ قل جملة ثانية</button>' : ''}
      <div class="row"><button class="btn soft small" id="again">🔁 حاول مرة أخرى</button><button class="btn small" id="nq">${k < Qs.length - 1 ? 'السؤال التالي ◀︎' : 'انتهيت ◀︎'}</button></div></div>`;
    sfx(stars >= 2 ? 'ok' : 'pop'); if (stars === 3) FX.confetti();
    VO.say([stars === 3 ? praise() : stars === 2 ? 'Good try!' : 'Try again!', 300, 'Try like this:', 200, q.a]);
    on('#again', show);
    on('#more2', () => moreMode());
    on('#nq', () => { if (k < Qs.length - 1) { k++; show(); } else done(); });
  };
  // a second sentence about the same question: his answers are one short sentence, and his plan asks for two
  const moreMode = () => {
    $('#act').innerHTML = `<div class="card center stack"><div class="en" style="font-size:22px;font-weight:700;color:var(--night)">Can you tell me more?</div>
      <p class="small muted" style="margin:0">قل جملة ثانية عن الموضوع نفسه: لماذا؟ أو متى؟ أو مع من؟</p>
      <button class="micbtn" id="mic2" aria-label="اضغط وتكلم">🎤</button><div class="heard" id="heard2">اضغط على الميكروفون، ثم تكلم</div>
      <button class="btn small" id="nq2">${k < Qs.length - 1 ? 'السؤال التالي ◀︎' : 'انتهيت ◀︎'}</button></div>`;
    VO.say([{ a: 'talk-more' }, 250, 'Can you tell me more?']);
    let got = false;
    $('#mic2').onclick = async () => {
      if (got) return;
      const b = $('#mic2'), out = $('#heard2'); VO.stop(); b.classList.add('on'); out.textContent = '… أستمع';
      const r = await listen(); b.classList.remove('on');
      if (r.err) { out.textContent = r.msg; return; }
      const said = r.alts[0] || '', n = normE(said).split(' ').filter(Boolean).length;
      if (n < 3) { out.innerHTML = said ? `سمعت: <span class="en">${esc(said)}</span> · قل جملة أطول` : 'لم أسمع شيئًا. اقترب وتكلم بوضوح.'; return; }
      got = true; out.innerHTML = `✅ <span class="en">${esc(said)}</span>`;
      ST.talk2 = (ST.talk2 || 0) + 1; addFeathers(2, b); save();
      sfx('ok'); FX.confetti(); VO.say({ a: 'talk-two' });
    };
    on('#nq2', () => { if (k < Qs.length - 1) { k++; show(); } else done(); });
  };
  const micMode = q => {
    $('#act').innerHTML = `<button class="micbtn" id="mic" aria-label="اضغط وتكلم">🎤</button><div class="heard" id="heard">اضغط على الميكروفون وأجب بصوتك</div>
      <div class="row qfoot"><button class="btn soft small" id="model">👂 اسمع إجابة نموذجية</button><button class="btn soft small" id="build">🧩 ابنِ الإجابة</button></div>`;
    on('#model', () => VO.say(['Try like this:', 200, q.a]));
    on('#build', () => buildMode(q));
    $('#mic').onclick = async () => {
      const b = $('#mic'), out = $('#heard'); VO.stop(); b.classList.add('on'); out.textContent = '… أستمع';
      const r = await listen(); b.classList.remove('on');
      if (r.err) { out.textContent = r.msg; buildMode(q); return; }
      if (!r.alts.length) { out.textContent = 'لم أسمع شيئًا. اقترب وتكلم بوضوح، ثم اضغط مرة أخرى.'; return; }
      finish(q, talkStars(r.alts, q, T), r.alts[0]);
    };
  };
  const buildMode = q => {
    const toks = q.a.split(' ');
    let pool = mix(toks.map((t, i) => ({ t, i }))); if (pool.every((p, i) => p.t === toks[i]) && pool.length > 1) pool = [...pool.slice(1), pool[0]];
    $('#act').innerHTML = `<p class="center" style="margin:0 0 8px;font-weight:700">رتّب الكلمات لتبني الإجابة، ثم قلها بصوتك:</p><div class="built" id="built"></div>
      <div class="tiles">${pool.map((p, i) => `<button class="tile w" data-t="${i}">${esc(p.t)}</button>`).join('')}</div>`;
    VO.say({ a: 'talk-build' }); $('#act').dataset.w = q.a; // for the test bot
    let pos = 0, miss = 0;
    $$('#act .tile').forEach(tile => tile.addEventListener('click', () => {
      if (pos >= toks.length || tile.classList.contains('used')) return;
      if (pool[+tile.dataset.t].t === toks[pos]) { sfx('tap'); tile.classList.add('used'); const s = document.createElement('span'); s.textContent = toks[pos]; $('#built').appendChild(s); pos++;
        if (pos === toks.length) setTimeout(() => finish(q, miss <= 1 ? 3 : miss <= 3 ? 2 : 1, ''), 350); }
      else { miss++; sfx('no'); tile.classList.remove('shake'); void tile.offsetWidth; tile.classList.add('shake'); }
    }));
  };
  const done = () => {
    const stars = Math.round(total / Qs.length);
    app.innerHTML = `<div class="result"><div class="fres hop">${falcon({ mood: 'happy', pose: 'cheer' })}</div><h2>أحسنت الكلام!</h2>
      <div class="bigstars">${Array.from({ length: 3 }, (_, j) => j < stars ? '★' : '<span class="off">★</span>').join('')}</div>
      <p style="margin:0">هذه أسئلة تشبه أسئلة معلمة الحصة. كلما تدربت، تكلمت بثقة أكبر.</p>
      <div class="stack" style="width:100%"><button class="btn" id="more">🎤 موضوع آخر</button><button class="btn soft" id="hm">🏠 الرئيسية</button></div></div>`;
    FX.confetti(); sfx('win'); celebrate([{ a: 'good-try' }]);
    on('#more', () => { clean(); stack = [{ name: 'home' }]; cur = { name: 'talkList' }; render(); });
    on('#hm', home);
  };
  show();
});
