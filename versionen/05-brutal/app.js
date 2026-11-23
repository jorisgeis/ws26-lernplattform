// STUDY/OS — Neo-Brutalist Exam Board (Version 05)
// Renders its own UI on top of the shared domain layer in ../shared/core.js.

import {
  COURSES_META, ENGLISH_DATA, DIAGRAMS, store, ALL_DATA, ALL_CHAPTERS, ALL_QUIZZES,
  courseMeta, escapeHtml as esc, pdfHref, getDueCards, buildFlashcardQueue, rateCard, intervalsFor,
  RATING_LABELS, cardStats, buildQuizQueue, CONFIDENCE_LEVELS, submitQuiz, calibrationStats,
  getCourseMastery, overallMastery, todayProgress, activityHistory, streakLabel, allDeadlines,
  formatDate, daysLeftLabel, getFeynman, saveFeynmanText, toggleFeynmanPoint, togglePinChapter,
  loadCoursePins, clearPins, analyzeEmail, downloadBackup, importBackup, resetProgress, Pomodoro,
} from '../shared/core.js';

const $ = (sel, root = document) => root.querySelector(sel);
const view = $('#view');
const COURSES = COURSES_META;
const LETTERS = 'ABCDEFGH';
const DRAG_THRESHOLD = 110;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- UI session state (progress itself lives in the shared store) ---------- */

const cs = { course: 'all', includeAll: false, queue: null, revealed: false, done: 0, busy: false };
const qs = { course: 'all', queue: null, idx: 0, selected: null, confidence: 'medium', result: null, correct: 0 };
const em = { idx: 0, drafts: {} };
let route = { name: 'board', arg: '' };

const dueCount = (course = 'all') => getDueCards(course).length;
const quizCount = (course = 'all') => (course === 'all' ? ALL_QUIZZES.length : ALL_QUIZZES.filter(q => q.courseId === course).length);

function resetSessions() {
  cs.queue = null; cs.revealed = false; cs.done = 0; cs.includeAll = false;
  qs.queue = null;
}

/* ---------- Toasts ---------- */

function toast(msg, tone = 'yellow') {
  const el = document.createElement('div');
  el.className = `toast t-${tone}`;
  el.textContent = msg;
  $('#toasts').append(el);
  setTimeout(() => {
    el.classList.add('is-out');
    setTimeout(() => el.remove(), 300);
  }, 3200);
}

/* ---------- Chrome: marquee, stats, tabs, theme ---------- */

let lastMarquee = '';

function applyTheme() {
  const dark = store.state.theme === 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  const btn = $('#themeBtn');
  btn.textContent = dark ? '☀ Hell' : '☾ Dunkel';
  btn.setAttribute('aria-label', dark ? 'Zum hellen Farbschema wechseln' : 'Zum dunklen Farbschema wechseln');
}

function renderChrome() {
  const due = dueCount();
  const t = todayProgress();
  const next = allDeadlines().slice(0, 3);
  const items = [
    `⚡ ${due} Karten fällig`,
    `★ Heute ${t.done}/${t.goal} erledigt`,
    `🔥 Streak: ${streakLabel()}`,
    `Ø Mastery ${overallMastery()}%`,
    ...next.map(d => `⏰ ${d.label} — ${daysLeftLabel(d.daysLeft)}`),
  ];
  const group = `<div class="marquee-group">${items.map(i => `<span>${esc(i)}</span><span class="sep">✶</span>`).join('')}</div>`;
  if (group !== lastMarquee) {
    $('#marquee').innerHTML = group + group;
    lastMarquee = group;
  }

  $('#stats').innerHTML = `
    <div class="stat st-due"><b>${due}</b><span>fällig</span></div>
    <div class="stat st-today" style="--p:${t.pct}%"><b>${t.done}<small>/${t.goal}</small></b><span>heute</span></div>
    <div class="stat st-streak"><b>${esc(streakLabel())}</b><span>Streak</span></div>`;

  $('#tabDue').textContent = due ? String(due) : '';
  const pins = store.state.pinnedCheatSheet.length;
  $('#tabPins').textContent = pins ? String(pins) : '';
  applyTheme();
}

/* ---------- Pomodoro ---------- */

function renderPomo(p) {
  $('#pomoTime').textContent = p.display;
  $('#pomoFill').style.width = `${Math.round(p.progress * 100)}%`;
  const toggle = $('#pomoToggle');
  toggle.textContent = p.running ? '❚❚' : '▶';
  toggle.setAttribute('aria-label', p.running ? 'Timer pausieren' : 'Timer starten');
  $('#pomoMode').textContent = String(p.mode);
  $('#pomo').classList.toggle('is-running', p.running);
}

const pomo = new Pomodoro({
  onChange: renderPomo,
  onFinish: m => toast(`Fokus-Block geschafft: ${m} Min. Jetzt Pause!`, 'lime'),
});
$('#pomoToggle').addEventListener('click', () => pomo.toggle());
$('#pomoReset').addEventListener('click', () => pomo.reset());
$('#pomoMode').addEventListener('click', () => {
  pomo.switchMode();
  toast(`Fokus-Modus: ${pomo.mode} Minuten`);
});

/* ---------- Shared fragments ---------- */

function ticket(d, showCourse = false) {
  const n = d.daysLeft;
  const hot = d.urgent || n <= 3;
  return `<div class="ticket c-${d.courseId}${hot ? ' is-hot' : ''}">
    <div class="ticket-stub"><b>${n === 0 ? '!' : n}</b><small>${n === 0 ? 'heute' : n === 1 ? 'Tag' : 'Tage'}</small></div>
    <div class="ticket-body">
      ${showCourse ? `<span class="tag tag-course">${esc(d.courseShort)}</span>` : ''}
      <strong>${esc(d.label)}</strong>
      <span class="ticket-date">${formatDate(d.date)} · ${esc(daysLeftLabel(n))}</span>
    </div>
  </div>`;
}

function meter(pct, label) {
  return `<div class="meter" style="--p:${pct}%"><span>${esc(label)}</span></div>`;
}

function chapterCard(ch, withSummary = false) {
  const f = getFeynman(ch.id);
  const pinned = store.isPinned(ch.cheatSheet.id);
  return `<a class="ch-card c-${ch.courseId}" href="#kapitel/${encodeURIComponent(ch.id)}">
    <span class="ch-badge">${esc(ch.badge)}</span>
    <strong class="ch-title">${esc(ch.title)}</strong>
    ${withSummary ? `<p class="ch-sum">${ch.summary[0]}</p>` : ''}
    <span class="ch-meta">
      ${ch.diagram ? '<span>◧ Diagramm</span>' : ''}
      <span>Feynman ${f.checkedPoints.length}/${ch.feynman.rubric.length}</span>
      ${pinned ? '<span class="ch-pin">📌 gepinnt</span>' : ''}
    </span>
  </a>`;
}

function filterChips(action, active, countFn, countLabel) {
  const opts = [{ id: 'all', label: 'Alle · gemischt', icon: '✶' }, ...COURSES.map(c => ({ id: c.id, label: c.short, icon: c.icon }))];
  return opts.map(o => `<button type="button" class="chip${o.id === 'all' ? '' : ` c-${o.id}`}${o.id === active ? ' is-active' : ''}"
      data-action="${action}" data-course="${o.id}" aria-pressed="${o.id === active}">
      <span>${o.icon} ${esc(o.label)}</span><b title="${esc(countLabel)}">${countFn(o.id)}</b></button>`).join('');
}

function viewHead(title, lede, extra = '') {
  return `<section class="view-head">
    <h1 class="mega">${title}</h1>
    <div class="view-head-side"><p class="lede">${lede}</p>${extra}</div>
  </section>`;
}

/* ---------- View: Board ---------- */

function todayColumn() {
  const t = todayProgress();
  const hist = activityHistory(7);
  const max = Math.max(t.goal, ...hist.map(h => h.total), 1);
  const dl = allDeadlines().slice(0, 4);
  const date = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
  return `<section class="col col-today">
    <header class="col-head">
      <span class="col-icon">★</span>
      <div><h2>Heute</h2><p>${esc(date)}</p></div>
    </header>
    <div class="col-body">
      <div class="goal">
        <div class="goal-num">${t.done}<small>/${t.goal}</small></div>
        ${meter(t.pct, `${t.pct}% Tagesziel`)}
        <p class="mini">${t.reviews} Karten · ${t.quizzes} Quizfragen · ${t.minutes} Fokus-Min.</p>
      </div>
      <div class="spark" aria-label="Aktivität der letzten 7 Tage">
        ${hist.map((h, i) => `<div class="spark-day${i === hist.length - 1 ? ' is-today' : ''}" title="${esc(h.label)}: ${h.total} Aktionen">
          <div class="spark-bar"><i style="--h:${Math.round((h.total / max) * 100)}%"></i></div>
          <span>${esc(h.weekday)}</span></div>`).join('')}
      </div>
      <div class="sticker sticker-streak">🔥 Streak: ${esc(streakLabel())}</div>
      <h3 class="col-sub">Nächste Fristen <span>${dl.length}</span></h3>
      ${dl.length ? dl.map(d => ticket(d, true)).join('') : '<p class="mini">Keine offenen Fristen.</p>'}
    </div>
  </section>`;
}

function courseColumn(c) {
  const m = getCourseMastery(c.id);
  const due = dueCount(c.id);
  const chs = ALL_DATA[c.id].chapters.map(ch => ({ ...ch, courseId: c.id }));
  const dls = allDeadlines().filter(d => d.courseId === c.id);
  return `<section class="col c-${c.id}">
    <header class="col-head">
      <span class="col-icon">${c.icon}</span>
      <div><h2>${esc(c.short)}</h2><p>${esc(c.title)}</p></div>
      <a class="col-open" href="#kurs/${c.id}" aria-label="Kurs ${esc(c.short)} öffnen">↗</a>
    </header>
    <div class="col-body">
      <div class="sticker sticker-exam"><small>Prüfung</small>${esc(c.examInfo.type)}<em>${esc(c.examInfo.period)}</em></div>
      ${meter(m, `Mastery ${m}%`)}
      <div class="due-block"><b>${due}</b><span>Karten<br>fällig</span></div>
      <div class="btn-row">
        <button type="button" class="btn btn-color" data-action="start-cards" data-course="${c.id}">Karten ▶</button>
        <button type="button" class="btn" data-action="start-quiz" data-course="${c.id}">Quiz ▶</button>
      </div>
      <h3 class="col-sub">Fristen <span>${dls.length}</span></h3>
      ${dls.length ? dls.map(d => ticket(d)).join('') : '<p class="mini">Keine offenen Fristen.</p>'}
      <h3 class="col-sub">Kapitel <span>${chs.length}</span></h3>
      ${chs.map(ch => chapterCard(ch)).join('')}
    </div>
  </section>`;
}

function viewBoard() {
  const due = dueCount();
  view.innerHTML = `
    <section class="hero">
      <h1 class="mega">Exam<br><span class="hl">Board</span></h1>
      <div class="hero-side">
        <p class="lede">4 Kurse, 1 Board. <strong>${due}</strong> Karten warten auf dich — gemischt aus allen Kursen (Interleaving).</p>
        <div class="btn-row">
          <button type="button" class="btn btn-xl btn-yellow" data-action="start-cards" data-course="all">▶ Mix-Session (${due})</button>
          <button type="button" class="btn btn-xl" data-action="start-quiz" data-course="all">? Mix-Quiz</button>
        </div>
      </div>
    </section>
    <div class="board">
      ${todayColumn()}
      ${COURSES.map(courseColumn).join('')}
    </div>`;
}

/* ---------- View: Karten (SM-2) ---------- */

function startCards(course, includeAll = false) {
  cs.course = course;
  cs.includeAll = includeAll;
  cs.queue = buildFlashcardQueue(course, includeAll);
  cs.revealed = false;
  cs.done = 0;
  cs.busy = false;
}

function viewCards() {
  if (!cs.queue) startCards(cs.course);
  view.innerHTML = `
    ${viewHead('Karten', 'Erst selbst erinnern, dann aufdecken. Nach rechts ziehen = <strong>Gut</strong>, nach links = <strong>Nochmal</strong> — oder Tasten 1–4.')}
    <div class="chips" id="cardChips">${filterChips('cards-filter', cs.course, dueCount, 'fällige Karten')}</div>
    <div class="deck-area" id="deckArea"></div>`;
  renderDeck();
}

function renderDeck() {
  const area = $('#deckArea');
  if (!area) return;
  const card = cs.queue[0];
  if (!card) {
    const scope = cs.course === 'all' ? '' : ` in ${courseMeta(cs.course).short}`;
    area.innerHTML = `<div class="empty">
      <div class="empty-stamp">${cs.done ? 'Geschafft' : 'Inbox Zero'}</div>
      <h2>${cs.done ? `${cs.done} Bewertungen erledigt.` : `Keine Karten fällig${esc(scope)}.`}</h2>
      <p>Spaced Repetition plant die nächste Wiederholung automatisch. Freiwillig weiterüben geht trotzdem.</p>
      <div class="btn-row">
        <button type="button" class="btn btn-xl btn-yellow" data-action="cards-all">↻ Alle Karten nochmal üben</button>
        <button type="button" class="btn btn-xl" data-action="start-quiz" data-course="${cs.course}">Zum Quiz →</button>
      </div>
    </div>`;
    return;
  }
  const meta = courseMeta(card.courseId);
  const chapter = ALL_CHAPTERS.find(ch => ch.id === card.chapterId);
  const iv = intervalsFor(card);
  area.innerHTML = `
    <div class="deck-meta">
      <span>Noch <b>${cs.queue.length}</b> in der Runde</span>
      <span><b>${cs.done}</b> bewertet</span>
      ${cs.includeAll ? '<span class="tag">Freies Üben: alle Karten</span>' : ''}
    </div>
    <div class="deck">
      ${cs.queue.length > 2 ? '<div class="deck-under u2" aria-hidden="true"></div>' : ''}
      ${cs.queue.length > 1 ? '<div class="deck-under u1" aria-hidden="true"></div>' : ''}
      <article class="flash c-${card.courseId}${cs.revealed ? ' is-revealed' : ''}" id="flash" aria-label="Karteikarte">
        <div class="drag-stamp drag-left" aria-hidden="true">Nochmal</div>
        <div class="drag-stamp drag-right" aria-hidden="true">Gut</div>
        <div class="flash-top">
          <span class="tag tag-course">${meta.icon} ${esc(meta.short)}</span>
          ${card.examRelevant ? '<span class="tag tag-exam">★ Klausurrelevant</span>' : ''}
        </div>
        ${chapter ? `<p class="flash-ch">${esc(chapter.title)}</p>` : ''}
        <div class="flash-label">Frage</div>
        <div class="flash-q">${esc(card.front)}</div>
        ${cs.revealed ? `<div class="flash-label">Antwort</div><div class="flash-a">${esc(card.back)}</div>` : ''}
        <div class="flash-hint">${cs.revealed ? '← ziehen: Nochmal &nbsp;·&nbsp; Gut: ziehen →' : 'Tippen oder Leertaste zum Aufdecken'}</div>
      </article>
    </div>
    ${cs.revealed
      ? `<div class="rate-row">${RATING_LABELS.map(r => `<button type="button" class="rate rate-${r.value}" data-action="rate" data-rating="${r.value}">
          <kbd>${r.key}</kbd><strong>${r.label}</strong><span>${esc(iv[r.value])}</span></button>`).join('')}</div>`
      : '<button type="button" class="btn btn-xl btn-yellow reveal-btn" data-action="reveal">Antwort aufdecken <kbd>Leertaste</kbd></button>'}`;
  bindDrag($('#flash'));
}

function reveal() {
  if (cs.revealed || !cs.queue || !cs.queue[0]) return;
  cs.revealed = true;
  renderDeck();
}

function commitRating(rating) {
  if (cs.busy || !cs.revealed || !cs.queue[0]) return;
  cs.busy = true;
  const el = $('#flash');
  const dir = rating <= 2 ? -1 : 1;
  const finish = () => {
    const card = cs.queue.shift();
    const again = rateCard(card, rating);
    if (again) {
      cs.queue.push(card);
      toast('Nochmal: Die Karte kommt am Ende der Runde wieder.', 'pink');
    }
    cs.done += 1;
    cs.revealed = false;
    cs.busy = false;
    const chips = $('#cardChips');
    if (chips) chips.innerHTML = filterChips('cards-filter', cs.course, dueCount, 'fällige Karten');
    renderDeck();
  };
  if (el && !reducedMotion.matches) {
    el.classList.add('is-flying');
    el.style.setProperty(dir < 0 ? '--l' : '--r', '1');
    el.style.transform = `translateX(${dir * 120}vw) rotate(${dir * 28}deg)`;
    setTimeout(finish, 260);
  } else {
    finish();
  }
}

function bindDrag(el) {
  if (!el) return;
  let startX = 0;
  let dx = 0;
  let active = false;
  let moved = false;
  const resetPos = () => {
    el.classList.remove('is-dragging');
    el.style.transform = '';
    el.style.setProperty('--l', '0');
    el.style.setProperty('--r', '0');
  };
  el.addEventListener('pointerdown', e => {
    if (cs.busy || e.button > 0) return;
    startX = e.clientX;
    dx = 0;
    active = true;
    moved = false;
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener('pointermove', e => {
    if (!active) return;
    dx = e.clientX - startX;
    if (!cs.revealed || (!moved && Math.abs(dx) < 8)) return;
    moved = true;
    el.classList.add('is-dragging');
    el.style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)`;
    el.style.setProperty('--l', String(Math.min(1, Math.max(0, -dx / DRAG_THRESHOLD))));
    el.style.setProperty('--r', String(Math.min(1, Math.max(0, dx / DRAG_THRESHOLD))));
  });
  el.addEventListener('pointerup', () => {
    if (!active) return;
    active = false;
    if (!moved) {
      reveal();
      return;
    }
    if (dx > DRAG_THRESHOLD) { el.classList.remove('is-dragging'); commitRating(3); }
    else if (dx < -DRAG_THRESHOLD) { el.classList.remove('is-dragging'); commitRating(1); }
    else resetPos();
  });
  el.addEventListener('pointercancel', () => {
    active = false;
    moved = false;
    resetPos();
  });
}

/* ---------- View: Quiz ---------- */

function startQuiz(course) {
  qs.course = course;
  qs.queue = buildQuizQueue(course);
  qs.idx = 0;
  qs.selected = null;
  qs.confidence = 'medium';
  qs.result = null;
  qs.correct = 0;
}

function viewQuiz() {
  if (!qs.queue) startQuiz(qs.course);
  view.innerHTML = `
    ${viewHead('Quiz', 'Antwort wählen, Sicherheit einschätzen, prüfen. Wer sich bei Fehlern zu sicher war, lernt durch den <strong>Hypercorrection-Effekt</strong> am meisten.')}
    <div class="chips">${filterChips('quiz-filter', qs.course, quizCount, 'Fragen')}</div>
    <div id="quizArea"></div>`;
  renderQuiz();
}

function calibrationTable() {
  const cal = calibrationStats();
  return `<div class="calib">${CONFIDENCE_LEVELS.map(l => {
    const s = cal[l.value];
    const pct = s.n ? Math.round((s.ok / s.n) * 100) : 0;
    return `<div class="calib-row">
      <span class="calib-label">${esc(l.label)}</span>
      ${meter(pct, s.n ? `${pct}% richtig · ${s.n} Fragen` : 'noch keine Daten')}
    </div>`;
  }).join('')}</div>`;
}

function renderQuiz() {
  const area = $('#quizArea');
  if (!area) return;
  const q = qs.queue[qs.idx];
  if (!q) {
    const n = qs.queue.length;
    const pct = n ? Math.round((qs.correct / n) * 100) : 0;
    area.innerHTML = `<div class="empty">
      <div class="empty-stamp">${pct}%</div>
      <h2>${qs.correct} von ${n} richtig.</h2>
      <p>Deine Kalibrierung über alle beantworteten Fragen — bei „100% sicher“ sollte die Trefferquote auch nahe 100% liegen:</p>
      ${calibrationTable()}
      <div class="btn-row">
        <button type="button" class="btn btn-xl btn-yellow" data-action="quiz-restart">↻ Neue Runde</button>
        <button type="button" class="btn btn-xl" data-action="start-cards" data-course="${qs.course}">Zu den Karten →</button>
      </div>
    </div>`;
    return;
  }
  const meta = courseMeta(q.courseId);
  const answered = Boolean(qs.result);
  const total = qs.queue.length;
  const options = q.options.map((o, i) => {
    let cls = '';
    let mark = '';
    if (answered) {
      if (i === q.answer) { cls = ' is-correct'; mark = '<span class="opt-mark">✓</span>'; }
      else if (i === qs.selected) { cls = ' is-wrong'; mark = '<span class="opt-mark">✗</span>'; }
      else cls = ' is-dim';
    } else if (i === qs.selected) cls = ' is-selected';
    return `<button type="button" class="opt${cls}" data-action="quiz-select" data-i="${i}" aria-pressed="${i === qs.selected}" ${answered ? 'disabled' : ''}>
      <span class="opt-key">${LETTERS[i]}</span><span class="opt-text">${esc(o)}</span>${mark}</button>`;
  }).join('');

  let bottom;
  if (answered) {
    const { correct, overconfident } = qs.result;
    bottom = `<div class="verdict ${correct ? 'is-ok' : 'is-bad'}">
        <span class="verdict-stamp">${correct ? 'Richtig!' : 'Daneben!'}</span>
        ${correct ? '' : `<span>Korrekt ist <b>${LETTERS[q.answer]}</b>.</span>`}
      </div>
      ${overconfident ? `<div class="warn"><strong>⚠ Hypercorrection-Alarm</strong>Du warst dir 100% sicher — und lagst falsch. Genau solche Fehler merkt sich das Gehirn besonders gut, wenn du die Erklärung jetzt bewusst liest.</div>` : ''}
      <div class="explain"><span class="panel-label">Erklärung</span><p>${esc(q.explanation)}</p></div>
      <button type="button" class="btn btn-xl btn-yellow" data-action="quiz-next">${qs.idx + 1 >= total ? 'Ergebnis ansehen' : 'Nächste Frage'} →</button>`;
  } else {
    bottom = `<div class="conf">
        <span class="panel-label">Wie sicher bist du?</span>
        <div class="seg">${CONFIDENCE_LEVELS.map(l => `<button type="button" class="seg-btn${l.value === qs.confidence ? ' is-active' : ''}"
          data-action="quiz-conf" data-conf="${l.value}" aria-pressed="${l.value === qs.confidence}">${esc(l.label)}</button>`).join('')}</div>
      </div>
      <button type="button" class="btn btn-xl btn-yellow" data-action="quiz-submit" ${qs.selected === null ? 'disabled' : ''}>Antwort prüfen ↵</button>`;
  }

  area.innerHTML = `
    <div class="q-progress" style="--p:${Math.round((qs.idx / total) * 100)}%">
      <span>Frage <b>${qs.idx + 1}</b> / ${total}</span><span><b>${qs.correct}</b> richtig</span>
    </div>
    <article class="qcard c-${q.courseId}">
      <div class="q-top">
        <span class="tag tag-course">${meta.icon} ${esc(meta.short)}</span>
        ${q.examStyle ? `<span class="sticker sticker-tilt">${esc(q.examStyle)}</span>` : ''}
      </div>
      <h2 class="q-text">${esc(q.question)}</h2>
      ${q.code ? `<pre class="code"><code>${esc(q.code)}</code></pre>` : ''}
      <div class="options">${options}</div>
      ${bottom}
    </article>`;
}

function quizSubmit() {
  const q = qs.queue[qs.idx];
  if (!q || qs.result || qs.selected === null) return;
  qs.result = submitQuiz(q, qs.selected, qs.confidence);
  if (qs.result.correct) qs.correct += 1;
  renderQuiz();
}

function quizNext() {
  if (!qs.result) return;
  qs.idx += 1;
  qs.selected = null;
  qs.confidence = 'medium';
  qs.result = null;
  renderQuiz();
  $('#quizArea')?.scrollIntoView({ block: 'nearest' });
}

/* ---------- View: Kurs ---------- */

function viewCourse(id) {
  const c = COURSES.find(x => x.id === id) || COURSES[0];
  $('[data-tab="kurs"]').setAttribute('href', `#kurs/${c.id}`);
  const m = getCourseMastery(c.id);
  const due = dueCount(c.id);
  const st = cardStats(c.id);
  const chs = ALL_DATA[c.id].chapters.map(ch => ({ ...ch, courseId: c.id }));
  const dls = allDeadlines().filter(d => d.courseId === c.id);
  const info = [
    ['Prüfung', c.examInfo.type],
    ['Hilfsmittel', c.examInfo.aid],
    ['Prüfungsvorleistung', c.examInfo.pvl],
    ['Zeitraum', c.examInfo.period],
  ];
  view.innerHTML = `
    <nav class="course-switch" aria-label="Kurs wählen">
      ${COURSES.map(x => `<a class="cs-tab c-${x.id}${x.id === c.id ? ' is-active' : ''}" href="#kurs/${x.id}"${x.id === c.id ? ' aria-current="page"' : ''}>${x.icon} ${esc(x.short)}</a>`).join('')}
    </nav>
    <section class="course-hero c-${c.id}">
      <div class="course-hero-main">
        <span class="course-icon">${c.icon}</span>
        <h1 class="mega">${esc(c.short)}</h1>
        <h2 class="course-title">${esc(c.title)}</h2>
        <p>${esc(c.subtitle)}</p>
        <p class="mini">${esc(c.prof)}</p>
      </div>
      <div class="course-hero-side">
        ${meter(m, `Mastery ${m}%`)}
        <div class="card-stats">
          <span><b>${st.new}</b> neu</span><span><b>${st.learning}</b> lernend</span>
          <span><b>${st.due}</b> Wdh. fällig</span><span><b>${st.mastered}</b> sicher</span>
        </div>
        <div class="btn-row">
          <button type="button" class="btn btn-xl btn-yellow" data-action="start-cards" data-course="${c.id}">Karten ▶ (${due})</button>
          <button type="button" class="btn btn-xl" data-action="start-quiz" data-course="${c.id}">Quiz ▶ (${quizCount(c.id)})</button>
        </div>
      </div>
    </section>
    <section class="exam-stickers">
      ${info.map(([k, v]) => `<div class="sticker sticker-info"><small>${k}</small>${esc(v)}</div>`).join('')}
    </section>
    <h2 class="section-title">Kapitel <span>${chs.length}</span></h2>
    <div class="ch-grid">${chs.map(ch => chapterCard(ch, true)).join('')}</div>
    <div class="course-bottom c-${c.id}">
      <section>
        <h2 class="section-title">Fristen <span>${dls.length}</span></h2>
        ${dls.length ? dls.map(d => ticket(d)).join('') : '<p class="mini">Keine offenen Fristen.</p>'}
      </section>
      <section>
        <h2 class="section-title">Material <span>${c.pdfs.length} PDF</span></h2>
        <ul class="pdf-list">
          ${c.pdfs.map(p => `<li><a class="pdf" href="${esc(pdfHref(p.path))}" target="_blank" rel="noopener">
            <span class="pdf-tag">${esc(p.tag)}</span><span class="pdf-title">${esc(p.title)}</span><span class="pdf-go" aria-hidden="true">↗</span></a></li>`).join('')}
        </ul>
      </section>
    </div>`;
}

/* ---------- View: Kapitel ---------- */

function viewChapter(id) {
  const ch = ALL_CHAPTERS.find(x => x.id === id);
  if (!ch) { location.hash = '#board'; return; }
  const c = courseMeta(ch.courseId);
  $('[data-tab="kurs"]').setAttribute('href', `#kurs/${c.id}`);
  const siblings = ALL_CHAPTERS.filter(x => x.courseId === ch.courseId);
  const pos = siblings.findIndex(x => x.id === ch.id);
  const prev = siblings[pos - 1];
  const next = siblings[pos + 1];
  const f = getFeynman(ch.id);
  const pinned = store.isPinned(ch.cheatSheet.id);
  const dg = ch.diagram && DIAGRAMS[ch.diagram];
  view.innerHTML = `
    <nav class="crumbs"><a href="#kurs/${c.id}">← ${c.icon} ${esc(c.short)}</a><span>Kapitel ${pos + 1} / ${siblings.length}</span></nav>
    <section class="chapter-hero c-${c.id}">
      <span class="sticker sticker-tilt">${esc(ch.badge)}</span>
      <h1 class="chapter-title">${esc(ch.title)}</h1>
      <button type="button" class="btn btn-xl pin-btn${pinned ? ' is-pinned' : ''}" data-action="pin" data-chapter="${esc(ch.id)}" aria-pressed="${pinned}">${pinned ? '✓ Auf dem Spickzettel' : '📌 Auf den Spickzettel'}</button>
    </section>
    <div class="chapter-grid c-${c.id}">
      <div class="chapter-main">
        <section class="panel">
          <span class="panel-label">Zusammenfassung</span>
          <ol class="summary">${ch.summary.map(s => `<li>${s}</li>`).join('')}</ol>
        </section>
        ${dg ? `<section class="panel diagram-box"><span class="panel-label">Dual Coding · ${esc(dg.title)}</span>${dg.svg}</section>` : ''}
        <section class="panel cheat-preview">
          <span class="panel-label">Spickzettel-Eintrag</span>
          <h3>${esc(ch.cheatSheet.title)}</h3>
          <p>${esc(ch.cheatSheet.content)}</p>
          ${ch.cheatSheet.code ? `<pre class="code"><code>${esc(ch.cheatSheet.code)}</code></pre>` : ''}
        </section>
      </div>
      <aside class="panel feynman c-${c.id}">
        <span class="panel-label">Feynman-Technik</span>
        <p class="feynman-prompt">${esc(ch.feynman.prompt)}</p>
        <textarea id="feynText" data-chapter="${esc(ch.id)}" rows="8" aria-label="Deine Erklärung" placeholder="Erkläre es so einfach, dass es ein Erstsemester versteht …">${esc(f.text)}</textarea>
        <p class="mini">✓ Wird beim Tippen automatisch gespeichert.</p>
        <div class="rubric-head"><span class="panel-label">Selbstcheck</span><b id="feynScore">${f.checkedPoints.length}/${ch.feynman.rubric.length}</b></div>
        <ul class="rubric">
          ${ch.feynman.rubric.map((r, i) => `<li><label class="check">
            <input type="checkbox" data-rubric="${i}" data-chapter="${esc(ch.id)}" ${f.checkedPoints.includes(i) ? 'checked' : ''}>
            <span class="check-box" aria-hidden="true"></span><span>${esc(r)}</span></label></li>`).join('')}
        </ul>
      </aside>
    </div>
    <nav class="pager">
      ${prev ? `<a class="btn" href="#kapitel/${encodeURIComponent(prev.id)}">← ${esc(prev.title)}</a>` : '<span></span>'}
      ${next ? `<a class="btn" href="#kapitel/${encodeURIComponent(next.id)}">${esc(next.title)} →</a>` : ''}
    </nav>`;
}

/* ---------- View: E-Mail Coach ---------- */

function viewEmail() {
  const prompts = ENGLISH_DATA.emailPrompts;
  const p = prompts[em.idx];
  const dg = DIAGRAMS['gpas-email'];
  view.innerHTML = `
    ${viewHead('E-Mail<br>Coach', 'GPAS-Training für die Englisch-Klausur: semi-formale E-Mail, 120–180 Wörter. Die Checkliste stempelt live beim Tippen.')}
    <div class="chips">${prompts.map((pp, i) => `<button type="button" class="chip${i === em.idx ? ' is-active' : ''}" data-action="email-scenario" data-i="${i}" aria-pressed="${i === em.idx}">
      <span>${String(i + 1).padStart(2, '0')} · ${esc(pp.title)}</span></button>`).join('')}</div>
    <div class="split">
      <div class="split-left">
        <article class="panel scenario">
          <span class="sticker sticker-tilt">Szenario</span>
          <h2>${esc(p.title)}</h2>
          <p class="pre" lang="en">${esc(p.scenario)}</p>
        </article>
        <div class="panel editor">
          <label class="panel-label" for="emailInput">Deine E-Mail</label>
          <textarea id="emailInput" lang="en" spellcheck="true" placeholder="Dear Ms Miller,&#10;&#10;thank you for your email …">${esc(em.drafts[p.id] || '')}</textarea>
        </div>
      </div>
      <aside class="split-right panel" id="emailFeedback" aria-live="polite"></aside>
    </div>
    <section class="panel diagram-box"><span class="panel-label">${esc(dg.title)}</span>${dg.svg}</section>`;
  renderEmailFeedback();
}

function renderEmailFeedback() {
  const box = $('#emailFeedback');
  if (!box) return;
  const p = ENGLISH_DATA.emailPrompts[em.idx];
  const a = analyzeEmail(em.drafts[p.id] || '', p);
  const state = a.words === 0 ? 'Leg los!' : a.wordsOk ? '✓ im Zielbereich' : a.words < 110 ? 'zu kurz' : 'zu lang';
  box.innerHTML = `
    <div class="wc${a.wordsOk ? ' is-ok' : ''}">
      <div class="wc-num">${a.words}</div>
      <div class="wc-meta"><strong>Wörter</strong><span>Ziel 120–180</span><span class="wc-state">${state}</span></div>
      <div class="wc-track" aria-hidden="true"><i class="wc-band"></i><i class="wc-pos" style="--x:${Math.min(100, (a.words / 250) * 100)}%"></i></div>
    </div>
    <div class="score-line"><span class="panel-label">Checkliste</span><b>${a.score}/${a.checks.length}</b></div>
    <ul class="stamps">
      ${a.checks.map((c, i) => `<li class="stamp-item ${c.ok ? 'is-ok' : 'is-no'}" style="--rot:${(i % 3) * 4 - 4}deg">
        <span class="stamp">${c.ok ? '✓' : '✗'}</span><span lang="en">${esc(c.label)}</span></li>`).join('')}
    </ul>
    <div class="kw">
      <div class="score-line"><span class="panel-label">Keywords</span><b>${a.kwHits}/${a.keywords.length}</b></div>
      <div class="kw-list" lang="en">${a.keywords.map(k => `<span class="kw-chip${k.hit ? ' is-hit' : ''}">${k.hit ? '✓ ' : ''}${esc(k.word)}</span>`).join('')}</div>
    </div>`;
}

/* ---------- View: Spickzettel ---------- */

function viewSpick() {
  const pins = store.state.pinnedCheatSheet;
  view.innerHTML = `
    ${viewHead('Spick<br>zettel', 'Dein DIN-A4-Hilfsmittel: Kapitel pinnen, kompakt in zwei Spalten drucken. GP1 erlaubt ein einseitig bedrucktes Blatt, in ICS dient er als Vorlage zum Abschreiben.')}
    <div class="toolbar">
      <button type="button" class="btn" data-action="pins-load" data-courses="gdp1">+ GP1 Essentials</button>
      <button type="button" class="btn" data-action="pins-load" data-courses="ics">+ ICS Essentials</button>
      <button type="button" class="btn" data-action="pins-load" data-courses="${COURSES.map(c => c.id).join(',')}">+ Alle Essentials</button>
      <button type="button" class="btn btn-pink" data-action="pins-clear" ${pins.length ? '' : 'disabled'}>✕ Leeren</button>
      <button type="button" class="btn btn-yellow" data-action="print" ${pins.length ? '' : 'disabled'}>⎙ Drucken</button>
    </div>
    <div class="sheet-wrap">
      <article class="sheet" id="sheet">
        <header class="sheet-head"><strong>Spickzettel WS 26/27</strong><span>${pins.length} ${pins.length === 1 ? 'Eintrag' : 'Einträge'} · DIN A4</span></header>
        ${pins.length
          ? `<div class="sheet-cols">${pins.map(p => `<section class="entry c-${esc(p.courseId)}">
              <header><span class="tag tag-course">${esc(courseMeta(p.courseId).short)}</span><h3>${esc(p.title)}</h3>
              <button type="button" class="unpin" data-action="unpin" data-id="${esc(p.id)}" aria-label="${esc(p.title)} entfernen">×</button></header>
              <p>${esc(p.content)}</p>
              ${p.code ? `<pre>${esc(p.code)}</pre>` : ''}
            </section>`).join('')}</div>`
          : '<div class="sheet-empty">Noch leer. Pinne Kapitel über „📌 Auf den Spickzettel“ in der Kapitelansicht — oder lade oben die Essentials.</div>'}
      </article>
    </div>`;
}

/* ---------- View: Methoden & Backup ---------- */

const METHODS = [
  { name: 'Spaced Repetition', tone: 'yellow', href: '#karten', go: 'Karten',
    text: 'Wiederholen in wachsenden Abständen (SM-2-Algorithmus). Die Karte kommt genau dann zurück, wenn du sie fast vergessen hättest — das verankert Wissen langfristig.' },
  { name: 'Active Recall', tone: 'pink', href: '#karten', go: 'Karten',
    text: 'Erst selbst aus dem Gedächtnis abrufen, dann aufdecken. Der Abrufversuch ist der eigentliche Lernvorgang — Wiederlesen erzeugt nur ein Gefühl von Wissen.' },
  { name: 'Interleaving', tone: 'cyan', href: '#board', go: 'Mix-Session',
    text: 'Kurse gemischt statt geblockt üben. Fühlt sich schwerer an, trainiert aber genau das, was die Klausur verlangt: den passenden Lösungsweg selbst erkennen.' },
  { name: 'Dual Coding', tone: 'lime', href: '#kurs/gdp1', go: 'Kapitel',
    text: 'Wort und Bild verknüpfen: Die Diagramme in den Kapiteln geben dem Text eine visuelle Struktur — zwei Gedächtnisspuren statt einer.' },
  { name: 'Feynman & Kalibrierung', tone: 'violet', href: '#quiz', go: 'Quiz',
    text: 'Erkläre ein Thema in einfachen Worten und prüfe dich an der Rubrik. Im Quiz schätzt du deine Sicherheit ein: Fehler mit „100% sicher“ (Hypercorrection) bleiben am besten hängen.' },
];

const SHORTCUTS = [
  ['Leertaste', 'Karte aufdecken'],
  ['1 – 4', 'Karte bewerten: Nochmal · Schwer · Gut · Einfach'],
  ['← / →', 'Karte: Nochmal / Gut (auch per Ziehen)'],
  ['1 – 4', 'Quiz: Antwort A–D wählen'],
  ['Enter', 'Quiz: Antwort prüfen / nächste Frage'],
];

function viewMethods() {
  const st = cardStats();
  view.innerHTML = `
    ${viewHead('Metho<br>den', 'Fünf evidenzbasierte Lernprinzipien stecken in diesem Board. Dazu: deine Daten sichern, importieren oder neu starten.')}
    <div class="methods">
      ${METHODS.map((m, i) => `<article class="method m-${m.tone}">
        <span class="method-n">${String(i + 1).padStart(2, '0')}</span>
        <h2>${esc(m.name)}</h2>
        <p>${esc(m.text)}</p>
        <a class="btn" href="${m.href}">${esc(m.go)} →</a>
      </article>`).join('')}
    </div>
    <div class="methods-bottom">
      <section class="panel">
        <span class="panel-label">Dein Stand</span>
        <div class="card-stats card-stats-big">
          <span><b>${st.new}</b> neu</span><span><b>${st.learning}</b> lernend</span>
          <span><b>${st.due}</b> Wdh. fällig</span><span><b>${st.mastered}</b> sicher</span>
        </div>
        <span class="panel-label">Kalibrierung (Quiz)</span>
        ${calibrationTable()}
      </section>
      <section class="panel">
        <span class="panel-label">Backup</span>
        <p>Der Fortschritt liegt nur in diesem Browser (localStorage) und wird mit den anderen Versionen geteilt.</p>
        <div class="btn-row btn-col">
          <button type="button" class="btn btn-yellow" data-action="backup-download">⇩ Backup herunterladen</button>
          <label class="btn file-btn">⇧ Backup importieren<input type="file" id="importFile" accept="application/json,.json"></label>
          <button type="button" class="btn btn-pink" data-action="reset">✕ Fortschritt zurücksetzen</button>
        </div>
      </section>
      <section class="panel">
        <span class="panel-label">Tastenkürzel</span>
        <dl class="keys">${SHORTCUTS.map(([k, d]) => `<div><dt><kbd>${esc(k)}</kbd></dt><dd>${esc(d)}</dd></div>`).join('')}</dl>
        <p class="mini">Kürzel sind aus, solange du in einem Textfeld tippst.</p>
      </section>
    </div>`;
}

/* ---------- Router ---------- */

const VIEWS = {
  board: viewBoard,
  karten: viewCards,
  quiz: viewQuiz,
  kurs: viewCourse,
  kapitel: viewChapter,
  email: viewEmail,
  spick: viewSpick,
  methoden: viewMethods,
};

function render() {
  const [name = '', ...rest] = decodeURIComponent(location.hash.slice(1)).split('/');
  route = { name: VIEWS[name] ? name : 'board', arg: rest.join('/') };
  VIEWS[route.name](route.arg);
  const tab = route.name === 'kapitel' ? 'kurs' : route.name;
  document.querySelectorAll('#tabs [data-tab]').forEach(a => {
    const on = a.dataset.tab === tab;
    a.classList.toggle('is-active', on);
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
}

function go(hash) {
  if (location.hash === hash) render();
  else location.hash = hash;
}

window.addEventListener('hashchange', () => {
  render();
  window.scrollTo(0, 0);
});

/* ---------- Events ---------- */

view.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el || !view.contains(el)) return;
  const d = el.dataset;
  switch (d.action) {
    case 'start-cards': startCards(d.course); go('#karten'); break;
    case 'start-quiz': startQuiz(d.course); go('#quiz'); break;
    case 'cards-filter': startCards(d.course); viewCards(); break;
    case 'cards-all': startCards(cs.course, true); renderDeck(); break;
    case 'reveal': reveal(); break;
    case 'rate': commitRating(Number(d.rating)); break;
    case 'quiz-filter': startQuiz(d.course); viewQuiz(); break;
    case 'quiz-select': if (!qs.result) { qs.selected = Number(d.i); renderQuiz(); } break;
    case 'quiz-conf': qs.confidence = d.conf; renderQuiz(); break;
    case 'quiz-submit': quizSubmit(); break;
    case 'quiz-next': quizNext(); break;
    case 'quiz-restart': startQuiz(qs.course); renderQuiz(); break;
    case 'pin': {
      const ch = ALL_CHAPTERS.find(x => x.id === d.chapter);
      const pinned = togglePinChapter(ch);
      el.classList.toggle('is-pinned', pinned);
      el.setAttribute('aria-pressed', String(pinned));
      el.textContent = pinned ? '✓ Auf dem Spickzettel' : '📌 Auf den Spickzettel';
      toast(pinned ? 'Auf den Spickzettel gepinnt.' : 'Vom Spickzettel entfernt.', pinned ? 'lime' : 'pink');
      break;
    }
    case 'email-scenario': em.idx = Number(d.i); viewEmail(); break;
    case 'pins-load': {
      const before = store.state.pinnedCheatSheet.length;
      loadCoursePins(d.courses.split(','));
      const added = store.state.pinnedCheatSheet.length - before;
      toast(added ? `${added} Einträge hinzugefügt.` : 'Alles schon auf dem Zettel.', added ? 'lime' : 'yellow');
      viewSpick();
      break;
    }
    case 'pins-clear': clearPins(); toast('Spickzettel geleert.', 'pink'); viewSpick(); break;
    case 'unpin': store.togglePin({ id: d.id }); viewSpick(); break;
    case 'print': window.print(); break;
    case 'backup-download': downloadBackup(); toast('Backup heruntergeladen.', 'lime'); break;
    case 'reset':
      if (window.confirm('Wirklich den gesamten Lernfortschritt löschen? Das kann nicht rückgängig gemacht werden.')) {
        resetProgress();
        resetSessions();
        toast('Fortschritt zurückgesetzt.', 'pink');
        render();
      }
      break;
    default: break;
  }
});

view.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'feynText') saveFeynmanText(t.dataset.chapter, t.value);
  if (t.id === 'emailInput') {
    em.drafts[ENGLISH_DATA.emailPrompts[em.idx].id] = t.value;
    renderEmailFeedback();
  }
});

view.addEventListener('change', async e => {
  const t = e.target;
  if (t.matches('input[data-rubric]')) {
    toggleFeynmanPoint(t.dataset.chapter, Number(t.dataset.rubric), t.checked);
    const ch = ALL_CHAPTERS.find(x => x.id === t.dataset.chapter);
    $('#feynScore').textContent = `${getFeynman(ch.id).checkedPoints.length}/${ch.feynman.rubric.length}`;
  }
  if (t.id === 'importFile' && t.files[0]) {
    try {
      await importBackup(t.files[0]);
      resetSessions();
      toast('Backup importiert.', 'lime');
      render();
    } catch {
      toast('Import fehlgeschlagen: keine gültige Backup-Datei.', 'pink');
      t.value = '';
    }
  }
});

document.addEventListener('keydown', e => {
  const t = e.target;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (t.closest('input, textarea, select, [contenteditable="true"]')) return;
  const isSpace = e.key === ' ' || e.code === 'Space';
  // Let focused controls keep their native activation (Space: buttons/labels, Enter: also links).
  if (isSpace && t.closest('button, label')) return;
  if (e.key === 'Enter' && t.closest('button, a, label')) return;

  if (route.name === 'karten' && cs.queue && cs.queue[0]) {
    if (isSpace) {
      e.preventDefault();
      reveal();
    } else if (cs.revealed && ['1', '2', '3', '4'].includes(e.key)) {
      commitRating(Number(e.key));
    } else if (cs.revealed && e.key === 'ArrowLeft') {
      commitRating(1);
    } else if (cs.revealed && e.key === 'ArrowRight') {
      commitRating(3);
    }
  } else if (route.name === 'quiz' && qs.queue && qs.queue[qs.idx]) {
    const q = qs.queue[qs.idx];
    const n = Number(e.key);
    if (!qs.result && n >= 1 && n <= q.options.length) {
      qs.selected = n - 1;
      renderQuiz();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (qs.result) quizNext(); else quizSubmit();
    }
  }
});

$('#themeBtn').addEventListener('click', () => store.toggleTheme());

/* ---------- Boot ---------- */

store.subscribe(renderChrome);
renderChrome();
renderPomo(pomo);
render();
