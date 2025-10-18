import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ScoreBoard displays current score and best score.
 * @param {{score:number, best:number, hasWon:boolean, isGameOver:boolean}} props
 */
export default function ScoreBoard({ score, best }) {
  return (
    <div className="scores">
      <div className="score-card" aria-label={`Score ${score}`}>
        <div className="label">Score</div>
        <div className="value">{score}</div>
      </div>
      <div className="score-card" aria-label={`Best ${best}`}>
        <div className="label">Best</div>
        <div className="value">{best}</div>
      </div>
      <style>
        {`
        .scores {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .score-card {
          background: var(--surface);
          border: 1px solid rgba(0,0,0,0.08);
          padding: 8px 12px;
          border-radius: 12px;
          box-shadow: var(--shadow);
          min-width: 96px;
          text-align: center;
        }
        .score-card .label {
          color: var(--muted);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .score-card .value {
          color: var(--text);
          font-weight: 900;
          font-size: 22px;
        }
        `}
      </style>
    </div>
  );
}
