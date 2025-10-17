//
// Core constants and helpers for the 2048 game
//

// PUBLIC_INTERFACE
export const DEFAULT_SIZE = 4; // 4x4 board

// PUBLIC_INTERFACE
export const INITIAL_TILES = 2; // number of tiles to spawn on new game

// PUBLIC_INTERFACE
export const SPAWN_CHANCE_4 = 0.1; // 10% for a '4', 90% for a '2'

// PUBLIC_INTERFACE
export const DIRECTIONS = Object.freeze({
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
});

// PUBLIC_INTERFACE
export const KEY_TO_DIRECTION = Object.freeze({
  ArrowUp: DIRECTIONS.UP,
  ArrowDown: DIRECTIONS.DOWN,
  ArrowLeft: DIRECTIONS.LEFT,
  ArrowRight: DIRECTIONS.RIGHT,
});

/**
 * PUBLIC_INTERFACE
 * makeEmptyBoard
 * Create an empty board (size x size) filled with 0 (empty).
 *
 * @param {number} size - Board dimension (default: 4)
 * @returns {number[][]} New 2D array board of zeros
 */
export function makeEmptyBoard(size = DEFAULT_SIZE) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
}

/**
 * PUBLIC_INTERFACE
 * cloneBoard
 * Deep clone a 2D board.
 * @param {number[][]} board
 * @returns {number[][]}
 */
export function cloneBoard(board) {
  return board.map((row) => row.slice());
}

/**
 * PUBLIC_INTERFACE
 * getSize
 * Get board dimension.
 * @param {number[][]} board
 * @returns {number}
 */
export function getSize(board) {
  return board.length;
}
