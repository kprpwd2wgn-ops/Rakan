import sys, os, json
R=os.path.dirname(os.path.abspath(__file__)); O=os.path.dirname(R); B='https://kprpwd2wgn-ops.github.io/Rakan/'
KIT_JS=['kit/base.js','kit/fx.js','kit/voice.js','kit/hero.js']
APPS={
 'times':dict(file='times',title='أبطال جدول الضرب',short='جدول الضرب',theme='#3b2a78',bg='#f5ead2',
   fonts='family=Baloo+Bhaijaan+2:wght@400;600;800&family=Lalezar&family=Fredoka:wght@500;600',
   js=['times/data.js','times/tables.js','times/draw.js','times/map.js','times/battle.js','times/main.js'],css=['times/style.css']),
 'division':dict(file='division',title='قراصنة القسمة',short='قراصنة القسمة',theme='#0f4c75',bg='#d3eefa',
   fonts='family=Baloo+Bhaijaan+2:wght@400;600;800&family=Lalezar&family=Fredoka:wght@500;600',
   js=['division/data.js','division/secrets.js','division/draw.js','division/map.js','division/voyage.js','division/main.js'],css=['division/style.css']),
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
for n in (sys.argv[1:] or APPS): build(n)
