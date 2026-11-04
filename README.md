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
800 deutsche Wortpaare (Wort + passender Tipp) in 14 Kategorien, direkt in `words.js`.
Es wird keine Datenbank gebraucht: Die Liste wird einfach mit der Seite geladen.
Innerhalb eines Spiels (ein Code, beliebig viele Runden) wiederholt sich kein Wort, bis alle durch sind.

## GitHub Pages aktivieren
Repository → **Settings → Pages** → Source: „Deploy from a branch“ → Branch `main` / `(root)` → Save.
Danach ist die App unter `https://<benutzername>.github.io/imposter-app/` erreichbar.

## Wörter ergänzen
In `words.js` – neue Wörter nur **am Ende** einer Kategorie anhängen (neue Kategorien ans Ende der Liste, max. 14), damit bestehende Codes gleich bleiben.
