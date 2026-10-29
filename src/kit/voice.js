/* ===== الصوت: النطق (بلا موسيقى) والاستماع ===== */
const TTS='speechSynthesis' in window;let VOICE={en:null,ar:null};
function pickVoices(){if(!TTS)return;const vs=speechSynthesis.getVoices();
  const pref=[/Samantha/i,/Google US English/i,/Aria/i,/Jenny/i,/Microsoft.*(Zira|Ana)/i,/en[-_]US/i,/Karen|Moira|Tessa/i,/en[-_]GB/i];
  const en=vs.filter(v=>/^en/i.test(v.lang));VOICE.en=null;for(const p of pref){const v=en.find(v=>p.test(v.name)||p.test(v.lang));if(v){VOICE.en=v;break;}}if(!VOICE.en)VOICE.en=en[0]||null;
  const ar=vs.filter(v=>/^ar/i.test(v.lang));VOICE.ar=ar.find(v=>/SA|Maged|Tarik|Hamed|Zariyah/i.test(v.name+v.lang))||ar[0]||null;}
if(TTS){pickVoices();speechSynthesis.onvoiceschanged=pickVoices;}
let sayTok=0;
function speak(text,o={}){
  const tok=++sayTok;let ended=false;const end=()=>{if(ended)return;ended=true;if(o.el)o.el.classList.remove('talking');if(tok===sayTok&&o.onend)o.onend();};
  const lang=o.lang||'en';
  if(!TTS||(lang==='ar'&&(!VOICE.ar||!World.p.voiceAr))){setTimeout(end,o.lang==='ar'?10:400);return;}
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,''));
    u.lang=lang==='ar'?'ar-SA':'en-US';const v=VOICE[lang];if(v)u.voice=v;u.rate=(o.rate||(lang==='ar'?.95:.92))*(lang==='en'?(World.p.rate||1):1);u.pitch=o.pitch||1.05;
    u.onstart=()=>{if(o.el&&tok===sayTok)o.el.classList.add('talking');};
    if(o.onboundary)u.onboundary=e=>{if(tok===sayTok&&e.name!=='sentence')o.onboundary(e.charIndex);};
    u.onend=u.onerror=end;speechSynthesis.speak(u);setTimeout(end,1800+String(text).length*90/u.rate);
  }catch(e){end();}
}
const sayAr=(t,o={})=>speak(t,Object.assign({lang:'ar'},o));
function stopSpeak(){sayTok++;if(TTS)try{speechSynthesis.cancel();}catch(e){}}
document.addEventListener('pointerdown',()=>{try{if(TTS){const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u);}}catch(e){}},{once:true});

/* ---------- الاستماع للميكروفون ---------- */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const UA=navigator.userAgent||'';
const IOS=/iPad|iPhone|iPod/.test(UA)||(/Macintosh/.test(UA)&&navigator.maxTouchPoints>1);
const ANDROID=/Android/i.test(UA);
const STANDALONE=window.navigator.standalone===true||(!!window.matchMedia&&matchMedia('(display-mode: standalone)').matches);
const EMBEDDED=(()=>{try{return window.top!==window.self;}catch(e){return true;}})()&&!/github\.io$/.test(location.hostname);
let micState=!SR?'none':EMBEDDED?'embedded':'ready';
let rec=null,recStop=null,listenTok=0;
function listen({onLive,onDone,onError}){
  abortListen();
  if(!SR){onError&&onError('none');return;}
  let r;try{r=new SR();}catch(e){onError&&onError('none');return;}
  const tok=++listenTok;rec=r;let text='',alts=[],err='',done=false,hard=null;
  r.lang='en-US';r.interimResults=true;r.continuous=false;try{r.maxAlternatives=3;}catch(e){}
  let conf=0;
  r.onresult=e=>{const res=Array.from(e.results);text=res.map(x=>x[0].transcript).join(' ').replace(/\s+/g,' ').trim();
    const cs=res.filter(x=>x.isFinal).map(x=>x[0].confidence||0).filter(c=>c>0);conf=cs.length?cs.reduce((a,b)=>a+b,0)/cs.length:0;
    const last=res[res.length-1];const pre=res.slice(0,-1).map(x=>x[0].transcript).join(' ');
    alts=last?Array.from(last).map(a=>(pre+' '+a.transcript).replace(/\s+/g,' ').trim()).filter(Boolean):[text];
    if(tok===listenTok&&onLive)onLive(text);};
  r.onerror=e=>{err=e.error||'error';};
  const finish=()=>{if(done)return;done=true;clearTimeout(hard);if(rec===r){rec=null;recStop=null;}if(tok!==listenTok)return;
    if(text){if(micState!=='embedded')micState='ok';onDone&&onDone({text,alts:alts.length?alts:[text],conf});}
    else if(err&&err!=='no-speech'&&err!=='aborted'){onError&&onError(err);}
    else onDone&&onDone({text:'',alts:[]});};
  r.onend=finish;
  recStop=()=>{try{r.stop();}catch(e){}setTimeout(finish,1600);};
  hard=setTimeout(()=>{if(recStop)recStop();},12000);
  try{r.start();}catch(e){err='start';setTimeout(finish,0);}
}
function stopListen(){if(recStop)recStop();}
function abortListen(){listenTok++;if(rec){try{rec.abort();}catch(e){}}rec=null;recStop=null;}
function micHelp(code){
  let title='الميكروفون لم يعمل',steps=[],link=false;
  if(code==='embedded'||(EMBEDDED&&/not-allowed/.test(code))){title='الميكروفون لا يعمل داخل هذه الصفحة';steps=['افتح اللعبة من رابط GitHub، فهناك يعمل الميكروفون:'];link=true;}
  else if(code==='none'){title='هذا المتصفح لا يفهم الكلام';steps=[IOS?'افتح رابط اللعبة في متصفح Safari.':'افتح رابط اللعبة في متصفح Google Chrome.'];link=true;}
  else if(code==='not-allowed'){steps=IOS?['اسمح لـ Safari بالميكروفون: الإعدادات ← Safari ← الميكروفون ← «اسمح».','أغلق الصفحة وافتحها من جديد، ثم اضغط «اسمح» عندما يسألك.']
      :ANDROID?['اضغط رمز القفل 🔒 بجانب عنوان الصفحة في الأعلى.','اختر «الأذونات» ← «الميكروفون» ← «سماح».','أعد تحميل الصفحة وجرّب مرة أخرى.']
      :['اضغط رمز القفل 🔒 بجانب عنوان الصفحة واسمح بالميكروفون، ثم أعد تحميل الصفحة.'];}
  else if(code==='service-not-allowed'){steps=IOS?['شغّل الإملاء: الإعدادات ← عام ← لوحة المفاتيح ← «تفعيل الإملاء».','تأكد أن Siri والإملاء غير ممنوعين في «مدة استخدام الجهاز».',STANDALONE?'إذا لم يعمل من أيقونة الشاشة الرئيسية، افتح الرابط في Safari مباشرة.':'ثم أغلق الصفحة وافتحها من جديد.']
      :ANDROID?['تأكد أن تطبيق Google مثبّت ومحدّث، وأن «الكتابة بالصوت» مفعّلة.','اسمح لـ Chrome بالميكروفون من إعدادات الهاتف.']
      :['اسمح للمتصفح بالميكروفون، ثم أعد تحميل الصفحة. يعمل أفضل في Google Chrome.'];}
  else if(code==='network')steps=['فهم الكلام يحتاج إلى الإنترنت. تأكد من الاتصال ثم حاول مرة أخرى.'];
  else if(code==='audio-capture')steps=['لم أجد ميكروفوناً يعمل. أغلق أي مكالمة أو تطبيق يستخدم الميكروفون، ثم حاول.'];
  else steps=['حدث خطأ بسيط. اضغط الميكروفون مرة أخرى.'];
  return `<div class="michelp"><h3>🎤 ${title}</h3><ol>${steps.filter(Boolean).map(s=>`<li>${s}</li>`).join('')}</ol>
    ${link?`<div class="linkbox"><span class="en">${APP.gh}</span><button class="btn sm" data-copy>📋 نسخ</button><a class="btn sm ok" href="${APP.gh}" target="_blank" rel="noopener">افتح ↗</a></div>`:''}</div>`;
}
document.addEventListener('click',e=>{const t=e.target.closest('[data-copy]');if(!t)return;
  const sel=()=>{const s=t.parentElement.querySelector('.en');if(!s)return;const r=document.createRange();r.selectNodeContents(s);const g=getSelection();g.removeAllRanges();g.addRange(r);toast('الرابط محدّد، انسخه 📋');};
  try{navigator.clipboard.writeText(APP.gh).then(()=>toast('تم نسخ الرابط ✅'),sel);}catch(err){sel();}});

/* ---------- تنظيف النص المسموع ---------- */
const NUMW=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
function normS(t){return String(t||'').toLowerCase().replace(/[’‘`]/g,"'").replace(/(\d+)(am|pm)\b/g,'$1 $2')
  .replace(/\b(\d{3,6})\b/g,m=>m.split('').join(' ')).replace(/\b(\d+)\b/g,(m,d)=>NUMW[+d]||d)
  .replace(/n't\b/g,' not').replace(/'m\b/g,' am').replace(/'re\b/g,' are').replace(/'s\b/g,' is').replace(/'d\b/g,' would').replace(/'ll\b/g,' will').replace(/'ve\b/g,' have')
  .replace(/\bwo not\b/g,'will not').replace(/\bca not\b/g,'can not').replace(/\bcannot\b/g,'can not').replace(/\blet is\b/g,'let us')
  .replace(/[^a-z\s]/g,' ').replace(/\s+/g,' ').trim();}
