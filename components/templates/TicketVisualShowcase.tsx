"use client";

import React from "react";
import type { StudioTemplateDefinition } from "@/lib/studio/templates";
import { Radio } from "lucide-react";

interface TicketVisualShowcaseProps {
  template: StudioTemplateDefinition;
  mode?: "card" | "showcase";
  customAttendeeName?: string;
  customEventName?: string;
  customHostOrg?: string;
  customVenue?: string;
  customDate?: string;
  customTicketId?: string;
}

/**
 * Realistic Code-128 style Barcode Component
 */
function RealisticBarcode({
  code = "URP-8492049102",
  color = "#000000",
  height = 24,
}: {
  code?: string;
  color?: string;
  height?: number;
}) {
  const bars = [2, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1, 3, 1, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 3, 1, 2, 3];
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-stretch gap-[1.5px]" style={{ height }}>
        {bars.map((w, idx) => (
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
        className="font-mono text-[7px] tracking-[0.16em] uppercase mt-0.5 opacity-70"
        style={{ color }}
      >
        {code}
      </span>
    </div>
  );
}

/**
 * Clean, Vector-Accurate QR Code
 */
function RealisticQrCode({
  size = 100,
  fgColor = "#09090B",
  bgColor = "#FFFFFF",
  label = "SUB-0.3s SCAN",
}: {
  size?: number;
  fgColor?: string;
  bgColor?: string;
  label?: string;
}) {
  return (
    <div
      className="p-1.5 rounded-xl flex flex-col items-center justify-center select-none shadow-xs border border-black/5"
      style={{ backgroundColor: bgColor, width: size, height: size }}
    >
      <svg
        width={size - 14}
        height={size - 14}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Top-Left Finder */}
        <rect x="6" y="6" width="24" height="24" rx="4" fill={fgColor} />
        <rect x="10" y="10" width="16" height="16" rx="2" fill={bgColor} />
        <rect x="14" y="14" width="8" height="8" rx="1.5" fill={fgColor} />

        {/* Top-Right Finder */}
        <rect x="70" y="6" width="24" height="24" rx="4" fill={fgColor} />
        <rect x="74" y="10" width="16" height="16" rx="2" fill={bgColor} />
        <rect x="78" y="14" width="8" height="8" rx="1.5" fill={fgColor} />

        {/* Bottom-Left Finder */}
        <rect x="6" y="70" width="24" height="24" rx="4" fill={fgColor} />
        <rect x="10" y="74" width="16" height="16" rx="2" fill={bgColor} />
        <rect x="14" y="78" width="8" height="8" rx="1.5" fill={fgColor} />

        {/* Matrix Points */}
        <rect x="36" y="8" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="46" y="8" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="56" y="8" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="36" y="18" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="52" y="18" width="5" height="5" rx="1" fill={fgColor} />

        {/* Center Grid */}
        <rect x="36" y="36" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="48" y="36" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="60" y="36" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="20" y="44" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="36" y="48" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="48" y="48" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="60" y="48" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="74" y="44" width="6" height="6" rx="1.5" fill={fgColor} />

        {/* Bottom Grid */}
        <rect x="36" y="66" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="46" y="66" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="56" y="66" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="68" y="66" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="80" y="66" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="36" y="78" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="52" y="78" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="68" y="78" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="80" y="86" width="5" height="5" rx="1" fill={fgColor} />
      </svg>

      {label && size > 90 && (
        <span className="text-[7px] font-mono font-bold tracking-wider uppercase text-neutral-600 mt-1">
          {label}
        </span>
      )}
    </div>
  );
}

interface TemplateVisualTheme {
  bg: string;
  fg: string;
  accent: string;
  border: string;
  pillBg: string;
  pillFg: string;
  pillText: string;
  tagline: string;
  isMono?: boolean;
}

function getTemplateTheme(templateId: string): TemplateVisualTheme {
  switch (templateId) {
    case "minimal-monochrome":
      return {
        bg: "#FFFFFF",
        fg: "#09090B",
        accent: "#18181B",
        border: "#E4E4E7",
        pillBg: "#F4F4F5",
        pillFg: "#18181B",
        pillText: "GENERAL ENTRY",
        tagline: "OFFICIAL PASS",
      };
    case "concert-music-fest":
      return {
        bg: "#0D0B18",
        fg: "#FFFFFF",
        accent: "#F43F5E",
        border: "#831843",
        pillBg: "#F43F5E20",
        pillFg: "#FB7185",
        pillText: "STAGE VIP ACCESS",
        tagline: "LIVE FESTIVAL",
      };
    case "corporate-summit-gala":
      return {
        bg: "#0A0F1D",
        fg: "#FFFFFF",
        accent: "#38BDF8",
        border: "#1E293B",
        pillBg: "#0284C720",
        pillFg: "#38BDF8",
        pillText: "EXECUTIVE DELEGATE",
        tagline: "SUMMIT 2026",
      };
    case "college-fest-badge":
      return {
        bg: "#3730A3",
        fg: "#FFFFFF",
        accent: "#FDE047",
        border: "#4338CA",
        pillBg: "#FDE04725",
        pillFg: "#FEF08A",
        pillText: "STUDENT DELEGATE",
        tagline: "CAMPUS FESTIVAL",
      };
    case "tech-conf-badge":
      return {
        bg: "#0F172A",
        fg: "#FFFFFF",
        accent: "#34D399",
        border: "#1E293B",
        pillBg: "#05966920",
        pillFg: "#34D399",
        pillText: "SPEAKER CREDENTIAL",
        tagline: "DEV CONFERENCE",
      };
    case "hackathon-terminal":
      return {
        bg: "#0A0A0B",
        fg: "#4ADE80",
        accent: "#22C55E",
        border: "#14532D",
        pillBg: "#16653430",
        pillFg: "#4ADE80",
        pillText: "[ROOT_ACCESS]",
        tagline: "> CYBERHACK_PASS",
        isMono: true,
      };
    case "vip-all-access":
      return {
        bg: "#18181B",
        fg: "#FFFFFF",
        accent: "#EAB308",
        border: "#3F3F46",
        pillBg: "#CA8A0425",
        pillFg: "#FDE047",
        pillText: "VIP ALL-ACCESS",
        tagline: "BLACK CARD TIER",
      };
    case "workshop-masterclass":
      return {
        bg: "#0F766E",
        fg: "#FFFFFF",
        accent: "#2DD4BF",
        border: "#115E59",
        pillBg: "#0D948830",
        pillFg: "#5EEAD4",
        pillText: "CERTIFIED SEAT",
        tagline: "MASTERCLASS PASS",
      };
    case "sports-arena-ticket":
      return {
        bg: "#1E1B4B",
        fg: "#FFFFFF",
        accent: "#FB923C",
        border: "#312E81",
        pillBg: "#EA580C25",
        pillFg: "#FDBA74",
        pillText: "COURTSIDE VIP",
        tagline: "ARENA ACCESS",
      };
    case "exhibition-trade-expo":
      return {
        bg: "#1E293B",
        fg: "#FFFFFF",
        accent: "#60A5FA",
        border: "#334155",
        pillBg: "#2563EB20",
        pillFg: "#93C5FD",
        pillText: "TRADE BUYER",
        tagline: "GLOBAL EXPO",
      };
    case "community-meetup":
      return {
        bg: "#312E81",
        fg: "#FFFFFF",
        accent: "#C084FC",
        border: "#3730A3",
        pillBg: "#7C3AED25",
        pillFg: "#DDD6FE",
        pillText: "BUILDER PASS",
        tagline: "MEETUP COMMUNITY",
      };
    case "obsidian-luxury":
    default:
      return {
        bg: "#000000",
        fg: "#FFFFFF",
        accent: "#F59E0B",
        border: "#27272A",
        pillBg: "#D9770625",
        pillFg: "#FCD34D",
        pillText: "PATRON PASS",
        tagline: "PRIVATE GALA",
      };
  }
}

export default function TicketVisualShowcase({
  template,
  mode = "card",
  customAttendeeName,
  customEventName,
  customHostOrg,
  customVenue,
  customDate,
  customTicketId,
}: TicketVisualShowcaseProps) {
  const isCard = mode === "card";
  const theme = getTemplateTheme(template.id);

  const attendeeName = customAttendeeName || (
    template.id === "college-fest-badge" ? "ANANYA RAMESH" :
    template.id === "tech-conf-badge" ? "DR. ROHAN MEHTA" :
    template.id === "hackathon-terminal" ? "KARTIK SHARMA" :
    "ARJUN KUMAR"
  );

  const eventName = customEventName || (
    template.id === "minimal-monochrome" ? "URPASS TECH SUMMIT" :
    template.id === "concert-music-fest" ? "NEON HORIZON FESTIVAL" :
    template.id === "corporate-summit-gala" ? "GLOBAL LEADERSHIP SUMMIT" :
    template.id === "college-fest-badge" ? "DHVANI ANNUAL FEST" :
    template.id === "tech-conf-badge" ? "DEVCON BENGALURU" :
    template.id === "hackathon-terminal" ? "CYBERHACK 2026" :
    template.id === "vip-all-access" ? "VIP ALL-ACCESS GALA" :
    template.id === "workshop-masterclass" ? "SYSTEM SCALE MASTERCLASS" :
    template.id === "sports-arena-ticket" ? "CHAMPIONS ARENA CUP" :
    template.id === "exhibition-trade-expo" ? "GLOBAL TECH EXPO" :
    template.id === "community-meetup" ? "BUILDERS & FOUNDERS" :
    "OBSIDIAN LUXURY GALA"
  );

  const hostOrg = customHostOrg || theme.tagline;
  const eventDate = customDate || "24 OCT 2026 · 10:00 AM";
  const venueName = customVenue || "The Residency, Coimbatore";
  const ticketId = customTicketId || "#URP-90284";

  // ─────────────────────────────────────────────────────────────
  // 1. DIGITAL MOBILE PASS FORMAT (Apple/Google Wallet aesthetic)
  // ─────────────────────────────────────────────────────────────
  if (template.format === "digital") {
    const isLight = theme.bg === "#FFFFFF";

    return (
      <div
        className={`relative overflow-hidden transition-all duration-200 select-none flex flex-col justify-between ${
          theme.isMono ? "font-mono" : ""
        } ${
          isCard
            ? "w-full max-w-[230px] h-[300px] rounded-2xl p-4 text-xs shadow-md border"
            : "w-full max-w-[280px] sm:max-w-[300px] min-h-[460px] rounded-3xl p-5 sm:p-6 text-sm shadow-2xl border"
        }`}
        style={{
          backgroundColor: theme.bg,
          color: theme.fg,
          borderColor: theme.border,
        }}
      >
        {/* Subtle camera notch island */}
        <div className="flex justify-center -mt-1 mb-2">
          <div className="w-10 h-1.5 rounded-full bg-neutral-900/30" />
        </div>

        {/* Header Row */}
        <div className="flex items-center justify-between pb-2 border-b border-current/15">
          <span className="text-[8.5px] font-black uppercase tracking-widest opacity-80" style={{ color: theme.accent }}>
            {hostOrg}
          </span>
          <span className="text-[8.5px] font-mono font-bold opacity-60">{ticketId}</span>
        </div>

        {/* Event Title */}
        <div className="my-1.5 space-y-0.5">
          <h4 className={`font-black tracking-tight leading-tight uppercase ${isCard ? "text-[12px] line-clamp-1" : "text-[15px] line-clamp-1"}`}>
            {eventName}
          </h4>
          <p className="text-[8px] opacity-75 truncate">{eventDate} · {venueName}</p>
        </div>

        {/* Center QR Pass */}
        <div className="my-1.5 flex justify-center">
          <RealisticQrCode
            size={isCard ? 92 : 130}
            fgColor={isLight ? "#09090B" : "#18181B"}
            bgColor="#FFFFFF"
            label="SUB-0.3s SCAN"
          />
        </div>

        {/* Attendee Details Card */}
        <div
          className="mt-1 p-2 rounded-xl border flex items-center justify-between"
          style={{
            backgroundColor: theme.pillBg,
            borderColor: theme.border,
          }}
        >
          <div className="min-w-0 pr-1">
            <span className="text-[7.5px] uppercase tracking-wider font-semibold opacity-60 block">Pass Holder</span>
            <span className={`font-black uppercase truncate block ${isCard ? "text-[10px]" : "text-[11px]"}`}>
              {attendeeName}
            </span>
          </div>
          <span
            className="text-[8px] font-bold px-2 py-0.5 rounded-md border shrink-0 uppercase tracking-wider"
            style={{
              backgroundColor: theme.pillBg,
              color: theme.pillFg,
              borderColor: theme.border,
            }}
          >
            {theme.pillText}
          </span>
        </div>

        {/* Clean Footer Note */}
        <div className="pt-2 border-t border-current/15 flex items-center justify-between text-[7.5px] opacity-55 font-mono">
          <span>VERIFIED TICKET</span>
          <span>GATE NORTH</span>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. PRINTABLE CONCERT & SPORTS STUB TICKET
  // ─────────────────────────────────────────────────────────────
  if (template.format === "printable") {
    const isLight = theme.bg === "#FFFFFF";

    return (
      <div
        className={`relative overflow-hidden transition-all duration-200 select-none flex flex-row ${
          isCard
            ? "w-full max-w-[290px] h-[150px] rounded-xl shadow-md border text-xs"
            : "w-full max-w-[380px] sm:max-w-[400px] h-[185px] rounded-2xl shadow-2xl border text-sm"
        }`}
        style={{
          backgroundColor: theme.bg,
          color: theme.fg,
          borderColor: theme.border,
        }}
      >
        {/* Left Side: Main Ticket Body (72%) */}
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-mono font-bold uppercase tracking-wider" style={{ color: theme.accent }}>
              ADMISSION PASS
            </span>
            <span className="text-[7.5px] font-mono opacity-60">SEC 102 · ROW A</span>
          </div>

          <div className="my-1">
            <h4 className={`font-black uppercase tracking-tight leading-tight ${isCard ? "text-[11px] line-clamp-1" : "text-sm line-clamp-1"}`}>
              {eventName}
            </h4>
            <p className="text-[7.5px] opacity-75 truncate">{eventDate} · {venueName}</p>
          </div>

          <div className="pt-1 border-t border-current/15 flex items-end justify-between">
            <div className="min-w-0 pr-1">
              <span className="text-[6.5px] uppercase font-semibold opacity-60 block">Attendee</span>
              <span className="font-bold uppercase text-[9px] truncate block">{attendeeName}</span>
            </div>
            <span
              className="font-mono text-[8px] font-bold px-1.5 py-0.5 rounded border"
              style={{
                backgroundColor: theme.pillBg,
                color: theme.pillFg,
                borderColor: theme.border,
              }}
            >
              ZONE A
            </span>
          </div>
        </div>

        {/* Perforated Stub Divider with Notch Punch Cutouts */}
        <div className="relative flex flex-col items-center justify-between py-1 px-0 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700/60 -mt-1 shadow-inner" />
          <div className="w-[1px] flex-1 border-l border-dashed border-current/30 my-0.5" />
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700/60 -mb-1 shadow-inner" />
        </div>

        {/* Right Side: Admit One Stub (28%) */}
        <div className="w-[80px] sm:w-[100px] p-2 bg-black/20 flex flex-col items-center justify-between text-center shrink-0">
          <span className="text-[7px] font-bold uppercase tracking-widest" style={{ color: theme.accent }}>
            ADMIT ONE
          </span>

          <RealisticQrCode
            size={isCard ? 50 : 64}
            fgColor="#000000"
            bgColor="#FFFFFF"
            label=""
          />

          <RealisticBarcode
            code={ticketId}
            color={isLight ? "#000000" : "#FFFFFF"}
            height={isCard ? 12 : 16}
          />
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3. CONFERENCE & FESTIVAL LANYARD BADGE
  // ─────────────────────────────────────────────────────────────
  return (
    <div
      className={`relative overflow-hidden transition-all duration-200 select-none flex flex-col justify-between ${
        isCard
          ? "w-full max-w-[230px] h-[300px] rounded-2xl p-4 text-xs shadow-md border"
          : "w-full max-w-[280px] sm:max-w-[300px] min-h-[460px] rounded-3xl p-5 sm:p-6 text-sm shadow-2xl border"
      }`}
      style={{
        backgroundColor: theme.bg,
        color: theme.fg,
        borderColor: theme.border,
      }}
    >
      {/* Top Lanyard Slot Punch Cutout */}
      <div className="flex flex-col items-center justify-center -mt-1 mb-2 pointer-events-none">
        <div className="w-10 h-1.5 rounded-full bg-black/40 border border-white/20 shadow-inner" />
      </div>

      {/* Header */}
      <div className="text-center space-y-0.5">
        <span className="text-[7.5px] font-mono uppercase tracking-widest opacity-80 block" style={{ color: theme.accent }}>
          OFFICIAL BADGE
        </span>
        <h4 className={`font-black tracking-tight leading-tight uppercase ${isCard ? "text-[12px] line-clamp-1" : "text-[15px] line-clamp-1"}`}>
          {eventName}
        </h4>
        <p className="text-[7.5px] opacity-75 truncate">{eventDate} · {venueName}</p>
      </div>

      {/* Giant Attendee Name Insert */}
      <div className="my-2 p-2.5 sm:p-3 rounded-2xl bg-white text-neutral-950 text-center shadow-md space-y-1">
        <span className="text-[7px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
          CREDENTIAL
        </span>
        <h3 className={`font-black tracking-tight leading-none uppercase text-neutral-950 ${isCard ? "text-xs" : "text-base"}`}>
          {attendeeName}
        </h3>
        <span
          className="inline-block px-2 py-0.5 rounded-full text-white text-[7.5px] font-bold uppercase tracking-wider"
          style={{ backgroundColor: theme.bg === "#000000" ? "#18181B" : theme.bg }}
        >
          {theme.pillText}
        </span>
      </div>

      {/* Bottom QR & NFC Scan */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-current/10 border border-current/15">
        <RealisticQrCode
          size={isCard ? 50 : 68}
          fgColor="#000000"
          bgColor="#FFFFFF"
          label=""
        />
        <div className="text-right space-y-0.5">
          <div className="flex items-center justify-end gap-1 text-[7.5px] font-bold" style={{ color: theme.accent }}>
            <Radio className="w-2.5 h-2.5 animate-pulse" />
            <span>NFC TAP</span>
          </div>
          <span className="font-mono text-[7.5px] block opacity-80">{ticketId}</span>
        </div>
      </div>
    </div>
  );
}
