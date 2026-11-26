/* صقر الكلمات — part 2 (A2): what the part is, Hamed's lines of the part, and its six rules of the day.
   The words and talk questions are in src.txt (made into words.js and arvoice.js by tools/falcon-part.js 2). */
const PARTNO = 2;
const PART = {
  title: 'الجزء الثاني', level: 'A2',
  stages: [['البيت والمدرسة', 'البيت، والطبخ، والملابس، والصحة، والدراسة'], ['الأماكن والطبيعة', 'المدينة، والسفر، والأرض، والحيوانات، والهوايات'],
    ['أفعال وصفات', 'أفعال وصفات، والوقت، والناس، وجمل الحصة']],
  about: 'كلمات المستوى A2 بعد الجزء الأول: البيت والطبخ والملابس والصحة والدراسة، ثم المدينة والسفر والطبيعة والحيوانات والهوايات، ثم أفعال وصفات وكلمات للوقت والناس وجمل للحصة. وست قواعد: الماضي، وmany وmuch، وgoing to، وكلمات التكرار، والمقارنة، وmust.',
  kind: KIND_PART,
  similar: [['tight', 'narrow'], ['hero', 'champion'], ['century', 'horn'], ['crossing', 'cross'], ['luggage', 'suitcase', 'unpack'], ['pillow', 'blanket'],
    ['sink', 'tap', 'bath', 'shower'], ['broom', 'sponge', 'bucket'], ['coat', 'raincoat', 'zip'], ['slippers', 'sandals'], ['ring', 'necklace', 'bracelet'],
    ['beard', 'moustache'], ['injury', 'bruise', 'burn'], ['pill', 'vitamins'], ['flu', 'runny nose', 'sore throat', 'allergy'], ['clinic', 'check-up', 'appointment'],
    ['exam', 'mark', 'pass', 'fail'], ['learn', 'teach', 'practice', 'revise', 'understand'], ['valley', 'hill', 'cliff'], ['stream', 'waterfall'],
    ['coast', 'ocean', 'wave'], ['north', 'south', 'east', 'west'], ['puppy', 'kitten', 'lamb'], ['swan', 'goose'], ['ostrich', 'peacock', 'flamingo', 'sparrow'],
    ['nest', 'wing'], ['medal', 'trophy', 'prize', 'champion'], ['referee', 'coach', 'captain'], ['hiking', 'climbing', 'jog'], ['bring', 'send'], ['drop', 'fall'],
    ['miss', 'hope'], ['huge', 'wide', 'thick'], ['tiny', 'narrow', 'thin'], ['boring', 'terrible'], ['smooth', 'rough'], ['once', 'twice', 'often'],
    ['daily', 'weekly'], ['ago', 'before', 'past'], ['still', 'yet', 'just', 'recently'], ['twins', 'relatives', 'nephew', 'niece', 'grandchild'],
    ['husband', 'wife'], ['everyone', 'someone', 'nobody', 'group', 'crowd'], ['king', 'leader', 'captain'], ['adult', 'teenager'], ['stranger', 'visitor', 'tourist'],
    ['spicy', 'raw', 'fresh'], ['boil', 'fry', 'bake'], ['slice', 'peel'], ['mix', 'stir', 'pour'], ['guide', 'tourist'], ['reserve', 'pack', 'stay'],
    ['land', 'check in'], ['palace', 'castle', 'tower'], ['petrol station', 'car park', 'bus stop'], ['meal', 'snack', 'dessert'], ['recipe', 'menu', 'bill'],
    ['curly', 'blond'], ['tight', 'loose', 'comfortable'], ['afraid', 'alone'], ['modern', 'ancient'], ['bright', 'colorful'], ['midnight', 'noon', 'tonight'],
    ['decade', 'century', 'moment'], ['finally', 'nowadays'], ['before', 'after', 'during', 'until']],
};
const AR_PART = Object.assign({}, AR_TOPICS, {
  'part-hello': 'أَهْلًا بِكَ فِي الْجُزْءِ الثَّانِي مِنْ صَقْرِ الْكَلِمَاتِ! كَلِمَاتٌ أَصْعَبُ، وَتَحَدٍّ أَكْبَرُ.',
  'part-plan': 'فِي كُلِّ يَوْمٍ: دَرْسٌ جَدِيدٌ، وَإِمْلَاءٌ، وَقَاعِدَةٌ، وَتَحَدُّثٌ، وَمُرَاجَعَةٌ.',
  'r2-past-1': 'عِنْدَمَا نَتَحَدَّثُ عَنِ الْمَاضِي، نُضِيفُ إِلَى أَكْثَرِ الْأَفْعَالِ حُرُوفًا فِي آخِرِهَا:',
  'r2-past-2': 'وَبَعْضُ الْأَفْعَالِ تَتَغَيَّرُ كُلُّهَا، فَنَحْفَظُهَا:',
  'r2-many-1': 'مَعَ الْأَشْيَاءِ الَّتِي نَعُدُّهَا، مِثْلَ التُّفَّاحِ، نَقُولُ:',
  'r2-many-2': 'وَمَعَ الْأَشْيَاءِ الَّتِي لَا نَعُدُّهَا، مِثْلَ الْمَاءِ، نَقُولُ:',
  'r2-going-1': 'لِلْحَدِيثِ عَنْ خُطَطِ الْمُسْتَقْبَلِ نَقُولُ:',
  'r2-going-2': 'وَمَعَ هُوَ وَهِيَ نَقُولُ:',
  'r2-freq-1': 'كَلِمَاتُ التَّكْرَارِ، مِثْلَ: دَائِمًا وَأَحْيَانًا وَأَبَدًا، تَأْتِي قَبْلَ الْفِعْلِ:',
  'r2-than-1': 'لِلْمُقَارَنَةِ مَعَ الصِّفَاتِ الْقَصِيرَةِ، نُضِيفُ حُرُوفًا فِي آخِرِهَا:',
  'r2-than-2': 'وَمَعَ الصِّفَاتِ الطَّوِيلَةِ، نَضَعُ قَبْلَهَا كَلِمَةً:',
  'r2-must-1': 'لِلشَّيْءِ الْوَاجِبِ نَقُولُ:',
  'r2-must-2': 'وَلِلشَّيْءِ الْمَمْنُوعِ نَقُولُ:',
  'r2-must-3': 'وَبَعْدَهُمَا يَأْتِي الْفِعْلُ كَمَا هُوَ، بِلَا زِيَادَةٍ.',
});
const PLAN = { id: 'part-2', start: 1, big: false, spell: [] };
/* the rule of the day (see src/falcon/plan.js for how a rule is written) */
const RULES = [
  { id: 'past', ar: 'الماضي', en: 'went · ate · saw', icon: '⏮️', parts: [
      { a: 'r2-past-1' }, { e: 'Yesterday, I played football.', hl: ['play+ed'] },
      { a: 'r2-past-2' }, { e: 'eat, ate. see, saw. buy, bought.', hl: ['ate', 'saw', 'bought'] }, { e: 'Last week, we ate fish at the beach.', hl: ['ate'] },
      { a: 'r-wrong' }, { x: 'Yesterday, I eated rice.' }],
    qs: [
      ['Yesterday, I ___ my grandmother.', 'visited', ['visit', 'visits']],
      ['Last night, we ___ pizza.', 'ate', ['eated', 'eat']],
      ['I ___ a big lion at the zoo yesterday.', 'saw', ['seen', 'see']],
      ['My father ___ me a new bike last week.', 'bought', ['buyed', 'buys']],
      ['We ___ a big fish at the beach last Friday.', 'caught', ['catched', 'catch']],
      ['My mother ___ a cake yesterday.', 'made', ['maked', 'makes']],
      ['I ___ a letter to my friend last week.', 'wrote', ['writed', 'write']],
      ['We ___ a good time at the park yesterday.', 'had', ['haved', 'have']],
    ] },
  { id: 'many', ar: 'many و much', en: 'How many? How much?', icon: '🔢', parts: [
      { a: 'r2-many-1' }, { e: 'How many apples do you have?', hl: ['many'] },
      { a: 'r2-many-2' }, { e: 'How much water do you drink?', hl: ['much'] },
      { a: 'r-wrong' }, { x: 'How much apples do you have?' }],
    qs: [
      ['How ___ brothers do you have?', 'many', ['much', 'lot']],
      ['How ___ milk is in the glass?', 'much', ['many', 'lot']],
      ['There are ___ books in the library.', 'many', ['much', 'lot']],
      ["I don't have ___ money.", 'much', ['many', 'lot']],
      ['How ___ time do we have?', 'much', ['many', 'lot']],
      ['We saw ___ camels in the desert.', 'many', ['much', 'lot']],
      ["Don't eat too ___ sugar.", 'much', ['many', 'lot']],
      ['How ___ students are in your class?', 'many', ['much', 'lot']],
    ] },
  { id: 'going', ar: 'going to للمستقبل', en: "I'm going to...", icon: '🗓️', parts: [
      { a: 'r2-going-1' }, { e: 'I am going to visit my uncle tomorrow.', hl: ['going', 'to'] },
      { a: 'r2-going-2' }, { e: 'She is going to play tennis.', hl: ['is', 'going', 'to'] },
      { a: 'r-wrong' }, { x: 'I going to visit my uncle.' }],
    qs: [
      ['I am ___ to read a new book.', 'going', ['go', 'goes']],
      ['We ___ going to travel next week.', 'are', ['is', 'am']],
      ['She is going ___ visit her aunt.', 'to', ['for', 'at']],
      ['They ___ going to play football.', 'are', ['is', 'am']],
      ['My father is going to ___ the car.', 'wash', ['washes', 'washing']],
      ['Are you going ___ come to the park?', 'to', ['for', 'at']],
      ['It ___ going to rain this evening.', 'is', ['are', 'am']],
      ['I am going to ___ my homework now.', 'do', ['does', 'doing']],
    ] },
  { id: 'freq', ar: 'كلمات التكرار', en: 'always · usually · never', icon: '🔁', parts: [
      { a: 'r2-freq-1' }, { e: 'I always eat breakfast.', hl: ['always'] }, { e: 'My sister sometimes reads stories.', hl: ['sometimes'] },
      { a: 'r-wrong' }, { x: 'I eat always breakfast.' }],
    qs: [
      ['I ___ my teeth at night.', 'always brush', ['brush always', 'always brushes']],
      ['We ___ fish on Friday.', 'often eat', ['eat often', 'often eats']],
      ['They ___ to the park after school.', 'sometimes go', ['go sometimes', 'sometimes goes']],
      ['He ___ his homework.', 'never forgets', ['forgets never', 'never forget']],
      ['I ___ milk in the morning.', 'usually drink', ['drink usually', 'usually drinks']],
      ['My sister ___ books before bed.', 'always reads', ['reads always', 'always read']],
      ['My father ___ coffee at night.', 'never drinks', ['drinks never', 'never drink']],
      ['We ___ our grandparents on Friday.', 'usually visit', ['visit usually', 'usually visits']],
    ] },
  { id: 'than', ar: 'المقارنة', en: 'bigger · more beautiful', icon: '⚖️', parts: [
      { a: 'r2-than-1' }, { e: 'A lion is stronger than a cat.', hl: ['strong+er', 'than'] },
      { a: 'r2-than-2' }, { e: 'This book is more interesting than that one.', hl: ['more', 'than'] },
      { a: 'r-wrong' }, { x: 'This book is interestinger.' }],
    qs: [
      ['A plane is ___ than a car.', 'faster', ['more fast', 'fastest']],
      ['Math is ___ than art for me.', 'more difficult', ['difficulter', 'most difficult']],
      ['The red bag is ___ than the blue one.', 'more beautiful', ['beautifuler', 'most beautiful']],
      ['My brother is ___ than me.', 'taller', ['more tall', 'tallest']],
      ['This story is ___ than the last one.', 'more interesting', ['interestinger', 'most interesting']],
      ['Summer is ___ than winter.', 'hotter', ['more hot', 'hottest']],
      ['The new phone is ___ than the old one.', 'more modern', ['moderner', 'most modern']],
      ['A mouse is ___ than a rabbit.', 'smaller', ['more small', 'smallest']],
    ] },
  { id: 'must', ar: 'must و mustn\'t', en: "must · mustn't", icon: '🚦', parts: [
      { a: 'r2-must-1' }, { e: 'You must wear your seat belt.', hl: ['must'] },
      { a: 'r2-must-2' }, { e: "You mustn't run near the pool.", hl: ["mustn't"] },
      { a: 'r2-must-3' }, { x: 'You must to wear your seat belt.' }],
    qs: [
      ['You ___ wash your hands before you eat.', 'must', ["mustn't", 'musts']],
      ['You ___ shout in the library.', "mustn't", ['must', 'must to']],
      ['We ___ be kind to animals.', 'must', ["mustn't", 'must to']],
      ["You mustn't ___ the stove.", 'touch', ['to touch', 'touches']],
      ['Students must ___ their uniform.', 'wear', ['to wear', 'wears']],
      ['You ___ cross the road when the light is red.', "mustn't", ['must', 'must to']],
      ['Drivers ___ stop at a red light.', 'must', ["mustn't", 'musts']],
      ['You ___ use your phone during the test.', "mustn't", ['must', 'must to']],
    ] },
];
RULES.forEach(r => { r.qs = r.qs.map(([text, ans, wrong]) => ({ text, ans, wrong, full: text.replace('___', ans) })); });
if (typeof module !== 'undefined') module.exports = { PARTNO, PART, AR_PART, PLAN, RULES };
