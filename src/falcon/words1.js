/* صقر الكلمات Word Falcon — the words, stage 1 (الأساس).
   One row per word:  english | arabic | picture | example sentence | its arabic | flags
   picture: an emoji (2021 or older), or @name for a drawing in art.js.
   flags: w = the picture alone does not show the word (no picture-only questions for it),
          s = a sacred word (kept out of the action games), p = a class phrase (column 4 empty, column 5 = when to say it).
   An optional column 7 names the wrong answers of the sentence question (words of the same topic), when the usual
   choice by kind of word could give a second word that fits.
   Every english word and sentence is a recorded clip in Ollie's voice (tools/falcon-voices.js).
   TOPICS and T() are in base.js, shared by all six parts. */

T('family', 'العائلة والناس', 'Family & People', '👨‍👩‍👧‍👦', '#f59e0b', 1, `
family | عائلة | 👨‍👩‍👧‍👦 | I love my family very much. | أحب عائلتي كثيرًا.
mother | أم | 👩‍👦 | My mother cooks delicious food. | أمي تطبخ طعامًا لذيذًا. | w
father | أب | 👨‍👦 | My father drives me to school. | أبي يوصلني إلى المدرسة. | w
brother | أخ | 👦 | My brother is ten years old. | أخي عمره عشر سنوات. | w
sister | أخت | 👧 | My sister likes to draw. | أختي تحب الرسم. | w
baby | طفل رضيع | 👶 | The baby is sleeping now. | الطفل الرضيع نائم الآن.
grandmother | جدة | 👵 | My grandmother tells me stories. | جدتي تحكي لي القصص.
grandfather | جد | 👴 | My grandfather has a white beard. | جدي له لحية بيضاء.
parents | الوالدان | 👫 | My parents are at home now. | والداي في البيت الآن. | w
uncle | عم أو خال | 🧔 | My uncle lives in Jeddah. | عمي يعيش في جدة. | w
aunt | عمة أو خالة | 👩 | My aunt makes nice cakes. | عمتي تصنع كعكًا لذيذًا. | w
cousin | ابن العم أو ابن الخال | 🧒 | I play football with my cousin. | ألعب كرة القدم مع ابن عمي. | w
son | ابن | 👦 | Mr. Ali has one son. | السيد علي لديه ابن واحد. | w
daughter | ابنة | 👧 | Their daughter is very clever. | ابنتهم ذكية جدًا. | w
child | طفل | 🧒 | Every child needs love and care. | كل طفل يحتاج إلى الحب والرعاية. | w
children | أطفال | 👧👦 | The children are playing in the park. | الأطفال يلعبون في الحديقة. | w
man | رجل | 👨 | The man is reading a newspaper. | الرجل يقرأ الجريدة.
woman | امرأة | 👩 | The woman is buying bread. | المرأة تشتري الخبز.
boy | ولد | 👦 | The boy is riding his bike. | الولد يركب دراجته.
girl | بنت | 👧 | The girl has a blue backpack. | البنت لديها حقيبة ظهر زرقاء.
friend | صديق | 🧑‍🤝‍🧑 | Omar is my best friend. | عمر هو أفضل صديق لي.
neighbor | جار | 🏠👋 | Our neighbor has a big garden. | جارنا لديه حديقة كبيرة. | w
people | ناس | 👥 | Many people are at the market. | يوجد ناس كثيرون في السوق.
guest | ضيف | ☕ | We give our guest coffee and dates. | نقدم لضيفنا القهوة والتمر. | w
`);

T('body', 'جسمي', 'My Body', '🧍', '#ef4444', 1, `
body | جسم | 🧍 | Exercise is good for your body. | الرياضة مفيدة لجسمك.
head | رأس | @body:head | I wear a cap on my head. | ألبس قبعة على رأسي.
hair | شعر | @body:hair | My sister has long black hair. | أختي لها شعر أسود طويل.
face | وجه | @body:face | I wash my face every morning. | أغسل وجهي كل صباح.
eye | عين | 👁️ | Something is in my eye. | يوجد شيء في عيني.
ear | أذن | 👂 | Put your hand on your ear. | ضع يدك على أذنك.
nose | أنف | 👃 | I smell flowers with my nose. | أشم الزهور بأنفي.
mouth | فم | 👄 | Open your mouth, please. | افتح فمك من فضلك.
tooth | سن | 🦷 | My little brother lost a tooth. | سقطت سن أخي الصغير.
tongue | لسان | 👅 | The cat cleans itself with its tongue. | القطة تنظف نفسها بلسانها.
neck | رقبة | @body:neck | The giraffe has a very long neck. | للزرافة رقبة طويلة جدًا.
shoulder | كتف | @body:shoulder | The parrot sits on my shoulder. | الببغاء يجلس على كتفي.
arm | ذراع | 💪 | Raise your arm, please. | ارفع ذراعك من فضلك.
elbow | كوع | @body:elbow | Don't put your elbow on the table. | لا تضع كوعك على الطاولة.
hand | يد | ✋ | Raise your hand to answer. | ارفع يدك لتجيب.
finger | إصبع | ☝️ | Point with your finger. | أشر بإصبعك.
thumb | إبهام | 👍 | My thumb is short and strong. | إبهامي قصير وقوي.
leg | ساق | 🦵 | Can you stand on one leg? | هل تستطيع الوقوف على ساق واحدة؟
knee | ركبة | @body:knee | I fell and hurt my knee. | وقعت وآذيت ركبتي.
foot | قدم | 🦶 | Put your right foot here. | ضع قدمك اليمنى هنا.
toe | إصبع القدم | @body:toe | I hit my toe on the door. | ضربت إصبع قدمي في الباب.
back | ظهر | @body:back | I carry my backpack on my back. | أحمل حقيبتي على ظهري. | w
stomach | بطن | @body:stomach | My stomach is full after lunch. | بطني ممتلئ بعد الغداء.
heart | قلب | ❤️ | My heart beats fast when I run. | قلبي يدق بسرعة عندما أركض.
`);

T('clothes', 'الملابس', 'Clothes', '👕', '#8b5cf6', 1, `
clothes | ملابس | 👕👖 | My clothes are clean and tidy. | ملابسي نظيفة ومرتبة. | w
shirt | قميص | 👔 | My father wears a white shirt. | أبي يلبس قميصًا أبيض.
T-shirt | تي شيرت | 👕 | I wear a T-shirt when it is hot. | ألبس تي شيرت عندما يكون الجو حارًا.
pants | بنطال | 👖 | These pants are too long for me. | هذا البنطال طويل جدًا عليّ.
shorts | شورت | 🩳 | I wear shorts to play football. | ألبس الشورت لألعب كرة القدم.
dress | فستان | 👗 | My sister has a new pink dress. | أختي لديها فستان وردي جديد.
jacket | سترة | 🧥 | Take your jacket. It's cold outside. | خذ سترتك، الجو بارد في الخارج.
sweater | كنزة صوف | 🧶 | Grandma made me a warm sweater. | جدتي صنعت لي كنزة دافئة. | w
scarf | وشاح | 🧣 | I wear a scarf in winter. | ألبس وشاحًا في الشتاء.
hat | قبعة | 👒 | The farmer wears a big hat. | المزارع يلبس قبعة كبيرة.
cap | كاب (قبعة رياضية) | 🧢 | I wear my cap in the sun. | ألبس الكاب تحت الشمس.
shoes | حذاء | 👞 | Take off your shoes at the door. | اخلع حذاءك عند الباب.
sneakers | حذاء رياضي | 👟 | I run fast in my new sneakers. | أركض بسرعة بحذائي الرياضي الجديد.
boots | جزمة | 🥾 | He wears boots in the rain. | يلبس الجزمة في المطر.
socks | جوارب | 🧦 | My socks are under the bed. | جواربي تحت السرير.
gloves | قفازات | 🧤 | I wear gloves when it is very cold. | ألبس القفازات عندما يكون الجو باردًا جدًا.
glasses | نظارة | 👓 | My grandfather reads with his glasses. | جدي يقرأ بنظارته.
sunglasses | نظارة شمسية | 🕶️ | I wear sunglasses at the beach. | ألبس النظارة الشمسية على الشاطئ.
pajamas | ملابس النوم | 🛌 | I put on my pajamas before bed. | ألبس ملابس النوم قبل أن أنام. | w
uniform | زي مدرسي موحد | 🎽 | We wear a uniform at school. | نلبس زيًا موحدًا في المدرسة. | w
watch | ساعة يد | ⌚ | I got a new watch for Eid. | حصلت على ساعة جديدة في العيد.
wear | يلبس | 👕 | I like to wear blue. | أحب أن ألبس اللون الأزرق. | w
put on | يرتدي | 🧦 | Put on your shoes, please. | البس حذاءك من فضلك. | w
take off | يخلع | 🧢 | Take off your cap in the classroom. | اخلع قبعتك في الفصل. | w
`);

T('food', 'الطعام', 'Food', '🍽️', '#f97316', 1, `
food | طعام | 🍱 | Food gives us energy. | الطعام يعطينا الطاقة.
breakfast | فطور | 🥞 | I eat eggs for breakfast. | آكل البيض في الفطور.
lunch | غداء | 🍛 | We have lunch at two o'clock. | نتناول الغداء الساعة الثانية.
dinner | عشاء | 🍽️ | Dinner is ready! | العشاء جاهز!
bread | خبز | 🍞 | My mother buys fresh bread. | أمي تشتري خبزًا طازجًا.
rice | أرز | 🍚 | We eat rice with chicken. | نأكل الأرز مع الدجاج.
egg | بيضة | 🥚 | I can cook an egg. | أستطيع أن أطبخ بيضة.
cheese | جبن | 🧀 | I like cheese in my sandwich. | أحب الجبن في شطيرتي.
honey | عسل | 🍯 | Honey is sweet and healthy. | العسل حلو ومفيد للصحة.
meat | لحم | 🥩 | My father cooks meat on the fire. | أبي يطبخ اللحم على النار.
soup | شوربة | 🍲 | This soup is very hot. | هذه الشوربة ساخنة جدًا.
salad | سلطة | 🥗 | I eat salad every day. | آكل السلطة كل يوم.
sandwich | شطيرة | 🥪 | I take a sandwich to school. | آخذ شطيرة إلى المدرسة.
burger | برجر | 🍔 | Can I have a chicken burger, please? | هل يمكنني أن آخذ برجر دجاج من فضلك؟
pizza | بيتزا | 🍕 | We eat pizza on Thursday night. | نأكل البيتزا ليلة الخميس.
pasta | معكرونة | 🍝 | My sister loves pasta with cheese. | أختي تحب المعكرونة بالجبن.
falafel | فلافل | 🧆 | I like falafel sandwiches. | أحب شطائر الفلافل.
cake | كعكة | 🍰 | We eat cake on Eid. | نأكل الكعك في العيد.
cookie | بسكويت | 🍪 | Can I have one more cookie? | هل يمكنني أن آخذ قطعة بسكويت أخرى؟
chocolate | شوكولاتة | 🍫 | Don't eat too much chocolate. | لا تأكل الكثير من الشوكولاتة.
ice cream | آيس كريم | 🍦 | I like strawberry ice cream. | أحب آيس كريم الفراولة.
sugar | سكر | @sugar | I don't put sugar in my milk. | لا أضع السكر في حليبي.
salt | ملح | 🧂 | Can you pass the salt, please? | هل تناولني الملح من فضلك؟
delicious | لذيذ | 😋 | Mom's food is delicious! | طعام أمي لذيذ!
`);

T('fruit', 'الفواكه والخضار', 'Fruit & Vegetables', '🍎', '#22c55e', 1, `
fruit | فاكهة | 🍎🍌 | Fruit is good for you. | الفاكهة مفيدة لك. | w
vegetables | خضروات | 🥕🥦 | Eat your vegetables, please. | كل خضرواتك من فضلك. | w
apple | تفاحة | 🍎 | I have a red apple in my bag. | لدي تفاحة حمراء في حقيبتي.
banana | موزة | 🍌 | I eat a banana after school. | آكل موزة بعد المدرسة.
orange | برتقال | 🍊 | I drink orange juice every morning. | أشرب عصير البرتقال كل صباح.
grapes | عنب | 🍇 | These green grapes are very sweet. | هذا العنب الأخضر حلو جدًا.
watermelon | بطيخ | 🍉 | We eat cold watermelon in summer. | نأكل البطيخ البارد في الصيف.
lemon | ليمون | 🍋 | I squeeze a lemon on my fish. | أعصر ليمونة على سمكتي.
mango | مانجو | 🥭 | Mango is my favorite fruit. | المانجو فاكهتي المفضلة.
strawberry | فراولة | 🍓 | I like strawberry milk. | أحب حليب الفراولة.
pineapple | أناناس | 🍍 | A pineapple is big and sweet. | الأناناس كبير وحلو.
pear | كمثرى | 🍐 | This pear is soft and juicy. | هذه الكمثرى طرية ومليئة بالعصير.
dates | تمر | @dates | We eat dates with milk. | نأكل التمر مع الحليب.
coconut | جوز الهند | 🥥 | Coconut water is very nice. | ماء جوز الهند لذيذ جدًا.
tomato | طماطم | 🍅 | I put tomato in my salad. | أضع الطماطم في سلطتي.
potato | بطاطس | 🥔 | My mother cooks potato soup. | أمي تطبخ شوربة البطاطس.
carrot | جزر | 🥕 | The rabbit is eating a carrot. | الأرنب يأكل جزرة.
onion | بصل | 🧅 | Cutting an onion makes me cry. | تقطيع البصل يجعلني أبكي.
cucumber | خيار | 🥒 | A cucumber is long and green. | الخيار طويل وأخضر.
corn | ذرة | 🌽 | We eat hot corn at the beach. | نأكل الذرة الساخنة على الشاطئ.
lettuce | خس | 🥬 | The turtle eats lettuce. | السلحفاة تأكل الخس.
pepper | فلفل | 🌶️ | This red pepper is very hot! | هذا الفلفل الأحمر حار جدًا!
broccoli | بروكلي | 🥦 | Broccoli looks like a little tree. | البروكلي يشبه شجرة صغيرة.
olive | زيتون | 🫒 | We put olive oil on our salad. | نضع زيت الزيتون على سلطتنا.
`);

T('animals', 'حيوانات المزرعة والبيت', 'Farm Animals & Pets', '🐄', '#a16207', 1, `
animal | حيوان | 🐾 | The cow is a big animal. | البقرة حيوان كبير. | w
cat | قطة | 🐱 | Our cat likes to drink milk. | قطتنا تحب شرب الحليب.
dog | كلب | 🐶 | The farmer's dog runs very fast. | كلب المزارع يركض بسرعة كبيرة.
rabbit | أرنب | 🐰 | The rabbit has long ears. | للأرنب أذنان طويلتان.
mouse | فأر | 🐭 | The mouse is hiding from the cat. | الفأر يختبئ من القطة.
bird | طائر | 🐦 | A little bird is sitting in the tree. | طائر صغير يجلس على الشجرة.
parrot | ببغاء | 🦜 | My parrot can say "hello". | ببغائي يستطيع أن يقول "مرحبًا".
horse | حصان | 🐴 | My uncle has a beautiful white horse. | عمي لديه حصان أبيض جميل.
cow | بقرة | 🐄 | We get milk from the cow. | نحصل على الحليب من البقرة.
sheep | خروف | 🐑 | The sheep has soft white wool. | للخروف صوف أبيض ناعم.
goat | ماعز | 🐐 | The goat is climbing the rock. | الماعز يتسلق الصخرة.
camel | جمل | 🐪 | A camel can walk in the desert for days. | الجمل يستطيع المشي في الصحراء لأيام.
chicken | دجاجة | 🐔 | The chicken lays an egg every day. | الدجاجة تضع بيضة كل يوم.
rooster | ديك | 🐓 | The rooster wakes us up early. | الديك يوقظنا مبكرًا.
duck | بطة | 🦆 | The duck is swimming in the pond. | البطة تسبح في البركة.
pigeon | حمامة | 🕊️ | A pigeon is eating on the roof. | حمامة تأكل فوق السطح.
pet | حيوان أليف | 🐹 | A fish is an easy pet. | السمكة حيوان أليف سهل.
farm | مزرعة | 🌾 | The farm is far from the city. | المزرعة بعيدة عن المدينة.
farmer | مزارع | 👨‍🌾 | The farmer gets up very early. | المزارع يستيقظ مبكرًا جدًا.
feather | ريشة | 🪶 | The bird has a blue feather. | للطائر ريشة زرقاء.
feed | يطعم | 🥣 | I feed my cat every morning. | أطعم قطتي كل صباح. | w
`);

T('house', 'بيتي', 'My House', '🏠', '#0ea5e9', 1, `
house | منزل | 🏠 | We live in a big house. | نعيش في منزل كبير.
home | البيت | 🏡 | I go home after school. | أذهب إلى البيت بعد المدرسة.
room | غرفة | 🖼️ | My room is small but nice. | غرفتي صغيرة لكنها جميلة. | w
bedroom | غرفة النوم | 🛏️ | My brother and I share a bedroom. | أنا وأخي نتشارك غرفة النوم. | w
bathroom | دورة المياه | 🛁 | Wash your hands in the bathroom. | اغسل يديك في دورة المياه.
kitchen | مطبخ | 🍳 | My mother is cooking in the kitchen. | أمي تطبخ في المطبخ. | w
living room | غرفة الجلوس | 🛋️ | We sit together in the living room. | نجلس معًا في غرفة الجلوس. | w
garden | حديقة المنزل | 🌷 | My grandfather works in the garden. | جدي يعمل في الحديقة.
door | باب | 🚪 | Please close the door. | أغلق الباب من فضلك.
window | نافذة | 🪟 | Open the window, please. | افتح النافذة من فضلك.
wall | جدار | 🧱 | There is a picture on the wall. | توجد صورة على الجدار.
floor | أرضية | @house:floor | Don't put your bag on the floor. | لا تضع حقيبتك على الأرض.
roof | سطح | @house:roof | The cat is on the roof. | القطة على السطح.
stairs | درج | @house:stairs | Walk up the stairs slowly. | اصعد الدرج ببطء.
lamp | مصباح | 💡 | There is a lamp next to my bed. | يوجد مصباح بجانب سريري.
bed | سرير | 🛏️ | I make my bed every morning. | أرتب سريري كل صباح.
sofa | أريكة | 🛋️ | Grandpa sits on the sofa. | جدي يجلس على الأريكة.
chair | كرسي | 🪑 | This chair is too small for me. | هذا الكرسي صغير جدًا عليّ.
table | طاولة | @table | We eat dinner at the table. | نتناول العشاء على الطاولة.
carpet | سجادة | @carpet | We sit on the carpet. | نجلس على السجادة.
mirror | مرآة | 🪞 | I look in the mirror. | أنظر في المرآة.
closet | خزانة ملابس | @closet | Hang your jacket in the closet. | علق سترتك في الخزانة.
clock | ساعة حائط | 🕰️ | Look at the clock. It's time to go! | انظر إلى الساعة، حان وقت الذهاب!
key | مفتاح | 🔑 | I can't find my key. | لا أستطيع أن أجد مفتاحي.
`);

T('school', 'مدرستي', 'At School', '🏫', '#2563eb', 1, `
school | مدرسة | 🏫 | I go to school five days a week. | أذهب إلى المدرسة خمسة أيام في الأسبوع.
classroom | الفصل | 🏫 | Our classroom is big and bright. | فصلنا كبير ومضيء. | w
teacher | معلم | 👨‍🏫 | Our teacher is kind and funny. | معلمنا لطيف ومرح.
student | طالب | 👨‍🎓 | I am a good student. | أنا طالب مجتهد.
desk | مكتب الطالب | @desk | My books are on my desk. | كتبي على مكتبي.
board | سبورة | @board | The teacher writes on the board. | المعلم يكتب على السبورة.
book | كتاب | 📕 | Open your book to page ten. | افتح كتابك على الصفحة عشرة.
notebook | دفتر | 📓 | I write my homework in my notebook. | أكتب واجبي في دفتري.
pen | قلم حبر | 🖊️ | Can I borrow your pen? | هل يمكنني أن أستعير قلمك؟
pencil | قلم رصاص | ✏️ | I draw with a pencil. | أرسم بقلم الرصاص.
eraser | ممحاة | @eraser | I use an eraser to fix mistakes. | أستخدم الممحاة لتصحيح الأخطاء.
ruler | مسطرة | 📏 | Draw a line with your ruler. | ارسم خطًا بمسطرتك.
crayon | قلم تلوين | 🖍️ | I color the sun with a yellow crayon. | ألون الشمس بقلم تلوين أصفر.
scissors | مقص | ✂️ | Be careful with the scissors. | انتبه من المقص.
glue | صمغ | @glue | I stick the picture with glue. | ألصق الصورة بالصمغ.
backpack | حقيبة ظهر | 🎒 | My backpack is very heavy today. | حقيبتي ثقيلة جدًا اليوم.
homework | واجب منزلي | 📝 | I do my homework after lunch. | أحل واجبي بعد الغداء.
lesson | درس | 📖 | Today's lesson is about animals. | درس اليوم عن الحيوانات.
test | اختبار | 💯 | I studied hard for the test. | ذاكرت جيدًا للاختبار.
question | سؤال | ❓ | Can I ask a question? | هل يمكنني أن أسأل سؤالًا؟
answer | إجابة | ✔️ | Write your answer here. | اكتب إجابتك هنا. | w
library | مكتبة | 📚 | I borrow books from the library. | أستعير الكتب من المكتبة.
page | صفحة | 📃 | Look at the picture on page five. | انظر إلى الصورة في الصفحة خمسة. | w
word | كلمة | 🔤 | Spell this word, please. | تهجَّ هذه الكلمة من فضلك.
`);

T('colors', 'الألوان والأشكال والأعداد', 'Colors, Shapes & Numbers', '🎨', '#ec4899', 1, `
color | لون | 🎨 | Blue is my favorite color. | الأزرق هو لوني المفضل.
pink | وردي | @color:pink | My sister's room is pink. | غرفة أختي وردية.
purple | بنفسجي | @color:purple | Grapes can be green or purple. | العنب قد يكون أخضر أو بنفسجيًا.
brown | بني | @color:brown | My shoes are brown. | حذائي بني.
gray | رمادي | @color:gray | The elephant is big and gray. | الفيل كبير ورمادي.
gold | ذهبي | @color:gold | The winner gets a gold medal. | الفائز يحصل على ميدالية ذهبية.
silver | فضي | @color:silver | My father has a silver car. | أبي لديه سيارة فضية.
dark | مظلم | 🌑 | The room is dark. Turn on the lamp. | الغرفة مظلمة، أشعل المصباح. | w
circle | دائرة | @shape:circle | Draw a circle on the board. | ارسم دائرة على السبورة.
square | مربع | @shape:square | A square has four equal sides. | للمربع أربعة أضلاع متساوية.
triangle | مثلث | @shape:triangle | A triangle has three sides. | للمثلث ثلاثة أضلاع.
rectangle | مستطيل | @shape:rectangle | The door is a rectangle. | الباب على شكل مستطيل.
star | نجمة | ⭐ | I got a gold star for my work. | حصلت على نجمة ذهبية على عملي.
line | خط | @shape:line | Draw a straight line. | ارسم خطًا مستقيمًا.
number | رقم | 🔢 | Write the number on the page. | اكتب الرقم على الصفحة.
twenty | عشرون | @num:20 | There are twenty boys in my class. | يوجد عشرون ولدًا في فصلي.
fifty | خمسون | @num:50 | My father is fifty years old. | أبي عمره خمسون عامًا.
hundred | مئة | @num:100 | This book has a hundred pages. | هذا الكتاب فيه مئة صفحة.
thousand | ألف | @num:1000 | A thousand people are at the stadium. | ألف شخص في الملعب.
first | الأول | 🥇 | I am first in the race! | أنا الأول في السباق!
second | الثاني | 🥈 | My brother is second in his class. | أخي الثاني على فصله.
third | الثالث | 🥉 | Sara is third in line. | سارة الثالثة في الصف.
last | الأخير | 🔚 | This is the last question. | هذا هو السؤال الأخير. | w
half | نصف | @half | I eat half of the pizza. | آكل نصف البيتزا.
`);

T('verbs', 'أفعال الحركة', 'Action Words', '🏃', '#14b8a6', 1, `
run | يركض | 🏃 | I can run very fast. | أستطيع أن أركض بسرعة كبيرة.
walk | يمشي | 🚶 | We walk to the mosque together. | نمشي إلى المسجد معًا.
jump | يقفز | 🦘 | Frogs can jump very high. | الضفادع تستطيع القفز عاليًا جدًا. | w
swim | يسبح | 🏊 | I swim in the sea in summer. | أسبح في البحر في الصيف.
climb | يتسلق | 🧗 | Monkeys climb trees. | القرود تتسلق الأشجار.
fly | يطير | 🦅 | Falcons can fly very high. | الصقور تستطيع الطيران عاليًا جدًا. | w
throw | يرمي | 🤾 | Throw the ball to me! | ارم الكرة إليّ!
catch | يلتقط | 🧤 | I catch the ball with two hands. | ألتقط الكرة بيدين. | w
kick | يركل | ⚽ | Kick the ball into the goal! | اركل الكرة في المرمى! | w
push | يدفع | 🛒 | Push the door to open it. | ادفع الباب لتفتحه. | w
pull | يسحب | 🪢 | Pull the rope hard! | اسحب الحبل بقوة! | w
carry | يحمل | 📦 | Can you help me carry this box? | هل تساعدني في حمل هذا الصندوق؟
sit | يجلس | 🪑 | Please sit next to me. | من فضلك اجلس بجانبي. | w
stand | يقف | 🧍 | Stand up, please. | قف من فضلك. | w
stop | يتوقف | 🛑 | Stop! The light is red. | توقف! الإشارة حمراء.
open | يفتح | 🔓 | Open your eyes. | افتح عينيك. | w
close | يغلق | 🔒 | Close your book, please. | أغلق كتابك من فضلك. | w
give | يعطي | 🎁 | Give me the ball, please. | أعطني الكرة من فضلك. | w
take | يأخذ | ✋ | Take one cookie, please. | خذ قطعة بسكويت واحدة من فضلك. | w
find | يجد | 🔍 | Help me find my pencil. | ساعدني في إيجاد قلمي.
look | ينظر | 👀 | Look at the camel! | انظر إلى الجمل!
listen | يستمع | 👂 | Listen to your teacher. | استمع إلى معلمك. | w
help | يساعد | 🤝 | I help my mother in the kitchen. | أساعد أمي في المطبخ. | w
wait | ينتظر | ⏳ | Wait for me, please! | انتظرني من فضلك!
`);
