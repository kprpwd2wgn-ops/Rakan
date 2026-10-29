/* ===== حرس القلعة: البيانات ===== */
const APP={id:'times',land:'times',title:'أبطال جدول الضرب',home:'map',gh:'https://kprpwd2wgn-ops.github.io/Rakan/times.html'};
const LANDS=[
 {t:1,name:'قرية البداية',mon:'slime',col:'#9be15d',sky:['#7cc8f5','#d6f1ff'],hill:'#7fc6a4',grass:'#6cc463'},
 {t:2,name:'غابة الفطر',mon:'mushroom',col:'#ff8fb1',sky:['#8fd6a8','#e3f9e9'],hill:'#4f9f6e',grass:'#4caf50'},
 {t:10,name:'جبل الصخور',mon:'rock',col:'#a3b1c6',sky:['#93a7d8','#e3e9fb'],hill:'#8190b1',grass:'#7a9a5b'},
 {t:5,name:'صحراء الصبّار',mon:'cactus',col:'#5fd38d',sky:['#ffc78a','#fff1d6'],hill:'#e8b26a',grass:'#e9c27c'},
 {t:3,name:'شاطئ السلطعون',mon:'crab',col:'#ff6f61',sky:['#6ccff6','#dff7ff'],hill:'#4fb6d8',grass:'#f3d999'},
 {t:4,name:'كهف الخفافيش',mon:'bat',col:'#a78bfa',sky:['#4c3a77','#8a73c2'],hill:'#3b2e5e',grass:'#5b4a86'},
 {t:11,name:'مدينة الغيوم',mon:'cloud',col:'#bae6fd',sky:['#a5c8ff','#f1f6ff'],hill:'#dbe8ff',grass:'#cfe0ff'},
 {t:9,name:'مملكة النحل',mon:'bee',col:'#facc15',sky:['#ffd76a','#fff7d1'],hill:'#e7b416',grass:'#8bc34a'},
 {t:6,name:'بحيرة الهلام',mon:'jelly',col:'#f472b6',sky:['#5fb3e8','#cfeeff'],hill:'#3d8fc2',grass:'#5fc1a8'},
 {t:8,name:'قصر الأشباح اللطيفة',mon:'ghost',col:'#e9d5ff',sky:['#3b3b7a','#7b6fc2'],hill:'#2f2f63',grass:'#4b4a8a'},
 {t:7,name:'مصنع الروبوتات',mon:'robot',col:'#38bdf8',sky:['#6b7a99','#c9d4e8'],hill:'#55627f',grass:'#8796b3'},
 {t:12,name:'جزيرة البطاريق',mon:'penguin',col:'#60a5fa',sky:['#9fd8ff','#f0fbff'],hill:'#d7f0ff',grass:'#eaf6ff'}
];
const LAND_OF={};LANDS.forEach((l,i)=>LAND_OF[l.t]=i);
const DNAME={1:'لولو',2:'زوزو',3:'تريكو',4:'فورا',5:'خمّوش',6:'سادو',7:'سبعو',8:'ثمّورة',9:'تيسو',10:'عشّور',11:'توأمو',12:'دزّو'};
/* العُقد على الخريطة */
const NODES=[];
LANDS.forEach((l,li)=>{if(l.t===1)NODES.push({id:'1-0',li,t:1,kind:'tutorial'});
  else[['b1','⚔️'],['b2','🛡️'],['boss','👑']].forEach(([k,ic],j)=>NODES.push({id:`${l.t}-${j+1}`,li,t:l.t,kind:k,icon:ic}));});
const NODE_I={};NODES.forEach((n,i)=>NODE_I[n.id]=i);

const GKEY='times-castle-v1';
const G=loadJSON(GKEY,()=>({stars:{},eggs:{},stats:{},comp:0,intro:false,best:0,migrated:false,plays:0}));
function gsave(){saveJSON(GKEY,G);}
if(!G.migrated){try{const o=JSON.parse(localStorage.getItem('mtable-heroes-v1')||'null');if(o&&o.stats)G.stats=Object.assign({},o.stats,G.stats);}catch(e){}G.migrated=true;gsave();}
const fk=(a,b)=>Math.min(a,b)+'x'+Math.max(a,b);
function mastery(a,b){const f=G.stats[fk(a,b)];if(!f||f.c+f.w===0)return 0;if(f.s>=3||(f.c>=4&&f.c>=f.w*3))return 3;if(f.c>f.w)return 2;return 1;}
function tableMastery(n){let m=0;for(let b=1;b<=12;b++)if(mastery(n,b)===3)m++;return m/12;}
function record(a,b,ok){const k=fk(a,b),f=G.stats[k]||{c:0,w:0,s:0};if(ok){f.c++;f.s++;}else{f.w++;f.s=0;}G.stats[k]=f;gsave();}
const nodeUnlocked=i=>i===0||(G.stars[NODES[i-1].id]||0)>0;
const currentNode=()=>{for(let i=0;i<NODES.length;i++)if(!G.stars[NODES[i].id])return nodeUnlocked(i)?i:Math.max(0,i-1);return NODES.length-1;};
const dragonStage=n=>!G.eggs[n]?0:tableMastery(n)>=.75?3:tableMastery(n)>=.35?2:1;
const unlockedTables=()=>LANDS.filter(l=>G.stars[l.t===1?'1-0':`${l.t}-1`]).map(l=>l.t);
