import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders 2048 title and scoreboards', () => {
  render(<App />);
  expect(screen.getByText('2048')).toBeInTheDocument();
  expect(screen.getByLabelText(/Score/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Best/i)).toBeInTheDocument();
});

test('renders grid and allows keyboard moves', () => {
  render(<App />);
  const grid = screen.getByRole('grid', { name: /2048 grid/i });
  expect(grid).toBeInTheDocument();
  // simulate a move (no assertion on result, just ensure no crash)
  fireEvent.keyDown(grid, { key: 'ArrowLeft' });
  fireEvent.keyDown(grid, { key: 'ArrowUp' });
});

test('has restart and undo controls', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /Restart/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Undo/i })).toBeInTheDocument();
});
