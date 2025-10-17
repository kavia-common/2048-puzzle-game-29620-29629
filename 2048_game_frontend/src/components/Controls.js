import React from "react";

/**
 * PUBLIC_INTERFACE
 * Controls
 * Renders action buttons for New Game and Undo.
 * Props:
 * - onRestart: () => void
 * - onUndo: () => void
 * - isUndoDisabled: boolean
 */
function Controls({ onRestart, onUndo, isUndoDisabled }) {
  return (
    <div className="controls">
      <button type="button" className="btn btn-primary" aria-label="Start a new game" onClick={onRestart}>
        New Game
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        aria-label="Undo last move"
        onClick={onUndo}
        disabled={isUndoDisabled}
      >
        Undo
      </button>
    </div>
  );
}

export default Controls;
