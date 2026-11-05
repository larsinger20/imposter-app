// Logik- und Wortlisten-Tests. Start: node tests/logic.test.js
"use strict";
const { ROOT, check, warn, section, report, loadLogic, fs, path } = require("./lib");
const L = loadLogic();
const { CATEGORIES, WORD_GENERATIONS, ALPHABET, encodeCode, decodeCode, computeRound } = L;

/* ---------------------------------------------------------------- Wortliste */
section("Wortliste");
const all = [];
CATEGORIES.forEach((c, ci) => c.words.forEach(([w, h], wi) => all.push({ w, h, cat: c.id, ci, wi })));
check("14 Kategorien (Code hat Platz für max. 14)", CATEGORIES.length <= 14, `${CATEGORIES.length}`);
check("Kategorie-IDs eindeutig", new Set(CATEGORIES.map((c) => c.id)).size === CATEGORIES.length);
check("mindestens 1000 Wortpaare", all.length >= 1000, `${all.length}`);
for (const c of CATEGORIES) check(`Kategorie ${c.id} hat ≥ 40 Wörter`, c.words.length >= 40, `${c.words.length}`);

const seen = new Map();
const allowed = /^[A-Za-zÄÖÜäöüßéÉèà0-9 .,'’\-]+$/;
for (const { w, h, cat } of all) {
  check(`Paar vollständig: ${w}`, typeof w === "string" && typeof h === "string" && w && h);
  check(`kein Leerraum am Rand: ${w}/${h}`, w === w.trim() && h === h.trim() && !/\s\s/.test(w + h));
  check(`erlaubte Zeichen: ${w}/${h}`, allowed.test(w) && allowed.test(h));
  check(`Wort nicht zu lang: ${w}`, w.length <= 26, `${w.length} Zeichen`);
  const k = w.toLowerCase();
  check(`Wort doppelt: ${w}`, !seen.has(k), seen.has(k) ? `${seen.get(k)} und ${cat}` : "");
  seen.set(k, cat);
  const wl = w.toLowerCase(), hl = h.toLowerCase();
  check(`Tipp ≠ Wort: ${w}`, wl !== hl);
  check(`Tipp steckt nicht im Wort / umgekehrt: ${w} → ${h}`, !wl.includes(hl) && !hl.includes(wl));
  // gemeinsamer Wortstamm (≥ 5 gleiche Anfangsbuchstaben) verrät das Wort zu leicht
  const stem = (a, b) => { let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++; return i; };
  check(`Tipp hat keinen gemeinsamen Wortstamm: ${w} → ${h}`, stem(wl, hl) < 5);
}
// Ähnliche Wörter (eines steckt als ganzes Wort im anderen) -> nur Hinweis
const words = all.map((x) => x.w);
for (const a of words) for (const b of words) {
  if (a !== b && new RegExp(`(^|[ -])${a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[ -])`, "i").test(b)) warn(`ähnliche Wörter: „${a}“ / „${b}“`);
}

section("Wortlisten-Generationen");
check("mindestens eine Generation", WORD_GENERATIONS.length >= 1);
check("höchstens 31 Generationen (Prüfzeichen)", WORD_GENERATIONS.length <= 31);
check("Generation 1 = 800 Wörter (Stand der ersten Codes)", WORD_GENERATIONS[0].reduce((a, b) => a + b, 0) === 800);
WORD_GENERATIONS.forEach((g, gi) => {
  check(`Generation ${gi + 1}: eine Zahl je Kategorie`, g.length === CATEGORIES.length);
  if (gi > 0) check(`Generation ${gi + 1}: wächst nur`, g.every((n, i) => n >= WORD_GENERATIONS[gi - 1][i]));
});
check("letzte Generation = aktuelle Listenlänge", WORD_GENERATIONS[WORD_GENERATIONS.length - 1].every((n, i) => n === CATEGORIES[i].words.length));

/* ---------------------------------------------------------------- Spielregeln */
section("Spielerzahl / Imposter");
for (let p = 3; p <= 20; p++) {
  const max = L.maxImposters(p), rec = L.recommendedImposters(p);
  check(`max. Imposter bei ${p} Spielern ≥ 1`, max >= 1);
  check(`max. Imposter bei ${p} Spielern ≤ 5`, max <= 5);
  check(`Imposter bei ${p} Spielern immer Minderheit`, max < p / 2, `max ${max}`);
  check(`Empfehlung bei ${p} Spielern im erlaubten Bereich`, rec >= 1 && rec <= max, `${rec}`);
}

/* ---------------------------------------------------------------- Codes */
section("Spielcode: Kodieren/Dekodieren");
let roundtrips = 0, rtFail = 0;
const masks = [1, (1 << 14) - 1, 0b101, 1 << 13, 0b10101010101010];
for (let i = 0; i < 40; i++) masks.push(1 + Math.floor(Math.random() * ((1 << 14) - 1)));
for (let p = 3; p <= 20; p++) for (let imp = 1; imp <= L.maxImposters(p); imp++) for (const mask of masks) for (const hints of [true, false]) {
  for (const gen of [...WORD_GENERATIONS.keys()]) for (const offset of [0, 1, 37, 1023]) {
    const c = encodeCode({ players: p, imposters: imp, mask, hints }, undefined, offset, gen);
    const g = decodeCode(c);
    roundtrips++;
    if (!g || g.players !== p || g.imposters !== imp || g.mask !== mask || g.hints !== hints || g.offset !== offset || g.gen !== gen || g.code !== c) rtFail++;
    if (c.length !== (offset ? 11 : 9)) rtFail++;
  }
}
check(`${roundtrips} Codes kodieren & dekodieren verlustfrei`, rtFail === 0, `${rtFail} Fehler`);
const sample = encodeCode({ players: 7, imposters: 2, mask: 3, hints: true });
check("Kleinbuchstaben, Bindestriche und Leerzeichen werden akzeptiert", decodeCode(" " + L.formatCode(sample).toLowerCase().replace("-", " - ")) !== null);
check("formatCode gruppiert in Dreier", /^\w{3}-\w{3}-\w{3}$/.test(L.formatCode(sample)));
check("11-stellige Codes werden 3-3-3-2 formatiert", /^\w{3}-\w{3}-\w{3}-\w{2}$/.test(L.formatCode(encodeCode({ players: 7, imposters: 2, mask: 3, hints: true }, "ABC", 5))));
for (const bad of ["", "ABC", "ABCDEFGH", "ABCDEFGHJK", "ABCDEFGHJKLM", "0OI1Z2345", "!!!!!!!!!"]) check(`ungültig: „${bad}“`, decodeCode(bad) === null);
// fachlich unmögliche Werte
const forge = (body) => { for (let k = 1; k <= WORD_GENERATIONS.length; k++) { const c = body + ALPHABET[(L.hashString(body) + k) % 32]; if (decodeCode(c)) return c; } return null; };
check("0 Imposter wird abgelehnt", forge("ABC" + ALPHABET[4] + ALPHABET[0] + "ZZZ") === null);
check("zu viele Imposter wird abgelehnt", forge("ABC" + ALPHABET[0] + ALPHABET[2] + "ZZZ") === null);
check("mehr als 20 Spieler wird abgelehnt", forge("ABC" + ALPHABET[20] + ALPHABET[1] + "ZZZ") === null);
check("keine Kategorie wird abgelehnt", forge("ABC" + ALPHABET[4] + ALPHABET[1] + "222") === null && forge("ABC" + ALPHABET[4] + ALPHABET[1] + "223") === null);
check("Code aus „zukünftiger“ Generation wird abgelehnt", (() => { const body = "ABC" + ALPHABET[4] + ALPHABET[1] + "ZZZ"; return decodeCode(body + ALPHABET[(L.hashString(body) + WORD_GENERATIONS.length + 1) % 32]) === null; })());

// Tippfehler-Erkennung: jede Ein-Zeichen-Änderung an echten Codes
let typos = 0, caught = 0;
for (let i = 0; i < 300; i++) {
  const c = encodeCode({ players: 3 + (i % 18), imposters: 1, mask: 1 + (i * 97) % ((1 << 14) - 1), hints: i % 2 === 0 }, undefined, i % 3 ? 0 : i);
  for (let pos = 0; pos < c.length; pos++) for (const ch of ALPHABET) {
    if (ch === c[pos]) continue;
    typos++;
    const g = decodeCode(c.slice(0, pos) + ch + c.slice(pos + 1));
    if (!g) caught++;
  }
}
const rate = caught / typos;
console.log(`  Tippfehler-Erkennung: ${(rate * 100).toFixed(1)} % von ${typos} Ein-Zeichen-Fehlern werden abgelehnt`);
check("mindestens 85 % der Tippfehler werden erkannt", rate >= 0.85, `${(rate * 100).toFixed(1)} %`);

/* ---------------------------------------------------------------- Runden */
section("Runden: Imposter, Startspieler, Wörter");
let roundChecks = 0, roundFail = 0;
for (let p = 3; p <= 20; p++) for (let imp = 1; imp <= L.maxImposters(p); imp++) {
  const g = decodeCode(encodeCode({ players: p, imposters: imp, mask: (1 << 14) - 1, hints: true }));
  for (let r = 1; r <= 30; r++) {
    const a = computeRound(g, r), b = computeRound(g, r);
    roundChecks++;
    const ok = a.imposters.length === imp && new Set(a.imposters).size === imp &&
      a.imposters.every((x) => Number.isInteger(x) && x >= 1 && x <= p) &&
      a.imposters.every((x, i, arr) => i === 0 || arr[i - 1] < x) &&
      a.starter >= 1 && a.starter <= p && JSON.stringify(a) === JSON.stringify(b) &&
      typeof a.word === "string" && typeof a.hint === "string";
    if (!ok) roundFail++;
  }
}
check(`${roundChecks} Runden: richtige Imposter-Zahl, gültige Plätze, deterministisch`, roundFail === 0, `${roundFail} Fehler`);

// Keine Wiederholung, bis der Stapel durch ist – für jede Generation und viele Kategorie-Kombis
let stackFail = [];
for (const gen of WORD_GENERATIONS.keys()) for (const mask of masks.slice(0, 15)) {
  const g = decodeCode(encodeCode({ players: 6, imposters: 2, mask, hints: true }, undefined, 0, gen));
  const sizes = WORD_GENERATIONS[gen];
  const poolSize = CATEGORIES.reduce((n, c, i) => n + (mask & (1 << i) ? sizes[i] : 0), 0);
  const set = new Set();
  for (let r = 1; r <= poolSize; r++) set.add(computeRound(g, r).word);
  if (set.size !== poolSize) stackFail.push(`gen ${gen + 1} mask ${mask}: ${set.size}/${poolSize}`);
  // nur Wörter aus gewählten Kategorien und der richtigen Generation
  const allowedWords = new Set();
  CATEGORIES.forEach((c, i) => { if (mask & (1 << i)) c.words.slice(0, sizes[i]).forEach(([w]) => allowedWords.add(w)); });
  if ([...set].some((w) => !allowedWords.has(w))) stackFail.push(`gen ${gen + 1} mask ${mask}: fremde Wörter`);
  if (computeRound(g, poolSize + 1).word !== computeRound(g, 1).word) stackFail.push(`gen ${gen + 1} mask ${mask}: Neustart nach Stapelende`);
}
check("keine Wiederholung bis Stapelende, nur gewählte Kategorien, danach von vorn", stackFail.length === 0, stackFail.slice(0, 3).join("; "));
check("Tipp gehört zum Wort", (() => { const g = decodeCode(encodeCode({ players: 5, imposters: 1, mask: (1 << 14) - 1, hints: true })); const map = new Map(all.map((x) => [x.w, x.h])); for (let r = 1; r <= 300; r++) { const x = computeRound(g, r); if (map.get(x.word) !== x.hint) return false; } return true; })());
check("verschiedene Spiele mischen unterschiedlich", (() => { const a = decodeCode(encodeCode({ players: 5, imposters: 1, mask: 3, hints: true }, "AAA")); const b = decodeCode(encodeCode({ players: 5, imposters: 1, mask: 3, hints: true }, "BBB")); let same = 0; for (let r = 1; r <= 20; r++) if (computeRound(a, r).word === computeRound(b, r).word) same++; return same < 5; })());

section("Fairness (20.000 Runden)");
for (const [p, imp] of [[4, 1], [8, 2], [13, 4], [20, 5]]) {
  const impCount = Array(p + 1).fill(0), startCount = Array(p + 1).fill(0);
  let impStarts = 0, N = 0;
  for (let gi = 0; gi < 40; gi++) {
    const g = decodeCode(encodeCode({ players: p, imposters: imp, mask: (1 << 14) - 1, hints: true }));
    for (let r = 1; r <= 500; r++) { const x = computeRound(g, r); x.imposters.forEach((s) => impCount[s]++); startCount[x.starter]++; if (x.imposters.includes(x.starter)) impStarts++; N++; }
  }
  const expImp = (N * imp) / p, expStart = N / p;
  const devImp = Math.max(...impCount.slice(1).map((c) => Math.abs(c - expImp) / expImp));
  const devStart = Math.max(...startCount.slice(1).map((c) => Math.abs(c - expStart) / expStart));
  console.log(`  ${p} Spieler/${imp} Imposter: Imposter-Abweichung max ${(devImp * 100).toFixed(1)} %, Startspieler ${(devStart * 100).toFixed(1)} %, Imposter fängt an ${(impStarts / N * 100).toFixed(1)} % (erwartet ${(imp / p * 100).toFixed(1)} %)`);
  check(`${p} Spieler: jeder Platz gleich oft Imposter (±8 %)`, devImp < 0.08);
  check(`${p} Spieler: jeder Platz gleich oft Startspieler (±8 %)`, devStart < 0.08);
}

section("Spieler ändern (Wortstapel läuft weiter)");
for (const gen of WORD_GENERATIONS.keys()) {
  const A = decodeCode(encodeCode({ players: 6, imposters: 2, mask: (1 << 14) - 1, hints: true }, undefined, 0, gen));
  const played = [];
  for (let r = 1; r <= 9; r++) played.push(computeRound(A, r).word);
  const B = decodeCode(encodeCode({ players: 9, imposters: 3, mask: A.mask, hints: A.hints }, A.seed, A.offset + 9, A.gen));
  check(`gen ${gen + 1}: nach Änderung = nächstes Wort`, computeRound(B, 1).word === computeRound(A, 10).word);
  check(`gen ${gen + 1}: Generation & Kategorien bleiben`, B.gen === A.gen && B.mask === A.mask && B.seed === A.seed);
  for (let r = 1; r <= 5; r++) played.push(computeRound(B, r).word);
  const C = decodeCode(encodeCode({ players: 3, imposters: 1, mask: B.mask, hints: B.hints }, B.seed, B.offset + 5, B.gen));
  const total = WORD_GENERATIONS[gen].reduce((a, b) => a + b, 0);
  for (let r = 1; r <= total - 14; r++) played.push(computeRound(C, r).word);
  check(`gen ${gen + 1}: ${total} Runden über 3 Spiele ohne Wiederholung`, new Set(played).size === total, `${new Set(played).size}`);
}

section("Rückwärtskompatibilität (laufende Spiele)");
const fx = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures-v1.json"), "utf8"));
for (const game of fx.games) {
  const g = decodeCode(game.code);
  // Tipps dürfen nachträglich verbessert werden – Wort, Imposter und Startspieler müssen gleich bleiben.
  const key = (x) => JSON.stringify([x.word, x.imposters, x.starter]);
  const same = g && game.rounds.every((exp, i) => key(computeRound(g, i + 1)) === key(exp));
  check(`Code ${game.code} liefert exakt dieselben ${game.rounds.length} Runden wie vorher`, !!same);
}

section("Namen");
check("Komma/Zeilenumbruch werden entfernt", L.cleanName("Jonas, der\nGroße") === "Jonas der Große");
check("Namen werden auf 16 Zeichen gekürzt", L.cleanName("A".repeat(30)).length === 16);
check("nur Leerzeichen = kein Name", L.cleanName("   ") === "");
check("namesFor: alle leer -> null", L.namesFor(["", " "], 4) === null);
check("namesFor: passende Länge", L.namesFor(["Lisa"], 5).length === 5);
check("HTML wird escaped", L.esc(`<img src=x onerror="a">'&`) === "&lt;img src=x onerror=&quot;a&quot;&gt;&#39;&amp;");

const ok = report("Logik-Tests");
process.exit(ok ? 0 : 1);
