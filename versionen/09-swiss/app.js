// StudyOS · Swiss Data Cockpit — strict grid, Helvetica, signal red, charts from real progress data.
import {
  COURSES_META, ENGLISH_DATA, DIAGRAMS, store, ALL_DATA, ALL_QUIZZES, ALL_CHAPTERS, ALL_FLASHCARDS,
  courseMeta, escapeHtml as esc, pdfHref, getDueCards, buildFlashcardQueue, rateCard, intervalsFor,
  RATING_LABELS, cardStats, buildQuizQueue, CONFIDENCE_LEVELS, submitQuiz, calibrationStats,
  getCourseMastery, overallMastery, todayProgress, activityHistory, streakLabel, allDeadlines,
  formatDate, daysLeftLabel, getFeynman, saveFeynmanText, toggleFeynmanPoint, togglePinChapter,
  loadCoursePins, clearPins, analyzeEmail, downloadBackup, importBackup, resetProgress, Pomodoro,
} from '../shared/core.js';

const STORE_KEY = 'ws26_lernplattform_v1';
const DRAFT_KEY = 'studyos_09_swiss_email_drafts';
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const view = $('#view');
const indexEl = $('#index');
const CHAPTERS = new Map(ALL_CHAPTERS.map(c => [c.id, c]));
const canHover = matchMedia('(hover: hover)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const SECTIONS = [
  { id: 'uebersicht', n: '01', label: 'Übersicht', short: 'Übersicht' },
  { id: 'karten', n: '02', label: 'Karteikarten', short: 'Karten' },
  { id: 'quiz', n: '03', label: 'Quiz', short: 'Quiz' },
  { id: 'kurse', n: '04', label: 'Kurse', short: 'Kurse' },
  { id: 'email', n: '05', label: 'E-Mail-Coach', short: 'E-Mail' },
  { id: 'spickzettel', n: '06', label: 'Spickzettel', short: 'Spickzettel' },
  { id: 'methode', n: '07', label: 'Methode & Backup', short: 'Methode' },
];

/* ---------- UI state (progress itself lives in the shared store) ---------- */

const freshFc = (course = 'all', includeAll = false) => ({
  course, includeAll, queue: null, revealed: false, done: 0, tally: { 1: 0, 2: 0, 3: 0, 4: 0 },
});
const freshQuiz = (course = 'all') => ({
  course, queue: null, idx: 0, selected: null, confidence: 'medium', result: null, correct: 0, answered: 0,
});

const S = {
  route: { id: 'uebersicht', arg: null },
  range: 14,
  fc: freshFc(),
  quiz: freshQuiz(),
  course: COURSES_META[0].id,
  open: new Set(),
  email: { idx: 0, drafts: loadDrafts() },
};

function loadDrafts() {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}') || {}; } catch { return {}; }
}
function saveDrafts() {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(S.email.drafts)); } catch { /* quota: drafts stay in memory */ }
}

/* ---------- helpers ---------- */

const pad2 = n => String(n).padStart(2, '0');
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
/** Escapes plain text and turns `backticks` into inline code. */
const rich = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
const sq = color => `<i class="sq" style="--c:${color}" aria-hidden="true"></i>`;
const ctag = id => { const m = courseMeta(id); return `<span class="ctag">${sq(m.color)}${esc(m.short)}</span>`; };
const dueCount = c => getDueCards(c).length;
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function todayLong() {
  return new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function toast(msg, kind = '') {
  const box = $('#toasts');
  const t = document.createElement('div');
  t.className = `toast ${kind}`;
  t.textContent = msg;
  box.append(t);
  setTimeout(() => t.classList.add('out'), 3000);
  setTimeout(() => t.remove(), 3400);
}

function vhead(n, title, sub, extra = '') {
  return `<header class="vhead">
    <span class="vnum" aria-hidden="true">${n}</span>
    <div class="vtitle"><h1>${title}</h1><p>${sub}</p></div>
    ${extra}
  </header>`;
}

function mod(key, title, body, { span = 6, tools = '', cls = '' } = {}) {
  return `<section class="mod span${span} ${cls}" aria-labelledby="m-${key}">
    <header class="mod-h"><span class="mod-k">${key}</span><h2 id="m-${key}">${title}</h2>${tools}</header>
    ${body}
  </section>`;
}

const tipHint = (kind = 'einen Balken') => `${canHover.matches ? 'Zeige auf' : 'Tippe auf'} ${kind} für den Wert.`;
const readout = (kind = 'einen Balken') => `<p class="readout" data-readout data-kind="${kind}" aria-live="polite">${tipHint(kind)}</p>`;

/* ---------- theme ---------- */

function applyTheme() {
  const t = store.state.theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = t;
  for (const m of $$('meta[name="theme-color"]')) m.content = t === 'dark' ? '#0b0b0b' : '#ffffff';
  $('.theme-btn').dataset.mode = t;
}

/* ---------- navigation ---------- */

function renderNav() {
  $('#sections').innerHTML = `<ol>${SECTIONS.map(s => `
    <li><a href="#/${s.id}" data-sec="${s.id}">
      <span class="sec-n">${s.n}</span>
      <span class="sec-l"><span class="sec-full">${s.label}</span><span class="sec-short">${s.short}</span></span>
      <span class="sec-c" data-count="${s.id}"></span>
    </a></li>`).join('')}</ol>`;
}

function updateNav() {
  const due = dueCount('all');
  const pins = store.state.pinnedCheatSheet.length;
  for (const a of $$('#sections a')) {
    const on = a.dataset.sec === S.route.id;
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  }
  const set = (id, n, label) => {
    const el = $(`[data-count="${id}"]`);
    el.textContent = n ? String(n) : '';
    el.setAttribute('aria-label', n ? label : '');
  };
  set('karten', due, `${due} fällig`);
  set('spickzettel', pins, `${pins} angeheftet`);
}

function centerActiveTab() {
  const nav = $('#sections');
  const a = $('#sections a[aria-current]');
  if (!a || nav.scrollWidth <= nav.clientWidth) return;
  nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.offsetWidth / 2, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
}

function parseHash() {
  const [id, arg] = location.hash.replace(/^#\/?/, '').split('/');
  return SECTIONS.some(s => s.id === id) ? { id, arg: arg || null } : { id: 'uebersicht', arg: null };
}

function go(id, arg = null) {
  const h = `#/${id}${arg ? '/' + arg : ''}`;
  if (location.hash === h) render(); else location.hash = h;
}

/* ---------- render ---------- */

const VIEWS = {
  uebersicht: vOverview, karten: vCards, quiz: vQuiz, kurse: vCourses,
  email: vEmail, spickzettel: vSheet, methode: vMethods,
};

function render(focusSel) {
  S.route = parseHash();
  if (S.route.id === 'kurse' && COURSES_META.some(c => c.id === S.route.arg)) S.course = S.route.arg;
  view.dataset.view = S.route.id;
  view.innerHTML = VIEWS[S.route.id]();
  drawCharts(true);
  if (S.route.id === 'email') updateEmailFeedback();
  document.body.classList.toggle('has-bar', !!$('.actionbar', view));
  updateNav();
  document.title = `${SECTIONS.find(s => s.id === S.route.id).label} · StudyOS 09`;
  if (focusSel) $(focusSel, view)?.focus({ preventScroll: true });
}

/* =========================================================
   01 · Übersicht
   ========================================================= */

function vOverview() {
  const due = dueCount('all');
  const tp = todayProgress();
  const om = overallMastery();
  const deadlines = allDeadlines();
  const next = deadlines[0];
  const coursesWithDue = COURSES_META.filter(c => dueCount(c.id) > 0).length;

  const kpis = `<div class="kpis span12">
    <div class="kpi"><span class="label">Fällig</span><span class="kpi-n ${due ? 'is-red' : ''}">${due}</span>
      <span class="kpi-s">${due ? `Karten aus ${plural(coursesWithDue, 'Kurs', 'Kursen')}` : 'Alles wiederholt'}</span></div>
    <div class="kpi"><span class="label">Heute</span><span class="kpi-n">${tp.done}<small>/${tp.goal}</small></span>
      <span class="meter" role="img" aria-label="Tagesziel ${tp.pct} %"><i style="width:${tp.pct}%"></i></span>
      <span class="kpi-s">${tp.reviews} Karten · ${tp.quizzes} Quiz · ${tp.minutes} Min Fokus</span></div>
    <div class="kpi"><span class="label">Serie</span><span class="kpi-n">${store.state.streak.count}</span>
      <span class="kpi-s">${streakLabel()} in Folge gelernt</span></div>
    <div class="kpi"><span class="label">Beherrschung</span><span class="kpi-n">${om}<small>%</small></span>
      <span class="kpi-s">Ø über ${COURSES_META.length} Kurse</span></div>
  </div>`;

  const start = `<div class="start span12">
    <button class="start-btn" type="button" data-act="start-mixed">
      <span class="start-k">→</span>
      <span class="start-t">Gemischte Session starten</span>
      <span class="start-s">${due ? `${plural(due, 'fällige Karte', 'fällige Karten')}, interleaved über alle Kurse` : 'Keine fälligen Karten – freies Üben aller Karten'}</span>
    </button>
    ${next ? `<a class="start-next" href="#/kurse/${next.courseId}">
      <span class="label">Nächste Frist</span>
      <span class="start-next-d">${daysLeftLabel(next.daysLeft)}</span>
      <span class="start-next-l">${ctag(next.courseId)} ${esc(next.label)}</span></a>` : ''}
  </div>`;

  const status = mod('A', 'Kartenstatus je Kurs', `
    <div class="chart" data-chart="status"></div>
    ${legend([['mastered', 'Gefestigt (≥ 14 T)'], ['learning', 'In Arbeit'], ['due', 'Fällig'], ['new', 'Neu']])}
    ${readout()}`, { span: 7 });

  const mastery = mod('B', 'Beherrschung', `<ul class="mastery">${COURSES_META.map(c => {
    const m = getCourseMastery(c.id);
    const d = dueCount(c.id);
    return `<li>
      <a class="m-row" href="#/kurse/${c.id}">
        <span class="m-name">${sq(c.color)}<b>${esc(c.short)}</b><span class="m-title">${esc(c.title)}</span></span>
        <span class="m-pct">${m}<small>%</small></span>
        <span class="m-bar" role="img" aria-label="${esc(c.short)} ${m} Prozent"><i style="width:${m}%;background:${c.color}"></i></span>
      </a>
      <div class="m-acts">
        <button class="link" type="button" data-act="learn" data-course="${c.id}">Karten${d ? ` · <b class="red">${d} fällig</b>` : ''}</button>
        <button class="link" type="button" data-act="quiz-course" data-course="${c.id}">Quiz</button>
      </div>
    </li>`;
  }).join('')}</ul>`, { span: 5 });

  const rangeBtns = `<div class="seg seg-sm" role="group" aria-label="Zeitraum">${[7, 14, 28].map(n =>
    `<button type="button" data-act="range" data-n="${n}" aria-pressed="${S.range === n}">${n} T</button>`).join('')}</div>`;
  const hist = activityHistory(S.range);
  const sum = hist.reduce((a, d) => a + d.total, 0);
  const mins = hist.reduce((a, d) => a + d.minutes, 0);
  const active = hist.filter(d => d.total > 0 || d.minutes > 0).length;
  const activity = mod('C', 'Aktivität', `
    <div class="chart" data-chart="activity"></div>
    ${legend([['ink', 'Karten'], ['mid', 'Quizfragen'], ['red-line', 'Heute']])}
    <dl class="facts">
      <div><dt>Summe</dt><dd>${sum}</dd></div>
      <div><dt>Ø / Tag</dt><dd>${(sum / S.range).toFixed(1).replace('.', ',')}</dd></div>
      <div><dt>Aktive Tage</dt><dd>${active}<small>/${S.range}</small></dd></div>
      <div><dt>Fokus</dt><dd>${mins}<small> Min</small></dd></div>
    </dl>
    ${readout()}`, { span: 7, tools: rangeBtns });

  const calib = mod('D', 'Kalibrierung', `
    <div class="chart" data-chart="calib"></div>
    ${legend([['ink', 'Trefferquote'], ['red-line', 'Soll (gut kalibriert)']])}
    <p class="note">${calibVerdict()}</p>
    ${readout()}`, { span: 5 });

  const dl = mod('E', 'Fristen', deadlines.length ? `
    <div class="chart" data-chart="timeline"></div>
    ${readout('einen Marker')}
    <ol class="dl-list">${deadlines.map((d, i) => `
      <li id="dl-${i}" class="${d.urgent ? 'is-urgent' : ''}">
        <span class="dl-n">${pad2(i + 1)}</span>
        <span class="dl-date">${formatDate(d.date)}</span>
        <span class="dl-left">${daysLeftLabel(d.daysLeft)}</span>
        <span class="dl-c">${ctag(d.courseId)}</span>
        <span class="dl-label">${esc(d.label)}${d.urgent ? ' <b class="flag">dringend</b>' : ''}</span>
      </li>`).join('')}</ol>` : '<p class="note">Keine anstehenden Fristen.</p>', { span: 12 });

  return `${vhead('01', 'Übersicht', esc(todayLong()))}
    <div class="grid12">${kpis}${start}${status}${mastery}${activity}${calib}${dl}</div>`;
}

function legend(items) {
  return `<ul class="legend">${items.map(([k, l]) => `<li><i class="lg lg-${k}" aria-hidden="true"></i>${l}</li>`).join('')}</ul>`;
}

const CALIB_SOLL = { low: 25, medium: 75, high: 100 };

function calibVerdict() {
  const c = calibrationStats();
  const n = c.low.n + c.medium.n + c.high.n;
  if (!n) return 'Noch keine Quizantworten. Gib im Quiz bei jeder Antwort deine Sicherheit an – hier erscheint dann, wie gut Gefühl und Trefferquote übereinstimmen.';
  if (c.high.n) {
    const a = pct(c.high.ok, c.high.n);
    if (a < 85) return `<b class="red">Überschätzung:</b> Bei „100 % sicher“ nur ${a} % richtig (${c.high.ok}/${c.high.n}). Diese Fragen gezielt wiederholen.`;
    return `Gut kalibriert: Bei „100 % sicher“ ${a} % richtig (${c.high.ok}/${c.high.n}).`;
  }
  return `${plural(n, 'Antwort', 'Antworten')} ausgewertet. Noch keine Antwort mit „100 % sicher“.`;
}

/* ---------- charts (inline SVG at the container's real pixel width) ---------- */

const CHARTS = { status: chartStatus, activity: chartActivity, calib: chartCalib, timeline: chartTimeline };

function drawCharts(force = false) {
  for (const el of $$('[data-chart]', view)) {
    const w = Math.floor(el.clientWidth);
    if (!w || (!force && Number(el.dataset.w) === w)) continue;
    el.dataset.w = String(w);
    el.innerHTML = CHARTS[el.dataset.chart](w, el);
  }
}

function svg(w, h, body, label) {
  return `<svg class="c-svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">${body}</svg>`;
}

function niceMax(v) {
  const p = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= v) return m * p;
  return 10 * p;
}

function chartStatus(w, el) {
  const only = el.dataset.only;
  const rows = only
    ? [{ id: only, label: courseMeta(only).short, color: courseMeta(only).color }]
    : [{ id: 'all', label: 'Alle', color: null }, ...COURSES_META.map(c => ({ id: c.id, label: c.short, color: c.color }))];
  const segs = [['mastered', 'Gefestigt'], ['learning', 'In Arbeit'], ['due', 'Fällig'], ['new', 'Neu']];
  const lab = only ? 0 : 54;
  const right = 30;
  const rh = only ? 26 : 22;
  const gap = 14;
  const bw = w - lab - right;
  let y = 2;
  let out = '';
  rows.forEach((r, ri) => {
    const st = cardStats(r.id);
    if (!only) {
      out += r.color
        ? `<rect x="0" y="${y + 6}" width="10" height="10" fill="${r.color}"/>`
        : `<rect x="0" y="${y + 6}" width="10" height="10" class="c-ink"/>`;
      out += `<text x="16" y="${y + 15}" class="c-tb">${esc(r.label)}</text>`;
    }
    let x = lab;
    for (const [k, l] of segs) {
      const v = st[k];
      if (!v) continue;
      const sw = (v / st.total) * bw;
      out += `<rect x="${x.toFixed(1)}" y="${y}" width="${Math.max(1, sw - 1).toFixed(1)}" height="${rh}" class="c-${k}" tabindex="0"
        data-tip="${esc(`${r.label} · ${l}: ${v} von ${st.total} Karten (${pct(v, st.total)} %)`)}"/>`;
      if (sw > 24) out += `<text x="${(x + 6).toFixed(1)}" y="${y + rh / 2 + 4}" class="c-in c-in-${k}" pointer-events="none">${v}</text>`;
      x += sw;
    }
    out += `<text x="${w}" y="${y + rh / 2 + 4}" text-anchor="end" class="c-t">${st.total}</text>`;
    y += rh + gap;
    if (!only && ri === 0) { out += `<line x1="0" x2="${w}" y1="${y - gap / 2}" y2="${y - gap / 2}" class="c-axis"/>`; y += 4; }
  });
  return svg(w, y - gap + 4, out, `Kartenstatus ${only ? courseMeta(only).short : 'je Kurs'}`);
}

function chartActivity(w) {
  const days = activityHistory(S.range);
  const n = days.length;
  const max = niceMax(Math.max(4, ...days.map(d => d.total)));
  const axisL = 28;
  const top = 8;
  const twoLine = n === 7;
  const bottom = twoLine ? 34 : 22;
  const ch = w < 520 ? 130 : 170;
  const h = top + ch + bottom;
  const slot = (w - axisL) / n;
  const bw = Math.max(3, Math.min(30, slot * 0.62));
  const yOf = v => top + ch - (v / max) * ch;
  let out = '';
  for (const g of [0, max / 2, max]) {
    out += `<line x1="${axisL}" x2="${w}" y1="${yOf(g)}" y2="${yOf(g)}" class="${g ? 'c-grid' : 'c-axis'}"/>`;
    out += `<text x="0" y="${yOf(g) + 4}" class="c-t">${Number.isInteger(g) ? g : g.toFixed(1).replace('.', ',')}</text>`;
  }
  const every = n <= 7 ? 1 : n <= 14 ? (slot < 34 ? 2 : 1) : 7;
  days.forEach((d, i) => {
    const x = axisL + i * slot + (slot - bw) / 2;
    const rH = (d.reviews / max) * ch;
    const qH = (d.quizzes / max) * ch;
    const isToday = i === n - 1;
    if (d.reviews) out += `<rect x="${x.toFixed(1)}" y="${(top + ch - rH).toFixed(1)}" width="${bw.toFixed(1)}" height="${rH.toFixed(1)}" class="c-ink"/>`;
    if (d.quizzes) out += `<rect x="${x.toFixed(1)}" y="${(top + ch - rH - qH).toFixed(1)}" width="${bw.toFixed(1)}" height="${qH.toFixed(1)}" class="c-mid"/>`;
    if (isToday) out += `<rect x="${x.toFixed(1)}" y="${top + ch + 1}" width="${bw.toFixed(1)}" height="3" class="c-red"/>`;
    if ((n - 1 - i) % every === 0) {
      const cx = (x + bw / 2).toFixed(1);
      const cls = isToday ? 'c-t c-today' : 'c-t';
      out += twoLine
        ? `<text x="${cx}" y="${top + ch + 16}" text-anchor="middle" class="${cls} c-b">${d.weekday}</text><text x="${cx}" y="${top + ch + 29}" text-anchor="middle" class="${cls}">${d.label}</text>`
        : `<text x="${cx}" y="${top + ch + 17}" text-anchor="middle" class="${cls}">${d.label}</text>`;
    }
    const tip = `${d.weekday} ${d.label}${isToday ? ' (heute)' : ''} — ${plural(d.reviews, 'Karte', 'Karten')}, ${plural(d.quizzes, 'Quizfrage', 'Quizfragen')}, ${d.minutes} Min Fokus`;
    out += `<rect x="${(axisL + i * slot).toFixed(1)}" y="${top}" width="${slot.toFixed(1)}" height="${ch + bottom - 4}" class="c-hit" tabindex="0" data-tip="${esc(tip)}"/>`;
  });
  return svg(w, h, out, `Aktivität der letzten ${n} Tage`);
}

function chartCalib(w) {
  const c = calibrationStats();
  const axisL = 34;
  const top = 10;
  const ch = w < 420 ? 130 : 150;
  const bottom = 38;
  const h = top + ch + bottom;
  const slot = (w - axisL) / 3;
  const bw = Math.min(56, slot * 0.46);
  const yOf = v => top + ch - (v / 100) * ch;
  let out = '';
  for (const g of [0, 50, 100]) {
    out += `<line x1="${axisL}" x2="${w}" y1="${yOf(g)}" y2="${yOf(g)}" class="${g ? 'c-grid' : 'c-axis'}"/>`;
    out += `<text x="0" y="${yOf(g) + 4}" class="c-t">${g}%</text>`;
  }
  CONFIDENCE_LEVELS.forEach((lvl, i) => {
    const s = c[lvl.value];
    const cx = axisL + i * slot + slot / 2;
    const x = cx - bw / 2;
    const soll = CALIB_SOLL[lvl.value];
    const acc = s.n ? pct(s.ok, s.n) : null;
    if (acc !== null) {
      const bh = (acc / 100) * ch;
      out += `<rect x="${x.toFixed(1)}" y="${(top + ch - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(1, bh).toFixed(1)}" class="c-ink"/>`;
      const inside = bh > ch - 20;
      out += `<text x="${cx.toFixed(1)}" y="${(inside ? top + ch - bh + 16 : top + ch - bh - 6).toFixed(1)}" text-anchor="middle" class="c-tb ${inside ? 'c-on' : ''}">${acc}%</text>`;
    } else {
      out += `<text x="${cx.toFixed(1)}" y="${top + ch - 8}" text-anchor="middle" class="c-t">–</text>`;
    }
    out += `<line x1="${(cx - bw / 2 - 8).toFixed(1)}" x2="${(cx + bw / 2 + 8).toFixed(1)}" y1="${yOf(soll)}" y2="${yOf(soll)}" class="c-soll"/>`;
    out += `<text x="${cx.toFixed(1)}" y="${top + ch + 16}" text-anchor="middle" class="c-t c-b">${esc(lvl.label)}</text>`;
    out += `<text x="${cx.toFixed(1)}" y="${top + ch + 30}" text-anchor="middle" class="c-t">n = ${s.n}</text>`;
    const tip = s.n
      ? `${lvl.label}: ${s.ok} von ${s.n} richtig (${acc} %) · Soll ≈ ${soll} %`
      : `${lvl.label}: noch keine Antworten · Soll ≈ ${soll} %`;
    out += `<rect x="${(axisL + i * slot).toFixed(1)}" y="${top}" width="${slot.toFixed(1)}" height="${ch + bottom - 4}" class="c-hit" tabindex="0" data-tip="${esc(tip)}"/>`;
  });
  return svg(w, h, out, 'Kalibrierung: Trefferquote je Sicherheitsstufe');
}

function chartTimeline(w) {
  const items = allDeadlines();
  const day = 86400000;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const start = today.getTime() - 2 * day;
  const lastD = new Date(items[items.length - 1].date + 'T00:00:00').getTime();
  const end = Math.max(lastD + 5 * day, start + 30 * day);
  const L = 12, R = 14;
  const xOf = t => L + ((t - start) / (end - start)) * (w - L - R);
  const r = 11;
  const minGap = 2 * r + 4;
  const levelX = [];
  const placed = items.map((d, i) => {
    const x = xOf(new Date(d.date + 'T00:00:00').getTime());
    let lvl = 0;
    while (levelX[lvl] !== undefined && x - levelX[lvl] < minGap) lvl++;
    levelX[lvl] = x;
    return { d, i, x, lvl };
  });
  const levels = Math.max(1, levelX.length);
  const top = 22;
  const axisY = top + levels * 26 + 14;
  const h = axisY + 30;
  let out = `<line x1="0" x2="${w}" y1="${axisY}" y2="${axisY}" class="c-axis c-axis-b"/>`;
  // month ticks
  const m = new Date(start); m.setDate(1); m.setMonth(m.getMonth() + 1);
  const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  while (m.getTime() < end) {
    const x = xOf(m.getTime());
    out += `<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${axisY}" y2="${axisY + 7}" class="c-axis"/>`;
    const lbl = MONTHS[m.getMonth()] + (m.getMonth() === 0 ? ` ’${String(m.getFullYear()).slice(2)}` : '');
    out += `<text x="${(x + 4).toFixed(1)}" y="${axisY + 20}" class="c-t">${lbl}</text>`;
    m.setMonth(m.getMonth() + 1);
  }
  const tx = xOf(today.getTime());
  out += `<line x1="${tx.toFixed(1)}" x2="${tx.toFixed(1)}" y1="4" y2="${axisY + 7}" class="c-today-line"/>`;
  out += `<text x="${(tx + 5).toFixed(1)}" y="13" class="c-today c-b">Heute</text>`;
  for (const p of placed) {
    const cy = axisY - 18 - p.lvl * 26;
    out += `<line x1="${p.x.toFixed(1)}" x2="${p.x.toFixed(1)}" y1="${cy + r}" y2="${axisY}" class="c-stem"/>`;
    out += `<g class="c-mark" tabindex="0" data-dl="${p.i}" data-tip="${esc(`${pad2(p.i + 1)} · ${formatDate(p.d.date)} (${daysLeftLabel(p.d.daysLeft)}) · ${p.d.courseShort} · ${p.d.label}`)}">
      <circle cx="${p.x.toFixed(1)}" cy="${cy}" r="${r}" fill="${p.d.color}"/>
      <text x="${p.x.toFixed(1)}" y="${cy + 3.5}" text-anchor="middle" class="c-mark-t">${p.i + 1}</text>
    </g>`;
  }
  return svg(w, h, out, 'Zeitachse der Fristen');
}

function showTip(el) {
  const modEl = el.closest('.mod, .ctx-block');
  const ro = modEl && $('[data-readout]', modEl);
  if (!ro) return;
  $$('.is-active', modEl).forEach(x => x.classList.remove('is-active'));
  el.classList.add('is-active');
  ro.textContent = el.dataset.tip;
  ro.classList.add('is-set');
  $$('.dl-list li.is-hl', view).forEach(x => x.classList.remove('is-hl'));
  if (el.dataset.dl !== undefined) $(`#dl-${el.dataset.dl}`)?.classList.add('is-hl');
}

/* =========================================================
   02 · Karteikarten
   ========================================================= */

function courseFilter(act, current, countFn, countLabel) {
  const opts = [{ id: 'all', short: 'Alle', note: 'gemischt' }, ...COURSES_META.map(c => ({ id: c.id, short: c.short, color: c.color }))];
  return `<div class="filter" role="group" aria-label="Kursfilter">${opts.map(o => {
    const n = countFn(o.id);
    return `<button type="button" class="f-btn" data-act="${act}" data-course="${o.id}" aria-pressed="${o.id === current}">
      ${o.color ? sq(o.color) : ''}<span class="f-l">${o.short}${o.note ? ` <small>${o.note}</small>` : ''}</span>
      <span class="f-n" aria-label="${n} ${countLabel}">${n}</span>
    </button>`;
  }).join('')}</div>`;
}

function ensureFcQueue() {
  if (!S.fc.queue) S.fc.queue = buildFlashcardQueue(S.fc.course, S.fc.includeAll);
}

function vCards() {
  ensureFcQueue();
  const f = S.fc;
  const card = f.queue[0];
  const filter = courseFilter('fc-filter', f.course, c => dueCount(c), 'fällig');
  let main;
  if (card) {
    const ch = CHAPTERS.get(card.chapterId);
    const total = f.done + f.queue.length;
    main = `<article class="fc" aria-labelledby="fc-front">
      <div class="meta-row">
        <span class="idx"><b>${pad2(f.done + 1)}</b>/${pad2(total)}</span>
        ${ctag(card.courseId)}
        ${card.examRelevant ? '<span class="flag">Klausurrelevant</span>' : ''}
        ${ch ? `<span class="meta-ch">${esc(ch.title)}</span>` : ''}
      </div>
      <div class="progress-rule" aria-hidden="true"><i style="width:${pct(f.done, total)}%"></i></div>
      <p class="label">Frage</p>
      <div class="fc-front" id="fc-front">${rich(card.front)}</div>
      ${f.revealed ? `<div class="fc-back"><p class="label">Antwort</p><div class="fc-back-t">${rich(card.back)}</div></div>` : ''}
    </article>
    <div class="actionbar">${f.revealed ? rateButtons(card) : `
      <button class="btn btn-primary btn-xl" type="button" data-act="reveal">Antwort zeigen <kbd class="kbd-only">Leertaste</kbd></button>`}
    </div>`;
  } else {
    main = `<div class="empty">
      <p class="empty-n">${f.done ? f.done : '0'}</p>
      <h2>${f.done ? 'Runde abgeschlossen.' : 'Nichts fällig.'}</h2>
      <p>${f.done ? `${plural(f.done, 'Bewertung', 'Bewertungen')} in dieser Runde. Die nächsten Wiederholungen plant SM-2 automatisch.` : 'Alle Karten in diesem Filter sind für heute wiederholt. Freiwillig weiterüben oder ins Quiz wechseln.'}</p>
      <div class="row">
        <button class="btn btn-primary" type="button" data-act="fc-all">Alle Karten nochmal üben</button>
        <a class="btn" href="#/quiz">Zum Quiz →</a>
      </div>
    </div>`;
  }

  const t = f.tally;
  const rated = t[1] + t[2] + t[3] + t[4];
  const maxT = Math.max(1, t[1], t[2], t[3], t[4]);
  const ctx = `
    <section class="ctx-block">
      <h3 class="label">Diese Runde</h3>
      <dl class="facts facts-2">
        <div><dt>Bewertet</dt><dd>${rated}</dd></div>
        <div><dt>Verbleibend</dt><dd>${f.queue.length}</dd></div>
      </dl>
      <ul class="tally">${RATING_LABELS.map(r => `
        <li><span class="tally-l">${r.key} ${r.label}</span><span class="tally-b"><i class="${r.value === 1 ? 'red' : ''}" style="width:${pct(t[r.value], maxT)}%"></i></span><span class="tally-n">${t[r.value]}</span></li>`).join('')}
      </ul>
    </section>
    <section class="ctx-block">
      <h3 class="label">Status · ${f.course === 'all' ? 'Alle Kurse' : esc(courseMeta(f.course).short)}</h3>
      ${f.course === 'all' ? '<div class="chart" data-chart="status"></div>' : `<div class="chart" data-chart="status" data-only="${f.course}"></div>`}
      ${legend([['mastered', 'Gefestigt'], ['learning', 'In Arbeit'], ['due', 'Fällig'], ['new', 'Neu']])}
      ${readout()}
    </section>
    <section class="ctx-block kbd-only">
      <h3 class="label">Tastatur</h3>
      <ul class="keys"><li><kbd>Leertaste</kbd> Antwort zeigen</li><li><kbd>1</kbd>–<kbd>4</kbd> Bewerten</li><li><kbd>⌥</kbd><kbd>3</kbd> Zum Quiz</li></ul>
    </section>`;

  return `${vhead('02', 'Karteikarten', `Spaced Repetition (SM-2) · ${f.course === 'all' ? 'interleaved über alle Kurse' : esc(courseMeta(f.course).title)}${f.includeAll ? ' · freies Üben' : ''}`)}
    ${filter}
    <div class="split"><div class="primary">${main}</div><aside class="ctx" aria-label="Kontext">${ctx}</aside></div>`;
}

function rateButtons(card) {
  const iv = intervalsFor(card);
  return `<div class="rate" role="group" aria-label="Wie gut wusstest du es?">${RATING_LABELS.map(r => `
    <button type="button" class="rbtn rbtn-${r.value}" data-act="rate" data-r="${r.value}">
      <span class="rk kbd-only">${r.key}</span><span class="rl">${r.label}</span><span class="ri">${iv[r.value]}</span>
    </button>`).join('')}</div>`;
}

function reveal() {
  S.fc.revealed = true;
  render('[data-act="rate"][data-r="3"]');
}

function doRate(r) {
  const f = S.fc;
  const card = f.queue.shift();
  if (!card) return;
  const again = rateCard(card, r);
  f.done += 1;
  f.tally[r] += 1;
  f.revealed = false;
  if (again) {
    f.queue.push(card);
    toast('Nochmal: Die Karte kommt am Ende dieser Runde wieder.');
  }
  render('[data-act="reveal"]');
  scrollToTop();
}

function scrollToTop() {
  if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
}

/* =========================================================
   03 · Quiz
   ========================================================= */

function ensureQuiz() {
  if (!S.quiz.queue) S.quiz.queue = buildQuizQueue(S.quiz.course);
}

function vQuiz() {
  ensureQuiz();
  const z = S.quiz;
  const q = z.queue[z.idx];
  const filter = courseFilter('quiz-filter', z.course, c => (c === 'all' ? ALL_QUIZZES.length : ALL_QUIZZES.filter(x => x.courseId === c).length), 'Fragen');
  let main;
  if (q) {
    const res = z.result;
    main = `<article class="qz">
      <div class="meta-row">
        <span class="idx"><b>${pad2(z.idx + 1)}</b>/${pad2(z.queue.length)}</span>
        ${ctag(q.courseId)}
        ${q.examStyle ? `<span class="flag flag-ink">${esc(q.examStyle)}</span>` : ''}
      </div>
      <div class="progress-rule" aria-hidden="true"><i style="width:${pct(z.idx, z.queue.length)}%"></i></div>
      <h2 class="qz-q">${rich(q.question)}</h2>
      ${q.code ? `<pre class="code" tabindex="0" aria-label="Code"><code>${esc(q.code)}</code></pre>` : ''}
      <ol class="opts" role="radiogroup" aria-label="Antwortmöglichkeiten">${q.options.map((o, i) => {
        let cls = '';
        let mark = '';
        if (res) {
          if (i === q.answer) { cls = 'is-correct'; mark = 'Richtig'; }
          else if (i === z.selected) { cls = 'is-wrong'; mark = 'Deine Wahl'; }
          else cls = 'is-dim';
        } else if (i === z.selected) cls = 'is-sel';
        return `<li><button type="button" class="opt ${cls}" data-act="opt" data-i="${i}" role="radio" aria-checked="${i === z.selected}" ${res ? 'aria-disabled="true"' : ''}>
          <span class="opt-k">${LETTERS[i]}</span><span class="opt-t">${rich(o)}</span>${mark ? `<span class="opt-m">${mark}</span>` : ''}
        </button></li>`;
      }).join('')}</ol>
      ${res ? feedback(q, res) : `
        <div class="conf">
          <p class="label" id="conf-l">Wie sicher bist du?</p>
          <div class="seg" role="radiogroup" aria-labelledby="conf-l">${CONFIDENCE_LEVELS.map(c => `
            <button type="button" role="radio" data-act="conf" data-c="${c.value}" aria-checked="${z.confidence === c.value}" aria-pressed="${z.confidence === c.value}">${c.label}</button>`).join('')}
          </div>
        </div>`}
    </article>
    <div class="actionbar">${res
      ? `<button class="btn btn-primary btn-xl" type="button" data-act="next">${z.idx + 1 >= z.queue.length ? 'Auswertung' : 'Nächste Frage'} → <kbd class="kbd-only">↵</kbd></button>`
      : `<button class="btn btn-primary btn-xl" type="button" data-act="submit" ${z.selected === null ? 'disabled' : ''}>Antwort prüfen <kbd class="kbd-only">↵</kbd></button>`}
    </div>`;
  } else {
    main = `<div class="empty">
      <p class="empty-n">${z.correct}<small>/${z.answered}</small></p>
      <h2>Quiz beendet.</h2>
      <p>${z.answered ? `${pct(z.correct, z.answered)} % richtig. Falsch beantwortete Fragen tauchen in der Kalibrierung und Beherrschung auf.` : 'Keine Fragen beantwortet.'}</p>
      <div class="row">
        <button class="btn btn-primary" type="button" data-act="quiz-restart">Neu starten</button>
        <a class="btn" href="#/karten">Zu den Karten →</a>
      </div>
    </div>`;
  }
  const ctx = `
    <section class="ctx-block">
      <h3 class="label">Diese Runde</h3>
      <dl class="facts facts-2">
        <div><dt>Richtig</dt><dd>${z.correct}<small>/${z.answered}</small></dd></div>
        <div><dt>Quote</dt><dd>${z.answered ? pct(z.correct, z.answered) : '–'}<small>${z.answered ? '%' : ''}</small></dd></div>
      </dl>
    </section>
    <section class="ctx-block">
      <h3 class="label">Kalibrierung · alle Antworten</h3>
      <div class="chart" data-chart="calib"></div>
      ${legend([['ink', 'Trefferquote'], ['red-line', 'Soll']])}
      ${readout()}
    </section>
    <section class="ctx-block kbd-only">
      <h3 class="label">Tastatur</h3>
      <ul class="keys"><li><kbd>1</kbd>–<kbd>4</kbd> / <kbd>A</kbd>–<kbd>D</kbd> Antwort wählen</li><li><kbd>↵</kbd> Prüfen / Weiter</li></ul>
    </section>`;
  return `${vhead('03', 'Quiz', 'Active Recall mit Sicherheitsangabe · Hypercorrection')}
    ${filter}
    <div class="split"><div class="primary">${main}</div><aside class="ctx" aria-label="Kontext">${ctx}</aside></div>`;
}

function feedback(q, res) {
  return `<div class="fb ${res.correct ? 'is-ok' : 'is-bad'}" role="status">
    <p class="fb-h">${res.correct ? 'Richtig.' : 'Falsch.'} <span>Lösung: ${LETTERS[q.answer]}</span></p>
    ${res.overconfident ? `<div class="warn"><p class="label">Hypercorrection</p>
      <p>Du warst <b>100 % sicher</b> – und lagst falsch. Genau solche Irrtümer korrigiert das Gedächtnis besonders nachhaltig, wenn du die Erklärung jetzt bewusst liest und in eigenen Worten wiederholst.</p></div>` : ''}
    <p class="label">Erklärung</p>
    <p class="fb-x">${rich(q.explanation)}</p>
  </div>`;
}

function selectOpt(i) {
  const z = S.quiz;
  if (z.result) return;
  z.selected = i;
  render(`[data-act="opt"][data-i="${i}"]`);
}

function submitCurrent() {
  const z = S.quiz;
  const q = z.queue[z.idx];
  if (!q || z.result || z.selected === null) return;
  z.result = submitQuiz(q, z.selected, z.confidence);
  z.answered += 1;
  if (z.result.correct) z.correct += 1;
  render('[data-act="next"]');
  $('.fb', view)?.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
}

function nextQuestion() {
  const z = S.quiz;
  z.idx += 1;
  z.selected = null;
  z.result = null;
  z.confidence = 'medium';
  render();
  scrollToTop();
}

/* =========================================================
   04 · Kurse
   ========================================================= */

function vCourses() {
  const c = courseMeta(S.course);
  const chapters = ALL_DATA[c.id].chapters;
  const due = dueCount(c.id);
  const nQ = ALL_QUIZZES.filter(q => q.courseId === c.id).length;
  const nC = ALL_FLASHCARDS.filter(x => x.courseId === c.id).length;
  const m = getCourseMastery(c.id);

  const tabs = `<nav class="filter" aria-label="Kurs wählen">${COURSES_META.map(x => `
    <a class="f-btn" href="#/kurse/${x.id}" ${x.id === c.id ? 'aria-current="page"' : ''}>${sq(x.color)}<span class="f-l">${esc(x.short)}</span><span class="f-n">${getCourseMastery(x.id)}%</span></a>`).join('')}</nav>`;

  const info = `<section class="ctx-block ctx-a">
    <div class="c-head">
      <p class="label">${sq(c.color)} ${esc(c.short)} · ${esc(c.prof)}</p>
      <h2 class="c-title">${esc(c.title)}</h2>
      <p class="c-sub">${esc(c.subtitle)}</p>
    </div>
    <dl class="exam">
      <div><dt>Prüfung</dt><dd>${esc(c.examInfo.type)}</dd></div>
      <div><dt>Hilfsmittel</dt><dd>${esc(c.examInfo.aid)}</dd></div>
      <div><dt>PVL</dt><dd>${esc(c.examInfo.pvl)}</dd></div>
      <div><dt>Zeitraum</dt><dd>${esc(c.examInfo.period)}</dd></div>
    </dl>
    <dl class="facts facts-3">
      <div><dt>Beherrschung</dt><dd>${m}<small>%</small></dd></div>
      <div><dt>Fällig</dt><dd class="${due ? 'red' : ''}">${due}<small>/${nC}</small></dd></div>
      <div><dt>Quiz</dt><dd>${nQ}</dd></div>
    </dl>
    <div class="chart" data-chart="status" data-only="${c.id}"></div>
    ${readout()}
    <div class="row">
      <button class="btn btn-primary" type="button" data-act="learn" data-course="${c.id}">Karten lernen${due ? ` · ${due}` : ''}</button>
      <button class="btn" type="button" data-act="quiz-course" data-course="${c.id}">Quiz · ${nQ}</button>
      <button class="btn" type="button" data-act="pin-course" data-course="${c.id}">Alle anheften</button>
    </div>
  </section>`;

  const pdfs = `<section class="ctx-block ctx-b">
    <h3 class="label">Unterlagen · ${c.pdfs.length} PDF</h3>
    <ul class="pdfs">${c.pdfs.map(p => `
      <li><a href="${pdfHref(p.path)}" target="_blank" rel="noopener"><span class="pdf-tag">${esc(p.tag)}</span><span class="pdf-t">${esc(p.title)}</span><span class="pdf-a" aria-hidden="true">↗</span></a></li>`).join('')}
    </ul>
  </section>`;

  const list = `<section class="chapters" aria-label="Kapitel">
    <h3 class="label">Kapitel · ${chapters.length}</h3>
    ${chapters.map((ch, i) => chapterHtml(ch, i)).join('')}
  </section>`;

  return `${vhead('04', 'Kurse', 'Prüfungsinfos · Kapitel · Feynman · Unterlagen')}
    ${tabs}
    <div class="split split-course">${info}<div class="primary">${list}</div>${pdfs}</div>`;
}

function chapterHtml(ch, i) {
  const full = { ...ch, courseId: ch.courseId || S.course };
  const pinned = ch.cheatSheet ? store.isPinned(ch.cheatSheet.id) : false;
  const fey = getFeynman(ch.id);
  const dg = ch.diagram && DIAGRAMS[ch.diagram];
  const rubric = ch.feynman?.rubric || [];
  const done = rubric.filter((_, k) => fey.checkedPoints.includes(k)).length;
  return `<details class="chap" data-ch="${full.id}" ${S.open.has(full.id) ? 'open' : ''}>
    <summary>
      <span class="chap-n">${pad2(i + 1)}</span>
      <span class="chap-t">${esc(ch.title)}</span>
      <span class="chap-m">${ch.badge ? `<span class="flag flag-ink">${esc(ch.badge)}</span>` : ''}<span class="pin-ind" data-pin-ind="${full.id}" ${pinned ? '' : 'hidden'}>Angeheftet</span></span>
      <span class="chap-x" aria-hidden="true"></span>
    </summary>
    <div class="chap-body">
      <ul class="sum">${ch.summary.map(s => `<li>${s}</li>`).join('')}</ul>
      ${dg ? `<figure class="dg"><figcaption class="label">Abb. · ${esc(dg.title)}</figcaption><div class="dg-frame" tabindex="0" aria-label="Diagramm, horizontal scrollbar">${dg.svg}</div></figure>` : ''}
      ${ch.feynman ? `<section class="feyn">
        <p class="label">Feynman-Technik</p>
        <p class="feyn-p">${esc(ch.feynman.prompt)}</p>
        <label class="sr" for="fey-${full.id}">Deine Erklärung</label>
        <textarea id="fey-${full.id}" data-feyn="${full.id}" rows="6" placeholder="Erkläre es in eigenen, einfachen Worten …">${esc(fey.text)}</textarea>
        <p class="feyn-s" data-feyn-s="${full.id}">${feynStatus(fey.text)}</p>
        <p class="label">Checkliste · <span data-rub-n="${full.id}">${done}/${rubric.length}</span></p>
        <ul class="rubric">${rubric.map((r, k) => `
          <li><label><input type="checkbox" data-rub="${full.id}" data-i="${k}" ${fey.checkedPoints.includes(k) ? 'checked' : ''}><span>${esc(r)}</span></label></li>`).join('')}
        </ul>
      </section>` : ''}
      ${ch.cheatSheet ? `<button class="btn ${pinned ? '' : 'btn-primary'}" type="button" data-act="pin" data-ch="${full.id}" aria-pressed="${pinned}">${pinned ? 'Vom Spickzettel lösen' : 'An Spickzettel anheften'}</button>` : ''}
    </div>
  </details>`;
}

function feynStatus(text) {
  const w = text.trim() ? text.trim().split(/\s+/).length : 0;
  return w ? `${plural(w, 'Wort', 'Wörter')} · automatisch gespeichert` : 'Wird beim Tippen automatisch gespeichert.';
}

function togglePin(chId) {
  const ch = CHAPTERS.get(chId);
  if (!ch?.cheatSheet) return;
  const on = togglePinChapter(ch);
  const btn = $(`[data-act="pin"][data-ch="${chId}"]`, view);
  if (btn) {
    btn.setAttribute('aria-pressed', String(on));
    btn.textContent = on ? 'Vom Spickzettel lösen' : 'An Spickzettel anheften';
    btn.classList.toggle('btn-primary', !on);
  }
  const ind = $(`[data-pin-ind="${chId}"]`, view);
  if (ind) ind.hidden = !on;
  toast(on ? `Angeheftet: ${ch.cheatSheet.title}` : `Gelöst: ${ch.cheatSheet.title}`);
}

/* =========================================================
   05 · E-Mail-Coach
   ========================================================= */

function vEmail() {
  const prompts = ENGLISH_DATA.emailPrompts;
  const p = prompts[S.email.idx];
  const text = S.email.drafts[p.id] || '';
  const dg = DIAGRAMS['gpas-email'];
  return `${vhead('05', 'E-Mail-Coach', 'GPAS Semi-Formal Exam Email · Live-Analyse')}
    <div class="filter" role="group" aria-label="Szenario">${prompts.map((x, i) => `
      <button type="button" class="f-btn" data-act="email-p" data-i="${i}" aria-pressed="${i === S.email.idx}"><span class="f-n">${pad2(i + 1)}</span><span class="f-l">${esc(x.title)}</span></button>`).join('')}
    </div>
    <div class="split split-email">
      <div class="primary">
        <section class="scenario" lang="en">
          <p class="label">Szenario ${pad2(S.email.idx + 1)}</p>
          <h2>${esc(p.title)}</h2>
          <p class="scenario-t">${esc(p.scenario)}</p>
        </section>
        <figure class="dg"><figcaption class="label">Abb. · ${esc(dg.title)}</figcaption><div class="dg-frame" tabindex="0" aria-label="Diagramm, horizontal scrollbar">${dg.svg}</div></figure>
        <section class="editor">
          <div class="em-mini" id="em-mini" aria-hidden="true"></div>
          <label class="label" for="em-text">Deine E-Mail (Body only)</label>
          <textarea id="em-text" lang="en" spellcheck="true" autocapitalize="sentences" rows="14"
            placeholder="Dear Ms Miller,&#10;&#10;Thank you for your email regarding …">${esc(text)}</textarea>
          <div class="row"><button class="btn" type="button" data-act="email-clear">Text leeren</button></div>
        </section>
      </div>
      <aside class="ctx" aria-label="Analyse"><div class="ctx-sticky" id="em-feedback"></div></aside>
    </div>`;
}

function updateEmailFeedback() {
  const ta = $('#em-text');
  if (!ta) return;
  const p = ENGLISH_DATA.emailPrompts[S.email.idx];
  const a = analyzeEmail(ta.value, p);
  const inZone = a.words >= 120 && a.words <= 180;
  const state = inZone ? 'Im Ziel' : a.wordsOk ? 'Toleranz' : a.words < 120 ? 'Zu kurz' : 'Zu lang';
  const scale = 240;
  const pos = Math.min(a.words, scale) / scale * 100;
  $('#em-feedback').innerHTML = `
    <section class="ctx-block">
      <p class="label">Umfang · Ziel 120–180 Wörter</p>
      <p class="big-n">${a.words}<small> Wörter</small></p>
      <div class="wbar" role="img" aria-label="${a.words} Wörter, ${state}">
        <span class="wbar-zone" style="left:${120 / scale * 100}%;width:${60 / scale * 100}%"></span>
        <span class="wbar-mark ${inZone ? '' : 'is-off'}" style="left:${pos}%"></span>
      </div>
      <div class="wbar-scale" aria-hidden="true"><span>0</span><span style="left:${120 / scale * 100}%">120</span><span style="left:${180 / scale * 100}%">180</span><span class="end">${scale}+</span></div>
      <p class="state ${inZone ? '' : a.wordsOk ? '' : 'red'}">${state}</p>
    </section>
    <section class="ctx-block">
      <p class="label">GPAS-Checks · ${a.score}/6</p>
      <ol class="checks">${a.checks.map((c, i) => `
        <li class="${c.ok ? 'is-ok' : ''}"><span class="ck-n">${pad2(i + 1)}</span><span class="ck-l" lang="en">${esc(c.label)}</span><span class="ck-s">${c.ok ? '✓' : '—'}</span></li>`).join('')}
      </ol>
    </section>
    <section class="ctx-block">
      <p class="label">Schlüsselwörter · ${a.kwHits}/${a.keywords.length}</p>
      <ul class="kws" lang="en">${a.keywords.map(k => `<li class="${k.hit ? 'is-hit' : ''}">${esc(k.word)}</li>`).join('')}</ul>
    </section>`;
  $('#em-mini').innerHTML = `<span><b>${a.words}</b> W · <em class="${inZone ? '' : 'red'}">${state}</em></span><span><b>${a.score}</b>/6 GPAS</span><span><b>${a.kwHits}</b>/${a.keywords.length} KW</span>`;
}

/* =========================================================
   06 · Spickzettel
   ========================================================= */

function sheetItems(pins) {
  return pins.map(p => {
    const m = courseMeta(p.courseId);
    return `<section class="pin">
      <h3>${sq(m.color)}<span>${esc(p.title)}</span></h3>
      <button class="unpin" type="button" data-act="unpin" data-id="${esc(p.id)}" aria-label="${esc(p.title)} lösen">×</button>
      <p>${esc(p.content)}</p>
      ${p.code ? `<pre><code>${esc(p.code)}</code></pre>` : ''}
    </section>`;
  }).join('');
}

function vSheet() {
  const pins = store.state.pinnedCheatSheet;
  const byCourse = COURSES_META.map(c => ({ c, n: pins.filter(p => p.courseId === c.id).length }));
  const maxN = Math.max(1, ...byCourse.map(x => x.n));
  const chars = pins.reduce((a, p) => a + (p.content || '').length + (p.code || '').length + (p.title || '').length, 0);
  const tools = `<div class="toolbar">
    <button class="btn" type="button" data-act="load-pins" data-courses="gdp1">GP1 laden</button>
    <button class="btn" type="button" data-act="load-pins" data-courses="ics">ICS laden</button>
    <button class="btn" type="button" data-act="load-pins" data-courses="all">Alle laden</button>
    <button class="btn" type="button" data-act="clear-pins" ${pins.length ? '' : 'disabled'}>Leeren</button>
    <button class="btn btn-primary" type="button" data-act="print" ${pins.length ? '' : 'disabled'}>Drucken</button>
  </div>`;
  const paper = pins.length ? `<div class="paper">
      <header class="paper-h"><b>StudyOS WS 26/27 — Spickzettel</b><span>DIN A4 · ${plural(pins.length, 'Eintrag', 'Einträge')}</span></header>
      <div class="paper-cols">${sheetItems(pins)}</div>
    </div>` : `<div class="empty">
      <p class="empty-n">0</p><h2>Noch nichts angeheftet.</h2>
      <p>Hefte Kapitel unter <a href="#/kurse">04 Kurse</a> an oder lade alle Kapitel eines Kurses mit den Schaltflächen oben.</p>
    </div>`;
  const ctx = `<section class="ctx-block">
      <h3 class="label">Inhalt</h3>
      <dl class="facts facts-2"><div><dt>Einträge</dt><dd>${pins.length}</dd></div><div><dt>Zeichen</dt><dd>${chars.toLocaleString('de-DE')}</dd></div></dl>
      <ul class="tally">${byCourse.map(({ c, n }) => `
        <li><span class="tally-l">${sq(c.color)} ${esc(c.short)}</span><span class="tally-b"><i style="width:${pct(n, maxN)}%;background:${c.color}"></i></span><span class="tally-n">${n}</span></li>`).join('')}
      </ul>
    </section>
    <section class="ctx-block">
      <h3 class="label">Druck</h3>
      <p class="note">Gedruckt wird nur das Blatt: weiß, zweispaltig, kompakt. Im Druckdialog „DIN A4“ und ggf. „An Seite anpassen“ wählen.</p>
    </section>`;
  return `${vhead('06', 'Spickzettel', 'DIN-A4-Hilfsmittel aus angehefteten Kapiteln')}
    ${tools}
    <div class="split"><div class="primary">${paper}</div><aside class="ctx" aria-label="Kontext">${ctx}</aside></div>`;
}

function fillPrintSheet() {
  const pins = store.state.pinnedCheatSheet;
  $('#print-sheet').innerHTML = `<header class="paper-h"><b>StudyOS WS 26/27 — Spickzettel</b><span>${new Date().toLocaleDateString('de-DE')} · ${plural(pins.length, 'Eintrag', 'Einträge')}</span></header>
    <div class="paper-cols">${sheetItems(pins)}</div>`;
}

/* =========================================================
   07 · Methode & Backup
   ========================================================= */

const METHODS = [
  { t: 'Spaced Repetition', d: 'Verteiltes Wiederholen schlägt Massieren: Wer Wiederholungen über Tage streut, behält deutlich mehr als bei gleicher Lernzeit am Stück.',
    how: 'SM-2 plant jede Karte neu – „Nochmal“ in 10 Minuten, „Gut“ in wachsenden Abständen. Ab 14 Tagen Intervall gilt eine Karte als gefestigt.', src: 'Cepeda et al., 2006' },
  { t: 'Active Recall', d: 'Abrufen ist selbst Lernen (Testing-Effekt). Erst antworten, dann nachsehen – nicht nur wiederlesen.',
    how: 'Karten zeigen zuerst nur die Frage; das Quiz verlangt eine Entscheidung, bevor die Lösung erscheint.', src: 'Roediger & Karpicke, 2006' },
  { t: 'Interleaving', d: 'Gemischtes Üben verschiedener Themen zwingt zur Auswahl der passenden Strategie und verbessert den Transfer.',
    how: '„Alle · gemischt“ verschränkt Karten und Fragen so, dass möglichst nie zwei aus demselben Kurs aufeinander folgen.', src: 'Rohrer & Taylor, 2007' },
  { t: 'Feynman-Technik', d: 'Selbsterklärung in einfachen Worten deckt Wissenslücken auf und vernetzt Begriffe (Elaboration).',
    how: 'Jedes Kapitel hat einen Erklär-Auftrag mit Textfeld und Checkliste der Kernpunkte zum Selbstabgleich.', src: 'Chi et al., 1994' },
  { t: 'Dual Coding', d: 'Wort und Bild zusammen werden über zwei Kanäle gespeichert und leichter abgerufen.',
    how: 'Kernkapitel enthalten Diagramme (JVM, Vererbung, DOM, Box-Modell, HTTP, GPAS) direkt neben der Zusammenfassung.', src: 'Paivio, 1971' },
];

function vMethods() {
  const s = store.state;
  const answered = Object.keys(s.quizHistory).length;
  const reviewed = Object.values(s.cards).filter(c => c && c.totalReviews > 0).length;
  const notes = Object.values(s.feynmanNotes).filter(n => n && n.text && n.text.trim()).length;
  const methods = `<ol class="methods">${METHODS.map((m, i) => `
    <li>
      <span class="meth-n">${pad2(i + 1)}</span>
      <div class="meth-b">
        <h2>${m.t}</h2>
        <p>${m.d}</p>
        <p class="meth-how"><span class="label">In StudyOS</span>${m.how}</p>
        <p class="meth-src">${m.src}</p>
      </div>
    </li>`).join('')}</ol>
    <p class="note">Ergänzend: Die Sicherheitsangabe im Quiz nutzt den <b>Hypercorrection-Effekt</b> (Butterfield &amp; Metcalfe, 2001) – mit hoher Sicherheit begangene Fehler werden nach Korrektur besonders gut behalten.</p>`;

  const data = `<section class="ctx-block">
      <h3 class="label">Gespeicherte Daten</h3>
      <dl class="facts facts-2">
        <div><dt>Karten geübt</dt><dd>${reviewed}<small>/${ALL_FLASHCARDS.length}</small></dd></div>
        <div><dt>Quizfragen</dt><dd>${answered}<small>/${ALL_QUIZZES.length}</small></dd></div>
        <div><dt>Feynman-Notizen</dt><dd>${notes}</dd></div>
        <div><dt>Angeheftet</dt><dd>${s.pinnedCheatSheet.length}</dd></div>
      </dl>
    </section>
    <section class="ctx-block">
      <h3 class="label">Backup</h3>
      <div class="stack">
        <button class="btn btn-primary" type="button" data-act="export">Backup herunterladen (JSON)</button>
        <label class="btn file-btn">Backup importieren<input type="file" id="import-file" accept="application/json,.json"></label>
        <button class="btn btn-danger" type="button" data-act="reset">Fortschritt zurücksetzen</button>
      </div>
      <p class="note">Alle Versionen teilen denselben Fortschritt im Browser. Zurücksetzen löscht Karten, Quiz, Notizen und Spickzettel – der Farbmodus bleibt.</p>
    </section>
    <section class="ctx-block">
      <h3 class="label">Tastenkürzel</h3>
      <table class="keytable">
        <tbody>
          <tr><td><kbd>⌥</kbd> <kbd>1</kbd>–<kbd>7</kbd></td><td>Abschnitt 01–07 öffnen</td></tr>
          <tr><td><kbd>T</kbd></td><td>Hell / Dunkel</td></tr>
          <tr><td><kbd>P</kbd></td><td>Fokus-Timer starten / pausieren</td></tr>
          <tr><td><kbd>Leertaste</kbd></td><td>Karte: Antwort zeigen</td></tr>
          <tr><td><kbd>1</kbd>–<kbd>4</kbd></td><td>Karte: Nochmal · Schwer · Gut · Einfach</td></tr>
          <tr><td><kbd>1</kbd>–<kbd>4</kbd> / <kbd>A</kbd>–<kbd>D</kbd></td><td>Quiz: Antwort wählen</td></tr>
          <tr><td><kbd>↵</kbd></td><td>Quiz: prüfen / nächste Frage</td></tr>
        </tbody>
      </table>
      <p class="note touch-only">Auf dem Handy: Bewertungs- und Prüfen-Tasten liegen unten im Daumenbereich.</p>
    </section>`;
  return `${vhead('07', 'Methode & Backup', 'Fünf evidenzbasierte Lernmethoden · Daten sichern')}
    <div class="split"><div class="primary">${methods}</div><aside class="ctx" aria-label="Daten">${data}</aside></div>`;
}

/* ---------- Pomodoro ---------- */

const pomo = new Pomodoro({
  onChange: updatePomo,
  onFinish: (mins) => toast(`Fokus-Einheit fertig: ${mins} Minuten notiert. Kurze Pause!`),
});

function updatePomo() {
  $('#pomo-time').textContent = pomo.display;
  $('#pomo-chip-time').textContent = pomo.display;
  $('#pomo-bar').style.width = `${(pomo.progress * 100).toFixed(2)}%`;
  $('#pomo-toggle').textContent = pomo.running ? 'Pause' : (pomo.seconds < pomo.mode * 60 ? 'Weiter' : 'Start');
  $('#pomo-mode').textContent = `${pomo.mode} Min`;
  const other = pomo.mode === 25 ? 50 : 25;
  const mb = $('#pomo-mode-btn');
  mb.textContent = `${other}`;
  mb.setAttribute('aria-label', `Auf ${other} Minuten wechseln`);
  document.body.classList.toggle('pomo-running', pomo.running);
  if (pomo.running) document.title = `${pomo.display} · Fokus · StudyOS 09`;
  else document.title = `${SECTIONS.find(s => s.id === S.route.id).label} · StudyOS 09`;
}

function setPomoOpen(open) {
  indexEl.classList.toggle('pomo-open', open);
  $('.pomo-chip').setAttribute('aria-expanded', String(open));
}

/* ---------- actions ---------- */

const ACTIONS = {
  theme: () => { store.toggleTheme(); applyTheme(); },
  'pomo-toggle': () => pomo.toggle(),
  'pomo-reset': () => pomo.reset(),
  'pomo-mode': () => pomo.switchMode(),
  'pomo-open': () => setPomoOpen(!indexEl.classList.contains('pomo-open')),
  'start-mixed': () => {
    S.fc = freshFc('all', dueCount('all') === 0);
    go('karten');
  },
  learn: (el) => { S.fc = freshFc(el.dataset.course); go('karten'); },
  'quiz-course': (el) => { S.quiz = freshQuiz(el.dataset.course); go('quiz'); },
  range: (el) => { S.range = Number(el.dataset.n); render(`[data-act="range"][data-n="${S.range}"]`); },
  'fc-filter': (el) => { S.fc = freshFc(el.dataset.course); render(`[data-act="fc-filter"][data-course="${el.dataset.course}"]`); },
  reveal: () => reveal(),
  rate: (el) => doRate(Number(el.dataset.r)),
  'fc-all': () => { S.fc = freshFc(S.fc.course, true); render('[data-act="reveal"]'); },
  'quiz-filter': (el) => { S.quiz = freshQuiz(el.dataset.course); render(`[data-act="quiz-filter"][data-course="${el.dataset.course}"]`); },
  opt: (el) => selectOpt(Number(el.dataset.i)),
  conf: (el) => { S.quiz.confidence = el.dataset.c; render(`[data-act="conf"][data-c="${el.dataset.c}"]`); },
  submit: () => submitCurrent(),
  next: () => nextQuestion(),
  'quiz-restart': () => { S.quiz = freshQuiz(S.quiz.course); render(); },
  pin: (el) => togglePin(el.dataset.ch),
  'pin-course': (el) => {
    loadCoursePins([el.dataset.course]);
    render();
    toast(`Alle Kapitel von ${courseMeta(el.dataset.course).short} angeheftet.`);
  },
  'email-p': (el) => { S.email.idx = Number(el.dataset.i); render(`[data-act="email-p"][data-i="${el.dataset.i}"]`); },
  'email-clear': () => {
    const ta = $('#em-text');
    if (!ta.value || !confirm('Text wirklich leeren?')) return;
    ta.value = '';
    S.email.drafts[ENGLISH_DATA.emailPrompts[S.email.idx].id] = '';
    saveDrafts();
    updateEmailFeedback();
    ta.focus();
  },
  'load-pins': (el) => {
    const ids = el.dataset.courses === 'all' ? COURSES_META.map(c => c.id) : el.dataset.courses.split(',');
    const before = store.state.pinnedCheatSheet.length;
    loadCoursePins(ids);
    const added = store.state.pinnedCheatSheet.length - before;
    render();
    toast(added ? `${plural(added, 'Eintrag', 'Einträge')} hinzugefügt.` : 'Bereits alles angeheftet.');
  },
  'clear-pins': () => {
    if (!confirm('Alle Einträge vom Spickzettel entfernen?')) return;
    clearPins();
    render();
    toast('Spickzettel geleert.');
  },
  unpin: (el) => {
    store.togglePin({ id: el.dataset.id });
    render();
    toast('Eintrag gelöst.');
  },
  print: () => {
    if (!store.state.pinnedCheatSheet.length) { toast('Keine Einträge zum Drucken.', 'err'); return; }
    fillPrintSheet();
    window.print();
  },
  export: () => { downloadBackup(); toast('Backup heruntergeladen.'); },
  reset: () => {
    if (!confirm('Gesamten Lernfortschritt zurücksetzen? Das betrifft alle Versionen und kann nicht rückgängig gemacht werden.')) return;
    resetProgress();
    S.fc = freshFc();
    S.quiz = freshQuiz();
    render();
    toast('Fortschritt zurückgesetzt.');
  },
};

document.addEventListener('click', (e) => {
  const tip = e.target.closest('[data-tip]');
  if (tip && view.contains(tip)) showTip(tip);
  const el = e.target.closest('[data-act]');
  if (el && !el.disabled && el.getAttribute('aria-disabled') !== 'true') {
    ACTIONS[el.dataset.act]?.(el, e);
  }
  if (indexEl.classList.contains('pomo-open') && !e.target.closest('#pomo, .pomo-chip')) setPomoOpen(false);
});

view.addEventListener('pointerover', (e) => {
  if (!canHover.matches || e.pointerType === 'touch') return;
  const tip = e.target.closest('[data-tip]');
  if (tip) showTip(tip);
});
view.addEventListener('focusin', (e) => {
  if (e.target.matches('[data-tip]')) showTip(e.target);
});

view.addEventListener('input', (e) => {
  const t = e.target;
  if (t.matches('[data-feyn]')) {
    saveFeynmanText(t.dataset.feyn, t.value);
    const s = $(`[data-feyn-s="${t.dataset.feyn}"]`, view);
    if (s) s.textContent = feynStatus(t.value);
  } else if (t.id === 'em-text') {
    S.email.drafts[ENGLISH_DATA.emailPrompts[S.email.idx].id] = t.value;
    saveDrafts();
    updateEmailFeedback();
  }
});

view.addEventListener('change', (e) => {
  const t = e.target;
  if (t.matches('[data-rub]')) {
    const id = t.dataset.rub;
    toggleFeynmanPoint(id, Number(t.dataset.i), t.checked);
    const n = $(`[data-rub-n="${id}"]`, view);
    const total = CHAPTERS.get(id)?.feynman?.rubric.length || 0;
    if (n) n.textContent = `${getFeynman(id).checkedPoints.length}/${total}`;
  } else if (t.id === 'import-file' && t.files[0]) {
    importBackup(t.files[0])
      .then(() => {
        applyTheme();
        S.fc = freshFc();
        S.quiz = freshQuiz();
        render();
        toast('Backup importiert.');
      })
      .catch(() => toast('Import fehlgeschlagen: Die Datei ist kein gültiges Backup.', 'err'))
      .finally(() => { t.value = ''; });
  }
});

// <details> toggle does not bubble → capture.
view.addEventListener('toggle', (e) => {
  const d = e.target;
  if (!d.matches?.('details.chap')) return;
  if (d.open) S.open.add(d.dataset.ch); else S.open.delete(d.dataset.ch);
}, true);

/* ---------- keyboard ---------- */

document.addEventListener('keydown', (e) => {
  const typing = e.target.closest?.('input, textarea, select, [contenteditable="true"]');
  if (e.altKey && !e.metaKey && !e.ctrlKey && /^Digit[1-7]$/.test(e.code)) {
    e.preventDefault();
    go(SECTIONS[Number(e.code.slice(5)) - 1].id);
    return;
  }
  if (e.key === 'Escape' && indexEl.classList.contains('pomo-open')) { setPomoOpen(false); return; }
  if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
  // Enter on an answer/confidence button submits instead of re-clicking it.
  const onControl = e.target.closest?.('button:not([data-act="opt"]):not([data-act="conf"]), a, summary, [data-tip]');

  if (S.route.id === 'karten') {
    const card = S.fc.queue?.[0];
    if (card && !S.fc.revealed && (e.key === ' ' || (e.key === 'Enter' && !onControl))) {
      e.preventDefault();
      reveal();
      return;
    }
    if (card && S.fc.revealed && /^[1-4]$/.test(e.key)) {
      e.preventDefault();
      doRate(Number(e.key));
      return;
    }
  }
  if (S.route.id === 'quiz') {
    const q = S.quiz.queue?.[S.quiz.idx];
    if (q && !S.quiz.result) {
      let i = '1234'.indexOf(e.key);
      if (i < 0) i = 'abcd'.indexOf(e.key.toLowerCase());
      if (i >= 0 && e.key.length === 1 && i < q.options.length) { e.preventDefault(); selectOpt(i); return; }
    }
    if (q && e.key === 'Enter' && !onControl) {
      e.preventDefault();
      if (S.quiz.result) nextQuestion(); else submitCurrent();
      return;
    }
  }
  if (e.key === 't' || e.key === 'T') { ACTIONS.theme(); return; }
  if (e.key === 'p' || e.key === 'P') { pomo.toggle(); }
});

/* ---------- boot ---------- */

// First visit (nothing stored yet): follow the OS preference instead of the store's dark default.
if (!localStorage.getItem(STORE_KEY)) {
  store.state.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

renderNav();
applyTheme();
updatePomo();
render();
centerActiveTab();

window.addEventListener('hashchange', () => {
  const prev = S.route.id;
  render();
  if (parseHash().id !== prev || S.route.id === 'kurse') window.scrollTo(0, 0);
  view.focus({ preventScroll: true });
  centerActiveTab();
});

store.subscribe(() => updateNav());
window.addEventListener('beforeprint', fillPrintSheet);

new ResizeObserver(() => drawCharts()).observe(view);
new ResizeObserver(() => {
  document.documentElement.style.setProperty('--hdr', `${indexEl.offsetHeight}px`);
}).observe(indexEl);
canHover.addEventListener?.('change', () => $$('[data-readout]:not(.is-set)', view).forEach(r => { r.textContent = tipHint(r.dataset.kind); }));
