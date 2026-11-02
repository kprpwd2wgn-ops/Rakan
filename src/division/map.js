/* ===== خريطة البحر، الطاقم، صفحة الصديق، الفهم، حوض السفن ===== */
const joinWord=l=>l.fem?'انضمّت':'انضمّ',makeWord=l=>l.fem?'اجعلها':'اجعله';
def('map',()=>{
  setTitle('',false);
  const ci=currentNode(),cn=NODES[ci],cl=ISLANDS[cn.li],joined=ISLANDS.filter(l=>G.crew[l.d]).length;
  const stormOpen=unlockedDivs().length>=4;
  $('#view').innerHTML=`
   <section class="mtop">
     <button class="mhero" id="mh" aria-label="بطلي"><div class="bob">${heroSVG(World.p.hero,{face:'happy',pose:'cheer'})}</div></button>
     <div class="mtxt"><h1>أهلاً يا كابتن${World.p.name?' '+esc(World.p.name):''}!</h1><p>اقسم الكنز بالعدل، واجمع طاقمك من ${D(12)} جزيرة. 🦜</p>
       <div class="row"><button class="chipbtn" id="mcrew">👥 طاقمي ${D(joined)}/${D(12)}</button>${dailyChestReady()?'<button class="chipbtn gold" id="mday">🎁 صندوق اليوم</button>':''}<button class="chipbtn" id="myard">⛵ سفينتي</button><button class="chipbtn" id="mshop">👕 المتجر</button></div></div>
   </section>
   <button class="btn big wide gold playbtn" id="mplay">▶ أبحر: ${cl.name} <span class="pnode">${nodeIcon(cn)}</span></button>
   <div class="sea">${ISLANDS.map((l,li)=>{const nodes=NODES.map((n,i)=>[n,i]).filter(([n])=>n.li===li),locked=!nodeUnlocked(nodes[0][1]),has=G.crew[l.d];
     return `<section class="isl ${locked?'locked':''}" style="--lc:${l.col}">
       <div class="iban"><button class="imate ${has?'':'sil'}" data-m="${l.d}" aria-label="${has?l.mate:'صديق لم ينضم بعد'}">${mateSVG(l.crew,l.col)}</button>
         <div class="iname"><h3>${l.name}</h3><span class="lt">${has?`${l.mate} في طاقمك ✓`:l.d===1?'هنا تبدأ الرحلة':'صديق ينتظرك هنا'}</span></div><span class="idiv">÷${D(l.d)}</span></div>
       <div class="inodes">${nodes.map(([n,i])=>{const st=G.stars[n.id]||0,un=nodeUnlocked(i);
         return `<button class="nd ${n.kind} ${st?'done':''} ${i===ci?'here':''} ${un?'':'lock'}" data-i="${i}" ${un?'':'disabled'} aria-label="${nodeName(n)}">
           <span class="ni">${un?nodeIcon(n):'🔒'}</span><span class="nlab">${nodeName(n)}</span>${st?starsHTML(st):''}${i===ci?`<span class="nship">${shipSVG()}</span>`:''}</button>`;}).join('')}</div>
     </section>`;}).join('')}
     <section class="isl storm ${stormOpen?'':'locked'}" style="--lc:#38bdf8">
       <div class="iban"><span class="tico">🌊</span><div class="iname"><h3>البحر الهائج</h3><span class="lt">كل جزرك معاً · أطول رحلة: ${D(G.best||0)} موجة</span></div></div>
       <button class="btn wide ${stormOpen?'gold':'ghost'}" id="mstorm" ${stormOpen?'':'disabled'}>${stormOpen?'🌊 أبحر في العاصفة':`🔒 افتح ${D(4)} جزر أولاً`}</button></section>
   </div>`;
  const goNode=i=>{const n=NODES[i];if(n.kind==='tutorial'&&!G.intro)return introComic(()=>go('voyage',{node:i}));go('voyage',{node:i});};
  $('#mplay').onclick=()=>goNode(ci);
  $$('.nd').forEach(b=>b.onclick=()=>goNode(+b.dataset.i));
  $('#mh').onclick=()=>go('closet');$('#mshop').onclick=()=>go('closet','hat');$('#mcrew').onclick=()=>go('crew');$('#myard').onclick=()=>go('yard');
  if($('#mday'))$('#mday').onclick=()=>claimDaily(()=>rerender());
  $$('[data-m]').forEach(b=>b.onclick=()=>{const d=+b.dataset.m,l=ISLANDS[ISL_OF[d]];if(G.crew[d])go('mate',d);else toast(l.d===1?'🎓 أكمل الدرس الأول ليبدأ طاقمك!':`🔒 اهزم زعيم «${l.name}» لينضم إليك صديق جديد!`);});
  if(stormOpen)$('#mstorm').onclick=()=>go('voyage',{storm:true});
  requestAnimationFrame(()=>{const h=$('.nd.here');if(h&&cur&&cur.name==='map'&&$('#view').contains(h))h.scrollIntoView({block:'center'});});
},{home:true});

function introComic(done){
  const ov=document.createElement('div');ov.className='ov';let i=0;
  const P=[[shipSVG(),'أنت الآن قبطان سفينة!','طاقمك من القراصنة الطيبين ينتظر أوامرك، والجزر مليئة بالكنوز.','You are a ship captain now! Your crew of kind pirates is waiting for your orders, and the islands are full of treasure.'],
    ['<div class="cbig">💰</div>','القبطان الجيد عادل','عندما نجد كنزاً نقسمه بالتساوي: كل قرصان يأخذ العدد نفسه. وهذه هي القسمة!','A good captain is fair. When we find treasure, we share it equally. Every pirate gets the same number. That is division!'],
    [parrotSVG('happy'),'وأنا كوكو الببغاء!','وإذا بقي في الصندوق شيء لا يكفي للجميع… فهو لي! هههه','And I am Koko the parrot! If something is left in the chest, and there is not enough for everyone, it is mine! Ha ha!'],
    [shanboSVG('smug'),'احذر القبطان شنبو والأخطبوط!','اهزمهم بالقسمة الصحيحة، ليصبح حيوان كل جزيرة صديقاً في طاقمك.','Watch out for Captain Shanbo and the giant octopus! Beat them with the right answers, and the animal of each island will join your crew.']];
  const draw=()=>{const p=P[i];ov.innerHTML=`<div class="res comic"><div class="cpic">${p[0]}</div><h2>${p[1]}</h2><p class="ctext">${p[2]}</p>
    <div class="dots">${P.map((_,k)=>`<i class="${k===i?'on':''}"></i>`).join('')}</div><button class="btn big wide gold" id="cn">${i<P.length-1?'التالي ←':'⚓ لنبحر!'}</button></div>`;
    guide(p[1]+'. '+p[2],p[3]);
    $('#cn',ov).onclick=()=>{if(i<P.length-1){i++;draw();}else{G.intro=true;gsave();ov.remove();stopSpeak();done();}};};
  document.body.appendChild(ov);draw();
}

function joinOv(d,done){
  const l=ISLANDS[ISL_OF[d]],T=DIVS[d];G.crew[d]=1;if(!G.mate)G.mate=d;gsave();
  const ov=document.createElement('div');ov.className='ov';
  ov.innerHTML=`<div class="res"><div class="jpic bob">${mateSVG(l.crew,l.col)}</div><h2>${l.mate} ${joinWord(l)} إلى طاقمك! 🎉</h2>
    <p class="muted">${D(T.why)}</p><p>سرّ القسمة على ${D(d)}: <b>${T.secrets[0].t}</b></p>
    <div class="btns"><button class="btn gold" id="jc">⭐ ${makeWord(l)} رفيقي في الرحلات</button><button class="btn ghost" id="jk">رائع!</button></div></div>`;
  document.body.appendChild(ov);FX.confetti();buzz(40);guide(`${l.mate} ${joinWord(l)} إلى طاقمك!`,`Hooray! ${MATE_EN[d]} the ${l.crew} joined your crew!`);
  $('#jc',ov).onclick=()=>{G.mate=d;gsave();ov.remove();done&&done();};$('#jk',ov).onclick=()=>{ov.remove();done&&done();};
}

def('crew',()=>{
  setTitle('👥 طاقمي');
  $('#view').innerHTML=`<p class="muted lead">في كل جزيرة صديق ينضم إليك حين تهزم زعيمها. اضغط صديقاً لتعرف سرّه.</p>
   <div class="nest">${ISLANDS.map(l=>{const has=G.crew[l.d];return `<button class="nst ${has?'':'egg'} ${G.mate===l.d?'comp':''}" data-n="${l.d}" style="--lc:${l.col}">
     ${G.mate===l.d?'<span class="ctag">رفيقي</span>':''}<span class="${has?'':'sil'}">${mateSVG(l.crew,l.col)}</span><b>${has?l.mate:'؟؟؟'}</b><span class="lt">÷${D(l.d)} · ${has?RANKS[rankOf(l.d)]:'لم ينضمّ بعد'}</span></button>`;}).join('')}</div>`;
  $$('.nst').forEach(b=>b.onclick=()=>{const d=+b.dataset.n;if(G.crew[d])go('mate',d);else toast(`🔒 اهزم زعيم «${ISLANDS[ISL_OF[d]].name}» لينضم إليك`);});
});

def('mate',d=>{
  const l=ISLANDS[ISL_OF[d]],T=DIVS[d],m=mateMastery(d),rk=rankOf(d);
  setTitle(`${l.mate} · ÷${D(d)}`);
  $('#view').innerHTML=`<div class="dpage" style="--lc:${l.col}">
    <div class="dtop"><div class="dbig bob">${mateSVG(l.crew,l.col)}</div><div><h2>${l.mate}</h2><p class="lt">${RANKS[rk]} · القسمة على ${D(d)}</p>
      <div class="bar"><i style="width:${m/12*100}%"></i></div><p class="small muted">أتقنت ${D(m)} من ${D(12)} حقيقة. ${rk<3?'أتقن المزيد لترتفع رتبته!':'وصل إلى أعلى رتبة! 👑'}</p></div></div>
    <p class="why">💡 ${D(T.why)}</p>
    <div class="row cen">${G.mate===d?'<span class="chipbtn on">✓ رفيقي في الرحلات</span>':`<button class="btn gold sm" id="dc">⭐ ${makeWord(l)} رفيقي</button>`}<button class="btn sm" id="dp">⚓ تدريب مع ${l.mate}</button><button class="btn ghost sm" id="dl">📖 افهم القسمة</button></div>
    <h3 class="sec">🗝️ أسرار القسمة على ${D(d)}: ${T.nick}</h3>
    ${T.secrets.map(s=>`<div class="secret"><h4>🗝️ ${s.t}</h4><p>${D(s.d)}</p><span class="ex">${D(s.ex)}</span></div>`).join('')}
    <div class="secret fact"><h4>🤔 هل تعلم؟</h4><p>${D(T.fact)}</p></div></div>`;
  if($('#dc'))$('#dc').onclick=()=>{G.mate=d;gsave();toast(`⭐ ${l.mate} ${l.fem?'سترافقك':'سيرافقك'}!`);rerender();};
  $('#dp').onclick=()=>go('voyage',{practice:d});$('#dl').onclick=()=>go('learn',d);
});

def('learn',d=>{
  const l=ISLANDS[ISL_OF[d]]||ISLANDS[1];let q=3;
  setTitle(`📖 القسمة على ${D(d)}`);
  const draw=()=>{const N=d*q;$('#view').innerHTML=`<div style="--lc:${l.col}"><p class="muted lead">اضغط أي سطر لترى كيف يُقسم الكنز بالعدل.</p>
    <div class="sharebox"><div class="srow">${[...Array(d)].map((_,i)=>`<div class="sp">${pirSVG(i,'happy')}<div class="coins">${'<i></i>'.repeat(q)}</div><b>${D(q)}</b></div>`).join('')}</div>
      <p class="arrcap">${D(N)} ÷ ${D(d)} = <b>${D(q)}</b></p><p class="small">${nn(d,W_PIR,false)}، وكل واحد يأخذ ${D(q)}، لأن ${D(d)} × ${D(q)} = ${D(N)}</p></div>
    <div class="trows">${[...Array(12)].map((_,i)=>`<button class="trow ${i+1===q?'on':''}" data-k="${i+1}"><span>${D(d*(i+1))} ÷ ${D(d)}</span><b>${D(i+1)}</b></button>`).join('')}</div></div>`;
    $$('.trow').forEach(b=>b.onclick=()=>{q=+b.dataset.k;draw();guide(`${d*q} تقسيم ${d} يساوي ${q}`,`${d*q} divided by ${d} is ${q}.`);});};
  draw();
});

def('yard',()=>{
  setTitle('⛵ سفينتي');let tab='sail',sel=null;
  const draw=()=>{const list=tab==='sail'?SAILS:FLAGS,prev=Object.assign({},G.ship);if(sel)prev[tab]=sel;
    const it=sel&&list.find(x=>x[0]===sel),own=it&&G.yard[it[0]],on=it&&G.ship[tab]===it[0];
    $('#view').innerHTML=`<div class="closet">
      <div class="yprev bob">${shipSVG(prev)}</div>
      <div class="ctabs"><button class="ctab ${tab==='sail'?'on':''}" data-t="sail">⛵<span>الأشرعة</span></button><button class="ctab ${tab==='flag'?'on':''}" data-t="flag">🚩<span>الأعلام</span></button></div>
      <div class="items">${list.map(x=>`<button class="item ${sel===x[0]?'sel':''} ${G.ship[tab]===x[0]?'worn':''}" data-i="${x[0]}">
        <div class="ipic">${tab==='sail'?shipSVG(Object.assign({},G.ship,{sail:x[0]})):`<span class="flagpic">${x[3]}</span>`}</div><b>${x[1]}</b>
        <span class="iprice">${G.yard[x[0]]||!x[2]?(G.ship[tab]===x[0]?'✓ عليها الآن':'لك'):`💎 ${D(x[2])}`}</span></button>`).join('')}</div>
      ${it?`<div class="cbar"><span><b>${it[1]}</b> ${own||!it[2]?'':`· 💎 ${D(it[2])}`}</span>${on?'<span class="chipbtn on">✓ عليها الآن</span>':own||!it[2]?'<button class="btn sm ok" id="yuse">استخدمه ✓</button>':`<button class="btn sm" id="ybuy" ${World.p.gems<it[2]?'disabled':''}>${World.p.gems<it[2]?`ينقصك ${D(it[2]-World.p.gems)} 💎`:'اشترِ'}</button>`}</div>`:''}
    </div>`;
    $$('.ctab').forEach(b=>b.onclick=()=>{tab=b.dataset.t;sel=null;draw();});
    $$('.item').forEach(b=>b.onclick=()=>{sel=b.dataset.i;draw();});
    if($('#yuse'))$('#yuse').onclick=()=>{G.ship[tab]=sel;gsave();toast('⛵ سفينتك أجمل الآن!');draw();};
    if($('#ybuy'))$('#ybuy').onclick=()=>{if(World.spend(it[2])){G.yard[sel]=1;G.ship[tab]=sel;gsave();FX.confetti();toast(`🎉 اشتريت: ${it[1]}`);draw();}};
  };
  draw();
});
