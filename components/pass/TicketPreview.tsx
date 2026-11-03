"use client";

import React from "react";
import {
  MapPin,
  Calendar,
  Scissors,
  Ticket as TicketIcon,
  ShieldCheck,
  Plane,
  Film,
  Trophy,
  Flame,
  Award,
  Sparkles,
} from "lucide-react";
import type { TicketDesignConfig, TicketRealStyle } from "@/lib/pass-design";
import TicketCutDivider from "@/components/pass/TicketCutDivider";
import TicketSecurityPattern from "@/components/pass/TicketSecurityPattern";
import TicketAdmissionMatrix from "@/components/pass/TicketAdmissionMatrix";
import TicketBarcode from "@/components/pass/TicketBarcode";
import TicketStamp from "@/components/pass/TicketStamp";

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
  const effectiveStyle: TicketRealStyle =
    config.ticketStyle ||
    (config.template === "dark"
      ? "vip_gold"
      : config.template === "minimal"
      ? "executive"
      : "concert");

  const isDark =
    config.template === "dark" ||
    effectiveStyle === "vip_gold" ||
    effectiveStyle === "cyber" ||
    (effectiveStyle === "concert" && config.template !== "minimal");

  const isPdf = viewMode === "pdf";

  // Category-specific color override or fallback to primaryColor
  const activeColor =
    (ticketType && config.categoryColors?.[ticketType]) || config.primaryColor || "#635BFF";

  // Shape class
  const shapeRadius =
    config.shape === "rounded"
      ? "rounded-[28px]"
      : config.shape === "compact"
      ? "rounded-xl"
      : "rounded-2xl";

  const paddingCls = config.shape === "compact" ? "p-4 sm:p-5" : "p-6";

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
  if (config.showGateNotice) rulesList.push("Keep QR ready at gate");
  if (config.customInstruction) rulesList.push(config.customInstruction);

  // Archetype Theme Config
  function getThemeConfig() {
    switch (effectiveStyle) {
      case "cinema":
        return {
          cardBg: "bg-white dark:bg-[#121218] text-neutral-900 dark:text-neutral-50",
          cardBorder: "border-rose-200 dark:border-rose-950",
          subtextCls: "text-neutral-500 dark:text-neutral-400",
          dividerCls: "border-neutral-200/80 dark:border-neutral-800",
          headerBanner: (
            <div className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white px-4 py-2 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-1.5 text-[8px] font-mono font-bold tracking-widest uppercase">
                <Film className="w-3 h-3 shrink-0" />
                <span>CINEMA PREMIERE PASS · SCREEN 03</span>
              </div>
              <span className="text-[7.5px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded-full">
                DOLBY ATMOS
              </span>
            </div>
          ),
          stamp: (
            <TicketStamp
              text="BOX OFFICE"
              subtext="PREMIERE ADMISSION"
              variant="red"
              angle={-8}
              className="absolute top-12 right-3 z-20"
            />
          ),
          matrixVariant: "cinema" as const,
          categoryBadgeBg: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900",
          cutoutColor: isPdf ? "#f3f4f6" : "#f8fafc",
        };

      case "boarding":
        return {
          cardBg: "bg-white dark:bg-[#0c121e] text-neutral-900 dark:text-neutral-50",
          cardBorder: "border-sky-200 dark:border-sky-950",
          subtextCls: "text-neutral-500 dark:text-neutral-400",
          dividerCls: "border-neutral-200/80 dark:border-neutral-800",
          headerBanner: (
            <div className="w-full bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700 text-white px-4 py-2 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-1.5 text-[8px] font-mono font-bold tracking-widest uppercase">
                <Plane className="w-3 h-3 shrink-0" />
                <span>BOARDING PASS · SUMMIT EXPRESS</span>
              </div>
              <span className="text-[7.5px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded-full">
                PRIORITY
              </span>
            </div>
          ),
          stamp: (
            <TicketStamp
              text="BOARDING APPROVED"
              subtext="GATE CLEARANCE"
              variant="blue"
              angle={-6}
              className="absolute top-12 right-3 z-20"
            />
          ),
          matrixVariant: "boarding" as const,
          categoryBadgeBg: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-900",
          cutoutColor: isPdf ? "#f3f4f6" : "#f8fafc",
        };

      case "vip_gold":
        return {
          cardBg: "bg-[#0c0d12] text-amber-100",
          cardBorder: "border-amber-500/40",
          subtextCls: "text-amber-200/70",
          dividerCls: "border-amber-900/40",
          headerBanner: (
            <div className="w-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 text-neutral-950 px-4 py-1.5 flex items-center justify-between font-bold text-[8px] font-mono tracking-widest uppercase shadow-xs">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 shrink-0" />
                <span>★ VIP ALL-ACCESS GALA PASS ★</span>
              </div>
              <span className="text-[7px] font-black tracking-widest bg-black/15 px-1.5 py-0.5 rounded">
                LIMITED EDITION
              </span>
            </div>
          ),
          stamp: (
            <TicketStamp
              text="VIP ADMISSION"
              subtext="GOLDEN ALL-ACCESS"
              variant="gold"
              angle={-6}
              className="absolute top-12 right-3 z-20"
            />
          ),
          matrixVariant: "vip_gold" as const,
          categoryBadgeBg: "bg-amber-950/70 text-amber-300 border-amber-500/50",
          cutoutColor: "#0c0d12",
        };

      case "stadium":
        return {
          cardBg: "bg-white dark:bg-[#0c1613] text-neutral-900 dark:text-neutral-50",
          cardBorder: "border-emerald-200 dark:border-emerald-950",
          subtextCls: "text-neutral-500 dark:text-neutral-400",
          dividerCls: "border-neutral-200/80 dark:border-neutral-800",
          headerBanner: (
            <div className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-4 py-2 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-1.5 text-[8px] font-mono font-bold tracking-widest uppercase">
                <Trophy className="w-3 h-3 shrink-0" />
                <span>MATCHDAY ARENA TICKET · TURNSTILE ENTRY</span>
              </div>
              <span className="text-[7.5px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded-full">
                STAND EAST
              </span>
            </div>
          ),
          stamp: (
            <TicketStamp
              text="MATCHDAY ENTRY"
              subtext="EAST TURNSTILE"
              variant="emerald"
              angle={-7}
              className="absolute top-12 right-3 z-20"
            />
          ),
          matrixVariant: "stadium" as const,
          categoryBadgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900",
          cutoutColor: isPdf ? "#f3f4f6" : "#f8fafc",
        };

      case "vintage":
        return {
          cardBg: "bg-[#FFFDF6] text-amber-950",
          cardBorder: "border-amber-300 shadow-amber-900/5",
          subtextCls: "text-amber-800/80",
          dividerCls: "border-amber-200",
          headerBanner: (
            <div className="w-full bg-amber-200/90 text-amber-900 border-b border-amber-300 px-4 py-1.5 flex items-center justify-between font-mono font-bold text-[8px] tracking-widest uppercase shadow-2xs">
              <span>★ ADMIT ONE ★ VINTAGE PASS</span>
              <span className="font-extrabold text-red-700">№ 049281</span>
            </div>
          ),
          stamp: (
            <TicketStamp
              text="ADMIT ONE"
              subtext="SERIES 2026-A"
              variant="red"
              angle={-9}
              className="absolute top-12 right-3 z-20"
            />
          ),
          matrixVariant: "vintage" as const,
          categoryBadgeBg: "bg-amber-100 text-amber-900 border-amber-400 font-bold",
          cutoutColor: isPdf ? "#f3f4f6" : "#f8fafc",
        };

      case "cyber":
        return {
          cardBg: "bg-[#09090e] text-cyan-50",
          cardBorder: "border-cyan-800/70 shadow-cyan-950/30",
          subtextCls: "text-cyan-400/70",
          dividerCls: "border-cyan-950",
          headerBanner: (
            <div className="w-full bg-gradient-to-r from-cyan-950 via-purple-950 to-neutral-950 text-cyan-300 border-b border-cyan-800/60 px-4 py-1.5 flex items-center justify-between font-mono font-bold text-[8px] tracking-widest uppercase shadow-xs">
              <span className="text-cyan-400">// CRYPTO_PASS_V2</span>
              <span className="text-emerald-400">STATUS: VERIFIED</span>
            </div>
          ),
          stamp: (
            <TicketStamp
              text="ROOT ACCESS"
              subtext="0x8F42_VERIFIED"
              variant="emerald"
              angle={-5}
              className="absolute top-12 right-3 z-20"
            />
          ),
          matrixVariant: "cyber" as const,
          categoryBadgeBg: "bg-cyan-950 text-cyan-300 border-cyan-700",
          cutoutColor: "#09090e",
        };

      case "executive":
        return {
          cardBg: isDark ? "bg-[#111317] text-white" : "bg-white text-neutral-900",
          cardBorder: isDark ? "border-neutral-800" : "border-neutral-200",
          subtextCls: isDark ? "text-neutral-400" : "text-neutral-500",
          dividerCls: isDark ? "border-neutral-800" : "border-neutral-100",
          headerBanner: (
            <div className="w-full bg-neutral-900 text-white dark:bg-neutral-800 px-4 py-1.5 flex items-center justify-between font-mono font-bold text-[8px] tracking-widest uppercase shadow-xs">
              <span>★ OFFICIAL EXECUTIVE PASS</span>
              <span className="text-neutral-400">{ticketId}</span>
            </div>
          ),
          stamp: (
            <TicketStamp
              text="EXECUTIVE CLEARANCE"
              subtext="DELEGATE 2026"
              variant="blue"
              angle={-6}
              className="absolute top-12 right-3 z-20"
            />
          ),
          matrixVariant: "standard" as const,
          categoryBadgeBg: "bg-neutral-100 text-neutral-800 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700",
          cutoutColor: isPdf ? "#f3f4f6" : (isDark ? "#111317" : "#f8fafc"),
        };

      case "concert":
      default:
        return {
          cardBg: isDark ? "bg-[#121217] text-white" : "bg-white text-neutral-900",
          cardBorder: isDark ? "border-neutral-800" : "border-neutral-200",
          subtextCls: isDark ? "text-neutral-400" : "text-neutral-500",
          dividerCls: isDark ? "border-neutral-800" : "border-neutral-100",
          headerBanner: (
            <div
              className="w-full relative z-10 py-1.5 px-3.5 flex items-center justify-between text-[7.5px] font-mono font-bold tracking-widest uppercase overflow-hidden shadow-xs"
              style={{
                background: isDark
                  ? "linear-gradient(90deg, #b45309 0%, #d4af37 30%, #fef08a 50%, #d4af37 70%, #b45309 100%)"
                  : `linear-gradient(90deg, ${activeColor} 0%, #a855f7 35%, ${activeColor} 70%, #ec4899 100%)`,
                color: isDark ? "#451a03" : "#ffffff",
              }}
            >
              <span className="truncate">★ OFFICIAL LIVE ADMISSION PASS</span>
              <span className="font-extrabold tracking-[0.2em] shrink-0">SECURE QR • URPASS</span>
            </div>
          ),
          stamp: (
            <TicketStamp
              text="LIVE CONCERT"
              subtext="ADMIT ONE · VALIDATED"
              variant="red"
              angle={-6}
              className="absolute top-12 right-3 z-20"
            />
          ),
          matrixVariant: "standard" as const,
          categoryBadgeBg: "border shadow-2xs",
          cutoutColor: isPdf ? "#f3f4f6" : (isDark ? "#121217" : "#f1f5f9"),
        };
    }
  }

  const theme = getThemeConfig();

  const ticketContent = (
    <div
      className={`relative w-full ${shapeRadius} border ${theme.cardBorder} ${theme.cardBg} overflow-hidden shadow-sm transition-all duration-200 select-none`}
      style={{
        boxShadow: isDark
          ? "0 4px 24px -2px rgba(0, 0, 0, 0.5)"
          : "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* SVG Banknote Guilloche Security Pattern Background */}
      <TicketSecurityPattern isDark={isDark} opacity={0.045} />

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

      {/* Authentic Archetype Header Banner */}
      {theme.headerBanner}

      {/* Box Office Rubber Stamp Watermark */}
      {theme.stamp}

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

        {/* Ticket Type Pill */}
        {config.showTicketType && (
          <div className="mb-2">
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full ${theme.categoryBadgeBg}`}
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

        {/* 4-Compartment Authentic Seating & Admission Matrix */}
        <TicketAdmissionMatrix
          gate="01"
          section={ticketType.replace(/pass|ticket/gi, "").trim() || "VIP"}
          row="A"
          seat="12"
          isDark={isDark}
          variant={theme.matrixVariant}
        />

        {/* Structured Real Ticket Metadata Grid */}
        <div className="w-full grid grid-cols-2 gap-2 text-left my-1 p-3 rounded-2xl bg-neutral-50/90 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800/80 shadow-2xs">
          {/* Date & Time */}
          {config.showEventDate !== false && eventDate && (
            <div className="min-w-0">
              <p className={`text-[8px] font-mono font-bold uppercase tracking-wider ${theme.subtextCls} flex items-center gap-1`}>
                <Calendar className="w-2.5 h-2.5" />
                <span>SCHEDULE</span>
              </p>
              <p className="text-[11px] font-bold truncate mt-0.5">
                {eventDate}
              </p>
            </div>
          )}

          {/* Venue */}
          {config.showVenue && venue && (
            <div className="min-w-0">
              <p className={`text-[8px] font-mono font-bold uppercase tracking-wider ${theme.subtextCls} flex items-center gap-1`}>
                <MapPin className="w-2.5 h-2.5" />
                <span>LOCATION</span>
              </p>
              <p className="text-[11px] font-bold truncate mt-0.5" title={venue}>
                {venue}
              </p>
            </div>
          )}

          {/* Attendee */}
          {config.showAttendeeName && (
            <div className="min-w-0">
              <p className={`text-[8px] font-mono font-bold uppercase tracking-wider ${theme.subtextCls}`}>
                DELEGATE / HOLDER
              </p>
              <p className="text-[11px] font-bold truncate mt-0.5">
                {attendeeName}
              </p>
              {config.showOrganization && attendeeOrganization && (
                <p className="text-[10px] opacity-75 truncate">
                  {attendeeOrganization}
                </p>
              )}
              {config.showPhone && attendeePhone && (
                <p className="text-[10px] font-mono opacity-75 truncate mt-0.5">
                  {attendeePhone}
                </p>
              )}
            </div>
          )}

          {/* Serial / Reg */}
          <div className="min-w-0">
            <p className={`text-[8px] font-mono font-bold uppercase tracking-wider ${theme.subtextCls}`}>
              CREDENTIAL
            </p>
            <p className="text-[11px] font-mono font-bold truncate mt-0.5">
              {ticketId}
            </p>
            {config.showRegistrationNumber && attendeeRegNumber && (
              <p className="text-[10px] font-mono opacity-75">
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
          <div className={`mt-2 pt-2 border-t ${theme.dividerCls} w-full text-[10px] ${theme.subtextCls} leading-relaxed`}>
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
          cutoutColor={theme.cutoutColor}
          negativeMarginCls="-mx-4 sm:-mx-6"
        />

        {/* ══════════════════════════════════════════════════════════ */}
        {/* SCANNABLE ADMISSION STUB (TEAR-OFF SECTION) */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="w-full flex flex-col items-center pt-0.5">
          <div className="w-full flex items-center justify-between mb-1.5 px-0.5 text-[7.5px] font-mono">
            <span className="font-bold uppercase tracking-widest opacity-60">
              ADMISSION COUNTERFOIL
            </span>
            <span className="font-bold text-rose-600 dark:text-rose-400 tracking-wider uppercase">
              KEEP THIS COUPON
            </span>
          </div>

          {/* Large Centered QR Code Card with clean contrast and alignment crosshairs */}
          <div className="my-1 flex flex-col items-center">
            <div
              className="p-3.5 bg-white rounded-2xl shadow-xs border border-neutral-200/80 flex flex-col items-center justify-center relative"
              title={`QR Value: ${qrValue}`}
              data-qr-value={qrValue}
            >
              {/* Corner scanner brackets */}
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

          {/* Code-128 Linear Barcode on Counterfoil Stub */}
          <div className="w-full py-1">
            <TicketBarcode code={ticketId.replace(/[^A-Z0-9-]/gi, "")} isDark={isDark} height={26} showText={true} />
          </div>

          {/* Executive Security Credential Pill */}
          <div className="w-full my-2.5 px-3.5 py-2 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase opacity-75">
                CREDENTIAL
              </span>
            </div>
            <span className="text-[10px] font-mono font-extrabold tracking-wider">
              {ticketId}
            </span>
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
          <p className="text-[8px] font-mono tracking-wider uppercase opacity-60 text-center mt-2">
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
