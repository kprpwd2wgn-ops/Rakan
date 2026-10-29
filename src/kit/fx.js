/* ===== المؤثرات: شرارات، كلمات طائرة، اهتزاز ===== */
if(window.CanvasRenderingContext2D&&!CanvasRenderingContext2D.prototype.roundRect){CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){r=Math.min(typeof r==='number'?r:(r&&r[0])||0,Math.abs(w)/2,Math.abs(h)/2);this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();return this;};}
const REDUCED=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const FX={c:null,x:null,p:[],raf:0,
  init(){this.c=$('#fx');if(!this.c)return;this.x=this.c.getContext('2d');const rs=()=>{const d=Math.min(2,window.devicePixelRatio||1);this.c.width=innerWidth*d;this.c.height=innerHeight*d;this.x.setTransform(d,0,0,d,0,0);};rs();addEventListener('resize',rs);},
  burst(x,y,o={}){if(!this.x)return;const n=REDUCED?Math.min(6,o.n||16):(o.n||16),cols=o.colors||['#ffd95a','#ff8a80','#8fe3ff','#b8f28c','#ffffff'];
    for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=(o.speed||220)*(.4+Math.random()*.8);
      this.p.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-(o.up||80),g:o.g==null?420:o.g,life:0,max:.55+Math.random()*.5,r:(o.size||5)*(.6+Math.random()*.8),col:pick(cols),emoji:o.emoji?pick([].concat(o.emoji)):null});}
    this.run();},
  text(x,y,txt,col='#fff',size=28){if(!this.x)return;this.p.push({x,y,vx:0,vy:-70,g:0,life:0,max:1.1,txt,col,size});this.run();},
  confetti(){if(REDUCED||!this.x)return;const cols=['#ffd95a','#ff8a80','#8fe3ff','#b8f28c','#c9a8ff','#ffb86b'];
    for(let i=0;i<120;i++)this.p.push({x:Math.random()*innerWidth,y:-20-Math.random()*innerHeight*.4,vx:(Math.random()-.5)*160,vy:80+Math.random()*160,g:120,life:0,max:2.6+Math.random(),r:4+Math.random()*5,col:pick(cols),rect:1,rot:Math.random()*6,vr:(Math.random()-.5)*8});
    this.run();},
  run(){if(this.raf)return;let last=performance.now();
    const step=t=>{const dt=Math.min(.05,(t-last)/1000);last=t;const x=this.x;x.clearRect(0,0,innerWidth,innerHeight);
      this.p=this.p.filter(q=>(q.life+=dt)<q.max);
      for(const q of this.p){q.vy+=q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;const a=1-q.life/q.max;x.globalAlpha=Math.max(0,Math.min(1,a*1.4));
        if(q.txt){x.font=`800 ${q.size}px Lalezar, "Baloo Bhaijaan 2", Tahoma, sans-serif`;x.textAlign='center';x.lineWidth=5;x.strokeStyle='rgba(0,0,0,.45)';x.strokeText(q.txt,q.x,q.y);x.fillStyle=q.col;x.fillText(q.txt,q.x,q.y);}
        else if(q.emoji){x.font=`${q.r*4}px sans-serif`;x.textAlign='center';x.fillText(q.emoji,q.x,q.y);}
        else if(q.rect){q.rot+=q.vr*dt;x.save();x.translate(q.x,q.y);x.rotate(q.rot);x.fillStyle=q.col;x.fillRect(-q.r,-q.r/2,q.r*2,q.r);x.restore();}
        else{x.fillStyle=q.col;x.beginPath();x.arc(q.x,q.y,q.r*a+1,0,7);x.fill();}}
      x.globalAlpha=1;if(this.p.length)this.raf=requestAnimationFrame(step);else{this.raf=0;x.clearRect(0,0,innerWidth,innerHeight);}};
    this.raf=requestAnimationFrame(step);}
};
function shake(el,cls='shake'){if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);}
function buzz(ms=30){try{if(navigator.vibrate)navigator.vibrate(ms);}catch(e){}}
function centerOf(el){const r=el.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2];}
