import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Controls renders Restart and Undo buttons and optional directional buttons for accessibility.
 * @param {{onReset:Function, onUndo:Function, canUndo:boolean, onMove: (dir:'up'|'down'|'left'|'right')=>void}} props
 */
export default function Controls({ onReset, onUndo, canUndo, onMove }) {
  return (
    <div className="controls">
      <button className="btn" onClick={() => onMove('up')} aria-label="Move up">↑</button>
      <button className="btn" onClick={() => onMove('left')} aria-label="Move left">←</button>
      <button className="btn" onClick={() => onMove('down')} aria-label="Move down">↓</button>
      <button className="btn" onClick={() => onMove('right')} aria-label="Move right">→</button>
      <button className="btn" onClick={onUndo} disabled={!canUndo} aria-disabled={!canUndo} aria-label="Undo last move">Undo</button>
      <button className="btn" onClick={onReset} aria-label="Restart game">Restart</button>
      <style>
        {`
        .controls {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .btn[disabled], .btn[aria-disabled="true"] {
          opacity: .5;
          cursor: not-allowed;
        }
        `}
      </style>
    </div>
  );
}
