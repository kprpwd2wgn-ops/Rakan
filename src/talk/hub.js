/* ===== المدينة: المباني، قوائم المراحل، كلماتي، الرتب، والقصة ===== */
const sumStars=o=>Object.values(o).reduce((a,b)=>a+b,0);
const MODES={
  maze:{n:MAZES.length,title:'🤖 مختبر روبو',go:i=>go('maze',i),icon:i=>D(i+1),store:()=>T.maze},
  paint:{n:PTARGETS.length,title:'🎨 مرسم الألوان',go:i=>go('paint',{i}),icon:i=>D(i+1),store:()=>T.paint},
  alien:{n:VISITS.length,title:'👽 محطة الفضاء',go:i=>go('alien',i),icon:i=>VISITS[i].sign,store:()=>T.alien},
  studio:{n:SHOWS.length,title:'🎙️ استوديو ليو',go:i=>go('studio',i),icon:i=>SHOWS[i].e,store:()=>T.studio}
};
/* رتب المدينة: تُحسب من كل النجوم */
const TRANKS=[['🐣','زائر جديد',0],['🗣️','متحدّث صغير',12],['🎤','متحدّث واثق',30],['📣','نجم المدينة',55],['🏅','سفير الكلام',85],['🌟','عمدة المدينة',120],['👑','أسطورة الكلام',150]];
const allStarsT=()=>sumStars(T.maze)+sumStars(T.paint)+sumStars(T.alien)+sumStars(T.studio);
const rankIdxT=n=>{let r=0;TRANKS.forEach((x,i)=>{if(n>=x[2])r=i;});return r;};
function rankHTMLT(){const n=allStarsT(),i=rankIdxT(n),R=TRANKS[i],N=TRANKS[i+1];
  return `<button class="rank" id="mrank"><span class="rk-e">${R[0]}</span><span class="rk-t"><b>رتبتك: ${R[1]}</b><span class="bbar dark"><i style="width:${N?Math.round((n-R[2])/(N[2]-R[2])*100):100}%"></i></span>
    <small>${N?`⭐ ${D(n)} · باقي ${D(N[2]-n)} ⭐ لتصبح ${N[1]} ${N[0]}`:`⭐ ${D(n)} · أعلى رتبة في المدينة!`}</small></span></button>`;}
function rankCheckT(){const i=rankIdxT(allStarsT());if(i<=(T.rank||0))return;T.rank=i;tsave();const R=TRANKS[i];sfx('win');
  setTimeout(()=>resultOv({title:'🎖️ ترقية!',big:R[0],lines:[`صرت الآن: <b>${R[1]}</b>`,'كل نجمة تجمعها تقرّبك من الرتبة التالية!'],gems:i*15,btns:[{label:'رائع! 🎤',cls:'gold big',fn:()=>{}}]}),400);}
function ranksOvT(){const n=allStarsT(),cur=rankIdxT(n);const ov=document.createElement('div');ov.className='ov';
  ov.innerHTML=`<div class="res"><h2>🎖️ رتب المدينة</h2><p class="muted">اجمع النجوم في كل المباني لترتفع رتبتك.</p>
    <div class="rklist">${TRANKS.map((r,i)=>`<div class="rkrow ${i===cur?'on':''} ${i>cur?'lock':''}"><span>${r[0]}</span><b>${r[1]}</b><small>⭐ ${D(r[2])}</small></div>`).join('')}</div>
    <div class="btns"><button class="btn gold" id="rkok">حسناً</button></div></div>`;
  document.body.appendChild(ov);$('#rkok',ov).onclick=()=>ov.remove();}

def('hub',()=>{
  setTitle('',false);const words=Object.keys(T.words).length;
  const card=(k,cls,pic,h,p)=>{const M=MODES[k],st=M.store(),done=Object.keys(st).length;
    return `<button class="bld ${cls}" data-k="${k}"><div class="bpic">${pic}</div><div class="btx"><h3>${h}</h3><p>${p}</p>
      <span class="bprog"><span class="bbar"><i style="width:${done/M.n*100}%"></i></span>${D(done)}/${D(M.n)} · ⭐ ${D(sumStars(st))}</span></div></button>`;};
  $('#view').innerHTML=`
   <section class="mtop"><button class="mhero" id="mh" aria-label="بطلي"><div class="bob">${heroSVG(World.p.hero,{face:'happy',pose:'cheer'})}</div></button>
     <div class="mtxt"><h1>أهلاً يا ${esc(World.p.name||'بطل')}!</h1><p>في مدينة الكلام، صوتك يحرّك كل شيء! 🎤</p>
       <div class="row"><button class="chipbtn" id="mw">📚 كلماتي ${D(words)}</button>${dailyChestReady()?'<button class="chipbtn gold" id="mday">🎁 صندوق اليوم</button>':''}<button class="chipbtn" id="mshop">👕 المتجر</button>${sfxToggleHTML()}</div></div></section>
   ${micState==='none'||micState==='embedded'?`<div class="micnote">🎤 <b>تكلّم بصوتك:</b> ${micState==='none'?(IOS?'افتح رابط اللعبة في Safari':'افتح رابط اللعبة في Google Chrome')+'، فهناك يفهم الكلام.':'افتح اللعبة من رابط GitHub، فهناك يعمل الميكروفون.'} وهنا يمكنك أن تكتب بالإنجليزية ⌨️.<div class="linkbox"><span class="en">${APP.gh}</span><button class="btn sm" data-copy>📋 نسخ</button><a class="btn sm ok" href="${APP.gh}" target="_blank" rel="noopener">افتح ↗</a></div></div>`:''}
   ${rankHTMLT()}
   <div class="town">
     ${card('maze','b-robo',roboSVG('happy'),'مختبر روبو','قُد روبو في المتاهة بأوامر من صوتك')}
     ${card('paint','b-paint',brushSVG('#f472b6'),'مرسم الألوان','صِف ما تريد، والسيد فرشاة يرسمه!')}
     ${card('alien','b-space',zibSVG({col:T.zcol||'#a3e635'}),'محطة الفضاء','ليو من كوكب زووم يسألك عن الأرض')}
     ${card('studio','b-studio',`<div class="bstud">${zibSVG({col:'#fb7185',mood:'laugh'})}<span>🎙️</span></div>`,'استوديو ليو','أنت المذيع! اسأل ليو أسئلتك بالإنجليزية')}
   </div>
   <p class="muted small cen">⭐ تكلّمت بالإنجليزية · ⭐⭐ فهمتك اللعبة · ⭐⭐⭐ بجملة كاملة</p>`;
  $$('.bld').forEach(b=>b.onclick=()=>{sfx('whoosh');go('levels',b.dataset.k);});
  $('#mh').onclick=()=>go('closet');$('#mshop').onclick=()=>go('closet','hat');$('#mw').onclick=()=>go('words');$('#mrank').onclick=ranksOvT;bindSfxToggle();
  if($('#mday'))$('#mday').onclick=()=>claimDaily(()=>rerender());
  rankCheckT();
},{home:true});

def('levels',k=>{
  const M=MODES[k],st=M.store();setTitle(M.title);
  const next=(()=>{for(let i=0;i<M.n;i++)if(!st[i])return i;return 0;})();
  $('#view').innerHTML=`${k==='paint'?`<div class="row prow"><button class="btn big gold" id="free">🖌️ الرسم الحر</button><button class="btn big ghost" id="gal">🖼️ معرضي ${D(T.gal.length)}</button></div><h3 class="sec">🖼️ تحدّي: انسخ اللوحة</h3>`:''}
    ${k==='alien'?'<p class="muted lead">في كل زيارة يسألك ليو أسئلة. أجب بجملة كاملة لتحصل على ٣ نجوم، وشاهد ماذا يحدث له!</p>':''}
    ${k==='studio'?'<p class="muted lead">أنت المذيع اليوم! 🎙️ في كل حلقة تقرأ ماذا تسأل بالعربية، ثم تسأل ليو بالإنجليزية بنفسك. السؤال الكامل = ٣ نجوم.</p>':''}
    ${k==='maze'?'<p class="muted lead">قل لروبو إلى أين يذهب: up, down, left, right. أقل عدد من الأوامر = نجوم أكثر!</p>':''}
    <div class="lvls">${[...Array(M.n)].map((_,i)=>{const s=st[i]||0,un=i===0||st[i-1]||st[i];
      return `<button class="lv ${s?'done':''} ${i===next?'here':''}" data-i="${i}" ${un?'':'disabled'}><span class="lvi">${un?M.icon(i):'🔒'}</span>${k==='alien'?`<span class="lvt">${VISITS[i].ar}</span>`:k==='studio'?`<span class="lvt">${SHOWS[i].ar}</span>`:''}${starsHTML(s)}</button>`;}).join('')}</div>`;
  $$('.lv').forEach(b=>b.onclick=()=>{sfx('tap');M.go(+b.dataset.i);});
  if($('#free'))$('#free').onclick=()=>go('paint',{free:true});
  if($('#gal'))$('#gal').onclick=()=>go('gallery');
});

/* ---------- كلماتي: مرتّبة في مجموعات، مع صورة ومعنى ---------- */
const TAR=Object.assign({},COLAR,NOUNAR,{up:'أعلى',down:'أسفل',left:'يسار',right:'يمين',go:'اذهب',pick:'التقط','pick up':'التقط',key:'مفتاح',open:'افتح',door:'باب',and:'و',
  one:'واحد',two:'اثنان',three:'ثلاثة',four:'أربعة',five:'خمسة',six:'ستة',seven:'سبعة',eight:'ثمانية',nine:'تسعة',ten:'عشرة',big:'كبير',small:'صغير',
  what:'ماذا / ما',where:'أين',when:'متى',who:'مَن',how:'كيف',why:'لماذا',you:'أنت',your:'ـك',my:'ـي',name:'اسم',like:'يحب',love:'يحب كثيراً',favorite:'المفضّل',have:'عنده',can:'يستطيع',eat:'يأكل',drink:'يشرب',
  yes:'نعم',no:'لا',please:'من فضلك',thank:'شكراً',thanks:'شكراً',hello:'مرحباً',hi:'أهلاً',bye:'مع السلامة',goodbye:'مع السلامة',
  lion:'أسد',elephant:'فيل',monkey:'قرد',giraffe:'زرافة',horse:'حصان',rabbit:'أرنب',camel:'جمل',panda:'باندا',penguin:'بطريق',duck:'بطة',owl:'بومة',turtle:'سلحفاة',frog:'ضفدع',shark:'قرش',dolphin:'دلفين',
  pizza:'بيتزا',burger:'برغر',rice:'أرز',cake:'كعكة',cookie:'بسكويتة',bread:'خبز',cheese:'جبن',banana:'موز',orange:'برتقالي / برتقال',water:'ماء',juice:'عصير',milk:'حليب',tea:'شاي',
  mom:'أمي',dad:'أبي',brother:'أخ',sister:'أخت',grandma:'جدّة',grandpa:'جدّ',friend:'صديق',family:'عائلة',football:'كرة القدم',swimming:'سباحة',school:'مدرسة',happy:'سعيد',sad:'حزين',tired:'متعب',
  hot:'حار',cold:'بارد',sunny:'مشمس',rainy:'ممطر',winter:'الشتاء',summer:'الصيف',jacket:'سترة',book:'كتاب',books:'كتب',pencil:'قلم رصاص'});
const WGROUPS=[['🎨','ألوان','colors'],['🐾','حيوانات','animals'],['🍕','طعام وشراب','foods,drinks'],['⚽','ألعاب وهوايات','games,activity,toys'],['👨‍👩‍👧','العائلة','family'],['🔢','أرقام','num'],['🌦️','الطقس والملابس','weather,seasons,clothes'],
  ['🤖','أوامر روبو',null,'up down left right go pick key open door and'],['❓','كلمات الأسئلة',null,'what where when who how why you your can have like love favorite name']];
def('words',()=>{
  setTitle('📚 كلماتي');const ws=Object.entries(T.words).sort((a,b)=>b[1]-a[1]);const n=ws.length;
  const goals=[10,25,50,100,200,400],g=goals.find(x=>x>n)||n;const used=new Set();
  const inCat=(w,cats)=>cats.split(',').some(c=>(CATS[c]||'').split('|').includes(w));
  const groups=WGROUPS.map(([e,ar,cats,list])=>{const items=ws.filter(([w])=>!used.has(w)&&(cats?inCat(w,cats):list.split(' ').includes(w)));items.forEach(([w])=>used.add(w));return[e,ar,items];});
  groups.push(['✨','كلمات أخرى',ws.filter(([w])=>!used.has(w))]);
  const chip=([w,c])=>`<button class="wchip" data-w="${esc(w)}">${EMO[w]?`<span>${EMO[w]}</span>`:''}<b class="en">${esc(w)}</b>${TAR[w]?`<small>${esc(TAR[w])}</small>`:''}${c>2?`<i>×${D(c)}</i>`:''}</button>`;
  $('#view').innerHTML=`<div class="wtop"><b>${D(n)}</b><span>كلمة إنجليزية قلتها في المدينة!<small>الهدف التالي: ${D(g)} كلمة 🏆</small></span></div>
    <div class="bar"><i style="width:${Math.min(100,n/g*100)}%"></i></div>
    <div class="row cen" style="margin:8px 0"><span class="chipbtn">🎤 جمل بصوتك: ${D(T.spoken)}</span><span class="chipbtn">🗣️ جمل كاملة: ${D(T.full)}</span></div>
    ${n?groups.filter(x=>x[2].length).map(([e,ar,items])=>`<h3 class="sec">${e} ${ar} <small class="muted">${D(items.length)}</small></h3><div class="wchips">${items.map(chip).join('')}</div>`).join('')
      :'<p class="muted cen">لم تقل أي كلمة بعد. اذهب إلى روبو أو ليو وتكلّم! 🎤</p>'}
    <p class="muted small cen" style="margin-top:10px">اضغط أي كلمة لتسمعها.</p>`;
  $$('.wchip').forEach(b=>b.onclick=()=>{sfx('tap');sayEn(b.dataset.w,{rate:.8});shake(b,'pop');});
});

function introComic(done){
  const ov=document.createElement('div');ov.className='ov';let i=0;
  const P=[[roboSVG('happy'),'أهلاً بك في مدينة الكلام!','هنا صوتك يحرّك كل شيء: تكلّم بالإنجليزية، وشاهد ما يحدث!','Welcome to Talk Town! Here, your voice moves everything. Speak in English, and see what happens!'],
    [zibSVG({mood:'laugh'}),'أصدقاء ينتظرونك','روبو يمشي بأوامرك، والسيد فرشاة يرسم ما تقول، وليو الفضائي يسألك… وفي استوديو ليو أنت المذيع وتسأله أنت!','Your friends are waiting. Robo walks when you tell him. Mister Brush paints what you say. Leo the alien asks you questions, and in his studio, you ask him!'],
    [`<div class="cbig">🎤</div>`,'اضغط الميكروفون وتكلّم','لا توجد جمل لتختارها. قل ما تريد بنفسك! وإذا لم يعمل الميكروفون، اكتب بالإنجليزية ⌨️.','Tap the microphone and talk. Say what you want, all by yourself! If the microphone does not work, you can type in English.']];
  const draw=()=>{const p=P[i];ov.innerHTML=`<div class="res comic"><div class="cpic">${p[0]}</div><h2>${p[1]}</h2><p class="ctext">${p[2]}</p>
    <div class="dots">${P.map((_,k)=>`<i class="${k===i?'on':''}"></i>`).join('')}</div><button class="btn big wide gold" id="cn">${i<P.length-1?'التالي ←':'🎤 لنبدأ!'}</button></div>`;
    guide(p[1]+'. '+p[2],p[3],{arclip:'intro-'+(i+1)});
    $('#cn',ov).onclick=()=>{if(i<P.length-1){i++;draw();}else{T.intro=true;tsave();ov.remove();stopSpeak();done();}};};
  document.body.appendChild(ov);draw();
}
