const KEY = 'ocean2048.bestScore';

// PUBLIC_INTERFACE
export function getBestScore() {
  /** Read best score from localStorage or 0 if missing. */
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

// PUBLIC_INTERFACE
export function setBestScore(score) {
  /** Persist best score to localStorage. */
  try {
    window.localStorage.setItem(KEY, String(score));
  } catch {
    // ignore
  }
}
