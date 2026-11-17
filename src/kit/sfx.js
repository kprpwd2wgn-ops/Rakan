/* ===== مؤثرات صوتية قصيرة من ضجيج مُرشَّح فقط: لا نغمات ولا ألحان (بلا موسيقى) =====
   SFX.play('ok') بعد أول لمسة. تُطفأ وتُشغَّل من زر 🔊 في الصفحة الرئيسية (تُحفظ في rakan-sfx). */
const SFX={ctx:null,noise:null,on:(()=>{try{return localStorage.getItem('rakan-sfx')!=='off';}catch(e){return true;}})(),
  unlock(){if(!this.ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;try{this.ctx=new AC();}catch(e){return;}}
    if(this.ctx.state==='suspended')this.ctx.resume();},
  set(v){this.on=v;try{localStorage.setItem('rakan-sfx',v?'on':'off');}catch(e){}},
  burst(at,dur,type,freq,q,vol,to){const c=this.ctx;
    if(!this.noise){const n=c.createBuffer(1,c.sampleRate*.6|0,c.sampleRate),d=n.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;this.noise=n;}
    const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=this.noise;f.type=type;f.frequency.setValueAtTime(freq,at);f.Q.value=q;
    if(to)f.frequency.exponentialRampToValueAtTime(to,at+dur);
    g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(vol,at+.008);g.gain.exponentialRampToValueAtTime(.0001,at+dur);
    s.connect(f);f.connect(g);g.connect(c.destination);s.start(at,Math.random()*.3);s.stop(at+dur+.03);},
  play(kind){if(!this.on)return;try{this.unlock();const c=this.ctx;if(!c||c.state!=='running')return;const t=c.currentTime+.01,B=this.burst.bind(this);
    switch(kind){
      case 'tap':B(t,.035,'bandpass',1700,1,.35);break;                                   /* نقرة */
      case 'ok':B(t,.045,'bandpass',1500,1.4,.8);B(t+.08,.07,'bandpass',2300,1.4,.7);break; /* نقرتان لطيفتان */
      case 'no':B(t,.2,'lowpass',240,.7,1.6);break;                                         /* ارتطام منخفض */
      case 'pop':B(t,.08,'bandpass',800,1.6,1.4);break;
      case 'zap':B(t,.16,'bandpass',3200,4,.9,500);break;                                   /* شعاع ليزر من ضجيج */
      case 'whoosh':B(t,.4,'bandpass',300,1.2,.9,2400);break;
      case 'thud':B(t,.14,'lowpass',160,.8,2);break;
      case 'key':B(t,.03,'highpass',4000,1,.5);B(t+.06,.03,'highpass',5000,1,.45);B(t+.12,.05,'highpass',4500,1,.4);break;
      case 'win':for(let k=0;k<16;k++)B(t+k*.05+Math.random()*.03,.05,'bandpass',1200+Math.random()*1800,1,.45);break; /* مثل التصفيق */
      case 'sparkle':for(let k=0;k<6;k++)B(t+k*.04,.04,'highpass',5000+Math.random()*3000,2,.3);break;
    }}catch(e){}}
};
['pointerdown','touchend'].forEach(ev=>document.addEventListener(ev,()=>SFX.unlock(),{capture:true,passive:true}));
const sfx=k=>SFX.play(k);
function sfxToggleHTML(){return `<button class="chipbtn" id="msfx" aria-label="المؤثرات الصوتية">${SFX.on?'🔊':'🔇'} المؤثرات</button>`;}
function bindSfxToggle(){const b=$('#msfx');if(b)b.onclick=()=>{SFX.set(!SFX.on);b.innerHTML=`${SFX.on?'🔊':'🔇'} المؤثرات`;if(SFX.on)sfx('ok');};}
