# Prüfungsanalyse GP2 – Grundlagen der Programmierung 2 (WS 2026/27, Prof. Dr.-Ing. Wunck)

> Grundlage: ausschließlich die lokal gespeicherten Moodle-Daten unter `moodle-data/gdp2/` (Folien LV 1–5, 10 VFH-Lerneinheiten, Kursplan, Modulrahmenbedingungen, Eclipse-Anleitungen, Demo-Projekte, `course.html`).
> Schlussfolgerungen, die **nicht** wörtlich in den Quellen stehen, sind mit **[Inferenz]** markiert.

## 1. Prüfungsform & Regeln (verifiziert)

| Punkt | Inhalt | Quelle |
|---|---|---|
| Prüfungsform | **Kursarbeit (KA): Erstellung und Dokumentation eines Rechnerprogramms (ED)** – keine schriftliche Klausur | `files/Modulrahmenbedingungen.pdf` S. 1; `files/GP2 LV 1.pdf` S. 3 |
| Benotung | Prüfung wird benotet und erscheint im Abschlusszeugnis; Anmeldung beim Prüfungsamt erforderlich (Termin beachten) | `GP2 LV 1.pdf` S. 3 |
| Prüfungsvorleistung | **Keine.** „Es gibt in diesem Kurs keine Prüfungsvorleistungen.“ FA1–FA4 sind freiwillige Feedback-Aufgaben | `course.html` (Abschnitt Feedback-Aufgaben); `Modulrahmenbedingungen.pdf` S. 1 |
| Abgabefenster KA | **frühestens 12.01.2027** (nach Ende des Prüfungsanmeldezeitraums), **spätestens Mo 08.02.2027** | `course.html` (Abschnitt Kursarbeit); `files/Kursplan GP2 WS2627.pdf` S. 1 |
| Abgabeformat | **Exportiertes Eclipse-Projekt** (Export → General → Archive File, nur `src` wählen), Dateiname **`GP2_Eclipse.zip`**. Kein einfaches Zip der Ordner. Andernfalls „nicht ausreichend“ | `files/Anleitung Export Eclipse-Projekt.pdf` S. 1; `course.html` (Kursmaterialien) |
| Fremd-Artefakte | „Keine Artefakte von anderen Tools im Projektordner zulässig“ (FA **und KA**). Für FA explizit: JetBrains, Maven, Gradle, Ant, Git → Abweisung ohne Durchsicht | `GP2 LV 1.pdf` S. 4; `course.html` (Abgabemodalitäten FA) |
| Werkzeuge | Liberica **Full** JDK 17 (enthält JavaFX), Eclipse (2023-06 empfohlen), Compiler Compliance 17, Workspace UTF-8, **kein `module-info.java`** | `GP2 LV 1.pdf` S. 4–9; `course.html` |
| Exceptions | Spezifisch behandeln; **kein `catch (Exception e)`**, **kein `main() throws Exception`**; allgemeine Weiterleitung „in den Einsendeaufgaben nicht erlaubt“ | `course.html` (Abgabemodalitäten FA); `GP2 LV 2.pdf` S. 25–26 |
| Dokumentation im Code | Javadoc-Kommentare für alle `public`-Elemente erwünscht; HTML-Javadoc muss nicht erzeugt werden; Checkstyle nicht erforderlich (Regeln der FA) | `course.html`; `GP2 LV 1.pdf` S. 4 |
| Dateipfade | Dateien relativ zum Projekt-Wurzelordner (z. B. `data/…`), **keine absoluten Windows-Pfade** | `GP2 LV 2.pdf` S. 27; Demo `2_Demo_Persistenz/src/demo1/chars/ReadChars.java` |
| Wiederverwendung | FA-Lösungen dürfen in der KA mitverwendet werden | `course.html` (Feedback-Aufgaben) |
| Peer Review | LV am Di 05.01.2027, 19:00: „Kursarbeit Peer Review“ | `Kursplan GP2 WS2627.pdf` S. 1 |

**Nicht in den Quellen:** Die eigentliche **Aufgabenstellung der KA** (Fachdomäne, Pflichtfunktionen) und ein **Bewertungsschema/Punkteverteilung**. Die gespeicherte Seite `assignments/1505193_Aufgabenstellung und Hochladebereich.txt` enthält nur den Abgabestatus, keinen Aufgabentext. Die Aufgabentexte FA1–FA4 sind ebenfalls nicht gespeichert – nur deren Schwerpunkte (s. u.).

## 2. Aufgabentypen: Was die KA (wahrscheinlich) verlangt

Die vier FA sind laut Moodle direkt auf die KA bezogen („Bezug zur Kursarbeit“). Das ist die beste verfügbare Evidenz für den Inhalt der KA:

| FA | Inhaltlicher Schwerpunkt | Bezug zur Kursarbeit | Frist | Quelle |
|---|---|---|---|---|
| FA1 | Datenmodell und Datei-Ein-/Ausgabe | **Objektmodell und Persistenz** | 12.10.2026 | `course.html`; Kursplan |
| FA2 | Interfaces, Collections, Lambda und Sortierung | **Datenhaltung, Abfrage und Sortierung** | 09.11.2026 | `course.html`; Kursplan |
| FA3 | JavaFX-Oberfläche und Ereignisbehandlung | **Benutzeroberfläche und CRUD** (Create, Read, Update, Delete) | 07.12.2026 | `course.html`; Kursplan |
| FA4 | XML mit DOM | **Optionale XML-Persistenz** | 18.01.2027 | `course.html`; Kursplan |

**[Inferenz]** Die KA ist eine JavaFX-Anwendung mit Fachklassen (Model), Datei-Persistenz (Text/Binär, optional XML via DOM), Verwaltung der Objekte in Collections inkl. Suche/Sortierung (Lambda/Comparator) und einer GUI mit CRUD-Funktionen, plus Dokumentation (Javadoc + vermutlich ein Begleitdokument – „Dokumentation eines Rechnerprogramms“). Punkteverteilung unbekannt.

Architekturvorgabe aus den Folien: GUI-Anwendungen in **Model**- und **View/Controller**-Pakete aufteilen; Model unabhängig von der Oberfläche (Datei-I/O gehört ins Model) – `GP2 LV 5.pdf` S. 29; `VFHGP2_FXE` S. 13, 22, 28.

## 3. Themenranking (Relevanz für die KA-Note)

„Geschätzte Punkte“ = **[Inferenz]** geschätzter Anteil an der Bewertung, da kein Schema vorliegt.

| # | Thema | Wahrscheinlichkeit | Begründung mit Quelle | geschätzter Anteil |
|---|---|---|---|---|
| 1 | **Abgabeformalien** (exportiertes Eclipse-Projekt, keine Fremd-Artefakte, JDK 17, kein module-info) | sehr hoch (K.-o.-Kriterium) | Export-Anleitung S. 1: sonst „nicht ausreichend“; LV 1 S. 4 | Gate (0 % ↔ Bestehen) |
| 2 | **Datei-I/O & Persistenz** (Reader/Writer, Streams, Zeichencodierung UTF-8, `File`, DAO) | sehr hoch | FA1 „Objektmodell und Persistenz“ (`course.html`); LV 2 S. 2–31; DUD S. 4–59; Demo `2_Demo_Persistenz` | ~20 % |
| 3 | **Exception-Handling** (checked vs. unchecked, spezifisches try-catch) | sehr hoch | `course.html` Abgaberegeln; LV 2 S. 19–27 („Exception-Handling muss zwingend verwendet werden“) | ~10 % |
| 4 | **Collections + Sortierung/Abfrage** (`ArrayList`, `HashMap`, `Comparable`/`Comparator`, Lambda, `removeIf`) | sehr hoch | FA2 „Datenhaltung, Abfrage und Sortierung“; LV 4; JCF S. 4–25; AKI S. 14–26 | ~20 % |
| 5 | **JavaFX-GUI** (Stage/Scene/Scene Graph, Layouts, Controls, Dialogfenster) | sehr hoch | FA3 „Benutzeroberfläche und CRUD“; LV 5; FXG S. 11–37 | ~20 % |
| 6 | **Ereignisbehandlung, Binding, MVC/CRUD** (`setOnAction`, `EventHandler<ActionEvent>`, `bind`, Controller-Klassen) | sehr hoch | FA3; LV 5 S. 13–22, 29; FXE S. 3–28 | (in 5 enthalten) |
| 7 | **Dokumentation** (Javadoc für public-Elemente, Projektdoku) | sehr hoch | Prüfungsform „…und Dokumentation“ (Modulrahmenbedingungen); `course.html` Javadoc-Regel | ~10–15 % [Inferenz] |
| 8 | **Abstrakte Klassen & Interfaces** (Klassenhierarchie-Entwurf, DRY, „ist ein / hat ein / verhält sich wie“) | hoch | FA2; LV 3 S. 3–17; AKI S. 4–18 | ~5–10 % (Design-Qualität) |
| 9 | **XML mit DOM** (lesen, erzeugen, speichern mit Transformer) | mittel | FA4 „Optionale XML-Persistenz“; JML S. 32–45 | optional / Bonus [Inferenz] |
| 10 | Wiederholung GP1 (Klassen, Vererbung, `super`, `protected`), JUnit | mittel | LV 1 S. 10; Demo `1_Demo_Datum`; EIP S. 46–52 | Grundlage |
| 11 | 2D-Grafik (Shapes, Farben, Koordinaten) | niedrig | kein FA-Bezug; FX2 S. 3–31 | evtl. Optik |
| 12 | Rekursion | niedrig | kein FA-/KA-Bezug; REK S. 3–19 (DOM-Traversierung rekursiv: JML S. 38) | gering |
| 13 | Verkettete Listen, Stapel, Warteschlangen (Eigenimplementierung) | niedrig | kein FA-/KA-Bezug; LST S. 30–64 | gering |
| 14 | SAX, DTD/XML-Schema | niedrig | FA4 nennt explizit „XML mit DOM“; JML S. 26–37 | gering |

## 4. Strategie für eine 2,x

**Unbedingt beherrschen (Pflicht):**
1. Projekt **früh** als `GP2_Eclipse.zip` exportieren und in einem **leeren Workspace re-importieren** (Export-Anleitung empfiehlt das). Kein `.idea`, `pom.xml`, `build.gradle`, `.git` im Projektordner.
2. Saubere **Paketstruktur** `model` / `view` / `controller` (+ ggf. `persistence`/DAO). Model kennt kein JavaFX.
3. **Persistenz** mit einer DAO-Klasse: Text (`PrintWriter`/`BufferedReader` mit `StandardCharsets.UTF_8`) oder binär (`DataOutputStream`/`DataInputStream`, Lese- = Schreibreihenfolge). Relativer Pfad `data/…`. `close()` nicht vergessen.
4. **Spezifische Exceptions**: `catch (IOException e)`, `catch (NumberFormatException e)` – nie `catch (Exception e)` oder `throws Exception` an `main`.
5. **Collections**: `List<T>` als Typ, `ArrayList<>` als Implementierung, `HashMap` für Schlüsselzugriff; **Sortieren mit Comparator-Lambda**, Filtern mit `Predicate`/`removeIf`.
6. **JavaFX-CRUD**: Formular (GridPane/VBox/HBox in BorderPane), Buttons mit `setOnAction(e -> …)`, Eingaben validieren, Fehlermeldung anzeigen statt Absturz.
7. **Javadoc** an jeder `public`-Klasse/-Methode (`@param`, `@return`, `@throws`).

**Wenn die Zeit knapp ist, weglassen:** XML-Persistenz (laut FA4 optional), 2D-Grafik, Rekursion, eigene verkettete Listen, SAX/DTD/Schema, CSS/FXML (in FXE nur als Ausblick).

**Typische Fallen:**
- Zip des Workspace-Ordners statt Eclipse-Export → „nicht ausreichend“.
- `module-info.java` angelegt → JavaFX/Import-Probleme (LV 1 S. 9: „Kein module-info.java file!“).
- Standard- statt **Full**-JDK → JavaFX fehlt.
- Daten nach Programmende weg, weil `close()`/`flush()` fehlt (Puffer!).
- Absolute Pfade (`C:\Users\…`) → läuft beim Prüfer nicht.
- Binärdatei in anderer Reihenfolge gelesen als geschrieben → Datenmüll/`EOFException`.
- Comparator `(int)(a - b)` bei `double` → Werte mit Differenz < 1 gelten als gleich.
- Element in for-each-Schleife aus Liste löschen → `ConcurrentModificationException` (stattdessen `removeIf`/`Iterator.remove`).
- `Integer` mit `==` vergleichen statt `equals` (LV 4 S. 7–8).
- Gebundene Property zusätzlich per `setText` setzen → Laufzeitfehler.
- `Integer.parseInt` auf GUI-Eingaben ohne `catch (NumberFormatException e)`.

## 5. Nicht abgedeckt / unsicher

- **Konkreter KA-Aufgabentext und Bewertungskriterien fehlen** in den lokalen Daten (Assignment-Seite ohne Beschreibung). Alle Aussagen zu Pflichtfunktionen beruhen auf dem „Bezug zur Kursarbeit“ der FA → **[Inferenz]**.
- Aufgabentexte FA1–FA4 sind nicht gespeichert (nur Status + Schwerpunkt in `course.html`).
- Ob die Javadoc-/Exception-/Checkstyle-Regeln der FA **identisch** für die KA gelten, steht nicht explizit da (für Artefakte: LV 1 S. 4 nennt „FA, KA“). **[Inferenz]**: gleiche Regeln annehmen.
- Form und Umfang der schriftlichen Projektdokumentation sind nicht spezifiziert.
- Ankündigungsforum: lokal ohne Beiträge gespeichert (`forums/1495419_Ankündigungen.txt`).
- LV-Folien liegen nur bis LV 5 (JavaFX Aufbau) vor; LV zu Ereignissen/Binding (24.11.) und XML (08.12.) sowie Peer-Review-LV fehlen → dort ggf. weitere Hinweise.
- `TableView`/`ListView`, `FileChooser`, `Alert`, CSS/FXML sind in den Quellen nicht (oder nur als Ausblick) behandelt – Nutzung in der KA möglich, aber nicht durch Kursmaterial abgesichert.
