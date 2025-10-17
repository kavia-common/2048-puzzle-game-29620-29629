import React from "react";

/**
 * PUBLIC_INTERFACE
 * ScorePanel
 * Displays the current score and best score as cards in header.
 * Props:
 * - score: number
 * - best: number
 */
function ScorePanel({ score, best }) {
  return (
    <div className="scores" role="group" aria-label="score summary">
      <div className="card" aria-live="polite">
        <div className="label">Score</div>
        <div className="value">{score}</div>
      </div>
      <div className="card" aria-live="polite">
        <div className="label">Best</div>
        <div className="value">{best}</div>
      </div>
    </div>
  );
}

export default ScorePanel;
