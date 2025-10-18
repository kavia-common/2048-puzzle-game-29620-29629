import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { addRandomTile, cloneGrid, createEmptyGrid, has2048, move, movesAvailable } from '../utils/gameLogic';
import { getBest, setBest } from '../utils/storage';

/**
 * PUBLIC_INTERFACE
 * Hook encapsulating 2048 game state, input handling, and animation flags.
 */
export function use2048() {
  const [grid, setGrid] = useState(() => {
    let g = createEmptyGrid();
    g = addRandomTile(g).grid;
    g = addRandomTile(g).grid;
    return g;
  });
  const [score, setScore] = useState(0);
  const [best, setBestState] = useState(() => getBest());
  const [won, setWon] = useState(false);
  const [canContinue, setCanContinue] = useState(false);
  const [over, setOver] = useState(false);

  // Animation maps by tile id
  const [spawnAnimations, setSpawnAnimations] = useState({});
  const [mergeAnimations, setMergeAnimations] = useState({});

  // touch controls
  const touchStart = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    if (score > best) {
      setBest(score);
      setBestState(score);
    }
  }, [score, best]);

  const resetAnimations = () => {
    setSpawnAnimations({});
    setMergeAnimations({});
  };

  // PUBLIC_INTERFACE
  const newGame = useCallback(() => {
    resetAnimations();
    let g = createEmptyGrid();
    const sp1 = addRandomTile(g);
    const sp2 = addRandomTile(sp1.grid);
    setGrid(sp2.grid);
    setScore(0);
    setWon(false);
    setCanContinue(false);
    setOver(false);
    setSpawnAnimations({ [sp1.spawnedId]: true, [sp2.spawnedId]: true });
    setMergeAnimations({});
  }, []);

  // PUBLIC_INTERFACE
  const continueGame = useCallback(() => {
    setCanContinue(true);
  }, []);

  const performMove = useCallback((dir) => {
    if (over) return;
    let { grid: movedGrid, scoreDelta, moved, mergeIds } = move(grid, dir);
    if (!moved) return;

    // set merge animations for new merged tiles
    const mergeAnimFlags = {};
    mergeIds.forEach(id => { mergeAnimFlags[id] = true; });
    setMergeAnimations(mergeAnimFlags);

    const afterSpawn = addRandomTile(movedGrid);
    setGrid(afterSpawn.grid);
    setScore(s => s + scoreDelta);

    const spawnFlags = {};
    if (afterSpawn.spawnedId) spawnFlags[afterSpawn.spawnedId] = true;
    setSpawnAnimations(spawnFlags);

    const reached = has2048(afterSpawn.grid);
    if (reached && !won && !canContinue) {
      setWon(true);
    }

    if (!movesAvailable(afterSpawn.grid)) {
      setOver(true);
    }
  }, [grid, over, won, canContinue]);

  // PUBLIC_INTERFACE
  const handleKey = useCallback((e) => {
    const key = e.key;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
      e.preventDefault();
      const map = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
      };
      performMove(map[key]);
    }
  }, [performMove]);

  // Touch handling
  // PUBLIC_INTERFACE
  const handleSwipeStart = useCallback((e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, active: true };
  }, []);
  // PUBLIC_INTERFACE
  const handleSwipeMove = useCallback((e) => {
    // prevent scroll while playing
    if (touchStart.current.active) e.preventDefault();
  }, []);
  // PUBLIC_INTERFACE
  const handleSwipeEnd = useCallback((e) => {
    if (!touchStart.current.active) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current.active = false;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const threshold = 24;
    if (Math.max(absX, absY) < threshold) return;

    if (absX > absY) {
      performMove(dx > 0 ? 'right' : 'left');
    } else {
      performMove(dy > 0 ? 'down' : 'up');
    }
  }, [performMove]);

  // expose memoized grid to avoid unnecessary renders
  const safeGrid = useMemo(() => cloneGrid(grid), [grid]);

  return {
    grid: safeGrid,
    score,
    best,
    won,
    over,
    canContinue,
    newGame,
    continueGame,
    handleKey,
    handleSwipeStart,
    handleSwipeMove,
    handleSwipeEnd,
    spawnAnimations,
    mergeAnimations,
  };
}
