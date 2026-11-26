/* اختبار المستوى — the level test: seven parts, each running from band 1 (Pre-A1, Cambridge Starters) to band 4 (B1 start),
   then a few questions for the parents. Every English line it says is a clip in Ollie's Azure voice (ollie/voices);
   Hamed's Arabic lines are LT_AR. tools/level-test-voices.js checks the clips and packs them into level-test/voices. */
const LT_BANDS = ['', 'Pre-A1', 'A1', 'A2', 'B1'];
const LT_SECTIONS = [
  { id: 's1', ar: 'كلمات أسمعها', en: 'Listening: words', icon: '👂', line: 's1', kind: 'listenPic', stop: 1, items: [
    [1, 'cat', '🐱', ['🐶', '🐭', '🐰']], [1, 'apple', '🍎', ['🍌', '🍇', '🍊']], [1, 'pencil', '✏️', ['📏', '📕', '✂️']], [1, 'car', '🚗', ['🚌', '🚲', '✈️']],
    [2, 'umbrella', '☂️', ['🧣', '🧤', '👒']], [2, 'dolphin', '🐬', ['🦈', '🐋', '🐙']], [2, 'ambulance', '🚑', ['🚒', '🚓', '🚕']], [2, 'rainbow', '🌈', ['☁️', '⛈️', '❄️']],
    [3, 'scientist', '👨‍🔬', ['👨‍🚀', '👨‍🍳', '👨‍🔧']], [3, 'battery', '🔋', ['🔌', '💡', '📱']], [3, 'island', '🏝️', ['⛰️', '🏜️', '🌊']], [3, 'wheelchair', '🦽', ['🛴', '🚲', '🛹']],
    [4, 'telescope', '🔭', ['🔬', '📷', '🧭']], [4, 'volcano', '🌋', ['⛰️', '🏝️', '🏜️']], [4, 'magnet', '🧲', ['🔋', '🔌', '🔧']], [4, 'satellite', '🛰️', ['🚀', '✈️', '🚁']],
  ].map(([b, say, ans, opts]) => ({ b, say, ans, opts })) },
  { id: 's2', ar: 'كلمات أقرؤها', en: 'Reading: words', icon: '📖', line: 's2', kind: 'readMeaning', stop: 0, items: [
    [1, 'book', 'كتاب', ['قلم', 'باب', 'كرسي']], [1, 'water', 'ماء', ['حليب', 'خبز', 'شمس']], [1, 'big', 'كبير', ['صغير', 'طويل', 'سريع']],
    [2, 'tired', 'متعب', ['جائع', 'سعيد', 'غاضب']], [2, 'always', 'دائمًا', ['أبدًا', 'أحيانًا', 'غدًا']], [2, 'between', 'بين', ['خلف', 'تحت', 'أمام']],
    [3, 'expensive', 'غالٍ', ['رخيص', 'جديد', 'جميل']], [3, 'dangerous', 'خطير', ['آمن', 'سهل', 'هادئ']], [3, 'remember', 'يتذكر', ['ينسى', 'يفكر', 'يعرف']],
    [4, 'journey', 'رحلة', ['مدينة', 'طريق', 'جسر']], [4, 'environment', 'البيئة', ['الحكومة', 'التعليم', 'الصحة']], [4, 'decide', 'يقرر', ['يتردد', 'يسأل', 'يجيب']],
  ].map(([b, word, ans, opts]) => ({ b, word, ans, opts })) },
  { id: 's3', ar: 'قواعد الجملة', en: 'Grammar', icon: '🧩', line: 's3', kind: 'grammar', stop: 1, items: [
    [1, 'I ___ a student.', 'am', ['is', 'are', 'be']], [1, 'She ___ a red bag.', 'has', ['have', 'is', 'do']],
    [1, 'There ___ two cats in the garden.', 'are', ['is', 'am', 'be']], [1, 'I can ___ very fast.', 'run', ['runs', 'running', 'ran']],
    [2, 'My brother ___ football every day.', 'plays', ['play', 'playing', 'is play']], [2, 'Look! The baby ___ now.', 'is sleeping', ['sleeps', 'sleep', 'are sleeping']],
    [2, 'Yesterday, I ___ to the park.', 'went', ['go', 'goes', 'going']], [2, 'We go to school ___ Sunday.', 'on', ['in', 'at', 'to']],
    [3, 'An elephant is ___ than a horse.', 'bigger', ['big', 'biggest', 'more big']], [3, '___ you finish your homework yesterday?', 'Did', ['Do', 'Are', 'Was']],
    [3, "I'm going ___ visit my grandmother tomorrow.", 'to', ['for', 'at', 'will']], [3, "She didn't come to school ___ she was sick.", 'because', ['but', 'so', 'and']],
    [4, 'I have lived here ___ 2020.', 'since', ['for', 'from', 'at']], [4, 'If it rains tomorrow, we ___ stay at home.', 'will', ['would', 'are', 'did']],
    [4, 'This is the ___ book I have ever read.', 'best', ['better', 'good', 'most good']], [4, 'The window was ___ by the ball.', 'broken', ['broke', 'break', 'breaking']],
  ].map(([b, text, ans, opts]) => ({ b, text, ans, opts })) },
  { id: 's4', ar: 'أسمع وأفهم', en: 'Listening: sentences', icon: '🎧', line: 's4', kind: 'listenQ', stop: 0, items: [
    { b: 1, say: ['I eat eggs for breakfast.'], q: 'ماذا يأكل في الفطور؟', qa: 'q-41', ans: '🥚', opts: ['🍕', '🍌', '🧀'], pics: true },
    { b: 1, say: ['The cat is in the box.'], q: 'أين القطة؟', qa: 'q-42', ans: 'في الصندوق', opts: ['على الصندوق', 'تحت الصندوق', 'بجانب الصندوق'] },
    { b: 2, say: ['I go to school by bus.'], q: 'كيف يذهب إلى المدرسة؟', qa: 'q-43', ans: '🚌', opts: ['🚗', '🚲', '🚶'], pics: true },
    { b: 2, say: ['On Tuesday, I go swimming.'], q: 'متى يذهب للسباحة؟', qa: 'q-44', ans: 'يوم الثلاثاء', opts: ['يوم الخميس', 'يوم الجمعة', 'يوم الأحد'] },
    { b: 3, say: ["Next week, Hessa's family is going to travel to Abha.", 'They are going to stay for five days.'], q: 'كم يومًا ستبقى العائلة؟', qa: 'q-45', ans: 'خمسة أيام', opts: ['يومين', 'سبعة أيام', 'عشرة أيام'] },
    { b: 3, say: ['The cheetah is the fastest land animal.', 'The giraffe is the tallest animal.'], q: 'ما أطول حيوان؟', qa: 'q-46', ans: '🦒', opts: ['🐆', '🐘', '🐋'], pics: true },
    { b: 4, say: ['Fahad has never been on a boat.', 'His cousin Majid has been diving five times.'], q: 'كم مرة غاص ماجد؟', qa: 'q-47', ans: 'خمس مرات', opts: ['مرة واحدة', 'لم يغص أبدًا', 'عشر مرات'] },
    { b: 4, say: ["We arrived at the camp at four o'clock.", 'My father put up the tent, and my brother and I collected wood.'], q: 'ماذا جمع الولد وأخوه؟', qa: 'q-48', ans: 'الحطب', opts: ['الماء', 'الحجارة', 'الطعام'] },
  ] },
  { id: 's5', ar: 'أقرأ وأفهم', en: 'Reading: stories', icon: '📚', line: 's5', kind: 'reading', stop: 1, items: [
    { b: 2, text: 'Sami is nine years old. He lives in Riyadh with his family. Every morning, he goes to school by bus. His favorite subject is science. After school, he plays football with his friends.', qs: [
      { q: 'كم عمر سامي؟', qa: 'q-51', ans: 'تسع سنوات', opts: ['عشر سنوات', 'سبع سنوات', 'ثماني سنوات'] },
      { q: 'كيف يذهب سامي إلى المدرسة؟', qa: 'q-52', ans: 'بالحافلة', opts: ['بالسيارة', 'مشيًا', 'بالقطار'] },
      { q: 'ماذا يفعل سامي بعد المدرسة؟', qa: 'q-53', ans: 'يلعب كرة القدم', opts: ['يقرأ قصة', 'ينام', 'يسبح'] }] },
    { b: 3, text: "Last weekend, Noor's family went to the desert. They took a big tent, some food and a lot of water. In the evening, it was cold, so they made a fire. Noor saw many stars in the sky. She wants to go again next month.", qs: [
      { q: "Where did Noor's family go?", en: true, ans: 'To the desert.', opts: ['To the beach.', 'To the mountains.', 'To a hotel.'] },
      { q: 'Why did they make a fire?', en: true, ans: 'Because it was cold.', opts: ['Because they were hungry.', 'Because it was windy.', 'Because they were scared.'] },
      { q: 'When does Noor want to go again?', en: true, ans: 'Next month.', opts: ['Next week.', 'Tomorrow.', 'Next year.'] }] },
    { b: 4, text: 'Omar wanted to buy a new bike, but it was too expensive. He decided to save his money. Every week, he put some of his pocket money in a box. After three months, he had enough, and he bought the bike himself. He felt very proud.', qs: [
      { q: "Why didn't Omar buy the bike at first?", en: true, ans: 'It was too expensive.', opts: ['It was broken.', 'It was too small.', "He didn't like it."] },
      { q: 'How long did Omar save his money?', en: true, ans: 'For three months.', opts: ['For three weeks.', 'For one year.', 'For one week.'] },
      { q: 'How did Omar feel at the end?', en: true, ans: 'Proud.', opts: ['Sad.', 'Angry.', 'Bored.'] }] },
  ] },
  { id: 's6', ar: 'أكتب الكلمة', en: 'Spelling', icon: '✏️', line: 's6', kind: 'spell', stop: -1, items: [
    { b: 1, say: 'fish', pic: '🐟' }, { b: 2, say: 'horse', pic: '🐴' }, { b: 3, say: 'elephant', pic: '🐘' }, { b: 4, say: 'butterfly', pic: '🦋' },
  ] },
  /* speaking: he answers into the microphone; only his words are kept (never the sound), and Claude rates them */
  { id: 's7', ar: 'أتكلم', en: 'Speaking', icon: '🎤', line: 's7', kind: 'speak', stop: -1, items: [
    { b: 1, say: 'What is your favorite color?' },
    { b: 2, say: 'What do you do after school?' },
    { b: 2, say: 'What do you want to be?' },
    { b: 3, say: 'What did you do last weekend?' },
    { b: 3, say: 'What makes you happy?' },
    { b: 4, say: 'Which do you like more, the sea or the desert? Why?' },
  ] },
];
/* questions for the parents at the end */
const LT_PARENT = [
  { id: 'understand', q: 'في حصة الإنجليزي، هل يفهم ما تقوله المعلمة؟', opts: ['غالبًا لا', 'أحيانًا', 'غالبًا نعم', 'دائمًا تقريبًا'] },
  { id: 'phonics', q: 'هل يعرف أصوات الحروف ويقرأ كلمات إنجليزية بسيطة وحده؟', opts: ['لا', 'قليلًا', 'نعم', 'نعم، بسهولة'] },
  { id: 'hardest', q: 'ما أصعب شيء عليه في الإنجليزي؟', opts: ['حفظ الكلمات', 'فهم الكلام المسموع', 'الكلام والإجابة', 'القراءة والكتابة'] },
  { id: 'classes', q: 'كم حصة إنجليزي يأخذ في الأسبوع؟', opts: ['حصة واحدة', 'حصتان', 'ثلاث حصص', 'أربع أو أكثر'] },
  { id: 'minutes', q: 'كم دقيقة يمكنه أن يتدرب كل يوم في البيت؟', opts: ['١٠ دقائق', '١٥ دقيقة', '٢٠ دقيقة', '٣٠ دقيقة أو أكثر'] },
];
/* Hamed's lines, fully vowelled */
const LT_AR = {
  'intro-1': 'أَهْلًا يَا بَطَلُ! هَذَا اخْتِبَارٌ قَصِيرٌ لِنَعْرِفَ مُسْتَوَاكَ فِي اللُّغَةِ الْإِنْجِلِيزِيَّةِ.',
  'intro-2': 'لَيْسَ فِيهِ نَجَاحٌ وَلَا رُسُوبٌ. أَجِبْ بِهُدُوءٍ، وَإِذَا لَمْ تَعْرِفِ الْإِجَابَةَ فَاضْغَطْ: لَا أَعْرِفُ.',
  's1': 'الْجُزْءُ الْأَوَّلُ: اِسْمَعِ الْكَلِمَةَ، ثُمَّ اخْتَرْ صُورَتَهَا.',
  's2': 'الْجُزْءُ الثَّانِي: اِقْرَأِ الْكَلِمَةَ الْإِنْجِلِيزِيَّةَ، ثُمَّ اخْتَرْ مَعْنَاهَا.',
  's3': 'الْجُزْءُ الثَّالِثُ: اِخْتَرِ الْكَلِمَةَ الَّتِي تُكْمِلُ الْجُمْلَةَ.',
  's4': 'الْجُزْءُ الرَّابِعُ: اِسْمَعِ الْكَلَامَ جَيِّدًا، ثُمَّ أَجِبْ عَنِ السُّؤَالِ.',
  's5': 'الْجُزْءُ الْخَامِسُ: اِقْرَأِ الْقِصَّةَ الْقَصِيرَةَ، ثُمَّ أَجِبْ عَنِ الْأَسْئِلَةِ.',
  's6': 'الْجُزْءُ السَّادِسُ: اِسْمَعِ الْكَلِمَةَ، ثُمَّ اكْتُبْهَا بِالْحُرُوفِ.',
  's7': 'الْجُزْءُ السَّابِعُ: اِسْمَعِ السُّؤَالَ، ثُمَّ اضْغَطْ عَلَى الْمِيكْرُوفُونِ، وَأَجِبْ بِجُمْلَةٍ كَامِلَةٍ.',
  'mic-heard': 'أَحْسَنْتَ! سَمِعْتُكَ.',
  'mic-again': 'لَمْ أَسْمَعْكَ جَيِّدًا. اِقْتَرِبْ، وَتَكَلَّمْ بِصَوْتٍ وَاضِحٍ.',
  'speak-only': 'هَيَّا نَتَكَلَّمُ! سَتَسْمَعُ سِتَّةَ أَسْئِلَةٍ، فَأَجِبْ عَنْ كُلِّ سُؤَالٍ بِجُمْلَةٍ كَامِلَةٍ.',
  'speak-done': 'أَحْسَنْتَ يَا بَطَلُ! أَنْهَيْتَ جُزْءَ الْكَلَامِ.',
  'next': 'أَحْسَنْتَ! هَيَّا إِلَى الْجُزْءِ التَّالِي.',
  'done': 'أَحْسَنْتَ يَا بَطَلُ! أَنْهَيْتَ الِاخْتِبَارَ كُلَّهُ.',
  'parents': 'شُكْرًا لَكَ! بَقِيَتْ أَسْئِلَةٌ قَصِيرَةٌ لِلْوَالِدَيْنِ.',
  'q-41': 'مَاذَا يَأْكُلُ فِي الْفُطُورِ؟',
  'q-42': 'أَيْنَ الْقِطَّةُ؟',
  'q-43': 'كَيْفَ يَذْهَبُ إِلَى الْمَدْرَسَةِ؟',
  'q-44': 'مَتَى يَذْهَبُ لِلسِّبَاحَةِ؟',
  'q-45': 'كَمْ يَوْمًا سَتَبْقَى الْعَائِلَةُ؟',
  'q-46': 'مَا أَطْوَلُ حَيَوَانٍ؟',
  'q-47': 'كَمْ مَرَّةً غَاصَ مَاجِدٌ؟',
  'q-48': 'مَاذَا جَمَعَ الْوَلَدُ وَأَخُوهُ؟',
  'q-51': 'كَمْ عُمْرُ سَامِي؟',
  'q-52': 'كَيْفَ يَذْهَبُ سَامِي إِلَى الْمَدْرَسَةِ؟',
  'q-53': 'مَاذَا يَفْعَلُ سَامِي بَعْدَ الْمَدْرَسَةِ؟',
};
/* every item gets an id: section-band-number (s1-2-3), reading questions s5-<band>-<q> */
LT_SECTIONS.forEach(s => { const n = {}; s.items.forEach(it => { n[it.b] = (n[it.b] || 0) + 1; it.id = `${s.id}-${it.b}-${n[it.b]}`; if (it.qs) it.qs.forEach((q, j) => { q.id = `${s.id}-${it.b}-${j + 1}`; q.b = it.b; }); }); });
if (typeof module !== 'undefined') module.exports = { LT_SECTIONS, LT_AR, LT_PARENT, LT_BANDS };
