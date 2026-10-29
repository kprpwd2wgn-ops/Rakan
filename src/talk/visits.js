/* ===== زيارات الفضائي زِب =====
   q / qa: السؤال بالإنجليزية والعربية · cat: مجموعات الكلمات المقبولة · re: كلمات أخرى مقبولة
   tpl: جملة كاملة تُبنى من كلمة الطفل ({x} {X} {a} {xs}) · ex / exa: مثال يظهر عند طلب المساعدة
   react: ردود على أجوبة معيّنة · after: رد على أي جواب جيد · min: كلمات الجملة الكاملة (٣ افتراضياً)
   fx: ماذا يحدث لزِب: color لونه، sky السماء، grass الأرض، show يُظهر الشيء، eat يأكله، wear يلبسه،
       mood وجهه، num رقم ببالونات، weather الطقس، globe الكرة الأرضية، name لافتة باسمك، hearts قلوب،
       fly يطير، count عدة نسخ، size يكبر/يصغر، party حفلة، night ليل، jump يقفز، coin هدية */
const VISITS=[
 {en:'Hello, Zib!',ar:'مرحباً يا زِب',sign:'👋',steps:[
  {q:"Hello, Earth kid! I'm Zib from planet Zoom. What's your name?",qa:'مرحباً يا طفل الأرض! أنا زِب من كوكب زووم. ما اسمك؟',re:'my name is|my name|i am|name|call me|{name}',ex:'My name is {name}.',exa:'اسمي {name}.',fx:'name',after:['What a nice name!','يا له من اسم جميل!']},
  {q:'How are you today?',qa:'كيف حالك اليوم؟',cat:'feel',tpl:'I am {x}, thank you.',ex:"I'm fine, thank you.",exa:'أنا بخير، شكراً.',fx:'mood',
   react:[['tired|sleepy','Oh! Take a little rest.','أوه! خذ قسطاً من الراحة.'],['sad|angry|bored|sick','Oh no! Here is a space hug!','يا للأسف! خذ عناقاً فضائياً!'],['happy|great|excited|amazing|awesome|super','Yay! I am happy too!','يا سلام! وأنا سعيد أيضاً!']]},
  {q:'How old are you?',qa:'كم عمرك؟',cat:'num',re:'years|old',tpl:'I am {x} years old.',ex:"I'm nine years old.",exa:'عمري تسع سنوات.',fx:'num',after:['Wow! On my planet I am three hundred!','واو! على كوكبي عمري ثلاثمئة سنة!']},
  {q:'Where are you from?',qa:'من أين أنت؟',cat:'country',re:'from',tpl:'I am from {X}.',ex:"I'm from Saudi Arabia.",exa:'أنا من السعودية.',fx:'globe',after:['I can see it from my spaceship!','أستطيع رؤيتها من سفينتي الفضائية!']},
  {q:'I must go back to my spaceship. Goodbye!',qa:'يجب أن أعود إلى سفينتي. مع السلامة!',re:'bye|goodbye|see you|later|take care',ex:'Goodbye, Zib! See you later.',exa:'مع السلامة يا زِب! أراك لاحقاً.',min:2,fx:'jump'}
 ]},
 {en:'Colors',ar:'زِب يتلوّن',sign:'🎨',steps:[
  {q:"On planet Zoom everything is gray. What's your favorite color?",qa:'على كوكب زووم كل شيء رمادي. ما لونك المفضّل؟',cat:'colors',tpl:'My favorite color is {x}.',ex:'My favorite color is blue.',exa:'لوني المفضّل الأزرق.',fx:'color',after:['Look at me! I am {x} now!','انظر إليّ! صار لوني {xa}!']},
  {q:'What color is the sky?',qa:'ما لون السماء؟',cat:'colors',tpl:'The sky is {x}.',ex:'The sky is blue.',exa:'السماء زرقاء.',fx:'sky',react:[['blue','Yes! The sky is blue.','صحيح! السماء زرقاء.']],after:['Ha ha! A {x} sky? Funny!','ها ها! سماء بهذا اللون؟ مضحك!']},
  {q:'What color is a banana?',qa:'ما لون الموزة؟',cat:'colors',tpl:'A banana is {x}.',ex:'A banana is yellow.',exa:'الموزة صفراء.',fx:'show:banana',react:[['yellow','Right! Yellow like the sun.','صحيح! صفراء مثل الشمس.']]},
  {q:'What color is the grass?',qa:'ما لون العشب؟',cat:'colors',tpl:'The grass is {x}.',ex:'The grass is green.',exa:'العشب أخضر.',fx:'grass',react:[['green','Yes! Green grass. So pretty!','صحيح! عشب أخضر. جميل جداً!']]},
  {q:'My planet looks so pretty now. Thank you!',qa:'كوكبي صار جميلاً جداً. شكراً لك!',re:'welcome|you are welcome|no problem|thank|bye|cool|great|pleasure',ex:"You're welcome!",exa:'على الرحب والسعة!',min:2,fx:'party'}
 ]},
 {en:'Animals',ar:'حيوانات الأرض',sign:'🦁',steps:[
  {q:"Earth has animals! What's your favorite animal?",qa:'في الأرض حيوانات! ما حيوانك المفضّل؟',cat:'animals',tpl:'My favorite animal is the {x}.',ex:'My favorite animal is the lion.',exa:'حيواني المفضّل الأسد.',fx:'show',after:['Wow! I love {xs}!','واو! أحب هذا الحيوان!']},
  {q:'Can you make its sound?',qa:'هل تستطيع تقليد صوته؟',re:'roar|meow|moo|woof|baa|quack|oink|hiss|tweet|neigh|bark|grr+|ribbit|hoo|cluck|squeak|ooh|ha|yes',ex:"Roar! I'm a lion!",exa:'زئير! أنا أسد!',min:1,fx:'jump',after:['Ha ha! So funny!','ها ها! مضحك جداً!']},
  {q:'Which animal is very big?',qa:'أي حيوان كبير جداً؟',cat:'animals',tpl:'The {x} is very big.',ex:'The elephant is very big.',exa:'الفيل كبير جداً.',fx:'size',react:[['elephant|whale|giraffe|hippo|dinosaur','Yes! It is huge!','صحيح! إنه ضخم!']]},
  {q:'Which animal can fly?',qa:'أي حيوان يستطيع الطيران؟',cat:'animals',re:'fly',tpl:'The {x} can fly.',ex:'A bird can fly.',exa:'العصفور يطير.',fx:'fly',react:[['bird|eagle|falcon|parrot|owl|bee|butterfly|bat|duck|dragon','Yes! Look, it is flying!','صحيح! انظر، إنه يطير!']]},
  {q:'Do you have a pet?',qa:'هل عندك حيوان أليف؟',cat:'animals',re:'yes|no|have|i do|do not',ex:'Yes, I have a cat.',exa:'نعم، عندي قطة.',fx:'show',react:[['no|do not|not','Maybe one day!','ربما في يوم من الأيام!']]},
  {q:'I love Earth animals! Bye bye!',qa:'أحب حيوانات الأرض! باي باي!',re:'bye|goodbye|see you',ex:'Bye bye, Zib!',exa:'باي باي يا زِب!',min:2}
 ]},
 {en:'Hungry Zib',ar:'زِب جائع',sign:'🍕',steps:[
  {q:'My tummy is empty! What should I eat?',qa:'بطني فارغ! ماذا آكل؟',cat:'foods',tpl:'You should eat {a} {x}.',ex:'You should eat pizza.',exa:'كُل بيتزا.',fx:'eat',after:['Yum yum! Delicious!','ممم! لذيذ!']},
  {q:'What do you like to drink?',qa:'ماذا تحب أن تشرب؟',cat:'drinks',tpl:'I like {x}.',ex:'I like orange juice.',exa:'أحب عصير البرتقال.',fx:'eat',after:['Glug glug! Thank you!','غلُب غلُب! شكراً!']},
  {q:'What fruit do you like?',qa:'أي فاكهة تحب؟',cat:'foods',re:'fruit',tpl:'I like {xs}.',ex:'I like apples.',exa:'أحب التفاح.',fx:'eat'},
  {q:'What do you eat for breakfast?',qa:'ماذا تأكل في الفطور؟',cat:'foods,drinks',tpl:'I eat {x} for breakfast.',ex:'I eat eggs and bread.',exa:'آكل البيض والخبز.',fx:'eat'},
  {q:'Is chocolate sweet or salty?',qa:'هل الشوكولاتة حلوة أم مالحة؟',re:'sweet|salty|both',ex:'Chocolate is sweet.',exa:'الشوكولاتة حلوة.',fx:'show:chocolate',react:[['sweet','Yes! Sweet and yummy!','صحيح! حلوة ولذيذة!'],['salty','Hmm, I think it is sweet!','همم، أظنها حلوة!']]},
  {q:'I am full now. Thank you for the food!',qa:'شبعت الآن. شكراً على الطعام!',re:'welcome|you are welcome|no problem|enjoy|bye|thank|pleasure',ex:"You're welcome!",exa:'على الرحب والسعة!',min:2,fx:'jump'}
 ]},
 {en:'My Family',ar:'عائلتي',sign:'🏠',steps:[
  {q:'Do you have brothers or sisters?',qa:'هل عندك إخوة أو أخوات؟',cat:'family',re:'yes|no|have|only child|i do|do not',ex:'Yes, I have one brother.',exa:'نعم، عندي أخ واحد.',fx:'show',react:[['no|only child|do not','That is okay! You have friends.','لا بأس! عندك أصدقاء.']]},
  {q:'Who do you play with at home?',qa:'مع من تلعب في البيت؟',cat:'family',re:'alone|myself|nobody|no one',tpl:'I play with my {x}.',ex:'I play with my brother.',exa:'ألعب مع أخي.',fx:'show'},
  {q:'What does your mom like to do?',qa:'ماذا تحب أمك أن تفعل؟',cat:'activity',re:'she likes|she loves|likes|loves',ex:'She likes cooking.',exa:'تحب الطبخ.',fx:'show'},
  {q:'And your dad? What does he like?',qa:'ووالدك؟ ماذا يحب؟',cat:'activity,games',re:'he likes|he loves|likes|loves',ex:'He likes football.',exa:'يحب كرة القدم.',fx:'show',react:[['coffee','Ha ha! My dad loves space coffee too!','ها ها! أبي يحب القهوة الفضائية أيضاً!']]},
  {q:'Do you love your family?',qa:'هل تحب عائلتك؟',re:'yes|love|of course|very much|sure',ex:'Yes! I love my family very much.',exa:'نعم! أحب عائلتي كثيراً.',fx:'hearts',after:["That's so sweet!",'هذا لطيف جداً!']},
  {q:'I have a big family on my planet too. Bye!',qa:'عندي عائلة كبيرة على كوكبي أيضاً. باي!',re:'bye|goodbye|see you|later',ex:'Bye, Zib! See you later.',exa:'باي يا زِب! أراك لاحقاً.',min:2}
 ]},
 {en:'Weather',ar:'الطقس',sign:'🌦️',steps:[
  {q:'Is it hot or cold on Earth today?',qa:'هل الجو حار أم بارد على الأرض اليوم؟',cat:'weather',tpl:'It is {x} today.',ex:"It's hot today.",exa:'الجو حار اليوم.',fx:'weather'},
  {q:"What's the weather like today?",qa:'كيف الطقس اليوم؟',cat:'weather',tpl:'It is {x} today.',ex:"It's sunny.",exa:'الجو مشمس.',fx:'weather'},
  {q:"Brrr! It's cold in my spaceship. What should I wear?",qa:'برررر! الجو بارد في سفينتي. ماذا ألبس؟',cat:'clothes',re:'wear',tpl:'You should wear {a} {x}.',ex:'You should wear a jacket.',exa:'البس سترة.',fx:'wear',after:['Thank you! Now I look cool!','شكراً! الآن أبدو رائعاً!']},
  {q:"What's your favorite season?",qa:'ما فصلك المفضّل؟',cat:'seasons',tpl:'My favorite season is {x}.',ex:'I like winter.',exa:'أحب الشتاء.',fx:'weather'},
  {q:'Do you like rain?',qa:'هل تحب المطر؟',re:'yes|no|like|love|not|puddle',ex:'Yes, I like rain!',exa:'نعم، أحب المطر!',fx:'weather:rainy'},
  {q:"Now I'm ready for Earth weather. Bye!",qa:'الآن أنا جاهز لطقس الأرض. باي!',re:'bye|goodbye|see you|later|good luck',ex:'Bye, Zib!',exa:'باي يا زِب!',min:2}
 ]},
 {en:'Hobbies',ar:'الهوايات',sign:'⚽',steps:[
  {q:'What do you like to do after school?',qa:'ماذا تحب أن تفعل بعد المدرسة؟',cat:'activity,games',re:'like to|i like',ex:'I like to play football.',exa:'أحب لعب كرة القدم.',fx:'show'},
  {q:'Can you swim?',qa:'هل تستطيع السباحة؟',re:'yes|no|can|swim|not',ex:'Yes, I can swim.',exa:'نعم، أستطيع السباحة.',fx:'show:swimming',react:[['not|no','You can learn! It is fun.','يمكنك أن تتعلم! إنها ممتعة.']]},
  {q:'Can you ride a bike?',qa:'هل تستطيع ركوب الدراجة؟',re:'yes|no|can|ride|learn|not',ex:'Yes, I can!',exa:'نعم، أستطيع!',fx:'show:bike'},
  {q:"What's your favorite sport?",qa:'ما رياضتك المفضّلة؟',cat:'games',tpl:'My favorite sport is {x}.',ex:'My favorite sport is football.',exa:'رياضتي المفضّلة كرة القدم.',fx:'show'},
  {q:'Can you teach me? I want to try!',qa:'هل تعلّمني؟ أريد أن أجرّب!',re:'yes|sure|ok|okay|come|let us|of course|watch|follow',ex:"Sure! Let's play together.",exa:'بالتأكيد! لنلعب معاً.',min:2,fx:'jump',after:['Whoa! I fell down! Ha ha!','أوه! وقعت! ها ها!']},
  {q:'That was fun! See you soon.',qa:'كان ذلك ممتعاً! أراك قريباً.',re:'see you|bye|ok|okay|soon|later',ex:'See you, Zib!',exa:'أراك يا زِب!',min:2}
 ]},
 {en:'Feelings',ar:'المشاعر',sign:'💛',steps:[
  {q:'I want to learn about feelings. How do you feel now?',qa:'أريد أن أتعلّم عن المشاعر. بماذا تشعر الآن؟',cat:'feel',re:'feel',tpl:'I feel {x}.',ex:'I feel happy.',exa:'أشعر بالسعادة.',fx:'mood'},
  {q:'What makes you happy?',qa:'ما الذي يسعدك؟',cat:'foods,games,family,toys,animals,activity',re:'makes me happy|happy|holiday|holidays|friends|school|presents|gifts|trips|park|beach',ex:'Playing with my friends makes me happy.',exa:'اللعب مع أصدقائي يسعدني.',fx:'show'},
  {q:'What do you do when you are sad?',qa:'ماذا تفعل عندما تكون حزيناً؟',cat:'family,activity',re:'talk|hug|cry|sleep|pray|eat|sit|think|rest|tell',ex:'I talk to my mom.',exa:'أتحدث مع أمي.',fx:'hearts'},
  {q:'Are you scared of the dark?',qa:'هل تخاف من الظلام؟',re:'yes|no|little|brave|not|scared|afraid|sometimes',ex:"No, I'm brave!",exa:'لا، أنا شجاع!',min:2,fx:'night',
   react:[['not scared|not afraid|no|brave','Wow! You are a hero.','واو! أنت بطل.'],['yes|little|scared|afraid|sometimes',"That's okay. Everybody is scared sometimes.",'لا بأس. كل الناس يخافون أحياناً.']]},
  {q:'Now I know feelings! I feel... happy!',qa:'الآن عرفت المشاعر! أشعر… بالسعادة!',re:'welcome|you are welcome|bye|you too|good|great|thank|me too|yay',ex:'Me too, Zib!',exa:'وأنا أيضاً يا زِب!',min:2,fx:'party'}
 ]},
 {en:'School',ar:'المدرسة',sign:'📚',steps:[
  {q:"Earth kids go to school! What's your favorite subject?",qa:'أطفال الأرض يذهبون إلى المدرسة! ما مادتك المفضّلة؟',cat:'subjects',tpl:'My favorite subject is {X}.',ex:'My favorite subject is math.',exa:'مادتي المفضّلة الرياضيات.',fx:'show'},
  {q:'Can you count to five in English?',qa:'هل تستطيع العد إلى خمسة بالإنجليزية؟',re:'one two three|two three four|three four five',ex:'One, two, three, four, five!',exa:'واحد، اثنان، ثلاثة، أربعة، خمسة!',min:5,fx:'count:star',after:['Excellent!','ممتاز!']},
  {q:'What is in your school bag?',qa:'ماذا يوجد في حقيبتك المدرسية؟',cat:'school',ex:'I have books and pencils.',exa:'عندي كتب وأقلام.',fx:'show'},
  {q:'What do you say when you need help?',qa:'ماذا تقول عندما تحتاج إلى مساعدة؟',re:'help|excuse me|question|please',ex:'Can you help me, please?',exa:'هل يمكنك مساعدتي من فضلك؟'},
  {q:'School is cool! See you tomorrow!',qa:'المدرسة رائعة! أراك غداً!',re:'see you|tomorrow|bye|goodbye|thank',ex:'See you tomorrow, Zib!',exa:'أراك غداً يا زِب!',min:2}
 ]},
 {en:'My Day',ar:'يومي',sign:'⏰',steps:[
  {q:'What time do you wake up?',qa:'متى تستيقظ؟',cat:'num',re:'wake|clock|morning|early',tpl:"I wake up at {x} o'clock.",ex:"I wake up at six o'clock.",exa:'أستيقظ الساعة السادسة.',fx:'show:⏰'},
  {q:'What do you do in the morning?',qa:'ماذا تفعل في الصباح؟',re:'brush|wash|eat|breakfast|pray|dress|shower|school|teeth|face|wake|drink',ex:'I brush my teeth.',exa:'أفرّش أسناني.',fx:'show:🪥'},
  {q:'What do you do in the evening?',qa:'ماذا تفعل في المساء؟',cat:'activity',re:'homework|watch|play|read|family|dinner|eat|sleep|games|pray|bath',ex:'I do my homework.',exa:'أحلّ واجباتي.',fx:'show'},
  {q:'What time do you go to bed?',qa:'متى تذهب إلى النوم؟',cat:'num',re:'bed|sleep|clock|night',tpl:"I go to bed at {x} o'clock.",ex:"I go to bed at nine o'clock.",exa:'أنام الساعة التاسعة.',fx:'night'},
  {q:'Good night, Earth kid!',qa:'تصبح على خير يا طفل الأرض!',re:'good night|night|bye|sleep well|sweet dreams',ex:'Good night, Zib!',exa:'تصبح على خير يا زِب!',min:2,fx:'night'}
 ]},
 {en:'Toy Shop',ar:'لعبة لزِب',sign:'🧸',steps:[
  {q:'I want an Earth toy! What toy do you like?',qa:'أريد لعبة من الأرض! أي لعبة تحب؟',cat:'toys',tpl:'I like {a} {x}.',ex:'I like a robot.',exa:'أحب الروبوت.',fx:'show'},
  {q:'What color is it?',qa:'ما لونها؟',cat:'colors',tpl:'It is {x}.',ex:'It is red.',exa:'إنها حمراء.',fx:'tint'},
  {q:'Is it big or small?',qa:'هل هي كبيرة أم صغيرة؟',cat:'sizes',tpl:'It is {x}.',ex:'It is big.',exa:'إنها كبيرة.',fx:'size'},
  {q:'How many do you want?',qa:'كم واحدة تريد؟',cat:'num',tpl:'I want {x}.',ex:'I want two.',exa:'أريد اثنتين.',fx:'count'},
  {q:'Thank you! Here is a space gem for you!',qa:'شكراً! هذه جوهرة فضائية لك!',re:'thank|thanks|welcome|wow|cool|great|yay',ex:'Thank you, Zib!',exa:'شكراً يا زِب!',min:2,fx:'coin'}
 ]},
 {en:'Space Party',ar:'حفلة زِب',sign:'🎂',steps:[
  {q:'Today is my birthday on planet Zoom! What do you say?',qa:'اليوم عيد ميلادي على كوكب زووم! ماذا تقول؟',re:'happy birthday|birthday|happy|congratulations',ex:'Happy birthday, Zib!',exa:'عيد ميلاد سعيد يا زِب!',min:2,fx:'party'},
  {q:'Would you like some cake?',qa:'هل تريد بعض الكعك؟',re:'yes|please|no|thank|sure|love',ex:'Yes, please!',exa:'نعم، من فضلك!',min:2,fx:'show:cake'},
  {q:'Chocolate or strawberry?',qa:'شوكولاتة أم فراولة؟',cat:'flavors',tpl:'{X}, please.',ex:'Chocolate, please.',exa:'شوكولاتة من فضلك.',min:2,fx:'eat'},
  {q:"Let's play a game! What game do you want to play?",qa:'لنلعب لعبة! أي لعبة تريد أن تلعب؟',cat:'games',re:'hide|seek|tag|both',ex:"Let's play hide and seek!",exa:'لنلعب الغميضة!',fx:'show'},
  {q:'How old do you think I am?',qa:'كم تظن عمري؟',cat:'num',re:'hundred|thousand|old|million',ex:'You are three hundred years old!',exa:'عمرك ثلاثمئة سنة!',fx:'num'},
  {q:'Best party ever! Thank you, my Earth friend!',qa:'أجمل حفلة! شكراً يا صديقي من الأرض!',re:'thank|welcome|fun|great|pleasure|bye|friend|you too',ex:'Thank you, Zib! It was fun.',exa:'شكراً يا زِب! كانت ممتعة.',min:2,fx:'party'}
 ]}
];
