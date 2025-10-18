import React, { useEffect, useRef } from 'react';
import Board from './Board';
import ScoreBar from './ScoreBar';
import { use2048 } from '../hooks/use2048';

/**
 * PUBLIC_INTERFACE
 * Game component: Renders the full 2048 game including header, score, board, overlays and controls.
 */
function Game() {
  const {
    grid,
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
  } = use2048();

  const boardRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => handleKey(e);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleKey]);

  return (
    <div className="game-shell">
      <div className="header">
        <div className="title-group">
          <h1 className="title" aria-label="2048 Game">2048</h1>
          <p className="subtitle">Ocean Professional</p>
        </div>
        <ScoreBar score={score} best={best} onNewGame={newGame} />
      </div>

      <div className="controls-row">
        <div />
        <button className="btn danger" onClick={newGame} aria-label="New Game">New Game</button>
      </div>

      <div className="board-wrap">
        <div
          className="board"
          ref={boardRef}
          onTouchStart={handleSwipeStart}
          onTouchMove={handleSwipeMove}
          onTouchEnd={handleSwipeEnd}
          role="application"
          aria-label="2048 board 4 by 4 grid"
        >
          {(won && !canContinue) && (
            <div className="overlay" aria-live="assertive" aria-label="You Win Overlay">
              <div className="overlay-card">
                <h2 style={{ color: 'var(--success)' }}>You Win!</h2>
                <p>Tile 2048 achieved. Continue or start a new game.</p>
                <div className="overlay-actions">
                  <button className="btn secondary" onClick={continueGame} aria-label="Continue">Continue</button>
                  <button className="btn danger" onClick={newGame} aria-label="New Game">New Game</button>
                </div>
              </div>
            </div>
          )}

          {over && (
            <div className="overlay" aria-live="assertive" aria-label="Game Over Overlay">
              <div className="overlay-card">
                <h2 style={{ color: 'var(--error)' }}>Game Over</h2>
                <p>No more moves available.</p>
                <div className="overlay-actions">
                  <button className="btn danger" onClick={newGame} aria-label="Try Again">New Game</button>
                </div>
              </div>
            </div>
          )}

          <Board
            grid={grid}
            spawnAnimations={spawnAnimations}
            mergeAnimations={mergeAnimations}
          />
        </div>
      </div>

      <div className="footer">
        <p className="hint">Use arrow keys or swipe to move tiles.</p>
      </div>
    </div>
  );
}

export default Game;
