"use client";

import React from "react";
import type { StudioTemplateDefinition } from "@/lib/studio/templates";
import {
  ShieldCheck,
  Building2,
  Calendar,
  MapPin,
  CheckCircle2,
  UserCheck,
  Award,
  Briefcase,
  Layers,
  Radio,
} from "lucide-react";

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
 * Enterprise Vector Barcode Component
 */
function CorporateBarcode({
  code = "URP-8492049102",
  color = "#18181B",
  height = 18,
}: {
  code?: string;
  color?: string;
  height?: number;
}) {
  const bars = [2, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1, 3, 1, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 3, 1, 2, 3, 1, 2];
  return (
    <div className="flex flex-col items-center select-none shrink-0">
      <div className="flex items-stretch gap-[1.2px]" style={{ height }}>
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
        className="font-mono text-[6.5px] tracking-[0.2em] uppercase mt-0.5 opacity-65 font-medium"
        style={{ color }}
      >
        {code}
      </span>
    </div>
  );
}

/**
 * High-Density Vector QR Code with Precision Reticles
 */
function CorporateQrCode({
  size = 80,
  fgColor = "#09090B",
  bgColor = "#FFFFFF",
  borderColor = "#E2E8F0",
}: {
  size?: number;
  fgColor?: string;
  bgColor?: string;
  borderColor?: string;
}) {
  const innerSize = Math.max(size - 14, 32);

  return (
    <div
      className="p-1.5 rounded-lg flex flex-col items-center justify-center select-none shadow-xs border relative"
      style={{
        backgroundColor: bgColor,
        width: size,
        height: size,
        borderColor: borderColor,
      }}
    >
      <svg
        width={innerSize}
        height={innerSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Top-Left Finder */}
        <rect x="6" y="6" width="24" height="24" rx="2" fill={fgColor} />
        <rect x="10" y="10" width="16" height="16" rx="1" fill={bgColor} />
        <rect x="14" y="14" width="8" height="8" fill={fgColor} />

        {/* Top-Right Finder */}
        <rect x="70" y="6" width="24" height="24" rx="2" fill={fgColor} />
        <rect x="74" y="10" width="16" height="16" rx="1" fill={bgColor} />
        <rect x="78" y="14" width="8" height="8" fill={fgColor} />

        {/* Bottom-Left Finder */}
        <rect x="6" y="70" width="24" height="24" rx="2" fill={fgColor} />
        <rect x="10" y="74" width="16" height="16" rx="1" fill={bgColor} />
        <rect x="14" y="78" width="8" height="8" fill={fgColor} />

        {/* Modules */}
        <rect x="36" y="8" width="5" height="5" fill={fgColor} />
        <rect x="46" y="8" width="5" height="5" fill={fgColor} />
        <rect x="56" y="8" width="5" height="5" fill={fgColor} />
        <rect x="36" y="18" width="5" height="5" fill={fgColor} />
        <rect x="52" y="18" width="5" height="5" fill={fgColor} />
        <rect x="42" y="26" width="6" height="6" fill={fgColor} />
        <rect x="54" y="26" width="6" height="6" fill={fgColor} />

        <rect x="36" y="36" width="6" height="6" fill={fgColor} />
        <rect x="48" y="36" width="6" height="6" fill={fgColor} />
        <rect x="60" y="36" width="6" height="6" fill={fgColor} />
        <rect x="20" y="44" width="6" height="6" fill={fgColor} />
        <rect x="36" y="48" width="6" height="6" fill={fgColor} />
        <rect x="48" y="48" width="6" height="6" fill={fgColor} />
        <rect x="60" y="48" width="6" height="6" fill={fgColor} />
        <rect x="74" y="44" width="6" height="6" fill={fgColor} />

        <rect x="36" y="66" width="5" height="5" fill={fgColor} />
        <rect x="46" y="66" width="5" height="5" fill={fgColor} />
        <rect x="56" y="66" width="5" height="5" fill={fgColor} />
        <rect x="68" y="66" width="5" height="5" fill={fgColor} />
        <rect x="80" y="66" width="5" height="5" fill={fgColor} />
        <rect x="36" y="78" width="5" height="5" fill={fgColor} />
        <rect x="52" y="78" width="5" height="5" fill={fgColor} />
        <rect x="68" y="78" width="5" height="5" fill={fgColor} />
        <rect x="80" y="86" width="5" height="5" fill={fgColor} />
      </svg>
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
  customTicketId,
}: TicketVisualShowcaseProps) {
  const isCard = mode === "card";
  const id = template.id;

  const attendeeName = customAttendeeName || (
    id === "corporate-summit-gala" ? "ELIZABETH VANCE" :
    id === "vip-all-access" ? "ARTHUR STERLING" :
    id === "tech-conf-badge" ? "MARCUS CHEN" :
    id === "exhibition-trade-expo" ? "DAVID M. KAUFMAN" :
    id === "college-fest-badge" ? "DR. ANANYA RAMESH" :
    id === "workshop-masterclass" ? "SARAH JENNINGS" :
    "ALEXANDER WRIGHT"
  );

  const eventName = customEventName || (
    id === "minimal-monochrome" ? "GLOBAL ARCHITECTURE FORUM" :
    id === "concert-music-fest" ? "ANNUAL PHILHARMONIC GALA" :
    id === "corporate-summit-gala" ? "WORLD LEADERSHIP CONGRESS" :
    id === "college-fest-badge" ? "NATIONAL ACADEMIC SYMPOSIUM" :
    id === "tech-conf-badge" ? "ENTERPRISE CLOUD SUMMIT" :
    id === "hackathon-terminal" ? "ENGINEERING BUILDATHON" :
    id === "vip-all-access" ? "EXECUTIVE PATRON PASS" :
    id === "workshop-masterclass" ? "EXECUTIVE LEADERSHIP LAB" :
    id === "sports-arena-ticket" ? "NATIONAL CHAMPIONSHIP CUP" :
    id === "exhibition-trade-expo" ? "GLOBAL INDUSTRY EXPO" :
    id === "community-meetup" ? "FOUNDERS & INVESTORS ROUNDTABLE" :
    "ANNUAL TRUSTEES DINNER"
  );

  const hostOrg = customHostOrg || (
    id === "college-fest-badge" ? "FACULTY OF ENGINEERING" :
    id === "corporate-summit-gala" ? "GLOBAL FORUM FOUNDATION" :
    id === "tech-conf-badge" ? "CLOUD ENTERPRISE ALLIANCE" :
    "URPASS CONFERENCES"
  );

  const ticketId = customTicketId || "#URP-84920";
  const eventDate = customDate || "OCTOBER 24, 2026 · 09:00 AM";
  const venueName = customVenue || "Grand Hyatt Executive Hall, Bangalore";

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 1: MINIMAL MONOCHROME (Swiss Corporate Editorial Pass)
  // ══════════════════════════════════════════════════════════════════
  if (id === "minimal-monochrome") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-200 select-none flex flex-col justify-between bg-white text-neutral-900 border border-neutral-300 shadow-sm ${
          isCard
            ? "w-[205px] h-[270px] rounded-xl p-3.5 text-xs"
            : "w-[290px] sm:max-w-[310px] min-h-[480px] rounded-2xl p-5 text-sm shadow-xl"
        }`}
      >
        {/* Top Header Compartment */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
            <span className="text-[7.5px] font-mono uppercase tracking-[0.18em] font-bold text-neutral-800">
              OFFICIAL DELEGATE
            </span>
          </div>
          <span className="text-[7px] font-mono text-neutral-500 font-semibold">{ticketId}</span>
        </div>

        {/* Event Title Block */}
        <div className="my-1.5 space-y-0.5">
          <p className="text-[6.5px] font-mono text-neutral-400 tracking-wider uppercase font-semibold">EVENT CODE // 01</p>
          <h4 className={`font-bold tracking-tight uppercase leading-tight text-neutral-950 ${isCard ? "text-[11.5px] line-clamp-1" : "text-base line-clamp-1"}`}>
            {eventName}
          </h4>
          <p className="text-[7.5px] font-mono text-neutral-500 truncate">{eventDate} · {venueName}</p>
        </div>

        {/* Center QR Zone */}
        <div className="my-1 flex justify-center">
          <CorporateQrCode
            size={isCard ? 92 : 140}
            fgColor="#0A0A0A"
            bgColor="#FFFFFF"
            borderColor="#E4E4E7"
          />
        </div>

        {/* Attendee Credential Card */}
        <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <span className="text-[6.5px] uppercase font-mono tracking-wider font-semibold text-neutral-400 block">ATTENDEE</span>
            <span className={`font-bold uppercase truncate block text-neutral-900 ${isCard ? "text-[10px]" : "text-xs"}`}>
              {attendeeName}
            </span>
          </div>
          <span className="text-[7px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 text-white uppercase shrink-0">
            DELEGATE
          </span>
        </div>

        {/* Micro-Details Footer */}
        <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[7px] font-mono text-neutral-500">
          <span>HALL B // ENTRANCE 01</span>
          <span className="font-semibold text-neutral-700">VERIFIED STATUS</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 2: CONCERT & SYMPHONY GALA (Auditorium Stub with Perforation)
  // ══════════════════════════════════════════════════════════════════
  if (id === "concert-music-fest") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-200 select-none flex flex-row bg-slate-900 text-slate-100 border border-slate-700/80 shadow-md ${
          isCard
            ? "w-[250px] h-[140px] rounded-lg text-xs my-auto"
            : "w-[370px] sm:max-w-[400px] h-[190px] rounded-xl shadow-xl text-sm"
        }`}
      >
        {/* Left Section: Main Ticket Body (72%) */}
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[7.5px] font-mono uppercase tracking-[0.16em] font-semibold text-slate-400">
              AUDITORIUM ADMISSION
            </span>
            <span className="text-[7px] font-mono text-slate-400 font-medium">TIER 1</span>
          </div>

          <div className="my-0.5">
            <h4 className={`font-bold tracking-tight uppercase leading-tight text-white ${isCard ? "text-[10.5px] line-clamp-1" : "text-sm line-clamp-1"}`}>
              {eventName}
            </h4>
            <div className="flex gap-2 text-[7px] font-mono text-slate-400 mt-0.5">
              <span>ORCHESTRA LEVEL</span>
              <span>·</span>
              <span>ROW C · SEAT 18</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[6px] uppercase font-mono text-slate-400 block font-medium">PATRON NAME</span>
              <span className="font-semibold uppercase text-[8.5px] text-slate-100 truncate block">{attendeeName}</span>
            </div>
            <span className="text-[7px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 uppercase">
              TIER A PASS
            </span>
          </div>
        </div>

        {/* Perforated Divider */}
        <div className="relative flex flex-col items-center justify-between py-1 px-0 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F4F5F7] border border-neutral-300 -mt-1 shadow-inner" />
          <div className="w-[1px] flex-1 border-l border-dashed border-slate-700 my-0.5" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#F4F5F7] border border-neutral-300 -mb-1 shadow-inner" />
        </div>

        {/* Right Section: Stub (28%) */}
        <div className="w-[78px] sm:w-[102px] p-2 bg-slate-950 flex flex-col items-center justify-between text-center shrink-0">
          <span className="text-[6.5px] font-mono font-semibold uppercase tracking-wider text-slate-400">
            AUDITORIUM STUB
          </span>
          <CorporateQrCode size={isCard ? 48 : 66} fgColor="#0F172A" bgColor="#FFFFFF" />
          <CorporateBarcode code={ticketId} color="#FFFFFF" height={isCard ? 10 : 14} />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 3: CORPORATE SUMMIT & GALA (Executive Digital Pass)
  // ══════════════════════════════════════════════════════════════════
  if (id === "corporate-summit-gala") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-200 select-none flex flex-col justify-between bg-gradient-to-b from-[#0F1E36] to-[#0A1322] text-white border border-slate-700 shadow-md ${
          isCard
            ? "w-[205px] h-[270px] rounded-xl p-3.5 text-xs"
            : "w-[290px] sm:max-w-[310px] min-h-[480px] rounded-2xl p-5 text-sm shadow-xl"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3 h-3 text-sky-400" />
            <span className="text-[7.5px] font-mono uppercase tracking-[0.16em] font-semibold text-slate-300">
              EXECUTIVE FORUM
            </span>
          </div>
          <span className="text-[7px] font-mono text-slate-400">{ticketId}</span>
        </div>

        {/* Event Title */}
        <div className="my-1.5 space-y-0.5">
          <p className="text-[6.5px] font-mono text-sky-400 uppercase font-semibold tracking-wider">ANNUAL PLENARY</p>
          <h4 className={`font-bold tracking-tight uppercase leading-tight text-white ${isCard ? "text-[11.5px] line-clamp-1" : "text-base line-clamp-1"}`}>
            {eventName}
          </h4>
          <p className="text-[7.5px] text-slate-400 font-mono truncate">{eventDate} · {venueName}</p>
        </div>

        {/* QR Zone */}
        <div className="my-1 flex justify-center">
          <CorporateQrCode
            size={isCard ? 90 : 135}
            fgColor="#0A1322"
            bgColor="#FFFFFF"
            borderColor="#38BDF8"
          />
        </div>

        {/* Attendee Details Card */}
        <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-700 flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <span className="text-[6.5px] uppercase font-mono tracking-wider font-semibold text-slate-400 block">DELEGATE</span>
            <span className={`font-bold uppercase truncate block text-white ${isCard ? "text-[10px]" : "text-xs"}`}>
              {attendeeName}
            </span>
            <span className="text-[6.5px] text-slate-400 truncate block">DIRECTOR // ENTERPRISE CORP</span>
          </div>
          <span className="text-[7px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-600/40 uppercase shrink-0">
            BOARD
          </span>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-[7px] font-mono text-slate-400">
          <span>HALL 01 · ROW A</span>
          <span className="text-slate-300 font-semibold">SECURITY CLEARED</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 4: ACADEMIC & UNIVERSITY SYMPOSIUM (Lanyard Badge)
  // ══════════════════════════════════════════════════════════════════
  if (id === "college-fest-badge") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-200 select-none flex flex-col justify-between bg-white text-neutral-900 border-2 border-neutral-300 shadow-sm ${
          isCard
            ? "w-[205px] h-[270px] rounded-xl p-3.5 text-xs"
            : "w-[290px] sm:max-w-[310px] min-h-[480px] rounded-2xl p-5 text-sm shadow-xl"
        }`}
      >
        {/* Lanyard Punch Slot with Clean Slot Border */}
        <div className="flex flex-col items-center justify-center -mt-1 mb-1.5 pointer-events-none">
          <div className="w-10 h-1.5 rounded-full bg-neutral-200 border border-neutral-300" />
        </div>

        {/* Institution Header */}
        <div className="text-center pb-1.5 border-b border-neutral-200">
          <span className="text-[7px] font-mono uppercase tracking-[0.16em] font-bold text-neutral-500 block">
            {hostOrg}
          </span>
          <h4 className={`font-bold tracking-tight uppercase leading-tight text-neutral-950 mt-0.5 ${isCard ? "text-[11.5px] line-clamp-1" : "text-base line-clamp-1"}`}>
            {eventName}
          </h4>
        </div>

        {/* High-Legibility Attendee Name Credential */}
        <div className="my-1.5 p-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-center">
          <span className="text-[6.5px] font-mono uppercase tracking-wider text-neutral-500 block font-semibold">
            ACCREDITED PARTICIPANT
          </span>
          <h3 className={`font-bold tracking-tight uppercase text-neutral-900 leading-tight ${isCard ? "text-[12px]" : "text-lg"}`}>
            {attendeeName}
          </h3>
          <span className="text-[6.5px] font-mono text-neutral-600 block mt-0.5">FACULTY OF SCIENCE &amp; TECH</span>
        </div>

        {/* QR & Verification Zone */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-200">
          <CorporateQrCode size={isCard ? 50 : 75} fgColor="#171717" bgColor="#FFFFFF" />
          <div className="text-right space-y-0.5">
            <span className="text-[7px] font-mono font-bold text-neutral-900 uppercase block">ALL-SESSIONS ACCESS</span>
            <span className="font-mono text-[6.5px] text-neutral-500 block">{ticketId}</span>
            <span className="text-[6px] font-mono font-bold px-1.5 py-0.2 rounded bg-neutral-900 text-white uppercase inline-block">
              DELEGATE
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 5: TECH CONFERENCE & KEYNOTE (Enterprise Slate Badge)
  // ══════════════════════════════════════════════════════════════════
  if (id === "tech-conf-badge") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-200 select-none flex flex-col justify-between bg-slate-900 text-slate-100 border border-slate-700 shadow-md ${
          isCard
            ? "w-[205px] h-[270px] rounded-xl p-3.5 text-xs"
            : "w-[290px] sm:max-w-[310px] min-h-[480px] rounded-2xl p-5 text-sm shadow-xl"
        }`}
      >
        {/* Lanyard Slot */}
        <div className="flex flex-col items-center justify-center -mt-1 mb-1.5 pointer-events-none">
          <div className="w-10 h-1.5 rounded-full bg-slate-800 border border-slate-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
          <span className="text-[7.5px] font-mono uppercase tracking-[0.16em] font-semibold text-slate-400">
            CONFERENCE CREDENTIAL
          </span>
          <span className="text-[6.5px] font-mono text-slate-400">{ticketId}</span>
        </div>

        {/* Title */}
        <div className="my-1 space-y-0.5">
          <h4 className={`font-bold tracking-tight uppercase leading-tight text-white ${isCard ? "text-[11px] line-clamp-1" : "text-base line-clamp-1"}`}>
            {eventName}
          </h4>
          <p className="text-[7px] text-slate-400 font-mono truncate">{eventDate} · {venueName}</p>
        </div>

        {/* Name Badge */}
        <div className="my-1 p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-center">
          <span className="text-[6px] font-mono text-emerald-400 block uppercase font-semibold">CONFIRMED SPEAKER</span>
          <h3 className={`font-bold tracking-tight uppercase text-white leading-tight ${isCard ? "text-[12px]" : "text-base"}`}>
            {attendeeName}
          </h3>
          <span className="text-[6.5px] font-mono text-slate-400 block mt-0.5">VP OF PLATFORM // TECH CORP</span>
        </div>

        {/* QR & Verification */}
        <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950 border border-slate-800">
          <CorporateQrCode size={isCard ? 48 : 72} fgColor="#0F172A" bgColor="#FFFFFF" />
          <div className="text-right space-y-0.5">
            <span className="text-[7px] font-mono font-semibold text-emerald-400 block">KEYNOTE ACCESS</span>
            <span className="text-[6px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-200 border border-slate-700 inline-block uppercase">
              SPEAKER
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 6: ENGINEERING SPRINT & BUILDATHON (Clean Graphite Pass)
  // ══════════════════════════════════════════════════════════════════
  if (id === "hackathon-terminal") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-200 select-none flex flex-col justify-between bg-neutral-900 text-neutral-100 border border-neutral-700 shadow-md ${
          isCard
            ? "w-[205px] h-[270px] rounded-xl p-3.5 text-xs font-mono"
            : "w-[290px] sm:max-w-[310px] min-h-[480px] rounded-2xl p-5 text-sm shadow-xl font-mono"
        }`}
      >
        {/* Clean Tech Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800">
          <span className="text-[7.5px] font-bold text-neutral-300">
            ENGINEERING BADGE // 2026
          </span>
          <span className="text-[6.5px] text-neutral-400">{ticketId}</span>
        </div>

        {/* Title */}
        <div className="my-1 space-y-0.5">
          <span className="text-[6.5px] text-neutral-500 uppercase block font-semibold">TRACK: DISTRIBUTED SYSTEMS</span>
          <h4 className={`font-bold tracking-tight uppercase leading-tight text-white ${isCard ? "text-[11px] line-clamp-1" : "text-base line-clamp-1"}`}>
            {eventName}
          </h4>
          <span className="text-[6.5px] text-neutral-400 block">36-HOUR COMPETITIVE SPRINT</span>
        </div>

        {/* QR Frame */}
        <div className="my-1 flex justify-center">
          <CorporateQrCode
            size={isCard ? 88 : 135}
            fgColor="#171717"
            bgColor="#FFFFFF"
            borderColor="#3F3F46"
          />
        </div>

        {/* Attendee Box */}
        <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 space-y-0.5">
          <div className="flex justify-between text-[6.5px] text-neutral-400">
            <span>ENGINEER</span>
            <span className="text-white font-bold">TEAM LEAD</span>
          </div>
          <p className={`font-bold uppercase text-white truncate ${isCard ? "text-[10.5px]" : "text-xs"}`}>
            {attendeeName}
          </p>
          <div className="flex justify-between text-[6px] text-neutral-500 border-t border-neutral-800 pt-0.5">
            <span>ID: #ENG-9014</span>
            <span>REPO: INTERNAL</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-1 border-t border-neutral-800 flex justify-between text-[6.5px] text-neutral-400">
          <span>LAB B // DESK 14</span>
          <span className="text-neutral-300 font-bold">24-HR ADMISSION</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 7: EXECUTIVE PATRON PASS (Matte Obsidian & Champagne)
  // ══════════════════════════════════════════════════════════════════
  if (id === "vip-all-access") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-200 select-none flex flex-col justify-between bg-neutral-950 text-white border border-amber-500/40 shadow-md ${
          isCard
            ? "w-[205px] h-[270px] rounded-xl p-3.5 text-xs"
            : "w-[290px] sm:max-w-[310px] min-h-[480px] rounded-2xl p-5 text-sm shadow-xl"
        }`}
      >
        {/* Header */}
        <div className="text-center pb-1.5 border-b border-neutral-800">
          <div className="flex items-center justify-center gap-1.5 text-[7px] font-mono tracking-[0.2em] font-semibold text-amber-300 uppercase">
            <Award className="w-2.5 h-2.5 text-amber-400" />
            <span>EXECUTIVE PATRON PASS</span>
          </div>
          <h4 className={`font-bold uppercase tracking-tight text-white mt-0.5 ${isCard ? "text-[11.5px] line-clamp-1" : "text-base line-clamp-1"}`}>
            {eventName}
          </h4>
        </div>

        {/* Attendee Clean Card */}
        <div className="my-1.5 p-2 rounded-lg bg-neutral-900 border border-amber-500/30 text-center">
          <span className="text-[6.5px] font-mono uppercase tracking-wider text-amber-400 block font-semibold">
            HONORED GUEST
          </span>
          <h3 className={`font-bold tracking-tight uppercase text-white leading-tight ${isCard ? "text-[11px]" : "text-base"}`}>
            {attendeeName}
          </h3>
          <span className="text-[6.5px] font-mono text-neutral-400 block">MANAGING PARTNER // STERLING HOLDINGS</span>
        </div>

        {/* Center QR Zone */}
        <div className="my-1 flex justify-center">
          <CorporateQrCode
            size={isCard ? 75 : 110}
            fgColor="#09090B"
            bgColor="#FFFFFF"
            borderColor="#D97706"
          />
        </div>

        {/* Micro-Details Footer */}
        <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[7px] font-mono text-neutral-400">
          <span>PRIORITY ADMISSION</span>
          <span className="text-amber-300 font-semibold">{ticketId}</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 8: PROFESSIONAL MASTERCLASS & CERTIFICATION (Stub)
  // ══════════════════════════════════════════════════════════════════
  if (id === "workshop-masterclass") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-200 select-none flex flex-row bg-white text-neutral-900 border border-neutral-300 shadow-sm ${
          isCard
            ? "w-[250px] h-[140px] rounded-lg text-xs my-auto"
            : "w-[370px] sm:max-w-[400px] h-[190px] rounded-xl shadow-xl text-sm"
        }`}
      >
        {/* Left Section (72%) */}
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[7.5px] font-mono uppercase tracking-[0.16em] font-bold text-neutral-700">
              EXECUTIVE MASTERCLASS
            </span>
            <span className="text-[7px] font-mono text-neutral-400 font-semibold">CONFIRMED SEAT</span>
          </div>

          <div className="my-0.5">
            <h4 className={`font-bold uppercase tracking-tight leading-tight text-neutral-950 ${isCard ? "text-[10px] line-clamp-1" : "text-sm line-clamp-1"}`}>
              {eventName}
            </h4>
            <p className="text-[7px] text-neutral-500 truncate font-mono">{eventDate}</p>
          </div>

          <div className="pt-1.5 border-t border-neutral-200 flex items-center justify-between">
            <div>
              <span className="text-[6px] uppercase font-mono text-neutral-400 font-semibold block">PARTICIPANT</span>
              <span className="font-bold uppercase text-[8.5px] text-neutral-900 truncate block">{attendeeName}</span>
            </div>
            <span className="text-[7px] font-mono font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200 uppercase">
              MODULE 01-04
            </span>
          </div>
        </div>

        {/* Perforated Divider */}
        <div className="relative flex flex-col items-center justify-between py-1 px-0 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F4F5F7] border border-neutral-300 -mt-1 shadow-inner" />
          <div className="w-[1px] flex-1 border-l border-dashed border-neutral-300 my-0.5" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#F4F5F7] border border-neutral-300 -mb-1 shadow-inner" />
        </div>

        {/* Right Section (28%) */}
        <div className="w-[78px] sm:w-[102px] p-2 bg-neutral-50 flex flex-col items-center justify-between text-center shrink-0">
          <span className="text-[6.5px] font-mono font-bold uppercase tracking-wider text-neutral-600">
            CLASS STUB
          </span>
          <CorporateQrCode size={isCard ? 48 : 66} fgColor="#0A0A0A" bgColor="#FFFFFF" />
          <CorporateBarcode code={ticketId} color="#171717" height={isCard ? 10 : 14} />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 9: STADIUM & PAVILION PASS (Printable Ticket Stub)
  // ══════════════════════════════════════════════════════════════════
  if (id === "sports-arena-ticket") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-200 select-none flex flex-row bg-neutral-900 text-neutral-100 border border-neutral-700 shadow-sm ${
          isCard
            ? "w-[250px] h-[140px] rounded-lg text-xs my-auto"
            : "w-[370px] sm:max-w-[400px] h-[190px] rounded-xl shadow-xl text-sm"
        }`}
      >
        {/* Left Section */}
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[7.5px] font-mono uppercase tracking-[0.16em] font-semibold text-neutral-300">
              PAVILION GRANDSTAND PASS
            </span>
            <span className="text-[7px] font-mono text-neutral-400 font-bold">GATE 04</span>
          </div>

          <div className="my-0.5">
            <h4 className={`font-bold uppercase tracking-tight leading-tight text-white ${isCard ? "text-[10px] line-clamp-1" : "text-sm line-clamp-1"}`}>
              {eventName}
            </h4>
            <div className="flex gap-2 text-[7px] font-mono text-neutral-300 mt-0.5 font-bold">
              <span>SEC: 104</span>
              <span>ROW: B</span>
              <span>SEAT: 22</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-[6px] uppercase font-mono text-neutral-500 font-semibold block">TICKET HOLDER</span>
              <span className="font-bold uppercase text-[8.5px] text-white truncate block">{attendeeName}</span>
            </div>
            <span className="text-[7px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-200 border border-neutral-700 uppercase">
              RESERVED
            </span>
          </div>
        </div>

        {/* Perforation */}
        <div className="relative flex flex-col items-center justify-between py-1 px-0 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F4F5F7] border border-neutral-400 -mt-1 shadow-inner" />
          <div className="w-[1px] flex-1 border-l border-dashed border-neutral-600 my-0.5" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#F4F5F7] border border-neutral-400 -mb-1 shadow-inner" />
        </div>

        {/* Right Section */}
        <div className="w-[78px] sm:w-[102px] p-2 bg-neutral-950 flex flex-col items-center justify-between text-center shrink-0">
          <span className="text-[6.5px] font-mono font-bold uppercase tracking-wider text-neutral-400">
            ENTRY STUB
          </span>
          <CorporateQrCode size={isCard ? 48 : 66} fgColor="#171717" bgColor="#FFFFFF" />
          <CorporateBarcode code={ticketId} color="#FFFFFF" height={isCard ? 10 : 14} />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 10: B2B TRADE EXPO & BUYER CREDENTIAL (Lanyard Badge)
  // ══════════════════════════════════════════════════════════════════
  if (id === "exhibition-trade-expo") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-200 select-none flex flex-col justify-between bg-white text-neutral-900 border-2 border-neutral-300 shadow-sm ${
          isCard
            ? "w-[205px] h-[270px] rounded-xl p-3.5 text-xs"
            : "w-[290px] sm:max-w-[310px] min-h-[480px] rounded-2xl p-5 text-sm shadow-xl"
        }`}
      >
        {/* Lanyard Top Slot */}
        <div className="flex flex-col items-center justify-center -mt-1 mb-1.5 pointer-events-none">
          <div className="w-10 h-1.5 rounded-full bg-neutral-200 border border-neutral-300" />
        </div>

        {/* Expo Header */}
        <div className="text-center pb-1.5 border-b border-neutral-200">
          <span className="text-[7px] font-mono uppercase tracking-[0.16em] font-bold text-neutral-500 block">
            TRADE VISITOR CREDENTIAL
          </span>
          <h4 className={`font-bold uppercase tracking-tight text-neutral-950 mt-0.5 ${isCard ? "text-[11.5px] line-clamp-1" : "text-base line-clamp-1"}`}>
            {eventName}
          </h4>
        </div>

        {/* High-Visibility Attendee Card */}
        <div className="my-1.5 p-2 rounded-lg bg-neutral-100 border border-neutral-200 text-center">
          <span className="text-[6.5px] font-mono uppercase tracking-wider text-neutral-500 block font-semibold">
            TRADE BUYER
          </span>
          <h3 className={`font-bold tracking-tight uppercase text-neutral-900 leading-tight ${isCard ? "text-[12px]" : "text-lg"}`}>
            {attendeeName}
          </h3>
          <span className="text-[7px] font-semibold text-neutral-600 block uppercase">
            APEX GLOBAL SOLUTIONS
          </span>
        </div>

        {/* QR & Halls */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-200">
          <CorporateQrCode size={isCard ? 48 : 72} fgColor="#0A0A0A" bgColor="#FFFFFF" />
          <div className="text-right space-y-0.5">
            <span className="text-[7px] font-mono font-bold text-neutral-800 block uppercase">EXHIBIT HALLS 1-4</span>
            <span className="font-mono text-[6.5px] text-neutral-500 block">{ticketId}</span>
            <span className="text-[6px] font-mono font-bold px-1.5 py-0.2 rounded bg-neutral-900 text-white inline-block uppercase">
              B2B VISITOR
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 11: FOUNDERS & INVESTORS ROUNDTABLE (Digital Pass)
  // ══════════════════════════════════════════════════════════════════
  if (id === "community-meetup") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-200 select-none flex flex-col justify-between bg-neutral-900 text-white border border-neutral-700 shadow-md ${
          isCard
            ? "w-[205px] h-[270px] rounded-xl p-3.5 text-xs"
            : "w-[290px] sm:max-w-[310px] min-h-[480px] rounded-2xl p-5 text-sm shadow-xl"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800">
          <span className="text-[7.5px] font-mono uppercase tracking-[0.16em] font-semibold text-neutral-400">
            ROUNDTABLE ACCESS
          </span>
          <span className="text-[6.5px] font-mono text-neutral-400 font-bold">{ticketId}</span>
        </div>

        {/* Title */}
        <div className="my-1.5 space-y-0.5">
          <span className="text-[6.5px] font-mono text-neutral-400 block font-semibold">BY INVITATION ONLY</span>
          <h4 className={`font-bold tracking-tight uppercase leading-tight text-white ${isCard ? "text-[11px] line-clamp-1" : "text-base line-clamp-1"}`}>
            {eventName}
          </h4>
          <p className="text-[7px] text-neutral-400 font-mono truncate">{eventDate} · {venueName}</p>
        </div>

        {/* QR Center */}
        <div className="my-1 flex justify-center">
          <CorporateQrCode
            size={isCard ? 90 : 135}
            fgColor="#171717"
            bgColor="#FFFFFF"
            borderColor="#52525B"
          />
        </div>

        {/* Attendee Row */}
        <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <span className="text-[6.5px] uppercase font-mono tracking-wider text-neutral-400 block font-semibold">ATTENDEE</span>
            <span className={`font-bold uppercase truncate block text-white ${isCard ? "text-[10px]" : "text-xs"}`}>
              {attendeeName}
            </span>
          </div>
          <span className="text-[7px] font-mono font-bold px-2 py-0.5 rounded bg-white text-neutral-950 uppercase shrink-0">
            FOUNDER
          </span>
        </div>

        {/* Footer */}
        <div className="pt-1.5 border-t border-neutral-800 flex items-center justify-between text-[7px] font-mono text-neutral-400">
          <span>PRIVATE EXECUTIVE SUITE</span>
          <span className="font-semibold text-white">CONFIRMED GUEST</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 12: DARK OBSIDIAN LUXURY (Private Trustees Dinner)
  // ══════════════════════════════════════════════════════════════════
  return (
    <div
      className={`relative overflow-hidden transition-all duration-200 select-none flex flex-col justify-between bg-black text-white border border-neutral-800 shadow-md ${
        isCard
          ? "w-[205px] h-[270px] rounded-xl p-3.5 text-xs"
          : "w-[290px] sm:max-w-[310px] min-h-[480px] rounded-2xl p-5 text-sm shadow-xl"
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-neutral-900">
        <span className="text-[7.5px] font-mono uppercase tracking-[0.2em] font-semibold text-neutral-400">
          PRIVATE RECEPTION
        </span>
        <span className="text-[7px] font-mono text-neutral-500">{ticketId}</span>
      </div>

      {/* Title */}
      <div className="my-1.5 space-y-0.5 text-center">
        <h4 className={`font-bold tracking-tight uppercase leading-tight text-white ${isCard ? "text-[11.5px] line-clamp-1" : "text-base line-clamp-1"}`}>
          {eventName}
        </h4>
        <p className="text-[7px] font-mono text-neutral-400 truncate">{eventDate} · {venueName}</p>
      </div>

      {/* Luxury QR Center */}
      <div className="my-1 flex justify-center">
        <CorporateQrCode
          size={isCard ? 92 : 140}
          fgColor="#000000"
          bgColor="#FFFFFF"
          borderColor="#27272A"
        />
      </div>

      {/* Patron Card */}
      <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-900 flex items-center justify-between">
        <div className="min-w-0 pr-1">
          <span className="text-[6.5px] uppercase font-mono tracking-wider text-neutral-500 block font-semibold">GUEST</span>
          <span className={`font-bold uppercase truncate block text-white ${isCard ? "text-[10px]" : "text-xs"}`}>
            {attendeeName}
          </span>
        </div>
        <span className="text-[7px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-950 uppercase shrink-0">
          PATRON
        </span>
      </div>

      {/* Footer */}
      <div className="pt-1.5 border-t border-neutral-900 flex items-center justify-between text-[7px] font-mono text-neutral-500">
        <span>NON-TRANSFERABLE</span>
        <span className="font-semibold text-neutral-400">BLACK TIE REQUIRED</span>
      </div>
    </div>
  );
}
