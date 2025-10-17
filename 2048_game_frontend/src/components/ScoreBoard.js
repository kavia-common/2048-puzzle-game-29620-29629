import React from 'react';

// PUBLIC_INTERFACE
export default function ScoreBoard({ score, bestScore }) {
  /** Display current and best scores. */
  return (
    <div className="scoreboard" role="status" aria-live="polite">
      <div className="score-card">
        <div className="label">Score</div>
        <div className="value">{score}</div>
      </div>
      <div className="score-card best">
        <div className="label">Best</div>
        <div className="value">{bestScore}</div>
      </div>
    </div>
  );
}
