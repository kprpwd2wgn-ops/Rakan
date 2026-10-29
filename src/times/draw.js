/* ===== الرسم: الوحوش اللطيفة والتنانين ===== */
const INK='#1d2433';
function face(x,s,{y=0,gap=.15,er=.075,mouth=.1,shy=false}={}){
  const e=s*er;x.fillStyle='#fff';x.strokeStyle=INK;x.lineWidth=Math.max(1,s*.035);
  [-1,1].forEach(d=>{x.beginPath();x.arc(d*s*gap,y,e*1.25,0,7);x.fill();x.stroke();x.fillStyle=INK;x.beginPath();x.arc(d*s*gap+e*.25,y+e*.15,e*.7,0,7);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(d*s*gap+e*.45,y-e*.25,e*.28,0,7);x.fill();x.fillStyle='#fff';});
  x.beginPath();x.lineWidth=Math.max(1.2,s*.045);x.strokeStyle=INK;x.arc(0,y+s*.09,s*mouth,.15*Math.PI,.85*Math.PI);x.stroke();
  x.fillStyle='rgba(255,120,150,.45)';[-1,1].forEach(d=>{x.beginPath();x.ellipse(d*s*(gap+.1),y+s*.09,s*.06,s*.04,0,0,7);x.fill();});
}
function drawMon(x,type,s,col){
  x.save();x.lineJoin='round';x.lineCap='round';x.strokeStyle=INK;const lw=Math.max(1.4,s*.055);x.lineWidth=lw;
  const P=()=>{x.fill();x.stroke();};
  switch(type){
   case 'mushroom':x.fillStyle='#fde7c8';x.beginPath();x.roundRect(-s*.19,-s*.02,s*.38,s*.42,s*.12);P();
     x.fillStyle=col;x.beginPath();x.ellipse(0,-s*.04,s*.45,s*.34,0,Math.PI,0);x.closePath();P();
     x.fillStyle='#fff';[[-.2,-.2,.07],[.08,-.27,.06],[.25,-.12,.05],[-.02,-.12,.04]].forEach(([a,b,r])=>{x.beginPath();x.arc(a*s,b*s,r*s,0,7);x.fill();});
     face(x,s,{y:s*.14,gap:.1,er:.06,mouth:.07});break;
   case 'rock':x.fillStyle=col;x.beginPath();x.moveTo(-s*.42,s*.34);x.lineTo(-s*.4,-s*.06);x.lineTo(-s*.2,-s*.34);x.lineTo(s*.14,-s*.38);x.lineTo(s*.4,-s*.12);x.lineTo(s*.44,s*.34);x.closePath();P();
     x.fillStyle='rgba(255,255,255,.3)';x.beginPath();x.ellipse(-s*.15,-s*.18,s*.1,s*.05,-.5,0,7);x.fill();x.fillStyle='#84cc16';x.beginPath();x.ellipse(s*.15,-s*.34,s*.14,s*.05,0,0,7);x.fill();
     face(x,s,{y:s*.05});break;
   case 'cactus':x.fillStyle=col;x.beginPath();x.roundRect(-s*.43,-s*.12,s*.16,s*.26,s*.08);P();x.beginPath();x.roundRect(s*.27,-s*.2,s*.16,s*.26,s*.08);P();
     x.beginPath();x.roundRect(-s*.24,-s*.4,s*.48,s*.8,s*.22);P();x.fillStyle='#ff7eb3';x.beginPath();x.arc(0,-s*.42,s*.08,0,7);P();
     face(x,s,{y:-s*.04,gap:.11,er:.065,mouth:.07});break;
   case 'crab':x.strokeStyle=INK;[-1,1].forEach(d=>{x.beginPath();x.moveTo(d*s*.2,s*.18);x.lineTo(d*s*.36,s*.38);x.stroke();});
     x.fillStyle=col;[-1,1].forEach(d=>{x.beginPath();x.arc(d*s*.42,-s*.08,s*.12,0,7);P();});
     x.beginPath();x.ellipse(0,s*.08,s*.38,s*.26,0,0,7);P();
     [-1,1].forEach(d=>{x.beginPath();x.moveTo(d*s*.12,-s*.1);x.lineTo(d*s*.14,-s*.28);x.stroke();});
     face(x,s,{y:-s*.3,gap:.14,er:.07,mouth:.0001});x.beginPath();x.lineWidth=lw;x.arc(0,s*.1,s*.1,.15*Math.PI,.85*Math.PI);x.stroke();break;
   case 'bat':x.fillStyle=col;[-1,1].forEach(d=>{x.beginPath();x.moveTo(d*s*.14,-s*.08);x.quadraticCurveTo(d*s*.5,-s*.36,d*s*.5,s*.02);x.quadraticCurveTo(d*s*.4,-s*.02,d*s*.36,s*.1);x.quadraticCurveTo(d*s*.28,s*.02,d*s*.18,s*.12);x.closePath();P();});
     x.beginPath();x.arc(0,0,s*.27,0,7);P();[-1,1].forEach(d=>{x.beginPath();x.moveTo(d*s*.08,-s*.24);x.lineTo(d*s*.2,-s*.42);x.lineTo(d*s*.22,-s*.18);P();});
     face(x,s,{y:-s*.02,gap:.11,er:.065,mouth:.07});break;
   case 'cloud':x.fillStyle='#fff';[[-.2,.06,.22],[.18,.06,.22],[0,-.1,.28],[-.32,.16,.14],[.32,.16,.14]].forEach(([a,b,r])=>{x.beginPath();x.arc(a*s,b*s,r*s,0,7);P();});
     x.fillStyle='#fff';x.beginPath();x.ellipse(0,s*.12,s*.36,s*.16,0,0,7);x.fill();x.fillStyle=col;x.globalAlpha=.35;x.beginPath();x.ellipse(0,s*.26,s*.34,s*.06,0,0,7);x.fill();x.globalAlpha=1;
     face(x,s,{y:s*.02,gap:.12});break;
   case 'bee':x.fillStyle='rgba(255,255,255,.85)';[-1,1].forEach(d=>{x.beginPath();x.ellipse(d*s*.14,-s*.3,s*.14,s*.2,d*.5,0,7);P();});
     x.fillStyle=col;x.beginPath();x.ellipse(0,s*.04,s*.38,s*.3,0,0,7);P();x.save();x.beginPath();x.ellipse(0,s*.04,s*.38,s*.3,0,0,7);x.clip();x.fillStyle=INK;[-.12,.12].forEach(a=>x.fillRect(s*a-s*.05,-s*.4,s*.1,s*.9));x.restore();
     x.beginPath();x.ellipse(0,s*.04,s*.38,s*.3,0,0,7);x.stroke();face(x,s,{y:-s*.02,gap:.24,er:.06,mouth:.06});break;
   case 'jelly':x.globalAlpha=.9;x.fillStyle=col;x.beginPath();x.arc(0,0,s*.36,Math.PI,0);x.lineTo(s*.36,s*.12);x.quadraticCurveTo(0,s*.22,-s*.36,s*.12);x.closePath();P();x.globalAlpha=1;
     x.strokeStyle=col;x.lineWidth=lw*1.3;[-.22,-.07,.08,.23].forEach(a=>{x.beginPath();x.moveTo(a*s,s*.16);x.quadraticCurveTo(a*s+s*.06,s*.28,a*s,s*.42);x.stroke();});
     x.strokeStyle=INK;x.lineWidth=lw;x.fillStyle='rgba(255,255,255,.45)';x.beginPath();x.ellipse(-s*.15,-s*.18,s*.08,s*.05,-.5,0,7);x.fill();face(x,s,{y:-s*.04});break;
   case 'ghost':x.fillStyle='#fff';x.beginPath();x.moveTo(-s*.34,s*.38);x.lineTo(-s*.34,-s*.04);x.arc(0,-s*.04,s*.34,Math.PI,0);x.lineTo(s*.34,s*.38);
     for(let i=0;i<4;i++){const a=s*.34-i*s*.17;x.quadraticCurveTo(a-s*.045,s*.3,a-s*.085,s*.38);x.quadraticCurveTo(a-s*.125,s*.46,a-s*.17,s*.38);}x.closePath();P();
     x.fillStyle=col;x.globalAlpha=.55;x.beginPath();x.arc(0,s*.22,s*.06,0,7);x.fill();x.globalAlpha=1;face(x,s,{y:-s*.06});break;
   case 'robot':x.beginPath();x.moveTo(0,-s*.3);x.lineTo(0,-s*.44);x.stroke();x.fillStyle='#ef4444';x.beginPath();x.arc(0,-s*.46,s*.06,0,7);P();
     x.fillStyle=col;x.beginPath();x.roundRect(-s*.36,-s*.3,s*.72,s*.66,s*.14);P();x.fillStyle='#1e293b';x.beginPath();x.roundRect(-s*.26,-s*.18,s*.52,s*.22,s*.08);x.fill();
     x.fillStyle='#67e8f9';[-1,1].forEach(d=>{x.beginPath();x.arc(d*s*.11,-s*.07,s*.06,0,7);x.fill();});x.strokeStyle=INK;x.beginPath();x.moveTo(-s*.12,s*.18);x.lineTo(s*.12,s*.18);x.stroke();break;
   case 'penguin':x.fillStyle='#f59e0b';[-1,1].forEach(d=>{x.beginPath();x.ellipse(d*s*.12,s*.38,s*.1,s*.05,0,0,7);P();});
     x.fillStyle='#1f2937';x.beginPath();x.ellipse(0,s*.02,s*.32,s*.38,0,0,7);P();x.fillStyle='#fff';x.beginPath();x.ellipse(0,s*.1,s*.22,s*.27,0,0,7);x.fill();
     x.fillStyle=col;x.beginPath();x.roundRect(-s*.3,-s*.1,s*.6,s*.09,s*.04);P();x.fillStyle='#f59e0b';x.beginPath();x.moveTo(-s*.06,-s*.12);x.lineTo(s*.06,-s*.12);x.lineTo(0,-s*.04);x.closePath();P();
     face(x,s,{y:-s*.2,gap:.1,er:.06,mouth:.0001});break;
   default:/* slime */x.fillStyle=col;x.beginPath();x.moveTo(-s*.42,s*.34);x.bezierCurveTo(-s*.46,-s*.2,-s*.2,-s*.42,0,-s*.42);x.bezierCurveTo(s*.2,-s*.42,s*.46,-s*.2,s*.42,s*.34);x.quadraticCurveTo(0,s*.42,-s*.42,s*.34);x.closePath();P();
     x.fillStyle='rgba(255,255,255,.4)';x.beginPath();x.ellipse(-s*.17,-s*.2,s*.09,s*.06,-.6,0,7);x.fill();face(x,s,{y:s*.02});
  }
  x.restore();
}
const SPR={};
function monSprite(type,col,s){const k=type+col+Math.round(s);if(SPR[k])return SPR[k];const d=Math.min(2,window.devicePixelRatio||1),c=document.createElement('canvas');
  c.width=c.height=Math.ceil(s*1.2*d);const x=c.getContext('2d');x.scale(d,d);x.translate(s*.6,s*.6);drawMon(x,type,s,col);SPR[k]=c;return c;}
function monIcon(type,col,px=52){const c=document.createElement('canvas'),d=Math.min(2,window.devicePixelRatio||1);c.width=c.height=px*d;c.style.width=c.style.height=px+'px';
  const x=c.getContext('2d');x.scale(d,d);x.translate(px/2,px/2+2);drawMon(x,type,px*.82,col);return c;}
function fillIcons(root){$$('canvas[data-mon]',root).forEach(cv=>{const ic=monIcon(cv.dataset.mon,cv.dataset.col,+cv.dataset.px||52);cv.replaceWith(ic);});}
const monCV=(type,col,px=52)=>`<canvas data-mon="${type}" data-col="${col}" data-px="${px}" width="${px}" height="${px}" style="width:${px}px;height:${px}px"></canvas>`;

/* التنين: المرحلة ٠ بيضة، ١ صغير، ٢ يافع، ٣ كبير */
function dragonSVG(n,stage,o={}){
  const c=LANDS[LAND_OF[n]].col,ink=INK;
  if(!stage)return eggSVG(n,o);
  const sc=[0,.78,.9,1][stage];const wing=stage===1?.6:stage===2?.85:1.15;
  return `<svg class="dragon ${o.cls||''}" viewBox="0 0 120 120" aria-hidden="true"><g transform="translate(60 66) scale(${sc}) translate(-60 -66)">
   <ellipse cx="60" cy="112" rx="34" ry="5" fill="rgba(0,0,0,.18)"/>
   <path d="M78 92 Q108 96 104 70 Q102 62 96 66 Q98 84 76 82" fill="${c}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
   <g class="wings"><path d="M48 62 Q${46-30*wing} ${40-24*wing} ${30-26*wing} ${44-10*wing} Q${36-14*wing} ${56} 46 74 Z" fill="#a78bfa" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
   <path d="M72 62 Q${74+30*wing} ${40-24*wing} ${90+26*wing} ${44-10*wing} Q${84+14*wing} 56 74 74 Z" fill="#a78bfa" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/></g>
   <ellipse cx="60" cy="84" rx="25" ry="22" fill="${c}" stroke="${ink}" stroke-width="3"/>
   <ellipse cx="60" cy="90" rx="15" ry="13" fill="#fde68a" stroke="${ink}" stroke-width="2"/>
   <text x="60" y="96" text-anchor="middle" font-family="Lalezar, sans-serif" font-size="16" fill="${ink}">×${D(n)}</text>
   <ellipse cx="46" cy="104" rx="8" ry="6" fill="${c}" stroke="${ink}" stroke-width="2.5"/><ellipse cx="74" cy="104" rx="8" ry="6" fill="${c}" stroke="${ink}" stroke-width="2.5"/>
   ${stage>=2?`<path d="M44 34 L38 16 L52 28 M76 34 L82 16 L68 28" fill="#fde68a" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"/>`:''}
   <ellipse cx="60" cy="48" rx="${stage===1?26:23}" ry="${stage===1?22:20}" fill="${c}" stroke="${ink}" stroke-width="3"/>
   <ellipse cx="60" cy="58" rx="13" ry="8" fill="#fde68a" stroke="${ink}" stroke-width="2"/><circle cx="55" cy="57" r="1.6" fill="${ink}"/><circle cx="65" cy="57" r="1.6" fill="${ink}"/>
   <g class="eyes"><circle cx="49" cy="44" r="${stage===1?7:6}" fill="#fff" stroke="${ink}" stroke-width="2"/><circle cx="71" cy="44" r="${stage===1?7:6}" fill="#fff" stroke="${ink}" stroke-width="2"/>
   <circle cx="50" cy="45" r="3.4" fill="${ink}"/><circle cx="72" cy="45" r="3.4" fill="${ink}"/><circle cx="51.4" cy="43.4" r="1.2" fill="#fff"/><circle cx="73.4" cy="43.4" r="1.2" fill="#fff"/></g>
   ${stage===3?`<path d="M44 26 L48 12 L56 22 L60 8 L64 22 L72 12 L76 26 Z" fill="#fbbf24" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"/>`:''}
   ${stage>=2?`<path d="M60 68 l-5 -4 M60 68 l5 -4" stroke="${ink}" stroke-width="2" fill="none"/>`:''}
  </g></svg>`;
}
function eggSVG(n,o={}){const c=LANDS[LAND_OF[n]]?LANDS[LAND_OF[n]].col:'#ddd';
  return `<svg class="egg ${o.cls||''}" viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="110" rx="26" ry="5" fill="rgba(0,0,0,.18)"/>
   <path d="M60 14 C86 14 98 58 96 78 C94 100 78 108 60 108 C42 108 26 100 24 78 C22 58 34 14 60 14 Z" fill="#fff7ed" stroke="${INK}" stroke-width="3"/>
   <circle cx="46" cy="52" r="8" fill="${c}"/><circle cx="72" cy="40" r="6" fill="${c}"/><circle cx="70" cy="76" r="10" fill="${c}"/><circle cx="42" cy="86" r="6" fill="${c}"/>
   ${o.crack?`<path d="M30 66 L42 58 L50 68 L60 56 L70 68 L80 58 L92 66" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`:''}
   <text x="60" y="${o.crack?96:70}" text-anchor="middle" font-family="Lalezar, sans-serif" font-size="20" fill="${INK}" opacity=".75">${o.q===false?'':'×'+D(n)}</text></svg>`;}
