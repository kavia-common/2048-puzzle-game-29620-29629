/**
 * Random utilities for the 2048 game. These are pure functions that rely on Math.random(),
 * allowing easy mocking in tests by stubbing Math.random.
 */

/**
 * PUBLIC_INTERFACE
 * randomInt
 * Returns a random integer in [0, n).
 * @param {number} n - Upper bound (exclusive)
 * @returns {number}
 */
export function randomInt(n) {
  return Math.floor(Math.random() * n);
}

/**
 * PUBLIC_INTERFACE
 * randomChoice
 * Returns a random element from an array.
 * @param {Array<T>} arr
 * @returns {T}
 * @template T
 */
export function randomChoice(arr) {
  if (!arr || arr.length === 0) return undefined;
  return arr[randomInt(arr.length)];
}

/**
 * PUBLIC_INTERFACE
 * randomSpawnValue
 * Returns 2 with 90% probability and 4 with 10% probability, unless a custom chance is provided.
 * @param {number} chance4 - probability of spawning 4 (0..1). Default 0.1
 * @returns {2|4}
 */
export function randomSpawnValue(chance4 = 0.1) {
  return Math.random() < chance4 ? 4 : 2;
}
