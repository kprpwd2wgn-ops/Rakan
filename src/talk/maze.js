/* ===== مختبر روبو: متاهة تتحرك بصوتك ===== */
const DIRAR={up:'للأعلى',down:'للأسفل',left:'يساراً',right:'يميناً'},KEYAR={gold:'الذهبي',red:'الأحمر',blue:'الأزرق'};
def('maze',i=>{
  const L=MAZES[i],M=mzParse(L),opt=mzSolve(M);
  setTitle(`🤖 المتاهة ${D(i+1)}`);
  $('#view').innerHTML=`<div class="mz">
    <p class="tip">💡 ${L.tip}</p>
    <div class="rbub" id="rb"><b class="en">…</b><span></span></div>
    <div class="mstage" id="ms"><canvas id="mc"></canvas>
      <div class="mhud"><span class="mcnt" id="mcnt"></span><span id="minv"></span><button class="mini2" id="mre" aria-label="من جديد">↺</button></div></div>
    <div class="wcard"><span class="wct">كلمات تساعدك:</span>${L.words.map(w=>`<button class="wc en" data-w="${esc(w)}">🔊 ${esc(w)}</button>`).join('')}</div>
    <div id="mic"></div></div>`;
  const cv=$('#mc'),ctx=cv.getContext('2d');let W=360,H=240,cell=48,ox=8,oy=8;
  let alive=true,raf=0,last=performance.now(),now=0;
  let st,used,got,pos,queue,mood,moodT,busy,bump,win,sparks;
  function reset(){st=mzStart(M);used=0;got=new Set();pos=[st.c,st.r];queue=[];mood='idle';moodT=0;busy=false;bump=null;win=false;sparks=[];hudUp();}
  onClean(()=>{alive=false;cancelAnimationFrame(raf);removeEventListener('resize',size);});
  function size(){W=$('#ms').clientWidth||360;cell=Math.floor(Math.min(64,(W-16)/M.W));ox=Math.floor((W-cell*M.W)/2);oy=46;H=cell*M.H+oy+8;
    const d=Math.min(2,window.devicePixelRatio||1);cv.width=W*d;cv.height=H*d;cv.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);}
  function hudUp(){const inv=['gold','red','blue'].filter(c=>st.inv&CBIT[c]);$('#minv').innerHTML=inv.length?'🎒 '+inv.map(c=>`<span class="kchip" style="--kc:${KEYHEX[c]}">🔑</span>`).join(''):'';
    $('#mcnt').textContent=`الأوامر: ${D(used)}`;}
  function bubble(en,ar){const b=$('#rb');b.innerHTML=`<span class="bwho">${roboSVG(mood==='bump'?'bump':mood==='confused'?'confused':'happy')}</span><b class="en">${esc(en)}</b><span>${ar}</span>`;b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');roboSay(en);}
  function setMood(m,ms=1400){mood=m;moodT=ms?now+ms/1000:0;}
  const walk=path=>new Promise(res=>{queue=path.slice();queue.done=res;});
  const pause=ms=>new Promise(res=>setTimeout(res,ms));
  async function run(cmds){busy=true;mic.lock(true);
    for(const c of cmds){if(!alive)return;
      if(c.k==='move'){const m=mzMove(M,st,c.dir,c.n);used++;hudUp();
        if(m.steps){setMood('talk',0);bubble(`Going ${c.dir}${c.n?' '+NUMW[c.n]:''}!`,`أتحرك ${DIRAR[c.dir]}${c.n?` ${D(c.n)} ${c.n===1?'خطوة':c.n===2?'خطوتين':'خطوات'}`:''}!`);
          await walk(m.path);st=Object.assign({},st,{r:m.r,c:m.c});setMood('idle',0);
          if(mzAtExit(M,st))return finish();}
        if(m.why&&(c.n?m.steps<c.n:(!m.steps||m.why==='door'))){bump={dir:c.dir,t0:now};buzz(40);setMood('bump');
          if(m.why==='door')bubble('A door! It is closed.','باب! إنه مغلق.');else bubble('Bonk! A wall!','آخ! جدار!');await pause(650);}}
      else if(c.k==='pick'){used++;const p=mzPick(M,st,c.col);
        if(p.ok){st=p.st;spark(st.r,st.c,KEYHEX[p.col]);setMood('happy');bubble(`Got the ${p.col} key!`,`أخذت المفتاح ${KEYAR[p.col]}!`);buzz(30);}
        else if(p.why==='color'){setMood('confused');bubble(`Hmm, this key is ${p.col}!`,`همم، هذا المفتاح ${KEYAR[p.col].replace('ال','')}!`);}
        else{setMood('confused');bubble('There is no key here.','لا يوجد مفتاح هنا.');}await pause(700);}
      else if(c.k==='open'){used++;const o=mzOpen(M,st,c.col);
        if(o.ok){st=o.st;const d=M.doors[o.di];spark(d.r,d.c,KEYHEX[o.col]);setMood('happy');bubble('The door is open!','انفتح الباب!');buzz(30);}
        else if(o.why==='locked'){setMood('confused');bubble(`It is locked! I need the ${o.col} key.`,`مقفل! أحتاج المفتاح ${KEYAR[o.col]}.`);}
        else if(o.why==='color'){setMood('confused');bubble('That is not the right color!','اللون غير مناسب!');}
        else{setMood('confused');bubble('There is no door next to me.','لا يوجد باب بجانبي.');}await pause(700);}
      hudUp();}
    busy=false;mic.lock(false);}
  function spark(r,c,col){const rc=cv.getBoundingClientRect();FX.burst(rc.left+ox+c*cell+cell/2,rc.top+oy+r*cell+cell/2,{n:18,colors:[col,'#fff','#fde68a'],speed:220});}
  function finish(){win=true;setMood('happy',0);bubble('Yay! We did it!','يا سلام! وصلنا!');FX.confetti();
    const stars=used<=opt?3:used<=opt+2?2:1,sg=got.size,gems=stars*3+sg;T.maze[i]=Math.max(T.maze[i]||0,stars);tsave();
    setTimeout(()=>{if(!alive)return;const hasNext=i+1<MAZES.length;resultOv({title:'🎉 روبو وصل إلى المخرج!',stars,gems,
      lines:[`🗣️ عدد أوامرك: ${D(used)} (أفضل حل: ${D(opt)})`,M.stars.length?`⭐ نجوم جمعتها: ${D(sg)} من ${D(M.stars.length)}`:'',stars<3?'استخدم أوامر أقل لتحصل على ٣ نجوم':'أوامر ذكية! 👑'],
      btns:[...(hasNext?[{label:'المتاهة التالية ←',cls:'gold big',fn:()=>go('maze',i+1,false)}]:[]),{label:'🔁 مرة أخرى',cls:'ghost',fn:()=>rerender()},{label:'🏙️ المدينة',cls:'ghost',fn:()=>home()}]});},1500);}
  function onText(r){if(busy||win)return;let cmds=[];for(const a of r.alts){cmds=mzCommands(a);if(cmds.length)break;}
    if(!cmds.length){setMood('confused');bubble("Beep? I don't understand.",`بيب؟ لم أفهم. قل مثلاً: <span class="en nw">${esc(L.words[0])}</span>`);return;}
    const ws=[];cmds.forEach(c=>{if(c.k==='move'){ws.push(c.dir);if(c.n)ws.push(NUMW[c.n]);}else if(c.k==='pick')ws.push('pick up','key');else ws.push('open','door');if(c.col)ws.push(c.col);});
    if(cmds.length>1)ws.push('and');learnWords(ws);if(normS(r.text).split(' ').length>=3)T.full++;
    run(cmds);}
  const mic=micBar($('#mic'),{onText,hint:'اضغط 🎤 وقل لروبو إلى أين يذهب',onHelp:()=>{bubble(`Say: ${L.words[0]}`,`قل مثلاً: <span class="en">${esc(L.words[0])}</span>`);}});
  $$('.wc').forEach(b=>b.onclick=()=>sayEn(b.dataset.w,{rate:.85}));
  $('#mre').onclick=()=>{if(busy)return;reset();bubble("Let's try again!",'لنحاول من جديد!');};

  /* ---------- الرسم ---------- */
  function draw(){ctx.clearRect(0,0,W,H);
    const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#eef2ff');g.addColorStop(1,'#e0f2fe');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    for(let r=0;r<M.H;r++)for(let c=0;c<M.W;c++){const X=ox+c*cell,Y=oy+r*cell,ch=M.g[r][c];
      if(ch==='#'){ctx.fillStyle='#6366f1';ctx.strokeStyle='#312e81';ctx.lineWidth=2.5;ctx.beginPath();ctx.roundRect(X+2,Y+2,cell-4,cell-4,cell*.22);ctx.fill();ctx.stroke();
        ctx.fillStyle='rgba(255,255,255,.28)';ctx.beginPath();ctx.roundRect(X+6,Y+5,cell-12,cell*.22,cell*.1);ctx.fill();continue;}
      ctx.fillStyle=(r+c)%2?'#ffffff':'#f1f5ff';ctx.fillRect(X,Y,cell,cell);}
    ctx.strokeStyle='rgba(99,102,241,.18)';ctx.lineWidth=1;ctx.strokeRect(ox,oy,cell*M.W,cell*M.H);
    /* المخرج */
    const [er,ec]=M.E,ex=ox+ec*cell+cell/2,ey=oy+er*cell+cell/2;for(let k=3;k>0;k--){ctx.fillStyle=['#f0abfc','#c084fc','#7c3aed'][3-k];ctx.beginPath();ctx.arc(ex,ey,cell*.13*k+Math.sin(now*3+k)*1.5,0,7);ctx.fill();}
    ctx.save();ctx.translate(ex,ey);ctx.rotate(now*2);ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();for(let a=0;a<12;a+=.3){const rr=a*cell*.03;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.stroke();ctx.restore();
    /* البداية */
    const [sr,sc]=M.S;ctx.fillStyle='rgba(250,204,21,.35)';ctx.beginPath();ctx.arc(ox+sc*cell+cell/2,oy+sr*cell+cell/2,cell*.36,0,7);ctx.fill();
    M.stars.forEach((s,k)=>{if(!got.has(k))drawStar(ctx,ox+s.c*cell+cell/2,oy+s.r*cell+cell/2+Math.sin(now*3+k)*2,cell*.26,'#fde047');});
    M.keys.forEach((k,j)=>{if(!(st.taken>>j&1))drawKey(ctx,ox+k.c*cell+cell/2,oy+k.r*cell+cell/2+Math.sin(now*2.5+j)*2,cell*.8,k.col);});
    M.doors.forEach((d,j)=>drawDoor(ctx,ox+d.c*cell,oy+d.r*cell,cell,d.col,st.open>>j&1));
    /* روبو */
    let [px,py]=pos;let bx=0,by=0;if(bump){const t=(now-bump.t0)/.35;if(t>1)bump=null;else{const [dr,dc]=DV[bump.dir];const k=Math.sin(t*Math.PI)*.18;bx=dc*k;by=dr*k;}}
    const rw=cell*.92,bmp=roboBmp(mood,rw),hop=queue.length?Math.abs(Math.sin(now*16))*cell*.06:0;
    if(bmp)ctx.drawImage(bmp,ox+(px+bx)*cell+(cell-rw)/2,oy+(py+by)*cell+cell-rw*1.1-hop,rw,rw*1.1);
  }
  function update(dt){if(moodT&&now>moodT){moodT=0;mood='idle';}
    if(queue.length){const [tr,tc]=queue[0],sp=dt/.13;const dx=tc-pos[0],dy=tr-pos[1],dist=Math.hypot(dx,dy);
      if(dist<=sp){pos=[tc,tr];queue.shift();const si=M.stars.findIndex(s=>s.r===tr&&s.c===tc);if(si>=0&&!got.has(si)){got.add(si);spark(tr,tc,'#fde047');World.add(1);}
        if(!queue.length&&queue.done){const d=queue.done;queue.done=null;d();}}
      else pos=[pos[0]+dx/dist*sp,pos[1]+dy/dist*sp];}}
  function loop(t){if(!alive)return;const dt=Math.min(.05,(t-last)/1000);last=t;now+=dt;update(dt);draw();raf=requestAnimationFrame(loop);}
  reset();size();addEventListener('resize',size);
  setTimeout(()=>{if(alive)bubble(i===0?"Hi! I'm Robo. Tell me where to go!":"Ready! Where do we go?",i===0?'أهلاً! أنا روبو. قل لي إلى أين أذهب!':'جاهز! إلى أين نذهب؟');},400);
  raf=requestAnimationFrame(t=>{last=t;loop(t);});
});
