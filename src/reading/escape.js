/* ===== سفينة الألغاز: اقرأ الرسالة، واضغط المكان الصحيح ===== */
def('room',ri=>{
  const R=ROOMS[ri];let k=0,miss=0,hasKey=false,done=false;const got=[];
  setTitle(`🔐 ${R.ar}`);
  $('#view').innerHTML=`<div class="esc">
    <div class="note" id="note"></div>
    <div class="roomw" id="rw">${roomSVG(R)}</div>
    <p class="efb" id="efb">👆 اضغط المكان الذي تقوله الرسالة.</p>
    <div class="inv" id="inv"><span>🎒</span></div></div>`;
  const spots=[];R.objs.forEach(o=>{const S=spotsOf(o);Object.entries(S).forEach(([p,r])=>spots.push({id:o.id+':'+p,o,p,r}));});
  (R.between||[]).forEach(b=>spots.push({id:b.id+':between',o:{en:b.en.replace(/^between /,''),ar:b.ar.replace(/^بين /,'')},p:'between',r:[b.x,b.y,b.w,b.h],btw:b}));
  function showNote(){const st=R.steps[k];const first=k===0;
    $('#note').innerHTML=`<div class="nhead">📜 ${first?'رسالة على الباب':'رسالة جديدة'}</div><p class="en ntxt">${tapWords(st.en)}</p><p class="nar" id="nar" hidden>${st.ar}</p>
      <div class="row"><button class="chipbtn" id="nsay">🔊 اسمع</button><button class="chipbtn" id="ntr">🇸🇦 المعنى</button></div>`;
    $('#note').classList.remove('pop');void $('#note').offsetWidth;$('#note').classList.add('pop');
    $('#nsay').onclick=()=>speak(st.en,{rate:.8});$('#ntr').onclick=()=>{$('#nar').hidden=false;};}
  function fb(h,bad){const e=$('#efb');e.innerHTML=h;e.classList.toggle('bad',!!bad);e.classList.remove('pop');void e.offsetWidth;e.classList.add('pop');}
  function svgPt(ev){const svg=$('#rw svg'),pt=svg.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;return pt.matrixTransform(svg.getScreenCTM().inverse());}
  function pop(x,y,emo){const g=$('#rfx');const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',x);t.setAttribute('y',y);t.setAttribute('font-size','30');t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','central');t.setAttribute('class','fpop');t.textContent=emo;g.appendChild(t);setTimeout(()=>t.remove(),1400);}
  $('#rw').addEventListener('click',ev=>{if(done)return;const p=svgPt(ev);
    if(p.x>=296&&p.x<=356&&p.y>=82&&p.y<=204){if(hasKey){done=true;$('#rw').innerHTML=roomSVG(R,{open:true});win();}
      else{fb('🔒 الباب مقفل. اقرأ الرسالة وابحث عن المفتاح!',true);buzz(40);}return;}
    const hit=spots.filter(s=>p.x>=s.r[0]&&p.x<=s.r[0]+s.r[2]&&p.y>=s.r[1]&&p.y<=s.r[1]+s.r[3]).sort((a,b)=>a.r[2]*a.r[3]-b.r[2]*b.r[3])[0];
    const st=R.steps[k];if(!st)return;
    if(hit&&hit.id===st.spot){buzz(25);const cx=hit.r[0]+hit.r[2]/2,cy=hit.r[1]+hit.r[3]/2;pop(cx,cy,st.get);got.push(st.get);
      const [x,y]=[ev.clientX,ev.clientY];FX.burst(x,y,{n:18,colors:['#fde047','#fff','#a78bfa']});
      $('#inv').insertAdjacentHTML('beforeend',`<span class="ig">${st.get}</span>`);k++;
      if(st.get==='🔑'){hasKey=true;fb('🔑 وجدت المفتاح! الآن اضغط الباب لتهرب.');speak('You found the key!',{rate:.85});
        $('#note').innerHTML=`<div class="nhead">🔑 المفتاح معك!</div><p class="en ntxt">${tapWords('Open the door!')}</p>`;}
      else{fb('📜 وجدت رسالة جديدة! اقرأها.');showNote();}return;}
    miss++;buzz(60);
    if(hit){const pe=PREPEN[hit.p],pa=PREPAR[hit.p];fb(`🙈 <span class="en">Nothing ${pe} ${esc(hit.o.en)}.</span> لا شيء ${pa} ${hit.o.ar}. اقرأ الرسالة مرة أخرى!`,true);}
    else fb('🙈 لا شيء هنا. اقرأ الرسالة مرة أخرى!',true);
    if(miss>=3)$('#nar')&&($('#nar').hidden=false);});
  function win(){speak('You escaped! Great reading!',{rate:.85});FX.confetti();const st=miss===0?3:miss<=2?2:1;RS.rooms[ri]=Math.max(RS.rooms[ri]||0,st);rsave();
    setTimeout(()=>{const hasNext=ri+1<ROOMS.length;resultOv({title:'🚪 هربت من الغرفة!',stars:st,gems:st*3+1,
      lines:[`📜 قرأت ${cntAr(R.steps.length,W_NOTE)}`,miss?`ضغطات خاطئة: ${D(miss)}`:'بدون أي خطأ! 👑',st<3?'اقرأ كل كلمة: <span class="en">on, under, in, behind…</span>':''],
      btns:[...(hasNext?[{label:'الغرفة التالية ←',cls:'gold big',fn:()=>go('room',ri+1,false)}]:[]),{label:'🔁 مرة أخرى',cls:'ghost',fn:()=>rerender()},{label:'🪐 المجرّة',cls:'ghost',fn:()=>home()}]});},1300);}
  showNote();
});
