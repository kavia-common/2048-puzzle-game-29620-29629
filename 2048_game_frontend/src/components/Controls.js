import React from "react";

/**
 * PUBLIC_INTERFACE
 * Controls
 * Renders action buttons for New Game and Undo.
 * Props:
 * - onRestart: () => void
 * - onUndo: () => void
 * - isUndoDisabled: boolean
 * - isAnimating?: boolean (optional, input is currently locked for animations)
 */
function Controls({ onRestart, onUndo, isUndoDisabled, isAnimating = false }) {
  const undoAriaLabel = isUndoDisabled ? "Undo last move (disabled, no moves to undo)" : "Undo last move";
  return (
    <div className="controls" role="group" aria-label="game controls">
      <button
        type="button"
        className="btn btn-primary"
        aria-label="Start a new game"
        onClick={onRestart}
      >
        New Game
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        aria-label={undoAriaLabel}
        onClick={onUndo}
        disabled={isUndoDisabled}
      >
        Undo
      </button>
      <span className="visually-hidden" aria-live="polite" aria-atomic="true">
        {isAnimating ? "Processing move..." : ""}
      </span>
    </div>
  );
}

export default Controls;
