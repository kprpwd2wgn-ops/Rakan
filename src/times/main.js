/* ===== البداية ===== */
FX.init();
$('#back').onclick=()=>back();
$('#hgems').onclick=()=>go('closet');
$('#hhero').onclick=()=>go('closet');
if(!World.p.made)heroMaker(()=>{home();if(!G.intro)introComic(()=>go('battle',{node:0}));});
else home();
