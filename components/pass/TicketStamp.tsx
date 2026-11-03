"use client";

import React from "react";

export type StampVariant = "red" | "emerald" | "amber" | "blue" | "gold";

interface TicketStampProps {
  text?: string;
  subtext?: string;
  variant?: StampVariant;
  angle?: number;
  className?: string;
}

const STAMP_STYLES: Record<
  StampVariant,
  {
    border: string;
    text: string;
    bg: string;
  }
> = {
  red: {
    border: "border-red-600/80 dark:border-red-500/80",
    text: "text-red-700 dark:text-red-400",
    bg: "bg-red-50/40 dark:bg-red-950/20",
  },
  emerald: {
    border: "border-emerald-600/80 dark:border-emerald-500/80",
    text: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50/40 dark:bg-emerald-950/20",
  },
  amber: {
    border: "border-amber-600/80 dark:border-amber-500/80",
    text: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50/40 dark:bg-amber-950/20",
  },
  blue: {
    border: "border-blue-600/80 dark:border-blue-500/80",
    text: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50/40 dark:bg-blue-950/20",
  },
  gold: {
    border: "border-amber-500/90 dark:border-amber-400/90",
    text: "text-amber-600 dark:text-amber-300",
    bg: "bg-amber-100/30 dark:bg-amber-950/30",
  },
};

/**
 * Authentic Box-Office Rubber Ink Verification Stamp
 * Gives tickets the unmistakable feel of an authentic physical pass
 * stamped by venue admissions or the official ticketing desk.
 */
export default function TicketStamp({
  text = "OFFICIAL ADMISSION",
  subtext = "GENUINE TICKET · URPASS",
  variant = "red",
  angle = -7,
  className = "",
}: TicketStampProps) {
  const style = STAMP_STYLES[variant] || STAMP_STYLES.red;

  return (
    <div
      className={`pointer-events-none select-none inline-flex flex-col items-center justify-center p-1.5 px-3 rounded-md border-2 border-dashed ${style.border} ${style.bg} ${style.text} shadow-2xs backdrop-blur-[1px] transition-transform ${className}`}
      style={{
        transform: `rotate(${angle}deg)`,
      }}
      aria-hidden="true"
    >
      <div className="flex items-center gap-1.5">
        <span className="text-[7.5px] leading-none">★</span>
        <span className="text-[9px] font-black tracking-[0.2em] uppercase font-mono leading-none">
          {text}
        </span>
        <span className="text-[7.5px] leading-none">★</span>
      </div>
      {subtext && (
        <span className="text-[6.5px] font-mono tracking-widest uppercase font-bold mt-0.5 opacity-90 leading-none">
          {subtext}
        </span>
      )}
    </div>
  );
}
