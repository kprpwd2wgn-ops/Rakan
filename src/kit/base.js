/* ===== عدّة «عالم البطل» المشتركة: الأساس ===== */
const AR='٠١٢٣٤٥٦٧٨٩';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rint=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dayKey=(d=new Date())=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
function seeded(seed){let h=1779033703^seed.length;for(let i=0;i<seed.length;i++){h=Math.imul(h^seed.charCodeAt(i),3432918353);h=h<<13|h>>>19;}
  return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);h^=h>>>16;return(h>>>0)/4294967296;};}
function loadJSON(key,def){try{const r=localStorage.getItem(key);return r?Object.assign(def(),JSON.parse(r)):def();}catch(e){return def();}}
function saveJSON(key,v){try{localStorage.setItem(key,JSON.stringify(v));}catch(e){}}
const D=s=>(typeof World!=='undefined'&&World.p&&World.p.digits==='en')?String(s):String(s).replace(/[0-9]/g,d=>AR[d]);

/* ---------- التنقّل بين الشاشات ---------- */
const SCREENS={};let cur=null,stack=[],cleanups=[],keyHandler=null;
function def(name,fn,opt={}){SCREENS[name]={fn,opt};}
function onClean(f){cleanups.push(f);}
function clean(){const c=cleanups;cleanups=[];c.forEach(f=>{try{f();}catch(e){}});keyHandler=null;$$('.ov').forEach(o=>o.remove());stopSpeak();}
function show(){const d=SCREENS[cur.name];document.body.dataset.screen=cur.name;document.body.classList.toggle('full',!!d.opt.full);d.fn(cur.arg);window.scrollTo(0,0);hud();}
function go(name,arg,push=true){if(push&&cur)stack.push(cur);clean();cur={name,arg};show();}
function back(){clean();cur=stack.pop()||{name:APP.home};show();}
function rerender(){clean();show();}
function home(){stack=[];go(APP.home,null,false);}
document.addEventListener('keydown',e=>{if(keyHandler)keyHandler(e);});
function setTitle(t,showBack=true){$('#ttl').innerHTML=t||APP.title;$('#back').hidden=!showBack;}
function hud(){const g=$('#hgems');if(g)g.innerHTML=`💎 <b>${D(World.p.gems)}</b>`;const m=$('#hhero');if(m)m.innerHTML=heroSVG(World.p.hero,{face:'happy',head:true});}
function toast(h,ms=2400){const t=document.createElement('div');t.className='toast';t.innerHTML=h;$('#toasts').appendChild(t);setTimeout(()=>t.remove(),ms);}
const starsHTML=(n,max=3)=>'<span class="stars">'+[...Array(max)].map((_,i)=>i<n?'★':'<span class="off">★</span>').join('')+'</span>';
const wait=(ms,alive)=>new Promise(r=>setTimeout(()=>r(alive?alive():true),ms));

/* ---------- لوحة الأرقام ---------- */
function keypadHTML(go='✓'){return `<div class="kp" dir="ltr">${[1,2,3,4,5,6,7,8,9].map(n=>`<button class="k" data-k="${n}">${D(n)}</button>`).join('')}<button class="k del" data-k="del" aria-label="مسح">⌫</button><button class="k" data-k="0">${D(0)}</button><button class="k go" data-k="ok" aria-label="تأكيد">${go}</button></div>`;}
function bindKeypad(root,{onChange,onSubmit,max=3}){
  let v='',on=true;const press=k=>{if(!on)return;if(k==='del')v=v.slice(0,-1);else if(k==='ok'){if(v!=='')onSubmit(+v);return;}else if(v.length<max)v=(v==='0'?'':v)+k;onChange&&onChange(v);};
  $$('.k',root).forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();b.classList.add('pr');setTimeout(()=>b.classList.remove('pr'),120);press(b.dataset.k);}));
  keyHandler=e=>{if(e.target&&e.target.tagName==='INPUT')return;const ch=e.key;const n=/^[0-9]$/.test(ch)?ch:(AR.indexOf(ch)>=0&&ch.length===1?String(AR.indexOf(ch)):null);
    if(n!==null){press(n);e.preventDefault();}else if(ch==='Backspace'){press('del');e.preventDefault();}else if(ch==='Enter'){press('ok');e.preventDefault();}};
  return{reset(){v='';onChange&&onChange(v);},get value(){return v;},lock(x){on=!x;}};
}

/* ---------- شاشة النتيجة ---------- */
function resultOv({title,stars=null,big=null,lines=[],gems=0,chest=null,btns=[],hero=true,mood='happy'}){
  const ov=document.createElement('div');ov.className='ov';
  ov.innerHTML=`<div class="res" role="dialog" aria-modal="true">
    ${hero?`<div class="reshero bob">${heroSVG(World.p.hero,{face:mood,pose:mood==='happy'?'cheer':'idle'})}</div>`:''}
    <h2>${title}</h2>
    ${stars!==null?`<div class="bigs">${[0,1,2].map(i=>`<span class="${i<stars?'on':''}">★</span>`).join('')}</div>`:''}
    ${big!==null?`<div class="bigscore">${big}</div>`:''}
    ${gems?`<div class="gemgain">💎 +<b id="gg">${D(0)}</b></div>`:''}
    <ul>${lines.filter(Boolean).map(l=>`<li>${l}</li>`).join('')}</ul>
    <div class="btns">${btns.map((b,i)=>`<button class="btn ${b.cls||''}" data-b="${i}">${b.label}</button>`).join('')}</div></div>`;
  document.body.appendChild(ov);
  btns.forEach((b,i)=>ov.querySelector(`[data-b="${i}"]`).onclick=()=>{ov.remove();b.fn();});
  if(gems){World.add(gems);let k=0;const step=Math.max(1,Math.ceil(gems/20));const iv=setInterval(()=>{k=Math.min(gems,k+step);const g=ov.querySelector('#gg');if(g)g.textContent=D(k);if(k>=gems)clearInterval(iv);},40);}
  if(stars===null||stars>0)FX.confetti();
  if(chest)setTimeout(()=>openChest(chest),700);
  return ov;
}
