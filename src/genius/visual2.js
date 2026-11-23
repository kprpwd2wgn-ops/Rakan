// ---------- world 1: visual focus (part 2) ----------

// ===== the right shadow =====
const SHD_EMO = [
  ['🐘','🦏','🦛','🐃'], ['🦒','🦘','🐫','🦙'], ['🐓','🦃','🦚','🦢'], ['🐟','🐠','🐡','🦈'], ['✈️','🚁','🚀','🛸'],
  ['🍎','🍐','🍊','🍋'], ['🌲','🌳','🌴','🌵'], ['🐢','🐊','🦎','🐍'], ['🦋','🐝','🐞','🦗'], ['🔑','🔨','🔧','✂️'],
  ['🚗','🚕','🚙','🚌'], ['🐕','🐈','🐁','🐇'], ['☂️','🌂','⛱️','🎈'], ['🐄','🐖','🐑','🐐'],
];
T('shd', { w:'v', name:'الظِّلُّ الصَّحِيحُ', icon:'🌑', n:30,
  gen(r, d){
    if (d < 2) {
      const g = pk(r, SHD_EMO), e = pk(r, g);
      const box = x => `<span style="filter:brightness(0);font-size:52px;line-height:1.1">${x}</span>`;
      return { q:'أَيُّ ظِلٍّ هُوَ ظِلُّ هَذَا الشَّكْلِ؟', say:['q-shd'], board:`<div class="txt" style="font-size:96px;line-height:1.2">${e}</div>`,
        opts:opts(r, box(e), g.filter(x => x !== e).map(box), { pic:true }),
        exBoard:`<div class="txt" style="font-size:64px">${e} ⬅︎ ${box(e).replace('52px', '64px')}</div>`, ex:'الظِّلُّ لَهُ نَفْسُ شَكْلِ الصُّورَةِ تَمَامًا.', exSay:['ex-shd'] };
    }
    const n = d === 2 ? ri(r, 6, 7) : ri(r, 8, 9);
    let cells, wrong;
    for (let a = 0; a < 60; a++) {
      cells = polyo(r, n, 4, 4).map(c => [c[0], c[1], pk(r, ['red', 'blue', 'green', 'yellow', 'purple'])]);
      const seen = new Set([ckey(cells, false)]); wrong = [];
      const cands = [flipX(cells), moveOne(r, cells), moveOne(r, cells), moveOne(r, cells), rot90(cells), moveOne(r, cells)];
      for (const c of cands) { if (c && !seen.has(ckey(c, false)) && wrong.length < 3) { seen.add(ckey(c, false)); wrong.push(c); } }
      if (wrong.length === 3) break;
    }
    const pic = c => SV(120, 120, drawCells(c, 120, 120, { sil:true }));
    const big = SV(300, 220, drawCells(cells, 300, 220));
    return { q:'أَيُّ ظِلٍّ هُوَ ظِلُّ هَذَا الشَّكْلِ؟', say:['q-shd'], board:big,
      opts:opts(r, pic(cells), wrong.map(pic), { pic:true }),
      exBoard:SV(360, 150, `<g transform="translate(10,15) scale(.6)">${drawCells(cells, 300, 220)}</g>` + txt(200, 75, '⬅︎', 34) + `<g transform="translate(225,15)">${drawCells(cells, 120, 120, { sil:true })}</g>`),
      ex:'الظِّلُّ لَهُ نَفْسُ الشَّكْلِ تَمَامًا: نَفْسُ الْمُرَبَّعَاتِ فِي نَفْسِ الْأَمَاكِنِ.', exSay:['ex-shd'] };
  } });
SAY['q-shd'] = 'أَيُّ ظِلٍّ هُوَ ظِلُّ هَذَا الشَّكْلِ؟';
SAY['ex-shd'] = 'الظِّلُّ لَهُ نَفْسُ الشَّكْلِ تَمَامًا. قَارِنِ الْأَطْرَافَ وَاحِدًا وَاحِدًا.';
SAY['h-shd'] = 'انْظُرْ إِلَى الشَّكْلِ، ثُمَّ اخْتَرْ ظِلَّهُ الصَّحِيحَ.';

// ===== in the mirror =====
T('mir', { w:'v', name:'فِي الْمِرْآةِ', icon:'🪞', n:30,
  gen(r, d){
    const n = [4, 5, 7, 9][d], cols = [['red', 'blue'], ['red', 'blue', 'yellow'], ['red', 'blue', 'green', 'yellow'], ['red', 'blue', 'green', 'yellow', 'purple']][d];
    let cells, m, wrong;
    for (let a = 0; a < 80; a++) {
      cells = polyo(r, n, d < 2 ? 3 : 4, d < 2 ? 3 : 4).map(c => [c[0], c[1], pk(r, cols)]);
      m = flipX(cells);
      const cands = [cells, flipY(cells), flipX(flipY(cells)), rot90(cells), moveOne(r, m)];
      const seen = new Set([ckey(m)]); wrong = [];
      for (const c of cands) if (c && !seen.has(ckey(c)) && wrong.length < 3) { seen.add(ckey(c)); wrong.push(c); }
      if (wrong.length === 3 && ckey(cells) !== ckey(m)) break;
    }
    const pic = c => SV(120, 120, drawCells(c, 120, 120));
    // the shape on the right, the mirror (a blue glass line) on its left
    const board = SV(360, 220, `<g transform="translate(150,0)">${drawCells(cells, 210, 220, { max:46 })}</g>` +
      `<rect x="118" y="14" width="12" height="192" rx="5" fill="#bfe3ff" stroke="#6aa9d8" stroke-width="3"/>` + txt(58, 110, '؟', 64, '#6aa9d8'));
    return { q:'كَيْفَ يَبْدُو هَذَا الشَّكْلُ فِي الْمِرْآةِ؟', say:['q-mir'], board, opts:opts(r, pic(m), wrong.map(pic), { pic:true }),
      exBoard:SV(360, 170, `<g transform="translate(190,0)">${drawCells(cells, 170, 170, { max:38 })}</g><rect x="174" y="10" width="10" height="150" rx="4" fill="#bfe3ff" stroke="#6aa9d8" stroke-width="3"/><g>${drawCells(m, 170, 170, { max:38 })}</g>`),
      ex:'فِي الْمِرْآةِ يَصِيرُ الْيَمِينُ يَسَارًا، وَالْيَسَارُ يَمِينًا، وَيَبْقَى الْأَعْلَى فِي الْأَعْلَى.', exSay:['ex-mir'] };
  } });
SAY['q-mir'] = 'كَيْفَ يَبْدُو هَذَا الشَّكْلُ فِي الْمِرْآةِ؟';
SAY['ex-mir'] = 'فِي الْمِرْآةِ يَصِيرُ الْيَمِينُ يَسَارًا، وَالْيَسَارُ يَمِينًا، وَيَبْقَى الْأَعْلَى فِي الْأَعْلَى.';
SAY['h-mir'] = 'تَخَيَّلْ أَنَّ الشَّكْلَ يَقِفُ أَمَامَ مِرْآةٍ. كَيْفَ تَبْدُو صُورَتُهُ؟';

// ===== picture memory =====
const MEM = ['🍎','🐶','⚽','🚗','🌙','🎈','🐟','🌸','🍌','⭐','🐸','🍩','🦋','🚀','🎁','🐱','🍓','🌈','🦁','🐢','🍉','🧸','🏠','🐝'];
T('mem', { w:'v', name:'ذَاكِرَةُ الصُّوَرِ', icon:'🧠', n:30,
  gen(r, d){
    const n = [4, 6, 9, 12][d], cols = [2, 3, 3, 4][d], ms = [4000, 5000, 6000, 7000][d];
    const kind = d === 0 ? pk(r, ['miss', 'where']) : d === 3 ? pk(r, ['miss', 'where', 'count']) : pk(r, ['miss', 'where', 'where', 'miss']);
    let pics = shuf(r, MEM).slice(0, n + 1);
    const extra = pics.pop();
    let target = pk(r, pics), times = 1;
    if (kind === 'count') { times = ri(r, 2, 4); for (let k = 1; k < times; k++) pics[(pics.indexOf(target) + k * 5) % n] = target; times = pics.filter(x => x === target).length; }
    const rows = Math.ceil(n / cols), c = 360 / cols, ch = Math.min(c, 300 / rows) , H = ch * rows;
    const grid = (show, hit) => SV(360, H, pics.map((e, i) => { const x = (i % cols + .5) * c, y = (Math.floor(i / cols) + .5) * ch;
      return `<g data-k="${i}"><rect x="${f1(x - c / 2 + 5)}" y="${f1(y - ch / 2 + 5)}" width="${f1(c - 10)}" height="${f1(ch - 10)}" rx="14" fill="${show ? '#fff' : '#6c5ce7'}" stroke="${hit && hit(i, e) ? '#ff4d4d' : '#c9c3a8'}" stroke-width="${hit && hit(i, e) ? 6 : 3}"/>` +
        (show ? emo(x, y, e, Math.min(c, ch) * .5) : txt(x, y, '؟', Math.min(c, ch) * .4, '#fff')) + '</g>'; }).join(''));
    const base = { memo:{ board:grid(true), ms, q:'احْفَظِ الصُّوَرَ جَيِّدًا!', say:['q-mem-0'] }, exBoard:grid(true, kind === 'miss' ? null : (i, e) => e === target) };
    if (kind === 'miss') {
      const shown = shuf(r, [...new Set(pics)]).slice(0, 3);
      return { ...base, q:'أَيُّ صُورَةٍ لَمْ تَكُنْ فِي اللَّوْحَةِ؟', say:['q-mem-miss'], board:grid(false), opts:opts(r, extra, shown),
        ex:`الصُّورَةُ ${extra} لَمْ تَكُنْ فِي اللَّوْحَةِ.`, exSay:['ex-mem'] };
    }
    if (kind === 'count') return { ...base, q:'كَمْ مَرَّةً ظَهَرَتْ هَذِهِ الصُّورَةُ؟', top:target, say:['q-mem-count'], board:grid(false),
      opts:numOpts(r, times, [1, -1, 2]), ex:`ظَهَرَتْ ${target} ${dg(times)} مَرَّاتٍ.`, exSay:['ex-mem'] };
    return { ...base, q:'أَيْنَ كَانَتْ هَذِهِ الصُّورَةُ؟ اضْغَطْ عَلَى مَكَانِهَا.', top:target, say:['q-mem-where'], board:grid(false), tap:true,
      k:String(pics.indexOf(target)), ex:`كَانَتْ ${target} هُنَا.`, exSay:['ex-mem'] };
  } });
SAY['q-mem-0'] = 'احْفَظِ الصُّوَرَ جَيِّدًا!';
SAY['q-mem-miss'] = 'أَيُّ صُورَةٍ لَمْ تَكُنْ فِي اللَّوْحَةِ؟';
SAY['q-mem-where'] = 'أَيْنَ كَانَتْ هَذِهِ الصُّورَةُ؟ اضْغَطْ عَلَى مَكَانِهَا.';
SAY['q-mem-count'] = 'كَمْ مَرَّةً ظَهَرَتْ هَذِهِ الصُّورَةُ؟';
SAY['ex-mem'] = 'هَذِهِ هِيَ اللَّوْحَةُ كَمَا كَانَتْ. الذَّاكِرَةُ تَقْوَى بِالتَّدْرِيبِ!';
SAY['h-mem'] = 'سَتَظْهَرُ صُوَرٌ لِثَوَانٍ قَلِيلَةٍ، ثُمَّ تَخْتَفِي. احْفَظْهَا جَيِّدًا!';

// ===== spot the difference =====
const DIF_SWAP = { '🍎':'🍏', '🐶':'🐱', '🌸':'🌼', '⭐':'🌟', '🚗':'🚕', '🐟':'🐠', '🎈':'🎀', '🌳':'🌲', '🐥':'🐤', '⚽':'🏀',
  '🍓':'🍒', '🦋':'🐝', '🏠':'🏡', '🌙':'⭐', '🍩':'🍪', '🐸':'🐢', '🍌':'🌽', '🧸':'🐻', '☀️':'🌞', '🐞':'🐜' };
const DIF_ALL = Object.keys(DIF_SWAP);
const DIF_FLIP = ['🚗','🐟','🍌','🌙']; // only pictures that look different when turned around
T('dif', { w:'v', name:'أَوْجِدِ الْفَرْقَ', icon:'🔎', n:30,
  gen(r, d){
    const n = [5, 8, 11, 14][d], W = 360, H = 150, sz = [44, 38, 34, 30][d];
    const P = spots(r, n, W, H - 6, sz * 1.15).map(p => [p[0], p[1] + 3]);
    const items = P.map(() => pk(r, DIF_ALL));
    const k = ri(r, 0, P.length - 1);
    const how = pk(r, d === 0 ? ['swap', 'gone'] : d === 1 ? ['swap', 'gone', 'small'] : ['swap', 'gone', 'flip', 'small']); // a turned picture is the hardest to see
    const can = how !== 'flip' || DIF_FLIP.includes(items[k]);
    const mode = can ? how : 'swap';
    const one = (i, e, x, y, alt) => {
      if (alt && mode === 'gone') return '';
      if (alt && mode === 'swap') e = DIF_SWAP[e];
      const tf = alt && mode === 'flip' ? `transform="translate(${f1(x)} ${f1(y)}) scale(-1 1)"` : alt && mode === 'small' ? `transform="translate(${f1(x)} ${f1(y)}) scale(.62)"` : '';
      return tf ? `<text x="0" y="0" font-size="${sz}" text-anchor="middle" dominant-baseline="central" ${tf}>${e}</text>` : emo(x, y, e, sz);
    };
    const panel = (alt) => P.map((p, i) => one(i, items[i], p[0], p[1], alt && i === k)).join('');
    const hit = `<g data-k="1"><rect x="${f1(P[k][0] - sz * .75)}" y="${f1(P[k][1] - sz * .75)}" width="${f1(sz * 1.5)}" height="${f1(sz * 1.5)}" fill="transparent"/></g>`;
    const frame = (y, label) => `<rect x="2" y="${y + 2}" width="${W - 4}" height="${H - 4}" rx="16" fill="#fff" stroke="#c9c3a8" stroke-width="3"/>` + txt(20, y + 18, label, 15, '#a59f86');
    // a tap anywhere else on the pictures counts as a wrong guess (the outer group), the changed spot is the inner one
    const body = `<g data-k="x">` + frame(0, '١') + panel(false) + `<g transform="translate(0,${H + 12})">${frame(0, '٢')}${panel(true)}</g></g>`;
    const tap = `<g transform="translate(0,0)">${hit}</g><g transform="translate(0,${H + 12})">${hit}</g>`;
    const ring = y => `<circle cx="${f1(P[k][0])}" cy="${f1(P[k][1] + y)}" r="${f1(sz * .72)}" fill="none" stroke="#ff4d4d" stroke-width="5"/>`;
    const what = { swap:'تَغَيَّرَتْ صُورَةٌ بِصُورَةٍ أُخْرَى.', gone:'اخْتَفَتْ صُورَةٌ مِنَ الصُّورَةِ الثَّانِيَةِ.', flip:'صُورَةٌ انْقَلَبَتْ إِلَى الْجِهَةِ الْأُخْرَى.', small:'صُورَةٌ صَغُرَتْ.' }[mode];
    return { q:'مَا الْفَرْقُ بَيْنَ الصُّورَتَيْنِ؟ اضْغَطْ عَلَيْهِ.', say:['q-dif'], board:SV(W, H * 2 + 12, body + tap), tap:true, k:'1',
      exBoard:SV(W, H * 2 + 12, body + ring(0) + ring(H + 12)), ex:what, exSay:['ex-dif'] };
  } });
SAY['q-dif'] = 'مَا الْفَرْقُ بَيْنَ الصُّورَتَيْنِ؟ اضْغَطْ عَلَيْهِ.';
SAY['ex-dif'] = 'قَارِنْ جُزْءًا جُزْءًا، تَجِدِ الِاخْتِلَافَ!';
SAY['h-dif'] = 'صُورَتَانِ مُتَشَابِهَتَانِ، بَيْنَهُمَا فَرْقٌ وَاحِدٌ فَقَطْ. اضْغَطْ عَلَيْهِ.';

// ===== tangled strings =====
const TNG_ANI = ['🐭','🐰','🐶','🐱','🐼','🐸','🐵','🐨'];
function catmull(pts){
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d;
}
T('tng', { w:'v', name:'الْخُيُوطُ الْمُتَشَابِكَةُ', icon:'🧶', n:30,
  gen(r, d){
    const n = [3, 4, 4, 5][d], W = 360, H = 330, top = 36, bot = 296, way = [2, 3, 4, 5][d];
    const xs = range(n).map(i => (i + .5) * W / n), perm = shuf(r, range(n));
    const ani = shuf(r, TNG_ANI).slice(0, n), goal = ri(r, 0, n - 1), who = perm.indexOf(goal);
    const colors = ['#e63946', '#2a9d8f', '#3d7dff', '#9b5de5', '#ff8c42'];
    const paths = range(n).map(i => {
      const pts = [[xs[i], top + 22]];
      for (let w = 1; w <= way; w++) pts.push([ri(r, 25, W - 25), top + 22 + (bot - top - 44) * w / (way + 1)]);
      pts.push([xs[perm[i]], bot - 22]);
      return catmull(pts);
    });
    const line = (i, hl) => `<path d="${paths[i]}" fill="none" stroke="${hl ? '#ff4d4d' : d === 0 ? colors[i] : '#4a4e75'}" stroke-width="${hl ? 9 : 5}" stroke-linecap="round" opacity="${hl ? 1 : .9}"/>`;
    const heads = range(n).map(i => `<g data-k="${i}"><circle cx="${f1(xs[i])}" cy="${top}" r="26" fill="#fff4d6" stroke="#c9a74d" stroke-width="3"/>${emo(xs[i], top + 1, ani[i], 32)}</g>`).join('');
    const feet = range(n).map(j => `<circle cx="${f1(xs[j])}" cy="${bot}" r="24" fill="${j === goal ? '#ffe08a' : '#eee'}" stroke="#c9c3a8" stroke-width="3"/>` +
      (j === goal ? emo(xs[j], bot + 1, '🎁', 30) : txt(xs[j], bot, '✕', 22, '#b5b0a0'))).join('');
    const all = hl => range(n).map(i => line(i, false)).join('') + (hl ? line(who, true) : '') + feet + heads;
    return { q:'أَيُّ حَيَوَانٍ يَصِلُ خَيْطُهُ إِلَى الْهَدِيَّةِ؟', say:['q-tng'], board:SV(W, H, all(false)), tap:true, k:String(who),
      exBoard:SV(W, H, all(true)), ex:`خَيْطُ ${ani[who]} يَصِلُ إِلَى الْهَدِيَّةِ 🎁.`, exSay:['ex-tng'] };
  } });
SAY['q-tng'] = 'أَيُّ حَيَوَانٍ يَصِلُ خَيْطُهُ إِلَى الْهَدِيَّةِ؟';
SAY['ex-tng'] = 'تَتَبَّعِ الْخَيْطَ بِعَيْنِكَ مِنْ أَوَّلِهِ إِلَى آخِرِهِ، وَلَا تَقْفِزْ إِلَى خَيْطٍ آخَرَ!';
SAY['h-tng'] = 'خُيُوطٌ مُتَشَابِكَةٌ! تَتَبَّعْ كُلَّ خَيْطٍ لِتَعْرِفَ أَيْنَ يَنْتَهِي.';

// ===== ink colour (say the colour, not the word) =====
const INK = [['red', 'أَحْمَرُ'], ['blue', 'أَزْرَقُ'], ['green', 'أَخْضَرُ'], ['yellow', 'أَصْفَرُ'], ['purple', 'بَنَفْسَجِيٌّ'], ['orange', 'بُرْتُقَالِيٌّ']];
T('ink', { w:'v', name:'لَوْنُ الْحِبْرِ', icon:'🎨', n:30,
  gen(r, d){
    const pick4 = shuf(r, INK).slice(0, 4), word = pick4[0], ink = pick4[1];
    const bg = d >= 2 ? COL[pick4[2][0]] + '33' : '#fff';
    const board = `<div class="txt" style="font-size:64px;color:${COL[ink[0]]};background:${bg};border-radius:16px;padding:16px 10px;width:100%;-webkit-text-stroke:1.5px #2b2f55">${word[1].replace(/[ً-ْ]/g, '')}</div>`;
    let o;
    if (d < 2) {
      const dot = c => `<span style="display:inline-block;width:52px;height:52px;border-radius:50%;background:${COL[c[0]]};border:3px solid #2b2f55"></span>`;
      o = opts(r, dot(ink), shuf(r, pick4.filter(c => c !== ink)).map(dot), { pic:true });
    } else {
      // the choices are colour names, each written in a different colour: read the name this time
      const lab = (c, j) => `<span style="font-size:30px;color:${COL[pick4[(j + 2) % 4][0]]};-webkit-text-stroke:.7px #2b2f55">${c[1].replace(/[ً-ْ]/g, '')}</span>`;
      o = opts(r, lab(ink, 0), pick4.filter(c => c !== ink).map((c, j) => lab(c, j + 1)), { pic:true, w:true });
    }
    return { q:d < 2 ? 'مَا لَوْنُ الْكِتَابَةِ؟ لَا تَقْرَأِ الْكَلِمَةَ!' : 'اخْتَرِ اسْمَ لَوْنِ الْكِتَابَةِ، لَا مَعْنَى الْكَلِمَةِ!',
      say:[d < 2 ? 'q-ink' : 'q-ink-2'], board, opts:o, ex:`الْكَلِمَةُ تَقُولُ: ${word[1]}، لَكِنَّ لَوْنَ الْحِبْرِ ${ink[1]}.`, exSay:['ex-ink'] };
  } });
SAY['q-ink'] = 'مَا لَوْنُ الْكِتَابَةِ؟ لَا تَقْرَأِ الْكَلِمَةَ!';
SAY['q-ink-2'] = 'اخْتَرِ اسْمَ لَوْنِ الْكِتَابَةِ، لَا مَعْنَى الْكَلِمَةِ!';
SAY['ex-ink'] = 'الْكَلِمَةُ تَقُولُ لَوْنًا، لَكِنَّ الْحِبْرَ لَوْنٌ آخَرُ. هَكَذَا يَتَدَرَّبُ عَقْلُكَ عَلَى التَّرْكِيزِ!';
SAY['h-ink'] = 'كَلِمَةٌ مَكْتُوبَةٌ بِلَوْنٍ غَيْرِ مَعْنَاهَا. انْتَبِهْ لِلَوْنِ الْحِبْرِ!';
