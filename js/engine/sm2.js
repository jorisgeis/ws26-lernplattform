// Scientific Spaced Repetition Engine (SM-2 with FSRS-inspired lapses & mastery scoring)
// Based on Woźniak's SM-2 + Cepeda et al. spacing effect + Bjork's desirable difficulties

export const RATINGS = {
  AGAIN: 1, // Complete blackout / wrong
  HARD: 2,  // Correct with serious difficulty
  GOOD: 3,  // Correct after hesitation
  EASY: 4,  // Instant effortless recall
};

export function createInitialCardState(cardId) {
  return {
    id: cardId,
    repetitions: 0,
    interval: 0,        // days
    ease: 2.5,
    lapses: 0,
    nextReview: 0,      // timestamp ms (0 = due immediately / new)
    lastReview: null,
    totalReviews: 0,
    correctReviews: 0,
  };
}

export function reviewCard(state, rating, now = Date.now()) {
  const s = { ...(state || createInitialCardState('')) };
  s.totalReviews = (s.totalReviews || 0) + 1;
  s.lastReview = now;

  // Map 1..4 to SM-2 quality 0..5
  const qMap = { 1: 1, 2: 3, 3: 4, 4: 5 };
  const q = qMap[rating] ?? 4;

  if (rating === RATINGS.AGAIN) {
    s.repetitions = 0;
    s.interval = 0; // re-learn in 10 minutes
    s.lapses = (s.lapses || 0) + 1;
    s.ease = Math.max(1.3, s.ease - 0.2);
    s.nextReview = now + 10 * 60 * 1000; // 10 min
  } else {
    s.correctReviews = (s.correctReviews || 0) + 1;
    if (s.repetitions === 0) {
      s.interval = rating === RATINGS.EASY ? 4 : rating === RATINGS.HARD ? 0.5 : 1;
    } else if (s.repetitions === 1) {
      s.interval = rating === RATINGS.EASY ? 10 : rating === RATINGS.HARD ? 3 : 6;
    } else {
      const mult = rating === RATINGS.HARD ? 1.2 : rating === RATINGS.EASY ? s.ease * 1.3 : s.ease;
      s.interval = Math.round(s.interval * mult * 10) / 10;
    }
    s.repetitions += 1;
    // Standard SM-2 ease update
    s.ease = Math.max(1.3, Math.round((s.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))) * 100) / 100);
    s.nextReview = now + s.interval * 24 * 60 * 60 * 1000;
  }
  return s;
}

export function previewIntervals(state) {
  const now = Date.now();
  const fmt = (ms) => {
    const mins = Math.round((ms - now) / 60000);
    if (mins < 60) return `${Math.max(1, mins)} Min`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs} Std`;
    const days = Math.round((ms - now) / 86400000);
    if (days < 30) return `${days} T`;
    const months = Math.round(days / 30 * 10) / 10;
    return `${months} Mon`;
  };
  return {
    [RATINGS.AGAIN]: fmt(reviewCard(state, RATINGS.AGAIN, now).nextReview),
    [RATINGS.HARD]: fmt(reviewCard(state, RATINGS.HARD, now).nextReview),
    [RATINGS.GOOD]: fmt(reviewCard(state, RATINGS.GOOD, now).nextReview),
    [RATINGS.EASY]: fmt(reviewCard(state, RATINGS.EASY, now).nextReview),
  };
}

export function isDue(state, now = Date.now()) {
  if (!state || state.totalReviews === 0) return true;
  return state.nextReview <= now;
}

export function getCardStatus(state, now = Date.now()) {
  if (!state || state.totalReviews === 0) return 'new';
  if (state.nextReview <= now) return 'due';
  if (state.interval >= 14) return 'mastered';
  return 'learning';
}

// Interleaving algorithm: alternates across courses & chapters so no two consecutive
// cards come from the same topic when possible (Rohrer & Taylor interleaving effect)
export function interleaveItems(items) {
  const buckets = new Map();
  for (const item of items) {
    const key = `${item.courseId}::${item.chapterId || 'general'}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(item);
  }
  // Shuffle within each bucket
  for (const arr of buckets.values()) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  const result = [];
  const keys = Array.from(buckets.keys());
  let lastCourse = null;
  while (keys.length > 0) {
    // Prefer a bucket from a different course than lastCourse
    let pickIdx = keys.findIndex(k => k.split('::')[0] !== lastCourse);
    if (pickIdx === -1) pickIdx = 0;
    // Slight randomization among valid buckets
    const valid = keys.map((k, i) => ({ k, i })).filter(x => x.k.split('::')[0] !== lastCourse);
    if (valid.length > 1) {
      pickIdx = valid[Math.floor(Math.random() * valid.length)].i;
    }
    const key = keys[pickIdx];
    const bucket = buckets.get(key);
    result.push(bucket.shift());
    lastCourse = key.split('::')[0];
    if (bucket.length === 0) {
      keys.splice(pickIdx, 1);
    }
  }
  return result;
}
