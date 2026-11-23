// ---------- world 3: mental maths (part 1) ----------

// a row of tokens read from right to left (numbers, pictures, signs)
const eqRow = toks => `<div class="eq">${toks.map(t => `<span>${t}</span>`).join('')}</div>`;

// ===== picture equations =====
const EQN_SETS = [['🍎','🍌','🍇'], ['🍓','🍊','🍉'], ['🐶','🐱','🐰'], ['⚽','🎈','⭐'], ['🍩','🍪','🧁'], ['🚗','🚲','🚀'], ['🐸','🐢','🐟'], ['🌸','🌻','🍀']];
T('eqn', { w:'m', name:'مُعَادَلَاتُ الصُّوَرِ', icon:'🍎', n:40,
  gen(r, d){
    const [A, B, C] = shuf(r, pk(r, EQN_SETS));
    let a, b, c, rows, ask, ans;
    if (d === 0) { a = ri(r, 2, 9); b = ri(r, 1, 9);
      rows = [[A, '+', A, '=', dg(2 * a)], [A, '+', B, '=', dg(a + b)]]; ask = [B]; ans = b; }
    else if (d === 1) { a = ri(r, 2, 10); b = ri(r, 1, 9); c = ri(r, 1, 9);
      rows = [[A, '+', A, '+', A, '=', dg(3 * a)], [A, '+', B, '+', B, '=', dg(a + 2 * b)], [B, '+', C, '=', dg(b + c)]]; ask = [A, '+', B, '+', C]; ans = a + b + c; }
    else if (d === 2) { a = ri(r, 2, 9); b = ri(r, 2, 6); c = ri(r, 1, 9);
      rows = [[A, '+', A, '=', dg(2 * a)], [A, '×', B, '=', dg(a * b)], [C, '−', B, '=', dg(c)]]; c += b; ask = [A, '+', B, '+', C]; ans = a + b + c; }
    else { a = ri(r, 2, 10); b = ri(r, 2, 9); c = ri(r, 2, 5);
      rows = [[A, '+', A, '+', A, '=', dg(3 * a)], [A, '+', B, '+', B, '=', dg(a + 2 * b)], [B, '×', C, '=', dg(b * c)]]; ask = [C, '+', A, '×', C]; ans = c + a * c; }
    if (d === 3 && r() < .5) { ask = [A, '+', B, '+', C]; ans = a + b + c; }
    const vals = [[A, a], [B, b], [C, c]].filter(v => v[1] != null);
    const board = `<div class="eqs">${rows.map(eqRow).join('')}${eqRow([...ask, '=', '<b class="qm">؟</b>'])}</div>`;
    const note = ask.includes('×') && ask.includes('+') ? '<div class="note">✖️ قَبْلَ ➕</div>' : '';
    return { q:'كُلُّ صُورَةٍ لَهَا قِيمَةٌ. احْسُبِ السَّطْرَ الْأَخِيرَ!', say:['q-eqn'], board:board + note, opts:numOpts(r, ans),
      exBoard:`<div class="eqs"><div class="vals">${vals.map(v => `<span>${v[0]} = ${dg(v[1])}</span>`).join('')}</div>${eqRow([...ask, '=', '<b>' + dg(ans) + '</b>'])}</div>`,
      ex:'أَوَّلًا نَجِدُ قِيمَةَ كُلِّ صُورَةٍ، ثُمَّ نَحْسُبُ.' + (note ? ' وَنَضْرِبُ قَبْلَ أَنْ نَجْمَعَ.' : ''), exSay:[note ? 'ex-eqn-x' : 'ex-eqn'] };
  } });
SAY['q-eqn'] = 'كُلُّ صُورَةٍ لَهَا قِيمَةٌ. احْسُبِ السَّطْرَ الْأَخِيرَ!';
SAY['ex-eqn'] = 'أَوَّلًا نَجِدُ قِيمَةَ كُلِّ صُورَةٍ مِنَ السُّطُورِ الْأُولَى، ثُمَّ نَحْسُبُ السَّطْرَ الْأَخِيرَ.';
SAY['ex-eqn-x'] = 'نَجِدُ قِيمَةَ كُلِّ صُورَةٍ، ثُمَّ نَحْسُبُ. وَتَذَكَّرْ: نَضْرِبُ قَبْلَ أَنْ نَجْمَعَ!';
SAY['h-eqn'] = 'كُلُّ صُورَةٍ تُخْفِي عَدَدًا. اكْتَشِفْ قِيمَتَهَا مِنَ السُّطُورِ، ثُمَّ احْسُبْ.';

// ===== number sequences =====
const STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20, 25, 50, 100];
STEPS.forEach(k => { SAY['ex-seq-add-' + k] = `نُضِيفُ ${NUM_ACC[k]} كُلَّ مَرَّةٍ.`; SAY['ex-seq-sub-' + k] = `نَطْرَحُ ${NUM_ACC[k]} كُلَّ مَرَّةٍ.`; });
Object.assign(SAY, {
  'ex-seq-mul2':'كُلُّ عَدَدٍ ضِعْفُ الْعَدَدِ الَّذِي قَبْلَهُ.',
  'ex-seq-mul3':'نَضْرِبُ فِي ثَلَاثَةٍ كُلَّ مَرَّةٍ.',
  'ex-seq-mul10':'نَضْرِبُ فِي عَشَرَةٍ كُلَّ مَرَّةٍ.',
  'ex-seq-half':'كُلُّ عَدَدٍ نِصْفُ الْعَدَدِ الَّذِي قَبْلَهُ.',
  'ex-seq-grow':'الزِّيَادَةُ تَكْبَرُ كُلَّ مَرَّةٍ: نُضِيفُ وَاحِدًا، ثُمَّ اثْنَيْنِ، ثُمَّ ثَلَاثَةً، وَهَكَذَا.',
  'ex-seq-sq':'كُلُّ عَدَدٍ مَضْرُوبٌ فِي نَفْسِهِ: وَاحِدٌ فِي وَاحِدٍ، اثْنَانِ فِي اثْنَيْنِ، ثَلَاثَةٌ فِي ثَلَاثَةٍ، وَهَكَذَا.',
  'ex-seq-alt':'عَمَلِيَّتَانِ بِالتَّنَاوُبِ: نُضِيفُ مَرَّةً، وَنَطْرَحُ مَرَّةً.',
  'ex-seq-fib':'كُلُّ عَدَدٍ هُوَ مَجْمُوعُ الْعَدَدَيْنِ اللَّذَيْنِ قَبْلَهُ.',
  'ex-seq-two':'هُنَا سِلْسِلَتَانِ مُتَدَاخِلَتَانِ: عَدَدٌ مِنْ هَذِهِ، وَعَدَدٌ مِنْ تِلْكَ.',
  'q-seq':'مَا الْعَدَدُ التَّالِي؟', 'q-seq-mid':'مَا الْعَدَدُ النَّاقِصُ؟',
  'h-seq':'الْأَعْدَادُ تَسِيرُ عَلَى قَاعِدَةٍ. اكْتَشِفْهَا، وَأَكْمِلِ السِّلْسِلَةَ.',
});
function numRow(vals, hole, ops){
  const n = vals.length, per = n > 6 ? 4 : n, rows = Math.ceil(n / per), S = Math.min(78, (344 - (per - 1) * 10) / per), gap = 10, W = 360;
  const x0 = (W - (per * S + (per - 1) * gap)) / 2, rh = S + (ops ? 26 : 0) + 10;
  let b = '';
  vals.forEach((v, i) => {
    const col = i % per, row = Math.floor(i / per), x = W - x0 - col * (S + gap) - S / 2, y = 8 + row * rh + S / 2, q = i === hole;
    b += `<rect x="${f1(x - S / 2)}" y="${f1(y - S / 2)}" width="${f1(S)}" height="${f1(S)}" rx="14" fill="${q ? '#fff7d6' : '#fff'}" stroke="${q ? '#ffc21a' : '#3d7dff'}" stroke-width="4" ${q ? 'stroke-dasharray="8 6"' : ''}/>` +
      txt(x, y, q ? '؟' : dg(v), String(v).length > 2 ? 23 : 28, q ? '#e0a800' : '#2b2f55');
    if (ops && i < n - 1 && col < per - 1) b += txt(x - S / 2 - gap / 2, y + S / 2 + 14, ops[i], 15, '#e63946');
  });
  return SV(W, 16 + rows * rh - (rows ? 10 : 0) + (ops ? 0 : 0), b);
}
T('seq', { w:'m', name:'سَلَاسِلُ الْأَعْدَادِ', icon:'🔢', n:40,
  gen(r, d){
    const kinds = [['add', 'add', 'sub'], ['add', 'sub', 'mul2', 'add'], ['add', 'sub', 'mul3', 'half', 'grow', 'alt'], ['sq', 'fib', 'two', 'grow', 'mul2', 'alt']][d];
    const kind = pk(r, kinds), len = d === 3 ? 6 : 5;
    let v = [], ex, ops = null, k;
    const stepSet = [[1, 2, 3, 5, 10], [2, 3, 4, 5, 6, 7, 8, 9], [11, 12, 15, 20, 25], [3, 4, 6, 7, 8, 9, 12]][d];
    if (kind === 'add') { k = pk(r, stepSet); const s = ri(r, 0, d ? 20 : 10); v = range(len + 1).map(i => s + i * k); ex = 'add-' + k; ops = v.map(() => '+' + dg(k)); }
    if (kind === 'sub') { k = pk(r, stepSet); const s = k * (len + 1) + ri(r, 0, 20); v = range(len + 1).map(i => s - i * k); ex = 'sub-' + k; ops = v.map(() => '−' + dg(k)); }
    if (kind === 'mul2') { const s = ri(r, 1, d === 3 ? 6 : 3); v = range(len + 1).map(i => s * 2 ** i); ex = 'mul2'; ops = v.map(() => '×٢'); }
    if (kind === 'mul3') { const s = ri(r, 1, 2); v = range(len).map(i => s * 3 ** i); ex = 'mul3'; ops = v.map(() => '×٣'); }
    if (kind === 'half') { const s = pk(r, [64, 128, 96, 160, 192]); v = range(len + 1).map(i => s / 2 ** i); ex = 'half'; ops = v.map(() => '÷٢'); }
    if (kind === 'grow') { let s = ri(r, 1, 10); v = [s]; for (let i = 1; i <= len; i++) { s += i; v.push(s); } ex = 'grow'; ops = range(len).map(i => '+' + dg(i + 1)); }
    if (kind === 'sq') { const s = ri(r, 1, 3); v = range(len + 1).map(i => (s + i) ** 2); ex = 'sq'; }
    if (kind === 'fib') { const a = ri(r, 1, 3), b = ri(r, a, 4); v = [a, b]; while (v.length < len + 1) v.push(v[v.length - 1] + v[v.length - 2]); ex = 'fib'; }
    if (kind === 'alt') { const up = ri(r, 3, d === 3 ? 9 : 6), dn = ri(r, 1, up - 1); let s = ri(r, 1, 10); v = [s];
      for (let i = 0; i < len; i++) { s += i % 2 ? -dn : up; v.push(s); } ex = 'alt'; ops = range(len).map(i => i % 2 ? '−' + dg(dn) : '+' + dg(up)); }
    if (kind === 'two') { const s1 = ri(r, 1, 5), k1 = ri(r, 2, 5), s2 = ri(r, 20, 40), k2 = ri(r, 2, 5);
      v = range(len + 1).map(i => i % 2 ? s2 - Math.floor(i / 2) * k2 : s1 + (i / 2) * k1); ex = 'two'; }
    const mid = d >= 2 && r() < .35 && !['fib', 'two'].includes(kind);
    const hole = mid ? 2 + ri(r, 0, 1) : v.length - 1, ans = v[hole];
    const shown = mid ? v.slice(0, v.length) : v;
    const near = kind === 'add' || kind === 'sub' ? [k, -k, 1, -1, 2] : [1, -1, 2, -2, 5, 10];
    return { q:mid ? 'مَا الْعَدَدُ النَّاقِصُ؟' : 'مَا الْعَدَدُ التَّالِي؟', say:[mid ? 'q-seq-mid' : 'q-seq'], board:numRow(shown, hole),
      opts:numOpts(r, ans, near), exBoard:numRow(shown, -1, ops), ex:SAY['ex-seq-' + ex], exSay:['ex-seq-' + ex] };
  } });

// ===== numbers in shapes: one rule for every shape =====
const SHN_F = {
  tsum:{ k:'t', f:(a, b, c) => a + b + c, gen:r => [ri(r, 1, 9), ri(r, 1, 9), ri(r, 1, 9)] },
  tmul:{ k:'t', f:(a, b, c) => a * b * c, gen:r => [ri(r, 1, 4), ri(r, 2, 4), ri(r, 1, 5)] },
  tmix:{ k:'t', f:(a, b, c) => (b + c) * a, gen:r => [ri(r, 2, 4), ri(r, 1, 6), ri(r, 1, 6)] },
  rsum:{ k:'r', f:(a, b) => a + b, gen:r => [ri(r, 1, 20), ri(r, 1, 20)] },
  rmul:{ k:'r', f:(a, b) => a * b, gen:r => [ri(r, 2, 9), ri(r, 2, 9)] },
  rdif:{ k:'r', f:(a, b) => Math.abs(a - b), gen:r => [ri(r, 5, 30), ri(r, 1, 30)] },
  xsum:{ k:'x', f:(a, b, c, e) => a + b + c + e, gen:r => [ri(r, 1, 12), ri(r, 1, 12), ri(r, 1, 12), ri(r, 1, 12)] },
};
const SHN_D = [['tsum', 'rsum'], ['rmul', 'xsum', 'tsum'], ['tmix', 'rdif', 'xsum', 'rmul'], ['tmul', 'tmix', 'rdif']];
Object.assign(SAY, {
  'ex-shn-tsum':'الْعَدَدُ فِي الْوَسَطِ هُوَ مَجْمُوعُ الْأَعْدَادِ الثَّلَاثَةِ فِي الزَّوَايَا.',
  'ex-shn-tmul':'الْعَدَدُ فِي الْوَسَطِ هُوَ حَاصِلُ ضَرْبِ الْأَعْدَادِ الثَّلَاثَةِ فِي الزَّوَايَا.',
  'ex-shn-tmix':'نَجْمَعُ الْعَدَدَيْنِ فِي الْأَسْفَلِ، ثُمَّ نَضْرِبُ الْمَجْمُوعَ فِي الْعَدَدِ الَّذِي فِي الْأَعْلَى.',
  'ex-shn-rsum':'الْعَدَدُ فِي السَّقْفِ هُوَ مَجْمُوعُ الْعَدَدَيْنِ تَحْتَهُ.',
  'ex-shn-rmul':'الْعَدَدُ فِي السَّقْفِ هُوَ حَاصِلُ ضَرْبِ الْعَدَدَيْنِ تَحْتَهُ.',
  'ex-shn-rdif':'الْعَدَدُ فِي السَّقْفِ هُوَ الْفَرْقُ بَيْنَ الْعَدَدَيْنِ تَحْتَهُ: الْكَبِيرُ نَاقِصَ الصَّغِيرِ.',
  'ex-shn-xsum':'الْعَدَدُ فِي الْوَسَطِ هُوَ مَجْمُوعُ الْأَعْدَادِ الْأَرْبَعَةِ حَوْلَهُ.',
  'q-shn':'اكْتَشِفِ الْقَاعِدَةَ: مَا الْعَدَدُ النَّاقِصُ؟',
  'h-shn':'فِي كُلِّ شَكْلٍ أَعْدَادٌ تَتْبَعُ الْقَاعِدَةَ نَفْسَهَا. اكْتَشِفْهَا مِنَ الْأَشْكَالِ الْكَامِلَةِ.',
});
function shnDraw(kind, x, y, nums, res, q){
  const N = (v, nx, ny, sz = 22, c = '#2b2f55') => txt(nx, ny, v, sz, c);
  const R = q ? N('؟', x, kind === 'r' ? y - 38 : y + (kind === 't' ? 8 : 0), 26, '#e0a800') : N(dg(res), x, kind === 'r' ? y - 38 : y + (kind === 't' ? 8 : 0), 22, '#e63946');
  if (kind === 't') return `<polygon points="${x},${y - 44} ${x + 44},${y + 38} ${x - 44},${y + 38}" fill="#fff" stroke="#3d7dff" stroke-width="3.5" stroke-linejoin="round"/>` +
    N(dg(nums[0]), x, y - 57, 20) + N(dg(nums[1]), x + 46, y + 52, 20) + N(dg(nums[2]), x - 46, y + 52, 20) + R;
  if (kind === 'r') return `<polygon points="${x - 46},${y - 18} ${x},${y - 62} ${x + 46},${y - 18}" fill="#ffe3e3" stroke="#e63946" stroke-width="3.5" stroke-linejoin="round"/>` +
    `<rect x="${x - 40}" y="${y - 18}" width="80" height="60" fill="#fff" stroke="#e63946" stroke-width="3.5"/>` + `<line x1="${x}" y1="${y - 18}" x2="${x}" y2="${y + 42}" stroke="#e8b4b4" stroke-width="2"/>` +
    N(dg(nums[0]), x + 20, y + 12) + N(dg(nums[1]), x - 20, y + 12) + R;
  return `<circle cx="${x}" cy="${y}" r="24" fill="#fff" stroke="#2fbf71" stroke-width="3.5"/>` +
    [[0, -46], [0, 46], [46, 0], [-46, 0]].map(([dx, dy], i) => `<circle cx="${x + dx}" cy="${y + dy}" r="17" fill="#effaf3" stroke="#2fbf71" stroke-width="2.5"/>` + N(dg(nums[i]), x + dx, y + dy, 18)).join('') + R;
}
T('shn', { w:'m', name:'أَعْدَادٌ فِي الْأَشْكَالِ', icon:'🔺', n:30,
  gen(r, d){
    const fam = pk(r, SHN_D[d]), F = SHN_F[fam], others = Object.entries(SHN_F).filter(([k, g]) => g.k === F.k && k !== fam);
    let ex;
    for (let a = 0; a < 100; a++) {
      ex = range(3).map(() => F.gen(r));
      const okAll = ex.every(e => F.f(...e) >= 0 && F.f(...e) <= 120);
      const clash = others.some(([, g]) => ex.slice(0, 2).every(e => g.f(...e) === F.f(...e)));
      if (okAll && !clash) break;
    }
    const ans = F.f(...ex[2]), W = 360, H = F.k === 'x' ? 140 : 150, cw = W / 3;
    const draw = q => SV(W, H, ex.map((e, i) => shnDraw(F.k, W - cw * (i + .5), F.k === 'r' ? 80 : 74, e, F.f(...e), q && i === 2)).join(''));
    return { q:'اكْتَشِفِ الْقَاعِدَةَ: مَا الْعَدَدُ النَّاقِصُ؟', say:['q-shn'], board:draw(true), opts:numOpts(r, ans),
      exBoard:draw(false), ex:SAY['ex-shn-' + fam], exSay:['ex-shn-' + fam] };
  } });

// ===== number pyramid: every brick is the sum of the two under it =====
T('pyr', { w:'m', name:'هَرَمُ الْأَعْدَادِ', icon:'🧱', n:30,
  gen(r, d){
    const n = d < 2 ? 3 : 4, top = [9, 12, 10, 15][d];
    const P = [range(n).map(() => ri(r, 1, top))];
    for (let k = 1; k < n; k++) P.push(range(n - k).map(i => P[k - 1][i] + P[k - 1][i + 1]));
    // which bricks are hidden: only the asked one, or a chain that needs two steps
    const all = []; P.forEach((row, k) => row.forEach((_, i) => all.push([k, i])));
    let hide, ask;
    const solvable = (H, A) => { const known = P.map((row, k) => row.map((_, i) => !H.some(h => h[0] === k && h[1] === i)));
      for (let ch = true; ch;) { ch = false;
        for (let k = 1; k < n; k++) for (let i = 0; i < n - k; i++) {
          const t = known[k][i], L = known[k - 1][i], R = known[k - 1][i + 1];
          if (!t && L && R) { known[k][i] = true; ch = true; }
          if (t && L && !R) { known[k - 1][i + 1] = true; ch = true; }
          if (t && !L && R) { known[k - 1][i] = true; ch = true; } } }
      return known[A[0]][A[1]]; };
    for (let a = 0; a < 100; a++) {
      if (d === 0) { ask = [n - 1, 0]; hide = [ask, ...all.filter(([k]) => k === 1)]; }
      else if (d === 1) { ask = [0, ri(r, 0, n - 1)]; hide = [ask]; }
      else if (d === 2) { ask = [n - 1, 0]; hide = all.filter(([k]) => k > 0); }
      else { ask = pk(r, all.filter(([k]) => k < n - 1)); const more = shuf(r, all.filter(b => b + '' !== ask + '')).slice(0, 3); hide = [ask, ...more]; }
      if (solvable(hide, ask)) break;
    }
    if (!solvable(hide, ask)) hide = [ask];
    const ans = P[ask[0]][ask[1]], bw = 76, bh = 48, W = 360, H = n * (bh + 6) + 10;
    const draw = (showAll) => SV(W, H, P.map((row, k) => row.map((v, i) => {
      const x = W / 2 - (row.length * bw) / 2 + i * bw, y = H - 6 - (k + 1) * (bh + 6) + 6, h = hide.some(b => b[0] === k && b[1] === i), q = k === ask[0] && i === ask[1];
      return `<rect x="${f1(x + 2)}" y="${f1(y)}" width="${bw - 4}" height="${bh}" rx="8" fill="${q ? '#fff7d6' : h && !showAll ? '#e9e4d4' : '#ffd9b3'}" stroke="${q ? '#ffc21a' : '#c97b3a'}" stroke-width="3" ${q && !showAll ? 'stroke-dasharray="7 5"' : ''}/>` +
        txt(x + bw / 2, y + bh / 2, q && !showAll ? '؟' : h && !showAll ? '' : dg(v), 24, q ? (showAll ? '#e63946' : '#e0a800') : '#2b2f55');
    }).join('')).join(''));
    return { q:'كُلُّ حَجَرٍ هُوَ مَجْمُوعُ الْحَجَرَيْنِ تَحْتَهُ. مَا الْعَدَدُ النَّاقِصُ؟', say:['q-pyr'], board:draw(false), opts:numOpts(r, ans),
      exBoard:draw(true), ex:ask[0] === 0 || d === 3 ? SAY['ex-pyr-sub'] : SAY['ex-pyr'], exSay:[ask[0] === 0 || d === 3 ? 'ex-pyr-sub' : 'ex-pyr'] };
  } });
SAY['q-pyr'] = 'كُلُّ حَجَرٍ هُوَ مَجْمُوعُ الْحَجَرَيْنِ تَحْتَهُ. مَا الْعَدَدُ النَّاقِصُ؟';
SAY['ex-pyr'] = 'نَجْمَعُ كُلَّ حَجَرَيْنِ مُتَجَاوِرَيْنِ، وَنَكْتُبُ الْمَجْمُوعَ فِي الْحَجَرِ الَّذِي فَوْقَهُمَا.';
SAY['ex-pyr-sub'] = 'إِذَا عَرَفْتَ الْحَجَرَ الَّذِي فَوْقُ، فَاطْرَحْ مِنْهُ الْحَجَرَ الْمُجَاوِرَ، تَجِدِ النَّاقِصَ.';
SAY['h-pyr'] = 'هَرَمٌ مِنَ الْحِجَارَةِ: كُلُّ حَجَرٍ يُسَاوِي مَجْمُوعَ الْحَجَرَيْنِ اللَّذَيْنِ تَحْتَهُ.';
