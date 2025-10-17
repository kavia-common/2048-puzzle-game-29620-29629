import React from 'react';

// PUBLIC_INTERFACE
export default function Toast({ open, message, type = 'info' }) {
  /** Non-blocking toast message. */
  return (
    <div
      className={`toast ${open ? 'show' : ''} ${type}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
