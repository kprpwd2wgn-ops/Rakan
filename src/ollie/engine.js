/* ===================== ENGINE (shared by the six parts; the part file above defines PART and LV) ===================== */
/* In every question / conversation row, the first answer is the correct one; options are shuffled on screen. */
const LEVELS=['مبتدئ','مبتدئ متقدم','أساسي','أساسي متقدم','متوسط','متوسط متقدم'];
const GN={match:"طابق الكلمة بالصورة",memory:"لعبة الذاكرة",listen:"اسمع واختر",hide:"الغميضة",tf:"صح أم خطأ؟",pop:"فقاعات الكلمات",fly:"طيران أولي",unscramble:"رتّب الحروف",balloons:"بالونات أولي",search:"البحث عن الكلمات",gap:"الكلمة الناقصة",spell:"اكتب الكلمة",sentence:"رتّب الجملة"};
const GE={match:"🧩",memory:"🃏",listen:"👂",hide:"🌳",tf:"✅",pop:"🫧",fly:"🐥",unscramble:"🔤",balloons:"🎈",search:"🔎",gap:"✏️",spell:"⌨️",sentence:"🧱"};
const GAMES=Object.keys(GN);
const ACTS=[["c","محادثة","Talk with Ollie","chat"],["l","استماع","Listen & answer","ear"],["r","قراءة","Read & answer","book"],["g","لعبة","Game time","game"]];
/* Everything Ollie says outside the lessons. Each line must already be a recorded clip (src/build.py checks). */
/*SAY-START*/
const SAY={
 hello:["Hello!","Hi!","Nice to meet you!","Let's play!"],
 stars:["Try again!","Good try!","Great job!","Excellent!"],
 top:["Excellent!","Congratulations!","Yay!"],
 daily:["Congratulations!","See you tomorrow!"],
 test:"Hello! I am Ollie. Let's learn English together!"
};
/*SAY-END*/
const DAILY_ST=['🦉','🦊','🐬','🦄','🐼','🦁','🐯','🐨','🐙','🦋','🐢','🦜','🐳','🦒','🦓','🐘','🦔','🐿️','🦩','🐧','🦥','🦦','🦕','🚀','🌈','🏆','💎','🪁','🧸','🎯'];

/* ===================== HELPERS ===================== */
const BIRD=(sz=40)=>`<svg width="${sz}" height="${sz}" viewBox="0 0 64 64" aria-hidden="true"><path d="M27 15c-1-6 3-10 8-9-3 2-4 5-3 8z" fill="#F29E1F"/><path d="M33 13c2-5 7-6 10-4-3 1-5 3-6 6z" fill="#F29E1F"/><ellipse cx="31" cy="37" rx="22" ry="20" fill="#FFC23B"/><ellipse cx="33" cy="44" rx="13" ry="10" fill="#FFE7A3"/><path d="M11 36c-6 1-9 6-9 10 6 1 12-2 15-6z" fill="#F29E1F"/><path d="M18 37c3 9 14 12 19 7-4-2-11-9-19-7z" fill="#E8901A"/><circle cx="40" cy="29" r="5" fill="#1A2A3A"/><circle cx="41.8" cy="27.2" r="1.7" fill="#fff"/><path d="M50 31l11 3.5L50 38z" fill="#F0702A"/><circle cx="45" cy="38" r="3.2" fill="#FF8A80" opacity=".55"/><path d="M26 56v5M34 56v5" stroke="#F0702A" stroke-width="2.6" stroke-linecap="round"/></svg>`;
const BUSH=`<svg class="bush-art" viewBox="0 0 100 64" preserveAspectRatio="none" aria-hidden="true"><ellipse cx="50" cy="46" rx="48" ry="20" fill="#1F8F4E"/><circle cx="24" cy="34" r="20" fill="#27A85A"/><circle cx="52" cy="26" r="24" fill="#2DB866"/><circle cx="78" cy="36" r="19" fill="#27A85A"/><ellipse cx="50" cy="58" rx="50" ry="12" fill="#17733C"/><circle cx="38" cy="30" r="3" fill="#FF8A80"/><circle cx="66" cy="40" r="3" fill="#FFE7A3"/></svg>`;
const BALLOON=c=>`<svg viewBox="0 0 30 56" aria-hidden="true"><path d="M15 36c-3 6 3 10 0 19" fill="none" stroke="#8795A1" stroke-width="1.4"/><ellipse cx="15" cy="18" rx="13" ry="17" fill="${c}"/><path d="M12 36h6l-3-4z" fill="${c}"/><ellipse cx="10" cy="11" rx="3" ry="5" fill="#fff" opacity=".45"/></svg>`;
const BCOL=['#DD444A','#2B6FCC','#27A85A','#FFBE2E','#6447D1','#E0702A'];
const app=document.getElementById('app');
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=a=>a[Math.random()*a.length|0];
const wait=ms=>new Promise(r=>setTimeout(r,ms));

/*PURE-START*/
/* No page needed for these: tools/ollie-check.js runs them over every lesson. */
const V=L=>L.vs||(L.vs=L.v.split(';').map(s=>{const[en,ar,em]=s.split('|');return{en,ar,em}}));
const splitS=text=>(String(text).match(/[^.!?]+[.!?]*['"]?/g)||[String(text)]).map(x=>x.trim()).filter(Boolean);
const escRe=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const hasWord=(s,w)=>new RegExp('(^|[^A-Za-z])'+escRe(w)+'(?![A-Za-z])','i').test(s);
/* which of a lesson's words each letter game can use */
const wordsFor={
 unscramble:L=>V(L).filter(v=>/^[a-z]{3,11}$/i.test(v.en)),
 spell:L=>V(L).filter(v=>/^[a-z' ]+$/i.test(v.en)),
 balloons:L=>V(L).filter(v=>/^[a-z][a-z' -]*$/i.test(v.en)&&v.en.length<=14&&v.en.replace(/[^a-z]/gi,'').length>=3),
 search:L=>V(L).filter(v=>/^[a-z]{3,8}$/i.test(v.en))
};
const sentFor=L=>{const all=(L.c||[]).map(c=>c[1]).filter(x=>x.split(' ').length<=14),good=all.filter(x=>x.split(' ').length>=3);return good.length>=2?good:all};
/* Missing-word items: a sentence of the lesson with one word taken out. A lesson word is taken when the
   sentence has one; otherwise its longest ordinary word. `opts` are wrong choices that are not in the sentence. */
const STOP=new Set("the a an and or but is are am was were be been to of in on at for with from by it its this that these those he she we they you i my your his her our their not no yes do does did have has had can will would could should very too so as if then than there here what when where who why how me him them us about into after before because every some many much more most also just only still even".split(' '));
function gapItems(L){
 if(!L.c||!L.l||!L.r)return[];
 const vs=V(L),pool=[...new Set([...L.c.map(c=>c[1]),...splitS(L.l),...splitS(L.r)])].filter(s=>{const n=s.split(' ').length;return n>=4&&n<=16&&!/['"]$/.test(s)});
 const strong=[...new Set(pool.flatMap(s=>(s.match(/[A-Za-z]+/g)||[]).slice(1)).filter(w=>w.length>=4&&w===w.toLowerCase()&&!STOP.has(w)))];
 const voc=[],rest=[];
 for(const s of pool){
  let it=null;
  for(const v of vs){const m=new RegExp('(^|[^A-Za-z])('+escRe(v.en)+')(?![A-Za-z])','i').exec(s);if(!m)continue;
   const opts=vs.filter(x=>x!==v&&!hasWord(s,x.en)).map(x=>x.en);
   if(opts.length>=3){it={s,at:m.index+m[1].length,word:m[2],opts,voc:v.en};break}}
  if(it){voc.push(it);continue}
  const cand=[...s.matchAll(/[A-Za-z]+/g)].filter(m=>m.index>0&&m[0].length>=4&&m[0]===m[0].toLowerCase()&&!STOP.has(m[0])&&s[m.index-1]!=="'"&&s[m.index+m[0].length]!=="'").sort((a,b)=>b[0].length-a[0].length)[0];
  if(!cand)continue;
  const w=cand[0],opts=strong.filter(x=>x!==w&&!hasWord(s,x)&&Math.abs(x.length-w.length)<=3);
  if(opts.length>=3)rest.push({s,at:cand.index,word:w,opts});
 }
 return [...voc,...rest];
}
function canPlay(g,L){switch(g){
 case'unscramble':case'spell':case'balloons':case'search':return wordsFor[g](L).length>=3;
 case'sentence':return sentFor(L).length>=2;
 case'gap':return gapItems(L).length>=4;
 default:return V(L).length>=4}}
/*PURE-END*/

const ctx={l:0,i:0};
const cur=()=>LV[ctx.l].lessons[ctx.i];
const hardMode=()=>PART>1||ctx.l>=2;
const gameOf=(l,i)=>{const g=LV[l].games[i];return canPlay(g,LV[l].lessons[i])?g:'match'};
let RUN=0;
function stopAll(){RUN++;stopVoice()}

const IC={
 back:'<path d="M9 5l7 7-7 7"/>',
 star:'<path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/>',
 chat:'<path d="M4 5h16v11H10l-5 4v-4H4z"/><path d="M8 10h8M8 13h5"/>',
 ear:'<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="5" height="7" rx="2"/><rect x="16" y="14" width="5" height="7" rx="2"/>',
 book:'<path d="M3 5c3-1.3 6-1 9 1 3-2 6-2.3 9-1v14c-3-1.3-6-1-9 1-3-2-6-2.3-9-1z"/><path d="M12 6v14"/>',
 game:'<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10v5M4.5 12.5h5"/><path d="M16 11h.01M18 14h.01"/>',
 spk:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
 crown:'<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>'
};
const icon=(n,fill)=>`<svg class="ico${fill?' fill':''}" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
const starRow=(n,max=3)=>`<span class="stars">${Array.from({length:max},(_,k)=>`<svg class="ico fill${k<n?' on':''}" viewBox="0 0 24 24">${IC.star}</svg>`).join('')}</span>`;
function setLv(lv){const r=document.documentElement.style;if(!lv){r.removeProperty('--lv');r.removeProperty('--lv-deep');r.removeProperty('--lv-soft');return}r.setProperty('--lv',lv.c);r.setProperty('--lv-deep',lv.d);r.setProperty('--lv-soft',lv.s)}
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,2600)}

/* ---------- voice: Ollie's lines recorded ahead of time (Azure, en-US-AvaNeural), one MP3 per sentence or word ---------- */
const VDIR='ollie/voices';
const VO={ctx:null,man:null,load:null,buf:new Map(),tok:0,src:null,done:null,end:null,noise:null,warned:0};
const SPEECH=!!(window.AudioContext||window.webkitAudioContext);
function loadMan(){
 if(VO.man)return Promise.resolve(VO.man);
 if(location.protocol==='file:')return Promise.resolve(null);
 return VO.load||(VO.load=fetch(VDIR+'/part'+PART+'.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(m=>VO.man=m).catch(()=>{VO.load=null;return null}));
}
loadMan();
function unlockSpeech(){
 if(!SPEECH)return;
 try{
  if(!VO.ctx){VO.ctx=new(window.AudioContext||window.webkitAudioContext)();
   /* iPhone: play like a video does, so the silent switch does not mute Ollie */
   try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}}
  if(VO.ctx.state!=='running'&&VO.ctx.state!=='closed')VO.ctx.resume();
 }catch(e){}
}
['pointerdown','touchend','keydown'].forEach(ev=>document.addEventListener(ev,unlockSpeech,{capture:true,passive:true}));
function clipFor(t,slow){const m=VO.man;if(!m)return null;let id=m.s[t]||m.w[t.toLowerCase()]||m.w[t.replace(/[^A-Za-z0-9' -]/g,'').trim().toLowerCase()];
 if(!id)return null;return slow&&m.slow.includes(id)?id+'-slow':id}
function clipBuf(id){
 const hit=VO.buf.get(id);if(hit){VO.buf.delete(id);VO.buf.set(id,hit);return hit}
 const p=fetch(VDIR+'/'+id+'.mp3').then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()})
  .then(a=>new Promise((ok,no)=>{const q=VO.ctx.decodeAudioData(a,ok,no);if(q&&q.then)q.then(ok,no)}));
 p.catch(()=>VO.buf.delete(id));
 VO.buf.set(id,p);
 if(VO.buf.size>70)VO.buf.delete(VO.buf.keys().next().value);   /* keep the newest clips only */
 return p;
}
/* fetch a lesson's clips before they are needed, so Ollie answers at once */
function warm(texts){
 if(!SPEECH)return;
 loadMan().then(m=>{if(!m||!VO.ctx)return;texts.flatMap(splitS).slice(0,40).forEach(t=>{const id=clipFor(t);if(id)clipBuf(id).catch(()=>{})})});
}
function stopVoice(){
 VO.tok++;const s=VO.src,d=VO.done,e=VO.end;VO.src=VO.done=VO.end=null;
 if(s){s.onended=null;try{s.stop()}catch(x){}}
 if(d)d();if(e)e();
}
function playBuf(b){return new Promise(done=>{const s=VO.ctx.createBufferSource();s.buffer=b;s.connect(VO.ctx.destination);
 VO.src=s;VO.done=done;s.onended=()=>{if(VO.src===s){VO.src=null;VO.done=null}done()};s.start()})}
function voiceWarn(){const now=Date.now();if(now-VO.warned<6000)return;VO.warned=now;
 toast(location.protocol==='file:'?'الصوت يعمل عند فتح الصفحة من رابطها على الإنترنت.':'تعذّر تحميل صوت أولي. تأكد من الإنترنت ثم حاول مرة أخرى.')}
/* say(text) plays the text sentence by sentence and resolves when it ends or is interrupted.
   o.rate<.8 picks the slow recording where there is one; o.onPart(k) fires as sentence k starts; o.onEnd() always fires once. */
function say(text,o={}){
 if(!SPEECH){toast('الصوت غير مدعوم في هذا المتصفح. جرّب Safari أو Chrome.');return Promise.resolve(false)}
 unlockSpeech();stopVoice();const tok=VO.tok;VO.end=o.onEnd||null;
 const fin=ok=>{if(tok===VO.tok&&VO.end){const e=VO.end;VO.end=null;e()}return ok};
 return (async()=>{
  const m=await loadMan();if(tok!==VO.tok)return false;
  if(!m||!VO.ctx){voiceWarn();return fin(false)}
  const slow=(o.rate||1)<.8,ids=splitS(text).map(t=>clipFor(t,slow));
  const bufs=ids.map(id=>id?clipBuf(id).catch(()=>null):null);
  let any=false,bad=false;
  for(let k=0;k<ids.length;k++){
   const b=await bufs[k];if(tok!==VO.tok)return false;
   if(!b){if(ids[k])bad=true;continue}
   if(any)await wait(180);if(tok!==VO.tok)return false;
   any=true;if(o.onPart)o.onPart(k);
   await playBuf(b);if(tok!==VO.tok)return false;
  }
  if(!any&&bad)voiceWarn();
  return fin(any);
 })();
}
document.addEventListener('click',e=>{const t=e.target.closest('[data-say]');if(!t)return;
 t.classList.add('speaking');say(t.dataset.say).then(()=>t.classList.remove('speaking'))});

/* ---------- sound effects: short noise bursts (no notes, no tunes) ---------- */
function burst(at,dur,type,freq,q,vol){
 const c=VO.ctx;if(!VO.noise){const n=c.createBuffer(1,c.sampleRate*.5|0,c.sampleRate),d=n.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;VO.noise=n}
 const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();
 s.buffer=VO.noise;f.type=type;f.frequency.value=freq;f.Q.value=q;
 g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(vol,at+.008);g.gain.exponentialRampToValueAtTime(.0001,at+dur);
 s.connect(f);f.connect(g);g.connect(c.destination);s.start(at,Math.random()*.3);s.stop(at+dur+.02);
}
function sfx(kind){
 if(!SPEECH)return;
 try{unlockSpeech();const c=VO.ctx;if(!c||c.state!=='running')return;const t=c.currentTime+.01;
  if(kind==='ok'){burst(t,.045,'bandpass',1500,1.4,1.5);burst(t+.08,.07,'bandpass',2300,1.4,1.3)}   /* two soft clicks */
  else if(kind==='no')burst(t,.2,'lowpass',240,.7,2.8);                                          /* a low thud */
  else if(kind==='tap')burst(t,.035,'bandpass',1700,1,.6);
  else if(kind==='pop')burst(t,.08,'bandpass',800,1.6,2.6);
  else if(kind==='win')for(let k=0;k<14;k++)burst(t+k*.055+Math.random()*.03,.05,'bandpass',1200+Math.random()*1800,1,.7);   /* like clapping */
 }catch(e){}
}
const ding=()=>sfx('ok'),buzz=()=>sfx('no');

/* ---------- progress ---------- */
const KEY='ollie-english-part'+PART;
let P={s:{},all:false,name:'',given:0,x:{},m:{},d:{day:'',streak:0,best:0,n:0}};
try{const raw=localStorage.getItem(KEY);if(raw)P=Object.assign(P,JSON.parse(raw))}catch(e){}
delete P.tr;
if(!P.x||typeof P.x!=='object')P.x={};if(!P.m||typeof P.m!=='object')P.m={};
P.d=Object.assign({day:'',streak:0,best:0,n:0},P.d||{});
function save(){try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}}
let st0;const saveSoon=()=>{clearTimeout(st0);st0=setTimeout(save,700)};
const st=(l,i,a)=>P.s[`${l}-${i}-${a}`]||0;
const lessonDone=(l,i)=>ACTS.every(([a])=>st(l,i,a)>0);
const lessonStars=(l,i)=>ACTS.reduce((t,[a])=>t+st(l,i,a),0);
const bossKey=l=>`${l}-boss`;
const levelUnlocked=l=>P.all||l===0||(P.s[bossKey(l-1)]||0)>0;
const lessonUnlocked=(l,i)=>P.all||(levelUnlocked(l)&&(i===0||lessonDone(l,i-1)));
const bossUnlocked=l=>P.all||LV[l].lessons.every((_,i)=>lessonDone(l,i));
const totalStars=()=>Object.values(P.s).reduce((a,b)=>a+b,0);
const earned=()=>Math.floor(totalStars()/10);
const readyBoard=()=>Math.max(0,earned()-(P.given||0));
const starsFrom=(mis,a,b)=>mis<=a?3:mis<=b?2:1;
const openLessons=()=>LV.flatMap((lv,l)=>lv.lessons.map((L,i)=>({l,i,L}))).filter(x=>lessonUnlocked(x.l,x.i));
const uniq=vs=>{const seen=new Set();return vs.filter(v=>!seen.has(v.en)&&seen.add(v.en))};
const openWords=()=>uniq(openLessons().flatMap(x=>V(x.L)));
/* tricky words: every miss adds a point (up to 3), every right answer takes one away */
const miss=en=>{P.m[en]=Math.min(3,(P.m[en]||0)+1);saveSoon()};
const hit=en=>{if(P.m[en]){if(--P.m[en]<=0)delete P.m[en];saveSoon()}};
const tricky=()=>uniq(LV.flatMap(lv=>lv.lessons.flatMap(V))).filter(v=>P.m[v.en]).sort((a,b)=>P.m[b.en]-P.m[a.en]);
/* daily challenge */
const dayStr=(d=new Date())=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const dayGap=(a,b)=>Math.round((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/864e5);
const doneToday=()=>P.d.day===dayStr();
const streakNow=()=>P.d.day&&dayGap(P.d.day,dayStr())<=1?P.d.streak:0;
const daysAr=n=>n===1?'يوم واحد':n===2?'يومان':n<=10?`${n} أيام`:`${n} يومًا`;

function h(title,back,html){
 app.innerHTML=`<header class="bar">${back?`<button class="iconbtn" id="back" aria-label="رجوع">${icon('back')}</button>`:'<span class="iconbtn ph"></span>'}<div class="bar-t">${title}</div><div class="pill">${icon('star',1)}<span>${totalStars()}</span></div></header>`+html;
 if(back)$('#back').onclick=()=>{stopAll();back()};
 window.scrollTo(0,0);
}

/* ===================== SCREENS ===================== */
function home(){
 stopAll();setLv(null);
 const nm=P.name||'';const hi=nm?`أهلًا يا ${esc(nm)}!`:'أهلًا يا بطل!';
 const sk=streakNow(),dn=doneToday(),tr=tricky().length;
 h('أولي · الجزء '+PART,null,`
 <section class="hero"><button class="owl" id="ollie" aria-label="اضغط على أولي ليكلمك">${BIRD(70)}</button><div><p class="hello">${hi}</p><h1 dir="ltr">I'm Ollie. Let's learn English together!</h1><p class="partb">الجزء ${PART} · المستوى: ${LEVELS[PART-1]}</p><p class="muted">٥ عوالم · ٣٠ درسًا · ١٣ لعبة · ٥ تحديات كبرى</p></div></section>
 <button class="daily ${dn?'done':''}" id="toD"><span class="d-ic">${dn?'✅':'🔥'}</span><span class="d-t"><b>تحدي اليوم</b><small>${dn?'أنجزته اليوم! عُد غدًا لتكبر سلسلتك.':'٨ أسئلة سريعة، وتكسب ملصقًا جديدًا.'}</small></span><span class="d-n"><b>${sk}</b><small>سلسلة الأيام</small></span></button>
 <div class="tiles4">
  <button class="tile4" id="toQ"><span>🎲</span><b>لعبة سريعة</b></button>
  <button class="tile4" id="toA"><span>🏅</span><b>ملصقاتي</b></button>
  <button class="tile4" id="toW"><span>📖</span><b>قاموسي</b>${tr?`<i class="dot" aria-label="كلمات للتدريب">${tr}</i>`:''}</button>
  <button class="tile4" id="toP"><span>👪</span><b>الوالدان</b></button>
 </div>
 ${(()=>{const r=readyBoard(),pts=totalStars()%10;return `<div class="link"><span class="big">${r}</span><div style="flex:1;min-width:0"><b>${r?(r===1?'نجمة جاهزة للوحة النجوم!':'نجوم جاهزة للوحة النجوم!'):'نجوم لوحة البطل'}</b><small>${r?'أرِ أهلك هذه الشاشة ليضعوا لك النجوم في لوحتك. ':''}كل 10 نجوم هنا = نجمة في لوحتك. معك ${pts} من 10 للنجمة التالية.</small><span class="prog sun"><span style="width:${pts*10}%"></span></span></div></div>`})()}
 <div class="worlds">${LV.map((lv,l)=>{
  const un=levelUnlocked(l),done=lv.lessons.filter((_,i)=>lessonDone(l,i)).length,
  s=lv.lessons.reduce((t,_,i)=>t+lessonStars(l,i),0)+(P.s[bossKey(l)]||0),boss=P.s[bossKey(l)]>0;
  return `<button class="world ${un?'':'locked'}" style="--lv:${lv.c};--lv-deep:${lv.d};--lv-soft:${lv.s}" data-l="${l}">
   <span class="w-art">${lv.icon}</span>
   <span class="w-txt"><span class="muted">العالم ${l+1}</span><b>${lv.ar}</b><i dir="ltr">${lv.en}</i>
   <span class="prog"><span style="width:${done/6*100}%"></span></span>
   <small>${done} من 6 دروس · ${s} نجمة${boss?' · فاز بالتحدي 👑':''}</small></span>${un?'':icon('lock')}</button>`}).join('')}</div>
 <nav class="parts" aria-label="أجزاء أولي"><span>أجزاء أولي</span>${LEVELS.map((_,k)=>k+1===PART?`<b aria-current="page">${k+1}</b>`:`<a href="${k+2}.html">${k+1}</a>`).join('')}</nav>`);
 $$('.world').forEach(b=>b.onclick=()=>{const l=+b.dataset.l;if(!levelUnlocked(l))return toast('اهزم تحدي العالم السابق لفتح هذا العالم');ctx.l=l;level()});
 $('#ollie').onclick=()=>{const o=$('#ollie');o.classList.remove('hop');void o.offsetWidth;o.classList.add('hop');say(pick(SAY.hello))};
 $('#toD').onclick=dailyIntro;$('#toQ').onclick=quick;$('#toA').onclick=album;$('#toW').onclick=words;$('#toP').onclick=parents;
}

function level(){
 stopAll();const lv=LV[ctx.l];setLv(lv);
 const bu=bossUnlocked(ctx.l),bs=P.s[bossKey(ctx.l)]||0;
 h(lv.ar,home,`
 <section class="lv-hero"><span class="lv-art">${lv.icon}</span><div><p class="eyebrow">العالم ${ctx.l+1} من 5</p><h1 dir="ltr">${lv.en}</h1><p>${lv.sub}</p></div></section>
 <div class="path">${lv.lessons.map((L,i)=>{const un=lessonUnlocked(ctx.l,i),dn=lessonDone(ctx.l,i);
  return `<button class="node pos${i%4} ${un?'':'locked'} ${dn?'done':''}" data-i="${i}"><span class="disc">${un?i+1:icon('lock')}</span><span class="nlab"><b dir="ltr">${esc(L.en)}</b><small>${esc(L.ar)}</small><span class="nst">${icon('star',1)}${lessonStars(ctx.l,i)} / 12</span></span></button>`}).join('')}
  <button class="node boss pos1 ${bu?'':'locked'} ${bs?'done':''}" id="bossN"><span class="disc">${icon('crown')}</span><span class="nlab"><b>${lv.boss}</b><small>${bu?'سباق مع الوقت بكلمات العالم كله':'أكمل الدروس الستة أولًا'}</small><span class="nst">${starRow(bs)}</span></span></button>
 </div>`);
 $$('.node[data-i]').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(!lessonUnlocked(ctx.l,i))return toast('أكمل الأنشطة الأربعة في الدرس السابق أولًا');ctx.i=i;lesson()});
 $('#bossN').onclick=()=>bu?bossIntro():toast('أكمل الدروس الستة لتفتح التحدي');
}

function lesson(){
 stopAll();const lv=LV[ctx.l],L=cur(),main=gameOf(ctx.l,ctx.i);setLv(lv);
 h(`الدرس ${ctx.i+1}`,level,`
 <div class="les-h"><p class="muted">${lv.ar} · الدرس ${ctx.i+1}</p><h1 dir="ltr">${esc(L.en)}</h1><p>${esc(L.ar)}</p></div>
 <p class="sec-t">كلمات الدرس · اضغط لتسمع</p>
 <div class="vocab">${V(L).map(v=>`<button class="vw" data-say="${esc(v.en)}"><span class="e">${v.em}</span><b>${esc(v.en)}</b><small>${esc(v.ar)}</small></button>`).join('')}</div>
 <p class="sec-t">الأنشطة</p>
 <div class="acts">${ACTS.map(([a,ar,en,ic])=>`<button class="act" data-a="${a}"><span class="ai">${icon(ic)}</span><b>${a==='g'?GN[main]:ar}</b><small>${en}</small>${starRow(st(ctx.l,ctx.i,a))}</button>`).join('')}</div>
 <p class="sec-t">ألعاب أكثر بكلمات هذا الدرس</p>
 <div class="xg">${GAMES.filter(g=>g!==main&&canPlay(g,L)).map(g=>{const s=P.x[`${ctx.l}-${ctx.i}-${g}`]||0;return `<button class="xb" data-g="${g}"><span class="xe">${GE[g]}</span><b>${GN[g]}</b>${s?starRow(s):''}</button>`}).join('')}</div>`);
 $$('.act').forEach(b=>b.onclick=()=>startAct(b.dataset.a));
 $$('.xb').forEach(b=>b.onclick=()=>playX(b.dataset.g,L,lesson,`${ctx.l}-${ctx.i}-${b.dataset.g}`));
 warm([...V(L).map(v=>v.en),...L.c.flatMap(c=>[c[0],c[1]])]);
}

function startAct(a){stopAll();({c:actConv,l:actListen,r:actRead,g:actGame})[a]()}
const actTitle=n=>`${esc(cur().en)} · ${n}`;

/* ---------- conversation ---------- */
function actConv(){
 const L=cur(),token=RUN;let t=0,mis=0;
 h(actTitle('محادثة'),lesson,`<div class="pane"><p class="tip">استمع إلى أولي، اختر الرد الصحيح، ثم قله بصوتك.</p><div class="chat" id="chat" dir="ltr"></div><div class="opts" id="opts" dir="ltr"></div></div>`);
 const chat=$('#chat'),opts=$('#opts');
 function bubble(who,text){const d=document.createElement('div');d.className='bub '+who;
  d.innerHTML=`<span class="av">${who==='bot'?BIRD(36):'🧒'}</span><p>${esc(text)}</p><button class="spk sm" aria-label="استمع" data-say="${esc(text)}">${icon('spk')}</button>`;
  chat.appendChild(d);}
 function turn(){
  if(token!==RUN)return;const[q,...o]=L.c[t];bubble('bot',q);say(q);
  opts.innerHTML=shuffle(o.map((x,k)=>({x,k}))).map(z=>`<button class="opt" data-k="${z.k}">${esc(z.x)}</button>`).join('');
  opts.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{
   if(b.dataset.k==='0'){ding();bubble('kid',o[0]);say(o[0]);
    opts.innerHTML=`<div class="repeat" dir="rtl"><p>🎤 الآن قلها بصوتك:</p><p dir="ltr" style="font-size:19px;font-weight:700">${esc(o[0])}</p><div class="btns"><button class="ghost" data-say="${esc(o[0])}">اسمعها مرة أخرى</button><button class="go" id="nx">${t<L.c.length-1?'قلتها! التالي':'قلتها! إنهاء'}</button></div></div>`;
    opts.scrollIntoView({behavior:'smooth',block:'end'});
    $('#nx').onclick=()=>{t++;t<L.c.length?turn():finish('c',starsFrom(mis,0,1))};
   }else if(!b.classList.contains('wrong')){b.classList.add('wrong');mis++;buzz()}
  });
 }
 turn();
}

/* ---------- shared quiz ---------- */
function quiz(box,qs,onAll){
 let mis=0,left=qs.length;
 box.innerHTML=qs.map(q=>`<div class="q"><div class="q-h" dir="ltr"><button class="spk sm" aria-label="استمع للسؤال" data-say="${esc(q[0])}">${icon('spk')}</button><span>${esc(q[0])}</span></div><div class="q-o" dir="ltr">${shuffle(q.slice(1).map((t,k)=>({t,k}))).map(o=>`<button class="opt" data-k="${o.k}">${esc(o.t)}</button>`).join('')}</div></div>`).join('');
 box.querySelectorAll('.q').forEach(qd=>qd.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{
  if(qd.classList.contains('ok'))return;
  if(b.dataset.k==='0'){b.classList.add('right');qd.classList.add('ok');ding();if(!--left)onAll(mis)}
  else if(!b.classList.contains('wrong')){b.classList.add('wrong');mis++;buzz()}
 }));
}
/* read a passage aloud and light up the sentence being read; `box` holds one .sn span per sentence */
function readAloud(text,box,slow,btn){
 const sn=[...box.querySelectorAll('.sn')];
 if(btn)btn.classList.add('speaking');
 return say(text,{rate:slow?.6:1,onPart:k=>sn.forEach((x,j)=>x.classList.toggle('on',j===k)),
  onEnd:()=>{sn.forEach(x=>x.classList.remove('on'));if(btn)btn.classList.remove('speaking')}});
}

/* ---------- listening ---------- */
function actListen(){
 const L=cur(),token=RUN,hard=hardMode();let shown=false;
 h(actTitle('استماع'),lesson,`<div class="pane">
  <div class="player"><button class="play" id="pl">${icon('spk')}<span>استمع</span></button><button class="ghost" id="slow">🐢 ببطء</button><button class="ghost" id="show">أظهر النص</button></div>
  <p class="tip">${hard?'تحدٍّ: أجب دون إظهار النص لتحصل على 3 نجوم. يمكنك الاستماع مرات كثيرة.':'استمع جيدًا ثم أجب. يمكنك الاستماع أكثر من مرة.'}</p>
  <div class="text" id="tx" dir="ltr" hidden>${splitS(L.l).map(s=>`<span class="sn">${esc(s)}</span>`).join(' ')}</div><div id="qs" class="pane"></div></div>`);
 const tx=$('#tx');
 $('#pl').onclick=()=>readAloud(L.l,tx,false,$('#pl'));$('#slow').onclick=()=>readAloud(L.l,tx,true,$('#slow'));
 $('#show').onclick=()=>{shown=true;tx.hidden=false;$('#show').hidden=true};
 quiz($('#qs'),L.lq,mis=>{let s=starsFrom(mis,0,1);if(hard&&shown)s=Math.min(s,2);setTimeout(()=>token===RUN&&finish('l',s),700)});
 setTimeout(()=>token===RUN&&readAloud(L.l,tx,false,$('#pl')),400);
}

/* ---------- reading ---------- */
function actRead(){
 const L=cur(),token=RUN;
 const words=splitS(L.r).map(s=>`<span class="sn">${s.split(/(\s+)/).map(w=>/^\s+$/.test(w)?w:`<span class="w" data-say="${esc(w.replace(/[^A-Za-z0-9'-]/g,''))}">${esc(w)}</span>`).join('')}</span>`).join(' ');
 h(actTitle('قراءة'),lesson,`<div class="pane">
  <p class="tip">اقرأ القطعة. اضغط على أي كلمة لا تعرفها لتسمعها.</p>
  <div class="text" id="tx" dir="ltr">${words}</div>
  <div class="btns"><button class="ghost" id="rd">🔊 اقرأها لي</button><button class="ghost" id="rs">🐢 ببطء</button></div>
  <div id="qs" class="pane"></div></div>`);
 const tx=$('#tx');
 $('#rd').onclick=()=>readAloud(L.r,tx,false,$('#rd'));$('#rs').onclick=()=>readAloud(L.r,tx,true,$('#rs'));
 quiz($('#qs'),L.rq,mis=>setTimeout(()=>token===RUN&&finish('r',starsFrom(mis,0,1)),700));
 warm([L.r]);
}

/* ---------- games ---------- */
/* runGame draws the frame and starts game `g` with the words of lesson `L`; o = {title, back, done(stars)} */
function runGame(g,L,o){
 stopAll();const token=RUN,t0=Date.now();
 h(o.title,o.back,`<div class="pane"><div class="g-head"><b>${GE[g]} ${GN[g]}</b><span id="gs"></span></div><div id="g" class="pane"></div></div>`);
 if(hardMode()){const iv=setInterval(()=>{if(token!==RUN)return clearInterval(iv);const s=Math.floor((Date.now()-t0)/1000);$('#gs').textContent=`⏱ ${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`},500)}
 warm(V(L).map(v=>v.en));
 GFN[g](L,s=>{if(token===RUN)o.done(s)},token);
}
function actGame(){runGame(gameOf(ctx.l,ctx.i),cur(),{title:actTitle('لعبة'),back:lesson,done:s=>finish('g',s)})}
/* a game outside the four lesson activities: its stars are kept apart (P.x) and do not count for the star board */
function playX(g,L,back,key){runGame(g,L,{title:`${esc(L.en)} · ${GN[g]}`,back,done:s=>finishX(g,L,s,back,key)})}
function quick(){const x=pick(openLessons());ctx.l=x.l;ctx.i=x.i;setLv(LV[x.l]);const g=pick(GAMES.filter(g=>canPlay(g,x.L)));playX(g,x.L,home,`${x.l}-${x.i}-${g}`)}
const G=html=>{$('#g').innerHTML=html};

function gMatch(L,done){
 const vs=shuffle(V(L));let sel=null,mis=0,left=vs.length;
 G(`<p class="tip">اضغط على الكلمة ثم على صورتها.</p><div class="match"><div class="col" dir="ltr">${vs.map((v,k)=>`<button class="tile wd" data-k="${k}">${esc(v.en)}</button>`).join('')}</div><div class="col">${shuffle(vs.map((v,k)=>k)).map(k=>`<button class="tile em" data-k="${k}">${vs[k].em}</button>`).join('')}</div></div>`);
 $$('#g .wd').forEach(b=>b.onclick=()=>{$$('#g .wd').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');sel=b;say(vs[+b.dataset.k].en)});
 $$('#g .em').forEach(b=>b.onclick=()=>{if(!sel)return toast('اختر كلمة أولًا');const v=vs[+sel.dataset.k];
  if(sel.dataset.k===b.dataset.k){ding();hit(v.en);sel.classList.add('gone');b.classList.add('gone');sel=null;if(!--left)setTimeout(()=>done(starsFrom(mis,0,2)),400)}
  else{buzz();mis++;miss(v.en);b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),400)}});
}

function gMemory(L,done){
 const vs=shuffle(V(L));const cards=shuffle(vs.flatMap((v,k)=>[{k,w:1,s:v.en},{k,w:0,s:v.em}]));let open=[],lock=false,mis=0,found=0;
 G(`<p class="tip">اقلب بطاقتين وابحث عن الكلمة وصورتها.</p><div class="mem">${cards.map((c,n)=>`<button class="card" data-n="${n}"><span class="front ${c.w?'en':''}" ${c.w?'dir="ltr"':''}>${esc(c.s)}</span><span class="back">?</span></button>`).join('')}</div>`);
 $$('#g .card').forEach(b=>b.onclick=()=>{if(lock||b.classList.contains('up'))return;const c=cards[+b.dataset.n];b.classList.add('up');sfx('tap');if(c.w)say(c.s);open.push([b,c]);
  if(open.length===2){const[[b1,c1],[b2,c2]]=open;open=[];
   if(c1.k===c2.k){b1.classList.add('got');b2.classList.add('got');ding();say(vs[c1.k].en);if(++found===vs.length)setTimeout(()=>done(mis<=4?3:mis<=9?2:1),700)}
   else{lock=true;mis++;setTimeout(()=>{b1.classList.remove('up');b2.classList.remove('up');lock=false},900)}}});
}

function gListen(L,done){
 const all=V(L),rounds=shuffle(all);let r=0,mis=0;
 function round(){const v=rounds[r],opts=shuffle([v,...shuffle(all.filter(x=>x!==v)).slice(0,3)]);
  G(`<p class="tip">استمع واختر الصورة الصحيحة (${r+1} من ${rounds.length})</p><button class="play" data-say="${esc(v.en)}">${icon('spk')}<span>اسمع الكلمة</span></button><div class="grid4">${opts.map(o=>`<button class="tile em big" data-en="${esc(o.en)}">${o.em}</button>`).join('')}</div>`);
  setTimeout(()=>say(v.en),300);
  $$('#g .tile').forEach(b=>b.onclick=()=>{if(b.dataset.en===v.en){if(b.classList.contains('right'))return;b.classList.add('right');ding();hit(v.en);setTimeout(()=>{++r<rounds.length?round():done(starsFrom(mis,0,2))},700)}else if(!b.classList.contains('wrong')){b.classList.add('wrong');mis++;miss(v.en);buzz()}});}
 round();
}

function gUnscr(L,done){
 const ws=shuffle(wordsFor.unscramble(L)).slice(0,5);let r=0,mis=0;
 function round(){const v=ws[r],word=v.en.toLowerCase();let letters,tries=0;do{letters=shuffle(word.split(''))}while(letters.join('')===word&&++tries<8);let ans=[],over=false;
  G(`<p class="tip">رتّب الحروف لتكتب الكلمة (${r+1} من ${ws.length})</p><div class="clue"><span class="big-em">${v.em}</span><span>${esc(v.ar)}</span><button class="spk" aria-label="استمع" data-say="${esc(v.en)}">${icon('spk')}</button></div><div class="slots" dir="ltr" id="sl"></div><div class="tiles" dir="ltr" id="tl"></div><div class="btns"><button class="ghost" id="clr">امسح</button></div>`);
  $('#sl').classList.toggle('long',word.length>7);
  function draw(){$('#sl').innerHTML=letters.map((_,n)=>`<span class="slot">${ans[n]!==undefined?letters[ans[n]]:''}</span>`).join('');
   $('#tl').innerHTML=letters.map((ch,n)=>`<button class="ltr" data-n="${n}" ${ans.includes(n)?'disabled':''}>${ch}</button>`).join('');
   $$('#tl .ltr').forEach(b=>b.onclick=()=>{if(over)return;ans.push(+b.dataset.n);sfx('tap');draw();if(ans.length===letters.length)check()})}
  function check(){if(ans.map(n=>letters[n]).join('')===word){over=true;ding();hit(v.en);say(v.en);$('#sl').classList.add('ok');setTimeout(()=>{++r<ws.length?round():done(starsFrom(mis,0,2))},900)}
   else{buzz();mis++;miss(v.en);$('#sl').classList.add('shake');setTimeout(()=>{ans=[];draw();$('#sl').classList.remove('shake')},600)}}
  $('#clr').onclick=()=>{if(over)return;ans=[];draw()};draw();}
 round();
}

function gSpell(L,done){
 const ws=shuffle(wordsFor.spell(L)).slice(0,5);let r=0,mis=0;
 function round(){const v=ws[r];let hint=0,wrong=0,over=false;
  G(`<p class="tip">اسمع الكلمة واكتبها بالإنجليزية (${r+1} من ${ws.length})</p><div class="clue"><span class="big-em">${v.em}</span><span>${esc(v.ar)}</span><button class="spk" aria-label="استمع" data-say="${esc(v.en)}">${icon('spk')}</button></div><input id="sp" class="inp" dir="ltr" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="type here"><p class="hintline" dir="ltr" id="hl"></p><div class="btns"><button class="ghost" id="hb">تلميح</button><button class="go" id="ck">تحقّق</button></div>`);
  setTimeout(()=>say(v.en),300);const inp=$('#sp');
  const showHint=()=>{$('#hl').textContent=v.en.slice(0,hint)+' _'.repeat(Math.max(0,v.en.length-hint))};
  $('#hb').onclick=()=>{if(hint<v.en.length){hint++;mis+=.5;showHint()}};
  const ck=()=>{if(over)return;if(inp.value.trim().replace(/\s+/g,' ').toLowerCase()===v.en.toLowerCase()){over=true;ding();hit(v.en);say(v.en);inp.classList.add('right');setTimeout(()=>{++r<ws.length?round():done(starsFrom(mis,0,2))},800)}
   else{buzz();mis++;wrong++;miss(v.en);inp.classList.add('shake');setTimeout(()=>inp.classList.remove('shake'),400);if(wrong>=2){hint=v.en.length;showHint();toast('انظر للكلمة واكتبها')}}};
  $('#ck').onclick=ck;inp.onkeydown=e=>{if(e.key==='Enter')ck()};}
 round();
}

function gSentence(L,done){
 const ss=sentFor(L);let r=0,mis=0;
 function round(){const s=ss[r],toks=s.split(' ');let order,tries=0;do{order=shuffle(toks.map((_,n)=>n))}while(order.every((n,k)=>n===k)&&++tries<8);let ans=[],over=false;
  G(`<p class="tip">رتّب الكلمات لتكوّن جملة صحيحة (${r+1} من ${ss.length})</p><button class="ghost" data-say="${esc(s)}">🔊 اسمع الجملة</button><div class="sent" dir="ltr" id="sa"></div><div class="tiles" dir="ltr" id="st"></div><div class="btns"><button class="ghost" id="clr">امسح</button></div>`);
  function draw(){$('#sa').innerHTML=ans.map((n,k)=>`<button class="tok" data-k="${k}">${esc(toks[n])}</button>`).join('');
   $('#st').innerHTML=order.map(n=>`<button class="tok" data-n="${n}" ${ans.includes(n)?'disabled':''}>${esc(toks[n])}</button>`).join('');
   $$('#sa .tok').forEach(b=>b.onclick=()=>{if(over)return;ans.splice(+b.dataset.k,1);draw()});
   $$('#st .tok').forEach(b=>b.onclick=()=>{if(over)return;ans.push(+b.dataset.n);sfx('tap');draw();if(ans.length===toks.length)check()})}
  function check(){if(ans.map(n=>toks[n]).join(' ')===s){over=true;ding();say(s);$('#sa').classList.add('ok');setTimeout(()=>{++r<ss.length?round():done(starsFrom(mis,0,2))},1300)}
   else{buzz();mis++;$('#sa').classList.add('shake');setTimeout(()=>{$('#sa').classList.remove('shake')},500)}}
  $('#clr').onclick=()=>{if(over)return;ans=[];draw()};draw();}
 round();
}

function gPop(L,done,token){
 const all=V(L),rounds=shuffle([...all,...shuffle(all).slice(0,2)]);let r=0,mis=0;const speed=34+ctx.l*12,extra=hardMode()?3:2;
 G(`<p class="tip">اضغط الفقاعة التي تحمل اسم الصورة قبل أن تطير!</p><div class="target" id="tg"></div><div class="field" id="fd" dir="ltr"></div><p class="muted" id="pr" style="text-align:center"></p>`);
 const fd=$('#fd');
 function next(){++r<rounds.length?round():done(starsFrom(mis,0,2))}
 function round(){if(token!==RUN)return;const v=rounds[r];
  $('#tg').innerHTML=`<span class="big-em">${v.em}</span><span>${esc(v.ar)}</span>`;$('#pr').textContent=`${r+1} / ${rounds.length}`;
  fd.innerHTML='';const opts=shuffle([v,...shuffle(all.filter(x=>x.en!==v.en)).slice(0,extra)]);
  const W=fd.clientWidth,H=fd.clientHeight,lane=W/opts.length,lift=shuffle(opts.map((_,n)=>n));let over=false,last=performance.now();
  const bs=opts.map((o,n)=>{const b=document.createElement('button');b.className='bubble';b.textContent=o.en;fd.appendChild(b);const bw=b.offsetWidth;
   const z={b,o,x:Math.max(4,Math.min(W-bw-4,lane*n+(lane-bw)/2)),y:H+10+lift[n]*55,alive:true};
   b.onclick=()=>{if(over||!z.alive)return;if(o.en===v.en){over=true;b.classList.add('popped');sfx('pop');hit(v.en);say(v.en);setTimeout(next,650)}else{z.alive=false;b.classList.add('miss');mis++;miss(v.en);buzz()}};return z});
  function step(now){if(token!==RUN||over)return;const dt=Math.min(.05,(now-last)/1000);last=now;let gone=false;
   bs.forEach(z=>{z.y-=speed*dt;z.b.style.transform=`translate(${z.x}px,${z.y}px)`;if(z.o.en===v.en&&z.y<-60)gone=true});
   if(gone){over=true;mis++;miss(v.en);buzz();toast(`الكلمة كانت: ${v.en}`);setTimeout(next,700);return}
   requestAnimationFrame(step)}
  requestAnimationFrame(step);}
 round();
}

/* true or false: does the word match the picture? */
function gTF(L,done,token){
 const all=V(L),hard=hardMode(),T=7000;
 const rounds=shuffle([...all,...shuffle(all).slice(0,4)]).map((v,k)=>({v,ok:k%2===0}));
 shuffle(rounds).forEach((x,k)=>rounds[k]=x);
 let r=0,mis=0;
 function round(){if(token!==RUN)return;const{v,ok}=rounds[r],shown=ok?v:pick(all.filter(x=>x.en!==v.en));let over=false;
  G(`<p class="tip">هل الكلمة تطابق الصورة؟ (${r+1} من ${rounds.length})</p>${hard?'<div class="timer"><span id="tb"></span></div>':''}
   <div class="tfc"><span class="big-em">${v.em}</span><span class="muted">${esc(v.ar)}</span><b dir="ltr" class="tfw">${esc(shown.en)}</b><button class="spk" data-say="${esc(shown.en)}" aria-label="استمع">${icon('spk')}</button></div>
   <div class="tfb"><button class="tf yes" id="ty">✔ صح</button><button class="tf no" id="tn">✘ خطأ</button></div><p class="fixline" id="tfm"></p>`);
  setTimeout(()=>token===RUN&&!over&&say(shown.en),250);
  const next=ms=>setTimeout(()=>{if(token!==RUN)return;++r<rounds.length?round():done(starsFrom(mis,0,2))},ms);
  const fix=()=>{$('#tfm').innerHTML=ok?`نعم، هذه <b dir="ltr">${esc(v.en)}</b>`:`الصحيح: <b dir="ltr">${esc(v.en)}</b>`};
  const ans=yes=>{if(over)return;over=true;const good=yes===ok;$(yes?'#ty':'#tn').classList.add(good?'right':'wrong');
   if(good){ding();hit(v.en);if(!ok)fix();next(ok?600:1100)}else{buzz();mis++;miss(v.en);fix();next(1500)}};
  $('#ty').onclick=()=>ans(true);$('#tn').onclick=()=>ans(false);
  if(hard){const t0=performance.now(),tb=$('#tb');(function tick(now){if(token!==RUN||over)return;const p=Math.max(0,1-(now-t0)/T);tb.style.width=p*100+'%';
   if(p<=0){over=true;buzz();mis++;miss(v.en);fix();next(1500);return}requestAnimationFrame(tick)})(t0)}
 }
 round();
}

/* hide and seek: pictures peek out of the bushes; tap the one Ollie names */
function gHide(L,done,token){
 const all=V(L),rounds=shuffle(all),hard=hardMode(),upMs=hard?1350:1900,gapMs=hard?600:800;let r=0,mis=0,target=null,live=false,lost=0;
 G(`<p class="tip">الصور تلعب الغميضة! اسمع الكلمة واضغط صورتها حين تطلّ من الشجيرة.</p><div class="target" id="tg"></div>
  <div class="bushes" id="bs">${Array.from({length:6},()=>`<button class="bush" aria-label="شجيرة"><span class="peek"></span>${BUSH}</button>`).join('')}</div><p class="muted" id="pr" style="text-align:center"></p>`);
 const cells=$$('#bs .bush').map(b=>({b,p:b.querySelector('.peek'),v:null,t:0}));
 const down=c=>{c.v=null;clearTimeout(c.t);c.b.classList.remove('up','glow')};
 function up(c,v){c.v=v;c.p.textContent=v.em;c.b.classList.add('up');clearTimeout(c.t);
  if(v===target&&lost>=2){c.b.classList.add('glow');return}   /* missed twice: it waits for you */
  c.t=setTimeout(()=>{if(token!==RUN)return;if(c.v===target&&live)lost++;down(c)},upMs)}
 function tick(){if(token!==RUN)return clearInterval(iv);if(!live)return;
  const free=cells.filter(c=>!c.v);if(free.length<4)return;
  const shown=cells.some(c=>c.v===target),others=all.filter(x=>x!==target&&!cells.some(c=>c.v===x));
  const v=!shown&&Math.random()<.5?target:pick(others);if(v)up(pick(free),v)}
 function round(){if(token!==RUN)return;target=rounds[r];lost=0;live=true;
  $('#tg').innerHTML=`<button class="play" data-say="${esc(target.en)}">${icon('spk')}<span>اسمع الكلمة</span></button>${hard?'':`<b dir="ltr" class="tgw">${esc(target.en)}</b>`}`;
  $('#pr').textContent=`${r+1} / ${rounds.length}`;say(target.en)}
 cells.forEach(c=>c.b.onclick=()=>{if(!live||!c.v)return;
  if(c.v===target){live=false;clearTimeout(c.t);c.b.classList.add('got');ding();hit(target.en);
   setTimeout(()=>{if(token!==RUN)return;cells.forEach(x=>{down(x);x.b.classList.remove('got')});if(++r<rounds.length)round();else{clearInterval(iv);done(starsFrom(mis,0,2))}},800)}
  else{mis++;miss(target.en);buzz();c.b.classList.add('shake');setTimeout(()=>{c.b.classList.remove('shake');if(c.v!==target)down(c)},350)}});
 const iv=setInterval(tick,gapMs);round();
}

/* missing word: a sentence from the lesson with one word taken out */
function gGap(L,done,token){
 const items=gapItems(L),hard=hardMode(),seen=new Set(),fresh=[],again=[];
 /* lesson words first, and a different answer each round where the lesson allows it */
 for(const x of [...shuffle(items.filter(x=>x.voc)),...shuffle(items.filter(x=>!x.voc))]){const k=(x.voc||x.word).toLowerCase();(seen.has(k)?again:fresh).push(x);seen.add(k)}
 const rounds=shuffle([...fresh,...again].slice(0,5));let r=0,mis=0;
 function round(){if(token!==RUN)return;const it=rounds[r];let over=false;
  const opts=shuffle([{t:it.voc||it.word,ok:1},...shuffle(it.opts).slice(0,3).map(t=>({t,ok:0}))]);
  const before=it.s.slice(0,it.at),after=it.s.slice(it.at+it.word.length);
  const go=()=>{if(token!==RUN)return;++r<rounds.length?round():done(starsFrom(mis,0,2))};
  G(`<p class="tip">${hard?'اقرأ الجملة واختر الكلمة الناقصة. إذا احترت فاسمعها.':'اسمع الجملة واختر الكلمة الناقصة.'} (${r+1} من ${rounds.length})</p>
   <div class="gapc" dir="ltr"><button class="spk" data-say="${esc(it.s)}" aria-label="اسمع الجملة">${icon('spk')}</button><p>${esc(before)}<span class="blank" id="bk">&nbsp;</span>${esc(after)}</p></div>
   <div class="grid4" dir="ltr">${opts.map(o=>`<button class="opt c" data-ok="${o.ok}">${esc(o.t)}</button>`).join('')}</div>`);
  if(!hard)setTimeout(()=>token===RUN&&!over&&say(it.s),300);
  $$('#g .opt').forEach(b=>b.onclick=()=>{if(over)return;
   if(b.dataset.ok==='1'){over=true;b.classList.add('right');const k=$('#bk');k.textContent=it.word;k.classList.add('ok');ding();if(it.voc)hit(it.voc);
    /* the sentence was not played yet in the harder mode: play it whole now, then move on */
    if(hard)Promise.race([say(it.s),wait(8000)]).then(()=>setTimeout(go,350));else setTimeout(go,1000)}
   else if(!b.classList.contains('wrong')){b.classList.add('wrong');mis++;if(it.voc)miss(it.voc);buzz()}});
 }
 round();
}

/* Ollie's balloons: guess the letters; each wrong letter lets one balloon fly away */
function gBalloons(L,done,token){
 const ws=shuffle(wordsFor.balloons(L)).slice(0,4);let r=0,mis=0;
 const next=ms=>setTimeout(()=>{if(token!==RUN)return;++r<ws.length?round():done(mis<=4?3:mis<=10?2:1)},ms);
 function round(){if(token!==RUN)return;const v=ws[r],word=v.en.toLowerCase(),got=new Set();let left=6,over=false;
  G(`<p class="tip">خمّن حروف الكلمة قبل أن تطير بالونات أولي! (${r+1} من ${ws.length})</p>
   <div class="bal"><div class="bal-row" id="bl"></div><div class="bal-o">${BIRD(52)}</div></div>
   <div class="clue"><span class="big-em">${v.em}</span><span>${esc(v.ar)}</span></div><div class="slots" dir="ltr" id="sl"></div>
   <div class="kb" dir="ltr">${'abcdefghijklmnopqrstuvwxyz'.split('').map(ch=>`<button class="key" data-c="${ch}">${ch}</button>`).join('')}</div>`);
  $('#sl').classList.add('words');$('#sl').classList.toggle('long',word.length>7);
  const draw=()=>{$('#bl').innerHTML=BCOL.map((c,k)=>`<span class="ball${k<left?'':' gone'}">${BALLOON(c)}</span>`).join('');
   $('#sl').innerHTML=word.split(' ').map(w=>`<span class="wgrp">${w.split('').map(ch=>/[a-z]/.test(ch)?`<span class="slot">${got.has(ch)||over?ch:''}</span>`:`<span class="slot gap">${ch}</span>`).join('')}</span>`).join('')};
  $$('#g .key').forEach(b=>b.onclick=()=>{if(over||b.disabled)return;const ch=b.dataset.c;b.disabled=true;
   if(word.includes(ch)){got.add(ch);b.classList.add('right');sfx('tap');
    if([...word].every(c=>!/[a-z]/.test(c)||got.has(c))){over=true;draw();ding();hit(v.en);$('#sl').classList.add('ok');say(v.en);next(1200)}else draw()}
   else{left--;mis++;b.classList.add('wrong');sfx('pop');
    if(left<=0){over=true;draw();miss(v.en);toast(`الكلمة: ${v.en}`);say(v.en);next(1900)}else draw()}});
  draw();}
 round();
}

/* word search: the lesson's words hidden in a letter grid, left to right or top to bottom */
function gSearch(L,done,token){
 const N=8,ws=shuffle(wordsFor.search(L)).slice(0,5),hard=hardMode();let grid,put;
 for(let tryN=0;tryN<60;tryN++){grid=Array.from({length:N},()=>Array(N).fill(''));put=[];let ok=true;
  for(const v of [...ws].sort((a,b)=>b.en.length-a.en.length)){const w=v.en.toUpperCase();let placed=false;
   for(let t=0;t<80&&!placed;t++){const hz=Math.random()<.5,r0=Math.random()*(hz?N:N-w.length+1)|0,c0=Math.random()*(hz?N-w.length+1:N)|0;
    const cs=[...w].map((_,k)=>({r:r0+(hz?0:k),c:c0+(hz?k:0)}));
    if(cs.every((p,k)=>!grid[p.r][p.c]||grid[p.r][p.c]===w[k])){cs.forEach((p,k)=>grid[p.r][p.c]=w[k]);put.push({v,w,cs,found:false});placed=true}}
   if(!placed){ok=false;break}}
  if(ok)break}
 const AB='AAEEIIOOUULNRSTMDCPBGHKWY';
 for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(!grid[r][c])grid[r][c]=AB[Math.random()*AB.length|0];
 let mis=0,a=null,drag=false,moved=false,armed=false,sel=[],over=false;
 G(`<p class="tip">ابحث عن كلمات الدرس بين الحروف: اسحب إصبعك فوق الكلمة، أو اضغط أول حرف ثم آخر حرف.</p>
  <div class="wlist" id="wl"></div><div class="wgrid" id="wg" dir="ltr">${grid.map((row,r)=>row.map((ch,c)=>`<span class="wc" data-r="${r}" data-c="${c}">${ch}</span>`).join('')).join('')}</div>
  <div class="btns"><button class="ghost" id="hb">💡 تلميح</button></div>`);
 const wg=$('#wg'),cell=p=>wg.children[p.r*N+p.c];
 const list=()=>{$('#wl').innerHTML=put.map(p=>`<span class="wi${p.found?' ok':''}"><span>${p.v.em}</span>${p.found||!hard?`<b dir="ltr">${esc(p.v.en)}</b>`:`<small>${esc(p.v.ar)}</small>`}</span>`).join('')};
 const at=e=>{const el=document.elementFromPoint(e.clientX,e.clientY),b=el&&el.closest?el.closest('.wc'):null;return b&&wg.contains(b)?{r:+b.dataset.r,c:+b.dataset.c}:null};
 const line=(p,q)=>{const dr=q.r-p.r,dc=q.c-p.c;if(dr&&dc)return[p];const n=Math.abs(dr||dc),sr=Math.sign(dr),sc=Math.sign(dc);return Array.from({length:n+1},(_,k)=>({r:p.r+sr*k,c:p.c+sc*k}))};
 const paint=()=>{$$('#wg .sel').forEach(x=>x.classList.remove('sel'));sel.forEach(p=>cell(p).classList.add('sel'))};
 const same=(x,y)=>x.length===y.length&&x.every((p,k)=>p.r===y[k].r&&p.c===y[k].c);
 function commit(){const got=put.find(p=>!p.found&&(same(p.cs,sel)||same(p.cs,[...sel].reverse())));
  if(got){got.found=true;got.cs.forEach(p=>cell(p).classList.add('fd','f'+put.indexOf(got)));ding();hit(got.v.en);say(got.v.en);list();
   if(put.every(p=>p.found)){over=true;setTimeout(()=>{if(token===RUN)done(starsFrom(mis,1,4))},1100)}}
  else if(sel.length>1){mis++;buzz();wg.classList.add('shake');setTimeout(()=>wg.classList.remove('shake'),400)}
  sel=[];a=null;armed=false;paint()}
 wg.onpointerdown=e=>{if(over)return;const p=at(e);if(!p)return;e.preventDefault();
  if(armed&&a){sel=line(a,p);paint();if(sel.length>1)return setTimeout(commit,120);}
  a=p;drag=true;moved=false;armed=false;sel=[p];paint();sfx('tap');try{wg.setPointerCapture(e.pointerId)}catch(x){}};
 wg.onpointermove=e=>{if(!drag||over)return;const p=at(e);if(!p)return;if(p.r!==a.r||p.c!==a.c)moved=true;sel=line(a,p);paint()};
 wg.onpointerup=()=>{if(!drag)return;drag=false;if(moved&&sel.length>1)commit();else{armed=true;sel=[a];paint()}};
 wg.onpointercancel=()=>{drag=false;armed=false;a=null;sel=[];paint()};
 $('#hb').onclick=()=>{if(over)return;const p=put.find(x=>!x.found);if(!p)return;mis+=.5;const c=cell(p.cs[0]);c.classList.add('hint');setTimeout(()=>c.classList.remove('hint'),1600)};
 list();
}

/* Ollie's flight: move Ollie under the cloud that carries the right word */
function gFly(L,done,token){
 const all=V(L),rounds=shuffle([...all,...shuffle(all).slice(0,2)]),speed=(hardMode()?54:42)+ctx.l*5;let r=0,mis=0,lane=1,boost=false;
 G(`<p class="tip">حرّك أولي إلى الغيمة التي تحمل اسم الصورة. اضغط على المسار، واضغطه مرة ثانية للإسراع.</p><div class="target" id="tg"></div>
  <div class="sky" id="sky" dir="ltr"><i class="ln"></i><i class="ln"></i><div class="flyer" id="fl">${BIRD(54)}</div></div>
  <div class="btns fbtn" dir="ltr"><button class="ghost" id="fL" aria-label="إلى اليسار">◀</button><span class="muted" id="pr"></span><button class="ghost" id="fR" aria-label="إلى اليمين">▶</button></div>`);
 const sky=$('#sky'),fl=$('#fl'),W=()=>sky.clientWidth;
 const go=n=>{n=Math.max(0,Math.min(2,n));if(n===lane)boost=true;lane=n;fl.style.transform=`translateX(${(lane+.5)*W()/3-27}px)`};
 sky.onpointerdown=e=>{e.preventDefault();go(Math.floor((e.clientX-sky.getBoundingClientRect().left)/(W()/3)))};
 $('#fL').onclick=()=>{lane>0?go(lane-1):0};$('#fR').onclick=()=>{lane<2?go(lane+1):0};
 lane=-1;go(1);boost=false;
 function round(){if(token!==RUN)return;const v=rounds[r];boost=false;
  $('#tg').innerHTML=`<span class="big-em">${v.em}</span><span>${esc(v.ar)}</span>`;$('#pr').textContent=`${r+1} / ${rounds.length}`;
  $$('#sky .cloud').forEach(c=>c.remove());
  const w=W()/3,cs=shuffle([v,...shuffle(all.filter(x=>x.en!==v.en)).slice(0,2)]).map((o,n)=>{const c=document.createElement('div');c.className='cloud';c.textContent=o.en;c.style.width=(w-10)+'px';c.style.left=(n*w+5)+'px';sky.appendChild(c);return{c,o}});
  const ch=Math.max(...cs.map(z=>z.c.offsetHeight)),stopY=sky.clientHeight-66-ch;let y=-ch-6,last=performance.now(),over=false;
  (function step(now){if(token!==RUN||over)return;const dt=Math.min(.05,(now-last)/1000);last=now;y+=speed*(boost?6:1)*dt;
   if(y>=stopY){y=stopY;over=true}
   cs.forEach(z=>z.c.style.transform=`translateY(${y}px)`);
   if(over){const mine=cs[lane],good=mine.o.en===v.en;
    if(good){mine.c.classList.add('right');ding();hit(v.en);say(v.en)}else{mine.c.classList.add('wrong');cs.find(z=>z.o.en===v.en).c.classList.add('right');mis++;miss(v.en);buzz()}
    setTimeout(()=>{if(token!==RUN)return;++r<rounds.length?round():done(starsFrom(mis,0,2))},good?800:1500);return}
   requestAnimationFrame(step)})(last);}
 round();
}
const GFN={match:gMatch,memory:gMemory,listen:gListen,hide:gHide,tf:gTF,pop:gPop,fly:gFly,unscramble:gUnscr,balloons:gBalloons,search:gSearch,gap:gGap,spell:gSpell,sentence:gSentence};

/* ---------- question card shared by the world challenge and the daily challenge ---------- */
/* type 0: picture → English word, 1: hear → picture, 2: Arabic → English word, 3: English word → Arabic */
function askCard(box,v,pool,type){
 const opts=shuffle([v,...shuffle(pool.filter(x=>x.en!==v.en&&x.em!==v.em&&x.ar!==v.ar)).slice(0,3)]);
 const enOpts=`<div class="q-o" dir="ltr">${opts.map(o=>`<button class="opt" data-en="${esc(o.en)}">${esc(o.en)}</button>`).join('')}</div>`;
 box.innerHTML=type===0?`<div class="bprompt"><span class="big-em">${v.em}</span><p>ما اسمها بالإنجليزية؟</p></div>${enOpts}`
  :type===1?`<div class="bprompt"><button class="play" data-say="${esc(v.en)}">${icon('spk')}<span>اسمع</span></button><p>اختر الصورة الصحيحة</p></div><div class="grid4">${opts.map(o=>`<button class="tile em big" data-en="${esc(o.en)}">${o.em}</button>`).join('')}</div>`
  :type===2?`<div class="bprompt"><span class="ar-word">${esc(v.ar)}</span><p>اختر الكلمة الإنجليزية</p></div>${enOpts}`
  :`<div class="bprompt"><span class="en-word" dir="ltr">${esc(v.en)}</span><button class="spk" data-say="${esc(v.en)}" aria-label="استمع">${icon('spk')}</button><p>ما معناها؟</p></div><div class="q-o">${opts.map(o=>`<button class="opt ar" data-en="${esc(o.en)}">${esc(o.ar)}</button>`).join('')}</div>`;
 if(type===1||type===3)setTimeout(()=>box.isConnected&&box.querySelector('[data-en]')&&say(v.en),250);
 return [...box.querySelectorAll('[data-en]')];
}

/* ---------- world challenge ---------- */
const bossT=()=>Math.max(5,12-ctx.l-Math.min(PART-1,3));
function bossIntro(){
 stopAll();const lv=LV[ctx.l],T=bossT();
 h(lv.boss,level,`<div class="pane"><div class="intro"><div class="boss-head"><span>${icon('crown')}</span><b style="flex:1">${lv.boss}</b></div>
 <ul><li>12 سؤالًا من كلمات العالم كله.</li><li>لكل سؤال ${T} ثوانٍ فقط.</li><li>أسئلة بالصورة، والصوت، والترجمة.</li><li>أجب عن 5 أسئلة على الأقل لتفتح العالم التالي، و11 لتأخذ 3 نجوم.</li></ul>
 <button class="go" id="bgo">أنا مستعد!</button></div></div>`);
 $('#bgo').onclick=boss;
 warm(shuffle(lv.lessons.flatMap(V)).map(v=>v.en));
}
function boss(){
 stopAll();const lv=LV[ctx.l],token=RUN,all=uniq(lv.lessons.flatMap(V)),qs=shuffle(all).slice(0,12),T=bossT();let n=0,score=0;
 h(lv.boss,level,`<div class="pane"><div class="boss-head"><b id="bn"></b><span id="bs" class="pill"></span></div><div class="timer"><span id="tb"></span></div><div id="bq" class="pane"></div></div>`);
 function q(){
  if(token!==RUN)return;
  if(n>=qs.length)return finish('boss',score>=11?3:score>=8?2:score>=5?1:0,score);
  const v=qs[n];
  $('#bn').textContent=`سؤال ${n+1} من ${qs.length}`;$('#bs').textContent=`✔ ${score}`;
  const btns=askCard($('#bq'),v,all,n%3);
  let over=false;const start=performance.now(),tb=$('#tb');
  const reveal=()=>btns.forEach(b=>{if(b.dataset.en===v.en)b.classList.add('right')});
  (function tick(now){if(token!==RUN||over)return;const p=Math.max(0,1-(now-start)/(T*1000));tb.style.width=p*100+'%';
   if(p<=0){over=true;buzz();miss(v.en);reveal();setTimeout(()=>{n++;q()},1000);return}requestAnimationFrame(tick)})(start);
  btns.forEach(b=>b.onclick=()=>{if(over)return;over=true;
   if(b.dataset.en===v.en){b.classList.add('right');score++;ding();hit(v.en)}else{b.classList.add('wrong');buzz();miss(v.en);reveal()}
   setTimeout(()=>{n++;q()},850)});
 }
 q();
}

/* ---------- daily challenge: 8 calm questions from the open lessons, tricky words first ---------- */
function dailyIntro(){
 stopAll();setLv(null);const dn=doneToday(),sk=streakNow();
 h('تحدي اليوم',home,`<div class="pane"><div class="intro"><div class="boss-head"><span style="font-size:30px">🔥</span><b style="flex:1">تحدي اليوم</b></div>
 <ul><li>٨ أسئلة من الكلمات التي تعلمتها، بلا ساعة.</li><li>كل يوم تنهيه تكسب ملصقًا جديدًا لألبومك.</li><li>العب كل يوم لتكبر سلسلتك${sk?`: معك الآن ${daysAr(sk)}`:''}.</li></ul>
 ${dn?'<p class="tip">أنجزت تحدي اليوم. يمكنك اللعب مرة أخرى للتدريب، والملصق القادم غدًا.</p>':''}
 <button class="go" id="dgo">${dn?'العب للتدريب':'هيا نبدأ!'}</button></div></div>`);
 $('#dgo').onclick=dailyRun;
}
function dailyRun(){
 stopAll();const token=RUN,pool=openWords(),hot=shuffle(pool.filter(v=>P.m[v.en])).slice(0,4);
 const qs=shuffle([...hot,...shuffle(pool.filter(v=>!hot.includes(v)))].slice(0,8));let n=0,score=0;
 h('تحدي اليوم',home,`<div class="pane"><div class="boss-head"><b id="bn"></b><span id="bs" class="pill"></span></div><div class="prog sun"><span id="dp" style="width:0"></span></div><div id="bq" class="pane"></div></div>`);
 function q(){
  if(token!==RUN)return;
  if(n>=qs.length)return dailyEnd(score,qs.length);
  const v=qs[n];let over=false;
  $('#bn').textContent=`سؤال ${n+1} من ${qs.length}`;$('#bs').textContent=`✔ ${score}`;$('#dp').style.width=n/qs.length*100+'%';
  const btns=askCard($('#bq'),v,pool,n%4);
  btns.forEach(b=>b.onclick=()=>{if(over)return;over=true;
   if(b.dataset.en===v.en){b.classList.add('right');score++;ding();hit(v.en)}
   else{b.classList.add('wrong');buzz();miss(v.en);btns.forEach(x=>{if(x.dataset.en===v.en)x.classList.add('right')})}
   setTimeout(()=>{n++;q()},b.dataset.en===v.en?750:1400)});
 }
 q();
}
function dailyEnd(score,total){
 stopAll();const first=!doneToday(),t=dayStr();let sticker='';
 if(first){P.d.streak=P.d.day&&dayGap(P.d.day,t)===1?P.d.streak+1:1;P.d.best=Math.max(P.d.best,P.d.streak);P.d.day=t;sticker=DAILY_ST[P.d.n%DAILY_ST.length];P.d.n++;save()}
 const stars=score>=total-1?3:score>=total-3?2:score>=3?1:0;
 h('تحدي اليوم',home,`<div class="result">
  <div class="bigstars">${Array.from({length:3},(_,k)=>`<svg class="ico fill${k<stars?' on':''}" viewBox="0 0 24 24">${IC.star}</svg>`).join('')}</div>
  <h2>${stars>=2?'رائع!':'أحسنت!'}</h2><p class="muted">أجبت عن ${score} من ${total}</p>
  ${first?`<div class="newst"><span>${sticker}</span><b>ملصق جديد في ألبومك!</b></div><p class="gift">🔥 سلسلتك الآن: ${daysAr(P.d.streak)}</p>`:'<p class="muted">تدريب إضافي جميل. الملصق القادم غدًا.</p>'}
  <div class="btns"><button class="go" id="al">افتح الألبوم</button><button class="ghost" id="bk">الرئيسية</button></div></div>`);
 say(first?SAY.daily[0]:SAY.daily[1]);
 $('#al').onclick=album;$('#bk').onclick=home;
 if(first){confetti();sfx('win')}
}

/* ---------- results ---------- */
function resultHead(stars,msg){return `<div class="bigstars">${Array.from({length:3},(_,k)=>`<svg class="ico fill${k<stars?' on':''}" viewBox="0 0 24 24">${IC.star}</svg>`).join('')}</div>
  <h2>${msg[0]}</h2><p dir="ltr" style="font-size:20px;font-weight:700">${msg[1]}</p>`}
const RES=[['حاول مرة أخرى','Try again!'],['أحسنت!','Good try!'],['رائع!','Great job!'],['ممتاز!','Excellent!']];
function cheer(stars){const line=stars===3?pick(SAY.top):SAY.stars[stars];say(line);if(stars===3){confetti();sfx('win')}return line}
function finish(a,stars,score){
 stopAll();const k=a==='boss'?bossKey(ctx.l):`${ctx.l}-${ctx.i}-${a}`,prev=P.s[k]||0;
 const wasDone=a!=='boss'&&lessonDone(ctx.l,ctx.i);
 const e0=earned();if(stars>prev)P.s[k]=stars;save();const got=earned()-e0;
 const newSt=a==='boss'?stars>0&&!prev:!wasDone&&lessonDone(ctx.l,ctx.i);
 const order=['c','l','r','g'];let nextLbl,nextFn;
 if(a==='boss'){
  if(stars&&ctx.l<LV.length-1){nextLbl=`ادخل ${LV[ctx.l+1].ar}`;nextFn=()=>{ctx.l++;level()}}
  else if(stars){nextLbl='العودة إلى الخريطة';nextFn=home}
 }else{const ix=order.indexOf(a);
  if(ix<3){nextLbl='النشاط التالي';nextFn=()=>startAct(order[ix+1])}
  else if(ctx.i<5&&lessonUnlocked(ctx.l,ctx.i+1)){nextLbl='الدرس التالي';nextFn=()=>{ctx.i++;lesson()}}
  else if(ctx.i===5&&bossUnlocked(ctx.l)){nextLbl='إلى تحدي العالم';nextFn=bossIntro}
 }
 const back=a==='boss'?level:lesson,msg=[RES[stars][0],stars===3?'':RES[stars][1]];
 h(a==='boss'?LV[ctx.l].boss:esc(cur().en),back,`<div class="result">
  ${resultHead(stars,msg)}
  ${a==='boss'?`<p class="muted">أجبت عن ${score} من 12</p>`:''}
  ${stars>prev&&prev?`<p class="muted">رقم قياسي جديد!</p>`:''}
  ${newSt?`<div class="newst"><span>${a==='boss'?'👑':V(cur())[0].em}</span><b>ملصق جديد في ألبومك!</b></div>`:''}
  ${got?`<p class="gift">🎉 جمعت 10 نجوم! اطلب من أهلك نجمة في لوحة النجوم.</p>`:''}
  ${a==='boss'&&stars&&ctx.l===LV.length-1?`<p style="font-weight:800">أنهيت الجزء ${PART} كله. أنت بطل الإنجليزية! 🏆</p>${PART<LEVELS.length?`<a class="go" href="${PART+2}.html">انتقل إلى الجزء ${PART+1}</a>`:''}`:''}
  <div class="btns">${nextFn?`<button class="go" id="nx">${nextLbl}</button>`:''}<button class="ghost" id="again">أعد المحاولة</button><button class="ghost" id="bk">رجوع</button></div></div>`);
 const line=cheer(stars);if(stars===3)$('.result p[dir=ltr]').textContent=line;
 if(nextFn)$('#nx').onclick=()=>{stopAll();nextFn()};
 $('#again').onclick=()=>a==='boss'?boss():startAct(a);
 $('#bk').onclick=()=>{stopAll();back()};
}
function finishX(g,L,stars,back,key){
 stopAll();const prev=key?P.x[key]||0:0;if(key&&stars>prev)P.x[key]=stars;save();
 const others=GAMES.filter(x=>x!==g&&canPlay(x,L)),msg=[RES[stars][0],stars===3?'':RES[stars][1]];
 h(`${esc(L.en)} · ${GN[g]}`,back,`<div class="result">${resultHead(stars,msg)}
  ${key&&stars>prev&&prev?`<p class="muted">رقم قياسي جديد!</p>`:''}
  <p class="muted">هذه لعبة للمتعة والتدريب، ونجومها لا تُحسب في لوحة النجوم.</p>
  <div class="btns"><button class="go" id="again">العب مرة أخرى</button><button class="ghost" id="other">لعبة أخرى 🎲</button><button class="ghost" id="bk">رجوع</button></div></div>`);
 const line=cheer(stars);if(stars===3)$('.result p[dir=ltr]').textContent=line;
 $('#again').onclick=()=>playX(g,L,back,key);
 $('#other').onclick=()=>{if(back===home&&key)return quick();const x=pick(others);playX(x,L,back,key?key.replace(/[^-]+$/,x):null)};
 $('#bk').onclick=()=>{stopAll();back()};
}

/* ---------- picture dictionary ---------- */
function words(){
 stopAll();setLv(null);const tr=tricky();
 h('قاموسي المصوّر',home,`<p class="tip" style="margin-block:6px 16px">اضغط على أي كلمة لتسمعها. الكلمات المقفلة تظهر عندما تفتح عالمها.</p>
 ${tr.length?`<div class="panel"><h3>💪 كلمات تحتاج تدريبًا</h3><p class="muted">هذه كلمات أخطأت فيها. تدرّب عليها حتى تختفي من هنا.</p><div class="wl" style="margin:0">${tr.slice(0,12).map(v=>`<button class="vw" data-say="${esc(v.en)}"><span class="e">${v.em}</span><b>${esc(v.en)}</b><small>${esc(v.ar)}</small></button>`).join('')}</div><button class="go" id="trn">تدرّب عليها الآن</button></div>`:''}
 ${LV.map((lv,l)=>`<h2 style="font-size:20px;margin-bottom:10px">${lv.icon} ${lv.ar}</h2><div class="wl ${levelUnlocked(l)?'':'locked'}">${lv.lessons.flatMap(V).map(v=>levelUnlocked(l)?`<button class="vw" data-say="${esc(v.en)}"><span class="e">${v.em}</span><b>${esc(v.en)}</b><small>${esc(v.ar)}</small></button>`:`<span class="vw"><span class="e">${v.em}</span><small>؟؟؟</small></span>`).join('')}</div>`).join('')}`);
 const b=$('#trn');if(b)b.onclick=()=>{
  const mine=tricky().slice(0,6),fill=shuffle(openWords().filter(v=>!mine.some(m=>m.en===v.en||m.em===v.em))).slice(0,Math.max(0,6-mine.length));
  const L={en:'My tricky words',ar:'كلماتي الصعبة',vs:shuffle([...mine,...fill])};
  playX(pick(['listen','match','tf','hide','pop','fly'].filter(g=>canPlay(g,L))),L,words,null)};
}

/* ---------- sticker album ---------- */
function album(){
 stopAll();setLv(null);
 const les=LV.reduce((t,lv,l)=>t+lv.lessons.filter((_,i)=>lessonDone(l,i)).length,0),cr=LV.filter((_,l)=>P.s[bossKey(l)]>0).length,dn=Math.min(P.d.n,DAILY_ST.length);
 const stk=(on,em,lab,gold)=>`<span class="stk${on?' on':''}${gold?' gold':''}"><span class="e">${on?em:'❔'}</span><small>${on?lab:'؟؟؟'}</small></span>`;
 h('ألبوم الملصقات',home,`<p class="tip" style="margin-block:6px 16px">معك ${les+cr+dn} من ${30+5+DAILY_ST.length} ملصقًا. أكمل دروسك وتحدياتك لتجمعها كلها!</p>
 ${LV.map((lv,l)=>`<h2 class="alb-t">${lv.icon} ${lv.ar} <small>${lv.lessons.filter((_,i)=>lessonDone(l,i)).length+(P.s[bossKey(l)]>0?1:0)} من 7</small></h2>
 <div class="alb">${lv.lessons.map((L,i)=>stk(lessonDone(l,i),V(L)[0].em,esc(L.ar),lessonStars(l,i)===12)).join('')}${stk(P.s[bossKey(l)]>0,'👑','تاج التحدي',P.s[bossKey(l)]===3)}</div>`).join('')}
 <h2 class="alb-t">🔥 ملصقات تحدي اليوم <small>${dn} من ${DAILY_ST.length}</small></h2>
 <div class="alb">${DAILY_ST.map((e,k)=>stk(k<dn,e,`اليوم ${k+1}`)).join('')}</div>
 <p class="muted" style="text-align:center;margin-top:8px">الإطار الذهبي لمن يجمع كل نجوم الدرس أو التحدي.</p>`);
}

/* ---------- parents corner ---------- */
function parents(){
 stopAll();setLv(null);
 const allLessons=LV.reduce((t,lv,l)=>t+lv.lessons.filter((_,i)=>lessonDone(l,i)).length,0),bosses=LV.filter((_,l)=>P.s[bossKey(l)]>0).length,tr=tricky(),sk=streakNow();
 h('ركن الوالدين',home,`
 <div class="panel"><h3>التقدم</h3><p>${allLessons} من 30 درسًا مكتملة · ${bosses} من 5 تحديات · ${totalStars()} نجمة</p>
  <p class="muted">تحدي اليوم · السلسلة الآن: ${sk} · أطول سلسلة: ${P.d.best||0} · مرات الإنجاز: ${P.d.n}</p>
  ${tr.length?`<p class="muted">كلمات يخطئ فيها الآن: <span dir="ltr">${tr.slice(0,10).map(v=>esc(v.en)).join(', ')}</span></p>`:''}</div>
 <div class="panel"><h3>نجوم لوحة البطل</h3><p>كل 10 نجوم في أولي = نجمة تضعها أنت في لوحة النجوم.</p>
  <p style="font-size:20px;font-weight:800">جاهز الآن: <span style="color:var(--sun-deep)">${readyBoard()}</span> ${readyBoard()===1?'نجمة':'نجوم'}</p>
  <p class="muted">بعد أن تضعها في اللوحة (تبويب «مكافأة» ← «أولي: 10 نجوم في الإنجليزية»)، اضغط الزر هنا حتى يبدأ العد من جديد.</p>
  <div id="gvz">${readyBoard()?'<button class="ghost" id="gvb">أعطيته النجوم</button>':''}</div></div>
 <div class="panel"><h3>اختبار الصوت</h3><p>اضغط الزر. إذا سمعت أولي يتكلم فالصوت يعمل.</p><button class="go" id="tst">جرّب الصوت</button><p class="muted" id="tsm"></p></div>
 <div class="panel"><h3>اسم طفلك</h3><input type="text" id="nm" placeholder="مثال: سامي" value="${esc(P.name)}"><button class="go" id="svn">حفظ</button></div>
 <div class="panel"><h3>كيف تستخدمونه معًا</h3><ul>
  <li>جلسة قصيرة كل يوم (15–20 دقيقة) أنفع من جلسة طويلة مرة في الأسبوع. «تحدي اليوم» يساعد على هذه العادة.</li>
  <li>في المحادثة، اجلس بجانبه: اقرأ أنت سؤال أولي بصوتك، وهو يجيب ويردد الجملة.</li>
  <li>كل درس فيه 4 أنشطة. يُفتح الدرس التالي بعد إنهاء الأربعة، ويُفتح العالم التالي بعد الفوز بتحديه.</li>
  <li>النجوم: 3 بلا أخطاء، 2 لأخطاء قليلة، 1 للمحاولة. يمكن إعادة أي نشاط لرفع النجوم.</li>
  <li>«ألعاب أكثر» و«لعبة سريعة» و«تحدي اليوم» للتدريب والمتعة: نجومها لا تدخل في حساب لوحة النجوم.</li>
  <li>الكلمات التي يخطئ فيها تُجمع في «قاموسي المصوّر» ليتدرب عليها، وتختفي كلما أجاب عنها صحيحًا.</li>
  <li>${PART===1?'من العالم الثالث تبدأ تحديات أصعب: ساعة للعب، وإخفاء نص الاستماع، وكتابة الكلمات والجمل.':'في هذا الجزء التحديات مفعّلة من البداية: ساعة للعب، وإخفاء نص الاستماع، ووقت أقصر في تحدي كل عالم.'}</li>
  <li>كل جزء من أولي مستقل، وتقدّمه محفوظ وحده على هذا الجهاز وهذا المتصفح فقط.</li>
  <li>صوت أولي مسجّل مسبقًا ويُحمَّل من الإنترنت. إذا لم تسمع شيئًا، ارفع صوت الوسائط وتأكد من الاتصال.</li></ul></div>
 <div class="panel"><div class="switch"><span>فتح كل العوالم والدروس</span><button class="ghost" id="ua">${P.all?'مفتوحة · أقفلها':'افتحها'}</button></div><p class="muted">${PART===1?'مفيد إذا كان طفلك يعرف المستوى الأول ويريد البدء من مستوى أعلى.':'مفيد إذا كان طفلك يعرف أول هذا الجزء ويريد البدء من عالم أعلى.'}</p></div>
 <div class="panel"><h3>البدء من جديد</h3><div id="rz"><button class="ghost danger" id="rs">مسح كل التقدم</button></div></div>`);
 $('#svn').onclick=()=>{P.name=$('#nm').value.trim().slice(0,24);save();toast('تم الحفظ')};
 $('#ua').onclick=()=>{P.all=!P.all;save();parents()};
 const gvb=$('#gvb');if(gvb)gvb.onclick=()=>{const n=readyBoard();if(gvb.dataset.armed){P.given=earned();save();toast(`سُجّلت ${n} ${n===1?'نجمة':'نجوم'} كمُعطاة`);parents()}else{gvb.dataset.armed='1';gvb.textContent=`تأكيد: أعطيته ${n}`;gvb.className='go'}};
 $('#tst').onclick=()=>{const m=$('#tsm');
  if(!SPEECH){m.textContent='هذا المتصفح لا يدعم الصوت. افتح الرابط في Safari أو Chrome.';return}
  m.textContent='جارٍ تشغيل صوت أولي…';
  say(SAY.test).then(ok=>{if(m.isConnected)m.textContent=ok?'إذا لم تسمع شيئًا: ارفع صوت الوسائط في الجهاز، وأطفئ الوضع الصامت في الآيفون.':'لم يُحمَّل الصوت. تأكد من الإنترنت، وافتح الصفحة من رابطها، ثم جرّب مرة ثانية.'})};
 $('#rs').onclick=()=>{$('#rz').innerHTML=`<p>هل أنت متأكد؟ ستُمسح كل النجوم والملصقات.</p><div class="btns"><button class="go" id="yes" style="background:var(--bad);box-shadow:0 5px 0 #8f2226">نعم، امسح</button><button class="ghost" id="no">إلغاء</button></div>`;
  $('#yes').onclick=()=>{P.s={};P.x={};P.m={};P.d={day:'',streak:0,best:0,n:0};P.given=0;save();toast('تم مسح التقدم');parents()};$('#no').onclick=parents};
}

/* ---------- confetti ---------- */
function confetti(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const c=$('#fx'),x=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;
 const cols=['#FFBE2E','#27A85A','#2B6FCC','#E0702A','#6447D1','#DD444A'];
 const ps=Array.from({length:110},()=>({x:Math.random()*c.width,y:-20-Math.random()*c.height*.5,vx:(Math.random()-.5)*2,vy:2+Math.random()*3,r:Math.random()*6.28,s:5+Math.random()*6,c:cols[Math.random()*6|0]}));
 const end=performance.now()+2600,run=RUN;
 (function f(now){x.clearRect(0,0,c.width,c.height);if(run!==RUN)return;ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.r+=.1;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);x.restore()});
  if(now<end)requestAnimationFrame(f);else x.clearRect(0,0,c.width,c.height)})(performance.now());
}

document.documentElement.dir='rtl';document.documentElement.lang='ar';
home();
