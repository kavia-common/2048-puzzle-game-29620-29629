import React, { useMemo } from 'react';

/**
 * PUBLIC_INTERFACE
 * Tile component: renders an individual tile with proper position and styles.
 */
function Tile({ row, col, value, isNew, isMerge }) {
  // The .board has padding:10px and the .grid uses gap:10px with 4 columns.
  // Each tile width = (100% - 3*gap) / 4. Position offset per step = tileWidth + gap.
  const gapPx = 10;
  const totalGaps = 3 * gapPx;
  const tileWidthPct = (100 - totalGaps * 100 / (gapPx * 3 + 100)) / 4; // Normalize based on CSS gap math
  // Simpler robust calculation using CSS calc composition:
  const left = `calc(${col} * ( (100% - 30px)/4 + 10px ))`;
  const top = `calc(${row} * ( (100% - 30px)/4 + 10px ))`;

  // Map value to background color
  const bg = useMemo(() => {
    const map = {
      2: 'var(--tile-2)',
      4: 'var(--tile-4)',
      8: 'var(--tile-8)',
      16: 'var(--tile-16)',
      32: 'var(--tile-32)',
      64: 'var(--tile-64)',
      128: 'var(--tile-128)',
      256: 'var(--tile-256)',
      512: 'var(--tile-512)',
      1024: 'var(--tile-1024)',
      2048: 'var(--tile-2048)',
    };
    return map[value] || 'var(--tile-2048)';
  }, [value]);

  const fontSize = value >= 1024 ? '26px' : value >= 128 ? '30px' : '34px';

  const classNames = ['tile'];
  if (isNew) classNames.push('new');
  if (isMerge) classNames.push('merge');

  return (
    <div
      className={classNames.join(' ')}
      style={{
        background: bg,
        left,
        top,
        transform: 'translate(0,0)',
        fontSize,
      }}
      aria-label={`Tile ${value}`}
      role="img"
    >
      {value}
    </div>
  );
}

export default Tile;
