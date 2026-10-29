/* ===== أدوات القراءة: اضغط أي كلمة لتعرف معناها وتسمعها، واقرأ بصوتك ===== */
const wkey=w=>String(w).toLowerCase().replace(/[’']s$/,'').replace(/[^a-z]/g,'');
function dictAr(k){if(DICT[k])return DICT[k];for(const [suf,rep] of [['ies','y'],['es',''],['s',''],['ed',''],['ed','e'],['ing',''],['ing','e']])if(k.endsWith(suf)&&DICT[k.slice(0,-suf.length)+rep])return DICT[k.slice(0,-suf.length)+rep];return null;}
function tapWords(sentence){return String(sentence).split(/(\s+)/).map(tok=>{if(/^\s+$/.test(tok))return tok;const k=wkey(tok);return k?`<span class="w" data-w="${k}">${esc(tok)}</span>`:esc(tok);}).join('');}
const W_NOTE=['رسالة واحدة','رسالتين','رسائل','رسالة'],W_CLUE=['دليلاً واحداً','دليلين','أدلة','دليلاً'];
const cntAr=(n,w)=>n===1?w[0]:n===2?w[1]:`${D(n)} ${n<=10?w[2]:w[3]}`;
let popT=0;
function wordPop(el){$$('.wpop').forEach(p=>p.remove());const k=el.dataset.w,ar=dictAr(k);
  const p=document.createElement('div');p.className='wpop';p.innerHTML=`<b class="en">${esc(k)}</b><span>${ar||'🔊 اسمعها'}</span>`;document.body.appendChild(p);
  const r=el.getBoundingClientRect(),pw=p.offsetWidth;p.style.left=clamp(r.left+r.width/2-pw/2,8,innerWidth-pw-8)+'px';p.style.top=(r.top+window.scrollY-p.offsetHeight-8)+'px';
  el.classList.add('lit');setTimeout(()=>el.classList.remove('lit'),700);speak(k,{rate:.8});RS.words[k]=(RS.words[k]||0)+1;rsave();
  clearTimeout(popT);popT=setTimeout(()=>p.remove(),2600);}
document.addEventListener('click',e=>{const w=e.target.closest('.w');if(w){e.stopPropagation();wordPop(w);}else $$('.wpop').forEach(p=>p.remove());});
/* القراءة بصوت عالٍ: نقارن كلماتك بكلمات الجملة */
function readCheck(target,res){const tw=normS(target).split(' ').filter(Boolean);let best={ratio:0,hits:tw.map(()=>false)};
  (res.alts&&res.alts.length?res.alts:[res.text]).forEach(a=>{const said=normS(a).split(' ');const hits=tw.map(w=>said.includes(w));const ratio=hits.filter(Boolean).length/tw.length;if(ratio>best.ratio)best={ratio,hits};});
  return best;}
/* زر «اقرأ بصوتك» لسطر أو صفحة */
function readAloudBtn(el,getText,onScore){
  el.onclick=()=>{if(el.classList.contains('on'))return stopListen();stopSpeak();el.classList.add('on');el.innerHTML='🎧 أسمعك…';
    listen({onDone:r=>{el.classList.remove('on');el.innerHTML='🎤 اقرأ بصوتك';if(!r.text){toast('لم أسمعك… اضغط واقرأ بصوت أوضح');return;}
        const c=readCheck(getText(),r);RS.read++;rsave();onScore&&onScore(c,r);},
      onError:code=>{el.classList.remove('on');el.innerHTML='🎤 اقرأ بصوتك';const ov=document.createElement('div');ov.className='ov';ov.innerHTML=`<div class="res">${micHelp(code)}<div class="btns"><button class="btn gold" id="mhok">حسناً</button></div></div>`;document.body.appendChild(ov);$('#mhok',ov).onclick=()=>ov.remove();}});};}
