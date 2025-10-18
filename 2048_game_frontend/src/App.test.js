import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Game and shows New Game button; initial tile count is 2', () => {
  render(<App />);
  const newGameBtn = screen.getAllByRole('button', { name: /new game/i })[0];
  expect(newGameBtn).toBeInTheDocument();

  // Tiles are role="img" with label "Tile <value>"
  const tiles = screen.getAllByRole('img', { name: /Tile/i });
  expect(tiles.length).toBe(2);
});
