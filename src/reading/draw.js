/* ===== الرسم: وحوش الكلمات، الصاروخ، والمشتبه بهم ===== */
const INK='#1d2433';
const MCOL=['#f472b6','#a78bfa','#34d399','#fbbf24','#60a5fa','#fb923c','#f87171','#2dd4bf'];
function drawWordMonster(x,cx,cy,s,col,word,mood,t,i){
  x.save();x.translate(cx,cy);x.lineJoin='round';x.lineCap='round';x.strokeStyle=INK;const lw=Math.max(2,s*.045);x.lineWidth=lw;
  const sq=mood==='pop'?1:1+Math.sin(t*4+i)*.03;x.scale(1/sq,sq);
  /* قرون */
  x.fillStyle=col;[-1,1].forEach(d=>{x.beginPath();x.moveTo(d*s*.16,-s*.36);x.quadraticCurveTo(d*s*.3,-s*.62,d*s*.36,-s*.42);x.closePath();x.fill();x.stroke();});
  /* أذرع */
  [-1,1].forEach(d=>{x.beginPath();x.moveTo(d*s*.4,0);x.quadraticCurveTo(d*s*.62,-s*.05+Math.sin(t*6+i+d)*s*.06,d*s*.58,s*.18);x.lineWidth=s*.11;x.strokeStyle=INK;x.stroke();x.lineWidth=s*.07;x.strokeStyle=col;x.stroke();});
  x.strokeStyle=INK;x.lineWidth=lw;
  /* الجسم */
  x.fillStyle=col;x.beginPath();x.moveTo(-s*.44,s*.12);x.bezierCurveTo(-s*.5,-s*.52,s*.5,-s*.52,s*.44,s*.12);x.bezierCurveTo(s*.46,s*.42,s*.2,s*.48,0,s*.46);x.bezierCurveTo(-s*.2,s*.48,-s*.46,s*.42,-s*.44,s*.12);x.fill();x.stroke();
  /* أرجل */
  [-1,1].forEach(d=>{x.beginPath();x.ellipse(d*s*.18,s*.48,s*.11,s*.06,0,0,7);x.fill();x.stroke();});
  /* العيون */
  const ey=-s*.24;if(mood==='laugh'){x.lineWidth=lw*1.2;[-1,1].forEach(d=>{x.beginPath();x.arc(d*s*.13,ey+s*.03,s*.07,Math.PI*1.1,Math.PI*1.9);x.stroke();});}
  else{[-1,1].forEach(d=>{x.fillStyle='#fff';x.beginPath();x.arc(d*s*.13,ey,s*.1,0,7);x.fill();x.stroke();x.fillStyle=INK;x.beginPath();x.arc(d*s*.13+(mood==='worried'?0:s*.02),ey+s*.02,s*.05,0,7);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(d*s*.13+s*.035,ey-s*.015,s*.018,0,7);x.fill();});}
  x.lineWidth=lw;x.beginPath();if(mood==='laugh'){x.fillStyle='#7a2e2e';x.ellipse(0,-s*.1,s*.08,s*.05,0,0,7);x.fill();x.stroke();}else{x.arc(0,-s*.13,s*.06,.2,Math.PI-.2);x.stroke();}
  /* لافتة الكلمة */
  const fs=Math.min(s*.26,s*1.2/Math.max(3,word.length));x.font=`600 ${fs}px Fredoka, "Baloo Bhaijaan 2", sans-serif`;x.direction='ltr';
  const tw=x.measureText(word).width+s*.16,th=fs*1.35;x.fillStyle='#fff';x.beginPath();x.roundRect(-tw/2,s*.02,tw,th,th*.3);x.fill();x.stroke();
  x.fillStyle=INK;x.textAlign='center';x.textBaseline='middle';x.fillText(word,0,s*.02+th/2+1);
  x.restore();}
function drawRocket(x,cx,cy,s,t){x.save();x.translate(cx,cy);x.lineJoin='round';x.strokeStyle=INK;x.lineWidth=3;
  const fl=s*(.22+Math.sin(t*30)*.05);x.fillStyle='#fb923c';x.beginPath();x.moveTo(-s*.12,s*.3);x.quadraticCurveTo(0,s*.3+fl*2,s*.12,s*.3);x.fill();x.fillStyle='#fde047';x.beginPath();x.moveTo(-s*.06,s*.3);x.quadraticCurveTo(0,s*.3+fl*1.2,s*.06,s*.3);x.fill();
  x.fillStyle='#ef4444';[-1,1].forEach(d=>{x.beginPath();x.moveTo(d*s*.14,s*.05);x.lineTo(d*s*.3,s*.3);x.lineTo(d*s*.14,s*.28);x.closePath();x.fill();x.stroke();});
  x.fillStyle='#f8fafc';x.beginPath();x.moveTo(0,-s*.5);x.bezierCurveTo(s*.22,-s*.3,s*.18,s*.2,s*.14,s*.32);x.lineTo(-s*.14,s*.32);x.bezierCurveTo(-s*.18,s*.2,-s*.22,-s*.3,0,-s*.5);x.fill();x.stroke();
  x.fillStyle='#ef4444';x.beginPath();x.moveTo(0,-s*.5);x.bezierCurveTo(s*.12,-s*.4,s*.15,-s*.32,s*.16,-s*.28);x.lineTo(-s*.16,-s*.28);x.bezierCurveTo(-s*.15,-s*.32,-s*.12,-s*.4,0,-s*.5);x.fill();x.stroke();
  x.fillStyle='#7dd3fc';x.beginPath();x.arc(0,-s*.08,s*.09,0,7);x.fill();x.stroke();x.fillStyle='rgba(255,255,255,.7)';x.beginPath();x.arc(-s*.03,-s*.11,s*.03,0,7);x.fill();
  x.restore();}

/* ---------- المشتبه بهم في قضايا المحقق ---------- */
function suspectSVG(a,cls=''){
  const c=SCOL[a.col],sc=a.big?1:.8,I=INK;let s='';
  const ty=a.big?0:18;
  s+=`<g transform="translate(60 ${ty+6}) scale(${sc}) translate(-60 0)">`;
  /* قرون الاستشعار */
  const ants=a.ant===1?[60]:[44,76];
  ants.forEach(ax=>{s+=`<path d="M${ax} 34 Q${ax+(ax-60)*.3} 14 ${ax+(ax-60)*.5} 8" stroke="${I}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="${ax+(ax-60)*.5}" cy="8" r="5" fill="#fde047" stroke="${I}" stroke-width="2"/>`;});
  /* الذراعان والجسم */
  s+=`<path d="M24 86 Q10 92 12 104 M96 86 Q110 80 112 70" stroke="${I}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M24 86 Q10 92 12 104 M96 86 Q110 80 112 70" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  s+=`<path d="M60 30 Q98 30 100 72 Q102 112 60 116 Q18 112 20 72 Q22 30 60 30 Z" fill="${c}" stroke="${I}" stroke-width="3"/><ellipse cx="60" cy="94" rx="20" ry="14" fill="#fff" opacity=".3"/>`;
  s+=`<path d="M44 114 v8 M76 114 v8" stroke="${I}" stroke-width="6" stroke-linecap="round"/>`;
  /* العيون */
  const ex=a.eyes===1?[60]:a.eyes===2?[48,72]:[42,60,78],er=a.eyes===3?7:9;
  ex.forEach(e=>{s+=`<circle cx="${e}" cy="62" r="${er}" fill="#fff" stroke="${I}" stroke-width="2.5"/><circle cx="${e+1}" cy="63" r="${er*.5}" fill="${I}"/><circle cx="${e+2.5}" cy="60.5" r="${er*.18}" fill="#fff"/>`;});
  if(a.gl){ex.forEach(e=>{s+=`<circle cx="${e}" cy="62" r="${er+3}" fill="rgba(255,255,255,.15)" stroke="${I}" stroke-width="3"/>`;});if(ex.length>1)s+=`<path d="M${ex[0]+er+3} 62 H${ex[ex.length-1]-er-3}" stroke="${I}" stroke-width="3"/>`;
    s+=`<path d="M${ex[0]-er-3} 60 L22 56 M${ex[ex.length-1]+er+3} 60 L98 56" stroke="${I}" stroke-width="2.5"/>`;}
  s+=`<path d="M50 84 Q60 92 70 84" stroke="${I}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  /* القبعة */
  if(a.hat==='cap')s+=`<path d="M34 42 Q34 20 60 20 Q86 20 86 42 Z" fill="#ef4444" stroke="${I}" stroke-width="3"/><path d="M84 40 Q102 38 106 46 Q96 48 84 46 Z" fill="#b91c1c" stroke="${I}" stroke-width="2.5"/><circle cx="60" cy="20" r="3" fill="${I}"/>`;
  if(a.hat==='crown')s+=`<path d="M38 36 L40 14 L50 26 L60 8 L70 26 L80 14 L82 36 Z" fill="#fbbf24" stroke="${I}" stroke-width="3" stroke-linejoin="round"/><circle cx="60" cy="22" r="3" fill="#ef4444"/>`;
  if(a.hat==='hat')s+=`<rect x="40" y="6" width="40" height="28" rx="3" fill="#1f2937" stroke="${I}" stroke-width="3"/><rect x="32" y="32" width="56" height="7" rx="3" fill="#1f2937" stroke="${I}" stroke-width="3"/><rect x="40" y="24" width="40" height="5" fill="#ef4444"/>`;
  /* الشيء في اليد */
  if(a.item==='balloon')s+=`<path d="M112 70 Q116 50 110 34" stroke="${I}" stroke-width="1.8" fill="none"/><ellipse cx="110" cy="22" rx="11" ry="14" fill="#f472b6" stroke="${I}" stroke-width="2.5"/>`;
  if(a.item==='book')s+=`<rect x="100" y="56" width="22" height="26" rx="2" fill="#3b82f6" stroke="${I}" stroke-width="2.5" transform="rotate(10 111 69)"/><path d="M104 60 v20" stroke="#fff" stroke-width="2" transform="rotate(10 111 69)"/>`;
  if(a.item==='ball')s+=`<circle cx="114" cy="62" r="11" fill="#fff" stroke="${I}" stroke-width="2.5"/><path d="M104 60 Q114 66 124 60 M114 51 V73" stroke="${I}" stroke-width="2"/>`;
  if(a.item==='flower')s+=`<path d="M112 70 V48" stroke="#16a34a" stroke-width="3"/>${[0,1,2,3,4].map(k=>{const an=k*72*Math.PI/180;return `<circle cx="${112+Math.cos(an)*6}" cy="${42+Math.sin(an)*6}" r="5" fill="#f9a8d4" stroke="${I}" stroke-width="1.5"/>`;}).join('')}<circle cx="112" cy="42" r="4" fill="#facc15" stroke="${I}" stroke-width="1.5"/>`;
  s+='</g>';
  return `<svg class="sus ${cls}" viewBox="-6 -4 134 134" aria-hidden="true">${s}</svg>`;
}
