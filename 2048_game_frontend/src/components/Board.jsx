import React, { useEffect, useRef } from 'react';
import Tile from './Tile';

/**
 * PUBLIC_INTERFACE
 * Board renders the 4x4 grid and all tiles. It also wires input handlers (keyboard and touch).
 * @param {{grid: import('../hooks/use2048').GridState, onMove: Function, hasWon: boolean, isGameOver: boolean, setBoardRef: Function}} props
 */
export default function Board({ grid, onMove, hasWon, isGameOver, setBoardRef }) {
  const boardRef = useRef(null);
  const touchStart = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    if (boardRef.current) {
      setBoardRef(boardRef.current);
    }
  }, [setBoardRef]);

  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key.toLowerCase();
      if (['arrowup', 'w'].includes(key)) { e.preventDefault(); onMove('up'); }
      else if (['arrowdown', 's'].includes(key)) { e.preventDefault(); onMove('down'); }
      else if (['arrowleft', 'a'].includes(key)) { e.preventDefault(); onMove('left'); }
      else if (['arrowright', 'd'].includes(key)) { e.preventDefault(); onMove('right'); }
    };
    const node = boardRef.current;
    node && node.addEventListener('keydown', handleKey);
    return () => node && node.removeEventListener('keydown', handleKey);
  }, [onMove]);

  const onTouchStart = (e) => {
    const t = e.changedTouches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  };
  const onTouchEnd = (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    const min = 24;
    if (Math.max(adx, ady) < min) return;
    if (adx > ady) {
      onMove(dx > 0 ? 'right' : 'left');
    } else {
      onMove(dy > 0 ? 'down' : 'up');
    }
  };

  return (
    <section className="board-wrapper">
      <div
        className="board"
        role="grid"
        aria-label="2048 grid"
        aria-rowcount={4}
        aria-colcount={4}
        tabIndex={0}
        ref={boardRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Background cells */}
        {Array.from({ length: 16 }).map((_, i) => (
          <div className="cell" role="gridcell" aria-selected="false" key={`cell-${i}`} />
        ))}

        {/* Tiles */}
        {grid.tiles.map(tile => (
          <Tile key={tile.id} tile={tile} />
        ))}

        {(hasWon || isGameOver) && (
          <div className="overlay" role="dialog" aria-live="polite" aria-label={hasWon ? 'You win!' : 'Game over'}>
            <div className="overlay-card">
              <div className="overlay-title">{hasWon ? 'You win! 🎉' : 'Game Over 💥'}</div>
              <div className="overlay-subtitle">Press Restart to play again</div>
            </div>
          </div>
        )}
      </div>
      <style>
        {`
        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(2px);
          display: grid;
          place-items: center;
          border-radius: 12px;
        }
        .overlay-card {
          background: var(--surface);
          color: var(--text);
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: var(--shadow);
          padding: 16px 20px;
          border-radius: 12px;
          text-align: center;
        }
        .overlay-title {
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 6px;
          color: var(--primary);
        }
        .overlay-subtitle {
          color: var(--muted);
          font-weight: 600;
        }
        `}
      </style>
    </section>
  );
}
