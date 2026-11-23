// ---------- world 1: visual focus (part 1) ----------

// ===== find the different one =====
const ODD_SETS = [
  // [the many, the different one]
  [['🍎','🍏'],['🌳','🌲'],['😀','😎'],['🐶','🐱'],['⚽','🏀'],['🚗','🚕'],['🌞','🌝'],['🐥','🐧']],
  [['ب','ت'],['ج','خ'],['ح','خ'],['د','ذ'],['ر','ز'],['س','ش'],['ص','ض'],['ط','ظ'],['ع','غ'],['ف','ق']],
  [['b','d'],['p','q'],['6','9'],['E','F'],['M','N'],['O','Q'],['3','8'],['C','G'],['٢','٣'],['ن','ت']],
  [['ص','ض'],['ف','ق'],['ع','غ'],['ط','ظ'],['R','P'],['B','8'],['m','n'],['W','V'],['٧','٨'],['ي','ئ']],
];
T('odd', { w:'v', name:'أَوْجِدِ الْمُخْتَلِفَ', icon:'🎯', n:40,
  gen(r, d){
    const n = [4, 5, 6, 7][d], [a, b] = pk(r, ODD_SETS[d]), k = ri(r, 0, n * n - 1);
    const W = 360, c = W / n, fs = c * (d ? .62 : .66);
    let cells = '';
    for (let i = 0; i < n * n; i++) {
      const x = (i % n + .5) * c, y = (Math.floor(i / n) + .5) * c;
      cells += `<g data-k="${i}"><rect x="${f1(x - c / 2)}" y="${f1(y - c / 2)}" width="${f1(c)}" height="${f1(c)}" fill="transparent"/>` +
        (d ? txt(x, y, i === k ? b : a, fs, '#2b2f55', 'font-family="Tahoma,Arial,sans-serif"') : emo(x, y, i === k ? b : a, fs)) + '</g>';
    }
    const kx = (k % n + .5) * c, ky = (Math.floor(k / n) + .5) * c;
    const ring = `<circle cx="${f1(kx)}" cy="${f1(ky)}" r="${f1(c * .5)}" fill="none" stroke="#ff4d4d" stroke-width="5"/>`;
    return { q:'أَيْنَ الْمُخْتَلِفُ؟ ابْحَثْ عَنْهُ بِسُرْعَةٍ!', say:['q-odd'], board:SV(W, W, cells), tap:true, k:String(k),
      exBoard:SV(W, W, cells + ring), ex:`الْمُخْتَلِفُ هُوَ «${b}» بَيْنَ «${a}».`, exSay:['ex-odd'] };
  } });
SAY['q-odd'] = 'أَيْنَ الْمُخْتَلِفُ؟ ابْحَثْ عَنْهُ بِسُرْعَةٍ!';
SAY['ex-odd'] = 'عَيْنُ صَقْرٍ! هَذَا هُوَ الْمُخْتَلِفُ.';
SAY['h-odd'] = 'كُلُّ الصُّوَرِ مُتَشَابِهَةٌ، إِلَّا وَاحِدَةً. اضْغَطْ عَلَى الْمُخْتَلِفِ.';

// ===== how many? =====
const CNT = [
  { e:'🍎', w:'تُفَّاحَةً', like:['🍅','🍏'] }, { e:'⭐', w:'نَجْمَةً', like:['🌟','🌙'] }, { e:'🐟', w:'سَمَكَةً', like:['🐠','🐡'] },
  { e:'🦋', w:'فَرَاشَةً', like:['🐝','🐞'] }, { e:'🌸', w:'زَهْرَةً', like:['🌼','🌺'] }, { e:'🚗', w:'سَيَّارَةً', like:['🚕','🚙'] },
  { e:'🎈', w:'بَالُونًا', like:['🎀','🍭'] }, { e:'⚽', w:'كُرَةً', like:['🏀','🏐'] }, { e:'🐥', w:'كَتْكُوتًا', like:['🐤','🐣'] },
  { e:'🍌', w:'مَوْزَةً', like:['🌽','🥕'] }, { e:'🐢', w:'سُلَحْفَاةً', like:['🐸','🐊'] }, { e:'🍩', w:'كَعْكَةً', like:['🍪','🥯'] },
];
const OTHER = ['🍇','🍓','🐘','🐙','🌵','🍄','🧸','🚀','🌈','🦒','🍉','🐳','🏠','🎁'];
// spots spread over an area without overlapping
function spots(r, n, W, H, gap){
  const out = []; let tries = 0;
  while (out.length < n && tries < 4000) {
    tries++;
    const x = gap / 2 + r() * (W - gap), y = gap / 2 + r() * (H - gap);
    if (out.every(p => (p[0] - x) ** 2 + (p[1] - y) ** 2 > gap * gap)) out.push([x, y]);
    if (tries % 800 === 0) gap *= .92;
  }
  return out;
}
T('cnt', { w:'v', name:'كَمْ عَدَدُهَا؟', icon:'🔢', n:40,
  gen(r, d){
    const t = CNT[ri(r, 0, CNT.length - 1)], ti = CNT.indexOf(t);
    const want = ri(r, [3, 5, 7, 9][d], [6, 9, 12, 15][d]), total = want + [5, 9, 12, 15][d];
    const W = 360, H = 300, sz = [44, 38, 33, 30][d];
    const P = spots(r, total, W, H, sz * 1.05);
    const others = d >= 2 ? [...t.like, ...shuf(r, OTHER).slice(0, 2)] : d === 1 ? [t.like[0], ...shuf(r, OTHER).slice(0, 3)] : shuf(r, OTHER).slice(0, 3);
    const kinds = shuf(r, P.map((_, i) => i < want ? t.e : others[i % others.length]));
    let body = '', marks = '', c = 0;
    P.forEach((p, i) => {
      const rot = d === 3 ? ri(r, -35, 35) : 0;
      body += emo(p[0], p[1], kinds[i], sz, rot ? `transform="rotate(${rot} ${f1(p[0])} ${f1(p[1])})"` : '');
    });
    // numbered marks in reading order (right to left, top to bottom), for the answer panel
    P.map((p, i) => ({ p, i })).filter(o => kinds[o.i] === t.e).sort((a, b) => Math.round(a.p[1] / 45) - Math.round(b.p[1] / 45) || b.p[0] - a.p[0])
      .forEach(o => { c++; marks += `<circle cx="${f1(o.p[0])}" cy="${f1(o.p[1])}" r="${f1(sz * .62)}" fill="none" stroke="#ff4d4d" stroke-width="3"/>` +
        `<circle cx="${f1(o.p[0] + sz * .45)}" cy="${f1(o.p[1] - sz * .45)}" r="11" fill="#ff4d4d"/>` + txt(o.p[0] + sz * .45, o.p[1] - sz * .45, dg(c), 14, '#fff'); });
    const realWant = kinds.filter(k => k === t.e).length;
    return { q:`كَمْ ${t.w} تَرَى؟`, top:t.e, say:['q-cnt-' + ti], board:SV(W, H, body), opts:numOpts(r, realWant, [1, -1, 2, -2, 3]),
      exBoard:SV(W, H, body + marks), ex:`عَدَدُهَا ${dg(realWant)}.`, exSay:['ex-cnt'] };
  } });
CNT.forEach((t, i) => { SAY['q-cnt-' + i] = `كَمْ ${t.w} تَرَى؟`; });
SAY['ex-cnt'] = 'عُدَّ بِتَرْتِيبٍ: سَطْرًا سَطْرًا، حَتَّى لَا تَنْسَى وَاحِدَةً، وَلَا تَعُدَّهَا مَرَّتَيْنِ.';
SAY['h-cnt'] = 'صُوَرٌ كَثِيرَةٌ مُخْتَلِطَةٌ. عُدَّ الصُّورَةَ الْمَطْلُوبَةَ فَقَطْ.';

// ===== count the squares / triangles / rectangles =====
// every family has a sure count: squares in a grid, triangles in a fan (2 rays + 1 cross line each),
// rectangles in a strip of tall cells (no two cells ever make a square), and the square with two diagonals (8).
const SHP = [
  [{ f:'sq', m:2, n:2 }, { f:'fan', k:1, h:1 }, { f:'fan', k:2, h:1 }, { f:'strip', n:3 }, { f:'sq', m:1, n:3 }],
  [{ f:'sq', m:2, n:3 }, { f:'x' }, { f:'fan', k:1, h:2 }, { f:'fan', k:3, h:1 }, { f:'strip', n:4 }, { f:'sq', m:3, n:3 }],
  [{ f:'sq', m:2, n:4 }, { f:'fan', k:2, h:2 }, { f:'strip', n:5 }, { f:'sq', m:3, n:4 }, { f:'fan', k:4, h:1 }],
  [{ f:'sq', m:4, n:4 }, { f:'fan', k:3, h:2 }, { f:'fan', k:2, h:3 }, { f:'sq', m:3, n:5 }, { f:'strip', n:6 }, { f:'fan', k:3, h:3 }],
];
function shpFigure(F){
  const W = 360, H = 300, L = 'stroke="#2b2f55" stroke-width="4" stroke-linecap="round" fill="none"', list = [];
  let body = '';
  const hl = d => `<path d="${d}" fill="#ffc21a66" stroke="#ff4d4d" stroke-width="6" stroke-linejoin="round"/>`;
  if (F.f === 'sq') {
    const c = Math.min((W - 40) / F.n, (H - 40) / F.m), x0 = (W - c * F.n) / 2, y0 = (H - c * F.m) / 2;
    for (let i = 0; i <= F.m; i++) body += `<line x1="${f1(x0)}" y1="${f1(y0 + i * c)}" x2="${f1(x0 + F.n * c)}" y2="${f1(y0 + i * c)}" ${L}/>`;
    for (let j = 0; j <= F.n; j++) body += `<line x1="${f1(x0 + j * c)}" y1="${f1(y0)}" x2="${f1(x0 + j * c)}" y2="${f1(y0 + F.m * c)}" ${L}/>`;
    for (let s = 1; s <= Math.min(F.m, F.n); s++) for (let i = 0; i + s <= F.m; i++) for (let j = 0; j + s <= F.n; j++)
      list.push(hl(`M${f1(x0 + j * c)} ${f1(y0 + i * c)}h${f1(s * c)}v${f1(s * c)}h${f1(-s * c)}Z`));
    return { body:SV(W, H, body), list, what:'sq' };
  }
  if (F.f === 'strip') {
    const h = 200, c = Math.min(h / 1.55, (W - 30) / F.n), x0 = (W - c * F.n) / 2, y0 = (H - h) / 2;
    body += `<rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(c * F.n)}" height="${h}" ${L}/>`;
    for (let j = 1; j < F.n; j++) body += `<line x1="${f1(x0 + j * c)}" y1="${y0}" x2="${f1(x0 + j * c)}" y2="${y0 + h}" ${L}/>`;
    for (let s = 1; s <= F.n; s++) for (let j = 0; j + s <= F.n; j++) list.push(hl(`M${f1(x0 + j * c)} ${y0}h${f1(s * c)}v${h}h${f1(-s * c)}Z`));
    return { body:SV(W, H, body), list, what:'rect' };
  }
  if (F.f === 'x') {
    const a = 60, b = 300, y0 = 30, y1 = 270;
    body += `<rect x="${a}" y="${y0}" width="${b - a}" height="${y1 - y0}" ${L}/><line x1="${a}" y1="${y0}" x2="${b}" y2="${y1}" ${L}/><line x1="${b}" y1="${y0}" x2="${a}" y2="${y1}" ${L}/>`;
    const m = [(a + b) / 2, (y0 + y1) / 2], C = [[a, y0], [b, y0], [b, y1], [a, y1]];
    for (let i = 0; i < 4; i++) { const p = C[i], q = C[(i + 1) % 4]; list.push(hl(`M${p[0]} ${p[1]}L${q[0]} ${q[1]}L${m[0]} ${m[1]}Z`)); }
    for (let i = 0; i < 4; i++) { const p = C[i], q = C[(i + 1) % 4], o = C[(i + 2) % 4]; list.push(hl(`M${p[0]} ${p[1]}L${q[0]} ${q[1]}L${o[0]} ${o[1]}Z`)); }
    return { body:SV(W, H, body), list, what:'tri' };
  }
  // fan: apex at the top, k inner rays to the base, h cross lines (the base is the last one)
  const A = [180, 22], bl = 24, br = 336, by = 280, n = F.k + 2;
  const rayX = range(n).map(i => bl + (br - bl) * i / (n - 1));
  const lvl = range(F.h).map(j => by - (by - A[1]) * (F.h - 1 - j) / F.h * .78); // cross lines from the top down
  const at = (i, y) => [A[0] + (rayX[i] - A[0]) * (y - A[1]) / (by - A[1]), y];
  rayX.forEach(x => body += `<line x1="${A[0]}" y1="${A[1]}" x2="${f1(x)}" y2="${by}" ${L}/>`);
  lvl.forEach(y => { const p = at(0, y), q = at(n - 1, y); body += `<line x1="${f1(p[0])}" y1="${f1(y)}" x2="${f1(q[0])}" y2="${f1(y)}" ${L}/>`; });
  lvl.forEach(y => { for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const p = at(i, y), q = at(j, y);
    list.push(hl(`M${A[0]} ${A[1]}L${f1(p[0])} ${f1(y)}L${f1(q[0])} ${f1(y)}Z`)); } });
  return { body:SV(W, H, body), list, what:'tri' };
}
T('shp', { w:'v', name:'عُدَّ الْأَشْكَالَ', icon:'🔺', n:24,
  gen(r, d){
    const F = pk(r, SHP[d]), fig = shpFigure(F), ans = fig.list.length;
    // after 3 to 10 the plural, after 11 and more the singular: ٥ مُرَبَّعَاتٍ، ١٤ مُرَبَّعًا
    const Q = { sq:['كَمْ مُرَبَّعًا فِي الشَّكْلِ؟', 'مُرَبَّعَاتٍ', 'مُرَبَّعًا'], tri:['كَمْ مُثَلَّثًا فِي الشَّكْلِ؟', 'مُثَلَّثَاتٍ', 'مُثَلَّثًا'], rect:['كَمْ مُسْتَطِيلًا فِي الشَّكْلِ؟', 'مُسْتَطِيلَاتٍ', 'مُسْتَطِيلًا'] }[fig.what];
    return { q:Q[0], say:['q-shp-' + fig.what], board:fig.body, opts:numOpts(r, ans, [1, -1, 2, -2, 3, -3, 4]),
      anim:{ base:fig.body, list:fig.list }, ex:`فِي الشَّكْلِ ${dg(ans)} ${ans <= 10 ? Q[1] : Q[2]}، وَمِنْهَا أَشْكَالٌ كَبِيرَةٌ تَتَكَوَّنُ مِنْ أَشْكَالٍ صَغِيرَةٍ.`,
      exSay:['ex-shp-' + fig.what] };
  } });
SAY['q-shp-sq'] = 'كَمْ مُرَبَّعًا فِي الشَّكْلِ؟';
SAY['q-shp-tri'] = 'كَمْ مُثَلَّثًا فِي الشَّكْلِ؟';
SAY['q-shp-rect'] = 'كَمْ مُسْتَطِيلًا فِي الشَّكْلِ؟';
SAY['ex-shp-sq'] = 'لَا تَنْسَ الْمُرَبَّعَاتِ الْكَبِيرَةَ الَّتِي تَتَكَوَّنُ مِنْ مُرَبَّعَاتٍ صَغِيرَةٍ!';
SAY['ex-shp-tri'] = 'الْمُثَلَّثَاتُ الْكَبِيرَةُ تَتَكَوَّنُ مِنْ مُثَلَّثَاتٍ صَغِيرَةٍ، فَعُدَّهَا كُلَّهَا!';
SAY['ex-shp-rect'] = 'كُلُّ مُسْتَطِيلَيْنِ مُتَجَاوِرَيْنِ يَصْنَعَانِ مُسْتَطِيلًا أَكْبَرَ، فَعُدَّ الْكَبِيرَ وَالصَّغِيرَ!';
SAY['h-shp'] = 'فِي الشَّكْلِ أَشْكَالٌ صَغِيرَةٌ وَكَبِيرَةٌ. عُدَّهَا كُلَّهَا!';

// ===== shapes made of squares (shadow and mirror puzzles) =====
const norm = cells => { const mx = Math.min(...cells.map(c => c[0])), my = Math.min(...cells.map(c => c[1]));
  return cells.map(c => [c[0] - mx, c[1] - my, c[2]]).sort((a, b) => a[1] - b[1] || a[0] - b[0]); };
const ckey = (cells, col = true) => norm(cells).map(c => col ? c.join(',') : c[0] + ',' + c[1]).join(';');
const flipX = cells => { const w = Math.max(...cells.map(c => c[0])); return norm(cells.map(c => [w - c[0], c[1], c[2]])); };
const flipY = cells => { const h = Math.max(...cells.map(c => c[1])); return norm(cells.map(c => [c[0], h - c[1], c[2]])); };
const rot90 = cells => norm(cells.map(c => [-c[1], c[0], c[2]]));
function linked(cells){
  const has = new Set(cells.map(c => c[0] + ',' + c[1])), seen = new Set([cells[0][0] + ',' + cells[0][1]]), st = [cells[0]];
  while (st.length) { const [x, y] = st.pop(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = (x + dx) + ',' + (y + dy);
    if (has.has(k) && !seen.has(k)) { seen.add(k); st.push([x + dx, y + dy]); } } }
  return seen.size === cells.length;
}
function polyo(r, n, maxW, maxH){
  for (let a = 0; a < 200; a++) {
    const cells = [[0, 0]], has = new Set(['0,0']);
    let t = 0;
    while (cells.length < n && t++ < 500) {
      const [x, y] = pk(r, cells), [dx, dy] = pk(r, [[1, 0], [-1, 0], [0, 1], [0, -1]]), nx = x + dx, ny = y + dy;
      if (has.has(nx + ',' + ny)) continue;
      const xs = [...cells.map(c => c[0]), nx], ys = [...cells.map(c => c[1]), ny];
      if (Math.max(...xs) - Math.min(...xs) >= maxW || Math.max(...ys) - Math.min(...ys) >= maxH) continue;
      cells.push([nx, ny]); has.add(nx + ',' + ny);
    }
    if (cells.length === n) return norm(cells);
  }
  return norm([[0, 0], [1, 0], [2, 0], [2, 1]]);
}
// the same shape with one square moved somewhere else next to it (still in one piece)
function moveOne(r, cells){
  for (let a = 0; a < 80; a++) {
    const i = ri(r, 0, cells.length - 1), rest = cells.filter((_, j) => j !== i);
    if (!linked(rest)) continue;
    const has = new Set(rest.map(c => c[0] + ',' + c[1])), free = [];
    rest.forEach(([x, y]) => [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const k = (x + dx) + ',' + (y + dy);
      if (!has.has(k) && !(x + dx === cells[i][0] && y + dy === cells[i][1])) free.push([x + dx, y + dy]); }));
    if (!free.length) continue;
    const p = pk(r, free);
    return norm([...rest, [p[0], p[1], cells[i][2]]]);
  }
  return null;
}
function drawCells(cells, W, H, o = {}){
  const w = Math.max(...cells.map(c => c[0])) + 1, h = Math.max(...cells.map(c => c[1])) + 1;
  const s = Math.min((W - 16) / w, (H - 16) / h, o.max || 60), x0 = (W - s * w) / 2, y0 = (H - s * h) / 2;
  return cells.map(c => `<rect x="${f1(x0 + c[0] * s)}" y="${f1(y0 + c[1] * s)}" width="${f1(s)}" height="${f1(s)}" rx="${f1(s * .12)}" ` +
    (o.sil ? 'fill="#262a40" stroke="#262a40" stroke-width="1.5"' : `fill="${COL[c[2]] || COL.blue}" stroke="#2b2f55" stroke-width="3"`) + '/>').join('');
}
