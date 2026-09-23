"use client";

import React from "react";
import { MapPin, Calendar, Scissors, Ticket as TicketIcon } from "lucide-react";
import type { TicketDesignConfig } from "@/lib/pass-design";

interface TicketPreviewProps {
  config: TicketDesignConfig;
  viewMode?: "mobile" | "pdf";
  eventName?: string;
  eventDate?: string;
  venue?: string;
  attendeeName?: string;
  ticketType?: string;
  ticketId?: string;
  qrValue?: string;
}

export default function TicketPreview({
  config,
  viewMode = "mobile",
  eventName = "URPASS SUMMIT",
  eventDate = "24 OCT 2026 | 10:00 AM",
  venue = "The Residency, Coimbatore",
  attendeeName = "Srinithin S",
  ticketType = "VIP PASS",
  ticketId = "#URP-10284",
  qrValue = "URP_x8K2pQ91Lm",
}: TicketPreviewProps) {
  const isDark = config.template === "dark";
  const isMinimal = config.template === "minimal";
  const isPdf = viewMode === "pdf";

  // Card theme classes
  const cardBg = isDark ? "bg-[#121216] text-white" : "bg-white text-neutral-900";
  const cardBorder = isDark
    ? "border-neutral-800"
    : isMinimal
    ? "border-neutral-200"
    : "border-neutral-200/90";
  const subtextCls = isDark ? "text-neutral-400" : "text-neutral-500";
  const dividerCls = isDark ? "border-neutral-800" : "border-neutral-100";

  // Visual QR matrix generated deterministically
  const qrPattern = [
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1],
  ];

  const ticketContent = (
    <div
      className={`relative w-full rounded-2xl border ${cardBorder} ${cardBg} overflow-hidden shadow-sm transition-all duration-200 select-none`}
      style={{
        boxShadow: isDark
          ? "0 4px 24px -2px rgba(0, 0, 0, 0.5)"
          : "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Optional Background Image with contrast-preserving overlay */}
      {config.backgroundImageUrl && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.backgroundImageUrl}
            alt="Ticket Background"
            className="w-full h-full object-cover opacity-15"
          />
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-gradient-to-b from-[#121216]/90 via-[#121216]/80 to-[#121216]/95"
                : "bg-gradient-to-b from-white/90 via-white/85 to-white/95"
            }`}
          />
        </div>
      )}

      {/* Top Accent Strip (Modern template only) */}
      {config.template === "modern" && (
        <div
          className="h-1.5 w-full relative z-10"
          style={{ backgroundColor: config.primaryColor }}
        />
      )}

      {/* Ticket Body */}
      <div className="relative z-10 p-6 flex flex-col items-center text-center">
        {/* Logo / Brand Header */}
        <div className="mb-4 flex items-center justify-center">
          {config.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={config.logoUrl}
              alt="Logo"
              className="h-7 max-w-[120px] object-contain"
            />
          ) : (
            <span
              className="text-[11px] font-black tracking-widest uppercase"
              style={{ color: isDark ? "#ffffff" : "#111827" }}
            >
              URPASS
            </span>
          )}
        </div>

        {/* Event Name */}
        <h2 className="text-xl font-bold tracking-tight mb-2 uppercase leading-snug max-w-xs">
          {eventName}
        </h2>

        {/* Event Date & Time */}
        <p className={`text-xs font-semibold tracking-wide ${subtextCls} mb-1 flex items-center gap-1.5`}>
          <Calendar className="w-3.5 h-3.5 opacity-70 shrink-0" />
          <span>{eventDate}</span>
        </p>

        {/* Venue (Toggled) */}
        {config.showVenue && venue && (
          <p className={`text-xs ${subtextCls} flex items-center gap-1.5 mb-5`}>
            <MapPin className="w-3.5 h-3.5 opacity-70 shrink-0" />
            <span className="truncate max-w-[240px]">{venue}</span>
          </p>
        )}

        {/* Divider */}
        <div className={`w-full border-t ${dividerCls} my-2`} />

        {/* Large Centered QR Code with plenty of clean white space */}
        <div className="my-4 flex flex-col items-center">
          <div
            className="p-4 bg-white rounded-xl shadow-xs border border-neutral-100 flex items-center justify-center"
            title={`QR Value: ${qrValue}`}
            data-qr-value={qrValue}
          >
            <div className="w-36 h-36 flex flex-col justify-between">
              {qrPattern.map((row, rIdx) => (
                <div key={rIdx} className="flex justify-between w-full h-[7px]">
                  {row.map((cell, cIdx) => (
                    <div
                      key={cIdx}
                      className={`w-[7px] h-[7px] ${cell === 1 ? "bg-black" : "bg-white"}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendee Name (Toggled) */}
        {config.showAttendeeName && (
          <div className="mt-1 mb-2">
            <p className="text-base font-bold tracking-tight">
              {attendeeName}
            </p>
          </div>
        )}

        {/* Ticket Type Pill (Toggled) */}
        {config.showTicketType && (
          <div className="mb-4">
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border"
              style={{
                borderColor: `${config.primaryColor}30`,
                color: config.primaryColor,
                backgroundColor: `${config.primaryColor}12`,
              }}
            >
              <TicketIcon className="w-3 h-3" />
              {ticketType}
            </span>
          </div>
        )}

        {/* Divider */}
        {config.showTicketId && (
          <div className={`w-full border-t ${dividerCls} pt-3 mt-1 flex flex-col items-center gap-0.5`}>
            <span className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">
              TICKET ID
            </span>
            <span className="text-xs font-mono font-semibold tracking-wider">
              {ticketId}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // Mobile Representation
  if (!isPdf) {
    return (
      <div className="w-full max-w-[320px] mx-auto py-2">
        {ticketContent}
      </div>
    );
  }

  // PDF / Print Representation
  return (
    <div className="w-full max-w-[420px] mx-auto bg-white border border-neutral-300 rounded-lg p-6 shadow-sm text-neutral-900 font-sans select-none">
      {/* Printable Sheet Header */}
      <div className="border-b border-neutral-200 pb-3 mb-5 flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-neutral-900 tracking-wider">URPASS</span>
          <span>·</span>
          <span>Official Event Ticket</span>
        </div>
        <span className="font-mono text-[10px] text-neutral-400">A4 / Letter Format</span>
      </div>

      {/* Ticket Cutout Box with dashed border */}
      <div className="relative border-2 border-dashed border-neutral-300 rounded-2xl p-4 bg-neutral-50/50">
        <div className="absolute -top-3 left-4 bg-white px-2 flex items-center gap-1 text-[10px] font-semibold text-neutral-400">
          <Scissors className="w-3 h-3" />
          <span>Cut along line</span>
        </div>

        {/* Embedded Ticket */}
        <div className="max-w-[300px] mx-auto">
          {ticketContent}
        </div>
      </div>

      {/* Printable Instructions */}
      <div className="mt-4 pt-3 text-[11px] text-neutral-400 text-center leading-relaxed">
        Present this printed ticket or show the digital pass on your smartphone at the registration desk for scan.
      </div>
    </div>
  );
}
