/* صقر الكلمات — his plan from the level test (level-test.html) of 26 Nov 2026, read by Claude.
   Results: listening 88%, reading 100%, words 86%, grammar 69%, spelling 25%. Speaking is not counted: his mother rated it,
   then said she could not judge it, so the test's speaking part now listens through the microphone and Claude rates it.
   Level A2, with listening and reading already at the start of B1. So new lessons start with the level-4 words (stage 2),
   every other lesson comes from «كلمات كبيرة» (B1 words, the kind he could not read in the test), the spelling workshop
   trains writing, and the rule of the day works on the five slips of the grammar part.
   The plan is applied once in each browser (ST.plan); after that the parents can change it in their corner. */
const PLAN = {
  id: 'lt-2026-11-26', day: '٢٦ نوفمبر ٢٠٢٦', start: 2, big: true,
  spell: ['fish', 'elephant', 'butterfly'],   // the words he spelled wrong in the test come first in the workshop
  level: 'ما قبل المتوسط (A2)، وفي الاستماع والقراءة وصل إلى بداية المتوسط (B1)',
  skills: [['الاستماع', 88], ['القراءة', 100], ['الكلمات', 86], ['القواعد', 69], ['الكتابة', 25]],
  speak: 'الكلام: لم يُقَس بعد. سيجيب بصوته في الميكروفون في «جزء الكلام فقط» من اختبار المستوى، ثم يقيّمه Claude.',
  strong: ['يفهم ما يسمعه جيدًا، حتى جمل المستوى B1', 'يقرأ القصص القصيرة ويفهمها كلها'],
  needs: ['كتابة الكلمات بحروفها (الإملاء)', 'الكلمات التي لا تظهر في صورة، مثل: journey، decide، environment',
    'خمس قواعد أخطأ فيها: he plays، on / in / at، because / so، since / for، better / the best', 'الكلام، وهو أصعب شيء عليه كما قال والداه: الإجابة بجملتين أو ثلاث بدل جملة واحدة'],
  teacher: 'Level check (26 Nov 2026): his listening and reading are strong (A2, reaching B1). Please help him with spelling, ' +
    'he/she + verb-s (he plays), on/in/at with time, because and so, since and for, good/better/the best, ' +
    'and answering with two or three sentences.',
};

/* The rule of the day. A rule is said in parts: a = one of Hamed's lines (AR), e = an English line in Ollie's voice with
   hl the words to light up, x = a wrong sentence, shown crossed out and never said. Then 8 sentences to complete.
   Every e line and every finished sentence is a recorded clip (tools/falcon-voices.js). None of them is a sentence of the
   level test, so the next test still shows what he learned. */
const RULES = [
  { id: 's', ar: 'الفعل مع هو وهي', en: 'He plays.', icon: '🏃', parts: [
      { a: 'r-s-1' }, { e: 'I like apples.', hl: ['like'] },
      { a: 'r-s-2' }, { e: 'My sister likes apples.', hl: ['like+s'] },
      { a: 'r-s-3' }, { x: 'My sister is like apples.' }],
    qs: [
      ['My sister ___ to school by bus.', 'goes', ['go', 'is go']],
      ['He ___ his teeth every morning.', 'brushes', ['brush', 'is brush']],
      ['Our cat ___ milk every day.', 'drinks', ['drink', 'is drink']],
      ['My father ___ the car on Friday.', 'washes', ['wash', 'is wash']],
      ['Sara ___ English very well.', 'speaks', ['speak', 'is speak']],
      ['The baby ___ a lot.', 'sleeps', ['sleep', 'is sleep']],
      ['I ___ football after school.', 'play', ['plays', 'is play']],
      ['We ___ in a big house.', 'live', ['lives', 'is live']],
    ] },
  { id: 'time', ar: 'on و in و at مع الوقت', en: 'on Monday · in summer · at six', icon: '⏰', parts: [
      { a: 'r-time-1' }, { e: 'I have English on Monday.', hl: ['on'] },
      { a: 'r-time-2' }, { e: 'In winter, we wear warm clothes.', hl: ['In'] },
      { a: 'r-time-3' }, { e: "I wake up at six o'clock.", hl: ['at'] },
      { a: 'r-time-4' }, { e: 'I sleep at night.', hl: ['at'] },
      { a: 'r-wrong' }, { x: 'I have English in Monday.' }],
    qs: [
      ['My cousin visits us ___ Wednesday.', 'on', ['in', 'at']],
      ['The sun is very hot ___ summer.', 'in', ['on', 'at']],
      ["School starts ___ seven o'clock.", 'at', ['on', 'in']],
      ['___ Friday, we pray at the mosque.', 'On', ['In', 'At']],
      ['I drink milk ___ the morning.', 'in', ['on', 'at']],
      ["I go to bed ___ nine o'clock.", 'at', ['in', 'on']],
      ['We fast ___ Ramadan.', 'in', ['on', 'at']],
      ['The owl hunts ___ night.', 'at', ['in', 'on']],
    ] },
  { id: 'because', ar: 'because و so', en: 'because · so', icon: '🔗', parts: [
      { e: 'because', hl: ['because'] }, { a: 'r-bc-1' }, { e: 'I went to bed early because I was tired.', hl: ['because'] },
      { e: 'so', hl: ['so'] }, { a: 'r-bc-2' }, { e: 'I was tired, so I went to bed early.', hl: ['so'] }],
    qs: [
      ['I am happy ___ it is Eid today.', 'because', ['so', 'but']],
      ['I was hungry, ___ I ate a sandwich.', 'so', ['because', 'but']],
      ['He is tired ___ he played a lot.', 'because', ['so', 'or']],
      ['It was raining, ___ we stayed at home.', 'so', ['because', 'but']],
      ['I drink water ___ I am thirsty.', 'because', ['so', 'but']],
      ['The bag was heavy, ___ my father helped me.', 'so', ['because', 'or']],
      ['We wear warm clothes ___ it is cold.', 'because', ['so', 'but']],
      ['I studied hard, ___ I passed the test.', 'so', ['because', 'but']],
    ] },
  { id: 'since', ar: 'since و for', en: 'since 2022 · for three years', icon: '⏳', parts: [
      { e: 'since', hl: ['since'] }, { a: 'r-sf-1' }, { e: 'I have studied English since 2022.', hl: ['since'] },
      { e: 'for', hl: ['for'] }, { a: 'r-sf-2' }, { e: 'I have studied English for three years.', hl: ['for'] },
      { a: 'r-wrong' }, { x: 'I have studied English from 2022.' }],
    qs: [
      ['I have known Ali ___ 2019.', 'since', ['for', 'from']],
      ['We have lived in this house ___ six years.', 'for', ['since', 'from']],
      ['She has been here ___ Monday.', 'since', ['for', 'from']],
      ['I have waited ___ an hour.', 'for', ['since', 'from']],
      ['My uncle has worked there ___ 2015.', 'since', ['for', 'from']],
      ['We have had our cat ___ two years.', 'for', ['since', 'from']],
      ['He has played football ___ he was six.', 'since', ['for', 'from']],
      ['They have been friends ___ a long time.', 'for', ['since', 'from']],
    ] },
  { id: 'best', ar: 'better و the best', en: 'good · better · the best', icon: '🏆', parts: [
      { e: 'good, better, the best.', hl: ['good', 'better', 'best'] }, { a: 'r-bb-1' }, { e: 'My mother makes the best bread.', hl: ['best'] },
      { e: 'big, bigger, the biggest.', hl: ['big', 'bigg+er', 'bigg+est'] }, { a: 'r-bb-2' }, { e: 'The whale is the biggest animal in the sea.', hl: ['bigg+est'] },
      { a: 'r-wrong' }, { x: 'the most good' }, { x: 'more big' }],
    qs: [
      ['My drawing is ___ than yours.', 'better', ['best', 'more good']],
      ['Omar is the ___ player in our class.', 'best', ['better', 'most good']],
      ['The elephant is the ___ animal in the zoo.', 'biggest', ['bigger', 'most big']],
      ['A camel is ___ than a goat.', 'bigger', ['biggest', 'more big']],
      ['The falcon is the ___ bird.', 'fastest', ['faster', 'most fast']],
      ['Today is ___ than yesterday.', 'hotter', ['hottest', 'more hot']],
      ['This is the ___ day of my life!', 'best', ['better', 'most good']],
      ['Your bag is ___ than mine.', 'heavier', ['heaviest', 'more heavy']],
    ] },
];
RULES.forEach(r => { r.qs = r.qs.map(([text, ans, wrong]) => ({ text, ans, wrong, full: text.replace('___', ans) })); });
if (typeof module !== 'undefined') module.exports = { PLAN, RULES };
