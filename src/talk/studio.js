/* ===== استوديو ليو: أنت المذيع، وتسأل ليو أسئلة بالإنجليزية =====
   كل حلقة ٥ بطاقات. ar: ماذا تسأل (بالعربية فقط، فالطفل يصنع السؤال بنفسه) · re: يكفي لفهم السؤال
   full: سؤال كامل صحيح (النجمة الثالثة) · model: سؤال نموذجي يظهر للمساعدة · ans: جواب ليو · fx: ماذا يحدث */
const SHOWS=[
 {ar:'أول مقابلة',e:'🎙️',q:[
  {ar:'اسأل ليو عن اسمه',e:'🏷️',re:/\bname\b/,full:/\bwhat is your name\b/,model:'What is your name?',ans:['My name is Leo. Leo from planet Zoom!','اسمي ليو. ليو من كوكب زووم!'],fx:'sign:👋 Leo'},
  {ar:'اسأله عن عمره',e:'🎂',re:/\bhow old\b|\bage\b/,full:/\bhow old are you\b/,model:'How old are you?',ans:['I am three hundred years old!','عمري ثلاثمئة سنة!'],fx:'sign:🎂 300'},
  {ar:'اسأله من أين هو',e:'🌍',re:/\bwhere\b.*\b(from|live)\b|\bfrom where\b/,full:/\bwhere are you from\b|\bwhere do you live\b/,model:'Where are you from?',ans:['I am from planet Zoom. It is very far!','أنا من كوكب زووم. إنه بعيد جداً!'],fx:'sign:🪐 Zoom'},
  {ar:'اسأله عن لونه المفضّل',e:'🎨',re:/\bcolou?r\b/,full:/\bwhat is your favou?rite colou?r\b/,model:'What is your favorite color?',ans:['My favorite color is purple!','لوني المفضّل البنفسجي!'],fx:'color:#a855f7'},
  {ar:'اسأله: كيف حالك؟',e:'😊',re:/\bhow are you\b|\bhow do you feel\b|\bare you (ok|okay|fine|happy|good)\b/,full:/\bhow are you\b|\bhow do you feel\b/,model:'How are you?',ans:['I am super happy! Thank you for asking.','أنا سعيد جداً! شكراً لسؤالك.'],fx:'jump'}]},
 {ar:'طعام ليو',e:'🍕',q:[
  {ar:'اسأله ماذا يأكل',e:'🍽️',re:/\beat\b/,full:/\bwhat do you eat\b/,model:'What do you eat?',ans:['I eat moon rocks and star cheese!','آكل صخور القمر وجبن النجوم!'],fx:'eat:🧀'},
  {ar:'اسأله: هل تحب البيتزا؟',e:'🍕',re:/\bpizza\b/,full:/\bdo you (like|love) pizza\b/,model:'Do you like pizza?',ans:['Pizza? Yes! I love Earth pizza!','بيتزا؟ نعم! أحب بيتزا الأرض!'],fx:'eat:🍕'},
  {ar:'اسأله عن أكلته المفضّلة',e:'🍲',re:/\bfood\b/,full:/\bwhat is your favou?rite food\b/,model:'What is your favorite food?',ans:['My favorite food is space soup. It is blue!','أكلتي المفضّلة شوربة الفضاء. إنها زرقاء!'],fx:'show:🍲'},
  {ar:'اسأله ماذا يشرب',e:'🥤',re:/\bdrink\b/,full:/\bwhat do you drink\b/,model:'What do you drink?',ans:['I drink cloud juice!','أشرب عصير الغيوم!'],fx:'eat:🧃'},
  {ar:'اسأله: هل أنت جائع؟',e:'😋',re:/\bhungry\b/,full:/\bare you hungry\b/,model:'Are you hungry?',ans:['Yes! I am always hungry. Yum yum!','نعم! أنا جائع دائماً. ممم!'],fx:'jump'}]},
 {ar:'كوكب زووم',e:'🪐',q:[
  {ar:'اسأله: هل كوكبك كبير؟',e:'🪐',re:/\bplanet\b.*\b(big|small|large)\b|\b(big|small|large)\b.*\bplanet\b/,full:/\bis your planet (big|small|large)\b/,model:'Is your planet big?',ans:['No, it is very small. I can walk around it in one day!','لا، إنه صغير جداً. أستطيع أن أمشي حوله في يوم واحد!'],fx:'show:🪐'},
  {ar:'اسأله: هل الجو حار أم بارد هناك؟',e:'🌡️',re:/\b(hot|cold|warm|weather)\b/,full:/\bis it (hot|cold|warm)\b|\bwhat is the weather\b/,model:'Is it hot or cold?',ans:['It is very cold! It snows every day.','الجو بارد جداً! الثلج ينزل كل يوم.'],fx:'snow'},
  {ar:'اسأله: كم شمساً عندكم؟',e:'☀️',re:/\bsuns?\b/,full:/\bhow many suns\b/,model:'How many suns do you have?',ans:['We have three suns! It is never dark.','عندنا ثلاث شموس! لا يأتي الظلام أبداً.'],fx:'sign:☀️☀️☀️'},
  {ar:'اسأله: هل عندكم حيوانات؟',e:'🐾',re:/\banimals?\b|\bpets?\b/,full:/\bdo you have (any )?(animals|pets|a pet)\b|\bare there (any )?animals\b/,model:'Do you have animals?',ans:['Yes! We have flying fish and pink cats.','نعم! عندنا سمك طائر وقطط وردية.'],fx:'fly:🐟'},
  {ar:'اسأله: هل أستطيع زيارة كوكبك؟',e:'🚀',re:/\bvisit\b|\bcome\b|\bgo\b/,full:/\bcan i (visit|come|go)\b/,model:'Can I visit your planet?',ans:['Of course! You are always welcome.','بالتأكيد! أنت مرحّب بك دائماً.'],fx:'party'}]},
 {ar:'عائلة ليو',e:'🏠',q:[
  {ar:'اسأله: هل عندك إخوة؟',e:'👦',re:/\b(brothers?|sisters?|siblings?)\b/,full:/\bdo you have (any )?(brothers|sisters|a brother|a sister|siblings)\b/,model:'Do you have brothers or sisters?',ans:['Yes! I have five brothers and one sister.','نعم! عندي خمسة إخوة وأخت واحدة.'],fx:'sign:👽👽👽👽👽👽'},
  {ar:'اسأله عن اسم أمّه',e:'👩',re:/\b(mom|mother|mum|mommy|mama)\b/,full:/\bwhat is your (mom|mother|mum|mommy|mama)( is)? name\b|\bwhat is the name of your (mom|mother)\b/,model:"What is your mom's name?",ans:['Her name is Lula. She is very kind.','اسمها لولا. إنها طيبة جداً.'],fx:'hearts'},
  {ar:'اسأله: من صديقك المفضّل؟',e:'🤝',re:/\bfriends?\b/,full:/\bwho is your best friend\b|\bdo you have (a |any )?friends?\b/,model:'Who is your best friend?',ans:['You are my best friend on Earth!','أنت أفضل صديق لي على الأرض!'],fx:'hearts'},
  {ar:'اسأله: أين تعيش عائلتك؟',e:'🏡',re:/\bwhere\b.*\b(family|live|house|home)\b/,full:/\bwhere does your family live\b|\bwhere do you live\b|\bwhere is your (house|home)\b/,model:'Where does your family live?',ans:['We live in a round house on a big rock.','نعيش في بيت مستدير على صخرة كبيرة.'],fx:'show:🏠'},
  {ar:'اسأله: هل تحب عائلتك؟',e:'❤️',re:/\b(love|like)\b.*\bfamily\b/,full:/\bdo you (love|like) your family\b/,model:'Do you love your family?',ans:['Yes, very much! Family is the best.','نعم، كثيراً! العائلة هي الأفضل.'],fx:'hearts'}]},
 {ar:'ماذا يستطيع ليو؟',e:'💪',q:[
  {ar:'اسأله: هل تستطيع الطيران؟',e:'🕊️',re:/\bfly\b/,full:/\bcan you fly\b/,model:'Can you fly?',ans:['Yes, I can! Look at me!','نعم أستطيع! انظر إليّ!'],fx:'jump'},
  {ar:'اسأله: هل تستطيع السباحة؟',e:'🏊',re:/\bswim\b/,full:/\bcan you swim\b/,model:'Can you swim?',ans:['No, I can not. The water on Zoom is very cold!','لا، لا أستطيع. الماء في زووم بارد جداً!'],fx:'sad'},
  {ar:'اسأله: هل تستطيع القراءة؟',e:'📖',re:/\bread\b/,full:/\bcan you read\b/,model:'Can you read?',ans:['Yes! I read space books every night.','نعم! أقرأ كتب الفضاء كل ليلة.'],fx:'show:📚'},
  {ar:'اسأله: هل تتكلم العربية؟',e:'🗣️',re:/\barabic\b/,full:/\b(can|do) you speak arabic\b/,model:'Can you speak Arabic?',ans:['A little! Marhaba! Shukran!','قليلاً! مرحبا! شكراً!'],fx:'jump'},
  {ar:'اسأله: هل تستطيع أن تقفز عالياً؟',e:'🦘',re:/\bjump\b/,full:/\bcan you jump\b/,model:'Can you jump high?',ans:['Watch this! Boing, boing!','شاهد هذا! بوينغ، بوينغ!'],fx:'jump'}]},
 {ar:'يوم ليو',e:'⏰',q:[
  {ar:'اسأله: متى تستيقظ؟',e:'⏰',re:/\bwake\b|\bget up\b/,full:/\b(what time|when) do you (wake up|get up)\b/,model:'What time do you wake up?',ans:["I wake up at five o'clock. Very early!",'أستيقظ الساعة الخامسة. مبكراً جداً!'],fx:'sign:⏰ 5'},
  {ar:'اسأله: ماذا تفعل في الصباح؟',e:'🌅',re:/\bmorning\b/,full:/\bwhat do you do in the morning\b/,model:'What do you do in the morning?',ans:['I brush my three teeth and eat breakfast.','أفرّش أسناني الثلاثة وآكل الفطور.'],fx:'show:🪥'},
  {ar:'اسأله: هل تذهب إلى المدرسة؟',e:'🏫',re:/\bschool\b/,full:/\bdo you go to school\b/,model:'Do you go to school?',ans:['Yes! I go to Space School. I like math.','نعم! أذهب إلى مدرسة الفضاء. أحب الرياضيات.'],fx:'show:🏫'},
  {ar:'اسأله: ماذا تفعل بعد المدرسة؟',e:'⚽',re:/\bafter school\b/,full:/\bwhat do you do after school\b/,model:'What do you do after school?',ans:['I play moon ball with my friends!','ألعب كرة القمر مع أصدقائي!'],fx:'show:⚽'},
  {ar:'اسأله: متى تنام؟',e:'😴',re:/\bsleep\b|\bbed\b/,full:/\b(what time|when) do you (go to bed|go to sleep|sleep)\b/,model:'What time do you go to bed?',ans:["At nine o'clock. Good night!",'الساعة التاسعة. تصبح على خير!'],fx:'night'}]},
 {ar:'سفينة ليو',e:'🛸',q:[
  {ar:'اسأله: أين سفينتك؟',e:'🛸',re:/\b(spaceship|ship|rocket|ufo)\b/,full:/\bwhere is your (spaceship|ship|rocket|ufo)\b/,model:'Where is your spaceship?',ans:['It is on the roof! Shhh, it is a secret.','إنها على السطح! شششش، هذا سر.'],fx:'ufo'},
  {ar:'اسأله عن لون سفينته',e:'🎨',re:/\bcolou?r\b/,full:/\bwhat colou?r is (it|your (spaceship|ship|rocket))\b/,model:'What color is it?',ans:['It is silver with green lights.','إنها فضية وفيها أضواء خضراء.'],fx:'sign:🛸✨'},
  {ar:'اسأله: هل هي سريعة؟',e:'💨',re:/\b(fast|quick|speed)\b/,full:/\bis it fast\b|\bhow fast is it\b/,model:'Is it fast?',ans:['Very fast! Zoom! Faster than light!','سريعة جداً! زووم! أسرع من الضوء!'],fx:'fly:🛸'},
  {ar:'اسأله: هل أستطيع أن آتي معك؟',e:'🙋',re:/\bcan i\b|\b(ride|come|go)\b/,full:/\bcan i (come|ride|go|fly)\b/,model:'Can I come with you?',ans:['Yes! Put on your space helmet!','نعم! البس خوذة الفضاء!'],fx:'party'},
  {ar:'اسأله: إلى أين سنذهب؟',e:'🗺️',re:/\bwhere\b/,full:/\bwhere (are we going|do we go|can we go|will we go|are you going)\b/,model:'Where are we going?',ans:["To the moon! Let's have a picnic!",'إلى القمر! لنتنزّه هناك!'],fx:'night'}]},
 {ar:'أشياء ليو المفضّلة',e:'⭐',q:[
  {ar:'اسأله عن رياضته المفضّلة',e:'🏀',re:/\bsports?\b/,full:/\bwhat is your favou?rite sport\b/,model:'What is your favorite sport?',ans:['Space football! We play with a little moon.','كرة القدم الفضائية! نلعب بقمر صغير.'],fx:'show:⚽'},
  {ar:'اسأله عن حيوانه المفضّل',e:'🐱',re:/\banimal\b/,full:/\bwhat is your favou?rite animal\b/,model:'What is your favorite animal?',ans:['I love Earth cats. They say meow!','أحب قطط الأرض. إنها تقول مياو!'],fx:'show:🐱'},
  {ar:'اسأله: هل تحب الكتب؟',e:'📚',re:/\bbooks?\b|\breading\b/,full:/\bdo you (like|love) (books|reading|to read)\b/,model:'Do you like books?',ans:['Yes! My favorite book is about Earth kids.','نعم! كتابي المفضّل عن أطفال الأرض.'],fx:'show:📘'},
  {ar:'اسأله عن لعبته المفضّلة',e:'🎲',re:/\b(game|toy)\b/,full:/\bwhat is your favou?rite (game|toy)\b/,model:'What is your favorite game?',ans:['Hide and seek! I always win, because I can be invisible!','الغميضة! أفوز دائماً، لأنني أستطيع أن أختفي!'],fx:'hide'},
  {ar:'اسأله: ماذا تحب في الأرض؟',e:'🌍',re:/\bearth\b/,full:/\bwhat do you (like|love) (about|on) earth\b/,model:'What do you like about Earth?',ans:['I like the blue sea, the green trees, and you!','أحب البحر الأزرق والأشجار الخضراء، وأحبك أنت!'],fx:'hearts'}]}
];
const QWORDS=new Set('what where when who why how which do does did can could is are am you your yours i me my favorite favourite old name like love eat drink have go come visit fly swim read speak jump wake sleep bed school morning after family friend best mom mother brother sister planet big small hot cold many sun suns animals pets food pizza hungry color colour sport animal game toy books earth ship spaceship fast arabic time live from'.split(' '));

def('studio',si=>{
  const SH=SHOWS[si],N=SH.q.length;let qi=0,tries=0,bonus=false,busy=false,alive=true,scores=[],fulls=0,col='#a3e635',mood='happy',held=null,newW=0;
  setTitle(`🎙️ ${SH.ar}`);
  $('#view').innerHTML=`<div class="st">
    <div class="adots" id="sd"></div>
    <div class="sstage" id="ss"><div class="sonair" id="son">ON AIR</div><div class="slights"></div>
      <div class="scouch">${couchSVG()}</div><div class="zw sz" id="zw"></div>
      <div class="shost">${heroSVG(World.p.hero,{face:'happy'})}<span class="smic">🎤</span></div>
      <div class="scam">🎥</div><div class="afx" id="afx"></div><div class="asign" id="asg" hidden></div></div>
    <div class="scard" id="sc"></div>
    <div class="ans" id="ans" hidden></div>
    <div id="mic"></div></div>`;
  onClean(()=>{alive=false;});
  function zib(){$('#zw').innerHTML=zibSVG({col,mood})+(held?`<span class="zheld">${held}</span>`:'');}
  let mt=0;function setMood(m,ms){mood=m;zib();clearTimeout(mt);if(ms)mt=setTimeout(()=>{if(alive){mood='happy';zib();}},ms);}
  function dots(){$('#sd').innerHTML=SH.q.map((_,k)=>`<i class="${k<qi?'done':k===qi?'on':''}">${k<qi?'★':''}</i>`).join('');}
  function sign(h){const s=$('#asg');s.innerHTML=h;s.hidden=false;s.classList.remove('pop');void s.offsetWidth;s.classList.add('pop');}
  function particles(list,cls,n=14){const fx=$('#afx');for(let k=0;k<n;k++){const e=document.createElement('span');e.className='ptc '+cls;e.textContent=pick([].concat(list));
      e.style.left=(Math.random()*92+2)+'%';e.style.animationDelay=(Math.random()*1.2)+'s';e.style.fontSize=(16+Math.random()*16)+'px';fx.appendChild(e);setTimeout(()=>e.remove(),4200);}}
  function fx(f){const [k,a]=(f||'').split(/:(.*)/);const st=$('#ss');
    switch(k){
      case 'sign':sign(esc(a));sfx('sparkle');break;
      case 'color':col=a;zib();{const [x,y]=centerOf($('#zw'));FX.burst(x,y,{n:30,colors:[a,'#fff',a]});}sfx('sparkle');break;
      case 'show':held=a;zib();sfx('pop');break;
      case 'eat':{const e=document.createElement('span');e.className='ptc eat';e.textContent=a;$('#afx').appendChild(e);setTimeout(()=>e.remove(),1300);setTimeout(()=>{if(alive){setMood('chew',1600);sfx('pop');}},900);break;}
      case 'jump':{const z=$('#zw');z.classList.remove('jump');void z.offsetWidth;z.classList.add('jump');setMood('laugh',1800);sfx('whoosh');break;}
      case 'hearts':particles(['❤️','💕','💖'],'rise',16);sfx('sparkle');break;
      case 'party':FX.confetti();particles(['🎈','🎉','⭐'],'rise',14);sfx('win');break;
      case 'night':st.classList.add('night');sign('🌙');break;
      case 'snow':particles(['❄️'],'fall',22);break;
      case 'fly':case 'ufo':{const e=document.createElement('span');e.className='ptc flyby';e.textContent=a||'🛸';$('#afx').appendChild(e);setTimeout(()=>e.remove(),3200);sfx('whoosh');break;}
      case 'sad':setMood('sad',2200);break;
      case 'hide':{const z=$('#zw');z.classList.add('ghost');setTimeout(()=>{if(alive)z.classList.remove('ghost');},1800);sfx('whoosh');break;}}}
  function card(){const c=SH.q[qi];$('#sc').innerHTML=`<span class="sce">${c.e}</span><div class="sct"><small>📝 سؤالك ${D(qi+1)} من ${D(N)}</small><b>${c.ar}</b><span>قلها بالإنجليزية بنفسك! 🎤</span></div>`;
    $('#sc').classList.remove('pop');void $('#sc').offsetWidth;$('#sc').classList.add('pop');}
  function ask(){tries=0;bonus=false;busy=false;$('#ans').hidden=true;dots();card();mic.lock(false);held=null;$('#ss').classList.remove('night');$('#asg').hidden=true;zib();}
  function show(r,stars,note,model,rep){const a=$('#ans');
    a.innerHTML=`${stars?`<div class="arow">${starRow(stars)}<b>${['','تكلّمت بالإنجليزية 👍','فهم ليو سؤالك! 👏','سؤال كامل! 🌟'][stars]}</b></div>`:''}
      <p class="en said">“${esc(r)}”</p>
      ${rep?`<div class="zrep sans"><button class="mini2" id="srep" aria-label="اسمع">🔊</button><div><b class="en">${esc(rep[0])}</b><span>${rep[1]}</span></div></div>`:''}
      ${note?`<p class="note">${note}</p>`:''}
      ${model?`<p class="better">✨ اسأله كاملاً: <span class="en">${esc(model)}</span> <button class="mini2" id="bsay" aria-label="اسمع">🔊</button>${stars===2?'<br><small>اضغط 🎤 واسأل السؤال كاملاً لتربح نجمة إضافية!</small>':''}</p>`:''}
      ${stars?`<button class="btn gold big wide" id="anext">${qi<N-1?'السؤال التالي ←':'🏁 نهاية الحلقة'}</button>`:''}`;
    a.hidden=false;if($('#srep'))$('#srep').onclick=()=>zibSay(rep[0]);if($('#bsay'))$('#bsay').onclick=()=>sayEn(model,{rate:.85});if($('#anext'))$('#anext').onclick=next;
    setTimeout(()=>{if(alive&&!a.hidden)a.scrollIntoView({behavior:REDUCED?'auto':'smooth',block:'nearest'});},60);}
  function next(){stopSpeak();sfx('tap');qi++;if(qi>=N)return finish();ask();}
  function onText(r){if(busy)return;const c=SH.q[qi];
    let best=null;for(const a of (r.alts&&r.alts.length?r.alts:[r.text])){const t=normS(a);const m={raw:a,t,rel:c.re.test(t),full:c.full.test(t)};if(!best||(m.full&&!best.full)||(m.rel&&!best.rel))best=m;if(m.full)break;}
    if(!best||!best.t){mic.say('لم أسمع كلمات إنجليزية… جرّب مرة أخرى');sfx('no');return;}
    const ws=best.t.split(' ').filter(w=>QWORDS.has(w)||ALLW.has(w));newW+=learnWords(ws);
    if(bonus){if(best.full){scores[qi]=3;fulls++;T.full++;tsave();bonus=false;sfx('win');const [x,y]=centerOf($('#ans'));FX.burst(x,y,{n:24});zibSay('What a great question!');
        show(best.raw,3,'⭐ رائع! سؤال كامل.',null,['What a great question!','يا له من سؤال رائع!']);}
      else{sfx('no');zibSay(c.model,{rate:.85});show(best.raw,scores[qi],`حاول أن تقول: <span class="en">${esc(c.model)}</span>`,null,null);}return;}
    if(!best.rel&&tries<2){tries++;sfx('no');setMood('wow',1800);
      if(tries===1){zibSay("Hmm? Can you ask me again?");show(best.raw,0,'همم؟ لم يفهم ليو سؤالك. اسأله مرة أخرى بطريقة أخرى!');}
      else{zibSay('You can ask: '+c.model,{rate:.85});show(best.raw,0,`💡 مثلاً: <span class="en">${esc(c.model)}</span>`);}return;}
    busy=true;mic.lock(true);const stars=best.rel?(best.full?3:2):1;scores[qi]=stars;if(stars===3){fulls++;T.full++;}tsave();
    sfx(stars===3?'ok':'pop');setMood('talk');
    zibSay(c.ans[0],{onend:()=>{if(alive&&mood==='talk')setMood('happy');}});fx(c.fx);
    show(best.raw,stars,stars===1?'ليو أجاب على أي حال! في المرة القادمة اسأله السؤال نفسه.':null,stars<3?c.model:null,c.ans);
    if(stars===2){bonus=true;busy=false;mic.lock(false);}}
  function finish(){busy=true;mic.lock(true);const tot=scores.reduce((a,b)=>a+(b||0),0),pct=tot/(3*N),stars=pct>=.85?3:pct>=.6?2:1;
    T.studio[si]=Math.max(T.studio[si]||0,stars);tsave();zibSay('Thank you for the interview! You are a great reporter!');sfx('win');
    const hasNext=si+1<SHOWS.length;
    resultOv({title:'🎙️ مقابلة رائعة!',stars,gems:Math.round(tot/2)+stars*2,
      lines:[`🌟 أسئلة كاملة: ${D(fulls)} من ${D(N)}`,newW?`📚 كلمات جديدة: ${D(newW)}`:'',stars<3?'اسأل أسئلة كاملة لتحصل على ٣ نجوم':'مذيع رائع! 👑'],
      btns:[...(hasNext?[{label:'الحلقة التالية ←',cls:'gold big',fn:()=>go('studio',si+1,false)}]:[]),{label:'🔁 مرة أخرى',cls:'ghost',fn:()=>rerender()},{label:'🏙️ المدينة',cls:'ghost',fn:()=>home()}]});}
  const mic=micBar($('#mic'),{onText,hint:'اضغط 🎤 واسأل ليو سؤالك بالإنجليزية',onHelp:()=>{const c=SH.q[qi];sayEn(c.model,{rate:.85});
    show('…',0,`💡 مثال: <span class="en">${esc(c.model)}</span><br>اسأله بصوتك!`);}});
  zib();ask();setTimeout(()=>{if(alive&&qi===0){setMood('talk');zibSay(si===0?"Hi! Welcome to my TV show! You are the reporter. Ask me anything!":"Hello again, reporter! I am ready for your questions.",{onend:()=>{if(alive&&mood==='talk')setMood('happy');}});}},400);
});
function couchSVG(){return `<svg viewBox="0 0 200 80" aria-hidden="true"><rect x="12" y="66" width="10" height="12" fill="#4b2e14"/><rect x="178" y="66" width="10" height="12" fill="#4b2e14"/>
  <rect x="18" y="8" width="164" height="44" rx="16" fill="#e11d48" stroke="#1d2433" stroke-width="3"/><rect x="8" y="40" width="184" height="30" rx="12" fill="#e11d48" stroke="#1d2433" stroke-width="3"/>
  <rect x="2" y="26" width="22" height="46" rx="10" fill="#be123c" stroke="#1d2433" stroke-width="3"/><rect x="176" y="26" width="22" height="46" rx="10" fill="#be123c" stroke="#1d2433" stroke-width="3"/>
  <path d="M30 40 H170" stroke="rgba(255,255,255,.3)" stroke-width="4" stroke-linecap="round"/></svg>`;}
