// Shared domain layer for all UI variants in /versionen.
// Pure logic + data access only — every variant renders its own UI on top of this.
// Uses the same store (localStorage key) as the original app, so progress is shared.

import { COURSES_META } from './data/courses.js';
import { GDP1_DATA } from './data/gdp1.js';
import { GDP2_DATA } from './data/gdp2.js';
import { ICS_DATA } from './data/ics.js';
import { ENGLISH_DATA } from './data/english.js';
import { RATINGS, reviewCard, previewIntervals, isDue, getCardStatus, interleaveItems } from './engine/sm2.js';
import { store } from './engine/store.js';
import { DIAGRAMS } from './engine/diagrams.js';

export { COURSES_META, ENGLISH_DATA, DIAGRAMS, RATINGS, store, previewIntervals, getCardStatus, isDue };

export const ALL_DATA = { gdp1: GDP1_DATA, gdp2: GDP2_DATA, ics: ICS_DATA, english: ENGLISH_DATA };

export const ALL_FLASHCARDS = Object.values(ALL_DATA).flatMap(d =>
  d.flashcards.map(fc => ({ ...fc, courseId: d.courseId }))
);
export const ALL_QUIZZES = Object.values(ALL_DATA).flatMap(d =>
  d.quizzes.map(q => ({ ...q, courseId: d.courseId }))
);
export const ALL_CHAPTERS = Object.values(ALL_DATA).flatMap(d =>
  d.chapters.map(ch => ({ ...ch, courseId: d.courseId }))
);

export function courseMeta(id) {
  return COURSES_META.find(c => c.id === id) || COURSES_META[0];
}

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** PDF paths in COURSES_META are project-root relative locally; online (GitHub Pages) they open the Moodle course. */
const MOODLE_FALLBACK = {
  'gdp1': 'https://moodle.oncampus.de/course/view.php?id=40973',
  'gdp2': 'https://moodle.oncampus.de/course/view.php?id=40976',
  'internettechnologie': 'https://moodle.oncampus.de/course/view.php?id=41025',
  'english-cs': 'https://moodle.oncampus.de/course/view.php?id=41019',
};
export function pdfHref(path) {
  if (typeof location !== 'undefined' && !['localhost', '127.0.0.1'].includes(location.hostname)) {
    const slug = String(path || '').split('/')[1];
    if (MOODLE_FALLBACK[slug]) return MOODLE_FALLBACK[slug];
  }
  return encodeURI(path);
}

/* ---------- Flashcards (SM-2) ---------- */

export function getDueCards(courseFilter = 'all') {
  const cards = courseFilter === 'all' ? ALL_FLASHCARDS : ALL_FLASHCARDS.filter(c => c.courseId === courseFilter);
  const due = cards.filter(c => isDue(store.state.cards[c.id]));
  return courseFilter === 'all' ? interleaveItems(due) : due;
}

export function buildFlashcardQueue(courseFilter = 'all', includeAll = false) {
  const base = courseFilter === 'all' ? ALL_FLASHCARDS : ALL_FLASHCARDS.filter(c => c.courseId === courseFilter);
  const list = includeAll ? base : base.filter(c => isDue(store.state.cards[c.id]));
  return courseFilter === 'all' ? interleaveItems(list) : [...list];
}

/** Applies a 1–4 rating, persists it and returns true if the card must be re-queued (AGAIN). */
export function rateCard(card, rating) {
  const next = reviewCard(store.state.cards[card.id], rating);
  store.setCardState(card.id, next);
  return rating === RATINGS.AGAIN;
}

export function intervalsFor(card) {
  return previewIntervals(store.state.cards[card.id]);
}

export const RATING_LABELS = [
  { value: 1, key: '1', label: 'Nochmal' },
  { value: 2, key: '2', label: 'Schwer' },
  { value: 3, key: '3', label: 'Gut' },
  { value: 4, key: '4', label: 'Einfach' },
];

/** Status distribution of flashcards: { new, due, learning, mastered, total }. */
export function cardStats(courseId = 'all') {
  const cards = courseId === 'all' ? ALL_FLASHCARDS : ALL_FLASHCARDS.filter(c => c.courseId === courseId);
  const out = { new: 0, due: 0, learning: 0, mastered: 0, total: cards.length };
  for (const c of cards) out[getCardStatus(store.state.cards[c.id])] += 1;
  return out;
}

/* ---------- Quiz ---------- */

export function buildQuizQueue(courseFilter = 'all') {
  const base = courseFilter === 'all' ? ALL_QUIZZES : ALL_QUIZZES.filter(q => q.courseId === courseFilter);
  return courseFilter === 'all' ? interleaveItems(base) : [...base];
}

export const CONFIDENCE_LEVELS = [
  { value: 'low', label: 'Geraten' },
  { value: 'medium', label: 'Ziemlich sicher' },
  { value: 'high', label: '100% sicher' },
];

/** Records the answer; returns { correct, overconfident } for feedback rendering. */
export function submitQuiz(q, selectedIdx, confidence) {
  const correct = selectedIdx === q.answer;
  store.recordQuiz(q.id, correct, confidence);
  return { correct, overconfident: !correct && confidence === 'high' };
}

/** Calibration over all answered quizzes: accuracy per confidence level. */
export function calibrationStats() {
  const res = { low: { n: 0, ok: 0 }, medium: { n: 0, ok: 0 }, high: { n: 0, ok: 0 } };
  for (const h of Object.values(store.state.quizHistory)) {
    if (!h.lastConfidence || !res[h.lastConfidence]) continue;
    res[h.lastConfidence].n += 1;
    if (h.lastCorrect) res[h.lastConfidence].ok += 1;
  }
  return res;
}

/* ---------- Mastery & progress ---------- */

export function getCourseMastery(courseId) {
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

export function overallMastery() {
  const vals = COURSES_META.map(c => getCourseMastery(c.id));
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export function todayProgress() {
  const t = store.getTodayStats();
  const done = t.reviews + t.quizzes;
  const goal = store.state.dailyGoal;
  return { done, goal, pct: Math.min(100, Math.round((done / goal) * 100)), reviews: t.reviews, quizzes: t.quizzes, minutes: t.minutes };
}

function dayKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Last `days` days (oldest first): [{ key, label, weekday, total, reviews, quizzes, minutes }]. */
export function activityHistory(days = 7) {
  const out = [];
  const wd = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dayKey(d);
    const log = store.state.dailyLog[key] || { reviews: 0, quizzes: 0, minutes: 0 };
    out.push({ key, label: `${d.getDate()}.${d.getMonth() + 1}.`, weekday: wd[d.getDay()], total: log.reviews + log.quizzes, ...log });
  }
  return out;
}

export function streakLabel() {
  const n = store.state.streak.count;
  return `${n} ${n === 1 ? 'Tag' : 'Tage'}`;
}

/* ---------- Deadlines ---------- */

/** All deadlines sorted ascending, with daysLeft (negative = past) and course info. */
export function allDeadlines({ includePast = false } = {}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return COURSES_META.flatMap(c => c.deadlines.map(d => {
    const date = new Date(d.date + 'T00:00:00');
    return { ...d, courseId: c.id, courseShort: c.short, color: c.color, icon: c.icon, daysLeft: Math.round((date - today) / 86400000) };
  }))
    .filter(d => includePast || d.daysLeft >= 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

export function daysLeftLabel(n) {
  if (n < 0) return `vor ${-n} T`;
  if (n === 0) return 'heute';
  if (n === 1) return 'morgen';
  return `in ${n} T`;
}

/* ---------- Feynman ---------- */

export function getFeynman(chapterId) {
  return store.state.feynmanNotes[chapterId] || { text: '', checkedPoints: [] };
}

export function saveFeynmanText(chapterId, text) {
  store.saveFeynman(chapterId, text, getFeynman(chapterId).checkedPoints);
}

export function toggleFeynmanPoint(chapterId, idx, checked) {
  const cur = getFeynman(chapterId);
  const set = new Set(cur.checkedPoints);
  if (checked) set.add(idx); else set.delete(idx);
  store.saveFeynman(chapterId, cur.text, Array.from(set));
}

/* ---------- Cheat sheet ---------- */

export function togglePinChapter(chapter) {
  store.togglePin(chapter.cheatSheet);
  return store.isPinned(chapter.cheatSheet.id);
}

export function loadCoursePins(courseIds) {
  for (const cid of courseIds) {
    for (const ch of ALL_DATA[cid].chapters) {
      if (!store.isPinned(ch.cheatSheet.id)) store.togglePin(ch.cheatSheet);
    }
  }
}

export function clearPins() {
  store.state.pinnedCheatSheet = [];
  store.save();
}

/* ---------- GPAS email coach ---------- */

export function analyzeEmail(text, prompt) {
  const trimmed = text.trim();
  const lower = text.toLowerCase();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const hasEmoticon = /(:\)|:-\)|;\)|😊|😀|👍)/i.test(text);
  const checks = [
    { id: 'greeting', label: 'Greeting (Dear/Hello + Name)', ok: /^(dear|hello|hi)\s+[a-z]/im.test(trimmed) },
    { id: 'purpose', label: 'Purpose / Reference', ok: /(thank you for|in your (last |previous )?email|i am writing to|regarding your|with reference to)/i.test(text) },
    { id: 'paragraphs', label: 'White Space (≥3 Paragraphs)', ok: trimmed.split(/\n\s*\n/).filter(Boolean).length >= 3 },
    { id: 'indirect', label: 'Polite Indirect Question', ok: /(could you|would you mind|i would appreciate|i was wondering if|could you please let me know)/i.test(text) },
    { id: 'salutation', label: 'Salutation (Kind regards)', ok: /(kind regards|best regards|best wishes|yours sincerely|sincerely)/i.test(text) },
    { id: 'emoticons', label: hasEmoticon ? 'Remove Emoticons!' : 'No Emoticons', ok: !hasEmoticon },
  ];
  const kwHits = prompt.keywords.filter(k => lower.includes(k));
  return {
    words,
    wordsOk: words >= 110 && words <= 200,
    checks,
    score: checks.filter(c => c.ok).length,
    keywords: prompt.keywords.map(k => ({ word: k, hit: kwHits.includes(k) })),
    kwHits: kwHits.length,
  };
}

/* ---------- Backup ---------- */

export function downloadBackup() {
  const blob = new Blob([store.exportJSON()], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `studyos-ws26-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** Resolves on success, rejects on invalid JSON. */
export async function importBackup(file) {
  const txt = await file.text();
  store.importJSON(txt);
}

export function resetProgress() {
  store.resetProgress();
}

/* ---------- Pomodoro ---------- */

export class Pomodoro {
  /** onChange(state) on every tick/state change; onFinish(minutes) when a session completes. */
  constructor({ onChange, onFinish } = {}) {
    this.mode = 25;
    this.seconds = 25 * 60;
    this.timer = null;
    this.onChange = onChange || (() => {});
    this.onFinish = onFinish || (() => {});
  }
  get running() { return this.timer !== null; }
  get display() {
    return `${String(Math.floor(this.seconds / 60)).padStart(2, '0')}:${String(this.seconds % 60).padStart(2, '0')}`;
  }
  get progress() { return 1 - this.seconds / (this.mode * 60); }
  toggle() {
    if (this.timer) { this.stop(); } else {
      this.timer = setInterval(() => {
        this.seconds -= 1;
        if (this.seconds <= 0) {
          this.stop();
          store.recordActivity('focus', this.mode);
          this.onFinish(this.mode);
          this.seconds = this.mode * 60;
        }
        this.onChange(this);
      }, 1000);
    }
    this.onChange(this);
  }
  stop() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }
  reset() { this.stop(); this.seconds = this.mode * 60; this.onChange(this); }
  switchMode() { this.stop(); this.mode = this.mode === 25 ? 50 : 25; this.seconds = this.mode * 60; this.onChange(this); }
}
