// End-to-End-Tests im echten Browser (Playwright/Chromium). Start: node tests/e2e.test.js
"use strict";
const { chromium, devices } = require("playwright");
const { ROOT, check, section, report, loadLogic, path } = require("./lib");

const URL = "file://" + path.join(ROOT, "index.html");
const L = loadLogic();
const IPHONE = devices["iPhone 13"];
const SMALL = { viewport: { width: 320, height: 568 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, userAgent: IPHONE.userAgent };
const errors = [];
let browser;

async function phone(opts = IPHONE, extra = {}) {
  const ctx = await browser.newContext({ ...opts, ...extra });
  const p = await ctx.newPage();
  p.setDefaultTimeout(8000);
  p.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  p.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
  p.on("dialog", (d) => { errors.push(`Browser-Popup statt eigenem Dialog: ${d.message()}`); d.accept(); });
  return p;
}
const screen = (p) => p.$eval(".screen.active", (e) => e.id.replace("screen-", ""));
const sheetOpen = (p) => p.$eval("#sheet", (e) => e.classList.contains("open"));
const wait = (p, ms = 450) => p.waitForTimeout(ms);
async function sheetOk(p) { await wait(p); await p.tap("#sheet-ok"); await wait(p); }
async function hold(p, sel, ms = 350) {
  const b = await p.locator(sel).boundingBox();
  await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await p.mouse.down(); await p.waitForTimeout(ms);
  const open = await p.$eval(sel, (e) => e.classList.contains("open"));
  const text = (await p.textContent(sel + " .face-back")).replace(/\s+/g, " ").trim();
  const word = await p.$eval(sel + " .face-back", (e) => { const w = e.querySelector(".word"); return w ? w.textContent : null; });
  await p.mouse.up();
  return { open, text, word };
}
// tippt, solange der Knopf aktiv ist (max. n-mal)
async function tapWhileEnabled(p, sel, n) {
  for (let i = 0; i < n; i++) { if (await p.isDisabled(sel)) return; await p.tap(sel); }
}
async function noHorizontalScroll(p, label) {
  const ok = await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  check(`kein seitliches Scrollen: ${label}`, ok);
}
async function getShareLink(p) {
  await p.evaluate(() => { try { Object.defineProperty(navigator, "share", { value: undefined, configurable: true }); Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true }); } catch (e) {} });
  await p.tap("[data-action=share]"); await wait(p);
  const link = await p.inputValue(".share-input");
  await p.tap("#sheet-ok"); await wait(p);
  return link;
}
const cardInfo = (h) => ({ imp: h.text.includes("Du bist Imposter"), word: h.word });

(async () => {
  browser = await chromium.launch();

  /* ------------------------------------------------------------ Startseite & Regeln */
  section("Startseite, Regeln, Layout");
  for (const [label, dev] of [["iPhone 13", IPHONE], ["320px-Handy", SMALL], ["Desktop", { viewport: { width: 1280, height: 800 } }]]) {
    const p = await phone(dev);
    await p.goto(URL);
    check(`${label}: Startseite sichtbar`, (await screen(p)) === "home");
    check(`${label}: Dialog-Knöpfe auf Startseite versteckt`, !(await p.isVisible("#sheet-ok")));
    await noHorizontalScroll(p, `${label} Startseite`);
    await p.click("[data-action=rules]");
    check(`${label}: Regeln öffnen`, (await screen(p)) === "rules");
    await noHorizontalScroll(p, `${label} Regeln`);
    await p.click("#screen-rules [data-action=home]");
    check(`${label}: zurück zur Startseite`, (await screen(p)) === "home");
    await p.context().close();
  }
  {
    const p = await phone();
    await p.route("**/style.css*", (r) => r.fulfill({ status: 200, contentType: "text/css", body: "" }));
    await p.goto(URL);
    check("ohne CSS (alter Cache): Dialog bleibt unsichtbar", !(await p.isVisible("#sheet-ok")));
    await p.context().close();
  }

  /* ------------------------------------------------------------ Setup */
  section("Spiel einrichten");
  {
    const p = await phone();
    await p.goto(URL);
    await p.tap("[data-action=setup-multi]");
    await tapWhileEnabled(p, '[data-step=players][data-delta="-1"]', 25);
    check("Spieler minimal 3", (await p.textContent("#players-out")) === "3");
    check("Minus-Knopf bei 3 deaktiviert", await p.isDisabled('[data-step=players][data-delta="-1"]'));
    check("bei 3 Spielern genau 1 Imposter erlaubt", (await p.textContent("#imposters-out")) === "1" && await p.isDisabled('[data-step=imposters][data-delta="1"]'));
    check("Namensfelder folgen der Spielerzahl (3)", (await p.$$(".name-input")).length === 3);
    await tapWhileEnabled(p, '[data-step=players][data-delta="1"]', 25);
    check("Spieler maximal 20", (await p.textContent("#players-out")) === "20");
    check("Namensfelder folgen der Spielerzahl (20)", (await p.$$(".name-input")).length === 20);
    check("Empfehlung folgt der Spielerzahl (20 → 5)", (await p.textContent("#imposters-out")) === "5");
    await tapWhileEnabled(p, '[data-step=imposters][data-delta="1"]', 10);
    check("Imposter maximal 5", (await p.textContent("#imposters-out")) === "5");
    for (let p2 = 20; p2 > 6; p2--) await p.tap('[data-step=players][data-delta="-1"]');
    check("Imposter werden bei weniger Spielern begrenzt (6 → ≤2)", Number(await p.textContent("#imposters-out")) <= 2);
    const total = L.CATEGORIES.reduce((n, c) => n + c.words.length, 0);
    check(`Wortzahl angezeigt (${total})`, (await p.textContent("#word-count")).includes(String(total)));
    const chips = await p.$$(".chip");
    check("14 Kategorie-Chips", chips.length === 14);
    for (let i = 1; i < 14; i++) await (await p.$$(".chip"))[i].tap();
    check("Wortzahl passt zu einer Kategorie", (await p.textContent("#word-count")).includes(String(L.CATEGORIES[0].words.length)));
    await (await p.$$(".chip"))[0].tap(); await wait(p, 200);
    check("letzte Kategorie lässt sich nicht abwählen", (await p.$$(".chip.on")).length === 1 && (await p.textContent("#toast")).includes("Mindestens"));
    await noHorizontalScroll(p, "Setup");
    await p.context().close();
  }

  /* ------------------------------------------------------------ Mehrere Handys */
  section("Mehrere Handys: 7 Spieler, 2 Imposter, mit Namen");
  const NAMES = ["Lars", "Tim", "Anna", "<b>Max</b>", "Jonas, der Große", "", "Sophie-Marie Lang"];
  const host = await phone();
  await host.goto(URL);
  await host.tap("[data-action=setup-multi]");
  while (Number(await host.textContent("#players-out")) < 7) await host.tap('[data-step=players][data-delta="1"]');
  while (Number(await host.textContent("#players-out")) > 7) await host.tap('[data-step=players][data-delta="-1"]');
  while (Number(await host.textContent("#imposters-out")) < 2) await host.tap('[data-step=imposters][data-delta="1"]');
  while (Number(await host.textContent("#imposters-out")) > 2) await host.tap('[data-step=imposters][data-delta="-1"]');
  const inputs = await host.$$(".name-input");
  for (let i = 0; i < 7; i++) await inputs[i].fill(NAMES[i]);
  await host.tap("[data-action=start]");
  check("Host-Bildschirm mit Code", (await screen(host)) === "host");
  const code = (await host.textContent("#host-code")).replace(/-/g, "");
  check("Code ist 9-stellig und gültig", code.length === 9 && L.decodeCode(code) !== null);
  check("Hinweis: Namen nur über Link", await host.isVisible("#host-names-note"));
  const link = await getShareLink(host);
  check("Teilen-Link enthält Code und Namen", link.includes("g=" + code) && link.includes("n="));
  const game = L.decodeCode(code);
  game.names = L.namesFor(NAMES, 7);

  await host.tap("[data-action=host-join]");
  const boardTexts = await host.$$eval(".seat", (e) => e.map((x) => x.textContent));
  check("Board zeigt Namen", boardTexts[0].startsWith("Lars") && boardTexts[1].startsWith("Tim"));
  check("Board escaped HTML im Namen", boardTexts[3].startsWith("<b>Max</b>") && !(await host.$(".seat b")));
  check("Komma im Namen entfernt", boardTexts[4].startsWith("Jonas der Große"));
  check("leerer Name → Nummer", boardTexts[5].startsWith("6"));

  // Sheet-Verhalten an der Platzwahl testen
  await host.tap(".seat:nth-child(1)"); await wait(host);
  check("Platzwahl öffnet eigenen Dialog", await sheetOpen(host));
  check("Dialog-Titel mit Name", (await host.textContent("#sheet-title")) === "Bist du Lars?");
  await host.tap("#sheet-cancel"); await wait(host);
  check("Abbrechen schließt Dialog", !(await sheetOpen(host)) && (await screen(host)) === "board");
  await host.tap(".seat:nth-child(1)"); await wait(host);
  await host.mouse.click(195, 100); await wait(host);
  check("Tippen daneben schließt Dialog", !(await sheetOpen(host)));
  await host.tap(".seat:nth-child(1)"); await wait(host);
  await host.keyboard.press("Escape"); await wait(host);
  check("Escape schließt Dialog", !(await sheetOpen(host)));
  await host.tap(".seat:nth-child(1)"); await wait(host);
  let sb = await host.locator("#sheet .sheet").boundingBox();
  await host.mouse.move(sb.x + sb.width / 2, sb.y + 15); await host.mouse.down();
  await host.mouse.move(sb.x + sb.width / 2, sb.y + 35, { steps: 4 }); await host.mouse.up(); await wait(host);
  check("kurzes Ziehen: Dialog federt zurück und bleibt offen", await sheetOpen(host));
  sb = await host.locator("#sheet .sheet").boundingBox();
  await host.mouse.move(sb.x + sb.width / 2, sb.y + 15); await host.mouse.down();
  await host.mouse.move(sb.x + sb.width / 2, sb.y + 260, { steps: 8 }); await host.mouse.up(); await wait(host);
  check("weit nach unten ziehen schließt Dialog", !(await sheetOpen(host)));
  await host.tap(".seat:nth-child(1)"); await sheetOk(host);
  check("Bestätigen öffnet Karte", (await screen(host)) === "card" && (await host.textContent("#card-title")) === "Lars");

  // Alle anderen treten per Link bei
  const phones = [host];
  for (let i = 2; i <= 7; i++) {
    const p = await phone();
    await p.goto(link.replace(/^.*\?/, URL + "?"));
    if (i === 2) check("Link öffnet direkt das Board", (await screen(p)) === "board");
    await p.tap(`.seat:nth-child(${i})`); await sheetOk(p);
    phones.push(p);
  }
  check("alle 7 Handys auf ihrer Karte", (await Promise.all(phones.map(screen))).every((s) => s === "card"));

  async function verifyRound(round) {
    const exp = L.computeRound(game, round);
    const res = [];
    for (let i = 0; i < 7; i++) {
      const p = phones[i];
      check(`R${round} Handy ${i + 1}: Rundenanzeige`, (await p.textContent("#card-round")) === `Runde ${round}`);
      const h = await hold(p, "#my-card");
      const after = await p.$eval("#my-card", (e) => e.classList.contains("open"));
      const info = cardInfo(h);
      res.push(info);
      check(`R${round} Handy ${i + 1}: Karte offen solange gedrückt, danach zu`, h.open && !after);
      const shouldImp = exp.imposters.includes(i + 1);
      check(`R${round} Handy ${i + 1}: Rolle korrekt`, info.imp === shouldImp);
      check(`R${round} Handy ${i + 1}: ${shouldImp ? "Tipp" : "Wort"} korrekt`, info.word === (shouldImp ? exp.hint : exp.word), `${info.word} ≠ ${shouldImp ? exp.hint : exp.word}`);
      const st = await p.textContent("#card-starter");
      const stName = game.names[exp.starter - 1] || `Spieler ${exp.starter}`;
      check(`R${round} Handy ${i + 1}: Startspieler gut sichtbar über der Karte`, await p.isVisible("#card-starter"));
      check(`R${round} Handy ${i + 1}: gleicher Startspieler`, exp.starter === i + 1 ? st.includes("Du beginnst") : st.includes(`${stName} beginnt`), st);
    }
    check(`R${round}: genau 2 Imposter`, res.filter((r) => r.imp).length === 2);
    check(`R${round}: alle Nicht-Imposter haben dasselbe Wort`, new Set(res.filter((r) => !r.imp).map((r) => r.word)).size === 1);
    return exp.word;
  }
  const playedWords = [];
  for (let round = 1; round <= 4; round++) {
    playedWords.push(await verifyRound(round));
    for (const p of phones) {
      await p.tap("[data-action=next-round]"); await wait(p);
      if (p === host) check(`Rückfrage „Nächste Runde“ (Runde ${round + 1})`, (await p.textContent("#sheet-title")) === `Runde ${round + 1} starten?`);
      await p.tap("#sheet-ok"); await wait(p, 300);
    }
  }
  playedWords.push(await verifyRound(5));
  check("5 Runden, 5 verschiedene Wörter", new Set(playedWords).size === 5);

  // Abbrechen bei nächster Runde
  await host.tap("[data-action=next-round]"); await wait(host); await host.tap("#sheet-cancel"); await wait(host);
  check("Abbrechen bei „Nächste Runde“ bleibt in Runde 5", (await host.textContent("#card-round")) === "Runde 5");

  // Auflösen
  await host.tap("#screen-card [data-action=reveal]"); await wait(host);
  check("Auflösen fragt nach", (await host.textContent("#sheet-title")) === "Auflösen?");
  await host.tap("#sheet-ok"); await wait(host, 900);
  const exp5 = L.computeRound(game, 5);
  const revealText = await host.textContent("#sheet-body");
  check("Auflösung zeigt Wort", revealText.includes(exp5.word));
  check("Auflösung zeigt Tipp", revealText.includes(exp5.hint));
  check("Auflösung zeigt beide Imposter", exp5.imposters.every((n) => revealText.includes(game.names[n - 1] || `Spieler ${n}`)));
  check("Auflösung hat nur „Schließen“", await host.isHidden("#sheet-cancel"));
  await host.tap("#sheet-ok"); await wait(host);
  await noHorizontalScroll(host, "Karte");

  // Neuladen (Handy gesperrt) -> gleiche Karte, verdeckt
  section("Neuladen / gesperrtes Handy");
  await phones[3].reload();
  check("nach Neuladen wieder auf der Karte", (await screen(phones[3])) === "card");
  check("nach Neuladen gleiche Runde", (await phones[3].textContent("#card-round")) === "Runde 5");
  check("nach Neuladen Karte verdeckt", !(await phones[3].$eval("#my-card", (e) => e.classList.contains("open"))));
  check("nach Neuladen Namen erhalten", (await phones[3].textContent("#card-title")) === "<b>Max</b>");
  await phones[3].mouse.move(200, 400); await phones[3].mouse.down();
  await phones[3].evaluate(() => { Object.defineProperty(document, "hidden", { value: true, configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
  check("Sperren verdeckt die Karte sofort", !(await phones[3].$eval("#my-card", (e) => e.classList.contains("open"))));
  await phones[3].mouse.up();
  await phones[3].evaluate(() => { const k = "imposter-state-v2"; const s = JSON.parse(localStorage.getItem(k)); s.at -= 13 * 3600e3; localStorage.setItem(k, JSON.stringify(s)); });
  await phones[3].reload();
  check("nach >12 h startet die Startseite", (await screen(phones[3])) === "home");

  // Beitreten per Code (ohne Namen), Fehlerfälle
  section("Beitreten per Code");
  const j = await phone();
  await j.goto(URL); await j.tap("[data-action=join]");
  await j.type("#code-input", "abc-def");
  await j.tap("[data-action=join-submit]");
  check("ungültiger Code → Fehlermeldung", (await j.textContent("#join-error")).includes("Ungültig"));
  await j.fill("#code-input", ""); await j.type("#code-input", code.toLowerCase());
  check("Eingabe wird formatiert", (await j.inputValue("#code-input")) === L.formatCode(code));
  await j.tap("[data-action=join-submit]");
  check("gültiger Code → Board", (await screen(j)) === "board");
  check("eingetippter Code zeigt Nummern statt Namen", (await j.textContent(".seat:nth-child(1)")).startsWith("1"));
  await j.tap(".seat:nth-child(2)"); await sheetOk(j);
  const jText = cardInfo(await hold(j, "#my-card"));
  const exp1 = L.computeRound(game, 1);
  check("eingetippter Code: gleiches Spiel (Runde 1)", jText.word === (exp1.imposters.includes(2) ? exp1.hint : exp1.word));
  await j.context().close();
  {
    const legacy = "AB273ZZZW"; // Code aus der allerersten Version
    const p = await phone(); await p.goto(URL + "?g=" + legacy);
    check("alter Code aus erster Version funktioniert", (await screen(p)) === "board");
    await p.context().close();
  }

  // Spieler ändern
  section("Spieler ändern (eigene Handys)");
  await host.tap("#screen-card [data-action=board]");
  await host.tap("[data-action=edit-players]");
  check("Titel „Spieler ändern“", (await host.textContent("#setup-title")) === "Spieler ändern");
  check("Kategorien ausgeblendet", !(await host.isVisible("#category-chips")));
  check("Namen vorausgefüllt", (await host.$eval(".name-input", (e) => e.value)) === "Lars");
  check("Spielerzahl übernommen", (await host.textContent("#players-out")) === "7");
  await host.tap('[data-step=players][data-delta="1"]');
  await (await host.$$(".name-input"))[7].fill("Neu");
  await host.tap("#start-btn");
  const code2 = (await host.textContent("#host-code")).replace(/-/g, "");
  const game2 = L.decodeCode(code2);
  check("neuer Code 11-stellig mit Stapelposition 5", code2.length === 11 && game2.offset === 5);
  check("Hinweis „alle neu beitreten“", await host.isVisible("#host-continue-note"));
  check("gleiche Kategorien & Generation", game2.mask === game.mask && game2.gen === game.gen);
  check("nächstes Wort = Runde 6 vom alten Spiel", L.computeRound(game2, 1).word === L.computeRound(game, 6).word);
  const link2 = await getShareLink(host);
  const nw = await phone();
  await nw.goto(link2.replace(/^.*\?/, URL + "?"));
  check("Neuer Spieler sieht 8 Plätze mit Namen", (await nw.$$(".seat")).length === 8 && (await nw.textContent(".seat:nth-child(8)")).startsWith("Neu"));
  await nw.tap(".seat:nth-child(8)"); await sheetOk(nw);
  const nwInfo = cardInfo(await hold(nw, "#my-card"));
  const e2 = L.computeRound(game2, 1);
  check("Neuer Spieler bekommt das richtige nächste Wort", nwInfo.word === (e2.imposters.includes(8) ? e2.hint : e2.word));
  check("kein Wort aus den ersten 5 Runden", !playedWords.includes(e2.word));
  for (const p of [...phones, nw]) await p.context().close().catch(() => {});

  /* ------------------------------------------------------------ Herumreichen */
  section("Ein Handy herumreichen");
  {
    const p = await phone();
    await p.goto(URL);
    await p.tap("[data-action=setup-pass]");
    while (Number(await p.textContent("#players-out")) > 5) await p.tap('[data-step=players][data-delta="-1"]');
    while (Number(await p.textContent("#players-out")) < 5) await p.tap('[data-step=players][data-delta="1"]');
    while (Number(await p.textContent("#imposters-out")) > 1) await p.tap('[data-step=imposters][data-delta="-1"]');
    const ins = await p.$$(".name-input");
    for (let i = 0; i < 5; i++) await ins[i].fill(["A", "B", "C", "D", ""][i]);
    await p.tap("#hint-toggle + .slider"); // Tipp aus
    await p.tap("[data-action=start]");
    const g = L.decodeCode(await p.evaluate(() => JSON.parse(localStorage.getItem("imposter-state-v2")).pass.code));
    check("Tipp-Einstellung „aus“ im Code", g.hints === false);
    g.names = L.namesFor(["A", "B", "C", "D", ""], 5);
    for (let round = 1; round <= 2; round++) {
      const exp = L.computeRound(g, round);
      for (let i = 1; i <= 5; i++) {
        const name = g.names[i - 1] || `Spieler ${i}`;
        check(`R${round} P${i}: „Gib das Handy an ${name}“`, (await p.textContent("#pass-front-text")) === `Gib das Handy an ${name}`);
        check(`R${round} P${i}: Weiter-Knopf erst nach Aufdecken`, await p.isHidden("#pass-next"));
        if (round === 1 && i === 3) { await p.reload(); check("Neuladen mitten im Herumreichen → gleicher Spieler", (await p.textContent("#pass-progress")) === "3/5"); }
        const h = await hold(p, "#pass-card");
        const info = cardInfo(h);
        check(`R${round} P${i}: Rolle korrekt`, info.imp === exp.imposters.includes(i));
        if (info.imp) check(`R${round} P${i}: Imposter ohne Tipp`, h.text.includes("keinen Tipp"));
        else check(`R${round} P${i}: Wort korrekt`, info.word === exp.word);
        check(`R${round} P${i}: Weiter-Knopf sichtbar`, await p.isVisible("#pass-next"));
        await p.tap("#pass-next"); await wait(p, 350);
      }
      check(`R${round}: „Alle bereit“`, (await screen(p)) === "ready");
      check(`R${round}: Startspieler angezeigt`, (await p.textContent("#ready-starter")).includes(g.names[exp.starter - 1] || `Spieler ${exp.starter}`));
      if (round === 1) {
        await p.reload();
        check("Neuladen auf „Alle bereit“ bleibt dort", (await screen(p)) === "ready");
        await p.tap("#screen-ready [data-action=reveal]"); await sheetOk(p); await wait(p, 500);
        check("Auflösung ohne Tipp-Zeile", !(await p.textContent("#sheet-body")).includes("Tipp für"));
        await p.tap("#sheet-ok"); await wait(p);
        await p.tap("[data-action=pass-new-round]");
      }
    }
    await p.tap("#screen-ready [data-action=edit-players]");
    await p.tap('[data-step=players][data-delta="-1"]');
    await p.tap("#start-btn");
    const g2 = L.decodeCode(await p.evaluate(() => JSON.parse(localStorage.getItem("imposter-state-v2")).pass.code));
    check("Herumreichen: Spieler ändern → 4 Spieler, Stapel bei 2", g2.players === 4 && g2.offset === 2 && (await p.textContent("#pass-progress")) === "1/4");
    await p.context().close();
  }

  /* ------------------------------------------------------------ Darstellung aller Wörter */
  section("Jedes Wort passt auf die Karte (320 px)");
  {
    const p = await phone(SMALL);
    await p.goto(URL);
    const all = L.CATEGORIES.flatMap((c) => c.words);
    const overflow = await p.evaluate((pairs) => {
      const sec = document.getElementById("screen-card");
      document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
      sec.classList.add("active");
      const back = document.getElementById("my-card-back");
      document.getElementById("my-card").classList.add("open");
      const bad = [];
      for (const [w, h] of pairs) for (const t of [w, h]) {
        back.innerHTML = `<div class="tag">Dein Wort</div><div class="word">${t}</div>`;
        const el = back.querySelector(".word");
        if (el.scrollWidth > back.clientWidth || back.scrollHeight > back.clientHeight + 1) bad.push(t);
      }
      return bad;
    }, all);
    check(`alle ${all.length * 2} Wörter/Tipps passen ohne Überlauf`, overflow.length === 0, overflow.slice(0, 10).join(", "));
    await p.context().close();
  }

  /* ------------------------------------------------------------ Barrierefreiheit */
  section("Bewegung reduzieren / Tastatur");
  {
    const p = await phone(IPHONE, { reducedMotion: "reduce" });
    await p.goto(URL); await p.tap("[data-action=setup-pass]"); await p.tap("[data-action=start]");
    const b = await p.locator("#pass-card").boundingBox();
    await p.mouse.move(b.x + 40, b.y + 40); await p.mouse.down(); await wait(p, 250);
    const t = await p.$eval("#pass-card .flip-inner", (e) => getComputedStyle(e).transform);
    const o = await p.$eval("#pass-card-back", (e) => getComputedStyle(e).opacity);
    check("reduzierte Bewegung: Überblenden statt Drehen", t === "none" && o === "1");
    await p.mouse.up();
    await p.focus("#pass-card"); await p.keyboard.down(" ");
    check("Tastatur: Leertaste hält Karte offen", await p.$eval("#pass-card", (e) => e.classList.contains("open")));
    await p.keyboard.up(" ");
    check("Tastatur: Loslassen verdeckt", !(await p.$eval("#pass-card", (e) => e.classList.contains("open"))));
    await p.context().close();
  }

  section("Fehler im Browser");
  check("keine JS-Fehler und keine Browser-Popups", errors.length === 0, errors.slice(0, 5).join(" | "));

  await browser.close();
  const ok = report("End-to-End-Tests");
  process.exit(ok ? 0 : 1);
})().catch(async (e) => { console.error(e); if (browser) await browser.close(); process.exit(1); });
