/* ===== دفتر كلماتي: كل كلمة ضربتها في الوحوش أو ضغطتها في القراءة، مع معناها، واختبار سريع ===== */
const WEMO={};[...Object.values(CVC).flatMap(v=>v.words),...PATTERNS.flatMap(p=>p.words),...MAGIC].forEach(([w,e,ar])=>{WEMO[w]=[e,ar];});
SIGHT.forEach(s=>s.words.forEach(([w,ar])=>{const k=w.toLowerCase();if(!WEMO[k])WEMO[k]=['',ar];}));
const wMean=w=>(WEMO[w]&&WEMO[w][1])||dictAr(w)||'';
function bookWords(){const all=Object.assign({},RS.words);Object.entries(RS.zap||{}).forEach(([w,c])=>{all[w]=(all[w]||0)+c;});
  return Object.entries(all).filter(([w])=>w&&/^[a-z]+$/.test(w)).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));}
def('book',()=>{
  setTitle('📚 كلماتي');const ws=bookWords(),n=ws.length,goals=[10,25,50,100,200,400],g=goals.find(x=>x>n)||n;
  const quizable=ws.filter(([w])=>wMean(w)).length>=4;
  $('#view').innerHTML=`<div class="btop"><b>${D(n)}</b><span>كلمة إنجليزية في دفترك!<small>الهدف التالي: ${D(g)} كلمة 🏆</small></span></div>
    <div class="bbar big"><i style="width:${Math.min(100,n/g*100)}%"></i></div>
    ${quizable?'<button class="btn gold big wide" id="bq">🧠 اختبر نفسك: ما معنى الكلمة؟</button>':''}
    <p class="muted small">اضغط أي كلمة لتسمعها. الكلمات تدخل الدفتر عندما تضرب وحشها أو تضغطها في القراءة.</p>
    <div class="bgrid">${n?ws.map(([w,c])=>{const e=WEMO[w]&&WEMO[w][0];return `<button class="bwd" data-w="${esc(w)}">${e?`<span class="be">${e}</span>`:''}<b class="en">${esc(w)}</b><small>${esc(wMean(w)||'🔊')}</small>${c>2?`<i>×${D(c)}</i>`:''}</button>`;}).join('')
      :'<p class="muted cen">الدفتر فارغ الآن. اضرب وحوش الكلمات 👾 واضغط الكلمات في القصص 📖 لتملأه!</p>'}</div>`;
  $$('.bwd').forEach(b=>b.onclick=()=>{sfx('tap');speak(b.dataset.w,{rate:.8});shake(b,'pop');});
  if($('#bq'))$('#bq').onclick=()=>go('bquiz');
});
def('bquiz',()=>{
  setTitle('🧠 اختبر نفسك');const ws=bookWords().map(x=>x[0]).filter(wMean);const N=Math.min(6,ws.length);
  /* الكلمات الأقل تكراراً أولاً قليلاً، حتى نراجع ما نسيناه */
  const qs=shuffle(ws.slice()).sort((a,b)=>((RS.words[a]||0)+(RS.zap[a]||0))-((RS.words[b]||0)+(RS.zap[b]||0))+(Math.random()-.5)*4).slice(0,N);
  let qi=0,right=0,locked=false;
  function ask(){if(qi>=N)return end();locked=false;const w=qs[qi],ar=wMean(w);
    const others=shuffle([...new Set(ws.filter(x=>x!==w).map(wMean).concat(Object.values(DICT)).filter(a=>a&&a!==ar))]).slice(0,2);
    const ch=shuffle([ar,...others]),e=WEMO[w]&&WEMO[w][0];
    $('#view').innerHTML=`<div class="bq"><div class="phud"><span class="pfuel"><i style="width:${qi/N*100}%"></i></span><b>${D(qi+1)} / ${D(N)}</b></div>
      <div class="bqw"><button class="cbtn" id="bqs" aria-label="اسمع">🔊</button><b class="en">${esc(w)}</b></div>
      <p class="muted cen">ما معنى هذه الكلمة؟</p>
      <div class="bqc">${ch.map(a=>`<button class="btn ghost wide" data-a="${esc(a)}">${esc(a)}</button>`).join('')}</div></div>`;
    $('#bqs').onclick=()=>speak(w,{rate:.8});speak(w,{rate:.8});
    $$('.bqc .btn').forEach(b=>b.onclick=()=>{if(locked)return;locked=true;
      if(b.dataset.a===ar){right++;b.classList.add('ok');sfx('ok');const [x,y]=centerOf(b);FX.burst(x,y,{n:18});FX.text(x,y-20,`${e||'⭐'} ✓`,'#fde047',24);}
      else{b.classList.add('no');sfx('no');shake(b);$$('.bqc .btn').forEach(o=>{if(o.dataset.a===ar)o.classList.add('ok');});}
      setTimeout(()=>{qi++;ask();},1200);});}
  function end(){const st=right===N?3:right>=N-2?2:1;sfx('win');
    resultOv({title:'🧠 انتهى الاختبار!',stars:st,gems:right,lines:[`✅ إجابات صحيحة: ${D(right)} من ${D(N)}`,st<3?'كرّر الاختبار لتتذكر الكلمات أكثر':'ذاكرة رائعة! 👑'],
      btns:[{label:'🔁 اختبار جديد',cls:'gold big',fn:()=>rerender()},{label:'📚 الدفتر',cls:'ghost',fn:()=>back()}]});}
  ask();
});
