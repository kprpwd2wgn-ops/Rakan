/* ===== صاروخ القراءة: البيانات ===== */
const APP={id:'reading',land:'reading',title:'صاروخ القراءة',home:'hub',gh:'https://kprpwd2wgn-ops.github.io/Rakan/reading-rocket.html'};
const RKEY='reading-rocket-v2';
const RS=loadJSON(RKEY,()=>({mon:{},cases:{},rooms:{},stories:{},ends:{},read:0,intro:false,words:{}}));
function rsave(){saveJSON(RKEY,RS);}

/* ---------- وحوش الكلمات: المراحل ---------- */
const MAGIC=[['cake','🎂','كعكة'],['kite','🪁','طائرة ورقية'],['bone','🦴','عظمة'],['cube','🧊','مكعب'],['rose','🌹','وردة'],['nose','👃','أنف'],['home','🏠','بيت'],['plane','✈️','طائرة'],['smile','😊','ابتسامة'],['five','5️⃣','خمسة'],['dice','🎲','نرد'],['bike','🚲','دراجة']];
const MLEVELS=[
 {t:'a',ar:'صوت a القصير',tip:'a تُقرأ مثل الفتحة: cat = كات',words:()=>CVC.a.words},
 {t:'e',ar:'صوت e القصير',tip:'e تُقرأ مثل «إِ» الممالة: bed = بِد',words:()=>CVC.e.words},
 {t:'i',ar:'صوت i القصير',tip:'i تُقرأ مثل الكسرة: pig = پِق',words:()=>CVC.i.words},
 {t:'o',ar:'صوت o القصير',tip:'o تُقرأ مثل «أُ» المفتوحة: dog = دُق',words:()=>CVC.o.words},
 {t:'u',ar:'صوت u القصير',tip:'u تُقرأ مثل الفتحة الثقيلة: bus = بَس',words:()=>CVC.u.words},
 {t:'a e i o u',ar:'كل الأصوات معاً',tip:'انظر جيداً إلى الحرف الأوسط!',words:()=>['a','e','i','o','u'].flatMap(v=>CVC[v].words)},
 {t:'sh ch th',ar:'sh و ch و th',tip:'sh = ش، ch = تش، th = ث',words:()=>PATTERNS.slice(0,3).flatMap(p=>p.words)},
 {t:'ck ee',ar:'ck و ee',tip:'ck = ك، ee = إيي طويلة',words:()=>PATTERNS.slice(3,5).flatMap(p=>p.words)},
 {t:'oa ai',ar:'oa و ai',tip:'oa = أو طويلة، ai = إي',words:()=>PATTERNS.slice(5,7).flatMap(p=>p.words)},
 {t:'oo ar or',ar:'oo و ar و or',tip:'oo = أوو، ar = آر، or = أور',words:()=>PATTERNS.slice(7,10).flatMap(p=>p.words)},
 {t:'magic e',ar:'e السحرية',tip:'e في الآخر صامتة، وتجعل الحرف قبلها يقول اسمه: kit ← kite',words:()=>MAGIC},
 {t:'⭐ 1',ar:'كلمات النجوم ١',tip:'اسمع الكلمة، ثم اضرب الوحش الذي يحملها',sight:0},
 {t:'⭐ 2',ar:'كلمات النجوم ٢',tip:'كلمات نراها كثيراً: اقرأها بسرعة!',sight:1},
 {t:'⭐ 3',ar:'كلمات النجوم ٣',tip:'اسمع جيداً، فبعض الكلمات تتشابه',sight:2},
 {t:'⭐ 4',ar:'كلمات النجوم ٤',tip:'المرحلة الأخيرة! كن سريعاً',sight:3}
];
/* كلمات حقيقية تُستخدم كوحوش مشابهة (تختلف بحرف واحد) */
const POOL=('bad bag ban bat bed beg bet bib bid big bin bit bog bud bug bun bus but cab can cap cat cob cod cop cot cub cup cut dad dam den dig dim dip dog dot dug fan fat fed fig fin fit fix fog fox fun gap gas get got gum gun hag ham hat hem hen hid him hip hit hog hop hot hug hum hut jab jam jar jet jig job jog jot jug kid kit lab lad lap led leg let lid lip lit log lot mad man map mat men met mix mom mop mud mug nap net nod not nut pad pan pat peg pen pet pig pin pit pod pop pot pup rag ram ran rap rat red rib rid rig rim rip rob rod rot rub rug run sad sat set sip sit six sob sun tab tag tan tap ten tin tip top tub tug van vet wag web wet wig win yak yam zip '+
 'ship shop chip chop chin shin thin this that than then them shut chat shell sell bell tell well fish dish wish wash cash bath math path with chick check shack thick sick sock suck rock rack duck dock deck clock click block cheese chess lunch bunch punch three tree free thumb teeth '+
 'bee see sea feet meet fee tee sheep sleep steep boat coat goat moat road load toad rain pain main gain snail nail tail train paint faint moon soon noon spoon boot root pool cool tool food car jar far bar star scar shark park dark corn horn born fork storm form horse '+
 'cake bake lake make take kite bite site bone cone tone cube tube rose nose hose home dome plane smile five hive dice rice nice bike like hike cape tape rope hope kit hop cut cub').split(' ');
const SIGHT_ALL=()=>SIGHT.flatMap(s=>s.words);

/* ---------- المحقق: إعدادات القضايا ---------- */
const CASES=[
 {n:4,att:['col','hat'],neg:false,loot:'🍰',lootEn:'the moon cake',lootAr:'كعكة القمر'},
 {n:4,att:['col','hat','gl'],neg:false,loot:'💎',lootEn:'the star gem',lootAr:'جوهرة النجوم'},
 {n:5,att:['col','eyes','hat'],neg:false,loot:'🧀',lootEn:'the space cheese',lootAr:'جبنة الفضاء'},
 {n:5,att:['col','eyes','gl','item'],neg:false,loot:'🔑',lootEn:'the rocket key',lootAr:'مفتاح الصاروخ'},
 {n:6,att:['col','eyes','hat','item'],neg:false,loot:'🍩',lootEn:'the planet donut',lootAr:'كعكة الكوكب المحلاة'},
 {n:6,att:['col','eyes','hat','gl','ant'],neg:true,loot:'⏰',lootEn:'the time clock',lootAr:'ساعة الزمن'},
 {n:6,att:['col','hat','gl','item','ant'],neg:true,loot:'👑',lootEn:'the queen\'s crown',lootAr:'تاج الملكة'},
 {n:7,att:['col','eyes','hat','gl','item','ant'],neg:true,loot:'🛸',lootEn:'the tiny spaceship',lootAr:'السفينة الصغيرة'},
 {n:8,att:['col','eyes','hat','gl','item','ant','big'],neg:true,loot:'🌟',lootEn:'the lucky star',lootAr:'نجمة الحظ'},
 {n:8,att:['col','eyes','hat','gl','item','ant','big'],neg:true,and:true,loot:'🏆',lootEn:'the space cup',lootAr:'كأس الفضاء'}
];
const SCOL={red:'#ef4444',blue:'#3b82f6',green:'#22c55e',yellow:'#facc15',purple:'#a855f7',orange:'#fb923c'};
const SCOLAR={red:'أحمر',blue:'أزرق',green:'أخضر',yellow:'أصفر',purple:'بنفسجي',orange:'برتقالي'};
const ITEMAR={balloon:'بالونة',book:'كتاباً',ball:'كرة',flower:'وردة'};
const NUMEN=['zero','one','two','three'];

/* كلمات إضافية للمعجم (للضغط على الكلمة ومعرفة معناها) */
Object.assign(DICT,{thief:'اللص',has:'يملك / عنده',have:'يملك',not:'ليس / لا',no:'لا / بلا',glasses:'نظارة',crown:'تاج',cap:'قبعة رياضية',hat:'قبعة',eye:'عين',eyes:'عيون',antenna:'قرن استشعار',antennas:'قرون استشعار',
 holding:'يمسك',balloon:'بالون',flower:'وردة',purple:'بنفسجي',orange:'برتقالي',yellow:'أصفر',green:'أخضر',small:'صغير',nothing:'لا شيء',hands:'يدان',his:'له / ـه',
 look:'انظر',under:'تحت',behind:'خلف',next:'بجانب (next to)',between:'بين',inside:'داخل',on:'على',in:'في',box:'صندوق',lamp:'مصباح',plant:'نبتة',rug:'سجادة',picture:'صورة',chair:'كرسي',table:'طاولة',cupboard:'خزانة',window:'نافذة',teddy:'دبدوب',robot:'روبوت',clock:'ساعة',door:'باب',key:'مفتاح',code:'رمز سري',note:'ورقة / رسالة',
 space:'فضاء',station:'محطة',sound:'صوت',beep:'بيب',finds:'يجد',found:'وجد',needs:'يحتاج',help:'مساعدة',battery:'بطارية',cookie:'بسكويتة',turn:'تصبح / تتحول',jumps:'يقفز',wags:'يهزّ',tail:'ذيل',friend:'صديق',best:'أفضل',
 laughs:'تضحك',robots:'الروبوتات',eat:'يأكل',stuck:'عالق',open:'افتح',call:'نادِ',captain:'القبطان',free:'حر',runs:'يركض',around:'حول',room:'غرفة',licks:'يلعق',tool:'أداة',smiles:'يبتسم',lost:'ضائع',gives:'يعطي',gold:'ذهبي',star:'نجمة',
 picnic:'نزهة',sandwiches:'شطائر',apples:'تفاح',juice:'عصير',sit:'يجلس',rock:'صخرة',deep:'عميق',crater:'حفرة',alien:'كائن فضائي',hungry:'جائع',share:'شارِك',rocket:'صاروخ',dark:'مظلم',shiny:'لامع',stone:'حجر',glows:'يتوهج',night:'ليل',light:'ضوء / خفيف',
 leave:'اترك',treasures:'كنوز',photo:'صورة',remember:'يتذكر',mars:'المريخ',path:'طريق',paths:'طرق',wind:'ريح',strong:'قوي',dust:'غبار',storm:'عاصفة',hide:'اختبئ',fly:'يطير',jetpack:'حقيبة طيران',cave:'كهف',walls:'جدران',pictures:'رسوم',
 map:'خريطة',water:'ماء',hidden:'مخبأ',proud:'فخور',crystals:'بلورات',museum:'متحف',magic:'سحري',gone:'اختفى',garden:'حديقة',kitchen:'مطبخ',bird:'عصفور',sitting:'جالس',eggs:'بيض',baby:'صغير / رضيع',wait:'انتظر',another:'آخر',cat:'قطة',playing:'يلعب',
 nicely:'بلطف',ask:'اسأل',waits:'ينتظر',crack:'طق!',come:'يأتي',out:'خارج',away:'بعيداً',back:'رجوع',puts:'يضع',too:'جداً / أيضاً',head:'رأس',everybody:'الجميع',drops:'يُسقط',after:'وراء / بعد',makes:'يصنع',everyone:'الجميع',please:'من فضلك',polite:'مؤدب'});
