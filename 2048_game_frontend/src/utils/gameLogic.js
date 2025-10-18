/**
 * PUBLIC_INTERFACE
 * createEmptyGrid returns a 2D array representing a 4x4 board with nulls.
 */
export function createEmptyGrid() {
  return Array.from({ length: 4 }, () => Array(4).fill(null));
}

/**
 * PUBLIC_INTERFACE
 * generateId creates a unique-ish id for tiles.
 */
export function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * PUBLIC_INTERFACE
 * getEmptyCells returns a list of [row, col] pairs for empty cells.
 */
export function getEmptyCells(cells) {
  const empty = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    if (!cells[r][c]) empty.push([r, c]);
  }
  return empty;
}

/**
 * PUBLIC_INTERFACE
 * spawnRandomTile mutates the cells adding a value 2 (90%) or 4 (10%) at a random empty position.
 */
export function spawnRandomTile(cells) {
  const empty = getEmptyCells(cells);
  if (empty.length === 0) return null;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  const tile = { id: generateId(), value, row: r, col: c, new: true, merging: false };
  cells[r][c] = tile;
  return tile;
}

/**
 * PUBLIC_INTERFACE
 * canMove checks if any move is possible.
 */
export function canMove(cells) {
  if (getEmptyCells(cells).length > 0) return true;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const v = cells[r][c]?.value;
      if (r < 3 && v === cells[r+1][c]?.value) return true;
      if (c < 3 && v === cells[r][c+1]?.value) return true;
    }
  }
  return false;
}

/**
 * PUBLIC_INTERFACE
 * cloneCells deep-clones grid tiles to avoid mutation leakage.
 */
export function cloneCells(cells) {
  return cells.map(row => row.map(t => t ? { ...t } : null));
}

/**
 * PUBLIC_INTERFACE
 * compressAndMerge compresses a 1D array of tiles towards the start, merging equals once per move.
 * Returns { row, gained, mergedIds }.
 */
export function compressAndMerge(row) {
  const filtered = row.filter(Boolean);
  const result = [];
  let gained = 0;
  const mergedIds = new Set();
  for (let i = 0; i < filtered.length; i++) {
    const current = { ...filtered[i] };
    const next = filtered[i + 1] ? { ...filtered[i + 1] } : null;
    if (next && current.value === next.value) {
      const mergedValue = current.value * 2;
      const merged = {
        id: generateId(),
        value: mergedValue,
        row: 0,
        col: 0,
        merging: true,
      };
      result.push(merged);
      mergedIds.add(current.id);
      mergedIds.add(next.id);
      gained += mergedValue;
      i++; // skip next
    } else {
      result.push(current);
    }
  }
  while (result.length < 4) result.push(null);
  return { row: result, gained, mergedIds };
}

/**
 * PUBLIC_INTERFACE
 * moveGrid applies move in a direction and returns { cells, moved, scoreGain }.
 */
export function moveGrid(cells, direction) {
  let moved = false;
  let scoreGain = 0;
  const newCells = createEmptyGrid();

  const getLine = (i) => {
    switch (direction) {
      case 'left': return cells[i];
      case 'right': return [...cells[i]].reverse();
      case 'up': return [cells[0][i], cells[1][i], cells[2][i], cells[3][i]];
      case 'down': return [cells[3][i], cells[2][i], cells[1][i], cells[0][i]];
      default: return [];
    }
  };

  const setLine = (i, line) => {
    switch (direction) {
      case 'left':
        for (let c = 0; c < 4; c++) {
          if (line[c]) { line[c].row = i; line[c].col = c; }
          newCells[i][c] = line[c] ? { ...line[c], new: false } : null;
        }
        break;
      case 'right':
        for (let c = 0; c < 4; c++) {
          const data = line[3 - c];
          if (data) { data.row = i; data.col = c; }
          newCells[i][c] = data ? { ...data, new: false } : null;
        }
        break;
      case 'up':
        for (let r = 0; r < 4; r++) {
          if (line[r]) { line[r].row = r; line[r].col = i; }
          newCells[r][i] = line[r] ? { ...line[r], new: false } : null;
        }
        break;
      case 'down':
        for (let r = 0; r < 4; r++) {
          const data = line[3 - r];
          if (data) { data.row = r; data.col = i; }
          newCells[r][i] = data ? { ...data, new: false } : null;
        }
        break;
      default:
        break;
    }
  };

  for (let i = 0; i < 4; i++) {
    const input = getLine(i);
    const { row: mergedRow, gained } = compressAndMerge(input);
    scoreGain += gained;
    // did anything move?
    for (let j = 0; j < 4; j++) {
      if ((input[j]?.id || null) !== (mergedRow[j]?.id || null)) {
        moved = true;
      }
    }
    setLine(i, mergedRow);
  }

  return { cells: newCells, moved, scoreGain };
}

/**
 * PUBLIC_INTERFACE
 * gridToTiles flattens a cells grid into a tile list for rendering.
 */
export function gridToTiles(cells) {
  const tiles = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    const t = cells[r][c];
    if (t) tiles.push({ ...t });
  }
  return tiles;
}
