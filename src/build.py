import sys, os, json
R=os.path.dirname(os.path.abspath(__file__)); O=os.path.dirname(R); B='https://kprpwd2wgn-ops.github.io/Rakan/'
KIT_JS=['kit/base.js','kit/fx.js','kit/voice.js','kit/hero.js']
APPS={
 'times':dict(file='times',title='أبطال جدول الضرب',short='جدول الضرب',theme='#3b2a78',bg='#f5ead2',
   fonts='family=Baloo+Bhaijaan+2:wght@400;600;800&family=Lalezar&family=Fredoka:wght@500;600',
   js=['times/data.js','kit/clips.js','times/tables.js','times/draw.js','times/map.js','times/battle.js','times/main.js'],css=['times/style.css']),
 'division':dict(file='division',title='قراصنة القسمة',short='قراصنة القسمة',theme='#0f4c75',bg='#d3eefa',
   fonts='family=Baloo+Bhaijaan+2:wght@400;600;800&family=Lalezar&family=Fredoka:wght@500;600',
   js=['division/data.js','kit/clips.js','division/secrets.js','division/draw.js','division/map.js','division/voyage.js','division/main.js'],css=['division/style.css']),
 'talk':dict(file='talk-town',title='مدينة الكلام',short='مدينة الكلام',theme='#3b3f9e',bg='#fff4e4',
   fonts='family=Baloo+Bhaijaan+2:wght@400;600;800&family=Lalezar&family=Fredoka:wght@500;600',
   js=['talk/data.js','talk/mazes.js','talk/mazecore.js','talk/visits.js','talk/draw.js','talk/mic.js','talk/hub.js','talk/maze.js','talk/paint.js','talk/alien.js','talk/main.js'],css=['talk/style.css']),
 'reading':dict(file='reading-rocket',title='صاروخ القراءة',short='صاروخ القراءة',theme='#1e1b4b',bg='#eef0ff',
   fonts='family=Baloo+Bhaijaan+2:wght@400;600;800&family=Lalezar&family=Fredoka:wght@400;500;600',
   js=['reading/words.js','reading/data.js','reading/tales.js','reading/rooms.js','reading/draw.js','reading/reader.js','reading/hub.js','reading/monsters.js','reading/detective.js','reading/escape.js','reading/story.js','reading/main.js'],css=['reading/style.css']),
}
def build(name):
    a=APPS[name];rd=lambda f:open(os.path.join(R,f),encoding='utf-8').read()
    css=rd('kit/kit.css')+'\n'+''.join(rd(f) for f in a['css'])
    js="(function(){'use strict';\n"+'\n'.join(rd(f) for f in KIT_JS+a['js'])+"\n})();"
    N=a['file']
    html=f'''<!DOCTYPE html>
<html lang="ar" dir="rtl"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{a['title']}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="apple-touch-icon" sizes="180x180" href="{B}{N}-icon-v2.png">
<link rel="apple-touch-icon-precomposed" sizes="180x180" href="{B}{N}-icon-v2.png">
<link rel="icon" type="image/png" sizes="32x32" href="{B}{N}-icon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="{B}{N}-icon-192.png">
<link rel="manifest" href="{B}{N}.webmanifest">
<meta property="og:title" content="{a['title']}">
<meta property="og:type" content="website">
<meta property="og:url" content="{B}{N}.html">
<meta property="og:image" content="{B}{N}-icon-v2.png">
<meta name="twitter:card" content="summary">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="{a['short']}">
<meta name="theme-color" content="{a['theme']}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{a['fonts']}&display=swap">
<style>{css}</style>
</head><body>
<header class="hdr"><div class="hdr-in"><button class="back" id="back" aria-label="رجوع" hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg></button><div class="ttl" id="ttl"></div><button class="gems" id="hgems" aria-label="جواهري"></button><button class="mini" id="hhero" aria-label="بطلي"></button></div></header>
<main class="wrap" id="view"></main>
<div class="toasts" id="toasts" aria-live="polite"></div><canvas id="fx" aria-hidden="true"></canvas>
<script>{js}</script>
</body></html>
'''
    open(os.path.join(O,N+'.html'),'w',encoding='utf-8').write(html)
    print('built',N,len(html))

# ---- Ollie English parts: python3 src/build.py ollie  ->  2.html ... 7.html (part N is file N+1) ----
# One engine and one stylesheet for the six parts; each part has its own lessons (src/ollie/data/part<N>.js)
# and its own home-screen icon (src/ollie/icons/part<N>.png). Unlike the games above they do not use the kit.
OLLIE_PARTS=6
OLLIE_PAGE='''<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>أولي · الجزء @N@</title>
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="أولي @N@">
<meta name="theme-color" content="#EDF4F9">

<link rel="apple-touch-icon" sizes="180x180" href="data:image/png;base64,@ICON@">
<link rel="icon" type="image/png" sizes="180x180" href="data:image/png;base64,@ICON@">
<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Andika:wght@400;700&family=Baloo+Bhaijaan+2:wght@500;600;700;800&display=swap">
<style>
@CSS@</style>

<div id="app"></div>
<div id="toast" hidden></div>
<canvas id="fx"></canvas>

<script>
/* Built by `python3 src/build.py ollie` from src/ollie/. Change the files there, not this page. */
@DATA@
@ENGINE@</script>
</body>
</html>
'''
def ollie_says(engine):
    """Sentences Ollie says outside the lessons (the SAY block of the engine), split the way the page splits them."""
    import re
    block=engine[engine.index('/*SAY-START*/'):engine.index('/*SAY-END*/')]
    out=[]
    for line in re.findall(r'"((?:[^"\\]|\\.)*)"',block):
        out+= [x.strip() for x in re.findall(r"[^.!?]+[.!?]*['\"]?",line) if x.strip()] or [line]
    return out
def build_ollie():
    import base64,hashlib
    S=os.path.join(R,'ollie');rd=lambda f:open(os.path.join(S,f),encoding='utf-8').read()
    css,engine=rd('style.css'),rd('engine.js');says=ollie_says(engine);V=os.path.join(O,'ollie','voices')
    for n in range(1,OLLIE_PARTS+1):
        # Ollie's own lines must be in this part's clip map; a line recorded for another part is added here
        mp=os.path.join(V,f'part{n}.json');m=json.load(open(mp,encoding='utf-8'));added=[]
        for t in says:
            if t in m['s']: continue
            cid=hashlib.sha1(t.encode()).hexdigest()[:12]
            if not os.path.exists(os.path.join(V,cid+'.mp3')): sys.exit(f'ollie: no recorded clip for "{t}". Add it to ollie-lines.json and run tools/english-voices.py first.')
            m['s'][t]=cid;added.append(t)
        if added: open(mp,'w',encoding='utf-8').write(json.dumps(m,ensure_ascii=False,separators=(',',':')))
        icon=base64.b64encode(open(os.path.join(S,'icons',f'part{n}.png'),'rb').read()).decode()
        html=OLLIE_PAGE.replace('@N@',str(n)).replace('@ICON@',icon).replace('@CSS@',css).replace('@DATA@',rd(f'data/part{n}.js')).replace('@ENGINE@',engine)
        open(os.path.join(O,f'{n+1}.html'),'w',encoding='utf-8').write(html)
        print('built',f'{n+1}.html','(Ollie part %d)'%n,len(html),('· clip map +%d lines'%len(added)) if added else '')
for n in (sys.argv[1:] or list(APPS)+['ollie']): build_ollie() if n=='ollie' else build(n)
