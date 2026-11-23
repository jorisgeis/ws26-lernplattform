// Additional Dual-Coding diagrams for gdp1 (merged into DIAGRAMS in js/engine/diagrams.js).
// Same SVG conventions as js/engine/diagrams.js: class="diagram-svg", d-box/d-accent/d-purple/d-green/d-orange/d-line/d-title/d-sub/d-label.

export const GDP1_DIAGRAMS = {
  'gp1-widening': {
    title: 'Typumwandlung in Java: Widening (implizit) vs. Narrowing (explizit)',
    svg: `<svg viewBox="0 0 720 220" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="gp1-widening-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="d-line"/></marker></defs>
      <text x="20" y="24" class="d-title">Typerweiterung (Widening) – automatisch / implizit (verlustfrei bei Ganzzahlen)</text>
      <rect x="20" y="40" width="76" height="44" rx="8" class="d-box d-green"/>
      <text x="58" y="60" text-anchor="middle" class="d-title">byte</text>
      <text x="58" y="76" text-anchor="middle" class="d-sub">8 Bit</text>
      <rect x="122" y="40" width="76" height="44" rx="8" class="d-box d-green"/>
      <text x="160" y="60" text-anchor="middle" class="d-title">short</text>
      <text x="160" y="76" text-anchor="middle" class="d-sub">16 Bit</text>
      <rect x="122" y="106" width="76" height="44" rx="8" class="d-box d-purple"/>
      <text x="160" y="126" text-anchor="middle" class="d-title">char</text>
      <text x="160" y="142" text-anchor="middle" class="d-sub">16 Bit ≥ 0</text>
      <rect x="230" y="40" width="76" height="44" rx="8" class="d-box d-accent"/>
      <text x="268" y="60" text-anchor="middle" class="d-title">int</text>
      <text x="268" y="76" text-anchor="middle" class="d-sub">32 Bit</text>
      <rect x="338" y="40" width="76" height="44" rx="8" class="d-box d-accent"/>
      <text x="376" y="60" text-anchor="middle" class="d-title">long</text>
      <text x="376" y="76" text-anchor="middle" class="d-sub">64 Bit</text>
      <rect x="446" y="40" width="76" height="44" rx="8" class="d-box d-orange"/>
      <text x="484" y="60" text-anchor="middle" class="d-title">float</text>
      <text x="484" y="76" text-anchor="middle" class="d-sub">32 Bit</text>
      <rect x="554" y="40" width="84" height="44" rx="8" class="d-box d-orange"/>
      <text x="596" y="60" text-anchor="middle" class="d-title">double</text>
      <text x="596" y="76" text-anchor="middle" class="d-sub">64 Bit</text>
      <line x1="96" y1="62" x2="120" y2="62" class="d-line" marker-end="url(#gp1-widening-arrow)"/>
      <line x1="198" y1="62" x2="228" y2="62" class="d-line" marker-end="url(#gp1-widening-arrow)"/>
      <line x1="198" y1="128" x2="246" y2="86" class="d-line" marker-end="url(#gp1-widening-arrow)"/>
      <line x1="306" y1="62" x2="336" y2="62" class="d-line" marker-end="url(#gp1-widening-arrow)"/>
      <line x1="414" y1="62" x2="444" y2="62" class="d-line" marker-end="url(#gp1-widening-arrow)"/>
      <line x1="522" y1="62" x2="552" y2="62" class="d-line" marker-end="url(#gp1-widening-arrow)"/>
      <rect x="230" y="106" width="408" height="52" rx="8" class="d-box"/>
      <text x="434" y="128" text-anchor="middle" class="d-title">Typeinengung (Narrowing) – expliziter Cast nötig!</text>
      <text x="434" y="147" text-anchor="middle" class="d-sub">double d = 3.9;  int n = (int) d;  // n == 3 (Nachkommastellen abgeschnitten)</text>
      <text x="20" y="186" class="d-label">Klausurfalle: boolean ist NICHT umwandelbar · float f = 3.14; ist Compilefehler (3.14 ist double → 3.14f)</text>
      <text x="20" y="206" class="d-sub">Rechnen mit byte/short/char liefert automatisch int (b1 + b2 → int)</text>
    </svg>`
  },
  'gp1-switch-fallthrough': {
    title: 'switch-Anweisung: Fall-Through ohne break vs. sauber mit break',
    svg: `<svg viewBox="0 0 720 240" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="gp1-switch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="d-line"/></marker></defs>
      <text x="20" y="24" class="d-title">Ohne break: Fall-Through (x = 2)</text>
      <rect x="20" y="38" width="150" height="36" rx="8" class="d-box"/>
      <text x="95" y="61" text-anchor="middle" class="d-sub">case 1: …</text>
      <rect x="20" y="88" width="150" height="36" rx="8" class="d-box d-orange"/>
      <text x="95" y="111" text-anchor="middle" class="d-title">case 2: Einstieg ✔</text>
      <rect x="20" y="138" width="150" height="36" rx="8" class="d-box d-orange"/>
      <text x="95" y="161" text-anchor="middle" class="d-sub">case 3: läuft weiter!</text>
      <rect x="20" y="188" width="150" height="36" rx="8" class="d-box d-orange"/>
      <text x="95" y="211" text-anchor="middle" class="d-sub">default: läuft auch!</text>
      <line x1="95" y1="124" x2="95" y2="136" class="d-line" marker-end="url(#gp1-switch-arrow)"/>
      <line x1="95" y1="174" x2="95" y2="186" class="d-line" marker-end="url(#gp1-switch-arrow)"/>
      <text x="200" y="112" class="d-label">Kein break →</text>
      <text x="200" y="130" class="d-label">alle folgenden</text>
      <text x="200" y="148" class="d-label">Zweige werden</text>
      <text x="200" y="166" class="d-label">mit ausgeführt!</text>
      <text x="380" y="24" class="d-title">Mit break: sofortiger Austritt (x = 2)</text>
      <rect x="380" y="38" width="160" height="36" rx="8" class="d-box"/>
      <text x="460" y="61" text-anchor="middle" class="d-sub">case 1: …; break;</text>
      <rect x="380" y="88" width="160" height="36" rx="8" class="d-box d-green"/>
      <text x="460" y="111" text-anchor="middle" class="d-title">case 2: …; break; ✔</text>
      <rect x="380" y="138" width="160" height="36" rx="8" class="d-box"/>
      <text x="460" y="161" text-anchor="middle" class="d-sub">case 3: übersprungen</text>
      <rect x="380" y="188" width="160" height="36" rx="8" class="d-box d-accent"/>
      <text x="460" y="211" text-anchor="middle" class="d-title">nach switch { … }</text>
      <path d="M540,106 L615,106 L615,206 L542,206" fill="none" class="d-line" marker-end="url(#gp1-switch-arrow)"/>
      <text x="625" y="160" class="d-label">break</text>
    </svg>`
  },
  'gp1-loop-types': {
    title: 'Schleifenarten: for, while (kopfgesteuert) vs. do-while (fußgesteuert)',
    svg: `<svg viewBox="0 0 720 230" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="215" height="175" rx="8" class="d-box d-accent"/>
      <text x="127" y="45" text-anchor="middle" class="d-title">for-Schleife</text>
      <text x="127" y="64" text-anchor="middle" class="d-sub">kopfgesteuert · 0..n Mal</text>
      <text x="35" y="92" class="d-label">for (Init; Bed; Update) {</text>
      <text x="35" y="110" class="d-label">  Rumpf;</text>
      <text x="35" y="128" class="d-label">}</text>
      <text x="35" y="156" class="d-sub">• Zählschleife (Anzahl bekannt)</text>
      <text x="35" y="176" class="d-sub">• Init-Variable nur im for-Scope!</text>
      <rect x="252" y="20" width="215" height="175" rx="8" class="d-box d-green"/>
      <text x="359" y="45" text-anchor="middle" class="d-title">while-Schleife</text>
      <text x="359" y="64" text-anchor="middle" class="d-sub">kopfgesteuert · 0..n Mal</text>
      <text x="267" y="92" class="d-label">Init;</text>
      <text x="267" y="110" class="d-label">while (Bed) {</text>
      <text x="267" y="128" class="d-label">  Rumpf; Update;</text>
      <text x="267" y="146" class="d-label">}</text>
      <text x="267" y="176" class="d-sub">• Äquivalent zu for (Klausur 6b!)</text>
      <rect x="484" y="20" width="215" height="175" rx="8" class="d-box d-purple"/>
      <text x="591" y="45" text-anchor="middle" class="d-title">do-while-Schleife</text>
      <text x="591" y="64" text-anchor="middle" class="d-sub">fußgesteuert · ≥ 1 Mal</text>
      <text x="499" y="92" class="d-label">do {</text>
      <text x="499" y="110" class="d-label">  Rumpf;</text>
      <text x="499" y="128" class="d-label">} while (Bed);</text>
      <text x="499" y="156" class="d-sub">• Läuft mindestens 1× durch</text>
      <text x="499" y="176" class="d-sub">• Semikolon am Ende Pflicht!</text>
      <text x="20" y="218" class="d-sub">Tracing-Falle: while (a++ &lt;= 3) inkrementiert a auch beim letzten (false) Test!</text>
    </svg>`
  },
  'gp1-static-vs-instance': {
    title: 'static (Klasse) vs. Instanz (Objekt) – Attribute & Methoden',
    svg: `<svg viewBox="0 0 720 245" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="16" width="680" height="74" rx="8" class="d-box d-purple"/>
      <text x="360" y="40" text-anchor="middle" class="d-title">Klasse Widget (einmalig im Speicher – static)</text>
      <text x="360" y="60" text-anchor="middle" class="d-sub">static int count = 2;   ·   public static void mit()   (Aufruf: Widget.mit())</text>
      <text x="360" y="78" text-anchor="middle" class="d-label">Gemeinsam für alle Objekte · kein Zugriff auf this / Instanzvariablen!</text>
      <rect x="20" y="114" width="325" height="90" rx="8" class="d-box d-accent"/>
      <text x="182" y="138" text-anchor="middle" class="d-title">Objekt w1 = new Widget()</text>
      <text x="182" y="158" text-anchor="middle" class="d-sub">eigene Instanzvariable: id = 1</text>
      <text x="182" y="176" text-anchor="middle" class="d-sub">Instanzmethode: w1.ohne()</text>
      <text x="182" y="194" text-anchor="middle" class="d-label">kennt this UND darf auf static zugreifen</text>
      <rect x="375" y="114" width="325" height="90" rx="8" class="d-box d-green"/>
      <text x="537" y="138" text-anchor="middle" class="d-title">Objekt w2 = new Widget()</text>
      <text x="537" y="158" text-anchor="middle" class="d-sub">eigene Instanzvariable: id = 2</text>
      <text x="537" y="176" text-anchor="middle" class="d-sub">Instanzmethode: w2.ohne()</text>
      <text x="537" y="194" text-anchor="middle" class="d-label">eigenständiger Zustand pro Objekt</text>
      <line x1="182" y1="114" x2="260" y2="90" class="d-line"/>
      <line x1="537" y1="114" x2="460" y2="90" class="d-line"/>
      <text x="20" y="230" class="d-sub">Klausur 7a/7b: static ≠ konstant (konstant ist final; Konstanten sind meist static final)</text>
    </svg>`
  },
  'gp1-call-by-value': {
    title: 'Parameterübergabe in Java: immer Call by Value (auch bei Referenzen!)',
    svg: `<svg viewBox="0 0 720 245" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="gp1-cbv-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="d-line"/></marker></defs>
      <rect x="20" y="18" width="325" height="190" rx="8" class="d-box d-accent"/>
      <text x="182" y="42" text-anchor="middle" class="d-title">1. Primitiver Typ (int x = 5)</text>
      <rect x="40" y="60" width="120" height="44" rx="6" class="d-box"/>
      <text x="100" y="79" text-anchor="middle" class="d-label">Aufrufer: x</text>
      <text x="100" y="96" text-anchor="middle" class="d-title">5</text>
      <rect x="205" y="60" width="120" height="44" rx="6" class="d-box d-orange"/>
      <text x="265" y="79" text-anchor="middle" class="d-label">Parameter: p</text>
      <text x="265" y="96" text-anchor="middle" class="d-title">5 → 99</text>
      <line x1="160" y1="82" x2="203" y2="82" class="d-line" marker-end="url(#gp1-cbv-arrow)"/>
      <text x="182" y="74" text-anchor="middle" class="d-sub">Kopie</text>
      <text x="40" y="132" class="d-sub">• Wert 5 wird kopiert</text>
      <text x="40" y="152" class="d-sub">• p = 99 ändert x NICHT</text>
      <text x="40" y="172" class="d-sub">• Nach Aufruf: x bleibt 5</text>
      <rect x="375" y="18" width="325" height="190" rx="8" class="d-box d-green"/>
      <text x="537" y="42" text-anchor="middle" class="d-title">2. Referenztyp (Car c)</text>
      <rect x="395" y="60" width="110" height="40" rx="6" class="d-box"/>
      <text x="450" y="84" text-anchor="middle" class="d-label">Aufrufer: c</text>
      <rect x="565" y="60" width="115" height="40" rx="6" class="d-box d-purple"/>
      <text x="622" y="84" text-anchor="middle" class="d-label">Param: p (Kopie)</text>
      <rect x="465" y="130" width="150" height="42" rx="6" class="d-box d-orange"/>
      <text x="540" y="149" text-anchor="middle" class="d-title">Car-Objekt (Heap)</text>
      <text x="540" y="165" text-anchor="middle" class="d-sub">color = "rot"</text>
      <line x1="450" y1="100" x2="505" y2="128" class="d-line" marker-end="url(#gp1-cbv-arrow)"/>
      <line x1="622" y1="100" x2="575" y2="128" class="d-line" marker-end="url(#gp1-cbv-arrow)"/>
      <text x="395" y="194" class="d-sub">p.setColor() wirkt · p = new Car() ändert c NICHT!</text>
      <text x="20" y="232" class="d-sub">Merksatz (Folien 10 S. 40): Java hat KEIN Call by Reference – es wird immer der Wert (bzw. die Adresse) kopiert.</text>
    </svg>`
  },
  'gp1-stepwise': {
    title: 'Schrittweise Verfeinerung (Top-Down-Entwurf)',
    svg: `<svg viewBox="0 0 720 235" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="gp1-sw-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="d-line"/></marker></defs>
      <rect x="210" y="12" width="300" height="40" rx="8" class="d-box d-accent"/>
      <text x="360" y="37" text-anchor="middle" class="d-title">1. Gesamtproblem (grob / abstrakt)</text>
      <line x1="360" y1="52" x2="140" y2="82" class="d-line" marker-end="url(#gp1-sw-arrow)"/>
      <line x1="360" y1="52" x2="360" y2="82" class="d-line" marker-end="url(#gp1-sw-arrow)"/>
      <line x1="360" y1="52" x2="580" y2="82" class="d-line" marker-end="url(#gp1-sw-arrow)"/>
      <rect x="40" y="84" width="200" height="42" rx="8" class="d-box d-purple"/>
      <text x="140" y="109" text-anchor="middle" class="d-title">2. Teilproblem A</text>
      <rect x="260" y="84" width="200" height="42" rx="8" class="d-box d-purple"/>
      <text x="360" y="109" text-anchor="middle" class="d-title">2. Teilproblem B</text>
      <rect x="480" y="84" width="200" height="42" rx="8" class="d-box d-purple"/>
      <text x="580" y="109" text-anchor="middle" class="d-title">2. Teilproblem C</text>
      <line x1="140" y1="126" x2="140" y2="154" class="d-line" marker-end="url(#gp1-sw-arrow)"/>
      <line x1="360" y1="126" x2="360" y2="154" class="d-line" marker-end="url(#gp1-sw-arrow)"/>
      <line x1="580" y1="126" x2="580" y2="154" class="d-line" marker-end="url(#gp1-sw-arrow)"/>
      <rect x="40" y="156" width="640" height="44" rx="8" class="d-box d-green"/>
      <text x="360" y="176" text-anchor="middle" class="d-title">3. Weiter zerlegen, bis jeder Schritt direkt in Java-Anweisungen / Methoden umsetzbar ist</text>
      <text x="360" y="193" text-anchor="middle" class="d-sub">Ablauf: Problem verstehen → in Teilaufgaben zerlegen → verfeinern → implementieren → testen</text>
      <text x="20" y="222" class="d-sub">Klausur 9b: Reihenfolge klar nennen (vom Groben ins Feine / Top-Down; VFH EIP Beispiel „Kaffeekochen“)</text>
    </svg>`
  },
  'gp1-exception-hierarchy': {
    title: 'Ausnahmebehandlung in Java: Throwable-Hierarchie (checked vs. unchecked)',
    svg: `<svg viewBox="0 0 720 245" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <rect x="285" y="12" width="150" height="36" rx="8" class="d-box"/>
      <text x="360" y="35" text-anchor="middle" class="d-title">Throwable</text>
      <line x1="360" y1="48" x2="150" y2="78" class="d-line"/>
      <line x1="360" y1="48" x2="510" y2="78" class="d-line"/>
      <rect x="45" y="78" width="210" height="50" rx="8" class="d-box d-orange"/>
      <text x="150" y="100" text-anchor="middle" class="d-title">Error (unchecked)</text>
      <text x="150" y="117" text-anchor="middle" class="d-sub">JVM-Fehler (z. B. OutOfMemoryError)</text>
      <rect x="405" y="78" width="210" height="50" rx="8" class="d-box d-purple"/>
      <text x="510" y="100" text-anchor="middle" class="d-title">Exception</text>
      <text x="510" y="117" text-anchor="middle" class="d-sub">behandelbare Programmfehler</text>
      <line x1="510" y1="128" x2="355" y2="158" class="d-line"/>
      <line x1="510" y1="128" x2="595" y2="158" class="d-line"/>
      <rect x="235" y="158" width="240" height="68" rx="8" class="d-box d-green"/>
      <text x="355" y="180" text-anchor="middle" class="d-title">Checked Exceptions</text>
      <text x="355" y="198" text-anchor="middle" class="d-sub">z. B. IOException, ParseException</text>
      <text x="355" y="214" text-anchor="middle" class="d-label">try-catch oder throws Pflicht!</text>
      <rect x="495" y="158" width="205" height="68" rx="8" class="d-box d-accent"/>
      <text x="597" y="180" text-anchor="middle" class="d-title">RuntimeException</text>
      <text x="597" y="198" text-anchor="middle" class="d-sub">unchecked: NullPointer-,</text>
      <text x="597" y="214" text-anchor="middle" class="d-sub">ArrayIndexOutOfBounds-, Arithmetic-</text>
      <text x="20" y="178" class="d-label">try { … }</text>
      <text x="20" y="196" class="d-label">catch (Typ e) { … }</text>
      <text x="20" y="214" class="d-label">finally { immer! }</text>
    </svg>`
  }
};
