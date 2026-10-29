/* ===== البداية ===== */
FX.init();
$('#back').onclick=()=>back();
$('#hgems').onclick=()=>go('closet');
$('#hhero').onclick=()=>go('closet');
if(!World.p.made)heroMaker(()=>{home();if(!T.intro)introComic(()=>{});});
else{home();if(!T.intro)introComic(()=>{});}
