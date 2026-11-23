// StudyOS WS26 — "Bento Glass" variant.
// macOS-inspired desktop: bento home grid, floating dock, glass windows per view.

import {
  COURSES_META, ENGLISH_DATA, DIAGRAMS, store,
  ALL_DATA, ALL_QUIZZES,
  courseMeta, escapeHtml, pdfHref,
  getDueCards, buildFlashcardQueue, rateCard, intervalsFor, RATING_LABELS, cardStats,
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
const stageEl = $('#app');
const dockEl = $('#dock');
const menubarEl = $('#menubar');

/** Escape plain text, keep line breaks and render `backtick` spans as inline code. */
const textBlock = (s) => escapeHtml(s).replace(/`([^`\n]+)`/g, '<code>$1</code>').replace(/\n/g, '<br>');

const ICONS = {
  home: '<rect x="3" y="3" width="7.5" height="9" rx="2"/><rect x="13.5" y="3" width="7.5" height="5" rx="2"/><rect x="13.5" y="11" width="7.5" height="10" rx="2"/><rect x="3" y="15" width="7.5" height="6" rx="2"/>',
  cards: '<rect x="3" y="7.5" width="14" height="13" rx="2.5"/><path d="M7 4h11.5A2.5 2.5 0 0 1 21 6.5V17"/>',
  quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.6 2.3c-.7.3-1.2 1-1.2 1.8v.5"/><path d="M12 17.2h.01"/>',
  courses: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  sheet: '<path d="M14 3H6.5A2.5 2.5 0 0 0 4 5.5v13A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h5"/>',
  methods: '<path d="M9 3h6M10 3v6l-5.6 9.4A2 2 0 0 0 6.1 21.5h11.8a2 2 0 0 0 1.7-3.1L14 9V3"/><path d="M7.2 15h9.6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a6.6 6.6 0 0 0 9.7 9.7z"/>',
  play: '<path d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l10.6-6.8a.8.8 0 0 0 0-1.4L9.2 4.5A.8.8 0 0 0 8 5.2z" fill="currentColor" stroke="none"/>',
  pause: '<rect x="6.5" y="5" width="4" height="14" rx="1.2" fill="currentColor" stroke="none"/><rect x="13.5" y="5" width="4" height="14" rx="1.2" fill="currentColor" stroke="none"/>',
  reset: '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5"/><path d="M3.5 3.5v5h5"/>',
  flame: '<path d="M12 22c4.1 0 7-2.8 7-6.8 0-3.7-2.5-6-4.1-8.2-.5 2-1.4 3.2-2.9 3.7.3-3.2-1-6.3-3.4-8.7C8.4 5.8 5 9.1 5 15.2 5 19.2 7.9 22 12 22z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M12 16.5V22"/><path d="M8.5 3h7l-1.2 6.2 3.2 3.3v2H6.5v-2l3.2-3.3z"/>',
  download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17"/>',
  upload: '<path d="M12 15V3"/><path d="m7 8 5-5 5 5"/><path d="M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17"/>',
  trash: '<path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7"/><path d="M9 7V4h6v3"/>',
  print: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  shuffle: '<path d="M3 7h3.5c2 0 3.2 1 4.3 2.6l2.4 3.8c1.1 1.6 2.3 2.6 4.3 2.6H21"/><path d="M3 17h3.5c1.3 0 2.2-.4 3-1.1M14.5 8.1c.8-.7 1.7-1.1 3-1.1H21"/><path d="m18 4 3 3-3 3M18 14l3 3-3 3"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  file: '<path d="M14 3H6.5A2.5 2.5 0 0 0 4 5.5v13A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V9z"/><path d="M14 3v6h6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  brain: '<path d="M9 4a3 3 0 0 0-3 3v.2A3 3 0 0 0 4 10a3 3 0 0 0 1 2.2A3 3 0 0 0 6 18a3 3 0 0 0 3 2 3 3 0 0 0 3-3V7a3 3 0 0 0-3-3z"/><path d="M15 4a3 3 0 0 1 3 3v.2a3 3 0 0 1 2 2.8 3 3 0 0 1-1 2.2A3 3 0 0 1 18 18a3 3 0 0 1-3 2 3 3 0 0 1-3-3"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-5A8 8 0 1 1 21 12z"/>',
  gauge: '<path d="M4 18a9 9 0 1 1 16 0"/><path d="m12 14 4-5"/>',
  keyboard: '<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><path d="M6.5 10h.01M10 10h.01M14 10h.01M17.5 10h.01M7.5 14h9"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  ext: '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',
};

const icon = (name, cls = '') =>
  `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

/** Circular SVG progress ring. `stroke` may be a color or a gradient id (prefixed with #). */
let ringSeq = 0;
function ring(pct, { size = 120, width = 10, color = 'var(--accent)', gradient = null, center = '', cls = '' } = {}) {
  const r = (size - width) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
  let defs = '';
  let stroke = color;
  if (gradient) {
    const id = `rg${++ringSeq}`;
    defs = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">${gradient.map((g, i) => `<stop offset="${(i / (gradient.length - 1)) * 100}%" stop-color="${g}"/>`).join('')}</linearGradient></defs>`;
    stroke = `url(#${id})`;
  }
  return `<div class="ring ${cls}" style="--size:${size}px">
    <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true">${defs}
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" class="ring-track" stroke-width="${width}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" class="ring-val" stroke="${stroke}" stroke-width="${width}"
        stroke-linecap="round" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}"
        style="--c:${c.toFixed(2)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    </svg>
    <div class="ring-center">${center}</div>
  </div>`;
}

const entriesLabel = (n) => `${n} ${n === 1 ? 'Eintrag' : 'Einträge'}`;

function courseChip(courseId) {
  const c = courseMeta(courseId);
  return `<span class="chip course-chip" style="--cc:${c.color}"><i></i>${escapeHtml(c.short)}</span>`;
}

/* ------------------------------------------------------------------ */
/* Toasts                                                               */
/* ------------------------------------------------------------------ */

function toast(message, kind = 'info') {
  const host = $('#toasts');
  const el = document.createElement('div');
  el.className = `toast glass ${kind}`;
  const ic = kind === 'error' ? 'x' : kind === 'success' ? 'check' : 'star';
  el.innerHTML = `<span class="toast-ic">${icon(ic)}</span><div><strong>StudyOS</strong><p>${escapeHtml(message)}</p></div>`;
  host.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }, 3200);
}

/* ------------------------------------------------------------------ */
/* UI state                                                             */
/* ------------------------------------------------------------------ */

const VIEWS = [
  { id: 'home', label: 'Übersicht', short: 'Start', icon: 'home', grad: ['#6366f1', '#3b82f6'] },
  { id: 'cards', label: 'Karteikarten', short: 'Karten', icon: 'cards', grad: ['#fb923c', '#ec4899'] },
  { id: 'quiz', label: 'Quiz', short: 'Quiz', icon: 'quiz', grad: ['#a855f7', '#d946ef'] },
  { id: 'courses', label: 'Kurse', short: 'Kurse', icon: 'courses', grad: ['#14b8a6', '#22c55e'] },
  { id: 'email', label: 'Email Coach', short: 'Email', icon: 'email', grad: ['#38bdf8', '#2563eb'] },
  { id: 'sheet', label: 'DIN-A4 Spickzettel', short: 'Spick', icon: 'sheet', grad: ['#fbbf24', '#f97316'] },
  { id: 'methods', label: 'Methoden & Backup', short: 'Mehr', icon: 'methods', grad: ['#64748b', '#0f766e'] },
];

const ui = {
  view: null,
  cards: { course: 'all', queue: [], done: 0, revealed: false, includeAll: false, busy: false },
  quiz: { course: 'all', queue: [], idx: 0, selected: null, confidence: 'medium', result: null, correct: 0, answered: 0 },
  course: COURSES_META[0].id,
  openChapters: new Set(),
  email: { promptId: ENGLISH_DATA.emailPrompts[0].id, drafts: {} },
};

/* ------------------------------------------------------------------ */
/* Pomodoro                                                             */
/* ------------------------------------------------------------------ */

const POMO_SIZE = 148;
const POMO_W = 10;
const POMO_C = 2 * Math.PI * ((POMO_SIZE - POMO_W) / 2);

const pomo = new Pomodoro({
  onChange: updatePomoUI,
  onFinish: (minutes) => {
    toast(`Fokus-Session (${minutes} Min) abgeschlossen. Zeit für eine Pause!`, 'success');
    refreshChrome();
    if (ui.view === 'home') renderView(false);
  },
});

function updatePomoUI() {
  for (const el of $$('[data-pomo-time]')) el.textContent = pomo.display;
  for (const el of $$('[data-pomo-ring]')) el.setAttribute('stroke-dashoffset', (POMO_C * (1 - pomo.progress)).toFixed(2));
  for (const el of $$('[data-pomo-toggle]')) {
    el.innerHTML = `${icon(pomo.running ? 'pause' : 'play')}${el.dataset.pomoToggle === 'label' ? `<span>${pomo.running ? 'Pause' : 'Start'}</span>` : ''}`;
    el.setAttribute('aria-label', pomo.running ? 'Timer pausieren' : 'Timer starten');
  }
  for (const el of $$('[data-pomo-mode]')) el.textContent = `${pomo.mode} Min`;
  for (const el of $$('[data-pomo-state]')) el.classList.toggle('running', pomo.running);
}

/* ------------------------------------------------------------------ */
/* Chrome: menubar + dock                                               */
/* ------------------------------------------------------------------ */

function renderMenubar() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' });
  const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const view = VIEWS.find(v => v.id === ui.view) || VIEWS[0];
  const due = getDueCards('all').length;
  menubarEl.innerHTML = `
    <div class="mb-left">
      <span class="mb-logo" aria-hidden="true"></span>
      <strong>StudyOS</strong>
      <span class="mb-dim mb-hide-s">WS 26/27</span>
      <span class="mb-sep mb-hide-s"></span>
      <span class="mb-view mb-hide-s">${escapeHtml(view.label)}</span>
    </div>
    <div class="mb-right">
      <button class="mb-item" data-act="go" data-view="cards" title="Fällige Karten">${icon('cards')}<span>${due}</span></button>
      <span class="mb-item mb-hide-xs" title="Lernserie">${icon('flame')}<span>${escapeHtml(streakLabel())}</span></span>
      <button class="mb-item mb-pomo" data-act="pomo-toggle" data-pomo-state title="Pomodoro starten/pausieren">
        <span data-pomo-toggle></span><span class="mono" data-pomo-time>${pomo.display}</span>
      </button>
      <button class="mb-item" data-act="theme" title="Hell/Dunkel umschalten" aria-label="Theme umschalten">${icon(store.state.theme === 'dark' ? 'sun' : 'moon')}</button>
      <span class="mb-clock mb-hide-s">${escapeHtml(dateStr)}&nbsp;&nbsp;${timeStr}</span>
    </div>`;
  updatePomoUI();
}

function renderDock() {
  const due = getDueCards('all').length;
  const pins = store.state.pinnedCheatSheet.length;
  const badges = { cards: due, sheet: pins };
  dockEl.innerHTML = VIEWS.map(v => `
    <button class="dock-item ${ui.view === v.id ? 'active' : ''}" data-act="go" data-view="${v.id}" aria-label="${escapeHtml(v.label)}" ${ui.view === v.id ? 'aria-current="page"' : ''}>
      <span class="dock-icon" style="--g1:${v.grad[0]};--g2:${v.grad[1]}">${icon(v.icon)}${badges[v.id] ? `<b class="badge">${badges[v.id] > 99 ? '99+' : badges[v.id]}</b>` : ''}</span>
      <span class="dock-label">${escapeHtml(v.label)}</span>
      <span class="dock-short">${escapeHtml(v.short)}</span>
    </button>`).join('') + `
    <span class="dock-divider" aria-hidden="true"></span>
    <button class="dock-item dock-theme" data-act="theme" aria-label="Hell/Dunkel umschalten">
      <span class="dock-icon" style="--g1:${store.state.theme === 'dark' ? '#1e1b4b' : '#fde68a'};--g2:${store.state.theme === 'dark' ? '#4338ca' : '#f59e0b'}">${icon(store.state.theme === 'dark' ? 'moon' : 'sun')}</span>
      <span class="dock-label">${store.state.theme === 'dark' ? 'Nachtmodus' : 'Tagmodus'}</span>
    </button>`;
}

function refreshChrome() {
  renderMenubar();
  renderDock();
}

/* Dock magnification (pointer devices only) */
const BASE = 52;
const MAX_EXTRA = 0.62;
const RANGE = 150;
dockEl.addEventListener('mousemove', (e) => {
  if (!window.matchMedia('(hover: hover) and (min-width: 721px)').matches) return;
  for (const item of $$('.dock-item', dockEl)) {
    const ic = $('.dock-icon', item);
    const rect = item.getBoundingClientRect();
    const d = Math.abs(e.clientX - (rect.left + rect.width / 2));
    const s = 1 + MAX_EXTRA * Math.max(0, 1 - d / RANGE) ** 1.6;
    ic.style.setProperty('--mag', s.toFixed(3));
  }
});
dockEl.addEventListener('mouseleave', () => {
  for (const ic of $$('.dock-icon', dockEl)) ic.style.removeProperty('--mag');
});

/* ------------------------------------------------------------------ */
/* Routing                                                              */
/* ------------------------------------------------------------------ */

function go(view, arg) {
  const hash = arg ? `#${view}/${arg}` : `#${view}`;
  if (location.hash === hash) route();
  else location.hash = hash;
}

function route() {
  const [rawView, arg] = location.hash.replace(/^#/, '').split('/');
  const view = VIEWS.some(v => v.id === rawView) ? rawView : 'home';
  const changed = view !== ui.view;

  if (view === 'cards') {
    const course = arg && (arg === 'all' || ALL_DATA[arg]) ? arg : 'all';
    startCards(course, false);
  }
  if (view === 'quiz') {
    const course = arg && (arg === 'all' || ALL_DATA[arg]) ? arg : 'all';
    if (changed || course !== ui.quiz.course || !ui.quiz.queue.length) startQuiz(course);
  }
  if (view === 'courses' && arg && ALL_DATA[arg]) ui.course = arg;

  ui.view = view;
  renderView(changed);
  refreshChrome();
  if (changed) window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);

/* ------------------------------------------------------------------ */
/* Window frame                                                         */
/* ------------------------------------------------------------------ */

function windowFrame({ title, iconName, grad, toolbar = '', body, cls = '' }) {
  return `<section class="window glass ${cls}" aria-label="${escapeHtml(title)}">
    <header class="win-bar">
      <div class="lights">
        <button class="light red" data-act="go" data-view="home" aria-label="Fenster schließen" title="Schließen"></button>
        <span class="light yellow" aria-hidden="true"></span>
        <span class="light green" aria-hidden="true"></span>
      </div>
      <div class="win-title"><span class="win-ic" style="--g1:${grad[0]};--g2:${grad[1]}">${icon(iconName)}</span>${escapeHtml(title)}</div>
      <div class="lights-spacer" aria-hidden="true"></div>
    </header>
    ${toolbar ? `<div class="win-toolbar">${toolbar}</div>` : ''}
    <div class="win-body">${body}</div>
  </section>`;
}

function segmented(items, active, act, extra = '') {
  return `<div class="segmented" role="tablist">${items.map(it => `
    <button role="tab" class="seg ${it.value === active ? 'on' : ''}" aria-selected="${it.value === active}" data-act="${act}" data-v="${escapeHtml(it.value)}" ${extra}>
      ${it.dot ? `<i style="background:${it.dot}"></i>` : ''}${escapeHtml(it.label)}${it.count !== undefined ? `<span class="seg-count">${it.count}</span>` : ''}
    </button>`).join('')}</div>`;
}

function renderView(animate) {
  const v = VIEWS.find(x => x.id === ui.view);
  const html = {
    home: renderHome,
    cards: renderCards,
    quiz: renderQuiz,
    courses: renderCourses,
    email: renderEmail,
    sheet: renderSheet,
    methods: renderMethods,
  }[ui.view]();
  stageEl.innerHTML = ui.view === 'home' ? html : windowFrame({ ...html, iconName: v.icon, grad: v.grad, title: html.title || v.label });
  stageEl.classList.toggle('is-home', ui.view === 'home');
  if (animate) {
    stageEl.classList.remove('opening');
    void stageEl.offsetWidth;
    stageEl.classList.add('opening');
  }
  if (ui.view === 'cards') renderCardStage('enter');
  if (ui.view === 'email') updateEmailFeedback();
  updatePomoUI();
}

/* ------------------------------------------------------------------ */
/* Home (bento)                                                         */
/* ------------------------------------------------------------------ */

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Gute Nacht';
  if (h < 11) return 'Guten Morgen';
  if (h < 18) return 'Guten Tag';
  return 'Guten Abend';
}

function renderHome() {
  const tp = todayProgress();
  const dueAll = getDueCards('all').length;
  const stats = cardStats('all');
  const deadlines = allDeadlines();
  const next = deadlines[0];
  const hist = activityHistory(7);
  const histMax = Math.max(1, ...hist.map(h => h.total));
  const overall = overallMastery();
  const todayStr = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });

  const distSeg = (k, label) => stats[k] ? `<span class="dist-${k}" style="flex:${stats[k]}" title="${label}: ${stats[k]}"></span>` : '';

  const nextBlock = next ? `
      <div class="dl-hero" style="--cc:${next.color}">
        <div class="dl-count">${next.daysLeft === 0 ? '<span class="dl-num">Heute</span>' : `<span class="dl-num">${next.daysLeft}</span><span class="dl-unit">${next.daysLeft === 1 ? 'Tag' : 'Tage'}</span>`}</div>
        <div class="dl-when">${next.daysLeft === 0 ? 'fällig' : escapeHtml(daysLeftLabel(next.daysLeft))} · ${formatDate(next.date)}</div>
        <div class="dl-label">${escapeHtml(next.label)}</div>
        <div class="row-btns dl-chips">${courseChip(next.courseId)}${next.urgent ? '<span class="chip urgent">dringend</span>' : ''}</div>
      </div>
      <ul class="dl-list">${deadlines.slice(1, 5).map(d => `
        <li style="--cc:${d.color}"><i></i><span class="dl-l">${escapeHtml(d.label)}</span><span class="dl-d">${escapeHtml(daysLeftLabel(d.daysLeft))}</span></li>`).join('')}
      </ul>` : '<p class="muted">Keine anstehenden Fristen.</p>';

  return `<div class="home">
    <div class="home-head">
      <p class="eyebrow">${escapeHtml(todayStr)}</p>
      <h1>${greeting()}.</h1>
    </div>
    <div class="bento">

      <article class="tile glass t-hero">
        <div class="hero-ring">
          ${ring(tp.pct, { size: 176, width: 16, gradient: ['#f472b6', '#a78bfa', '#60a5fa'], center: `<strong>${tp.pct}%</strong><span>${tp.done} / ${tp.goal}</span>` })}
        </div>
        <div class="hero-copy">
          <p class="eyebrow">Tagesziel</p>
          <h2>${tp.done >= tp.goal ? 'Ziel erreicht — stark!' : `Noch ${tp.goal - tp.done} Aufgaben bis zum Ziel`}</h2>
          <div class="hero-stats">
            <div><b>${tp.reviews}</b><span>Karten</span></div>
            <div><b>${tp.quizzes}</b><span>Quiz</span></div>
            <div><b>${tp.minutes}</b><span>Minuten</span></div>
            <div><b>${overall}%</b><span>Mastery</span></div>
          </div>
          <div class="hero-actions">
            <button class="btn primary" data-act="go" data-view="cards" data-arg="all">${icon('shuffle')}Interleaved Session<span class="btn-pill">${dueAll} fällig</span></button>
            <button class="btn" data-act="go" data-view="quiz" data-arg="all">${icon('quiz')}Gemischtes Quiz</button>
          </div>
        </div>
      </article>

      <article class="tile glass t-due tile-link" data-act="go" data-view="cards" data-arg="all" tabindex="0" role="button" aria-label="Fällige Karten lernen">
        <div class="tile-head"><span class="tile-ic" style="--g1:#fb923c;--g2:#ec4899">${icon('cards')}</span>Fällig</div>
        <div class="big-num">${dueAll}</div>
        <p class="muted">von ${stats.total} Karten</p>
        <div class="dist" aria-hidden="true">${distSeg('new', 'Neu')}${distSeg('due', 'Fällig')}${distSeg('learning', 'Lernend')}${distSeg('mastered', 'Gemeistert')}</div>
        <div class="dist-legend"><span class="l-new">Neu ${stats.new}</span><span class="l-due">Fällig ${stats.due}</span><span class="l-learning">Lernend ${stats.learning}</span><span class="l-mastered">Sicher ${stats.mastered}</span></div>
      </article>

      <article class="tile glass t-streak">
        <div class="tile-head"><span class="tile-ic" style="--g1:#f97316;--g2:#ef4444">${icon('flame')}</span>Lernserie</div>
        <div class="big-num">${escapeHtml(streakLabel())}</div>
        <p class="muted">${store.state.streak.lastDate === hist[hist.length - 1].key ? 'Heute bereits gelernt — Serie gesichert.' : 'Heute lernen, um die Serie zu halten.'}</p>
        <div class="streak-dots" aria-hidden="true">${hist.map(h => `<span class="${h.total ? 'on' : ''}" title="${h.weekday}: ${h.total}">${h.weekday.slice(0, 1)}</span>`).join('')}</div>
      </article>

      <article class="tile glass t-pomo" data-pomo-state>
        <div class="tile-head"><span class="tile-ic" style="--g1:#f43f5e;--g2:#fb7185">${icon('clock')}</span>Fokus-Timer</div>
        <div class="pomo-ring">
          <div class="ring" style="--size:${POMO_SIZE}px">
            <svg viewBox="0 0 ${POMO_SIZE} ${POMO_SIZE}" width="${POMO_SIZE}" height="${POMO_SIZE}" aria-hidden="true">
              <defs><linearGradient id="pomoGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fb7185"/><stop offset="100%" stop-color="#f97316"/></linearGradient></defs>
              <circle cx="${POMO_SIZE / 2}" cy="${POMO_SIZE / 2}" r="${(POMO_SIZE - POMO_W) / 2}" fill="none" class="ring-track" stroke-width="${POMO_W}"/>
              <circle data-pomo-ring cx="${POMO_SIZE / 2}" cy="${POMO_SIZE / 2}" r="${(POMO_SIZE - POMO_W) / 2}" fill="none" stroke="url(#pomoGrad)" stroke-width="${POMO_W}"
                stroke-linecap="round" stroke-dasharray="${POMO_C.toFixed(2)}" stroke-dashoffset="${(POMO_C * (1 - pomo.progress)).toFixed(2)}" transform="rotate(-90 ${POMO_SIZE / 2} ${POMO_SIZE / 2})" class="pomo-val"/>
            </svg>
            <div class="ring-center"><strong class="mono" data-pomo-time>${pomo.display}</strong><span data-pomo-mode>${pomo.mode} Min</span></div>
          </div>
        </div>
        <div class="pomo-ctrl">
          <button class="btn primary round" data-act="pomo-toggle" data-pomo-toggle="label"></button>
          <button class="btn icon-btn" data-act="pomo-reset" aria-label="Timer zurücksetzen" title="Zurücksetzen">${icon('reset')}</button>
          <button class="btn icon-btn mode-btn" data-act="pomo-mode" title="25 ↔ 50 Minuten">25/50</button>
        </div>
        <p class="muted small">Heute ${tp.minutes} Fokus-Minuten gesammelt</p>
      </article>

      <article class="tile glass t-deadline">
        <div class="tile-head"><span class="tile-ic" style="--g1:#0ea5e9;--g2:#6366f1">${icon('calendar')}</span>Nächste Frist</div>
        ${nextBlock}
      </article>

      <article class="tile glass t-activity">
        <div class="tile-head"><span class="tile-ic" style="--g1:#22c55e;--g2:#14b8a6">${icon('gauge')}</span>Aktivität · 7 Tage
          <span class="legend"><span class="lg-r">Karten</span><span class="lg-q">Quiz</span></span></div>
        <div class="bars">${hist.map((h, i) => `
          <div class="bar-col ${i === hist.length - 1 ? 'today' : ''}" title="${h.label}: ${h.reviews} Karten, ${h.quizzes} Quiz, ${h.minutes} Min">
            <div class="bar-slot">
              <span class="bar-val">${h.total || ''}</span>
              <div class="bar ${h.total ? '' : 'zero'}" style="--h:${(h.total / histMax) * 82}%">
                <span class="bq" style="flex:${h.quizzes}"></span><span class="br" style="flex:${h.reviews}"></span>
              </div>
            </div>
            <span class="bar-day">${h.weekday}</span>
          </div>`).join('')}
        </div>
      </article>

      ${COURSES_META.map((c, i) => {
        const m = getCourseMastery(c.id);
        const due = getDueCards(c.id).length;
        return `<article class="tile glass t-course tc${i + 1} tile-link" style="--cc:${c.color}" data-act="go" data-view="courses" data-arg="${c.id}" tabindex="0" role="button" aria-label="Kurs ${escapeHtml(c.short)} öffnen">
          <div class="course-top">
            <span class="course-emoji" aria-hidden="true">${escapeHtml(c.icon)}</span>
            <div><strong>${escapeHtml(c.short)}</strong><span class="muted small">${escapeHtml(c.title)}</span></div>
          </div>
          <div class="course-mid">
            ${ring(m, { size: 84, width: 9, color: c.color, center: `<strong>${m}%</strong>` })}
            <div class="course-due"><b>${due}</b><span>fällig</span></div>
          </div>
          <div class="course-btns">
            <button class="mini" data-act="go" data-view="cards" data-arg="${c.id}">Karten</button>
            <button class="mini" data-act="go" data-view="quiz" data-arg="${c.id}">Quiz</button>
          </div>
        </article>`;
      }).join('')}
    </div>
  </div>`;
}

/* ------------------------------------------------------------------ */
/* Flashcards                                                           */
/* ------------------------------------------------------------------ */

function startCards(course, includeAll) {
  const c = ui.cards;
  c.course = course;
  c.includeAll = includeAll;
  c.queue = buildFlashcardQueue(course, includeAll);
  c.done = 0;
  c.revealed = false;
  c.busy = false;
}

function courseFilterItems(countFn) {
  return [
    { value: 'all', label: 'Alle', count: countFn('all') },
    ...COURSES_META.map(c => ({ value: c.id, label: c.short, dot: c.color, count: countFn(c.id) })),
  ];
}

function renderCards() {
  const toolbar = segmented(courseFilterItems(id => getDueCards(id).length), ui.cards.course, 'cards-filter')
    + `<span class="tb-hint">${ui.cards.course === 'all' ? 'Interleaving: Kurse gemischt' : 'Fokus auf einen Kurs'}</span>`;
  return { toolbar, body: '<div class="fc-wrap" id="fc-stage"></div>', cls: 'win-cards' };
}

function renderCardStage(anim = '') {
  const host = $('#fc-stage');
  if (!host) return;
  const c = ui.cards;
  const card = c.queue[0];

  if (!card) {
    host.innerHTML = `<div class="empty">
      <div class="empty-ic">${icon('check')}</div>
      <h2>${c.done ? 'Session abgeschlossen' : 'Keine fälligen Karten'}</h2>
      <p class="muted">${c.done ? `${c.done} Bewertungen in dieser Session. Die nächsten Wiederholungen plant SM-2 automatisch.` : 'Für diesen Filter ist gerade nichts fällig. Du kannst trotzdem alle Karten üben oder ins Quiz wechseln.'}</p>
      <div class="row-btns">
        <button class="btn primary" data-act="cards-all">${icon('layers')}Alle Karten nochmal üben</button>
        <button class="btn" data-act="go" data-view="quiz" data-arg="${c.course}">${icon('quiz')}Zum Quiz</button>
      </div>
    </div>`;
    return;
  }

  const total = c.done + c.queue.length;
  const ivals = intervalsFor(card);
  const meta = courseMeta(card.courseId);
  const depth = Math.min(c.queue.length - 1, 2);

  host.innerHTML = `
    <div class="fc-progress">
      <span>Karte <b>${c.done + 1}</b> von ${total}${c.includeAll ? ' · Übungsmodus (alle Karten)' : ''}</span>
      <div class="pbar"><span style="width:${(c.done / total) * 100}%"></span></div>
    </div>
    <div class="deck depth-${depth}">
      <article class="flashcard glass-strong ${c.revealed ? 'revealed' : ''} ${anim}" style="--cc:${meta.color}" aria-live="polite">
        <header class="fc-head">
          ${courseChip(card.courseId)}
          ${card.examRelevant ? `<span class="chip exam">${icon('star')}Klausurrelevant</span>` : ''}
        </header>
        <div class="fc-front">${textBlock(card.front)}</div>
        <div class="fc-back" ${c.revealed ? '' : 'hidden'}>
          <span class="fc-divider">Antwort</span>
          <div class="fc-answer">${textBlock(card.back)}</div>
        </div>
      </article>
    </div>
    <div class="fc-actions">
      ${c.revealed ? `<div class="ratings">${RATING_LABELS.map(r => `
        <button class="rate r${r.value}" data-act="rate" data-v="${r.value}">
          <span class="rate-l">${escapeHtml(r.label)}</span>
          <span class="rate-i">${escapeHtml(ivals[r.value])}</span>
          <kbd>${r.key}</kbd>
        </button>`).join('')}</div>`
      : `<button class="btn primary reveal" data-act="reveal">${icon('eye')}Antwort zeigen <kbd>Leertaste</kbd></button>`}
    </div>`;
}

function revealCard() {
  if (!ui.cards.queue.length || ui.cards.revealed || ui.cards.busy) return;
  ui.cards.revealed = true;
  renderCardStage();
}

function rateCurrent(rating) {
  const c = ui.cards;
  const card = c.queue[0];
  if (!card || !c.revealed || c.busy) return;
  const requeue = rateCard(card, rating);
  c.busy = true;
  const el = $('.flashcard');
  if (el) el.classList.add('leave');
  setTimeout(() => {
    c.queue.shift();
    if (requeue) {
      c.queue.push(card);
      toast('Karte kommt am Ende der Session nochmal.');
    }
    c.done += 1;
    c.revealed = false;
    c.busy = false;
    renderCardStage('enter');
    refreshChrome();
    // keep toolbar due counts fresh without re-rendering the stage
    const tb = $('.win-toolbar');
    if (tb) tb.innerHTML = renderCards().toolbar;
  }, 260);
}

/* ------------------------------------------------------------------ */
/* Quiz                                                                 */
/* ------------------------------------------------------------------ */

function startQuiz(course) {
  Object.assign(ui.quiz, { course, queue: buildQuizQueue(course), idx: 0, selected: null, confidence: 'medium', result: null, correct: 0, answered: 0, anim: true });
}

function quizCount(id) {
  return id === 'all' ? ALL_QUIZZES.length : ALL_QUIZZES.filter(q => q.courseId === id).length;
}

function renderQuiz() {
  const toolbar = segmented(courseFilterItems(quizCount), ui.quiz.course, 'quiz-filter');
  return { toolbar, body: `<div class="quiz-wrap" id="quiz-stage">${quizStage()}</div>`, cls: 'win-quiz' };
}

function quizStage() {
  const s = ui.quiz;
  const q = s.queue[s.idx];
  const anim = s.anim;
  s.anim = false;

  if (!q) {
    const pct = s.answered ? Math.round((s.correct / s.answered) * 100) : 0;
    const cal = calibrationStats();
    return `<div class="quiz-done">
      ${ring(pct, { size: 150, width: 14, gradient: ['#a855f7', '#ec4899'], center: `<strong>${pct}%</strong><span>${s.correct}/${s.answered}</span>` })}
      <h2>Runde abgeschlossen</h2>
      <p class="muted">Kalibrierung über alle beantworteten Fragen — triffst du, was du dir zutraust?</p>
      <div class="calib">${CONFIDENCE_LEVELS.map(l => {
        const r = cal[l.value];
        const p = r.n ? Math.round((r.ok / r.n) * 100) : 0;
        return `<div class="calib-row"><span>${escapeHtml(l.label)}</span><div class="pbar"><span style="width:${p}%"></span></div><b>${r.n ? `${p}%` : '—'}</b><em class="muted">${r.n} ${r.n === 1 ? 'Frage' : 'Fragen'}</em></div>`;
      }).join('')}</div>
      <button class="btn primary" data-act="quiz-restart">${icon('reset')}Neue Runde starten</button>
    </div>`;
  }

  const res = s.result;
  const letters = 'ABCDEFGH';
  const optClass = (i) => {
    if (!res) return s.selected === i ? 'sel' : '';
    if (i === q.answer) return 'correct';
    if (i === s.selected) return 'wrong';
    return 'dim';
  };

  return `
    <div class="fc-progress">
      <span>Frage <b>${s.idx + 1}</b> von ${s.queue.length} · ${s.correct} richtig</span>
      <div class="pbar purple"><span style="width:${(s.idx / s.queue.length) * 100}%"></span></div>
    </div>
    <article class="quiz-card glass-strong ${anim ? 'enter' : ''}">
      <header class="fc-head">${courseChip(q.courseId)}${q.examStyle ? `<span class="chip exam">${icon('star')}${escapeHtml(q.examStyle)}</span>` : ''}</header>
      <h2 class="quiz-q">${textBlock(q.question)}</h2>
      ${q.code ? `<pre class="code"><code>${escapeHtml(q.code)}</code></pre>` : ''}
      <div class="options" role="radiogroup">
        ${q.options.map((o, i) => `
          <button class="opt ${optClass(i)}" data-act="quiz-select" data-v="${i}" role="radio" aria-checked="${s.selected === i}" ${res ? 'disabled' : ''}>
            <span class="opt-key">${letters[i]}</span><span class="opt-t">${textBlock(o)}</span>
            ${res && i === q.answer ? `<span class="opt-mark">${icon('check')}</span>` : ''}
            ${res && i === s.selected && i !== q.answer ? `<span class="opt-mark">${icon('x')}</span>` : ''}
          </button>`).join('')}
      </div>
      ${res ? `
        <div class="feedback ${res.correct ? 'ok' : 'bad'}">
          <h3>${icon(res.correct ? 'check' : 'x')}${res.correct ? 'Richtig!' : 'Leider falsch.'}</h3>
          ${res.overconfident ? `<p class="warn"><strong>Hypercorrection-Effekt:</strong> Du warst dir 100% sicher und lagst falsch. Genau solche Fehler merkt sich das Gehirn besonders gut — lies die Erklärung bewusst.</p>` : ''}
          <p>${textBlock(q.explanation)}</p>
        </div>
        <div class="quiz-foot"><button class="btn primary" data-act="quiz-next">${s.idx + 1 < s.queue.length ? 'Nächste Frage' : 'Auswertung'}${icon('arrow')}<kbd>Enter</kbd></button></div>`
      : `
        <div class="confidence">
          <span class="muted small">Wie sicher bist du?</span>
          ${segmented(CONFIDENCE_LEVELS.map(l => ({ value: l.value, label: l.label })), s.confidence, 'quiz-conf')}
        </div>
        <div class="quiz-foot"><button class="btn primary" data-act="quiz-submit" ${s.selected === null ? 'disabled' : ''}>Antwort prüfen<kbd>Enter</kbd></button></div>`}
    </article>`;
}

function renderQuizStage() {
  const host = $('#quiz-stage');
  if (host) host.innerHTML = quizStage();
}

function quizSubmit() {
  const s = ui.quiz;
  const q = s.queue[s.idx];
  if (!q || s.result || s.selected === null) return;
  s.result = submitQuiz(q, s.selected, s.confidence);
  s.answered += 1;
  if (s.result.correct) s.correct += 1;
  renderQuizStage();
  refreshChrome();
}

function quizNext() {
  const s = ui.quiz;
  if (!s.result) return;
  s.idx += 1;
  s.selected = null;
  s.result = null;
  s.confidence = 'medium';
  s.anim = true;
  renderQuizStage();
  const card = $('.quiz-card, .quiz-done');
  if (card) card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/* ------------------------------------------------------------------ */
/* Courses                                                              */
/* ------------------------------------------------------------------ */

function renderCourses() {
  const c = courseMeta(ui.course);
  const data = ALL_DATA[c.id];
  const m = getCourseMastery(c.id);
  const due = getDueCards(c.id).length;
  const ex = c.examInfo;
  const deadlines = allDeadlines().filter(d => d.courseId === c.id);

  const sidebar = `<aside class="finder-side">
    <p class="side-h">Kurse</p>
    ${COURSES_META.map(cc => `<button class="side-item ${cc.id === c.id ? 'on' : ''}" data-act="go" data-view="courses" data-arg="${cc.id}" style="--cc:${cc.color}">
      <i></i><span>${escapeHtml(cc.short)}</span><em>${getCourseMastery(cc.id)}%</em></button>`).join('')}
  </aside>`;

  const chapters = data.chapters.map(ch => {
    const full = { ...ch, courseId: c.id };
    const open = ui.openChapters.has(ch.id);
    const fey = getFeynman(ch.id);
    const pinned = store.isPinned(ch.cheatSheet.id);
    const dg = ch.diagram && DIAGRAMS[ch.diagram];
    return `<article class="chapter ${open ? 'open' : ''}" data-chapter="${ch.id}">
      <button class="ch-head" data-act="chapter-toggle" data-v="${ch.id}" aria-expanded="${open}">
        <span class="ch-chev">${icon('chevron')}</span>
        <span class="ch-title">${escapeHtml(ch.title)}</span>
        <span class="chip badge-chip">${escapeHtml(ch.badge)}</span>
        ${pinned ? `<span class="ch-pinned" title="Auf dem Spickzettel">${icon('pin')}</span>` : ''}
      </button>
      <div class="ch-body"><div class="ch-inner">
        <ul class="summary">${ch.summary.map(s => `<li>${s}</li>`).join('')}</ul>
        ${dg ? `<figure class="diagram"><figcaption>${escapeHtml(dg.title)}</figcaption>${dg.svg}</figure>` : ''}
        <section class="feynman">
          <div class="fey-head"><span class="tile-ic" style="--g1:#a855f7;--g2:#6366f1">${icon('chat')}</span>
            <div><strong>Feynman-Technik</strong><p class="muted small">Erkläre es in eigenen Worten, dann prüfe dich mit der Rubrik.</p></div></div>
          <p class="fey-prompt">${escapeHtml(ch.feynman.prompt)}</p>
          <textarea class="field" data-feynman="${ch.id}" rows="5" placeholder="Deine Erklärung … (wird automatisch gespeichert)">${escapeHtml(fey.text)}</textarea>
          <div class="rubric">
            <p class="small muted">Rubrik · <span data-rubric-count="${ch.id}">${fey.checkedPoints.length}/${ch.feynman.rubric.length}</span> Punkte abgedeckt</p>
            ${ch.feynman.rubric.map((r, i) => `<label class="check"><input type="checkbox" data-rubric="${ch.id}" data-idx="${i}" ${fey.checkedPoints.includes(i) ? 'checked' : ''}><span class="box">${icon('check')}</span><span>${escapeHtml(r)}</span></label>`).join('')}
          </div>
        </section>
        <div class="ch-foot">
          <button class="btn ${pinned ? 'pinned' : ''}" data-act="pin" data-v="${ch.id}" data-pin-btn="${ch.id}">${icon('pin')}<span>${pinned ? 'Vom Spickzettel lösen' : 'Auf Spickzettel pinnen'}</span></button>
          <span class="muted small">${escapeHtml(full.cheatSheet.title)}</span>
        </div>
      </div></div>
    </article>`;
  }).join('');

  const body = `<div class="finder">${sidebar}
    <div class="finder-main">
      <section class="course-hero" style="--cc:${c.color}">
        ${ring(m, { size: 104, width: 10, color: c.color, center: `<strong>${m}%</strong><span>Mastery</span>` })}
        <div class="ch-hero-copy">
          <p class="eyebrow">${escapeHtml(c.icon)} ${escapeHtml(c.short)} · ${escapeHtml(c.prof)}</p>
          <h2>${escapeHtml(c.title)}</h2>
          <p class="muted">${escapeHtml(c.subtitle)}</p>
          <div class="row-btns">
            <button class="btn primary" data-act="go" data-view="cards" data-arg="${c.id}">${icon('cards')}Karten lernen<span class="btn-pill">${due} fällig</span></button>
            <button class="btn" data-act="go" data-view="quiz" data-arg="${c.id}">${icon('quiz')}Quiz starten</button>
          </div>
        </div>
      </section>

      <div class="exam-grid">
        <div class="exam-cell"><span>Prüfungsform</span><p>${escapeHtml(ex.type)}</p></div>
        <div class="exam-cell"><span>Hilfsmittel</span><p>${escapeHtml(ex.aid)}</p></div>
        <div class="exam-cell"><span>Prüfungsvorleistung</span><p>${escapeHtml(ex.pvl)}</p></div>
        <div class="exam-cell"><span>Zeitraum</span><p>${escapeHtml(ex.period)}</p></div>
      </div>

      ${deadlines.length ? `<div class="course-deadlines">${deadlines.map(d => `<span class="chip ${d.urgent ? 'urgent' : ''}">${icon('calendar')}${escapeHtml(d.label)} · ${escapeHtml(daysLeftLabel(d.daysLeft))}</span>`).join('')}</div>` : ''}

      <h3 class="sec-h">Kapitel</h3>
      <div class="chapters">${chapters}</div>

      <h3 class="sec-h">Materialien (PDF)</h3>
      <div class="pdfs">${c.pdfs.map(p => `
        <a class="pdf" href="${pdfHref(p.path)}" target="_blank" rel="noopener">
          <span class="pdf-ic">${icon('file')}</span>
          <span class="pdf-t">${escapeHtml(p.title)}</span>
          <span class="chip">${escapeHtml(p.tag)}</span>
          <span class="pdf-ext">${icon('ext')}</span>
        </a>`).join('')}
      </div>
    </div>
  </div>`;

  return { body, cls: 'win-courses', title: `Kurse — ${c.short}` };
}

function findChapter(id) {
  for (const d of Object.values(ALL_DATA)) {
    const ch = d.chapters.find(x => x.id === id);
    if (ch) return { ...ch, courseId: d.courseId };
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Email coach                                                          */
/* ------------------------------------------------------------------ */

function currentPrompt() {
  return ENGLISH_DATA.emailPrompts.find(p => p.id === ui.email.promptId) || ENGLISH_DATA.emailPrompts[0];
}

function renderEmail() {
  const p = currentPrompt();
  const toolbar = segmented(ENGLISH_DATA.emailPrompts.map((x, i) => ({ value: x.id, label: `Szenario ${i + 1}` })), p.id, 'email-prompt')
    + `<span class="tb-hint">GPAS · 120–180 Wörter</span>`;
  const dg = DIAGRAMS['gpas-email'];
  const body = `<div class="email-grid">
    <div class="email-left">
      <section class="pane">
        <p class="eyebrow">Szenario</p>
        <h2>${escapeHtml(p.title)}</h2>
        <p class="scenario">${escapeHtml(p.scenario)}</p>
      </section>
      <figure class="pane diagram"><figcaption>${escapeHtml(dg.title)}</figcaption>${dg.svg}</figure>
    </div>
    <div class="email-right">
      <div class="mail-compose pane">
        <div class="mail-meta"><span>Betreff:</span><em>${escapeHtml(p.title)}</em></div>
        <textarea id="email-text" class="field mail-text" spellcheck="true" placeholder="Dear Ms Miller,&#10;&#10;Thank you for your email regarding …">${escapeHtml(ui.email.drafts[p.id] || '')}</textarea>
      </div>
      <div id="email-feedback" class="pane email-feedback"></div>
    </div>
  </div>`;
  return { toolbar, body, cls: 'win-email' };
}

function updateEmailFeedback() {
  const host = $('#email-feedback');
  const ta = $('#email-text');
  if (!host || !ta) return;
  const p = currentPrompt();
  const a = analyzeEmail(ta.value, p);
  const scale = 240;
  const pos = Math.min(100, (a.words / scale) * 100);
  host.innerHTML = `
    <div class="fb-top">
      <div>
        <p class="eyebrow">Wortanzahl</p>
        <div class="wc ${a.wordsOk ? 'ok' : a.words ? 'bad' : ''}"><b>${a.words}</b><span>/ Ziel 120–180</span></div>
      </div>
      ${ring((a.score / a.checks.length) * 100, { size: 72, width: 8, cls: 'static', color: a.score === a.checks.length ? 'var(--ok)' : 'var(--accent)', center: `<strong>${a.score}/${a.checks.length}</strong>` })}
    </div>
    <div class="meter" aria-hidden="true">
      <span class="zone" style="left:${(120 / scale) * 100}%;width:${(60 / scale) * 100}%"></span>
      <span class="fill ${a.wordsOk ? 'ok' : ''}" style="width:${pos}%"></span>
    </div>
    <ul class="checks">${a.checks.map(c => `<li class="${c.ok ? 'ok' : ''}"><span class="ck">${icon(c.ok ? 'check' : 'x')}</span>${escapeHtml(c.label)}</li>`).join('')}</ul>
    <p class="eyebrow">Keywords · ${a.kwHits}/${a.keywords.length}</p>
    <div class="kws">${a.keywords.map(k => `<span class="chip kw ${k.hit ? 'hit' : ''}">${k.hit ? icon('check') : ''}${escapeHtml(k.word)}</span>`).join('')}</div>`;
}

/* ------------------------------------------------------------------ */
/* Cheat sheet                                                          */
/* ------------------------------------------------------------------ */

function sheetItemsHtml(withControls) {
  return store.state.pinnedCheatSheet.map(p => {
    const c = courseMeta(p.courseId);
    return `<article class="cs-item" style="--cc:${c.color}">
      <header><h4>${escapeHtml(p.title)}</h4>${withControls ? `<button class="cs-x" data-act="unpin" data-v="${escapeHtml(p.id)}" aria-label="Lösen" title="Vom Spickzettel lösen">${icon('x')}</button>` : ''}</header>
      <p>${textBlock(p.content)}</p>
      ${p.code ? `<pre><code>${escapeHtml(p.code)}</code></pre>` : ''}
    </article>`;
  }).join('');
}

function renderSheet() {
  const pins = store.state.pinnedCheatSheet;
  const toolbar = `<div class="tb-btns">
    <button class="btn sm" data-act="pins-load" data-v="gdp1">${icon('download')}GP1 laden</button>
    <button class="btn sm" data-act="pins-load" data-v="ics">${icon('download')}ICS laden</button>
    <button class="btn sm" data-act="pins-load" data-v="all">${icon('layers')}Alle Essentials</button>
    <button class="btn sm danger" data-act="pins-clear" ${pins.length ? '' : 'disabled'}>${icon('trash')}Leeren</button>
    <button class="btn sm primary" data-act="print" ${pins.length ? '' : 'disabled'}>${icon('print')}Drucken</button>
  </div>`;
  const body = pins.length ? `
    <div class="paper-wrap">
      <div class="paper">
        <header class="paper-head"><strong>Spickzettel WS 26/27</strong><span>${entriesLabel(pins.length)} · DIN A4</span></header>
        <div class="paper-cols">${sheetItemsHtml(true)}</div>
      </div>
    </div>` : `
    <div class="empty">
      <div class="empty-ic">${icon('sheet')}</div>
      <h2>Dein Spickzettel ist leer</h2>
      <p class="muted">Pinne Kapitel in der Kursansicht oder lade die Essentials eines Kurses mit einem Klick.</p>
      <div class="row-btns">
        <button class="btn primary" data-act="pins-load" data-v="all">${icon('layers')}Alle Essentials laden</button>
        <button class="btn" data-act="go" data-view="courses">${icon('courses')}Zu den Kursen</button>
      </div>
    </div>`;
  return { toolbar, body, cls: 'win-sheet' };
}

function fillPrintSheet() {
  const pins = store.state.pinnedCheatSheet;
  $('#print-sheet').innerHTML = `<header class="ps-head"><strong>Spickzettel WS 26/27</strong><span>${entriesLabel(pins.length)}</span></header>
    <div class="ps-cols">${sheetItemsHtml(false)}</div>`;
}
window.addEventListener('beforeprint', fillPrintSheet);

/* ------------------------------------------------------------------ */
/* Methods & backup                                                     */
/* ------------------------------------------------------------------ */

const METHODS = [
  { icon: 'layers', g: ['#fb923c', '#ec4899'], name: 'Spaced Repetition', text: 'Der SM-2-Algorithmus plant jede Karte genau dann neu ein, wenn du sie fast vergessen hättest. Die vier Buttons zeigen dir das nächste Intervall.' },
  { icon: 'brain', g: ['#a855f7', '#6366f1'], name: 'Active Recall', text: 'Erst selbst erinnern, dann aufdecken. Das aktive Abrufen stärkt Gedächtnisspuren deutlich mehr als erneutes Lesen.' },
  { icon: 'shuffle', g: ['#14b8a6', '#22c55e'], name: 'Interleaving', text: 'Der Filter „Alle“ mischt GP1, GP2, ICS und Englisch. Das ständige Umschalten trainiert, die passende Strategie zu erkennen.' },
  { icon: 'eye', g: ['#38bdf8', '#2563eb'], name: 'Dual Coding', text: 'Diagramme zu JVM, DOM, Box-Modell & Co. verbinden Text mit Bildern — zwei Kodierungen, doppelte Abrufwege.' },
  { icon: 'chat', g: ['#fbbf24', '#f97316'], name: 'Feynman & Kalibrierung', text: 'Erkläre Kapitel in eigenen Worten und prüfe dich mit der Rubrik. Im Quiz schätzt du deine Sicherheit — sichere Fehler (Hypercorrection) bleiben besonders hängen.' },
];

function renderMethods() {
  const cal = calibrationStats();
  const body = `<div class="methods">
    <div class="method-grid">${METHODS.map(m => `
      <article class="mtile">
        <span class="tile-ic lg" style="--g1:${m.g[0]};--g2:${m.g[1]}">${icon(m.icon)}</span>
        <h3>${escapeHtml(m.name)}</h3>
        <p class="muted">${escapeHtml(m.text)}</p>
      </article>`).join('')}
      <article class="mtile calib-tile">
        <span class="tile-ic lg" style="--g1:#f43f5e;--g2:#a855f7">${icon('gauge')}</span>
        <h3>Deine Kalibrierung</h3>
        <div class="calib">${CONFIDENCE_LEVELS.map(l => {
          const r = cal[l.value];
          const p = r.n ? Math.round((r.ok / r.n) * 100) : 0;
          return `<div class="calib-row"><span>${escapeHtml(l.label)}</span><div class="pbar"><span style="width:${p}%"></span></div><b>${r.n ? `${p}%` : '—'}</b></div>`;
        }).join('')}</div>
      </article>
    </div>

    <div class="methods-lower">
      <section class="pane">
        <h3 class="sec-h">${icon('download')}Backup & Daten</h3>
        <p class="muted small">Dein Fortschritt liegt lokal im Browser und wird mit allen StudyOS-Versionen geteilt.</p>
        <div class="row-btns">
          <button class="btn primary" data-act="backup">${icon('download')}Backup herunterladen</button>
          <label class="btn file-btn">${icon('upload')}Backup importieren<input type="file" accept="application/json,.json" id="import-file"></label>
          <button class="btn danger" data-act="reset">${icon('trash')}Fortschritt zurücksetzen</button>
        </div>
      </section>
      <section class="pane">
        <h3 class="sec-h">${icon('keyboard')}Tastenkürzel</h3>
        <dl class="keys">
          <div><dt><kbd>Leertaste</kbd></dt><dd>Karteikarte aufdecken</dd></div>
          <div><dt><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><kbd>4</kbd></dt><dd>Karte bewerten: Nochmal · Schwer · Gut · Einfach</dd></div>
          <div><dt><kbd>1</kbd>–<kbd>4</kbd></dt><dd>Im Quiz: Antwort A–D wählen</dd></div>
          <div><dt><kbd>Enter</kbd></dt><dd>Im Quiz: Antwort prüfen / nächste Frage</dd></div>
          <div><dt><kbd>Esc</kbd></dt><dd>Fenster schließen, zurück zur Übersicht</dd></div>
        </dl>
      </section>
    </div>
  </div>`;
  return { body, cls: 'win-methods' };
}

/* ------------------------------------------------------------------ */
/* Events                                                               */
/* ------------------------------------------------------------------ */

function toggleTheme() {
  store.toggleTheme();
  applyTheme();
  refreshChrome();
}

function applyTheme() {
  document.documentElement.dataset.theme = store.state.theme === 'light' ? 'light' : 'dark';
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const act = el.dataset.act;
  const v = el.dataset.v;

  switch (act) {
    case 'go':
      e.preventDefault();
      go(el.dataset.view, el.dataset.arg);
      break;
    case 'theme':
      toggleTheme();
      break;
    case 'pomo-toggle': pomo.toggle(); break;
    case 'pomo-reset': pomo.reset(); break;
    case 'pomo-mode':
      pomo.switchMode();
      toast(`Fokus-Timer auf ${pomo.mode} Minuten gestellt.`);
      break;

    case 'cards-filter': go('cards', v); break;
    case 'cards-all':
      startCards(ui.cards.course, true);
      renderCardStage('enter');
      break;
    case 'reveal': revealCard(); break;
    case 'rate': rateCurrent(Number(v)); break;

    case 'quiz-filter':
      startQuiz(v);
      go('quiz', v);
      break;
    case 'quiz-select':
      if (ui.quiz.result) break;
      ui.quiz.selected = Number(v);
      renderQuizStage();
      break;
    case 'quiz-conf':
      ui.quiz.confidence = v;
      renderQuizStage();
      break;
    case 'quiz-submit': quizSubmit(); break;
    case 'quiz-next': quizNext(); break;
    case 'quiz-restart':
      startQuiz(ui.quiz.course);
      renderQuizStage();
      break;

    case 'chapter-toggle': {
      const art = el.closest('.chapter');
      const open = !ui.openChapters.has(v);
      if (open) ui.openChapters.add(v); else ui.openChapters.delete(v);
      art.classList.toggle('open', open);
      el.setAttribute('aria-expanded', String(open));
      break;
    }
    case 'pin': {
      const ch = findChapter(v);
      if (!ch) break;
      const pinned = togglePinChapter(ch);
      el.classList.toggle('pinned', pinned);
      $('span', el).textContent = pinned ? 'Vom Spickzettel lösen' : 'Auf Spickzettel pinnen';
      const head = $(`.chapter[data-chapter="${v}"] .ch-head`);
      const mark = head && $('.ch-pinned', head);
      if (pinned && head && !mark) head.insertAdjacentHTML('beforeend', `<span class="ch-pinned" title="Auf dem Spickzettel">${icon('pin')}</span>`);
      if (!pinned && mark) mark.remove();
      toast(pinned ? `„${ch.cheatSheet.title}“ auf den Spickzettel gepinnt.` : 'Vom Spickzettel entfernt.', pinned ? 'success' : 'info');
      renderDock();
      break;
    }

    case 'email-prompt':
      ui.email.promptId = v;
      renderView(false);
      break;

    case 'unpin': {
      const item = store.state.pinnedCheatSheet.find(p => p.id === v);
      if (item) store.togglePin(item);
      renderView(false);
      renderDock();
      break;
    }
    case 'pins-load': {
      const ids = v === 'all' ? COURSES_META.map(c => c.id) : [v];
      const before = store.state.pinnedCheatSheet.length;
      loadCoursePins(ids);
      const added = store.state.pinnedCheatSheet.length - before;
      toast(added ? `${entriesLabel(added)} hinzugefügt.` : 'Alles bereits auf dem Spickzettel.', added ? 'success' : 'info');
      if (ui.view === 'sheet') renderView(false); else go('sheet');
      renderDock();
      break;
    }
    case 'pins-clear':
      if (!confirm('Alle Einträge vom Spickzettel entfernen?')) break;
      clearPins();
      toast('Spickzettel geleert.');
      renderView(false);
      renderDock();
      break;
    case 'print':
      fillPrintSheet();
      window.print();
      break;

    case 'backup':
      downloadBackup();
      toast('Backup wird heruntergeladen.', 'success');
      break;
    case 'reset':
      if (!confirm('Wirklich den gesamten Lernfortschritt löschen? Das kann nicht rückgängig gemacht werden.')) break;
      resetProgress();
      applyTheme();
      ui.openChapters.clear();
      toast('Fortschritt zurückgesetzt.');
      renderView(false);
      refreshChrome();
      break;
  }
});

/* Tiles with role=button: keyboard activation */
document.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches?.('.tile-link')) {
    e.preventDefault();
    e.target.click();
  }
});

document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.id === 'email-text') {
    ui.email.drafts[ui.email.promptId] = t.value;
    updateEmailFeedback();
  } else if (t.dataset.feynman) {
    saveFeynmanText(t.dataset.feynman, t.value);
  }
});

document.addEventListener('change', async (e) => {
  const t = e.target;
  if (t.dataset.rubric) {
    const id = t.dataset.rubric;
    toggleFeynmanPoint(id, Number(t.dataset.idx), t.checked);
    const ch = findChapter(id);
    const counter = $(`[data-rubric-count="${id}"]`);
    if (counter && ch) counter.textContent = `${getFeynman(id).checkedPoints.length}/${ch.feynman.rubric.length}`;
  } else if (t.id === 'import-file' && t.files[0]) {
    try {
      await importBackup(t.files[0]);
      applyTheme();
      toast('Backup erfolgreich importiert.', 'success');
      renderView(false);
      refreshChrome();
    } catch {
      toast('Import fehlgeschlagen: Datei ist kein gültiges Backup (JSON).', 'error');
    }
    t.value = '';
  }
});

document.addEventListener('keydown', (e) => {
  const tag = e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  if (e.key === 'Escape' && ui.view !== 'home') {
    go('home');
    return;
  }

  if (ui.view === 'cards') {
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      revealCard();
    } else if (['1', '2', '3', '4'].includes(e.key)) {
      rateCurrent(Number(e.key));
    }
  } else if (ui.view === 'quiz') {
    const s = ui.quiz;
    const q = s.queue[s.idx];
    if (!q) return;
    const n = Number(e.key);
    if (n >= 1 && n <= q.options.length && !s.result) {
      s.selected = n - 1;
      renderQuizStage();
    } else if (e.key === 'Enter') {
      if (e.target.closest?.('button')) return; // let focused buttons handle Enter natively
      e.preventDefault();
      if (s.result) quizNext(); else quizSubmit();
    }
  }
});

/* ------------------------------------------------------------------ */
/* Boot                                                                 */
/* ------------------------------------------------------------------ */

applyTheme();
route();
setInterval(renderMenubar, 30000);
