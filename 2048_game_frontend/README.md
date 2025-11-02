# 2048 – Ocean Professional (React)

A modern, responsive implementation of the classic 2048 puzzle. Move tiles with the same number to combine them and try to reach the 2048 tile.

Features
- Responsive 4x4 board with smooth animations
- Keyboard (Arrow keys) and touch swipe support
- Score and Best score (persisted via localStorage)
- Win (2048) and Game Over overlays with Continue/New Game options
- “Ocean Professional” theme: clean blue & amber palette, subtle shadows and rounded corners

Getting Started
- Development: npm start
  - Starts the app at http://localhost:3000
- Tests: npm test
  - Runs tests in watch mode (Create React App defaults)
- Build: npm run build
  - Produces a production build in the build folder

Controls
- Desktop: ArrowUp, ArrowDown, ArrowLeft, ArrowRight
- Mobile: Swipe in any direction on the board

Project Structure (key files)
- src/App.js: App shell and layout
- src/components/Game.js: Main game container (header, controls, overlays, board)
- src/components/Board.js: Static background grid and tile layer
- src/components/Tile.js: Individual tile rendering
- src/components/ScoreBar.js: Score and Best display with New Game
- src/hooks/use2048.js: Core game state, input handlers, and move orchestration
- src/utils/gameLogic.js: Pure 2048 logic: grid ops, moves, merges, spawn, win/over checks
- src/utils/storage.js: Best score localStorage helpers
- src/App.css: Theme and component styles

Environment
This frontend is self-contained and does not require any backend or env variables to run. Any REACT_APP_* variables present are optional and unused.

Accessibility
- Tiles expose role="img" and aria-label="Tile <value>"
- ScoreBar and overlays have appropriate aria attributes
- Board uses role="application" and aria-label

License
MIT
