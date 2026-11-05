# 🕵️ Imposter – Partyspiel für vor Ort

Statische Web-App (läuft auf GitHub Pages, kein Server, kein Login).

Alle bekommen dasselbe geheime Wort, nur die 1–5 **Imposter** bekommen ein Tipp-Wort
(z. B. „Italien“ statt „Pizza“). Danach sagt reihum jeder ein Wort und ihr stimmt ab, wer der Imposter ist.

## Modi
- **Jeder mit eigenem Handy:** Einer erstellt das Spiel und teilt den Code bzw. Link. Jeder gibt den Code ein
  und tippt auf dem Board seine Spielernummer an. Wort und Imposter werden aus Code + Rundennummer berechnet –
  dadurch sehen alle Handys dasselbe Spiel, ganz ohne Server. „Nächste Runde“ muss auf allen Handys gedrückt werden.
- **Ein Handy herumreichen:** Jeder deckt nacheinander seine Karte auf und reicht weiter.

## Einstellungen
3–20 Spieler, 1–5 Imposter (Vorschlag: ca. jeder Dritte), Tipp für Imposter an/aus.

## Wörter – ohne Datenbank
1058 deutsche Wortpaare (Wort + bewusst vager Tipp) in 14 Kategorien, direkt in `words.js`.
Es wird keine Datenbank gebraucht: Die Liste wird einfach mit der Seite geladen.
Innerhalb eines Spiels (ein Code, beliebig viele Runden) wiederholt sich kein Wort, bis alle durch sind.
Kommen Spieler dazu oder gehen, über **„👥 Spieler ändern“** (auf dem Board bzw. nach dem Herumreichen) anpassen:
Der Wortstapel läuft einfach weiter. Der neue Code ist dann 11 Zeichen lang, weil er die Position im Stapel enthält.

## GitHub Pages aktivieren
Repository → **Settings → Pages** → Source: „Deploy from a branch“ → Branch `main` / `(root)` → Save.
Danach ist die App unter `https://<benutzername>.github.io/imposter-app/` erreichbar.

## Wörter ergänzen
In `words.js`:
1. Neue Wörter nur **am Ende** einer Kategorie anhängen – nichts löschen, umsortieren oder umbenennen.
2. In `WORD_GENERATIONS` (unten in der Datei) eine neue Zeile mit den neuen Kategorie-Größen anhängen.

Jeder Spielcode merkt sich die Generation der Wortliste. Laufende Spiele behalten so exakt ihre
Wortreihenfolge, neue Spiele bekommen die erweiterte Liste. Tipps dürfen jederzeit verbessert werden.

Nach Änderungen an `style.css`, `app.js` oder `words.js` die Versionsnummer (`?v=…`) in `index.html`
erhöhen, sonst nutzen Handys noch alte Dateien aus dem Cache.

## Tests
```
node tests/logic.test.js   # Wortliste, Spielcodes, Runden, Fairness, Kompatibilität (~3 s)
node tests/e2e.test.js     # Browser-Durchlauf mit mehreren simulierten Handys (Playwright, ~2 min)
```

## Design
Die Oberfläche orientiert sich am Skill `apple-design` (liegt unter `.claude/skills/apple-design/`,
MIT-Lizenz, © Emil Kowalski, Quelle: github.com/emilkowalski/skills): Karte nur sichtbar solange gedrückt,
Dialoge als Bottom Sheet (wegziehbar), Rücksicht auf „Bewegung reduzieren“, „Transparenz reduzieren“ und „Kontrast erhöhen“.
