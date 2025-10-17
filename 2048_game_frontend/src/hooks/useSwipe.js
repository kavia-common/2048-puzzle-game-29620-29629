import { useCallback, useRef } from "react";
import { DIRECTIONS } from "../game/constants";

/**
 * PUBLIC_INTERFACE
 * useSwipe
 * Detects swipe gestures on the provided ref element. Returns a ref to attach.
 * Options:
 * - onSwipe: (dir: "UP"|"DOWN"|"LEFT"|"RIGHT") => void
 * - threshold: number (minimum px to qualify)
 */
export default function useSwipe({ onSwipe, threshold = 20 } = {}) {
  const ref = useRef(null);
  const start = useRef({ x: 0, y: 0, active: false });

  const onTouchStart = useCallback((e) => {
    if (!e.touches || e.touches.length === 0) return;
    const t = e.touches[0];
    start.current = { x: t.clientX, y: t.clientY, active: true };
  }, []);

  const onTouchEnd = useCallback(
    (e) => {
      if (!start.current.active) return;
      const t = e.changedTouches && e.changedTouches[0];
      if (!t) return;

      const dx = t.clientX - start.current.x;
      const dy = t.clientY - start.current.y;

      start.current.active = false;

      // Determine direction
      if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;

      let dir = null;
      if (Math.abs(dx) > Math.abs(dy)) {
        dir = dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
      } else {
        dir = dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP;
      }
      if (dir && onSwipe) onSwipe(dir);
    },
    [onSwipe, threshold]
  );

  const onRef = useCallback(
    (node) => {
      if (ref.current) {
        // cleanup old
        ref.current.removeEventListener("touchstart", onTouchStart);
        ref.current.removeEventListener("touchend", onTouchEnd);
      }
      ref.current = node;
      if (node) {
        node.addEventListener("touchstart", onTouchStart, { passive: true });
        node.addEventListener("touchend", onTouchEnd, { passive: true });
      }
    },
    [onTouchStart, onTouchEnd]
  );

  return { ref: onRef };
}
