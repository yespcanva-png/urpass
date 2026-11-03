"use client";

import React from "react";

export type AdmissionMatrixVariant =
  | "standard"
  | "cinema"
  | "boarding"
  | "stadium"
  | "vintage"
  | "vip_gold"
  | "cyber";

interface TicketAdmissionMatrixProps {
  gate?: string;
  section?: string;
  row?: string;
  seat?: string;
  isDark?: boolean;
  className?: string;
  variant?: AdmissionMatrixVariant;
  labels?: {
    c1?: string;
    c2?: string;
    c3?: string;
    c4?: string;
  };
}

const DEFAULT_LABELS: Record<
  AdmissionMatrixVariant,
  { c1: string; c2: string; c3: string; c4: string }
> = {
  standard: { c1: "GATE", c2: "SEC", c3: "ROW", c4: "SEAT" },
  cinema: { c1: "AUDI", c2: "SCREEN", c3: "ROW", c4: "SEAT" },
  boarding: { c1: "GATE", c2: "BOARD", c3: "ZONE", c4: "SEAT" },
  stadium: { c1: "STAND", c2: "BLOCK", c3: "ROW", c4: "SEAT" },
  vintage: { c1: "DOORS", c2: "STAGE", c3: "ROW", c4: "SEAT" },
  vip_gold: { c1: "SUITE", c2: "TABLE", c3: "TIER", c4: "SEAT" },
  cyber: { c1: "NODE", c2: "CLUSTER", c3: "RACK", c4: "PORT" },
};

/**
 * Authentic 4-Compartment Physical Ticket Seating & Admission Matrix
 * Recreates the iconic [ GATE | SEC | ROW | SEAT ] grid found on
 * real-world concert stubs, airline boarding passes, cinema tickets, and stadium passes.
 */
export default function TicketAdmissionMatrix({
  gate = "01",
  section = "VIP",
  row = "A",
  seat = "14",
  isDark = false,
  className = "",
  variant = "standard",
  labels,
}: TicketAdmissionMatrixProps) {
  const activeLabels = {
    c1: labels?.c1 || DEFAULT_LABELS[variant]?.c1 || "GATE",
    c2: labels?.c2 || DEFAULT_LABELS[variant]?.c2 || "SEC",
    c3: labels?.c3 || DEFAULT_LABELS[variant]?.c3 || "ROW",
    c4: labels?.c4 || DEFAULT_LABELS[variant]?.c4 || "SEAT",
  };

  const isGold = variant === "vip_gold";
  const isCyber = variant === "cyber";
  const isCinema = variant === "cinema";
  const isVintage = variant === "vintage";

  const matrixBg = isGold
    ? "bg-gradient-to-r from-amber-950/40 via-neutral-900 to-amber-950/40 text-amber-100 border-amber-500/40 divide-amber-500/30"
    : isCyber
    ? "bg-neutral-950 text-cyan-400 border-cyan-800/60 divide-cyan-800/50"
    : isCinema
    ? isDark
      ? "bg-rose-950/30 text-rose-100 border-rose-900/60 divide-rose-900/50"
      : "bg-rose-50/70 text-neutral-900 border-rose-200 divide-rose-200"
    : isVintage
    ? "bg-amber-100/50 text-amber-950 border-amber-300 divide-amber-300"
    : isDark
    ? "border-neutral-800 divide-neutral-800 bg-neutral-900/70 text-white"
    : "border-neutral-200/90 divide-neutral-200/90 bg-neutral-50/80 text-neutral-900";

  const labelColor = isGold
    ? "text-amber-400"
    : isCyber
    ? "text-cyan-500"
    : isCinema
    ? isDark
      ? "text-rose-400"
      : "text-rose-700"
    : isVintage
    ? "text-amber-800"
    : isDark
    ? "text-neutral-400"
    : "text-neutral-500";

  return (
    <div
      className={`w-full my-2.5 grid grid-cols-4 border rounded-xl overflow-hidden divide-x select-none shadow-2xs ${matrixBg} ${className}`}
      data-admission-matrix="true"
    >
      {/* Compartment 1 (Gate / Audi / Doors / Stand / Suite / Node) */}
      <div className="py-2 px-1 text-center">
        <span
          className={`block text-[7.5px] font-mono uppercase tracking-widest font-bold ${labelColor}`}
        >
          {activeLabels.c1}
        </span>
        <span className="text-xs font-black tracking-wider font-mono">
          {gate}
        </span>
      </div>

      {/* Compartment 2 (Sec / Screen / Board / Block / Stage / Table / Cluster) */}
      <div className="py-2 px-1 text-center">
        <span
          className={`block text-[7.5px] font-mono uppercase tracking-widest font-bold ${labelColor}`}
        >
          {activeLabels.c2}
        </span>
        <span className="text-xs font-black tracking-wider font-mono truncate px-0.5 block">
          {section}
        </span>
      </div>

      {/* Compartment 3 (Row / Zone / Tier / Rack) */}
      <div className="py-2 px-1 text-center">
        <span
          className={`block text-[7.5px] font-mono uppercase tracking-widest font-bold ${labelColor}`}
        >
          {activeLabels.c3}
        </span>
        <span className="text-xs font-black tracking-wider font-mono">
          {row}
        </span>
      </div>

      {/* Compartment 4 (Seat / Port) */}
      <div className="py-2 px-1 text-center">
        <span
          className={`block text-[7.5px] font-mono uppercase tracking-widest font-bold ${labelColor}`}
        >
          {activeLabels.c4}
        </span>
        <span className="text-xs font-black tracking-wider font-mono">
          {seat}
        </span>
      </div>
    </div>
  );
}
