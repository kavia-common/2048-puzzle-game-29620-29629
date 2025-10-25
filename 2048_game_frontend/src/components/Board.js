import React from 'react';
import Tile from './Tile';

/**
 * PUBLIC_INTERFACE
 * Board component renders the static background grid and active tiles on top.
 * Wraps grid and tiles in a container to match styling expectations.
 */
function Board({ grid, spawnAnimations, mergeAnimations }) {
  const size = 4;
  const cells = Array.from({ length: size * size });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div className="grid" aria-hidden="true">
        {cells.map((_, i) => (
          <div className="grid-cell" key={i} />
        ))}
      </div>
      <div className="tiles" aria-live="polite">
        {grid.map((row, r) =>
          row.map((cell, c) => {
            if (!cell) return null;
            const key = cell.id;
            const isNew = !!spawnAnimations[key];
            const isMerge = !!mergeAnimations[key];
            return (
              <Tile
                key={key}
                row={r}
                col={c}
                value={cell.value}
                isNew={isNew}
                isMerge={isMerge}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default Board;
