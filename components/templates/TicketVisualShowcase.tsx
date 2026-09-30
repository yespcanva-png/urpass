"use client";

import React from "react";
import type { StudioTemplateDefinition } from "@/lib/studio/templates";
import {
  Radio,
  Sparkles,
  Shield,
  Wifi,
  Crown,
  Trophy,
  Terminal,
  Cpu,
  Ticket,
  GraduationCap,
  Calendar,
  MapPin,
  CheckCircle2,
  QrCode,
  Music,
  Zap,
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
 * Realistic Code-128 Barcode with Crisp Vector Bars
 */
function RealisticBarcode({
  code = "URP-8492049102",
  color = "#000000",
  height = 20,
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
        className="font-mono text-[6.5px] tracking-[0.2em] uppercase mt-0.5 opacity-70 font-semibold"
        style={{ color }}
      >
        {code}
      </span>
    </div>
  );
}

/**
 * Clean, Vector-Accurate QR Code with Alignment Markers & Scan Brackets
 */
function RealisticQrCode({
  size = 80,
  fgColor = "#09090B",
  bgColor = "#FFFFFF",
  label,
  bracketColor,
}: {
  size?: number;
  fgColor?: string;
  bgColor?: string;
  label?: string;
  bracketColor?: string;
}) {
  const qrInnerSize = Math.max(size - 12, 36);

  return (
    <div
      className="p-1.5 rounded-xl flex flex-col items-center justify-center select-none shadow-xs border relative group/qr"
      style={{
        backgroundColor: bgColor,
        width: size,
        height: size,
        borderColor: bracketColor ? `${bracketColor}40` : "rgba(0,0,0,0.06)",
      }}
    >
      {/* Corner Bracket Reticles */}
      {bracketColor && size >= 70 && (
        <>
          <div
            className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 rounded-tl-sm pointer-events-none"
            style={{ borderColor: bracketColor }}
          />
          <div
            className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 rounded-tr-sm pointer-events-none"
            style={{ borderColor: bracketColor }}
          />
          <div
            className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 rounded-bl-sm pointer-events-none"
            style={{ borderColor: bracketColor }}
          />
          <div
            className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 rounded-br-sm pointer-events-none"
            style={{ borderColor: bracketColor }}
          />
        </>
      )}

      <svg
        width={qrInnerSize}
        height={qrInnerSize}
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

        {/* Data Pattern Modules */}
        <rect x="36" y="8" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="46" y="8" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="56" y="8" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="36" y="18" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="52" y="18" width="5" height="5" rx="1" fill={fgColor} />
        <rect x="42" y="26" width="6" height="6" rx="1" fill={fgColor} />
        <rect x="54" y="26" width="6" height="6" rx="1" fill={fgColor} />

        {/* Center Cluster */}
        <rect x="36" y="36" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="48" y="36" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="60" y="36" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="20" y="44" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="36" y="48" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="48" y="48" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="60" y="48" width="6" height="6" rx="1.5" fill={fgColor} />
        <rect x="74" y="44" width="6" height="6" rx="1.5" fill={fgColor} />

        {/* Bottom Data Modules */}
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

      {label && size >= 80 && (
        <span className="text-[6px] font-mono font-bold tracking-widest uppercase text-neutral-500 mt-1">
          {label}
        </span>
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
  customTicketId,
}: TicketVisualShowcaseProps) {
  const isCard = mode === "card";
  const id = template.id;

  // Defaults per template
  const attendeeName =
    customAttendeeName ||
    (id === "college-fest-badge"
      ? "ANANYA RAMESH"
      : id === "tech-conf-badge"
      ? "DR. ROHAN MEHTA"
      : id === "hackathon-terminal"
      ? "KARTIK SHARMA"
      : id === "vip-all-access"
      ? "VIKRAMADITYA RAO"
      : id === "corporate-summit-gala"
      ? "PRIYA VENKATESH"
      : "ARJUN KUMAR");

  const eventName =
    customEventName ||
    (id === "minimal-monochrome"
      ? "SWISS DESIGN SUMMIT"
      : id === "concert-music-fest"
      ? "NEON HORIZON FESTIVAL"
      : id === "corporate-summit-gala"
      ? "GLOBAL LEADERSHIP GALA"
      : id === "college-fest-badge"
      ? "DHVANI ANNUAL FEST"
      : id === "tech-conf-badge"
      ? "DEVCON BENGALURU"
      : id === "hackathon-terminal"
      ? "CYBERHACK 2026"
      : id === "vip-all-access"
      ? "ROYAL OBSIDIAN GALA"
      : id === "workshop-masterclass"
      ? "SYSTEM SCALE MASTERCLASS"
      : id === "sports-arena-ticket"
      ? "CHAMPIONS ARENA CUP"
      : id === "exhibition-trade-expo"
      ? "GLOBAL TECH EXPO"
      : id === "community-meetup"
      ? "BUILDERS & FOUNDERS"
      : "OBSIDIAN PRIVATE SALON");

  const ticketId = customTicketId || "#URP-90284";
  const eventDate = customDate || "24 OCT 2026 · 10:00 AM";
  const venueName = customVenue || "The Residency, Bangalore";

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 1: MINIMAL MONOCHROME (Digital Pass)
  // ══════════════════════════════════════════════════════════════════
  if (id === "minimal-monochrome") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-300 select-none flex flex-col justify-between bg-white text-neutral-900 border border-neutral-300 shadow-md ${
          isCard
            ? "w-[205px] h-[270px] rounded-2xl p-3 text-xs"
            : "w-[290px] sm:max-w-[310px] min-h-[480px] rounded-3xl p-5 text-sm shadow-2xl"
        }`}
      >
        {/* Subtle Crosshair Registration Marks */}
        <div className="absolute top-2 left-2 text-[7px] font-mono text-neutral-400 select-none">+</div>
        <div className="absolute top-2 right-2 text-[7px] font-mono text-neutral-400 select-none">+</div>
        <div className="absolute bottom-2 left-2 text-[7px] font-mono text-neutral-400 select-none">+</div>
        <div className="absolute bottom-2 right-2 text-[7px] font-mono text-neutral-400 select-none">+</div>

        {/* Header */}
        <div className="pt-1 flex items-center justify-between border-b border-neutral-200 pb-1.5">
          <span className="text-[7.5px] font-mono font-extrabold tracking-widest text-neutral-900 uppercase">
            SWISS EDITION // 01
          </span>
          <span className="text-[7px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-700 font-bold">
            {ticketId}
          </span>
        </div>

        {/* Title */}
        <div className="my-1 space-y-0.5">
          <h4 className={`font-black tracking-tight leading-tight uppercase text-neutral-950 ${isCard ? "text-[12px] line-clamp-1" : "text-base line-clamp-1"}`}>
            {eventName}
          </h4>
          <p className="text-[7.5px] font-mono text-neutral-500 truncate">{eventDate} · {venueName}</p>
        </div>

        {/* QR Center */}
        <div className="my-1 flex justify-center">
          <RealisticQrCode
            size={isCard ? 92 : 140}
            fgColor="#000000"
            bgColor="#FFFFFF"
            label="VERIFY SCAN"
            bracketColor="#000000"
          />
        </div>

        {/* Attendee Holder */}
        <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <span className="text-[6.5px] uppercase font-mono font-semibold text-neutral-400 block">ADMIT TO DELEGATE</span>
            <span className={`font-black uppercase truncate block text-neutral-900 ${isCard ? "text-[10px]" : "text-[12px]"}`}>
              {attendeeName}
            </span>
          </div>
          <span className="text-[7px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 text-white uppercase shrink-0">
            OFFICIAL
          </span>
        </div>

        {/* Barcode Footer */}
        <div className="pt-1.5 border-t border-neutral-200 flex items-center justify-between">
          <RealisticBarcode code="SWISS-092-2026" color="#000000" height={isCard ? 10 : 16} />
          <span className="text-[6.5px] font-mono font-bold text-neutral-400">ENTRY GATE A</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 2: CONCERT & MUSIC FEST (Printable Stub with Perforation)
  // ══════════════════════════════════════════════════════════════════
  if (id === "concert-music-fest") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-300 select-none flex flex-row bg-gradient-to-br from-[#0D0B18] via-[#1A0B2E] to-[#12072B] text-white border border-rose-500/40 shadow-xl ${
          isCard
            ? "w-[250px] h-[140px] rounded-xl text-xs my-auto"
            : "w-[370px] sm:max-w-[400px] h-[190px] rounded-2xl shadow-2xl text-sm"
        }`}
      >
        {/* Holographic Top Foil Shimmer Strip */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 via-amber-300 to-violet-500 opacity-90" />

        {/* Left Section: Main Festival Pass (72%) */}
        <div className="flex-1 p-2.5 sm:p-3 flex flex-col justify-between relative">
          <div className="flex items-center justify-between">
            <span className="text-[7.5px] font-black uppercase tracking-widest text-rose-400 flex items-center gap-1">
              <Music className="w-2.5 h-2.5" />
              LIVE ARENA PASS
            </span>
            {/* Equalizer soundwave */}
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-2 bg-rose-400 rounded-full animate-pulse" />
              <span className="w-0.5 h-3 bg-fuchsia-400 rounded-full" />
              <span className="w-0.5 h-1.5 bg-violet-400 rounded-full" />
              <span className="w-0.5 h-2.5 bg-rose-400 rounded-full" />
            </div>
          </div>

          <div className="my-0.5">
            <h4 className={`font-black uppercase tracking-tight leading-tight text-white ${isCard ? "text-[10.5px] line-clamp-1" : "text-sm line-clamp-1"}`}>
              {eventName}
            </h4>
            <p className="text-[7px] text-rose-200/80 font-mono truncate">{eventDate} · MAIN STAGE</p>
          </div>

          <div className="pt-1 border-t border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[6px] uppercase font-semibold text-neutral-400 block">PASS HOLDER</span>
              <span className="font-black uppercase text-[8.5px] text-white truncate block">{attendeeName}</span>
            </div>
            <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-rose-500 text-white uppercase tracking-wider shadow-sm">
              STAGE VIP
            </span>
          </div>
        </div>

        {/* Authentic Perforated Divider with Hole Punches */}
        <div className="relative flex flex-col items-center justify-between py-1 px-0 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F4F5F7] border border-neutral-400/80 -mt-1 shadow-inner" />
          <div className="w-[1px] flex-1 border-l border-dashed border-rose-400/40 my-0.5" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#F4F5F7] border border-neutral-400/80 -mb-1 shadow-inner" />
        </div>

        {/* Right Section: Tear-off Stub (28%) */}
        <div className="w-[78px] sm:w-[102px] p-2 bg-black/40 flex flex-col items-center justify-between text-center shrink-0 border-l border-white/5">
          <span className="text-[6.5px] font-black uppercase tracking-widest text-amber-300">
            ADMIT ONE
          </span>

          <RealisticQrCode
            size={isCard ? 48 : 66}
            fgColor="#000000"
            bgColor="#FFFFFF"
            bracketColor="#F43F5E"
          />

          <RealisticBarcode code={ticketId} color="#FFFFFF" height={isCard ? 10 : 14} />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 3: CORPORATE SUMMIT & GALA (Digital Pass)
  // ══════════════════════════════════════════════════════════════════
  if (id === "corporate-summit-gala") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-300 select-none flex flex-col justify-between bg-gradient-to-b from-[#0A0F1D] to-[#040711] text-white border border-sky-500/30 shadow-xl ${
          isCard
            ? "w-[205px] h-[270px] rounded-2xl p-3 text-xs"
            : "w-[290px] sm:max-w-[310px] min-h-[480px] rounded-3xl p-5 text-sm shadow-2xl"
        }`}
      >
        {/* Top Speaker / Dynamic Island */}
        <div className="flex justify-center -mt-1 mb-1 pointer-events-none">
          <div className="w-8 h-1 rounded-full bg-sky-950/60 border border-sky-500/20" />
        </div>

        {/* Corporate Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-sky-900/40">
          <div className="flex items-center gap-1 text-[7.5px] font-black uppercase tracking-widest text-sky-400">
            <Shield className="w-2.5 h-2.5 text-sky-400" />
            <span>EXECUTIVE PASSPORT</span>
          </div>
          <span className="text-[7px] font-mono text-sky-300/70">{ticketId}</span>
        </div>

        {/* Event Title */}
        <div className="my-1 space-y-0.5">
          <h4 className={`font-black tracking-tight leading-tight uppercase text-white ${isCard ? "text-[11px] line-clamp-1" : "text-base line-clamp-1"}`}>
            {eventName}
          </h4>
          <p className="text-[7.5px] text-slate-400 font-mono truncate">{eventDate} · {venueName}</p>
        </div>

        {/* QR Core */}
        <div className="my-1 flex justify-center">
          <RealisticQrCode
            size={isCard ? 90 : 135}
            fgColor="#0A0F1D"
            bgColor="#FFFFFF"
            label="OFFICIAL BADGE"
            bracketColor="#38BDF8"
          />
        </div>

        {/* Attendee Details Card */}
        <div className="p-2 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-between backdrop-blur-xs">
          <div className="min-w-0 pr-1">
            <span className="text-[6.5px] uppercase font-mono text-sky-400 block font-semibold">DELEGATE ACCREDITATION</span>
            <span className={`font-black uppercase truncate block text-white ${isCard ? "text-[10px]" : "text-[12px]"}`}>
              {attendeeName}
            </span>
          </div>
          <span className="text-[7px] font-bold px-2 py-0.5 rounded-md bg-sky-500 text-neutral-950 font-mono uppercase tracking-wider shrink-0">
            DELEGATE
          </span>
        </div>

        {/* Footer */}
        <div className="pt-1.5 border-t border-sky-900/40 flex items-center justify-between text-[7px] font-mono text-slate-400">
          <span>SECURE ID GATE</span>
          <span>PLENARY HALL A</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 4: COLLEGE FEST & CULTURALS (Lanyard Badge with Slot)
  // ══════════════════════════════════════════════════════════════════
  if (id === "college-fest-badge") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-300 select-none flex flex-col justify-between bg-gradient-to-b from-[#312E81] via-[#3730A3] to-[#1E1B4B] text-white border-2 border-indigo-400/50 shadow-xl ${
          isCard
            ? "w-[205px] h-[270px] rounded-2xl p-3 text-xs"
            : "w-[290px] sm:max-w-[310px] min-h-[480px] rounded-3xl p-5 text-sm shadow-2xl"
        }`}
      >
        {/* Top Metallic Lanyard Slot */}
        <div className="flex flex-col items-center justify-center -mt-1 mb-1 pointer-events-none">
          <div className="w-10 h-1.5 rounded-full bg-black/60 border border-yellow-400/50 shadow-inner" />
        </div>

        {/* University Crest Header */}
        <div className="text-center space-y-0.5 pb-1 border-b border-white/10">
          <span className="text-[7px] font-black uppercase tracking-widest text-yellow-300 flex items-center justify-center gap-1">
            <GraduationCap className="w-2.5 h-2.5" />
            UNIVERSITY CULTURALS 2026
          </span>
          <h4 className={`font-black tracking-tight leading-tight uppercase text-white ${isCard ? "text-[11.5px] line-clamp-1" : "text-base line-clamp-1"}`}>
            {eventName}
          </h4>
        </div>

        {/* Big Attendee Credential Card */}
        <div className="my-1.5 p-2 rounded-xl bg-white text-neutral-950 text-center shadow-md space-y-0.5">
          <span className="text-[6.5px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
            STUDENT DELEGATE
          </span>
          <h3 className={`font-black tracking-tight leading-none uppercase text-neutral-950 ${isCard ? "text-[11px]" : "text-base"}`}>
            {attendeeName}
          </h3>
          <span className="inline-block px-2 py-0.2 rounded-full bg-indigo-700 text-yellow-300 text-[6.5px] font-extrabold uppercase tracking-wider font-mono">
            COLLEGE ID: #STU-2026-94
          </span>
        </div>

        {/* QR & NFC Bottom Box */}
        <div className="flex items-center justify-between p-1.5 rounded-xl bg-black/30 border border-white/10">
          <RealisticQrCode
            size={isCard ? 50 : 75}
            fgColor="#000000"
            bgColor="#FFFFFF"
            bracketColor="#FACC15"
          />
          <div className="text-right space-y-0.5">
            <div className="flex items-center justify-end gap-1 text-[7px] font-black text-yellow-300">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              <span>NFC TAP READY</span>
            </div>
            <span className="font-mono text-[6.5px] block text-white/70">{ticketId}</span>
            <span className="text-[6px] font-bold px-1.5 py-0.2 rounded bg-yellow-400 text-neutral-950 inline-block uppercase">
              ALL-EVENTS ACCESS
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 5: TECH CONFERENCE & KEYNOTE (DevCon Badge)
  // ══════════════════════════════════════════════════════════════════
  if (id === "tech-conf-badge") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-300 select-none flex flex-col justify-between bg-gradient-to-b from-[#0F172A] to-[#020617] text-white border border-emerald-500/40 shadow-xl ${
          isCard
            ? "w-[205px] h-[270px] rounded-2xl p-3 text-xs"
            : "w-[290px] sm:max-w-[310px] min-h-[480px] rounded-3xl p-5 text-sm shadow-2xl"
        }`}
      >
        {/* Lanyard Slot */}
        <div className="flex flex-col items-center justify-center -mt-1 mb-1 pointer-events-none">
          <div className="w-10 h-1.5 rounded-full bg-black/60 border border-emerald-400/40 shadow-inner" />
        </div>

        {/* Code Header */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
          <span className="text-[7.5px] font-mono font-bold text-emerald-400 flex items-center gap-1">
            <Cpu className="w-2.5 h-2.5" />
            DEVCON_2026 // KEYNOTE
          </span>
          <span className="text-[6.5px] font-mono text-emerald-300/70">{ticketId}</span>
        </div>

        {/* Title */}
        <div className="my-1 space-y-0.5">
          <h4 className={`font-black tracking-tight leading-tight uppercase text-white ${isCard ? "text-[11px] line-clamp-1" : "text-base line-clamp-1"}`}>
            {eventName}
          </h4>
          <p className="text-[7px] text-slate-400 font-mono truncate">{eventDate} · MAIN AUDITORIUM</p>
        </div>

        {/* Name Badge */}
        <div className="my-1 p-2 rounded-xl bg-slate-900 border border-emerald-500/30 text-center">
          <span className="text-[6px] font-mono text-emerald-400 block uppercase font-bold">// CONFIRMED SPEAKER</span>
          <h3 className={`font-black tracking-tight leading-none uppercase text-white ${isCard ? "text-[11.5px]" : "text-base"}`}>
            {attendeeName}
          </h3>
          <span className="text-[6.5px] font-mono text-slate-400 block mt-0.5">KEYNOTE · TRACK ARCHITECTURE</span>
        </div>

        {/* Bottom QR & NFC Scan */}
        <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-950/80 border border-emerald-500/20">
          <RealisticQrCode
            size={isCard ? 48 : 72}
            fgColor="#020617"
            bgColor="#FFFFFF"
            bracketColor="#10B981"
          />
          <div className="text-right space-y-0.5">
            <div className="flex items-center justify-end gap-1 text-[7px] font-bold text-emerald-400">
              <Wifi className="w-2.5 h-2.5" />
              <span>RFID VERIFIED</span>
            </div>
            <span className="text-[6px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block">
              BACKSTAGE PASS
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 6: HACKATHON TERMINAL (Cyberhack)
  // ══════════════════════════════════════════════════════════════════
  if (id === "hackathon-terminal") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-300 select-none flex flex-col justify-between bg-[#050505] text-[#22C55E] border-2 border-emerald-500/60 font-mono shadow-2xl ${
          isCard
            ? "w-[205px] h-[270px] rounded-2xl p-3 text-xs"
            : "w-[290px] sm:max-w-[310px] min-h-[480px] rounded-3xl p-5 text-sm shadow-2xl"
        }`}
      >
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between pb-1 border-b border-emerald-500/30">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[7.5px] font-bold text-emerald-400 ml-1">TERMINAL_PASS_V2</span>
          </div>
          <span className="text-[6.5px] text-emerald-300/80 font-bold">{ticketId}</span>
        </div>

        {/* Hackathon Title */}
        <div className="my-1">
          <span className="text-[6.5px] text-emerald-400/80 block">&gt; EXECUTING_CHALLENGE:</span>
          <h4 className={`font-black uppercase tracking-tight leading-tight text-white ${isCard ? "text-[11px] line-clamp-1" : "text-base line-clamp-1"}`}>
            {eventName}
          </h4>
          <span className="text-[6.5px] text-emerald-500/80 block">36-HR SPRINT · 50K PRIZE POOL</span>
        </div>

        {/* QR Frame with Terminal Styling */}
        <div className="my-1 flex justify-center">
          <RealisticQrCode
            size={isCard ? 88 : 135}
            fgColor="#050505"
            bgColor="#22C55E"
            label="[AUTH_KEY_READY]"
            bracketColor="#22C55E"
          />
        </div>

        {/* Attendee Terminal Box */}
        <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-0.5">
          <div className="flex justify-between text-[6.5px]">
            <span className="text-emerald-400">BUILDER:</span>
            <span className="text-white font-bold">[ROOT_ACCESS]</span>
          </div>
          <p className={`font-black uppercase text-white truncate ${isCard ? "text-[10px]" : "text-sm"}`}>
            {attendeeName}
          </p>
          <div className="flex justify-between text-[6px] text-emerald-400/80 border-t border-emerald-500/20 pt-0.5">
            <span>TRACK: WEB3 / AI</span>
            <span>COMMIT: #E49A2F</span>
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="pt-1 border-t border-emerald-500/30 flex justify-between text-[6.5px] text-emerald-500">
          <span>&gt; SPRINT_ACTIVE</span>
          <span>GATE_SCAN: 0.28S</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 7: VIP ALL-ACCESS PASS (Black & Gold Metal Card)
  // ══════════════════════════════════════════════════════════════════
  if (id === "vip-all-access") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-300 select-none flex flex-col justify-between bg-gradient-to-b from-[#18181B] via-[#09090B] to-[#000000] text-white border-2 border-amber-500/50 shadow-2xl ${
          isCard
            ? "w-[205px] h-[270px] rounded-2xl p-3 text-xs"
            : "w-[290px] sm:max-w-[310px] min-h-[480px] rounded-3xl p-5 text-sm shadow-2xl"
        }`}
      >
        {/* Lanyard Top Slot with Golden Bezel */}
        <div className="flex flex-col items-center justify-center -mt-1 mb-1 pointer-events-none">
          <div className="w-10 h-1.5 rounded-full bg-black border border-amber-400 shadow-inner" />
        </div>

        {/* Crown & VIP Header */}
        <div className="text-center pb-1 border-b border-amber-500/30">
          <div className="inline-flex items-center justify-center gap-1 text-[7.5px] font-black text-amber-400 uppercase tracking-widest">
            <Crown className="w-2.5 h-2.5 text-amber-400" />
            <span>VIP ALL-ACCESS CARD</span>
          </div>
          <h4 className={`font-black uppercase tracking-tight text-white mt-0.5 ${isCard ? "text-[11.5px] line-clamp-1" : "text-base line-clamp-1"}`}>
            {eventName}
          </h4>
        </div>

        {/* Attendee Gold-Bordered Insert */}
        <div className="my-1.5 p-2 rounded-xl bg-black border border-amber-400/60 text-center shadow-lg space-y-0.5">
          <span className="text-[6.5px] font-mono uppercase tracking-widest text-amber-400 block font-bold">
            HONORED GUEST
          </span>
          <h3 className={`font-black tracking-tight leading-none uppercase text-white ${isCard ? "text-[11px]" : "text-base"}`}>
            {attendeeName}
          </h3>
          <span className="text-[6.5px] font-mono text-amber-200/80 block">ALL ACCESS · ARTIST LOUNGE</span>
        </div>

        {/* Gold Accent QR & NFC */}
        <div className="flex items-center justify-between p-1.5 rounded-xl bg-amber-950/30 border border-amber-400/40">
          <RealisticQrCode
            size={isCard ? 48 : 72}
            fgColor="#000000"
            bgColor="#F59E0B"
            bracketColor="#FFFFFF"
          />
          <div className="text-right space-y-0.5">
            <span className="text-[7.5px] font-black uppercase text-amber-300 block">BLACK CARD ACCESS</span>
            <span className="font-mono text-[6.5px] text-amber-100/70 block">{ticketId}</span>
            <span className="text-[6px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-neutral-950 inline-block uppercase">
              NO ENTRY QUEUE
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 8: WORKSHOP & MASTERCLASS (Printable Certificate Stub)
  // ══════════════════════════════════════════════════════════════════
  if (id === "workshop-masterclass") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-300 select-none flex flex-row bg-gradient-to-r from-[#0F766E] to-[#115E59] text-white border border-teal-300/40 shadow-xl ${
          isCard
            ? "w-[250px] h-[140px] rounded-xl text-xs my-auto"
            : "w-[370px] sm:max-w-[400px] h-[190px] rounded-2xl shadow-2xl text-sm"
        }`}
      >
        {/* Left Section (72%) */}
        <div className="flex-1 p-2.5 sm:p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[7.5px] font-black uppercase tracking-wider text-teal-200 flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" />
              CERTIFIED MASTERCLASS
            </span>
            <span className="text-[7px] font-mono text-teal-200/80">MODULE 01-04</span>
          </div>

          <div className="my-0.5">
            <h4 className={`font-black uppercase tracking-tight leading-tight text-white ${isCard ? "text-[10px] line-clamp-1" : "text-sm line-clamp-1"}`}>
              {eventName}
            </h4>
            <p className="text-[7px] text-teal-100/80 truncate font-mono">{eventDate}</p>
          </div>

          <div className="pt-1 border-t border-teal-400/30 flex items-center justify-between">
            <div>
              <span className="text-[6px] uppercase text-teal-200/80 font-bold block">PARTICIPANT</span>
              <span className="font-black uppercase text-[8.5px] text-white truncate block">{attendeeName}</span>
            </div>
            <span className="text-[7px] font-bold px-1.5 py-0.5 rounded bg-teal-900 text-teal-100 uppercase tracking-wider border border-teal-400/40">
              SEAT RESERVED
            </span>
          </div>
        </div>

        {/* Perforation */}
        <div className="relative flex flex-col items-center justify-between py-1 px-0 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F4F5F7] border border-teal-800 -mt-1 shadow-inner" />
          <div className="w-[1px] flex-1 border-l border-dashed border-teal-300/40 my-0.5" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#F4F5F7] border border-teal-800 -mb-1 shadow-inner" />
        </div>

        {/* Right Section (28%) */}
        <div className="w-[78px] sm:w-[102px] p-2 bg-black/25 flex flex-col items-center justify-between text-center shrink-0">
          <span className="text-[6.5px] font-black uppercase tracking-widest text-teal-200">
            ENTRY STUB
          </span>
          <RealisticQrCode
            size={isCard ? 48 : 66}
            fgColor="#000000"
            bgColor="#FFFFFF"
            bracketColor="#2DD4BF"
          />
          <RealisticBarcode code={ticketId} color="#FFFFFF" height={isCard ? 10 : 14} />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 9: SPORTS & ARENA TICKET (Varsity Stadium Stub)
  // ══════════════════════════════════════════════════════════════════
  if (id === "sports-arena-ticket") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-300 select-none flex flex-row bg-gradient-to-r from-[#1E1B4B] to-[#312E81] text-white border-2 border-orange-500/50 shadow-xl ${
          isCard
            ? "w-[250px] h-[140px] rounded-xl text-xs my-auto"
            : "w-[370px] sm:max-w-[400px] h-[190px] rounded-2xl shadow-2xl text-sm"
        }`}
      >
        {/* Left Section */}
        <div className="flex-1 p-2.5 sm:p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[7.5px] font-black uppercase tracking-wider text-orange-400 flex items-center gap-1">
              <Trophy className="w-2.5 h-2.5 text-orange-400" />
              CHAMPIONSHIP ARENA PASS
            </span>
            <span className="text-[7px] font-mono text-orange-200 font-bold">GATE 04</span>
          </div>

          <div className="my-0.5">
            <h4 className={`font-black uppercase tracking-tight leading-tight text-white ${isCard ? "text-[10px] line-clamp-1" : "text-sm line-clamp-1"}`}>
              {eventName}
            </h4>
            <div className="flex gap-2 text-[7px] font-mono text-orange-200/90 font-bold mt-0.5">
              <span>SEC: 108</span>
              <span>ROW: A</span>
              <span>SEAT: 14</span>
            </div>
          </div>

          <div className="pt-1 border-t border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[6px] uppercase text-neutral-400 font-bold block">TICKET HOLDER</span>
              <span className="font-black uppercase text-[8.5px] text-white truncate block">{attendeeName}</span>
            </div>
            <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-orange-500 text-white uppercase tracking-wider">
              COURTSIDE
            </span>
          </div>
        </div>

        {/* Perforated Divider */}
        <div className="relative flex flex-col items-center justify-between py-1 px-0 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F4F5F7] border border-indigo-900 -mt-1 shadow-inner" />
          <div className="w-[1px] flex-1 border-l border-dashed border-orange-400/40 my-0.5" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#F4F5F7] border border-indigo-900 -mb-1 shadow-inner" />
        </div>

        {/* Right Section */}
        <div className="w-[78px] sm:w-[102px] p-2 bg-black/35 flex flex-col items-center justify-between text-center shrink-0">
          <span className="text-[6.5px] font-black uppercase tracking-widest text-orange-400">
            ADMIT ONE
          </span>
          <RealisticQrCode
            size={isCard ? 48 : 66}
            fgColor="#000000"
            bgColor="#FFFFFF"
            bracketColor="#FB923C"
          />
          <RealisticBarcode code={ticketId} color="#FFFFFF" height={isCard ? 10 : 14} />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 10: EXHIBITION & TRADE EXPO (Lanyard Credential)
  // ══════════════════════════════════════════════════════════════════
  if (id === "exhibition-trade-expo") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-300 select-none flex flex-col justify-between bg-gradient-to-b from-[#1E293B] to-[#0F172A] text-white border-2 border-blue-500/40 shadow-xl ${
          isCard
            ? "w-[205px] h-[270px] rounded-2xl p-3 text-xs"
            : "w-[290px] sm:max-w-[310px] min-h-[480px] rounded-3xl p-5 text-sm shadow-2xl"
        }`}
      >
        {/* Lanyard Top Slot */}
        <div className="flex flex-col items-center justify-center -mt-1 mb-1 pointer-events-none">
          <div className="w-10 h-1.5 rounded-full bg-black/60 border border-blue-400/50 shadow-inner" />
        </div>

        {/* Expo Header */}
        <div className="text-center pb-1 border-b border-slate-700">
          <span className="text-[7px] font-black uppercase tracking-widest text-blue-400 block font-mono">
            INTERNATIONAL TRADE EXPO
          </span>
          <h4 className={`font-black uppercase tracking-tight text-white mt-0.5 ${isCard ? "text-[11.5px] line-clamp-1" : "text-base line-clamp-1"}`}>
            {eventName}
          </h4>
        </div>

        {/* High-Visibility Attendee Card */}
        <div className="my-1.5 p-2 rounded-xl bg-white text-neutral-950 text-center shadow-md space-y-0.5">
          <span className="text-[6.5px] font-mono uppercase tracking-wider text-blue-600 block font-bold">
            ACCREDITED BUYER
          </span>
          <h3 className={`font-black tracking-tight leading-none uppercase text-neutral-950 ${isCard ? "text-[12px]" : "text-lg"}`}>
            {attendeeName}
          </h3>
          <span className="text-[7px] font-bold text-neutral-500 block uppercase">
            VERTEX VENTURES INDIA
          </span>
        </div>

        {/* QR & Halls */}
        <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-900 border border-blue-500/30">
          <RealisticQrCode
            size={isCard ? 48 : 72}
            fgColor="#000000"
            bgColor="#FFFFFF"
            bracketColor="#3B82F6"
          />
          <div className="text-right space-y-0.5">
            <span className="text-[7px] font-bold text-blue-400 block uppercase">HALLS 1 TO 6 ACCESS</span>
            <span className="font-mono text-[6.5px] text-slate-300 block">{ticketId}</span>
            <span className="text-[6px] font-bold px-1.5 py-0.2 rounded bg-blue-600 text-white inline-block uppercase">
              B2B BADGE
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 11: COMMUNITY MEETUP (Founders & Builders)
  // ══════════════════════════════════════════════════════════════════
  if (id === "community-meetup") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-300 select-none flex flex-col justify-between bg-gradient-to-b from-[#4C1D95] via-[#5B21B6] to-[#2E1065] text-white border border-purple-400/40 shadow-xl ${
          isCard
            ? "w-[205px] h-[270px] rounded-2xl p-3 text-xs"
            : "w-[290px] sm:max-w-[310px] min-h-[480px] rounded-3xl p-5 text-sm shadow-2xl"
        }`}
      >
        {/* Dynamic Notch */}
        <div className="flex justify-center -mt-1 mb-1 pointer-events-none">
          <div className="w-8 h-1 rounded-full bg-purple-950/80 border border-purple-300/30" />
        </div>

        {/* Community Header */}
        <div className="flex items-center justify-between pb-1 border-b border-purple-400/20">
          <span className="text-[7.5px] font-black uppercase tracking-widest text-purple-300 flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-amber-300" />
            FOUNDERS &amp; BUILDERS
          </span>
          <span className="text-[6.5px] font-mono text-purple-200/80 font-bold">{ticketId}</span>
        </div>

        {/* Title */}
        <div className="my-1 space-y-0.5">
          <h4 className={`font-black tracking-tight leading-tight uppercase text-white ${isCard ? "text-[11px] line-clamp-1" : "text-base line-clamp-1"}`}>
            {eventName}
          </h4>
          <p className="text-[7px] text-purple-200/70 font-mono truncate">{eventDate} · KORAMANGALA</p>
        </div>

        {/* QR Center */}
        <div className="my-1 flex justify-center">
          <RealisticQrCode
            size={isCard ? 90 : 135}
            fgColor="#2E1065"
            bgColor="#FFFFFF"
            label="CHECK-IN & DRINK PASS"
            bracketColor="#A855F7"
          />
        </div>

        {/* Attendee Row */}
        <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-400/30 flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <span className="text-[6.5px] uppercase font-mono text-purple-300 block font-semibold">BUILDER BADGE</span>
            <span className={`font-black uppercase truncate block text-white ${isCard ? "text-[10px]" : "text-sm"}`}>
              {attendeeName}
            </span>
          </div>
          <span className="text-[7px] font-bold px-2 py-0.5 rounded-md bg-purple-400 text-purple-950 uppercase font-mono tracking-wider shrink-0">
            FOUNDER
          </span>
        </div>

        {/* Footer with Drink Token */}
        <div className="pt-1.5 border-t border-purple-400/20 flex items-center justify-between text-[7px] font-mono text-purple-200/80">
          <span>COFFEE &amp; PIZZA TOKEN: 1</span>
          <span>NETWORKING GATE</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TEMPLATE 12: DARK OBSIDIAN LUXURY (Gala & Private Salon)
  // ══════════════════════════════════════════════════════════════════
  return (
    <div
      className={`relative overflow-hidden transition-all duration-300 select-none flex flex-col justify-between bg-black text-white border-2 border-amber-500/60 shadow-2xl ${
        isCard
          ? "w-[205px] h-[270px] rounded-2xl p-3 text-xs"
          : "w-[290px] sm:max-w-[310px] min-h-[480px] rounded-3xl p-5 text-sm shadow-2xl"
      }`}
    >
      {/* Top Gold Geometric Line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

      {/* Header */}
      <div className="pt-1 flex items-center justify-between pb-1.5 border-b border-neutral-800">
        <span className="text-[7.5px] font-mono font-black uppercase tracking-widest text-amber-400">
          PRIVATE SALON · MMXXVI
        </span>
        <span className="text-[7px] font-mono text-neutral-400">{ticketId}</span>
      </div>

      {/* Title */}
      <div className="my-1 text-center space-y-0.5">
        <h4 className={`font-black tracking-widest leading-tight uppercase text-white ${isCard ? "text-[11.5px] line-clamp-1" : "text-base line-clamp-1"}`}>
          {eventName}
        </h4>
        <p className="text-[7px] font-mono text-amber-200/60 tracking-wider uppercase truncate">{venueName}</p>
      </div>

      {/* Luxury QR Center */}
      <div className="my-1 flex justify-center">
        <RealisticQrCode
          size={isCard ? 92 : 140}
          fgColor="#000000"
          bgColor="#F59E0B"
          label="PATRON VALIDATION"
          bracketColor="#FBBF24"
        />
      </div>

      {/* Patron Card */}
      <div className="p-2 rounded-xl bg-neutral-900 border border-amber-500/40 flex items-center justify-between">
        <div className="min-w-0 pr-1">
          <span className="text-[6.5px] uppercase font-mono text-amber-400 block font-semibold">PATRON RECOGNITION</span>
          <span className={`font-black uppercase truncate block text-white ${isCard ? "text-[10px]" : "text-sm"}`}>
            {attendeeName}
          </span>
        </div>
        <span className="text-[7px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500 text-black uppercase tracking-wider shrink-0">
          PATRON
        </span>
      </div>

      {/* Footer */}
      <div className="pt-1.5 border-t border-neutral-800 flex items-center justify-between text-[7px] font-mono text-neutral-500">
        <span>STRICT RSVP ONLY</span>
        <span>BLACK TIE REQUIRED</span>
      </div>
    </div>
  );
}
