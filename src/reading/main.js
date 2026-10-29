/* ===== البداية ===== */
FX.init();
$('#back').onclick=()=>back();
$('#hgems').onclick=()=>go('closet');
$('#hhero').onclick=()=>go('closet');
if(!World.p.made)heroMaker(()=>{home();if(!RS.intro)introComic(()=>{});});
else{home();if(!RS.intro)introComic(()=>{});}
