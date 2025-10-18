import React, { useEffect, useRef } from 'react';
import Tile from './Tile';

/**
 * PUBLIC_INTERFACE
 * Board renders the 4x4 grid and all tiles. It also wires input handlers (keyboard and touch).
 * - Keyboard: Arrow keys and WASD are supported. We listen on window to avoid focus traps and
 *   call preventDefault() to stop page scrolling when handling arrows.
 * - Touch: Swipe gestures move tiles.
 * @param {{grid: import('../hooks/use2048').GridState, onMove: Function, hasWon: boolean, isGameOver: boolean, setBoardRef: Function}} props
 */
export default function Board({ grid, onMove, hasWon, isGameOver, setBoardRef }) {
  const boardRef = useRef(null);
  const touchStart = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    if (boardRef.current) {
      setBoardRef(boardRef.current);
      // Proactively focus the board to make it keyboard accessible when mounted
      // This helps screen reader and ensures immediate key interactions.
      boardRef.current.focus();
    }
  }, [setBoardRef]);

  useEffect(() => {
    // Map keys to directions using standardized KeyboardEvent.key values.
    const keyToDir = (key) => {
      switch (key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          return 'up';
        case 'ArrowDown':
        case 's':
        case 'S':
          return 'down';
        case 'ArrowLeft':
        case 'a':
        case 'A':
          return 'left';
        case 'ArrowRight':
        case 'd':
        case 'D':
          return 'right';
        default:
          return null;
      }
    };

    const handleKeyDown = (e) => {
      const dir = keyToDir(e.key);
      if (!dir) return;
      // Prevent browser from scrolling the page on arrow keys
      e.preventDefault();
      onMove(dir);
    };

    // Attach to window to ensure reliability even if focus leaves the board temporarily.
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { passive: false });
    };
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
        // Keep focusable to support keyboard and accessibility
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
          <div
            className="overlay"
            role="dialog"
            aria-modal="true"
            aria-live="assertive"
            aria-label={hasWon ? 'You win!' : 'Game over'}
          >
            <div className="overlay-card" tabIndex={-1}>
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
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(2px);
          display: grid;
          place-items: center;
          border-radius: 12px;
          z-index: 5;
          pointer-events: all; /* block interactions behind overlay */
        }
        .board .tile {
          z-index: 1;
        }
        .overlay-card {
          background: var(--surface);
          color: var(--text);
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: var(--shadow);
          padding: 20px 24px;
          border-radius: 12px;
          text-align: center;
          max-width: 80%;
        }
        .overlay-title {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 8px;
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
