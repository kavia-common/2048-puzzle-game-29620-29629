import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Game and shows New Game button; at least two initial tiles present', () => {
  render(<App />);
  const newGameBtns = screen.getAllByRole('button', { name: /new game/i });
  expect(newGameBtns.length).toBeGreaterThan(0);

  // Tiles are role="img" with label "Tile <value>"
  const tiles = screen.getAllByRole('img', { name: /Tile/i });
  expect(tiles.length).toBeGreaterThanOrEqual(2);
});
