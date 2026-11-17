/* ===== الرسم: روبو، ليو، السيد فرشاة، المتاهة، وأشياء الرسّام ===== */
const INK='#1d2433';
const svgDoc=(inner,vb,w,h)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}">${inner}</svg>`;
const IMGC={};
function svgBitmap(key,svg,w,h){
  let e=IMGC[key];
  if(!e){e=IMGC[key]={img:new Image(),ok:false,c:{}};e.img.onload=()=>{e.ok=true;};e.img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);}
  if(!e.ok)return null;
  const dpr=Math.min(2,window.devicePixelRatio||1),cw=Math.max(1,Math.round(w*dpr)),ch=Math.max(1,Math.round(h*dpr)),k=cw+'x'+ch;
  if(!e.c[k]){const c=document.createElement('canvas');c.width=cw;c.height=ch;c.getContext('2d').drawImage(e.img,0,0,cw,ch);e.c[k]=c;}
  return e.c[k];
}

/* ---------- روبو ---------- */
function roboInner(mood){
  let s=`<ellipse cx="50" cy="106" rx="26" ry="4" fill="rgba(0,0,0,.18)"/>`;
  s+=`<circle cx="34" cy="98" r="8" fill="#334155" stroke="${INK}" stroke-width="3"/><circle cx="66" cy="98" r="8" fill="#334155" stroke="${INK}" stroke-width="3"/><circle cx="34" cy="98" r="3" fill="#94a3b8"/><circle cx="66" cy="98" r="3" fill="#94a3b8"/>`;
  const arm=mood==='happy'?['M24 66 L12 50','M76 66 L88 50']:mood==='bump'?['M24 68 L14 60','M76 68 L86 60']:['M24 66 L16 80','M76 66 L84 80'];
  arm.forEach(d=>{s+=`<path d="${d}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="${d}" stroke="#94a3b8" stroke-width="5" stroke-linecap="round"/>`;});
  s+=`<rect x="24" y="56" width="52" height="38" rx="10" fill="#7dd3fc" stroke="${INK}" stroke-width="3"/><rect x="34" y="64" width="32" height="20" rx="5" fill="#0c4a6e" stroke="${INK}" stroke-width="2"/>`;
  s+=`<path d="M45 70 l5 -4 l5 4 l-5 9 z" fill="#f472b6"/>`;
  s+=`<path d="M50 8 V20" stroke="${INK}" stroke-width="3"/><circle cx="50" cy="8" r="5.5" fill="${mood==='bump'?'#f87171':'#facc15'}" stroke="${INK}" stroke-width="2.5"/>`;
  s+=`<rect x="20" y="20" width="60" height="38" rx="13" fill="#e2e8f0" stroke="${INK}" stroke-width="3"/><rect x="16" y="32" width="6" height="14" rx="3" fill="#94a3b8" stroke="${INK}" stroke-width="2"/><rect x="78" y="32" width="6" height="14" rx="3" fill="#94a3b8" stroke="${INK}" stroke-width="2"/>`;
  s+=`<rect x="27" y="27" width="46" height="24" rx="9" fill="#1e293b"/>`;
  const E='#67e8f9';
  if(mood==='happy')s+=`<path d="M34 41 Q39 34 44 41 M56 41 Q61 34 66 41" stroke="${E}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  else if(mood==='bump')s+=`<path d="M34 34 l9 8 m0 -8 l-9 8 M57 34 l9 8 m0 -8 l-9 8" stroke="#fca5a5" stroke-width="3.2" stroke-linecap="round"/>`;
  else if(mood==='confused')s+=`<rect x="34" y="35" width="8" height="9" rx="3" fill="${E}"/><rect x="58" y="33" width="10" height="12" rx="4" fill="${E}"/>`;
  else s+=`<rect x="34" y="33" width="9" height="11" rx="4" fill="${E}"/><rect x="57" y="33" width="9" height="11" rx="4" fill="${E}"/>`;
  if(mood==='talk')s+=`<path d="M42 48 q4 -3 8 0 t8 0" stroke="${E}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  if(mood==='confused')s+=`<text x="86" y="18" font-size="18" font-weight="900" fill="#f59e0b" font-family="sans-serif">?</text>`;
  return s;
}
const roboSVG=(mood='idle',cls='')=>`<svg class="robo ${cls}" viewBox="0 0 100 110" aria-hidden="true">${roboInner(mood)}</svg>`;
const roboBmp=(mood,w)=>svgBitmap('r'+mood,svgDoc(roboInner(mood).replace(/<text[^]*?<\/text>/g,''),'0 0 100 110',100,110),w,w*1.1);

/* ---------- ليو الفضائي ---------- */
function zibSVG(o={}){
  const col=o.col||'#a3e635',m=o.mood||'happy',dk=shade(col.length===7?col:'#a3e635',-40),lt=shade(col.length===7?col:'#a3e635',50);
  let s=`<ellipse cx="60" cy="134" rx="30" ry="5" fill="rgba(0,0,0,.2)"/>`;
  s+=`<path d="M44 24 Q36 8 30 6 M76 24 Q84 8 90 6" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="30" cy="6" r="6" fill="${lt}" stroke="${INK}" stroke-width="2.5"/><circle cx="90" cy="6" r="6" fill="${lt}" stroke="${INK}" stroke-width="2.5"/>`;
  s+=`<path d="M40 118 L36 132 L48 132 Z M80 118 L84 132 L72 132 Z" fill="${dk}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
  const arms=m==='wow'||m==='laugh'?['M24 76 Q10 62 12 48','M96 76 Q110 62 108 48']:m==='sad'?['M24 80 Q14 94 20 104','M96 80 Q106 94 100 104']:['M24 78 Q10 84 12 96','M96 78 Q110 70 108 58'];
  arms.forEach(d=>{s+=`<path d="${d}" stroke="${INK}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${col}" stroke-width="6.5" fill="none" stroke-linecap="round"/>`;});
  s+=`<path d="M60 18 Q100 18 102 62 Q104 100 86 116 Q60 128 34 116 Q16 100 18 62 Q20 18 60 18 Z" fill="${col}" stroke="${INK}" stroke-width="3.5"/>`;
  s+=`<ellipse cx="60" cy="96" rx="22" ry="17" fill="${lt}" opacity=".6"/>`;
  s+=`<circle cx="60" cy="32" r="7" fill="#fff" stroke="${INK}" stroke-width="2.5"/><circle cx="60" cy="33" r="3.5" fill="${INK}"/>`;
  const eye=(x)=>m==='laugh'?`<path d="M${x-9} 56 Q${x} 46 ${x+9} 56" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`:
    `<ellipse cx="${x}" cy="54" rx="${m==='wow'?11:10}" ry="${m==='wow'?13:12}" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="${x+1}" cy="${m==='sad'?58:55}" r="${m==='wow'?5:6}" fill="${INK}"/><circle cx="${x+3}" cy="${m==='sad'?55:52}" r="2" fill="#fff"/>`;
  s+=eye(44)+eye(76);
  if(m==='sad')s+=`<path d="M34 40 L50 44 M86 40 L70 44" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  s+=`<ellipse cx="30" cy="70" rx="6" ry="3.5" fill="#ff8fa3" opacity=".55"/><ellipse cx="90" cy="70" rx="6" ry="3.5" fill="#ff8fa3" opacity=".55"/>`;
  s+={happy:`<path d="M48 74 Q60 86 72 74" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
    laugh:`<path d="M46 72 Q60 92 74 72 Z" fill="#7a2e2e" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M52 80 Q60 86 68 80" fill="#f87171"/>`,
    wow:`<ellipse cx="60" cy="78" rx="7" ry="8" fill="#7a2e2e" stroke="${INK}" stroke-width="3"/>`,
    sad:`<path d="M48 82 Q60 72 72 82" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
    chew:`<path d="M48 76 Q54 82 60 76 Q66 82 72 76" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="34" cy="76" r="5" fill="${dk}" opacity=".5"/><circle cx="86" cy="76" r="5" fill="${dk}" opacity=".5"/>`,
    talk:`<ellipse cx="60" cy="77" rx="9" ry="6" fill="#7a2e2e" stroke="${INK}" stroke-width="3"/>`}[m]||'';
  return `<svg class="zib ${o.cls||''}" viewBox="0 0 120 140" aria-hidden="true">${s}</svg>`;
}

/* ---------- السيد فرشاة ---------- */
function brushSVG(col='#f472b6',mood='happy'){
  let s=`<ellipse cx="40" cy="136" rx="18" ry="3.5" fill="rgba(0,0,0,.18)"/>`;
  s+=`<path d="M22 16 Q40 -6 58 16 L56 46 Q40 52 24 46 Z" fill="${col}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M30 18 L32 42 M40 12 V44 M50 18 L48 42" stroke="rgba(0,0,0,.18)" stroke-width="2"/>`;
  s+=`<path d="M20 12 Q34 -2 52 6 Q46 12 22 16 Z" fill="#e11d48" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="51" cy="5" r="3" fill="#e11d48" stroke="${INK}" stroke-width="2"/>`;
  s+=`<rect x="23" y="44" width="34" height="16" rx="4" fill="#cbd5e1" stroke="${INK}" stroke-width="3"/><path d="M24 50 H56" stroke="#94a3b8" stroke-width="2"/>`;
  s+=`<path d="M26 60 L54 60 L50 130 Q40 136 30 130 Z" fill="#c68a4e" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
  s+=`<path d="M26 82 Q12 88 10 100 M54 82 Q68 76 70 64" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M26 82 Q12 88 10 100 M54 82 Q68 76 70 64" stroke="#c68a4e" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  s+=mood==='think'?`<circle cx="34" cy="76" r="3.4" fill="${INK}"/><circle cx="47" cy="74" r="3.4" fill="${INK}"/><path d="M35 88 H46" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`
    :`<path d="M30 76 Q34 71 38 76 M43 76 Q47 71 51 76" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M33 84 Q40 92 47 84" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  s+=`<ellipse cx="29" cy="83" rx="3.5" ry="2.2" fill="#ff8fa3" opacity=".6"/><ellipse cx="51" cy="83" rx="3.5" ry="2.2" fill="#ff8fa3" opacity=".6"/>`;
  return `<svg class="brush" viewBox="0 -4 80 144" aria-hidden="true">${s}</svg>`;
}

/* ---------- المتاهة على الكانفاس ---------- */
const KEYHEX={gold:'#fbbf24',red:'#ef4444',blue:'#3b82f6'};
function drawKey(x,cx,cy,s,col){x.save();x.translate(cx,cy);x.rotate(-.6);x.strokeStyle=INK;x.lineWidth=Math.max(1.5,s*.07);x.fillStyle=KEYHEX[col];
  x.beginPath();x.arc(-s*.18,0,s*.2,0,7);x.fill();x.stroke();x.fillStyle='#fff';x.beginPath();x.arc(-s*.18,0,s*.07,0,7);x.fill();
  x.fillStyle=KEYHEX[col];x.beginPath();x.rect(0,-s*.06,s*.36,s*.12);x.fill();x.stroke();x.beginPath();x.rect(s*.22,s*.04,s*.07,s*.12);x.rect(s*.3,s*.04,s*.06,s*.09);x.fill();x.stroke();x.restore();}
function drawDoor(x,X,Y,s,col,open){x.save();x.strokeStyle=INK;x.lineWidth=2.5;
  if(open){x.fillStyle='rgba(0,0,0,.08)';x.beginPath();x.roundRect(X+3,Y+3,s-6,s-6,6);x.fill();x.setLineDash([4,4]);x.strokeStyle=KEYHEX[col];x.stroke();x.setLineDash([]);x.restore();return;}
  x.fillStyle=KEYHEX[col];x.beginPath();x.roundRect(X+3,Y+3,s-6,s-6,7);x.fill();x.stroke();
  x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=2;x.beginPath();x.moveTo(X+s/2,Y+6);x.lineTo(X+s/2,Y+s-6);x.stroke();
  x.fillStyle=INK;x.beginPath();x.arc(X+s/2,Y+s*.45,s*.08,0,7);x.fill();x.beginPath();x.moveTo(X+s/2-s*.05,Y+s*.47);x.lineTo(X+s/2+s*.05,Y+s*.47);x.lineTo(X+s/2,Y+s*.66);x.closePath();x.fill();x.restore();}
/* أشياء الرسّام (paintThing) في src/kit/things.js، مشتركة مع صاروخ القراءة */
