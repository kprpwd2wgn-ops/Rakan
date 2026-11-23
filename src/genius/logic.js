// ---------- world 2: logic and investigation (made by rules) ----------

// a tile: { s: shape, c: colour, rot, n: how many, z: size 0..2 }
function tile(t, x, y, S = 80, frame = true){
  let b = frame ? `<rect x="${f1(x - S / 2)}" y="${f1(y - S / 2)}" width="${S}" height="${S}" rx="12" fill="#fff" stroke="#c9c3a8" stroke-width="3"/>` : '';
  const n = t.n || 1, z = [.2, .28, .36][t.z == null ? 2 : t.z] * S;
  if (n === 1) return b + shape(t.s, x, y, z, COL[t.c], t.rot || 0);
  const P = { 2:[[-.22, 0], [.22, 0]], 3:[[-.24, .18], [.24, .18], [0, -.2]], 4:[[-.2, -.2], [.2, -.2], [-.2, .2], [.2, .2]],
    5:[[-.24, -.24], [.24, -.24], [0, 0], [-.24, .24], [.24, .24]], 6:[[-.25, -.2], [0, -.2], [.25, -.2], [-.25, .2], [0, .2], [.25, .2]] }[n] || [];
  return b + P.map(p => shape(t.s, x + p[0] * S, y + p[1] * S, S * (n > 4 ? .09 : .11), COL[t.c], t.rot || 0, '#2b2f55', 2)).join('');
}
const tkey = t => [t.s, t.c, t.rot || 0, t.n || 1, t.z == null ? 2 : t.z].join('|');
const tilePic = t => SV(100, 100, tile(t, 50, 50, 92));
// a row of tiles from right to left, the last one a question mark
function tileRow(seq, ask = true){
  const n = seq.length + (ask ? 1 : 0), per = Math.min(n, 4), rows = Math.ceil(n / per), S = 78, gap = 10, W = 360;
  const x0 = (W - (per * S + (per - 1) * gap)) / 2;
  let b = '';
  for (let i = 0; i < n; i++) {
    const col = i % per, row = Math.floor(i / per), x = W - x0 - col * (S + gap) - S / 2, y = 12 + row * (S + gap) + S / 2;
    if (i < seq.length) b += tile(seq[i], x, y, S);
    else b += `<rect x="${f1(x - S / 2)}" y="${f1(y - S / 2)}" width="${S}" height="${S}" rx="12" fill="#fff7d6" stroke="#ffc21a" stroke-width="4" stroke-dasharray="8 6"/>` + txt(x, y, '؟', 40, '#e0a800');
  }
  return SV(W, 24 + rows * S + (rows - 1) * gap, b);
}

// ===== what comes next? =====
const SHAPES = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond', 'hexagon'];
T('nxt', { w:'l', name:'مَا التَّالِي؟', icon:'➡️', n:36,
  gen(r, d){
    const rules = [['col', 'shape', 'grow'], ['col3', 'rot', 'grow2', 'shape3'], ['two', 'rot45', 'size', 'grow3'], ['rep', 'rotcol', 'two', 'down']][d];
    const rule = pk(r, rules), len = d < 2 ? 5 : 6;
    const S = shuf(r, SHAPES), C = shuf(r, COLS), base = { s:S[0], c:C[0], rot:0, n:1, z:2 };
    let at, ex;
    if (rule === 'col') { at = i => ({ ...base, c:C[i % 2] }); ex = 'col'; }
    if (rule === 'col3') { at = i => ({ ...base, c:C[i % 3] }); ex = 'col'; }
    if (rule === 'shape') { at = i => ({ ...base, s:S[i % 2] }); ex = 'shape'; }
    if (rule === 'shape3') { at = i => ({ ...base, s:S[i % 3] }); ex = 'shape'; }
    if (rule === 'grow') { at = i => ({ ...base, n:i + 1 }); ex = 'grow'; }
    if (rule === 'grow2') { at = i => ({ ...base, n:i + 1, c:C[i % 2] }); ex = 'two'; }
    if (rule === 'grow3') { at = i => ({ ...base, s:S[i % 2], n:i + 1 }); ex = 'two'; }
    if (rule === 'down') { at = i => ({ ...base, n:6 - i }); ex = 'grow'; }
    if (rule === 'rot') { const dir = pk(r, [90, -90]); at = i => ({ ...base, s:'arrow', rot:i * dir }); ex = 'rot'; }
    if (rule === 'rot45') { const dir = pk(r, [45, -45]); at = i => ({ ...base, s:'arrow', rot:i * dir }); ex = 'rot'; }
    if (rule === 'rotcol') { const dir = pk(r, [90, -90, 45]); at = i => ({ ...base, s:'arrow', rot:i * dir, c:C[i % 2] }); ex = 'two'; }
    if (rule === 'size') { at = i => ({ ...base, z:i % 3 }); ex = 'size'; }
    if (rule === 'two') { at = i => ({ ...base, s:S[i % 2], c:C[i % 3] }); ex = 'two'; }
    if (rule === 'rep') { const pat = pk(r, [[0, 0, 1], [0, 1, 1], [0, 1, 0, 2]]); at = i => ({ ...base, s:S[pat[i % pat.length]], c:C[pat[i % pat.length]] }); ex = 'rep'; }
    const L = ['grow', 'grow2', 'grow3', 'down'].includes(rule) ? 5 : rule === 'rep' ? 6 : len; // dots go up to six
    const seq = range(L).map(at), ans = at(L);
    if (ans.rot) ans.rot = ((ans.rot % 360) + 360) % 360;
    seq.forEach(t => { t.rot = ((t.rot % 360) + 360) % 360; });
    // wrong answers: change one thing about the right one
    const wrong = [], seen = new Set([tilePic(ans)]); // compared as drawn: a turned circle looks the same
    const tweak = [t => ({ ...t, c:pk(r, C.filter(c => c !== t.c)) }), t => ({ ...t, s:pk(r, S.filter(s => s !== t.s && s !== 'arrow')) }),
      t => ({ ...t, n:Math.min(6, Math.max(1, (t.n || 1) + pk(r, [1, -1, 2]))) }), t => ({ ...t, rot:(t.rot + pk(r, [90, 180, 270, 45])) % 360 }),
      t => ({ ...t, z:(t.z + pk(r, [1, 2])) % 3 }), t => ({ ...seq[L - 1] }), t => ({ ...seq[L - 2] })];
    for (let a = 0; wrong.length < 3 && a < 60; a++) {
      let w = pk(r, tweak)(ans);
      if (ans.s === 'arrow' && w.s !== 'arrow') w = { ...w, s:'arrow' };
      if (ans.s !== 'arrow' && (rule.startsWith('rot') || (w.rot && ans.s !== 'arrow'))) w.rot = 0;
      if (w.s === 'circle' && ans.s === 'circle' && w.rot !== ans.rot) continue;
      if (!seen.has(tilePic(w))) { seen.add(tilePic(w)); wrong.push(w); }
    }
    const say = { col:'الْأَلْوَانُ تَتَكَرَّرُ بِالتَّرْتِيبِ نَفْسِهِ.', shape:'الْأَشْكَالُ تَتَكَرَّرُ بِالتَّرْتِيبِ نَفْسِهِ.', grow:'الْعَدَدُ يَتَغَيَّرُ بِالْمِقْدَارِ نَفْسِهِ كُلَّ مَرَّةٍ.',
      rot:'السَّهْمُ يَدُورُ بِالْمِقْدَارِ نَفْسِهِ كُلَّ مَرَّةٍ.', size:'الْأَحْجَامُ تَتَكَرَّرُ: صَغِيرٌ، ثُمَّ مُتَوَسِّطٌ، ثُمَّ كَبِيرٌ.',
      two:'هُنَا قَاعِدَتَانِ مَعًا، فَانْتَبِهْ لِكِلْتَيْهِمَا.', rep:'الْمَجْمُوعَةُ نَفْسُهَا تَتَكَرَّرُ مَرَّةً بَعْدَ مَرَّةٍ.' }[ex];
    return { q:'مَا الشَّكْلُ التَّالِي؟', say:['q-nxt'], board:tileRow(seq), opts:opts(r, tilePic(ans), wrong.map(tilePic), { pic:true }),
      exBoard:tileRow([...seq, ans], false), ex:say, exSay:['ex-nxt-' + ex] };
  } });
SAY['q-nxt'] = 'مَا الشَّكْلُ التَّالِي؟';
SAY['ex-nxt-col'] = 'الْأَلْوَانُ تَتَكَرَّرُ بِالتَّرْتِيبِ نَفْسِهِ.';
SAY['ex-nxt-shape'] = 'الْأَشْكَالُ تَتَكَرَّرُ بِالتَّرْتِيبِ نَفْسِهِ.';
SAY['ex-nxt-grow'] = 'الْعَدَدُ يَتَغَيَّرُ بِالْمِقْدَارِ نَفْسِهِ كُلَّ مَرَّةٍ.';
SAY['ex-nxt-rot'] = 'السَّهْمُ يَدُورُ بِالْمِقْدَارِ نَفْسِهِ كُلَّ مَرَّةٍ.';
SAY['ex-nxt-size'] = 'الْأَحْجَامُ تَتَكَرَّرُ: صَغِيرٌ، ثُمَّ مُتَوَسِّطٌ، ثُمَّ كَبِيرٌ.';
SAY['ex-nxt-two'] = 'هُنَا قَاعِدَتَانِ مَعًا، فَانْتَبِهْ لِكِلْتَيْهِمَا.';
SAY['ex-nxt-rep'] = 'الْمَجْمُوعَةُ نَفْسُهَا تَتَكَرَّرُ مَرَّةً بَعْدَ مَرَّةٍ.';
SAY['h-nxt'] = 'الْأَشْكَالُ تَسِيرُ عَلَى قَاعِدَةٍ. اكْتَشِفْهَا، وَاخْتَرِ الشَّكْلَ التَّالِيَ.';

// ===== numbers in shapes (like the video: each shape has its own sequence) =====
function numShape(kind, x, y, v, S = 74, q = false){
  const col = { square:'#3d7dff', triangle:'#e63946', circle:'#2fbf71' }[kind];
  const st = `fill="${q ? '#fff7d6' : '#fff'}" stroke="${col}" stroke-width="4" ${q ? 'stroke-dasharray="7 5"' : ''}`;
  const h = S / 2;
  const sh = kind === 'square' ? `<rect x="${f1(x - h * .9)}" y="${f1(y - h * .9)}" width="${f1(h * 1.8)}" height="${f1(h * 1.8)}" ${st}/>`
    : kind === 'circle' ? `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(h * .95)}" ${st}/>`
    : `<polygon points="${f1(x)},${f1(y - h)} ${f1(x + h * 1.05)},${f1(y + h * .85)} ${f1(x - h * 1.05)},${f1(y + h * .85)}" ${st}/>`;
  const ty = kind === 'triangle' ? y + h * .3 : y;
  return sh + txt(x, ty, q ? '؟' : dg(v), String(v).length > 2 ? 22 : 27, q ? '#e0a800' : '#2b2f55');
}
T('sqn', { w:'l', name:'أَعْدَادُ الْأَشْكَالِ', icon:'🔷', n:30,
  gen(r, d){
    const kinds = d === 3 ? ['square', 'triangle', 'circle'] : ['square', 'triangle'], g = kinds.length;
    const mul = d >= 2 && r() < .5, f = pk(r, [2, 3]);
    const groups = kinds.map(() => {
      if (mul) { const s = ri(r, 1, f === 3 ? 4 : 6); return [s, s * f, s * f * f]; }
      const s = ri(r, 1, [9, 15, 20, 30][d]), k = ri(r, [1, 2, 3, 3][d], [5, 10, 12, 15][d]) * (d >= 1 && r() < .3 ? -1 : 1);
      const a = k < 0 ? s + 2 * -k + ri(r, 0, 5) : s;
      return [a, a + k, a + 2 * k];
    });
    const seq = []; for (let j = 0; j < 3; j++) kinds.forEach((kd, gi) => seq.push({ kd, v:groups[gi][j] }));
    const last = seq.pop(), ans = last.v;
    const n = seq.length + 1, per = g === 3 ? 3 : 4, rows = Math.ceil(n / per), S = 74, gap = 16, W = 360;
    const x0 = (W - (per * S + (per - 1) * gap)) / 2;
    const draw = (all) => { let b = ''; for (let i = 0; i < n; i++) { const col = i % per, row = Math.floor(i / per);
      const x = W - x0 - col * (S + gap) - S / 2, y = 14 + row * (S + gap) + S / 2, it = i < seq.length ? seq[i] : last;
      b += numShape(it.kd, x, y, it.v, S, i === seq.length && !all); } return SV(W, 28 + rows * S + (rows - 1) * gap, b); };
    const name = { square:'🟦', triangle:'🔺', circle:'🟢' };
    const op = (gi) => { const G = groups[gi]; return mul ? `×${dg(f)}` : (G[1] - G[0] >= 0 ? '+' : '−') + dg(Math.abs(G[1] - G[0])); };
    const ex = kinds.map((kd, gi) => `${name[kd]} ${groups[gi].map(dg).join(' ← ')} (${op(gi)})`).join('\n');
    const G = groups[g - 1], naive = G[1] + (G[1] - G[0]) - ans; // the answer of someone who mixes up the two sequences
    return { q:'مَا الْعَدَدُ الَّذِي مَكَانَ عَلَامَةِ الِاسْتِفْهَامِ؟', say:['q-sqn'], board:draw(false), opts:numOpts(r, ans, mul ? [naive || 1, 1, -1, ans] : [1, -1, 2, -2, 10]),
      exBoard:draw(true), ex:'كُلُّ شَكْلٍ لَهُ سِلْسِلَتُهُ:\n' + ex, exSay:[mul ? 'ex-sqn-mul' : 'ex-sqn-add'] };
  } });
SAY['q-sqn'] = 'مَا الْعَدَدُ الَّذِي مَكَانَ عَلَامَةِ الِاسْتِفْهَامِ؟';
SAY['ex-sqn-add'] = 'كُلُّ شَكْلٍ لَهُ سِلْسِلَتُهُ الْخَاصَّةُ. انْظُرْ إِلَى الْأَشْكَالِ الْمُتَشَابِهَةِ مَعًا: كَمْ تَزِيدُ أَوْ تَنْقُصُ كُلَّ مَرَّةٍ؟';
SAY['ex-sqn-mul'] = 'كُلُّ شَكْلٍ لَهُ سِلْسِلَتُهُ، وَفِي كُلِّ سِلْسِلَةٍ نَضْرِبُ فِي الْعَدَدِ نَفْسِهِ.';
SAY['h-sqn'] = 'الْمُرَبَّعَاتُ لَهَا سِلْسِلَةٌ، وَالْمُثَلَّثَاتُ لَهَا سِلْسِلَةٌ أُخْرَى. لَا تَخْلِطْ بَيْنَهُمَا!';

// ===== the 3 x 3 board =====
T('mtx', { w:'l', name:'اللَّوْحَةُ النَّاقِصَةُ', icon:'🔲', n:30,
  gen(r, d){
    const S = shuf(r, ['circle', 'square', 'triangle', 'star', 'heart', 'diamond']).slice(0, 3), C = shuf(r, COLS).slice(0, 3);
    const lat = () => { const a = shuf(r, [0, 1, 2]), b = shuf(r, [0, 1, 2]); return (i, j) => a[(b[i] + j) % 3]; }; // a Latin square
    const LS = lat(), LC = lat(), rule = ['shape', 'color', 'count', 'all'][d];
    const cnt = shuf(r, [1, 2, 3]);
    const cell = (i, j) => rule === 'shape' ? { s:S[LS(i, j)], c:C[0], n:1 }
      : rule === 'color' ? { s:S[LS(i, j)], c:C[LC(i, j)], n:1 }
      : rule === 'count' ? { s:S[i], c:C[i], n:cnt[j] }
      : { s:S[LS(i, j)], c:C[LC(i, j)], n:cnt[j] };
    const ans = cell(2, 2), Sz = 96, W = 3 * Sz + 24;
    const board = (fill) => { let b = ''; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const x = W - 12 - j * Sz - Sz / 2, y = 12 + i * Sz + Sz / 2;
      b += i === 2 && j === 2 && !fill ? `<rect x="${f1(x - Sz / 2 + 4)}" y="${f1(y - Sz / 2 + 4)}" width="${Sz - 8}" height="${Sz - 8}" rx="12" fill="#fff7d6" stroke="#ffc21a" stroke-width="4" stroke-dasharray="8 6"/>` + txt(x, y, '؟', 44, '#e0a800')
        : tile(cell(i, j), x, y, Sz - 8); }
      return SV(W, W, b); };
    const wrong = [], seen = new Set([tkey(ans)]);
    const tw = [t => ({ ...t, s:pk(r, S.filter(s => s !== t.s)) }), t => ({ ...t, c:pk(r, C.filter(c => c !== t.c)) }), t => ({ ...t, n:pk(r, [1, 2, 3].filter(n => n !== t.n)) }),
      t => ({ ...t, s:pk(r, S.filter(s => s !== t.s)), c:pk(r, C.filter(c => c !== t.c)) })];
    for (let a = 0; wrong.length < 3 && a < 50; a++) { const w = pk(r, tw)(ans); if (!seen.has(tkey(w))) { seen.add(tkey(w)); wrong.push(w); } }
    const say = { shape:'فِي كُلِّ صَفٍّ تَظْهَرُ الْأَشْكَالُ الثَّلَاثَةُ، كُلُّ شَكْلٍ مَرَّةً وَاحِدَةً.',
      color:'فِي كُلِّ صَفٍّ الْأَشْكَالُ الثَّلَاثَةُ، وَفِي كُلِّ صَفٍّ الْأَلْوَانُ الثَّلَاثَةُ أَيْضًا.',
      count:'لِكُلِّ صَفٍّ شَكْلُهُ وَلَوْنُهُ، وَالْعَدَدُ يَتَغَيَّرُ مِنْ عَمُودٍ إِلَى عَمُودٍ بِالتَّرْتِيبِ نَفْسِهِ.',
      all:'ثَلَاثُ قَوَاعِدَ مَعًا: الشَّكْلُ، وَاللَّوْنُ، وَالْعَدَدُ. كُلُّ وَاحِدَةٍ تَظْهَرُ مَرَّةً فِي كُلِّ صَفٍّ.' }[rule];
    return { q:'أَيُّ قِطْعَةٍ تُكْمِلُ اللَّوْحَةَ؟', say:['q-mtx'], board:board(false), opts:opts(r, tilePic(ans), wrong.map(tilePic), { pic:true }),
      exBoard:board(true), ex:say, exSay:['ex-mtx-' + rule] };
  } });
SAY['q-mtx'] = 'أَيُّ قِطْعَةٍ تُكْمِلُ اللَّوْحَةَ؟';
SAY['ex-mtx-shape'] = 'فِي كُلِّ صَفٍّ تَظْهَرُ الْأَشْكَالُ الثَّلَاثَةُ، كُلُّ شَكْلٍ مَرَّةً وَاحِدَةً.';
SAY['ex-mtx-color'] = 'فِي كُلِّ صَفٍّ الْأَشْكَالُ الثَّلَاثَةُ، وَفِي كُلِّ صَفٍّ الْأَلْوَانُ الثَّلَاثَةُ أَيْضًا.';
SAY['ex-mtx-count'] = 'لِكُلِّ صَفٍّ شَكْلُهُ وَلَوْنُهُ، وَالْعَدَدُ يَتَغَيَّرُ مِنْ عَمُودٍ إِلَى عَمُودٍ بِالتَّرْتِيبِ نَفْسِهِ.';
SAY['ex-mtx-all'] = 'ثَلَاثُ قَوَاعِدَ مَعًا: الشَّكْلُ، وَاللَّوْنُ، وَالْعَدَدُ. كُلُّ وَاحِدَةٍ تَظْهَرُ مَرَّةً فِي كُلِّ صَفٍّ.';
SAY['h-mtx'] = 'لَوْحَةٌ فِيهَا تِسْعُ قِطَعٍ، وَوَاحِدَةٌ نَاقِصَةٌ. انْظُرْ إِلَى الصُّفُوفِ وَالْأَعْمِدَةِ.';
