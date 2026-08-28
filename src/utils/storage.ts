import type { UserPreferences } from '@/types';

const KEYS = {
  PREFERENCES: 'mathlab_preferences',
  SCORES: 'mathlab_scores',
  RECENT: 'mathlab_recent',
  EXHIBITION: 'mathlab_exhibition',
} as const;

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  reducedMotion: false,
  highContrast: false,
  soundEnabled: false,
  animationsEnabled: true,
  exhibitionMode: false,
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage not available
  }
}

export function getPreferences(): UserPreferences {
  return { ...DEFAULT_PREFERENCES, ...safeGet(KEYS.PREFERENCES, {}) };
}

export function savePreferences(prefs: Partial<UserPreferences>): void {
  const current = getPreferences();
  safeSet(KEYS.PREFERENCES, { ...current, ...prefs });
}

export function getScores(): Record<string, number> {
  return safeGet(KEYS.SCORES, {});
}

export function saveScore(challengeId: string, score: number): void {
  const scores = getScores();
  if (!scores[challengeId] || score > scores[challengeId]) {
    scores[challengeId] = score;
    safeSet(KEYS.SCORES, scores);
  }
}

export function getRecentExperiments(): string[] {
  return safeGet(KEYS.RECENT, []);
}

export function addRecentExperiment(id: string): void {
  const recent = getRecentExperiments().filter((r) => r !== id);
  safeSet(KEYS.RECENT, [id, ...recent].slice(0, 5));
}
