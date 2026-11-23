// StudyOS · Stories — bite-size learning in story format on top of the shared domain layer.
// Phone: full-screen story player + rings + feed + tab bar. Desktop: nav | story frame | details rail.
import {
  COURSES_META, ENGLISH_DATA, DIAGRAMS, store, ALL_DATA, ALL_FLASHCARDS, ALL_QUIZZES, ALL_CHAPTERS,
  courseMeta, escapeHtml as esc, pdfHref, getDueCards, buildFlashcardQueue, rateCard, intervalsFor,
  RATING_LABELS, cardStats, buildQuizQueue, CONFIDENCE_LEVELS, submitQuiz, calibrationStats,
  getCourseMastery, overallMastery, todayProgress, activityHistory, streakLabel, allDeadlines,
  formatDate, daysLeftLabel, getFeynman, saveFeynmanText, toggleFeynmanPoint, togglePinChapter,
  loadCoursePins, clearPins, analyzeEmail, downloadBackup, importBackup, resetProgress, Pomodoro,
} from '../shared/core.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const viewEl = $('#view');
const stageEl = $('#stage');
const CHAPTERS = new Map(ALL_CHAPTERS.map(c => [c.id, c]));
const DESK = matchMedia('(min-width: 1024px)');
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)');
const STORE_KEY = 'ws26_lernplattform_v1';

/* ---------- own persistence (variant-specific, separate keys) ---------- */

const VIEW_KEY = 'stories.viewed';
const PREF_KEY = 'stories.prefs';
const DRAFT_KEY = 'stories.emailDrafts';

function loadJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return v && typeof v === 'object' ? v : fallback; } catch { return fallback; }
}
function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* quota / private mode */ }
}
let viewed = loadJSON(VIEW_KEY, {});          // chapterId -> [seen slide indices]
const prefs = { autoplay: true, ...loadJSON(PREF_KEY, {}) };
let drafts = loadJSON(DRAFT_KEY, {});         // promptId -> text

// No stored progress yet: follow the OS appearance (without persisting it).
if (!localStorage.getItem(STORE_KEY)) {
  store.state.theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/* ---------- helpers ---------- */

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const isTyping = (el = document.activeElement) => !!el && (el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || (el.tagName === 'INPUT' && !['checkbox', 'radio', 'button', 'file'].includes(el.type)) || el.isContentEditable);
const chapterNo = (ch) => (ch.title.match(/^(\d+)\./) || [])[1] || '•';
const chapterName = (ch) => ch.title.replace(/^\d+\.\s*/, '');
const courseShort = (id) => courseMeta(id).short;
let uidSeq = 0;

/** Diagram SVG with ids made unique per instance (several diagrams can be in the DOM at once). */
function diagramSvg(key) {
  const d = DIAGRAMS[key];
  if (!d) return '';
  const u = `s${++uidSeq}`;
  return d.svg.replace(/id="([^"]+)"/g, (m, id) => `id="${id}-${u}"`).replace(/url\(#([^)]+)\)/g, (m, id) => `url(#${id}-${u})`);
}

function icon(name) {
  const p = {
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    play: '<path d="M7 4.5v15l12.5-7.5z" fill="currentColor" stroke="none"/>',
    pin: '<path d="M9 3h6l-1 6 4 3v2H6v-2l4-3z"/><path d="M12 14v7"/>',
    left: '<path d="M15 5l-7 7 7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    pdf: '<path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M14 3v5h5"/>',
    print: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    flame: '<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.3 1.7 1.2 2.7 2.2 3C11 9 11 6 12 3z"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9.5 2.5h5"/>',
    cards: '<rect x="3" y="7" width="13" height="14" rx="3"/><path d="M8 3h10a3 3 0 0 1 3 3v11"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.2a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .9-1 1.6v.4"/><path d="M12 16.8v.2"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" fill="currentColor" stroke="none"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
    sheet: '<path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    bulb: '<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.1V16h5v-.1c0-.8.4-1.6 1.1-2.1A6 6 0 0 0 12 3z"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    upload: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
    reset: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/>',
    swap: '<path d="M7 7h11l-3-3M17 17H6l3 3"/>',
  }[name] || '';
  return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
}

function toast(msg, kind = '') {
  const host = $('#toasts');
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.textContent = msg;
  host.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, 2800);
}

/* ---------- story progress (viewed slides) ---------- */

function storySlides(ch) {
  const s = ch.summary.map((html, i) => ({ type: 'sum', html, i, n: ch.summary.length }));
  if (ch.diagram && DIAGRAMS[ch.diagram]) s.push({ type: 'dia' });
  s.push({ type: 'fey' });
  s.push({ type: 'test' });
  return s;
}
function storyStatus(ch) {
  const n = storySlides(ch).length;
  const seen = (viewed[ch.id] || []).filter(i => i < n).length;
  return { n, seen, state: seen === 0 ? 'new' : seen >= n ? 'done' : 'partial' };
}
function markSeen(chId, idx) {
  const arr = viewed[chId] || (viewed[chId] = []);
  if (!arr.includes(idx)) { arr.push(idx); saveJSON(VIEW_KEY, viewed); }
}
function nextUnseenChapter() {
  return ALL_CHAPTERS.find(c => storyStatus(c).state === 'partial') || ALL_CHAPTERS.find(c => storyStatus(c).state === 'new') || ALL_CHAPTERS[0];
}
function courseStoryState(courseId) {
  const chs = ALL_CHAPTERS.filter(c => c.courseId === courseId);
  const st = chs.map(storyStatus);
  const done = st.filter(s => s.state === 'done').length;
  return { total: chs.length, done, state: done === chs.length ? 'done' : st.some(s => s.state !== 'new') ? 'partial' : 'new' };
}

/** Ring avatar markup; `state` decides colour (gradient) vs. grey. */
function ringHtml({ courseId, state, inner, size = '', label = '' }) {
  return `<span class="ring ${size} is-${state}" data-course="${courseId}"${label ? ` aria-label="${esc(label)}"` : ''}><span class="ring-in">${inner}</span></span>`;
}

/* ---------- card / quiz helpers ---------- */

function chapterCards(chId) { return ALL_FLASHCARDS.filter(c => c.chapterId === chId); }
function chapterQuizzes(chId) { return ALL_QUIZZES.filter(q => q.chapterId === chId); }

/* ---------- UI session state (progress itself lives in the shared store) ---------- */

const S = {
  route: 'home',
  routeArg: null,
  fc: { course: 'all', chapter: null, includeAll: false, queue: null, revealed: false, done: 0, startLen: 0 },
  quiz: { course: 'all', chapter: null, queue: null, idx: 0, selected: null, confidence: 'medium', result: null, correct: 0, answered: 0 },
  email: { idx: 0 },
  ringOrder: [],
};

/* =====================================================================
   Pomodoro
   ===================================================================== */

const pomo = new Pomodoro({
  onChange: () => updatePomo(),
  onFinish: (min) => {
    toast(`Fokus-Session beendet – ${min} Minuten verbucht. Kurze Pause!`, 'good');
    if (S.route === 'home') renderView();
  },
});

function updatePomo() {
  const pct = Math.round(pomo.progress * 100);
  $$('[data-pomo="time"]').forEach(el => { el.textContent = pomo.display; });
  $$('[data-pomo="ring"], [data-pomo="bar"]').forEach(el => el.style.setProperty('--p', pct));
  $$('[data-pomo="state"]').forEach(el => { el.textContent = pomo.running ? `Fokus läuft · ${pomo.mode} Min` : pomo.seconds < pomo.mode * 60 ? 'Pausiert' : `Fokus · ${pomo.mode} Min`; });
  $$('[data-pomo="toggle"]').forEach(el => { el.textContent = pomo.running ? 'Pausieren' : (pomo.seconds < pomo.mode * 60 ? 'Fortsetzen' : 'Starten'); });
  $$('[data-pomo="modeShort"]').forEach(el => { el.textContent = String(pomo.mode); });
  $$('[data-pomo="modeBtn"]').forEach(el => { el.textContent = `Auf ${pomo.mode === 25 ? 50 : 25} Min wechseln`; });
  document.body.classList.toggle('pomo-running', pomo.running);
}

function pomoPanel() {
  return `
    <div class="pomo-panel">
      <div class="pomo-big" data-pomo="ring" style="--p:${Math.round(pomo.progress * 100)}">
        <div><b data-pomo="time">${pomo.display}</b><small data-pomo="state"></small></div>
      </div>
      <div class="btn-row">
        <button class="btn primary grow" type="button" data-act="pomo-toggle" data-pomo="toggle">Starten</button>
        <button class="btn" type="button" data-act="pomo-reset">${icon('reset')}<span>Reset</span></button>
      </div>
      <button class="btn ghost full" type="button" data-act="pomo-mode" data-pomo="modeBtn">Auf 50 Min wechseln</button>
    </div>`;
}

/* =====================================================================
   Theme
   ===================================================================== */

function applyTheme() {
  const theme = store.state.theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  syncThemeColor();
  $$('.theme-label').forEach(el => { el.textContent = theme === 'dark' ? 'Dunkel' : 'Hell'; });
}
function syncThemeColor() {
  const storyFull = P.open && !DESK.matches;
  const c = storyFull ? '#000000' : (document.documentElement.dataset.theme === 'light' ? '#f5f4fa' : '#0a0a10');
  $$('meta[name="theme-color"]').forEach(m => m.setAttribute('content', c));
}

/* =====================================================================
   Story player
   ===================================================================== */

const P = {
  open: false, list: [], ci: 0, si: 0, slides: [], paused: false, hold: false,
  dur: Infinity, pushed: false,
};

const curChapter = () => CHAPTERS.get(P.list[P.ci]);

function slideDuration(sl) {
  if (!prefs.autoplay) return Infinity;
  if (sl.type === 'sum') {
    const len = sl.html.replace(/<[^>]+>/g, '').length;
    return Math.min(20000, Math.max(6500, 4000 + len * 42));
  }
  if (sl.type === 'dia') return 14000;
  return Infinity; // interactive slides wait for the learner
}

/** Opens a playlist of chapter ids at index `ci`. */
function openStory(list, ci = 0, si = 0) {
  if (!list.length) return;
  P.list = list; P.ci = ci; P.si = si; P.paused = false; P.hold = false;
  if (DESK.matches && S.route !== 'home') {
    P.open = true;
    stageEl.innerHTML = ''; // force a fresh mount when the home route renders
    location.hash = '#/';
    return; // hashchange mounts the stage
  }
  P.open = true;
  if (!DESK.matches && !P.pushed) {
    history.pushState({ story: true }, '', location.href);
    P.pushed = true;
  }
  mountStory();
}

function mountStory() {
  const ch = curChapter();
  P.slides = storySlides(ch);
  P.si = Math.min(P.si, P.slides.length - 1);
  stageEl.classList.add('is-open');
  document.documentElement.classList.add('story-open');
  syncThemeColor();
  renderPlayerShell();
  showSlide(P.si, 0);
}

function closeStory({ fromPop = false } = {}) {
  if (!P.open) return;
  P.open = false;
  document.documentElement.classList.remove('story-open');
  stageEl.classList.remove('is-open');
  if (P.pushed) {
    P.pushed = false;
    if (!fromPop) history.back();
  }
  syncThemeColor();
  renderStage();
  refreshRings();
}

function renderStage() {
  if (P.open) { mountStory(); return; }
  if (!DESK.matches) { stageEl.innerHTML = ''; return; }
  // Desktop cover: the next story ready to play.
  const ch = nextUnseenChapter();
  const st = storyStatus(ch);
  const cm = courseMeta(ch.courseId);
  const idx = ALL_CHAPTERS.indexOf(ch);
  const after = ALL_CHAPTERS.slice(idx + 1).concat(ALL_CHAPTERS.slice(0, idx)).filter(c => storyStatus(c).state !== 'done').slice(0, 3);
  stageEl.innerHTML = `
    <div class="st-frame st-cover" data-course="${ch.courseId}">
      <div class="cover-glow" aria-hidden="true"></div>
      <div class="cover-top">
        <span class="cover-chip">${st.state === 'partial' ? 'Weiterschauen' : st.state === 'done' ? 'Wiederholen' : 'Neue Story'}</span>
        <span class="cover-meta">${esc(cm.icon)} ${esc(cm.short)} · ${plural(st.n, 'Slide', 'Slides')}</span>
      </div>
      <div class="cover-main">
        <span class="cover-no">${esc(chapterNo(ch))}</span>
        <h2>${esc(chapterName(ch))}</h2>
        ${ch.badge ? `<span class="cover-badge">${esc(ch.badge)}</span>` : ''}
        <div class="cover-progress" aria-label="${st.seen} von ${st.n} Slides gesehen">${Array.from({ length: st.n }, (_, i) => `<i class="${(viewed[ch.id] || []).includes(i) ? 'on' : ''}"></i>`).join('')}</div>
      </div>
      <button class="cover-play" type="button" data-act="story-open" data-ch="${ch.id}">
        ${icon('play')}<span>Story abspielen</span><kbd>↵</kbd>
      </button>
      ${after.length ? `<div class="cover-next"><p>Danach</p>${after.map(c => `
        <button type="button" class="cover-next-item" data-act="story-open" data-ch="${c.id}">
          ${ringHtml({ courseId: c.courseId, state: storyStatus(c).state, inner: esc(chapterNo(c)), size: 'xs' })}
          <span>${esc(chapterName(c))}</span>
        </button>`).join('')}</div>` : ''}
    </div>`;
}

// Slide type scales with the frame width (phone full-screen vs. desktop frame).
const frameRO = new ResizeObserver((entries) => {
  for (const en of entries) en.target.style.setProperty('--fw', `${Math.round(en.contentRect.width)}px`);
});

function renderPlayerShell() {
  const ch = curChapter();
  const cm = courseMeta(ch.courseId);
  const pinned = store.isPinned(ch.cheatSheet.id);
  const prevCh = P.ci > 0 ? CHAPTERS.get(P.list[P.ci - 1]) : null;
  const nextCh = P.ci < P.list.length - 1 ? CHAPTERS.get(P.list[P.ci + 1]) : null;
  stageEl.innerHTML = `
    <button class="stage-side prev" type="button" data-act="story-prev-ch" ${prevCh ? '' : 'disabled'} aria-label="Vorherige Story">
      ${icon('left')}${prevCh ? `<span>${esc(chapterName(prevCh))}</span>` : ''}
    </button>
    <div class="st-frame st-player ${REDUCED.matches ? '' : 'anim-in'}" id="st-frame" data-course="${ch.courseId}" role="region" aria-roledescription="Story" aria-label="${esc(ch.title)}">
      <div class="st-top">
        <div class="st-segs" id="st-segs">${P.slides.map(() => '<span class="seg"><i></i></span>').join('')}</div>
        <div class="st-head">
          ${ringHtml({ courseId: ch.courseId, state: 'new', inner: esc(cm.icon), size: 'xs' })}
          <div class="st-title"><b>${esc(chapterName(ch))}</b><small><span>${esc(cm.short)}</span> · <span id="st-count"></span></small></div>
          <button class="st-btn" type="button" data-act="story-pause" id="st-pause" aria-label="Pausieren">${icon('pause')}</button>
          <button class="st-btn" type="button" data-act="story-close" aria-label="Story schließen (Esc)">${icon('close')}</button>
        </div>
      </div>
      <div class="st-body" id="st-body" aria-live="polite"></div>
      <div class="st-foot">
        <button class="st-chip ${pinned ? 'on' : ''}" type="button" data-act="story-pin" id="st-pin" aria-pressed="${pinned}" title="Auf den Spickzettel pinnen">${icon('pin')}<span>${pinned ? 'Gepinnt' : 'Pinnen'}</span></button>
        <button class="st-chip" type="button" data-act="story-auto" id="st-auto" aria-pressed="${prefs.autoplay}" title="Automatisch weiterschalten">${prefs.autoplay ? 'Auto: an' : 'Auto: aus'}</button>
        <button class="st-chip accent" type="button" data-act="story-test" id="st-testjump">Teste dich ›</button>
      </div>
      <div class="st-hold-hint" aria-hidden="true">${icon('pause')}<span>Pausiert</span></div>
      <span class="st-edge prev" aria-hidden="true">${icon('left')}</span>
      <span class="st-edge next" aria-hidden="true">${icon('right')}</span>
    </div>
    <button class="stage-side next" type="button" data-act="story-next-ch" ${nextCh ? '' : 'disabled'} aria-label="Nächste Story">
      ${nextCh ? `<span>${esc(chapterName(nextCh))}</span>` : ''}${icon('right')}
    </button>`;
  const frame = $('#st-frame');
  bindGestures(frame);
  frame.style.setProperty('--fw', `${frame.clientWidth || 390}px`);
  frameRO.disconnect();
  frameRO.observe(frame);
  $('#st-segs').addEventListener('animationend', (e) => {
    if (P.open && e.target.parentElement === $$('#st-segs .seg')[P.si]) storyNext();
  });
}

function slideHtml(ch, sl, idx) {
  const cm = courseMeta(ch.courseId);
  if (sl.type === 'sum') {
    const len = sl.html.replace(/<[^>]+>/g, '').length;
    const size = len < 170 ? 'len-s' : len < 300 ? 'len-m' : len < 420 ? 'len-l' : 'len-xl';
    return `
      <div class="slide slide-sum v${idx % 3}">
        ${sl.i === 0 ? `<div class="sl-intro"><span class="sl-no">${esc(chapterNo(ch))}</span><h2>${esc(chapterName(ch))}</h2>${ch.badge ? `<span class="sl-badge">${esc(ch.badge)}</span>` : ''}</div>` : ''}
        <p class="sl-kicker">Kernpunkt ${sl.i + 1} / ${sl.n}</p>
        <div class="sl-text ${size}">${sl.html}</div>
      </div>`;
  }
  if (sl.type === 'dia') {
    const d = DIAGRAMS[ch.diagram];
    return `
      <div class="slide slide-dia">
        <p class="sl-kicker">Dual Coding · Bild + Wort</p>
        <h3>${esc(d.title)}</h3>
        <div class="dia-scroll" data-notap tabindex="0" aria-label="Diagramm, horizontal scrollbar"><div class="dia-inner">${diagramSvg(ch.diagram)}</div></div>
        <p class="sl-hint" id="dia-hint">↔ Diagramm seitlich wischen</p>
      </div>`;
  }
  if (sl.type === 'fey') {
    const f = getFeynman(ch.id);
    return `
      <div class="slide slide-fey">
        <p class="sl-kicker">Feynman-Technik · ${esc(cm.short)}</p>
        <p class="fey-prompt">${esc(ch.feynman.prompt)}</p>
        <label class="sr-only" for="st-fey">Deine Erklärung</label>
        <textarea id="st-fey" class="fey-text" data-fey="${ch.id}" rows="5" placeholder="Erklär es in eigenen Worten – so, als würdest du es einem Erstsemester beibringen …">${esc(f.text)}</textarea>
        <p class="fey-sub">Checkliste · <span data-fey-count="${ch.id}">${f.checkedPoints.length}/${ch.feynman.rubric.length}</span> abgedeckt</p>
        ${rubricHtml(ch)}
      </div>`;
  }
  // test slide
  const cards = chapterCards(ch.id);
  const due = buildFlashcardQueue(ch.courseId, false).filter(c => c.chapterId === ch.id).length;
  const qs = chapterQuizzes(ch.id);
  const pinned = store.isPinned(ch.cheatSheet.id);
  const nextCh = P.ci < P.list.length - 1 ? CHAPTERS.get(P.list[P.ci + 1]) : null;
  return `
    <div class="slide slide-test">
      <p class="sl-kicker">Teste dich</p>
      <h2>Was ist hängen geblieben?</h2>
      <p class="sl-lead">Abrufen schlägt Wiederlesen: Hol das Kapitel jetzt aktiv aus dem Gedächtnis.</p>
      <div class="test-actions">
        <button class="test-btn" type="button" data-act="story-cards" ${cards.length ? '' : 'disabled'}>
          <span class="tb-ico">${icon('cards')}</span><span class="tb-txt"><b>Karteikarten</b><small>${cards.length ? `${due} fällig · ${cards.length} gesamt` : 'keine Karten'}</small></span><span class="tb-go">›</span>
        </button>
        <button class="test-btn" type="button" data-act="story-quiz" ${qs.length ? '' : 'disabled'}>
          <span class="tb-ico">${icon('quiz')}</span><span class="tb-txt"><b>Quiz</b><small>${qs.length ? plural(qs.length, 'Frage', 'Fragen') : 'keine Fragen zu diesem Kapitel'}</small></span><span class="tb-go">›</span>
        </button>
        <button class="test-btn ${pinned ? 'on' : ''}" type="button" data-act="story-pin">
          <span class="tb-ico">${icon('pin')}</span><span class="tb-txt"><b>${pinned ? 'Auf dem Spickzettel' : 'Auf den Spickzettel'}</b><small>${esc(ch.cheatSheet.title)}</small></span><span class="tb-go">${pinned ? '✓' : '+'}</span>
        </button>
      </div>
      <button class="next-story" type="button" data-act="story-next-ch">${nextCh ? `Nächste Story: ${esc(chapterName(nextCh))} ›` : 'Fertig – Story schließen'}</button>
    </div>`;
}

function rubricHtml(ch) {
  const f = getFeynman(ch.id);
  return `<ul class="rubric">${ch.feynman.rubric.map((pt, i) => `
    <li><label class="check"><input type="checkbox" data-fey-pt="${ch.id}" data-idx="${i}" ${f.checkedPoints.includes(i) ? 'checked' : ''}><span class="box" aria-hidden="true">${icon('check')}</span><span>${esc(pt)}</span></label></li>`).join('')}</ul>`;
}

function showSlide(si, dir = 1) {
  const ch = curChapter();
  P.si = si;
  P.dur = slideDuration(P.slides[si]);
  markSeen(ch.id, si);
  const body = $('#st-body');
  if (!body) return;
  body.innerHTML = slideHtml(ch, P.slides[si], si);
  const sl = body.firstElementChild;
  if (!REDUCED.matches && dir) sl.classList.add(dir > 0 ? 'in-next' : 'in-prev');
  $('#st-count').textContent = `${si + 1}/${P.slides.length}`;
  const frame = $('#st-frame');
  frame.dataset.slide = P.slides[si].type;
  $('#st-testjump').hidden = P.slides[si].type === 'test';
  updateSegs();
  updatePauseBtn();
  const sc = $('.dia-scroll', body);
  if (sc) requestAnimationFrame(() => { const h = $('#dia-hint'); if (h) h.hidden = sc.scrollWidth <= sc.clientWidth + 2; });
  updateNowTile();
  if (DESK.matches) renderSideStories();
}

/* Progress of the current slide is a CSS animation (compositor-driven, pausable via classes);
   its animationend advances the story. */
function updateSegs() {
  const segs = $$('#st-segs .seg');
  const finite = P.dur !== Infinity;
  segs.forEach((el, i) => {
    el.classList.remove('run');
    el.classList.toggle('full', i < P.si || (i === P.si && !finite));
  });
  const cur = segs[P.si];
  if (cur && finite) {
    cur.style.setProperty('--dur', `${P.dur}ms`);
    void cur.offsetWidth; // restart the animation
    cur.classList.add('run');
  }
}

function updatePauseBtn() {
  const b = $('#st-pause');
  if (!b) return;
  b.innerHTML = P.paused ? icon('play') : icon('pause');
  b.setAttribute('aria-label', P.paused ? 'Fortsetzen (Leertaste)' : 'Pausieren (Leertaste)');
  $('#st-frame')?.classList.toggle('is-paused', P.paused);
}

function storyNext() {
  if (P.si < P.slides.length - 1) showSlide(P.si + 1, 1);
  else storyNextChapter();
}
function storyPrev() {
  if (P.si > 0) showSlide(P.si - 1, -1);
  else if (P.ci > 0) { P.ci -= 1; P.si = 0; mountStory(); refreshRings(); }
  else showSlide(0, 0);
}
function storyNextChapter() {
  if (P.ci < P.list.length - 1) { P.ci += 1; P.si = 0; mountStory(); refreshRings(); }
  else { closeStory(); toast('Alle Stories dieser Reihe gesehen 🎉', 'good'); }
}
function storyPrevChapter() {
  if (P.ci > 0) { P.ci -= 1; P.si = 0; mountStory(); refreshRings(); }
}

/* Tap left/right, long-press pause, swipe down to close, swipe sideways to switch story. */
function bindGestures(frame) {
  let g = null;
  const interactive = (t) => t.closest('button, a, textarea, input, label, select, [data-notap]');
  frame.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || interactive(e.target)) return;
    g = { x: e.clientX, y: e.clientY, t: performance.now(), moved: false, id: e.pointerId, touch: e.pointerType !== 'mouse', dy: 0, dx: 0 };
    g.timer = setTimeout(() => { if (g && !g.moved) { P.hold = true; frame.classList.add('holding'); } }, 260);
  });
  frame.addEventListener('pointermove', (e) => {
    if (!g || e.pointerId !== g.id) return;
    g.dx = e.clientX - g.x; g.dy = e.clientY - g.y;
    if (Math.abs(g.dx) > 10 || Math.abs(g.dy) > 10) g.moved = true;
    if (g.moved && g.touch && !DESK.matches && g.dy > 0 && g.dy > Math.abs(g.dx)) {
      frame.style.transform = `translateY(${g.dy}px) scale(${Math.max(0.86, 1 - g.dy / 1600)})`;
      frame.style.borderRadius = '22px';
      P.hold = true; frame.classList.add('dragging');
    }
  });
  const end = (e, cancelled) => {
    if (!g || e.pointerId !== g.id) return;
    clearTimeout(g.timer);
    const wasHold = P.hold && !g.moved;
    const { dx, dy, moved } = g;
    const fast = performance.now() - g.t < 260;
    g = null;
    frame.classList.remove('holding', 'dragging');
    frame.style.transform = ''; frame.style.borderRadius = '';
    P.hold = false;
    if (cancelled) return;
    if (moved) {
      if (dy > 110 && dy > Math.abs(dx) && !DESK.matches) { closeStory(); return; }
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? storyNextChapter() : storyPrevChapter(); }
      return;
    }
    if (wasHold && !fast) return; // long-press released: just resume
    const r = frame.getBoundingClientRect();
    if (e.clientX - r.left < r.width * 0.3) storyPrev(); else storyNext();
  };
  frame.addEventListener('pointerup', (e) => end(e, false));
  frame.addEventListener('pointercancel', (e) => end(e, true));
  frame.addEventListener('contextmenu', (e) => { if (!interactive(e.target)) e.preventDefault(); });
}

/* Desktop rail tile: what's playing right now, with jump list. */
function updateNowTile() {
  const host = $('#now-tile');
  if (!host) return;
  if (!P.open) { host.hidden = true; return; }
  const ch = curChapter();
  const labels = P.slides.map((s, i) => s.type === 'sum' ? `Kernpunkt ${s.i + 1}` : s.type === 'dia' ? 'Diagramm' : s.type === 'fey' ? 'Feynman' : 'Teste dich');
  const cards = chapterCards(ch.id).length;
  const fey = getFeynman(ch.id);
  host.hidden = false;
  host.dataset.course = ch.courseId;
  host.innerHTML = `
    <p class="tile-kicker">Läuft gerade · ${esc(courseShort(ch.courseId))}</p>
    <h3>${esc(ch.title)}</h3>
    <ol class="now-list">${labels.map((l, i) => `<li><button type="button" data-act="story-jump" data-si="${i}" class="${i === P.si ? 'cur' : ''} ${(viewed[ch.id] || []).includes(i) ? 'seen' : ''}"><span>${i + 1}</span>${l}</button></li>`).join('')}</ol>
    <p class="now-meta">${plural(cards, 'Karte', 'Karten')} · Feynman ${fey.checkedPoints.length}/${ch.feynman.rubric.length} · ${store.isPinned(ch.cheatSheet.id) ? 'gepinnt' : 'nicht gepinnt'}</p>`;
}

/* =====================================================================
   Rings (home row + desktop side list)
   ===================================================================== */

function chapterRingOrder() {
  // Unfinished stories first (in course order), finished ones at the end — like story apps.
  const open = ALL_CHAPTERS.filter(c => storyStatus(c).state !== 'done');
  const done = ALL_CHAPTERS.filter(c => storyStatus(c).state === 'done');
  return open.concat(done);
}

function homeRingsHtml() {
  const order = chapterRingOrder();
  S.ringOrder = order.map(c => c.id);
  const fresh = ALL_CHAPTERS.filter(c => storyStatus(c).state !== 'done').length;
  return `
    <section class="rings-block" aria-label="Stories">
      <div class="ring-row courses">
        ${COURSES_META.map(c => {
          const st = courseStoryState(c.id);
          return `<button class="ring-item" type="button" data-act="story-course" data-course-id="${c.id}" aria-label="${esc(c.short)}-Stories abspielen, ${st.done} von ${st.total} gesehen">
            ${ringHtml({ courseId: c.id, state: st.state === 'done' ? 'done' : 'new', inner: esc(c.icon), size: 'lg' })}
            <span class="ring-label"><b>${esc(c.short)}</b><small>${st.done}/${st.total}</small></span>
          </button>`;
        }).join('')}
      </div>
      <div class="ring-head"><h2>Kapitel-Stories</h2><span>${fresh ? `${fresh} offen` : 'alle gesehen ✓'}</span></div>
      <div class="ring-row chapters" role="list">
        ${order.map((ch, i) => {
          const st = storyStatus(ch);
          return `<button class="ring-item" role="listitem" type="button" data-act="story-ring" data-idx="${i}" aria-label="Story ${esc(ch.title)} (${st.state === 'done' ? 'gesehen' : st.state === 'partial' ? `${st.seen} von ${st.n} gesehen` : 'neu'})">
            ${ringHtml({ courseId: ch.courseId, state: st.state, inner: `<b>${esc(chapterNo(ch))}</b><small>${esc(courseShort(ch.courseId))}</small>` })}
            <span class="ring-label"><span>${esc(chapterName(ch))}</span></span>
            ${st.state === 'partial' ? `<span class="ring-pct">${st.seen}/${st.n}</span>` : st.state === 'new' ? '<span class="ring-pct new">neu</span>' : ''}
          </button>`;
        }).join('')}
      </div>
    </section>`;
}

function renderSideStories() {
  const host = $('#side-stories');
  host.innerHTML = COURSES_META.map(c => {
    const chs = ALL_CHAPTERS.filter(ch => ch.courseId === c.id);
    const cs = courseStoryState(c.id);
    return `<div class="side-group" data-course="${c.id}">
      <button class="side-course" type="button" data-act="story-course" data-course-id="${c.id}">
        ${ringHtml({ courseId: c.id, state: cs.state === 'done' ? 'done' : 'new', inner: esc(c.icon), size: 'sm' })}
        <span><b>${esc(c.short)}</b><small>${cs.done}/${cs.total} Stories gesehen</small></span>
      </button>
      ${chs.map(ch => {
        const st = storyStatus(ch);
        const playing = P.open && curChapter()?.id === ch.id;
        return `<button class="side-ch ${playing ? 'playing' : ''}" type="button" data-act="story-open" data-ch="${ch.id}" title="${esc(ch.title)}">
          <span class="dot is-${st.state}" aria-hidden="true"></span>
          <span class="side-ch-t">${esc(chapterNo(ch))}. ${esc(chapterName(ch))}</span>
          <small>${st.state === 'done' ? '✓' : st.state === 'partial' ? `${st.seen}/${st.n}` : 'neu'}</small>
        </button>`;
      }).join('')}
    </div>`;
  }).join('');
  const fresh = ALL_CHAPTERS.filter(c => storyStatus(c).state !== 'done').length;
  $('#side-new').textContent = fresh ? `· ${fresh} offen` : '· alle gesehen';
}

function refreshRings() {
  renderSideStories();
  if (S.route === 'home') {
    const rb = $('.rings-block', viewEl);
    if (rb) rb.outerHTML = homeRingsHtml();
    updateNowTile();
  }
}

/* =====================================================================
   Views
   ===================================================================== */

function chipsHtml(act, current, counts, chapter) {
  const items = [{ id: 'all', label: 'Alle', sub: 'gemischt' }, ...COURSES_META.map(c => ({ id: c.id, label: c.short, icon: c.icon }))];
  return `<div class="chips" role="group" aria-label="Kurs-Filter">
    ${items.map(it => `<button type="button" class="chip ${current === it.id && !chapter ? 'on' : ''}" data-act="${act}" data-course-id="${it.id}" ${it.id !== 'all' ? `data-course="${it.id}"` : ''} aria-pressed="${current === it.id && !chapter}">
      ${it.icon ? `<span aria-hidden="true">${esc(it.icon)}</span>` : ''}<b>${esc(it.label)}</b>${counts ? `<small>${counts[it.id]}</small>` : it.sub ? `<small>${it.sub}</small>` : ''}
    </button>`).join('')}
    ${chapter ? `<button type="button" class="chip on chapter-chip" data-act="${act}" data-course-id="${CHAPTERS.get(chapter).courseId}" data-course="${CHAPTERS.get(chapter).courseId}" aria-label="Kapitel-Filter entfernen"><b>Kapitel ${esc(chapterNo(CHAPTERS.get(chapter)))}</b><small>✕</small></button>` : ''}
  </div>`;
}

/* ---------- Home ---------- */

function renderHome() {
  const due = getDueCards('all').length;
  const tp = todayProgress();
  const dls = allDeadlines().slice(0, 5);
  const next = nextUnseenChapter();
  const ns = storyStatus(next);
  const C = 2 * Math.PI * 34;
  viewEl.innerHTML = `
    <div class="home">
      ${homeRingsHtml()}
      <div class="feed">
        <article class="tile now-tile" id="now-tile" hidden></article>

        <article class="tile tile-continue" data-course="${next.courseId}">
          <p class="tile-kicker">${ns.state === 'partial' ? 'Weiterschauen' : 'Nächste Story'} · ${esc(courseShort(next.courseId))}</p>
          <h3>${esc(next.title)}</h3>
          <p class="muted">${ns.seen}/${ns.n} Slides gesehen${next.badge ? ` · ${esc(next.badge)}` : ''}</p>
          <button class="btn primary" type="button" data-act="story-open" data-ch="${next.id}">${icon('play')}<span>Abspielen</span></button>
        </article>

        <article class="tile tile-today">
          <div class="today-ring" style="--p:${tp.pct}">
            <svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="34" class="trk"/><circle cx="40" cy="40" r="34" class="val" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - tp.pct / 100)}"/></svg>
            <span><b>${tp.done}</b><small>/ ${tp.goal}</small></span>
          </div>
          <div class="today-txt">
            <p class="tile-kicker">Tagesziel</p>
            <h3>${tp.pct >= 100 ? 'Geschafft! 🎉' : `${tp.goal - tp.done > 0 ? tp.goal - tp.done : 0} bis zum Ziel`}</h3>
            <p class="muted">${plural(tp.reviews, 'Karte', 'Karten')} · ${plural(tp.quizzes, 'Frage', 'Fragen')} · ${tp.minutes} Min Fokus</p>
            <p class="streak">${icon('flame')}<b>${streakLabel()}</b> Streak</p>
          </div>
        </article>

        <article class="tile tile-due">
          <div class="due-head">
            <div><p class="tile-kicker">Fällige Karten</p><p class="due-num">${due}</p></div>
            <button class="btn primary" type="button" data-act="start-interleaved">${icon('cards')}<span>${due ? 'Interleaved starten' : 'Alle üben'}</span></button>
          </div>
          <ul class="course-bars">
            ${COURSES_META.map(c => {
              const m = getCourseMastery(c.id);
              const d = getDueCards(c.id).length;
              return `<li data-course="${c.id}"><a href="#/kurse/${c.id}">
                <span class="cb-name"><span aria-hidden="true">${esc(c.icon)}</span> ${esc(c.short)}</span>
                <span class="cb-bar" style="--p:${m}"><i></i></span>
                <span class="cb-val">${m}%</span>
                <span class="cb-due ${d ? '' : 'zero'}">${d} fällig</span>
              </a></li>`;
            }).join('')}
          </ul>
          <button class="btn ghost full" type="button" data-act="start-quiz-mix">${icon('quiz')}<span>Gemischtes Quiz</span></button>
        </article>

        <article class="tile tile-dl">
          <p class="tile-kicker">Nächste Deadlines</p>
          ${dls.length ? `<ul class="dl-list">${dls.map(d => `
            <li data-course="${d.courseId}" class="${d.daysLeft <= 3 ? 'soon' : ''}">
              <span class="dl-date"><b>${esc(formatDate(d.date).slice(0, 2))}</b><small>${esc(formatDate(d.date).slice(3, 5))}.</small></span>
              <span class="dl-txt"><b>${esc(d.label)}</b><small>${esc(d.courseShort)} · ${esc(formatDate(d.date))}</small></span>
              <span class="dl-left">${esc(daysLeftLabel(d.daysLeft))}</span>
            </li>`).join('')}</ul>` : '<p class="muted">Keine anstehenden Deadlines.</p>'}
        </article>

        <article class="tile tile-pomo">
          <p class="tile-kicker">Fokus-Timer · Pomodoro</p>
          ${pomoPanel()}
        </article>

        <article class="tile tile-mastery">
          <p class="tile-kicker">Gesamtfortschritt</p>
          <div class="mastery-big"><b>${overallMastery()}%</b><span class="muted">Beherrschung über alle Kurse</span></div>
          ${weekBars(7)}
        </article>
      </div>
    </div>`;
  updatePomo();
  updateNowTile();
}

function weekBars(days) {
  const hist = activityHistory(days);
  const max = Math.max(1, ...hist.map(h => h.total));
  return `<div class="week" aria-label="Aktivität der letzten ${days} Tage">${hist.map((h, i) => `
    <div class="wk ${i === hist.length - 1 ? 'today' : ''}" title="${esc(h.label)}: ${h.total} Wiederholungen, ${h.minutes} Min">
      <span class="wk-bar" style="--h:${Math.round((h.total / max) * 100)}"><i></i></span>
      <small>${esc(h.weekday)}</small><b>${h.total}</b>
    </div>`).join('')}</div>`;
}

/* ---------- Flashcards ---------- */

function fcQueue() {
  const f = S.fc;
  if (!f.queue) {
    let q = buildFlashcardQueue(f.course, f.includeAll);
    if (f.chapter) q = q.filter(c => c.chapterId === f.chapter);
    f.queue = q; f.revealed = false; f.done = 0; f.startLen = q.length;
  }
  return f.queue;
}

function renderCards() {
  const f = S.fc;
  const q = fcQueue();
  const counts = { all: getDueCards('all').length };
  COURSES_META.forEach(c => { counts[c.id] = getDueCards(c.id).length; });
  const card = q[0];
  const total = Math.max(f.startLen, f.done + q.length);
  const segN = Math.min(total, 24);
  const doneSegs = total ? Math.round((f.done / total) * segN) : 0;
  const stats = cardStats(f.course);
  const scopeLabel = f.chapter ? `Kapitel: ${chapterName(CHAPTERS.get(f.chapter))}` : f.course === 'all' ? 'Alle Kurse · interleaved' : courseMeta(f.course).title;

  let stageHtml;
  if (!card) {
    stageHtml = `
      <article class="fcard empty">
        <div class="empty-in">
          <span class="empty-emoji" aria-hidden="true">🎉</span>
          <h2>${f.done ? `${plural(f.done, 'Karte', 'Karten')} geschafft!` : 'Nichts fällig'}</h2>
          <p class="muted">${f.includeAll ? 'Du hast alle Karten dieser Auswahl durchgearbeitet.' : 'Für diese Auswahl ist gerade keine Karte fällig. SM-2 meldet sich, wenn es Zeit ist.'}</p>
          <div class="btn-col">
            <button class="btn primary" type="button" data-act="fc-all">${icon('reset')}<span>Alle Karten nochmal üben</span></button>
            <a class="btn" href="#/quiz" data-act="goto-quiz-scope">${icon('quiz')}<span>Weiter zum Quiz</span></a>
          </div>
        </div>
      </article>`;
  } else {
    const ch = CHAPTERS.get(card.chapterId);
    const cm = courseMeta(card.courseId);
    const iv = f.revealed ? intervalsFor(card) : null;
    stageHtml = `
      <article class="fcard ${f.revealed ? 'revealed' : ''}" data-course="${card.courseId}" id="fcard">
        <div class="st-segs fc-segs" aria-label="${f.done} von ${total} erledigt">${Array.from({ length: segN }, (_, i) => `<span class="seg"><i style="transform:scaleX(${i < doneSegs ? 1 : 0})"></i></span>`).join('')}</div>
        <header class="fc-head">
          ${ringHtml({ courseId: card.courseId, state: 'new', inner: esc(cm.icon), size: 'xs' })}
          <div class="st-title"><b>${esc(cm.short)}${ch ? ` · ${esc(chapterName(ch))}` : ''}</b><small>${q.length} übrig · ${f.done} erledigt</small></div>
          ${card.examRelevant ? `<span class="exam-mark" title="Klausurrelevant">${icon('star')}<span>Klausur</span></span>` : ''}
        </header>
        <div class="fc-body" ${f.revealed ? '' : 'data-act="fc-reveal" role="button" tabindex="0" aria-label="Antwort aufdecken"'}>
          <p class="fc-label">Frage</p>
          <div class="fc-front">${esc(card.front)}</div>
          ${f.revealed ? `<div class="fc-divider" aria-hidden="true"></div><p class="fc-label">Antwort</p><div class="fc-back">${esc(card.back)}</div>` : '<p class="fc-tap">Erst selbst antworten – dann tippen zum Aufdecken</p>'}
        </div>
        <footer class="fc-rate">
          ${f.revealed ? RATING_LABELS.map(r => `
            <button type="button" class="rate r${r.value}" data-act="fc-rate" data-rating="${r.value}">
              <b>${esc(r.label)}</b><small>${esc(iv[r.value])}</small><kbd>${r.key}</kbd>
            </button>`).join('') : `<button type="button" class="btn primary reveal-btn" data-act="fc-reveal">Antwort zeigen <kbd>Leertaste</kbd></button>`}
        </footer>
      </article>`;
  }

  viewEl.innerHTML = `
    <section class="page cards-page">
      <header class="page-head compact">
        <div><p class="eyebrow">Spaced Repetition · SM-2</p><h1>Karteikarten</h1></div>
      </header>
      ${chipsHtml('fc-filter', f.course, counts, f.chapter)}
      <div class="cards-grid">
        <div class="card-stage">${stageHtml}</div>
        <aside class="cards-side">
          <div class="tile">
            <p class="tile-kicker">Session</p>
            <h3>${esc(scopeLabel)}</h3>
            <p class="muted">${f.includeAll ? 'Modus: alle Karten (freies Üben)' : 'Modus: nur fällige Karten'}</p>
            <div class="sess-nums"><div><b>${f.done}</b><small>erledigt</small></div><div><b>${q.length}</b><small>übrig</small></div><div><b>${counts[f.course] ?? 0}</b><small>fällig</small></div></div>
          </div>
          <div class="tile">
            <p class="tile-kicker">Kartenstatus · ${f.course === 'all' ? 'alle Kurse' : esc(courseShort(f.course))}</p>
            ${statBar(stats)}
          </div>
          <div class="tile keys-tile">
            <p class="tile-kicker">Tastatur</p>
            <ul class="keys"><li><kbd>Leertaste</kbd> aufdecken</li><li><kbd>1</kbd>–<kbd>4</kbd> bewerten</li><li><kbd>Q</kbd> zum Quiz</li></ul>
          </div>
        </aside>
      </div>
    </section>`;
}

function statBar(s) {
  const parts = [['new', 'Neu'], ['due', 'Fällig'], ['learning', 'Lernend'], ['mastered', 'Gemeistert']];
  return `<div class="statbar" aria-hidden="true">${parts.map(([k]) => `<i class="sb-${k}" style="flex:${s[k]}"></i>`).join('')}</div>
    <ul class="statlegend">${parts.map(([k, l]) => `<li><span class="sb-${k}"></span>${l}<b>${s[k]}</b></li>`).join('')}</ul>`;
}

function fcReveal() {
  if (!S.fc.queue?.length || S.fc.revealed) return;
  S.fc.revealed = true;
  renderCards();
}

function fcRate(rating) {
  const f = S.fc;
  const card = f.queue?.[0];
  if (!card || !f.revealed) return;
  const again = rateCard(card, rating);
  f.queue.shift();
  if (again) { f.queue.push(card); toast('Kommt am Ende der Runde nochmal 🔁'); } else f.done += 1;
  f.revealed = false;
  renderCards();
  updateBadges();
}

/* ---------- Quiz ---------- */

function quizQueue() {
  const z = S.quiz;
  if (!z.queue) {
    let q = buildQuizQueue(z.course);
    if (z.chapter) q = q.filter(x => x.chapterId === z.chapter);
    Object.assign(z, { queue: q, idx: 0, selected: null, result: null, correct: 0, answered: 0, confidence: 'medium' });
  }
  return z.queue;
}

function renderQuiz() {
  const z = S.quiz;
  const q = quizQueue();
  const counts = { all: ALL_QUIZZES.length };
  COURSES_META.forEach(c => { counts[c.id] = ALL_QUIZZES.filter(x => x.courseId === c.id).length; });
  const cur = q[z.idx];
  let body;
  if (!q.length) {
    body = `<div class="tile empty-in"><h2>Keine Fragen</h2><p class="muted">Für diese Auswahl gibt es keine Quizfragen.</p><button class="btn primary" type="button" data-act="quiz-filter" data-course-id="all">Alle Fragen</button></div>`;
  } else if (!cur) {
    const pct = Math.round((z.correct / Math.max(1, z.answered)) * 100);
    body = `
      <div class="tile quiz-done">
        <span class="empty-emoji" aria-hidden="true">${pct >= 80 ? '🏆' : pct >= 50 ? '💪' : '📚'}</span>
        <h2>${z.correct} / ${z.answered} richtig</h2>
        <p class="muted">${pct}% Trefferquote. ${pct >= 80 ? 'Stark – jetzt Abstand gewinnen und später wiederholen.' : 'Lies die Erklärungen nochmal und mach die passenden Stories.'}</p>
        <div class="btn-row center">
          <button class="btn primary" type="button" data-act="quiz-restart">${icon('reset')}<span>Nochmal (neu gemischt)</span></button>
          <a class="btn" href="#/karten">${icon('cards')}<span>Zu den Karten</span></a>
        </div>
      </div>`;
  } else {
    const ch = CHAPTERS.get(cur.chapterId);
    const cm = courseMeta(cur.courseId);
    const res = z.result;
    body = `
      <div class="qz-grid" data-course="${cur.courseId}">
        <article class="qz-q tile">
          <div class="qz-tags">
            ${ringHtml({ courseId: cur.courseId, state: 'new', inner: esc(cm.icon), size: 'xs' })}
            <span><b>${esc(cm.short)}</b>${ch ? ` · ${esc(chapterName(ch))}` : ''}</span>
            ${cur.examStyle ? `<span class="exam-mark">${icon('star')}<span>${esc(cur.examStyle)}</span></span>` : ''}
          </div>
          <h2 class="qz-text">${esc(cur.question)}</h2>
          ${cur.code ? `<pre class="code" tabindex="0"><code>${esc(cur.code)}</code></pre>` : ''}
        </article>
        <div class="qz-a">
          <div class="qz-opts" role="radiogroup" aria-label="Antwortoptionen">
            ${cur.options.map((o, i) => {
              let cls = '';
              if (res) { if (i === cur.answer) cls = 'correct'; else if (i === z.selected) cls = 'wrong'; else cls = 'dim'; } else if (i === z.selected) cls = 'sel';
              return `<button type="button" class="opt ${cls}" role="radio" aria-checked="${i === z.selected}" data-act="quiz-opt" data-idx="${i}" ${res ? 'disabled' : ''}>
                <span class="opt-key">${String.fromCharCode(65 + i)}</span><span class="opt-txt">${esc(o)}</span>
                ${res && i === cur.answer ? `<span class="opt-mark">${icon('check')}</span>` : ''}
              </button>`;
            }).join('')}
          </div>
          ${res ? `
            <div class="qz-fb ${res.correct ? 'ok' : 'bad'}" role="status">
              <p class="qz-verdict">${res.correct ? '✓ Richtig!' : '✗ Leider falsch'}</p>
              ${res.overconfident ? `<p class="hyper"><b>Hyperkorrektur-Effekt:</b> Du warst dir 100% sicher und lagst daneben. Genau diese Fehler merkst du dir am besten – lies die Erklärung bewusst.</p>` : ''}
              <p class="qz-expl">${esc(cur.explanation)}</p>
            </div>` : `
            <fieldset class="conf">
              <legend>Wie sicher bist du?</legend>
              <div class="seg-ctl">${CONFIDENCE_LEVELS.map(c => `<button type="button" class="${z.confidence === c.value ? 'on' : ''}" data-act="quiz-conf" data-conf="${c.value}" aria-pressed="${z.confidence === c.value}">${esc(c.label)}</button>`).join('')}</div>
            </fieldset>`}
          <div class="qz-action">
            ${res
              ? `<button class="btn primary full" type="button" data-act="quiz-next">${z.idx < q.length - 1 ? 'Nächste Frage' : 'Ergebnis ansehen'} <kbd>↵</kbd></button>`
              : `<button class="btn primary full" type="button" data-act="quiz-submit" ${z.selected === null ? 'disabled' : ''}>Antwort prüfen <kbd>↵</kbd></button>`}
          </div>
        </div>
      </div>`;
  }
  const total = q.length;
  viewEl.innerHTML = `
    <section class="page quiz-page">
      <header class="page-head compact">
        <div><p class="eyebrow">Active Recall · Kalibrierung</p><h1>Quiz</h1></div>
        ${total ? `<p class="qz-score"><b>${Math.min(z.idx + (z.result ? 1 : 0), total)}</b>/${total} · <b>${z.correct}</b> richtig</p>` : ''}
      </header>
      ${chipsHtml('quiz-filter', z.course, counts, z.chapter)}
      ${total ? `<div class="st-segs qz-segs" aria-hidden="true">${q.map((_, i) => `<span class="seg"><i style="transform:scaleX(${i < z.idx || (i === z.idx && z.result) ? 1 : 0})"></i></span>`).join('')}</div>` : ''}
      ${body}
    </section>`;
}

function quizSubmit() {
  const z = S.quiz;
  const cur = z.queue?.[z.idx];
  if (!cur || z.result || z.selected === null) return;
  z.result = submitQuiz(cur, z.selected, z.confidence);
  z.answered += 1;
  if (z.result.correct) z.correct += 1;
  renderQuiz();
  $('.qz-fb')?.scrollIntoView({ block: 'nearest', behavior: REDUCED.matches ? 'auto' : 'smooth' });
  $('[data-act="quiz-next"]')?.focus({ preventScroll: true });
}
function quizNext() {
  const z = S.quiz;
  if (!z.result) return;
  z.idx += 1; z.selected = null; z.result = null; z.confidence = 'medium';
  renderQuiz();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

/* ---------- Courses ---------- */

function renderCourses() {
  const cid = COURSES_META.some(c => c.id === S.routeArg) ? S.routeArg : 'gdp1';
  const cm = courseMeta(cid);
  const chs = ALL_CHAPTERS.filter(c => c.courseId === cid);
  const m = getCourseMastery(cid);
  const due = getDueCards(cid).length;
  const qn = ALL_QUIZZES.filter(q => q.courseId === cid).length;
  const cs = courseStoryState(cid);
  const ex = cm.examInfo;
  viewEl.innerHTML = `
    <section class="page courses-page" data-course="${cid}">
      <div class="course-tabs" role="tablist" aria-label="Kurs wählen">
        ${COURSES_META.map(c => `<a role="tab" href="#/kurse/${c.id}" data-course="${c.id}" class="${c.id === cid ? 'on' : ''}" aria-selected="${c.id === cid}">
          ${ringHtml({ courseId: c.id, state: courseStoryState(c.id).state === 'done' ? 'done' : 'new', inner: esc(c.icon), size: 'sm' })}<b>${esc(c.short)}</b></a>`).join('')}
      </div>

      <header class="course-hero">
        <p class="eyebrow">${esc(cm.short)} · ${esc(cm.prof)}</p>
        <h1>${esc(cm.title)}</h1>
        <p class="hero-sub">${esc(cm.subtitle)}</p>
        <div class="hero-stats">
          <div><b>${m}%</b><small>Beherrschung</small></div>
          <div><b>${due}</b><small>Karten fällig</small></div>
          <div><b>${cs.done}/${cs.total}</b><small>Stories gesehen</small></div>
        </div>
        <div class="hero-actions">
          <button class="btn on-grad" type="button" data-act="story-course" data-course-id="${cid}">${icon('play')}<span>Stories abspielen</span></button>
          <button class="btn on-grad ghost" type="button" data-act="course-cards" data-course-id="${cid}">${icon('cards')}<span>${due ? `${due} Karten` : 'Karten üben'}</span></button>
          <button class="btn on-grad ghost" type="button" data-act="course-quiz" data-course-id="${cid}">${icon('quiz')}<span>${plural(qn, 'Frage', 'Fragen')}</span></button>
        </div>
      </header>

      <div class="course-grid">
        <div class="ch-list">
          <h2 class="sec-title">Kapitel</h2>
          ${chs.map((ch, i) => chapterBlock(ch, i === 0)).join('')}
        </div>
        <aside class="course-side">
          <div class="tile">
            <p class="tile-kicker">Prüfung</p>
            <dl class="exam">
              <div><dt>Form</dt><dd>${esc(ex.type)}</dd></div>
              <div><dt>Hilfsmittel</dt><dd>${esc(ex.aid)}</dd></div>
              <div><dt>Vorleistung</dt><dd>${esc(ex.pvl)}</dd></div>
              <div><dt>Zeitraum</dt><dd>${esc(ex.period)}</dd></div>
            </dl>
          </div>
          <div class="tile">
            <p class="tile-kicker">Deadlines</p>
            <ul class="dl-list small">${cm.deadlines.map(d => {
              const dl = allDeadlines({ includePast: true }).find(x => x.date === d.date && x.label === d.label);
              return `<li class="${dl && dl.daysLeft < 0 ? 'past' : dl && dl.daysLeft <= 3 ? 'soon' : ''}" data-course="${cid}"><span class="dl-txt"><b>${esc(d.label)}</b><small>${esc(formatDate(d.date))}</small></span><span class="dl-left">${dl ? esc(daysLeftLabel(dl.daysLeft)) : ''}</span></li>`;
            }).join('')}</ul>
          </div>
          <div class="tile">
            <p class="tile-kicker">Unterlagen · ${cm.pdfs.length} PDFs</p>
            <ul class="pdfs">${cm.pdfs.map(p => `<li><a href="${pdfHref(p.path)}" target="_blank" rel="noopener">${icon('pdf')}<span>${esc(p.title)}</span><small>${esc(p.tag)}</small></a></li>`).join('')}</ul>
          </div>
        </aside>
      </div>
    </section>`;
}

function chapterBlock(ch, open) {
  const st = storyStatus(ch);
  const pinned = store.isPinned(ch.cheatSheet.id);
  const f = getFeynman(ch.id);
  return `
    <details class="chapter tile" ${open ? 'open' : ''} data-ch="${ch.id}">
      <summary>
        ${ringHtml({ courseId: ch.courseId, state: st.state, inner: `<b>${esc(chapterNo(ch))}</b>`, size: 'sm' })}
        <span class="ch-t"><b>${esc(chapterName(ch))}</b><small>${ch.badge ? `${esc(ch.badge)} · ` : ''}${st.state === 'done' ? 'Story gesehen' : st.state === 'partial' ? `Story ${st.seen}/${st.n}` : 'Story neu'}</small></span>
        <span class="chev" aria-hidden="true">${icon('right')}</span>
      </summary>
      <div class="ch-body">
        <div class="ch-actions">
          <button class="btn primary" type="button" data-act="story-open" data-ch="${ch.id}">${icon('play')}<span>Als Story</span></button>
          <button class="btn ${pinned ? 'pinned' : ''}" type="button" data-act="pin-ch" data-ch="${ch.id}" aria-pressed="${pinned}">${icon('pin')}<span>${pinned ? 'Gepinnt' : 'Pinnen'}</span></button>
          <button class="btn ghost" type="button" data-act="ch-cards" data-ch="${ch.id}">${icon('cards')}<span>Karten</span></button>
        </div>
        <ul class="summary">${ch.summary.map(s => `<li>${s}</li>`).join('')}</ul>
        ${ch.diagram && DIAGRAMS[ch.diagram] ? `<figure class="dia-frame"><figcaption>${esc(DIAGRAMS[ch.diagram].title)}</figcaption><div class="dia-scroll" tabindex="0"><div class="dia-inner">${diagramSvg(ch.diagram)}</div></div></figure>` : ''}
        <div class="fey-block">
          <p class="tile-kicker">Feynman-Technik</p>
          <p class="fey-prompt">${esc(ch.feynman.prompt)}</p>
          <label class="sr-only" for="fey-${ch.id}">Deine Erklärung</label>
          <textarea id="fey-${ch.id}" class="fey-text" data-fey="${ch.id}" rows="5" placeholder="Erklär es in eigenen Worten …">${esc(f.text)}</textarea>
          <p class="fey-sub">Checkliste · <span data-fey-count="${ch.id}">${f.checkedPoints.length}/${ch.feynman.rubric.length}</span> abgedeckt</p>
          ${rubricHtml(ch)}
        </div>
      </div>
    </details>`;
}

/* ---------- Email coach ---------- */

function renderEmail() {
  const prompts = ENGLISH_DATA.emailPrompts;
  const p = prompts[S.email.idx] || prompts[0];
  viewEl.innerHTML = `
    <section class="page email-page" data-course="english">
      <header class="page-head">
        <div><p class="eyebrow">English · GPAS Exam Email</p><h1>E-Mail-Coach</h1>
        <p class="lead">Schreib die Prüfungs-Mail (120–180 Wörter). Das Feedback aktualisiert sich live, während du tippst.</p></div>
      </header>
      <div class="scen-tabs" role="tablist" aria-label="Szenario">
        ${prompts.map((x, i) => `<button type="button" role="tab" class="chip ${i === S.email.idx ? 'on' : ''}" data-course="english" data-act="email-scen" data-idx="${i}" aria-selected="${i === S.email.idx}"><b>Szenario ${i + 1}</b><small>${esc(x.title)}</small></button>`).join('')}
      </div>
      <div class="email-grid">
        <div class="email-main">
          <article class="tile scenario" lang="en">
            <p class="tile-kicker">Scenario</p>
            <h2 id="em-title">${esc(p.title)}</h2>
            <p class="scen-text" id="em-scen">${esc(p.scenario)}</p>
          </article>
          <details class="tile dia-frame gpas">
            <summary><span class="tile-kicker">GPAS-Struktur</span><span class="muted">${esc(DIAGRAMS['gpas-email'].title)}</span></summary>
            <div class="dia-scroll" tabindex="0"><div class="dia-inner">${diagramSvg('gpas-email')}</div></div>
          </details>
          <div class="editor tile">
            <div class="editor-bar" aria-live="off">
              <span id="em-mini-words">0 Wörter</span>
              <span class="mini-meter" aria-hidden="true"><i id="em-mini-bar"></i></span>
              <span id="em-mini-score">0/6</span>
            </div>
            <label class="sr-only" for="em-text">Deine E-Mail</label>
            <textarea id="em-text" lang="en" spellcheck="true" rows="14" placeholder="Dear Ms Miller,&#10;&#10;Thank you for your email regarding …">${esc(drafts[p.id] || '')}</textarea>
          </div>
        </div>
        <aside class="email-side" id="em-feedback" aria-label="Live-Feedback">
          <div class="tile">
            <p class="tile-kicker">Wortzahl</p>
            <div class="words"><b id="em-words">0</b><span id="em-words-state" class="muted"></span></div>
            <div class="wmeter" aria-hidden="true"><span class="wm-zone"></span><i id="em-wbar"></i></div>
            <p class="muted small">Ziel 120–180 · Toleranz 110–200</p>
          </div>
          <div class="tile">
            <p class="tile-kicker">Checks · <span id="em-score">0/6</span></p>
            <ul class="checks" id="em-checks"></ul>
          </div>
          <div class="tile">
            <p class="tile-kicker">Schlüsselwörter · <span id="em-kw-count"></span></p>
            <ul class="kw" id="em-kw" lang="en"></ul>
          </div>
        </aside>
      </div>
    </section>`;
  updateEmailFeedback(true);
}

let draftTimer = 0;
function updateEmailFeedback(rebuild = false) {
  const p = ENGLISH_DATA.emailPrompts[S.email.idx];
  const ta = $('#em-text');
  if (!ta || !p) return;
  const a = analyzeEmail(ta.value, p);
  const target = a.words >= 120 && a.words <= 180;
  const state = a.words === 0 ? 'noch leer' : target ? 'im Zielbereich ✓' : a.wordsOk ? 'knapp im Rahmen' : a.words < 110 ? 'zu kurz' : 'zu lang';
  $('#em-words').textContent = a.words;
  $('#em-words-state').textContent = state;
  const pct = Math.min(100, (a.words / 220) * 100);
  const wbar = $('#em-wbar');
  wbar.style.width = `${pct}%`;
  wbar.className = target ? 'ok' : a.wordsOk ? 'warn' : 'bad';
  $('#em-score').textContent = `${a.score}/6`;
  $('#em-mini-words').textContent = `${a.words} Wörter · ${state}`;
  const mb = $('#em-mini-bar');
  mb.style.width = `${pct}%`;
  mb.className = target ? 'ok' : a.wordsOk ? 'warn' : 'bad';
  $('#em-mini-score').textContent = `${a.score}/6 Checks`;
  const list = $('#em-checks');
  if (rebuild || list.children.length !== a.checks.length) {
    list.innerHTML = a.checks.map(c => `<li data-check="${c.id}"><span class="ck" aria-hidden="true"></span><span class="ck-l" lang="en"></span></li>`).join('');
  }
  a.checks.forEach(c => {
    const li = list.querySelector(`[data-check="${c.id}"]`);
    li.classList.toggle('ok', c.ok);
    li.querySelector('.ck-l').textContent = c.label;
    li.querySelector('.ck').textContent = c.ok ? '✓' : '·';
  });
  const kw = $('#em-kw');
  if (rebuild || kw.children.length !== a.keywords.length) {
    kw.innerHTML = a.keywords.map(k => `<li data-kw="${esc(k.word)}">${esc(k.word)}</li>`).join('');
  }
  a.keywords.forEach((k, i) => kw.children[i].classList.toggle('hit', k.hit));
  $('#em-kw-count').textContent = `${a.kwHits}/${a.keywords.length}`;
}

/* ---------- Cheat sheet ---------- */

function pinCardHtml(p) {
  return `<article class="pin-card" data-course="${p.courseId}">
    <header><span class="pin-tag">${esc(courseShort(p.courseId))}</span><h3>${esc(p.title)}</h3>
      <button class="icon-btn" type="button" data-act="unpin" data-id="${esc(p.id)}" aria-label="${esc(p.title)} vom Spickzettel entfernen">${icon('close')}</button></header>
    <p>${esc(p.content)}</p>
    ${p.code ? `<pre class="code"><code>${esc(p.code)}</code></pre>` : ''}
  </article>`;
}

function renderSheet() {
  const pins = store.state.pinnedCheatSheet;
  const unpinned = ALL_CHAPTERS.filter(ch => !store.isPinned(ch.cheatSheet.id));
  viewEl.innerHTML = `
    <section class="page sheet-page">
      <header class="page-head">
        <div><p class="eyebrow">Klausur-Hilfsmittel · 1 Blatt DIN A4</p><h1>Spickzettel</h1>
        <p class="lead">Pinne Kapitel aus Stories oder Kursen. Gedruckt wird nur das Blatt – kompakt, weiß, zweispaltig.</p></div>
      </header>
      <div class="sheet-tools">
        <button class="btn" type="button" data-act="pins-load" data-courses="gdp1">GP1 laden</button>
        <button class="btn" type="button" data-act="pins-load" data-courses="ics">ICS laden</button>
        <button class="btn" type="button" data-act="pins-load" data-courses="all">Alle laden</button>
        <button class="btn danger" type="button" data-act="pins-clear" ${pins.length ? '' : 'disabled'}>${icon('trash')}<span>Leeren</span></button>
        <button class="btn primary" type="button" data-act="print" ${pins.length ? '' : 'disabled'}>${icon('print')}<span>Drucken</span></button>
      </div>
      <div class="sheet-grid">
        <div class="a4-wrap">
          ${pins.length ? `<div class="a4"><div class="a4-head"><b>StudyOS · Spickzettel WS 26/27</b><span>${plural(pins.length, 'Abschnitt', 'Abschnitte')}</span></div><div class="a4-cols">${pins.map(pinCardHtml).join('')}</div></div>`
            : `<div class="tile empty-in"><span class="empty-emoji" aria-hidden="true">📌</span><h2>Noch nichts gepinnt</h2><p class="muted">Lade ein Kurs-Set oben oder pinne einzelne Kapitel rechts bzw. unten.</p></div>`}
        </div>
        <aside class="sheet-side tile">
          <p class="tile-kicker">Kapitel hinzufügen · ${unpinned.length}</p>
          ${unpinned.length ? `<ul class="add-list">${unpinned.map(ch => `<li><button type="button" data-act="pin-ch" data-ch="${ch.id}" data-course="${ch.courseId}"><span class="pin-tag">${esc(courseShort(ch.courseId))}</span><span>${esc(ch.cheatSheet.title)}</span><b aria-hidden="true">+</b></button></li>`).join('')}</ul>` : '<p class="muted">Alle Kapitel sind gepinnt.</p>'}
        </aside>
      </div>
    </section>`;
  fillPrintSheet();
}

function fillPrintSheet() {
  const pins = store.state.pinnedCheatSheet;
  $('#print-sheet').innerHTML = `<h1>StudyOS · Spickzettel WS 26/27</h1><div class="ps-cols">${pins.map(p => `
    <section><h2>[${esc(courseShort(p.courseId))}] ${esc(p.title)}</h2><p>${esc(p.content)}</p>${p.code ? `<pre>${esc(p.code)}</pre>` : ''}</section>`).join('')}</div>`;
}

/* ---------- Methods & backup ---------- */

const METHODS = [
  { t: 'Spaced Repetition', s: 'SM-2 · Ebbinghaus', d: 'Wiederholen kurz bevor du vergisst. Deine Bewertung (Nochmal → Einfach) bestimmt das nächste Intervall – schwere Karten kommen öfter, leichte seltener.', where: 'Karteikarten', href: '#/karten' },
  { t: 'Active Recall', s: 'Testing Effect', d: 'Abrufen festigt Wissen stärker als Wiederlesen. Darum endet jede Story mit „Teste dich“ und jede Karte verlangt erst eine eigene Antwort.', where: 'Quiz & Karten', href: '#/quiz' },
  { t: 'Interleaving', s: 'Vermischtes Üben', d: 'Kurse und Kapitel abwechselnd zu üben ist anstrengender, verbessert aber das Unterscheiden von Aufgabentypen – genau das, was die Klausur verlangt.', where: 'Filter „Alle“', href: '#/karten' },
  { t: 'Feynman-Technik', s: 'Elaboration', d: 'Erkläre ein Konzept in einfachen Worten. Wo du stockst, ist deine Lücke. Die Checkliste zeigt, welche Kernpunkte deine Erklärung abdecken muss.', where: 'Feynman-Slide jeder Story', href: '#/kurse' },
  { t: 'Dual Coding', s: 'Bild + Wort', d: 'Diagramme und Text zusammen erzeugen zwei Gedächtnisspuren. Jede Story mit Diagramm zeigt es als eigenen Slide.', where: 'Diagramm-Slides', href: '#/' },
];

function renderMethods() {
  const cal = calibrationStats();
  const cs = cardStats('all');
  viewEl.innerHTML = `
    <section class="page methods-page">
      <header class="page-head">
        <div><p class="eyebrow">Evidenzbasiert lernen</p><h1>Methode &amp; Backup</h1>
        <p class="lead">Fünf Lernstrategien mit solider Forschungsbasis – und wo sie in dieser App stecken.</p></div>
      </header>
      <div class="methods">
        ${METHODS.map((m, i) => `<article class="tile method v${i % 4}"><span class="m-no">${i + 1}</span><p class="tile-kicker">${esc(m.s)}</p><h2>${esc(m.t)}</h2><p>${esc(m.d)}</p><a href="${m.href}" class="m-link">${esc(m.where)} ›</a></article>`).join('')}
      </div>
      <div class="methods-grid">
        <div class="tile">
          <p class="tile-kicker">Aktivität · 14 Tage</p>
          ${weekBars(14)}
        </div>
        <div class="tile">
          <p class="tile-kicker">Kalibrierung (Sicherheit vs. Treffer)</p>
          <ul class="calib">${CONFIDENCE_LEVELS.map(c => {
            const r = cal[c.value];
            const pct = r.n ? Math.round((r.ok / r.n) * 100) : 0;
            return `<li><span>${esc(c.label)}</span><span class="cb-bar" style="--p:${pct}"><i></i></span><b>${r.n ? `${pct}%` : '–'}</b><small>${plural(r.n, 'Antwort', 'Antworten')}</small></li>`;
          }).join('')}</ul>
          <p class="muted small">Ideal: Je sicherer, desto höher die Trefferquote. „100% sicher“ mit niedriger Quote = Überkonfidenz.</p>
        </div>
        <div class="tile">
          <p class="tile-kicker">Alle Karten · ${cs.total}</p>
          ${statBar(cs)}
        </div>
        <div class="tile">
          <p class="tile-kicker">Story-Einstellungen</p>
          <label class="switch"><input type="checkbox" data-pref="autoplay" ${prefs.autoplay ? 'checked' : ''}><span class="sw" aria-hidden="true"></span><span>Stories automatisch weiterschalten<small>Kernpunkte und Diagramme laufen nach Lesezeit weiter; Feynman &amp; Test warten immer.</small></span></label>
          <button class="btn ghost" type="button" data-act="stories-reset-viewed">${icon('reset')}<span>Story-Ringe zurücksetzen</span></button>
        </div>
        <div class="tile backup">
          <p class="tile-kicker">Datensicherung</p>
          <p class="muted">Fortschritt liegt nur in diesem Browser. Sichere ihn regelmäßig als JSON.</p>
          <div class="btn-row">
            <button class="btn primary" type="button" data-act="backup">${icon('download')}<span>Backup laden</span></button>
            <label class="btn file-btn">${icon('upload')}<span>Importieren</span><input type="file" accept="application/json,.json" data-act-change="import" class="sr-only"></label>
            <button class="btn danger" type="button" data-act="reset">${icon('trash')}<span>Zurücksetzen</span></button>
          </div>
        </div>
        <div class="tile keys-tile">
          <p class="tile-kicker">Tastenkürzel</p>
          ${shortcutsHtml()}
        </div>
      </div>
    </section>`;
}

function shortcutsHtml() {
  return `<dl class="shortcuts">
    <div><dt><kbd>H</kbd> <kbd>K</kbd> <kbd>Q</kbd> <kbd>C</kbd> <kbd>E</kbd> <kbd>S</kbd> <kbd>M</kbd></dt><dd>Stories · Karten · Quiz · Kurse · E-Mail · Spickzettel · Methode</dd></div>
    <div><dt><kbd>↵</kbd></dt><dd>Story abspielen (Startseite) · Quiz prüfen/weiter</dd></div>
    <div><dt><kbd>←</kbd> <kbd>→</kbd></dt><dd>Story: Slide zurück/weiter</dd></div>
    <div><dt><kbd>⇧</kbd>+<kbd>←</kbd> <kbd>→</kbd></dt><dd>Story: vorherige/nächste Story</dd></div>
    <div><dt><kbd>Leertaste</kbd></dt><dd>Story pausieren · Karte aufdecken</dd></div>
    <div><dt><kbd>Esc</kbd></dt><dd>Story schließen · Dialog schließen</dd></div>
    <div><dt><kbd>1</kbd>–<kbd>4</kbd></dt><dd>Karte bewerten · Quiz-Antwort wählen</dd></div>
    <div><dt><kbd>T</kbd> <kbd>P</kbd> <kbd>?</kbd></dt><dd>Theme · Pomodoro starten/pausieren · diese Liste</dd></div>
  </dl>`;
}

/* =====================================================================
   Sheet (phone bottom sheet / desktop dialog)
   ===================================================================== */

let sheetReturn = null;
function openSheet(title, html) {
  sheetReturn = document.activeElement;
  $('#sheet-title').textContent = title;
  $('#sheet-body').innerHTML = html;
  $('#sheet').hidden = false;
  document.documentElement.classList.add('sheet-open');
  updatePomo();
  requestAnimationFrame(() => $('#sheet').classList.add('open'));
  $('.sheet-panel .icon-btn').focus({ preventScroll: true });
}
function closeSheet() {
  const sh = $('#sheet');
  if (sh.hidden) return;
  sh.classList.remove('open');
  document.documentElement.classList.remove('sheet-open');
  setTimeout(() => { sh.hidden = true; $('#sheet-body').innerHTML = ''; }, REDUCED.matches ? 0 : 220);
  sheetReturn?.focus?.({ preventScroll: true });
}

function moreSheet() {
  const pins = store.state.pinnedCheatSheet.length;
  openSheet('Mehr', `
    <nav class="more-list">
      <a href="#/email" data-act="sheet-close">${icon('mail')}<span><b>E-Mail-Coach</b><small>GPAS Exam Email mit Live-Feedback</small></span></a>
      <a href="#/blatt" data-act="sheet-close">${icon('sheet')}<span><b>Spickzettel</b><small>${plural(pins, 'Abschnitt', 'Abschnitte')} gepinnt · DIN A4</small></span></a>
      <a href="#/methode" data-act="sheet-close">${icon('bulb')}<span><b>Methode &amp; Backup</b><small>Lernstrategien, Statistik, Datensicherung</small></span></a>
      <button type="button" data-act="theme">${icon('swap')}<span><b>Theme wechseln</b><small>Aktuell: <span class="theme-label">${store.state.theme === 'light' ? 'Hell' : 'Dunkel'}</span></small></span></button>
    </nav>`);
}

/* =====================================================================
   Routing & render
   ===================================================================== */

const ROUTES = { '': 'home', stories: 'home', karten: 'karten', quiz: 'quiz', kurse: 'kurse', email: 'email', blatt: 'blatt', methode: 'methode' };

function parseRoute() {
  const [name = '', arg = null] = location.hash.replace(/^#\/?/, '').split('/');
  return { name: ROUTES[name] || 'home', arg };
}

function renderView() {
  const r = S.route;
  if (r === 'home') renderHome();
  else if (r === 'karten') renderCards();
  else if (r === 'quiz') renderQuiz();
  else if (r === 'kurse') renderCourses();
  else if (r === 'email') renderEmail();
  else if (r === 'blatt') renderSheet();
  else if (r === 'methode') renderMethods();
}

function onRoute() {
  const { name, arg } = parseRoute();
  const changed = name !== S.route || arg !== S.routeArg;
  // Phone: leaving via back/tab closes an open full-screen story.
  if (P.open && !DESK.matches && changed) closeStory({ fromPop: true });
  S.route = name; S.routeArg = arg;
  document.body.dataset.route = name;
  $$('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === name));
  $$('.tabbar [data-tab]').forEach(a => {
    const on = a.dataset.tab === name || (a.dataset.tab === 'mehr' && ['email', 'blatt', 'methode'].includes(name));
    a.classList.toggle('on', on);
    if (a.tagName === 'A') { if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }
  });
  renderView();
  if (DESK.matches && name === 'home' && !(P.open && $('#st-frame'))) renderStage();
  if (changed) {
    window.scrollTo(0, 0);
    viewEl.scrollTop = 0;
  }
  document.title = `StudyOS · Stories${name !== 'home' ? ` · ${{ karten: 'Karten', quiz: 'Quiz', kurse: 'Kurse', email: 'E-Mail', blatt: 'Spickzettel', methode: 'Methode' }[name]}` : ''}`;
}

function updateBadges() {
  const due = getDueCards('all').length;
  const pins = store.state.pinnedCheatSheet.length;
  $$('[data-badge="due"]').forEach(b => { b.textContent = due ? String(due) : ''; b.hidden = !due; });
  $$('[data-badge="pins"]').forEach(b => { b.textContent = pins ? String(pins) : ''; b.hidden = !pins; });
}

/* =====================================================================
   Events
   ===================================================================== */

function startCards({ course = 'all', chapter = null, includeAll = false, replace = false } = {}) {
  S.fc = { course, chapter, includeAll, queue: null, revealed: false, done: 0, startLen: 0 };
  go('#/karten', 'karten', replace);
}
function startQuiz({ course = 'all', chapter = null, replace = false } = {}) {
  S.quiz = { ...S.quiz, course, chapter, queue: null };
  go('#/quiz', 'quiz', replace);
}
/** Navigate (or re-render when already there). `replace` swaps out the phone story history entry. */
function go(hash, route, replace) {
  if (S.route === route) { renderView(); if (replace) history.replaceState(null, '', hash); return; }
  if (replace) location.replace(hash); else location.hash = hash;
}

function togglePinFor(ch) {
  const on = togglePinChapter(ch);
  toast(on ? `📌 „${ch.cheatSheet.title}“ auf dem Spickzettel` : 'Vom Spickzettel entfernt');
  updateBadges();
  return on;
}

const ACTIONS = {
  theme() { store.toggleTheme(); applyTheme(); },
  more() { moreSheet(); },
  shortcuts() { openSheet('Tastenkürzel', shortcutsHtml()); },
  'sheet-close'() { closeSheet(); },
  'pomo-toggle'() { pomo.toggle(); },
  'pomo-reset'() { pomo.reset(); },
  'pomo-mode'() { pomo.switchMode(); },
  'pomo-sheet'() { openSheet('Fokus-Timer', pomoPanel()); },

  'story-open'(el) { const order = ALL_CHAPTERS.map(c => c.id); openStory(order, order.indexOf(el.dataset.ch)); },
  'story-ring'(el) { openStory(S.ringOrder.slice(), Number(el.dataset.idx)); },
  'story-course'(el) {
    const chs = ALL_CHAPTERS.filter(c => c.courseId === el.dataset.courseId);
    const start = Math.max(0, chs.findIndex(c => storyStatus(c).state !== 'done'));
    openStory(chs.map(c => c.id), start);
  },
  'story-close'() { closeStory(); },
  'story-pause'() { P.paused = !P.paused; updatePauseBtn(); },
  'story-prev-ch'() { storyPrevChapter(); },
  'story-next-ch'() { storyNextChapter(); },
  'story-test'() { showSlide(P.slides.length - 1, 1); },
  'story-jump'(el) { showSlide(Number(el.dataset.si), 0); },
  'story-auto'() {
    prefs.autoplay = !prefs.autoplay; saveJSON(PREF_KEY, prefs);
    const b = $('#st-auto');
    b.textContent = prefs.autoplay ? 'Auto: an' : 'Auto: aus';
    b.setAttribute('aria-pressed', prefs.autoplay);
    P.dur = slideDuration(P.slides[P.si]); updateSegs();
  },
  'story-pin'() {
    const ch = curChapter();
    const on = togglePinFor(ch);
    const b = $('#st-pin');
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on);
    b.querySelector('span').textContent = on ? 'Gepinnt' : 'Pinnen';
    if (P.slides[P.si].type === 'test') $('#st-body').innerHTML = slideHtml(ch, P.slides[P.si], P.si);
    updateNowTile();
  },
  'story-cards'() {
    const ch = curChapter();
    const due = buildFlashcardQueue(ch.courseId, false).some(c => c.chapterId === ch.id);
    const replace = P.pushed;
    closeStory({ fromPop: replace });
    startCards({ course: ch.courseId, chapter: ch.id, includeAll: !due, replace });
  },
  'story-quiz'() {
    const ch = curChapter();
    const replace = P.pushed;
    closeStory({ fromPop: replace });
    startQuiz({ course: ch.courseId, chapter: ch.id, replace });
  },

  'start-interleaved'() { startCards({ course: 'all', includeAll: getDueCards('all').length === 0 }); },
  'start-quiz-mix'() { startQuiz({ course: 'all' }); },
  'fc-filter'(el) { S.fc = { ...S.fc, course: el.dataset.courseId, chapter: null, includeAll: false, queue: null }; renderCards(); },
  'fc-reveal'() { fcReveal(); },
  'fc-rate'(el) { fcRate(Number(el.dataset.rating)); },
  'fc-all'() { S.fc = { ...S.fc, includeAll: true, queue: null }; renderCards(); },
  'goto-quiz-scope'(el, e) { e.preventDefault(); startQuiz({ course: S.fc.course, chapter: S.fc.chapter }); },

  'quiz-filter'(el) { startQuiz({ course: el.dataset.courseId, chapter: null }); },
  'quiz-opt'(el) { if (S.quiz.result) return; S.quiz.selected = Number(el.dataset.idx); renderQuiz(); $(`.opt[data-idx="${el.dataset.idx}"]`)?.focus({ preventScroll: true }); },
  'quiz-conf'(el) { S.quiz.confidence = el.dataset.conf; $$('.seg-ctl button').forEach(b => { const on = b.dataset.conf === S.quiz.confidence; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }); },
  'quiz-submit'() { quizSubmit(); },
  'quiz-next'() { quizNext(); },
  'quiz-restart'() { startQuiz({ course: S.quiz.course, chapter: S.quiz.chapter }); },

  'course-cards'(el) { startCards({ course: el.dataset.courseId, includeAll: getDueCards(el.dataset.courseId).length === 0 }); },
  'course-quiz'(el) { startQuiz({ course: el.dataset.courseId }); },
  'ch-cards'(el) {
    const ch = CHAPTERS.get(el.dataset.ch);
    const due = buildFlashcardQueue(ch.courseId, false).some(c => c.chapterId === ch.id);
    startCards({ course: ch.courseId, chapter: ch.id, includeAll: !due });
  },
  'pin-ch'(el) {
    const ch = CHAPTERS.get(el.dataset.ch);
    const on = togglePinFor(ch);
    if (S.route === 'blatt') { renderSheet(); return; }
    el.classList.toggle('pinned', on);
    el.setAttribute('aria-pressed', on);
    el.querySelector('span').textContent = on ? 'Gepinnt' : 'Pinnen';
  },

  'email-scen'(el) {
    S.email.idx = Number(el.dataset.idx);
    const p = ENGLISH_DATA.emailPrompts[S.email.idx];
    $$('.scen-tabs .chip').forEach((b, i) => { b.classList.toggle('on', i === S.email.idx); b.setAttribute('aria-selected', i === S.email.idx); });
    $('#em-title').textContent = p.title;
    $('#em-scen').textContent = p.scenario;
    $('#em-text').value = drafts[p.id] || '';
    updateEmailFeedback(true);
  },

  unpin(el) {
    const p = store.state.pinnedCheatSheet.find(x => x.id === el.dataset.id);
    if (p) store.togglePin({ id: p.id });
    updateBadges(); renderSheet();
    toast('Vom Spickzettel entfernt');
  },
  'pins-load'(el) {
    const ids = el.dataset.courses === 'all' ? COURSES_META.map(c => c.id) : [el.dataset.courses];
    loadCoursePins(ids);
    updateBadges(); renderSheet();
    toast(el.dataset.courses === 'all' ? 'Alle Kapitel gepinnt' : `${courseShort(ids[0])}-Kapitel gepinnt`, 'good');
  },
  'pins-clear'() {
    if (!confirm('Spickzettel wirklich leeren?')) return;
    clearPins(); updateBadges(); renderSheet();
  },
  print() { fillPrintSheet(); window.print(); },

  backup() { downloadBackup(); toast('Backup heruntergeladen', 'good'); },
  reset() {
    if (!confirm('Gesamten Lernfortschritt (Karten, Quiz, Feynman, Pins, Statistik, Story-Ringe) löschen? Das kann nicht rückgängig gemacht werden.')) return;
    resetProgress();
    viewed = {}; saveJSON(VIEW_KEY, viewed);
    drafts = {}; saveJSON(DRAFT_KEY, drafts);
    S.fc.queue = null; S.quiz.queue = null;
    afterDataChange();
    toast('Fortschritt zurückgesetzt');
  },
  'stories-reset-viewed'() {
    viewed = {}; saveJSON(VIEW_KEY, viewed);
    refreshRings(); toast('Alle Story-Ringe wieder farbig');
  },
};

function afterDataChange() {
  applyTheme(); updateBadges(); renderSideStories(); renderView();
  if (DESK.matches) renderStage();
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = ACTIONS[el.dataset.act];
  if (!fn) return;
  if (el.tagName === 'A' && el.dataset.act !== 'sheet-close' && el.dataset.act !== 'goto-quiz-scope') e.preventDefault();
  fn(el, e);
});

document.addEventListener('keydown', (e) => {
  // Keyboard activation for role=button div (card reveal)
  if ((e.key === 'Enter') && e.target.matches?.('.fc-body[data-act]')) { e.preventDefault(); fcReveal(); return; }
});

document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.matches('[data-fey]')) {
    saveFeynmanText(t.dataset.fey, t.value);
  } else if (t.id === 'em-text') {
    const p = ENGLISH_DATA.emailPrompts[S.email.idx];
    drafts[p.id] = t.value;
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => saveJSON(DRAFT_KEY, drafts), 400);
    updateEmailFeedback(false);
  }
});

document.addEventListener('change', async (e) => {
  const t = e.target;
  if (t.matches('[data-fey-pt]')) {
    const id = t.dataset.feyPt;
    toggleFeynmanPoint(id, Number(t.dataset.idx), t.checked);
    const ch = CHAPTERS.get(id);
    const n = getFeynman(id).checkedPoints.length;
    $$(`[data-fey-count="${id}"]`).forEach(s => { s.textContent = `${n}/${ch.feynman.rubric.length}`; });
    // keep the other copy (story slide vs. course page) in sync
    $$(`[data-fey-pt="${id}"][data-idx="${t.dataset.idx}"]`).forEach(c => { c.checked = t.checked; });
    if (n === ch.feynman.rubric.length && t.checked) toast('Alle Kernpunkte erklärt – stark! 🧠', 'good');
    updateNowTile();
  } else if (t.matches('[data-pref="autoplay"]')) {
    prefs.autoplay = t.checked; saveJSON(PREF_KEY, prefs);
    toast(t.checked ? 'Auto-Weiter an' : 'Auto-Weiter aus');
  } else if (t.dataset.actChange === 'import' && t.files?.[0]) {
    try {
      await importBackup(t.files[0]);
      S.fc.queue = null; S.quiz.queue = null;
      afterDataChange();
      toast('Backup importiert ✓', 'good');
    } catch {
      toast('Import fehlgeschlagen: keine gültige Backup-Datei', 'bad');
    }
    t.value = '';
  }
});

// keep textarea typing from triggering story taps; sync feynman text between copies on blur
document.addEventListener('focusout', (e) => {
  const t = e.target;
  if (t.matches?.('[data-fey]')) $$(`[data-fey="${t.dataset.fey}"]`).forEach(o => { if (o !== t) o.value = t.value; });
});

const NAV_KEYS = { h: '#/', k: '#/karten', q: '#/quiz', c: '#/kurse', e: '#/email', s: '#/blatt', m: '#/methode' };

document.addEventListener('keydown', (e) => {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
  const typing = isTyping(e.target);
  const sheetOpen = !$('#sheet').hidden;

  if (e.key === 'Escape') {
    if (sheetOpen) { closeSheet(); e.preventDefault(); return; }
    if (P.open) { if (typing) e.target.blur(); closeStory(); e.preventDefault(); return; }
    return;
  }
  if (typing || sheetOpen) return;

  const storyActive = P.open && (S.route === 'home' || !DESK.matches);
  if (storyActive) {
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && e.target.closest?.('.dia-scroll')) return; // let the diagram scroll
    if (e.key === 'ArrowRight') { e.preventDefault(); e.shiftKey ? storyNextChapter() : storyNext(); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); e.shiftKey ? storyPrevChapter() : storyPrev(); return; }
    if (e.key === ' ') {
      if (e.target.closest?.('button, a')) return; // let buttons activate normally
      e.preventDefault(); P.paused = !P.paused; updatePauseBtn(); return;
    }
    if (!DESK.matches) return; // full-screen story: no other shortcuts
  } else if (S.route === 'home' && DESK.matches && (e.key === 'Enter' || e.key === 'ArrowRight') && !e.target.closest?.('button, a, input, summary')) {
    e.preventDefault();
    const ch = nextUnseenChapter();
    const order = ALL_CHAPTERS.map(c => c.id);
    openStory(order, order.indexOf(ch.id));
    return;
  }

  if (S.route === 'karten' && S.fc.queue?.length) {
    if (e.key === ' ' && !S.fc.revealed) { e.preventDefault(); fcReveal(); return; }
    if (S.fc.revealed && /^[1-4]$/.test(e.key)) { e.preventDefault(); fcRate(Number(e.key)); return; }
  }
  if (S.route === 'quiz' && S.quiz.queue?.[S.quiz.idx]) {
    const cur = S.quiz.queue[S.quiz.idx];
    if (!S.quiz.result && /^[1-9]$/.test(e.key) && Number(e.key) <= cur.options.length) {
      e.preventDefault(); S.quiz.selected = Number(e.key) - 1; renderQuiz(); return;
    }
    if (e.key === 'Enter' && (!e.target.closest?.('button, a') || e.target.closest?.('.opt'))) {
      e.preventDefault(); S.quiz.result ? quizNext() : quizSubmit(); return;
    }
  }
  const k = e.key.toLowerCase();
  if (NAV_KEYS[k] && !e.shiftKey) { location.hash = NAV_KEYS[k]; return; }
  if (k === 't') { ACTIONS.theme(); return; }
  if (k === 'p') { pomo.toggle(); toast(pomo.running ? `Fokus-Timer läuft (${pomo.display})` : 'Fokus-Timer pausiert'); return; }
  if (e.key === '?') { ACTIONS.shortcuts(); }
});

window.addEventListener('hashchange', onRoute);
window.addEventListener('popstate', () => {
  // Phone: the story pushed a history entry; "back" closes it.
  if (P.open && P.pushed && !DESK.matches) { P.pushed = false; closeStory({ fromPop: true }); }
});
window.addEventListener('beforeprint', fillPrintSheet);
document.addEventListener('visibilitychange', () => { document.documentElement.classList.toggle('doc-hidden', document.hidden); });

DESK.addEventListener('change', () => {
  if (DESK.matches) P.pushed = false; // desktop has no story history entry
  if (P.open) mountStory(); else renderStage();
  syncThemeColor();
  renderView();
});

/* ---------- boot ---------- */

applyTheme();
updateBadges();
renderSideStories();
onRoute();
updatePomo();
