/* ===== كوكب الوحوش: اقرأ الكلمة واضرب الوحش الصحيح ===== */
const ham=(a,b)=>{let d=0;for(let i=0;i<a.length;i++)if(a[i]!==b[i])d++;return d;};
function lookAlikes(w,pool,n){const lw=w.toLowerCase(),P=[...new Set(pool.map(x=>x.toLowerCase()))].filter(x=>x!==lw);
  const same=P.filter(x=>x.length===lw.length),d1=shuffle(same.filter(x=>ham(x,lw)===1)),d2=shuffle(same.filter(x=>ham(x,lw)===2));
  const near=shuffle(P.filter(x=>Math.abs(x.length-lw.length)===1&&[...lw].filter(c=>x.includes(c)).length>=Math.min(2,lw.length)));
  const out=[];for(const x of [...d1,...d2,...near,...shuffle(P)]){if(!out.includes(x))out.push(x);if(out.length>=n)break;}return out;}
const canTTS=()=>'speechSynthesis' in window;

def('monsters',li=>{
  const L=MLEVELS[li],sight=L.sight!=null;
  const list=(sight?SIGHT[L.sight].words.concat(li===MLEVELS.length-1?SIGHT[4].words:[]).map(([w,ar])=>({w,e:null,ar})):L.words().map(([w,e,ar])=>({w,e,ar})));
  const pool=sight?SIGHT_ALL().map(x=>x[0]):POOL.concat(list.map(x=>x.w));
  const N=10,targets=[];let bag=[];while(targets.length<N){if(!bag.length)bag=shuffle(list.slice());targets.push(bag.shift());}
  setTitle(`👾 ${L.ar}`);
  $('#view').innerHTML=`<div class="mon">
    <div class="bhud"><span class="hearts" id="mhh"></span><span class="bw" id="mw"></span><button class="pz" id="mpz" aria-label="استراحة">⏸</button></div>
    <div class="cue" id="cue"></div>
    <div class="mstage2" id="ms"><canvas id="mc"></canvas><div class="mbub" id="mb" hidden></div></div>
    <p class="tip">💡 ${L.tip}</p></div>`;
  const cv=$('#mc'),ctx=cv.getContext('2d');let W=360,H=380,S=90;
  let alive=true,paused=false,raf=0,last=performance.now(),now=0,timers=[];
  let hearts=3,ri=-1,R=null,good=0,misses=0,laser=null,stars=[];
  const at=(dt,fn)=>timers.push({t:now+dt,fn});
  onClean(()=>{alive=false;cancelAnimationFrame(raf);document.removeEventListener('visibilitychange',vis);removeEventListener('resize',size);stopSpeak();});
  function size(){W=$('#ms').clientWidth||360;const top=$('#ms').getBoundingClientRect().top+window.scrollY;H=clamp(Math.floor(innerHeight-top-70),300,560);
    S=Math.min(W*.27,100);const d=Math.min(2,window.devicePixelRatio||1);cv.width=W*d;cv.height=H*d;cv.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);
    stars=[...Array(46)].map((_,k)=>[(k*97+31)%W,(k*61+17)%H,.6+(k%3)*.5,k]);}
  function hud(){$('#mhh').innerHTML=[0,1,2].map(i=>i<hearts?'❤️':'🖤').join('');$('#mw').textContent=`${D(Math.min(N,ri+1))} / ${D(N)}`;}
  const sayW=w=>speak(w,{rate:.75});
  function cueHTML(){const t=R.t;if(R.audio)return `<button class="cbtn" id="chear">🔊</button><div><b>اسمع الكلمة</b><span>واضرب الوحش الذي يحملها!</span></div>`;
    if(t.e)return `<span class="cemo">${t.e}</span><div><b>أي وحش يحمل اسم هذه الصورة؟</b><span>اقرأ الكلمات بدقة!</span></div>`;
    return `<span class="car">${t.ar}</span><div><b>أي كلمة تعني هذا؟</b><span>اقرأ الكلمات بدقة!</span></div>`;}
  function startRound(){ri++;if(ri>=N)return finish(true);const t=targets[ri];
    const audio=sight?canTTS():(canTTS()&&Math.random()<.3);
    const words=shuffle([t.w,...lookAlikes(t.w,pool,2)]);const xs=shuffle([.2,.5,.8]);
    R={t,audio,tries:0,born:now,T:Math.max(7.5,12.5-li*.3),mons:words.map((w,k)=>({w,ok:w.toLowerCase()===t.w.toLowerCase(),x:W*xs[k],y:S*.62+k*10,col:MCOL[(ri*3+k)%MCOL.length],mood:'idle',gone:0,pop:0,ph:Math.random()*6}))};
    $('#cue').innerHTML=cueHTML();$('#cue').classList.remove('pop');void $('#cue').offsetWidth;$('#cue').classList.add('pop');
    if($('#chear'))$('#chear').onclick=()=>sayW(t.w);if(audio)at(.35,()=>sayW(t.w));hud();}
  function bubble(html,ms=1600){const b=$('#mb');b.innerHTML=html;b.hidden=false;clearTimeout(b._t);b._t=setTimeout(()=>{if(alive)b.hidden=true;},ms);}
  function tap(e){if(!R||paused||R.done)return;const r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
    let hit=null,bd=1e9;R.mons.forEach(m=>{if(m.gone||m.pop)return;const d=Math.hypot(m.x-px,(m.y+S*.12)-py);if(d<S*.6&&d<bd){bd=d;hit=m;}});if(!hit)return;
    if(hit.ok){R.done=true;if(!R.tries)good++;laser={x:hit.x,y:hit.y,t0:now};hit.pop=now;buzz(25);
      const rc=cv.getBoundingClientRect();at(.12,()=>{FX.burst(rc.left+hit.x,rc.top+hit.y,{n:26,colors:[hit.col,'#fff','#fde047'],speed:260});FX.text(rc.left+hit.x,rc.top+hit.y-30,R.tries?'👍':'⭐ ممتاز!','#fde047',22);});
      sayW(R.t.w);bubble(`<b class="en">${esc(R.t.w)}</b> ${R.t.e||''} <span>${esc(R.t.ar)}</span>`,1300);at(1.2,startRound);}
    else{R.tries++;misses++;hit.mood='laugh';buzz(60);const ar=dictAr(hit.w.toLowerCase());
      bubble(`😜 <b class="en">${esc(hit.w)}</b> ${ar?`= ${esc(ar)}`:''}<br><small>ليست هي! اقرأ مرة أخرى.</small>`,1800);at(.9,()=>{hit.gone=now;});
      if(R.tries>=1&&!R.audio&&$('#cue .cbtn2')==null)$('#cue').insertAdjacentHTML('beforeend','<button class="cbtn cbtn2" id="chint">🔊</button>'),$('#chint').onclick=()=>sayW(R.t.w);}}
  cv.addEventListener('pointerdown',tap);
  function reach(){R.done=true;hearts--;hud();misses++;buzz(140);const m=R.mons.find(m=>m.ok);if(m)m.mood='worried';sayW(R.t.w);
    bubble(`🛡️ أصاب الوحش الصاروخ! الكلمة كانت <b class="en">${esc(R.t.w)}</b>`,1700);const rc=cv.getBoundingClientRect();FX.burst(rc.left+W/2,rc.top+H-60,{n:24,colors:['#f87171','#fde047','#fff']});
    if(hearts<=0)return at(1.4,()=>finish(false));at(1.8,startRound);}
  function update(dt){if(timers.length){const due=timers.filter(t=>now>=t.t);if(due.length){timers=timers.filter(t=>now<t.t);due.forEach(t=>{if(alive)t.fn();});}}
    if(!R||R.done)return;const goal=H-S*1.25;
    R.mons.forEach(m=>{if(m.gone)return;m.y+=dt*(goal+S)/R.T;});
    if(R.mons.some(m=>m.ok&&!m.gone&&m.y>=goal))reach();}
  function draw(){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0b1033');g.addColorStop(1,'#312e81');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    stars.forEach(([x,y,r,k])=>{ctx.globalAlpha=.4+.6*Math.abs(Math.sin(now*1.5+k));ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();});ctx.globalAlpha=1;
    ctx.fillStyle='#7c3aed';ctx.beginPath();ctx.arc(W*.85,H*.12,22,0,7);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(W*.85,H*.12,34,8,-.3,0,7);ctx.stroke();
    ctx.fillStyle='#1e1b4b';ctx.beginPath();ctx.ellipse(W/2,H+40,W*.75,90,0,0,7);ctx.fill();
    if(R)R.mons.forEach((m,k)=>{if(m.gone&&now-m.gone>.4)return;const p=m.pop?clamp((now-m.pop)/.25,0,1):0;if(p>=1)return;
      ctx.globalAlpha=m.gone?1-clamp((now-m.gone)/.4,0,1):1-p;const zig=Math.sin(now*1.8+m.ph)*S*.12;
      drawWordMonster(ctx,m.x+zig,m.y,S*(1+p*.4),m.col,m.w,m.mood,now,k);ctx.globalAlpha=1;});
    if(laser){const t=(now-laser.t0)/.22;if(t>1)laser=null;else{ctx.save();ctx.strokeStyle='#67e8f9';ctx.shadowColor='#22d3ee';ctx.shadowBlur=16;ctx.lineWidth=6*(1-t)+2;ctx.beginPath();ctx.moveTo(W/2,H-S*.95);ctx.lineTo(laser.x,laser.y);ctx.stroke();ctx.restore();}}
    drawRocket(ctx,W/2,H-S*.55,S*1.05,now);}
  function loop(t){if(!alive)return;const dt=Math.min(.05,(t-last)/1000);last=t;if(!paused){now+=dt;update(dt);}draw();raf=requestAnimationFrame(loop);}
  function finish(won){if(!alive)return;alive=false;cancelAnimationFrame(raf);
    if(!won)return resultOv({title:'الوحوش أصابت الصاروخ! 😮',stars:0,mood:'sad',gems:good,lines:['لا بأس، كل قارئ يتدرّب!','💡 اقرأ الكلمة حرفاً حرفاً قبل أن تضرب'],
      btns:[{label:'🔁 حاول مرة أخرى',cls:'gold big',fn:()=>rerender()},{label:'🪐 المجرّة',cls:'ghost',fn:()=>home()}]});
    const st=hearts===3&&misses<=1?3:hearts>=2?2:1;RS.mon[li]=Math.max(RS.mon[li]||0,st);rsave();const hasNext=li+1<MLEVELS.length;
    resultOv({title:'👾 هزمت كل الوحوش!',stars:st,gems:good+st*3,lines:[`⭐ ضربات من أول مرة: ${D(good)} من ${D(N)}`,st<3?'اقرأ بتمهّل ودقة لتحصل على ٣ نجوم':'قارئ دقيق! 👑'],
      btns:[...(hasNext?[{label:'المرحلة التالية ←',cls:'gold big',fn:()=>go('monsters',li+1,false)}]:[]),{label:'🔁 مرة أخرى',cls:'ghost',fn:()=>rerender()},{label:'🪐 المجرّة',cls:'ghost',fn:()=>home()}]});}
  $('#mpz').onclick=()=>pause();
  function vis(){if(document.hidden&&alive&&!paused)pause();}
  document.addEventListener('visibilitychange',vis);
  function pause(){if(paused)return;paused=true;const ov=document.createElement('div');ov.className='ov';
    ov.innerHTML=`<div class="res"><h2>⏸ استراحة</h2><p class="muted">الوحوش تنتظر…</p><div class="btns"><button class="btn gold big" id="pc">▶ أكمل</button><button class="btn ghost" id="pq">🪐 المجرّة</button></div></div>`;
    document.body.appendChild(ov);$('#pc',ov).onclick=()=>{ov.remove();paused=false;last=performance.now();};$('#pq',ov).onclick=()=>{ov.remove();home();};}
  size();addEventListener('resize',size);hud();
  at(.4,startRound);raf=requestAnimationFrame(t=>{last=t;loop(t);});
},{full:true});
