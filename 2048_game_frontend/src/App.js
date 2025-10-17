import React from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App - Base layout scaffold for the 2048 game using the Ocean Professional style.
 * Renders:
 * - Header with title and score placeholders
 * - Square board placeholder area
 * - Controls with "New Game" button (non-functional)
 * - Footer with small note
 */
function App() {
  return (
    <div className="app-wrapper">
      <main className="container">
        <header className="header">
          <div className="brand">
            <h1 className="title">
              2048 <span className="title-accent">Ocean</span>
            </h1>
            <span className="subtitle">Professional Edition</span>
          </div>
          <div className="scores" role="group" aria-label="score summary">
            <div className="card" aria-live="polite">
              <div className="label">Score</div>
              <div className="value">0</div>
            </div>
            <div className="card" aria-live="polite">
              <div className="label">Best</div>
              <div className="value">0</div>
            </div>
          </div>
        </header>

        <section className="board-wrap" aria-label="game board">
          <div className="board">
            <div className="board-placeholder-grid" aria-hidden="true">
              <div className="board-placeholder-cell"></div>
              <div className="board-placeholder-cell"></div>
              <div className="board-placeholder-cell"></div>
              <div className="board-placeholder-cell"></div>

              <div className="board-placeholder-cell"></div>
              <div className="board-placeholder-cell"></div>
              <div className="board-placeholder-cell"></div>
              <div className="board-placeholder-cell"></div>

              <div className="board-placeholder-cell"></div>
              <div className="board-placeholder-cell"></div>
              <div className="board-placeholder-cell"></div>
              <div className="board-placeholder-cell"></div>

              <div className="board-placeholder-cell"></div>
              <div className="board-placeholder-cell"></div>
              <div className="board-placeholder-cell"></div>
              <div className="board-placeholder-cell"></div>
            </div>
          </div>
          <div className="controls">
            <button type="button" className="btn btn-primary" aria-label="Start a new game">
              New Game
            </button>
            <button type="button" className="btn btn-secondary" aria-label="Coming soon controls" disabled>
              Controls Soon
            </button>
          </div>
        </section>

        <footer className="footer">
          Built with the Ocean Professional theme. Placeholder UI for 2048.
        </footer>
      </main>
    </div>
  );
}

export default App;
