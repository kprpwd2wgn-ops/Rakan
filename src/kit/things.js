/* ===== أشياء مرسومة على الكانفاس (مشتركة بين مدينة الكلام وصاروخ القراءة) =====
   paintThing(ctx, اسم الشيء, x, y, الحجم, اللون, الوقت) يرسم الشيء ومركزه عند x,y. */
const TINK='#1d2433';
const THING_HEX={red:'#ef4444',blue:'#3b82f6',green:'#22c55e',yellow:'#facc15',orange:'#fb923c',purple:'#a855f7',pink:'#f472b6',black:'#1f2937',white:'#f8fafc',brown:'#92400e',gray:'#9ca3af',grey:'#9ca3af',gold:'#f5b82e',silver:'#cbd5e1'};
function shade(h,a){const n=parseInt(h.slice(1),16),c=v=>clamp(v+a,0,255);return'#'+((1<<24)+(c(n>>16)<<16)+(c((n>>8)&255)<<8)+c(n&255)).toString(16).slice(1);}
function drawStar(x,cx,cy,r,fill,stroke=TINK){x.save();x.fillStyle=fill;x.strokeStyle=stroke;x.lineWidth=Math.max(1.5,r*.14);x.lineJoin='round';x.beginPath();
  for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);}x.closePath();x.fill();x.stroke();x.restore();}
/* أسفل كل شيء بالنسبة إلى مركزه (لكي يقف على الأرض أو فوق شيء آخر) */
const THING_FOOT={cat:.23,dog:.24,ball:.25,apple:.28,bird:.18,duck:.24,teddy:.3,star:.38,balloon:.3,car:.3,flower:.42,tree:.4,heart:.3,fish:.16,box:.3,table:.4,chair:.4,house:.4,boat:.22,kite:.34,butterfly:.24,sun:.5,moon:.32,cloud:.21,rainbow:.3};
function paintThing(x,n,cx,cy,s,col,t=0){
  const C=col?THING_HEX[col]||col:null;x.save();x.translate(cx,cy);x.lineJoin='round';x.lineCap='round';x.strokeStyle=TINK;x.lineWidth=Math.max(1.6,s*.05);
  const INK=TINK,F=(c)=>{x.fillStyle=c;x.fill();x.stroke();};
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
  case 'cat':{const dark=col==='black'||col==='brown'||col==='purple'||col==='blue';
    x.beginPath();x.moveTo(-s*.24,-s*.06);x.lineTo(-s*.2,-s*.34);x.lineTo(-s*.06,-s*.2);x.closePath();F(C);x.beginPath();x.moveTo(s*.24,-s*.06);x.lineTo(s*.2,-s*.34);x.lineTo(s*.06,-s*.2);x.closePath();F(C);
    x.beginPath();x.ellipse(0,0,s*.27,s*.22,0,0,7);F(C);x.fillStyle=col==='black'?'#fde047':INK;[-1,1].forEach(d=>{x.beginPath();x.ellipse(d*s*.1,-s*.02,s*.035,s*.05,0,0,7);x.fill();});
    x.fillStyle='#f472b6';x.beginPath();x.moveTo(-s*.03,s*.05);x.lineTo(s*.03,s*.05);x.lineTo(0,s*.09);x.fill();x.strokeStyle=dark?'#e5e7eb':INK;x.lineWidth=1.4;[-1,1].forEach(d=>{x.beginPath();x.moveTo(d*s*.08,s*.08);x.lineTo(d*s*.3,s*.04);x.moveTo(d*s*.08,s*.1);x.lineTo(d*s*.3,s*.12);x.stroke();});break;}
  case 'dog':x.beginPath();x.ellipse(0,0,s*.25,s*.22,0,0,7);F(C);[-1,1].forEach(d=>{x.beginPath();x.ellipse(d*s*.25,s*.02,s*.08,s*.16,d*.3,0,7);F(shade(C,-30));});
    x.beginPath();x.ellipse(0,s*.08,s*.12,s*.09,0,0,7);F(shade(C,40));x.fillStyle=INK;x.beginPath();x.ellipse(0,s*.04,s*.04,s*.03,0,0,7);x.fill();[-1,1].forEach(d=>{x.beginPath();x.arc(d*s*.1,-s*.06,s*.035,0,7);x.fill();});
    x.fillStyle='#f87171';x.beginPath();x.ellipse(0,s*.16,s*.035,s*.05,0,0,7);x.fill();break;
  case 'apple':x.beginPath();x.moveTo(0,-s*.16);x.bezierCurveTo(-s*.32,-s*.3,-s*.38,s*.16,-s*.12,s*.26);x.quadraticCurveTo(0,s*.3,s*.12,s*.26);x.bezierCurveTo(s*.38,s*.16,s*.32,-s*.3,0,-s*.16);F(C);
    x.beginPath();x.moveTo(0,-s*.16);x.lineTo(s*.03,-s*.28);x.stroke();x.beginPath();x.ellipse(s*.1,-s*.26,s*.08,s*.04,-.5,0,7);F('#22c55e');x.fillStyle='rgba(255,255,255,.45)';x.beginPath();x.ellipse(-s*.12,-s*.04,s*.04,s*.08,.3,0,7);x.fill();break;
  case 'fish':x.beginPath();x.ellipse(0,0,s*.26,s*.16,0,0,7);F(C);x.beginPath();x.moveTo(s*.22,0);x.lineTo(s*.4,-s*.14);x.lineTo(s*.4,s*.14);x.closePath();F(C);x.fillStyle=INK;x.beginPath();x.arc(-s*.13,-s*.03,s*.03,0,7);x.fill();
    x.strokeStyle='rgba(0,0,0,.25)';x.beginPath();x.arc(-s*.02,0,s*.12,-1,1);x.stroke();break;
  case 'boat':x.beginPath();x.moveTo(-s*.38,s*.04);x.lineTo(s*.38,s*.04);x.lineTo(s*.26,s*.22);x.lineTo(-s*.26,s*.22);x.closePath();F('#92400e');x.beginPath();x.moveTo(0,s*.04);x.lineTo(0,-s*.4);x.stroke();
    x.beginPath();x.moveTo(s*.02,-s*.38);x.lineTo(s*.3,-s*.02);x.lineTo(s*.02,-s*.02);x.closePath();F(C);break;
  case 'duck':x.beginPath();x.ellipse(0,s*.06,s*.26,s*.18,0,0,7);F(C);x.beginPath();x.arc(-s*.14,-s*.14,s*.13,0,7);F(C);
    x.beginPath();x.moveTo(-s*.26,-s*.15);x.lineTo(-s*.4,-s*.1);x.lineTo(-s*.26,-s*.07);x.closePath();F('#f59e0b');x.fillStyle=INK;x.beginPath();x.arc(-s*.17,-s*.17,s*.025,0,7);x.fill();
    x.beginPath();x.moveTo(s*.02,s*.02);x.quadraticCurveTo(s*.14,-s*.06,s*.2,s*.06);x.stroke();break;
  case 'teddy':{const B=C||'#b45309';[-1,1].forEach(d=>{x.beginPath();x.arc(d*s*.15,-s*.28,s*.07,0,7);F(B);});x.beginPath();x.ellipse(0,s*.12,s*.2,s*.18,0,0,7);F(B);
    x.beginPath();x.arc(0,-s*.14,s*.17,0,7);F(shade(B,20));x.beginPath();x.ellipse(0,-s*.09,s*.07,s*.05,0,0,7);F('#fde68a');x.fillStyle=INK;[-1,1].forEach(d=>{x.beginPath();x.arc(d*s*.06,-s*.17,s*.022,0,7);x.fill();});
    x.beginPath();x.arc(0,-s*.1,s*.022,0,7);x.fill();break;}
  /* أثاث: صندوق، طاولة، كرسي */
  case 'box':{const B=C||'#c68a4e';x.beginPath();x.rect(-s*.4,-s*.22,s*.8,s*.52);F(B);x.beginPath();x.roundRect(-s*.45,-s*.32,s*.9,s*.13,s*.03);F(shade(B,15));
    x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=s*.05;x.beginPath();x.moveTo(0,-s*.19);x.lineTo(0,s*.3);x.stroke();break;}
  case 'boxback':{const B=C||'#c68a4e';x.beginPath();x.moveTo(-s*.4,-s*.18);x.lineTo(-s*.32,-s*.34);x.lineTo(s*.32,-s*.34);x.lineTo(s*.4,-s*.18);x.closePath();F(shade(B,-55));break;}
  case 'boxfront':{const B=C||'#c68a4e';x.beginPath();x.rect(-s*.4,-s*.18,s*.8,s*.48);F(B);
    x.beginPath();x.moveTo(-s*.4,-s*.18);x.lineTo(-s*.56,-s*.36);x.lineTo(-s*.4,-s*.32);x.closePath();F(shade(B,15));x.beginPath();x.moveTo(s*.4,-s*.18);x.lineTo(s*.56,-s*.36);x.lineTo(s*.4,-s*.32);x.closePath();F(shade(B,15));
    x.strokeStyle='rgba(0,0,0,.2)';x.lineWidth=s*.04;x.beginPath();x.moveTo(-s*.3,s*.05);x.lineTo(s*.3,s*.05);x.stroke();break;}
  case 'table':{const B=C||'#a16207';x.beginPath();x.roundRect(-s*.62,-s*.2,s*1.24,s*.1,s*.03);F(B);[-1,1].forEach(d=>{x.beginPath();x.rect(d*s*.5-s*.04,-s*.1,s*.08,s*.5);F(shade(B,-25));});break;}
  case 'chair':{const B=C||'#d97706';x.beginPath();x.rect(-s*.3,-s*.62,s*.08,s*.64);F(shade(B,-20));x.beginPath();x.roundRect(-s*.32,-s*.06,s*.64,s*.1,s*.03);F(B);
    [-1,1].forEach(d=>{x.beginPath();x.rect(d*s*.25-s*.035,s*.04,s*.07,s*.36);F(shade(B,-20));});break;}
  }
  x.restore();}
