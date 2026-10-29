/* ===== مكتب المحقق: اقرأ الأدلة واكشف اللص ===== */
const DEF={col:'green',eyes:2,hat:'none',gl:false,ant:2,item:'none',big:true};
const VALS={col:Object.keys(SCOL),eyes:[1,2,3],hat:['none','cap','crown','hat'],gl:[false,true],ant:[1,2],item:['none','balloon','book','ball','flower'],big:[true,false]};
const HATEN={cap:'a cap',crown:'a crown',hat:'a tall hat'},HATAR2={cap:'قبعة رياضية',crown:'تاجاً',hat:'قبعة طويلة'};
const EYEAR=['','عين واحدة','عينان','ثلاث عيون'];
function factText(f){const v=f.v,n=f.neg;switch(f.a){
  case 'col':return n?[`The thief is not ${v}.`,`اللص ليس ${SCOLAR[v]}.`]:[`The thief is ${v}.`,`اللص ${SCOLAR[v]}.`];
  case 'eyes':{const e=`${NUMEN[v]} ${v===1?'eye':'eyes'}`;return n?[`The thief does not have ${e}.`,`ليس للص ${EYEAR[v]}.`]:[`The thief has ${e}.`,`للص ${EYEAR[v]}.`];}
  case 'hat':if(v==='none')return['The thief has no hat.','اللص بلا قبعة.'];return n?[`The thief does not have ${HATEN[v]}.`,`اللص لا يلبس ${HATAR2[v]}.`]:[`The thief has ${HATEN[v]}.`,`اللص يلبس ${HATAR2[v]}.`];
  case 'gl':return v?['The thief has glasses.','اللص يلبس نظارة.']:['The thief has no glasses.','اللص بلا نظارة.'];
  case 'item':if(v==='none')return['The thief has nothing in his hands.','يدا اللص فارغتان.'];return n?[`The thief does not have a ${v}.`,`اللص لا يحمل ${ITEMAR[v]}.`]:[`The thief has a ${v}.`,`اللص يحمل ${ITEMAR[v]}.`];
  case 'ant':return[`The thief has ${NUMEN[v]} ${v===1?'antenna':'antennas'}.`,v===1?'للص قرن استشعار واحد.':'للص قرنا استشعار.'];
  case 'big':return v?['The thief is big.','اللص كبير.']:['The thief is small.','اللص صغير.'];}}
const fits=(s,f)=>f.neg?s[f.a]!==f.v:s[f.a]===f.v;
const fitsAll=(s,fs)=>fs.every(f=>(f.parts||[f]).every(p=>fits(s,p)));
function makeCase(C){
  for(let tries=0;tries<200;tries++){const sus=[],keys=new Set();
    while(sus.length<C.n){const a=Object.assign({},DEF);C.att.forEach(k=>{a[k]=pick(VALS[k]);});const key=C.att.map(k=>a[k]).join('|');if(keys.has(key))continue;keys.add(key);sus.push(a);}
    const thief=rint(0,C.n-1),T=sus[thief];const facts=[];
    C.att.forEach(k=>{facts.push({a:k,v:T[k],neg:false});if(C.neg&&!['big','ant','gl'].includes(k))VALS[k].filter(v=>v!==T[k]&&sus.some(s=>s[k]===v)).forEach(v=>facts.push({a:k,v,neg:true}));});
    let left=sus.map((_,i)=>i).filter(i=>i!==thief);const clues=[];const used=new Set();
    while(left.length&&clues.length<5){const cand=facts.filter(f=>!used.has(f.a+f.v+f.neg)).map(f=>({f,cut:left.filter(i=>!fits(sus[i],f)).length})).filter(x=>x.cut>0);
      if(!cand.length)break;const want=Math.max(1,Math.ceil(left.length/2));cand.sort((a,b)=>Math.abs(a.cut-want)-Math.abs(b.cut-want)+(Math.random()-.5)*.8+(C.neg?(a.f.neg?-.6:0)-(b.f.neg?-.6:0):0));
      const f=cand[0].f;used.add(f.a+f.v+f.neg);clues.push(f);left=left.filter(i=>fits(sus[i],f));}
    if(left.length||clues.length<2)continue;
    if(C.and&&clues.length>=3){const [a,b]=clues.splice(0,2);clues.unshift({and:true,parts:[a,b]});}
    return{sus,thief,clues};}
  return null;}
function clueText(f){if(!f.and)return factText(f);const [a,b]=f.parts.map(factText);
  const b1=b[1].replace(/^ليس للص /,'وليس له ').replace(/^للص /,'وله ').replace(/^يدا اللص /,'ويداه ').replace(/^اللص /,'و');
  return[a[0].replace(/\.$/,'')+' and '+b[0].replace(/^The thief /,''),a[1].replace(/\.$/,'')+'، '+b1];}

def('case',ci=>{
  const C=CASES[ci],K=makeCase(C);if(!K){home();return;}
  const {sus,thief,clues}=K;let k=0,out=new Set(),miss=0,done=false,arShown=false;
  setTitle(`🕵️ القضية ${D(ci+1)}`);
  $('#view').innerHTML=`<div class="case">
    <div class="cfile"><span class="cloot">${C.loot}</span><div class="en"><b>Someone took ${esc(C.lootEn)}!</b></div><small>شخص ما أخذ ${C.lootAr}! اقرأ الأدلة لتعرف من هو.</small></div>
    <div class="clue" id="clue"></div>
    <div class="sgrid n${C.n}" id="sg">${sus.map((s,i)=>`<button class="scard" data-i="${i}" aria-label="مشتبه ${i+1}">${suspectSVG(s)}<span class="sx">✖</span></button>`).join('')}</div>
    <p class="tip">👆 اضغط كل مشتبه <b>لا</b> يطابق الدليل لتشطبه.</p></div>`;
  function showClue(){const [en,ar]=clueText(clues[k]);arShown=false;
    $('#clue').innerHTML=`<div class="chead">🔎 الدليل ${D(k+1)} من ${D(clues.length)}</div><p class="en ctxt">${tapWords(en)}</p><p class="car2" id="car" hidden>${ar}</p>
      <div class="row"><button class="chipbtn" id="csay">🔊 اسمع</button><button class="chipbtn" id="ctr">🇸🇦 المعنى</button></div>`;
    $('#clue').classList.remove('pop');void $('#clue').offsetWidth;$('#clue').classList.add('pop');
    $('#csay').onclick=()=>speak(en,{rate:.8});$('#ctr').onclick=()=>{$('#car').hidden=false;arShown=true;};}
  const shouldOut=i=>!fitsAll(sus[i],clues.slice(0,k+1));
  function check(){const need=sus.map((_,i)=>i).filter(shouldOut);if(need.every(i=>out.has(i))){
      if(k<clues.length-1){toast('👍 ممتاز! الدليل التالي…');k++;setTimeout(()=>{if(!done)showClue();},500);}
      else catchThief();}}
  function catchThief(){done=true;const card=$(`.scard[data-i="${thief}"]`);card.classList.add('caught');const [x,y]=centerOf(card);FX.burst(x,y,{n:40,speed:320});FX.confetti();
    speak('You found the thief!',{rate:.85});
    const st=miss===0?3:miss<=2?2:1;RS.cases[ci]=Math.max(RS.cases[ci]||0,st);rsave();
    setTimeout(()=>{const hasNext=ci+1<CASES.length;resultOv({title:'🕵️ أمسكت باللص!',stars:st,gems:st*3+2,
      lines:[`${C.loot} عادت ${C.lootAr} إلى مكانها!`,`📖 قرأت ${cntAr(clues.length,W_CLUE)}`,miss?`أخطاء: ${D(miss)}`:'بدون أي خطأ! 👑'],
      btns:[...(hasNext?[{label:'القضية التالية ←',cls:'gold big',fn:()=>go('case',ci+1,false)}]:[]),{label:'🔁 قضية جديدة',cls:'ghost',fn:()=>rerender()},{label:'🪐 المجرّة',cls:'ghost',fn:()=>home()}]});},1300);}
  $$('.scard').forEach(b=>b.onclick=()=>{if(done)return;const i=+b.dataset.i;if(out.has(i))return;
    if(!shouldOut(i)){miss++;buzz(60);shake(b);const [en,ar]=clueText(clues[k]);
      toast(`🤔 هذا يطابق الدليل! اقرأه مرة أخرى: <span class="en">${esc(en)}</span>`,3000);if(miss>=2&&!arShown){$('#car').hidden=false;arShown=true;}return;}
    out.add(i);b.classList.add('out');buzz(20);check();});
  showClue();
});
