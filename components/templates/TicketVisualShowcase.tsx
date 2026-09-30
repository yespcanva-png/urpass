"use client";

import React from "react";
import type { StudioTemplateDefinition } from "@/lib/studio/templates";
import {
  Calendar,
  MapPin,
  Radio,
  ScanLine,
  Ticket,
  Smartphone,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

interface TicketVisualShowcaseProps {
  template: StudioTemplateDefinition;
  mode?: "card" | "showcase";
  customAttendeeName?: string;
  customEventName?: string;
  customHostOrg?: string;
  customVenue?: string;
  customDate?: string;
  customLogoUrl?: string;
  customTicketId?: string;
  showScanSimulation?: boolean;
}

/**
 * High-fidelity Barcode Component (Code 128 style)
 */
function RealisticBarcode({
  code = "URP-8492049102",
  color = "#000000",
  height = 36,
}: {
  code?: string;
  color?: string;
  height?: number;
}) {
  const barPatterns = [2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 1, 3, 2, 1, 4, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 1, 2, 2, 3, 1, 2, 3, 1, 2, 1, 3, 2];
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-stretch gap-[1.5px]" style={{ height }}>
        {barPatterns.map((w, idx) => (
          <div
            key={idx}
            style={{
              width: `${w}px`,
              backgroundColor: idx % 2 === 0 ? color : "transparent",
            }}
          />
        ))}
      </div>
      <span
        className="font-mono text-[9px] tracking-[0.2em] uppercase mt-0.5"
        style={{ color }}
      >
        {code}
      </span>
    </div>
  );
}

/**
 * High-fidelity QR Code with authentic Finder Corners
 */
function RealisticQrCode({
  size = 110,
  fgColor = "#000000",
  bgColor = "#FFFFFF",
  label = "SUB-0.3s SCAN",
  isScanning = false,
}: {
  size?: number;
  fgColor?: string;
  bgColor?: string;
  label?: string;
  isScanning?: boolean;
}) {
  return (
    <div
      className="relative p-2 rounded-xl flex flex-col items-center justify-center transition-all select-none shadow-sm"
      style={{ backgroundColor: bgColor, width: size, height: size }}
    >
      {/* Corner Brackets / Viewfinder */}
      <div className="absolute inset-1 border border-neutral-300/40 rounded-lg pointer-events-none" />

      {/* SVG QR Code Pattern */}
      <svg
        width={size - 16}
        height={size - 16}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Top-Left Finder */}
        <rect x="5" y="5" width="26" height="26" rx="4" fill={fgColor} />
        <rect x="9" y="9" width="18" height="18" rx="2" fill={bgColor} />
        <rect x="13" y="13" width="10" height="10" rx="2" fill={fgColor} />

        {/* Top-Right Finder */}
        <rect x="69" y="5" width="26" height="26" rx="4" fill={fgColor} />
        <rect x="73" y="9" width="18" height="18" rx="2" fill={bgColor} />
        <rect x="77" y="13" width="10" height="10" rx="2" fill={fgColor} />

        {/* Bottom-Left Finder */}
        <rect x="5" y="69" width="26" height="26" rx="4" fill={fgColor} />
        <rect x="9" y="73" width="18" height="18" rx="2" fill={bgColor} />
        <rect x="13" y="77" width="10" height="10" rx="2" fill={fgColor} />

        {/* QR Data Grid Matrix */}
        <rect x="36" y="8" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="46" y="8" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="56" y="8" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="36" y="18" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="51" y="18" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="56" y="23" width="5" height="5" rx="1" fill={fgColor} />

        {/* Center Grid */}
        <rect x="36" y="36" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="48" y="36" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="60" y="36" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="20" y="44" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="36" y="48" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="48" y="48" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="60" y="48" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="74" y="44" width="6" height="6" rx="1.5" fill={fgColor} />

        {/* Bottom Matrix */}
        <rect x="36" y="66" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="46" y="66" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="56" y="66" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="68" y="66" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="80" y="66" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="36" y="78" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="51" y="78" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="68" y="78" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="80" y="86" width="5" height="5" rx="1" fill={fgColor} />
      </svg>

      {/* Laser Scan Beam Animation */}
      {isScanning && (
        <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-emerald-400 via-emerald-200 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)] animate-pulse rounded-full" />
      )}

      {/* Micro Scan Label */}
      {label && size > 90 && (
        <div className="mt-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span className="text-[7.5px] font-mono font-bold tracking-wider uppercase text-neutral-800">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

export default function TicketVisualShowcase({
  template,
  mode = "card",
  customAttendeeName,
  customEventName,
  customHostOrg,
  customVenue,
  customDate,
  customLogoUrl,
  customTicketId,
  showScanSimulation = false,
}: TicketVisualShowcaseProps) {
  const isCard = mode === "card";

  // Dummy fallback data tailored per template
  const attendeeName = customAttendeeName || (
    template.id === "college-fest-badge" ? "ANANYA RAMESH" :
    template.id === "tech-conf-badge" ? "DR. ROHAN MEHTA" :
    template.id === "hackathon-terminal" ? "KARTIK_SHARMA" :
    template.id === "dark-obsidian-luxury" ? "VIKRAMADITYA RAO" :
    "ARJUN KUMAR"
  );

  const eventName = customEventName || (
    template.id === "minimal-monochrome" ? "URPASS TECH SUMMIT 2026" :
    template.id === "concert-music-fest" ? "NEON HORIZON FESTIVAL" :
    template.id === "corporate-summit-gala" ? "GLOBAL INNOVATION FORUM" :
    template.id === "college-fest-badge" ? "DHVANI ANNUAL FEST 2026" :
    template.id === "tech-conf-badge" ? "DEVCON BENGALURU 2026" :
    template.id === "hackathon-terminal" ? "CYBERHACK 2026 TERMINAL" :
    template.id === "vip-all-access" ? "URPASS VIP GALA & LOUNGE" :
    template.id === "workshop-masterclass" ? "SYSTEM DESIGN MASTERCLASS" :
    template.id === "sports-arena-ticket" ? "CHAMPIONS ARENA SEMI-FINAL" :
    template.id === "exhibition-trade-expo" ? "GLOBAL TECH EXPO 2026" :
    template.id === "community-meetup" ? "FOUNDERS & BUILDERS MEET" :
    "OBSIDIAN LUXURY PRIVATE GALA"
  );

  const hostOrg = customHostOrg || (
    template.id === "college-fest-badge" ? "PSG College of Technology" :
    template.id === "tech-conf-badge" ? "Google Cloud Developers" :
    template.id === "hackathon-terminal" ? "DevClub & MLH" :
    template.id === "corporate-summit-gala" ? "Stripe Global" :
    "URPASS Official"
  );

  const eventDate = customDate || "24 OCT 2026 · 09:30 AM IST";

  const venueName = customVenue || (
    template.id === "concert-music-fest" ? "JLN Arena, Chennai" :
    template.id === "corporate-summit-gala" ? "The Leela Palace, Bengaluru" :
    template.id === "college-fest-badge" ? "Main Amphitheatre, Campus" :
    template.id === "sports-arena-ticket" ? "Salt Lake Stadium, Gate 4" :
    "Palace Grounds, Bengaluru"
  );

  const ticketId = customTicketId || "#URP-90284";

  // ─────────────────────────────────────────────────────────────
  // 1. DIGITAL MOBILE PASS FORMAT (380x680 ratio)
  // ─────────────────────────────────────────────────────────────
  if (template.format === "digital") {
    const isDark = template.thumbnailBg !== "#FFFFFF" && template.thumbnailBg !== "#F8FAFC";
    const bg = template.thumbnailBg;

    return (
      <div
        className={`relative overflow-hidden transition-all duration-300 select-none ${
          isCard
            ? "w-full max-w-[280px] h-[340px] rounded-[24px] p-4 text-xs shadow-md border border-neutral-200/80 hover:shadow-xl"
            : "w-full max-w-[340px] sm:max-w-[370px] min-h-[580px] rounded-[32px] p-6 text-sm shadow-2xl border border-white/20"
        }`}
        style={{
          backgroundColor: bg,
          color: isDark ? "#FFFFFF" : "#18181B",
        }}
      >
        {/* Smartphone Camera Notch Island */}
        <div className="absolute top-2.5 inset-x-0 flex justify-center pointer-events-none z-20">
          <div className="w-16 h-2 rounded-full bg-neutral-900/60 backdrop-blur-md border border-white/10" />
        </div>

        {/* Hologram Foil Light Reflection overlay */}
        <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45 pointer-events-none opacity-40 hover:opacity-75 transition-opacity" />

        {/* Card Header with optional Custom Logo */}
        <div className="pt-3 pb-2 flex items-center justify-between border-b border-current/10">
          <div className="flex items-center gap-1.5">
            {customLogoUrl ? (
              <img
                src={customLogoUrl}
                alt="Logo"
                className="w-5 h-5 rounded-md object-contain bg-white/20 p-0.5"
              />
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
            <span className="text-[9px] font-black uppercase tracking-widest opacity-80 truncate max-w-[130px]">
              {hostOrg}
            </span>
          </div>
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-current/10 opacity-90">
            {ticketId}
          </span>
        </div>

        {/* Event Title & Date */}
        <div className="my-3 space-y-1">
          <h4
            className={`font-black tracking-tight leading-tight uppercase ${
              isCard ? "text-sm line-clamp-2" : "text-lg line-clamp-2"
            }`}
          >
            {eventName}
          </h4>
          <div className="flex items-center gap-1 text-[10px] opacity-75">
            <Calendar className="w-3 h-3 shrink-0" />
            <span className="truncate">{eventDate}</span>
          </div>
          <div className="flex items-center gap-1 text-[9.5px] opacity-75 truncate">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{venueName}</span>
          </div>
        </div>

        {/* Central High-Contrast Scannable QR Frame */}
        <div className="my-3 flex justify-center">
          <RealisticQrCode
            size={isCard ? 110 : 160}
            fgColor={isDark ? "#09090B" : "#18181B"}
            bgColor="#FFFFFF"
            label="SUB-0.3s CAMERA SCAN"
            isScanning={showScanSimulation}
          />
        </div>

        {/* Attendee Details Card */}
        <div className="mt-2 p-2.5 rounded-2xl bg-current/5 border border-current/10 space-y-1">
          <div className="flex items-center justify-between text-[9px] font-semibold opacity-70 uppercase tracking-wider">
            <span>Pass Holder</span>
            <span>Category</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`font-black tracking-tight uppercase truncate max-w-[170px] ${isCard ? "text-xs" : "text-sm"}`}>
              {attendeeName}
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              VIP ACCESS
            </span>
          </div>
        </div>

        {/* Security Holographic Bar */}
        <div className="mt-3 pt-2 border-t border-current/10 flex items-center justify-between text-[8px] font-mono opacity-60">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>URPASS CRYPTO-GATE VERIFIED</span>
          </div>
          <span>GATE NORTH</span>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. PRINTABLE CONCERT & SPORTS STUB TICKET (780x340 landscape)
  // ─────────────────────────────────────────────────────────────
  if (template.format === "printable") {
    const isDark = template.thumbnailBg !== "#FFFFFF" && template.thumbnailBg !== "#FEF3C7";
    const bg = template.thumbnailBg;

    return (
      <div
        className={`relative overflow-hidden transition-all duration-300 select-none flex flex-row ${
          isCard
            ? "w-full max-w-[340px] h-[190px] rounded-2xl shadow-md border border-neutral-200/80 hover:shadow-xl text-xs"
            : "w-full max-w-[620px] h-[260px] rounded-3xl shadow-2xl border border-white/20 text-sm"
        }`}
        style={{
          backgroundColor: bg,
          color: isDark ? "#FFFFFF" : "#18181B",
        }}
      >
        {/* Left Side: Main Ticket Body (70%) */}
        <div className="flex-1 p-3.5 sm:p-5 flex flex-col justify-between relative overflow-hidden">
          {/* Top category ribbon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {customLogoUrl && (
                <img
                  src={customLogoUrl}
                  alt="Logo"
                  className="w-4 h-4 rounded object-contain bg-white/20"
                />
              )}
              <span className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-400 border border-pink-500/30 text-[8px] sm:text-[9px] font-black tracking-widest uppercase truncate max-w-[140px]">
                {hostOrg}
              </span>
            </div>
            <span className="text-[8.5px] font-mono opacity-70">
              SEC 102 &bull; ROW A &bull; SEAT 42
            </span>
          </div>

          {/* Event title */}
          <div className="my-1">
            <h4
              className={`font-black uppercase tracking-tight leading-tight ${
                isCard ? "text-sm line-clamp-1" : "text-xl line-clamp-1"
              }`}
            >
              {eventName}
            </h4>
            <p className="text-[9px] sm:text-[10px] font-semibold text-pink-400 mt-0.5 truncate">
              {eventDate}
            </p>
            <p className="text-[8px] sm:text-[9.5px] opacity-70 truncate mt-0.5">
              {venueName}
            </p>
          </div>

          {/* Attendee Row */}
          <div className="flex items-end justify-between pt-1 border-t border-current/15">
            <div>
              <span className="text-[7.5px] uppercase font-bold opacity-60 block">Attendee</span>
              <span className="font-black uppercase text-[10px] sm:text-xs">
                {attendeeName}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[7.5px] uppercase font-bold opacity-60 block">Zone</span>
              <span className="font-mono font-bold text-[9px] sm:text-[10px] text-emerald-400">
                ZONE A &bull; FRONT ROW
              </span>
            </div>
          </div>
        </div>

        {/* Perforated Stub Divider with Notch Punch Cutouts */}
        <div className="relative flex flex-col items-center justify-between py-1 px-0 shrink-0">
          {/* Top Notch Cutout */}
          <div className="w-4 h-4 rounded-full bg-neutral-900 border border-neutral-700/50 -mt-2 -mb-1 shadow-inner" />
          
          {/* Dashed Tear Line */}
          <div className="w-[1px] flex-1 border-l-2 border-dashed border-current/30 my-1" />

          {/* Bottom Notch Cutout */}
          <div className="w-4 h-4 rounded-full bg-neutral-900 border border-neutral-700/50 -mb-2 -mt-1 shadow-inner" />
        </div>

        {/* Right Side: Admit One Stub (30%) */}
        <div className="w-[105px] sm:w-[155px] p-3 sm:p-4 bg-black/20 flex flex-col items-center justify-between text-center shrink-0">
          <span className="text-[8.5px] sm:text-[10px] font-black tracking-widest uppercase text-pink-400">
            ADMIT ONE
          </span>

          <RealisticQrCode
            size={isCard ? 68 : 88}
            fgColor="#000000"
            bgColor="#FFFFFF"
            label=""
            isScanning={showScanSimulation}
          />

          <div className="w-full flex justify-center">
            <RealisticBarcode
              code={ticketId}
              color={isDark ? "#FFFFFF" : "#000000"}
              height={isCard ? 18 : 26}
            />
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3. CONFERENCE & FESTIVAL LANYARD BADGE (440x640 ratio)
  // ─────────────────────────────────────────────────────────────
  const isDark = template.thumbnailBg !== "#FFFFFF";
  const bg = template.thumbnailBg;

  return (
    <div
      className={`relative overflow-hidden transition-all duration-300 select-none flex flex-col justify-between ${
        isCard
          ? "w-full max-w-[280px] h-[340px] rounded-[24px] p-4 shadow-md border border-neutral-200/80 hover:shadow-xl text-xs"
          : "w-full max-w-[340px] sm:max-w-[370px] min-h-[540px] rounded-[32px] p-6 shadow-2xl border border-white/20 text-sm"
      }`}
      style={{
        backgroundColor: bg,
        color: isDark ? "#FFFFFF" : "#18181B",
      }}
    >
      {/* Die-Punched Lanyard Slot Hole at Top */}
      <div className="flex flex-col items-center justify-center -mt-1 mb-2 pointer-events-none">
        <div className="w-14 sm:w-16 h-2.5 rounded-full bg-black/50 border border-white/20 shadow-inner" />
        <span className="text-[7.5px] font-mono tracking-widest uppercase opacity-70 mt-1">
          LANYARD CLIP SLOT
        </span>
      </div>

      {/* Conference Banner Header */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5">
          {customLogoUrl && (
            <img
              src={customLogoUrl}
              alt="Logo"
              className="w-4 h-4 rounded object-contain bg-white/20"
            />
          )}
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-[8.5px] font-bold tracking-widest uppercase truncate max-w-[180px]">
            {hostOrg}
          </span>
        </div>
        <h4
          className={`font-black tracking-tight leading-tight uppercase ${
            isCard ? "text-sm line-clamp-1" : "text-lg line-clamp-1"
          }`}
        >
          {eventName}
        </h4>
        <p className="text-[8.5px] sm:text-[9.5px] opacity-80 truncate">
          {eventDate} &bull; {venueName}
        </p>
      </div>

      {/* Giant Attendee Name (Readable from 5m) */}
      <div className="my-2 p-3 sm:p-4 rounded-2xl bg-white text-neutral-950 text-center shadow-lg border border-white/50 space-y-1">
        <span className="text-[8px] font-mono font-bold tracking-widest uppercase text-neutral-500 block">
          ATTENDEE CREDENTIAL
        </span>
        <h3
          className={`font-black tracking-tight leading-none text-neutral-950 uppercase ${
            isCard ? "text-base" : "text-xl"
          }`}
        >
          {attendeeName}
        </h3>
        <p className="text-[9.5px] sm:text-[11px] font-semibold text-neutral-600 truncate">
          {hostOrg}
        </p>
        <div className="pt-1.5 flex justify-center">
          <span className="px-3 py-0.5 rounded-full bg-violet-600 text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
            {template.id === "vip-all-access" ? "VIP ALL ACCESS" : "SPEAKER / DELEGATE"}
          </span>
        </div>
      </div>

      {/* Bottom QR & NFC Scan Zone */}
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-current/10 border border-current/10">
        <RealisticQrCode
          size={isCard ? 70 : 90}
          fgColor="#000000"
          bgColor="#FFFFFF"
          label=""
          isScanning={showScanSimulation}
        />
        <div className="text-right space-y-1">
          <div className="flex items-center justify-end gap-1 text-[8.5px] font-bold">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>NFC CONTACTLESS</span>
          </div>
          <span className="font-mono text-[9px] font-bold block">{ticketId}</span>
          <span className="text-[7.5px] opacity-70 block">TAP OR SCAN AT DOORS</span>
        </div>
      </div>
    </div>
  );
}
