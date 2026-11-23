# Klausur-Analyse ICS – Internettechnologie Client-Server (WS 2026/27, Prof. Dr.-Ing. Christoph Wunck)

> Grundlage: ausschließlich die lokal gespeicherten Moodle-Daten unter `moodle-data/internettechnologie/` (`ICS Klausurrelevante Themen.pdf`, `ICS-Musterklausur.pdf`, `Modulrahmenbedingungen.pdf`, `Kursplan ICS WS2627.pdf`, Foliensätze LV 1–5 + Ergänzung 2a, `Webserver Docker.pdf`, Forum „Ankündigungen“, Feedbackaufgaben).
> Seitenangaben = PDF-Seite laut `moodle-data/extracted_text/internettechnologie/*.txt` (`--- Page N ---`).
> Alles, was **nicht** wörtlich in den Quellen steht, ist mit **[Inferenz]** markiert.

## 1. Prüfungsform & Regeln (belegt)

| Punkt | Aussage | Quelle |
|---|---|---|
| Form | Klausur, **120 Minuten** | `moodle-data/internettechnologie/files/Modulrahmenbedingungen.pdf` S. 1 |
| Punkte | **100 Punkte** in 6 Aufgaben (Musterklausur) | `moodle-data/internettechnologie/files/ICS-Musterklausur.pdf` S. 1–8 |
| Hilfsmittel | **1 Blatt DIN-A4 beidseitig eigenhändig/handschriftlich beschriftet** mit Notizen | `Modulrahmenbedingungen.pdf` S. 1; `ICS Klausurrelevante Themen.pdf` S. 1; `ICS-Musterklausur.pdf` S. 1 |
| PVL (Zulassung) | **Keine Prüfungsvorleistung** – die 3 Feedbackaufgaben (FA1–FA3) sind **freiwillig** und haben keinen Einfluss auf Zulassung oder Note | `forums/1495481_Ankündigungen.txt`; `Modulrahmenbedingungen.pdf` S. 1 |
| Feedback-Termine | FA1 (HTML/CSS): 26.10.2026 · FA2 (JS/DOM): 30.11.2026 · FA3 (PHP): 04.01.2027 | `Kursplan ICS WS2627.pdf` S. 1 |
| Klausurvorbereitung | **Di, 12.01.2027, 19:00 Uhr** (Videokonferenz, keine Aufzeichnung) | `Kursplan ICS WS2627.pdf` S. 1 |
| Explizit ausgeschlossen | XML: **Namensräume, XML Schema, XSL, XSLT, XPath, XPointer, XLink**; bei DTD: **keine Entities, keine Bedingungen** | `ICS Klausurrelevante Themen.pdf` S. 1 |

**[Inferenz]** Ein offizieller Notenschlüssel liegt nicht vor; bei 100 Punkten entspricht eine **2,x** erfahrungsgemäß etwa **70–84 Punkten** (ab 70 P ≈ 2,7, ab 80 P ≈ 2,0).

## 2. Aufgabentypen der Musterklausur mit Punkten

| Nr. | Themenbereich | Aufgabentypen in der Musterklausur | Punkte | Seiten |
|---|---|---|---:|---|
| 1 | **HTML, DOM** | `<head>` vs. `<body>`, Inline- vs. Block-Elemente erkennen, `action`-Attribut (`<form>`), **DOM-Baum skizzieren** (Element- + Textknoten), Zeichencodierung (`<meta charset="iso-8859-15">`) | **15** | 1 |
| 2 | **CSS** | Selektor-Regel schreiben (`p.colorBlue`), nicht vererbte Eigenschaft nennen, `border-collapse: collapse`, CSS-Regeln zusammenfassen, **Schriftgröße berechnen (Kaskade/Vererbung)**, `:hover`-Pseudoklasse, `position: static`, **Rahmen/Box-Modell skizzieren**, `padding` | **20** | 2–3 |
| 3 | **JavaScript** | `<script>` am Ende von `<body>`, **`for`-Schleife mit `++x` tracen**, `Array.length` (mit `null`), passendes HTML-Element zu `getElementById("insert")` schreiben, Event-Handler für `click` auf `<div>` registrieren | **20** | 4 |
| 4 | **XML, JSON, REST, AJAX** | Wohlgeformt vs. gültig definieren, DTD-Zeilen (`<!ELEMENT>`, `<!ATTLIST>`) erklären, **Tabelle in syntaktisch korrektes JSON übersetzen**, REST CRUD ↔ HTTP-Methoden (`POST/GET/PUT/DELETE`), `XMLHttpRequest` + `onreadystatechange` | **15** | 5 |
| 5 | **HTTP, Webserver** | URL-Query-Trennzeichen (`?` und `&`), Zweck von `GET` vs. `POST`, warum kein `Content-Type` bei `GET`, zwei Verbesserungen von HTTP/2, **URL aus Protokoll/Host/Port/Pfad bauen**, **HTML-Formular aus gegebenem `POST`-Request rekonstruieren**, Apache DocumentRoot (`/var/www/html` bzw. `htdocs`) | **15** | 6–7 |
| 6 | **PHP, Reguläre Ausdrücke** | **PHP-Skript schreiben**, das `$_POST`-Formulardaten aus 5f als `<ul>` ausgibt, Operator `===` erklären, **Regex für 5-stellige PLZ** schreiben, **3× `preg_match($pattern, $text)`-Treffer exakt markieren** | **15** | 8 |

Die Punkte verteilen sich extrem gleichmäßig über **alle 7 Lehrveranstaltungen** (15–20 Punkte je Block). Es gibt kein einzelnes „Monster-Thema“ – man gewinnt die 2,x durch sichere Grundbeherrschung aller 6 Blöcke.

## 3. Themen-Ranking

| Thema | Wahrscheinlichkeit | Begründung mit Quelle | geschätzte Punkte |
|---|---|---|---:|
| **CSS** (Selektoren, Kaskade/Vererbung, Box-Modell, `position`, `float`, Pseudoklassen, Tabellen) | **sehr hoch** | `ICS Klausurrelevante Themen.pdf` LV 2 + Ergänzung 2a; Musterklausur Aufgabe 2 = 20 P (S. 2–3) | 18–20 |
| **JavaScript & DOM** (Unterschiede zu Java, Schleifen/Tracing, Arrays, `getElementById`, Event-Handler, `<script>`-Position) | **sehr hoch** | `ICS Klausurrelevante Themen.pdf` LV 3; Musterklausur Aufgabe 3 = 20 P (S. 4) | 18–20 |
| **HTML & DOM-Baum** (Elemente, Inline vs. Block, Formulare/`action`/`method`, DOM-Baum mit Element-/Textknoten, `<meta charset>`) | **sehr hoch** | `ICS Klausurrelevante Themen.pdf` LV 1; Musterklausur Aufgabe 1 = 15 P (S. 1) | 15 |
| **HTTP & Webserver** (URL-Aufbau, `GET` vs. `POST`-Nachrichten, Header `Host`/`Content-Type`/`Content-Length`/`Cookie`/`Set-Cookie`, HTTP/2, Apache) | **sehr hoch** | `ICS Klausurrelevante Themen.pdf` LV 6; Musterklausur Aufgabe 5 = 15 P (S. 6–7) | 15 |
| **XML & DTD** (Wohlgeformtheit vs. Gültigkeit, `<!ELEMENT>` mit `#PCDATA`/Quantifizierern, `<!ATTLIST>` mit `CDATA`/`#REQUIRED`/`#IMPLIED`) | **sehr hoch** | `ICS Klausurrelevante Themen.pdf` LV 4; Musterklausur Aufgabe 4a–b (S. 5) | 6–8 |
| **JSON, RESTful & Ajax** (JSON-Syntax/Objekte, REST CRUD ↔ HTTP, `XMLHttpRequest`, `onreadystatechange`, **UML-Sequenzdiagramm für Ajax**) | **sehr hoch** | `ICS Klausurrelevante Themen.pdf` LV 5 (nennt UML-Sequenzdiagramm explizit!); Musterklausur Aufgabe 4c–e (S. 5) | 7–10 |
| **PHP** (Arbeitsteilung Webserver ↔ PHP-Prozessor, `$_GET`/`$_POST`/`$_COOKIE`, `setcookie()`, `===`, einfache HTML-Ausgabe) | **sehr hoch** | `ICS Klausurrelevante Themen.pdf` LV 6; Musterklausur Aufgabe 6a–b (S. 8) | 7–9 |
| **Reguläre Ausdrücke in PHP** (Syntax `\d`, `\D`, `\s`, `[^...]`, `{n}`, greedy `.*`, `preg_match()`, `preg_replace()`) | **sehr hoch** | `ICS Klausurrelevante Themen.pdf` LV 7; Musterklausur Aufgabe 6c–d (S. 8) | 6–8 |
| **Grundlagen Internet & WWW** (Geschichte, TCP/IP, DNS, Grundbegriffe) | **niedrig** | In LV 1 enthalten, aber weder in `ICS Klausurrelevante Themen.pdf` hervorgehoben noch in der Musterklausur direkt abgefragt | 0–3 |
| **Docker / lokale Arbeitsumgebung** | **niedrig** | Hilfsmittel für Feedbackaufgaben (`Webserver Docker.pdf`), nicht in Klausurthemen | 0 |

## 4. Strategie für 2,x (Ziel ≥ 75 Punkte)

1. **Alle 6 Aufgabenblöcke sicher auf 75–85 % bringen** statt einzelne Themen perfekt und andere gar nicht zu können: jeder Block bringt 15–20 Punkte.
2. **Das beidseitig handgeschriebene DIN-A4-Blatt optimal belegen** (erlaubt laut `Modulrahmenbedingungen.pdf`!):
   - **HTML/CSS:** Liste häufiger Inline- vs. Block-Elemente, Box-Modell-Skizze (`content → padding → border → margin`), `border-collapse`, `position`-Werte (`static/relative/absolute/fixed`), nicht vererbte CSS-Eigenschaften (`border`, `margin`, `padding`, `background`, `width`/`height`).
   - **JS/DOM:** Unterschiede Java ↔ JS (`let/var/const`, dynamische Typen, `===` vs `==`, Arrays), `document.getElementById(...)`, `addEventListener("click", fn)` vs. `onclick`.
   - **XML/DTD & JSON/Ajax:** Wohlgeformt vs. gültig, DTD-Syntax (`<!ELEMENT ... (#PCDATA)>`, `*`, `+`, `?`, `<!ATTLIST ... CDATA #IMPLIED/#REQUIRED>`), JSON-Regeln (doppelte Anführungszeichen, keine trailing commas), REST-CRUD-Tabelle, `XMLHttpRequest`-Ablauf + **UML-Sequenzdiagramm-Schablone**.
   - **HTTP/PHP/Regex:** Muster einer `GET`- und `POST`-Nachricht inkl. aller 5 genannten Header (`Host`, `Content-Type`, `Content-Length`, `Cookie`, `Set-Cookie`), `$_POST`/`$_GET`/`$_COOKIE` + `echo`-Schablone für `<ul>`, Regex-Kurzreferenz (`\d \D \w \W \s \S ^ $ . * + ? {n,m} [...] [^...]`, Delimiter `/.../`).
3. **Standard-Zeichenaufgaben vorab 2–3× auf Papier üben:**
   - DOM-Baum (Textknoten nicht vergessen!)
   - CSS-Box/Rahmen-Skizze
   - UML-Sequenzdiagramm für Ajax (steht explizit auf der Themenliste LV 5!)
   - HTML-Formular ↔ HTTP-`POST`-Request in beide Richtungen übersetzen
4. **Regex-Tracing (`preg_match`) trainieren:** Gieriges (`greedy`) Matching von `.*` ist der Klassiker (Aufgabe 6d: `/[^a-k].*\s/` frisst bis zum **letzten** Leerzeichen!).
5. **Weglassen bei Zeitmangel:** XML-Namensräume, XML Schema (XSD), XSLT/XPath/XLink (explizit ausgeschlossen!), Internet-Geschichte, Docker-Befehle.

## 5. Nicht abgedeckt / unsicher

- **Foliensätze LV 6 (HTTP, Webserver, PHP) und LV 7 (Reguläre Ausdrücke)** liegen im lokalen Moodle-Download vom 21.11.2026 noch nicht als PDF vor (die LVs finden laut Kursplan erst am 01.12. und 15.12.2026 statt). Die Lerninhalte dieser beiden Blöcke basieren auf der Musterklausur, der Themenliste (`ICS Klausurrelevante Themen.pdf`) und den VFH-Kapiteln. Sobald die PDFs online sind, sollten Detailfragen (z. B. genaue Apache-Konfigurationspfade oder `setcookie()`-Beispiele aus den Folien) nachgezogen werden.
- **Keine Musterlösung** zur `ICS-Musterklausur.pdf` vorhanden; die Lösungen in den Karteikarten und Quizfragen wurden anhand der Standards (HTML5, CSS, ECMAScript, HTTP/1.1, PHP/PCRE) geprüft.
- **Kein offizieller Notenschlüssel** in den ICS-Dokumenten veröffentlicht.
