import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createEmptyGrid, spawnRandomTile, moveGrid, gridToTiles, cloneCells, canMove } from '../utils/gameLogic';
import { loadState, saveState, loadBest, saveBest } from '../utils/storage';

/**
 * PUBLIC_INTERFACE
 * use2048 encapsulates the full game state and actions.
 * Exposes { grid, score, best, hasWon, isGameOver, canUndo, move, reset, undo, theme, toggleTheme, announce, setBoardRef }
 */
export function use2048() {
  const [cells, setCells] = useState(() => {
    const saved = loadState();
    if (saved?.cells) return saved.cells;
    const next = createEmptyGrid();
    spawnRandomTile(next);
    spawnRandomTile(next);
    return next;
  });
  const [score, setScore] = useState(() => loadState()?.score ?? 0);
  const [best, setBest] = useState(() => Math.max(loadBest(), loadState()?.best ?? 0));
  const [hasWon, setHasWon] = useState(() => !!loadState()?.hasWon);
  const [isGameOver, setIsGameOver] = useState(() => !!loadState()?.isGameOver);
  const [theme, setTheme] = useState('light');
  const [announce, setAnnounce] = useState('');
  const prevStateRef = useRef(null);
  const boardRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Persist state
  useEffect(() => {
    const state = { cells, score, best, hasWon, isGameOver };
    saveState(state);
    if (best > loadBest()) saveBest(best);
  }, [cells, score, best, hasWon, isGameOver]);

  const grid = useMemo(() => {
    return { tiles: gridToTiles(cells) };
  }, [cells]);

  const updateBest = useCallback((s) => {
    if (s > best) setBest(s);
  }, [best]);

  const postMoveChecks = useCallback((nextCells, nextScore) => {
    // win
    let win = hasWon;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      if (nextCells[r][c]?.value === 2048) win = true;
    }
    setHasWon(win);
    // game over
    const over = !canMove(nextCells);
    setIsGameOver(over);
    // announce
    if (win) setAnnounce('You reached 2048! You win!');
    else if (over) setAnnounce('No more moves. Game over.');
    else setAnnounce('');
    // best
    updateBest(nextScore);
  }, [hasWon, updateBest]);

  const move = useCallback((direction) => {
    if (isGameOver || hasWon) return;
    setCells(prev => {
      const snapshot = { cells: cloneCells(prev), score };
      prevStateRef.current = snapshot;
      const { cells: movedCells, moved, scoreGain } = moveGrid(prev, direction);
      if (!moved) {
        prevStateRef.current = null; // no undo for no-op
        return prev;
      }
      const after = cloneCells(movedCells);
      spawnRandomTile(after);
      const nextScore = score + scoreGain;
      setScore(nextScore);
      postMoveChecks(after, nextScore);
      return after;
    });
  }, [score, isGameOver, hasWon, postMoveChecks]);

  const reset = useCallback(() => {
    const fresh = createEmptyGrid();
    spawnRandomTile(fresh);
    spawnRandomTile(fresh);
    setCells(fresh);
    setScore(0);
    setHasWon(false);
    setIsGameOver(false);
    setAnnounce('Game restarted.');
    prevStateRef.current = null;
    if (boardRef.current) boardRef.current.focus();
  }, []);

  const undo = useCallback(() => {
    const prev = prevStateRef.current;
    if (!prev) return;
    setCells(prev.cells);
    setScore(prev.score);
    setAnnounce('Move undone.');
    prevStateRef.current = null;
  }, []);

  const canUndo = !!prevStateRef.current;

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const setBoardRef = useCallback((node) => {
    boardRef.current = node;
  }, []);

  return {
    grid,
    score,
    best,
    hasWon,
    isGameOver,
    canUndo,
    move,
    reset,
    undo,
    theme,
    toggleTheme,
    announce,
    setBoardRef,
  };
}

/**
 * Types:
 * @typedef {{tiles: Array<{id:string,value:number,row:number,col:number,merging?:boolean,new?:boolean}>}} GridState
 */
