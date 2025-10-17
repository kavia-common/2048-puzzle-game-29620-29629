import React, { forwardRef, useMemo } from "react";
import Tile from "./Tile";

/**
 * PUBLIC_INTERFACE
 * Board
 * Renders the 4x4 board background grid and the positioned tiles. Also shows
 * game over and game won overlays.
 * Props:
 * - board: number[][]
 * - lastSpawn: {position:{row,col}, value:number} | null
 * - gameOver: boolean
 * - gameWon: boolean
 * - maxTile: number
 */
const Board = forwardRef(function Board({ board, lastSpawn, gameOver, gameWon, maxTile, animationsEnabled = true, highContrast = false }, ref) {
  const size = board.length;

  const cells = useMemo(() => {
    const items = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        items.push({ key: `cell-${r}-${c}` });
      }
    }
    return items;
  }, [size]);

  // Flatten tiles with spawn flag
  const tiles = useMemo(() => {
    const items = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const v = board[r][c];
        if (v !== 0) {
          const isNew =
            !!lastSpawn &&
            lastSpawn.position &&
            lastSpawn.position.row === r &&
            lastSpawn.position.col === c &&
            lastSpawn.value === v;
          items.push({ row: r, col: c, value: v, isNew });
        }
      }
    }
    return items;
  }, [board, size, lastSpawn]);

  return (
    <div className={`board${highContrast ? " hc" : ""}`} ref={ref} role="application" aria-label="2048 board">
      {/* Background placeholder grid */}
      <div className="board-placeholder-grid" aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
        {cells.map((c) => (
          <div className="board-placeholder-cell" key={c.key} />
        ))}
      </div>

      {/* Tiles layer (absolute container) */}
      <div className="tiles-layer" aria-live="polite">
        {tiles.map((t) => (
          <Tile
            key={`tile-${t.row}-${t.col}-${t.value}`}
            row={t.row}
            col={t.col}
            value={t.value}
            isNew={t.isNew}
            highContrast={highContrast}
            animationsEnabled={animationsEnabled}
          />
        ))}
      </div>

      {/* Overlay banners */}
      {gameOver && !gameWon && (
        <div className="board__overlay board__overlay--lose" role="alert" style={{ fontSize: 28 }}>
          Game Over
        </div>
      )}
      {gameWon && (
        <div className="board__overlay board__overlay--win" role="status" style={{ fontSize: 26 }}>
          You made {maxTile}!
        </div>
      )}
    </div>
  );
});

export default Board;
