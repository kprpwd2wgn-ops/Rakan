/* ===== غرف الهروب: اقرأ الرسالة لتجد المفتاح =====
   كل غرفة: أشياء مرسومة لها أماكن (on, under, in, behind, next) ، ورسائل تقود إلى المفتاح */
const PREPAR={on:'على',under:'تحت',in:'داخل',behind:'خلف',next:'بجانب',between:'بين'};
const PREPEN={on:'on',under:'under',in:'in',behind:'behind',next:'next to',between:'between'};
const ROOMS=[
 {en:'The Bedroom',ar:'غرفة النوم',wall:'#c7d2fe',floor:'#8b7fd6',objs:[
   {id:'bed',k:'bed',x:18,y:128,w:150,h:84,col:'#60a5fa',en:'the bed',ar:'السرير'},
   {id:'box',k:'box',x:206,y:170,w:58,h:46,col:'#ef4444',en:'the box',ar:'الصندوق'},
   {id:'lamp',k:'lamp',x:190,y:70,w:34,h:70,en:'the lamp',ar:'المصباح'},
   {id:'pic',k:'picture',x:40,y:40,w:70,h:52,en:'the picture',ar:'الصورة'},
   {id:'rug',k:'rug',x:120,y:232,w:120,h:30,col:'#f59e0b',en:'the rug',ar:'السجادة'}],
  steps:[{en:'Look under the bed.',ar:'ابحث تحت السرير.',spot:'bed:under',get:'📜'},{en:'The key is in the box.',ar:'المفتاح في الصندوق.',spot:'box:in',get:'🔑'}]},
 {en:'The Kitchen',ar:'المطبخ',wall:'#fde68a',floor:'#d6a46a',objs:[
   {id:'tab',k:'table',x:30,y:150,w:130,h:64,en:'the table',ar:'الطاولة'},
   {id:'cup',k:'cupboard',x:250,y:60,w:70,h:150,en:'the cupboard',ar:'الخزانة'},
   {id:'rbox',k:'box',x:180,y:178,w:50,h:40,col:'#ef4444',en:'the red box',ar:'الصندوق الأحمر'},
   {id:'bbox',k:'box',x:186,y:236,w:50,h:40,col:'#3b82f6',en:'the blue box',ar:'الصندوق الأزرق'},
   {id:'plant',k:'plant',x:60,y:68,w:44,h:70,en:'the plant',ar:'النبتة'}],
  steps:[{en:'Look on the table.',ar:'انظر على الطاولة.',spot:'tab:on',get:'📜'},{en:'The key is in the blue box.',ar:'المفتاح في الصندوق الأزرق.',spot:'bbox:in',get:'🔑'}]},
 {en:'The Robot Lab',ar:'مختبر الروبوتات',wall:'#bae6fd',floor:'#64748b',objs:[
   {id:'clock',k:'clock',x:150,y:30,w:48,h:48,en:'the clock',ar:'الساعة'},
   {id:'robot',k:'robot',x:40,y:150,w:56,h:74,en:'the robot',ar:'الروبوت'},
   {id:'books',k:'books',x:200,y:180,w:60,h:40,en:'the books',ar:'الكتب'},
   {id:'chair',k:'chair',x:130,y:150,w:50,h:78,en:'the chair',ar:'الكرسي'},
   {id:'rug',k:'rug',x:60,y:236,w:150,h:30,col:'#22c55e',en:'the rug',ar:'السجادة'}],
  steps:[{en:'Look behind the clock.',ar:'ابحث خلف الساعة.',spot:'clock:behind',get:'📜'},{en:'Look next to the robot.',ar:'ابحث بجانب الروبوت.',spot:'robot:next',get:'📜'},{en:'The key is under the rug.',ar:'المفتاح تحت السجادة.',spot:'rug:under',get:'🔑'}]},
 {en:'The Garden Dome',ar:'قبة الحديقة',wall:'#bbf7d0',floor:'#65a30d',objs:[
   {id:'bigp',k:'plant',x:30,y:90,w:70,h:130,big:1,en:'the big plant',ar:'النبتة الكبيرة'},
   {id:'smp',k:'plant',x:130,y:160,w:40,h:62,en:'the small plant',ar:'النبتة الصغيرة'},
   {id:'rrug',k:'rug',x:20,y:238,w:110,h:28,col:'#ef4444',en:'the red rug',ar:'السجادة الحمراء'},
   {id:'brug',k:'rug',x:150,y:238,w:110,h:28,col:'#3b82f6',en:'the blue rug',ar:'السجادة الزرقاء'},
   {id:'box',k:'box',x:200,y:180,w:56,h:44,col:'#a855f7',en:'the box',ar:'الصندوق'}],
  steps:[{en:'Look behind the small plant.',ar:'ابحث خلف النبتة الصغيرة.',spot:'smp:behind',get:'📜'},{en:'The key is under the blue rug.',ar:'المفتاح تحت السجادة الزرقاء.',spot:'brug:under',get:'🔑'}]},
 {en:'The Library',ar:'المكتبة',wall:'#fecaca',floor:'#9a6b3f',objs:[
   {id:'tab',k:'table',x:20,y:160,w:120,h:60,en:'the table',ar:'الطاولة'},
   {id:'lamp',k:'lamp',x:150,y:140,w:34,h:80,en:'the lamp',ar:'المصباح'},
   {id:'clock',k:'clock',x:240,y:150,w:44,h:44,floor:1,en:'the clock',ar:'الساعة'},
   {id:'cup',k:'cupboard',x:40,y:30,w:110,h:100,wide:1,en:'the cupboard',ar:'الخزانة'},
   {id:'books',k:'books',x:30,y:236,w:70,h:34,en:'the books',ar:'الكتب'}],
  between:[{id:'lc',a:'lamp',b:'clock',x:188,y:150,w:50,h:70,en:'between the lamp and the clock',ar:'بين المصباح والساعة'}],
  steps:[{en:'Look under the table.',ar:'ابحث تحت الطاولة.',spot:'tab:under',get:'📜'},{en:'Look between the lamp and the clock.',ar:'ابحث بين المصباح والساعة.',spot:'lc:between',get:'📜'},{en:'The key is in the cupboard.',ar:'المفتاح في الخزانة.',spot:'cup:in',get:'🔑'}]},
 {en:'The Toy Room',ar:'غرفة الألعاب',wall:'#fbcfe8',floor:'#c084fc',objs:[
   {id:'rbox',k:'box',x:20,y:184,w:52,h:42,col:'#ef4444',en:'the red box',ar:'الصندوق الأحمر'},
   {id:'bbox',k:'box',x:84,y:184,w:52,h:42,col:'#3b82f6',en:'the blue box',ar:'الصندوق الأزرق'},
   {id:'ybox',k:'box',x:148,y:184,w:52,h:42,col:'#facc15',en:'the yellow box',ar:'الصندوق الأصفر'},
   {id:'teddy',k:'teddy',x:200,y:110,w:60,h:70,en:'the teddy',ar:'الدبدوب'},
   {id:'chair',k:'chair',x:50,y:90,w:50,h:80,en:'the chair',ar:'الكرسي'}],
  steps:[{en:'Look in the yellow box.',ar:'ابحث في الصندوق الأصفر.',spot:'ybox:in',get:'📜'},{en:'Look behind the teddy.',ar:'ابحث خلف الدبدوب.',spot:'teddy:behind',get:'📜'},{en:'The key is on the chair.',ar:'المفتاح على الكرسي.',spot:'chair:on',get:'🔑'}]},
 {en:'The Control Room',ar:'غرفة التحكم',wall:'#a5b4fc',floor:'#475569',objs:[
   {id:'tab',k:'table',x:30,y:150,w:140,h:64,en:'the table',ar:'الطاولة'},
   {id:'pic',k:'picture',x:60,y:40,w:90,h:60,screen:1,en:'the picture',ar:'الصورة'},
   {id:'box',k:'box',x:200,y:176,w:56,h:44,col:'#f97316',en:'the box',ar:'الصندوق'},
   {id:'lamp',k:'lamp',x:200,y:60,w:34,h:70,en:'the lamp',ar:'المصباح'},
   {id:'rug',k:'rug',x:40,y:236,w:150,h:30,col:'#06b6d4',en:'the rug',ar:'السجادة'}],
  steps:[{en:'Go to the table. Look under it.',ar:'اذهب إلى الطاولة. ابحث تحتها.',spot:'tab:under',get:'📜'},{en:'The key is not in the box. It is behind the picture.',ar:'المفتاح ليس في الصندوق. إنه خلف الصورة.',spot:'pic:behind',get:'🔑'}]},
 {en:"The Captain's Room",ar:'غرفة القبطان',wall:'#fef3c7',floor:'#7c5a3a',objs:[
   {id:'bed',k:'bed',x:16,y:130,w:140,h:80,col:'#ef4444',en:'the bed',ar:'السرير'},
   {id:'srug',k:'rug',x:170,y:240,w:70,h:26,col:'#22c55e',en:'the small rug',ar:'السجادة الصغيرة'},
   {id:'brug',k:'rug',x:20,y:236,w:140,h:32,col:'#3b82f6',en:'the big rug',ar:'السجادة الكبيرة'},
   {id:'clock',k:'clock',x:170,y:36,w:46,h:46,en:'the clock',ar:'الساعة'},
   {id:'teddy',k:'teddy',x:190,y:150,w:56,h:66,en:'the teddy',ar:'الدبدوب'}],
  steps:[{en:'Look on the bed.',ar:'انظر على السرير.',spot:'bed:on',get:'📜'},{en:'Look under the small rug.',ar:'ابحث تحت السجادة الصغيرة.',spot:'srug:under',get:'📜'},{en:'Look next to the teddy… no! Look behind the clock.',ar:'ابحث بجانب الدبدوب… لا! ابحث خلف الساعة.',spot:'clock:behind',get:'🔑'}]}
];
/* أماكن كل شيء (مستطيلات بالنسبة إلى حدوده) */
function spotsOf(o){const {x,y,w,h}=o,S={};
  switch(o.k){
    case 'bed':S.on=[x+w*.04,y-6,w*.92,h*.5];S.under=[x+w*.08,y+h*.62,w*.84,h*.38+6];break;
    case 'box':S.in=[x,y,w,h];S.on=[x,y-16,w,16];break;
    case 'lamp':S.next=[x+w,y+h*.2,30,h*.8];S.on=[x,y-8,w,h*.4];break;
    case 'plant':S.behind=[x-8,y,w+16,h*.6];S.in=[x+w*.15,y+h*.6,w*.7,h*.4];break;
    case 'rug':S.under=[x,y,w,h];S.on=[x,y-10,w,10];break;
    case 'picture':S.behind=[x,y,w,h];break;
    case 'chair':S.on=[x,y+h*.38,w,h*.18];S.under=[x,y+h*.56,w,h*.44];break;
    case 'table':S.on=[x,y-18,w,26];S.under=[x+6,y+10,w-12,h-10];break;
    case 'cupboard':S.in=[x,y,w,h];break;
    case 'teddy':S.behind=[x,y,w,h];break;
    case 'robot':S.next=[x+w,y,30,h];S.behind=[x,y,w,h];break;
    case 'books':S.on=[x,y-14,w,14];S.under=[x,y,w,h];break;
    case 'clock':S.behind=[x,y,w,h];break;}
  return S;}
function roomSVG(R,o={}){
  const I='#1d2433';let s=`<rect width="360" height="280" fill="${R.wall}"/><rect y="200" width="360" height="80" fill="${R.floor}"/><rect y="196" width="360" height="6" fill="rgba(0,0,0,.18)"/>`;
  s+=`<path d="M0 20 H360" stroke="rgba(255,255,255,.4)" stroke-width="2"/>`;
  /* الباب */
  const open=o.open;s+=`<rect x="300" y="86" width="52" height="114" rx="6" fill="${open?'#1e1b4b':'#92400e'}" stroke="${I}" stroke-width="3"/>`;
  if(open)s+=`<path d="M300 86 L284 94 L284 206 L300 200 Z" fill="#b45309" stroke="${I}" stroke-width="3" stroke-linejoin="round"/><circle cx="326" cy="140" r="16" fill="#fde68a" opacity=".8"/><text x="326" y="146" font-size="18" text-anchor="middle">✨</text>`;
  else s+=`<rect x="308" y="96" width="36" height="40" rx="3" fill="none" stroke="#78350f" stroke-width="2"/><circle cx="342" cy="150" r="4" fill="#fbbf24" stroke="${I}" stroke-width="1.5"/><rect x="338" y="156" width="8" height="12" rx="2" fill="${I}"/>`;
  R.objs.forEach(b=>{s+=objSVG(b,I);});
  return `<svg class="room" viewBox="0 0 360 280" role="img" aria-label="${R.ar}">${s}<g id="rfx"></g></svg>`;}
function objSVG(b,I){const {x,y,w,h}=b,c=b.col||'#94a3b8';
  switch(b.k){
   case 'bed':return `<rect x="${x+6}" y="${y+h*.55}" width="8" height="${h*.45}" fill="#6b4423" stroke="${I}" stroke-width="2"/><rect x="${x+w-14}" y="${y+h*.55}" width="8" height="${h*.45}" fill="#6b4423" stroke="${I}" stroke-width="2"/>
     <rect x="${x}" y="${y-18}" width="14" height="${h*.75}" rx="4" fill="#8b5a2b" stroke="${I}" stroke-width="2.5"/><rect x="${x}" y="${y+h*.2}" width="${w}" height="${h*.38}" rx="8" fill="#fff" stroke="${I}" stroke-width="2.5"/>
     <rect x="${x+w*.3}" y="${y+h*.14}" width="${w*.7}" height="${h*.44}" rx="8" fill="${c}" stroke="${I}" stroke-width="2.5"/><ellipse cx="${x+w*.17}" cy="${y+h*.22}" rx="${w*.11}" ry="${h*.12}" fill="#f8fafc" stroke="${I}" stroke-width="2"/>`;
   case 'box':return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${c}" stroke="${I}" stroke-width="2.5"/><rect x="${x-3}" y="${y-6}" width="${w+6}" height="12" rx="3" fill="${c}" stroke="${I}" stroke-width="2.5"/><path d="M${x+w/2} ${y} V${y+h}" stroke="rgba(0,0,0,.25)" stroke-width="3"/>`;
   case 'lamp':return `<ellipse cx="${x+w/2}" cy="${y+h*.32}" rx="${w*.9}" ry="${h*.3}" fill="#fde68a" opacity=".35"/><path d="M${x} ${y+h*.4} L${x+w*.2} ${y} L${x+w*.8} ${y} L${x+w} ${y+h*.4} Z" fill="#facc15" stroke="${I}" stroke-width="2.5" stroke-linejoin="round"/>
     <rect x="${x+w/2-2}" y="${y+h*.4}" width="4" height="${h*.5}" fill="#475569"/><ellipse cx="${x+w/2}" cy="${y+h*.94}" rx="${w*.45}" ry="${h*.06}" fill="#475569" stroke="${I}" stroke-width="2"/>`;
   case 'plant':return `<path d="M${x+w*.5} ${y+h*.6} C${x-w*.3} ${y+h*.3} ${x+w*.1} ${y} ${x+w*.45} ${y+h*.2} M${x+w*.5} ${y+h*.6} C${x+w*1.3} ${y+h*.3} ${x+w*.9} ${y-h*.05} ${x+w*.55} ${y+h*.15}" stroke="#15803d" stroke-width="${b.big?10:7}" fill="none" stroke-linecap="round"/>
     <ellipse cx="${x+w*.25}" cy="${y+h*.3}" rx="${w*.28}" ry="${h*.12}" fill="#22c55e" stroke="${I}" stroke-width="2"/><ellipse cx="${x+w*.75}" cy="${y+h*.26}" rx="${w*.28}" ry="${h*.12}" fill="#4ade80" stroke="${I}" stroke-width="2"/><ellipse cx="${x+w*.5}" cy="${y+h*.12}" rx="${w*.22}" ry="${h*.1}" fill="#22c55e" stroke="${I}" stroke-width="2"/>
     <path d="M${x+w*.12} ${y+h*.6} H${x+w*.88} L${x+w*.78} ${y+h} H${x+w*.22} Z" fill="#c2410c" stroke="${I}" stroke-width="2.5" stroke-linejoin="round"/>`;
   case 'rug':return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h/2}" fill="${c}" stroke="${I}" stroke-width="2.5"/><rect x="${x+8}" y="${y+6}" width="${w-16}" height="${h-12}" rx="${(h-12)/2}" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="2" stroke-dasharray="6 5"/>`;
   case 'picture':return b.screen?`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#0f172a" stroke="${I}" stroke-width="3"/><path d="M${x+8} ${y+h*.7} L${x+w*.3} ${y+h*.4} L${x+w*.5} ${y+h*.6} L${x+w*.7} ${y+h*.3} L${x+w-8} ${y+h*.5}" stroke="#22d3ee" stroke-width="3" fill="none"/><circle cx="${x+w*.8}" cy="${y+h*.25}" r="4" fill="#f472b6"/>`
     :`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#bae6fd" stroke="#92400e" stroke-width="6"/><path d="M${x+5} ${y+h-5} L${x+w*.35} ${y+h*.45} L${x+w*.55} ${y+h*.7} L${x+w*.75} ${y+h*.4} L${x+w-5} ${y+h-5} Z" fill="#22c55e"/><circle cx="${x+w*.25}" cy="${y+h*.3}" r="6" fill="#facc15"/>`;
   case 'chair':return `<rect x="${x+w*.1}" y="${y}" width="${w*.18}" height="${h*.9}" fill="#b45309" stroke="${I}" stroke-width="2.5"/><rect x="${x}" y="${y+h*.38}" width="${w}" height="${h*.14}" rx="3" fill="#d97706" stroke="${I}" stroke-width="2.5"/><rect x="${x+w*.78}" y="${y+h*.5}" width="${w*.12}" height="${h*.5}" fill="#b45309" stroke="${I}" stroke-width="2"/><rect x="${x+w*.1}" y="${y+h*.5}" width="${w*.12}" height="${h*.5}" fill="#b45309" stroke="${I}" stroke-width="2"/>`;
   case 'table':return `<rect x="${x}" y="${y}" width="${w}" height="12" rx="3" fill="#a16207" stroke="${I}" stroke-width="2.5"/><rect x="${x+8}" y="${y+12}" width="9" height="${h-12}" fill="#854d0e" stroke="${I}" stroke-width="2"/><rect x="${x+w-17}" y="${y+12}" width="9" height="${h-12}" fill="#854d0e" stroke="${I}" stroke-width="2"/>`;
   case 'cupboard':return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="#b45309" stroke="${I}" stroke-width="2.5"/><path d="M${x+w/2} ${y+4} V${y+h-4}" stroke="${I}" stroke-width="2.5"/><circle cx="${x+w/2-6}" cy="${y+h/2}" r="3" fill="#fde68a" stroke="${I}" stroke-width="1.5"/><circle cx="${x+w/2+6}" cy="${y+h/2}" r="3" fill="#fde68a" stroke="${I}" stroke-width="1.5"/>`;
   case 'teddy':return `<circle cx="${x+w*.25}" cy="${y+h*.12}" r="${w*.12}" fill="#b45309" stroke="${I}" stroke-width="2"/><circle cx="${x+w*.75}" cy="${y+h*.12}" r="${w*.12}" fill="#b45309" stroke="${I}" stroke-width="2"/><ellipse cx="${x+w/2}" cy="${y+h*.72}" rx="${w*.42}" ry="${h*.3}" fill="#b45309" stroke="${I}" stroke-width="2.5"/>
     <circle cx="${x+w/2}" cy="${y+h*.3}" r="${w*.3}" fill="#c2763a" stroke="${I}" stroke-width="2.5"/><ellipse cx="${x+w/2}" cy="${y+h*.38}" rx="${w*.12}" ry="${h*.07}" fill="#fde68a"/><circle cx="${x+w*.4}" cy="${y+h*.26}" r="2.5" fill="${I}"/><circle cx="${x+w*.6}" cy="${y+h*.26}" r="2.5" fill="${I}"/><circle cx="${x+w/2}" cy="${y+h*.35}" r="2.5" fill="${I}"/>`;
   case 'robot':return `<rect x="${x+w*.15}" y="${y+h*.35}" width="${w*.7}" height="${h*.5}" rx="6" fill="#7dd3fc" stroke="${I}" stroke-width="2.5"/><rect x="${x+w*.1}" y="${y+h*.05}" width="${w*.8}" height="${h*.32}" rx="7" fill="#e2e8f0" stroke="${I}" stroke-width="2.5"/>
     <circle cx="${x+w*.35}" cy="${y+h*.21}" r="4" fill="#22d3ee"/><circle cx="${x+w*.65}" cy="${y+h*.21}" r="4" fill="#22d3ee"/><rect x="${x+w*.2}" y="${y+h*.85}" width="${w*.2}" height="${h*.15}" fill="#334155"/><rect x="${x+w*.6}" y="${y+h*.85}" width="${w*.2}" height="${h*.15}" fill="#334155"/>`;
   case 'books':return `<rect x="${x}" y="${y+h*.66}" width="${w}" height="${h*.34}" rx="2" fill="#ef4444" stroke="${I}" stroke-width="2"/><rect x="${x+4}" y="${y+h*.33}" width="${w-8}" height="${h*.33}" rx="2" fill="#3b82f6" stroke="${I}" stroke-width="2"/><rect x="${x+8}" y="${y}" width="${w-16}" height="${h*.33}" rx="2" fill="#22c55e" stroke="${I}" stroke-width="2"/>`;
   case 'clock':return `<circle cx="${x+w/2}" cy="${y+h/2}" r="${w/2}" fill="#fff" stroke="${I}" stroke-width="3"/><path d="M${x+w/2} ${y+h/2} V${y+h*.22} M${x+w/2} ${y+h/2} L${x+w*.72} ${y+h*.6}" stroke="${I}" stroke-width="2.5" stroke-linecap="round"/><circle cx="${x+w/2}" cy="${y+h/2}" r="2.5" fill="#ef4444"/>`;
  }return '';}
