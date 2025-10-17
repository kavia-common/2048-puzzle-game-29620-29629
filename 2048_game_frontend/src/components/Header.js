import React from 'react';

// PUBLIC_INTERFACE
export default function Header() {
  /** App header with Ocean Professional theme. */
  return (
    <header className="header">
      <div className="brand">
        <div className="badge">2048</div>
        <h1 className="title">Ocean 2048</h1>
      </div>
      <p className="subtitle">
        Combine matching tiles to reach 2048. Think ahead, make every move count.
      </p>
    </header>
  );
}
