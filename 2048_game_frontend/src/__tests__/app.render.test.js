import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders header and new game button', () => {
  render(<App />);
  expect(screen.getByText(/Ocean 2048/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /new game/i })).toBeInTheDocument();
  expect(screen.getByRole('grid', { name: /game board/i })).toBeInTheDocument();
});
