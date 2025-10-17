import React, { useMemo } from "react";

/**
 * PUBLIC_INTERFACE
 * Tile
 * Absolutely positioned tile rendered within the Board. Uses transforms for smooth movement.
 * Props:
 * - row, col: position in 0..3
 * - value: number
 * - isNew: boolean (visual emphasis for newly spawned tile)
 */
function Tile({ row, col, value, isNew, highContrast = false, animationsEnabled = true }) {
  const bg = useMemo(() => {
    // Ocean/Amber palette ramp (default)
    const palette = {
      2: "#DBEAFE",
      4: "#BFDBFE",
      8: "#93C5FD",
      16: "#60A5FA",
      32: "#3B82F6",
      64: "#2563EB",
      128: "#1D4ED8",
      256: "#1E40AF",
      512: "#0EA5E9",
      1024: "#F59E0B",
      2048: "#D97706",
    };
    // High-contrast palette: stronger separation and WCAG-friendly ramps
    const hc = {
      2: "#ffffff",
      4: "#d1d5db",
      8: "#93c5fd",
      16: "#60a5fa",
      32: "#3b82f6",
      64: "#1d4ed8",
      128: "#dc2626",
      256: "#b91c1c",
      512: "#16a34a",
      1024: "#15803d",
      2048: "#0f766e",
    };
    const map = highContrast ? hc : palette;
    return map[value] || (highContrast ? "#0a0a0a" : "#1E3A8A");
  }, [value, highContrast]);

  const color = value <= 8 ? "#111827" : "#ffffff";

  // Compute CSS variables from board for pixel-based positioning
  // We rely on CSS vars defined on .board in App.css
  const style = {
    background: bg,
    color,
    width: "var(--tile-size)",
    height: "var(--tile-size)",
    // Translate by padding + col/row * (cell + gap)
    transform: `translate(calc(var(--tile-padding) + ${col} * (var(--tile-size) + var(--tile-gap))), calc(var(--tile-padding) + ${row} * (var(--tile-size) + var(--tile-gap))))`,
    fontSize:
      value >= 2048 ? 18 :
      value >= 1024 ? 18 :
      value >= 512 ? 20 :
      value >= 128 ? 20 :
      value >= 16 ? 22 : 24,
  };

  const className = `tile${isNew && animationsEnabled ? " tile--new" : ""}${!animationsEnabled ? " tile--no-anim" : ""}`;

  return (
    <div className={className} style={style} aria-label={`Tile ${value}`}>
      <div className="tile__value">{value}</div>
    </div>
  );
}

export default Tile;
