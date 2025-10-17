import React, { useMemo } from "react";

/**
 * PUBLIC_INTERFACE
 * Tile
 * Positioned tile rendered within the Board's grid. Uses inline styles to blend with theme.
 * Props:
 * - row, col: position in 0..3
 * - value: number
 * - isNew: boolean (optional visual emphasis for newly spawned tile)
 */
function Tile({ row, col, value, isNew }) {
  const bg = useMemo(() => {
    // Simple color ramp based on value; keep within Ocean/Amber scheme
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
    // fallback: deeper blue
    return palette[value] || "#1E3A8A";
  }, [value]);

  const color = value <= 8 ? "#111827" : "#ffffff";

  return (
    <div
      className="tile"
      style={{
        gridColumnStart: col + 1,
        gridRowStart: row + 1,
        display: "grid",
        placeItems: "center",
        borderRadius: 10,
        background: bg,
        color,
        fontWeight: 800,
        fontSize: value >= 1024 ? 18 : value >= 128 ? 20 : value >= 16 ? 22 : 24,
        boxShadow: "var(--shadow-md)",
        transform: isNew ? "scale(1.05)" : "scale(1)",
        transition: "transform 150ms ease",
      }}
      aria-label={`Tile ${value}`}
    >
      {value}
    </div>
  );
}

export default Tile;
