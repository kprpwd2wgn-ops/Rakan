// Takes the level test (level-test.html) in headless Chromium like a child around level A1: band 1 right, band 2 mostly right,
// band 3 mostly wrong, band 4 "I don't know"; answers part 7 "into the microphone" (the page's EAR is given scripted
// words, one of them silence first), fills in the parents' questions, then takes the speaking-only round and checks that
// a page without a microphone offers the GitHub link and lets the part be skipped.
// Reports script errors and failed loads, prints the result code, and saves screenshots in the folder it prints.
// usage: node tools/level-test-play.js
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..'), OUT = fs.mkdtempSync(path.join(os.tmpdir(), 'level-test-'));
const server = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': f.endsWith('.html') ? 'text/html; charset=utf-8' : f.endsWith('.json') ? 'application/json' : 'audio/mpeg' }); fs.createReadStream(f).pipe(r); });
(async () => {
  await new Promise(res => server.listen(0, res));
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
  const errors = [], bad = [];
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
  let n = 0; const shot = async name => { await page.waitForTimeout(200); await page.screenshot({ path: path.join(OUT, String(++n).padStart(2, '0') + '-' + name + '.png') }); };
  const click = async sel => { const el = page.locator(sel).first(); await el.waitFor({ state: 'visible', timeout: 5000 }); await el.click(); await page.waitForTimeout(150); };
  await page.goto(`http://127.0.0.1:${server.address().port}/level-test.html`); await page.waitForTimeout(700); await shot('start');
  const SAY = ['My favorite color is blue.', 'After school I play football with my friends.', 'I want to be a doctor.', 'Last weekend I go to my grandmother house.', 'My family make me happy.', 'I like the desert more because we go camping.'];
  await page.evaluate(said => { const L = window.LEVELTEST; let k = 0, quiet = true; L.EAR.fake = () => { if (quiet) { quiet = false; return ''; } return said[k++ % said.length]; }; }, SAY);
  await click('#go'); await shot('intro'); await click('#nx'); await click('#nx');
  const seen = new Set();
  for (let guard = 0; guard < 200; guard++) {
    if (await page.locator('#fin').count()) break;
    if (await page.locator('#go').count()) { const st = await page.evaluate(() => window.LEVELTEST.T.sec); if (!seen.has('sec' + st)) { seen.add('sec' + st); await shot('section-' + (st + 1)); } await click('#go'); continue; }
    if (await page.locator('#nx').count() && !(await page.locator('#qb').count())) { await click('#nx'); continue; }
    const info = await page.evaluate(() => { const T = window.LEVELTEST.T, s = LT_SECTIONS[T.sec], it = s.items[T.pos]; if (!it) return null;
      const q = it.qs ? it.qs.find(x => !T.answers[x.id]) : it; return { kind: s.kind, b: q ? q.b : it.b, ans: q && q.ans, say: it.say, sec: s.id }; });
    if (!info) { await page.waitForTimeout(300); continue; }
    if (!seen.has(info.kind)) { seen.add(info.kind); await shot('q-' + info.kind); }
    const right = info.b === 1 || (info.b === 2 && Math.random() < .75) || (info.b === 3 && Math.random() < .3);
    if (info.kind === 'speak') {
      await click('#mic'); await page.waitForTimeout(700);
      if (!(await page.locator('#nx:not([hidden])').count())) { await shot('speak-nothing-heard'); await click('#mic'); await page.waitForTimeout(700); }
      if (!seen.has('speak-heard')) { seen.add('speak-heard'); await shot('speak-heard'); }
      await click('#nx'); continue;
    }
    if (info.kind === 'spell') {
      if (info.b >= 3) { await click('#dunno'); continue; }
      for (const c of info.say) { const tiles = page.locator('.tile:not(.used)'); const k = await tiles.count(); for (let i = 0; i < k; i++) { if ((await tiles.nth(i).textContent()) === c) { await tiles.nth(i).click(); break; } } }
      await click('#ok'); await page.waitForTimeout(400); continue;
    }
    if (info.b === 4) { await click('#dunno'); await page.waitForTimeout(450); continue; }
    const opts = page.locator('#qb .opt'); const k = await opts.count(); let target = -1, other = -1;
    for (let i = 0; i < k; i++) { const t = (await opts.nth(i).innerText()).trim(); if (t === String(info.ans).trim() || t.includes(info.ans)) target = i; else other = i; }
    await opts.nth(right && target >= 0 ? target : other).click(); await page.waitForTimeout(450);
  }
  await shot('parents');
  for (const g of await page.locator('.ltseg').all()) await g.locator('button').nth(1).click();
  await click('#fin'); await page.waitForTimeout(1500); await shot('result');
  await page.screenshot({ path: path.join(OUT, String(++n).padStart(2, '0') + '-result-full.png'), fullPage: true });
  const res = await page.evaluate(() => ({ code: window.LEVELTEST.code(), level: window.LEVELTEST.summary().level, skipped: window.LEVELTEST.T.skipped.length,
    speak: window.LEVELTEST.payload().speak.map(x => x.tries.length).join(',') }));
  // the speaking-only round
  await click('#again'); await page.waitForTimeout(400); await click('#sp'); await click('#nx');
  for (let i = 0; i < 6; i++) { await click('#mic'); await page.waitForTimeout(700); await click('#nx'); }
  await page.waitForTimeout(1500); await shot('speak-only-result');
  const only = await page.evaluate(() => ({ code: window.LEVELTEST.code(), mode: window.LEVELTEST.payload().mode }));
  // a page with no microphone: the message, the GitHub link and skipping the part
  await click('#again'); await page.waitForTimeout(400); await click('#sp'); await click('#nx');
  await page.evaluate(() => { const E = window.LEVELTEST.EAR; E.fake = null; E.dict = null; E.blocked = true; });
  await click('#mic'); await page.waitForTimeout(300); await shot('speak-no-mic');
  const noMic = await page.locator('#nomic').innerText(); await click('#skipall'); await page.waitForTimeout(1500);
  const skipped = await page.evaluate(() => window.LEVELTEST.payload().speak.every(x => x.skipped));
  await browser.close(); server.close();
  console.log('result code:', res.code); console.log('level:', res.level, '· items skipped by the early stop:', res.skipped, '· spoken tries per question:', res.speak);
  console.log('speaking-only round:', only.mode, '\n' + only.code);
  console.log('no microphone:', noMic.replace(/\s+/g, ' ').trim(), '· part skipped:', skipped);
  console.log('screenshots in ' + OUT);
  if (bad.length) console.log('FAILED LOADS:\n  ' + [...new Set(bad)].join('\n  '));
  if (errors.length) { console.log('ERRORS:\n  ' + [...new Set(errors)].join('\n  ')); process.exit(1); }
  console.log('OK: no errors');
})().catch(e => { console.error(e); server.close(); process.exit(1); });
