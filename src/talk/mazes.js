/* ===== متاهات روبو =====
   # جدار، . أرض، S البداية، E المخرج، * نجمة (جوهرة إضافية)
   k مفتاح ذهبي، D باب ذهبي، r مفتاح أحمر، R باب أحمر، b مفتاح أزرق، B باب أزرق
   قاعدة الحركة: «go right» ينزلق حتى يصطدم بجدار، أو يقف فوق مفتاح أو عند المخرج.
   «go right two» يمشي خطوتين بالضبط. */
const MAZES=[
 {map:['S....','####.','E....'],words:['go right','go down','go left'],tip:'قل go right ليتحرك روبو يميناً حتى الجدار.'},
 {map:['.....','.###.','S#..E'],words:['go up','go right','go down'],tip:'روبو يمشي حتى يصطدم بالجدار، ثم ينتظر أمرك.'},
 {map:['S.#...','#.#.#.','#...#E'],words:['up','down','left','right'],tip:'فكّر في الطريق قبل أن تتكلم!'},
 {map:['S.....','##.###','##...E'],words:['go right two','go down','go right'],tip:'أضف رقماً ليتوقف روبو: go right two = خطوتان يميناً.'},
 {map:['S...*.','###.##','*.....','.####.','E...*.'],words:['go right three','go down','go left'],tip:'النجوم ⭐ تعطيك جواهر إضافية.'},
 {map:['S......','#.#####','#......','#####.#','E......'],words:['go right one','go right four','go down'],tip:'تحتاج رقمين في هذه المتاهة!'},
 {map:['S..k','##D#','E...'],words:['pick up the key','open the door'],tip:'قف فوق المفتاح وقل pick up the key، ثم قف بجانب الباب وقل open the door.'},
 {map:['k.....','.####.','.#E.D.','.####.','S.....'],words:['pick up the key','go down two','open the door'],tip:'المخرج خلف باب مقفل. ابحث عن المفتاح أولاً!'},
 {map:['S.#k..','.##.#.','...*#.','#.###.','ED....'],words:['pick up the key','open the door','go left'],tip:'متاهة طويلة. خطوة خطوة، وابحث عن المفتاح!'},
 {map:['S...r','.####','.R..b','.####','.B..E'],words:['pick up the red key','open the red door','the blue key'],tip:'المفتاح الأحمر يفتح الباب الأحمر، والأزرق يفتح الأزرق.'},
 {map:['S.#....','..#.##.','#...#..','##.##.#','E..*...'],words:['go down and right','go right two and up'],tip:'جرّب أمرين في جملة واحدة: go down and right 🌟'},
 {map:['r..k..S','.######','...R.*b','######B','E.D.*..'],words:['the gold key','the red door','the blue door'],tip:'المتاهة الأخيرة! ثلاثة مفاتيح وثلاثة أبواب بثلاثة ألوان.'}
];
