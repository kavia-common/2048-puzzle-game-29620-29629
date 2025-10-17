import React from 'react';
import './App.css';
import './styles/theme.css';
import './styles/board.css';
import './styles/animations.css';
import { useGame } from './game/useGame';
import Header from './components/Header';
import ScoreBoard from './components/ScoreBoard';
import Board from './components/Board';
import Controls from './components/Controls';
import Toast from './components/Toast';

// PUBLIC_INTERFACE
function App() {
  /**
   * Root application for 2048 game UI.
   * Provides Ocean Professional theme styling, keyboard/swipe input, and responsive layout.
   */
  const {
    grid,
    score,
    bestScore,
    gameOver,
    won,
    move,
    newGame,
    canMoveAny,
    lastActionToast,
  } = useGame();

  return (
    <div className="app-root" role="application" aria-label="2048 puzzle game">
      <div className="app-container">
        <Header />
        <div className="top-bar">
          <ScoreBoard score={score} bestScore={bestScore} />
          <div className="actions">
            <button
              className="btn primary"
              onClick={newGame}
              aria-label="Start a new game"
            >
              New Game
            </button>
          </div>
        </div>

        <Board grid={grid} onMove={move} ariaLabel="2048 game board" />

        <Controls onMove={move} disabled={!canMoveAny && !won} />

        <div className="helper-text" aria-live="polite">
          Use arrow keys or swipe to move tiles. Combine tiles with same numbers to reach 2048!
        </div>

        <Toast
          open={!!lastActionToast}
          type={won ? 'success' : gameOver ? 'error' : 'info'}
          message={
            won
              ? 'You reached 2048! Continue playing to increase your score.'
              : gameOver
              ? 'No more moves. Game over!'
              : lastActionToast || ''
          }
        />
      </div>
    </div>
  );
}

export default App;
