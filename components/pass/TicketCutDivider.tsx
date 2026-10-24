"use client";

import React from "react";
import { Scissors } from "lucide-react";

interface TicketCutDividerProps {
  isDark?: boolean;
  label?: string;
  showScissors?: boolean;
  /**
   * The background color of the parent page/container that fills the punch cutout.
   * If unspecified, defaults to #0a0a0d for dark, #f8fafc for light.
   */
  cutoutColor?: string;
  className?: string;
  /**
   * Negative margin to stretch to the card edges.
   * E.g. "-mx-4 sm:-mx-6" when card has "p-4 sm:p-6"
   */
  negativeMarginCls?: string;
}

/**
 * Authentic Ticket Cut Divider
 * Renders inward semicircular die-cut notches on both borders connected by a perforated tear line.
 */
export default function TicketCutDivider({
  isDark = false,
  label = "ADMIT ONE · TEAR OR SCAN",
  showScissors = true,
  cutoutColor,
  className = "",
  negativeMarginCls = "-mx-4 sm:-mx-6",
}: TicketCutDividerProps) {
  const bgCutout =
    cutoutColor || (isDark ? "#0a0a0d" : "#f8fafc");

  const leftShadow = isDark
    ? "inset -2px 0 4px rgba(0,0,0,0.7), inset 0 2px 2px rgba(255,255,255,0.08)"
    : "inset -2px 0 4px rgba(0,0,0,0.15), inset 0 1px 2px rgba(0,0,0,0.06)";

  const rightShadow = isDark
    ? "inset 2px 0 4px rgba(0,0,0,0.7), inset 0 2px 2px rgba(255,255,255,0.08)"
    : "inset 2px 0 4px rgba(0,0,0,0.15), inset 0 1px 2px rgba(0,0,0,0.06)";

  return (
    <div
      className={`relative w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] ${negativeMarginCls} my-4 flex items-center justify-between select-none ${className}`}
      data-ticket-cut="true"
    >
      {/* Left Semicircular Punch Notch (Punched inward into ticket border) */}
      <div
        className="w-7 h-7 rounded-full -ml-3.5 shrink-0 z-20 transition-colors print:bg-white border border-neutral-300/40 dark:border-neutral-700/40"
        style={{
          backgroundColor: bgCutout,
          boxShadow: leftShadow,
        }}
        aria-hidden="true"
      />

      {/* Perforated Rip / Tear Line */}
      <div className="flex-1 relative flex items-center justify-center mx-1">
        <div
          className="w-full border-t-2 border-dashed"
          style={{
            borderColor: isDark ? "rgba(255, 255, 255, 0.18)" : "rgba(0, 0, 0, 0.15)",
          }}
        />

        {label && (
          <span
            className="absolute px-2.5 py-0.5 text-[8px] font-mono tracking-widest uppercase font-bold flex items-center gap-1.5 rounded-full border shadow-2xs backdrop-blur-xs"
            style={{
              backgroundColor: isDark ? "#171a23" : "#f8fafc",
              color: isDark ? "#94a3b8" : "#64748b",
              borderColor: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.12)",
            }}
          >
            {showScissors && <Scissors className="w-2.5 h-2.5 text-brand shrink-0" />}
            <span>{label}</span>
          </span>
        )}
      </div>

      {/* Right Semicircular Punch Notch (Punched inward into ticket border) */}
      <div
        className="w-7 h-7 rounded-full -mr-3.5 shrink-0 z-20 transition-colors print:bg-white border border-neutral-300/40 dark:border-neutral-700/40"
        style={{
          backgroundColor: bgCutout,
          boxShadow: rightShadow,
        }}
        aria-hidden="true"
      />
    </div>
  );
}
