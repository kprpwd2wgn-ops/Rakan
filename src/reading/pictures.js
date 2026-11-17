/* ===== كوكب الصور: اقرأ الجملة، واختر الصورة التي تطابقها تماماً =====
   كل جولة «وصف» (spec) يُرسم: set = أشياء (عدد، لون، حجم)، rel = شيء على/تحت/في/بجانب/خلف شيء آخر.
   الصورتان الخاطئتان تختلفان عن الصحيحة في شيء واحد فقط (لون، عدد، مكان…)، فالقراءة الدقيقة هي المفتاح. */
const PNUM=['','one','two','three','four','five'];
const PCOLS=['red','blue','green','yellow','orange','purple','pink','black','white','brown'];
const PDEF={cat:'orange',dog:'brown',ball:'red',apple:'red',car:'blue',flower:'pink',balloon:'red',star:'yellow',duck:'yellow',bird:'blue',teddy:'brown',box:'#c68a4e',table:'#a16207',chair:'#d97706',tree:'green'};
const PSKY=new Set(['star','balloon','bird']);
const PSET=['cat','dog','ball','apple','car','flower','balloon','star','duck','bird'];
const PPL={teddy:'teddies'};const pPl=n=>PPL[n]||n+'s';
/* ما يمكن وضعه في كل مكان */
const PBASE={box:{r:['on','in','next to','behind'],m:['cat','dog','ball','apple','teddy','duck']},
  table:{r:['on','under','next to'],m:['cat','dog','ball','apple','teddy','duck']},
  chair:{r:['on','under','next to'],m:['cat','dog','ball','teddy','duck']},
  tree:{r:['in','under'],m:{in:['bird','cat','apple'],under:['cat','dog','ball','duck','teddy']}}};
const movers=(b,r)=>{const m=PBASE[b].m;return Array.isArray(m)?m:m[r]||[];};
const RELAR={on:'على',under:'تحت',in:'في / داخل','next to':'بجانب',behind:'خلف'};

/* ---------- المراحل ---------- */
const P_LV=[
 {e:'🎨',ar:'لون وشيء',tip:'اقرأ اللون ثم الشيء: a red ball = كرة حمراء',g:r=>({t:'set',g:[{n:pk(r,PSET),c:pk(r,PCOLS),k:1}]}),m:['c','n']},
 {e:'🔢',ar:'كم عددها؟',tip:'two = ٢، three = ٣، four = ٤، five = ٥',g:r=>({t:'set',g:[{n:pk(r,PSET),k:1+Math.floor(r()*5)}]}),m:['k','n']},
 {e:'🌈',ar:'العدد واللون',tip:'اقرأ كل كلمة: العدد، ثم اللون، ثم الشيء',g:r=>({t:'set',g:[{n:pk(r,PSET),c:pk(r,PCOLS),k:2+Math.floor(r()*3)}]}),m:['k','c','n']},
 {e:'🐘',ar:'كبير وصغير',tip:'big = كبير، small = صغير',g:r=>({t:'set',g:[{n:pk(r,PSET.filter(n=>!PSKY.has(n))),c:r()<.5?pk(r,PCOLS):null,k:1,z:r()<.5?'big':'small'}]}),m:['z','z','n','c']},
 {e:'⬆️',ar:'on و under',tip:'on = على، under = تحت',g:r=>relGen(r,['table','chair'],['on','under']),m:['r','n','b']},
 {e:'📦',ar:'in و next to',tip:'in = في (داخل)، next to = بجانب',g:r=>relGen(r,['box'],['in','on','next to']),m:['r','r','n']},
 {e:'🌳',ar:'behind و in',tip:'behind = خلف، in the tree = في الشجرة',g:r=>r()<.5?relGen(r,['box'],['behind','behind','in','on']):relGen(r,['tree'],['in','under']),m:['r','n','b']},
 {e:'🎯',ar:'اللون والمكان',tip:'The red ball… انتبه للون وللمكان معاً!',g:r=>{const s=relGen(r,['table','chair','box'],null);s.m.c=pk(r,PCOLS);return s;},m:['c','r','n']},
 {e:'🍎',ar:'العدد والمكان',tip:'Two apples are… جمع = are، واحد = is',g:r=>{const s=relGen(r,['table','box','chair'],['on','under','in','next to']);s.m.k=s.b==='chair'?2:2+Math.floor(r()*2);return s;},m:['k','r','n']},
 {e:'➕',ar:'شيئان معاً',tip:'and = و: اقرأ الجزأين جيداً',g:r=>{const a=pk(r,PSET),b=pk(r,PSET.filter(x=>x!==a));return{t:'set',g:[{n:a,k:1+Math.floor(r()*3),c:r()<.5?pk(r,PCOLS):null},{n:b,k:1+Math.floor(r()*3)}]};},m:['k','k','n','c']},
 {e:'🚫',ar:'not = ليس',first:['not'],tip:'not = ليس. اقرأ الجملتين حتى النهاية!',g:r=>{const s=relGen(r,['box','table','chair'],null);const o=PBASE[s.b].r.filter(x=>x!==s.r);s.not=pk(r,o);return s;},m:['not','r','n']},
 {e:'👑',ar:'التحدي الكبير',tip:'كل شيء معاً! اقرأ بتمهّل.',mix:[2,3,7,8,9,10],n:10}
];
const pk=(r,a)=>a[Math.floor(r()*a.length)];
function relGen(r,bases,rels){for(let i=0;i<40;i++){const b=pk(r,bases),R=pk(r,rels?rels.filter(x=>PBASE[b].r.includes(x)):PBASE[b].r);if(!R)continue;const ms=movers(b,R);if(!ms.length)continue;
  return{t:'rel',m:{n:pk(r,ms),k:1},r:R,b};}return{t:'rel',m:{n:'cat',k:1},r:'on',b:'box'};}

/* ---------- الجملة ---------- */
const aan=w=>/^[aeiou]/.test(w)?'an':'a';
function npTok(g,i,def){/* a big red ball / three blue birds */
  const T=[];const adj=[g.z?{w:g.z,k:'z'+i}:null,g.c?{w:g.c,k:'c'+i}:null].filter(Boolean);
  if(g.k===1)T.push({w:def?'the':aan((adj[0]||{w:g.n}).w),k:'k'+i});else T.push({w:PNUM[g.k],k:'k'+i});
  T.push(...adj,{w:g.k===1?g.n:pPl(g.n),k:'n'+i});return T;}
function specTokens(s){let T;
  if(s.t==='set'){T=[{w:'I'},{w:'see'},...npTok(s.g[0],0)];if(s.g[1])T.push({w:'and'},...npTok(s.g[1],1));T.push({w:'.'});}
  else{const m=s.m,pl=m.k>1;T=npTok(m,0,!pl);const be={w:pl?'are':'is'};const rel=x=>x.split(' ').map(w=>({w,k:'r'}));
    if(s.not){T.push(be,{w:'not',k:'not'},...s.not.split(' ').map(w=>({w,k:'not'})),{w:'the'},{w:s.b,k:'b'},{w:'.'},{w:pl?'They':'It'},{w:pl?'are':'is'},...rel(s.r),{w:'the'},{w:s.b,k:'b'},{w:'.'});}
    else T.push(be,...rel(s.r),{w:'the'},{w:s.b,k:'b'},{w:'.'});}
  T[0]=Object.assign({},T[0],{w:T[0].w[0].toUpperCase()+T[0].w.slice(1)});return T;}
const specText=s=>specTokens(s).map(t=>t.w).join(' ').replace(/ \./g,'.');
function specHTML(s){return specTokens(s).map(t=>t.w==='.'?'.':` <span class="w" data-w="${wkey(t.w)}"${t.k?` data-k="${t.k}"`:''}>${esc(t.w)}</span>`).join('').trim();}

/* ---------- صور خاطئة تختلف في شيء واحد ---------- */
const specKey=s=>JSON.stringify(s.t==='set'?s.g.map(g=>[g.n,g.c||PDEF[g.n],g.k,g.z||'']):[s.m.n,s.m.c||PDEF[s.m.n],s.m.k,s.r,s.b]);
function mutate(s,how,r){const o=JSON.parse(JSON.stringify(s));const gi=o.t==='set'?Math.floor(r()*o.g.length):0,G=o.t==='set'?o.g[gi]:o.m;
  switch(how){
    case 'c':{if(!G.c)return null;G.c=pk(r,PCOLS.filter(c=>c!==G.c));return[o,'c'+gi];}
    case 'k':{const opts=[G.k-1,G.k+1].filter(k=>k>=1&&k<=(o.t==='set'?5:o.b==='chair'?2:3));if(!opts.length)return null;G.k=pk(r,opts);return[o,'k'+gi];}
    case 'z':{if(!G.z)return null;G.z=G.z==='big'?'small':'big';return[o,'z'+gi];}
    case 'n':{const pool=o.t==='set'?PSET.filter(n=>!o.g.some(g=>g.n===n)&&(!G.z||!PSKY.has(n))):movers(o.b,o.r).filter(n=>n!==G.n);if(!pool.length)return null;G.n=pk(r,pool);return[o,'n'+gi];}
    case 'r':{if(o.t!=='rel')return null;const rs=PBASE[o.b].r.filter(x=>x!==o.r&&x!==o.not&&movers(o.b,x).includes(o.m.n));if(!rs.length)return null;o.r=pk(r,rs);return[o,'r'];}
    case 'not':{if(!o.not)return null;if(!movers(o.b,o.not).includes(o.m.n))return null;o.r=o.not;return[o,'not'];}
    case 'b':{if(o.t!=='rel')return null;const bs=Object.keys(PBASE).filter(b=>b!==o.b&&PBASE[b].r.includes(o.r)&&movers(b,o.r).includes(o.m.n));if(!bs.length)return null;o.b=pk(r,bs);return[o,'b'];}}
  return null;}
function makeRound(L,r){
  for(let tries=0;tries<60;tries++){const s=L.g(r),seen=new Set([specKey(s)]),wrong=[];
    const order=(L.first||[]).concat(shuffle(L.m.slice()),shuffle(['c','k','n','r','b','z']));
    for(const how of order){if(wrong.length>=2)break;const m=mutate(s,how,r);if(!m)continue;const k=specKey(m[0]);if(seen.has(k))continue;seen.add(k);wrong.push({s:m[0],diff:m[1]});}
    if(wrong.length===2)return{s,opts:shuffle([{s,ok:true},...wrong])};}
  return null;}

/* ---------- الرسم ---------- */
function sceneBg(x,w,h,out){const fy=h*.86;
  if(out){const g=x.createLinearGradient(0,0,0,fy);g.addColorStop(0,'#bae6fd');g.addColorStop(1,'#e0f2fe');x.fillStyle=g;x.fillRect(0,0,w,fy);
    x.fillStyle='rgba(255,255,255,.8)';[[.15,.2],[.7,.14]].forEach(([a,b])=>{x.beginPath();x.ellipse(w*a,h*b,h*.12,h*.05,0,0,7);x.fill();});
    const gg=x.createLinearGradient(0,fy-6,0,h);gg.addColorStop(0,'#86efac');gg.addColorStop(1,'#4ade80');x.fillStyle=gg;x.fillRect(0,fy-4,w,h-fy+4);}
  else{x.fillStyle='#fef3c7';x.fillRect(0,0,w,fy);x.fillStyle='rgba(180,83,9,.08)';for(let i=0;i<w;i+=22)x.fillRect(i,0,11,fy);
    x.fillStyle='#d6a46a';x.fillRect(0,fy-3,w,h-fy+3);x.fillStyle='rgba(0,0,0,.12)';x.fillRect(0,fy-4,w,3);}
  return fy;}
function drawSpec(x,w,h,s){x.clearRect(0,0,w,h);
  if(s.t==='set'){const fy=sceneBg(x,w,h,true);const all=[];s.g.forEach((g,gi)=>{for(let k=0;k<g.k;k++)all.push({g,gi});});
    const N=all.length,gap=s.g.length>1?.6:0,slots=N+gap,anyZ=s.g.some(g=>g.z),base=Math.min(h*(anyZ?.42:.5),w/(slots+.6)*.95);let i=0;
    all.forEach((it,j)=>{if(j>0&&all[j-1].gi!==it.gi)i+=gap;const g=it.g,z=g.z==='big'?1.55:g.z==='small'?.6:1,ms=base*z*(g.z?1.1:1);
      const cx=w*.5+(i-(slots-1)/2)*(w/(slots+.6));const sky=PSKY.has(g.n);const cy=sky?h*.32+((j%2)?h*.06:0):fy-(THING_FOOT[g.n]||.25)*ms;
      paintThing(x,g.n,cx,cy,ms,g.c||PDEF[g.n],0);i++;});return;}
  const fy=sceneBg(x,w,h,s.b==='tree');const B=s.b,bs=h*{box:.6,table:.6,chair:.7,tree:.84}[B],bx=w*.36,by=fy-(THING_FOOT[B]||.3)*bs;
  const m=s.m,ms0=h*.38,R=s.r;const ms=ms0*(R==='under'?(B==='tree'?.9:.72):R==='in'&&B==='tree'?.62:1);
  const foot=(THING_FOOT[m.n]||.25)*ms,col=m.c||PDEF[m.n];
  const spread=(n,cx,wid)=>[...Array(n)].map((_,k)=>cx+(k-(n-1)/2)*wid);
  let pts=[];const half={box:.45,table:.62,chair:.34,tree:.3}[B]*bs;
  if(R==='on'){const top={box:by-.32*bs,table:by-.2*bs,chair:by-.06*bs}[B];pts=spread(m.k,bx+(B==='chair'?.04*bs:0),Math.min(ms*.75,(half*2)/m.k)).map(px=>[px,top-foot]);}
  else if(R==='under'){if(B==='tree')pts=spread(m.k,bx+.24*bs,ms*.7).map(px=>[px,fy-foot]);else pts=spread(m.k,bx,Math.min(ms*.7,half*1.4/m.k)).map(px=>[px,fy-foot]);}
  else if(R==='next to'){const x0=bx+half+ms*.5;pts=[...Array(m.k)].map((_,k)=>[x0+k*ms*.72,fy-foot]);}
  else if(R==='in'){if(B==='tree')pts=spread(m.k,bx+.04*bs,ms*.8).map((px,k)=>[px,by-.22*bs+(k%2)*ms*.25]);else pts=spread(m.k,bx,Math.min(ms*.6,.7*bs/m.k)).map(px=>[px,by-.18*bs-.1*ms]);}
  else if(R==='behind')pts=spread(m.k,bx+.34*bs,ms*.6).map(px=>[px,by-.3*bs]);
  const mv=()=>pts.forEach(p=>paintThing(x,m.n,p[0],p[1],ms,col,0));
  if(R==='behind'){mv();paintThing(x,B,bx,by,bs,PDEF[B],0);}
  else if(R==='in'&&B==='box'){paintThing(x,'boxback',bx,by,bs,PDEF[B],0);mv();paintThing(x,'boxfront',bx,by,bs,PDEF[B],0);}
  else{paintThing(x,B,bx,by,bs,PDEF[B],0);mv();}}

/* ---------- الشاشة ---------- */
def('pics',li=>{
  const L=P_LV[li],N=L.n||8,rng=Math.random;let ri=-1,R=null,miss=0,first=0,busy=false,alive=true;
  setTitle(`📸 ${L.ar}`);
  $('#view').innerHTML=`<div class="pics">
    <div class="phud"><span class="pfuel"><i id="pfl"></i></span><b id="pct"></b></div>
    <div class="psent" id="ps"></div>
    <div class="popts" id="po"></div>
    <p class="tip">💡 ${L.tip}</p></div>`;
  onClean(()=>{alive=false;});
  function hudUp(){$('#pct').textContent=`${D(Math.min(N,ri+1))} / ${D(N)}`;$('#pfl').style.width=(Math.max(0,ri)/N*100)+'%';}
  function next(){ri++;if(ri>=N)return finish();busy=false;
    const Lr=L.mix?P_LV[pick(L.mix)]:L;R=makeRound(Lr,rng);R.tries=0;const txt=specText(R.s);
    $('#ps').innerHTML=`<p class="en psx">${specHTML(R.s)}</p><div class="row"><button class="chipbtn" id="psay">🔊 اسمع</button><span class="pfb" id="pfb">👇 أي صورة تطابق الجملة؟</span></div>`;
    $('#ps').classList.remove('pop');void $('#ps').offsetWidth;$('#ps').classList.add('pop');
    $('#psay').onclick=()=>{sfx('tap');readAlong($("#ps .psx"),[txt],{rate:.8,words:true});};
    $('#po').innerHTML=R.opts.map((o,i)=>`<button class="popt" data-i="${i}" aria-label="صورة ${D(i+1)}"><canvas></canvas><span class="pmark"></span></button>`).join('');
    const cw=$('#po').clientWidth||340,wide=innerWidth>=560,w=wide?Math.floor((cw-20)/3):cw,h=Math.round(clamp(wide?w*.75:Math.min(w*.36,(innerHeight-300)/3-16),92,170)),d=Math.min(2,window.devicePixelRatio||1);
    $$('.popt canvas').forEach((c,i)=>{c.width=w*d;c.height=h*d;c.style.height=h+'px';const x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);drawSpec(x,w,h,R.opts[i].s);});
    $$('.popt').forEach(b=>b.onclick=()=>choose(+b.dataset.i,b));hudUp();}
  function choose(i,b){if(busy||b.disabled)return;const o=R.opts[i];
    if(o.ok){busy=true;if(!R.tries)first++;b.classList.add('ok');$('.pmark',b).textContent='✓';sfx('ok');buzz(20);const [x,y]=centerOf(b);FX.burst(x,y,{n:22,colors:['#22c55e','#fde047','#fff']});
      $$('.popt').forEach(e=>{if(e!==b)e.classList.add('dim');});$('#pfb').innerHTML=R.tries?'👍 صحيح!':'⭐ ممتاز! قراءة دقيقة';speak(specText(R.s),{rate:.85,words:true});
      $$('#ps .w').forEach(w=>w.classList.remove('hint'));setTimeout(()=>{if(alive)next();},1600);return;}
    R.tries++;miss++;b.disabled=true;b.classList.add('bad');$('.pmark',b).textContent='✖';sfx('no');buzz(60);shake(b);
    const ks=o.diff==='r'?['r']:[o.diff];const hw=$$('#ps .w').filter(w=>ks.includes(w.dataset.k));
    $$('#ps .w').forEach(w=>w.classList.remove('hint'));hw.forEach(w=>{w.classList.add('hint');});
    const word=hw.map(w=>w.textContent).join(' ');
    $('#pfb').innerHTML=word?`👀 اقرأ كلمة <span class="en hintw">${esc(word)}</span> مرة أخرى`:'🤔 اقرأ الجملة مرة أخرى';if(word)speak(word,{rate:.75,words:true});}
  function finish(){alive=false;const st=miss===0?3:miss<=2?2:1;RS.pics[li]=Math.max(RS.pics[li]||0,st);rsave();sfx('win');const hasNext=li+1<P_LV.length;
    resultOv({title:'📸 كل الصور صحيحة!',stars:st,gems:first+st*3,lines:[`⭐ من أول مرة: ${D(first)} من ${D(N)}`,st<3?'اقرأ كل كلمة قبل أن تختار لتحصل على ٣ نجوم':'عين دقيقة وقراءة ممتازة! 👑'],
      btns:[...(hasNext?[{label:'المرحلة التالية ←',cls:'gold big',fn:()=>go('pics',li+1,false)}]:[]),{label:'🔁 مرة أخرى',cls:'ghost',fn:()=>rerender()},{label:'🪐 المجرّة',cls:'ghost',fn:()=>home()}]});}
  next();
});
