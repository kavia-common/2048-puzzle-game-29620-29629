const BEST_KEY = 'best-score-2048';

/**
 * PUBLIC_INTERFACE
 * Get best score from localStorage.
 */
export function getBest() {
  try {
    const v = localStorage.getItem(BEST_KEY);
    const n = v ? parseInt(v, 10) : 0;
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

/**
 * PUBLIC_INTERFACE
 * Set best score to localStorage.
 */
export function setBest(value) {
  try {
    localStorage.setItem(BEST_KEY, String(value || 0));
  } catch {
    // no-op
  }
}
