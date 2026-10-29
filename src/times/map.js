/* ===== الخريطة، عش التنانين، صفحة التنين ===== */
def('map',()=>{
  setTitle('',false);
  const ci=currentNode(),cn=NODES[ci],cl=LANDS[cn.li],hatched=Object.keys(G.eggs).length;
  const towerOpen=unlockedTables().length>=4;
  $('#view').innerHTML=`
   <section class="mtop">
     <button class="mhero" id="mh" aria-label="بطلي"><div class="bob">${heroSVG(World.p.hero,{face:'happy',pose:'cheer'})}</div></button>
     <div class="mtxt"><h1>أهلاً يا ${esc(World.p.name||'البطل')}!</h1><p>الوحوش اللطيفة تهاجم القلعة، وسحرك هو الضرب! 🏰</p>
       <div class="row"><button class="chipbtn" id="mnest">🐉 تنانيني ${D(hatched)}/${D(12)}</button>${dailyChestReady()?'<button class="chipbtn gold" id="mday">🎁 صندوق اليوم</button>':''}<button class="chipbtn" id="mshop">👕 المتجر</button></div></div>
   </section>
   <button class="btn big wide gold playbtn" id="mplay">▶ العب: ${cl.name} <span class="pnode">${cn.kind==='boss'?'👑':cn.kind==='tutorial'?'🎓':cn.kind==='b2'?'🛡️':'⚔️'}</span></button>
   <div class="lands">${LANDS.map((l,li)=>{const nodes=NODES.map((n,i)=>[n,i]).filter(([n])=>n.li===li),locked=!nodeUnlocked(nodes[0][1]);
     return `<section class="land ${locked?'locked':''}" style="--lc:${l.col}">
       <div class="lban">${monCV(l.mon,l.col,54)}<div class="lname"><h3>${l.name}</h3><span class="lt">جدول ×${D(l.t)}</span></div>
         <button class="ldr" data-dr="${l.t}" aria-label="تنين جدول ${l.t}">${G.eggs[l.t]?dragonSVG(l.t,dragonStage(l.t)):eggSVG(l.t,{q:false})}</button></div>
       <div class="lnodes">${nodes.map(([n,i])=>{const st=G.stars[n.id]||0,un=nodeUnlocked(i);
         return `<button class="nd ${n.kind} ${st?'done':''} ${i===ci?'here':''} ${un?'':'lock'}" data-i="${i}" ${un?'':'disabled'} aria-label="${n.kind==='boss'?'الزعيم':'معركة'}">
           <span class="ni">${un?(n.kind==='boss'?'👑':n.kind==='tutorial'?'🎓':n.kind==='b2'?'🛡️':'⚔️'):'🔒'}</span>${st?starsHTML(st):''}${i===ci?`<span class="nhere">${heroSVG(World.p.hero,{head:true,face:'happy'})}</span>`:''}</button>`;}).join('')}</div>
     </section>`;}).join('')}
     <section class="land tower ${towerOpen?'':'locked'}" style="--lc:#fbbf24">
       <div class="lban"><span class="tico">🗼</span><div class="lname"><h3>البرج الأخير</h3><span class="lt">كل جداولك معاً · أطول صمود: ${D(G.best||0)} موجة</span></div></div>
       <button class="btn wide ${towerOpen?'gold':'ghost'}" id="mtower" ${towerOpen?'':'disabled'}>${towerOpen?'🗼 ادخل البرج':`🔒 افتح ${D(4)} ممالك أولاً`}</button></section>
   </div>`;
  fillIcons($('#view'));
  const goNode=i=>{const n=NODES[i];if(n.kind==='tutorial'&&!G.intro)return introComic(()=>go('battle',{node:i}));go('battle',{node:i});};
  $('#mplay').onclick=()=>goNode(ci);
  $$('.nd').forEach(b=>b.onclick=()=>goNode(+b.dataset.i));
  $('#mh').onclick=()=>go('closet');$('#mshop').onclick=()=>go('closet','hat');$('#mnest').onclick=()=>go('nest');
  if($('#mday'))$('#mday').onclick=()=>claimDaily(()=>rerender());
  $$('[data-dr]').forEach(b=>b.onclick=()=>{const n=+b.dataset.dr;if(G.eggs[n])go('dragon',n);else toast(`🥚 اهزم زعيم «${LANDS[LAND_OF[n]].name}» ليفقس هذا البيض!`);});
  if(towerOpen)$('#mtower').onclick=()=>go('battle',{endless:true});
  requestAnimationFrame(()=>{const h=$('.nd.here');if(h&&cur&&cur.name==='map'&&$('#view').contains(h))h.scrollIntoView({block:'center'});});
},{home:true});

function introComic(done){
  const ov=document.createElement('div');ov.className='ov';let i=0;
  const P=[['🏰','قلعتك في خطر!','جيوش من الوحوش اللطيفة الشقيّة تقترب من القلعة.'],
    ['👾','تأتي في صفوف وأعمدة','كل جيش مرتّب مثل الشبكة: صفوف وأعمدة. عُدّ الصفوف والأعمدة، ثم اضرب!'],
    ['✨','سحرك يجب أن يكون دقيقاً','اكتب عدد الوحوش بالضبط. أقلّ من اللازم لا يكفي، وأكثر من اللازم يتبدّد في الهواء!'],
    ['🐉','وفي كل مملكة تنين','اهزم زعيم كل مملكة ليفقس تنينها، ويصبح صديقك ويعلّمك أسرار جدوله.']];
  const draw=()=>{const p=P[i];ov.innerHTML=`<div class="res comic"><div class="cbig">${p[0]}</div><h2>${p[1]}</h2><p class="ctext">${p[2]}</p>
    <div class="dots">${P.map((_,k)=>`<i class="${k===i?'on':''}"></i>`).join('')}</div><button class="btn big wide gold" id="cn">${i<P.length-1?'التالي ←':'⚔️ لنبدأ!'}</button></div>`;
    sayAr(p[1]+'. '+p[2]);
    $('#cn',ov).onclick=()=>{if(i<P.length-1){i++;draw();}else{G.intro=true;gsave();ov.remove();stopSpeak();done();}};};
  document.body.appendChild(ov);draw();
}

function hatchOv(n,done){
  const ov=document.createElement('div');ov.className='ov';let taps=0;
  ov.innerHTML=`<div class="res"><h2>بيضة التنين! 🥚</h2><p class="muted">اضغط البيضة لتفقس</p><button class="eggbtn" id="eg">${eggSVG(n)}</button><div id="hr"></div></div>`;
  document.body.appendChild(ov);const eg=$('#eg',ov);
  eg.onclick=()=>{if(taps>=3)return;taps++;shake(eg,'wobble');buzz(30);if(taps===2)eg.innerHTML=eggSVG(n,{crack:true});
    if(taps===3){G.eggs[n]=1;if(!G.comp)G.comp=n;gsave();const[x,y]=centerOf(eg);FX.burst(x,y,{n:50,speed:380});FX.confetti();
      eg.innerHTML=dragonSVG(n,Math.max(1,dragonStage(n)),{cls:'bob'});eg.disabled=true;
      $('#hr',ov).innerHTML=`<p class="hname">${DNAME[n]}، تنين جدول ×${D(n)}، انضم إليك! 🎉</p><p class="muted">قوته السرية: <b>${TABLES[n].secrets[0].t}</b></p>
        <div class="btns"><button class="btn gold" id="hc">🐉 اجعله رفيقي في المعارك</button><button class="btn ghost" id="hk">رائع!</button></div>`;
      sayAr(`${DNAME[n]} انضم إليك!`);
      $('#hc',ov).onclick=()=>{G.comp=n;gsave();ov.remove();done&&done();};$('#hk',ov).onclick=()=>{ov.remove();done&&done();};}};
}

def('nest',()=>{
  setTitle('🐉 عش التنانين');
  $('#view').innerHTML=`<p class="muted lead">كل تنين يكبر كلما أتقنت جدوله أكثر. اضغط تنيناً لتعرف قوته السرية.</p>
   <div class="nest">${LANDS.map(l=>{const st=dragonStage(l.t);return `<button class="nst ${st?'':'egg'} ${G.comp===l.t?'comp':''}" data-n="${l.t}" style="--lc:${l.col}">
     ${G.comp===l.t?'<span class="ctag">رفيقي</span>':''}${st?dragonSVG(l.t,st):eggSVG(l.t)}<b>${st?DNAME[l.t]:'؟؟؟'}</b><span class="lt">×${D(l.t)} · ${['بيضة','صغير','يافع','كبير'][st]}</span></button>`;}).join('')}</div>`;
  $$('.nst').forEach(b=>b.onclick=()=>{const n=+b.dataset.n;if(G.eggs[n])go('dragon',n);else toast(`🥚 اهزم زعيم «${LANDS[LAND_OF[n]].name}» ليفقس`);});
});

def('dragon',n=>{
  const st=dragonStage(n),m=Math.round(tableMastery(n)*12),T=TABLES[n],l=LANDS[LAND_OF[n]];
  setTitle(`${DNAME[n]} · ×${D(n)}`);
  $('#view').innerHTML=`<div class="dpage" style="--lc:${l.col}">
    <div class="dtop"><div class="dbig bob">${dragonSVG(n,st)}</div><div><h2>${DNAME[n]}</h2><p class="lt">تنين جدول ×${D(n)} · ${['','صغير','يافع','كبير'][st]}</p>
      <div class="bar"><i style="width:${m/12*100}%"></i></div><p class="small muted">أتقنت ${D(m)} من ${D(12)} حقيقة. ${st<3?'أتقن المزيد ليكبر!':'وصل إلى أكبر حجم! 👑'}</p></div></div>
    <div class="row cen">${G.comp===n?'<span class="chipbtn on">✓ رفيقي في المعارك</span>':'<button class="btn gold sm" id="dc">🐉 اجعله رفيقي</button>'}<button class="btn sm" id="dp">⚔️ تدريب مع ${DNAME[n]}</button><button class="btn ghost sm" id="dl">📖 الجدول كاملاً</button></div>
    <h3 class="sec">✨ قوته السرية: ${T.nick}</h3>
    ${T.secrets.map(s=>`<div class="secret"><h4>🗝️ ${s.t}</h4><p>${D(s.d)}</p><span class="ex">${D(s.ex)}</span></div>`).join('')}
    <div class="secret fact"><h4>🤔 هل تعلم؟</h4><p>${D(T.fact)}</p></div></div>`;
  if($('#dc'))$('#dc').onclick=()=>{G.comp=n;gsave();toast(`🐉 ${DNAME[n]} سيرافقك!`);rerender();};
  $('#dp').onclick=()=>go('battle',{practice:n});$('#dl').onclick=()=>go('learn',n);
});

def('learn',n=>{
  setTitle(`📖 جدول ×${D(n)}`);const l=LANDS[LAND_OF[n]];let sel=4;
  const draw=()=>{$('#view').innerHTML=`<div style="--lc:${l.col}"><p class="muted lead">اضغط أي سطر لترى الوحوش مرتّبة في صفوف وأعمدة.</p>
    <div class="arrbox"><div class="arr" style="grid-template-columns:repeat(${sel},1fr)">${monCV(l.mon,l.col,30).repeat(n*sel)}</div>
      <p class="arrcap">${D(n)} × ${D(sel)} = <b>${D(n*sel)}</b></p><p class="small">${n===1?'صف واحد':n===2?'صفّان':n<=10?D(n)+' صفوف':D(n)+' صفاً'}، وفي كل صف ${D(sel)}</p></div>
    <div class="trows">${[...Array(12)].map((_,i)=>`<button class="trow ${i+1===sel?'on':''}" data-k="${i+1}"><span>${D(n)} × ${D(i+1)}</span><b>${D(n*(i+1))}</b></button>`).join('')}</div></div>`;
    fillIcons($('#view'));$$('.trow').forEach(b=>b.onclick=()=>{sel=+b.dataset.k;draw();sayAr(`${n} في ${sel} يساوي ${n*sel}`);});};
  draw();
});
