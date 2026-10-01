"use client";

import React from "react";
import type { StudioTemplateDefinition } from "@/lib/studio/templates";
import {
  Building2,
  Calendar,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Award,
  Zap,
  Radio,
  Flame,
  UserCheck,
  Trophy,
} from "lucide-react";

interface TicketVisualShowcaseProps {
  template: StudioTemplateDefinition;
  mode?: "card" | "showcase";
  format?: "mobile" | "badge" | "print";
  customAttendeeName?: string;
  customEventName?: string;
  customHostOrg?: string;
  customVenue?: string;
  customDate?: string;
  customTicketId?: string;
}

function wrapFormat(
  card: React.ReactNode,
  format: "mobile" | "badge" | "print" = "mobile",
  isCard: boolean = false
) {
  if (format === "badge") {
    return (
      <div className="flex flex-col items-center select-none animate-in fade-in duration-150">
        <RealisticLanyardClip isSmall={isCard} strapColor="#0F172A" accentLabel="CREDENTIAL" />
        <div className="relative rounded-2xl p-1 bg-white/70 border border-neutral-300 shadow-md">
          {card}
        </div>
      </div>
    );
  }
  if (format === "print") {
    return (
      <div className="flex flex-col items-center select-none animate-in fade-in duration-150">
        <div className="relative bg-white border border-neutral-300 shadow-md rounded-xl overflow-hidden">
          {card}
          <div className="relative flex items-center justify-between border-t-2 border-dashed border-neutral-300 bg-neutral-50 px-3 py-1.5">
            <div className="absolute -left-1.5 top-[-6px] w-2.5 h-2.5 rounded-full bg-[#F5F6F7] border-r border-neutral-300" />
            <div className="absolute -right-1.5 top-[-6px] w-2.5 h-2.5 rounded-full bg-[#F5F6F7] border-l border-neutral-300" />
            <span className="text-[7px] font-mono uppercase tracking-widest text-neutral-400">
              TEAR-OFF ADMISSION STUB
            </span>
            <span className="text-[7px] font-mono font-bold text-neutral-600">#URP-STUB</span>
          </div>
        </div>
      </div>
    );
  }
  return <div className="animate-in fade-in duration-150">{card}</div>;
}

/**
 * Enterprise Vector QR Code with Precision Reticles
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
  const innerSize = Math.max(size - 12, 32);

  return (
    <div
      className="p-1 rounded-lg flex flex-col items-center justify-center select-none shadow-xs border relative"
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
        <rect x="11" y="11" width="14" height="14" rx="1" fill={bgColor} />
        <rect x="14" y="14" width="8" height="8" rx="0.5" fill={fgColor} />

        {/* Top-Right Finder */}
        <rect x="70" y="6" width="24" height="24" rx="2" fill={fgColor} />
        <rect x="75" y="11" width="14" height="14" rx="1" fill={bgColor} />
        <rect x="78" y="14" width="8" height="8" rx="0.5" fill={fgColor} />

        {/* Bottom-Left Finder */}
        <rect x="6" y="70" width="24" height="24" rx="2" fill={fgColor} />
        <rect x="11" y="75" width="14" height="14" rx="1" fill={bgColor} />
        <rect x="14" y="78" width="8" height="8" rx="0.5" fill={fgColor} />

        {/* Dense Micro Data Grid */}
        <rect x="36" y="10" width="5" height="5" fill={fgColor} />
        <rect x="46" y="10" width="5" height="5" fill={fgColor} />
        <rect x="56" y="10" width="5" height="5" fill={fgColor} />
        <rect x="36" y="18" width="5" height="5" fill={fgColor} />
        <rect x="48" y="18" width="5" height="5" fill={fgColor} />
        <rect x="58" y="18" width="5" height="5" fill={fgColor} />

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

/**
 * Realistic Executive Lanyard Assembly Component
 */
export function RealisticLanyardClip({
  strapColor = "#1E293B",
  clipColor = "silver",
  accentLabel,
  isSmall = true,
}: {
  strapColor?: string;
  clipColor?: "silver" | "gold" | "black";
  accentLabel?: string;
  isSmall?: boolean;
}) {
  const isGold = clipColor === "gold";
  const isBlack = clipColor === "black";

  return (
    <div className={`relative flex flex-col items-center justify-center select-none z-20 pointer-events-none ${isSmall ? "-mt-2 mb-1.5" : "-mt-3 mb-2"}`}>
      {/* Woven Lanyard Ribbon with Ribbed Texture */}
      <div
        className={`${isSmall ? "w-11 h-3.5" : "w-16 h-5"} rounded-t-sm border-x border-t border-black/30 shadow-xs flex items-center justify-center relative overflow-hidden shrink-0`}
        style={{ backgroundColor: strapColor }}
      >
        <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#fff_2px,#fff_4px)]" />
        {accentLabel && (
          <span className="text-[5.5px] font-mono font-bold tracking-widest text-white/95 uppercase truncate z-10">
            {accentLabel}
          </span>
        )}
      </div>

      {/* Metallic Swivel Hook & Ring Assembly */}
      <div className="flex flex-col items-center -mt-0.5">
        {/* Swivel metal cylinder */}
        <div
          className={`${isSmall ? "w-3.5 h-1.5" : "w-4.5 h-2"} rounded-xs border shadow-2xs ${
            isGold
              ? "bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 border-amber-600"
              : isBlack
              ? "bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-900 border-neutral-950"
              : "bg-gradient-to-r from-neutral-400 via-neutral-200 to-neutral-500 border-neutral-600"
          }`}
        />
        {/* Metal ring loop clasp */}
        <div
          className={`${isSmall ? "w-4.5 h-2" : "w-6 h-2.5"} rounded-full border-[1.5px] bg-transparent -mt-0.5 ${
            isGold ? "border-amber-400" : isBlack ? "border-neutral-700" : "border-neutral-400"
          }`}
        />
      </div>

      {/* Clear Vinyl Badge Slot Hole Header */}
      <div className={`${isSmall ? "w-14 h-2.5" : "w-20 h-3.5"} rounded-full bg-neutral-900/10 dark:bg-white/10 border border-neutral-300 dark:border-neutral-700 shadow-inner flex items-center justify-center -mt-1`}>
        <div className={`${isSmall ? "w-10 h-1" : "w-14 h-1.5"} rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700`} />
      </div>
    </div>
  );
}

export default function TicketVisualShowcase({
  template,
  mode = "card",
  format = "mobile",
  customAttendeeName,
  customEventName,
  customHostOrg,
  customVenue,
  customDate,
  customTicketId,
}: TicketVisualShowcaseProps) {
  const isCard = mode === "card";
  const id = template.id;

  const attendeeName = customAttendeeName || "Aarav Mehta";
  const eventName = customEventName || (
    id === "corporate-minimal" ? "Annual Business Summit" :
    id === "executive-blue" ? "World Leadership Congress" :
    id === "minimal-monochrome" ? "Global Architecture Forum" :
    id === "networking-pro" ? "Founders & Leaders Mixer" :
    id === "tech-pulse" ? "Tech Pulse Summit 2026" :
    id === "future-grid" ? "Synapse AI Developer Congress" :
    id === "product-launch" ? "Next-Gen Keynote '26" :
    id === "ultra-qr" ? "URPASS Summit" :
    id === "campus-pop" ? "National Campus Fest '26" :
    id === "campus-classic" ? "Annual Academic Symposium" :
    id === "workshop-clean" ? "Executive AI Masterclass" :
    id === "speaker-badge" ? "URPASS Summit 2026" :
    id === "festival-neon" ? "Neon Sounds Festival" :
    id === "urban-festival" ? "Urban Arts Festival '26" :
    id === "sports-arena" ? "National Championship Cup" :
    id === "marathon-pass" ? "Metro City Marathon 2026" :
    id === "vip-midnight" ? "Private Evening Gala" :
    id === "premium-ivory" ? "The Annual Gala Dinner" :
    id === "elegant-rsvp" ? "Private Reception & Dinner" :
    "Global Industry Expo"
  );

  const ticketId = customTicketId || "#URP-02891";
  const eventDate = customDate || "12 OCT 2026 · 10:00 AM";
  const venueName = customVenue || "Bengaluru";

  const cardDims = isCard
    ? "w-[205px] h-[260px] rounded-xl p-3 text-xs"
    : "w-[300px] sm:w-[325px] min-h-[480px] rounded-2xl p-5 text-sm shadow-xl";

  function renderInner() {
    // ══════════════════════════════════════════════════════════════════
    // 1. CORPORATE MINIMAL (White, charcoal, thin borders)
    // ══════════════════════════════════════════════════════════════════
    if (id === "corporate-minimal") {
    return (
      <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-white text-neutral-900 border border-neutral-200 shadow-sm ${cardDims}`}>
        <div className="flex items-center justify-between pb-1.5 border-b border-neutral-150">
          <span className="text-[7px] font-mono font-bold tracking-widest uppercase text-neutral-400">EVENT LOGO</span>
          <span className="text-[7px] font-mono text-neutral-400">{ticketId}</span>
        </div>
        <div className="my-1">
          <h4 className="font-bold tracking-tight text-neutral-900 text-xs line-clamp-1">{eventName}</h4>
          <p className="text-[8px] font-semibold text-neutral-800 mt-0.5">{attendeeName}</p>
          <p className="text-[7px] text-neutral-500 font-normal">Senior Manager · Acme Ltd.</p>
          <p className="text-[6.5px] font-mono text-neutral-400 mt-0.5">{eventDate} · {venueName}</p>
        </div>
        <div className="my-1 flex justify-center">
          <CorporateQrCode size={isCard ? 92 : 135} fgColor="#18181B" borderColor="#E4E4E7" />
        </div>
        <div className="pt-1.5 border-t border-neutral-150 flex items-center justify-between">
          <span className="text-[7px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 text-white uppercase">
            VIP DELEGATE
          </span>
          <span className="text-[6.5px] font-mono text-neutral-400 uppercase">ACCESS ALL HALLS</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 2. EXECUTIVE BLUE (Navy + blue accent, board look)
  // ══════════════════════════════════════════════════════════════════
  if (id === "executive-blue") {
    return (
      <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-[#0F1E36] text-white border border-slate-700 shadow-sm ${cardDims}`}>
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-700">
          <span className="text-[7px] font-mono font-semibold tracking-widest text-sky-400 uppercase">EXECUTIVE FORUM</span>
          <span className="text-[7px] font-mono text-slate-400">{ticketId}</span>
        </div>
        <div className="my-1">
          <h4 className="font-bold tracking-tight text-white text-xs line-clamp-1">{eventName}</h4>
          <p className="text-[8.5px] font-semibold text-slate-100 mt-0.5">{attendeeName}</p>
          <p className="text-[7px] text-slate-400 font-normal">Managing Director · Acme Group</p>
          <p className="text-[6.5px] font-mono text-slate-400 mt-0.5">{eventDate} · {venueName}</p>
        </div>
        <div className="my-1 flex justify-center">
          <CorporateQrCode size={isCard ? 92 : 135} fgColor="#0F1E36" bgColor="#FFFFFF" borderColor="#38BDF8" />
        </div>
        <div className="pt-1.5 border-t border-slate-700 flex items-center justify-between">
          <span className="text-[7px] font-mono font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-600/40 uppercase">
            BOARD DELEGATE
          </span>
          <span className="text-[6.5px] font-mono text-slate-400">CLEARANCE // A1</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 3. MINIMAL MONOCHROME (Black & white, high contrast)
  // ══════════════════════════════════════════════════════════════════
  if (id === "minimal-monochrome") {
    return (
      <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-white text-black border border-black shadow-sm ${cardDims}`}>
        <div className="flex items-center justify-between pb-1.5 border-b border-black">
          <span className="text-[7px] font-mono font-bold uppercase tracking-widest">OFFICIAL DELEGATE</span>
          <span className="text-[7px] font-mono font-semibold">{ticketId}</span>
        </div>
        <div className="my-1">
          <h4 className="font-black tracking-tight text-black uppercase text-xs line-clamp-1">{eventName}</h4>
          <p className="text-[9px] font-bold uppercase text-black mt-0.5">{attendeeName}</p>
          <p className="text-[6.5px] font-mono text-neutral-600 truncate">{eventDate} · {venueName}</p>
        </div>
        <div className="my-1 flex justify-center">
          <CorporateQrCode size={isCard ? 92 : 135} fgColor="#000000" borderColor="#000000" />
        </div>
        <div className="pt-1.5 border-t border-black flex items-center justify-between text-[7px] font-mono">
          <span className="font-bold bg-black text-white px-1.5 py-0.5">GENERAL ENTRY</span>
          <span className="font-bold text-black">PASS VERIFIED</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 4. TECH PULSE (Dark navy, subtle purple accent, grid lines)
  // ══════════════════════════════════════════════════════════════════
  if (id === "tech-pulse") {
    return (
      <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-[#0B0F19] text-white border border-violet-900/60 shadow-sm ${cardDims}`}>
        <div className="h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 -mx-5 -mt-3 mb-2" />
        <div className="flex items-center justify-between pb-1 border-b border-neutral-800">
          <span className="text-[7px] font-mono font-bold text-violet-400 tracking-wider">[DEV_SUMMIT]</span>
          <span className="text-[7px] font-mono text-neutral-400">{ticketId}</span>
        </div>
        <div className="my-1">
          <h4 className="font-bold text-xs text-white line-clamp-1">{eventName}</h4>
          <p className="text-[8.5px] font-semibold text-neutral-100 mt-0.5">{attendeeName}</p>
          <p className="text-[7px] text-neutral-400 font-normal">TechCorp Labs</p>
        </div>
        <div className="my-1 flex justify-center">
          <CorporateQrCode size={isCard ? 90 : 135} fgColor="#0B0F19" borderColor="#8B5CF6" />
        </div>
        <div className="pt-1.5 border-t border-neutral-800 flex items-center justify-between text-[7px] font-mono">
          <span className="px-1.5 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-700/50 font-bold">
            HACKATHON BUILDER
          </span>
          <span className="text-cyan-400">ROOT ACCESS</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 5. FUTURE GRID (Dark background, monospace cyber grid)
  // ══════════════════════════════════════════════════════════════════
  if (id === "future-grid") {
    return (
      <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-[#09090B] text-emerald-400 border border-emerald-950 shadow-sm font-mono ${cardDims}`}>
        <div className="flex items-center justify-between pb-1 border-b border-neutral-800 text-[7px]">
          <span>&gt; AI_SUMMIT_2026</span>
          <span className="text-neutral-500">{ticketId}</span>
        </div>
        <div className="my-1">
          <h4 className="font-bold text-white text-[11px] line-clamp-1">{eventName}</h4>
          <p className="text-[8.5px] text-emerald-300 font-semibold mt-0.5">{attendeeName} [DEV]</p>
          <p className="text-[6.5px] text-neutral-500">{eventDate} · {venueName}</p>
        </div>
        <div className="my-1 flex justify-center">
          <CorporateQrCode size={isCard ? 90 : 135} fgColor="#09090B" borderColor="#10B981" />
        </div>
        <div className="pt-1.5 border-t border-neutral-800 flex items-center justify-between text-[7px]">
          <span className="text-white bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
            SYNAPSE PROTOCOL
          </span>
          <span className="text-emerald-500">GATE 01</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 6. CAMPUS POP (Bright blocks, youthful layout)
  // ══════════════════════════════════════════════════════════════════
  if (id === "campus-pop") {
    return (
      <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-[#FFFBEB] text-neutral-900 border border-amber-300 shadow-sm ${cardDims}`}>
        <div className="flex items-center justify-between pb-1.5 border-b border-amber-200">
          <span className="text-[7.5px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-amber-950 uppercase">CAMPUS FEST &apos;26</span>
          <span className="text-[7px] font-mono text-neutral-500">{ticketId}</span>
        </div>
        <div className="my-1">
          <h4 className="font-extrabold text-neutral-900 text-xs line-clamp-1">{eventName}</h4>
          <p className="text-[9px] font-bold text-indigo-700 mt-0.5">{attendeeName}</p>
          <p className="text-[7px] text-neutral-600 font-medium">Anna University</p>
        </div>
        <div className="my-1 flex justify-center">
          <CorporateQrCode size={isCard ? 92 : 135} fgColor="#1E1B4B" borderColor="#F59E0B" />
        </div>
        <div className="pt-1.5 border-t border-amber-200 flex items-center justify-between text-[7px]">
          <span className="font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white uppercase">
            STUDENT PASS
          </span>
          <span className="font-semibold text-amber-800">ALL-EVENTS ACCESS</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 7. CAMPUS CLASSIC (Institutional style, academic green)
  // ══════════════════════════════════════════════════════════════════
  if (id === "campus-classic") {
    return (
      <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-white text-neutral-900 border-2 border-[#064E3B] shadow-sm ${cardDims}`}>
        <div className="bg-[#064E3B] text-white p-1 -mx-5 -mt-3 mb-1 text-center">
          <span className="text-[7px] font-serif uppercase tracking-widest font-bold">FACULTY OF ENGINEERING</span>
        </div>
        <div className="my-0.5">
          <h4 className="font-bold text-[#064E3B] text-xs line-clamp-1">{eventName}</h4>
          <p className="text-[8.5px] font-semibold text-neutral-800 mt-0.5">{attendeeName}</p>
          <p className="text-[6.5px] font-mono text-neutral-500">{eventDate} · {venueName}</p>
        </div>
        <div className="my-1 flex justify-center">
          <CorporateQrCode size={isCard ? 88 : 130} fgColor="#064E3B" borderColor="#065F46" />
        </div>
        <div className="pt-1.5 border-t border-neutral-200 flex items-center justify-between text-[7px] font-mono">
          <span className="font-bold text-[#064E3B]">DELEGATE #2026-089</span>
          <span className="text-neutral-500">HALL B ENTRY</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 8. SPEAKER BADGE (Mobile Pass layout with speaker credentials)
  // ══════════════════════════════════════════════════════════════════
  if (id === "speaker-badge") {
    return (
      <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-white text-neutral-900 border border-neutral-200 shadow-sm ${cardDims}`}>
        <div className="bg-[#059669] text-white py-1 px-3 -mx-5 -mt-3 text-center mb-1 shadow-xs">
          <span className="text-[8px] font-black tracking-widest uppercase">SPEAKER</span>
        </div>
        <div className="my-1 text-center">
          <h2 className="font-black text-xs text-neutral-950 uppercase tracking-tight">{attendeeName}</h2>
          <p className="text-[7.5px] font-semibold text-neutral-700">Chief Technology Officer</p>
          <p className="text-[7px] text-neutral-400">Acme Ltd.</p>
        </div>
        <div className="my-1 flex justify-center">
          <CorporateQrCode size={isCard ? 88 : 130} fgColor="#111827" borderColor="#059669" />
        </div>
        <div className="pt-1.5 border-t border-neutral-150 flex items-center justify-between text-[7px] font-mono">
          <span className="font-bold text-emerald-700">{eventName}</span>
          <span className="text-neutral-500">VIP LOUNGE</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 9. EXPO PRO (Company-first exhibition mobile credential)
  // ══════════════════════════════════════════════════════════════════
  if (id === "expo-pro") {
    return (
      <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-[#F8FAFC] text-slate-900 border border-blue-200 shadow-sm ${cardDims}`}>
        <div className="bg-blue-600 text-white p-1 -mx-5 -mt-3 mb-1 text-center">
          <span className="text-[7px] font-bold uppercase tracking-wider">GLOBAL TRADE EXPO 2026</span>
        </div>
        <div className="my-0.5">
          <span className="text-[6.5px] font-mono text-blue-700 uppercase font-bold block">COMPANY</span>
          <h4 className="font-black text-xs text-slate-900 uppercase line-clamp-1">ACME TECHNOLOGIES LTD</h4>
          <p className="text-[8px] font-semibold text-slate-700 mt-0.5">{attendeeName} · BOOTH #B-42</p>
        </div>
        <div className="my-1 flex justify-center">
          <CorporateQrCode size={isCard ? 88 : 130} fgColor="#0F172A" borderColor="#2563EB" />
        </div>
        <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[7px] font-mono">
          <span className="font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">EXHIBITOR</span>
          <span className="text-slate-500">HALL 03</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 10. VIP MIDNIGHT (Matte black, gold accents, luxury spacing)
  // ══════════════════════════════════════════════════════════════════
  if (id === "vip-midnight") {
    return (
      <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-[#050505] text-white border border-[#D4AF37]/50 shadow-sm text-center ${cardDims}`}>
        <div className="pt-1 pb-1">
          <span className="text-[7.5px] font-mono tracking-widest text-[#D4AF37] uppercase font-semibold">URPASS</span>
          <p className="text-[6.5px] tracking-wider text-neutral-400 uppercase mt-0.5">PRIVATE EVENING</p>
        </div>
        <div className="my-1">
          <h3 className="font-serif font-bold text-xs tracking-wide text-neutral-100 uppercase">{attendeeName}</h3>
          <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[6.5px] font-mono tracking-widest uppercase bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40">
            VIP ACCESS
          </span>
        </div>
        <div className="my-1 flex justify-center">
          <CorporateQrCode size={isCard ? 90 : 135} fgColor="#000000" borderColor="#D4AF37" />
        </div>
        <div className="pt-1.5 border-t border-neutral-900 text-[6.5px] font-mono text-neutral-400">
          <span>12 OCT • 7:30 PM · BLACK TIE</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 11. PREMIUM IVORY (Cream background, serif heading, elegant)
  // ══════════════════════════════════════════════════════════════════
  if (id === "premium-ivory") {
    return (
      <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-[#FAF7F2] text-[#292524] border border-[#E7E5E4] shadow-sm text-center ${cardDims}`}>
        <div className="pb-1 border-b border-[#E7E5E4]">
          <span className="text-[6.5px] font-serif uppercase tracking-widest text-[#78716C]">THE TRUSTEES FOUNDATION</span>
        </div>
        <div className="my-1">
          <h4 className="font-serif text-xs font-bold text-[#1C1917] italic">{eventName}</h4>
          <p className="text-[8.5px] font-serif font-semibold text-[#292524] mt-0.5">Mr. {attendeeName}</p>
          <p className="text-[6.5px] text-[#78716C] font-mono">{eventDate}</p>
        </div>
        <div className="my-1 flex justify-center">
          <CorporateQrCode size={isCard ? 90 : 135} fgColor="#292524" bgColor="#FAF7F2" borderColor="#D6D3D1" />
        </div>
        <div className="pt-1.5 border-t border-[#E7E5E4] flex items-center justify-between text-[7px] font-serif">
          <span>Table 04 · Seat B</span>
          <span className="text-[#78716C]">HONORED GUEST</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 12. ELEGANT RSVP (Soft neutral background, refined border)
  // ══════════════════════════════════════════════════════════════════
  if (id === "elegant-rsvp") {
    return (
      <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-[#F9FAFB] text-neutral-800 border-2 border-neutral-300 p-3 shadow-sm text-center ${cardDims}`}>
        <div className="border border-neutral-200 h-full p-2 flex flex-col justify-between rounded-lg">
          <div>
            <span className="text-[6.5px] font-mono tracking-widest text-neutral-400 uppercase">INVITATION CONFIRMED</span>
            <h4 className="font-serif text-xs font-semibold text-neutral-900 mt-0.5">{eventName}</h4>
            <p className="text-[8px] font-medium text-neutral-700 mt-0.5">{attendeeName} &amp; Guest</p>
          </div>
          <div className="my-1 flex justify-center">
            <CorporateQrCode size={isCard ? 85 : 125} fgColor="#1F2937" borderColor="#E5E7EB" />
          </div>
          <div className="text-[6.5px] font-mono text-neutral-500 pt-1 border-t border-neutral-150">
            <span>RSVP #URP-9204 · CEREMONY &amp; BANQUET</span>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 13. FESTIVAL NEON (Dark artwork, vibrant neon accent)
  // ══════════════════════════════════════════════════════════════════
  if (id === "festival-neon") {
    return (
      <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-[#0F0B1E] text-white border border-pink-500/50 shadow-sm ${cardDims}`}>
        <div className="flex items-center justify-between pb-1 border-b border-pink-900/40 text-[7px] font-mono">
          <span className="text-pink-400 font-bold tracking-widest uppercase">NEON SOUNDS</span>
          <span className="text-neutral-400">{ticketId}</span>
        </div>
        <div className="my-1">
          <h4 className="font-black text-xs uppercase tracking-tight text-white line-clamp-1">{eventName}</h4>
          <p className="text-[8.5px] font-bold text-pink-300 mt-0.5">{attendeeName}</p>
        </div>
        <div className="my-1 flex justify-center">
          <CorporateQrCode size={isCard ? 90 : 135} fgColor="#0F0B1E" borderColor="#EC4899" />
        </div>
        <div className="pt-1.5 border-t border-pink-900/40 flex items-center justify-between text-[7px] font-mono">
          <span className="font-black px-1.5 py-0.5 rounded bg-pink-600 text-white uppercase">
            VIP PIT ACCESS
          </span>
          <span className="text-pink-400">MAIN STAGE</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 14. URBAN FESTIVAL (Bold typography, poster-inspired blocks)
  // ══════════════════════════════════════════════════════════════════
  if (id === "urban-festival") {
    return (
      <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-white text-black border-2 border-black shadow-sm ${cardDims}`}>
        <div className="bg-[#FF5500] text-black p-1 -mx-5 -mt-3 mb-1 text-center font-black text-[7.5px] tracking-wider uppercase">
          CULTURE &apos;26 // URBAN ARTS
        </div>
        <div className="my-0.5">
          <h4 className="font-black text-xs uppercase tracking-tighter text-black line-clamp-1">{eventName}</h4>
          <p className="text-[9px] font-extrabold uppercase text-neutral-900 mt-0.5">{attendeeName}</p>
          <p className="text-[6.5px] font-mono text-neutral-500">{venueName}</p>
        </div>
        <div className="my-1 flex justify-center">
          <CorporateQrCode size={isCard ? 88 : 130} fgColor="#000000" borderColor="#000000" />
        </div>
        <div className="pt-1.5 border-t-2 border-black flex items-center justify-between text-[7px] font-mono font-black">
          <span className="bg-black text-white px-1 py-0.5">ALL VENUES</span>
          <span>WEEKEND PASS</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 15. SPORTS ARENA (Dynamic diagonal layout, stadium identity)
  // ══════════════════════════════════════════════════════════════════
  if (id === "sports-arena") {
    return (
      <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-[#111827] text-white border border-red-600 shadow-sm ${cardDims}`}>
        <div className="bg-red-600 text-white p-1 -mx-5 -mt-3 mb-1 text-center font-bold text-[7px] tracking-widest uppercase">
          ARENA CUP FINALS
        </div>
        <div className="my-0.5">
          <h4 className="font-black text-xs uppercase text-white line-clamp-1">{eventName}</h4>
          <p className="text-[8.5px] font-semibold text-red-300 mt-0.5">{attendeeName}</p>
          <p className="text-[7px] font-mono text-neutral-300">STAND B · ROW 12 · SEAT 04</p>
        </div>
        <div className="my-1 flex justify-center">
          <CorporateQrCode size={isCard ? 88 : 130} fgColor="#111827" borderColor="#DC2626" />
        </div>
        <div className="pt-1.5 border-t border-neutral-700 flex items-center justify-between text-[7px] font-mono font-bold">
          <span className="text-red-400">GATE 4 ENTRY</span>
          <span className="text-neutral-400">{ticketId}</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 16. MARATHON PASS (Race bib number style, timing focus)
  // ══════════════════════════════════════════════════════════════════
  if (id === "marathon-pass") {
    return (
      <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-white text-neutral-900 border-2 border-orange-500 shadow-sm text-center ${cardDims}`}>
        <div className="pb-1 border-b border-orange-200">
          <span className="text-[6.5px] font-mono font-bold uppercase text-orange-600">METRO MARATHON 2026</span>
          <div className="text-xl font-black text-neutral-900 tracking-tighter mt-0.5 leading-none">
            BIB #4219
          </div>
        </div>
        <div className="my-0.5">
          <p className="text-[8.5px] font-bold text-neutral-800">{attendeeName}</p>
          <span className="text-[7px] font-mono font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-800 uppercase">
            HALF MARATHON 21K
          </span>
        </div>
        <div className="my-1 flex justify-center">
          <CorporateQrCode size={isCard ? 88 : 130} fgColor="#18181B" borderColor="#EA580C" />
        </div>
        <div className="pt-1.5 border-t border-orange-200 flex items-center justify-between text-[6.5px] font-mono">
          <span className="text-orange-700 font-bold">WAVE 1 · 05:30 AM</span>
          <span className="text-neutral-400">CHUTE TIMING</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 17. WORKSHOP CLEAN (Simple educational layout, prominent time)
  // ══════════════════════════════════════════════════════════════════
  if (id === "workshop-clean") {
    return (
      <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-white text-neutral-900 border border-teal-200 shadow-sm ${cardDims}`}>
        <div className="flex items-center justify-between pb-1 border-b border-teal-100 text-[7px] font-mono">
          <span className="font-bold text-teal-700 uppercase">HANDS-ON WORKSHOP</span>
          <span className="text-neutral-400">{ticketId}</span>
        </div>
        <div className="my-1">
          <h4 className="font-bold text-xs text-neutral-900 line-clamp-1">{eventName}</h4>
          <p className="text-[8px] font-semibold text-neutral-700 mt-0.5">{attendeeName}</p>
          <p className="text-[7px] font-mono text-teal-600 font-medium">12 OCT · LAB ROOM 204</p>
        </div>
        <div className="my-1 flex justify-center">
          <CorporateQrCode size={isCard ? 90 : 135} fgColor="#134E4A" borderColor="#0D9488" />
        </div>
        <div className="pt-1.5 border-t border-teal-100 flex items-center justify-between text-[7px] font-mono">
          <span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 font-semibold border border-teal-200">
            TRACK 01 PASS
          </span>
          <span className="text-neutral-400">LAB ACCESS</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 18. NETWORKING PRO (Attendee name + company emphasis)
  // ══════════════════════════════════════════════════════════════════
  if (id === "networking-pro") {
    return (
      <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-white text-neutral-900 border border-indigo-200 shadow-sm ${cardDims}`}>
        <div className="flex items-center justify-between pb-1.5 border-b border-indigo-100">
          <span className="text-[7px] font-bold text-indigo-600 uppercase tracking-widest">NETWORKING PRO</span>
          <span className="text-[7px] font-mono text-neutral-400">{ticketId}</span>
        </div>
        <div className="my-1">
          <h3 className="font-black text-xs text-neutral-900 uppercase">{attendeeName}</h3>
          <p className="text-[8px] font-bold text-indigo-700">Senior Product Lead · Acme Corp</p>
          <p className="text-[6.5px] font-mono text-neutral-400 mt-0.5">SEEKING PARTNERSHIPS &amp; TALENT</p>
        </div>
        <div className="my-1 flex justify-center">
          <CorporateQrCode size={isCard ? 90 : 135} fgColor="#1E1B4B" borderColor="#4F46E5" />
        </div>
        <div className="pt-1.5 border-t border-indigo-100 flex items-center justify-between text-[7px] font-mono">
          <span className="text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">CONNECT PROFILE</span>
          <span className="text-neutral-400">GATE VALID</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 19. PRODUCT LAUNCH (Hero image/logo, modern dark-light split)
  // ══════════════════════════════════════════════════════════════════
  if (id === "product-launch") {
    return (
      <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-white text-neutral-900 border border-neutral-300 shadow-sm ${cardDims}`}>
        <div className="bg-[#18181B] text-white p-2 -mx-5 -mt-3 mb-1 text-center">
          <span className="text-[7px] font-mono font-bold tracking-widest uppercase text-indigo-400">UNVEILING KEYNOTE &apos;26</span>
          <h4 className="font-bold text-xs uppercase tracking-tight text-white mt-0.5 line-clamp-1">{eventName}</h4>
        </div>
        <div className="my-0.5 text-center">
          <p className="text-[8.5px] font-bold text-neutral-900">{attendeeName}</p>
          <span className="text-[7px] font-mono text-neutral-500 uppercase">MEDIA &amp; ANALYST PASS</span>
        </div>
        <div className="my-1 flex justify-center">
          <CorporateQrCode size={isCard ? 88 : 130} fgColor="#18181B" borderColor="#6366F1" />
        </div>
        <div className="pt-1.5 border-t border-neutral-200 flex items-center justify-between text-[6.5px] font-mono">
          <span className="font-bold text-neutral-900">EMBARGO CONFIDENTIAL</span>
          <span className="text-neutral-400">FRONT ROW</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 20. ULTRA QR (Oversized scan-first layout, maximum QR)
  // ══════════════════════════════════════════════════════════════════
  return (
    <div className={`relative overflow-hidden select-none flex flex-col justify-between bg-white text-neutral-900 border-2 border-neutral-900 shadow-sm text-center ${cardDims}`}>
      <div className="pb-1 border-b border-neutral-200">
        <h4 className="font-black text-xs uppercase tracking-wider text-neutral-900">{eventName}</h4>
        <p className="text-[7.5px] font-bold text-neutral-600 uppercase mt-0.5">{attendeeName} · GENERAL ENTRY</p>
      </div>

      {/* OVERSIZED QR CODE */}
      <div className="my-auto flex flex-col items-center justify-center py-1">
        <CorporateQrCode
          size={isCard ? 115 : 185}
          fgColor="#000000"
          bgColor="#FFFFFF"
          borderColor="#09090B"
        />
      </div>

      <div className="pt-1 border-t border-neutral-200 text-[7px] font-mono font-bold text-neutral-800 flex items-center justify-between">
        <span>PASS #UP-298421</span>
        <span>TAP OR SCAN</span>
      </div>
    </div>
  );
  }

  return wrapFormat(renderInner(), format, isCard);
}
