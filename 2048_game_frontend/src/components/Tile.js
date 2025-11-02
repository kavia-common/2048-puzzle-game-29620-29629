import React, { useMemo } from 'react';

/**
 * PUBLIC_INTERFACE
 * Tile component: renders an individual tile with proper position and styles.
 * Positions are calculated to align with a 4x4 grid that has 10px gaps and 10px inset padding.
 */
function Tile({ row, col, value, isNew, isMerge }) {
  // The board uses:
  // - inset: 10px for .tiles
  // - grid gap: 10px between 4 columns/rows (3 gaps)
  // Each tile width = (100% - 3*10px) / 4 in CSS. For top/left percentages, we simulate this layout:
  // Use percentages that align with the grid fractions: positions at 0, 25, 50, 75% minus small compensation for gaps.
  const gapPx = 10;
  const columns = 4;
  const steps = columns - 1; // 3 gaps
  const tileWidthPct = (100 - (steps * (gapPx / (gapPx + 100)) * 100)) / columns; // approximate percent width
  // Simpler and stable approach: position as a fraction of the grid (0, 33.333..., 66.666..., 100%), then subtract normalized gap
  const stepPct = 100 / columns; // 25%
  const adjustPct = (gapPx / (gapPx + 100)) * 100 / columns; // tiny adjustment to mimic gaps

  const leftPct = col * stepPct + (col > 0 ? col * (-adjustPct) : 0);
  const topPct = row * stepPct + (row > 0 ? row * (-adjustPct) : 0);

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
        left: `calc(${leftPct}% )`,
        top: `calc(${topPct}% )`,
        transform: `translate(0,0)`,
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
