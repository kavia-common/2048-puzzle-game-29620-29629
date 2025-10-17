import { useEffect, useRef } from "react";

/**
 * PUBLIC_INTERFACE
 * useEventListener
 * Attaches an event listener to a target (default: window) and cleans up on unmount or deps change.
 * @param {string} eventName
 * @param {(e:Event)=>void} handler
 * @param {EventTarget|Window|Document} target
 */
export default function useEventListener(eventName, handler, target = typeof window !== "undefined" ? window : undefined) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const tgt = target;
    if (!tgt || !tgt.addEventListener) return;

    const listener = (event) => savedHandler.current && savedHandler.current(event);
    tgt.addEventListener(eventName, listener, { passive: false });

    return () => {
      tgt.removeEventListener(eventName, listener);
    };
  }, [eventName, target]);
}
