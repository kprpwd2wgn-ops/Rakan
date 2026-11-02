/* ===== الصوت العربي الجديد: جمل مسجّلة مسبقاً بصوت Azure، تُشغَّل من ملفات بجانب اللعبة =====
   لا صوت للجهاز في هذه اللعبة. الملفات في APP.voices (manifest.json + ملف mp3 لكل جملة).
   CLIPS.say('m-3-4') يقطع ما قبله ويقول الجملة، و CLIPS.say(id,{queue:true}) ينتظر انتهاء الجملة الحالية. */
const CLIPS={ctx:null,ready:null,files:null,buf:{},order:[],cur:null,queue:[],tok:0,busy:false,
  unlock(){
    if(!this.ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
      try{this.ctx=new AC();}catch(e){return;}
      this.ready=fetch(APP.voices+'/manifest.json').then(r=>r.ok?r.json():null).then(m=>{
        if(m&&m.lines){this.files={};m.lines.forEach(l=>{this.files[l.id]=l.file;});}}).catch(()=>{});}
    if(this.ctx.state==='suspended')this.ctx.resume();},
  async get(id){if(this.buf[id])return this.buf[id];if(!this.ctx)return null;await this.ready;
    if(!this.files||!this.files[id])return null;
    try{const data=await (await fetch(APP.voices+'/'+this.files[id])).arrayBuffer();
      const b=await new Promise((ok,no)=>{const p=this.ctx.decodeAudioData(data,ok,no);if(p&&p.then)p.then(ok,no);});
      this.buf[id]=b;this.order.push(id);if(this.order.length>40)delete this.buf[this.order.shift()];return b;}catch(e){return null;}},
  warm(id){if(this.ctx)this.get(id);},
  has(id){return !!(this.files&&this.files[id]);},
  stop(){this.tok++;this.queue=[];this.busy=false;if(this.cur){const c=this.cur;this.cur=null;c.onended=null;try{c.stop();}catch(e){}}},
  say(id,o={}){if(!id||!World.p.voiceAr||!this.ctx)return;
    if(o.queue&&(this.cur||this.busy)){this.queue.push(id);return;}
    if(!o.queue)this.stop();
    this.play(id);},
  async play(id){const tok=++this.tok;this.busy=true;const b=await this.get(id);if(tok!==this.tok)return;this.busy=false;
    if(!b){this.next();return;}
    if(this.ctx.state==='suspended')this.ctx.resume();
    const s=this.ctx.createBufferSource();s.buffer=b;s.connect(this.ctx.destination);
    s.onended=()=>{if(this.cur===s){this.cur=null;this.next();}};this.cur=s;s.start();},
  next(){const id=this.queue.shift();if(id)this.play(id);}
};
/* على الآيفون يبدأ الصوت فقط من لمسة: أول لمسة تفتحه */
['pointerdown','touchend','click'].forEach(ev=>document.addEventListener(ev,()=>CLIPS.unlock(),true));
