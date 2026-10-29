/* ===== المدينة: المباني، قوائم المراحل، كلماتي، والقصة ===== */
const sumStars=o=>Object.values(o).reduce((a,b)=>a+b,0);
const MODES={
  maze:{n:MAZES.length,title:'🤖 مختبر روبو',go:i=>go('maze',i),icon:i=>D(i+1),store:()=>T.maze},
  paint:{n:PTARGETS.length,title:'🎨 مرسم الألوان',go:i=>go('paint',{i}),icon:i=>D(i+1),store:()=>T.paint},
  alien:{n:VISITS.length,title:'👽 محطة الفضاء',go:i=>go('alien',i),icon:i=>VISITS[i].sign,store:()=>T.alien}
};
def('hub',()=>{
  setTitle('',false);const words=Object.keys(T.words).length;
  const card=(k,cls,pic,h,p)=>{const M=MODES[k],st=M.store(),done=Object.keys(st).length;
    return `<button class="bld ${cls}" data-k="${k}"><div class="bpic">${pic}</div><div class="btx"><h3>${h}</h3><p>${p}</p>
      <span class="bprog"><span class="bbar"><i style="width:${done/M.n*100}%"></i></span>${D(done)}/${D(M.n)} · ⭐ ${D(sumStars(st))}</span></div></button>`;};
  $('#view').innerHTML=`
   <section class="mtop"><button class="mhero" id="mh" aria-label="بطلي"><div class="bob">${heroSVG(World.p.hero,{face:'happy',pose:'cheer'})}</div></button>
     <div class="mtxt"><h1>أهلاً يا ${esc(World.p.name||'بطل')}!</h1><p>في مدينة الكلام، صوتك يحرّك كل شيء! 🎤</p>
       <div class="row"><button class="chipbtn" id="mw">📚 كلماتي ${D(words)}</button>${dailyChestReady()?'<button class="chipbtn gold" id="mday">🎁 صندوق اليوم</button>':''}<button class="chipbtn" id="mshop">👕 المتجر</button></div></div></section>
   ${micState==='none'||micState==='embedded'?`<div class="micnote">🎤 <b>تكلّم بصوتك:</b> ${micState==='none'?(IOS?'افتح رابط اللعبة في Safari':'افتح رابط اللعبة في Google Chrome')+'، فهناك يفهم الكلام.':'افتح اللعبة من رابط GitHub، فهناك يعمل الميكروفون.'} وهنا يمكنك أن تكتب بالإنجليزية ⌨️.<div class="linkbox"><span class="en">${APP.gh}</span><button class="btn sm" data-copy>📋 نسخ</button><a class="btn sm ok" href="${APP.gh}" target="_blank" rel="noopener">افتح ↗</a></div></div>`:''}
   <div class="town">
     ${card('maze','b-robo',roboSVG('happy'),'مختبر روبو','قُد روبو في المتاهة بأوامر من صوتك')}
     ${card('paint','b-paint',brushSVG('#f472b6'),'مرسم الألوان','صِف ما تريد، والسيد فرشاة يرسمه!')}
     ${card('alien','b-space',zibSVG({col:T.zcol||'#a3e635'}),'محطة الفضاء','ليو من كوكب زووم يسألك عن الأرض')}
   </div>
   <p class="muted small cen">⭐ تكلّمت بالإنجليزية · ⭐⭐ فهمتك اللعبة · ⭐⭐⭐ بجملة كاملة</p>`;
  $$('.bld').forEach(b=>b.onclick=()=>go('levels',b.dataset.k));
  $('#mh').onclick=()=>go('closet');$('#mshop').onclick=()=>go('closet','hat');$('#mw').onclick=()=>go('words');
  if($('#mday'))$('#mday').onclick=()=>claimDaily(()=>rerender());
},{home:true});

def('levels',k=>{
  const M=MODES[k],st=M.store();setTitle(M.title);
  const next=(()=>{for(let i=0;i<M.n;i++)if(!st[i])return i;return 0;})();
  $('#view').innerHTML=`${k==='paint'?`<button class="btn big wide gold" id="free">🖌️ الرسم الحر: ارسم ما تريد!</button><h3 class="sec">🖼️ تحدّي: انسخ اللوحة</h3>`:''}
    ${k==='alien'?'<p class="muted lead">في كل زيارة يسألك ليو أسئلة. أجب بجملة كاملة لتحصل على ٣ نجوم، وشاهد ماذا يحدث له!</p>':''}
    ${k==='maze'?'<p class="muted lead">قل لروبو إلى أين يذهب: up, down, left, right. أقل عدد من الأوامر = نجوم أكثر!</p>':''}
    <div class="lvls">${[...Array(M.n)].map((_,i)=>{const s=st[i]||0,un=i===0||st[i-1]||st[i];
      return `<button class="lv ${s?'done':''} ${i===next?'here':''}" data-i="${i}" ${un?'':'disabled'}><span class="lvi">${un?M.icon(i):'🔒'}</span>${k==='alien'?`<span class="lvt">${VISITS[i].ar}</span>`:''}${starsHTML(s)}</button>`;}).join('')}</div>`;
  $$('.lv').forEach(b=>b.onclick=()=>M.go(+b.dataset.i));
  if($('#free'))$('#free').onclick=()=>go('paint',{free:true});
});

def('words',()=>{
  setTitle('📚 كلماتي');const ws=Object.entries(T.words).sort((a,b)=>b[1]-a[1]);const n=ws.length;
  const goals=[10,25,50,100,200],g=goals.find(x=>x>n)||n;
  $('#view').innerHTML=`<div class="wtop"><b>${D(n)}</b><span>كلمة إنجليزية قلتها في المدينة!</span></div>
    <div class="bar"><i style="width:${Math.min(100,n/g*100)}%"></i></div><p class="small muted">الهدف التالي: ${D(g)} كلمة 🏆</p>
    <p class="muted small">اضغط أي كلمة لتسمعها.</p>
    <div class="wchips">${ws.length?ws.map(([w,c])=>`<button class="wchip en" data-w="${esc(w)}">${esc(w)}${c>2?' <small>×'+D(c)+'</small>':''}</button>`).join(''):'<p class="muted">لم تقل أي كلمة بعد. اذهب إلى روبو أو ليو وتكلّم! 🎤</p>'}</div>
    <div class="row cen" style="margin-top:12px"><span class="chipbtn">🎤 جمل بصوتك: ${D(T.spoken)}</span><span class="chipbtn">🗣️ جمل كاملة: ${D(T.full)}</span></div>`;
  $$('.wchip').forEach(b=>b.onclick=()=>sayEn(b.dataset.w,{rate:.8}));
});

function introComic(done){
  const ov=document.createElement('div');ov.className='ov';let i=0;
  const P=[[roboSVG('happy'),'أهلاً بك في مدينة الكلام!','هنا صوتك يحرّك كل شيء: تكلّم بالإنجليزية، وشاهد ما يحدث!'],
    [zibSVG({mood:'laugh'}),'أصدقاء ينتظرونك','روبو يمشي بأوامرك، والسيد فرشاة يرسم ما تقول، وليو الفضائي يريد أن يعرف كل شيء عن الأرض.'],
    [`<div class="cbig">🎤</div>`,'اضغط الميكروفون وتكلّم','لا توجد جمل لتختارها. قل ما تريد بنفسك! وإذا لم يعمل الميكروفون، اكتب بالإنجليزية ⌨️.']];
  const draw=()=>{const p=P[i];ov.innerHTML=`<div class="res comic"><div class="cpic">${p[0]}</div><h2>${p[1]}</h2><p class="ctext">${p[2]}</p>
    <div class="dots">${P.map((_,k)=>`<i class="${k===i?'on':''}"></i>`).join('')}</div><button class="btn big wide gold" id="cn">${i<P.length-1?'التالي ←':'🎤 لنبدأ!'}</button></div>`;
    sayAr(p[1]+'. '+p[2]);
    $('#cn',ov).onclick=()=>{if(i<P.length-1){i++;draw();}else{T.intro=true;tsave();ov.remove();stopSpeak();done();}};};
  document.body.appendChild(ov);draw();
}
