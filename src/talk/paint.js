/* ===== مرسم الألوان: صِف ما تريد، والسيد فرشاة يرسمه ===== */
const PIRR={fish:'fish',butterfly:'butterflies'};
const pluralN=n=>PIRR[n]||n+'s';
function parsePaint(text){const t=normS(text);if(!t)return{items:[]};const w=t.split(' ');
  if(/\b(clear|clean|erase|delete everything|start again|new picture)\b/.test(t))return{clear:true,items:[]};
  if(/\b(undo|remove|take away|go back)\b/.test(t))return{undo:true,items:[]};
  const out=[];let last=-1;
  for(let i=0;i<w.length;i++){const x=w[i];let n=null,pl=false;
    if(PNOUNS[x])n=x;else if(PPLUR[x]){n=PPLUR[x];pl=/s$/.test(x);}
    else if(x==='three'&&i>0&&(PCOL[w[i-1]]||PSIZE[w[i-1]])&&!(w[i+1]&&(PNOUNS[w[i+1]]||PPLUR[w[i+1]])))n='tree';
    if(!n)continue;let c=null,z=null,k=null;
    for(let j=i-1;j>last&&j>=i-4;j--){const y=w[j];if(!c&&PCOL[y])c=PCOL[y];else if(!z&&PSIZE[y])z=PSIZE[y];else if(k==null&&PNUM[y]!=null)k=PNUM[y];}
    out.push({n,c,z,k:Math.min(10,k==null?(pl?3:1):k),said:{c:!!c,z:!!z,k:k!=null}});last=i;}
  return{items:out};}
function phraseOf(it){const c=it.c||PNOUNS[it.n].c,adj=[it.z,it.n==='rainbow'?null:c].filter(Boolean).join(' ');
  return `${it.k===1?(/^[aeiou]/.test(adj||it.n)?'an':'a'):NUMW[it.k]||it.k} ${adj?adj+' ':''}${it.k===1?it.n:pluralN(it.n)}`;}
const ZONE={sky:[.1,.36],mid:[.3,.52],ground:[.64,.84],water:[.84,.92]};

def('paint',arg=>{
  const free=!!arg.free,li=arg.i||0,tgt=free?null:PTARGETS[li].map(x=>Object.assign({done:false},x));
  setTitle(free?'🖌️ الرسم الحر':`🖼️ اللوحة ${D(li+1)}`);
  $('#view').innerHTML=`<div class="pt">
    ${tgt?`<div class="ptgt"><div class="pframe"><canvas id="ptc"></canvas></div><div class="ptx"><b>صِف هذه اللوحة!</b><span>قل ما تراها: العدد، الحجم، اللون، والشيء.</span><span class="ptl" id="ptl"></span></div></div>`
      :`<p class="tip">🎨 قل ما تريد أن يرسمه السيد فرشاة. مثلاً: <span class="en nw">three red apples</span></p>`}
    <div class="rbub" id="pb"><b class="en">…</b><span></span></div>
    <div class="pstage" id="ps"><canvas id="pc"></canvas><div class="pbr" id="pbr">${brushSVG('#f472b6')}</div></div>
    ${free?'<div class="row cen ptools"><button class="chipbtn" id="pundo">↶ تراجع</button><button class="chipbtn" id="pclr">🧽 صفحة جديدة</button></div>':''}
    <div class="wscroll"><span class="wct">أرسم:</span>${Object.keys(PNOUNS).map(n=>`<button class="wc en" data-w="${n}">${n}</button>`).join('')}</div>
    <div class="wscroll">${Object.keys(COLHEX).filter(c=>!['grey','gold','silver'].includes(c)).map(c=>`<button class="cdot" data-w="${c}" style="--c:${COLHEX[c]}" aria-label="${c}"></button>`).join('')}<button class="wc en" data-w="big">big</button><button class="wc en" data-w="small">small</button></div>
    <div id="mic"></div></div>`;
  const cv=$('#pc'),ctx=cv.getContext('2d');let W=360,H=260,S=50;
  let alive=true,raf=0,last=performance.now(),now=0,items=[],tries=0,busy=false,won=false;
  onClean(()=>{alive=false;cancelAnimationFrame(raf);removeEventListener('resize',size);});
  function size(){W=$('#ps').clientWidth||360;H=Math.round(clamp(W*.62,200,300));S=Math.min(W,H)*.2;const d=Math.min(2,window.devicePixelRatio||1);cv.width=W*d;cv.height=H*d;cv.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);}
  function bubble(en,ar,think){const b=$('#pb');b.innerHTML=`<span class="bwho">${brushSVG(brushCol,think?'think':'happy')}</span><b class="en">${esc(en)}</b><span>${ar}</span>`;b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');sayEn(en,{pitch:1.15});
    $('#pbr').innerHTML=brushSVG(brushCol,think?'think':'happy');}
  let brushCol='#f472b6';
  /* أماكن الأشياء */
  function place(it,sc){const zn=PNOUNS[it.n].z,[a,b]=ZONE[zn];const pts=[];
    for(let k=0;k<it.k;k++){let best=null,bd=-1;
      for(let s=0;s<14;s++){const x=zn==='water'?W*(.62+Math.random()*.3):W*(zn==='ground'?.16+Math.random()*.78:.08+Math.random()*.84),y=H*(a+Math.random()*(b-a));
        let d=1e9;items.concat([{pts}]).forEach(o=>(o.pts||[]).forEach(p=>{d=Math.min(d,Math.hypot(p[0]-x,(p[1]-y)*1.4));}));if(d>bd){bd=d;best=[x,y];}}
      pts.push(best);}
    if(it.n==='rainbow')pts.splice(0,pts.length,...[...Array(it.k)].map((_,k)=>[W*(.3+k*.25),H*.34]));
    return pts;}
  function addItem(it,o={}){const z=it.z==='big'?1.45:it.z==='small'?.65:1,sc=it.n==='rainbow'?2:1;
    const obj={n:it.n,c:it.c||PNOUNS[it.n].c,s:S*z*sc*(it.k>4?.8:1),born:now,temp:o.temp||0,pts:[]};obj.pts=place(it,obj.s);items.push(obj);brushCol=COLHEX[obj.c]||'#f472b6';return obj;}
  /* اللوحة المطلوبة */
  function drawTarget(){const c=$('#ptc');if(!c)return;const w=132,h=96,d=Math.min(2,window.devicePixelRatio||1);c.width=w*d;c.height=h*d;c.style.width=w+'px';c.style.height=h+'px';const x=c.getContext('2d');x.scale(d,d);
    scene(x,w,h,tgt.some(t=>PNOUNS[t.n].z==='water'));const s=Math.min(w,h)*.2;
    tgt.forEach((t,ti)=>{const zn=PNOUNS[t.n].z,[a,b]=ZONE[zn];const z=t.z==='big'?1.45:t.z==='small'?.65:1;
      for(let k=0;k<t.k;k++){const fx=t.n==='rainbow'?.5:(zn==='water'?.68+k*.12:(ti*.31+.15+k*.2)%0.9+.05),fy=t.n==='rainbow'?.38:a+(b-a)*((k*37+ti*17)%10)/10;
        paintThing(x,t.n,w*fx,h*fy,s*z*(t.n==='rainbow'?2:1)*(t.k>4?.8:1),t.c,0);}
      if(t.done){x.fillStyle='rgba(34,197,94,.85)';x.beginPath();x.arc(10+ti*16,10,7,0,7);x.fill();x.fillStyle='#fff';x.font='bold 10px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('✓',10+ti*16,10.5);}});
    $('#ptl').innerHTML=`${D(tgt.filter(t=>t.done).length)} / ${D(tgt.length)} ✓`;}
  function scene(x,w,h,water){const g=x.createLinearGradient(0,0,0,h*.6);g.addColorStop(0,'#bae6fd');g.addColorStop(1,'#e0f2fe');x.fillStyle=g;x.fillRect(0,0,w,h*.6);
    const gg=x.createLinearGradient(0,h*.58,0,h);gg.addColorStop(0,'#86efac');gg.addColorStop(1,'#4ade80');x.fillStyle=gg;x.beginPath();x.moveTo(0,h*.6);x.quadraticCurveTo(w*.3,h*.54,w*.6,h*.6);x.quadraticCurveTo(w*.85,h*.65,w,h*.58);x.lineTo(w,h);x.lineTo(0,h);x.fill();
    if(water){x.fillStyle='#60a5fa';x.strokeStyle='#1d4ed8';x.lineWidth=2;x.beginPath();x.ellipse(w*.8,h*.9,w*.22,h*.09,0,0,7);x.fill();x.stroke();}}
  function draw(){ctx.clearRect(0,0,W,H);scene(ctx,W,H,items.some(o=>PNOUNS[o.n].z==='water'));
    items.forEach(o=>{const t=clamp((now-o.born)/.35,0,1),e=t<1?1-Math.pow(1-t,3)*(1+Math.sin(t*9)*.0):1,fade=o.temp?clamp((o.temp-now)/.6,0,1):1;if(o.temp&&now>o.temp)return;
      ctx.globalAlpha=fade*(o.temp?.85:1);o.pts.forEach((p,k)=>{const bob=['bird','butterfly','balloon','kite'].includes(o.n)?Math.sin(now*2+k)*3:0;paintThing(ctx,o.n,p[0],p[1]+bob,o.s*Math.max(.01,e),o.c,now);});ctx.globalAlpha=1;
      if(o.temp&&fade>0){o.pts.forEach(p=>{ctx.strokeStyle='rgba(239,68,68,.8)';ctx.lineWidth=3;ctx.setLineDash([5,4]);ctx.beginPath();ctx.arc(p[0],p[1],o.s*.42,0,7);ctx.stroke();ctx.setLineDash([]);});}});
    items=items.filter(o=>!o.temp||now<o.temp+.1);}
  function onText(r){if(busy||won)return;let P={items:[]};for(const a of r.alts){P=parsePaint(a);if(P.items.length||P.clear||P.undo)break;}
    if(P.clear&&free){items=[];bubble('A clean page!','صفحة جديدة نظيفة!');return;}
    if(P.undo&&free){items.pop();bubble('Okay, I took it away.','حسناً، أزلته.');return;}
    if(!P.items.length){bubble('Hmm? What should I paint?',`ماذا أرسم؟ قل مثلاً: <span class="en">a red ball</span>`,true);return;}
    const ws=[];P.items.forEach(it=>{ws.push(it.n);if(it.c)ws.push(it.c);if(it.z)ws.push(it.z);if(it.said.k&&it.k>1)ws.push(NUMW[it.k]);});learnWords(ws);
    if(normS(r.text).split(' ').length>=3)T.full++;
    if(free)return freeDraw(P.items);
    tries++;checkTarget(P.items);}
  function freeDraw(list){let fresh=0;list.forEach(it=>{addItem(it);if(!T.drew[it.n]){T.drew[it.n]=1;fresh++;}});tsave();
    if(fresh){World.add(fresh);toast(`🎨 رسمت شيئاً جديداً! 💎 +${D(fresh)}`);}
    const ph=list.map(phraseOf);bubble(`Here ${list.length>1||list[0].k>1?'are':'is'} ${ph.join(' and ')}!`,`رسمت لك ما قلت! ${D(Object.keys(T.drew).length)} من ${D(Object.keys(PNOUNS).length)} شيئاً في دفتري.`);}
  function checkTarget(list){let good=0,hint=null;
    list.forEach(it=>{const t=tgt.find(t=>!t.done&&t.n===it.n);
      if(!t){const any=tgt.find(x=>x.n===it.n);addItem(it,{temp:now+2.2});if(!hint)hint=any?['You already have that one!','رسمت هذا من قبل!']:[`I don't see a ${it.n} in the picture.`,`لا أرى ${NOUNAR[it.n]} في اللوحة.`];return;}
      const c=it.c||null,k=it.k,z=it.z||null;
      if(t.c&&c!==t.c){addItem(it,{temp:now+2.2});if(!hint)hint=c?['Look at the color!','انظر إلى اللون جيداً! 🎨']:['Say the color too!','قل اللون أيضاً! 🎨'];return;}
      if(t.k>1&&!it.said.k){addItem(it,{temp:now+2.2});if(!hint)hint=['How many? Say the number too!','كم عددها؟ قل الرقم أيضاً! 🔢'];return;}
      if(k!==t.k){addItem(it,{temp:now+2.2});if(!hint)hint=['Count again!','عُدّها مرة أخرى! 🔢'];return;}
      if((t.z||null)!==z){addItem(it,{temp:now+2.2});if(!hint)hint=t.z?['Is it big or small?','هل هو كبير أم صغير؟ 🔍']:['Not big, not small. Just the normal size!','ليس كبيراً ولا صغيراً. حجمه عادي!'];return;}
      t.done=true;good++;addItem(t);});
    drawTarget();
    if(tgt.every(t=>t.done))return finish();
    if(good)bubble(`Yes! ${list.filter(it=>tgt.some(t=>t.done&&t.n===it.n)).map(phraseOf).join(' and ')}! What else?`,'أحسنت! ماذا أيضاً في اللوحة؟');
    else if(hint)bubble(hint[0],hint[1],true);}
  function finish(){won=true;busy=true;mic.lock(true);FX.confetti();bubble('Wow! The same picture! You are an artist!','واو! نفس اللوحة تماماً! أنت فنان!');
    const n=tgt.length,stars=tries<=n?3:tries<=n+2?2:1;T.paint[li]=Math.max(T.paint[li]||0,stars);tsave();
    setTimeout(()=>{if(!alive)return;const hasNext=li+1<PTARGETS.length;resultOv({title:'🖼️ لوحة رائعة!',stars,gems:stars*3,
      lines:[`🗣️ عدد جملك: ${D(tries)}`,stars<3?'قل كل شيء بجملة واحدة دقيقة لتحصل على ٣ نجوم':'وصف دقيق! 👑'],
      btns:[...(hasNext?[{label:'اللوحة التالية ←',cls:'gold big',fn:()=>go('paint',{i:li+1},false)}]:[]),{label:'🔁 مرة أخرى',cls:'ghost',fn:()=>rerender()},{label:'🏙️ المدينة',cls:'ghost',fn:()=>home()}]});},1700);}
  const mic=micBar($('#mic'),{onText,hint:free?'اضغط 🎤 وقل ماذا أرسم':'اضغط 🎤 وصِف اللوحة',onHelp:()=>{
    if(free)bubble('Try: a big yellow sun!','جرّب أن تقول: a big yellow sun');
    else{const t=tgt.find(t=>!t.done);bubble('Look at the small picture.',`انظر إلى ${NOUNAR[t.n]}: كم عددها؟ وما لونها؟`,true);}}});
  $$('.wc,.cdot').forEach(b=>b.onclick=()=>sayEn(b.dataset.w,{rate:.85}));
  if(free){$('#pundo').onclick=()=>{items.pop();};$('#pclr').onclick=()=>{items=[];};}
  function loop(t){if(!alive)return;const dt=Math.min(.05,(t-last)/1000);last=t;now+=dt;draw();raf=requestAnimationFrame(loop);}
  size();addEventListener('resize',size);if(tgt)drawTarget();
  setTimeout(()=>{if(alive)bubble(free?'Hello! What should I paint today?':'Can you tell me what is in this picture?',free?'أهلاً! ماذا أرسم اليوم؟':'هل تستطيع أن تقول لي ماذا في هذه اللوحة؟');},400);
  raf=requestAnimationFrame(t=>{last=t;loop(t);});
});
