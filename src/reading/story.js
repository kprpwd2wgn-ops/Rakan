/* ===== مجرّة القصص: اقرأ، واختر طريقك ===== */
def('tale',ti=>{
  const S=TALES[ti];let pid=S.start;
  setTitle(`📖 ${S.ar}`);
  function show(){const P=S.pages[pid];
    $('#view').innerHTML=`<div class="tale">
      <div class="tpic">${P.p}</div>
      <div class="tpage" id="tp">${P.s.map(s=>`<p class="tl en">${tapWords(s)}</p>`).join('')}</div>
      <div class="tar" id="tar" hidden>${P.a.map(a=>`<p>${a}</p>`).join('')}</div>
      <div class="row cen"><button class="chipbtn" id="tsay">🔊 اقرأ لي</button><button class="chipbtn" id="tread">🎤 اقرأ بصوتك</button><button class="chipbtn" id="ttr">🇸🇦 الترجمة</button></div>
      <div id="tsc"></div>
      ${P.c?`<h3 class="sec">🤔 ماذا يحدث الآن؟ اقرأ واختر:</h3><div class="tch">${P.c.map((c,i)=>`<button class="tc" data-i="${i}"><span class="en">${esc(c[0])}</span><small class="tca" hidden>${c[1]}</small></button>`).join('')}</div>`
        :`<div class="tend ${P.end}">${P.end==='funny'?'😆 نهاية مضحكة!':'🌟 نهاية سعيدة!'}</div><p class="muted cen" id="tcount"></p>
          <div class="btns"><button class="btn gold big wide" id="tagain">🔁 جرّب طريقاً آخر</button><button class="btn ghost wide" id="tlist">📚 قصة أخرى</button></div>`}
      </div>`;
    $('#tsay').onclick=()=>speak(P.s.join(' '),{rate:.82});
    $('#ttr').onclick=()=>{$('#tar').hidden=!$('#tar').hidden;$$('.tca').forEach(e=>e.hidden=$('#tar').hidden);};
    readAloudBtn($('#tread'),()=>P.s.join(' '),c=>{const ws=$$('#tp .w');let j=0;const tw=normS(P.s.join(' ')).split(' ');
      ws.forEach(w=>{const n=normS(w.textContent);if(!n)return;const ok=c.hits[j];w.classList.toggle('ok',!!ok);w.classList.toggle('miss',!ok);j+=n.split(' ').length;});
      const st=c.ratio>=.85?3:c.ratio>=.55?2:1;$('#tsc').innerHTML=`<div class="tscore">${starRowR(st)} <b>${['','حاول مرة أخرى 👍','قراءة جيدة! 👏','قراءة ممتازة! 🌟'][st]}</b></div>`;if(st===3)World.add(1);});
    $$('.tc').forEach(b=>b.onclick=()=>{pid=P.c[+b.dataset.i][2];stopSpeak();show();window.scrollTo(0,0);});
    if(P.end){const key=ti+':'+pid,fresh=!RS.ends[key];RS.ends[key]=1;const found=Object.keys(RS.ends).filter(e=>e.startsWith(ti+':')).length,total=endsOf(ti);
      RS.stories[ti]=found>=total?3:found>=2?2:1;rsave();if(fresh){World.add(4);FX.confetti();toast('🌟 نهاية جديدة! 💎 +٤');}
      $('#tcount').innerHTML=`اكتشفت ${D(found)} من ${D(total)} نهايات في هذه القصة.`;
      $('#tagain').onclick=()=>{pid=S.start;show();window.scrollTo(0,0);};$('#tlist').onclick=()=>go('rlevels','tales',false);}}
  show();
});
const starRowR=n=>`<span class="srow">${[0,1,2].map(i=>`<i class="${i<n?'on':''}">★</i>`).join('')}</span>`;
