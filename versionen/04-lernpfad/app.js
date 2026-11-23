// Lernpfad — mobile-first, gamified learning path UI on top of the shared domain layer.
import {
  COURSES_META, ENGLISH_DATA, DIAGRAMS, store, ALL_DATA, ALL_CHAPTERS, ALL_FLASHCARDS, ALL_QUIZZES,
  courseMeta, escapeHtml as esc, pdfHref, getDueCards, buildFlashcardQueue, rateCard, intervalsFor,
  RATING_LABELS, cardStats, buildQuizQueue, CONFIDENCE_LEVELS, submitQuiz, calibrationStats,
  getCourseMastery, overallMastery, todayProgress, activityHistory, streakLabel, allDeadlines,
  formatDate, daysLeftLabel, getFeynman, saveFeynmanText, toggleFeynmanPoint, togglePinChapter,
  loadCoursePins, clearPins, analyzeEmail, downloadBackup, importBackup, resetProgress, Pomodoro,
  getCardStatus, isDue,
} from '../shared/core.js';

const $ = (sel, root = document) => root.querySelector(sel);
const el = {
  top: $('#top'), screen: $('#screen'), tabbar: $('#tabbar'), layer: $('#sheet-layer'), sheet: $('#sheet'),
  toasts: $('#toasts'), burst: $('#burst'), side: $('#side'), print: $('#print-root'),
};

/* ---------- Icons (inline SVG, no external assets) ---------- */
const svg = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
const ICON = {
  path: svg('<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.5"/>'),
  cards: svg('<rect x="3" y="6" width="13" height="15" rx="2.5"/><path d="M8 3h10.5A2.5 2.5 0 0 1 21 5.5V17"/>'),
  quiz: svg('<path d="M21 12a9 9 0 1 1-3.5-7.1"/><path d="M9.2 9.3a2.9 2.9 0 0 1 5.6 1c0 1.9-2.8 2.4-2.8 4.2"/><circle cx="12" cy="17.8" r=".6" fill="currentColor"/>'),
  timer: svg('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2M9.5 2.5h5M12 2.5V6"/>'),
  more: svg('<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>'),
  flame: svg('<path d="M12 22c4 0 7-2.7 7-6.8 0-3.4-2.2-5.6-3.6-7.2-.4 1.8-1.4 3-2.6 3.4.3-3.3-1.2-6.6-4.3-8.4.2 3-1.3 5-2.8 6.8C4.4 11.3 5 13.4 5 15.2 5 19.3 8 22 12 22Z" fill="currentColor" stroke="none"/>'),
  moon: svg('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/>'),
  sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 'stroke-width="3"'),
  x: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  star: svg('<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" fill="currentColor"/>'),
  trophy: svg('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5"/>'),
  crown: svg('<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" fill="currentColor"/>'),
  pin: svg('<path d="M9 3h6l-1 6 4 3v2H6v-2l4-3-1-6ZM12 14v7"/>'),
  back: svg('<path d="M15 5l-7 7 7 7"/>'),
  chevron: svg('<path d="M9 5l7 7-7 7"/>'),
  play: svg('<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>'),
  pause: svg('<path d="M7 4.5h3.5v15H7zM13.5 4.5H17v15h-3.5z" fill="currentColor"/>'),
  reset: svg('<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3.5 3.5V8H8"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>'),
  sheet: svg('<path d="M6 2.5h8l5 5V20a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20V4a1.5 1.5 0 0 1 1-1.5Z"/><path d="M14 2.5V7.5h5M8.5 12.5h7M8.5 16h7"/>'),
  calendar: svg('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
  brain: svg('<path d="M9 4.5A3 3 0 0 0 4.5 7a3 3 0 0 0-1 5 3.5 3.5 0 0 0 3 5.5A3 3 0 0 0 12 19V5.5a3 3 0 0 0-3-1Z"/><path d="M15 4.5A3 3 0 0 1 19.5 7a3 3 0 0 1 1 5 3.5 3.5 0 0 1-3 5.5A3 3 0 0 1 12 19"/>'),
  doc: svg('<path d="M7 2.5h7l5 5V21.5H7Z"/><path d="M14 2.5v5h5"/>'),
  download: svg('<path d="M12 4v11M7 10.5l5 5 5-5M4.5 20h15"/>'),
  upload: svg('<path d="M12 16V5M7 9.5l5-5 5 5M4.5 20h15"/>'),
  trash: svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  printer: svg('<path d="M7 9V3.5h10V9M7 17.5H5A1.5 1.5 0 0 1 3.5 16v-5A2 2 0 0 1 5.5 9h13a2 2 0 0 1 2 2v5a1.5 1.5 0 0 1-1.5 1.5h-2"/><rect x="7" y="14" width="10" height="7" rx="1"/>'),
};

/* ---------- UI state ---------- */
const COURSE_KEY = 'lernpfad.course';
const ui = {
  course: COURSES_META.some(c => c.id === localStorage.getItem(COURSE_KEY)) ? localStorage.getItem(COURSE_KEY) : COURSES_META[0].id,
  sheetOpen: false,
  sheetChapter: null,
  showPast: false,
  lastDone: todayProgress().done,
};
const cards = { started: false, filter: 'all', chapter: null, includeAll: false, queue: [], pos: 0, revealed: false, reviewed: 0, again: 0, busy: false };
const quiz = { started: false, filter: 'all', chapter: null, queue: [], pos: 0, selected: null, confidence: 'medium', result: null, correct: 0, answered: 0, over: 0 };
const mail = { idx: 0, texts: {} };

const TABS = [
  { id: 'pfad', label: 'Pfad', icon: ICON.path },
  { id: 'ueben', label: 'Karten', icon: ICON.cards },
  { id: 'quiz', label: 'Quiz', icon: ICON.quiz },
  { id: 'fokus', label: 'Fokus', icon: ICON.timer },
  { id: 'mehr', label: 'Mehr', icon: ICON.more },
];

/* ---------- Helpers ---------- */
const chapterTitle = ch => ch.title.replace(/^\d+\.\s*/, '');
const chapterById = id => ALL_CHAPTERS.find(c => c.id === id);
const chapterIndex = ch => ALL_DATA[ch.courseId].chapters.findIndex(c => c.id === ch.id);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
/** Escapes plain data text, then renders `inline code` spans (content is already escaped). */
const rich = s => esc(s).replace(/`([^`\n]+)`/g, '<code>$1</code>');

function chapterInfo(ch) {
  const list = ALL_FLASHCARDS.filter(c => c.chapterId === ch.id);
  let seen = 0, due = 0, mastered = 0;
  for (const c of list) {
    const st = store.state.cards[c.id];
    const status = getCardStatus(st);
    if (status !== 'new') seen += 1;
    if (status === 'mastered') mastered += 1;
    if (isDue(st)) due += 1;
  }
  const fe = getFeynman(ch.id);
  const rubricAll = ch.feynman.rubric.length > 0 && ch.feynman.rubric.every((_, i) => fe.checkedPoints.includes(i));
  const feynmanOk = rubricAll || fe.text.trim().length > 0;
  const cardsOk = seen === list.length;
  const n = list.length;
  const pct = n ? ((seen / n) + (feynmanOk ? 1 : 0)) / 2 : (feynmanOk ? 1 : 0);
  return { n, seen, due, mastered, feynmanOk, cardsOk, done: feynmanOk && cardsOk, pct, crown: n > 0 && mastered === n };
}

function ring(pct, { size = 44, stroke = 5, cls = '' } = {}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(1, pct)));
  return `<svg class="ring ${cls}" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
    <circle class="ring-track" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}"/>
    <circle class="ring-fill" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
  </svg>`;
}

function toast(msg, kind = 'info') {
  const t = document.createElement('div');
  t.className = `toast toast-${kind}`;
  t.textContent = msg;
  el.toasts.append(t);
  setTimeout(() => t.classList.add('out'), 2600);
  setTimeout(() => t.remove(), 3000);
}

function burst() {
  const b = document.createElement('div');
  b.className = 'burst';
  b.innerHTML = Array.from({ length: 30 }, (_, i) => `<i style="--i:${i}"></i>`).join('');
  el.burst.append(b);
  setTimeout(() => b.remove(), 1900);
}

const isTyping = t => t instanceof HTMLElement && (t.matches('input, textarea, select') || t.isContentEditable);

/* ---------- Routing ---------- */
function route() {
  const parts = (location.hash.replace(/^#\/?/, '') || 'pfad').split('/');
  const tab = TABS.some(t => t.id === parts[0]) ? parts[0] : 'pfad';
  return { tab, sub: parts[1] || null };
}
const go = hash => { if (location.hash === hash) renderView(); else location.hash = hash; };

/* ---------- Shell: header, tab bar, side ---------- */
function renderTop() {
  const t = todayProgress();
  const due = getDueCards('all').length;
  const streak = store.state.streak.count;
  const dark = store.state.theme === 'dark';
  const bump = t.done > ui.lastDone;
  ui.lastDone = t.done;
  el.top.innerHTML = `
    <a class="brand" href="#/pfad" aria-label="Lernpfad Startseite">
      <span class="brand-mark">${ICON.path}</span>
      <span class="brand-text"><b>Lernpfad</b><small>WS 26/27</small></span>
    </a>
    <div class="top-stats">
      <a class="pomo-pill" id="pomo-pill" href="#/fokus" ${pomo.running ? '' : 'hidden'}>${ICON.timer}<span id="pomo-pill-time">${pomo.display}</span></a>
      <a class="stat stat-streak ${streak ? 'is-on' : ''}" href="#/mehr" title="Lernserie: ${esc(streakLabel())}">${ICON.flame}<b>${streak}</b></a>
      <a class="stat stat-goal ${bump ? 'bump' : ''} ${t.pct >= 100 ? 'is-full' : ''}" href="#/mehr" title="Tagesziel: ${t.done} von ${t.goal}">${ring(t.pct / 100, { size: 22, stroke: 3.5 })}<b>${t.done}<span>/${t.goal}</span></b></a>
      <button class="stat stat-due" data-action="start-mixed" title="${due} fällige Karten – gemischte Session starten">${ICON.cards}<b>${due}</b></button>
      <button class="icon-btn" data-action="theme" aria-label="${dark ? 'Helles' : 'Dunkles'} Design aktivieren">${dark ? ICON.sun : ICON.moon}</button>
    </div>`;
}

function renderTabbar() {
  const { tab } = route();
  el.tabbar.innerHTML = TABS.map(t => `
    <a class="tab ${t.id === tab ? 'is-active' : ''}" href="#/${t.id}" ${t.id === tab ? 'aria-current="page"' : ''}>
      <span class="tab-ic">${t.icon}${t.id === 'ueben' && getDueCards('all').length ? '<i class="tab-dot"></i>' : ''}${t.id === 'fokus' && pomo.running ? '<i class="tab-dot tab-dot-live"></i>' : ''}</span>
      <span class="tab-label">${t.label}</span>
    </a>`).join('');
}

function weekBars(key = 'total') {
  const hist = activityHistory(7);
  const max = Math.max(1, ...hist.map(d => d[key]));
  return `<div class="bars">${hist.map((d, i) => `
    <div class="bar ${i === hist.length - 1 ? 'is-today' : ''}" title="${d.label}: ${d[key]}${key === 'minutes' ? ' Min' : ''}">
      <span class="bar-val">${d[key] || ''}</span>
      <i style="height:${Math.max(4, (d[key] / max) * 100)}%"></i>
      <small>${d.weekday}</small>
    </div>`).join('')}</div>`;
}

function deadlineRow(d) {
  return `<li class="dl ${d.urgent ? 'is-urgent' : ''} ${d.daysLeft < 0 ? 'is-past' : ''}" style="--c:${d.color}">
    <span class="dl-dot"></span>
    <span class="dl-text"><b>${esc(d.label)}</b><small>${d.icon} ${esc(d.courseShort)} · ${formatDate(d.date)}</small></span>
    <span class="dl-left">${daysLeftLabel(d.daysLeft)}</span>
  </li>`;
}

function renderSide() {
  const t = todayProgress();
  el.side.innerHTML = `
    <section class="side-card side-hero">
      <p class="eyebrow">Heute</p>
      <div class="side-today">
        ${ring(t.pct / 100, { size: 74, stroke: 8, cls: 'ring-brand' })}
        <div><b class="big">${t.done}<span>/${t.goal}</span></b><small>${t.reviews} Karten · ${t.quizzes} Fragen · ${t.minutes} Min Fokus</small><small>Serie: ${esc(streakLabel())}</small></div>
      </div>
    </section>
    <section class="side-card">
      <h3>Diese Woche</h3>
      ${weekBars('total')}
    </section>
    <section class="side-card">
      <h3>Kursfortschritt</h3>
      <ul class="side-courses">${COURSES_META.map(c => {
        const m = getCourseMastery(c.id);
        const due = getDueCards(c.id).length;
        return `<li><button class="side-course" data-course="${c.id}" style="--c:${c.color}">
          <span class="sc-ic">${c.icon}</span>
          <span class="sc-main"><span class="sc-row"><b>${esc(c.short)}</b><small>${due} fällig · ${m}%</small></span><span class="meter"><i style="width:${m}%"></i></span></span>
        </button></li>`;
      }).join('')}</ul>
    </section>
    <section class="side-card">
      <h3>Nächste Termine</h3>
      <ul class="dl-list">${allDeadlines().slice(0, 5).map(deadlineRow).join('') || '<li class="muted">Keine anstehenden Termine.</li>'}</ul>
    </section>
    <section class="side-card side-keys">
      <h3>Tastenkürzel</h3>
      ${shortcutTable()}
    </section>`;
}

function shortcutTable() {
  return `<dl class="keys">
    <dt><kbd>Leertaste</kbd></dt><dd>Karte aufdecken</dd>
    <dt><kbd>1</kbd>–<kbd>4</kbd></dt><dd>Karte bewerten (Nochmal · Schwer · Gut · Einfach)</dd>
    <dt><kbd>1</kbd>–<kbd>4</kbd></dt><dd>Quiz: Antwort A–D wählen</dd>
    <dt><kbd>Enter</kbd></dt><dd>Quiz: prüfen / weiter</dd>
    <dt><kbd>Esc</kbd></dt><dd>Kapitel-Sheet schließen</dd>
  </dl>`;
}

function renderPrint() {
  const pins = store.state.pinnedCheatSheet;
  el.print.innerHTML = `
    <header class="pr-head"><b>DIN-A4 Spickzettel · StudyOS WS 26/27</b><span>${plural(pins.length, 'Eintrag', 'Einträge')}</span></header>
    <div class="pr-cols">${pins.map(p => `
      <article class="pr-item">
        <h4>${esc(p.title)}</h4>
        <p>${esc(p.content)}</p>
        ${p.code ? `<pre>${esc(p.code)}</pre>` : ''}
      </article>`).join('')}</div>`;
}

/* ---------- View: Pfad (home) ---------- */
const PATH_X = [50, 76, 50, 24];
const ROW = 118;
const PATH_TOP = 64;

function renderPath() {
  const t = todayProgress();
  const dueAll = getDueCards('all').length;
  const meta = courseMeta(ui.course);
  const chs = ALL_DATA[ui.course].chapters.map(ch => ({ ...ch, courseId: ui.course }));
  const infos = chs.map(chapterInfo);
  const current = infos.findIndex(i => !i.done);
  const doneCount = infos.filter(i => i.done).length;
  const mastery = getCourseMastery(ui.course);
  const courseDue = getDueCards(ui.course).length;
  const points = [...chs, null].map((_, i) => ({ x: PATH_X[i % PATH_X.length], y: PATH_TOP + i * ROW }));
  const height = points[points.length - 1].y + 64;
  const curve = pts => pts.map((p, i) => i === 0 ? `M${p.x} ${p.y}` : `C${pts[i - 1].x} ${pts[i - 1].y + ROW * 0.55} ${p.x} ${p.y - ROW * 0.55} ${p.x} ${p.y}`).join(' ');
  const reached = current === -1 ? points.length : current + 1;
  const goalLeft = Math.max(0, t.goal - t.done);
  const anyProgress = infos.some(i => i.seen > 0 || i.feynmanOk);

  const nodes = chs.map((ch, i) => {
    const info = infos[i];
    const p = points[i];
    const state = info.done ? 'is-done' : i === current ? 'is-current' : 'is-open';
    const side = i % 4 === 0 || i % 4 === 3 ? 'right' : 'left';
    const pos = side === 'right' ? `left:calc(${p.x}% + 48px)` : `right:calc(${100 - p.x}% + 48px)`;
    const avail = side === 'right' ? 100 - p.x : p.x;
    return `
      <button class="node ${state}" style="left:${p.x}%;top:${p.y}px" data-chapter="${ch.id}" aria-label="Kapitel ${i + 1}: ${esc(chapterTitle(ch))} – ${info.done ? 'erledigt' : i === current ? 'aktuell' : 'offen'}">
        ${ring(info.pct, { size: 86, stroke: 5, cls: 'node-ring' })}
        <span class="node-core">${info.done ? ICON.check : `<b>${i + 1}</b>`}</span>
        ${info.crown ? `<span class="node-crown" title="Alle Karten gemeistert">${ICON.crown}</span>` : ''}
        ${info.due && info.n ? `<span class="node-due" title="${info.due} fällige Karten">${info.due}</span>` : ''}
        ${i === current ? `<span class="node-bubble">${anyProgress ? 'Weiter' : 'Start'}</span>` : ''}
      </button>
      <div class="node-label is-${side}" style="${pos};top:${p.y}px;max-width:calc(${avail}% - 56px)">
        <b>${esc(chapterTitle(ch))}</b>
        <small>${info.seen}/${info.n} Karten${info.feynmanOk ? ' · Feynman ✓' : ''}</small>
      </div>`;
  }).join('');
  const tp = points[points.length - 1];
  const allDone = current === -1;
  const trophySide = (chs.length % 4 === 0 || chs.length % 4 === 3) ? 'right' : 'left';
  const trophyPos = trophySide === 'right' ? `left:calc(${tp.x}% + 48px)` : `right:calc(${100 - tp.x}% + 48px)`;

  return `
    <section class="today">
      <div class="today-ring">${ring(t.pct / 100, { size: 76, stroke: 9, cls: 'ring-brand' })}<span><b>${t.done}</b><small>/${t.goal}</small></span></div>
      <div class="today-text">
        <p class="eyebrow">Heute</p>
        <h1>${t.done >= t.goal ? 'Tagesziel geschafft!' : `Noch ${plural(goalLeft, 'Schritt', 'Schritte')} zum Tagesziel`}</h1>
        <p class="muted">Serie ${esc(streakLabel())} · ${t.reviews} Karten · ${t.quizzes} Fragen · ${t.minutes} Min</p>
      </div>
      <button class="btn btn-rainbow btn-block" data-action="start-mixed">
        Gemischte Session starten <span class="pill">${dueAll} fällig</span>
      </button>
    </section>

    <section class="block">
      <div class="block-head"><h2>Nächste Termine</h2><a href="#/mehr/termine">Alle ${ICON.chevron}</a></div>
      <div class="hscroll">${allDeadlines().slice(0, 6).map(d => `
        <div class="dchip ${d.urgent ? 'is-urgent' : ''} ${d.daysLeft <= 3 ? 'is-soon' : ''}" style="--c:${d.color}">
          <span class="dchip-left">${daysLeftLabel(d.daysLeft)}</span>
          <b>${esc(d.label)}</b>
          <small>${d.icon} ${esc(d.courseShort)} · ${formatDate(d.date)}</small>
        </div>`).join('') || '<p class="muted">Keine anstehenden Termine.</p>'}</div>
    </section>

    <section class="block">
      <div class="block-head"><h2>Dein Pfad</h2></div>
      <div class="course-switch" role="tablist" aria-label="Kurs wählen">${COURSES_META.map(c => {
        const m = getCourseMastery(c.id);
        const due = getDueCards(c.id).length;
        const sel = c.id === ui.course;
        return `<button class="cchip ${sel ? 'is-active' : ''}" role="tab" aria-selected="${sel}" data-course="${c.id}" style="--c:${c.color}">
          <span class="cchip-ic">${c.icon}</span>
          <b>${esc(c.short)}</b>
          <small>${m}%</small>
          ${due ? `<span class="cchip-due" title="${due} fällig">${due}</span>` : ''}
        </button>`;
      }).join('')}</div>
    </section>

    <section class="banner" style="--c:${meta.color}">
      <div class="banner-top">
        <span class="banner-ic">${meta.icon}</span>
        <div class="banner-title"><h2>${esc(meta.title)}</h2><p>${esc(meta.prof)}</p></div>
        <div class="banner-ring" title="Kurs-Mastery">${ring(mastery / 100, { size: 54, stroke: 6 })}<span>${mastery}%</span></div>
      </div>
      <p class="banner-stats"><span>${doneCount}/${chs.length} Kapitel erledigt</span><span>${courseDue} Karten fällig</span><span>${esc(meta.examInfo.period)}</span></p>
      <div class="banner-actions">
        <button class="btn btn-onc" data-action="course-cards" data-course-id="${ui.course}">${ICON.cards} Karten</button>
        <button class="btn btn-onc" data-action="course-quiz" data-course-id="${ui.course}">${ICON.quiz} Quiz</button>
        <button class="btn btn-onc" data-action="course-sheet" data-course-id="${ui.course}">${ICON.doc} Prüfung &amp; PDFs</button>
      </div>
    </section>

    <section class="path" style="--c:${meta.color};height:${height}px" aria-label="Lernpfad ${esc(meta.short)}">
      <svg class="path-svg" viewBox="0 0 100 ${height}" preserveAspectRatio="none" aria-hidden="true">
        <path class="path-track" d="${curve(points)}" vector-effect="non-scaling-stroke"/>
        ${reached > 1 ? `<path class="path-done" d="${curve(points.slice(0, reached))}" vector-effect="non-scaling-stroke"/>` : ''}
      </svg>
      ${nodes}
      <button class="node node-trophy ${allDone ? 'is-done' : 'is-open'}" style="left:${tp.x}%;top:${tp.y}px" data-action="course-sheet" data-course-id="${ui.course}" aria-label="Prüfung: Infos und Material">
        <span class="node-core">${ICON.trophy}</span>
      </button>
      <div class="node-label is-${trophySide}" style="${trophyPos};top:${tp.y}px;max-width:calc(${trophySide === 'right' ? 100 - tp.x : tp.x}% - 56px)">
        <b>Prüfung</b><small>${esc(meta.examInfo.type)}</small>
      </div>
    </section>
    <p class="path-legend" style="--c:${meta.color}"><span><i class="lg lg-done"></i>erledigt</span><span><i class="lg lg-cur"></i>aktuell</span><span><i class="lg lg-open"></i>offen</span><span class="muted">Erledigt = Feynman erklärt + alle Karten gesehen</span></p>`;
}

/* ---------- Bottom sheets ---------- */
function openSheet(html, accent) {
  el.sheet.style.setProperty('--c', accent);
  el.sheet.innerHTML = html;
  el.sheet.scrollTop = 0;
  el.layer.hidden = false;
  ui.sheetOpen = true;
  requestAnimationFrame(() => requestAnimationFrame(() => el.layer.classList.add('is-open')));
  setTimeout(() => $('.sheet-x', el.sheet)?.focus({ preventScroll: true }), 60);
}

function closeSheet({ rerender = true } = {}) {
  if (!ui.sheetOpen) return;
  ui.sheetOpen = false;
  ui.sheetChapter = null;
  el.layer.classList.remove('is-open');
  setTimeout(() => { if (!ui.sheetOpen) { el.layer.hidden = true; el.sheet.innerHTML = ''; } }, 280);
  if (rerender) renderView({ keepScroll: true });
}

function chapterSteps(ch) {
  const info = chapterInfo(ch);
  const step = (ok, label, detail) => `<li class="${ok ? 'is-ok' : ''}"><span class="step-dot">${ok ? ICON.check : ''}</span><span><b>${label}</b><small>${detail}</small></span></li>`;
  return `
    <div class="sheet-status ${info.done ? 'is-done' : ''}">${info.done ? 'Kapitel erledigt' : 'In Arbeit'} · ${Math.round(info.pct * 100)}%</div>
    <ul class="steps">
      ${step(info.cardsOk, 'Karten gesehen', `${info.seen}/${info.n} · ${info.due} fällig`)}
      ${step(info.feynmanOk, 'Feynman erklärt', 'Text oder alle Kernpunkte')}
      ${step(info.crown, 'Gemeistert', `${info.mastered}/${info.n} Karten ≥ 14 T`)}
    </ul>`;
}

function openChapter(id) {
  const ch = chapterById(id);
  if (!ch) return;
  const meta = courseMeta(ch.courseId);
  const fe = getFeynman(id);
  const pinned = store.isPinned(ch.cheatSheet.id);
  const info = chapterInfo(ch);
  const qn = ALL_QUIZZES.filter(q => q.chapterId === id).length;
  const dg = ch.diagram && DIAGRAMS[ch.diagram];
  ui.sheetChapter = id;
  openSheet(`
    <header class="sheet-head">
      <span class="grab" aria-hidden="true"></span>
      <p class="sheet-kicker">${meta.icon} ${esc(meta.short)} · Kapitel ${chapterIndex(ch) + 1}${ch.badge ? ` <span class="tag">${esc(ch.badge)}</span>` : ''}</p>
      <h2>${esc(chapterTitle(ch))}</h2>
      <button class="icon-btn sheet-x" data-action="close-sheet" aria-label="Schließen">${ICON.x}</button>
    </header>
    <div class="sheet-body">
      <div id="ch-steps">${chapterSteps(ch)}</div>
      <div class="sheet-actions">
        <button class="btn btn-primary btn-block" data-action="chapter-cards" data-id="${id}" ${info.n ? '' : 'disabled'}>${ICON.cards} Karten dieses Kapitels üben <span class="pill">${info.n}</span></button>
        <div class="sheet-actions-row">
          <button class="btn btn-soft" data-action="chapter-quiz" data-id="${id}" ${qn ? '' : 'disabled'}>${ICON.quiz} Quiz (${qn})</button>
          <button class="btn btn-soft btn-pin ${pinned ? 'is-on' : ''}" data-action="pin" data-id="${id}" aria-pressed="${pinned}">${ICON.pin}<span>${pinned ? 'Auf Spickzettel' : 'Anpinnen'}</span></button>
        </div>
      </div>
      <section class="sheet-sec">
        <h3>Das Wichtigste</h3>
        <ul class="summary">${ch.summary.map(s => `<li>${s}</li>`).join('')}</ul>
      </section>
      ${dg ? `<section class="sheet-sec"><h3>Visualisiert</h3><figure class="diagram">${dg.svg}<figcaption>${esc(dg.title)}</figcaption></figure></section>` : ''}
      <section class="sheet-sec feynman">
        <h3>Feynman-Check</h3>
        <p class="prompt">${esc(ch.feynman.prompt)}</p>
        <label class="sr-only" for="feynman-text">Deine Erklärung</label>
        <textarea id="feynman-text" data-id="${id}" rows="6" placeholder="Erkläre es in eigenen Worten – so einfach, dass es ein Erstsemester versteht …">${esc(fe.text)}</textarea>
        <p class="hint">Vergleiche mit den Kernpunkten und hake ab, was du abgedeckt hast:</p>
        <ul class="rubric">${ch.feynman.rubric.map((r, i) => `
          <li><label><input type="checkbox" data-rubric="${i}" data-id="${id}" ${fe.checkedPoints.includes(i) ? 'checked' : ''}><span class="box">${ICON.check}</span><span>${esc(r)}</span></label></li>`).join('')}</ul>
      </section>
    </div>`, meta.color);
}

function openCourse(cid) {
  const meta = courseMeta(cid);
  const st = cardStats(cid);
  const m = getCourseMastery(cid);
  const dls = allDeadlines().filter(d => d.courseId === cid);
  const due = getDueCards(cid).length;
  const qn = ALL_QUIZZES.filter(q => q.courseId === cid).length;
  const seg = (k, label) => st[k] ? `<i class="seg-${k}" style="flex:${st[k]}" title="${label}: ${st[k]}"></i>` : '';
  openSheet(`
    <header class="sheet-head">
      <span class="grab" aria-hidden="true"></span>
      <p class="sheet-kicker">${meta.icon} ${esc(meta.short)} · Prüfung &amp; Material</p>
      <h2>${esc(meta.title)}</h2>
      <button class="icon-btn sheet-x" data-action="close-sheet" aria-label="Schließen">${ICON.x}</button>
    </header>
    <div class="sheet-body">
      <p class="muted">${esc(meta.subtitle)}</p>
      <dl class="exam">
        <div><dt>Format</dt><dd>${esc(meta.examInfo.type)}</dd></div>
        <div><dt>Hilfsmittel</dt><dd>${esc(meta.examInfo.aid)}</dd></div>
        <div><dt>PVL</dt><dd>${esc(meta.examInfo.pvl)}</dd></div>
        <div><dt>Zeitraum</dt><dd>${esc(meta.examInfo.period)}</dd></div>
      </dl>
      <section class="sheet-sec">
        <h3>Fortschritt · ${m}% Mastery</h3>
        <div class="stack">${seg('mastered', 'Gemeistert')}${seg('learning', 'Lernen')}${seg('due', 'Fällig')}${seg('new', 'Neu')}</div>
        <p class="stack-legend"><span><i class="seg-mastered"></i>${st.mastered} gemeistert</span><span><i class="seg-learning"></i>${st.learning} lernen</span><span><i class="seg-due"></i>${st.due} fällig</span><span><i class="seg-new"></i>${st.new} neu</span></p>
        <div class="sheet-actions-row">
          <button class="btn btn-primary" data-action="course-cards" data-course-id="${cid}" title="${due} fällige Karten">${ICON.cards} Karten <span class="pill">${due}</span></button>
          <button class="btn btn-soft" data-action="course-quiz" data-course-id="${cid}">${ICON.quiz} Quiz (${qn})</button>
        </div>
      </section>
      ${dls.length ? `<section class="sheet-sec"><h3>Termine</h3><ul class="dl-list">${dls.map(deadlineRow).join('')}</ul></section>` : ''}
      <section class="sheet-sec">
        <h3>Material (${meta.pdfs.length} PDFs)</h3>
        <ul class="pdfs">${meta.pdfs.map(p => `
          <li><a href="${pdfHref(p.path)}" target="_blank" rel="noopener">
            <span class="pdf-ic">${ICON.doc}</span><span class="pdf-t">${esc(p.title)}</span><span class="tag">${esc(p.tag)}</span>
          </a></li>`).join('')}</ul>
      </section>
    </div>`, meta.color);
}

/* ---------- View: Karten (spaced repetition) ---------- */
function startCards({ filter = 'all', chapter = null, includeAll = false } = {}) {
  let queue;
  if (chapter) {
    queue = buildFlashcardQueue(filter, true).filter(c => c.chapterId === chapter);
    queue.sort((a, b) => Number(isDue(store.state.cards[b.id])) - Number(isDue(store.state.cards[a.id])));
  } else {
    queue = buildFlashcardQueue(filter, includeAll);
  }
  Object.assign(cards, { started: true, filter, chapter, includeAll: chapter ? true : includeAll, queue, pos: 0, revealed: false, reviewed: 0, again: 0, busy: false });
}

function filterChips(kind) {
  const active = kind === 'cards' ? cards.filter : quiz.filter;
  const count = id => kind === 'cards' ? getDueCards(id).length : (id === 'all' ? ALL_QUIZZES.length : ALL_QUIZZES.filter(q => q.courseId === id).length);
  const unit = kind === 'cards' ? 'fällig' : 'Fragen';
  const chip = (id, label, color, icon) => `
    <button class="fchip ${active === id && !(kind === 'cards' ? cards.chapter : quiz.chapter) ? 'is-active' : ''}" data-filter="${kind}:${id}" style="--c:${color}" title="${count(id)} ${unit}">
      ${icon ? `<span>${icon}</span>` : ''}<b>${label}</b><span class="fchip-n">${count(id)}</span>
    </button>`;
  return `<div class="fchips" role="group" aria-label="Kurs-Filter">
    ${chip('all', 'Gemischt', 'var(--brand)', '')}
    ${COURSES_META.map(c => chip(c.id, esc(c.short), c.color, c.icon)).join('')}
  </div>`;
}

function chapterFilterNote(kind) {
  const id = kind === 'cards' ? cards.chapter : quiz.chapter;
  if (!id) return '';
  const ch = chapterById(id);
  return `<div class="chapter-note" style="--c:${courseMeta(ch.courseId).color}">
    <span>Kapitel: <b>${esc(chapterTitle(ch))}</b></span>
    <button class="icon-btn" data-action="clear-chapter" data-kind="${kind}" aria-label="Kapitel-Filter entfernen">${ICON.x}</button>
  </div>`;
}

function renderCards() {
  if (!cards.started) startCards({ filter: cards.filter });
  const card = cards.queue[cards.pos];
  const head = `
    <div class="view-head"><h1>Karten üben</h1><p>Spaced Repetition · ${cards.filter === 'all' && !cards.chapter ? 'alle Kurse verschachtelt (Interleaving)' : 'fokussiert'}</p></div>
    ${filterChips('cards')}
    ${chapterFilterNote('cards')}`;
  if (!card) return head + cardsDone();
  const meta = courseMeta(card.courseId);
  const ch = chapterById(card.chapterId);
  const status = getCardStatus(store.state.cards[card.id]);
  const statusLabel = { new: 'Neu', due: 'Fällig', learning: 'Lernen', mastered: 'Gemeistert' }[status];
  const iv = cards.revealed ? intervalsFor(card) : null;
  const left = cards.queue.length - cards.pos;
  return head + `
    <div class="session-bar">
      <div class="progress" style="--c:${meta.color}"><i style="width:${(cards.pos / cards.queue.length) * 100}%"></i></div>
      <span>${left} übrig</span>
    </div>
    <div class="deck ${left > 1 ? 'has-stack' : ''}">
      <article class="fcard ${cards.revealed ? 'is-revealed' : ''}" id="fcard" style="--c:${meta.color}" ${cards.revealed ? '' : 'role="button" tabindex="0" aria-label="Antwort aufdecken"'}>
        <div class="fcard-top">
          <span class="ctag">${meta.icon} ${esc(meta.short)}</span>
          ${card.examRelevant ? `<span class="exam-tag">${ICON.star} Klausurrelevant</span>` : ''}
          <span class="fcard-status st-${status}">${statusLabel}</span>
        </div>
        ${ch ? `<p class="fcard-chapter">${esc(chapterTitle(ch))}</p>` : ''}
        <div class="fcard-front pre">${rich(card.front)}</div>
        ${cards.revealed
          ? `<div class="fcard-back pre">${rich(card.back)}</div><p class="swipe-hint"><span>← Nochmal</span><span>wischen</span><span>Gut →</span></p>`
          : `<button class="btn btn-primary btn-block reveal" data-action="reveal">Antwort zeigen <kbd>Leertaste</kbd></button>`}
      </article>
    </div>
    ${cards.revealed
      ? `<div class="rate" role="group" aria-label="Wie gut wusstest du es?">${RATING_LABELS.map(r => `
          <button class="rate-btn r${r.value}" data-rate="${r.value}"><b>${r.label}</b><small>${iv[r.value]}</small><kbd>${r.key}</kbd></button>`).join('')}</div>`
      : `<p class="tip">Erst laut oder im Kopf antworten, dann aufdecken – das ist Active Recall.</p>`}`;
}

function cardsDone() {
  const scope = cards.chapter ? 'in diesem Kapitel' : cards.filter === 'all' ? 'in allen Kursen' : `in ${esc(courseMeta(cards.filter).short)}`;
  const finished = cards.reviewed > 0;
  return `
    <div class="done-state">
      <div class="done-badge">${finished ? ICON.trophy : ICON.check}</div>
      <h2>${finished ? 'Session geschafft!' : 'Alles erledigt'}</h2>
      <p>${finished
        ? `${plural(cards.reviewed, 'Bewertung', 'Bewertungen')}${cards.again ? `, davon ${cards.again}× „Nochmal“` : ''}. Dein Gedächtnis dankt dir.`
        : `Gerade sind keine Karten ${scope} fällig.`}</p>
      <div class="done-actions">
        <button class="btn btn-primary btn-block" data-action="cards-all">Alle Karten nochmal üben</button>
        <button class="btn btn-soft btn-block" data-action="goto-quiz">Weiter zum Quiz</button>
      </div>
    </div>`;
}

function reveal() {
  if (cards.revealed || !cards.queue[cards.pos]) return;
  cards.revealed = true;
  renderView({ keepScroll: true });
}

function rate(value) {
  const card = cards.queue[cards.pos];
  if (!card || !cards.revealed || cards.busy) return;
  cards.busy = true;
  const fc = $('#fcard');
  if (fc) {
    fc.style.transition = 'transform .24s ease-in, opacity .24s ease-in';
    const dir = value === 1 ? -1 : value === 2 ? 0 : 1;
    fc.style.transform = dir === 0 ? 'translateY(40px) scale(.94)' : `translateX(${dir * 120}%) rotate(${dir * 14}deg)`;
    fc.style.opacity = '0';
  }
  setTimeout(() => {
    const requeue = rateCard(card, value);
    if (requeue) {
      cards.queue.push(card);
      cards.again += 1;
      toast('Kommt am Ende der Runde nochmal dran', 'info');
    }
    cards.reviewed += 1;
    cards.pos += 1;
    cards.revealed = false;
    cards.busy = false;
    if (cards.pos >= cards.queue.length) burst();
    renderView({ keepScroll: true });
  }, 220);
}

function bindSwipe() {
  const fc = $('#fcard');
  if (!fc || !cards.revealed) return;
  let startX = 0, startY = 0, dx = 0, active = false;
  fc.addEventListener('pointerdown', e => {
    if (e.target.closest('button') || e.button !== 0) return;
    active = true; startX = e.clientX; startY = e.clientY; dx = 0;
    fc.setPointerCapture(e.pointerId);
    fc.style.transition = 'none';
  });
  fc.addEventListener('pointermove', e => {
    if (!active) return;
    dx = e.clientX - startX;
    if (Math.abs(e.clientY - startY) > Math.abs(dx) * 1.4 && Math.abs(dx) < 12) return;
    fc.style.transform = `translateX(${dx}px) rotate(${dx / 22}deg)`;
    fc.classList.toggle('lean-left', dx < -50);
    fc.classList.toggle('lean-right', dx > 50);
  });
  const end = () => {
    if (!active) return;
    active = false;
    if (dx < -90) rate(1);
    else if (dx > 90) rate(3);
    else {
      fc.style.transition = 'transform .25s cubic-bezier(.3,1.5,.6,1)';
      fc.style.transform = '';
      fc.classList.remove('lean-left', 'lean-right');
    }
  };
  fc.addEventListener('pointerup', end);
  fc.addEventListener('pointercancel', end);
}

/* ---------- View: Quiz ---------- */
function startQuiz({ filter = 'all', chapter = null } = {}) {
  let queue = buildQuizQueue(filter);
  if (chapter) queue = queue.filter(q => q.chapterId === chapter);
  Object.assign(quiz, { started: true, filter, chapter, queue, pos: 0, selected: null, confidence: 'medium', result: null, correct: 0, answered: 0, over: 0 });
}

function renderQuiz() {
  if (!quiz.started) startQuiz({ filter: quiz.filter });
  const q = quiz.queue[quiz.pos];
  const head = `
    <div class="view-head"><h1>Quiz</h1><p>Retrieval Practice mit Konfidenz-Kalibrierung</p></div>
    ${filterChips('quiz')}
    ${chapterFilterNote('quiz')}`;
  if (!q) return head + quizDone();
  const meta = courseMeta(q.courseId);
  const r = quiz.result;
  const optCls = i => {
    if (!r) return quiz.selected === i ? 'is-selected' : '';
    if (i === q.answer) return 'is-correct';
    if (i === quiz.selected) return 'is-wrong';
    return 'is-dim';
  };
  return head + `
    <div class="session-bar">
      <div class="progress" style="--c:${meta.color}"><i style="width:${(quiz.pos / quiz.queue.length) * 100}%"></i></div>
      <span>${quiz.pos + 1}/${quiz.queue.length}</span>
    </div>
    <article class="qcard" style="--c:${meta.color}">
      <div class="fcard-top">
        <span class="ctag">${meta.icon} ${esc(meta.short)}</span>
        ${q.examStyle ? `<span class="exam-tag">${ICON.star} ${esc(q.examStyle)}</span>` : ''}
      </div>
      <h2 class="q-text pre">${rich(q.question)}</h2>
      ${q.code ? `<pre class="code"><code>${esc(q.code)}</code></pre>` : ''}
    </article>
    <div class="options" style="--c:${meta.color}">${q.options.map((o, i) => `
      <button class="opt ${optCls(i)}" data-opt="${i}" ${r ? 'disabled' : ''} aria-pressed="${quiz.selected === i}">
        <span class="opt-key">${'ABCDEF'[i]}</span><span class="opt-t">${rich(o)}</span>
        ${r && i === q.answer ? `<span class="opt-ic">${ICON.check}</span>` : ''}${r && i === quiz.selected && i !== q.answer ? `<span class="opt-ic">${ICON.x}</span>` : ''}
      </button>`).join('')}</div>
    ${r ? `
      <div class="feedback ${r.correct ? 'is-ok' : 'is-bad'}">
        <h3>${r.correct ? `${ICON.check} Richtig!` : `${ICON.x} Leider falsch`}</h3>
        ${r.overconfident ? `<p class="warn"><b>Hyperkorrektur:</b> Du warst dir 100% sicher und lagst daneben. Genau solche Fehler merkt sich das Gehirn besonders gut – lies die Erklärung jetzt bewusst.</p>` : ''}
        ${!r.correct ? `<p class="solution">Richtig ist <b>${'ABCDEF'[q.answer]}</b>: ${rich(q.options[q.answer])}</p>` : ''}
        <p class="pre">${rich(q.explanation)}</p>
        <button class="btn btn-block ${r.correct ? 'btn-good' : 'btn-bad'}" data-action="quiz-next">${quiz.pos + 1 >= quiz.queue.length ? 'Ergebnis ansehen' : 'Weiter'} <kbd>Enter</kbd></button>
      </div>` : `
      <div class="conf">
        <p>Wie sicher bist du?</p>
        <div class="seg" role="radiogroup" aria-label="Konfidenz">${CONFIDENCE_LEVELS.map(c => `
          <button class="seg-btn ${quiz.confidence === c.value ? 'is-active' : ''}" role="radio" aria-checked="${quiz.confidence === c.value}" data-conf="${c.value}">${esc(c.label)}</button>`).join('')}</div>
      </div>
      <button class="btn btn-primary btn-block btn-check" data-action="quiz-submit" style="--c:${meta.color}" ${quiz.selected === null ? 'disabled' : ''}>Antwort prüfen <kbd>Enter</kbd></button>`}`;
}

function quizDone() {
  if (!quiz.queue.length) {
    return `<div class="done-state"><h2>Keine Fragen</h2><p>Für diese Auswahl gibt es keine Quizfragen.</p>
      <button class="btn btn-primary btn-block" data-action="quiz-restart-all">Gemischtes Quiz starten</button></div>`;
  }
  const pct = quiz.answered ? quiz.correct / quiz.answered : 0;
  return `
    <div class="done-state">
      <div class="done-ring">${ring(pct, { size: 120, stroke: 12, cls: 'ring-brand' })}<span>${Math.round(pct * 100)}%</span></div>
      <h2>Quiz beendet</h2>
      <p>${quiz.correct} von ${quiz.answered} richtig${quiz.over ? ` · ${quiz.over}× überkonfident (100% sicher, aber falsch)` : ''}.</p>
      <div class="done-actions">
        <button class="btn btn-primary btn-block" data-action="quiz-restart">Nochmal starten</button>
        <button class="btn btn-soft btn-block" data-action="goto-cards">Zu den Karten</button>
      </div>
    </div>`;
}

function selectOption(i) {
  const q = quiz.queue[quiz.pos];
  if (!q || quiz.result || i < 0 || i >= q.options.length) return;
  quiz.selected = i;
  el.screen.querySelectorAll('.opt').forEach((b, idx) => {
    b.classList.toggle('is-selected', idx === i);
    b.setAttribute('aria-pressed', String(idx === i));
  });
  const btn = $('[data-action="quiz-submit"]', el.screen);
  if (btn) btn.disabled = false;
}

function submitCurrentQuiz() {
  const q = quiz.queue[quiz.pos];
  if (!q || quiz.result || quiz.selected === null) return;
  quiz.result = submitQuiz(q, quiz.selected, quiz.confidence);
  quiz.answered += 1;
  if (quiz.result.correct) quiz.correct += 1;
  if (quiz.result.overconfident) quiz.over += 1;
  renderView({ keepScroll: true });
  $('.feedback', el.screen)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function nextQuiz() {
  if (!quiz.result) return;
  quiz.pos += 1;
  quiz.selected = null;
  quiz.result = null;
  quiz.confidence = 'medium';
  if (quiz.pos >= quiz.queue.length) burst();
  renderView();
}

/* ---------- View: Fokus (Pomodoro) ---------- */
const POMO_R = 108;
const POMO_C = 2 * Math.PI * POMO_R;
const pomo = new Pomodoro({
  onChange: p => updatePomo(p),
  onFinish: minutes => {
    toast(`${minutes} Minuten Fokus geschafft – Zeit für eine Pause!`, 'good');
    burst();
    if (route().tab === 'fokus') renderView({ keepScroll: true });
  },
});

function renderFocus() {
  const t = todayProgress();
  return `
    <div class="view-head"><h1>Fokus</h1><p>Pomodoro: konzentriert lernen, dann bewusst Pause machen.</p></div>
    <section class="timer">
      <div class="seg seg-mode" role="radiogroup" aria-label="Dauer">
        <button class="seg-btn ${pomo.mode === 25 ? 'is-active' : ''}" data-action="pomo-mode" data-mode="25" role="radio" aria-checked="${pomo.mode === 25}">25 Min</button>
        <button class="seg-btn ${pomo.mode === 50 ? 'is-active' : ''}" data-action="pomo-mode" data-mode="50" role="radio" aria-checked="${pomo.mode === 50}">50 Min</button>
      </div>
      <div class="timer-dial">
        <svg viewBox="0 0 240 240" aria-hidden="true">
          <circle class="ring-track" cx="120" cy="120" r="${POMO_R}" stroke-width="14"/>
          <circle class="ring-fill" id="pomo-ring" cx="120" cy="120" r="${POMO_R}" stroke-width="14" stroke-dasharray="${POMO_C.toFixed(2)}" stroke-dashoffset="${(POMO_C * (1 - pomo.progress)).toFixed(2)}" transform="rotate(-90 120 120)"/>
        </svg>
        <div class="timer-center">
          <b id="pomo-time">${pomo.display}</b>
          <small id="pomo-state">${pomo.running ? 'Fokus läuft' : pomo.progress > 0 ? 'Pausiert' : 'Bereit'}</small>
        </div>
      </div>
      <div class="timer-ctrl">
        <button class="icon-btn icon-btn-lg" data-action="pomo-reset" aria-label="Zurücksetzen">${ICON.reset}</button>
        <button class="btn btn-primary btn-play" id="pomo-toggle" data-action="pomo-toggle">${pomo.running ? `${ICON.pause} Pause` : `${ICON.play} Start`}</button>
        <a class="icon-btn icon-btn-lg" href="#/ueben" aria-label="Karten öffnen">${ICON.cards}</a>
      </div>
    </section>
    <section class="card">
      <div class="card-head"><h3>Fokus-Minuten</h3><span class="muted">heute ${t.minutes} Min</span></div>
      ${weekBars('minutes')}
    </section>
    <section class="card tips">
      <h3>So nutzt du den Timer</h3>
      <ol>
        <li>Wähle <b>25 Min</b> für Karten &amp; Quiz, <b>50 Min</b> für Feynman-Texte oder Übungsblätter.</li>
        <li>Handy weg, ein Tab offen. Der Timer läuft weiter, während du in Karten oder Quiz wechselst – oben im Header siehst du die Restzeit.</li>
        <li>Nach Ablauf: 5 Minuten echte Pause. Die Minuten zählen in dein Tagesprotokoll.</li>
      </ol>
    </section>`;
}

function updatePomo(p) {
  const time = $('#pomo-time');
  if (time) {
    time.textContent = p.display;
    $('#pomo-ring').setAttribute('stroke-dashoffset', (POMO_C * (1 - p.progress)).toFixed(2));
    $('#pomo-state').textContent = p.running ? 'Fokus läuft' : p.progress > 0 ? 'Pausiert' : 'Bereit';
    $('#pomo-toggle').innerHTML = p.running ? `${ICON.pause} Pause` : `${ICON.play} Start`;
    el.screen.querySelectorAll('[data-action="pomo-mode"]').forEach(b => {
      const on = Number(b.dataset.mode) === p.mode;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-checked', String(on));
    });
  }
  const pill = $('#pomo-pill');
  if (pill) {
    pill.hidden = !p.running;
    $('#pomo-pill-time').textContent = p.display;
  }
  const liveDot = !!$('.tab-dot-live', el.tabbar);
  if (liveDot !== p.running) renderTabbar();
}

/* ---------- View: Mehr (hub + sub pages) ---------- */
function renderMore() {
  const st = cardStats('all');
  const cal = calibrationStats();
  const om = overallMastery();
  const pins = store.state.pinnedCheatSheet.length;
  const dls = allDeadlines().length;
  const dark = store.state.theme === 'dark';
  const calRow = c => {
    const s = cal[c.value];
    const acc = s.n ? Math.round((s.ok / s.n) * 100) : null;
    return `<li><span>${esc(c.label)}</span><span class="meter"><i style="width:${acc ?? 0}%"></i></span><b>${acc === null ? '–' : `${acc}%`}</b><small>${s.n}×</small></li>`;
  };
  const tile = (href, icon, title, sub, color) => `
    <a class="tile" href="${href}" style="--c:${color}"><span class="tile-ic">${icon}</span><span class="tile-t"><b>${title}</b><small>${sub}</small></span>${ICON.chevron}</a>`;
  return `
    <div class="view-head"><h1>Mehr</h1><p>Dein Profil, Werkzeuge und Einstellungen</p></div>
    <section class="card profile">
      <div class="profile-ring">${ring(om / 100, { size: 92, stroke: 10, cls: 'ring-brand' })}<span><b>${om}%</b><small>Mastery</small></span></div>
      <div class="profile-stats">
        <div><b>${store.state.streak.count}</b><small>Tage Serie</small></div>
        <div><b>${st.mastered}</b><small>gemeistert</small></div>
        <div><b>${st.learning}</b><small>im Lernen</small></div>
        <div><b>${st.due + st.new}</b><small>fällig/neu</small></div>
      </div>
    </section>
    <nav class="tiles" aria-label="Werkzeuge">
      ${tile('#/mehr/email', ICON.mail, 'GPAS E-Mail-Coach', 'Exam Email mit Live-Feedback', courseMeta('english').color)}
      ${tile('#/mehr/spickzettel', ICON.sheet, 'DIN-A4 Spickzettel', `${plural(pins, 'Eintrag', 'Einträge')} · drucken`, courseMeta('gdp1').color)}
      ${tile('#/mehr/termine', ICON.calendar, 'Termine & Fristen', `${dls} anstehend`, courseMeta('ics').color)}
      ${tile('#/mehr/methoden', ICON.brain, 'Methoden & Backup', 'Lernwissenschaft, Export, Reset', courseMeta('gdp2').color)}
    </nav>
    <section class="card">
      <div class="card-head"><h3>Aktivität (7 Tage)</h3><span class="muted">Karten + Fragen</span></div>
      ${weekBars('total')}
    </section>
    <section class="card">
      <div class="card-head"><h3>Kalibrierung</h3><span class="muted">Trefferquote je Sicherheit</span></div>
      <ul class="cal">${CONFIDENCE_LEVELS.map(calRow).join('')}</ul>
      <p class="hint">Gut kalibriert heißt: „100% sicher“ sollte auch nahe 100% richtig sein.</p>
    </section>
    <section class="card setting">
      <div><h3>Dunkles Design</h3><p class="muted">Wird mit allen StudyOS-Versionen geteilt.</p></div>
      <button class="switch ${dark ? 'is-on' : ''}" data-action="theme" role="switch" aria-checked="${dark}" aria-label="Dunkles Design"><i></i></button>
    </section>`;
}

const backLink = `<a class="back" href="#/mehr">${ICON.back} Mehr</a>`;

function renderEmail() {
  const prompts = ENGLISH_DATA.emailPrompts;
  const p = prompts[mail.idx];
  const text = mail.texts[p.id] ?? '';
  const dg = DIAGRAMS['gpas-email'];
  return `
    ${backLink}
    <div class="view-head"><h1>GPAS E-Mail-Coach</h1><p>Semi-formal exam email · 120–180 words</p></div>
    <div class="fchips" role="group" aria-label="Szenario">${prompts.map((x, i) => `
      <button class="fchip ${i === mail.idx ? 'is-active' : ''}" data-prompt="${i}" style="--c:${courseMeta('english').color}"><b>${esc(x.title)}</b></button>`).join('')}</div>
    <section class="card scenario" style="--c:${courseMeta('english').color}">
      <p class="eyebrow">Scenario</p>
      <p class="pre">${esc(p.scenario)}</p>
    </section>
    <details class="card gpas">
      <summary><b>${esc(dg.title)}</b><span class="muted">Schema anzeigen</span></summary>
      <figure class="diagram">${dg.svg}</figure>
    </details>
    <section class="editor">
      <label for="email-text" class="eyebrow">Your email</label>
      <textarea id="email-text" rows="14" spellcheck="true" placeholder="Dear Ms Miller,&#10;&#10;Thank you for your email regarding …">${esc(text)}</textarea>
    </section>
    <section class="card email-fb" id="email-fb" aria-live="polite">${emailFeedback(text, p)}</section>`;
}

function emailFeedback(text, prompt) {
  const a = analyzeEmail(text, prompt);
  const scale = 220;
  return `
    <div class="fb-top">
      <div class="wc ${a.wordsOk ? 'is-ok' : ''}">
        <div class="wc-row"><b>${a.words}</b><span>Wörter</span><small>${a.wordsOk ? 'im Zielbereich' : a.words < 120 ? 'Ziel 120–180' : 'zu lang – kürzen'}</small></div>
        <div class="wc-bar"><span class="wc-zone" style="left:${(120 / scale) * 100}%;width:${(60 / scale) * 100}%"></span><i style="width:${Math.min(100, (a.words / scale) * 100)}%"></i></div>
      </div>
      <div class="fb-score">${ring(a.score / 6, { size: 56, stroke: 6 })}<span>${a.score}/6</span></div>
    </div>
    <ul class="checks">${a.checks.map(c => `<li class="${c.ok ? 'is-ok' : ''}"><span class="step-dot">${c.ok ? ICON.check : ''}</span>${esc(c.label)}</li>`).join('')}</ul>
    <p class="eyebrow">Keywords ${a.kwHits}/${a.keywords.length}</p>
    <div class="kws">${a.keywords.map(k => `<span class="kw ${k.hit ? 'is-hit' : ''}">${esc(k.word)}</span>`).join('')}</div>`;
}

function renderSheet() {
  const pins = store.state.pinnedCheatSheet;
  return `
    ${backLink}
    <div class="view-head"><h1>DIN-A4 Spickzettel</h1><p>${plural(pins.length, 'Eintrag', 'Einträge')} · druckt kompakt in 2 Spalten auf Weiß</p></div>
    <div class="action-grid">
      <button class="btn btn-soft" data-action="pins-load" data-ids="gdp1" style="--c:${courseMeta('gdp1').color}">＋ GP1 Essentials</button>
      <button class="btn btn-soft" data-action="pins-load" data-ids="ics" style="--c:${courseMeta('ics').color}">＋ ICS Essentials</button>
      <button class="btn btn-soft" data-action="pins-load" data-ids="all">＋ Alle Essentials</button>
      <button class="btn btn-soft btn-danger" data-action="pins-clear" ${pins.length ? '' : 'disabled'}>${ICON.trash} Leeren</button>
    </div>
    <button class="btn btn-primary btn-block" data-action="print" ${pins.length ? '' : 'disabled'}>${ICON.printer} Drucken / als PDF speichern</button>
    ${pins.length ? `<div class="paper">${pins.map(p => {
      const meta = courseMeta(p.courseId);
      return `<article class="paper-item" style="--c:${meta.color}">
        <header><span class="ctag">${meta.icon} ${esc(meta.short)}</span><h3>${esc(p.title)}</h3>
          <button class="icon-btn" data-action="unpin" data-pin="${esc(p.id)}" aria-label="Vom Spickzettel entfernen">${ICON.x}</button></header>
        <p>${esc(p.content)}</p>
        ${p.code ? `<pre class="code"><code>${esc(p.code)}</code></pre>` : ''}
      </article>`;
    }).join('')}</div>` : `
      <div class="done-state">
        <div class="done-badge">${ICON.pin}</div>
        <h2>Noch leer</h2>
        <p>Lade oben die Essentials oder pinne Kapitel direkt im Pfad (Kapitel antippen → Anpinnen).</p>
      </div>`}`;
}

function renderDeadlines() {
  const list = allDeadlines({ includePast: ui.showPast });
  const groups = new Map();
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  for (const d of list) {
    const [y, m] = d.date.split('-');
    const key = `${months[Number(m) - 1]} ${y}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(d);
  }
  return `
    ${backLink}
    <div class="view-head"><h1>Termine &amp; Fristen</h1><p>Alle Kurse, chronologisch</p></div>
    <label class="check-inline"><input type="checkbox" data-action="toggle-past" ${ui.showPast ? 'checked' : ''}> Vergangene anzeigen</label>
    ${list.length ? [...groups].map(([k, ds]) => `
      <section class="card"><h3>${k}</h3><ul class="dl-list">${ds.map(deadlineRow).join('')}</ul></section>`).join('')
      : '<p class="muted">Keine Termine.</p>'}`;
}

function renderMethods() {
  const methods = [
    { icon: '🗓️', name: 'Spaced Repetition', text: 'Wiederholen kurz bevor du vergisst. Der SM-2-Algorithmus plant jede Karte neu – je leichter, desto größer der Abstand.', where: 'Karten-Tab: Bewertung 1–4 bestimmt das nächste Intervall.' },
    { icon: '🧠', name: 'Active Recall', text: 'Aktiv abrufen statt passiv lesen: Die Anstrengung beim Erinnern festigt das Wissen stärker als erneutes Lesen.', where: 'Karten erst beantworten, dann aufdecken; Quiz ohne Spickzettel.' },
    { icon: '🔀', name: 'Interleaving', text: 'Themen mischen statt blockweise lernen. Fühlt sich schwerer an, verbessert aber Transfer und Unterscheidungsfähigkeit.', where: '„Gemischte Session“ verschachtelt alle vier Kurse.' },
    { icon: '🖼️', name: 'Dual Coding', text: 'Wort und Bild kombinieren: Diagramme schaffen einen zweiten Gedächtnispfad neben dem Text.', where: 'Kapitel-Sheets mit Diagrammen (JVM, DOM, HTTP, GPAS …).' },
    { icon: '🎯', name: 'Feynman & Kalibrierung', text: 'Erkläre ein Thema in einfachen Worten – Lücken werden sofort sichtbar. Schätze vor jeder Antwort deine Sicherheit ein, um Überkonfidenz zu erkennen.', where: 'Feynman-Check pro Kapitel; Konfidenz im Quiz + Kalibrierung unter „Mehr“.' },
  ];
  return `
    ${backLink}
    <div class="view-head"><h1>Methoden &amp; Backup</h1><p>Warum der Pfad so funktioniert, wie er funktioniert</p></div>
    <div class="methods">${methods.map((m, i) => `
      <article class="method" style="--i:${i}">
        <span class="method-ic">${m.icon}</span>
        <div><h3>${m.name}</h3><p>${m.text}</p><p class="method-where">${m.where}</p></div>
      </article>`).join('')}</div>
    <section class="card">
      <h3>Backup</h3>
      <p class="muted">Dein Fortschritt liegt lokal im Browser und wird mit allen StudyOS-Versionen geteilt.</p>
      <div class="action-grid">
        <button class="btn btn-soft" data-action="backup">${ICON.download} Exportieren</button>
        <label class="btn btn-soft file-btn">${ICON.upload} Importieren<input type="file" id="import-file" accept="application/json,.json" class="sr-only"></label>
      </div>
      <button class="btn btn-soft btn-danger btn-block" data-action="reset">${ICON.trash} Fortschritt zurücksetzen</button>
    </section>
    <section class="card">
      <h3>Tastenkürzel</h3>
      ${shortcutTable()}
    </section>`;
}

/* ---------- Render dispatcher ---------- */
function renderView({ keepScroll = false } = {}) {
  const { tab, sub } = route();
  const scroll = el.screen.scrollTop;
  let html;
  if (tab === 'pfad') html = renderPath();
  else if (tab === 'ueben') html = renderCards();
  else if (tab === 'quiz') html = renderQuiz();
  else if (tab === 'fokus') html = renderFocus();
  else if (sub === 'email') html = renderEmail();
  else if (sub === 'spickzettel') html = renderSheet();
  else if (sub === 'termine') html = renderDeadlines();
  else if (sub === 'methoden') html = renderMethods();
  else html = renderMore();
  el.screen.innerHTML = `<div class="view view-${tab}${sub ? ` view-${sub}` : ''}">${html}</div>`;
  el.screen.scrollTop = keepScroll ? scroll : 0;
  if (tab === 'ueben') bindSwipe();
  renderTabbar();
}

function rerenderAll() {
  applyTheme();
  renderTop();
  renderSide();
  renderPrint();
  renderView({ keepScroll: true });
}

function applyTheme() {
  const theme = store.state.theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  $('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#121419' : '#f4f1ea');
}

/* ---------- Events ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-action], [data-course], [data-chapter], [data-rate], [data-opt], [data-conf], [data-filter], [data-prompt]');
  if (!t) return;
  const d = t.dataset;

  if (d.course && !d.action) {
    ui.course = d.course;
    localStorage.setItem(COURSE_KEY, d.course);
    if (route().tab !== 'pfad') go('#/pfad'); else renderView({ keepScroll: true });
    return;
  }
  if (d.chapter) return openChapter(d.chapter);
  if (d.rate) return rate(Number(d.rate));
  if (d.opt) return selectOption(Number(d.opt));
  if (d.conf) {
    quiz.confidence = d.conf;
    el.screen.querySelectorAll('[data-conf]').forEach(b => {
      b.classList.toggle('is-active', b === t);
      b.setAttribute('aria-checked', String(b === t));
    });
    return;
  }
  if (d.filter) {
    const [kind, id] = d.filter.split(':');
    if (kind === 'cards') startCards({ filter: id }); else startQuiz({ filter: id });
    return renderView({ keepScroll: true });
  }
  if (d.prompt) {
    mail.idx = Number(d.prompt);
    return renderView({ keepScroll: true });
  }

  switch (d.action) {
    case 'theme':
      store.toggleTheme();
      applyTheme();
      renderTop();
      if (route().tab === 'mehr' && !route().sub) renderView({ keepScroll: true });
      break;
    case 'start-mixed':
      closeSheet({ rerender: false });
      startCards({ filter: 'all' });
      go('#/ueben');
      break;
    case 'close-sheet':
      closeSheet();
      break;
    case 'course-sheet':
      openCourse(d.courseId);
      break;
    case 'course-cards':
      closeSheet({ rerender: false });
      startCards({ filter: d.courseId });
      go('#/ueben');
      break;
    case 'course-quiz':
      closeSheet({ rerender: false });
      startQuiz({ filter: d.courseId });
      go('#/quiz');
      break;
    case 'chapter-cards': {
      const ch = chapterById(d.id);
      closeSheet({ rerender: false });
      startCards({ filter: ch.courseId, chapter: ch.id });
      go('#/ueben');
      break;
    }
    case 'chapter-quiz': {
      const ch = chapterById(d.id);
      closeSheet({ rerender: false });
      startQuiz({ filter: ch.courseId, chapter: ch.id });
      go('#/quiz');
      break;
    }
    case 'pin': {
      const ch = chapterById(d.id);
      const on = togglePinChapter(ch);
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-pressed', String(on));
      $('span', t).textContent = on ? 'Auf Spickzettel' : 'Anpinnen';
      toast(on ? 'Auf den Spickzettel gepinnt' : 'Vom Spickzettel entfernt', on ? 'good' : 'info');
      break;
    }
    case 'clear-chapter':
      if (d.kind === 'cards') startCards({ filter: cards.filter }); else startQuiz({ filter: quiz.filter });
      renderView({ keepScroll: true });
      break;
    case 'reveal':
      reveal();
      break;
    case 'cards-all':
      startCards({ filter: cards.filter, chapter: cards.chapter, includeAll: true });
      renderView();
      break;
    case 'goto-quiz':
      if (cards.chapter) startQuiz({ filter: cards.filter, chapter: cards.chapter });
      else if (!quiz.started || quiz.filter !== cards.filter) startQuiz({ filter: cards.filter });
      go('#/quiz');
      break;
    case 'goto-cards':
      go('#/ueben');
      break;
    case 'quiz-submit':
      submitCurrentQuiz();
      break;
    case 'quiz-next':
      nextQuiz();
      break;
    case 'quiz-restart':
      startQuiz({ filter: quiz.filter, chapter: quiz.chapter });
      renderView();
      break;
    case 'quiz-restart-all':
      startQuiz({ filter: 'all' });
      renderView();
      break;
    case 'pomo-toggle':
      pomo.toggle();
      break;
    case 'pomo-reset':
      pomo.reset();
      break;
    case 'pomo-mode':
      if (Number(d.mode) !== pomo.mode) {
        if (pomo.running && !confirm('Laufenden Timer abbrechen und Dauer wechseln?')) return;
        pomo.switchMode();
      }
      break;
    case 'pins-load': {
      const ids = d.ids === 'all' ? COURSES_META.map(c => c.id) : [d.ids];
      const before = store.state.pinnedCheatSheet.length;
      loadCoursePins(ids);
      const added = store.state.pinnedCheatSheet.length - before;
      toast(added ? `${plural(added, 'Eintrag', 'Einträge')} hinzugefügt` : 'Schon alles auf dem Spickzettel', added ? 'good' : 'info');
      renderView({ keepScroll: true });
      break;
    }
    case 'pins-clear':
      if (!confirm('Alle Einträge vom Spickzettel entfernen?')) return;
      clearPins();
      toast('Spickzettel geleert', 'info');
      renderView({ keepScroll: true });
      break;
    case 'unpin': {
      const item = store.state.pinnedCheatSheet.find(p => p.id === d.pin);
      if (item) store.togglePin({ id: item.id });
      toast('Vom Spickzettel entfernt', 'info');
      renderView({ keepScroll: true });
      break;
    }
    case 'print':
      renderPrint();
      window.print();
      break;
    case 'backup':
      downloadBackup();
      toast('Backup heruntergeladen', 'good');
      break;
    case 'reset':
      if (!confirm('Wirklich den gesamten Lernfortschritt zurücksetzen? Das betrifft alle StudyOS-Versionen.')) return;
      resetProgress();
      cards.started = false;
      quiz.started = false;
      toast('Fortschritt zurückgesetzt', 'info');
      rerenderAll();
      break;
    default:
      break;
  }
});

document.addEventListener('change', async e => {
  const t = e.target;
  if (t.matches('[data-rubric]')) {
    toggleFeynmanPoint(t.dataset.id, Number(t.dataset.rubric), t.checked);
    refreshChapterSteps(t.dataset.id);
  } else if (t.id === 'import-file' && t.files?.[0]) {
    try {
      await importBackup(t.files[0]);
      cards.started = false;
      quiz.started = false;
      toast('Backup importiert', 'good');
      rerenderAll();
    } catch {
      toast('Import fehlgeschlagen: keine gültige Backup-Datei', 'bad');
    }
    t.value = '';
  } else if (t.matches('[data-action="toggle-past"]')) {
    ui.showPast = t.checked;
    renderView({ keepScroll: true });
  }
});

document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'feynman-text') {
    saveFeynmanText(t.dataset.id, t.value);
    refreshChapterSteps(t.dataset.id);
  } else if (t.id === 'email-text') {
    const p = ENGLISH_DATA.emailPrompts[mail.idx];
    mail.texts[p.id] = t.value;
    $('#email-fb').innerHTML = emailFeedback(t.value, p);
  }
});

function refreshChapterSteps(id) {
  const box = $('#ch-steps');
  if (box && ui.sheetChapter === id) box.innerHTML = chapterSteps(chapterById(id));
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && ui.sheetOpen) { closeSheet(); return; }
  if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey || ui.sheetOpen) return;
  const { tab } = route();
  if (tab === 'ueben') {
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      if (!cards.revealed) reveal();
    } else if (['1', '2', '3', '4'].includes(e.key) && cards.revealed) {
      e.preventDefault();
      rate(Number(e.key));
    } else if (e.key === 'Enter' && e.target.matches?.('#fcard')) {
      e.preventDefault();
      reveal();
    }
  } else if (tab === 'quiz') {
    if (/^[1-6]$/.test(e.key) && !quiz.result) {
      e.preventDefault();
      selectOption(Number(e.key) - 1);
    } else if (e.key === 'Enter') {
      if (quiz.result) { e.preventDefault(); nextQuiz(); }
      else if (quiz.selected !== null) { e.preventDefault(); submitCurrentQuiz(); }
    }
  }
});

// Tap on the unrevealed card reveals it (buttons inside handle themselves).
el.screen.addEventListener('click', e => {
  const fc = e.target.closest('#fcard');
  if (fc && !cards.revealed && !e.target.closest('button')) reveal();
});

// Drag the sheet's grab handle down to close.
(() => {
  let y0 = null;
  el.sheet.addEventListener('pointerdown', e => {
    if (!e.target.closest('.sheet-head') || e.target.closest('button')) return;
    y0 = e.clientY;
    el.sheet.setPointerCapture(e.pointerId);
    el.sheet.style.transition = 'none';
  });
  el.sheet.addEventListener('pointermove', e => {
    if (y0 === null) return;
    el.sheet.style.transform = `translateY(${Math.max(0, e.clientY - y0)}px)`;
  });
  const end = e => {
    if (y0 === null) return;
    const dy = e.clientY - y0;
    y0 = null;
    el.sheet.style.transition = '';
    el.sheet.style.transform = '';
    if (dy > 110) closeSheet();
  };
  el.sheet.addEventListener('pointerup', end);
  el.sheet.addEventListener('pointercancel', end);
})();

window.addEventListener('hashchange', () => {
  if (ui.sheetOpen) closeSheet({ rerender: false });
  renderView();
});

window.addEventListener('beforeprint', renderPrint);

store.subscribe(() => {
  renderTop();
  renderSide();
  renderPrint();
});

/* ---------- Boot ---------- */
applyTheme();
renderTop();
renderSide();
renderPrint();
renderView();
