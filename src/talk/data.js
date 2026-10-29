/* ===== مدينة الكلام: البيانات ===== */
const APP={id:'talk',land:'talk',title:'مدينة الكلام',home:'hub',gh:'https://kprpwd2wgn-ops.github.io/Rakan/talk-town.html'};
const TKEY='talk-town-v2';
const T=loadJSON(TKEY,()=>({maze:{},paint:{},alien:{},words:{},spoken:0,typed:0,full:0,drew:{},intro:false}));
function tsave(){saveJSON(TKEY,T);}
/* كل كلمة إنجليزية يقولها الطفل وتفهمها اللعبة تُحفظ في «كلماتي» */
function learnWords(list){let fresh=0;list.forEach(w=>{if(!w)return;if(!T.words[w]){T.words[w]=0;fresh++;}T.words[w]++;});tsave();return fresh;}

/* ---------- مجموعات الكلمات (للفضائي زِب) ---------- */
const CATS={
 colors:'red|blue|green|yellow|orange|purple|pink|black|white|brown|gray|grey|gold|silver',
 animals:'cat|dog|lion|tiger|elephant|monkey|giraffe|horse|cow|rabbit|bunny|fish|bird|bear|camel|panda|zebra|fox|snake|shark|dolphin|penguin|duck|chicken|sheep|goat|owl|turtle|frog|wolf|deer|kangaroo|koala|parrot|hippo|crocodile|cheetah|leopard|eagle|falcon|whale|octopus|butterfly|bee|puppy|kitten|gorilla|squirrel|mouse|hamster|bat|ant|spider|dinosaur|unicorn|dragon',
 foods:'pizza|burger|hamburger|sandwich|pasta|spaghetti|rice|chicken|fish|meat|cake|cookie|pancake|egg|bread|cheese|salad|soup|french fries|fries|apple|banana|ice cream|kabsa|dates|chocolate|noodles|cereal|olives|fruit|vegetables|hot dog|shawarma|falafel|hummus|steak|potato|carrot|grapes|watermelon|strawberry|orange|mango|yogurt|honey|sweets|candy|donut|waffle|popcorn|nuggets|beans|biryani|toast|croissant|muffin|cupcake|sushi|tacos|kebab|lasagna|cheeseburger|mandi|pear|peach|cherry|lemon|pineapple|kiwi|tomato|cucumber|corn',
 drinks:'water|orange juice|apple juice|mango juice|juice|milk|tea|coffee|lemonade|hot chocolate|chocolate milk|laban|smoothie|milkshake',
 games:'football|soccer|basketball|volleyball|tennis|video games|computer games|games|chess|hide and seek|tag|swimming|running|cycling|puzzles|cards|board games|racing|karate|baseball|bowling|ping pong|drawing|reading',
 activity:'cooking|cook|reading|read|drawing|draw|painting|paint|shopping|walking|walk|swimming|swim|baking|bake|gardening|coffee|tea|sleeping|sleep|working|work|writing|playing|play|watching tv|watch tv|tv|movies|cars|football|news|phone|computer|running|helping|travel|traveling|fishing|camping|riding|ride|games|video games|homework|cartoons|jumping|singing|dancing',
 country:'saudi arabia|saudi|kuwait|egypt|uae|emirates|united arab emirates|qatar|bahrain|oman|jordan|morocco|iraq|syria|lebanon|palestine|yemen|sudan|tunisia|algeria|libya|america|usa|united states|england|britain|uk|france|turkey|india|pakistan|indonesia|malaysia|canada|germany|spain|italy|china|japan|korea|somalia|mauritania|australia|brazil|earth',
 num:'one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|hundred|thousand|million',
 family:'brother|sister|cousin|mom|mother|mum|mommy|dad|father|daddy|grandma|grandmother|grandpa|grandfather|baby|friend|uncle|aunt|family|twin|brothers|sisters',
 feel:'happy|sad|tired|sleepy|excited|good|fine|great|okay|ok|bored|angry|hungry|scared|well|amazing|awesome|super|very good|not bad|sick|cold|hot',
 subjects:'math|maths|mathematics|science|art|english|arabic|reading|history|geography|pe|sports|computer|quran|islamic|writing|spelling|drawing|french',
 weather:'sunny|rainy|cold|hot|windy|cloudy|snowy|warm|cool|nice|foggy|stormy|dusty|raining|snowing|sun|rain|wind|clouds',
 seasons:'winter|summer|spring|autumn|fall',
 clothes:'hat|cap|jacket|coat|raincoat|sunglasses|glasses|boots|umbrella|scarf|gloves|shorts|t shirt|shirt|sweater|hoodie|jeans|dress|shoes|socks|thobe|crown|helmet',
 toys:'ball|teddy bear|teddy|puzzle|car|doll|robot|kite|train|blocks|plane|truck|bike|bicycle|scooter|dinosaur|yo yo|toy|airplane|drone|skateboard|book|balloon|rocket|lego',
 sizes:'big|small|large|little|medium|huge|tiny|giant',
 flavors:'chocolate|strawberry|vanilla|both|lemon|banana|caramel|mango',
 school:'book|books|pencil|pencils|pen|pens|eraser|ruler|notebook|crayons|lunch|water|bottle|sandwich|colors|scissors|glue|bag|apple'
};
const NOART='sunglasses|glasses|boots|gloves|shorts|jeans|shoes|socks|pancakes|fries|french fries|cookies|grapes|noodles|olives|dates|vegetables|rice|pasta|spaghetti|water|juice|orange juice|apple juice|mango juice|milk|tea|coffee|bread|cheese|soup|chocolate|meat|honey|yogurt|popcorn|candy|sweets|cereal|lemonade|hot chocolate|chocolate milk|laban|toast|hummus|falafel|blocks|fruit|ice cream|kabsa|chicken|fish|salad|biryani|sushi|tacos|nuggets|beans|mandi|pizza|lego|corn|books|pencils|crayons|colors|scissors|glue';
const PROPER={usa:'the USA',uk:'the UK',uae:'the UAE',emirates:'the Emirates','united states':'the United States','united arab emirates':'the United Arab Emirates',saudi:'Saudi Arabia'};
const COLAR={red:'أحمر',blue:'أزرق',green:'أخضر',yellow:'أصفر',orange:'برتقالي',purple:'بنفسجي',pink:'وردي',black:'أسود',white:'أبيض',brown:'بني',gray:'رمادي',grey:'رمادي',gold:'ذهبي',silver:'فضي'};
const COLHEX={red:'#ef4444',blue:'#3b82f6',green:'#22c55e',yellow:'#facc15',orange:'#fb923c',purple:'#a855f7',pink:'#f472b6',black:'#1f2937',white:'#f8fafc',brown:'#92400e',gray:'#9ca3af',grey:'#9ca3af',gold:'#f5b82e',silver:'#cbd5e1'};
/* صور صغيرة لما يقوله الطفل */
const EMO={cat:'🐱',dog:'🐶',lion:'🦁',tiger:'🐯',elephant:'🐘',monkey:'🐵',giraffe:'🦒',horse:'🐴',cow:'🐮',rabbit:'🐰',bunny:'🐰',fish:'🐟',bird:'🐦',bear:'🐻',camel:'🐪',panda:'🐼',zebra:'🦓',fox:'🦊',snake:'🐍',shark:'🦈',dolphin:'🐬',penguin:'🐧',duck:'🦆',chicken:'🐔',sheep:'🐑',goat:'🐐',owl:'🦉',turtle:'🐢',frog:'🐸',wolf:'🐺',deer:'🦌',kangaroo:'🦘',koala:'🐨',parrot:'🦜',hippo:'🦛',crocodile:'🐊',cheetah:'🐆',leopard:'🐆',eagle:'🦅',falcon:'🦅',whale:'🐋',octopus:'🐙',butterfly:'🦋',bee:'🐝',puppy:'🐶',kitten:'🐱',gorilla:'🦍',squirrel:'🐿️',mouse:'🐭',hamster:'🐹',bat:'🦇',ant:'🐜',spider:'🕷️',dinosaur:'🦖',unicorn:'🦄',dragon:'🐉',
 pizza:'🍕',burger:'🍔',hamburger:'🍔',cheeseburger:'🍔',sandwich:'🥪',pasta:'🍝',spaghetti:'🍝',lasagna:'🍝',rice:'🍚',meat:'🍖',steak:'🥩',cake:'🍰',cookie:'🍪',pancake:'🥞',egg:'🥚',bread:'🍞',toast:'🍞',cheese:'🧀',salad:'🥗',soup:'🍲',fries:'🍟','french fries':'🍟',apple:'🍎',banana:'🍌','ice cream':'🍦',kabsa:'🍛',mandi:'🍛',biryani:'🍛',dates:'🌴',chocolate:'🍫',noodles:'🍜',cereal:'🥣',olives:'🫒',fruit:'🍇',vegetables:'🥦','hot dog':'🌭',shawarma:'🌯',falafel:'🧆',hummus:'🥙',potato:'🥔',carrot:'🥕',grapes:'🍇',watermelon:'🍉',strawberry:'🍓',orange:'🍊',mango:'🥭',yogurt:'🥛',honey:'🍯',sweets:'🍬',candy:'🍬',donut:'🍩',waffle:'🧇',popcorn:'🍿',nuggets:'🍗',beans:'🫘',croissant:'🥐',muffin:'🧁',cupcake:'🧁',sushi:'🍣',tacos:'🌮',kebab:'🍢',pear:'🍐',peach:'🍑',cherry:'🍒',lemon:'🍋',pineapple:'🍍',kiwi:'🥝',tomato:'🍅',cucumber:'🥒',corn:'🌽',
 water:'💧',juice:'🧃','orange juice':'🧃','apple juice':'🧃','mango juice':'🧃',milk:'🥛',tea:'🍵',coffee:'☕',lemonade:'🍋','hot chocolate':'☕','chocolate milk':'🥛',laban:'🥛',smoothie:'🥤',milkshake:'🥤',
 football:'⚽',soccer:'⚽',basketball:'🏀',volleyball:'🏐',tennis:'🎾','video games':'🎮','computer games':'🎮',games:'🎮',chess:'♟️','hide and seek':'🙈',tag:'🏃',swimming:'🏊',swim:'🏊',running:'🏃',cycling:'🚴',puzzles:'🧩',cards:'🃏','board games':'🎲',racing:'🏎️',karate:'🥋',baseball:'⚾',bowling:'🎳','ping pong':'🏓',
 cooking:'🍳',cook:'🍳',reading:'📖',read:'📖',drawing:'🖍️',draw:'🖍️',painting:'🎨',paint:'🎨',shopping:'🛍️',walking:'🚶',walk:'🚶',baking:'🧁',bake:'🧁',gardening:'🌱',sleeping:'😴',sleep:'😴',working:'💼',work:'💼',writing:'✏️',playing:'🎲',play:'🎲','watching tv':'📺','watch tv':'📺',tv:'📺',movies:'🎬',cars:'🚗',news:'📰',phone:'📱',computer:'💻',helping:'🤝',travel:'✈️',traveling:'✈️',fishing:'🎣',camping:'⛺',riding:'🚲',ride:'🚲',homework:'📚',cartoons:'📺',jumping:'🤸',
 brother:'👦',brothers:'👦',sister:'👧',sisters:'👧',cousin:'🧒',mom:'👩',mother:'👩',mum:'👩',mommy:'👩',dad:'👨',father:'👨',daddy:'👨',grandma:'👵',grandmother:'👵',grandpa:'👴',grandfather:'👴',baby:'👶',friend:'🧒',uncle:'👨',aunt:'👩',family:'👨‍👩‍👧‍👦',twin:'👯',
 math:'➗',maths:'➗',mathematics:'➗',science:'🔬',art:'🎨',english:'🔤',arabic:'📖',history:'🏛️',geography:'🗺️',pe:'🏃',sports:'⚽',quran:'📖',islamic:'🕌',spelling:'🔤',french:'🥖',
 hat:'👒',cap:'🧢',jacket:'🧥',coat:'🧥',raincoat:'🧥',sunglasses:'🕶️',glasses:'👓',boots:'👢',umbrella:'☂️',scarf:'🧣',gloves:'🧤',shorts:'🩳','t shirt':'👕',shirt:'👕',sweater:'🧶',hoodie:'🧥',jeans:'👖',dress:'👗',shoes:'👟',socks:'🧦',thobe:'👘',crown:'👑',helmet:'⛑️',
 ball:'⚽','teddy bear':'🧸',teddy:'🧸',puzzle:'🧩',car:'🚗',doll:'🪆',robot:'🤖',kite:'🪁',train:'🚂',blocks:'🧱',plane:'✈️',airplane:'✈️',truck:'🚚',bike:'🚲',bicycle:'🚲',scooter:'🛴','yo yo':'🪀',toy:'🧸',drone:'🚁',skateboard:'🛹',book:'📘',books:'📚',balloon:'🎈',rocket:'🚀',lego:'🧱',
 pencil:'✏️',pencils:'✏️',pen:'🖊️',pens:'🖊️',eraser:'🧽',ruler:'📏',notebook:'📓',crayons:'🖍️',lunch:'🍱',bottle:'🧴',colors:'🖍️',scissors:'✂️',glue:'🧴',bag:'🎒',
 winter:'❄️',summer:'☀️',spring:'🌸',autumn:'🍂',fall:'🍂',sunny:'☀️',rainy:'🌧️',raining:'🌧️',rain:'🌧️',cold:'❄️',hot:'🔥',windy:'💨',wind:'💨',cloudy:'☁️',clouds:'☁️',snowy:'🌨️',snowing:'🌨️',warm:'🌤️',cool:'🌥️',nice:'🌈',foggy:'🌫️',stormy:'⛈️',dusty:'🌪️',sun:'☀️',
 vanilla:'🍨',caramel:'🍮',earth:'🌍'};

/* ---------- الرسّام: ما يستطيع رسمه ---------- */
const PNOUNS={sun:{z:'sky',c:'yellow'},moon:{z:'sky',c:'white'},star:{z:'sky',c:'yellow'},cloud:{z:'sky',c:'white'},bird:{z:'sky',c:'blue'},balloon:{z:'sky',c:'red'},kite:{z:'sky',c:'orange'},
  butterfly:{z:'mid',c:'purple'},rainbow:{z:'sky',c:null},heart:{z:'mid',c:'red'},
  tree:{z:'ground',c:'green'},flower:{z:'ground',c:'pink'},house:{z:'ground',c:'red'},car:{z:'ground',c:'blue'},ball:{z:'ground',c:'red'},cat:{z:'ground',c:'orange'},dog:{z:'ground',c:'brown'},apple:{z:'ground',c:'red'},
  fish:{z:'water',c:'orange'},boat:{z:'water',c:'white'}};
const PPLUR={suns:'sun',moons:'moon',stars:'star',clouds:'cloud',birds:'bird',balloons:'balloon',kites:'kite',butterflies:'butterfly',rainbows:'rainbow',hearts:'heart',trees:'tree',flowers:'flower',houses:'house',cars:'car',balls:'ball',cats:'cat',dogs:'dog',apples:'apple',fishes:'fish',boats:'boat',
  /* أخطاء السمع الشائعة */
  son:'sun',bowl:'ball',kat:'cat',hearth:'heart',flour:'flower',bot:'boat',dug:'dog'};
const PCOL={red:'red',read:'red',blue:'blue',blew:'blue',green:'green',yellow:'yellow',orange:'orange',purple:'purple',pink:'pink',black:'black',white:'white',brown:'brown',gray:'gray',grey:'gray',gold:'gold',golden:'gold',silver:'silver'};
const PSIZE={big:'big',large:'big',huge:'big',giant:'big',small:'small',little:'small',tiny:'small'};
const PNUM={a:1,an:1,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,some:3,many:5,lots:6};
const NOUNAR={sun:'شمس',moon:'قمر',star:'نجمة',cloud:'غيمة',bird:'عصفور',balloon:'بالون',kite:'طائرة ورقية',butterfly:'فراشة',rainbow:'قوس قزح',heart:'قلب',tree:'شجرة',flower:'وردة',house:'بيت',car:'سيارة',ball:'كرة',cat:'قطة',dog:'كلب',apple:'تفاحة',fish:'سمكة',boat:'قارب'};
/* تحديات «انسخ اللوحة» */
const PTARGETS=[
 [{n:'ball',c:'red',k:1}],
 [{n:'sun',c:'yellow',k:1}],
 [{n:'tree',c:'green',k:1,z:'big'}],
 [{n:'fish',c:'blue',k:2}],
 [{n:'apple',c:'red',k:3}],
 [{n:'cloud',c:'white',k:1,z:'small'},{n:'sun',c:'yellow',k:1}],
 [{n:'flower',c:'pink',k:2},{n:'cat',c:'black',k:1}],
 [{n:'house',c:'red',k:1},{n:'tree',c:'green',k:2}],
 [{n:'star',c:'yellow',k:3},{n:'moon',c:'white',k:1}],
 [{n:'bird',c:'blue',k:3,z:'small'},{n:'sun',c:'orange',k:1,z:'big'}],
 [{n:'car',c:'red',k:1},{n:'ball',c:'blue',k:1},{n:'tree',c:'green',k:2}],
 [{n:'rainbow',c:null,k:1},{n:'balloon',c:'pink',k:4},{n:'cat',c:'black',k:1,z:'small'}]
];
