// Grundlagen der Programmierung 2 (GP2) — WS 26/27 (Prof. Dr.-Ing. Wunck)
// Prüfung = Kursarbeit (Programm + Dokumentation), keine Klausur. Siehe docs/klausur-analyse/gdp2.md
// Grounded in GP2 LV 1–5, Kursplan, Modulrahmenbedingungen, Eclipse-Anleitungen, course.html (FA/KA-Regeln),
// Demo-Projekte und VFH-Lerneinheiten (EIP, DUD, AKI, JCF, FXG, FX2, FXE, REK, JML, LST).
export const GDP2_DATA = {
  "courseId": "gdp2",
  "chapters": [
    {
      "id": "gp2-ka",
      "title": "0. Kursarbeit: Anforderungen & Checkliste",
      "badge": "Prüfungsleistung",
      "examWeight": 3,
      "diagram": "gp2-ka-architektur",
      "sources": [
        {
          "title": "Modulrahmenbedingungen GP2",
          "path": "moodle-data/gdp2/files/Modulrahmenbedingungen.pdf",
          "page": 1
        },
        {
          "title": "Moodle-Kursseite GP2 (FA-/KA-Regeln)",
          "path": "moodle-data/gdp2/course.html"
        },
        {
          "title": "Anleitung Export Eclipse-Projekt",
          "path": "moodle-data/gdp2/files/Anleitung Export Eclipse-Projekt.pdf",
          "page": 1
        },
        {
          "title": "Kursplan GP2 WS 26/27",
          "path": "moodle-data/gdp2/files/Kursplan GP2 WS2627.pdf",
          "page": 1
        },
        {
          "title": "GP2 LV 1: Begrüßung & Wiederholung",
          "path": "moodle-data/gdp2/files/GP2 LV 1.pdf",
          "page": 3
        },
        {
          "title": "GP2 LV 1: Begrüßung & Wiederholung",
          "path": "moodle-data/gdp2/files/GP2 LV 1.pdf",
          "page": 4
        }
      ],
      "summary": [
        "<strong>Prüfungsform:</strong> <em>Kursarbeit (KA)</em> = Erstellung <strong>und Dokumentation</strong> eines Rechnerprogramms (ED). Keine Klausur, keine Prüfungsvorleistung; FA1–FA4 sind freiwillige Feedback-Aufgaben.",
        "<strong>Abgabe:</strong> frühestens <strong>12.01.2027</strong> (nach Prüfungsanmeldezeitraum), spätestens <strong>Mo 08.02.2027</strong>. Prüfungsanmeldung beim Prüfungsamt nicht vergessen.",
        "<strong>K.-o.-Kriterium Format:</strong> <em>exportiertes Eclipse-Projekt</em> (Rechtsklick Projekt → Export → General → Archive File, nur <code>src</code> wählen) als <code>GP2_Eclipse.zip</code>. Ein normales Zip der Ordner → „nicht ausreichend“. Danach Test-Import in leeren Workspace.",
        "<strong>Keine Fremd-Artefakte:</strong> keine Dateien von JetBrains, Maven, Gradle, Ant, Git im Projektordner. Umgebung: Liberica <strong>Full</strong> JDK 17 (enthält JavaFX), Compliance 17, Workspace UTF-8, <strong>kein</strong> <code>module-info.java</code>.",
        "<strong>Inhalt (laut FA-Bezug):</strong> FA1 → Objektmodell &amp; Persistenz; FA2 → Datenhaltung, Abfrage, Sortierung; FA3 → Benutzeroberfläche &amp; CRUD; FA4 → <em>optionale</em> XML-Persistenz (DOM). FA-Lösungen dürfen wiederverwendet werden.",
        "<strong>Code-Regeln:</strong> Exceptions spezifisch behandeln – kein <code>catch (Exception e)</code>, kein <code>main() throws Exception</code>. Javadoc für alle <code>public</code>-Elemente; HTML-Javadoc nicht nötig. Dateien relativ (<code>data/…</code>), keine absoluten Windows-Pfade.",
        "<strong>Architektur:</strong> Pakete <code>model</code> (Fachklassen, Collections, Persistenz/DAO – ohne JavaFX) und <code>view</code>/<code>controller</code> (JavaFX). Peer-Review-Termin: Di 05.01.2027."
      ],
      "feynman": {
        "prompt": "Erkläre einer Kommilitonin in 2 Minuten, welche Bedingungen deine GP2-Kursarbeit erfüllen muss, damit sie überhaupt bewertet wird – und welche Funktionen sie (laut FA-Bezug) enthalten sollte.",
        "rubric": [
          "Abgabe als exportiertes Eclipse-Projekt (Archive File, nur src) mit Namen GP2_Eclipse.zip zwischen 12.01. und 08.02.2027; sonst „nicht ausreichend“.",
          "Keine Artefakte anderer Tools (Maven, Gradle, Git, JetBrains), Liberica Full JDK 17, kein module-info.java.",
          "Inhalt: Objektmodell + Datei-Persistenz, Collections mit Abfrage/Sortierung, JavaFX-GUI mit CRUD, optional XML (DOM).",
          "Spezifisches Exception-Handling, Javadoc für public-Elemente, relative Dateipfade, MVC-Paketstruktur."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp2-ka",
        "courseId": "gdp2",
        "title": "GP2 Kursarbeit: Abgabe-Checkliste",
        "content": "FORMAT: Eclipse → Export → General → Archive File → nur src → GP2_Eclipse.zip • Re-Import-Test in leeren Workspace (File → Import → Existing Projects into Workspace → Select archive file) • KEINE .idea/pom.xml/build.gradle/.git • Liberica FULL JDK 17, Compliance 17, UTF-8, kein module-info.java • FRIST: frühestens 12.01.2027, spätestens 08.02.2027 • INHALT: model (Fachklassen, List/Map, Comparator-Sortierung, Suche), DAO (Datei-I/O, data/…, UTF-8, close), view/controller (JavaFX CRUD: Anlegen, Anzeigen, Ändern, Löschen, Eingabeprüfung), optional XML-DOM • CODE: catch (IOException e)/catch (NumberFormatException e) statt catch (Exception e); Javadoc (@param/@return/@throws) an allen public-Elementen • DOKU: Programm UND Dokumentation sind Prüfungsgegenstand.",
        "code": "src/\n  app/Main.java           // extends Application, launch(args)\n  model/Kunde.java        // Fachklasse, getter/setter, toString\n  model/KundenVerwaltung.java // List<Kunde>, suchen, sortieren\n  model/KundenDAO.java    // speichern()/laden(), IOException\n  view/HauptFenster.java  // BorderPane, GridPane, Buttons\n  controller/SpeichernHandler.java // implements EventHandler<ActionEvent>\ndata/kunden.txt          // relativer Pfad"
      }
    },
    {
      "id": "gp2-eip",
      "title": "1. Einstieg: GP1-Wiederholung, Eclipse & JUnit (EIP)",
      "badge": "Grundlage",
      "examWeight": 2,
      "sources": [
        {
          "title": "GP2 LV 1: Begrüßung & Wiederholung",
          "path": "moodle-data/gdp2/files/GP2 LV 1.pdf",
          "page": 10
        },
        {
          "title": "Demo-Projekt 1_Demo_Datum",
          "path": "moodle-data/gdp2/files/1_Demo_Datum.zip"
        },
        {
          "title": "LE EIP: Einstieg in Programmieren II",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_EIP-EinstiegInProgrammieren2.pdf",
          "page": 15
        },
        {
          "title": "LE EIP: Einstieg in Programmieren II",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_EIP-EinstiegInProgrammieren2.pdf",
          "page": 46
        }
      ],
      "summary": [
        "<strong>Demo „Datum/Zeitpunkt“ (LV 1):</strong> <code>Datum</code> mit <code>protected</code>-Attributen tag/monat/jahr, Klassenmethode <code>istSchaltjahr</code>, Konstruktor wirft <code>IllegalArgumentException</code> bei ungültigen Werten. <code>Zeitpunkt extends Datum</code> ruft <code>super(tag, monat, jahr)</code> auf.",
        "<strong>Schaltjahr-Regel:</strong> durch 400 teilbar <em>oder</em> (durch 4 und nicht durch 100). <code>return teilbarDurch400 || (teilbarDurch4 &amp;&amp; !teilbarDurch100);</code>",
        "<strong>Vererbung:</strong> <code>extends</code>, nur Einfachvererbung; <code>Object</code> ist Superklasse aller Klassen. Pakete gruppieren Klassen (<code>package</code>, <code>import</code>).",
        "<strong>JUnit 5:</strong> Testklasse mit <code>@Test</code>-Methoden (public void, keine Parameter); <code>assertEquals(erwartet, tatsächlich)</code>, <code>assertTrue</code>, <code>assertNull</code>, <code>@BeforeEach</code>. Grün = bestanden, rot = fehlgeschlagen.",
        "<strong>Javadoc:</strong> <code>/** … @param … @return … */</code> vor Klassen/Methoden – in der KA für alle public-Elemente erwünscht."
      ],
      "feynman": {
        "prompt": "Erkläre an der Klasse Zeitpunkt extends Datum, warum super(...) als erste Anweisung im Konstruktor steht und warum Datum seine Attribute protected statt private deklariert.",
        "rubric": [
          "super(...) ruft den Konstruktor der Oberklasse auf, der die geerbten Attribute initialisiert und prüft (IllegalArgumentException).",
          "protected erlaubt Zugriff in Unterklassen (und im Paket), private nur in der Klasse selbst.",
          "Code-Wiederverwendung statt Duplikation der Prüflogik."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp2-eip",
        "courseId": "gdp2",
        "title": "GP2: Wiederholung OOP, Javadoc, JUnit",
        "content": "Klasse = Attribute + Konstruktoren + Methoden • static = Klassenmethode (Datum.istSchaltjahr(2028)) • protected = Unterklassen + Paket • Unterklasse: class B extends A, Konstruktor beginnt mit super(...) • ungültige Argumente: throw new IllegalArgumentException() • Javadoc: /** Beschreibung @param x … @return … @throws … */ • JUnit5: @Test public void testX() { assertEquals(erwartet, ist); } • Eclipse: Projekt ohne module-info.java, Compliance 17, Workspace UTF-8.",
        "code": "public static boolean istSchaltjahr(int jahr) {\n  return jahr % 400 == 0 || (jahr % 4 == 0 && jahr % 100 != 0);\n}\n\n@Test\npublic void testSchaltjahr() {\n  assertTrue(Datum.istSchaltjahr(2028));\n  assertFalse(Datum.istSchaltjahr(1900));\n}"
      }
    },
    {
      "id": "gp2-streams",
      "title": "2. Dateien & Datenströme (DUD, LV 2)",
      "badge": "FA1 & Kursarbeit",
      "examWeight": 3,
      "diagram": "gp2-stream-kette",
      "sources": [
        {
          "title": "GP2 LV 2: Dateien und Datenströme",
          "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
          "page": 4
        },
        {
          "title": "GP2 LV 2: Dateien und Datenströme",
          "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
          "page": 13
        },
        {
          "title": "LE DUD: Dateien und Datenströme",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_DUD-DateienUndDatenstroeme.pdf",
          "page": 4
        },
        {
          "title": "LE DUD: Dateien und Datenströme",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_DUD-DateienUndDatenstroeme.pdf",
          "page": 33
        },
        {
          "title": "LE DUD: Dateien und Datenströme",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_DUD-DateienUndDatenstroeme.pdf",
          "page": 38
        },
        {
          "title": "LE DUD: Dateien und Datenströme",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_DUD-DateienUndDatenstroeme.pdf",
          "page": 49
        },
        {
          "title": "Demo-Projekt 2_Demo_Persistenz",
          "path": "moodle-data/gdp2/files/2_Demo_Persistenz.zip"
        }
      ],
      "summary": [
        "<strong>Persistenz:</strong> Daten über das Programmende hinaus bereithalten – braucht nichtflüchtigen Speicher (Dateisystem, Datenbank). Eine Datei speichert Folgen von Bytes; <em>Binärdateien</em> (Bytes direkt) vs. <em>Textdateien</em> (Bytes als Zeichen, Zeichencodierung nötig).",
        "<strong>Vier Basisklassen (java.io):</strong> <code>InputStream</code>/<code>OutputStream</code> = Byteströme; <code>Reader</code>/<code>Writer</code> = Zeichenströme. Unterklassen sagen <em>wohin/woher</em> (FileWriter, FileInputStream) oder <em>wie</em> (BufferedReader, DataInputStream, PrintWriter).",
        "<strong>Filterklassen / Hintereinanderschaltung:</strong> <code>new PrintWriter(new BufferedWriter(new FileWriter(name, StandardCharsets.UTF_8)))</code>; Lesen: <code>new BufferedReader(new FileReader(name, StandardCharsets.UTF_8))</code> → <code>readLine()</code> liefert <code>null</code> am Dateiende, <code>read()</code> liefert <code>-1</code>.",
        "<strong>Puffer:</strong> Geschrieben wird erst, wenn der Puffer voll ist; <code>flush()</code> leert ihn, <code>close()</code> ruft flush auf und gibt Ressourcen frei. Ohne close kann die Datei leer bleiben!",
        "<strong>Zeichencodierung:</strong> Unicode-Codepoint vs. Bytefolge: UTF-8 1–4 Bytes (A = 41, Ü = C3 9C, € = E2 82 AC), UTF-16 2/4 Bytes, UTF-32 4 Bytes; bei UTF-16/32 Byte-Reihenfolge LE/BE. Immer Codierung explizit angeben.",
        "<strong>Binär:</strong> <code>DataOutputStream</code> (<code>writeUTF</code>, <code>writeInt</code>, <code>writeBoolean</code>, <code>writeDouble</code>) + <code>DataInputStream</code> mit <em>gleicher Reihenfolge</em> lesen. <strong>Objektströme:</strong> <code>ObjectOutputStream.writeObject</code> / <code>(Typ) in.readObject()</code>, Klasse muss <code>Serializable</code> implementieren.",
        "<strong>Klasse File:</strong> abstrakte Darstellung eines Pfads; <code>new File(\"x\")</code> erzeugt <em>keine</em> Datei. <code>createNewFile()</code> (false, wenn vorhanden), <code>exists()</code>, <code>isDirectory()</code>, <code>length()</code>, <code>mkdirs()</code>, <code>delete()</code>."
      ],
      "feynman": {
        "prompt": "Du speicherst eine Kundenliste als Textdatei. Erkläre die Stromkette zum Schreiben und Lesen, warum UTF-8 angegeben wird und warum ohne close() die Datei leer sein kann.",
        "rubric": [
          "PrintWriter → BufferedWriter → FileWriter(name, UTF_8) zum Schreiben; BufferedReader(FileReader(name, UTF_8)) + readLine() bis null zum Lesen.",
          "Ohne explizite Codierung wird die Standardcodierung des Betriebssystems verwendet → Umlaute können auf einem anderen Rechner kaputt sein.",
          "BufferedWriter sammelt Zeichen im Puffer; erst flush()/close() schreibt sie auf die Platte.",
          "Relativer Pfad data/... → Datei liegt im Projekt-Wurzelordner."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp2-dud",
        "courseId": "gdp2",
        "title": "GP2: Dateien & Datenströme",
        "content": "Byte: InputStream/OutputStream (FileInputStream, BufferedInputStream, DataInputStream, ObjectInputStream) • Zeichen: Reader/Writer (FileReader/Writer, BufferedReader/Writer, InputStreamReader/OutputStreamWriter = Brücke Byte↔Zeichen, PrintWriter) • Ende: read() == -1, readLine() == null, DataInputStream → EOFException • close() ruft flush() • Data-Streams: gleiche Reihenfolge wie geschrieben • Objekte: implements Serializable, readObject() casten • File: new File() erzeugt keine Datei; createNewFile, exists, mkdirs, delete, length • Pfade relativ: data/datei.txt • UTF-8: Ü = 2 Byte, € = 3 Byte.",
        "code": "try {\n  PrintWriter out = new PrintWriter(new BufferedWriter(\n      new FileWriter(\"data/kunden.txt\", StandardCharsets.UTF_8)));\n  out.println(\"Egon;5432134;3.1\");\n  out.close();\n  BufferedReader in = new BufferedReader(\n      new FileReader(\"data/kunden.txt\", StandardCharsets.UTF_8));\n  String zeile;\n  while ((zeile = in.readLine()) != null) {\n    String[] teile = zeile.split(\";\");\n  }\n  in.close();\n} catch (IOException e) {\n  System.out.println(e.getMessage());\n}"
      }
    },
    {
      "id": "gp2-exc-dao",
      "title": "3. Exceptions & DAO-Muster (Persistenz, LV 2)",
      "badge": "FA1 & Kursarbeit",
      "examWeight": 3,
      "diagram": "gp2-exception-hierarchie",
      "sources": [
        {
          "title": "GP2 LV 2: Dateien und Datenströme",
          "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
          "page": 19
        },
        {
          "title": "GP2 LV 2: Dateien und Datenströme",
          "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
          "page": 21
        },
        {
          "title": "GP2 LV 2: Dateien und Datenströme",
          "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
          "page": 25
        },
        {
          "title": "GP2 LV 2: Dateien und Datenströme",
          "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
          "page": 29
        },
        {
          "title": "LE DUD: Dateien und Datenströme",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_DUD-DateienUndDatenstroeme.pdf",
          "page": 15
        },
        {
          "title": "Demo-Projekt 2_Demo_Persistenz",
          "path": "moodle-data/gdp2/files/2_Demo_Persistenz.zip"
        },
        {
          "title": "Moodle-Kursseite GP2 (FA-/KA-Regeln)",
          "path": "moodle-data/gdp2/course.html"
        }
      ],
      "summary": [
        "<strong>Fehlerarten:</strong> Syntaxfehler (Compiler) vs. Laufzeitfehler → Exception (= Objekt einer Exception-Klasse). Bei Ein-/Ausgabe ist Exception-Handling <em>zwingend</em>.",
        "<strong>Unchecked</strong> (<code>RuntimeException</code> und Unterklassen, z. B. <code>NumberFormatException</code>, <code>IllegalArgumentException</code>): kann behandelt werden, Programm übersetzt auch ohne. <strong>Checked</strong> (von <code>Exception</code>, z. B. <code>IOException</code>): muss behandelt <em>oder</em> per <code>throws</code> deklariert werden, sonst Compilerfehler. <strong>Error</strong>: nicht behandeln.",
        "<strong>IOException-Familie:</strong> <code>FileNotFoundException</code> (Datei nicht gefunden), <code>EOFException</code> (Dateiende beim Lesen) – beide Unterklassen von <code>IOException</code>. Speziellere catch-Blöcke zuerst.",
        "<strong>Kurs-Regel:</strong> „Behandlung durch allgemeine Weiterleitung“ (<code>main() throws IOException/Exception</code>) ist in den Einsendeaufgaben nicht erlaubt; gewünscht ist <em>spezifisches try-catch</em>. Kein <code>catch (Exception e)</code>.",
        "<strong>DAO (Data Access Object):</strong> Entwurfsmuster, das den Zugriff auf eine Datenquelle (Datei, DB) kapselt, sodass die Quelle ausgetauscht werden kann, ohne den aufrufenden Code zu ändern. Fachklasse (<code>Student</code>) kennt keine Speicherdetails; <code>StudentDAO</code> hat <code>write(Student)</code>/<code>read(Student)</code> und <code>close()</code>.",
        "<strong>Demo 2_Demo_Persistenz:</strong> <code>StudentDAO(dateiName, openForWrite)</code> öffnet <code>DataOutputStream</code> oder <code>DataInputStream</code>; <code>write</code> schreibt name (UTF), matnr (int), bestanden (boolean), note (double) – <code>read</code> liest in derselben Reihenfolge."
      ],
      "feynman": {
        "prompt": "Warum kompiliert new FileReader(\"x.txt\") ohne try-catch nicht, Integer.parseInt(text) aber schon? Und wie hilft ein DAO, deine KA später von Text- auf XML-Speicherung umzustellen?",
        "rubric": [
          "FileReader-Konstruktor deklariert FileNotFoundException (checked, Unterklasse von IOException) → behandeln oder deklarieren, sonst Compilerfehler.",
          "parseInt wirft NumberFormatException (RuntimeException, unchecked) → Behandlung optional, aber bei Benutzereingaben sinnvoll.",
          "DAO kapselt Speicherlogik hinter Methoden (speichern/laden); Model und GUI rufen nur diese auf.",
          "Austausch der Implementierung (Text → XML) ändert nur die DAO-Klasse."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp2-exc",
        "courseId": "gdp2",
        "title": "GP2: Exceptions & DAO",
        "content": "Throwable → Error (nicht behandeln) | Exception (checked: MUSS catch oder throws) → IOException (FileNotFoundException, EOFException) | RuntimeException (unchecked: NumberFormatException, IllegalArgumentException, NullPointerException, ArrayIndexOutOfBounds…) • catch-Reihenfolge: speziell vor allgemein (sonst „already been caught“) • Kurs-Regel: spezifisches try-catch, kein catch(Exception e), kein main() throws Exception • DAO: Fachklasse + DAO-Klasse (write/read/close); Datenquelle austauschbar ohne Änderung des Aufrufers • Leere catch-Blöcke vermeiden: Meldung ausgeben/anzeigen.",
        "code": "public class KundenDAO {\n  private final String datei;\n  public KundenDAO(String datei) { this.datei = datei; }\n  /** Speichert alle Kunden. @throws IOException bei Schreibfehler */\n  public void speichern(List<Kunde> liste) throws IOException {\n    PrintWriter out = new PrintWriter(new BufferedWriter(\n        new FileWriter(datei, StandardCharsets.UTF_8)));\n    for (Kunde k : liste) out.println(k.getName() + \";\" + k.getNr());\n    out.close();\n  }\n}\n// Aufrufer (Controller):\ntry { dao.speichern(liste); }\ncatch (IOException e) { zeigeFehler(\"Speichern fehlgeschlagen: \" + e.getMessage()); }"
      }
    },
    {
      "id": "gp2-aki",
      "title": "4. Abstrakte Klassen & Interfaces (AKI, LV 3)",
      "badge": "FA2 & Klassenentwurf",
      "examWeight": 3,
      "sources": [
        {
          "title": "GP2 LV 3: Abstrakte Klassen, Interfaces, Lambda",
          "path": "moodle-data/gdp2/files/GP2 LV 3.pdf",
          "page": 3
        },
        {
          "title": "GP2 LV 3: Abstrakte Klassen, Interfaces, Lambda",
          "path": "moodle-data/gdp2/files/GP2 LV 3.pdf",
          "page": 6
        },
        {
          "title": "GP2 LV 3: Abstrakte Klassen, Interfaces, Lambda",
          "path": "moodle-data/gdp2/files/GP2 LV 3.pdf",
          "page": 15
        },
        {
          "title": "GP2 LV 3: Abstrakte Klassen, Interfaces, Lambda",
          "path": "moodle-data/gdp2/files/GP2 LV 3.pdf",
          "page": 16
        },
        {
          "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
          "page": 4
        },
        {
          "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
          "page": 7
        },
        {
          "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
          "page": 12
        },
        {
          "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
          "page": 27
        }
      ],
      "summary": [
        "<strong>Entwurfsprozess (LV 3):</strong> Gemeinsamkeiten mehrerer Klassen in eine Oberklasse auslagern (DRY – Don't Repeat Yourself). Ist eine Methode nur in Unterklassen implementierbar (z. B. <code>berechneNotendurchschnitt()</code> bei <code>WI_Student</code>/<code>MI_Student</code>), wird sie in der Oberklasse <code>abstract</code>.",
        "<strong>Abstrakte Methode:</strong> nur Kopf (Rückgabetyp + Signatur), kein Rumpf, Modifizierer <code>abstract</code>. <strong>Abstrakte Klasse:</strong> mit <code>abstract</code> deklariert, kann <em>nicht instanziert</em> werden, darf aber Konstruktoren und Objekt-Attribute haben und als Variablentyp dienen. <code>abstract static</code> ist unmöglich; abstrakte Attribute gibt es nicht. UML: kursiv.",
        "<strong>Interface:</strong> keine Objekt-Attribute, keine Konstruktoren; Methoden implizit <code>public</code> und ohne Rumpf implizit abstract; ausprogrammierte Instanzmethoden brauchen <code>default</code>; Attribute sind automatisch <code>public static final</code> (Konstanten). Implementierende Klasse muss Methoden <code>public</code> deklarieren.",
        "<strong>Mehrfach:</strong> <code>class Tisch extends Moebel implements Schwer, Wertvoll</code> – nur eine Oberklasse, beliebig viele Interfaces; Interfaces können mehrere Interfaces erweitern (<code>extends I1, I2</code>).",
        "<strong>Beziehungen:</strong> <em>hat ein</em> = Objektreferenz als Attribut; <em>ist ein</em> = Vererbung; <em>verhält sich wie</em> = Interface implementieren. Umzugsbeispiel: <code>Umzugs_LKW</code> und <code>Versicherung</code> bleiben unverändert, weil sie nur die Interfaces kennen.",
        "<strong>Polymorphie / dynamisches Binden:</strong> <code>Student s = new WI_Student(…); s.berechneNotendurchschnitt();</code> – erst zur Laufzeit wird die Implementierung der tatsächlichen Klasse gewählt."
      ],
      "feynman": {
        "prompt": "Erkläre am Umzugsbeispiel (Tisch, Schrank, Umzugs_LKW, Versicherung), warum Interfaces das Problem „Gegenstand ist gleichzeitig schwer und wertvoll“ lösen, das abstrakte Klassen nicht lösen können.",
        "rubric": [
          "Java erlaubt nur eine Oberklasse – Tisch kann nicht von Schwer UND Wertvoll erben.",
          "Mit Interfaces implementiert Tisch Schwer und Wertvoll gleichzeitig (verhält sich wie).",
          "Getestete Klassen Umzugs_LKW und Versicherung arbeiten mit den Interface-Typen und müssen nicht geändert werden.",
          "Schnittstelle (zur Übersetzungszeit) ist von der Implementierung (zur Laufzeit) getrennt."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp2-aki",
        "courseId": "gdp2",
        "title": "GP2: Abstrakte Klassen & Interfaces",
        "content": "abstract class: alles wie normale Klasse + abstrakte Methoden, KEIN new, Konstruktor + Attribute erlaubt • abstrakte Unterklasse muss geerbte abstrakte Methoden nicht wiederholen; konkrete Klasse muss alle implementieren • interface: Methoden implizit public abstract, default-Methoden mit Rumpf, static-Methoden, Konstanten (public static final), KEINE Objekt-Attribute/Konstruktoren • implementierende Methode MUSS public sein • extends 1 Klasse, implements n Interfaces; interface I extends A, B • ist-ein (extends) / hat-ein (Attribut) / verhält-sich-wie (implements) • Interface als Typ: IFigur[] far = new IFigur[5]; far[0] = new Kreis(3.1); • Dynamisches Binden: Methode der Laufzeitklasse.",
        "code": "public abstract class Student {\n  protected String name;\n  public Student(String name) { this.name = name; }\n  public abstract double berechneNotendurchschnitt();\n  public String vorstellen() { return name + \": \" + berechneNotendurchschnitt(); }\n}\npublic interface Wertvoll { double getWert(); }\npublic class Tisch extends Moebel implements Schwer, Wertvoll {\n  public double getGewicht() { return 30; }\n  public double getWert() { return 120; }\n}"
      }
    },
    {
      "id": "gp2-lambda",
      "title": "5. Innere Klassen, Lambda & Sortieren (AKI, LV 3)",
      "badge": "FA2 & Kursarbeit",
      "examWeight": 3,
      "sources": [
        {
          "title": "GP2 LV 3: Abstrakte Klassen, Interfaces, Lambda",
          "path": "moodle-data/gdp2/files/GP2 LV 3.pdf",
          "page": 19
        },
        {
          "title": "GP2 LV 3: Abstrakte Klassen, Interfaces, Lambda",
          "path": "moodle-data/gdp2/files/GP2 LV 3.pdf",
          "page": 24
        },
        {
          "title": "GP2 LV 3: Abstrakte Klassen, Interfaces, Lambda",
          "path": "moodle-data/gdp2/files/GP2 LV 3.pdf",
          "page": 27
        },
        {
          "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
          "page": 14
        },
        {
          "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
          "page": 16
        },
        {
          "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
          "page": 19
        },
        {
          "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
          "page": 21
        },
        {
          "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
          "page": 23
        }
      ],
      "summary": [
        "<strong>Innere Klassen:</strong> <em>statische</em> innere Klasse (wie Klassenvariable, <code>new Aussen.Innen()</code>), <em>nicht-statische</em> (braucht Objekt der äußeren Klasse, Zugriff auf deren Objektvariablen), <em>lokale</em> Klasse (in einem Block), Spezialfall <em>anonyme Klasse</em>.",
        "<strong>Weg Klasse → anonyme Klasse → Lambda:</strong> Braucht man nur ein Objekt einer abgeleiteten Klasse ohne Konstruktor → anonyme Klasse <code>new IntegerMath() { public int operation(int a, int b) {…} };</code>. Muss nur eine Methode implementiert werden → Lambda <code>(a, b) -&gt; a + b</code>.",
        "<strong>Funktionales Interface:</strong> genau <em>eine</em> abstrakte Instanzmethode, die nicht schon in <code>Object</code> definiert ist (deshalb ist <code>Comparator</code> funktional trotz <code>equals</code>). Nur dafür sind Lambdas erlaubt.",
        "<strong>Lambda-Syntax:</strong> <code>Parameterliste -&gt; Rumpf</code>; Typen dürfen entfallen; bei einem Parameter Klammern optional; bei einem Ausdruck <code>{ }</code> und <code>return</code> optional. Hinter den Kulissen: anonyme Klasse + Objekt.",
        "<strong>Sortieren:</strong> <code>Comparable&lt;T&gt;</code> = natürliche Ordnung in der Klasse (<code>int compareTo(T o)</code>), <code>Arrays.sort(far)</code>. <code>Comparator&lt;T&gt;</code> = externe Strategie (<code>int compare(T o1, T o2)</code>), <code>Arrays.sort(far, (o1, o2) -&gt; …)</code> / <code>liste.sort(…)</code>. Ergebnis &lt; 0: o1 zuerst; 0: gleich; &gt; 0: o2 zuerst (Strategie-Pattern).",
        "<strong>java.util.function:</strong> <code>Predicate&lt;T&gt;</code> (<code>boolean test(T)</code>), <code>Consumer&lt;T&gt;</code> (<code>void accept(T)</code>), <code>BiPredicate&lt;T,U&gt;</code>, <code>IntPredicate</code>, <code>ToIntFunction&lt;T&gt;</code>… Beispiel <code>printSelektiv(Predicate&lt;IFigur&gt; tester)</code>, <code>runSelektiv(Predicate, Consumer)</code>."
      ],
      "feynman": {
        "prompt": "Erkläre, was der Compiler alles „im Hintergrund“ erzeugt, wenn du Arrays.sort(far, (o1, o2) -> Double.compare(o1.getFlaeche(), o2.getFlaeche())) schreibst, und warum das nur mit funktionalen Interfaces geht.",
        "rubric": [
          "Zielt auf den Parametertyp Comparator<IFigur>; der Compiler erzeugt eine anonyme Klasse, die compare implementiert, und ein Objekt davon.",
          "o1, o2 sind die Parameter von compare; der Ausdruck rechts vom Pfeil ist der Rumpf (Rückgabewert int).",
          "Nur bei genau einer abstrakten Methode ist eindeutig, welche Methode der Lambda implementiert.",
          "Vorteil: Sortierkriterium steht direkt am Aufruf (lesbarer als innere Klasse)."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp2-lambda",
        "courseId": "gdp2",
        "title": "GP2: Lambda, funktionale Interfaces, Sortieren",
        "content": "Funktionales Interface = 1 abstrakte Methode (Object-Methoden zählen nicht) • Lambda: (a, b) -> a + b | x -> x.length() > 3 | (T a) -> { …; return …; } • Comparable<T>: int compareTo(T o) in der Klasse → Arrays.sort(arr) / Collections-Sortierung • Comparator<T>: int compare(T a, T b) extern → liste.sort((a, b) -> a.getName().compareTo(b.getName())) • Zahlen vergleichen: Double.compare(a, b) / Integer.compare(a, b) statt (int)(a - b) • Predicate<T> test → boolean, Consumer<T> accept → void, BiPredicate<T,U>, IntPredicate, ToIntFunction<T> applyAsInt • anonyme Klasse: new Interface() { public … } ; ← Semikolon! • nicht-statische innere Klasse: aussen.new Innen().",
        "code": "interface IntegerMath { int operation(int a, int b); }\nstatic int operateBinary(int a, int b, IntegerMath op) {\n  return op.operation(a, b);\n}\nIntegerMath addition = (a, b) -> a + b;\nSystem.out.println(operateBinary(40, 2, addition)); // 42\n\nkunden.sort((k1, k2) -> k1.getName().compareTo(k2.getName()));\nkunden.removeIf(k -> k.getUmsatz() < 100);"
      }
    },
    {
      "id": "gp2-jcf",
      "title": "6. Java Collections Framework (JCF, LV 4)",
      "badge": "FA2 & Kursarbeit",
      "examWeight": 3,
      "diagram": "jcf-hierarchy",
      "sources": [
        {
          "title": "GP2 LV 4: Collections Framework",
          "path": "moodle-data/gdp2/files/GP2 LV 4.pdf",
          "page": 2
        },
        {
          "title": "GP2 LV 4: Collections Framework",
          "path": "moodle-data/gdp2/files/GP2 LV 4.pdf",
          "page": 4
        },
        {
          "title": "GP2 LV 4: Collections Framework",
          "path": "moodle-data/gdp2/files/GP2 LV 4.pdf",
          "page": 7
        },
        {
          "title": "GP2 LV 4: Collections Framework",
          "path": "moodle-data/gdp2/files/GP2 LV 4.pdf",
          "page": 9
        },
        {
          "title": "LE JCF: Java Collections Framework",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
          "page": 4
        },
        {
          "title": "LE JCF: Java Collections Framework",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
          "page": 5
        },
        {
          "title": "LE JCF: Java Collections Framework",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
          "page": 17
        },
        {
          "title": "LE JCF: Java Collections Framework",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
          "page": 19
        },
        {
          "title": "LE JCF: Java Collections Framework",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
          "page": 21
        }
      ],
      "summary": [
        "<strong>Collections</strong> speichern <em>Referenzen auf Objekte</em>, keine elementaren Werte. Zwei Hauptinterfaces in <code>java.util</code>: <code>Collection&lt;E&gt;</code> und <code>Map&lt;K,V&gt;</code> (Map ist <em>keine</em> Collection). Verhalten (Interface) von Implementierung (Klasse) trennen: <code>List&lt;Cocktail&gt; cocktails = new ArrayList&lt;&gt;();</code>",
        "<strong>Collection&lt;E&gt;:</strong> <code>add</code>, <code>addAll</code>, <code>contains</code>, <code>containsAll</code>, <code>remove</code>, <code>removeAll</code>, <code>removeIf(Predicate)</code>, <code>retainAll</code>, <code>size</code>, <code>isEmpty</code>, <code>iterator</code>, <code>toArray</code>, <code>stream</code>. „optional operation“ → darf <code>UnsupportedOperationException</code> werfen (unveränderbare Collections).",
        "<strong>List&lt;E&gt;</strong> (Reihenfolge, Index, Duplikate): <code>add(int, E)</code>, <code>get</code>, <code>set</code>, <code>remove(int)</code>, <code>indexOf</code> (−1 wenn fehlt), <code>subList(von, bis)</code> (bis exklusiv), <code>listIterator</code>. <code>ArrayList</code> = Array (weniger Speicher, Startkapazität 10), <code>LinkedList</code> = doppelt verkettet (schnelles add/remove, implementiert auch Queue/Deque). <code>Set</code> = keine Duplikate (<code>HashSet.add</code> liefert false).",
        "<strong>Map&lt;K,V&gt;:</strong> Schlüssel-Wert-Paare (Wörterbuch, Symboltabelle, DB-Tabelle mit Primärschlüssel). <code>HashMap</code> = Hashtabelle; <code>put</code>, <code>get</code> (null wenn fehlt), <code>containsKey</code>, <code>keySet()</code> (Set), <code>values()</code> (Collection). <code>TreeMap</code> = binärer Baum.",
        "<strong>Generics:</strong> Typparameter müssen Referenztypen sein → <code>List&lt;Integer&gt;</code>, nicht <code>List&lt;int&gt;</code>. Hüllklassen (Integer, Double, Character, Boolean …) + <em>Autoboxing</em> (<code>li.add(15)</code> ≙ <code>Integer.valueOf(15)</code>). <code>List&lt;Kunde&gt;</code> ist <em>kein</em> Untertyp von <code>List&lt;Person&gt;</code>; Wildcards <code>&lt;? extends E&gt;</code>, <code>&lt;? super E&gt;</code>.",
        "<strong>Vergleiche:</strong> <code>==</code> vergleicht Referenzen, <code>equals</code> Werte – bei Hüllklassen wie bei Strings. Durchlaufen per for-each oder <code>Iterator</code> (<code>hasNext</code>/<code>next</code>/<code>remove</code>)."
      ],
      "feynman": {
        "prompt": "Für deine KA: Begründe, ob du die Objekte in einer ArrayList, LinkedList oder HashMap hältst, und wie du suchst, sortierst und löschst.",
        "rubric": [
          "ArrayList: Index-Zugriff, wenig Speicher – Standardwahl für Anzeige/Sortierung; LinkedList: viel Einfügen/Löschen.",
          "HashMap<Schlüssel, Objekt>: schneller Zugriff über eindeutigen Schlüssel (z. B. Nummer).",
          "Sortieren mit liste.sort(Comparator-Lambda), Filtern/Löschen mit removeIf(Predicate) oder Iterator.remove.",
          "Variable mit Interface-Typ (List/Map) deklarieren, Implementierung austauschbar."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp2-jcf",
        "courseId": "gdp2",
        "title": "GP2: Collections Framework",
        "content": "Collection<E> → List<E> (ArrayList: Array, Kapazität 10, wenig Speicher | LinkedList: doppelt verkettet, schnelles add/remove, Queue/Deque) | Set<E> (HashSet: keine Duplikate) • Map<K,V> (HashMap: Hashtabelle | TreeMap: Baum) – Map erbt NICHT von Collection • List: add(i,e), get(i), set(i,e), remove(i), indexOf(o) → -1, subList(von, bis-exkl.), listIterator(size) + hasPrevious/previous • Map: put (überschreibt), get → null, containsKey, keySet, values, remove • removeIf(p -> …), retainAll, containsAll • Wrapper: int→Integer, double→Double, char→Character; Autoboxing • Integer mit equals vergleichen • List<Kunde> ≠ List<Person> • for-each-Schleife + list.remove → ConcurrentModificationException; besser removeIf / Iterator.remove.",
        "code": "Map<String, Person> map = new HashMap<>();\nmap.put(k1.getName(), k1);\nif (map.containsKey(\"Catherine - Deneuve\")) {\n  System.out.println(map.get(\"Catherine - Deneuve\"));\n}\nfor (Person p : map.values()) System.out.println(p.getName());\n\nIterator<Person> it = liste.iterator();\nwhile (it.hasNext()) {\n  if (it.next().getName().startsWith(\"A\")) it.remove();\n}"
      }
    },
    {
      "id": "gp2-javafx",
      "title": "7. JavaFX Grundlagen: Aufbau, Layouts, Controls (FXG, LV 5)",
      "badge": "FA3 & Kursarbeit",
      "examWeight": 3,
      "diagram": "javafx-scenegraph",
      "sources": [
        {
          "title": "GP2 LV 5: JavaFX Aufbau",
          "path": "moodle-data/gdp2/files/GP2 LV 5.pdf",
          "page": 3
        },
        {
          "title": "GP2 LV 5: JavaFX Aufbau",
          "path": "moodle-data/gdp2/files/GP2 LV 5.pdf",
          "page": 17
        },
        {
          "title": "GP2 LV 5: JavaFX Aufbau",
          "path": "moodle-data/gdp2/files/GP2 LV 5.pdf",
          "page": 24
        },
        {
          "title": "GP2 LV 5: JavaFX Aufbau",
          "path": "moodle-data/gdp2/files/GP2 LV 5.pdf",
          "page": 28
        },
        {
          "title": "LE FXG: Grundlagen von JavaFX",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
          "page": 11
        },
        {
          "title": "LE FXG: Grundlagen von JavaFX",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
          "page": 15
        },
        {
          "title": "LE FXG: Grundlagen von JavaFX",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
          "page": 17
        },
        {
          "title": "LE FXG: Grundlagen von JavaFX",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
          "page": 30
        },
        {
          "title": "LE FXG: Grundlagen von JavaFX",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
          "page": 33
        },
        {
          "title": "LE FXG: Grundlagen von JavaFX",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
          "page": 37
        }
      ],
      "summary": [
        "<strong>GUI vs. Konsole:</strong> Bei der Konsole gibt das Programm den Kontrollfluss vor; bei der GUI der Benutzer (Ereignisse in beliebiger Reihenfolge) → Programm muss auch auf unsinnige Eingaben vorbereitet sein. GUI-Bibliotheken: AWT, Swing, SWT, JavaFX (Liberica Full JDK enthält JavaFX).",
        "<strong>Aufbau (Theater-Metapher):</strong> Klasse <code>extends Application</code>, überschreibt <code>start(Stage primaryStage)</code>; <code>main</code> ruft <code>launch(args)</code>. <code>Stage</code> = Fenster (Bühne), <code>Scene</code> = Inhalt (Szene), Scene Graph = Baum aus <code>Node</code>-Objekten. <code>new Scene(root, 400, 400)</code> braucht ein <code>Parent</code> (Group, Region, WebView); <code>stage.setScene(scene); stage.show();</code>",
        "<strong>Layouts (Region-Unterklassen):</strong> <code>GridPane</code> (<code>add(node, spalte, zeile[, colspan, rowspan])</code>, <code>setHgap/Vgap</code>, <code>setPadding(new Insets(…))</code>), <code>VBox</code> (untereinander), <code>HBox</code> (nebeneinander), <code>StackPane</code> (übereinander gestapelt), <code>BorderPane</code> (top/bottom/left/right/center), <code>ScrollPane</code> (nur <em>ein</em> Kind via <code>setContent</code>). Kinder: <code>getChildren().add/addAll</code>.",
        "<strong>Größen:</strong> Layout-Manager ordnen bei Fensteränderung neu an; Komponenten geben preferred/minimum/maximum size vor. Ein Button als Scene-Wurzel nimmt die Fenstergröße an, in einer HBox seine bevorzugte Größe. <code>GridPane.setHgrow(node, Priority.ALWAYS)</code>.",
        "<strong>Controls (javafx.scene.control):</strong> <code>Label</code>, <code>Button</code>, <code>TextField</code> (einzeilig), <code>TextArea</code> (mehrzeilig), <code>PasswordField</code>, <code>Tooltip</code>, <code>MenuBar/Menu/MenuItem/CheckMenuItem</code>, <code>ComboBox&lt;T&gt;</code>, <code>RadioButton</code> + <code>ToggleGroup</code> (nur einer wählbar), <code>CheckBox</code>, <code>DatePicker</code>, <code>ColorPicker</code>.",
        "<strong>Zweites Fenster / Dialog:</strong> <code>Stage second = new Stage(); second.initOwner(primaryStage); second.initModality(Modality.WINDOW_MODAL); second.show();</code> – modal: Hauptfenster erst nach Schließen bedienbar.",
        "<strong>Model–View:</strong> Model-Klassen (<code>Hotel</code>, <code>Rating</code>, <code>AllHotels</code>) im Paket <code>model</code>; View (<code>HotelsDemo</code>) liest daraus dynamisch – View nutzt Model, nicht umgekehrt."
      ],
      "feynman": {
        "prompt": "Skizziere den Scene Graph eines CRUD-Fensters für deine KA (Liste links, Formular rechts, Buttons unten) und erkläre, welche Layout-Klasse wohin gehört.",
        "rubric": [
          "Stage → Scene → Wurzel BorderPane (Parent).",
          "center/right: GridPane mit Label/TextField-Paaren (add(node, spalte, zeile)); bottom: HBox mit Buttons; left: VBox/ScrollPane für die Liste.",
          "ScrollPane nimmt nur ein Kind (setContent), deshalb eine VBox hinein.",
          "Layout-Manager passen Größe/Position bei Fensteränderung an."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp2-fx",
        "courseId": "gdp2",
        "title": "GP2: JavaFX Aufbau & Layouts",
        "content": "public class App extends Application { start(Stage s) } + main: launch(args) • Stage (Fenster) → Scene(Parent root, b, h) → Scene Graph aus Nodes • Parent: Group (Geometrie, exakte Koordinaten), Region (Formulare: GridPane, VBox, HBox, StackPane, BorderPane), WebView • GridPane.add(node, spalte, zeile, colspan, rowspan), setHgap/setVgap, setPadding(new Insets(25,25,25,25)), setGridLinesVisible(true) zum Debuggen • VBox/HBox/StackPane: getChildren().addAll(…) • BorderPane: setTop/Bottom/Left/Right/Center • ScrollPane: setContent(einKind) • Controls: Label, Button, TextField, TextArea, PasswordField, Tooltip, ComboBox<String>, RadioButton+ToggleGroup, CheckBox, DatePicker, MenuBar>Menu>MenuItem • Dialog: new Stage(), initOwner(primary), initModality(Modality.WINDOW_MODAL), show().",
        "code": "public class Main extends Application {\n  @Override\n  public void start(Stage primaryStage) {\n    BorderPane root = new BorderPane();\n    GridPane form = new GridPane();\n    form.setHgap(10); form.setVgap(10);\n    form.add(new Label(\"Name:\"), 0, 0);\n    TextField tfName = new TextField();\n    form.add(tfName, 1, 0);\n    Button btAdd = new Button(\"Hinzufügen\");\n    root.setCenter(form);\n    root.setBottom(new HBox(10, btAdd));\n    primaryStage.setScene(new Scene(root, 400, 300));\n    primaryStage.show();\n  }\n  public static void main(String[] args) { launch(args); }\n}"
      }
    },
    {
      "id": "gp2-fx-events",
      "title": "8. JavaFX Ereignisse, Binding & MVC/CRUD (FXE)",
      "badge": "FA3 & Kursarbeit",
      "examWeight": 3,
      "diagram": "gp2-mvc",
      "sources": [
        {
          "title": "GP2 LV 5: JavaFX Aufbau",
          "path": "moodle-data/gdp2/files/GP2 LV 5.pdf",
          "page": 13
        },
        {
          "title": "GP2 LV 5: JavaFX Aufbau",
          "path": "moodle-data/gdp2/files/GP2 LV 5.pdf",
          "page": 18
        },
        {
          "title": "GP2 LV 5: JavaFX Aufbau",
          "path": "moodle-data/gdp2/files/GP2 LV 5.pdf",
          "page": 22
        },
        {
          "title": "GP2 LV 5: JavaFX Aufbau",
          "path": "moodle-data/gdp2/files/GP2 LV 5.pdf",
          "page": 29
        },
        {
          "title": "LE FXE: Ereignisbehandlung und Binding",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
          "page": 3
        },
        {
          "title": "LE FXE: Ereignisbehandlung und Binding",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
          "page": 11
        },
        {
          "title": "LE FXE: Ereignisbehandlung und Binding",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
          "page": 14
        },
        {
          "title": "LE FXE: Ereignisbehandlung und Binding",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
          "page": 21
        },
        {
          "title": "LE FXE: Ereignisbehandlung und Binding",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
          "page": 28
        }
      ],
      "summary": [
        "<strong>Zwei Wege, auf Ereignisse zu reagieren:</strong> (1) <em>Ereignisbehandlung</em> – funktionales Interface <code>EventHandler&lt;T extends Event&gt;</code> mit <code>void handle(T event)</code>; (2) <em>Binding</em> – zwei Properties werden gebunden, Änderungen werden gespiegelt.",
        "<strong>setOnAction:</strong> in <code>ButtonBase</code> (Klick), <code>TextField</code> (Enter-Taste), <code>MenuItem</code> (Auswahl) – erwartet <code>EventHandler&lt;ActionEvent&gt;</code>. Implementierbar als eigene Klasse, anonyme Klasse oder Lambda: <code>button.setOnAction(e -&gt; enterRating(l, tf));</code> Bei mehreren Zeilen Hilfsmethode aufrufen. Fenster: <code>WindowEvent</code>; Maus: <code>setOnMouseReleased</code>, <code>setOnMouseExited</code> (Properties von <code>Node</code>).",
        "<strong>Properties:</strong> Attribute, deren Typ <code>Property&lt;T&gt;</code> implementiert (z. B. <code>StringProperty</code>, <code>DoubleProperty</code>). Namenskonvention: <code>getText()</code>, <code>setText(String)</code>, <code>textProperty()</code>. <code>ObservableValue</code> → <code>addListener(ChangeListener)</code>.",
        "<strong>Binding:</strong> <code>ziel.textProperty().bind(quelle.textProperty())</code> – unidirektional (Quelle → Ziel); <code>bindBidirectional</code> – beide Richtungen; <code>unbind</code>, <code>isBound</code>. Beispiel Slider: <code>c.scaleXProperty().bind(slider.valueProperty())</code>.",
        "<strong>MVC (LV 5):</strong> Model kapselt Daten/Zustand und benachrichtigt View; View zeigt Model an und übermittelt Benutzeraktionen; Controller übersetzt Aktionen in Model-Änderungen und wählt die View. Vorteil: Daten unabhängig von der Darstellung; Nachteil: mehr Aufwand. JavaFX fasst View+Controller oft zusammen.",
        "<strong>Hotel-Beispiel (FXE 5):</strong> Pakete <code>model</code> (Hotel, Rating, AllHotels), <code>view</code> (HotelsBewertung, RatingDialog), <code>controller</code> (<code>RatingDialogController</code>, <code>NewRatingController</code> implementieren <code>EventHandler&lt;ActionEvent&gt;</code>), <code>utilities</code>. Controller bekommt per Konstruktor die benötigten Objekte (Stage, Hotel, Label), prüft die Eingabe (1–5), aktualisiert Model + Anzeige, färbt bei Fehler den Prompt rot.",
        "<strong>Model ohne JavaFX:</strong> FXE nutzt JavaFX nur für die Oberfläche, nicht im Model (keine <code>FXCollections</code> im Model) → Model mit anderer GUI wiederverwendbar."
      ],
      "feynman": {
        "prompt": "Erkläre den Ablauf „Benutzer klickt auf Speichern“ in deiner KA vom Klick bis zur aktualisierten Anzeige – mit EventHandler, Controller, Model, DAO und Fehlerbehandlung.",
        "rubric": [
          "Button.setOnAction(handler): beim Klick ruft JavaFX handle(ActionEvent) bzw. den Lambda-Rumpf auf.",
          "Controller liest TextField-Werte (getText), prüft/konvertiert sie (NumberFormatException abfangen) und ändert das Model.",
          "Model/DAO speichert; IOException wird spezifisch gefangen und dem Benutzer angezeigt.",
          "View wird aktualisiert (setText/Liste neu aufbauen) oder per Binding automatisch."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp2-fxe",
        "courseId": "gdp2",
        "title": "GP2: Events, Binding, MVC",
        "content": "EventHandler<T extends Event>: void handle(T e) → funktional → Lambda • button.setOnAction(e -> …) (Klick), textField.setOnAction (Enter), menuItem.setOnAction (Auswahl), stage.setOnCloseRequest (WindowEvent), node.setOnMouseReleased/Exited (MouseEvent) • eigene Controller-Klasse: class XController implements EventHandler<ActionEvent> { Konstruktor bekommt Model + Controls; public void handle(ActionEvent e) {…} } • Property-Konvention: getX/setX/xProperty • a.bind(b): a folgt b (a dann nicht mehr setzen!) • a.bindBidirectional(b) • unbind/isBound • MVC: Model (Daten, kein JavaFX), View (Anzeige), Controller (Aktion → Model-Änderung) • Eingabe prüfen: try { Integer.parseInt(tf.getText()) } catch (NumberFormatException ex) { Label rot / Hinweis }.",
        "code": "btSpeichern.setOnAction(e -> {\n  try {\n    int alter = Integer.parseInt(tfAlter.getText());\n    verwaltung.hinzufuegen(new Kunde(tfName.getText(), alter));\n    dao.speichern(verwaltung.getAlle());\n    lbStatus.setText(\"Gespeichert\");\n  } catch (NumberFormatException ex) {\n    lbStatus.setText(\"Alter muss eine Zahl sein\");\n  } catch (IOException ex) {\n    lbStatus.setText(\"Fehler beim Speichern: \" + ex.getMessage());\n  }\n});\nlbVorschau.textProperty().bind(tfName.textProperty());"
      }
    },
    {
      "id": "gp2-fx2d",
      "title": "9. 2D-Grafik mit JavaFX (FX2)",
      "badge": "Nebenthema",
      "examWeight": 1,
      "sources": [
        {
          "title": "LE FX2: 2D-Grafik mit JavaFX",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FX2-2DGrafikJavaFX.pdf",
          "page": 3
        },
        {
          "title": "LE FX2: 2D-Grafik mit JavaFX",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FX2-2DGrafikJavaFX.pdf",
          "page": 4
        },
        {
          "title": "LE FX2: 2D-Grafik mit JavaFX",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FX2-2DGrafikJavaFX.pdf",
          "page": 8
        },
        {
          "title": "LE FX2: 2D-Grafik mit JavaFX",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FX2-2DGrafikJavaFX.pdf",
          "page": 11
        },
        {
          "title": "LE FX2: 2D-Grafik mit JavaFX",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FX2-2DGrafikJavaFX.pdf",
          "page": 17
        }
      ],
      "summary": [
        "<strong>Koordinatensystem:</strong> Ursprung (0|0) <em>links oben</em>; x nach rechts, y nach <em>unten</em> wachsend; Einheit Pixel.",
        "<strong>Shapes (javafx.scene.shape):</strong> abstrakte Oberklasse <code>Shape</code> (<code>setStroke</code>, <code>setStrokeWidth</code>, <code>setFill</code>, <code>Shape.union</code>, <code>Shape.intersect</code>). <code>Line(startX, startY, endX, endY)</code>, <code>Rectangle(x, y, width, height)</code> (x,y = linke obere Ecke; <code>setArcWidth/Height</code> rundet Ecken), <code>Circle</code>, <code>Polyline</code>, <code>Polygon</code>; <code>Text</code> ist auch ein Shape.",
        "<strong>Wurzel Group:</strong> erlaubt exakte Positionierung der Shapes (statt Layout-Manager).",
        "<strong>Farben:</strong> RGB-Modell; Konstanten <code>Color.RED</code> …; <code>Color.rgb(r, g, b, opacity)</code> mit r,g,b 0–255, opacity 0.0–1.0 (kleiner = transparenter); <code>new Color(r, g, b, opacity)</code> mit Werten 0–1; Verläufe <code>LinearGradient</code>, <code>RadialGradient</code>.",
        "<strong>Model-View:</strong> geometrische Daten im Model, Zeichnen in der View → gleiche Logik mit anderer Darstellung wiederverwendbar."
      ],
      "feynman": {
        "prompt": "Erkläre, wo new Rectangle(40, 60, 200, 40) auf dem Bildschirm landet und warum man für Zeichnungen eine Group statt einer VBox als Wurzel nimmt.",
        "rubric": [
          "Linke obere Ecke bei x=40 (von links) und y=60 (von oben), 200 breit, 40 hoch.",
          "y wächst nach unten (anders als in der Mathematik).",
          "Group übernimmt die Koordinaten der Shapes; VBox würde die Elemente selbst anordnen."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp2-fx2d",
        "courseId": "gdp2",
        "title": "GP2: 2D-Grafik",
        "content": "(0|0) links oben, y nach unten • Group als Wurzel für exakte Koordinaten • Line(x1,y1,x2,y2) • Rectangle(x,y,w,h), setArcWidth/Height • Circle(cx,cy,r) • Polygon/Polyline(Punkte…) • Shape: setStroke(Color), setStrokeWidth, setFill, Shape.union/intersect • Color.rgb(0-255,0-255,0-255, opacity 0-1), new Color(0-1,0-1,0-1,opacity) • LinearGradient/RadialGradient • Text ist Shape.",
        "code": "Group root = new Group();\nLine l = new Line(0, 0, 700, 600);\nl.setStrokeWidth(2);\nRectangle r = new Rectangle(40, 60, 200, 40);\nr.setFill(Color.rgb(255, 0, 255, 0.25));\nroot.getChildren().addAll(l, r);"
      }
    },
    {
      "id": "gp2-xml",
      "title": "10. Java & XML: Syntax, DTD, DOM (JML)",
      "badge": "FA4 & optionale KA-Persistenz",
      "examWeight": 2,
      "sources": [
        {
          "title": "LE JML: Java und XML",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
          "page": 4
        },
        {
          "title": "LE JML: Java und XML",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
          "page": 17
        },
        {
          "title": "LE JML: Java und XML",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
          "page": 18
        },
        {
          "title": "LE JML: Java und XML",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
          "page": 26
        },
        {
          "title": "LE JML: Java und XML",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
          "page": 32
        },
        {
          "title": "LE JML: Java und XML",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
          "page": 38
        },
        {
          "title": "LE JML: Java und XML",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
          "page": 41
        },
        {
          "title": "LE JML: Java und XML",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
          "page": 45
        }
      ],
      "summary": [
        "<strong>XML</strong> (Extensible Markup Language, W3C): Metasprache zur <em>Beschreibung</em> von Daten (HTML: Darstellung). Eigene Elemente/Attribute; Textformat, plattformunabhängig, gut lesbar; Nachteil: 5–20-facher Speicherbedarf.",
        "<strong>Syntaxregeln:</strong> genau ein Wurzelelement; jedes geöffnete Element schließen; korrekt verschachteln (umgekehrte Reihenfolge schließen); Groß-/Kleinschreibung beachten; leere Elemente <code>&lt;Adresse/&gt;</code>; Attributwerte in Anführungszeichen, jedes Attribut nur einmal pro Element; Prolog <code>&lt;?xml version=\"1.0\" encoding=\"UTF-8\"?&gt;</code>; Sonderzeichen <code>&amp;amp; &amp;lt; &amp;gt; &amp;quot; &amp;apos;</code>.",
        "<strong>Wohlgeformt</strong> = alle Syntaxregeln erfüllt (prüft jeder Parser). <strong>Gültig</strong> = zusätzlich konform zu DTD/XML-Schema (validierender Parser).",
        "<strong>DTD:</strong> <code>&lt;!ELEMENT a (b, c)&gt;</code> Sequenz, <code>|</code> Auswahl, <code>?</code> 0–1, <code>*</code> 0–n, <code>+</code> 1–n, <code>#PCDATA</code> Text; <code>&lt;!ATTLIST img src CDATA #REQUIRED height CDATA #IMPLIED&gt;</code>; extern: <code>&lt;!DOCTYPE wurzel SYSTEM \"datei.dtd\"&gt;</code>. XML-Schema ist selbst XML und mächtiger.",
        "<strong>SAX vs. DOM:</strong> SAX = sequentiell, ereignisgesteuert (<code>DefaultHandler</code>: startElement, characters …), schnell, wenig Speicher, kein Rückgriff. DOM = ganzes Dokument als Baum im Speicher, wiederholter Zugriff und Änderungen möglich, mehr Speicher, langsamer.",
        "<strong>DOM lesen:</strong> <code>DocumentBuilderFactory.newInstance()</code> → <code>newDocumentBuilder()</code> → <code>parse(new File(…))</code> → <code>getDocumentElement()</code>; <code>getElementsByTagName</code>, <code>getChildNodes</code> → <code>NodeList.item(i)</code>, <code>getLength()</code>; <code>getNodeType() == Node.ELEMENT_NODE/TEXT_NODE</code>, <code>getTextContent()</code>, <code>getAttribute</code>. Traversieren rekursiv.",
        "<strong>DOM schreiben:</strong> <code>builder.newDocument()</code>, <code>createElement</code>, <code>createTextNode</code>, <code>appendChild</code>, <code>setAttribute</code>; ändern: <code>replaceChild</code>, <code>removeChild</code>, <code>removeAttribute</code>. Speichern: <code>TransformerFactory.newInstance().newTransformer().transform(new DOMSource(doc), new StreamResult(file))</code>."
      ],
      "feynman": {
        "prompt": "Erkläre, wie du deine Kundenliste mit DOM als XML-Datei speicherst und wieder einliest – und warum DOM hier besser passt als SAX.",
        "rubric": [
          "Schreiben: DocumentBuilder.newDocument, Wurzel createElement, pro Kunde Element mit setAttribute/createTextNode, appendChild, dann Transformer.transform(DOMSource, StreamResult).",
          "Lesen: parse(File), getElementsByTagName(\"kunde\"), Schleife über NodeList.item(i), getAttribute/getTextContent, neue Kunde-Objekte erzeugen.",
          "DOM hält den Baum im Speicher und erlaubt Ändern/Löschen; SAX liest nur sequentiell ohne Rückgriff.",
          "Ausnahmen spezifisch fangen (ParserConfigurationException, SAXException, IOException, TransformerException)."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp2-xml",
        "courseId": "gdp2",
        "title": "GP2: XML & DOM",
        "content": "Wohlgeformt: 1 Wurzel, alles geschlossen, korrekt verschachtelt, case-sensitive, Attributwerte in \"\", Attribut nur 1x • Gültig: + DTD/Schema • DTD: , Sequenz | Auswahl ? 0-1 * 0-n + 1-n #PCDATA; ATTLIST … CDATA #REQUIRED/#IMPLIED/#FIXED • &lt; &gt; &amp; &quot; &apos; • SAX: ereignisgesteuert, wenig RAM, nur lesen; DOM: Baum im RAM, lesen+ändern • DOM: DocumentBuilderFactory → DocumentBuilder → parse(File)/newDocument() • Element: getElementsByTagName, getChildNodes, getAttribute, setAttribute, appendChild, removeChild • NodeList: getLength, item(i) • Node.ELEMENT_NODE/TEXT_NODE, getTextContent • Speichern: Transformer.transform(new DOMSource(doc), new StreamResult(file)).",
        "code": "Document doc = DocumentBuilderFactory.newInstance()\n    .newDocumentBuilder().newDocument();\nElement root = doc.createElement(\"kunden\");\ndoc.appendChild(root);\nElement k = doc.createElement(\"kunde\");\nk.setAttribute(\"nr\", \"1\");\nk.appendChild(doc.createTextNode(\"Egon\"));\nroot.appendChild(k);\nTransformer t = TransformerFactory.newInstance().newTransformer();\nt.transform(new DOMSource(doc), new StreamResult(new File(\"data/kunden.xml\")));"
      }
    },
    {
      "id": "gp2-rek-xml-lst",
      "title": "11. Rekursion & Listen (REK/LST)",
      "badge": "Nebenthema",
      "examWeight": 1,
      "sources": [
        {
          "title": "LE REK: Rekursion",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_REK-Rekursion.pdf",
          "page": 4
        },
        {
          "title": "LE REK: Rekursion",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_REK-Rekursion.pdf",
          "page": 9
        },
        {
          "title": "LE REK: Rekursion",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_REK-Rekursion.pdf",
          "page": 17
        },
        {
          "title": "LE REK: Rekursion",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_REK-Rekursion.pdf",
          "page": 18
        },
        {
          "title": "LE LST: Listen",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_LST-Listen.pdf",
          "page": 30
        },
        {
          "title": "LE LST: Listen",
          "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_LST-Listen.pdf",
          "page": 63
        }
      ],
      "summary": [
        "<strong>Rekursion:</strong> Problem in fast identische Teilprobleme zerlegen; Methode ruft sich <em>direkt</em> (selbst) oder <em>indirekt</em> (über eine andere Methode) auf. Nötig: Parameter, der sich ändert, und <strong>Abbruchbedingung</strong>. Fakultät: <code>if (zahl == 1 || zahl == 0) return 1; else return zahl * rekursiv(zahl - 1);</code>",
        "<strong>Speicher:</strong> Jeder Aufruf legt einen neuen Bereich auf dem Laufzeitstack an → mehr Speicher als Iteration; bei großer Rekursionstiefe steigt die Laufzeit (ohne Abbruch: <code>StackOverflowError</code>). Vorteile: kürzer, natürlicher, Korrektheit leichter prüfbar.",
        "<strong>Türme von Hanoi:</strong> n−1 Scheiben auf Hilfsstab, größte auf Ziel, n−1 vom Hilfsstab aufs Ziel; Abbruch bei n == 1; <strong>2<sup>n</sup> − 1</strong> Bewegungen. Quicksort = Divide &amp; Conquer.",
        "<strong>Stapel (Stack):</strong> LIFO, <code>push</code>/<code>pop</code> an der Spitze. <strong>Warteschlange (Queue):</strong> FIFO, <code>enqueue</code> am Ende (tail), <code>dequeue</code> am Anfang (head). Mit Reihungen: Test auf voll nötig, Wrap-Around.",
        "<strong>Verkettete Liste:</strong> Knoten (<code>ListNode&lt;E&gt;</code>: <code>element</code> + <code>next</code>, rekursive Klassendefinition); letzter Knoten <code>next = null</code>; Anker <code>head</code>. Doppelt verkettet: zusätzlich Vorgänger (<code>tail</code> für Listenende). Dummy-/Header-Knoten vereinfachen Einfügen/Löschen."
      ],
      "feynman": {
        "prompt": "Erkläre an fakultaet(3), was auf dem Laufzeitstack passiert, und warum ein Stack als verkettete Liste nie „voll“ ist.",
        "rubric": [
          "Aufrufe f(3) → f(2) → f(1) liegen übereinander; f(1) trifft die Abbruchbedingung und liefert 1.",
          "Beim Zurückkehren wird multipliziert: 2*1 = 2, dann 3*2 = 6; Speicherbereiche werden freigegeben.",
          "Ohne Abbruchbedingung wächst der Stack bis zum StackOverflowError.",
          "Bei der verketteten Liste wird pro push ein neuer Knoten erzeugt – keine feste Größe wie bei der Reihung."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp2-rek",
        "courseId": "gdp2",
        "title": "GP2: Rekursion & Listen",
        "content": "Rekursion = Abbruchbedingung + Selbstaufruf mit kleinerem Problem • direkt/indirekt • jeder Aufruf = neuer Stack-Bereich (mehr Speicher als Schleife) • Hanoi: 2^n − 1 Züge • Stack: LIFO push/pop • Queue: FIFO enqueue (tail) / dequeue (head) • Array-Implementierung: isFull nötig • Liste: Knoten = element + next; head = Anker; letzter next = null; doppelt: + prev, tail • JCF: LinkedList ist doppelt verkettet und implementiert Queue/Deque.",
        "code": "static int fak(int n) {\n  if (n <= 1) return 1;        // Abbruch\n  return n * fak(n - 1);        // Selbstaufruf\n}\nstatic void hanoi(int n, int from, int to, int aux) {\n  if (n == 1) System.out.println(n + \": \" + from + \"-->\" + to);\n  else {\n    hanoi(n - 1, from, aux, to);\n    System.out.println(n + \": \" + from + \"-->\" + to);\n    hanoi(n - 1, aux, to, from);\n  }\n}"
      }
    }
  ],
  "flashcards": [
    {
      "id": "fc-gp2-ka-1",
      "chapterId": "gp2-ka",
      "examRelevant": true,
      "front": "Welche Prüfungsform hat GP2 im WS 26/27?",
      "back": "Kursarbeit (KA): Erstellung UND Dokumentation eines Rechnerprogramms (ED). Keine Klausur. Benotet, erscheint im Abschlusszeugnis; Anmeldung beim Prüfungsamt nötig.",
      "source": {
        "title": "Modulrahmenbedingungen GP2",
        "path": "moodle-data/gdp2/files/Modulrahmenbedingungen.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-gp2-ka-2",
      "chapterId": "gp2-ka",
      "examRelevant": true,
      "front": "In welchem Zeitfenster muss die Kursarbeit hochgeladen werden?",
      "back": "Frühestens 12.01.2027 (nach Ende des Prüfungsanmeldezeitraums), spätestens Mo 08.02.2027.",
      "source": {
        "title": "Moodle-Kursseite GP2 (FA-/KA-Regeln)",
        "path": "moodle-data/gdp2/course.html"
      }
    },
    {
      "id": "fc-gp2-ka-3",
      "chapterId": "gp2-ka",
      "examRelevant": true,
      "front": "In welchem Format muss die KA abgegeben werden – und was passiert sonst?",
      "back": "Als exportiertes Eclipse-Projekt: Rechtsklick Projekt → Export → General → Archive File → nur `src` wählen → Dateiname `GP2_Eclipse.zip`.\nEin einfaches Zip der Ordner kann nicht bewertet werden → „nicht ausreichend“.",
      "source": {
        "title": "Anleitung Export Eclipse-Projekt",
        "path": "moodle-data/gdp2/files/Anleitung Export Eclipse-Projekt.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-gp2-ka-4",
      "chapterId": "gp2-ka",
      "examRelevant": true,
      "front": "Welche Dateien/Ordner dürfen NICHT im abgegebenen Projekt sein?",
      "back": "Artefakte anderer Tools/IDEs/Builder: JetBrains (.idea), Maven (pom.xml), Gradle, Ant, Git (.git). Bei FA → Abweisung ohne Durchsicht; laut LV 1 gilt „keine Artefakte von anderen Tools“ für FA und KA.",
      "source": {
        "title": "GP2 LV 1: Begrüßung & Wiederholung",
        "path": "moodle-data/gdp2/files/GP2 LV 1.pdf",
        "page": 4
      }
    },
    {
      "id": "fc-gp2-ka-5",
      "chapterId": "gp2-ka",
      "examRelevant": true,
      "front": "Welche inhaltlichen Bausteine der KA lassen sich aus FA1–FA4 ableiten?",
      "back": "FA1 → Objektmodell und Persistenz\nFA2 → Datenhaltung, Abfrage und Sortierung\nFA3 → Benutzeroberfläche und CRUD (Create, Read, Update, Delete)\nFA4 → optionale XML-Persistenz (DOM)",
      "source": {
        "title": "Moodle-Kursseite GP2 (FA-/KA-Regeln)",
        "path": "moodle-data/gdp2/course.html"
      }
    },
    {
      "id": "fc-gp2-ka-6",
      "chapterId": "gp2-ka",
      "examRelevant": true,
      "front": "Welche Exception-Regel gilt für FA (und sinnvollerweise die KA)?",
      "back": "Exceptions spezifisch behandeln, z. B. `catch (IOException e)`.\nNicht erwünscht: Universalhandler `catch (Exception e)` und `main() throws Exception`.",
      "source": {
        "title": "Moodle-Kursseite GP2 (FA-/KA-Regeln)",
        "path": "moodle-data/gdp2/course.html"
      }
    },
    {
      "id": "fc-gp2-ka-7",
      "chapterId": "gp2-ka",
      "examRelevant": true,
      "front": "Welche Regeln gelten für Kommentare/Doku im Quellcode?",
      "back": "Javadoc-Kommentare für alle `public`-Elemente sind erwünscht. Das javadoc-Tool (HTML) muss nicht ausgeführt werden. Checkstyle ist nicht erforderlich.",
      "source": {
        "title": "Moodle-Kursseite GP2 (FA-/KA-Regeln)",
        "path": "moodle-data/gdp2/course.html"
      }
    },
    {
      "id": "fc-gp2-ka-8",
      "chapterId": "gp2-ka",
      "examRelevant": true,
      "front": "Welches JDK und welche Eclipse-Einstellungen sind vorgegeben?",
      "back": "Bellsoft Liberica FULL JDK 17 (nur „Full“ enthält JavaFX), in Eclipse als JRE wählen; Compiler Compliance Level 17; Workspace-Encoding UTF-8; neues Projekt OHNE module-info.java. Eclipse 2023-06 empfohlen (neuere brauchen JDK 21).",
      "source": {
        "title": "GP2 LV 1: Begrüßung & Wiederholung",
        "path": "moodle-data/gdp2/files/GP2 LV 1.pdf",
        "page": 4
      }
    },
    {
      "id": "fc-gp2-ka-9",
      "chapterId": "gp2-ka",
      "examRelevant": true,
      "front": "Wo sollen Datendateien liegen und wie werden sie adressiert?",
      "back": "Relativ zum Projekt-Wurzelordner, z. B. `data/kunden.txt` (in Eclipse ggf. mit F5 aktualisieren). Keine absoluten Windows-Pfade wie `C:\\Users\\…` – die laufen beim Prüfer nicht.",
      "source": {
        "title": "GP2 LV 2: Dateien und Datenströme",
        "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
        "page": 27
      }
    },
    {
      "id": "fc-gp2-ka-10",
      "chapterId": "gp2-ka",
      "examRelevant": true,
      "front": "Wie prüfst du vor der Abgabe, ob dein Export funktioniert?",
      "back": "In einem LEEREN Eclipse-Workspace: File → Import → General → „Existing Projects into Workspace“ (nicht „Archive File“!) → „Select archive file“ → Zip wählen → Finish. Projekt muss ohne weitere Einstellungen starten.",
      "source": {
        "title": "Anleitung Import Eclipse-Projekt",
        "path": "moodle-data/gdp2/files/Anleitung Import Eclipse-Projekt.pdf",
        "page": 1
      }
    },
    {
      "id": "fc-gp2-ka-11",
      "chapterId": "gp2-ka",
      "examRelevant": true,
      "front": "Wie soll der Code einer GUI-Anwendung auf Pakete verteilt werden?",
      "back": "Pakete für Model-Komponenten (unabhängig von der Oberfläche: Daten, Datei-I/O, …) und Pakete für View-/Controller-Komponenten (Oberfläche; lesen aus dem Model, schreiben Änderungen ins Model).",
      "source": {
        "title": "GP2 LV 5: JavaFX Aufbau",
        "path": "moodle-data/gdp2/files/GP2 LV 5.pdf",
        "page": 29
      }
    },
    {
      "id": "fc-gp2-ka-12",
      "chapterId": "gp2-ka",
      "examRelevant": true,
      "front": "Darfst du Teile deiner FA-Lösungen in der Kursarbeit verwenden?",
      "back": "Ja: „Lösungen, die Sie zu Feedback-Aufgaben eingereicht haben, dürfen bei der Anfertigung der abschließenden Kursarbeit mit verwendet werden.“",
      "source": {
        "title": "Moodle-Kursseite GP2 (FA-/KA-Regeln)",
        "path": "moodle-data/gdp2/course.html"
      }
    },
    {
      "id": "fc-gp2-ka-13",
      "chapterId": "gp2-ka",
      "examRelevant": true,
      "front": "Was bedeutet CRUD für die KA-Oberfläche?",
      "back": "Create (Objekt anlegen), Read (anzeigen/suchen), Update (ändern), Delete (löschen) – jeweils über die JavaFX-Oberfläche, mit Übernahme ins Model und Persistenz.",
      "source": {
        "title": "Moodle-Kursseite GP2 (FA-/KA-Regeln)",
        "path": "moodle-data/gdp2/course.html"
      }
    },
    {
      "id": "fc-gp2-eip-1",
      "chapterId": "gp2-eip",
      "examRelevant": false,
      "front": "Wie lautet die Schaltjahr-Regel (Demo Datum.istSchaltjahr)?",
      "back": "Schaltjahr, wenn durch 400 teilbar ODER (durch 4 teilbar UND nicht durch 100).\n`return teilbarDurch400 || (teilbarDurch4 && !teilbarDurch100);`",
      "source": {
        "title": "Demo-Projekt 1_Demo_Datum",
        "path": "moodle-data/gdp2/files/1_Demo_Datum.zip"
      }
    },
    {
      "id": "fc-gp2-eip-2",
      "chapterId": "gp2-eip",
      "examRelevant": true,
      "front": "Was macht `super(tag, monat, jahr);` im Konstruktor von `Zeitpunkt extends Datum`?",
      "back": "Ruft den Konstruktor der Oberklasse Datum auf, der die geerbten Attribute setzt und prüft (wirft ggf. IllegalArgumentException). Muss erste Anweisung im Konstruktor sein.",
      "source": {
        "title": "Demo-Projekt 1_Demo_Datum",
        "path": "moodle-data/gdp2/files/1_Demo_Datum.zip"
      }
    },
    {
      "id": "fc-gp2-eip-3",
      "chapterId": "gp2-eip",
      "examRelevant": false,
      "front": "Wie ist eine JUnit-5-Testmethode aufgebaut?",
      "back": "In einer Testklasse (z. B. KTest), annotiert mit `@Test`, `public void`, ohne Parameter. Darin Assert-Methoden aus `org.junit.jupiter.api.Assertions`, z. B. `assertEquals(erwartet, tatsächlich)`.",
      "source": {
        "title": "LE EIP: Einstieg in Programmieren II",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_EIP-EinstiegInProgrammieren2.pdf",
        "page": 47
      }
    },
    {
      "id": "fc-gp2-eip-4",
      "chapterId": "gp2-eip",
      "examRelevant": false,
      "front": "Nenne 4 JUnit-Assert-Methoden.",
      "back": "`assertEquals(erwartet, ist)`, `assertTrue(b)`, `assertFalse(b)`, `assertNull(o)`, `assertSame(a, b)` (gleiches Objekt), `assertArrayEquals(…)`. `@BeforeEach` läuft vor jedem Test.",
      "source": {
        "title": "LE EIP: Einstieg in Programmieren II",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_EIP-EinstiegInProgrammieren2.pdf",
        "page": 47
      }
    },
    {
      "id": "fc-gp2-eip-5",
      "chapterId": "gp2-eip",
      "examRelevant": true,
      "front": "Wie sieht ein Javadoc-Kommentar für eine Methode aus?",
      "back": "/**\n * Kurzbeschreibung.\n * @param tag Tag 1..31\n * @return true, wenn gültig\n * @throws IOException bei Lesefehler\n */\nSteht direkt vor der Methode; in der KA für alle public-Elemente erwünscht.",
      "source": {
        "title": "Demo-Projekt 1_Demo_Datum",
        "path": "moodle-data/gdp2/files/1_Demo_Datum.zip"
      }
    },
    {
      "id": "fc-gp2-1",
      "chapterId": "gp2-streams",
      "examRelevant": true,
      "front": "Was ist der Unterschied zwischen `InputStream`/`OutputStream` und `Reader`/`Writer` in Java?",
      "back": "InputStream/OutputStream sind Byteströme (Binärdaten, Bytes werden unmittelbar verwendet).\nReader/Writer sind Zeichenströme (Text; Bytes werden gemäß einer Zeichencodierung wie UTF-8 in Zeichen umgewandelt).",
      "source": {
        "title": "GP2 LV 2: Dateien und Datenströme",
        "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
        "page": 5
      }
    },
    {
      "id": "fc-gp2-2",
      "chapterId": "gp2-streams",
      "examRelevant": true,
      "front": "Was braucht eine Klasse, damit ihre Objekte mit `ObjectOutputStream.writeObject` gespeichert werden können?",
      "back": "Sie muss das Interface `Serializable` implementieren (Marker-Interface ohne Methoden). Empfohlen: `private static final long serialVersionUID = …;`. Beim Lesen das Ergebnis von `readObject()` in den Klassentyp casten.",
      "source": {
        "title": "LE DUD: Dateien und Datenströme",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_DUD-DateienUndDatenstroeme.pdf",
        "page": 35
      }
    },
    {
      "id": "fc-gp2-st-1",
      "chapterId": "gp2-streams",
      "examRelevant": true,
      "front": "Definition Persistenz (LV 2)?",
      "back": "Fähigkeit eines Programms, Daten über lange Zeit, auch über das Programmende hinaus, bereitzuhalten. Benötigt ein nichtflüchtiges Speichermedium (Dateisystem, Datenbank).",
      "source": {
        "title": "GP2 LV 2: Dateien und Datenströme",
        "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
        "page": 2
      }
    },
    {
      "id": "fc-gp2-st-2",
      "chapterId": "gp2-streams",
      "examRelevant": true,
      "front": "Welche Stromkette schreibt Textzeilen gepuffert und in UTF-8 in eine Datei?",
      "back": "`new PrintWriter(new BufferedWriter(new FileWriter(\"data/x.txt\", StandardCharsets.UTF_8)))`\nDann `println(…)` und am Ende `close()`.",
      "source": {
        "title": "Demo-Projekt 2_Demo_Persistenz",
        "path": "moodle-data/gdp2/files/2_Demo_Persistenz.zip"
      }
    },
    {
      "id": "fc-gp2-st-3",
      "chapterId": "gp2-streams",
      "examRelevant": true,
      "front": "Woran erkennst du beim Lesen das Dateiende?",
      "back": "`Reader.read()` / `InputStream.read()` → -1\n`BufferedReader.readLine()` → null\n`DataInputStream.readInt()` usw. → EOFException",
      "source": {
        "title": "GP2 LV 2: Dateien und Datenströme",
        "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
        "page": 10
      }
    },
    {
      "id": "fc-gp2-st-4",
      "chapterId": "gp2-streams",
      "examRelevant": true,
      "front": "Was machen `flush()` und `close()` bei gepufferten Ausgabeströmen?",
      "back": "flush(): schreibt den teilweise gefüllten Puffer in den Ausgabestrom.\nclose(): schließt den Strom, gibt Systemressourcen frei und ruft vorher flush() auf. Ohne close/flush kann die Datei leer bleiben.",
      "source": {
        "title": "LE DUD: Dateien und Datenströme",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_DUD-DateienUndDatenstroeme.pdf",
        "page": 35
      }
    },
    {
      "id": "fc-gp2-st-5",
      "chapterId": "gp2-streams",
      "examRelevant": true,
      "front": "Wie viele Bytes belegen „A“, „Ü“ und „€“ in UTF-8?",
      "back": "A (U+0041): 1 Byte (41)\nÜ (U+00DC): 2 Bytes (C3 9C)\n€ (U+20AC): 3 Bytes (E2 82 AC)\nUTF-8 nutzt 1–4 Bytes und hat eine eindeutige Byte-Reihenfolge.",
      "source": {
        "title": "GP2 LV 2: Dateien und Datenströme",
        "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
        "page": 13
      }
    },
    {
      "id": "fc-gp2-st-6",
      "chapterId": "gp2-streams",
      "examRelevant": true,
      "front": "Was ist bei `DataOutputStream`/`DataInputStream` zwingend zu beachten?",
      "back": "Die Werte müssen in GENAU der Reihenfolge und mit denselben Typen gelesen werden, in der sie geschrieben wurden (z. B. writeUTF, writeInt, writeBoolean, writeDouble → readUTF, readInt, readBoolean, readDouble).",
      "source": {
        "title": "Demo-Projekt 2_Demo_Persistenz",
        "path": "moodle-data/gdp2/files/2_Demo_Persistenz.zip"
      }
    },
    {
      "id": "fc-gp2-st-7",
      "chapterId": "gp2-streams",
      "examRelevant": true,
      "front": "Erzeugt `new File(\"data/x.txt\")` eine Datei auf der Platte?",
      "back": "Nein. Es entsteht nur ein File-Objekt (abstrakte Pfaddarstellung). Erst `createNewFile()` legt eine leere Datei an (liefert false, wenn sie schon existiert – überschreibt nicht).",
      "source": {
        "title": "LE DUD: Dateien und Datenströme",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_DUD-DateienUndDatenstroeme.pdf",
        "page": 59
      }
    },
    {
      "id": "fc-gp2-st-8",
      "chapterId": "gp2-streams",
      "examRelevant": false,
      "front": "Nenne 5 Methoden der Klasse `File`.",
      "back": "`exists()`, `isFile()`, `isDirectory()`, `getName()`, `getPath()`, `getAbsolutePath()`, `length()`, `createNewFile()`, `mkdirs()`, `delete()`, `setReadOnly()`.",
      "source": {
        "title": "LE DUD: Dateien und Datenströme",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_DUD-DateienUndDatenstroeme.pdf",
        "page": 52
      }
    },
    {
      "id": "fc-gp2-st-9",
      "chapterId": "gp2-streams",
      "examRelevant": false,
      "front": "Wozu dienen `InputStreamReader` und `OutputStreamWriter`?",
      "back": "Brücken zwischen Byte- und Zeichenströmen: InputStreamReader wandelt einen InputStream (z. B. System.in) in einen Reader um, OutputStreamWriter einen Writer in Bytes für einen OutputStream – jeweils optional mit Zeichencodierung.",
      "source": {
        "title": "GP2 LV 2: Dateien und Datenströme",
        "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
        "page": 14
      }
    },
    {
      "id": "fc-gp2-st-10",
      "chapterId": "gp2-streams",
      "examRelevant": false,
      "front": "Was ist eine Filterklasse (DUD)?",
      "back": "Ein Strom, der aus einem bereits existierenden Strom erzeugt wird und dessen Daten filtert/ergänzt, z. B. DataInputStream um FileInputStream (primitive Typen lesen) oder BufferedReader um FileReader (Puffer + readLine).",
      "source": {
        "title": "LE DUD: Dateien und Datenströme",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_DUD-DateienUndDatenstroeme.pdf",
        "page": 26
      }
    },
    {
      "id": "fc-gp2-ex-1",
      "chapterId": "gp2-exc-dao",
      "examRelevant": true,
      "front": "Checked vs. unchecked Exceptions – was ist der Unterschied?",
      "back": "Unchecked (RuntimeException + Unterklassen): können behandelt werden, Programm übersetzt auch ohne.\nChecked (von Exception abgeleitet, z. B. IOException): müssen behandelt oder per throws deklariert werden – sonst Compilerfehler.\nError: schwerwiegend, nicht behandeln.",
      "source": {
        "title": "GP2 LV 2: Dateien und Datenströme",
        "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
        "page": 21
      }
    },
    {
      "id": "fc-gp2-ex-2",
      "chapterId": "gp2-exc-dao",
      "examRelevant": true,
      "front": "Welche Unterklassen von IOException behandelt DUD?",
      "back": "`FileNotFoundException` – unter dem Pfad keine Datei gefunden.\n`EOFException` – Leseoperation nicht möglich, Dateiende erreicht.",
      "source": {
        "title": "LE DUD: Dateien und Datenströme",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_DUD-DateienUndDatenstroeme.pdf",
        "page": 16
      }
    },
    {
      "id": "fc-gp2-ex-3",
      "chapterId": "gp2-exc-dao",
      "examRelevant": true,
      "front": "Warum ist `public static void main(String[] args) throws IOException` in den Aufgaben unerwünscht?",
      "back": "Das ist „Behandlung durch allgemeine Weiterleitung“: Der Compiler übersetzt zwar, aber der Fehler wird nirgends sinnvoll behandelt. Gewünscht ist spezifisches try-catch an der Stelle, wo reagiert werden kann.",
      "source": {
        "title": "GP2 LV 2: Dateien und Datenströme",
        "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
        "page": 25
      }
    },
    {
      "id": "fc-gp2-ex-4",
      "chapterId": "gp2-exc-dao",
      "examRelevant": true,
      "front": "Definition Data Access Object (DAO)?",
      "back": "Entwurfsmuster, das den Zugriff auf unterschiedliche Datenquellen (DB, Dateisystem) so kapselt, dass die Datenquelle ausgetauscht werden kann, ohne den aufrufenden Code zu ändern. Programmlogik wird von technischen Speicherdetails befreit.",
      "source": {
        "title": "GP2 LV 2: Dateien und Datenströme",
        "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
        "page": 29
      }
    },
    {
      "id": "fc-gp2-ex-5",
      "chapterId": "gp2-exc-dao",
      "examRelevant": true,
      "front": "Wie sind Student und StudentDAO in der Demo aufgeteilt?",
      "back": "Student: fachliche Klasse (name, matnr, bestanden, note + Getter/Setter), kennt keine Speicherdetails.\nStudentDAO: öffnet DataOutputStream/DataInputStream, `write(Student)`, `read(Student)`, `close()`.",
      "source": {
        "title": "Demo-Projekt 2_Demo_Persistenz",
        "path": "moodle-data/gdp2/files/2_Demo_Persistenz.zip"
      }
    },
    {
      "id": "fc-gp2-ex-6",
      "chapterId": "gp2-exc-dao",
      "examRelevant": true,
      "front": "In welcher Reihenfolge müssen catch-Blöcke für FileNotFoundException und IOException stehen?",
      "back": "Speziellere zuerst: erst `catch (FileNotFoundException e)`, dann `catch (IOException e)`. Umgekehrt meldet der Compiler „exception FileNotFoundException has already been caught“.",
      "source": {
        "title": "LE DUD: Dateien und Datenströme",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_DUD-DateienUndDatenstroeme.pdf",
        "page": 16
      }
    },
    {
      "id": "fc-gp2-ex-7",
      "chapterId": "gp2-exc-dao",
      "examRelevant": true,
      "front": "Welche Exception wirft `Integer.parseInt(\"abc\")` und muss sie gefangen werden?",
      "back": "NumberFormatException – eine RuntimeException (unchecked): Compiler erzwingt kein catch. Bei Benutzereingaben in der GUI trotzdem fangen, sonst stürzt der Event-Handler ab statt einen Hinweis zu zeigen.",
      "source": {
        "title": "GP2 LV 2: Dateien und Datenströme",
        "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
        "page": 21
      }
    },
    {
      "id": "fc-gp2-ex-8",
      "chapterId": "gp2-exc-dao",
      "examRelevant": false,
      "front": "Was zeigt die Demo-Klasse Datum zum Thema Exceptions?",
      "back": "Der Konstruktor prüft tag (1–31), monat (1–12), jahr (≥ 1582) und wirft bei Verletzung `throw new IllegalArgumentException();` – eine unchecked Exception für ungültige Argumente.",
      "source": {
        "title": "Demo-Projekt 1_Demo_Datum",
        "path": "moodle-data/gdp2/files/1_Demo_Datum.zip"
      }
    },
    {
      "id": "fc-gp2-aki-1",
      "chapterId": "gp2-aki",
      "examRelevant": true,
      "front": "Definition abstrakte Methode / abstrakte Klasse?",
      "back": "Abstrakte Methode: nur Rückgabetyp + Signatur, kein Rumpf, Modifizierer abstract; Implementierung zwingend in konkreten Unterklassen.\nAbstrakte Klasse: mit abstract deklariert, meist ≥ 1 abstrakte Methode, es können keine Objekte erzeugt werden – aber sie ist ein Typ.",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 4
      }
    },
    {
      "id": "fc-gp2-aki-2",
      "chapterId": "gp2-aki",
      "examRelevant": true,
      "front": "Was darf ein Interface enthalten – und was nicht?",
      "back": "Darf: abstrakte Instanzmethoden, default-Methoden (mit Rumpf), statische Methoden, Konstanten (automatisch public static final), innere Klassen/Interfaces.\nNicht: Objekt-Attribute, Konstruktoren. Alle Elemente implizit public.",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 12
      }
    },
    {
      "id": "fc-gp2-aki-3",
      "chapterId": "gp2-aki",
      "examRelevant": true,
      "front": "Warum muss die implementierende Klasse Interface-Methoden als `public` deklarieren?",
      "back": "Interface-Methoden sind implizit public. Ohne public würde die Klasse ein schwächeres Zugriffsrecht zulassen → Compilerfehler.",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 12
      }
    },
    {
      "id": "fc-gp2-aki-4",
      "chapterId": "gp2-aki",
      "examRelevant": true,
      "front": "Die drei Beziehungen zwischen Klassen (LV 3)?",
      "back": "hat ein: Objektreferenz als Instanzvariable („Student hat einen Namen“)\nist ein: Erben von Oberklasse („WI-Student ist ein Student“)\nverhält sich wie: Interface implementieren („Tisch verhält sich wie ein schwerer Gegenstand“)",
      "source": {
        "title": "GP2 LV 3: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/files/GP2 LV 3.pdf",
        "page": 16
      }
    },
    {
      "id": "fc-gp2-aki-5",
      "chapterId": "gp2-aki",
      "examRelevant": true,
      "front": "Was ist dynamisches Binden?",
      "back": "Erst zur Laufzeit wird entschieden, welche Implementierung einer (überschriebenen/implementierten) Methode ausgeführt wird – die der tatsächlichen Objektklasse, nicht die des Variablentyps. Grundlage der Polymorphie.",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 11
      }
    },
    {
      "id": "fc-gp2-aki-6",
      "chapterId": "gp2-aki",
      "examRelevant": false,
      "front": "Gibt es `abstract static`-Methoden oder abstrakte Attribute?",
      "back": "Nein. Klassenmethoden werden direkt aufgerufen → `abstract static` ist ein Compilerfehler. Abstrakte Attribute gibt es nicht.",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 6
      }
    },
    {
      "id": "fc-gp2-aki-7",
      "chapterId": "gp2-aki",
      "examRelevant": false,
      "front": "Was ist eine default-Methode in einem Interface?",
      "back": "Ausprogrammierte Instanzmethode im Interface (Schlüsselwort default), z. B. `getDefaultFarbe()` in IFigur. Musterimplementierung, die implementierende Klassen überschreiben dürfen. Darf die abstrakten Methoden des Interfaces aufrufen.",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 9
      }
    },
    {
      "id": "fc-gp2-3",
      "chapterId": "gp2-lambda",
      "examRelevant": true,
      "front": "Was ist ein funktionales Interface? Nenne Beispiele.",
      "back": "Interface mit genau EINER abstrakten Instanzmethode, die nicht schon in Object definiert ist.\nBeispiele: Comparator<T> (compare), Comparable<T> (compareTo), Predicate<T> (test), Consumer<T> (accept), EventHandler<T> (handle), Closeable/AutoCloseable (close).",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 14
      }
    },
    {
      "id": "fc-gp2-lam-1",
      "chapterId": "gp2-lambda",
      "examRelevant": true,
      "front": "Wann nimmt man (LV 3) eine anonyme Klasse, wann einen Lambda-Ausdruck?",
      "back": "Anonyme Klasse: abgeleitete Klasse nötig, nur ein Objekt, kein Konstruktor.\nLambda: zusätzlich muss nur EINE Methode implementiert werden, deren Ergebnis zählt („Funktion ohne Namen in einer Klasse ohne Namen“).",
      "source": {
        "title": "GP2 LV 3: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/files/GP2 LV 3.pdf",
        "page": 27
      }
    },
    {
      "id": "fc-gp2-lam-2",
      "chapterId": "gp2-lambda",
      "examRelevant": true,
      "front": "Welche Kurzformen erlaubt die Lambda-Syntax?",
      "back": "Parametertypen weglassen (Compiler leitet sie ab); bei genau einem Parameter Klammern weglassen; bei einem einzigen Ausdruck oder void-Aufruf { } und return weglassen.\n`(IFigur o1, IFigur o2) -> { return …; }` ≙ `(o1, o2) -> …`",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 21
      }
    },
    {
      "id": "fc-gp2-lam-3",
      "chapterId": "gp2-lambda",
      "examRelevant": true,
      "front": "Comparable vs. Comparator?",
      "back": "Comparable<T>: `int compareTo(T o)` IN der Klasse → natürliche Ordnung, `Arrays.sort(arr)`.\nComparator<T>: `int compare(T o1, T o2)` EXTERN → beliebig viele Sortierkriterien, `Arrays.sort(arr, comp)` / `liste.sort(comp)` (Strategie-Pattern).",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 14
      }
    },
    {
      "id": "fc-gp2-lam-4",
      "chapterId": "gp2-lambda",
      "examRelevant": true,
      "front": "Was bedeutet der Rückgabewert von `compare(a, b)` bzw. `a.compareTo(b)`?",
      "back": "< 0: a kommt vor b\n= 0: gleichrangig\n> 0: a kommt nach b\nBeispiel Strings: \"Apfel\".compareTo(\"Zebra\") < 0.",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 14
      }
    },
    {
      "id": "fc-gp2-lam-5",
      "chapterId": "gp2-lambda",
      "examRelevant": true,
      "front": "Predicate<T> und Consumer<T> – Methode und Zweck?",
      "back": "Predicate<T>: `boolean test(T t)` → Auswahlkriterium (filtern, removeIf).\nConsumer<T>: `void accept(T t)` → Aktion auf einem Element ausführen.\nBeispiel `runSelektiv(f -> f instanceof Kreis, f -> ((Kreis) f).radiusIncrease(0.5))`.",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 25
      }
    },
    {
      "id": "fc-gp2-lam-6",
      "chapterId": "gp2-lambda",
      "examRelevant": true,
      "front": "Welche Arten innerer Klassen gibt es (LV 3)?",
      "back": "Statische innere Klasse (wie Klassenvariable, new Aussen.Innen()).\nNicht-statische innere Klasse (braucht Objekt der äußeren Klasse, Zugriff auf deren Objektvariablen).\nLokale Klasse (in einem Anweisungsblock), Spezialfall anonyme Klasse.",
      "source": {
        "title": "GP2 LV 3: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/files/GP2 LV 3.pdf",
        "page": 19
      }
    },
    {
      "id": "fc-gp2-lam-7",
      "chapterId": "gp2-lambda",
      "examRelevant": true,
      "front": "Warum ist `(o1, o2) -> (int) (o1.getFlaeche() - o2.getFlaeche())` als Comparator riskant?",
      "back": "Differenzen zwischen -1 und 1 (z. B. 1.7 − 1.2 = 0.5) werden durch den int-Cast zu 0 → Objekte gelten als gleich und werden nicht sortiert. Sicher: `Double.compare(o1.getFlaeche(), o2.getFlaeche())`. [Hinweis: Double.compare ist Java-API, nicht im Skript.]",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 19
      }
    },
    {
      "id": "fc-gp2-4",
      "chapterId": "gp2-jcf",
      "examRelevant": true,
      "front": "Erbt `Map<K,V>` im Java Collections Framework vom Interface `Collection<E>`?",
      "back": "NEIN. Collection<E> und Map<K,V> sind die zwei getrennten Hauptinterfaces des Frameworks (java.util). Map verwaltet Schlüssel-Wert-Paare.",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 4
      }
    },
    {
      "id": "fc-gp2-5",
      "chapterId": "gp2-jcf",
      "examRelevant": true,
      "front": "`Integer i = new Integer(123); Integer k = new Integer(123);` – was liefern `i == k` und `i.equals(k)`?",
      "back": "`i == k` → false (zwei verschiedene Objekte, verschiedene Referenzen)\n`i.equals(k)` → true (gleicher Wert)\nWie bei Strings: Hüllklassen-Objekte immer mit equals vergleichen. Der Konstruktor ist deprecated – Autoboxing verwenden.",
      "source": {
        "title": "GP2 LV 4: Collections Framework",
        "path": "moodle-data/gdp2/files/GP2 LV 4.pdf",
        "page": 7
      }
    },
    {
      "id": "fc-gp2-jcf-1",
      "chapterId": "gp2-jcf",
      "examRelevant": true,
      "front": "ArrayList vs. LinkedList (JCF)?",
      "back": "ArrayList: speichert in einem Array (dynamisch vergrößert) → weniger Speicher, schneller Indexzugriff.\nLinkedList: doppelt verkettete Liste → add/remove schneller; implementiert zusätzlich Queue/Deque.",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 21
      }
    },
    {
      "id": "fc-gp2-jcf-2",
      "chapterId": "gp2-jcf",
      "examRelevant": true,
      "front": "Was liefert `set.add(p)` zweimal hintereinander bei einem HashSet?",
      "back": "Erst true, dann false – ein Set lässt keine Duplikate zu. Bei ArrayList/LinkedList klappt add immer (Duplikate erlaubt).",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 8
      }
    },
    {
      "id": "fc-gp2-jcf-3",
      "chapterId": "gp2-jcf",
      "examRelevant": true,
      "front": "Warum `List<Integer>` und nicht `List<int>`?",
      "back": "Typparameter müssen Referenztypen sein. Primitive Typen werden über Hüllklassen (Integer, Double, Character, Boolean …) gespeichert; `li.add(15)` nutzt Autoboxing ≙ `li.add(Integer.valueOf(15))`.",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 23
      }
    },
    {
      "id": "fc-gp2-jcf-4",
      "chapterId": "gp2-jcf",
      "examRelevant": true,
      "front": "Wichtige Methoden von Map<K,V>?",
      "back": "`put(k, v)` (überschreibt bestehenden Wert), `get(k)` (null wenn fehlt), `containsKey(k)`, `remove(k)`, `keySet()` (Keys als Set), `values()` (Werte als Collection), `size()`.",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 17
      }
    },
    {
      "id": "fc-gp2-jcf-5",
      "chapterId": "gp2-jcf",
      "examRelevant": true,
      "front": "Wie durchläuft man eine Collection mit einem Iterator?",
      "back": "`Iterator<Person> it = liste.iterator();`\n`while (it.hasNext()) { Person p = it.next(); … }`\n`it.remove()` entfernt das zuletzt gelieferte Element sicher.",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 11
      }
    },
    {
      "id": "fc-gp2-jcf-6",
      "chapterId": "gp2-jcf",
      "examRelevant": true,
      "front": "Ist `LinkedList<Kunde>` ein Untertyp von `LinkedList<Person>` (Kunde extends Person)?",
      "back": "Nein (Typsicherheit). `Collection<Person> p = kundenListe;` → Compilerfehler „incompatible types“. Flexibilität über Wildcards: `addAll(Collection<? extends E>)`, `removeIf(Predicate<? super E>)`.",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 24
      }
    },
    {
      "id": "fc-gp2-jcf-7",
      "chapterId": "gp2-jcf",
      "examRelevant": false,
      "front": "Was bedeutet „optional operation“ in der Collection-Doku?",
      "back": "Die implementierende Klasse darf die Methode (z. B. add/remove) mit einer UnsupportedOperationException „implementieren“ → unveränderbare Collections.",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 6
      }
    },
    {
      "id": "fc-gp2-jcf-8",
      "chapterId": "gp2-jcf",
      "examRelevant": false,
      "front": "ArrayList vs. Vector?",
      "back": "Funktional fast gleich; Vector ist synchronisiert (thread-sicher). Empfehlung: ArrayList, außer Thread-Sicherheit ist wesentlich.",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 27
      }
    },
    {
      "id": "fc-gp2-jcf-9",
      "chapterId": "gp2-jcf",
      "examRelevant": true,
      "front": "Wie entfernt man in einer Zeile alle Elemente, die eine Bedingung erfüllen?",
      "back": "`liste.removeIf(p -> p.getName().charAt(0) < 'G');` – Parameter ist ein Predicate<? super E>.",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 14
      }
    },
    {
      "id": "fc-gp2-6",
      "chapterId": "gp2-javafx",
      "examRelevant": true,
      "front": "Wie ist eine JavaFX-Anwendung aufgebaut (Theater-Metapher)?",
      "back": "Klasse extends Application, überschreibt start(Stage primaryStage); main ruft launch(args).\nStage = Bühne/Fenster, Scene = Szene/Inhalt, Scene Graph = Baum aus Node-Objekten (Layout = Inszenierung, Controls = Schauspieler).",
      "source": {
        "title": "LE FXG: Grundlagen von JavaFX",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
        "page": 11
      }
    },
    {
      "id": "fc-gp2-fx-1",
      "chapterId": "gp2-javafx",
      "examRelevant": true,
      "front": "Was braucht der Konstruktor `new Scene(…)` mindestens?",
      "back": "Ein `Parent`-Objekt als Wurzel des Scene Graph (abstrakte Klasse; direkte Unterklassen Group, Region, WebView). Layouts wie GridPane sind Region-Unterklassen.",
      "source": {
        "title": "LE FXG: Grundlagen von JavaFX",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
        "page": 15
      }
    },
    {
      "id": "fc-gp2-fx-2",
      "chapterId": "gp2-javafx",
      "examRelevant": true,
      "front": "Was bewirkt `grid.add(button, 2, 3)` bzw. `grid.add(text, 0, 0, 2, 1)`?",
      "back": "button in Spalte 2, Zeile 3.\ntext in Spalte 0, Zeile 0, erstreckt sich über 2 Spalten und 1 Zeile.\n(Reihenfolge: Spalte vor Zeile!)",
      "source": {
        "title": "LE FXG: Grundlagen von JavaFX",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
        "page": 17
      }
    },
    {
      "id": "fc-gp2-fx-3",
      "chapterId": "gp2-javafx",
      "examRelevant": true,
      "front": "Die 6 Layout-Klassen aus LV 5 und ihre Strategie?",
      "back": "HBox: nebeneinander\nVBox: untereinander\nStackPane: übereinander gestapelt\nGridPane: Tabelle (Spalte/Zeile)\nBorderPane: Zentrum + 4 Ränder (top/bottom/left/right)\nScrollPane: Ausschnitt mit Scrollbars (ein Kind)",
      "source": {
        "title": "GP2 LV 5: JavaFX Aufbau",
        "path": "moodle-data/gdp2/files/GP2 LV 5.pdf",
        "page": 24
      }
    },
    {
      "id": "fc-gp2-fx-4",
      "chapterId": "gp2-javafx",
      "examRelevant": true,
      "front": "Wie fügt man Kinder zu VBox/HBox/StackPane hinzu, wie zu ScrollPane?",
      "back": "VBox/HBox/StackPane: `getChildren().add(node)` / `getChildren().addAll(a, b, c)` (Reihenfolge = Anzeige-Reihenfolge).\nScrollPane: nur EIN Kind über `setContent(node)` – deshalb z. B. eine VBox hineinlegen.",
      "source": {
        "title": "LE FXG: Grundlagen von JavaFX",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
        "page": 33
      }
    },
    {
      "id": "fc-gp2-fx-5",
      "chapterId": "gp2-javafx",
      "examRelevant": true,
      "front": "Wie öffnet man ein modales Dialogfenster?",
      "back": "`Stage second = new Stage();`\n`second.setScene(new Scene(root2, 300, 300));`\n`second.initOwner(primaryStage);`\n`second.initModality(Modality.WINDOW_MODAL);`\n`second.show();` → Hauptfenster erst nach Schließen bedienbar.",
      "source": {
        "title": "LE FXG: Grundlagen von JavaFX",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
        "page": 14
      }
    },
    {
      "id": "fc-gp2-fx-6",
      "chapterId": "gp2-javafx",
      "examRelevant": true,
      "front": "TextField vs. TextArea vs. PasswordField?",
      "back": "TextField: einzeilige Eingabe (Name …).\nTextArea: mehrzeilig (setPrefRowCount/ColumnCount).\nPasswordField: verdeckte Eingabe, setPromptText für Platzhalter. Tooltip über setTooltip an Controls hängen.",
      "source": {
        "title": "LE FXG: Grundlagen von JavaFX",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
        "page": 30
      }
    },
    {
      "id": "fc-gp2-fx-7",
      "chapterId": "gp2-javafx",
      "examRelevant": false,
      "front": "RadioButton vs. CheckBox?",
      "back": "RadioButtons in einer ToggleGroup: nur EINER kann gewählt sein.\nCheckBoxen: beliebig viele gleichzeitig wählbar. Weitere Controls: ComboBox<T> (Auswahlliste), DatePicker, ColorPicker.",
      "source": {
        "title": "LE FXG: Grundlagen von JavaFX",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
        "page": 37
      }
    },
    {
      "id": "fc-gp2-fx-8",
      "chapterId": "gp2-javafx",
      "examRelevant": true,
      "front": "Warum sind GUI-Programme schwieriger als Konsolenprogramme (LV 5)?",
      "back": "Bei der GUI gibt der Benutzer den Kontrollfluss vor: Ereignisse kommen in beliebiger, auch unsinniger Reihenfolge („3“, „4“, „+“, „=“). Das Programm muss jede Reihenfolge behandeln.",
      "source": {
        "title": "GP2 LV 5: JavaFX Aufbau",
        "path": "moodle-data/gdp2/files/GP2 LV 5.pdf",
        "page": 6
      }
    },
    {
      "id": "fc-gp2-7",
      "chapterId": "gp2-fx-events",
      "examRelevant": true,
      "front": "Unterschied zwischen `bind()` und `bindBidirectional()` in JavaFX?",
      "back": "`a.bind(b)`: unidirektional – a übernimmt jede Änderung von b (a dann nicht mehr per Setter ändern).\n`a.bindBidirectional(b)`: Änderungen werden in BEIDE Richtungen gespiegelt. Lösen mit unbind/unbindBidirectional.",
      "source": {
        "title": "LE FXE: Ereignisbehandlung und Binding",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
        "page": 11
      }
    },
    {
      "id": "fc-gp2-ev-1",
      "chapterId": "gp2-fx-events",
      "examRelevant": true,
      "front": "Welches Interface erwartet `setOnAction` und wie heißt seine Methode?",
      "back": "`EventHandler<ActionEvent>` – funktionales Interface aus javafx.event mit `void handle(T event)`; T extends Event. Implementierbar als eigene Klasse, anonyme Klasse oder Lambda.",
      "source": {
        "title": "LE FXE: Ereignisbehandlung und Binding",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
        "page": 5
      }
    },
    {
      "id": "fc-gp2-ev-2",
      "chapterId": "gp2-fx-events",
      "examRelevant": true,
      "front": "Wann löst `setOnAction` bei Button, TextField und MenuItem aus?",
      "back": "Button (ButtonBase): beim Klicken.\nTextField: beim Drücken der Enter-Taste.\nMenuItem: beim Auswählen des Menüpunkts.",
      "source": {
        "title": "LE FXE: Ereignisbehandlung und Binding",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
        "page": 9
      }
    },
    {
      "id": "fc-gp2-ev-3",
      "chapterId": "gp2-fx-events",
      "examRelevant": true,
      "front": "Welche Namenskonvention haben JavaFX-Properties (Beispiel text)?",
      "back": "`String getText()`, `void setText(String)`, `StringProperty textProperty()` (liefert das Property-Objekt für bind/addListener).",
      "source": {
        "title": "LE FXE: Ereignisbehandlung und Binding",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
        "page": 12
      }
    },
    {
      "id": "fc-gp2-ev-4",
      "chapterId": "gp2-fx-events",
      "examRelevant": true,
      "front": "Aufgaben von Model, View und Controller (LV 5)?",
      "back": "Model: kapselt Daten, speichert Zustand, benachrichtigt View.\nView: Ansicht des Model, übermittelt Benutzeraktionen an Controller.\nController: übersetzt Benutzeraktionen in Model-Aktualisierungen, wählt View.",
      "source": {
        "title": "GP2 LV 5: JavaFX Aufbau",
        "path": "moodle-data/gdp2/files/GP2 LV 5.pdf",
        "page": 14
      }
    },
    {
      "id": "fc-gp2-ev-5",
      "chapterId": "gp2-fx-events",
      "examRelevant": true,
      "front": "Vor- und Nachteil von MVC?",
      "back": "Vorteil: Daten können unabhängig von der Darstellung gepflegt/verschieden dargestellt werden.\nNachteil: höherer Programmieraufwand, besonders bei einfachen Anwendungen.",
      "source": {
        "title": "GP2 LV 5: JavaFX Aufbau",
        "path": "moodle-data/gdp2/files/GP2 LV 5.pdf",
        "page": 15
      }
    },
    {
      "id": "fc-gp2-ev-6",
      "chapterId": "gp2-fx-events",
      "examRelevant": true,
      "front": "Wie ist ein Controller im Hotel-Beispiel (FXE) gebaut?",
      "back": "Eigene Klasse im Paket controller, `implements EventHandler<ActionEvent>`. Bekommt über Konstruktor-Attribute alles Nötige (Stage, Hotel, Label …). In handle: Eingabe prüfen (1–5), Model aktualisieren, Anzeige aktualisieren, Fenster schließen; bei Fehler Prompt rot färben.\nRegistrierung: `submit.setOnAction(new NewRatingController(…));`",
      "source": {
        "title": "LE FXE: Ereignisbehandlung und Binding",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
        "page": 24
      }
    },
    {
      "id": "fc-gp2-ev-7",
      "chapterId": "gp2-fx-events",
      "examRelevant": true,
      "front": "Warum sollte das Model keine JavaFX-Klassen (z. B. FXCollections) verwenden?",
      "back": "Dann wäre auch die Logik von der JavaFX-Bibliothek abhängig (nicht Teil der normalen Java-Umgebung). Ohne JavaFX im Model kann es mit einer anderen Oberfläche wiederverwendet werden.",
      "source": {
        "title": "LE FXE: Ereignisbehandlung und Binding",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
        "page": 13
      }
    },
    {
      "id": "fc-gp2-ev-8",
      "chapterId": "gp2-fx-events",
      "examRelevant": false,
      "front": "Binding vs. Ereignis beim Slider-Beispiel?",
      "back": "SliderCircle: `c.scaleXProperty().bind(slider.valueProperty())` → Kreis skaliert kontinuierlich (evtl. Performance-Problem).\nSlideCircleEvent: `slider.setOnMouseReleased(e -> c.setScaleX(slider.getValue()))` → erst beim Loslassen.",
      "source": {
        "title": "LE FXE: Ereignisbehandlung und Binding",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
        "page": 15
      }
    },
    {
      "id": "fc-gp2-2d-1",
      "chapterId": "gp2-fx2d",
      "examRelevant": false,
      "front": "Wo liegt der Ursprung des JavaFX-Koordinatensystems?",
      "back": "(0|0) in der linken oberen Ecke. x wächst nach rechts, y nach UNTEN.",
      "source": {
        "title": "LE FX2: 2D-Grafik mit JavaFX",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FX2-2DGrafikJavaFX.pdf",
        "page": 3
      }
    },
    {
      "id": "fc-gp2-2d-2",
      "chapterId": "gp2-fx2d",
      "examRelevant": false,
      "front": "Was bedeuten die Parameter von `new Rectangle(40, 60, 200, 40)`?",
      "back": "x = 40, y = 60 (linke obere Ecke), Breite 200, Höhe 40 Pixel. Ecken runden: setArcWidth/setArcHeight.",
      "source": {
        "title": "LE FX2: 2D-Grafik mit JavaFX",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FX2-2DGrafikJavaFX.pdf",
        "page": 11
      }
    },
    {
      "id": "fc-gp2-2d-3",
      "chapterId": "gp2-fx2d",
      "examRelevant": false,
      "front": "Wertebereiche bei `Color.rgb(r, g, b, opacity)`?",
      "back": "r, g, b: 0–255 (int); opacity: 0.0–1.0 – je kleiner, desto transparenter. `new Color(r, g, b, opacity)` erwartet dagegen alle Werte 0–1.",
      "source": {
        "title": "LE FX2: 2D-Grafik mit JavaFX",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FX2-2DGrafikJavaFX.pdf",
        "page": 10
      }
    },
    {
      "id": "fc-gp2-8",
      "chapterId": "gp2-xml",
      "examRelevant": true,
      "front": "Wann verwendet man einen DOM-Parser vs. einen SAX-Parser für XML in Java?",
      "back": "DOM: liest das ganze Dokument als Baum in den Speicher → wiederholter Zugriff und Ändern möglich, aber mehr Speicher/langsamer.\nSAX: sequentiell, ereignisgesteuert, schnell, wenig Speicher – für einmalige Verarbeitung; kein Rückgriff auf bereits Geparstes.",
      "source": {
        "title": "LE JML: Java und XML",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
        "page": 32
      }
    },
    {
      "id": "fc-gp2-xml-1",
      "chapterId": "gp2-xml",
      "examRelevant": true,
      "front": "Wohlgeformt vs. gültig?",
      "back": "Wohlgeformt: alle XML-Syntaxregeln eingehalten (prüft jeder Parser).\nGültig: zusätzlich entsprechen Elemente und Struktur einer DTD oder einem XML-Schema (validierender Parser).",
      "source": {
        "title": "LE JML: Java und XML",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
        "page": 18
      }
    },
    {
      "id": "fc-gp2-xml-2",
      "chapterId": "gp2-xml",
      "examRelevant": true,
      "front": "Nenne 5 XML-Syntaxregeln.",
      "back": "Genau ein Wurzelelement; jedes Element wird geschlossen; korrekt verschachtelt (umgekehrt schließen); Groß-/Kleinschreibung zählt; Attributwerte in Anführungszeichen, jedes Attribut nur einmal pro Element; leere Elemente <x/>; Prolog am Anfang.",
      "source": {
        "title": "LE JML: Java und XML",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
        "page": 17
      }
    },
    {
      "id": "fc-gp2-xml-3",
      "chapterId": "gp2-xml",
      "examRelevant": true,
      "front": "DTD-Operatoren `?`, `*`, `+`, `,`, `|`?",
      "back": "? optional (0 oder 1)\n* beliebig oft (0..n)\n+ mindestens einmal (1..n)\n, Sequenz\n| Auswahl (oder)\n#PCDATA = Textinhalt",
      "source": {
        "title": "LE JML: Java und XML",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
        "page": 28
      }
    },
    {
      "id": "fc-gp2-xml-4",
      "chapterId": "gp2-xml",
      "examRelevant": true,
      "front": "Schritte zum Einlesen einer XML-Datei mit DOM?",
      "back": "1) `DocumentBuilderFactory.newInstance()`\n2) `factory.newDocumentBuilder()`\n3) `builder.parse(new File(name))` → Document\n4) `doc.getDocumentElement()` / `getElementsByTagName(…)` und rekursiv/iterativ über NodeList (`item(i)`, `getLength()`) traversieren.",
      "source": {
        "title": "LE JML: Java und XML",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
        "page": 38
      }
    },
    {
      "id": "fc-gp2-xml-5",
      "chapterId": "gp2-xml",
      "examRelevant": true,
      "front": "Wie speichert man ein DOM-Document in einer Datei?",
      "back": "`TransformerFactory.newInstance()` → `newTransformer()` → `transform(new DOMSource(doc), new StreamResult(new File(name)))`.",
      "source": {
        "title": "LE JML: Java und XML",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
        "page": 41
      }
    },
    {
      "id": "fc-gp2-xml-6",
      "chapterId": "gp2-xml",
      "examRelevant": true,
      "front": "Welche Methoden erzeugen/ändern DOM-Inhalte?",
      "back": "Document: `newDocument()` (über Builder), `createElement(tag)`, `createTextNode(text)`.\nElement: `appendChild(node)`, `setAttribute(name, wert)`, `replaceChild(neu, alt)`, `removeChild(alt)`, `removeAttribute(name)`.",
      "source": {
        "title": "LE JML: Java und XML",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
        "page": 45
      }
    },
    {
      "id": "fc-gp2-xml-7",
      "chapterId": "gp2-xml",
      "examRelevant": false,
      "front": "Wie schreibt man `<`, `>`, `&`, `\"` und `'` als XML-Inhalt?",
      "back": "&lt;  &gt;  &amp;  &quot;  &apos;",
      "source": {
        "title": "LE JML: Java und XML",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
        "page": 18
      }
    },
    {
      "id": "fc-gp2-rek-1",
      "chapterId": "gp2-rek-xml-lst",
      "examRelevant": false,
      "front": "Was braucht jede rekursive Methode, damit sie terminiert?",
      "back": "Einen Parameter, dessen Wert sich bei jedem Aufruf verändert, und eine Abbruchbedingung im Rumpf, die ihn prüft. Sonst wächst der Laufzeitstack bis zum StackOverflowError.",
      "source": {
        "title": "LE REK: Rekursion",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_REK-Rekursion.pdf",
        "page": 5
      }
    },
    {
      "id": "fc-gp2-rek-2",
      "chapterId": "gp2-rek-xml-lst",
      "examRelevant": false,
      "front": "Direkte vs. indirekte Rekursion?",
      "back": "Direkt: Methode ruft sich selbst auf.\nIndirekt: Methode A ruft B auf, B ruft (direkt oder indirekt) wieder A auf.",
      "source": {
        "title": "LE REK: Rekursion",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_REK-Rekursion.pdf",
        "page": 4
      }
    },
    {
      "id": "fc-gp2-rek-3",
      "chapterId": "gp2-rek-xml-lst",
      "examRelevant": false,
      "front": "Wie viele Züge brauchen die Türme von Hanoi mit n Scheiben?",
      "back": "2^n − 1 (2 → 3, 3 → 7, 4 → 15, 64 → ca. 1,8 · 10^19).",
      "source": {
        "title": "LE REK: Rekursion",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_REK-Rekursion.pdf",
        "page": 17
      }
    },
    {
      "id": "fc-gp2-rek-4",
      "chapterId": "gp2-rek-xml-lst",
      "examRelevant": false,
      "front": "Stapel vs. Warteschlange?",
      "back": "Stapel (Stack): LIFO – push/pop an der Spitze (top).\nWarteschlange (Queue): FIFO – enqueue am Ende (tail), dequeue am Anfang (head).",
      "source": {
        "title": "LE LST: Listen",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_LST-Listen.pdf",
        "page": 63
      }
    },
    {
      "id": "fc-gp2-rek-5",
      "chapterId": "gp2-rek-xml-lst",
      "examRelevant": false,
      "front": "Aus was besteht ein Knoten einer einfach verketteten Liste?",
      "back": "Aus einer Referenz auf das gespeicherte Element und einer Referenz `next` auf den Nachfolger (beim letzten Knoten null). Der Anker `head` zeigt auf den ersten Knoten. Doppelt verkettet: zusätzlich Vorgänger-Referenz.",
      "source": {
        "title": "LE LST: Listen",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_LST-Listen.pdf",
        "page": 30
      }
    },
    {
      "id": "fc-gp2-rek-6",
      "chapterId": "gp2-rek-xml-lst",
      "examRelevant": false,
      "front": "Vor- und Nachteile von Rekursion gegenüber Iteration?",
      "back": "Vorteile: natürlicher, klarer, kürzer, Korrektheit leichter prüfbar.\nNachteile: mehr Speicher (jeder Aufruf neuer Stack-Bereich), bei großer Rekursionstiefe stark steigende Laufzeit.",
      "source": {
        "title": "LE REK: Rekursion",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_REK-Rekursion.pdf",
        "page": 10
      }
    }
  ],
  "quizzes": [
    {
      "id": "q-gp2-ka-export",
      "chapterId": "gp2-ka",
      "examStyle": "KA-Abgabe (K.-o.)",
      "question": "Wie reichst du die GP2-Kursarbeit korrekt ein?",
      "options": [
        "Eclipse: Export → General → Archive File, nur src wählen, als GP2_Eclipse.zip hochladen",
        "Workspace-Ordner im Datei-Explorer zippen und hochladen",
        "Ausführbare JAR-Datei exportieren und hochladen",
        "Link auf ein öffentliches Git-Repository abgeben"
      ],
      "answer": 0,
      "explanation": "Laut Export-Anleitung muss ein exportiertes Eclipse-Projekt (Archive File, nur src) mit Namen GP2_Eclipse.zip eingereicht werden. Ein einfaches Zip der Ordner ist kein exportiertes Projekt → „nicht ausreichend“. Git-Artefakte sind zudem unzulässig.",
      "source": {
        "title": "Anleitung Export Eclipse-Projekt",
        "path": "moodle-data/gdp2/files/Anleitung Export Eclipse-Projekt.pdf",
        "page": 1
      }
    },
    {
      "id": "q-gp2-ka-artefakte",
      "chapterId": "gp2-ka",
      "examStyle": "KA-Abgabe (K.-o.)",
      "question": "Dein Projektordner enthält `.idea/`, `pom.xml` und `.git/`. Was ist die Folge laut Abgabemodalitäten?",
      "options": [
        "Kein Problem, die Dateien werden ignoriert",
        "Nur Punktabzug für Unordnung",
        "Das Projekt wird ohne weitere Durchsicht abgewiesen – Artefakte anderer Tools sind unzulässig",
        "Nur .git ist verboten, Maven ist erlaubt"
      ],
      "answer": 2,
      "explanation": "Artefakte von JetBrains, Maven, Gradle, Ant oder Git → „wird das Projekt ohne weitere Durchsicht abgewiesen“ (FA-Regeln); LV 1 nennt „keine Artefakte von anderen Tools“ ausdrücklich für FA und KA.",
      "source": {
        "title": "Moodle-Kursseite GP2 (FA-/KA-Regeln)",
        "path": "moodle-data/gdp2/course.html"
      }
    },
    {
      "id": "q-gp2-ka-exc",
      "chapterId": "gp2-ka",
      "examStyle": "KA-Code-Regeln",
      "question": "Welche Variante entspricht den Kursregeln zum Exception-Handling beim Laden einer Datei?",
      "options": [
        "public static void main(String[] args) throws Exception { dao.laden(); }",
        "try { dao.laden(); } catch (Exception e) { }",
        "dao.laden(); // IOException wird von Java automatisch behandelt",
        "try { dao.laden(); } catch (IOException e) { zeigeFehler(e.getMessage()); }"
      ],
      "answer": 3,
      "explanation": "Gewünscht ist spezifische Behandlung (catch IOException) mit sinnvoller Reaktion. catch (Exception e) und main() throws Exception sind ausdrücklich unerwünscht; ohne Behandlung kompiliert eine checked IOException gar nicht.",
      "source": {
        "title": "Moodle-Kursseite GP2 (FA-/KA-Regeln)",
        "path": "moodle-data/gdp2/course.html"
      }
    },
    {
      "id": "q-gp2-ka-frist",
      "chapterId": "gp2-ka",
      "examStyle": "KA-Organisation",
      "question": "Du bist am 20.12.2026 fertig. Kannst du die Kursarbeit sofort hochladen?",
      "options": [
        "Ja, jederzeit vor dem 08.02.2027",
        "Ja, aber nur zusammen mit FA4",
        "Nein, die Abgabe erfolgt erst beim Peer Review am 05.01.2027",
        "Nein, frühester Abgabetermin ist der 12.01.2027 (nach dem Prüfungsanmeldezeitraum)"
      ],
      "answer": 3,
      "explanation": "Moodle: „Frühester Abgabetermin: 12.01.2027 (nach dem Ende des Prüfungsanmeldezeitraums), Spätester Abgabetermin: 08.02.2027“. Der 05.01. ist nur eine Peer-Review-LV.",
      "source": {
        "title": "Moodle-Kursseite GP2 (FA-/KA-Regeln)",
        "path": "moodle-data/gdp2/course.html"
      }
    },
    {
      "id": "q-gp2-ka-pfad",
      "chapterId": "gp2-ka",
      "examStyle": "KA-Code-Regeln",
      "question": "Welcher Dateipfad ist für die Datendatei deiner KA richtig?",
      "options": [
        "\"data/kunden.txt\" (relativ zum Projekt-Wurzelordner)",
        "\"/Users/max/Desktop/kunden.txt\"",
        "\"C:\\\\Users\\\\Max\\\\Documents\\\\GP2\\\\kunden.txt\"",
        "Der Pfad spielt keine Rolle, Eclipse findet die Datei überall"
      ],
      "answer": 0,
      "explanation": "Relative Pfade werden vom Projekt-Wurzelordner aus aufgelöst und funktionieren auch beim Prüfer. Die Demo warnt ausdrücklich: „Bitte keine absoluten Windows-Pfade … verwenden!“",
      "source": {
        "title": "Demo-Projekt 2_Demo_Persistenz",
        "path": "moodle-data/gdp2/files/2_Demo_Persistenz.zip"
      }
    },
    {
      "id": "q-gp2-ka-jdk",
      "chapterId": "gp2-ka",
      "examStyle": "KA-Umgebung",
      "question": "Nach Installation des JDK findet Eclipse die Klasse javafx.application.Application nicht. Wahrscheinlichste Ursache laut Kursmaterial?",
      "options": [
        "Das Plugin e(fx)clipse fehlt",
        "Es wurde die Standard- statt der Full-Variante des Liberica JDK installiert",
        "JavaFX muss per Maven nachgeladen werden",
        "Das Projekt hat kein module-info.java"
      ],
      "answer": 1,
      "explanation": "Nur das „Full JDK“ von Liberica enthält JavaFX (voreingestellt ist „Standard JDK“). e(fx)clipse wird laut LV 1 nicht benötigt, Maven ist verboten, und module-info.java soll gerade NICHT angelegt werden.",
      "source": {
        "title": "GP2 LV 1: Begrüßung & Wiederholung",
        "path": "moodle-data/gdp2/files/GP2 LV 1.pdf",
        "page": 4
      }
    },
    {
      "id": "q-gp2-ka-mvc",
      "chapterId": "gp2-ka",
      "examStyle": "KA-Architektur",
      "question": "In welches Paket gehört die Klasse, die deine Kundenliste in eine Datei schreibt?",
      "options": [
        "view – dort wird der Speichern-Button angezeigt",
        "In die Klasse, die Application erweitert",
        "model (bzw. eine Persistenz-/DAO-Klasse im Model-Bereich) – unabhängig von der Oberfläche",
        "controller – nur Controller dürfen Dateien öffnen"
      ],
      "answer": 2,
      "explanation": "LV 5: Model-Pakete sind unabhängig von der Benutzungsoberfläche, „z. B. Dateiein-/ausgabe“. Der Controller ruft das DAO nur auf.",
      "source": {
        "title": "GP2 LV 5: JavaFX Aufbau",
        "path": "moodle-data/gdp2/files/GP2 LV 5.pdf",
        "page": 29
      }
    },
    {
      "id": "q-gp2-ka-module",
      "chapterId": "gp2-ka",
      "examStyle": "KA-Umgebung",
      "question": "Eclipse fragt beim Anlegen des Projekts, ob module-info.java erzeugt werden soll. Was ist laut LV 1 richtig?",
      "options": [
        "Ja, JavaFX braucht zwingend ein Modul",
        "Ja, aber nur mit requires javafx.controls",
        "Egal, wird beim Export entfernt",
        "Nein – kein module-info.java file"
      ],
      "answer": 3,
      "explanation": "LV 1, Folie „Neues Java-Projekt erstellen“: „Kein module-info.java file!“ Das Liberica Full JDK stellt JavaFX ohne Modul-Deklaration bereit.",
      "source": {
        "title": "GP2 LV 1: Begrüßung & Wiederholung",
        "path": "moodle-data/gdp2/files/GP2 LV 1.pdf",
        "page": 9
      }
    },
    {
      "id": "q-gp2-ka-doku",
      "chapterId": "gp2-ka",
      "examStyle": "KA-Dokumentation",
      "question": "Welche Aussage zur Dokumentation stimmt laut den Kursvorgaben?",
      "options": [
        "Javadoc-Kommentare für alle public-Elemente sind erwünscht; die Prüfung umfasst Programm UND Dokumentation",
        "Kommentare sind optional, nur das Programm wird bewertet",
        "Javadoc-HTML muss mit dem javadoc-Tool erzeugt und abgegeben werden",
        "Checkstyle-Prüfung ist Pflicht"
      ],
      "answer": 0,
      "explanation": "Prüfungsform „Erstellung und Dokumentation eines Rechnerprogramms“; Abgaberegeln: Javadoc für alle public-Elemente erwünscht, HTML-Erzeugung und Checkstyle nicht erforderlich.",
      "source": {
        "title": "Modulrahmenbedingungen GP2",
        "path": "moodle-data/gdp2/files/Modulrahmenbedingungen.pdf",
        "page": 1
      }
    },
    {
      "id": "q-gp2-ka-crud",
      "chapterId": "gp2-ka",
      "examStyle": "KA-Inhalt",
      "question": "Welche Funktion gehört laut FA3-Bezug („Benutzeroberfläche und CRUD“) NICHT zum CRUD-Umfang?",
      "options": [
        "Neuen Datensatz anlegen",
        "Programm automatisch als JAR veröffentlichen",
        "Datensatz ändern",
        "Datensätze anzeigen/suchen"
      ],
      "answer": 1,
      "explanation": "CRUD = Create, Read, Update, Delete. Veröffentlichung/Deployment gehört nicht dazu (und eine JAR ist auch nicht das geforderte Abgabeformat).",
      "source": {
        "title": "Moodle-Kursseite GP2 (FA-/KA-Regeln)",
        "path": "moodle-data/gdp2/course.html"
      }
    },
    {
      "id": "q-gp2-eip-schaltjahr",
      "chapterId": "gp2-eip",
      "examStyle": "Code-Tracing (Demo Datum)",
      "question": "Was gibt das Programm aus?",
      "code": "Datum d1 = new Datum(29, 2, 2028);\nif (d1.istGueltig()) d1.print();\nelse System.out.println(\"Ungültiges Datum\");\nDatum d2 = new Datum(29, 2, 1900);\nSystem.out.println(d2.istGueltig());",
      "options": [
        "29.2.2028 und true",
        "Ungültiges Datum und false",
        "29.2.2028 und false",
        "IllegalArgumentException"
      ],
      "answer": 2,
      "explanation": "2028 ist durch 4, nicht durch 100 teilbar → Schaltjahr, Februar hat 29 Tage → gültig, print() gibt 29.2.2028 aus. 1900 ist durch 100, aber nicht durch 400 teilbar → kein Schaltjahr → false. Der Konstruktor wirft nur bei tag>31, monat>12 oder jahr<1582.",
      "source": {
        "title": "Demo-Projekt 1_Demo_Datum",
        "path": "moodle-data/gdp2/files/1_Demo_Datum.zip"
      }
    },
    {
      "id": "q-gp2-eip-super",
      "chapterId": "gp2-eip",
      "examStyle": "Fehler finden",
      "question": "Datum hat nur den Konstruktor Datum(int tag, int monat, int jahr). Was passiert beim Kompilieren?",
      "code": "public class Zeitpunkt extends Datum {\n  private int std;\n  public Zeitpunkt(int tag, int monat, int jahr, int std) {\n    this.std = std;\n  }\n}",
      "options": [
        "Kompiliert, tag/monat/jahr bleiben 0",
        "Kompiliert, weil protected-Attribute automatisch gesetzt werden",
        "Laufzeitfehler IllegalArgumentException",
        "Compilerfehler: impliziter Aufruf super() findet keinen parameterlosen Konstruktor in Datum"
      ],
      "answer": 3,
      "explanation": "Ohne expliziten super(...)-Aufruf fügt der Compiler super() ein. Datum hat aber keinen parameterlosen Konstruktor → Compilerfehler. Lösung (Demo): super(tag, monat, jahr); als erste Anweisung.",
      "source": {
        "title": "Demo-Projekt 1_Demo_Datum",
        "path": "moodle-data/gdp2/files/1_Demo_Datum.zip"
      }
    },
    {
      "id": "q-gp2-eip-junit",
      "chapterId": "gp2-eip",
      "examStyle": "Verständnis",
      "question": "Welche Methode ist eine korrekte JUnit-5-Testmethode?",
      "options": [
        "@Test public void testSumme() { assertEquals(6, Util.summe(new int[]{1, 2, 3})); }",
        "@Test public int testSumme() { return 6; }",
        "public void testSumme(int erwartet) { assertEquals(erwartet, 6); }",
        "@Test private static void testSumme() { }"
      ],
      "answer": 0,
      "explanation": "Testmethoden sind mit @Test annotiert, public void und ohne Parameter; geprüft wird mit Assert-Methoden wie assertEquals(erwartet, tatsächlich).",
      "source": {
        "title": "LE EIP: Einstieg in Programmieren II",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_EIP-EinstiegInProgrammieren2.pdf",
        "page": 47
      }
    },
    {
      "id": "q-gp2-stream",
      "chapterId": "gp2-streams",
      "examStyle": "Streams & Ressourcen",
      "question": "Warum verwendet man `BufferedReader` um einen `FileReader` herum?",
      "options": [
        "Weil FileReader keine Textdateien öffnen kann",
        "Um Lesezugriffe zu puffern und komfortabel ganze Zeilen mit `readLine()` zu lesen",
        "Um Binärdateien automatisch zu entschlüsseln",
        "Weil try-catch nur mit BufferedReader funktioniert"
      ],
      "answer": 1,
      "explanation": "BufferedReader liest mehrere Zeichen auf einmal in einen internen Puffer (weniger Plattenzugriffe) und kann vollständige Zeilen zurückgeben (readLine). FileReader selbst liefert nur einzelne Zeichen.",
      "source": {
        "title": "GP2 LV 2: Dateien und Datenströme",
        "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
        "page": 15
      }
    },
    {
      "id": "q-gp2-dud-flush",
      "chapterId": "gp2-streams",
      "examStyle": "Fehler finden (Persistenz)",
      "question": "Die Datei data/a.txt ist nach dem Programmlauf leer (0 Bytes). Warum?",
      "code": "try {\n  PrintWriter out = new PrintWriter(new BufferedWriter(\n      new FileWriter(\"data/a.txt\", StandardCharsets.UTF_8)));\n  out.println(\"Hallo\");\n} catch (IOException e) {\n  System.out.println(e.getMessage());\n}",
      "options": [
        "println schreibt nur auf die Konsole",
        "UTF-8 kann „Hallo“ nicht codieren",
        "Der BufferedWriter hält die Zeichen im Puffer; ohne out.close() (bzw. flush()) wird nichts in die Datei geschrieben",
        "FileWriter überschreibt die Datei nach dem Schreiben wieder"
      ],
      "answer": 2,
      "explanation": "Gepufferte Ausgabe: Ein Schreibvorgang wird erst bei vollem Puffer oder flush() ausgelöst; close() ruft flush() auf. Getestet: ohne close 0 Bytes, mit close 6 Bytes.",
      "source": {
        "title": "GP2 LV 2: Dateien und Datenströme",
        "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
        "page": 6
      }
    },
    {
      "id": "q-gp2-dud-readchars",
      "chapterId": "gp2-streams",
      "examStyle": "Code-Tracing",
      "question": "Die Datei enthält genau den Text `Ja!`. Was gibt das Programm aus?",
      "code": "FileReader in = new FileReader(\"data/c.txt\", StandardCharsets.UTF_8);\nint n = 0;\nint c;\nwhile ((c = in.read()) != -1) {\n  n++;\n}\nin.close();\nSystem.out.println(n);",
      "options": [
        "2",
        "Endlosschleife",
        "4",
        "3"
      ],
      "answer": 3,
      "explanation": "read() liefert jedes Zeichen als int (J, a, !) und am Dateiende -1 → Schleife endet nach 3 Durchläufen.",
      "source": {
        "title": "Demo-Projekt 2_Demo_Persistenz",
        "path": "moodle-data/gdp2/files/2_Demo_Persistenz.zip"
      }
    },
    {
      "id": "q-gp2-dud-binary",
      "chapterId": "gp2-streams",
      "examStyle": "Code-Tracing (Binärdatei)",
      "question": "WriteBinary schrieb: writeUTF(\"Hans\"), writeInt(1234561), writeBoolean(true), writeDouble(2.35). Welche Lesesequenz ist korrekt?",
      "options": [
        "readUTF(), readInt(), readBoolean(), readDouble()",
        "readInt(), readUTF(), readBoolean(), readDouble()",
        "readLine() viermal",
        "Die Reihenfolge ist egal, DataInputStream erkennt die Typen"
      ],
      "answer": 0,
      "explanation": "Binärdaten enthalten keine Typinformation; sie müssen in gleicher Reihenfolge und mit gleichen Typen gelesen werden (Demo ReadBinary). Getestet: Ausgabe „Hans 1234561 true 2.35“.",
      "source": {
        "title": "Demo-Projekt 2_Demo_Persistenz",
        "path": "moodle-data/gdp2/files/2_Demo_Persistenz.zip"
      }
    },
    {
      "id": "q-gp2-dud-utf8",
      "chapterId": "gp2-streams",
      "examStyle": "Verständnis (Zeichencodierung)",
      "question": "Wie viele Bytes belegt der String \"Ü€\" in UTF-8?",
      "options": [
        "2",
        "5",
        "4",
        "8"
      ],
      "answer": 1,
      "explanation": "Ü (U+00DC) = C3 9C (2 Bytes), € (U+20AC) = E2 82 AC (3 Bytes) → 5 Bytes. In UTF-32 wären es 8, in UTF-16 4.",
      "source": {
        "title": "GP2 LV 2: Dateien und Datenströme",
        "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
        "page": 13
      }
    },
    {
      "id": "q-gp2-dud-file",
      "chapterId": "gp2-streams",
      "examStyle": "Code-Tracing",
      "question": "data/neu.txt existiert zu Beginn nicht. Was wird ausgegeben?",
      "code": "File f = new File(\"data/neu.txt\");\nSystem.out.println(f.exists());\nSystem.out.println(f.createNewFile() + \" \" + f.createNewFile());",
      "options": [
        "true / true true",
        "false / true true",
        "false / true false",
        "false / false false"
      ],
      "answer": 2,
      "explanation": "new File erzeugt nur ein Objekt → exists() false. Erster createNewFile() legt die Datei an → true; der zweite findet sie bereits → false (keine Überschreibung).",
      "source": {
        "title": "LE DUD: Dateien und Datenströme",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_DUD-DateienUndDatenstroeme.pdf",
        "page": 53
      }
    },
    {
      "id": "q-gp2-dud-chain",
      "chapterId": "gp2-streams",
      "examStyle": "KA-Praxis",
      "question": "Welche Konstruktion liest eine UTF-8-Textdatei zeilenweise?",
      "options": [
        "new PrintWriter(\"data/x.txt\").readLine()",
        "new FileReader(new BufferedReader(\"data/x.txt\"))",
        "new DataInputStream(new FileReader(\"data/x.txt\"))",
        "new BufferedReader(new FileReader(\"data/x.txt\", StandardCharsets.UTF_8))"
      ],
      "answer": 3,
      "explanation": "Die Quelle (FileReader mit Codierung) steht innen, der Filter (BufferedReader mit readLine) außen. DataInputStream erwartet einen InputStream, PrintWriter ist ein Ausgabestrom.",
      "source": {
        "title": "Demo-Projekt 2_Demo_Persistenz",
        "path": "moodle-data/gdp2/files/2_Demo_Persistenz.zip"
      }
    },
    {
      "id": "q-gp2-dud-readline",
      "chapterId": "gp2-streams",
      "examStyle": "Fehler finden",
      "question": "Welcher Fehler steckt in dieser Leseschleife?",
      "code": "BufferedReader in = new BufferedReader(new FileReader(\"data/k.txt\", StandardCharsets.UTF_8));\nString zeile = in.readLine();\nwhile (zeile != null) {\n  System.out.println(zeile);\n}\nin.close();",
      "options": [
        "Endlosschleife: zeile wird in der Schleife nie neu gelesen",
        "readLine liefert -1 am Ende, nicht null",
        "close() muss vor der Schleife stehen",
        "Kein Fehler"
      ],
      "answer": 0,
      "explanation": "readLine() liefert am Ende null – richtig geprüft. Aber innerhalb der Schleife fehlt zeile = in.readLine(); → die erste Zeile wird endlos ausgegeben. Üblich: while ((zeile = in.readLine()) != null).",
      "source": {
        "title": "Demo-Projekt 2_Demo_Persistenz",
        "path": "moodle-data/gdp2/files/2_Demo_Persistenz.zip"
      }
    },
    {
      "id": "q-gp2-dud-serial",
      "chapterId": "gp2-streams",
      "examStyle": "Verständnis",
      "question": "Was ist Voraussetzung, damit `oos.writeObject(kunde)` funktioniert?",
      "options": [
        "Kunde muss von OutputStream erben",
        "Kunde muss das Interface Serializable implementieren",
        "Kunde braucht eine Methode writeObject()",
        "Alle Attribute müssen public sein"
      ],
      "answer": 1,
      "explanation": "Aus Sicherheitsgründen werden nur Objekte von Klassen serialisiert, die Serializable implementieren (Interface ohne Methoden). Beim Lesen readObject() auf den Klassentyp casten.",
      "source": {
        "title": "LE DUD: Dateien und Datenströme",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_DUD-DateienUndDatenstroeme.pdf",
        "page": 35
      }
    },
    {
      "id": "q-gp2-exc-checked",
      "chapterId": "gp2-exc-dao",
      "examStyle": "Fehler finden (Compiler)",
      "question": "Was meldet der Compiler?",
      "code": "public void lade() {\n  FileReader r = new FileReader(\"data/x.txt\");\n}",
      "options": [
        "Nichts, Fehler zeigen sich erst zur Laufzeit",
        "FileReader is abstract; cannot be instantiated",
        "unreported exception FileNotFoundException; must be caught or declared to be thrown",
        "Warnung: Datei existiert nicht"
      ],
      "answer": 2,
      "explanation": "Der Konstruktor deklariert FileNotFoundException (Unterklasse der checked IOException) → muss gefangen oder per throws deklariert werden (LV 2: „Das Programm wird nicht übersetzt“). Mit javac verifiziert.",
      "source": {
        "title": "GP2 LV 2: Dateien und Datenströme",
        "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
        "page": 24
      }
    },
    {
      "id": "q-gp2-exc-unchecked",
      "chapterId": "gp2-exc-dao",
      "examStyle": "Verständnis",
      "question": "Kompiliert `int f(String s) { return Integer.parseInt(s); }` ohne try-catch?",
      "options": [
        "Nein, NumberFormatException ist checked",
        "Ja, weil parseInt nie eine Exception wirft",
        "Nein, parseInt braucht immer throws Exception",
        "Ja, NumberFormatException ist eine RuntimeException (unchecked) – sie tritt ggf. erst zur Laufzeit auf"
      ],
      "answer": 3,
      "explanation": "RuntimeExceptions müssen nicht behandelt werden; das Programm übersetzt. Bei „abc“ bricht es aber zur Laufzeit ab – in der GUI daher trotzdem fangen.",
      "source": {
        "title": "GP2 LV 2: Dateien und Datenströme",
        "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
        "page": 21
      }
    },
    {
      "id": "q-gp2-exc-order",
      "chapterId": "gp2-exc-dao",
      "examStyle": "Fehler finden (Compiler)",
      "question": "Was passiert beim Kompilieren?",
      "code": "try {\n  new FileReader(\"data/x.txt\");\n} catch (IOException e) {\n  System.out.println(\"IO\");\n} catch (FileNotFoundException e) {\n  System.out.println(\"nicht gefunden\");\n}",
      "options": [
        "Compilerfehler: FileNotFoundException has already been caught",
        "Kompiliert; es wird immer „IO“ ausgegeben",
        "Kompiliert; bei fehlender Datei wird „nicht gefunden“ ausgegeben",
        "Laufzeitfehler"
      ],
      "answer": 0,
      "explanation": "FileNotFoundException ist Unterklasse von IOException; der zweite catch wäre unerreichbar → Compilerfehler. Spezielle Ausnahmen müssen zuerst stehen.",
      "source": {
        "title": "LE DUD: Dateien und Datenströme",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_DUD-DateienUndDatenstroeme.pdf",
        "page": 16
      }
    },
    {
      "id": "q-gp2-exc-error",
      "chapterId": "gp2-exc-dao",
      "examStyle": "Verständnis",
      "question": "Welche Exception-Art soll laut LV 2 NICHT behandelt werden?",
      "options": [
        "IOException",
        "Error (z. B. Speichermangel)",
        "RuntimeException",
        "FileNotFoundException"
      ],
      "answer": 1,
      "explanation": "Klassen, die von Error abgeleitet sind, stellen schwerwiegende interne Fehler dar (Speichermangel, Hardwaredefekt) und sollen nicht behandelt werden.",
      "source": {
        "title": "GP2 LV 2: Dateien und Datenströme",
        "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
        "page": 21
      }
    },
    {
      "id": "q-gp2-dao-purpose",
      "chapterId": "gp2-exc-dao",
      "examStyle": "Verständnis (Entwurfsmuster)",
      "question": "Was ist der Hauptzweck des DAO-Musters?",
      "options": [
        "Daten schneller zu sortieren",
        "Exceptions automatisch zu behandeln",
        "Den Zugriff auf die Datenquelle zu kapseln, sodass sie ausgetauscht werden kann, ohne den aufrufenden Code zu ändern",
        "Die GUI von der Tastatur zu trennen"
      ],
      "answer": 2,
      "explanation": "LV 2 Definition: DAO kapselt den Zugriff auf Datenquellen (DB, Dateisystem), sodass die Datenquelle austauschbar ist und die Programmlogik von Speicherdetails befreit wird.",
      "source": {
        "title": "GP2 LV 2: Dateien und Datenströme",
        "path": "moodle-data/gdp2/files/GP2 LV 2.pdf",
        "page": 29
      }
    },
    {
      "id": "q-gp2-dao-trace",
      "chapterId": "gp2-exc-dao",
      "examStyle": "Code-Tracing (Demo DAO)",
      "question": "Was gibt die Demo-Klasse Test (gekürzt) als erste zwei Zeilen aus?",
      "code": "Student s = new Student(\"Egon\", 5432134, true, 3.1);\nStudentDAO dao = new StudentDAO(\"data/student.dat\", true);\ntry { dao.write(s); } catch (IOException e) { System.out.println(e.getMessage()); }\ndao.close();\nStudent s2 = new Student();\nStudentDAO dao2 = new StudentDAO(\"data/student.dat\", false);\ntry { dao2.read(s2); } catch (IOException e) { System.out.println(e.getMessage()); }\ndao2.close();\nSystem.out.println(s2.getName());\nSystem.out.println(s2.getMatnr());",
      "options": [
        "null und 0",
        "EOFException",
        "Egon und 0",
        "Egon und 5432134"
      ],
      "answer": 3,
      "explanation": "Das DAO schreibt name/matnr/bestanden/note binär und liest sie in gleicher Reihenfolge in das leere Objekt s2 zurück. close() vor dem Lesen sorgt dafür, dass alle Daten in der Datei stehen.",
      "source": {
        "title": "Demo-Projekt 2_Demo_Persistenz",
        "path": "moodle-data/gdp2/files/2_Demo_Persistenz.zip"
      }
    },
    {
      "id": "q-gp2-exc-gui",
      "chapterId": "gp2-exc-dao",
      "examStyle": "KA-Praxis",
      "question": "Benutzer tippt „zwölf“ in das Alter-Feld und klickt „Speichern“. Welche Behandlung ist für die KA am sinnvollsten?",
      "options": [
        "catch (NumberFormatException ex) und dem Benutzer einen Hinweis anzeigen",
        "Gar keine – RuntimeExceptions müssen nicht behandelt werden",
        "catch (Exception ex) { }",
        "main() throws NumberFormatException"
      ],
      "answer": 0,
      "explanation": "Integer.parseInt wirft NumberFormatException. Spezifisch fangen und dem Benutzer melden (wie NewRatingController, der bei ungültiger Bewertung den Prompt rot färbt). Universalhandler sind unerwünscht.",
      "source": {
        "title": "LE FXE: Ereignisbehandlung und Binding",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
        "page": 24
      }
    },
    {
      "id": "q-gp2-aki-new",
      "chapterId": "gp2-aki",
      "examStyle": "Fehler finden (Compiler)",
      "question": "Student ist abstrakt, WI_Student eine konkrete Unterklasse. Welche Zeile erzeugt einen Compilerfehler?",
      "options": [
        "Student s = new WI_Student(\"Max\");",
        "Student s = new Student(\"Max\");",
        "Student[] alle = new Student[10];",
        "WI_Student w = new WI_Student(\"Max\");"
      ],
      "answer": 1,
      "explanation": "Von abstrakten Klassen können keine Objekte erzeugt werden („Student is abstract; cannot be instantiated“). Als Variablen- oder Array-Typ sind sie erlaubt.",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 4
      }
    },
    {
      "id": "q-gp2-aki-public",
      "chapterId": "gp2-aki",
      "examStyle": "Fehler finden (Compiler)",
      "question": "Warum kompiliert dieser Code nicht?",
      "code": "interface Wertvoll { double getWert(); }\nclass Tisch implements Wertvoll {\n  double getWert() { return 120; }\n}",
      "options": [
        "Interfaces dürfen keine double-Methoden haben",
        "Tisch muss abstract sein",
        "getWert ist im Interface implizit public; die Implementierung ohne public schwächt das Zugriffsrecht",
        "Es fehlt @Override"
      ],
      "answer": 2,
      "explanation": "Alle Interface-Methoden sind public. Die implementierende Methode muss ebenfalls public sein, sonst „attempting to assign weaker access privileges“. @Override ist optional.",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 12
      }
    },
    {
      "id": "q-gp2-aki-poly",
      "chapterId": "gp2-aki",
      "examStyle": "Code-Tracing (Polymorphie)",
      "question": "Was wird ausgegeben?",
      "code": "abstract class Student {\n  String name;\n  Student(String n) { name = n; }\n  abstract double schnitt();\n  String vorstellen() { return name + \": \" + schnitt(); }\n}\nclass WI extends Student { WI(String n) { super(n); } double schnitt() { return 2.3; } }\nclass MI extends Student {\n  MI(String n) { super(n); }\n  double schnitt() { return 2.1; }\n  String vorstellen() { return \"MI \" + super.vorstellen(); }\n}\n// main:\nStudent[] s = { new WI(\"Max\"), new MI(\"Erna\") };\nfor (Student x : s) System.out.println(x.vorstellen());",
      "options": [
        "Max: 2.3 / Erna: 2.1",
        "Max: 0.0 / MI Erna: 0.0",
        "Compilerfehler: schnitt() ist abstrakt und darf in vorstellen() nicht aufgerufen werden",
        "Max: 2.3 / MI Erna: 2.1"
      ],
      "answer": 3,
      "explanation": "Abstrakte Methoden dürfen in der Oberklasse aufgerufen werden; dynamisches Binden wählt zur Laufzeit WI.schnitt bzw. MI.schnitt. MI überschreibt zusätzlich vorstellen() und ruft super.vorstellen(). Mit java verifiziert.",
      "source": {
        "title": "GP2 LV 3: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/files/GP2 LV 3.pdf",
        "page": 8
      }
    },
    {
      "id": "q-gp2-aki-default",
      "chapterId": "gp2-aki",
      "examStyle": "Code-Tracing (default-Methode)",
      "question": "Was wird ausgegeben?",
      "code": "interface Figur {\n  double flaeche();\n  default String farbe() { return \"Rot\"; }\n}\nclass Kreis implements Figur { public double flaeche() { return 3; } }\nclass Quadrat implements Figur {\n  public double flaeche() { return 4; }\n  public String farbe() { return \"Blau\"; }\n}\n// main:\nfor (Figur f : List.of(new Kreis(), new Quadrat())) System.out.print(f.farbe() + \" \");",
      "options": [
        "Rot Blau",
        "Rot Rot",
        "Blau Blau",
        "Compilerfehler: default-Methoden dürfen nicht überschrieben werden"
      ],
      "answer": 0,
      "explanation": "Kreis erbt die Musterimplementierung (Rot), Quadrat überschreibt sie (Blau) – wie Rechteck.getDefaultFarbe() im IFigur-Beispiel.",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 9
      }
    },
    {
      "id": "q-gp2-aki-konstante",
      "chapterId": "gp2-aki",
      "examStyle": "Verständnis",
      "question": "Im Interface IFigur steht `String[] FARBEN = { \"Rot\", \"Gruen\", \"Blau\" };`. Welche Modifizierer hat FARBEN automatisch?",
      "options": [
        "private",
        "public static final",
        "protected",
        "public (Objekt-Attribut jedes Objekts)"
      ],
      "answer": 1,
      "explanation": "Interfaces haben keine Objekt-Attribute; Attribute sind automatisch Klassen-Konstanten: public static final.",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 13
      }
    },
    {
      "id": "q-gp2-aki-mehrfach",
      "chapterId": "gp2-aki",
      "examStyle": "Verständnis",
      "question": "Welche Klassendeklaration ist gültig?",
      "options": [
        "class Tisch extends Moebel, Wertgegenstand { }",
        "class Tisch implements Moebel extends Schwer { }",
        "class Tisch extends Moebel implements Schwer, Wertvoll { }",
        "interface Schwer implements Gewicht { }"
      ],
      "answer": 2,
      "explanation": "Eine Klasse erbt genau eine Klasse (extends zuerst) und implementiert beliebig viele Interfaces. Interfaces erweitern andere Interfaces mit extends, nicht implements.",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 12
      }
    },
    {
      "id": "q-gp2-aki-relation",
      "chapterId": "gp2-aki",
      "examStyle": "Klassenentwurf",
      "question": "„Ein Tisch verhält sich wie ein schwerer Gegenstand“ – wie modelliert man das laut LV 3?",
      "options": [
        "Tisch hat ein Attribut vom Typ Schwer",
        "Tisch erbt von der Klasse Schwer",
        "Schwer ist eine innere Klasse von Tisch",
        "Tisch implementiert das Interface Schwer"
      ],
      "answer": 3,
      "explanation": "LV 3: „hat ein“ = Attribut, „ist ein“ = Vererbung, „verhält sich wie“ = Interface implementieren. Tisch IST ein Möbelstück (extends Moebel).",
      "source": {
        "title": "GP2 LV 3: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/files/GP2 LV 3.pdf",
        "page": 16
      }
    },
    {
      "id": "q-gp2-lambda",
      "chapterId": "gp2-lambda",
      "examStyle": "Lambda-Signatur",
      "question": "Welcher Lambda-Ausdruck implementiert das funktionale Interface `Predicate<String>` korrekt?",
      "code": "@FunctionalInterface\npublic interface Predicate<T> {\n    boolean test(T t);\n}",
      "options": [
        "Predicate<String> p = s -> s.length() > 5;",
        "Predicate<String> p = s -> s.length();",
        "Predicate<String> p = (s, t) -> s.equals(t);",
        "Predicate<String> p = () -> true;"
      ],
      "answer": 0,
      "explanation": "test(String s) erwartet genau 1 Parameter und liefert boolean. s.length() liefert int (falscher Typ), (s, t) hat zwei Parameter (das wäre BiPredicate), () keinen.",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 23
      }
    },
    {
      "id": "q-gp2-lam-calc",
      "chapterId": "gp2-lambda",
      "examStyle": "Code-Tracing (Calculator)",
      "question": "Was wird ausgegeben?",
      "code": "interface IntegerMath { int operation(int a, int b); }\nstatic int operateBinary(int a, int b, IntegerMath op) { return op.operation(a, b); }\n// main:\nIntegerMath addition = (a, b) -> a + b;\nIntegerMath subtraktion = (a, b) -> a - b;\nSystem.out.println(operateBinary(40, 2, addition) + \" \" + operateBinary(20, 10, subtraktion));",
      "options": [
        "42 -10",
        "42 10",
        "402 2010",
        "Compilerfehler: Lambda ohne return"
      ],
      "answer": 1,
      "explanation": "Der Lambda implementiert operation; bei einem einzigen Ausdruck entfällt return. 40+2 = 42, 20−10 = 10 (Beispiel aus AKI/LV 3, verifiziert).",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 22
      }
    },
    {
      "id": "q-gp2-lam-functional",
      "chapterId": "gp2-lambda",
      "examStyle": "Fehler finden (Compiler)",
      "question": "Warum kompiliert `Z z = x -> x;` nicht?",
      "code": "interface Z {\n  int a(int x);\n  int b(int x);\n}",
      "options": [
        "Lambdas brauchen geschweifte Klammern",
        "x muss einen Typ haben",
        "Z hat zwei abstrakte Methoden → kein funktionales Interface, der Compiler weiß nicht, welche implementiert wird",
        "Interfaces dürfen keine int-Methoden haben"
      ],
      "answer": 2,
      "explanation": "Lambdas sind nur für funktionale Interfaces (genau eine abstrakte Methode) erlaubt. javac: „Z is not a functional interface“.",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 21
      }
    },
    {
      "id": "q-gp2-lam-sort",
      "chapterId": "gp2-lambda",
      "examStyle": "Code-Tracing (Sortierung)",
      "question": "Was wird ausgegeben?",
      "code": "List<String> namen = new ArrayList<>(List.of(\"Eva\", \"Bernd\", \"Al\", \"Christa\"));\nnamen.sort((x, y) -> x.length() - y.length());\nSystem.out.println(namen);",
      "options": [
        "[Al, Bernd, Christa, Eva]",
        "[Eva, Bernd, Al, Christa]",
        "[Christa, Bernd, Eva, Al]",
        "[Al, Eva, Bernd, Christa]"
      ],
      "answer": 3,
      "explanation": "Der Comparator sortiert aufsteigend nach Länge: Al(2), Eva(3), Bernd(5), Christa(7). Alphabetisch wäre Option A. Verifiziert.",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 16
      }
    },
    {
      "id": "q-gp2-lam-cast",
      "chapterId": "gp2-lambda",
      "examStyle": "Fehler finden (Sortierung)",
      "question": "Flächen [1.7, 1.2, 0.9] sollen aufsteigend sortiert werden. Was ergibt `fl.sort((x, y) -> (int) (x - y));`?",
      "options": [
        "[1.7, 1.2, 0.9] – unverändert, weil alle Differenzen durch den int-Cast 0 werden",
        "[0.9, 1.2, 1.7]",
        "[1.7, 0.9, 1.2]",
        "ClassCastException"
      ],
      "answer": 0,
      "explanation": "Alle Differenzen liegen zwischen −1 und 1 → (int) liefert 0 → „gleich“, die stabile Sortierung ändert nichts (verifiziert). Das AKI-Muster (int)(o1.getFlaeche() − o2.getFlaeche()) hat dieses Risiko; sicher ist Double.compare(x, y).",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 19
      }
    },
    {
      "id": "q-gp2-lam-anon",
      "chapterId": "gp2-lambda",
      "examStyle": "Fehler finden (Syntax)",
      "question": "Was fehlt in der anonymen Klasse?",
      "code": "IntegerMath op = new IntegerMath() {\n  public int operation(int a, int b) {\n    return a * b;\n  }\n}",
      "options": [
        "Der Klassenname nach new",
        "Das Semikolon nach der schließenden Klammer – der ganze Ausdruck ist eine Zuweisung",
        "Das Schlüsselwort implements",
        "Nichts, der Code ist korrekt"
      ],
      "answer": 1,
      "explanation": "LV 3 („Hier fehlt das ;“): new IntegerMath() { … } ergibt einen Referenzwert; die Zuweisungsanweisung muss mit ; enden.",
      "source": {
        "title": "GP2 LV 3: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/files/GP2 LV 3.pdf",
        "page": 25
      }
    },
    {
      "id": "q-gp2-lam-consumer",
      "chapterId": "gp2-lambda",
      "examStyle": "Code-Tracing (java.util.function)",
      "question": "Was wird ausgegeben?",
      "code": "Predicate<String> lang = t -> t.length() > 3;\nConsumer<String> druck = t -> System.out.print(t.toUpperCase() + \" \");\nfor (String t : List.of(\"Java\", \"FX\", \"Lambda\")) {\n  if (lang.test(t)) druck.accept(t);\n}",
      "options": [
        "JAVA FX LAMBDA",
        "FX",
        "JAVA LAMBDA",
        "Java Lambda"
      ],
      "answer": 2,
      "explanation": "Predicate.test filtert (Länge > 3: Java, Lambda), Consumer.accept führt die Aktion aus (Großschreibung) – Muster wie runSelektiv(Predicate, Consumer).",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 25
      }
    },
    {
      "id": "q-gp2-lam-compareTo",
      "chapterId": "gp2-lambda",
      "examStyle": "Verständnis (Comparable)",
      "question": "Kunde implementiert Comparable<Kunde> mit `return this.name.compareTo(o.name);`. Was bewirkt das beim Sortieren?",
      "options": [
        "Absteigend nach Name",
        "Nichts, compareTo wird nur von equals benutzt",
        "Sortierung nach Hashcode",
        "Aufsteigend (alphabetisch) nach Name – natürliche Ordnung"
      ],
      "answer": 3,
      "explanation": "compareTo definiert die natürliche Ordnung; String.compareTo ist lexikographisch (negativ, wenn this vorher kommt). Wie IFigur.compareTo, das nach Farbname vergleicht.",
      "source": {
        "title": "LE AKI: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_AKI-AbstrakteKlassenUndInterfaces.pdf",
        "page": 15
      }
    },
    {
      "id": "q-gp2-lam-inner",
      "chapterId": "gp2-lambda",
      "examStyle": "Verständnis (innere Klassen)",
      "question": "Wie erzeugt man ein Objekt einer NICHT-statischen inneren Klasse Innen von Aussen?",
      "options": [
        "Aussen a = new Aussen(); Aussen.Innen i = a.new Innen();",
        "new Aussen.Innen()",
        "Innen.new()",
        "Gar nicht, innere Klassen sind nie instanzierbar"
      ],
      "answer": 0,
      "explanation": "Nicht-statische innere Klassen brauchen ein vorhandenes Objekt der äußeren Klasse (Zugriff auf dessen Objektvariablen). new Aussen.Innen() geht nur bei statischen inneren Klassen.",
      "source": {
        "title": "GP2 LV 3: Abstrakte Klassen, Interfaces, Lambda",
        "path": "moodle-data/gdp2/files/GP2 LV 3.pdf",
        "page": 19
      }
    },
    {
      "id": "q-gp2-jcf",
      "chapterId": "gp2-jcf",
      "examStyle": "JCF-Auswahl",
      "question": "Du willst Kunden über ihre eindeutige Kundennummer (String) schnell finden. Welche Struktur passt am besten?",
      "options": [
        "ArrayList<Kunde>",
        "HashMap<String, Kunde>",
        "LinkedList<String>",
        "Kunde[] mit fester Länge"
      ],
      "answer": 1,
      "explanation": "Eine Map speichert Schlüssel-Wert-Paare (wie Datenbanktabelle mit Primärschlüssel); HashMap findet über die Hashfunktion sehr effizient per get(key). Listen müssten linear durchsucht werden.",
      "source": {
        "title": "GP2 LV 4: Collections Framework",
        "path": "moodle-data/gdp2/files/GP2 LV 4.pdf",
        "page": 9
      }
    },
    {
      "id": "q-gp2-jcf-integer",
      "chapterId": "gp2-jcf",
      "examStyle": "Code-Tracing (Hüllklassen)",
      "question": "Was wird ausgegeben?",
      "code": "Integer i = new Integer(123);\nInteger k = new Integer(123);\nSystem.out.println((i == k) + \" \" + i.equals(k));",
      "options": [
        "true true",
        "true false",
        "false true",
        "false false"
      ],
      "answer": 2,
      "explanation": "Zwei new-Aufrufe → zwei Objekte → verschiedene Referenzen (== false); equals vergleicht die Werte (true). Wie bei Strings (LV 4).",
      "source": {
        "title": "GP2 LV 4: Collections Framework",
        "path": "moodle-data/gdp2/files/GP2 LV 4.pdf",
        "page": 7
      }
    },
    {
      "id": "q-gp2-jcf-set",
      "chapterId": "gp2-jcf",
      "examStyle": "Code-Tracing",
      "question": "Was wird ausgegeben?",
      "code": "Set<String> s = new HashSet<>();\nSystem.out.println(s.add(\"p\") + \" \" + s.add(\"p\") + \" \" + s.size());",
      "options": [
        "true true 2",
        "true true 1",
        "false false 0",
        "true false 1"
      ],
      "answer": 3,
      "explanation": "Ein Set lässt kein Element doppelt zu: zweites add liefert false, Größe bleibt 1.",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 8
      }
    },
    {
      "id": "q-gp2-jcf-sublist",
      "chapterId": "gp2-jcf",
      "examStyle": "Code-Tracing (List)",
      "question": "Was wird ausgegeben?",
      "code": "List<String> l = new LinkedList<>();\nl.add(\"Tom\");\nl.add(\"Angelina\");\nl.add(0, \"Catherine\");\nSystem.out.println(l.subList(2, 3));",
      "options": [
        "[Angelina]",
        "[Tom]",
        "[Catherine]",
        "[Tom, Angelina]"
      ],
      "answer": 0,
      "explanation": "add(0, …) fügt vorne ein → [Catherine, Tom, Angelina]. subList(2, 3) liefert Index 2 inklusive bis 3 exklusiv → [Angelina] (vgl. Übung JCF-04).",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 20
      }
    },
    {
      "id": "q-gp2-jcf-reverse",
      "chapterId": "gp2-jcf",
      "examStyle": "Code-Tracing (ListIterator)",
      "question": "Was wird ausgegeben?",
      "code": "ArrayList<String> p = new ArrayList<>(List.of(\"Tom\", \"Angelina\", \"Catherine\"));\np.add(\"Angelina\");\np.add(\"Catherine\");\nListIterator<String> lit = p.listIterator(p.size());\nwhile (lit.hasPrevious()) System.out.print(lit.previous() + \",\");",
      "options": [
        "Tom,Angelina,Catherine,",
        "Catherine,Angelina,Catherine,Angelina,Tom,",
        "Catherine,Angelina,Tom,",
        "IndexOutOfBoundsException"
      ],
      "answer": 1,
      "explanation": "Listen erlauben Duplikate → 5 Elemente. listIterator(size) startet am Ende; previous() läuft rückwärts (wie Beispiel LinkedListArrayListTest in JCF).",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 23
      }
    },
    {
      "id": "q-gp2-jcf-map",
      "chapterId": "gp2-jcf",
      "examStyle": "Code-Tracing (Map)",
      "question": "Was wird ausgegeben?",
      "code": "Map<String, Integer> m = new HashMap<>();\nm.put(\"A\", 1);\nm.put(\"A\", 2);\nSystem.out.println(m.size() + \" \" + m.get(\"A\") + \" \" + m.get(\"B\"));",
      "options": [
        "2 1 null",
        "1 1 0",
        "1 2 null",
        "Exception: Schlüssel doppelt"
      ],
      "answer": 2,
      "explanation": "Schlüssel sind eindeutig: zweites put überschreibt den Wert → Größe 1, get(\"A\") = 2. Nicht vorhandener Schlüssel → null (kein Fehler).",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 17
      }
    },
    {
      "id": "q-gp2-jcf-int",
      "chapterId": "gp2-jcf",
      "examStyle": "Fehler finden (Generics)",
      "question": "Welche Deklaration ist ein Compilerfehler?",
      "options": [
        "List<Integer> li = new LinkedList<>();",
        "Map<String, Integer> m = new HashMap<>();",
        "ArrayList<Double> d = new ArrayList<>(20);",
        "List<int> li = new LinkedList<>();"
      ],
      "answer": 3,
      "explanation": "Typparameter müssen Referenztypen sein; primitive Typen wie int nur über Hüllklassen (Integer) mit Autoboxing.",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 23
      }
    },
    {
      "id": "q-gp2-jcf-generic-sub",
      "chapterId": "gp2-jcf",
      "examStyle": "Fehler finden (Generics)",
      "question": "Kunde extends Person. Was passiert bei `unserePersonen = unsereKunden;` mit Collection<Person> unserePersonen und Collection<Kunde> unsereKunden?",
      "options": [
        "Compilerfehler: incompatible types – Collection<Kunde> ist kein Untertyp von Collection<Person>",
        "Kompiliert, weil Kunde eine Person ist",
        "Laufzeitfehler ClassCastException",
        "Kompiliert, aber unsereKunden wird geleert"
      ],
      "answer": 0,
      "explanation": "Aus Gründen der Typsicherheit ist LinkedList<S> nie Obertyp von LinkedList<T> (außer S = T). Mit javac verifiziert. addAll(unsereKunden) funktioniert dagegen (<? extends E>).",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 24
      }
    },
    {
      "id": "q-gp2-jcf-delete",
      "chapterId": "gp2-jcf",
      "examStyle": "KA-Praxis (Delete)",
      "question": "Was passiert bei diesem Löschversuch?",
      "code": "List<String> del = new ArrayList<>(List.of(\"a\", \"b\", \"c\"));\nfor (String t : del) {\n  if (t.equals(\"a\")) del.remove(t);\n}",
      "options": [
        "del ist danach [b, c], kein Fehler",
        "ConcurrentModificationException beim nächsten Schleifenschritt",
        "Compilerfehler",
        "Endlosschleife"
      ],
      "answer": 1,
      "explanation": "Die Liste wird während der for-each-Iteration strukturell verändert → der Iterator wirft ConcurrentModificationException (verifiziert). Sicher löschen mit del.removeIf(t -> t.equals(\"a\")) oder Iterator.remove().",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 11
      }
    },
    {
      "id": "q-gp2-jcf-removeif",
      "chapterId": "gp2-jcf",
      "examStyle": "Code-Tracing",
      "question": "Was wird ausgegeben?",
      "code": "List<String> n = new ArrayList<>(List.of(\"Eva\", \"Bernd\", \"Al\", \"Christa\"));\nn.removeIf(x -> x.charAt(0) < 'C');\nSystem.out.println(n);",
      "options": [
        "[Bernd, Al]",
        "[Christa]",
        "[Eva, Christa]",
        "[Eva, Bernd, Al, Christa]"
      ],
      "answer": 2,
      "explanation": "removeIf entfernt alle Elemente, für die das Predicate true liefert: B und A liegen vor C → entfernt; E und C bleiben (C < C ist false).",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 14
      }
    },
    {
      "id": "q-gp2-jcf-retain",
      "chapterId": "gp2-jcf",
      "examStyle": "Code-Tracing",
      "question": "Was enthält r danach?",
      "code": "Collection<Integer> r = new LinkedList<>(List.of(1, 2, 3, 4));\nr.retainAll(List.of(2, 4, 6));\nSystem.out.println(r);",
      "options": [
        "[1, 3]",
        "[1, 2, 3, 4, 6]",
        "[2, 4, 6]",
        "[2, 4]"
      ],
      "answer": 3,
      "explanation": "retainAll behält nur Elemente, die auch in der anderen Collection sind (Schnittmenge); removeAll würde das Gegenteil tun → [1, 3].",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 13
      }
    },
    {
      "id": "q-gp2-jcf-choice",
      "chapterId": "gp2-jcf",
      "examStyle": "JCF-Auswahl",
      "question": "Laut JCF-Lerneinheit: Wann sollte man LinkedList statt ArrayList wählen?",
      "options": [
        "Wenn die Anwendung viele Elemente schnell hinzufügt oder entfernt",
        "Wenn Speicherplatz höchste Priorität hat",
        "Wenn die Liste thread-sicher sein muss",
        "Nie, LinkedList ist veraltet"
      ],
      "answer": 0,
      "explanation": "LinkedList (doppelt verkettet) hat effizientere add/remove; ArrayList braucht weniger Speicher. Thread-Sicherheit: Vector.",
      "source": {
        "title": "LE JCF: Java Collections Framework",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JCF-JavaCollectionsFramework.pdf",
        "page": 21
      }
    },
    {
      "id": "q-gp2-fxg-start",
      "chapterId": "gp2-javafx",
      "examStyle": "Verständnis (Aufbau)",
      "question": "Welche Methode MUSS eine JavaFX-Anwendung (extends Application) überschreiben?",
      "options": [
        "public static void main(String[] args)",
        "public void start(Stage primaryStage)",
        "public void init(Scene scene)",
        "public void show()"
      ],
      "answer": 1,
      "explanation": "Eine JavaFX-Anwendung ist Unterklasse von Application und muss start(Stage) überschreiben; main ruft nur launch(args) auf.",
      "source": {
        "title": "LE FXG: Grundlagen von JavaFX",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
        "page": 11
      }
    },
    {
      "id": "q-gp2-fxg-grid",
      "chapterId": "gp2-javafx",
      "examStyle": "Code-Verständnis (GridPane)",
      "question": "Wo landet der Button nach `root.add(button, 2, 3);` in einem GridPane?",
      "options": [
        "Zeile 2, Spalte 3",
        "2 Pixel rechts, 3 Pixel unten",
        "Spalte 2, Zeile 3",
        "Über 2 Spalten und 3 Zeilen gestreckt"
      ],
      "answer": 2,
      "explanation": "add(node, spalte, zeile) – erst Spalte (columnIndex), dann Zeile. Spannweite gibt es mit add(node, spalte, zeile, colspan, rowspan).",
      "source": {
        "title": "LE FXG: Grundlagen von JavaFX",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
        "page": 17
      }
    },
    {
      "id": "q-gp2-fxg-scroll",
      "chapterId": "gp2-javafx",
      "examStyle": "Fehler finden",
      "question": "Eine unbekannte Anzahl Hotels soll scrollbar angezeigt werden. Was ist richtig?",
      "options": [
        "scrollPane.getChildren().addAll(h1, h2, h3);",
        "stage.setScrollable(true);",
        "scrollPane.add(h1, 0, 0);",
        "VBox box mit allen Hotel-Panes füllen und scrollPane.setContent(box);"
      ],
      "answer": 3,
      "explanation": "ScrollPane hat kein add/addAll, sondern setContent(Node) – nur EIN Kind. Daher eine VBox als Container (HotelsDemo).",
      "source": {
        "title": "LE FXG: Grundlagen von JavaFX",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
        "page": 33
      }
    },
    {
      "id": "q-gp2-fxg-border",
      "chapterId": "gp2-javafx",
      "examStyle": "Layout-Auswahl",
      "question": "Du willst oben eine MenuBar, in der Mitte das Formular und unten eine Buttonleiste. Welche Wurzel passt?",
      "options": [
        "BorderPane mit setTop/setCenter/setBottom",
        "StackPane",
        "Group",
        "HBox"
      ],
      "answer": 0,
      "explanation": "BorderPane teilt in top, bottom, left, right, center. StackPane stapelt übereinander, HBox reiht nebeneinander, Group ist für Geometrie mit festen Koordinaten.",
      "source": {
        "title": "LE FXG: Grundlagen von JavaFX",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
        "page": 27
      }
    },
    {
      "id": "q-gp2-fxg-modal",
      "chapterId": "gp2-javafx",
      "examStyle": "KA-Praxis (Dialog)",
      "question": "Welche Anweisungen machen ein zweites Fenster modal zum Hauptfenster?",
      "options": [
        "second.setModal(true);",
        "second.initOwner(primaryStage); second.initModality(Modality.WINDOW_MODAL);",
        "primaryStage.hide();",
        "second.setScene(primaryStage.getScene());"
      ],
      "answer": 1,
      "explanation": "FXG (Hotel02): initOwner verknüpft den Dialog mit dem Hauptfenster, initModality(Modality.WINDOW_MODAL) sperrt es, bis der Dialog geschlossen wird.",
      "source": {
        "title": "LE FXG: Grundlagen von JavaFX",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
        "page": 14
      }
    },
    {
      "id": "q-gp2-fxg-hbox",
      "chapterId": "gp2-javafx",
      "examStyle": "Verständnis (Layout-Manager)",
      "question": "Ein Button ist direkt die Wurzel der Scene und füllt das ganze Fenster. Was ändert sich, wenn er in eine HBox gelegt wird?",
      "options": [
        "Nichts",
        "Er verschwindet, weil HBox nur Labels erlaubt",
        "Er wird in seiner bevorzugten Größe (preferred size) dargestellt",
        "Er wird auf 0×0 Pixel verkleinert"
      ],
      "answer": 2,
      "explanation": "LV 5: Als Wurzel nimmt der Button die Größe des Fensterrahmens an; „HBox bewirkt, dass der Button in seiner bevorzugten Größe dargestellt wird.“",
      "source": {
        "title": "GP2 LV 5: JavaFX Aufbau",
        "path": "moodle-data/gdp2/files/GP2 LV 5.pdf",
        "page": 25
      }
    },
    {
      "id": "q-gp2-fxg-control",
      "chapterId": "gp2-javafx",
      "examStyle": "Control-Auswahl",
      "question": "Der Benutzer soll genau EINE von drei Zahlungsarten wählen. Welche Controls nimmst du?",
      "options": [
        "Drei CheckBoxen",
        "Ein PasswordField",
        "Drei TextFields",
        "Drei RadioButtons in einer ToggleGroup"
      ],
      "answer": 3,
      "explanation": "Mit ToggleGroup ist nur ein RadioButton gleichzeitig selektiert; CheckBoxen erlauben Mehrfachauswahl. Alternative: ComboBox<String>.",
      "source": {
        "title": "LE FXG: Grundlagen von JavaFX",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
        "page": 37
      }
    },
    {
      "id": "q-gp2-fxg-parent",
      "chapterId": "gp2-javafx",
      "examStyle": "Verständnis (Scene Graph)",
      "question": "Welcher Typ wird mindestens für den Konstruktor `new Scene(root)` benötigt?",
      "options": [
        "Parent (z. B. Group, Region/GridPane, WebView)",
        "Stage",
        "Button",
        "String"
      ],
      "answer": 0,
      "explanation": "Scene(Parent root): Wurzel des Scene Graph ist ein Parent. Group für Geometrie, Region-Unterklassen (GridPane, VBox …) für Formulare, WebView für Webinhalte.",
      "source": {
        "title": "LE FXG: Grundlagen von JavaFX",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXG-JavaFXGrundlagen.pdf",
        "page": 16
      }
    },
    {
      "id": "q-gp2-fx",
      "chapterId": "gp2-fx-events",
      "examStyle": "JavaFX Praxis (Binding)",
      "question": "Was passiert, wenn du `label.textProperty().bind(tf.textProperty())` aufrufst und anschließend `label.setText(\"Neu\")` ausführst?",
      "options": [
        "Das TextField übernimmt ebenfalls \"Neu\"",
        "Es wird eine RuntimeException („A bound value cannot be set“) geworfen",
        "Die Bindung wird stillschweigend gelöst",
        "Das Label zeigt \"Neu\", bis das TextField wieder geändert wird"
      ],
      "answer": 1,
      "explanation": "Eine unidirektional gebundene Property folgt nur ihrer Quelle; direktes Setzen ist verboten und führt zu einer RuntimeException. Für Schreiben in beide Richtungen: bindBidirectional (oder vorher unbind). [Fehlermeldung: JavaFX-API, nicht im Skript.]",
      "source": {
        "title": "LE FXE: Ereignisbehandlung und Binding",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
        "page": 11
      }
    },
    {
      "id": "q-gp2-fxe-handler",
      "chapterId": "gp2-fx-events",
      "examStyle": "Verständnis (EventHandler)",
      "question": "Welchen Typ erwartet `button.setOnAction(…)`?",
      "options": [
        "Runnable",
        "ActionListener mit actionPerformed",
        "EventHandler<ActionEvent> mit Methode void handle(ActionEvent e)",
        "Consumer<Button>"
      ],
      "answer": 2,
      "explanation": "setOnAction (aus ButtonBase) erwartet ein EventHandler<ActionEvent>; das funktionale Interface hat die einzige Methode handle(T event) und kann per Lambda implementiert werden. ActionListener ist Swing/AWT.",
      "source": {
        "title": "LE FXE: Ereignisbehandlung und Binding",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
        "page": 5
      }
    },
    {
      "id": "q-gp2-fxe-enter",
      "chapterId": "gp2-fx-events",
      "examStyle": "Code-Verständnis",
      "question": "Wann wird das Label in Hotel01EventHandler aktualisiert?",
      "code": "myrating.setOnAction(e -> {\n  String s = myrating.getText();\n  currentrating.setText(s);\n});",
      "options": [
        "Bei jedem Tastendruck im TextField",
        "Beim Schließen des Fensters",
        "Beim Klick auf irgendeinen Button",
        "Wenn im TextField myrating die Enter-Taste gedrückt wird"
      ],
      "answer": 3,
      "explanation": "setOnAction von TextField reagiert auf die Enter-Taste. Bei jedem Tastendruck würde nur ein Binding (textProperty().bind) aktualisieren.",
      "source": {
        "title": "LE FXE: Ereignisbehandlung und Binding",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
        "page": 9
      }
    },
    {
      "id": "q-gp2-fxe-bind",
      "chapterId": "gp2-fx-events",
      "examStyle": "Code-Verständnis (Binding)",
      "question": "`currentrating.textProperty().bind(myrating.textProperty());` – was gilt?",
      "options": [
        "Änderungen im Label currentrating erscheinen im TextField myrating",
        "Änderungen im TextField myrating werden sofort im Label currentrating gespiegelt",
        "Beide werden einmalig synchronisiert, danach unabhängig",
        "Nur bei Enter wird übertragen"
      ],
      "answer": 1,
      "explanation": "bind hat eine Richtung: Das Objekt, auf dem bind aufgerufen wird (Ziel), folgt dem Argument (Quelle). Jede Texteingabe im TextField erscheint sofort im Label.",
      "source": {
        "title": "LE FXE: Ereignisbehandlung und Binding",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
        "page": 6
      }
    },
    {
      "id": "q-gp2-fxe-controller",
      "chapterId": "gp2-fx-events",
      "examStyle": "KA-Architektur (Controller)",
      "question": "Wie wird im FXE-Hotel-Beispiel ein Controller an einen Button gehängt?",
      "options": [
        "submit.setOnAction(new NewRatingController(hotel, currentRating, …)); – die Klasse implementiert EventHandler<ActionEvent>",
        "button.addController(new NewRatingController());",
        "NewRatingController extends Button",
        "Controller werden in main() mit launch registriert"
      ],
      "answer": 0,
      "explanation": "Controller-Klassen im Paket controller implementieren EventHandler<ActionEvent>; die benötigten Objekte (Model, Labels, Stage) bekommen sie über den Konstruktor.",
      "source": {
        "title": "LE FXE: Ereignisbehandlung und Binding",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
        "page": 24
      }
    },
    {
      "id": "q-gp2-fxe-property",
      "chapterId": "gp2-fx-events",
      "examStyle": "Verständnis (Properties)",
      "question": "Welche Methode liefert das Property-OBJEKT des Textes eines TextFields (für bind)?",
      "options": [
        "getText()",
        "textProperty()",
        "setText(String)",
        "getTextProperty().getValue()"
      ],
      "answer": 1,
      "explanation": "Namenskonvention: getText() liefert den String, setText(…) setzt ihn, textProperty() liefert das StringProperty-Objekt für bind/addListener.",
      "source": {
        "title": "LE FXE: Ereignisbehandlung und Binding",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
        "page": 12
      }
    },
    {
      "id": "q-gp2-fxe-mvc",
      "chapterId": "gp2-fx-events",
      "examStyle": "Verständnis (MVC)",
      "question": "Welche Aufgabe hat laut LV 5 der Controller im MVC-Muster?",
      "options": [
        "Daten kapseln und den Zustand speichern",
        "Das Model auf dem Bildschirm darstellen",
        "Benutzeraktionen in Aktualisierungen des Model übersetzen und die View auswählen",
        "Die Datei auf der Festplatte speichern"
      ],
      "answer": 2,
      "explanation": "Model: Daten/Zustand, benachrichtigt View. View: Ansicht, übermittelt Aktionen. Controller: übersetzt Benutzeraktionen in Model-Änderungen, wählt View.",
      "source": {
        "title": "GP2 LV 5: JavaFX Aufbau",
        "path": "moodle-data/gdp2/files/GP2 LV 5.pdf",
        "page": 14
      }
    },
    {
      "id": "q-gp2-fxe-flow",
      "chapterId": "gp2-fx-events",
      "examStyle": "Verständnis (Kontrollfluss)",
      "question": "Wer bestimmt bei einer GUI-Anwendung den Kontrollfluss?",
      "options": [
        "Das Programm, wie bei der Konsole",
        "Die Klasse Scene",
        "Das Betriebssystem nach festem Zeitplan",
        "Der Benutzer durch Ereignisse (Klicks, Tasten) – in beliebiger Reihenfolge"
      ],
      "answer": 3,
      "explanation": "LV 5: Bei der GUI gibt der Benutzer dem Programm den Kontrollfluss vor; das Programm muss auch auf nicht sinnvolle Eingabereihenfolgen vorbereitet sein.",
      "source": {
        "title": "GP2 LV 5: JavaFX Aufbau",
        "path": "moodle-data/gdp2/files/GP2 LV 5.pdf",
        "page": 5
      }
    },
    {
      "id": "q-gp2-fxe-slider",
      "chapterId": "gp2-fx-events",
      "examStyle": "Code-Verständnis",
      "question": "Was ist der Unterschied zwischen den beiden Varianten?",
      "code": "// A\nc.scaleXProperty().bind(slider.valueProperty());\n// B\nslider.setOnMouseReleased(e -> c.setScaleX(slider.getValue()));",
      "options": [
        "A skaliert kontinuierlich beim Schieben; B erst beim Loslassen der Maus",
        "Kein Unterschied",
        "A erst beim Loslassen; B kontinuierlich",
        "B kompiliert nicht, weil MouseEvent kein ActionEvent ist"
      ],
      "answer": 0,
      "explanation": "Binding spiegelt jede Wertänderung sofort (kann Performance kosten). Der MouseEvent-Handler (Node-Property onMouseReleased) reagiert erst beim Loslassen.",
      "source": {
        "title": "LE FXE: Ereignisbehandlung und Binding",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FXE-JavaFXEreignisUndBinding.pdf",
        "page": 15
      }
    },
    {
      "id": "q-gp2-2d-coord",
      "chapterId": "gp2-fx2d",
      "examStyle": "Verständnis (Koordinaten)",
      "question": "Wo liegt der Punkt (0|0) in einer JavaFX-Szene und in welche Richtung wächst y?",
      "options": [
        "Links unten, y nach oben",
        "Links oben, y nach unten",
        "Mitte, y nach oben",
        "Rechts oben, y nach unten"
      ],
      "answer": 1,
      "explanation": "Ursprung links oben; x nach rechts, y senkrecht nach unten (anders als in der Mathematik).",
      "source": {
        "title": "LE FX2: 2D-Grafik mit JavaFX",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FX2-2DGrafikJavaFX.pdf",
        "page": 3
      }
    },
    {
      "id": "q-gp2-2d-root",
      "chapterId": "gp2-fx2d",
      "examStyle": "Verständnis",
      "question": "Welche Wurzel eignet sich am besten, wenn Shapes an exakten Koordinaten gezeichnet werden sollen?",
      "options": [
        "GridPane",
        "VBox",
        "Group",
        "ScrollPane"
      ],
      "answer": 2,
      "explanation": "Group erlaubt eine genaue Positionierung der geometrischen Figuren; Layout-Panes ordnen ihre Kinder selbst an.",
      "source": {
        "title": "LE FX2: 2D-Grafik mit JavaFX",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_FX2-2DGrafikJavaFX.pdf",
        "page": 4
      }
    },
    {
      "id": "q-gp2-xml-wf",
      "chapterId": "gp2-xml",
      "examStyle": "XML-Syntax",
      "question": "Welches Dokument ist NICHT wohlgeformt?",
      "options": [
        "<kunden><kunde nr=\"1\">Egon</kunde></kunden>",
        "<kunden><kunde nr=\"1\"/><kunde nr=\"2\"/></kunden>",
        "<?xml version=\"1.0\"?><a><b>x &amp; y</b></a>",
        "<kunde><Name>Egon</name></kunde>"
      ],
      "answer": 3,
      "explanation": "XML unterscheidet Groß-/Kleinschreibung: <Name> wird nicht durch </name> geschlossen. Leere Elemente <kunde/> und &amp; sind korrekt.",
      "source": {
        "title": "LE JML: Java und XML",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
        "page": 17
      }
    },
    {
      "id": "q-gp2-xml-valid",
      "chapterId": "gp2-xml",
      "examStyle": "Verständnis",
      "question": "Was bedeutet „gültig“ (valid) bei XML?",
      "options": [
        "Das Dokument ist wohlgeformt UND entspricht einer DTD bzw. einem XML-Schema",
        "Das Dokument hält die XML-Syntaxregeln ein",
        "Das Dokument enthält kein Attribut",
        "Das Dokument lässt sich im Browser anzeigen"
      ],
      "answer": 0,
      "explanation": "Wohlgeformt = Syntaxregeln; gültig = zusätzlich konform zu DTD/Schema (prüft ein validierender Parser).",
      "source": {
        "title": "LE JML: Java und XML",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
        "page": 18
      }
    },
    {
      "id": "q-gp2-xml-dtd",
      "chapterId": "gp2-xml",
      "examStyle": "DTD lesen",
      "question": "DTD: `<!ELEMENT a (b?)> <!ELEMENT b (c*)> <!ELEMENT c (d+)>`. Welche Aussage stimmt?",
      "options": [
        "a muss genau ein b enthalten",
        "b darf beliebig viele (auch 0) c enthalten; jedes c mindestens ein d",
        "c darf leer sein",
        "b muss mindestens ein c enthalten"
      ],
      "answer": 1,
      "explanation": "? = 0 oder 1, * = 0..n, + = 1..n. Also: a hat optional ein b, b beliebig viele c, c mindestens ein d.",
      "source": {
        "title": "LE JML: Java und XML",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
        "page": 28
      }
    },
    {
      "id": "q-gp2-xml-dom",
      "chapterId": "gp2-xml",
      "examStyle": "KA-Praxis (DOM lesen)",
      "question": "Welche Reihenfolge liefert ein DOM-Document aus einer Datei?",
      "options": [
        "new Document(new File(name))",
        "SAXParserFactory → DefaultHandler → getDocumentElement()",
        "DocumentBuilderFactory.newInstance() → newDocumentBuilder() → parse(new File(name))",
        "TransformerFactory → transform(file)"
      ],
      "answer": 2,
      "explanation": "DOM-Lesen: Factory erzeugen, DocumentBuilder erzeugen, parse(File). SAX arbeitet ereignisbasiert ohne Document; Transformer dient zum Speichern.",
      "source": {
        "title": "LE JML: Java und XML",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
        "page": 38
      }
    },
    {
      "id": "q-gp2-xml-save",
      "chapterId": "gp2-xml",
      "examStyle": "KA-Praxis (DOM speichern)",
      "question": "Wie speicherst du ein im Speicher erzeugtes DOM-Document in eine Datei?",
      "options": [
        "doc.save(\"data/k.xml\");",
        "builder.parse(doc, \"data/k.xml\");",
        "new PrintWriter(\"data/k.xml\").println(doc);",
        "transformer.transform(new DOMSource(doc), new StreamResult(new File(\"data/k.xml\")));"
      ],
      "answer": 3,
      "explanation": "JML 5.4: TransformerFactory → Transformer → transform(Source, Result) mit DOMSource und StreamResult(File).",
      "source": {
        "title": "LE JML: Java und XML",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
        "page": 41
      }
    },
    {
      "id": "q-gp2-xml-sax",
      "chapterId": "gp2-xml",
      "examStyle": "Parser-Auswahl",
      "question": "Du willst Kontakte laden, ändern, einzelne löschen und wieder speichern. Welcher Parser passt laut JML?",
      "options": [
        "DOM – ganzer Baum im Speicher, wiederholter Zugriff und Änderungen möglich",
        "SAX – ereignisgesteuert und schnell",
        "Keiner, XML kann nicht geändert werden",
        "Ein CSS-Stylesheet"
      ],
      "answer": 0,
      "explanation": "Mit DOM kann man auf bereits verarbeitete Teile wiederholt zugreifen und die Struktur ändern (removeChild, setAttribute …). SAX liest nur sequentiell.",
      "source": {
        "title": "LE JML: Java und XML",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
        "page": 32
      }
    },
    {
      "id": "q-gp2-xml-escape",
      "chapterId": "gp2-xml",
      "examStyle": "XML-Syntax",
      "question": "Wie muss der Firmenname „Müller & Söhne“ als Elementinhalt geschrieben werden?",
      "options": [
        "Müller & Söhne",
        "Müller &amp; Söhne",
        "Müller \\& Söhne",
        "\"Müller & Söhne\""
      ],
      "answer": 1,
      "explanation": "Sonderzeichen wie & dürfen nicht direkt im Inhalt stehen; & wird als &amp; geschrieben (analog &lt; &gt; &quot; &apos;). createTextNode erledigt das Escaping beim Speichern automatisch.",
      "source": {
        "title": "LE JML: Java und XML",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_JML-JavaUndXML.pdf",
        "page": 18
      }
    },
    {
      "id": "q-gp2-rek",
      "chapterId": "gp2-rek-xml-lst",
      "examStyle": "Code-Tracing (Rekursion)",
      "question": "Welchen Wert liefert `calc(4)`?",
      "code": "int calc(int n) {\n    if (n <= 1) return 1;\n    return n + calc(n - 1);\n}",
      "options": [
        "24",
        "9",
        "10",
        "StackOverflowError"
      ],
      "answer": 2,
      "explanation": "calc(4) = 4 + calc(3) = 4 + 3 + calc(2) = 4 + 3 + 2 + calc(1) = 4 + 3 + 2 + 1 = 10. (24 wäre die Fakultät mit *.)",
      "source": {
        "title": "LE REK: Rekursion",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_REK-Rekursion.pdf",
        "page": 7
      }
    },
    {
      "id": "q-gp2-rek-order",
      "chapterId": "gp2-rek-xml-lst",
      "examStyle": "Code-Tracing (Rekursion)",
      "question": "Was gibt p(3) aus?",
      "code": "static void p(int n) {\n  if (n > 0) {\n    p(n - 1);\n    System.out.print(n + \" \");\n  }\n}",
      "options": [
        "3 2 1",
        "Nichts",
        "3 2 1 0",
        "1 2 3"
      ],
      "answer": 3,
      "explanation": "Die Ausgabe steht NACH dem rekursiven Aufruf → sie wird erst beim Zurückkehren ausgeführt: zuerst p(1) gibt 1 aus, dann 2, dann 3. Stünde die Ausgabe davor, käme „3 2 1“.",
      "source": {
        "title": "LE REK: Rekursion",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_REK-Rekursion.pdf",
        "page": 9
      }
    },
    {
      "id": "q-gp2-rek-hanoi",
      "chapterId": "gp2-rek-xml-lst",
      "examStyle": "Verständnis",
      "question": "Wie viele Scheibenbewegungen braucht hanoi(3, …)?",
      "options": [
        "7",
        "6",
        "3",
        "8"
      ],
      "answer": 0,
      "explanation": "2^n − 1 = 2^3 − 1 = 7 (Tabelle in REK: 2→3, 3→7, 4→15). Verifiziert mit Zähler im Code.",
      "source": {
        "title": "LE REK: Rekursion",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_REK-Rekursion.pdf",
        "page": 17
      }
    },
    {
      "id": "q-gp2-lst-stack",
      "chapterId": "gp2-rek-xml-lst",
      "examStyle": "Code-Tracing (Stapel)",
      "question": "Nach push(1), push(2), push(3): Was liefern zwei pop()-Aufrufe?",
      "options": [
        "1 2",
        "3 2",
        "3 1",
        "2 3"
      ],
      "answer": 1,
      "explanation": "Stapel = LIFO: zuletzt eingefügt wird zuerst entfernt → 3, dann 2. Eine Warteschlange (FIFO) lieferte 1, 2.",
      "source": {
        "title": "LE LST: Listen",
        "path": "moodle-data/gdp2/lerneinheiten/VFHGP2_LST-Listen.pdf",
        "page": 63
      }
    }
  ]
};
