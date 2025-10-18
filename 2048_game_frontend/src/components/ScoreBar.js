import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Score bar showing current score and best score, with a New Game button.
 */
function ScoreBar({ score, best, onNewGame }) {
  return (
    <div className="scorebar" role="region" aria-label="Score Bar">
      <div className="score-card" aria-label="Current Score">
        <div className="label">Score</div>
        <div className="value" data-testid="score-value">{score}</div>
      </div>
      <div className="score-card" aria-label="Best Score">
        <div className="label">Best</div>
        <div className="value" data-testid="best-value">{best}</div>
      </div>
      <button className="btn" onClick={onNewGame} aria-label="New Game">New Game</button>
    </div>
  );
}

export default ScoreBar;
