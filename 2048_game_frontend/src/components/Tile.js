import React, { useEffect, useState } from 'react';

const valueClass = (v) => {
  if (v <= 4) return 't-2';
  if (v <= 8) return 't-8';
  if (v <= 16) return 't-16';
  if (v <= 32) return 't-32';
  if (v <= 64) return 't-64';
  if (v <= 128) return 't-128';
  if (v <= 256) return 't-256';
  if (v <= 512) return 't-512';
  if (v <= 1024) return 't-1024';
  return 't-2048';
};

// PUBLIC_INTERFACE
export default function Tile({ value, row, col }) {
  /**
   * Render a tile with value-based styling and spawn animation.
   */
  const [spawn, setSpawn] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSpawn(false), 160);
    return () => clearTimeout(t);
  }, []);

  const style = {
    gridRowStart: row + 1,
    gridColumnStart: col + 1,
  };

  return (
    <div
      className={`tile ${valueClass(value)} ${spawn ? 'spawn' : ''}`}
      style={style}
      role="gridcell"
      aria-label={`Tile ${value}`}
    >
      <span className="tile-number">{value}</span>
    </div>
  );
}
