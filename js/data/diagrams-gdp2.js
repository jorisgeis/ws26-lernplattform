// Additional Dual-Coding diagrams for gdp2 (merged into DIAGRAMS in js/engine/diagrams.js).
// Same SVG conventions as js/engine/diagrams.js: class="diagram-svg", d-box/d-accent/d-purple/d-green/d-orange/d-line/d-title/d-sub/d-label.

export const GDP2_DIAGRAMS = {
  'gp2-ka-architektur': {
    title: 'Kursarbeit: Paketstruktur (MVC + DAO) und Bezug FA1–FA4',
    svg: `<svg viewBox="0 0 720 260" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="gp2-ka-architektur-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="d-line"/></marker></defs>
      <rect x="20" y="20" width="200" height="70" rx="8" class="d-box d-accent"/>
      <text x="120" y="45" text-anchor="middle" class="d-title">view (JavaFX)</text>
      <text x="120" y="65" text-anchor="middle" class="d-sub">Stage, Scene, Layouts, Controls</text>
      <text x="120" y="80" text-anchor="middle" class="d-label">FA3: GUI + CRUD</text>
      <rect x="260" y="20" width="200" height="70" rx="8" class="d-box d-purple"/>
      <text x="360" y="45" text-anchor="middle" class="d-title">controller</text>
      <text x="360" y="65" text-anchor="middle" class="d-sub">EventHandler&lt;ActionEvent&gt;</text>
      <text x="360" y="80" text-anchor="middle" class="d-label">Eingaben prüfen, Model ändern</text>
      <rect x="500" y="20" width="200" height="70" rx="8" class="d-box d-green"/>
      <text x="600" y="45" text-anchor="middle" class="d-title">model</text>
      <text x="600" y="65" text-anchor="middle" class="d-sub">Fachklassen + List/Map</text>
      <text x="600" y="80" text-anchor="middle" class="d-label">FA1 Objektmodell, FA2 Sortierung</text>
      <rect x="500" y="150" width="200" height="70" rx="8" class="d-box d-orange"/>
      <text x="600" y="175" text-anchor="middle" class="d-title">DAO (Persistenz)</text>
      <text x="600" y="195" text-anchor="middle" class="d-sub">Reader/Writer, Data-Streams</text>
      <text x="600" y="210" text-anchor="middle" class="d-label">FA4: optional XML (DOM)</text>
      <rect x="260" y="150" width="200" height="70" rx="8" class="d-box"/>
      <text x="360" y="175" text-anchor="middle" class="d-title">data/…  (relativ!)</text>
      <text x="360" y="195" text-anchor="middle" class="d-sub">Datei im Projekt-Wurzelordner</text>
      <text x="360" y="210" text-anchor="middle" class="d-label">UTF-8, close() nicht vergessen</text>
      <line x1="220" y1="55" x2="258" y2="55" class="d-line" marker-end="url(#gp2-ka-architektur-arrow)"/>
      <line x1="460" y1="55" x2="498" y2="55" class="d-line" marker-end="url(#gp2-ka-architektur-arrow)"/>
      <line x1="600" y1="90" x2="600" y2="148" class="d-line" marker-end="url(#gp2-ka-architektur-arrow)"/>
      <line x1="500" y1="185" x2="462" y2="185" class="d-line" marker-end="url(#gp2-ka-architektur-arrow)"/>
      <text x="20" y="160" class="d-label">Abgabe: Export → Archive File</text>
      <text x="20" y="178" class="d-label">nur src, Name GP2_Eclipse.zip</text>
      <text x="20" y="196" class="d-label">kein module-info, kein Maven/Git</text>
      <text x="20" y="214" class="d-label">Frist: 12.01.–08.02.2027</text>
      <text x="20" y="245" class="d-sub">Model kennt kein JavaFX → Pfeile zeigen „benutzt“-Richtung</text>
    </svg>`
  },
  'gp2-stream-kette': {
    title: 'Hintereinanderschaltung von Strömen (Text schreiben / lesen)',
    svg: `<svg viewBox="0 0 720 230" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="gp2-stream-kette-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="d-line"/></marker></defs>
      <text x="20" y="24" class="d-title">Schreiben (Programm → Datei)</text>
      <rect x="20" y="36" width="120" height="50" rx="8" class="d-box d-accent"/>
      <text x="80" y="58" text-anchor="middle" class="d-title">Programm</text>
      <text x="80" y="75" text-anchor="middle" class="d-sub">println(…)</text>
      <rect x="175" y="36" width="140" height="50" rx="8" class="d-box d-purple"/>
      <text x="245" y="58" text-anchor="middle" class="d-title">PrintWriter</text>
      <text x="245" y="75" text-anchor="middle" class="d-sub">print-Methoden</text>
      <rect x="350" y="36" width="150" height="50" rx="8" class="d-box d-green"/>
      <text x="425" y="58" text-anchor="middle" class="d-title">BufferedWriter</text>
      <text x="425" y="75" text-anchor="middle" class="d-sub">Puffer, flush()</text>
      <rect x="535" y="36" width="165" height="50" rx="8" class="d-box d-orange"/>
      <text x="617" y="58" text-anchor="middle" class="d-title">FileWriter(…, UTF_8)</text>
      <text x="617" y="75" text-anchor="middle" class="d-sub">Zeichen → Bytes → Datei</text>
      <line x1="140" y1="61" x2="173" y2="61" class="d-line" marker-end="url(#gp2-stream-kette-arrow)"/>
      <line x1="315" y1="61" x2="348" y2="61" class="d-line" marker-end="url(#gp2-stream-kette-arrow)"/>
      <line x1="500" y1="61" x2="533" y2="61" class="d-line" marker-end="url(#gp2-stream-kette-arrow)"/>
      <text x="20" y="124" class="d-title">Lesen (Datei → Programm)</text>
      <rect x="20" y="136" width="165" height="50" rx="8" class="d-box d-orange"/>
      <text x="102" y="158" text-anchor="middle" class="d-title">FileReader(…, UTF_8)</text>
      <text x="102" y="175" text-anchor="middle" class="d-sub">read() → -1 am Ende</text>
      <rect x="220" y="136" width="160" height="50" rx="8" class="d-box d-green"/>
      <text x="300" y="158" text-anchor="middle" class="d-title">BufferedReader</text>
      <text x="300" y="175" text-anchor="middle" class="d-sub">readLine() → null am Ende</text>
      <rect x="415" y="136" width="120" height="50" rx="8" class="d-box d-accent"/>
      <text x="475" y="158" text-anchor="middle" class="d-title">Programm</text>
      <text x="475" y="175" text-anchor="middle" class="d-sub">String-Zeilen</text>
      <line x1="185" y1="161" x2="218" y2="161" class="d-line" marker-end="url(#gp2-stream-kette-arrow)"/>
      <line x1="380" y1="161" x2="413" y2="161" class="d-line" marker-end="url(#gp2-stream-kette-arrow)"/>
      <text x="560" y="150" class="d-label">Binär analog:</text>
      <text x="560" y="168" class="d-label">DataOutputStream →</text>
      <text x="560" y="186" class="d-label">FileOutputStream</text>
      <text x="20" y="215" class="d-sub">Code: new PrintWriter(new BufferedWriter(new FileWriter(name, StandardCharsets.UTF_8)))</text>
    </svg>`
  },
  'gp2-exception-hierarchie': {
    title: 'Exception-Hierarchie: checked vs. unchecked (LV 2)',
    svg: `<svg viewBox="0 0 720 250" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <rect x="290" y="10" width="140" height="36" rx="8" class="d-box"/>
      <text x="360" y="33" text-anchor="middle" class="d-title">Throwable</text>
      <line x1="360" y1="46" x2="150" y2="76" class="d-line"/>
      <line x1="360" y1="46" x2="520" y2="76" class="d-line"/>
      <rect x="60" y="76" width="180" height="50" rx="8" class="d-box d-orange"/>
      <text x="150" y="98" text-anchor="middle" class="d-title">Error</text>
      <text x="150" y="115" text-anchor="middle" class="d-sub">nicht behandeln</text>
      <rect x="430" y="76" width="180" height="50" rx="8" class="d-box d-purple"/>
      <text x="520" y="98" text-anchor="middle" class="d-title">Exception</text>
      <text x="520" y="115" text-anchor="middle" class="d-sub">checked: MUSS behandelt werden</text>
      <line x1="520" y1="126" x2="380" y2="160" class="d-line"/>
      <line x1="520" y1="126" x2="620" y2="160" class="d-line"/>
      <rect x="270" y="160" width="220" height="80" rx="8" class="d-box d-green"/>
      <text x="380" y="182" text-anchor="middle" class="d-title">IOException (checked)</text>
      <text x="380" y="200" text-anchor="middle" class="d-sub">FileNotFoundException</text>
      <text x="380" y="216" text-anchor="middle" class="d-sub">EOFException</text>
      <text x="380" y="232" text-anchor="middle" class="d-label">try-catch oder throws, sonst Compilerfehler</text>
      <rect x="510" y="160" width="200" height="80" rx="8" class="d-box d-accent"/>
      <text x="610" y="182" text-anchor="middle" class="d-title">RuntimeException</text>
      <text x="610" y="200" text-anchor="middle" class="d-sub">unchecked: KANN behandelt werden</text>
      <text x="610" y="216" text-anchor="middle" class="d-sub">NumberFormatException,</text>
      <text x="610" y="232" text-anchor="middle" class="d-sub">IllegalArgumentException …</text>
      <text x="20" y="175" class="d-label">KA/FA-Regel:</text>
      <text x="20" y="193" class="d-label">catch (IOException e) ✔</text>
      <text x="20" y="211" class="d-label">catch (Exception e) ✘</text>
      <text x="20" y="229" class="d-label">main() throws Exception ✘</text>
    </svg>`
  },
  'gp2-mvc': {
    title: 'Model – View – Controller (LV 5 / FXE)',
    svg: `<svg viewBox="0 0 720 230" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="gp2-mvc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="d-line"/></marker></defs>
      <rect x="40" y="30" width="200" height="80" rx="8" class="d-box d-accent"/>
      <text x="140" y="55" text-anchor="middle" class="d-title">View</text>
      <text x="140" y="75" text-anchor="middle" class="d-sub">Ansicht des Model</text>
      <text x="140" y="92" text-anchor="middle" class="d-sub">übermittelt Benutzeraktionen</text>
      <rect x="480" y="30" width="200" height="80" rx="8" class="d-box d-purple"/>
      <text x="580" y="55" text-anchor="middle" class="d-title">Controller</text>
      <text x="580" y="75" text-anchor="middle" class="d-sub">übersetzt Aktionen in</text>
      <text x="580" y="92" text-anchor="middle" class="d-sub">Model-Änderungen, wählt View</text>
      <rect x="260" y="140" width="200" height="75" rx="8" class="d-box d-green"/>
      <text x="360" y="165" text-anchor="middle" class="d-title">Model</text>
      <text x="360" y="185" text-anchor="middle" class="d-sub">kapselt Daten + Zustand</text>
      <text x="360" y="202" text-anchor="middle" class="d-sub">unabhängig von der GUI</text>
      <line x1="240" y1="60" x2="478" y2="60" class="d-line" marker-end="url(#gp2-mvc-arrow)"/>
      <text x="360" y="52" text-anchor="middle" class="d-label">Benutzeraktionen (Ereignisse)</text>
      <line x1="560" y1="110" x2="440" y2="140" class="d-line" marker-end="url(#gp2-mvc-arrow)"/>
      <text x="560" y="140" class="d-label">Änderung des Zustands</text>
      <line x1="160" y1="110" x2="275" y2="140" class="d-line" marker-start="url(#gp2-mvc-arrow)"/>
      <text x="40" y="140" class="d-label">Abfrage / Benachrichtigung</text>
      <text x="40" y="222" class="d-sub">JavaFX: View + Controller oft in einer Klasse; Model in eigenem Paket</text>
    </svg>`
  }
};
