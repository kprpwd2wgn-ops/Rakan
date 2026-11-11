// Plays an Ollie English part in headless Chromium the way a child would: all 19 games on a few lessons,
// then a whole lesson (conversation, listening, reading, game), a world challenge, the daily challenge,
// the album, the dictionary, the parents corner, the flashcards, the library, the one-minute rush and the wardrobe.
// Reports script errors and clips that failed to load.
// The page is served from a small local server, because the recorded voice does not load from file://.
// usage: node tools/ollie-play.js [part 1-12, default 1] [games|flow|all, default all] [folder for screenshots]
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const part = +(process.argv[2] || 1), mode = process.argv[3] || 'all', shots = process.argv[4];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const TYPES = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.mp3': 'audio/mpeg', '.png': 'image/png' };

(async () => {
  const server = http.createServer((req, res) => {
    const file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}/`;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 2, hasTouch: true });
  const errors = [], clips = new Set();
  page.on('pageerror', e => errors.push('script error: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); });
  page.on('requestfailed', r => { if (!/fonts\.g/.test(r.url())) errors.push('request failed: ' + r.url()); });
  page.on('response', r => { if (r.url().endsWith('.mp3')) { clips.add(r.url()); if (r.status() !== 200) errors.push(`clip ${r.status()}: ${r.url()}`); } });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());   // no web fonts needed for the check
  await page.addInitScript(() => {
    window.__spoken = 0;   // clips that actually started playing (the noise used for sound effects is not counted)
    const start = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function (...a) { if (typeof VO !== 'undefined' && this.buffer !== VO.noise) window.__spoken++; return start.apply(this, a); };
  });
  await page.goto(base + (part <= 6 ? (part + 1) + '.html' : 'ollie-' + part + '.html'));
  await page.waitForSelector('.world');
  // what Ollie was asked to say, in order (the "remember the order" bot reads the words back from here)
  const listen = () => page.evaluate(() => { window.__said = []; const real = say; window.say = function (t, o) { window.__said.push(t); return real(t, o); }; });
  await listen();
  const log = (...a) => console.log(`[part ${part}]`, ...a);
  const shot = async name => { if (shots) await page.screenshot({ path: path.join(shots, `part${part}-${name}.png`) }); };
  const done = () => page.waitForSelector('.result', { timeout: 25000 });
  const round = (r, extra = 'true') => page.waitForFunction(`document.querySelector('#g .tip').textContent.includes('(${r + 1} من') && (${extra})`, null, { timeout: 20000 });
  const wordOf = () => page.evaluate(() => V(GL).find(v => v.em === document.querySelector('#g .clue .big-em').textContent).en);

  // each bot plays one game perfectly (the missing-word and balloon bots make one mistake on purpose)
  const bots = {
    async match() { for (let k = 0; k < await page.locator('#g .wd').count(); k++) { await page.click(`#g .wd[data-k="${k}"]`); await page.click(`#g .em[data-k="${k}"]`); await sleep(60); } },
    async memory() {
      const pairs = await page.evaluate(() => { const g = {}; document.querySelectorAll('#g .card').forEach((c, n) => { const t = c.querySelector('.front').textContent, v = V(GL).find(x => x.en === t || x.em === t); (g[v.en] = g[v.en] || []).push(n); }); return Object.values(g); });
      for (const [a, b] of pairs) { await page.click(`#g .card[data-n="${a}"]`); await page.click(`#g .card[data-n="${b}"]`); await sleep(80); }
    },
    async listen() { for (let r = 0; r < 6; r++) { await round(r); await page.evaluate(() => { const en = document.querySelector('#g .play').dataset.say; [...document.querySelectorAll('#g .tile')].find(t => t.dataset.en === en).click(); }); await sleep(820); } },
    async hide() {
      for (let r = 0; r < 6; r++) {
        await page.waitForFunction(r => document.querySelector('#pr').textContent.startsWith((r + 1) + ' /'), r, { timeout: 20000 });
        await page.waitForFunction(() => { const em = V(GL).find(v => v.en === document.querySelector('#tg .play').dataset.say).em, b = [...document.querySelectorAll('#bs .bush.up')].find(b => b.querySelector('.peek').textContent === em); if (b) b.click(); return !!b; }, null, { timeout: 25000, polling: 50 });
        await sleep(900);
      }
    },
    async tf() {
      for (let r = 0; r < 10; r++) {
        await round(r, `!document.querySelector('#ty.right,#ty.wrong,#tn.right,#tn.wrong')`);
        const ok = await page.evaluate(() => V(GL).find(v => v.em === document.querySelector('.tfc .big-em').textContent).en === document.querySelector('.tfw').textContent);
        await page.click(ok ? '#ty' : '#tn');
      }
    },
    async pop() {
      for (let r = 0; r < 8; r++) {
        await page.waitForFunction(r => document.querySelector('#pr').textContent.startsWith((r + 1) + ' /'), r, { timeout: 20000 });
        await page.waitForFunction(() => { const en = V(GL).find(v => v.em === document.querySelector('#tg .big-em').textContent).en, b = [...document.querySelectorAll('#fd .bubble')].find(b => b.textContent === en && !b.classList.contains('popped')); if (!b) return false; const q = b.getBoundingClientRect(), f = document.querySelector('#fd').getBoundingClientRect(); if (q.top < f.bottom - 30) { b.click(); return true; } return false; }, null, { timeout: 25000, polling: 50 });
        await sleep(700);
      }
    },
    async fly() {
      for (let r = 0; r < 8; r++) {
        await page.waitForFunction(r => document.querySelector('#pr').textContent.startsWith((r + 1) + ' /') && document.querySelectorAll('#sky .cloud').length === 3 && !document.querySelector('#sky .cloud.right'), r, { timeout: 20000 });
        const lane = await page.evaluate(() => { const en = V(GL).find(v => v.em === document.querySelector('#tg .big-em').textContent).en; return [...document.querySelectorAll('#sky .cloud')].findIndex(c => c.textContent === en); });
        const box = await page.locator('#sky').boundingBox(), x = box.x + (lane + .5) * box.width / 3, y = box.y + box.height / 2;
        await page.mouse.click(x, y); await sleep(120); await page.mouse.click(x, y);        // second tap speeds the clouds up
        await page.waitForSelector('#sky .cloud.right', { timeout: 15000 });
      }
    },
    async unscramble() {
      for (let r = 0; r < await page.evaluate(() => Math.min(5, wordsFor.unscramble(GL).length)); r++) {
        await round(r, `!document.querySelector('#sl.ok')`);
        for (const ch of (await wordOf()).toLowerCase()) await page.locator('#tl .ltr:not([disabled])').filter({ hasText: new RegExp('^' + ch + '$') }).first().click();
      }
    },
    async balloons() {
      for (let r = 0; r < await page.evaluate(() => Math.min(4, wordsFor.balloons(GL).length)); r++) {
        await round(r, `!document.querySelector('#sl.ok')`);
        const word = (await wordOf()).toLowerCase();
        if (r === 0) await page.click(`#g .key[data-c="${'qxzjv'.split('').find(c => !word.includes(c))}"]`);
        for (const ch of new Set(word.replace(/[^a-z]/g, ''))) await page.click(`#g .key[data-c="${ch}"]`);
      }
    },
    async search() {
      const list = await page.evaluate(() => wordsFor.search(GL).map(v => v.en.toUpperCase()));
      const grid = await page.$$eval('#wg .wc', cs => cs.map(c => c.textContent)), N = 8, at = (r, c) => grid[r * N + c];
      let k = 0;
      for (const w of list) {
        let hit = null;
        for (let r = 0; r < N && !hit; r++) for (let c = 0; c < N && !hit; c++) {
          if (c + w.length <= N && [...w].every((ch, i) => at(r, c + i) === ch)) hit = [[r, c], [r, c + w.length - 1]];
          else if (r + w.length <= N && [...w].every((ch, i) => at(r + i, c) === ch)) hit = [[r, c], [r + w.length - 1, c]];
        }
        if (!hit) continue;   // the game hides at most five of the lesson's words
        const a = page.locator(`#wg .wc[data-r="${hit[0][0]}"][data-c="${hit[0][1]}"]`), b = page.locator(`#wg .wc[data-r="${hit[1][0]}"][data-c="${hit[1][1]}"]`);
        if (k++ % 2) { await a.click(); await sleep(60); await b.click(); }                    // tap the first letter, then the last
        else {                                                                              // or drag across the word
          const A = await a.boundingBox(), B = await b.boundingBox();
          await page.mouse.move(A.x + A.width / 2, A.y + A.height / 2); await page.mouse.down();
          await page.mouse.move(B.x + B.width / 2, B.y + B.height / 2, { steps: 6 }); await page.mouse.up();
        }
        await sleep(250);
      }
      const left = await page.locator('#wl .wi:not(.ok)').count();
      if (left) throw new Error(`word search: ${left} words were not accepted`);
    },
    async gap() { for (let r = 0; r < 5; r++) { await round(r, `!document.querySelector('#bk.ok')`); if (r === 0) await page.locator('#g .opt[data-ok="0"]').first().click(); await page.click('#g .opt[data-ok="1"]'); } },
    async spell() {
      for (let r = 0; r < await page.evaluate(() => Math.min(5, wordsFor.spell(GL).length)); r++) {
        await round(r, `!document.querySelector('#sp.right')`);
        await page.fill('#sp', (await wordOf()).toUpperCase()); await page.click('#ck');
      }
    },
    async seq() {
      for (let r = 0; r < 5; r++) {
        await round(r, `!document.querySelector('#sg').classList.contains('wait') && !document.querySelector('#sd .sdot.on')`);
        const n = await page.locator('#sd .sdot').count();
        const ems = await page.evaluate(n => window.__said.slice(-n).map(en => V(GL).find(v => v.en === en).em), n);
        if (r === 0) {                                                                     // a wrong picture first: Ollie says the words again
          await page.evaluate(em => [...document.querySelectorAll('#sg .tile')].find(t => t.textContent !== em).click(), ems[0]);
          await sleep(900); await page.waitForFunction(() => !document.querySelector('#sg').classList.contains('wait'), null, { timeout: 20000 });
        }
        for (const em of ems) await page.evaluate(em => [...document.querySelectorAll('#sg .tile')].find(t => t.textContent === em).click(), em);
      }
    },
    async bingo() {
      for (let k = 0; k < 60 && !await page.locator('.result').count(); k++) {
        await page.evaluate(() => { const p = document.querySelector('#bp'), en = p && p.dataset.say; if (!en) return; const v = V(GL).find(v => v.en === en), t = [...document.querySelectorAll('#bg .bt:not(.on)')].find(t => t.textContent === v.em || t.textContent === v.en); if (t) t.click(); });
        await sleep(300);
      }
    },
    async race() { for (let k = 0; k < 80 && !await page.locator('.result').count(); k++) { await answer().catch(() => {}); await sleep(200); } },
    async letter() {
      for (let r = 0; r < await page.evaluate(() => Math.min(6, wordsFor.letter(GL).length)); r++) {
        await round(r, `!document.querySelector('#sl.ok')`);
        const word = (await wordOf()).toLowerCase();
        for (let k = 0; k < 2; k++) {
          const at = await page.evaluate(() => [...document.querySelectorAll('#sl .slot')].findIndex(s => s.classList.contains('now')));
          if (at < 0) break;
          await page.click(`#tl .ltr[data-c="${word[at]}"]`);
        }
      }
    },
    async hear() { for (let r = 0; r < 5; r++) { await round(r, `!document.querySelector('#g .opt.right')`); await page.click('#g .opt[data-ok="1"]'); } },
    async order() {
      for (let r = 0; r < await page.evaluate(() => orderSets(GL).length); r++) {
        await round(r, `!document.querySelector('#ol.ok')`);
        if (r === 0) { for (const n of [1, 0, 2, 3]) await page.click(`#ol .oc[data-n="${n}"]`); await sleep(900); }   // a wrong order first
        for (let n = 0; n < 4; n++) if (!await page.locator(`#ol .oc.in[data-n="${n}"]`).count()) await page.click(`#ol .oc[data-n="${n}"]`);
      }
    },
    async sentence() {
      for (let r = 0; r < await page.evaluate(() => sentFor(GL).length); r++) {
        await round(r, `!document.querySelector('#sa.ok')`);
        for (const tok of (await page.getAttribute('#g .ghost[data-say]', 'data-say')).split(' ')) await page.evaluate(tok => [...document.querySelectorAll('#st .tok:not([disabled])')].find(b => b.textContent === tok).click(), tok);
      }
    },
  };
  // the right button of a challenge card, worked out from what the card shows
  const answer = () => page.evaluate(() => {
    const all = LV.flatMap(lv => lv.lessons.flatMap(V)), q = s => document.querySelector('#bq ' + s);
    const ok = q('.play') ? [q('.play').dataset.say] : q('.en-word') ? [q('.en-word').textContent] : all.filter(v => q('.big-em') ? v.em === q('.big-em').textContent : v.ar === q('.ar-word').textContent).map(v => v.en);
    [...document.querySelectorAll('#bq [data-en]')].find(b => ok.includes(b.dataset.en)).click();
  });
  const cards = async n => { for (let k = 0; k < n; k++) { await page.waitForFunction(k => document.querySelector('#bn') && document.querySelector('#bn').textContent.includes(`سؤال ${k + 1} `), k, { timeout: 15000 }); await answer(); } await done(); };

  // a first visit shows what is new, once
  if (!await page.locator('#nw').count()) errors.push('the "what is new" card did not show on a first visit');
  else { await shot('news'); await page.click('#nwx'); if (await page.locator('#nw').count() || !await page.evaluate(() => P.nw === VER.n)) errors.push('the "what is new" card did not go away'); }
  await page.evaluate(() => { P.all = true; home(); });
  await shot('home');
  await page.click('#ollie'); await sleep(1500);
  log('tapping Ollie:', await page.evaluate(() => window.__spoken) ? 'he speaks' : 'SILENT');
  if (!await page.evaluate(() => window.__spoken)) errors.push('Ollie did not speak when tapped');

  if (mode !== 'flow') {
    const where = { 1: [[0, 0], [2, 0], [4, 5]], 2: [[2, 0], [4, 1]], 3: [[1, 0], [3, 3]], 4: [[0, 4], [3, 2]], 5: [[2, 1], [4, 2]], 6: [[2, 1], [4, 4]] }[part] || [[0, 0], [2, 3], [4, 5]];
    for (const [l, i] of where) {
      await page.evaluate(([l, i]) => { ctx.l = l; ctx.i = i; lesson(); window.GL = cur(); }, [l, i]);
      const name = await page.evaluate(() => cur().en), played = [];
      for (const g of Object.keys(bots)) {
        if (!await page.evaluate(g => canPlay(g, cur()), g)) continue;   // this lesson's words do not suit the game
        try {
          await page.evaluate(g => { lesson(); playX(g, cur(), lesson, `${ctx.l}-${ctx.i}-${g}`); }, g);
          await sleep(400); if (l === where[0][0] && i === where[0][1]) { await sleep(1200); await shot('game-' + g); }
          await bots[g](); await done();
          played.push(`${g} ${await page.locator('.result .bigstars .on').count()}★`);
        } catch (e) { errors.push(`${name} / ${g}: ${e.message.split('\n')[0]}`); await shot(`FAILED-${g}`); }
      }
      log(`${name}: ${played.join(', ')}`);
    }
  }

  if (mode !== 'games') {
    // a new child: lesson 1 from start to finish
    await page.evaluate(() => { P.s = {}; P.x = {}; P.m = {}; P.all = false; P.d = { day: '', streak: 0, best: 0, n: 0 }; P.hi = 0; P.rd = {}; save(); LOOK.have = {}; LOOK.on = {}; LOOK.fresh = {}; saveLook(); ctx.l = 0; ctx.i = 0; lesson(); window.GL = cur(); });
    await page.click('.act[data-a="c"]');
    for (let t = 0; t < 4; t++) { await page.click('#opts .opt[data-k="0"]'); await page.click('#nx'); }
    await done(); await page.click('#nx'); await sleep(600);                          // listening
    for (const q of await page.$$('#qs .q')) await (await q.$('.opt[data-k="0"]')).click();
    await done(); await page.click('#nx'); await sleep(300);                          // reading
    await page.click('#rd'); await page.waitForSelector('.sn.on', { timeout: 8000 }); await shot('reading');
    for (const q of await page.$$('#qs .q')) await (await q.$('.opt[data-k="0"]')).click();
    await done(); await page.click('#nx'); await sleep(400);                          // the lesson's own game
    await bots[await page.evaluate(() => gameOf(0, 0))](); await done();
    const flow = await page.evaluate(() => ({ lessonDone: lessonDone(0, 0), stars: totalStars(), sticker: !!document.querySelector('.newst') }));
    log('lesson 1 played through:', JSON.stringify(flow));
    if (!flow.lessonDone || !flow.sticker) errors.push('lesson 1 did not complete with its sticker');

    await page.evaluate(() => { P.all = true; ctx.l = 0; bossIntro(); }); await page.click('#bgo'); await cards(12);
    log('world challenge:', await page.locator('.result .bigstars .on').count() + '★');
    await page.evaluate(() => home()); await page.click('#toD'); await page.click('#dgo'); await cards(await page.evaluate(() => Math.min(8, openWords().length)));
    await shot('daily');
    const d = await page.evaluate(() => P.d); log('daily challenge:', JSON.stringify(d));
    if (d.streak !== 1 || d.n !== 1) errors.push('the daily challenge did not record its day');
    await page.click('#al'); await shot('album');
    await page.evaluate(() => { V(LV[0].lessons[0]).slice(0, 3).forEach(v => miss(v.en)); words(); }); await shot('dictionary');
    await page.click('#trn'); await sleep(400);
    await page.evaluate(() => parents()); await page.click('#tst'); await sleep(600);
    await page.evaluate(() => home()); await page.click('#toQ'); await sleep(400);

    // flashcards: one word marked for practice comes back once more
    await page.evaluate(() => { ctx.l = 0; ctx.i = 0; lesson(); }); await page.click('#fcb');
    for (let k = 0; k < 7; k++) { await page.click('#fc'); await page.click(k === 0 ? '#fno' : '#fok'); }
    await page.waitForSelector('.result .rushn'); await shot('flashcards-end'); await page.click('#bk');

    // library: the story of the finished lesson, read aloud to its end
    await page.evaluate(() => { P.all = false; home(); }); await page.click('#toL'); await shot('library');
    const books = await page.locator('.bk[data-l]').count();
    if (books !== 1) errors.push(`the library shows ${books} stories after one finished lesson`);
    await page.click('.bk[data-l]'); await page.click('#rd'); await page.waitForSelector('#tx .sn.on', { timeout: 8000 }); await shot('story');
    await page.waitForFunction(() => Object.keys(P.rd).length === 1, null, { timeout: 90000 });

    // one-minute rush: the clock is moved so that three seconds are left
    await page.evaluate(() => { home(); }); await page.click('#toR');
    await page.evaluate(() => { const real = performance.now.bind(performance); window.__now = performance.now; performance.now = () => real() - 57000; });
    await page.click('#rgo'); await page.evaluate(() => { performance.now = window.__now; }); await shot('rush');
    for (let k = 0; k < 40 && !await page.locator('.result').count(); k++) { await answer().catch(() => {}); await sleep(150); }
    await page.waitForSelector('.result .rushn', { timeout: 15000 });
    const rush = await page.evaluate(() => ({ shown: +document.querySelector('.rushn').textContent, best: P.hi }));
    log('one-minute rush:', JSON.stringify(rush));
    if (!rush.shown || rush.shown !== rush.best) errors.push('the one-minute rush did not keep its score');

    // wardrobe: the cap for the first lesson, the flower for the daily challenge, the crown for the world challenge
    await page.click('#bk'); await page.click('#toC');
    const have = await page.evaluate(() => Object.keys(LOOK.have).sort().join(','));
    if (have !== 'cap,crown,flower') errors.push('wardrobe: expected the cap, the crown and the flower, found ' + have);
    await page.click('.wr[data-id="cap"]'); await sleep(300); await shot('wardrobe');
    await page.evaluate(() => home());
    if (!await page.evaluate(() => LOOK.on.head === 'cap' && document.querySelector('#ollie svg').innerHTML.includes('#E0442E'))) errors.push('Ollie is not wearing his cap on the home screen');
    await page.click('#toN'); await page.click('#n1'); await sleep(400);
    if (!await page.evaluate(() => !!document.querySelector('#g') && NEWG.some(g => document.querySelector('.g-head b').textContent.includes(GN[g])))) errors.push('"try a new game" did not open one of the new games');

    const before = await page.evaluate(() => ({ stars: totalStars(), tricky: tricky().length, spoken: window.__spoken }));
    await page.reload(); await page.waitForSelector('.world');
    const after = await page.evaluate(() => ({ stars: totalStars(), tricky: tricky().length, streak: streakNow(), best: P.hi, read: Object.keys(P.rd).length, cap: LOOK.on.head }));
    log('after closing and opening again:', JSON.stringify(after));
    if (after.stars !== before.stars || after.tricky !== before.tricky || after.streak !== 1) errors.push('progress was not kept after a reload');
    if (after.best !== rush.best || after.read !== 1 || after.cap !== 'cap') errors.push('the rush score, the library or the wardrobe was not kept after a reload');
    log(`clips loaded: ${clips.size}, clips played: ${before.spoken}`);
  }

  await browser.close(); server.close();
  if (errors.length) { console.log(`[part ${part}] ERRORS:\n` + [...new Set(errors)].map(e => '  ' + e).join('\n')); process.exit(1); }
  log('OK: no errors');
})();
