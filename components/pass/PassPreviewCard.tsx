"use client";

import React from "react";
import {
  CalendarDays,
  MapPin,
  CheckCircle,
  Ticket,
  ShieldCheck,
  Award,
  Crown,
  Lock,
  Building2,
  CheckCircle2,
} from "lucide-react";
import {
  type CustomPassDesign,
  getPatternStyle,
  getFontFamilyCls,
  darkenHex,
} from "@/lib/pass-design";
import { RealisticLanyardClip } from "@/components/templates/TicketVisualShowcase";

interface PassPreviewCardProps {
  design: CustomPassDesign;
  orgName?: string;
  orgLogoUrl?: string;
  eventName?: string;
  eventDate?: string;
  venue?: string;
  attendeeName?: string;
  attendeeEmail?: string;
  shortCode?: string;
  customTicketId?: string;
  showBranding?: boolean;
}

export default function PassPreviewCard({
  design,
  orgName = "ACME SUMMIT",
  orgLogoUrl = "",
  eventName = "NextGen AI & Cloud Summit 2026",
  eventDate = "Saturday, 24 October 2026 · 10:00 AM",
  venue = "Tech Park Convention Hall, Bangalore",
  attendeeName = "Arun Kumar",
  attendeeEmail = "arun.kumar@example.com",
  shortCode = "8F42-99B1",
  customTicketId,
  showBranding = true,
}: PassPreviewCardProps) {
  const displayTicketCode = customTicketId || `#${shortCode}`;
  const fontCls = getFontFamilyCls(design.fontFamily || "sans");
  const patternStyle = getPatternStyle(
    design.pattern || "radial",
    design.primaryColor,
    design.secondaryColor || darkenHex(design.primaryColor, 35),
    design.headerStyle || "gradient"
  );

  const badgeText = design.badgeLabel || "EVENT PASS";
  const darkSecondary = darkenHex(design.primaryColor, 45);

  // Outer ambient glow style if enabled
  const glowStyle: React.CSSProperties = design.accentGlow
    ? {
        boxShadow: `0 20px 50px -10px ${design.primaryColor}25, 0 10px 20px -5px ${design.secondaryColor}15`,
      }
    : {
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.08)",
      };

  // ─────────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────
  // 1. EXECUTIVE BOARDING PASS THEME ("classic")
  // ─────────────────────────────────────────────────────────────
  if (design.theme === "classic") {
    return (
      <div
        className={`w-full max-w-[340px] mx-auto rounded-[28px] bg-white/85 dark:bg-[#0F131D]/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 overflow-hidden transition-all duration-300 select-none shadow-2xl ${fontCls}`}
        style={glowStyle}
      >
        {/* Banner Cover Image if provided */}
        {design.bannerUrl && (
          <div className="w-full h-24 overflow-hidden border-b border-white/20 bg-neutral-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={design.bannerUrl}
              alt="Pass Banner"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Executive Header Band */}
        <div className="px-5 pt-5 pb-5 relative overflow-hidden text-white backdrop-blur-md" style={patternStyle}>
          <div className="relative flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {orgLogoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={orgLogoUrl}
                  alt="Org Logo"
                  className="w-5 h-5 rounded-md object-cover ring-1 ring-white/30"
                />
              ) : (
                <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center">
                  <Building2 className="w-3 h-3 text-white" />
                </div>
              )}
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/90">
                {orgName || "URPASS EXECUTIVE"}
              </span>
            </div>

            <span className="text-[9px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 flex items-center gap-1 shadow-2xs">
              <ShieldCheck className="w-2.5 h-2.5" />
              <span>{badgeText}</span>
            </span>
          </div>

          <h3 className="text-base font-bold text-white leading-tight mb-3 line-clamp-2">
            {eventName}
          </h3>

          {/* Structured Two-Compartment Info */}
          <div className="grid grid-cols-2 gap-2 text-[10px] bg-black/25 backdrop-blur-md rounded-xl p-2.5 border border-white/15 text-white/90 shadow-inner">
            <div>
              <p className="text-[8px] font-bold tracking-wider uppercase text-white/60">DATE &amp; TIME</p>
              <p className="font-semibold truncate">{eventDate}</p>
            </div>
            <div>
              <p className="text-[8px] font-bold tracking-wider uppercase text-white/60">VENUE / HALL</p>
              <p className="font-semibold truncate">{venue}</p>
            </div>
          </div>
        </div>

        {/* Micro-perforated coupon notch line */}
        <div className="relative h-4 bg-transparent flex items-center">
          <div className="absolute -left-2.5 w-5 h-5 rounded-full bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800 backdrop-blur-sm" />
          <div className="absolute -right-2.5 w-5 h-5 rounded-full bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800 backdrop-blur-sm" />
          <div className="w-full border-t border-dashed border-neutral-300/80 dark:border-neutral-700 mx-5" />
        </div>

        {/* Ticket Body */}
        <div className="px-5 pb-5 flex flex-col items-center">
          {/* Attendee Details Card */}
          <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-md border border-neutral-200/70 dark:border-white/10 mb-3 shadow-2xs">
            <div className="min-w-0 pr-2">
              <p className="text-[8px] font-bold tracking-widest uppercase text-neutral-400">
                PASS HOLDER
              </p>
              <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                {attendeeName}
              </p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">{attendeeEmail}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-lg bg-white/90 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 shadow-2xs">
                {displayTicketCode}
              </span>
            </div>
          </div>

          {/* QR Code Container */}
          <div
            className={`p-3.5 rounded-2xl bg-white/90 dark:bg-white/95 backdrop-blur-md mb-2 shadow-xs ${
              design.showQrBorder
                ? "border-2"
                : "border border-neutral-200/80"
            }`}
            style={{
              borderColor: design.showQrBorder ? design.primaryColor : undefined,
            }}
          >
            <div className="w-32 h-32 bg-white rounded-xl flex flex-col items-center justify-center p-2 border border-neutral-100">
              <div className="w-24 h-24 grid grid-cols-6 grid-rows-6 gap-1 p-1">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-xs ${
                      [0, 1, 2, 6, 8, 12, 13, 14, 21, 22, 23, 27, 29, 33, 34, 35, 17, 18].includes(
                        i
                      )
                        ? "bg-neutral-900"
                        : "bg-neutral-100"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="text-[9px] font-mono font-bold tracking-widest text-neutral-400 mb-3">
            SCAN AT ENTRANCE TERMINAL
          </p>

          {/* Status Strip */}
          <div
            className="w-full py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold text-white mb-3 shadow-sm backdrop-blur-sm"
            style={{
              background: `linear-gradient(135deg, ${design.primaryColor} 0%, ${darkSecondary} 100%)`,
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            <span>ACTIVE BOARDING CREDENTIAL</span>
          </div>

          {design.footerNote && (
            <p className="text-[9px] text-center text-neutral-400 leading-normal px-2">
              {design.footerNote}
            </p>
          )}

          {showBranding && (
            <p className="text-[8px] text-neutral-300 dark:text-neutral-600 font-bold tracking-widest uppercase mt-3">
              URPASS DIGITAL CREDENTIAL
            </p>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. ENTERPRISE MODERN WALLET THEME ("modern")
  // ─────────────────────────────────────────────────────────────
  if (design.theme === "modern") {
    return (
      <div
        className={`w-full max-w-[340px] mx-auto rounded-[30px] bg-white/85 dark:bg-[#0F131D]/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 overflow-hidden shadow-2xl transition-all duration-300 select-none ${fontCls}`}
        style={glowStyle}
      >
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full" style={{ backgroundColor: design.primaryColor }} />

        {/* Corporate Header */}
        <div className="px-6 pt-5 pb-5 relative overflow-hidden backdrop-blur-md" style={patternStyle}>
          <div className="flex items-center justify-between mb-3 text-white">
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/90">
              {orgName || "ENTERPRISE PASS"}
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/25 shadow-2xs">
              <Award className="w-2.5 h-2.5" />
              {badgeText}
            </span>
          </div>

          <h3 className="text-lg font-black text-white leading-tight mb-3">
            {eventName}
          </h3>

          <div className="p-2.5 rounded-xl bg-black/25 backdrop-blur-md border border-white/15 flex flex-col gap-1 text-[10px] text-white/90 shadow-inner">
            <div className="flex items-center gap-1.5 truncate">
              <CalendarDays className="w-3 h-3 text-white/80 shrink-0" />
              <span className="truncate">{eventDate}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3 h-3 text-white/80 shrink-0" />
              <span className="truncate">{venue}</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="px-6 pt-5 pb-5 flex flex-col items-center">
          {/* Attendee Profile Row */}
          <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-md border border-neutral-200/70 dark:border-white/10 mb-3.5 shadow-2xs">
            <div className="min-w-0 pr-2">
              <p className="text-[8px] font-bold tracking-widest uppercase text-neutral-400">
                VERIFIED DELEGATE
              </p>
              <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                {attendeeName}
              </p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                {attendeeEmail}
              </p>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs text-white shadow-2xs"
              style={{ backgroundColor: design.primaryColor }}
            >
              {attendeeName.charAt(0)}
            </div>
          </div>

          {/* QR Container */}
          <div
            className={`p-3 rounded-2xl mb-2 bg-white/90 dark:bg-white/95 backdrop-blur-md shadow-xs ${
              design.showQrBorder ? "ring-2 ring-offset-2" : "border border-neutral-200/80"
            }`}
            style={{
              borderColor: design.showQrBorder ? design.primaryColor : undefined,
            }}
          >
            <div className="w-28 h-28 bg-white rounded-xl flex items-center justify-center border border-neutral-100">
              <div className="w-20 h-20 grid grid-cols-5 grid-rows-5 gap-1 p-0.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-xs ${
                      [0, 1, 3, 4, 6, 8, 11, 12, 13, 16, 18, 20, 21, 23, 24].includes(i)
                        ? "bg-neutral-900"
                        : "bg-neutral-100"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="text-[9px] font-mono text-neutral-400 tracking-wider mb-3">
            TOKEN: {displayTicketCode}
          </p>

          <div
            className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white shadow-sm backdrop-blur-sm"
            style={{
              background: `linear-gradient(135deg, ${design.primaryColor} 0%, ${darkSecondary} 100%)`,
            }}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>CONFIRMED GUEST CREDENTIAL</span>
          </div>

          {design.footerNote && (
            <p className="text-[9px] text-center text-neutral-400 mt-2.5 leading-relaxed">
              {design.footerNote}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3. SWISS MINIMALIST CREDENTIAL THEME ("minimal")
  // ─────────────────────────────────────────────────────────────
  if (design.theme === "minimal") {
    return (
      <div
        className={`w-full max-w-[340px] mx-auto rounded-2xl bg-white/85 dark:bg-neutral-950/85 backdrop-blur-2xl border border-neutral-900/90 dark:border-white/20 p-5 transition-all duration-300 select-none shadow-2xl ${fontCls}`}
        style={glowStyle}
      >
        <div className="border-b border-neutral-900 dark:border-neutral-700 pb-3 mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-bold tracking-widest uppercase text-neutral-900 dark:text-neutral-100">
              {orgName || "OFFICIAL ENTRY"}
            </span>
            <span className="text-[8px] font-mono tracking-widest uppercase border border-neutral-900 dark:border-neutral-700 px-2 py-0.5 rounded-xs">
              {badgeText}
            </span>
          </div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-tight">
            {eventName}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-600 dark:text-neutral-300 mb-4 font-mono border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <div>
            <p className="text-[8px] text-neutral-400 uppercase font-sans">SCHEDULE</p>
            <p className="truncate font-semibold">{eventDate}</p>
          </div>
          <div>
            <p className="text-[8px] text-neutral-400 uppercase font-sans">LOCATION</p>
            <p className="truncate font-semibold">{venue}</p>
          </div>
        </div>

        <div className="border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-3 mb-4 flex items-center justify-between bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md shadow-2xs">
          <div>
            <p className="text-[8px] uppercase tracking-widest text-neutral-400 font-mono">
              DELEGATE
            </p>
            <p className="text-sm font-bold text-neutral-900 dark:text-white">{attendeeName}</p>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">{attendeeEmail}</p>
          </div>
          <span className="text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-800 px-2 py-1 border border-neutral-200 dark:border-neutral-700 rounded shadow-2xs">
            {displayTicketCode}
          </span>
        </div>

        <div className="flex flex-col items-center mb-3">
          <div className="w-28 h-28 border border-neutral-900 dark:border-neutral-700 rounded-xl flex items-center justify-center p-2 mb-1.5 bg-white/95 backdrop-blur-sm shadow-xs">
            <div className="w-20 h-20 grid grid-cols-5 grid-rows-5 gap-1">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={
                    [0, 1, 2, 4, 5, 7, 10, 12, 14, 17, 19, 20, 22, 23, 24].includes(i)
                      ? "bg-black"
                      : "bg-neutral-100"
                  }
                />
              ))}
            </div>
          </div>
          <span className="text-[8px] font-mono tracking-widest text-neutral-500 uppercase">
            SWISS MONOCHROME VALIDATION
          </span>
        </div>

        {design.footerNote && (
          <p className="text-[9px] text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 pt-2.5 text-center">
            {design.footerNote}
          </p>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 4. EXECUTIVE DELEGATE LANYARD THEME ("badge")
  // ─────────────────────────────────────────────────────────────
  if (design.theme === "badge") {
    return (
      <div className="flex flex-col items-center w-full max-w-[340px] mx-auto">
        {/* Realistic Executive Lanyard Strap & Swivel Clasp Assembly */}
        <RealisticLanyardClip
          strapColor={design.primaryColor || "#1E293B"}
          clipColor="silver"
          accentLabel={orgName || "URPASS DELEGATE"}
          isSmall={false}
        />

        <div
          className={`w-full rounded-3xl bg-white/85 dark:bg-[#0F131D]/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 overflow-hidden shadow-2xl transition-all duration-300 select-none ${fontCls}`}
          style={glowStyle}
        >
          {/* Top Organization Header Band */}
          <div className="px-6 py-4 text-center text-white backdrop-blur-md" style={patternStyle}>
            <div className="flex items-center justify-center gap-1.5 mb-1 text-[9px] font-bold tracking-widest uppercase opacity-90">
              {orgLogoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={orgLogoUrl}
                  alt="Org Logo"
                  className="w-3.5 h-3.5 rounded object-cover ring-1 ring-white/30"
                />
              )}
              <span>{orgName || "OFFICIAL CONFERENCE PASS"}</span>
            </div>
            <h3 className="text-base font-extrabold leading-tight line-clamp-2">
              {eventName}
            </h3>
          </div>

          {/* Hero Attendee Badge Area */}
          <div className="px-6 pt-5 pb-4 flex flex-col items-center text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-md mb-2.5"
              style={{
                background: `linear-gradient(135deg, ${design.primaryColor} 0%, ${darkSecondary} 100%)`,
              }}
            >
              {attendeeName.charAt(0)}
            </div>

            <h2 className="text-xl font-black text-neutral-900 dark:text-white leading-tight">
              {attendeeName}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 mb-3">{attendeeEmail}</p>

            <div
              className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white mb-4 shadow-2xs backdrop-blur-xs"
              style={{
                backgroundColor: design.primaryColor,
              }}
            >
              {badgeText}
            </div>

            {/* Event & QR Section */}
            <div className="w-full flex items-center justify-between bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-neutral-200/70 dark:border-white/10 mb-3 shadow-2xs">
              <div className="text-left text-[10px] text-neutral-500 dark:text-neutral-400 flex flex-col gap-0.5">
                <span className="font-bold text-neutral-800 dark:text-neutral-200">{eventDate}</span>
                <span className="truncate max-w-[130px]">{venue}</span>
                <span className="font-mono text-[9px] text-neutral-400">{displayTicketCode}</span>
              </div>

              <div
                className={`p-1.5 rounded-xl bg-white/90 dark:bg-white/95 backdrop-blur-sm ${
                  design.showQrBorder ? "border-2" : "border border-neutral-200/80"
                }`}
                style={{
                  borderColor: design.showQrBorder ? design.primaryColor : undefined,
                }}
              >
                <div className="w-12 h-12 grid grid-cols-4 grid-rows-4 gap-0.5 p-0.5">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        [0, 1, 3, 5, 6, 8, 10, 12, 13, 15].includes(i)
                          ? "bg-neutral-900"
                          : "bg-neutral-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {design.footerNote && (
              <p className="text-[9px] text-neutral-400 text-center leading-normal mb-2">
                {design.footerNote}
              </p>
            )}

            {showBranding && (
              <p className="text-[8px] text-neutral-300 dark:text-neutral-600 font-bold tracking-widest uppercase">
                URPASS LANYARD CREDENTIAL
              </p>
            )}
          </div>

          {/* Bottom High-Security Access Tier Bar */}
          <div
            className="w-full py-2.5 px-4 text-center text-[10px] font-black tracking-widest uppercase text-white shadow-xs"
            style={{
              backgroundColor: design.primaryColor,
            }}
          >
            {badgeText} · OFFICIAL ACCESS PASS
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 5. OBSIDIAN LUXURY GALA PASS THEME ("cyber" preset)
  // ─────────────────────────────────────────────────────────────
  return (
    <div
      className={`w-full max-w-[340px] mx-auto rounded-[28px] bg-[#0A0D14]/85 backdrop-blur-2xl border border-[#262C38]/90 overflow-hidden text-neutral-100 transition-all duration-300 select-none shadow-2xl ${fontCls}`}
      style={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px -5px rgba(212, 175, 55, 0.12)",
      }}
    >
      {/* Brushed Champagne Gold Ribbon Header */}
      <div className="px-5 py-2.5 bg-[#121622]/85 backdrop-blur-md border-b border-[#262C38] flex items-center justify-between text-[10px] text-neutral-400">
        <div className="flex items-center gap-1.5">
          <Crown className="w-3 h-3 text-amber-400" />
          <span className="font-semibold text-neutral-200 uppercase tracking-widest text-[9px]">
            {orgName || "PRIVATE RECEPTION"}
          </span>
        </div>
        <span className="text-amber-400 font-mono text-[9px] font-bold">
          CONFIDENTIAL
        </span>
      </div>

      {/* Obsidian Header with Muted Champagne Accent */}
      <div className="p-5 relative bg-gradient-to-b from-[#121622]/90 to-[#0A0D14]/90 backdrop-blur-md border-b border-[#1E2430]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-bold tracking-widest text-amber-300/80 uppercase">
            PATRON CREDENTIAL
          </span>
          <span className="text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 backdrop-blur-sm shadow-2xs">
            {badgeText}
          </span>
        </div>

        <h3 className="text-base font-bold text-white leading-tight mb-2">
          {eventName}
        </h3>

        <div className="flex flex-col gap-0.5 text-[10px] text-neutral-400">
          <p>{eventDate}</p>
          <p className="truncate">{venue}</p>
        </div>
      </div>

      {/* Luxury Body */}
      <div className="p-5 flex flex-col items-center bg-[#0A0D14]/75 backdrop-blur-md">
        <div className="w-full bg-[#121622]/80 backdrop-blur-md border border-[#262C38]/90 rounded-2xl p-3 mb-3.5 shadow-2xs">
          <p className="text-[8px] text-amber-400/80 uppercase tracking-widest mb-0.5 font-bold">
            HONORED GUEST
          </p>
          <p className="text-sm font-bold text-white truncate">{attendeeName}</p>
          <p className="text-[10px] text-neutral-400 truncate">{attendeeEmail}</p>
        </div>

        {/* QR container with champagne-gold border */}
        <div className="p-3.5 bg-white/95 backdrop-blur-md rounded-2xl mb-2 border border-amber-400/40 shadow-md">
          <div className="w-28 h-28 bg-white rounded-xl flex items-center justify-center p-1">
            <div className="w-20 h-20 grid grid-cols-5 grid-rows-5 gap-1">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={
                    [0, 1, 2, 4, 6, 8, 12, 13, 14, 16, 18, 20, 22, 23, 24].includes(i)
                      ? "bg-neutral-950"
                      : "bg-neutral-100"
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <p className="text-[9px] font-mono text-amber-300/80 tracking-widest mb-3">
          SECURITY TOKEN: {displayTicketCode}
        </p>

        <div className="w-full py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 shadow-md">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-950" />
          <span>AUTHENTICATED ACCESS</span>
        </div>

        {design.footerNote && (
          <p className="text-[9px] text-neutral-400 text-center mt-2.5">
            {design.footerNote}
          </p>
        )}
      </div>
    </div>
  );
}
