import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
});

test('renders title and mounts board', () => {
  render(<App />);
  // Title should be present
  const title = screen.getByTestId('app-title');
  expect(title).toBeInTheDocument();
  expect(title).toHaveTextContent(/2048/i);
  expect(title).toHaveTextContent(/Ocean/i);

  // Board root element should mount with role application and label
  const board = screen.getByRole('application', { name: /2048 board/i });
  expect(board).toBeInTheDocument();
});
