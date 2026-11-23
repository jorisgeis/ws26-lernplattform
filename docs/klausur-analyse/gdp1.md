# Klausur-Analyse GP1 – Grundlagen der Programmierung 1 (WS 2026/27, Prof. Dr. G. J. Veltink)

> Grundlage: ausschließlich die lokal gespeicherten Moodle-Daten unter `moodle-data/gdp1/` (Probeklausur, Wochenplan, 10 Foliensätze, 14 VFH-Lerneinheiten, Code Conventions, Forum „Ankündigungen", Seiten, PA-Abgabeseiten).
> Seitenangaben = PDF-Seite laut `moodle-data/extracted_text/gdp1/*.txt` (`--- Page N ---`).
> Alles, was **nicht** wörtlich in den Quellen steht, ist mit **[Inferenz]** markiert.

## 1. Prüfungsform & Regeln (belegt)

| Punkt | Aussage | Quelle |
|---|---|---|
| Form | Papierklausur vor Ort, **120 Minuten**, „9 Themen / Fragen, jeweils mit Unterfragen", Beispielklausur in Moodle | `files/01. Einführung/GP1_26WS_01_Einfuehrung.pdf` S. 30 |
| Punkte | **100 Punkte**, 120 Minuten | `files/GP1_Probeklausur.pdf` S. 1 |
| Hilfsmittel | **1 DIN-A4-Blatt mit eigenen Notizen**: entweder **doppelseitig handgeschrieben** oder **einseitig bedruckt**; wird mit der Klausur abgegeben | Probeklausur S. 1; Folien 01 S. 30 |
| Schreibmittel | nur Tinte/Kugelschreiber, Antworten in den Freiraum (auch Rückseite), keine Zusatzblätter | Probeklausur S. 1 |
| Notenschlüssel (Probeklausur) | 95–100 → 1,0 · 90–94 → 1,3 · 85–89 → 1,7 · **80–84 → 2,0 · 75–79 → 2,3 · 70–74 → 2,7** · 65–69 → 3,0 · 60–64 → 3,3 · 55–59 → 3,7 · 50–54 → 4,0 · <50 nicht bestanden | Probeklausur S. 1 |
| PVL (Zulassung) | Pflichtaufgaben **PA1, PA2, PA3 bestehen**; nur Abgaben ohne Checkstyle-Fehler/Warnungen werden akzeptiert; Plagiat = nicht bestanden | Folien 01 S. 26–29; `pages/1495847_Hinweise zur Rückmeldungen.txt` |
| Termine | PA3-Endabgabe 20.12.2026; „Meldung PVL bis ??.01.27"; Woche 17 (12.01.2027) „Prüfungsvorbereitung/Fragestunde"; Woche 19 (ab 26.01.2027) „1. Prüfungswoche" | `files/GP1 26WS - Wochenplan v1.0.pdf` S. 1 |
| Umgebung | keine IDE in GP1, OpenJDK **17** | Folien 01 S. 28 |

**Für 2,x braucht man ≥ 70 Punkte (2,7), für 2,0 ≥ 80 Punkte** (Notenschlüssel der Probeklausur; **[Inferenz]**: dass der Schlüssel in der echten Klausur gleich bleibt).

## 2. Aufgabentypen der Probeklausur (13.05.2023) mit Punkten

| Nr. | Thema | Typ | Punkte | Seite |
|---|---|---|---|---|
| 1.a | Modifizierer für Methoden (außer `static`) nennen + Wirkung (≥ 4) | Wissen | 8 | 2 |
| 2.a | Klasse `MyClass` mit lokaler `int`-Variable `localVar` und Instanzvariable `instanceVar` (Gleitkomma) | Code schreiben | 4 | 3 |
| 2.b | Lokale vs. Instanzvariable: Einsatz, Lebensdauer, Sichtbarkeit | Wissen | 4 | 3 |
| 2.c | Typerweiterung + Typeinengung je ein Beispiel; wann implizit? | Wissen + Code | 6 | 3 |
| 3.a | `switch` ohne `break` (Fall-Through) → Ausgabe | Code-Tracing | 5 | 4 |
| 3.b | `if` ohne geschweifte Klammern (Einrückungsfalle) → Ausgabe | Code-Tracing | 5 | 4 |
| 4.a | Zwei Fehler finden (`if (j = 3)`, `j` außerhalb des for-Scopes) | Fehlersuche | 8 | 5 |
| 5.a | `while (a++ <= 3) { b = a - --b; }` → Ausgabe | Code-Tracing | 6 | 6 |
| 6.a | Schleife analysieren (`doIt`: Zweierpotenzen) | Code lesen | 4 | 7 |
| 6.b | Refactoring: for → „saubere" while-Schleife + gute Namen | Code schreiben | 6 | 7 |
| 6.c | Neue Methode mit JavaDoc dokumentieren | Code schreiben | 4 | 7 |
| 7.a | `static` Attribut vs. Instanzattribut (`Widget`) | Wissen | 6 | 8 |
| 7.b | `public static void mit()` vs. `public void ohne()` (`Pommes`) | Wissen | 6 | 8 |
| 8.a | `Rectangle` als Unterklasse der abstrakten Klasse `Shape` (`area()`, `circumference()`) **vollständig mit JavaDoc** | Klasse programmieren | 16 | 9 |
| 9.a | Datenkapselung: Ziel + Umsetzung in Java | Wissen (Präsenzveranstaltung) | 6 | 10 |
| 9.b | „Schrittweise Verfeinerung" ausführlich in richtiger Reihenfolge | Wissen (Präsenzveranstaltung) | 6 | 10 |

Verteilung nach Typ: **Wissensfragen 42 P** (1.a, 2.b, 2.c, 7.a, 7.b, 9.a, 9.b) · **Code-Tracing/Lesen 20 P** (3.a, 3.b, 5.a, 6.a) · **Fehlersuche 8 P** (4.a) · **Code schreiben 30 P** (2.a, 6.b, 6.c, 8.a).

**[Inferenz]** Die Probeklausur stammt von 2023; der Folienhinweis „9 Themen / Fragen, jeweils mit Unterfragen" (Folien 01 S. 30) passt exakt zu ihrer Struktur (9 Aufgaben). Es ist daher wahrscheinlich, dass die echte Klausur dieselben **Aufgabentypen** nutzt, aber mit **anderen Code-Beispielen** und ggf. anderen Wissensfragen. Aufgabe 9 heißt „Präsenzveranstaltungen" → fragt Inhalte der Vorlesungs-Chats ab (2023: Datenkapselung aus „OOP: Theorie", Schrittweise Verfeinerung aus der gleichnamigen Vorlesung).

## 3. Themen-Ranking

| Thema | Wahrscheinlichkeit | Begründung mit Quelle | geschätzte Punkte |
|---|---|---|---|
| Modifizierer (`public/private/protected/final/abstract/static`) & `static` bei Attributen/Methoden | **sehr hoch** | Probeklausur 1.a, 7.a, 7.b (S. 2, 8) = 20 P; Folien 03 S. 45 (Sichtbarkeitstabelle), Folien 05 S. 8 (`static final`), VFH VRB S. 18, 41–42 | 15–20 |
| Abgeleitete Klasse programmieren (abstrakte Basisklasse, Konstruktor, `@Override`, JavaDoc) | **sehr hoch** | Probeklausur 8.a (S. 9) = 16 P; Folien 10 S. 5–13 (Van extends Car, super, Konstruktorverkettung); VFH VRB S. 13–17, 37–40 | 14–16 |
| Code-Tracing: `switch`/Fall-Through, `if` ohne `{}`, Prä-/Post-Inkrement in Schleifen | **sehr hoch** | Probeklausur 3.a, 3.b, 5.a (S. 4, 6) = 16 P; Folien 07 S. 18–21 (Fall-Through), Folien 05 S. 18, 20 (Auswertung, `++`), VFH VAR S. 16 (Übung `++zahl1 * zahl1++`) | 14–16 |
| Variablenarten (lokal/Instanz/Klasse), Scope, Typumwandlung (implizit/explizit) | **sehr hoch** | Probeklausur 2.a–c (S. 3) = 14 P; Folien 05 S. 6, 10–13; VFH VAR S. 33–35; VFH STA S. 40 | 10–14 |
| Schleifen analysieren, for → while umschreiben, sprechende Namen, JavaDoc einer Methode | **sehr hoch** | Probeklausur 6.a–c (S. 7) = 14 P; Folien 07 S. 23–36; VFH ITR S. 29 (Äquivalenz for/while); Folien 03 S. 10, 20–23 (Namensgebung, JavaDoc-Tags) | 10–14 |
| Fehlersuche (Compile-Fehler: `=` vs `==`, Scope, fehlendes Semikolon, Typfehler …) | **sehr hoch** | Probeklausur 4.a (S. 5) = 8 P; Folien 05 S. 6 (Scope-Fehler), Folien 07 S. 13 („`==` nicht `=`!"), S. 28 (Semikolon bei do-while) | 8 |
| Datenkapselung (Ziel/Umsetzung) | **sehr hoch** | Probeklausur 9.a (S. 10); Folien 08 S. 14–17; Folien 09 S. 21–22; VFH PJA S. 26–27 | 6 |
| Schrittweise Verfeinerung | **hoch** (2023 gefragt; Vorlesung Woche 10) | Probeklausur 9.b (S. 10); Wochenplan S. 1 (Vorlesung 24.11.2026); VFH EIP S. 38–40 (Kaffeekochen). **Folien zur Vorlesung liegen nicht vor.** | 0–6 |
| Konstruktoren, `this`, `this(…)`, Getter/Setter, Standardkonstruktor, Immutable Class | **hoch** | Grundlage für 8.a; Folien 09 S. 20–29; VFH KLA S. 33–41 | (in 8.a enthalten) |
| Überladen vs. Überlagern (overloading/overriding), Signatur | **hoch** | Folien 09 S. 17–19, Folien 10 S. 11 („bitte aufpassen!"); VFH STA S. 30 | 0–6 |
| Polymorphie / dynamische Bindung, `Object`, `instanceof`, Casts | **hoch** | Folien 10 S. 9–16; VFH VRB S. 24–36 | 0–6 |
| Parameterübergabe „call by value" (auch bei Referenzen) | **hoch** (Präsenz-Thema mit ausführlicher Animation) | Folien 10 S. 33–52 | 0–6 |
| Operatoren: Ganzzahldivision, `%`, Short-Circuit `&&`/`||`, `?:`, String-Verkettung, Rangfolge | **hoch** | Folien 05 S. 14–26; Folien 10 S. 27–32 (trinärer Operator) | in Tracing-Aufgaben |
| Ausnahmebehandlung (`try/catch/finally`, `throw`/`throws`, checked/unchecked) | **mittel** | VFH EXC (LE 09), Vorlesung „Ausnahmen" Woche 12 (Wochenplan); **nicht** in der Probeklausur | 0–8 |
| Arrays (Index 0, `length`, foreach, `ArrayIndexOutOfBoundsException`, Kommandozeilenparameter) | **mittel** | VFH ARR (LE 10), Folien 06 S. 7, 10–18; Vorlesung „Arrays/Zeichenketten" Woche 14; nicht in Probeklausur | 0–8 |
| Strings (`equals` vs `==`, immutable, `length()`, `charAt`, `substring`) | **mittel** | VFH ZKT S. 6–7, 13–14 (LE 11); Folien 05 S. 21 (`==` bei Referenztypen) | 0–6 |
| OOP-Theorie: is-a/LSP, part-of (Komposition/Aggregation), Verwendung, Assertions | **mittel** | Folien 08 S. 11–34 (mögliche Aufgabe 9 „Präsenzveranstaltungen") | 0–6 |
| Kommandozeilenparameter, `Integer.parseInt`, `System.exit`, `System.err` | **mittel** | Folien 06 S. 4–18 | 0–4 |
| Konstanten (`static final`, GROSSBUCHSTABEN), Code Conventions, Bezeichner-Regeln | **mittel** | Folien 04 S. 7–10, Folien 05 S. 7–9, Folien 03 S. 7–10; `CodeConventions_deutsch_v1_2.pdf` | in 6.b/8.a (Stil) |
| Pakete/`import`/`java.lang` | **niedrig–mittel** | Folien 10 S. 17–25 | 0–3 |
| Java-Kontext (Compiler/Interpreter/JVM/Bytecode, Sandbox, Garbage Collection) | **niedrig** | Folien 02 S. 3–10; VFH PJA, PUP | 0–4 |
| Datentyp-Details (Bitbreiten, Literale `L`/`f`/`0x`, Unicode, `char`-Escapes) | **niedrig–mittel** | Folien 04 S. 12–19 | 0–4 |
| Bitoperatoren, Enums, StringBuilder, Formatierung, 2D-Arrays, Computergeschichte | **niedrig** | Folien 05 S. 23; VFH KLA S. 42; VFH ZKT S. 19–25; VFH ARR S. 50; VFH EIP | 0–2 |

## 4. Strategie für 2,x (Ziel ≥ 70 Punkte)

1. **Die 42 Wissenspunkte vorbereiten und aufs A4-Blatt schreiben** (Modifizierer-Tabelle, lokal vs. Instanz vs. Klasse, Widening-Kette + Beispiele, `static`-Attribut/-Methode mit `Widget`/`Pommes`-Formulierungen, Datenkapselung, Schrittweise Verfeinerung in Schritten, Überladen/Überlagern, call by value). Das sind fast reine „Auswendig"-Punkte.
2. **Code-Tracing (≈ 20 P) mit Wertetabelle**: für jede Variable eine Spalte, jede Zeile/Bedingungsprüfung eine Zeile. Fallen: `a++` erhöht **auch wenn** die Bedingung `false` ist; `switch` ohne `break` läuft weiter; ohne `{}` gehört nur **eine** Anweisung zum `if`/`else`/`for`; `else` gehört zum **nächsten** `if`; Ganzzahldivision `7/2 == 3`; `"" + 1 + 2` = `"12"` aber `1 + 2 + ""` = `"3"`.
3. **Klasse schreiben (8.a, 16 P) als Schablone üben**: Header-Kommentar, Klassen-JavaDoc mit `@author`/`@version`, `private` Attribute, Konstruktor (JavaDoc mit `@param`), Getter, `@Override` jeder abstrakten Methode mit `@return`. Diese Schablone gehört aufs A4-Blatt.
4. **Fehlersuche (8 P)**: Checkliste: `=` statt `==`, Variable außerhalb ihres Blocks, fehlende Initialisierung lokaler Variablen, `;` nach `if`/`while`, `float f = 3.14;`, Zugriff auf Instanzvariable aus `static`, fehlendes `return`, `new` einer abstrakten Klasse, `super(…)` nicht in Zeile 1.
5. **Refactoring (6.b, 6 P)**: Init vor die Schleife, Bedingung in `while (…)`, Update(s) ans Ende des Rumpfes; Methodenname = Verb (`printPowersOfTwo`), Variablen = Nomen (`exponent`, `power`).
6. **Wenn die Zeit knapp ist, weglassen**: Computer-/Java-Geschichte, Bitoperatoren, Enums, StringBuilder/Formatierung, 2D-Arrays, Unicode-Details, JavaDoc-Kommandozeilenoptionen. Exceptions/Arrays/Strings mindestens auf Grundniveau (Fragen 1–2 je Thema), da sie in der Probeklausur fehlen, aber in Vorlesung und LE vorkommen.
7. **Typische Punktverluste**: JavaDoc vergessen (in 6.c und 8.a explizit gefordert), Konstruktor mit Rückgabetyp, `abstract`-Methoden nicht alle implementiert, „static = konstant" verwechseln (das ist `final`!), „call by reference" behaupten (Folien 10 S. 40: in Java falsch).

## 5. Nicht abgedeckt / unsicher

- **Keine Modulrahmenbedingungen/Kursplan als Datei** vorhanden (nur Links im `manifest.json`); Prüfungstermin, Nachklausur und genaue PVL-Fristen („??.01.27") sind offen.
- **Keine Folien** zu „Schrittweise Verfeinerung", „Ausnahmen", „Arrays/Zeichenketten", „Prüfungsvorbereitung" (Vorlesungen ab Woche 10 sind im Download nicht enthalten) → Inhalte nur aus VFH-Lerneinheiten (EIP, EXC, ARR, ZKT).
- **Keine Aufgabentexte der Pflichtaufgaben** in `assignments/*.txt` (nur Abgabestatus); PA1 (Projectile) und PA2 (Date/Month/Year) sind nur über die Folien 06 S. 19–23 und 09 S. 31–39 bekannt, PA3 gar nicht.
- **Keine Musterlösung** zur Probeklausur; die Lösungen in dieser Plattform sind selbst erarbeitet und mit `java` (OpenJDK) verifiziert.
- Das Forum „Ankündigungen" enthält **keine** Klausurhinweise (nur Java-Café-Termine, Plagiatshinweis, Lehrevaluation).
- Widerspruch in den Quellen: Folien 07 S. 18 nennen für `switch` nur `char, byte, short, int`; VFH VER S. 35 nennt zusätzlich `long`, `String` und Enums. **`long` ist in Java nicht erlaubt** (mit `javac` geprüft) – in der Klausur besser die Folien-Liste + `String`/Enum nennen.
- Java 25 erlaubt Anweisungen vor `super(…)`; der Kurs nutzt **Java 17** (Folien 01 S. 28) – dort muss `super(…)` die erste Anweisung sein (geprüft mit `javac --release 17`).
