/**
 * Move mechanics for 2048. Functions are pure and do not mutate inputs.
 * A move returns:
 *  - board: the new board after the move
 *  - scoreGained: sum of merged tile values produced by this move
 *  - moved: boolean indicating if any tile moved or merged
 *  - mergedPositions: array of {row, col, value} where new merged tiles appeared
 */
import { DIRECTIONS, cloneBoard, getSize } from "./constants";

/**
 * Compress non-zero numbers to the front of the array, keeping order.
 * Also returns a mapping from new index to original index for tracking.
 * @param {number[]} arr
 * @returns {{ line:number[], map:number[] }} line is new array, map[newIndex] = originalIndex
 */
function compressLine(arr) {
  const line = [];
  const map = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      map.push(i);
      line.push(arr[i]);
    }
  }
  // pad with zeros
  while (line.length < arr.length) {
    line.push(0);
    map.push(-1); // -1 indicates padded zero (no origin)
  }
  return { line, map };
}

/**
 * Merge a compressed line from left to right according to 2048 rules:
 * - Same adjacent values merge once into their sum
 * - Resulting tile cannot merge again in the same move
 * Returns merged line, score gained, and positions of merges relative to the line.
 * @param {number[]} line
 * @returns {{ merged:number[], score:number, merges:{index:number, value:number}[] }}
 */
function mergeLineLeft(line) {
  const merged = line.slice();
  let score = 0;
  const merges = [];
  for (let i = 0; i < merged.length - 1; i++) {
    if (merged[i] !== 0 && merged[i] === merged[i + 1]) {
      const newVal = merged[i] * 2;
      merged[i] = newVal;
      merged[i + 1] = 0;
      score += newVal;
      merges.push({ index: i, value: newVal });
      i++; // skip next to avoid double merge
    }
  }
  // compress again after merges
  const { line: compressedAgain } = compressLine(merged);
  return { merged: compressedAgain, score, merges };
}

/**
 * Rotate matrix clockwise 90 degrees.
 * @param {number[][]} m
 * @returns {number[][]}
 */
function rotateCW(m) {
  const n = m.length;
  const r = Array.from({ length: n }, () => Array.from({ length: n }, () => 0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      r[j][n - 1 - i] = m[i][j];
    }
  }
  return r;
}

/**
 * Rotate matrix counter-clockwise 90 degrees.
 * @param {number[][]} m
 * @returns {number[][]}
 */
function rotateCCW(m) {
  const n = m.length;
  const r = Array.from({ length: n }, () => Array.from({ length: n }, () => 0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      r[n - 1 - j][i] = m[i][j];
    }
  }
  return r;
}

/**
 * Reverse each row (to facilitate right moves using left logic).
 * @param {number[][]} m
 * @returns {number[][]}
 */
function reverseRows(m) {
  return m.map((row) => row.slice().reverse());
}

/**
 * PUBLIC_INTERFACE
 * moveLeft
 * Applies a LEFT move to the board according to 2048 rules.
 * @param {number[][]} board
 * @returns {{board:number[][], scoreGained:number, moved:boolean, mergedPositions:{row:number, col:number, value:number}[]}}
 */
export function moveLeft(board) {
  const size = getSize(board);
  const src = cloneBoard(board);

  let totalScore = 0;
  let moved = false;
  const mergedPositions = [];

  const result = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));

  for (let r = 0; r < size; r++) {
    const row = src[r];
    const { line: compressed, map } = compressLine(row);
    const { merged, score, merges } = mergeLineLeft(compressed);

    totalScore += score;

    // Place merged line into result and detect movement
    for (let c = 0; c < size; c++) {
      result[r][c] = merged[c];
      if (!moved) {
        // Compare original row vs new value at same column,
        // movement if value changed or came from different index
        const originalVal = row[c];
        const newVal = merged[c];
        if (originalVal !== newVal) moved = true;
      }
    }

    // Register merge positions in board coordinates
    for (const m of merges) {
      mergedPositions.push({ row: r, col: m.index, value: m.value });
    }

    // Additional movement detection: if any non-zero changed column due to compression
    if (!moved) {
      for (let c = 0; c < size; c++) {
        const originIdx = map[c];
        if (originIdx !== -1 && originIdx !== c) {
          moved = true;
          break;
        }
      }
    }
  }

  return { board: result, scoreGained: totalScore, moved, mergedPositions };
}

/**
 * PUBLIC_INTERFACE
 * moveRight
 * Applies a RIGHT move using LEFT logic by reversing rows before/after.
 * @param {number[][]} board
 * @returns {{board:number[][], scoreGained:number, moved:boolean, mergedPositions:{row:number, col:number, value:number}[]}}
 */
export function moveRight(board) {
  const reversed = reverseRows(board);
  const movedLeft = moveLeft(reversed);
  // reverse back
  const result = reverseRows(movedLeft.board);
  const size = getSize(board);
  // adjust merged positions (mirror columns)
  const mergedPositions = movedLeft.mergedPositions.map(({ row, col, value }) => ({
    row,
    col: size - 1 - col,
    value,
  }));
  // recompute moved by comparing with original (safer)
  let moved = false;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] !== result[r][c]) {
        moved = true;
        r = size; // break outer
        break;
      }
    }
  }
  return {
    board: result,
    scoreGained: movedLeft.scoreGained,
    moved,
    mergedPositions,
  };
}

/**
 * PUBLIC_INTERFACE
 * moveUp
 * Applies an UP move using LEFT logic by rotating CCW before and CW after.
 * @param {number[][]} board
 * @returns {{board:number[][], scoreGained:number, moved:boolean, mergedPositions:{row:number, col:number, value:number}[]}}
 */
export function moveUp(board) {
  const rotated = rotateCCW(board);
  const movedLeft = moveLeft(rotated);
  const result = rotateCW(movedLeft.board);
  const size = getSize(board);
  // Adjust merged positions (rotation mapping)
  const mergedPositions = movedLeft.mergedPositions.map(({ row, col, value }) => ({
    row: col,
    col: size - 1 - row,
    value,
  }));
  // recompute moved
  let moved = false;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] !== result[r][c]) {
        moved = true;
        r = size;
        break;
      }
    }
  }
  return {
    board: result,
    scoreGained: movedLeft.scoreGained,
    moved,
    mergedPositions,
  };
}

/**
 * PUBLIC_INTERFACE
 * moveDown
 * Applies a DOWN move using LEFT logic by rotating CW before and CCW after.
 * @param {number[][]} board
 * @returns {{board:number[][], scoreGained:number, moved:boolean, mergedPositions:{row:number, col:number, value:number}[]}}
 */
export function moveDown(board) {
  const rotated = rotateCW(board);
  const movedLeft = moveLeft(rotated);
  const result = rotateCCW(movedLeft.board);
  const size = getSize(board);
  // Adjust merged positions (rotation mapping opposite)
  const mergedPositions = movedLeft.mergedPositions.map(({ row, col, value }) => ({
    row: size - 1 - col,
    col: row,
    value,
  }));
  // recompute moved
  let moved = false;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] !== result[r][c]) {
        moved = true;
        r = size;
        break;
      }
    }
  }
  return {
    board: result,
    scoreGained: movedLeft.scoreGained,
    moved,
    mergedPositions,
  };
}

/**
 * PUBLIC_INTERFACE
 * move
 * Dispatches to the appropriate move function based on the provided direction string.
 * @param {"UP"|"DOWN"|"LEFT"|"RIGHT"} direction
 * @param {number[][]} board
 * @returns {{board:number[][], scoreGained:number, moved:boolean, mergedPositions:{row:number, col:number, value:number}[]}}
 */
export function move(direction, board) {
  switch (direction) {
    case DIRECTIONS.LEFT:
      return moveLeft(board);
    case DIRECTIONS.RIGHT:
      return moveRight(board);
    case DIRECTIONS.UP:
      return moveUp(board);
    case DIRECTIONS.DOWN:
      return moveDown(board);
    default:
      return { board: cloneBoard(board), scoreGained: 0, moved: false, mergedPositions: [] };
  }
}
