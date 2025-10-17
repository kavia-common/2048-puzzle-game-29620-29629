import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  initializeGrid,
  applyMove,
  canMove,
  hasWon,
} from './engine';
import { getBestScore, setBestScore } from '../utils/storage';
import { useKeyboardInput, useSwipeInput } from '../utils/input';

// PUBLIC_INTERFACE
export function useGame() {
  /**
   * Manage 2048 game state, including score, best score persistence, and inputs.
   */
  const [grid, setGrid] = useState(() => initializeGrid());
  const [score, setScore] = useState(0);
  const [bestScore, setBest] = useState(() => getBestScore());
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [lastActionToast, setLastActionToast] = useState('');

  const lockRef = useRef(false); // throttle inputs
  const lastMoveAtRef = useRef(0);

  const canMoveAny = useMemo(() => canMove(grid), [grid]);

  const updateBest = useCallback((nextScore) => {
    if (nextScore > bestScore) {
      setBest(nextScore);
      setBestScore(nextScore);
    }
  }, [bestScore]);

  const evaluateState = useCallback((g) => {
    if (!won && hasWon(g)) {
      setWon(true);
      setLastActionToast('You win!');
    }
    if (!canMove(g)) {
      setGameOver(true);
      setLastActionToast('No moves left');
    }
  }, [won]);

  const performMove = useCallback((direction) => {
    if (lockRef.current || gameOver) return;
    const now = Date.now();
    if (now - lastMoveAtRef.current < 60) return; // simple throttle
    lastMoveAtRef.current = now;

    lockRef.current = true;
    setTimeout(() => { lockRef.current = false; }, 80);

    setGrid((prev) => {
      const { grid: g2, moved, scoreDelta } = applyMove(prev, direction);
      if (moved) {
        const nextScore = score + scoreDelta;
        setScore(nextScore);
        updateBest(nextScore);
        setLastActionToast(scoreDelta > 0 ? `+${scoreDelta}` : '');
        setTimeout(() => evaluateState(g2), 0);
        return g2;
      } else {
        setLastActionToast('No movement');
        return prev;
      }
    });
  }, [score, updateBest, evaluateState, gameOver]);

  const newGame = useCallback(() => {
    setGrid(initializeGrid());
    setScore(0);
    setGameOver(false);
    setWon(false);
    setLastActionToast('New game started');
  }, []);

  // Keyboard input
  useKeyboardInput(performMove);

  // Touch/Swipe input
  useSwipeInput(performMove);

  // Cleanup last toast
  useEffect(() => {
    if (!lastActionToast) return;
    const t = setTimeout(() => setLastActionToast(''), 1000);
    return () => clearTimeout(t);
  }, [lastActionToast]);

  return {
    grid,
    score,
    bestScore,
    gameOver,
    won,
    canMoveAny,
    move: performMove,
    newGame,
    lastActionToast,
  };
}
