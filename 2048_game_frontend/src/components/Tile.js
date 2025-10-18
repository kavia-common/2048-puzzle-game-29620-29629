import React, { useMemo } from 'react';

/**
 * PUBLIC_INTERFACE
 * Tile component: renders an individual tile with proper position and styles.
 */
function Tile({ row, col, value, isNew, isMerge }) {
  const gap = 10; // px
  const sizePct = (100 - (gap * 3)) / 4; // width/height in %
  const x = col * (sizePct + (gap / ((gap * 3 + 100) / 100)));
  const y = row * (sizePct + (gap / ((gap * 3 + 100) / 100)));

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
        left: `calc(${x}% )`,
        top: `calc(${y}% )`,
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
