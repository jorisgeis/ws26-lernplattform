import { COURSES_META } from './data/courses.js';
import { GDP1_DATA } from './data/gdp1.js';
import { GDP2_DATA } from './data/gdp2.js';
import { ICS_DATA } from './data/ics.js';
import { ENGLISH_DATA } from './data/english.js';
import { RATINGS, reviewCard, previewIntervals, isDue, getCardStatus, interleaveItems } from './engine/sm2.js';
import { store } from './engine/store.js';
import { DIAGRAMS } from './engine/diagrams.js';

const ALL_DATA = {
  gdp1: GDP1_DATA,
  gdp2: GDP2_DATA,
  ics: ICS_DATA,
  english: ENGLISH_DATA,
};

const ALL_FLASHCARDS = Object.values(ALL_DATA).flatMap(d =>
  d.flashcards.map(fc => ({ ...fc, courseId: d.courseId }))
);
const ALL_QUIZZES = Object.values(ALL_DATA).flatMap(d =>
  d.quizzes.map(q => ({ ...q, courseId: d.courseId }))
);

// App UI state
let currentView = 'dashboard';
let selectedCourse = 'all';
let selectedCourseTab = 'gdp1';

// Flashcard session state
let fcQueue = [];
let fcIndex = 0;
let fcFlipped = false;

// Quiz session state
let quizQueue = [];
let quizIndex = 0;
let quizSelectedOpt = null;
let quizConfidence = 'medium';
let quizSubmitted = false;

// Email trainer state
let selectedPromptIdx = 0;
let emailText = '';

// Pomodoro state
let pomoMode = 25; // 25 or 50
let pomoSeconds = 25 * 60;
let pomoTimer = null;

function courseMeta(id) {
  return COURSES_META.find(c => c.id === id) || COURSES_META[0];
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2400);
}

function getDueCards(courseFilter = 'all') {
  const cards = courseFilter === 'all'
    ? ALL_FLASHCARDS
    : ALL_FLASHCARDS.filter(c => c.courseId === courseFilter);
  const due = cards.filter(c => isDue(store.state.cards[c.id]));
  return courseFilter === 'all' ? interleaveItems(due) : due;
}

function getCourseMastery(courseId) {
  const fcs = ALL_FLASHCARDS.filter(c => c.courseId === courseId);
  const qs = ALL_QUIZZES.filter(q => q.courseId === courseId);
  let score = 0;
  const total = fcs.length + qs.length;
  for (const fc of fcs) {
    const st = getCardStatus(store.state.cards[fc.id]);
    if (st === 'mastered') score += 1;
    else if (st === 'learning') score += 0.6;
  }
  for (const q of qs) {
    const h = store.state.quizHistory[q.id];
    if (h && h.lastCorrect) score += 1;
  }
  return total ? Math.round((score / total) * 100) : 0;
}

function updateTopbarAndBadges() {
  document.documentElement.setAttribute('data-theme', store.state.theme);
  const dueCount = getDueCards('all').length;
  document.getElementById('nav-due-badge').textContent = dueCount;
  document.getElementById('nav-pin-badge').textContent = store.state.pinnedCheatSheet.length;
  const today = store.getTodayStats();
  const done = today.reviews + today.quizzes;
  document.getElementById('top-today-count').textContent = `${done} / ${store.state.dailyGoal}`;
  document.getElementById('top-streak').textContent = `${store.state.streak.count} ${store.state.streak.count === 1 ? 'Tag' : 'Tage'}`;
}

function setView(view, opts = {}) {
  currentView = view;
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });

  if (opts.course) {
    if (view === 'courses') selectedCourseTab = opts.course;
    else selectedCourse = opts.course;
  }
  if (view === 'flashcards') {
    startFlashcardSession(opts.course ?? selectedCourse, opts.allCards);
  }
  if (view === 'quiz') {
    startQuizSession(opts.course ?? selectedCourse);
  }

  render();
}

function startFlashcardSession(courseFilter = 'all', includeAll = false) {
  selectedCourse = courseFilter;
  const base = courseFilter === 'all'
    ? ALL_FLASHCARDS
    : ALL_FLASHCARDS.filter(c => c.courseId === courseFilter);
  const list = includeAll ? base : base.filter(c => isDue(store.state.cards[c.id]));
  fcQueue = courseFilter === 'all' ? interleaveItems(list) : [...list];
  fcIndex = 0;
  fcFlipped = false;
}

function startQuizSession(courseFilter = 'all') {
  selectedCourse = courseFilter;
  const base = courseFilter === 'all'
    ? ALL_QUIZZES
    : ALL_QUIZZES.filter(q => q.courseId === courseFilter);
  quizQueue = courseFilter === 'all' ? interleaveItems(base) : [...base];
  quizIndex = 0;
  quizSelectedOpt = null;
  quizSubmitted = false;
  quizConfidence = 'medium';
}

function render() {
  updateTopbarAndBadges();
  const titleEl = document.getElementById('view-title');
  const subEl = document.getElementById('view-subtitle');
  const container = document.getElementById('view-container');

  const headers = {
    dashboard: ['Lernzentrale', 'WS 26/27 • Spaced Repetition, Active Recall, Interleaving & Dual Coding'],
    flashcards: ['Spaced Repetition (SM-2)', 'Optimale Wiederholungsintervalle gegen die Ebbinghaus-Vergessenskurve • Shortcuts: Space, 1–4'],
    quiz: ['Active Recall & Confidence Calibration', 'Prüfungsnahes Code-Tracing & Selbstüberschätzungs-Check'],
    courses: ['Kurse, Feynman-Technik & Moodle-PDFs', 'Kompakte Zusammenfassungen, Diagramme, Selbst-Erklärung & Original-Skripte'],
    email: ['GPAS Semi-Formal Exam Email Coach', 'English for Computer Scientists • Live-Checkliste & Wortzahl'],
    cheatsheet: ['DIN-A4 Klausur-Spickzettel', 'Für GP1 & ICS erlaubt (1 DIN-A4 Blatt) • Direkt druckbar'],
    science: ['Wissenschaftliche Lernmethoden & Backup', 'Warum diese Plattform so aufgebaut ist + Fortschritt sichern'],
  };
  titleEl.textContent = headers[currentView][0];
  subEl.textContent = headers[currentView][1];

  if (currentView === 'dashboard') renderDashboard(container);
  else if (currentView === 'flashcards') renderFlashcards(container);
  else if (currentView === 'quiz') renderQuiz(container);
  else if (currentView === 'courses') renderCourses(container);
  else if (currentView === 'email') renderEmailCoach(container);
  else if (currentView === 'cheatsheet') renderCheatSheet(container);
  else if (currentView === 'science') renderScience(container);
}

/* ==================== 1. DASHBOARD ==================== */
function renderDashboard(el) {
  const dueAll = getDueCards('all').length;
  const today = store.getTodayStats();
  const todayPct = Math.min(100, Math.round(((today.reviews + today.quizzes) / store.state.dailyGoal) * 100));

  const allDeadlines = COURSES_META.flatMap(c =>
    c.deadlines.map(d => ({ ...d, courseShort: c.short, color: c.color }))
  ).sort((a, b) => a.date.localeCompare(b.date));

  el.innerHTML = `
    <div class="grid-2 mb-16">
      <div class="card">
        <div class="card-title">🚀 Dein nächster optimaler Lernschritt</div>
        <p class="muted mb-12">
          Du hast aktuell <strong>${dueAll} fällige Karteikarten</strong> über alle 4 Kurse.
          Laut Kognitionsforschung bringt <strong>verschachteltes Üben (Interleaving)</strong> mit aktivem Abruf den höchsten Klausur-Effekt.
        </p>
        <div class="progress-track"><div class="progress-fill" style="width:${todayPct}%; background:var(--accent)"></div></div>
        <div class="muted mb-16">Tagesziel: ${today.reviews + today.quizzes} / ${store.state.dailyGoal} Aufgaben (${todayPct}%)</div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn btn-primary" data-go="flashcards" data-course="all">🧠 Interleaved Karten (${dueAll})</button>
          <button class="btn" data-go="quiz" data-course="all">🎯 Klausur-Quiz Mix</button>
          <button class="btn btn-ghost" data-go="email">✉️ English Email-Coach</button>
        </div>
      </div>

      <div class="card">
        <div class="card-title">📅 Nächste Termine &amp; Abgaben (WS 26/27)</div>
        ${allDeadlines.slice(0, 5).map(d => `
          <div class="deadline-row ${d.urgent ? 'urgent' : ''}">
            <div>
              <span class="tag" style="background:${d.color}22; color:${d.color}; margin-right:6px;">${d.courseShort}</span>
              <span style="font-size:13.5px; font-weight:600;">${d.label}</span>
            </div>
            <span class="muted" style="font-family:var(--mono); font-size:12px; white-space:nowrap;">${d.date}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <h2 style="font-size:16px; margin: 22px 0 12px;">Deine 4 Moodle-Kurse im Überblick</h2>
    <div class="grid-4">
      ${COURSES_META.map(c => {
        const mastery = getCourseMastery(c.id);
        const due = getDueCards(c.id).length;
        const chCount = ALL_DATA[c.id].chapters.length;
        return `
          <div class="card course-card" data-open-course="${c.id}">
            <div class="course-head">
              <div class="course-icon" style="background:${c.accentBg}; color:${c.color}">${c.icon}</div>
              <div>
                <div style="font-weight:700; font-size:15px;">${c.short} — ${c.title}</div>
                <div class="muted" style="font-size:12px;">${c.prof}</div>
              </div>
            </div>
            <p class="muted" style="font-size:12.5px;">${c.subtitle}</p>
            <div class="progress-track"><div class="progress-fill" style="width:${mastery}%; background:${c.color}"></div></div>
            <div class="course-meta">
              <span>Beherrschung: <strong>${mastery}%</strong></span>
              <span>${due} fällig • ${chCount} Kapitel</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  el.querySelectorAll('[data-go]').forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.go, { course: btn.dataset.course }));
  });
  el.querySelectorAll('[data-open-course]').forEach(card => {
    card.addEventListener('click', () => setView('courses', { course: card.dataset.openCourse }));
  });
}

/* ==================== 2. SPACED REPETITION (SM-2) ==================== */
function renderFlashcards(el) {
  const pills = `
    <div class="pill-bar">
      <button class="pill ${selectedCourse === 'all' ? 'active' : ''}" data-fc-filter="all">⚡ Interleaved Mix (${getDueCards('all').length})</button>
      ${COURSES_META.map(c => `
        <button class="pill ${selectedCourse === c.id ? 'active' : ''}" data-fc-filter="${c.id}">${c.icon} ${c.short} (${getDueCards(c.id).length})</button>
      `).join('')}
    </div>
  `;

  if (fcIndex >= fcQueue.length) {
    el.innerHTML = `
      ${pills}
      <div class="card flashcard-wrap" style="text-align:center; padding:42px 24px;">
        <div style="font-size:42px; margin-bottom:10px;">🎉</div>
        <h2>Alle fälligen Karten geschafft!</h2>
        <p class="muted mt-16 mb-16">Dein Gehirn festigt die Inhalte jetzt im Schlaf. Wenn du für eine bevorstehende Klausur extra üben möchtest, kannst du eine freie Übungsrunde starten.</p>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
          <button class="btn btn-primary" id="fc-cram-btn">🔁 Alle Karten nochmal üben</button>
          <button class="btn" id="fc-to-quiz-btn">🎯 Weiter zum Active Recall Quiz</button>
        </div>
      </div>
    `;
    bindFcFilters(el);
    document.getElementById('fc-cram-btn')?.addEventListener('click', () => {
      startFlashcardSession(selectedCourse, true);
      render();
    });
    document.getElementById('fc-to-quiz-btn')?.addEventListener('click', () => setView('quiz', { course: selectedCourse }));
    return;
  }

  const card = fcQueue[fcIndex];
  const cm = courseMeta(card.courseId);
  const state = store.state.cards[card.id];
  const intervals = previewIntervals(state);

  el.innerHTML = `
    ${pills}
    <div class="flashcard-wrap">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <div>
          <span class="tag" style="background:${cm.accentBg}; color:${cm.color}">${cm.icon} ${cm.short}</span>
          ${card.examRelevant ? '<span class="tag orange" style="margin-left:6px;">★ Klausurrelevant</span>' : ''}
        </div>
        <span class="muted">Karte ${fcIndex + 1} / ${fcQueue.length}</span>
      </div>

      <div class="flashcard" id="fc-card">
        <div>
          <div class="muted" style="font-size:12px; margin-bottom:8px;">FRAGE (Versuche sie laut oder im Kopf zu beantworten!)</div>
          <div class="fc-front">${escapeHtml(card.front)}</div>
          ${fcFlipped ? `
            <div class="fc-back">
              <div class="muted" style="font-size:12px; margin-bottom:6px;">MUSTERANTWORT</div>
              ${escapeHtml(card.back)}
            </div>
          ` : ''}
        </div>
        ${!fcFlipped ? `<div class="muted" style="text-align:center; margin-top:24px;">👆 Klicken oder <kbd>Leertaste</kbd> drücken zum Aufdecken</div>` : ''}
      </div>

      ${fcFlipped ? `
        <div class="fc-ratings">
          <button class="rate-btn r1" data-rate="1">1 • Nochmal<small>${intervals[1]}</small></button>
          <button class="rate-btn r2" data-rate="2">2 • Schwer<small>${intervals[2]}</small></button>
          <button class="rate-btn r3" data-rate="3">3 • Gut<small>${intervals[3]}</small></button>
          <button class="rate-btn r4" data-rate="4">4 • Einfach<small>${intervals[4]}</small></button>
        </div>
      ` : ''}
    </div>
  `;

  bindFcFilters(el);
  document.getElementById('fc-card')?.addEventListener('click', () => {
    if (!fcFlipped) { fcFlipped = true; render(); }
  });
  el.querySelectorAll('[data-rate]').forEach(btn => {
    btn.addEventListener('click', () => rateCurrentCard(Number(btn.dataset.rate)));
  });
}

function bindFcFilters(el) {
  el.querySelectorAll('[data-fc-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      startFlashcardSession(btn.dataset.fcFilter, false);
      render();
    });
  });
}

function rateCurrentCard(rating) {
  const card = fcQueue[fcIndex];
  if (!card) return;
  const next = reviewCard(store.state.cards[card.id], rating);
  store.setCardState(card.id, next);
  if (rating === RATINGS.AGAIN) {
    fcQueue.push(card); // Re-queue in same session!
    showToast('Karte kommt in dieser Runde nochmal dran.');
  }
  fcIndex += 1;
  fcFlipped = false;
  render();
}

/* ==================== 3. ACTIVE RECALL QUIZ ==================== */
function renderQuiz(el) {
  const pills = `
    <div class="pill-bar">
      <button class="pill ${selectedCourse === 'all' ? 'active' : ''}" data-q-filter="all">⚡ Interleaved Mix (${ALL_QUIZZES.length})</button>
      ${COURSES_META.map(c => `
        <button class="pill ${selectedCourse === c.id ? 'active' : ''}" data-q-filter="${c.id}">${c.icon} ${c.short} (${ALL_DATA[c.id].quizzes.length})</button>
      `).join('')}
    </div>
  `;

  if (quizIndex >= quizQueue.length) {
    el.innerHTML = `
      ${pills}
      <div class="card flashcard-wrap" style="text-align:center; padding:42px 24px;">
        <div style="font-size:42px; margin-bottom:10px;">🏆</div>
        <h2>Quiz-Runde abgeschlossen!</h2>
        <p class="muted mt-16 mb-16">Aktives Testen (Testing Effect) stärkt deine Abrufpfade deutlich besser als nochmaliges Durchlesen.</p>
        <button class="btn btn-primary" id="quiz-restart">🔁 Neue Runde starten</button>
      </div>
    `;
    bindQuizFilters(el);
    document.getElementById('quiz-restart')?.addEventListener('click', () => {
      startQuizSession(selectedCourse);
      render();
    });
    return;
  }

  const q = quizQueue[quizIndex];
  const cm = courseMeta(q.courseId);
  const isCorrect = quizSelectedOpt === q.answer;
  const overconfident = quizSubmitted && !isCorrect && quizConfidence === 'high';

  el.innerHTML = `
    ${pills}
    <div class="card flashcard-wrap">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div>
          <span class="tag" style="background:${cm.accentBg}; color:${cm.color}">${cm.icon} ${cm.short}</span>
          <span class="tag purple" style="margin-left:6px;">${q.examStyle}</span>
        </div>
        <span class="muted">Frage ${quizIndex + 1} / ${quizQueue.length}</span>
      </div>

      <h3 style="font-size:17px; margin-bottom:12px;">${escapeHtml(q.question)}</h3>
      ${q.code ? `<pre class="code-block"><code>${escapeHtml(q.code)}</code></pre>` : ''}

      <div class="mt-16">
        ${q.options.map((opt, idx) => {
          let cls = 'quiz-option';
          if (quizSubmitted) {
            if (idx === q.answer) cls += ' correct';
            else if (idx === quizSelectedOpt) cls += ' wrong';
          } else if (idx === quizSelectedOpt) {
            cls += ' selected';
          }
          return `<button class="${cls}" data-opt="${idx}" ${quizSubmitted ? 'disabled' : ''}>
            <strong>${String.fromCharCode(65 + idx)})</strong> <span>${escapeHtml(opt)}</span>
          </button>`;
        }).join('')}
      </div>

      ${!quizSubmitted ? `
        <div class="confidence-bar">
          <span class="muted" style="font-size:12.5px;">🧭 Metakognition — Wie sicher bist du?</span>
          <button class="pill ${quizConfidence === 'low' ? 'active' : ''}" data-conf="low">Geraten</button>
          <button class="pill ${quizConfidence === 'medium' ? 'active' : ''}" data-conf="medium">Ziemlich sicher</button>
          <button class="pill ${quizConfidence === 'high' ? 'active' : ''}" data-conf="high">100% sicher</button>
          <button class="btn btn-primary btn-sm" style="margin-left:auto;" id="quiz-submit" ${quizSelectedOpt === null ? 'disabled' : ''}>Antwort prüfen</button>
        </div>
      ` : `
        <div class="explanation-box ${overconfident ? 'calibration-warn' : ''}">
          <strong>${isCorrect ? '✅ Richtig!' : '❌ Leider falsch.'}</strong>
          ${overconfident ? '<div style="margin:6px 0; font-weight:700;">⚠️ Kompetenz-Illusion erkannt: Du warst 100% sicher, aber die Antwort war falsch — ideal zum Einprägen (Hypercorrection Effect)!</div>' : ''}
          <p style="margin-top:6px;">${escapeHtml(q.explanation)}</p>
        </div>
        <div style="display:flex; justify-content:flex-end; margin-top:14px;">
          <button class="btn btn-primary" id="quiz-next">Nächste Frage &rarr;</button>
        </div>
      `}
    </div>
  `;

  bindQuizFilters(el);
  el.querySelectorAll('[data-opt]').forEach(btn => {
    btn.addEventListener('click', () => { quizSelectedOpt = Number(btn.dataset.opt); render(); });
  });
  el.querySelectorAll('[data-conf]').forEach(btn => {
    btn.addEventListener('click', () => { quizConfidence = btn.dataset.conf; render(); });
  });
  document.getElementById('quiz-submit')?.addEventListener('click', () => {
    if (quizSelectedOpt === null) return;
    quizSubmitted = true;
    store.recordQuiz(q.id, quizSelectedOpt === q.answer, quizConfidence);
    render();
  });
  document.getElementById('quiz-next')?.addEventListener('click', () => {
    quizIndex += 1;
    quizSelectedOpt = null;
    quizSubmitted = false;
    quizConfidence = 'medium';
    render();
  });
}

function bindQuizFilters(el) {
  el.querySelectorAll('[data-q-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      startQuizSession(btn.dataset.qFilter);
      render();
    });
  });
}

/* ==================== 4. COURSES, FEYNMAN & MOODLE PDFs ==================== */
function renderCourses(el) {
  const cm = courseMeta(selectedCourseTab);
  const data = ALL_DATA[selectedCourseTab];

  el.innerHTML = `
    <div class="pill-bar">
      ${COURSES_META.map(c => `
        <button class="pill ${selectedCourseTab === c.id ? 'active' : ''}" data-c-tab="${c.id}">${c.icon} ${c.short}: ${c.title}</button>
      `).join('')}
    </div>

    <div class="card mb-16">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:14px; flex-wrap:wrap;">
        <div>
          <h2 style="font-size:19px;">${cm.icon} ${cm.title}</h2>
          <div class="muted">${cm.prof}</div>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" data-launch-fc="${cm.id}">🧠 ${cm.short}-Karten</button>
          <button class="btn btn-sm" data-launch-q="${cm.id}">🎯 ${cm.short}-Quiz</button>
        </div>
      </div>
      <div class="grid-4 mt-16">
        <div><div class="muted" style="font-size:11.5px;">PRÜFUNGSFORM</div><strong style="font-size:13px;">${cm.examInfo.type}</strong></div>
        <div><div class="muted" style="font-size:11.5px;">HILFSMITTEL</div><strong style="font-size:13px;">${cm.examInfo.aid}</strong></div>
        <div><div class="muted" style="font-size:11.5px;">PVL / AUFGABEN</div><strong style="font-size:13px;">${cm.examInfo.pvl}</strong></div>
        <div><div class="muted" style="font-size:11.5px;">ZEITRAUM</div><strong style="font-size:13px;">${cm.examInfo.period}</strong></div>
      </div>
    </div>

    ${data.chapters.map(ch => {
      const saved = store.state.feynmanNotes[ch.id] || { text: '', checkedPoints: [] };
      const pinned = store.isPinned(ch.cheatSheet.id);
      const diag = ch.diagram ? DIAGRAMS[ch.diagram] : null;
      return `
        <div class="card mb-16">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
            <div style="display:flex; align-items:center; gap:10px;">
              <h3 style="font-size:16.5px;">${ch.title}</h3>
              <span class="tag">${ch.badge}</span>
            </div>
            <button class="btn btn-sm ${pinned ? 'btn-green' : 'btn-ghost'}" data-pin-ch="${ch.id}">
              ${pinned ? '📌 Auf Spickzettel' : '＋ Auf DIN-A4 Spickzettel'}
            </button>
          </div>

          <ul class="summary-list">
            ${ch.summary.map(s => `<li>${s}</li>`).join('')}
          </ul>

          ${diag ? `
            <div class="diagram-card">
              <div class="diagram-title">🎨 Dual Coding Visualisierung — ${diag.title}</div>
              ${diag.svg}
            </div>
          ` : ''}

          <div class="feynman-box">
            <div style="font-weight:700; font-size:14px; margin-bottom:4px;">🗣️ Feynman-Technik (Selbst-Erklärung)</div>
            <p class="muted" style="color:var(--text); font-size:13.5px;">${escapeHtml(ch.feynman.prompt)}</p>
            <textarea class="input-area" data-feynman-text="${ch.id}" placeholder="Erkläre es hier in deinen eigenen einfachen Worten...">${escapeHtml(saved.text)}</textarea>
            <div class="muted" style="font-size:12px; margin-bottom:6px;">Prüfe danach deine Erklärung gegen diese Kernpunkte:</div>
            ${ch.feynman.rubric.map((r, i) => `
              <label class="rubric-item">
                <input type="checkbox" data-feynman-cb="${ch.id}" data-idx="${i}" ${saved.checkedPoints.includes(i) ? 'checked' : ''}/>
                <span>${escapeHtml(r)}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `;
    }).join('')}

    <div class="card mt-24">
      <div class="card-title">📁 Kursmaterialien &amp; Original-PDFs (${cm.pdfs.length} Dateien)</div>
      ${['localhost', '127.0.0.1'].includes(location.hostname)
        ? `<p class="muted">Klicke auf eine Datei, um das lokal gespeicherte Original-Skript direkt im Browser zu öffnen:</p>
           <div class="pdf-grid">
             ${cm.pdfs.map(p => `
               <a class="pdf-link" href="${encodeURI(p.path)}" target="_blank" rel="noopener">
                 <span>📄 ${escapeHtml(p.title)}</span>
                 <span class="tag">${p.tag}</span>
               </a>
             `).join('')}
           </div>`
        : `<p class="muted mb-12">Aus Urheberrechtsgründen liegen die Original-Uni-PDFs nicht im öffentlichen GitHub-Repo. Klicke auf ein Material, um direkt den zugehörigen Moodle-Kurs zu öffnen:</p>
           <div class="mb-12"><a class="btn btn-primary btn-sm" href="${cm.moodleUrl}" target="_blank" rel="noopener">🔗 Kurs in Moodle öffnen (${cm.short})</a></div>
           <div class="pdf-grid">
             ${cm.pdfs.map(p => `
               <a class="pdf-link" href="${cm.moodleUrl}" target="_blank" rel="noopener">
                 <span>📄 ${escapeHtml(p.title)}</span>
                 <span class="tag">${p.tag}</span>
               </a>
             `).join('')}
           </div>`
      }
    </div>
  `;

  el.querySelectorAll('[data-c-tab]').forEach(btn => {
    btn.addEventListener('click', () => { selectedCourseTab = btn.dataset.cTab; render(); });
  });
  el.querySelectorAll('[data-launch-fc]').forEach(btn => {
    btn.addEventListener('click', () => setView('flashcards', { course: btn.dataset.launchFc }));
  });
  el.querySelectorAll('[data-launch-q]').forEach(btn => {
    btn.addEventListener('click', () => setView('quiz', { course: btn.dataset.launchQ }));
  });
  el.querySelectorAll('[data-pin-ch]').forEach(btn => {
    btn.addEventListener('click', () => {
      const ch = data.chapters.find(c => c.id === btn.dataset.pinCh);
      if (ch) {
        store.togglePin(ch.cheatSheet);
        showToast(store.isPinned(ch.cheatSheet.id) ? 'Auf DIN-A4 Spickzettel gepinnt!' : 'Vom Spickzettel entfernt.');
        render();
      }
    });
  });

  // Save Feynman notes live
  el.querySelectorAll('[data-feynman-text]').forEach(ta => {
    ta.addEventListener('input', () => {
      const cid = ta.dataset.feynmanText;
      const cur = store.state.feynmanNotes[cid] || { text: '', checkedPoints: [] };
      store.saveFeynman(cid, ta.value, cur.checkedPoints);
    });
  });
  el.querySelectorAll('[data-feynman-cb]').forEach(cb => {
    cb.addEventListener('change', () => {
      const cid = cb.dataset.feynmanCb;
      const idx = Number(cb.dataset.idx);
      const cur = store.state.feynmanNotes[cid] || { text: '', checkedPoints: [] };
      const set = new Set(cur.checkedPoints);
      if (cb.checked) set.add(idx); else set.delete(idx);
      store.saveFeynman(cid, cur.text, Array.from(set));
    });
  });
}

/* ==================== 5. GPAS EMAIL COACH ==================== */
function renderEmailCoach(el) {
  const prompt = ENGLISH_DATA.emailPrompts[selectedPromptIdx];
  const words = emailText.trim() ? emailText.trim().split(/\s+/).length : 0;
  const lower = emailText.toLowerCase();

  const hasGreeting = /^(dear|hello|hi)\s+[a-z]/im.test(emailText.trim());
  const hasPurpose = /(thank you for|in your (last |previous )?email|i am writing to|regarding your|with reference to)/i.test(emailText);
  const hasParas = emailText.trim().split(/\n\s*\n/).filter(Boolean).length >= 3;
  const hasIndirect = /(could you|would you mind|i would appreciate|i was wondering if|could you please let me know)/i.test(emailText);
  const hasSalutation = /(kind regards|best regards|best wishes|yours sincerely|sincerely)/i.test(emailText);
  const hasEmoticon = /(:\)|:-\)|;\)|😊|😀|👍)/i.test(emailText);
  const kwHits = prompt.keywords.filter(k => lower.includes(k));

  el.innerHTML = `
    <div class="pill-bar">
      ${ENGLISH_DATA.emailPrompts.map((p, i) => `
        <button class="pill ${i === selectedPromptIdx ? 'active' : ''}" data-ep="${i}">Scenario ${i + 1}: ${p.title}</button>
      `).join('')}
    </div>

    <div class="card mb-16">
      <div class="card-title">📋 Exam Task — ${prompt.title}</div>
      <p style="white-space:pre-line; font-size:14.5px;">${escapeHtml(prompt.scenario)}</p>
      <div class="diagram-card mt-16">${DIAGRAMS['gpas-email'].svg}</div>
    </div>

    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div class="card-title" style="margin:0;">✍️ Your Semi-Formal Email (Body only, no subject line!)</div>
        <span class="tag ${words >= 110 && words <= 200 ? 'green' : 'orange'}">${words} words (Target: 120–180)</span>
      </div>
      <textarea id="email-editor" class="input-area" style="min-height:220px; font-size:14.5px;" placeholder="Dear Ms Miller,&#10;&#10;Thank you for your email regarding...">${escapeHtml(emailText)}</textarea>

      <div class="check-grid">
        <div class="check-item ${hasGreeting ? 'ok' : ''}">${hasGreeting ? '✅' : '⬜'} <strong>G</strong>reeting (Dear/Hello + Name)</div>
        <div class="check-item ${hasPurpose ? 'ok' : ''}">${hasPurpose ? '✅' : '⬜'} <strong>P</strong>urpose / Reference</div>
        <div class="check-item ${hasParas ? 'ok' : ''}">${hasParas ? '✅' : '⬜'} White Space (≥3 Paragraphs)</div>
        <div class="check-item ${hasIndirect ? 'ok' : ''}">${hasIndirect ? '✅' : '⬜'} Polite Indirect Question</div>
        <div class="check-item ${hasSalutation ? 'ok' : ''}">${hasSalutation ? '✅' : '⬜'} <strong>S</strong>alutation (Kind regards)</div>
        <div class="check-item ${hasEmoticon ? 'warn' : 'ok'}">${hasEmoticon ? '❌ Remove Emoticons!' : '✅ No Emoticons'}</div>
      </div>

      <div class="mt-16 muted">
        Target Lexis detected (<strong>${kwHits.length}/${prompt.keywords.length}</strong>):
        ${prompt.keywords.map(k => `<span class="tag ${kwHits.includes(k) ? 'green' : ''}" style="margin:2px;">${k}</span>`).join('')}
      </div>
    </div>
  `;

  el.querySelectorAll('[data-ep]').forEach(btn => {
    btn.addEventListener('click', () => { selectedPromptIdx = Number(btn.dataset.ep); render(); });
  });
  const ed = document.getElementById('email-editor');
  ed?.addEventListener('input', () => {
    emailText = ed.value;
    const pos = ed.selectionStart;
    render();
    const newEd = document.getElementById('email-editor');
    if (newEd) { newEd.focus(); newEd.setSelectionRange(pos, pos); }
  });
}

/* ==================== 6. DIN-A4 SPICKZETTEL ==================== */
function renderCheatSheet(el) {
  const pins = store.state.pinnedCheatSheet;

  el.innerHTML = `
    <div class="card mb-16 no-print">
      <div class="card-title">📄 DIN-A4 Klausur-Spickzettel Builder</div>
      <p class="muted mb-12">
        Sowohl in <strong>GP1</strong> als auch in <strong>ICS</strong> ist ein DIN-A4-Blatt mit eigenen Notizen zugelassen!
        Pinne deine schwierigsten Kapitel oder lade alle Klausur-Essentials mit einem Klick — dann einfach als PDF/DIN-A4 drucken (oder als Vorlage zum Abschreiben nutzen).
      </p>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button class="btn btn-primary btn-sm" id="cs-load-gp1">＋ Alle GP1 Essentials laden</button>
        <button class="btn btn-primary btn-sm" id="cs-load-ics">＋ Alle ICS Essentials laden</button>
        <button class="btn btn-sm" id="cs-load-all">＋ Alle 4 Kurse laden</button>
        <button class="btn btn-green btn-sm" id="cs-print">🖨️ DIN-A4 drucken / PDF</button>
        <button class="btn btn-ghost btn-sm" id="cs-clear">🗑️ Leeren</button>
      </div>
    </div>

    ${pins.length === 0 ? `
      <div class="card" style="text-align:center; padding:36px;">
        <p class="muted">Noch keine Karten auf dem Spickzettel. Lade oben die GP1/ICS Essentials oder pinne Kapitel in der Kurs-Ansicht!</p>
      </div>
    ` : `
      <div class="cheatsheet-grid">
        ${pins.map(p => `
          <div class="cs-item">
            <h4>
              <span>${escapeHtml(p.title)}</span>
              <button class="btn btn-ghost btn-sm no-print" style="padding:2px 6px;" data-unpin="${p.id}">✕</button>
            </h4>
            <p>${escapeHtml(p.content)}</p>
            ${p.code ? `<pre class="code-block"><code>${escapeHtml(p.code)}</code></pre>` : ''}
          </div>
        `).join('')}
      </div>
    `}
  `;

  const loadCoursePins = (ids) => {
    for (const cid of ids) {
      for (const ch of ALL_DATA[cid].chapters) {
        if (!store.isPinned(ch.cheatSheet.id)) store.togglePin(ch.cheatSheet);
      }
    }
    showToast('Klausur-Essentials zum Spickzettel hinzugefügt!');
    render();
  };

  document.getElementById('cs-load-gp1')?.addEventListener('click', () => loadCoursePins(['gdp1']));
  document.getElementById('cs-load-ics')?.addEventListener('click', () => loadCoursePins(['ics']));
  document.getElementById('cs-load-all')?.addEventListener('click', () => loadCoursePins(['gdp1', 'gdp2', 'ics', 'english']));
  document.getElementById('cs-print')?.addEventListener('click', () => window.print());
  document.getElementById('cs-clear')?.addEventListener('click', () => {
    store.state.pinnedCheatSheet = [];
    store.save();
    render();
  });
  el.querySelectorAll('[data-unpin]').forEach(btn => {
    btn.addEventListener('click', () => {
      store.togglePin({ id: btn.dataset.unpin });
      render();
    });
  });
}

/* ==================== 7. SCIENCE & BACKUP ==================== */
function renderScience(el) {
  el.innerHTML = `
    <div class="grid-2">
      <div class="card">
        <div class="card-title">🔬 Evidenzbasierte Lernprinzipien (Dunlosky et al.)</div>
        <ul class="summary-list">
          <li><strong>1. Spaced Repetition (SM-2):</strong> Verteiltes Wiederholen kurz vor dem Vergessen schlägt Bulimie-Lernen (Cramming) laut Meta-Analysen um das 2–3-fache bei der Langzeit-Retention.</li>
          <li><strong>2. Active Recall (Testing Effect):</strong> Aktives Abrufen aus dem Gedächtnis (Karteikarten &amp; Code-Tracing-Quiz) baut stärkere neuronale Abrufpfade auf als passives Markieren oder Wiederlesen.</li>
          <li><strong>3. Interleaving (Verschachtelung):</strong> Das Mischen von Aufgaben aus GP1, GP2, ICS &amp; English zwingt dein Gehirn, jedes Mal aktiv die richtige Lösungsstrategie zu wählen.</li>
          <li><strong>4. Dual Coding (Paivio):</strong> Kombination aus prägnantem Text + visuellen SVG-Diagrammen (DOM-Baum, Box-Modell, JCF, JVM, Scene Graph) verdoppelt die Kodierungsanker.</li>
          <li><strong>5. Feynman-Technik &amp; Confidence Calibration:</strong> Wer ein Konzept einfach selbst erklärt und vor der Lösung seine Sicherheit einschätzt, deckt Wissenslücken &amp; Kompetenz-Illusionen sofort auf.</li>
        </ul>
      </div>

      <div class="card">
        <div class="card-title">💾 Lernfortschritt sichern &amp; wiederherstellen</div>
        <p class="muted mb-16">Alle SM-2 Intervalle, Quiz-Statistiken, Feynman-Notizen und dein Spickzettel werden lokal in deinem Browser gespeichert.</p>
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:16px;">
          <button class="btn btn-primary btn-sm" id="export-btn">⬇️ JSON-Backup herunterladen</button>
          <label class="btn btn-sm" style="cursor:pointer;">
            ⬆️ Backup importieren
            <input type="file" id="import-input" accept=".json" style="display:none;" />
          </label>
          <button class="btn btn-red btn-sm" id="reset-btn">🗑️ Fortschritt zurücksetzen</button>
        </div>
        <div class="muted" style="font-size:12.5px;">
          <strong>Tastenkürzel in Spaced Repetition:</strong><br/>
          <code>Leertaste</code> = Karte umdrehen • <code>1</code> Nochmal • <code>2</code> Schwer • <code>3</code> Gut • <code>4</code> Einfach
        </div>
      </div>
    </div>
  `;

  document.getElementById('export-btn')?.addEventListener('click', () => {
    const blob = new Blob([store.exportJSON()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `studyos-ws26-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Backup heruntergeladen!');
  });
  document.getElementById('import-input')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then(txt => {
      store.importJSON(txt);
      showToast('Backup erfolgreich geladen!');
      render();
    }).catch(() => showToast('Ungültige JSON-Datei.'));
  });
  document.getElementById('reset-btn')?.addEventListener('click', () => {
    if (confirm('Wirklich gesamten Lernfortschritt zurücksetzen?')) {
      store.resetProgress();
      showToast('Fortschritt zurückgesetzt.');
      render();
    }
  });
}

/* ==================== POMODORO & GLOBAL EVENTS ==================== */
function updatePomoUI() {
  const m = String(Math.floor(pomoSeconds / 60)).padStart(2, '0');
  const s = String(pomoSeconds % 60).padStart(2, '0');
  document.getElementById('pomo-display').textContent = `${m}:${s}`;
  document.getElementById('pomo-mode').textContent = `${pomoMode} Min`;
  document.getElementById('pomo-toggle').textContent = pomoTimer ? 'Pause' : 'Start';
}

document.getElementById('pomo-toggle').addEventListener('click', () => {
  if (pomoTimer) {
    clearInterval(pomoTimer);
    pomoTimer = null;
  } else {
    pomoTimer = setInterval(() => {
      pomoSeconds -= 1;
      if (pomoSeconds <= 0) {
        clearInterval(pomoTimer);
        pomoTimer = null;
        store.recordActivity('focus', pomoMode);
        showToast(`🍅 ${pomoMode} Min Fokus geschafft! Zeit für 5 Min Pause.`);
        pomoSeconds = pomoMode * 60;
      }
      updatePomoUI();
    }, 1000);
  }
  updatePomoUI();
});

document.getElementById('pomo-reset').addEventListener('click', () => {
  if (pomoTimer) { clearInterval(pomoTimer); pomoTimer = null; }
  pomoSeconds = pomoMode * 60;
  updatePomoUI();
});

document.getElementById('pomo-switch').addEventListener('click', () => {
  if (pomoTimer) { clearInterval(pomoTimer); pomoTimer = null; }
  pomoMode = pomoMode === 25 ? 50 : 25;
  pomoSeconds = pomoMode * 60;
  updatePomoUI();
});

document.getElementById('theme-toggle').addEventListener('click', () => {
  store.toggleTheme();
  updateTopbarAndBadges();
});

document.getElementById('quick-interleave-btn').addEventListener('click', () => {
  setView('flashcards', { course: 'all' });
});

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => setView(btn.dataset.view));
});

// Keyboard shortcuts for Flashcards
document.addEventListener('keydown', (e) => {
  if (currentView !== 'flashcards') return;
  if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
  if (e.code === 'Space' && !fcFlipped && fcIndex < fcQueue.length) {
    e.preventDefault();
    fcFlipped = true;
    render();
  } else if (fcFlipped && ['1', '2', '3', '4'].includes(e.key)) {
    rateCurrentCard(Number(e.key));
  }
});

// Initial render
updatePomoUI();
render();
