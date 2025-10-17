import { useEffect } from 'react';

// PUBLIC_INTERFACE
export function useKeyboardInput(onMove) {
  /** Attach keyboard handler for arrow keys and WASD. */
  useEffect(() => {
    const handler = (e) => {
      const k = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(k)) {
        e.preventDefault();
        const dir = k === 'arrowup' || k === 'w' ? 'up'
          : k === 'arrowdown' || k === 's' ? 'down'
          : k === 'arrowleft' || k === 'a' ? 'left'
          : 'right';
        onMove(dir);
      }
    };
    window.addEventListener('keydown', handler, { passive: false });
    return () => window.removeEventListener('keydown', handler);
  }, [onMove]);
}

// PUBLIC_INTERFACE
export function useSwipeInput(onMove) {
  /** Basic swipe detection for touch screens. */
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    const threshold = 24;

    const onTouchStart = (e) => {
      const t = e.changedTouches[0];
      startX = t.clientX;
      startY = t.clientY;
    };
    const onTouchEnd = (e) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        onMove(dx > 0 ? 'right' : 'left');
      } else {
        onMove(dy > 0 ? 'down' : 'up');
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [onMove]);
}
