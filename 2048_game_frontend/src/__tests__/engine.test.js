import {
  initializeGrid,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  canMove,
  hasWon,
  __internals
} from '../game/engine';

test('initializeGrid places two tiles', () => {
  const g = initializeGrid();
  const filled = g.flat().filter(v => v !== 0).length;
  expect(filled).toBe(2);
});

test('moveLeft merges single pair once', () => {
  const grid = [
    [2,2,2,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
  ];
  const { grid: g2, moved, scoreDelta } = moveLeft(grid);
  expect(moved).toBe(true);
  expect(g2[0]).toEqual([4,2,0,0]);
  expect(scoreDelta).toBe(4);
});

test('moveRight works', () => {
  const grid = [
    [2,2,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
  ];
  const { grid: g2 } = moveRight(grid);
  expect(g2[0]).toEqual([0,0,0,4]);
});

test('moveUp and moveDown basic behavior', () => {
  const grid = [
    [2,0,0,0],
    [2,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
  ];
  const { grid: up } = moveUp(grid);
  expect(up[0][0]).toBe(4);

  const grid2 = [
    [2,0,0,0],
    [2,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
  ];
  const { grid: down } = moveDown(grid2);
  expect(down[3][0]).toBe(4);
});

test('canMove false when board full and no merges', () => {
  const grid = [
    [2,4,2,4],
    [4,2,4,2],
    [2,4,2,4],
    [4,2,4,2],
  ];
  expect(canMove(grid)).toBe(false);
});

test('hasWon detects 2048', () => {
  const grid = [
    [2048,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
  ];
  expect(hasWon(grid)).toBe(true);
});

test('internals helpers work', () => {
  const row = [2,0,2,0];
  const { merged, scoreDelta } = __internals.mergeRowLeft(row);
  expect(merged).toEqual([4,0,0,0]);
  expect(scoreDelta).toBe(4);

  const t = __internals.transpose([[1,2],[3,4]]);
  expect(t).toEqual([[1,3],[2,4]]);
});
