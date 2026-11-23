// Internettechnologie - Client - Server (ICS) — WS 26/27 (Prof. Dr.-Ing. Wunck)
// Grounded in: ICS Klausurrelevante Themen.pdf (LV 1–7), ICS-Musterklausur.pdf (6 Aufgaben, 100 Pkt),
// Foliensätze LV 1–5, CSS-Ergänzung (Foliensatz 2a), Webserver Docker, Kursplan, Modulrahmenbedingungen.
// Hinweis: Für LV 6 (HTTP/Webserver/PHP) und LV 7 (RegEx) liegen keine Foliensätze vor — Inhalte dort
// orientieren sich an Themenliste + Musterklausur (siehe docs/klausur-analyse/ics.md).
export const ICS_DATA = {
  "courseId": "ics",
  "chapters": [
    {
      "id": "ics-html-dom",
      "title": "1. HTML & DOM-Baum (LV 1)",
      "badge": "Aufgabe 1 · 15 Pkt",
      "examWeight": 3,
      "diagram": "dom-tree",
      "sources": [
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 31
        },
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 33
        },
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 34
        },
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 35
        },
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 36
        },
        {
          "title": "ICS-Musterklausur",
          "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
          "page": 1
        },
        {
          "title": "ICS Klausurrelevante Themen",
          "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
          "page": 1
        }
      ],
      "summary": [
        "<strong>Begriffe:</strong> HTML ist eine <em>Auszeichnungssprache</em> (Markup Language) auf Basis von reinem Text. <em>Tag</em> = Markierung (<code>&lt;h1&gt;</code> öffnend, <code>&lt;/h1&gt;</code> schließend). <em>Element</em> = öffnendes Tag + Inhalt + schließendes Tag. <em>Attribut</em> ergänzt das öffnende Tag: <code>&lt;html lang=\"de\"&gt;</code>. Die Regeln stehen in einer DTD (SGML) — Browser beanstanden Verstöße <strong>nicht</strong>, stellen aber ggf. falsch dar.",
        "<strong>Grundgerüst:</strong> <code>&lt;!DOCTYPE html&gt;</code>, <code>&lt;html&gt;</code>, darin <code>&lt;head&gt;</code> = <em>Metadaten</em> (Informationen <em>über</em> das Dokument: <code>&lt;meta charset&gt;</code>, <code>&lt;title&gt;</code> → Text im Browser-Tab/Titelleiste, <code>&lt;link&gt;</code>, <code>&lt;style&gt;</code>) — wird nicht im Anzeigebereich dargestellt; <code>&lt;body&gt;</code> = der <em>anzuzeigende Inhalt</em> im Browserfenster.",
        "<strong>Zeichencodierung:</strong> im <code>&lt;head&gt;</code>: <code>&lt;meta charset=\"utf-8\"&gt;</code> (empfohlen, ganzer Unicode-Zeichensatz) bzw. für erweitertes ASCII <code>&lt;meta charset=\"iso-8859-15\"&gt;</code>. Zusätzlich muss der Editor die Datei in derselben Codierung speichern.",
        "<strong>Block vs. Inline:</strong> <em>Block</em> beginnt auf neuer Zeile: <code>&lt;h1&gt;…&lt;h6&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;li&gt;</code>, <code>&lt;table&gt;</code>, <code>&lt;div&gt;</code>. <em>Inline</em> verhält sich wie Wörter in einer Zeile: <code>&lt;a&gt;</code>, <code>&lt;em&gt;</code>, <code>&lt;img&gt;</code>, <code>&lt;span&gt;</code>. <code>&lt;title&gt;</code> ist weder noch — er steht im <code>&lt;head&gt;</code> und wird nicht im Dokument angezeigt.",
        "<strong>Formulare:</strong> <code>&lt;form action=\"/data/input.php\" method=\"post\"&gt;</code> — <code>action</code> kommt im <code>&lt;form</code>-Element vor; Wert = URL der Ressource (z.B. PHP-Skript), an die die Formulardaten gesendet werden. Eingabefelder: <code>&lt;input type=\"text\" name=\"customerID\"&gt;</code> — der <code>name</code> wird zum Parameternamen.",
        "<strong>DOM (Document Object Model):</strong> objektorientiertes Modell des Dokuments als <em>Baum</em>, liegt im Speicher des Browsers, kann zur Laufzeit (JavaScript) verändert werden. DOM-API: Knoten finden, Knotenattribute lesen/schreiben, zwischen Knoten navigieren. <em>Elementknoten</em> (Tags) und <em>Textknoten</em> (Text, auch Textstücke vor/nach Inline-Elementen sind <strong>eigene</strong> Textknoten)."
      ],
      "feynman": {
        "prompt": "Erkläre einer Kommilitonin, wie der Browser aus `<body><h1>asdf</h1><p>das ist <em>sehr</em> wichtig!</p></body>` einen DOM-Baum macht, und warum `<em>` und `<img>` Inline-Elemente sind.",
        "rubric": [
          "body ist Elternknoten von h1 und p; h1 hat Textknoten \"asdf\".",
          "p hat drei Kinder: Textknoten \"das ist \", Elementknoten em (mit Textknoten \"sehr\"), Textknoten \" wichtig!\".",
          "Inline-Elemente fließen wie Wörter in der Zeile, Block-Elemente beginnen auf neuer Zeile.",
          "DOM liegt im Browserspeicher und kann per JavaScript (DOM-API) verändert werden."
        ]
      },
      "cheatSheet": {
        "id": "cs-ics-html",
        "courseId": "ics",
        "title": "ICS LV1: HTML & DOM",
        "content": "head = Metadaten (title → Tab, meta charset, link/style), NICHT im Fenster sichtbar · body = sichtbarer Inhalt.\nBLOCK: h1–h6, p, li, ul, table, div, form · INLINE: a, em, img, span (strong).\ntitle steht im head (weder block noch inline im Dokument).\nCharset: <meta charset=\"utf-8\"> / <meta charset=\"iso-8859-15\">.\nForm: <form action=\"URL-des-Skripts\" method=\"get|post\">, Feldname = name-Attribut.\nDOM: Baum aus Element- & Textknoten im Browserspeicher; JS ändert ihn zur Laufzeit.\nTextknoten-Falle: <p>A <em>B</em> C</p> → p hat 3 Kinder (\"A \", em, \" C\"), em hat Textknoten \"B\".\nimg immer mit alt-Attribut; Tabelle: table > thead/tbody > tr > th/td.",
        "code": "<!DOCTYPE html>\n<html lang=\"de\">\n<head>\n  <meta charset=\"iso-8859-15\">\n  <title>Titel im Tab</title>\n  <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n</head>\n<body>\n  <h1>asdf</h1>\n  <p>das ist <em>sehr</em> wichtig!</p>\n  <form action=\"/data/input.php\" method=\"post\">\n    <input type=\"text\" name=\"customerID\">\n    <input type=\"submit\" value=\"Senden\">\n  </form>\n</body>\n</html>"
      }
    },
    {
      "id": "ics-css",
      "title": "2. CSS: Syntax, Selektoren, Vererbung, Einheiten (LV 2)",
      "badge": "Aufgabe 2 · 20 Pkt",
      "examWeight": 3,
      "sources": [
        {
          "title": "ICS LV 2 (CSS)",
          "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
          "page": 8
        },
        {
          "title": "ICS LV 2 (CSS)",
          "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
          "page": 9
        },
        {
          "title": "ICS LV 2 (CSS)",
          "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
          "page": 10
        },
        {
          "title": "ICS LV 2 (CSS)",
          "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
          "page": 15
        },
        {
          "title": "ICS LV 2 (CSS)",
          "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
          "page": 20
        },
        {
          "title": "ICS LV 2 (CSS)",
          "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
          "page": 28
        },
        {
          "title": "ICS LV 2 (CSS)",
          "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
          "page": 30
        },
        {
          "title": "ICS-Musterklausur",
          "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
          "page": 2
        },
        {
          "title": "ICS-Musterklausur",
          "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
          "page": 3
        },
        {
          "title": "ICS Klausurrelevante Themen",
          "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
          "page": 1
        }
      ],
      "summary": [
        "<strong>Syntax:</strong> <code>Selektor { Eigenschaft: Wert; … }</code>. Einbinden: Inline-Style <code>&lt;p style=\"color:red\"&gt;</code> (abgeraten), <code>&lt;style&gt;</code> im <code>&lt;head&gt;</code>, extern per <code>&lt;link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\"&gt;</code> oder <code>@import url(…);</code>. Zwischen Wert und Einheit <strong>kein</strong> Leerzeichen: <code>12px</code>.",
        "<strong>Selektoren:</strong> Element <code>p</code>, Klasse <code>.redtext</code>, Klasse nur für p <code>p.redtext</code>, ID <code>#absatz1</code> (ID nur einmal pro Dokument!), verschachtelt <code>tbody td</code>, Gruppierung <code>h1, h2, p { … }</code>, Pseudoklassen <code>a:link</code>, <code>:visited</code>, <code>:focus</code>, <code>:hover</code>, <code>:active</code>, Pseudoelemente <code>p::first-letter</code>, <code>p::first-line</code>.",
        "<strong>Spezifität:</strong> Element = 1, Klasse/Pseudoklasse = 10, ID = 100, Inline-Style = 1000; verschachtelt wird addiert: <code>#header .info ul li</code> = 100+10+1+1 = <strong>112</strong>. Höhere Spezifität gewinnt (unabhängig von der Reihenfolge); bei Gleichstand gewinnt die spätere Regel.",
        "<strong>Vererbung:</strong> Textfarbe, Schriftart, Schriftgröße werden an Kindelemente vererbt. <strong>Nicht</strong> vererbt: <code>margin</code>, <code>width</code>, <code>background-color</code> (Standard <code>transparent</code>, daher scheint die Eltern-Farbe durch), <code>border</code>, <code>padding</code>. Erzwingen: <code>background-color: inherit;</code>.",
        "<strong>Einheiten:</strong> <code>%</code> relativ zum umschließenden Element; <code>em</code> = Schrifthöhe des aktuellen Elements — bei <code>font-size</code> bezogen auf die Schriftgröße des <em>Elternelements</em>; <code>rem</code> = Schriftgröße des Wurzelelements <code>html</code>; <code>ex</code> = Höhe des „x“. Absolut: <code>px</code> (1px = 0,75pt = 1/96 in), <code>pt</code>, <code>cm</code>, <code>mm</code>, <code>in</code>, <code>pc</code>.",
        "<strong>Musterklausur-Klassiker:</strong> <code>p.colorBlue { color: blue; }</code> · <code>a:hover { font-weight: bold; }</code> · <code>table { border-collapse: collapse; }</code> · Schriftgröße <code>html{24px}</code> + <code>.anm{0.5rem}</code> → <strong>12px</strong> (rem ignoriert <code>.main</code>!)."
      ],
      "feynman": {
        "prompt": "Ein Absatz `<p class=\"farbig\" id=\"first\">` bekommt von `p`, `.farbig` und `#first` drei verschiedene Farben. Erkläre, welche gewinnt und warum — und warum `background-color` nicht vererbt werden muss, damit die Eltern-Farbe sichtbar ist.",
        "rubric": [
          "Spezifität: ID (100) > Klasse (10) > Element (1) → die Farbe aus #first gewinnt, egal in welcher Reihenfolge die Regeln stehen.",
          "background-color wird nicht vererbt; Standardwert ist transparent, deshalb scheint der Hintergrund des Elternelements durch.",
          "Vererbbare Text-Eigenschaften (color, font-family, font-size) setzt man daher sinnvoll auf html/body."
        ]
      },
      "cheatSheet": {
        "id": "cs-ics-css",
        "courseId": "ics",
        "title": "ICS LV2: CSS Klausur-Essentials",
        "content": "Selektor { eigenschaft: wert; } · kein Leerzeichen: 12px.\nEinbinden: style-Attribut | <style> | <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\"> | @import url(...).\nSelektoren: p · .klasse · p.klasse · #id · a b (Nachfahre) · h1, h2 (Gruppe) · a:link/:visited/:focus/:hover/:active · p::first-letter/::first-line.\nSpezifität: Element 1 · Klasse/Pseudokl. 10 · ID 100 · Inline 1000 (addieren!). Gleichstand → spätere Regel.\nVererbt: color, font-family, font-size. NICHT: margin, padding, border, width, background-color (transparent) → erzwingen mit inherit.\nEinheiten: % (Eltern-Element), em (bei font-size: Eltern-Schriftgröße), rem (html-Schriftgröße), ex, px=0.75pt=1/96in, pt, cm, mm.\nFarben: red · #FF0000 · #35B = #3355BB · rgb(255,0,0) · rgb(100%,0%,0%).\nMK: p.colorBlue{color:blue;} · a:hover{font-weight:bold;} · table{border-collapse:collapse;} · html 24px + .anm 0.5rem → 12px.",
        "code": "p.colorBlue { color: blue; }\na:hover { font-weight: bold; }\ntable { border-collapse: collapse; }\n\n/* Zusammenfassen (MK 2.d) */\nh1, h2, p {\n  color: #ff00ff;\n  font-family: Helvetica, sans-serif;\n}\np {\n  margin-left: 15px;\n  border-bottom: 1px solid #000000;\n}"
      }
    },
    {
      "id": "ics-css-layout",
      "title": "3. CSS: Box-Modell, Positionierung, Float & Website-Beispiele (Foliensatz 2a)",
      "badge": "Aufgabe 2 · Box/Position",
      "examWeight": 3,
      "diagram": "css-box-model",
      "sources": [
        {
          "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
          "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
          "page": 3
        },
        {
          "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
          "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
          "page": 4
        },
        {
          "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
          "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
          "page": 6
        },
        {
          "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
          "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
          "page": 9
        },
        {
          "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
          "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
          "page": 11
        },
        {
          "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
          "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
          "page": 14
        },
        {
          "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
          "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
          "page": 28
        },
        {
          "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
          "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
          "page": 30
        },
        {
          "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
          "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
          "page": 32
        },
        {
          "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
          "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
          "page": 34
        },
        {
          "title": "ICS-Musterklausur",
          "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
          "page": 3
        }
      ],
      "summary": [
        "<strong>Box-Modell</strong> (von innen nach außen): Inhalt → <code>padding</code> (<em>Innenabstand</em>, hat die Hintergrundfarbe des Elements) → <code>border</code> (Rahmen, Farbe über <code>border-color</code>) → <code>margin</code> (<em>Außenabstand</em>, immer transparent). Jede Seite einzeln: <code>padding-top</code>, <code>margin-left</code>, <code>border-bottom-style</code>, …",
        "<strong>Sammeleigenschaften</strong> (Uhrzeigersinn ab oben: top-right-bottom-left): 1 Wert = alle Seiten; 2 Werte = oben/unten, rechts/links; 3 Werte = oben, rechts/links, unten; 4 Werte = oben, rechts, unten, links. Gilt für <code>margin</code>, <code>padding</code>, <code>border-width</code>, <code>border-style</code>, <code>border-color</code>, … → <code>border-width: 1px 5px</code> = oben/unten 1px, links/rechts 5px (MK 2.h).",
        "<strong>Rahmenstile:</strong> <code>none, dotted, dashed, solid, double, groove, ridge, inset, outset</code> (letzte vier mit 3D-Optik), <code>inherit</code>.",
        "<strong>Elementfluss:</strong> Block-Boxen untereinander (so breit wie <code>body</code>, auch mit <code>width</code> nicht nebeneinander); Inline-Boxen horizontal in <em>Line-Boxen</em>. Inline-Boxen: keine Abmessungen, nur horizontale <code>margin</code>. <code>display</code> ändert den Box-Typ (z.B. <code>display: block</code> für Links im Menü).",
        "<strong>position:</strong> <code>static</code> = Standardlayout, keine besondere Positionierung (MK 2.g) · <code>relative</code> = Standardlayout + Verschiebung um <code>top/left/…</code>, der Fluss der anderen Elemente bleibt unverändert · <code>absolute</code> = aus dem Fluss genommen, Koordinaten bezogen auf das umschließende Element · <code>fixed</code> = bezogen auf das Browserfenster, bleibt beim Scrollen stehen.",
        "<strong>float</strong> (<code>left | right | none | inherit</code>): Box wird aus dem Fluss genommen und an den linken/rechten Rand geschoben, Text umfließt sie; <code>clear: left</code> beendet das Umfließen. <strong>Website-Beispiele:</strong> Navigationsmenü (<code>list-style-type:none; float:left; display:block; clear:left</code>), Spendenaufruf (<code>setTimeout(spendeAus, 2000)</code> + <code>remove()</code>), Tage seit Datum (<code>new Date</code>, <code>getTime()</code>), Formular-Begrüßung (<code>formular.anrede.value</code>, <code>innerHTML</code>)."
      ],
      "feynman": {
        "prompt": "Skizziere in Worten die Box eines Absatzes mit `padding: 10px; border: solid; border-width: 1px 5px; margin: 10px 2px 5px;` — welche Seite hat welchen Abstand, welcher Bereich hat welche Farbe?",
        "rubric": [
          "Innen nach außen: Inhalt, padding (10px rundum, Hintergrundfarbe), border, margin (transparent).",
          "border-width 1px 5px: oben und unten 1px dünn, links und rechts 5px dick.",
          "margin 10px 2px 5px: oben 10px, rechts 2px, unten 5px, links 2px (fehlender 4. Wert = Wert von rechts)."
        ]
      },
      "cheatSheet": {
        "id": "cs-ics-css-layout",
        "courseId": "ics",
        "title": "ICS 2a: Box-Modell, position, float, Beispiele",
        "content": "BOX innen→außen: content | padding (Innenabstand, Hintergrundfarbe) | border | margin (Außenabstand, transparent).\nKurzschreibweise T-R-B-L (Uhrzeiger ab oben): 1 Wert alle · 2: T/B R/L · 3: T, R/L, B · 4: T R B L.\nborder-width: 1px 5px → oben/unten 1px, links/rechts 5px. border: 5px solid #333 (Breite Stil Farbe).\nborder-style: none dotted dashed solid double groove ridge inset outset.\nposition: static (Standard!) · relative (verschoben, Fluss bleibt) · absolute (aus Fluss, rel. zum umschließenden Element) · fixed (Browserfenster, scrollt nicht).\nfloat: left/right/none → umflossen; clear: left beendet. display: block/inline ändert Boxtyp.\nInline-Box: keine width/height, nur margin-left/right.\nNav-Menü: nav ul{list-style-type:none;margin:0;padding:0} nav li{float:left} nav li a{display:block;padding:14px 16px;text-decoration:none} h1{clear:left} li a:hover{...}.\nJS-Beispiele: setTimeout(fn, 2000) · el.style.visibility=\"hidden\" (nimmt Platz ein) vs el.remove() · new Date(2023, 9-1, 20) (Monat ab 0!) · getTime() ms.",
        "code": "nav ul { list-style-type: none; margin: 0; padding: 0; }\nnav li { float: left; }\nnav li a {\n  display: block;          /* padding erlauben */\n  padding: 14px 16px;\n  background-color: #555;\n  text-decoration: none;\n}\nh1 { clear: left; }        /* float beenden */\nli a:hover { background-color: #999; color: red; }"
      }
    },
    {
      "id": "ics-js",
      "title": "4. JavaScript im Browser: Einbindung, Funktionen, Events, DOM (LV 3)",
      "badge": "Aufgabe 3 · 20 Pkt",
      "examWeight": 3,
      "sources": [
        {
          "title": "ICS LV 3 (JavaScript)",
          "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
          "page": 3
        },
        {
          "title": "ICS LV 3 (JavaScript)",
          "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
          "page": 4
        },
        {
          "title": "ICS LV 3 (JavaScript)",
          "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
          "page": 5
        },
        {
          "title": "ICS LV 3 (JavaScript)",
          "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
          "page": 16
        },
        {
          "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
          "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
          "page": 30
        },
        {
          "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
          "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
          "page": 34
        },
        {
          "title": "ICS-Musterklausur",
          "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
          "page": 4
        },
        {
          "title": "ICS Klausurrelevante Themen",
          "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
          "page": 1
        }
      ],
      "summary": [
        "<strong>Einbindung:</strong> <code>&lt;script&gt;…&lt;/script&gt;</code> oder <code>&lt;script src=\"./test_03.js\"&gt;&lt;/script&gt;</code>. Code außerhalb von Funktionen läuft <em>beim Laden</em> der Seite, Funktionskörper erst beim Aufruf/Ereignis. <strong>Empfehlung: <code>&lt;script&gt;</code> ans Ende von <code>&lt;body&gt;</code></strong> — dann sind alle HTML-Elemente bereits im DOM vorhanden (sonst liefert <code>getElementById</code> <code>null</code>).",
        "<strong>Ereignisse aktivieren:</strong> (1) <em>Inline-Eventhandler</em> <code>&lt;p onClick=\"andereFunktion()\"&gt;</code> bzw. <code>&lt;a href=\"javascript:eineFunktion()\"&gt;</code> — gelten als schlechter Stil (mischen HTML und JS). (2) Besser: <em>Eventhandler registrieren</em>: <code>const absatz = document.getElementById(\"pclick\"); absatz.addEventListener(\"click\", eineFunktion);</code> — Funktions<strong>referenz ohne ()</strong>!",
        "<strong>Funktionen:</strong> freistehend (kein Klassen-Zwang wie in Java): <code>function quadrat(x) { return x * x; }</code>, Aufruf <code>let q = quadrat(3.0);</code>. Funktionen sind Objekte → in Variablen speicherbar: <code>let f = function() {…}; let g = tuwas; f(); g();</code>",
        "<strong>DOM ↔ JS:</strong> <code>document.getElementById(\"insert\").innerHTML = \"new\";</code> ersetzt den Inhalt des Elements mit <code>id=\"insert\"</code>. Formularwerte: <code>document.getElementById(\"frm\").anrede.value</code>. Stil ändern: <code>el.style.visibility = \"hidden\"</code>; Element löschen: <code>el.remove()</code>. Timer: <code>setTimeout(spendeAus, 2000)</code>.",
        "<strong>Testen:</strong> Ausgabe mit <code>console.log()</code> (bevorzugt, F12 → Konsole) oder modal per <code>alert()</code>. Nach Änderungen <em>Strg+F5</em> (Cache + Ansicht neu). <code>\"use strict\";</code> aktiviert den strikten Modus."
      ],
      "feynman": {
        "prompt": "Gegeben `<div id=\"clickhere\"></div>`. Erkläre Schritt für Schritt, welche JS-Anweisungen `tuwas()` beim Klick aufrufen, wo das `<script>` stehen muss und was bei `addEventListener(\"click\", tuwas())` schiefgeht.",
        "rubric": [
          "Element holen: const el = document.getElementById(\"clickhere\"); dann el.addEventListener(\"click\", tuwas); (oder el.onclick = tuwas;).",
          "Script am Ende von body: sonst existiert das div beim Ausführen noch nicht → getElementById liefert null.",
          "tuwas() mit Klammern ruft die Funktion sofort auf und registriert deren Rückgabewert (undefined) statt der Funktion."
        ]
      },
      "cheatSheet": {
        "id": "cs-ics-js",
        "courseId": "ics",
        "title": "ICS LV3: JavaScript & DOM",
        "content": "<script> ans ENDE von <body>: DOM ist fertig, getElementById findet Elemente, Seitenaufbau nicht blockiert.\nTop-Level-Code läuft beim Laden; Funktionskörper erst beim Aufruf/Event.\nEvent registrieren: el.addEventListener(\"click\", tuwas) — OHNE () ! Alternative: el.onclick = tuwas;\nInline-Handler (onClick=\"f()\", href=\"javascript:f()\") = schlechter Stil.\nDOM: document.getElementById(\"id\") · el.innerHTML = \"neu\" · el.style.visibility = \"hidden\" · el.remove() · formular.feldname.value.\nFunktionen: function f(x){ return x*x; } · let g = f; g(3); · anonyme function(){...}.\nsetTimeout(fn, ms) · new Date(J, M-1, T) (Monat 0-basiert) · getTime() = ms seit 1970.\nTests: console.log (F12) · alert · Strg+F5.\nMK 3.d: <p id=\"insert\"></p> passt zu getElementById(\"insert\").innerHTML = \"new\";",
        "code": "<p id=\"insert\"></p>\n<div id=\"clickhere\"></div>\n<script>\n  function tuwas() { console.log(\"geklickt\"); }\n  const el = document.getElementById(\"clickhere\");\n  el.addEventListener(\"click\", tuwas);\n  document.getElementById(\"insert\").innerHTML = \"new\";\n</script>\n</body>"
      }
    },
    {
      "id": "ics-js-sprache",
      "title": "5. JavaScript vs. Java: Typen, Variablen, Operatoren, Arrays, Objekte (LV 3)",
      "badge": "Aufgabe 3 · Code-Tracing",
      "examWeight": 3,
      "sources": [
        {
          "title": "ICS LV 3 (JavaScript)",
          "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
          "page": 8
        },
        {
          "title": "ICS LV 3 (JavaScript)",
          "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
          "page": 10
        },
        {
          "title": "ICS LV 3 (JavaScript)",
          "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
          "page": 11
        },
        {
          "title": "ICS LV 3 (JavaScript)",
          "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
          "page": 12
        },
        {
          "title": "ICS LV 3 (JavaScript)",
          "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
          "page": 13
        },
        {
          "title": "ICS LV 3 (JavaScript)",
          "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
          "page": 14
        },
        {
          "title": "ICS LV 3 (JavaScript)",
          "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
          "page": 18
        },
        {
          "title": "ICS LV 3 (JavaScript)",
          "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
          "page": 19
        },
        {
          "title": "ICS LV 3 (JavaScript)",
          "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
          "page": 23
        },
        {
          "title": "ICS LV 3 (JavaScript)",
          "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
          "page": 25
        },
        {
          "title": "ICS Klausurrelevante Themen",
          "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
          "page": 1
        }
      ],
      "summary": [
        "<strong>Datentypen:</strong> JS kennt nur <code>number</code> (IEEE 754, 64 Bit = Java-<code>double</code>, auch für ganze Zahlen), <code>bigint</code>, <code>boolean</code>, <code>string</code> (<code>\"asdf\"</code> oder <code>'asdf'</code>), <code>symbol</code>. <strong>Kein <code>char</code></strong> (→ String der Länge 1). Variablen sind nicht typgebunden; Inhalt kann auch <code>null</code> oder <code>undefined</code> sein.",
        "<strong>Variablen:</strong> <code>let i = 123;</code> / <code>const n = 1;</code> (statt Java <code>final</code>) / <code>var i;</code>. <code>var</code> ist <em>nicht blockgebunden</em> (im Block deklariert, außerhalb sichtbar), <code>let</code> schon → außerhalb <em>ReferenceError: b is not defined</em>. Neuer Code: <strong>kein <code>var</code></strong> (Geheimnisprinzip). Globale Variable = Attribut des <code>window</code>-Objekts. <code>;</code> optional.",
        "<strong>Operatoren:</strong> wie Java, aber <code>/</code> liefert immer Gleitkomma (<code>7/2 = 3.5</code>), ganzzahlig mit <code>Math.floor()</code>; Potenz <code>**</code>; zusätzlich <code>===</code> / <code>!==</code> (Vergleich auf Wert <strong>und</strong> Typ); Strings vergleicht man mit <code>==</code> (Java: <code>equals</code>). <code>+</code> verkettet Strings.",
        "<strong>Arrays:</strong> <code>let a = [1, 2, 3]; let b = []; let c = new Array();</code> — wie Java-<code>ArrayList</code> erweiterbar: <code>al[al.length] = 111;</code>. <code>a.length</code> zählt <em>alle</em> Einträge (auch <code>null</code>). Schleifen wie Java + <code>for (let x of arr)</code> (Werte) statt Java-for-each.",
        "<strong>Objekte = Hashtabellen:</strong> <code>let h = { \"eins\": \"one\" }; h[\"drei\"] = \"three\"; h.vier = \"four\";</code> Lesen per Punkt- oder Klammernotation; <code>for (let key in h)</code> zählt die <em>Schlüssel</em> auf. Methoden: <code>stellDichVor: function() { console.log(\"Ich bin \" + this.name); }</code>. Keine Klasse nötig; Konstruktorfunktion <code>function Student(name) { this.name = name; }</code> + <code>new Student(\"Hans\")</code>. (<code>class/extends</code>-Folien sind laut Folie <em>nicht klausurrelevant</em>.)",
        "<strong>Ausnahmen:</strong> <code>throw</code> beliebiger Wert (String, Number, Boolean, Object); <code>catch (err)</code> ohne Typangabe; <code>finally</code> wie Java."
      ],
      "feynman": {
        "prompt": "Erkläre einem Java-Programmierer die fünf wichtigsten Unterschiede zu JavaScript, die er für Code-Tracing-Aufgaben kennen muss.",
        "rubric": [
          "Nur number (64-Bit-Gleitkomma): 7/2 ergibt 3.5; Math.floor für Ganzzahldivision.",
          "Dynamische Typisierung, let/const/var statt Typangabe; var ist nicht blockgebunden, let schon.",
          "=== vergleicht Wert und Typ; Strings werden mit == verglichen.",
          "Objekte sind Hashtabellen ohne Klassenzwang; Zugriff mit obj.attr oder obj[\"attr\"]; for...in liefert Schlüssel, for...of Werte.",
          "Freistehende Funktionen, Funktionen sind Objekte und in Variablen speicherbar."
        ]
      },
      "cheatSheet": {
        "id": "cs-ics-js-sprache",
        "courseId": "ics",
        "title": "ICS LV3: Java ↔ JavaScript-Unterschiede",
        "content": "Typen: number (64-Bit double, auch für Ganzzahlen) · bigint · boolean · string (\"...\" oder '...') · symbol · KEIN char · null/undefined.\nDeklaration: let i = 1; const n = 1; (var vermeiden: nicht blockgebunden). Globale Var. → window-Attribut.\nOperatoren: 7/2 = 3.5 · Math.floor(7/2) = 3 · 2**3 = 8 · === / !== (Wert+Typ) · Strings mit == vergleichen · \"Wert: \"+2+3 = \"Wert: 23\".\nArrays: [3,4,6,null].length = 4 · al[al.length] = x (anhängen) · for (let v of arr) → Werte.\nObjekte: {\"eins\":\"one\"} · h[\"drei\"] = ... · h.vier = ... · for (let k in h) → Schlüssel.\nMethode: obj = { name:\"Hans\", stellDichVor: function(){ console.log(\"Ich bin \" + this.name); } }.\nKonstruktorfunktion: function Student(n){ this.name = n; } let s = new Student(\"Erna\");\nFunktionen: freistehend, function f(x){return x*x;}, let g = f;\nthrow \"Text\"; try {...} catch (err) {...} finally {...}\nfor-Trace MK 3.b: for(let x=0;x<10;x=x+2) log(++x) → 1, 4, 7, 10; Ende bei x = 12; danach x außerhalb nicht definiert (let).",
        "code": "let h = { \"eins\": \"one\", \"zwei\": \"two\" };\nh[\"drei\"] = \"three\";\nh.vier = \"four\";\nfor (let key in h) console.log(key);   // eins zwei drei vier\n\n{ var a = 123; let b = 456; }\nconsole.log(a);   // 123\nconsole.log(b);   // ReferenceError: b is not defined"
      }
    },
    {
      "id": "ics-xml-rest",
      "title": "6. XML: Wohlgeformtheit, Gültigkeit & DTD (LV 4)",
      "badge": "Aufgabe 4 · XML/DTD",
      "examWeight": 3,
      "diagram": "ics-xml-dtd",
      "sources": [
        {
          "title": "ICS LV 4 (XML)",
          "path": "moodle-data/internettechnologie/files/ICS LV 4.pdf",
          "page": 2
        },
        {
          "title": "ICS LV 4 (XML)",
          "path": "moodle-data/internettechnologie/files/ICS LV 4.pdf",
          "page": 19
        },
        {
          "title": "ICS LV 4 (XML)",
          "path": "moodle-data/internettechnologie/files/ICS LV 4.pdf",
          "page": 22
        },
        {
          "title": "ICS LV 4 (XML)",
          "path": "moodle-data/internettechnologie/files/ICS LV 4.pdf",
          "page": 28
        },
        {
          "title": "ICS-Musterklausur",
          "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
          "page": 5
        },
        {
          "title": "ICS Klausurrelevante Themen",
          "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
          "page": 1
        }
      ],
      "summary": [
        "<strong>Klausurumfang laut Themenliste:</strong> XML-Dokumente mit Elementen und Attributen <em>ohne Namensraum</em>, Unterschied Wohlgeformtheit/Gültigkeit, DTD verstehen und erstellen <em>ohne Entities, ohne Bedingungen</em>. <strong>Nicht relevant:</strong> Namensräume, XML Schema, XSL, XSLT, XPath, XPointer, XLink. Die Grundlagen setzt LV 4 aus GP2 voraus.",
        "<strong>Wohlgeformt (well-formed):</strong> das Dokument hält die XML-Syntaxregeln ein: genau <em>ein</em> Wurzelelement, jedes Start-Tag hat ein End-Tag (oder <code>&lt;leer/&gt;</code>), korrekte Verschachtelung (keine Überlappung), Groß-/Kleinschreibung beachtet, Attributwerte in Anführungszeichen, kein Attribut doppelt im selben Tag.",
        "<strong>Gültig (valid):</strong> wohlgeformt <strong>und</strong> entspricht einer Grammatik (DTD), auf die es verweist. Jedes gültige Dokument ist wohlgeformt — nicht umgekehrt. (HTML-Browser sind tolerant; ein XML-Parser bricht bei nicht wohlgeformtem XML ab.)",
        "<strong>DTD – Elemente:</strong> <code>&lt;!ELEMENT person (name, tel)&gt;</code> (Folge, Reihenfolge fest) · <code>&lt;!ELEMENT name (#PCDATA)&gt;</code> (Text) · Häufigkeiten <code>?</code> 0..1, <code>*</code> 0..n, <code>+</code> 1..n, ohne Zeichen genau 1 · Auswahl <code>(a | b)</code> · <code>EMPTY</code> für leere Elemente.",
        "<strong>DTD – Attribute:</strong> <code>&lt;!ATTLIST person relationship CDATA #IMPLIED&gt;</code> = Element <code>person</code> hat Attribut <code>relationship</code> mit beliebigem Text (<code>CDATA</code>), optional (<code>#IMPLIED</code>); <code>#REQUIRED</code> = Pflicht; alternativ Standardwert in Anführungszeichen.",
        "<strong>Einbinden:</strong> <code>&lt;?xml version=\"1.0\" encoding=\"utf-8\"?&gt;</code> (Prolog), extern <code>&lt;!DOCTYPE contacts SYSTEM \"contacts.dtd\"&gt;</code> oder intern <code>&lt;!DOCTYPE contacts [ … ]&gt;</code>. Der Name nach DOCTYPE = Wurzelelement."
      ],
      "feynman": {
        "prompt": "Erkläre an einem Beispiel, warum ein XML-Dokument wohlgeformt, aber trotzdem ungültig sein kann, und schreibe die DTD für `<person relationship=\"work\"><name>Bob</name><tel>0491</tel></person>`.",
        "rubric": [
          "Wohlgeformt = Syntaxregeln (ein Wurzelelement, korrekt verschachtelt/geschlossen, Attributwerte in Quotes, case-sensitiv).",
          "Gültig = wohlgeformt UND konform zur DTD; z.B. fehlt ein Pflichtelement oder es taucht ein nicht deklariertes Element auf → wohlgeformt, aber ungültig.",
          "DTD: <!ELEMENT person (name, tel)> <!ATTLIST person relationship CDATA #IMPLIED> <!ELEMENT name (#PCDATA)> <!ELEMENT tel (#PCDATA)>."
        ]
      },
      "cheatSheet": {
        "id": "cs-ics-xml",
        "courseId": "ics",
        "title": "ICS LV4: XML & DTD",
        "content": "WOHLGEFORMT: 1 Wurzelelement · alle Tags geschlossen (<x/>) · korrekt verschachtelt · case-sensitiv · Attributwerte in \"...\" · Attribut nicht doppelt.\nGÜLTIG: wohlgeformt + entspricht DTD (gültig ⇒ wohlgeformt, nicht umgekehrt).\n<!ELEMENT e (#PCDATA)> Text · <!ELEMENT e (a, b)> Folge · (a | b) Auswahl · EMPTY.\nHäufigkeit: a? 0..1 · a* 0..n · a+ 1..n · a genau 1.\n<!ATTLIST e attr CDATA #IMPLIED> optional · #REQUIRED Pflicht · \"wert\" Default.\nEinbinden: <!DOCTYPE wurzel SYSTEM \"datei.dtd\"> oder <!DOCTYPE wurzel [ ... ]>.\nMK 4.b: <!ELEMENT Listentitel (#PCDATA)> / <!ATTLIST Listentitel kategorie CDATA #IMPLIED> → DTD-Datei: Element Listentitel mit Textinhalt, optionales Textattribut kategorie.\nNICHT klausurrelevant: Namensräume, XSD, XSL/XSLT, XPath, XPointer, XLink, Entities.",
        "code": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!DOCTYPE contacts [\n  <!ELEMENT contacts (person+)>\n  <!ATTLIST contacts owner CDATA #REQUIRED>\n  <!ELEMENT person (name, email?, tel*)>\n  <!ATTLIST person relationship CDATA #IMPLIED>\n  <!ELEMENT name (#PCDATA)>\n  <!ELEMENT email (#PCDATA)>\n  <!ELEMENT tel (#PCDATA)>\n]>\n<contacts owner=\"John Doe\">\n  <person relationship=\"work\">\n    <name>Bob</name>\n    <tel>+49 4921 807-0</tel>\n  </person>\n</contacts>"
      }
    },
    {
      "id": "ics-json-ajax",
      "title": "7. JSON, RESTful Web Services & Ajax (LV 5)",
      "badge": "Aufgabe 4 · JSON/REST/Ajax",
      "examWeight": 3,
      "diagram": "ics-ajax-sequence",
      "sources": [
        {
          "title": "ICS LV 5 (JSON, RESTful, Ajax)",
          "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
          "page": 3
        },
        {
          "title": "ICS LV 5 (JSON, RESTful, Ajax)",
          "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
          "page": 5
        },
        {
          "title": "ICS LV 5 (JSON, RESTful, Ajax)",
          "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
          "page": 7
        },
        {
          "title": "ICS LV 5 (JSON, RESTful, Ajax)",
          "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
          "page": 9
        },
        {
          "title": "ICS LV 5 (JSON, RESTful, Ajax)",
          "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
          "page": 11
        },
        {
          "title": "ICS LV 5 (JSON, RESTful, Ajax)",
          "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
          "page": 12
        },
        {
          "title": "ICS LV 5 (JSON, RESTful, Ajax)",
          "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
          "page": 14
        },
        {
          "title": "ICS LV 5 (JSON, RESTful, Ajax)",
          "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
          "page": 15
        },
        {
          "title": "ICS LV 5 (JSON, RESTful, Ajax)",
          "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
          "page": 16
        },
        {
          "title": "ICS-Musterklausur",
          "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
          "page": 5
        },
        {
          "title": "ICS Klausurrelevante Themen",
          "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
          "page": 1
        }
      ],
      "summary": [
        "<strong>JSON</strong> (JavaScript Object Notation): leichtgewichtiges Textformat für semi-strukturierte Daten, Medientyp <code>application/json</code>, Untermenge von JavaScript. Strukturen: <em>Objekt</em> <code>{ \"name\": wert, … }</code> (Name-Wert-Paare) und <em>Array</em> <code>[ wert, … ]</code>. Werte: String in <strong>doppelten</strong> Anführungszeichen, Zahl, <code>true/false</code>, <code>null</code>, Objekt, Array.",
        "<strong>JSON-Fallen:</strong> Schlüssel <em>immer</em> in <code>\"…\"</code>, keine einfachen Anführungszeichen, kein Komma nach dem letzten Element, keine Kommentare (erst JSON5), Zahlen ohne Anführungszeichen und ohne führende Null.",
        "<strong>Marshalling</strong> (Serialisierung): Anwendungsdaten (Objekte, <em>Data Transfer Object</em>) verpacken und übers Netz senden; Unmarshalling auf der Gegenseite. In JS: <code>JSON.parse(text)</code> → Objekt, dann Punktnotation <code>adrBook.contacts.person[0].name</code>.",
        "<strong>Web Services:</strong> lose gekoppelte Komponenten, Austausch über Web-Standards, unabhängig von OS/Sprache. <em>1. Generation:</em> XML, SOAP, WSDL (maschinenlesbare Beschreibung). <em>2. Generation:</em> JSON, JavaScript, HTTP = <strong>REST</strong> (Representational State Transfer).",
        "<strong>REST:</strong> Dienst = <strong>URL</strong> (verschiedene Dienste, verschiedene URLs). CRUD → HTTP: <code>POST</code>=Create, <code>GET</code>=Read, <code>PUT</code>=Update, <code>DELETE</code>=Delete. Parameter als Query-String, als anwendungsspezifische HTTP-Header oder als URL-Pfadteile (<code>/itinerary/reservation/FT35ZBQ</code>). Ergebnis als Text, XML oder JSON. Nutzung steht in einer (menschenlesbaren) Dokumentation.",
        "<strong>Ajax mit XMLHttpRequest:</strong> <code>var xhttp = new XMLHttpRequest();</code> → <code>xhttp.onreadystatechange = function() { if (this.readyState == 4 &amp;&amp; this.status == 200) { var d = JSON.parse(this.responseText); … } };</code> → <code>xhttp.open(\"GET\", \"./game1.json\", true);</code> → <code>xhttp.send();</code>. Ajax braucht einen HTTP-Server — <code>file://</code> ist nicht zulässig.",
        "<strong>UML-Sequenzdiagramm Ajax:</strong> Lebenslinien <code>:Benutzer</code>, <code>:Browser</code>, <code>:Webserver</code>. Benutzer gibt URL ein → <code>HTTP GET /index.html</code> → <code>200 OK</code> (text/html mit <code>&lt;script&gt;</code>) → Anzeige. Benutzer wählt in Liste → JavaScript sendet <code>HTTP GET /game1.json</code> → <code>200 OK</code> (application/json) → Anzeige Liste und Text, <em>ohne Neuladen der Seite</em>."
      ],
      "feynman": {
        "prompt": "Erkläre, was bei einer Ajax-Anwendung passiert, wenn der Benutzer einen Eintrag aus einer Auswahlliste wählt — vom Event bis zur aktualisierten Anzeige — und zeichne gedanklich das Sequenzdiagramm.",
        "rubric": [
          "Ein Eventhandler (change) erzeugt ein XMLHttpRequest-Objekt, setzt onreadystatechange auf eine Callback-Funktion, ruft open(\"GET\", url, true) und send() auf.",
          "Der Webserver antwortet mit 200 OK und Content-Type application/json; im Callback wird bei readyState 4 und status 200 JSON.parse(this.responseText) aufgerufen.",
          "Das DOM wird mit den Daten aktualisiert, ohne die ganze Seite neu zu laden.",
          "Sequenzdiagramm: Lebenslinien :Benutzer, :Browser, :Webserver; synchrone Nachricht = durchgezogener Pfeil, Antwort = gestrichelter Pfeil."
        ]
      },
      "cheatSheet": {
        "id": "cs-ics-json-ajax",
        "courseId": "ics",
        "title": "ICS LV5: JSON, REST, Ajax",
        "content": "JSON: Objekt {\"k\": v, ...} · Array [v, ...] · Werte: \"string\" | 123 | 1.7 | true | false | null | {...} | [...].\nFallen: Schlüssel IMMER \"…\", keine '…', kein Komma am Ende, keine Kommentare, Zahlen ohne Quotes. Medientyp application/json.\nMarshalling = Daten serialisieren (DTO) → JSON.parse(text) → obj.a.b[0].c (Punktnotation).\nWeb Services: 1. Gen XML+SOAP+WSDL · 2. Gen JSON+JavaScript+HTTP (REST).\nREST: Dienst = URL · POST=Create · GET=Read · PUT=Update · DELETE=Delete. Parameter: Query-String | HTTP-Header | URL-Pfadteile. Antwort: Text | XML | JSON.\nAjax: XMLHttpRequest · onreadystatechange = Callback · readyState == 4 && status == 200 · responseText · open(\"GET\", url, true) · send(). Nur über http:// (nicht file://).\nSequenzdiagramm: :Benutzer → :Browser → :Webserver; GET /index.html → 200 OK text/html; Auswahl → GET /game1.json → 200 OK application/json → Anzeige.",
        "code": "{\n  \"studierende\": [\n    { \"Name\": \"Hans\", \"Studiengang\": \"Wirtschaftsinformatik\", \"Matrikelnummer\": 1234567 },\n    { \"Name\": \"Erna\", \"Studiengang\": \"Medieninformatik\", \"Matrikelnummer\": 1122334 }\n  ]\n}\n\nvar xhttp = new XMLHttpRequest();\nxhttp.onreadystatechange = function () {\n  if (this.readyState == 4 && this.status == 200) {\n    var gameData = JSON.parse(this.responseText);\n    updateGamePanel(gameData);\n  }\n};\nxhttp.open(\"GET\", \"./game1.json\", true);\nxhttp.send();"
      }
    },
    {
      "id": "ics-http-php-regex",
      "title": "8. HTTP, URL & Webserver (LV 1 + LV 6)",
      "badge": "Aufgabe 5 · 15 Pkt",
      "examWeight": 3,
      "diagram": "ics-http-messages",
      "sources": [
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 20
        },
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 21
        },
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 23
        },
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 24
        },
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 26
        },
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 27
        },
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 28
        },
        {
          "title": "ICS LV 5 (JSON, RESTful, Ajax)",
          "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
          "page": 17
        },
        {
          "title": "Webserver Docker",
          "path": "moodle-data/internettechnologie/files/Webserver Docker.pdf",
          "page": 1
        },
        {
          "title": "ICS-Musterklausur",
          "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
          "page": 6
        },
        {
          "title": "ICS-Musterklausur",
          "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
          "page": 7
        },
        {
          "title": "ICS Klausurrelevante Themen",
          "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
          "page": 1
        }
      ],
      "summary": [
        "<strong>URL-Aufbau:</strong> <code>protokoll://host:port/pfad/ressource?name1=wert1&amp;name2=wert2</code>. <code>:</code> trennt Host und Port (Standard HTTP 80, HTTPS 443), <code>?</code> trennt Ressource und Query-String, <code>&amp;</code> trennt Parameter. <code>/</code> am Ende = Standardressource des Ordners (z.B. <code>index.html</code>). Relative URLs: <code>./bild.jpg</code> (aktueller Ordner), <code>../</code> (übergeordneter Ordner), <code>/assets/…</code> (ab Wurzelordner des Webservers).",
        "<strong>Ablauf eines Abrufs:</strong> Hostname → IP per DNS, Port aus Protokoll ermitteln, TCP/IP-Verbindung aufbauen, Anfrage gemäß HTTP senden (<code>GET /ics/first.html</code>), Antwort (<code>200 OK</code> + HTML) auswerten/anzeigen, Verbindung beenden.",
        "<strong>GET</strong> fordert eine Ressource an; Formulardaten stehen im <em>Query-String der URL</em> (<code>GET /suche.php?plz=26723&amp;ort=Emden HTTP/1.1</code>), es gibt <strong>keinen Body</strong> → daher kein <code>Content-Type</code>/<code>Content-Length</code>. <strong>POST</strong> sendet Daten an den Server zur Verarbeitung, Formulardaten stehen im <em>Body</em> nach einer Leerzeile; Header <code>Content-Type: application/x-www-form-urlencoded</code> und <code>Content-Length</code> (Bytes des Bodys).",
        "<strong>Wichtige Header:</strong> <code>Host</code> (Zielhost, im Request Pflicht bei HTTP/1.1), <code>Content-Type</code> (Medientyp des Bodys: <code>text/html</code>, <code>application/json</code>, <code>application/x-www-form-urlencoded</code>), <code>Content-Length</code>, <code>Set-Cookie</code> (Server → Client, in der Antwort), <code>Cookie</code> (Client → Server bei jeder folgenden Anfrage).",
        "<strong>Antwort:</strong> Statuszeile (<code>HTTP/1.1 200 OK</code>, 404 Not Found …), Header, Leerzeile, Body (z.B. HTML). <strong>HTTP/2</strong> (Musterklausur 5.d): binäres statt textbasiertes Protokoll, Multiplexing mehrerer Anfragen über eine TCP-Verbindung, Header-Kompression, Server Push <em>[Allgemeinwissen — nicht in den vorliegenden Folien]</em>.",
        "<strong>Webserver:</strong> Apache (z.B. im XAMPP-Paket, mit PHP) liefert in der Standardkonfiguration Dokumente aus dem Ordner <strong><code>htdocs</code></strong> aus (XAMPP: <code>C:\\xampp\\htdocs</code>, Aufruf <code>http://localhost/index.html</code>). Docker-Variante: <code>docker run -p 80:8080 -v ${PWD}/html:/var/www/html erseco/alpine-php-webserver</code> → lokaler Ordner <code>html</code> wird Wurzelordner für URLs."
      ],
      "feynman": {
        "prompt": "Ein Formular mit den Feldern `plz` und `ort` wird einmal mit `method=\"get\"` und einmal mit `method=\"post\"` abgeschickt. Erkläre, wie sich die beiden HTTP-Requests unterscheiden (Startzeile, Header, Body) und warum GET keinen Content-Type hat.",
        "rubric": [
          "GET: Daten im Query-String der URL hinter ? mit & getrennt: GET /pfad?plz=26723&ort=Emden HTTP/1.1, Host-Header, kein Body.",
          "POST: POST /pfad HTTP/1.1, Host, Content-Type: application/x-www-form-urlencoded, Content-Length, Leerzeile, Body plz=26723&ort=Emden.",
          "Content-Type beschreibt den Medientyp des Bodys; ohne Body gibt es nichts zu beschreiben.",
          "GET dient zum Abrufen (Daten sichtbar in URL, Lesezeichen möglich), POST zum Übermitteln/Verarbeiten von Daten."
        ]
      },
      "cheatSheet": {
        "id": "cs-ics-http",
        "courseId": "ics",
        "title": "ICS LV6: HTTP, URL, Webserver",
        "content": "URL: protokoll://host:port/pfad?n1=w1&n2=w2 · MK 5.e: serdat://m.bits101.de:9155/comp/tre12.pru · MK 5.a: index.php?plz=26723&ort=Emden.\nPorts: HTTP 80 · HTTPS 443. \"/\" = Standardressource (index.html). ./ aktuell · ../ übergeordnet · /x ab Wurzel.\nGET: Daten in URL-Query-String, KEIN Body → kein Content-Type/Content-Length. Zweck: Ressource abrufen.\nPOST: Daten im Body (nach Leerzeile), Content-Type: application/x-www-form-urlencoded, Content-Length = Bytes. Zweck: Daten zur Verarbeitung senden.\nRequest: Startzeile METHODE /pfad HTTP/1.1 · Host: ... · (Cookie: a=b) · Leerzeile · Body.\nResponse: HTTP/1.1 200 OK · Content-Type: text/html · Set-Cookie: user=John · Leerzeile · Body.\nCookies: Server setzt mit Set-Cookie (Antwort) → Browser sendet Cookie: (jede folgende Anfrage).\nHTTP/2: binär · Multiplexing über 1 TCP-Verbindung · Header-Kompression · Server Push.\nApache-Standardordner: htdocs (XAMPP C:\\xampp\\htdocs) · Docker: ./html → /var/www/html, -p 80:8080.",
        "code": "POST /data/input.php HTTP/1.1\nHost: www.technik-emden.de\nContent-Type: application/x-www-form-urlencoded\nContent-Length: 39\n\ncustomerID=34aE2&requestDate=16.02.2024\n\n<!-- MK 5.f: erzeugendes Formular -->\n<form action=\"http://www.technik-emden.de/data/input.php\" method=\"post\">\n  <input type=\"text\" name=\"customerID\">\n  <input type=\"text\" name=\"requestDate\">\n  <input type=\"submit\" value=\"Senden\">\n</form>"
      }
    },
    {
      "id": "ics-php",
      "title": "9. PHP: Formulardaten, Cookies, HTML-Ausgabe (LV 6)",
      "badge": "Aufgabe 6 · PHP",
      "examWeight": 3,
      "diagram": "http-php-flow",
      "sources": [
        {
          "title": "ICS Klausurrelevante Themen",
          "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
          "page": 1
        },
        {
          "title": "ICS-Musterklausur",
          "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
          "page": 8
        },
        {
          "title": "ICS LV 5 (JSON, RESTful, Ajax)",
          "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
          "page": 17
        },
        {
          "title": "Webserver Docker",
          "path": "moodle-data/internettechnologie/files/Webserver Docker.pdf",
          "page": 1
        }
      ],
      "summary": [
        "<strong>Arbeitsteilung:</strong> Der Browser fordert <code>skript.php</code> an → der <em>Webserver</em> (Apache) nimmt die HTTP-Anfrage an, erkennt die Endung <code>.php</code> und übergibt an den <em>PHP-Prozessor</em> → dieser führt das Skript aus (liest Formulardaten/Cookies) und erzeugt HTML → der Webserver sendet nur dieses <strong>Ergebnis-HTML</strong> an den Browser. Der Browser sieht nie PHP-Quelltext. PHP-Dateien daher nur über <code>http://localhost/…</code> testen, nicht per Doppelklick/<code>file://</code>.",
        "<strong>Syntax:</strong> PHP-Code steht in <code>&lt;?php … ?&gt;</code> und kann mit HTML gemischt werden. Variablen beginnen mit <code>$</code> (<code>$name = \"Erna\";</code>), Anweisungen enden mit <code>;</code>. Ausgabe mit <code>echo</code>. String-Verkettung mit <strong>Punkt</strong> <code>.</code> (nicht <code>+</code>!). In <code>\"…\"</code> werden Variablen ersetzt (<code>\"Hallo $name\"</code>), in <code>'…'</code> nicht.",
        "<strong>Formulardaten:</strong> superglobale Arrays <code>$_POST[\"customerID\"]</code> (method post), <code>$_GET[\"plz\"]</code> (method get / Query-String); Schlüssel = <code>name</code>-Attribut des Eingabefelds. Alle Felder: <code>foreach ($_POST as $key =&gt; $value)</code>. Existenz prüfen: <code>isset($_POST[\"x\"])</code>. Ausgabe absichern: <code>htmlspecialchars()</code>.",
        "<strong>Cookies:</strong> <code>setcookie(\"user\", \"John\");</code> erzeugt den Header <code>Set-Cookie</code> → muss <em>vor jeder Ausgabe</em> stehen (Header kommen vor dem Body). Lesen beim <em>nächsten</em> Request über <code>$_COOKIE[\"user\"]</code> (der Browser schickt den Header <code>Cookie</code>).",
        "<strong>Vergleich:</strong> <code>==</code> vergleicht Werte nach Typumwandlung (<code>\"5\" == 5</code> → true), <code>===</code> prüft <strong>Wert und Typ</strong> (<code>\"5\" === 5</code> → false) — MK 6.b. Formularwerte kommen immer als Strings an."
      ],
      "feynman": {
        "prompt": "Das Formular aus Musterklausur 5.f sendet `customerID` und `requestDate` per POST an `input.php`. Erkläre, was Webserver und PHP-Prozessor jeweils tun, und schreibe das Skript, das beide Werte als ungeordnete Liste ausgibt.",
        "rubric": [
          "Webserver nimmt POST an, erkennt .php und übergibt an PHP-Prozessor; dieser führt aus und liefert HTML, das der Webserver zurücksendet.",
          "Zugriff über $_POST[\"customerID\"] und $_POST[\"requestDate\"] (Schlüssel = name-Attribute).",
          "Ausgabe mit echo: \"<ul>\", je \"<li>\" . $_POST[...] . \"</li>\", \"</ul>\" — Verkettung mit Punkt.",
          "Browser erhält nur das erzeugte HTML, nie den PHP-Code."
        ]
      },
      "cheatSheet": {
        "id": "cs-ics-php",
        "courseId": "ics",
        "title": "ICS LV6: PHP-Grundlagen",
        "content": "Ablauf: Browser → HTTP → Webserver (erkennt .php) → PHP-Prozessor (führt aus, erzeugt HTML) → Webserver → Browser (sieht nur HTML).\n<?php ... ?> · $variable · Anweisung; · echo \"...\" · Verkettung mit . (Punkt!)\n\"Hallo $name\" → Wert eingesetzt · 'Hallo $name' → wörtlich.\n$_GET[\"n\"] (Query-String) · $_POST[\"n\"] (Body) · $_COOKIE[\"n\"] · Schlüssel = name-Attribut.\nforeach ($_POST as $key => $value) { ... } · isset($x) · htmlspecialchars($s).\nsetcookie(\"user\",\"John\") VOR jeder Ausgabe (Header!) → Set-Cookie; lesbar erst beim nächsten Request in $_COOKIE.\n== Wert (mit Typumwandlung) · === Wert UND Typ (\"5\" === 5 → false).\nTesten nur über http://localhost/... (XAMPP htdocs bzw. Docker html-Ordner).",
        "code": "<!DOCTYPE html>\n<html>\n<head><meta charset=\"utf-8\"><title>Daten</title></head>\n<body>\n<?php\n  echo \"<ul>\";\n  echo \"<li>\" . htmlspecialchars($_POST[\"customerID\"]) . \"</li>\";\n  echo \"<li>\" . htmlspecialchars($_POST[\"requestDate\"]) . \"</li>\";\n  echo \"</ul>\";\n?>\n</body>\n</html>"
      }
    },
    {
      "id": "ics-regex",
      "title": "10. Reguläre Ausdrücke mit PHP: preg_match & preg_replace (LV 7)",
      "badge": "Aufgabe 6 · RegEx",
      "examWeight": 3,
      "sources": [
        {
          "title": "ICS Klausurrelevante Themen",
          "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
          "page": 1
        },
        {
          "title": "ICS-Musterklausur",
          "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
          "page": 8
        }
      ],
      "summary": [
        "<strong>Zeichenklassen:</strong> <code>\\d</code> Ziffer, <code>\\D</code> keine Ziffer, <code>\\w</code> Wortzeichen (Buchstabe, Ziffer, <code>_</code>), <code>\\W</code> Nicht-Wortzeichen, <code>\\s</code> Whitespace (Leerzeichen, Tab, Zeilenumbruch), <code>\\S</code> kein Whitespace, <code>.</code> beliebiges Zeichen (außer Zeilenumbruch). Eigene Klasse <code>[eosm]</code>, Bereich <code>[a-k]</code>, <code>[0-9]</code>; Negation <code>[^a-k]</code> = jedes Zeichen <em>außer</em> a–k (auch Großbuchstaben, Leerzeichen!).",
        "<strong>Quantoren</strong> (beziehen sich auf das Zeichen/die Gruppe davor): <code>*</code> 0..n, <code>+</code> 1..n, <code>?</code> 0..1, <code>{5}</code> genau 5, <code>{2,}</code> mind. 2, <code>{2,4}</code> 2 bis 4. Standardmäßig <strong>gierig (greedy)</strong>: so viel wie möglich; mit nachgestelltem <code>?</code> (<code>.*?</code>) genügsam.",
        "<strong>Anker &amp; Sonstiges:</strong> <code>^</code> Anfang, <code>$</code> Ende des Textes (außerhalb von <code>[]</code>!), <code>(…)</code> Gruppe, <code>a|b</code> Alternative, <code>\\.</code> maskiert Metazeichen. In PHP steht das Muster zwischen Begrenzern: <code>\"/muster/\"</code>, Modifikator <code>i</code> = ohne Groß-/Kleinschreibung: <code>\"/emden/i\"</code>.",
        "<strong>Suchregel:</strong> Der erste (am weitesten links beginnende) Treffer gewinnt; von dort aus nimmt ein gieriger Quantor so viel wie möglich und gibt nur so weit zurück, wie der Rest des Musters es erfordert.",
        "<strong>PHP-Funktionen:</strong> <code>preg_match($pattern, $text)</code> liefert <code>1</code> bei Treffer, <code>0</code> sonst (<code>false</code> bei Fehler); optional <code>preg_match($p, $t, $treffer)</code> → <code>$treffer[0]</code> = gefundener Text. <code>preg_replace($pattern, $ersatz, $text)</code> liefert den Text, in dem <strong>alle</strong> Treffer ersetzt sind.",
        "<strong>Musterklausur 6.c/d:</strong> PLZ <code>/^\\d{5}$/</code> (ohne Anker trifft es auch 5 Ziffern in „123456“). Im Text „Die Loesung ist bestimmt wieder 42“: <code>/\\D\\d+/</code> → „␣42“; <code>/[^a-k].*\\s/</code> → „Die Loesung ist bestimmt wieder␣“; <code>/[eosm]{2}.*[eosm]{2}/</code> → „oesung ist bestimm“."
      ],
      "feynman": {
        "prompt": "Erkläre an `/[^a-k].*\\s/` und dem Text „Die Loesung ist bestimmt wieder 42“, wie die Regex-Maschine den Treffer findet — Startposition, gieriges `.*`, Backtracking.",
        "rubric": [
          "Die Suche beginnt links: \"D\" ist nicht in a–k (Großbuchstabe), also startet der Treffer bei Position 0.",
          ".* ist gierig und läuft zunächst bis zum Textende (\"42\").",
          "Danach muss noch \\s passen: es wird zurückgegeben (Backtracking), bis ein Whitespace folgt — das letzte Leerzeichen vor \"42\".",
          "Ergebnis: \"Die Loesung ist bestimmt wieder \" (inkl. abschließendem Leerzeichen)."
        ]
      },
      "cheatSheet": {
        "id": "cs-ics-regex",
        "courseId": "ics",
        "title": "ICS LV7: Reguläre Ausdrücke (PHP)",
        "content": "\\d Ziffer · \\D keine Ziffer · \\w [A-Za-z0-9_] · \\W · \\s Whitespace · \\S · . beliebig.\n[abc] eins davon · [a-z] Bereich · [^a-k] alles AUSSER a–k (auch \"D\", \" \").\n* 0..n · + 1..n · ? 0..1 · {n} genau · {n,} mind. · {n,m}. Gierig! .*? = genügsam.\n^ Anfang · $ Ende · (…) Gruppe · a|b · \\. wörtlicher Punkt · /…/i ignoriert Groß/klein.\nTrefferregel: linkester Start gewinnt, dann so lang wie möglich (greedy) mit Backtracking.\npreg_match($p, $t [, $m]) → 1/0 (false bei Fehler); $m[0] = Treffer.\npreg_replace($p, $ersatz, $t) → ersetzt ALLE Treffer, gibt neuen String zurück.\nPLZ: /^\\d{5}$/ oder /^[0-9]{5}$/.\nMK 6.d (Text \"Die Loesung ist bestimmt wieder 42\"): /\\D\\d+/ → \" 42\" · /[^a-k].*\\s/ → \"Die Loesung ist bestimmt wieder \" · /[eosm]{2}.*[eosm]{2}/ → \"oesung ist bestimm\".",
        "code": "<?php\n$plz = $_GET[\"plz\"];\nif (preg_match(\"/^\\d{5}$/\", $plz)) {\n  echo \"gültige PLZ\";\n}\n$text = \"Die Loesung ist bestimmt wieder 42\";\npreg_match(\"/\\D\\d+/\", $text, $m);\necho $m[0];                          // \" 42\"\necho preg_replace(\"/\\d/\", \"#\", \"R2D2\"); // R#D#\n?>"
      }
    },
    {
      "id": "ics-internet",
      "title": "11. Grundlagen Internet & WWW (LV 1)",
      "badge": "Hintergrund",
      "examWeight": 1,
      "diagram": "ics-url-parts",
      "sources": [
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 7
        },
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 8
        },
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 9
        },
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 13
        },
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 14
        },
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 15
        },
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 16
        },
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 17
        },
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 19
        },
        {
          "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
          "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
          "page": 37
        }
      ],
      "summary": [
        "<strong>Netzkomponenten:</strong> Hosts (Clients, Server), Switch (verbindet Computer), Router (verbindet Netzwerke), Leitungen. Intranet = internes Netz mit Internet-Techniken, Extranet = für Externe freigegebener Teil, VPN = entfernter Rechner wird wie ein lokaler eingebunden.",
        "<strong>TCP/IP-Schichten (4):</strong> Anwendung (z.B. HTTP) · Transport (TCP/UDP, Ports) · Internet (IP-Nummern) · Netzzugang (Ethernet, WLAN). Das OSI-Modell (1984) hat 7 Schichten. TCP = verbindungsorientiert, IP/UDP = paketvermittelt/verbindungslos.",
        "<strong>Adressierung:</strong> IPv4 = 32 Bit (4 Dezimalzahlen, z.B. 139.13.108.16), IPv6 = 128 Bit (8 Gruppen Hex). DNS übersetzt Hostnamen in IP-Adressen; TLD (<code>.de</code>, ICANN/IANA), SLD (<code>technik-emden</code>, DENIC), Subdomains; <code>localhost</code> = eigener Rechner. Port-Nummer identifiziert die Anwendung; Socket = Endpunkt (IP, Port, Transportprotokoll).",
        "<strong>WWW:</strong> verteiltes, über das Internet abrufbares System von Ressourcen; ursprünglich definiert durch <em>HTTP, URL und HTML</em>. HTML (Struktur) → DOM (Datenstruktur im Browser) → CSS (Formatierung) → JavaScript (Dynamik). Browser: HTML-Parser (mit DTD-Regeln) → DOM → Viewer (+ Default-CSS), JavaScript-Engine greift auf DOM zu.",
        "<strong>Kommunikationsbegriffe:</strong> Simplex/Halbduplex/Duplex; Unicast/Broadcast/Anycast/Multicast; synchron (Partner warten aufeinander) vs. asynchron (Sender arbeitet weiter, z.B. JavaScript/Ajax)."
      ],
      "feynman": {
        "prompt": "Was braucht ein Client, um einen Dienst im Internet zu nutzen, und welche Rolle spielen DNS, Port und Socket dabei?",
        "rubric": [
          "IP-Adresse des Server-Hosts (ggf. per DNS aus dem Hostnamen), Portnummer des Dienstes und das Protokoll.",
          "DNS liefert zu einem Hostnamen die IP-Adresse; der Port identifiziert die Anwendung auf dem Host.",
          "Socket = Endpunkt der Ende-zu-Ende-Verbindung mit IP-Adresse, Port und Transportprotokoll (TCP/UDP)."
        ]
      },
      "cheatSheet": {
        "id": "cs-ics-internet",
        "courseId": "ics",
        "title": "ICS LV1: Internet & WWW-Grundlagen",
        "content": "TCP/IP: Anwendung (HTTP) · Transport (TCP/UDP, Ports) · Internet (IP) · Netzzugang (Ethernet/WLAN). OSI: 7 Schichten.\nIPv4 32 Bit (139.13.108.16) · IPv6 128 Bit · lokal 192.168.x.x · localhost.\nDNS: Hostname → IP; TLD (.de, ICANN/IANA) · SLD (DENIC) · Subdomain (Organisation).\nClient braucht: IP + Port + Protokoll. Socket = IP + Port + Transportprotokoll.\nSwitch verbindet Computer, Router verbindet Netzwerke.\nWWW = HTTP + URL + HTML; DOM, CSS, JS ergänzen. URL ist ein spezieller URI.\nSimplex/Halbduplex/Duplex · Unicast/Broadcast/Anycast/Multicast · synchron/asynchron."
      }
    }
  ],
  "flashcards": [
    {
      "id": "fc-ics-1",
      "chapterId": "ics-html-dom",
      "examRelevant": true,
      "front": "Welche dieser HTML-Elemente sind Inline-Elemente? <p>, <em>, <img>, <h6>, <span>, <div>, <title>, <a> (Musterklausur 1.b)",
      "back": "Inline: <em>, <img>, <span>, <a>.\nBlock: <p>, <h6>, <div>.\n<title> gehört in den <head> und wird nicht im Dokument dargestellt (erscheint im Browser-Tab).",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-2",
      "chapterId": "ics-html-dom",
      "examRelevant": true,
      "front": "Wie wird die Zeichencodierung eines HTML-Dokuments festgelegt? Beispiel für „iso-8859-15“ (Musterklausur 1.e)",
      "back": "Mit einem <meta>-Element im <head>:\n<meta charset=\"iso-8859-15\">\n(Standardempfehlung: <meta charset=\"utf-8\">). Zusätzlich muss der Editor die Datei in dieser Codierung speichern.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 34
      }
    },
    {
      "id": "fc-ics-h-head",
      "chapterId": "ics-html-dom",
      "examRelevant": true,
      "front": "Wie wirken sich <head> und <body> bei der Darstellung im Browserfenster aus? (Musterklausur 1.a)",
      "back": "<head>: enthält Metadaten (Informationen über das Dokument: charset, <title>, CSS-Links) — wird NICHT im Anzeigebereich dargestellt; nur der <title> erscheint in Tab/Titelleiste.\n<body>: enthält den anzuzeigenden Dokumentinhalt, der im Browserfenster dargestellt wird.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 33
      }
    },
    {
      "id": "fc-ics-h-action",
      "chapterId": "ics-html-dom",
      "examRelevant": true,
      "front": "In welchem HTML-Element kommt das Attribut `action` vor? Was ist sein Wert? (Musterklausur 1.c)",
      "back": "Im <form>-Element.\nWert: die URL der Ressource (z.B. eines PHP-Skripts), an die die Formulardaten beim Absenden geschickt werden, z.B. <form action=\"/data/input.php\" method=\"post\">.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-h-domtree",
      "chapterId": "ics-html-dom",
      "examRelevant": true,
      "front": "DOM-Baum skizzieren: <body><h1>asdf</h1><p>das ist <em>sehr</em> wichtig!</p></body> (Musterklausur 1.d)",
      "back": "body\n├─ h1\n│   └─ \"asdf\" (Text)\n└─ p\n    ├─ \"das ist \" (Text)\n    ├─ em\n    │   └─ \"sehr\" (Text)\n    └─ \" wichtig!\" (Text)\nElementknoten: body, h1, p, em · Textknoten: 4.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-h-dom",
      "chapterId": "ics-html-dom",
      "examRelevant": true,
      "front": "Was ist das DOM und was ermöglicht die DOM-API?",
      "back": "Document Object Model: objektorientiertes Modell des HTML-Dokuments als Baumstruktur, liegt im Speicher des Browsers und kann zur Laufzeit (z.B. mit JavaScript) verändert werden.\nDOM-API: Knoten finden, Knotenattribute lesen und schreiben, zwischen Knoten navigieren.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 36
      }
    },
    {
      "id": "fc-ics-h-begriffe",
      "chapterId": "ics-html-dom",
      "examRelevant": true,
      "front": "Tag, Element, Attribut — wie hängen die Begriffe in HTML zusammen?",
      "back": "Tag = Markierung: öffnend <h1>, schließend </h1>.\nElement = öffnendes Tag + Inhalt + schließendes Tag: <h1>Willkommen!</h1>.\nAttribut = Zusatzinformation im öffnenden Tag: <html lang=\"de\">.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 31
      }
    },
    {
      "id": "fc-ics-h-blockinline",
      "chapterId": "ics-html-dom",
      "examRelevant": true,
      "front": "Block- vs. Inline-Elemente: Verhalten und je 4 Beispiele",
      "back": "Block: beginnt auf neuer Zeile → <h1>…<h6>, <p>, <li>, <table> (auch <div>, <ul>, <form>).\nInline: verhält sich wie Wörter in einer Zeile, Umbruch abhängig von Fensterbreite → <a>, <em>, <img>, <span>.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 35
      }
    },
    {
      "id": "fc-ics-h-gerust",
      "chapterId": "ics-html-dom",
      "examRelevant": true,
      "front": "Grundsätzlicher Aufbau eines HTML-Dokuments (4 Bestandteile)",
      "back": "1. Dokumenttyp <!DOCTYPE html>\n2. Gesamtes Dokument <html> … </html>\n3. Metadaten <head> … </head>\n4. Dokumentinhalt <body> … </body>",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 33
      }
    },
    {
      "id": "fc-ics-h-spandiv",
      "chapterId": "ics-html-dom",
      "examRelevant": true,
      "front": "Wozu dienen <span> und <div>?",
      "back": "Beide haben keine eigenen Stil-Eigenschaften und vererben keine; sie gruppieren Inhalte, um sie gemeinsam zu benennen (class/id) und zu stylen.\n<span> = Inline-Gruppe (Textbereiche), <div> = Block-Gruppe (z.B. <div id=\"content\">).",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 13
      }
    },
    {
      "id": "fc-ics-h-img",
      "chapterId": "ics-html-dom",
      "examRelevant": false,
      "front": "Warum sollte <img> immer ein alt-Attribut haben, und wie bindet man rein dekorative Bilder ein?",
      "back": "<img> fügt inhaltlich relevante Bilder ein → alt beschreibt den Inhalt: <img src=\"neumann.jpg\" alt=\"Foto von John von Neumann\">.\nDekorative Bilder per CSS: #banner { background-image: url('banner.jpg'); }",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 16
      }
    },
    {
      "id": "fc-ics-h-table",
      "chapterId": "ics-html-dom",
      "examRelevant": true,
      "front": "Aus welchen Elementen besteht eine HTML-Tabelle mit Kopfzeile?",
      "back": "<table>\n  <thead><tr><th>Kopf 1</th><th>Kopf 2</th></tr></thead>\n  <tbody><tr><td>Zelle</td><td>Zelle</td></tr></tbody>\n</table>\ntr = Zeile, th = Kopfzelle, td = Datenzelle.",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 15
      }
    },
    {
      "id": "fc-ics-h-browser",
      "chapterId": "ics-html-dom",
      "examRelevant": false,
      "front": "Wie verarbeitet ein Browser ein HTML-Dokument (Architektur)?",
      "back": "HTML-Dokument kommt per HTTP vom Server (Cache) → HTML-Parser (nutzt eingebaute HTML-Regeln/DTD) baut das DOM → Viewer stellt dar (mit Default-CSS + Styles) → JavaScript-Engine liest/ändert das DOM. In den Developer Tools (F12) kann das DOM bearbeitet werden.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 37
      }
    },
    {
      "id": "fc-ics-3",
      "chapterId": "ics-css",
      "examRelevant": true,
      "front": "Welche CSS-Eigenschaft des table-Elements bewirkt, dass die Begrenzungslinien der Zellenblöcke aufeinander liegen? Welcher position-Wert ist Standard? (Musterklausur 2.c & 2.g)",
      "back": "• table { border-collapse: collapse; }\n• Standardlayout: position: static;",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 15
      }
    },
    {
      "id": "fc-ics-4",
      "chapterId": "ics-css",
      "examRelevant": true,
      "front": "CSS-Anweisung: Hyperlink beim Überfahren mit der Maus fett darstellen (Musterklausur 2.f)",
      "back": "a:hover { font-weight: bold; }\n(:hover = Pseudoklasse für den Zustand „Mauszeiger schwebt über dem Element“)",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 30
      }
    },
    {
      "id": "fc-ics-c-class",
      "chapterId": "ics-css",
      "examRelevant": true,
      "front": "Welche CSS-Anweisung färbt den Inhalt von <p class=\"colorBlue\"> blau? (Musterklausur 2.a)",
      "back": "p.colorBlue { color: blue; }\n(oder allgemeiner .colorBlue { color: blue; })\nKlassen-Selektor = Punkt + Klassenname; Textfarbe = color (nicht background-color!).",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 26
      }
    },
    {
      "id": "fc-ics-c-inherit",
      "chapterId": "ics-css",
      "examRelevant": true,
      "front": "Nenne CSS-Eigenschaften, die NICHT an untergeordnete Elemente vererbt werden. (Musterklausur 2.b)",
      "back": "margin, width, background-color (laut Folie), außerdem border, padding.\nbackground-color ist standardmäßig transparent → Eltern-Hintergrund scheint durch.\nVererbt werden z.B. color, font-family, font-size. Erzwingen: background-color: inherit;",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 10
      }
    },
    {
      "id": "fc-ics-c-group",
      "chapterId": "ics-css",
      "examRelevant": true,
      "front": "Musterklausur 2.d: h1, h2 und p haben je color: #ff00ff; font-family: Helvetica, sans-serif; p zusätzlich margin-left: 15px; border-bottom: 1px solid #000000. Kürzen!",
      "back": "h1, h2, p {\n  color: #ff00ff;\n  font-family: Helvetica, sans-serif;\n}\np {\n  margin-left: 15px;\n  border-bottom: 1px solid #000000;\n}\nGruppierung = Selektoren mit Komma trennen.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 2
      }
    },
    {
      "id": "fc-ics-c-fontsize",
      "chapterId": "ics-css",
      "examRelevant": true,
      "front": "Musterklausur 2.e: html { font-size: 24px; } .main { font-size: 14px; } .anm { font-size: 0.5rem; } — Schriftgröße von <p class=\"anm\">Anmerkung</p> innerhalb von <div class=\"main\">?",
      "back": "12px.\nrem bezieht sich immer auf die Schriftgröße des Wurzelelements html (24px) → 0.5 × 24px = 12px. Die 14px von .main spielen keine Rolle.\n(Mit 0.5em wären es 0.5 × 14px = 7px, da em bei font-size auf das Elternelement bezogen ist.)",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 3
      }
    },
    {
      "id": "fc-ics-c-syntax",
      "chapterId": "ics-css",
      "examRelevant": true,
      "front": "Grundsätzliche CSS-Syntax einer Stil-Anweisung",
      "back": "Selektor {\n  Eigenschaft1: Wert1;\n  Eigenschaft2: Wert2;\n}\nDer Selektor legt fest, welche Elemente betroffen sind. Das letzte ; könnte entfallen.\nBeispiel: p { color: red; font-style: italic; }",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 8
      }
    },
    {
      "id": "fc-ics-c-einbinden",
      "chapterId": "ics-css",
      "examRelevant": true,
      "front": "Drei Wege, CSS mit HTML zu verbinden",
      "back": "1. Inline-Style: <p style=\"color:red\"> (abgeraten, Pflege aufwendig)\n2. <style>-Element im <head> (für ein Dokument)\n3. Externe Datei für mehrere Dokumente: <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\"> im <head>, alternativ <style> @import url(...); </style>",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 9
      }
    },
    {
      "id": "fc-ics-c-spez",
      "chapterId": "ics-css",
      "examRelevant": true,
      "front": "Spezifität: Welche Wertigkeiten haben Element-, Klassen-, ID-Selektor und Inline-Style? Wert von #header .info ul li?",
      "back": "Element 1 · Klasse 10 · ID 100 · Inline-Style 1000.\nBei geschachtelten Selektoren addieren: #header .info ul li = 100 + 10 + 1 + 1 = 112.\nHöhere Spezifität gewinnt.",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 28
      }
    },
    {
      "id": "fc-ics-c-pseudo",
      "chapterId": "ics-css",
      "examRelevant": true,
      "front": "Die 5 Pseudoklassen für Hyperlinks und ihre Bedeutung",
      "back": ":link – noch nicht besucht\n:visited – bereits besucht\n:focus – gewählt, noch nicht bestätigt (Tastatur)\n:hover – Mauszeiger schwebt darüber\n:active – wird gerade geklickt\nPseudoklassen stylen Zustände, nicht Elemente.",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 30
      }
    },
    {
      "id": "fc-ics-c-pseudoel",
      "chapterId": "ics-css",
      "examRelevant": false,
      "front": "Welche Pseudo-Elemente werden in LV 2 gezeigt?",
      "back": "p::first-letter – erster Buchstabe (z.B. color: red; font-size: 300%)\np::first-line – erste Zeile, bezogen auf den Zeilenumbruch im Browserfenster",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 31
      }
    },
    {
      "id": "fc-ics-c-units",
      "chapterId": "ics-css",
      "examRelevant": true,
      "front": "Relative Einheiten %, em, rem, ex — worauf beziehen sie sich?",
      "back": "% – Größe des umschließenden Elements (width: 80% von body).\nem – Schrifthöhe des aktuellen Elements; bei font-size: Schriftgröße des ELTERN-Elements.\nrem – Schriftgröße des Wurzelelements html.\nex – Höhe des Zeichens „x“.\nKein Leerzeichen zwischen Zahl und Einheit: 12px (nicht 12 px).",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 20
      }
    },
    {
      "id": "fc-ics-c-abs",
      "chapterId": "ics-css",
      "examRelevant": false,
      "front": "Absolute CSS-Einheiten und Umrechnung",
      "back": "in (1 in = 2,54 cm), cm, mm, pt (1 pt = 1/72 in), pc (1 pc = 12 pt), px (1 px = 0,75 pt = 1/96 in).\nAchtung: 1 CSS-px ist nicht gleich 1 Gerätepixel.",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 21
      }
    },
    {
      "id": "fc-ics-c-colors",
      "chapterId": "ics-css",
      "examRelevant": false,
      "front": "Wie kann man Farben in CSS angeben? Wofür steht #35B?",
      "back": "Name: red · Hex: #FF0000 · Kurz-Hex: #35B = #3355BB · rgb(255,0,0) · rgb(100%,0%,0%).",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 7
      }
    },
    {
      "id": "fc-ics-c-nested",
      "chapterId": "ics-css",
      "examRelevant": true,
      "front": "Was bedeutet der Selektor `tbody td` bzw. `dl dt`?",
      "back": "Verschachtelter (Nachfahren-)Selektor: gilt für td-Elemente innerhalb eines tbody (bzw. dt innerhalb dl). Leerzeichen = „liegt innerhalb von“. Solche Regeln haben Vorrang vor Regeln für einzelne Elemente (höhere Spezifität).",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 17
      }
    },
    {
      "id": "fc-ics-c-id",
      "chapterId": "ics-css",
      "examRelevant": true,
      "front": "Unterschied Klassen-Selektor und ID-Selektor",
      "back": ".redtext → alle Elemente mit class=\"redtext\" (wiederverwendbar, beliebig oft).\n#absatz1 → das eine Element mit id=\"absatz1\" (id-Werte dürfen nur einmal pro Dokument vorkommen).\nID-Selektor ist spezifischer (100 vs. 10).",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 27
      }
    },
    {
      "id": "fc-ics-l-box",
      "chapterId": "ics-css-layout",
      "examRelevant": true,
      "front": "Box-Modell: Welche drei Eigenschaften umgeben den Inhalt (von innen nach außen)? Welche Farben haben sie?",
      "back": "padding (Innenabstand) → border (Rahmen) → margin (Außenabstand).\npadding hat die Hintergrundfarbe des Elements, border-color legt die Rahmenfarbe fest, margin ist immer transparent.",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 3
      }
    },
    {
      "id": "fc-ics-l-padding",
      "chapterId": "ics-css-layout",
      "examRelevant": true,
      "front": "Was ist der „Innenabstand“ eines Elements und welches CSS-Attribut legt ihn fest? (Musterklausur 2.i)",
      "back": "Der Abstand zwischen dem Inhalt eines Elements und seinem Rahmen (border); er wird in der Hintergrundfarbe des Elements dargestellt.\nCSS: padding (bzw. padding-top/-right/-bottom/-left).",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 4
      }
    },
    {
      "id": "fc-ics-l-short",
      "chapterId": "ics-css-layout",
      "examRelevant": true,
      "front": "Sammeleigenschaft margin mit 1, 2, 3 bzw. 4 Werten — welche Seite bekommt was?",
      "back": "margin: 10px → alle 4 Seiten 10px\nmargin: 10px 5px → oben/unten 10px, rechts/links 5px\nmargin: 10px 2px 5px → oben 10, rechts 2, unten 5, links 2\nmargin: 10px 0 2em 0.1ex → oben, rechts, unten, links (Uhrzeigersinn)\nGilt genauso für padding, border-width, border-style, border-color.",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 6
      }
    },
    {
      "id": "fc-ics-l-border",
      "chapterId": "ics-css-layout",
      "examRelevant": true,
      "front": "Skizziere die Rahmenlinien eines Absatzes mit p { border: solid; border-width: 1px 5px; } (Musterklausur 2.h)",
      "back": "Durchgezogener Rahmen um den ganzen Absatz:\noben und unten dünn (1px), links und rechts dick (5px).\n┏━━━━━━━━━━━┓ ← 1px\n┃  Absatz  ┃ ← 5px links/rechts\n┗━━━━━━━━━━━┛ ← 1px\n(2 Werte = vertikal/horizontal: oben/unten, rechts/links)",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 3
      }
    },
    {
      "id": "fc-ics-l-bstyle",
      "chapterId": "ics-css-layout",
      "examRelevant": false,
      "front": "Mögliche Werte von border-style (bzw. border-top-style …)",
      "back": "none, dotted, dashed, solid, double, groove, ridge, inset, outset (letzte vier: 3D-Optik), inherit.",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 5
      }
    },
    {
      "id": "fc-ics-l-position",
      "chapterId": "ics-css-layout",
      "examRelevant": true,
      "front": "Die Werte von position und ihre Wirkung",
      "back": "static – Standardlayout, keine besondere Positionierung\nrelative – Standardlayout + Verschiebung um top/bottom/left/right; Fluss der anderen Elemente unverändert\nabsolute – aus dem Elementfluss genommen, absolute Koordinaten bezogen auf das umschließende Element\nfixed – bezogen auf das Browserfenster, bleibt beim Scrollen stehen\ninherit",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 11
      }
    },
    {
      "id": "fc-ics-l-float",
      "chapterId": "ics-css-layout",
      "examRelevant": true,
      "front": "Was bewirkt float, welche Werte gibt es und wie beendet man das Umfließen?",
      "back": "Box wird aus dem Elementfluss genommen und so weit wie möglich nach links/rechts an den Rand des Elternelements geschoben; anderer Inhalt umfließt sie (typisch: Bilder). Weitere float-Boxen stoßen an die vorhandene an.\nWerte: left, right, none, inherit.\nBeenden: clear: left (bzw. right/both) beim folgenden Element.",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 14
      }
    },
    {
      "id": "fc-ics-l-flow",
      "chapterId": "ics-css-layout",
      "examRelevant": true,
      "front": "Standardlayout: Wie werden Block-Boxen und Inline-Boxen angeordnet? Was gilt für Inline-Boxen?",
      "back": "Block-Boxen: vertikal von oben nach unten, jede so breit wie body, auch mit kleinerem width nicht nebeneinander (impliziter Zeilenumbruch).\nInline-Boxen: horizontal in Line-Boxen innerhalb ihrer Block-Box.\nInline-Boxen: keine Abmessungen (width/height), nur horizontale margins (left/right), keine vertikalen.\nBox-Typ änderbar mit display.",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 9
      }
    },
    {
      "id": "fc-ics-l-nav",
      "chapterId": "ics-css-layout",
      "examRelevant": true,
      "front": "Horizontales Navigationsmenü aus <nav><ul><li><a> — welche CSS-Schritte (Foliensatz 2a)?",
      "back": "nav ul { list-style-type: none; margin: 0; padding: 0; } – Punkte/Abstände weg\nnav li { float: left; } – Listeneinträge nebeneinander\nnav li a { display: block; padding: 14px 16px; background-color: #555; color: white; text-decoration: none; } – Block, damit padding wirkt\nh1 { clear: left; } – Überschrift wieder auf neuer Zeile\nli a:hover { background-color: #999; color: red; }",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 28
      }
    },
    {
      "id": "fc-ics-l-spende",
      "chapterId": "ics-css-layout",
      "examRelevant": true,
      "front": "Spendenaufruf für 2 Sekunden (Foliensatz 2a): Wie funktioniert das Beispiel?",
      "back": "CSS #spende { background-color: yellow; color: red; font-size: xx-large; padding: 20px; }\nJS: function spendeAus() { div_spende = document.getElementById(\"spende\"); div_spende.style.visibility = \"hidden\"; div_spende.remove(); }\nsetTimeout(spendeAus, 2000); → nach 2000 ms aufgerufen.\nremove(), weil ein hidden-Element weiterhin Platz einnimmt.",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 30
      }
    },
    {
      "id": "fc-ics-l-tage",
      "chapterId": "ics-css-layout",
      "examRelevant": true,
      "front": "Beispiel „Vergangene Tage seit Datum“: Welche JS-Bausteine werden genutzt?",
      "back": "const tag = new Date(2023, 9-1, 20); // Monat 0-basiert → 20. Sep. 2023\nconst heute = new Date();\ngetTime() liefert Millisekunden → / 1000 = Sekunden\nanzahlTage = Math.round((heute_sec - tag_sec) / 86400); // 86400 s pro Tag\nWert per innerHTML in <span id=\"tage\"> einsetzen.",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 32
      }
    },
    {
      "id": "fc-ics-j-script",
      "chapterId": "ics-js",
      "examRelevant": true,
      "front": "Warum wird empfohlen, das <script>-Element am Ende des <body> anzuordnen? (Musterklausur 3.a)",
      "back": "Der Browser führt Skripte beim Parsen sofort aus. Am Ende des body sind alle HTML-Elemente bereits geladen und im DOM vorhanden → document.getElementById() findet sie (sonst null). Außerdem wird der Seitenaufbau nicht durch das Laden/Ausführen des Skripts verzögert.",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 5
      }
    },
    {
      "id": "fc-ics-j-over",
      "chapterId": "ics-js",
      "examRelevant": true,
      "front": "Musterklausur 3.d: function over() { document.getElementById(\"insert\").innerHTML = \"new\"; } over(); — passende HTML-Zeile für ein <p>?",
      "back": "<p id=\"insert\"></p>\n(beliebiger Inhalt erlaubt, z.B. <p id=\"insert\">alt</p>). Das id-Attribut muss exakt \"insert\" lauten; das <p> muss VOR dem <script> stehen, da over() sofort aufgerufen wird. Ergebnis: Inhalt wird \"new\".",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 4
      }
    },
    {
      "id": "fc-ics-j-click",
      "chapterId": "ics-js",
      "examRelevant": true,
      "front": "Musterklausur 3.e: <div id=\"clickhere\"/> — welche JS-Anweisungen rufen tuwas() beim Klicken auf?",
      "back": "const el = document.getElementById(\"clickhere\");\nel.addEventListener(\"click\", tuwas);\n(alternativ: el.onclick = tuwas;)\nWichtig: Funktionsreferenz tuwas OHNE Klammern übergeben.",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 5
      }
    },
    {
      "id": "fc-ics-j-aktivieren",
      "chapterId": "ics-js",
      "examRelevant": true,
      "front": "Auf welche Arten kann JavaScript im Browser ausgeführt werden (LV 3)?",
      "back": "1. Beim Laden der Seite: Code im <script> (inline oder src=\"datei.js\") außerhalb von Funktionen.\n2. Inline-Eventhandler: <p onClick=\"andereFunktion()\">, <a href=\"javascript:eineFunktion()\"> – schlechter Stil (mischt HTML und JS).\n3. Registrierte Eventhandler: element.addEventListener(\"click\", funktion).",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 4
      }
    },
    {
      "id": "fc-ics-j-func",
      "chapterId": "ics-js",
      "examRelevant": true,
      "front": "Definition und Aufruf von Funktionen in JavaScript vs. Java",
      "back": "Java: nur als Methoden einer Klasse (public static double quadrat(double x) {...}), Aufruf F.quadrat(3.0).\nJS: freistehend: function quadrat(x) { return x * x; } — keine Typangaben; Aufruf: let q = quadrat(3.0);\nFunktionen sind Objekte: let f = function() {...}; let g = tuwas; f(); g();",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 16
      }
    },
    {
      "id": "fc-ics-j-inner",
      "chapterId": "ics-js",
      "examRelevant": true,
      "front": "Was bewirkt element.innerHTML = \"...\"?",
      "back": "Ersetzt den gesamten Inhalt (inkl. HTML-Markup) zwischen Start- und End-Tag des Elements im DOM durch den angegebenen String; die Anzeige ändert sich sofort ohne Neuladen. Lesen ist ebenfalls möglich: let s = el.innerHTML;",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 34
      }
    },
    {
      "id": "fc-ics-j-form",
      "chapterId": "ics-js",
      "examRelevant": true,
      "front": "Formular und persönliche Begrüßung (2a): Wie liest JS den Wert des Feldes <input type=\"text\" name=\"anrede\"> im <form id=\"frm\">?",
      "back": "const formular = document.getElementById(\"frm\");\nconst anrede = formular.anrede.value; // Zugriff über name per Punktnotation\ndocument.getElementById(\"willkommen\").innerHTML = \"Moin \" + anrede + \"!\";\nformular.anrede.value = \"\"; // Feld leeren\nAuslöser: <input type=\"button\" value=\"Absenden\" onclick=\"anredeMerken()\">",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 34
      }
    },
    {
      "id": "fc-ics-j-timeout",
      "chapterId": "ics-js",
      "examRelevant": false,
      "front": "Was macht setTimeout(spendeAus, 2000)?",
      "back": "Registriert die Funktion spendeAus, die EINMAL nach 2000 Millisekunden (2 s) aufgerufen wird. Übergeben wird die Funktionsreferenz (ohne Klammern); der restliche Code läuft sofort weiter (asynchron).",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 30
      }
    },
    {
      "id": "fc-ics-j-test",
      "chapterId": "ics-js",
      "examRelevant": false,
      "front": "Wie testet man JavaScript im Browser laut LV 3?",
      "back": "Developer Tools (F12) → Konsole: Ausgaben per console.log() (bevorzugt) oder modales Fenster per alert(). In der Konsole lassen sich Anweisungen testweise eingeben. Nach Quelltextänderung Strg+F5 (Cache + Ansicht neu laden), F5 nur Ansicht.",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 3
      }
    },
    {
      "id": "fc-ics-j-cookie",
      "chapterId": "ics-js",
      "examRelevant": false,
      "front": "Wie setzt JavaScript im Formularbeispiel (2a) einen Cookie?",
      "back": "document.cookie = \"user=John\";\nDer Browser speichert den Cookie und sendet ihn bei weiteren Anfragen an denselben Server im HTTP-Header Cookie: user=John mit.",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 34
      }
    },
    {
      "id": "fc-ics-s-types",
      "chapterId": "ics-js-sprache",
      "examRelevant": true,
      "front": "Datentypen: Was unterscheidet JavaScript von Java?",
      "back": "JS: number (IEEE 754, 64 Bit, entspricht Java double — auch für Ganzzahlen), bigint (variable Länge), boolean, string (\"asdf\" oder 'asdf'), symbol.\nKein char (stattdessen String der Länge 1), kein int/long/float getrennt.\nVariablen können auch null oder undefined enthalten.",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 8
      }
    },
    {
      "id": "fc-ics-s-varlet",
      "chapterId": "ics-js-sprache",
      "examRelevant": true,
      "front": "var vs. let vs. const",
      "back": "let i = 123; – blockgebunden (außerhalb des Blocks: ReferenceError)\nconst n = 1; – Konstante (wie Java final)\nvar i = 123; – NICHT blockgebunden, im Block deklariert auch außerhalb sichtbar → widerspricht Geheimnisprinzip, in neuem Code nicht verwenden.\nVariable außerhalb jeder Funktion = global = Attribut des window-Objekts.",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 11
      }
    },
    {
      "id": "fc-ics-s-ops",
      "chapterId": "ics-js-sprache",
      "examRelevant": true,
      "front": "Operator-Unterschiede JS ↔ Java (Division, Potenz, Vergleich, Strings)",
      "back": "/ liefert immer Gleitkomma: 7/2 = 3.5; ganzzahlig: Math.floor(7/2) = 3.\nPotenz: 2 ** 3 = 8 (Java: Math.pow).\nZusätzlich === und !== (Vergleich auf Wert UND Typ).\nStringvergleich mit == (Java: equals). Verkettung mit +.",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 12
      }
    },
    {
      "id": "fc-ics-s-arrays",
      "chapterId": "ics-js-sprache",
      "examRelevant": true,
      "front": "Arrays in JavaScript: Erzeugen, Zugriff, Anzahl, Anhängen",
      "back": "let a = [1, 2, 3]; let b = []; let c = new Array();\nZugriff: a[0], a[a.length-1]; Anzahl: a.length.\nVeränderbar wie Java ArrayList: al[al.length] = 111; (hängt an).\n[3, 4, 6, null].length = 4 (null ist ein Eintrag).",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 13
      }
    },
    {
      "id": "fc-ics-s-objects",
      "chapterId": "ics-js-sprache",
      "examRelevant": true,
      "front": "JavaScript-Objekte als Hashtabellen: Erzeugen, Ergänzen, Lesen, Aufzählen",
      "back": "let h = { \"eins\": \"one\", \"zwei\": \"two\" };\nh[\"drei\"] = \"three\";   // Klammernotation\nh.vier = \"four\";       // Punktnotation\nlet num3 = h.drei;\nfor (let key in h) console.log(key); // eins, zwei, drei, vier\nKeine Klasse nötig; Schlüssel entsprechen Attributen.",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 14
      }
    },
    {
      "id": "fc-ics-s-loops",
      "chapterId": "ics-js-sprache",
      "examRelevant": true,
      "front": "Schleifen in JS: was ist wie in Java, was anders?",
      "back": "Wie Java: while, for(init; bed; akt), do…while, break, continue, if/else, switch.\nAnders: Iteration über Array-Elemente mit for (let name of arr) (Java: for (Typ name : coll)).\nfor (let k in obj) liefert die Schlüssel (bei Arrays die Indizes als Strings).",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 18
      }
    },
    {
      "id": "fc-ics-s-loop-mk",
      "chapterId": "ics-js-sprache",
      "examRelevant": true,
      "front": "Musterklausur 3.b: for (let x = 0; x < 10; x = x + 2) { console.log(\"Der Wert von x ist: \" + ++x); } — Ausgaben? Wert von x danach?",
      "back": "Ausgaben: „Der Wert von x ist: 1“, „…: 4“, „…: 7“, „…: 10“.\nTrace: 0→++x=1→+2=3→++x=4→+2=6→++x=7→+2=9→++x=10→+2=12 → 12<10 falsch → Ende.\nDie Schleife endet mit x = 12; da x mit let im Schleifenkopf deklariert ist, existiert x außerhalb der Schleife nicht (ReferenceError). Mit var wäre x danach 12.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 4
      }
    },
    {
      "id": "fc-ics-s-method",
      "chapterId": "ics-js-sprache",
      "examRelevant": true,
      "front": "Objekt mit Methode als Literal — Ausgabe von hans.stellDichVor()?\nlet hans = { name: \"Hans\", stellDichVor: function() { console.log(\"Ich bin \" + this.name); } };",
      "back": "„Ich bin Hans“.\nthis verweist auf das Objekt, über das die Methode aufgerufen wurde (hans). Objekte werden in JS durch Hashtabellen und Funktionsvariablen realisiert — ohne Klasse.",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 23
      }
    },
    {
      "id": "fc-ics-s-constructor",
      "chapterId": "ics-js-sprache",
      "examRelevant": false,
      "front": "Objekte mit Konstruktorfunktion erzeugen",
      "back": "function Student(name, notePrg) {\n  this.name = name;\n  this.noteProgrammieren = notePrg;\n  this.stellDichVor = function() { console.log(\"Ich bin \" + this.name); };\n}\nlet erna = new Student(\"Erna\", 2.0);\nerna.stellDichVor(); // Ich bin Erna\n(class/extends-Varianten sind laut Folien nicht klausurrelevant.)",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 25
      }
    },
    {
      "id": "fc-ics-s-exc",
      "chapterId": "ics-js-sprache",
      "examRelevant": false,
      "front": "Ausnahmebehandlung in JS vs. Java",
      "back": "throw: beliebiger Wert (String, Number, Boolean, Object) statt nur Exception-Objekte.\ntry { … } catch (err) { … } finally { … } — catch OHNE Typangabe; err ist eingebautes Error-Objekt bzw. der geworfene Wert. Eigene Exception-Klassen nicht nötig.",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 19
      }
    },
    {
      "id": "fc-ics-s-naming",
      "chapterId": "ics-js-sprache",
      "examRelevant": false,
      "front": "Namensregeln und private Attribute in JS",
      "back": "Namen wie in Java: _, A-Z, a-z, 0-9, $; erstes Zeichen keine Ziffer.\nPrivate Objektvariablen: Name beginnt mit # (Java: private).\nZuweisung i = 456 — Semikolon optional.",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 10
      }
    },
    {
      "id": "fc-ics-5",
      "chapterId": "ics-xml-rest",
      "examRelevant": true,
      "front": "In welcher Datei kommen diese Zeilen vor und was bedeuten sie? (Musterklausur 4.b)\n<!ELEMENT Listentitel (#PCDATA)>\n<!ATTLIST Listentitel kategorie CDATA #IMPLIED>",
      "back": "In einer DTD (Document Type Definition, z.B. liste.dtd oder intern im DOCTYPE).\nZeile 1: Das Element <Listentitel> enthält Text (#PCDATA, keine Unterelemente).\nZeile 2: <Listentitel> hat ein Attribut „kategorie“ mit beliebigem Textwert (CDATA), das optional ist (#IMPLIED).",
      "source": {
        "title": "ICS LV 4 (XML)",
        "path": "moodle-data/internettechnologie/files/ICS LV 4.pdf",
        "page": 22
      }
    },
    {
      "id": "fc-ics-x-wfvalid",
      "chapterId": "ics-xml-rest",
      "examRelevant": true,
      "front": "Wann ist ein XML-Dokument „wohlgeformt (well formed)“, wann „gültig (valid)“? (Musterklausur 4.a)",
      "back": "Wohlgeformt: erfüllt die XML-Syntaxregeln (genau ein Wurzelelement, alle Elemente geschlossen, korrekt verschachtelt, Attributwerte in Anführungszeichen, case-sensitiv).\nGültig: wohlgeformt UND entspricht den Regeln einer zugeordneten Grammatik (DTD).\nGültig ⇒ wohlgeformt, aber nicht umgekehrt.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-x-rules",
      "chapterId": "ics-xml-rest",
      "examRelevant": true,
      "front": "Die Regeln für Wohlgeformtheit (Checkliste)",
      "back": "1. Genau ein Wurzelelement\n2. Jedes Start-Tag hat ein End-Tag (oder leeres Element <x/>)\n3. Korrekt verschachtelt: <a><b></b></a>, nicht <a><b></a></b>\n4. Groß-/Kleinschreibung: <Name>…</name> ist ein Fehler\n5. Attributwerte in Anführungszeichen: kategorie=\"neu\"\n6. Ein Attribut nicht doppelt im selben Element\n7. Sonderzeichen < und & im Text maskieren (&lt; &amp;)",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-x-element",
      "chapterId": "ics-xml-rest",
      "examRelevant": true,
      "front": "DTD für <person><name>Bob</name><tel>012345/67890</tel></person>",
      "back": "<!ELEMENT person (name, tel)>\n<!ELEMENT name (#PCDATA)>\n<!ELEMENT tel (#PCDATA)>\n(name, tel) = Folge in genau dieser Reihenfolge, je genau einmal.",
      "source": {
        "title": "ICS LV 4 (XML)",
        "path": "moodle-data/internettechnologie/files/ICS LV 4.pdf",
        "page": 19
      }
    },
    {
      "id": "fc-ics-x-quant",
      "chapterId": "ics-xml-rest",
      "examRelevant": true,
      "front": "DTD-Häufigkeitsangaben und Inhaltsmodelle",
      "back": "ohne Zeichen: genau 1\n? : 0 oder 1 (optional)\n* : 0 bis beliebig oft\n+ : 1 bis beliebig oft\n(a, b) : Folge, (a | b) : Auswahl\n#PCDATA : Text · EMPTY : leeres Element\nBeispiel: <!ELEMENT liste (titel, eintrag+)>",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-x-attlist",
      "chapterId": "ics-xml-rest",
      "examRelevant": true,
      "front": "Aufbau einer ATTLIST-Deklaration und Bedeutung von CDATA, #IMPLIED, #REQUIRED",
      "back": "<!ATTLIST Elementname Attributname Typ Vorgabe>\nCDATA = beliebiger Text\n#IMPLIED = optional\n#REQUIRED = muss angegeben werden\n\"wert\" = Standardwert\nBeispiel: <!ATTLIST person relationship CDATA #IMPLIED>",
      "source": {
        "title": "ICS LV 4 (XML)",
        "path": "moodle-data/internettechnologie/files/ICS LV 4.pdf",
        "page": 22
      }
    },
    {
      "id": "fc-ics-x-doctype",
      "chapterId": "ics-xml-rest",
      "examRelevant": true,
      "front": "Wie wird eine DTD einem XML-Dokument zugeordnet?",
      "back": "Extern: <!DOCTYPE contacts SYSTEM \"contacts.dtd\"> nach dem Prolog <?xml version=\"1.0\" encoding=\"utf-8\"?>\nIntern: <!DOCTYPE contacts [ <!ELEMENT contacts (person*)> ... ]>\nDer Name hinter DOCTYPE muss das Wurzelelement sein.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-x-notrel",
      "chapterId": "ics-xml-rest",
      "examRelevant": true,
      "front": "Welche XML-Themen sind laut „Klausurrelevante Themen“ NICHT relevant?",
      "back": "Namensräume, XML Schema (XSD), XSL, XSLT, XPath, XPointer, XLink — außerdem DTDs mit Entities oder Bedingungen.\nRelevant: Elemente + Attribute ohne Namensraum, wohlgeformt vs. gültig, DTD verstehen und erstellen.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-x-simplecomplex",
      "chapterId": "ics-xml-rest",
      "examRelevant": false,
      "front": "Einfaches vs. komplexes Element (LV 4)",
      "back": "Einfach: keine Attribute und keine Unterelemente, z.B. <tel>012345/67890</tel>.\nKomplex: mindestens ein Attribut ODER Unterelemente, z.B. <name relationship=\"work\">Bob</name> ist komplex!",
      "source": {
        "title": "ICS LV 4 (XML)",
        "path": "moodle-data/internettechnologie/files/ICS LV 4.pdf",
        "page": 19
      }
    },
    {
      "id": "fc-ics-x-tree",
      "chapterId": "ics-xml-rest",
      "examRelevant": false,
      "front": "Welche Knotenarten hat ein XML-Dokument als Baum?",
      "back": "Wurzelknoten (document root, /) – darunter das Wurzelelement (root element), Elementknoten, Attributknoten, Textknoten, Kommentarknoten.",
      "source": {
        "title": "ICS LV 4 (XML)",
        "path": "moodle-data/internettechnologie/files/ICS LV 4.pdf",
        "page": 28
      }
    },
    {
      "id": "fc-ics-6",
      "chapterId": "ics-json-ajax",
      "examRelevant": true,
      "front": "Welches JavaScript-Objekt sendet HTTP-Anfragen an einen Server, und welche Eigenschaft verweist auf die Funktion, die die Antwort auswertet? (Musterklausur 4.e)",
      "back": "Objekt: XMLHttpRequest (var xhttp = new XMLHttpRequest();)\nEigenschaft: onreadystatechange — ihr wird die Callback-Funktion zugewiesen, die bei readyState == 4 && status == 200 die Antwort (this.responseText) auswertet.",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 16
      }
    },
    {
      "id": "fc-ics-r-table",
      "chapterId": "ics-json-ajax",
      "examRelevant": true,
      "front": "Musterklausur 4.c: JSON-Objekt für die Tabelle Name | Studiengang | Matrikelnummer mit Hans/Wirtschaftsinformatik/1234567 und Erna/Medieninformatik/1122334",
      "back": "{\n  \"studierende\": [\n    { \"Name\": \"Hans\", \"Studiengang\": \"Wirtschaftsinformatik\", \"Matrikelnummer\": 1234567 },\n    { \"Name\": \"Erna\", \"Studiengang\": \"Medieninformatik\", \"Matrikelnummer\": 1122334 }\n  ]\n}\nSchlüssel in doppelten Anführungszeichen, Zahlen ohne, kein Komma nach dem letzten Element.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 5
      }
    },
    {
      "id": "fc-ics-r-syntax",
      "chapterId": "ics-json-ajax",
      "examRelevant": true,
      "front": "JSON-Syntaxregeln (Strukturen und erlaubte Werte)",
      "back": "Objekt: { \"name\": wert, \"name2\": wert } – Menge von Name-Wert-Paaren\nArray: [ wert, wert ] – geordnete Liste\nWerte: \"String\" (nur doppelte Anführungszeichen), Zahl (25, 1.7), true, false, null, Objekt, Array.\nVerboten: 'einfache Quotes', Schlüssel ohne Quotes, Komma nach letztem Element, Kommentare (erst JSON5).",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 3
      }
    },
    {
      "id": "fc-ics-r-json",
      "chapterId": "ics-json-ajax",
      "examRelevant": true,
      "front": "Was ist JSON (Definition, Medientyp, Herkunft)?",
      "back": "JavaScript Object Notation: leichtgewichtiges Textformat für den Austausch semi-strukturierter Daten, für Menschen lesbar und maschinell gut verarbeitbar. Internet-Medientyp: application/json. Beruht auf einer Untermenge von JavaScript. Erweiterung JSON5: u.a. Kommentare.",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 3
      }
    },
    {
      "id": "fc-ics-r-marshal",
      "chapterId": "ics-json-ajax",
      "examRelevant": true,
      "front": "Was bedeutet Marshalling (Serialisierung) und wie greift JS auf JSON-Daten zu?",
      "back": "Marshalling: Anwendungsdaten (Objektstrukturen, Data Transfer Object) so verpacken und über ein Netzwerk senden, dass das Zielsystem damit arbeiten kann; Unmarshalling = Rückumwandlung.\nIn JS: var obj = JSON.parse(text); dann Punktnotation, z.B. adrBook.contacts.person[0].name.",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 7
      }
    },
    {
      "id": "fc-ics-r-ws",
      "chapterId": "ics-json-ajax",
      "examRelevant": true,
      "front": "Web Services: Definition, 1. vs. 2. Generation",
      "back": "Lose gekoppelte Software-Komponenten, die über Standards des WWW Informationen austauschen; unabhängig von Betriebssystem und Programmiersprache.\n1. Generation: XML, SOAP, WSDL (maschinenlesbare Dienstbeschreibung).\n2. Generation: JSON, JavaScript, HTTP → REST.\nSOA = Menge kommunizierender Dienste.",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 9
      }
    },
    {
      "id": "fc-ics-r-crud",
      "chapterId": "ics-json-ajax",
      "examRelevant": true,
      "front": "Welche HTTP-Befehle nutzt ein REST-Service für Create, Read, Update, Delete? (Musterklausur 4.d)",
      "back": "Create = POST\nRead = GET\nUpdate = PUT\nDelete = DELETE",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 11
      }
    },
    {
      "id": "fc-ics-r-rest",
      "chapterId": "ics-json-ajax",
      "examRelevant": true,
      "front": "Beziehung REST-Webservice ↔ URL/HTTP: Wie wird ein Dienst adressiert, parametrisiert, beantwortet?",
      "back": "Dienst = URL (verschiedene Dienste → verschiedene URLs); Operation = HTTP-Methode (CRUD).\nParameter: als Query-Parameter im Query-String, als anwendungsspezifische HTTP-Header oder als Teile des Ressourcennamens (durch / getrennt: /itinerary/reservation/FT35ZBQ).\nErgebnis: reiner Text, XML- oder JSON-Dokument.\nNutzung steht in einer Dokumentation des Anbieters (kein WSDL).",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 11
      }
    },
    {
      "id": "fc-ics-r-ajaxsteps",
      "chapterId": "ics-json-ajax",
      "examRelevant": true,
      "front": "Die 4 Schritte des Ajax-Codes aus LV 5 (Spiele-Wiki)",
      "back": "1. Eventhandler: gameSelector.addEventListener(\"change\", function(event) {...})\n2. var xhttp = new XMLHttpRequest(); xhttp.onreadystatechange = function() {...}\n3. xhttp.open(\"GET\", \"./\" + gameFileName, true); xhttp.send(); → HTTP GET an Server\n4. Im Callback bei readyState == 4 && status == 200: var gameData = JSON.parse(this.responseText); updateGamePanel(gameData);",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 16
      }
    },
    {
      "id": "fc-ics-r-ready",
      "chapterId": "ics-json-ajax",
      "examRelevant": true,
      "front": "Was bedeutet if (this.readyState == 4 && this.status == 200) im Ajax-Callback?",
      "back": "readyState 4 = Anfrage abgeschlossen, Antwort vollständig empfangen.\nstatus 200 = HTTP-Statuscode „OK“.\nNur dann wird this.responseText (Antworttext, z.B. JSON) ausgewertet. Der Callback wird bei jeder readyState-Änderung aufgerufen, daher die Prüfung.",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 16
      }
    },
    {
      "id": "fc-ics-r-seq",
      "chapterId": "ics-json-ajax",
      "examRelevant": true,
      "front": "UML-Sequenzdiagramm einer Ajax-Anwendung (LV 5): Lebenslinien und Nachrichten",
      "back": "Lebenslinien: :Benutzer, :Browser, :Webserver.\n1. Benutzer → Browser: Eingabe URL; Browser → Webserver: HTTP GET /index.html; Antwort 200 OK (Content-Type: text/html, HTML mit <script>); Browser → Benutzer: Anzeige HTML.\n2. Benutzer → Browser: Select Liste; JavaScript → Webserver: HTTP GET /game1.json; Antwort 200 OK (application/json); Browser → Benutzer: Anzeige Liste und Text.\nAnfragen = durchgezogene Pfeile, Antworten = gestrichelt.",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 15
      }
    },
    {
      "id": "fc-ics-r-file",
      "chapterId": "ics-json-ajax",
      "examRelevant": false,
      "front": "Warum funktioniert das Ajax-Beispiel nicht per Doppelklick auf die HTML-Datei?",
      "back": "HTML-Datei und JSON-Dateien müssen auf einem Server liegen, der HTTP beherrscht; das file://-Protokoll ist zusammen mit Ajax nicht zulässig. Lösung: lokaler Webserver (XAMPP: htdocs, Aufruf http://localhost/index.html, oder Docker).",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 14
      }
    },
    {
      "id": "fc-ics-r-soap",
      "chapterId": "ics-json-ajax",
      "examRelevant": false,
      "front": "Gegenüberstellung: Reservierung FT35ZBQ als Web Service 1. vs. 2. Generation",
      "back": "1. Generation: SOAP-Envelope (XML) mit <env:Body><m:itinerary><m:reservation>FT35ZBQ</m:reservation>… — nur der RPC-Aufruf; zusätzlich ist ein WSDL-Dokument nötig.\n2. Generation: http://travelcompany.example.org/itinerary/reservation/FT35ZBQ — Parameter als URL-Teile.",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 12
      }
    },
    {
      "id": "fc-ics-7",
      "chapterId": "ics-http-php-regex",
      "examRelevant": true,
      "front": "Warum wird bei einem HTTP-GET-Befehl kein Header Content-Type übertragen? (Musterklausur 5.c)",
      "back": "Content-Type beschreibt den Medientyp der Daten im Body der Nachricht. Ein GET-Request hat keinen Body — eventuelle Parameter stehen im Query-String der URL. Ohne Body gibt es nichts, dessen Typ beschrieben werden müsste (ebenso kein Content-Length).",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 6
      }
    },
    {
      "id": "fc-ics-8",
      "chapterId": "ics-http-php-regex",
      "examRelevant": true,
      "front": "Zwei Verbesserungen von HTTP/2 gegenüber HTTP/1.1 (Musterklausur 5.d) und Apache-Standardordner (5.g)",
      "back": "HTTP/2 (zwei nennen): binäres statt textbasiertes Protokoll; Multiplexing (mehrere Anfragen/Antworten parallel über eine TCP-Verbindung); Header-Kompression; Server Push. [Allgemeinwissen, nicht in den Folien]\nApache: Ordner htdocs (XAMPP: C:\\xampp\\htdocs). Docker-Image der Vorlesung: /var/www/html.",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 17
      }
    },
    {
      "id": "fc-ics-t-params",
      "chapterId": "ics-http-php-regex",
      "examRelevant": true,
      "front": "Musterklausur 5.a: http://www.abc.de/index.php ___plz=26723___ort=Emden — welche Sonderzeichen fehlen?",
      "back": "http://www.abc.de/index.php?plz=26723&ort=Emden\n? trennt Ressource und Query-String, & trennt mehrere Name=Wert-Paare.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 24
      }
    },
    {
      "id": "fc-ics-t-url",
      "chapterId": "ics-http-php-regex",
      "examRelevant": true,
      "front": "Musterklausur 5.e: URL für Ressource /comp/tre12.pru auf Host m.bits101.de, Port 9155, Protokoll serdat",
      "back": "serdat://m.bits101.de:9155/comp/tre12.pru\nSchema: protokoll://host:port/pfad",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 23
      }
    },
    {
      "id": "fc-ics-t-getpost",
      "chapterId": "ics-http-php-regex",
      "examRelevant": true,
      "front": "Zweck der HTTP-Befehle GET und POST (Musterklausur 5.b)",
      "back": "GET: fordert eine Ressource vom Server an (lesen); Parameter/Formulardaten werden im Query-String der URL übertragen (sichtbar, als Lesezeichen speicherbar, kein Body).\nPOST: sendet Daten (z.B. Formulardaten) im Body der Anfrage an den Server zur Verarbeitung; Header Content-Type und Content-Length beschreiben den Body.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-t-post",
      "chapterId": "ics-http-php-regex",
      "examRelevant": true,
      "front": "Aufbau einer HTTP-POST-Nachricht mit Formulardaten (Beispiel Musterklausur 5.f)",
      "back": "POST /data/input.php HTTP/1.1          ← Startzeile: Methode Pfad Version\nHost: www.technik-emden.de             ← Header\nContent-Type: application/x-www-form-urlencoded\nContent-Length: 39                     ← Bytes des Bodys\n                                       ← Leerzeile\ncustomerID=34aE2&requestDate=16.02.2024 ← Body",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 7
      }
    },
    {
      "id": "fc-ics-t-form",
      "chapterId": "ics-http-php-regex",
      "examRelevant": true,
      "front": "Musterklausur 5.f: HTML-Formular, das POST /data/input.php an www.technik-emden.de (ohne Verschlüsselung) mit customerID und requestDate sendet",
      "back": "<form action=\"http://www.technik-emden.de/data/input.php\" method=\"post\">\n  <input type=\"text\" name=\"customerID\">\n  <input type=\"text\" name=\"requestDate\">\n  <input type=\"submit\" value=\"Senden\">\n</form>\nhttp:// (nicht https) wegen „ohne Transportverschlüsselung“; die name-Attribute werden zu den Parameternamen. Der Submit-Button ohne name erzeugt keinen Parameter.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 7
      }
    },
    {
      "id": "fc-ics-t-get",
      "chapterId": "ics-http-php-regex",
      "examRelevant": true,
      "front": "Wie sieht der Request aus, wenn das Formular <form action=\"/suche.php\" method=\"get\"> mit plz=26723 und ort=Emden an www.abc.de abgeschickt wird?",
      "back": "GET /suche.php?plz=26723&ort=Emden HTTP/1.1\nHost: www.abc.de\n(Leerzeile, kein Body, kein Content-Type/Content-Length)",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-t-headers",
      "chapterId": "ics-http-php-regex",
      "examRelevant": true,
      "front": "Bedeutung der Header Host, Content-Type, Content-Length",
      "back": "Host: Name (ggf. Port) des Zielservers; Pflicht-Header jeder HTTP/1.1-Anfrage (ein Server kann mehrere Hosts bedienen).\nContent-Type: Medientyp des Bodys (text/html, application/json, application/x-www-form-urlencoded).\nContent-Length: Länge des Bodys in Bytes.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-t-cookie",
      "chapterId": "ics-http-php-regex",
      "examRelevant": true,
      "front": "Wie werden Cookies per HTTP übertragen? (Set-Cookie vs. Cookie)",
      "back": "1. Server → Browser: in der ANTWORT Header Set-Cookie: user=John\n2. Browser speichert den Cookie.\n3. Browser → Server: bei jeder folgenden ANFRAGE an diesen Server Header Cookie: user=John (mehrere: Cookie: a=1; b=2).\nPHP liest ihn über $_COOKIE[\"user\"].",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-t-response",
      "chapterId": "ics-http-php-regex",
      "examRelevant": true,
      "front": "Aufbau einer HTTP-Antwort",
      "back": "HTTP/1.1 200 OK                ← Statuszeile (Version, Code, Text)\nContent-Type: text/html          ← Header\nContent-Length: 1234\nSet-Cookie: user=John (optional)\n                                 ← Leerzeile\n<!DOCTYPE html><html>…           ← Body\nWeitere Codes: 404 Not Found, 500 Internal Server Error.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 28
      }
    },
    {
      "id": "fc-ics-t-abruf",
      "chapterId": "ics-http-php-regex",
      "examRelevant": true,
      "front": "Welche Schritte führt der Browser beim Abruf von http://winf1.technik-emden.de/ics/first.html aus?",
      "back": "1. Verbindung aufbauen: Hostname aus URL → IP per DNS; Port für Protokoll (80 für HTTP); TCP/IP-Verbindung.\n2. Kommunizieren: Protokoll HTTP; Anfrage „GET /ics/first.html“; Antwort (200 OK + HTML) auswerten, anzeigen.\n3. Verbindung beenden.\nHTTP-Anfragen werden heute meist auf HTTPS (Port 443) umgeleitet.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 27
      }
    },
    {
      "id": "fc-ics-t-relurl",
      "chapterId": "ics-http-php-regex",
      "examRelevant": true,
      "front": "Relative URLs: my_image.jpg, ./my_image.jpg, ../page/img/my_image.jpg, /assets/img/my_image.jpg",
      "back": "my_image.jpg und ./my_image.jpg → gleicher Ordner wie das aktuelle Dokument (./ = aktueller Ordner, empfohlen)\n../ → übergeordneter Ordner\n/assets/… → Pfad ab dem Wurzelordner des Webservers",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 26
      }
    },
    {
      "id": "fc-ics-t-default",
      "chapterId": "ics-http-php-regex",
      "examRelevant": false,
      "front": "Was liefert http://winf1.technik-emden.de/ics/ (URL endet mit /)?",
      "back": "Die Standard-Ressource dieses Ordners, typischerweise index.html oder default.htm. Ohne Portangabe wird für http der Standardport 80 verwendet.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 22
      }
    },
    {
      "id": "fc-ics-t-docker",
      "chapterId": "ics-http-php-regex",
      "examRelevant": false,
      "front": "docker run -p 80:8080 -v ${PWD}/html:/var/www/html erseco/alpine-php-webserver — was bedeuten die Teile?",
      "back": "-p 80:8080: Port 80 des eigenen Rechners wird auf Port 8080 im Container weitergeleitet → Aufruf http://localhost/.\n-v ${PWD}/html:/var/www/html: der lokale Ordner html wird als Wurzelordner (/var/www/html) des Webservers eingebunden.\nerseco/alpine-php-webserver: Image mit Webserver + PHP.",
      "source": {
        "title": "Webserver Docker",
        "path": "moodle-data/internettechnologie/files/Webserver Docker.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-t-urlteile",
      "chapterId": "ics-http-php-regex",
      "examRelevant": true,
      "front": "Welche Informationen enthält ein URL?",
      "back": "Anwendungsprotokoll (http, https, file …), Standort der Ressource (Host, ggf. Port), Pfad zur Ressource (Dateisystem des Servers oder virtuell), Name der Ressource, optional Parameter als Query-String.\nURL = spezielle Ausprägung eines URI.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 20
      }
    },
    {
      "id": "fc-ics-p-arbeit",
      "chapterId": "ics-php",
      "examRelevant": true,
      "front": "Arbeitsteilung zwischen Webserver und PHP-Prozessor",
      "back": "Webserver (Apache): nimmt HTTP-Anfragen an, liefert statische Dateien (HTML, CSS, JSON) direkt aus; erkennt .php-Dateien und übergibt sie (mit Formulardaten, Cookies) an den PHP-Prozessor.\nPHP-Prozessor: führt das Skript serverseitig aus und erzeugt die Ausgabe (meist HTML).\nWebserver: sendet die erzeugte Ausgabe als HTTP-Antwort an den Browser — der Browser sieht nie PHP-Code.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-p-mk6a",
      "chapterId": "ics-php",
      "examRelevant": true,
      "front": "Musterklausur 6.a: PHP-Skript, das customerID und requestDate (per POST) als ungeordnete Liste anzeigt",
      "back": "<?php\necho \"<ul>\";\necho \"<li>\" . $_POST[\"customerID\"] . \"</li>\";\necho \"<li>\" . $_POST[\"requestDate\"] . \"</li>\";\necho \"</ul>\";\n?>\n(Optional in <html><body> einbetten; sicherer mit htmlspecialchars(); generisch: foreach ($_POST as $k => $v) echo \"<li>$k: $v</li>\";)",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 8
      }
    },
    {
      "id": "fc-ics-p-identity",
      "chapterId": "ics-php",
      "examRelevant": true,
      "front": "Welche Aufgabe hat der Operator === ? (Musterklausur 6.b)",
      "back": "Identitätsvergleich: true nur, wenn beide Operanden den gleichen Wert UND den gleichen Datentyp haben (keine automatische Typumwandlung).\n\"5\" == 5 → true, \"5\" === 5 → false. Gegenteil: !==.\n(In JavaScript gleiche Bedeutung.)",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 8
      }
    },
    {
      "id": "fc-ics-p-syntax",
      "chapterId": "ics-php",
      "examRelevant": true,
      "front": "PHP-Grundsyntax: Code-Block, Variablen, Ausgabe, Verkettung",
      "back": "<?php ... ?> umschließt PHP-Code (in HTML einbettbar).\nVariablen: $name = \"Erna\"; (immer mit $, keine Typangabe)\nAusgabe: echo \"Hallo\";\nVerkettung: \"Hallo \" . $name (Punkt-Operator, nicht +)\n\"Hallo $name\" ersetzt die Variable, 'Hallo $name' nicht.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-p-super",
      "chapterId": "ics-php",
      "examRelevant": true,
      "front": "Wie liest PHP Formulardaten und Cookies aus?",
      "back": "$_GET[\"name\"] – Parameter aus dem Query-String (method=\"get\")\n$_POST[\"name\"] – Parameter aus dem Body (method=\"post\")\n$_COOKIE[\"name\"] – vom Browser mitgesendete Cookies\nSchlüssel = name-Attribut des Formularfelds bzw. Cookie-Name. Werte sind Strings.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-p-setcookie",
      "chapterId": "ics-php",
      "examRelevant": true,
      "front": "Cookie in PHP setzen — was ist zu beachten?",
      "back": "setcookie(\"user\", \"John\"); erzeugt den Antwort-Header Set-Cookie: user=John.\nMuss VOR jeder Ausgabe (echo/HTML) stehen, weil Header vor dem Body gesendet werden.\nIm selben Skriptlauf ist $_COOKIE[\"user\"] noch nicht gesetzt — erst bei der nächsten Anfrage schickt der Browser Cookie: user=John.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-p-isset",
      "chapterId": "ics-php",
      "examRelevant": true,
      "front": "Wie prüft man in PHP, ob ein Formularfeld gesendet wurde, und wie gibt man es sicher aus?",
      "back": "if (isset($_POST[\"anrede\"])) { echo \"Moin \" . htmlspecialchars($_POST[\"anrede\"]); }\nisset: Variable/Schlüssel existiert und ist nicht null.\nhtmlspecialchars: wandelt < > & \" in HTML-Entities, damit eingeschleustes HTML/JS nicht ausgeführt wird.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-p-foreach",
      "chapterId": "ics-php",
      "examRelevant": true,
      "front": "Alle Formularfelder generisch als Liste ausgeben",
      "back": "echo \"<ul>\";\nforeach ($_POST as $key => $value) {\n  echo \"<li>$key: $value</li>\";\n}\necho \"</ul>\";\n$_POST ist ein assoziatives Array (Schlüssel → Wert).",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-p-test",
      "chapterId": "ics-php",
      "examRelevant": false,
      "front": "Warum kann man eine PHP-Datei nicht per Doppelklick im Browser testen?",
      "back": "Bei file:// liest der Browser die Datei direkt — es gibt keinen Webserver/PHP-Prozessor, der den Code ausführt; man sieht Quelltext statt Ergebnis. Lösung: Datei in den Dokumentordner des Webservers legen (XAMPP htdocs, Docker html-Ordner) und über http://localhost/datei.php aufrufen.",
      "source": {
        "title": "Webserver Docker",
        "path": "moodle-data/internettechnologie/files/Webserver Docker.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-p-mix",
      "chapterId": "ics-php",
      "examRelevant": true,
      "front": "Was erhält der Browser bei folgendem Skript?\n<p>Hallo <?php echo $_GET[\"name\"]; ?>!</p>  (Aufruf: gruss.php?name=Erna)",
      "back": "<p>Hallo Erna!</p>\nNur das erzeugte HTML — der PHP-Block wird auf dem Server durch seine Ausgabe ersetzt.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-9",
      "chapterId": "ics-regex",
      "examRelevant": true,
      "front": "Regulärer Ausdruck für eine Postleitzahl aus 5 Dezimalziffern (Musterklausur 6.c)",
      "back": "/^\\d{5}$/ oder /^[0-9]{5}$/\n^ und $ verankern Anfang und Ende — ohne sie würde /\\d{5}/ auch in „123456“ oder „PLZ 26723 Emden“ einen Treffer finden.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 8
      }
    },
    {
      "id": "fc-ics-g-mk1",
      "chapterId": "ics-regex",
      "examRelevant": true,
      "front": "Musterklausur 6.d-1: $text = \"Die Loesung ist bestimmt wieder 42\"; preg_match(\"/\\D\\d+/\", $text) — welche Zeichen werden gefunden?",
      "back": "\" 42\" (Leerzeichen + 42).\n\\D = genau ein Nicht-Ziffer-Zeichen, \\d+ = eine oder mehrere Ziffern. Die erste Ziffernfolge ist „42“; das Zeichen davor (Leerzeichen) erfüllt \\D.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 8
      }
    },
    {
      "id": "fc-ics-g-mk2",
      "chapterId": "ics-regex",
      "examRelevant": true,
      "front": "Musterklausur 6.d-2: \"/[^a-k].*\\s/\" auf \"Die Loesung ist bestimmt wieder 42\" — Treffer?",
      "back": "\"Die Loesung ist bestimmt wieder \" (bis inkl. letztem Leerzeichen).\n[^a-k] passt sofort auf „D“ (Großbuchstabe ≠ a–k), .* ist gierig und läuft bis zum Ende, dann Backtracking bis zum letzten Whitespace vor „42“.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 8
      }
    },
    {
      "id": "fc-ics-g-mk3",
      "chapterId": "ics-regex",
      "examRelevant": true,
      "front": "Musterklausur 6.d-3: \"/[eosm]{2}.*[eosm]{2}/\" auf \"Die Loesung ist bestimmt wieder 42\" — Treffer?",
      "back": "\"oesung ist bestimm\".\nErste Stelle mit zwei aufeinanderfolgenden Zeichen aus {e,o,s,m}: „oe“ in Loesung. .* gierig → letzte Stelle mit zwei solchen Zeichen ist „mm“ in bestimmt („wieder“ enthält kein Paar: ie, ed, de, er).",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 8
      }
    },
    {
      "id": "fc-ics-g-classes",
      "chapterId": "ics-regex",
      "examRelevant": true,
      "front": "Vordefinierte Zeichenklassen: \\d \\D \\w \\W \\s \\S .",
      "back": "\\d Ziffer [0-9] · \\D keine Ziffer\n\\w Wortzeichen [A-Za-z0-9_] · \\W kein Wortzeichen\n\\s Whitespace (Leerzeichen, Tab, Zeilenumbruch) · \\S kein Whitespace\n. beliebiges Zeichen (außer Zeilenumbruch); wörtlicher Punkt: \\.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-g-quant",
      "chapterId": "ics-regex",
      "examRelevant": true,
      "front": "Quantoren in regulären Ausdrücken",
      "back": "* 0 bis n · + 1 bis n · ? 0 oder 1\n{5} genau 5 · {2,} mindestens 2 · {2,4} 2 bis 4\nGelten für das unmittelbar davorstehende Zeichen, die Klasse oder die (Gruppe).\nStandard gierig; .*? / +? = genügsam (so wenig wie möglich).",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-g-brackets",
      "chapterId": "ics-regex",
      "examRelevant": true,
      "front": "Eckige Klammern: [abc], [a-z], [^a-k] — und der Unterschied von ^ innen/außen",
      "back": "[abc] genau ein Zeichen aus a, b, c · [a-z0-9] Bereiche · [^a-k] ein Zeichen, das NICHT a–k ist (auch Großbuchstaben, Ziffern, Leerzeichen).\n^ am Anfang INNERHALB [] = Negation; ^ AUSSERHALB = Textanfang. $ = Textende.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-g-pregmatch",
      "chapterId": "ics-regex",
      "examRelevant": true,
      "front": "preg_match: Parameter und Rückgabewert",
      "back": "preg_match($pattern, $subject [, $matches])\nRückgabe: 1 wenn ein Treffer gefunden, 0 wenn nicht (false bei Fehler im Muster). Sucht nur den ERSTEN Treffer.\n$matches[0] enthält den gefundenen Text, $matches[1]… die Gruppen.\nif (preg_match(\"/^\\d{5}$/\", $plz)) { … }",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-g-pregreplace",
      "chapterId": "ics-regex",
      "examRelevant": true,
      "front": "preg_replace: Parameter und Wirkung",
      "back": "preg_replace($pattern, $replacement, $subject) gibt einen NEUEN String zurück, in dem ALLE Treffer durch $replacement ersetzt sind ($subject selbst bleibt unverändert).\npreg_replace(\"/\\d/\", \"#\", \"R2D2\") → \"R#D#\"\npreg_replace(\"/\\s+/\", \" \", $t) → mehrfache Leerzeichen zu einem.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-g-delim",
      "chapterId": "ics-regex",
      "examRelevant": true,
      "front": "Wie wird ein Muster in PHP notiert (Begrenzer, Modifikatoren)?",
      "back": "Als String mit Begrenzern: \"/muster/\". Modifikatoren hinter dem schließenden Begrenzer: \"/emden/i\" = Groß-/Kleinschreibung ignorieren.\nSoll / im Muster vorkommen: \\/ maskieren.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-g-greedy",
      "chapterId": "ics-regex",
      "examRelevant": true,
      "front": "Gierig vs. genügsam: Was liefert /<.+>/ bzw. /<.+?>/ auf \"<b>fett</b>\"?",
      "back": "/<.+>/ → \"<b>fett</b>\" (gierig: so viel wie möglich bis zum letzten >)\n/<.+?>/ → \"<b>\" (genügsam: so wenig wie möglich)",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-g-group",
      "chapterId": "ics-regex",
      "examRelevant": false,
      "front": "Gruppen und Alternativen: (…) und |",
      "back": "(ab)+ wiederholt die Gruppe „ab“ (ab, abab, …).\nKatze|Hund passt auf „Katze“ oder „Hund“.\n^(Herr|Frau) [A-Z][a-z]+$ passt auf „Frau Meyer“.\nGruppeninhalte landen in $matches[1], $matches[2] …",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-ics-i-layers",
      "chapterId": "ics-internet",
      "examRelevant": false,
      "front": "Die 4 Schichten des TCP/IP-Modells mit Beispielen",
      "back": "Anwendung – Anwendungsprotokoll, z.B. HTTP\nTransport – TCP oder UDP, Ports\nInternet – IP-Nummern (Namensgeber des Internets)\nNetzzugang – Ethernet, WLAN, Bluetooth\nOSI-Modell (1984): 7 Schichten.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 8
      }
    },
    {
      "id": "fc-ics-i-ip",
      "chapterId": "ics-internet",
      "examRelevant": false,
      "front": "IPv4 vs. IPv6",
      "back": "IPv4: 32-Bit-Zahl, vier durch Punkte getrennte Dezimalzahlen, z.B. 139.13.108.16; lokale Nummern z.B. 192.168.x.x.\nIPv6: 128-Bit-Zahl, acht durch Doppelpunkt getrennte vierstellige Hexzahlen, z.B. 2001:0db8:85a3:0000:0000:8a2e:0370:7344.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 14
      }
    },
    {
      "id": "fc-ics-i-dns",
      "chapterId": "ics-internet",
      "examRelevant": false,
      "front": "DNS: Aufbau von Hostnamen und Aufgabe",
      "back": "winf1.technik-emden.de: TLD „.de“ (international ICANN/IANA), SLD „technik-emden“ (in DE: DENIC), weiter links Subdomains (Rechenzentrum der Organisation). localhost = eigener Rechner.\nDNS-Server liefern zu Hostnamen die IP-Adresse (z.B. 8.8.8.8, 1.1.1.1).",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 15
      }
    },
    {
      "id": "fc-ics-i-port",
      "chapterId": "ics-internet",
      "examRelevant": false,
      "front": "Port und Socket: Was braucht ein Client, um einen Dienst zu nutzen?",
      "back": "IP-Adresse des Server-Hosts, Portnummer des Dienstes, Protokoll.\nPort = identifiziert eine Anwendung auf einem Rechner (well-known ports, z.B. 80 HTTP, 443 HTTPS).\nSocket = virtueller Endpunkt einer Ende-zu-Ende-Verbindung: IP-Adresse, Port, Transportprotokoll (TCP/UDP).",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 16
      }
    },
    {
      "id": "fc-ics-i-vermittlung",
      "chapterId": "ics-internet",
      "examRelevant": false,
      "front": "Leitungsvermittlung vs. Paketvermittlung",
      "back": "Leitungsvermittlung (verbindungsorientiert): durchgehender Kanal wird aufgebaut, genutzt, abgebaut (Telefonnetz; TCP).\nPaketvermittlung (verbindungslos): Pakete enthalten Empfänger, Absender, Sequenznummer (IP, UDP). Darauf kann TCP verbindungsorientiert arbeiten (TCP/IP).",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 13
      }
    },
    {
      "id": "fc-ics-i-cast",
      "chapterId": "ics-internet",
      "examRelevant": false,
      "front": "Unicast, Broadcast, Anycast, Multicast",
      "back": "Unicast: ein Empfänger.\nBroadcast: alle Teilnehmer eines Netzsegments, ohne Mitwirkung der Empfänger.\nAnycast: Gruppe mit gemeinsamer Adresse, Verbindung mit dem am kürzesten erreichbaren Rechner.\nMulticast: ausgewählte, als Empfänger registrierte Teilnehmer.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 12
      }
    },
    {
      "id": "fc-ics-i-sync",
      "chapterId": "ics-internet",
      "examRelevant": false,
      "front": "Synchrone vs. asynchrone Kommunikation (OSI-Ebene 7) und Funktionsaufrufe",
      "back": "Synchron: Partner warten aufeinander, bis die Kommunikation abgeschlossen ist.\nAsynchron: Sender arbeitet weiter und prüft gelegentlich, ob eine Antwort da ist.\nSoftware: synchroner Funktionsaufruf (sequenziell, wartet auf E/A) vs. asynchron (Threads, JavaScript — vgl. Ajax-Callback).",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 10
      }
    },
    {
      "id": "fc-ics-i-www",
      "chapterId": "ics-internet",
      "examRelevant": false,
      "front": "Was ist das WWW und wodurch wurde es ursprünglich definiert?",
      "back": "Ein verteiltes, über das Internet abrufbares System von Ressourcen (Hypertext-Dokumente, Multimedia, abgefragte Informationen). Dokumente werden per URL benannt und per HTTP/HTTPS transportiert; Inhalte können serverseitig zum Anfragezeitpunkt erzeugt werden.\nUrsprünglich definiert durch HTTP, URL und HTML.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 19
      }
    }
  ],
  "quizzes": [
    {
      "id": "q-ics-h-inline",
      "chapterId": "ics-html-dom",
      "examStyle": "Musterklausur 1.b",
      "question": "Welche Auswahl enthält ausschließlich Inline-Elemente?",
      "options": [
        "<em>, <img>, <span>, <a>",
        "<em>, <img>, <span>, <a>, <title>",
        "<p>, <em>, <span>, <a>",
        "<span>, <div>, <a>, <img>"
      ],
      "answer": 0,
      "explanation": "Inline-Elemente fließen wie Wörter in der Zeile: em, img, span, a. <p> und <div> sind Block-Elemente (neue Zeile). <title> steht im <head> und wird nicht im Dokumentfluss dargestellt — typischer Fehler, ihn als Inline-Element mitzuzählen.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 35
      }
    },
    {
      "id": "q-ics-h-textnodes",
      "chapterId": "ics-html-dom",
      "examStyle": "Musterklausur 1.d (DOM-Baum)",
      "question": "Wie viele Kindknoten hat der Elementknoten <p> im DOM?",
      "code": "<p>das ist <em>sehr</em> wichtig!</p>",
      "options": [
        "1 (den Textknoten \"das ist sehr wichtig!\")",
        "2 (Textknoten \"das ist \" und Elementknoten em)",
        "3 (Textknoten \"das ist \", Elementknoten em, Textknoten \" wichtig!\")",
        "4 (zusätzlich der Textknoten \"sehr\")"
      ],
      "answer": 2,
      "explanation": "Der Text wird durch <em> in zwei Textknoten geteilt: \"das ist \" und \" wichtig!\". Dazwischen steht der Elementknoten em. Der Textknoten \"sehr\" ist Kind von em, NICHT direkt von p — daher 3 und nicht 4.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 36
      }
    },
    {
      "id": "q-ics-h-charset",
      "chapterId": "ics-html-dom",
      "examStyle": "Musterklausur 1.e",
      "question": "Welche Zeile legt im HTML-Dokument die Zeichencodierung iso-8859-15 korrekt fest?",
      "options": [
        "<?xml version=\"1.0\" encoding=\"iso-8859-15\"?> am Anfang jeder HTML-Datei",
        "<html charset=\"iso-8859-15\">",
        "<body encoding=\"iso-8859-15\">",
        "<meta charset=\"iso-8859-15\"> im <head>"
      ],
      "answer": 3,
      "explanation": "Die Codierung ist eine Metainformation und gehört per <meta charset=\"…\"> in den <head>. Die XML-Deklaration ist für XML-Dokumente; html/body kennen kein charset/encoding-Attribut.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 34
      }
    },
    {
      "id": "q-ics-h-action",
      "chapterId": "ics-html-dom",
      "examStyle": "Musterklausur 1.c",
      "question": "In welchem Element steht das Attribut action und was gibt es an?",
      "options": [
        "In <input>; den Typ des Eingabefelds",
        "In <a>; das Ziel des Hyperlinks",
        "In <form>; die HTTP-Methode (GET oder POST)",
        "In <form>; die URL, an die die Formulardaten gesendet werden"
      ],
      "answer": 3,
      "explanation": "action gehört zu <form> und enthält die Ziel-URL (z.B. ein PHP-Skript). Die HTTP-Methode steht im separaten Attribut method; das Linkziel von <a> heißt href.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 1
      }
    },
    {
      "id": "q-ics-h-head",
      "chapterId": "ics-html-dom",
      "examStyle": "Musterklausur 1.a",
      "question": "Welche Aussage zu <head> und <body> ist richtig?",
      "options": [
        "Der Inhalt von <head> wird oberhalb des <body>-Inhalts als Kopfzeile angezeigt.",
        "<head> enthält Metadaten, die nicht im Anzeigebereich erscheinen (der <title> erscheint im Tab); <body> enthält den sichtbaren Inhalt.",
        "<head> und <body> sind austauschbar, der Browser zeigt beide an.",
        "<body> enthält nur Text, Bilder müssen im <head> stehen."
      ],
      "answer": 1,
      "explanation": "<head> = Informationen über das Dokument (Metadaten: charset, title, Stylesheets). <body> = anzuzeigender Inhalt. Verwechslung mit <header>/Kopfzeile ist ein typischer Fehler.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 33
      }
    },
    {
      "id": "q-ics-h-dom-api",
      "chapterId": "ics-html-dom",
      "examStyle": "Verständnis",
      "question": "Welche Aussage über das DOM ist FALSCH?",
      "options": [
        "Änderungen am DOM werden automatisch in die HTML-Datei auf dem Server zurückgeschrieben.",
        "Es liegt im Speicher des Browsers.",
        "Es kann zur Laufzeit mit JavaScript verändert werden.",
        "Es ist ein objektorientiertes Modell des Dokuments als Baum."
      ],
      "answer": 0,
      "explanation": "Das DOM existiert nur im Browserspeicher; Änderungen (z.B. per innerHTML oder Developer Tools) betreffen nur die Ansicht, nicht die Datei auf dem Server.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 36
      }
    },
    {
      "id": "q-ics-c-fontsize",
      "chapterId": "ics-css",
      "examStyle": "Musterklausur 2.e (Schriftgröße)",
      "question": "Mit welcher Schriftgröße wird „Anmerkung“ angezeigt?",
      "code": "html  { font-size: 24px; }\n.main { font-size: 14px; }\n.anm  { font-size: 0.5rem; }\n\n<body>\n  <p>Hallo</p>\n  <div class=\"main\">\n    <p>Hier steht Text.</p>\n    <p class=\"anm\">Anmerkung</p>\n  </div>\n</body>",
      "options": [
        "7px",
        "14px",
        "12px",
        "24px"
      ],
      "answer": 2,
      "explanation": "rem bezieht sich immer auf die Schriftgröße des Wurzelelements html: 0.5 × 24px = 12px. 7px wäre das Ergebnis bei 0.5em (bezogen auf das Elternelement .main mit 14px).",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 3
      }
    },
    {
      "id": "q-ics-c-fontsize-em",
      "chapterId": "ics-css",
      "examStyle": "Variante zu Musterklausur 2.e",
      "question": "Gleiches Markup wie in 2.e, aber .anm { font-size: 0.5em; }. Welche Schriftgröße hat „Anmerkung“?",
      "code": "html  { font-size: 24px; }\n.main { font-size: 14px; }\n.anm  { font-size: 0.5em; }",
      "options": [
        "14px",
        "12px",
        "7px",
        "0.5px"
      ],
      "answer": 2,
      "explanation": "Bei font-size bezieht sich em auf die Schriftgröße des Elternelements. Eltern von <p class=\"anm\"> ist <div class=\"main\"> mit 14px → 0.5 × 14px = 7px.",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 20
      }
    },
    {
      "id": "q-ics-c-spec",
      "chapterId": "ics-css",
      "examStyle": "Code-Lesen (Spezifität)",
      "question": "In welcher Farbe wird der Absatz angezeigt?",
      "code": "<p class=\"farbig\" id=\"first\">Text im Absatz.</p>\n\np       { color: red; }\n#first  { color: blue; }\n.farbig { color: green; }",
      "options": [
        "rot",
        "schwarz (Konflikt → Standardfarbe)",
        "grün (letzte Regel gewinnt)",
        "blau"
      ],
      "answer": 3,
      "explanation": "Der ID-Selektor hat Spezifität 100, die Klasse 10, das Element 1. Die höhere Spezifität gewinnt unabhängig von der Reihenfolge — „letzte Regel gewinnt“ gilt nur bei gleicher Spezifität.",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 29
      }
    },
    {
      "id": "q-ics-c-spec-calc",
      "chapterId": "ics-css",
      "examStyle": "Verständnis (Spezifität)",
      "question": "Welche Spezifität hat der Selektor #nav .item a ?",
      "options": [
        "111",
        "102",
        "3",
        "1110"
      ],
      "answer": 0,
      "explanation": "ID 100 + Klasse 10 + Element 1 = 111 (Addition laut Folie, vgl. #header .info ul li = 112).",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 28
      }
    },
    {
      "id": "q-ics-c-group",
      "chapterId": "ics-css",
      "examStyle": "Musterklausur 2.d (Zusammenfassen)",
      "question": "h1, h2 und p haben dieselben Eigenschaften color: #ff00ff; font-family: Helvetica, sans-serif; p hat zusätzlich margin-left und border-bottom. Welche Kürzung ist korrekt und vollständig?",
      "options": [
        "h1 h2 p { color: #ff00ff; font-family: Helvetica, sans-serif; } p { margin-left: 15px; border-bottom: 1px solid #000000; }",
        "h1, h2, p { color: #ff00ff; font-family: Helvetica, sans-serif; } p { margin-left: 15px; border-bottom: 1px solid #000000; }",
        "h1, h2, p { color: #ff00ff; font-family: Helvetica, sans-serif; margin-left: 15px; border-bottom: 1px solid #000000; }",
        "h1; h2; p { color: #ff00ff; font-family: Helvetica, sans-serif; } p { margin-left: 15px; border-bottom: 1px solid #000000; }"
      ],
      "answer": 1,
      "explanation": "Gruppierung mit Komma. Ohne Komma (h1 h2 p) entsteht ein Nachfahren-Selektor (p in h2 in h1). Variante 3 würde margin/border fälschlich auch auf h1/h2 anwenden; Semikolon ist kein Selektor-Trenner.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 2
      }
    },
    {
      "id": "q-ics-c-inherit",
      "chapterId": "ics-css",
      "examStyle": "Musterklausur 2.b",
      "question": "Welche CSS-Eigenschaft wird NICHT an untergeordnete Elemente vererbt?",
      "options": [
        "color",
        "font-family",
        "margin",
        "font-size"
      ],
      "answer": 2,
      "explanation": "margin (ebenso width, background-color, border, padding) wird nicht vererbt. Textfarbe, Schriftart und Schriftgröße werden vererbt — deshalb setzt man sie gerne auf body.",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 10
      }
    },
    {
      "id": "q-ics-c-classsel",
      "chapterId": "ics-css",
      "examStyle": "Musterklausur 2.a",
      "question": "Welche Regel stellt den Inhalt von <p class=\"colorBlue\"> in blauer Schrift dar?",
      "options": [
        "p#colorBlue { color: blue; }",
        ".p colorBlue { font-color: blue; }",
        "p.colorBlue { background-color: blue; }",
        "p.colorBlue { color: blue; }"
      ],
      "answer": 3,
      "explanation": "Klassen-Selektor = Punkt (# wäre ID). Schriftfarbe = color (background-color färbt den Hintergrund; font-color gibt es nicht).",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 26
      }
    },
    {
      "id": "q-ics-c-unit",
      "chapterId": "ics-css",
      "examStyle": "Fehler finden",
      "question": "Welche Deklaration ist syntaktisch FALSCH?",
      "options": [
        "font-size: 12 px;",
        "width: 80%;",
        "margin: 0;",
        "font-size: 12px;"
      ],
      "answer": 0,
      "explanation": "Zwischen Wert und Einheit darf kein Leerzeichen stehen (12px, nicht 12 px). Beim Wert 0 darf die Einheit entfallen.",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 18
      }
    },
    {
      "id": "q-ics-c-hover",
      "chapterId": "ics-css",
      "examStyle": "Musterklausur 2.f",
      "question": "Welche Regel stellt einen Hyperlink beim Überfahren mit der Maus fett dar?",
      "options": [
        "a:active { font-weight: bold; }",
        "a:hover { font-weight: bold; }",
        "a:hover { font-style: bold; }",
        "a::hover { text-decoration: bold; }"
      ],
      "answer": 1,
      "explanation": ":hover = Mauszeiger schwebt darüber (:active = gerade geklickt). Fettdruck über font-weight (font-style ist für kursiv). Pseudoklassen haben einen Doppelpunkt, Pseudoelemente zwei.",
      "source": {
        "title": "ICS LV 2 (CSS)",
        "path": "moodle-data/internettechnologie/files/ICS LV 2.pdf",
        "page": 30
      }
    },
    {
      "id": "q-ics-l-margin3",
      "chapterId": "ics-css-layout",
      "examStyle": "Code-Lesen (Sammeleigenschaft)",
      "question": "Welchen linken Außenabstand hat p bei margin: 10px 2px 5px; ?",
      "options": [
        "0",
        "5px",
        "2px",
        "10px"
      ],
      "answer": 2,
      "explanation": "Drei Werte = oben, rechts/links, unten. Fehlt der vierte Wert (links), übernimmt er den Wert von rechts → 2px.",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 6
      }
    },
    {
      "id": "q-ics-l-border",
      "chapterId": "ics-css-layout",
      "examStyle": "Musterklausur 2.h (Rahmen skizzieren)",
      "question": "Wie sieht der Rahmen von p { border: solid; border-width: 1px 5px; } aus?",
      "options": [
        "Oben 1px, rechts 5px, unten und links ohne Rahmen",
        "Doppelte Linie 1px innen und 5px außen",
        "Links und rechts 1px, oben und unten 5px, durchgezogen",
        "Oben und unten 1px, links und rechts 5px, durchgezogen"
      ],
      "answer": 3,
      "explanation": "Zwei Werte: erster = oben/unten, zweiter = rechts/links. border: solid setzt den Stil für alle vier Seiten.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 3
      }
    },
    {
      "id": "q-ics-l-static",
      "chapterId": "ics-css-layout",
      "examStyle": "Musterklausur 2.g",
      "question": "Welcher Wert von position entspricht dem Standardlayout ohne besondere Positionierung?",
      "options": [
        "static",
        "relative",
        "absolute",
        "fixed"
      ],
      "answer": 0,
      "explanation": "static ist der Standard. relative verschiebt relativ zur Standardposition, absolute nimmt aus dem Fluss, fixed bezieht sich auf das Browserfenster.",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 11
      }
    },
    {
      "id": "q-ics-l-fixed",
      "chapterId": "ics-css-layout",
      "examStyle": "Verständnis",
      "question": "Ein Banner soll beim Scrollen immer an derselben Stelle des Browserfensters bleiben. Welcher position-Wert?",
      "options": [
        "static",
        "fixed",
        "absolute",
        "relative"
      ],
      "answer": 1,
      "explanation": "fixed positioniert bezogen auf das Browserfenster; das Element bleibt beim Scrollen stehen. absolute bezieht sich auf das umschließende Element und scrollt mit.",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 11
      }
    },
    {
      "id": "q-ics-l-relative",
      "chapterId": "ics-css-layout",
      "examStyle": "Verständnis",
      "question": "Was passiert mit den nachfolgenden Elementen, wenn ein Absatz mit position: relative; top: 20px; verschoben wird?",
      "options": [
        "Sie rücken nach oben in den frei gewordenen Platz.",
        "Sie werden ebenfalls um 20px verschoben.",
        "Nichts — der Elementfluss der anderen Elemente wird nicht beeinflusst.",
        "Sie umfließen den Absatz wie bei float."
      ],
      "answer": 2,
      "explanation": "Bei relative wird das Element zuerst normal platziert und dann verschoben; sein ursprünglicher Platz bleibt reserviert, die anderen Elemente ändern sich nicht (anders als bei absolute).",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 11
      }
    },
    {
      "id": "q-ics-l-padding",
      "chapterId": "ics-css-layout",
      "examStyle": "Musterklausur 2.i",
      "question": "Was ist der „Innenabstand“ eines Elements?",
      "options": [
        "margin – Abstand zwischen Rahmen und Nachbarelementen",
        "text-indent – Einzug der ersten Zeile",
        "border-spacing – Abstand zwischen Tabellenzellen",
        "padding – Abstand zwischen Inhalt und Rahmen"
      ],
      "answer": 3,
      "explanation": "padding = Innenabstand (innerhalb des Rahmens, in der Hintergrundfarbe des Elements); margin = Außenabstand (außerhalb des Rahmens, transparent).",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 3
      }
    },
    {
      "id": "q-ics-l-navblock",
      "chapterId": "ics-css-layout",
      "examStyle": "Website-Beispiel (2a)",
      "question": "Warum setzt das Navigationsmenü-Beispiel nav li a { display: block; padding: 8px; }?",
      "options": [
        "Weil Inline-Boxen keine Abmessungen haben — als Block wirkt das padding vollständig und die ganze Fläche ist klickbar.",
        "Damit die Links untereinander statt nebeneinander stehen.",
        "Damit die Aufzählungspunkte verschwinden.",
        "Damit die Links nicht mehr unterstrichen sind."
      ],
      "answer": 0,
      "explanation": "Laut Folie: „Als Block darstellen, um padding zu erlauben“. Nebeneinander stehen die Einträge durch float: left auf li; Punkte entfernt list-style-type: none; Unterstreichung entfernt text-decoration: none.",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 27
      }
    },
    {
      "id": "q-ics-l-hidden",
      "chapterId": "ics-css-layout",
      "examStyle": "Website-Beispiel (2a, CSS+JS)",
      "question": "Warum ruft das Spendenaufruf-Beispiel nach style.visibility = \"hidden\" zusätzlich div_spende.remove() auf?",
      "options": [
        "Weil visibility = \"hidden\" in JavaScript wirkungslos ist.",
        "Weil ein unsichtbares (hidden) Element weiterhin Platz im Layout einnimmt; remove() entfernt es aus dem DOM.",
        "Weil setTimeout sonst endlos wiederholt.",
        "Weil remove() die Hintergrundfarbe zurücksetzt."
      ],
      "answer": 1,
      "explanation": "visibility: hidden macht das Element nur unsichtbar, der Platz bleibt (gelbe Lücke). remove() löscht den Knoten aus dem DOM, der Inhalt rückt nach. setTimeout ruft nur einmal auf.",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 30
      }
    },
    {
      "id": "q-ics-j-script-end",
      "chapterId": "ics-js",
      "examStyle": "Musterklausur 3.a",
      "question": "Warum wird empfohlen, das <script>-Element am Ende des <body> zu platzieren?",
      "options": [
        "Weil JavaScript im <head> verboten ist.",
        "Weil Skripte am Ende schneller ausgeführt werden als im <head>.",
        "Weil dann alle HTML-Elemente bereits im DOM existieren und getElementById sie findet; der Seitenaufbau wird nicht verzögert.",
        "Weil der Browser Skripte sonst als Text anzeigt."
      ],
      "answer": 2,
      "explanation": "Der Browser führt ein Skript beim Parsen sofort aus. Steht es vor den Elementen, existieren diese noch nicht im DOM → getElementById liefert null. Skripte im head sind erlaubt, aber dann ist z.B. ein load-Event nötig.",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 5
      }
    },
    {
      "id": "q-ics-j-head-null",
      "chapterId": "ics-js",
      "examStyle": "Fehler finden",
      "question": "Was passiert beim Laden dieser Seite?",
      "code": "<head>\n  <script>\n    document.getElementById(\"insert\").innerHTML = \"new\";\n  </script>\n</head>\n<body>\n  <p id=\"insert\">alt</p>\n</body>",
      "options": [
        "Der Absatz zeigt „new“.",
        "Die Seite bleibt komplett leer.",
        "Der Absatz zeigt „newalt“.",
        "Der Absatz zeigt „alt“; in der Konsole erscheint ein TypeError, weil getElementById null liefert."
      ],
      "answer": 3,
      "explanation": "Beim Ausführen im head existiert <p id=\"insert\"> noch nicht → null; der Zugriff null.innerHTML wirft einen TypeError. Der restliche HTML-Inhalt wird trotzdem angezeigt, also „alt“.",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 5
      }
    },
    {
      "id": "q-ics-j-click",
      "chapterId": "ics-js",
      "examStyle": "Musterklausur 3.e",
      "question": "Welche Anweisungen rufen tuwas() beim Klick auf <div id=\"clickhere\"> auf?",
      "options": [
        "document.getElementById(\"clickhere\").addEventListener(\"click\", tuwas);",
        "document.getElementById(\"clickhere\").addEventListener(\"click\", tuwas());",
        "document.getElementById(\"#clickhere\").addEventListener(\"onclick\", tuwas);",
        "document.clickhere.addEventListener(tuwas, \"click\");"
      ],
      "answer": 0,
      "explanation": "Ereignisname \"click\" + Funktionsreferenz ohne (). Mit tuwas() würde die Funktion sofort ausgeführt und ihr Rückgabewert registriert. getElementById erwartet die id ohne # (das ist CSS-Syntax), der Event heißt \"click\" (nicht \"onclick\").",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 5
      }
    },
    {
      "id": "q-ics-j-over",
      "chapterId": "ics-js",
      "examStyle": "Musterklausur 3.d",
      "question": "Auf welches <p>-Element kann diese Funktion wirken?",
      "code": "<script>\nfunction over() {\n  document.getElementById(\"insert\").innerHTML = \"new\";\n}\nover();\n</script>",
      "options": [
        "<p class=\"insert\"></p>",
        "<p id=\"insert\"></p>",
        "<p name=\"insert\"></p>",
        "<p onclick=\"insert\"></p>"
      ],
      "answer": 1,
      "explanation": "getElementById sucht über das id-Attribut. class und name werden nicht berücksichtigt. Das <p> muss außerdem vor dem Skript stehen, weil over() sofort aufgerufen wird.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 4
      }
    },
    {
      "id": "q-ics-j-loadorder",
      "chapterId": "ics-js",
      "examStyle": "Code-Tracing",
      "question": "test_02.js wird per <script src> geladen. Was steht nach dem Laden der Seite (ohne Klick) in der Konsole?",
      "code": "\"use strict\";\nconsole.log(\"Ausgabe 1\");\n\nfunction eineFunktion() {\n  console.log(\"Ausgabe aus Funktion\");\n}\nfunction andereFunktion() {\n  console.log(\"Andere Funktion\");\n}\n\nconsole.log(\"Ausgabe 2\");",
      "options": [
        "Ausgabe 1, Ausgabe aus Funktion, Andere Funktion, Ausgabe 2",
        "Ausgabe 2, Ausgabe 1",
        "Ausgabe 1, Ausgabe 2",
        "Nichts — JavaScript läuft erst nach einem Klick."
      ],
      "answer": 2,
      "explanation": "Beim Laden wird nur der Code außerhalb der Funktionen ausgeführt. Funktionsdefinitionen werden nur registriert; ihr Körper läuft erst beim Aufruf (z.B. durch Klick auf Link/Absatz).",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 4
      }
    },
    {
      "id": "q-ics-j-form",
      "chapterId": "ics-js",
      "examStyle": "Code-Tracing (Website-Beispiel 2a)",
      "question": "Der Benutzer tippt „Franz“ und klickt auf „Absenden“. Was zeigt die Überschrift danach?",
      "code": "<h1 id=\"willkommen\">Willkommen!</h1>\n<form id=\"frm\">\n  <input type=\"text\" name=\"anrede\">\n  <input type=\"button\" value=\"Absenden\" onclick=\"anredeMerken()\">\n</form>\n<script>\nfunction anredeMerken() {\n  const formular = document.getElementById(\"frm\");\n  const anrede = formular.anrede.value;\n  let h1 = document.getElementById(\"willkommen\");\n  h1.innerHTML = \"Moin \" + anrede + \"!\";\n  formular.anrede.value = \"\";\n}\n</script>",
      "options": [
        "Willkommen!",
        "Willkommen! Moin Franz!",
        "Moin !",
        "Moin Franz!"
      ],
      "answer": 3,
      "explanation": "anrede wird gelesen, BEVOR das Feld geleert wird; innerHTML ersetzt den Inhalt von h1 vollständig → „Moin Franz!“. Das anschließende Leeren betrifft nur das Eingabefeld.",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 34
      }
    },
    {
      "id": "q-ics-j-funcref",
      "chapterId": "ics-js",
      "examStyle": "Code-Tracing",
      "question": "Was gibt dieser Code aus?",
      "code": "function quadrat(x) {\n  return x * x;\n}\nlet f = quadrat;\nlet q = f(3);\nconsole.log(q);",
      "options": [
        "9",
        "function quadrat(x) {...}",
        "undefined",
        "Fehler: f ist keine Funktion"
      ],
      "answer": 0,
      "explanation": "Funktionen sind Objekte und können Variablen zugewiesen werden (let g = tuwas; g();). f verweist auf quadrat, f(3) liefert 9.",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 16
      }
    },
    {
      "id": "q-ics-j-date",
      "chapterId": "ics-js",
      "examStyle": "Website-Beispiel (2a)",
      "question": "Welches Datum erzeugt new Date(2023, 9-1, 20)?",
      "options": [
        "20. August 2023",
        "20. September 2023",
        "20. Oktober 2023",
        "9. Januar 2023"
      ],
      "answer": 1,
      "explanation": "Monate zählen in JavaScript ab 0 (Januar = 0). 9-1 = 8 → September. Die Folie kommentiert: „20. Sep. 2023 (Jan = 0!)“.",
      "source": {
        "title": "CSS Ergänzung, Website-Beispiele (Foliensatz 2a)",
        "path": "moodle-data/internettechnologie/files/CSS ErgÃ¤nzung, Website Beispiel.pdf",
        "page": 32
      }
    },
    {
      "id": "q-ics-js-loop",
      "chapterId": "ics-js-sprache",
      "examStyle": "Musterklausur 3.b (JS Tracing)",
      "question": "Welche Werte werden ausgegeben und was gilt für x nach der Schleife?",
      "code": "for (let x = 0; x < 10; x = x + 2) {\n    console.log(\"Der Wert von x ist: \" + ++x);\n}",
      "options": [
        "0, 2, 4, 6, 8 — danach x = 10",
        "1, 3, 5, 7, 9 — danach x = 11",
        "1, 4, 7, 10 — die Schleife endet mit x = 12; außerhalb ist x (let) nicht definiert",
        "1, 4, 7 — danach x = 9"
      ],
      "answer": 2,
      "explanation": "0 → ++x = 1 (Ausgabe) → +2 = 3 → ++x = 4 → 6 → 7 → 9 (< 10, weiter!) → ++x = 10 → 12 → Abbruch. Präinkrement erhöht vor der Ausgabe. Wegen let ist x nur im Schleifenblock gültig (Zugriff danach: ReferenceError); mit var wäre x danach 12.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 4
      }
    },
    {
      "id": "q-ics-array",
      "chapterId": "ics-js-sprache",
      "examStyle": "Musterklausur 3.c",
      "question": "Welchen Wert hat die Variable a?",
      "code": "var digits = [3, 4, 6, null];\nvar a = digits.length;",
      "options": [
        "3",
        "null",
        "undefined",
        "4"
      ],
      "answer": 3,
      "explanation": "null ist ein gültiger Array-Eintrag; length zählt alle 4 Einträge.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 4
      }
    },
    {
      "id": "q-ics-s-varlet",
      "chapterId": "ics-js-sprache",
      "examStyle": "Code-Tracing (LV 3 Folie „var oder let“)",
      "question": "Was passiert bei den letzten beiden Zeilen?",
      "code": "{\n  var a = 123;\n  let b = 456;\n}\nconsole.log(\"a = \" + a);\nconsole.log(\"b = \" + b);",
      "options": [
        "a = 123, dann ReferenceError: b is not defined",
        "a = 123 und b = 456",
        "ReferenceError bei a, b = 456",
        "a = undefined, b = undefined"
      ],
      "answer": 0,
      "explanation": "var ist nicht blockgebunden → a ist außerhalb sichtbar. let ist blockgebunden → Zugriff auf b außerhalb wirft ReferenceError. Deshalb in neuem Code let/const statt var.",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 11
      }
    },
    {
      "id": "q-ics-s-div",
      "chapterId": "ics-js-sprache",
      "examStyle": "Code-Tracing (Java vs. JS)",
      "question": "Welche Ausgabe erzeugt console.log(7 / 2, Math.floor(7 / 2), 2 ** 3); ?",
      "options": [
        "3 3 8",
        "3.5 3 8",
        "3.5 4 6",
        "3 3.5 8"
      ],
      "answer": 1,
      "explanation": "In JS gibt es nur number (Gleitkomma): 7/2 = 3.5 (Java-int-Division gäbe 3). Ganzzahlig per Math.floor → 3. ** ist der Potenzoperator: 2³ = 8.",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 12
      }
    },
    {
      "id": "q-ics-s-eq",
      "chapterId": "ics-js-sprache",
      "examStyle": "Verständnis (=== vs ==)",
      "question": "Welche Ergebnisse liefern 5 == \"5\" und 5 === \"5\" in JavaScript?",
      "options": [
        "true, true",
        "false, false",
        "true, false",
        "false, true"
      ],
      "answer": 2,
      "explanation": "== vergleicht nach Typumwandlung nur den Wert → true. === vergleicht Wert UND Typ (number vs. string) → false.",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 12
      }
    },
    {
      "id": "q-ics-s-forin",
      "chapterId": "ics-js-sprache",
      "examStyle": "Code-Tracing (Objekte)",
      "question": "Was gibt die Schleife aus?",
      "code": "let h = { \"eins\": \"one\", \"zwei\": \"two\" };\nh[\"drei\"] = \"three\";\nh.vier = \"four\";\nfor (let key in h) {\n  console.log(key);\n}",
      "options": [
        "one, two, three, four",
        "Fehler: h.vier existiert nicht",
        "eins, zwei (die später ergänzten Schlüssel fehlen)",
        "eins, zwei, drei, vier"
      ],
      "answer": 3,
      "explanation": "for...in zählt die Schlüssel (Attributnamen) auf — nicht die Werte. Punkt- und Klammernotation ergänzen beide neue Schlüssel; Objekte sind dynamische Hashtabellen.",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 14
      }
    },
    {
      "id": "q-ics-s-forof",
      "chapterId": "ics-js-sprache",
      "examStyle": "Code-Tracing",
      "question": "Was steht nach Ausführung in s?",
      "code": "let ar = [10, 20];\nlet s = [];\nfor (let v of ar) s.push(v);\nfor (let i in ar) s.push(i);",
      "options": [
        "[10, 20, \"0\", \"1\"]",
        "[10, 20, 10, 20]",
        "[\"0\", \"1\", 10, 20]",
        "[0, 1, 0, 1]"
      ],
      "answer": 0,
      "explanation": "for...of liefert die Werte (10, 20), for...in die Schlüssel — bei Arrays die Indizes als Strings \"0\", \"1\".",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 18
      }
    },
    {
      "id": "q-ics-s-append",
      "chapterId": "ics-js-sprache",
      "examStyle": "Code-Tracing (Arrays)",
      "question": "Welchen Wert hat al.length am Ende?",
      "code": "let al = [];\nal[al.length] = 111;\nal[al.length] = 222;\nal[al.length] = 333;",
      "options": [
        "0",
        "3",
        "1",
        "333"
      ],
      "answer": 1,
      "explanation": "al[al.length] = x schreibt an die nächste freie Position (0, 1, 2) und vergrößert das Array jeweils — wie add() bei einer Java-ArrayList. Ergebnis: 3 Elemente.",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 13
      }
    },
    {
      "id": "q-ics-s-concat",
      "chapterId": "ics-js-sprache",
      "examStyle": "Code-Tracing (Stringverkettung)",
      "question": "Was gibt console.log(\"Wert: \" + 2 + 3); aus?",
      "options": [
        "Wert: 5",
        "Wert: 2 3",
        "Wert: 23",
        "NaN"
      ],
      "answer": 2,
      "explanation": "+ wird von links ausgewertet: \"Wert: \" + 2 = \"Wert: 2\" (String), + 3 = \"Wert: 23\". Für 5 bräuchte man Klammern: \"Wert: \" + (2 + 3).",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 12
      }
    },
    {
      "id": "q-ics-s-this",
      "chapterId": "ics-js-sprache",
      "examStyle": "Code-Tracing (Objekte, Punktnotation)",
      "question": "Was wird ausgegeben?",
      "code": "function Student(name, notePrg) {\n  this.name = name;\n  this.noteProgrammieren = notePrg;\n  this.stellDichVor = function() {\n    console.log(\"Ich bin \" + this.name);\n  };\n}\nlet erna = new Student(\"Erna\", 2.0);\nerna.stellDichVor();",
      "options": [
        "Ich bin Student",
        "Ich bin this.name",
        "Ich bin undefined",
        "Ich bin Erna"
      ],
      "answer": 3,
      "explanation": "new erzeugt ein Objekt, this verweist im Konstruktor darauf; die Methode wird über erna aufgerufen, also ist this.name = \"Erna\".",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 25
      }
    },
    {
      "id": "q-ics-s-char",
      "chapterId": "ics-js-sprache",
      "examStyle": "Verständnis (Java vs. JS)",
      "question": "Welche Aussage zu Datentypen ist korrekt?",
      "options": [
        "JavaScript hat keinen char-Typ; ein einzelnes Zeichen ist ein String der Länge 1.",
        "JavaScript hat wie Java die Typen int, long, float und double.",
        "In JavaScript müssen Variablen mit ihrem Typ deklariert werden: int i = 1;",
        "number in JavaScript ist ein 32-Bit-Ganzzahltyp."
      ],
      "answer": 0,
      "explanation": "JS kennt number (64-Bit-IEEE-754-Gleitkomma, entspricht double), bigint, boolean, string, symbol — kein char. Deklaration mit let/const/var ohne Typ.",
      "source": {
        "title": "ICS LV 3 (JavaScript)",
        "path": "moodle-data/internettechnologie/files/ICS LV 3.pdf",
        "page": 8
      }
    },
    {
      "id": "q-ics-x-wf",
      "chapterId": "ics-xml-rest",
      "examStyle": "Musterklausur 4.a (Wohlgeformtheit)",
      "question": "Welches Dokument ist wohlgeformt?",
      "options": [
        "<liste><eintrag>A</liste></eintrag>",
        "<liste><eintrag nr=\"1\">A</eintrag><eintrag nr=\"2\"/></liste>",
        "<eintrag>A</eintrag><eintrag>B</eintrag>",
        "<liste><Eintrag>A</eintrag></liste>"
      ],
      "answer": 1,
      "explanation": "Variante 3: ein Wurzelelement, korrekt verschachtelt, leeres Element mit />, Attributwerte in Quotes. 1 = Überlappung, 2 = zwei Wurzelelemente, 4 = Groß-/Kleinschreibung von Start- und End-Tag verschieden.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "q-ics-x-attr",
      "chapterId": "ics-xml-rest",
      "examStyle": "Fehler finden",
      "question": "Warum ist dieses Dokument NICHT wohlgeformt?",
      "code": "<?xml version=\"1.0\"?>\n<person relationship=work>\n  <name>Bob</name>\n</person>",
      "options": [
        "Weil eine DTD fehlt.",
        "Weil Attribute in XML nicht erlaubt sind.",
        "Weil der Attributwert nicht in Anführungszeichen steht.",
        "Weil <name> klein geschrieben ist."
      ],
      "answer": 2,
      "explanation": "Attributwerte müssen in XML in Anführungszeichen stehen (relationship=\"work\"). Eine fehlende DTD verhindert nur die Gültigkeitsprüfung, nicht die Wohlgeformtheit.",
      "source": {
        "title": "ICS LV 4 (XML)",
        "path": "moodle-data/internettechnologie/files/ICS LV 4.pdf",
        "page": 22
      }
    },
    {
      "id": "q-ics-x-valid",
      "chapterId": "ics-xml-rest",
      "examStyle": "Musterklausur 4.a (Gültigkeit)",
      "question": "Gegeben die DTD und das Dokument. Welche Aussage stimmt?",
      "code": "<!DOCTYPE person [\n  <!ELEMENT person (name, tel)>\n  <!ELEMENT name (#PCDATA)>\n  <!ELEMENT tel (#PCDATA)>\n]>\n<person>\n  <tel>0491-1234</tel>\n  <name>Bob</name>\n</person>",
      "options": [
        "Wohlgeformt und gültig.",
        "Weder wohlgeformt noch gültig.",
        "Nicht wohlgeformt, aber gültig.",
        "Wohlgeformt, aber nicht gültig: die DTD verlangt die Reihenfolge name, tel."
      ],
      "answer": 3,
      "explanation": "Syntaktisch ist alles korrekt (wohlgeformt). Die Folge (name, tel) legt aber die Reihenfolge fest — tel vor name verletzt die DTD → ungültig. „Nicht wohlgeformt, aber gültig“ ist unmöglich.",
      "source": {
        "title": "ICS LV 4 (XML)",
        "path": "moodle-data/internettechnologie/files/ICS LV 4.pdf",
        "page": 19
      }
    },
    {
      "id": "q-ics-x-dtd",
      "chapterId": "ics-xml-rest",
      "examStyle": "DTD erstellen",
      "question": "Welche DTD beschreibt das Dokument korrekt, wenn eine Bibliothek mindestens ein Buch hat und isbn Pflicht ist?",
      "code": "<bibliothek>\n  <buch isbn=\"123\">\n    <titel>XML</titel>\n  </buch>\n  <buch isbn=\"456\">\n    <titel>PHP</titel>\n  </buch>\n</bibliothek>",
      "options": [
        "<!ELEMENT bibliothek (buch+)> <!ELEMENT buch (titel)> <!ATTLIST buch isbn CDATA #REQUIRED> <!ELEMENT titel (#PCDATA)>",
        "<!ELEMENT bibliothek (buch*)> <!ELEMENT buch (titel)> <!ATTLIST buch isbn CDATA #IMPLIED> <!ELEMENT titel (#PCDATA)>",
        "<!ELEMENT bibliothek (buch)> <!ELEMENT buch (titel)> <!ATTLIST titel isbn CDATA #REQUIRED> <!ELEMENT titel (#PCDATA)>",
        "<!ELEMENT bibliothek (buch+)> <!ELEMENT buch (#PCDATA)> <!ATTLIST buch isbn CDATA #REQUIRED>"
      ],
      "answer": 0,
      "explanation": "„mindestens ein“ = +, Pflichtattribut = #REQUIRED, das Attribut gehört zu buch (nicht titel). buch enthält ein Element titel, also nicht #PCDATA; (buch) ohne Quantor erlaubt nur genau ein Buch.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "q-ics-x-quant",
      "chapterId": "ics-xml-rest",
      "examStyle": "DTD verstehen",
      "question": "Was erlaubt <!ELEMENT person (name, email?, tel*)> ?",
      "options": [
        "name optional, email genau einmal, tel mindestens einmal",
        "name genau einmal, dann optional eine email, dann beliebig viele tel (auch keine)",
        "name, email und tel in beliebiger Reihenfolge",
        "Nur Text in person"
      ],
      "answer": 1,
      "explanation": "Ohne Quantor = genau 1, ? = 0..1, * = 0..n. Das Komma legt die Reihenfolge fest.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "q-ics-x-implied",
      "chapterId": "ics-xml-rest",
      "examStyle": "Musterklausur 4.b",
      "question": "Was bedeutet <!ATTLIST Listentitel kategorie CDATA #IMPLIED> ?",
      "options": [
        "Listentitel muss ein Unterelement kategorie haben.",
        "Listentitel hat ein Pflichtattribut kategorie.",
        "Listentitel hat ein optionales Attribut kategorie mit beliebigem Textwert.",
        "kategorie enthält nicht geparste Zeichendaten (CDATA-Abschnitt) und ist ein Element."
      ],
      "answer": 2,
      "explanation": "ATTLIST deklariert Attribute (keine Elemente). CDATA = beliebiger Text, #IMPLIED = optional (#REQUIRED wäre Pflicht).",
      "source": {
        "title": "ICS LV 4 (XML)",
        "path": "moodle-data/internettechnologie/files/ICS LV 4.pdf",
        "page": 22
      }
    },
    {
      "id": "q-ics-x-scope",
      "chapterId": "ics-xml-rest",
      "examStyle": "Klausurrelevanz",
      "question": "Welches XML-Thema ist laut „Klausurrelevante Themen“ relevant?",
      "options": [
        "XML-Namensräume",
        "XML Schema (XSD)",
        "XSLT-Transformationen",
        "DTD erstellen (ohne Entities, ohne Bedingungen)"
      ],
      "answer": 3,
      "explanation": "Ausdrücklich nicht relevant: Namensräume, XML Schema, XSL, XSLT, XPath, XPointer, XLink — obwohl die LV-4-Folien sie behandeln. Relevant: Elemente/Attribute, wohlgeformt vs. gültig, DTD.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "q-ics-rest",
      "chapterId": "ics-json-ajax",
      "examStyle": "Musterklausur 4.d",
      "question": "Welche HTTP-Methoden entsprechen bei REST den Operationen Create, Read, Update, Delete?",
      "options": [
        "POST, GET, PUT, DELETE",
        "GET, POST, PUT, REMOVE",
        "PUT, GET, POST, DELETE",
        "CREATE, READ, UPDATE, DELETE"
      ],
      "answer": 0,
      "explanation": "Laut LV 5: GET = Read, POST = Create, PUT = Update, DELETE = Delete. Häufige Verwechslung: PUT und POST vertauschen.",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 11
      }
    },
    {
      "id": "q-ics-r-valid",
      "chapterId": "ics-json-ajax",
      "examStyle": "Musterklausur 4.c (JSON-Syntax)",
      "question": "Welches Dokument ist syntaktisch korrektes JSON?",
      "options": [
        "{ 'Name': 'Hans', 'Matrikelnummer': 1234567 }",
        "[ { \"Name\": \"Hans\", \"Matrikelnummer\": 1234567 }, { \"Name\": \"Erna\", \"Matrikelnummer\": 1122334 } ]",
        "{ \"Name\": \"Hans\", \"Matrikelnummer\": 1234567, }",
        "{ Name: \"Hans\", Matrikelnummer: 1234567 }"
      ],
      "answer": 1,
      "explanation": "JSON verlangt doppelte Anführungszeichen für Strings und Schlüssel, Schlüssel immer in Quotes, kein Komma nach dem letzten Element. Ein Array von Objekten ist als Wurzel erlaubt. (Mit JSON.parse geprüft.)",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 3
      }
    },
    {
      "id": "q-ics-r-error",
      "chapterId": "ics-json-ajax",
      "examStyle": "Fehler finden (JSON)",
      "question": "Wo liegt der Fehler?",
      "code": "{\n  \"firstName\": \"John\",\n  \"age\": 25,\n  \"address\": { \"city\": \"New York\" }\n  \"phoneNumber\": [ { \"type\": \"home\" } ]\n}",
      "options": [
        "Zahlen müssen in Anführungszeichen stehen (\"25\").",
        "Arrays dürfen keine Objekte enthalten.",
        "Nach dem address-Objekt fehlt ein Komma.",
        "Verschachtelte Objekte sind in JSON nicht erlaubt."
      ],
      "answer": 2,
      "explanation": "Name-Wert-Paare werden durch Kommas getrennt; nach \"address\": {...} fehlt es. Zahlen stehen ohne Quotes, Verschachtelung von Objekten und Arrays ist erlaubt (vgl. Beispiel LV 5).",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 5
      }
    },
    {
      "id": "q-ics-r-access",
      "chapterId": "ics-json-ajax",
      "examStyle": "Code-Tracing (Punktnotation)",
      "question": "Was gibt der Code aus?",
      "code": "var text = '{\"studierende\": [{\"Name\": \"Hans\"}, {\"Name\": \"Erna\"}]}';\nvar daten = JSON.parse(text);\nconsole.log(daten.studierende[1].Name);",
      "options": [
        "Hans",
        "[object Object]",
        "undefined",
        "Erna"
      ],
      "answer": 3,
      "explanation": "JSON.parse wandelt den Text in ein JS-Objekt (Unmarshalling). Arrays beginnen bei Index 0 → [1] ist das zweite Element, Name = \"Erna\".",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 7
      }
    },
    {
      "id": "q-ics-r-ajaxorder",
      "chapterId": "ics-json-ajax",
      "examStyle": "Ajax-Code verstehen",
      "question": "Welche Reihenfolge der Ajax-Anweisungen ist korrekt?",
      "options": [
        "new XMLHttpRequest() → onreadystatechange = function(){…} → open(\"GET\", url, true) → send()",
        "xhttp.send(); → xhttp.open(\"GET\", url, true); → new XMLHttpRequest()",
        "JSON.parse(this.responseText) → new XMLHttpRequest() → send()",
        "open() → new XMLHttpRequest() → onreadystatechange → send()"
      ],
      "answer": 0,
      "explanation": "Objekt erzeugen, Callback zuweisen, Anfrage mit open vorbereiten, mit send abschicken. JSON.parse steht im Callback, wenn die Antwort da ist (readyState 4, status 200).",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 16
      }
    },
    {
      "id": "q-ics-r-response",
      "chapterId": "ics-json-ajax",
      "examStyle": "Musterklausur 4.e",
      "question": "Welche Kombination ist richtig: Objekt für HTTP-Anfragen / Eigenschaft für die auswertende Funktion?",
      "options": [
        "XMLHttpRequest / responseText",
        "XMLHttpRequest / onreadystatechange",
        "JSON / parse",
        "document / addEventListener"
      ],
      "answer": 1,
      "explanation": "onreadystatechange verweist auf die Callback-Funktion, die die Serverantwort auswertet. responseText enthält die Antwort selbst, ist aber keine Funktion.",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 16
      }
    },
    {
      "id": "q-ics-r-seq",
      "chapterId": "ics-json-ajax",
      "examStyle": "UML-Sequenzdiagramm (Ajax)",
      "question": "Wer sendet im Ajax-Sequenzdiagramm aus LV 5 die zweite Anfrage HTTP GET /game1.json?",
      "options": [
        "Der Benutzer durch Eingabe einer neuen URL",
        "Der Webserver von sich aus (Server Push)",
        "JavaScript im Browser, ausgelöst durch die Auswahl in der Liste",
        "Der PHP-Prozessor"
      ],
      "answer": 2,
      "explanation": "Der erste Request (index.html) wird vom Benutzer initiiert; der zweite von JavaScript im Browser, nachdem der Benutzer in der Select-Liste gewählt hat. Die Antwort (application/json) aktualisiert die Anzeige ohne Seitenneuladen.",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 15
      }
    },
    {
      "id": "q-ics-r-gen",
      "chapterId": "ics-json-ajax",
      "examStyle": "Verständnis (Web Services)",
      "question": "Welche Technologien kennzeichnen Web Services der 2. Generation?",
      "options": [
        "XML, SOAP, WSDL",
        "FTP, SMTP, POP3",
        "XSLT, XPath, XSD",
        "JSON, JavaScript, HTTP (REST)"
      ],
      "answer": 3,
      "explanation": "1. Generation: XML, SOAP, WSDL. 2. Generation: JSON, JavaScript, HTTP — REST-Services, bei denen der Dienst durch eine URL repräsentiert wird.",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 9
      }
    },
    {
      "id": "q-ics-r-param",
      "chapterId": "ics-json-ajax",
      "examStyle": "Verständnis (REST ↔ URL)",
      "question": "Wie wird der Parameter in http://travelcompany.example.org/itinerary/reservation/FT35ZBQ übergeben?",
      "options": [
        "Als Teil des Ressourcennamens (URL-Pfadteil)",
        "Als Query-String",
        "Im SOAP-Envelope",
        "Als Cookie"
      ],
      "answer": 0,
      "explanation": "Die Reservierungsnummer ist ein durch / abgetrennter Teil des Ressourcennamens. Weitere Möglichkeiten laut LV 5: Query-String oder anwendungsspezifische HTTP-Header.",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 12
      }
    },
    {
      "id": "q-ics-r-file",
      "chapterId": "ics-json-ajax",
      "examStyle": "Verständnis",
      "question": "Die Ajax-Seite funktioniert nach Doppelklick (file:///…/index.html) nicht. Warum?",
      "options": [
        "JSON-Dateien müssen .js heißen.",
        "Ajax benötigt einen HTTP-Server; das file://-Protokoll ist mit Ajax nicht zulässig.",
        "XMLHttpRequest funktioniert nur mit POST.",
        "Der Browser blockiert generell JavaScript bei lokalen Dateien."
      ],
      "answer": 1,
      "explanation": "HTML- und JSON-Dateien müssen auf einem Server liegen, der HTTP beherrscht (z.B. XAMPP: http://localhost/index.html). Normales JavaScript läuft auch lokal.",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 14
      }
    },
    {
      "id": "q-ics-url",
      "chapterId": "ics-http-php-regex",
      "examStyle": "Musterklausur 5.e",
      "question": "Wie lautet der URL für Ressource /comp/tre12.pru auf Host m.bits101.de, Port 9155, Protokoll serdat?",
      "options": [
        "serdat://m.bits101.de/comp/tre12.pru:9155",
        "http://serdat.m.bits101.de:9155/comp/tre12.pru",
        "serdat://m.bits101.de:9155/comp/tre12.pru",
        "serdat://9155@m.bits101.de/comp/tre12.pru"
      ],
      "answer": 2,
      "explanation": "Schema protokoll://host:port/pfad. Der Port folgt mit : direkt auf den Host, vor dem Pfad.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 23
      }
    },
    {
      "id": "q-ics-t-params",
      "chapterId": "ics-http-php-regex",
      "examStyle": "Musterklausur 5.a",
      "question": "Welche Zeichen gehören in die Lücken? http://www.abc.de/index.php ___plz=26723___ort=Emden",
      "options": [
        "/ und ,",
        "& und ?",
        "# und ;",
        "? und &"
      ],
      "answer": 3,
      "explanation": "? trennt Ressource und Query-String, & trennt mehrere Name=Wert-Paare.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 24
      }
    },
    {
      "id": "q-ics-t-getct",
      "chapterId": "ics-http-php-regex",
      "examStyle": "Musterklausur 5.c",
      "question": "Warum wird bei einem GET-Request kein Content-Type-Header übertragen?",
      "options": [
        "Weil eine GET-Anfrage keinen Body hat — Content-Type beschreibt den Body.",
        "Weil der Server den Typ aus der Dateiendung ableitet.",
        "Weil GET nur Text überträgt.",
        "Weil Content-Type nur in Antworten erlaubt ist."
      ],
      "answer": 0,
      "explanation": "Content-Type gibt den Medientyp der Nutzdaten im Body an. GET hat keinen Body (Parameter stehen in der URL). In Requests mit Body (POST) ist Content-Type sehr wohl üblich.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 6
      }
    },
    {
      "id": "q-ics-t-form",
      "chapterId": "ics-http-php-regex",
      "examStyle": "Musterklausur 5.f",
      "question": "Welches Formular erzeugt beim Absenden POST /data/input.php an www.technik-emden.de mit dem Body customerID=34aE2&requestDate=16.02.2024?",
      "options": [
        "<form action=\"https://www.technik-emden.de/data/input.php\" method=\"post\"> mit Feldern name=\"customerID\" und name=\"requestDate\"",
        "<form action=\"http://www.technik-emden.de/data/input.php\" method=\"post\"> mit Feldern name=\"customerID\" und name=\"requestDate\" + Submit-Button",
        "<form action=\"http://www.technik-emden.de/data/input.php\" method=\"get\"> mit Feldern name=\"customerID\" und name=\"requestDate\"",
        "<form action=\"http://www.technik-emden.de/data/input.php\" method=\"post\"> mit Feldern id=\"customerID\" und id=\"requestDate\" + Submit-Button"
      ],
      "answer": 1,
      "explanation": "„Ohne Transportverschlüsselung“ → http (nicht https); POST → method=\"post\" (bei get stünden die Daten in der URL). Parameternamen kommen aus dem name-Attribut — id-Attribute werden nicht übertragen.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 7
      }
    },
    {
      "id": "q-ics-t-getreq",
      "chapterId": "ics-http-php-regex",
      "examStyle": "HTTP-Nachricht aufbauen",
      "question": "Das Formular <form action=\"/suche.php\" method=\"get\"> mit plz=26723 und ort=Emden wird an www.abc.de gesendet. Welche Startzeile hat der Request?",
      "options": [
        "GET /suche.php HTTP/1.1 (Daten folgen im Body)",
        "POST /suche.php?plz=26723&ort=Emden HTTP/1.1",
        "GET /suche.php?plz=26723&ort=Emden HTTP/1.1",
        "GET www.abc.de/suche.php plz=26723 ort=Emden"
      ],
      "answer": 2,
      "explanation": "Bei GET werden die Formulardaten als Query-String an den Pfad angehängt; der Host steht im Header Host: www.abc.de, nicht in der Startzeile.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "q-ics-t-setcookie",
      "chapterId": "ics-http-php-regex",
      "examStyle": "HTTP-Header (Cookies)",
      "question": "Mit welchem Header legt ein Server einen Cookie im Browser an, und mit welchem schickt der Browser ihn zurück?",
      "options": [
        "Server: Cookie / Browser: Set-Cookie",
        "Server: Set-Cookie (in der Antwort) / Browser: Cookie (in folgenden Anfragen)",
        "Server: Content-Type: cookie / Browser: Host",
        "Beide verwenden Set-Cookie"
      ],
      "answer": 1,
      "explanation": "Set-Cookie steht in der HTTP-Antwort, der Browser speichert den Cookie und sendet ihn bei jeder weiteren Anfrage an den Server im Header Cookie: name=wert.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "q-ics-t-length",
      "chapterId": "ics-http-php-regex",
      "examStyle": "HTTP-Nachricht aufbauen",
      "question": "Welchen Wert hat Content-Length für den POST-Body plz=26723&ort=Emden ?",
      "options": [
        "2",
        "17",
        "Kein Content-Length bei POST",
        "19"
      ],
      "answer": 3,
      "explanation": "Content-Length = Anzahl Bytes des Bodys: \"plz=26723\" (9) + \"&\" (1) + \"ort=Emden\" (9) = 19 (mit node nachgezählt). 2 wäre die Anzahl Parameter.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "q-ics-t-http2",
      "chapterId": "ics-http-php-regex",
      "examStyle": "Musterklausur 5.d",
      "question": "Welche Aussage nennt zwei Verbesserungen von HTTP/2 gegenüber HTTP/1.1?",
      "options": [
        "Multiplexing mehrerer Anfragen über eine TCP-Verbindung und Header-Kompression",
        "Einführung von GET und POST",
        "Verschlüsselung per Port 80 und Cookies",
        "Ersatz von TCP durch FTP und Einführung von HTML5"
      ],
      "answer": 0,
      "explanation": "HTTP/2: binäres Protokoll, Multiplexing, Header-Kompression, Server Push. GET/POST und Cookies gab es schon vorher. [Hinweis: HTTP/2 ist in den vorliegenden Folien nicht erläutert — Allgemeinwissen.]",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 6
      }
    },
    {
      "id": "q-ics-t-htdocs",
      "chapterId": "ics-http-php-regex",
      "examStyle": "Musterklausur 5.g",
      "question": "In welchem Ordner erwartet ein Apache-Webserver (z.B. XAMPP) in der Standardkonfiguration die auszuliefernden HTML-Dokumente?",
      "options": [
        "public_html im Benutzerverzeichnis",
        "htdocs",
        "cgi-bin",
        "www-data"
      ],
      "answer": 1,
      "explanation": "Der DocumentRoot von Apache heißt htdocs (XAMPP: C:\\xampp\\htdocs, Aufruf http://localhost/index.html). cgi-bin ist für CGI-Programme.",
      "source": {
        "title": "ICS LV 5 (JSON, RESTful, Ajax)",
        "path": "moodle-data/internettechnologie/files/ICS LV 5.pdf",
        "page": 17
      }
    },
    {
      "id": "q-ics-t-relurl",
      "chapterId": "ics-http-php-regex",
      "examStyle": "Verständnis (relative URLs)",
      "question": "Das Dokument liegt unter /ics/seite.html. Worauf verweist ../img/logo.png?",
      "options": [
        "/ics/img/logo.png",
        "/ics/../logo.png",
        "/img/logo.png",
        "img/logo.png im Wurzelordner des Clients"
      ],
      "answer": 2,
      "explanation": "../ wechselt vom Ordner /ics/ in den übergeordneten Ordner /, dann img/logo.png → /img/logo.png. ./ wäre der aktuelle Ordner.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 26
      }
    },
    {
      "id": "q-ics-p-arbeit",
      "chapterId": "ics-php",
      "examStyle": "Verständnis (Webserver ↔ PHP)",
      "question": "Was erhält der Browser, wenn er http://localhost/input.php abruft?",
      "options": [
        "Den PHP-Quelltext, den er selbst ausführt",
        "Nichts — PHP-Dateien können nicht per HTTP abgerufen werden",
        "Eine JSON-Beschreibung des Skripts",
        "Die vom PHP-Prozessor erzeugte Ausgabe (z.B. HTML), die der Webserver zurücksendet"
      ],
      "answer": 3,
      "explanation": "Der Webserver übergibt .php-Dateien an den PHP-Prozessor; dieser führt das Skript serverseitig aus. Nur das Ergebnis (HTML) geht an den Browser — der Quelltext bleibt auf dem Server.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "q-ics-p-post",
      "chapterId": "ics-php",
      "examStyle": "Musterklausur 6.a",
      "question": "Welches Skript gibt die Formulardaten aus 5.f korrekt als ungeordnete Liste aus?",
      "options": [
        "<?php echo \"<ul>\"; echo \"<li>\" . $_POST[\"customerID\"] . \"</li>\"; echo \"<li>\" . $_POST[\"requestDate\"] . \"</li>\"; echo \"</ul>\"; ?>",
        "<?php echo \"<ul><li>\" + $_POST[\"customerID\"] + \"</li></ul>\"; ?>",
        "<?php echo \"<ol>\"; echo \"<li>\" . $_GET[\"customerID\"] . \"</li>\"; echo \"<li>\" . $_GET[\"requestDate\"] . \"</li>\"; echo \"</ol>\"; ?>",
        "<?php print_list($_POST); ?>"
      ],
      "answer": 0,
      "explanation": "PHP verkettet mit . (nicht +); das Formular nutzt POST → $_POST; ungeordnete Liste = <ul> (<ol> ist geordnet). print_list ist keine PHP-Funktion.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 8
      }
    },
    {
      "id": "q-ics-p-identity",
      "chapterId": "ics-php",
      "examStyle": "Musterklausur 6.b",
      "question": "Was liefern \"5\" == 5 und \"5\" === 5 in PHP?",
      "options": [
        "true, true",
        "true, false",
        "false, true",
        "false, false"
      ],
      "answer": 1,
      "explanation": "== vergleicht Werte nach Typumwandlung → true. === prüft zusätzlich den Typ (string vs. int) → false.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 8
      }
    },
    {
      "id": "q-ics-p-quotes",
      "chapterId": "ics-php",
      "examStyle": "Code-Tracing (PHP)",
      "question": "Was gibt das Skript aus?",
      "code": "<?php\n$name = \"Erna\";\necho \"Hallo $name! \";\necho 'Hallo $name!';\n?>",
      "options": [
        "Hallo Erna! Hallo Erna!",
        "Hallo $name! Hallo Erna!",
        "Hallo Erna! Hallo $name!",
        "Fehler: Variablen dürfen nicht in Strings stehen"
      ],
      "answer": 2,
      "explanation": "In doppelten Anführungszeichen werden Variablen ersetzt, in einfachen nicht.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "q-ics-p-cookie",
      "chapterId": "ics-php",
      "examStyle": "Verständnis (Cookies)",
      "question": "Ein Skript ruft setcookie(\"user\", \"John\"); auf und prüft direkt danach isset($_COOKIE[\"user\"]). Was ergibt die Prüfung beim ERSTEN Aufruf (Browser hatte noch keinen Cookie)?",
      "options": [
        "true, setcookie füllt $_COOKIE sofort",
        "true, aber nur bei POST-Anfragen",
        "Fehler, weil setcookie nur in JavaScript existiert",
        "false — $_COOKIE enthält nur Cookies, die der Browser in DIESER Anfrage mitgeschickt hat; John kommt erst bei der nächsten Anfrage"
      ],
      "answer": 3,
      "explanation": "setcookie erzeugt nur den Antwort-Header Set-Cookie. Der Browser sendet den Cookie erst bei der nächsten Anfrage im Header Cookie zurück; erst dann steht er in $_COOKIE.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "q-ics-p-concat",
      "chapterId": "ics-php",
      "examStyle": "Fehler finden (PHP)",
      "question": "Welche Zeile verkettet in PHP korrekt einen String mit einer Variablen?",
      "options": [
        "echo \"Ort: \" . $ort;",
        "echo \"Ort: \" + $ort;",
        "echo \"Ort: \" & $ort;",
        "echo \"Ort: \" , ort;"
      ],
      "answer": 0,
      "explanation": "Der Verkettungsoperator in PHP ist der Punkt. + ist arithmetische Addition (anders als in JavaScript). Variablen brauchen immer das $.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "q-ics-p-get",
      "chapterId": "ics-php",
      "examStyle": "Code-Tracing (PHP + HTTP)",
      "question": "Aufruf: http://localhost/gruss.php?name=Erna&ort=Emden. Was erhält der Browser?",
      "code": "<p>Moin <?php echo $_GET[\"name\"] . \" aus \" . $_GET[\"ort\"]; ?>!</p>",
      "options": [
        "<p>Moin <?php echo ... ?>!</p>",
        "<p>Moin Erna aus Emden!</p>",
        "<p>Moin name aus ort!</p>",
        "<p>Moin !</p>, weil $_POST benutzt werden müsste"
      ],
      "answer": 1,
      "explanation": "Query-String-Parameter landen in $_GET. Der PHP-Block wird serverseitig durch seine Ausgabe ersetzt; der Browser sieht nur das HTML.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "q-ics-regex1",
      "chapterId": "ics-regex",
      "examStyle": "Musterklausur 6.d (PHP RegEx)",
      "question": "Welche Zeichenfolge findet preg_match(\"/\\D\\d+/\", \"Die Loesung ist bestimmt wieder 42\")?",
      "options": [
        "\"42\"",
        "\"Die Loesung ist bestimmt wieder 42\"",
        "\" 42\" (Leerzeichen + 42)",
        "Kein Treffer"
      ],
      "answer": 2,
      "explanation": "\\D matcht GENAU EIN Nicht-Ziffer-Zeichen (das Leerzeichen vor der 4), \\d+ eine oder mehrere Ziffern (\"42\"). Ergebnis \" 42\" (mit node geprüft).",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 8
      }
    },
    {
      "id": "q-ics-regex2",
      "chapterId": "ics-regex",
      "examStyle": "Musterklausur 6.d (Greedy RegEx)",
      "question": "Welche Zeichenfolge findet preg_match(\"/[^a-k].*\\s/\", \"Die Loesung ist bestimmt wieder 42\")?",
      "options": [
        "\"Die \"",
        "\" 42\"",
        "\"Loesung \"",
        "\"Die Loesung ist bestimmt wieder \" (gierig bis zum letzten Leerzeichen)"
      ],
      "answer": 3,
      "explanation": "[^a-k] matcht schon das große \"D\" (nicht im Bereich a–k). .* ist gierig und frisst bis zum Ende; durch Backtracking endet der Treffer am LETZTEN Whitespace vor \"42\". \"Die \" wäre das Ergebnis bei genügsamem .*? (mit node geprüft).",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 8
      }
    },
    {
      "id": "q-ics-regex3",
      "chapterId": "ics-regex",
      "examStyle": "Musterklausur 6.d (Zeichenklasse + Quantor)",
      "question": "Welche Zeichenfolge findet preg_match(\"/[eosm]{2}.*[eosm]{2}/\", \"Die Loesung ist bestimmt wieder 42\")?",
      "options": [
        "\"oesung ist bestimm\"",
        "\"oesung ist bes\"",
        "\"oe\"",
        "\"Loesung ist bestimmt wieder\""
      ],
      "answer": 0,
      "explanation": "Erster Start mit zwei Zeichen aus {e,o,s,m}: \"oe\". .* gierig → so weit wie möglich, sodass am Ende noch zwei Zeichen aus der Klasse folgen: das letzte Paar ist \"mm\" in bestimmt (\"wieder\" hat kein solches Paar). \"oesung ist bes\" wäre das genügsame Ergebnis (.*?) — mit node geprüft.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 8
      }
    },
    {
      "id": "q-ics-g-plz",
      "chapterId": "ics-regex",
      "examStyle": "Musterklausur 6.c",
      "question": "Welcher reguläre Ausdruck akzeptiert genau eine PLZ aus 5 Dezimalziffern (und nichts sonst)?",
      "options": [
        "/\\d{5}/",
        "/^\\d{5}$/",
        "/^[0-5]$/",
        "/^\\d+$/"
      ],
      "answer": 1,
      "explanation": "^ und $ verankern Anfang und Ende, {5} verlangt genau 5 Ziffern. /\\d{5}/ trifft auch \"123456\"; [0-5] ist EIN Zeichen 0–5; \\d+ erlaubt beliebig viele Ziffern.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 8
      }
    },
    {
      "id": "q-ics-g-replace",
      "chapterId": "ics-regex",
      "examStyle": "preg_replace anwenden",
      "question": "Was liefert preg_replace(\"/\\d/\", \"#\", \"R2D2\")?",
      "options": [
        "\"R#D2\"",
        "\"##\"",
        "\"R#D#\"",
        "1"
      ],
      "answer": 2,
      "explanation": "preg_replace ersetzt ALLE Treffer (nicht nur den ersten) und gibt den neuen String zurück. Die Zahl 1 wäre ein typischer preg_match-Rückgabewert.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "q-ics-g-return",
      "chapterId": "ics-regex",
      "examStyle": "preg_match anwenden",
      "question": "Welchen Wert liefert preg_match(\"/^[A-Z][a-z]+$/\", \"emden\")?",
      "options": [
        "1",
        "true und $matches = [\"emden\"]",
        "\"emden\"",
        "0"
      ],
      "answer": 3,
      "explanation": "Das Muster verlangt einen Großbuchstaben am Anfang; \"emden\" beginnt klein → kein Treffer → 0. Bei \"Emden\" wäre es 1. preg_match liefert die Anzahl der Treffer (0 oder 1), nicht den Text.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "q-ics-g-neg",
      "chapterId": "ics-regex",
      "examStyle": "Zeichenklassen verstehen",
      "question": "Auf welches Zeichen passt [^a-k] NICHT?",
      "options": [
        "\"e\"",
        "\" \" (Leerzeichen)",
        "\"D\"",
        "\"z\""
      ],
      "answer": 0,
      "explanation": "[^a-k] = jedes Zeichen außer den Kleinbuchstaben a bis k. \"e\" liegt im Bereich → kein Treffer. Großbuchstaben, Leerzeichen und \"z\" passen — klassische Falle in Musterklausur 6.d.",
      "source": {
        "title": "ICS-Musterklausur",
        "path": "moodle-data/internettechnologie/files/ICS-Musterklausur.pdf",
        "page": 8
      }
    },
    {
      "id": "q-ics-g-dot",
      "chapterId": "ics-regex",
      "examStyle": "Metazeichen verstehen",
      "question": "Welche Texte enthalten einen Treffer für /a.c/ ?",
      "options": [
        "nur \"abc\"",
        "\"abc\" und \"a-c\", aber nicht \"ac\"",
        "\"ac\", \"abc\" und \"a-c\"",
        "nur \"a.c\""
      ],
      "answer": 1,
      "explanation": ". steht für genau EIN beliebiges Zeichen. \"ac\" hat zwischen a und c kein Zeichen → kein Treffer. Für einen wörtlichen Punkt müsste man \\. schreiben.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "q-ics-g-greedy",
      "chapterId": "ics-regex",
      "examStyle": "Gierige Quantoren",
      "question": "Was findet preg_match(\"/<.+>/\", \"<b>fett</b>\", $m) in $m[0]?",
      "options": [
        "\"<b>\"",
        "\"fett\"",
        "\"<b>fett</b>\"",
        "\"</b>\""
      ],
      "answer": 2,
      "explanation": ".+ ist gierig und nimmt so viel wie möglich — bis zum letzten \">\". Für \"<b>\" bräuchte man den genügsamen Quantor .+? (mit node geprüft).",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "q-ics-g-ws",
      "chapterId": "ics-regex",
      "examStyle": "RegEx erstellen",
      "question": "Welches Muster passt auf ein Datum im Format TT.MM.JJJJ wie 16.02.2024 (ganzer String)?",
      "options": [
        "/^\\d{2}.\\d{2}.\\d{4}$/ ist exakt, weil . einen Punkt bedeutet",
        "/^\\d\\d.\\d\\d.\\d\\d$/",
        "/^[0-9]{2,4}$/",
        "/^\\d{2}\\.\\d{2}\\.\\d{4}$/"
      ],
      "answer": 3,
      "explanation": "Der wörtliche Punkt muss als \\. maskiert werden; unmaskiert passt . auf jedes Zeichen (auch \"16-02-2024\"). {4} für das Jahr. Variante 4 erlaubt nur zweistellige Jahre.",
      "source": {
        "title": "ICS Klausurrelevante Themen",
        "path": "moodle-data/internettechnologie/files/ICS Klausurrelevante Themen.pdf",
        "page": 1
      }
    },
    {
      "id": "q-ics-i-client",
      "chapterId": "ics-internet",
      "examStyle": "Verständnis (LV 1)",
      "question": "Was benötigt ein Client, um einen Dienst im Internet zu nutzen?",
      "options": [
        "IP-Adresse des Serverhosts, Portnummer des Dienstes und das Protokoll",
        "Nur den Hostnamen",
        "Die MAC-Adresse des Servers",
        "Einen Socket auf dem Server, der vom Client angelegt wird"
      ],
      "answer": 0,
      "explanation": "Laut LV 1: IP-Adresse (ggf. per DNS aus dem Hostnamen ermittelt), Portnummer und Protokoll.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 16
      }
    },
    {
      "id": "q-ics-i-layer",
      "chapterId": "ics-internet",
      "examStyle": "Verständnis (LV 1)",
      "question": "In welcher Schicht des TCP/IP-Modells sind Portnummern angesiedelt?",
      "options": [
        "Anwendung",
        "Transport",
        "Internet",
        "Netzzugang"
      ],
      "answer": 1,
      "explanation": "Transportschicht (TCP/UDP) adressiert Anwendungen über Ports; die Internet-Schicht adressiert Hosts über IP-Nummern.",
      "source": {
        "title": "ICS LV 1 (Internet, WWW, HTML, DOM)",
        "path": "moodle-data/internettechnologie/files/ICS LV 1.pdf",
        "page": 8
      }
    }
  ]
};
