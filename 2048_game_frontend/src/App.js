import React, { useEffect, useRef } from 'react';
import './App.css';
import './utils/animations.css';
import Board from './components/Board';
import ScoreBoard from './components/ScoreBoard';
import Controls from './components/Controls';
import { use2048 } from './hooks/use2048';

/**
 * PUBLIC_INTERFACE
 * App is the main entry for the 2048 game UI. It wires the board, score, controls, and accessibility.
 * Keyboard: The Board listens globally for Arrow/WASD, and the App region remains focusable for screen readers.
 */
function App() {
  const {
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
  } = use2048();

  const appRef = useRef(null);

  useEffect(() => {
    // Focus the app region initially for keyboard announcements
    if (appRef.current) {
      appRef.current.focus();
    }
  }, []);

  return (
    <div
      className="App ocean-theme"
      role="application"
      aria-label="2048 Game"
      ref={appRef}
      tabIndex={-1}
    >
      <header className="header">
        <div className="brand">
          <div className="title">
            <span className="logo">2048</span>
            <span className="subtitle">Ocean Professional</span>
          </div>
        </div>

        <ScoreBoard score={score} best={best} hasWon={hasWon} isGameOver={isGameOver} />

        <div className="header-actions">
          <button
            className="btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <Controls
            onReset={reset}
            onUndo={undo}
            canUndo={canUndo}
            onMove={move}
          />
        </div>
      </header>

      <main className="main">
        <Board
          grid={grid}
          onMove={move}
          hasWon={hasWon}
          isGameOver={isGameOver}
          setBoardRef={setBoardRef}
        />
        <div className="helper">
          <p className="hint">
            Use arrow keys or WASD. On touch devices, swipe to move tiles.
          </p>
        </div>
      </main>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </div>

      <footer className="footer">
        <small>Built with React – No external dependencies.</small>
      </footer>
    </div>
  );
}

export default App;
