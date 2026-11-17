/* ===== صوت أولي للكلام الإنجليزي (Azure، en-US-AvaNeural) =====
   المقاطع مسجّلة مسبقاً في ollie/voices/<رقم>.mp3 (مشتركة مع أولي)، ولكل لعبة خريطة APP.enmap:
   {s:{"النص":"الرقم"}, slow:["رقم", …]}. الكلمات المفردة مفاتيحها بحروف صغيرة.
   speak() في kit/voice.js يسأل EN.say أولاً: إذا كان لكل جزء من الكلام مقطع تكلم صوت أولي، وإلا تكلم صوت الجهاز
   كما كان، إلى أن تُسجَّل كل الجمل (tools/en-lines.js يكتب القائمة الناقصة ويعيد كتابة الخريطة).
   خيارات speak: parts = أجزاء تُشغَّل متتالية بدل الجملة كاملة، words = يُقرأ كلمة كلمة إن لم توجد الجملة. */
var EN={map:null,buf:{},order:[],cur:null,res:null,timers:[],
  norm:t=>String(t==null?'':t).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu,'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/\s+/g,' ').trim(),
  load(){if(!APP.enmap||location.protocol==='file:')return;fetch(APP.enmap).then(r=>r.ok?r.json():null).then(m=>{if(m&&m.s)this.map=m;}).catch(()=>{});},
  id(t){if(!this.map)return null;const k=this.norm(t);if(!k)return null;const S=this.map.s;
    return S[k]||(/^[A-Za-z'-]+[.!?,]?$/.test(k)?S[k.replace(/[.!?,]$/,'').toLowerCase()]:null)||null;},
  sentences(t){return(this.norm(t).match(/[^.!?…]+[.!?…]*['"]?/g)||[]).map(s=>s.trim()).filter(Boolean);},
  /* خطة الكلام: [[رقم المقطع، بداية الجزء في النص، طوله]] أو null إذا نقص مقطع */
  plan(text,o={}){if(!this.map)return null;const full=this.norm(text);if(!full)return null;
    const fit=list=>{let pos=0;const out=[];for(const p of list){const id=this.id(p);if(!id)return null;const q=this.norm(p),i=full.indexOf(q,pos),at=i<0?pos:i;out.push([id,at,q.length]);pos=at+q.length;}return out.length?out:null;};
    const w=this.id(full);if(w)return[[w,0,full.length]];
    return(o.parts&&fit(o.parts))||fit(this.sentences(full))||(o.words?fit(full.split(' ').map(x=>x.replace(/^[^A-Za-z']+|[^A-Za-z']+$/g,'')).filter(Boolean)):null);},
  has(text,o){return!!this.plan(text,o);},
  async get(id){if(this.buf[id])return this.buf[id];const ctx=SFX.ctx;if(!ctx)return null;
    try{const r=await fetch(APP.enbase+id+'.mp3');if(!r.ok)return null;const data=await r.arrayBuffer();
      const b=await new Promise((ok,no)=>{const p=ctx.decodeAudioData(data,ok,no);if(p&&p.then)p.then(ok,no);});
      this.buf[id]=b;this.order.push(id);if(this.order.length>60)delete this.buf[this.order.shift()];return b;}catch(e){return null;}},
  stop(){this.timers.forEach(clearTimeout);this.timers=[];if(this.cur){const c=this.cur;this.cur=null;c.onended=null;try{c.stop();}catch(e){}}if(this.res){const r=this.res;this.res=null;r();}},
  /* يرجع true إذا تكلم صوت أولي (و end() تُنادى في النهاية)، و false ليتكلم صوت الجهاز */
  say(text,o,alive,end){const pl=this.plan(text,o);if(!pl)return false;this.stop();
    const full=this.norm(text),slow=(World.p.rate||1)<.9;SFX.unlock();
    (async()=>{const ctx=SFX.ctx;if(!ctx){end();return;}if(ctx.state==='suspended')try{await ctx.resume();}catch(e){}
      if(o.el&&alive())o.el.classList.add('talking');
      for(let k=0;k<pl.length;k++){const [id,at,len]=pl[k];if(!alive())return;
        const sl=slow&&this.map.slow&&this.map.slow.includes(id);let b=await this.get(sl?id+'-slow':id);if(!b&&sl)b=await this.get(id);if(!alive())return;if(!b)continue;
        await new Promise(res=>{this.res=res;const s=ctx.createBufferSource();s.buffer=b;s.connect(ctx.destination);this.cur=s;
          s.onended=()=>{if(this.cur===s)this.cur=null;if(this.res===res)this.res=null;res();};
          if(o.onboundary){/* إضاءة الكلمات: نوزّع كلمات الجزء على مدة المقطع حسب طولها */
            const seg=full.slice(at,at+len),dur=b.duration*1000,ws=[];seg.replace(/\S+/g,(m,i)=>{ws.push(i);return m;});
            const lead=Math.min(180,dur*.08);ws.forEach(i=>this.timers.push(setTimeout(()=>{if(alive())o.onboundary(at+i);},lead+(dur-lead*2)*(i/Math.max(1,seg.length)))));}
          s.start();});
        if(k<pl.length-1&&alive())await new Promise(r=>setTimeout(r,o.words?160:90));}
      if(alive())end();})();
    return true;}
};
/* EN.load() يُنادى من main.js في كل لعبة، بعد أن يُعرَّف APP */
