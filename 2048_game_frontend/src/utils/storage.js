const STATE_KEY = '2048:state';
const BEST_KEY = '2048:best';

/**
 * PUBLIC_INTERFACE
 * loadState returns saved state object or null.
 */
export function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * PUBLIC_INTERFACE
 * saveState persists the given state.
 */
export function saveState(state) {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

/**
 * PUBLIC_INTERFACE
 * loadBest returns best score or 0.
 */
export function loadBest() {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

/**
 * PUBLIC_INTERFACE
 * saveBest persists best score.
 */
export function saveBest(val) {
  try {
    localStorage.setItem(BEST_KEY, String(val));
  } catch {
    // ignore
  }
}
