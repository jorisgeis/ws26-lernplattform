// Additional Dual-Coding diagrams for ics (merged into DIAGRAMS in js/engine/diagrams.js).
// Same SVG conventions as js/engine/diagrams.js: class="diagram-svg", d-box/d-accent/d-purple/d-green/d-orange/d-line/d-title/d-sub/d-label.

export const ICS_DIAGRAMS = {
  'ics-xml-dtd': {
    title: 'XML: Wohlgeformt (well-formed) vs. Gültig (valid gegen DTD)',
    svg: `<svg viewBox="0 0 720 240" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="ics-xml-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="d-line"/></marker></defs>
      <rect x="20" y="20" width="315" height="170" rx="8" class="d-box d-accent"/>
      <text x="177" y="44" text-anchor="middle" class="d-title">1. Wohlgeformt (well-formed)</text>
      <text x="177" y="63" text-anchor="middle" class="d-sub">Erfüllt alle XML-Syntaxregeln:</text>
      <text x="36" y="90" class="d-label">• Genau ein Wurzelelement</text>
      <text x="36" y="110" class="d-label">• Jedes Tag korrekt geschlossen</text>
      <text x="36" y="130" class="d-label">• Korrekt geschachtelt (kein Überlappen)</text>
      <text x="36" y="150" class="d-label">• Groß-/Kleinschreibung konsistent</text>
      <text x="36" y="170" class="d-label">• Attributwerte in Anführungszeichen</text>
      <line x1="335" y1="105" x2="383" y2="105" class="d-line" marker-end="url(#ics-xml-arrow)"/>
      <text x="359" y="95" text-anchor="middle" class="d-sub">+ DTD</text>
      <rect x="385" y="20" width="315" height="170" rx="8" class="d-box d-green"/>
      <text x="542" y="44" text-anchor="middle" class="d-title">2. Gültig (valid)</text>
      <text x="542" y="63" text-anchor="middle" class="d-sub">Wohlgeformt + entspricht seiner DTD:</text>
      <text x="401" y="92" class="d-label">&lt;!ELEMENT Listentitel (#PCDATA)&gt;</text>
      <text x="401" y="112" class="d-sub">Element enthält Textdaten</text>
      <text x="401" y="138" class="d-label">&lt;!ATTLIST Listentitel</text>
      <text x="401" y="156" class="d-label">  kategorie CDATA #IMPLIED&gt;</text>
      <text x="401" y="176" class="d-sub">optionales Attribut (#REQUIRED = Pflicht)</text>
      <text x="20" y="218" class="d-sub">Quantifizierer in DTD: ? (0..1) · * (0..n) · + (1..n) · , (Reihenfolge) · | (Auswahl)</text>
    </svg>`
  },
  'ics-ajax-sequence': {
    title: 'UML-Sequenzdiagramm einer Ajax-Anwendung (XMLHttpRequest)',
    svg: `<svg viewBox="0 0 720 265" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="ics-ajax-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="d-line"/></marker></defs>
      <rect x="30" y="12" width="150" height="36" rx="8" class="d-box d-accent"/>
      <text x="105" y="35" text-anchor="middle" class="d-title">Browser / UI</text>
      <rect x="285" y="12" width="150" height="36" rx="8" class="d-box d-purple"/>
      <text x="360" y="35" text-anchor="middle" class="d-title">JS / XHR-Objekt</text>
      <rect x="540" y="12" width="150" height="36" rx="8" class="d-box d-green"/>
      <text x="615" y="35" text-anchor="middle" class="d-title">Webserver</text>
      <line x1="105" y1="48" x2="105" y2="245" class="d-line" stroke-dasharray="4 4"/>
      <line x1="360" y1="48" x2="360" y2="245" class="d-line" stroke-dasharray="4 4"/>
      <line x1="615" y1="48" x2="615" y2="245" class="d-line" stroke-dasharray="4 4"/>
      <line x1="105" y1="80" x2="358" y2="80" class="d-line" marker-end="url(#ics-ajax-arrow)"/>
      <text x="232" y="73" text-anchor="middle" class="d-label">1. Benutzer-Event (z. B. Klick)</text>
      <line x1="360" y1="115" x2="613" y2="115" class="d-line" marker-end="url(#ics-ajax-arrow)"/>
      <text x="487" y="108" text-anchor="middle" class="d-label">2. open() + send() (asynchron HTTP)</text>
      <rect x="35" y="124" width="140" height="28" rx="6" class="d-box d-orange"/>
      <text x="105" y="142" text-anchor="middle" class="d-sub">UI bleibt bedienbar!</text>
      <line x1="615" y1="168" x2="362" y2="168" class="d-line" stroke-dasharray="5 3" marker-end="url(#ics-ajax-arrow)"/>
      <text x="487" y="161" text-anchor="middle" class="d-label">3. HTTP-Antwort (JSON / XML / Text)</text>
      <line x1="360" y1="212" x2="107" y2="212" class="d-line" marker-end="url(#ics-ajax-arrow)"/>
      <text x="232" y="205" text-anchor="middle" class="d-label">4. onreadystatechange → DOM-Update</text>
      <text x="20" y="258" class="d-sub">Fertig-Prüfung im Callback: xhr.readyState === 4 &amp;&amp; xhr.status === 200 (Daten in xhr.responseText)</text>
    </svg>`
  },
  'ics-http-messages': {
    title: 'HTTP/1.1-Anfragen: GET vs. POST mit Formulardaten & Header',
    svg: `<svg viewBox="0 0 720 245" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="16" width="330" height="192" rx="8" class="d-box d-accent"/>
      <text x="185" y="40" text-anchor="middle" class="d-title">HTTP GET (Daten im URL)</text>
      <text x="35" y="68" class="d-label">GET /suche.php?plz=26723&amp;ort=Emden HTTP/1.1</text>
      <text x="35" y="88" class="d-label">Host: www.abc.de</text>
      <text x="35" y="108" class="d-label">Cookie: sid=4711</text>
      <text x="35" y="128" class="d-sub">(Leerzeile · KEIN Body)</text>
      <text x="35" y="158" class="d-sub">• Kein Content-Type / Content-Length nötig</text>
      <text x="35" y="176" class="d-sub">• Parameter sichtbar in URL &amp; Verlauf</text>
      <text x="35" y="194" class="d-sub">• Lesezugriff (idempotent, bookmarkbar)</text>
      <rect x="370" y="16" width="330" height="192" rx="8" class="d-box d-green"/>
      <text x="535" y="40" text-anchor="middle" class="d-title">HTTP POST (Daten im Body)</text>
      <text x="385" y="68" class="d-label">POST /data/input.php HTTP/1.1</text>
      <text x="385" y="88" class="d-label">Host: www.technik-emden.de</text>
      <text x="385" y="108" class="d-label">Content-Type: application/x-www-form-urlencoded</text>
      <text x="385" y="128" class="d-label">Content-Length: 32</text>
      <text x="385" y="148" class="d-sub">(Leerzeile trennt Header &amp; Body)</text>
      <text x="385" y="168" class="d-title">customerID=34aE2&amp;requestDate=16.02.2024</text>
      <text x="385" y="194" class="d-sub">• Server setzt Cookies via Header Set-Cookie</text>
      <text x="20" y="232" class="d-sub">Musterklausur 5c/5f: GET hat keinen Body → kein Content-Type; POST überträgt Formulardaten im Rumpf.</text>
    </svg>`
  },
  'ics-url-parts': {
    title: 'Aufbau eines URL (Uniform Resource Locator)',
    svg: `<svg viewBox="0 0 720 205" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="34" width="95" height="46" rx="8" class="d-box d-purple"/>
      <text x="67" y="62" text-anchor="middle" class="d-title">https://</text>
      <rect x="125" y="34" width="165" height="46" rx="8" class="d-box d-accent"/>
      <text x="207" y="62" text-anchor="middle" class="d-title">m.bits101.de</text>
      <rect x="300" y="34" width="78" height="46" rx="8" class="d-box d-orange"/>
      <text x="339" y="62" text-anchor="middle" class="d-title">:9155</text>
      <rect x="388" y="34" width="142" height="46" rx="8" class="d-box d-green"/>
      <text x="459" y="62" text-anchor="middle" class="d-title">/comp/tre12.pru</text>
      <rect x="540" y="34" width="160" height="46" rx="8" class="d-box"/>
      <text x="620" y="62" text-anchor="middle" class="d-title">?plz=26723&amp;ort=…</text>
      <text x="67" y="106" text-anchor="middle" class="d-label">Protokoll</text>
      <text x="67" y="122" text-anchor="middle" class="d-sub">(Schema)</text>
      <text x="207" y="106" text-anchor="middle" class="d-label">Host / Domain</text>
      <text x="207" y="122" text-anchor="middle" class="d-sub">(DNS → IP)</text>
      <text x="339" y="106" text-anchor="middle" class="d-label">Port</text>
      <text x="339" y="122" text-anchor="middle" class="d-sub">(optional)</text>
      <text x="459" y="106" text-anchor="middle" class="d-label">Pfad / Ressource</text>
      <text x="459" y="122" text-anchor="middle" class="d-sub">(auf Webserver)</text>
      <text x="620" y="106" text-anchor="middle" class="d-label">Query-String</text>
      <text x="620" y="122" text-anchor="middle" class="d-sub">? Start, &amp; Trenner</text>
      <text x="20" y="162" class="d-sub">Standard-Ports: HTTP = 80 · HTTPS = 443 · Trenner: „?“ vor 1. Parameter, „&amp;“ zwischen weiteren Parametern</text>
      <text x="20" y="182" class="d-sub">Musterklausur 5a/5e: serdat://m.bits101.de:9155/comp/tre12.pru</text>
    </svg>`
  }
};
