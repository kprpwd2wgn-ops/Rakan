/* ===== قراصنة القسمة: البيانات ===== */
const APP={id:'division',land:'division',title:'قراصنة القسمة',home:'map',gh:'https://kprpwd2wgn-ops.github.io/Rakan/division.html'};
/* الجزر بترتيب التعلّم: لكل جزيرة رقم تقسم عليه، وحيوان ينضم إلى طاقمك */
const ISLANDS=[
 {d:1,name:'خليج البداية',mate:'نوري',crew:'narwhal',col:'#60a5fa',sky:['#8fd3ff','#e3f6ff'],sea:'#2f9bd6',hill:'#6cc463',boss:null},
 {d:2,name:'جزيرة السلاطع',mate:'قرقور',crew:'crab',col:'#ef4444',sky:['#ffc9a0','#fff1e3'],sea:'#2e86c1',hill:'#e9b872',boss:'kraken'},
 {d:10,name:'جزيرة القرود',mate:'موزّو',crew:'monkey',col:'#b7791f',sky:['#9be7a8','#ebfbec'],sea:'#2a9d8f',hill:'#3f9a52',boss:'shanbo'},
 {d:5,name:'جزيرة نجم البحر',mate:'نجمة',fem:1,crew:'starfish',col:'#fb923c',sky:['#ffd49a','#fff5e2'],sea:'#1f8ecf',hill:'#f1c27d',boss:'kraken'},
 {d:3,name:'جزيرة فرس البحر',mate:'فرفور',crew:'seahorse',col:'#14b8a6',sky:['#93ece4','#e6fcf9'],sea:'#1aa39a',hill:'#5cc28a',boss:'shanbo'},
 {d:4,name:'جزيرة السلاحف',mate:'سلحوف',crew:'turtle',col:'#22c55e',sky:['#b0f2d4','#effdf6'],sea:'#0f9bb0',hill:'#4fb06b',boss:'kraken'},
 {d:11,name:'بحيرة الفلامنغو',mate:'فلّو',crew:'flamingo',col:'#fb7185',sky:['#fccde6','#fff1f8'],sea:'#3b82c4',hill:'#7fcf8f',boss:'shanbo'},
 {d:9,name:'خليج الفقمات',mate:'فقّوم',crew:'seal',col:'#64748b',sky:['#cfd8e3','#f3f6fa'],sea:'#33658a',hill:'#9aa9bb',boss:'kraken'},
 {d:6,name:'جزيرة العسل',mate:'عسّولة',fem:1,crew:'bee',col:'#eab308',sky:['#fde58a','#fffbea'],sea:'#2b8ad1',hill:'#8cc152',boss:'shanbo'},
 {d:8,name:'جزيرة الأخطبوط',mate:'أخطوب',crew:'octopus',col:'#a855f7',sky:['#7d6ad8','#c2b8f7'],sea:'#2c3e94',hill:'#5b4bb0',boss:'kraken'},
 {d:7,name:'جزيرة القطط',mate:'بسبوسة',fem:1,crew:'cat',col:'#d946ef',sky:['#f3d1fd','#fdf4ff'],sea:'#3a7bd5',hill:'#9bd37c',boss:'shanbo'},
 {d:12,name:'جزيرة الساعة',mate:'بومبو',crew:'owl',col:'#4f46e5',sky:['#22306a','#56689f'],sea:'#16306b',hill:'#2c3d78',boss:'kraken'}
];
const ISL_OF={};ISLANDS.forEach((l,i)=>ISL_OF[l.d]=i);
/* العُقد على الخريطة */
const NODES=[];
ISLANDS.forEach((l,li)=>{if(l.d===1)NODES.push({id:'1-0',li,d:1,kind:'tutorial'});
  else['b1','b2','boss'].forEach((k,j)=>NODES.push({id:`${l.d}-${j+1}`,li,d:l.d,kind:k}));});
const NODE_I={};NODES.forEach((n,i)=>NODE_I[n.id]=i);
const nodeIcon=n=>n.kind==='tutorial'?'🎓':n.kind==='b1'?'💰':n.kind==='b2'?'🦜':ISLANDS[n.li].boss==='kraken'?'🐙':'⛵';
const nodeName=n=>n.kind==='tutorial'?'الدرس الأول':n.kind==='b1'?'قسمة الكنز':n.kind==='b2'?'كنز الببغاء':ISLANDS[n.li].boss==='kraken'?'الأخطبوط العملاق':'القبطان شنبو';

/* السفينة: الأشرعة والأعلام */
const SAILS=[['white','أبيض',0,'#f8fafc'],['red','أحمر',30,'#ef4444'],['blue','أزرق',30,'#3b82f6'],['green','أخضر',30,'#22c55e'],['purple','بنفسجي',50,'#8b5cf6'],['stripes','مخطّط',70,'#ef4444'],['gold','ذهبي',100,'#fbbf24']];
const FLAGS=[['anchor','مرساة',0,'⚓'],['star','نجمة',25,'⭐'],['parrot','ببغاء',40,'🦜'],['fish','سمكة',40,'🐟'],['moon','هلال',50,'🌙'],['crown','تاج',80,'👑']];

const GKEY='div-pirates-v1';
const G=loadJSON(GKEY,()=>({stars:{},crew:{},stats:{},mate:0,intro:false,best:0,migrated:false,plays:0,ship:{sail:'white',flag:'anchor'},yard:{white:1,anchor:1}}));
function gsave(){saveJSON(GKEY,G);}
/* نقل تقدّم لعبة القسمة القديمة */
if(!G.migrated){try{const o=JSON.parse(localStorage.getItem('division-heroes-v1')||'null');if(o&&o.stats)G.stats=Object.assign({},o.stats,G.stats);}catch(e){}G.migrated=true;gsave();}
const fk=(d,q)=>d+':'+q;
function mastery(d,q){const f=G.stats[fk(d,q)];if(!f||f.c+f.w===0)return 0;if(f.s>=3||(f.c>=4&&f.c>=f.w*3))return 3;if(f.c>f.w)return 2;return 1;}
function mateMastery(d){let m=0;for(let q=1;q<=12;q++)if(mastery(d,q)===3)m++;return m;}
function record(d,q,ok){if(!(d>=1&&q>=1&&q<=12))return;const k=fk(d,q),f=G.stats[k]||{c:0,w:0,s:0};if(ok){f.c++;f.s++;}else{f.w++;f.s=0;}G.stats[k]=f;gsave();}
const nodeUnlocked=i=>i===0||(G.stars[NODES[i-1].id]||0)>0;
const currentNode=()=>{for(let i=0;i<NODES.length;i++)if(!G.stars[NODES[i].id])return nodeUnlocked(i)?i:Math.max(0,i-1);return NODES.length-1;};
const unlockedDivs=()=>ISLANDS.filter(l=>G.stars[l.d===1?'1-0':`${l.d}-1`]).map(l=>l.d);
const rankOf=d=>{const m=mateMastery(d);return m>=9?3:m>=4?2:1;};
const RANKS=['','بحّار مبتدئ','بحّار ماهر','ذئب البحر 👑'];

/* عدّ الأشياء بالعربية: واحد، اثنان، ٣–١٠، ١١ فما فوق */
const W_COIN=['قطعة واحدة','قطعتان','قطعتين','قطع','قطعة'],W_GEM=['جوهرة واحدة','جوهرتان','جوهرتين','جواهر','جوهرة'],W_PEARL=['لؤلؤة واحدة','لؤلؤتان','لؤلؤتين','لآلئ','لؤلؤة'],
  W_PIR=['قرصان واحد','قرصانان','قرصانين','قراصنة','قرصاناً'],W_BAR=['برميل واحد','برميلان','برميلين','براميل','برميلاً'],W_FISH=['سمكة واحدة','سمكتان','سمكتين','سمكات','سمكة'],
  W_BAN=['موزة واحدة','موزتان','موزتين','موزات','موزة'],W_BALL=['كرة واحدة','كرتان','كرتين','كرات','كرة'];
/* acc: بعد حرف جر أو مفعول به (قرصانين)، وإلا (قرصانان) */
function nn(n,w,acc=true){return n===1?w[0]:n===2?(acc?w[2]:w[1]):n<=10?`${D(n)} ${w[3]}`:`${D(n)} ${w[4]}`;}
const LOOTW={coin:W_COIN,gem:W_GEM,pearl:W_PEARL},ITEMW={fish:W_FISH,banana:W_BAN,ball:W_BALL};
