import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DIRECTIONS, DEFAULT_SIZE, INITIAL_TILES, SPAWN_CHANCE_4, KEY_TO_DIRECTION, makeEmptyBoard, cloneBoard } from "../game/constants";
import { move } from "../game/move";
import { canMergeOrMove, getMaxTile, spawnRandomTile } from "../game/board";
import { getBestScore, setBestScore, getLastState, setLastState, clearLastState, getPreferences, setPreferences } from "../game/storage";
import Board from "./Board";
import ScorePanel from "./ScorePanel";
import Controls from "./Controls";
import useEventListener from "../hooks/useEventListener";
import useSwipe from "../hooks/useSwipe";
import "../App.css";

/**
 * PUBLIC_INTERFACE
 * Game
 * The main game container component. Manages game state (board, score, best, history),
 * handles inputs (keyboard and swipe), and renders the board and UI controls.
 */
function Game() {
  // Core state
  const [board, setBoard] = useState(() => makeEmptyBoard(DEFAULT_SIZE));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => getBestScore());
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [history, setHistory] = useState([]); // stack of {board, score}

  // Accessibility/live regions
  const [statusMessage, setStatusMessage] = useState("Game ready.");
  const [lastAction, setLastAction] = useState("");

  // for batching spawn animation position/value (optional usage)
  const lastSpawnRef = useRef(null);
  const hasInitializedRef = useRef(false);

  // Preferences
  const [settings, setSettings] = useState(() => getPreferences());
  // Input debounce/animation lock to avoid overlapping moves
  const isAnimatingRef = useRef(false);
  // Estimated animation time (CSS movement + spawn pulse)
  const ANIMATION_LOCK_MS = settings.animationsEnabled ? 180 : 0; // keep in sync with CSS vars

  // Initialize game: try to restore last state, else new game
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    const restored = getLastState();
    if (restored && Array.isArray(restored.board) && restored.board.length === DEFAULT_SIZE) {
      setBoard(restored.board);
      setScore(restored.score || 0);
      setGameOver(!canMergeOrMove(restored.board));
      const won = getMaxTile(restored.board) >= 2048;
      setGameWon(won);
      setStatusMessage(won ? "You have a winning board. Continue playing!" : "Game restored.");
    } else {
      handleRestart(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist preferences and trim history if undo depth shrinks
  useEffect(() => {
    setPreferences(settings);
    setHistory((h) => {
      const depth = Math.min(5, Math.max(1, Number(settings.undoDepth || 1)));
      if (h.length <= depth) return h;
      // Keep the most recent "depth" items
      return h.slice(h.length - depth);
    });
  }, [settings]);

  // Persist best score
  useEffect(() => {
    if (score > best) {
      setBest(score);
      setBestScore(score);
    }
  }, [score, best]);

  // Persist last state
  useEffect(() => {
    setLastState({ board, score });
  }, [board, score]);

  const pushHistory = useCallback((prevBoard, prevScore) => {
    setHistory((h) => {
      const depth = Math.min(5, Math.max(1, Number(settings.undoDepth || 1)));
      const next = h.slice(-Math.max(0, depth - 1)); // keep last depth-1, then add new to make depth
      next.push({ board: prevBoard, score: prevScore });
      return next;
    });
  }, [settings.undoDepth]);

  // PUBLIC_INTERFACE
  const handleRestart = useCallback((clearSaved = true) => {
    let b = makeEmptyBoard(DEFAULT_SIZE);
    // spawn INITIAL_TILES
    for (let i = 0; i < INITIAL_TILES; i++) {
      const res = spawnRandomTile(b, SPAWN_CHANCE_4);
      b = res.board;
      lastSpawnRef.current = { position: res.position, value: res.value };
    }
    setHistory([]);
    setScore(0);
    setBoard(b);
    setGameOver(false);
    setGameWon(false);
    setStatusMessage("New game. Good luck!");
    setLastAction("New game started");
    if (clearSaved) {
      clearLastState();
      setLastState({ board: b, score: 0 });
    }
  }, []);

  const releaseLockSoon = useCallback(() => {
    // Release move lock after estimated animation completes; immediate if animations disabled
    if (!settings.animationsEnabled) {
      isAnimatingRef.current = false;
      return;
    }
    window.setTimeout(() => {
      isAnimatingRef.current = false;
    }, ANIMATION_LOCK_MS);
  }, [ANIMATION_LOCK_MS, settings.animationsEnabled]);

  const afterMoveHousekeeping = useCallback(
    (nextBoard, gained) => {
      // Spawn random tile after a valid move
      const spawned = spawnRandomTile(nextBoard, SPAWN_CHANCE_4);
      lastSpawnRef.current = { position: spawned.position, value: spawned.value };
      const b2 = spawned.board;

      setBoard(b2);
      setScore((s) => s + gained);

      // Check win/over
      const max = getMaxTile(b2);
      if (max >= 2048 && !gameWon) {
        setGameWon(true);
        setStatusMessage(`You made ${max}!`);
        setLastAction(`Reached ${max}`);
      } else if (!canMergeOrMove(b2)) {
        setGameOver(true);
        setStatusMessage("No more moves. Game over.");
        setLastAction("Game over");
      } else if (gained > 0) {
        setStatusMessage(`Nice! +${gained} points`);
        setLastAction(`Merged for ${gained}`);
      } else {
        setStatusMessage("Tile moved.");
        setLastAction("Move complete");
      }

      releaseLockSoon();
    },
    [gameWon, releaseLockSoon]
  );

  // PUBLIC_INTERFACE
  const handleMove = useCallback(
    (direction) => {
      if (gameOver) return;
      if (settings.animationsEnabled && isAnimatingRef.current) return; // debounce during animation
      if (!Object.values(DIRECTIONS).includes(direction)) return;

      const prevBoard = cloneBoard(board);
      const prevScore = score;

      const { board: movedBoard, scoreGained, moved } = move(direction, board);
      if (!moved) {
        setLastAction("No move");
        setStatusMessage("No tiles moved.");
        return; // no-op move
      }
      // Engage lock until animations complete (if enabled)
      if (settings.animationsEnabled) {
        isAnimatingRef.current = true;
      }

      // Save history for undo
      pushHistory(prevBoard, prevScore);

      // After valid move, spawn tile and update state
      afterMoveHousekeeping(movedBoard, scoreGained);
    },
    [board, score, gameOver, pushHistory, afterMoveHousekeeping]
  );

  // PUBLIC_INTERFACE
  const handleUndo = useCallback(() => {
    // Allow undo even if animating; it resets board and cancels lock quickly
    isAnimatingRef.current = false;
    setHistory((h) => {
      if (h.length === 0) return h;
      const last = h[h.length - 1];
      setBoard(last.board);
      setScore(last.score);
      setGameOver(false);
      const won = getMaxTile(last.board) >= 2048;
      setGameWon(won);
      lastSpawnRef.current = null;
      setStatusMessage("Undid last move.");
      setLastAction("Undo");
      return h.slice(0, -1);
    });
  }, []);

  // Keyboard controls (Arrows + WASD)
  const onKeyDown = useCallback(
    (e) => {
      const key = e.key;
      let dir = KEY_TO_DIRECTION[key];
      if (!dir) {
        // WASD mapping
        if (key === "w" || key === "W") dir = DIRECTIONS.UP;
        else if (key === "a" || key === "A") dir = DIRECTIONS.LEFT;
        else if (key === "s" || key === "S") dir = DIRECTIONS.DOWN;
        else if (key === "d" || key === "D") dir = DIRECTIONS.RIGHT;
      }
      if (dir) {
        e.preventDefault();
        handleMove(dir);
      }
    },
    [handleMove]
  );

  useEventListener("keydown", onKeyDown, window);

  // Swipe handlers (touch devices)
  const { ref: swipeRef } = useSwipe({
    onSwipe: (dir) => {
      handleMove(dir);
    },
    threshold: 24,
  });

  const maxTile = useMemo(() => getMaxTile(board), [board]);

  return (
    <div className="app-wrapper">
      <main className="container">
        <header className="header">
          <div className="brand">
            <h1 className="title">
              2048 <span className="title-accent">Ocean</span>
            </h1>
            <span className="subtitle">Professional Edition</span>
          </div>
          <ScorePanel score={score} best={best} />
        </header>

        {/* Live regions for screen readers */}
        <div className="visually-hidden" aria-live="polite" aria-atomic="true">
          {`Score ${score}. Best ${best}. ${statusMessage}`}
        </div>
        <div className="visually-hidden" aria-live="assertive" aria-atomic="true">
          {gameOver ? "Game over." : gameWon ? `You made ${maxTile}!` : lastAction}
        </div>

        <section className="board-wrap" aria-label="game board">
          <Board
            ref={swipeRef}
            board={board}
            lastSpawn={lastSpawnRef.current}
            gameOver={gameOver}
            gameWon={gameWon}
            maxTile={maxTile}
            animationsEnabled={settings.animationsEnabled}
            highContrast={settings.highContrastTiles}
          />
          <Controls
            onRestart={() => handleRestart()}
            onUndo={handleUndo}
            isUndoDisabled={history.length === 0}
            isAnimating={settings.animationsEnabled ? isAnimatingRef.current : false}
            settings={settings}
            onChangeUndoDepth={(n) => setSettings((s) => ({ ...s, undoDepth: Math.min(5, Math.max(1, n)) }))}
            onToggleAnimations={(enabled) => setSettings((s) => ({ ...s, animationsEnabled: !!enabled }))}
            onToggleHighContrast={(enabled) => setSettings((s) => ({ ...s, highContrastTiles: !!enabled }))}
          />
        </section>

        <footer className="footer">
          Built with the Ocean Professional theme. Use arrows/WASD or swipe to play.
        </footer>
      </main>
    </div>
  );
}

export default Game;
