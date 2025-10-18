import React from 'react';
import './App.css';
import './index.css';
import Game from './components/Game';

// PUBLIC_INTERFACE
function App() {
  /** Root App rendering the 2048 Game component. */
  return (
    <div className="App">
      <main className="app-container">
        <Game />
      </main>
    </div>
  );
}

export default App;
