// StudyOS WS26 · Native — iOS-style on phones, macOS split view on the MacBook.
// One codebase: markup is shared, CSS switches the layout at 900px; the route lives in the hash,
// so the current location survives every resize.

import {
  COURSES_META, ENGLISH_DATA, DIAGRAMS, store, ALL_DATA, ALL_QUIZZES, ALL_CHAPTERS,
  courseMeta, escapeHtml, pdfHref, buildFlashcardQueue, rateCard, intervalsFor, isDue,
  RATING_LABELS, cardStats, buildQuizQueue, CONFIDENCE_LEVELS, submitQuiz, calibrationStats,
  getCourseMastery, overallMastery, todayProgress, activityHistory, streakLabel, allDeadlines,
  formatDate, daysLeftLabel, getFeynman, saveFeynmanText, toggleFeynmanPoint, togglePinChapter,
  loadCoursePins, clearPins, analyzeEmail, downloadBackup, importBackup, resetProgress, Pomodoro,
} from '../shared/core.js';

/* ================================================================== helpers */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const html = document.documentElement;
const mqDesk = matchMedia('(min-width: 900px)');
const mqWide = matchMedia('(min-width: 1200px)');
const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
const isDesk = () => mqDesk.matches;

const CH_BY_ID = new Map(ALL_CHAPTERS.map(c => [c.id, c]));
const COURSE_IDS = COURSES_META.map(c => c.id);

const UI_KEY = 'studyos-native-ui';
const DRAFT_KEY = 'studyos-native-drafts';
const ui = loadJSON(UI_KEY, { inspector: true, newPerDay: 20 });
const drafts = loadJSON(DRAFT_KEY, {});

/* ---- Daily limit for NEW cards: reviews always come first, new cards are introduced
   in exam-priority order (chapter examWeight desc, then course/chapter order). ---- */
const NEW_KEY = 'studyos-native-new';
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
function introducedToday() {
  const log = loadJSON(NEW_KEY, { date: '', ids: [] });
  return log.date === todayISO() ? log.ids : [];
}
function markIntroduced(id) {
  const ids = introducedToday();
  if (!ids.includes(id)) saveJSON(NEW_KEY, { date: todayISO(), ids: [...ids, id] });
}
const isNewCard = (card) => !(store.state.cards[card.id]?.totalReviews > 0);

/** Today's study set for a course filter: all due reviews + new cards up to the remaining daily budget. */
function todaysCards(filter) {
  const all = buildFlashcardQueue(filter, true); // interleaved for 'all'
  const reviews = all.filter(c => !isNewCard(c) && isDue(store.state.cards[c.id]));
  const budget = Math.max(0, ui.newPerDay - introducedToday().length);
  const fresh = all.filter(isNewCard)
    .map((c, i) => ({ c, i, w: CH_BY_ID.get(c.chapterId)?.examWeight || 2, ex: c.examRelevant ? 1 : 0 }))
    .sort((a, b) => b.w - a.w || b.ex - a.ex || a.i - b.i)
    .slice(0, budget)
    .map(x => x.c.id);
  const pick = new Set([...reviews.map(c => c.id), ...fresh]);
  return all.filter(c => pick.has(c.id));
}
const dueToday = (filter) => todaysCards(filter).length;

function loadJSON(key, fallback) {
  try { return { ...fallback, ...JSON.parse(localStorage.getItem(key) || '{}') }; } catch { return { ...fallback }; }
}
function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage full or blocked */ }
}

/* SF-Symbol-like line icons (24×24) */
const P = {
  today: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2"/>',
  cards: '<rect x="3" y="7.5" width="14.5" height="12.5" rx="2.5"/><path d="M7 4.5h11.5A2.5 2.5 0 0 1 21 7v9.5"/>',
  quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 0 1 4.9.7c0 1.7-2.5 2.1-2.5 3.7"/><circle cx="12" cy="16.9" r=".5" fill="currentColor"/>',
  courses: '<rect x="3.5" y="4" width="4.5" height="16" rx="1"/><rect x="9.5" y="4" width="4.5" height="16" rx="1"/><path d="M15.8 5.4l3.7-.8 3 14.6-3.7.8z"/>',
  more: '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="12" r=".7" fill="currentColor"/><circle cx="12" cy="12" r=".7" fill="currentColor"/><circle cx="16" cy="12" r=".7" fill="currentColor"/>',
  email: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3.8 7.2L12 13l8.2-5.8"/>',
  sheet: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 11h6M9 14.5h6M9 18h4"/>',
  methods: '<path d="M9.2 18h5.6M10.2 21h3.6"/><path d="M12 3a6 6 0 0 0-3.7 10.7c.7.6 1 1.3 1 2.1v.2h5.4v-.2c0-.8.3-1.5 1-2.1A6 6 0 0 0 12 3z"/>',
  chevR: '<path d="M9 5l7 7-7 7"/>',
  chevL: '<path d="M15 4.5L7.5 12l7.5 7.5"/>',
  sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2M9.5 2.8h5"/>',
  pin: '<path d="M9 3.5h6l-.9 5.5 3.4 3.3V14h-11v-1.7L9.9 9z"/><path d="M12 14v6.5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  xmark: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  minus: '<path d="M6 12h12"/>',
  plus: '<path d="M12 6v12M6 12h12"/>',
  printer: '<path d="M7 9V3.5h10V9"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v6.5H7z"/>',
  trash: '<path d="M4 7h16M9.5 7V4.5h5V7M6 7l1 13h10l1-13"/>',
  download: '<path d="M12 3.5v11M7.5 10.5L12 15l4.5-4.5"/><path d="M5 14v4.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V14"/>',
  upload: '<path d="M12 15V4M7.5 8L12 3.5 16.5 8"/><path d="M5 14v4.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V14"/>',
  reset: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 3.5v4h4"/>',
  inspector: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M15 4.5v15"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>',
  pause: '<path d="M8.5 5.5v13M15.5 5.5v13" stroke-width="3.2"/>',
  flame: '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.4 2.6-5.3 3.6-8.3 1.6 1.2 2.4 2.7 2.6 4.3 1-.7 1.7-1.9 1.9-3.3 2.2 1.8 3.9 4.4 3.9 7.3 0 3.6-2.6 6.2-5.5 6.2z"/>',
  star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" fill="currentColor" stroke="none"/>',
  external: '<path d="M14 4h6v6M20 4l-8.5 8.5"/><path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  shuffle: '<path d="M3 7h3.5c4 0 6 10 10 10H21M3 17h3.5c1.6 0 2.8-1.6 3.8-3.4M13.7 10.4C14.7 8.6 15.9 7 17.5 7H21"/><path d="M18.5 4.5L21 7l-2.5 2.5M18.5 14.5L21 17l-2.5 2.5"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
  keyboard: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M9 10h.01M12 10h.01M15 10h.01M18 10h.01M7.5 14h9"/>',
  chart: '<path d="M5 20v-8M10 20V5M15 20v-6M20 20V9"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8" fill="currentColor"/>',
  bolt: '<path d="M13.5 2.5L5 13.5h6.5L10.5 21.5 19 10.5h-6.5z"/>',
  repeat: '<path d="M4 11V9.5A3.5 3.5 0 0 1 7.5 6H19M16 3l3 3-3 3M20 13v1.5a3.5 3.5 0 0 1-3.5 3.5H5M8 21l-3-3 3-3"/>',
  speech: '<path d="M4 5.5h16v10H10l-4.5 4v-4H4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  image: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="M21 16l-5-5-8.5 8.5"/>',
  warn: '<path d="M12 4l9 16H3z"/><path d="M12 10v4.5"/><circle cx="12" cy="17.2" r=".5" fill="currentColor"/>',
  circle: '<circle cx="12" cy="12" r="8.5"/>',
  checkCircle: '<circle cx="12" cy="12" r="9" fill="currentColor" stroke="none"/><path d="M7.8 12.3l2.9 2.9 5.6-5.8" stroke="var(--on-fill, #fff)" stroke-width="2.2"/>',
  xCircle: '<circle cx="12" cy="12" r="9" fill="currentColor" stroke="none"/><path d="M9 9l6 6M15 9l-6 6" stroke="var(--on-fill, #fff)" stroke-width="2.2"/>',
};
const icon = (n, cls = '') =>
  `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;

/** Concentric activity rings; items outer → inner. */
function rings(items, size = 120, stroke = 14, gap = 2, extra = '') {
  const c = size / 2;
  let r = c - stroke / 2;
  let out = '';
  for (const it of items) {
    const circ = 2 * Math.PI * r;
    const pct = Math.max(0, Math.min(100, it.pct || 0));
    out += `<circle class="ring-track" cx="${c}" cy="${c}" r="${r}" stroke-width="${stroke}" style="stroke:${it.color}"/>`
      + `<circle class="ring-fill" ${it.attr || ''} data-circ="${circ.toFixed(2)}" cx="${c}" cy="${c}" r="${r}" stroke-width="${stroke}" style="stroke:${it.color}"`
      + ` stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${(circ * (1 - pct / 100)).toFixed(2)}" transform="rotate(-90 ${c} ${c})"/>`;
    r -= stroke + gap;
  }
  return `<svg class="rings ${extra}" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true">${out}</svg>`;
}

const tile = (content, color, cls = '') => `<span class="tile ${cls}" style="--c:${color}">${content}</span>`;
const courseTag = (cid) => { const m = courseMeta(cid); return `<span class="tag" style="--c:${m.color}">${m.short}</span>`; };
const kbd = (k) => `<kbd>${k}</kbd>`;
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function seg(act, items, value, cls = '') {
  return `<div class="seg ${cls}" role="radiogroup">${items.map(it =>
    `<button type="button" class="seg-b" role="radio" aria-checked="${String(it.v) === String(value)}" data-act="${act}" data-v="${escapeHtml(it.v)}">`
    + `<span class="seg-l">${it.label}</span>${it.n != null ? `<span class="seg-n">${it.n}</span>` : ''}</button>`).join('')}</div>`;
}

function switchHtml(change, on, label, extra = '') {
  return `<label class="switch"><input type="checkbox" role="switch" data-change="${change}" ${extra} ${on ? 'checked' : ''} aria-label="${escapeHtml(label)}"><span class="switch-ui"></span></label>`;
}

function group(title, inner, footer = '', cls = '') {
  return `<section class="group ${cls}">${title ? `<h2 class="group-h">${title}</h2>` : ''}${inner}${footer ? `<p class="group-f">${footer}</p>` : ''}</section>`;
}

/* ================================================================== routing */

const SECTIONS = ['today', 'cards', 'quiz', 'courses', 'email', 'sheet', 'methods'];
const TAB_OF = { today: 'today', cards: 'cards', quiz: 'quiz', courses: 'courses', course: 'courses', chapter: 'courses', analysis: 'courses', more: 'more', email: 'more', sheet: 'more', methods: 'more' };
const TITLES = { today: 'Heute', cards: 'Karteikarten', quiz: 'Quiz', courses: 'Kurse', more: 'Mehr', email: 'E-Mail-Coach', sheet: 'Spickzettel', methods: 'Methoden & Daten' };

const EXAM_WEIGHT = {
  3: { dots: '●●●', label: 'Klausur: sehr wahrscheinlich', cls: 'w3' },
  2: { dots: '●●○', label: 'Klausur: wahrscheinlich', cls: 'w2' },
  1: { dots: '●○○', label: 'Klausur: eher selten', cls: 'w1' },
};
const weightTag = (w, long = false) => {
  const e = EXAM_WEIGHT[w];
  return e ? `<span class="tag tag-weight ${e.cls}" title="${e.label}">${e.dots}${long ? ` ${e.label.replace('Klausur: ', '')}` : ''}</span>` : '';
};
/** Link into the original Moodle PDF (opens at the page when known). */
const sourceLink = (src) => (src
  ? `<a class="src-link" href="${pdfHref(src.path)}${src.page ? `#page=${src.page}` : ''}" target="_blank" rel="noopener">${icon('doc')}<span>Quelle: ${escapeHtml(src.title)}${src.page ? `, S. ${src.page}` : ''}</span></a>`
  : '');

function parsePath(path) {
  const [a = 'today', b, c] = String(path || '').split('/').filter(Boolean).map(decodeURIComponent);
  if (a === 'courses' && b && ALL_DATA[b]) {
    const ch = c && CH_BY_ID.get(c);
    if (ch && ch.courseId === b) return { name: 'chapter', cid: b, chid: c, path: `courses/${b}/${c}` };
    if (c === 'analyse') return { name: 'analysis', cid: b, path: `courses/${b}/analyse` };
    return { name: 'course', cid: b, path: `courses/${b}` };
  }
  if (TITLES[a]) return { name: a, path: a };
  return { name: 'today', path: 'today' };
}

/** Navigation metadata: phone tab, stack depth, parent (for the back button / edge swipe). */
function info(r) {
  const tab = TAB_OF[r.name];
  if (r.name === 'course') return { tab, depth: 1, parent: 'courses', parentTitle: 'Kurse', title: courseMeta(r.cid).short };
  if (r.name === 'chapter') return { tab, depth: 2, parent: `courses/${r.cid}`, parentTitle: courseMeta(r.cid).short, title: CH_BY_ID.get(r.chid).title };
  if (r.name === 'analysis') return { tab, depth: 2, parent: `courses/${r.cid}`, parentTitle: courseMeta(r.cid).short, title: `Klausur-Analyse ${courseMeta(r.cid).short}` };
  if (tab === 'more' && r.name !== 'more') return { tab, depth: 1, parent: 'more', parentTitle: 'Mehr', title: TITLES[r.name] };
  return { tab, depth: 0, parent: null, title: TITLES[r.name] };
}

const stack = $('#stack');
const scrollMemo = new Map();
const tabLast = {};
let current = null; // { route, el }

function go(path) {
  if (current && current.route.path === parsePath(path).path) rerender({ top: true });
  else location.hash = '#/' + path;
}

function onHash() {
  const route = parsePath(location.hash.replace(/^#\/?/, ''));
  if (current && current.route.path === route.path) return; // already showing (e.g. after edge swipe)
  show(route);
}

function direction(from, to) {
  if (!from) return 'none';
  if (isDesk()) return 'fade';
  const a = info(from), b = info(to);
  if (a.tab !== b.tab) return 'none';
  if (b.depth > a.depth) return 'push';
  if (b.depth < a.depth) return 'pop';
  return 'none';
}

function show(route) {
  // finish any running transition immediately
  for (const el of $$('.page', stack)) if (!current || el !== current.el) el.remove();
  const prev = current;
  if (prev) {
    scrollMemo.set(prev.route.path, prev.el.scrollTop);
    prev.el.getAnimations().forEach(a => a.cancel());
  }
  const dir = direction(prev && prev.route, route);
  const el = buildPage(route);
  if (dir === 'pop') stack.insertBefore(el, prev.el); else stack.appendChild(el);
  el.scrollTop = dir === 'push' ? 0 : (scrollMemo.get(route.path) || 0);
  syncScrolled(el);
  current = { route, el };
  tabLast[info(route).tab] = route.path;

  if (prev) {
    const animate = !mqReduce.matches && dir !== 'none';
    if (!animate) prev.el.remove();
    else if (dir === 'fade') {
      prev.el.remove();
      el.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 180, easing: 'ease-out' });
    } else {
      const w = stack.clientWidth;
      const opts = { duration: 420, easing: 'cubic-bezier(.32,.72,0,1)' };
      prev.el.classList.add('is-leaving');
      if (dir === 'push') {
        el.animate([{ transform: `translateX(${w}px)` }, { transform: 'none' }], opts);
        prev.el.animate([{ transform: 'none', filter: 'brightness(1)' }, { transform: `translateX(${-w * 0.3}px)`, filter: 'brightness(.9)' }], opts)
          .finished.then(() => prev.el.remove(), () => {});
      } else {
        el.animate([{ transform: `translateX(${-w * 0.3}px)`, filter: 'brightness(.9)' }, { transform: 'none', filter: 'brightness(1)' }], opts);
        prev.el.animate([{ transform: 'none' }, { transform: `translateX(${w}px)` }], opts)
          .finished.then(() => prev.el.remove(), () => {});
      }
    }
  }
  afterShow();
}

function afterShow() {
  document.title = `${info(current.route).title} · StudyOS`;
  refreshChrome();
  if (isDesk() && !document.activeElement?.closest('.sidebar')) current.el.focus({ preventScroll: true });
}

/** Re-render the current page in place (no transition), keeping its scroll position. */
function rerender({ top = false } = {}) {
  if (!current) return;
  const st = current.el.scrollTop;
  const el = buildPage(current.route);
  current.el.replaceWith(el);
  current.el = el;
  el.scrollTop = top ? 0 : st;
  syncScrolled(el);
  refreshChrome();
}

function syncScrolled(el) {
  el.classList.toggle('is-scrolled', el.scrollTop > 4);
  el.classList.toggle('is-collapsed', el.scrollTop > 36);
}

/* ================================================================== page shell */

const PAGES = {
  today: pageToday, cards: pageCards, quiz: pageQuiz, courses: pageCourses, course: pageCourse,
  chapter: pageChapter, analysis: pageAnalysis, more: pageMore, email: pageEmail, sheet: pageSheet, methods: pageMethods,
};

function buildPage(route) {
  const meta = info(route);
  const def = PAGES[route.name](route);
  const el = document.createElement('section');
  el.className = `page page-${route.name}`;
  el.dataset.path = route.path;
  el.tabIndex = -1;
  el.setAttribute('aria-label', meta.title);

  const back = meta.parent
    ? `<a class="nb-back" href="#/${meta.parent}" aria-label="Zurück zu ${escapeHtml(meta.parentTitle)}">${icon('chevL')}<span>${escapeHtml(meta.parentTitle)}</span></a>`
    : '';
  const crumbs = def.crumbs || '';
  el.innerHTML = `
    <header class="navbar">
      <div class="nb-l">
        ${back}
        <div class="nb-hist">
          <button type="button" class="tb-btn" data-act="hist-back" aria-label="Zurück" title="Zurück (⌘[)">${icon('chevL')}</button>
          <button type="button" class="tb-btn" data-act="hist-fwd" aria-label="Vorwärts" title="Vorwärts (⌘])">${icon('chevR')}</button>
        </div>
      </div>
      <div class="nb-title"><span class="nb-t">${escapeHtml(def.short || meta.title)}</span>${crumbs ? `<span class="nb-crumbs">${crumbs}</span>` : ''}</div>
      <div class="nb-r">
        ${def.right || ''}
        <button type="button" class="tb-btn pomo-pill" data-act="pomo-sheet" aria-label="Pomodoro-Timer" title="Pomodoro (P)">${icon('timer')}<span class="pomo-pill-t" data-pomo-time>${pomo.display}</span></button>
        <button type="button" class="tb-btn ${meta.depth === 0 ? '' : 'desk-only'}" data-act="settings" aria-label="Einstellungen" title="Einstellungen">${icon('sliders')}</button>
        <button type="button" class="tb-btn desk-only insp-toggle" data-act="inspector" aria-label="Inspektor ein-/ausblenden" title="Inspektor (I)">${icon('inspector')}</button>
      </div>
    </header>
    <div class="page-body ${def.wide ? 'is-wide' : ''}">
      <div class="large">
        ${def.eyebrow ? `<p class="large-eyebrow">${def.eyebrow}</p>` : ''}
        <h1 class="large-title ${def.longTitle ? 'is-long' : ''}">${escapeHtml(meta.title)}</h1>
        ${def.sub ? `<p class="large-sub">${def.sub}</p>` : ''}
      </div>
      ${def.body}
    </div>`;
  el.addEventListener('scroll', () => syncScrolled(el), { passive: true });
  return el;
}

/* ================================================================== sessions */

const cardsS = { filter: 'all', chapter: null, queue: null, idx: 0, revealed: false, reviewed: 0, includeAll: false };
const quizS = { filter: 'all', chapter: null, queue: null, idx: 0, selected: null, confidence: 'medium', result: null, correct: 0, answered: 0 };

/** chapter (optional): restrict to one chapter — all of its cards, due ones first. */
function startCards(filter = cardsS.filter, includeAll = false, chapter = null) {
  let queue;
  if (chapter) {
    const cards = buildFlashcardQueue(filter, true).filter(c => c.chapterId === chapter);
    queue = [...cards.filter(c => isDue(store.state.cards[c.id])), ...cards.filter(c => !isDue(store.state.cards[c.id]))];
  } else {
    queue = includeAll ? buildFlashcardQueue(filter, true) : todaysCards(filter);
  }
  Object.assign(cardsS, { filter, chapter, includeAll: includeAll || !!chapter, queue, idx: 0, revealed: false, reviewed: 0 });
}
function startQuiz(filter = quizS.filter, chapter = null) {
  const all = buildQuizQueue(filter);
  const queue = chapter ? all.filter(q => q.chapterId === chapter) : all;
  Object.assign(quizS, { filter, chapter, queue, idx: 0, selected: null, confidence: 'medium', result: null, correct: 0, answered: 0 });
}
function resetSessions() {
  cardsS.queue = null;
  quizS.queue = null;
}

const chapterScope = (chid) => {
  const ch = chid && CH_BY_ID.get(chid);
  return ch ? ` · Kapitel „${escapeHtml(ch.title)}“` : '';
};

const filterItems = (countFn) => [
  { v: 'all', label: 'Alle', n: countFn('all') },
  ...COURSES_META.map(c => ({ v: c.id, label: c.short, n: countFn(c.id) })),
];

/* ================================================================== pages */

function pageToday() {
  const tp = todayProgress();
  const due = dueToday('all');
  const mastery = overallMastery();
  const focusPct = Math.min(100, Math.round((tp.minutes / 25) * 100));
  const deadlines = allDeadlines().slice(0, 5);
  const week = activityHistory(7);
  const maxDay = Math.max(tp.goal, ...week.map(d => d.total), 1);
  const cs = cardStats('all');
  const cal = calibrationStats();

  const ringsCard = `
    <section class="card rings-card">
      ${rings([{ pct: tp.pct, color: 'var(--ring1)' }, { pct: focusPct, color: 'var(--ring2)' }, { pct: mastery, color: 'var(--ring3)' }], 150, 17, 3)}
      <ul class="ring-legend">
        <li style="--c:var(--ring1)"><span class="lg-k">Tagesziel</span><span class="lg-v">${tp.done}<small>/${tp.goal}</small></span><span class="lg-s">${plural(tp.reviews, 'Karte', 'Karten')} · ${plural(tp.quizzes, 'Frage', 'Fragen')}</span></li>
        <li style="--c:var(--ring2)"><span class="lg-k">Fokus</span><span class="lg-v">${tp.minutes}<small>/25 Min</small></span><span class="lg-s">Pomodoro-Minuten heute</span></li>
        <li style="--c:var(--ring3)"><span class="lg-k">Gemeistert</span><span class="lg-v">${mastery}<small>%</small></span><span class="lg-s">Ø über alle Kurse</span></li>
      </ul>
      <p class="streak">${icon('flame')} Lernserie: <strong>${streakLabel()}</strong></p>
    </section>`;

  const startCard = `
    <section class="card start-card">
      ${tile(icon('shuffle'), 'var(--tint)', 'tile-lg')}
      <div class="start-txt">
        <h2>Gemischte Session</h2>
        <p>${due ? `${plural(due, 'Karte', 'Karten')} fällig – alle Kurse verschränkt (Interleaving).` : 'Keine Karte fällig. Du kannst trotzdem alle Karten gemischt üben.'}</p>
      </div>
      <button type="button" class="btn btn-filled btn-lg" data-act="start-session" data-all="${due ? '' : '1'}">${due ? 'Jetzt lernen' : 'Alle üben'}</button>
    </section>`;

  const courseRows = COURSES_META.map(c => {
    const m = getCourseMastery(c.id);
    const d = dueToday(c.id);
    return `<li><a class="row" href="#/courses/${c.id}">
      ${tile(c.icon, c.color)}
      <span class="row-main"><span class="row-title">${c.short}</span><span class="row-sub">${escapeHtml(c.title)}</span></span>
      <span class="row-detail">${d ? `<span class="badge">${d}</span>` : ''}${rings([{ pct: m, color: c.color }], 30, 5)}<span class="pct">${m}%</span></span>
      ${icon('chevR', 'chev')}</a></li>`;
  }).join('');

  const weekHtml = `<div class="card week">
    <div class="week-bars">${week.map((d, i) => `<div class="wb ${i === week.length - 1 ? 'is-today' : ''}" title="${d.label}: ${d.reviews} Karten, ${d.quizzes} Fragen, ${d.minutes} Min">
      <span class="wb-n">${d.total || ''}</span><span class="wb-bar"><i style="height:${Math.round((d.total / maxDay) * 100)}%"></i></span><span class="wb-l">${d.weekday}</span></div>`).join('')}
    </div>
    <p class="week-sum">${week.reduce((a, d) => a + d.total, 0)} Wiederholungen · ${week.reduce((a, d) => a + d.minutes, 0)} Fokus-Min in 7 Tagen</p>
  </div>`;

  const statusSeg = [['new', 'Neu', 'var(--gray)'], ['due', 'Fällig', 'var(--orange)'], ['learning', 'Lernend', 'var(--tint)'], ['mastered', 'Gemeistert', 'var(--green)']];
  const statusHtml = `<div class="card status">
    <div class="stack-bar">${statusSeg.map(([k, , col]) => cs[k] ? `<i style="flex:${cs[k]};background:${col}"></i>` : '').join('')}</div>
    <ul class="status-legend">${statusSeg.map(([k, l, col]) => `<li><span class="dot" style="background:${col}"></span>${l}<strong>${cs[k]}</strong></li>`).join('')}</ul>
  </div>`;

  const calRows = CONFIDENCE_LEVELS.map(l => {
    const s = cal[l.value];
    const pct = s.n ? Math.round((s.ok / s.n) * 100) : null;
    return `<li class="row"><span class="row-main"><span class="row-title">${l.label}</span><span class="row-sub">${plural(s.n, 'Antwort', 'Antworten')}</span></span>
      <span class="row-detail"><span class="meter"><i style="width:${pct ?? 0}%"></i></span><span class="pct">${pct == null ? '–' : pct + '%'}</span></span></li>`;
  }).join('');

  return {
    sub: new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }),
    wide: true,
    body: `<div class="today-grid">
      <div class="tg-a">${ringsCard}${startCard}</div>
      <div class="tg-b">${group('Kurse', `<ul class="list">${courseRows}</ul>`)}
      ${group('Nächste Fristen', `<ul class="list">${deadlineRows(deadlines)}</ul>`, '', 'g-deadlines')}</div>
      <div class="tg-c">${group('Diese Woche', weekHtml)}${group('Kartenstatus', statusHtml)}
      ${group('Kalibrierung', `<ul class="list">${calRows}</ul>`, 'Trefferquote je Sicherheitsstufe im Quiz. Gut kalibriert heißt: „100% sicher“ liegt nahe 100%.')}</div>
    </div>`,
  };
}

function deadlineRows(list) {
  if (!list.length) return '<li class="row"><span class="row-main"><span class="row-sub">Keine anstehenden Fristen.</span></span></li>';
  return list.map(d => {
    const [, mm, dd] = d.date.split('-');
    const hot = d.urgent || d.daysLeft <= 3;
    return `<li class="row dl">
      <span class="dl-date" style="--c:${d.color}"><b>${dd}</b><small>${['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'][+mm - 1]}</small></span>
      <span class="row-main"><span class="row-title">${escapeHtml(d.label)}</span><span class="row-sub">${d.courseShort} · ${formatDate(d.date)}</span></span>
      <span class="row-detail"><span class="pill ${hot ? 'pill-red' : ''}">${daysLeftLabel(d.daysLeft)}</span></span></li>`;
  }).join('');
}

/* ---------- Karten ---------- */

function pageCards() {
  if (!cardsS.queue) startCards(cardsS.filter);
  const filters = seg('cards-filter', filterItems(c => dueToday(c)), cardsS.filter, 'seg-courses');
  const card = cardsS.queue[cardsS.idx];
  let body;
  if (card) {
    const m = courseMeta(card.courseId);
    const ch = CH_BY_ID.get(card.chapterId);
    const iv = intervalsFor(card);
    const total = cardsS.queue.length;
    body = `
      <div class="progress"><span>Karte ${cardsS.idx + 1} von ${total}${cardsS.chapter ? chapterScope(cardsS.chapter) : cardsS.includeAll ? ' · alle Karten' : ''}</span><span class="progress-bar"><i style="width:${(cardsS.idx / total) * 100}%"></i></span></div>
      <article class="flashcard ${cardsS.revealed ? 'is-revealed' : ''}" ${cardsS.revealed ? '' : 'data-act="reveal" role="button" tabindex="0" aria-label="Antwort aufdecken"'}>
        <div class="fc-meta">
          <span class="tag" style="--c:${m.color}">${m.icon} ${m.short}</span>
          ${card.examRelevant ? `<span class="tag tag-exam">${icon('star')} Klausurrelevant</span>` : ''}
          ${ch ? `<span class="fc-ch">${escapeHtml(ch.title)}</span>` : ''}
        </div>
        <p class="fc-front">${escapeHtml(card.front)}</p>
        ${cardsS.revealed
          ? `<hr class="fc-hr"><p class="fc-back">${escapeHtml(card.back)}</p>${sourceLink(card.source)}`
          : `<p class="fc-hint">Erst selbst erinnern – dann <span class="touch-only">tippen</span><span class="mouse-only">klicken oder ${kbd('Leertaste')}</span>.</p>`}
      </article>
      <div class="dock">
        ${cardsS.revealed
          ? `<p class="dock-h">Wie gut wusstest du es?</p><div class="rate-grid">${RATING_LABELS.map(r => `
              <button type="button" class="rate rate-${r.value}" data-act="rate" data-v="${r.value}">
                <span class="rate-l">${r.label}</span><span class="rate-i">${iv[r.value]}</span>${kbd(r.key)}</button>`).join('')}</div>`
          : `<button type="button" class="btn btn-filled btn-xl" data-act="reveal">Antwort zeigen ${kbd('Leertaste')}</button>`}
      </div>`;
  } else {
    const label = cardsS.filter === 'all' ? 'in allen Kursen' : `in ${courseMeta(cardsS.filter).short}`;
    body = `<div class="empty">
      ${tile(icon('check'), 'var(--green)', 'tile-xl')}
      <h2>${cardsS.reviewed ? 'Session geschafft' : 'Alles erledigt'}</h2>
      <p>${cardsS.reviewed ? `${plural(cardsS.reviewed, 'Bewertung', 'Bewertungen')} gespeichert. ` : ''}Keine fälligen Karten ${label} – der Abstand arbeitet jetzt für dich.</p>
      ${(() => {
        const waiting = buildFlashcardQueue(cardsS.filter, true).filter(isNewCard).length;
        return waiting && !cardsS.chapter ? `<p class="empty-note">${plural(waiting, 'neue Karte wartet', 'neue Karten warten')} – Tageslimit (${ui.newPerDay}) erreicht. Mehr über „Alle Karten nochmal üben“ oder das Limit in den <button type="button" class="linkish" data-act="settings">Einstellungen</button>.</p>` : '';
      })()}
      <div class="empty-actions">
        <button type="button" class="btn btn-filled btn-lg" data-act="cards-all">${icon('repeat')} Alle Karten nochmal üben</button>
        <button type="button" class="btn btn-tinted btn-lg" data-act="goto-quiz">${icon('quiz')} Weiter zum Quiz</button>
      </div></div>`;
  }
  return { short: 'Karten', sub: 'Spaced Repetition (SM-2)', body: `<div class="seg-wrap">${filters}</div><div class="study">${body}</div>` };
}

/* ---------- Quiz ---------- */

function pageQuiz() {
  if (!quizS.queue) startQuiz(quizS.filter);
  const filters = seg('quiz-filter', filterItems(c => (c === 'all' ? ALL_QUIZZES : ALL_QUIZZES.filter(q => q.courseId === c)).length), quizS.filter, 'seg-courses');
  const q = quizS.queue[quizS.idx];
  let body;
  if (q) {
    const m = courseMeta(q.courseId);
    const res = quizS.result;
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const opts = q.options.map((o, i) => {
      let st = '', mark = `<span class="opt-radio"></span>`;
      if (res) {
        if (i === q.answer) { st = 'is-correct'; mark = icon('checkCircle', 'opt-ic'); }
        else if (i === quizS.selected) { st = 'is-wrong'; mark = icon('xCircle', 'opt-ic'); }
        else st = 'is-dim';
      } else if (i === quizS.selected) st = 'is-selected';
      return `<li><button type="button" class="row opt ${st}" data-act="quiz-opt" data-i="${i}" ${res ? 'disabled' : ''} aria-pressed="${i === quizS.selected}">
        <span class="opt-letter">${letters[i]}</span><span class="row-main opt-text">${escapeHtml(o)}</span>${mark}</button></li>`;
    }).join('');
    const feedback = res ? `
      <section class="feedback ${res.correct ? 'is-ok' : 'is-bad'}" role="status">
        <h3>${icon(res.correct ? 'checkCircle' : 'xCircle')} ${res.correct ? 'Richtig!' : 'Leider falsch'}</h3>
        ${res.overconfident ? `<p class="hyper">${icon('warn')}<span><strong>Hyperkorrektur-Effekt:</strong> Du warst dir 100% sicher – genau solche Irrtümer korrigiert das Gedächtnis besonders nachhaltig, wenn du die Erklärung jetzt bewusst liest.</span></p>` : ''}
        <p class="expl">${escapeHtml(q.explanation)}</p>
        ${sourceLink(q.source)}
      </section>` : group('Wie sicher bist du?', seg('quiz-conf', CONFIDENCE_LEVELS.map(l => ({ v: l.value, label: l.label })), quizS.confidence, 'seg-conf'));
    body = `
      <div class="progress"><span>Frage ${quizS.idx + 1} von ${quizS.queue.length} · ${quizS.correct} richtig${chapterScope(quizS.chapter)}</span><span class="progress-bar"><i style="width:${(quizS.idx / quizS.queue.length) * 100}%"></i></span></div>
      <article class="card q-card">
        <div class="fc-meta"><span class="tag" style="--c:${m.color}">${m.icon} ${m.short}</span>${q.examStyle ? `<span class="tag tag-gray">${escapeHtml(q.examStyle)}</span>` : ''}</div>
        <h2 class="q-text">${escapeHtml(q.question)}</h2>
        ${q.code ? `<pre class="code"><code>${escapeHtml(q.code)}</code></pre>` : ''}
      </article>
      <ul class="list opts">${opts}</ul>
      ${feedback}
      <div class="dock">
        ${res
          ? `<button type="button" class="btn btn-filled btn-xl" data-act="quiz-next">${quizS.idx + 1 < quizS.queue.length ? 'Nächste Frage' : 'Auswertung'} ${kbd('↵')}</button>`
          : `<button type="button" class="btn btn-filled btn-xl" data-act="quiz-submit" ${quizS.selected == null ? 'disabled' : ''}>Antwort prüfen ${kbd('↵')}</button>`}
      </div>`;
  } else {
    const pct = quizS.answered ? Math.round((quizS.correct / quizS.answered) * 100) : 0;
    body = `<div class="empty">
      <div class="empty-ring">${rings([{ pct, color: 'var(--ring3)' }], 120, 16)}<span>${pct}%</span></div>
      <h2>Quiz beendet</h2>
      <p>${quizS.correct} von ${quizS.answered} richtig${quizS.filter === 'all' ? ' (alle Kurse)' : ` in ${courseMeta(quizS.filter).short}`}.</p>
      <div class="empty-actions">
        <button type="button" class="btn btn-filled btn-lg" data-act="quiz-restart">${icon('reset')} Neu starten</button>
        <a class="btn btn-tinted btn-lg" href="#/cards">${icon('cards')} Zu den Karten</a>
      </div></div>`;
  }
  return { sub: 'Prüfungsfragen mit Sicherheits-Check', body: `<div class="seg-wrap">${filters}</div><div class="study">${body}</div>` };
}

/* ---------- Kurse ---------- */

function pageCourses() {
  const tiles = COURSES_META.map(c => {
    const m = getCourseMastery(c.id);
    const d = dueToday(c.id);
    const chapters = ALL_DATA[c.id].chapters.length;
    return `<li><a class="course-tile" href="#/courses/${c.id}" style="--c:${c.color}">
      ${tile(c.icon, c.color, 'tile-lg')}
      <span class="ct-main"><span class="ct-title">${c.short} <span class="ct-full">${escapeHtml(c.title)}</span></span>
        <span class="ct-sub">${escapeHtml(c.subtitle)}</span>
        <span class="ct-stats">${plural(chapters, 'Kapitel', 'Kapitel')} · ${d ? `<b>${d} fällig</b>` : 'nichts fällig'}</span></span>
      <span class="ct-ring">${rings([{ pct: m, color: c.color }], 46, 6)}<span>${m}%</span></span>
      ${icon('chevR', 'chev')}</a></li>`;
  }).join('');
  return {
    sub: 'WS 26/27 · 4 Module',
    body: `<ul class="course-tiles">${tiles}</ul>${group('Alle Fristen', `<ul class="list">${deadlineRows(allDeadlines())}</ul>`)}`,
  };
}

function pageCourse(r) {
  const c = courseMeta(r.cid);
  const mastery = getCourseMastery(c.id);
  const due = dueToday(c.id);
  const quizzes = ALL_QUIZZES.filter(q => q.courseId === c.id).length;
  const chapters = ALL_DATA[c.id].chapters;
  const exam = [['Prüfungsform', c.examInfo.type], ['Hilfsmittel', c.examInfo.aid], ['Prüfungsvorleistung', c.examInfo.pvl], ['Zeitraum', c.examInfo.period]];

  const chRows = chapters.map(ch => {
    const f = getFeynman(ch.id);
    const pinned = store.isPinned(ch.cheatSheet.id);
    return `<li><a class="row" href="#/courses/${c.id}/${ch.id}">
      <span class="row-main"><span class="row-title">${escapeHtml(ch.title)}</span><span class="row-sub">${weightTag(ch.examWeight)}${escapeHtml(ch.badge || '')}</span></span>
      <span class="row-detail">${pinned ? `<span class="pin-ind" title="Auf dem Spickzettel">${icon('pin')}</span>` : ''}<span class="fey-ind" title="Feynman-Rubrik">${f.checkedPoints.length}/${ch.feynman.rubric.length}</span></span>
      ${icon('chevR', 'chev')}</a></li>`;
  }).join('');

  const pdfRows = c.pdfs.map(p => `<li><a class="row" href="${pdfHref(p.path)}" target="_blank" rel="noopener">
      ${tile(icon('doc'), 'var(--red)', 'tile-sm')}
      <span class="row-main"><span class="row-title">${escapeHtml(p.title)}</span></span>
      <span class="row-detail"><span class="pill">${escapeHtml(p.tag)}</span></span>${icon('external', 'chev')}</a></li>`).join('');

  const dls = allDeadlines().filter(d => d.courseId === c.id);

  return {
    sub: escapeHtml(c.title),
    crumbs: `<a href="#/courses">Kurse</a> › ${c.short}`,
    wide: true,
    body: `<div class="course-grid">
      <div class="cg-a">
        <section class="card hero" style="--c:${c.color}">
          ${tile(c.icon, c.color, 'tile-xl')}
          <div class="hero-txt"><h2>${escapeHtml(c.title)}</h2><p>${escapeHtml(c.subtitle)}</p><p class="hero-prof">${escapeHtml(c.prof)}</p></div>
          <div class="hero-ring">${rings([{ pct: mastery, color: c.color }], 72, 9)}<span>${mastery}%</span></div>
        </section>
        <div class="btn-row">
          <button type="button" class="btn btn-filled btn-lg" data-act="course-cards" data-c="${c.id}">${icon('cards')} Karten lernen${due ? ` · ${due}` : ''}</button>
          <button type="button" class="btn btn-tinted btn-lg" data-act="course-quiz" data-c="${c.id}">${icon('quiz')} Quiz · ${quizzes}</button>
        </div>
        ${group('Kapitel', `<ul class="list">${chRows}</ul>`, `Kapitel öffnen für Zusammenfassung, Diagramm, Feynman-Übung und Spickzettel. ${EXAM_WEIGHT[3].dots} = ${EXAM_WEIGHT[3].label.replace('Klausur: ', '')} klausurrelevant.`)}
      </div>
      <div class="cg-b">
        ${group('Prüfung', `<ul class="list">${exam.map(([k, v]) => `<li class="row row-stacked"><span class="row-sub">${k}</span><span class="row-title">${escapeHtml(v)}</span></li>`).join('')}
          <li><a class="row" href="#/courses/${c.id}/analyse">${tile(icon('star'), 'var(--orange)', 'tile-sm')}<span class="row-main"><span class="row-title">Klausur-Analyse &amp; Strategie</span><span class="row-sub">Was mit hoher Wahrscheinlichkeit drankommt</span></span>${icon('chevR', 'chev')}</a></li></ul>`)}
        ${group('Fristen', `<ul class="list">${deadlineRows(dls)}</ul>`)}
        ${group('Unterlagen', `<ul class="list">${pdfRows}</ul>`, 'PDFs öffnen in einem neuen Tab.')}
      </div>
    </div>`,
  };
}

function pageChapter(r) {
  const ch = CH_BY_ID.get(r.chid);
  const c = courseMeta(r.cid);
  const f = getFeynman(ch.id);
  const pinned = store.isPinned(ch.cheatSheet.id);
  const siblings = ALL_DATA[r.cid].chapters;
  const i = siblings.findIndex(x => x.id === ch.id);
  const prev = siblings[i - 1], next = siblings[i + 1];
  const diagram = ch.diagram && DIAGRAMS[ch.diagram];
  const nCards = ALL_DATA[r.cid].flashcards.filter(x => x.chapterId === ch.id).length;
  const nQuiz = ALL_DATA[r.cid].quizzes.filter(x => x.chapterId === ch.id).length;
  const sources = ch.sources || [];

  return {
    short: c.short,
    longTitle: true,
    eyebrow: `${courseTag(c.id)}${weightTag(ch.examWeight, true)}${ch.badge ? `<span class="tag tag-gray">${escapeHtml(ch.badge)}</span>` : ''}`,
    crumbs: `<a href="#/courses">Kurse</a> › <a href="#/courses/${c.id}">${c.short}</a> › ${escapeHtml(ch.title)}`,
    body: `
      ${nCards || nQuiz ? `<div class="btn-row">
        <button type="button" class="btn btn-filled btn-lg" data-act="chapter-cards" data-c="${c.id}" data-ch="${ch.id}" ${nCards ? '' : 'disabled'}>${icon('cards')} Karten · ${nCards}</button>
        <button type="button" class="btn btn-tinted btn-lg" data-act="chapter-quiz" data-c="${c.id}" data-ch="${ch.id}" ${nQuiz ? '' : 'disabled'}>${icon('quiz')} Quiz · ${nQuiz}</button>
      </div>` : ''}
      ${group('', `<ul class="list"><li class="row">
        ${tile(icon('pin'), 'var(--orange)')}
        <span class="row-main"><span class="row-title">Auf Spickzettel</span><span class="row-sub">${escapeHtml(ch.cheatSheet.title)}</span></span>
        ${switchHtml('pin', pinned, 'Auf Spickzettel anheften', `data-ch="${ch.id}"`)}</li></ul>`)}
      ${group('Zusammenfassung', `<div class="card prose"><ul class="summary">${ch.summary.map(s => `<li>${s}</li>`).join('')}</ul></div>`)}
      ${diagram ? group('Diagramm', `<figure class="card diagram"><div class="diagram-scroll">${diagram.svg}</div><figcaption>${escapeHtml(diagram.title)}</figcaption></figure>`, '<span class="touch-only">Diagramm seitlich wischen, um alles zu sehen.</span>') : ''}
      ${group('Feynman-Technik', `
        <div class="card feynman">
          <p class="fey-prompt">${escapeHtml(ch.feynman.prompt)}</p>
          <textarea class="textarea" data-input="feynman" data-ch="${ch.id}" rows="6" placeholder="Erkläre es in eigenen Worten – so einfach wie möglich …" aria-label="Feynman-Erklärung">${escapeHtml(f.text)}</textarea>
          <p class="fey-status" data-fey-status>${f.text ? 'Gespeichert' : 'Wird automatisch gespeichert'}</p>
        </div>`)}
      ${group(`Checkliste <span class="count" data-rubric-count>${f.checkedPoints.length}/${ch.feynman.rubric.length}</span>`, `<ul class="list">${ch.feynman.rubric.map((p, idx) => `
        <li><label class="row check-row"><input type="checkbox" data-change="rubric" data-ch="${ch.id}" data-i="${idx}" ${f.checkedPoints.includes(idx) ? 'checked' : ''}>
          <span class="checkmark">${icon('check')}</span><span class="row-main"><span class="row-title">${escapeHtml(p)}</span></span></label></li>`).join('')}</ul>`,
        'Hake ab, was deine Erklärung abdeckt. Lücken = genau dort nochmal nachlesen.')}
      ${group('Spickzettel-Eintrag', `<div class="card cs-preview"><h3>${escapeHtml(ch.cheatSheet.title)}</h3><p>${escapeHtml(ch.cheatSheet.content)}</p>${ch.cheatSheet.code ? `<pre class="code"><code>${escapeHtml(ch.cheatSheet.code)}</code></pre>` : ''}</div>`)}
      ${sources.length ? group('Quellen aus Moodle', `<ul class="list">${sources.map(s => `<li><a class="row" href="${pdfHref(s.path)}${s.page ? `#page=${s.page}` : ''}" target="_blank" rel="noopener">
        ${tile(icon('doc'), 'var(--red)', 'tile-sm')}<span class="row-main"><span class="row-title">${escapeHtml(s.title)}</span>${s.page ? `<span class="row-sub">ab S. ${s.page}</span>` : ''}</span>${icon('external', 'chev')}</a></li>`).join('')}</ul>`) : ''}
      <nav class="pager">
        ${prev ? `<a class="pager-b" href="#/courses/${c.id}/${prev.id}">${icon('chevL')}<span><small>Vorheriges</small>${escapeHtml(prev.title)}</span></a>` : '<span></span>'}
        ${next ? `<a class="pager-b is-next" href="#/courses/${c.id}/${next.id}"><span><small>Nächstes</small>${escapeHtml(next.title)}</span>${icon('chevR')}</a>` : '<span></span>'}
      </nav>`,
  };
}

/* ---------- Klausur-Analyse (docs/klausur-analyse/<course>.md) ---------- */

const analysisCache = new Map(); // cid -> { status: 'loading'|'ok'|'error', html }

/** Relative links in the analysis docs are project-root relative (e.g. moodle-data/…/file.pdf#page=3). */
function mdHref(raw) {
  const href = raw.replace(/&amp;/g, '&');
  if (/^https?:\/\//i.test(href) || href.startsWith('#')) return href;
  const [p, frag] = href.replace(/^\.?\//, '').split('#');
  return pdfHref(decodeURI(p)) + (frag ? `#${frag}` : '');
}

function inlineMd(s) {
  return escapeHtml(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, href) => `<a href="${escapeHtml(mdHref(href.trim()))}" target="_blank" rel="noopener">${t}</a>`);
}

/** Small Markdown subset: headings, paragraphs, lists, tables, blockquotes, code fences, rules. */
function renderMarkdown(md) {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let i = 0;
  const isTableSep = (l) => /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(l);
  const cells = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    if (/^```/.test(l)) {
      const buf = [];
      for (i++; i < lines.length && !/^```/.test(lines[i]); i++) buf.push(lines[i]);
      i++;
      out.push(`<pre class="code"><code>${escapeHtml(buf.join('\n'))}</code></pre>`);
    } else if (/^#{1,6}\s/.test(l)) {
      const lvl = Math.min(4, l.match(/^#+/)[0].length + 1);
      out.push(`<h${lvl}>${inlineMd(l.replace(/^#+\s*/, ''))}</h${lvl}>`);
      i++;
    } else if (/^\s*([-*_])\1{2,}\s*$/.test(l)) {
      out.push('<hr>');
      i++;
    } else if (l.includes('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const head = cells(l);
      const rows = [];
      for (i += 2; i < lines.length && lines[i].includes('|') && lines[i].trim(); i++) rows.push(cells(lines[i]));
      out.push(`<div class="md-table"><table><thead><tr>${head.map(h => `<th>${inlineMd(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${inlineMd(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
    } else if (/^>\s?/.test(l)) {
      const buf = [];
      for (; i < lines.length && /^>\s?/.test(lines[i]); i++) buf.push(lines[i].replace(/^>\s?/, ''));
      out.push(`<blockquote>${inlineMd(buf.join(' '))}</blockquote>`);
    } else if (/^\s*([-*+]|\d+[.)])\s+/.test(l)) {
      const ordered = /^\s*\d/.test(l);
      const items = [];
      for (; i < lines.length && /^\s*([-*+]|\d+[.)])\s+/.test(lines[i]); i++) {
        const nested = /^\s{2,}/.test(lines[i]);
        items.push(`<li${nested ? ' class="nested"' : ''}>${inlineMd(lines[i].replace(/^\s*([-*+]|\d+[.)])\s+/, '').replace(/^\[( |x)\]\s*/i, (m) => (/x/i.test(m) ? '☑ ' : '☐ ')))}</li>`);
      }
      out.push(ordered ? `<ol>${items.join('')}</ol>` : `<ul>${items.join('')}</ul>`);
    } else {
      const buf = [];
      for (; i < lines.length && lines[i].trim() && !/^(#{1,6}\s|```|>|\s*([-*+]|\d+[.)])\s+)/.test(lines[i]) && !(lines[i].includes('|') && isTableSep(lines[i + 1] || '')); i++) buf.push(lines[i].trim());
      out.push(`<p>${inlineMd(buf.join(' '))}</p>`);
    }
  }
  return out.join('\n');
}

function loadAnalysis(cid) {
  analysisCache.set(cid, { status: 'loading' });
  fetch(`../../docs/klausur-analyse/${cid}.md`)
    .then(res => (res.ok ? res.text() : Promise.reject(new Error(String(res.status)))))
    .then(md => analysisCache.set(cid, { status: 'ok', html: renderMarkdown(md) }))
    .catch(() => analysisCache.set(cid, { status: 'error' }))
    .finally(() => { if (current && current.route.name === 'analysis' && current.route.cid === cid) rerender(); });
}

function pageAnalysis(r) {
  const c = courseMeta(r.cid);
  if (!analysisCache.has(c.id)) loadAnalysis(c.id);
  const a = analysisCache.get(c.id);
  const body = a.status === 'ok'
    ? `<article class="card prose md">${a.html}</article>`
    : a.status === 'error'
      ? `<div class="empty"><h2>Analyse nicht verfügbar</h2><p>docs/klausur-analyse/${c.id}.md konnte nicht geladen werden.</p></div>`
      : '<p class="loading">Lade Analyse …</p>';
  return {
    short: c.short,
    longTitle: true,
    eyebrow: courseTag(c.id),
    crumbs: `<a href="#/courses">Kurse</a> › <a href="#/courses/${c.id}">${c.short}</a> › Klausur-Analyse`,
    sub: 'Prüfungsformat, wahrscheinliche Themen und Strategie für eine 2.x – abgeleitet aus den Moodle-Unterlagen.',
    body,
  };
}

/* ---------- Mehr (phone hub) ---------- */

function pageMore() {
  const pins = store.state.pinnedCheatSheet.length;
  return {
    body: `
      ${group('Werkzeuge', `<ul class="list">
        <li><a class="row" href="#/email">${tile(icon('email'), 'var(--tint)')}<span class="row-main"><span class="row-title">E-Mail-Coach</span><span class="row-sub">GPAS-Prüfungsmail üben</span></span>${icon('chevR', 'chev')}</a></li>
        <li><a class="row" href="#/sheet">${tile(icon('sheet'), 'var(--orange)')}<span class="row-main"><span class="row-title">Spickzettel</span><span class="row-sub">DIN-A4 zum Drucken</span></span><span class="row-detail">${pins ? `<span class="badge badge-gray">${pins}</span>` : ''}</span>${icon('chevR', 'chev')}</a></li>
        <li><a class="row" href="#/methods">${tile(icon('methods'), 'var(--yellow)')}<span class="row-main"><span class="row-title">Methoden & Daten</span><span class="row-sub">Lernmethoden, Backup, Kürzel</span></span>${icon('chevR', 'chev')}</a></li>
      </ul>`)}
      ${group('Fokus', `<ul class="list">
        <li><button type="button" class="row" data-act="pomo-sheet">${tile(icon('timer'), 'var(--red)')}<span class="row-main"><span class="row-title">Pomodoro</span><span class="row-sub">${pomo.mode} Minuten Fokus</span></span><span class="row-detail"><span data-pomo-time>${pomo.display}</span></span>${icon('chevR', 'chev')}</button></li>
      </ul>`)}
      ${group('Darstellung', `<ul class="list">
        <li class="row">${tile(icon('moon'), 'var(--indigo)')}<span class="row-main"><span class="row-title">Dunkelmodus</span></span>${switchHtml('theme', store.state.theme === 'dark', 'Dunkelmodus')}</li>
        <li><button type="button" class="row" data-act="settings">${tile(icon('sliders'), 'var(--gray)')}<span class="row-main"><span class="row-title">Einstellungen</span></span>${icon('chevR', 'chev')}</button></li>
      </ul>`, 'Fortschritt wird lokal gespeichert und mit allen StudyOS-Varianten geteilt.')}`,
  };
}

/* ---------- E-Mail-Coach ---------- */

let emailIdx = 0;

function pageEmail() {
  const prompts = ENGLISH_DATA.emailPrompts;
  const p = prompts[emailIdx];
  const text = drafts[p.id] || '';
  const a = analyzeEmail(text, p);
  return {
    short: 'E-Mail',
    sub: 'GPAS · Greeting · Purpose · Action · Sign-off',
    wide: true,
    body: `
      <div class="seg-wrap">${seg('email-prompt', prompts.map((x, i) => ({ v: i, label: `Szenario ${i + 1}` })), emailIdx)}</div>
      <div class="email-grid">
        <div class="eg-a">
          ${group('Aufgabe', `<div class="card scenario" lang="en"><h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.scenario)}</p></div>`)}
          ${group('Struktur', `<figure class="card diagram"><div class="diagram-scroll">${DIAGRAMS['gpas-email'].svg}</div><figcaption lang="en">${escapeHtml(DIAGRAMS['gpas-email'].title)}</figcaption></figure>`)}
          ${group('Deine E-Mail', `
            <div class="email-status" data-email-status>${emailStatus(a)}</div>
            <div class="card editor">
              <textarea class="textarea email-text" id="email-text" data-input="email" data-p="${emailIdx}" lang="en" spellcheck="true" rows="14" placeholder="Dear Ms Miller,&#10;&#10;thank you for your email …" aria-label="E-Mail-Text">${escapeHtml(text)}</textarea>
              <div class="editor-foot"><span>Entwurf wird lokal gespeichert</span><button type="button" class="btn btn-plain btn-sm" data-act="email-clear">${icon('trash')} Leeren</button></div>
            </div>`)}
        </div>
        <div class="eg-b">
          ${group('Live-Feedback', `<div data-email-feedback>${emailFeedback(a)}</div>`)}
        </div>
      </div>`,
  };
}

function emailStatus(a) {
  const tone = a.words >= 120 && a.words <= 180 ? 'ok' : a.wordsOk ? 'warn' : 'bad';
  return `<span class="es-chip es-${tone}">${a.words} Wörter</span><span class="es-chip">${a.score}/6 Checks</span><span class="es-chip">${a.kwHits}/${a.keywords.length} Keywords</span>`;
}

function emailFeedback(a) {
  const max = 220;
  const pos = Math.min(a.words, max) / max * 100;
  const tone = a.words >= 120 && a.words <= 180 ? 'ok' : a.wordsOk ? 'warn' : 'bad';
  const label = a.words < 120 ? `Noch ${120 - a.words} bis zum Ziel` : a.words > 180 ? `${a.words - 180} über dem Ziel` : 'Im Zielbereich';
  return `
    <div class="card words">
      <div class="words-top"><strong class="words-n words-${tone}">${a.words}</strong><span>Wörter · Ziel 120–180<br><small>${label}</small></span></div>
      <div class="gauge"><span class="gauge-band" style="left:${120 / max * 100}%;width:${60 / max * 100}%"></span><span class="gauge-mark words-${tone}" style="left:${pos}%"></span></div>
    </div>
    <ul class="list checks">${a.checks.map(c => `<li class="row ${c.ok ? 'is-ok' : c.id === 'emoticons' ? 'is-bad' : ''}">
      <span class="check-ic">${icon(c.ok ? 'checkCircle' : c.id === 'emoticons' ? 'xCircle' : 'circle')}</span>
      <span class="row-main"><span class="row-title" lang="en">${escapeHtml(c.label)}</span></span></li>`).join('')}</ul>
    <div class="card kw"><p class="kw-h">Keywords <b>${a.kwHits}/${a.keywords.length}</b></p>
      <div class="chips">${a.keywords.map(k => `<span class="chip ${k.hit ? 'is-hit' : ''}" lang="en">${k.hit ? icon('check') : ''}${escapeHtml(k.word)}</span>`).join('')}</div></div>`;
}

/* ---------- Spickzettel ---------- */

function pageSheet() {
  const pins = store.state.pinnedCheatSheet;
  const total = ALL_CHAPTERS.length;
  const items = pins.map(p => `<article class="a4-item">
      <header><span class="tag" style="--c:${courseMeta(p.courseId).color}">${courseMeta(p.courseId).short}</span><h3>${escapeHtml(p.title)}</h3>
      <button type="button" class="unpin" data-act="unpin" data-id="${escapeHtml(p.id)}" aria-label="${escapeHtml(p.title)} entfernen" title="Entfernen">${icon('minus')}</button></header>
      <p>${escapeHtml(p.content)}</p>${p.code ? `<pre class="code"><code>${escapeHtml(p.code)}</code></pre>` : ''}</article>`).join('');
  return {
    sub: `${pins.length} von ${total} Themen angeheftet`,
    right: `<button type="button" class="tb-btn" data-act="print" aria-label="Drucken" title="Drucken (⌘P)">${icon('printer')}</button>`,
    wide: true,
    body: `
      <div class="sheet-tools">
        <div class="tool-group"><span class="tool-l">Kurs laden</span>
          <button type="button" class="btn btn-tinted" data-act="load-pins" data-c="gdp1">GP1</button>
          <button type="button" class="btn btn-tinted" data-act="load-pins" data-c="ics">ICS</button>
          <button type="button" class="btn btn-tinted" data-act="load-pins" data-c="all">Alle</button>
        </div>
        <div class="tool-group">
          <button type="button" class="btn btn-plain btn-red" data-act="clear-pins" ${pins.length ? '' : 'disabled'}>${icon('trash')} Leeren</button>
          <button type="button" class="btn btn-filled" data-act="print" ${pins.length ? '' : 'disabled'}>${icon('printer')} Drucken</button>
        </div>
      </div>
      ${pins.length ? `<div class="a4-wrap"><div class="a4"><header class="a4-head"><strong>StudyOS · Spickzettel WS 26/27</strong><span>DIN A4 · 2 Spalten</span></header><div class="a4-cols">${items}</div></div></div>`
        : `<div class="empty">${tile(icon('sheet'), 'var(--orange)', 'tile-xl')}<h2>Noch leer</h2><p>Öffne ein Kapitel und schalte „Auf Spickzettel“ ein – oder lade oben einen ganzen Kurs.</p><a class="btn btn-tinted btn-lg" href="#/courses">${icon('courses')} Zu den Kursen</a></div>`}`,
  };
}

function fillPrintSheet() {
  const pins = store.state.pinnedCheatSheet;
  $('#print-sheet').innerHTML = `<header><strong>StudyOS WS 26/27 · Spickzettel</strong><span>${pins.length} Themen · ${new Date().toLocaleDateString('de-DE')}</span></header>
    <div class="ps-cols">${pins.map(p => `<section class="ps-item"><h3><span>${courseMeta(p.courseId).short}</span> ${escapeHtml(p.title)}</h3><p>${escapeHtml(p.content)}</p>${p.code ? `<pre>${escapeHtml(p.code)}</pre>` : ''}</section>`).join('')}</div>`;
}

/* ---------- Methoden & Daten ---------- */

const METHODS = [
  { icon: 'bolt', color: 'var(--pink)', title: 'Active Recall', short: 'Abrufen statt Wiederlesen', to: 'cards', toLabel: 'Karteikarten',
    text: 'Wer Wissen aktiv aus dem Gedächtnis holt, behält es deutlich länger als beim erneuten Lesen (Testing-Effekt, Roediger & Karpicke 2006). Darum zeigt jede Karte zuerst nur die Frage: Antwort erst im Kopf formulieren, dann aufdecken und ehrlich bewerten.' },
  { icon: 'repeat', color: 'var(--tint)', title: 'Spaced Repetition', short: 'Wiederholen kurz vor dem Vergessen', to: 'cards', toLabel: 'Karteikarten',
    text: 'Verteiltes Lernen schlägt Pauken (Spacing-Effekt, Cepeda et al. 2006). Der SM-2-Algorithmus plant jede Karte anhand deiner Bewertung neu: „Nochmal“ = in 10 Minuten, „Einfach“ = Abstand wächst stark. Die Intervalle siehst du direkt auf den Bewertungsknöpfen.' },
  { icon: 'shuffle', color: 'var(--purple)', title: 'Interleaving', short: 'Themen mischen statt blocken', to: 'today', toLabel: 'Gemischte Session',
    text: 'Abwechselnd verschiedene Themen zu üben fühlt sich schwerer an, verbessert aber das Unterscheiden und Anwenden (Rohrer & Taylor 2007). „Alle“ im Karten- und Quiz-Filter verschränkt die Kurse so, dass nie zwei Karten desselben Themas aufeinander folgen.' },
  { icon: 'speech', color: 'var(--green)', title: 'Feynman-Technik', short: 'Erklären, als wäre es für Erstis', to: 'courses', toLabel: 'Kurse & Kapitel',
    text: 'Wer ein Konzept einfach erklären kann, hat es verstanden; Lücken beim Erklären zeigen genau, was fehlt (Selbsterklärung / Elaboration, Chi et al. 1994). In jedem Kapitel schreibst du deine Erklärung und prüfst sie mit der Checkliste.' },
  { icon: 'image', color: 'var(--orange)', title: 'Dual Coding', short: 'Wort und Bild kombinieren', to: 'courses', toLabel: 'Kapitel-Diagramme',
    text: 'Informationen, die verbal und bildlich gespeichert werden, sind leichter abrufbar (Paivio 1971). Die Kapitel kombinieren Zusammenfassung und Diagramm – zeichne die Diagramme zusätzlich einmal aus dem Kopf nach.' },
];

const SHORTCUTS = [
  [['⌘1', '…', '⌘7'], 'Heute · Karten · Quiz · Kurse · E-Mail · Spickzettel · Methoden (auch Ctrl)'],
  [['⌘[', '⌘]'], 'Zurück / Vorwärts'],
  [['Leertaste'], 'Karte aufdecken'],
  [['1', '2', '3', '4'], 'Karte bewerten: Nochmal · Schwer · Gut · Einfach'],
  [['1–4', 'A–D'], 'Quiz-Antwort wählen'],
  [['↵'], 'Quiz: prüfen / nächste Frage'],
  [['P'], 'Pomodoro starten / pausieren'],
  [['I'], 'Inspektor ein-/ausblenden'],
  [['Esc'], 'Sheet oder Dialog schließen'],
  [['⌘P'], 'Spickzettel drucken'],
];

function pageMethods() {
  const methodRows = METHODS.map(m => `<li><details class="method">
      <summary class="row">${tile(icon(m.icon), m.color)}<span class="row-main"><span class="row-title">${m.title}</span><span class="row-sub">${m.short}</span></span>${icon('chevR', 'chev disclose')}</summary>
      <div class="method-body"><p>${m.text}</p><a class="btn btn-tinted btn-sm" href="#/${m.to}">${m.toLabel} öffnen ${icon('chevR')}</a></div>
    </details></li>`).join('');
  const keys = SHORTCUTS.map(([ks, d]) => `<li class="row key-row"><span class="keys">${ks.map(k => k === '…' ? '<span class="dots">…</span>' : kbd(k)).join('')}</span><span class="row-main"><span class="row-title">${d}</span></span></li>`).join('');
  return {
    short: 'Methoden',
    body: `
      ${group('Lernmethoden', `<ul class="list">${methodRows}</ul>`, 'Alle fünf Methoden sind in StudyOS eingebaut – tippe eine an für die Erklärung.')}
      ${group('Daten', `<ul class="list">
        <li><button type="button" class="row" data-act="backup">${tile(icon('download'), 'var(--tint)')}<span class="row-main"><span class="row-title">Backup exportieren</span><span class="row-sub">Fortschritt als JSON-Datei sichern</span></span></button></li>
        <li><button type="button" class="row" data-act="import">${tile(icon('upload'), 'var(--green)')}<span class="row-main"><span class="row-title">Backup importieren</span><span class="row-sub">JSON-Datei wiederherstellen</span></span></button></li>
        <li><button type="button" class="row row-danger" data-act="reset">${tile(icon('reset'), 'var(--red)')}<span class="row-main"><span class="row-title">Fortschritt zurücksetzen</span><span class="row-sub">Karten, Quiz, Notizen, Spickzettel</span></span></button></li>
      </ul>`, 'Alles liegt nur lokal in diesem Browser und wird mit allen StudyOS-Varianten geteilt.')}
      ${group('Darstellung', `<ul class="list"><li class="row">${tile(icon('moon'), 'var(--indigo)')}<span class="row-main"><span class="row-title">Dunkelmodus</span></span>${switchHtml('theme', store.state.theme === 'dark', 'Dunkelmodus')}</li></ul>`)}
      ${group('Tastaturkürzel', `<ul class="list keys-list">${keys}</ul>`, 'Für MacBook und iPad mit Tastatur. Ziffern und Leertaste wirken nicht, während du tippst.')}`,
  };
}

/* ================================================================== chrome: sidebar, tab bar, inspector */

const NAV = [
  { id: 'today', label: 'Heute', icon: 'today', key: 1 },
  { id: 'cards', label: 'Karten', icon: 'cards', key: 2 },
  { id: 'quiz', label: 'Quiz', icon: 'quiz', key: 3 },
  { id: 'courses', label: 'Kurse', icon: 'courses', key: 4 },
  { id: 'email', label: 'E-Mail', icon: 'email', key: 5 },
  { id: 'sheet', label: 'Spickzettel', icon: 'sheet', key: 6 },
  { id: 'methods', label: 'Methoden', icon: 'methods', key: 7 },
];

function refreshChrome() {
  if (!current) return;
  const r = current.route;
  const due = dueToday('all');
  const pins = store.state.pinnedCheatSheet.length;
  const activeSec = TAB_OF[r.name] === 'courses' ? (r.cid || 'courses') : r.name;
  const navItem = (n, badge = '') => `<a class="sb-item ${activeSec === n.id ? 'is-active' : ''}" href="#/${n.id}" ${activeSec === n.id ? 'aria-current="page"' : ''}>
      ${icon(n.icon)}<span class="sb-l">${n.label}</span>${badge}<span class="sb-k">⌘${n.key}</span></a>`;

  $('#sidebar').innerHTML = `
    <div class="sb-head">${rings([{ pct: todayProgress().pct, color: 'var(--ring1)' }, { pct: overallMastery(), color: 'var(--ring3)' }], 28, 4, 1.5)}
      <div><strong>StudyOS</strong><span>WS 26/27</span></div></div>
    <nav class="sb-nav">
      <p class="sb-h">Lernen</p>
      ${navItem(NAV[0])}${navItem(NAV[1], due ? `<span class="sb-badge">${due}</span>` : '')}${navItem(NAV[2])}
      <p class="sb-h">Kurse</p>
      ${navItem(NAV[3])}
      ${COURSES_META.map(c => `<a class="sb-item sb-sub ${activeSec === c.id ? 'is-active' : ''}" href="#/courses/${c.id}">
        <span class="sb-dot" style="--c:${c.color}">${c.icon}</span><span class="sb-l">${c.short}</span><span class="sb-meta">${getCourseMastery(c.id)}%</span></a>`).join('')}
      <p class="sb-h">Werkzeuge</p>
      ${navItem(NAV[4])}${navItem(NAV[5], pins ? `<span class="sb-badge sb-badge-gray">${pins}</span>` : '')}${navItem(NAV[6])}
    </nav>
    <div class="sb-foot">
      <span class="sb-streak">${icon('flame')} ${streakLabel()}</span>
      <button type="button" class="tb-btn" data-act="theme" aria-label="Hell/Dunkel umschalten" title="Hell/Dunkel">${icon('moon')}</button>
    </div>`;

  const tab = info(r).tab;
  const tabs = [
    { id: 'today', label: 'Heute', icon: 'today' },
    { id: 'cards', label: 'Karten', icon: 'cards', badge: due },
    { id: 'quiz', label: 'Quiz', icon: 'quiz' },
    { id: 'courses', label: 'Kurse', icon: 'courses' },
    { id: 'more', label: 'Mehr', icon: 'more' },
  ];
  $('#tabbar').innerHTML = tabs.map(t => `<button type="button" class="tab ${tab === t.id ? 'is-active' : ''}" data-act="tab" data-tab="${t.id}" ${tab === t.id ? 'aria-current="page"' : ''}>
      <span class="tab-ic">${icon(t.icon)}${t.badge ? `<span class="tab-badge">${t.badge > 99 ? '99+' : t.badge}</span>` : ''}</span><span class="tab-l">${t.label}</span></button>`).join('');

  renderInspector();
  html.classList.toggle('insp-open', !!ui.inspector);
}

function renderInspector() {
  const tp = todayProgress();
  const mastery = overallMastery();
  const focusPct = Math.min(100, Math.round((tp.minutes / 25) * 100));
  $('#inspector').innerHTML = `
    <section class="insp-sec">
      <h3 class="insp-h">Heute</h3>
      <div class="insp-rings">${rings([{ pct: tp.pct, color: 'var(--ring1)' }, { pct: focusPct, color: 'var(--ring2)' }, { pct: mastery, color: 'var(--ring3)' }], 96, 11, 2)}
        <dl>
          <div style="--c:var(--ring1)"><dt>Ziel</dt><dd>${tp.done}/${tp.goal}</dd></div>
          <div style="--c:var(--ring2)"><dt>Fokus</dt><dd>${tp.minutes}/25 Min</dd></div>
          <div style="--c:var(--ring3)"><dt>Meisterung</dt><dd>${mastery}%</dd></div>
        </dl></div>
      <ul class="insp-stats">
        <li><span>Fällige Karten</span><b>${dueToday('all')}</b></li>
        <li><span>Karten heute</span><b>${tp.reviews}</b></li>
        <li><span>Quizfragen heute</span><b>${tp.quizzes}</b></li>
        <li><span>Lernserie</span><b>${streakLabel()}</b></li>
      </ul>
    </section>
    <section class="insp-sec">
      <h3 class="insp-h">Pomodoro</h3>
      ${pomoHtml(132)}
    </section>
    <section class="insp-sec">
      <h3 class="insp-h">Fristen</h3>
      <ul class="insp-dl">${allDeadlines().slice(0, 5).map(d => `<li><span class="dot" style="background:${d.color}"></span>
        <span class="insp-dl-m"><span>${escapeHtml(d.label)}</span><small>${formatDate(d.date)}</small></span>
        <span class="pill ${d.urgent || d.daysLeft <= 3 ? 'pill-red' : ''}">${daysLeftLabel(d.daysLeft)}</span></li>`).join('') || '<li>Keine anstehenden Fristen.</li>'}</ul>
    </section>`;
}

/* ================================================================== Pomodoro */

const pomo = new Pomodoro({
  onChange: () => updatePomo(),
  onFinish: (m) => {
    toast(`${m} Minuten Fokus geschafft – kurze Pause!`);
    navigator.vibrate?.([80, 60, 80]);
    refreshChrome();
    if (current && current.route.name === 'today') rerender();
  },
});

function pomoHtml(size) {
  return `<div class="pomo">
    <div class="pomo-dial">${rings([{ pct: pomo.progress * 100, color: 'var(--orange)', attr: 'data-pomo-ring' }], size, Math.round(size * 0.075))}
      <div class="pomo-center"><span class="pomo-time" data-pomo-time>${pomo.display}</span><span class="pomo-state" data-pomo-state>${pomoState()}</span></div></div>
    ${seg('pomo-mode', [{ v: 25, label: '25 Min' }, { v: 50, label: '50 Min' }], pomo.mode, 'seg-pomo')}
    <div class="pomo-btns">
      <button type="button" class="btn btn-round btn-gray" data-act="pomo-reset">Zurück&shy;setzen</button>
      <button type="button" class="btn btn-round ${pomo.running ? 'btn-pause' : 'btn-start'}" data-act="pomo-toggle" data-pomo-toggle>${pomo.running ? 'Pause' : 'Start'}</button>
    </div></div>`;
}
const pomoState = () => (pomo.running ? 'Fokus läuft' : pomo.seconds === pomo.mode * 60 ? 'Bereit' : 'Pausiert');

function updatePomo() {
  html.classList.toggle('pomo-running', pomo.running);
  $$('[data-pomo-time]').forEach(el => { el.textContent = pomo.display; });
  $$('[data-pomo-state]').forEach(el => { el.textContent = pomoState(); });
  $$('[data-pomo-ring]').forEach(el => { el.setAttribute('stroke-dashoffset', (el.dataset.circ * (1 - pomo.progress)).toFixed(2)); });
  $$('[data-pomo-toggle]').forEach(el => {
    el.textContent = pomo.running ? 'Pause' : 'Start';
    el.classList.toggle('btn-pause', pomo.running);
    el.classList.toggle('btn-start', !pomo.running);
  });
  $$('.seg-pomo .seg-b').forEach(b => b.setAttribute('aria-checked', String(Number(b.dataset.v) === pomo.mode)));
}

/* ================================================================== sheets, alerts, toasts */

const layer = $('#sheet-layer');
let sheetReturnFocus = null;
let sheetCloseTimer = 0;

function openSheet(kind) {
  const def = kind === 'pomo'
    ? { title: 'Pomodoro', body: `<div class="sheet-pomo">${pomoHtml(220)}<p class="sheet-note">Fokus-Minuten zählen in deinen Tagesring. Die Zeit läuft weiter, wenn du das Sheet schließt.</p></div>` }
    : { title: 'Einstellungen', body: settingsHtml() };
  clearTimeout(sheetCloseTimer);
  const wasOpen = layer.classList.contains('is-open');
  if (!wasOpen) sheetReturnFocus = document.activeElement;
  layer.classList.remove('is-closing');
  layer.innerHTML = `<div class="sheet-backdrop" data-act="sheet-close"></div>
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" tabindex="-1">
      <div class="sheet-head"><span class="grabber" aria-hidden="true"></span>
        <h2 id="sheet-title">${def.title}</h2>
        <button type="button" class="sheet-done" data-act="sheet-close">Fertig</button></div>
      <div class="sheet-body">${def.body}</div></div>`;
  if (!wasOpen) void layer.offsetHeight; // start the slide-in from the off-screen position
  layer.classList.add('is-open');
  layer.dataset.kind = kind;
  requestAnimationFrame(() => $('.sheet', layer).focus({ preventScroll: true }));
}

function closeSheet() {
  if (!layer.classList.contains('is-open')) return;
  layer.classList.remove('is-open');
  layer.classList.add('is-closing');
  const sheet = $('.sheet', layer);
  if (sheet) sheet.style.transform = '';
  sheetCloseTimer = setTimeout(() => { layer.classList.remove('is-closing'); layer.innerHTML = ''; }, mqReduce.matches ? 0 : 320);
  if (sheetReturnFocus && document.contains(sheetReturnFocus)) sheetReturnFocus.focus({ preventScroll: true });
}

function settingsHtml() {
  return `
    ${group('Darstellung', `<ul class="list"><li class="row">${tile(icon('moon'), 'var(--indigo)')}<span class="row-main"><span class="row-title">Dunkelmodus</span></span>${switchHtml('theme', store.state.theme === 'dark', 'Dunkelmodus')}</li></ul>`,
      'Beim ersten Start folgt StudyOS dem System, danach gilt deine Wahl.')}
    ${group('Lernziel', `<ul class="list"><li class="row">${tile(icon('target'), 'var(--red)')}<span class="row-main"><span class="row-title">Tagesziel</span><span class="row-sub">Karten + Quizfragen pro Tag</span></span>
      <span class="stepper"><button type="button" data-act="goal" data-v="-5" aria-label="Weniger">${icon('minus')}</button><b data-goal>${store.state.dailyGoal}</b><button type="button" data-act="goal" data-v="5" aria-label="Mehr">${icon('plus')}</button></span></li>
      <li class="row">${tile(icon('cards'), 'var(--tint)')}<span class="row-main"><span class="row-title">Neue Karten pro Tag</span><span class="row-sub">Wiederholungen kommen immer zuerst; neue Karten nach Klausur-Priorität</span></span>
      <span class="stepper"><button type="button" data-act="new-limit" data-v="-5" aria-label="Weniger">${icon('minus')}</button><b data-new-limit>${ui.newPerDay}</b><button type="button" data-act="new-limit" data-v="5" aria-label="Mehr">${icon('plus')}</button></span></li></ul>`)}
    ${group('', `<ul class="list">
      <li><button type="button" class="row" data-act="pomo-sheet">${tile(icon('timer'), 'var(--orange)')}<span class="row-main"><span class="row-title">Pomodoro</span></span><span class="row-detail" data-pomo-time>${pomo.display}</span>${icon('chevR', 'chev')}</button></li>
      <li><a class="row" href="#/methods">${tile(icon('methods'), 'var(--yellow)')}<span class="row-main"><span class="row-title">Methoden, Backup & Kürzel</span></span>${icon('chevR', 'chev')}</a></li>
    </ul>`)}`;
}

/* Drag the sheet down by its grabber/header to dismiss. */
layer.addEventListener('pointerdown', (e) => {
  const head = e.target.closest('.sheet-head');
  if (!head || isDesk() || e.target.closest('button')) return;
  const sheet = head.closest('.sheet');
  const y0 = e.clientY, t0 = performance.now();
  let dy = 0;
  head.setPointerCapture(e.pointerId);
  sheet.style.transition = 'none';
  const move = (ev) => {
    dy = Math.max(0, ev.clientY - y0);
    sheet.style.transform = `translateY(${dy}px)`;
  };
  const up = () => {
    head.removeEventListener('pointermove', move);
    head.removeEventListener('pointerup', up);
    head.removeEventListener('pointercancel', up);
    sheet.style.transition = '';
    const v = dy / Math.max(1, performance.now() - t0);
    if (dy > 110 || (dy > 30 && v > 0.6)) closeSheet();
    else sheet.style.transform = '';
  };
  head.addEventListener('pointermove', move);
  head.addEventListener('pointerup', up);
  head.addEventListener('pointercancel', up);
});

const alertLayer = $('#alert-layer');
function confirmDialog({ title, message, ok = 'OK', destructive = false }) {
  return new Promise(resolve => {
    const prevFocus = document.activeElement;
    alertLayer.innerHTML = `<div class="alert" role="alertdialog" aria-modal="true" aria-labelledby="al-t" aria-describedby="al-m">
      <div class="alert-txt"><h2 id="al-t">${title}</h2><p id="al-m">${message}</p></div>
      <div class="alert-btns"><button type="button" data-r="0">Abbrechen</button><button type="button" data-r="1" class="${destructive ? 'is-destructive' : 'is-default'}">${ok}</button></div></div>`;
    alertLayer.classList.add('is-open');
    const done = (val) => {
      alertLayer.classList.remove('is-open');
      alertLayer.innerHTML = '';
      alertLayer.onclick = null;
      alertLayer.onkeydown = null;
      prevFocus?.focus?.({ preventScroll: true });
      resolve(val);
    };
    alertLayer.onclick = (e) => {
      const b = e.target.closest('button[data-r]');
      if (b) done(b.dataset.r === '1');
    };
    alertLayer.onkeydown = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(false); }
    };
    $('button[data-r="0"]', alertLayer).focus();
  });
}

function toast(msg, kind = '') {
  const t = document.createElement('div');
  t.className = `toast ${kind}`;
  t.textContent = msg;
  $('#toasts').appendChild(t);
  setTimeout(() => {
    t.classList.add('is-out');
    setTimeout(() => t.remove(), 300);
  }, 2600);
}

/* ================================================================== theme */

function applyTheme() {
  const dark = store.state.theme === 'dark';
  html.dataset.theme = dark ? 'dark' : 'light';
  $$('meta[name="theme-color"]').forEach(m => m.setAttribute('content', dark ? '#000000' : '#f2f2f7'));
  $$('input[data-change="theme"]').forEach(i => { i.checked = dark; });
}

/* ================================================================== actions */

const ACTIONS = {
  'hist-back': () => history.back(),
  'hist-fwd': () => history.forward(),
  tab: (el) => {
    const t = el.dataset.tab;
    const tab = info(current.route).tab;
    const root = t === 'more' ? 'more' : t;
    go(tab === t ? root : (tabLast[t] || root));
  },
  settings: () => openSheet('settings'),
  'pomo-sheet': () => openSheet('pomo'),
  'sheet-close': () => closeSheet(),
  inspector: () => toggleInspector(),
  theme: () => { store.toggleTheme(); applyTheme(); },

  'start-session': (el) => { startCards('all', el.dataset.all === '1'); go('cards'); },
  'cards-filter': (el) => { startCards(el.dataset.v); rerender(); },
  reveal: () => revealCard(),
  rate: (el) => rate(Number(el.dataset.v)),
  'cards-all': () => { startCards(cardsS.filter, true, cardsS.chapter); rerender({ top: true }); },
  'goto-quiz': () => { startQuiz(cardsS.filter, cardsS.chapter); go('quiz'); },

  'quiz-filter': (el) => { startQuiz(el.dataset.v); rerender(); },
  'quiz-opt': (el) => selectOption(Number(el.dataset.i)),
  'quiz-conf': (el) => { quizS.confidence = el.dataset.v; $$('.seg-conf .seg-b').forEach(b => b.setAttribute('aria-checked', String(b === el))); },
  'quiz-submit': () => submitAnswer(),
  'quiz-next': () => nextQuestion(),
  'quiz-restart': () => { startQuiz(quizS.filter, quizS.chapter); rerender({ top: true }); },

  'course-cards': (el) => { startCards(el.dataset.c); go('cards'); },
  'course-quiz': (el) => { startQuiz(el.dataset.c); go('quiz'); },
  'chapter-cards': (el) => { startCards(el.dataset.c, true, el.dataset.ch); go('cards'); },
  'chapter-quiz': (el) => { startQuiz(el.dataset.c, el.dataset.ch); go('quiz'); },

  'email-prompt': (el) => { emailIdx = Number(el.dataset.v); rerender(); },
  'email-clear': async () => {
    const p = ENGLISH_DATA.emailPrompts[emailIdx];
    if (!(drafts[p.id] || '').trim()) return;
    if (await confirmDialog({ title: 'Entwurf leeren?', message: 'Der Text dieses Szenarios wird gelöscht.', ok: 'Leeren', destructive: true })) {
      delete drafts[p.id];
      saveJSON(DRAFT_KEY, drafts);
      rerender();
    }
  },

  unpin: (el) => {
    const item = store.state.pinnedCheatSheet.find(p => p.id === el.dataset.id);
    store.togglePin({ id: el.dataset.id });
    toast(`„${item ? item.title : 'Eintrag'}“ entfernt`);
    rerender();
  },
  'load-pins': (el) => {
    const ids = el.dataset.c === 'all' ? COURSE_IDS : [el.dataset.c];
    const before = store.state.pinnedCheatSheet.length;
    loadCoursePins(ids);
    const added = store.state.pinnedCheatSheet.length - before;
    toast(added ? `${plural(added, 'Thema', 'Themen')} hinzugefügt` : 'Schon alles angeheftet');
    rerender();
  },
  'clear-pins': async () => {
    if (await confirmDialog({ title: 'Spickzettel leeren?', message: 'Alle angehefteten Themen werden entfernt.', ok: 'Leeren', destructive: true })) {
      clearPins();
      toast('Spickzettel geleert');
      rerender();
    }
  },
  print: () => printSheet(),

  backup: () => { downloadBackup(); toast('Backup wird heruntergeladen'); },
  import: () => $('#import-file').click(),
  reset: async () => {
    if (await confirmDialog({ title: 'Fortschritt zurücksetzen?', message: 'Alle Kartenstände, Quiz-Ergebnisse, Feynman-Notizen und Spickzettel werden gelöscht. Das lässt sich nicht rückgängig machen.', ok: 'Zurücksetzen', destructive: true })) {
      resetProgress();
      resetSessions();
      rerender();
      toast('Fortschritt zurückgesetzt');
    }
  },

  'new-limit': (el) => {
    ui.newPerDay = Math.max(0, Math.min(100, ui.newPerDay + Number(el.dataset.v)));
    saveJSON(UI_KEY, ui);
    $$('[data-new-limit]').forEach(g => { g.textContent = ui.newPerDay; });
    resetSessions();
    rerender();
  },
  goal: (el) => {
    store.state.dailyGoal = Math.max(5, Math.min(200, store.state.dailyGoal + Number(el.dataset.v)));
    store.save();
    $$('[data-goal]').forEach(g => { g.textContent = store.state.dailyGoal; });
    if (current.route.name === 'today') rerender(); else refreshChrome();
  },
  'pomo-toggle': () => pomo.toggle(),
  'pomo-reset': () => pomo.reset(),
  'pomo-mode': (el) => { if (Number(el.dataset.v) !== pomo.mode) pomo.switchMode(); },
};

/** Wide screens: persistent third column. 900–1199px: floating overlay panel (not persisted). */
function toggleInspector() {
  if (mqWide.matches) {
    ui.inspector = !ui.inspector;
    saveJSON(UI_KEY, ui);
    html.classList.toggle('insp-open', ui.inspector);
  } else {
    html.classList.toggle('insp-overlay');
  }
}

function revealCard() {
  if (!cardsS.queue || !cardsS.queue[cardsS.idx] || cardsS.revealed) return;
  cardsS.revealed = true;
  rerender();
  const dock = $('.dock', current.el);
  if (!isDesk() && dock) {
    const back = $('.fc-back', current.el);
    back?.scrollIntoView({ block: 'nearest', behavior: mqReduce.matches ? 'auto' : 'smooth' });
  }
  if (isDesk()) $('.rate-3', current.el)?.focus({ preventScroll: true });
}

function rate(v) {
  const card = cardsS.queue && cardsS.queue[cardsS.idx];
  if (!card || !cardsS.revealed) return;
  if (isNewCard(card)) markIntroduced(card.id);
  if (rateCard(card, v)) {
    cardsS.queue.push(card);
    toast('Kommt in dieser Session nochmal');
  }
  cardsS.idx += 1;
  cardsS.reviewed += 1;
  cardsS.revealed = false;
  navigator.vibrate?.(8);
  rerender({ top: true });
}

function selectOption(i) {
  if (quizS.result || !quizS.queue[quizS.idx]) return;
  quizS.selected = i;
  $$('.opt', current.el).forEach(b => {
    const on = Number(b.dataset.i) === i;
    b.classList.toggle('is-selected', on);
    b.setAttribute('aria-pressed', String(on));
  });
  const btn = $('[data-act="quiz-submit"]', current.el);
  if (btn) btn.disabled = false;
}

function submitAnswer() {
  const q = quizS.queue[quizS.idx];
  if (!q || quizS.result || quizS.selected == null) return;
  quizS.result = submitQuiz(q, quizS.selected, quizS.confidence);
  quizS.answered += 1;
  if (quizS.result.correct) quizS.correct += 1;
  navigator.vibrate?.(quizS.result.correct ? 8 : [20, 40, 20]);
  rerender();
  $('.feedback', current.el)?.scrollIntoView({ block: 'nearest', behavior: mqReduce.matches ? 'auto' : 'smooth' });
  $('[data-act="quiz-next"]', current.el)?.focus({ preventScroll: true });
}

function nextQuestion() {
  if (!quizS.result) return;
  Object.assign(quizS, { idx: quizS.idx + 1, selected: null, result: null, confidence: 'medium' });
  rerender({ top: true });
}

function printSheet() {
  if (!store.state.pinnedCheatSheet.length) { toast('Noch nichts angeheftet'); return; }
  fillPrintSheet();
  window.print();
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (el && !el.disabled) {
    const fn = ACTIONS[el.dataset.act];
    if (fn) {
      if (el.tagName === 'A') e.preventDefault();
      fn(el, e);
      return;
    }
  }
  // following a link from inside a sheet closes the sheet
  if (e.target.closest('.sheet a[href^="#/"]')) closeSheet();
});

document.addEventListener('change', (e) => {
  const el = e.target;
  switch (el.dataset.change) {
    case 'theme':
      if ((store.state.theme === 'dark') !== el.checked) store.toggleTheme();
      applyTheme();
      break;
    case 'pin': {
      const ch = CH_BY_ID.get(el.dataset.ch);
      const on = togglePinChapter(ch);
      el.checked = on;
      toast(on ? 'Zum Spickzettel hinzugefügt' : 'Vom Spickzettel entfernt');
      refreshChrome();
      break;
    }
    case 'rubric': {
      toggleFeynmanPoint(el.dataset.ch, Number(el.dataset.i), el.checked);
      const ch = CH_BY_ID.get(el.dataset.ch);
      $$('[data-rubric-count]', current.el).forEach(c => { c.textContent = `${getFeynman(ch.id).checkedPoints.length}/${ch.feynman.rubric.length}`; });
      break;
    }
    default:
  }
});

document.addEventListener('input', (e) => {
  const el = e.target;
  if (el.dataset.input === 'feynman') {
    saveFeynmanText(el.dataset.ch, el.value);
    const st = $('[data-fey-status]', current.el);
    if (st) st.textContent = `Gespeichert · ${el.value.trim() ? el.value.trim().split(/\s+/).length : 0} Wörter`;
  } else if (el.dataset.input === 'email') {
    const p = ENGLISH_DATA.emailPrompts[Number(el.dataset.p)];
    drafts[p.id] = el.value;
    saveJSON(DRAFT_KEY, drafts);
    // update feedback only – never touch the textarea (keeps focus, caret and the iOS keyboard)
    const a = analyzeEmail(el.value, p);
    const fb = $('[data-email-feedback]', current.el);
    const st = $('[data-email-status]', current.el);
    if (fb) fb.innerHTML = emailFeedback(a);
    if (st) st.innerHTML = emailStatus(a);
  }
});

$('#import-file').addEventListener('change', async (e) => {
  const file = e.target.files && e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    await importBackup(file);
    resetSessions();
    applyTheme();
    rerender();
    toast('Backup importiert');
  } catch {
    toast('Import fehlgeschlagen – keine gültige Backup-Datei', 'is-error');
  }
});

window.addEventListener('beforeprint', fillPrintSheet);

/* ================================================================== keyboard */

const isTyping = (t) => t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) && !(t.type === 'checkbox' || t.type === 'radio');

document.addEventListener('keydown', (e) => {
  if (alertLayer.classList.contains('is-open')) return;
  const mod = e.metaKey || e.ctrlKey;

  if (e.key === 'Escape' && layer.classList.contains('is-open')) { e.preventDefault(); closeSheet(); return; }

  if (mod && !e.altKey && !e.shiftKey && /^[1-7]$/.test(e.key)) {
    e.preventDefault();
    closeSheet();
    go(SECTIONS[Number(e.key) - 1]);
    return;
  }
  if (mod && (e.key === '[' || e.key === ']')) { e.preventDefault(); e.key === '[' ? history.back() : history.forward(); return; }
  if (mod || e.altKey || isTyping(e.target) || layer.classList.contains('is-open')) return;

  const name = current && current.route.name;
  const k = e.key;
  if (name === 'cards') {
    const onControl = e.target.closest?.('button, a, summary');
    if ((k === ' ' || (k === 'Enter' && !onControl)) && !cardsS.revealed) { e.preventDefault(); revealCard(); return; }
    if (k === ' ' && cardsS.revealed) { e.preventDefault(); return; }
    if (/^[1-4]$/.test(k) && cardsS.revealed) { e.preventDefault(); rate(Number(k)); return; }
  }
  if (name === 'quiz' && quizS.queue && quizS.queue[quizS.idx]) {
    const n = /^[1-6]$/.test(k) ? Number(k) - 1 : /^[a-f]$/i.test(k) ? k.toLowerCase().charCodeAt(0) - 97 : -1;
    if (n >= 0 && !quizS.result && n < quizS.queue[quizS.idx].options.length) { e.preventDefault(); selectOption(n); return; }
    if (k === 'Enter' && !e.target.closest?.('button, a')) { e.preventDefault(); quizS.result ? nextQuestion() : submitAnswer(); return; }
  }
  if (k === 'p' || k === 'P') { pomo.toggle(); return; }
  if ((k === 'i' || k === 'I') && isDesk()) { toggleInspector(); }
});

/* ================================================================== edge swipe back (phone) */

let swipe = null;
stack.addEventListener('touchstart', (e) => {
  if (isDesk() || !current || e.touches.length > 1) return;
  if ($$('.page', stack).length > 1) return; // transition still running
  const meta = info(current.route);
  const t = e.touches[0];
  if (!meta.parent || t.clientX > 24) return;
  swipe = { x0: t.clientX, y0: t.clientY, dx: 0, v: 0, lx: t.clientX, lt: performance.now(), active: false, parent: meta.parent };
}, { passive: true });

stack.addEventListener('touchmove', (e) => {
  if (!swipe) return;
  const t = e.touches[0];
  const dx = t.clientX - swipe.x0, dy = t.clientY - swipe.y0;
  if (!swipe.active) {
    if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { swipe = null; return; }
    if (dx < 8) return;
    swipe.active = true;
    swipe.route = parsePath(swipe.parent);
    swipe.under = buildPage(swipe.route);
    stack.insertBefore(swipe.under, current.el);
    swipe.under.scrollTop = scrollMemo.get(swipe.route.path) || 0;
    syncScrolled(swipe.under);
    current.el.classList.add('is-swiping');
  }
  e.preventDefault();
  const w = stack.clientWidth;
  const x = Math.max(0, Math.min(w, dx));
  const now = performance.now();
  swipe.v = (t.clientX - swipe.lx) / Math.max(1, now - swipe.lt);
  swipe.lx = t.clientX;
  swipe.lt = now;
  swipe.dx = x;
  current.el.style.transform = `translateX(${x}px)`;
  swipe.under.style.transform = `translateX(${-w * 0.3 * (1 - x / w)}px)`;
  swipe.under.style.filter = `brightness(${0.9 + 0.1 * (x / w)})`;
}, { passive: false });

function endSwipe(cancelled) {
  const s = swipe;
  swipe = null;
  if (!s || !s.active) return;
  const w = stack.clientWidth;
  const commit = !cancelled && (s.dx > w * 0.4 || (s.v > 0.35 && s.dx > 20));
  const top = current.el;
  const dur = mqReduce.matches ? 0 : 260;
  const tr = `transform ${dur}ms cubic-bezier(.2,.8,.2,1), filter ${dur}ms`;
  top.style.transition = tr;
  s.under.style.transition = tr;
  top.style.transform = `translateX(${commit ? w : 0}px)`;
  s.under.style.transform = commit ? 'translateX(0)' : `translateX(${-w * 0.3}px)`;
  s.under.style.filter = commit ? 'brightness(1)' : 'brightness(.9)';
  setTimeout(() => {
    if (commit) {
      scrollMemo.set(current.route.path, top.scrollTop);
      top.remove();
      s.under.style.cssText = '';
      current = { route: s.route, el: s.under };
      tabLast[info(s.route).tab] = s.route.path;
      location.hash = '#/' + s.route.path; // onHash sees the same path and keeps this page
      afterShow();
    } else {
      s.under.remove();
      top.style.cssText = '';
      top.classList.remove('is-swiping');
    }
  }, dur + 20);
}
stack.addEventListener('touchend', () => endSwipe(false));
stack.addEventListener('touchcancel', () => endSwipe(true));

/* ================================================================== boot */

// First launch: follow the system appearance (the shared store defaults to dark otherwise).
if (!localStorage.getItem('ws26_lernplattform_v1')) {
  store.state.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  store.save();
}
applyTheme();
html.classList.toggle('is-touch', matchMedia('(hover: none) and (pointer: coarse)').matches);

const syncLayout = () => {
  html.classList.toggle('is-desk', isDesk());
  if (mqWide.matches || !isDesk()) html.classList.remove('insp-overlay');
  if (current) refreshChrome();
};
mqDesk.addEventListener('change', syncLayout);
mqWide.addEventListener('change', syncLayout);
syncLayout();

window.addEventListener('hashchange', onHash);
if (!location.hash.startsWith('#/')) history.replaceState(null, '', '#/today');
onHash();
updatePomo();

if ('serviceWorker' in navigator) navigator.serviceWorker.register('../sw.js', { scope: '../' }).catch(() => {});
