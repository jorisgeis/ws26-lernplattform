// Dual-Coding Visual Diagrams (Paivio's Dual Coding Theory)
// Clean inline SVGs for core CS concepts across GP1, GP2, ICS, and English CS

import { GDP1_DIAGRAMS } from '../data/diagrams-gdp1.js';
import { GDP2_DIAGRAMS } from '../data/diagrams-gdp2.js';
import { ICS_DIAGRAMS } from '../data/diagrams-ics.js';
import { ENGLISH_DIAGRAMS } from '../data/diagrams-english.js';

export const DIAGRAMS = {
  'java-compilation': {
    title: 'Java Kompilierung & JVM (Write Once, Run Anywhere)',
    svg: `<svg viewBox="0 0 720 150" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="currentColor"/></marker></defs>
      <rect x="10" y="35" width="130" height="70" rx="10" class="d-box d-accent"/>
      <text x="75" y="65" text-anchor="middle" class="d-title">Quellcode</text>
      <text x="75" y="85" text-anchor="middle" class="d-sub">Hello.java</text>
      <line x1="140" y1="70" x2="195" y2="70" class="d-line" marker-end="url(#arr)"/>
      <text x="167" y="58" text-anchor="middle" class="d-label">javac</text>
      <rect x="200" y="35" width="140" height="70" rx="10" class="d-box d-purple"/>
      <text x="270" y="65" text-anchor="middle" class="d-title">Bytecode</text>
      <text x="270" y="85" text-anchor="middle" class="d-sub">Hello.class</text>
      <line x1="340" y1="70" x2="395" y2="70" class="d-line" marker-end="url(#arr)"/>
      <text x="367" y="58" text-anchor="middle" class="d-label">java</text>
      <rect x="400" y="25" width="145" height="90" rx="10" class="d-box d-green"/>
      <text x="472" y="55" text-anchor="middle" class="d-title">JVM</text>
      <text x="472" y="75" text-anchor="middle" class="d-sub">Interpreter + JIT</text>
      <text x="472" y="95" text-anchor="middle" class="d-sub">Garbage Collector</text>
      <line x1="545" y1="70" x2="590" y2="70" class="d-line" marker-end="url(#arr)"/>
      <rect x="595" y="15" width="115" height="34" rx="7" class="d-box"/>
      <text x="652" y="36" text-anchor="middle" class="d-sub">macOS</text>
      <rect x="595" y="55" width="115" height="34" rx="7" class="d-box"/>
      <text x="652" y="76" text-anchor="middle" class="d-sub">Windows</text>
      <rect x="595" y="95" width="115" height="34" rx="7" class="d-box"/>
      <text x="652" y="116" text-anchor="middle" class="d-sub">Linux</text>
    </svg>`
  },
  'oop-inheritance': {
    title: 'OOP: Vererbung, Abstrakte Klasse & Polymorphie',
    svg: `<svg viewBox="0 0 680 210" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="tri" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="10" markerHeight="10" orient="auto"><path d="M 0 0 L 10 6 L 0 12 z" fill="var(--bg-card)" stroke="currentColor" stroke-width="1.5"/></marker></defs>
      <rect x="230" y="10" width="220" height="74" rx="10" class="d-box d-purple"/>
      <text x="340" y="32" text-anchor="middle" class="d-label">&laquo;abstract&raquo;</text>
      <text x="340" y="50" text-anchor="middle" class="d-title">Shape</text>
      <text x="340" y="70" text-anchor="middle" class="d-sub">+ abstract double area()</text>
      <line x1="160" y1="125" x2="290" y2="86" class="d-line" marker-end="url(#tri)"/>
      <line x1="520" y1="125" x2="390" y2="86" class="d-line" marker-end="url(#tri)"/>
      <rect x="40" y="125" width="230" height="72" rx="10" class="d-box d-accent"/>
      <text x="155" y="149" text-anchor="middle" class="d-title">Circle extends Shape</text>
      <text x="155" y="168" text-anchor="middle" class="d-sub">- double radius</text>
      <text x="155" y="185" text-anchor="middle" class="d-sub">+ double area() // π*r²</text>
      <rect x="410" y="125" width="230" height="72" rx="10" class="d-box d-green"/>
      <text x="525" y="149" text-anchor="middle" class="d-title">Rectangle extends Shape</text>
      <text x="525" y="168" text-anchor="middle" class="d-sub">- double w, h</text>
      <text x="525" y="185" text-anchor="middle" class="d-sub">+ double area() // w*h</text>
    </svg>`
  },
  'jcf-hierarchy': {
    title: 'Java Collections Framework (JCF) Hierarchie',
    svg: `<svg viewBox="0 0 720 220" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <rect x="190" y="10" width="160" height="38" rx="8" class="d-box d-purple"/>
      <text x="270" y="34" text-anchor="middle" class="d-title">&laquo;Collection&lt;E&gt;&raquo;</text>
      <rect x="520" y="10" width="150" height="38" rx="8" class="d-box d-orange"/>
      <text x="595" y="34" text-anchor="middle" class="d-title">&laquo;Map&lt;K,V&gt;&raquo;</text>
      <line x1="270" y1="48" x2="90" y2="82" class="d-line"/>
      <line x1="270" y1="48" x2="270" y2="82" class="d-line"/>
      <line x1="270" y1="48" x2="430" y2="82" class="d-line"/>
      <line x1="595" y1="48" x2="595" y2="82" class="d-line"/>
      <rect x="15" y="82" width="150" height="44" rx="8" class="d-box d-accent"/>
      <text x="90" y="102" text-anchor="middle" class="d-title">&laquo;List&gt;</text>
      <text x="90" y="118" text-anchor="middle" class="d-sub">Index, Duplikate OK</text>
      <rect x="195" y="82" width="150" height="44" rx="8" class="d-box d-green"/>
      <text x="270" y="102" text-anchor="middle" class="d-title">&laquo;Set&gt;</text>
      <text x="270" y="118" text-anchor="middle" class="d-sub">Keine Duplikate</text>
      <rect x="365" y="82" width="130" height="44" rx="8" class="d-box"/>
      <text x="430" y="102" text-anchor="middle" class="d-title">&laquo;Queue&gt;</text>
      <text x="430" y="118" text-anchor="middle" class="d-sub">FIFO / Priority</text>
      <rect x="520" y="82" width="185" height="44" rx="8" class="d-box d-orange"/>
      <text x="612" y="102" text-anchor="middle" class="d-title">Key &rarr; Value</text>
      <text x="612" y="118" text-anchor="middle" class="d-sub">Keys eindeutig</text>
      <rect x="15" y="152" width="150" height="54" rx="8" class="d-box"/>
      <text x="90" y="173" text-anchor="middle" class="d-sub">ArrayList (O(1) get)</text>
      <text x="90" y="193" text-anchor="middle" class="d-sub">LinkedList (O(1) ins)</text>
      <rect x="195" y="152" width="150" height="54" rx="8" class="d-box"/>
      <text x="270" y="173" text-anchor="middle" class="d-sub">HashSet (O(1))</text>
      <text x="270" y="193" text-anchor="middle" class="d-sub">TreeSet (sortiert)</text>
      <rect x="365" y="152" width="130" height="54" rx="8" class="d-box"/>
      <text x="430" y="173" text-anchor="middle" class="d-sub">ArrayDeque</text>
      <text x="430" y="193" text-anchor="middle" class="d-sub">PriorityQueue</text>
      <rect x="520" y="152" width="185" height="54" rx="8" class="d-box"/>
      <text x="612" y="173" text-anchor="middle" class="d-sub">HashMap (O(1))</text>
      <text x="612" y="193" text-anchor="middle" class="d-sub">TreeMap (sortiert)</text>
      <line x1="90" y1="126" x2="90" y2="152" class="d-line"/>
      <line x1="270" y1="126" x2="270" y2="152" class="d-line"/>
      <line x1="430" y1="126" x2="430" y2="152" class="d-line"/>
      <line x1="612" y1="126" x2="612" y2="152" class="d-line"/>
    </svg>`
  },
  'javafx-scenegraph': {
    title: 'JavaFX Struktur: Stage → Scene → Scene Graph (Parent & Nodes)',
    svg: `<svg viewBox="0 0 680 180" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="15" width="650" height="150" rx="12" class="d-box d-purple"/>
      <text x="35" y="38" class="d-title">Stage (Fenster)</text>
      <rect x="35" y="48" width="610" height="104" rx="10" class="d-box d-accent"/>
      <text x="55" y="70" class="d-title">Scene (Fensterinhalt)</text>
      <rect x="55" y="80" width="570" height="58" rx="8" class="d-box d-green"/>
      <text x="75" y="102" class="d-title">Root-Node (Layout: BorderPane / VBox / HBox / GridPane)</text>
      <rect x="75" y="110" width="120" height="22" rx="4" class="d-box"/><text x="135" y="125" text-anchor="middle" class="d-sub">Label</text>
      <rect x="210" y="110" width="120" height="22" rx="4" class="d-box"/><text x="270" y="125" text-anchor="middle" class="d-sub">TextField</text>
      <rect x="345" y="110" width="120" height="22" rx="4" class="d-box"/><text x="405" y="125" text-anchor="middle" class="d-sub">Button</text>
      <rect x="480" y="110" width="125" height="22" rx="4" class="d-box"/><text x="542" y="125" text-anchor="middle" class="d-sub">Canvas / Shape</text>
    </svg>`
  },
  'dom-tree': {
    title: 'DOM-Baum (Document Object Model) — Musterklausur-Klassiker!',
    svg: `<svg viewBox="0 0 680 215" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <rect x="280" y="8" width="120" height="32" rx="8" class="d-box d-purple"/>
      <text x="340" y="29" text-anchor="middle" class="d-title">&lt;body&gt;</text>
      <line x1="310" y1="40" x2="160" y2="75" class="d-line"/>
      <line x1="370" y1="40" x2="450" y2="75" class="d-line"/>
      <rect x="105" y="75" width="110" height="32" rx="8" class="d-box d-accent"/>
      <text x="160" y="96" text-anchor="middle" class="d-title">&lt;h1&gt;</text>
      <rect x="395" y="75" width="110" height="32" rx="8" class="d-box d-accent"/>
      <text x="450" y="96" text-anchor="middle" class="d-title">&lt;p&gt;</text>
      <line x1="160" y1="107" x2="160" y2="145" class="d-line"/>
      <rect x="95" y="145" width="130" height="32" rx="16" class="d-box d-green"/>
      <text x="160" y="166" text-anchor="middle" class="d-sub">"asdf" (Text)</text>
      <line x1="420" y1="107" x2="310" y2="145" class="d-line"/>
      <line x1="450" y1="107" x2="450" y2="145" class="d-line"/>
      <line x1="480" y1="107" x2="590" y2="145" class="d-line"/>
      <rect x="245" y="145" width="130" height="32" rx="16" class="d-box d-green"/>
      <text x="310" y="166" text-anchor="middle" class="d-sub">"das ist " (Text)</text>
      <rect x="405" y="145" width="90" height="32" rx="8" class="d-box d-accent"/>
      <text x="450" y="166" text-anchor="middle" class="d-title">&lt;em&gt;</text>
      <rect x="520" y="145" width="145" height="32" rx="16" class="d-box d-green"/>
      <text x="592" y="166" text-anchor="middle" class="d-sub">" wichtig!" (Text)</text>
      <line x1="450" y1="177" x2="450" y2="195" class="d-line"/>
      <text x="450" y="210" text-anchor="middle" class="d-label">"sehr" (Textknoten)</text>
    </svg>`
  },
  'css-box-model': {
    title: 'CSS Box-Modell (Margin → Border → Padding → Content)',
    svg: `<svg viewBox="0 0 600 190" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="10" width="520" height="170" rx="12" class="d-box d-orange"/>
      <text x="300" y="29" text-anchor="middle" class="d-label">MARGIN (Außenabstand — transparent)</text>
      <rect x="95" y="38" width="410" height="122" rx="10" class="d-box d-purple"/>
      <text x="300" y="57" text-anchor="middle" class="d-label">BORDER (Rahmenlinie)</text>
      <rect x="150" y="66" width="300" height="74" rx="8" class="d-box d-green"/>
      <text x="300" y="84" text-anchor="middle" class="d-label">PADDING (Innenabstand)</text>
      <rect x="205" y="94" width="190" height="34" rx="6" class="d-box d-accent"/>
      <text x="300" y="116" text-anchor="middle" class="d-title">CONTENT (Inhalt)</text>
    </svg>`
  },
  'http-php-flow': {
    title: 'Client-Server-Architektur: Browser ↔ Apache Webserver ↔ PHP-Prozessor',
    svg: `<svg viewBox="0 0 720 175" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="currentColor"/></marker></defs>
      <rect x="15" y="35" width="155" height="100" rx="10" class="d-box d-accent"/>
      <text x="92" y="68" text-anchor="middle" class="d-title">Browser (Client)</text>
      <text x="92" y="88" text-anchor="middle" class="d-sub">HTML, CSS, JS</text>
      <text x="92" y="108" text-anchor="middle" class="d-sub">Cookies, XHR/Ajax</text>
      <line x1="170" y1="62" x2="280" y2="62" class="d-line" marker-end="url(#arr2)"/>
      <text x="225" y="52" text-anchor="middle" class="d-label">HTTP GET / POST</text>
      <line x1="280" y1="108" x2="170" y2="108" class="d-line" marker-end="url(#arr2)"/>
      <text x="225" y="128" text-anchor="middle" class="d-label">HTTP 200 + HTML/JSON</text>
      <rect x="285" y="35" width="175" height="100" rx="10" class="d-box d-purple"/>
      <text x="372" y="65" text-anchor="middle" class="d-title">Apache Webserver</text>
      <text x="372" y="86" text-anchor="middle" class="d-sub">DocumentRoot: htdocs</text>
      <text x="372" y="106" text-anchor="middle" class="d-sub">Port 80 (HTTP) / 443</text>
      <line x1="460" y1="68" x2="540" y2="68" class="d-line" marker-end="url(#arr2)"/>
      <text x="500" y="58" text-anchor="middle" class="d-label">.php</text>
      <line x1="540" y1="102" x2="460" y2="102" class="d-line" marker-end="url(#arr2)"/>
      <text x="500" y="120" text-anchor="middle" class="d-label">HTML</text>
      <rect x="545" y="35" width="160" height="100" rx="10" class="d-box d-green"/>
      <text x="625" y="65" text-anchor="middle" class="d-title">PHP-Prozessor</text>
      <text x="625" y="86" text-anchor="middle" class="d-sub">$_GET / $_POST</text>
      <text x="625" y="106" text-anchor="middle" class="d-sub">$_COOKIE / preg_*</text>
    </svg>`
  },
  'gpas-email': {
    title: 'GPAS Exam Email Structure (Time: 5% Read • 10% Draft • 80% Write • 5% Proofread)',
    svg: `<svg viewBox="0 0 720 140" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="25" width="160" height="90" rx="10" class="d-box d-accent"/>
      <text x="90" y="55" text-anchor="middle" class="d-title">G — Greeting</text>
      <text x="90" y="77" text-anchor="middle" class="d-sub">Dear Ms Smith,</text>
      <text x="90" y="95" text-anchor="middle" class="d-sub">Hello Rob,</text>
      <rect x="190" y="25" width="160" height="90" rx="10" class="d-box d-purple"/>
      <text x="270" y="55" text-anchor="middle" class="d-title">P — Purpose</text>
      <text x="270" y="77" text-anchor="middle" class="d-sub">Why you write /</text>
      <text x="270" y="95" text-anchor="middle" class="d-sub">Ref to prev. email</text>
      <rect x="370" y="25" width="160" height="90" rx="10" class="d-box d-green"/>
      <text x="450" y="55" text-anchor="middle" class="d-title">A — Action</text>
      <text x="450" y="77" text-anchor="middle" class="d-sub">1 para per point</text>
      <text x="450" y="95" text-anchor="middle" class="d-sub">Info / Indirect Qs</text>
      <rect x="550" y="25" width="160" height="90" rx="10" class="d-box d-orange"/>
      <text x="630" y="55" text-anchor="middle" class="d-title">S — Salutation</text>
      <text x="630" y="77" text-anchor="middle" class="d-sub">Kind regards,</text>
      <text x="630" y="95" text-anchor="middle" class="d-sub">Best wishes, [Name]</text>
    </svg>`
  },
  // Course-specific diagrams live next to the course data (js/data/diagrams-*.js).
  ...GDP1_DIAGRAMS,
  ...GDP2_DIAGRAMS,
  ...ICS_DIAGRAMS,
  ...ENGLISH_DIAGRAMS,
};
