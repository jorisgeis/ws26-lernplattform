// StudyOS WS26 — Variante 03 "Terminal": tastaturgesteuerte TUI-Oberfläche.
// Reine UI-Schicht; Logik & Daten kommen aus ../shared/core.js.

import {
  COURSES_META, ENGLISH_DATA, DIAGRAMS, store,
  ALL_CHAPTERS, ALL_QUIZZES, courseMeta, escapeHtml, pdfHref,
  getDueCards, buildFlashcardQueue, rateCard, intervalsFor, RATING_LABELS, cardStats,
  buildQuizQueue, CONFIDENCE_LEVELS, submitQuiz, calibrationStats,
  getCourseMastery, overallMastery, todayProgress, activityHistory, streakLabel,
  allDeadlines, formatDate, daysLeftLabel,
  getFeynman, saveFeynmanText, toggleFeynmanPoint,
  togglePinChapter, loadCoursePins, clearPins,
  analyzeEmail, downloadBackup, importBackup, resetProgress, Pomodoro,
} from '../shared/core.js';

const esc = escapeHtml;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ---------- Kurs-Aliase ---------- */

const ALIAS = { all: 'all', alle: 'all', '*': 'all', en: 'english', english: 'english' };
for (const c of COURSES_META) {
  ALIAS[c.id] = c.id;
  ALIAS[c.short.toLowerCase()] = c.id;
}
const slug = id => (id === 'all' ? 'all' : courseMeta(id).short.toLowerCase());
const shortOf = id => (id === 'all' ? 'ALL' : courseMeta(id).short);
const COURSE_SLUGS = COURSES_META.map(c => c.short.toLowerCase());
const chapterById = id => ALL_CHAPTERS.find(ch => ch.id === id);

/* ---------- UI-Zustand (nur Sitzung) ---------- */

const TABS = [
  { id: 'home', key: 'F1', label: 'Home', path: '~' },
  { id: 'cards', key: 'F2', label: 'Karten', path: '~/karten' },
  { id: 'quiz', key: 'F3', label: 'Quiz', path: '~/quiz' },
  { id: 'courses', key: 'F4', label: 'Kurse', path: '~/kurse' },
  { id: 'email', key: 'F5', label: 'Email', path: '~/email' },
  { id: 'sheet', key: 'F6', label: 'Sheet', path: '~/sheet' },
  { id: 'sys', key: 'F7', label: 'System', path: '~/sys' },
];

const ui = {
  view: 'home',
  cards: null,
  quiz: null,
  course: { id: COURSES_META[0].id, open: new Set() },
  email: { idx: 0, drafts: {} },
};

const HIST_KEY = 'studyos_v3_cmdhist';
const CRT_KEY = 'studyos_v3_crt';
let cmdHistory = [];
try { cmdHistory = JSON.parse(localStorage.getItem(HIST_KEY) || '[]'); } catch { cmdHistory = []; }
let histPos = cmdHistory.length;
let histDraft = '';

/* ---------- DOM ---------- */

const viewEl = $('#view');
const tabbarEl = $('#tabbar');
const consoleEl = $('#console');
const consoleLog = $('#console-log');
const cmdInput = $('#cmd');
const cmdMsg = $('#cmd-msg');
const toastsEl = $('#toasts');
const importInput = $('#import-file');

/* ---------- Bausteine ---------- */

function bar(pct, width = 20) {
  const p = Math.max(0, Math.min(100, Math.round(pct)));
  const full = Math.round((p / 100) * width);
  return `<span class="bar" aria-hidden="true"><span class="bar-f">${'█'.repeat(full)}</span><span class="bar-e">${'░'.repeat(width - full)}</span></span><span class="pct">${String(p).padStart(3, '\u00a0')}%</span>`;
}

function pane(title, body, { cls = '', right = '', id = '' } = {}) {
  return `<section class="pane ${cls}"${id ? ` id="${id}"` : ''}>
    <header class="pane-h"><h2 class="pane-t">${title}</h2>${right ? `<span class="pane-r">${right}</span>` : ''}</header>
    <div class="pane-b">${body}</div>
  </section>`;
}

const tag = id => `<span class="tag c-${id}">[${esc(shortOf(id))}]</span>`;
const kbd = k => `<kbd>${esc(k)}</kbd>`;
const cmdLink = (c, label = c) => `<button type="button" class="cmdlink" data-act="cmd" data-arg="${esc(c)}">${esc(label)}</button>`;
/** Link mit Leerraum-Auffüllung außerhalb der Unterstreichung (für spaltige Konsolenausgaben). */
const padLink = (c, label, width) => cmdLink(c, label) + ' '.repeat(Math.max(1, width - label.length));

function btn(label, act, arg = '', { key = '', cls = '', title = '', pressed = null, disabled = false } = {}) {
  return `<button type="button" class="btn ${cls}" data-act="${act}"${arg !== '' ? ` data-arg="${esc(arg)}"` : ''}${title ? ` title="${esc(title)}"` : ''}${pressed !== null ? ` aria-pressed="${pressed}"` : ''}${disabled ? ' disabled' : ''}>${key ? `<span class="btn-k">${esc(key)}</span>` : ''}${label}</button>`;
}

function toast(msg, kind = 'ok') {
  const el = document.createElement('div');
  el.className = `toast toast-${kind}`;
  const label = { ok: ' OK ', warn: 'WARN', err: ' ERR' }[kind] || 'INFO';
  el.innerHTML = `<span class="toast-k">${label}</span><span class="toast-m">${esc(msg)}</span>`;
  toastsEl.append(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 250);
  }, 3400);
}

/* ---------- Theme & CRT ---------- */

function applyTheme() {
  const theme = store.state.theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  const el = $('[data-sl="theme"]');
  if (el) el.textContent = theme === 'dark' ? '☾ dark' : '☀ light';
}

function crtEnabled() { return localStorage.getItem(CRT_KEY) !== 'off'; }
function applyCrt() { document.documentElement.dataset.crt = crtEnabled() ? 'on' : 'off'; }
function setCrt(on) {
  localStorage.setItem(CRT_KEY, on ? 'on' : 'off');
  applyCrt();
}

/* ---------- Statuszeile & Tabs ---------- */

function updateStatus() {
  const t = todayProgress();
  const due = getDueCards('all').length;
  $('[data-sl="streak"]').textContent = streakLabel();
  $('[data-sl="today"]').textContent = `${t.done}/${t.goal}`;
  const full = Math.round((t.pct / 100) * 8);
  $('[data-sl="todaybar"]').textContent = '█'.repeat(full) + '░'.repeat(8 - full);
  $('[data-sl="due"]').textContent = String(due);
  const tb = $('[data-badge="cards"]');
  if (tb) tb.textContent = due ? String(due) : '';
  const sb = $('[data-badge="sheet"]');
  if (sb) sb.textContent = store.state.pinnedCheatSheet.length ? String(store.state.pinnedCheatSheet.length) : '';
}

function updateClock() {
  const d = new Date();
  $('[data-sl="clock"]').textContent = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function renderTabs() {
  tabbarEl.innerHTML = TABS.map((t, i) => `
    <button type="button" class="tab${ui.view === t.id ? ' is-active' : ''}" data-act="go" data-arg="${t.id}" aria-current="${ui.view === t.id ? 'page' : 'false'}" title="${t.key} oder Alt+${i + 1}">
      <span class="tab-k">${t.key}</span><span class="tab-l">${t.label}${t.id === 'cards' || t.id === 'sheet' ? `<span class="tab-n" data-badge="${t.id}"></span>` : ''}</span>
    </button>`).join('');
  updateStatus();
}

/* ---------- Pomodoro ---------- */

const pomo = new Pomodoro({
  onChange: updatePomo,
  onFinish: (min) => {
    toast(`Fokus-Session (${min} Min) abgeschlossen — kurze Pause!`);
    log(`<span class="c-ok">[pomo]</span> ${min}-Minuten-Session abgeschlossen und im Tageslog gespeichert.`);
    updateStatus();
  },
});

function updatePomo() {
  for (const el of $$('[data-pomo-time]')) el.textContent = pomo.display;
  for (const el of $$('[data-pomo-icon]')) el.textContent = pomo.running ? '❚❚' : '▶';
  for (const el of $$('[data-pomo-mode]')) el.textContent = `/${pomo.mode}`;
  for (const el of $$('[data-pomo-min]')) el.textContent = `${pomo.mode} min`;
  for (const el of $$('[data-pomo-state]')) el.textContent = pomo.running ? 'läuft' : (pomo.seconds === pomo.mode * 60 ? 'bereit' : 'pausiert');
  for (const el of $$('[data-pomo-bar]')) el.innerHTML = bar(pomo.progress * 100, Number(el.dataset.pomoBar) || 24);
  for (const el of $$('[data-pomo-toggle-label]')) el.textContent = pomo.running ? 'pause' : 'start';
  document.title = pomo.running ? `▶ ${pomo.display} · studyos` : 'studyos — WS26 Terminal';
  $('#statusline .sl-btn[data-act="pomo-toggle"]').classList.toggle('is-live', pomo.running);
}

/* ---------- Navigation ---------- */

function setView(id, { focusMain = false } = {}) {
  if (!TABS.some(t => t.id === id)) return;
  ui.view = id;
  if (id === 'cards' && !ui.cards) startCards('all', false, { silent: true });
  if (id === 'quiz' && !ui.quiz) startQuiz('all', { silent: true });
  $('#prompt-path').textContent = TABS.find(t => t.id === id).path;
  if (location.hash !== `#${id}`) history.replaceState(null, '', `#${id}`);
  renderTabs();
  render();
  viewEl.scrollTop = 0;
  if (focusMain) viewEl.focus({ preventScroll: true });
}

function render({ keepScroll = false } = {}) {
  const top = viewEl.scrollTop;
  viewEl.dataset.view = ui.view;
  viewEl.innerHTML = VIEWS[ui.view]();
  if (ui.view === 'email') updateEmailFeedback();
  updatePomo();
  updateStatus();
  if (keepScroll) viewEl.scrollTop = top;
}

/* =========================================================
   VIEW: HOME
   ========================================================= */

function homeView() {
  const t = todayProgress();
  const due = getDueCards('all').length;
  const overall = overallMastery();
  const stats = cardStats('all');

  const sys = `
    <dl class="kv">
      <dt>fällig</dt><dd><b class="hl">${due}</b> Karten <span class="dim">(von ${stats.total})</span></dd>
      <dt>heute</dt><dd>${bar(t.pct, 16)} <span class="dim">${t.done}/${t.goal} · ${t.reviews} rev · ${t.quizzes} quiz · ${t.minutes} min</span></dd>
      <dt>streak</dt><dd><b>${esc(streakLabel())}</b></dd>
      <dt>mastery</dt><dd>${bar(overall, 16)}</dd>
      <dt>status</dt><dd><span class="c-new">${stats.new} neu</span> · <span class="c-learn">${stats.learning} lernend</span> · <span class="c-ok">${stats.mastered} gemeistert</span></dd>
    </dl>
    <div class="actions">
      ${btn(`Interleaved Session starten <span class="dim">(${due} fällig)</span>`, 'cards-start', 'all', { key: 's', cls: 'btn-primary' })}
      ${btn('Quiz gemischt', 'quiz-start', 'all', { key: 'F3' })}
    </div>`;

  const focus = `
    <div class="pomo">
      <div class="pomo-time"><span data-pomo-time>${pomo.display}</span></div>
      <div class="pomo-meta"><span data-pomo-state></span> · Modus <b data-pomo-min></b></div>
      <div class="pomo-bar" data-pomo-bar="18"></div>
      <div class="actions">
        ${btn('<span data-pomo-toggle-label>start</span>', 'pomo-toggle', '', { key: 'p', cls: 'btn-primary' })}
        ${btn('reset', 'pomo-reset')}
        ${btn('25↔50', 'pomo-switch')}
      </div>
    </div>`;

  const rows = COURSES_META.map(c => {
    const m = getCourseMastery(c.id);
    const d = getDueCards(c.id).length;
    const st = cardStats(c.id);
    return `<button type="button" class="trow" data-act="course-open" data-arg="${c.id}" title="Kurs öffnen: course ${esc(c.short.toLowerCase())}">
      <span class="tc-id c-${c.id}">${esc(c.short.toLowerCase())}</span>
      <span class="tc-name">${esc(c.title)}</span>
      <span class="tc-st"><span class="c-new">${st.new}</span>/<span class="c-learn">${st.learning}</span>/<span class="c-ok">${st.mastered}</span></span>
      <span class="tc-bar">${bar(m, 16)}</span>
      <span class="tc-due${d ? ' hl' : ' dim'}">${d} fällig</span>
    </button>`;
  }).join('');
  const table = `<div class="table">
      <div class="trow trow-h" aria-hidden="true"><span class="tc-id">ID</span><span class="tc-name">KURS</span><span class="tc-st">NEU/LERN/GEM</span><span class="tc-bar">MASTERY</span><span class="tc-due">FÄLLIG</span></div>
      ${rows}
    </div>`;

  const dls = allDeadlines().slice(0, 8);
  const dlBody = dls.length ? `<ul class="dl-list">${dls.map(d => `
      <li class="dl${d.daysLeft <= 3 ? ' is-near' : ''}${d.urgent ? ' is-urgent' : ''}">
        <span class="dl-date">${formatDate(d.date)}</span>
        <span class="dl-left">${esc(daysLeftLabel(d.daysLeft))}</span>
        <span class="dl-c c-${d.courseId}">${esc(d.courseShort)}</span>
        <span class="dl-label">${esc(d.label)}${d.urgent ? ' <span class="flag">!</span>' : ''}</span>
      </li>`).join('')}</ul>` : '<p class="dim">Keine anstehenden Termine.</p>';

  return `<div class="grid grid-home">
    ${pane('system', sys, { cls: 'span-2 pane-focus', right: `<span class="dim">${new Date().toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>` })}
    ${pane('focus', focus)}
    ${pane('kurse', table, { cls: 'span-3', right: cmdLink('course gp1', 'course <id>') })}
    ${pane('deadlines', dlBody, { cls: 'span-2', right: cmdLink('deadlines') })}
    ${pane('aktivität · 14 tage', activityGraph(14))}
  </div>`;
}

function activityGraph(days) {
  const hist = activityHistory(days);
  const max = Math.max(1, ...hist.map(h => h.total));
  const ROWS = 5;
  const BLOCKS = ' ▁▂▃▄▅▆▇█';
  const lines = [];
  for (let r = ROWS - 1; r >= 0; r--) {
    lines.push(hist.map(h => {
      const fill = Math.max(0, Math.min(1, (h.total / max) * ROWS - r));
      const ch = BLOCKS[Math.round(fill * 8)];
      return (ch + ch).padEnd(3, ' ');
    }).join(''));
  }
  lines.push(hist.map(h => h.weekday.padEnd(3, ' ')).join(''));
  const total = hist.reduce((a, h) => a + h.total, 0);
  const mins = hist.reduce((a, h) => a + h.minutes, 0);
  return `<pre class="graph" role="img" aria-label="Aktivität der letzten ${days} Tage, insgesamt ${total} Einheiten">${esc(lines.join('\n'))}</pre>
    <p class="dim small">Σ ${total} Wiederholungen/Fragen · ${mins} Fokus-Min · max ${max}/Tag</p>`;
}

/* =========================================================
   VIEW: KARTEN (Spaced Repetition)
   ========================================================= */

function startCards(course = 'all', includeAll = false, { silent = false } = {}) {
  ui.cards = { course, includeAll, queue: buildFlashcardQueue(course, includeAll), idx: 0, revealed: false, rated: 0, again: 0 };
  if (!silent) log(`cards: ${ui.cards.queue.length} Karten in der Queue (${course === 'all' ? 'interleaved' : shortOf(course)}${includeAll ? ', alle' : ', fällig'})`);
  return ui.cards;
}

function courseFilterRow(act, current, countFn) {
  const opts = ['all', ...COURSES_META.map(c => c.id)];
  return `<div class="filter" role="group" aria-label="Kursfilter">
    <span class="dim filter-l">filter:</span>
    ${opts.map(id => `<button type="button" class="chip${id === current ? ' is-on' : ''}${id !== 'all' ? ` chip-${id}` : ''}" data-act="${act}" data-arg="${id}" aria-pressed="${id === current}">${esc(slug(id))}<span class="chip-n">${countFn(id)}</span></button>`).join('')}
  </div>`;
}

function cardsView() {
  const s = ui.cards;
  const filter = courseFilterRow('cards-filter', s.course, id => getDueCards(id).length);
  const st = cardStats(s.course);
  const side = pane('deck', `
    <dl class="kv kv-tight">
      <dt>deck</dt><dd>${s.course === 'all' ? 'alle Kurse (interleaved)' : esc(courseMeta(s.course).title)}</dd>
      <dt>modus</dt><dd>${s.includeAll ? 'alle Karten' : 'nur fällige'}</dd>
      <dt>fällig jetzt</dt><dd><b>${getDueCards(s.course).length}</b></dd>
      <dt class="c-new">neu</dt><dd>${st.new}</dd>
      <dt class="c-due">wiederholen</dt><dd>${st.due}</dd>
      <dt class="c-learn">lernend</dt><dd>${st.learning}</dd>
      <dt class="c-ok">gemeistert</dt><dd>${st.mastered} / ${st.total}</dd>
      <dt>session</dt><dd>${s.rated} bewertet · ${s.again}× nochmal</dd>
    </dl>
    <div class="actions">${btn(s.includeAll ? 'nur fällige' : 'alle Karten', 'cards-mode', '', { title: 'Queue-Modus wechseln' })}</div>
    <p class="dim small">${kbd('Space')} aufdecken · ${kbd('1')}–${kbd('4')} bewerten</p>`, { cls: 'pane-side' });

  let main;
  if (s.idx >= s.queue.length) {
    main = pane('queue leer', `
      <pre class="ascii" aria-hidden="true">  _____
 |  ✓  |   $ studyos review --due
 |_____|   0 Karten übrig</pre>
      <p>${s.rated ? `Session abgeschlossen: <b>${s.rated}</b> Bewertungen.` : 'Für diesen Filter sind gerade keine Karten fällig.'} Das SM-2-Intervall plant die nächste Wiederholung automatisch.</p>
      <div class="actions">
        ${btn('Alle Karten nochmal üben', 'cards-all', '', { key: 'a', cls: 'btn-primary' })}
        ${btn('Zum Quiz', 'quiz-start', s.course, { key: 'q' })}
      </div>`, { cls: 'pane-focus' });
  } else {
    const card = s.queue[s.idx];
    const ch = chapterById(card.chapterId);
    const iv = intervalsFor(card);
    const pos = s.idx + 1;
    const head = `karte ${pos}/${s.queue.length}`;
    const right = `<span class="mini">${bar((s.idx / s.queue.length) * 100, 12)}</span>`;
    main = pane(head, `
      <div class="card-meta">${tag(card.courseId)}${card.examRelevant ? '<span class="tag tag-exam">[!] KLAUSUR</span>' : ''}${ch ? `<span class="dim">§ ${esc(ch.title)}</span>` : ''}</div>
      <div class="card-label">&gt; frage</div>
      <div class="card-text pre">${esc(card.front)}</div>
      ${s.revealed ? `
        <div class="rule" aria-hidden="true"></div>
        <div class="card-label">&gt; antwort</div>
        <div class="card-text card-back pre">${esc(card.back)}</div>
        <div class="rate" role="group" aria-label="Bewertung">
          ${RATING_LABELS.map(r => `<button type="button" class="rate-btn rate-${r.value}" data-act="rate" data-arg="${r.value}">
            <span class="btn-k">${r.key}</span><span class="rate-l">${esc(r.label)}</span><span class="rate-iv">${esc(iv[r.value])}</span>
          </button>`).join('')}
        </div>` : `
        <div class="actions">${btn('Antwort aufdecken', 'reveal', '', { key: 'Space', cls: 'btn-primary btn-wide' })}</div>
        <p class="dim small">Erst im Kopf beantworten (Active Recall), dann aufdecken.</p>`}
    `, { cls: 'pane-focus pane-card', right });
  }

  return `${filter}<div class="grid grid-side">${main}${side}</div>`;
}

function revealCard() {
  const s = ui.cards;
  if (!s || s.revealed || s.idx >= s.queue.length) return;
  s.revealed = true;
  render({ keepScroll: true });
}

function rate(value) {
  const s = ui.cards;
  if (!s || !s.revealed || s.idx >= s.queue.length) return;
  const card = s.queue[s.idx];
  const again = rateCard(card, value);
  s.rated += 1;
  if (again) {
    s.queue.push(card);
    s.again += 1;
    toast('Karte kommt am Ende dieser Session nochmal.', 'warn');
  }
  s.idx += 1;
  s.revealed = false;
  if (s.idx >= s.queue.length) toast(`Queue abgearbeitet — ${s.rated} Bewertungen.`);
  render();
}

/* =========================================================
   VIEW: QUIZ
   ========================================================= */

function startQuiz(course = 'all', { silent = false } = {}) {
  ui.quiz = { course, queue: buildQuizQueue(course), idx: 0, selected: null, confidence: 'medium', result: null, correct: 0, answered: 0 };
  if (!silent) log(`quiz: ${ui.quiz.queue.length} Fragen (${course === 'all' ? 'interleaved' : shortOf(course)})`);
  return ui.quiz;
}

const LETTERS = 'abcdefgh';
const CONF_KEYS = { low: 'g', medium: 'z', high: 'h' };

function quizView() {
  const s = ui.quiz;
  const filter = courseFilterRow('quiz-filter', s.course, id => (id === 'all' ? ALL_QUIZZES.length : ALL_QUIZZES.filter(q => q.courseId === id).length));
  const cal = calibrationStats();
  const calRows = CONFIDENCE_LEVELS.map(l => {
    const c = cal[l.value];
    const acc = c.n ? (c.ok / c.n) * 100 : 0;
    return `<div class="cal-row"><span class="cal-l">${esc(l.label)} <span class="dim">n=${c.n}</span></span><span class="cal-b">${c.n ? bar(acc, 16) : '<span class="dim">— noch keine Daten</span>'}</span></div>`;
  }).join('');
  const side = pane('kalibrierung', `
    ${calRows}
    <p class="dim small">Gut kalibriert heißt: „100% sicher" sollte auch ~100% richtig sein.</p>
    <dl class="kv kv-tight"><dt>session</dt><dd>${s.correct}/${s.answered} richtig</dd></dl>
    <p class="dim small">${kbd('a')}–${kbd('d')} wählen · ${kbd('g')} ${kbd('z')} ${kbd('h')} Sicherheit · ${kbd('Enter')} prüfen/weiter</p>`, { cls: 'pane-side' });

  let main;
  if (s.idx >= s.queue.length) {
    const pct = s.answered ? (s.correct / s.answered) * 100 : 0;
    main = pane('quiz beendet', `
      <p>Ergebnis: <b class="hl">${s.correct}/${s.answered}</b> richtig</p>
      <p>${bar(pct, 24)}</p>
      <div class="actions">
        ${btn('Neustart', 'quiz-restart', '', { key: 'r', cls: 'btn-primary' })}
        ${btn('Karten wiederholen', 'cards-start', s.course, { key: 'F2' })}
      </div>`, { cls: 'pane-focus' });
  } else {
    const q = s.queue[s.idx];
    const done = s.result !== null;
    const opts = q.options.map((o, i) => {
      let cls = '';
      let mark = s.selected === i ? '(•)' : '( )';
      if (done) {
        if (i === q.answer) { cls = ' is-correct'; mark = '[✓]'; } else if (i === s.selected) { cls = ' is-wrong'; mark = '[✗]'; } else cls = ' is-dim';
      } else if (s.selected === i) cls = ' is-sel';
      return `<button type="button" class="opt${cls}" data-act="quiz-opt" data-arg="${i}"${done ? ' disabled' : ''} aria-pressed="${s.selected === i}">
        <span class="opt-k">${LETTERS[i]}</span><span class="opt-m">${mark}</span><span class="opt-t">${esc(o)}</span></button>`;
    }).join('');

    const conf = `<div class="conf" role="group" aria-label="Sicherheit">
      <span class="dim">sicherheit:</span>
      ${CONFIDENCE_LEVELS.map(l => `<button type="button" class="chip${s.confidence === l.value ? ' is-on' : ''}" data-act="quiz-conf" data-arg="${l.value}" aria-pressed="${s.confidence === l.value}"${done ? ' disabled' : ''}><span class="btn-k">${CONF_KEYS[l.value]}</span>${esc(l.label)}</button>`).join('')}
    </div>`;

    let feedback = '';
    if (done) {
      const r = s.result;
      feedback = `
        <div class="verdict ${r.correct ? 'is-ok' : 'is-bad'}">${r.correct ? '✓ RICHTIG' : `✗ FALSCH — korrekt ist (${LETTERS[q.answer]})`}</div>
        ${r.overconfident ? `<div class="warnbox"><b>!! HYPERCORRECTION</b> Du warst dir „100% sicher" — und lagst falsch. Genau diese Fehler merkt man sich nach der Korrektur besonders gut: Erklärung jetzt bewusst lesen.</div>` : ''}
        <div class="explain"><span class="card-label">&gt; erklärung</span><div>${esc(q.explanation)}</div></div>
        <div class="actions">${btn('Nächste Frage', 'quiz-next', '', { key: 'Enter', cls: 'btn-primary' })}</div>`;
    } else {
      feedback = `<div class="actions">${btn('Antwort prüfen', 'quiz-submit', '', { key: 'Enter', cls: 'btn-primary', disabled: s.selected === null })}</div>`;
    }

    main = pane(`frage ${s.idx + 1}/${s.queue.length}`, `
      <div class="card-meta">${tag(q.courseId)}${q.examStyle ? `<span class="tag tag-exam">${esc(q.examStyle)}</span>` : ''}</div>
      <div class="q-text">${esc(q.question)}</div>
      ${q.code ? `<pre class="code">${esc(q.code)}</pre>` : ''}
      <div class="opts" role="group" aria-label="Antwortoptionen">${opts}</div>
      ${conf}
      ${feedback}`, { cls: 'pane-focus', right: `<span class="mini">${bar((s.idx / s.queue.length) * 100, 12)}</span>` });
  }
  return `${filter}<div class="grid grid-side">${main}${side}</div>`;
}

function quizSelect(i) {
  const s = ui.quiz;
  if (!s || s.result || s.idx >= s.queue.length) return;
  const q = s.queue[s.idx];
  if (i < 0 || i >= q.options.length) return;
  s.selected = i;
  render({ keepScroll: true });
}

function quizConf(v) {
  const s = ui.quiz;
  if (!s || s.result || !CONFIDENCE_LEVELS.some(l => l.value === v)) return;
  s.confidence = v;
  render({ keepScroll: true });
}

function quizSubmit() {
  const s = ui.quiz;
  if (!s || s.result || s.idx >= s.queue.length) return;
  if (s.selected === null) { toast('Erst eine Antwort wählen (a–d).', 'warn'); return; }
  const q = s.queue[s.idx];
  s.result = submitQuiz(q, s.selected, s.confidence);
  s.answered += 1;
  if (s.result.correct) s.correct += 1;
  render({ keepScroll: true });
}

function quizNext() {
  const s = ui.quiz;
  if (!s || !s.result) return;
  s.idx += 1;
  s.selected = null;
  s.confidence = 'medium';
  s.result = null;
  render();
}

/* =========================================================
   VIEW: KURSE
   ========================================================= */

function coursesView() {
  const cur = courseMeta(ui.course.id);
  const list = COURSES_META.map(c => {
    const on = c.id === cur.id;
    return `<button type="button" class="clist-i${on ? ' is-on' : ''}" data-act="course-open" data-arg="${c.id}" aria-current="${on}">
      <span class="clist-cur">${on ? '▶' : ' '}</span>
      <span class="c-${c.id} clist-id">${esc(c.short)}</span>
      <span class="clist-bar">${bar(getCourseMastery(c.id), 8)}</span>
      <span class="clist-due dim">${getDueCards(c.id).length}f</span>
    </button>`;
  }).join('');
  const listPane = pane('kurse', `<div class="clist">${list}</div><p class="dim small">${kbd('j')}/${kbd('k')} wechseln · ${kbd('c')} Karten · ${kbd('q')} Quiz</p>`, { cls: 'pane-side pane-list' });

  const ex = cur.examInfo;
  const chapters = ALL_CHAPTERS.filter(ch => ch.courseId === cur.id);
  const nQuiz = ALL_QUIZZES.filter(q => q.courseId === cur.id).length;
  const nDue = getDueCards(cur.id).length;
  const allOpen = chapters.every(ch => ui.course.open.has(ch.id));

  const head = `
    <div class="c-head">
      <div class="c-title c-${cur.id}">${esc(cur.title)}</div>
      <div class="dim">${esc(cur.subtitle)}</div>
      <div class="dim small">${esc(cur.prof)}</div>
    </div>
    <dl class="kv exam">
      <dt>prüfung</dt><dd>${esc(ex.type)}</dd>
      <dt>hilfsmittel</dt><dd>${esc(ex.aid)}</dd>
      <dt>pvl</dt><dd>${esc(ex.pvl)}</dd>
      <dt>zeitraum</dt><dd>${esc(ex.period)}</dd>
      <dt>mastery</dt><dd>${bar(getCourseMastery(cur.id), 16)}</dd>
    </dl>
    <div class="actions">
      ${btn(`Karten <span class="dim">(${nDue} fällig)</span>`, 'cards-start', cur.id, { key: 'c', cls: 'btn-primary' })}
      ${btn(`Quiz <span class="dim">(${nQuiz})</span>`, 'quiz-start', cur.id, { key: 'q' })}
      ${cur.id === 'english' ? btn('Email-Coach', 'go', 'email', { key: 'F5' }) : ''}
    </div>`;

  const chHtml = chapters.map(ch => chapterBlock(ch)).join('');
  const pdfs = `<ul class="pdfs">${cur.pdfs.map(p => `<li><a href="${pdfHref(p.path)}" target="_blank" rel="noopener"><span class="pdf-k">PDF</span><span class="pdf-t">${esc(p.title)}</span><span class="pdf-tag dim">‹${esc(p.tag)}›</span></a></li>`).join('')}</ul>`;

  return `<div class="grid grid-courses">
    ${listPane}
    <div class="stack">
      ${pane(`${esc(cur.short.toLowerCase())} · info`, head, { cls: 'pane-focus' })}
      ${pane(`kapitel (${chapters.length})`, `<div class="chapters">${chHtml}</div>`, { right: btn(allOpen ? '− alle zu' : '+ alle auf', 'chapters-all', allOpen ? 'close' : 'open', { cls: 'btn-tiny' }) })}
      ${pane(`pdfs (${cur.pdfs.length})`, pdfs)}
    </div>
  </div>`;
}

function chapterBlock(ch) {
  const open = ui.course.open.has(ch.id);
  const pinned = store.isPinned(ch.cheatSheet.id);
  const f = getFeynman(ch.id);
  const checked = new Set(f.checkedPoints);
  const dg = ch.diagram && DIAGRAMS[ch.diagram];
  const body = open ? `
    <div class="ch-body" id="ch-${esc(ch.id)}">
      <ul class="summary">${ch.summary.map(s => `<li>${s}</li>`).join('')}</ul>
      ${dg ? `<figure class="diagram"><figcaption>┤ diagramm: ${esc(dg.title)} ├</figcaption>${dg.svg}</figure>` : ''}
      <div class="feynman">
        <div class="card-label">&gt; feynman: erklär es einfach</div>
        <p class="feyn-prompt">${esc(ch.feynman.prompt)}</p>
        <textarea class="field" data-feynman="${esc(ch.id)}" rows="5" spellcheck="true" placeholder="Deine Erklärung in eigenen Worten … (wird automatisch gespeichert)" aria-label="Feynman-Erklärung zu ${esc(ch.title)}">${esc(f.text)}</textarea>
        <div class="card-label">&gt; rubric <span class="dim" data-rubric-count="${esc(ch.id)}">${checked.size}/${ch.feynman.rubric.length}</span></div>
        <ul class="rubric">${ch.feynman.rubric.map((r, i) => `<li><label class="check"><input type="checkbox" data-rubric="${esc(ch.id)}" data-idx="${i}"${checked.has(i) ? ' checked' : ''}><span class="check-box" aria-hidden="true"></span><span>${esc(r)}</span></label></li>`).join('')}</ul>
      </div>
    </div>` : '';
  return `<article class="chapter${open ? ' is-open' : ''}">
    <div class="ch-head">
      <button type="button" class="ch-toggle" data-act="chapter-toggle" data-arg="${esc(ch.id)}" aria-expanded="${open}"${open ? ` aria-controls="ch-${esc(ch.id)}"` : ''}>
        <span class="ch-mark">${open ? '[−]' : '[+]'}</span><span class="ch-title">${esc(ch.title)} <span class="badge">${esc(ch.badge)}</span></span>
      </button>
      ${btn(pinned ? '✓ gepinnt' : 'pin', 'pin', ch.id, { cls: `btn-tiny${pinned ? ' is-pinned' : ''}`, pressed: pinned, title: 'Auf den DIN-A4-Spickzettel pinnen' })}
    </div>
    ${body}
  </article>`;
}

function shiftCourse(dir) {
  const ids = COURSES_META.map(c => c.id);
  const i = ids.indexOf(ui.course.id);
  ui.course.id = ids[(i + dir + ids.length) % ids.length];
  render();
}

/* =========================================================
   VIEW: EMAIL (GPAS Coach)
   ========================================================= */

function emailView() {
  const idx = ui.email.idx;
  const prompt = ENGLISH_DATA.emailPrompts[idx];
  const text = ui.email.drafts[idx] || '';
  const dg = DIAGRAMS['gpas-email'];
  const tabs = `<div class="filter" role="group" aria-label="Szenario">
    <span class="dim filter-l">szenario:</span>
    ${ENGLISH_DATA.emailPrompts.map((p, i) => `<button type="button" class="chip${i === idx ? ' is-on' : ''}" data-act="email-prompt" data-arg="${i}" aria-pressed="${i === idx}"><span class="chip-n">${i + 1}</span> ${esc(p.title)}</button>`).join('')}
  </div>`;

  const scen = pane(`task ${idx + 1}: ${esc(prompt.title)}`, `
    <div class="pre scenario">${esc(prompt.scenario)}</div>
    <figure class="diagram"><figcaption>┤ ${esc(dg.title)} ├</figcaption>${dg.svg}</figure>`, { cls: 'pane-side' });

  const editor = pane(`vi email_${idx + 1}.txt`, `
    <textarea id="email-editor" class="field editor" rows="14" spellcheck="true" aria-label="Email-Entwurf" placeholder="Dear Ms Miller,&#10;&#10;Thank you for your email regarding …&#10;&#10;Kind regards,&#10;…">${esc(text)}</textarea>
    <div class="vimbar" id="email-vimbar" aria-live="polite"></div>`, { cls: 'pane-focus' });

  const fb = pane('lint', '<div id="email-feedback"></div>');
  return `${tabs}<div class="grid grid-email">${scen}<div class="stack">${editor}${fb}</div></div>`;
}

function updateEmailFeedback() {
  const ed = $('#email-editor');
  const fbEl = $('#email-feedback');
  if (!ed || !fbEl) return;
  const prompt = ENGLISH_DATA.emailPrompts[ui.email.idx];
  const a = analyzeEmail(ed.value, prompt);
  const lines = ed.value ? ed.value.split('\n').length : 0;
  $('#email-vimbar').innerHTML = `<span class="vim-mode">-- INSERT --</span>
    <span class="${a.wordsOk ? 'c-ok' : a.words ? 'c-warn' : 'dim'}">${a.words} Wörter</span>
    <span class="dim">Ziel 120–180 ${a.wordsOk ? '✓' : ''}</span>
    <span class="dim vim-pos">${lines}L</span>`;
  const wordPct = Math.min(100, (a.words / 180) * 100);
  fbEl.innerHTML = `
    <div class="lint-row"><span class="lint-l">wörter</span><span>${bar(wordPct, 18)}</span><span class="${a.wordsOk ? 'c-ok' : 'c-warn'}">${a.words} ${a.wordsOk ? 'OK' : (a.words < 110 ? 'zu kurz' : 'zu lang')}</span></div>
    <div class="lint-row"><span class="lint-l">gpas</span><span>${bar((a.score / a.checks.length) * 100, 18)}</span><span>${a.score}/${a.checks.length}</span></div>
    <ul class="checks">${a.checks.map(c => `<li class="${c.ok ? 'c-ok' : 'c-bad'}"><span class="ck">${c.ok ? '[✓]' : '[ ]'}</span> ${esc(c.label)}</li>`).join('')}</ul>
    <div class="card-label">&gt; keywords ${a.kwHits}/${a.keywords.length}</div>
    <div class="kw">${a.keywords.map(k => `<span class="kw-i${k.hit ? ' is-hit' : ''}">${k.hit ? '+' : '·'} ${esc(k.word)}</span>`).join('')}</div>`;
}

/* =========================================================
   VIEW: SHEET (DIN-A4 Spickzettel)
   ========================================================= */

function sheetItems(withUnpin) {
  return store.state.pinnedCheatSheet.map(p => `
    <article class="sheet-i">
      <header class="sheet-ih"><h3>${tag(p.courseId)} ${esc(p.title)}</h3>${withUnpin ? btn('unpin', 'unpin', p.id, { cls: 'btn-tiny', title: 'Vom Spickzettel entfernen' }) : ''}</header>
      <p>${esc(p.content)}</p>
      ${p.code ? `<pre class="code">${esc(p.code)}</pre>` : ''}
    </article>`).join('');
}

function sheetView() {
  const pins = store.state.pinnedCheatSheet;
  const tools = `<div class="filter" role="group" aria-label="Spickzettel-Aktionen">
    <span class="dim filter-l">load:</span>
    ${btn('+ GP1', 'sheet-load', 'gdp1', { cls: 'chip' })}
    ${btn('+ ICS', 'sheet-load', 'ics', { cls: 'chip' })}
    ${btn('+ alle Essentials', 'sheet-load', 'all', { cls: 'chip' })}
    <span class="sep" aria-hidden="true">│</span>
    ${btn('drucken', 'sheet-print', '', { cls: 'chip', disabled: !pins.length })}
    ${btn('leeren', 'sheet-clear', '', { cls: 'chip chip-danger', disabled: !pins.length })}
  </div>`;
  const chars = pins.reduce((n, p) => n + p.title.length + p.content.length + (p.code || '').length, 0);
  const body = pins.length
    ? `<div class="sheet-doc">${sheetItems(true)}</div>`
    : `<pre class="ascii" aria-hidden="true">$ cat spickzettel.txt
cat: spickzettel.txt: leer</pre>
      <p>Noch nichts gepinnt. Lade oben die GP1/ICS-Essentials oder pinne Kapitel in der ${cmdLink('course gp1', 'Kursansicht')} (Button <b>pin</b> oder Befehl ${cmdLink('pin')}).</p>`;
  return `${tools}${pane(`spickzettel.txt · ${pins.length} einträge`, body, { cls: 'pane-focus', right: pins.length ? `<span class="dim">${chars} Zeichen · Druck: 2 Spalten A4</span>` : '' })}`;
}

function fillPrintRoot() {
  const pins = store.state.pinnedCheatSheet;
  $('#print-root').innerHTML = `<header class="pr-h">StudyOS WS26 · DIN-A4 Spickzettel · ${new Date().toLocaleDateString('de-DE')}</header><div class="pr-cols">${sheetItems(false)}</div>`;
  return pins.length;
}

function printSheet() {
  if (!store.state.pinnedCheatSheet.length) { toast('Spickzettel ist leer — erst Kapitel pinnen.', 'warn'); return; }
  fillPrintRoot();
  window.print();
}

/* =========================================================
   VIEW: SYSTEM (Methoden, Backup, Shortcuts)
   ========================================================= */

const METHODS = [
  ['spaced-repetition', 'Wiederholen kurz vor dem Vergessen: Der SM-2-Algorithmus verlängert die Intervalle mit jeder guten Bewertung — wenig Aufwand, langes Behalten.', 'cards'],
  ['active-recall', 'Abrufen statt Wiederlesen: Antwort erst selbst formulieren, dann aufdecken bzw. im Quiz prüfen. Der Abrufversuch selbst festigt das Gedächtnis.', 'quiz'],
  ['interleaving', 'Kurse und Themen gemischt üben (Filter „all"). Zwingt dazu, Aufgabentypen zu unterscheiden — fühlt sich schwerer an, wirkt aber besser in der Klausur.', 'cards all'],
  ['dual-coding', 'Wort + Bild: Diagramme in den Kapiteln legen eine zweite, visuelle Gedächtnisspur neben die Textzusammenfassung.', 'course gp1'],
  ['feynman+kalibrierung', 'Konzept in einfachen Worten erklären deckt Lücken auf (Rubric abhaken). Die Sicherheitsangabe im Quiz misst deine Kalibrierung — sicher geglaubte Fehler (Hypercorrection) bleiben nach Korrektur besonders gut hängen.', 'stats'],
];

const SHORTCUTS = [
  ['F1–F7 · Alt+1–7', 'Ansicht wechseln'],
  [': oder /', 'Befehlszeile fokussieren'],
  ['↑ / ↓', 'Befehlsverlauf (in der Befehlszeile)'],
  ['Tab', 'Befehl/Argument vervollständigen'],
  ['Esc', 'Eingabe verlassen · Konsole schließen'],
  ['?', 'Hilfe anzeigen'],
  ['Space', 'Karte aufdecken'],
  ['1 2 3 4', 'Karte bewerten: Nochmal · Schwer · Gut · Einfach'],
  ['a – d', 'Quiz-Antwort wählen'],
  ['g z h', 'Sicherheit: Geraten · Ziemlich sicher · 100%'],
  ['Enter', 'Quiz prüfen / nächste Frage'],
  ['s', 'Home: Interleaved Session starten'],
  ['j / k · c / q', 'Kurse: wechseln · Karten / Quiz starten'],
  ['p', 'Pomodoro start/pause'],
];

function sysView() {
  const methods = `<ol class="methods">${METHODS.map(([name, text, cmd]) => `<li><div class="m-h"><b class="hl">${esc(name)}</b> ${cmdLink(cmd)}</div><p>${esc(text)}</p></li>`).join('')}</ol>`;
  const backup = `
    <p class="dim">Fortschritt liegt lokal im Browser (gemeinsam mit allen Varianten). Sichere ihn regelmäßig als JSON.</p>
    <div class="actions">
      ${btn('export', 'backup-export', '', { cls: 'btn-primary', title: 'Backup als JSON herunterladen' })}
      ${btn('import …', 'backup-import', '', { title: 'Backup-JSON einlesen' })}
      ${btn('reset', 'reset', '', { cls: 'btn-danger', title: 'Gesamten Lernfortschritt löschen' })}
    </div>
    <div class="card-label">&gt; display</div>
    <div class="actions">
      ${btn(`theme: ${store.state.theme}`, 'theme')}
      ${btn(`crt-effekt: ${crtEnabled() ? 'an' : 'aus'}`, 'crt', '', { pressed: crtEnabled() })}
    </div>`;
  const keys = `<table class="keys"><tbody>${SHORTCUTS.map(([k, d]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(d)}</td></tr>`).join('')}</tbody></table>`;
  const cmds = `<ul class="cmdref">${COMMAND_HELP.map(([c, d]) => `<li>${cmdLink(c.split(' ')[0], c)} <span class="dim">${esc(d)}</span></li>`).join('')}</ul>`;
  return `<div class="grid grid-sys">
    ${pane('man studyos · methoden', methods, { cls: 'span-2 pane-focus' })}
    ${pane('backup', backup)}
    ${pane('tastatur', keys)}
    ${pane('befehle', cmds, { cls: 'span-2' })}
  </div>`;
}

const VIEWS = { home: homeView, cards: cardsView, quiz: quizView, courses: coursesView, email: emailView, sheet: sheetView, sys: sysView };

/* =========================================================
   Aktionen (Maus) — Delegation
   ========================================================= */

function doReset() {
  if (!confirm('Gesamten Lernfortschritt (Karten, Quiz, Notizen, Spickzettel, Streak) unwiderruflich löschen?')) return false;
  resetProgress();
  ui.cards = null;
  ui.quiz = null;
  toast('Fortschritt zurückgesetzt.', 'warn');
  if (ui.view === 'cards') startCards('all', false, { silent: true });
  if (ui.view === 'quiz') startQuiz('all', { silent: true });
  render();
  return true;
}

function toggleTheme() {
  store.toggleTheme();
  applyTheme();
  if (ui.view === 'sys') render({ keepScroll: true });
}

function pinChapter(ch) {
  const pinned = togglePinChapter(ch);
  toast(pinned ? `Gepinnt: ${ch.cheatSheet.title}` : `Entfernt: ${ch.cheatSheet.title}`, pinned ? 'ok' : 'warn');
  return pinned;
}

function loadPins(arg) {
  const ids = arg === 'all' ? COURSES_META.map(c => c.id) : [arg];
  loadCoursePins(ids);
  toast(`${arg === 'all' ? 'Alle' : shortOf(arg)} Essentials auf dem Spickzettel.`);
}

const ACTIONS = {
  go: a => setView(a),
  cmd: a => runCommand(a, { echo: true }),
  'console-close': () => closeConsole(),
  theme: () => toggleTheme(),
  crt: () => { setCrt(!crtEnabled()); render({ keepScroll: true }); },
  'pomo-toggle': () => pomo.toggle(),
  'pomo-reset': () => pomo.reset(),
  'pomo-switch': () => pomo.switchMode(),
  'cards-start': a => { startCards(a || 'all', false); setView('cards'); },
  'cards-filter': a => { startCards(a, ui.cards?.includeAll || false, { silent: true }); render(); },
  'cards-mode': () => { startCards(ui.cards.course, !ui.cards.includeAll, { silent: true }); render(); },
  'cards-all': () => { startCards(ui.cards.course, true, { silent: true }); render(); },
  reveal: () => revealCard(),
  rate: a => rate(Number(a)),
  'quiz-start': a => { startQuiz(a || 'all'); setView('quiz'); },
  'quiz-filter': a => { startQuiz(a, { silent: true }); render(); },
  'quiz-opt': a => quizSelect(Number(a)),
  'quiz-conf': a => quizConf(a),
  'quiz-submit': () => quizSubmit(),
  'quiz-next': () => quizNext(),
  'quiz-restart': () => { startQuiz(ui.quiz.course, { silent: true }); render(); },
  'course-open': a => { ui.course.id = a; setView('courses'); },
  'chapter-toggle': a => {
    if (ui.course.open.has(a)) ui.course.open.delete(a); else ui.course.open.add(a);
    render({ keepScroll: true });
  },
  'chapters-all': a => {
    const ids = ALL_CHAPTERS.filter(ch => ch.courseId === ui.course.id).map(ch => ch.id);
    for (const id of ids) { if (a === 'open') ui.course.open.add(id); else ui.course.open.delete(id); }
    render({ keepScroll: true });
  },
  pin: a => { const ch = chapterById(a); if (ch) { pinChapter(ch); render({ keepScroll: true }); } },
  'email-prompt': a => { ui.email.idx = Number(a); render(); },
  unpin: a => { store.togglePin({ id: a }); toast('Vom Spickzettel entfernt.', 'warn'); render({ keepScroll: true }); },
  'sheet-load': a => { loadPins(a); render({ keepScroll: true }); },
  'sheet-clear': () => { clearPins(); toast('Spickzettel geleert.', 'warn'); render(); },
  'sheet-print': () => printSheet(),
  'backup-export': () => { downloadBackup(); toast('Backup-Datei wird heruntergeladen.'); },
  'backup-import': () => importInput.click(),
  reset: () => doReset(),
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = ACTIONS[el.dataset.act];
  if (!fn) return;
  e.preventDefault();
  if (e.detail > 0 && el.matches('button') && document.activeElement === el) el.blur(); // Maus: Fokus nicht auf Steuerelement lassen (Space/Enter bleiben frei)
  fn(el.dataset.arg ?? '');
});

document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.id === 'email-editor') {
    ui.email.drafts[ui.email.idx] = t.value;
    updateEmailFeedback();
  } else if (t.dataset && t.dataset.feynman) {
    saveFeynmanText(t.dataset.feynman, t.value);
  }
});

document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.dataset && t.dataset.rubric) {
    toggleFeynmanPoint(t.dataset.rubric, Number(t.dataset.idx), t.checked);
    const ch = chapterById(t.dataset.rubric);
    const cnt = $(`[data-rubric-count="${CSS.escape(t.dataset.rubric)}"]`);
    if (ch && cnt) cnt.textContent = `${getFeynman(ch.id).checkedPoints.length}/${ch.feynman.rubric.length}`;
  }
});

importInput.addEventListener('change', async () => {
  const file = importInput.files && importInput.files[0];
  importInput.value = '';
  if (!file) return;
  try {
    await importBackup(file);
    applyTheme();
    ui.cards = null;
    ui.quiz = null;
    if (ui.view === 'cards') startCards('all', false, { silent: true });
    if (ui.view === 'quiz') startQuiz('all', { silent: true });
    render();
    toast(`Backup „${file.name}" importiert.`);
    log(`<span class="c-ok">import:</span> ${esc(file.name)} eingelesen.`);
  } catch (err) {
    toast('Import fehlgeschlagen: keine gültige Backup-JSON.', 'err');
    log(`<span class="c-bad">import: Fehler —</span> ${esc(err && err.message ? err.message : String(err))}`);
  }
});

window.addEventListener('beforeprint', fillPrintRoot);

/* =========================================================
   Befehlszeile
   ========================================================= */

const COMMAND_HELP = [
  ['help [befehl]', 'diese Hilfe'],
  ['home', 'Übersicht (F1)'],
  ['cards [gp1|gp2|ics|eng|all] [--all]', 'Spaced Repetition; --all = alle Karten statt nur fällige (F2)'],
  ['quiz [gp1|gp2|ics|eng|all]', 'Active-Recall-Quiz (F3)'],
  ['course <gp1|gp2|ics|eng>', 'Kursansicht mit Kapiteln, Feynman, PDFs (F4)'],
  ['pin [kapitel-id]', 'Kapitel auf den Spickzettel pinnen / Liste aller Kapitel'],
  ['email [1|2]', 'GPAS Email-Coach (F5)'],
  ['sheet [load gp1|ics|…|all · clear · print]', 'DIN-A4-Spickzettel (F6)'],
  ['pomo [start|stop|reset|switch|status]', 'Pomodoro-Fokus-Timer'],
  ['theme [dark|light]', 'Farbschema (light = Endlospapier)'],
  ['crt [on|off]', 'Scanline/Glow-Effekt'],
  ['stats', 'Kartenstatus, Mastery, Kalibrierung'],
  ['due', 'fällige Karten je Kurs'],
  ['deadlines', 'anstehende Termine'],
  ['export · import · reset', 'Backup & Zurücksetzen'],
  ['sys', 'Methoden, Backup, Tastatur (F7)'],
  ['history · clear', 'Verlauf / Konsole leeren'],
];

const COMMANDS = {
  help: cmdHelp, '?': cmdHelp, man: cmdHelp,
  home: () => { setView('home'); return 'home'; },
  cards: cmdCards, karten: cmdCards, review: cmdCards,
  quiz: cmdQuiz,
  course: cmdCourse, courses: cmdCourse, kurs: cmdCourse, kurse: cmdCourse, cd: cmdCourse,
  pin: cmdPin,
  email: cmdEmail, mail: cmdEmail,
  sheet: cmdSheet,
  pomo: cmdPomo, pomodoro: cmdPomo,
  theme: cmdTheme,
  crt: cmdCrt,
  stats: cmdStats,
  due: cmdDue,
  deadlines: cmdDeadlines, dl: cmdDeadlines,
  export: () => { downloadBackup(); toast('Backup-Datei wird heruntergeladen.'); return 'export: Backup-JSON wird heruntergeladen'; },
  backup: () => COMMANDS.export(),
  import: () => { importInput.click(); return 'import: Dateiauswahl geöffnet'; },
  reset: () => (doReset() ? 'reset: Fortschritt gelöscht' : 'reset: abgebrochen'),
  sys: () => { setView('sys'); return 'sys'; },
  methods: () => { setView('sys'); return 'sys: Methoden'; },
  history: cmdHistoryList,
  clear: () => { consoleLog.innerHTML = ''; closeConsole(); cmdMsg.textContent = ''; return null; },
  cls: () => COMMANDS.clear(),
};

const COMPLETIONS = {
  cards: [...COURSE_SLUGS, 'all', '--all'],
  quiz: [...COURSE_SLUGS, 'all'],
  course: COURSE_SLUGS,
  email: ENGLISH_DATA.emailPrompts.map((_, i) => String(i + 1)),
  sheet: ['load', 'clear', 'print'],
  pomo: ['start', 'stop', 'reset', 'switch', 'status'],
  theme: ['dark', 'light'],
  crt: ['on', 'off'],
  pin: ALL_CHAPTERS.map(ch => ch.id),
};
const PRIMARY_CMDS = ['help', 'home', 'cards', 'quiz', 'course', 'pin', 'email', 'sheet', 'pomo', 'theme', 'crt', 'stats', 'due', 'deadlines', 'export', 'import', 'reset', 'sys', 'history', 'clear'];

function parseCourse(arg, { allowAll = true } = {}) {
  if (arg === undefined) return allowAll ? 'all' : null;
  const id = ALIAS[arg.toLowerCase()];
  if (!id || (!allowAll && id === 'all')) return undefined;
  return id;
}

function cmdHelp(args) {
  if (args[0]) {
    const row = COMMAND_HELP.find(([c]) => c.split(/[ ·]/)[0] === args[0] || c.includes(args[0]));
    if (!row) return `<span class="c-bad">help: kein Eintrag für „${esc(args[0])}"</span>`;
    return `<b class="hl">${esc(row[0])}</b>\n  ${esc(row[1])}`;
  }
  const rows = COMMAND_HELP.map(([c, d]) => `<span class="help-row"><span>${cmdLink(c.split(' ')[0], c)}</span><span class="dim">${esc(d)}</span></span>`).join('');
  return `<b class="hl">studyos</b> — Befehle (klickbar)\n${rows}<span class="dim">Tasten: F1–F7/Alt+1–7 Tabs · : oder / Befehlszeile · ↑↓ Verlauf · Tab vervollständigen · Esc schließen</span>`;
}

function cmdCards(args) {
  const includeAll = args.includes('--all') || args.includes('-a');
  const rest = args.filter(a => a !== '--all' && a !== '-a');
  const course = parseCourse(rest[0]);
  if (course === undefined) return `<span class="c-bad">cards: unbekannter Kurs „${esc(rest[0])}"</span> — erlaubt: ${[...COURSE_SLUGS, 'all'].join(' | ')}`;
  const s = startCards(course, includeAll, { silent: true });
  setView('cards');
  return `cards: ${s.queue.length} ${includeAll ? '' : 'fällige '}Karten · ${course === 'all' ? 'interleaved über alle Kurse' : esc(courseMeta(course).title)}`;
}

function cmdQuiz(args) {
  const course = parseCourse(args[0]);
  if (course === undefined) return `<span class="c-bad">quiz: unbekannter Kurs „${esc(args[0])}"</span> — erlaubt: ${[...COURSE_SLUGS, 'all'].join(' | ')}`;
  const s = startQuiz(course, { silent: true });
  setView('quiz');
  return `quiz: ${s.queue.length} Fragen · ${course === 'all' ? 'interleaved' : esc(courseMeta(course).title)}`;
}

function cmdCourse(args) {
  if (!args[0]) {
    setView('courses');
    return COURSES_META.map(c => `  ${padLink(`course ${c.short.toLowerCase()}`, c.short.toLowerCase(), 5)}${esc(c.title)}`).join('\n');
  }
  const id = parseCourse(args[0], { allowAll: false });
  if (!id) return `<span class="c-bad">course: unbekannter Kurs „${esc(args[0])}"</span> — erlaubt: ${COURSE_SLUGS.join(' | ')}`;
  ui.course.id = id;
  setView('courses');
  return `course: ${esc(courseMeta(id).title)}`;
}

function cmdPin(args) {
  if (!args[0]) {
    const lines = COURSES_META.map(c => {
      const chs = ALL_CHAPTERS.filter(ch => ch.courseId === c.id);
      return `<span class="c-${c.id}">${esc(c.short)}</span>\n` + chs.map(ch => `  ${store.isPinned(ch.cheatSheet.id) ? '<span class="c-ok">[✓]</span>' : '[ ]'} ${padLink(`pin ${ch.id}`, ch.id, 18)}<span class="dim">${esc(ch.title)}</span>`).join('\n');
    });
    return `pin &lt;kapitel-id&gt; — klicke eine ID zum Umschalten:\n${lines.join('\n')}`;
  }
  const ch = chapterById(args[0]);
  if (!ch) return `<span class="c-bad">pin: Kapitel „${esc(args[0])}" nicht gefunden</span> — ${cmdLink('pin', 'pin')} listet alle IDs`;
  const pinned = pinChapter(ch);
  if (ui.view === 'courses' || ui.view === 'sheet') render({ keepScroll: true });
  return `pin: ${esc(ch.cheatSheet.title)} ${pinned ? '<span class="c-ok">gepinnt</span>' : '<span class="c-warn">entfernt</span>'} · ${store.state.pinnedCheatSheet.length} auf dem Spickzettel`;
}

function cmdEmail(args) {
  if (args[0]) {
    const n = Number(args[0]);
    if (!Number.isInteger(n) || n < 1 || n > ENGLISH_DATA.emailPrompts.length) return `<span class="c-bad">email: Szenario 1–${ENGLISH_DATA.emailPrompts.length}</span>`;
    ui.email.idx = n - 1;
  }
  setView('email');
  setTimeout(() => $('#email-editor')?.focus(), 0);
  return `email: Szenario ${ui.email.idx + 1} — ${esc(ENGLISH_DATA.emailPrompts[ui.email.idx].title)}`;
}

function cmdSheet(args) {
  const sub = args[0];
  if (!sub) { setView('sheet'); return `sheet: ${store.state.pinnedCheatSheet.length} Einträge`; }
  if (sub === 'load') {
    const id = parseCourse(args[1] || 'all');
    if (!id) return `<span class="c-bad">sheet load: unbekannter Kurs „${esc(args[1])}"</span>`;
    loadPins(id);
    setView('sheet');
    return `sheet: ${store.state.pinnedCheatSheet.length} Einträge nach load ${esc(slug(id))}`;
  }
  if (sub === 'clear') { clearPins(); setView('sheet'); return 'sheet: geleert'; }
  if (sub === 'print') { setView('sheet'); setTimeout(printSheet, 50); return 'sheet: Druckdialog'; }
  return `<span class="c-bad">sheet: unbekannt „${esc(sub)}"</span> — load &lt;kurs|all&gt; · clear · print`;
}

function cmdPomo(args) {
  const sub = args[0] || 'status';
  if (sub === 'start') { if (!pomo.running) pomo.toggle(); }
  else if (sub === 'stop' || sub === 'pause') { if (pomo.running) pomo.toggle(); }
  else if (sub === 'toggle') pomo.toggle();
  else if (sub === 'reset') pomo.reset();
  else if (sub === 'switch') pomo.switchMode();
  else if (sub !== 'status') return `<span class="c-bad">pomo: unbekannt „${esc(sub)}"</span> — start · stop · reset · switch · status`;
  return `pomo: ${pomo.display} / ${pomo.mode} min · ${pomo.running ? 'läuft' : 'angehalten'}`;
}

function cmdTheme(args) {
  const want = args[0];
  if (want && want !== 'dark' && want !== 'light') return `<span class="c-bad">theme: dark | light</span>`;
  if (!want || want !== store.state.theme) toggleTheme();
  return `theme: ${store.state.theme}`;
}

function cmdCrt(args) {
  const want = args[0];
  if (want && want !== 'on' && want !== 'off') return '<span class="c-bad">crt: on | off</span>';
  setCrt(want ? want === 'on' : !crtEnabled());
  if (ui.view === 'sys') render({ keepScroll: true });
  return `crt: ${crtEnabled() ? 'on' : 'off'}`;
}

function cmdStats() {
  const head = `${'KURS'.padEnd(6)}${'MASTERY'.padEnd(27)}${'NEU'.padStart(5)}${'LERN'.padStart(6)}${'GEM'.padStart(5)}${'FÄLLIG'.padStart(8)}`;
  const rows = COURSES_META.map(c => {
    const st = cardStats(c.id);
    return `<span class="c-${c.id}">${esc(c.short.padEnd(6))}</span>${bar(getCourseMastery(c.id), 22)}${String(st.new).padStart(5)}${String(st.learning).padStart(6)}${String(st.mastered).padStart(5)}${String(getDueCards(c.id).length).padStart(8)}`;
  });
  const cal = calibrationStats();
  const calRows = CONFIDENCE_LEVELS.map(l => {
    const c = cal[l.value];
    return `  ${esc(l.label.padEnd(16))} ${c.n ? `${bar((c.ok / c.n) * 100, 12)} (${c.ok}/${c.n})` : '<span class="dim">keine Daten</span>'}`;
  });
  return `<span class="dim">${head}</span>\n${rows.join('\n')}\n<b>${'Σ'.padEnd(6)}</b>${bar(overallMastery(), 22)}\n\n<b class="hl">kalibrierung</b> (Trefferquote je Sicherheit)\n${calRows.join('\n')}`;
}

function cmdDue() {
  const rows = COURSES_META.map(c => `  ${padLink(`cards ${c.short.toLowerCase()}`, c.short.toLowerCase(), 5)}${String(getDueCards(c.id).length).padStart(3)} fällig`);
  return `${rows.join('\n')}\n  ${padLink('cards all', 'all', 5)}${String(getDueCards('all').length).padStart(3)} fällig (interleaved)`;
}

function cmdDeadlines() {
  const dls = allDeadlines();
  if (!dls.length) return 'deadlines: keine anstehenden Termine';
  return dls.map(d => `  ${formatDate(d.date)}  ${esc(daysLeftLabel(d.daysLeft).padEnd(9))} <span class="c-${d.courseId}">${esc(d.courseShort.padEnd(4))}</span> ${esc(d.label)}${d.urgent ? ' <span class="c-bad">!</span>' : ''}`).join('\n');
}

function cmdHistoryList() {
  if (!cmdHistory.length) return 'history: leer';
  return cmdHistory.slice(-20).map((c, i, arr) => `  ${String(cmdHistory.length - arr.length + i + 1).padStart(3)}  ${cmdLink(c)}`).join('\n');
}

function log(html, { open = false } = {}) {
  const div = document.createElement('div');
  div.className = 'log-out';
  div.innerHTML = html;
  consoleLog.append(div);
  while (consoleLog.childElementCount > 300) consoleLog.firstElementChild.remove();
  consoleLog.scrollTop = consoleLog.scrollHeight;
  if (open) openConsole();
}

function openConsole() { consoleEl.hidden = false; consoleLog.scrollTop = consoleLog.scrollHeight; }
function closeConsole() { consoleEl.hidden = true; }

// Informative Befehle öffnen die Konsole; Navigations-Befehle melden sich nur in der Prompt-Zeile.
const OPENS_CONSOLE = new Set(['help', '?', 'man', 'stats', 'due', 'deadlines', 'dl', 'history']);
const OPENS_CONSOLE_NO_ARGS = new Set(['pin', 'course', 'courses', 'kurs', 'kurse', 'cd']);

function runCommand(raw, { echo = true } = {}) {
  const line = raw.trim();
  if (!line) return;
  const [name0, ...args] = line.split(/\s+/);
  const name = name0.replace(/^:/, '').toLowerCase();
  if (echo) {
    const path = TABS.find(t => t.id === ui.view).path;
    log(`<span class="log-cmd"><span class="prompt-path">${path}</span>$ ${esc(line)}</span>`);
  }
  const fn = COMMANDS[name];
  if (!fn) {
    const near = PRIMARY_CMDS.filter(c => c.startsWith(name[0] || '')).slice(0, 4);
    log(`<span class="c-bad">studyos: Befehl nicht gefunden: ${esc(name)}</span>${near.length ? ` — meintest du ${near.map(c => cmdLink(c)).join(' ')}?` : ''} · ${cmdLink('help')}`, { open: true });
    cmdMsg.textContent = `✗ ${name}: nicht gefunden`;
    cmdMsg.className = 'cmd-msg is-err';
    return;
  }
  const res = fn(args);
  if (res == null) return;
  const opensConsole = OPENS_CONSOLE.has(name) || (OPENS_CONSOLE_NO_ARGS.has(name) && !args[0]);
  const isErr = /class="c-bad"/.test(res);
  log(res, { open: opensConsole || isErr });
  const tmp = document.createElement('div');
  tmp.innerHTML = res;
  const first = (tmp.textContent || '').split('\n')[0].trim();
  cmdMsg.textContent = `${isErr ? '✗' : '→'} ${first}`;
  cmdMsg.className = `cmd-msg${isErr ? ' is-err' : ''}`;
}

function pushHistory(line) {
  if (cmdHistory[cmdHistory.length - 1] !== line) cmdHistory.push(line);
  if (cmdHistory.length > 60) cmdHistory = cmdHistory.slice(-60);
  try { localStorage.setItem(HIST_KEY, JSON.stringify(cmdHistory)); } catch { /* Speicher voll: Verlauf nur in Sitzung */ }
  histPos = cmdHistory.length;
  histDraft = '';
}

$('#cmdform').addEventListener('submit', (e) => {
  e.preventDefault();
  const line = cmdInput.value.trim();
  cmdInput.value = '';
  if (!line) return;
  pushHistory(line);
  runCommand(line, { echo: true });
});

function complete() {
  const val = cmdInput.value;
  const parts = val.replace(/^\s+/, '').split(/\s+/);
  let pool;
  let prefix;
  if (parts.length <= 1) {
    pool = PRIMARY_CMDS;
    prefix = parts[0] || '';
  } else {
    const base = parts[0].toLowerCase();
    if (base === 'sheet' && parts.length === 3 && parts[1] === 'load') pool = [...COURSE_SLUGS, 'all'];
    else if (base === 'help' && parts.length === 2) pool = PRIMARY_CMDS;
    else pool = (parts.length === 2 || base === 'cards') ? COMPLETIONS[base] : null;
    prefix = parts[parts.length - 1];
  }
  if (!pool) return;
  const hits = pool.filter(c => c.startsWith(prefix.toLowerCase()));
  if (!hits.length) { cmdMsg.textContent = '∅ keine Vervollständigung'; cmdMsg.className = 'cmd-msg is-err'; return; }
  let common = hits[0];
  for (const h of hits) { while (!h.startsWith(common)) common = common.slice(0, -1); }
  const head = parts.slice(0, -1).join(' ');
  const done = hits.length === 1 ? `${hits[0]} ` : common;
  cmdInput.value = (head ? `${head} ` : '') + done;
  if (hits.length > 1) {
    cmdMsg.textContent = hits.slice(0, 8).join('  ') + (hits.length > 8 ? ' …' : '');
    cmdMsg.className = 'cmd-msg';
  } else cmdMsg.textContent = '';
}

cmdInput.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    if (!cmdHistory.length) return;
    e.preventDefault();
    if (histPos === cmdHistory.length) histDraft = cmdInput.value;
    histPos = Math.max(0, histPos - 1);
    cmdInput.value = cmdHistory[histPos];
  } else if (e.key === 'ArrowDown') {
    if (histPos >= cmdHistory.length) return;
    e.preventDefault();
    histPos += 1;
    cmdInput.value = histPos === cmdHistory.length ? histDraft : cmdHistory[histPos];
  } else if (e.key === 'Tab' && !e.shiftKey && cmdInput.value.trim()) {
    e.preventDefault();
    complete();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    cmdInput.value = '';
    cmdInput.blur();
    closeConsole();
  } else if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault();
    runCommand('clear', { echo: false });
  }
});

/* =========================================================
   Globale Tastatur
   ========================================================= */

function isTyping(el) {
  if (!el) return false;
  const tagName = el.tagName;
  return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || el.isContentEditable;
}

document.addEventListener('keydown', (e) => {
  const fk = /^F([1-7])$/.exec(e.key);
  if (fk && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
    e.preventDefault();
    setView(TABS[Number(fk[1]) - 1].id);
    return;
  }
  const dg = /^Digit([1-7])$/.exec(e.code);
  if (dg && e.altKey && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    setView(TABS[Number(dg[1]) - 1].id);
    return;
  }
  if (e.target === cmdInput) return;
  if (e.key === 'Escape') {
    if (isTyping(e.target)) e.target.blur();
    closeConsole();
    return;
  }
  if (isTyping(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;

  const onControl = e.target.closest && e.target.closest('button, a, summary, label');
  if (onControl && (e.key === ' ' || e.key === 'Enter')) return; // native Aktivierung des fokussierten Elements

  if (e.key === ':' || e.key === '/') {
    e.preventDefault();
    cmdInput.focus();
    return;
  }
  if (e.key === '?') { e.preventDefault(); runCommand('help'); return; }
  if (e.key === 'p') { e.preventDefault(); pomo.toggle(); return; }

  const k = e.key.toLowerCase();
  if (ui.view === 'home') {
    if (k === 's') { e.preventDefault(); ACTIONS['cards-start']('all'); }
  } else if (ui.view === 'cards') {
    const s = ui.cards;
    if (s.idx >= s.queue.length) {
      if (k === 'a') { e.preventDefault(); ACTIONS['cards-all'](); }
      else if (k === 'q') { e.preventDefault(); ACTIONS['quiz-start'](s.course); }
    } else if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      revealCard();
    } else if (/^[1-4]$/.test(e.key) && s.revealed) {
      e.preventDefault();
      rate(Number(e.key));
    }
  } else if (ui.view === 'quiz') {
    const s = ui.quiz;
    if (s.idx >= s.queue.length) {
      if (k === 'r') { e.preventDefault(); ACTIONS['quiz-restart'](); }
      return;
    }
    const li = LETTERS.indexOf(k);
    if (k.length === 1 && li >= 0 && li < s.queue[s.idx].options.length && !s.result) { e.preventDefault(); quizSelect(li); }
    else if (k === 'g' || k === 'z' || k === 'h') {
      e.preventDefault();
      quizConf(Object.keys(CONF_KEYS).find(v => CONF_KEYS[v] === k));
    } else if (e.key === 'Enter') { e.preventDefault(); if (s.result) quizNext(); else quizSubmit(); }
    else if (k === 'n' && s.result) { e.preventDefault(); quizNext(); }
  } else if (ui.view === 'courses') {
    if (k === 'j' || e.key === ']') { e.preventDefault(); shiftCourse(1); }
    else if (k === 'k' || e.key === '[') { e.preventDefault(); shiftCourse(-1); }
    else if (k === 'c') { e.preventDefault(); ACTIONS['cards-start'](ui.course.id); }
    else if (k === 'q') { e.preventDefault(); ACTIONS['quiz-start'](ui.course.id); }
  }
});

/* =========================================================
   Start
   ========================================================= */

store.subscribe(() => { applyTheme(); updateStatus(); });
applyTheme();
applyCrt();
updateClock();
setInterval(updateClock, 15000);
const initial = location.hash.slice(1);
setView(TABS.some(t => t.id === initial) ? initial : 'home');
log(`<span class="hl">studyos</span> WS26 · ${COURSES_META.length} Kurse · ${ALL_CHAPTERS.length} Kapitel · tippe ${cmdLink('help')} oder drücke <kbd>?</kbd>`);
cmdMsg.textContent = 'tippe help — oder : / zum Fokussieren';
