// Additional Dual-Coding diagrams for english (merged into DIAGRAMS in js/engine/diagrams.js).
// Same SVG conventions as js/engine/diagrams.js: class="diagram-svg", d-box/d-accent/d-purple/d-green/d-orange/d-line/d-title/d-sub/d-label.

export const ENGLISH_DIAGRAMS = {
  'eng-indirect-q': {
    title: 'Direct → Indirect Question: polite stem + if/whether or question word + STATEMENT word order',
    svg: `<svg viewBox="0 0 720 230" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="eng-indirect-q-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="currentColor"/></marker></defs>
      <rect x="10" y="20" width="200" height="80" rx="10" class="d-box d-orange"/>
      <text x="110" y="48" text-anchor="middle" class="d-title">Direct (Wh-)</text>
      <text x="110" y="72" text-anchor="middle" class="d-sub">When does the sprint end?</text>
      <line x1="215" y1="60" x2="265" y2="60" class="d-line" marker-end="url(#eng-indirect-q-arrow)"/>
      <rect x="270" y="20" width="440" height="80" rx="10" class="d-box d-green"/>
      <text x="490" y="48" text-anchor="middle" class="d-title">Could you let me know when the sprint ends?</text>
      <text x="490" y="72" text-anchor="middle" class="d-sub">do/does/did disappears · subject before verb</text>
      <rect x="10" y="125" width="200" height="80" rx="10" class="d-box d-orange"/>
      <text x="110" y="153" text-anchor="middle" class="d-title">Direct (Yes/No)</text>
      <text x="110" y="177" text-anchor="middle" class="d-sub">Is the server down?</text>
      <line x1="215" y1="165" x2="265" y2="165" class="d-line" marker-end="url(#eng-indirect-q-arrow)"/>
      <rect x="270" y="125" width="440" height="80" rx="10" class="d-box d-green"/>
      <text x="490" y="153" text-anchor="middle" class="d-title">I was wondering whether the server is down.</text>
      <text x="490" y="177" text-anchor="middle" class="d-sub">add if / whether · statement order · no ? after a statement stem</text>
    </svg>`
  },
  'eng-cloud-stack': {
    title: 'Cloud service models — who manages what? (IaaS → PaaS → SaaS: the provider manages more)',
    svg: `<svg viewBox="0 0 720 220" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="20" width="220" height="180" rx="10" class="d-box d-accent"/>
      <text x="120" y="48" text-anchor="middle" class="d-title">IaaS</text>
      <text x="120" y="72" text-anchor="middle" class="d-sub">Infrastructure as a Service</text>
      <text x="120" y="102" text-anchor="middle" class="d-label">Provider: servers, storage, network</text>
      <text x="120" y="126" text-anchor="middle" class="d-label">You: OS, runtime, apps, data</text>
      <text x="120" y="160" text-anchor="middle" class="d-sub">e.g. AWS EC2, Azure VMs</text>
      <rect x="250" y="20" width="220" height="180" rx="10" class="d-box d-purple"/>
      <text x="360" y="48" text-anchor="middle" class="d-title">PaaS</text>
      <text x="360" y="72" text-anchor="middle" class="d-sub">Platform as a Service</text>
      <text x="360" y="102" text-anchor="middle" class="d-label">Provider: + OS, runtime, tools</text>
      <text x="360" y="126" text-anchor="middle" class="d-label">You: your code + data</text>
      <text x="360" y="160" text-anchor="middle" class="d-sub">e.g. Heroku, Google App Engine</text>
      <rect x="490" y="20" width="220" height="180" rx="10" class="d-box d-green"/>
      <text x="600" y="48" text-anchor="middle" class="d-title">SaaS</text>
      <text x="600" y="72" text-anchor="middle" class="d-sub">Software as a Service</text>
      <text x="600" y="102" text-anchor="middle" class="d-label">Provider: everything</text>
      <text x="600" y="126" text-anchor="middle" class="d-label">You: just use it (browser)</text>
      <text x="600" y="160" text-anchor="middle" class="d-sub">e.g. Microsoft 365, Google Docs</text>
    </svg>`
  }
};
