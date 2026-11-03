"use client";

import React from "react";

interface TicketSecurityPatternProps {
  isDark?: boolean;
  opacity?: number;
  className?: string;
}

/**
 * Authentic Banknote / Event Ticket Security Pattern
 * Generates delicate guilloche wave patterns and security cross-hatching
 * recreating authentic physical ticket stock.
 */
export default function TicketSecurityPattern({
  isDark = false,
  opacity,
  className = "",
}: TicketSecurityPatternProps) {
  const effectiveOpacity = opacity ?? (isDark ? 0.05 : 0.04);

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none select-none z-0 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      aria-hidden="true"
      style={{ opacity: effectiveOpacity }}
    >
      <defs>
        <pattern
          id={`guilloche-${isDark ? "dark" : "light"}`}
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          {/* Delicate banknote security waves */}
          <path
            d="M0 24 Q12 0 24 24 T48 24 M0 48 Q12 24 24 48 T48 48 M0 0 Q12 -24 24 0 T48 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
          />
          <path
            d="M0 12 Q12 36 24 12 T48 12 M0 36 Q12 60 24 36 T48 36"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="2 3"
          />
          <circle cx="24" cy="24" r="1.5" fill="currentColor" opacity="0.6" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#guilloche-${isDark ? "dark" : "light"})`}
        className={isDark ? "text-amber-200" : "text-neutral-900"}
      />
    </svg>
  );
}
