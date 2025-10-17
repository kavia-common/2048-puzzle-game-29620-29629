//
// 2048 Game Engine - pure functions
//

const SIZE = 4;

// Helpers
const clone = (grid) => grid.map((row) => row.slice());

const getEmptyCells = (grid) => {
  const cells = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) cells.push({ r, c });
    }
  }
  return cells;
};

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

// PUBLIC_INTERFACE
export function initializeGrid() {
  /**
   * Initialize a 4x4 grid with two random tiles (2 or 4).
   * @returns {number[][]} new grid
   */
  let grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  grid = spawnRandom(spawnRandom(grid));
  return grid;
}

function spawnRandom(grid) {
  const empty = getEmptyCells(grid);
  if (empty.length === 0) return grid;
  const { r, c } = randomChoice(empty);
  const value = Math.random() < 0.9 ? 2 : 4;
  const next = clone(grid);
  next[r][c] = value;
  return next;
}

function compressRow(row) {
  // remove zeros and shift left
  const filtered = row.filter((x) => x !== 0);
  while (filtered.length < SIZE) filtered.push(0);
  return filtered;
}

function mergeRowLeft(row) {
  let scoreDelta = 0;
  const compressed = compressRow(row);
  for (let i = 0; i < SIZE - 1; i++) {
    if (compressed[i] !== 0 && compressed[i] === compressed[i + 1]) {
      compressed[i] *= 2;
      scoreDelta += compressed[i];
      compressed[i + 1] = 0;
      i += 0; // single merge rule (skip next because it becomes 0 then compressed later)
    }
  }
  return { merged: compressRow(compressed), scoreDelta };
}

function transpose(grid) {
  const t = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) t[c][r] = grid[r][c];
  return t;
}

function reverseRows(grid) {
  return grid.map((row) => row.slice().reverse());
}

// PUBLIC_INTERFACE
export function moveLeft(grid) {
  /**
   * Move tiles left applying single-merge rule.
   * @param {number[][]} grid
   * @returns {{grid:number[][], moved:boolean, scoreDelta:number}}
   */
  const next = [];
  let moved = false;
  let totalDelta = 0;
  for (let r = 0; r < SIZE; r++) {
    const { merged, scoreDelta } = mergeRowLeft(grid[r]);
    next.push(merged);
    totalDelta += scoreDelta;
    if (merged.some((v, i) => v !== grid[r][i])) moved = true;
  }
  return { grid: next, moved, scoreDelta: totalDelta };
}

// PUBLIC_INTERFACE
export function moveRight(grid) {
  const reversed = reverseRows(grid);
  const res = moveLeft(reversed);
  return {
    grid: reverseRows(res.grid),
    moved: res.moved,
    scoreDelta: res.scoreDelta,
  };
}

// PUBLIC_INTERFACE
export function moveUp(grid) {
  const t = transpose(grid);
  const res = moveLeft(t);
  return {
    grid: transpose(res.grid),
    moved: res.moved,
    scoreDelta: res.scoreDelta,
  };
}

// PUBLIC_INTERFACE
export function moveDown(grid) {
  const t = transpose(grid);
  const res = moveRight(t);
  return {
    grid: transpose(res.grid),
    moved: res.moved,
    scoreDelta: res.scoreDelta,
  };
}

// PUBLIC_INTERFACE
export function applyMove(grid, direction) {
  /**
   * Apply move in given direction and spawn a random tile if moved.
   */
  const dirMap = {
    left: moveLeft,
    right: moveRight,
    up: moveUp,
    down: moveDown,
  };
  const fn = dirMap[direction];
  if (!fn) return { grid, moved: false, scoreDelta: 0 };
  const { grid: g2, moved, scoreDelta } = fn(grid);
  return { grid: moved ? spawnRandom(g2) : grid, moved, scoreDelta };
}

// PUBLIC_INTERFACE
export function canMove(grid) {
  /**
   * Determine if any move is possible.
   */
  if (getEmptyCells(grid).length > 0) return true;
  // check neighbors for equal values
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cur = grid[r][c];
      if (r + 1 < SIZE && grid[r + 1][c] === cur) return true;
      if (c + 1 < SIZE && grid[r][c + 1] === cur) return true;
    }
  }
  return false;
}

// PUBLIC_INTERFACE
export function hasWon(grid) {
  /**
   * Check if a 2048 tile is present.
   */
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (grid[r][c] >= 2048) return true;
  return false;
}

export const __internals = {
  SIZE,
  clone,
  getEmptyCells,
  compressRow,
  mergeRowLeft,
  transpose,
  reverseRows,
  spawnRandom,
};
