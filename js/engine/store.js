// Persistent localStorage state manager for WS 26/27 Lernplattform

const STORAGE_KEY = 'ws26_lernplattform_v1';

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function defaultState() {
  return {
    theme: 'dark',
    cards: {},              // cardId -> SM-2 state
    quizHistory: {},        // quizId -> { attempts, correct, lastConfidence, lastCorrect }
    feynmanNotes: {},       // chapterId -> { text, checkedPoints: [], updatedAt }
    pinnedCheatSheet: [],   // array of { id, courseId, title, content, code }
    completedChapters: {},  // chapterId -> true
    dailyLog: {},           // YYYY-MM-DD -> { reviews, quizzes, minutes }
    dailyGoal: 25,          // reviews/questions per day
    pomodoroSessions: 0,
    emailDrafts: [],        // saved English exam email practice drafts
    streak: { count: 0, lastDate: null },
  };
}

export class Store {
  constructor() {
    this.state = this.load();
    this.listeners = new Set();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      return { ...defaultState(), ...JSON.parse(raw) };
    } catch {
      return defaultState();
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save state:', e);
    }
    this.listeners.forEach(fn => fn(this.state));
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  recordActivity(type = 'review', minutes = 0) {
    const today = todayKey();
    if (!this.state.dailyLog[today]) {
      this.state.dailyLog[today] = { reviews: 0, quizzes: 0, minutes: 0 };
    }
    if (type === 'review') this.state.dailyLog[today].reviews += 1;
    if (type === 'quiz') this.state.dailyLog[today].quizzes += 1;
    if (minutes > 0) this.state.dailyLog[today].minutes += minutes;

    // Update streak
    const last = this.state.streak.lastDate;
    if (last !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      if (last === yKey) {
        this.state.streak.count += 1;
      } else {
        this.state.streak.count = 1;
      }
      this.state.streak.lastDate = today;
    }
    this.save();
  }

  getTodayStats() {
    const today = todayKey();
    return this.state.dailyLog[today] || { reviews: 0, quizzes: 0, minutes: 0 };
  }

  setCardState(cardId, cardState) {
    this.state.cards[cardId] = cardState;
    this.recordActivity('review');
  }

  recordQuiz(quizId, isCorrect, confidence) {
    const prev = this.state.quizHistory[quizId] || { attempts: 0, correct: 0 };
    this.state.quizHistory[quizId] = {
      attempts: prev.attempts + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      lastConfidence: confidence,
      lastCorrect: isCorrect,
      updatedAt: Date.now(),
    };
    this.recordActivity('quiz');
  }

  saveFeynman(chapterId, text, checkedPoints) {
    this.state.feynmanNotes[chapterId] = {
      text,
      checkedPoints,
      updatedAt: Date.now(),
    };
    this.save();
  }

  togglePin(item) {
    const idx = this.state.pinnedCheatSheet.findIndex(p => p.id === item.id);
    if (idx >= 0) {
      this.state.pinnedCheatSheet.splice(idx, 1);
    } else {
      this.state.pinnedCheatSheet.push(item);
    }
    this.save();
  }

  isPinned(id) {
    return this.state.pinnedCheatSheet.some(p => p.id === id);
  }

  toggleTheme() {
    this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.save();
  }

  exportJSON() {
    return JSON.stringify(this.state, null, 2);
  }

  importJSON(str) {
    const parsed = JSON.parse(str);
    this.state = { ...defaultState(), ...parsed };
    this.save();
  }

  resetProgress() {
    const theme = this.state.theme;
    this.state = { ...defaultState(), theme };
    this.save();
  }
}

export const store = new Store();
