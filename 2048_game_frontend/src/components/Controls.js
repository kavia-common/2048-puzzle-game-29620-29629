import React from "react";

/**
 * PUBLIC_INTERFACE
 * Controls
 * Renders action buttons for New Game and Undo, plus compact settings.
 * Props:
 * - onRestart: () => void
 * - onUndo: () => void
 * - isUndoDisabled: boolean
 * - isAnimating?: boolean (optional, input is currently locked for animations)
 * - settings: { undoDepth:number, animationsEnabled:boolean, highContrastTiles:boolean }
 * - onChangeUndoDepth: (n:number) => void
 * - onToggleAnimations: (enabled:boolean) => void
 * - onToggleHighContrast: (enabled:boolean) => void
 */
function Controls({
  onRestart,
  onUndo,
  isUndoDisabled,
  isAnimating = false,
  settings = { undoDepth: 1, animationsEnabled: true, highContrastTiles: false },
  onChangeUndoDepth,
  onToggleAnimations,
  onToggleHighContrast,
}) {
  const undoAriaLabel = isUndoDisabled ? "Undo last move (disabled, no moves to undo)" : "Undo last move";
  return (
    <div className="controls" role="group" aria-label="game controls and settings">
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

      {/* Compact settings */}
      <div className="settings" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }} aria-label="settings">
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Undo depth</span>
          <select
            aria-label="Set undo depth"
            value={settings.undoDepth}
            onChange={(e) => onChangeUndoDepth && onChangeUndoDepth(Math.min(5, Math.max(1, Number(e.target.value))))}
            style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(17,24,39,0.15)", background: "var(--color-surface)" }}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={settings.animationsEnabled}
            onChange={(e) => onToggleAnimations && onToggleAnimations(e.target.checked)}
            aria-label="Toggle animations"
          />
          <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Animations</span>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={settings.highContrastTiles}
            onChange={(e) => onToggleHighContrast && onToggleHighContrast(e.target.checked)}
            aria-label="Toggle high-contrast tiles"
          />
          <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>High-contrast</span>
        </label>
      </div>

      <span className="visually-hidden" aria-live="polite" aria-atomic="true">
        {isAnimating ? "Processing move..." : ""}
      </span>
    </div>
  );
}

export default Controls;
