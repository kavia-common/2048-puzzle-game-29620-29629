import React from 'react';

// PUBLIC_INTERFACE
export default function Controls({ onMove, disabled }) {
  /** Touch-friendly on-screen controls */
  return (
    <div className="controls" role="group" aria-label="On-screen controls">
      <button className="btn" onClick={() => onMove('up')} disabled={disabled} aria-label="Move up">↑</button>
      <div className="row">
        <button className="btn" onClick={() => onMove('left')} disabled={disabled} aria-label="Move left">←</button>
        <button className="btn" onClick={() => onMove('down')} disabled={disabled} aria-label="Move down">↓</button>
        <button className="btn" onClick={() => onMove('right')} disabled={disabled} aria-label="Move right">→</button>
      </div>
    </div>
  );
}
