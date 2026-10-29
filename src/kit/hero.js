/* ===== البطل المشترك: الملف، الرسم، المتجر، الصناديق ===== */
const WKEY='rakan-world-v1';
const ITEMS=[
 /* id, slot, name, price, land */
 ['cap','hat','قبعة رياضية',20,'talk'],['shemagh','hat','شماغ وعقال',40,'all'],['pirate','hat','قبعة القرصان',60,'division'],['detective','hat','قبعة المحقق',60,'reading'],
 ['wizard','hat','قبعة الساحر',70,'talk'],['knight','hat','خوذة الفارس',80,'times'],['astro','hat','خوذة الفضاء',90,'reading'],['crown','hat','تاج الملك',150,'times'],
 ['tee','outfit','قميص ملوّن',0,'all'],['thobe','outfit','ثوب أبيض',30,'all'],['sport','outfit','قميص كرة القدم',40,'talk'],['trench','outfit','معطف المحقق',60,'reading'],
 ['coat','outfit','معطف القرصان',70,'division'],['robe','outfit','رداء الساحر',70,'talk'],['armor','outfit','درع الفارس',90,'times'],['space','outfit','بدلة الفضاء',90,'reading'],
 ['cape_r','cape','عباءة حمراء',40,'times'],['cape_b','cape','عباءة زرقاء',40,'all'],['cape_g','cape','عباءة ذهبية',120,'all'],
 ['glasses','acc','نظارة',25,'reading'],['shades','acc','نظارة شمسية',35,'talk'],['patch','acc','رقعة القرصان',30,'division'],
 ['book','held','كتاب',20,'reading'],['lens','held','عدسة مكبّرة',40,'reading'],['scope','held','منظار',40,'division'],['sword','held','سيف',50,'times'],['staff','held','عصا سحرية',50,'times'],
 ['cat','pet','قطة',60,'all'],['puppy','pet','جرو',60,'all'],['parrot','pet','ببغاء',70,'division'],['owl','pet','بومة',70,'reading'],['robot','pet','روبوت صغير',100,'talk'],['dragon','pet','تنين صغير',150,'times']
];
const ITEM={};ITEMS.forEach(([id,slot,name,price,land])=>ITEM[id]={id,slot,name,price,land});
const SLOTS=[['hat','قبعات','🎩'],['outfit','ملابس','👕'],['cape','عباءات','🦸'],['acc','نظارات','👓'],['held','في يدي','🗡️'],['pet','حيوانات','🐾']];
const SKIN=['#f9d9bf','#f0bf98','#d29a6c','#a8704a','#7a4b2e'],HAIRC=['#2b1d14','#5a3a22','#8a5a2b','#d9a441','#b5472b'],SHIRT=['#e5484d','#f59e0b','#22c55e','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f8fafc','#334155'];

const World={p:null,
  def:()=>({name:'',hero:{skin:1,hair:0,hairC:0,shirt:3,hat:'none',outfit:'tee',cape:'none',acc:'none',held:'none',pet:'none'},gems:0,own:{},digits:'ar',voiceAr:true,rate:1,made:false,migrated:false,gift:0,lastDaily:''}),
  load(){this.p=loadJSON(WKEY,this.def);this.p.hero=Object.assign(this.def().hero,this.p.hero||{});if(!this.p.migrated)this.migrate();},
  save(){saveJSON(WKEY,this.p);},
  add(n){if(!n)return;this.p.gems=Math.max(0,this.p.gems+n);this.save();hud();const g=$('#hgems');if(g&&n>0)shake(g,'pop');},
  spend(n){if(this.p.gems<n)return false;this.p.gems-=n;this.save();hud();return true;},
  owns(id){return id==='none'||!!this.p.own[id]||(ITEM[id]&&ITEM[id].price===0);},
  give(id){this.p.own[id]=1;this.save();},
  equip(slot,id){this.p.hero[slot]=id;this.save();hud();},
  migrate(){let total=0,name='';const old=[['mtable-heroes-v1','coins'],['division-heroes-v1','coins'],['talk-town-v1','xp'],['reading-rocket-v1','fuel']];
    old.forEach(([k,f])=>{try{const o=JSON.parse(localStorage.getItem(k)||'null');if(o){total+=+o[f]||0;if(!name&&o.name)name=o.name;}}catch(e){}});
    const g=Math.min(400,Math.floor(total/4));this.p.gems+=g;this.p.gift=g;if(name&&!this.p.name)this.p.name=name;this.p.migrated=true;this.save();}
};
World.load();

/* ---------- رسم البطل ---------- */
function heroSVG(h,o={}){
  const ink='#1d2433',sk=SKIN[h.skin]||SKIN[1],hc=HAIRC[h.hairC]||HAIRC[0],sc=SHIRT[h.shirt]||SHIRT[3],pose=o.pose||'idle',face=o.face||'smile';
  const outfit=h.outfit||'tee',hat=h.hat||'none';
  const OUT={tee:[sc,sc],sport:[sc,sc],thobe:['#f8fafc','#f8fafc'],armor:['#cbd5e1','#94a3b8'],coat:['#b91c1c','#b91c1c'],space:['#f1f5f9','#f1f5f9'],robe:['#6d28d9','#6d28d9'],trench:['#a0743d','#a0743d']}[outfit]||[sc,sc];
  const pants=outfit==='space'?'#e2e8f0':'#3b4a6b';
  const hands={idle:[[33,114],[87,114]],cheer:[[27,66],[93,66]],cast:[[33,114],[95,64]]}[pose]||[[33,114],[87,114]];
  const arm=(sx,[x,y])=>`<path d="M${sx} 88 Q${(sx+x)/2+(x<60?-6:6)} ${(88+y)/2} ${x} ${y}" stroke="${ink}" stroke-width="14" stroke-linecap="round" fill="none"/><path d="M${sx} 88 Q${(sx+x)/2+(x<60?-6:6)} ${(88+y)/2} ${x} ${y}" stroke="${OUT[1]}" stroke-width="9" stroke-linecap="round" fill="none"/><circle cx="${x}" cy="${y}" r="6.5" fill="${sk}" stroke="${ink}" stroke-width="2.5"/>`;
  const cape={cape_r:'#dc2626',cape_b:'#2563eb',cape_g:'#f59e0b'}[h.cape];
  let s='';
  s+=`<ellipse cx="60" cy="153" rx="30" ry="5.5" fill="rgba(0,0,0,.18)"/>`;
  if(cape)s+=`<path d="M41 84 L79 84 L94 142 Q60 150 26 142 Z" fill="${cape}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
  s+=`<rect x="47" y="122" width="11" height="26" rx="5" fill="${pants}" stroke="${ink}" stroke-width="2.5"/><rect x="62" y="122" width="11" height="26" rx="5" fill="${pants}" stroke="${ink}" stroke-width="2.5"/>
    <ellipse cx="51" cy="150" rx="9" ry="4.5" fill="${ink}"/><ellipse cx="69" cy="150" rx="9" ry="4.5" fill="${ink}"/>`;
  const torso=`M38 92 Q38 80 50 79 L70 79 Q82 80 82 92 L82 125 Q82 130 77 130 L43 130 Q38 130 38 125 Z`;
  if(outfit==='thobe')s+=`<path d="M38 90 Q38 79 50 78 L70 78 Q82 79 82 90 L86 145 Q86 149 82 149 L38 149 Q34 149 34 145 Z" fill="#f8fafc" stroke="${ink}" stroke-width="3"/><path d="M60 80 L60 104" stroke="#cbd5e1" stroke-width="2"/><circle cx="60" cy="88" r="1.6" fill="#94a3b8"/><circle cx="60" cy="96" r="1.6" fill="#94a3b8"/>`;
  else if(outfit==='robe')s+=`<path d="M38 90 Q38 79 50 78 L70 78 Q82 79 82 90 L88 146 Q60 152 32 146 Z" fill="#6d28d9" stroke="${ink}" stroke-width="3"/><path d="M52 108 l2 5 5 1 -4 3 1 5 -4-3 -4 3 1-5 -4-3 5-1z M70 126 l1.5 4 4 .5 -3 2.5 1 4 -3.5-2 -3.5 2 1-4 -3-2.5 4-.5z" fill="#fde047"/>`;
  else{s+=`<path d="${torso}" fill="${OUT[0]}" stroke="${ink}" stroke-width="3"/>`;
    if(outfit==='tee')s+=`<path d="M52 80 Q60 88 68 80" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="2.5"/>`;
    if(outfit==='sport')s+=`<path d="M40 92 L40 126 M80 92 L80 126" stroke="#fff" stroke-width="4"/><text x="60" y="114" text-anchor="middle" font-family="Lalezar, sans-serif" font-size="20" fill="#fff" stroke="${ink}" stroke-width=".8">${D(10)}</text>`;
    if(outfit==='armor')s+=`<path d="M44 96 Q60 104 76 96 M44 108 Q60 116 76 108" stroke="#64748b" stroke-width="2.5" fill="none"/><rect x="38" y="118" width="44" height="6" fill="#f59e0b" stroke="${ink}" stroke-width="2"/><circle cx="40" cy="86" r="7" fill="#94a3b8" stroke="${ink}" stroke-width="2.5"/><circle cx="80" cy="86" r="7" fill="#94a3b8" stroke="${ink}" stroke-width="2.5"/>`;
    if(outfit==='coat')s+=`<path d="M52 80 L60 98 L68 80 Z" fill="#f8fafc" stroke="${ink}" stroke-width="2"/><path d="M40 126 L36 140 L50 132 M80 126 L84 140 L70 132" fill="#b91c1c" stroke="${ink}" stroke-width="2.5"/><circle cx="54" cy="106" r="2.6" fill="#fbbf24"/><circle cx="66" cy="106" r="2.6" fill="#fbbf24"/><circle cx="54" cy="117" r="2.6" fill="#fbbf24"/><circle cx="66" cy="117" r="2.6" fill="#fbbf24"/>`;
    if(outfit==='space')s+=`<rect x="48" y="92" width="24" height="18" rx="4" fill="#f97316" stroke="${ink}" stroke-width="2"/><circle cx="54" cy="101" r="3" fill="#60a5fa"/><circle cx="66" cy="101" r="3" fill="#22c55e"/>`;
    if(outfit==='trench')s+=`<path d="M60 80 L60 130" stroke="#7c5426" stroke-width="2.5"/><rect x="38" y="110" width="44" height="6" fill="#7c5426" stroke="${ink}" stroke-width="2"/><path d="M52 80 L60 92 L68 80" fill="#e7d3b0" stroke="${ink}" stroke-width="2"/><path d="M40 128 L38 140 L60 136 L82 140 L80 128 Z" fill="#a0743d" stroke="${ink}" stroke-width="2.5"/>`;}
  s+=arm(42,hands[0]);
  /* ما في اليد */
  const [hx,hy]=hands[1];const ang=pose==='idle'?18:pose==='cheer'?-10:0;
  const HELD={sword:`<rect x="-3" y="-46" width="6" height="42" rx="2" fill="#e2e8f0" stroke="${ink}" stroke-width="2"/><rect x="-10" y="-6" width="20" height="5" rx="2" fill="#fbbf24" stroke="${ink}" stroke-width="1.5"/><rect x="-2.5" y="-1" width="5" height="10" fill="#7c4a1e"/>`,
    staff:`<line x1="0" y1="14" x2="0" y2="-40" stroke="#8a5526" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="-45" r="12" fill="rgba(125,211,252,.35)"/><circle cx="0" cy="-45" r="7.5" fill="#7dd3fc" stroke="${ink}" stroke-width="2"/>`,
    lens:`<line x1="0" y1="6" x2="0" y2="-14" stroke="#7c4a1e" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="-25" r="11" fill="rgba(186,230,253,.5)" stroke="${ink}" stroke-width="4"/>`,
    scope:`<rect x="-4" y="-36" width="8" height="34" rx="3" fill="#b45309" stroke="${ink}" stroke-width="2"/><rect x="-5.5" y="-46" width="11" height="11" rx="2" fill="#fbbf24" stroke="${ink}" stroke-width="2"/>`,
    book:`<rect x="-12" y="-16" width="24" height="18" rx="2" fill="#e5484d" stroke="${ink}" stroke-width="2"/><path d="M0 -16 V2" stroke="#fff" stroke-width="2"/>`}[h.held];
  if(HELD&&!o.head)s+=`<g transform="translate(${hx} ${hy}) rotate(${ang})">${HELD}</g>`;
  s+=arm(78,hands[1]);
  s+=`<rect x="54" y="72" width="12" height="10" fill="${sk}"/>`;
  /* الرأس */
  s+=`<circle cx="30" cy="55" r="6" fill="${sk}" stroke="${ink}" stroke-width="2.5"/><circle cx="90" cy="55" r="6" fill="${sk}" stroke="${ink}" stroke-width="2.5"/><circle cx="60" cy="50" r="30" fill="${sk}" stroke="${ink}" stroke-width="3"/>`;
  const hideHair=hat==='knight'||hat==='shemagh';
  if(!hideHair){const H=[`<path d="M31 52 Q29 21 60 20 Q91 21 89 52 Q86 37 75 33 Q66 40 52 34 Q38 37 31 52 Z" fill="${hc}" stroke="${ink}" stroke-width="2.5"/>`,
      `<path d="M31 50 L33 30 L41 35 L44 20 L52 31 L60 15 L67 31 L75 20 L79 35 L87 30 L89 50 Q80 36 60 36 Q40 36 31 50 Z" fill="${hc}" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"/>`,
      `<path d="M30 50 Q30 24 60 22 Q90 24 90 50 Q84 40 60 40 Q36 40 30 50 Z" fill="${hc}"/>${[[34,40,9],[42,29,10],[53,23,10],[66,23,10],[77,29,10],[86,40,9]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${hc}" stroke="${ink}" stroke-width="2"/>`).join('')}`,
      `<path d="M30 54 Q27 20 62 20 Q93 22 90 54 Q88 36 72 30 Q58 42 30 54 Z" fill="${hc}" stroke="${ink}" stroke-width="2.5"/>`,
      `<path d="M31 52 Q29 21 60 20 Q91 21 89 52 Q86 37 75 33 Q66 40 52 34 Q38 37 31 52 Z" fill="${hc}" stroke="${ink}" stroke-width="2.5"/><path d="M31 48 Q27 72 35 84 L40 60 Z M89 48 Q93 72 85 84 L80 60 Z" fill="${hc}" stroke="${ink}" stroke-width="2"/>`];
    s+=H[h.hair]||H[0];}
  /* الوجه */
  s+=`<circle cx="41" cy="63" r="5" fill="#ff8fa3" opacity=".45"/><circle cx="79" cy="63" r="5" fill="#ff8fa3" opacity=".45"/>
    <g class="eyes"><ellipse cx="49" cy="54" rx="4.2" ry="5.2" fill="${ink}"/><ellipse cx="71" cy="54" rx="4.2" ry="5.2" fill="${ink}"/><circle cx="50.6" cy="52.2" r="1.6" fill="#fff"/><circle cx="72.6" cy="52.2" r="1.6" fill="#fff"/></g>
    <path d="M44 45 Q49 ${face==='sad'?46:42} 54 45 M66 45 Q71 ${face==='sad'?46:42} 76 45" stroke="${ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  s+={happy:`<path d="M50 63 Q60 77 70 63 Z" fill="#7a2e2e" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"/>`,sad:`<path d="M52 70 Q60 63 68 70" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    wow:`<ellipse cx="60" cy="67" rx="4.5" ry="5.5" fill="#7a2e2e" stroke="${ink}" stroke-width="2.5"/>`}[face]||`<path d="M51 65 Q60 72 69 65" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  /* النظارات */
  if(h.acc==='glasses')s+=`<circle cx="49" cy="54" r="8" fill="rgba(255,255,255,.18)" stroke="${ink}" stroke-width="2.5"/><circle cx="71" cy="54" r="8" fill="rgba(255,255,255,.18)" stroke="${ink}" stroke-width="2.5"/><path d="M57 54 L63 54" stroke="${ink}" stroke-width="2.5"/>`;
  if(h.acc==='shades')s+=`<rect x="40" y="48" width="18" height="12" rx="4" fill="#111827"/><rect x="62" y="48" width="18" height="12" rx="4" fill="#111827"/><path d="M58 52 L62 52" stroke="#111827" stroke-width="3"/><path d="M43 51 L48 51" stroke="#fff" stroke-width="2" opacity=".6"/>`;
  if(h.acc==='patch')s+=`<path d="M32 44 L90 60" stroke="#111827" stroke-width="2.5"/><ellipse cx="71" cy="54" rx="8.5" ry="7.5" fill="#111827"/>`;
  /* القبعة */
  const HAT={cap:`<path d="M31 41 Q31 17 60 17 Q89 17 89 41 Z" fill="${sc==='#f8fafc'?'#e5484d':sc}" stroke="${ink}" stroke-width="3"/><path d="M58 40 Q86 35 101 43 Q92 49 60 46 Z" fill="${ink}" opacity=".85"/><circle cx="60" cy="18" r="3" fill="${ink}"/>`,
    crown:`<path d="M34 32 L38 11 L48 24 L60 5 L72 24 L82 11 L86 32 Z" fill="#fbbf24" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/><rect x="34" y="30" width="52" height="8" rx="2" fill="#f59e0b" stroke="${ink}" stroke-width="2.5"/><circle cx="60" cy="18" r="3.5" fill="#e5484d"/><circle cx="45" cy="27" r="2.6" fill="#3b82f6"/><circle cx="75" cy="27" r="2.6" fill="#22c55e"/>`,
    pirate:`<path d="M18 38 Q32 10 60 10 Q88 10 102 38 Q80 29 60 31 Q40 29 18 38 Z" fill="#1f2937" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/><path d="M22 35 Q60 22 98 35" stroke="#fbbf24" stroke-width="3" fill="none"/><circle cx="60" cy="21" r="5.5" fill="#f8fafc"/><circle cx="58" cy="20" r="1.1" fill="#1f2937"/><circle cx="62" cy="20" r="1.1" fill="#1f2937"/><path d="M57.5 23 Q60 25 62.5 23" stroke="#1f2937" stroke-width="1.2" fill="none"/>`,
    knight:`<path d="M27 60 Q25 15 60 14 Q95 15 93 60 L85 60 Q85 32 60 32 Q35 32 35 60 Z" fill="#cbd5e1" stroke="${ink}" stroke-width="3"/><path d="M60 14 Q66 -3 86 3 Q73 8 67 16 Z" fill="#e5484d" stroke="${ink}" stroke-width="2.5"/><path d="M60 15 V31" stroke="#94a3b8" stroke-width="3"/><circle cx="31" cy="52" r="2" fill="#64748b"/><circle cx="89" cy="52" r="2" fill="#64748b"/>`,
    astro:`<circle cx="60" cy="50" r="38" fill="rgba(186,230,253,.2)" stroke="#e2e8f0" stroke-width="4"/><path d="M36 33 Q44 21 58 18" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".75"/><rect x="40" y="84" width="40" height="7" rx="3" fill="#cbd5e1" stroke="${ink}" stroke-width="2"/>`,
    wizard:`<path d="M29 36 L66 -5 L91 36 Z" fill="#6d28d9" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="60" cy="36" rx="35" ry="7" fill="#5b21b6" stroke="${ink}" stroke-width="2.5"/><path d="M60 16 l2 4.5 5 .5 -3.8 3 1.2 5 -4.4-2.6 -4.4 2.6 1.2-5 -3.8-3 5-.5z" fill="#fde047"/>`,
    detective:`<path d="M31 41 Q31 18 60 18 Q89 18 89 41 Z" fill="#a0743d" stroke="${ink}" stroke-width="3"/><ellipse cx="60" cy="41" rx="37" ry="6" fill="#8a5f2e" stroke="${ink}" stroke-width="2.5"/><path d="M40 26 L80 26 M36 34 L84 34" stroke="#7c5426" stroke-width="2"/><path d="M60 18 V8" stroke="${ink}" stroke-width="2.5"/><circle cx="60" cy="7" r="3" fill="#7c5426"/>`,
    shemagh:`<defs><pattern id="shm" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><path d="M0 0h4v4H0zM4 4h4v4H4z" fill="#e11d48"/></pattern></defs><path d="M24 62 Q22 14 60 13 Q98 14 96 62 L106 106 Q97 98 88 94 L88 55 Q79 38 60 38 Q41 38 32 55 L32 94 Q23 98 14 106 Z" fill="url(#shm)" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="60" cy="26" rx="31" ry="6" fill="none" stroke="#111827" stroke-width="4.5"/><ellipse cx="60" cy="33" rx="30" ry="5.5" fill="none" stroke="#111827" stroke-width="4"/>`}[hat];
  if(HAT)s+=HAT;
  /* الحيوان الأليف */
  let w=120;
  if(h.pet&&h.pet!=='none'&&o.pet!==false&&!o.head){w=170;s+=`<g transform="translate(140 112)">${petSVG(h.pet)}</g>`;}
  const vb=o.head?'20 -8 80 92':`0 -8 ${w} 168`;
  return `<svg class="hero ${o.head?'headonly':''} ${o.cls||''}" viewBox="${vb}" aria-hidden="true">${s}</svg>`;
}
function petSVG(p){const ink='#1d2433';
  return {cat:`<ellipse cx="0" cy="40" rx="22" ry="4" fill="rgba(0,0,0,.15)"/><path d="M14 26 Q30 20 24 6" stroke="#f59e0b" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="28" rx="15" ry="12" fill="#f59e0b" stroke="${ink}" stroke-width="2.5"/><circle cx="-2" cy="8" r="12" fill="#f59e0b" stroke="${ink}" stroke-width="2.5"/><path d="M-12 2 L-12 -10 L-4 -2 M8 2 L8 -10 L0 -2" fill="#f59e0b" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="-6" cy="7" r="2" fill="${ink}"/><circle cx="3" cy="7" r="2" fill="${ink}"/><path d="M-4 12 Q-1.5 14 1 12" stroke="${ink}" stroke-width="1.8" fill="none"/>`,
    puppy:`<ellipse cx="0" cy="40" rx="22" ry="4" fill="rgba(0,0,0,.15)"/><ellipse cx="0" cy="28" rx="15" ry="12" fill="#c08457" stroke="${ink}" stroke-width="2.5"/><circle cx="-1" cy="8" r="12" fill="#c08457" stroke="${ink}" stroke-width="2.5"/><ellipse cx="-12" cy="8" rx="5" ry="9" fill="#7c4a1e" stroke="${ink}" stroke-width="2"/><ellipse cx="10" cy="8" rx="5" ry="9" fill="#7c4a1e" stroke="${ink}" stroke-width="2"/><circle cx="-5" cy="6" r="2" fill="${ink}"/><circle cx="3" cy="6" r="2" fill="${ink}"/><ellipse cx="-1" cy="11" rx="3" ry="2" fill="${ink}"/><path d="M-2 14 Q-1 19 1 14" fill="#f472b6"/>`,
    parrot:`<ellipse cx="0" cy="40" rx="18" ry="4" fill="rgba(0,0,0,.15)"/><path d="M-4 30 L-10 44 M4 30 L10 44" stroke="#e5484d" stroke-width="4" stroke-linecap="round"/><path d="M2 32 L-2 48 L6 46 Z" fill="#3b82f6" stroke="${ink}" stroke-width="2"/><ellipse cx="0" cy="20" rx="11" ry="15" fill="#22c55e" stroke="${ink}" stroke-width="2.5"/><circle cx="0" cy="2" r="10" fill="#22c55e" stroke="${ink}" stroke-width="2.5"/><path d="M8 1 Q16 4 9 9 Z" fill="#f59e0b" stroke="${ink}" stroke-width="2"/><circle cx="3" cy="0" r="2.2" fill="${ink}"/><path d="M-8 16 Q-14 26 -4 30" fill="#e5484d" stroke="${ink}" stroke-width="2"/>`,
    owl:`<ellipse cx="0" cy="40" rx="18" ry="4" fill="rgba(0,0,0,.15)"/><ellipse cx="0" cy="22" rx="15" ry="18" fill="#a16207" stroke="${ink}" stroke-width="2.5"/><path d="M-12 6 L-10 -6 L-3 4 M12 6 L10 -6 L3 4" fill="#a16207" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="-6" cy="12" r="6" fill="#fff" stroke="${ink}" stroke-width="2"/><circle cx="6" cy="12" r="6" fill="#fff" stroke="${ink}" stroke-width="2"/><circle cx="-6" cy="12" r="2.6" fill="${ink}"/><circle cx="6" cy="12" r="2.6" fill="${ink}"/><path d="M-2 18 L2 18 L0 22 Z" fill="#f59e0b"/><ellipse cx="0" cy="30" rx="8" ry="7" fill="#fde68a"/>`,
    robot:`<ellipse cx="0" cy="40" rx="18" ry="4" fill="rgba(0,0,0,.15)"/><rect x="-11" y="20" width="22" height="18" rx="4" fill="#94a3b8" stroke="${ink}" stroke-width="2.5"/><rect x="-13" y="-2" width="26" height="20" rx="6" fill="#cbd5e1" stroke="${ink}" stroke-width="2.5"/><circle cx="-5" cy="8" r="3.5" fill="#22d3ee"/><circle cx="5" cy="8" r="3.5" fill="#22d3ee"/><path d="M0 -2 V-10" stroke="${ink}" stroke-width="2.5"/><circle cx="0" cy="-12" r="3.5" fill="#e5484d" stroke="${ink}" stroke-width="1.5"/><rect x="-5" y="26" width="10" height="5" rx="2" fill="#fbbf24"/>`,
    dragon:`<ellipse cx="0" cy="40" rx="22" ry="4" fill="rgba(0,0,0,.15)"/><path d="M12 30 Q30 30 26 14" stroke="#16a34a" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-4 16 L-22 2 L-16 20 Z M4 16 L10 -2 L14 18 Z" fill="#a855f7" stroke="${ink}" stroke-width="2.2" stroke-linejoin="round"/><ellipse cx="0" cy="28" rx="14" ry="12" fill="#22c55e" stroke="${ink}" stroke-width="2.5"/><ellipse cx="0" cy="31" rx="8" ry="7" fill="#fde68a"/><circle cx="-3" cy="8" r="11" fill="#22c55e" stroke="${ink}" stroke-width="2.5"/><path d="M-10 0 L-12 -8 L-6 -2 M2 -2 L4 -10 L6 -1" fill="#fbbf24" stroke="${ink}" stroke-width="2"/><circle cx="-6" cy="7" r="2" fill="${ink}"/><circle cx="1" cy="7" r="2" fill="${ink}"/><path d="M-7 12 Q-3 15 1 12" stroke="${ink}" stroke-width="1.8" fill="none"/>`}[p]||'';}

/* ---------- صنع البطل لأول مرة ---------- */
function heroMaker(onDone){
  const h=Object.assign({},World.p.hero);
  const box=document.createElement('div');box.className='ov maker';
  const row=(label,key,arr,isColor)=>`<div class="mrow"><span>${label}</span><div class="mopts">${arr.map((c,i)=>`<button class="mo ${isColor?'col':''} ${h[key]===i?'on':''}" data-k="${key}" data-v="${i}" ${isColor?`style="background:${c}"`:''} aria-label="${label} ${i+1}">${isColor?'':c}</button>`).join('')}</div></div>`;
  const paint=()=>{box.innerHTML=`<div class="res maker-in"><h2>اصنع بطلك! 🦸</h2><div class="mprev bob">${heroSVG(h,{face:'happy',pose:'cheer'})}</div>
    <label class="mlab" for="hn">ما اسمك؟</label><input class="inp" id="hn" maxlength="14" placeholder="اكتب اسمك" value="${esc(World.p.name)}" autocomplete="off">
    ${row('لون البشرة','skin',SKIN,true)}${row('الشعر','hair',['✂️','⚡','🌀','💇','🦁'],false)}${row('لون الشعر','hairC',HAIRC,true)}${row('لون القميص','shirt',SHIRT,true)}
    <button class="btn big wide" id="mgo">🚀 انطلق</button></div>`;
    $$('.mo',box).forEach(b=>b.onclick=()=>{World.p.name=$('#hn',box).value;h[b.dataset.k]=+b.dataset.v;paint();});
    $('#mgo',box).onclick=()=>{World.p.name=($('#hn',box).value.trim()||'البطل').slice(0,14);World.p.hero=h;World.p.made=true;World.save();box.remove();hud();
      if(World.p.gift){toast(`🎁 وجدنا كنزك القديم: +${D(World.p.gift)} 💎`,3500);World.p.gift=0;World.save();}onDone&&onDone();};};
  paint();document.body.appendChild(box);
}

/* ---------- خزانة البطل والمتجر ---------- */
def('closet',(tab)=>{
  setTitle('🦸 بطلي');tab=tab||'look';const h=World.p.hero;let tryOn=null;
  const tabs=[['look','الشكل','🎨'],...SLOTS];
  function draw(){
    const prev=Object.assign({},h);if(tryOn)prev[ITEM[tryOn].slot]=tryOn;
    const it=tryOn&&ITEM[tryOn],owned=it&&World.owns(it.id),worn=it&&h[it.slot]===it.id;
    $('#view').innerHTML=`<div class="closet">
      <div class="cprev"><div class="bob">${heroSVG(prev,{face:'happy',pose:'cheer'})}</div><div><h2>${esc(World.p.name||'البطل')}</h2><p class="gemline">💎 ${D(World.p.gems)} جوهرة</p><p class="muted small">اجمع الجواهر في أي لعبة، واشترِ بها لبطلك.</p></div></div>
      <div class="ctabs">${tabs.map(t=>`<button class="ctab ${t[0]===tab?'on':''}" data-t="${t[0]}">${t[2]}<span>${t[1]}</span></button>`).join('')}</div>
      <div id="cbody"></div>
      ${it?`<div class="cbar"><span><b>${it.name}</b> ${owned?'':`· 💎 ${D(it.price)}`}</span>${worn?`<button class="btn ghost sm" id="coff">اخلعه</button>`:owned?`<button class="btn sm ok" id="cwear">ارتدِه ✓</button>`:`<button class="btn sm" id="cbuy" ${World.p.gems<it.price?'disabled':''}>${World.p.gems<it.price?`ينقصك ${D(it.price-World.p.gems)} 💎`:'اشترِ'}</button>`}</div>`:''}
    </div>`;
    $$('.ctab').forEach(b=>b.onclick=()=>{tab=b.dataset.t;tryOn=null;draw();});
    const body=$('#cbody');
    if(tab==='look'){const row=(label,key,arr,isColor,icons)=>`<div class="mrow"><span>${label}</span><div class="mopts">${arr.map((c,i)=>`<button class="mo ${isColor?'col':''} ${h[key]===i?'on':''}" data-k="${key}" data-v="${i}" ${isColor?`style="background:${c}"`:''} aria-label="${label} ${i+1}">${isColor?'':icons[i]}</button>`).join('')}</div></div>`;
      body.innerHTML=`<div class="card">${row('لون البشرة','skin',SKIN,true)}${row('الشعر','hair',[0,1,2,3,4],false,['✂️','⚡','🌀','💇','🦁'])}${row('لون الشعر','hairC',HAIRC,true)}${row('لون القميص','shirt',SHIRT,true)}
        <div class="mrow"><span>الاسم</span><input class="inp" id="cn" maxlength="14" value="${esc(World.p.name)}"></div>
        <div class="mrow"><span>الأرقام</span><div class="seg"><button data-d="ar" class="${World.p.digits!=='en'?'on':''}">١٢٣</button><button data-d="en" class="${World.p.digits==='en'?'on':''}">123</button></div></div>
        <div class="mrow"><span>صوت الإرشادات</span><div class="seg"><button data-va="1" class="${World.p.voiceAr?'on':''}">🔈 يعمل</button><button data-va="0" class="${!World.p.voiceAr?'on':''}">🔇 صامت</button></div></div></div>`;
      $$('.mo',body).forEach(b=>b.onclick=()=>{h[b.dataset.k]=+b.dataset.v;World.save();hud();draw();});
      $('#cn').onchange=()=>{World.p.name=$('#cn').value.trim().slice(0,14)||World.p.name;World.save();};
      $$('[data-d]',body).forEach(b=>b.onclick=()=>{World.p.digits=b.dataset.d;World.save();hud();draw();});
      $$('[data-va]',body).forEach(b=>b.onclick=()=>{World.p.voiceAr=b.dataset.va==='1';World.save();draw();});}
    else{const list=ITEMS.filter(x=>x[1]===tab).map(x=>ITEM[x[0]]).sort((a,b)=>(b.land===APP.land)-(a.land===APP.land)||a.price-b.price);
      body.innerHTML=`<div class="items">${tab!=='outfit'?`<button class="item ${h[tab]==='none'?'worn':''}" data-none="1"><div class="ipic none">✖</div><b>بدون</b></button>`:''}${list.map(it=>{const p=Object.assign({},h,{[it.slot]:it.id});
        return `<button class="item ${tryOn===it.id?'sel':''} ${h[it.slot]===it.id?'worn':''}" data-i="${it.id}">${it.land===APP.land?'<span class="itag">⭐ من هنا</span>':''}<div class="ipic">${heroSVG(p,{face:'smile',head:it.slot==='hat'||it.slot==='acc'})}</div><b>${it.name}</b><span class="iprice">${World.owns(it.id)?'✔ لك':`💎 ${D(it.price)}`}</span></button>`;}).join('')}</div>`;
      $$('.item',body).forEach(b=>b.onclick=()=>{if(b.dataset.none){World.equip(tab,'none');tryOn=null;draw();return;}tryOn=b.dataset.i;draw();});}
    if($('#cbuy'))$('#cbuy').onclick=()=>{const it=ITEM[tryOn];if(World.spend(it.price)){World.give(it.id);World.equip(it.slot,it.id);FX.confetti();toast(`🎉 اشتريت ${it.name}!`);draw();}};
    if($('#cwear'))$('#cwear').onclick=()=>{const it=ITEM[tryOn];World.equip(it.slot,it.id);toast('✓ يبدو رائعاً!');draw();};
    if($('#coff'))$('#coff').onclick=()=>{const it=ITEM[tryOn];if(it.slot==='outfit')World.equip('outfit','tee');else World.equip(it.slot,'none');draw();};
  }
  draw();
});

/* ---------- صندوق الكنز ---------- */
function openChest(o={}){
  const ov=document.createElement('div');ov.className='ov chestov';let taps=0;const need=3;
  const pool=ITEMS.map(x=>ITEM[x[0]]).filter(it=>it.price>0&&it.price<=(o.maxPrice||90)&&!World.owns(it.id));
  const itemWin=pool.length&&Math.random()<(o.itemChance==null?.3:o.itemChance);
  const reward=itemWin?{item:pick(pool.filter(i=>i.land===APP.land).length&&Math.random()<.6?pool.filter(i=>i.land===APP.land):pool)}:{gems:rint(o.min||8,o.max||25)};
  ov.innerHTML=`<div class="res chest-in"><h2>${o.title||'صندوق كنز! 🎁'}</h2><p class="muted">اضغط الصندوق ${D(need)} مرات لتفتحه</p>
    <button class="chest" id="chest" aria-label="افتح الصندوق"><svg viewBox="0 0 120 100"><rect x="14" y="44" width="92" height="48" rx="8" fill="#a0632d" stroke="#3b2210" stroke-width="4"/><path d="M14 52 Q14 18 60 18 Q106 18 106 52 Z" fill="#c27a3a" stroke="#3b2210" stroke-width="4" class="lid"/><rect x="54" y="42" width="12" height="18" rx="3" fill="#fbbf24" stroke="#3b2210" stroke-width="3"/><path d="M14 64 H106 M36 44 V92 M84 44 V92" stroke="#7a4518" stroke-width="4"/></svg></button>
    <div id="crew"></div></div>`;
  document.body.appendChild(ov);
  const ch=$('#chest',ov);
  ch.onclick=()=>{if(taps>=need)return;taps++;shake(ch,'wobble');buzz(25);const [x,y]=centerOf(ch);FX.burst(x,y,{n:8,colors:['#fbbf24','#fde68a']});
    if(taps<need)return;ch.classList.add('open');const hint=$('.muted',ov);if(hint)hint.style.visibility='hidden';FX.burst(x,y,{n:40,speed:360,colors:['#fbbf24','#fde68a','#ffffff','#8fe3ff']});FX.confetti();
    const r=$('#crew',ov);
    if(reward.item){World.give(reward.item.id);const p=Object.assign({},World.p.hero,{[reward.item.slot]:reward.item.id});
      r.innerHTML=`<div class="cwin"><div class="ipic big">${heroSVG(p,{face:'happy',head:reward.item.slot==='hat'||reward.item.slot==='acc'})}</div><p>حصلت على: <b>${reward.item.name}</b>!</p><div class="btns"><button class="btn ok" id="cwear">ارتدِه الآن</button><button class="btn ghost" id="cok">رائع!</button></div></div>`;
      $('#cwear',ov).onclick=()=>{World.equip(reward.item.slot,reward.item.id);ov.remove();o.onClose&&o.onClose();};}
    else{World.add(reward.gems);r.innerHTML=`<div class="cwin"><p class="gemgain">💎 +${D(reward.gems)}</p><div class="btns"><button class="btn" id="cok">رائع!</button></div></div>`;}
    $('#cok',ov).onclick=()=>{ov.remove();o.onClose&&o.onClose();};};
}
function dailyChestReady(){return World.p.lastDaily!==dayKey();}
function claimDaily(onClose){World.p.lastDaily=dayKey();World.save();openChest({title:'صندوق اليوم! 🎁',min:15,max:30,itemChance:.4,onClose});}
