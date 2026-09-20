"use client";

import React from "react";
import {
  CalendarDays,
  MapPin,
  CheckCircle,
  Ticket,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import {
  type CustomPassDesign,
  getPatternStyle,
  getFontFamilyCls,
  darkenHex,
} from "@/lib/pass-design";

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
  showBranding = true,
}: PassPreviewCardProps) {
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
        boxShadow: `0 20px 50px -10px ${design.primaryColor}33, 0 10px 20px -5px ${design.secondaryColor}22`,
      }
    : {
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.08)",
      };

  // 1. CLASSIC TICKET THEME
  if (design.theme === "classic") {
    return (
      <div
        className={`w-full max-w-[340px] mx-auto rounded-3xl bg-white border border-neutral-200/80 overflow-hidden transition-all duration-300 select-none ${fontCls}`}
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

        {/* Header Strip */}
        <div className="px-5 pt-5 pb-6 relative overflow-hidden" style={patternStyle}>
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
                  <Ticket className="w-3 h-3 text-white" />
                </div>
              )}
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">
                {orgName || "URPASS"}
              </span>
            </div>

            <span className="text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/25">
              {badgeText}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white leading-tight mb-3 line-clamp-2 drop-shadow-sm">
            {eventName}
          </h3>

          <div className="flex flex-col gap-1 text-[11px] text-white/80">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-3 h-3 shrink-0" />
              <span className="truncate">{eventDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{venue}</span>
            </div>
          </div>
        </div>

        {/* Tear Line with Ticket Cutouts */}
        <div className="relative h-0">
          <div className="absolute -left-3.5 -top-3.5 w-7 h-7 rounded-full bg-neutral-100 border border-neutral-200/80" />
          <div className="absolute -right-3.5 -top-3.5 w-7 h-7 rounded-full bg-neutral-100 border border-neutral-200/80" />
          <div className="absolute left-4 right-4 border-t-2 border-dashed border-neutral-200" />
        </div>

        {/* Ticket Body */}
        <div className="px-5 pt-6 pb-5 flex flex-col items-center">
          <div className="w-full text-center mb-4">
            <p className="text-[9px] font-bold tracking-widest uppercase text-neutral-400 mb-0.5">
              PASS HOLDER
            </p>
            <p className="text-base font-bold text-neutral-900 leading-tight">
              {attendeeName}
            </p>
            <p className="text-xs text-neutral-400 truncate">{attendeeEmail}</p>
          </div>

          {/* QR Code Container */}
          <div
            className={`p-3 rounded-2xl bg-neutral-50 mb-2 ${
              design.showQrBorder
                ? "border-2"
                : "border border-neutral-200"
            }`}
            style={{
              borderColor: design.showQrBorder ? design.primaryColor : undefined,
            }}
          >
            <div className="w-32 h-32 bg-white rounded-xl flex flex-col items-center justify-center p-2 shadow-inner border border-neutral-100">
              <div className="w-24 h-24 grid grid-cols-6 grid-rows-6 gap-1 p-1">
                {/* Visual QR placeholder matrix */}
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

          <p className="text-[10px] font-mono font-semibold tracking-widest text-neutral-400 mb-4">
            {shortCode}
          </p>

          {/* Status Strip */}
          <div
            className="w-full py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold text-white mb-3"
            style={{
              background: `linear-gradient(135deg, ${design.primaryColor} 0%, ${darkSecondary} 100%)`,
            }}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Valid Entry &middot; Show at entrance</span>
          </div>

          {/* Custom Footer Note */}
          {design.footerNote && (
            <p className="text-[10px] text-center text-neutral-400 leading-normal px-2">
              {design.footerNote}
            </p>
          )}

          {showBranding && (
            <p className="text-[9px] text-neutral-300 font-medium tracking-wider uppercase mt-4">
              URPASS DIGITAL PASS
            </p>
          )}
        </div>
      </div>
    );
  }

  // 2. MODERN GLASS THEME
  if (design.theme === "modern") {
    return (
      <div
        className={`w-full max-w-[340px] mx-auto rounded-[32px] bg-gradient-to-b from-white/95 to-neutral-50/95 backdrop-blur-xl border border-white/60 p-1.5 transition-all duration-300 select-none ${fontCls}`}
        style={glowStyle}
      >
        <div className="rounded-[26px] bg-white border border-neutral-100/90 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="px-6 pt-6 pb-7 relative overflow-hidden" style={patternStyle}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/90">
                {orgName || "EXCLUSIVE"}
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/25 text-white backdrop-blur-md border border-white/30">
                <Sparkles className="w-2.5 h-2.5" />
                {badgeText}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-white leading-tight mb-3 drop-shadow-sm">
              {eventName}
            </h3>

            <div className="p-2.5 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 flex flex-col gap-1 text-[11px] text-white/90">
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
          <div className="px-6 pt-6 pb-6 flex flex-col items-center">
            <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-neutral-50 border border-neutral-100 mb-4">
              <div className="min-w-0 pr-2">
                <p className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">
                  ATTENDEE
                </p>
                <p className="text-sm font-bold text-neutral-900 truncate">
                  {attendeeName}
                </p>
                <p className="text-[11px] text-neutral-400 truncate">
                  {attendeeEmail}
                </p>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs text-white"
                style={{ backgroundColor: design.primaryColor }}
              >
                {attendeeName.charAt(0)}
              </div>
            </div>

            {/* QR box */}
            <div
              className={`p-3 rounded-2xl mb-2 bg-neutral-50 ${
                design.showQrBorder ? "ring-2 ring-offset-2" : "border border-neutral-100"
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

            <p className="text-[10px] font-mono text-neutral-400 tracking-wider mb-4">
              {shortCode}
            </p>

            <div
              className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${design.primaryColor} 0%, ${design.secondaryColor} 100%)`,
              }}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>CONFIRMED GUEST</span>
            </div>

            {design.footerNote && (
              <p className="text-[10px] text-center text-neutral-400 mt-3 leading-relaxed">
                {design.footerNote}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. MINIMAL MONOCHROME THEME
  if (design.theme === "minimal") {
    return (
      <div
        className={`w-full max-w-[340px] mx-auto rounded-2xl bg-white border border-neutral-900 p-5 transition-all duration-300 select-none ${fontCls}`}
        style={glowStyle}
      >
        <div className="border-b border-neutral-900 pb-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-900">
              {orgName || "EVENT"}
            </span>
            <span className="text-[9px] font-mono tracking-widest uppercase border border-neutral-900 px-2 py-0.5">
              {badgeText}
            </span>
          </div>
          <h3 className="text-xl font-bold text-neutral-900 leading-tight">
            {eventName}
          </h3>
        </div>

        <div className="flex flex-col gap-1 text-xs text-neutral-600 mb-6 font-mono">
          <p>&gt; {eventDate}</p>
          <p>&gt; {venue}</p>
        </div>

        <div className="border-t border-b border-neutral-200 py-3 mb-5 flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-mono">
              ADMIT
            </p>
            <p className="text-base font-bold text-neutral-900">{attendeeName}</p>
          </div>
          <p className="text-xs font-mono text-neutral-500">{shortCode}</p>
        </div>

        <div className="flex flex-col items-center mb-4">
          <div className="w-28 h-28 border border-neutral-900 flex items-center justify-center p-2 mb-2 bg-white">
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
          <span className="text-[9px] font-mono tracking-widest text-neutral-400">
            QR CODE VERIFICATION
          </span>
        </div>

        {design.footerNote && (
          <p className="text-[10px] text-neutral-500 border-t border-neutral-100 pt-3 text-center">
            {design.footerNote}
          </p>
        )}
      </div>
    );
  }

  // 4. CONFERENCE BADGE THEME
  if (design.theme === "badge") {
    return (
      <div
        className={`w-full max-w-[340px] mx-auto rounded-3xl bg-white border border-neutral-200 overflow-hidden shadow-lg transition-all duration-300 select-none ${fontCls}`}
        style={glowStyle}
      >
        {/* Lanyard Hole Graphic */}
        <div className="w-full bg-neutral-100 py-2.5 flex items-center justify-center border-b border-neutral-200">
          <div className="w-10 h-3 rounded-full bg-neutral-300 border border-neutral-400/50 shadow-inner" />
        </div>

        {/* Top Header Band */}
        <div className="px-6 py-4 text-center text-white" style={patternStyle}>
          <p className="text-[10px] font-bold tracking-widest uppercase opacity-90 mb-0.5">
            {orgName || "CONFERENCE"}
          </p>
          <h3 className="text-base font-bold leading-tight drop-shadow-sm">
            {eventName}
          </h3>
        </div>

        {/* Hero Attendee Badge Area */}
        <div className="px-6 pt-7 pb-6 flex flex-col items-center text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-md mb-3"
            style={{
              background: `linear-gradient(135deg, ${design.primaryColor} 0%, ${design.secondaryColor} 100%)`,
            }}
          >
            {attendeeName.charAt(0)}
          </div>

          <h2 className="text-2xl font-black text-neutral-900 leading-tight">
            {attendeeName}
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5 mb-4">{attendeeEmail}</p>

          <div
            className="px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white mb-6 shadow-sm"
            style={{
              backgroundColor: design.primaryColor,
            }}
          >
            {badgeText}
          </div>

          {/* QR Section */}
          <div className="w-full flex items-center justify-between bg-neutral-50 rounded-2xl p-4 border border-neutral-100 mb-4">
            <div className="text-left text-[11px] text-neutral-500 flex flex-col gap-1">
              <span className="font-semibold text-neutral-800">{eventDate}</span>
              <span className="truncate max-w-[140px]">{venue}</span>
              <span className="font-mono text-[10px] text-neutral-400">{shortCode}</span>
            </div>

            <div
              className={`p-1.5 rounded-xl bg-white ${
                design.showQrBorder ? "border-2" : "border border-neutral-200"
              }`}
              style={{
                borderColor: design.showQrBorder ? design.primaryColor : undefined,
              }}
            >
              <div className="w-14 h-14 grid grid-cols-4 grid-rows-4 gap-0.5 p-0.5">
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
            <p className="text-[10px] text-neutral-400 text-center leading-normal">
              {design.footerNote}
            </p>
          )}
        </div>
      </div>
    );
  }

  // 5. CYBER THEME
  return (
    <div
      className={`w-full max-w-[340px] mx-auto rounded-3xl bg-neutral-950 border border-neutral-800 overflow-hidden text-neutral-100 transition-all duration-300 select-none ${fontCls}`}
      style={{
        boxShadow: design.accentGlow
          ? `0 0 35px -5px ${design.primaryColor}55, 0 10px 25px -5px rgba(0,0,0,0.8)`
          : "0 20px 40px -10px rgba(0,0,0,0.9)",
      }}
    >
      {/* Top terminal bar */}
      <div className="px-5 py-2.5 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-400">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-cyan-400" />
          <span>URPASS://ACCESS_KEY</span>
        </div>
        <span className="text-emerald-400 font-bold">{"// SECURE"}</span>
      </div>

      {/* Cyber Header with neon accent */}
      <div className="p-5 relative" style={patternStyle}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-200 uppercase">
            {orgName || "CYBER_SUMMIT"}
          </span>
          <span
            className="text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded border"
            style={{
              borderColor: design.primaryColor,
              color: "#ffffff",
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          >
            {badgeText}
          </span>
        </div>

        <h3 className="text-lg font-black text-white leading-tight mb-3">
          {eventName}
        </h3>

        <div className="flex flex-col gap-0.5 text-[11px] font-mono text-white/80">
          <p>&gt; {eventDate}</p>
          <p>&gt; {venue}</p>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-5 flex flex-col items-center bg-neutral-950">
        <div className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl p-3 mb-4 font-mono">
          <p className="text-[9px] text-neutral-500 uppercase tracking-widest mb-0.5">
            DELEGATE IDENTIFIER
          </p>
          <p className="text-sm font-bold text-white truncate">{attendeeName}</p>
          <p className="text-xs text-neutral-400 truncate">{attendeeEmail}</p>
        </div>

        {/* QR container with neon glow */}
        <div
          className="p-3 bg-neutral-900 rounded-2xl mb-2 border"
          style={{
            borderColor: design.primaryColor,
            boxShadow: `0 0 15px -3px ${design.primaryColor}66`,
          }}
        >
          <div className="w-28 h-28 bg-white rounded-xl flex items-center justify-center p-1">
            <div className="w-20 h-20 grid grid-cols-5 grid-rows-5 gap-1">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={
                    [0, 1, 2, 4, 6, 8, 12, 13, 14, 16, 18, 20, 22, 23, 24].includes(i)
                      ? "bg-black"
                      : "bg-neutral-100"
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <p className="text-[10px] font-mono text-cyan-400 tracking-widest mb-4">
          TOKEN: {shortCode}
        </p>

        <div
          className="w-full py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-mono font-bold text-black"
          style={{
            backgroundColor: design.primaryColor,
          }}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>AUTHENTICATED PASS</span>
        </div>

        {design.footerNote && (
          <p className="text-[10px] font-mono text-neutral-500 text-center mt-3">
            {design.footerNote}
          </p>
        )}
      </div>
    </div>
  );
}
