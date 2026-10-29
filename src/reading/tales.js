/* ===== مجرّة القصص: قصص تختار أنت طريقها =====
   كل صفحة: p صورة، s جمل إنجليزية، a ترجمتها، c خياران [النص، الترجمة، الصفحة التالية]، end نوع النهاية */
const TALES=[
 {t:'The Robot Dog',ar:'الكلب الروبوت',e:'🐕',start:'p1',pages:{
  p1:{p:'🛸🔊',s:['Mia lives on a space station.','One day, she hears a little sound: beep, beep!','Is it under the bed, or behind the door?'],a:['تعيش ميا في محطة فضائية.','في يوم من الأيام، سمعت صوتاً صغيراً: بيب، بيب!','هل هو تحت السرير، أم خلف الباب؟'],
   c:[['Look under the bed.','ابحث تحت السرير.','p2a'],['Look behind the door.','ابحث خلف الباب.','p2b']]},
  p2a:{p:'🛏️🐕',s:['Under the bed, Mia finds a robot dog!','It is small and blue.','Its eyes are sad. It needs help.'],a:['تحت السرير، وجدت ميا كلباً روبوتاً!','إنه صغير وأزرق.','عيناه حزينتان. إنه يحتاج إلى مساعدة.'],
   c:[['Give it a battery.','أعطه بطارية.','e1'],['Give it a cookie.','أعطه بسكويتة.','e2']]},
  p2b:{p:'🚪📦',s:['Behind the door, there is a big box.','Something inside the box says: beep, woof!','The robot dog is stuck!'],a:['خلف الباب، يوجد صندوق كبير.','شيء داخل الصندوق يقول: بيب، هاو!','الكلب الروبوت عالق!'],
   c:[['Open the box.','افتح الصندوق.','e3'],['Call the captain.','نادِ القبطان.','e4']]},
  e1:{p:'🔋🐕💚',end:'good',s:['Mia gives the dog a battery.','Its eyes turn green. Beep! Woof!','The dog jumps and wags its tail.','Now Mia has a new best friend!'],a:['أعطت ميا الكلب بطارية.','صارت عيناه خضراوين. بيب! هاو!','قفز الكلب وهزّ ذيله.','الآن عند ميا صديق جديد!']},
  e2:{p:'🍪🐕😆',end:'funny',s:['Mia gives the dog a cookie.','The dog looks at the cookie. Beep?','Robots do not eat cookies! Mia laughs.','She eats the cookie, and finds a battery for the dog.'],a:['أعطت ميا الكلب بسكويتة.','نظر الكلب إلى البسكويتة. بيب؟','الروبوتات لا تأكل البسكويت! ضحكت ميا.','أكلت البسكويتة، ووجدت بطارية للكلب.']},
  e3:{p:'📦🐕⚡',end:'good',s:['Mia opens the box. The dog is free!','It runs around the room and licks her hand.','"I will call you Bolt," says Mia.'],a:['فتحت ميا الصندوق. صار الكلب حراً!','ركض حول الغرفة ولعق يدها.','قالت ميا: «سأسميك بولت».']},
  e4:{p:'👩‍🚀⭐',end:'good',s:['The captain comes with a big tool.','Clink, clank! The box opens.','"You found our lost robot dog!" she says.','She gives Mia a gold star.'],a:['جاءت القبطانة بأداة كبيرة.','طق، طق! انفتح الصندوق.','قالت: «لقد وجدتِ كلبنا الروبوت الضائع!»','وأعطت ميا نجمة ذهبية.']}}},
 {t:'The Moon Picnic',ar:'نزهة على القمر',e:'🌙',start:'p1',pages:{
  p1:{p:'🚀🌙🧺',s:['Omar and his dad fly to the moon for a picnic.','They have sandwiches, apples, and juice.','Where do they sit?'],a:['طار عمر ووالده إلى القمر في نزهة.','معهم شطائر وتفاح وعصير.','أين يجلسان؟'],
   c:[['Next to a big rock.','بجانب صخرة كبيرة.','p2a'],['In a deep crater.','في حفرة عميقة.','p2b']]},
  p2a:{p:'🪨👽',s:['Next to the rock, they see a little green alien.','The alien looks at their food.','It looks hungry!'],a:['بجانب الصخرة، رأيا كائناً فضائياً أخضر صغيراً.','نظر الكائن إلى طعامهما.','يبدو جائعاً!'],
   c:[['Share the sandwiches.','شاركه الشطائر.','e1'],['Run back to the rocket.','اركض إلى الصاروخ.','e2']]},
  p2b:{p:'🕳️💎',s:['The crater is dark and deep.','Omar sees something shiny.','It is a purple moon stone!'],a:['الحفرة مظلمة وعميقة.','رأى عمر شيئاً لامعاً.','إنه حجر قمر بنفسجي!'],
   c:[['Take the stone home.','خذ الحجر إلى البيت.','e3'],['Leave it on the moon.','اتركه على القمر.','e4']]},
  e1:{p:'🥪👽😊',end:'good',s:['Omar gives the alien a sandwich.','The alien eats it and smiles.','"Thank you!" it says. "You are my first Earth friend!"'],a:['أعطى عمر الكائن شطيرة.','أكلها الكائن وابتسم.','قال: «شكراً! أنت أول صديق لي من الأرض!»']},
  e2:{p:'🏃🎂😆',end:'funny',s:['Omar and Dad run to the rocket.','The alien runs too… with a big cake!','It only wants to share its cake. Oops!'],a:['ركض عمر ووالده إلى الصاروخ.','وركض الكائن أيضاً… ومعه كعكة كبيرة!','كان يريد فقط أن يشاركهما كعكته. أوه!']},
  e3:{p:'💎🏠🌟',end:'good',s:['Omar puts the stone in his bag.','At home, the stone glows at night.','It is the best night light ever!'],a:['وضع عمر الحجر في حقيبته.','في البيت، صار الحجر يتوهّج في الليل.','إنه أجمل مصباح ليلي على الإطلاق!']},
  e4:{p:'📸🌙',end:'good',s:['Omar leaves the stone on the moon.','"The moon needs its treasures," says Dad.','Omar takes a photo to remember it.'],a:['ترك عمر الحجر على القمر.','قال والده: «القمر يحتاج إلى كنوزه».','التقط عمر صورة ليتذكّره.']}}},
 {t:'The Secret Cave',ar:'الكهف السري',e:'🔴',start:'p1',pages:{
  p1:{p:'🔴🤖',s:['Lina is on Mars with her robot, Zed.','They find two paths.','One path is red. One path is dark.'],a:['لينا على المريخ مع روبوتها زِد.','وجدا طريقين.','طريق أحمر، وطريق مظلم.'],
   c:[['Take the red path.','اسلك الطريق الأحمر.','p2a'],['Take the dark path.','اسلك الطريق المظلم.','p2b']]},
  p2a:{p:'🏜️🌪️',s:['On the red path, the wind is very strong.','Oh no! A dust storm is coming!'],a:['في الطريق الأحمر، الريح قوية جداً.','يا إلهي! عاصفة غبار قادمة!'],
   c:[['Hide behind a rock.','اختبئ خلف صخرة.','e1'],['Fly up with a jetpack.','اطِر إلى الأعلى بحقيبة الطيران.','e2']]},
  p2b:{p:'🕳️🔦',s:['The dark path goes into a cave.','Zed turns on his light.','There are pictures on the walls!'],a:['الطريق المظلم يدخل إلى كهف.','شغّل زِد ضوءه.','توجد رسوم على الجدران!'],
   c:[['Read the pictures.','اقرأ الرسوم.','e3'],['Go deeper into the cave.','ادخل أعمق في الكهف.','e4']]},
  e1:{p:'🪨🌅',end:'good',s:['Lina and Zed hide behind a big rock.','The storm goes past them. Phew!','Then they see a blue sunset. Mars has blue sunsets!'],a:['اختبأت لينا وزِد خلف صخرة كبيرة.','مرّت العاصفة بجانبهما. يا للراحة!','ثم رأيا غروباً أزرق. المريخ له غروب أزرق!']},
  e2:{p:'🚀🌀😆',end:'funny',s:['Lina flies up, up, up!','But the wind pushes her around in circles.','She lands on top of Zed. "Ouch!" says Zed.','They laugh and laugh.'],a:['طارت لينا إلى الأعلى، الأعلى، الأعلى!','لكن الريح أدارتها في دوائر.','هبطت فوق زِد. قال زِد: «آخ!»','وضحكا كثيراً.']},
  e3:{p:'🗺️💧',end:'good',s:['The pictures are a map.','The map shows where water is hidden.','Lina found water on Mars! Everybody is proud of her.'],a:['الرسوم خريطة.','الخريطة تبيّن مكان الماء المخبأ.','وجدت لينا ماءً على المريخ! الجميع فخورون بها.']},
  e4:{p:'💎✨',end:'good',s:['Deep in the cave, everything is shiny.','The walls are full of crystals!','Zed takes a picture for the space museum.'],a:['في عمق الكهف، كل شيء لامع.','الجدران مليئة بالبلورات!','التقط زِد صورة لمتحف الفضاء.']}}},
 {t:"Leo's Lost Hat",ar:'قبعة ليو الضائعة',e:'👽',start:'p1',pages:{
  p1:{p:'👽🎩❓',s:['Leo the alien has a magic hat.','Today, the hat is gone!','"Can you help me find it?" asks Leo.'],a:['ليو الفضائي عنده قبعة سحرية.','اليوم، اختفت القبعة!','سأل ليو: «هل تساعدني في إيجادها؟»'],
   c:[['Look in the garden.','ابحث في الحديقة.','p2a'],['Look in the kitchen.','ابحث في المطبخ.','p2b']]},
  p2a:{p:'🌻🐦🎩',s:['In the garden, a bird is sitting on the hat!','There are three little eggs in it.'],a:['في الحديقة، عصفور يجلس على القبعة!','وفيها ثلاث بيضات صغيرة.'],
   c:[['Wait for the eggs.','انتظر البيض.','e1'],['Give Leo another hat.','أعطِ ليو قبعة أخرى.','e2']]},
  p2b:{p:'🍳🐱🎩',s:['In the kitchen, a cat is playing with the hat.','The cat is very happy.'],a:['في المطبخ، قطة تلعب بالقبعة.','القطة سعيدة جداً.'],
   c:[['Give the cat a ball.','أعطِ القطة كرة.','e3'],['Ask the cat nicely.','اطلب من القطة بلطف.','e4']]},
  e1:{p:'🐣🐣🐣',end:'good',s:['Leo waits and waits.','Crack! Three baby birds come out.','The birds fly away, and Leo gets his hat back.'],a:['انتظر ليو وانتظر.','طق! خرجت ثلاثة عصافير صغيرة.','طارت العصافير، واستعاد ليو قبعته.']},
  e2:{p:'🧢👽😆',end:'funny',s:['You give Leo your cap.','He puts it on. It is too small for his big head!','Everybody laughs, and Leo laughs too.'],a:['أعطيت ليو قبعتك الرياضية.','لبسها. إنها صغيرة جداً على رأسه الكبير!','ضحك الجميع، وضحك ليو أيضاً.']},
  e3:{p:'⚽🐱🐟',end:'good',s:['The cat drops the hat and runs after the ball.','Leo puts on his magic hat.','Pop! He makes a fish for the cat. Now everyone is happy.'],a:['أسقطت القطة القبعة وركضت وراء الكرة.','لبس ليو قبعته السحرية.','بوب! صنع سمكة للقطة. الآن الجميع سعداء.']},
  e4:{p:'🐱🙏🎩',end:'good',s:['"Please, can I have my hat?" asks Leo.','The cat looks at him and says… "Meow!"','Then it gives the hat back. What a polite cat!'],a:['سأل ليو: «من فضلك، هل أستطيع أخذ قبعتي؟»','نظرت إليه القطة وقالت… «مياو!»','ثم أعادت القبعة. يا لها من قطة مؤدبة!']}}}
];
