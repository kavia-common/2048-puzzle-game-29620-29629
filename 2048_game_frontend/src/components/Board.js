import React from 'react';
import Tile from './Tile';
import { useKeyboardInput } from '../utils/input';

// PUBLIC_INTERFACE
export default function Board({ grid, onMove, ariaLabel = 'Game board' }) {
  /** Render 4x4 board with tiles. */
  useKeyboardInput(onMove);

  return (
    <div
      className="board"
      role="grid"
      aria-label={ariaLabel}
      aria-rowcount={4}
      aria-colcount={4}
    >
      {/* Background cells */}
      <div className="grid-bg">
        {Array.from({ length: 16 }).map((_, i) => (
          <div className="grid-cell" key={`bg-${i}`} aria-hidden="true" />
        ))}
      </div>

      {/* Tiles */}
      <div className="tiles-layer">
        {grid.map((row, r) =>
          row.map((value, c) =>
            value ? (
              <Tile key={`${r}-${c}-${value}`} value={value} row={r} col={c} />
            ) : null
          )
        )}
      </div>
    </div>
  );
}
