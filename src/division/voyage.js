/* ===== الرحلة: قسمة الكنز، البراميل، الببغاء، الخرائط، والزعماء ===== */
const weak=(d,q)=>[1.3,2,1,.2][mastery(d,q)];
function bagQ(d,list,count){const out=[];let pool=[];while(out.length<count){if(!pool.length)pool=shuffle(list.slice()).sort((a,b)=>weak(d,b)-weak(d,a)+(Math.random()-.5)*1.6);out.push(pool.shift());}return out;}
const LOOTS=['coin','gem','pearl'];
const mkShare=(d,q,loot)=>({type:'share',d,q,N:d*q,loot:loot||pick(LOOTS)});
const mkPack=(d,q,item)=>({type:'pack',d,q,N:d*q,item:item||pick(['fish','fish','banana','ball'])});
const mkParrot=(d,q,r)=>{r=r||rint(1,Math.max(1,d-1));return{type:'parrot',d,q,rem:r,N:d*q+r,loot:pick(LOOTS)};};
const mkMap=(d,q)=>({type:'map',d,q,N:d*q,rev:Math.random()<.35});
const mkGold=(d,q)=>({type:'gold',d,q,N:d*q});
const mkBottle=(d,q)=>({type:'bottle',d,q,N:d*q,tpl:rint(0,BOTTLES.length-1)});
const BOTTLES=[
  (N,d)=>`وجد القبطان كنزاً فيه ${N} من قطع الذهب، وقسمه بالعدل على ${d} من القراصنة. كم قطعة يأخذ كل قرصان؟`,
  (N,d)=>`في مخزن السفينة ${N} من الموز، والقرد يأكل ${d} كل يوم. كم يوماً يكفي الموز؟`,
  (N,d)=>`اصطاد الطاقم ${N} من الأسماك، ووضعها في سلال، في كل سلة ${d}. كم سلة امتلأت؟`,
  (N,d)=>`${N} من القراصنة يريدون الذهاب إلى الجزيرة، وكل قارب يحمل ${d}. كم قارباً نحتاج؟`,
  (N,d)=>`عند الببغاء ${N} من الحبوب، ويأكل ${d} كل ساعة. بعد كم ساعة تنتهي الحبوب؟`,
  (N,d)=>`عند الطاهي ${N} من البيض، ويطبخ ${d} في كل وجبة. كم وجبة يطبخ؟`,
  (N,d)=>`في الصندوق ${N} من الخرائط، وكل قرصان يأخذ ${d}. كم قرصاناً أخذ خرائط؟`
];
function planFor(mode,d){
  if(mode==='tutorial')return[Object.assign(mkShare(2,3,'coin'),{tut:0}),Object.assign(mkShare(2,4,'coin'),{tut:1}),Object.assign(mkShare(3,4,'gem'),{tut:2}),
    Object.assign(mkShare(1,5,'pearl'),{tut:3}),Object.assign(mkPack(2,5,'fish'),{tut:4}),Object.assign(mkParrot(2,3,1),{tut:5,loot:'coin'})];
  if(mode==='b1'){const qs=bagQ(d,[1,2,3,4,5,6,7],6);const p=[mkShare(d,qs[0]),mkShare(d,qs[1]),mkPack(d,qs[2]),mkShare(d,qs[3]),mkMap(d,qs[4]),mkPack(d,qs[5])];p.splice(rint(2,5),0,mkGold(d,rint(2,8)));return p;}
  if(mode==='b2'){const qs=bagQ(d,[4,5,6,7,8,9,10,11,12],5);const p=[mkShare(d,qs[0]),mkParrot(d,rint(2,8)),mkMap(d,qs[1]),mkPack(d,qs[2]),mkParrot(d,rint(4,11)),mkBottle(d,qs[3])];p.splice(rint(2,5),0,mkGold(d,qs[4]));return p;}
  if(mode==='practice'){const qs=bagQ(d,[1,2,3,4,5,6,7,8,9,10,11,12],6);const p=[mkShare(d,qs[0]),mkPack(d,qs[1]),mkMap(d,qs[2]),mkShare(d,qs[3]),mkBottle(d,qs[4]),mkGold(d,qs[5])];if(d>1)p.splice(3,0,mkParrot(d,rint(2,10)));return p;}
  return[];
}
function stormRound(i,divs){const d=pick(divs),q=rint(2,12);const t=i%7===6?'gold':i%5===4?'bottle':pick(['share','share','pack','map','parrot']);
  return t==='share'?mkShare(d,q):t==='pack'?mkPack(d,q):t==='map'?mkMap(d,q):t==='parrot'?mkParrot(d,rint(2,10)):t==='gold'?mkGold(d,q):mkBottle(d,q);}
const HAPPY=['عدل! 👍','شكراً يا كابتن!','يا سلام!','قبطان عادل!','هيييه!'],ANGRY=['ليس عدلاً!','أين حصتي؟','هذا لا يكفي!'],WANT=['ما زال في الصندوق!','الصندوق لم يفرغ!','أعطنا المزيد!'],KOKO=['لي! لي! 🦜','شكراً يا كابتن!','الباقي لذيذ!','كوكو يحب الباقي!'];
function shade(h,a){const n=parseInt(h.slice(1),16),c=v=>clamp(v+a,0,255);return'#'+((1<<24)+(c(n>>16)<<16)+(c((n>>8)&255)<<8)+c(n&255)).toString(16).slice(1);}
const eqText=r=>r.type==='parrot'?`${D(r.N)} ÷ ${D(r.d)} = ${D(r.q)}، والباقي ${D(r.rem)}`:r.type==='map'&&!r.rev?`${D(r.d)} × ${D(r.q)} = ${D(r.N)}`:`${D(r.N)} ÷ ${D(r.d)} = ${D(r.q)}`;

def('voyage',arg=>{
  const node=arg.node!=null?NODES[arg.node]:null;
  const mode=node?node.kind:arg.practice?'practice':'storm';
  const storm=mode==='storm',boss=mode==='boss',tut=mode==='tutorial';
  const isl=node?ISLANDS[node.li]:arg.practice?ISLANDS[ISL_OF[arg.practice]]:Object.assign({},ISLANDS[0],{name:'البحر الهائج',sky:['#3b4a66','#7d8db0'],sea:'#1e4a72',hill:'#3b5f4a',col:'#38bdf8'});
  const D0=node?node.d:arg.practice||0;
  const divs=storm?unlockedDivs().filter(x=>x>1):[D0];if(storm&&!divs.length)divs.push(2);
  const mate=G.mate&&G.crew[G.mate]?G.mate:0;
  setTitle(storm?'🌊 البحر الهائج':boss?`${nodeIcon(node)} ${nodeName(node)}`:tut?'🎓 الدرس الأول':`${isl.name} · ÷${D(D0)}`);
  $('#view').innerHTML=`<div class="voy" style="--lc:${isl.col}">
    <div class="bhud"><span class="hearts" id="vh"></span><span class="bw" id="vw"></span>
      <button class="pow" id="vp" aria-label="مساعدة الطاقم">${mate?mateOf(mate):parrotSVG()}<b id="vpc"></b></button>
      <button class="pz" id="vz" aria-label="استراحة">⏸</button></div>
    <div class="coach" id="coach"></div>
    <div class="stage" id="stage"><canvas id="vc"></canvas><div class="vhero" id="vhero"></div>
      <button class="deal" id="vdeal" hidden>🤲 وزّع بنفسي</button><div class="scroll" id="vscroll" hidden></div><div class="banner" id="banner" hidden></div></div>
    <div class="spell" id="spell"><span class="sq" id="sq"></span><span class="sv empty" id="sv">؟</span></div>
    <div id="kpw">${keypadHTML('✓')}</div></div>`;
  const cv=$('#vc'),ctx=cv.getContext('2d'),stage=$('#stage'),heroEl=$('#vhero');
  let W=360,H=340,bg=null,bgKind='',railY=90,seaTop=40;
  let alive=true,paused=false,raf=0,last=performance.now(),now=0,timers=[];
  let hearts=3,idx=0,R=null,plan=boss?[]:planFor(mode,D0),perfects=0,fasts=0,gold=0,mistakes=0,cleared=0;
  let power=mate?(mate===D0?3:2):1,shakeT=0,bossO=null,proj=[],dolphin=null,patHold=0,heroT=0;
  const koko={fly:null,mood:'idle',bub:null,bubT:0};
  const total=storm?Infinity:boss?1:plan.length;
  const at=(dt,fn)=>timers.push({t:now+dt,fn});
  onClean(()=>{alive=false;cancelAnimationFrame(raf);document.removeEventListener('visibilitychange',vis);removeEventListener('resize',size);});

  /* ---------- المقاسات والخلفية ---------- */
  const sceneOf=r=>boss||(r&&r.type==='gold')?'sea':'deck';
  function size(){W=stage.clientWidth||360;const top=stage.getBoundingClientRect().top+window.scrollY;const below=$('#spell').offsetHeight+$('#kpw').offsetHeight+18;
    H=clamp(Math.floor(innerHeight-top-below),230,560);const d=Math.min(2,window.devicePixelRatio||1);cv.width=W*d;cv.height=H*d;cv.style.height=H+'px';stage.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);bg=null;setScene();if(R)layout(R);placeHero();}
  function setScene(){const k=sceneOf(R);railY=k==='sea'?H*.64:H*.24;seaTop=k==='sea'?H*.3:H*.1;}
  function makeBG(){const kind=sceneOf(R);setScene();const c=document.createElement('canvas'),dp=Math.min(2,window.devicePixelRatio||1);c.width=W*dp;c.height=H*dp;const x=c.getContext('2d');x.scale(dp,dp);
    const g=x.createLinearGradient(0,0,0,seaTop);g.addColorStop(0,isl.sky[0]);g.addColorStop(1,isl.sky[1]);x.fillStyle=g;x.fillRect(0,0,W,seaTop+2);
    if(isl.d===12||storm){x.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<26;i++){x.beginPath();x.arc((i*97+13)%W,(i*53+5)%Math.max(10,seaTop*.85),.8+(i%3)*.6,0,7);x.fill();}
      x.fillStyle='#fef9c3';x.beginPath();x.arc(W*.16,seaTop*.4,Math.min(14,seaTop*.25),0,7);x.fill();}
    else{x.fillStyle='rgba(255,255,255,.75)';[[.14,.4,12],[.5,.25,9],[.84,.5,10]].forEach(([a,b,r])=>{x.beginPath();x.arc(W*a,seaTop*b,r,0,7);x.arc(W*a+r,seaTop*b+3,r*.8,0,7);x.arc(W*a-r,seaTop*b+4,r*.7,0,7);x.fill();});}
    /* جزيرة بعيدة */
    const ix=W*.74,iw=Math.min(W*.2,90);x.fillStyle=isl.hill;x.beginPath();x.ellipse(ix,seaTop+1,iw,Math.max(6,seaTop*.22),0,Math.PI,0);x.fill();
    x.strokeStyle='#6b4423';x.lineWidth=3;x.beginPath();x.moveTo(ix+iw*.2,seaTop-2);x.quadraticCurveTo(ix+iw*.26,seaTop-seaTop*.35,ix+iw*.18,seaTop-seaTop*.55);x.stroke();
    x.fillStyle='#3f9a52';[-1,1].forEach(s=>{x.beginPath();x.ellipse(ix+iw*.18+s*8,seaTop-seaTop*.55,10,4,s*.4,0,7);x.fill();});
    /* البحر */
    const sg=x.createLinearGradient(0,seaTop,0,railY);sg.addColorStop(0,isl.sea);sg.addColorStop(1,shade(isl.sea,-26));x.fillStyle=sg;x.fillRect(0,seaTop,W,railY-seaTop);
    x.strokeStyle='rgba(255,255,255,.33)';x.lineWidth=2;for(let yy=seaTop+7;yy<railY-10;yy+=12){x.beginPath();for(let xx=-12+((yy/12)%2)*12;xx<W+20;xx+=26){x.moveTo(xx,yy);x.quadraticCurveTo(xx+6,yy-4,xx+12,yy);}x.stroke();}
    /* سطح السفينة */
    const dg=x.createLinearGradient(0,railY,0,H);dg.addColorStop(0,'#c98f52');dg.addColorStop(1,'#a8713d');x.fillStyle=dg;x.fillRect(0,railY,W,H-railY);
    x.strokeStyle='rgba(80,45,15,.32)';x.lineWidth=2;for(let yy=railY+18;yy<H;yy+=18){x.beginPath();x.moveTo(0,yy);x.lineTo(W,yy);x.stroke();for(let xx=((yy/18)%2)*44;xx<W;xx+=88){x.beginPath();x.moveTo(xx,yy-18);x.lineTo(xx,yy);x.stroke();}}
    x.fillStyle='rgba(60,30,10,.35)';for(let yy=railY+9;yy<H;yy+=18)for(let xx=((yy/18)%2)*44+8;xx<W;xx+=88){x.beginPath();x.arc(xx,yy,1.4,0,7);x.fill();}
    /* الحاجز الخشبي */
    x.fillStyle='#8b5a2b';x.strokeStyle=INK;x.lineWidth=2.5;for(let xx=8;xx<W;xx+=30){x.fillRect(xx,railY-9,6,10);x.strokeRect(xx,railY-9,6,10);}
    x.fillRect(-4,railY-15,W+8,7);x.strokeRect(-4,railY-15,W+8,7);x.fillStyle='#6b4423';x.fillRect(0,railY,W,4);
    bg=c;bgKind=kind;}
  function placeHero(){const k=sceneOf(R),hw=k==='sea'?clamp(H*.16,40,62):clamp((H-railY)*.3,44,70);heroEl.style.width=hw+'px';
    heroEl.style.top=(k==='sea'?H-hw*1.4-2:railY-hw*.3)+'px';heroEl.style.left='2px';}
  function hero(face='smile',pose){heroEl.innerHTML=heroSVG(World.p.hero,{face,pose,pet:false});}
  function heroCheer(){hero('happy','cheer');heroT=now+1.3;}

  /* ---------- تخطيط الجولة ---------- */
  function layout(r){const dh=H-railY;
    r.cw=clamp(Math.min(W*.3,dh*.42),66,128);r.cx=W*.6;r.cy=railY+dh*.13+r.cw*.36;
    if(r.type==='share'||r.type==='parrot'){const n=r.d,rows=n<=6?1:2,per=Math.ceil(n/rows),top=railY+dh*.46,rowH=(H-top-2)/rows,cell=(W-10)/per;
      r.pw=Math.min(cell*.84,(rowH-16)/1.2,66);r.pos=[];
      for(let i=0;i<n;i++){const row=Math.floor(i/per),col=i%per,inRow=row<rows-1?per:n-per*(rows-1),x0=(W-cell*inRow)/2;r.pos.push([x0+cell*(col+.5),top+rowH*row+(rowH-16)/2]);}}
    if(r.type==='pack')barLayout(r);
    if(r.type==='map'||r.type==='bottle'){r.mx=W*.2;r.my=railY+8;r.mw=W*.77;r.mh=dh-16;}
  }
  function barLayout(r){const n=Math.max(1,r.bar.length),rows=n<=8?1:n<=16?2:3,per=Math.ceil(n/rows),top=railY+(H-railY)*.48,rowH=(H-top-4)/rows,cell=(W-10)/per;
    r.bw=Math.min(cell*.78,rowH/1.32,50);r.bar.forEach((B,i)=>{const row=Math.floor(i/per),col=i%per,inRow=row<rows-1?per:n-per*(rows-1),x0=(W-cell*inRow)/2;B.x=x0+cell*(col+.5);B.y=top+rowH*row+rowH*.56;});}

  /* ---------- بدء الجولة ---------- */
  function startRound(){
    R=storm?stormRound(idx,divs):plan[idx];const r=R;
    Object.assign(r,{tries:0,wrongRec:false,busy:false,done:false,fly:[],got:Array(r.d).fill(0),exp:Array(r.d).fill(0),mood:Array(r.d).fill('idle'),bub:null,
      pile:r.N,manual:false,manualAny:false,manualDone:false,stage:'ask',bar:[],born:now,pat:1,flash:0,solved:0,look:shuffle([0,1,2,3,4,5,6,7])});
    r.T=tut?0:(mode==='b1'?30:mode==='b2'?27:mode==='practice'?30:Math.max(12,25-idx*.5))+Math.min(8,r.N/20);if(hearts<3&&!storm)r.T*=1.1;
    if(r.type==='gold'){r.goldT=8+Math.min(5,r.N/25);r.goldLeft=r.goldT;}
    bg=null;setScene();layout(r);placeHero();hero();
    $('#sq').textContent={share:'كم يأخذ كل قرصان؟',parrot:'كم يأخذ كل قرصان؟',pack:'كم برميلاً نملأ؟',map:'ما الرقم الممزّق؟',bottle:'ما الجواب؟'}[r.type]||`${D(r.N)} ÷ ${D(r.d)} =`;
    kp.reset();kp.lock(r.tut===0);
    $('#vw').textContent=storm?`الموجة ${D(idx+1)}`:`${D(idx+1)} / ${D(total)}`;
    const dl=$('#vdeal');dl.hidden=!(r.type==='share'||r.type==='pack'||r.type==='parrot');dl.classList.toggle('pulse',r.tut===0);
    $('#vscroll').hidden=true;coachOff();
    const lw=LOOTW[r.loot]||W_COIN;
    if(r.tut!=null)coach([`👋 وجدنا ${D(6)} قطع! نقسمها بالعدل على قرصانين. اضغط <b>🤲 وزّع بنفسي</b> لتعطي كل قرصان قطعة في كل مرة.`,
      `💰 ${D(8)} قطع لقرصانين. كم يأخذ كل واحد؟ اكتب الجواب واضغط ✓، أو وزّع بنفسك.`,
      `💎 نقسم ${D(12)} جوهرة على ${D(3)} قراصنة. كم يأخذ كل واحد؟`,
      `😄 قرصان واحد فقط، و${D(5)} لآلئ. كم يأخذ؟`,
      `🐟 عندنا ${D(10)} سمكات، وكل برميل يتسع لسمكتين. كم برميلاً نملأ؟`,
      `🦜 ${D(7)} قطع لقرصانين… لنرَ ماذا يبقى! كم يأخذ كل قرصان؟`][r.tut]);
    else if(r.type==='share')coach(`💰 وجدنا ${nn(r.N,lw)}! قسّمها بالعدل على ${nn(r.d,W_PIR)}.`,null,4200);
    else if(r.type==='pack')coach(`🛢️ عندنا ${nn(r.N,ITEMW[r.item])}، وكل برميل يتسع لـ ${D(r.d)}. كم برميلاً نملأ؟`,null,4200);
    else if(r.type==='parrot')coach(`🦜 نقسم ${nn(r.N,lw)} على ${nn(r.d,W_PIR)}، وما يبقى فهو لي!`,null,4200);
    else if(r.type==='map')coach(`🗺️ خريطة كنز ممزّقة! أكمل الرقم الناقص لتعرف مكان الكنز.`,null,4200);
    else if(r.type==='gold')coach(`✨ سفينة الذهب تمرّ! أجب بسرعة لتربح ${D(3)} جواهر.`,null,3500);
    else if(r.type==='bottle'){coach('🍾 رسالة في زجاجة! اقرأها وأجب.',null,3000);at(.9,openScroll);}
    banner(r.type==='gold'?'✨ سفينة الذهب':r.type==='bottle'?'🍾 رسالة':r.type==='map'?'🗺️ خريطة':r.type==='parrot'?'🦜 كنز الببغاء':r.type==='pack'?'🛢️ البراميل':`💰 الكنز ${D(idx+1)}`);
  }
  function openScroll(){const r=R;if(!alive||!r||r.type!=='bottle'||r.done)return;const t=D(BOTTLES[r.tpl](r.N,r.d));const s=$('#vscroll');
    s.innerHTML=`<p>${t}</p><button class="btn sm ghost" id="vsay">🔊 اسمعها</button>`;s.hidden=false;$('#vsay').onclick=()=>sayAr(BOTTLES[r.tpl](r.N,r.d));}

  /* ---------- المساعد والرسائل ---------- */
  let coachT=0;
  const coachDef=()=>{if(boss)return '💥 أجب بسرعة لتطلق المدفع!';const r=R;if(!r)return '';
    return r.type==='share'?'💰 كم يأخذ كل قرصان؟ اكتب، أو وزّع بنفسك 🤲':r.type==='pack'?`🛢️ كل برميل يتسع لـ ${D(r.d)}. كم برميلاً؟`:r.type==='parrot'?(r.stage==='rem'?'🦜 كم بقي في الصندوق لي؟':'🦜 قسّم بالعدل، وما يبقى فهو لي!'):r.type==='map'?'🗺️ ما الرقم الممزّق؟':r.type==='gold'?'✨ أسرع قبل أن تبتعد سفينة الذهب!':'🍾 اقرأ الرسالة وأجب';};
  function coach(html,key,ms,face){const c=$('#coach');c.classList.remove('idle');c.innerHTML=`<span class="cdr">${face||parrotSVG('talk')}</span><span>${html}</span>`;
    $$('.k.hint').forEach(k=>k.classList.remove('hint'));if(key){$$(key.split(',').map(k=>`.k[data-k="${k}"]`).join(',')).forEach(k=>k.classList.add('hint'));$('.k.go').classList.add('hint');}
    clearTimeout(coachT);if(ms)coachT=setTimeout(coachOff,ms);}
  function coachOff(){const c=$('#coach');if(!c||!alive)return;c.classList.add('idle');c.innerHTML=`<span class="cdr">${parrotSVG()}</span><span>${coachDef()}</span>`;$$('.k.hint').forEach(k=>k.classList.remove('hint'));}
  function banner(t){const b=$('#banner');b.textContent=t;b.hidden=false;b.classList.remove('in');void b.offsetWidth;b.classList.add('in');setTimeout(()=>{if(alive)b.hidden=true;},1100);}
  function bhud(){$('#vh').innerHTML=[0,1,2].map(i=>i<hearts?'❤️':'🖤').join('');$('#vpc').textContent=D(power);$('#vp').disabled=power<=0;}
  function setInput(v){const sv=$('#sv');sv.textContent=v===''?'؟':D(v);sv.classList.toggle('empty',v==='');}
  const kp=bindKeypad($('#kpw'),{onChange:setInput,onSubmit:v=>submit(v)});
  const hintText=r=>r.type==='parrot'?`فكّر: ما أكبر عدد في جدول ${D(r.d)} لا يزيد على ${D(r.N)}؟`:r.type==='map'&&r.rev?`القسمة عكس الضرب: اضرب ${D(r.q)} × ${D(r.d)}`:D(hintFor(r.N,r.d));

  /* ---------- الإدخال ---------- */
  function submit(v){
    if(boss)return bossAnswer(v);
    const r=R;if(!r||r.busy||r.done)return;r.ansAt=now;
    if(r.type==='share'||(r.type==='parrot'&&r.stage==='ask'))return dealTyped(v);
    if(r.type==='parrot')return remAnswer(v);
    if(r.type==='pack')return packTyped(v);
    const ans=r.type==='map'&&r.rev?r.N:r.q;
    if(v===ans)return success();
    wrongBook();
    if(r.type==='map'){r.flash=now+.6;coach(r.rev?`🗺️ ليس ${D(v)}. تذكّر: القسمة عكس الضرب. ${r.tries>=2?`اضرب ${D(r.q)} × ${D(r.d)}`:`جرّب عدداً ${v<ans?'أكبر':'أصغر'}!`}`:`🗺️ ${D(r.d)} × ${D(v)} = ${D(r.d*v)}، وليس ${D(r.N)}. جرّب عدداً ${v<ans?'أكبر':'أصغر'}!`,null,3400);}
    else coach(`🤔 ليس ${D(v)}. ${r.tries>=2?hintText(r):`جرّب عدداً ${v<ans?'أكبر':'أصغر'}!`}`,null,3400);
    if(r.tries>=3)coach(`💡 الجواب: <b>${D(ans)}</b>، لأن ${eqText(r)}. اكتبه الآن!`);
    kp.reset();
  }
  function wrongBook(){const r=R;r.tries++;mistakes++;buzz(60);shake($('#spell'));if(!r.wrongRec){r.wrongRec=true;record(r.d,r.q,false);}
    if(r.type!=='gold')r.pat=Math.max(.15,r.pat-.15);hero('sad');heroT=now+1.4;}
  /* بعد خطأ في التوزيع: نعرض النتيجة، ثم نعيد الكنز إلى الصندوق */
  function wrongDeal(msg){const r=R;wrongBook();coach(msg,null,4600);
    at(2.7,()=>{if(R!==r||r.done)return;resetDeal();r.busy=false;kp.lock(false);kp.reset();$('#vdeal').hidden=false;
      if(r.tries>=3)coach(`💡 الجواب: <b>${D(r.q)}</b>، لأن ${D(r.d)} × ${D(r.q)} = ${D(r.d*r.q)}. اكتبه!`);
      else if(r.tries>=2)coach(`🦜 ${hintText(r)}`,null,5000);});}

  /* ---------- توزيع الكنز ---------- */
  function stackPos(p,i){const r=R,[px,py]=r.pos[p],cr=r.pw*.11,j=Math.min(i,11);return[px+r.pw*.36+(j%2?cr*1.5:0),py+r.pw*.5-Math.floor(j/2)*cr*1.45];}
  function flyLoot(p){const r=R;const i=r.exp[p]++;const [tx,ty]=stackPos(p,i);r.fly.push({p,i,sx:r.cx+(Math.random()-.5)*r.cw*.4,sy:r.cy-r.cw*.4,tx,ty,t0:now,dur:.34});}
  function dealOne(){const r=R;for(let p=0;p<r.d;p++){if(r.pile>0){r.pile--;flyLoot(p);}}}
  function resetDeal(){const r=R;if(r.type==='pack'){r.bar=[];r.pile=r.N;r.fly=[];r.manual=false;r.manualDone=false;return;}const rc=cv.getBoundingClientRect();
    if(r.pos)r.pos.forEach((q,p)=>{if(r.got[p]){const [x,y]=stackPos(p,0);FX.burst(rc.left+x,rc.top+y,{n:4,speed:120,colors:['#fde68a','#fff']});}});
    r.got.fill(0);r.exp.fill(0);r.pile=r.N;r.fly=[];r.mood=r.mood.map(()=>'idle');r.bub=null;r.manual=false;r.manualDone=false;}
  function settle(fn){const r=R;const chk=()=>{if(!alive||R!==r)return;if(r.fly.length)at(.08,chk);else fn();};chk();}
  function dealTyped(v){const r=R,q=Math.floor(r.N/r.d);
    if(r.manualDone&&r.got.every(g=>g===v)&&v===q)return r.type==='parrot'?remStage():success();
    if(v===0){wrongBook();coach('😅 صفر؟ لن يأخذ أحد شيئاً، والصندوق مليء!',null,3000);kp.reset();return;}
    if(v>40){wrongBook();coach(`😮 ${D(v)} لكل واحد؟ هذا كثير جداً! في الصندوق ${D(r.N)} فقط.`,null,3200);kp.reset();return;}
    r.busy=true;kp.lock(true);$('#vdeal').hidden=true;resetDeal();
    const rounds=Math.min(v,q+1),step=clamp(1.5/rounds,.13,.42);let k=0;
    const go=()=>{if(!alive||R!==r)return;dealOne();k++;if(k<rounds)at(step,go);else at(.3,()=>settle(()=>evalDeal(v)));};go();}
  function evalDeal(v){const r=R,q=Math.floor(r.N/r.d);
    if(v===q)return r.type==='parrot'?remStage():success();
    if(v<q){r.mood=r.mood.map(()=>'want');r.bub={p:rint(0,r.d-1),txt:pick(WANT)};
      return wrongDeal(`✋ أعطيت كل قرصان ${D(v)}، وما زال في الصندوق ${D(r.pile)}! يكفي لجولة أخرى. جرّب عدداً أكبر.`);}
    if(r.type==='parrot'){r.mood=r.got.map(g=>g>q?'happy':'angry');const p=Math.max(0,r.got.findIndex(g=>g===q));r.bub={p,txt:'ليس عدلاً!'};
      return wrongDeal(`😠 ليس عدلاً! بعضهم أخذ ${D(q+1)} وبعضهم ${D(q)} فقط. جرّب عدداً أصغر.`);}
    r.mood=r.mood.map(()=>'angry');r.bub={p:rint(0,r.d-1),txt:v>q+1?`وعدتنا بـ ${D(v)}!`:pick(ANGRY)};
    wrongDeal(`😠 الصندوق فرغ! كل قرصان أخذ ${D(q)} فقط، وليس ${D(v)}. جرّب عدداً أصغر.`);}
  function manual(){const r=R;if(!r||r.busy||r.done||!alive||paused)return;
    if(r.type==='pack')return manualPack();
    if(!(r.type==='share'||(r.type==='parrot'&&r.stage==='ask')))return;
    if(r.pile<r.d||r.fly.length)return;
    r.manual=true;r.manualAny=true;buzz(15);dealOne();
    settle(()=>{if(r.pile<r.d){r.manualDone=true;$('#vdeal').hidden=true;const g=r.got[0];r.mood=r.mood.map(()=>'happy');
      if(r.tut===0){kp.lock(false);coach(`👏 كل قرصان أخذ <b>${D(g)}</b>! هذه هي القسمة: ${D(6)} ÷ ${D(2)} = ${D(3)}. اكتب ${D(3)} واضغط ✓`,String(g));}
      else coach(r.pile?`👏 كل قرصان أخذ ${D(g)}، والباقي ${D(r.pile)} لا يكفي لجولة أخرى. اكتب ${D(g)} واضغط ✓`:`👏 فرغ الصندوق! كل قرصان أخذ ${D(g)}. اكتب ${D(g)} واضغط ✓`,String(g).split('').join(','));}});}
  $('#vdeal').onclick=manual;cv.addEventListener('pointerdown',()=>{if(!$('#vdeal').hidden)manual();});

  /* ---------- الببغاء يأخذ الباقي ---------- */
  function remStage(){const r=R;r.stage='rem';r.busy=false;kp.reset();kp.lock(false);$('#sq').textContent='كم بقي لكوكو؟';$('#vdeal').hidden=true;
    r.mood=r.mood.map(()=>'happy');r.bub={p:0,txt:'عدل! 👍'};r.born=now;r.firstTries=r.tries;r.tries=0;heroCheer();
    coach(`🦜 رائع! كل قرصان أخذ ${D(r.got[0])}. وما بقي في الصندوق لا يكفي لجولة أخرى… كم بقي لي؟`);}
  function remAnswer(v){const r=R;
    if(v===r.pile){r.busy=true;kp.lock(true);const pr=perch();koko.fly={t0:now,dur:1.5,sx:pr[0],sy:pr[1],tx:r.cx,ty:r.cy-r.cw*.55};
      at(.75,()=>{r.pile=0;koko.mood='eat';const rc=cv.getBoundingClientRect();FX.burst(rc.left+r.cx,rc.top+r.cy-r.cw*.4,{n:12,colors:['#fbbf24','#fde68a']});});
      at(1.5,()=>{koko.mood='happy';koko.bub=pick(KOKO);koko.bubT=now+1.6;success(true);});return;}
    r.tries++;mistakes++;buzz(60);shake($('#spell'));koko.mood='talk';
    coach(r.tries>=2?`🦜 عُدّها معي: في الصندوق <b>${D(r.pile)}</b>. اكتب ${D(r.pile)}!`:`🦜 لا! عُدّ ما بقي في الصندوق جيداً.`,null,3600);kp.reset();}

  /* ---------- البراميل ---------- */
  function flyItem(b,k){const r=R,B=r.bar[b];const s=r.bw;r.fly.push({b,k,sx:r.cx+(Math.random()-.5)*r.cw*.5,sy:r.cy-r.cw*.15,tx:B.x-s*.22+(k%3)*s*.22,ty:B.y-s*.6,t0:now+k*.03,dur:.36});}
  function fillBarrel(b){const r=R,B=r.bar[b];if(r.pile>=r.d){r.pile-=r.d;B.want=r.d;for(let k=0;k<r.d;k++)flyItem(b,k);}else B.empty=true;}
  function packTyped(v){const r=R,q=r.N/r.d;
    if(r.manualDone&&v===r.bar.length&&v===q)return success();
    if(v===0){wrongBook();coach('😅 بلا براميل؟ أين نضع الحمولة؟',null,3000);kp.reset();return;}
    if(v>24){wrongBook();coach(`😮 ${D(v)} برميلاً؟ هذا كثير جداً! عندنا ${D(r.N)} فقط، وكل برميل يتسع لـ ${D(r.d)}.`,null,3400);kp.reset();return;}
    r.busy=true;kp.lock(true);$('#vdeal').hidden=true;r.bar=[];r.pile=r.N;r.fly=[];r.manual=false;r.manualDone=false;
    for(let i=0;i<v;i++)r.bar.push({fill:0,roll:now+i*.05});barLayout(r);
    let b=0;const step=clamp(1.3/v,.14,.4);
    const go=()=>{if(!alive||R!==r)return;fillBarrel(b);b++;if(b<v)at(step,go);else at(.3,()=>settle(()=>evalPack(v)));};at(.3+v*.05,go);}
  function evalPack(v){const r=R,q=r.N/r.d;
    if(v===q){r.bar.forEach(B=>B.lid=true);return success();}
    if(v<q)return wrongDeal(`🐟 كل البراميل امتلأت، وبقي على السطح ${D(r.pile)}! نحتاج براميل أكثر.`);
    r.bar.forEach(B=>{if(B.empty)B.flash=1;});wrongDeal(`🛢️ بقي ${D(v-q)} من البراميل فارغاً! نحتاج براميل أقل.`);}
  function manualPack(){const r=R;if(r.pile<r.d||r.fly.length)return;if(!r.manual){r.manual=true;r.manualAny=true;r.bar=[];}
    buzz(15);r.bar.push({fill:0,roll:now});barLayout(r);fillBarrel(r.bar.length-1);
    settle(()=>{if(r.pile<r.d){r.manualDone=true;$('#vdeal').hidden=true;const n=r.bar.length;coach(`👏 ملأنا ${D(n)} من البراميل! اكتب ${D(n)} واضغط ✓`,String(n).split('').join(','));}});}

  /* ---------- النجاح والفشل والوقت ---------- */
  function success(fromKoko){const r=R;r.done=true;r.busy=true;kp.lock(true);$('#vdeal').hidden=true;
    const perfect=r.tries===0&&!r.manualAny&&!r.firstTries,fast=perfect&&((r.ansAt||now)-r.born)<(r.type==='gold'?5:8);
    if(perfect){record(r.d,r.q,true);perfects++;}if(fast)fasts++;
    if(r.type==='share'||r.type==='parrot'){r.mood=r.mood.map(()=>'happy');r.bub={p:rint(0,r.d-1),txt:pick(HAPPY)};}
    heroCheer();const rc=cv.getBoundingClientRect();const [tx,ty]=focus(r);
    FX.text(rc.left+tx,rc.top+ty,eqText(r),'#fff7c2',r.type==='parrot'?22:28);
    if(perfect)FX.text(rc.left+tx,rc.top+ty-34,pick(['⭐ عادل!','💥 بالضبط!','⚓ قبطان ممتاز!','👏 رائع!']),'#ffe27a',22);
    if(fast)at(.25,()=>FX.text(rc.left+tx,rc.top+ty-64,'⚡ سريع!','#8fe3ff',20));
    if(r.type==='gold'&&r.goldLeft>0){gold+=3;const gx=goldX(r);FX.burst(rc.left+gx,rc.top+seaTop+(railY-seaTop)*.45,{n:16,emoji:['💎'],speed:260,size:4});at(.3,()=>FX.text(rc.left+W/2,rc.top+railY+30,`💎 +${D(3)}`,'#c4f1ff',26));}
    if(r.type==='map'){r.solved=now;at(.55,()=>{const [mx,my]=mapX(r);FX.burst(rc.left+mx,rc.top+my,{n:30,speed:300,colors:['#fbbf24','#fde68a','#fff']});});}
    if(r.type==='bottle')$('#vscroll').hidden=true;
    cleared++;at(fromKoko?.9:1.6,next);}
  function focus(r){if(r.type==='share'||r.type==='parrot')return[r.cx,r.cy-r.cw*.6];if(r.type==='pack')return[W/2,railY+(H-railY)*.45];if(r.type==='gold')return[W/2,railY-20];return[W*.58,railY+(H-railY)*.4];}
  function timeout(){const r=R;if(r.done||r.busy)return;r.done=true;r.busy=true;kp.lock(true);$('#vdeal').hidden=true;if(!r.wrongRec){r.wrongRec=true;record(r.d,r.q,false);}
    hearts--;bhud();shakeT=.4;buzz(140);hero('sad');
    if(r.type==='share'||r.type==='parrot'){r.mood=r.mood.map(()=>'sad');r.bub={p:0,txt:'تعبنا من الانتظار…'};}
    coach(`⏳ الطاقم ملّ الانتظار! ${eqText(r)}`,null,2800);$('#vscroll').hidden=true;
    if(hearts<=0){at(1.4,defeat);return;}at(2.4,next);}
  function next(){if(!alive)return;idx++;if(!storm&&idx>=plan.length)return victory();
    if(!tut&&Math.random()<.14){dolphin={t0:now,x:W*(.2+Math.random()*.4)};at(.7,()=>{gold+=1;const rc=cv.getBoundingClientRect();FX.text(rc.left+dolphin.x,rc.top+seaTop+10,'🐬 💎 +١','#c4f1ff',20);});at(1.2,startRound);}
    else startRound();}
  const goldX=r=>W+70-(W+140)*(1-r.goldLeft/r.goldT);
  const mapX=r=>[r.mx+r.mw*.22,r.my+r.mh*.72];

  /* ---------- المساعدة والاستراحة ---------- */
  $('#vp').onclick=()=>{if(power<=0||!alive)return;power--;bhud();const face=mate?mateOf(mate):null;
    if(boss){if(bossO){coach(`🐾 ${D(hintFor(bossO.N,D0))}`,null,5000,face);bossO.charge=Math.max(0,bossO.charge-.35);}}
    else if(R&&!R.done){coach(`🐾 ${hintText(R)}`,null,6000,face);patHold=now+6;}
    const[x,y]=centerOf($('#vp'));FX.burst(x,y,{n:14,colors:['#c4b5fd','#fde68a']});};
  $('#vz').onclick=()=>pause();
  function vis(){if(document.hidden&&alive&&!paused)pause();}
  document.addEventListener('visibilitychange',vis);
  function pause(){if(paused)return;paused=true;const ov=document.createElement('div');ov.className='ov';
    ov.innerHTML=`<div class="res"><h2>⏸ استراحة</h2><p class="muted">الطاقم ينتظر قبطانه…</p><div class="btns"><button class="btn gold big" id="pc">▶ أكمل</button><button class="btn ghost" id="pq">🗺️ الخريطة</button></div></div>`;
    document.body.appendChild(ov);$('#pc',ov).onclick=()=>{ov.remove();paused=false;last=performance.now();};$('#pq',ov).onclick=()=>{ov.remove();home();};}

  /* ---------- الزعماء: الأخطبوط العملاق والقبطان شنبو ---------- */
  function bossStart(){const qs=bagQ(D0,[2,3,4,5,6,7,8,9,10,11,12],10);
    bossO={kind:isl.boss,qs,i:0,hp:6,max:6,charge:0,rate:1/(14+D0*.2),hit:0,tries:0,wrongRec:false,born:now,busy:false,dead:0,laugh:0,
      ten:[...Array(6)].map((_,i)=>({dying:0,gone:false,ph:i*1.3})),holes:[],away:0,mood:'smug',moodT:0};
    bossQ();banner(isl.boss==='kraken'?'🐙 الأخطبوط العملاق!':'⛵ القبطان شنبو!');
    coach(isl.boss==='kraken'?`🐙 الأخطبوط العملاق أمسك السفينة! كل جواب صحيح يطلق المدفع على ذراع من أذرعه. أسرع قبل أن يعصر السفينة!`:`⛵ القبطان شنبو يريد كنزنا! كل جواب صحيح يطلق المدفع على سفينته. أسرع قبل أن يطلق مدفعه!`,null,5200);}
  function bossQ(){const b=bossO,q=b.qs[b.i%b.qs.length],N=D0*q,f=Math.random();b.q=q;b.N=N;b.form=f<.2?'rev':f<.34?'miss':'div';b.ans=b.form==='rev'?N:q;
    $('#sq').innerHTML=b.form==='rev'?`؟ ÷ ${D(D0)} = ${D(q)}`:b.form==='miss'?`${D(D0)} × ؟ = ${D(N)}`:`${D(N)} ÷ ${D(D0)} =`;b.tries=0;b.wrongRec=false;b.born=now;kp.reset();}
  const cannonAt=()=>[W/2,H-20];
  function bossTarget(){const b=bossO;if(b.kind==='kraken'){const i=Math.max(0,b.ten.findIndex(t=>!t.dying&&!t.gone)),g=tenGeo(i);return[.25*g.bx+.5*g.cx+.25*g.tx,.25*g.by+.5*g.cy+.25*g.ty,i];}
    const s=shipGeo();return[s.x,s.y+s.h*.3,-1];}
  function bossAnswer(v){const b=bossO;if(!b||b.busy||b.dead)return;
    if(v===b.ans){b.busy=true;kp.lock(true);if(!b.tries){record(D0,b.q,true);perfects++;if(now-b.born<6)fasts++;}heroCheer();
      const [sx,sy]=cannonAt();let [tx,ty,ti]=bossTarget();if(ti<0)tx+=(Math.random()-.5)*shipGeo().w*.4;
      proj.push({sx,sy:sy-18,tx,ty,t0:now,dur:.42,col:'#1f2937',onHit:()=>{const rc=cv.getBoundingClientRect();if(ti>=0)b.ten[ti].dying=.001;FX.burst(rc.left+tx,rc.top+ty,{n:26,speed:300,colors:['#fde68a','#fb923c','#fff']});
        FX.text(rc.left+tx,rc.top+ty-20,b.form==='div'?`${D(b.N)} ÷ ${D(D0)} = ${D(b.q)}`:b.form==='rev'?`${D(b.N)} ÷ ${D(D0)} = ${D(b.q)}`:`${D(D0)} × ${D(b.q)} = ${D(b.N)}`,'#fff7c2',24);buzz(40);
        b.hp--;b.hit=.45;b.charge=Math.max(0,b.charge-.4);if(b.kind!=='kraken'){b.holes.push([Math.random()*.7-.35,Math.random()*.3]);b.mood='oops';b.moodT=now+1;}
        if(b.hp<=0){b.dead=now;b.mood='give';kp.lock(true);coach(b.kind==='kraken'?'🐙 الأخطبوط ترك السفينة وهرب! 🎉':'🏳️ القبطان شنبو رفع العلم الأبيض! 🎉');FX.confetti();setTimeout(()=>{if(alive)victory();},1900);return;}
        b.i++;b.busy=false;kp.lock(false);bossQ();}});return;}
    b.tries++;mistakes++;buzz(60);shake($('#spell'));b.charge=Math.min(.97,b.charge+.2);b.laugh=now+1.2;if(!b.wrongRec){b.wrongRec=true;record(D0,b.q,false);}
    if(b.kind!=='kraken'){b.mood='smug';}
    coach(b.tries>=3?`💡 الجواب: <b>${D(b.ans)}</b>. اكتبه!`:b.tries>=2?`🐾 ${D(hintFor(b.N,D0))}`:b.kind==='kraken'?`😆 الأخطبوط يضحك! ${D(v)} ليس صحيحاً.`:`😏 شنبو يضحك: ${D(v)}؟ خطأ!`,null,3600);kp.reset();}
  function bossAttack(){const b=bossO;b.charge=0;if(!b.wrongRec)record(D0,b.q,false);
    const hit=()=>{hearts--;bhud();shakeT=.5;buzz(130);hero('sad');heroT=now+1.4;const rc=cv.getBoundingClientRect();FX.burst(rc.left+W*.42,rc.top+H*.8,{n:26,colors:['#7dd3fc','#e0f2fe','#fff']});
      coach(`${b.kind==='kraken'?'😵 الأخطبوط عصر السفينة!':'💦 قذيفة شنبو أصابتنا!'} ${b.form==='miss'?`${D(D0)} × ${D(b.q)} = ${D(b.N)}`:`${D(b.N)} ÷ ${D(D0)} = ${D(b.q)}`}`,null,3000);
      b.busy=false;if(hearts<=0){kp.lock(true);setTimeout(()=>{if(alive)defeat();},900);return;}kp.lock(false);b.i++;bossQ();};
    if(b.kind==='kraken'){b.squeeze=now;hit();}else{b.busy=true;kp.lock(true);const s=shipGeo();proj.push({sx:s.x-s.w*.42,sy:s.y+s.h*.1,tx:W*.42,ty:H*.82,t0:now,dur:.6,col:'#1f2937',enemy:1,onHit:hit});}}
  function tenGeo(i){const b=bossO,t=b.ten[i],side=i<3?-1:1,bx=W*(.1+i*.16),by=H*.53;const cx=bx+side*-16+Math.sin(now*2+t.ph)*8,cy=railY-(H-railY)*.75;
    const sq=b.squeeze&&now-b.squeeze<.6?Math.sin((now-b.squeeze)/.6*Math.PI)*14:0;const tx=bx+side*-26+sq*side*-1,ty=railY+(H-railY)*.3+Math.sin(now*3+t.ph)*4;return{bx,by,cx,cy,tx,ty};}
  function shipGeo(){const b=bossO,w=Math.min(W*.6,240);return{x:W*.62+b.away*W*.8,y:H*.42+Math.sin(now*1.5)*3,w,h:w*.3};}
  function updBoss(dt){const b=bossO;if(!b)return;if(b.hit>0)b.hit-=dt;if(b.moodT&&now>b.moodT){b.mood=b.dead?'give':'smug';b.moodT=0;}
    b.ten.forEach(t=>{if(t.dying&&!t.gone){t.dying+=dt/.5;if(t.dying>=1){t.gone=true;const g=tenGeo(b.ten.indexOf(t));const rc=cv.getBoundingClientRect();FX.burst(rc.left+g.bx,rc.top+g.by,{n:14,colors:['#bfdbfe','#fff']});}}});
    if(b.dead){b.away=Math.min(1,(now-b.dead)/1.6);return;}
    if(!b.busy){b.charge+=dt*b.rate;if(b.charge>=1)bossAttack();}}

  /* ---------- التحديث ---------- */
  function perch(){const kw=kokoW();return[W*.9,railY-15-kw*.42];}
  const kokoW=()=>clamp((H-railY)*.2,30,50);
  function update(dt){
    if(timers.length){const due=timers.filter(t=>now>=t.t);if(due.length){timers=timers.filter(t=>now<t.t);due.forEach(t=>{if(alive)t.fn();});}}
    if(shakeT>0)shakeT-=dt;if(heroT&&now>heroT){heroT=0;hero();}
    proj=proj.filter(p=>{if(now>=p.t0+p.dur){p.onHit&&p.onHit();return false;}return true;});
    if(R&&R.fly.length)R.fly=R.fly.filter(f=>{if(now>=f.t0+f.dur){if(f.b!=null){const B=R.bar[f.b];if(B)B.fill++;}else R.got[f.p]++;return false;}return true;});
    if(koko.fly&&now>koko.fly.t0+koko.fly.dur)koko.fly=null;if(koko.bub&&now>koko.bubT)koko.bub=null;
    if(boss){updBoss(dt);return;}
    const r=R;if(!r||r.done)return;
    if(r.type==='gold'){r.goldLeft-=dt;if(r.goldLeft<=0&&!r.busy){r.goldLeft=0;r.done=true;kp.lock(true);coach('🌟 ابتعدت سفينة الذهب! لا بأس، ستعود.',null,2200);at(1.4,next);}}
    else if(!tut&&!r.busy&&!r.manual&&now>patHold){r.pat-=dt/r.T;if(r.pat<=0){r.pat=0;timeout();}}
  }

  /* ---------- الرسم ---------- */
  function pill(txt,x,y,bgc='#fff',fg=INK,fs=15){ctx.font=`800 ${fs}px Lalezar, "Baloo Bhaijaan 2", Tahoma, sans-serif`;ctx.direction='rtl';const w=ctx.measureText(txt).width+16;ctx.fillStyle=bgc;ctx.strokeStyle=INK;ctx.lineWidth=2;
    ctx.beginPath();ctx.roundRect(x-w/2,y-fs*.75,w,fs*1.5,fs*.7);ctx.fill();ctx.stroke();ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,x,y+1);}
  function bubble(txt,x,y,fs=13){ctx.font=`800 ${fs}px "Baloo Bhaijaan 2", Tahoma, sans-serif`;ctx.direction='rtl';const w=ctx.measureText(txt).width+16,h=fs*1.85,bx=clamp(x-w/2,3,W-w-3);
    ctx.fillStyle='#fff';ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(bx,y-h,w,h,10);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(x-5,y-1);ctx.lineTo(x,y+7);ctx.lineTo(x+5,y-1);ctx.fill();ctx.stroke();ctx.fillRect(x-4.5,y-3.5,9,3.5);
    ctx.fillStyle=INK;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,bx+w/2,y-h/2+1);}
  function draw(){
    if(!bg||bgKind!==sceneOf(R))makeBG();ctx.save();if(shakeT>0)ctx.translate((Math.random()-.5)*9,(Math.random()-.5)*7);
    ctx.drawImage(bg,0,0,W,H);
    if(dolphin){const t=(now-dolphin.t0)/1.2;if(t>1)dolphin=null;else{const x=dolphin.x+t*80,y=railY-16-Math.sin(t*Math.PI)*Math.min(40,(railY-seaTop)*.9);
      ctx.save();ctx.translate(x,y);ctx.rotate(-Math.cos(t*Math.PI)*.9);ctx.fillStyle='#7dd3fc';ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,16,7,0,0,7);ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.moveTo(-14,0);ctx.lineTo(-24,-7);ctx.lineTo(-24,7);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(-6,-14);ctx.lineTo(6,-6);ctx.fill();ctx.stroke();
      ctx.fillStyle=INK;ctx.beginPath();ctx.arc(9,-2,1.6,0,7);ctx.fill();ctx.restore();}}
    if(boss)drawBoss();else if(R){const r=R;
      if(r.type==='share'||r.type==='parrot')drawShare(r);else if(r.type==='pack')drawPack(r);else if(r.type==='map')drawMap(r);else if(r.type==='gold')drawGold(r);else drawBottle(r);
      if(!tut&&r.type!=='gold'&&!r.done)drawPatience(r);}
    drawKoko();
    for(const p of proj){const t=clamp((now-p.t0)/p.dur,0,1),x=p.sx+(p.tx-p.sx)*t,y=p.sy+(p.ty-p.sy)*t-Math.sin(t*Math.PI)*(p.enemy?70:50);
      ctx.fillStyle=p.col;ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,7,0,7);ctx.fill();ctx.stroke();}
    ctx.restore();}
  function drawPatience(r){const w=Math.min(150,W*.38),x=(W-w)/2,y=6,f=clamp(r.pat,0,1);ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.roundRect(x,y,w,9,5);ctx.fill();
    ctx.fillStyle=f>.5?'#4ade80':f>.25?'#facc15':'#f87171';ctx.beginPath();ctx.roundRect(x,y,w*f,9,5);ctx.fill();ctx.font='13px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('⏳',x-11,y+5);}
  function drawShare(r){
    drawChest(ctx,r.cx,r.cy,r.cw,r.pile,r.loot);
    pill(D(r.pile),r.cx+r.cw*.52,r.cy-r.cw*.62,r.pile?'#fff7c2':'#e5e7eb',INK,15);
    for(let p=0;p<r.d;p++){const [x,y]=r.pos[p],m=r.mood[p],bmp=pirBmp(r.look[p%8],m,r.pw);
      const hop=m==='happy'?-Math.abs(Math.sin(now*7+p))*5:m==='angry'?Math.sin(now*30+p)*1.2:Math.sin(now*2.5+p)*1.2;
      if(bmp)ctx.drawImage(bmp,x-r.pw/2,y-r.pw*.6+hop,r.pw,r.pw*1.2);
      const c=r.got[p];for(let i=0;i<Math.min(c,12);i++){const [sx,sy]=stackPos(p,i);drawLoot(ctx,r.loot,sx,sy,r.pw*.11,i);}
      if(c||r.manualAny||r.busy)pill(D(c),x,y+r.pw*.6+8,m==='angry'?'#fecaca':m==='happy'?'#bbf7d0':'#fff',INK,12);}
    for(const f of r.fly){const t=clamp((now-f.t0)/f.dur,0,1);if(t<=0)continue;const x=f.sx+(f.tx-f.sx)*t,y=f.sy+(f.ty-f.sy)*t-Math.sin(t*Math.PI)*36;drawLoot(ctx,r.loot,x,y,r.pw*.11,f.i);}
    if(r.bub&&r.pos[r.bub.p]){const [x,y]=r.pos[r.bub.p];bubble(r.bub.txt,x,y-r.pw*.62);}}
  function drawPack(r){
    /* الكومة */
    const s=Math.max(16,r.cw*.22),m=Math.min(r.pile,22);for(let i=0;i<m;i++){const row=Math.floor(Math.sqrt(i*2.4)),px=r.cx+(((i*41)%19)/19-.5)*r.cw*(1-row*.12),py=r.cy+r.cw*.12-row*s*.42;drawItem(ctx,r.item,px,py,s,((i*7)%5-2)*.3);}
    pill(D(r.pile),r.cx+r.cw*.55,r.cy-r.cw*.32,r.pile?'#fff7c2':'#e5e7eb',INK,15);
    /* لوحة السعة */
    const sx=W*.27,sy=railY+(H-railY)*.24;if(!r.bar.length){drawBarrel(ctx,sx,sy,clamp(r.cw*.36,26,40),0,r.d,r.item,false);}
    pill(`🛢️ يتسع لـ ${D(r.d)}`,sx,sy+clamp(r.cw*.36,26,40)*.95,'#fff',INK,12);
    r.bar.forEach((B,i)=>{const roll=clamp((now-B.roll)/.3,0,1);const x=B.x+(1-roll)*(W-B.x+40);drawBarrel(ctx,x,B.y,r.bw,B.fill,r.d,r.item,B.lid,B.flash&&Math.sin(now*12)>0?'rgba(255,80,80,.5)':null);
      if(r.busy||r.manual||r.done)pill(D(B.fill),x,B.y+r.bw*.72,B.empty?'#fecaca':B.fill>=r.d?'#bbf7d0':'#fff',INK,11);});
    for(const f of r.fly){const t=clamp((now-f.t0)/f.dur,0,1);if(t<=0)continue;const x=f.sx+(f.tx-f.sx)*t,y=f.sy+(f.ty-f.sy)*t-Math.sin(t*Math.PI)*34;drawItem(ctx,r.item,x,y,r.bw*.36,t*4);}}
  function drawMap(r){const {mx,my,mw,mh}=r;
    ctx.save();ctx.fillStyle='#f6e7c1';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(mx,my+8);
    for(let i=0;i<=10;i++)ctx.lineTo(mx+mw*i/10,my+(i%2?2:9));for(let i=0;i<=8;i++)ctx.lineTo(mx+mw-(i%2?6:0),my+mh*i/8);for(let i=10;i>=0;i--)ctx.lineTo(mx+mw*i/10,my+mh-(i%2?2:8));
    ctx.closePath();ctx.fill();ctx.stroke();
    ctx.setLineDash([6,6]);ctx.strokeStyle='#b45309';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(mx+mw*.85,my+mh*.82);ctx.quadraticCurveTo(mx+mw*.6,my+mh*.55,mx+mw*.22,my+mh*.72);ctx.stroke();ctx.setLineDash([]);
    const [xx,xy]=mapX(r),g=r.solved?1+Math.sin(now*8)*.15:1;ctx.strokeStyle='#dc2626';ctx.lineWidth=6*g;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(xx-10,xy-10);ctx.lineTo(xx+10,xy+10);ctx.moveTo(xx+10,xy-10);ctx.lineTo(xx-10,xy+10);ctx.stroke();
    /* المعادلة: نرسم كل جزء وحده من اليمين إلى اليسار */
    const fs=clamp(mh*.2,24,44),tok=r.rev?['؟','÷',D(r.d),'=',D(r.q)]:[D(r.d),'×','؟','=',D(r.N)],qi=r.rev?0:2;
    ctx.font=`400 ${fs}px Lalezar, "Baloo Bhaijaan 2", sans-serif`;ctx.textBaseline='middle';ctx.textAlign='center';ctx.direction='ltr';
    const ws=tok.map((t,i)=>i===qi?fs*1.25:ctx.measureText(t).width),gap=fs*.32,tw=ws.reduce((a,b)=>a+b,0)+gap*(tok.length-1);let x=mx+mw/2+tw/2;const y=my+mh*.36;
    tok.forEach((t,i)=>{const w=ws[i],cx=x-w/2;
      if(i===qi){const sh=r.flash>now?Math.sin(now*40)*3:0;ctx.fillStyle=r.solved?'#fde68a':'#fff';ctx.strokeStyle=r.solved?'#16a34a':'#b45309';ctx.lineWidth=3;ctx.setLineDash(r.solved?[]:[5,4]);ctx.beginPath();ctx.arc(cx+sh,y,fs*.62,0,7);ctx.fill();ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle=r.solved?'#15803d':'#b45309';ctx.fillText(r.solved?D(r.rev?r.N:r.q):'؟',cx+sh,y+2);}
      else{ctx.fillStyle='#5b3415';ctx.fillText(t,cx,y+2);}x-=w+gap;});
    if(r.solved){const t=clamp((now-r.solved-.4)/.4,0,1);if(t>0){const cw=Math.min(60,mw*.22);drawChest(ctx,xx,xy-4-t*10,cw,8,'coin');}}
    ctx.restore();}
  function drawGold(r){const x=goldX(r),y=seaTop+(railY-seaTop)*.5+Math.sin(now*2)*3,s=Math.min(W*.34,130);
    ctx.save();ctx.translate(x,y);ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.lineJoin='round';
    ctx.fillStyle='#8b5a2b';ctx.fillRect(-2,-s*.62,4,s*.6);ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(-s*.32,-s*.56);ctx.quadraticCurveTo(0,-s*.64,s*.32,-s*.56);ctx.lineTo(s*.3,-s*.12);ctx.quadraticCurveTo(0,-s*.18,-s*.3,-s*.12);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.moveTo(-s*.5,-s*.08);ctx.lineTo(s*.5,-s*.08);ctx.quadraticCurveTo(s*.42,s*.16,s*.2,s*.18);ctx.lineTo(-s*.24,s*.18);ctx.quadraticCurveTo(-s*.44,s*.14,-s*.5,-s*.08);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#fde68a';for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(-s*.2+i*s*.2,s*.04,s*.04,0,7);ctx.fill();}
    for(let k=0;k<3;k++){const a=now*3+k*2.1;ctx.font='13px sans-serif';ctx.textAlign='center';ctx.fillText('✨',Math.cos(a)*s*.5,-s*.3+Math.sin(a)*s*.3);}
    ctx.restore();
    const w=Math.min(170,W*.44),bx=(W-w)/2,f=clamp(r.goldLeft/r.goldT,0,1);ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.roundRect(bx,8,w,10,5);ctx.fill();ctx.fillStyle='#fde047';ctx.beginPath();ctx.roundRect(bx,8,w*f,10,5);ctx.fill();
    pill(`${D(r.N)} ÷ ${D(r.d)} = ؟`,W*.58,railY+(H-railY)*.42,'#fff7c2',INK,22);}
  function drawBottle(r){if(!$('#vscroll').hidden)return;const x=W*.7,y=railY-22+Math.sin(now*2.5)*4;ctx.save();ctx.translate(x,y);ctx.rotate(.5+Math.sin(now*2)*.1);
    ctx.fillStyle='rgba(134,239,172,.8)';ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.beginPath();ctx.roundRect(-10,-22,20,34,7);ctx.fill();ctx.stroke();ctx.beginPath();ctx.roundRect(-5,-32,10,12,3);ctx.fill();ctx.stroke();
    ctx.fillStyle='#b45309';ctx.fillRect(-4,-36,8,6);ctx.fillStyle='#fef3c7';ctx.fillRect(-5,-14,10,18);ctx.restore();}
  function drawKoko(){const kw=kokoW();let [x,y]=perch();const f=koko.fly;
    if(f){const t=clamp((now-f.t0)/f.dur,0,1),u=t<.5?t*2:(1-t)*2;x=x+(f.tx-x)*u;y=y+(f.ty-y)*u-Math.sin(u*Math.PI)*30;}
    const m=f?'happy':koko.mood;const bmp=parrotBmp(m,kw);if(bmp)ctx.drawImage(bmp,x-kw/2,y-kw/2+(f?0:Math.sin(now*3)*1.5),kw,kw);
    if(koko.bub)bubble(koko.bub,Math.min(x,W-60),y-kw*.5);
    if(!f&&koko.mood!=='idle'&&!koko.bub&&Math.random()<.004)koko.mood='idle';}
  function drawBoss(){const b=bossO;if(!b)return;
    if(b.kind==='kraken')drawKraken(b);else drawShanbo(b);
    const bw=Math.min(W-40,240),bx=(W-bw)/2,by=10;ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.roundRect(bx,by,bw,14,7);ctx.fill();
    ctx.fillStyle='#ef4444';ctx.beginPath();ctx.roundRect(bx,by,bw*(b.hp/b.max),14,7);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(bx,by,bw,14,7);ctx.stroke();
    pill(`${b.kind==='kraken'?'🐙':'⛵'} ${D(b.hp)}`,W/2,by+7,'rgba(255,255,255,.92)',INK,11);
    if(!b.dead){const cy=32,w=Math.min(W*.5,180),x=(W-w)/2;ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(x,cy,w,7);ctx.fillStyle=b.charge>.75?'#f97316':'#facc15';ctx.fillRect(x,cy,w*Math.min(1,b.charge),7);
      pill(b.kind==='kraken'?'⚡ يستعد للعصر':'⚡ يجهّز المدفع',x-34,cy+3,'#fff',INK,10);}
    /* مدفعنا */
    const [cx,cy]=cannonAt(),[tx,ty]=b.dead?[W/2,0]:bossTarget(),a=Math.atan2(ty-cy,tx-cx);ctx.save();ctx.translate(cx,cy);ctx.save();ctx.rotate(a);ctx.fillStyle='#1f2937';ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(-6,-9,40,18,8);ctx.fill();ctx.stroke();ctx.restore();
    ctx.fillStyle='#8b5a2b';ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.beginPath();ctx.roundRect(-22,-4,44,16,4);ctx.fill();ctx.stroke();ctx.fillStyle='#4b2e13';[-13,13].forEach(o=>{ctx.beginPath();ctx.arc(o,12,7,0,7);ctx.fill();ctx.stroke();});ctx.restore();}
  function drawKraken(b){const rx=Math.min(W*.24,92),ry=rx*.82,hx=W/2,hy=H*.34+Math.sin(now*1.4)*4+b.away*ry*2.2,col=b.angry||b.charge>.75?'#f0abfc':'#c084fc';
    ctx.save();ctx.beginPath();ctx.rect(0,0,W,railY-15);ctx.clip();ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.fillStyle=col;ctx.beginPath();ctx.ellipse(hx,hy,rx,ry,0,0,7);ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.35)';[[-.45,-.45,.14],[.35,-.55,.1],[.55,-.15,.08],[-.2,-.7,.07]].forEach(([a,c,r])=>{ctx.beginPath();ctx.arc(hx+a*rx,hy+c*ry,r*rx,0,7);ctx.fill();});
    if(b.hit>0){ctx.globalAlpha=b.hit;ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(hx,hy,rx,ry,0,0,7);ctx.fill();ctx.globalAlpha=1;}
    const ey=hy-ry*.05,er=rx*.22;[-1,1].forEach(s=>{ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(hx+s*rx*.36,ey,er,0,7);ctx.fill();ctx.stroke();ctx.fillStyle=INK;ctx.beginPath();ctx.arc(hx+s*rx*.36,ey+er*.3,er*.5,0,7);ctx.fill();
      ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(hx+s*rx*.36+er*.2,ey+er*.1,er*.17,0,7);ctx.fill();
      ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();const ang=b.charge>.6?.7:-.3;ctx.moveTo(hx+s*rx*.18,ey-er*1.25);ctx.lineTo(hx+s*rx*.56,ey-er*1.25-ang*er);ctx.stroke();});
    ctx.lineWidth=3.5;ctx.beginPath();if(now<b.laugh){ctx.fillStyle='#7a2e2e';ctx.ellipse(hx,hy+ry*.45,rx*.2,ry*.16,0,0,7);ctx.fill();ctx.stroke();}else{ctx.arc(hx,hy+ry*.62,rx*.18,1.15*Math.PI,1.85*Math.PI);ctx.stroke();}
    if(!b.dead)pill(b.form==='rev'?`؟ ÷ ${D(D0)} = ${D(b.q)}`:b.form==='miss'?`${D(D0)} × ؟ = ${D(b.N)}`:`${D(b.N)} ÷ ${D(D0)}`,hx,hy-ry*.62,'#fff7c2',INK,clamp(rx*.2,14,20));
    ctx.restore();ctx.save();
    /* الموج الأمامي */
    const wy=H*.5;ctx.fillStyle=shade(isl.sea,-8);ctx.beginPath();ctx.moveTo(0,wy);for(let x=0;x<=W+20;x+=20)ctx.quadraticCurveTo(x+10,wy-7+Math.sin(now*2+x)*2,x+20,wy);ctx.lineTo(W,railY-15);ctx.lineTo(0,railY-15);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=2.5;ctx.beginPath();for(let x=0;x<=W;x+=20){ctx.moveTo(x,wy);ctx.quadraticCurveTo(x+10,wy-7,x+20,wy);}ctx.stroke();
    /* الأذرع */
    b.ten.forEach((t,i)=>{if(t.gone)return;const g=tenGeo(i),len=1-clamp(t.dying,0,1),N=26,th=clamp(W*.028,8,14);const pts=[];
      for(let k=0;k<=N;k++){const u=k/N*len,x=(1-u)*(1-u)*g.bx+2*(1-u)*u*g.cx+u*u*g.tx,y=(1-u)*(1-u)*g.by+2*(1-u)*u*g.cy+u*u*g.ty;pts.push([x,y,th*(1-u*.7)]);}
      ctx.fillStyle=INK;pts.forEach(([x,y,r])=>{ctx.beginPath();ctx.arc(x,y,r+2.2,0,7);ctx.fill();});ctx.fillStyle=col;pts.forEach(([x,y,r])=>{ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();});
      ctx.fillStyle='#fbcfe8';pts.forEach(([x,y,r],k)=>{if(k%3===1&&k<N-1){ctx.beginPath();ctx.arc(x+r*.3,y+r*.3,r*.3,0,7);ctx.fill();}});});
    ctx.restore();}
  function drawShanbo(b){const s=shipGeo();ctx.save();ctx.translate(s.x,s.y);ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.lineJoin='round';
    ctx.fillStyle='#6b4423';ctx.fillRect(-3,-s.w*.55,6,s.w*.5);
    ctx.fillStyle='#1f2937';ctx.beginPath();ctx.moveTo(-s.w*.3,-s.w*.5);ctx.quadraticCurveTo(0,-s.w*.56,s.w*.3,-s.w*.5);ctx.lineTo(s.w*.28,-s.w*.14);ctx.quadraticCurveTo(0,-s.w*.2,-s.w*.28,-s.w*.14);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#fff';ctx.beginPath();const my=-s.w*.32,mw=s.w*.16;ctx.moveTo(0,my);ctx.quadraticCurveTo(-mw*.6,my-mw*.35,-mw,my);ctx.quadraticCurveTo(-mw*1.25,my-mw*.2,-mw*1.15,my-mw*.45);ctx.quadraticCurveTo(-mw*1.5,my+mw*.15,-mw*.9,my+mw*.25);ctx.quadraticCurveTo(-mw*.4,my+mw*.3,0,my+mw*.1);
    ctx.quadraticCurveTo(mw*.4,my+mw*.3,mw*.9,my+mw*.25);ctx.quadraticCurveTo(mw*1.5,my+mw*.15,mw*1.15,my-mw*.45);ctx.quadraticCurveTo(mw*1.25,my-mw*.2,mw,my);ctx.quadraticCurveTo(mw*.6,my-mw*.35,0,my);ctx.fill();
    if(b.dead){ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(3,-s.w*.55);ctx.lineTo(s.w*.2,-s.w*.5);ctx.lineTo(3,-s.w*.44);ctx.fill();ctx.stroke();}
    const sb=shanboBmp(b.mood,s.w*.34);if(sb)ctx.drawImage(sb,-s.w*.44,-s.h*.95,s.w*.34,s.w*.34);
    ctx.fillStyle='#4c1d95';ctx.beginPath();ctx.moveTo(-s.w*.5,-s.h*.1);ctx.lineTo(s.w*.5,-s.h*.1);ctx.quadraticCurveTo(s.w*.44,s.h*.75,s.w*.22,s.h*.8);ctx.lineTo(-s.w*.26,s.h*.8);ctx.quadraticCurveTo(-s.w*.46,s.h*.7,-s.w*.5,-s.h*.1);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='#fbbf24';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-s.w*.48,s.h*.08);ctx.lineTo(s.w*.48,s.h*.08);ctx.stroke();
    ctx.fillStyle='#111827';[-.3,0,.3].forEach(f=>{ctx.beginPath();ctx.arc(f*s.w,s.h*.36,s.h*.11,0,7);ctx.fill();});
    b.holes.forEach(([hx,hy])=>{ctx.fillStyle='#1c1917';ctx.beginPath();ctx.ellipse(hx*s.w,s.h*(.3+hy),s.h*.16,s.h*.12,0,0,7);ctx.fill();ctx.strokeStyle='#fbbf24';ctx.lineWidth=1.5;ctx.stroke();});
    if(b.hit>0){ctx.globalAlpha=b.hit;ctx.fillStyle='#fff';ctx.fillRect(-s.w*.5,-s.h*.1,s.w,s.h*.9);ctx.globalAlpha=1;}
    ctx.restore();
    ctx.fillStyle=shade(isl.sea,-8);ctx.beginPath();const wy=s.y+s.h*.62;ctx.moveTo(s.x-s.w*.6,wy);for(let x=-s.w*.6;x<=s.w*.6;x+=18)ctx.quadraticCurveTo(s.x+x+9,wy-6,s.x+x+18,wy);ctx.lineTo(s.x+s.w*.6,wy+14);ctx.lineTo(s.x-s.w*.6,wy+14);ctx.fill();
    if(!b.dead)bubble(b.form==='rev'?`؟ ÷ ${D(D0)} = ${D(b.q)}`:b.form==='miss'?`${D(D0)} × ؟ = ${D(b.N)}`:`${D(b.N)} ÷ ${D(D0)} = ؟`,s.x-s.w*.27,s.y-s.h*.95-2,17);}

  function loop(t){if(!alive)return;const dt=Math.min(.05,(t-last)/1000);last=t;if(!paused){now+=dt;update(dt);}draw();raf=requestAnimationFrame(loop);}

  /* ---------- النهاية ---------- */
  function victory(){if(!alive)return;alive=false;cancelAnimationFrame(raf);kp.lock(true);
    const stars=tut?3:Math.max(1,hearts),gems=perfects+fasts+gold+stars*4+(boss?15:0);G.plays++;
    if(node)G.stars[node.id]=Math.max(G.stars[node.id]||0,stars);gsave();
    const nextI=node?NODE_I[node.id]+1:-1,hasNext=nextI>0&&nextI<NODES.length;
    const title=boss?(isl.boss==='kraken'?'🐙 هرب الأخطبوط!':'🏳️ استسلم شنبو!'):tut?'🎓 أنت قبطان عادل!':mode==='practice'?'⚓ تدريب رائع!':'💰 قسمت الكنز بالعدل!';
    const show=()=>resultOv({title,stars:mode==='practice'?null:stars,gems,
      lines:[`⭐ قسمة عادلة من أول مرة: ${D(perfects)}`,fasts?`⚡ أجوبة سريعة: ${D(fasts)}`:'',gold?`💎 جواهر من البحر: ${D(gold)}`:'',mistakes?`محاولات خاطئة: ${D(mistakes)}`:'بدون أي خطأ! 👑',mode!=='practice'&&stars<3?'احفظ كل القلوب لتحصل على ٣ نجوم':''],
      chest:boss||Math.random()<.3?{min:10,max:30,itemChance:boss?.6:.3}:null,
      btns:[...(hasNext?[{label:`التالي ${nodeIcon(NODES[nextI])}`,cls:'gold big',fn:()=>go('voyage',{node:nextI},false)}]:[]),{label:'🔁 مرة أخرى',cls:'ghost',fn:()=>rerender()},{label:'🗺️ الخريطة',cls:'ghost',fn:()=>home()}]});
    if((boss||tut)&&!G.crew[D0])setTimeout(()=>joinOv(D0,show),600);else setTimeout(show,500);}
  function defeat(){if(!alive)return;alive=false;cancelAnimationFrame(raf);kp.lock(true);
    if(storm){const best=G.best||0;if(cleared>best)G.best=cleared;gsave();
      return resultOv({title:'🌊 انتهت العاصفة!',big:`${D(cleared)} موجة`,gems:perfects+Math.floor(cleared/2),mood:'smile',lines:[cleared>best?'🏆 رقم قياسي جديد!':`أطول رحلة: ${D(best)} موجة`],btns:[{label:'🔁 مرة أخرى',cls:'gold big',fn:()=>rerender()},{label:'🗺️ الخريطة',cls:'ghost',fn:()=>home()}]});}
    resultOv({title:'الطاقم تعب! 😮',stars:0,mood:'sad',gems:perfects,lines:['لا بأس، كل قبطان يتدرّب!','💡 استخدم «🤲 وزّع بنفسي» أو مساعدة الطاقم حين تحتاج'],
      btns:[{label:'🔁 حاول مرة أخرى',cls:'gold big',fn:()=>rerender()},{label:'📖 افهم القسمة',cls:'ghost',fn:()=>go('learn',D0>1?D0:2)},{label:'🗺️ الخريطة',cls:'ghost',fn:()=>home()}]});}

  size();addEventListener('resize',size);bhud();hero();
  if(boss)bossStart();else startRound();
  raf=requestAnimationFrame(t=>{last=t;loop(t);});
},{full:true});
