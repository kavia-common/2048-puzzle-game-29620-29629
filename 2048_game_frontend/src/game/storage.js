/**
 * Storage utilities for 2048 using localStorage.
 * The functions are small wrappers and should be guarded in environments where
 * localStorage is not available (e.g., SSR or certain test runners).
 */

const BEST_SCORE_KEY = "2048_best_score";
const LAST_STATE_KEY = "2048_last_state";
const PREFS_KEY = "2048_prefs_v1";

/**
 * PUBLIC_INTERFACE
 * isStorageAvailable
 * Safely checks whether localStorage is available.
 * @returns {boolean}
 */
export function isStorageAvailable() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const testKey = "__t";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * PUBLIC_INTERFACE
 * getBestScore
 * Reads best score from localStorage. Returns 0 if not found or unavailable.
 * @returns {number}
 */
export function getBestScore() {
  if (!isStorageAvailable()) return 0;
  const raw = window.localStorage.getItem(BEST_SCORE_KEY);
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * PUBLIC_INTERFACE
 * setBestScore
 * Stores the best score. Ignores if storage unavailable.
 * @param {number} score
 */
export function setBestScore(score) {
  if (!isStorageAvailable()) return;
  const n = Number(score);
  if (!Number.isFinite(n) || n < 0) return;
  window.localStorage.setItem(BEST_SCORE_KEY, String(n));
}

/**
 * PUBLIC_INTERFACE
 * getLastState
 * Reads the last saved board state and score.
 * @returns {{ board:number[][], score:number } | null}
 */
export function getLastState() {
  if (!isStorageAvailable()) return null;
  const raw = window.localStorage.getItem(LAST_STATE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.board) || typeof parsed.score !== "number") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * PUBLIC_INTERFACE
 * setLastState
 * Saves the last board state and score.
 * @param {{ board:number[][], score:number }} state
 */
export function setLastState(state) {
  if (!isStorageAvailable()) return;
  if (!state || !Array.isArray(state.board) || typeof state.score !== "number") return;
  try {
    window.localStorage.setItem(LAST_STATE_KEY, JSON.stringify({ board: state.board, score: state.score }));
  } catch {
    // ignore quota errors
  }
}

/**
 * PUBLIC_INTERFACE
 * clearLastState
 * Removes the last saved state.
 */
export function clearLastState() {
  if (!isStorageAvailable()) return;
  window.localStorage.removeItem(LAST_STATE_KEY);
}

/**
 * PUBLIC_INTERFACE
 * getPreferences
 * Reads persisted user preferences. Returns defaults if unavailable or invalid.
 * @returns {{ undoDepth:number, animationsEnabled:boolean, highContrastTiles:boolean }}
 */
export function getPreferences() {
  if (!isStorageAvailable()) {
    return { undoDepth: 1, animationsEnabled: true, highContrastTiles: false };
  }
  const raw = window.localStorage.getItem(PREFS_KEY);
  if (!raw) return { undoDepth: 1, animationsEnabled: true, highContrastTiles: false };
  try {
    const p = JSON.parse(raw);
    const undoDepth = Math.min(5, Math.max(1, Number(p.undoDepth ?? 1)));
    const animationsEnabled = Boolean(p.animationsEnabled ?? true);
    const highContrastTiles = Boolean(p.highContrastTiles ?? false);
    return { undoDepth, animationsEnabled, highContrastTiles };
  } catch {
    return { undoDepth: 1, animationsEnabled: true, highContrastTiles: false };
  }
}

/**
 * PUBLIC_INTERFACE
 * setPreferences
 * Persists user preferences. Accepts partial updates; merges with existing.
 * @param {{ undoDepth?:number, animationsEnabled?:boolean, highContrastTiles?:boolean }} prefs
 */
export function setPreferences(prefs) {
  if (!isStorageAvailable()) return;
  const current = getPreferences();
  const next = {
    undoDepth: Math.min(5, Math.max(1, Number(prefs.undoDepth ?? current.undoDepth))),
    animationsEnabled: typeof prefs.animationsEnabled === "boolean" ? prefs.animationsEnabled : current.animationsEnabled,
    highContrastTiles: typeof prefs.highContrastTiles === "boolean" ? prefs.highContrastTiles : current.highContrastTiles,
  };
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }
}
