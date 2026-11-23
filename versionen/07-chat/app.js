// StudyOS WS26 · Lern-Chat — messenger-style, rule-based tutor (no AI, no network).
import {
  COURSES_META, ENGLISH_DATA, DIAGRAMS, store, ALL_FLASHCARDS, ALL_QUIZZES, ALL_CHAPTERS,
  courseMeta, escapeHtml, pdfHref, getDueCards, buildFlashcardQueue, rateCard, intervalsFor, RATING_LABELS,
  cardStats, buildQuizQueue, CONFIDENCE_LEVELS, submitQuiz, calibrationStats, getCourseMastery, overallMastery,
  todayProgress, activityHistory, streakLabel, allDeadlines, formatDate, daysLeftLabel, getFeynman,
  saveFeynmanText, toggleFeynmanPoint, togglePinChapter, loadCoursePins, clearPins, analyzeEmail,
  downloadBackup, importBackup, resetProgress, Pomodoro,
} from '../shared/core.js';

/* ================================================================== *
 * Setup & helpers
 * ================================================================== */

const CHAT_KEY = 'ws26_chat07_v1';
const DRAFT_KEY = 'ws26_chat07_email';
const MAX_MSGS = 200;
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const COURSE_IDS = COURSES_META.map(c => c.id);
const RATING_ICON = { 1: '↺', 2: '◔', 3: '✓', 4: '★' };

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = escapeHtml;

const app = $('#app');
const thread = $('#thread');
const chipsEl = $('#chips');
const input = $('#input');
const panelBody = $('#panel-body');

const mqWide = matchMedia('(min-width: 1100px)');
const mqCoarse = matchMedia('(pointer: coarse)');
const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');

const cardById = id => ALL_FLASHCARDS.find(c => c.id === id);
const quizById = id => ALL_QUIZZES.find(q => q.id === id);
const chapterById = id => ALL_CHAPTERS.find(c => c.id === id);
const courseLabel = id => (id === 'all' || !id ? 'Gemischt' : courseMeta(id).short);
const dueCount = (c = 'all') => getDueCards(c).length;
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function courseTag(id) {
  const c = courseMeta(id);
  return `<span class="tag" style="--c:${c.color}">${esc(c.icon)} ${esc(c.short)}</span>`;
}
function hhmm(ts) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
function dayLabel(ts) {
  const d = new Date(ts); d.setHours(0, 0, 0, 0);
  const t = new Date(); t.setHours(0, 0, 0, 0);
  const diff = Math.round((t - d) / 86400000);
  if (diff === 0) return 'Heute';
  if (diff === 1) return 'Gestern';
  return d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
}
function sameDay(a, b) { return new Date(a).toDateString() === new Date(b).toDateString(); }
function greetingWord() {
  const h = new Date().getHours();
  if (h < 5) return 'Noch wach?';
  if (h < 11) return 'Guten Morgen!';
  if (h < 18) return 'Hallo!';
  return 'Guten Abend!';
}
function bar(pct, color) {
  return `<span class="bar" role="img" aria-label="${pct} %"><i style="width:${pct}%;${color ? `background:${color}` : ''}"></i></span>`;
}

/* ---------- Theme ---------- */

if (!localStorage.getItem('ws26_lernplattform_v1')) {
  store.state.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function applyTheme() {
  const t = store.state.theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = t;
  $$('meta[name="theme-color"]').forEach(m => { m.content = t === 'dark' ? '#0b0b0d' : '#f6f6f8'; });
}

/* ---------- Toasts ---------- */

function toast(text, kind = '') {
  const t = document.createElement('div');
  t.className = `toast ${kind}`;
  t.textContent = text;
  $('#toasts').append(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, 2600);
}

/* ================================================================== *
 * Chat history (own localStorage key, capped)
 * ================================================================== */

let msgs = (() => {
  try {
    const d = JSON.parse(localStorage.getItem(CHAT_KEY) || 'null');
    return Array.isArray(d?.msgs) ? d.msgs : [];
  } catch { return []; }
})();
let seq = 0;
const uid = () => `${Date.now().toString(36)}${(seq++).toString(36)}`;
const msgById = id => msgs.find(m => m.id === id);

function saveMsgs() {
  let trimmed = false;
  if (msgs.length > MAX_MSGS) { msgs.splice(0, msgs.length - MAX_MSGS); trimmed = true; }
  try { localStorage.setItem(CHAT_KEY, JSON.stringify({ v: 1, msgs })); } catch { /* quota: keep in memory */ }
  if (trimmed) renderThread();
}

/** Appends a message. from: 'bot' | 'me'. */
function post(from, kind, data = {}) {
  const m = { id: uid(), from, kind, ts: Date.now(), ...data };
  const prev = msgs[msgs.length - 1];
  msgs.push(m);
  if (!prev || !sameDay(prev.ts, m.ts)) thread.append(dayNode(m.ts));
  thread.append(msgNode(m, true));
  saveMsgs();
  scrollBottom();
  renderSide();
  return m;
}
function patch(m, changes = {}) {
  if (!m) return;
  Object.assign(m, changes);
  saveMsgs();
  const n = document.getElementById('m-' + m.id);
  if (n) n.replaceWith(msgNode(m));
}
function say(html, extra = {}) { return post('bot', 'text', { html, ...extra }); }
function echo(text) { return post('me', 'text', { html: esc(text) }); }

function clearChat() {
  if (!confirm('Chat-Verlauf wirklich leeren? (Dein Lernfortschritt bleibt erhalten.)')) return;
  session = null; choice = null; feynmanWait = null;
  msgs = [];
  saveMsgs();
  renderThread();
  welcome(true);
  renderChips();
  toast('Verlauf geleert');
}

/* ---------- Thread rendering ---------- */

let atBottom = true;
thread.addEventListener('scroll', () => {
  atBottom = thread.scrollHeight - thread.scrollTop - thread.clientHeight < 48;
}, { passive: true });

function scrollBottom(instant = false) {
  requestAnimationFrame(() => {
    thread.scrollTo({ top: thread.scrollHeight, behavior: instant || mqReduce.matches ? 'auto' : 'smooth' });
    atBottom = true;
  });
}

function dayNode(ts) {
  const d = document.createElement('div');
  d.className = 'day';
  d.innerHTML = `<span>${esc(dayLabel(ts))}</span>`;
  return d;
}

function renderThread() {
  thread.textContent = '';
  let prev = null;
  for (const m of msgs) {
    if (!prev || !sameDay(prev.ts, m.ts)) thread.append(dayNode(m.ts));
    thread.append(msgNode(m));
    prev = m;
  }
  scrollBottom(true);
}

function msgNode(m, fresh = false) {
  const el = document.createElement('div');
  el.className = `msg ${m.from}${fresh ? ' fresh' : ''}`;
  el.id = 'm-' + m.id;
  el.dataset.kind = m.kind;
  const r = (RENDER[m.kind] || RENDER.text)(m);
  const acts = m.acts?.length
    ? `<div class="ik-row">${m.acts.map(a => ikBtn(a)).join('')}</div>` : '';
  el.innerHTML = `<div class="bubble${r.rich ? ' rich' : ''}${m.cls ? ' ' + m.cls : ''}">${r.html}${acts}<span class="meta">${hhmm(m.ts)}</span></div>`;
  return el;
}

function ikBtn(a) {
  const echoText = a.echo === false ? '' : (a.echo || (CHAT_ACTS.has(a.act) ? a.label : ''));
  return `<button type="button" class="ik${a.primary ? ' primary' : ''}" data-act="${esc(a.act)}"${a.arg != null ? ` data-arg="${esc(a.arg)}"` : ''}${echoText ? ` data-echo="${esc(echoText)}"` : ''}>${esc(a.label)}</button>`;
}

const RENDER = {
  text: m => ({ html: `<div class="txt">${m.html}</div>`, rich: !!m.rich }),

  card(m) {
    const c = cardById(m.cardId);
    if (!c) return { html: '<div class="txt muted">Diese Karte existiert nicht mehr.</div>' };
    const ch = chapterById(c.chapterId);
    const active = session?.type === 'cards' && session.msgId === m.id;
    let status = '';
    if (m.rated) {
      const r = RATING_LABELS.find(x => x.value === m.rated);
      status = `<div class="status r${m.rated}">${RATING_ICON[m.rated]} ${esc(r.label)}</div>`;
    } else if (!active) {
      status = '<div class="status muted">Nicht bewertet</div>';
    } else if (!m.revealed) {
      status = '<div class="status hint">Erst selbst überlegen – dann aufdecken.</div>';
    }
    return {
      rich: true,
      html: `<div class="rich-head">${courseTag(c.courseId)}${c.examRelevant ? '<span class="exam">★ Klausurrelevant</span>' : ''}<span class="count">Karte ${m.n}/${m.total}</span></div>
        ${ch ? `<div class="sub">${esc(ch.title)}</div>` : ''}
        <div class="card-front">${esc(c.front)}</div>${status}`,
    };
  },

  back(m) {
    const c = cardById(m.cardId);
    if (!c) return { html: '<div class="txt muted">–</div>' };
    return {
      rich: true,
      html: `<div class="rich-head"><span class="label">Antwort</span></div><div class="card-back">${esc(c.back)}</div>`,
    };
  },

  quiz(m) {
    const q = quizById(m.quizId);
    if (!q) return { html: '<div class="txt muted">Diese Frage existiert nicht mehr.</div>' };
    const active = session?.type === 'quiz' && session.msgId === m.id && !m.result;
    const opts = q.options.map((o, i) => {
      let cls = 'opt';
      if (m.result) {
        if (i === q.answer) cls += ' ok';
        else if (i === m.selected) cls += ' bad';
      } else if (i === m.selected) cls += ' sel';
      return `<button type="button" class="${cls}" data-act="q-select" data-arg="${i}" ${active ? '' : 'disabled'} aria-pressed="${i === m.selected}">
        <span class="letter">${LETTERS[i]}</span><span class="opt-t">${esc(o)}</span></button>`;
    }).join('');
    return {
      rich: true,
      html: `<div class="rich-head">${courseTag(q.courseId)}${q.examStyle ? `<span class="exam">${esc(q.examStyle)}</span>` : ''}<span class="count">Frage ${m.n}/${m.total}</span></div>
        <div class="q-text">${esc(q.question)}</div>
        ${q.code ? `<pre class="code"><code>${esc(q.code)}</code></pre>` : ''}
        <div class="opts" role="group" aria-label="Antwortoptionen">${opts}</div>
        ${!m.result && !active ? '<div class="status muted">Nicht beantwortet</div>' : ''}`,
    };
  },

  qfb(m) {
    const q = quizById(m.quizId);
    if (!q) return { html: '<div class="txt muted">–</div>' };
    const head = m.correct
      ? '<div class="verdict ok">✓ Richtig!</div>'
      : `<div class="verdict bad">✗ Leider falsch.</div><p>Richtig ist <b>${LETTERS[q.answer]})</b> ${esc(q.options[q.answer])}</p>`;
    const over = m.over
      ? `<div class="warn"><b>⚠ Hyperkorrektur-Moment:</b> Du warst dir 100 % sicher – und lagst daneben. Genau solche Fehler prägen sich am stärksten ein, wenn du die Erklärung jetzt bewusst liest.</div>` : '';
    return { rich: true, html: `${head}${over}<div class="expl"><span class="label">Erklärung</span><p>${esc(q.explanation)}</p></div>` };
  },

  chapter(m) {
    const ch = chapterById(m.chapterId);
    if (!ch) return { html: '<div class="txt muted">Kapitel nicht gefunden.</div>' };
    const pinned = store.isPinned(ch.cheatSheet.id);
    return {
      rich: true,
      html: `<div class="rich-head">${courseTag(ch.courseId)}${ch.badge ? `<span class="exam">${esc(ch.badge)}</span>` : ''}</div>
        <h3 class="rich-title">${esc(ch.title)}</h3>
        <ul class="sum">${ch.summary.map(s => `<li>${s}</li>`).join('')}</ul>
        ${ch.diagram && DIAGRAMS[ch.diagram] ? `<div class="dg-frame">${DIAGRAMS[ch.diagram].svg}</div>` : ''}
        <div class="feyn-q"><span class="label">Feynman-Frage</span><p>${esc(ch.feynman.prompt)}</p></div>
        <div class="ik-row">
          <button type="button" class="ik primary" data-act="feynman" data-arg="${esc(ch.id)}" data-echo="Ich erkläre es selbst">Ich erkläre es (Feynman)</button>
          <button type="button" class="ik" data-act="pin" data-arg="${esc(ch.id)}" data-pin="${esc(ch.id)}" aria-pressed="${pinned}">${pinned ? '📌 Angeheftet' : '📌 Anheften'}</button>
          <button type="button" class="ik" data-act="nav" data-arg="kurs/${esc(ch.courseId)}/${esc(ch.id)}">Im Kursleser öffnen</button>
          <button type="button" class="ik" data-act="cards" data-arg="${esc(ch.courseId)}" data-echo="Karten ${esc(courseMeta(ch.courseId).short)}">Karten ${esc(courseMeta(ch.courseId).short)}</button>
        </div>`,
    };
  },

  rubric(m) {
    const ch = chapterById(m.chapterId);
    if (!ch) return { html: '<div class="txt muted">–</div>' };
    const f = getFeynman(ch.id);
    return {
      rich: true,
      html: `<div class="rich-head">${courseTag(ch.courseId)}<span class="label">Selbst-Check</span></div>
        <p>Gespeichert! Vergleiche deine Erklärung mit diesen Kernpunkten und hake ab, was du wirklich drin hattest:</p>
        <div class="rubric">${ch.feynman.rubric.map((r, i) => `<label class="check"><input type="checkbox" data-fp="${esc(ch.id)}:${i}" ${f.checkedPoints.includes(i) ? 'checked' : ''}><span>${esc(r)}</span></label>`).join('')}</div>
        <div class="ik-row"><button type="button" class="ik" data-act="nav" data-arg="kurs/${esc(ch.courseId)}/${esc(ch.id)}">Im Kursleser überarbeiten</button></div>`,
    };
  },
};

/* ================================================================== *
 * Bot sessions (cards / quiz / Feynman)
 * ================================================================== */

let session = null;     // { type:'cards'|'quiz', ... }
let choice = null;      // pending quick-reply chips after a bot question
let feynmanWait = null; // chapterId while waiting for the user's explanation

function endSession(announce = false) {
  const s = session;
  if (!s) return;
  session = null;
  const m = msgById(s.msgId);
  if (m) patch(m);
  if (announce) {
    if (s.type === 'cards') say(`Sitzung beendet – <b>${s.done}</b> ${s.done === 1 ? 'Karte' : 'Karten'} bewertet. Bis gleich!`);
    else say(`Quiz beendet – <b>${s.correct}/${s.answered}</b> richtig.`);
  }
  renderChips();
}

/* ---------- Flashcards ---------- */

function askCardCourse() {
  const all = dueCount('all');
  say('Welche Karten? <b>Gemischt</b> (Interleaving über alle Kurse) bringt langfristig am meisten.', {
    acts: [{ label: `Gemischt · ${all} fällig`, act: 'cards', arg: 'all', echo: 'Karten gemischt' },
      ...COURSES_META.map(c => ({ label: `${c.icon} ${c.short} · ${dueCount(c.id)}`, act: 'cards', arg: c.id, echo: `Karten ${c.short}` }))],
  });
  choice = [{ label: 'Gemischt', sub: `${all} fällig`, act: 'cards', arg: 'all', echo: 'Karten gemischt', primary: true },
    ...COURSES_META.map(c => ({ label: `${c.icon} ${c.short}`, sub: `${dueCount(c.id)} fällig`, act: 'cards', arg: c.id, echo: `Karten ${c.short}` }))];
  renderChips();
}

function startCards(course = 'all', includeAll = false) {
  endSession();
  feynmanWait = null;
  const queue = buildFlashcardQueue(course, includeAll);
  const label = courseLabel(course);
  if (!queue.length) {
    say(`🎉 In <b>${esc(label)}</b> ist gerade nichts fällig. Spaced Repetition wirkt, weil du erst kurz vor dem Vergessen wiederholst – du kannst trotzdem freiwillig üben oder dich im Quiz testen.`, {
      acts: [{ label: 'Alle Karten nochmal üben', act: 'cards-all', arg: course, primary: true },
        { label: `Quiz ${label}`, act: 'quiz', arg: course }],
    });
    choice = [{ label: 'Alle Karten nochmal üben', act: 'cards-all', arg: course, echo: 'Alle Karten nochmal üben', primary: true },
      { label: `Zum Quiz ${label}`, act: 'quiz', arg: course, echo: `Quiz ${label}` }];
    renderChips();
    return;
  }
  session = { type: 'cards', course, includeAll, queue, pos: 0, done: 0, again: 0, phase: 'front', msgId: null };
  say(`Los geht's: <b>${plural(queue.length, 'Karte', 'Karten')}</b>${includeAll ? ' (alle)' : ' fällig'} · ${esc(label)}${course === 'all' ? ' – interleaved' : ''}. Schreib deine Antwort ruhig erst selbst in den Chat (Abrufübung) – dann zeig ich dir die Lösung.`);
  nextCard();
}

function nextCard() {
  const s = session;
  if (!s || s.type !== 'cards') return;
  if (s.pos >= s.queue.length) { finishCards(); return; }
  const card = s.queue[s.pos];
  s.phase = 'front';
  s.msgId = null;
  const m = post('bot', 'card', { cardId: card.id, n: s.pos + 1, total: s.queue.length });
  s.msgId = m.id;
  patch(m);
  renderChips();
}

function reveal(attempt = null, echoIt = true) {
  const s = session;
  if (!(s?.type === 'cards' && s.phase === 'front')) return;
  if (attempt) post('me', 'text', { html: `<span class="note">Mein Versuch</span>${esc(attempt)}` });
  else if (echoIt) echo('Aufdecken');
  const m = msgById(s.msgId);
  s.phase = 'back';
  patch(m, { revealed: true });
  post('bot', 'back', { cardId: m.cardId });
  renderChips();
}

function rate(r) {
  const s = session;
  if (!(s?.type === 'cards' && s.phase === 'back') || !(r >= 1 && r <= 4)) return;
  const card = s.queue[s.pos];
  const iv = intervalsFor(card)[r];
  const label = RATING_LABELS.find(x => x.value === r).label;
  s.phase = 'rated';
  const again = rateCard(card, r);
  patch(msgById(s.msgId), { rated: r });
  post('me', 'text', { html: `${RATING_ICON[r]} ${esc(label)} <span class="note-inline">· ${esc(iv)}</span>`, cls: `rate r${r}` });
  s.done += 1;
  if (again) {
    s.queue.push(card);
    s.again += 1;
    toast('Karte kommt am Ende der Runde nochmal');
  }
  s.pos += 1;
  nextCard();
}

function finishCards() {
  const s = session;
  session = null;
  const tp = todayProgress();
  say(`✅ Runde geschafft: <b>${plural(s.done, 'Bewertung', 'Bewertungen')}</b>${s.again ? `, davon ${s.again}× „Nochmal“` : ''}. Heute: <b>${tp.done}/${tp.goal}</b> (${tp.pct} %) · Serie ${esc(streakLabel())}.`, {
    acts: [{ label: 'Alle Karten nochmal üben', act: 'cards-all', arg: s.course },
      { label: `Quiz ${courseLabel(s.course)}`, act: 'quiz', arg: s.course, primary: true }],
  });
  choice = [{ label: `Quiz ${courseLabel(s.course)}`, act: 'quiz', arg: s.course, echo: `Quiz ${courseLabel(s.course)}`, primary: true },
    { label: 'Alle Karten nochmal üben', act: 'cards-all', arg: s.course, echo: 'Alle Karten nochmal üben' }];
  renderChips();
}

/* ---------- Quiz ---------- */

function askQuizCourse() {
  say('Welches Quiz? Gib vor jeder Antwort an, wie sicher du bist – so trainierst du deine Selbsteinschätzung.', {
    acts: [{ label: 'Gemischt', act: 'quiz', arg: 'all', echo: 'Quiz gemischt' },
      ...COURSES_META.map(c => ({ label: `${c.icon} ${c.short} · ${ALL_QUIZZES.filter(q => q.courseId === c.id).length}`, act: 'quiz', arg: c.id, echo: `Quiz ${c.short}` }))],
  });
  choice = [{ label: 'Gemischt', sub: `${ALL_QUIZZES.length} Fragen`, act: 'quiz', arg: 'all', echo: 'Quiz gemischt', primary: true },
    ...COURSES_META.map(c => ({ label: `${c.icon} ${c.short}`, sub: `${ALL_QUIZZES.filter(q => q.courseId === c.id).length} Fragen`, act: 'quiz', arg: c.id, echo: `Quiz ${c.short}` }))];
  renderChips();
}

function startQuiz(course = 'all') {
  endSession();
  feynmanWait = null;
  const queue = buildQuizQueue(course);
  if (!queue.length) { say('Für diese Auswahl gibt es keine Fragen.'); return; }
  session = { type: 'quiz', course, queue, pos: 0, correct: 0, answered: 0, phase: 'ask', selected: null, confidence: 'medium', msgId: null };
  say(`Quiz <b>${esc(courseLabel(course))}</b>: ${plural(queue.length, 'Frage', 'Fragen')}. Antwort antippen, Sicherheit wählen, prüfen.`);
  nextQuestion();
}

function nextQuestion() {
  const s = session;
  if (!s || s.type !== 'quiz') return;
  if (s.pos >= s.queue.length) { finishQuiz(); return; }
  const q = s.queue[s.pos];
  Object.assign(s, { phase: 'ask', selected: null, confidence: 'medium', msgId: null });
  const m = post('bot', 'quiz', { quizId: q.id, n: s.pos + 1, total: s.queue.length, selected: null });
  s.msgId = m.id;
  patch(m);
  renderChips();
}

function selectOption(i) {
  const s = session;
  if (!(s?.type === 'quiz' && s.phase === 'ask')) return;
  const q = s.queue[s.pos];
  if (!(i >= 0 && i < q.options.length)) return;
  s.selected = i;
  patch(msgById(s.msgId), { selected: i });
  renderChips();
}

function setConfidence(v) {
  if (!(session?.type === 'quiz' && session.phase === 'ask')) return;
  if (CONFIDENCE_LEVELS.some(c => c.value === v)) session.confidence = v;
  renderChips();
}

function submitAnswer() {
  const s = session;
  if (!(s?.type === 'quiz' && s.phase === 'ask')) return;
  if (s.selected == null) { toast('Wähle zuerst eine Antwort'); return; }
  const q = s.queue[s.pos];
  const res = submitQuiz(q, s.selected, s.confidence);
  const conf = CONFIDENCE_LEVELS.find(c => c.value === s.confidence).label;
  s.phase = 'feedback';
  patch(msgById(s.msgId), { result: res, selected: s.selected, confidence: s.confidence });
  post('me', 'text', { html: `<b>${LETTERS[s.selected]})</b> ${esc(q.options[s.selected])} <span class="note-inline">· ${esc(conf)}</span>` });
  post('bot', 'qfb', { quizId: q.id, correct: res.correct, over: res.overconfident, selected: s.selected, confidence: s.confidence });
  s.answered += 1;
  if (res.correct) s.correct += 1;
  s.pos += 1;
  renderChips();
}

function finishQuiz() {
  const s = session;
  session = null;
  const pct = s.answered ? Math.round((s.correct / s.answered) * 100) : 0;
  const cal = calibrationStats();
  const hi = cal.high.n ? Math.round((cal.high.ok / cal.high.n) * 100) : null;
  say(`🏁 Quiz fertig: <b>${s.correct}/${s.answered}</b> richtig (${pct} %).${hi != null ? ` Wenn du „100 % sicher“ sagst, liegst du insgesamt bei <b>${hi} %</b>.` : ''}`, {
    acts: [{ label: 'Nochmal', act: 'quiz', arg: s.course, primary: true },
      { label: 'Anderer Kurs', act: 'quiz-menu' },
      { label: 'Karten lernen', act: 'cards-menu' }],
  });
  choice = [{ label: 'Quiz nochmal', act: 'quiz', arg: s.course, echo: `Quiz ${courseLabel(s.course)}`, primary: true },
    { label: 'Anderer Kurs', act: 'quiz-menu', echo: 'Quiz' },
    { label: 'Karten lernen', act: 'cards-menu', echo: 'Karten lernen' }];
  renderChips();
}

/* ---------- Feynman in chat ---------- */

function startFeynman(chId) {
  const ch = chapterById(chId);
  if (!ch) return;
  endSession();
  feynmanWait = chId;
  say(`Erklär mir „<b>${esc(ch.title)}</b>“ so, als wäre ich Erstsemester:<br><i>${esc(ch.feynman.prompt)}</i><br><br>Schreib einfach los – deine Erklärung landet auch im Kursleser.`);
  renderChips();
  if (!mqCoarse.matches) input.focus();
}

function finishFeynman(text) {
  const chId = feynmanWait;
  feynmanWait = null;
  saveFeynmanText(chId, text);
  post('bot', 'rubric', { chapterId: chId });
  renderChips();
}

/* ---------- Info messages ---------- */

function statusHtml(course = null) {
  const tp = todayProgress();
  const ids = course ? [course] : COURSE_IDS;
  const rows = ids.map(id => {
    const c = courseMeta(id);
    const m = getCourseMastery(id);
    return `<button type="button" class="row-btn" data-act="cards" data-arg="${id}" data-echo="Karten ${esc(c.short)}">
      <span class="row-ic" style="--c:${c.color}">${esc(c.icon)}</span><span class="row-main"><b>${esc(c.short)}</b>${bar(m, c.color)}</span>
      <span class="row-num">${m} %</span><span class="pill${dueCount(id) ? ' hot' : ''}">${dueCount(id)} fällig</span></button>`;
  }).join('');
  const next = allDeadlines().filter(d => !course || d.courseId === course).slice(0, 3);
  return `<div class="stat-top">
      <div><span class="big">${tp.done}<small>/${tp.goal}</small></span><span class="label">heute erledigt</span></div>
      <div><span class="big">${dueCount(course || 'all')}</span><span class="label">Karten fällig</span></div>
      <div><span class="big">🔥 ${esc(streakLabel())}</span><span class="label">Serie</span></div>
    </div>${bar(tp.pct)}
    <div class="rows">${rows}</div>
    ${next.length ? `<div class="label spaced">Nächste Termine</div><ul class="dl">${next.map(dlItem).join('')}</ul>` : ''}`;
}

function dlItem(d) {
  return `<li class="${d.daysLeft <= 3 ? 'soon' : ''}"><span class="dl-when"><b>${esc(daysLeftLabel(d.daysLeft))}</b><small>${esc(formatDate(d.date))}</small></span>
    <span class="dl-what"><span class="dot" style="background:${d.color}"></span>${esc(d.label)}</span></li>`;
}

function postStatus(course = null, greeting = false) {
  const due = dueCount(course || 'all');
  const intro = greeting ? `${greetingWord()} Hier ist dein Stand:` : course ? `Stand in <b>${esc(courseMeta(course).short)}</b>:` : 'Das ist heute fällig:';
  say(`<p>${intro}</p>${statusHtml(course)}`, {
    rich: true,
    acts: [{ label: due ? `${due} fällige Karten lernen` : 'Alle Karten üben', act: due ? 'cards' : 'cards-all', arg: course || 'all', primary: true },
      { label: `Quiz ${courseLabel(course || 'all')}`, act: 'quiz', arg: course || 'all' },
      { label: 'Alle Termine', act: 'deadlines', arg: course || '' }],
  });
}

function postDeadlines(course = null) {
  const list = allDeadlines().filter(d => !course || d.courseId === course);
  if (!list.length) { say('Keine anstehenden Termine. 🎈'); return; }
  say(`<p>📅 Anstehende Termine${course ? ` in <b>${esc(courseMeta(course).short)}</b>` : ''}:</p><ul class="dl">${list.map(dlItem).join('')}</ul>`, { rich: true });
}

function postCourse(id) {
  const c = courseMeta(id);
  const m = getCourseMastery(id);
  const chs = ALL_CHAPTERS.filter(ch => ch.courseId === id);
  say(`<div class="rich-head"><span class="tag" style="--c:${c.color}">${esc(c.icon)} ${esc(c.short)}</span><span class="count">${m} % gemeistert</span></div>
    <h3 class="rich-title">${esc(c.title)}</h3><p class="muted small">${esc(c.prof)}</p>${bar(m, c.color)}
    <dl class="exam-dl"><dt>Prüfung</dt><dd>${esc(c.examInfo.type)}</dd><dt>Hilfsmittel</dt><dd>${esc(c.examInfo.aid)}</dd><dt>PVL</dt><dd>${esc(c.examInfo.pvl)}</dd><dt>Zeitraum</dt><dd>${esc(c.examInfo.period)}</dd></dl>`, {
    rich: true,
    acts: [{ label: `Karten · ${dueCount(id)} fällig`, act: 'cards', arg: id, primary: true, echo: `Karten ${c.short}` },
      { label: 'Quiz', act: 'quiz', arg: id, echo: `Quiz ${c.short}` },
      { label: `Kapitel (${chs.length})`, act: 'chapter-menu', arg: id, echo: `Kapitel ${c.short}` },
      { label: 'Kursleser & PDFs', act: 'nav', arg: `kurs/${id}` }],
  });
}

function postChapterMenu(course = null, list = null) {
  if (!course && !list) {
    say('Aus welchem Kurs soll ich dir ein Kapitel erklären?', {
      acts: COURSES_META.map(c => ({ label: `${c.icon} ${c.short}`, act: 'chapter-menu', arg: c.id, echo: `Kapitel ${c.short}` })),
    });
    choice = COURSES_META.map(c => ({ label: `${c.icon} ${c.short}`, sub: `${ALL_CHAPTERS.filter(ch => ch.courseId === c.id).length} Kapitel`, act: 'chapter-menu', arg: c.id, echo: `Kapitel ${c.short}` }));
    renderChips();
    return;
  }
  const chs = list || ALL_CHAPTERS.filter(ch => ch.courseId === course);
  say(course ? `Kapitel in <b>${esc(courseMeta(course).short)}</b> – welches?` : 'Diese Kapitel passen – welches?', {
    acts: chs.map(ch => ({ label: ch.title, act: 'chapter', arg: ch.id, echo: `Erklär mir ${ch.title}` })),
  });
  choice = chs.map(ch => ({ label: ch.title.length > 34 ? ch.title.slice(0, 32) + '…' : ch.title, act: 'chapter', arg: ch.id, echo: `Erklär mir ${ch.title}` }));
  renderChips();
}

function postChapter(id) {
  if (!chapterById(id)) return;
  post('bot', 'chapter', { chapterId: id });
}

function postHelp() {
  say(`<p>Ich verstehe einfache Befehle – auch kombiniert mit einem Kurs (<code>gp1</code>, <code>gp2</code>, <code>ics</code>, <code>eng</code>):</p>
    <ul class="help">
      <li><code>karten</code> · <code>karten ics</code> – fällige Karteikarten</li>
      <li><code>alle karten gp1</code> – alle Karten nochmal üben</li>
      <li><code>quiz</code> · <code>quiz gp2</code> – Multiple-Choice mit Sicherheitsangabe</li>
      <li><code>fällig</code> – heutiger Stand · <code>termine</code> – Deadlines</li>
      <li><code>erklär rekursion</code> · <code>kapitel gp1</code> – Kapitel im Chat</li>
      <li><code>gp1</code> – Kursinfo · <code>spickzettel</code> · <code>email</code> · <code>backup</code></li>
      <li><code>pomodoro</code> · <code>pomodoro 50</code> · <code>pause</code> · <code>dunkel</code>/<code>hell</code></li>
    </ul>
    <p class="muted small">Während einer Karte: Antwort eintippen → ich decke auf; danach <code>1</code>–<code>4</code>. Im Quiz: <code>a</code>–<code>d</code>, dann <code>prüfen</code>.</p>`, { rich: true });
}

function welcome(force = false) {
  const last = msgs[msgs.length - 1];
  if (!force && last && Date.now() - last.ts < 30 * 60 * 1000) return;
  if (!msgs.length) {
    say('Hi, ich bin <b>Studi-Bot</b> 👋 Ich frage dich Karteikarten ab, stelle Quizfragen, erkläre Kapitel und erinnere dich an Termine. Tippe unten auf einen Vorschlag oder schreib z. B. „quiz gp1“.');
  }
  postStatus(null, true);
}

/* ---------- Pomodoro ---------- */

const pomo = new Pomodoro({
  onChange: updatePomo,
  onFinish: mins => {
    toast(`🍅 ${mins} Minuten Fokus geschafft!`, 'ok');
    say(`🍅 <b>${mins} Minuten Fokus</b> geschafft und gespeichert. Gönn dir 5 Minuten Pause – weg vom Bildschirm.`, {
      acts: [{ label: 'Neue Runde starten', act: 'pomo-toggle', primary: true }],
    });
  },
});

function updatePomo() {
  $$('[data-pomo-time]').forEach(e => { e.textContent = pomo.display; });
  $$('[data-pomo-bar]').forEach(e => { e.style.width = `${Math.round(pomo.progress * 100)}%`; });
  $$('[data-pomo-toggle]').forEach(e => { e.textContent = pomo.running ? 'Pause' : 'Start'; });
  $$('[data-pomo-mode]').forEach(e => { e.textContent = `${pomo.mode} Min ↔ ${pomo.mode === 25 ? 50 : 25} Min`; });
  $('#pomo-pill').classList.toggle('running', pomo.running);
  $('#pomo-pill').setAttribute('aria-pressed', String(pomo.running));
  updateHead();
}

function pomoChat(arg) {
  const low = arg || '';
  if (/50|25/.test(low)) {
    const want = low.includes('50') ? 50 : 25;
    if (pomo.mode !== want) pomo.switchMode();
  }
  if (/stop|pause|halt/.test(low)) {
    if (pomo.running) pomo.toggle();
    say(`⏸ Pomodoro pausiert bei <b>${pomo.display}</b>.`, { acts: [{ label: 'Weiter', act: 'pomo-toggle', primary: true }, { label: 'Zurücksetzen', act: 'pomo-reset' }] });
  } else if (/reset|zurück/.test(low)) {
    pomo.reset();
    say(`↺ Pomodoro zurückgesetzt auf <b>${pomo.display}</b>.`);
  } else if (!pomo.running) {
    pomo.toggle();
    say(`🍅 Fokus läuft: <b>${pomo.mode} Minuten</b>. Handy weg, eine Aufgabe – ich melde mich, wenn die Zeit um ist.`, {
      acts: [{ label: 'Pause', act: 'pomo-toggle' }, { label: `${pomo.mode === 25 ? 50 : 25} Min-Modus`, act: 'pomo-mode' }],
    });
  } else {
    say(`🍅 Läuft noch: <b>${pomo.display}</b> von ${pomo.mode} Min.`, { acts: [{ label: 'Pause', act: 'pomo-toggle' }, { label: 'Zurücksetzen', act: 'pomo-reset' }] });
  }
  renderChips();
}

/* ================================================================== *
 * Quick-reply chips
 * ================================================================== */

function chipHtml(c) {
  const echoText = c.echo || '';
  return `<button type="button" class="chip${c.primary ? ' primary' : ''}${c.on ? ' on' : ''}${c.cls ? ' ' + c.cls : ''}" data-act="${esc(c.act)}"${c.arg != null ? ` data-arg="${esc(c.arg)}"` : ''}${echoText ? ` data-echo="${esc(echoText)}"` : ''}${c.pressed != null ? ` aria-pressed="${c.pressed}"` : ''}${c.aria ? ` aria-label="${esc(c.aria)}"` : ''}>
    <span class="chip-l">${esc(c.label)}</span>${c.sub ? `<span class="chip-s">${esc(c.sub)}</span>` : ''}${c.kbd ? `<kbd>${esc(c.kbd)}</kbd>` : ''}</button>`;
}

function renderChips() {
  let list;
  let mode = 'flow';
  const s = session;
  if (feynmanWait) {
    list = [{ label: 'Abbrechen', act: 'feynman-cancel', echo: 'Abbrechen' }];
  } else if (s?.type === 'cards' && s.phase === 'front') {
    mode = 'grid';
    list = [{ label: 'Aufdecken', act: 'reveal', primary: true, kbd: 'Leertaste', cls: 'wide' },
      { label: 'Beenden', act: 'end', echo: 'Beenden' }];
  } else if (s?.type === 'cards' && s.phase === 'back') {
    mode = 'grid';
    const iv = intervalsFor(s.queue[s.pos]);
    list = RATING_LABELS.map(r => ({ label: r.label, sub: iv[r.value], act: 'rate', arg: r.value, kbd: r.key, cls: `r${r.value}`, aria: `${r.label}, nächste Wiederholung in ${iv[r.value]}` }));
  } else if (s?.type === 'quiz' && s.phase === 'ask') {
    mode = 'grid';
    const q = s.queue[s.pos];
    if (s.selected == null) {
      list = [...q.options.map((_, i) => ({ label: LETTERS[i], act: 'q-select', arg: i, kbd: String(i + 1), aria: `Antwort ${LETTERS[i]}` })),
        { label: '✕', act: 'end', echo: 'Quiz beenden', aria: 'Quiz beenden' }];
    } else {
      list = [...CONFIDENCE_LEVELS.map(c => ({ label: c.label, act: 'conf', arg: c.value, on: s.confidence === c.value, pressed: s.confidence === c.value, cls: 'conf' })),
        { label: 'Prüfen', act: 'submit', primary: true, kbd: '↵' }];
    }
  } else if (s?.type === 'quiz' && s.phase === 'feedback') {
    mode = 'grid';
    list = [{ label: s.pos >= s.queue.length ? 'Auswertung' : 'Nächste Frage', act: 'next', primary: true, kbd: 'N', cls: 'wide' },
      { label: 'Beenden', act: 'end', echo: 'Quiz beenden' }];
  } else if (choice) {
    list = choice;
  } else {
    const due = dueCount('all');
    list = [
      { label: 'Karten lernen', sub: due ? `${due} fällig` : '', act: 'cards-menu', echo: 'Karten lernen', primary: due > 0 },
      { label: 'Quiz', act: 'quiz-menu', echo: 'Quiz' },
      { label: 'Was ist fällig?', act: 'status', echo: 'Was ist fällig?' },
      { label: 'Erklär mir ein Kapitel', act: 'chapter-menu', echo: 'Erklär mir ein Kapitel' },
      { label: 'Termine', act: 'deadlines', echo: 'Termine' },
      { label: pomo.running ? 'Pomodoro pausieren' : 'Pomodoro starten', act: 'pomo-chat', arg: pomo.running ? 'pause' : '', echo: pomo.running ? 'Pomodoro pausieren' : 'Pomodoro starten' },
      { label: 'E-Mail-Coach', act: 'email-chat', echo: 'E-Mail-Coach' },
      { label: 'Spickzettel', act: 'spick-chat', echo: 'Spickzettel' },
      { label: 'Hilfe', act: 'help', echo: 'Hilfe' },
    ];
  }
  chipsEl.className = `chips ${mode}`;
  chipsEl.style.setProperty('--n', String(list.length));
  chipsEl.innerHTML = list.map(chipHtml).join('');
  if (mode === 'flow') chipsEl.scrollLeft = 0;
  updateHead();
}

/* ================================================================== *
 * Free-text command parser (German keywords)
 * ================================================================== */

const INTENTS = [
  ['clear', null, /(verlauf|chat)\s*(leeren|löschen|loeschen)|^clear$/],
  ['help', ['hilfe', 'help', 'befehle', 'commands', '?'], /was kannst du|wie funktioniert/],
  ['theme', ['dunkel', 'hell', 'dark', 'light', 'nachtmodus', 'theme', 'design', 'darkmode']],
  ['pomodoro', ['pomodoro', 'timer', 'fokus', 'tomate', 'pause', 'konzentration']],
  ['spick', ['spick*', 'cheat*', 'a4', 'din-a4', 'zettel']],
  ['email', ['email', 'e-mail', 'mail', 'gpas', 'emails', 'mails']],
  ['methods', ['method*', 'lernmethode*', 'backup', 'sicherung', 'export', 'import', 'reset', 'zurücksetzen', 'shortcut*', 'tastatur*', 'tastenkürzel']],
  ['deadlines', ['termin*', 'deadline*', 'frist*', 'abgabe*', 'wann']],
  ['allcards', null, /alle karten|nochmal alle|alles nochmal/],
  ['quiz', ['quiz*', 'test*', 'abfrag*', 'mc', 'multiple'], /prüf mich|frag mich/],
  ['cards', ['karte*', 'karten', 'flash*', 'lern*', 'wiederhol*', 'review', 'üben', 'ueben', 'sr']],
  ['status', ['fällig', 'faellig', 'status', 'heute', 'stand', 'fortschritt', 'statistik', 'due', 'überblick', 'ueberblick', 'mastery']],
  ['chapter', ['kapitel', 'erklär*', 'erklaer*', 'thema', 'themen', 'zusammenfass*', 'lies', 'lesen', 'feynman', 'was']],
  ['courses', ['kurs', 'kurse', 'fächer', 'module', 'modul', 'prüfung', 'klausur*', 'pdf*', 'folien']],
  ['hello', ['hallo', 'hi', 'hey', 'moin', 'servus', 'danke*', 'thx', 'merci', 'guten']],
];
const STOP = new Set(['mir', 'mich', 'bitte', 'das', 'die', 'der', 'den', 'dem', 'ein', 'eine', 'einen', 'kapitel', 'erklär', 'erkläre', 'erklaer', 'erklaere', 'thema', 'über', 'ueber', 'zu', 'zum', 'zur', 'was', 'ist', 'sind', 'wie', 'und', 'oder', 'von', 'mit', 'im', 'in', 'lies', 'lesen', 'zusammenfassung', 'feynman', 'kurs', 'gp1', 'gp2', 'ics', 'eng']);

function tokenize(low) { return low.split(/[^a-z0-9äöüß?%-]+/).filter(Boolean); }
function matchWord(words, list) {
  return words.some(w => list.some(k => (k.endsWith('*') ? w.startsWith(k.slice(0, -1)) : w === k)));
}
function detectCourse(low, words) {
  const compact = low.replace(/[\s.-]+/g, '');
  if (/gd?p1|prog(rammierung)?1|java1/.test(compact)) return 'gdp1';
  if (/gd?p2|prog(rammierung)?2|java2|javafx/.test(compact)) return 'gdp2';
  if (matchWord(words, ['ics', 'internet*', 'web*', 'html', 'css', 'php', 'javascript', 'js'])) return 'ics';
  if (matchWord(words, ['eng', 'englisch', 'english'])) return 'english';
  if (matchWord(words, ['alle', 'gemischt', 'mix', 'interleav*', 'alles'])) return 'all';
  return null;
}
function parse(low) {
  const words = tokenize(low);
  const course = detectCourse(low, words);
  for (const [name, list, re] of INTENTS) {
    if ((list && matchWord(words, list)) || (re && re.test(low))) return { intent: name, course, words };
  }
  return { intent: null, course, words };
}
function searchChapters(words, course) {
  const terms = words.filter(w => w.length >= 3 && !STOP.has(w));
  if (!terms.length) return [];
  const pool = ALL_CHAPTERS.filter(ch => !course || course === 'all' || ch.courseId === course);
  return pool.filter(ch => {
    const hay = `${ch.title} ${ch.id} ${ch.badge || ''}`.toLowerCase();
    return terms.some(t => hay.includes(t));
  });
}

function ratingFromText(low) {
  if (/^[1-4]$/.test(low)) return +low;
  const i = ['nochmal', 'schwer', 'gut', 'einfach'].indexOf(low);
  return i >= 0 ? i + 1 : 0;
}

function handleText(raw) {
  const text = raw.trim();
  if (!text) return;
  const low = text.toLowerCase();
  const s = session;
  choice = null;

  if (feynmanWait) {
    if (/^(abbrechen|stopp?|cancel)$/.test(low)) { echo(text); feynmanWait = null; say('Okay, abgebrochen.'); renderChips(); return; }
    post('me', 'text', { html: esc(text) });
    finishFeynman(text);
    return;
  }

  if (s?.type === 'cards' && s.phase === 'front') {
    if (/^(aufdecken|zeigen|lösung|loesung|weiß nicht|weiss nicht|keine ahnung|\?|antwort)$/.test(low)) { echo(text); reveal(null, false); return; }
    const p = parse(low);
    if (/^(stopp?|beenden|ende|abbrechen)$/.test(low)) { echo(text); endSession(true); return; }
    if (!p.intent || p.words.length > 3) { reveal(text); return; }
  }
  if (s?.type === 'cards' && s.phase === 'back') {
    const r = ratingFromText(low);
    if (r) { rate(r); return; }
  }
  if (s?.type === 'quiz' && s.phase === 'ask') {
    const q = s.queue[s.pos];
    const li = /^[a-f]$/.test(low) ? LETTERS.indexOf(low.toUpperCase()) : /^[1-6]$/.test(low) ? +low - 1 : -1;
    if (li >= 0 && li < q.options.length) { echo(text); selectOption(li); return; }
    if (/^(geraten|unsicher)$/.test(low)) { echo(text); setConfidence('low'); return; }
    if (/^(ziemlich sicher|sicher|eher sicher)$/.test(low)) { echo(text); setConfidence('medium'); return; }
    if (/^(100|100%|100 %|ganz sicher|100% sicher|sehr sicher)$/.test(low)) { echo(text); setConfidence('high'); return; }
    if (/^(prüfen|pruefen|ok|senden|check|fertig|los)$/.test(low)) { echo(text); submitAnswer(); return; }
  }
  if (s?.type === 'quiz' && s.phase === 'feedback' && /^(weiter|next|n|nächste|naechste|ok)$/.test(low)) { echo(text); nextQuestion(); return; }
  if (s && /^(stopp?|beenden|ende|abbrechen)$/.test(low)) { echo(text); endSession(true); return; }

  echo(text);
  runIntent(parse(low), low);
}

function runIntent({ intent, course, words }, low) {
  switch (intent) {
    case 'clear': clearChat(); break;
    case 'help': postHelp(); break;
    case 'theme': {
      const want = /hell|light/.test(low) ? 'light' : /dunkel|dark|nacht/.test(low) ? 'dark' : null;
      if (!want || want !== store.state.theme) store.toggleTheme();
      say(store.state.theme === 'dark' ? '🌙 Dunkles Design aktiv.' : '☀️ Helles Design aktiv.');
      break;
    }
    case 'pomodoro': pomoChat(low); break;
    case 'spick': openSpickChat(); break;
    case 'email': openEmailChat(); break;
    case 'methods':
      navigate('methoden');
      say('Lernmethoden, Backup und Tastenkürzel findest du hier:', { acts: [{ label: 'Methoden & Backup öffnen', act: 'nav', arg: 'methoden', primary: true }] });
      break;
    case 'deadlines': postDeadlines(course && course !== 'all' ? course : null); break;
    case 'allcards': startCards(course || 'all', true); break;
    case 'quiz': course ? startQuiz(course) : askQuizCourse(); break;
    case 'cards': course ? startCards(course) : askCardCourse(); break;
    case 'status': postStatus(course && course !== 'all' ? course : null); break;
    case 'chapter': {
      const hits = searchChapters(words, course);
      if (hits.length === 1) postChapter(hits[0].id);
      else if (hits.length > 1) postChapterMenu(null, hits);
      else postChapterMenu(course && course !== 'all' ? course : null);
      break;
    }
    case 'courses':
      if (course && course !== 'all') postCourse(course);
      else {
        say('Welcher Kurs?', { acts: COURSES_META.map(c => ({ label: `${c.icon} ${c.short}`, act: 'course-chat', arg: c.id, echo: c.short })) });
        choice = COURSES_META.map(c => ({ label: `${c.icon} ${c.short}`, sub: `${getCourseMastery(c.id)} %`, act: 'course-chat', arg: c.id, echo: c.short }));
      }
      break;
    case 'hello':
      say(/dank|thx|merci/.test(low) ? 'Gern! Weiter geht\'s, wann immer du willst. 💪' : `${greetingWord()} Was lernen wir? Unten findest du Vorschläge.`);
      break;
    default: {
      if (course && course !== 'all') { postCourse(course); break; }
      const hits = searchChapters(words, null);
      if (hits.length && hits.length <= 4) {
        say('Das klingt nach einem Kapitel – meinst du eins davon?', { acts: hits.map(ch => ({ label: ch.title, act: 'chapter', arg: ch.id, echo: `Erklär mir ${ch.title}` })) });
        break;
      }
      say('Das hab ich nicht verstanden 🤔 Versuch z. B. <code>karten</code>, <code>quiz gp1</code>, <code>fällig</code>, <code>termine</code>, <code>erklär rekursion</code> oder <code>hilfe</code>.', {
        acts: [{ label: 'Hilfe', act: 'help' }, { label: 'Karten lernen', act: 'cards-menu' }, { label: 'Quiz', act: 'quiz-menu' }],
      });
    }
  }
  renderChips();
}

function openSpickChat() {
  navigate('spick');
  const n = store.state.pinnedCheatSheet.length;
  say(`📄 Dein DIN-A4-Spickzettel hat <b>${plural(n, 'Abschnitt', 'Abschnitte')}</b>. ${n ? 'Drucken kannst du ihn direkt dort.' : 'Hefte Kapitel mit 📌 an oder lade einen ganzen Kurs.'}`, {
    acts: [{ label: 'Spickzettel öffnen', act: 'nav', arg: 'spick', primary: true }],
  });
}
function openEmailChat() {
  navigate('email');
  const p = ENGLISH_DATA.emailPrompts[0];
  say(`✉️ <b>GPAS Email Coach</b> – Ziel: 120–180 Wörter, 6 Checks. Aktuelles Szenario: <i>${esc(p.title)}</i>. Ich bewerte live, während du schreibst.`, {
    acts: [{ label: 'E-Mail-Coach öffnen', act: 'nav', arg: 'email', primary: true }],
  });
}

/* ================================================================== *
 * Routing: side panel (desktop) / full-screen sheets (phone)
 * ================================================================== */

let panelKey = '';
let panelKind = 'context';

function currentRoute() { return decodeURIComponent(location.hash.replace(/^#\/?/, '')); }

function navigate(r) {
  if (r === currentRoute()) { onRoute(); return; }
  if (!r) { closePanel(); return; }
  const url = `${location.pathname}${location.search}#${r}`;
  if (!currentRoute()) history.pushState({ app07: 1 }, '', url);
  else history.replaceState({ app07: 1 }, '', url);
  onRoute();
}

function closePanel() {
  if (!currentRoute()) { onRoute(); return; }
  if (history.state?.app07) history.back();
  else { history.replaceState(null, '', location.pathname + location.search); onRoute(); }
}

function showChat() { if (!mqWide.matches && currentRoute()) closePanel(); }

window.addEventListener('popstate', onRoute);
window.addEventListener('hashchange', onRoute);

function onRoute() {
  const r = currentRoute();
  const [kind, a, b] = r.split('/');
  const map = { kurs: 'course', email: 'email', spick: 'spick', methoden: 'methods' };
  panelKind = map[kind] || 'context';
  const isTool = panelKind !== 'context';
  app.classList.toggle('menu-open', kind === 'menu');
  app.classList.toggle('panel-open', !!kind && kind !== 'menu');
  app.classList.toggle('tool-open', isTool);
  const courseId = COURSE_IDS.includes(a) ? a : COURSE_IDS[0];
  const key = panelKind === 'course' ? `course:${courseId}` : panelKind;
  if (key !== panelKey) {
    panelKey = key;
    renderPanel(courseId);
    panelBody.scrollTop = 0;
  }
  if (panelKind === 'course' && b) {
    const d = document.getElementById('chap-' + b);
    if (d) {
      d.open = true;
      requestAnimationFrame(() => panelBody.scrollTo({
        top: panelBody.scrollTop + d.getBoundingClientRect().top - panelBody.getBoundingClientRect().top - 8,
        behavior: mqReduce.matches ? 'auto' : 'smooth',
      }));
    }
  }
  renderSide();
}

function renderPanel(courseId) {
  const title = $('#panel-title');
  const tools = $('#panel-tools');
  tools.innerHTML = '';
  if (panelKind === 'course') { title.textContent = 'Kursleser'; renderCourse(courseId); }
  else if (panelKind === 'email') { title.textContent = 'E-Mail-Coach'; renderEmail(); }
  else if (panelKind === 'spick') { title.textContent = 'Spickzettel'; renderSpick(); }
  else if (panelKind === 'methods') { title.textContent = 'Methoden & Backup'; renderMethods(); }
  else { title.textContent = 'Heute'; renderContext(); }
  if (panelKind !== 'context') {
    tools.innerHTML = `<button type="button" class="icon-btn" data-act="nav" data-arg="heute" aria-label="Zur Tagesübersicht"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/></svg></button>`;
  }
}

/* ---------- Context: today, deadlines, Pomodoro ---------- */

function ring(pct) {
  const r = 34; const c = 2 * Math.PI * r;
  return `<svg class="ring" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="${r}" class="ring-bg"/><circle cx="40" cy="40" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}"/></svg>`;
}

function renderContext() {
  const tp = todayProgress();
  const due = dueCount('all');
  const hist = activityHistory(7);
  const max = Math.max(1, ...hist.map(h => h.total));
  const cal = calibrationStats();
  const st = cardStats('all');
  panelBody.innerHTML = `
    <section class="card hero">
      <div class="ring-wrap">${ring(tp.pct)}<span class="ring-num">${tp.pct}<small>%</small></span></div>
      <div class="hero-txt">
        <b>${tp.done} von ${tp.goal}</b><span class="muted">Tagesziel · ${tp.reviews} Karten · ${tp.quizzes} Fragen · ${tp.minutes} Min Fokus</span>
        <span class="streak">🔥 Serie: ${esc(streakLabel())} · Ø ${overallMastery()} % gemeistert</span>
      </div>
    </section>
    <button type="button" class="cta" data-act="cards" data-arg="all" data-echo="Karten gemischt">
      <span><b>${due ? `${due} fällige Karten` : 'Nichts fällig'}</b><small>${due ? 'Gemischt lernen (Interleaving)' : 'Freiwillig alle Karten üben'}</small></span><span aria-hidden="true">→</span>
    </button>
    <section class="card">
      <h3>Kurse</h3>
      <div class="rows">${COURSES_META.map(c => {
        const m = getCourseMastery(c.id); const d = dueCount(c.id);
        return `<button type="button" class="row-btn" data-act="nav" data-arg="kurs/${c.id}"><span class="row-ic" style="--c:${c.color}">${esc(c.icon)}</span>
          <span class="row-main"><b>${esc(c.short)} <small class="muted">${esc(c.title)}</small></b>${bar(m, c.color)}</span><span class="row-num">${m} %</span><span class="pill${d ? ' hot' : ''}">${d}</span></button>`;
      }).join('')}</div>
    </section>
    <section class="card pomo">
      <h3>Pomodoro</h3>
      <div class="pomo-time" data-pomo-time>${pomo.display}</div>
      <span class="bar"><i data-pomo-bar style="width:${Math.round(pomo.progress * 100)}%"></i></span>
      <div class="btn-row">
        <button type="button" class="btn primary" data-act="pomo-toggle" data-pomo-toggle>${pomo.running ? 'Pause' : 'Start'}</button>
        <button type="button" class="btn" data-act="pomo-reset">Reset</button>
        <button type="button" class="btn" data-act="pomo-mode" data-pomo-mode>${pomo.mode} Min ↔ ${pomo.mode === 25 ? 50 : 25} Min</button>
      </div>
    </section>
    <section class="card">
      <h3>Termine</h3>
      <ul class="dl">${allDeadlines().slice(0, 6).map(dlItem).join('') || '<li class="muted">Keine anstehenden Termine.</li>'}</ul>
    </section>
    <section class="card">
      <h3>Letzte 7 Tage</h3>
      <div class="spark" role="img" aria-label="Aktivität der letzten 7 Tage">${hist.map(h => `<div class="spark-col" title="${esc(h.label)}: ${h.total}"><span class="spark-n">${h.total || ''}</span><i style="height:${Math.round((h.total / max) * 100)}%"></i><small>${esc(h.weekday)}</small></div>`).join('')}</div>
      <div class="stat-grid">
        <div><b>${st.new}</b><small>neu</small></div><div><b>${st.learning}</b><small>in Arbeit</small></div>
        <div><b>${st.mastered}</b><small>gemeistert</small></div><div><b>${st.due}</b><small>fällig</small></div>
      </div>
    </section>
    <section class="card">
      <h3>Kalibrierung</h3>
      <p class="muted small">Trefferquote je Sicherheitsstufe im Quiz – ideal steigt sie mit der Sicherheit.</p>
      ${CONFIDENCE_LEVELS.map(l => { const c = cal[l.value]; const p = c.n ? Math.round((c.ok / c.n) * 100) : 0; return `<div class="cal"><span>${esc(l.label)}</span>${bar(p)}<span class="row-num">${c.n ? `${p} %` : '–'}</span></div>`; }).join('')}
    </section>
    <section class="card settings">
      <button type="button" class="btn" data-act="theme">${store.state.theme === 'dark' ? '☀️ Helles Design' : '🌙 Dunkles Design'}</button>
      <button type="button" class="btn" data-act="clear-chat">Verlauf leeren</button>
    </section>`;
}

/* ---------- Course reader ---------- */

function renderCourse(id) {
  const c = courseMeta(id);
  const chs = ALL_CHAPTERS.filter(ch => ch.courseId === id);
  const m = getCourseMastery(id);
  const d = dueCount(id);
  panelBody.innerHTML = `
    <nav class="seg" aria-label="Kurs wählen">${COURSES_META.map(x => `<button type="button" class="${x.id === id ? 'on' : ''}" data-act="nav" data-arg="kurs/${x.id}" aria-pressed="${x.id === id}">${esc(x.icon)} ${esc(x.short)}</button>`).join('')}</nav>
    <section class="course-hero" style="--c:${c.color}">
      <span class="course-ic">${esc(c.icon)}</span>
      <div><h3>${esc(c.title)}</h3><p class="muted small">${esc(c.subtitle)}</p><p class="muted small">${esc(c.prof)}</p></div>
    </section>
    <div class="mastery">${bar(m, c.color)}<span>${m} % gemeistert</span></div>
    <div class="btn-row">
      <button type="button" class="btn primary" data-act="cards" data-arg="${id}" data-echo="Karten ${esc(c.short)}">Karten im Chat · ${d} fällig</button>
      <button type="button" class="btn" data-act="quiz" data-arg="${id}" data-echo="Quiz ${esc(c.short)}">Quiz im Chat</button>
    </div>
    <dl class="exam-dl card"><dt>Prüfung</dt><dd>${esc(c.examInfo.type)}</dd><dt>Hilfsmittel</dt><dd>${esc(c.examInfo.aid)}</dd><dt>PVL</dt><dd>${esc(c.examInfo.pvl)}</dd><dt>Zeitraum</dt><dd>${esc(c.examInfo.period)}</dd></dl>
    <h3 class="sec-h">Kapitel</h3>
    ${chs.map(ch => chapterBlock(ch)).join('')}
    <h3 class="sec-h">PDFs & Unterlagen</h3>
    <ul class="pdfs">${c.pdfs.map(p => `<li><a href="${pdfHref(p.path)}" target="_blank" rel="noopener"><span class="pdf-ic" aria-hidden="true">PDF</span><span>${esc(p.title)}</span><span class="pill">${esc(p.tag)}</span></a></li>`).join('')}</ul>`;
}

function chapterBlock(ch) {
  const f = getFeynman(ch.id);
  const pinned = store.isPinned(ch.cheatSheet.id);
  return `<details class="chap" id="chap-${esc(ch.id)}">
    <summary><span class="chap-t">${esc(ch.title)}</span>${ch.badge ? `<span class="exam">${esc(ch.badge)}</span>` : ''}<span class="pin-dot" data-pin-dot="${esc(ch.id)}" ${pinned ? '' : 'hidden'} title="Angeheftet">📌</span></summary>
    <div class="chap-body">
      <ul class="sum">${ch.summary.map(s => `<li>${s}</li>`).join('')}</ul>
      ${ch.diagram && DIAGRAMS[ch.diagram] ? `<div class="dg-frame">${DIAGRAMS[ch.diagram].svg}</div>` : ''}
      <div class="feyn">
        <span class="label">Feynman-Technik</span>
        <p>${esc(ch.feynman.prompt)}</p>
        <label class="sr-only" for="fy-${esc(ch.id)}">Deine Erklärung</label>
        <textarea id="fy-${esc(ch.id)}" data-feyn="${esc(ch.id)}" rows="5" placeholder="Erklär es in eigenen, einfachen Worten …">${esc(f.text)}</textarea>
        <div class="rubric">${ch.feynman.rubric.map((r, i) => `<label class="check"><input type="checkbox" data-fp="${esc(ch.id)}:${i}" ${f.checkedPoints.includes(i) ? 'checked' : ''}><span>${esc(r)}</span></label>`).join('')}</div>
      </div>
      <div class="btn-row">
        <button type="button" class="btn${pinned ? ' on' : ''}" data-act="pin" data-arg="${esc(ch.id)}" data-pin="${esc(ch.id)}" aria-pressed="${pinned}">${pinned ? '📌 Angeheftet' : '📌 Anheften'}</button>
        <button type="button" class="btn" data-act="chapter" data-arg="${esc(ch.id)}" data-echo="Erklär mir ${esc(ch.title)}">Im Chat besprechen</button>
      </div>
    </div>
  </details>`;
}

function togglePin(chId) {
  const ch = chapterById(chId);
  if (!ch) return;
  const pinned = togglePinChapter(ch);
  $$(`[data-pin="${CSS.escape(chId)}"]`).forEach(b => {
    b.setAttribute('aria-pressed', String(pinned));
    b.classList.toggle('on', pinned);
    b.textContent = pinned ? '📌 Angeheftet' : '📌 Anheften';
  });
  $$(`[data-pin-dot="${CSS.escape(chId)}"]`).forEach(d => { d.hidden = !pinned; });
  // keep persisted chapter messages consistent
  msgs.filter(m => m.kind === 'chapter' && m.chapterId === chId).forEach(m => patch(m));
  toast(pinned ? 'Auf den Spickzettel geheftet 📌' : 'Vom Spickzettel entfernt');
}

/* ---------- Email coach ---------- */

let emailScn = ENGLISH_DATA.emailPrompts[0].id;
const drafts = (() => { try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}') || {}; } catch { return {}; } })();

function renderEmail() {
  const p = ENGLISH_DATA.emailPrompts.find(x => x.id === emailScn) || ENGLISH_DATA.emailPrompts[0];
  panelBody.innerHTML = `
    <nav class="seg" aria-label="Szenario wählen">${ENGLISH_DATA.emailPrompts.map((x, i) => `<button type="button" class="${x.id === p.id ? 'on' : ''}" data-act="email-scn" data-arg="${esc(x.id)}" aria-pressed="${x.id === p.id}">Szenario ${i + 1}</button>`).join('')}</nav>
    <section class="card scn" lang="en">
      <h3>${esc(p.title)}</h3>
      <p class="pre">${esc(p.scenario)}</p>
    </section>
    <details class="card gpas"><summary>GPAS-Ablauf (Diagramm)</summary><div class="dg-frame">${DIAGRAMS['gpas-email'].svg}</div></details>
    <label class="label" for="email-text">Deine E-Mail (Englisch)</label>
    <textarea id="email-text" class="email-text" lang="en" rows="12" spellcheck="true" placeholder="Dear Ms Miller,&#10;&#10;Thank you for your email …">${esc(drafts[p.id] || '')}</textarea>
    <div id="email-fb" class="email-fb" aria-live="polite"></div>`;
  updateEmailFeedback();
}

function updateEmailFeedback() {
  const ta = $('#email-text');
  const fb = $('#email-fb');
  if (!ta || !fb) return;
  const p = ENGLISH_DATA.emailPrompts.find(x => x.id === emailScn);
  const a = analyzeEmail(ta.value, p);
  const pos = Math.min(100, Math.round((a.words / 220) * 100));
  const state = a.words === 0 ? '' : a.words < 120 ? 'low' : a.words > 180 ? 'high' : 'ok';
  const msg = a.words === 0 ? 'Noch leer – Ziel 120–180 Wörter.' : state === 'low' ? `Noch ${120 - a.words} Wörter bis zum Zielbereich.` : state === 'high' ? `${a.words - 180} Wörter über dem Ziel – kürzen.` : 'Im Zielbereich 👌';
  fb.innerHTML = `
    <div class="card wc ${state}">
      <div class="wc-top"><b>${a.words} Wörter</b><span class="muted small">${esc(msg)}</span></div>
      <div class="wc-track"><span class="wc-zone" style="left:${(120 / 220) * 100}%;width:${(60 / 220) * 100}%"></span><span class="wc-pos" style="left:${pos}%"></span></div>
      <div class="wc-scale"><span style="left:0">0</span><span style="left:${(120 / 220) * 100}%">120</span><span style="left:${(180 / 220) * 100}%">180</span><span style="right:0">220+</span></div>
    </div>
    <div class="card">
      <h3>Checks <span class="muted">${a.score}/6</span></h3>
      <ul class="checks">${a.checks.map(c => `<li class="${c.ok ? 'ok' : 'no'}"><span aria-hidden="true">${c.ok ? '✓' : '○'}</span>${esc(c.label)}<span class="sr-only">${c.ok ? ' erfüllt' : ' offen'}</span></li>`).join('')}</ul>
    </div>
    <div class="card">
      <h3>Keywords <span class="muted">${a.kwHits}/${a.keywords.length}</span></h3>
      <div class="kws">${a.keywords.map(k => `<span class="kw${k.hit ? ' hit' : ''}">${k.hit ? '✓ ' : ''}${esc(k.word)}</span>`).join('')}</div>
    </div>`;
}

/* ---------- Cheat sheet ---------- */

function pinsHtml(withButtons) {
  return store.state.pinnedCheatSheet.map(p => `<article class="sheet-item">
    <h4>${withButtons ? '' : `[${esc(courseMeta(p.courseId).short)}] `}${esc(p.title)}${withButtons ? ` <button type="button" class="unpin" data-act="unpin" data-arg="${esc(p.id)}" aria-label="${esc(p.title)} entfernen">✕</button>` : ''}</h4>
    <p>${esc(p.content)}</p>${p.code ? `<pre>${esc(p.code)}</pre>` : ''}</article>`).join('');
}

function renderSpick() {
  const pins = store.state.pinnedCheatSheet;
  panelBody.innerHTML = `
    <div class="btn-row wrap">
      <button type="button" class="btn" data-act="load-pins" data-arg="gdp1">+ GP1 laden</button>
      <button type="button" class="btn" data-act="load-pins" data-arg="ics">+ ICS laden</button>
      <button type="button" class="btn" data-act="load-pins" data-arg="all">+ Alle laden</button>
      <button type="button" class="btn danger" data-act="clear-pins" ${pins.length ? '' : 'disabled'}>Leeren</button>
      <button type="button" class="btn primary" data-act="print" ${pins.length ? '' : 'disabled'}>Drucken</button>
    </div>
    <p class="muted small">${plural(pins.length, 'Abschnitt', 'Abschnitte')} · druckt kompakt, weiß, zweispaltig auf DIN A4. GP1 erlaubt 1 Blatt einseitig bedruckt, ICS nur handschriftlich – nutze ihn dort als Vorlage.</p>
    ${pins.length ? `<div class="paper">${pinsHtml(true)}</div>` : `<div class="empty card"><p>Noch nichts angeheftet.</p><p class="muted small">Öffne ein Kapitel und tippe auf 📌 – oder lade oben einen ganzen Kurs.</p><button type="button" class="btn" data-act="nav" data-arg="kurs/gdp1">Kurse durchsehen</button></div>`}`;
}

function fillPrintSheet() {
  $('#print-sheet').innerHTML = `<header><b>Spickzettel WS 26/27</b> · ${esc(new Date().toLocaleDateString('de-DE'))}</header><div class="print-cols">${pinsHtml(false)}</div>`;
}
window.addEventListener('beforeprint', fillPrintSheet);

/* ---------- Methods & backup ---------- */

const METHODS = [
  { t: 'Spaced Repetition', d: 'Wiederholen kurz vor dem Vergessen. Der SM-2-Algorithmus plant jede Karte anhand deiner Bewertung neu – „Nochmal“ kommt in derselben Runde zurück, „Einfach“ erst nach Tagen oder Wochen.', act: 'cards', arg: 'all', b: 'Fällige Karten' },
  { t: 'Active Recall (Abrufübung)', d: 'Erst aus dem Gedächtnis antworten, dann nachsehen. Tipp deine Antwort vor dem Aufdecken in den Chat – das aktive Abrufen stärkt die Erinnerung deutlich mehr als erneutes Lesen.', act: 'cards', arg: 'all', b: 'Ausprobieren' },
  { t: 'Interleaving', d: 'Kurse und Themen mischen statt blockweise lernen. „Gemischt“ verteilt Karten und Fragen so, dass selten zwei aus demselben Thema aufeinanderfolgen – das trainiert, die richtige Strategie zu erkennen.', act: 'quiz', arg: 'all', b: 'Gemischtes Quiz' },
  { t: 'Feynman-Technik', d: 'Erklär ein Thema in einfachen Worten, als würdest du es einem Erstsemester beibringen. Lücken in der Erklärung zeigen Lücken im Verständnis; die Kernpunkte-Checkliste hilft beim Abgleich.', act: 'chapter-menu', arg: '', b: 'Kapitel erklären' },
  { t: 'Kalibrierung & Hyperkorrektur', d: 'Vor jeder Quizantwort angeben, wie sicher du bist. Fehler, bei denen du dir sicher warst, werden besonders gut korrigiert (Hypercorrection Effect) – und du lernst, deinem Gefühl realistisch zu trauen.', act: 'quiz-menu', arg: '', b: 'Quiz starten' },
];

function renderMethods() {
  panelBody.innerHTML = `
    ${METHODS.map((m, i) => `<section class="card method"><span class="method-n">${i + 1}</span><div><h3>${esc(m.t)}</h3><p>${esc(m.d)}</p>
      <button type="button" class="btn small" data-act="${m.act}" data-arg="${esc(m.arg)}" data-echo="${esc(m.b)}">${esc(m.b)} im Chat</button></div></section>`).join('')}
    <section class="card">
      <h3>Backup</h3>
      <p class="muted small">Fortschritt (Karten, Quiz, Feynman, Spickzettel) wird lokal im Browser gespeichert und von allen StudyOS-Versionen geteilt.</p>
      <div class="btn-row wrap">
        <button type="button" class="btn primary" data-act="backup">Backup herunterladen</button>
        <button type="button" class="btn" data-act="import">Backup importieren</button>
        <button type="button" class="btn danger" data-act="reset">Fortschritt zurücksetzen</button>
        <button type="button" class="btn" data-act="clear-chat">Chat-Verlauf leeren</button>
      </div>
    </section>
    <section class="card">
      <h3>Tastenkürzel</h3>
      <dl class="keys">
        <dt><kbd>Leertaste</kbd></dt><dd>Karte aufdecken</dd>
        <dt><kbd>1</kbd>–<kbd>4</kbd></dt><dd>Karte bewerten (Nochmal · Schwer · Gut · Einfach) / Quiz-Antwort wählen</dd>
        <dt><kbd>A</kbd>–<kbd>D</kbd></dt><dd>Quiz-Antwort wählen</dd>
        <dt><kbd>↵</kbd></dt><dd>Quiz-Antwort prüfen (Sicherheit: „Ziemlich sicher“)</dd>
        <dt><kbd>N</kbd></dt><dd>Nächste Frage</dd>
        <dt><kbd>/</kbd></dt><dd>In das Nachrichtenfeld springen</dd>
        <dt><kbd>Esc</kbd></dt><dd>Feld verlassen · Panel schließen</dd>
        <dt><kbd>⇧</kbd> + <kbd>↵</kbd></dt><dd>Zeilenumbruch im Nachrichtenfeld</dd>
      </dl>
      <p class="muted small">Kürzel greifen nicht, solange du in einem Textfeld tippst.</p>
    </section>`;
}

/* ================================================================== *
 * Sidebar (conversations) & header
 * ================================================================== */

function msgPreview(m) {
  if (!m) return 'Schreib mir was …';
  if (m.kind === 'card') return '🃏 Karteikarte';
  if (m.kind === 'back') return 'Antwort aufgedeckt';
  if (m.kind === 'quiz') return '❓ Quizfrage';
  if (m.kind === 'qfb') return m.correct ? '✓ Richtig!' : '✗ Leider falsch';
  if (m.kind === 'chapter') return '📖 ' + (chapterById(m.chapterId)?.title || 'Kapitel');
  if (m.kind === 'rubric') return 'Selbst-Check';
  const div = document.createElement('div');
  div.innerHTML = m.html || '';
  return (m.from === 'me' ? 'Du: ' : '') + div.textContent.replace(/\s+/g, ' ').trim();
}

function renderSide() {
  const r = currentRoute();
  const [kind, a] = r.split('/');
  const due = dueCount('all');
  const last = msgs[msgs.length - 1];
  const pins = store.state.pinnedCheatSheet.length;
  const tp = todayProgress();
  const conv = (o) => `<button type="button" class="conv${o.active ? ' active' : ''}" data-act="nav" data-arg="${esc(o.route)}"${o.active ? ' aria-current="page"' : ''}>
      <span class="avatar" style="--c:${o.color}">${o.icon}</span>
      <span class="conv-main"><span class="conv-top"><b>${esc(o.name)}</b>${o.time ? `<time>${esc(o.time)}</time>` : ''}</span>
      <span class="conv-bot"><span class="conv-prev">${esc(o.prev)}</span>${o.badge ? `<span class="badge${o.muted ? ' muted-b' : ''}">${o.badge}</span>` : ''}</span></span></button>`;
  $('#side').innerHTML = `
    <div class="side-head">
      <div class="brand"><img src="icon.svg" alt="" width="34" height="34"><div><b>StudyOS</b><small>Lern-Chat · WS 26/27</small></div></div>
      <button type="button" class="icon-btn" data-act="theme" aria-label="Hell/Dunkel umschalten"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg></button>
      <button type="button" class="icon-btn only-phone" data-act="close" aria-label="Menü schließen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <nav class="convs" aria-label="Unterhaltungen">
      <div class="conv-sec">Chats</div>
      ${conv({ route: '', name: 'Studi-Bot', icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4c-4.4 0-8 2.8-8 6.3 0 2 1.1 3.7 2.8 4.9-.2 1.3-.8 2.4-1.8 3.3 1.8-.1 3.4-.7 4.7-1.6.7.1 1.5.2 2.3.2 4.4 0 8-2.8 8-6.3S16.4 4 12 4z"/></svg>', color: 'var(--accent)', prev: msgPreview(last), time: last ? hhmm(last.ts) : '', badge: due, active: !kind || kind === 'menu' })}
      <div class="conv-sec">Kurse</div>
      ${COURSES_META.map(c => conv({ route: `kurs/${c.id}`, name: `${c.short} · ${c.title}`, icon: esc(c.icon), color: c.color, prev: `${getCourseMastery(c.id)} % gemeistert · ${ALL_CHAPTERS.filter(ch => ch.courseId === c.id).length} Kapitel`, badge: dueCount(c.id), active: kind === 'kurs' && (a || 'gdp1') === c.id })).join('')}
      <div class="conv-sec">Werkzeuge</div>
      ${conv({ route: 'heute', name: 'Heute & Statistik', icon: '📊', color: '#64748b', prev: `${tp.done}/${tp.goal} heute · 🔥 ${streakLabel()}`, active: kind === 'heute' })}
      ${conv({ route: 'email', name: 'E-Mail-Coach (GPAS)', icon: '✉️', color: '#f59e0b', prev: 'Live-Feedback · 120–180 Wörter', active: kind === 'email' })}
      ${conv({ route: 'spick', name: 'DIN-A4-Spickzettel', icon: '📄', color: '#0ea5e9', prev: pins ? `${plural(pins, 'Abschnitt', 'Abschnitte')} angeheftet` : 'Noch leer', badge: pins, muted: true, active: kind === 'spick' })}
      ${conv({ route: 'methoden', name: 'Methoden & Backup', icon: '🧠', color: '#a855f7', prev: '5 Lernmethoden · Export/Import', active: kind === 'methoden' })}
    </nav>
    <div class="side-foot">
      <span class="muted small">Gesamt ${overallMastery()} % gemeistert</span>
      <button type="button" class="btn small" data-act="clear-chat">Verlauf leeren</button>
    </div>`;
  const mb = $('#menu-badge');
  mb.hidden = !due;
  mb.textContent = due > 99 ? '99+' : String(due);
}

function updateHead() {
  const due = dueCount('all');
  const parts = [];
  if (session?.type === 'cards') parts.push(`Karten · ${Math.min(session.pos + 1, session.queue.length)}/${session.queue.length}`);
  else if (session?.type === 'quiz') parts.push(`Quiz · ${Math.min(session.pos + (session.phase === 'feedback' ? 0 : 1), session.queue.length)}/${session.queue.length}`);
  else parts.push(due ? `${due} Karten fällig` : 'alles erledigt');
  if (pomo.running) parts.push(`Fokus ${pomo.display}`);
  $('#peer-sub').textContent = `online · ${parts.join(' · ')}`;
}

/* ================================================================== *
 * Events
 * ================================================================== */

const CHAT_ACTS = new Set(['cards', 'cards-all', 'cards-menu', 'quiz', 'quiz-menu', 'status', 'deadlines', 'chapter-menu', 'chapter', 'course-chat', 'help', 'feynman', 'pomo-chat', 'email-chat', 'spick-chat']);

const ACTIONS = {
  nav: arg => navigate(arg || ''),
  close: () => closePanel(),
  theme: () => store.toggleTheme(),
  'clear-chat': () => clearChat(),
  'pomo-toggle': () => { pomo.toggle(); renderChips(); },
  'pomo-reset': () => { pomo.reset(); renderChips(); },
  'pomo-mode': () => pomo.switchMode(),
  'pomo-chat': arg => pomoChat(arg || ''),
  'cards-menu': () => askCardCourse(),
  cards: arg => startCards(arg || 'all'),
  'cards-all': arg => startCards(arg || 'all', true),
  'quiz-menu': () => askQuizCourse(),
  quiz: arg => startQuiz(arg || 'all'),
  reveal: () => reveal(),
  rate: arg => rate(Number(arg)),
  'q-select': arg => selectOption(Number(arg)),
  conf: arg => setConfidence(arg),
  submit: () => submitAnswer(),
  next: () => nextQuestion(),
  end: () => endSession(true),
  status: () => postStatus(),
  deadlines: arg => postDeadlines(arg || null),
  'chapter-menu': arg => postChapterMenu(arg || null),
  chapter: arg => postChapter(arg),
  'course-chat': arg => postCourse(arg),
  help: () => postHelp(),
  feynman: arg => startFeynman(arg),
  'feynman-cancel': () => { feynmanWait = null; say('Okay, abgebrochen.'); renderChips(); },
  'email-chat': () => openEmailChat(),
  'spick-chat': () => openSpickChat(),
  pin: arg => togglePin(arg),
  unpin: arg => { const p = store.state.pinnedCheatSheet.find(x => x.id === arg); if (p) { store.togglePin({ id: arg }); toast('Entfernt'); } },
  'load-pins': arg => {
    loadCoursePins(arg === 'all' ? COURSE_IDS : [arg]);
    toast(`${arg === 'all' ? 'Alle Kurse' : courseMeta(arg).short} geladen`);
  },
  'clear-pins': () => { if (confirm('Alle Abschnitte vom Spickzettel entfernen?')) { clearPins(); toast('Spickzettel geleert'); } },
  print: () => { fillPrintSheet(); window.print(); },
  'email-scn': arg => { emailScn = arg; renderEmail(); },
  backup: () => { downloadBackup(); toast('Backup heruntergeladen', 'ok'); },
  import: () => $('#import-file').click(),
  reset: () => {
    if (!confirm('Gesamten Lernfortschritt (alle Versionen) unwiderruflich zurücksetzen?')) return;
    endSession();
    resetProgress();
    toast('Fortschritt zurückgesetzt');
  },
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = ACTIONS[el.dataset.act];
  if (!fn) return;
  e.preventDefault();
  const act = el.dataset.act;
  const sessionAct = ['reveal', 'rate', 'q-select', 'conf', 'submit', 'next', 'end', 'nav', 'close', 'theme', 'pin', 'unpin'].includes(act);
  if (!sessionAct && !act.startsWith('pomo-') && act !== 'feynman-cancel') choice = null;
  if (CHAT_ACTS.has(act) || ['reveal', 'rate', 'end', 'feynman-cancel'].includes(act)) showChat();
  if (el.dataset.echo) echo(el.dataset.echo);
  if (act === 'feynman-cancel' || act === 'end') choice = null;
  fn(el.dataset.arg, el, e);
  if (CHAT_ACTS.has(act) && !session && !choice) renderChips();
});

document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.feyn) saveFeynmanText(t.dataset.feyn, t.value);
  else if (t.id === 'email-text') {
    drafts[emailScn] = t.value;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts)); } catch { /* ignore */ }
    updateEmailFeedback();
  } else if (t === input) autosize();
});

document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.fp) {
    const [chId, idx] = t.dataset.fp.split(':');
    toggleFeynmanPoint(chId, Number(idx), t.checked);
    $$(`input[data-fp="${CSS.escape(t.dataset.fp)}"]`).forEach(x => { x.checked = t.checked; });
  } else if (t.id === 'import-file') {
    const f = t.files?.[0];
    t.value = '';
    if (!f) return;
    importBackup(f).then(() => { endSession(); toast('Backup importiert', 'ok'); renderPanel(currentRoute().split('/')[1]); })
      .catch(() => toast('Import fehlgeschlagen – keine gültige Backup-Datei', 'err'));
  }
});

/* ---------- Composer ---------- */

function autosize() {
  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
}
$('#composer').addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value;
  if (!text.trim()) return;
  input.value = '';
  autosize();
  handleText(text);
  if (mqCoarse.matches && session) input.blur(); // give the chips the space back for tap-driven sessions
});
input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault();
    $('#composer').requestSubmit();
  }
});

/* ---------- Keyboard shortcuts ---------- */

document.addEventListener('keydown', e => {
  const t = e.target;
  const typing = t.closest?.('input, textarea, select, [contenteditable="true"]');
  if (e.key === 'Escape') {
    if (typing) { t.blur(); return; }
    if (currentRoute()) { closePanel(); return; }
    return;
  }
  if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
  const onButton = t.closest?.('button, a, summary');
  const s = session;
  if (e.key === '/') { e.preventDefault(); input.focus(); return; }
  if (s?.type === 'cards') {
    if (s.phase === 'front' && (e.key === ' ' || (e.key === 'Enter' && !onButton))) { e.preventDefault(); choice = null; reveal(); return; }
    if (s.phase === 'back' && /^[1-4]$/.test(e.key)) { e.preventDefault(); rate(+e.key); return; }
  }
  if (s?.type === 'quiz') {
    if (s.phase === 'ask') {
      const k = e.key.toLowerCase();
      const i = /^[1-6]$/.test(k) ? +k - 1 : /^[a-f]$/.test(k) ? LETTERS.indexOf(k.toUpperCase()) : -1;
      if (i >= 0) { e.preventDefault(); selectOption(i); return; }
      if (e.key === 'Enter' && !onButton) { e.preventDefault(); submitAnswer(); return; }
    } else if (s.phase === 'feedback' && (e.key.toLowerCase() === 'n' || (e.key === 'Enter' && !onButton))) {
      e.preventDefault(); nextQuestion(); return;
    }
  }
});

/* ---------- Viewport (iOS keyboard) & layout measurements ---------- */

function fitViewport() {
  const vv = window.visualViewport;
  if (!vv || !mqCoarse.matches) {
    app.style.removeProperty('--app-h');
    app.style.removeProperty('--app-top');
    app.classList.remove('kb-open');
    return;
  }
  const stick = atBottom;
  app.style.setProperty('--app-h', `${vv.height}px`);
  app.style.setProperty('--app-top', `${vv.offsetTop}px`);
  app.classList.toggle('kb-open', window.innerHeight - vv.height > 120);
  if (stick) scrollBottom(true);
}
window.visualViewport?.addEventListener('resize', fitViewport);
window.visualViewport?.addEventListener('scroll', fitViewport);
window.addEventListener('resize', fitViewport);
mqCoarse.addEventListener?.('change', fitViewport);
// iOS may scroll the (fixed) document when focusing the composer – pin it back.
window.addEventListener('scroll', () => { if (window.scrollY && !matchMedia('print').matches) window.scrollTo(0, 0); });

new ResizeObserver(() => {
  app.style.setProperty('--dock-h', `${$('#dock').offsetHeight}px`);
}).observe($('#dock'));

/* ================================================================== *
 * Boot
 * ================================================================== */

store.subscribe(() => {
  applyTheme();
  renderSide();
  updateHead();
  if (panelKind === 'context' && !$('#panel-body .card.hero')?.contains(document.activeElement)) renderContext();
  if (panelKind === 'spick') renderSpick();
  if (panelKind === 'context' || panelKind === 'spick') updatePomo();
  if (!session) renderChips();
});

applyTheme();
renderThread();
// Interrupted sessions from a previous visit: re-render so stale controls disappear.
welcome();
onRoute();
renderChips();
updatePomo();
fitViewport();
autosize();
scrollBottom(true);

if ('serviceWorker' in navigator) navigator.serviceWorker.register('../sw.js', { scope: '../' }).catch(() => {});
