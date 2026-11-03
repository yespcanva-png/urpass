"use client";

import React from "react";

interface TicketAdmissionMatrixProps {
  gate?: string;
  section?: string;
  row?: string;
  seat?: string;
  isDark?: boolean;
  className?: string;
}

/**
 * Authentic 4-Compartment Physical Ticket Seating & Admission Matrix
 * Recreates the iconic [ GATE | SEC | ROW | SEAT ] grid found on
 * concert tickets, stadium passes, cinema tickets, and gala invitations.
 */
export default function TicketAdmissionMatrix({
  gate = "01",
  section = "VIP",
  row = "A",
  seat = "14",
  isDark = false,
  className = "",
}: TicketAdmissionMatrixProps) {
  return (
    <div
      className={`w-full my-2.5 grid grid-cols-4 border rounded-xl overflow-hidden divide-x select-none shadow-2xs ${
        isDark
          ? "border-neutral-800 divide-neutral-800 bg-neutral-900/70 text-white"
          : "border-neutral-200/90 divide-neutral-200/90 bg-neutral-50/80 text-neutral-900"
      } ${className}`}
      data-admission-matrix="true"
    >
      {/* GATE */}
      <div className="py-2 px-1 text-center">
        <span
          className={`block text-[7.5px] font-mono uppercase tracking-widest font-bold ${
            isDark ? "text-neutral-400" : "text-neutral-500"
          }`}
        >
          GATE
        </span>
        <span className="text-xs font-black tracking-wider font-mono">
          {gate}
        </span>
      </div>

      {/* SEC (Section) */}
      <div className="py-2 px-1 text-center">
        <span
          className={`block text-[7.5px] font-mono uppercase tracking-widest font-bold ${
            isDark ? "text-neutral-400" : "text-neutral-500"
          }`}
        >
          SEC
        </span>
        <span className="text-xs font-black tracking-wider font-mono truncate px-0.5 block">
          {section}
        </span>
      </div>

      {/* ROW */}
      <div className="py-2 px-1 text-center">
        <span
          className={`block text-[7.5px] font-mono uppercase tracking-widest font-bold ${
            isDark ? "text-neutral-400" : "text-neutral-500"
          }`}
        >
          ROW
        </span>
        <span className="text-xs font-black tracking-wider font-mono">
          {row}
        </span>
      </div>

      {/* SEAT */}
      <div className="py-2 px-1 text-center">
        <span
          className={`block text-[7.5px] font-mono uppercase tracking-widest font-bold ${
            isDark ? "text-neutral-400" : "text-neutral-500"
          }`}
        >
          SEAT
        </span>
        <span className="text-xs font-black tracking-wider font-mono">
          {seat}
        </span>
      </div>
    </div>
  );
}
