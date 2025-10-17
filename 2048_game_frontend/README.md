# 2048 – Ocean Professional Frontend

A complete, modern React implementation of the 2048 puzzle game with an Ocean Professional theme (primary #2563EB, amber accents #F59E0B). Includes keyboard and touch controls, undo, persistence, and accessibility improvements.

## Features

- Responsive 4x4 2048 gameplay with smooth animations
- Keyboard (Arrows/WASD) and touch swipe controls
- Score and Best score tracking (persisted via localStorage)
- Undo with configurable depth (1–5)
- Toggle animations and High-Contrast tile palette
- Auto-restore last session
- Accessible ARIA roles and live regions
- Ocean Professional styling: subtle gradients, rounded corners, focus-visible outlines

## Getting Started

From the 2048_game_frontend directory:

- npm install
- npm start

Open http://localhost:3000 to play.

## Build

- npm run build
Produces a production build in the build/ directory.

## Test

- npm test

The test suite includes smoke tests and UI mount checks (title and board presence).

## Styling

- Theme tokens: src/styles/theme.css
- Base styles: src/index.css
- Layout and components (board, tiles, controls): src/App.css and src/styles/animations.css

Key colors:
- Primary: #2563EB
- Secondary/Success: #F59E0B
- Error: #EF4444
- Background: #f9fafb
- Surface: #ffffff
- Text: #111827

No external UI libraries are used; built with vanilla CSS + React for full control over look and feel.

## Controls

- Keyboard: Arrow keys or WASD
- Touch: Swipe anywhere on the board
- Buttons: New Game, Undo, and settings (Undo depth, Animations, High-contrast)

## Notes

- LocalStorage is used for best score, preferences, and last session state. In private/incognito contexts localStorage may be limited.
