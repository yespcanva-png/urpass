"use client";

import React from "react";
import { MapPin, Calendar, Scissors, Ticket as TicketIcon, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { TicketDesignConfig } from "@/lib/pass-design";
import TicketCutDivider from "@/components/pass/TicketCutDivider";
import TicketBarcode from "@/components/pass/TicketBarcode";

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
  attendeeOrganization?: string;
  attendeePhone?: string;
  attendeeRegNumber?: string;
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
  attendeeOrganization = "TechCorp Labs",
  attendeePhone = "+91 98765 43210",
  attendeeRegNumber = "REG-2026-089",
}: TicketPreviewProps) {
  const isDark = config.template === "dark";
  const isMinimal = config.template === "minimal";
  const isPdf = viewMode === "pdf";

  // Category-specific color override or fallback to primaryColor
  const activeColor =
    (ticketType && config.categoryColors?.[ticketType]) || config.primaryColor;

  // Shape class
  const shapeRadius =
    config.shape === "rounded"
      ? "rounded-[28px]"
      : config.shape === "compact"
      ? "rounded-xl"
      : "rounded-2xl";

  const paddingCls = config.shape === "compact" ? "p-4 sm:p-5" : "p-6";

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

  const isMultiScan = Boolean(config.allow_multiple_scans || config.multi_scan_enabled);

  // Rules text builder
  const rulesList: string[] = [];
  if (isMultiScan) {
    rulesList.push("Allows multiple entry");
  } else if (config.showSingleEntryRule) {
    rulesList.push("Valid for one entry");
  }
  if (config.showGateNotice) rulesList.push("Keep this QR ready at the gate");
  if (config.customInstruction) rulesList.push(config.customInstruction);

  const ticketContent = (
    <div
      className={`relative w-full ${shapeRadius} border ${cardBorder} ${cardBg} overflow-hidden shadow-sm transition-all duration-200 select-none`}
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

      {/* Top Foil Accent Strip */}
      <div
        className="h-2 w-full relative z-10"
        style={{
          background: `linear-gradient(90deg, ${activeColor} 0%, #a855f7 40%, ${activeColor} 70%, #ec4899 100%)`,
        }}
      />

      {/* Ticket Body */}
      <div className={`relative z-10 ${paddingCls} flex flex-col items-center text-center`}>
        {/* Header: Logo, Organization & Serial */}
        <div className="w-full flex items-center justify-between gap-2 mb-3 pb-2 border-b border-dashed border-neutral-200/80 dark:border-neutral-800">
          <div className="flex items-center gap-2 min-w-0">
            {config.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.logoUrl}
                alt="Logo"
                className="h-6 max-w-[110px] object-contain"
              />
            ) : (
              <span
                className="text-[10px] font-black tracking-widest uppercase truncate"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                URPASS
              </span>
            )}

            {config.sponsorLogoUrl && (
              <>
                <span className="text-neutral-300 text-xs">×</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={config.sponsorLogoUrl}
                  alt="Sponsor Logo"
                  className="h-5 max-w-[80px] object-contain opacity-80"
                />
              </>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700">
              {ticketId}
            </span>
          </div>
        </div>

        {/* Event Name */}
        <h2 className="text-lg font-black tracking-tight mb-2 uppercase leading-snug max-w-xs">
          {eventName}
        </h2>

        {/* Ticket Type Pill (Toggled) */}
        {config.showTicketType && (
          <div className="mb-3">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full border shadow-2xs"
              style={{
                borderColor: `${activeColor}40`,
                color: activeColor,
                backgroundColor: `${activeColor}15`,
              }}
            >
              <TicketIcon className="w-3.5 h-3.5" />
              {ticketType}
            </span>
          </div>
        )}

        {/* Structured Real Ticket Metadata Grid */}
        <div className="w-full grid grid-cols-2 gap-2 text-left my-1 p-3 rounded-2xl bg-neutral-50/90 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800/80 shadow-2xs">
          {/* Date & Time */}
          {config.showEventDate !== false && eventDate && (
            <div className="min-w-0">
              <p className="text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5" />
                <span>SCHEDULE</span>
              </p>
              <p className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 truncate mt-0.5">
                {eventDate}
              </p>
            </div>
          )}

          {/* Venue */}
          {config.showVenue && venue && (
            <div className="min-w-0">
              <p className="text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />
                <span>LOCATION</span>
              </p>
              <p className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 truncate mt-0.5" title={venue}>
                {venue}
              </p>
            </div>
          )}

          {/* Attendee */}
          {config.showAttendeeName && (
            <div className="min-w-0">
              <p className="text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                DELEGATE
              </p>
              <p className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 truncate mt-0.5">
                {attendeeName}
              </p>
              {config.showOrganization && attendeeOrganization && (
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                  {attendeeOrganization}
                </p>
              )}
            </div>
          )}

          {/* Serial / Reg */}
          <div className="min-w-0">
            <p className="text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              CREDENTIAL
            </p>
            <p className="text-[11px] font-mono font-bold text-neutral-900 dark:text-neutral-100 truncate mt-0.5">
              {ticketId}
            </p>
            {config.showRegistrationNumber && attendeeRegNumber && (
              <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                {attendeeRegNumber}
              </p>
            )}
          </div>
        </div>

        {/* Custom Message */}
        {config.customMessage && (
          <div className="mt-2 pt-1.5 border-t border-dashed border-neutral-200/80 dark:border-neutral-800 w-full">
            <p className="text-xs italic opacity-85 max-w-xs mx-auto">
              &ldquo;{config.customMessage}&rdquo;
            </p>
          </div>
        )}

        {/* Ticket Rules Strip */}
        {rulesList.length > 0 && (
          <div className={`mt-2 pt-2 border-t ${dividerCls} w-full text-[10px] ${subtextCls} leading-relaxed`}>
            <p className="font-medium">{rulesList.join(" • ")}</p>
            {config.showTermsLink && (
              <p className="mt-0.5 underline opacity-70 cursor-pointer">
                Event Terms &amp; Conditions apply
              </p>
            )}
            {config.showOrganizerContact && (
              <p className="mt-0.5 opacity-70">
                Need help? Contact the event organizer
              </p>
            )}
          </div>
        )}

        {/* ✂ REAL TICKET CUT: Semicircular Punch Notches + Perforated Rip Line */}
        <TicketCutDivider
          isDark={isDark}
          label="ADMIT ONE · TEAR OR SCAN"
          cutoutColor={isPdf ? "#f3f4f6" : (isDark ? "#0f131d" : "#f1f5f9")}
          negativeMarginCls="-mx-4 sm:-mx-6"
        />

        {/* ══════════════════════════════════════════════════════════ */}
        {/* SCANNABLE ADMISSION STUB (TEAR-OFF SECTION) */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="w-full flex flex-col items-center">
          {/* Large Centered QR Code Card with clean contrast and alignment crosshairs */}
          <div className="my-1 flex flex-col items-center">
            <div
              className="p-3.5 bg-white rounded-2xl shadow-xs border border-neutral-200/80 flex flex-col items-center justify-center relative"
              title={`QR Value: ${qrValue}`}
              data-qr-value={qrValue}
            >
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-brand/70 rounded-tl-xs pointer-events-none" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-brand/70 rounded-tr-xs pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-brand/70 rounded-bl-xs pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-brand/70 rounded-br-xs pointer-events-none" />

              <div className="w-32 h-32 flex flex-col justify-between">
                {qrPattern.map((row, rIdx) => (
                  <div key={rIdx} className="flex justify-between w-full h-[6.5px]">
                    {row.map((cell, cIdx) => (
                      <div
                        key={cIdx}
                        className={`w-[6.5px] h-[6.5px] ${cell === 1 ? "bg-black" : "bg-white"}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <span className="text-[8px] font-black tracking-widest text-neutral-400 uppercase mt-2">
                SCAN FOR ENTRY
              </span>
            </div>
          </div>

          {/* Realistic Linear Barcode Graphic Strip */}
          <div className="w-full my-2 px-3 py-2 rounded-xl bg-neutral-50/90 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800">
            <TicketBarcode
              code={ticketId.replace('#', '')}
              isDark={isDark}
              height={30}
              showText={true}
            />
          </div>

          {/* Real-time Status Strip */}
          <div className="w-full mt-1">
            <div
              className="w-full flex items-center gap-1.5 rounded-xl px-3 py-2 justify-center text-[10px] font-bold shadow-2xs"
              style={{
                backgroundColor: `${activeColor}12`,
                color: activeColor,
                border: `1px solid ${activeColor}25`,
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>AUTHENTICATED PASS · READY FOR SCAN</span>
            </div>
          </div>

          {/* Security Microprint Disclaimer */}
          <p className="text-[8px] font-mono tracking-wider uppercase text-neutral-400 dark:text-neutral-500 text-center mt-2">
            OFFICIAL ADMISSION TICKET · VALID FOR ENTRY · URPASS
          </p>
        </div>
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
