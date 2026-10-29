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
function shade(h,a){const n=parseInt(h.slice(1),16),c=v=>clamp(v+a,0,255);return'#'+((1<<24)+(c(n>>16)<<16)+(c((n>>8)&255)<<8)+c(n&255)).toString(16).slice(1);}

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
function drawStar(x,cx,cy,r,fill,stroke=INK){x.save();x.fillStyle=fill;x.strokeStyle=stroke;x.lineWidth=Math.max(1.5,r*.14);x.lineJoin='round';x.beginPath();
  for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);}x.closePath();x.fill();x.stroke();x.restore();}

/* ---------- أشياء الرسّام ---------- */
function paintThing(x,n,cx,cy,s,col,t=0){
  const C=col?COLHEX[col]||col:null;x.save();x.translate(cx,cy);x.lineJoin='round';x.lineCap='round';x.strokeStyle=INK;x.lineWidth=Math.max(1.6,s*.05);
  const F=(c)=>{x.fillStyle=c;x.fill();x.stroke();};
  switch(n){
  case 'sun':{x.strokeStyle=C;x.lineWidth=s*.07;for(let i=0;i<10;i++){const a=i*Math.PI/5+t*.4;x.beginPath();x.moveTo(Math.cos(a)*s*.36,Math.sin(a)*s*.36);x.lineTo(Math.cos(a)*s*.5,Math.sin(a)*s*.5);x.stroke();}
    x.strokeStyle=INK;x.lineWidth=Math.max(1.6,s*.05);x.beginPath();x.arc(0,0,s*.3,0,7);F(C);
    x.fillStyle=INK;[-1,1].forEach(d=>{x.beginPath();x.arc(d*s*.1,-s*.04,s*.03,0,7);x.fill();});x.beginPath();x.arc(0,s*.05,s*.1,.2,Math.PI-.2);x.stroke();break;}
  case 'moon':{const R=s*.32,d=R*.55,r2=R*.82,ix=(d*d+R*R-r2*r2)/(2*d),iy=Math.sqrt(Math.max(0,R*R-ix*ix)),t1=Math.atan2(iy,ix);x.rotate(-.35);
    x.beginPath();x.arc(0,0,R,t1,Math.PI*2-t1,false);x.arc(d,0,r2,Math.atan2(-iy,ix-d),Math.atan2(iy,ix-d),true);x.closePath();F(C);
    x.fillStyle=INK;x.beginPath();x.arc(-R*.45,-R*.1,R*.07,0,7);x.fill();x.beginPath();x.arc(-R*.38,R*.22,R*.14,.2,Math.PI-.6);x.stroke();break;}
  case 'star':drawStar(x,0,0,s*.38,C);break;
  case 'cloud':x.beginPath();x.arc(-s*.2,s*.04,s*.17,Math.PI*.5,Math.PI*1.5);x.arc(0,-s*.08,s*.22,Math.PI,0);x.arc(s*.22,s*.04,s*.16,Math.PI*1.5,Math.PI*.5);x.closePath();F(C);break;
  case 'bird':{const f=Math.sin(t*10)*s*.08;x.beginPath();x.ellipse(0,0,s*.24,s*.18,0,0,7);F(C);x.beginPath();x.moveTo(-s*.06,-s*.04);x.quadraticCurveTo(-s*.2,-s*.3-f,s*.08,-s*.12);F(shade(C,-30));
    x.beginPath();x.moveTo(s*.22,-s*.02);x.lineTo(s*.36,s*.03);x.lineTo(s*.22,s*.08);F('#f59e0b');x.fillStyle=INK;x.beginPath();x.arc(s*.12,-s*.05,s*.03,0,7);x.fill();break;}
  case 'balloon':x.beginPath();x.moveTo(0,s*.3);x.quadraticCurveTo(s*.06,s*.42,-s*.02,s*.55);x.stroke();x.beginPath();x.ellipse(0,0,s*.22,s*.28,0,0,7);F(C);
    x.beginPath();x.moveTo(-s*.04,s*.27);x.lineTo(s*.04,s*.27);x.lineTo(0,s*.32);F(C);x.fillStyle='rgba(255,255,255,.55)';x.beginPath();x.ellipse(-s*.08,-s*.1,s*.04,s*.08,-.4,0,7);x.fill();break;
  case 'kite':x.beginPath();x.moveTo(0,-s*.34);x.lineTo(s*.24,0);x.lineTo(0,s*.34);x.lineTo(-s*.24,0);x.closePath();F(C);x.beginPath();x.moveTo(0,-s*.34);x.lineTo(0,s*.34);x.moveTo(-s*.24,0);x.lineTo(s*.24,0);x.stroke();
    x.beginPath();x.moveTo(0,s*.34);x.quadraticCurveTo(s*.12,s*.48,0,s*.6);x.quadraticCurveTo(-s*.1,s*.7,s*.05,s*.8);x.stroke();break;
  case 'butterfly':{const f=Math.abs(Math.sin(t*6))*.4+.6;[-1,1].forEach(d=>{x.beginPath();x.ellipse(d*s*.16*f,-s*.08,s*.17*f,s*.2,d*.3,0,7);F(C);x.beginPath();x.ellipse(d*s*.12*f,s*.14,s*.11*f,s*.13,-d*.3,0,7);F(shade(C,30));});
    x.beginPath();x.ellipse(0,0,s*.04,s*.24,0,0,7);F(INK);x.beginPath();x.moveTo(0,-s*.22);x.lineTo(-s*.08,-s*.34);x.moveTo(0,-s*.22);x.lineTo(s*.08,-s*.34);x.stroke();break;}
  case 'rainbow':['#ef4444','#fb923c','#facc15','#22c55e','#3b82f6','#a855f7'].forEach((c,i)=>{x.strokeStyle=c;x.lineWidth=s*.07;x.beginPath();x.arc(0,s*.3,s*(.56-i*.07),Math.PI,0);x.stroke();});
    x.fillStyle='#fff';x.strokeStyle=INK;x.lineWidth=1.5;[-1,1].forEach(d=>{x.beginPath();x.arc(d*s*.42,s*.3,s*.1,0,7);x.arc(d*s*.33,s*.32,s*.08,0,7);x.fill();});break;
  case 'heart':x.beginPath();x.moveTo(0,s*.3);x.bezierCurveTo(-s*.45,0,-s*.25,-s*.36,0,-s*.12);x.bezierCurveTo(s*.25,-s*.36,s*.45,0,0,s*.3);F(C);x.fillStyle='rgba(255,255,255,.5)';x.beginPath();x.arc(-s*.15,-s*.12,s*.05,0,7);x.fill();break;
  case 'tree':x.beginPath();x.roundRect(-s*.07,-s*.05,s*.14,s*.45,s*.03);F('#92400e');x.beginPath();x.arc(0,-s*.18,s*.27,0,7);x.arc(-s*.2,-s*.02,s*.17,0,7);x.arc(s*.2,-s*.02,s*.17,0,7);F(C);
    x.fillStyle='rgba(255,255,255,.25)';x.beginPath();x.arc(-s*.08,-s*.28,s*.07,0,7);x.fill();break;
  case 'flower':x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(s*.04,s*.25,0,s*.42);x.strokeStyle='#16a34a';x.lineWidth=s*.05;x.stroke();x.strokeStyle=INK;x.lineWidth=Math.max(1.6,s*.04);
    x.fillStyle='#22c55e';x.beginPath();x.ellipse(s*.1,s*.24,s*.09,s*.04,-.5,0,7);x.fill();x.stroke();
    for(let i=0;i<6;i++){const a=i*Math.PI/3;x.beginPath();x.ellipse(Math.cos(a)*s*.13,-s*.05+Math.sin(a)*s*.13,s*.1,s*.07,a,0,7);F(C);}x.beginPath();x.arc(0,-s*.05,s*.08,0,7);F('#facc15');break;
  case 'house':x.beginPath();x.rect(-s*.32,-s*.1,s*.64,s*.5);F(C);x.beginPath();x.moveTo(-s*.42,-s*.08);x.lineTo(0,-s*.45);x.lineTo(s*.42,-s*.08);x.closePath();F('#7c2d12');
    x.beginPath();x.roundRect(-s*.08,s*.12,s*.16,s*.28,s*.04);F('#fde68a');x.beginPath();x.rect(s*.12,0,s*.14,s*.13);F('#bae6fd');x.beginPath();x.rect(-s*.26,0,s*.14,s*.13);F('#bae6fd');break;
  case 'car':x.beginPath();x.roundRect(-s*.42,-s*.05,s*.84,s*.24,s*.08);F(C);x.beginPath();x.moveTo(-s*.22,-s*.05);x.lineTo(-s*.12,-s*.24);x.lineTo(s*.16,-s*.24);x.lineTo(s*.26,-s*.05);x.closePath();F(C);
    x.beginPath();x.moveTo(-s*.16,-s*.07);x.lineTo(-s*.09,-s*.2);x.lineTo(s*.02,-s*.2);x.lineTo(s*.02,-s*.07);x.closePath();F('#bae6fd');x.beginPath();x.moveTo(s*.06,-s*.07);x.lineTo(s*.06,-s*.2);x.lineTo(s*.14,-s*.2);x.lineTo(s*.2,-s*.07);x.closePath();F('#bae6fd');
    [-1,1].forEach(d=>{x.beginPath();x.arc(d*s*.24,s*.2,s*.1,0,7);F('#1f2937');x.beginPath();x.arc(d*s*.24,s*.2,s*.04,0,7);F('#cbd5e1');});break;
  case 'ball':x.beginPath();x.arc(0,0,s*.25,0,7);F(C);x.beginPath();x.arc(0,0,s*.25,-.3,.3);x.moveTo(-s*.25,0);x.quadraticCurveTo(0,s*.12,s*.25,0);x.stroke();x.fillStyle='rgba(255,255,255,.5)';x.beginPath();x.arc(-s*.09,-s*.1,s*.05,0,7);x.fill();break;
  case 'cat':x.beginPath();x.moveTo(-s*.24,-s*.06);x.lineTo(-s*.2,-s*.34);x.lineTo(-s*.06,-s*.2);x.closePath();F(C);x.beginPath();x.moveTo(s*.24,-s*.06);x.lineTo(s*.2,-s*.34);x.lineTo(s*.06,-s*.2);x.closePath();F(C);
    x.beginPath();x.ellipse(0,0,s*.27,s*.22,0,0,7);F(C);x.fillStyle=col==='black'?'#fde047':INK;[-1,1].forEach(d=>{x.beginPath();x.ellipse(d*s*.1,-s*.02,s*.035,s*.05,0,0,7);x.fill();});
    x.fillStyle='#f472b6';x.beginPath();x.moveTo(-s*.03,s*.05);x.lineTo(s*.03,s*.05);x.lineTo(0,s*.09);x.fill();x.strokeStyle=col==='black'?'#e5e7eb':INK;x.lineWidth=1.4;[-1,1].forEach(d=>{x.beginPath();x.moveTo(d*s*.08,s*.08);x.lineTo(d*s*.3,s*.04);x.moveTo(d*s*.08,s*.1);x.lineTo(d*s*.3,s*.12);x.stroke();});break;
  case 'dog':x.beginPath();x.ellipse(0,0,s*.25,s*.22,0,0,7);F(C);[-1,1].forEach(d=>{x.beginPath();x.ellipse(d*s*.25,s*.02,s*.08,s*.16,d*.3,0,7);F(shade(C,-30));});
    x.beginPath();x.ellipse(0,s*.08,s*.12,s*.09,0,0,7);F(shade(C,40));x.fillStyle=INK;x.beginPath();x.ellipse(0,s*.04,s*.04,s*.03,0,0,7);x.fill();[-1,1].forEach(d=>{x.beginPath();x.arc(d*s*.1,-s*.06,s*.035,0,7);x.fill();});
    x.fillStyle='#f87171';x.beginPath();x.ellipse(0,s*.16,s*.035,s*.05,0,0,7);x.fill();break;
  case 'apple':x.beginPath();x.moveTo(0,-s*.16);x.bezierCurveTo(-s*.32,-s*.3,-s*.38,s*.16,-s*.12,s*.26);x.quadraticCurveTo(0,s*.3,s*.12,s*.26);x.bezierCurveTo(s*.38,s*.16,s*.32,-s*.3,0,-s*.16);F(C);
    x.beginPath();x.moveTo(0,-s*.16);x.lineTo(s*.03,-s*.28);x.stroke();x.beginPath();x.ellipse(s*.1,-s*.26,s*.08,s*.04,-.5,0,7);F('#22c55e');x.fillStyle='rgba(255,255,255,.45)';x.beginPath();x.ellipse(-s*.12,-s*.04,s*.04,s*.08,.3,0,7);x.fill();break;
  case 'fish':x.beginPath();x.ellipse(0,0,s*.26,s*.16,0,0,7);F(C);x.beginPath();x.moveTo(s*.22,0);x.lineTo(s*.4,-s*.14);x.lineTo(s*.4,s*.14);x.closePath();F(C);x.fillStyle=INK;x.beginPath();x.arc(-s*.13,-s*.03,s*.03,0,7);x.fill();
    x.strokeStyle='rgba(0,0,0,.25)';x.beginPath();x.arc(-s*.02,0,s*.12,-1,1);x.stroke();break;
  case 'boat':x.beginPath();x.moveTo(-s*.38,s*.04);x.lineTo(s*.38,s*.04);x.lineTo(s*.26,s*.22);x.lineTo(-s*.26,s*.22);x.closePath();F('#92400e');x.beginPath();x.moveTo(0,s*.04);x.lineTo(0,-s*.4);x.stroke();
    x.beginPath();x.moveTo(s*.02,-s*.38);x.lineTo(s*.3,-s*.02);x.lineTo(s*.02,-s*.02);x.closePath();F(C);break;
  }
  x.restore();}
