// StudyOS · Zen — calm, editorial single-column UI on top of the shared domain layer.
import {
  COURSES_META, ENGLISH_DATA, DIAGRAMS, store, ALL_DATA, ALL_QUIZZES, ALL_CHAPTERS,
  courseMeta, escapeHtml as esc, pdfHref, getDueCards, buildFlashcardQueue, rateCard, intervalsFor,
  RATING_LABELS, cardStats, buildQuizQueue, CONFIDENCE_LEVELS, submitQuiz, calibrationStats,
  getCourseMastery, overallMastery, todayProgress, activityHistory, streakLabel, allDeadlines,
  formatDate, daysLeftLabel, getFeynman, saveFeynmanText, toggleFeynmanPoint, togglePinChapter,
  loadCoursePins, clearPins, analyzeEmail, downloadBackup, importBackup, resetProgress, Pomodoro,
} from '../shared/core.js';

const $ = (sel, root = document) => root.querySelector(sel);
const viewEl = $('#view');
const CHAPTERS = new Map(ALL_CHAPTERS.map(c => [c.id, c]));
const IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

const VIEWS = [
  { id: 'heute', label: 'Heute', hint: 'Tagesbrief & nächster Schritt' },
  { id: 'karten', label: 'Karteikarten', hint: 'Spaced Repetition (SM-2)' },
  { id: 'quiz', label: 'Quiz', hint: 'Active Recall & Kalibrierung' },
  { id: 'kurse', label: 'Kurse', hint: 'Kapitel, Feynman & PDFs' },
  { id: 'email', label: 'E-Mail-Coach', hint: 'GPAS Exam Email' },
  { id: 'blatt', label: 'Spickzettel', hint: 'DIN A4 zum Drucken' },
  { id: 'methode', label: 'Methode & Backup', hint: 'Lernmethoden, Statistik, Datensicherung' },
];

/* ---------- session state (UI only; progress lives in the shared store) ---------- */

const S = {
  fc: { course: 'all', includeAll: false, queue: null, revealed: false, done: 0 },
  quiz: { course: 'all', queue: null, idx: 0, selected: null, confidence: 'medium', result: null, correct: 0, answered: 0 },
  email: { idx: 0, drafts: {} },
};

/* ---------- small helpers ---------- */

const dueCount = (course) => getDueCards(course).length;
const dot = (courseId) => `<span class="cdot" style="--c:${courseMeta(courseId).color}" aria-hidden="true"></span>`;
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function listJoin(items) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} und ${items[items.length - 1]}`;
}

function pageHead(eyebrow, title, lede = '') {
  return `<header class="page-head">
    <p class="eyebrow">${eyebrow}</p>
    <h1 class="title">${title}</h1>
    ${lede ? `<p class="lede">${lede}</p>` : ''}
  </header>`;
}

function sect(title, aside = '') {
  return `<div class="sect"><h2 class="sect-title">${title}</h2>${aside ? `<span class="sect-aside">${aside}</span>` : ''}</div>`;
}

function meter(pct, color) {
  return `<span class="meter" ${color ? `style="--c:${color}"` : ''}><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></span>`;
}

function toast(msg) {
  const host = $('#toasts');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  host.appendChild(el);
  requestAnimationFrame(() => el.classList.add('in'));
  setTimeout(() => {
    el.classList.remove('in');
    setTimeout(() => el.remove(), 400);
  }, 2800);
}

/* ---------- routing ---------- */

function parseRoute() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const view = VIEWS.some(v => v.id === parts[0]) ? parts[0] : 'heute';
  return { view, args: view === parts[0] ? parts.slice(1) : [] };
}

function go(hash) {
  if (location.hash === hash) render({ scroll: true });
  else location.hash = hash;
}

let lastRouteKey = '';

function render({ scroll = false } = {}) {
  const { view, args } = parseRoute();
  const key = `${view}/${args[0] || ''}`;
  const routeChanged = key !== lastRouteKey;
  lastRouteKey = key;
  // Fade in only on real navigation; in-place updates (rating, selecting) stay still.
  const enter = routeChanged || scroll;
  viewEl.innerHTML = `<div class="page page-${view}${enter ? ' enter' : ''}">${RENDERERS[view](args)}</div>`;
  const nav = $('#topnav');
  nav.querySelectorAll('a').forEach(a => {
    const on = a.dataset.view === view;
    a.classList.toggle('on', on);
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    // On narrow screens the nav row scrolls sideways; keep the current entry in sight.
    if (on && nav.scrollWidth > nav.clientWidth) nav.scrollLeft = Math.max(0, a.offsetLeft - nav.offsetLeft - 20);
  });
  if (view === 'kurse' && args[1]) {
    requestAnimationFrame(() => scrollToChapter(args[1], routeChanged ? 'auto' : 'smooth'));
  } else if (scroll || routeChanged) {
    window.scrollTo(0, 0);
  }
  updateBadges();
}

const refresh = () => render();

function scrollToChapter(id, behavior = 'smooth') {
  const el = document.getElementById(`ch-${id}`);
  if (!el) return;
  el.scrollIntoView({ behavior, block: 'start' });
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
}

/* ---------- Heute ---------- */

function nextStep(due) {
  if (due > 0) {
    const courses = COURSES_META.filter(c => dueCount(c.id) > 0).map(c => c.short);
    return {
      title: `${plural(due, 'fällige Karte', 'fällige Karten')} wiederholen`,
      text: `Gemischt aus ${listJoin(courses)}. Interleaving zwingt dich, bei jeder Karte neu die passende Lösungsstrategie abzurufen – genau das, was die Klausur verlangt.`,
      act: 'start-interleaved', label: 'Interleaved Session starten',
    };
  }
  const open = ALL_QUIZZES.filter(q => !store.state.quizHistory[q.id]?.lastCorrect);
  if (open.length) {
    return {
      title: `${plural(open.length, 'Quizfrage ist', 'Quizfragen sind')} noch offen`,
      text: 'Alle Karten sind wiederholt. Prüfe dein Wissen jetzt im gemischten Quiz – mit ehrlicher Selbsteinschätzung vor jeder Antwort.',
      act: 'start-quiz', label: 'Quiz starten',
    };
  }
  const byMastery = [...COURSES_META].sort((a, b) => getCourseMastery(a.id) - getCourseMastery(b.id));
  for (const c of byMastery) {
    const ch = ALL_DATA[c.id].chapters.find(x => getFeynman(x.id).checkedPoints.length < x.feynman.rubric.length);
    if (ch) {
      return {
        title: `Erkläre „${esc(ch.title)}“ in eigenen Worten`,
        text: esc(ch.feynman.prompt),
        act: 'go', href: `#/kurse/${c.id}/${ch.id}`, label: 'Zum Kapitel',
      };
    }
  }
  return {
    title: 'Für heute ist alles getan.',
    text: 'Karten, Quiz und Feynman-Erklärungen sind auf dem neuesten Stand. Feile am Spickzettel – oder gönn dir eine echte Pause.',
    act: 'go', href: '#/blatt', label: 'Zum Spickzettel',
  };
}

function renderHeute() {
  const now = new Date();
  const h = now.getHours();
  const greet = h < 5 ? 'Gute Nacht' : h < 11 ? 'Guten Morgen' : h < 14 ? 'Guten Tag' : h < 18 ? 'Guten Nachmittag' : h < 23 ? 'Guten Abend' : 'Gute Nacht';
  const date = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(now);
  const due = dueCount('all');
  const tp = todayProgress();
  const deadlines = allDeadlines();
  const next = deadlines[0];
  const step = nextStep(due);
  const hist = activityHistory(7);
  const maxT = Math.max(1, ...hist.map(d => d.total));
  const weekTotal = hist.reduce((a, d) => a + d.total, 0);
  const weekMin = hist.reduce((a, d) => a + d.minutes, 0);

  const nextSentence = next
    ? ` Als Nächstes steht <em>${esc(next.label)}</em> an – ${next.daysLeft === 0 ? 'schon heute' : next.daysLeft === 1 ? 'morgen' : `in ${next.daysLeft} Tagen`}.`
    : '';

  const stepAct = step.act === 'go' ? `data-act="go" data-href="${step.href}"` : `data-act="${step.act}"`;

  return `
  <header class="page-head letter-head">
    <p class="eyebrow">${esc(date)}</p>
    <h1 class="title greeting">${greet}.</h1>
  </header>

  <p class="letter">
    ${due
      ? `Heute warten <strong>${plural(due, 'Karte', 'Karten')}</strong> auf eine Wiederholung.`
      : 'Heute ist keine Karte fällig – dein Gedächtnis ist auf dem neuesten Stand.'}
    Von deinem Tagesziel hast du <strong>${tp.done} von ${tp.goal}</strong> erledigt${tp.done ? ` (${plural(tp.reviews, 'Karte', 'Karten')}, ${plural(tp.quizzes, 'Quizfrage', 'Quizfragen')})` : ''},
    deine Lernserie steht bei <strong>${streakLabel()}</strong>.${nextSentence}
  </p>

  <div class="today" aria-label="Tagesziel">
    ${meter(tp.pct)}
    <span class="today-label">${tp.pct} % des Tagesziels · ${tp.minutes} Fokusminuten heute</span>
  </div>

  <section class="step">
    <p class="eyebrow accent">Dein nächster Schritt</p>
    <h2 class="step-title">${step.title}</h2>
    <p class="step-text">${step.text}</p>
    <div class="step-actions">
      <button class="btn primary" type="button" ${stepAct}>${step.label} <span aria-hidden="true">→</span></button>
      <span class="step-alt">oder
        ${step.act !== 'start-interleaved' ? '<button class="link" type="button" data-act="start-interleaved">Interleaved Session</button> ·' : ''}
        ${step.act !== 'start-quiz' ? '<button class="link" type="button" data-act="start-quiz">Quiz</button> ·' : ''}
        <button class="link" type="button" data-act="palette">alles andere</button>
      </span>
    </div>
  </section>

  ${sect('Was ansteht', `${deadlines.length} Termine`)}
  <ul class="rows deadlines">
    ${deadlines.slice(0, 6).map(d => `
      <li class="row deadline ${d.urgent || d.daysLeft <= 2 ? 'urgent' : ''}">
        <span class="dl-date">${formatDate(d.date)}</span>
        <span class="dl-label">${dot(d.courseId)}${esc(d.label)}</span>
        <span class="dl-left">${daysLeftLabel(d.daysLeft)}</span>
      </li>`).join('') || '<li class="row muted">Keine anstehenden Termine.</li>'}
  </ul>

  ${sect('Deine Kurse', `Gesamt ${overallMastery()} %`)}
  <ul class="rows courses">
    ${COURSES_META.map(c => {
      const m = getCourseMastery(c.id);
      const d = dueCount(c.id);
      return `<li><a class="row course-row" href="#/kurse/${c.id}">
        <span class="cr-short" style="--c:${c.color}">${esc(c.short)}</span>
        <span class="cr-title">${esc(c.title)}</span>
        <span class="cr-meter">${meter(m, c.color)}</span>
        <span class="cr-pct">${m} %</span>
        <span class="cr-due">${d ? `${d} fällig` : 'erledigt'}</span>
      </a></li>`;
    }).join('')}
  </ul>

  ${sect('Die letzten sieben Tage', `${plural(weekTotal, 'Aufgabe', 'Aufgaben')} · ${weekMin} Min Fokus`)}
  <div class="week" role="img" aria-label="Aktivität der letzten sieben Tage">
    ${hist.map((d, i) => `
      <div class="week-day ${i === hist.length - 1 ? 'is-today' : ''}" title="${d.label}: ${d.reviews} Karten, ${d.quizzes} Quiz, ${d.minutes} Min">
        <span class="week-n">${d.total || ''}</span>
        <span class="week-bar"><i style="height:${Math.round((d.total / maxT) * 100)}%"></i></span>
        <span class="week-wd">${d.weekday}</span>
      </div>`).join('')}
  </div>

  <p class="signoff">Eins nach dem anderen.</p>`;
}

/* ---------- Karteikarten ---------- */

function ensureFc() {
  if (S.fc.queue) return;
  S.fc.queue = buildFlashcardQueue(S.fc.course, S.fc.includeAll);
  S.fc.revealed = false;
  S.fc.done = 0;
}

function startCards(course = 'all', includeAll = false) {
  Object.assign(S.fc, { course, includeAll, queue: null });
  go('#/karten');
}

function ratingsHtml(card) {
  const iv = intervalsFor(card);
  return `<div class="ratings" role="group" aria-label="Wie gut wusstest du es?">
    ${RATING_LABELS.map(r => `
      <button class="rate rate-${r.value}" type="button" data-act="fc-rate" data-r="${r.value}">
        <span class="rate-label">${r.label}</span>
        <span class="rate-int">${esc(iv[r.value])}</span>
        <kbd>${r.key}</kbd>
      </button>`).join('')}
  </div>`;
}

function renderKarten() {
  ensureFc();
  const f = S.fc;
  const card = f.queue[0];
  const tabs = [{ id: 'all', label: 'Gemischt' }, ...COURSES_META.map(c => ({ id: c.id, label: c.short }))]
    .map(x => `<button class="tab ${f.course === x.id ? 'on' : ''}" type="button" data-act="fc-filter" data-course="${x.id}">
      ${x.id !== 'all' ? dot(x.id) : ''}${esc(x.label)}<span class="tab-n">${dueCount(x.id)}</span></button>`).join('');
  const lede = f.course === 'all'
    ? 'Alle Kurse verschachtelt – fällige Karten zuerst, nie zweimal dasselbe Thema hintereinander.'
    : esc(courseMeta(f.course).title);
  const head = pageHead('Spaced Repetition', 'Karteikarten', lede)
    + `<nav class="tabs" aria-label="Kursfilter">${tabs}</nav>`;

  if (!card) {
    return `${head}
    <div class="empty">
      <p class="empty-mark" aria-hidden="true">○</p>
      <h2 class="empty-title">${f.includeAll ? 'Alle Karten durchgearbeitet.' : 'Für den Moment ist alles wiederholt.'}</h2>
      <p class="empty-text">${f.done ? `Du hast in dieser Sitzung ${plural(f.done, 'Bewertung', 'Bewertungen')} abgegeben. ` : ''}Neue Wiederholungen werden fällig, kurz bevor du sie vergessen würdest. Freies Üben ist trotzdem jederzeit möglich.</p>
      <div class="actions">
        <button class="btn primary" type="button" data-act="fc-all">Alle Karten nochmal üben</button>
        <button class="btn" type="button" data-act="go" data-href="#/quiz">Weiter zum Quiz</button>
      </div>
    </div>`;
  }

  const total = f.done + f.queue.length;
  const ch = CHAPTERS.get(card.chapterId);
  const meta = courseMeta(card.courseId);
  const top = `<div class="card-top">
      <span class="card-tag">${dot(card.courseId)}${esc(meta.short)}${ch ? ` · ${esc(ch.title)}` : ''}</span>
      ${card.examRelevant ? '<span class="card-exam">Klausurrelevant</span>' : ''}
    </div>`;

  return `${head}
  <div class="session">
    <span>${f.includeAll ? 'Freies Üben' : 'Fällige Karten'} · noch ${f.queue.length}</span>
    <span>${plural(f.done, 'Bewertung', 'Bewertungen')}</span>
  </div>
  ${meter(total ? (f.done / total) * 100 : 0)}

  <div class="card3d ${f.revealed ? 'is-flipped' : ''}" data-act="fc-reveal" role="button" tabindex="0"
       aria-label="${f.revealed ? 'Karte wenden' : 'Antwort aufdecken'}">
    <div class="card-inner">
      <div class="face front">
        ${top}
        <p class="card-q">${esc(card.front)}</p>
        <p class="card-hint">Erst erinnern, dann umdrehen.</p>
      </div>
      <div class="face back" aria-hidden="${!f.revealed}">
        ${top}
        <p class="card-q-small">${esc(card.front)}</p>
        <div class="card-a">${esc(card.back)}</div>
      </div>
    </div>
  </div>

  <div id="fc-actions" class="fc-actions">
    ${f.revealed ? ratingsHtml(card) : `<button class="btn ghost" type="button" data-act="fc-reveal">Antwort zeigen <kbd>Leertaste</kbd></button>`}
  </div>`;
}

function revealCard() {
  const f = S.fc;
  const card = f.queue?.[0];
  if (!card) return;
  const el = $('.card3d');
  if (f.revealed) {
    el?.classList.toggle('is-flipped');
    return;
  }
  f.revealed = true;
  el?.classList.add('is-flipped');
  el?.setAttribute('aria-label', 'Karte wenden');
  $('.face.back')?.setAttribute('aria-hidden', 'false');
  $('#fc-actions').innerHTML = ratingsHtml(card);
}

function rate(r) {
  const f = S.fc;
  if (!f.revealed || !f.queue?.length) return;
  const card = f.queue.shift();
  if (rateCard(card, r)) {
    f.queue.push(card);
    toast('Die Karte kommt am Ende der Sitzung noch einmal.');
  }
  f.done += 1;
  f.revealed = false;
  refresh();
}

/* ---------- Quiz ---------- */

function ensureQuiz() {
  if (S.quiz.queue) return;
  Object.assign(S.quiz, {
    queue: buildQuizQueue(S.quiz.course), idx: 0, selected: null, confidence: 'medium', result: null, correct: 0, answered: 0,
  });
}

function startQuiz(course = 'all') {
  Object.assign(S.quiz, { course, queue: null });
  go('#/quiz');
}

const LETTERS = 'ABCDEFGH';

function renderQuiz() {
  ensureQuiz();
  const z = S.quiz;
  const tabs = [{ id: 'all', label: 'Gemischt' }, ...COURSES_META.map(c => ({ id: c.id, label: c.short }))]
    .map(x => {
      const n = x.id === 'all' ? ALL_QUIZZES.length : ALL_QUIZZES.filter(q => q.courseId === x.id).length;
      return `<button class="tab ${z.course === x.id ? 'on' : ''}" type="button" data-act="q-filter" data-course="${x.id}">
        ${x.id !== 'all' ? dot(x.id) : ''}${esc(x.label)}<span class="tab-n">${n}</span></button>`;
    }).join('');
  const head = pageHead('Active Recall', 'Quiz',
    'Erst schätzen, wie sicher du bist – dann prüfen. So deckst du Kompetenz-Illusionen auf.')
    + `<nav class="tabs" aria-label="Kursfilter">${tabs}</nav>`;

  if (z.idx >= z.queue.length) {
    const pct = z.answered ? Math.round((z.correct / z.answered) * 100) : 0;
    return `${head}
    <div class="empty">
      <p class="empty-mark" aria-hidden="true">○</p>
      <h2 class="empty-title">Runde beendet.</h2>
      <p class="empty-text">${z.queue.length
        ? `Du hast <strong>${z.correct} von ${z.answered}</strong> Fragen richtig beantwortet (${pct} %). Falsche Antworten mit hoher Sicherheit prägen sich beim nächsten Mal besonders gut ein.`
        : 'Für diesen Filter gibt es keine Fragen.'}</p>
      <div class="actions">
        <button class="btn primary" type="button" data-act="q-restart">Noch eine Runde</button>
        <button class="btn" type="button" data-act="go" data-href="#/karten">Zu den Karten</button>
      </div>
    </div>`;
  }

  const q = z.queue[z.idx];
  const meta = courseMeta(q.courseId);
  const res = z.result;
  const options = q.options.map((o, i) => {
    let cls = 'opt';
    if (z.selected === i) cls += ' sel';
    if (res && i === q.answer) cls += ' correct';
    if (res && z.selected === i && !res.correct) cls += ' wrong';
    return `<li><button class="${cls}" type="button" data-act="q-opt" data-i="${i}" ${res ? 'disabled' : ''} aria-pressed="${z.selected === i}">
      <span class="opt-letter">${res && i === q.answer ? '✓' : LETTERS[i]}</span><span class="opt-text">${esc(o)}</span></button></li>`;
  }).join('');

  const conf = `<div class="confidence">
      <span class="conf-label">Wie sicher bist du?</span>
      <span class="conf-choices" role="group" aria-label="Sicherheit">
        ${CONFIDENCE_LEVELS.map(c => `<button class="tab ${z.confidence === c.value ? 'on' : ''}" type="button" data-act="q-conf" data-v="${c.value}" ${res ? 'disabled' : ''}>${c.label}</button>`).join('')}
      </span>
    </div>`;

  const feedback = res ? `
    <div class="verdict ${res.correct ? 'ok' : 'bad'}">
      <p class="verdict-title">${res.correct ? 'Richtig.' : `Nicht ganz – richtig ist ${LETTERS[q.answer]}.`}</p>
      ${res.overconfident ? `<p class="verdict-warn"><strong>Hypercorrection-Effekt:</strong> Du warst dir 100 % sicher und lagst daneben. Genau diese Überraschung sorgt dafür, dass du dir die richtige Antwort jetzt besonders gut merkst.</p>` : ''}
      <p class="verdict-expl">${esc(q.explanation)}</p>
    </div>
    <div class="actions"><button class="btn primary" type="button" data-act="q-next">${z.idx + 1 < z.queue.length ? 'Nächste Frage' : 'Runde abschließen'} <span aria-hidden="true">→</span></button>
    <span class="hint"><kbd>Enter</kbd></span></div>`
    : `<div class="actions"><button class="btn primary" type="button" data-act="q-submit" ${z.selected === null ? 'aria-disabled="true"' : ''}>Antwort prüfen</button>
      <span class="hint"><kbd>1</kbd>–<kbd>${q.options.length}</kbd> wählen · <kbd>Enter</kbd> prüfen</span></div>`;

  return `${head}
  <div class="session">
    <span>Frage ${z.idx + 1} von ${z.queue.length}</span>
    <span>${z.correct} richtig</span>
  </div>
  ${meter((z.idx / z.queue.length) * 100)}

  <article class="question">
    <p class="q-meta">${dot(q.courseId)}${esc(meta.short)}${q.examStyle ? ` · ${esc(q.examStyle)}` : ''}</p>
    <h2 class="q-text">${esc(q.question)}</h2>
    ${q.code ? `<pre class="code"><code>${esc(q.code)}</code></pre>` : ''}
    <ol class="options">${options}</ol>
    ${conf}
    ${feedback}
  </article>`;
}

function selectOption(i) {
  const z = S.quiz;
  const q = z.queue?.[z.idx];
  if (!q || z.result || i < 0 || i >= q.options.length) return;
  z.selected = i;
  refresh();
}

function submitAnswer() {
  const z = S.quiz;
  const q = z.queue?.[z.idx];
  if (!q || z.result) return;
  if (z.selected === null) { toast('Wähle zuerst eine Antwort.'); return; }
  z.result = submitQuiz(q, z.selected, z.confidence);
  z.answered += 1;
  if (z.result.correct) z.correct += 1;
  refresh();
}

function nextQuestion() {
  const z = S.quiz;
  if (!z.result) return;
  Object.assign(z, { idx: z.idx + 1, selected: null, result: null, confidence: 'medium' });
  render({ scroll: true });
}

/* ---------- Kurse ---------- */

function renderKurse(args) {
  const [courseId] = args;
  if (!courseId || !ALL_DATA[courseId]) return renderCourseIndex();
  return renderCourse(courseId);
}

function renderCourseIndex() {
  return `${pageHead('Vier Kurse · Wintersemester 26/27', 'Kurse', 'Zusammenfassungen, Diagramme und Feynman-Übungen – Kapitel für Kapitel.')}
  <ul class="rows course-index">
    ${COURSES_META.map(c => {
      const m = getCourseMastery(c.id);
      const n = ALL_DATA[c.id].chapters.length;
      const d = dueCount(c.id);
      return `<li><a class="row ci-row" href="#/kurse/${c.id}">
        <span class="ci-short" style="--c:${c.color}">${esc(c.short)}</span>
        <span class="ci-body">
          <span class="ci-title">${esc(c.title)}</span>
          <span class="ci-sub">${esc(c.subtitle)}</span>
          <span class="ci-meta">${plural(n, 'Kapitel', 'Kapitel')} · ${m} % beherrscht · ${d ? `${d} Karten fällig` : 'keine Karten fällig'}</span>
        </span>
        <span class="ci-arrow" aria-hidden="true">→</span>
      </a></li>`;
    }).join('')}
  </ul>`;
}

function pinLabel(on) {
  return on ? '✓ Auf dem Spickzettel' : 'An Spickzettel heften';
}

function chapterHtml(ch) {
  const fey = getFeynman(ch.id);
  const diag = ch.diagram && DIAGRAMS[ch.diagram];
  const pinned = store.isPinned(ch.cheatSheet.id);
  return `<article class="chapter" id="ch-${ch.id}">
    ${ch.badge ? `<p class="eyebrow">${esc(ch.badge)}</p>` : ''}
    <h2 class="chapter-title">${esc(ch.title)}</h2>
    <ul class="summary">${ch.summary.map(s => `<li>${s}</li>`).join('')}</ul>
    ${diag ? `<figure class="figure">
      <div class="figure-svg">${diag.svg}</div>
      <figcaption><span class="fig-n">Abb.</span> ${esc(diag.title)}</figcaption>
    </figure>` : ''}
    <section class="feynman">
      <p class="eyebrow">Feynman · Erkläre es einfach</p>
      <p class="feynman-prompt">${esc(ch.feynman.prompt)}</p>
      <textarea class="ruled" data-feynman="${ch.id}" rows="5" placeholder="Schreib, als würdest du es jemandem ohne Vorwissen erklären …">${esc(fey.text)}</textarea>
      <p class="feynman-status" id="fs-${ch.id}">${fey.text ? 'Gespeichert.' : 'Wird automatisch gespeichert.'}</p>
      <p class="rubric-head">Hast du das erwähnt? <span id="rc-${ch.id}">${fey.checkedPoints.length}/${ch.feynman.rubric.length}</span></p>
      <ul class="rubric">
        ${ch.feynman.rubric.map((r, i) => `<li><label>
          <input type="checkbox" data-rubric="${ch.id}" data-i="${i}" ${fey.checkedPoints.includes(i) ? 'checked' : ''}>
          <span>${esc(r)}</span></label></li>`).join('')}
      </ul>
    </section>
    <div class="chapter-foot">
      <button class="pin ${pinned ? 'on' : ''}" type="button" data-act="pin" data-ch="${ch.id}" aria-pressed="${pinned}">${pinLabel(pinned)}</button>
      <button class="link" type="button" data-act="to-top">Nach oben ↑</button>
    </div>
  </article>`;
}

function renderCourse(id) {
  const c = courseMeta(id);
  const data = ALL_DATA[id];
  const m = getCourseMastery(id);
  const d = dueCount(id);
  const nq = ALL_QUIZZES.filter(q => q.courseId === id).length;
  const ex = c.examInfo;
  const switcher = COURSES_META.map(x => `<a class="tab ${x.id === id ? 'on' : ''}" href="#/kurse/${x.id}">${dot(x.id)}${esc(x.short)}</a>`).join('');

  return `<nav class="tabs" aria-label="Kurs wechseln">${switcher}</nav>
  ${pageHead(`${esc(c.short)} · ${esc(c.prof)}`, esc(c.title), esc(c.subtitle))}

  <dl class="exam">
    <div><dt>Prüfung</dt><dd>${esc(ex.type)}</dd></div>
    <div><dt>Hilfsmittel</dt><dd>${esc(ex.aid)}</dd></div>
    <div><dt>Vorleistung</dt><dd>${esc(ex.pvl)}</dd></div>
    <div><dt>Zeitraum</dt><dd>${esc(ex.period)}</dd></div>
  </dl>

  <div class="course-progress">
    ${meter(m, c.color)}
    <span>${m} % beherrscht · ${d ? `${d} Karten fällig` : 'keine Karten fällig'}</span>
  </div>
  <div class="actions">
    <button class="btn primary" type="button" data-act="start-course-cards" data-course="${id}">Karten üben${d ? ` (${d})` : ''}</button>
    <button class="btn" type="button" data-act="start-quiz" data-course="${id}">Quiz · ${nq} Fragen</button>
  </div>

  ${sect('Inhalt', plural(data.chapters.length, 'Kapitel', 'Kapitel'))}
  <ol class="toc">
    ${data.chapters.map(ch => `<li><button type="button" data-act="jump" data-ch="${ch.id}">
      <span class="toc-title">${esc(ch.title)}</span>
      ${store.isPinned(ch.cheatSheet.id) ? '<span class="toc-pin" title="Auf dem Spickzettel">✓</span>' : ''}
    </button></li>`).join('')}
    <li><button type="button" data-act="jump" data-ch="pdfs"><span class="toc-title">Materialien &amp; PDFs</span></button></li>
  </ol>

  ${data.chapters.map(chapterHtml).join('')}

  <section class="pdfs" id="ch-pdfs">
    ${sect('Materialien', `${c.pdfs.length} PDFs`)}
    <ul class="rows">
      ${c.pdfs.map(p => `<li><a class="row pdf-row" href="${pdfHref(p.path)}" target="_blank" rel="noopener">
        <span class="pdf-tag">${esc(p.tag)}</span>
        <span class="pdf-title">${esc(p.title)}</span>
        <span class="pdf-arrow" aria-hidden="true">↗</span>
      </a></li>`).join('')}
    </ul>
  </section>`;
}

/* ---------- E-Mail-Coach ---------- */

function emailFeedback(text, prompt) {
  const a = analyzeEmail(text, prompt);
  const pos = Math.min(100, (a.words / 240) * 100);
  return `
    <div class="wc ${a.wordsOk ? 'ok' : a.words ? 'off' : ''}">
      <div class="wc-line">
        <span class="wc-n">${a.words}</span>
        <span class="wc-label">${a.words === 1 ? 'Wort' : 'Wörter'} · Ziel 120–180 ${a.words ? (a.wordsOk ? '· passt' : a.words < 110 ? '· noch zu kurz' : '· zu lang') : ''}</span>
      </div>
      <div class="wc-scale" aria-hidden="true">
        <span class="wc-band" style="left:${(120 / 240) * 100}%;width:${(60 / 240) * 100}%"></span>
        <span class="wc-mark" style="left:${pos}%"></span>
      </div>
    </div>
    <div class="fb-cols">
      <div>
        <p class="fb-head">Struktur <span>${a.score}/6</span></p>
        <ul class="checks">
          ${a.checks.map(c => `<li class="${c.ok ? 'ok' : ''}"><span class="ck" aria-hidden="true">${c.ok ? '✓' : '○'}</span>${esc(c.label)}</li>`).join('')}
        </ul>
      </div>
      <div>
        <p class="fb-head">Keywords <span>${a.kwHits}/${a.keywords.length}</span></p>
        <ul class="kws">
          ${a.keywords.map(k => `<li class="${k.hit ? 'hit' : ''}">${esc(k.word)}</li>`).join('')}
        </ul>
      </div>
    </div>`;
}

function renderEmail() {
  const prompts = ENGLISH_DATA.emailPrompts;
  const p = prompts[S.email.idx] || prompts[0];
  const text = S.email.drafts[p.id] || '';
  const gpas = DIAGRAMS['gpas-email'];
  return `${pageHead('English · Exam Practice', 'E-Mail-Coach', 'Schreib eine semi-formelle E-Mail nach dem GPAS-Schema. Die Rückmeldung entsteht live, während du schreibst.')}
  <nav class="tabs" aria-label="Szenario">
    ${prompts.map((x, i) => `<button class="tab ${x.id === p.id ? 'on' : ''}" type="button" data-act="email-prompt" data-i="${i}">${esc(x.title)}</button>`).join('')}
  </nav>

  <section class="scenario" lang="en">
    <p class="eyebrow">Scenario</p>
    <p class="scenario-text">${esc(p.scenario)}</p>
  </section>

  ${gpas ? `<figure class="figure figure-compact"><div class="figure-svg">${gpas.svg}</div><figcaption><span class="fig-n">Abb.</span> ${esc(gpas.title)}</figcaption></figure>` : ''}

  <div class="writer">
    <label class="eyebrow" for="email-ta">Deine E-Mail</label>
    <textarea id="email-ta" class="ruled email-ta" lang="en" data-email="${p.id}" spellcheck="true"
      placeholder="Dear Ms Miller,&#10;&#10;thank you for your email regarding …">${esc(text)}</textarea>
  </div>
  <section class="feedback" id="email-fb" aria-live="polite">${emailFeedback(text, p)}</section>`;
}

/* ---------- Spickzettel ---------- */

function sheetItemsHtml(items, { editable }) {
  return items.map(it => `
    <article class="sheet-item">
      <header class="sheet-item-head">
        <span class="sheet-course" style="--c:${courseMeta(it.courseId).color}">${esc(courseMeta(it.courseId).short)}</span>
        <h3>${esc(it.title)}</h3>
        ${editable ? `<button class="unpin" type="button" data-act="unpin" data-id="${esc(it.id)}" aria-label="${esc(it.title)} entfernen" title="Entfernen">×</button>` : ''}
      </header>
      <p>${esc(it.content)}</p>
      ${it.code ? `<pre><code>${esc(it.code)}</code></pre>` : ''}
    </article>`).join('');
}

function renderBlatt() {
  const items = store.state.pinnedCheatSheet;
  return `${pageHead('DIN A4 · Hilfsmittel', 'Spickzettel', 'Heft Kapitel an, ordne dein Wissen auf einer Seite und drucke es zweispaltig auf weißes Papier.')}
  <div class="sheet-tools">
    <span class="sheet-loads">Laden:
      <button class="link" type="button" data-act="load-pins" data-courses="gdp1">GP1</button> ·
      <button class="link" type="button" data-act="load-pins" data-courses="ics">ICS</button> ·
      <button class="link" type="button" data-act="load-pins" data-courses="gdp1,gdp2,ics,english">alle Essentials</button>
    </span>
    <span class="sheet-main">
      <button class="btn" type="button" data-act="clear-pins" ${items.length ? '' : 'disabled'}>Leeren</button>
      <button class="btn primary" type="button" data-act="print" ${items.length ? '' : 'disabled'}>Drucken</button>
    </span>
  </div>
  ${items.length ? `
  <div class="sheet" id="sheet">
    <p class="sheet-head"><span>Spickzettel · WS 26/27</span><span>${plural(items.length, 'Eintrag', 'Einträge')}</span></p>
    <div class="sheet-cols">${sheetItemsHtml(items, { editable: true })}</div>
  </div>` : `
  <div class="empty">
    <p class="empty-mark" aria-hidden="true">○</p>
    <h2 class="empty-title">Das Blatt ist noch leer.</h2>
    <p class="empty-text">Heft in den Kursen einzelne Kapitel an – oder lade oben die Essentials eines Kurses.</p>
    <div class="actions"><button class="btn" type="button" data-act="go" data-href="#/kurse">Zu den Kursen</button></div>
  </div>`}`;
}

function fillPrintSheet() {
  const items = store.state.pinnedCheatSheet;
  $('#print-sheet').innerHTML = `<p class="ps-head">Spickzettel WS 26/27 · ${plural(items.length, 'Eintrag', 'Einträge')}</p>
    <div class="ps-cols">${sheetItemsHtml(items, { editable: false })}</div>`;
}

/* ---------- Methode & Backup ---------- */

const METHODS = [
  ['Spaced Repetition', 'Der SM-2-Algorithmus legt jede Karte kurz vor dem Vergessen wieder vor. Verteiltes Wiederholen schlägt Bulimie-Lernen bei der Langzeit-Erinnerung deutlich – deine Bewertung steuert das nächste Intervall.'],
  ['Active Recall', 'Abrufen statt Wiederlesen: Wer eine Antwort aus dem Gedächtnis holt, festigt die Spur stärker als durch Markieren. Deshalb erst erinnern, dann umdrehen – und im Quiz Code selbst nachverfolgen.'],
  ['Interleaving', 'Die gemischte Sitzung wechselt zwischen GP1, GP2, ICS und Englisch. Das fühlt sich schwerer an, trainiert aber genau das Erkennen, welche Strategie eine Aufgabe verlangt.'],
  ['Dual Coding', 'Text und Bild zusammen bilden zwei Gedächtnisanker. Die Diagramme in den Kapiteln – JVM, DOM-Baum, Box-Modell, Collections – ergänzen die Zusammenfassungen.'],
  ['Feynman & Kalibrierung', 'Erkläre ein Konzept so einfach, dass es ein Laie versteht; Lücken zeigen sich sofort. Im Quiz schätzt du vorher deine Sicherheit ein – so lernst du, deinem Gefühl zu trauen oder es zu korrigieren.'],
];

function renderMethode() {
  const cal = calibrationStats();
  const st = cardStats('all');
  const calRow = (lvl) => {
    const c = cal[lvl.value];
    const pct = c.n ? Math.round((c.ok / c.n) * 100) : null;
    return `<li class="row cal-row">
      <span class="cal-label">${lvl.label}</span>
      <span class="cal-meter">${meter(pct ?? 0)}</span>
      <span class="cal-val">${pct === null ? '–' : `${pct} %`}</span>
      <span class="cal-n">${c.n ? `${c.ok} von ${c.n}` : 'keine Daten'}</span>
    </li>`;
  };
  const mod = IS_MAC ? '⌘' : 'Ctrl';
  return `${pageHead('Warum es funktioniert', 'Methode', 'Fünf gut belegte Prinzipien der Lernforschung – und wie diese Seite sie umsetzt.')}
  <ol class="methods">
    ${METHODS.map(([t, d], i) => `<li><span class="m-n">${i + 1}</span><div><h2 class="m-title">${t}</h2><p>${d}</p></div></li>`).join('')}
  </ol>

  ${sect('Dein Stand', `${st.total} Karten`)}
  <dl class="stats">
    <div><dt>Neu</dt><dd>${st.new}</dd></div>
    <div><dt>Fällig</dt><dd>${st.due}</dd></div>
    <div><dt>Lernend</dt><dd>${st.learning}</dd></div>
    <div><dt>Gemeistert</dt><dd>${st.mastered}</dd></div>
  </dl>
  <p class="small muted">Kalibrierung – wie oft du richtig lagst, je nachdem wie sicher du warst:</p>
  <ul class="rows">${CONFIDENCE_LEVELS.map(calRow).join('')}</ul>

  ${sect('Datensicherung')}
  <p class="body-text">Karten-Intervalle, Quiz-Verlauf, Feynman-Notizen und Spickzettel liegen nur in diesem Browser. Sichere sie gelegentlich als Datei.</p>
  <div class="actions">
    <button class="btn primary" type="button" data-act="backup">Backup herunterladen</button>
    <label class="btn file-btn">Backup importieren<input type="file" id="import-file" accept="application/json,.json"></label>
    <button class="btn danger" type="button" data-act="reset">Fortschritt zurücksetzen</button>
  </div>

  ${sect('Tastenkürzel')}
  <dl class="keys">
    <div><dt><kbd>${mod}</kbd><kbd>K</kbd></dt><dd>Befehlspalette: Ansichten, Kurse, Kapitel, Aktionen</dd></div>
    <div><dt><kbd>Leertaste</kbd></dt><dd>Karteikarte aufdecken / wenden</dd></div>
    <div><dt><kbd>1</kbd>–<kbd>4</kbd></dt><dd>Karte bewerten: Nochmal, Schwer, Gut, Einfach</dd></div>
    <div><dt><kbd>1</kbd>–<kbd>4</kbd> · <kbd>Enter</kbd></dt><dd>Quiz: Antwort wählen, prüfen, weiter</dd></div>
    <div><dt><kbd>Esc</kbd></dt><dd>Palette oder Timer schließen</dd></div>
  </dl>`;
}

const RENDERERS = { heute: renderHeute, karten: renderKarten, quiz: renderQuiz, kurse: renderKurse, email: renderEmail, blatt: renderBlatt, methode: renderMethode };

/* ---------- Pomodoro ---------- */

const pomo = new Pomodoro({
  onChange: updatePomo,
  onFinish: (min) => toast(`${min} Minuten Fokus geschafft. Zeit für eine Pause.`),
});

function updatePomo() {
  $('#pomo-chip-time').textContent = pomo.display;
  $('#pomo-time').textContent = pomo.display;
  $('#pomo-bar').style.width = `${pomo.progress * 100}%`;
  $('#pomo-toggle').textContent = pomo.running ? 'Pausieren' : (pomo.progress > 0 ? 'Fortsetzen' : 'Starten');
  $('#pomo-mode-label').textContent = `${pomo.mode === 25 ? 'Pomodoro' : 'Deep Work'} · ${pomo.mode} Minuten`;
  $('#pomo-mode-btn').textContent = `Auf ${pomo.mode === 25 ? 50 : 25} Minuten wechseln`;
  $('#pomo').classList.toggle('running', pomo.running);
  document.title = pomo.running ? `${pomo.display} · StudyOS` : 'StudyOS · Zen';
}

function setPomoOpen(open) {
  $('#pomo-pop').hidden = !open;
  $('.pomo-chip').setAttribute('aria-expanded', String(open));
}

/* ---------- Command palette ---------- */

const pal = { open: false, items: [], results: [], sel: 0 };

function paletteItems() {
  const items = [];
  for (const v of VIEWS) items.push({ group: 'Ansicht', label: v.label, hint: v.hint, run: () => go(`#/${v.id}`) });
  items.push(
    { group: 'Aktion', label: 'Interleaved Session starten', hint: `${dueCount('all')} Karten fällig`, run: () => startCards('all') },
    { group: 'Aktion', label: 'Quiz gemischt starten', hint: `${ALL_QUIZZES.length} Fragen`, run: () => startQuiz('all') },
    { group: 'Aktion', label: 'Theme wechseln', hint: store.state.theme === 'dark' ? 'zu Tag (Papier)' : 'zu Nacht', run: () => store.toggleTheme() },
    { group: 'Aktion', label: pomo.running ? 'Pomodoro pausieren' : 'Pomodoro starten', hint: `${pomo.display} · ${pomo.mode} Min`, run: () => { pomo.toggle(); toast(pomo.running ? 'Fokus-Timer läuft.' : 'Fokus-Timer pausiert.'); } },
    { group: 'Aktion', label: 'Pomodoro zurücksetzen', hint: `${pomo.mode} Min`, run: () => pomo.reset() },
    { group: 'Aktion', label: `Pomodoro auf ${pomo.mode === 25 ? 50 : 25} Minuten`, hint: 'Modus wechseln', run: () => pomo.switchMode() },
    { group: 'Aktion', label: 'Spickzettel drucken', hint: `${store.state.pinnedCheatSheet.length} Einträge`, run: () => { go('#/blatt'); setTimeout(() => window.print(), 50); } },
    { group: 'Aktion', label: 'Backup herunterladen', hint: 'JSON-Datei', run: () => { downloadBackup(); toast('Backup heruntergeladen.'); } },
  );
  for (const c of COURSES_META) {
    items.push({ group: 'Kurs', label: `${c.short} – ${c.title}`, hint: `${getCourseMastery(c.id)} % beherrscht`, run: () => go(`#/kurse/${c.id}`) });
    items.push({ group: 'Aktion', label: `${c.short}-Karten üben`, hint: `${dueCount(c.id)} fällig`, run: () => startCards(c.id) });
  }
  for (const ch of ALL_CHAPTERS) {
    items.push({ group: 'Kapitel', label: ch.title, hint: courseMeta(ch.courseId).short, run: () => go(`#/kurse/${ch.courseId}/${ch.id}`) });
  }
  return items;
}

/** Subsequence fuzzy match. Returns { score, idx } or null. */
function fuzzy(query, text) {
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return { score: 0, idx: [] };
  const at = t.indexOf(q);
  if (at >= 0) {
    const wordStart = at === 0 || /[\s\-–·:.(„/]/.test(t[at - 1]);
    return { score: 1000 + (wordStart ? 300 : 0) - at - t.length * 0.1, idx: Array.from({ length: q.length }, (_, i) => at + i) };
  }
  let from = 0, prev = -2, score = 0, clean = true;
  const idx = [];
  for (const ch of q) {
    if (ch === ' ') continue;
    const found = t.indexOf(ch, from);
    if (found < 0) return null;
    const contiguous = found === prev + 1;
    const wordStart = found === 0 || /[\s\-–·:.(„/]/.test(t[found - 1]);
    score += contiguous ? 12 : 1;
    if (wordStart) score += 8;
    if (!contiguous && !wordStart) clean = false;
    idx.push(found);
    prev = found;
    from = found + 1;
  }
  // Reject letters scattered across the label unless they follow word starts (e.g. "ise" → Interleaved SEssion).
  if (!clean && idx.length > 1 && idx[idx.length - 1] - idx[0] > Math.max(idx.length * 3, 8)) return null;
  return { score: score - t.length * 0.1, idx };
}

function highlight(text, idx) {
  if (!idx.length) return esc(text);
  const set = new Set(idx);
  let out = '';
  let open = false;
  for (let i = 0; i < text.length; i++) {
    const hit = set.has(i);
    if (hit && !open) { out += '<mark>'; open = true; }
    if (!hit && open) { out += '</mark>'; open = false; }
    out += esc(text[i]);
  }
  return open ? `${out}</mark>` : out;
}

function filterPalette() {
  const q = $('#palette-input').value;
  const res = [];
  for (const it of pal.items) {
    const m = fuzzy(q, it.label);
    if (m) { res.push({ it, score: m.score, idx: m.idx }); continue; }
    const m2 = fuzzy(q, `${it.hint} ${it.group}`);
    if (m2) res.push({ it, score: m2.score - 500, idx: [] });
  }
  if (q.trim()) res.sort((a, b) => b.score - a.score);
  pal.results = res.slice(0, 60);
  pal.sel = 0;
  drawPalette();
}

function drawPalette() {
  const list = $('#palette-list');
  if (!pal.results.length) {
    list.innerHTML = '<li class="pal-empty">Nichts gefunden.</li>';
    return;
  }
  const grouped = !$('#palette-input').value.trim();
  let lastGroup = '';
  list.innerHTML = pal.results.map((r, i) => {
    const head = grouped && r.it.group !== lastGroup ? `<li class="pal-group" role="presentation">${r.it.group === 'Ansicht' ? 'Ansichten' : r.it.group === 'Aktion' ? 'Aktionen' : r.it.group === 'Kurs' ? 'Kurse' : 'Kapitel'}</li>` : '';
    lastGroup = r.it.group;
    return `${head}<li class="pal-item ${i === pal.sel ? 'sel' : ''}" role="option" id="pal-${i}" data-i="${i}" aria-selected="${i === pal.sel}">
      <span class="pal-label">${highlight(r.it.label, r.idx)}</span>
      <span class="pal-hint">${esc(r.it.hint || '')}</span>
      ${grouped ? '' : `<span class="pal-kind">${r.it.group}</span>`}
    </li>`;
  }).join('');
  $('#palette-input').setAttribute('aria-activedescendant', `pal-${pal.sel}`);
}

function moveSel(delta) {
  if (!pal.results.length) return;
  pal.sel = (pal.sel + delta + pal.results.length) % pal.results.length;
  document.querySelectorAll('#palette-list .pal-item').forEach(el => {
    const on = Number(el.dataset.i) === pal.sel;
    el.classList.toggle('sel', on);
    el.setAttribute('aria-selected', String(on));
    if (on) el.scrollIntoView({ block: 'nearest' });
  });
  $('#palette-input').setAttribute('aria-activedescendant', `pal-${pal.sel}`);
}

function openPalette() {
  setPomoOpen(false);
  pal.open = true;
  pal.items = paletteItems();
  pal.returnFocus = document.activeElement;
  $('#palette').hidden = false;
  document.body.classList.add('no-scroll');
  const input = $('#palette-input');
  input.value = '';
  filterPalette();
  input.focus();
}

function closePalette() {
  if (!pal.open) return;
  pal.open = false;
  $('#palette').hidden = true;
  document.body.classList.remove('no-scroll');
  pal.returnFocus?.focus?.({ preventScroll: true });
}

function runPalette(i) {
  const r = pal.results[i];
  if (!r) return;
  closePalette();
  r.it.run();
}

$('#palette-input').addEventListener('input', filterPalette);
$('#palette-list').addEventListener('mousemove', e => {
  const li = e.target.closest('.pal-item');
  if (li && Number(li.dataset.i) !== pal.sel) moveSel(Number(li.dataset.i) - pal.sel);
});
$('#palette-list').addEventListener('click', e => {
  const li = e.target.closest('.pal-item');
  if (li) runPalette(Number(li.dataset.i));
});

/* ---------- actions ---------- */

const ACTIONS = {
  go: el => go(el.dataset.href),
  palette: () => openPalette(),
  'palette-close': () => closePalette(),
  theme: () => store.toggleTheme(),
  'to-top': () => window.scrollTo({ top: 0, behavior: 'smooth' }),

  'start-interleaved': () => startCards('all', false),
  'start-course-cards': el => startCards(el.dataset.course, false),
  'start-quiz': el => startQuiz(el.dataset.course || 'all'),

  'fc-filter': el => { Object.assign(S.fc, { course: el.dataset.course, includeAll: false, queue: null }); refresh(); },
  'fc-reveal': () => revealCard(),
  'fc-rate': el => rate(Number(el.dataset.r)),
  'fc-all': () => { Object.assign(S.fc, { includeAll: true, queue: null }); refresh(); },

  'q-filter': el => { Object.assign(S.quiz, { course: el.dataset.course, queue: null }); refresh(); },
  'q-opt': el => selectOption(Number(el.dataset.i)),
  'q-conf': el => { if (!S.quiz.result) { S.quiz.confidence = el.dataset.v; refresh(); } },
  'q-submit': () => submitAnswer(),
  'q-next': () => nextQuestion(),
  'q-restart': () => { S.quiz.queue = null; render({ scroll: true }); },

  jump: el => scrollToChapter(el.dataset.ch),
  pin: el => {
    const ch = CHAPTERS.get(el.dataset.ch);
    if (!ch) return;
    const on = togglePinChapter(ch);
    el.classList.toggle('on', on);
    el.setAttribute('aria-pressed', String(on));
    el.textContent = pinLabel(on);
    toast(on ? 'An den Spickzettel geheftet.' : 'Vom Spickzettel genommen.');
  },

  'email-prompt': el => { S.email.idx = Number(el.dataset.i); refresh(); },

  unpin: el => {
    const item = store.state.pinnedCheatSheet.find(p => p.id === el.dataset.id);
    if (!item) return;
    store.togglePin({ id: item.id });
    refresh();
    toast(`„${item.title}“ entfernt.`);
  },
  'load-pins': el => {
    const before = store.state.pinnedCheatSheet.length;
    loadCoursePins(el.dataset.courses.split(','));
    const added = store.state.pinnedCheatSheet.length - before;
    refresh();
    toast(added ? `${plural(added, 'Eintrag', 'Einträge')} hinzugefügt.` : 'Schon alles auf dem Blatt.');
  },
  'clear-pins': () => {
    if (!store.state.pinnedCheatSheet.length) return;
    if (!confirm('Spickzettel wirklich leeren?')) return;
    clearPins();
    refresh();
    toast('Spickzettel geleert.');
  },
  print: () => window.print(),

  backup: () => { downloadBackup(); toast('Backup heruntergeladen.'); },
  reset: () => {
    if (!confirm('Gesamten Lernfortschritt unwiderruflich zurücksetzen?')) return;
    resetProgress();
    S.fc.queue = null;
    S.quiz.queue = null;
    refresh();
    toast('Fortschritt zurückgesetzt.');
  },

  'pomo-chip': () => setPomoOpen($('#pomo-pop').hidden),
  'pomo-toggle': () => pomo.toggle(),
  'pomo-reset': () => pomo.reset(),
  'pomo-mode': () => pomo.switchMode(),
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!e.target.closest('#pomo')) setPomoOpen(false);
  if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true' && el.dataset.act !== 'q-submit') return;
  const fn = ACTIONS[el.dataset.act];
  if (fn) { e.preventDefault(); fn(el); }
});

let feynmanTimer = null;
document.addEventListener('input', e => {
  const t = e.target;
  if (t.matches('textarea[data-feynman]')) {
    const id = t.dataset.feynman;
    saveFeynmanText(id, t.value);
    const status = document.getElementById(`fs-${id}`);
    if (status) {
      status.textContent = 'Gespeichert.';
      status.classList.add('pulse');
      clearTimeout(feynmanTimer);
      feynmanTimer = setTimeout(() => status.classList.remove('pulse'), 600);
    }
  } else if (t.matches('#email-ta')) {
    const prompt = ENGLISH_DATA.emailPrompts.find(p => p.id === t.dataset.email);
    S.email.drafts[prompt.id] = t.value;
    $('#email-fb').innerHTML = emailFeedback(t.value, prompt);
  }
});

document.addEventListener('change', e => {
  const t = e.target;
  if (t.matches('input[data-rubric]')) {
    const id = t.dataset.rubric;
    toggleFeynmanPoint(id, Number(t.dataset.i), t.checked);
    const counter = document.getElementById(`rc-${id}`);
    if (counter) counter.textContent = `${getFeynman(id).checkedPoints.length}/${CHAPTERS.get(id).feynman.rubric.length}`;
  } else if (t.matches('#import-file')) {
    const file = t.files?.[0];
    if (!file) return;
    importBackup(file)
      .then(() => {
        S.fc.queue = null;
        S.quiz.queue = null;
        refresh();
        toast('Backup importiert.');
      })
      .catch(() => toast('Import fehlgeschlagen – keine gültige Backup-Datei.'))
      .finally(() => { t.value = ''; });
  }
});

/* ---------- keyboard ---------- */

document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (pal.open) closePalette(); else openPalette();
    return;
  }
  if (pal.open) {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveSel(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveSel(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); runPalette(pal.sel); }
    else if (e.key === 'Escape') { e.preventDefault(); closePalette(); }
    else if (e.key === 'Tab') e.preventDefault();
    return;
  }
  if (e.key === 'Escape') { setPomoOpen(false); return; }
  const t = e.target;
  if (t.closest?.('input, textarea, select, [contenteditable="true"]')) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  const { view } = parseRoute();
  if (view === 'karten') {
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      revealCard();
    } else if (/^[1-4]$/.test(e.key) && S.fc.revealed) {
      e.preventDefault();
      rate(Number(e.key));
    } else if (e.key === 'Enter' && t.classList?.contains('card3d')) {
      e.preventDefault();
      revealCard();
    }
  } else if (view === 'quiz') {
    if (/^[1-9]$/.test(e.key) && !S.quiz.result) {
      selectOption(Number(e.key) - 1);
    } else if (e.key === 'Enter' && !t.closest?.('button, a')) {
      e.preventDefault();
      if (S.quiz.result) nextQuestion(); else submitAnswer();
    }
  }
});

/* ---------- global wiring ---------- */

function applyTheme() {
  document.documentElement.dataset.theme = store.state.theme === 'dark' ? 'night' : 'paper';
}

function updateBadges() {
  const due = dueCount('all');
  $('#nav-due').textContent = due ? String(due) : '';
  const pins = store.state.pinnedCheatSheet.length;
  $('#nav-pins').textContent = pins ? String(pins) : '';
}

let lastTheme = store.state.theme;
store.subscribe(() => {
  applyTheme();
  updateBadges();
  if (store.state.theme !== lastTheme) {
    lastTheme = store.state.theme;
    toast(lastTheme === 'dark' ? 'Nachtmodus.' : 'Tagmodus.');
  }
});

window.addEventListener('hashchange', () => { closePalette(); setPomoOpen(false); render(); });
window.addEventListener('beforeprint', fillPrintSheet);
// Drop the entrance class once it has played so no composited layer lingers (WebKit repaint glitches).
viewEl.addEventListener('animationend', e => {
  if (e.target.classList.contains('enter')) e.target.classList.remove('enter');
});

$('#kbd-k').textContent = IS_MAC ? '⌘K' : 'Ctrl K';
applyTheme();
updatePomo();
render({ scroll: true });
