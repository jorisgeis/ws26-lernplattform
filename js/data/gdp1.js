// Grundlagen der Programmierung 1 (GP1) — WS 26/27 (Prof. Dr. G. J. Veltink)
// Grounded in: GP1_Probeklausur.pdf (100 P, 120 Min), GP1-Wochenplan, Foliensätze 01–10,
// VFH-Lerneinheiten (EIP, PJA, EJP, VAR, STA, OBJ, KLA, VER, ITR, VRB, EXC, ARR, ZKT), Code Conventions.
// Alle Code-Tracing-Ausgaben wurden mit OpenJDK (java/javac, Kursniveau Java 17) geprüft.
// Klausur-Analyse: docs/klausur-analyse/gdp1.md
export const GDP1_DATA = {
  "courseId": "gdp1",
  "chapters": [
    {
      "id": "gp1-context",
      "title": "1. Java-Kontext: Compiler, JVM & erstes OO-Programm",
      "badge": "Grundlagen",
      "examWeight": 1,
      "diagram": "java-compilation",
      "sources": [
        {
          "title": "Folien 02 Java-Kontext",
          "path": "moodle-data/gdp1/files/02. Java-Kontext/GP1_26WS_02_Java-Kontext.pdf",
          "page": 7
        },
        {
          "title": "Folien 03 Erste Schritte (HelloMessage)",
          "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
          "page": 36
        },
        {
          "title": "Folien 06 Benutzerinteraktion",
          "path": "moodle-data/gdp1/files/06. Benutzerinteraktion/GP1_26WS_06_Benutzerinteraktion.pdf",
          "page": 4
        },
        {
          "title": "VFH EJP – Das erste Java-Programm",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EJP-DasErsteJavaProgramm.pdf",
          "page": 20
        },
        {
          "title": "VFH PJA – Plattformunabhängigkeit",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_PJA-DieProgrammierspracheJava.pdf",
          "page": 9
        }
      ],
      "summary": [
        "<strong>Compiler vs. Interpreter:</strong> Ein Compiler übersetzt den <em>gesamten</em> Quelltext vorab in Maschinencode für <em>eine</em> CPU; ein Interpreter setzt das Programm Zeile für Zeile zur Laufzeit um. Java kombiniert beides: <code>javac</code> erzeugt <strong>Bytecode</strong> (<code>.class</code>), den die <strong>JVM</strong> auf jeder Plattform interpretiert (architekturneutral, portabel).",
        "<strong>Kommandozeile:</strong> <code>javac HelloMessage.java</code> (mit Endung) &rarr; <code>java HelloMessage</code> (Klassenname, <em>ohne</em> <code>.class</code>). Dateiname = Name der <code>public</code> Klasse; Java ist <em>case-sensitiv</em>. In GP1 keine IDE, OpenJDK 17.",
        "<strong>Sicherheit der Sprache:</strong> keine Zeiger, Array-Grenzen werden überwacht, kein Präprozessor, keine überladenen Operatoren, <strong>Garbage Collection</strong> gibt nicht mehr referenzierten Speicher automatisch frei; die JVM-Sandbox überwacht z.&nbsp;B. Datei- und Netzwerkzugriffe.",
        "<strong>Erstes OO-Programm:</strong> <code>HelloMessage</code> (Methode <code>show()</code>) + <code>HelloMessageTester</code> (<code>main</code> erzeugt mit <code>new</code> ein Objekt und ruft <code>myMsg.show()</code>). 4 Ebenen: Klasse &rarr; Methode &rarr; Anweisung &rarr; Sichtbarkeit. Abgaberegel: <em>Kein <code>new</code> in <code>main</code> &rArr; nicht objektorientiert.</em>",
        "<strong>Klasse <code>System</code> (static):</strong> <code>System.out</code> (Ausgabe), <code>System.err</code> (Fehlerausgabe), <code>System.in</code> (Eingabe), <code>System.exit(status)</code> beendet sofort. <code>main(String[] args)</code> erhält Kommandozeilenparameter immer als <em>Strings</em> &rarr; <code>Integer.parseInt(args[0])</code>, <code>Double.parseDouble(…)</code>."
      ],
      "feynman": {
        "prompt": "Erkläre, wie aus HelloMessage.java ein laufendes Programm wird und warum dasselbe .class-File unter Windows, macOS und Linux läuft.",
        "rubric": [
          "javac übersetzt den Quelltext in plattformunabhängigen Bytecode (.class), nicht in Maschinencode.",
          "Die JVM (Java Runtime) der jeweiligen Plattform interpretiert den Bytecode und führt ihn auf der CPU aus.",
          "Start mit java Klassenname (ohne .class); die Ausführung beginnt in public static void main(String[] args).",
          "Die Tester-Klasse erzeugt mit new ein Objekt und ruft dessen Methode auf (objektorientiert)."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp1-context",
        "courseId": "gdp1",
        "title": "GP1: Java-Kontext & Programmstart",
        "content": "Quelltext .java → javac → Bytecode .class → JVM (Interpreter) → CPU. javac Datei.java (mit Endung) · java Klasse (ohne .class). Dateiname = public-Klassenname. main: public static void main(String[] args). args = Strings → Integer.parseInt / Double.parseDouble. System.out / System.err / System.in / System.exit(code). Sicherheit: keine Zeiger, Array-Grenzen geprüft, Garbage Collection, Sandbox.",
        "code": "public class HelloMessageTester {\n    public static void main(String[] args) {\n        HelloMessage myMsg = new HelloMessage();\n        myMsg.show();\n    }\n}"
      }
    },
    {
      "id": "gp1-basics",
      "title": "2. Datentypen, Variablen & Typumwandlung",
      "badge": "Probeklausur 2 (14 P)",
      "examWeight": 3,
      "diagram": "gp1-widening",
      "sources": [
        {
          "title": "Probeklausur Aufgabe 2",
          "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
          "page": 3
        },
        {
          "title": "Folien 04 Datentypen",
          "path": "moodle-data/gdp1/files/04. Daten und Datentypen/GP1_26WS_04_Datentypen.pdf",
          "page": 12
        },
        {
          "title": "Folien 05 Variablen (Scope, Konstanten, Casting)",
          "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
          "page": 6
        },
        {
          "title": "VFH VAR – Type Casting",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VAR-VariablenUndPrimitiveDatentypen.pdf",
          "page": 33
        },
        {
          "title": "VFH STA – Sichtbarkeit lokaler Variablen",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_STA-StatischeMethodenUndKonstanten.pdf",
          "page": 40
        }
      ],
      "summary": [
        "<strong>8 primitive Datentypen:</strong> <code>boolean</code> (false/true), <code>char</code> (16 Bit Unicode, Standard <code>'\\u0000'</code>), <code>byte</code> 8, <code>short</code> 16, <code>int</code> 32, <code>long</code> 64 Bit (Standard 0), <code>float</code> 32, <code>double</code> 64 Bit (Standard 0.0, IEEE 754). Alles andere (Klassen, <code>String</code>, Arrays) sind <strong>Referenztypen</strong>: die Variable enthält nur einen Verweis.",
        "<strong>Literale:</strong> <code>4711</code> ist <code>int</code>, <code>4711L</code> <code>long</code>, <code>0xCAFE</code> hexadezimal, <code>017</code> oktal; <code>2.5</code> ist <code>double</code>, <code>2.5f</code> <code>float</code>; <code>'a'</code> ist <code>char</code>, <code>\"a\"</code> ein <code>String</code>. Bezeichner: Buchstabe/<code>_</code>/<code>$</code> zuerst, danach auch Ziffern (<code>Wolke7</code> ok, <code>7and7is</code> falsch).",
        "<strong>Variablenarten (Probeklausur 2):</strong> <em>Lokale Variable</em> &ndash; in Methode/Block deklariert, nur dort sichtbar, lebt bis Blockende, <strong>kein Standardwert</strong> (vor Benutzung zuweisen). <em>Instanzvariable</em> &ndash; in der Klasse außerhalb von Methoden, <strong>ein Exemplar pro Objekt</strong>, lebt so lange wie das Objekt, Standardwert 0/0.0/false/null. <em>Klassenvariable</em> (<code>static</code>) &ndash; <strong>genau einmal pro Klasse</strong>, von allen Objekten geteilt.",
        "<strong>Gültigkeitsbereich (Scope):</strong> Variablen sind nur in dem Block <code>{ … }</code> sichtbar, in dem sie deklariert wurden &ndash; auch die Laufvariable aus <code>for (int i = …)</code>. Konstanten: <code>static final int MAX_COUNT = 12;</code> (nur einmal zuweisbar, Name in GROSSBUCHSTABEN mit <code>_</code>).",
        "<strong>Typumwandlung:</strong> <em>implizit</em> (Typerweiterung) von „klein“ nach „groß“ ohne Informationsverlust: <code>byte &rarr; short &rarr; int &rarr; long &rarr; float &rarr; double</code>, <code>char &rarr; int</code> &ndash; macht der Compiler automatisch. <em>Explizit</em> (Typeinengung) von „groß“ nach „klein“ mit Cast-Operator: <code>int i = (int) 3.9;</code> &rarr; <code>3</code> (Nachkommastellen abgeschnitten, <em>nicht</em> gerundet). <code>boolean</code> ist mit keinem Zahlentyp kompatibel.",
        "<strong>Fallen:</strong> <code>byte + byte</code> und <code>short + short</code> ergeben <code>int</code> &rarr; <code>(byte) (c + b)</code> nötig (Klammern, da Cast stärker bindet). <code>float f = 3.14;</code> ist ein Compile-Fehler (<code>3.14</code> ist <code>double</code>) &rarr; <code>3.14f</code>."
      ],
      "feynman": {
        "prompt": "Beantworte Probeklausur 2.b und 2.c mündlich: Wann setzt man lokale Variablen und Instanzvariablen ein, wie unterscheiden sie sich in Lebensdauer und Sichtbarkeit – und wann darf der Compiler eine Typumwandlung implizit durchführen?",
        "rubric": [
          "Lokale Variable: Zwischenergebnis innerhalb einer Methode; sichtbar nur im deklarierenden Block; lebt nur während der Ausführung des Blocks; muss vor Gebrauch initialisiert werden.",
          "Instanzvariable: Zustand/Eigenschaft eines Objekts; in allen (Instanz-)Methoden der Klasse sichtbar (nach außen je nach Modifizierer); lebt so lange wie das Objekt; Standardwert 0/false/null.",
          "Implizit nur bei Typerweiterung (kleiner → größerer Wertebereich, kein Informationsverlust), z. B. int → double.",
          "Typeinengung (z. B. double → int) nur explizit mit Cast (int) – Informationsverlust möglich (3.9 → 3)."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp1-vars",
        "courseId": "gdp1",
        "title": "GP1: Datentypen, Variablenarten & Casting",
        "content": "byte 8 · short 16 · int 32 · long 64 · float 32 · double 64 · char 16 (Unicode) · boolean. Widening implizit: byte→short→int→long→float→double, char→int. Narrowing explizit: (int) 3.9 → 3 (abschneiden!). byte+byte = int. 3.14 = double → float braucht 3.14f. Lokal: Block, kein Default, lebt bis Blockende. Instanz: pro Objekt, Default 0/0.0/false/null, lebt mit Objekt. static: 1× pro Klasse, geteilt. Konstante: static final MAX_WERT.",
        "code": "public class MyClass {\n    private double instanceVar;      // Instanzvariable (Gleitkomma)\n    private static int counter;      // Klassenvariable\n\n    public void doSomething() {\n        int localVar = 42;           // lokale Variable (Ganzzahl)\n        instanceVar = localVar;      // implizit int -> double\n        int back = (int) instanceVar; // explizit double -> int\n    }\n}"
      }
    },
    {
      "id": "gp1-operators",
      "title": "3. Operatoren & Ausdrücke (Inkrement, Division, Auswertung)",
      "badge": "Probeklausur 5 (6 P)",
      "examWeight": 3,
      "sources": [
        {
          "title": "Probeklausur Aufgabe 5",
          "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
          "page": 6
        },
        {
          "title": "Folien 05 Ausdrücke & Operatoren",
          "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
          "page": 14
        },
        {
          "title": "VFH VAR – Arithmetische Operatoren",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VAR-VariablenUndPrimitiveDatentypen.pdf",
          "page": 15
        },
        {
          "title": "Folien 10 Ausdrücke & trinärer Operator",
          "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
          "page": 27
        }
      ],
      "summary": [
        "<strong>Ganzzahldivision:</strong> Stehen bei <code>/</code> zwei Ganzzahlen, wird der Rest abgeschnitten: <code>7 / 2 == 3</code>, Rest mit <code>%</code>: <code>7 % 2 == 1</code>. Erst wenn ein Operand <code>double</code> ist, wird mit Nachkommastellen gerechnet: <code>(double) 7 / 2 == 3.5</code>, aber <code>(double) (7 / 2) == 3.0</code>.",
        "<strong>Prä- vs. Post-Inkrement:</strong> <code>++x</code> erhöht <em>zuerst</em> und liefert den neuen Wert; <code>x++</code> liefert den <em>alten</em> Wert und erhöht danach. Gilt auch in Bedingungen: <code>while (a++ &lt;= 3)</code> erhöht <code>a</code> <strong>auch beim letzten, falschen Test</strong>.",
        "<strong>Auswertungsregeln:</strong> Punkt vor Strich; gleiche Bindung links-assoziativ (<code>a - b + c == (a - b) + c</code>); Operanden <strong>immer von links nach rechts</strong>: mit <code>i = 2</code> ergibt <code>(i = 3) * i</code> den Wert <code>9</code>. Bei Unsicherheit klammern!",
        "<strong>Logische Operatoren:</strong> <code>&amp;&amp;</code> / <code>||</code> werten kurzschließend aus (rechter Teil entfällt, wenn das Ergebnis feststeht); <code>&amp;</code> / <code>|</code> werten <em>immer beide</em> Seiten aus; <code>^</code> = exklusives ODER; <code>!</code> = NICHT. <code>==</code> vergleicht bei Referenztypen die <em>Identität</em> (gleiches Objekt).",
        "<strong>Sonstige:</strong> Zuweisungsoperatoren <code>+= -= *= /= %=</code>; Bedingungsoperator <code>min = (a &lt; b) ? a : b;</code>; String-Verkettung <code>+</code> von links nach rechts: <code>1 + 2 + \"3\"</code> &rarr; <code>\"33\"</code>, aber <code>\"3\" + 1 + 2</code> &rarr; <code>\"312\"</code>. Ausdrücke haben einen Wert: <code>return x &lt;= y;</code> statt <code>if … return true; else return false;</code>."
      ],
      "feynman": {
        "prompt": "Probeklausur 5.a: Gehe int a = 2; int b = 3; while (a++ <= 3) { b = a - --b; } Schritt für Schritt mit einer Wertetabelle durch und begründe die Ausgabe \"5 4\".",
        "rubric": [
          "Test 1: vergleicht 2 <= 3 (true), danach a = 3; Rumpf: --b macht b = 2, b = 3 - 2 = 1.",
          "Test 2: vergleicht 3 <= 3 (true), danach a = 4; Rumpf: --b macht b = 0, b = 4 - 0 = 4.",
          "Test 3: vergleicht 4 <= 3 (false) – Post-Inkrement wird trotzdem ausgeführt: a = 5. Ausgabe \"5 4\".",
          "Methode: pro Variable eine Spalte, pro Bedingungsprüfung/Anweisung eine Zeile."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp1-operators",
        "courseId": "gdp1",
        "title": "GP1: Operatoren-Fallen fürs Tracing",
        "content": "int/int = Ganzzahl (7/2=3), % = Rest. ++x: erst erhöhen, dann Wert · x++: alter Wert, dann erhöhen (auch bei false-Bedingung!). Operanden links→rechts: (i=3)*i = 9. && || kurzschließend, & | immer beide Seiten. ?: → Wert. String + : links→rechts (1+2+\"3\" = \"33\"). == bei Objekten = Identität. Rangfolge: postfix > unär > * / % > + - > < > <= >= instanceof > == != > & > ^ > | > && > || > ?: > =. Unsicher → klammern.",
        "code": "int a = 5;\nint b = a++ + ++a;   // 5 + 7 = 12, a = 7\nint i = 2;\nint r = (i = 3) * i; // 9\ndouble d = (double) 7 / 2; // 3.5"
      }
    },
    {
      "id": "gp1-control",
      "title": "4. Verzweigungen: if, else & switch",
      "badge": "Probeklausur 3 (10 P)",
      "examWeight": 3,
      "diagram": "gp1-switch-fallthrough",
      "sources": [
        {
          "title": "Probeklausur Aufgabe 3",
          "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
          "page": 4
        },
        {
          "title": "Folien 07 Kontrollfluss (if/switch)",
          "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
          "page": 12
        },
        {
          "title": "VFH VER – Einfach- und Mehrfachverzweigung",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VER-EinfachUndMehrfachverzweigung.pdf",
          "page": 23
        },
        {
          "title": "Folien 06 bedingte Anweisung",
          "path": "moodle-data/gdp1/files/06. Benutzerinteraktion/GP1_26WS_06_Benutzerinteraktion.pdf",
          "page": 3
        }
      ],
      "summary": [
        "<strong>if/else:</strong> Die Bedingung muss vom Typ <code>boolean</code> sein (<code>==</code>, nicht <code>=</code>!). Ohne <code>{ }</code> gehört <strong>nur die nächste Anweisung</strong> zum <code>if</code> bzw. <code>else</code> &ndash; die Einrückung ist dem Compiler egal (Probeklausur 3.b).",
        "<strong>Dangling else:</strong> Ein <code>else</code> gehört immer zum <em>nächstgelegenen vorherigen</em> <code>if</code> ohne <code>else</code>. Durch Blöcke <code>{ }</code> legt man die Zuordnung eindeutig fest.",
        "<strong>Leere Anweisung:</strong> <code>if (x &gt; 5);</code> &ndash; das Semikolon ist die (leere) Anweisung des <code>if</code>; der folgende Block wird <em>immer</em> ausgeführt.",
        "<strong>switch (Folien):</strong> Ausdruck vom Typ <code>char, byte, short, int</code> (laut VFH VER auch <code>String</code>/Enum). Es wird zum passenden <code>case</code> gesprungen; <strong>ohne <code>break</code> läuft die Ausführung in die folgenden Zweige weiter (Fall-Through)</strong> &ndash; auch in <code>default</code> &ndash; bis <code>break</code> oder Ende. <code>default</code> greift, wenn kein <code>case</code> passt (Konvention: als letzter Zweig). Gewollten Fall-Through mit <code>/* falls through */</code> kommentieren.",
        "<strong>Neue switch-Syntax (seit Java 14):</strong> <code>case 'a', 'e' -&gt; { … }</code> &ndash; kein Fall-Through, kein <code>break</code> nötig.",
        "<strong>Probeklausur-Lösungen:</strong> 3.a (<code>selector = 1</code>) &rarr; <code>EinsZweiFertig!</code>; 3.b &rarr; <code>14 4</code> (nur <code>a = 2 * b;</code> gehört zum <code>if</code>)."
      ],
      "feynman": {
        "prompt": "Erkläre an Probeklausur 3.a und 3.b, warum der Bildschirm \"EinsZweiFertig!\" bzw. \"14 4\" zeigt – und wie man beide Fallen beim Lesen von Code sicher erkennt.",
        "rubric": [
          "switch springt zu case 1, gibt \"Eins\" aus; ohne break Fall-Through zu case 2 (\"Zwei\"); break beendet den switch; danach \"Fertig!\".",
          "if ohne {}: nur a = 2 * b; ist bedingt; 5 >= 6 ist false, also wird nur diese Zeile übersprungen.",
          "a++ und b++ werden immer ausgeführt (a = 6, b = 4), danach a = 6 + 2 * 4 = 14.",
          "Regel: Code nach Klammern lesen, nicht nach Einrückung; bei switch nach jedem case prüfen, ob ein break folgt."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp1-control",
        "courseId": "gdp1",
        "title": "GP1: if/switch-Fallen",
        "content": "if (Bedingung) braucht boolean → == statt =. Ohne {} gilt nur EINE Anweisung (Einrückung täuscht!). else gehört zum nächsten if ohne else. if (x); {…} → Block läuft immer. switch-Ausdruck: char/byte/short/int (+ String, Enum; NICHT long/boolean). Einstieg beim passenden case, dann Fall-Through bis break/Ende (auch durch default!). Kein Treffer → default (wenn vorhanden). Pfeil-Syntax case x -> {} ohne Fall-Through.",
        "code": "switch (selector) {      // selector = 1\n    case 0: print(\"Null\");\n    case 1: print(\"Eins\");  // Einstieg\n    case 2: print(\"Zwei\");  // Fall-Through\n            break;          // Ende\n    default: print(\"Oder?\");\n}                           // -> EinsZwei"
      }
    },
    {
      "id": "gp1-loops",
      "title": "5. Schleifen, break/continue & Refactoring",
      "badge": "Probeklausur 6 (14 P)",
      "examWeight": 3,
      "diagram": "gp1-loop-types",
      "sources": [
        {
          "title": "Probeklausur Aufgabe 6",
          "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
          "page": 7
        },
        {
          "title": "Folien 07 Kontrollfluss (Schleifen)",
          "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
          "page": 23
        },
        {
          "title": "VFH ITR – Äquivalenz for/while",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ITR-Iterationen.pdf",
          "page": 29
        },
        {
          "title": "VFH ITR – Zusammenfassung",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ITR-Iterationen.pdf",
          "page": 41
        }
      ],
      "summary": [
        "<strong>while</strong> (kopfgesteuert, abweisend): Bedingung wird <em>vor</em> jedem Durchlauf geprüft &ndash; ist sie sofort falsch, läuft der Rumpf nie. <strong>do-while</strong> (fußgesteuert): Rumpf läuft <em>mindestens einmal</em>; Semikolon nach <code>while (…);</code> nicht vergessen.",
        "<strong>for</strong> (zählergesteuert, vorprüfend): <code>for (Init; Bedingung; Update)</code>; alle drei Teile optional (<code>for (;;)</code> = Endlosschleife); mehrere Updates mit Komma. Eine im Kopf deklarierte Laufvariable existiert nur in der Schleife. <strong>foreach</strong>: <code>for (String str : args)</code> durchläuft alle Elemente (nur lesend sinnvoll).",
        "<strong>for &harr; while (Probeklausur 6.b):</strong> <code>Init; while (Bedingung) { Rumpf; Update; }</code> &ndash; Update(s) ans <em>Ende</em> des Rumpfes. Faustregel: for bei einem Zähler, sonst while.",
        "<strong>break</strong> verlässt die (innerste) Schleife, <strong>continue</strong> beginnt sofort die nächste Iteration; mit Label (<code>outerLoop:</code>) wirken beide auf die äußere Schleife. Jede Schleife muss terminieren: mindestens eine Variable der Bedingung muss sich ändern.",
        "<strong>Probeklausur 6.a:</strong> <code>doIt(x)</code> gibt alle Zweierpotenzen von 2<sup>0</sup> bis 2<sup>x</sup> als „Exponent : Wert“ aus (<code>i</code> wird im <code>println</code> per <code>i++</code> erhöht, <code>j</code> im Update verdoppelt). 6.b: in while-Schleife umschreiben + sprechende Namen (Methode = Verb, z.&nbsp;B. <code>printPowersOfTwo</code>; Variablen = Nomen, z.&nbsp;B. <code>exponent</code>, <code>power</code>). 6.c: JavaDoc mit Beschreibung + <code>@param</code>."
      ],
      "feynman": {
        "prompt": "Probeklausur 6: Erkläre, was doIt(int x) macht, schreibe die for-Schleife als saubere while-Schleife mit guten Namen und dokumentiere die Methode mit JavaDoc.",
        "rubric": [
          "Analyse: Ausgabe der Zweierpotenzen 2^0 … 2^x, jeweils \"Exponent : Wert\" pro Zeile (x+1 Zeilen).",
          "Refactoring: Initialisierung (exponent = 0, power = 1) vor die Schleife, Bedingung exponent <= maxExponent in while, Ausgabe, dann exponent++ und power *= 2 am Rumpfende.",
          "Namen: Methode als Verb (printPowersOfTwo), Parameter/Variablen als Nomen (maxExponent, exponent, power), englisch, camelCase.",
          "JavaDoc: /** erster Satz mit Punkt, @param maxExponent mit Beschreibung */ direkt vor der Methode."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp1-loops",
        "courseId": "gdp1",
        "title": "GP1: Schleifen & Refactoring (Aufgabe 6)",
        "content": "while: prüft vorher (evtl. 0×). do { } while (b); prüft nachher (≥1×, Semikolon!). for (init; bed; upd): vorprüfend, Laufvariable nur in Schleife. foreach: for (Typ e : array). for→while: init; while (bed) { rumpf; upd; }. break = innerste Schleife verlassen, continue = nächste Iteration, Label für äußere. doIt(x) = Zweierpotenzen 2^0..2^x.",
        "code": "/**\n * Prints all powers of two from 2^0 up to 2^maxExponent.\n *\n * @param maxExponent the largest exponent to print\n */\npublic static void printPowersOfTwo(int maxExponent) {\n    int exponent = 0;\n    int power = 1;\n\n    while (exponent <= maxExponent) {\n        System.out.println(exponent + \" : \" + power);\n        exponent++;\n        power = power * 2;\n    }\n}"
      }
    },
    {
      "id": "gp1-debug",
      "title": "6. Fehlersuche: Compile-, Laufzeit- & Logikfehler",
      "badge": "Probeklausur 4 (8 P)",
      "examWeight": 3,
      "sources": [
        {
          "title": "Probeklausur Aufgabe 4",
          "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
          "page": 5
        },
        {
          "title": "Folien 05 Gültigkeitsbereich",
          "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
          "page": 6
        },
        {
          "title": "Folien 07 if-Anweisung („== nicht =“)",
          "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
          "page": 13
        },
        {
          "title": "Folien 07 do-Anweisung (Semikolon)",
          "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
          "page": 28
        },
        {
          "title": "VFH VRB – Konstruktoren in erbenden Klassen",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
          "page": 17
        }
      ],
      "summary": [
        "<strong>Probeklausur 4.a (TestBed):</strong> Zeile 07 <code>if (j = 3)</code> ist eine <code>int</code>-Zuweisung statt eines <code>boolean</code>-Vergleichs &rarr; <code>if (j == 3)</code>. Zeile 14 <code>System.out.println(j);</code> &ndash; <code>j</code> wurde im <code>for</code>-Kopf deklariert und ist außerhalb der Schleife unbekannt &rarr; <code>j</code> vor der Schleife deklarieren. In der Antwort immer <em>Zeile + Fehler + Korrektur</em> nennen.",
        "<strong>Typische Compile-Fehler:</strong> Variable außerhalb ihres Blocks benutzt; lokale Variable nicht initialisiert („might not have been initialized“); <code>float f = 3.14;</code> / <code>byte b = c + 2;</code> (Typeinengung ohne Cast); Instanzvariable/-methode aus <code>static</code>-Kontext; Zuweisung an <code>final</code>-Konstante; fehlendes <code>return</code> in nicht-<code>void</code>-Methode; fehlendes Semikolon nach <code>do { } while (…)</code>; Zugriff auf <code>private</code> Attribut von außen.",
        "<strong>OOP-Compile-Fehler:</strong> <code>new</code> einer <code>abstract</code> Klasse; konkrete Unterklasse implementiert nicht alle abstrakten Methoden; <code>super(…)</code> nicht als erste Anweisung (Java 17); Oberklasse hat keinen parameterlosen Konstruktor und Unterklasse ruft <code>super(…)</code> nicht auf; Überladen nur durch Rückgabetyp; Ableiten von <code>final</code> Klasse.",
        "<strong>Laufzeitfehler (Exceptions):</strong> <code>10 / 0</code> mit <code>int</code> &rarr; <code>ArithmeticException</code>; Index <code>a.length</code> &rarr; <code>ArrayIndexOutOfBoundsException</code>; Methodenaufruf auf <code>null</code> &rarr; <code>NullPointerException</code>; falscher Cast &rarr; <code>ClassCastException</code>.",
        "<strong>Logikfehler (kompiliert, falsches Ergebnis):</strong> <code>if (x &gt; 5);</code> leere Anweisung; Setter <code>name = name;</code> ohne <code>this.</code> (Parameter verdeckt das Attribut); Off-by-one (<code>&lt;=</code> statt <code>&lt;</code>); Endlosschleife, weil sich die Bedingungsvariable nie ändert; <code>==</code> statt <code>equals</code> bei Strings."
      ],
      "feynman": {
        "prompt": "Probeklausur 4.a: Erkläre die beiden Fehler im Programm TestBed so, dass ein Kommilitone sie beim nächsten Mal selbst findet – inklusive Korrektur.",
        "rubric": [
          "Zeile 07: if (j = 3) – Zuweisung liefert int, if verlangt boolean → Compile-Fehler; richtig: j == 3.",
          "Zeile 14: j ist im for-Kopf deklariert, sein Scope endet mit der Schleife → \"cannot find symbol\"; Lösung: int j; vor der Schleife deklarieren.",
          "Antwortschema: Zeilennummer, Fehlerursache, korrigierter Code.",
          "Allgemeine Checkliste: = vs ==, Scope, Initialisierung, Typen/Casts, Semikolons, static-Kontext."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp1-debug",
        "courseId": "gdp1",
        "title": "GP1: Fehler-Checkliste (Aufgabe 4)",
        "content": "Zeile + Fehler + Korrektur angeben! Compile: = statt == · Variable außerhalb Scope (for-Laufvariable!) · lokale Var. nicht initialisiert · float f = 3.14 / byte = byte+byte ohne Cast · static greift auf Instanz zu · final neu zugewiesen · return fehlt · ; nach do-while fehlt · private von außen · new abstract · abstrakte Methode nicht implementiert · super() nicht 1. Zeile · Überladen nur per Rückgabetyp. Laufzeit: /0 → ArithmeticException, a[a.length] → ArrayIndexOutOfBounds, null.m() → NullPointer. Logik: if(..); · name = name; · <= vs < · Endlosschleife · == bei Strings.",
        "code": "int j;                      // vor der Schleife!\nfor (j = 2; j < 5; ++j) {\n    if (j == 3) {           // == statt =\n        j++;\n    } else {\n        --j;\n        break;\n    }\n}\nSystem.out.println(j);"
      }
    },
    {
      "id": "gp1-javadoc",
      "title": "7. JavaDoc, Code Conventions & Checkstyle",
      "badge": "Probeklausur 6.c / 8.a",
      "examWeight": 3,
      "sources": [
        {
          "title": "Folien 03 Kommentare & JavaDoc",
          "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
          "page": 14
        },
        {
          "title": "Folien 03 JavaDoc-Tags",
          "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
          "page": 23
        },
        {
          "title": "Folien 03 Code Conventions & Namensgebung",
          "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
          "page": 7
        },
        {
          "title": "Probeklausur Aufgabe 8 (Shape mit JavaDoc)",
          "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
          "page": 9
        },
        {
          "title": "Code Conventions (deutsch)",
          "path": "moodle-data/gdp1/files/CodeConventions_deutsch_v1_2.pdf",
          "page": 6
        },
        {
          "title": "VFH EJP – Dokumentation",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EJP-DasErsteJavaProgramm.pdf",
          "page": 31
        }
      ],
      "summary": [
        "<strong>3 Kommentararten:</strong> <code>// Zeilenkommentar</code>, <code>/* Blockkommentar */</code>, <code>/** Dokumentationskommentar (JavaDoc) */</code>. JavaDoc steht <em>unmittelbar vor</em> Klasse, Konstruktor, Methode oder Instanzvariable; der erste Satz (mit Punkt abschließen!) wird zur Kurzbeschreibung.",
        "<strong>Wichtige Tags:</strong> <code>@author name</code> und <code>@version version</code> (Klasse), <code>@param name Beschreibung</code> (je Parameter), <code>@return Beschreibung</code> (bei nicht-<code>void</code>), <code>@throws Klasse Beschreibung</code>, <code>@see</code>, <code>@since</code>, <code>@deprecated</code>.",
        "<strong>Datei-Header:</strong> Blockkommentar mit Dateiname, Copyright-Vermerk und Logbuch der Änderungen (Version, Datum, Kürzel). Aufruf: <code>javadoc -d doc -private -author -version *.java</code> (<code>-d</code> = Zielverzeichnis, <code>-private</code> = alles dokumentieren).",
        "<strong>Code Conventions:</strong> Einrückung 4 Leerzeichen (keine Tabs), Zeilen &le; 100 Zeichen (Kurs), <code>{</code> am Zeilenende, Leerzeichen um Operatoren. Namen: Klassen = Nomen im Singular, groß (<code>Person</code>); Variablen klein, camelCase (<code>myOwnVar</code>), Booleans als Zustand (<code>ready</code>); Methoden = Verb + Rest (<code>calculateSum</code>); Konstanten <code>MAX_VALUE</code>; Deutsch und Englisch nicht mischen; „Magic Numbers“ durch Konstanten ersetzen.",
        "<strong>Checkstyle:</strong> <em>Error</em> = Problem im Code (muss korrigiert werden), <em>Warning</em> = Verstoß gegen Code Conventions (muss korrigiert werden), <em>Info</em> = mögliches Problem (prüfen). Abgaben mit Errors/Warnings werden nicht akzeptiert (PVL!)."
      ],
      "feynman": {
        "prompt": "Dokumentiere mündlich eine Methode public double area() und eine Klasse Rectangle so, wie es Probeklausur 8.a verlangt. Welche Tags gehören wohin?",
        "rubric": [
          "Klassenkommentar /** … */ mit Kurzbeschreibung (Satz mit Punkt), @version und @author.",
          "Konstruktor/Methode: Beschreibung + je Parameter ein @param name Beschreibung.",
          "@return bei jeder Methode mit Rückgabewert (nicht bei void, nicht beim Konstruktor).",
          "Zusätzlich Datei-Header (/* Dateiname, Copyright */) und JavaDoc für Attribute; javadoc -d doc -private -author -version *.java erzeugt HTML."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp1-javadoc",
        "courseId": "gdp1",
        "title": "GP1: JavaDoc-Schablone & Konventionen",
        "content": "// Zeile · /* Block */ · /** JavaDoc */ direkt vor Klasse/Konstruktor/Methode/Attribut. 1. Satz endet mit Punkt. Klasse: @author, @version. Methode: @param je Parameter, @return (nicht bei void), @throws. javadoc -d doc -private -author -version *.java. Namen: Klasse Nomen Singular groß · methode verbCamelCase · variable nomenCamelCase · KONSTANTE_GROSS. 4 Leerzeichen, keine Tabs, ≤100 Zeichen/Zeile, keine Magic Numbers. Checkstyle Error/Warning = korrigieren, Info = prüfen.",
        "code": "/*\n * Rectangle.java\n *\n * Copyright (c) 2027 HS Emden/Leer\n * All Rights Reserved.\n */\n\n/**\n * A rectangle as a concrete shape.\n *\n * @version 1.00 26 Jan 2027\n * @author Max Muster\n */\n\n/**\n * Calculates the area of the rectangle.\n *\n * @return the area of the rectangle\n */"
      }
    },
    {
      "id": "gp1-classes",
      "title": "8. Klassen, Objekte, Konstruktoren & Datenkapselung",
      "badge": "Probeklausur 9.a + Basis für 8.a",
      "examWeight": 3,
      "sources": [
        {
          "title": "Probeklausur Aufgabe 9.a Datenkapselung",
          "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
          "page": 10
        },
        {
          "title": "Folien 09 OOP: Basiskonzepte",
          "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
          "page": 3
        },
        {
          "title": "Folien 09 Konstruktor & this",
          "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
          "page": 20
        },
        {
          "title": "Folien 08 Kapselung",
          "path": "moodle-data/gdp1/files/08. OOP_ Theorie/GP1_26WS_08_OOP_Theorie.pdf",
          "page": 14
        },
        {
          "title": "VFH KLA – Eigene Klassen programmieren",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_KLA-EigeneKlassenProgrammieren.pdf",
          "page": 33
        },
        {
          "title": "VFH OBJ – Referenzen & Vergleiche",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_OBJ-Objekte.pdf",
          "page": 43
        },
        {
          "title": "VFH PJA – Datenkapselung",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_PJA-DieProgrammierspracheJava.pdf",
          "page": 26
        }
      ],
      "summary": [
        "<strong>Klasse vs. Objekt:</strong> Die Klasse ist der Bauplan (Attribute = Zustand, Methoden = Verhalten); Objekte/Instanzen sind ihre Ausprägungen. <code>Car myCar = new Car(…);</code> &ndash; <code>new</code> reserviert Speicher und ruft den Konstruktor; <code>myCar</code> ist eine <em>Referenzvariable</em> (enthält den Verweis).",
        "<strong>Konstruktor:</strong> heißt wie die Klasse, hat <strong>keinen Rückgabetyp</strong> (auch nicht <code>void</code>), initialisiert alle Attribute. Ohne eigenen Konstruktor erzeugt der Compiler einen parameterlosen <em>Standardkonstruktor</em> &ndash; sobald man selbst einen schreibt, entfällt er. Konstruktoren können überladen werden; <code>this(…)</code> ruft einen anderen Konstruktor derselben Klasse und muss die <em>erste</em> Anweisung sein (z.&nbsp;B. Copy-Konstruktor <code>Car(Car other)</code>).",
        "<strong><code>this</code></strong> zeigt immer auf das aktuelle Objekt: <code>this.description = description;</code> unterscheidet Attribut und gleichnamigen Parameter. Getter liefern Attribute, Setter setzen sie &ndash; gern mit Kontrolle (<code>if (year &gt; 1900) this.year = year;</code>).",
        "<strong>Datenkapselung (Probeklausur 9.a):</strong> <em>Ziel</em>: Interna nach außen abschirmen, nur definierte Zugänge zulassen &rarr; keine unbeabsichtigten/ungültigen Datenänderungen, Interna später änderbar, Klasse muss nur „von außen“ verstanden werden. <em>Umsetzung in Java</em>: Attribute <code>private</code>, Zugriff nur über <code>public</code> Methoden (Getter/Setter mit Prüfungen) &ndash; „nur Methoden der Klasse können die Daten ändern“.",
        "<strong>Immutable Class:</strong> Objekt nach Erzeugung nicht mehr änderbar (keine Setter, Werte nur im Konstruktor) &ndash; Beispiel <code>String</code>. <code>final</code>-Attribute dürfen genau einmal (im Konstruktor) zugewiesen werden.",
        "<strong>Referenzen:</strong> <code>Car b = a;</code> kopiert nur die Referenz (beide zeigen auf dasselbe Objekt). <code>==</code> prüft Identität, <code>equals()</code> Inhaltsgleichheit (ohne Überschreiben erbt eine Klasse <code>Object.equals</code> = Identität). Ohne Objekt ist der Wert <code>null</code> &rarr; Methodenaufruf löst <code>NullPointerException</code> aus."
      ],
      "feynman": {
        "prompt": "Probeklausur 9.a: Was soll mit Datenkapselung erreicht werden und wie wird sie in Java umgesetzt? Erkläre es am Beispiel Car.setYear(int year).",
        "rubric": [
          "Ziel: Schutz der Daten vor unkontrolliertem Zugriff; Zustand bleibt gültig; Implementierung kann geändert werden, ohne Nutzer der Klasse zu beeinflussen.",
          "Umsetzung: Attribute private; öffentliche Methoden (Getter/Setter) als einzige Schnittstelle.",
          "Setter prüft Werte (year > 1900), bevor er sie mit this.year = year übernimmt.",
          "Folge: myCar.year = 1999 von außen ist ein Compile-Fehler (\"has private access\")."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp1-classes",
        "courseId": "gdp1",
        "title": "GP1: Klasse, Konstruktor, Kapselung",
        "content": "Klasse = Bauplan (Attribute + Methoden), Objekt = Instanz (new). Konstruktor: Klassenname, KEIN Rückgabetyp, initialisiert Attribute; Standardkonstruktor nur ohne eigenen Konstruktor. this.attr vs Parameter; this(…) = anderer Konstruktor (1. Anweisung). Kapselung: Ziel = Daten schützen, nur definierte Zugänge, Interna änderbar. Umsetzung = private Attribute + public Getter/Setter mit Prüfung. Immutable = keine Setter (String). == Identität, equals Inhalt, null.m() → NullPointerException.",
        "code": "public class Car {\n    private int year;\n\n    public Car(int year) {\n        setYear(year);\n    }\n\n    public int getYear() {\n        return year;\n    }\n\n    public void setYear(int year) {\n        if (year > 1900) {\n            this.year = year;\n        }\n    }\n}"
      }
    },
    {
      "id": "gp1-oop",
      "title": "9. Modifizierer & static (Klassen- vs. Instanzmitglieder)",
      "badge": "Probeklausur 1 + 7 (20 P)",
      "examWeight": 3,
      "diagram": "gp1-static-vs-instance",
      "sources": [
        {
          "title": "Probeklausur Aufgabe 1 Modifizierer",
          "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
          "page": 2
        },
        {
          "title": "Probeklausur Aufgabe 7 static",
          "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
          "page": 8
        },
        {
          "title": "Folien 03 Sichtbarkeitsmodifizierer",
          "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
          "page": 45
        },
        {
          "title": "Folien 05 Konstanten (static final)",
          "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
          "page": 8
        },
        {
          "title": "VFH KLA – Statische Methoden und Attribute",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_KLA-EigeneKlassenProgrammieren.pdf",
          "page": 29
        },
        {
          "title": "VFH VRB – protected",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
          "page": 18
        },
        {
          "title": "VFH VRB – abstract & final",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
          "page": 37
        },
        {
          "title": "VFH OBJ – Statische und nicht statische Mitglieder",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_OBJ-Objekte.pdf",
          "page": 25
        }
      ],
      "summary": [
        "<strong>Sichtbarkeit:</strong> <code>public</code> &ndash; überall im Programm; <code>protected</code> &ndash; im gleichen Paket <em>und</em> in allen erbenden Klassen; <em>(ohne Angabe, package-private)</em> &ndash; nur im gleichen Paket; <code>private</code> &ndash; ausschließlich in der eigenen Klasse.",
        "<strong>Weitere Modifizierer für Methoden (Probeklausur 1.a):</strong> <code>static</code> &ndash; Klassenmethode, ohne Objekt aufrufbar; <code>final</code> &ndash; darf in Unterklassen <em>nicht überschrieben</em> werden; <code>abstract</code> &ndash; nur Signatur ohne Rumpf, muss in (konkreten) Unterklassen implementiert werden, Klasse muss dann selbst <code>abstract</code> sein. (<code>final</code> bei Variablen = Konstante, bei Klassen = keine Unterklassen, z.&nbsp;B. <code>String</code>, <code>Math</code>.)",
        "<strong><code>static</code> Attribut (Probeklausur 7.a):</strong> <code>private static int indexCount;</code> existiert <strong>genau einmal für die Klasse</strong> &ndash; alle <code>Widget</code>-Objekte teilen sich den Wert (z.&nbsp;B. Zähler für vergebene Indizes). <code>private int widgetIndex;</code> existiert <strong>in jedem Objekt separat</strong> (eigener Wert pro Widget). Klassenvariablen existieren auch ohne Objekt; Zugriff über <code>Widget.indexCount</code>.",
        "<strong><code>static</code> Methode (Probeklausur 7.b):</strong> <code>Pommes.mit(…)</code> wird über den <em>Klassennamen</em> ohne Objekt aufgerufen; sie hat kein <code>this</code> und kann <em>nicht direkt</em> auf Instanzattribute/-methoden zugreifen. <code>ohne(…)</code> ist eine Instanzmethode: Aufruf nur über ein Objekt (<code>new Pommes().ohne(…)</code>), Zugriff auf Attribute des Objekts. Beispiele für static: <code>main</code>, <code>Math.sqrt</code>, <code>Integer.parseInt</code>, <code>System.exit</code>.",
        "<strong>Konstanten:</strong> <code>public static final double GRAVITATION = 9.81;</code> &ndash; <code>final</code> = nur einmal zuweisbar, <code>static</code> = nur eine Kopie für alle Objekte. Achtung: <code>static</code> heißt <em>nicht</em> „unveränderlich“ &ndash; das ist <code>final</code>!"
      ],
      "feynman": {
        "prompt": "Probeklausur 7: Erkläre einem Kommilitonen den Unterschied zwischen indexCount (static) und widgetIndex in Widget sowie zwischen Pommes.mit() (public static) und ohne() (public).",
        "rubric": [
          "indexCount: Klassenvariable, genau ein Speicherplatz für die Klasse, alle Objekte sehen/ändern denselben Wert; existiert auch ohne Objekt.",
          "widgetIndex: Instanzvariable, jedes Widget-Objekt hat seinen eigenen Wert; existiert nur zusammen mit dem Objekt.",
          "mit(): Klassenmethode, Aufruf Pommes.mit(…) ohne Objekt, kein this, kein direkter Zugriff auf Instanzattribute.",
          "ohne(): Instanzmethode, Aufruf nur über ein Objekt (Pommes p = new Pommes(); p.ohne(…)), arbeitet mit dessen Attributen."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp1-oop",
        "courseId": "gdp1",
        "title": "GP1: Modifizierer & static (Aufgaben 1 + 7)",
        "content": "public: überall · protected: Paket + Unterklassen · (ohne): nur Paket · private: nur eigene Klasse. static: gehört zur Klasse (Aufruf Klasse.m(), kein this, kein Zugriff auf Instanzattribute). final: Variable = Konstante, Methode = nicht überschreibbar, Klasse = nicht ableitbar. abstract: Methode ohne Rumpf (Unterklasse muss implementieren), Klasse nicht instanziierbar. static Attribut = 1× pro Klasse, geteilt (Zähler) · Instanzattribut = 1× pro Objekt. static ≠ konstant!",
        "code": "public class Widget {\n    private static int indexCount; // 1x fuer alle Widgets\n    private int widgetIndex;       // je Objekt\n\n    public Widget() {\n        indexCount++;\n        widgetIndex = indexCount;\n    }\n}\nPommes.mit();          // static: ueber Klasse\nnew Pommes().ohne();   // Instanzmethode: ueber Objekt"
      }
    },
    {
      "id": "gp1-params",
      "title": "10. Methoden: Signatur, Überladen & call by value",
      "badge": "Präsenz-Thema",
      "examWeight": 2,
      "diagram": "gp1-call-by-value",
      "sources": [
        {
          "title": "Folien 09 Methoden, Signatur, Überladen",
          "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
          "page": 11
        },
        {
          "title": "Folien 10 Parameterübergabe (call by value)",
          "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
          "page": 33
        },
        {
          "title": "VFH STA – Statische Methoden & Überladen",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_STA-StatischeMethodenUndKonstanten.pdf",
          "page": 30
        },
        {
          "title": "VFH STA – Zusammenfassung",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_STA-StatischeMethodenUndKonstanten.pdf",
          "page": 48
        }
      ],
      "summary": [
        "<strong>Methodenkopf:</strong> <code>[Modifizierer] Rückgabetyp name(Parameterliste) [throws …]</code>. <code>void</code> = kein Rückgabewert; <code>return Ausdruck;</code> beendet die Methode und liefert einen Wert vom Rückgabetyp. <em>Parameter</em> = Variable im Methodenkopf, <em>Argument</em> = beim Aufruf übergebener Wert.",
        "<strong>Signatur</strong> = Methodenname + Reihenfolge der Parameter-<em>Datentypen</em> (<code>move(String, int)</code> &ne; <code>move(int, String)</code>). Der Rückgabetyp gehört <strong>nicht</strong> dazu.",
        "<strong>Überladen (overloading):</strong> gleicher Name, unterschiedliche Signatur, in derselben Klasse; der Compiler wählt anhand der Argumenttypen (ggf. mit Typerweiterung: <code>m('a')</code> passt auf <code>m(int)</code>). Gleiche Signatur mit anderem Rückgabetyp ist <em>verboten</em>. Nicht verwechseln mit <strong>Überlagern/Überschreiben (overriding)</strong> in der Unterklasse!",
        "<strong>call by value:</strong> Java übergibt <em>immer Kopien</em>. Bei primitiven Typen bleibt die Variable des Aufrufers unverändert. Bei Referenztypen wird die <em>Referenz</em> kopiert: Änderungen <em>am Objekt</em> (<code>y.set(7)</code>) sind außen sichtbar, eine <em>Neuzuweisung</em> des Parameters (<code>y = z;</code>) nicht. „call by reference“ ist für Java falsch (gibt es z.&nbsp;B. in C++).",
        "<strong>Varargs:</strong> letzter Parameter darf <code>String… topping</code> sein &ndash; Zugriff wie auf ein Array. <strong>Lokale Variablen und Parameter</strong> verschwinden am Ende des Methodenaufrufs."
      ],
      "feynman": {
        "prompt": "Erkläre mit den WrappedInt-Beispielen aus der Vorlesung, warum Java immer \"call by value\" ist, obwohl eine Methode ein übergebenes Objekt verändern kann.",
        "rubric": [
          "Beim Aufruf wird der Wert der Argumentvariablen in den Parameter kopiert.",
          "int: Kopie der Zahl; Zuweisung an den Parameter ändert x des Aufrufers nicht (Ausgabe x: 5).",
          "Objekt: Kopie der Referenz; beide zeigen auf dasselbe Objekt → y.set(7) ändert das Objekt (Ausgabe x: 7).",
          "y = new WrappedInt(7) lässt nur die Kopie auf ein neues Objekt zeigen; x bleibt 5."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp1-params",
        "courseId": "gdp1",
        "title": "GP1: Signatur, Überladen, call by value",
        "content": "Signatur = Name + Parametertypen in Reihenfolge (OHNE Rückgabetyp). Überladen (overloading) = gleicher Name, andere Signatur, gleiche Klasse; nur anderer Rückgabetyp = Fehler. Überlagern/Überschreiben (overriding) = Unterklasse definiert geerbte Methode mit gleicher Signatur neu. Java = immer call by value: primitiv → Original bleibt; Referenz → Objekt änderbar (y.set), Neuzuweisung (y = …) wirkt nicht nach außen. Parameter (Kopf) vs Argument (Aufruf).",
        "code": "static void change(WrappedInt y)  { y.set(7); }            // x -> 7\nstatic void replace(WrappedInt y) { y = new WrappedInt(7); } // x bleibt 5\nstatic void prim(int y)           { y = 7; }                // x bleibt 5"
      }
    },
    {
      "id": "gp1-inheritance",
      "title": "11. Vererbung, abstrakte Klassen & Polymorphie",
      "badge": "Probeklausur 8 (16 P)",
      "examWeight": 3,
      "diagram": "oop-inheritance",
      "sources": [
        {
          "title": "Probeklausur Aufgabe 8 Shape/Rectangle",
          "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
          "page": 9
        },
        {
          "title": "Folien 10 Vererbung (Van extends Car)",
          "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
          "page": 5
        },
        {
          "title": "Folien 10 Konstruktoren und Vererbung",
          "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
          "page": 13
        },
        {
          "title": "Folien 10 Polymorphismus",
          "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
          "page": 14
        },
        {
          "title": "VFH VRB – Konstruktoren in erbenden Klassen",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
          "page": 13
        },
        {
          "title": "VFH VRB – Abstrakte Klassen",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
          "page": 37
        },
        {
          "title": "VFH VRB – Casts und instanceof",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
          "page": 34
        }
      ],
      "summary": [
        "<strong>Vererbung:</strong> <code>public class Van extends Car</code> &ndash; Van „is-a“ Car, erbt die (nicht-statischen) Attribute und Methoden und kann neue hinzufügen. Java kennt nur <em>Einfachvererbung</em>; jede Klasse erbt implizit von <code>Object</code> (<code>equals</code>, <code>toString</code>, <code>hashCode</code>, <code>clone</code>). UML-Pfeil zeigt zur Oberklasse.",
        "<strong>Konstruktoren werden nicht vererbt.</strong> Der Unterklassen-Konstruktor ruft mit <code>super(…)</code> den Oberklassen-Konstruktor als <em>erste Anweisung</em> auf; fehlt der Aufruf, fügt der Compiler <code>super();</code> ein (Fehler, wenn die Oberklasse keinen parameterlosen Konstruktor hat). Initialisierung erfolgt von oben nach unten, beginnend bei <code>Object</code>. <code>private</code> Attribute der Oberklasse sind in der Unterklasse nicht direkt zugreifbar &rarr; <code>super(…)</code>, Getter oder <code>protected</code>.",
        "<strong>Überschreiben (overriding):</strong> gleiche Signatur in der Unterklasse, mit <code>@Override</code> kennzeichnen; <code>super.price()</code> ruft die Oberklassen-Version (Van: <code>return super.price() / VAT_MULTIPLIER;</code>). <code>final</code> Methoden dürfen nicht überschrieben werden.",
        "<strong>Abstrakte Klassen:</strong> <code>public abstract class Shape</code> kann nicht mit <code>new</code> instanziiert werden; abstrakte Methoden (<code>public abstract double area();</code>) haben keinen Rumpf. Jede konkrete Unterklasse <strong>muss alle</strong> abstrakten Methoden implementieren, sonst muss sie selbst abstrakt sein. Abstrakte Klassen dürfen Attribute, Konstruktoren und normale Methoden haben.",
        "<strong>Polymorphie:</strong> Eine Variable vom Typ der Oberklasse kann Objekte jeder Unterklasse aufnehmen (<code>Shape s = new Rectangle(3, 4);</code>). Welche überschriebene Methode läuft, entscheidet das <em>Objekt</em> zur Laufzeit (dynamische Bindung). Aufrufbar sind nur Methoden, die der <em>deklarierte</em> Typ kennt &rarr; sonst Cast nach <code>instanceof</code>-Prüfung; falscher Cast &rarr; <code>ClassCastException</code>.",
        "<strong>Probeklausur 8.a (Rectangle):</strong> <code>extends Shape</code>, <code>private double width, height;</code>, Konstruktor mit Parametern, <code>@Override public double circumference() { return 2 * (width + height); }</code>, <code>@Override public double area() { return width * height; }</code> &ndash; alles mit JavaDoc."
      ],
      "feynman": {
        "prompt": "Probeklausur 8.a: Erkläre Schritt für Schritt, wie du die Klasse Rectangle als Unterklasse der abstrakten Klasse Shape programmierst – und warum Shape s = new Rectangle(3, 4); s.area() funktioniert.",
        "rubric": [
          "Klassenkopf public class Rectangle extends Shape, Attribute private double width/height.",
          "Konstruktor Rectangle(double width, double height) mit this.width = width (ggf. Prüfung >= 0); impliziter super()-Aufruf von Shape.",
          "Beide abstrakten Methoden mit @Override und gleicher Signatur implementieren: circumference() = 2 * (width + height), area() = width * height.",
          "Vollständige JavaDoc: Klasse (@author, @version), Attribute, Konstruktor (@param), Methoden (@return).",
          "Polymorphie: Variable vom Typ Shape, Objekt vom Typ Rectangle; zur Laufzeit wird Rectangle.area() ausgeführt."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp1-inheritance",
        "courseId": "gdp1",
        "title": "GP1: Vererbung & Rectangle-Schablone (Aufgabe 8)",
        "content": "extends = is-a, Einfachvererbung, Wurzel Object. Konstruktoren NICHT vererbt: super(…) als 1. Anweisung (sonst implizit super()). @Override = gleiche Signatur; super.m() ruft Oberklassen-Version. abstract class: kein new; abstract Methode ohne Rumpf → jede konkrete Unterklasse implementiert ALLE. final Methode/Klasse: kein Überschreiben/Ableiten. Polymorphie: Oberklassen-Variable, Objekt entscheidet (dynamische Bindung); nur Methoden des deklarierten Typs aufrufbar; Cast nach instanceof, sonst ClassCastException.",
        "code": "/** A rectangle as a concrete shape. @author … @version … */\npublic class Rectangle extends Shape {\n    /** The width. */  private double width;\n    /** The height. */ private double height;\n\n    /**\n     * Creates a rectangle.\n     * @param width  the width\n     * @param height the height\n     */\n    public Rectangle(double width, double height) {\n        this.width = width;\n        this.height = height;\n    }\n\n    /** @return the circumference 2 * (width + height) */\n    @Override\n    public double circumference() {\n        return 2 * (width + height);\n    }\n\n    /** @return the area width * height */\n    @Override\n    public double area() {\n        return width * height;\n    }\n}"
      }
    },
    {
      "id": "gp1-theory",
      "title": "12. OOP-Theorie & Schrittweise Verfeinerung (Präsenz-Fragen)",
      "badge": "Probeklausur 9 (12 P)",
      "examWeight": 3,
      "diagram": "gp1-stepwise",
      "sources": [
        {
          "title": "Probeklausur Aufgabe 9 Präsenzveranstaltungen",
          "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
          "page": 10
        },
        {
          "title": "VFH EIP – Methode der schrittweisen Verfeinerung",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EIP-Einfuehrung.pdf",
          "page": 38
        },
        {
          "title": "Wochenplan (Vorlesung Schrittweise Verfeinerung 24.11.)",
          "path": "moodle-data/gdp1/files/GP1 26WS - Wochenplan v1.0.pdf",
          "page": 1
        },
        {
          "title": "Folien 08 OOP: Theorie (Grundideen, Beziehungen)",
          "path": "moodle-data/gdp1/files/08. OOP_ Theorie/GP1_26WS_08_OOP_Theorie.pdf",
          "page": 11
        },
        {
          "title": "Folien 08 Assertions",
          "path": "moodle-data/gdp1/files/08. OOP_ Theorie/GP1_26WS_08_OOP_Theorie.pdf",
          "page": 31
        }
      ],
      "summary": [
        "<strong>Schrittweise Verfeinerung (Probeklausur 9.b):</strong> Methode zum Entwurf von Algorithmen für komplexe Aufgaben. (1) Gesamtaufgabe beschreiben, (2) in <em>weniger komplexe Teilaufgaben</em> zerlegen, (3) Abhängigkeiten/Reihenfolge der Teilaufgaben klären, (4) jede Teilaufgabe über mehrere Ebenen weiter verfeinern, bis elementare Arbeitsschritte entstehen, (5) wiederkehrende Schritte erkennen und zusammenfassen, (6) die Teilalgorithmen zum vollständigen Algorithmus zusammensetzen (dann codieren und testen).",
        "<strong>Beispiel Kaffeekochen (VFH EIP):</strong> Teilaufgaben „Wasser eingießen“, „Kaffeepulver eingeben“ (&rarr; Filter einlegen <em>vor</em> Pulver einfüllen), „Maschine starten“ (erst wenn beide fertig). Optimierung: Deckel nur einmal öffnen/schließen.",
        "<strong>Grundideen der OOP:</strong> Abstraktion (Trennung Konzept/Umsetzung, Klasse vs. Objekt), Kapselung, Wiederverwendung, Beziehungen zwischen Klassen/Objekten.",
        "<strong>Beziehungen:</strong> <em>is-a</em> (Generalisierung/Spezialisierung &rarr; Vererbung, nur bei echter is-a-Beziehung: <strong>Liskov Substitution Principle</strong>); <em>part-of</em>: <strong>Komposition</strong> (essentiell, z.&nbsp;B. Lokomotive &rarr; Güterzug) und <strong>Aggregation</strong> (nicht-essentiell/temporär, z.&nbsp;B. PKW auf Fährschiff) &ndash; beide in Java über Instanzvariablen; <em>Verwendung</em>: Methode benutzt temporäres Objekt (Parameter).",
        "<strong>Geschichte:</strong> Simula 67 = erste objektorientierte Sprache; Smalltalk („Alles ist ein Objekt“); C++ (Stroustrup); objektorientiert = Objekte + Vererbung, objektbasiert = Objekte ohne Vererbung.",
        "<strong>Assertions:</strong> <code>assert Ausdruck1 [: Ausdruck2];</code> &ndash; ist Ausdruck1 falsch, wird ein <code>AssertionError</code> (mit Meldung Ausdruck2) ausgelöst. Nur aktiv mit <code>java -ea MyClass</code>. Zweck: Zustand/Parameterbereiche bei der Fehlersuche sicherstellen (Hoare: Vor-/Nachbedingungen)."
      ],
      "feynman": {
        "prompt": "Probeklausur 9.b: Beschreibe ausführlich und in der richtigen Reihenfolge das Prinzip der schrittweisen Verfeinerung – am Beispiel Kaffeekochen.",
        "rubric": [
          "Ausgangspunkt: komplexe Gesamtaufgabe wird als Ganzes beschrieben (Kaffee kochen).",
          "Zerlegung in Teilaufgaben (Wasser eingießen, Pulver eingeben, Maschine starten) und Klärung der Abhängigkeiten/Reihenfolge.",
          "Weitere Verfeinerung der Teilaufgaben über mehrere Ebenen bis zu elementaren Arbeitsschritten (Filter einlegen, Messlöffel füllen …).",
          "Wiederkehrende Schritte erkennen/zusammenfassen (Deckel nur einmal öffnen) und Teilalgorithmen zum Gesamtalgorithmus zusammensetzen."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp1-theory",
        "courseId": "gdp1",
        "title": "GP1: Schrittweise Verfeinerung & OOP-Theorie (Aufgabe 9)",
        "content": "Schrittweise Verfeinerung: 1 Gesamtaufgabe beschreiben → 2 in Teilaufgaben zerlegen → 3 Abhängigkeiten/Reihenfolge festlegen → 4 Teilaufgaben weiter verfeinern bis elementare Schritte → 5 Wiederholungen erkennen/zusammenfassen → 6 zu Gesamtalgorithmus zusammensetzen (codieren, testen). OOP-Grundideen: Abstraktion, Kapselung, Wiederverwendung, Beziehungen. is-a = Vererbung (LSP!) · part-of: Komposition (essentiell) / Aggregation (temporär), beide via Instanzvariable · Verwendung = Parameter. assert bed : msg; → AssertionError, nur mit java -ea. Simula 67 = erste OO-Sprache.",
        "code": "Kaffee kochen\n├─ Wasser eingiessen (Kanne nehmen, Wasser holen, eingiessen)\n├─ Kaffeepulver eingeben\n│   ├─ Filter einlegen        (zuerst!)\n│   └─ Pulver einfuellen\n└─ Maschine starten          (erst wenn beide fertig)\nOptimierung: Deckel 1x oeffnen / 1x schliessen"
      }
    },
    {
      "id": "gp1-exceptions",
      "title": "13. Ausnahmebehandlung (Exceptions)",
      "badge": "LE 09 / Vorlesung Ausnahmen",
      "examWeight": 2,
      "diagram": "gp1-exception-hierarchy",
      "sources": [
        {
          "title": "VFH EXC – Exceptionhandling",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EXC-Ausnahmebehandlung.pdf",
          "page": 4
        },
        {
          "title": "VFH EXC – checked/unchecked",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EXC-Ausnahmebehandlung.pdf",
          "page": 9
        },
        {
          "title": "VFH EXC – finally",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EXC-Ausnahmebehandlung.pdf",
          "page": 12
        },
        {
          "title": "VFH EXC – Mehrere Exceptiontypen",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EXC-Ausnahmebehandlung.pdf",
          "page": 31
        },
        {
          "title": "VFH EXC – Exception-Klassen",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EXC-Ausnahmebehandlung.pdf",
          "page": 33
        },
        {
          "title": "Wochenplan (Vorlesung Ausnahmen)",
          "path": "moodle-data/gdp1/files/GP1 26WS - Wochenplan v1.0.pdf",
          "page": 1
        }
      ],
      "summary": [
        "<strong>Exception</strong> = abnormales Ereignis, das den normalen Ablauf unterbricht (z.&nbsp;B. Buchstaben statt Zahl, Division durch 0, Datei fehlt, Cast misslingt). Die laufende Methode bricht sofort ab; das Exception-Objekt wird den <strong>Aufruf-Stack</strong> hinaufgereicht, bis ein passender <code>catch</code> gefunden wird &ndash; sonst beendet die JVM das Programm mit Stacktrace.",
        "<strong>try/catch/finally:</strong> Fehleranfälligen Code in <code>try { }</code>; <code>catch (Typ e) { }</code> behandelt den Fehler; mehrere <code>catch</code>-Blöcke: <strong>speziellste Klasse zuerst</strong> (sonst Compile-Fehler), Zusammenfassen mit <code>catch (A | B e)</code>. <code>finally { }</code> läuft <em>immer</em> &ndash; auch nach <code>return</code> im <code>try</code>/<code>catch</code> (für Aufräumarbeiten).",
        "<strong><code>throw</code> vs. <code>throws</code>:</strong> <code>throw new IllegalArgumentException(…);</code> <em>wirft</em> eine Exception; <code>throws IOException</code> im Methodenkopf <em>kündigt</em> sie an (+ <code>@throws</code> im JavaDoc). Wer eine Exception mit <code>try/catch</code> behandelt, deklariert sie nicht zusätzlich mit <code>throws</code>.",
        "<strong>checked vs. unchecked:</strong> <em>checked</em> (erben von <code>Exception</code>, z.&nbsp;B. <code>IOException</code>, <code>FileNotFoundException</code>) &ndash; Compiler erzwingt <code>try/catch</code> oder <code>throws</code>. <em>unchecked</em> (erben von <code>RuntimeException</code>: <code>ArithmeticException</code>, <code>NullPointerException</code>, <code>ArrayIndexOutOfBoundsException</code>, <code>ClassCastException</code>, <code>IllegalArgumentException</code>, <code>InputMismatchException</code>) &ndash; Behandlung freiwillig. <code>Error</code> = schwere, nicht behebbare Fehler.",
        "<strong>Hierarchie:</strong> <code>Object &rarr; Throwable &rarr; Error | Exception &rarr; RuntimeException …</code>. Methoden aus <code>Throwable</code>: <code>getMessage()</code>, <code>printStackTrace()</code> (auf <code>System.err</code>). Eigene Exceptions erben von <code>Exception</code> oder <code>RuntimeException</code>, Name endet auf <code>…Exception</code>."
      ],
      "feynman": {
        "prompt": "Erkläre, was passiert, wenn in einer tief verschachtelten Methode 10 / 0 gerechnet wird – mit und ohne try/catch – und wann der Compiler dich zu throws zwingt.",
        "rubric": [
          "Es entsteht ein ArithmeticException-Objekt; die Methode bricht an dieser Stelle ab.",
          "Die Exception wandert den Aufruf-Stack hinauf, bis ein passender catch-Block gefunden wird; ohne Behandlung bricht die JVM mit Stacktrace ab.",
          "finally-Blöcke werden auf dem Weg trotzdem ausgeführt.",
          "ArithmeticException ist unchecked (RuntimeException) → kein throws nötig; bei checked Exceptions (z. B. IOException) erzwingt der Compiler try/catch oder throws."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp1-exceptions",
        "courseId": "gdp1",
        "title": "GP1: Exceptions kompakt",
        "content": "try { riskant } catch (Spezielle e) { } catch (Allgemeine e) { } finally { immer, auch nach return }. Speziellste Exception zuerst! Multi-catch: catch (A | B e). throw new X(…) = werfen · throws X im Kopf = ankündigen (+ @throws). Checked (extends Exception: IOException, FileNotFoundException) → catch ODER throws Pflicht. Unchecked (extends RuntimeException: Arithmetic, NullPointer, ArrayIndexOutOfBounds, ClassCast, IllegalArgument, InputMismatch) → freiwillig. Throwable → Error | Exception → RuntimeException. e.getMessage(), e.printStackTrace().",
        "code": "public static double divide(int a, int b)\n        throws IllegalArgumentException {\n    if (b == 0) {\n        throw new IllegalArgumentException(\"b == 0\");\n    }\n    return (double) a / b;\n}\n\ntry {\n    System.out.println(divide(1, 0));\n} catch (IllegalArgumentException e) {\n    System.out.println(e.getMessage());\n} finally {\n    System.out.println(\"fertig\");\n}"
      }
    },
    {
      "id": "gp1-exc-arr-str",
      "title": "14. Arrays & Zeichenketten (Strings)",
      "badge": "LE 10–11 / PA3",
      "examWeight": 2,
      "sources": [
        {
          "title": "VFH ARR – Arrays",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ARR-Arrays.pdf",
          "page": 11
        },
        {
          "title": "VFH ARR – Zusammenfassung",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ARR-Arrays.pdf",
          "page": 58
        },
        {
          "title": "VFH ZKT – Methoden der Klasse String",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ZKT-Zeichenketten.pdf",
          "page": 6
        },
        {
          "title": "VFH ZKT – Vergleich von Strings",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ZKT-Zeichenketten.pdf",
          "page": 13
        },
        {
          "title": "VFH ZKT – Zusammenfassung",
          "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ZKT-Zeichenketten.pdf",
          "page": 36
        },
        {
          "title": "Folien 06 Arrays & Kommandozeilenparameter",
          "path": "moodle-data/gdp1/files/06. Benutzerinteraktion/GP1_26WS_06_Benutzerinteraktion.pdf",
          "page": 7
        }
      ],
      "summary": [
        "<strong>Arrays:</strong> Reihung von Werten <em>gleichen Typs</em>, selbst ein Objekt (Referenztyp). Deklaration <code>int[] temperaturen;</code>, Erzeugung <code>temperaturen = new int[24];</code> oder direkt <code>int[] a = {4, 8, 15};</code>. Mit <code>new</code> erzeugte Elemente haben Standardwerte (0, 0.0, false, <code>'\\0'</code>, <code>null</code>).",
        "<strong>Index &amp; Länge:</strong> Index von <code>0</code> bis <code>length - 1</code>; <code>a.length</code> ist ein (final) <em>Attribut</em> ohne Klammern. Ungültiger Index &rarr; <code>ArrayIndexOutOfBoundsException</code>, negative Größe &rarr; <code>NegativeArraySizeException</code>. Die Größe ist nachträglich nicht änderbar (neues Array erzeugen, z.&nbsp;B. <code>Arrays.copyOf</code>).",
        "<strong>Schleifen:</strong> <code>for (int i = 0; i &lt; a.length; i++)</code> wenn Elemente verändert werden; <code>for (int wert : a)</code> (foreach) bei nur lesendem Zugriff. <code>java.util.Arrays</code>: <code>sort</code>, <code>toString</code>, <code>equals</code>, <code>copyOf</code>. <code>main(String[] args)</code> bekommt die Kommandozeilenparameter als String-Array. 2D: <code>int[][] m = new int[2][3]; m[zeile][spalte]</code>.",
        "<strong>Strings:</strong> Referenztyp, <strong>unveränderlich (immutable)</strong>, Klasse <code>String</code> ist <code>final</code>. Methoden liefern <em>neue</em> Strings: <code>s.toUpperCase()</code> allein ändert <code>s</code> nicht &rarr; <code>s = s.toUpperCase();</code>. Wichtig: <code>length()</code> (Methode!), <code>charAt(i)</code>, <code>indexOf</code>, <code>substring(beginn, ende)</code> (ende exklusiv), <code>equals</code>, <code>equalsIgnoreCase</code>, <code>compareTo</code>, <code>trim</code>, <code>replace</code>, <code>String.valueOf(…)</code>.",
        "<strong>Vergleich:</strong> Inhalt immer mit <code>s1.equals(s2)</code>; <code>==</code> vergleicht nur Referenzen (bei gleichen Literalen kann es zufällig <code>true</code> sein, bei Benutzereingaben/<code>new String</code> nicht). Veränderbare Zeichenketten: <code>StringBuilder</code> (<code>append</code>, <code>insert</code>, <code>reverse</code>, <code>toString</code>)."
      ],
      "feynman": {
        "prompt": "Warum darf man zwei Strings nicht mit == vergleichen, und was ist der Unterschied zwischen arr.length und str.length()? Erkläre auch, warum s.toUpperCase(); allein nichts bewirkt.",
        "rubric": [
          "== vergleicht bei Referenztypen nur, ob beide Variablen auf dasselbe Objekt zeigen (Identität), nicht den Inhalt.",
          "equals() vergleicht die Zeichenfolge (Inhalt); equalsIgnoreCase ignoriert Groß-/Kleinschreibung.",
          "Array: length ist ein finales Attribut (ohne Klammern); String: length() ist eine Methode.",
          "Strings sind immutable: toUpperCase() liefert einen neuen String, der zugewiesen werden muss."
        ]
      },
      "cheatSheet": {
        "id": "cs-gp1-str",
        "courseId": "gdp1",
        "title": "GP1: Arrays & Strings",
        "content": "int[] a = new int[n]; / int[] a = {1, 2}; Index 0…a.length-1 (a.length ohne Klammern!), sonst ArrayIndexOutOfBoundsException. Default 0/0.0/false/null. Größe fix. Array-Zuweisung kopiert Referenz. foreach nur lesend. Arrays.sort/toString/equals/copyOf. String immutable: s = s.trim(); s.length() mit Klammern, charAt(i), indexOf(c), substring(von, bisExkl), equals / equalsIgnoreCase / compareTo. NIE == für Inhalt. StringBuilder = veränderbar (append, reverse).",
        "code": "int[] werte = {3, 1, 4};\nint max = werte[0];\nfor (int w : werte) {\n    if (w > max) {\n        max = w;\n    }\n}\nif (\"ja\".equals(eingabe)) { … }\nString s = \"Programm\".substring(3, 7); // \"gram\""
      }
    }
  ],
  "flashcards": [
    {
      "id": "fc-gp1-1",
      "chapterId": "gp1-oop",
      "examRelevant": true,
      "front": "Nenne 4 Methoden-Modifizierer in Java (außer static) und ihre Wirkung. (Probeklausur 1.a, 8 P)",
      "back": "1) public: überall im Programm sichtbar/aufrufbar\n2) private: nur innerhalb der eigenen Klasse\n3) protected: im gleichen Paket und in allen Unterklassen\n4) final: darf in Unterklassen nicht überschrieben werden\n5) abstract: nur Signatur ohne Rumpf; muss in einer konkreten Unterklasse implementiert werden (Klasse muss dann abstract sein)",
      "source": {
        "title": "Probeklausur Aufgabe 1.a",
        "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
        "page": 2
      }
    },
    {
      "id": "fc-gp1-4",
      "chapterId": "gp1-oop",
      "examRelevant": true,
      "front": "Was bewirkt `static` bei einem Attribut (`private static int indexCount`) vs. Instanzattribut (`private int widgetIndex`)? (Probeklausur 7.a, 6 P)",
      "back": "indexCount ist eine Klassenvariable: sie existiert genau EINMAL für die ganze Klasse Widget, alle Widget-Objekte teilen sich denselben Wert (z. B. als Zähler) – sie existiert sogar ohne Objekt.\nwidgetIndex ist eine Instanzvariable: JEDES Widget-Objekt hat seinen eigenen Speicherplatz und Wert; sie lebt so lange wie ihr Objekt.",
      "source": {
        "title": "Probeklausur Aufgabe 7.a",
        "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
        "page": 8
      }
    },
    {
      "id": "fc-gp1-5",
      "chapterId": "gp1-oop",
      "examRelevant": true,
      "front": "Unterschied zwischen `public static void mit()` und `public void ohne()` in der Klasse Pommes? (Probeklausur 7.b, 6 P)",
      "back": "mit() ist eine Klassenmethode: Aufruf über den Klassennamen `Pommes.mit(…)`, kein Objekt nötig, kein `this`, kein direkter Zugriff auf Instanzattribute/-methoden.\nohne() ist eine Instanzmethode: benötigt ein Objekt (`Pommes p = new Pommes(); p.ohne(…);`) und kann auf die Attribute dieses Objekts zugreifen.",
      "source": {
        "title": "Probeklausur Aufgabe 7.b",
        "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
        "page": 8
      }
    },
    {
      "id": "fc-gp1-vis-table",
      "chapterId": "gp1-oop",
      "examRelevant": true,
      "front": "Sichtbarkeitsmodifizierer: Wo ist ein Element mit public, protected, ohne Angabe (package-private) und private sichtbar?",
      "back": "public: überall im gesamten Programm\nprotected: in allen Klassen im gleichen Paket UND in allen erbenden Klassen\n(ohne Angabe/default): nur in Klassen des gleichen Pakets\nprivate: ausschließlich in der eigenen Klasse",
      "source": {
        "title": "Folien 03 Sichtbarkeit",
        "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
        "page": 45
      }
    },
    {
      "id": "fc-gp1-final-3",
      "chapterId": "gp1-oop",
      "examRelevant": true,
      "front": "Was bedeutet `final` bei einer Variablen, einer Methode und einer Klasse?",
      "back": "Variable/Attribut: darf nur einmal einen Wert bekommen (Konstante; final-Attribute meist im Konstruktor).\nMethode: darf in Unterklassen nicht überschrieben werden.\nKlasse: es dürfen keine Unterklassen gebildet werden (z. B. String, Math, Integer, System).",
      "source": {
        "title": "VFH VRB – Finale Klassen und Methoden",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
        "page": 41
      }
    },
    {
      "id": "fc-gp1-abstract-rules",
      "chapterId": "gp1-oop",
      "examRelevant": true,
      "front": "Welche Regeln gelten für `abstract` bei Methoden und Klassen?",
      "back": "Abstrakte Methode: nur Kopf mit Semikolon, kein Rumpf (`public abstract double area();`).\nAbstrakte Methoden sind nur in abstrakten Klassen erlaubt.\nAbstrakte Klasse: kein `new` möglich, darf aber Attribute, Konstruktoren und normale Methoden haben.\nJede konkrete Unterklasse muss alle abstrakten Methoden überschreiben – sonst muss sie selbst abstract sein.",
      "source": {
        "title": "VFH VRB – Abstrakte Klassen und Methoden",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
        "page": 39
      }
    },
    {
      "id": "fc-gp1-static-access",
      "chapterId": "gp1-oop",
      "examRelevant": true,
      "front": "Warum kompiliert `count++;` in `public static void main(…)` nicht, wenn `count` eine Instanzvariable ist?",
      "back": "Statische Methoden gehören zur Klasse und laufen ohne Objekt – es gibt kein `this`, also auch kein Objekt, dessen count gemeint wäre.\nFehler: \"non-static variable count cannot be referenced from a static context\".\nLösung: Objekt erzeugen (`MyClass m = new MyClass(); m.count++;`) oder count static machen (nur wenn fachlich EIN Wert für alle gewollt ist).",
      "source": {
        "title": "VFH OBJ – Statische und nicht statische Mitglieder",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_OBJ-Objekte.pdf",
        "page": 26
      }
    },
    {
      "id": "fc-gp1-static-examples",
      "chapterId": "gp1-oop",
      "examRelevant": false,
      "front": "Nenne Beispiele für statische Methoden/Konstanten aus der Java-Bibliothek und wie man sie aufruft.",
      "back": "Math.sqrt(x), Math.pow(a, b), Integer.parseInt(s), Double.parseDouble(s), System.exit(code), System.lineSeparator(); Konstanten System.in / System.out, Math.PI.\nAufruf immer: Klassenname.mitglied – kein Objekt nötig.",
      "source": {
        "title": "VFH STA – Zusammenfassung",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_STA-StatischeMethodenUndKonstanten.pdf",
        "page": 48
      }
    },
    {
      "id": "fc-gp1-static-not-final",
      "chapterId": "gp1-oop",
      "examRelevant": true,
      "front": "Typischer Klausurfehler: „static bedeutet, dass der Wert konstant ist.“ – Richtig oder falsch?",
      "back": "Falsch! static = gehört zur Klasse (nur ein Exemplar, geteilt). Der Wert eines static-Attributs kann sich ändern (z. B. Zähler indexCount++).\nUnveränderlich macht erst final. Konstante = static final (z. B. `public static final double GRAVITATION = 9.81;`).",
      "source": {
        "title": "Folien 05 Konstanten",
        "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
        "page": 8
      }
    },
    {
      "id": "fc-gp1-2",
      "chapterId": "gp1-basics",
      "examRelevant": true,
      "front": "Wann führt der Java-Compiler eine Typumwandlung implizit aus? Nenne je ein Beispiel für Typerweiterung und Typeinengung. (Probeklausur 2.c, 6 P)",
      "back": "Implizit nur bei Typerweiterung (von „klein“ nach „groß“), wenn kein Informationsverlust droht – z. B. int → long → float → double, char → int.\n• Typerweiterung (implizit): `int a = 5; double d = a;`\n• Typeinengung (explizit mit Cast): `double d = 3.9; int a = (int) d; // 3` – Nachkommastellen werden abgeschnitten.",
      "source": {
        "title": "Probeklausur Aufgabe 2.c",
        "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
        "page": 3
      }
    },
    {
      "id": "fc-gp1-3",
      "chapterId": "gp1-basics",
      "examRelevant": true,
      "front": "Unterschied zwischen lokaler Variable und Instanzvariable (Einsatz, Lebensdauer, Sichtbarkeit, Initialisierung)? (Probeklausur 2.b, 4 P)",
      "back": "• Lokale Variable: für Zwischenwerte innerhalb einer Methode; nur im deklarierenden Block sichtbar; lebt nur während der Ausführung des Blocks/Methodenaufrufs; KEIN Standardwert (muss vor Gebrauch zugewiesen werden).\n• Instanzvariable: speichert den Zustand eines Objekts; in allen Instanzmethoden der Klasse sichtbar (nach außen je nach Modifizierer); lebt so lange wie das Objekt; Standardwert 0, 0.0, false bzw. null.",
      "source": {
        "title": "Probeklausur Aufgabe 2.b",
        "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
        "page": 3
      }
    },
    {
      "id": "fc-gp1-myclass",
      "chapterId": "gp1-basics",
      "examRelevant": true,
      "front": "Probeklausur 2.a (4 P): Definiere eine Klasse MyClass mit einer lokalen Variable localVar (Ganzzahl) und einer Instanzvariable instanceVar (Gleitkommazahl).",
      "back": "public class MyClass {\n    private double instanceVar;   // Instanzvariable: in der Klasse, außerhalb jeder Methode\n\n    public void doSomething() {\n        int localVar = 0;         // lokale Variable: innerhalb einer Methode\n    }\n}\nWichtig: die lokale Variable MUSS in einer Methode stehen.",
      "source": {
        "title": "Probeklausur Aufgabe 2.a",
        "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
        "page": 3
      }
    },
    {
      "id": "fc-gp1-primitives",
      "chapterId": "gp1-basics",
      "examRelevant": true,
      "front": "Nenne die 8 primitiven Datentypen mit Größe in Bit.",
      "back": "boolean (false/true)\nchar 16 Bit (Unicode)\nbyte 8 · short 16 · int 32 · long 64 (Ganzzahlen)\nfloat 32 · double 64 (Gleitkomma, IEEE 754)\nAlles andere (String, Arrays, eigene Klassen) sind Referenztypen.",
      "source": {
        "title": "Folien 04 Datentypen",
        "path": "moodle-data/gdp1/files/04. Daten und Datentypen/GP1_26WS_04_Datentypen.pdf",
        "page": 16
      }
    },
    {
      "id": "fc-gp1-defaults",
      "chapterId": "gp1-basics",
      "examRelevant": true,
      "front": "Welche Standardwerte bekommen Instanzvariablen und Array-Elemente – und welche lokale Variablen?",
      "back": "Instanzvariablen/Array-Elemente: byte/short/int/long → 0, float/double → 0.0, char → '\\u0000', boolean → false, Referenztypen → null.\nLokale Variablen: KEINEN – Benutzung vor der ersten Zuweisung ist ein Compile-Fehler (\"might not have been initialized\").",
      "source": {
        "title": "Folien 04 Datentypen (Standardwerte)",
        "path": "moodle-data/gdp1/files/04. Daten und Datentypen/GP1_26WS_04_Datentypen.pdf",
        "page": 13
      }
    },
    {
      "id": "fc-gp1-widening-chain",
      "chapterId": "gp1-basics",
      "examRelevant": true,
      "front": "Wie lautet die Kette der impliziten Typerweiterung?",
      "back": "byte → short → int → long → float → double\nchar → int (→ long → float → double)\nBeispiel aus den Folien: `int charValue = 'e';` (implizit, 101).\nUmgekehrt (z. B. double → int, int → char, int → byte) nur explizit mit Cast.",
      "source": {
        "title": "Folien 05 implizite Typanpassung",
        "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
        "page": 11
      }
    },
    {
      "id": "fc-gp1-literals",
      "chapterId": "gp1-basics",
      "examRelevant": false,
      "front": "Welchen Typ haben die Literale 4711, 4711L, 0x1F, 017, 2.5, 2.5f, 'a', \"a\"?",
      "back": "4711 → int · 4711L → long · 0x1F → int (hexadezimal) · 017 → int (oktal = 15) · 2.5 → double · 2.5f → float · 'a' → char · \"a\" → String",
      "source": {
        "title": "Folien 04 Literale",
        "path": "moodle-data/gdp1/files/04. Daten und Datentypen/GP1_26WS_04_Datentypen.pdf",
        "page": 17
      }
    },
    {
      "id": "fc-gp1-float-literal",
      "chapterId": "gp1-basics",
      "examRelevant": true,
      "front": "Warum kompiliert `float f = 3.14;` nicht, `double d = 3.14;` aber schon?",
      "back": "Eine Zahl mit Dezimalpunkt ist ein double-Literal. double → float wäre eine Typeinengung (möglicher Genauigkeitsverlust) und geht nicht implizit.\nKorrektur: `float f = 3.14f;` oder `float f = (float) 3.14;`",
      "source": {
        "title": "Folien 04 Literale (Gleitkomma)",
        "path": "moodle-data/gdp1/files/04. Daten und Datentypen/GP1_26WS_04_Datentypen.pdf",
        "page": 19
      }
    },
    {
      "id": "fc-gp1-byte-sum",
      "chapterId": "gp1-basics",
      "examRelevant": false,
      "front": "Warum ist `byte cb = c + b;` (c, b vom Typ byte) ein Compile-Fehler und wie korrigiert man ihn?",
      "back": "Arithmetik mit byte/short wird in int gerechnet – das Ergebnis ist int. int → byte ist eine Typeinengung.\nKorrektur: `byte cb = (byte) (c + b);` – die Klammern um die Summe sind nötig, weil der Cast stärker bindet als +.",
      "source": {
        "title": "VFH VAR – Type Casting",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VAR-VariablenUndPrimitiveDatentypen.pdf",
        "page": 35
      }
    },
    {
      "id": "fc-gp1-scope",
      "chapterId": "gp1-basics",
      "examRelevant": true,
      "front": "Was ist der Gültigkeitsbereich (Scope) einer Variablen?",
      "back": "Eine Variable ist nur in dem Block { … } sichtbar, in dem sie deklariert wurde (ab der Deklaration bis zum Blockende) – auch die Laufvariable aus `for (int i = …)` gilt nur in der Schleife.\nZugriff außerhalb → Compile-Fehler \"cannot find symbol\". Lokale Variablen sollen existierende Variablen nicht verdecken.",
      "source": {
        "title": "Folien 05 Gültigkeitsbereich",
        "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
        "page": 6
      }
    },
    {
      "id": "fc-gp1-constants",
      "chapterId": "gp1-basics",
      "examRelevant": true,
      "front": "Wie deklariert man eine Konstante korrekt (Syntax + Namenskonvention)?",
      "back": "`static final int MAX_COUNT = 12;` (als Klassenkonstante, ggf. public/private davor)\nfinal = nur einmal zuweisbar; static = nur eine Kopie für alle Objekte.\nName: nur Großbuchstaben, Wörter mit Unterstrich getrennt (MAX_VALUE_FOR_DUAL_MODE).",
      "source": {
        "title": "Folien 05 Konstanten",
        "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
        "page": 8
      }
    },
    {
      "id": "fc-gp1-identifier",
      "chapterId": "gp1-basics",
      "examRelevant": false,
      "front": "Welche Bezeichner sind gültig: pizza, Wolke7, 7and7is, Rock'n'Roll, _wert, $preis, my var?",
      "back": "Gültig: pizza, Wolke7, _wert, $preis (1. Zeichen Buchstabe, _ oder $; danach auch Ziffern).\nUngültig: 7and7is (beginnt mit Ziffer), Rock'n'Roll (Apostroph), my var (Leerzeichen). Außerdem keine Schlüsselwörter (class, int, new …).",
      "source": {
        "title": "Folien 04 Bezeichner",
        "path": "moodle-data/gdp1/files/04. Daten und Datentypen/GP1_26WS_04_Datentypen.pdf",
        "page": 8
      }
    },
    {
      "id": "fc-gp1-cast-truncate",
      "chapterId": "gp1-basics",
      "examRelevant": true,
      "front": "Was liefern `(int) 3.9`, `(int) -3.9` und `(char) 102`?",
      "back": "(int) 3.9 → 3 und (int) -3.9 → -3: Nachkommastellen werden abgeschnitten, nicht gerundet.\n(char) 102 → 'f' (Unicode-Code 102); Folienbeispiel: 'e' + 1 = 102 → (char) → f.",
      "source": {
        "title": "Folien 05 Typanpassungen – Beispiel",
        "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
        "page": 13
      }
    },
    {
      "id": "fc-gp1-pre-post",
      "chapterId": "gp1-operators",
      "examRelevant": true,
      "front": "Was ist der Unterschied zwischen `++x` und `x++`?",
      "back": "++x (Präinkrement): erhöht x zuerst um 1 und liefert den NEUEN Wert.\nx++ (Postinkrement): liefert den ALTEN Wert und erhöht x danach.\nAls alleinstehende Anweisung (`x++;`) gleichwertig; Unterschied nur, wenn der Wert in einem Ausdruck/einer Bedingung benutzt wird. Analog --x / x--.",
      "source": {
        "title": "Folien 05 arithmetische Operatoren",
        "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
        "page": 20
      }
    },
    {
      "id": "fc-gp1-intdiv",
      "chapterId": "gp1-operators",
      "examRelevant": true,
      "front": "Was ergeben 7 / 2, 7 % 2, 7.0 / 2 und (double) (7 / 2)?",
      "back": "7 / 2 = 3 (Ganzzahldivision, Rest abgeschnitten)\n7 % 2 = 1 (Rest)\n7.0 / 2 = 3.5 (ein Operand double → Gleitkommadivision)\n(double) (7 / 2) = 3.0 (erst ganzzahlig geteilt, dann umgewandelt!)",
      "source": {
        "title": "VFH VAR – Arithmetische Operatoren",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VAR-VariablenUndPrimitiveDatentypen.pdf",
        "page": 15
      }
    },
    {
      "id": "fc-gp1-eval-order",
      "chapterId": "gp1-operators",
      "examRelevant": true,
      "front": "In welcher Reihenfolge wertet Java Operanden aus? Was ergibt `(i = 3) * i` mit i = 2?",
      "back": "Operanden immer von LINKS nach RECHTS; Bindung: Punkt vor Strich; gleiche Bindung links-assoziativ (a - b + c = (a - b) + c).\n(i = 3) * i: erst wird i = 3 zugewiesen (Wert 3), dann rechts i gelesen (3) → 9, nicht 6.",
      "source": {
        "title": "Folien 05 Ausdrücke: Regeln",
        "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
        "page": 18
      }
    },
    {
      "id": "fc-gp1-shortcircuit",
      "chapterId": "gp1-operators",
      "examRelevant": true,
      "front": "Unterschied zwischen `&&` und `&` bzw. `||` und `|` bei booleschen Werten?",
      "back": "&& und || werten kurzschließend aus (Short-Circuit): ist bei && der linke Teil false bzw. bei || der linke Teil true, wird der rechte Teil NICHT ausgewertet (Nebeneffekte wie ++x entfallen).\n& und | werten immer beide Seiten aus.\n^ = exklusives ODER (genau einer true).",
      "source": {
        "title": "Folien 05 logische Operatoren",
        "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
        "page": 22
      }
    },
    {
      "id": "fc-gp1-ternary",
      "chapterId": "gp1-operators",
      "examRelevant": true,
      "front": "Wie funktioniert der Bedingungsoperator `? :` – und wie vereinfacht man `daysInYear()`?",
      "back": "Bedingung ? Wert-wenn-true : Wert-wenn-false (dreistellig, liefert einen Wert).\n`min = (a < b) ? a : b;`\n`return isLeapYear() ? 366 : 365;` statt if/else mit zwei returns.",
      "source": {
        "title": "Folien 10 Bedingungsoperator",
        "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
        "page": 30
      }
    },
    {
      "id": "fc-gp1-string-plus",
      "chapterId": "gp1-operators",
      "examRelevant": true,
      "front": "Was geben `1 + 2 + \"3\"`, `\"3\" + 1 + 2` und `\"3\" + (1 + 2)` aus?",
      "back": "\"33\": erst 1 + 2 = 3 (int), dann String-Verkettung.\n\"312\": ab dem ersten String wird von links nach rechts verkettet.\n\"33\": Klammern zuerst.\nRegel: + wird links nach rechts ausgewertet; sobald ein Operand String ist, wird verkettet.",
      "source": {
        "title": "Folien 05 sonstige Operatoren (String-Verkettung)",
        "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
        "page": 25
      }
    },
    {
      "id": "fc-gp1-compound",
      "chapterId": "gp1-operators",
      "examRelevant": false,
      "front": "Was bedeuten `x += y`, `x -= y`, `x *= y`, `x /= y`, `x %= y`?",
      "back": "Kombinierte Zuweisung: x = x + y, x = x - y, x = x * y, x = x / y, x = x % y. Der Ausdruck liefert zusätzlich den neuen Wert von x.\nTypisch in Schleifen zum Aufsummieren: `sum += i;`",
      "source": {
        "title": "Folien 05 Zuweisungsoperatoren",
        "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
        "page": 24
      }
    },
    {
      "id": "fc-gp1-trace-method",
      "chapterId": "gp1-operators",
      "examRelevant": true,
      "front": "Wie gehst du bei einer Code-Tracing-Aufgabe („Welche Ausgabe erfolgt?“) systematisch vor?",
      "back": "1) Wertetabelle: eine Spalte pro Variable, eine Zeile pro Anweisung/Bedingungsprüfung.\n2) Struktur nach Klammern lesen, nicht nach Einrückung (if/else/for ohne {} = 1 Anweisung).\n3) Bei x++ / ++x: Wert für den Ausdruck notieren, dann Variable aktualisieren.\n4) switch: Einstieg + Fall-Through bis break.\n5) Exakt ausgeben: print vs println, Leerzeichen, Reihenfolge.",
      "source": {
        "title": "Probeklausur Aufgaben 3 + 5",
        "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
        "page": 4
      }
    },
    {
      "id": "fc-gp1-ret-expr",
      "chapterId": "gp1-operators",
      "examRelevant": false,
      "front": "Wie vereinfacht man `if (x <= y) { return true; } else { return false; }`?",
      "back": "`return x <= y;` – der Vergleich ist bereits ein boolean-Ausdruck mit Wert true/false (Folienbeispiel ordered()).",
      "source": {
        "title": "Folien 10 ordered() – 2. Versuch",
        "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
        "page": 29
      }
    },
    {
      "id": "fc-gp1-8",
      "chapterId": "gp1-control",
      "examRelevant": true,
      "front": "Was passiert bei einem `switch`, wenn man `break;` vergisst?",
      "back": "Fall-Through: Nach dem passenden case werden alle folgenden case-Zweige (und ggf. default) ebenfalls ausgeführt, bis ein break oder das Ende des switch erreicht ist.\nProbeklausur 3.a: selector = 1 → \"Eins\" + \"Zwei\" (break) → Ausgabe EinsZweiFertig!",
      "source": {
        "title": "Folien 07 switch-Anweisung",
        "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
        "page": 18
      }
    },
    {
      "id": "fc-gp1-if-nobrace",
      "chapterId": "gp1-control",
      "examRelevant": true,
      "front": "Was gehört bei `if (bed) a = 1; b = 2;` zum if?",
      "back": "Nur `a = 1;` – ohne geschweifte Klammern ist nur die unmittelbar nächste Anweisung bedingt. `b = 2;` wird immer ausgeführt, egal wie eingerückt.\n(Probeklausur 3.b: a++ und b++ stehen trotz Einrückung NICHT im if.)",
      "source": {
        "title": "VFH VER – Zusammenfassung (Klammern)",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VER-EinfachUndMehrfachverzweigung.pdf",
        "page": 35
      }
    },
    {
      "id": "fc-gp1-dangling",
      "chapterId": "gp1-control",
      "examRelevant": true,
      "front": "Zu welchem if gehört ein else bei verschachtelten if-Anweisungen ohne Klammern?",
      "back": "Zum nächstgelegenen vorherigen if, das noch kein else hat (inneres if) – unabhängig von der Einrückung.\nWill man das äußere if, muss das innere if in { } stehen.",
      "source": {
        "title": "VFH VER – Verschachtelung",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VER-EinfachUndMehrfachverzweigung.pdf",
        "page": 23
      }
    },
    {
      "id": "fc-gp1-switch-types",
      "chapterId": "gp1-control",
      "examRelevant": false,
      "front": "Welche Typen darf der Ausdruck eines switch haben?",
      "back": "Folien: char, byte, short, int. Zusätzlich (VFH VER): String und Aufzählungstypen (Enum).\nNICHT: long, boolean, double/float (mit javac geprüft: long ist ein Fehler, obwohl die VFH-LE es auflistet).",
      "source": {
        "title": "Folien 07 switch-Anweisung",
        "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
        "page": 18
      }
    },
    {
      "id": "fc-gp1-default",
      "chapterId": "gp1-control",
      "examRelevant": true,
      "front": "Wann wird der default-Zweig eines switch ausgeführt?",
      "back": "1) Wenn kein case-Wert passt (Einstieg bei default).\n2) Durch Fall-Through, wenn ein vorheriger Zweig ohne break in default hineinläuft.\ndefault ist optional; Konvention: als letzter Zweig mit break.",
      "source": {
        "title": "Folien 07 switch-Anweisung",
        "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
        "page": 18
      }
    },
    {
      "id": "fc-gp1-empty-stmt",
      "chapterId": "gp1-control",
      "examRelevant": true,
      "front": "Was bewirkt das Semikolon in `if (x > 5); { x = 0; }`?",
      "back": "Das ; ist eine leere Anweisung und bildet den kompletten if-Rumpf. Der folgende Block { x = 0; } ist unabhängig und wird IMMER ausgeführt → Logikfehler, kompiliert aber.",
      "source": {
        "title": "Folien 07 leere Anweisung",
        "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
        "page": 5
      }
    },
    {
      "id": "fc-gp1-arrow-switch",
      "chapterId": "gp1-control",
      "examRelevant": false,
      "front": "Was ist anders an der neuen switch-Syntax `case 'a', 'e' -> { … }`?",
      "back": "Seit Java 14: mehrere Werte pro case mit Komma, Pfeil -> statt Doppelpunkt, KEIN Fall-Through, kein break nötig.",
      "source": {
        "title": "Folien 07 switch neue Syntax",
        "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
        "page": 22
      }
    },
    {
      "id": "fc-gp1-loop-kinds",
      "chapterId": "gp1-loops",
      "examRelevant": true,
      "front": "Nenne die Schleifenarten in Java und ihre Eigenschaft (vor-/nachprüfend).",
      "back": "while: kopfgesteuert/vorprüfend (abweisend) – evtl. 0 Durchläufe.\ndo-while: fußgesteuert/nachprüfend – mindestens 1 Durchlauf; `while (…);` mit Semikolon.\nfor: zählergesteuert, vorprüfend.\nforeach: `for (Typ e : array)` – durchläuft alle Elemente.",
      "source": {
        "title": "Folien 07 Schleifen",
        "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
        "page": 23
      }
    },
    {
      "id": "fc-gp1-for-while",
      "chapterId": "gp1-loops",
      "examRelevant": true,
      "front": "Wie schreibt man `for (Init; Bedingung; Update) { Rumpf }` als while-Schleife um? (Probeklausur 6.b)",
      "back": "Init;\nwhile (Bedingung) {\n    Rumpf;\n    Update;\n}\nUnterschied: Variablen aus dem for-Kopf existieren nur in der Schleife; bei der while-Version stehen sie davor.",
      "source": {
        "title": "VFH ITR – Äquivalenz zur while-Schleife",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ITR-Iterationen.pdf",
        "page": 29
      }
    },
    {
      "id": "fc-gp1-doit",
      "chapterId": "gp1-loops",
      "examRelevant": true,
      "front": "Was macht `for (int i=0; i<=x; j=j*2) System.out.println(i++ + \" : \" + j);` mit j = 1? (Probeklausur 6.a, 4 P)",
      "back": "Es gibt die Zweierpotenzen von 2^0 bis 2^x aus, je Zeile \"Exponent : Wert\" (x + 1 Zeilen), z. B. doIt(3): 0 : 1, 1 : 2, 2 : 4, 3 : 8.\ni wird im println per i++ erhöht (nach dem Lesen), j im Update-Teil verdoppelt.",
      "source": {
        "title": "Probeklausur Aufgabe 6.a",
        "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
        "page": 7
      }
    },
    {
      "id": "fc-gp1-break-continue",
      "chapterId": "gp1-loops",
      "examRelevant": true,
      "front": "Was bewirken `break`, `continue` und `break outerLoop;`?",
      "back": "break: verlässt sofort die innerste Schleife (bzw. den switch).\ncontinue: bricht nur den aktuellen Durchlauf ab und macht mit der nächsten Iteration weiter (bei for: erst Update).\nbreak outerLoop; / continue outerLoop;: wirken auf die mit dem Label `outerLoop:` markierte äußere Schleife.",
      "source": {
        "title": "Folien 07 break/continue",
        "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
        "page": 37
      }
    },
    {
      "id": "fc-gp1-naming-refactor",
      "chapterId": "gp1-loops",
      "examRelevant": true,
      "front": "Welche Namensregeln gelten beim Refactoring (Probeklausur 6.b „bessere Namen“)?",
      "back": "Methoden: Verb + Rest, camelCase, klein beginnend (printPowersOfTwo, calculateSum).\nVariablen: aussagekräftige Nomen (exponent, power), boolean als Zustand (ready).\nKlassen: Nomen im Singular, groß.\nKonstanten: GROSS_MIT_UNTERSTRICH. Deutsch und Englisch nicht mischen.",
      "source": {
        "title": "Folien 03 Namensgebung",
        "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
        "page": 10
      }
    },
    {
      "id": "fc-gp1-endless",
      "chapterId": "gp1-loops",
      "examRelevant": false,
      "front": "Woran erkennt man Endlosschleifen? Nenne zwei Beispiele.",
      "back": "Die Bedingung wird nie false, weil sich keine ihrer Variablen im Rumpf ändert oder weil sie fehlt.\nBeispiele: `for (;;) { … }`, `while (x < 10) { System.out.println(x); }` ohne x-Änderung, `while (i < 5); { i++; }` (Semikolon = leerer Rumpf).",
      "source": {
        "title": "VFH ITR – Endlosschleifen",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ITR-Iterationen.pdf",
        "page": 13
      }
    },
    {
      "id": "fc-gp1-foreach",
      "chapterId": "gp1-loops",
      "examRelevant": false,
      "front": "Wie sieht eine foreach-Schleife über `args` aus und wann nimmt man sie?",
      "back": "for (String str : args) {\n    System.out.println(\"Argument = \" + str);\n}\nFür nur lesenden Zugriff auf alle Elemente; zum Ändern von Array-Elementen oder wenn der Index gebraucht wird: normale for-Schleife.",
      "source": {
        "title": "Folien 07 foreach-Anweisung",
        "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
        "page": 36
      }
    },
    {
      "id": "fc-gp1-testbed",
      "chapterId": "gp1-debug",
      "examRelevant": true,
      "front": "Probeklausur 4.a (8 P): Welche zwei Fehler hat TestBed? (for (int j = 2; …) { if (j = 3) {…} } System.out.println(j);)",
      "back": "1) Zeile 07: `if (j = 3)` ist eine Zuweisung (int) statt Vergleich → `if (j == 3)`.\n2) Zeile 14: `j` ist im for-Kopf deklariert und außerhalb der Schleife nicht sichtbar → `int j;` vor der Schleife deklarieren und `for (j = 2; …)`.",
      "source": {
        "title": "Probeklausur Aufgabe 4.a",
        "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
        "page": 5
      }
    },
    {
      "id": "fc-gp1-uninit",
      "chapterId": "gp1-debug",
      "examRelevant": true,
      "front": "Warum ist `int x; System.out.println(x);` in einer Methode ein Fehler, ein Attribut `int x;` aber nicht?",
      "back": "Lokale Variablen bekommen keinen Standardwert – der Compiler meldet \"variable x might not have been initialized\".\nInstanzvariablen werden automatisch mit 0/0.0/false/null initialisiert.",
      "source": {
        "title": "VFH KLA – Zusammenfassung (Defaultkonstruktor)",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_KLA-EigeneKlassenProgrammieren.pdf",
        "page": 62
      }
    },
    {
      "id": "fc-gp1-missing-return",
      "chapterId": "gp1-debug",
      "examRelevant": false,
      "front": "Was meldet der Compiler bei `int f(int x) { if (x > 0) { return 1; } }`?",
      "back": "\"missing return statement\": In einer Methode mit Rückgabetyp muss JEDER mögliche Weg mit return enden. Lösung: z. B. `return 0;` am Ende oder else-Zweig ergänzen.",
      "source": {
        "title": "Folien 09 Rückgabetyp",
        "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
        "page": 12
      }
    },
    {
      "id": "fc-gp1-shadow-setter",
      "chapterId": "gp1-debug",
      "examRelevant": true,
      "front": "Warum bleibt das Attribut bei `public void setName(String name) { name = name; }` unverändert?",
      "back": "Der Parameter name verdeckt das gleichnamige Attribut; `name = name;` weist den Parameter sich selbst zu. Das Attribut bleibt null.\nKorrektur: `this.name = name;` (Checkstyle meldet „verbirgt ein Feld“).",
      "source": {
        "title": "Folien 09 this",
        "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
        "page": 20
      }
    },
    {
      "id": "fc-gp1-runtime-exc",
      "chapterId": "gp1-debug",
      "examRelevant": true,
      "front": "Welche Laufzeitfehler lösen aus: `10 / 0` (int), `a[a.length]`, `String s = null; s.length();`, `(Girokonto) einSparbuch`?",
      "back": "10 / 0 → ArithmeticException\na[a.length] → ArrayIndexOutOfBoundsException\ns.length() auf null → NullPointerException\nunpassender Cast → ClassCastException\nAlle sind unchecked (RuntimeException) – der Compiler meldet sie nicht.",
      "source": {
        "title": "VFH EXC – Die Exception-Klassen",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EXC-Ausnahmebehandlung.pdf",
        "page": 34
      }
    },
    {
      "id": "fc-gp1-err-checklist",
      "chapterId": "gp1-debug",
      "examRelevant": true,
      "front": "Checkliste für „Finden Sie die Fehler“: Welche 8 Dinge prüfst du nacheinander?",
      "back": "1) = statt == in Bedingungen\n2) Variable außerhalb ihres Blocks (Scope)\n3) lokale Variable nicht initialisiert\n4) Typen: Einengung ohne Cast (float = 3.14, byte = byte + byte)\n5) static-Kontext greift auf Instanzmitglieder zu\n6) fehlende ; / } / return\n7) Konstruktor/OOP: super() nicht 1. Zeile, new abstract, Methoden nicht implementiert\n8) Logik: ; nach if/while, Off-by-one, Endlosschleife",
      "source": {
        "title": "Probeklausur Aufgabe 4",
        "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
        "page": 5
      }
    },
    {
      "id": "fc-gp1-comments",
      "chapterId": "gp1-javadoc",
      "examRelevant": true,
      "front": "Welche drei Kommentararten gibt es in Java?",
      "back": "// Zeilenkommentar – bis Zeilenende\n/* Blockkommentar */ – über mehrere Zeilen (z. B. Datei-Header)\n/** Dokumentationskommentar */ – wird von javadoc zu HTML-Doku verarbeitet",
      "source": {
        "title": "Folien 03 Kommentare",
        "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
        "page": 14
      }
    },
    {
      "id": "fc-gp1-javadoc-tags",
      "chapterId": "gp1-javadoc",
      "examRelevant": true,
      "front": "Welche JavaDoc-Tags brauchst du für Klasse, Konstruktor und Methode (Probeklausur 6.c / 8.a)?",
      "back": "Klasse: Beschreibung + @author name + @version version\nKonstruktor: Beschreibung + @param je Parameter\nMethode: Beschreibung + @param je Parameter + @return (wenn nicht void) + ggf. @throws Klasse Beschreibung\nWeitere: @see, @since, @deprecated",
      "source": {
        "title": "Folien 03 markierte Absätze (Tags)",
        "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
        "page": 23
      }
    },
    {
      "id": "fc-gp1-javadoc-place",
      "chapterId": "gp1-javadoc",
      "examRelevant": true,
      "front": "Wo steht ein JavaDoc-Kommentar und was gilt für seine erste Zeile?",
      "back": "Unmittelbar vor der Definition einer Klasse, Methode, eines Konstruktors oder einer Instanzvariable.\nDer erste Satz wird als Kurzbeschreibung verwendet und muss mit einem Punkt „.“ abgeschlossen werden. HTML ist erlaubt (aber kein <h1>/<h2>).",
      "source": {
        "title": "Folien 03 JavaDoc richtig einsetzen",
        "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
        "page": 22
      }
    },
    {
      "id": "fc-gp1-javadoc-cmd",
      "chapterId": "gp1-javadoc",
      "examRelevant": false,
      "front": "Was bewirkt `javadoc -d doc -private -author -version *.java`?",
      "back": "Erzeugt HTML-Dokumentation aller Java-Dateien im Verzeichnis:\n-d doc → Zielverzeichnis doc\n-private → auch private Elemente dokumentieren\n-author / -version → @author- und @version-Einträge anzeigen",
      "source": {
        "title": "Folien 03 JavaDoc Beispiel",
        "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
        "page": 29
      }
    },
    {
      "id": "fc-gp1-header",
      "chapterId": "gp1-javadoc",
      "examRelevant": false,
      "front": "Was gehört in den Kommentar-Header am Anfang jeder Datei?",
      "back": "Name der Datei, Copyright-Vermerk, Logbuch der Änderungen mit Version, Datum und Kürzel (z. B. @version 1.00 - 27 Nov 2004 - GJV - initial version). Als Blockkommentar /* … */ vor der Klasse.",
      "source": {
        "title": "Folien 03 Kommentar-Header",
        "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
        "page": 11
      }
    },
    {
      "id": "fc-gp1-conventions",
      "chapterId": "gp1-javadoc",
      "examRelevant": true,
      "front": "Nenne 5 Layout-Regeln der Java Code Conventions aus der Vorlesung.",
      "back": "1) Einrückung 4 Leerzeichen, keine Tabs\n2) Zusammengehöriges im Layout andeuten\n3) { am Zeilenende, } eingerückt wie die Anweisung\n4) Leerzeichen um Operatoren und nach Schlüsselwörtern (while (x < 10) {)\n5) Zeilen ≤ 100 Zeichen (eigentlich 80)",
      "source": {
        "title": "Folien 03 Java Code Conventions",
        "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
        "page": 7
      }
    },
    {
      "id": "fc-gp1-checkstyle",
      "chapterId": "gp1-javadoc",
      "examRelevant": false,
      "front": "Was bedeuten Error, Warning und Info bei Checkstyle?",
      "back": "Error: Problem im Code (oft Syntax) – muss korrigiert werden.\nWarning: Verstoß gegen die Code Conventions – muss korrigiert werden.\nInfo: mögliches Problem – muss geprüft, aber nicht immer korrigiert werden.\nAbgaben mit Errors/Warnings werden nicht akzeptiert (PVL).",
      "source": {
        "title": "Folien 03 Checkstyle-Kategorien",
        "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
        "page": 34
      }
    },
    {
      "id": "fc-gp1-magic-number",
      "chapterId": "gp1-javadoc",
      "examRelevant": false,
      "front": "Was ist eine „Magic Number“ und wie vermeidet man sie?",
      "back": "Eine unkommentierte Zahl mitten im Code (Checkstyle: „*100* sollte durch eine Konstante definiert sein“).\nLösung: benannte Konstante, z. B. `private static final double VAT_MULTIPLIER = 1.19;` oder `GRAVITATION = 9.81`.",
      "source": {
        "title": "Folien 03 Checkstyle-Beispiel",
        "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
        "page": 35
      }
    },
    {
      "id": "fc-gp1-encapsulation",
      "chapterId": "gp1-classes",
      "examRelevant": true,
      "front": "Was soll mit Datenkapselung erreicht werden und wie wird sie in Java umgesetzt? (Probeklausur 9.a, 6 P)",
      "back": "Ziel: Interna eines Objekts nach außen abschirmen; nur definierte Zugänge erlauben → keine unbeabsichtigten/ungültigen Änderungen, gültiger Zustand, Implementierung später änderbar, Klasse nur „von außen“ verstehen (Wiederverwendung).\nUmsetzung: Attribute private; Zugriff ausschließlich über public Methoden (Getter/Setter), die Werte prüfen können (z. B. setYear nur bei year > 1900).",
      "source": {
        "title": "Folien 08 Kapselung",
        "path": "moodle-data/gdp1/files/08. OOP_ Theorie/GP1_26WS_08_OOP_Theorie.pdf",
        "page": 14
      }
    },
    {
      "id": "fc-gp1-ctor",
      "chapterId": "gp1-classes",
      "examRelevant": true,
      "front": "Was ist ein Konstruktor? Nenne 4 Eigenschaften.",
      "back": "Spezielle Methode, die beim Erzeugen (new) eines Objekts aufgerufen wird.\n1) heißt genau wie die Klasse\n2) hat KEINEN Rückgabetyp (auch kein void)\n3) initialisiert die Attribute\n4) ohne eigenen Konstruktor erzeugt der Compiler einen parameterlosen Standardkonstruktor\n(+ überladbar; this(…) ruft einen anderen Konstruktor als 1. Anweisung)",
      "source": {
        "title": "Folien 09 Konstruktor",
        "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
        "page": 23
      }
    },
    {
      "id": "fc-gp1-default-ctor-gone",
      "chapterId": "gp1-classes",
      "examRelevant": true,
      "front": "Klasse Car hat nur den Konstruktor `Car(String d)`. Warum ist `new Car()` ein Compile-Fehler?",
      "back": "Der implizite Standardkonstruktor wird nur erzeugt, wenn die Klasse GAR KEINEN Konstruktor deklariert. Sobald ein eigener Konstruktor existiert, gibt es Car() nicht mehr – man muss ihn bei Bedarf selbst schreiben.",
      "source": {
        "title": "VFH KLA – Impliziter Defaultkonstruktor",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_KLA-EigeneKlassenProgrammieren.pdf",
        "page": 12
      }
    },
    {
      "id": "fc-gp1-this",
      "chapterId": "gp1-classes",
      "examRelevant": true,
      "front": "Wofür steht `this` und wofür `this(…)`?",
      "back": "this: Referenz auf das aktuelle Objekt – z. B. `this.description = description;` unterscheidet Attribut und gleichnamigen Parameter.\nthis(…): Aufruf eines anderen Konstruktors derselben Klasse (Wiederverwendung, z. B. Copy-Konstruktor); muss die erste Anweisung im Konstruktor sein.",
      "source": {
        "title": "Folien 09 this / eigene Konstruktoren aufrufen",
        "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
        "page": 27
      }
    },
    {
      "id": "fc-gp1-class-object",
      "chapterId": "gp1-classes",
      "examRelevant": true,
      "front": "Was ist der Unterschied zwischen Klasse und Objekt?",
      "back": "Klasse: allgemeine Beschreibung/Bauplan von Dingen mit gemeinsamer Struktur (Attribute = Zustand) und gemeinsamem Verhalten (Methoden). Klassen sind Referenztypen.\nObjekt (Instanz): konkrete Ausprägung einer Klasse mit eigenen Attributwerten, erzeugt mit new (z. B. Rick's Ford, Dad's Audi als Objekte der Klasse Car).",
      "source": {
        "title": "Folien 08 Abstraktion & Objekte",
        "path": "moodle-data/gdp1/files/08. OOP_ Theorie/GP1_26WS_08_OOP_Theorie.pdf",
        "page": 12
      }
    },
    {
      "id": "fc-gp1-getter-setter",
      "chapterId": "gp1-classes",
      "examRelevant": true,
      "front": "Wie sehen Getter und Setter für `private int year` aus (mit Prüfung > 1900)?",
      "back": "public int getYear() {\n    return year;\n}\n\npublic void setYear(int year) {\n    if (year > 1900) {\n        this.year = year;\n    }\n}",
      "source": {
        "title": "Folien 09 Beispiel Car (Kapselung)",
        "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
        "page": 21
      }
    },
    {
      "id": "fc-gp1-immutable",
      "chapterId": "gp1-classes",
      "examRelevant": false,
      "front": "Was ist eine Immutable Class und warum ist sie nützlich?",
      "back": "Unveränderliche Klasse: Nach der Erzeugung kann das Objekt nicht mehr geändert werden (Werte nur im Konstruktor, keine Setter, Getter wie description()). Einfacher zu entwickeln, implementieren und nutzen. Wichtigstes Beispiel: String.",
      "source": {
        "title": "Folien 09 Immutable Class",
        "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
        "page": 28
      }
    },
    {
      "id": "fc-gp1-ref-copy",
      "chapterId": "gp1-classes",
      "examRelevant": true,
      "front": "Was passiert bei `Car b = a;` (a ist ein Car-Objekt)? Wird das Objekt kopiert?",
      "back": "Nein – nur die Referenz wird kopiert. a und b zeigen auf DASSELBE Objekt; Änderungen über b sind über a sichtbar, a == b ist true.\nEine echte Kopie braucht z. B. einen Copy-Konstruktor `new Car(a)`.",
      "source": {
        "title": "VFH OBJ – Zusammenfassung (Referenzen)",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_OBJ-Objekte.pdf",
        "page": 43
      }
    },
    {
      "id": "fc-gp1-equals-vs-eq",
      "chapterId": "gp1-classes",
      "examRelevant": true,
      "front": "Was prüfen `==` und `equals()` bei Objekten? Was liefert equals ohne Überschreiben?",
      "back": "==: Identität – zeigen beide Referenzen auf dasselbe Objekt?\nequals(): Inhaltsgleichheit – aber nur, wenn die Klasse equals überschreibt (String tut das). Die von Object geerbte Version prüft wie == nur die Identität.",
      "source": {
        "title": "Folien 05 relationale Operatoren (Referenztypen)",
        "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
        "page": 21
      }
    },
    {
      "id": "fc-gp1-npe",
      "chapterId": "gp1-classes",
      "examRelevant": false,
      "front": "Was bedeutet der Wert `null` und was passiert bei `Car c = null; c.year();`?",
      "back": "null = die Referenzvariable verweist auf kein Objekt. Ein Methodenaufruf darauf löst zur Laufzeit eine NullPointerException aus (unchecked).",
      "source": {
        "title": "VFH OBJ – Zusammenfassung",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_OBJ-Objekte.pdf",
        "page": 43
      }
    },
    {
      "id": "fc-gp1-class-structure",
      "chapterId": "gp1-classes",
      "examRelevant": false,
      "front": "Wie ist eine Klasse grundsätzlich aufgebaut?",
      "back": "[Modifizierer] class Klassenname [extends Basisklasse] [implements Schnittstellen] {\n    Attributdeklarationen\n    Konstruktoren\n    Methodendeklarationen\n}\nDateiname = Name der public Klasse + .java.",
      "source": {
        "title": "Folien 09 Aufbau einer Klasse",
        "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
        "page": 6
      }
    },
    {
      "id": "fc-gp1-signature",
      "chapterId": "gp1-params",
      "examRelevant": true,
      "front": "Was ist die Signatur einer Methode? Gehört der Rückgabetyp dazu?",
      "back": "Signatur = Methodenname + Reihenfolge der Parameter-Datentypen, z. B. move(String, int).\nDer Rückgabetyp gehört NICHT dazu – deshalb dürfen sich zwei Methoden nicht nur im Rückgabetyp unterscheiden.",
      "source": {
        "title": "Folien 09 Signatur einer Methode",
        "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
        "page": 17
      }
    },
    {
      "id": "fc-gp1-overload-override",
      "chapterId": "gp1-params",
      "examRelevant": true,
      "front": "Überladen (overloading) vs. Überlagern/Überschreiben (overriding)?",
      "back": "Überladen: mehrere Methoden mit gleichem Namen, aber unterschiedlicher Signatur (Parametertypen/-anzahl/-reihenfolge) – meist in derselben Klasse; Compiler wählt anhand der Argumente.\nÜberschreiben: Unterklasse definiert eine geerbte Methode mit GLEICHER Signatur neu (@Override); zur Laufzeit entscheidet das Objekt (Polymorphie).",
      "source": {
        "title": "Folien 10 Methoden überlagern",
        "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
        "page": 11
      }
    },
    {
      "id": "fc-gp1-cbv-prim",
      "chapterId": "gp1-params",
      "examRelevant": true,
      "front": "call by value bei primitiven Typen: Was gibt `int x = 5; callByValue(x); println(x)` aus, wenn die Methode `y = 7;` setzt?",
      "back": "x: 5 – die Methode bekommt eine Kopie des Wertes in ihren eigenen Speicherplatz y. Änderungen an y wirken nicht auf x.",
      "source": {
        "title": "Folien 10 call by value: int",
        "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
        "page": 35
      }
    },
    {
      "id": "fc-gp1-cbv-ref",
      "chapterId": "gp1-params",
      "examRelevant": true,
      "front": "call by value bei Referenzen: Unterschied zwischen `y.set(7)` und `y = new WrappedInt(7)` in der Methode?",
      "back": "Kopiert wird die Referenz – x und y zeigen auf dasselbe Objekt.\ny.set(7): ändert das gemeinsame Objekt → außen x: 7.\ny = new WrappedInt(7): nur die lokale Kopie zeigt auf ein neues Objekt → außen x: 5.\nDeshalb ist Java NICHT „call by reference“.",
      "source": {
        "title": "Folien 10 call by value: WrappedInt",
        "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
        "page": 42
      }
    },
    {
      "id": "fc-gp1-param-arg",
      "chapterId": "gp1-params",
      "examRelevant": false,
      "front": "Parameter vs. Argument – was ist was in `void setDescription(String s)` und `myCar.setDescription(\"Volvo\")`?",
      "back": "Parameter (formaler Parameter): s – Variable im Methodenkopf.\nArgument: \"Volvo\" – der beim Aufruf übergebene Wert. Der Parameter übernimmt den Wert des Arguments.",
      "source": {
        "title": "Folien 09 Parameter vs. Argument",
        "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
        "page": 15
      }
    },
    {
      "id": "fc-gp1-return-void",
      "chapterId": "gp1-params",
      "examRelevant": false,
      "front": "Was bedeuten `void` und `return` bei Methoden?",
      "back": "void: Methode liefert keinen Wert (return; optional).\nreturn Ausdruck;: beendet die Methode sofort und gibt den Wert (passend zum Rückgabetyp, primitiv oder Referenztyp) an den Aufrufer zurück.",
      "source": {
        "title": "Folien 09 Rückgabetyp",
        "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
        "page": 12
      }
    },
    {
      "id": "fc-gp1-varargs",
      "chapterId": "gp1-params",
      "examRelevant": false,
      "front": "Was bedeutet `public void orderPizza(int table, String... topping)`?",
      "back": "Varargs (seit Java 5): Der letzte Parameter nimmt beliebig viele String-Argumente auf; in der Methode Zugriff wie auf ein Array (topping[i], topping.length).",
      "source": {
        "title": "Folien 09 Parameter-Liste",
        "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
        "page": 13
      }
    },
    {
      "id": "fc-gp1-super-ctor",
      "chapterId": "gp1-inheritance",
      "examRelevant": true,
      "front": "Werden Konstruktoren vererbt? Wie ruft man den Oberklassen-Konstruktor auf?",
      "back": "Nein, Konstruktoren werden nicht vererbt.\nAufruf mit super(…) (ggf. mit Argumenten) als ERSTE Anweisung im Unterklassen-Konstruktor. Fehlt er, fügt der Compiler super(); ein – Compile-Fehler, wenn die Oberklasse keinen parameterlosen Konstruktor hat.\nKonstruktorenverkettung: Initialisierung von oben (Object) nach unten.",
      "source": {
        "title": "Folien 10 Konstruktoren und Vererbung",
        "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
        "page": 13
      }
    },
    {
      "id": "fc-gp1-van",
      "chapterId": "gp1-inheritance",
      "examRelevant": true,
      "front": "Wie sieht der Konstruktor von `Van extends Car` aus (Car(description, year, price) + eigenes storage)?",
      "back": "public Van(String description, int year, double price, double storage) {\n    super(description, year, price);  // Oberklasse zuerst!\n    this.storage = storage;\n}",
      "source": {
        "title": "Folien 10 Beispiel Van",
        "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
        "page": 8
      }
    },
    {
      "id": "fc-gp1-super-method",
      "chapterId": "gp1-inheritance",
      "examRelevant": true,
      "front": "Was bedeuten `super.price()` und `super.msg`?",
      "back": "super ist eine Referenz auf die Oberklassen-Anteile des aktuellen Objekts (vgl. this). super.price() ruft die (überschriebene) Methode der Oberklasse auf, super.msg greift auf das Oberklassen-Attribut zu.\nVan: `return super.price() / VAT_MULTIPLIER;`",
      "source": {
        "title": "Folien 10 super",
        "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
        "page": 7
      }
    },
    {
      "id": "fc-gp1-polymorph",
      "chapterId": "gp1-inheritance",
      "examRelevant": true,
      "front": "Was ist Polymorphie (Polymorphismus)?",
      "back": "Vielgestaltigkeit: Eine Referenzvariable vom Typ T kann Objekte von T und allen Unterklassen von T aufnehmen (Shape s = new Rectangle(…)).\nBeim Aufruf einer überschriebenen Methode entscheidet das tatsächliche Objekt zur Laufzeit, welcher Code läuft (dynamische Bindung) – z. B. redTrafficLight(RoadVehicle v) ruft v.brake() jedes Fahrzeugs.",
      "source": {
        "title": "Folien 10 Polymorphismus",
        "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
        "page": 14
      }
    },
    {
      "id": "fc-gp1-declared-type",
      "chapterId": "gp1-inheritance",
      "examRelevant": true,
      "front": "`Konto k = new Girokonto(…); k.ueberweisen(…);` – warum Compile-Fehler, und wie löst man es?",
      "back": "Der Compiler prüft nur den DEKLARIERTEN Typ Konto – ueberweisen gibt es nur in Girokonto.\nLösung: prüfen und casten:\nif (k instanceof Girokonto) {\n    ((Girokonto) k).ueberweisen(…);\n}\nFalscher Cast ohne Prüfung → ClassCastException zur Laufzeit.",
      "source": {
        "title": "VFH VRB – Explizite Casts und instanceof",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
        "page": 34
      }
    },
    {
      "id": "fc-gp1-object",
      "chapterId": "gp1-inheritance",
      "examRelevant": false,
      "front": "Welche Rolle spielt die Klasse Object? Nenne 4 ihrer Methoden.",
      "back": "Wurzel der Klassenhierarchie: jede Klasse erbt implizit von Object (public class Car = public class Car extends Object).\nMethoden: boolean equals(Object), String toString(), int hashCode(), protected Object clone() (nur „shallow copy“).",
      "source": {
        "title": "Folien 10 Die Klasse Object",
        "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
        "page": 9
      }
    },
    {
      "id": "fc-gp1-single-inh",
      "chapterId": "gp1-inheritance",
      "examRelevant": false,
      "front": "Einfach- vs. Mehrfachvererbung – was kann Java? Was ist objektbasiert vs. objektorientiert?",
      "back": "Java: nur Einfachvererbung (eine Oberklasse); Informationen aus mehreren Quellen über Schnittstellen (interfaces). C++ erlaubt Mehrfachvererbung.\nObjektorientiert = Objekte + Vererbung; objektbasiert = Objekte ohne Vererbung.",
      "source": {
        "title": "Folien 10 Vererbung oder nicht?",
        "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
        "page": 4
      }
    },
    {
      "id": "fc-gp1-protected-inh",
      "chapterId": "gp1-inheritance",
      "examRelevant": true,
      "front": "Girokonto extends Konto: Warum geht `this.kontostand = …` nicht, wenn kontostand in Konto private ist? Lösungen?",
      "back": "private-Elemente sind nur in der eigenen Klasse zugreifbar – auch nicht in Unterklassen.\nLösungen: super(…)-Konstruktor zur Initialisierung, public Getter, protected Setter (protected = Paket + Unterklassen), z. B. `protected void setKontostand(double k)`.",
      "source": {
        "title": "VFH VRB – protected",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
        "page": 18
      }
    },
    {
      "id": "fc-gp1-rectangle-steps",
      "chapterId": "gp1-inheritance",
      "examRelevant": true,
      "front": "Probeklausur 8.a (16 P): Welche Bestandteile MUSS deine Klasse Rectangle enthalten?",
      "back": "1) Datei-Header + Klassen-JavaDoc (@author, @version)\n2) public class Rectangle extends Shape\n3) private double width; private double height; (mit JavaDoc)\n4) Konstruktor Rectangle(double width, double height) mit this.… (+ @param)\n5) @Override public double circumference() { return 2 * (width + height); } (+ @return)\n6) @Override public double area() { return width * height; } (+ @return)\nOptional: Getter, Prüfung auf >= 0.",
      "source": {
        "title": "Probeklausur Aufgabe 8.a",
        "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
        "page": 9
      }
    },
    {
      "id": "fc-gp1-override-annot",
      "chapterId": "gp1-inheritance",
      "examRelevant": false,
      "front": "Wozu dient `@Override`?",
      "back": "Annotation, die kennzeichnet, dass eine Methode eine geerbte Methode überschreibt. Der Compiler meldet einen Fehler, wenn es keine passende Oberklassen-Methode gibt (z. B. Tippfehler im Namen oder andere Parametertypen → wäre sonst nur eine Überladung).",
      "source": {
        "title": "VFH VRB – Zusammenfassung",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
        "page": 43
      }
    },
    {
      "id": "fc-gp1-stepwise",
      "chapterId": "gp1-theory",
      "examRelevant": true,
      "front": "Beschreibe das Prinzip der „schrittweisen Verfeinerung“ in der richtigen Reihenfolge. (Probeklausur 9.b, 6 P)",
      "back": "Methode zum Entwurf von Algorithmen für komplexe Aufgaben:\n1) Gesamtaufgabe beschreiben\n2) in weniger komplexe Teilaufgaben zerlegen\n3) Abhängigkeiten und Reihenfolge der Teilaufgaben festlegen\n4) Teilaufgaben über mehrere Verfeinerungsebenen weiter zerlegen, bis elementare Arbeitsschritte entstehen\n5) wiederkehrende Arbeitsschritte erkennen/zusammenfassen\n6) Teilalgorithmen zum Gesamtalgorithmus zusammensetzen (dann implementieren, testen)",
      "source": {
        "title": "VFH EIP – Methode der schrittweisen Verfeinerung",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EIP-Einfuehrung.pdf",
        "page": 38
      }
    },
    {
      "id": "fc-gp1-coffee",
      "chapterId": "gp1-theory",
      "examRelevant": true,
      "front": "Schrittweise Verfeinerung am Beispiel Kaffeekochen: Welche Teilaufgaben und Abhängigkeiten gibt es?",
      "back": "Teilaufgaben: „Wasser eingießen“, „Kaffeepulver eingeben“, „Kaffeemaschine starten“.\nReihenfolge der ersten beiden egal, aber beide vor dem Start.\nVerfeinerung: Pulver eingeben = Filter einlegen (zuerst) + Pulver einfüllen.\nOptimierung: Deckel nur einmal öffnen und am Ende schließen statt dreimal.",
      "source": {
        "title": "VFH EIP – Der Algorithmus Kaffeekochen",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EIP-Einfuehrung.pdf",
        "page": 39
      }
    },
    {
      "id": "fc-gp1-oop-ideas",
      "chapterId": "gp1-theory",
      "examRelevant": true,
      "front": "Nenne die Grundideen der objektorientierten Programmierung.",
      "back": "1) Abstraktion (Trennung Konzept/Umsetzung – Klasse vs. Objekt)\n2) Kapselung (Interna abschirmen)\n3) Wiederverwendung (Klasse nur von außen verstehen, JavaDoc)\n4) Beziehungen: Generalisierung/Spezialisierung (is-a), Aggregation/Komposition (part-of), Verwendungs-/Aufrufbeziehungen",
      "source": {
        "title": "Folien 08 Grundideen",
        "path": "moodle-data/gdp1/files/08. OOP_ Theorie/GP1_26WS_08_OOP_Theorie.pdf",
        "page": 11
      }
    },
    {
      "id": "fc-gp1-isa-partof",
      "chapterId": "gp1-theory",
      "examRelevant": true,
      "front": "is-a vs. part-of: Was ist der Unterschied, und wie setzt man sie in Java um?",
      "back": "is-a: B ist eine Spezialisierung von A (Fahrrad is-a Zweirad) → Vererbung (class B extends A); nur bei echter is-a-Beziehung (Liskov Substitution Principle).\npart-of: A ist Teil von B → Instanzvariable in B (class Zug { private Lokomotive lok; }).\nKomposition = essentielle Verbindung (Lokomotive/Güterzug), Aggregation = nicht-essentiell/temporär (PKW auf Fährschiff). Implementierung identisch.",
      "source": {
        "title": "Folien 08 is-a / part-of",
        "path": "moodle-data/gdp1/files/08. OOP_ Theorie/GP1_26WS_08_OOP_Theorie.pdf",
        "page": 21
      }
    },
    {
      "id": "fc-gp1-lsp",
      "chapterId": "gp1-theory",
      "examRelevant": false,
      "front": "Was besagt das Liskov Substitution Principle (LSP)?",
      "back": "Ersetzbarkeitsprinzip (Liskov & Wing, 1993): Vererbung darf nur bei einer richtigen „is-a“-Beziehung verwendet werden – ein Objekt der Unterklasse muss überall einsetzbar sein, wo die Oberklasse erwartet wird.",
      "source": {
        "title": "Folien 08 LSP",
        "path": "moodle-data/gdp1/files/08. OOP_ Theorie/GP1_26WS_08_OOP_Theorie.pdf",
        "page": 22
      }
    },
    {
      "id": "fc-gp1-assert",
      "chapterId": "gp1-theory",
      "examRelevant": false,
      "front": "Wie funktionieren Assertions in Java?",
      "back": "assert Ausdruck1 [: Ausdruck2];\nIst Ausdruck1 false, wird ein AssertionError ausgelöst (Ausdruck2 = Fehlermeldung), z. B. assert childCnt >= 0 : \"illegal number of children: \" + childCnt;\nNur aktiv, wenn mit java -ea MyClass gestartet. Zweck: Fehlersuche, Parameterbereiche sicherstellen.",
      "source": {
        "title": "Folien 08 Assertions in Java",
        "path": "moodle-data/gdp1/files/08. OOP_ Theorie/GP1_26WS_08_OOP_Theorie.pdf",
        "page": 34
      }
    },
    {
      "id": "fc-gp1-simula",
      "chapterId": "gp1-theory",
      "examRelevant": false,
      "front": "Welche Sprache gilt als erste objektorientierte Programmiersprache, und was prägte Smalltalk?",
      "back": "Simula 67 (Dahl & Nygaard, Oslo) – Erweiterung von Simula 1 um Objekte, Klassen und Garbage Collection.\nSmalltalk (Alan Kay u. a., Xerox PARC, ab 1971): „Alles ist ein Objekt“.",
      "source": {
        "title": "Folien 08 OO-Geschichte",
        "path": "moodle-data/gdp1/files/08. OOP_ Theorie/GP1_26WS_08_OOP_Theorie.pdf",
        "page": 3
      }
    },
    {
      "id": "fc-gp1-usage-rel",
      "chapterId": "gp1-theory",
      "examRelevant": false,
      "front": "Was ist eine Verwendungsbeziehung (Assoziation)?",
      "back": "Sehr allgemeine Beziehung: Eine Methode benutzt ein temporäres („fremdes“) Objekt, das z. B. Teil der Parameterliste ist (main verwendet String). Kein Attribut, nur vorübergehende Nutzung.",
      "source": {
        "title": "Folien 08 Verwendungsbeziehung",
        "path": "moodle-data/gdp1/files/08. OOP_ Theorie/GP1_26WS_08_OOP_Theorie.pdf",
        "page": 29
      }
    },
    {
      "id": "fc-gp1-7",
      "chapterId": "gp1-exceptions",
      "examRelevant": true,
      "front": "Unterschied zwischen Checked Exceptions und Unchecked (Runtime) Exceptions?",
      "back": "• Checked (erben von Exception, z. B. IOException, FileNotFoundException): Compiler erzwingt Behandlung mit try-catch oder Weitergabe mit throws.\n• Unchecked (erben von RuntimeException, z. B. NullPointerException, ArithmeticException, ArrayIndexOutOfBoundsException, IllegalArgumentException): Behandlung optional, meist Programmierfehler.\n(Error = schwere, nicht behebbare Fehler, ebenfalls unchecked.)",
      "source": {
        "title": "VFH EXC – checked und unchecked",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EXC-Ausnahmebehandlung.pdf",
        "page": 9
      }
    },
    {
      "id": "fc-gp1-throw-throws",
      "chapterId": "gp1-exceptions",
      "examRelevant": true,
      "front": "Unterschied zwischen `throw` und `throws`?",
      "back": "throw (ohne s): wirft tatsächlich eine Exception – `throw new IllegalArgumentException(\"negativ\");`\nthrows (mit s): kündigt im Methodenkopf an, dass die Methode eine Exception weitergeben kann – `public int m() throws IOException` (+ @throws im JavaDoc).",
      "source": {
        "title": "VFH EXC – Selbst Exceptions auslösen",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EXC-Ausnahmebehandlung.pdf",
        "page": 14
      }
    },
    {
      "id": "fc-gp1-finally",
      "chapterId": "gp1-exceptions",
      "examRelevant": true,
      "front": "Wann wird ein `finally`-Block ausgeführt?",
      "back": "Immer: wenn der try-Block ohne Exception durchläuft, wenn ein catch-Block greift und sogar wenn try/catch mit return oder throw verlassen wird – finally „drängt sich dazwischen“. Typisch für Aufräumarbeiten (Datei/Verbindung schließen).",
      "source": {
        "title": "VFH EXC – finally",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EXC-Ausnahmebehandlung.pdf",
        "page": 13
      }
    },
    {
      "id": "fc-gp1-catch-order",
      "chapterId": "gp1-exceptions",
      "examRelevant": true,
      "front": "In welcher Reihenfolge müssen mehrere catch-Blöcke stehen?",
      "back": "Vom speziellsten zum allgemeinsten Typ: erst Unterklasse (z. B. ArithmeticException), dann Oberklasse (Exception). Umgekehrt meldet der Compiler „exception … has already been caught“.\nGleiche Behandlung: catch (A | B e) { … }.",
      "source": {
        "title": "VFH EXC – Mehrere Exceptiontypen behandeln",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EXC-Ausnahmebehandlung.pdf",
        "page": 31
      }
    },
    {
      "id": "fc-gp1-callstack",
      "chapterId": "gp1-exceptions",
      "examRelevant": false,
      "front": "Was passiert mit einer Exception, die in einer Methode nicht gefangen wird?",
      "back": "Die Methode bricht sofort ab; das Exception-Objekt wird an die aufrufende Methode (nächste Ebene des Aufruf-Stacks) weitergereicht – so lange, bis ein passender catch-Block gefunden wird. Ohne Behandlung beendet die JVM das Programm und gibt den Stacktrace aus.",
      "source": {
        "title": "VFH EXC – Der Aufruf-Stack",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EXC-Ausnahmebehandlung.pdf",
        "page": 6
      }
    },
    {
      "id": "fc-gp1-exc-hierarchy",
      "chapterId": "gp1-exceptions",
      "examRelevant": false,
      "front": "Skizziere die Exception-Hierarchie in Java.",
      "back": "Object → Throwable → Error (schwere Fehler)\n                    → Exception → IOException → FileNotFoundException (checked)\n                                → RuntimeException → ArithmeticException, NullPointerException, ClassCastException, IllegalArgumentException, IndexOutOfBoundsException → ArrayIndexOutOfBoundsException (unchecked)",
      "source": {
        "title": "VFH EXC – Die Exception-Klassen",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EXC-Ausnahmebehandlung.pdf",
        "page": 33
      }
    },
    {
      "id": "fc-gp1-own-exc",
      "chapterId": "gp1-exceptions",
      "examRelevant": false,
      "front": "Wie schreibt man eine eigene Exception-Klasse?",
      "back": "Klasse von Exception (checked) oder RuntimeException (unchecked) ableiten; Name endet auf …Exception und beschreibt die Fehlersituation; meist keine eigenen Attribute/Methoden.\npublic class NullHochNullException extends Exception { }",
      "source": {
        "title": "VFH EXC – Zusammenfassung",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EXC-Ausnahmebehandlung.pdf",
        "page": 36
      }
    },
    {
      "id": "fc-gp1-exc-methods",
      "chapterId": "gp1-exceptions",
      "examRelevant": false,
      "front": "Welche zwei Methoden aus Throwable nutzt man im catch-Block am häufigsten?",
      "back": "e.getMessage() – liefert die Fehlermeldung des Exception-Objekts.\ne.printStackTrace() – schreibt den Aufruf-Stack auf System.err.",
      "source": {
        "title": "VFH EXC – Die Exception-Klassen",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EXC-Ausnahmebehandlung.pdf",
        "page": 35
      }
    },
    {
      "id": "fc-gp1-6",
      "chapterId": "gp1-exc-arr-str",
      "examRelevant": true,
      "front": "Warum sind Strings in Java \"immutable\" und wie vergleicht man zwei Strings korrekt?",
      "back": "Ein String-Objekt kann nach der Erzeugung nicht verändert werden; Methoden wie concat/toUpperCase/trim liefern einen NEUEN String (s = s.toUpperCase();).\nInhalt IMMER mit s1.equals(s2) vergleichen (oder equalsIgnoreCase), da == nur die Referenzen vergleicht.",
      "source": {
        "title": "VFH ZKT – Zusammenfassung",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ZKT-Zeichenketten.pdf",
        "page": 36
      }
    },
    {
      "id": "fc-gp1-array-basics",
      "chapterId": "gp1-exc-arr-str",
      "examRelevant": true,
      "front": "Wie deklariert und erzeugt man ein Array? Welche Indizes sind gültig?",
      "back": "int[] temperaturen = new int[24];   oder   int[] a = {4, 8, 15};\nIndizes 0 bis a.length - 1 (a.length ist ein Attribut, ohne Klammern). Zugriff auf a[a.length] → ArrayIndexOutOfBoundsException. Größe nachträglich nicht änderbar.",
      "source": {
        "title": "VFH ARR – Arrays erzeugen",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ARR-Arrays.pdf",
        "page": 12
      }
    },
    {
      "id": "fc-gp1-length-vs-length",
      "chapterId": "gp1-exc-arr-str",
      "examRelevant": true,
      "front": "`arr.length` vs. `str.length()` – was ist der Unterschied?",
      "back": "Array: length ist ein (finales) Attribut → ohne Klammern: arr.length\nString: length() ist eine Methode → mit Klammern: str.length()",
      "source": {
        "title": "VFH ARR – Zusammenfassung",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ARR-Arrays.pdf",
        "page": 58
      }
    },
    {
      "id": "fc-gp1-string-methods",
      "chapterId": "gp1-exc-arr-str",
      "examRelevant": true,
      "front": "Was liefern für s = \"Programm\": s.length(), s.charAt(0), s.indexOf('r'), s.substring(3), s.substring(3, 7), s.toUpperCase()?",
      "back": "8 · 'P' · 1 · \"gramm\" · \"gram\" (Ende exklusiv) · \"PROGRAMM\" (s selbst bleibt \"Programm\").",
      "source": {
        "title": "VFH ZKT – Methoden der Klasse String",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ZKT-Zeichenketten.pdf",
        "page": 6
      }
    },
    {
      "id": "fc-gp1-array-ref",
      "chapterId": "gp1-exc-arr-str",
      "examRelevant": false,
      "front": "Arrays sind Objekte – was folgt daraus für `int[] b = a; b[0] = 9;`?",
      "back": "b und a referenzieren dasselbe Array-Objekt; nach b[0] = 9 ist auch a[0] == 9. Kopie z. B. mit Arrays.copyOf(a, a.length).",
      "source": {
        "title": "VFH ARR – Arrays deklarieren (Objekt)",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ARR-Arrays.pdf",
        "page": 11
      }
    },
    {
      "id": "fc-gp1-arrays-class",
      "chapterId": "gp1-exc-arr-str",
      "examRelevant": false,
      "front": "Welche nützlichen statischen Methoden bietet java.util.Arrays?",
      "back": "Arrays.sort(a) – sortieren\nArrays.toString(a) – lesbare Ausgabe \"[1, 2, 3]\"\nArrays.equals(a, b) – Inhalt vergleichen\nArrays.copyOf(a, n) – Kopie mit neuer Länge",
      "source": {
        "title": "VFH ARR – Die Klasse Arrays",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ARR-Arrays.pdf",
        "page": 26
      }
    },
    {
      "id": "fc-gp1-args",
      "chapterId": "gp1-exc-arr-str",
      "examRelevant": true,
      "front": "`java Add 18 24`: Wie kommt das Programm an die Zahlen und was ergibt args[0] + args[1]?",
      "back": "Kommandozeilenparameter landen als String-Array in main(String[] args): args[0] = \"18\", args[1] = \"24\", args.length = 2.\nargs[0] + args[1] = \"1824\" (String-Verkettung!). Rechnen: Integer.parseInt(args[0]) + Integer.parseInt(args[1]) = 42.",
      "source": {
        "title": "Folien 06 Addition mit Java",
        "path": "moodle-data/gdp1/files/06. Benutzerinteraktion/GP1_26WS_06_Benutzerinteraktion.pdf",
        "page": 17
      }
    },
    {
      "id": "fc-gp1-2d",
      "chapterId": "gp1-exc-arr-str",
      "examRelevant": false,
      "front": "Wie arbeitet man mit zweidimensionalen Arrays?",
      "back": "int[][] m = new int[2][3]; (2 Zeilen, 3 Spalten) oder {{1, 2, 3}, {4, 5, 6}}.\nZugriff m[zeile][spalte]; m.length = Anzahl Zeilen, m[0].length = Anzahl Spalten der Zeile 0. Verschachtelte for-Schleifen.",
      "source": {
        "title": "VFH ARR – Mehrdimensionale Arrays",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ARR-Arrays.pdf",
        "page": 51
      }
    },
    {
      "id": "fc-gp1-stringbuilder",
      "chapterId": "gp1-exc-arr-str",
      "examRelevant": false,
      "front": "String vs. StringBuilder?",
      "back": "String: unveränderlich; Methoden liefern neue Strings.\nStringBuilder: veränderbar; Methoden wie append, insert, reverse, deleteCharAt ändern das Objekt selbst; toString() liefert einen String.",
      "source": {
        "title": "VFH ZKT – Typ StringBuilder",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ZKT-Zeichenketten.pdf",
        "page": 19
      }
    },
    {
      "id": "fc-gp1-literal-eq",
      "chapterId": "gp1-exc-arr-str",
      "examRelevant": false,
      "front": "Warum ist `passwort == \"123456\"` bei einer Benutzereingabe false, aber bei `passwort = \"123456\";` true?",
      "back": "Gleiche String-Literale im Quelltext werden vom Compiler zu EINEM gemeinsamen Objekt zusammengefasst → gleiche Referenz. Eine Eingabe erzeugt ein neues Objekt → andere Referenz. Deshalb immer equals verwenden!",
      "source": {
        "title": "VFH ZKT – Vergleich von String-Variablen",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ZKT-Zeichenketten.pdf",
        "page": 14
      }
    },
    {
      "id": "fc-gp1-compiler-interp",
      "chapterId": "gp1-context",
      "examRelevant": false,
      "front": "Compiler vs. Interpreter – und was macht Java?",
      "back": "Compiler: übersetzt den gesamten Quelltext vorab in Maschinencode für eine bestimmte CPU.\nInterpreter: setzt den Quelltext zur Laufzeit Zeile für Zeile um.\nJava: javac kompiliert in plattformunabhängigen Bytecode; die JVM (Interpreter) der jeweiligen Plattform führt ihn aus → Write once, run anywhere.",
      "source": {
        "title": "Folien 02 Compiler / Interpreter / JVM",
        "path": "moodle-data/gdp1/files/02. Java-Kontext/GP1_26WS_02_Java-Kontext.pdf",
        "page": 5
      }
    },
    {
      "id": "fc-gp1-javac-java",
      "chapterId": "gp1-context",
      "examRelevant": false,
      "front": "Mit welchen Befehlen übersetzt und startet man HelloMessageTester?",
      "back": "javac HelloMessageTester.java   (mit Dateiendung; erzeugt HelloMessageTester.class)\njava HelloMessageTester         (Klassenname, ohne .class)\nDateiname muss dem Namen der public Klasse entsprechen.",
      "source": {
        "title": "VFH EJP – Zusammenfassung",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EJP-DasErsteJavaProgramm.pdf",
        "page": 38
      }
    },
    {
      "id": "fc-gp1-gc",
      "chapterId": "gp1-context",
      "examRelevant": false,
      "front": "Was ist Garbage Collection?",
      "back": "Automatisches Freigeben von Speicherplatz, der nicht mehr benötigt wird – z. B. ein String-Objekt, auf das nach msg = \"Hallo Welt\" keine Referenz mehr zeigt. Kein manuelles Freigeben wie in C nötig.",
      "source": {
        "title": "Folien 02 Garbage Collection",
        "path": "moodle-data/gdp1/files/02. Java-Kontext/GP1_26WS_02_Java-Kontext.pdf",
        "page": 10
      }
    },
    {
      "id": "fc-gp1-java-safety",
      "chapterId": "gp1-context",
      "examRelevant": false,
      "front": "Welche Sprachmerkmale machen Java sicher/robust?",
      "back": "Keine Zeiger (Pointer), Laufzeitfehler werden abgefangen, Array-Grenzen werden überwacht, kein Präprozessor, keine überladenen Operatoren, automatische Garbage Collection; Programme laufen in der JVM (ggf. Sandbox).",
      "source": {
        "title": "Folien 02 Sicherheit (Sprache)",
        "path": "moodle-data/gdp1/files/02. Java-Kontext/GP1_26WS_02_Java-Kontext.pdf",
        "page": 9
      }
    },
    {
      "id": "fc-gp1-oo-tester",
      "chapterId": "gp1-context",
      "examRelevant": false,
      "front": "Woran erkennt man laut Abgaberichtlinien, dass eine Abgabe nicht objektorientiert ist?",
      "back": "Wenn in der main-Methode kein „new“ steht. Lösung: eine Testerklasse schreiben, deren main ein Objekt erzeugt und dessen Methoden aufruft (HelloMessage + HelloMessageTester).",
      "source": {
        "title": "Folien 03 Das 1. (OO-)Programm",
        "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
        "page": 36
      }
    },
    {
      "id": "fc-gp1-system",
      "chapterId": "gp1-context",
      "examRelevant": false,
      "front": "Wofür stehen System.out, System.err, System.in und System.exit(-1)?",
      "back": "System.out: Standardausgabestrom · System.err: Fehlerausgabe (oft rot) · System.in: Standardeingabe (z. B. für Scanner) · System.exit(status): beendet die Anwendung sofort mit Abbruchcode an das Betriebssystem. System ist eine Klasse mit statischen Mitgliedern.",
      "source": {
        "title": "Folien 06 Systemklasse System",
        "path": "moodle-data/gdp1/files/06. Benutzerinteraktion/GP1_26WS_06_Benutzerinteraktion.pdf",
        "page": 5
      }
    },
    {
      "id": "fc-gp1-packages",
      "chapterId": "gp1-context",
      "examRelevant": false,
      "front": "Warum kann man String und System ohne import benutzen? Wie importiert man Scanner?",
      "back": "String und System liegen im Paket java.lang, das der Compiler automatisch importiert (import java.lang.*;).\nScanner liegt in java.util → `import java.util.Scanner;` (oder voll qualifiziert java.util.Scanner). package-Anweisung steht in der 1. Zeile, vor import.",
      "source": {
        "title": "Folien 10 java.lang / Pakete",
        "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
        "page": 20
      }
    }
  ],
  "quizzes": [
    {
      "id": "q-gp1-switch",
      "chapterId": "gp1-control",
      "examStyle": "Probeklausur 3.a (5 Pkt)",
      "question": "Welche Ausgabe erzeugt dieser Code? (Achtung: fehlende breaks!)",
      "code": "int selector = 0;\nselector = 1;\nswitch (selector) {\n    case 0:\n        System.out.print(\"Null\");\n    case 1:\n        System.out.print(\"Eins\");\n    case 2:\n        System.out.print(\"Zwei\");\n        break;\n    default:\n        System.out.print(\"Oder?\");\n}\nSystem.out.println(\"Fertig!\");",
      "options": [
        "EinsZweiFertig!",
        "EinsFertig!",
        "NullEinsZweiFertig!",
        "EinsZweiOder?Fertig!"
      ],
      "answer": 0,
      "explanation": "selector ist 1 → Einstieg bei case 1 (\"Eins\"), kein break → Fall-Through in case 2 (\"Zwei\") → break beendet den switch, default wird NICHT erreicht → danach \"Fertig!\". \"EinsFertig!\" wäre richtig, wenn jeder case ein break hätte.",
      "source": {
        "title": "Probeklausur Aufgabe 3.a",
        "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
        "page": 4
      }
    },
    {
      "id": "q-gp1-if",
      "chapterId": "gp1-control",
      "examStyle": "Probeklausur 3.b (5 Pkt)",
      "question": "Was wird hier ausgegeben? (Achtung auf fehlende geschweifte Klammern!)",
      "code": "int a = 5;\nint b = 3;\n\nif (a >= 2 * b)\n    a = 2 * b;\n    a++;\n    b++;\na = a + 2 * b;\nSystem.out.println(a + \" \" + b);",
      "options": [
        "11 3",
        "15 4",
        "14 4",
        "12 3"
      ],
      "answer": 2,
      "explanation": "5 >= 6 ist false → nur `a = 2 * b;` wird übersprungen. `a++` (a = 6) und `b++` (b = 4) stehen trotz Einrückung NICHT im if. Dann a = 6 + 2 * 4 = 14 → \"14 4\". \"11 3\" entsteht, wenn man a++/b++ fälschlich zum if zählt.",
      "source": {
        "title": "Probeklausur Aufgabe 3.b",
        "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
        "page": 4
      }
    },
    {
      "id": "q-gp1-switch-null",
      "chapterId": "gp1-control",
      "examStyle": "Code-Tracing (Variante 3.a)",
      "question": "Gleicher switch wie in der Probeklausur, aber selector bleibt 0. Ausgabe?",
      "code": "int selector = 0;\nswitch (selector) {\n    case 0: System.out.print(\"Null\");\n    case 1: System.out.print(\"Eins\");\n    case 2: System.out.print(\"Zwei\"); break;\n    default: System.out.print(\"Oder?\");\n}\nSystem.out.println(\"Fertig!\");",
      "options": [
        "NullFertig!",
        "Oder?Fertig!",
        "NullEinsZweiOder?Fertig!",
        "NullEinsZweiFertig!"
      ],
      "answer": 3,
      "explanation": "Einstieg bei case 0, dann Fall-Through durch case 1 und case 2 bis zum break → \"NullEinsZwei\", default wird nicht erreicht, danach \"Fertig!\". (Mit java geprüft.)",
      "source": {
        "title": "Folien 07 switch-Anweisung",
        "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
        "page": 18
      }
    },
    {
      "id": "q-gp1-switch-default",
      "chapterId": "gp1-control",
      "examStyle": "Code-Tracing",
      "question": "Hier steht default nicht am Ende. Welche Ausgabe erfolgt?",
      "code": "char c = 'x';\nswitch (c) {\n    case 'a': System.out.print(\"A\");\n    default:  System.out.print(\"D\");\n    case 'b': System.out.print(\"B\"); break;\n    case 'c': System.out.print(\"C\");\n}\nSystem.out.println(\"!\");",
      "options": [
        "D!",
        "ADB!",
        "DBC!",
        "DB!"
      ],
      "answer": 3,
      "explanation": "'x' passt zu keinem case → Einstieg bei default (\"D\"). Ohne break Fall-Through in case 'b' (\"B\"), dort break. \"D!\" wäre nur richtig, wenn default ein break hätte. Deshalb Konvention: default als letzter Zweig.",
      "source": {
        "title": "Folien 07 switch-Anweisung",
        "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
        "page": 18
      }
    },
    {
      "id": "q-gp1-if-variant",
      "chapterId": "gp1-control",
      "examStyle": "Code-Tracing (Variante 3.b)",
      "question": "Probeklausur 3.b mit anderen Startwerten. Ausgabe?",
      "code": "int a = 6;\nint b = 4;\n\nif (a >= 2 * b)\n    a = 2 * b;\n    a++;\n    b++;\na = a + 2 * b;\nSystem.out.println(a + \" \" + b);",
      "options": [
        "17 5",
        "14 4",
        "19 5",
        "16 4"
      ],
      "answer": 0,
      "explanation": "6 >= 8 ist false → nur `a = 2 * b;` entfällt. a++ → 7, b++ → 5 (immer!). a = 7 + 2 * 5 = 17 → \"17 5\". \"14 4\" ist das Ergebnis, wenn man glaubt, a++/b++ gehörten zum if.",
      "source": {
        "title": "VFH VER – Zusammenfassung",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VER-EinfachUndMehrfachverzweigung.pdf",
        "page": 35
      }
    },
    {
      "id": "q-gp1-dangling-else",
      "chapterId": "gp1-control",
      "examStyle": "Code-Tracing",
      "question": "Die Einrückung suggeriert, dass else zum äußeren if gehört. Was wird ausgegeben?",
      "code": "int x = 5;\nif (x > 10)\n    if (x > 2)\n        System.out.print(\"A\");\nelse\n    System.out.print(\"B\");\nSystem.out.println(\"C\");",
      "options": [
        "BC",
        "AC",
        "C",
        "ABC"
      ],
      "answer": 2,
      "explanation": "else gehört zum NÄCHSTEN if ohne else – also zu `if (x > 2)`. Das äußere if (5 > 10) ist false, damit wird das gesamte innere if/else übersprungen → nur \"C\". \"BC\" wäre richtig, wenn das innere if in { } stünde.",
      "source": {
        "title": "VFH VER – Verschachtelung von if-Anweisungen",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VER-EinfachUndMehrfachverzweigung.pdf",
        "page": 23
      }
    },
    {
      "id": "q-gp1-vowels-fallthrough",
      "chapterId": "gp1-control",
      "examStyle": "Code-Tracing",
      "question": "Vokale zählen mit switch – aber ohne break. Welche Ausgabe?",
      "code": "String wort = \"Hallo Welt\";\nint vowelCnt = 0;\nint otherCnt = 0;\nfor (int i = 0; i < wort.length(); i++) {\n    switch (wort.charAt(i)) {\n        case 'a':\n        case 'e':\n        case 'o':\n            vowelCnt++;\n        default:\n            otherCnt++;\n    }\n}\nSystem.out.println(vowelCnt + \" \" + otherCnt);",
      "options": [
        "3 7",
        "3 6",
        "3 10",
        "10 10"
      ],
      "answer": 2,
      "explanation": "\"Hallo Welt\" enthält a, o, e → vowelCnt = 3. Da nach vowelCnt++ kein break steht, fällt jeder Vokal in default durch; default zählt also ALLE 10 Zeichen (inkl. Leerzeichen) → \"3 10\". Erwartet hatte der Autor \"3 7\" (Folien zeigen die korrekte Version mit break).",
      "source": {
        "title": "Folien 07 switch mit fall-through",
        "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
        "page": 20
      }
    },
    {
      "id": "q-gp1-inc",
      "chapterId": "gp1-operators",
      "examStyle": "Probeklausur 5.a (6 Pkt)",
      "question": "Welche Ausgabe erzeugt diese Schleife mit Post-Inkrement und Prä-Dekrement?",
      "code": "int a = 2;\nint b = 3;\n\nwhile (a++ <= 3) {\n    b = a - --b;\n}\n\nSystem.out.println(a + \" \" + b);",
      "options": [
        "4 4",
        "5 1",
        "4 2",
        "5 4"
      ],
      "answer": 3,
      "explanation": "Test 1: 2 <= 3 (true), a = 3; --b → 2; b = 3 - 2 = 1. Test 2: 3 <= 3 (true), a = 4; --b → 0; b = 4 - 0 = 4. Test 3: 4 <= 3 (false), a wird trotzdem 5! Ausgabe \"5 4\". \"4 4\" vergisst das Post-Inkrement beim letzten (falschen) Test.",
      "source": {
        "title": "Probeklausur Aufgabe 5.a",
        "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
        "page": 6
      }
    },
    {
      "id": "q-gp1-postpre",
      "chapterId": "gp1-operators",
      "examStyle": "Code-Tracing",
      "question": "Welche Ausgabe erfolgt?",
      "code": "int a = 5;\nint b = a++ + ++a;\nSystem.out.println(a + \" \" + b);",
      "options": [
        "7 12",
        "6 11",
        "7 11",
        "7 13"
      ],
      "answer": 0,
      "explanation": "Links nach rechts: a++ liefert 5 (a wird 6), ++a erhöht auf 7 und liefert 7 → b = 5 + 7 = 12, a = 7. \"7 11\" entsteht, wenn man ++a fälschlich als 6 rechnet.",
      "source": {
        "title": "Folien 05 arithmetische Operatoren",
        "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
        "page": 20
      }
    },
    {
      "id": "q-gp1-var05",
      "chapterId": "gp1-operators",
      "examStyle": "Code-Tracing (VFH-Übung VAR-05)",
      "question": "Welchen Wert haben ergebnis und zahl1 am Ende?",
      "code": "int zahl1 = 10;\nint ergebnis;\nergebnis = ++zahl1 * zahl1++;\nSystem.out.println(ergebnis + \" \" + zahl1);",
      "options": [
        "110 11",
        "121 11",
        "121 12",
        "132 12"
      ],
      "answer": 2,
      "explanation": "++zahl1 → zahl1 = 11, Wert 11. Dann zahl1++ → liefert 11, danach zahl1 = 12. ergebnis = 11 * 11 = 121, zahl1 = 12. \"132 12\" würde bedeuten, das Post-Inkrement wirke schon vor dem Lesen.",
      "source": {
        "title": "VFH VAR – Übung VAR-05",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VAR-VariablenUndPrimitiveDatentypen.pdf",
        "page": 16
      }
    },
    {
      "id": "q-gp1-eval-order",
      "chapterId": "gp1-operators",
      "examStyle": "Code-Tracing (Folienbeispiel)",
      "question": "Welchen Wert hat r?",
      "code": "int i = 2;\nint r = (i = 3) * i;\nSystem.out.println(r);",
      "options": [
        "6",
        "Compile-Fehler: Zuweisung in Ausdruck",
        "4",
        "9"
      ],
      "answer": 3,
      "explanation": "Operanden werden von links nach rechts ausgewertet: (i = 3) setzt i auf 3 und hat den Wert 3; danach wird das rechte i gelesen (jetzt 3) → 3 * 3 = 9 (Folie 05: „und nicht 6!“). Zuweisungen sind Ausdrücke mit Wert, daher kein Compile-Fehler.",
      "source": {
        "title": "Folien 05 Ausdrücke: Regeln (2)",
        "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
        "page": 18
      }
    },
    {
      "id": "q-gp1-intdiv",
      "chapterId": "gp1-operators",
      "examStyle": "Code-Tracing",
      "question": "Was gibt der Code aus?",
      "code": "int a = 7;\nint b = 2;\ndouble d1 = a / b;\ndouble d2 = (double) a / b;\ndouble d3 = (double) (a / b);\nSystem.out.println(d1 + \" \" + d2 + \" \" + d3);",
      "options": [
        "3.0 3.5 3.0",
        "3.5 3.5 3.5",
        "3.0 3.5 3.5",
        "3 3.5 3"
      ],
      "answer": 0,
      "explanation": "d1: 7 / 2 ist Ganzzahldivision = 3, dann implizit zu 3.0. d2: Cast bindet stärker als / → 7.0 / 2 = 3.5. d3: erst (7 / 2) = 3, dann Cast → 3.0. double-Werte werden mit Nachkommastelle ausgegeben, daher nicht \"3\".",
      "source": {
        "title": "VFH VAR – Type Casting",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VAR-VariablenUndPrimitiveDatentypen.pdf",
        "page": 33
      }
    },
    {
      "id": "q-gp1-concat",
      "chapterId": "gp1-operators",
      "examStyle": "Code-Tracing",
      "question": "Welche Ausgabe erzeugt die Zeile?",
      "code": "System.out.println(1 + 2 + \"3\" + 4 + 5);",
      "options": [
        "3345",
        "12345",
        "15",
        "339"
      ],
      "answer": 0,
      "explanation": "+ wird von links nach rechts ausgewertet: 1 + 2 = 3 (int), 3 + \"3\" = \"33\" (String), \"33\" + 4 = \"334\", + 5 = \"3345\". Ab dem ersten String wird nur noch verkettet, daher nicht \"339\".",
      "source": {
        "title": "Folien 05 sonstige Operatoren",
        "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
        "page": 25
      }
    },
    {
      "id": "q-gp1-char-cast",
      "chapterId": "gp1-operators",
      "examStyle": "Code-Tracing (Folienbeispiel)",
      "question": "Was gibt das Folienbeispiel zur Typanpassung aus?",
      "code": "int charValue = 'e';          // implicit cast\nchar nextChar;\n\ncharValue = charValue + 1;\nnextChar = (char) charValue;  // explicit cast\n\nSystem.out.println(charValue + \" \" + nextChar);",
      "options": [
        "e f",
        "102 f",
        "101 f",
        "102 e"
      ],
      "answer": 1,
      "explanation": "'e' hat den Unicode-Wert 101 → implizit int. +1 → 102. (char) 102 = 'f'. Die int-Variable wird als Zahl ausgegeben → \"102 f\" (laut Folie: charValue: 102, nextChar: f).",
      "source": {
        "title": "Folien 05 Typanpassungen – Beispiel",
        "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
        "page": 13
      }
    },
    {
      "id": "q-gp1-shortcircuit",
      "chapterId": "gp1-operators",
      "examStyle": "Code-Tracing",
      "question": "Welche Ausgabe erfolgt?",
      "code": "int x = 0;\nboolean b = (x == 0) || (++x > 0);\nboolean c = (x == 0) | (++x > 0);\nSystem.out.println(b + \" \" + c + \" \" + x);",
      "options": [
        "true true 2",
        "true true 0",
        "true true 1",
        "false true 1"
      ],
      "answer": 2,
      "explanation": "Bei || ist die linke Seite true → rechte Seite (++x) wird NICHT ausgewertet, x bleibt 0. Bei | werden immer beide Seiten ausgewertet: links true, rechts ++x → x = 1. Ergebnis \"true true 1\".",
      "source": {
        "title": "Folien 05 logische Operatoren",
        "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
        "page": 22
      }
    },
    {
      "id": "q-gp1-ternary",
      "chapterId": "gp1-operators",
      "examStyle": "Code-Tracing",
      "question": "Was wird ausgegeben?",
      "code": "int a = 4;\nint b = 9;\nint min = (a < b) ? a : b;\nString s = (b % 2 == 0) ? \"gerade\" : \"ungerade\";\nSystem.out.println(min + s);",
      "options": [
        "4gerade",
        "9ungerade",
        "13ungerade",
        "4ungerade"
      ],
      "answer": 3,
      "explanation": "4 < 9 → min = 4. 9 % 2 = 1 ≠ 0 → \"ungerade\". int + String = Verkettung → \"4ungerade\". Falle: geprüft wird b, nicht a.",
      "source": {
        "title": "Folien 10 Bedingungsoperator",
        "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
        "page": 30
      }
    },
    {
      "id": "q-gp1-compound",
      "chapterId": "gp1-operators",
      "examStyle": "Code-Tracing (schwer)",
      "question": "Welchen Wert hat x am Ende?",
      "code": "int x = 10;\nx += x++ + ++x;\nSystem.out.println(x);",
      "options": [
        "32",
        "33",
        "22",
        "34"
      ],
      "answer": 0,
      "explanation": "x += E ist x = x + E, wobei das linke x (10) ZUERST gelesen wird. E: x++ liefert 10 (x = 11), ++x liefert 12 → E = 22. x = 10 + 22 = 32. Die Zwischenwerte von x werden durch die Zuweisung überschrieben.",
      "source": {
        "title": "Folien 05 Zuweisungsoperatoren",
        "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
        "page": 24
      }
    },
    {
      "id": "q-gp1-i-eq-ipp",
      "chapterId": "gp1-operators",
      "examStyle": "Code-Tracing",
      "question": "Welche Ausgabe erzeugt dieser (schlechte) Code?",
      "code": "int i = 5;\ni = i++;\nSystem.out.println(i);",
      "options": [
        "6",
        "5",
        "Compile-Fehler",
        "0"
      ],
      "answer": 1,
      "explanation": "i++ liefert den alten Wert 5 und erhöht i auf 6 – danach weist `i =` den gelieferten Wert 5 zu und überschreibt die 6. Ausgabe 5. Merke: x++ als Teil eines Ausdrucks liefert den alten Wert.",
      "source": {
        "title": "Folien 05 arithmetische Operatoren",
        "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
        "page": 20
      }
    },
    {
      "id": "q-gp1-mod",
      "chapterId": "gp1-operators",
      "examStyle": "Code-Tracing",
      "question": "Was gibt `System.out.println(17 % 5 + 17 / 5);` aus?",
      "options": [
        "3",
        "6.4",
        "5",
        "2"
      ],
      "answer": 2,
      "explanation": "17 % 5 = 2 (Rest), 17 / 5 = 3 (Ganzzahldivision) → 2 + 3 = 5. 6.4 wäre 17 / 5 als Gleitkommadivision + 3 – mit int-Operanden entsteht aber nie eine Kommazahl.",
      "source": {
        "title": "VFH VAR – Arithmetische Operatoren",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VAR-VariablenUndPrimitiveDatentypen.pdf",
        "page": 15
      }
    },
    {
      "id": "q-gp1-loop-analyse",
      "chapterId": "gp1-loops",
      "examStyle": "Probeklausur 6.a (4 Pkt)",
      "question": "Was berechnet und gibt diese Methode `doIt(int x)` aus?",
      "code": "static void doIt(int x) {\n    int j = 1;\n\n    for (int i=0; i<=x; j=j*2)\n        System.out.println(i++ + \" : \" + j);\n}",
      "options": [
        "Die Quadratzahlen 0² bis x²",
        "Eine Endlosschleife, weil i nicht im for-Kopf erhöht wird",
        "Die Fakultät von x",
        "Die Zweierpotenzen 2⁰ bis 2ˣ (jeweils als \"Exponent : Wert\")"
      ],
      "answer": 3,
      "explanation": "i läuft von 0 bis x (erhöht durch i++ im println), j verdoppelt sich im Update-Teil (1, 2, 4, 8, … = 2^i). Ausgegeben werden alle Zweierpotenzen 2⁰ bis 2ˣ. Keine Endlosschleife: i++ im Rumpf ändert die Bedingungsvariable.",
      "source": {
        "title": "Probeklausur Aufgabe 6.a",
        "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
        "page": 7
      }
    },
    {
      "id": "q-gp1-doit-trace",
      "chapterId": "gp1-loops",
      "examStyle": "Code-Tracing (zu 6.a)",
      "question": "Wie viele Zeilen gibt `doIt(3)` aus und wie lautet die letzte?",
      "code": "static void doIt(int x) {\n    int j = 1;\n    for (int i = 0; i <= x; j = j * 2)\n        System.out.println(i++ + \" : \" + j);\n}",
      "options": [
        "4 Zeilen, letzte: 3 : 8",
        "3 Zeilen, letzte: 2 : 4",
        "4 Zeilen, letzte: 4 : 8",
        "4 Zeilen, letzte: 3 : 16"
      ],
      "answer": 0,
      "explanation": "Ausgabe (mit java geprüft): 0 : 1, 1 : 2, 2 : 4, 3 : 8 → 4 Zeilen. i++ gibt erst den alten Wert aus; j wird erst NACH der Ausgabe im Update verdoppelt.",
      "source": {
        "title": "Probeklausur Aufgabe 6.a",
        "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
        "page": 7
      }
    },
    {
      "id": "q-gp1-refactor-while",
      "chapterId": "gp1-loops",
      "examStyle": "Probeklausur 6.b (6 Pkt)",
      "question": "Welche while-Version verhält sich exakt wie doIt(x) (j = 1 vorher)?",
      "options": [
        "int i = 0; while (i <= x) { j = j * 2; System.out.println(i + \" : \" + j); i++; }",
        "int i = 0; while (i <= x) { System.out.println(i + \" : \" + j); i++; j = j * 2; }",
        "int i = 0; while (i < x) { System.out.println(i + \" : \" + j); i++; j = j * 2; }",
        "int i = 0; while (i <= x) { System.out.println(i++ + \" : \" + j); }"
      ],
      "answer": 1,
      "explanation": "for (Init; Bed; Update) Rumpf ≙ Init; while (Bed) { Rumpf; Update; }. Der Rumpf gibt aus und erhöht i (i++ im println), das Update verdoppelt j danach. B verdoppelt zu früh (erste Zeile 0 : 2), C hat einen Durchlauf zu wenig (< statt <=), D vergisst das Update j = j * 2.",
      "source": {
        "title": "VFH ITR – Äquivalenz zur while-Schleife",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ITR-Iterationen.pdf",
        "page": 29
      }
    },
    {
      "id": "q-gp1-while-sum",
      "chapterId": "gp1-loops",
      "examStyle": "Code-Tracing",
      "question": "Welche Ausgabe erfolgt?",
      "code": "int i = 0;\nint sum = 0;\nwhile (i < 5) {\n    sum += i;\n    i += 2;\n}\nSystem.out.println(i + \" \" + sum);",
      "options": [
        "4 6",
        "6 10",
        "6 6",
        "5 6"
      ],
      "answer": 2,
      "explanation": "Durchläufe: i = 0 (sum 0, i 2), i = 2 (sum 2, i 4), i = 4 (sum 6, i 6); Test 6 < 5 false. Ausgabe \"6 6\" – i steht nach der Schleife auf dem ersten Wert, der die Bedingung verletzt.",
      "source": {
        "title": "VFH ITR – Die kopfgesteuerte Schleife",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ITR-Iterationen.pdf",
        "page": 5
      }
    },
    {
      "id": "q-gp1-dowhile",
      "chapterId": "gp1-loops",
      "examStyle": "Code-Tracing",
      "question": "Was gibt der Code aus?",
      "code": "int n = 10;\ndo {\n    n++;\n} while (n < 5);\nSystem.out.println(n);",
      "options": [
        "10",
        "Endlosschleife",
        "5",
        "11"
      ],
      "answer": 3,
      "explanation": "do-while ist fußgesteuert: der Rumpf läuft mindestens einmal (n = 11), erst dann wird 11 < 5 geprüft (false). Eine while-Schleife mit gleicher Bedingung hätte 10 ausgegeben.",
      "source": {
        "title": "Folien 07 do-Anweisung",
        "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
        "page": 28
      }
    },
    {
      "id": "q-gp1-nested-break",
      "chapterId": "gp1-loops",
      "examStyle": "Code-Tracing",
      "question": "Welchen Wert hat count?",
      "code": "int count = 0;\nfor (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 3; j++) {\n        if (j == i) {\n            break;\n        }\n        count++;\n    }\n}\nSystem.out.println(count);",
      "options": [
        "3",
        "6",
        "0",
        "2"
      ],
      "answer": 0,
      "explanation": "break verlässt nur die INNERE Schleife. i = 1: j = 1 bricht sofort ab (0). i = 2: j = 1 zählt (1), j = 2 bricht. i = 3: j = 1, 2 zählen (3), j = 3 bricht. count = 3. \"0\" wäre richtig, wenn break beide Schleifen beenden würde.",
      "source": {
        "title": "Folien 07 break",
        "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
        "page": 37
      }
    },
    {
      "id": "q-gp1-continue",
      "chapterId": "gp1-loops",
      "examStyle": "Code-Tracing",
      "question": "Welche Ausgabe erzeugt die Schleife?",
      "code": "for (int i = 0; i < 6; i++) {\n    if (i % 2 == 0) {\n        continue;\n    }\n    System.out.print(i);\n}\nSystem.out.println();",
      "options": [
        "024",
        "135",
        "012345",
        "1357"
      ],
      "answer": 1,
      "explanation": "continue überspringt den Rest des Rumpfes für gerade i; bei der for-Schleife wird danach noch das Update i++ ausgeführt. Ausgegeben werden 1, 3, 5. i = 7 wird nie erreicht (i < 6).",
      "source": {
        "title": "Folien 07 continue",
        "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
        "page": 39
      }
    },
    {
      "id": "q-gp1-label-break",
      "chapterId": "gp1-loops",
      "examStyle": "Code-Tracing",
      "question": "Was gibt der Code mit Label aus?",
      "code": "outer:\nfor (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 3; j++) {\n        if (i * j == 4) {\n            break outer;\n        }\n        System.out.print(i * j + \" \");\n    }\n}\nSystem.out.println(\"|\");",
      "options": [
        "1 2 3 |",
        "1 2 3 2 6 |",
        "1 2 3 2 |",
        "1 2 3 2 6 3 6 9 |"
      ],
      "answer": 2,
      "explanation": "i = 1: 1 2 3. i = 2: j = 1 → 2; j = 2 → 2 * 2 = 4 → break outer verlässt BEIDE Schleifen. Danach \"|\". Ohne Label würde nur die innere Schleife abbrechen (→ \"1 2 3 2 3 6 9 |\").",
      "source": {
        "title": "Folien 07 break mit Label",
        "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
        "page": 38
      }
    },
    {
      "id": "q-gp1-for-step",
      "chapterId": "gp1-loops",
      "examStyle": "Code-Tracing",
      "question": "Welche Ausgabe erfolgt?",
      "code": "for (int i = 10; i > 0; i -= 3) {\n    System.out.print(i);\n}\nSystem.out.println();",
      "options": [
        "1074",
        "1074-2",
        "107410",
        "10741"
      ],
      "answer": 3,
      "explanation": "i: 10, 7, 4, 1 werden ausgegeben (alle > 0); danach i = -2 → Bedingung false. Ausgabe \"10741\" (print ohne Leerzeichen).",
      "source": {
        "title": "Folien 07 for-Anweisung",
        "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
        "page": 31
      }
    },
    {
      "id": "q-gp1-factorial",
      "chapterId": "gp1-loops",
      "examStyle": "Code lesen (wie 6.a)",
      "question": "Was berechnet dieser Code (Ausgabe)?",
      "code": "int i = 1;\nint p = 1;\nwhile (i <= 4) {\n    p *= i;\n    i++;\n}\nSystem.out.println(p);",
      "options": [
        "Die Fakultät 4! = 24",
        "Die Summe 1 + 2 + 3 + 4 = 10",
        "Die Zweierpotenz 2⁴ = 16",
        "Die Fakultät 5! = 120"
      ],
      "answer": 0,
      "explanation": "p wird nacheinander mit 1, 2, 3, 4 multipliziert → 1 · 2 · 3 · 4 = 24 = 4!. Für eine Summe stünde += statt *=; 5! bräuchte i <= 5.",
      "source": {
        "title": "VFH ITR – Zusammenfassung (kombinierte Operatoren)",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ITR-Iterationen.pdf",
        "page": 41
      }
    },
    {
      "id": "q-gp1-digitsum",
      "chapterId": "gp1-loops",
      "examStyle": "Code lesen (Demo 1)",
      "question": "Die Methoden stammen aus Demo 1 (DigitSum). Was gibt `sumDigits(4711) + \" \" + convertToBase(6, 2)` aus?",
      "code": "private static int sumDigits(int number) {\n    int sum = 0;\n    while (number > 0) {\n        sum += number % 10;\n        number /= 10;\n    }\n    return sum;\n}\n\nprivate static String convertToBase(int number, int base) {\n    String digits = \"0123456789ABCDEF\";\n    String str = \"\";\n    while (number > 0) {\n        str = digits.charAt(number % base) + str;\n        number /= base;\n    }\n    return str.equals(\"\") ? \"0\" : str;\n}",
      "options": [
        "13 011",
        "13 110",
        "4711 110",
        "16 110"
      ],
      "answer": 1,
      "explanation": "Quersumme: 1 + 1 + 7 + 4 = 13 (number % 10 holt die letzte Ziffer, number /= 10 entfernt sie). Basis 2: 6 % 2 = 0, 3 % 2 = 1, 1 % 2 = 1; jede neue Ziffer wird VORNE angehängt → \"110\". \"011\" wäre die falsche Reihenfolge.",
      "source": {
        "title": "Folien 07 Kontrollfluss (while)",
        "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
        "page": 25
      }
    },
    {
      "id": "q-gp1-loop-min-once",
      "chapterId": "gp1-loops",
      "examStyle": "Verständnis",
      "question": "Welche Aussage zu Schleifen ist korrekt?",
      "options": [
        "Eine while-Schleife wird mindestens einmal durchlaufen.",
        "Eine for-Schleife ist nachprüfend.",
        "Eine do-while-Schleife prüft ihre Bedingung erst nach dem Rumpf und läuft daher mindestens einmal.",
        "Eine im for-Kopf deklarierte Laufvariable ist auch nach der Schleife noch gültig."
      ],
      "answer": 2,
      "explanation": "do-while ist fußgesteuert (≥ 1 Durchlauf). while und for sind kopfgesteuert/vorprüfend (evtl. 0 Durchläufe). Eine im for-Kopf deklarierte Variable existiert nur innerhalb der Schleife (Probeklausur 4.a!).",
      "source": {
        "title": "VFH ITR – Zusammenfassung",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ITR-Iterationen.pdf",
        "page": 41
      }
    },
    {
      "id": "q-gp1-bugs",
      "chapterId": "gp1-debug",
      "examStyle": "Probeklausur 4.a (8 Pkt)",
      "question": "Welche ZWEI Fehler stecken in diesem Programm (TestBed)?",
      "code": "for (int j = 2; j < 5; ++j) {\n    if (j = 3) {\n        j++;\n    } else {\n        --j;\n        break;\n    }\n}\nSystem.out.println(j);",
      "options": [
        "++j statt j++ im for-Kopf UND break im else-Zweig",
        "int j darf nicht bei 2 starten UND println braucht einen String",
        "Endlosschleife durch `--j` UND fehlendes return",
        "Zuweisung `j = 3` statt Vergleich `j == 3` im if UND `j` ist außerhalb der for-Schleife nicht sichtbar (Scope)"
      ],
      "answer": 3,
      "explanation": "javac meldet genau zwei Fehler: (1) `if (j = 3)` – \"int cannot be converted to boolean\" → `j == 3`. (2) `System.out.println(j)` – \"cannot find symbol\", da j nur im for-Block existiert → j vor der Schleife deklarieren. ++j, break und println(int) sind erlaubt.",
      "source": {
        "title": "Probeklausur Aufgabe 4.a",
        "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
        "page": 5
      }
    },
    {
      "id": "q-gp1-empty-stmt",
      "chapterId": "gp1-debug",
      "examStyle": "Code-Tracing / Logikfehler",
      "question": "Was gibt der Code aus?",
      "code": "int x = 3;\nif (x > 5); {\n    x = 0;\n}\nSystem.out.println(x);",
      "options": [
        "0",
        "3",
        "Compile-Fehler wegen des Semikolons",
        "5"
      ],
      "answer": 0,
      "explanation": "Das ; nach if (x > 5) ist eine leere Anweisung = kompletter if-Rumpf. Der Block { x = 0; } ist eine eigenständige Anweisung und läuft immer → 0. Der Code kompiliert (Logikfehler!).",
      "source": {
        "title": "Folien 07 leere Anweisung",
        "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
        "page": 5
      }
    },
    {
      "id": "q-gp1-err-float",
      "chapterId": "gp1-debug",
      "examStyle": "Fehler finden",
      "question": "Welche Zeile führt zu einem Compile-Fehler?",
      "options": [
        "long l = 5;",
        "float f = 3.14;",
        "double d = 5;",
        "int k = 'a';"
      ],
      "answer": 1,
      "explanation": "3.14 ist ein double-Literal; double → float ist eine Typeinengung (\"possible lossy conversion from double to float\") → 3.14f. Die anderen sind implizite Typerweiterungen (int → long, int → double, char → int).",
      "source": {
        "title": "Folien 04 Literale (Gleitkommazahlen)",
        "path": "moodle-data/gdp1/files/04. Daten und Datentypen/GP1_26WS_04_Datentypen.pdf",
        "page": 19
      }
    },
    {
      "id": "q-gp1-err-byte",
      "chapterId": "gp1-debug",
      "examStyle": "Fehler finden",
      "question": "Warum kompiliert dieser Code nicht?",
      "code": "byte c = 13;\nbyte cb = c + 2;",
      "options": [
        "13 liegt nicht im Wertebereich von byte",
        "byte-Variablen dürfen nicht addiert werden",
        "c + 2 hat den Typ int; int → byte muss explizit gecastet werden: (byte) (c + 2)",
        "Es fehlt ein L hinter der 2"
      ],
      "answer": 2,
      "explanation": "Arithmetik mit byte wird in int gerechnet; die Zuweisung an byte wäre eine Typeinengung (\"possible lossy conversion from int to byte\"). Korrektur mit Cast inkl. Klammern um die Summe. 13 passt problemlos in byte (−128 … 127).",
      "source": {
        "title": "VFH VAR – Type Casting",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VAR-VariablenUndPrimitiveDatentypen.pdf",
        "page": 35
      }
    },
    {
      "id": "q-gp1-err-static",
      "chapterId": "gp1-debug",
      "examStyle": "Fehler finden",
      "question": "Welcher Fehler steckt in dieser Klasse?",
      "code": "public class Counter {\n    private int count;\n\n    public static void main(String[] args) {\n        count++;\n        System.out.println(count);\n    }\n}",
      "options": [
        "count ist private und darf in main nicht benutzt werden",
        "println kann keinen int ausgeben",
        "count wurde nicht initialisiert",
        "count ist eine Instanzvariable – aus der statischen Methode main gibt es kein Objekt (kein this), auf das sie sich beziehen könnte"
      ],
      "answer": 3,
      "explanation": "javac: \"non-static variable count cannot be referenced from a static context\". Lösung: Objekt erzeugen (new Counter()) und über das Objekt zugreifen. private ist innerhalb derselben Klasse erlaubt; Instanzvariablen haben den Standardwert 0.",
      "source": {
        "title": "VFH OBJ – Statische und nicht statische Mitglieder",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_OBJ-Objekte.pdf",
        "page": 26
      }
    },
    {
      "id": "q-gp1-err-uninit",
      "chapterId": "gp1-debug",
      "examStyle": "Fehler finden",
      "question": "Was meldet der Compiler bei diesem Methodenrumpf?",
      "code": "int summe;\nfor (int i = 1; i <= 3; i++) {\n    summe += i;\n}\nSystem.out.println(summe);",
      "options": [
        "variable summe might not have been initialized",
        "Nichts, summe startet mit 0",
        "cannot find symbol i",
        "missing return statement"
      ],
      "answer": 0,
      "explanation": "summe ist eine LOKALE Variable – sie hat keinen Standardwert. summe += i liest sie vor der ersten Zuweisung → Compile-Fehler. Korrektur: int summe = 0;. Nur Instanzvariablen starten automatisch mit 0.",
      "source": {
        "title": "VFH KLA – Zusammenfassung",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_KLA-EigeneKlassenProgrammieren.pdf",
        "page": 62
      }
    },
    {
      "id": "q-gp1-err-scope",
      "chapterId": "gp1-debug",
      "examStyle": "Fehler finden (Folienbeispiel)",
      "question": "Welche Zeile erzeugt einen Fehler?",
      "code": "public static void main(String[] args) {\n    int x;\n    x = 5;\n    {\n        int y = 4;\n        x = x * y;\n    }\n    System.out.println(\"x: \" + x);\n    System.out.println(\"y: \" + y);\n}",
      "options": [
        "int x; – Deklaration ohne Initialisierung ist verboten",
        "System.out.println(\"y: \" + y); – y ist außerhalb seines Blocks nicht sichtbar",
        "x = x * y; – y ist im Block nicht sichtbar",
        "Es gibt keinen Fehler, Ausgabe x: 20 und y: 4"
      ],
      "answer": 1,
      "explanation": "y wurde im inneren Block deklariert und existiert nur bis zu dessen }. Danach → \"cannot find symbol\". x ist vor der Benutzung zugewiesen (x = 5), das ist erlaubt.",
      "source": {
        "title": "Folien 05 Gültigkeitsbereich (scope)",
        "path": "moodle-data/gdp1/files/05. Variablen und Ausdrücke/GP1_26WS_05_Variablen.pdf",
        "page": 6
      }
    },
    {
      "id": "q-gp1-setter-shadow",
      "chapterId": "gp1-debug",
      "examStyle": "Fehler finden / Logikfehler",
      "question": "Was gibt `p.setName(\"Ada\"); System.out.println(p.getName());` aus?",
      "code": "class Person {\n    private String name;\n\n    public void setName(String name) {\n        name = name;\n    }\n\n    public String getName() {\n        return name;\n    }\n}",
      "options": [
        "Ada",
        "Compile-Fehler: doppelter Name",
        "null",
        "Leerer String \"\""
      ],
      "answer": 2,
      "explanation": "Im Setter verdeckt der Parameter name das Attribut; `name = name;` weist den Parameter sich selbst zu. Das Attribut behält seinen Standardwert null. Korrektur: this.name = name;",
      "source": {
        "title": "Folien 09 this",
        "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
        "page": 20
      }
    },
    {
      "id": "q-gp1-aioobe",
      "chapterId": "gp1-debug",
      "examStyle": "Laufzeitfehler finden",
      "question": "Was passiert beim Ausführen?",
      "code": "int[] a = {4, 8, 15};\nint sum = 0;\nfor (int i = 0; i <= a.length; i++) {\n    sum += a[i];\n}\nSystem.out.println(sum);",
      "options": [
        "Ausgabe 27",
        "Ausgabe 23",
        "Compile-Fehler: a.length braucht Klammern",
        "ArrayIndexOutOfBoundsException (Index 3 bei Länge 3)"
      ],
      "answer": 3,
      "explanation": "Off-by-one: <= a.length lässt i bis 3 laufen, gültig sind nur 0…2 → ArrayIndexOutOfBoundsException zur Laufzeit (kompiliert aber). Richtig: i < a.length. length ist bei Arrays ein Attribut ohne Klammern.",
      "source": {
        "title": "VFH ARR – Zusammenfassung",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ARR-Arrays.pdf",
        "page": 58
      }
    },
    {
      "id": "q-gp1-err-missing-return",
      "chapterId": "gp1-debug",
      "examStyle": "Fehler finden",
      "question": "Was ist an dieser Methode falsch?",
      "code": "public static int sign(int x) {\n    if (x > 0) {\n        return 1;\n    } else if (x < 0) {\n        return -1;\n    }\n}",
      "options": [
        "Für x == 0 gibt es keinen return → \"missing return statement\"",
        "else if ist in Java nicht erlaubt",
        "return -1 passt nicht zum Rückgabetyp int",
        "static-Methoden dürfen nichts zurückgeben"
      ],
      "answer": 0,
      "explanation": "Jeder mögliche Ausführungsweg einer nicht-void-Methode muss mit return enden. Für x == 0 fehlt er → Compile-Fehler. Lösung: am Ende return 0; ergänzen.",
      "source": {
        "title": "Folien 09 Rückgabetyp",
        "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
        "page": 12
      }
    },
    {
      "id": "q-gp1-err-dowhile",
      "chapterId": "gp1-debug",
      "examStyle": "Fehler finden",
      "question": "Warum kompiliert der Code nicht?",
      "code": "int i = 0;\ndo {\n    i++;\n} while (i < 3)\nSystem.out.println(i);",
      "options": [
        "do-Schleifen brauchen eine Zählvariable im Kopf",
        "Nach while (i < 3) fehlt das Semikolon",
        "i++ ist im do-Block nicht erlaubt",
        "Die Bedingung muss vor dem Rumpf stehen"
      ],
      "answer": 1,
      "explanation": "Die do-Anweisung endet mit `while (Bedingung);` – das Semikolon ist Pflicht (Folie: „Semikolon nicht vergessen!“). javac: \"';' expected\".",
      "source": {
        "title": "Folien 07 do-Anweisung",
        "path": "moodle-data/gdp1/files/07. Kontrollfluss/GP1_26WS_07_Kontrollfluss.pdf",
        "page": 28
      }
    },
    {
      "id": "q-gp1-javadoc-tags",
      "chapterId": "gp1-javadoc",
      "examStyle": "Probeklausur 6.c (4 Pkt)",
      "question": "Welcher JavaDoc-Kommentar dokumentiert `public static void printPowersOfTwo(int maxExponent)` korrekt?",
      "options": [
        "/** Prints the powers of two.\n * @return the powers of two */",
        "// Prints the powers of two. @param maxExponent the largest exponent",
        "/** Prints the powers of two up to 2^maxExponent.\n * @param maxExponent the largest exponent */",
        "/* Prints the powers of two.\n * @param int the largest exponent */"
      ],
      "answer": 2,
      "explanation": "JavaDoc beginnt mit /**, der erste Satz endet mit Punkt, je Parameter @param + NAME (nicht Typ) + Beschreibung. @return ist bei void falsch; // und /* */ werden von javadoc nicht ausgewertet.",
      "source": {
        "title": "Folien 03 markierte Absätze (Tags)",
        "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
        "page": 23
      }
    },
    {
      "id": "q-gp1-javadoc-cmd",
      "chapterId": "gp1-javadoc",
      "examStyle": "Verständnis",
      "question": "Was bewirkt die Option `-d doc` in `javadoc -d doc -private -author -version *.java`?",
      "options": [
        "Nur Elemente mit @deprecated werden dokumentiert",
        "Nur die Datei doc.java wird dokumentiert",
        "Es wird eine Debug-Ausgabe erzeugt",
        "Die erzeugte HTML-Dokumentation wird im Verzeichnis doc abgelegt"
      ],
      "answer": 3,
      "explanation": "-d directory legt das Zielverzeichnis der generierten Dateien fest (sonst aktuelles Verzeichnis). -private dokumentiert alle Elemente, -author/-version zeigen die entsprechenden Tags.",
      "source": {
        "title": "Folien 03 JavaDoc – Optionen",
        "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
        "page": 30
      }
    },
    {
      "id": "q-gp1-naming",
      "chapterId": "gp1-javadoc",
      "examStyle": "Verständnis (Code Conventions)",
      "question": "Welche Namenswahl entspricht den Konventionen aus der Vorlesung?",
      "options": [
        "Klasse Shape, Methode calculateArea(), Konstante MAX_SIZE, Variable sideLength",
        "Klasse shape, Methode Area(), Konstante maxSize",
        "Klasse Shapes, Methode area_berechnen(), Konstante Max_Size",
        "Klasse SHAPE, Methode CalculateArea(), Variable SideLength"
      ],
      "answer": 0,
      "explanation": "Klassen: Nomen im Singular, groß. Methoden: Verb + Rest in camelCase, klein. Konstanten: GROSSBUCHSTABEN mit _. Variablen: klein, camelCase. Deutsch/Englisch nicht mischen (area_berechnen) und keine Pluralklassen.",
      "source": {
        "title": "Folien 04 Bezeichner: Konventionen",
        "path": "moodle-data/gdp1/files/04. Daten und Datentypen/GP1_26WS_04_Datentypen.pdf",
        "page": 9
      }
    },
    {
      "id": "q-gp1-comment-kinds",
      "chapterId": "gp1-javadoc",
      "examStyle": "Verständnis",
      "question": "Welche Kommentarart wird vom Werkzeug javadoc in die HTML-Dokumentation übernommen?",
      "options": [
        "// Zeilenkommentar",
        "/** Dokumentationskommentar */ direkt vor Klasse, Konstruktor, Methode oder Attribut",
        "/* Blockkommentar */",
        "Jeder Kommentar, egal wo er steht"
      ],
      "answer": 1,
      "explanation": "Nur /** … */ unmittelbar vor einer Deklaration wird ausgewertet. Zeilen- und Blockkommentare (z. B. der Datei-Header) sind für Leser des Quelltexts.",
      "source": {
        "title": "Folien 03 Kommentare",
        "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
        "page": 14
      }
    },
    {
      "id": "q-gp1-ctor-facts",
      "chapterId": "gp1-classes",
      "examStyle": "Verständnis",
      "question": "Welche Aussage über Konstruktoren ist FALSCH?",
      "options": [
        "Ein Konstruktor trägt den Namen der Klasse.",
        "Ohne eigenen Konstruktor erzeugt der Compiler einen parameterlosen Standardkonstruktor.",
        "Ein Konstruktor hat den Rückgabetyp void.",
        "Mit this(…) kann ein Konstruktor einen anderen Konstruktor derselben Klasse aufrufen."
      ],
      "answer": 2,
      "explanation": "Konstruktoren haben KEINEN Rückgabetyp – auch nicht void. `public void Car()` wäre eine normale Methode namens Car, kein Konstruktor. Die übrigen Aussagen stehen so in den Folien 09.",
      "source": {
        "title": "Folien 09 Konstruktor",
        "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
        "page": 23
      }
    },
    {
      "id": "q-gp1-default-ctor",
      "chapterId": "gp1-classes",
      "examStyle": "Fehler finden",
      "question": "Warum meldet der Compiler einen Fehler?",
      "code": "class Car {\n    private String description;\n\n    Car(String description) {\n        this.description = description;\n    }\n}\n\nCar c = new Car();",
      "options": [
        "description muss public sein",
        "new darf nur in main stehen",
        "Konstruktoren müssen public sein",
        "Da ein eigener Konstruktor existiert, gibt es keinen impliziten parameterlosen Standardkonstruktor mehr"
      ],
      "answer": 3,
      "explanation": "Der Standardkonstruktor wird nur erzeugt, wenn die Klasse gar keinen Konstruktor hat. Hier existiert nur Car(String) → \"constructor Car in class Car cannot be applied to given types\". Lösung: new Car(\"Volvo\") oder Car() selbst schreiben.",
      "source": {
        "title": "VFH KLA – Impliziter Defaultkonstruktor",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_KLA-EigeneKlassenProgrammieren.pdf",
        "page": 12
      }
    },
    {
      "id": "q-gp1-car-validation",
      "chapterId": "gp1-classes",
      "examStyle": "Code-Tracing",
      "question": "Car (immutable, aus der Vorlesung) prüft die Werte im Konstruktor. Ausgabe von `new Car(\"Oldie\", 1899, -5.0)`?",
      "code": "public Car(String description, int year, double price) {\n    this.description = description;\n    if (year > 1900) {\n        this.year = year;\n    }\n    if (price >= 0) {\n        this.price = price;\n    }\n}\n// …\nCar c = new Car(\"Oldie\", 1899, -5.0);\nSystem.out.println(c.description() + \" \" + c.year() + \" \" + c.price());",
      "options": [
        "Oldie 0 0.0",
        "Oldie 1899 -5.0",
        "Oldie 1900 0.0",
        "Exception wegen ungültiger Werte"
      ],
      "answer": 0,
      "explanation": "1899 > 1900 und -5.0 >= 0 sind false → year und price werden nicht gesetzt und behalten die Standardwerte 0 bzw. 0.0 der Instanzvariablen. Es wird keine Exception geworfen.",
      "source": {
        "title": "Folien 09 Beispiel Car (immutable)",
        "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
        "page": 29
      }
    },
    {
      "id": "q-gp1-equals-identity",
      "chapterId": "gp1-classes",
      "examStyle": "Code-Tracing",
      "question": "Car überschreibt equals NICHT. Ausgabe?",
      "code": "Car a = new Car(\"VW\", 2000, 1.0);\nCar b = new Car(\"VW\", 2000, 1.0);\nCar c = a;\nSystem.out.println((a == b) + \" \" + a.equals(b) + \" \" + (a == c));",
      "options": [
        "false true true",
        "false false true",
        "true true true",
        "false false false"
      ],
      "answer": 1,
      "explanation": "a und b sind zwei verschiedene Objekte → a == b false. Ohne Überschreiben erbt Car equals von Object, das wie == die Identität prüft → false. c = a kopiert die Referenz → a == c true.",
      "source": {
        "title": "Folien 10 Methoden der Klasse Object",
        "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
        "page": 10
      }
    },
    {
      "id": "q-gp1-encapsulation",
      "chapterId": "gp1-classes",
      "examStyle": "Probeklausur 9.a (6 Pkt)",
      "question": "Welche Antwort beschreibt Ziel UND Umsetzung der Datenkapselung am besten?",
      "options": [
        "Ziel: schnellere Programme; Umsetzung: alle Attribute static",
        "Ziel: Code-Wiederverwendung durch Vererbung; Umsetzung: extends",
        "Ziel: Interna abschirmen, nur definierte Zugänge zulassen (Daten bleiben gültig, Implementierung änderbar); Umsetzung: Attribute private, Zugriff über public Getter/Setter mit Prüfungen",
        "Ziel: Speicher sparen; Umsetzung: Attribute final"
      ],
      "answer": 2,
      "explanation": "Folien 08: „Interna nach außen abschirmen! nur definierte Zugänge zulassen – so kann man nachher die Interna sogar noch ändern“; modern: „Nur Methoden der Klasse können die Daten der Klasse ändern“. Vererbung, static oder final sind andere Konzepte.",
      "source": {
        "title": "Folien 08 Kapselung",
        "path": "moodle-data/gdp1/files/08. OOP_ Theorie/GP1_26WS_08_OOP_Theorie.pdf",
        "page": 14
      }
    },
    {
      "id": "q-gp1-private-access",
      "chapterId": "gp1-classes",
      "examStyle": "Fehler finden",
      "question": "`myCar.year = 1999;` in CarTester führt zu einem Compile-Fehler. Warum?",
      "code": "public class Car {\n    private int year;\n    public void setYear(int year) {\n        if (year > 1900) {\n            this.year = year;\n        }\n    }\n}",
      "options": [
        "year ist nicht initialisiert",
        "Attribute dürfen nie direkt zugewiesen werden, auch nicht in Car selbst",
        "1999 ist kein gültiger int-Wert",
        "year ist private und außerhalb von Car nicht zugreifbar – Zugriff über myCar.setYear(1999)"
      ],
      "answer": 3,
      "explanation": "\"year has private access in Car\" – genau das ist Datenkapselung: Änderungen nur über die öffentliche Methode setYear, die den Wert prüft. Innerhalb von Car ist der direkte Zugriff erlaubt.",
      "source": {
        "title": "Folien 09 Beispiel CarTester (Kapselung)",
        "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
        "page": 22
      }
    },
    {
      "id": "q-gp1-widget",
      "chapterId": "gp1-oop",
      "examStyle": "Probeklausur 7.a als Tracing",
      "question": "Was gibt der Code aus?",
      "code": "class Widget {\n    private static int indexCount;\n    private int widgetIndex;\n\n    Widget() {\n        indexCount++;\n        widgetIndex = indexCount;\n    }\n\n    int index() { return widgetIndex; }\n    static int count() { return indexCount; }\n}\n\nWidget a = new Widget();\nWidget b = new Widget();\nWidget c = new Widget();\nSystem.out.println(a.index() + \" \" + c.index() + \" \" + Widget.count());",
      "options": [
        "1 3 3",
        "1 1 1",
        "3 3 3",
        "1 3 1"
      ],
      "answer": 0,
      "explanation": "indexCount existiert nur EINMAL und wird von allen Konstruktoraufrufen hochgezählt (1, 2, 3). widgetIndex ist pro Objekt: a merkt sich 1, c merkt sich 3. Widget.count() liefert den gemeinsamen Zähler 3.",
      "source": {
        "title": "Probeklausur Aufgabe 7.a",
        "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
        "page": 8
      }
    },
    {
      "id": "q-gp1-pommes",
      "chapterId": "gp1-oop",
      "examStyle": "Probeklausur 7.b (6 Pkt)",
      "question": "Welcher Aufruf ist für die Klasse Pommes (mit `public static void mit()` und `public void ohne()`) korrekt?",
      "options": [
        "Pommes.ohne();",
        "Pommes.mit(); und new Pommes().ohne();",
        "mit() kann nur über ein Objekt aufgerufen werden: new Pommes().mit(); ist Pflicht",
        "ohne() darf nur aus anderen statischen Methoden aufgerufen werden"
      ],
      "answer": 1,
      "explanation": "Statische Methoden ruft man über den Klassennamen auf (Pommes.mit()). Instanzmethoden brauchen ein Objekt (new Pommes().ohne()). Pommes.ohne() ist ein Compile-Fehler (\"non-static method … cannot be referenced from a static context\").",
      "source": {
        "title": "Probeklausur Aufgabe 7.b",
        "path": "moodle-data/gdp1/files/GP1_Probeklausur.pdf",
        "page": 8
      }
    },
    {
      "id": "q-gp1-protected",
      "chapterId": "gp1-oop",
      "examStyle": "Probeklausur 1.a (Wissen)",
      "question": "Wo ist eine `protected` Methode sichtbar?",
      "options": [
        "Nur in der eigenen Klasse",
        "Nur in erbenden Klassen, nicht im Paket",
        "In allen Klassen des gleichen Pakets und in allen erbenden Klassen",
        "Überall im Programm"
      ],
      "answer": 2,
      "explanation": "protected = Paket + Unterklassen (auch in anderen Paketen). Nur eigene Klasse = private, überall = public, nur Paket = ohne Modifizierer (package-private).",
      "source": {
        "title": "Folien 03 Sichtbarkeit – Erklärung",
        "path": "moodle-data/gdp1/files/03. Erste Schritte/GP1_26WS_03_Erste_Schritte.pdf",
        "page": 45
      }
    },
    {
      "id": "q-gp1-final-method",
      "chapterId": "gp1-oop",
      "examStyle": "Probeklausur 1.a (Wissen)",
      "question": "Was bewirkt der Modifizierer `final` bei einer Methode?",
      "options": [
        "Die Methode kann nur einmal aufgerufen werden.",
        "Die Methode gehört zur Klasse statt zum Objekt.",
        "Die Methode hat keinen Rumpf.",
        "Die Methode darf in Unterklassen nicht überschrieben werden."
      ],
      "answer": 3,
      "explanation": "final Methode = nicht überschreibbar (javac: \"m() in G cannot override m() in F\"). Ohne Rumpf = abstract; gehört zur Klasse = static.",
      "source": {
        "title": "VFH VRB – Finale Klassen und Methoden",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
        "page": 42
      }
    },
    {
      "id": "q-gp1-static-not-const",
      "chapterId": "gp1-oop",
      "examStyle": "Verständnis (Klausurfalle)",
      "question": "Welche Aussage zu `private static int indexCount;` ist richtig?",
      "options": [
        "Es gibt genau einen Speicherplatz für die ganze Klasse; alle Objekte sehen und ändern denselben Wert.",
        "Der Wert kann nach der ersten Zuweisung nicht mehr geändert werden.",
        "Jedes Objekt besitzt eine eigene Kopie von indexCount.",
        "indexCount existiert erst, nachdem das erste Objekt erzeugt wurde, und muss im Konstruktor initialisiert werden."
      ],
      "answer": 0,
      "explanation": "static = Klassenvariable: einmal pro Klasse, geteilt, existiert unabhängig von Objekten (Standardwert 0). Unveränderlich wäre final – static und final sind unabhängig. Eine Kopie pro Objekt haben Instanzvariablen.",
      "source": {
        "title": "VFH KLA – Statische Methoden und statische Attribute",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_KLA-EigeneKlassenProgrammieren.pdf",
        "page": 29
      }
    },
    {
      "id": "q-gp1-abstract-modifier",
      "chapterId": "gp1-oop",
      "examStyle": "Probeklausur 1.a (Wissen)",
      "question": "Welche Aussage zu `abstract` ist korrekt?",
      "options": [
        "Eine abstrakte Methode darf in jeder Klasse stehen.",
        "Eine abstrakte Methode hat keinen Rumpf; die Klasse muss abstract sein, und konkrete Unterklassen müssen die Methode implementieren.",
        "Von einer abstrakten Klasse kann man mit new Objekte erzeugen, wenn sie einen Konstruktor hat.",
        "abstract-Methoden sind automatisch static."
      ],
      "answer": 1,
      "explanation": "Abstrakte Methoden nur in abstrakten Klassen (sonst \"… is not abstract and does not override abstract method …\"). Abstrakte Klassen haben zwar Konstruktoren (für super(…)), aber new ist verboten.",
      "source": {
        "title": "VFH VRB – Abstrakte Klassen und Methoden",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
        "page": 39
      }
    },
    {
      "id": "q-gp1-callbyvalue",
      "chapterId": "gp1-params",
      "examStyle": "Code-Tracing (Folien 10)",
      "question": "WrappedInt kapselt einen int (set/get, toString liefert den Wert). Ausgabe?",
      "code": "static void change(WrappedInt y)  { y.set(7); }\nstatic void replace(WrappedInt y) { y = new WrappedInt(7); }\nstatic void prim(int y)           { y = 7; }\n\nWrappedInt x = new WrappedInt(5);\nWrappedInt w = new WrappedInt(5);\nint p = 5;\nchange(x);\nreplace(w);\nprim(p);\nSystem.out.println(x + \" \" + w + \" \" + p);",
      "options": [
        "7 7 7",
        "5 5 5",
        "7 5 5",
        "7 7 5"
      ],
      "answer": 2,
      "explanation": "Java ist immer call by value. change: Kopie der Referenz zeigt auf dasselbe Objekt → Objekt wird 7. replace: nur die lokale Kopie zeigt auf ein neues Objekt → w bleibt 5. prim: Kopie des int → p bleibt 5. \"7 7 5\" wäre „call by reference“ – gibt es in Java nicht.",
      "source": {
        "title": "Folien 10 Parameterübergabe",
        "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
        "page": 40
      }
    },
    {
      "id": "q-gp1-overload",
      "chapterId": "gp1-params",
      "examStyle": "Code-Tracing",
      "question": "Welche Ausgabe erzeugen die überladenen Methoden?",
      "code": "static void m(int x)    { System.out.print(\"int \"); }\nstatic void m(double x) { System.out.print(\"double \"); }\n\nm(5);\nm(5.0);\nm('a');",
      "options": [
        "int double char ",
        "Compile-Fehler: m(char) existiert nicht",
        "int double double ",
        "int double int "
      ],
      "answer": 3,
      "explanation": "Der Compiler wählt die Methode anhand der Argumenttypen: 5 → int, 5.0 → double. Für 'a' gibt es kein m(char); char wird implizit zum nächstgrößeren passenden Typ int erweitert → \"int\".",
      "source": {
        "title": "VFH STA – Überladen von Methoden",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_STA-StatischeMethodenUndKonstanten.pdf",
        "page": 30
      }
    },
    {
      "id": "q-gp1-overload-illegal",
      "chapterId": "gp1-params",
      "examStyle": "Fehler finden",
      "question": "Warum dürfen diese beiden Methoden nicht in derselben Klasse stehen?",
      "code": "public int move(String msg, int value) { … }\npublic String move(String s, int x) { … }",
      "options": [
        "Parameternamen müssen sich unterscheiden",
        "Beide haben dieselbe Signatur move(String, int); der Rückgabetyp zählt nicht zur Signatur",
        "Methoden dürfen keinen String zurückgeben",
        "Überladene Methoden müssen static sein"
      ],
      "answer": 1,
      "explanation": "Signatur = Name + Reihenfolge der Parametertypen. Parameternamen und Rückgabetyp spielen keine Rolle → \"method move(String,int) is already defined\" (Folie „unerlaubtes Überladen“).",
      "source": {
        "title": "Folien 09 unerlaubtes Überladen",
        "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
        "page": 19
      }
    },
    {
      "id": "q-gp1-signature",
      "chapterId": "gp1-params",
      "examStyle": "Verständnis",
      "question": "Welches Methodenpaar ist eine gültige Überladung?",
      "options": [
        "void move(int x) und int move(int y)",
        "void move(String msg, int x) und void move(int x, String msg)",
        "void move(int a) und void move(int b)",
        "public void move() und private void move()"
      ],
      "answer": 1,
      "explanation": "move(String, int) und move(int, String) haben unterschiedliche Reihenfolgen der Parametertypen → verschiedene Signaturen. Bei den anderen Paaren ist die Signatur gleich (Rückgabetyp, Parametername und Modifizierer zählen nicht).",
      "source": {
        "title": "Folien 09 Signatur einer Methode",
        "path": "moodle-data/gdp1/files/09. OOP_ Basiskonzepte/GP1_26WS_09_OOP_Basiskonzepte.pdf",
        "page": 17
      }
    },
    {
      "id": "q-gp1-ctor-chain",
      "chapterId": "gp1-inheritance",
      "examStyle": "Code-Tracing",
      "question": "Was gibt `new C();` aus?",
      "code": "class A { A() { System.out.print(\"A\"); } }\nclass B extends A { B() { System.out.print(\"B\"); } }\nclass C extends B { C() { super(); System.out.print(\"C\"); } }",
      "options": [
        "ABC",
        "CBA",
        "C",
        "BC"
      ],
      "answer": 0,
      "explanation": "Konstruktorenverkettung: Jeder Konstruktor ruft zuerst (explizit oder implizit) super() auf. C → B → A → Object; die Rümpfe laufen dann von oben nach unten: A, B, C.",
      "source": {
        "title": "Folien 10 Konstruktoren und Vererbung",
        "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
        "page": 13
      }
    },
    {
      "id": "q-gp1-dynamic-binding",
      "chapterId": "gp1-inheritance",
      "examStyle": "Code-Tracing (Polymorphie)",
      "question": "Welche Ausgabe erfolgt?",
      "code": "class Tier {\n    String laut() { return \"...\"; }\n    String info() { return \"Ich sage \" + laut(); }\n}\nclass Hund extends Tier {\n    @Override\n    String laut() { return \"Wuff\"; }\n}\n\nTier t = new Hund();\nSystem.out.println(t.info());",
      "options": [
        "Ich sage ...",
        "Ich sage Wuff",
        "Compile-Fehler: info() fehlt in Hund",
        "Wuff"
      ],
      "answer": 1,
      "explanation": "info() wird von Tier geerbt. Darin ruft laut() die Methode des tatsächlichen Objekts (Hund) auf – dynamische Bindung, auch wenn der Aufruf in der Oberklasse steht. Der deklarierte Typ Tier ist nur für den Compiler relevant.",
      "source": {
        "title": "VFH VRB – Polymorphe Methoden",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
        "page": 27
      }
    },
    {
      "id": "q-gp1-van-price",
      "chapterId": "gp1-inheritance",
      "examStyle": "Code-Tracing (Car/Van aus Folien 10)",
      "question": "Van überschreibt price() mit `return super.price() / VAT_MULTIPLIER;` (1.19). Car setzt year nur bei year > 1900. Ausgabe?",
      "code": "Car c = new Van(\"Fiat Ducato\", 1899, 2380.0, 5.83);\nSystem.out.println(c.year() + \" \" + c.price());",
      "options": [
        "1899 2380.0",
        "0 2380.0",
        "0 2000.0",
        "1899 2000.0"
      ],
      "answer": 2,
      "explanation": "super(description, year, price) läuft durch den Car-Konstruktor: 1899 ist nicht > 1900 → year bleibt 0. c.price() ruft wegen Polymorphie Van.price(): 2380.0 / 1.19 = 2000.0 (mit java geprüft). Der deklarierte Typ Car ändert daran nichts.",
      "source": {
        "title": "Folien 10 Beispiel Van",
        "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
        "page": 8
      }
    },
    {
      "id": "q-gp1-abstract-new",
      "chapterId": "gp1-inheritance",
      "examStyle": "Fehler finden",
      "question": "Welche Zeile kompiliert NICHT (Shape ist abstrakt, Rectangle eine konkrete Unterklasse)?",
      "options": [
        "Shape s = new Rectangle(3, 4);",
        "Rectangle r = new Rectangle(1, 2);",
        "Shape[] shapes = new Shape[10];",
        "Shape s = new Shape();"
      ],
      "answer": 3,
      "explanation": "\"Shape is abstract; cannot be instantiated\". Variablen und Arrays vom abstrakten Typ sind erlaubt (das Array erzeugt nur Plätze für Referenzen, keine Shape-Objekte) – genau das ermöglicht Polymorphie.",
      "source": {
        "title": "VFH VRB – Abstrakte Klassen",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
        "page": 37
      }
    },
    {
      "id": "q-gp1-abstract-missing",
      "chapterId": "gp1-inheritance",
      "examStyle": "Probeklausur 8.a (Fehlerquelle)",
      "question": "Was passiert, wenn Rectangle extends Shape nur area() implementiert, circumference() aber vergisst?",
      "options": [
        "Compile-Fehler: Rectangle ist nicht abstract und überschreibt die abstrakte Methode circumference() nicht",
        "Nichts, circumference() wird von Shape geerbt",
        "Laufzeitfehler beim Aufruf von circumference()",
        "circumference() liefert automatisch 0.0"
      ],
      "answer": 0,
      "explanation": "Eine konkrete Unterklasse muss ALLE abstrakten Methoden implementieren, sonst muss sie selbst abstract sein. javac: \"Rectangle is not abstract and does not override abstract method circumference() in Shape\". Teuer in 8.a!",
      "source": {
        "title": "VFH VRB – Abstrakte Klassen und Methoden",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
        "page": 39
      }
    },
    {
      "id": "q-gp1-super-missing",
      "chapterId": "gp1-inheritance",
      "examStyle": "Fehler finden",
      "question": "Warum kompiliert Girokonto nicht?",
      "code": "class Konto {\n    private String inhaber;\n    Konto(String inhaber) { this.inhaber = inhaber; }\n}\n\nclass Girokonto extends Konto {\n    private double dispobetrag;\n    Girokonto(double dispobetrag) {\n        this.dispobetrag = dispobetrag;\n    }\n}",
      "options": [
        "dispobetrag muss protected sein",
        "Der Compiler fügt super(); ein, aber Konto hat keinen parameterlosen Konstruktor",
        "Konstruktoren der Unterklasse müssen denselben Parameter wie die Oberklasse haben",
        "Girokonto erbt den Konstruktor Konto(String) und braucht keinen eigenen"
      ],
      "answer": 1,
      "explanation": "Ohne expliziten super(…)-Aufruf ergänzt der Compiler super(); – Konto() existiert aber nicht (nur Konto(String)). Lösung: super(inhaber) als erste Anweisung. Konstruktoren werden nicht vererbt.",
      "source": {
        "title": "VFH VRB – Konstruktoren in erbenden Klassen",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
        "page": 17
      }
    },
    {
      "id": "q-gp1-classcast",
      "chapterId": "gp1-inheritance",
      "examStyle": "Code-Tracing (Laufzeitfehler)",
      "question": "Girokonto2 und Sparbuch2 erben beide von Konto2. Was passiert?",
      "code": "Konto2 k = new Sparbuch2();\nGirokonto2 g = (Girokonto2) k;\nSystem.out.println(\"ok\");",
      "options": [
        "Ausgabe ok",
        "Compile-Fehler: Cast zwischen Geschwisterklassen",
        "ClassCastException zur Laufzeit, da das Objekt ein Sparbuch2 ist",
        "g ist null, Ausgabe ok"
      ],
      "answer": 2,
      "explanation": "Der Compiler erlaubt den Cast, weil Girokonto2 eine Unterklasse des deklarierten Typs Konto2 ist. Zur Laufzeit ist das Objekt aber ein Sparbuch2 → ClassCastException. Abhilfe: vorher `if (k instanceof Girokonto2)` prüfen.",
      "source": {
        "title": "VFH VRB – Explizite Casts und instanceof",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
        "page": 35
      }
    },
    {
      "id": "q-gp1-konto-poly",
      "chapterId": "gp1-inheritance",
      "examStyle": "Code-Tracing (Polymorphie)",
      "question": "Konto ist abstrakt mit abstract boolean abheben(double). Girokonto erlaubt Abheben bis kontostand + dispobetrag, Sparbuch nur bis kontostand. Beide starten mit kontostand 0. Ausgabe?",
      "code": "Konto k = new Girokonto(\"Ada\", 100);   // dispobetrag 100\nSystem.out.println(k.abheben(80) + \" \" + k.getKontostand());\nKonto s = new Sparbuch(\"Bob\");\nSystem.out.println(s.abheben(150) + \" \" + s.getKontostand());",
      "options": [
        "Compile-Fehler: abheben ist abstract",
        "false 0.0 / false 0.0",
        "true -80.0 / true -150.0",
        "true -80.0 / false 0.0"
      ],
      "answer": 3,
      "explanation": "Polymorph wird jeweils die abheben-Version des Objekts ausgeführt: Girokonto: 0 + 100 >= 80 → true, Stand -80.0. Sparbuch: 0 >= 150 false → Stand bleibt 0.0. Der Aufruf über Konto ist erlaubt, weil Konto abheben (abstrakt) deklariert.",
      "source": {
        "title": "VFH VRB – Polymorphie und Zuweisungskompatibilität",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
        "page": 24
      }
    },
    {
      "id": "q-gp1-overload-override",
      "chapterId": "gp1-inheritance",
      "examStyle": "Verständnis (Präsenz)",
      "question": "Van definiert `public double price()` neu, das es auch in Car gibt. Wie heißt das?",
      "options": [
        "Überlagern/Überschreiben (overriding)",
        "Überladen (overloading)",
        "Kapselung",
        "Konstruktorverkettung"
      ],
      "answer": 0,
      "explanation": "Gleiche Signatur in der Unterklasse = Überlagern/Überschreiben (overriding). Überladen wäre gleicher Name mit ANDERER Signatur. Die Folie warnt ausdrücklich: „überlagern = overriding, überladen = overloading“.",
      "source": {
        "title": "Folien 10 Methoden: überlagern",
        "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
        "page": 11
      }
    },
    {
      "id": "q-gp1-final-class",
      "chapterId": "gp1-inheritance",
      "examStyle": "Fehler finden",
      "question": "Was passiert bei `public class Zeichen extends String { }`?",
      "options": [
        "Zeichen erbt alle String-Methoden",
        "Compile-Fehler: cannot inherit from final String",
        "Laufzeitfehler beim ersten Methodenaufruf",
        "Nur die nicht-finalen Methoden werden geerbt"
      ],
      "answer": 1,
      "explanation": "String ist eine final Klasse – von ihr kann keine Unterklasse gebildet werden (VFH VRB zeigt genau diese Fehlermeldung). Ebenso final: Integer, Double, Math, System.",
      "source": {
        "title": "VFH VRB – Finale Klassen und Methoden",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_VRB-Vererbung.pdf",
        "page": 41
      }
    },
    {
      "id": "q-gp1-stepwise",
      "chapterId": "gp1-theory",
      "examStyle": "Probeklausur 9.b (6 Pkt)",
      "question": "Welche Reihenfolge beschreibt die schrittweise Verfeinerung richtig?",
      "options": [
        "Sofort codieren → testen → bei Fehlern in Teilaufgaben zerlegen",
        "Elementare Schritte sammeln → zufällig gruppieren → Gesamtaufgabe benennen",
        "Gesamtaufgabe beschreiben → in Teilaufgaben zerlegen → Abhängigkeiten/Reihenfolge klären → Teilaufgaben weiter verfeinern bis zu elementaren Schritten → Wiederholungen zusammenfassen → zu Gesamtalgorithmus zusammensetzen",
        "Klassen definieren → Vererbungshierarchie bilden → Methoden schreiben"
      ],
      "answer": 2,
      "explanation": "VFH EIP 3.3: Über mehrere Verfeinerungsebenen wird die komplexe Aufgabe in weniger komplexe Teilaufgaben zerlegt; Abhängigkeiten beachten; wiederholte Schritte identifizieren; aus den Teilalgorithmen wird der komplette Algorithmus zusammengesetzt (top-down, nicht bottom-up).",
      "source": {
        "title": "VFH EIP – Methode der schrittweisen Verfeinerung",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EIP-Einfuehrung.pdf",
        "page": 38
      }
    },
    {
      "id": "q-gp1-coffee-order",
      "chapterId": "gp1-theory",
      "examStyle": "Verständnis (Beispiel Kaffeekochen)",
      "question": "Welche Abhängigkeit gilt im Verfeinerungsbeispiel „Kaffeekochen“?",
      "options": [
        "„Wasser eingießen“ muss zwingend vor „Kaffeepulver eingeben“ erfolgen",
        "Filter einlegen muss vor Pulver einfüllen erfolgen; Wasser und Pulver müssen beide vor dem Starten fertig sein",
        "Die Maschine wird zuerst gestartet, dann Wasser eingefüllt",
        "Es gibt keine Abhängigkeiten, alle Schritte sind beliebig vertauschbar"
      ],
      "answer": 1,
      "explanation": "Laut EIP ist die Reihenfolge von „Wasser eingießen“ und „Kaffeepulver eingeben“ egal, beide müssen aber vor dem Start abgeschlossen sein; innerhalb von „Pulver eingeben“ muss der Filter zuerst eingelegt werden.",
      "source": {
        "title": "VFH EIP – Der Algorithmus Kaffeekochen",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EIP-Einfuehrung.pdf",
        "page": 39
      }
    },
    {
      "id": "q-gp1-composition",
      "chapterId": "gp1-theory",
      "examStyle": "Verständnis (OOP-Theorie)",
      "question": "Lokomotive und Güterzug: Welche Beziehung liegt laut Vorlesung vor, und wie setzt man sie in Java um?",
      "options": [
        "is-a → class Lokomotive extends Gueterzug",
        "Verwendungsbeziehung → Lokomotive als Methodenparameter",
        "Aggregation (nicht-essentiell) → static-Variable",
        "Komposition (essentielles part-of) → Instanzvariable vom Typ Lokomotive in Gueterzug"
      ],
      "answer": 3,
      "explanation": "Eine Lokomotive ist ein essentieller Teil des Güterzugs → Komposition. Komposition und Aggregation werden in Java identisch über Instanzvariablen umgesetzt. Eine Lokomotive „ist kein“ Güterzug → keine Vererbung (LSP). Aggregation wäre z. B. PKW auf Fährschiff.",
      "source": {
        "title": "Folien 08 Komposition / Umsetzung in Java",
        "path": "moodle-data/gdp1/files/08. OOP_ Theorie/GP1_26WS_08_OOP_Theorie.pdf",
        "page": 26
      }
    },
    {
      "id": "q-gp1-assert",
      "chapterId": "gp1-theory",
      "examStyle": "Verständnis",
      "question": "`assert childCnt >= 0 : \"illegal number of children\";` – was gilt?",
      "options": [
        "Ist die Bedingung falsch, wird ein AssertionError ausgelöst – aber nur, wenn Assertions mit java -ea eingeschaltet sind",
        "Ist die Bedingung falsch, wird immer eine IllegalArgumentException geworfen",
        "assert ersetzt if und läuft immer",
        "Der Text hinter : ist ein Kommentar ohne Wirkung"
      ],
      "answer": 0,
      "explanation": "assert Expression1 : Expression2 → bei false AssertionError mit Expression2 als Meldung. Standardmäßig sind Assertions aus; einschalten mit java -ea MyClass (enable assertions).",
      "source": {
        "title": "Folien 08 Assertions in Java",
        "path": "moodle-data/gdp1/files/08. OOP_ Theorie/GP1_26WS_08_OOP_Theorie.pdf",
        "page": 34
      }
    },
    {
      "id": "q-gp1-isa-lsp",
      "chapterId": "gp1-theory",
      "examStyle": "Verständnis",
      "question": "Wann darf man laut Liskov Substitution Principle Vererbung einsetzen?",
      "options": [
        "Immer, wenn zwei Klassen gemeinsame Attribute haben",
        "Nur bei einer echten „is-a“-Beziehung – die Unterklasse muss überall einsetzbar sein, wo die Oberklasse erwartet wird",
        "Nur, wenn die Oberklasse abstrakt ist",
        "Wenn eine Klasse Teil einer anderen ist (part-of)"
      ],
      "answer": 1,
      "explanation": "LSP (Liskov & Wing 1993): Vererbung nur bei richtiger is-a-Beziehung. Gemeinsame Attribute allein oder part-of rechtfertigen keine Vererbung (part-of → Instanzvariable).",
      "source": {
        "title": "Folien 08 LSP",
        "path": "moodle-data/gdp1/files/08. OOP_ Theorie/GP1_26WS_08_OOP_Theorie.pdf",
        "page": 22
      }
    },
    {
      "id": "q-gp1-finally",
      "chapterId": "gp1-exceptions",
      "examStyle": "Code-Tracing",
      "question": "Welche Ausgabe erzeugt `System.out.println(\" \" + f(0));`?",
      "code": "static int f(int x) {\n    try {\n        System.out.print(\"T\");\n        int r = 10 / x;\n        System.out.print(\"R\");\n        return r;\n    } catch (ArithmeticException e) {\n        System.out.print(\"C\");\n        return -1;\n    } finally {\n        System.out.print(\"F\");\n    }\n}",
      "options": [
        "TC -1",
        "TRF 0",
        "TCF -1",
        "TF -1"
      ],
      "answer": 2,
      "explanation": "\"T\", dann 10 / 0 → ArithmeticException, \"R\" wird übersprungen; catch gibt \"C\" aus und will -1 zurückgeben – vorher läuft finally (\"F\"). Erst dann wird \" \" + (-1) ausgegeben. (Mit f(2) wäre es \"TRF 5\".)",
      "source": {
        "title": "VFH EXC – finally",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EXC-Ausnahmebehandlung.pdf",
        "page": 13
      }
    },
    {
      "id": "q-gp1-checked",
      "chapterId": "gp1-exceptions",
      "examStyle": "Fehler finden",
      "question": "Welche Methode kompiliert NICHT?",
      "options": [
        "static void a() { throw new IllegalArgumentException(\"x\"); }",
        "static void b() throws IOException { throw new IOException(\"x\"); }",
        "static void d() { try { throw new IOException(\"x\"); } catch (IOException e) { } }",
        "static void c() { throw new IOException(\"x\"); }"
      ],
      "answer": 3,
      "explanation": "IOException ist checked: sie muss gefangen (d) oder mit throws deklariert (b) werden – c macht beides nicht (\"unreported exception IOException; must be caught or declared to be thrown\"). IllegalArgumentException ist unchecked (a).",
      "source": {
        "title": "VFH EXC – checked und unchecked Exceptions",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EXC-Ausnahmebehandlung.pdf",
        "page": 9
      }
    },
    {
      "id": "q-gp1-catch-order",
      "chapterId": "gp1-exceptions",
      "examStyle": "Fehler finden",
      "question": "Warum meldet der Compiler einen Fehler?",
      "code": "try {\n    int x = 1 / 0;\n} catch (Exception e) {\n    System.out.println(\"allgemein\");\n} catch (ArithmeticException e) {\n    System.out.println(\"Division\");\n}",
      "options": [
        "ArithmeticException ist eine Unterklasse von Exception und wird daher bereits vom ersten catch gefangen – speziellste Exception muss zuerst stehen",
        "1 / 0 wird schon vom Compiler erkannt",
        "Es dürfen nicht zwei catch-Blöcke dieselbe Variable e verwenden",
        "Es fehlt ein finally-Block"
      ],
      "answer": 0,
      "explanation": "javac: \"exception ArithmeticException has already been caught\". Reihenfolge: speziellste Klasse zuerst, dann Oberklasse. Jeder catch-Block hat seinen eigenen Scope für e; finally ist optional.",
      "source": {
        "title": "VFH EXC – Mehrere Exceptiontypen behandeln",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EXC-Ausnahmebehandlung.pdf",
        "page": 31
      }
    },
    {
      "id": "q-gp1-throw-throws",
      "chapterId": "gp1-exceptions",
      "examStyle": "Verständnis",
      "question": "Welche Aussage zu throw und throws ist richtig?",
      "options": [
        "throws wirft eine Exception, throw kündigt sie im Methodenkopf an",
        "throw new X(…) wirft eine Exception; throws X im Methodenkopf kündigt an, dass die Methode X an den Aufrufer weitergeben kann",
        "Beide sind Synonyme",
        "throws ist nur bei unchecked Exceptions erlaubt"
      ],
      "answer": 1,
      "explanation": "VFH EXC „Achtung Stolperfalle!“: throws (mit s) kündigt im Methodenkopf an, throw (ohne s) wirft tatsächlich. throws ist bei checked Exceptions Pflicht, bei unchecked erlaubt.",
      "source": {
        "title": "VFH EXC – Selbst Exceptions auslösen",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EXC-Ausnahmebehandlung.pdf",
        "page": 14
      }
    },
    {
      "id": "q-gp1-unchecked-which",
      "chapterId": "gp1-exceptions",
      "examStyle": "Verständnis",
      "question": "Welche dieser Exceptions ist eine CHECKED Exception?",
      "options": [
        "NullPointerException",
        "FileNotFoundException",
        "ArrayIndexOutOfBoundsException",
        "ArithmeticException"
      ],
      "answer": 1,
      "explanation": "FileNotFoundException erbt von IOException → Exception (checked). Die anderen erben von RuntimeException und sind unchecked.",
      "source": {
        "title": "VFH EXC – Die Exception-Klassen",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EXC-Ausnahmebehandlung.pdf",
        "page": 34
      }
    },
    {
      "id": "q-gp1-string",
      "chapterId": "gp1-exc-arr-str",
      "examStyle": "Klausur-Klassiker",
      "question": "Was gibt der folgende Code aus?",
      "code": "String s1 = new String(\"Java\");\nString s2 = new String(\"Java\");\nSystem.out.println((s1 == s2) + \" \" + s1.equals(s2));",
      "options": [
        "true true",
        "true false",
        "false true",
        "false false"
      ],
      "answer": 2,
      "explanation": "`new String(...)` erzeugt zwei getrennte Objekte → `s1 == s2` ist false (verschiedene Referenzen); `s1.equals(s2)` vergleicht den Inhalt → true.",
      "source": {
        "title": "VFH ZKT – Vergleich von String-Variablen",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ZKT-Zeichenketten.pdf",
        "page": 13
      }
    },
    {
      "id": "q-gp1-literal-pool",
      "chapterId": "gp1-exc-arr-str",
      "examStyle": "Code-Tracing",
      "question": "Welche Ausgabe erfolgt?",
      "code": "String a = \"Java\";\nString b = \"Java\";\nString c = new String(\"Java\");\nSystem.out.println((a == b) + \" \" + (a == c) + \" \" + a.equals(c));",
      "options": [
        "false false true",
        "false false false",
        "true true true",
        "true false true"
      ],
      "answer": 3,
      "explanation": "Gleiche Literale fasst der Compiler zu EINEM Objekt zusammen → a == b true (VFH ZKT 2.3). new String erzeugt ein neues Objekt → a == c false. equals vergleicht den Inhalt → true. Fazit: Für Inhaltsvergleich immer equals.",
      "source": {
        "title": "VFH ZKT – Vergleich von String-Variablen",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ZKT-Zeichenketten.pdf",
        "page": 14
      }
    },
    {
      "id": "q-gp1-string-immutable",
      "chapterId": "gp1-exc-arr-str",
      "examStyle": "Code-Tracing",
      "question": "Was wird ausgegeben?",
      "code": "String s = \"hallo\";\ns.toUpperCase();\ns.concat(\" welt\");\nSystem.out.println(s);",
      "options": [
        "hallo",
        "HALLO welt",
        "HALLO",
        "hallo welt"
      ],
      "answer": 0,
      "explanation": "Strings sind immutable: toUpperCase() und concat() liefern NEUE Strings, die hier verworfen werden; s bleibt \"hallo\". Richtig wäre s = s.toUpperCase().concat(\" welt\");",
      "source": {
        "title": "VFH ZKT – Methoden der Klasse String",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ZKT-Zeichenketten.pdf",
        "page": 7
      }
    },
    {
      "id": "q-gp1-substring",
      "chapterId": "gp1-exc-arr-str",
      "examStyle": "Code-Tracing",
      "question": "Was gibt der Code aus?",
      "code": "String s = \"Programmierung\";\nSystem.out.println(s.substring(3, 7) + s.indexOf('r') + s.length());",
      "options": [
        "gramm114",
        "gram114",
        "gram213",
        "ogra114"
      ],
      "answer": 1,
      "explanation": "substring(3, 7) liefert die Indizes 3…6 (Ende exklusiv): \"gram\". indexOf('r') = 1 (erstes Vorkommen, Index ab 0). length() = 14. Verkettet: \"gram\" + 1 + 14 = \"gram114\".",
      "source": {
        "title": "VFH ZKT – Methoden der Klasse String",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ZKT-Zeichenketten.pdf",
        "page": 6
      }
    },
    {
      "id": "q-gp1-array-index",
      "chapterId": "gp1-exc-arr-str",
      "examStyle": "Code-Tracing",
      "question": "Welche Ausgabe erfolgt?",
      "code": "int[] a = new int[4];\na[1] = 5;\na[a[0]] = 3;\nSystem.out.println(a[0] + a[1] + \" \" + a.length);",
      "options": [
        "5 4",
        "35 4",
        "8 4",
        "8 3"
      ],
      "answer": 2,
      "explanation": "new int[4] füllt mit 0. a[a[0]] = a[0] = 3. a[0] + a[1] = 3 + 5 = 8 (beide int, links vom ersten String → Addition), dann \" \" + 4. Länge ist 4 (Indizes 0…3).",
      "source": {
        "title": "VFH ARR – Arrays erzeugen",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ARR-Arrays.pdf",
        "page": 14
      }
    },
    {
      "id": "q-gp1-array-alias",
      "chapterId": "gp1-exc-arr-str",
      "examStyle": "Code-Tracing",
      "question": "Was gibt der Code aus?",
      "code": "int[] a = {1, 2, 3};\nint[] b = a;\nb[0] = 9;\nSystem.out.println(a[0] + \" \" + (a == b));",
      "options": [
        "1 false",
        "9 false",
        "1 true",
        "9 true"
      ],
      "answer": 3,
      "explanation": "Arrays sind Objekte; b = a kopiert nur die Referenz. Beide zeigen auf dasselbe Array → a[0] ist 9 und a == b ist true.",
      "source": {
        "title": "VFH ARR – Arrays deklarieren",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ARR-Arrays.pdf",
        "page": 11
      }
    },
    {
      "id": "q-gp1-2d-array",
      "chapterId": "gp1-exc-arr-str",
      "examStyle": "Code-Tracing",
      "question": "Welche Ausgabe erzeugt der Code?",
      "code": "int[][] m = {{1, 2, 3}, {4, 5, 6}};\nint s = 0;\nfor (int i = 0; i < m.length; i++) {\n    s += m[i][m[i].length - 1];\n}\nSystem.out.println(m.length + \" \" + m[0].length + \" \" + s);",
      "options": [
        "2 3 9",
        "3 2 9",
        "2 3 21",
        "2 3 5"
      ],
      "answer": 0,
      "explanation": "m hat 2 Zeilen (m.length) mit je 3 Spalten (m[0].length). Summiert wird das jeweils letzte Element jeder Zeile: 3 + 6 = 9.",
      "source": {
        "title": "VFH ARR – Mehrdimensionale Arrays",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ARR-Arrays.pdf",
        "page": 54
      }
    },
    {
      "id": "q-gp1-stringbuilder",
      "chapterId": "gp1-exc-arr-str",
      "examStyle": "Code-Tracing",
      "question": "Was wird ausgegeben?",
      "code": "StringBuilder sb = new StringBuilder(\"abc\");\nsb.append(\"de\");\nsb.reverse();\nString s = \"abc\";\ns.concat(\"de\");\nSystem.out.println(sb + \" \" + s);",
      "options": [
        "edcba abcde",
        "edcba abc",
        "abcde abc",
        "abc abc"
      ],
      "answer": 1,
      "explanation": "StringBuilder ist veränderbar: append und reverse ändern sb selbst → \"edcba\". String ist immutable: s.concat(\"de\") erzeugt einen neuen String, der verworfen wird → s bleibt \"abc\".",
      "source": {
        "title": "VFH ZKT – Typ StringBuilder",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_ZKT-Zeichenketten.pdf",
        "page": 19
      }
    },
    {
      "id": "q-gp1-args",
      "chapterId": "gp1-exc-arr-str",
      "examStyle": "Code-Tracing (Folien 06)",
      "question": "Aufruf `java Add 18 24`. Was gibt `System.out.println(args[0] + args[1]);` aus?",
      "options": [
        "42",
        "18 24",
        "1824",
        "Compile-Fehler: Strings können nicht addiert werden"
      ],
      "answer": 2,
      "explanation": "Kommandozeilenparameter sind immer Strings → + verkettet: \"18\" + \"24\" = \"1824\". Für 42 braucht man Integer.parseInt(args[0]) + Integer.parseInt(args[1]) (wie in Add.java).",
      "source": {
        "title": "Folien 06 Datentypen konvertieren",
        "path": "moodle-data/gdp1/files/06. Benutzerinteraktion/GP1_26WS_06_Benutzerinteraktion.pdf",
        "page": 16
      }
    },
    {
      "id": "q-gp1-javac-java",
      "chapterId": "gp1-context",
      "examStyle": "Verständnis",
      "question": "Welche Befehlsfolge übersetzt und startet HelloMessageTester korrekt?",
      "options": [
        "java HelloMessageTester.java → javac HelloMessageTester",
        "javadoc HelloMessageTester.java → java HelloMessageTester",
        "javac HelloMessageTester → java HelloMessageTester.class",
        "javac HelloMessageTester.java → java HelloMessageTester"
      ],
      "answer": 3,
      "explanation": "javac bekommt die Quelldatei MIT Endung und erzeugt HelloMessageTester.class; java bekommt den Klassennamen OHNE .class. javadoc erzeugt nur Dokumentation.",
      "source": {
        "title": "VFH EJP – Zusammenfassung",
        "path": "moodle-data/gdp1/lerneinheiten/VFHGP1_EJP-DasErsteJavaProgramm.pdf",
        "page": 38
      }
    },
    {
      "id": "q-gp1-bytecode",
      "chapterId": "gp1-context",
      "examStyle": "Verständnis",
      "question": "Warum läuft dieselbe .class-Datei unter Windows, macOS und Linux?",
      "options": [
        "javac erzeugt plattformunabhängigen Bytecode, den die JVM der jeweiligen Plattform interpretiert",
        "javac erzeugt Maschinencode für alle CPUs gleichzeitig",
        "Java-Programme werden immer im Browser ausgeführt",
        "Das Betriebssystem übersetzt die .java-Datei bei jedem Start neu"
      ],
      "answer": 0,
      "explanation": "Java ist „architekturneutral“: Bytecode + plattformspezifische JVM/JRE (Intel, ARM, PowerPC …). Ein klassischer Compiler bräuchte dagegen je CPU einen eigenen Compiler und eigenen Maschinencode.",
      "source": {
        "title": "Folien 02 Java Virtuelle Maschine",
        "path": "moodle-data/gdp1/files/02. Java-Kontext/GP1_26WS_02_Java-Kontext.pdf",
        "page": 7
      }
    },
    {
      "id": "q-gp1-java-lang",
      "chapterId": "gp1-context",
      "examStyle": "Verständnis",
      "question": "Warum kann man String und System ohne import-Anweisung verwenden?",
      "options": [
        "Weil sie Schlüsselwörter der Sprache sind",
        "Weil sie im Paket java.lang liegen, das der Compiler automatisch importiert",
        "Weil sie im default-Paket liegen",
        "Weil der CLASSPATH sie enthält"
      ],
      "answer": 1,
      "explanation": "Der Compiler fügt bei jedem Übersetzungslauf import java.lang.*; hinzu. Klassen anderer Pakete (z. B. java.util.Scanner) brauchen ein import oder den voll qualifizierten Namen.",
      "source": {
        "title": "Folien 10 java.lang",
        "path": "moodle-data/gdp1/files/10. OOP_ Vererbung/GP1_26WS_10_OOP_Vererbung.pdf",
        "page": 20
      }
    }
  ]
};
