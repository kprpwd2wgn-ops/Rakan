/* ===== الرسم: القراصنة، كوكو، الطاقم، شنبو، السفينة، والكنوز ===== */
const INK='#1d2433';
let UID=0;const uid=()=>'d'+(++UID);
const svgDoc=(inner,vb,w,h)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}">${inner}</svg>`;
/* صورة SVG → لوحة جاهزة للرسم السريع على الكانفاس */
const IMGC={};
function svgBitmap(key,svg,w,h){
  let e=IMGC[key];
  if(!e){e=IMGC[key]={img:new Image(),ok:false,c:{}};e.img.onload=()=>{e.ok=true;};e.img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);}
  if(!e.ok)return null;
  const dpr=Math.min(2,window.devicePixelRatio||1),cw=Math.max(1,Math.round(w*dpr)),ch=Math.max(1,Math.round(h*dpr)),k=cw+'x'+ch;
  if(!e.c[k]){const c=document.createElement('canvas');c.width=cw;c.height=ch;c.getContext('2d').drawImage(e.img,0,0,cw,ch);e.c[k]=c;}
  return e.c[k];
}
const eyeW=(x,y,r=5.5,look=0)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="2.2"/><circle cx="${x+look}" cy="${y+.6}" r="${r*.58}" fill="${INK}"/><circle cx="${x+look+r*.22}" cy="${y-r*.2}" r="${r*.2}" fill="#fff"/>`;
const blush=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="4.5" ry="2.8" fill="#ff8fa3" opacity=".5"/>`;
const smileP=(x,y,w=6)=>`<path d="M${x-w} ${y} Q${x} ${y+w*.8} ${x+w} ${y}" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;

/* ---------- القراصنة ---------- */
const PIRS=[
 {skin:'#f9d9bf',hat:'band',hc:'#ef4444',shirt:'#1e3a8a',patch:0,stache:0,ring:1},
 {skin:'#a8704a',hat:'tricorn',hc:'#1f2937',shirt:'#b91c1c',patch:1,stache:1,ring:0},
 {skin:'#f0bf98',hat:'band',hc:'#2563eb',shirt:'#0f766e',patch:0,stache:1,ring:0},
 {skin:'#7a4b2e',hat:'scarf',hc:'#16a34a',shirt:'#9a3412',patch:0,stache:0,ring:1},
 {skin:'#d29a6c',hat:'tricorn',hc:'#1f2937',shirt:'#1e40af',patch:0,stache:1,ring:0},
 {skin:'#f9d9bf',hat:'band',hc:'#9333ea',shirt:'#be123c',patch:1,stache:0,ring:0},
 {skin:'#f0bf98',hat:'cap',hc:'#f8fafc',shirt:'#0369a1',patch:0,stache:0,ring:1},
 {skin:'#a8704a',hat:'band',hc:'#f97316',shirt:'#3f6212',patch:0,stache:1,ring:1}
];
function pirInner(v,mood){
  const P=PIRS[v%PIRS.length],sk=P.skin;let s='';
  s+=`<ellipse cx="50" cy="115" rx="24" ry="4.5" fill="rgba(0,0,0,.18)"/>`;
  s+=`<rect x="38" y="96" width="9" height="15" rx="3" fill="#334155" stroke="${INK}" stroke-width="2.5"/><rect x="53" y="96" width="9" height="15" rx="3" fill="#334155" stroke="${INK}" stroke-width="2.5"/>`;
  s+=`<path d="M34 108 h14 v5 h-16 z M52 108 h14 l2 5 h-16 z" fill="#1f2937" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
  const body='M30 100 Q28 76 40 70 L60 70 Q72 76 70 100 Z';
  s+=`<path d="${body}" fill="${P.shirt}"/><path d="M31.5 79 H68.5 M30.5 87 H69.5" stroke="#fff" stroke-width="4" opacity=".85"/><path d="${body}" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
  s+=`<rect x="30.5" y="91" width="39" height="6" fill="#3f2a1d"/><rect x="46" y="90" width="8" height="8" rx="1.5" fill="#fbbf24" stroke="${INK}" stroke-width="1.5"/>`;
  const arm=(d)=>`<path d="${d}" stroke="${INK}" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${P.shirt}" stroke-width="6.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const hand=(x,y)=>`<circle cx="${x}" cy="${y}" r="5" fill="${sk}" stroke="${INK}" stroke-width="2.4"/>`;
  const A={idle:[['M33 75 Q25 85 28 95',28,96],['M67 75 Q75 85 72 95',72,96]],happy:[['M33 75 Q24 66 21 55',21,53],['M67 75 Q76 66 79 55',79,53]],
    angry:[['M33 75 L21 84 L30 92',31,92],['M67 75 L79 84 L70 92',69,92]],want:[['M33 75 Q25 85 28 95',28,96],['M67 75 Q78 70 82 58',83,56]],sad:[['M33 75 Q27 86 32 96',32,97],['M67 75 Q73 86 68 96',68,97]]}[mood]||[];
  A.forEach(([d,x,y])=>{s+=arm(d)+hand(x,y);});
  s+=`<circle cx="27" cy="48" r="5" fill="${sk}" stroke="${INK}" stroke-width="2.5"/><circle cx="73" cy="48" r="5" fill="${sk}" stroke="${INK}" stroke-width="2.5"/>`;
  if(P.ring)s+=`<circle cx="25.5" cy="55" r="3" fill="none" stroke="#fbbf24" stroke-width="2"/>`;
  s+=`<circle cx="50" cy="45" r="23" fill="${sk}" stroke="${INK}" stroke-width="3"/>`;
  if(mood==='angry')s+=`<circle cx="50" cy="45" r="21.5" fill="#ff5a5a" opacity=".22"/>`;
  /* القبعة */
  if(P.hat==='band')s+=`<path d="M26.5 42 Q26 19 50 18.5 Q74 19 73.5 42 Q62 33.5 50 33.5 Q38 33.5 26.5 42 Z" fill="${P.hc}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <circle cx="39" cy="28" r="2.1" fill="#fff"/><circle cx="51" cy="24" r="2.1" fill="#fff"/><circle cx="62" cy="28.5" r="2.1" fill="#fff"/><circle cx="46" cy="30.5" r="1.6" fill="#fff"/>
    <path d="M73 33 L85 28 L83 37 Z M73 35 L83 44 L75 45 Z" fill="${P.hc}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="73.5" cy="34" r="3.6" fill="${P.hc}" stroke="${INK}" stroke-width="2.2"/>`;
  else if(P.hat==='tricorn')s+=`<path d="M16 34 Q29 31 33 15 Q50 24 67 15 Q71 31 84 34 Q66 41 50 36.5 Q34 41 16 34 Z" fill="#1f2937" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <path d="M20 34 Q34 37.5 50 33.5 Q66 37.5 80 34" stroke="#fbbf24" stroke-width="2.6" fill="none"/><path d="M37 19 Q29 7 38 1 Q37 11 42 18 Z" fill="#ef4444" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`;
  else if(P.hat==='scarf')s+=`<path d="M26 46 Q24 17.5 50 17.5 Q76 17.5 74 46 L73.5 39 Q62 29.5 50 29.5 Q38 29.5 26.5 39 Z" fill="${P.hc}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <path d="M27.5 38 Q15 46 18 60 Q25 52 30.5 45 Z" fill="${P.hc}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M33 25 Q50 20 67 25" stroke="#fff" stroke-width="2.2" fill="none" opacity=".6"/>`;
  else s+=`<path d="M30 36 Q30 23 50 23 Q70 23 70 36 Z" fill="#f8fafc" stroke="${INK}" stroke-width="2.8"/><rect x="28.5" y="33.5" width="43" height="6.5" rx="2.5" fill="#1e3a8a" stroke="${INK}" stroke-width="2.2"/><circle cx="50" cy="22" r="4.2" fill="#ef4444" stroke="${INK}" stroke-width="1.8"/>`;
  /* الوجه */
  const eye=(x,big)=>`<ellipse cx="${x}" cy="47" rx="${big?4.3:3.4}" ry="${big?5.2:4.4}" fill="${INK}"/><circle cx="${x+1.2}" cy="${big?44.6:45.6}" r="${big?1.7:1.3}" fill="#fff"/>`;
  const L=41,R=59;
  if(mood==='happy'){s+=`<path d="M${L-4} 48 Q${L} 42 ${L+4} 48" stroke="${INK}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;if(!P.patch)s+=`<path d="M${R-4} 48 Q${R} 42 ${R+4} 48" stroke="${INK}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;}
  else{const big=mood==='want';s+=eye(L,big);if(!P.patch)s+=eye(R,big);}
  if(mood==='angry')s+=`<path d="M35 37.5 L46 41.5 M65 37.5 L54 41.5" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M71 17 q3 3 0 6 M77 17 q-3 3 0 6 M69.5 20 h4 M75.5 20 h4" stroke="#ef4444" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  if(mood==='sad'||mood==='want')s+=`<path d="M36 ${mood==='want'?37:40} L45 ${mood==='want'?35:38} M64 ${mood==='want'?37:40} L55 ${mood==='want'?35:38}" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
  if(P.patch)s+=`<path d="M27 36 L73 50" stroke="${INK}" stroke-width="2.2"/><ellipse cx="${R}" cy="47" rx="6.5" ry="6" fill="${INK}"/>`;
  s+=`<ellipse cx="50" cy="53" rx="3.4" ry="2.7" fill="rgba(0,0,0,.13)"/>`+blush(34,56)+blush(66,56);
  const my=P.stache?2:0;
  s+={happy:`<path d="M42 ${59+my} Q50 ${72+my} 58 ${59+my} Z" fill="#7a2e2e" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M46 ${64.5+my} Q50 ${68.5+my} 54 ${64.5+my}" fill="#f87171"/>`,
    angry:`<path d="M43 ${66+my} Q50 ${58+my} 57 ${66+my} Z" fill="#7a2e2e" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`,
    want:`<ellipse cx="50" cy="${63+my}" rx="3.6" ry="4.2" fill="#7a2e2e" stroke="${INK}" stroke-width="2"/>`,
    sad:`<path d="M44 ${64+my} Q50 ${59+my} 56 ${64+my}" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`}[mood]||smileP(50,61+my,5.5);
  if(P.stache)s+=`<path d="M37 57.5 Q44 52 50 56 Q56 52 63 57.5 Q57 61.5 50 59 Q43 61.5 37 57.5 Z" fill="#4a2c17" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`;
  return s;
}
const pirSVG=(v,mood='idle',cls='')=>`<svg class="pir ${cls}" viewBox="0 0 100 120" aria-hidden="true">${pirInner(v,mood)}</svg>`;
const pirBmp=(v,mood,w)=>svgBitmap(`p${v%PIRS.length}${mood}`,svgDoc(pirInner(v,mood),'0 0 100 120',100,120),w,w*1.2);

/* ---------- كوكو الببغاء ---------- */
function parrotInner(mood){
  const open=mood==='talk'||mood==='happy'||mood==='eat';let s='';
  s+=`<path d="M43 74 L35 98 L45 92 L50 99 L55 91 L62 97 L57 74 Z" fill="#2563eb" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M47 80 L45 93 M53 80 L55 92" stroke="#fde047" stroke-width="2.5"/>`;
  s+=`<path d="M44 82 v7 M50 83 v7 M56 82 v7" stroke="#9ca3af" stroke-width="3.2" stroke-linecap="round"/>`;
  s+=`<ellipse cx="50" cy="60" rx="19" ry="23" fill="#ef4444" stroke="${INK}" stroke-width="3"/><ellipse cx="55" cy="65" rx="10" ry="14" fill="#fca5a5" opacity=".7"/>`;
  s+=mood==='happy'?`<path d="M36 54 Q14 44 8 24 Q28 30 46 48 Z" fill="#22c55e" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M8 24 Q12 32 18 36 Q16 28 14 26 Z" fill="#3b82f6" stroke="${INK}" stroke-width="1.5"/>`
    :`<path d="M34 50 Q25 66 38 83 Q47 74 46 58 Z" fill="#22c55e" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M33 70 Q34 78 38 83 Q41 76 40 70 Z" fill="#3b82f6"/>`;
  s+=`<circle cx="52" cy="32" r="17" fill="#ef4444" stroke="${INK}" stroke-width="3"/><ellipse cx="59" cy="31" rx="7" ry="8" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
  s+=mood==='happy'?`<path d="M56 32 Q59.5 27 63 32" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`:`<circle cx="60" cy="31.5" r="3.3" fill="${INK}"/><circle cx="61.2" cy="30.2" r="1.1" fill="#fff"/>`;
  s+=open?`<path d="M66 42 Q74 45 72 51 Q66 50 64 45 Z" fill="#f59e0b" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`:`<path d="M66 40 Q72 41 72 45 Q67 45 65 42 Z" fill="#f59e0b" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
  s+=`<path d="M65 29 Q80 28 79 43 Q75 37 66 39 Z" fill="#fbbf24" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
  if(mood==='eat')s+=`<circle cx="73" cy="50" r="5" fill="#fbbf24" stroke="${INK}" stroke-width="1.8"/>`;
  s+=`<path d="M35 20 Q43 18 45 8 Q53 14 61 8 Q63 18 71 20 Q61 24 53 21.5 Q43 24 35 20 Z" fill="#1f2937" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><path d="M38 20 Q53 23 68 20" stroke="#fbbf24" stroke-width="1.8" fill="none"/>`;
  return s;
}
const parrotSVG=(mood='idle',cls='')=>`<svg class="koko ${cls}" viewBox="0 0 100 100" aria-hidden="true">${parrotInner(mood)}</svg>`;
const parrotBmp=(mood,w)=>svgBitmap('k'+mood,svgDoc(parrotInner(mood),'0 0 100 100',100,100),w,w);

/* ---------- الطاقم: حيوان لكل جزيرة ---------- */
function bandana(x,y,col,w=26){return `<path d="M${x-w/2} ${y} Q${x} ${y+4} ${x+w/2} ${y} L${x} ${y+w*.62} Z" fill="${col}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><circle cx="${x-w*.18}" cy="${y+w*.18}" r="1.7" fill="#fff"/><circle cx="${x+w*.12}" cy="${y+w*.3}" r="1.5" fill="#fff"/>`;}
function starPath(cx,cy,R,r,n=5,rot=-Math.PI/2){let d='';for(let i=0;i<n*2;i++){const a=rot+i*Math.PI/n,rr=i%2?r:R;const x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;d+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)+' ';}return d+'Z';}
function mateInner(crew,col){
  const st=`stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;let s='';
  switch(crew){
  case 'narwhal':
    s+=`<path d="M19 66 Q5 56 3 43 Q13 50 19 54 Q13 41 17 33 Q24 46 24 60 Z" fill="#7fb2e5" ${st}/>`;
    s+=`<path d="M16 70 Q16 42 52 40 Q93 38 101 64 Q104 82 86 89 Q60 97 32 91 Q16 87 16 70 Z" fill="#7fb2e5" ${st}/>`;
    s+=`<path d="M26 82 Q57 94 90 81 Q82 92 57 94 Q35 94 26 82 Z" fill="#dbeeff"/><path d="M50 82 Q46 98 61 99 Q61 89 59 82 Z" fill="#6aa2d8" ${st}/>`;
    s+=`<path d="M84 47 L114 10 L91 51 Z" fill="#fff7e0" ${st}/><path d="M89 41 l6 2.5 M95 33 l5 2.5 M101 25 l4.5 2.5 M107 17 l3.5 2" stroke="${INK}" stroke-width="1.6"/>`;
    s+=`<path d="M58 42 Q76 32 93 45 L91 51 Q76 43 61 48 Z" fill="${col}" ${st}/><circle cx="68" cy="42" r="1.6" fill="#fff"/><circle cx="80" cy="41" r="1.6" fill="#fff"/>`;
    s+=eyeW(78,61,6.2,1)+smileP(91,72,5)+blush(87,68);break;
  case 'crab':
    s+=[-1,1].map(d=>[0,1,2].map(i=>`<path d="M${60+d*24} ${78+i*5} L${60+d*(40+i*3)} ${88+i*7}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`).join('')).join('');
    s+=`<path d="M34 64 L20 42 M86 64 L100 42" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    s+=`<path d="M8 32 Q9 14 27 17 Q21 25 29 30 Q24 41 11 39 Z" fill="#f87171" ${st}/><path d="M112 32 Q111 14 93 17 Q99 25 91 30 Q96 41 109 39 Z" fill="#f87171" ${st}/>`;
    s+=`<ellipse cx="60" cy="76" rx="35" ry="24" fill="#f87171" ${st}/><ellipse cx="60" cy="84" rx="22" ry="10" fill="#fecaca" opacity=".55"/>`;
    s+=`<path d="M50 56 L47 40 M70 56 L73 40" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`+eyeW(47,35,7)+eyeW(73,35,7);
    s+=bandana(60,57,col,30)+smileP(60,77,7)+blush(42,76)+blush(78,76);break;
  case 'monkey':
    s+=`<path d="M84 94 Q110 92 108 72 Q106 60 96 64" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M84 94 Q110 92 108 72 Q106 60 96 64" stroke="#8b5a2b" stroke-width="5.5" fill="none" stroke-linecap="round"/>`;
    s+=`<ellipse cx="60" cy="90" rx="24" ry="22" fill="#8b5a2b" ${st}/><ellipse cx="60" cy="94" rx="14" ry="13" fill="#e8c39e"/>`;
    s+=`<circle cx="33" cy="52" r="10" fill="#8b5a2b" ${st}/><circle cx="33" cy="52" r="5.5" fill="#e8c39e"/><circle cx="87" cy="52" r="10" fill="#8b5a2b" ${st}/><circle cx="87" cy="52" r="5.5" fill="#e8c39e"/>`;
    s+=`<circle cx="60" cy="52" r="26" fill="#8b5a2b" ${st}/><path d="M41 54 Q41 37 60 41 Q79 37 79 54 Q81 72 60 74 Q39 72 41 54 Z" fill="#e8c39e" stroke="${INK}" stroke-width="2.2"/>`;
    s+=`<path d="M35 40 Q60 15 85 40 Q60 31 35 40 Z" fill="${col}" ${st}/><circle cx="85" cy="39" r="3.5" fill="${col}" stroke="${INK}" stroke-width="2"/><path d="M87 39 L96 35 L95 43 Z" fill="${col}" stroke="${INK}" stroke-width="2"/>`;
    s+=eyeW(52,52,5)+eyeW(68,52,5)+`<circle cx="57" cy="61" r="1.4" fill="${INK}"/><circle cx="63" cy="61" r="1.4" fill="${INK}"/>`+smileP(60,66,6);
    s+=`<path d="M84 88 Q99 83 101 68 Q97 82 83 82 Z" fill="#fde047" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`;break;
  case 'starfish':
    s+=`<path d="${starPath(60,64,50,23)}" fill="#fb923c" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round"/>`;
    s+=`<path d="${starPath(60,64,38,17)}" fill="#fdba74" opacity=".5"/>`;
    s+=[[60,26],[96,52],[83,95],[37,95],[24,52]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.6" fill="#fff7ed"/>`).join('');
    s+=eyeW(52,60,5.5)+eyeW(68,60,5.5)+smileP(60,70,6)+blush(46,70)+blush(74,70)+bandana(60,78,col,22);break;
  case 'seahorse':
    s+=`<path d="M22 104 L22 40 M14 40 L14 28 M22 40 L22 24 M30 40 L30 28 M13 40 H31" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M22 104 L22 40 M14 40 L14 28 M22 40 L22 24 M30 40 L30 28 M13 40 H31" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>`;
    s+=`<path d="M46 50 Q32 54 36 67 Q42 63 49 61 Z" fill="#99f6e4" ${st}/>`;
    s+=`<path d="M58 16 Q80 13 83 33 L101 31 Q106 39 99 44 L81 46 Q79 59 71 66 Q86 77 77 93 Q69 107 55 101 Q44 95 52 86 Q58 92 64 88 Q68 80 58 74 Q44 66 46 48 Q44 28 58 16 Z" fill="#2dd4bf" ${st}/>`;
    s+=`<path d="M55 16 L52 8 L59 13 L62 5 L65 13 L71 8 L69 17" fill="#5eead4" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`;
    s+=`<path d="M52 56 h9 M50 63 h10 M56 70 h8" stroke="#0f766e" stroke-width="2" stroke-linecap="round" opacity=".6"/>`;
    s+=eyeW(68,30,6)+blush(74,40)+bandana(62,46,col,22);break;
  case 'turtle':
    s+=[[26,92,-.5],[90,94,.5],[30,50,.6],[88,48,-.6]].map(([x,y,a])=>`<ellipse cx="${x}" cy="${y}" rx="14" ry="8" transform="rotate(${a*57} ${x} ${y})" fill="#86efac" ${st}/>`).join('');
    s+=`<circle cx="100" cy="66" r="15" fill="#86efac" ${st}/>`+eyeW(104,62,5.2,1)+smileP(105,72,4.5);
    s+=`<ellipse cx="58" cy="70" rx="40" ry="30" fill="#4ade80" ${st}/><path d="M58 46 L72 56 L68 74 L48 74 L44 56 Z M44 56 L22 62 M72 56 L94 62 M48 74 L36 94 M68 74 L80 94 M58 46 L58 40" fill="#22c55e" stroke="#15803d" stroke-width="2.4" stroke-linejoin="round"/>`;
    s+=`<path d="M86 52 Q100 44 112 54 L110 59 Q100 52 88 58 Z" fill="${col}" stroke="${INK}" stroke-width="2.2"/>`;break;
  case 'flamingo':
    s+=`<path d="M54 80 V113 M66 80 V113" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M54 80 V113 M66 80 V113" stroke="#f472b6" stroke-width="3.5" stroke-linecap="round"/><path d="M48 113 h10 M60 113 h10" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
    s+=`<path d="M72 62 Q86 48 74 36 Q66 28 76 20" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M72 62 Q86 48 74 36 Q66 28 76 20" stroke="#fb7185" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    s+=`<ellipse cx="58" cy="68" rx="27" ry="17" fill="#fb7185" ${st}/><path d="M38 64 Q56 54 70 66 Q58 78 38 64 Z" fill="#fda4af" stroke="${INK}" stroke-width="2.2"/>`;
    s+=`<circle cx="78" cy="20" r="12" fill="#fb7185" ${st}/><path d="M87 17 Q102 19 99 33 Q93 27 87 27 Z" fill="#fde68a" ${st}/><path d="M98 28 Q99 33 99 33 Q95 30 93 29 Z" fill="${INK}"/>`;
    s+=eyeW(79,17,4.6,1)+blush(76,26)+bandana(73,48,col,20);break;
  case 'seal':
    s+=`<circle cx="74" cy="16" r="12" fill="#fff" ${st}/><path d="M64 10 Q74 2 84 10 L74 16 Z" fill="#ef4444"/><path d="M62 18 Q74 30 86 18 L74 16 Z" fill="#3b82f6"/><circle cx="74" cy="16" r="12" fill="none" stroke="${INK}" stroke-width="3"/>`;
    s+=`<path d="M20 100 Q14 72 40 58 Q50 34 72 38 Q88 42 86 60 Q84 80 98 96 Q102 104 90 105 L28 105 Q20 105 20 100 Z" fill="#94a3b8" ${st}/>`;
    s+=`<ellipse cx="44" cy="92" rx="13" ry="7" transform="rotate(-20 44 92)" fill="#7c8ba1" ${st}/>`;
    s+=`<ellipse cx="72" cy="58" rx="11" ry="8" fill="#cbd5e1"/><ellipse cx="72" cy="54" rx="4" ry="3" fill="${INK}"/>`;
    s+=`<path d="M64 60 L52 57 M64 63 L52 64 M80 60 L92 57 M80 63 L92 64" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`;
    s+=eyeW(62,46,5)+eyeW(80,46,5)+smileP(72,62,4)+bandana(64,72,col,26);break;
  case 'bee':{const id=uid();
    s+=`<ellipse cx="36" cy="38" rx="16" ry="11" transform="rotate(-25 36 38)" fill="#e0f2fe" opacity=".85" ${st}/><ellipse cx="84" cy="38" rx="16" ry="11" transform="rotate(25 84 38)" fill="#e0f2fe" opacity=".85" ${st}/>`;
    s+=[-1,1].map(d=>[0,1,2].map(i=>`<path d="M${60+d*18} ${88+i*5} l${d*9} ${6+i*2}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`).join('')).join('');
    s+=`<path d="M52 104 L60 114 L68 104 Z" fill="${INK}"/>`;
    s+=`<defs><clipPath id="${id}"><ellipse cx="60" cy="72" rx="32" ry="34"/></clipPath></defs><ellipse cx="60" cy="72" rx="32" ry="34" fill="#facc15"/><g clip-path="url(#${id})"><rect x="20" y="80" width="80" height="8" fill="${INK}"/><rect x="20" y="96" width="80" height="8" fill="${INK}"/></g><ellipse cx="60" cy="72" rx="32" ry="34" fill="none" ${st}/>`;
    s+=`<path d="M50 40 Q44 24 36 22 M70 40 Q76 24 84 22" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="36" cy="21" r="4" fill="${INK}"/><circle cx="84" cy="21" r="4" fill="${INK}"/>`;
    s+=`<path d="M36 52 Q60 28 84 52 Q60 44 36 52 Z" fill="${col==='#eab308'?'#ef4444':col}" ${st}/>`;
    s+=eyeW(50,62,6.5)+eyeW(70,62,6.5)+smileP(60,72,6)+blush(42,72)+blush(78,72);break;}
  case 'octopus':
    s+=[[-34,1],[-24,-1],[-13,1],[-4,-1],[4,1],[13,-1],[24,1],[34,-1]].map(([dx,c],i)=>{const x=60+dx,d=`M${x} 70 Q${x+dx*.3} 92 ${x+dx*.45+c*6} 104 Q${x+dx*.45+c*12} 110 ${x+dx*.45+c*9} 100`;return `<path d="${d}" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#c084fc" stroke-width="7.5" fill="none" stroke-linecap="round"/>`;}).join('');
    s+=`<path d="M23 66 Q20 16 60 14 Q100 16 97 66 Q97 79 60 80 Q23 79 23 66 Z" fill="#c084fc" ${st}/>`;
    s+=`<circle cx="40" cy="32" r="4" fill="#e9d5ff"/><circle cx="78" cy="28" r="5" fill="#e9d5ff"/><circle cx="86" cy="44" r="3" fill="#e9d5ff"/>`;
    s+=`<path d="M26 34 Q60 4 94 34 Q60 22 26 34 Z" fill="${col==='#a855f7'?'#ef4444':col}" ${st}/>`;
    s+=eyeW(47,52,7)+eyeW(73,52,7)+smileP(60,66,6)+blush(38,64)+blush(82,64);break;
  case 'cat':
    s+=`<path d="M82 100 Q108 96 104 74 Q102 64 94 68" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M82 100 Q108 96 104 74 Q102 64 94 68" stroke="#fb923c" stroke-width="5.5" fill="none" stroke-linecap="round"/>`;
    s+=`<ellipse cx="58" cy="90" rx="26" ry="21" fill="#fb923c" ${st}/><ellipse cx="58" cy="95" rx="14" ry="12" fill="#fed7aa"/>`;
    s+=`<path d="M34 40 L36 14 L52 30 Z M82 40 L80 14 L64 30 Z" fill="#fb923c" ${st}/><path d="M38 34 L39 20 L48 29 Z M78 34 L77 20 L68 29 Z" fill="#fda4af"/>`;
    s+=`<circle cx="58" cy="52" r="27" fill="#fb923c" ${st}/><path d="M50 28 l2 8 M58 26 v9 M66 28 l-2 8" stroke="#c2410c" stroke-width="2.6" stroke-linecap="round"/>`;
    s+=`<ellipse cx="48" cy="52" rx="5.5" ry="6.5" fill="#bef264" stroke="${INK}" stroke-width="2"/><ellipse cx="68" cy="52" rx="5.5" ry="6.5" fill="#bef264" stroke="${INK}" stroke-width="2"/><ellipse cx="48" cy="52.5" rx="1.8" ry="5" fill="${INK}"/><ellipse cx="68" cy="52.5" rx="1.8" ry="5" fill="${INK}"/>`;
    s+=`<path d="M55 60 L61 60 L58 64 Z" fill="#f472b6" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/><path d="M52 66 Q55 69 58 65 Q61 69 64 66" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    s+=`<path d="M44 62 L28 60 M44 65 L29 67 M72 62 L88 60 M72 65 L87 67" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`+bandana(58,76,col,26);break;
  case 'owl':
    s+=`<path d="M40 112 l-4 4 M44 112 v5 M48 112 l4 4 M72 112 l-4 4 M76 112 v5 M80 112 l4 4" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>`;
    s+=`<path d="M60 12 Q100 14 100 66 Q100 112 60 112 Q20 112 20 66 Q20 14 60 12 Z" fill="#9a6b3f" ${st}/>`;
    s+=`<path d="M26 26 L32 6 L46 20 Z M94 26 L88 6 L74 20 Z" fill="#9a6b3f" ${st}/>`;
    s+=`<ellipse cx="60" cy="84" rx="26" ry="24" fill="#f5deb3"/><path d="M48 76 q3 3 6 0 M60 80 q3 3 6 0 M52 90 q3 3 6 0 M64 94 q3 3 6 0" stroke="#b08a5a" stroke-width="2" fill="none"/>`;
    s+=`<path d="M22 60 Q10 84 26 102 Q30 82 30 64 Z M98 60 Q110 84 94 102 Q90 82 90 64 Z" fill="#7a5230" ${st}/>`;
    s+=`<circle cx="44" cy="44" r="15" fill="#fff" stroke="#f59e0b" stroke-width="4"/><circle cx="76" cy="44" r="15" fill="#fff" stroke="#f59e0b" stroke-width="4"/><circle cx="44" cy="44" r="15" fill="none" stroke="${INK}" stroke-width="2"/><circle cx="76" cy="44" r="15" fill="none" stroke="${INK}" stroke-width="2"/>`;
    s+=`<circle cx="45" cy="45" r="7" fill="${INK}"/><circle cx="77" cy="45" r="7" fill="${INK}"/><circle cx="47.5" cy="42" r="2.4" fill="#fff"/><circle cx="79.5" cy="42" r="2.4" fill="#fff"/>`;
    s+=`<path d="M54 56 L66 56 L60 66 Z" fill="#f59e0b" ${st}/>`;
    s+=`<path d="M60 70 v4" stroke="${INK}" stroke-width="2"/><circle cx="60" cy="84" r="10" fill="#fff" ${st}/><path d="M60 84 V78 M60 84 L65 86" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`;
    s+=`<path d="M38 24 Q60 6 82 24 Q60 18 38 24 Z" fill="${col}" stroke="${INK}" stroke-width="2.4"/>`;break;
  }
  return s;
}
const mateSVG=(crew,col,cls='')=>`<svg class="mate ${cls}" viewBox="0 0 120 120" aria-hidden="true">${mateInner(crew,col)}</svg>`;
const mateOf=d=>{const l=ISLANDS[ISL_OF[d]];return l?mateSVG(l.crew,l.col):'';};
const mateBmp=(d,w)=>{const l=ISLANDS[ISL_OF[d]];return svgBitmap('m'+d,svgDoc(mateInner(l.crew,l.col),'0 0 120 120',120,120),w,w);};

/* ---------- القبطان شنبو ---------- */
function shanboInner(mood){
  let s=`<path d="M12 112 Q14 80 40 74 L80 74 Q106 80 108 112 Z" fill="#6d28d9" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
  s+=`<ellipse cx="30" cy="80" rx="12" ry="6" fill="#fbbf24" stroke="${INK}" stroke-width="2"/><ellipse cx="90" cy="80" rx="12" ry="6" fill="#fbbf24" stroke="${INK}" stroke-width="2"/><circle cx="60" cy="90" r="3" fill="#fbbf24"/><circle cx="60" cy="102" r="3" fill="#fbbf24"/>`;
  const sk=mood==='angry'?'#f3a07c':'#f0bf98';
  s+=`<circle cx="60" cy="50" r="28" fill="${sk}" stroke="${INK}" stroke-width="3"/>`;
  s+=`<path d="M6 34 Q25 28 31 5 Q60 18 89 5 Q95 28 114 34 Q86 45 60 38.5 Q34 45 6 34 Z" fill="#b91c1c" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M10 34 Q34 40 60 35 Q86 40 110 34" stroke="#fbbf24" stroke-width="3" fill="none"/>`;
  s+=`<path d="M34 10 Q22 -2 34 -6 Q36 2 42 8 Z" fill="#fff" stroke="${INK}" stroke-width="1.8"/>`;
  const br=mood==='angry'?'M40 40 L54 46 M80 40 L66 46':mood==='oops'?'M40 42 Q47 37 54 41 M66 41 Q73 37 80 42':'M40 44 Q47 40 54 44 M66 41 Q73 36 80 40';
  s+=`<path d="${br}" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
  s+=mood==='oops'?eyeW(47,50,5.5)+eyeW(73,50,5.5):`<circle cx="47" cy="51" r="3.6" fill="${INK}"/><circle cx="73" cy="51" r="3.6" fill="${INK}"/><circle cx="48.2" cy="49.8" r="1.2" fill="#fff"/><circle cx="74.2" cy="49.8" r="1.2" fill="#fff"/>`;
  s+=`<ellipse cx="38" cy="61" rx="6" ry="3.5" fill="#ff8fa3" opacity=".55"/><ellipse cx="82" cy="61" rx="6" ry="3.5" fill="#ff8fa3" opacity=".55"/>`;
  s+=`<ellipse cx="60" cy="58" rx="8" ry="7" fill="#e89a76" stroke="${INK}" stroke-width="2.4"/>`;
  s+=mood==='angry'?`<rect x="50" y="70" width="20" height="8" rx="3" fill="#fff" stroke="${INK}" stroke-width="2"/><path d="M55 70 v8 M60 70 v8 M65 70 v8" stroke="${INK}" stroke-width="1.4"/>`:mood==='oops'||mood==='give'?`<ellipse cx="60" cy="74" rx="5" ry="4.5" fill="#7a2e2e" stroke="${INK}" stroke-width="2"/>`:`<path d="M52 73 Q60 78 70 71" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  s+=`<path d="M60 64 Q48 58 36 64 Q26 70 20 60 Q17 72 30 76 Q45 78 60 70 Q75 78 90 76 Q103 72 100 60 Q94 70 84 64 Q72 58 60 64 Z" fill="#1f2937" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
  s+=`<path d="M20 60 q-4 -6 2 -8 q4 0 3 4 M100 60 q4 -6 -2 -8 q-4 0 -3 4" stroke="#1f2937" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  if(mood==='oops')s+=`<path d="M88 30 Q92 38 88 42 Q84 38 88 30 Z" fill="#7dd3fc" stroke="${INK}" stroke-width="1.5"/>`;
  if(mood==='give')s+=`<path d="M100 104 L106 22" stroke="#8a5526" stroke-width="3.5" stroke-linecap="round"/><path d="M106 24 Q121 27 118 42 Q110 38 104 42 Z" fill="#fff" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="100" cy="100" r="6" fill="${sk}" stroke="${INK}" stroke-width="2.2"/>`;
  return s;
}
const shanboSVG=(mood='smug',cls='')=>`<svg class="shanbo ${cls}" viewBox="0 -8 120 120" aria-hidden="true">${shanboInner(mood)}</svg>`;
const shanboBmp=(mood,w)=>svgBitmap('s'+mood,svgDoc(shanboInner(mood),'0 -8 120 120',120,120),w,w);

/* ---------- سفينتك ---------- */
function shipSVG(o={}){
  const sh=Object.assign({},G.ship,o),sail=(SAILS.find(x=>x[0]===sh.sail)||SAILS[0]),flag=(FLAGS.find(x=>x[0]===sh.flag)||FLAGS[0]);
  const sp='M30 22 Q70 14 110 22 Q114 46 108 66 Q70 60 32 66 Q26 46 30 22 Z';
  let sailF=`<path d="${sp}" fill="${sail[3]}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
  if(sh.sail==='stripes'){const id=uid();sailF=`<defs><clipPath id="${id}"><path d="${sp}"/></clipPath></defs><path d="${sp}" fill="#f8fafc"/><g clip-path="url(#${id})"><rect x="20" y="28" width="100" height="8" fill="#ef4444"/><rect x="20" y="44" width="100" height="8" fill="#ef4444"/><rect x="20" y="60" width="100" height="8" fill="#ef4444"/></g><path d="${sp}" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;}
  if(sh.sail==='gold')sailF+=`<path d="M44 30 Q58 26 66 30" stroke="#fff" stroke-width="3" opacity=".7" fill="none" stroke-linecap="round"/>`;
  return `<svg class="ship ${o.cls||''}" viewBox="0 -4 140 124" aria-hidden="true">
    <rect x="67" y="6" width="6" height="74" rx="2" fill="#6b4423" stroke="${INK}" stroke-width="2.5"/>
    <path d="M73 6 L100 9 L100 25 L73 22 Z" fill="#1f2937" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><text x="86.5" y="20" font-size="11" text-anchor="middle">${flag[3]}</text>
    ${sailF}
    <path d="M8 76 L132 76 Q125 104 100 108 L40 108 Q15 104 8 76 Z" fill="#8b5a2b" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M14 86 H126 M22 96 H118" stroke="#6b4423" stroke-width="2.5"/><circle cx="44" cy="88" r="4" fill="#fde68a" stroke="${INK}" stroke-width="2"/><circle cx="70" cy="88" r="4" fill="#fde68a" stroke="${INK}" stroke-width="2"/><circle cx="96" cy="88" r="4" fill="#fde68a" stroke="${INK}" stroke-width="2"/>
    <path d="M6 76 H134" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <path d="M0 108 Q10 102 20 108 T40 108 T60 108 T80 108 T100 108 T120 108 T140 108 V120 H0 Z" fill="#60a5fa" opacity=".75"/></svg>`;
}

/* ---------- رسم الكنوز والأشياء على الكانفاس ---------- */
const GEMC=['#38bdf8','#f472b6','#4ade80','#a78bfa','#fb923c'];
function drawLoot(x,type,cx,cy,r,i=0){
  x.save();x.lineWidth=Math.max(1,r*.22);x.strokeStyle=INK;
  if(type==='coin'){x.fillStyle='#fbbf24';x.beginPath();x.arc(cx,cy,r,0,7);x.fill();x.stroke();x.strokeStyle='#d97706';x.lineWidth=Math.max(.8,r*.16);x.beginPath();x.arc(cx,cy,r*.6,0,7);x.stroke();
    x.fillStyle='rgba(255,255,255,.75)';x.beginPath();x.arc(cx-r*.35,cy-r*.35,r*.22,0,7);x.fill();}
  else if(type==='gem'){x.fillStyle=GEMC[i%GEMC.length];x.beginPath();x.moveTo(cx,cy-r);x.lineTo(cx+r*.9,cy-r*.2);x.lineTo(cx,cy+r);x.lineTo(cx-r*.9,cy-r*.2);x.closePath();x.fill();x.stroke();
    x.fillStyle='rgba(255,255,255,.6)';x.beginPath();x.moveTo(cx-r*.3,cy-r*.5);x.lineTo(cx,cy-r*.75);x.lineTo(cx+r*.1,cy-r*.3);x.closePath();x.fill();}
  else{x.fillStyle='#fdf2f8';x.beginPath();x.arc(cx,cy,r*.9,0,7);x.fill();x.stroke();x.fillStyle='rgba(255,255,255,.95)';x.beginPath();x.arc(cx-r*.3,cy-r*.3,r*.28,0,7);x.fill();x.fillStyle='rgba(244,114,182,.25)';x.beginPath();x.arc(cx+r*.25,cy+r*.25,r*.4,0,7);x.fill();}
  x.restore();}
function drawItem(x,type,cx,cy,s,a=0){
  x.save();x.translate(cx,cy);x.rotate(a);x.lineJoin='round';x.lineCap='round';x.strokeStyle=INK;x.lineWidth=Math.max(1,s*.06);
  if(type==='fish'){x.fillStyle='#38bdf8';x.beginPath();x.ellipse(0,0,s*.5,s*.3,0,0,7);x.fill();x.stroke();x.beginPath();x.moveTo(s*.45,0);x.lineTo(s*.78,-s*.25);x.lineTo(s*.78,s*.25);x.closePath();x.fill();x.stroke();
    x.fillStyle=INK;x.beginPath();x.arc(-s*.26,-s*.05,s*.07,0,7);x.fill();}
  else if(type==='banana'){x.fillStyle='#fde047';x.beginPath();x.moveTo(-s*.5,-s*.2);x.quadraticCurveTo(0,s*.55,s*.5,-s*.2);x.quadraticCurveTo(0,s*.22,-s*.5,-s*.2);x.closePath();x.fill();x.stroke();
    x.fillStyle='#713f12';x.beginPath();x.arc(-s*.5,-s*.2,s*.06,0,7);x.fill();}
  else{x.fillStyle='#334155';x.beginPath();x.arc(0,0,s*.4,0,7);x.fill();x.stroke();x.fillStyle='rgba(255,255,255,.45)';x.beginPath();x.arc(-s*.13,-s*.13,s*.1,0,7);x.fill();}
  x.restore();}
function drawChest(x,cx,cy,w,n,loot){
  const h=w*.62;x.save();x.lineJoin='round';x.strokeStyle=INK;x.lineWidth=Math.max(2,w*.035);
  /* الغطاء المفتوح */
  x.fillStyle='#a0632d';x.beginPath();x.moveTo(cx-w*.5,cy-h*.48);x.lineTo(cx-w*.44,cy-h*1.05);x.quadraticCurveTo(cx,cy-h*1.3,cx+w*.44,cy-h*1.05);x.lineTo(cx+w*.5,cy-h*.48);x.closePath();x.fill();x.stroke();
  x.fillStyle='#7a4518';x.beginPath();x.moveTo(cx-w*.44,cy-h*.55);x.lineTo(cx-w*.4,cy-h*.95);x.quadraticCurveTo(cx,cy-h*1.16,cx+w*.4,cy-h*.95);x.lineTo(cx+w*.44,cy-h*.55);x.closePath();x.fill();
  /* الكومة */
  const pr=Math.max(3.5,w*.07);
  if(n<=12){const rows=Math.ceil(n/6);for(let i=0;i<n;i++){const row=Math.floor(i/6),inRow=row<rows-1?6:n-6*(rows-1),col=i%6;drawLoot(x,loot,cx+(col-(inRow-1)/2)*pr*2.3,cy-h*.5-pr*.85-row*pr*2.05,pr,i);}}
  else{const m=Math.min(n,46);for(let i=0;i<m;i++){const row=Math.floor(Math.sqrt(i*1.6)),spread=w*.4*(1-row*.09);drawLoot(x,loot,cx+((i*37)%17/17-.5)*spread*1.9,cy-h*.5-pr*.6-row*pr*1.05,pr,i);}}
  /* الجسم */
  x.fillStyle='#b06a2c';x.beginPath();x.roundRect(cx-w*.5,cy-h*.5,w,h,w*.06);x.fill();x.stroke();
  x.fillStyle='#fbbf24';x.fillRect(cx-w*.5+2,cy-h*.5+h*.18,w-4,h*.1);x.fillRect(cx-w*.32,cy-h*.5+1,w*.08,h-2);x.fillRect(cx+w*.24,cy-h*.5+1,w*.08,h-2);
  x.beginPath();x.roundRect(cx-w*.07,cy-h*.18,w*.14,h*.3,3);x.fill();x.stroke();
  x.restore();}
function drawBarrel(x,cx,cy,w,fill,cap,item,lid,flash){
  const h=w*1.2;x.save();x.lineJoin='round';x.strokeStyle=INK;x.lineWidth=Math.max(1.6,w*.05);
  if(flash){x.fillStyle=flash;x.beginPath();x.ellipse(cx,cy,w*.75,h*.62,0,0,7);x.fill();}
  x.fillStyle='#b7793f';x.beginPath();x.moveTo(cx-w*.4,cy-h*.5);x.quadraticCurveTo(cx-w*.56,cy,cx-w*.4,cy+h*.5);x.lineTo(cx+w*.4,cy+h*.5);x.quadraticCurveTo(cx+w*.56,cy,cx+w*.4,cy-h*.5);x.closePath();x.fill();x.stroke();
  x.strokeStyle='#5b3415';x.lineWidth=Math.max(2,w*.08);[-.28,.28].forEach(f=>{x.beginPath();x.moveTo(cx-w*.48,cy+h*f);x.lineTo(cx+w*.48,cy+h*f);x.stroke();});
  x.strokeStyle='rgba(0,0,0,.18)';x.lineWidth=1.5;[-.15,.15].forEach(f=>{x.beginPath();x.moveTo(cx+w*f,cy-h*.48);x.lineTo(cx+w*f,cy+h*.48);x.stroke();});
  x.fillStyle=lid?'#8b5a2b':'#3b2410';x.strokeStyle=INK;x.lineWidth=Math.max(1.6,w*.05);x.beginPath();x.ellipse(cx,cy-h*.5,w*.4,w*.1,0,0,7);x.fill();x.stroke();
  if(lid){x.strokeStyle='#5b3415';x.lineWidth=2;x.beginPath();x.moveTo(cx-w*.3,cy-h*.5);x.lineTo(cx+w*.3,cy-h*.5);x.stroke();}
  else{const k=Math.min(fill,cap,6);for(let i=0;i<k;i++)drawItem(x,item,cx-w*.22+(i%3)*w*.22,cy-h*.5-w*.1-(i>2?w*.13:0),w*.36,(i%2?.5:-.5));
    if(k){x.strokeStyle=INK;x.lineWidth=Math.max(1.6,w*.05);x.fillStyle='#b7793f';x.beginPath();x.ellipse(cx,cy-h*.5,w*.4,w*.1,0,0,Math.PI);x.lineTo(cx-w*.4,cy-h*.5+w*.06);x.ellipse(cx,cy-h*.5+w*.06,w*.4,w*.1,0,Math.PI,0,true);x.closePath();x.fill();x.stroke();}}
  x.restore();}
