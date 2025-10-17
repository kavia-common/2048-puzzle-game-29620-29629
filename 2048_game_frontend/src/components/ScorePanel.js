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
      <div className="card" aria-live="polite" aria-atomic="true">
        <div className="label" id="score-label">Score</div>
        <div className="value" aria-labelledby="score-label">{score}</div>
      </div>
      <div className="card" aria-live="polite" aria-atomic="true">
        <div className="label" id="best-label">Best</div>
        <div className="value" aria-labelledby="best-label">{best}</div>
      </div>
    </div>
  );
}

export default ScorePanel;
