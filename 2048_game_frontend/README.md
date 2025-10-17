# 2048 – Ocean Professional Frontend

This frontend scaffolds the 2048 game UI using a clean, modern “Ocean Professional” theme (primary #2563EB, amber accents #F59E0B). It currently renders a centered layout with score placeholders, a square board placeholder, and controls.

## Getting Started

In the 2048_game_frontend directory:

- npm install
- npm start

Then open http://localhost:3000 to view the app. You should see the Ocean-styled base layout with placeholders.

## Styling

- Theme tokens are defined in src/styles/theme.css.
- Base styles import the theme in src/index.css.
- Layout, components (cards, buttons), responsive helpers, and board placeholder styles live in src/App.css.

Colors:
- Primary: #2563EB
- Secondary/Success: #F59E0B
- Error: #EF4444
- Background: #f9fafb
- Surface: #ffffff
- Text: #111827

No external UI dependencies are used; everything is built with vanilla CSS + React.

## Next steps

- Implement game logic, rendering of tiles, and interactivity.
- Wire up “New Game” control and score/best score updates.
