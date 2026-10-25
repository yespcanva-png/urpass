"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, Sparkles } from "lucide-react";

interface ThermalTicketPrinterProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
  passToken: string;
  isDark?: boolean;
  accentColor?: string;
  className?: string;
}

export default function ThermalTicketPrinter({
  children,
  actions,
  passToken,
  isDark = false,
  accentColor = "#7C3AED",
  className = "",
}: ThermalTicketPrinterProps) {
  // State: 'checking' | 'printing' | 'completed'
  const [stage, setStage] = useState<"checking" | "printing" | "completed">("checking");
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;

    // 1. Respect prefers-reduced-motion
    if (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setStage("completed");
      return;
    }

    // 2. Check single-session visit cache
    const cacheKey = `urpass_pass_printed_${passToken}`;
    try {
      if (typeof window !== "undefined" && sessionStorage.getItem(cacheKey) === "true") {
        setStage("completed");
        return;
      }
    } catch {
      // In restricted private browsing, fallback to normal state
    }

    // 3. Start thermal printing reveal
    setStage("printing");

    const timer = setTimeout(() => {
      setStage("completed");
      try {
        sessionStorage.setItem(cacheKey, "true");
      } catch {
        // Ignore
      }
    }, 1400);

    return () => clearTimeout(timer);
  }, [passToken]);

  const isPrinting = stage === "printing";
  const isCompleted = stage === "completed";

  // Quick skip on click if user is standing at entrance gate
  const handleFastForward = () => {
    if (isPrinting) {
      setStage("completed");
      try {
        sessionStorage.setItem(`urpass_pass_printed_${passToken}`, "true");
      } catch {
        // Ignore
      }
    }
  };

  return (
    <div className={`w-full max-w-sm mx-auto flex flex-col items-center relative ${className}`}>
      {/* Screen Reader Status Notification */}
      <div className="sr-only" aria-live="polite" role="status">
        {isCompleted
          ? "Your official event pass is ready for gate check-in."
          : "Printing your official event pass..."}
      </div>

      {/* ── Sleek Thermal Printer Slot Casing (Hidden when completed or on print) ── */}
      <div
        onClick={handleFastForward}
        className={`w-full max-w-[360px] mx-auto no-print transition-all duration-300 ease-out select-none ${
          isPrinting
            ? "opacity-100 max-h-16 mb-0 cursor-pointer"
            : "opacity-0 max-h-0 pointer-events-none overflow-hidden my-0"
        }`}
        title={isPrinting ? "Click to reveal immediately" : undefined}
      >
        {/* Printer Bezel Top Bar */}
        <div
          className={`w-full px-3 py-1.5 rounded-t-2xl border-t border-x flex items-center justify-between shadow-xs ${
            isDark
              ? "bg-neutral-900 border-neutral-700/80 text-neutral-300"
              : "bg-neutral-900 border-neutral-800 text-neutral-200"
          }`}
        >
          {/* Status Label & LED */}
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full shrink-0 transition-all ${
                isPrinting
                  ? "bg-violet-400 thermal-led-pulse shadow-[0_0_8px_#a855f7]"
                  : "bg-emerald-400 shadow-[0_0_8px_#10b981]"
              }`}
            />
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-neutral-300">
              {isPrinting ? "Printing Event Pass…" : "Pass Verified"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[8px] font-mono font-semibold text-neutral-400">
            <span>THERMAL FEED</span>
            <span>•</span>
            <span className="text-violet-400">300 DPI</span>
          </div>
        </div>

        {/* Printer Mouth / Slit Aperture */}
        <div className="relative h-2 w-full bg-neutral-950 border-x border-b border-neutral-800/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)] overflow-hidden">
          {/* Soft Purple Thermal Heat Glow Line */}
          <div
            className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-[1.5px] bg-gradient-to-r from-transparent via-violet-400 to-transparent blur-[0.5px] thermal-slot-glow"
            style={{
              boxShadow: `0 0 8px ${accentColor || "#7C3AED"}`,
            }}
          />
        </div>
      </div>

      {/* ── Ticket Emergence Viewport ── */}
      <div
        className={`w-full flex justify-center relative transition-all duration-300 ${
          isPrinting ? "overflow-hidden pt-0" : "overflow-visible"
        }`}
      >
        {/* Soft Purple Ambient Emitter Glow */}
        {isPrinting && (
          <div
            className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-10 blur-xl pointer-events-none z-20 opacity-70"
            style={{ backgroundColor: accentColor || "#7C3AED" }}
          />
        )}

        {/* Realistic Paper Slit Drop Shadow */}
        {isPrinting && (
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-neutral-950/30 via-neutral-950/10 to-transparent pointer-events-none z-30" />
        )}

        {/* The Emerging Ticket Pass Card */}
        <div
          className={`w-full flex justify-center ${
            isPrinting ? "thermal-feed-animate" : ""
          }`}
          style={isPrinting ? { transformOrigin: "top center" } : undefined}
        >
          {children}
        </div>
      </div>

      {/* ── Coordinated Action Buttons & Member Hub ── */}
      {actions && (
        <div
          className={`w-full transition-all duration-500 ease-out ${
            isCompleted
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-3 pointer-events-none"
          }`}
        >
          {actions}
        </div>
      )}
    </div>
  );
}
