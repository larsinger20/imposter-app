// Mini-Testframework ohne Abhängigkeiten.
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
let passed = 0, failed = 0;
const failures = [];
const warnings = [];

function check(name, cond, detail = "") {
  if (cond) { passed++; return true; }
  failed++;
  failures.push(`✗ ${name}${detail ? " – " + detail : ""}`);
  return false;
}
function warn(msg) { warnings.push(msg); }
function section(title) { console.log(`\n▸ ${title}`); }
function report(label) {
  for (const w of warnings) console.log(`  ⚠ ${w}`);
  for (const f of failures) console.log(`  ${f}`);
  console.log(`\n${label}: ${passed} bestanden, ${failed} fehlgeschlagen${warnings.length ? `, ${warnings.length} Hinweise` : ""}`);
  return failed === 0;
}

// Lädt words.js + die DOM-freien Teile von app.js (alles vor dem Abschnitt „Zustand“).
function loadLogic(wordsFile = "words.js", appFile = "app.js") {
  const words = fs.readFileSync(path.join(ROOT, wordsFile), "utf8");
  const app = fs.readFileSync(path.join(ROOT, appFile), "utf8").split("/* ===================== Zustand")[0];
  return new Function(`${words}\n${app}\nreturn { CATEGORIES, WORD_GENERATIONS, ALPHABET, MIN_PLAYERS, MAX_PLAYERS, MAX_IMPOSTERS,
    MAX_OFFSET, CURRENT_GEN, hashString, mulberry32, shuffle, recommendedImposters, maxImposters,
    encodeCode, decodeCode, cleanCode, formatCode, computeRound, esc, cleanName, namesFor };`)();
}

module.exports = { ROOT, check, warn, section, report, loadLogic, fs, path };
