import React, { useMemo } from 'react';

/**
 * PUBLIC_INTERFACE
 * Tile renders a single tile at its grid coordinates with animated movement and merging feedback.
 * @param {{tile: {id:string, value:number, row:number, col:number, merging?:boolean, new?:boolean}}} props
 */
export default function Tile({ tile }) {
  const { id, value, row, col, merging, new: isNew } = tile;

  const colors = useMemo(() => {
    const map = {
      2: { bg: '#dbeafe', fg: '#1e3a8a' },
      4: { bg: '#bfdbfe', fg: '#1e3a8a' },
      8: { bg: '#93c5fd', fg: '#111827' },
      16: { bg: '#60a5fa', fg: 'white' },
      32: { bg: '#3b82f6', fg: 'white' },
      64: { bg: '#2563eb', fg: 'white' },
      128: { bg: '#1d4ed8', fg: 'white' },
      256: { bg: '#0ea5e9', fg: 'white' },
      512: { bg: '#0891b2', fg: 'white' },
      1024:{ bg: '#0d9488', fg: 'white' },
      2048:{ bg: '#F59E0B', fg: '#111827' },
    };
    return map[value] || { bg: '#334155', fg: 'white' };
  }, [value]);

  const style = {
    position: 'absolute',
    top: `calc(${row} * (25% + var(--gap)) + 12px)`,
    left: `calc(${col} * (25% + var(--gap)) + 12px)`,
    width: `calc(25% - var(--gap))`,
    height: `calc(25% - var(--gap))`,
    borderRadius: 10,
    display: 'grid',
    placeItems: 'center',
    fontWeight: 800,
    fontSize: value >= 1024 ? 18 : value >= 128 ? 20 : value >= 16 ? 24 : 28,
    color: colors.fg,
    background: colors.bg,
    transform: 'translateZ(0)', /* create layer for smoother movement */
  };

  const classes = ['tile'];
  if (isNew) classes.push('tile-enter');
  if (merging) classes.push('tile-merge');
  classes.push('tile-move');

  return (
    <div
      className={classes.join(' ')}
      style={style}
      role="gridcell"
      aria-label={`Tile ${value} at row ${row + 1} column ${col + 1}`}
      data-id={id}
    >
      {value}
    </div>
  );
}
