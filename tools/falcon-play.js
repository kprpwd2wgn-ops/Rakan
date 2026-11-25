// Plays Word Falcon (word-falcon.html) in headless Chromium the way a child would: the intro, the placement test,
// a lesson (meeting the words and answering every question), the smart review, each of the eight games, the word
// book, talk time, the falcon's nest, the badges and the parents' corner. It reports script errors, clips that
// failed to load, and saves a screenshot of every screen in the folder it prints.
// usage: node tools/falcon-play.js            (serves the repo on a local port so the voice packs load)
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..'), OUT = fs.mkdtempSync(path.join(os.tmpdir(), 'falcon-play-'));
const TYPES = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.mp3': 'audio/mpeg', '.js': 'text/javascript', '.png': 'image/png' };
const server = http.createServer((q, r) => {
  const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
});
(async () => {
  await new Promise(res => server.listen(0, res));
  const url = `http://127.0.0.1:${server.address().port}/word-falcon.html`;
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
  const errors = [], bad = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
  let n = 0; const shot = async name => { await page.waitForTimeout(250); await page.screenshot({ path: path.join(OUT, String(++n).padStart(2, '0') + '-' + name + '.png') }); };
  const click = async (sel, t = 4000) => { const sh = page.locator('.sheet [data-close]'); if (await sh.count()) await sh.first().click(); const el = page.locator(sel).first(); await el.waitFor({ state: 'visible', timeout: t }); await el.click(); await page.waitForTimeout(150); };
  const screen = () => page.evaluate(() => document.body.dataset.screen);
  // answers whatever question is on screen; returns false when no question is shown
  const answer = async (wrongFirst) => {
    if (!(await page.locator('#qb').count())) return false;
    const qn = await page.evaluate(() => document.getElementById('app').dataset.qn);
    const w = await page.locator('#qb').getAttribute('data-w');
    if (await page.locator('#qb .slots .slot[data-s]').count() && w) {               // spelling
      for (const c of [...w].filter(c => /[A-Za-z]/.test(c))) {
        const tiles = page.locator('#qb .tile:not(.used)');
        const k = await tiles.count();
        for (let i = 0; i < k; i++) { const t = tiles.nth(i); if ((await t.textContent()).toLowerCase() === c.toLowerCase()) { await t.click(); break; } }
      }
    } else if (await page.locator('#qb .built').count() && w) {                      // word order
      for (const tok of w.split(' ')) {
        const tiles = page.locator('#qb .tile:not(.used)'); const k = await tiles.count();
        for (let i = 0; i < k; i++) { const t = tiles.nth(i); if ((await t.textContent()) === tok) { await t.click(); break; } }
      }
    } else if (await page.locator('#qb #skip').count()) { await click('#qb #skip'); }   // say it (no microphone here)
    else {
      const sel = wrongFirst ? '#qb .opt:not([data-right])' : '#qb .opt[data-right]';
      await click(sel);
    }
    // wait until the next question (or the end) is on screen, pressing "continue" after a wrong answer
    for (let t = 0; t < 60; t++) {
      await page.waitForTimeout(150);
      if (await page.locator('#cont').count()) { await click('#cont'); continue; }
      const now = await page.evaluate(() => document.getElementById('app').dataset.qn);
      if (now !== qn || !(await page.locator('#qb').count())) break;
    }
    return true;
  };
  await page.goto(url); await page.waitForTimeout(800); await shot('splash');
  await click('#go'); await page.waitForTimeout(600); await shot('intro');
  for (let i = 0; i < 3; i++) await click('#nx');
  await shot('placement-ask'); await click('#yes'); await click('#st'); await page.waitForTimeout(500); await shot('placement-q');
  let k = 0; while (await screen() === 'placement' && await page.locator('#qb').count() && k < 40) { await answer(k % 3 === 2); k++; }
  await shot('placement-result'); await click('#hm'); await page.waitForTimeout(500); await shot('home');
  // a lesson
  await click('#lesson'); await page.waitForTimeout(600); await shot('meet');
  for (let i = 0; i < 8 && await page.locator('#nx').count(); i++) await click('#nx');
  await page.waitForTimeout(500); await shot('question');
  k = 0; while (await page.locator('#qb').count() && k < 40) { if (k === 3) await shot('question-2'); if (k === 9) await shot('question-3'); await answer(k === 2); k++; }
  await shot('lesson-done'); console.log('lesson questions answered:', k);
  await page.evaluate(() => document.querySelectorAll('.sheet').forEach(s => s.remove()));
  // make the learned words due and review them
  await page.evaluate(() => { const F = window.FALCON; for (const k in F.ST.w) F.ST.w[k].d = F.DAY(); F.save(); F.home(); });
  await page.waitForTimeout(400); await shot('home-2');
  await click('#review'); await page.waitForTimeout(400); await shot('review-start'); await click('#st'); await page.waitForTimeout(400);
  k = 0; while (await page.locator('#qb').count() && k < 40) { if (k === 1) await shot('review-q'); await answer(k === 1); k++; }
  await shot('review-done'); console.log('review questions answered:', k);
  await page.evaluate(() => { document.querySelectorAll('.sheet').forEach(s => s.remove()); window.FALCON.home(); });
  // the map, a topic, the topic check
  await click('[data-go="map"]'); await shot('map'); await click('.tcard[data-t="food"]'); await shot('topic');
  await click('#chk'); await click('#st'); k = 0; while (await page.locator('#qb').count() && k < 12) { await answer(k % 2 === 1); k++; } await shot('check-done'); await click('#ok');
  await page.locator('.wtile').first().click(); await page.waitForTimeout(300); await shot('word-card'); await page.evaluate(() => document.querySelectorAll('.sheet').forEach(s => s.remove()));
  // games
  await page.evaluate(() => window.FALCON.home()); await click('[data-go="games"]'); await shot('games');
  for (const g of ['catch', 'memory', 'tower', 'rush', 'order', 'odd', 'mystery', 'tf']) {
    await page.evaluate(id => { window.FALCON.go('game', id); }, g); await page.waitForTimeout(400);
    if (await page.locator('#play').count()) await click('#play');
    await page.waitForTimeout(600);
    if (g === 'catch') { for (let i = 0; i < 6; i++) { const b = page.locator('.bub').first(); if (await b.count()) await b.click({ force: true }).catch(() => {}); await page.waitForTimeout(500); } }
    if (g === 'memory') { const c = page.locator('.mcard'); for (let i = 0; i < 4; i++) { await c.nth(i).click(); await page.waitForTimeout(500); } }
    if (g === 'tower' || g === 'order') { for (let i = 0; i < 2; i++) { await answer(false); await page.waitForTimeout(800); } }
    if (g === 'rush' || g === 'tf') { for (let i = 0; i < 4; i++) { const o = page.locator('.opt').first(); if (await o.count()) await o.click().catch(() => {}); await page.waitForTimeout(700); } }
    if (g === 'odd') { await click('.opt[data-right]'); await click('#nx'); }
    if (g === 'mystery') { for (const c of 'aeiorst') { const b = page.locator(`.kb button[data-c="${c}"]`); if (await b.count() && await b.isEnabled()) await b.click(); await page.waitForTimeout(120); } }
    await shot('game-' + g);
  }
  // book, talk, shop, badges, parents
  await page.evaluate(() => window.FALCON.home()); await click('[data-go="book"]'); await shot('book');
  await page.evaluate(() => window.FALCON.home()); await click('[data-go="talkList"]'); await shot('talk-list'); await click('.lcard[data-t="food"]'); await page.waitForTimeout(500); await shot('talk-q');
  if (await page.locator('#build').count()) await click('#build');
  const w = await page.locator('#act').getAttribute('data-w');
  if (w) for (const tok of w.split(' ')) { const tiles = page.locator('#act .tile:not(.used)'); const c = await tiles.count(); for (let i = 0; i < c; i++) { const t = tiles.nth(i); if ((await t.textContent()) === tok) { await t.click(); break; } } }
  await page.waitForTimeout(800); await shot('talk-answer');
  await page.evaluate(() => { window.FALCON.ST.fe += 300; window.FALCON.save(); window.FALCON.home(); }); await click('[data-go="shop"]');
  await click('[data-i="headset"]'); await click('[data-b="night"]'); await shot('shop');
  await page.evaluate(() => window.FALCON.home()); await page.waitForTimeout(300); await shot('home-3');
  await click('[data-go="badges"]'); await shot('badges');
  await page.evaluate(() => window.FALCON.home()); await click('#par');
  const q = await page.locator('.gatebox .q').textContent(); const [a, b] = q.match(/\d+/g).map(Number);
  await click(`[data-v="${a * b}"]`); await page.waitForTimeout(400); await shot('parents');
  await page.screenshot({ path: path.join(OUT, String(++n).padStart(2, '0') + '-parents-full.png'), fullPage: true });
  const voices = await page.evaluate(() => ({ packs: Object.keys(window.FALCON.VO.packs).length, idx: !!window.FALCON.VO.idx }));
  await browser.close(); server.close();
  console.log('voice packs fetched:', voices.packs, 'index loaded:', voices.idx);
  console.log('screenshots in ' + OUT);
  if (bad.length) console.log('FAILED LOADS:\n  ' + [...new Set(bad)].join('\n  '));
  if (errors.length) { console.log('ERRORS:\n  ' + [...new Set(errors)].join('\n  ')); process.exit(1); }
  console.log('OK: no errors');
})().catch(e => { console.error(e); server.close(); process.exit(1); });
