// Validates the course content in js/data/*.js.
// Usage (from project root): node tools/validate-data.mjs [--ids-snapshot <file.json>]
// --ids-snapshot: JSON array of IDs that must still exist (learning progress is keyed by ID).

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { GDP1_DATA } = await import(path.join(root, 'js/data/gdp1.js'));
const { GDP2_DATA } = await import(path.join(root, 'js/data/gdp2.js'));
const { ICS_DATA } = await import(path.join(root, 'js/data/ics.js'));
const { ENGLISH_DATA } = await import(path.join(root, 'js/data/english.js'));
const { DIAGRAMS } = await import(path.join(root, 'js/engine/diagrams.js'));

const errors = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const str = (v) => typeof v === 'string' && v.trim().length > 0;
const seen = new Map();

function uniqueId(id, where) {
  if (!str(id)) return err(where, 'missing id');
  if (seen.has(id)) err(where, `duplicate id "${id}" (also ${seen.get(id)})`);
  seen.set(id, where);
}

function checkSource(src, where) {
  if (src === undefined) return;
  if (!src || !str(src.title) || !str(src.path)) return err(where, 'source needs {title, path}');
  if (!existsSync(path.join(root, src.path))) err(where, `source path not found: ${src.path}`);
  if (src.page !== undefined && !(Number.isInteger(src.page) && src.page > 0)) err(where, 'source.page must be a positive integer');
}

const counts = [];
for (const data of [GDP1_DATA, GDP2_DATA, ICS_DATA, ENGLISH_DATA]) {
  const c = data.courseId;
  const chapterIds = new Set();
  for (const [i, ch] of (data.chapters || []).entries()) {
    const w = `${c}.chapters[${i}] ${ch.id}`;
    uniqueId(ch.id, w);
    chapterIds.add(ch.id);
    if (!str(ch.title)) err(w, 'title');
    if (!str(ch.badge)) err(w, 'badge');
    if (ch.diagram !== undefined && !DIAGRAMS[ch.diagram]) err(w, `unknown diagram "${ch.diagram}"`);
    if (!Array.isArray(ch.summary) || ch.summary.length === 0 || !ch.summary.every(str)) err(w, 'summary[] of non-empty strings');
    if (!ch.feynman || !str(ch.feynman.prompt) || !Array.isArray(ch.feynman.rubric) || ch.feynman.rubric.length < 2 || !ch.feynman.rubric.every(str)) err(w, 'feynman {prompt, rubric[>=2]}');
    const cs = ch.cheatSheet;
    if (!cs || !str(cs.title) || !str(cs.content)) err(w, 'cheatSheet {id,courseId,title,content}');
    else {
      uniqueId(cs.id, `${w}.cheatSheet`);
      if (cs.courseId !== c) err(w, `cheatSheet.courseId must be "${c}"`);
      if (cs.code !== undefined && typeof cs.code !== 'string') err(w, 'cheatSheet.code must be string');
    }
    if (ch.examWeight !== undefined && ![1, 2, 3].includes(ch.examWeight)) err(w, 'examWeight must be 1|2|3');
    if (ch.sources !== undefined) {
      if (!Array.isArray(ch.sources)) err(w, 'sources must be an array');
      else ch.sources.forEach((s, j) => checkSource(s, `${w}.sources[${j}]`));
    }
  }
  for (const [i, fc] of (data.flashcards || []).entries()) {
    const w = `${c}.flashcards[${i}] ${fc.id}`;
    uniqueId(fc.id, w);
    if (!chapterIds.has(fc.chapterId)) err(w, `unknown chapterId "${fc.chapterId}"`);
    if (typeof fc.examRelevant !== 'boolean') err(w, 'examRelevant must be boolean');
    if (!str(fc.front) || !str(fc.back)) err(w, 'front/back');
    checkSource(fc.source, w);
  }
  for (const [i, q] of (data.quizzes || []).entries()) {
    const w = `${c}.quizzes[${i}] ${q.id}`;
    uniqueId(q.id, w);
    if (!chapterIds.has(q.chapterId)) err(w, `unknown chapterId "${q.chapterId}"`);
    if (!str(q.examStyle) || !str(q.question) || !str(q.explanation)) err(w, 'examStyle/question/explanation');
    if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 5 || !q.options.every(str)) err(w, 'options[2..5]');
    else if (new Set(q.options).size !== q.options.length) err(w, 'duplicate options');
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.options?.length ?? 0)) err(w, 'answer index out of range');
    if (q.code !== undefined && typeof q.code !== 'string') err(w, 'code must be string');
    checkSource(q.source, w);
  }
  if (data.emailPrompts) {
    for (const [i, p] of data.emailPrompts.entries()) {
      const w = `${c}.emailPrompts[${i}] ${p.id}`;
      uniqueId(p.id, w);
      if (!str(p.title) || !str(p.scenario)) err(w, 'title/scenario');
      if (!Array.isArray(p.keywords) || !p.keywords.every(k => str(k) && k === k.toLowerCase())) err(w, 'keywords must be lowercase strings');
    }
  }
  counts.push({ course: c, chapters: data.chapters.length, flashcards: data.flashcards.length, quizzes: data.quizzes.length, emailPrompts: data.emailPrompts?.length ?? 0 });
}

const snapIdx = process.argv.indexOf('--ids-snapshot');
if (snapIdx > 0) {
  const ids = JSON.parse(readFileSync(process.argv[snapIdx + 1], 'utf8'));
  for (const id of ids) if (!seen.has(id)) err('ids-snapshot', `existing id removed: ${id}`);
}

console.table(counts);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n- ` + errors.join('\n- '));
  process.exit(1);
}
console.log('OK');
