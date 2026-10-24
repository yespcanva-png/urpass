"use client";

import React from "react";

interface TicketBarcodeProps {
  code: string;
  className?: string;
  height?: number;
  isDark?: boolean;
  showText?: boolean;
}

/**
 * Realistic Event Ticket Barcode Generator
 * Generates authentic Code-128 / Code-39 style linear bars with variable widths and guard markers.
 */
export default function TicketBarcode({
  code,
  className = "",
  height = 36,
  isDark = false,
  showText = true,
}: TicketBarcodeProps) {
  // Deterministic bar widths sequence based on code string
  const bars = React.useMemo(() => {
    const cleanCode = (code || "URPASS-PASS").toUpperCase().replace(/[^A-Z0-9-]/g, "");
    const generated: { width: number; gap: number }[] = [];

    // Left guard pattern
    generated.push({ width: 2, gap: 1 });
    generated.push({ width: 1, gap: 2 });

    for (let i = 0; i < cleanCode.length; i++) {
      const charCode = cleanCode.charCodeAt(i);
      const b1 = (charCode % 3) + 1;
      const g1 = ((charCode >> 1) % 2) + 1;
      const b2 = ((charCode >> 2) % 3) + 1;
      const g2 = ((charCode >> 3) % 2) + 1;
      generated.push({ width: b1, gap: g1 });
      generated.push({ width: b2, gap: g2 });
    }

    // Right guard pattern
    generated.push({ width: 1, gap: 2 });
    generated.push({ width: 2, gap: 1 });

    return generated;
  }, [code]);

  const totalWidth = bars.reduce((acc, b) => acc + b.width + b.gap, 0);
  const barColor = isDark ? "#E2E8F0" : "#18181B";
  const formattedText = code.startsWith("*") ? code : `* ${code.toUpperCase()} *`;

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${totalWidth} ${height}`}
        preserveAspectRatio="none"
        className="w-full max-w-[240px] h-9"
        shapeRendering="crispEdges"
      >
        {bars.map((bar, idx) => {
          // Calculate cumulative X position
          const x = bars.slice(0, idx).reduce((sum, b) => sum + b.width + b.gap, 0);
          return (
            <rect
              key={idx}
              x={x}
              y={0}
              width={bar.width}
              height={height}
              fill={barColor}
            />
          );
        })}
      </svg>
      {showText && (
        <span
          className={`mt-1 text-[9px] font-mono tracking-[0.25em] font-semibold ${
            isDark ? "text-neutral-400" : "text-neutral-500"
          }`}
        >
          {formattedText}
        </span>
      )}
    </div>
  );
}
