"use strict";

/* ===================== Hilfsfunktionen ===================== */
const $ = (sel) => document.querySelector(sel);
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // ohne 0/O/1/I – leichter abzutippen
const MIN_PLAYERS = 3, MAX_PLAYERS = 20, MAX_IMPOSTERS = 5;
const STORE_KEY = "imposter-state-v2";

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
// Aufbau: 3x Zufall | Spieler | Imposter | 3x Kategorien+Tipp (15 Bit) | [2x Wortstapel-Position] | Prüfzeichen
//  - 9 Zeichen:  neues Spiel, Wortstapel beginnt vorne
//  - 11 Zeichen: nach „Spieler ändern“ – Wortstapel läuft an Position `offset` weiter
// Der Wortstapel hängt nur von Zufall + Kategorien ab, nicht von der Spielerzahl.
// Prüfzeichen = (hash + Generation + 1) % 32 – so steckt die Wortlisten-Generation im Code,
// ohne ihn zu verlängern. Prüfzeichen hash % 32 = Code aus der allerersten Version (läuft weiter wie früher).
const MAX_OFFSET = 32 * 32 - 1;
const CURRENT_GEN = WORD_GENERATIONS.length - 1;
function encodeCode(cfg, seed, offset = 0, gen = CURRENT_GEN) {
  let s = seed || "";
  while (s.length < 3) s += ALPHABET[Math.floor(Math.random() * 32)];
  s += ALPHABET[cfg.players - MIN_PLAYERS];
  s += ALPHABET[cfg.imposters];
  const bits = (cfg.mask << 1) | (cfg.hints ? 1 : 0); // bis 14 Kategorien + Tipp = 15 Bit
  s += ALPHABET[(bits >> 10) & 31] + ALPHABET[(bits >> 5) & 31] + ALPHABET[bits & 31];
  if (offset > 0) s += ALPHABET[(offset >> 5) & 31] + ALPHABET[offset & 31];
  s += ALPHABET[(hashString(s) + gen + 1) % 32];
  return s;
}
function cleanCode(input) {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "");
}
function decodeCode(raw) {
  const s = cleanCode(raw);
  if (s.length !== 9 && s.length !== 11) return null;
  for (const ch of s) if (!ALPHABET.includes(ch)) return null;
  const body = s.slice(0, -1), h = hashString(body);
  const k = (ALPHABET.indexOf(s[s.length - 1]) - (h % 32) + 32) % 32;
  const legacy = k === 0;
  if (legacy && s.length !== 9) return null;
  const gen = legacy ? 0 : k - 1;
  if (gen > CURRENT_GEN) return null; // Tippfehler oder Code aus einer neueren Version
  const players = ALPHABET.indexOf(s[3]) + MIN_PLAYERS;
  const imposters = ALPHABET.indexOf(s[4]);
  const bits = (ALPHABET.indexOf(s[5]) << 10) | (ALPHABET.indexOf(s[6]) << 5) | ALPHABET.indexOf(s[7]);
  const hints = (bits & 1) === 1;
  const mask = bits >> 1;
  const offset = s.length === 11 ? (ALPHABET.indexOf(s[8]) << 5) | ALPHABET.indexOf(s[9]) : 0;
  if (players > MAX_PLAYERS || imposters < 1 || imposters > maxImposters(players) || mask === 0 || mask >= (1 << CATEGORIES.length)) return null;
  const seed = s.slice(0, 3);
  const wordKey = legacy ? s : seed + ":" + mask;
  return { code: s, seed, players, imposters, hints, mask, offset, wordKey, gen };
}
function formatCode(s) {
  return s.match(/.{1,3}/g).join("-");
}

/* ===================== Runde berechnen ===================== */
// Alles deterministisch aus Code + Rundennummer -> alle Handys kommen aufs gleiche Ergebnis.
function computeRound(game, round) {
  const pool = [];
  const sizes = WORD_GENERATIONS[game.gen];
  CATEGORIES.forEach((cat, idx) => {
    if (game.mask & (1 << idx)) cat.words.slice(0, sizes[idx]).forEach((w) => pool.push(w));
  });
  const order = shuffle(pool.map((_, i) => i), mulberry32(hashString(game.wordKey + ":words")));
  const [word, hint] = pool[order[(game.offset + round - 1) % order.length]];

  const rng = mulberry32(hashString(game.code + ":round:" + round));
  const seats = shuffle(Array.from({ length: game.players }, (_, i) => i + 1), rng);
  const imposters = seats.slice(0, game.imposters).sort((a, b) => a - b);
  const starter = Math.floor(rng() * game.players) + 1;
  return { word, hint, imposters, starter };
}

/* ===================== Namen ===================== */
const MAX_NAME_LEN = 16;
function esc(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function cleanName(n) {
  return String(n || "").replace(/[,\n\r]/g, " ").replace(/\s+/g, " ").trim().slice(0, MAX_NAME_LEN);
}
// Liefert ein Namens-Array passend zur Spielerzahl oder null, wenn niemand einen Namen hat.
function namesFor(list, players) {
  const names = Array.from({ length: players }, (_, i) => cleanName(list && list[i]));
  return names.some(Boolean) ? names : null;
}
function playerName(i) {
  const n = state.game && state.game.names && state.game.names[i - 1];
  return n || `Spieler ${i}`;
}

/* ===================== Zustand ===================== */
const state = {
  mode: "multi",            // "multi" | "pass"
  setup: { players: 6, imposters: 2, hints: true, mask: (1 << CATEGORIES.length) - 1, names: [] },
  game: null,               // decodierter Code
  round: 1,
  seat: null,               // eigener Platz (multi)
  passIndex: 1,             // aktueller Spieler (pass)
};

function persist() {
  const saved = storageGet();
  saved.setup = state.setup;
  if (state.mode === "multi" && state.game) {
    saved.multi = { code: state.game.code, round: state.round, seat: state.seat, names: state.game.names };
  }
  if (state.mode === "pass" && state.game) {
    saved.pass = { code: state.game.code, round: state.round, passIndex: state.passIndex, names: state.game.names };
  }
  saved.screen = state.screen;
  saved.at = Date.now();
  storageSet(saved);
}

/* ===================== Navigation ===================== */
function show(id) {
  state.screen = id;
  persist(); // damit nach einem Neuladen (z. B. Handy gesperrt) genau hier weitergemacht wird
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
  const count = CATEGORIES.reduce((n, c, i) => n + (s.mask & (1 << i) ? c.words.length : 0), 0);
  $("#word-count").textContent = `(${count} Wörter – keine Wiederholung innerhalb eines Spiels)`;

  renderNameInputs();

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
function renderNameInputs() {
  const s = state.setup;
  const box = $("#name-inputs");
  // vorhandene Eingaben übernehmen, bevor neu gezeichnet wird
  box.querySelectorAll("input").forEach((inp, i) => { s.names[i] = inp.value; });
  box.innerHTML = "";
  for (let i = 0; i < s.players; i++) {
    const inp = document.createElement("input");
    inp.className = "name-input";
    inp.maxLength = MAX_NAME_LEN;
    inp.placeholder = `Spieler ${i + 1}`;
    inp.value = s.names[i] || "";
    inp.autocomplete = "off";
    inp.oninput = () => { s.names[i] = inp.value; };
    box.appendChild(inp);
  }
}
function openSetup(mode) {
  state.mode = mode;
  state.editing = false;
  $("#setup-title").textContent = mode === "multi" ? "Spiel erstellen" : "Handy herumreichen";
  setSetupEditMode(false);
  renderSetup();
  show("setup");
}
// Spieler ändern: gleiche Kategorien, Wortstapel läuft einfach weiter.
function openEditPlayers() {
  if (!state.game) return;
  state.editing = true;
  state.setup.players = state.game.players;
  state.setup.imposters = state.game.imposters;
  state.setup.names = state.game.names ? state.game.names.slice() : [];
  $("#name-inputs").innerHTML = ""; // Eingaben neu aus state.setup.names aufbauen
  $("#setup-title").textContent = "Spieler ändern";
  setSetupEditMode(true);
  renderSetup();
  show("setup");
}
function setSetupEditMode(on) {
  $("#category-chips").closest(".card").classList.toggle("hidden", on);
  $("#hint-toggle").closest(".card").classList.toggle("hidden", on);
  $("#edit-note").classList.toggle("hidden", !on);
  $("#start-btn").textContent = on ? "Weiterspielen ▶" : "Los geht's ▶";
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
  let code;
  if (state.editing && state.game) {
    const g = state.game;
    // bereits gespielte Runden überspringen -> keine Wiederholung
    const offset = Math.min(MAX_OFFSET, g.offset + state.round);
    code = encodeCode({ ...state.setup, mask: g.mask, hints: g.hints }, g.seed, offset, g.gen);
    state.editing = false;
  } else {
    state.setup.hints = $("#hint-toggle").checked;
    code = encodeCode(state.setup);
  }
  state.game = decodeCode(code);
  state.game.names = namesFor(state.setup.names, state.game.players);
  state.round = 1;
  state.seat = null;
  persist();
  if (state.mode === "multi") {
    renderHost();
    show("host");
  } else {
    state.passIndex = 1;
    renderPass();
    show("pass");
  }
}
function renderHost() {
  $("#host-code").textContent = formatCode(state.game.code);
  $("#host-info").textContent = gameInfo(state.game);
  $("#host-names-note").classList.toggle("hidden", !state.game.names);
  $("#host-continue-note").classList.toggle("hidden", !state.game.offset);
}
function gameInfo(g) {
  return `${g.players} Spieler · ${g.imposters} Imposter · ${g.hints ? "mit Tipp" : "ohne Tipp"}`;
}
function shareLink() {
  const params = new URLSearchParams({ g: state.game.code });
  if (state.game.names) params.set("n", state.game.names.join(","));
  const url = location.origin + location.pathname + "?" + params.toString();
  const text = `Imposter-Spiel – Code ${formatCode(state.game.code)}`;
  if (navigator.share) {
    navigator.share({ title: "Imposter", text, url }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => toast("✓ Link kopiert"), () => showLinkSheet(url));
  } else {
    showLinkSheet(url);
  }
}
function showLinkSheet(url) {
  openSheet({
    title: "Link teilen",
    html: `<p class="muted">Kopiere den Link und schick ihn an alle:</p><input class="share-input" readonly value="${esc(url)}">`,
    ok: "Fertig", cancel: null,
  });
  const inp = $(".share-input");
  inp.addEventListener("focus", () => inp.select());
}

/* ===================== Beitreten / Board ===================== */
function joinWithCode(raw, linkNames) {
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
  game.names = namesFor(linkNames || (same && saved.names), game.players);
  persist();
  renderBoard();
  show("board");
  return true;
}
function renderBoard() {
  const board = $("#seat-board");
  board.innerHTML = "";
  $("#board-help").innerHTML = state.game.names
    ? "Tippe auf <b>deinen eigenen</b> Namen."
    : "Jeder tippt auf <b>seine eigene</b> Nummer – sprecht euch vorher ab, wer welche Nummer hat.";
  for (let i = 1; i <= state.game.players; i++) {
    const b = document.createElement("button");
    const name = state.game.names && state.game.names[i - 1];
    b.className = "seat" + (state.seat === i ? " mine" : "") + (name ? " named" : "");
    b.innerHTML = name
      ? `<span class="seat-name">${esc(name)}</span><small>${state.seat === i ? "du" : "Nr. " + i}</small>`
      : `${i}<small>${state.seat === i ? "du" : "Spieler"}</small>`;
    b.onclick = async () => {
      if (state.seat !== i && !(await openSheet({
        title: `Bist du ${esc(playerName(i))}?`,
        html: `<p class="muted">Danach siehst du deine geheime Karte – nur du darfst draufschauen.</p>`,
        ok: `Ja, ich bin ${esc(playerName(i))}`,
      }))) return;
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
// Karte ist nur sichtbar, solange der Finger drauf liegt – Loslassen verdeckt sofort wieder.
function setupFlip(el, onOpen) {
  el.classList.remove("open");
  const open = () => {
    if (el.classList.contains("open")) return;
    el.classList.add("open");
    haptic();
    if (onOpen) onOpen();
  };
  const close = () => el.classList.remove("open");
  el.onpointerdown = (e) => {
    if (e.button > 0) return;
    e.preventDefault();
    try { el.setPointerCapture(e.pointerId); } catch { /* egal */ }
    open();
  };
  el.onpointerup = close;
  el.onpointercancel = close;
  el.onlostpointercapture = close;
  el.oncontextmenu = (e) => e.preventDefault();
  el.onkeydown = (e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); open(); } };
  el.onkeyup = (e) => { if (e.key === " " || e.key === "Enter") close(); };
  el.onblur = close;
}
function haptic() {
  try { if (navigator.vibrate) navigator.vibrate(8); } catch { /* iOS kann das im Browser nicht */ }
}
function renderCard() {
  const r = computeRound(state.game, state.round);
  const c = cardHTML(r, state.seat, state.game.hints);
  $("#card-title").textContent = playerName(state.seat);
  $("#card-round").textContent = `Runde ${state.round}`;
  const back = $("#my-card-back");
  back.innerHTML = c.html;
  back.classList.toggle("imp", c.imp);
  $("#card-meta").textContent = gameInfo(state.game);
  setStarter($("#card-starter"), r.starter, r.starter === state.seat);
  setupFlip($("#my-card"));
}

/* ===================== Herumreichen ===================== */
function renderPass() {
  const r = computeRound(state.game, state.round);
  const i = state.passIndex;
  $("#pass-title").textContent = playerName(i);
  $("#pass-progress").textContent = `${i}/${state.game.players}`;
  $("#pass-front-text").textContent = `Gib das Handy an ${playerName(i)}`;
  const c = cardHTML(r, i, state.game.hints);
  const back = $("#pass-card-back");
  back.innerHTML = c.html;
  back.classList.toggle("imp", c.imp);
  $("#pass-next").classList.add("hidden");
  $("#pass-next").textContent = i < state.game.players ? `Weiter zu ${playerName(i + 1)} ▶` : "Alle haben ihr Wort ▶";
  setupFlip($("#pass-card"), () => $("#pass-next").classList.remove("hidden"));
}
function passNext() {
  $("#pass-card").classList.remove("open");
  if (state.passIndex < state.game.players) {
    state.passIndex++;
    persist();
    setTimeout(renderPass, 250); // erst zudrehen, dann neuen Inhalt laden
  } else {
    renderReady();
    show("ready");
  }
}

// Gut sichtbarer Hinweis, wer die Runde beginnt (ohne die Karte aufzudecken)
function setStarter(el, seat, isMe) {
  el.innerHTML = isMe
    ? `<span class="starter-icon">🎤</span><span><b>Du beginnst!</b></span>`
    : `<span class="starter-icon">🎤</span><span><b>${esc(playerName(seat))}</b> beginnt</span>`;
  el.classList.toggle("me", isMe);
}
function renderReady() {
  const r = computeRound(state.game, state.round);
  setStarter($("#ready-starter"), r.starter, false);
}

/* ===================== Auflösung ===================== */
async function reveal() {
  const ok = await openSheet({
    title: "Auflösen?",
    html: `<p class="muted">Alle sehen dann das Wort und wer Imposter war.</p>`,
    ok: "Auflösen",
  });
  if (!ok) return;
  const r = computeRound(state.game, state.round);
  await wait(320); // erst runter, dann mit dem Ergebnis wieder hoch
  openSheet({
    title: "Auflösung",
    html: `<p class="muted">Das Wort war</p>
      <div class="reveal-word">${esc(r.word)}</div>
      ${state.game.hints ? `<p class="muted">Tipp für die Imposter: „${esc(r.hint)}“</p>` : ""}
      <p class="muted">${r.imposters.length > 1 ? "Imposter waren" : "Imposter war"}</p>
      <div class="reveal-imps">${r.imposters.map((n) => `<span>${esc(playerName(n))}</span>`).join("")}</div>`,
    ok: "Schließen", cancel: null,
  });
}
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

/* ===================== Dialog (Bottom Sheet) ===================== */
// Gleitet von unten rein und auf demselben Weg wieder raus; lässt sich nach unten wegziehen.
let sheetResolve = null;
function openSheet({ title, html = "", ok = "OK", cancel = "Abbrechen" }) {
  if (sheetResolve) closeSheet(false);
  $("#sheet-title").innerHTML = title;
  $("#sheet-body").innerHTML = html;
  $("#sheet-ok").innerHTML = ok;
  $("#sheet-cancel").textContent = cancel || "";
  $("#sheet-cancel").classList.toggle("hidden", !cancel);
  const layer = $("#sheet");
  layer.classList.add("open");
  layer.setAttribute("aria-hidden", "false");
  setTimeout(() => $("#sheet-ok").focus({ preventScroll: true }), 50);
  return new Promise((res) => { sheetResolve = res; });
}
function closeSheet(result) {
  if (!sheetResolve) return;
  const layer = $("#sheet");
  const panel = layer.querySelector(".sheet");
  panel.style.transition = "";
  panel.style.transform = "";
  layer.classList.remove("open");
  layer.setAttribute("aria-hidden", "true");
  const res = sheetResolve;
  sheetResolve = null;
  res(result);
}
(function setupSheet() {
  const panel = $("#sheet .sheet");
  $("#sheet-ok").onclick = () => closeSheet(true);
  $("#sheet-cancel").onclick = () => closeSheet(false);
  $("#sheet-scrim").onclick = () => closeSheet(false);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheet(false); });

  // Nach unten wegziehen: folgt dem Finger 1:1, nach oben mit Gummiband-Widerstand.
  let drag = null;
  const rubberband = (d, dim, c = 0.55) => (d * dim * c) / (dim + c * d);
  panel.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button, input, a")) return;
    drag = { y: e.clientY, dy: 0, hist: [[e.timeStamp, e.clientY]] };
    panel.setPointerCapture(e.pointerId);
    panel.style.transition = "none";
  });
  panel.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const raw = e.clientY - drag.y;
    drag.dy = raw >= 0 ? raw : -rubberband(-raw, panel.offsetHeight);
    panel.style.transform = `translateY(${drag.dy}px)`;
    drag.hist.push([e.timeStamp, e.clientY]);
    if (drag.hist.length > 5) drag.hist.shift();
  });
  const end = () => {
    if (!drag) return;
    const [t0, y0] = drag.hist[0];
    const [t1, y1] = drag.hist[drag.hist.length - 1];
    const velocity = t1 > t0 ? (y1 - y0) / (t1 - t0) : 0; // px/ms, positiv = nach unten
    const dy = drag.dy;
    drag = null;
    panel.style.transition = "";
    if (dy > panel.offsetHeight * 0.3 || (velocity > 0.5 && dy > 10)) closeSheet(false);
    else panel.style.transform = ""; // federt vom aktuellen Punkt zurück
  };
  panel.addEventListener("pointerup", end);
  panel.addEventListener("pointercancel", end);
})();

/* ===================== Events ===================== */
const actions = {
  home: () => show("home"),
  rules: () => show("rules"),
  "setup-multi": () => openSetup("multi"),
  "setup-pass": () => openSetup("pass"),
  "edit-players": openEditPlayers,
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
  "next-round": async () => {
    const ok = await openSheet({
      title: `Runde ${state.round + 1} starten?`,
      html: `<p class="muted">Alle anderen müssen danach auch „Nächste Runde“ drücken, damit ihr wieder in derselben Runde seid.</p>`,
      ok: "Neue Runde starten",
    });
    if (!ok) return;
    state.round++;
    persist();
    renderCard();
    toast(`✓ Runde ${state.round} gestartet`);
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
  const c = cleanCode(e.target.value).slice(0, 11);
  e.target.value = c ? formatCode(c) : "";
  $("#join-error").textContent = "";
});

// iOS zeigt :active-Feedback nur mit einem Touch-Listener; Karten beim Sperren sofort verdecken.
document.addEventListener("touchstart", () => {}, { passive: true });
document.addEventListener("visibilitychange", () => {
  if (document.hidden) document.querySelectorAll(".flip.open").forEach((f) => f.classList.remove("open"));
});

/* ===================== Start ===================== */
(function init() {
  const saved = storageGet();
  if (saved.setup) Object.assign(state.setup, saved.setup);
  const params = new URLSearchParams(location.search);
  const g = params.get("g");
  if (g) {
    history.replaceState(null, "", location.pathname);
    const n = params.get("n");
    if (joinWithCode(g, n ? n.split(",") : null)) return;
    $("#code-input").value = g;
    show("join");
    return;
  }
  resume(saved);
})();

// Nach einem Neuladen (Handy gesperrt, Tab vom Browser verworfen) zum letzten Spielbildschirm zurück.
function resume(saved) {
  if (!saved.at || Date.now() - saved.at > 12 * 60 * 60 * 1000) return; // altes Spiel von gestern? -> Startseite
  const screen = saved.screen;
  const isPass = screen === "pass" || screen === "ready";
  const isMulti = screen === "host" || screen === "board" || screen === "card";
  const src = isPass ? saved.pass : isMulti ? saved.multi : null;
  const game = src && decodeCode(src.code);
  if (!game) return;
  game.names = namesFor(src.names, game.players);
  state.game = game;
  state.round = src.round || 1;
  if (isPass) {
    state.mode = "pass";
    state.passIndex = Math.min(src.passIndex || 1, game.players);
    if (screen === "pass") renderPass(); else renderReady();
    show(screen);
  } else {
    state.mode = "multi";
    state.seat = src.seat || null;
    if (screen === "card" && state.seat) { renderCard(); show("card"); }
    else if (screen === "host") { renderHost(); show("host"); }
    else { renderBoard(); show("board"); }
  }
}
