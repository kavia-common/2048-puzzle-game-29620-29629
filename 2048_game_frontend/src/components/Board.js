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
const Board = forwardRef(function Board({ board, lastSpawn, gameOver, gameWon, maxTile }, ref) {
  const cells = useMemo(() => {
    const items = [];
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        items.push({ key: `cell-${r}-${c}` });
      }
    }
    return items;
  }, [board]);

  const tiles = useMemo(() => {
    const items = [];
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
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
  }, [board, lastSpawn]);

  return (
    <div className="board" ref={ref} role="application" aria-label="2048 board" style={{ position: "relative", overflow: "hidden" }}>
      {/* Background placeholder grid */}
      <div className="board-placeholder-grid" aria-hidden="true" style={{ position: "absolute", inset: 0, padding: 16 }}>
        {cells.map((c) => (
          <div className="board-placeholder-cell" key={c.key} />
        ))}
      </div>

      {/* Tiles layer */}
      <div
        className="tiles-layer"
        aria-live="polite"
        style={{
          position: "absolute",
          inset: 0,
          padding: 16,
          display: "grid",
          gap: "10px",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
        }}
      >
        {tiles.map((t, idx) => (
          <Tile key={`tile-${t.row}-${t.col}-${t.value}-${idx}`} row={t.row} col={t.col} value={t.value} isNew={t.isNew} />
        ))}
      </div>

      {/* Overlay banners */}
      {gameOver && !gameWon && (
        <div
          role="alert"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(17,24,39,0.6)",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: "-0.02em",
          }}
        >
          Game Over
        </div>
      )}
      {gameWon && (
        <div
          role="status"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(245, 158, 11, 0.16)",
            display: "grid",
            placeItems: "center",
            color: "#111827",
            fontWeight: 800,
            fontSize: 26,
            letterSpacing: "-0.02em",
          }}
        >
          You made {maxTile}!
        </div>
      )}
    </div>
  );
});

export default Board;
