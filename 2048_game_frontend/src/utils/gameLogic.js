let nextId = 1;

/**
 * Creates an empty 4x4 grid.
 */
export function createEmptyGrid() {
  return Array.from({ length: 4 }, () => Array(4).fill(null));
}

/**
 * Deep clone a grid.
 */
export function cloneGrid(grid) {
  return grid.map(row => row.map(cell => (cell ? { ...cell } : null)));
}

/**
 * Add a new random tile (2 with 90%, 4 with 10%). Returns {grid, spawnedId}
 */
export function addRandomTile(grid) {
  const empty = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (!grid[r][c]) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return { grid, spawnedId: null };

  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  const id = nextId++;
  const newGrid = cloneGrid(grid);
  newGrid[r][c] = { id, value, mergedFrom: null };
  return { grid: newGrid, spawnedId: id };
}

/**
 * Check if any move is possible.
 */
export function movesAvailable(grid) {
  // empty cell available
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (!grid[r][c]) return true;
    }
  }
  // check merges
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = grid[r][c];
      if (!cell) continue;
      const right = c < 3 ? grid[r][c + 1] : null;
      const down = r < 3 ? grid[r + 1][c] : null;
      if ((right && right.value === cell.value) || (down && down.value === cell.value)) return true;
    }
  }
  return false;
}

/**
 * Determine if the grid has a 2048 tile.
 */
export function has2048(grid) {
  return grid.some(row => row.some(cell => cell && cell.value >= 2048));
}

/**
 * Move logic for one direction. Directions: 'left','right','up','down'
 * Returns { grid, scoreDelta, moved, mergeIds }
 */
export function move(grid, direction) {
  const size = 4;
  let scoreDelta = 0;
  const newGrid = createEmptyGrid();
  const mergeIds = [];

  const get = (r, c) => grid[r][c];
  const set = (r, c, cell) => { newGrid[r][c] = cell ? { ...cell, mergedFrom: null } : null; };

  const traverse = (callback) => {
    if (direction === 'left') {
      for (let r = 0; r < size; r++) {
        callback(r, 0, 1, 'row');
      }
    } else if (direction === 'right') {
      for (let r = 0; r < size; r++) {
        callback(r, size - 1, -1, 'row');
      }
    } else if (direction === 'up') {
      for (let c = 0; c < size; c++) {
        callback(0, c, 1, 'col');
      }
    } else if (direction === 'down') {
      for (let c = 0; c < size; c++) {
        callback(size - 1, c, -1, 'col');
      }
    }
  };

  let moved = false;

  traverse((startR, startC, step, mode) => {
    const line = [];
    if (mode === 'row') {
      for (let c = 0; c < size; c++) {
        const col = direction === 'left' ? c : size - 1 - c;
        const cell = get(startR, col);
        if (cell) line.push(cell);
      }
    } else {
      for (let r = 0; r < size; r++) {
        const row = direction === 'up' ? r : size - 1 - r;
        const cell = get(row, startC);
        if (cell) line.push(cell);
      }
    }

    // merge line
    const merged = [];
    for (let i = 0; i < line.length; i++) {
      const current = line[i];
      if (current && line[i + 1] && current.value === line[i + 1].value) {
        const id = nextId++;
        const combined = { id, value: current.value * 2, mergedFrom: [current.id, line[i + 1].id] };
        scoreDelta += combined.value;
        merged.push(combined);
        mergeIds.push(id);
        i++;
      } else {
        merged.push({ ...current });
      }
    }

    // place merged to newGrid respecting direction
    if (mode === 'row') {
      if (direction === 'left') {
        for (let c = 0; c < size; c++) {
          set(startR, c, merged[c] || null);
        }
      } else {
        for (let c = 0; c < size; c++) {
          set(startR, size - 1 - c, merged[c] || null);
        }
      }
    } else {
      if (direction === 'up') {
        for (let r = 0; r < size; r++) {
          set(r, startC, merged[r] || null);
        }
      } else {
        for (let r = 0; r < size; r++) {
          set(size - 1 - r, startC, merged[r] || null);
        }
      }
    }
  });

  // detect moved by comparing grids
  outer: for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const a = grid[r][c]?.value || null;
      const b = newGrid[r][c]?.value || null;
      if (a !== b) { moved = true; break outer; }
    }
  }

  return { grid: newGrid, scoreDelta, moved, mergeIds };
}
