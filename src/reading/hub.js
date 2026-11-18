/* ===== المجرّة: الكواكب الخمسة، قوائم المراحل، الرتب، والقصة ===== */
const sumS=o=>Object.values(o).reduce((a,b)=>a+(+b||0),0);
const RMODES={
  mon:{n:MLEVELS.length,title:'👾 كوكب الوحوش',go:i=>go('monsters',i),icon:i=>MLEVELS[i].t,sub:i=>MLEVELS[i].ar,store:()=>RS.mon},
  pics:{n:P_LV.length,title:'📸 كوكب الصور',go:i=>go('pics',i),icon:i=>P_LV[i].e,sub:i=>P_LV[i].ar,store:()=>RS.pics},
  cases:{n:CASES.length,title:'🕵️ مكتب المحقق',go:i=>go('case',i),icon:i=>CASES[i].loot,sub:i=>`القضية ${D(i+1)}`,store:()=>RS.cases},
  rooms:{n:ROOMS.length,title:'🔐 سفينة الألغاز',go:i=>go('room',i),icon:i=>ROOMS[i].e||'🚪',sub:i=>ROOMS[i].ar,store:()=>RS.rooms},
  tales:{n:TALES.length,title:'📖 مجرّة القصص',go:i=>go('tale',i),icon:i=>TALES[i].e,sub:i=>TALES[i].ar,store:()=>RS.stories,free:true}
};
const endsOf=i=>Object.values(TALES[i].pages).filter(p=>p.end).length;
const allEnds=()=>TALES.reduce((a,_,i)=>a+endsOf(i),0);
/* رتب رواد الفضاء: تُحسب من كل النجوم */
const RRANKS=[['🧑‍🚀','طالب فضاء',0],['🛰️','مستكشف',12],['🚀','طيّار',30],['🌙','ملّاح القمر',55],['🪐','قائد الكواكب',85],['🌟','قائد المجرّة',120],['👑','أسطورة الفضاء',155]];
const allStars=()=>sumS(RS.mon)+sumS(RS.pics)+sumS(RS.cases)+sumS(RS.rooms)+sumS(RS.stories);
const rankIdx=n=>{let r=0;RRANKS.forEach((x,i)=>{if(n>=x[2])r=i;});return r;};
function rankHTML(){const n=allStars(),i=rankIdx(n),R=RRANKS[i],N=RRANKS[i+1];
  return `<button class="rank" id="mrank"><span class="rk-e">${R[0]}</span><span class="rk-t"><b>رتبتك: ${R[1]}</b><span class="bbar dark"><i style="width:${N?Math.round((n-R[2])/(N[2]-R[2])*100):100}%"></i></span>
    <small>${N?`⭐ ${D(n)} · باقي ${D(N[2]-n)} ⭐ لتصبح ${N[1]} ${N[0]}`:`⭐ ${D(n)} · أعلى رتبة في المجرّة!`}</small></span></button>`;}
function rankCheck(){const i=rankIdx(allStars());if(i<=(RS.rank||0))return;RS.rank=i;rsave();const R=RRANKS[i];sfx('win');
  setTimeout(()=>resultOv({title:'🎖️ ترقية!',big:R[0],lines:[`صرت الآن: <b>${R[1]}</b>`,'كل نجمة تجمعها تقرّبك من الرتبة التالية!'],gems:i*15,btns:[{label:'رائع! 🚀',cls:'gold big',fn:()=>{}}]}),400);}
function ranksOv(){const n=allStars(),cur=rankIdx(n);const ov=document.createElement('div');ov.className='ov';
  ov.innerHTML=`<div class="res"><h2>🎖️ رتب رواد الفضاء</h2><p class="muted">اجمع النجوم في كل الكواكب لترتفع رتبتك.</p>
    <div class="rklist">${RRANKS.map((r,i)=>`<div class="rkrow ${i===cur?'on':''} ${i>cur?'lock':''}"><span>${r[0]}</span><b>${r[1]}</b><small>⭐ ${D(r[2])}</small></div>`).join('')}</div>
    <div class="btns"><button class="btn gold" id="rkok">حسناً</button></div></div>`;
  document.body.appendChild(ov);$('#rkok',ov).onclick=()=>ov.remove();}

def('hub',()=>{
  setTitle('',false);
  const card=(k,cls,pic,h,p)=>{const M=RMODES[k],st=M.store(),done=Object.keys(st).length;
    const prog=k==='tales'?`${D(Object.keys(RS.ends).length)}/${D(allEnds())} نهاية`:`${D(done)}/${D(M.n)} · ⭐ ${D(sumS(st))}`;
    return `<button class="planet ${cls}" data-k="${k}"><div class="ppic">${pic}</div><div class="ptxt"><h3>${h}</h3><p>${p}</p><span class="pprog"><span class="bbar"><i style="width:${(k==='tales'?Object.keys(RS.ends).length/allEnds():done/M.n)*100}%"></i></span>${prog}</span></div></button>`;};
  const nw=Object.keys(Object.assign({},RS.words,RS.zap)).length;
  $('#view').innerHTML=`
   <section class="mtop"><button class="mhero" id="mh" aria-label="بطلي"><div class="bob">${heroSVG(World.p.hero,{face:'happy',pose:'cheer'})}</div></button>
     <div class="mtxt"><h1>أهلاً أيها القارئ ${esc(World.p.name||'')}!</h1><p>كل مهمة في الفضاء تحتاج إلى قارئ ذكي. 🚀</p>
       <div class="row">${dailyChestReady()?'<button class="chipbtn gold" id="mday">🎁 صندوق اليوم</button>':''}<button class="chipbtn" id="mbook">📚 كلماتي ${D(nw)}</button><button class="chipbtn" id="mshop">👕 المتجر</button>${sfxToggleHTML()}</div></div></section>
   ${rankHTML()}
   <div class="galaxy">
     ${card('mon','p-mon',`<canvas class="mcv" width="120" height="120"></canvas>`,'كوكب الوحوش','اقرأ الكلمة واضرب الوحش الصحيح!')}
     ${card('pics','p-pic',`<canvas class="pcv" width="120" height="120"></canvas>`,'كوكب الصور','اقرأ الجملة واختر الصورة المطابقة!')}
     ${card('cases','p-case',suspectSVG({col:'green',eyes:3,hat:'hat',gl:true,ant:2,item:'none',big:true}),'مكتب المحقق','اقرأ الأدلة، واكتشف اللص!')}
     ${card('rooms','p-room','<div class="pemo">🔐</div>','سفينة الألغاز','اقرأ الرسائل لتجد المفتاح وتهرب!')}
     ${card('tales','p-tale','<div class="pemo">📖</div>','مجرّة القصص','اقرأ واختر طريقك. كم نهاية ستكتشف؟')}
   </div>
   <p class="muted small cen">💡 اضغط أي كلمة إنجليزية لتعرف معناها وتسمعها.</p>`;
  $$('.mcv').forEach(c=>{const x=c.getContext('2d');drawWordMonster(x,60,64,96,'#a78bfa','cat','idle',0,0);});
  $$('.pcv').forEach(c=>{const x=c.getContext('2d');x.save();x.beginPath();x.arc(60,60,58,0,7);x.clip();drawSpec(x,120,120,{t:'rel',m:{n:'cat',k:1},r:'in',b:'box'});x.restore();});
  $$('.planet').forEach(b=>b.onclick=()=>{sfx('whoosh');go('rlevels',b.dataset.k);});
  $('#mh').onclick=()=>go('closet');$('#mshop').onclick=()=>go('closet','hat');$('#mbook').onclick=()=>go('book');$('#mrank').onclick=ranksOv;bindSfxToggle();
  if($('#mday'))$('#mday').onclick=()=>claimDaily(()=>rerender());
  rankCheck();
},{home:true});

def('rlevels',k=>{
  const M=RMODES[k],st=M.store();setTitle(M.title);
  const next=(()=>{for(let i=0;i<M.n;i++)if(!st[i])return i;return 0;})();
  $('#view').innerHTML=`<p class="muted lead">${{mon:'وحوش تحمل كلمات متشابهة. اقرأ بدقة واضرب الوحش الذي يطابق الصورة أو الصوت!',pics:'اقرأ الجملة جيداً، ثم اختر الصورة التي تطابقها تماماً. انتبه للون والعدد والمكان!',cases:'في كل قضية سرقة، اقرأ الأدلة واحداً واحداً، واشطب من لا يطابقها حتى يبقى اللص.',rooms:'أنت محبوس في غرفة! اقرأ كل رسالة واضغط المكان الذي تقوله.',tales:'قصص قصيرة. في كل قصة تختار ماذا يحدث. هل تكتشف كل النهايات؟'}[k]}</p>
    <div class="lvls">${[...Array(M.n)].map((_,i)=>{const s=st[i]||0,un=M.free||i===0||st[i-1]||st[i];
      const extra=k==='tales'?`<span class="lvt">${D(Object.keys(RS.ends).filter(e=>e.startsWith(i+':')).length)}/${D(endsOf(i))} نهاية</span>`:starsHTML(s);
      return `<button class="lv ${s?'done':''} ${!M.free&&i===next?'here':''}" data-i="${i}" ${un?'':'disabled'}><span class="lvi ${k==='mon'?'en':''}">${un?M.icon(i):'🔒'}</span><span class="lvt">${M.sub(i)}</span>${extra}</button>`;}).join('')}</div>`;
  $$('.lv').forEach(b=>b.onclick=()=>{sfx('tap');M.go(+b.dataset.i);});
});

function introComic(done){
  const ov=document.createElement('div');ov.className='ov';let i=0;
  const P=[['<div class="cbig">🚀</div>','أهلاً بك في صاروخ القراءة!','في الفضاء مهمات كثيرة، وكل مهمة تحتاج إلى قارئ ذكي مثلك.','Welcome to Reading Rocket! There are many missions in space, and every mission needs a smart reader like you.'],
    ['<div class="cbig">👾📸🕵️</div>','اقرأ لتنتصر','اضرب وحوش الكلمات، واختر الصورة التي تطابق الجملة، واقرأ أدلة المحقق لتكشف اللص، واقرأ الرسائل لتهرب من الغرف.','Read to win! Zap the word monsters, find the right picture, read the clues to catch the thief, and read the notes to escape from the rooms.'],
    ['<div class="cbig">👆</div>','كلمة صعبة؟','اضغط أي كلمة إنجليزية، فتسمعها وتعرف معناها بالعربية. وكل كلمة تدخل دفتر كلماتك 📚','A hard word? Tap any English word to hear it, and see what it means in Arabic.']];
  const draw=()=>{const p=P[i];ov.innerHTML=`<div class="res comic">${p[0]}<h2>${p[1]}</h2><p class="ctext">${p[2]}</p>
    <div class="dots">${P.map((_,k)=>`<i class="${k===i?'on':''}"></i>`).join('')}</div><button class="btn big wide gold" id="cn">${i<P.length-1?'التالي ←':'🚀 لننطلق!'}</button></div>`;
    guide(p[1]+'. '+p[2],p[3],{arclip:'intro-'+(i+1)});
    $('#cn',ov).onclick=()=>{if(i<P.length-1){i++;draw();}else{RS.intro=true;rsave();ov.remove();stopSpeak();done();}};};
  document.body.appendChild(ov);draw();
}
