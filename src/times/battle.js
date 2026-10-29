/* ===== المعركة: جيوش في صفوف وأعمدة ===== */
const weak=(t,k)=>[1.3,2,1,.2][mastery(t,k)];
function bagK(t,list,count){const out=[];let pool=[];while(out.length<count){if(!pool.length)pool=shuffle(list.slice()).sort((a,b)=>weak(t,b)-weak(t,a)+(Math.random()-.5)*1.6);out.push(pool.shift());}return out;}
function mkGrid(t,k,o={}){const sw=o.fix?false:Math.random()<.5;return{type:o.gold?'gold':'grid',t,k,R:o.R||(sw?k:t),C:o.C||(sw?t:k)};}
function mkFog(t,k){return{type:'fog',t,k,R:t,C:Math.max(3,k)};}
function mkTrain(t){const k=rint(3,11);const s=Math.min(8,Math.max(1,k-rint(1,3)));return{type:'train',t,k,s,idx:k-s};}
function planFor(mode,t){
  if(mode==='tutorial')return[{R:1,C:3},{R:1,C:5},{R:2,C:3},{R:2,C:5},{R:3,C:2}].map((g,i)=>Object.assign(mkGrid(g.R,g.C,{fix:1,R:g.R,C:g.C}),{tut:i}));
  if(mode==='b1'){const p=bagK(t,[1,2,3,4,5,6,7],6).map(k=>mkGrid(t,k));p.splice(rint(2,5),0,mkGrid(t,rint(3,8),{gold:1}));return p;}
  if(mode==='b2'){const p=bagK(t,[6,7,8,9,10,11,12],5).map(k=>mkGrid(t,k));const ex=shuffle([mkFog(t,rint(4,9)),mkTrain(t),mkGrid(t,rint(5,12),{gold:1})]);ex.forEach(w=>p.splice(rint(1,p.length),0,w));return p;}
  if(mode==='practice'){const p=bagK(t,[1,2,3,4,5,6,7,8,9,10,11,12],5).map(k=>mkGrid(t,k));[mkFog(t,rint(3,10)),mkTrain(t),mkGrid(t,rint(3,12),{gold:1})].forEach(w=>p.splice(rint(1,p.length),0,w));return p;}
  return[];
}

def('battle',arg=>{
  const node=arg.node!=null?NODES[arg.node]:null;
  const mode=node?node.kind:arg.practice?'practice':'endless';
  const land=node?LANDS[node.li]:arg.practice?LANDS[LAND_OF[arg.practice]]:LANDS[9];
  const T0=node?node.t:arg.practice||0,comp=G.comp||0,tower=mode==='endless',boss=mode==='boss';
  const tabs=tower?unlockedTables().filter(x=>x>1):[T0];if(tower&&!tabs.length)tabs.push(2);
  setTitle(tower?'🗼 البرج الأخير':boss?`👑 زعيم ${land.name}`:mode==='tutorial'?'🎓 الدرس الأول':`${land.name} · ×${D(T0)}`);
  $('#view').innerHTML=`<div class="battle" style="--lc:${land.col}">
    <div class="bhud"><span class="hearts" id="bh"></span><span class="bw" id="bw"></span>
      <button class="pow" id="bp" aria-label="قوة التنين">${comp?dragonSVG(comp,Math.max(1,dragonStage(comp))):'<span class="pz-ico">✨</span>'}<b id="bpc"></b></button>
      <button class="pz" id="bz" aria-label="استراحة">⏸</button></div>
    <div class="coach" id="coach"></div>
    <div class="stage" id="stage"><canvas id="bc"></canvas><div class="bhero" id="bhero">${heroSVG(World.p.hero,{face:'smile',pet:false})}</div><div class="banner" id="banner" hidden></div></div>
    <div class="spell" id="spell"><span class="sq" id="sq"></span><span class="sv empty" id="sv">؟</span></div>
    <div id="kpw">${keypadHTML('🔥')}</div></div>`;
  const cv=$('#bc'),ctx=cv.getContext('2d'),stage=$('#stage');
  let W=360,H=360,wallY=300,bg=null;
  let alive=true,paused=false,raf=0,last=performance.now(),now=0;
  let hearts=3,idx=0,wave=null,plan=boss?[]:planFor(mode,T0),cleared=0,perfects=0,fasts=0,gold=0,mistakes=0;
  let power=comp?(comp===T0?3:2):1,proj=null,slowUntil=0,shakeT=0,input='',bossO=null;
  const total=tower?Infinity:boss?1:plan.length;
  onClean(()=>{alive=false;cancelAnimationFrame(raf);document.removeEventListener('visibilitychange',vis);removeEventListener('resize',size);});

  /* المقاسات والخلفية */
  function size(){W=stage.clientWidth||360;const top=stage.getBoundingClientRect().top+window.scrollY;const below=$('#spell').offsetHeight+$('#kpw').offsetHeight+18;
    H=clamp(Math.floor(innerHeight-top-below),230,560);const d=Math.min(2,window.devicePixelRatio||1);cv.width=W*d;cv.height=H*d;cv.style.height=H+'px';stage.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);wallY=H-46;bg=null;if(wave)layout(wave);}
  function makeBG(){const c=document.createElement('canvas'),d=Math.min(2,window.devicePixelRatio||1);c.width=W*d;c.height=H*d;const x=c.getContext('2d');x.scale(d,d);
    const L=tower?{sky:['#2d2a5a','#6b5fb0'],hill:'#25224d',grass:'#3c3873'}:land;
    const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,L.sky[0]);g.addColorStop(1,L.sky[1]);x.fillStyle=g;x.fillRect(0,0,W,H);
    x.fillStyle='rgba(255,255,255,.55)';[[.15,.12,26],[.8,.2,20],[.55,.08,16]].forEach(([a,b,r])=>{x.beginPath();x.arc(W*a,H*b,r,0,7);x.arc(W*a+r,H*b+4,r*.8,0,7);x.arc(W*a-r,H*b+5,r*.7,0,7);x.fill();});
    x.fillStyle=L.hill;x.beginPath();x.moveTo(0,H*.72);for(let i=0;i<=6;i++)x.quadraticCurveTo(W*(i+.5)/6,H*(i%2?.6:.66),W*(i+1)/6,H*.72);x.lineTo(W,H);x.lineTo(0,H);x.fill();
    x.fillStyle=L.grass;x.fillRect(0,H*.78,W,H);
    /* السور */
    x.fillStyle='#8c8fa3';x.fillRect(0,wallY,W,H-wallY);x.fillStyle='#a3a6ba';for(let i=0;i<W;i+=34)x.fillRect(i+2,wallY-12,22,14);
    x.strokeStyle='#6b6e84';x.lineWidth=2;for(let yy=wallY+12;yy<H;yy+=14){x.beginPath();x.moveTo(0,yy);x.lineTo(W,yy);x.stroke();for(let xx=((yy/14)%2)*17;xx<W;xx+=34){x.beginPath();x.moveTo(xx,yy-14);x.lineTo(xx,yy);x.stroke();}}
    x.strokeStyle=INK;x.lineWidth=3;x.beginPath();x.moveTo(0,wallY);x.lineTo(W,wallY);x.stroke();
    [[18,'#e5484d'],[W-18,land.col]].forEach(([fx,fc])=>{x.strokeStyle=INK;x.lineWidth=3;x.beginPath();x.moveTo(fx,wallY-12);x.lineTo(fx,wallY-44);x.stroke();x.fillStyle=fc;x.beginPath();x.moveTo(fx,wallY-44);x.lineTo(fx+(fx<W/2?20:-20),wallY-37);x.lineTo(fx,wallY-30);x.fill();x.stroke();});
    bg=c;}

  /* تجهيز الموجة */
  function layout(w){
    if(w.type==='train'){w.r=Math.min(27,W/11.5);w.gap=Math.min((W-40)/5,w.r*2.6);w.x0=(W-w.gap*4)/2;w.fh=w.r*2;return;}
    const maxW=W-62,maxH=(wallY-64)*.66;w.s=Math.max(14,Math.min(44,maxW/w.C,maxH/w.R));w.fw=w.s*w.C;w.fh=w.s*w.R;w.x0=(W-w.fw)/2+10;}
  function startWave(){
    if(tower){const i=idx,t=pick(tabs),k=rint(2,12);wave=i%7===6?mkTrain(t):i%5===4?mkFog(t,rint(3,10)):i%6===5?mkGrid(t,rint(3,12),{gold:1}):mkGrid(t,k);}
    else wave=plan[idx];
    const w=wave;const L=tower?LANDS[LAND_OF[w.t]]:land;w.mon=L.mon;w.col=w.type==='gold'?'#fbbf24':L.col;
    w.tries=0;w.busy=false;w.wrongRec=false;w.flash=null;w.split=null;w.born=now;w.cleared=false;
    if(w.type!=='train'){w.m=[...Array(w.R*w.C)].map(()=>({pop:0,at:0,dead:false}));}else w.m=[0,1,2,3,4].map(()=>({pop:0,at:0,dead:false}));
    layout(w);w.y=-w.fh-50;w.enterTo=w.type==='train'?40:36;
    let Tm=mode==='tutorial'?34:mode==='b1'?22:mode==='b2'?18:mode==='practice'?22:Math.max(9,19-idx*.35);
    if(w.type!=='train')Tm+=Math.min(7,w.R*w.C/18);if(w.type==='fog'||w.type==='train')Tm+=4;if(hearts<3&&!tower)Tm*=1.12;
    w.T=Tm;w.goldLeft=w.type==='gold'?6+Math.min(5,w.R*w.C/20):0;
    $('#sq').textContent=w.type==='fog'?'كم عموداً في الضباب؟':w.type==='train'?'ما العدد المختبئ؟':'كم وحشاً؟';
    kp.reset();kp.lock(false);
    $('#bw').textContent=tower?`الموجة ${D(idx+1)}`:`${D(idx+1)} / ${D(total)}`;
    coachOff();
    if(w.tut!=null){const tt=[`صف واحد فيه ${D(3)} وحوش. اكتب <b>${D(3)}</b> ثم اضغط 🔥`,`صف واحد × ${D(5)} وحوش = ؟`,`صفّان، وفي كل صف ${D(3)}. <b>${D(2)} × ${D(3)}</b> = ؟`,`صفّان × ${D(5)} = ؟ (${D(5)} + ${D(5)})`,`الآن وحدك! ${D(3)} صفوف × ${D(2)} أعمدة 💪`][w.tut];coach(tt,w.tut===0?'k3':null);}
    else if(w.type==='fog')coach(`☁️ الضباب يخفي الأعمدة! المجموع <b>${D(w.R*w.C)}</b> وعدد الصفوف <b>${D(w.R)}</b>. كم عموداً؟`);
    else if(w.type==='train')coach(`🚂 قطار الوحوش يقفز <b>${D(w.t)}</b> في كل مرة. ما العدد المختبئ؟`);
    else if(w.type==='gold')coach(`🌟 جيش ذهبي! اهزمه بسرعة لتربح ${D(3)} جواهر!`);
    else if(idx===0&&!boss)coach(`👾 ${D(w.R)} ${w.R===1?'صف':w.R===2?'صفّان':'صفوف'} و${D(w.C)} ${w.C===1?'عمود':w.C===2?'عمودان':'أعمدة'}. اضرب لتعرف عددهم!`,null,3500);
    banner(tower?`الموجة ${D(idx+1)}`:w.type==='gold'?'🌟 جيش ذهبي':`الموجة ${D(idx+1)}`);
  }
  const answerOf=w=>w.type==='fog'?w.C:w.type==='train'?w.t*w.k:w.R*w.C;
  function setInput(v){input=v;const sv=$('#sv');sv.textContent=v===''?'؟':D(v);sv.classList.toggle('empty',v==='');}
  let coachT=0;
  const coachDef=()=>boss?'💥 اكتب ناتج الضرب لتضرب الزعيم!':!wave?'':wave.type==='fog'?'☁️ كم عموداً يختبئ في الضباب؟':wave.type==='train'?`🐛 كل قفزة +${D(wave.t)}. ما العدد المختبئ؟`:'👾 عُدّ الصفوف والأعمدة، واكتب عدد الوحوش ثم اضغط 🔥';
  function coach(html,key,ms){const c=$('#coach');c.classList.remove('idle');c.innerHTML=`${comp?`<span class="cdr">${dragonSVG(comp,Math.max(1,dragonStage(comp)))}</span>`:'<span class="cdr">🧙</span>'}<span>${html}</span>`;c.hidden=false;
    $$('.k.hint').forEach(k=>k.classList.remove('hint'));if(key){const k=$(`.k[data-k="${key.slice(1)}"]`);if(k)k.classList.add('hint');$('.k.go').classList.add('hint');}
    clearTimeout(coachT);if(ms)coachT=setTimeout(coachOff,ms);}
  function coachOff(){const c=$('#coach');if(!c)return;c.classList.add('idle');c.innerHTML=`<span class="cdr">${comp?dragonSVG(comp,Math.max(1,dragonStage(comp))):'🧙'}</span><span>${coachDef()}</span>`;$$('.k.hint').forEach(k=>k.classList.remove('hint'));}
  function banner(t){const b=$('#banner');b.textContent=t;b.hidden=false;b.classList.remove('in');void b.offsetWidth;b.classList.add('in');setTimeout(()=>{if(alive)b.hidden=true;},1100);}
  function bhud(){$('#bh').innerHTML=[0,1,2].map(i=>i<hearts?'❤️':'🖤').join('');$('#bpc').textContent=D(power);$('#bp').disabled=power<=0;}

  /* الإدخال */
  const kp=bindKeypad($('#kpw'),{onChange:v=>setInput(v),onSubmit:v=>submit(v)});
  function submit(v){
    if(boss)return bossAnswer(v);
    const w=wave;if(!w||w.busy||w.cleared)return;const ans=answerOf(w);
    if(v===ans)return success(w);
    w.tries++;mistakes++;buzz(60);shake($('#spell'));
    if(!w.wrongRec){w.wrongRec=true;recW(w,false);}
    const N=w.R*w.C;
    if(w.type==='grid'||w.type==='gold'){w.flash={kind:v<N?'low':'high',v,until:now+1.8};
      coach(v<N?`✋ ${D(v)} لا يكفي! ينقص <b>${D(N-v)}</b> وحشاً.`:`💨 ${D(v)} كثير! السحر الزائد تبدّد. زيادة <b>${D(v-N)}</b>.`,null,2600);}
    else if(w.type==='fog')coach(`☁️ ${D(w.R)} × ${D(v)} = ${D(w.R*v)}، وليس ${D(N)}. جرّب عدداً ${w.R*v<N?'أكبر':'أصغر'}!`,null,3200);
    else coach(`🐛 ليس ${D(v)}. أضف ${D(w.t)} إلى ${D(w.t*(w.k-1))}.`,null,3200);
    w.born-=0;w.T*=.93;
    if(w.tries>=2)applyHint(w,true);
    if(w.tries>=3)coach(`💡 الجواب: ${w.type==='fog'?`${D(w.R)} × <b>${D(w.C)}</b> = ${D(N)}`:w.type==='train'?`<b>${D(ans)}</b>`:`${D(w.R)} × ${D(w.C)} = <b>${D(N)}</b>`}. اكتبه الآن!`);
    kp.reset();
  }
  function recW(w,ok){if(w.type==='train')record(w.t,w.k,ok);else record(w.R,w.C,ok);}
  function success(w){
    w.busy=true;kp.lock(true);const fast=(now-w.born)<5.5;const perfect=w.tries===0;
    if(perfect){recW(w,true);perfects++;}if(fast&&perfect)fasts++;
    const [hx,hy]=[W/2,wallY-8];const tx=w.type==='train'?W/2:w.x0+w.fw/2,ty=w.y+w.fh/2;
    proj={x:hx,y:hy,sx:hx,sy:hy,tx,ty,t:0,dur:.28,col:w.type==='gold'?'#fde047':'#ff9f43'};
    $('#bhero').innerHTML=heroSVG(World.p.hero,{face:'happy',pose:'cast',pet:false});
    coachOff();
    setTimeout(()=>{if(!alive)return;const nn=w.m.length,step=Math.min(32,900/nn);w.m.forEach((m,i)=>m.at=now+i*step/1000);w.cleared=true;
      const r=cv.getBoundingClientRect();FX.text(r.left+tx,r.top+ty,w.type==='train'?D(answerOf(w)):w.type==='fog'?`${D(w.R)} × ${D(w.C)} = ${D(w.R*w.C)}`:`+${D(w.R*w.C)}`,'#fff7c2',30);
      if(perfect){FX.text(r.left+tx,r.top+ty-36,pick(['💥 ممتاز!','💥 بالضبط!','🔥 رائع!','⭐ دقيق!']),'#ffe27a',24);}
      if(fast&&perfect)setTimeout(()=>FX.text(r.left+tx,r.top+ty-70,'⚡ سريع!','#8fe3ff',22),250);
      if(w.type==='gold'&&w.goldLeft>0){gold+=3;setTimeout(()=>FX.text(r.left+tx,r.top+ty+30,`💎 +${D(3)}`,'#c4f1ff',26),350);}
      setTimeout(()=>{if(!alive)return;$('#bhero').innerHTML=heroSVG(World.p.hero,{face:'smile',pet:false});cleared++;nextWave();},Math.min(1600,nn*step+650));},280);
  }
  function nextWave(){idx++;kp.lock(false);if(!tower&&idx>=plan.length)return victory();startWave();}
  function applyHint(w,auto){
    if(w.type==='grid'||w.type==='gold'){const L=w.R>=w.C?'R':'C',len=w[L];if(len>=4){const a=len>5?5:2;w.split={dim:L,at:a};
        const other=L==='R'?w.C:w.R,p1=a*other,p2=(len-a)*other;coach(`🐉 قسّم الجيش: ${D(a)}×${D(other)} = ${D(p1)}، و${D(len-a)}×${D(other)} = ${D(p2)}. الآن ${D(p1)} + ${D(p2)} = ؟`);}
      else coach(`🐉 ${D(hintFor(w.R,w.C))}`);}
    else if(w.type==='fog')coach(`🐉 فكّر في جدول ${D(w.R)}: ${D(w.R)} × ؟ = ${D(w.R*w.C)}`);
    else coach(`🐉 كل قفزة = ${D(w.t)}. العدد قبله ${D(w.t*(w.k-1))}، فأضف ${D(w.t)}.`);
    if(!auto){slowUntil=now+4;}
  }
  $('#bp').onclick=()=>{if(power<=0||!alive)return;power--;bhud();if(boss){if(bossO){coach(`🐉 ${D(hintFor(bossO.a,bossO.b))}`);bossO.charge=Math.max(0,bossO.charge-.35);}}else if(wave&&!wave.cleared)applyHint(wave,false);
    const[x,y]=centerOf($('#bp'));FX.burst(x,y,{n:14,colors:['#c4b5fd','#fde68a']});};
  $('#bz').onclick=()=>pause();
  function vis(){if(document.hidden&&alive&&!paused)pause();}
  document.addEventListener('visibilitychange',vis);
  function pause(){if(paused)return;paused=true;const ov=document.createElement('div');ov.className='ov';
    ov.innerHTML=`<div class="res"><h2>⏸ استراحة</h2><p class="muted">الوحوش تنتظرك…</p><div class="btns"><button class="btn gold big" id="pc">▶ أكمل</button><button class="btn ghost" id="pq">🗺️ الخريطة</button></div></div>`;
    document.body.appendChild(ov);$('#pc',ov).onclick=()=>{ov.remove();paused=false;last=performance.now();};$('#pq',ov).onclick=()=>{ov.remove();home();};}

  /* الزعيم */
  function bossStart(){const ks=bagK(T0,[4,5,6,7,8,9,10,11,12],8);const hp=ks.slice(0,6).reduce((s,k)=>s+T0*k,0);
    bossO={ks,i:0,hp,max:hp,charge:0,rate:1/(12+T0*.4),hit:0,angry:false,size:Math.min(W*.42,170),y:0,tries:0,wrongRec:false,born:now};bossRune();
    banner('👑 الزعيم!');coach(`👑 زعيم ${land.name} يهاجم! كل ضربة صحيحة تؤذيه بقدر الناتج، فالأعداد الكبيرة أقوى! 💥`,null,4200);}
  function bossRune(){const b=bossO;const k=b.ks[b.i%b.ks.length];b.a=Math.random()<.5?T0:k;b.b=b.a===T0?k:T0;b.tries=0;b.wrongRec=false;b.born=now;
    $('#sq').innerHTML=`${D(b.a)} × ${D(b.b)} =`;kp.reset();}
  function bossAnswer(v){const b=bossO;if(!b||b.busy)return;const p=b.a*b.b;
    if(v===p){b.busy=true;kp.lock(true);if(!b.tries){record(b.a,b.b,true);perfects++;}const tx=W/2,ty=b.y;proj={x:W/2,y:wallY-8,sx:W/2,sy:wallY-8,tx,ty,t:0,dur:.3,col:'#ff9f43'};
      $('#bhero').innerHTML=heroSVG(World.p.hero,{face:'happy',pose:'cast',pet:false});
      setTimeout(()=>{if(!alive)return;b.hp=Math.max(0,b.hp-p);b.hit=.5;const r=cv.getBoundingClientRect();FX.text(r.left+tx,r.top+ty,`−${D(p)}`,'#fff7c2',38);FX.burst(r.left+tx,r.top+ty,{n:26,speed:300});buzz(40);
        b.charge=Math.max(0,b.charge-.5);$('#bhero').innerHTML=heroSVG(World.p.hero,{face:'smile',pet:false});
        if(b.hp<=0){setTimeout(()=>{const r2=cv.getBoundingClientRect();FX.burst(r2.left+W/2,r2.top+b.y,{n:80,speed:460});FX.confetti();b.dead=true;setTimeout(()=>victory(),1100);},300);return;}
        if(!b.angry&&b.hp<b.max/2){b.angry=true;b.rate*=1.18;coach('😠 الزعيم غضب! أسرع!',null,1800);}
        b.i++;b.busy=false;kp.lock(false);bossRune();},300);return;}
    b.tries++;mistakes++;buzz(60);shake($('#spell'));b.charge=Math.min(.98,b.charge+.22);if(!b.wrongRec){b.wrongRec=true;record(b.a,b.b,false);}
    coach(b.tries>=3?`💡 ${D(b.a)} × ${D(b.b)} = <b>${D(p)}</b>. اكتبه!`:b.tries>=2?`🐉 ${D(hintFor(b.a,b.b))}`:`😆 الزعيم يضحك! ${D(v)} ليس صحيحاً.`,null,3500);kp.reset();}
  function bossAttack(){const b=bossO;b.charge=0;hearts--;bhud();shakeT=.45;buzz(120);const r=cv.getBoundingClientRect();FX.burst(r.left+W/2,r.top+wallY,{n:30,colors:['#ff6b6b','#ffb86b','#fff']});
    if(!b.wrongRec){record(b.a,b.b,false);}coach(`💥 الزعيم ضرب القلعة! ${D(b.a)} × ${D(b.b)} = ${D(b.a*b.b)}`,null,2600);if(hearts<=0)return defeat();b.i++;bossRune();}

  /* الحلقة */
  function update(dt){
    if(proj){proj.t+=dt/proj.dur;if(proj.t>=1)proj=null;else{proj.x=proj.sx+(proj.tx-proj.sx)*proj.t;proj.y=proj.sy+(proj.ty-proj.sy)*proj.t-Math.sin(proj.t*Math.PI)*40;}}
    if(shakeT>0)shakeT-=dt;
    if(boss){const b=bossO;if(!b)return;b.y=H*.34+Math.sin(now*1.6)*6;if(b.hit>0)b.hit-=dt;if(!b.busy&&!b.dead){b.charge+=dt*b.rate*(now<slowUntil?.4:1);if(b.charge>=1)bossAttack();}return;}
    const w=wave;if(!w)return;
    if(w.cleared){w.m.forEach((m,i)=>{if(!m.dead&&now>=m.at){if(!m.boom){m.boom=1;const p=posOf(w,i),r=cv.getBoundingClientRect();FX.burst(r.left+p[0],r.top+p[1],{n:w.m.length>60?3:6,speed:170,colors:[w.col,'#fff','#ffe27a']});}m.pop+=dt*4.5;if(m.pop>=1)m.dead=true;}});return;}
    const sp=now<slowUntil?.35:1;
    if(w.y<w.enterTo){w.y=Math.min(w.enterTo,w.y+dt*Math.max(260,(w.enterTo-w.y)*4));return;}
    if(w.type==='gold'){w.goldLeft-=dt;if(w.goldLeft<=0&&!w.fled){w.fled=true;coach('🌟 هرب الجيش الذهبي! لا بأس.',null,2000);w.cleared=true;w.m.forEach(m=>{m.dead=true;});setTimeout(()=>{if(alive)nextWave();},900);return;}}
    const dist=(wallY-8)-(w.enterTo+w.fh);w.y+=dt*sp*Math.max(4,dist)/w.T;
    if(w.y+w.fh>=wallY-8)wallHit(w);
  }
  function wallHit(w){if(w.cleared)return;w.cleared=true;w.m.forEach(m=>m.dead=true);
    const r=cv.getBoundingClientRect();FX.burst(r.left+W/2,r.top+wallY,{n:34,colors:['#ff6b6b','#ffb86b','#ffffff',w.col]});
    if(!w.wrongRec)recW(w,false);
    const N=w.R*w.C,ans=answerOf(w);
    if(mode==='tutorial'){coach(`💡 كانوا ${D(N)}: ${D(w.R)} × ${D(w.C)} = ${D(N)}. لنجرّب مرة أخرى!`,null,2600);setTimeout(()=>{if(!alive)return;startWave();},1400);return;}
    hearts--;bhud();shakeT=.45;buzz(140);
    coach(`💥 الجيش وصل إلى السور! ${w.type==='train'?`العدد كان ${D(ans)}`:w.type==='fog'?`${D(w.R)} × ${D(w.C)} = ${D(N)}`:`${D(w.R)} × ${D(w.C)} = ${D(N)}`}`,null,2600);
    if(hearts<=0){setTimeout(()=>{if(alive)defeat();},700);return;}
    setTimeout(()=>{if(alive)nextWave();},1300);}
  function posOf(w,i){if(w.type==='train')return[w.x0+i*w.gap,w.y+w.r];const r=Math.floor(i/w.C),c=i%w.C;return[w.x0+c*w.s+w.s/2,w.y+r*w.s+w.s/2];}

  function draw(){
    if(!bg)makeBG();ctx.save();if(shakeT>0)ctx.translate((Math.random()-.5)*10,(Math.random()-.5)*8);
    ctx.drawImage(bg,0,0,W,H);
    if(boss)drawBoss();else if(wave){if(wave.type==='train')drawTrain(wave);else drawGrid(wave);}
    if(proj){ctx.save();ctx.shadowColor=proj.col;ctx.shadowBlur=18;ctx.fillStyle=proj.col;ctx.beginPath();ctx.arc(proj.x,proj.y,9,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(proj.x,proj.y,4,0,7);ctx.fill();ctx.restore();}
    ctx.restore();}
  function pill(txt,x,y,bgc='#fff',fg=INK,fs=15){ctx.font=`800 ${fs}px Lalezar, "Baloo Bhaijaan 2", sans-serif`;ctx.direction='rtl';const w=ctx.measureText(txt).width+16;ctx.fillStyle=bgc;ctx.strokeStyle=INK;ctx.lineWidth=2;
    ctx.beginPath();ctx.roundRect(x-w/2,y-fs*.75,w,fs*1.5,fs*.7);ctx.fill();ctx.stroke();ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,x,y+1);}
  function drawGrid(w){
    const N=w.R*w.C,spr=monSprite(w.mon,w.col,w.s),sw=w.s*1.2,fl=w.flash&&now<w.flash.until?w.flash:null,blink=Math.sin(now*14)>0;
    for(let i=0;i<N;i++){const m=w.m[i];if(m.dead)continue;const r=Math.floor(i/w.C),c=i%w.C;if(w.type==='fog'&&c>0&&!w.cleared)continue;
      let x=w.x0+c*w.s+w.s/2,y=w.y+r*w.s+w.s/2+(w.cleared?0:Math.sin(now*4+c*.7+r*1.3)*w.s*.05);
      if(fl){ctx.fillStyle=fl.kind==='low'&&i>=fl.v?(blink?'rgba(255,80,80,.55)':'rgba(255,80,80,.15)'):'rgba(255,230,90,.45)';ctx.beginPath();ctx.arc(x,y,w.s*.48,0,7);ctx.fill();}
      const sc=1+m.pop*.7;ctx.globalAlpha=1-m.pop;ctx.drawImage(spr,x-sw*sc/2,y-sw*sc/2,sw*sc,sw*sc);ctx.globalAlpha=1;}
    if(fl&&fl.kind==='high'){ctx.globalAlpha=.35+(blink?.15:0);for(let i=N;i<Math.min(fl.v,N+w.C*3);i++){const r=Math.floor(i/w.C),c=i%w.C;const x=w.x0+c*w.s+w.s/2,y=w.y+r*w.s+w.s/2;ctx.drawImage(spr,x-sw/2,y-sw/2,sw,sw);}ctx.globalAlpha=1;}
    if(w.type==='fog'&&!w.cleared){const fx=w.x0+w.s,fw=w.fw-w.s,pr=w.s*.62;ctx.fillStyle='rgba(245,247,255,.97)';for(let yy=w.y-6;yy<w.y+w.fh+6;yy+=w.s*.7)for(let xx=fx+pr;xx<fx+fw+4;xx+=w.s*.7){ctx.beginPath();ctx.arc(xx+((yy/7)%2)*4,yy+w.s*.35,pr,0,7);ctx.fill();}
      ctx.font=`900 ${Math.min(48,w.fh*.5)}px Lalezar, sans-serif`;ctx.fillStyle='#8aa0c8';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('؟',fx+fw/2,w.y+w.fh/2);}
    if(!w.cleared){
      if(w.type==='fog')pill(`المجموع ${D(N)}`,w.x0+w.fw/2,w.y-15,'#fff7c2');else pill(`↔ ${D(w.C)}`,w.x0+w.fw/2,w.y-15);
      pill(`↕ ${D(w.R)}`,w.x0-20,w.y+w.fh/2);
      if(w.split){ctx.save();ctx.setLineDash([7,6]);ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();
        if(w.split.dim==='R'){const yy=w.y+w.split.at*w.s;ctx.moveTo(w.x0-6,yy);ctx.lineTo(w.x0+w.fw+6,yy);}else{const xx=w.x0+w.split.at*w.s;ctx.moveTo(xx,w.y-6);ctx.lineTo(xx,w.y+w.fh+6);}ctx.stroke();ctx.restore();
        const o=w.split.dim==='R'?w.C:w.R,a=w.split.at,b=w[w.split.dim]-a;
        if(w.split.dim==='R'){pill(`${D(a)}×${D(o)}=${D(a*o)}`,w.x0+w.fw+4,w.y+a*w.s/2,'#ffe27a',INK,13);pill(`${D(b)}×${D(o)}=${D(b*o)}`,w.x0+w.fw+4,w.y+a*w.s+b*w.s/2,'#ffe27a',INK,13);}
        else{pill(`${D(a*o)}`,w.x0+a*w.s/2,w.y+w.fh+14,'#ffe27a',INK,13);pill(`${D(b*o)}`,w.x0+a*w.s+b*w.s/2,w.y+w.fh+14,'#ffe27a',INK,13);}}
      if(fl)pill(fl.kind==='low'?`ينقص ${D(N-fl.v)}`:`زيادة ${D(fl.v-N)}`,w.x0+w.fw/2,w.y+w.fh/2,fl.kind==='low'?'#ff8080':'#c7d2fe',INK,18);
      if(w.type==='gold'){const f=Math.max(0,w.goldLeft/(6+Math.min(5,w.R*w.C/20)));ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(w.x0,w.y-34,w.fw,6);ctx.fillStyle='#fde047';ctx.fillRect(w.x0,w.y-34,w.fw*f,6);
        for(let k=0;k<3;k++){const a=now*2+k*2.1;ctx.fillStyle='#fff';ctx.font='14px sans-serif';ctx.fillText('✨',w.x0+w.fw/2+Math.cos(a)*w.fw*.55,w.y+w.fh/2+Math.sin(a)*w.fh*.6);}}}
  }
  function drawTrain(w){const spr=monSprite(w.mon,w.col,w.r*1.6);
    for(let i=0;i<5;i++){const m=w.m[i];if(m.dead)continue;const x=w.x0+i*w.gap,y=w.y+w.r+Math.sin(now*5+i)*4;const sc=1+m.pop*.7;ctx.globalAlpha=1-m.pop;
      if(i<4){ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w.gap,y);ctx.stroke();}
      ctx.drawImage(spr,x-w.r*1.6*.6*sc,y-w.r*1.6*.6*sc-w.r*.9,w.r*1.92*sc,w.r*1.92*sc);
      const v=w.t*(w.s+i),miss=i===w.idx&&!w.cleared;pill(miss?'؟':D(v),x,y+w.r*.6,miss?'#ffe27a':'#fff',INK,17);ctx.globalAlpha=1;}
    if(!w.cleared)pill(`كل قفزة +${D(w.t)}`,W/2,w.y-12,'#fff7c2');}
  function drawBoss(){const b=bossO;if(!b||b.dead)return;const s=b.size,spr=monSprite(land.mon,b.angry?'#ff7b7b':land.col,s);
    ctx.save();if(b.hit>0){ctx.translate((Math.random()-.5)*12,0);}const sw=s*1.2;ctx.drawImage(spr,W/2-sw/2,b.y-sw/2,sw,sw);
    if(b.hit>0){ctx.globalAlpha=b.hit;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(W/2,b.y,s*.45,0,7);ctx.fill();ctx.globalAlpha=1;}
    ctx.font=`${s*.32}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('👑',W/2,b.y-s*.56);ctx.restore();
    const bw=Math.min(W-40,260),bx=(W-bw)/2,by=14;ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.roundRect(bx,by,bw,16,8);ctx.fill();
    ctx.fillStyle='#ef4444';ctx.beginPath();ctx.roundRect(bx,by,bw*(b.hp/b.max),16,8);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(bx,by,bw,16,8);ctx.stroke();
    pill(`❤ ${D(b.hp)}`,W/2,by+8,'rgba(255,255,255,.9)',INK,12);
    const cy=b.y+s*.62;ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(bx+30,cy,bw-60,8);ctx.fillStyle=b.charge>.75?'#f97316':'#facc15';ctx.fillRect(bx+30,cy,(bw-60)*Math.min(1,b.charge),8);
    pill('⚡ هجوم الزعيم',W/2,cy+18,'#fff',INK,11);
    pill(`${D(b.a)} × ${D(b.b)}`,W/2,b.y+s*.18,'#fff7c2',INK,Math.max(16,s*.13));}

  function loop(t){if(!alive)return;const dt=Math.min(.05,(t-last)/1000);last=t;if(!paused){now+=dt;update(dt);}draw();raf=requestAnimationFrame(loop);}

  /* النهاية */
  function victory(){if(!alive)return;alive=false;cancelAnimationFrame(raf);kp.lock(true);
    const stars=mode==='tutorial'?3:Math.max(1,hearts);const gems=perfects+fasts+gold+stars*4+(boss?15:0);G.plays++;
    let first=false;if(node){first=!G.stars[node.id];G.stars[node.id]=Math.max(G.stars[node.id]||0,stars);}gsave();
    const nextI=node?NODE_I[node.id]+1:-1;const hasNext=nextI>0&&nextI<NODES.length;
    const show=()=>resultOv({title:boss?'👑 هزمت الزعيم!':mode==='tutorial'?'🎓 أنت حارس حقيقي!':'🏰 حميت القلعة!',stars:mode==='practice'?null:stars,gems,
      lines:[`💥 ضربات دقيقة: ${D(perfects)}`,fasts?`⚡ ضربات سريعة: ${D(fasts)}`:'',mistakes?`محاولات خاطئة: ${D(mistakes)}`:'بدون أي خطأ! 👑',mode!=='practice'&&stars<3?'احمِ كل القلوب لتحصل على ٣ نجوم':''],
      chest:boss||Math.random()<.3?{min:10,max:30,itemChance:boss?.6:.3}:null,
      btns:[...(hasNext?[{label:'التالي ⚔️',cls:'gold big',fn:()=>go('battle',{node:nextI},false)}]:[]),{label:'🔁 مرة أخرى',cls:'ghost',fn:()=>rerender()},{label:'🗺️ الخريطة',cls:'ghost',fn:()=>home()}]});
    if((boss||mode==='tutorial')&&!G.eggs[T0])setTimeout(()=>hatchOv(T0,show),500);else setTimeout(show,400);}
  function defeat(){if(!alive)return;alive=false;cancelAnimationFrame(raf);kp.lock(true);
    if(tower){const best=G.best||0;if(cleared>best){G.best=cleared;}gsave();
      return resultOv({title:'🗼 انتهى الصمود!',big:`${D(cleared)} موجة`,gems:perfects+Math.floor(cleared/2),mood:'smile',lines:[cleared>best?'🏆 رقم قياسي جديد!':`أطول صمود: ${D(best)} موجة`],btns:[{label:'🔁 مرة أخرى',cls:'gold big',fn:()=>rerender()},{label:'🗺️ الخريطة',cls:'ghost',fn:()=>home()}]});}
    resultOv({title:'الوحوش دخلت القلعة! 😮',stars:0,mood:'sad',gems:perfects,lines:['لا بأس، كل بطل يتدرّب!','💡 استخدم قوة التنين حين تحتاج مساعدة'],
      btns:[{label:'🔁 حاول مرة أخرى',cls:'gold big',fn:()=>rerender()},{label:'🐉 تعلّم الجدول',cls:'ghost',fn:()=>go('learn',T0||2)},{label:'🗺️ الخريطة',cls:'ghost',fn:()=>home()}]});}

  size();addEventListener('resize',size);bhud();
  if(boss)bossStart();else startWave();
  raf=requestAnimationFrame(t=>{last=t;loop(t);});
},{full:true});
