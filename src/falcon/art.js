/* صقر الكلمات — drawings: Shaheen the falcon (6 ranks, moods, things he wears) and the pictures
   that have no emoji (@body:knee, @prep:under, @day:3 ...). Everything is inline SVG. */

/* ---------- Shaheen ---------- */
const RANKS = [
  { at: 0,   ar: 'فرخ صغير',         en: 'Little Chick' },
  { at: 20,  ar: 'صقر صغير',         en: 'Young Falcon' },
  { at: 60,  ar: 'صقر صياد',         en: 'Hunter Falcon' },
  { at: 150, ar: 'صقر السماء',       en: 'Sky Falcon' },
  { at: 300, ar: 'الصقر الذهبي',     en: 'Golden Falcon' },
  { at: 500, ar: 'أسطورة الكلمات',   en: 'Word Legend' },
];
const PAL = [
  { back: '#fff1d6', wing: '#f3dfb6', belly: '#fffaf0', cap: null, spot: null, line: '#c9a56a' },
  { back: '#c4935f', wing: '#a97945', belly: '#f8e8cc', cap: '#8a6440', spot: '#c4935f', line: '#6e4a26' },
  { back: '#8b5a2b', wing: '#764a21', belly: '#fbe9cf', cap: '#4a2f1b', spot: '#9a6a3a', line: '#3b2412' },
  { back: '#7a4f2a', wing: '#2f6fd6', belly: '#fdf0da', cap: '#3d2616', spot: '#8a5a32', line: '#2c1a0d' },
  { back: '#d9a520', wing: '#c58a0c', belly: '#fff4c7', cap: '#94650a', spot: '#d9a520', line: '#6b4a05' },
  { back: '#e2ae22', wing: '#cf930f', belly: '#fff6d2', cap: '#9b6a08', spot: '#e2ae22', line: '#6b4a05' },
];
function rankOf(n) { let r = 0; RANKS.forEach((x, i) => { if (n >= x.at) r = i; }); return r; }

/* falconSVG({rank, mood: 'idle'|'happy'|'sad'|'wow', pose: 'idle'|'cheer'|'fly', wear: {head, eyes, neck, back}, bg}) */
function falconSVG(o = {}) {
  const r = Math.max(0, Math.min(5, o.rank || 0)), p = PAL[r], mood = o.mood || 'idle', pose = o.pose || 'idle', wear = o.wear || {};
  const chick = r === 0, ink = p.line;
  let s = '';
  if (r === 5) s += `<circle cx="100" cy="108" r="92" fill="url(#fAura)"/>`;
  if (r >= 4) s += [[28, 40], [170, 52], [24, 150], [176, 140], [150, 22]].map(([x, y], i) =>
    `<path class="spk" style="animation-delay:${i * .35}s" d="M${x} ${y - 7}l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#ffe680"/>`).join('');
  // wings raised (behind the body) when cheering or flying
  const wingUp = (side) => {
    const k = side < 0 ? 1 : -1, x0 = 100 + side * 34;
    if (pose === 'fly') return `<path d="M${x0} 112 Q${100 + side * 70} 86 ${100 + side * 96} 100 Q${100 + side * 80} 112 ${100 + side * 88} 124 Q${100 + side * 66} 126 ${100 + side * 70} 140 Q${100 + side * 50} 138 ${x0} 132 Z" fill="${p.wing}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
    return `<path d="M${x0} 110 Q${100 + side * 66} 92 ${100 + side * 76} 52 Q${100 + side * 84} 72 ${100 + side * 80} 92 Q${100 + side * 88} 96 ${100 + side * 84} 112 Q${100 + side * 70} 128 ${x0} 132 Z" fill="${p.wing}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
  };
  if (pose !== 'idle') s += wingUp(-1) + wingUp(1);
  if (wear.back === 'bag') s += `<rect x="62" y="104" width="76" height="58" rx="16" fill="#e5484d" stroke="#7a1d22" stroke-width="3"/><rect x="72" y="140" width="56" height="16" rx="6" fill="#c2353a"/>`;
  // tail and feet
  s += `<path d="M86 160 L76 190 Q100 182 124 190 L114 160 Z" fill="${p.wing}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
  s += `<g stroke="#e0a21b" stroke-width="5" stroke-linecap="round" fill="none"><path d="M88 168 v14 M112 168 v14"/><path d="M80 186 l8 -4 8 4 M104 186 l8 -4 8 4"/></g>`;
  // body and belly
  s += `<ellipse cx="100" cy="128" rx="${chick ? 50 : 44}" ry="${chick ? 46 : 50}" fill="${p.back}" stroke="${ink}" stroke-width="3"/>`;
  s += `<ellipse cx="100" cy="${chick ? 134 : 138}" rx="${chick ? 34 : 30}" ry="${chick ? 32 : 36}" fill="${p.belly}"/>`;
  if (p.spot) s += `<g stroke="${p.spot}" stroke-width="3" stroke-linecap="round" fill="none">
    <path d="M88 122 q4 4 8 0 M104 122 q4 4 8 0 M80 136 q4 4 8 0 M96 136 q4 4 8 0 M112 136 q4 4 8 0 M88 150 q4 4 8 0 M104 150 q4 4 8 0"/></g>`;
  // folded wings
  if (pose === 'idle') s += `<path d="M58 108 Q44 140 66 172 Q80 150 78 116 Z" fill="${p.wing}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M142 108 Q156 140 134 172 Q120 150 122 116 Z" fill="${p.wing}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
    ${chick ? '' : `<path d="M62 140 l8 6 M64 152 l8 5 M138 140 l-8 6 M136 152 l-8 5" stroke="${ink}" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>`}`;
  // head
  s += `<circle cx="100" cy="70" r="${chick ? 44 : 42}" fill="${p.back}" stroke="${ink}" stroke-width="3"/>`;
  if (chick) s += `<path d="M90 30 q4 -14 10 -2 q4 -12 10 2" fill="${p.back}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
  s += `<path d="M66 78 Q68 54 100 54 Q132 54 134 78 Q130 106 100 108 Q70 106 66 78 Z" fill="${p.belly}"/>`;
  if (p.cap) s += `<path d="M60 70 Q60 30 100 28 Q140 30 140 70 Q128 56 100 56 Q72 56 60 70 Z" fill="${p.cap}"/>
    <path d="M73 80 Q70 94 78 102 M127 80 Q130 94 122 102" stroke="${p.cap}" stroke-width="7" stroke-linecap="round" fill="none"/>`;
  // eyes
  const eye = (x) => {
    if (mood === 'happy') return `<path d="M${x - 10} 76 Q${x} 64 ${x + 10} 76" stroke="#24160a" stroke-width="5" stroke-linecap="round" fill="none"/>`;
    const big = mood === 'wow' ? 14 : 12.5, py = mood === 'sad' ? 80 : 76;
    return `<circle cx="${x}" cy="76" r="${big}" fill="#fff" stroke="#f2b632" stroke-width="3.5"/>
      <circle cx="${x + (x < 100 ? 2 : -2)}" cy="${py}" r="${mood === 'wow' ? 6 : 7.5}" fill="#24160a"/>
      <circle cx="${x + (x < 100 ? 5 : 1)}" cy="${py - 3}" r="2.6" fill="#fff"/>
      <rect class="lid" x="${x - 15}" y="61" width="30" height="0" fill="${p.cap || p.back}"/>`;
  };
  s += `<g class="feyes">${eye(82)}${eye(118)}</g>`;
  if (mood === 'sad') s += `<path d="M70 60 l18 6 M130 60 l-18 6" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`;
  // beak
  const open = mood === 'happy' || mood === 'wow';
  s += `<path d="M90 86 Q100 80 110 86 Q109 98 100 106 Q91 98 90 86 Z" fill="#f5b31b" stroke="#a06a06" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M97 103 Q100 108 103 103" fill="#5b3a06"/>`;
  if (open) s += `<path d="M93 100 Q100 112 107 100" fill="#c2410c" stroke="#a06a06" stroke-width="2"/>`;
  s += `<circle cx="70" cy="94" r="6" fill="#ff9e9e" opacity=".55"/><circle cx="130" cy="94" r="6" fill="#ff9e9e" opacity=".55"/>`;
  // things he wears
  if (wear.neck === 'scarf') s += `<path d="M66 106 Q100 122 134 106 L136 118 Q100 134 64 118 Z" fill="#0f9d58" stroke="#065f35" stroke-width="2.5"/><path d="M118 120 l8 26 l10 -4 l-6 -24 Z" fill="#0f9d58" stroke="#065f35" stroke-width="2.5"/>`;
  if (wear.neck === 'medal') s += `<path d="M84 104 L100 128 L116 104" stroke="#2563eb" stroke-width="6" fill="none"/><circle cx="100" cy="134" r="12" fill="#fbbf24" stroke="#a16207" stroke-width="3"/><path d="M100 127 l2 5 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1z" fill="#fff7cc"/>`;
  if (wear.eyes === 'shades') s += `<g><rect x="64" y="64" width="34" height="22" rx="9" fill="#1f2937"/><rect x="102" y="64" width="34" height="22" rx="9" fill="#1f2937"/><path d="M98 72 h4" stroke="#1f2937" stroke-width="4"/><path d="M70 70 l8 0" stroke="#9ca3af" stroke-width="3" stroke-linecap="round"/><path d="M108 70 l8 0" stroke="#9ca3af" stroke-width="3" stroke-linecap="round"/></g>`;
  if (wear.head === 'cap') s += `<path d="M62 46 Q64 18 100 16 Q136 18 138 46 Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="3"/><path d="M100 44 Q140 40 160 48 Q140 54 100 50 Z" fill="#1e40af" stroke="#1e3a8a" stroke-width="2.5"/><circle cx="100" cy="17" r="4" fill="#1e3a8a"/>`;
  if (wear.head === 'grad') s += `<path d="M58 30 L100 14 L142 30 L100 46 Z" fill="#111827" stroke="#000" stroke-width="2"/><rect x="80" y="32" width="40" height="14" rx="3" fill="#1f2937"/><path d="M138 32 v18" stroke="#fbbf24" stroke-width="3"/><circle cx="138" cy="52" r="4" fill="#fbbf24"/>`;
  if (wear.head === 'crown') s += `<path d="M70 38 L74 12 L88 28 L100 8 L112 28 L126 12 L130 38 Z" fill="#fbbf24" stroke="#a16207" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="26" r="4" fill="#ef4444"/><circle cx="82" cy="31" r="3" fill="#22c55e"/><circle cx="118" cy="31" r="3" fill="#3b82f6"/>`;
  if (wear.head === 'headset') s += `<path d="M58 78 Q58 24 100 24 Q142 24 142 78" stroke="#111827" stroke-width="7" fill="none"/><rect x="48" y="66" width="18" height="28" rx="8" fill="#ef4444" stroke="#111827" stroke-width="3"/><rect x="134" y="66" width="18" height="28" rx="8" fill="#ef4444" stroke="#111827" stroke-width="3"/><path d="M56 92 Q62 110 84 108" stroke="#111827" stroke-width="3" fill="none"/><circle cx="86" cy="108" r="4" fill="#111827"/>`;
  const defs = `<defs><radialGradient id="fAura"><stop offset="0" stop-color="#fff3b0" stop-opacity=".95"/><stop offset=".6" stop-color="#ffd54f" stop-opacity=".45"/><stop offset="1" stop-color="#ffd54f" stop-opacity="0"/></radialGradient></defs>`;
  return `<svg class="falcon m-${mood} p-${pose}" viewBox="0 0 200 200" role="img" aria-label="شاهين">${defs}${s}</svg>`;
}

/* ---------- the pictures ---------- */
const SKIN = '#f0bf98', HL = (x, y, r) => `<circle class="hl" cx="${x}" cy="${y}" r="${r}"/>`;
function boy(part) {
  const back = part === 'back';
  let s = `<g stroke="#3b2a1e" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M44 66 L43 80 L41 92 M56 66 L57 80 L59 92" stroke="#3b4a6b" stroke-width="7" fill="none"/>
    <ellipse cx="39" cy="93.5" rx="5.5" ry="3" fill="#1f2937"/><ellipse cx="61" cy="93.5" rx="5.5" ry="3" fill="#1f2937"/>
    <path d="M36 42 L31 54 L28 66 M64 42 L69 54 L72 66" stroke="#2f80ed" stroke-width="7" fill="none"/>
    <circle cx="28" cy="67" r="3.8" fill="${SKIN}"/><circle cx="72" cy="67" r="3.8" fill="${SKIN}"/>
    <path d="M36 40 Q50 35 64 40 L62 68 L38 68 Z" fill="#2f80ed"/>
    <rect x="46" y="32" width="8" height="7" fill="${SKIN}"/>
    <circle cx="50" cy="22" r="13" fill="${SKIN}"/>`;
  s += back ? `<path d="M37 22 Q37 8 50 8 Q63 8 63 22 Q63 30 50 31 Q37 30 37 22 Z" fill="#2b1d14"/>`
            : `<path d="M37 20 Q38 8 50 8 Q62 8 63 20 Q58 13 50 14 Q42 13 37 20 Z" fill="#2b1d14"/>
               <circle cx="45" cy="22" r="1.7" fill="#2b1d14" stroke="none"/><circle cx="55" cy="22" r="1.7" fill="#2b1d14" stroke="none"/>
               <path d="M45 27 Q50 31 55 27" fill="none"/>`;
  s += `</g>`;
  const at = { head: [50, 21, 16], hair: [50, 12, 9], face: [50, 23, 10], neck: [50, 36, 5.5], shoulder: [36, 41, 6], elbow: [30.5, 54, 5],
    knee: [43, 79, 5], toe: [36, 93.5, 5], back: [50, 52, 11], stomach: [50, 60, 7] }[part];
  if (at) s += HL(...at);
  return s;
}
function house(part) {
  let s = `<g stroke="#5b3a1e" stroke-width="2" stroke-linejoin="round">
    <rect x="18" y="42" width="64" height="48" fill="#fde6c4"/>
    <path d="M10 44 L50 12 L90 44 Z" fill="#e2725b"/>
    <rect x="18" y="64" width="64" height="3.5" fill="#c08a5a"/>
    <rect x="16" y="88" width="68" height="5" fill="#9a6a3a"/>
    <rect x="26" y="70" width="12" height="18" fill="#8b5a2b"/>
    <rect x="25" y="47" width="14" height="11" fill="#9fd8ff"/><rect x="56" y="47" width="14" height="11" fill="#9fd8ff"/>
    <path d="M56 88 v-4 h5 v-4 h5 v-4 h5 v-4 h5 v-4" fill="none" stroke="#7a4a22" stroke-width="2.5"/></g>`;
  if (part === 'roof') s += `<path class="hl" d="M10 44 L50 12 L90 44 Z"/>`;
  if (part === 'floor') s += `<rect class="hl" x="14" y="86" width="72" height="9" rx="2"/>`;
  if (part === 'stairs') s += HL(68, 78, 13);
  return s;
}
const COLORS = { pink: '#f472b6', purple: '#8b5cf6', brown: '#8b5a2b', gray: '#9ca3af', gold: '#f2b632', silver: '#cbd5e1' };
function prep(kind) {
  const box = (x, y, w = 30, h = 26) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#d9a066" stroke="#7a4a22" stroke-width="2"/><path d="M${x} ${y + 7} h${w}" stroke="#7a4a22" stroke-width="1.5"/>`;
  const ball = (x, y, r = 8, op = 1) => `<g opacity="${op}"><circle cx="${x}" cy="${y}" r="${r}" fill="#ef4444" stroke="#7f1d1d" stroke-width="2"/><path d="M${x - r * .5} ${y - r * .4} q${r * .5} ${-r * .4} ${r} 0" stroke="#fff" stroke-width="1.6" fill="none" opacity=".7"/></g>`;
  const ground = `<path d="M6 86 H94" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>`;
  const table = `<g fill="#b7794a" stroke="#6b4423" stroke-width="2"><rect x="22" y="48" width="56" height="7" rx="2"/><rect x="27" y="55" width="5" height="31"/><rect x="68" y="55" width="5" height="31"/></g>`;
  const tree = (x, y, sc = 1) => `<g transform="translate(${x} ${y}) scale(${sc})"><rect x="-3" y="0" width="6" height="18" fill="#8b5a2b"/><circle cx="0" cy="-6" r="13" fill="#22c55e" stroke="#15803d" stroke-width="2"/></g>`;
  const home = (x) => `<g stroke="#5b3a1e" stroke-width="2" stroke-linejoin="round"><rect x="${x}" y="50" width="40" height="36" fill="#fde6c4"/><path d="M${x - 5} 52 L${x + 20} 30 L${x + 45} 52 Z" fill="#e2725b"/><rect x="${x + 15}" y="66" width="10" height="20" fill="#8b5a2b"/></g>`;
  switch (kind) {
    case 'in': return ground + `<path d="M30 58 L36 86 H64 L70 58" fill="#d9a066" stroke="#7a4a22" stroke-width="2"/>` + ball(50, 70, 8) + `<path d="M33 72 L36 86 H64 L67 72 Z" fill="#c98a50" stroke="#7a4a22" stroke-width="2"/>`;
    case 'on': return ground + box(35, 60) + ball(50, 52);
    case 'under': return ground + table + ball(50, 78);
    case 'next': return ground + box(22, 60) + ball(70, 78);
    case 'behind': return ground + ball(56, 58, 9) + box(35, 60);
    case 'front': return ground + box(35, 52) + ball(50, 78, 9);
    case 'between': return ground + box(8, 60, 26) + box(66, 60, 26) + ball(50, 78);
    case 'near': return ground + tree(36, 68) + ball(52, 80, 6);
    case 'far': return ground + tree(14, 68) + ball(88, 82, 4);
    case 'inside': return ground + home(30) + `<rect x="34" y="56" width="10" height="9" fill="#9fd8ff" stroke="#5b3a1e" stroke-width="1.5"/>` + ball(39, 60.5, 3);
    case 'outside': return ground + home(14) + ball(76, 80, 7);
    case 'above': return ground + box(35, 60) + `<path d="M50 52 v-6" stroke="#64748b" stroke-dasharray="2 2"/>` + ball(50, 36);
    case 'below': return `<rect x="22" y="30" width="56" height="6" rx="2" fill="#b7794a" stroke="#6b4423" stroke-width="2"/>` + ball(50, 60);
    case 'opposite': return `<rect x="0" y="44" width="100" height="16" fill="#64748b"/><path d="M4 52 h10 M24 52 h10 M44 52 h10 M64 52 h10 M84 52 h10" stroke="#fff" stroke-width="2"/>` +
      `<rect x="22" y="14" width="22" height="28" fill="#93c5fd" stroke="#1e3a8a" stroke-width="2"/><rect x="56" y="62" width="22" height="28" fill="#fca5a5" stroke="#7f1d1d" stroke-width="2"/><path d="M33 44 L67 62" stroke="#facc15" stroke-width="2.5" stroke-dasharray="3 3"/>`;
    case 'corner': return `<rect x="0" y="56" width="100" height="16" fill="#64748b"/><rect x="56" y="0" width="16" height="100" fill="#64748b"/>` +
      `<rect x="74" y="74" width="24" height="24" fill="#fde68a" stroke="#92400e" stroke-width="2"/><rect x="78" y="78" width="16" height="7" fill="#ef4444"/>` + HL(74, 74, 9);
  }
  return '';
}
function drawing(id) {
  const [k, v] = id.split(':');
  switch (k) {
    case 'body': return boy(v);
    case 'house': return house(v);
    case 'falcon': return null;
    case 'color': return `<path d="M50 14 C72 12 90 30 86 52 C83 72 64 90 44 86 C24 82 10 64 16 44 C20 28 34 16 50 14 Z" fill="${COLORS[v]}" stroke="rgba(0,0,0,.25)" stroke-width="2"/>
      <circle cx="84" cy="80" r="5" fill="${COLORS[v]}"/><circle cx="16" cy="20" r="3.5" fill="${COLORS[v]}"/><path d="M38 30 q8 -6 16 -2" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".5"/>`;
    case 'shape': return {
      circle: `<circle cx="50" cy="50" r="34" fill="#60a5fa" stroke="#1e3a8a" stroke-width="4"/>`,
      square: `<rect x="18" y="18" width="64" height="64" rx="3" fill="#f87171" stroke="#7f1d1d" stroke-width="4"/>`,
      triangle: `<path d="M50 12 L88 84 H12 Z" fill="#4ade80" stroke="#14532d" stroke-width="4" stroke-linejoin="round"/>`,
      rectangle: `<rect x="8" y="28" width="84" height="44" rx="3" fill="#facc15" stroke="#854d0e" stroke-width="4"/>`,
      line: `<path d="M10 50 H90" stroke="#7c3aed" stroke-width="7" stroke-linecap="round"/><circle cx="10" cy="50" r="5" fill="#7c3aed"/><circle cx="90" cy="50" r="5" fill="#7c3aed"/>`,
    }[v];
    case 'num': return `<rect x="6" y="22" width="88" height="56" rx="14" fill="#fef3c7" stroke="#d97706" stroke-width="4"/>
      <text x="50" y="${v.length > 3 ? 61 : 64}" text-anchor="middle" font-family="Fredoka, Arial, sans-serif" font-weight="700" font-size="${v.length > 3 ? 30 : 38}" fill="#b45309">${v}</text>`;
    case 'half': return `<circle cx="50" cy="50" r="36" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="5 4"/>
      <path d="M50 14 A36 36 0 0 0 50 86 Z" fill="#fbbf24" stroke="#b45309" stroke-width="3"/><circle cx="36" cy="38" r="4" fill="#dc2626"/><circle cx="34" cy="62" r="4" fill="#dc2626"/><circle cx="44" cy="50" r="3" fill="#16a34a"/>`;
    case 'day': {
      const L = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'], n = +v - 1;
      return `<rect x="6" y="16" width="88" height="70" rx="8" fill="#fff" stroke="#475569" stroke-width="3"/><rect x="6" y="16" width="88" height="18" rx="8" fill="#ef4444"/><rect x="6" y="28" width="88" height="6" fill="#ef4444"/>
        <circle cx="26" cy="16" r="3" fill="#475569"/><circle cx="74" cy="16" r="3" fill="#475569"/>` +
        L.map((c, i) => { const x = 82 - i * 11.4; return `<rect x="${x - 5}" y="44" width="10" height="30" rx="3" fill="${i === n ? '#facc15' : '#e2e8f0'}" stroke="${i === n ? '#a16207' : 'none'}" stroke-width="2"/><text x="${x}" y="64" text-anchor="middle" font-size="9" font-family="Tahoma, sans-serif" fill="#334155">${c}</text>`; }).join('');
    }
    case 'sandstorm': return `<rect x="0" y="0" width="100" height="100" rx="12" fill="#f5d9a8"/>
      <path d="M8 30 Q30 18 52 30 T96 30 M4 52 Q28 40 50 52 T94 52 M10 74 Q32 62 54 74 T98 74" stroke="#c08a4a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g fill="#a86b32"><circle cx="20" cy="40" r="2"/><circle cx="70" cy="42" r="2.5"/><circle cx="40" cy="64" r="2"/><circle cx="82" cy="64" r="2"/><circle cx="58" cy="86" r="2.5"/></g>`;
    case 'dates': return `<ellipse cx="50" cy="70" rx="42" ry="14" fill="#e5e7eb" stroke="#94a3b8" stroke-width="2.5"/>
      ${[[32, 60, -20], [48, 56, 10], [64, 60, 30], [40, 66, 50], [58, 67, -10]].map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="7" transform="rotate(${a} ${x} ${y})" fill="#7b3f1d" stroke="#4a2410" stroke-width="2"/><ellipse cx="${x - 3}" cy="${y - 2}" rx="4" ry="1.6" transform="rotate(${a} ${x} ${y})" fill="#b86b3b"/>`).join('')}`;
    case 'sugar': return [[22, 52], [52, 52], [37, 26]].map(([x, y]) => `<g stroke="#94a3b8" stroke-width="2" stroke-linejoin="round"><path d="M${x} ${y + 8} l14 -8 l14 8 l-14 8 z" fill="#fff"/><path d="M${x} ${y + 8} v18 l14 8 v-18 z" fill="#f1f5f9"/><path d="M${x + 28} ${y + 8} v18 l-14 8 v-18 z" fill="#e2e8f0"/></g>`).join('') + `<path d="M84 18 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#facc15"/>`;
    case 'table': return `<g fill="#b7794a" stroke="#6b4423" stroke-width="2.5" stroke-linejoin="round"><path d="M10 40 L90 40 L84 50 L16 50 Z"/><rect x="18" y="50" width="7" height="38"/><rect x="75" y="50" width="7" height="38"/></g>`;
    case 'desk': return `<g stroke="#6b4423" stroke-width="2.5" stroke-linejoin="round"><rect x="14" y="44" width="62" height="8" fill="#c58b52"/><rect x="18" y="52" width="6" height="34" fill="#9a6a3a"/><rect x="66" y="52" width="6" height="34" fill="#9a6a3a"/><rect x="20" y="54" width="48" height="12" fill="#a97945"/></g>
      <rect x="30" y="34" width="24" height="10" rx="2" fill="#3b82f6" stroke="#1e3a8a" stroke-width="2"/><g stroke="#475569" stroke-width="2.5"><path d="M82 60 v26 M94 60 v26 M80 60 h16"/></g>`;
    case 'board': return `<rect x="6" y="14" width="88" height="60" rx="4" fill="#1f6f4a" stroke="#8b5a2b" stroke-width="5"/><text x="50" y="52" text-anchor="middle" font-family="Andika, Arial, sans-serif" font-size="22" fill="#f8fafc">A B C</text>
      <rect x="20" y="74" width="60" height="5" fill="#a97945"/><rect x="62" y="70" width="10" height="4" rx="1" fill="#fff"/><path d="M30 80 l-6 14 M70 80 l6 14" stroke="#8b5a2b" stroke-width="4"/>`;
    case 'eraser': return `<g transform="rotate(-18 50 50)"><rect x="16" y="36" width="68" height="28" rx="6" fill="#f9a8d4" stroke="#9d174d" stroke-width="3"/><rect x="50" y="36" width="34" height="28" rx="6" fill="#60a5fa" stroke="#1e3a8a" stroke-width="3"/></g><g fill="#f9a8d4"><circle cx="20" cy="80" r="2.5"/><circle cx="28" cy="86" r="2"/><circle cx="14" cy="88" r="2"/></g>`;
    case 'glue': return `<path d="M36 40 h28 v44 a6 6 0 0 1 -6 6 h-16 a6 6 0 0 1 -6 -6 z" fill="#f8fafc" stroke="#64748b" stroke-width="3"/><rect x="40" y="56" width="20" height="16" rx="2" fill="#fde047"/><path d="M42 40 v-10 h16 v10" fill="#f97316" stroke="#9a3412" stroke-width="3"/><path d="M47 30 l3 -14 l3 14" fill="#f97316" stroke="#9a3412" stroke-width="2.5"/>`;
    case 'closet': return `<rect x="18" y="8" width="64" height="84" rx="4" fill="#c58b52" stroke="#6b4423" stroke-width="3"/><path d="M50 10 v80" stroke="#6b4423" stroke-width="3"/><circle cx="45" cy="52" r="3" fill="#fbbf24"/><circle cx="55" cy="52" r="3" fill="#fbbf24"/><path d="M22 92 v4 M78 92 v4" stroke="#6b4423" stroke-width="4"/>`;
    case 'carpet': return `<rect x="8" y="24" width="84" height="52" rx="3" fill="#b91c1c" stroke="#7f1d1d" stroke-width="3"/><rect x="16" y="32" width="68" height="36" fill="none" stroke="#fbbf24" stroke-width="3"/><path d="M50 36 L62 50 L50 64 L38 50 Z" fill="#1e3a8a" stroke="#fbbf24" stroke-width="2"/>
      <path d="M8 30 h-5 M8 40 h-5 M8 50 h-5 M8 60 h-5 M8 70 h-5 M92 30 h5 M92 40 h5 M92 50 h5 M92 60 h5 M92 70 h5" stroke="#fbbf24" stroke-width="2"/>`;
    case 'fridge': return `<rect x="26" y="6" width="48" height="88" rx="7" fill="#f1f5f9" stroke="#64748b" stroke-width="3"/><path d="M26 38 h48" stroke="#64748b" stroke-width="3"/><path d="M66 16 v14 M66 46 v20" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/><circle cx="38" cy="22" r="4" fill="#ef4444"/><rect x="34" y="50" width="12" height="9" rx="2" fill="#fde047"/>`;
    case 'oven': return `<rect x="14" y="18" width="72" height="72" rx="6" fill="#e2e8f0" stroke="#475569" stroke-width="3"/><rect x="14" y="18" width="72" height="14" rx="6" fill="#334155"/><g fill="#f97316"><circle cx="28" cy="25" r="3"/><circle cx="42" cy="25" r="3"/></g><g fill="#94a3b8"><circle cx="64" cy="25" r="2.5"/><circle cx="74" cy="25" r="2.5"/></g>
      <rect x="24" y="42" width="52" height="36" rx="4" fill="#1f2937" stroke="#475569" stroke-width="2"/><rect x="30" y="56" width="40" height="16" rx="3" fill="#f59e0b" opacity=".7"/><path d="M30 40 h40" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>`;
    case 'tablet': return `<rect x="16" y="10" width="68" height="82" rx="9" fill="#1f2937" stroke="#0f172a" stroke-width="3"/><rect x="22" y="18" width="56" height="64" rx="3" fill="#7dd3fc"/><circle cx="50" cy="87" r="2.5" fill="#64748b"/><circle cx="62" cy="34" r="7" fill="#fde047"/><path d="M22 74 L40 52 L54 66 L62 58 L78 74 Z" fill="#22c55e"/>`;
    case 'sand': return `<path d="M4 84 Q30 46 56 58 Q76 66 96 84 Z" fill="#f2cc8f" stroke="#c08a4a" stroke-width="3"/><g fill="#c08a4a"><circle cx="34" cy="72" r="1.6"/><circle cx="50" cy="66" r="1.6"/><circle cx="64" cy="74" r="1.6"/><circle cx="44" cy="78" r="1.6"/><circle cx="76" cy="78" r="1.6"/></g>
      <path d="M70 52 l6 -20 h14 l-4 20 z" fill="#38bdf8" stroke="#0369a1" stroke-width="2.5"/><path d="M72 32 q11 -10 18 0" fill="none" stroke="#0369a1" stroke-width="2.5"/>`;
    case 'sky': return `<rect x="4" y="4" width="92" height="92" rx="14" fill="url(#skyG)"/><defs><linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b82f6"/><stop offset="1" stop-color="#bfdbfe"/></linearGradient></defs>
      <path d="M22 40 q6 -6 12 0 q6 -6 12 0" stroke="#1e3a8a" stroke-width="2.5" fill="none"/><path d="M58 28 q4 -4 8 0 q4 -4 8 0" stroke="#1e3a8a" stroke-width="2" fill="none"/>`;
    case 'lantern': return `<path d="M50 6 v8" stroke="#a16207" stroke-width="3"/><circle cx="50" cy="6" r="3" fill="none" stroke="#a16207" stroke-width="2.5"/><path d="M38 16 h24 l6 10 h-36 z" fill="#f2b632" stroke="#a16207" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M32 26 h36 l-4 44 h-28 z" fill="#ffe8a3" stroke="#a16207" stroke-width="3" stroke-linejoin="round"/><path d="M50 26 v44 M41 26 l-2 44 M59 26 l2 44" stroke="#a16207" stroke-width="2"/>
      <path d="M36 34 h28" stroke="#ef4444" stroke-width="3"/><path d="M35 50 h30" stroke="#22c55e" stroke-width="3"/><circle cx="50" cy="52" r="7" fill="#fff3b0" opacity=".9"/>
      <path d="M36 70 h28 l-6 10 h-16 z" fill="#f2b632" stroke="#a16207" stroke-width="2.5" stroke-linejoin="round"/><path d="M50 80 v8" stroke="#a16207" stroke-width="3"/>`;
    case 'quran': return `<path d="M18 86 L50 56 L82 86" stroke="#8b5a2b" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M18 56 L50 86 L82 56" stroke="#a97945" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M50 58 L14 46 L14 16 L50 26 Z" fill="#047857" stroke="#064e3b" stroke-width="2.5" stroke-linejoin="round"/><path d="M50 58 L86 46 L86 16 L50 26 Z" fill="#059669" stroke="#064e3b" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M20 22 L46 29 L46 52 L20 44 Z M80 22 L54 29 L54 52 L80 44 Z" fill="none" stroke="#fbbf24" stroke-width="2"/>`;
    case 'size': return v === 'big' ? `<circle cx="38" cy="54" r="30" fill="#60a5fa" stroke="#1e3a8a" stroke-width="3"/>${HL(38, 54, 35)}<circle cx="82" cy="74" r="9" fill="#60a5fa" stroke="#1e3a8a" stroke-width="3" opacity=".45"/>`
                                     : `<circle cx="36" cy="54" r="30" fill="#60a5fa" stroke="#1e3a8a" stroke-width="3" opacity=".45"/><circle cx="82" cy="74" r="9" fill="#60a5fa" stroke="#1e3a8a" stroke-width="3"/>${HL(82, 74, 13)}`;
    case 'len': {
      const pencil = (y, len, on) => `<g opacity="${on ? 1 : .45}"><rect x="10" y="${y}" width="${len}" height="12" fill="#facc15" stroke="#854d0e" stroke-width="2"/><path d="M${10 + len} ${y} l12 6 l-12 6 z" fill="#f5d0a9" stroke="#854d0e" stroke-width="2"/><path d="M${18 + len} ${y + 4} l4 2 l-4 2 z" fill="#1f2937"/><rect x="4" y="${y}" width="7" height="12" fill="#f472b6" stroke="#854d0e" stroke-width="2"/></g>`;
      return v === 'long' ? pencil(30, 72, 1) + `<rect class="hl" x="1" y="25" width="94" height="22" rx="10"/>` + pencil(62, 26, 0)
                          : pencil(30, 72, 0) + pencil(62, 26, 1) + `<rect class="hl" x="1" y="57" width="46" height="22" rx="10"/>`;
    }
    case 'shirt': return `<path d="M30 20 L44 14 Q50 22 56 14 L70 20 L84 36 L74 44 L70 40 L70 86 L30 86 L30 40 L26 44 L16 36 Z" fill="${v === 'clean' ? '#f8fafc' : '#e7e5e4'}" stroke="#64748b" stroke-width="3" stroke-linejoin="round"/>` +
      (v === 'clean' ? `<path d="M80 12 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z M20 58 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z" fill="#38bdf8"/>`
                     : `<g fill="#8b5a2b" opacity=".8"><circle cx="42" cy="50" r="6"/><circle cx="58" cy="66" r="8"/><circle cx="46" cy="76" r="4"/><circle cx="60" cy="44" r="3"/></g>`);
    case 'glass': return `<path d="M30 14 h40 l-6 76 h-28 z" fill="#e0f2fe" stroke="#0369a1" stroke-width="3" stroke-linejoin="round"/>` +
      (v === 'full' ? `<path d="M32.5 24 h35 l-5.2 64 h-24.6 z" fill="#38bdf8" opacity=".85"/><path d="M38 30 v40" stroke="#fff" stroke-width="3" opacity=".6"/>` : `<path d="M38 30 v40" stroke="#fff" stroke-width="3" opacity=".8"/>`);
    case 'math': return `<rect x="8" y="20" width="84" height="60" rx="12" fill="${v === 'easy' ? '#dcfce7' : '#fee2e2'}" stroke="${v === 'easy' ? '#16a34a' : '#dc2626'}" stroke-width="3"/>
      <text x="50" y="60" text-anchor="middle" font-family="Fredoka, Arial, sans-serif" font-weight="700" font-size="${v === 'easy' ? 30 : 22}" fill="${v === 'easy' ? '#15803d' : '#b91c1c'}">${v === 'easy' ? '1+1' : '487×96'}</text>`;
    case 'prep': return prep(v);
  }
  return '';
}
/* pic(word, size): the word's picture as HTML */
function picHTML(pic, cls = '') {
  if (!pic) return '';
  if (pic[0] === '@') {
    const id = pic.slice(1);
    if (id === 'falcon') return `<span class="pic svgpic ${cls}">${falconSVG({ rank: 2 })}</span>`;
    if (id.startsWith('pair:')) { const [, a, b] = id.split(':'); return `<span class="pic pairpic ${cls}"><span class="pa">${a}</span><span class="pb">${b}</span></span>`; }
    return `<span class="pic svgpic ${cls}"><svg viewBox="0 0 100 100" aria-hidden="true">${drawing(id)}</svg></span>`;
  }
  return `<span class="pic emo ${cls}">${pic}</span>`;
}

/* ---------- the home scene behind Shaheen (bought in his nest) ---------- */
function sceneSVG(bg) {
  const sky = (a, b) => `<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="220" fill="url(#sg)"/>`;
  const palm = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 q4 -30 -2 -58" stroke="#7a4a22" stroke-width="6" fill="none"/><g fill="#2f8f46"><path d="M-2 -58 q-26 -6 -40 10 q22 -14 40 -6z"/><path d="M-2 -58 q24 -10 40 6 q-22 -10 -40 -2z"/><path d="M-2 -58 q-10 -22 -30 -26 q18 10 28 28z"/><path d="M-2 -58 q14 -20 32 -20 q-18 6 -30 22z"/></g></g>`;
  const cloud = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity=".9"><circle cx="0" cy="0" r="14"/><circle cx="16" cy="-6" r="18"/><circle cx="34" cy="0" r="13"/><rect x="-2" y="0" width="38" height="12" rx="6"/></g>`;
  let s = '';
  switch (bg) {
    case 'sea': s = sky('#8fd3ff', '#e6f7ff') + cloud(40, 40, .9) + cloud(270, 30, .7) + `<circle cx="340" cy="52" r="24" fill="#ffd76a"/>` +
      `<rect y="132" width="400" height="88" fill="#2b93d1"/><path d="M0 140 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#bfe6ff" stroke-width="4" fill="none"/>` +
      `<path d="M0 178 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#7cc7f2" stroke-width="3" fill="none"/>` +
      `<g transform="translate(290 112)"><path d="M0 20 h44 l-8 12 h-28 z" fill="#8b5a2b"/><path d="M22 18 v-34 l18 30 z" fill="#fff"/></g>`; break;
    case 'mountain': s = sky('#a5d8ff', '#effaff') + cloud(60, 36, .8) + cloud(300, 54, .6) +
      `<path d="M-20 220 L90 70 L170 160 L250 60 L420 220 Z" fill="#6b8f5e"/><path d="M90 70 L110 98 L96 92 L80 100 Z M250 60 L272 92 L254 84 L236 94 Z" fill="#fff"/>` +
      `<path d="M-20 220 Q100 150 220 190 T420 170 V220 Z" fill="#4f7a45"/>`; break;
    case 'city': s = sky('#ffb37a', '#ffe9cc') + `<circle cx="80" cy="70" r="30" fill="#ffd76a" opacity=".9"/>` +
      [[20, 120, 40], [70, 90, 34], [112, 60, 30], [150, 110, 44], [200, 40, 28], [236, 96, 40], [284, 76, 32], [324, 118, 46], [372, 96, 36]].map(([x, y, w]) =>
        `<rect x="${x}" y="${y}" width="${w}" height="${220 - y}" fill="#34415f"/>` + Array.from({ length: Math.floor((200 - y) / 18) }, (_, i) => `<rect x="${x + 8}" y="${y + 10 + i * 18}" width="${w - 16}" height="6" fill="#ffd76a" opacity=".55"/>`).join('')).join(''); break;
    case 'night': s = sky('#0b1f3f', '#2a4a7e') + Array.from({ length: 34 }, (_, i) => `<circle cx="${(i * 97) % 400}" cy="${(i * 53) % 130 + 6}" r="${i % 3 ? 1.4 : 2.2}" fill="#fff" opacity="${.5 + (i % 4) * .12}"/>`).join('') +
      `<path d="M330 30 a26 26 0 1 0 24 40 a20 20 0 1 1 -24 -40 z" fill="#ffe680"/><path d="M-10 220 Q120 150 230 190 T420 175 V220 Z" fill="#3b2f55"/>` + palm(70, 196, .9); break;
    default: s = sky('#7cc4ff', '#fde7b8') + `<circle cx="330" cy="54" r="30" fill="#ffd76a"/>` + cloud(50, 40, .8) +
      `<path d="M-20 220 Q80 140 200 180 T420 160 V220 Z" fill="#f2c27b"/><path d="M-20 220 Q120 170 260 200 T420 196 V220 Z" fill="#e2a657"/>` + palm(350, 190, .9);
  }
  return `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${s}</svg>`;
}
