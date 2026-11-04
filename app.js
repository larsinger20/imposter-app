"use strict";

/* ===================== Hilfsfunktionen ===================== */
const $ = (sel) => document.querySelector(sel);
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // ohne 0/O/1/I – leichter abzutippen
const MIN_PLAYERS = 3, MAX_PLAYERS = 20, MAX_IMPOSTERS = 5;
const STORE_KEY = "imposter-state-v1";

function hashString(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function recommendedImposters(players) {
  return Math.max(1, Math.min(MAX_IMPOSTERS, Math.floor(players / 3)));
}
function maxImposters(players) {
  return Math.min(MAX_IMPOSTERS, Math.max(1, Math.ceil(players / 2) - 1));
}
function storageGet() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
}
function storageSet(obj) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(obj)); } catch { /* egal */ }
}

/* ===================== Spielcode ===================== */
// Aufbau (9 Zeichen): 4x Zufall | Spieler | Imposter | 2x Kategorien+Tipp | Prüfzeichen
function encodeCode(cfg) {
  let s = "";
  for (let i = 0; i < 4; i++) s += ALPHABET[Math.floor(Math.random() * 32)];
  s += ALPHABET[cfg.players - MIN_PLAYERS];
  s += ALPHABET[cfg.imposters];
  const bits = (cfg.mask << 1) | (cfg.hints ? 1 : 0); // max 9 Bit
  s += ALPHABET[bits >> 5] + ALPHABET[bits & 31];
  s += ALPHABET[hashString(s) % 32];
  return s;
}
function cleanCode(input) {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "");
}
function decodeCode(raw) {
  const s = cleanCode(raw);
  if (s.length !== 9) return null;
  for (const ch of s) if (!ALPHABET.includes(ch)) return null;
  if (ALPHABET[hashString(s.slice(0, 8)) % 32] !== s[8]) return null;
  const players = ALPHABET.indexOf(s[4]) + MIN_PLAYERS;
  const imposters = ALPHABET.indexOf(s[5]);
  const bits = (ALPHABET.indexOf(s[6]) << 5) | ALPHABET.indexOf(s[7]);
  const hints = (bits & 1) === 1;
  const mask = bits >> 1;
  if (players > MAX_PLAYERS || imposters < 1 || imposters > maxImposters(players) || mask === 0) return null;
  return { code: s, players, imposters, hints, mask };
}
function formatCode(s) {
  return s.slice(0, 3) + "-" + s.slice(3, 6) + "-" + s.slice(6, 9);
}

/* ===================== Runde berechnen ===================== */
// Alles deterministisch aus Code + Rundennummer -> alle Handys kommen aufs gleiche Ergebnis.
function computeRound(game, round) {
  const pool = [];
  CATEGORIES.forEach((cat, idx) => {
    if (game.mask & (1 << idx)) cat.words.forEach((w) => pool.push(w));
  });
  const order = shuffle(pool.map((_, i) => i), mulberry32(hashString(game.code + ":words")));
  const [word, hint] = pool[order[(round - 1) % order.length]];

  const rng = mulberry32(hashString(game.code + ":round:" + round));
  const seats = shuffle(Array.from({ length: game.players }, (_, i) => i + 1), rng);
  const imposters = seats.slice(0, game.imposters).sort((a, b) => a - b);
  const starter = Math.floor(rng() * game.players) + 1;
  return { word, hint, imposters, starter };
}

/* ===================== Zustand ===================== */
const state = {
  mode: "multi",            // "multi" | "pass"
  setup: { players: 6, imposters: 2, hints: true, mask: (1 << CATEGORIES.length) - 1 },
  game: null,               // decodierter Code
  round: 1,
  seat: null,               // eigener Platz (multi)
  passIndex: 1,             // aktueller Spieler (pass)
};

function persist() {
  const saved = storageGet();
  saved.setup = state.setup;
  if (state.mode === "multi" && state.game) {
    saved.multi = { code: state.game.code, round: state.round, seat: state.seat };
  }
  storageSet(saved);
}

/* ===================== Navigation ===================== */
function show(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === "screen-" + id));
  window.scrollTo(0, 0);
}
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.add("hidden"), 2200);
}

/* ===================== Setup ===================== */
function renderSetup() {
  const s = state.setup;
  s.imposters = Math.min(Math.max(1, s.imposters), maxImposters(s.players));
  $("#players-out").textContent = s.players;
  $("#imposters-out").textContent = s.imposters;
  $("#imp-hint").textContent = `(empfohlen: ${recommendedImposters(s.players)})`;
  document.querySelector('[data-step="players"][data-delta="-1"]').disabled = s.players <= MIN_PLAYERS;
  document.querySelector('[data-step="players"][data-delta="1"]').disabled = s.players >= MAX_PLAYERS;
  document.querySelector('[data-step="imposters"][data-delta="-1"]').disabled = s.imposters <= 1;
  document.querySelector('[data-step="imposters"][data-delta="1"]').disabled = s.imposters >= maxImposters(s.players);
  $("#hint-toggle").checked = s.hints;

  const chips = $("#category-chips");
  chips.innerHTML = "";
  CATEGORIES.forEach((cat, idx) => {
    const b = document.createElement("button");
    b.className = "chip" + (s.mask & (1 << idx) ? " on" : "");
    b.textContent = `${cat.emoji} ${cat.name}`;
    b.onclick = () => {
      const next = s.mask ^ (1 << idx);
      if (next === 0) return toast("Mindestens eine Kategorie wählen");
      s.mask = next;
      renderSetup();
    };
    chips.appendChild(b);
  });
}
function openSetup(mode) {
  state.mode = mode;
  $("#setup-title").textContent = mode === "multi" ? "Spiel erstellen" : "Handy herumreichen";
  renderSetup();
  show("setup");
}
function stepSetup(key, delta) {
  const s = state.setup;
  if (key === "players") {
    const wasRecommended = s.imposters === recommendedImposters(s.players);
    s.players = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, s.players + delta));
    if (wasRecommended) s.imposters = recommendedImposters(s.players);
  } else {
    s.imposters = Math.min(maxImposters(s.players), Math.max(1, s.imposters + delta));
  }
  renderSetup();
}
function startGame() {
  state.setup.hints = $("#hint-toggle").checked;
  const code = encodeCode(state.setup);
  state.game = decodeCode(code);
  state.round = 1;
  state.seat = null;
  persist();
  if (state.mode === "multi") {
    $("#host-code").textContent = formatCode(code);
    $("#host-info").textContent = gameInfo(state.game);
    show("host");
  } else {
    state.passIndex = 1;
    renderPass();
    show("pass");
  }
}
function gameInfo(g) {
  return `${g.players} Spieler · ${g.imposters} Imposter · ${g.hints ? "mit Tipp" : "ohne Tipp"}`;
}
function shareLink() {
  const url = location.origin + location.pathname + "?g=" + state.game.code;
  const text = `Imposter-Spiel – Code ${formatCode(state.game.code)}`;
  if (navigator.share) {
    navigator.share({ title: "Imposter", text, url }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => toast("Link kopiert ✓"), () => prompt("Link kopieren:", url));
  } else {
    prompt("Link kopieren:", url);
  }
}

/* ===================== Beitreten / Board ===================== */
function joinWithCode(raw) {
  const game = decodeCode(raw);
  if (!game) {
    $("#join-error").textContent = "Ungültiger Code – bitte nochmal prüfen.";
    return false;
  }
  const saved = storageGet().multi;
  const same = saved && saved.code === game.code;
  state.mode = "multi";
  state.game = game;
  state.round = same ? saved.round : 1;
  state.seat = same ? saved.seat : null;
  persist();
  renderBoard();
  show("board");
  return true;
}
function renderBoard() {
  const board = $("#seat-board");
  board.innerHTML = "";
  for (let i = 1; i <= state.game.players; i++) {
    const b = document.createElement("button");
    b.className = "seat" + (state.seat === i ? " mine" : "");
    b.innerHTML = `${i}<small>${state.seat === i ? "du" : "Spieler"}</small>`;
    b.onclick = () => {
      if (state.seat !== i && !confirm(`Bist du wirklich Spieler ${i}?`)) return;
      state.seat = i;
      persist();
      renderCard();
      show("card");
    };
    board.appendChild(b);
  }
}

/* ===================== Karten ===================== */
function cardHTML(r, seat, hints) {
  const isImp = r.imposters.includes(seat);
  if (isImp) {
    return {
      imp: true,
      html: `<div class="big-emoji">🕵️</div>
        <div class="imp-title">Du bist Imposter!</div>
        ${hints ? `<div class="tag">Dein Tipp</div><div class="word">${r.hint}</div>` : `<p class="muted">Du bekommst keinen Tipp – viel Glück!</p>`}
        <p class="muted small">Lass dich nicht erwischen 🤫</p>`,
    };
  }
  return {
    imp: false,
    html: `<div class="tag">Dein Wort</div><div class="word">${r.word}</div>
      <p class="muted small">Unter euch sind Imposter, die das Wort nicht kennen.</p>`,
  };
}
function setupFlip(el, onOpen) {
  el.classList.remove("open");
  el.onclick = () => {
    el.classList.toggle("open");
    if (el.classList.contains("open") && onOpen) onOpen();
  };
  el.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.click(); } };
}
function renderCard() {
  const r = computeRound(state.game, state.round);
  const c = cardHTML(r, state.seat, state.game.hints);
  $("#card-title").textContent = `Spieler ${state.seat}`;
  $("#card-round").textContent = `Runde ${state.round}`;
  const back = $("#my-card-back");
  back.innerHTML = c.html;
  back.classList.toggle("imp", c.imp);
  $("#card-meta").textContent = `${gameInfo(state.game)} · Spieler ${r.starter} beginnt`;
  setupFlip($("#my-card"));
}

/* ===================== Herumreichen ===================== */
function renderPass() {
  const r = computeRound(state.game, state.round);
  const i = state.passIndex;
  $("#pass-title").textContent = `Spieler ${i}`;
  $("#pass-progress").textContent = `${i}/${state.game.players}`;
  $("#pass-front-text").textContent = `Gib das Handy an Spieler ${i}`;
  const c = cardHTML(r, i, state.game.hints);
  const back = $("#pass-card-back");
  back.innerHTML = c.html;
  back.classList.toggle("imp", c.imp);
  $("#pass-next").classList.add("hidden");
  $("#pass-next").textContent = i < state.game.players ? "Verdecken & weitergeben ▶" : "Verdecken & los geht's ▶";
  setupFlip($("#pass-card"), () => $("#pass-next").classList.remove("hidden"));
}
function passNext() {
  $("#pass-card").classList.remove("open");
  if (state.passIndex < state.game.players) {
    state.passIndex++;
    setTimeout(renderPass, 250); // erst zudrehen, dann neuen Inhalt laden
  } else {
    const r = computeRound(state.game, state.round);
    $("#ready-starter").textContent = `Spieler ${r.starter} beginnt.`;
    show("ready");
  }
}

/* ===================== Auflösung ===================== */
function reveal() {
  if (!confirm("Wirklich auflösen? Alle sehen dann das Wort und die Imposter.")) return;
  const r = computeRound(state.game, state.round);
  $("#reveal-word").textContent = r.word;
  $("#reveal-hint").textContent = state.game.hints ? `Tipp für die Imposter: „${r.hint}“` : "";
  $("#reveal-imps").innerHTML = r.imposters.map((n) => `<span>Spieler ${n}</span>`).join("");
  $("#reveal-modal").classList.remove("hidden");
}

/* ===================== Events ===================== */
const actions = {
  home: () => show("home"),
  rules: () => show("rules"),
  "setup-multi": () => openSetup("multi"),
  "setup-pass": () => openSetup("pass"),
  start: startGame,
  share: shareLink,
  "host-join": () => { renderBoard(); show("board"); },
  join: () => {
    const saved = storageGet().multi;
    $("#code-input").value = saved ? formatCode(saved.code) : "";
    $("#join-error").textContent = "";
    show("join");
    $("#code-input").focus();
  },
  "join-submit": () => joinWithCode($("#code-input").value),
  board: () => { renderBoard(); show("board"); },
  reveal,
  "close-modal": () => $("#reveal-modal").classList.add("hidden"),
  "next-round": () => {
    if (!confirm(`Neue Runde starten? (Runde ${state.round + 1})`)) return;
    state.round++;
    persist();
    renderCard();
    toast(`Runde ${state.round} – alle anderen auch „Nächste Runde“ drücken!`);
  },
  "pass-next": passNext,
  "pass-new-round": () => {
    state.round++;
    state.passIndex = 1;
    renderPass();
    show("pass");
  },
};

document.addEventListener("click", (e) => {
  const step = e.target.closest("[data-step]");
  if (step) return stepSetup(step.dataset.step, Number(step.dataset.delta));
  const act = e.target.closest("[data-action]");
  if (act && actions[act.dataset.action]) actions[act.dataset.action]();
});
$("#hint-toggle").addEventListener("change", (e) => { state.setup.hints = e.target.checked; });
$("#code-input").addEventListener("keydown", (e) => { if (e.key === "Enter") actions["join-submit"](); });
$("#code-input").addEventListener("input", (e) => {
  const c = cleanCode(e.target.value).slice(0, 9);
  e.target.value = c.length > 6 ? formatCode(c) : c.length > 3 ? c.slice(0, 3) + "-" + c.slice(3) : c;
  $("#join-error").textContent = "";
});

/* ===================== Start ===================== */
(function init() {
  const saved = storageGet();
  if (saved.setup) Object.assign(state.setup, saved.setup);
  const params = new URLSearchParams(location.search);
  const g = params.get("g");
  if (g) {
    history.replaceState(null, "", location.pathname);
    if (joinWithCode(g)) return;
    $("#code-input").value = g;
    show("join");
  }
})();
