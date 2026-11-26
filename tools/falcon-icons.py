#!/usr/bin/env python3
"""صقر الكلمات: the home-screen icons and web app manifest of parts 2-6, made from part 1's icon with the part's
number on a gold badge.  usage: python3 tools/falcon-icons.py [N ...]   (default: 2 3 4 5 6)"""
import json, sys
from PIL import Image, ImageDraw, ImageFont
AD = '٠١٢٣٤٥٦٧٨٩'
SITE = 'https://kprpwd2wgn-ops.github.io/Rakan/'
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
for n in [int(a) for a in sys.argv[1:]] or [2, 3, 4, 5, 6]:
    for tag in ['v2', '32', '192', '512']:
        im = Image.open(f'word-falcon-icon-{tag}.png').convert('RGB')
        w = im.size[0]; d = ImageDraw.Draw(im)
        r = int(w * 0.2); cx, cy = int(w * 0.79), int(w * 0.79)       # a badge in the bottom corner
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(242, 182, 50), outline=(11, 59, 102), width=max(1, w // 40))
        f = ImageFont.truetype(FONT, int(r * 1.35))
        d.text((cx, cy + r * 0.05), AD[n], font=f, fill=(11, 59, 102), anchor='mm')
        im.save(f'word-falcon-{n}-icon-{tag}.png')
    name = 'صقر الكلمات ' + AD[n]
    json.dump({'name': name, 'short_name': name, 'start_url': f'{SITE}word-falcon-{n}.html', 'display': 'standalone',
               'background_color': '#cfe9ff', 'theme_color': '#0b3b66', 'lang': 'ar', 'dir': 'rtl',
               'icons': [{'src': f'{SITE}word-falcon-{n}-icon-192.png', 'sizes': '192x192', 'type': 'image/png'},
                         {'src': f'{SITE}word-falcon-{n}-icon-512.png', 'sizes': '512x512', 'type': 'image/png'}]},
              open(f'word-falcon-{n}.webmanifest', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print('icons and manifest for part', n)
