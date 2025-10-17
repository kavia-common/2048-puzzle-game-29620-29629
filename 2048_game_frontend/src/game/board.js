/**
 * Board utilities for the 2048 game. All functions are pure and do not mutate inputs.
 */
import { cloneBoard, getSize } from "./constants";
import { randomChoice, randomSpawnValue } from "./random";

/**
 * PUBLIC_INTERFACE
 * getEmptyCells
 * Returns an array of empty cell positions {row, col} for a given board.
 * @param {number[][]} board
 * @returns {{row:number, col:number}[]}
 */
export function getEmptyCells(board) {
  const empties = [];
  const size = getSize(board);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) empties.push({ row: r, col: c });
    }
  }
  return empties;
}

/**
 * PUBLIC_INTERFACE
 * hasEmptyCell
 * Checks if the board has at least one empty cell.
 * @param {number[][]} board
 * @returns {boolean}
 */
export function hasEmptyCell(board) {
  const size = getSize(board);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) return true;
    }
  }
  return false;
}

/**
 * PUBLIC_INTERFACE
 * spawnRandomTile
 * Spawns a random tile (2 with 90% prob, 4 with 10% prob) in a random empty cell.
 * Returns a new board. If no empty cells, returns original clone.
 * @param {number[][]} board
 * @param {number} chance4 - probability of spawning 4 (0..1). Default 0.1
 * @returns {{ board: number[][], position?: {row:number, col:number}, value?: number }}
 */
export function spawnRandomTile(board, chance4 = 0.1) {
  const empties = getEmptyCells(board);
  const newBoard = cloneBoard(board);
  if (empties.length === 0) {
    return { board: newBoard };
  }
  const spot = randomChoice(empties);
  const value = randomSpawnValue(chance4);
  newBoard[spot.row][spot.col] = value;
  return { board: newBoard, position: spot, value };
}

/**
 * PUBLIC_INTERFACE
 * getMaxTile
 * Returns the largest tile value on the board (0 if board is empty).
 * @param {number[][]} board
 * @returns {number}
 */
export function getMaxTile(board) {
  let max = 0;
  for (const row of board) {
    for (const v of row) {
      if (v > max) max = v;
    }
  }
  return max;
}

/**
 * PUBLIC_INTERFACE
 * boardsEqual
 * Deep equality check for two boards.
 * @param {number[][]} a
 * @param {number[][]} b
 * @returns {boolean}
 */
export function boardsEqual(a, b) {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let r = 0; r < a.length; r++) {
    const rowA = a[r];
    const rowB = b[r];
    if (rowA.length !== rowB.length) return false;
    for (let c = 0; c < rowA.length; c++) {
      if (rowA[c] !== rowB[c]) return false;
    }
  }
  return true;
}

/**
 * PUBLIC_INTERFACE
 * canMergeOrMove
 * Checks whether a move is possible: either there is an empty cell or any adjacent equal tiles.
 * @param {number[][]} board
 * @returns {boolean}
 */
export function canMergeOrMove(board) {
  if (hasEmptyCell(board)) return true;
  const size = getSize(board);
  // Check any adjacent equal tiles horizontally or vertically
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const v = board[r][c];
      if (r + 1 < size && board[r + 1][c] === v) return true;
      if (c + 1 < size && board[r][c + 1] === v) return true;
    }
  }
  return false;
}
