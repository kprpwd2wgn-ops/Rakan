// ---------- core: random numbers, puzzle registry, drawing helpers, common lines ----------
// Every puzzle is made from its kind and number with a fixed seed, so puzzle 7 of a kind is the same
// puzzle every time (stars are kept per puzzle). d is its difficulty, 0 (easy) to 3 (genius).
const AR = '٠١٢٣٤٥٦٧٨٩';
const dg = s => String(s).replace(/[0-9]/g, d => AR[d]);
function RNG(seed){ let a = seed >>> 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const ri = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const pk = (r, a) => a[Math.floor(r() * a.length)];
const shuf = (r, a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const range = n => [...Array(n).keys()];
function hash(s){ let h = 2166136261; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

const WORLDS = {
  v: { name:'تَرْكِيزٌ بَصَرِيٌّ', icon:'👁️', color:'var(--v)', note:'عَيْنُ الصَّقْرِ لَا يَفُوتُهَا شَيْءٌ' },
  l: { name:'مَنْطِقٌ وَتَحْقِيقٌ', icon:'🔍', color:'var(--l)', note:'فَكِّرْ مِثْلَ الْمُحَقِّقِ' },
  m: { name:'حِسَابَاتٌ ذِهْنِيَّةٌ', icon:'🧮', color:'var(--m)', note:'احْسُبْ فِي عَقْلِكَ' },
};
const TYPES = {}, ORDER = { v:[], l:[], m:[] };
// T(id, {w: world, name, icon, n: how many puzzles, gen(r, d, i) -> puzzle, lines(): extra spoken lines})
function T(id, o){ o.id = id; TYPES[id] = o; ORDER[o.w].push(id); }
function make(id, i){
  const t = TYPES[id], r = RNG(hash(id + ':' + i)), d = Math.min(3, Math.floor(i * 4 / t.n));
  const p = t.gen(r, d, i);
  p.type = id; p.i = i; p.d = d;
  return p;
}

// ---------- answers ----------
// number choices: the answer and three near misses, never below zero
function numOpts(r, ans, near){
  const c = new Set();
  const tries = near || [1, -1, 2, -2, 10, -10, 3, -3, 5, -5];
  for (const k of shuf(r, tries)) { const v = ans + k; if (v >= 0 && v !== ans) c.add(v); if (c.size >= 3) break; }
  let k = 4; while (c.size < 3) { if (ans + k !== ans) c.add(ans + k); k++; }
  return shuf(r, [ans, ...[...c].slice(0, 3)]).map(v => ({ h: dg(v), ok: v === ans, v }));
}
// any choices: the right one and the wrong ones, mixed
const opts = (r, right, wrong, extra = {}) => shuf(r, [{ h: right, ok: true, ...extra }, ...wrong.map(h => ({ h, ok: false, ...extra }))]);

// ---------- drawing ----------
const SV = (w, h, body, extra = '') => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" ${extra}>${body}</svg>`;
const f1 = v => +(+v).toFixed(1);
const COL = { red:'#ff4d4d', blue:'#3d7dff', green:'#2fbf71', yellow:'#ffc21a', purple:'#9b5de5', orange:'#ff8c42', pink:'#ff70a6', teal:'#14b8b8' };
const COLS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
// a shape centred at (x, y), s = its half size
function shape(kind, x, y, s, fill, rot = 0, stroke = '#2b2f55', sw = 3){
  const T = rot ? ` transform="rotate(${f1(rot)} ${f1(x)} ${f1(y)})"` : '';
  const st = `fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"`;
  const P = pts => `<polygon points="${pts.map(p => f1(p[0]) + ',' + f1(p[1])).join(' ')}" ${st}${T}/>`;
  const ring = (n, r0, r1, a0 = -90) => range(n * (r1 ? 2 : 1)).map(k => { const a = (a0 + k * 360 / (n * (r1 ? 2 : 1))) * Math.PI / 180, rr = r1 && k % 2 ? r1 : r0; return [x + rr * Math.cos(a), y + rr * Math.sin(a)]; });
  switch (kind) {
    case 'circle': return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(s)}" ${st}/>`;
    case 'square': return `<rect x="${f1(x - s * .88)}" y="${f1(y - s * .88)}" width="${f1(s * 1.76)}" height="${f1(s * 1.76)}" rx="${f1(s * .12)}" ${st}${T}/>`;
    case 'triangle': return P([[x, y - s], [x + s * 1.05, y + s * .8], [x - s * 1.05, y + s * .8]]);
    case 'diamond': return P([[x, y - s], [x + s * .8, y], [x, y + s], [x - s * .8, y]]);
    case 'star': return P(ring(5, s * 1.05, s * .45));
    case 'hexagon': return P(ring(6, s, 0, 0));
    case 'pentagon': return P(ring(5, s));
    case 'heart': return `<path d="M${f1(x)} ${f1(y + s * .85)} C${f1(x - s * 1.5)} ${f1(y - s * .1)} ${f1(x - s * .7)} ${f1(y - s * 1.1)} ${f1(x)} ${f1(y - s * .4)} C${f1(x + s * .7)} ${f1(y - s * 1.1)} ${f1(x + s * 1.5)} ${f1(y - s * .1)} ${f1(x)} ${f1(y + s * .85)}Z" ${st}${T}/>`;
    case 'plus': { const a = s * .36; return P([[x - a, y - s], [x + a, y - s], [x + a, y - a], [x + s, y - a], [x + s, y + a], [x + a, y + a], [x + a, y + s], [x - a, y + s], [x - a, y + a], [x - s, y + a], [x - s, y - a], [x - a, y - a]]); }
    case 'arrow': return P([[x, y - s], [x + s * .8, y - s * .1], [x + s * .3, y - s * .1], [x + s * .3, y + s], [x - s * .3, y + s], [x - s * .3, y - s * .1], [x - s * .8, y - s * .1]]);
  }
  return '';
}
const txt = (x, y, t, size = 28, fill = '#2b2f55', extra = '') => `<text x="${f1(x)}" y="${f1(y)}" font-size="${size}" fill="${fill}" text-anchor="middle" dominant-baseline="central" font-weight="bold" font-family="Tahoma,Arial,sans-serif" ${extra}>${t}</text>`;
const emo = (x, y, e, size = 40, extra = '') => `<text x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="middle" dominant-baseline="central" ${extra}>${e}</text>`;
// a row of picture choices drawn small, for the answer buttons
const mini = (w, h, body) => SV(w, h, body);

// ---------- words Hamed says with numbers ----------
// abstract numbers, as in «نُضِيفُ ثَلَاثَةً» (accusative, indefinite)
const NUM_ACC = { 1:'وَاحِدًا', 2:'اثْنَيْنِ', 3:'ثَلَاثَةً', 4:'أَرْبَعَةً', 5:'خَمْسَةً', 6:'سِتَّةً', 7:'سَبْعَةً', 8:'ثَمَانِيَةً', 9:'تِسْعَةً',
  10:'عَشَرَةً', 11:'أَحَدَ عَشَرَ', 12:'اثْنَيْ عَشَرَ', 15:'خَمْسَةَ عَشَرَ', 20:'عِشْرِينَ', 25:'خَمْسَةً وَعِشْرِينَ', 50:'خَمْسِينَ', 100:'مِئَةً' };

// ---------- lines every part of the game uses ----------
const SAY = {
  intro:'أَهْلًا يَا بَطَلُ! أَنَا عَبْقَرِينُو. هَيَّا نُدَرِّبْ عُقُولَنَا بِأَلْغَازٍ مُمْتِعَةٍ!',
  home:'اخْتَرْ تَحَدِّيًا.',
  'w-v':'عَالَمُ التَّرْكِيزِ الْبَصَرِيِّ. افْتَحْ عَيْنَيْكَ جَيِّدًا!',
  'w-l':'عَالَمُ الْمَنْطِقِ وَالتَّحْقِيقِ. فَكِّرْ مِثْلَ الْمُحَقِّقِ!',
  'w-m':'عَالَمُ الْحِسَابَاتِ الذِّهْنِيَّةِ. احْسُبْ فِي عَقْلِكَ!',
  mix:'خَلِيطٌ مِنْ كُلِّ الْأَنْوَاعِ. اسْتَعِدَّ لِلْمُفَاجَآتِ!',
  test:'اخْتِبَارُ الذَّكَاءِ: خَمْسَةَ عَشَرَ سُؤَالًا، وَلِكُلِّ سُؤَالٍ خَمْسَ عَشْرَةَ ثَانِيَةً. رَكِّزْ جَيِّدًا، وَلَا تَتَوَقَّفْ!',
  'test-v':'أَوَّلًا: أَسْئِلَةُ التَّرْكِيزِ الْبَصَرِيِّ.',
  'test-l':'الْآنَ: أَسْئِلَةُ الْمَنْطِقِ وَالتَّحْقِيقِ.',
  'test-m':'وَأَخِيرًا: أَسْئِلَةُ الْحِسَابَاتِ الذِّهْنِيَّةِ.',
  'res-0':'عَقْلُكَ يَتَدَرَّبُ! الْعَبْ أَكْثَرَ، وَسَتَصِيرُ أَذْكَى كُلَّ يَوْمٍ.',
  'res-1':'رَائِعٌ! أَنْتَ ذَكِيٌّ جِدًّا!',
  'res-2':'مُذْهِلٌ! أَنْتَ عَبْقَرِيٌّ!',
  'ok-0':'أَحْسَنْتَ!', 'ok-1':'مُمْتَازٌ!', 'ok-2':'رَائِعٌ يَا بَطَلُ!', 'ok-3':'إِجَابَةٌ صَحِيحَةٌ!', 'ok-4':'يَا لَكَ مِنْ ذَكِيٍّ!', 'ok-5':'بِالضَّبْطِ!',
  'no-0':'حَاوِلْ مَرَّةً أُخْرَى.', 'no-1':'قَرِيبٌ! فَكِّرْ مِنْ جَدِيدٍ.', 'no-2':'لَيْسَتْ هَذِهِ، جَرِّبْ غَيْرَهَا.',
  show:'لَا بَأْسَ، انْظُرْ إِلَى الْحَلِّ.',
  late:'انْتَهَى الْوَقْتُ!',
  miss:'إِجَابَةٌ غَيْرُ صَحِيحَةٍ.',
  done:'أَنْهَيْتَ الْجَوْلَةَ! أَحْسَنْتَ يَا بَطَلُ.',
  alldone:'رَائِعٌ! حَلَلْتَ كُلَّ أَلْغَازِ هَذَا النَّوْعِ. أَنْتَ عَبْقَرِيٌّ!',
};
