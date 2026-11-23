// StudyOS WS26 — "Schreibtisch" variant.
// A tactile study desk: Karteikasten, Klemmbrett, Ordner, Briefblock, Spickzettel, Wandkalender,
// Handbuch and a tomato kitchen timer. MacBook: spatial desk + focused workspace with side drawer.
// Phone: stacked drawer of desk objects, full-screen objects with back button and a bottom shelf.

import {
  COURSES_META, ENGLISH_DATA, DIAGRAMS, store, getCardStatus,
  ALL_DATA, ALL_QUIZZES, ALL_CHAPTERS,
  courseMeta, escapeHtml, pdfHref,
  buildFlashcardQueue, rateCard, intervalsFor, RATING_LABELS, cardStats,
  buildQuizQueue, CONFIDENCE_LEVELS, submitQuiz, calibrationStats,
  getCourseMastery, overallMastery, todayProgress, activityHistory, streakLabel,
  allDeadlines, formatDate, daysLeftLabel,
  getFeynman, saveFeynmanText, toggleFeynmanPoint,
  togglePinChapter, loadCoursePins, clearPins,
  analyzeEmail, downloadBackup, importBackup, resetProgress,
  Pomodoro,
} from '../shared/core.js';

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const mainEl = $('#main');
const drawerEl = $('#drawer');
const topbarEl = $('#topbar');
const shelfEl = $('#shelf');
const toastsEl = $('#toasts');

const mqDesk = matchMedia('(min-width: 1024px)');
const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');

/** Escaped plain text; `backtick` spans become inline code. Line breaks are kept via CSS (pre-line). */
const rich = (s) => escapeHtml(s).replace(/`([^`\n]+)`/g, '<code>$1</code>');

const STORAGE_KEY = 'ws26_lernplattform_v1';
const DRAFTS_KEY = 'ws26_schreibtisch_drafts';

const ICONS = {
  desk: '<path d="M3 9.5h18"/><path d="M5 9.5V20M19 9.5V20"/><path d="M5 14.5h6v5.5"/><path d="M8.5 9.5V6.5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v3"/>',
  box: '<path d="M3 10.5h18v8.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M6 10.5V5.5h8v5M10 10.5V7.5h8v3"/><path d="M10 15h4"/>',
  clip: '<rect x="5" y="4.5" width="14" height="16.5" rx="1.8"/><path d="M9 4.5V3.2h6v1.3a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"/><path d="m8.5 11.5 1.6 1.6 3.2-3.2M8.5 17h7"/>',
  binder: '<rect x="5" y="3" width="13.5" height="18" rx="1.5"/><path d="M9 3v18"/><circle cx="13.7" cy="16" r="1.6"/><path d="M11.7 6.5h4v3.2h-4z"/>',
  letter: '<rect x="3" y="5.5" width="18" height="13.5" rx="1.5"/><path d="m3.6 6.5 8.4 6.6 8.4-6.6"/>',
  sheet: '<path d="M6 3h8.5L19 7.5V21H6z"/><path d="M14.5 3v4.5H19M9 11.5h7M9 14.5h7M9 17.5h4.5"/>',
  cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="1.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4M8 13.5h2M14 13.5h2M8 17h2"/>',
  book: '<path d="M5 4.6A1.6 1.6 0 0 1 6.6 3H19v15H6.6A1.6 1.6 0 0 0 5 19.6z"/><path d="M5 19.6A1.6 1.6 0 0 0 6.6 21H19v-3"/><path d="M9 7h6.5"/>',
  tomato: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 6V3.3"/><path d="m8.6 5.6 3.4 1.2 3.4-1.2"/>',
  lamp: '<path d="M7.5 21h9M12 21v-5.5"/><path d="m12 15.5-3.2-5.3 4-4"/><path d="m12.8 6.2 5.6 5.6-3.7 1-2.9-2.9z"/>',
  back: '<path d="m14.5 5-7 7 7 7"/>',
  print: '<path d="M7 9V3.5h10V9"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v6.5H7z"/>',
  pin: '<path d="M12 16.5V22"/><path d="M8.5 3h7l-1.2 6.2 3.2 3.3v2H6.5v-2l3.2-3.3z"/>',
  download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17"/>',
  upload: '<path d="M12 15V3"/><path d="m7 8 5-5 5 5"/><path d="M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17"/>',
  trash: '<path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7"/><path d="M9 7V4h6v3"/>',
  play: '<path d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l10.6-6.8a.8.8 0 0 0 0-1.4L9.2 4.5A.8.8 0 0 0 8 5.2z" fill="currentColor" stroke="none"/>',
  pause: '<rect x="6.5" y="5" width="4" height="14" rx="1.2" fill="currentColor" stroke="none"/><rect x="13.5" y="5" width="4" height="14" rx="1.2" fill="currentColor" stroke="none"/>',
  reset: '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5"/><path d="M3.5 3.5v5h5"/>',
  shuffle: '<path d="M3 7h3.5c2 0 3.2 1 4.3 2.6l2.4 3.8c1.1 1.6 2.3 2.6 4.3 2.6H21"/><path d="M3 17h3.5c1.3 0 2.2-.4 3-1.1M14.5 8.1c.8-.7 1.7-1.1 3-1.1H21"/><path d="m18 4 3 3-3 3M18 14l3 3-3 3"/>',
  ext: '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
};
const icon = (name, cls = '') =>
  `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

const OBJECTS = [
  { id: 'tisch', href: '#/', label: 'Schreibtisch', short: 'Tisch', icon: 'desk', key: 'd' },
  { id: 'kasten', href: '#/kasten', label: 'Karteikasten', short: 'Kasten', icon: 'box', key: 'k', count: 'due' },
  { id: 'klausur', href: '#/klausur', label: 'Klausurbogen', short: 'Klausur', icon: 'clip', key: 'q' },
  { id: 'ordner', href: '#/ordner', label: 'Kursordner', short: 'Ordner', icon: 'binder', key: 'o' },
  { id: 'brief', href: '#/brief', label: 'Briefblock', short: 'Brief', icon: 'letter', key: 'e' },
  { id: 'blatt', href: '#/blatt', label: 'Spickzettel', short: 'Spicker', icon: 'sheet', key: 's', count: 'pins' },
  { id: 'kalender', href: '#/kalender', label: 'Wandkalender', short: 'Kalender', icon: 'cal', key: 'c' },
  { id: 'methoden', href: '#/methoden', label: 'Handbuch', short: 'Handbuch', icon: 'book', key: 'm' },
  { id: 'wecker', href: '#/wecker', label: 'Küchenwecker', short: 'Wecker', icon: 'tomato', key: 'w' },
];
const SHELF = ['tisch', 'kasten', 'klausur', 'ordner', 'brief', 'blatt'];

const FACH = [
  { status: 'new', label: 'Neu', hint: 'noch nie gelernt' },
  { status: 'due', label: 'Fällig', hint: 'heute wiederholen' },
  { status: 'learning', label: 'Im Lernen', hint: 'Intervall < 14 Tage' },
  { status: 'mastered', label: 'Gemeistert', hint: 'Intervall ≥ 14 Tage' },
];

const CHAPTER_BY_ID = new Map(ALL_CHAPTERS.map(ch => [ch.id, ch]));
const PROMPTS = ENGLISH_DATA.emailPrompts;

const dueCount = (course = 'all') => { const s = cardStats(course); return s.new + s.due; };
const courseDot = (c) => `<span class="dot" style="--c:${c.color}" aria-hidden="true"></span>`;
const courseTag = (id) => { const m = courseMeta(id); return `<span class="tag" style="--c:${m.color}"><span aria-hidden="true">${m.icon}</span> ${escapeHtml(m.short)}</span>`; };
const isTyping = (el) => !!(el && el.closest && el.closest('textarea, select, [contenteditable="true"], input:not([type="checkbox"]):not([type="radio"]):not([type="file"])'));

/* ------------------------------------------------------------------ */
/* Theme (daylight oak / evening desk lamp)                             */
/* ------------------------------------------------------------------ */

if (localStorage.getItem(STORAGE_KEY) === null) {
  // Nothing stored yet: follow the system instead of the store's hard 'dark' default (not persisted).
  store.state.theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme() {
  const dark = store.state.theme === 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  for (const m of $$('meta[name="theme-color"]')) m.setAttribute('content', dark ? '#1d130b' : '#b98a55');
  for (const b of $$('[data-act="theme"]')) {
    b.setAttribute('aria-pressed', String(dark));
    b.title = dark ? 'Lampe aus – Tageslicht (L)' : 'Lampe an – Abendmodus (L)';
  }
}

const lampBtn = () => `<button class="lamp-btn" type="button" data-act="theme" aria-label="Schreibtischlampe: Hell- und Dunkelmodus umschalten">${icon('lamp')}<span class="lamp-glow" aria-hidden="true"></span></button>`;

/* ------------------------------------------------------------------ */
/* Toasts                                                               */
/* ------------------------------------------------------------------ */

function toast(msg, kind = '') {
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.textContent = msg;
  toastsEl.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, 3200);
}

/* ------------------------------------------------------------------ */
/* Pomodoro — tomato kitchen timer                                     */
/* ------------------------------------------------------------------ */

const pomo = new Pomodoro({
  onChange: () => updatePomo(),
  onFinish: (m) => {
    toast(`Wecker klingelt: ${m} Minuten Fokus eingetragen. Kurze Pause!`, 'ok');
    if (navigator.vibrate) navigator.vibrate([180, 80, 180]);
    if (ui.route.view === 'tisch' || ui.route.view === 'wecker') render();
  },
});
let dialDrag = null;

function tomatoDial(size, label = 'Küchenwecker') {
  let nums = '';
  for (let m = 0; m < 60; m += 5) nums += `<span class="tick" style="--a:${-m * 6}deg"><b>${m}</b></span>`;
  return `
    <div class="tomato" data-dial role="button" tabindex="0" style="--size:${size}px"
         aria-label="${label}: tippen startet oder pausiert, im Uhrzeigersinn drehen zieht auf 25 oder 50 Minuten auf">
      <span class="tomato-body"></span>
      <span class="tomato-ring"></span>
      <span class="tomato-sweep" data-pomo-sweep></span>
      <span class="tomato-face" data-pomo-face>${nums}</span>
      <span class="tomato-cap"><span class="tomato-leaves"></span></span>
      <span class="tomato-marker"></span>
    </div>`;
}

const pomoStateText = () => pomo.running
  ? `läuft · ${pomo.mode}-Minuten-Block`
  : pomo.seconds === pomo.mode * 60 ? `bereit · ${pomo.mode} Minuten` : `pausiert · ${pomo.mode}-Minuten-Block`;

function updatePomo(previewMinutes = null) {
  const remainingMin = previewMinutes ?? pomo.seconds / 60;
  const deg = remainingMin * 6;
  for (const f of $$('[data-pomo-face]')) {
    f.style.setProperty('--rot', `${deg}deg`);
    f.classList.toggle('dragging', previewMinutes !== null);
  }
  for (const s of $$('[data-pomo-sweep]')) s.style.setProperty('--sweep', `${deg}deg`);
  for (const d of $$('[data-dial]')) d.classList.toggle('running', pomo.running);
  for (const t of $$('[data-pomo-time]')) t.textContent = previewMinutes !== null ? `→ ${previewMinutes >= 37.5 ? 50 : 25}:00` : pomo.display;
  for (const s of $$('[data-pomo-state]')) s.textContent = pomoStateText();
  for (const b of $$('[data-pomo-toggle]')) {
    b.innerHTML = pomo.running ? `${icon('pause')}<span>Pause</span>` : `${icon('play')}<span>${pomo.seconds === pomo.mode * 60 ? 'Start' : 'Weiter'}</span>`;
    b.setAttribute('aria-pressed', String(pomo.running));
  }
  for (const b of $$('[data-pomo-mode]')) b.textContent = `Auf ${pomo.mode === 25 ? 50 : 25} Min. wechseln`;
  for (const c of $$('[data-pomo-chip]')) {
    c.classList.toggle('running', pomo.running);
    c.querySelector('span').textContent = pomo.display;
  }
}

function dialAngle(e) {
  const a = Math.atan2(e.clientX - dialDrag.cx, -(e.clientY - dialDrag.cy)) * 180 / Math.PI;
  return (a + 360) % 360;
}

document.addEventListener('pointerdown', (e) => {
  const dial = e.target.closest('[data-dial]');
  if (!dial || e.button > 0) return;
  const r = dial.getBoundingClientRect();
  dialDrag = { dial, cx: r.left + r.width / 2, cy: r.top + r.height / 2, x0: e.clientX, y0: e.clientY, moved: false, acc: 0, start: pomo.seconds / 60, minutes: pomo.seconds / 60 };
  dialDrag.last = dialAngle(e);
  dial.setPointerCapture(e.pointerId);
});
document.addEventListener('pointermove', (e) => {
  if (!dialDrag) return;
  if (!dialDrag.moved && Math.hypot(e.clientX - dialDrag.x0, e.clientY - dialDrag.y0) < 10) return;
  dialDrag.moved = true;
  const a = dialAngle(e);
  let delta = a - dialDrag.last;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  dialDrag.last = a;
  dialDrag.acc += delta;
  dialDrag.minutes = Math.max(0, Math.min(60, dialDrag.start + dialDrag.acc / 6));
  updatePomo(dialDrag.minutes);
});
function endDial(e, cancelled) {
  if (!dialDrag) return;
  const d = dialDrag;
  dialDrag = null;
  if (cancelled) { updatePomo(); return; }
  if (!d.moved) { pomo.toggle(); return; }
  if (d.minutes < 2) { pomo.reset(); toast('Wecker zurückgedreht.'); return; }
  const target = d.minutes >= 37.5 ? 50 : 25;
  if (pomo.mode !== target) pomo.switchMode(); else pomo.reset();
  pomo.toggle();
  toast(`Aufgezogen: ${target} Minuten Fokus laufen.`);
}
document.addEventListener('pointerup', (e) => endDial(e, false));
document.addEventListener('pointercancel', (e) => endDial(e, true));

const pomoChip = () => `<a class="pomo-chip" href="#/wecker" data-pomo-chip aria-label="Küchenwecker öffnen">${icon('tomato')}<span>${pomo.display}</span></a>`;

/* ------------------------------------------------------------------ */
/* Session state                                                        */
/* ------------------------------------------------------------------ */

function loadDrafts() {
  try { return JSON.parse(localStorage.getItem(DRAFTS_KEY) || '{}'); } catch { return {}; }
}

const ui = {
  route: { view: 'tisch', a: null, b: null },
  fc: null,
  qz: null,
  promptIdx: 0,
  drafts: loadDrafts(),
};

function startCards(course, { includeAll = false, status = null } = {}) {
  let queue = buildFlashcardQueue(course, includeAll || status === 'learning' || status === 'mastered');
  if (status) queue = queue.filter(c => getCardStatus(store.state.cards[c.id]) === status);
  const fach = FACH.find(f => f.status === status);
  ui.fc = {
    course, queue, idx: 0, revealed: false, flipped: false, done: 0,
    label: fach ? `Fach „${fach.label}“` : includeAll ? 'Alle Karten' : 'Fällige Karten',
  };
}

function startQuiz(course) {
  ui.qz = { course, queue: buildQuizQueue(course), idx: 0, sel: null, conf: 'medium', res: null, right: 0, answered: 0 };
}

/* ------------------------------------------------------------------ */
/* Desk (overview)                                                      */
/* ------------------------------------------------------------------ */

const ROT = [-2.4, 1.6, -1.1, 2.2, -1.7, 1.1, -0.6, 1.9];

function deadlineNote(d, i) {
  const urgent = d.urgent || d.daysLeft <= 3;
  return `
    <li><a class="note${urgent ? ' urgent' : ''}" href="#/ordner/${d.courseId}" style="--c:${d.color};--r:${ROT[i % ROT.length]}deg">
      <span class="pin" aria-hidden="true"></span>
      <b class="note-when">${daysLeftLabel(d.daysLeft)}</b>
      <span class="note-date">${formatDate(d.date)}${urgent ? ' · dringend' : ''}</span>
      <span class="note-text">${escapeHtml(d.label)}</span>
      <span class="note-course">${escapeHtml(d.courseShort)}</span>
    </a></li>`;
}

function kastenArt(course, { compact = false } = {}) {
  const st = cardStats(course);
  return `
    <div class="kasten${compact ? ' compact' : ''}">
      <div class="kasten-inside">
        ${FACH.map(f => {
          const n = st[f.status];
          const stack = Math.min(n, compact ? 6 : 12);
          return `<button class="fach fach-${f.status}" type="button" data-act="fach" data-status="${f.status}" data-course="${course}" ${n ? '' : 'disabled'}
              aria-label="Fach ${f.label}: ${n} ${n === 1 ? 'Karte' : 'Karten'}${n ? ' – jetzt üben' : ''}">
            <span class="fach-tab">${f.label}</span>
            <span class="fach-cards" aria-hidden="true">${'<i></i>'.repeat(stack)}</span>
            <span class="fach-n">${n}</span>
          </button>`;
        }).join('')}
      </div>
      <div class="kasten-front"><span class="kasten-plate">${st.total} Karten · ${st.mastered} gemeistert</span><span class="kasten-grip" aria-hidden="true"></span></div>
    </div>`;
}

function binderSpine(c, big = false) {
  const m = getCourseMastery(c.id);
  const due = dueCount(c.id);
  return `
    <a class="spine${big ? ' big' : ''}" href="#/ordner/${c.id}" style="--c:${c.color}"
       aria-label="Ordner ${escapeHtml(c.title)}: ${m}% gemeistert, ${due} Karten fällig">
      <span class="spine-label"><b>${escapeHtml(c.short)}</b><small>${m}%</small></span>
      <span class="spine-title">${escapeHtml(c.title)}</span>
      ${due ? `<span class="spine-due">${due} fällig</span>` : ''}
      <span class="spine-hole" aria-hidden="true"></span>
    </a>`;
}

function viewDesk() {
  const st = cardStats('all');
  const due = st.new + st.due;
  const tp = todayProgress();
  const dls = allDeadlines();
  const pins = store.state.pinnedCheatSheet;
  const hist = activityHistory(7);
  const maxH = Math.max(1, ...hist.map(h => h.total));
  const answered = Object.keys(store.state.quizHistory).length;
  const prompt = PROMPTS[ui.promptIdx];
  const draftWords = (ui.drafts[prompt.id] || '').trim() ? (ui.drafts[prompt.id] || '').trim().split(/\s+/).length : 0;

  const main = `
  <div class="desk">
    <header class="desk-head">
      <div class="nameplate"><span class="screw" aria-hidden="true"></span><h1><strong>StudyOS</strong><span>Schreibtisch · WS 26/27</span></h1><span class="screw" aria-hidden="true"></span></div>
      <div class="desk-tools">${pomoChip()}${lampBtn()}</div>
    </header>

    <div class="desk-grid">
      <section class="obj obj-pad" aria-labelledby="pad-h">
        <div class="legal-pad">
          <h2 id="pad-h" class="hand">Heute</h2>
          <p class="pad-due"><b>${due}</b> ${due === 1 ? 'Karte' : 'Karten'} fällig</p>
          <div class="pad-bar" role="progressbar" aria-label="Tagesziel" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${tp.pct}"><i style="width:${tp.pct}%"></i></div>
          <p class="pad-sub">${tp.done}/${tp.goal} geschafft · Serie: <b>${streakLabel()}</b>${tp.minutes ? ` · ${tp.minutes} Min. Fokus` : ''}</p>
          <div class="pad-week" role="img" aria-label="Aktivität der letzten 7 Tage: ${hist.map(h => `${h.weekday} ${h.total}`).join(', ')}">
            ${hist.map(h => `<span><i style="height:${Math.round((h.total / maxH) * 100)}%"></i><small>${h.weekday}</small></span>`).join('')}
          </div>
          <button class="btn btn-stamp" type="button" data-act="start-mixed">${icon('shuffle')}<span>Gemischte Session starten</span></button>
        </div>
      </section>

      <section class="obj obj-kasten" aria-labelledby="kasten-h">
        <h2 id="kasten-h" class="obj-title"><a href="#/kasten">Karteikasten</a></h2>
        ${kastenArt('all')}
        <div class="obj-actions">
          <button class="btn btn-primary" type="button" data-act="draw" data-course="all">Karte ziehen${due ? ` · ${due}` : ''}</button>
          <a class="btn btn-wood" href="#/kasten">Kasten öffnen</a>
        </div>
      </section>

      <section class="obj obj-board" aria-labelledby="board-h">
        <div class="cork">
          <h2 id="board-h" class="board-title">Pinnwand · Fristen</h2>
          ${dls.length ? `<ul class="notes">${dls.slice(0, 6).map(deadlineNote).join('')}</ul>` : '<p class="board-empty">Keine anstehenden Fristen.</p>'}
          <a class="board-more" href="#/kalender">Wandkalender · ${dls.length} Termine ${icon('chevron')}</a>
        </div>
      </section>

      <a class="obj obj-link obj-clip" href="#/klausur">
        <span class="art art-clip" aria-hidden="true"><span class="clip-board"><span class="clip-metal"></span><span class="clip-paper"><b>Klausur</b><i></i><i></i><i></i><em>☒ A&nbsp;&nbsp;☐ B&nbsp;&nbsp;☐ C</em><i></i><i></i></span></span></span>
        <span class="obj-label"><b>Klausurbogen</b><small>${ALL_QUIZZES.length} Aufgaben · ${answered} bearbeitet</small></span>
        ${icon('chevron', 'row-chev')}
      </a>

      <section class="obj obj-binders" aria-labelledby="binders-h">
        <h2 id="binders-h" class="obj-title"><a href="#/ordner">Kursordner</a></h2>
        <div class="binder-row">${COURSES_META.map(c => binderSpine(c)).join('')}</div>
        <p class="obj-note">Ø ${overallMastery()}% gemeistert</p>
      </section>

      <a class="obj obj-link obj-letter" href="#/brief">
        <span class="art art-letter" aria-hidden="true"><span class="letter-pad"><span class="stamp">GB</span><em>Dear Ms Miller,</em><i></i><i></i><i></i><i></i><em class="sig">Kind regards</em></span></span>
        <span class="obj-label"><b>Briefblock</b><small>GPAS Email Coach${draftWords ? ` · Entwurf ${draftWords} Wörter` : ''}</small></span>
        ${icon('chevron', 'row-chev')}
      </a>

      <a class="obj obj-link obj-a4" href="#/blatt">
        <span class="art art-a4" aria-hidden="true"><span class="a4-mini"><b>Spickzettel</b>${pins.slice(0, 10).map(() => '<i></i>').join('')}${pins.length ? '' : '<em>leer</em>'}</span></span>
        <span class="obj-label"><b>Spickzettel</b><small>DIN A4 · ${pins.length} ${pins.length === 1 ? 'Thema' : 'Themen'} angepinnt</small></span>
        ${icon('chevron', 'row-chev')}
      </a>

      <a class="obj obj-link obj-book" href="#/methoden">
        <span class="art art-book" aria-hidden="true"><span class="book-cover"><b>Lern&shy;methoden</b><small>Handbuch</small></span></span>
        <span class="obj-label"><b>Handbuch</b><small>5 Methoden · Sicherung · Tastatur</small></span>
        ${icon('chevron', 'row-chev')}
      </a>

      <section class="obj obj-timer" aria-labelledby="timer-h">
        ${tomatoDial(132)}
        <div class="timer-side">
          <h2 id="timer-h" class="obj-title"><a href="#/wecker">Küchenwecker</a></h2>
          <p class="timer-time" data-pomo-time>${pomo.display}</p>
          <p class="timer-state" data-pomo-state></p>
          <div class="row"><button class="btn btn-primary" type="button" data-act="pomo-toggle" data-pomo-toggle></button></div>
        </div>
      </section>
    </div>
    <p class="desk-hint">Tasten: <kbd>K</kbd> Kasten · <kbd>Q</kbd> Klausur · <kbd>O</kbd> Ordner · <kbd>E</kbd> Brief · <kbd>S</kbd> Spickzettel · <kbd>C</kbd> Kalender · <kbd>M</kbd> Handbuch · <kbd>W</kbd> Wecker · <kbd>P</kbd> Start/Pause · <kbd>L</kbd> Lampe</p>
  </div>`;
  return { title: 'Schreibtisch', main };
}

/* ------------------------------------------------------------------ */
/* Karteikasten (spaced repetition)                                     */
/* ------------------------------------------------------------------ */

function cardsCtx() {
  const f = ui.fc;
  const remaining = Math.max(0, f.queue.length - f.idx);
  return `
    <div class="ctx-group">
      <h3 class="ctx-h">Kurs</h3>
      <div class="ctx-list" role="group" aria-label="Kursfilter Karteikarten">
        <button class="ctx-item" type="button" data-act="fc-course" data-course="all" aria-pressed="${f.course === 'all'}">${icon('shuffle')}<span>Alle · gemischt</span><span class="ctx-n">${dueCount('all')}</span></button>
        ${COURSES_META.map(c => `<button class="ctx-item" type="button" data-act="fc-course" data-course="${c.id}" aria-pressed="${f.course === c.id}">${courseDot(c)}<span>${escapeHtml(c.short)}</span><span class="ctx-n">${dueCount(c.id)}</span></button>`).join('')}
      </div>
    </div>
    <div class="ctx-group ctx-desk-only">
      <h3 class="ctx-h">Fächer · ${f.course === 'all' ? 'alle Kurse' : escapeHtml(courseMeta(f.course).short)}</h3>
      ${kastenArt(f.course, { compact: true })}
    </div>
    <div class="ctx-group ctx-desk-only">
      <h3 class="ctx-h">Sitzung</h3>
      <p class="ctx-text">${f.label}: <b>${f.done}</b> bewertet, <b>${remaining}</b> im Stapel.</p>
      <p class="ctx-text small"><kbd>Leertaste</kbd> umdrehen · <kbd>1</kbd>–<kbd>4</kbd> bewerten</p>
    </div>`;
}

function cardActions(card) {
  const f = ui.fc;
  if (!f.revealed) {
    return `<button class="btn btn-primary btn-big" type="button" data-act="reveal">Karte umdrehen <kbd>Leertaste</kbd></button>`;
  }
  const iv = intervalsFor(card);
  return `<div class="rate-row" role="group" aria-label="Wie gut wusstest du es?">
    ${RATING_LABELS.map(r => `<button class="rate rate-${r.value}" type="button" data-act="rate" data-r="${r.value}"><b>${r.label}</b><small>${iv[r.value]}</small><kbd>${r.key}</kbd></button>`).join('')}
  </div>`;
}

function viewKasten() {
  if (!ui.fc) startCards('all');
  const f = ui.fc;
  const card = f.queue[f.idx];
  let main;
  if (!card) {
    const st = cardStats(f.course);
    main = `
      <div class="empty-kasten paper-sheet">
        <div class="empty-box" aria-hidden="true"><span></span></div>
        <h2>${f.done ? 'Stapel geschafft!' : 'Dieses Fach ist leer'}</h2>
        <p>${f.done ? `${f.done} ${f.done === 1 ? 'Karte' : 'Karten'} bewertet. ` : ''}${dueCount(f.course) ? `Es warten noch ${dueCount(f.course)} fällige Karten.` : `Keine fälligen Karten ${f.course === 'all' ? 'im ganzen Kasten' : `in ${escapeHtml(courseMeta(f.course).short)}`}. ${st.learning + st.mastered} Karten ruhen im Intervall.`}</p>
        <div class="row center">
          ${dueCount(f.course) ? `<button class="btn btn-primary" type="button" data-act="draw" data-course="${f.course}">Fällige Karten ziehen</button>` : ''}
          <button class="btn ${dueCount(f.course) ? '' : 'btn-primary'}" type="button" data-act="all-cards">Alle Karten nochmal üben</button>
          <button class="btn" type="button" data-act="goto-quiz" data-course="${f.course}">Zum Klausurbogen</button>
        </div>
      </div>`;
  } else {
    const remaining = f.queue.length - f.idx;
    const ch = CHAPTER_BY_ID.get(card.chapterId);
    main = `
      <div class="study">
        <p class="study-meta">
          ${courseTag(card.courseId)}
          ${card.examRelevant ? '<span class="stamp-red">Klausurrelevant</span>' : ''}
          <span class="study-count">${f.label} · noch ${remaining}</span>
        </p>
        <div class="card-stack" style="--depth:${Math.min(remaining - 1, 3)}">
          <div class="index-card${f.flipped ? ' flipped' : ''}" data-act="flip" id="index-card">
            <div class="ic-face ic-front" aria-hidden="${f.flipped}">
              <span class="ic-head"><span>Frage</span><span class="ic-ch">${ch ? escapeHtml(ch.title) : ''}</span></span>
              <p class="ic-text">${rich(card.front)}</p>
              <span class="ic-foot">${f.revealed ? 'Tippen: Antwort zeigen' : 'Erst selbst erinnern – dann umdrehen'}</span>
            </div>
            <div class="ic-face ic-back" aria-hidden="${!f.flipped}">
              <span class="ic-head"><span>Antwort</span><span class="ic-ch">${escapeHtml(courseMeta(card.courseId).short)}</span></span>
              <p class="ic-text">${f.revealed ? rich(card.back) : ''}</p>
              <span class="ic-foot">Tippen: Frage zeigen</span>
            </div>
          </div>
        </div>
        <div class="study-actions" id="study-actions">${cardActions(card)}</div>
      </div>`;
  }
  return { title: 'Karteikasten', ctx: cardsCtx(), main, actionbar: !!card };
}

function reveal() {
  const f = ui.fc;
  const card = f && f.queue[f.idx];
  if (!card || f.revealed) return;
  f.revealed = true;
  f.flipped = true;
  const el = $('#index-card');
  if (el) {
    $('.ic-back .ic-text', el).innerHTML = rich(card.back);
    $('.ic-front .ic-foot', el).textContent = 'Tippen: Antwort zeigen';
    el.classList.add('flipped');
    $('.ic-front', el).setAttribute('aria-hidden', 'true');
    $('.ic-back', el).setAttribute('aria-hidden', 'false');
  }
  const act = $('#study-actions');
  if (act) {
    act.innerHTML = cardActions(card);
    if (document.activeElement === document.body || document.activeElement?.dataset.act === 'reveal') $('.rate-3', act)?.focus({ preventScroll: true });
  }
}

function flip() {
  const f = ui.fc;
  if (!f.revealed) { reveal(); return; }
  f.flipped = !f.flipped;
  const el = $('#index-card');
  el.classList.toggle('flipped', f.flipped);
  $('.ic-front', el).setAttribute('aria-hidden', String(f.flipped));
  $('.ic-back', el).setAttribute('aria-hidden', String(!f.flipped));
}

function rate(r) {
  const f = ui.fc;
  const card = f && f.queue[f.idx];
  if (!card || !f.revealed) return;
  if (rateCard(card, r)) {
    f.queue.push(card);
    toast('Nochmal: Die Karte kommt hinten in den Stapel.');
  }
  f.idx += 1;
  f.done += 1;
  f.revealed = false;
  f.flipped = false;
  render();
  $('#index-card')?.classList.add('drawn');
}

/* ------------------------------------------------------------------ */
/* Klausurbogen (quiz)                                                  */
/* ------------------------------------------------------------------ */

function quizCtx() {
  const z = ui.qz;
  const cal = calibrationStats();
  const calRow = (lvl) => {
    const c = cal[lvl.value];
    const pct = c.n ? Math.round((c.ok / c.n) * 100) : 0;
    return `<li><span>${lvl.label}</span><span class="calib-bar"><i style="width:${pct}%"></i></span><b>${c.n ? `${pct}%` : '–'}</b><small>${c.n}×</small></li>`;
  };
  const count = (id) => id === 'all' ? ALL_QUIZZES.length : ALL_QUIZZES.filter(q => q.courseId === id).length;
  return `
    <div class="ctx-group">
      <h3 class="ctx-h">Kurs</h3>
      <div class="ctx-list" role="group" aria-label="Kursfilter Klausur">
        <button class="ctx-item" type="button" data-act="qz-course" data-course="all" aria-pressed="${z.course === 'all'}">${icon('shuffle')}<span>Alle · gemischt</span><span class="ctx-n">${count('all')}</span></button>
        ${COURSES_META.map(c => `<button class="ctx-item" type="button" data-act="qz-course" data-course="${c.id}" aria-pressed="${z.course === c.id}">${courseDot(c)}<span>${escapeHtml(c.short)}</span><span class="ctx-n">${count(c.id)}</span></button>`).join('')}
      </div>
    </div>
    <div class="ctx-group ctx-desk-only">
      <h3 class="ctx-h">Dieser Bogen</h3>
      <p class="ctx-text"><b>${z.right}</b> von <b>${z.answered}</b> richtig · ${Math.max(0, z.queue.length - z.idx - (z.res ? 1 : 0))} offen</p>
    </div>
    <div class="ctx-group ctx-desk-only">
      <h3 class="ctx-h">Kalibrierung (alle Bögen)</h3>
      <ul class="calib-list">${CONFIDENCE_LEVELS.map(calRow).join('')}</ul>
      <p class="ctx-text small">Trefferquote je Sicherheitsstufe. Ideal: „100% sicher“ liegt nahe 100%.</p>
    </div>`;
}

function viewKlausur() {
  if (!ui.qz) startQuiz('all');
  const z = ui.qz;
  const q = z.queue[z.idx];
  let sheet;
  if (!q) {
    const pct = z.answered ? Math.round((z.right / z.answered) * 100) : 0;
    sheet = `
      <div class="exam-result">
        <span class="grade-stamp" aria-hidden="true">${z.right}/${z.answered}</span>
        <h2>Bogen abgegeben</h2>
        <p>${z.answered ? `Du hast ${z.right} von ${z.answered} Aufgaben richtig gelöst (${pct}%).` : 'Dieser Bogen enthält keine Aufgaben.'} Falsche Antworten tauchen beim nächsten Bogen wieder auf – genau dort lernst du am meisten.</p>
        <div class="row center">
          <button class="btn btn-primary" type="button" data-act="quiz-restart">Neuen Bogen austeilen</button>
          <button class="btn" type="button" data-act="draw" data-course="${z.course}">Zum Karteikasten</button>
        </div>
      </div>`;
  } else {
    const done = !!z.res;
    const opts = q.options.map((o, i) => {
      let cls = '';
      let mark = z.sel === i ? '✕' : '';
      if (done && i === q.answer) { cls = 'is-correct'; mark = '✓'; }
      else if (done && i === z.sel) cls = 'is-wrong';
      return `<li><button class="opt ${cls}" type="button" data-act="opt" data-i="${i}" aria-pressed="${z.sel === i}" ${done ? 'disabled' : ''}>
        <span class="opt-box" aria-hidden="true">${mark}</span><span class="opt-letter">${'ABCDEFGH'[i]}</span><span class="opt-text">${rich(o)}</span>
      </button></li>`;
    }).join('');
    const last = z.idx === z.queue.length - 1;
    sheet = `
      <header class="exam-head">
        ${courseTag(q.courseId)}
        <span class="exam-no">Aufgabe ${z.idx + 1} / ${z.queue.length}</span>
        ${q.examStyle ? `<span class="exam-style">${escapeHtml(q.examStyle)}</span>` : ''}
        <span class="exam-score" aria-label="${z.right} von ${z.answered} richtig">${z.right}/${z.answered}</span>
      </header>
      <h2 class="exam-q">${rich(q.question)}</h2>
      ${q.code ? `<pre class="code"><code>${escapeHtml(q.code)}</code></pre>` : ''}
      <ol class="exam-opts">${opts}</ol>
      ${done ? `
        <div class="verdict ${z.res.correct ? 'ok' : 'bad'}" role="status">
          <span class="verdict-stamp">${z.res.correct ? 'Richtig' : 'Falsch'}</span>
          ${z.res.overconfident ? `<p class="hyper"><b>Achtung, Überzeugungsirrtum!</b> Du warst dir 100% sicher und lagst falsch. Genau solche Fehler korrigiert dein Gedächtnis besonders gründlich (Hyperkorrektur-Effekt) – lies die Erklärung jetzt bewusst.</p>` : ''}
          <p class="explain"><b>Erklärung:</b> ${rich(q.explanation)}</p>
        </div>
        <div class="exam-actions"><button class="btn btn-primary btn-big" type="button" data-act="next">${last ? 'Bogen auswerten' : 'Nächste Aufgabe'} <kbd>↵</kbd></button></div>` : `
        <fieldset class="conf">
          <legend>Wie sicher bist du?</legend>
          <div class="conf-row">${CONFIDENCE_LEVELS.map(c => `<button class="conf-btn" type="button" data-act="conf" data-c="${c.value}" aria-pressed="${z.conf === c.value}">${c.label}</button>`).join('')}</div>
        </fieldset>
        <div class="exam-actions"><button class="btn btn-primary btn-big" type="button" data-act="submit" aria-disabled="${z.sel === null}">Antwort abgeben <kbd>↵</kbd></button></div>`}`;
  }
  const main = `<div class="clipboard"><span class="clip-metal big" aria-hidden="true"></span><div class="exam-sheet">${sheet}</div></div>`;
  return { title: 'Klausurbogen', ctx: quizCtx(), main, actionbar: !!q };
}

/* ------------------------------------------------------------------ */
/* Kursordner (courses)                                                 */
/* ------------------------------------------------------------------ */

function ordnerCtx(activeId) {
  return `
    <div class="ctx-group">
      <h3 class="ctx-h">Ordner</h3>
      <div class="ctx-list">
        ${COURSES_META.map(c => `<a class="ctx-item" href="#/ordner/${c.id}" aria-current="${c.id === activeId ? 'page' : 'false'}">${courseDot(c)}<span>${escapeHtml(c.short)}</span><span class="ctx-n">${getCourseMastery(c.id)}%</span></a>`).join('')}
      </div>
    </div>`;
}

function coverPage(c) {
  const st = cardStats(c.id);
  const m = getCourseMastery(c.id);
  const quizN = ALL_QUIZZES.filter(q => q.courseId === c.id).length;
  const due = st.new + st.due;
  const dls = allDeadlines().filter(d => d.courseId === c.id);
  return `
    <article class="cover">
      <header class="cover-label" style="--c:${c.color}">
        <span class="cover-icon" aria-hidden="true">${c.icon}</span>
        <div><h2>${escapeHtml(c.title)}</h2><p>${escapeHtml(c.subtitle)}</p><p class="muted">${escapeHtml(c.prof)}</p></div>
      </header>
      <dl class="exam-info">
        <div><dt>Prüfung</dt><dd>${escapeHtml(c.examInfo.type)}</dd></div>
        <div><dt>Hilfsmittel</dt><dd>${escapeHtml(c.examInfo.aid)}</dd></div>
        <div><dt>Prüfungsvorleistung</dt><dd>${escapeHtml(c.examInfo.pvl)}</dd></div>
        <div><dt>Zeitraum</dt><dd>${escapeHtml(c.examInfo.period)}</dd></div>
      </dl>
      <div class="mastery">
        <div class="mastery-top"><span>Beherrschung</span><b>${m}%</b></div>
        <div class="mastery-bar" role="progressbar" aria-label="Beherrschung ${escapeHtml(c.short)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${m}"><i style="width:${m}%;--c:${c.color}"></i></div>
        <p class="muted small">${st.new} neu · ${st.due} fällig · ${st.learning} im Lernen · ${st.mastered} gemeistert</p>
      </div>
      <div class="row">
        <button class="btn btn-primary" type="button" data-act="draw" data-course="${c.id}">Karteikarten ziehen · ${due} fällig</button>
        <button class="btn" type="button" data-act="goto-quiz" data-course="${c.id}">Klausurfragen · ${quizN}</button>
      </div>
      ${dls.length ? `<h3 class="sec-h">Termine</h3><ul class="dl-list">${dls.map(d => `<li class="${d.urgent ? 'urgent' : ''}"><b>${formatDate(d.date)}</b><span>${escapeHtml(d.label)}</span><em>${daysLeftLabel(d.daysLeft)}</em></li>`).join('')}</ul>` : ''}
      <h3 class="sec-h">Unterlagen (PDF)</h3>
      <ul class="pdf-list">
        ${c.pdfs.map(p => `<li><a href="${pdfHref(p.path)}" target="_blank" rel="noopener"><span class="pdf-tag">${escapeHtml(p.tag)}</span><span class="pdf-title">${escapeHtml(p.title)}</span>${icon('ext')}</a></li>`).join('')}
      </ul>
    </article>`;
}

function chapterPage(ch) {
  const fey = getFeynman(ch.id);
  const pinned = store.isPinned(ch.cheatSheet.id);
  const dg = ch.diagram && DIAGRAMS[ch.diagram];
  return `
    <article class="chapter">
      <header class="chapter-head">
        <div>${ch.badge ? `<span class="badge">${escapeHtml(ch.badge)}</span>` : ''}<h2>${escapeHtml(ch.title)}</h2></div>
        <button class="btn pin-btn" type="button" data-act="pin" data-ch="${ch.id}" aria-pressed="${pinned}">${icon('pin')}<span>${pinned ? 'Auf dem Spickzettel' : 'An Spickzettel pinnen'}</span></button>
      </header>
      <ul class="summary">${ch.summary.map(s => `<li>${s}</li>`).join('')}</ul>
      ${dg ? `<figure class="diagram-frame"><div class="diagram-scroll" tabindex="0" aria-label="Diagramm: ${escapeHtml(dg.title)} (horizontal scrollbar)">${dg.svg}</div><figcaption>${escapeHtml(dg.title)}</figcaption></figure>` : ''}
      <section class="notebook" aria-labelledby="fey-h-${ch.id}">
        <h3 id="fey-h-${ch.id}" class="hand">Feynman-Notiz</h3>
        <p class="fey-prompt">${rich(ch.feynman.prompt)}</p>
        <label class="sr-only" for="fey-${ch.id}">Deine Erklärung in einfachen Worten</label>
        <textarea id="fey-${ch.id}" class="notebook-text" data-feynman="${ch.id}" rows="7" placeholder="Erkläre es so, als würdest du es einer Mitstudentin erklären …">${escapeHtml(fey.text)}</textarea>
        <p class="fey-saved muted small" aria-live="polite" data-fey-saved>${fey.text ? 'Gespeichert.' : 'Wird automatisch gespeichert.'}</p>
        <div class="rubric">
          <h4>Checkliste – hast du erklärt … <span data-rubric-count>${fey.checkedPoints.length}/${ch.feynman.rubric.length}</span></h4>
          ${ch.feynman.rubric.map((r, i) => `<label class="rubric-item"><input type="checkbox" data-rubric="${ch.id}" data-i="${i}" ${fey.checkedPoints.includes(i) ? 'checked' : ''}><span>${rich(r)}</span></label>`).join('')}
        </div>
      </section>
    </article>`;
}

function viewOrdner(r) {
  const c = r.a && COURSES_META.find(x => x.id === r.a);
  if (!c) {
    const main = `
      <div class="binder-shelf">
        <h2 class="shelf-title">Welcher Ordner?</h2>
        <div class="binder-row big">${COURSES_META.map(x => binderSpine(x, true)).join('')}</div>
        <p class="shelf-note">Tippe einen Ordnerrücken an. Jeder Ordner enthält Deckblatt, Kapitel-Register, Feynman-Notizen und PDFs.</p>
      </div>`;
    return { title: 'Kursordner', ctx: ordnerCtx(null), main };
  }
  const chapters = ALL_DATA[c.id].chapters;
  const ch = r.b && chapters.find(x => x.id === r.b);
  const tabs = [
    `<a class="reg-tab${ch ? '' : ' active'}" href="#/ordner/${c.id}" ${ch ? '' : 'aria-current="page"'}><b>Deckblatt</b></a>`,
    ...chapters.map((x, i) => `<a class="reg-tab${ch && ch.id === x.id ? ' active' : ''}" href="#/ordner/${c.id}/${x.id}" ${ch && ch.id === x.id ? 'aria-current="page"' : ''} title="${escapeHtml(x.title)}"><b>${i + 1}</b><span>${escapeHtml(x.title.replace(/^\d+\.\s*/, ''))}</span>${store.isPinned(x.cheatSheet.id) ? `<em aria-label="angepinnt">${icon('pin')}</em>` : ''}</a>`),
  ];
  const idx = ch ? chapters.indexOf(ch) : -1;
  const prev = idx > 0 ? chapters[idx - 1] : null;
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null;
  const main = `
    <div class="binder" style="--c:${c.color}">
      <nav class="reg-tabs" aria-label="Register ${escapeHtml(c.short)}">${tabs.join('')}</nav>
      <div class="binder-body">
        <div class="binder-rings" aria-hidden="true"><span></span><span></span><span></span></div>
        <div class="binder-page">
          ${ch ? chapterPage(ch) : coverPage(c)}
          <nav class="page-nav" aria-label="Blättern">
            ${idx >= 0 ? `<a class="btn" href="#/ordner/${c.id}${prev ? `/${prev.id}` : ''}">${icon('back')}<span>${prev ? 'Voriges Kapitel' : 'Deckblatt'}</span></a>` : '<span></span>'}
            ${next ? `<a class="btn" href="#/ordner/${c.id}/${next.id}"><span>${idx < 0 ? 'Erstes Kapitel' : 'Nächstes Kapitel'}</span>${icon('chevron')}</a>` : ''}
          </nav>
        </div>
      </div>
    </div>`;
  return { title: `Ordner ${c.short}`, ctx: ordnerCtx(c.id), main };
}

/* ------------------------------------------------------------------ */
/* Briefblock (GPAS email coach)                                        */
/* ------------------------------------------------------------------ */

function briefCtx() {
  return `
    <div class="ctx-group">
      <h3 class="ctx-h">Aufgabe</h3>
      <div class="ctx-list" role="group" aria-label="Szenario wählen">
        ${PROMPTS.map((p, i) => `<button class="ctx-item" type="button" data-act="prompt" data-i="${i}" aria-pressed="${i === ui.promptIdx}">${icon('letter')}<span>${escapeHtml(p.title)}</span></button>`).join('')}
      </div>
    </div>
    <div class="ctx-group ctx-desk-only">
      <h3 class="ctx-h">GPAS-Zeitplan</h3>
      <p class="ctx-text small">5% Read · 10% Draft · 80% Write · 5% Proofread. Ziel: 120–180 Wörter, drei Absätze, indirekte Frage.</p>
    </div>`;
}

function viewBrief() {
  const p = PROMPTS[ui.promptIdx];
  const text = ui.drafts[p.id] || '';
  const dg = DIAGRAMS['gpas-email'];
  const main = `
    <div class="letter-ws">
      <section class="scenario paper-sheet" aria-labelledby="sc-h">
        <p class="eyebrow">Exam task · Semi-formal email</p>
        <h2 id="sc-h">${escapeHtml(p.title)}</h2>
        <p class="scenario-text" lang="en">${escapeHtml(p.scenario)}</p>
      </section>
      <figure class="diagram-frame gpas"><div class="diagram-scroll" tabindex="0" aria-label="Diagramm: ${escapeHtml(dg.title)}">${dg.svg}</div><figcaption>${escapeHtml(dg.title)}</figcaption></figure>
      <section class="writing-pad" aria-labelledby="pad-label">
        <div class="pad-binding" aria-hidden="true"></div>
        <div class="mail-status" id="mail-status" aria-hidden="true"></div>
        <label id="pad-label" class="pad-label" for="mail-text">Your email</label>
        <textarea id="mail-text" data-mail lang="en" spellcheck="true" autocapitalize="sentences" rows="16" placeholder="Dear Ms Miller,&#10;&#10;Thank you for your email …">${escapeHtml(text)}</textarea>
        <div class="row pad-tools"><button class="btn" type="button" data-act="mail-clear">${icon('trash')}<span>Blatt leeren</span></button></div>
      </section>
      <aside class="feedback-note" id="mail-feedback" aria-live="polite" aria-label="Korrekturzettel"></aside>
    </div>`;
  return { title: 'Briefblock', ctx: briefCtx(), main };
}

function updateMailFeedback() {
  const ta = $('#mail-text');
  const fb = $('#mail-feedback');
  if (!ta || !fb) return;
  const p = PROMPTS[ui.promptIdx];
  const a = analyzeEmail(ta.value, p);
  const lo = 120, hi = 180, max = 220;
  const pos = Math.min(100, (a.words / max) * 100);
  const wState = a.words < lo ? 'low' : a.words > hi ? 'high' : 'ok';
  fb.innerHTML = `
    <h2 class="hand">Korrekturzettel</h2>
    <div class="words ${wState}">
      <p><b>${a.words}</b> Wörter <span>Ziel ${lo}–${hi}</span></p>
      <div class="word-gauge" aria-hidden="true"><span class="band" style="left:${(lo / max) * 100}%;width:${((hi - lo) / max) * 100}%"></span><i style="left:${pos}%"></i></div>
      <p class="small">${wState === 'low' ? `Noch ${lo - a.words} Wörter bis zum Zielbereich.` : wState === 'high' ? `${a.words - hi} Wörter zu viel – kürzen.` : 'Länge passt.'}</p>
    </div>
    <h3>Struktur <span>${a.score}/6</span></h3>
    <ul class="checks">${a.checks.map(c => `<li class="${c.ok ? 'ok' : 'no'}"><span aria-hidden="true">${c.ok ? '✓' : '✗'}</span><span lang="en">${escapeHtml(c.label)}</span><span class="sr-only">${c.ok ? 'erfüllt' : 'fehlt'}</span></li>`).join('')}</ul>
    <h3>Keywords <span>${a.kwHits}/${a.keywords.length}</span></h3>
    <ul class="kw">${a.keywords.map(k => `<li class="${k.hit ? 'hit' : ''}" lang="en">${escapeHtml(k.word)}<span class="sr-only">${k.hit ? ' – verwendet' : ' – fehlt'}</span></li>`).join('')}</ul>`;
  const st = $('#mail-status');
  if (st) st.innerHTML = `<span class="${wState}">${a.words} Wörter</span><span>Struktur ${a.score}/6</span><span>Keywords ${a.kwHits}/${a.keywords.length}</span>`;
}

/* ------------------------------------------------------------------ */
/* Spickzettel (DIN A4 cheat sheet)                                     */
/* ------------------------------------------------------------------ */

function blattCtx() {
  const pins = store.state.pinnedCheatSheet;
  return `
    <div class="ctx-group">
      <h3 class="ctx-h">Blatt füllen</h3>
      <div class="ctx-list" role="group" aria-label="Spickzettel-Aktionen">
        <button class="ctx-item" type="button" data-act="load-pins" data-courses="gdp1">${courseDot(courseMeta('gdp1'))}<span>GP1 komplett</span></button>
        <button class="ctx-item" type="button" data-act="load-pins" data-courses="ics">${courseDot(courseMeta('ics'))}<span>ICS komplett</span></button>
        <button class="ctx-item" type="button" data-act="load-pins" data-courses="all">${icon('shuffle')}<span>Alle Kurse</span></button>
        <button class="ctx-item danger" type="button" data-act="clear-pins" ${pins.length ? '' : 'disabled'}>${icon('trash')}<span>Leeren</span></button>
        <button class="ctx-item accent" type="button" data-act="print" ${pins.length ? '' : 'disabled'}>${icon('print')}<span>Drucken</span></button>
      </div>
    </div>
    <div class="ctx-group ctx-desk-only">
      <h3 class="ctx-h">Angepinnt · ${pins.length}</h3>
      ${pins.length ? `<ul class="pin-list">${pins.map(p => `<li>${courseDot(courseMeta(p.courseId))}<span>${escapeHtml(p.title)}</span><button class="x-btn" type="button" data-act="unpin" data-id="${escapeHtml(p.id)}" aria-label="${escapeHtml(p.title)} entfernen">×</button></li>`).join('')}</ul>` : '<p class="ctx-text small">Noch nichts angepinnt – im Kursordner auf „An Spickzettel pinnen“ tippen.</p>'}
    </div>`;
}

function viewBlatt() {
  const pins = store.state.pinnedCheatSheet;
  const main = `
    <div class="a4-wrap">
      <article class="a4" aria-label="DIN-A4-Spickzettel">
        <header class="a4-head"><b>Spickzettel · WS 26/27</b><span>${pins.length} ${pins.length === 1 ? 'Thema' : 'Themen'} · DIN A4</span></header>
        ${pins.length ? `<div class="a4-cols">${pins.map(p => `
          <section class="a4-item" style="--c:${courseMeta(p.courseId).color}">
            <h3><span>${escapeHtml(p.title)}</span><button class="x-btn" type="button" data-act="unpin" data-id="${escapeHtml(p.id)}" aria-label="${escapeHtml(p.title)} vom Spickzettel entfernen">×</button></h3>
            <p>${escapeHtml(p.content)}</p>
            ${p.code ? `<pre>${escapeHtml(p.code)}</pre>` : ''}
          </section>`).join('')}</div>` : `
          <div class="a4-empty">
            <p class="hand">Noch ein leeres Blatt.</p>
            <p>Pinne Kapitel im Kursordner an oder lade einen ganzen Kurs auf einmal.</p>
            <div class="row center">
              <button class="btn" type="button" data-act="load-pins" data-courses="gdp1">GP1 laden</button>
              <button class="btn" type="button" data-act="load-pins" data-courses="ics">ICS laden</button>
              <a class="btn" href="#/ordner">Zu den Ordnern</a>
            </div>
          </div>`}
      </article>
    </div>`;
  return { title: 'Spickzettel', ctx: blattCtx(), main };
}

/* ------------------------------------------------------------------ */
/* Wandkalender                                                         */
/* ------------------------------------------------------------------ */

const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function viewKalender() {
  const all = allDeadlines({ includePast: true });
  const upcoming = allDeadlines();
  const today = new Date();
  const todayIso = iso(today);
  const lastIso = upcoming.length ? upcoming[upcoming.length - 1].date : todayIso;
  const cursor = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(+lastIso.slice(0, 4), +lastIso.slice(5, 7) - 1, 1);
  const months = [];
  while (cursor <= end && months.length < 12) { months.push(new Date(cursor)); cursor.setMonth(cursor.getMonth() + 1); }

  const monthHtml = (m) => {
    const y = m.getFullYear(), mo = m.getMonth();
    const prefix = `${y}-${String(mo + 1).padStart(2, '0')}`;
    const inMonth = all.filter(d => d.date.startsWith(prefix));
    const offset = (m.getDay() + 6) % 7;
    const days = new Date(y, mo + 1, 0).getDate();
    let cells = '<span class="cal-empty"></span>'.repeat(offset);
    for (let d = 1; d <= days; d++) {
      const key = `${prefix}-${String(d).padStart(2, '0')}`;
      const hits = inMonth.filter(x => x.date === key);
      const past = key < todayIso;
      cells += `<span class="cal-day${key === todayIso ? ' today' : ''}${hits.length ? ' has' : ''}${past ? ' past' : ''}"${hits.length ? ` title="${escapeHtml(hits.map(h => h.label).join(' · '))}"` : ''}>
        ${d}${hits.length ? `<span class="cal-dots">${hits.map(h => `<i style="--c:${h.color}"></i>`).join('')}</span>` : ''}</span>`;
    }
    return `
      <section class="cal-month" aria-labelledby="m-${prefix}">
        <h3 id="m-${prefix}">${MONTHS[mo]} <span>${y}</span></h3>
        <div class="cal-grid" aria-hidden="true">${['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(w => `<span class="cal-wd">${w}</span>`).join('')}${cells}</div>
        ${inMonth.length ? `<ul class="cal-list">${inMonth.map(d => `
          <li class="${d.daysLeft < 0 ? 'past' : ''}${d.urgent && d.daysLeft >= 0 ? ' urgent' : ''}" style="--c:${d.color}">
            <a href="#/ordner/${d.courseId}"><b>${formatDate(d.date).slice(0, 6)}</b><span>${escapeHtml(d.label)}</span><em>${daysLeftLabel(d.daysLeft)}</em></a>
          </li>`).join('')}</ul>` : '<p class="muted small">Keine Termine.</p>'}
      </section>`;
  };

  const ctx = `
    <div class="ctx-group ctx-desk-only">
      <h3 class="ctx-h">Als Nächstes</h3>
      <ul class="next-list">${upcoming.slice(0, 5).map(d => `<li style="--c:${d.color}"><b>${daysLeftLabel(d.daysLeft)}</b><span>${escapeHtml(d.label)}</span></li>`).join('')}</ul>
    </div>`;
  const main = `
    <div class="wall-cal">
      <div class="cal-spiral" aria-hidden="true"></div>
      <header class="cal-head"><h2>Wandkalender WS 26/27</h2><p>${upcoming.length} anstehende Termine · heute ${formatDate(todayIso)}</p></header>
      <div class="cal-months">${months.map(monthHtml).join('')}</div>
    </div>`;
  return { title: 'Wandkalender', ctx, main };
}

/* ------------------------------------------------------------------ */
/* Handbuch (methods, backup, shortcuts)                                */
/* ------------------------------------------------------------------ */

const METHODS = [
  { id: 'm-spaced', title: 'Verteiltes Wiederholen', sub: 'Spaced Repetition · Karteikasten', text: 'Wiederholen kurz bevor du vergisst: Jede Bewertung verschiebt die Karte nach dem SM-2-Verfahren in ein längeres Intervall. Die Fächer im Karteikasten zeigen den Stand – neu, fällig, im Lernen, gemeistert (≥ 14 Tage). Lieber täglich 15 Minuten als einmal drei Stunden.' },
  { id: 'm-recall', title: 'Aktives Abrufen', sub: 'Active Recall · Testing Effect', text: 'Erst selbst erinnern, dann umdrehen. Das Abrufen aus dem Gedächtnis festigt Wissen stärker als erneutes Lesen. Im Klausurbogen gibst du zusätzlich an, wie sicher du bist – so erkennst du Überzeugungsirrtümer, die nach der Korrektur besonders gut hängen bleiben (Hyperkorrektur).' },
  { id: 'm-inter', title: 'Verschachteltes Üben', sub: 'Interleaving · gemischte Session', text: '„Alle · gemischt“ wechselt zwischen Kursen und Kapiteln. Das fühlt sich schwerer an, trainiert aber genau das, was die Klausur verlangt: erkennen, welches Konzept gerade gefragt ist.' },
  { id: 'm-feyn', title: 'Feynman-Technik', sub: 'Erklären in einfachen Worten', text: 'Schreibe im Kursordner auf die linierte Seite, wie du das Kapitel einer Mitstudentin erklären würdest. Hake danach die Checkliste ab: Was fehlt, ist eine Wissenslücke – zurück zur Zusammenfassung.' },
  { id: 'm-dual', title: 'Doppelte Codierung', sub: 'Dual Coding · Wort + Bild', text: 'Zu vielen Kapiteln gibt es ein Diagramm. Verknüpfe Text und Bild: Zeichne das Diagramm aus dem Kopf nach und beschrifte es – zwei Gedächtnisspuren sind robuster als eine.' },
];

function viewMethoden() {
  const hist = activityHistory(14);
  const maxH = Math.max(1, ...hist.map(h => h.total));
  const tp = todayProgress();
  const ctx = `
    <div class="ctx-group">
      <h3 class="ctx-h">Inhalt</h3>
      <div class="ctx-list">
        ${METHODS.map((m, i) => `<button class="ctx-item" type="button" data-act="scroll" data-target="${m.id}"><b class="num">${i + 1}</b><span>${m.title}</span></button>`).join('')}
        <button class="ctx-item" type="button" data-act="scroll" data-target="sec-log"><b class="num">6</b><span>Lernprotokoll</span></button>
        <button class="ctx-item" type="button" data-act="scroll" data-target="sec-backup"><b class="num">7</b><span>Sicherung</span></button>
        <button class="ctx-item" type="button" data-act="scroll" data-target="sec-keys"><b class="num">8</b><span>Tastatur</span></button>
      </div>
    </div>`;
  const main = `
    <div class="handbook">
      <header class="hb-head"><p class="eyebrow">Handbuch</p><h2>Wie dieser Schreibtisch dir beim Lernen hilft</h2><p>Fünf gut belegte Lernmethoden – und wo du sie hier findest.</p></header>
      <ol class="methods">
        ${METHODS.map((m, i) => `<li id="${m.id}"><span class="m-num">${i + 1}</span><div><h3>${m.title}</h3><p class="m-sub">${m.sub}</p><p>${m.text}</p></div></li>`).join('')}
      </ol>

      <section id="sec-log" class="hb-sec">
        <h3>Lernprotokoll</h3>
        <p class="muted">Gesamtbeherrschung ${overallMastery()}% · heute ${tp.reviews} Karten, ${tp.quizzes} Fragen, ${tp.minutes} Min. Fokus · Serie ${streakLabel()}</p>
        <div class="log-chart" role="img" aria-label="Aktivität der letzten 14 Tage">
          ${hist.map(h => `<span title="${h.label}: ${h.reviews} Karten, ${h.quizzes} Fragen, ${h.minutes} Min."><i style="height:${Math.round((h.total / maxH) * 100)}%"></i><b>${h.total || ''}</b><small>${h.weekday}</small></span>`).join('')}
        </div>
        <ul class="mastery-list">${COURSES_META.map(c => { const m = getCourseMastery(c.id); return `<li><span>${courseDot(c)} ${escapeHtml(c.short)}</span><span class="mastery-bar"><i style="width:${m}%;--c:${c.color}"></i></span><b>${m}%</b></li>`; }).join('')}</ul>
      </section>

      <section id="sec-backup" class="hb-sec">
        <h3>Sicherung</h3>
        <p class="muted">Dein Fortschritt liegt nur in diesem Browser. Sichere ihn als Datei, um ihn auf ein anderes Gerät mitzunehmen.</p>
        <div class="row">
          <button class="btn btn-primary" type="button" data-act="backup">${icon('download')}<span>Sicherung herunterladen</span></button>
          <label class="btn file-btn">${icon('upload')}<span>Sicherung einspielen</span><input type="file" accept="application/json,.json" data-import></label>
          <button class="btn btn-danger" type="button" data-act="reset">${icon('trash')}<span>Fortschritt zurücksetzen</span></button>
        </div>
      </section>

      <section id="sec-keys" class="hb-sec">
        <h3>Tastatur (MacBook)</h3>
        <dl class="keys">
          <div><dt><kbd>Leertaste</kbd></dt><dd>Karteikarte umdrehen</dd></div>
          <div><dt><kbd>1</kbd>–<kbd>4</kbd></dt><dd>Karte bewerten: Nochmal · Schwer · Gut · Einfach</dd></div>
          <div><dt><kbd>1</kbd>–<kbd>4</kbd> / <kbd>↵</kbd></dt><dd>Klausur: Antwort ankreuzen / abgeben bzw. weiter</dd></div>
          <div><dt><kbd>Esc</kbd></dt><dd>Zurück zum Schreibtisch (bzw. Textfeld verlassen)</dd></div>
          <div><dt><kbd>K</kbd> <kbd>Q</kbd> <kbd>O</kbd> <kbd>E</kbd></dt><dd>Karteikasten · Klausur · Ordner · Briefblock</dd></div>
          <div><dt><kbd>S</kbd> <kbd>C</kbd> <kbd>M</kbd> <kbd>W</kbd></dt><dd>Spickzettel · Kalender · Handbuch · Wecker</dd></div>
          <div><dt><kbd>D</kbd></dt><dd>Schreibtisch</dd></div>
          <div><dt><kbd>P</kbd></dt><dd>Küchenwecker starten / pausieren</dd></div>
          <div><dt><kbd>L</kbd></dt><dd>Lampe: Hell / Dunkel</dd></div>
        </dl>
        <p class="muted small">Auf dem iPhone: Karte antippen zum Umdrehen, Bewertung mit dem Daumen unten. Tomate antippen startet den Wecker, im Uhrzeigersinn drehen zieht ihn auf.</p>
      </section>
    </div>`;
  return { title: 'Handbuch', ctx, main };
}

/* ------------------------------------------------------------------ */
/* Küchenwecker                                                         */
/* ------------------------------------------------------------------ */

function viewWecker() {
  const tp = todayProgress();
  const main = `
    <div class="timer-ws">
      <div class="timer-stage">${tomatoDial(260, 'Großer Küchenwecker')}</div>
      <div class="timer-panel paper-sheet">
        <p class="eyebrow">Pomodoro</p>
        <p class="timer-time big" data-pomo-time>${pomo.display}</p>
        <p class="timer-state" data-pomo-state></p>
        <div class="row center">
          <button class="btn btn-primary btn-big" type="button" data-act="pomo-toggle" data-pomo-toggle></button>
          <button class="btn" type="button" data-act="pomo-reset">${icon('reset')}<span>Zurück</span></button>
        </div>
        <button class="btn btn-ghost" type="button" data-act="pomo-mode" data-pomo-mode></button>
        <p class="muted small">Tomate antippen: Start/Pause. Im Uhrzeigersinn drehen und loslassen: zieht auf 25 oder 50 Minuten auf und startet. Ganz zurückdrehen: stoppt.</p>
        <p class="timer-today">Heute: <b>${tp.minutes}</b> Minuten Fokus eingetragen</p>
      </div>
    </div>`;
  return { title: 'Küchenwecker', main };
}

/* ------------------------------------------------------------------ */
/* Chrome: drawer (desktop), topbar + shelf (phone)                     */
/* ------------------------------------------------------------------ */

function countBadge(kind) {
  return kind ? `<span class="count" data-count="${kind}"></span>` : '';
}

function drawerHtml(view, ctx) {
  return `
    <div class="drawer-inner">
      <a class="drawer-back" href="#/">${icon('back')}<span>Schreibtisch</span><kbd>Esc</kbd></a>
      <nav class="drawer-nav" aria-label="Objekte auf dem Schreibtisch">
        ${OBJECTS.filter(o => o.id !== 'tisch').map(o => `<a href="${o.href}" ${o.id === view ? 'aria-current="page"' : ''}>${icon(o.icon)}<span>${o.label}</span>${countBadge(o.count)}<kbd>${o.key.toUpperCase()}</kbd></a>`).join('')}
      </nav>
      ${ctx ? `<div class="drawer-ctx">${ctx}</div>` : ''}
      <div class="drawer-foot">
        <div class="mini-timer">
          ${tomatoDial(64, 'Kleiner Küchenwecker')}
          <div><b data-pomo-time>${pomo.display}</b><small data-pomo-state></small></div>
          <button class="icon-btn" type="button" data-act="pomo-toggle" data-pomo-toggle aria-label="Wecker starten oder pausieren"></button>
        </div>
        ${lampBtn()}
      </div>
    </div>`;
}

function topbarHtml(title) {
  return `
    <a class="tb-back" href="#/" aria-label="Zurück zum Schreibtisch">${icon('back')}<span>Tisch</span></a>
    <h1 class="tb-title">${escapeHtml(title)}</h1>
    <div class="tb-tools">${pomoChip()}${lampBtn()}</div>`;
}

function shelfHtml(view) {
  return SHELF.map(id => {
    const o = OBJECTS.find(x => x.id === id);
    return `<a href="${o.href}" ${o.id === view ? 'aria-current="page"' : ''}>${icon(o.icon)}<span>${o.short}</span>${countBadge(o.count)}</a>`;
  }).join('');
}

function refreshCounts() {
  const due = dueCount('all');
  const pins = store.state.pinnedCheatSheet.length;
  for (const el of $$('[data-count]')) {
    const n = el.dataset.count === 'due' ? due : pins;
    el.textContent = n > 99 ? '99+' : String(n);
    el.hidden = n === 0;
  }
}

/* ------------------------------------------------------------------ */
/* Router & render                                                      */
/* ------------------------------------------------------------------ */

const VIEWS = {
  tisch: viewDesk, kasten: viewKasten, klausur: viewKlausur, ordner: viewOrdner, brief: viewBrief,
  blatt: viewBlatt, kalender: viewKalender, methoden: viewMethoden, wecker: viewWecker,
};

function parseHash() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const view = VIEWS[parts[0]] ? parts[0] : 'tisch';
  return { view, a: parts[1] || null, b: parts[2] || null };
}

let lastKey = '';

function render() {
  const r = parseHash();
  const key = `${r.view}/${r.a}/${r.b}`;
  const routeChanged = key !== lastKey;
  lastKey = key;
  ui.route = r;
  const desk = r.view === 'tisch';
  const wide = mqDesk.matches;
  const out = VIEWS[r.view](r);

  document.body.className = `v-${r.view} ${desk ? 'is-desk' : 'is-ws'}${out.actionbar ? ' has-actionbar' : ''}`;
  mainEl.innerHTML = desk
    ? out.main
    : `${!wide && out.ctx ? `<div class="ws-ctx">${out.ctx}</div>` : ''}<div class="ws-object${routeChanged && !mqReduce.matches ? ' opening' : ''}">${out.main}</div>`;
  drawerEl.innerHTML = !desk && wide ? drawerHtml(r.view, out.ctx) : '';
  drawerEl.hidden = desk || !wide;
  topbarEl.innerHTML = desk || wide ? '' : topbarHtml(out.title);
  topbarEl.hidden = desk || wide;
  shelfEl.innerHTML = shelfHtml(r.view);
  document.title = `${out.title} · StudyOS Schreibtisch`;

  applyTheme();
  updatePomo();
  refreshCounts();
  if (r.view === 'brief') updateMailFeedback();
  if (routeChanged) {
    window.scrollTo(0, 0);
    if (drawerEl.firstElementChild) drawerEl.scrollTop = 0;
  }
}

function go(hash) {
  if (location.hash === hash) render(); else location.hash = hash;
}

/** After a local re-render, keep keyboard focus on the equivalent control. */
function refocus(selector) {
  $(selector)?.focus({ preventScroll: true });
}

window.addEventListener('hashchange', render);
mqDesk.addEventListener('change', render);

/* ------------------------------------------------------------------ */
/* Events                                                               */
/* ------------------------------------------------------------------ */

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true' && el.dataset.act !== 'submit') return;
  const act = el.dataset.act;
  switch (act) {
    case 'theme': store.toggleTheme(); applyTheme(); break;
    case 'start-mixed': startCards('all'); go('#/kasten'); break;
    case 'draw': startCards(el.dataset.course); go('#/kasten'); break;
    case 'fach': startCards(el.dataset.course, { status: el.dataset.status }); go('#/kasten'); break;
    case 'fc-course': startCards(el.dataset.course); render(); refocus(`[data-act="fc-course"][data-course="${el.dataset.course}"]`); break;
    case 'all-cards': startCards(ui.fc.course, { includeAll: true }); render(); break;
    case 'goto-quiz': startQuiz(el.dataset.course || 'all'); go('#/klausur'); break;
    case 'reveal': reveal(); break;
    case 'flip': flip(); break;
    case 'rate': rate(Number(el.dataset.r)); break;
    case 'qz-course': startQuiz(el.dataset.course); render(); refocus(`[data-act="qz-course"][data-course="${el.dataset.course}"]`); break;
    case 'opt': if (!ui.qz.res) { ui.qz.sel = Number(el.dataset.i); render(); refocus(`[data-act="opt"][data-i="${el.dataset.i}"]`); } break;
    case 'conf': ui.qz.conf = el.dataset.c; for (const b of $$('[data-act="conf"]')) b.setAttribute('aria-pressed', String(b === el)); break;
    case 'submit': submitAnswer(); break;
    case 'next': nextQuestion(); break;
    case 'quiz-restart': startQuiz(ui.qz.course); render(); break;
    case 'pin': {
      const ch = CHAPTER_BY_ID.get(el.dataset.ch);
      const on = togglePinChapter(ch);
      toast(on ? `„${ch.cheatSheet.title}“ liegt jetzt auf dem Spickzettel.` : 'Vom Spickzettel entfernt.', on ? 'ok' : '');
      render();
      break;
    }
    case 'unpin': store.togglePin({ id: el.dataset.id }); toast('Vom Spickzettel entfernt.'); render(); break;
    case 'load-pins': {
      const ids = el.dataset.courses === 'all' ? COURSES_META.map(c => c.id) : [el.dataset.courses];
      const before = store.state.pinnedCheatSheet.length;
      loadCoursePins(ids);
      toast(`${store.state.pinnedCheatSheet.length - before} Themen ergänzt.`, 'ok');
      render();
      break;
    }
    case 'clear-pins':
      if (confirm('Spickzettel wirklich komplett leeren?')) { clearPins(); toast('Spickzettel geleert.'); render(); }
      break;
    case 'print': window.print(); break;
    case 'prompt': ui.promptIdx = Number(el.dataset.i); render(); refocus(`[data-act="prompt"][data-i="${el.dataset.i}"]`); break;
    case 'mail-clear': {
      const ta = $('#mail-text');
      if (ta.value && !confirm('Den Entwurf auf diesem Blatt löschen?')) break;
      ta.value = '';
      saveDraft('');
      updateMailFeedback();
      ta.focus();
      break;
    }
    case 'pomo-toggle': pomo.toggle(); break;
    case 'pomo-reset': pomo.reset(); break;
    case 'pomo-mode': pomo.switchMode(); break;
    case 'backup': downloadBackup(); toast('Sicherung heruntergeladen.', 'ok'); break;
    case 'reset':
      if (confirm('Wirklich den gesamten Lernfortschritt löschen? Das lässt sich nicht rückgängig machen.')) {
        resetProgress();
        ui.fc = null;
        ui.qz = null;
        toast('Fortschritt zurückgesetzt.');
        render();
      }
      break;
    case 'scroll': document.getElementById(el.dataset.target)?.scrollIntoView({ behavior: mqReduce.matches ? 'auto' : 'smooth', block: 'start' }); break;
  }
});

function submitAnswer() {
  const z = ui.qz;
  const q = z.queue[z.idx];
  if (!q || z.res) return;
  if (z.sel === null) { toast('Bitte zuerst eine Antwort ankreuzen.'); return; }
  z.res = submitQuiz(q, z.sel, z.conf);
  z.answered += 1;
  if (z.res.correct) z.right += 1;
  render();
  $('.verdict')?.scrollIntoView({ block: 'nearest', behavior: mqReduce.matches ? 'auto' : 'smooth' });
}

function nextQuestion() {
  const z = ui.qz;
  if (!z.res) return;
  z.idx += 1;
  z.sel = null;
  z.res = null;
  z.conf = 'medium';
  render();
  window.scrollTo(0, 0);
}

function saveDraft(text) {
  ui.drafts[PROMPTS[ui.promptIdx].id] = text;
  try { localStorage.setItem(DRAFTS_KEY, JSON.stringify(ui.drafts)); } catch { /* quota: keep in memory */ }
}

let feySavedTimer = null;
document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.matches('[data-feynman]')) {
    saveFeynmanText(t.dataset.feynman, t.value);
    const s = $('[data-fey-saved]');
    if (s) { clearTimeout(feySavedTimer); s.textContent = 'Speichert …'; feySavedTimer = setTimeout(() => { s.textContent = 'Gespeichert.'; }, 400); }
  } else if (t.matches('[data-mail]')) {
    saveDraft(t.value);
    updateMailFeedback();
  }
});

document.addEventListener('change', async (e) => {
  const t = e.target;
  if (t.matches('[data-rubric]')) {
    toggleFeynmanPoint(t.dataset.rubric, Number(t.dataset.i), t.checked);
    const ch = CHAPTER_BY_ID.get(t.dataset.rubric);
    const c = $('[data-rubric-count]');
    if (c) c.textContent = `${getFeynman(ch.id).checkedPoints.length}/${ch.feynman.rubric.length}`;
  } else if (t.matches('[data-import]')) {
    const file = t.files && t.files[0];
    if (!file) return;
    try {
      await importBackup(file);
      ui.fc = null;
      ui.qz = null;
      toast('Sicherung eingespielt.', 'ok');
      render();
    } catch {
      toast('Import fehlgeschlagen: Die Datei ist keine gültige Sicherung.', 'bad');
    }
    t.value = '';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const t = e.target;
  if (isTyping(t)) {
    if (e.key === 'Escape') t.blur();
    return;
  }
  const view = ui.route.view;
  const dial = t.closest && t.closest('[data-dial]');
  if (dial && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pomo.toggle(); return; }

  if (view === 'kasten' && ui.fc && ui.fc.queue[ui.fc.idx]) {
    if (e.key === ' ') { e.preventDefault(); if (ui.fc.revealed) flip(); else reveal(); return; }
    if (/^[1-4]$/.test(e.key)) { if (ui.fc.revealed) rate(Number(e.key)); return; }
  }
  if (view === 'klausur' && ui.qz && ui.qz.queue[ui.qz.idx]) {
    const q = ui.qz.queue[ui.qz.idx];
    if (/^[1-9]$/.test(e.key) && !ui.qz.res && Number(e.key) <= q.options.length) { ui.qz.sel = Number(e.key) - 1; render(); return; }
    const ownBtn = t.closest && t.closest('button, a');
    if (e.key === 'Enter' && (!ownBtn || ['opt', 'conf'].includes(ownBtn.dataset.act))) { e.preventDefault(); if (ui.qz.res) nextQuestion(); else submitAnswer(); return; }
  }
  if (e.key === 'Escape') { if (view !== 'tisch') go('#/'); return; }
  const k = e.key.toLowerCase();
  if (k === 'l') { store.toggleTheme(); applyTheme(); return; }
  if (k === 'p') { pomo.toggle(); return; }
  const obj = OBJECTS.find(o => o.key === k);
  if (obj) go(obj.href);
});

/* Desktop: zoom from the desk object into the workspace (View Transitions where supported). */
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#/"]');
  if (!a || !document.startViewTransition || mqReduce.matches || !mqDesk.matches || e.defaultPrevented) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  const fromDesk = ui.route.view === 'tisch';
  const toDesk = a.getAttribute('href') === '#/';
  if (!fromDesk && !toDesk) return;
  e.preventDefault();
  const src = fromDesk ? a.closest('.obj') : null;
  if (src) src.style.viewTransitionName = 'desk-obj';
  document.startViewTransition(() => {
    if (src) src.style.viewTransitionName = '';
    history.pushState(null, '', a.getAttribute('href'));
    render();
    const target = $('.ws-object');
    if (target && fromDesk) target.style.viewTransitionName = 'desk-obj';
  }).finished.finally(() => { const t = $('.ws-object'); if (t) t.style.viewTransitionName = ''; });
}, true);

store.subscribe(refreshCounts);

/* ------------------------------------------------------------------ */
/* Boot                                                                 */
/* ------------------------------------------------------------------ */

render();

if ('serviceWorker' in navigator) navigator.serviceWorker.register('../sw.js', { scope: '../' }).catch(() => {});
