/* ===== زر الميكروفون: اضغط وتكلّم، أو اكتب إذا لم يعمل ===== */
const MICI='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
function micBar(root,o){
  root.innerHTML=`<div class="micwrap"><div class="micbar">
    <button class="mside" id="mkb" aria-label="اكتب بدل الكلام">⌨️</button>
    <button class="mic" id="mbtn" aria-label="اضغط وتكلّم"><span class="ring"></span>${MICI}</button>
    <button class="mside" id="mhl" aria-label="مساعدة">💡</button></div>
    <p class="live" id="mlive">${o.hint||'اضغط 🎤 وتكلّم بالإنجليزية'}</p>
    <form class="typed" id="mtf" hidden><input id="mti" dir="ltr" lang="en" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Type in English…" enterkeyhint="send"><button class="btn sm ok" type="submit">إرسال</button></form></div>
    <div id="mhelp"></div>`;
  const btn=$('#mbtn',root),live=$('#mlive',root),help=$('#mhelp',root);let state='idle',locked=false;
  const set=s=>{state=s;btn.classList.toggle('on',s==='listen');};
  const showTyped=()=>{$('#mtf',root).hidden=false;};
  function start(){if(locked)return;if(state==='listen'){stopListen();return;}
    stopSpeak();help.innerHTML='';set('listen');live.innerHTML='<span class="hear">🎧 أسمعك… تكلّم الآن</span>';buzz(15);
    listen({onLive:t=>{live.innerHTML=`<span class="en said">${esc(t)}</span>`;},
      onDone:r=>{set('idle');if(!r.text){live.textContent='لم أسمعك جيداً… اضغط 🎤 وتكلّم بصوت أوضح.';return;}
        live.innerHTML=`<span class="en said">“${esc(r.text)}”</span>`;T.spoken++;tsave();o.onText({text:r.text,alts:r.alts,conf:r.conf||0,typed:false});},
      onError:code=>{set('idle');live.textContent='';help.innerHTML=micHelp(code);showTyped();}});}
  btn.onclick=start;
  $('#mkb',root).onclick=()=>{const f=$('#mtf',root);f.hidden=!f.hidden;if(!f.hidden)$('#mti',root).focus();};
  $('#mtf',root).onsubmit=e=>{e.preventDefault();const v=$('#mti',root).value.trim();if(!v||locked)return;$('#mti',root).value='';
    live.innerHTML=`<span class="en said">“${esc(v)}”</span>`;T.typed++;tsave();o.onText({text:v,alts:[v],conf:0,typed:true});};
  $('#mhl',root).onclick=()=>{o.onHelp&&o.onHelp();};
  if(micState==='none'){help.innerHTML=micHelp('none');showTyped();}
  onClean(()=>abortListen());
  return{lock(b){locked=b;btn.disabled=b;if(b&&state==='listen')abortListen(),set('idle');},say(h){live.innerHTML=h;},typedOpen:()=>!$('#mtf',root).hidden};
}
/* نجوم الجواب: ١ تكلّمت بالإنجليزية، ٢ أجبت، ٣ بجملة كاملة */
const starRow=(n,max=3)=>`<span class="srow">${[...Array(max)].map((_,i)=>`<i class="${i<n?'on':''}">★</i>`).join('')}</span>`;
function sayEn(text,o={}){speak(text,Object.assign({lang:'en'},o));}
const roboSay=(t,o={})=>sayEn(t,Object.assign({pitch:1.35,rate:.95},o));
const zibSay=(t,o={})=>sayEn(t,Object.assign({pitch:1.3,rate:.9},o));
