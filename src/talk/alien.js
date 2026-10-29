/* ===== محطة الفضاء: زِب يسأل، وأنت تجيب بكلامك ===== */
const CATRE={};Object.entries(CATS).forEach(([k,v])=>{CATRE[k]=v.split('|').sort((a,b)=>b.length-a.length).map(w=>({w,re:new RegExp('\\b'+w.replace(/ /g,'\\s+')+'(?:s|es)?\\b')}));});
const NOARTS=new Set(NOART.split('|'));
const art=x=>NOARTS.has(x)?'':/^[aeiou]/.test(x)?'an':'a';
const cap=x=>PROPER[x]||x.replace(/\b[a-z]/g,c=>c.toUpperCase());
const IRR={fish:'fish',sheep:'sheep',mouse:'mice',deer:'deer',fox:'foxes',wolf:'wolves',butterfly:'butterflies',puppy:'puppies',bunny:'bunnies',octopus:'octopuses',strawberry:'strawberries',cherry:'cherries',peach:'peaches',mango:'mangoes',potato:'potatoes',tomato:'tomatoes'};
const plural=x=>IRR[x]||(/(s|sh|ch|x)$/.test(x)?x+'es':x+'s');
function catFind(cats,t){for(const c of cats.split(',')){for(const e of (CATRE[c]||[]))if(e.re.test(t))return e.w;}return'';}
const fillN=s=>String(s||'').replace(/\{name\}/g,World.p.name||'friend');
function relevant(st,t){const x=st.cat?catFind(st.cat,t):'';let ok=!!x;
  if(!ok&&st.re){const n=normS(World.p.name||'');ok=new RegExp('\\b(?:'+st.re.replace(/\{name\}/g,n||'zzzz')+')\\b').test(t);}return{ok,x};}
const subst=(s,x)=>s.replace(/\{X\}/g,cap(x)).replace(/\{xs\}/g,plural(x)).replace(/\{xa\}/g,COLAR[x]||x).replace(/\{x\}/g,x);
function modelOf(st,x){if(st.tpl&&x)return subst(st.tpl.replace(/\{a\}\s*/g,()=>{const a=art(x);return a?a+' ':'';}),x);return fillN(st.ex);}
const GENERIC=[['Great!','رائع!'],['Cool!','جميل!'],['Nice!','حلو!'],['Awesome!','مدهش!'],['Good answer!','جواب جيد!']];
function reactOf(st,t,x){for(const [p,en,ar] of (st.react||[]))if(new RegExp('\\b(?:'+p+')\\b').test(t))return[en,ar];
  if(st.after){if(/\{(X|x|xs|xa)\}/.test(st.after.join(' '))&&!x)return pick(GENERIC);return[subst(st.after[0],x),subst(st.after[1],x)];}return pick(GENERIC);}
/* النجوم: ١ تكلّمت بالإنجليزية، ٢ أجبت عن السؤال، ٣ بجملة كاملة */
function evalAns(st,res){const alts=(res.alts&&res.alts.length?res.alts:[res.text]).filter(Boolean);
  let best=alts[0]||'',rel={ok:false,x:''};for(const a of alts){const r=relevant(st,normS(a));if(r.ok){best=a;rel=r;break;}}
  const t=normS(best),n=t?t.split(' ').length:0,spoke=n>0,full=n>=(st.min||3);
  return{stars:spoke?1+(rel.ok?1:0)+(rel.ok&&full?1:0):0,spoke,rel,full,raw:best,x:rel.x,model:modelOf(st,rel.x),norm:t};}
const ALLW=new Set(Object.values(CATS).join('|').split('|').concat(['yes','no','please','thank','thanks','hello','hi','bye','goodbye','my','name','like','love','favorite','want','have','can','eat','drink','wear','play','birthday','happy','night','morning']));
const HEADW=/^(hat|cap|crown|helmet|sunglasses|glasses)$/;
const NUMV=x=>{const i=NUMW.indexOf(x);return i>=0?i:x==='hundred'?100:x==='thousand'?1000:x==='million'?1000000:null;};

def('alien',vi=>{
  const V=VISITS[vi],N=V.steps.length;let si=0,tries=0,scores=[],col=T.zcol||'#a3e635',mood='happy',held=null,heldSz=1,heldGlow=null,hat=null,busy=false,bonusFor=-1,fresh=0,fulls=0,alive=true;
  setTitle(`👽 ${V.ar}`);
  $('#view').innerHTML=`<div class="al">
    <div class="adots" id="ad"></div>
    <div class="astage" id="as"><div class="ufo">🛸</div><div class="zw" id="zw"></div><div class="ahero">${heroSVG(World.p.hero,{face:'smile'})}</div><div class="afx" id="afx"></div><div class="asign" id="asg" hidden></div></div>
    <div class="qbub"><button class="qsay" id="qs" aria-label="اسمع السؤال">🔊</button><div class="qtx"><p class="en qen" id="qen"></p><p class="qar" id="qar"></p></div></div>
    <div class="ans" id="ans" hidden></div>
    <div id="mic"></div></div>`;
  onClean(()=>{alive=false;});
  const stg=$('#as');
  function zib(){$('#zw').innerHTML=zibSVG({col,mood})+(hat?`<span class="zhat">${hat}</span>`:'')+(held?`<span class="zheld" style="--hs:${heldSz};${heldGlow?`--hg:${heldGlow}`:''}">${held}</span>`:'');}
  let moodT=0;function setMood(m,ms){mood=m;zib();clearTimeout(moodT);if(ms)moodT=setTimeout(()=>{if(alive){mood='happy';zib();}},ms);}
  function dots(){$('#ad').innerHTML=V.steps.map((_,k)=>`<i class="${k<si?'done':k===si?'on':''}">${k<si?'★':''}</i>`).join('');}
  function sign(h){const s=$('#asg');s.innerHTML=h;s.hidden=false;s.classList.remove('pop');void s.offsetWidth;s.classList.add('pop');}
  function particles(list,cls,n=14){const fx=$('#afx');for(let k=0;k<n;k++){const e=document.createElement('span');e.className='ptc '+cls;e.textContent=pick([].concat(list));
      e.style.left=(Math.random()*92+2)+'%';e.style.animationDelay=(Math.random()*1.2)+'s';e.style.fontSize=(16+Math.random()*16)+'px';fx.appendChild(e);setTimeout(()=>e.remove(),4200);}}
  function weather(x){stg.classList.remove('rainy','snowy','sunny','night');
    if(/rain/.test(x)){stg.classList.add('rainy');particles(['💧'],'fall',22);}else if(/snow|cold|winter/.test(x)){stg.classList.add('snowy');particles(['❄️'],'fall',20);}
    else if(/sun|hot|summer|warm|nice/.test(x)){stg.classList.add('sunny');sign('☀️');}else if(/wind|dust/.test(x))particles(['🍃','💨'],'blow',14);
    else if(/cloud|fog|cool/.test(x))particles(['☁️'],'blow',8);else if(/spring/.test(x))particles(['🌸','🌷'],'fall',16);else if(/autumn|fall/.test(x))particles(['🍂','🍁'],'fall',16);else if(/storm/.test(x))particles(['⛈️','⚡'],'fall',10);}
  function fx(st,e){const [kind,arg]=(st.fx||'').split(':'),x=e.x||'';const em=arg?(EMO[arg]||arg):EMO[x];
    switch(kind){
      case 'name':{const m=e.norm.match(/\b(?:my name is|name is|i am|call me|it is)\s+([a-z]+)/);const nm=m?cap(m[1]):(World.p.name||'');if(nm)sign(`👋 <span class="en">${esc(nm)}</span>`);break;}
      case 'mood':setMood(/sad|angry|bored|sick|not good|scared/.test(e.norm)?'sad':/tired|sleepy/.test(e.norm)?'sad':/happy|great|excited|amazing|awesome|super|fine|good/.test(e.norm)?'laugh':'happy',2600);break;
      case 'num':{const n=NUMV(x);if(n!=null)sign(`🎈 ${D(n)} 🎈`);break;}
      case 'globe':if(x)sign(`🌍 <span class="en">${esc(cap(x))}</span>`);break;
      case 'color':if(COLHEX[x]){col=COLHEX[x];T.zcol=col;tsave();zib();const [cx,cy]=centerOf($('#zw'));FX.burst(cx,cy,{n:30,colors:[col,'#fff',col]});}break;
      case 'sky':if(COLHEX[x])stg.style.setProperty('--sky',COLHEX[x]);break;
      case 'grass':if(COLHEX[x])stg.style.setProperty('--ground',COLHEX[x]);break;
      case 'show':if(em){held=em;heldSz=1;heldGlow=null;zib();}break;
      case 'eat':if(em){const fx2=$('#afx'),e2=document.createElement('span');e2.className='ptc eat';e2.textContent=em;fx2.appendChild(e2);setTimeout(()=>e2.remove(),1300);
        setTimeout(()=>{if(alive)setMood('chew',1600);},900);}break;
      case 'wear':if(em){if(HEADW.test(x))hat=em;else{held=em;heldSz=1;}zib();}break;
      case 'hearts':particles(['❤️','💕','💖'],'rise',16);break;
      case 'fly':if(em){const fx2=$('#afx'),e2=document.createElement('span');e2.className='ptc flyby';e2.textContent=em;fx2.appendChild(e2);setTimeout(()=>e2.remove(),3200);}break;
      case 'count':{const n=Math.min(10,NUMV(x)||5),it=arg?(EMO[arg]||'⭐'):(held||'⭐');sign(it.repeat(n));break;}
      case 'size':if(EMO[x]){held=EMO[x];}if(held){heldSz=/big|large|huge|giant/.test(e.norm)||/elephant|whale|giraffe|hippo|dinosaur/.test(x)?2.1:/small|little|tiny/.test(e.norm)?.55:1.3;zib();}break;
      case 'tint':if(COLHEX[x]){heldGlow=COLHEX[x];if(!held)held='🎁';zib();}break;
      case 'party':FX.confetti();particles(['🎈','🎉','🎊'],'rise',14);break;
      case 'night':stg.classList.add('night');break;
      case 'jump':{const z=$('#zw');z.classList.remove('jump');void z.offsetWidth;z.classList.add('jump');setMood('laugh',1800);break;}
      case 'coin':World.add(5);{const [cx,cy]=centerOf($('#zw'));FX.burst(cx,cy,{n:20,emoji:['💎'],speed:240,size:4});}toast('💎 +٥ هدية من زِب!');break;
      case 'weather':weather(arg||x||e.norm);break;}}
  function ask(){const st=V.steps[si];tries=0;bonusFor=-1;$('#ans').hidden=true;
    $('#qen').textContent=fillN(st.q);$('#qar').textContent=fillN(st.qa);dots();setMood('talk');busy=false;mic.lock(false);
    zibSay(fillN(st.q),{onend:()=>{if(alive&&mood==='talk')setMood('happy');}});}
  function hl(raw,x){const r=esc(raw);if(!x)return r;try{return r.replace(new RegExp('\\b('+x.replace(/ /g,'\\s+')+')(s|es)?\\b','i'),'<mark>$1$2</mark>');}catch(err){return r;}}
  function showAns(e,ok,note,rep){const a=$('#ans');const s=ok?Math.max(1,scores[si]||1):0;
    a.innerHTML=`${ok?`<div class="arow">${starRow(s)}<b>${['','تكلّمت بالإنجليزية 👍','فهمتك! 👏','جملة كاملة! 🌟'][s]}</b></div>`:''}
      <p class="en said">“${hl(e.raw,e.x)}”</p>
      ${rep?`<p class="zrep"><b class="en">${esc(rep[0])}</b><span>${rep[1]}</span></p>`:''}
      ${note?`<p class="note">${note}</p>`:''}
      ${ok&&e.rel.ok&&!e.full?`<p class="better">✨ قلها كاملة: <span class="en">${esc(e.model)}</span> <button class="mini2" id="bsay" aria-label="اسمع">🔊</button><br><small>اضغط 🎤 وقلها كاملة لتربح نجمة إضافية!</small></p>`:''}
      ${ok?`<button class="btn gold big wide" id="anext">${si<N-1?'السؤال التالي ←':'🏁 النهاية'}</button>`:''}`;
    a.hidden=false;if($('#bsay'))$('#bsay').onclick=()=>sayEn(e.model,{rate:.85});if($('#anext'))$('#anext').onclick=next;}
  function next(){stopSpeak();si++;if(si>=N)return finish();ask();}
  function onText(r){if(busy)return;const st=V.steps[si],e=evalAns(st,r);
    if(bonusFor===si){if(e.rel.ok&&e.full){scores[si]=3;fulls++;T.full++;tsave();bonusFor=-1;const [x,y]=centerOf($('#ans'));FX.burst(x,y,{n:24});zibSay('Perfect sentence!');
        showAns(e,true,'⭐ رائع! جملة كاملة.',['Perfect sentence!','جملة ممتازة!']);}
      else{zibSay(e.model,{rate:.85});showAns(e,true,`حاول أن تقول: <span class="en">${esc(e.model)}</span>`);}return;}
    if(!e.spoke){mic.say('لم أسمع كلمات إنجليزية… جرّب مرة أخرى');return;}
    if(!e.rel.ok&&tries<2){tries++;setMood('wow',1800);
      if(tries===1){zibSay("Hmm? I don't understand. Can you say it again?");showAns(e,false,'همم؟ لم يفهم زِب. قلها مرة أخرى بطريقة أخرى!');}
      else{zibSay('Try like this: '+fillN(st.ex),{rate:.85});showAns(e,false,`💡 جرّب مثلاً: <span class="en">${esc(fillN(st.ex))}</span><br><small>${fillN(st.exa)}</small>`);}return;}
    const stars=e.rel.ok?e.stars:1;scores[si]=Math.max(scores[si]||0,stars);
    if(e.rel.ok&&e.full){fulls++;T.full++;}
    fresh+=learnWords(e.x&&e.x.includes(' ')?e.norm.replace(e.x,' ').split(' ').filter(w=>ALLW.has(w)).concat([e.x]):e.norm.split(' ').filter(w=>ALLW.has(w)));
    if(e.rel.ok)fx(st,e);
    const rep=e.rel.ok?reactOf(st,e.norm,e.x):["Okay! Let's go on.",'حسناً! لنكمل.'];
    zibSay(rep[0]);showAns(e,true,null,rep);if(e.rel.ok&&!e.full)bonusFor=si;}
  function finish(){busy=true;mic.lock(true);const tot=scores.reduce((a,b)=>a+(b||0),0),pct=tot/(3*N),stars=pct>=.85?3:pct>=.6?2:1;
    T.alien[vi]=Math.max(T.alien[vi]||0,stars);tsave();zibSay('Thank you, my Earth friend!');
    const hasNext=vi+1<VISITS.length;
    resultOv({title:'👽 زِب سعيد جداً!',stars,gems:Math.round(tot/2)+stars*2,
      lines:[`🌟 جمل كاملة: ${D(fulls)} من ${D(N)}`,fresh?`📚 كلمات جديدة: ${D(fresh)}`:'',stars<3?'أجب بجمل كاملة لتحصل على ٣ نجوم':'متحدث رائع! 👑'],
      btns:[...(hasNext?[{label:'الزيارة التالية ←',cls:'gold big',fn:()=>go('alien',vi+1,false)}]:[]),{label:'🔁 مرة أخرى',cls:'ghost',fn:()=>rerender()},{label:'🏙️ المدينة',cls:'ghost',fn:()=>home()}]});}
  const mic=micBar($('#mic'),{onText,hint:'اضغط 🎤 وأجب زِب بالإنجليزية',onHelp:()=>{const st=V.steps[si];zibSay(fillN(st.ex),{rate:.85});
    showAns({raw:'…',x:'',rel:{ok:false},full:false,model:''},false,`💡 مثال: <span class="en">${esc(fillN(st.ex))}</span><br><small>${fillN(st.exa)}</small><br>قلها بكلماتك أنت!`);}});
  $('#qs').onclick=()=>{const st=V.steps[si];if(st)zibSay(fillN(st.q),{rate:.82});};
  zib();setTimeout(()=>{if(alive)ask();},350);
});
