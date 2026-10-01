"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  X,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const STORAGE_KEY = "urpass_whats_new_conference_v1";

interface CorporateWhatsNewCardProps {
  firstEventId?: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Canva-Style High-Fidelity Vector Illustrations
 * Vibrant, Colorful, Corporate (No skeleton lines or pseudo-bars)
 * ───────────────────────────────────────────────────────────────────────────── */

/** Slide 1: Canva Calendar & Multi-Track Schedule Illustration */
function AgendaVectorIllustration() {
  return (
    <div className="relative w-full h-full min-h-[240px] md:min-h-[290px] flex items-center justify-center p-4 select-none">
      <svg
        viewBox="0 0 300 250"
        className="w-full h-full max-w-[280px] max-h-[240px] drop-shadow-md select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="agendaBgGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7D2AE8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#00C4CC" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="calHeaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7D2AE8" />
            <stop offset="100%" stopColor="#5B1EC2" />
          </linearGradient>
          <linearGradient id="trackViolet" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id="trackCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0891B2" />
          </linearGradient>
          <linearGradient id="trackCoral" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
          <filter id="cardShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#7D2AE8" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Ambient Halo */}
        <circle cx="150" cy="125" r="95" fill="url(#agendaBgGlow)" />
        <circle cx="230" cy="65" r="45" fill="#FEF08A" opacity="0.4" />

        {/* Desk Calendar Board Base */}
        <g filter="url(#cardShadow)">
          <rect x="45" y="32" width="210" height="190" rx="18" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />

          {/* Calendar Header with spiral binder holes */}
          <path d="M 45 46 C 45 38 51 32 60 32 L 240 32 C 249 32 255 38 255 46 L 255 70 L 45 70 Z" fill="url(#calHeaderGrad)" />

          {/* White Spiral Rings */}
          <rect x="75" y="24" width="8" height="18" rx="4" fill="#F3E8FF" stroke="#7C3AED" strokeWidth="1.5" />
          <rect x="115" y="24" width="8" height="18" rx="4" fill="#F3E8FF" stroke="#7C3AED" strokeWidth="1.5" />
          <rect x="155" y="24" width="8" height="18" rx="4" fill="#F3E8FF" stroke="#7C3AED" strokeWidth="1.5" />
          <rect x="195" y="24" width="8" height="18" rx="4" fill="#F3E8FF" stroke="#7C3AED" strokeWidth="1.5" />

          {/* Header Title Text */}
          <text x="75" y="56" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="system-ui, sans-serif" letterSpacing="0.5">
            CONFERENCE AGENDA
          </text>
          <rect x="198" y="44" width="46" height="16" rx="8" fill="#FEF08A" />
          <text x="221" y="56" textAnchor="middle" fill="#854D0E" fontSize="8" fontWeight="bold" fontFamily="system-ui, sans-serif">
            DAY 01
          </text>

          {/* Track 1: Keynote Session Card */}
          <g filter="drop-shadow(0 2px 4px rgba(124, 58, 237, 0.10))">
            <rect x="58" y="82" width="184" height="38" rx="10" fill="#FAF5FF" stroke="#E9D5FF" strokeWidth="1" />
            <path d="M 58 90 C 58 85 62 82 66 82 L 72 82 L 72 120 L 66 120 C 62 120 58 116 58 111 Z" fill="url(#trackViolet)" />
            <text x="80" y="98" fill="#1E1B4B" fontSize="9" fontWeight="bold" fontFamily="system-ui, sans-serif">
              Opening Keynote: Next-Gen AI
            </text>
            <text x="80" y="111" fill="#7C3AED" fontSize="7.5" fontWeight="600" fontFamily="system-ui, sans-serif">
              10:00 – 11:00 AM
            </text>
            <rect x="180" y="91" width="54" height="18" rx="5" fill="#EDE9FE" />
            <text x="207" y="103" textAnchor="middle" fill="#6D28D9" fontSize="7.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
              MAIN HALL
            </text>
          </g>

          {/* Track 2: Breakout Track Card */}
          <g filter="drop-shadow(0 2px 4px rgba(6, 182, 212, 0.10))">
            <rect x="58" y="128" width="184" height="38" rx="10" fill="#F0FDFA" stroke="#CCFBF1" strokeWidth="1" />
            <path d="M 58 136 C 58 131 62 128 66 128 L 72 128 L 72 166 L 66 166 C 62 166 58 162 58 157 Z" fill="url(#trackCyan)" />
            <text x="80" y="144" fill="#042F2E" fontSize="9" fontWeight="bold" fontFamily="system-ui, sans-serif">
              Design Systems &amp; Micro-UIs
            </text>
            <text x="80" y="157" fill="#0891B2" fontSize="7.5" fontWeight="600" fontFamily="system-ui, sans-serif">
              11:30 AM – 12:30 PM
            </text>
            <rect x="180" y="137" width="54" height="18" rx="5" fill="#CFFAFE" />
            <text x="207" y="149" textAnchor="middle" fill="#0E7490" fontSize="7.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
              STAGE 2
            </text>
          </g>

          {/* Track 3: Panel Discussion Card */}
          <g filter="drop-shadow(0 2px 4px rgba(244, 63, 94, 0.10))">
            <rect x="58" y="174" width="184" height="38" rx="10" fill="#FFF1F2" stroke="#FFE4E6" strokeWidth="1" />
            <path d="M 58 182 C 58 177 62 174 66 174 L 72 174 L 72 212 L 66 212 C 62 212 58 208 58 203 Z" fill="url(#trackCoral)" />
            <text x="80" y="190" fill="#4C0519" fontSize="9" fontWeight="bold" fontFamily="system-ui, sans-serif">
              Global Scale Infrastructure
            </text>
            <text x="80" y="203" fill="#E11D48" fontSize="7.5" fontWeight="600" fontFamily="system-ui, sans-serif">
              02:00 – 03:00 PM
            </text>
            <rect x="180" y="183" width="54" height="18" rx="5" fill="#FFE4E6" />
            <text x="207" y="195" textAnchor="middle" fill="#BE123C" fontSize="7.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
              ROOM 104
            </text>
          </g>
        </g>

        {/* Canva Sparkle Stars */}
        <path d="M 270 42 Q 270 50 278 50 Q 270 50 270 58 Q 270 50 262 50 Q 270 50 270 42" fill="#F59E0B" />
        <circle cx="284" cy="62" r="3" fill="#FBBF24" />
        <path d="M 30 70 Q 30 76 36 76 Q 30 76 30 82 Q 30 76 24 76 Q 30 76 30 70" fill="#7C3AED" />
      </svg>
    </div>
  );
}

/** Slide 2: Canva Keynote Stage & Speaker Spotlight Illustration */
function SpeakerVectorIllustration() {
  return (
    <div className="relative w-full h-full min-h-[240px] md:min-h-[290px] flex items-center justify-center p-4 select-none">
      <svg
        viewBox="0 0 300 250"
        className="w-full h-full max-w-[280px] max-h-[240px] drop-shadow-md select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="spotlightGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.10" />
          </linearGradient>
          <linearGradient id="speakerBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E1B4B" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>
          <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <filter id="speakerShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#1E1B4B" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Ambient Halo & Spotlight Beam */}
        <circle cx="150" cy="125" r="95" fill="url(#spotlightGlow)" />
        <polygon points="60,20 180,240 20,240" fill="#FEF08A" opacity="0.18" />

        {/* Floating Speaker Profile Card */}
        <g filter="url(#speakerShadow)">
          <rect x="50" y="32" width="200" height="190" rx="18" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />

          {/* Top Banner with Keynote Ribbon */}
          <path d="M 50 46 C 50 38 56 32 66 32 L 234 32 C 244 32 250 38 250 46 L 250 78 L 50 78 Z" fill="url(#speakerBadgeGrad)" />

          {/* Gold VIP Star Pill */}
          <rect x="156" y="44" width="82" height="18" rx="9" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" />
          <text x="197" y="56.5" textAnchor="middle" fill="#B45309" fontSize="8" fontWeight="bold" fontFamily="system-ui, sans-serif">
            ★ KEYNOTE
          </text>

          {/* Speaker Avatar Circle */}
          <circle cx="100" cy="78" r="28" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2.5" />
          <circle cx="100" cy="78" r="24" fill="url(#avatarGrad)" />
          {/* Avatar Face Icon */}
          <circle cx="100" cy="73" r="8" fill="#FFFFFF" />
          <path d="M 85 94 C 87 86 93 85 100 85 C 107 85 113 86 115 94 Z" fill="#FFFFFF" />

          {/* Verified Badge */}
          <circle cx="118" cy="88" r="7" fill="#10B981" />
          <path d="M 115 88 L 117.5 90.5 L 121 86" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Speaker Details */}
          <text x="64" y="122" fill="#0F172A" fontSize="12" fontWeight="bold" fontFamily="system-ui, sans-serif">
            Sarah Lin, Ph.D.
          </text>
          <text x="64" y="136" fill="#64748B" fontSize="8.5" fontWeight="500" fontFamily="system-ui, sans-serif">
            VP of Architecture · Google Cloud
          </text>

          {/* Assigned Session Pill */}
          <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.04))">
            <rect x="64" y="148" width="172" height="34" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
            <circle cx="78" cy="165" r="5" fill="#3B82F6" />
            <text x="90" y="161" fill="#1E293B" fontSize="8.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
              Building Scalable Edge Networks
            </text>
            <text x="90" y="172" fill="#64748B" fontSize="7.5" fontWeight="500" fontFamily="system-ui, sans-serif">
              Main Hall · 10:00 AM – 11:00 AM
            </text>
          </g>

          {/* Topic Tags */}
          <rect x="64" y="190" width="56" height="18" rx="6" fill="#EFF6FF" />
          <text x="92" y="202" textAnchor="middle" fill="#1D4ED8" fontSize="7.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
            Cloud Scale
          </text>

          <rect x="126" y="190" width="56" height="18" rx="6" fill="#FAF5FF" />
          <text x="154" y="202" textAnchor="middle" fill="#7E22CE" fontSize="7.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
            AI Systems
          </text>

          <rect x="188" y="190" width="48" height="18" rx="6" fill="#ECFDF5" />
          <text x="212" y="202" textAnchor="middle" fill="#047857" fontSize="7.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
            Security
          </text>
        </g>

        {/* Canva Sparkle Stars */}
        <path d="M 268 90 Q 268 98 276 98 Q 268 98 268 106 Q 268 98 260 98 Q 268 98 268 90" fill="#3B82F6" />
        <circle cx="34" cy="50" r="3.5" fill="#F59E0B" />
      </svg>
    </div>
  );
}

/** Slide 3: Canva Smartphone QR Scanner & Verified Pass Illustration */
function AccessVectorIllustration() {
  return (
    <div className="relative w-full h-full min-h-[240px] md:min-h-[290px] flex items-center justify-center p-4 select-none">
      <svg
        viewBox="0 0 300 250"
        className="w-full h-full max-w-[280px] max-h-[240px] drop-shadow-md select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="accessGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#7D2AE8" stopOpacity="0.10" />
          </linearGradient>
          <linearGradient id="passNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <linearGradient id="qrLaserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#10B981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
          </linearGradient>
          <filter id="accessShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0F172A" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Ambient Halo */}
        <circle cx="150" cy="125" r="95" fill="url(#accessGlow)" />

        {/* VIP Conference Pass Badge (Overlapped) */}
        <g filter="url(#accessShadow)">
          {/* Lanyard Strap */}
          <path d="M 136 12 Q 140 28 143 36" stroke="#7C3AED" strokeWidth="4" strokeLinecap="round" />
          <path d="M 152 12 Q 148 28 145 36" stroke="#6D28D9" strokeWidth="4" strokeLinecap="round" />
          <rect x="137" y="34" width="14" height="8" rx="2" fill="#94A3B8" />

          {/* Pass Base */}
          <rect x="48" y="40" width="204" height="180" rx="18" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />

          {/* Dark Header */}
          <path d="M 48 54 C 48 46 54 40 64 40 L 236 40 C 246 40 252 46 252 54 L 252 74 L 48 74 Z" fill="url(#passNavyGrad)" />
          <text x="66" y="61" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" fontFamily="system-ui, sans-serif" letterSpacing="0.5">
            CONFERENCE PASS
          </text>
          <rect x="180" y="48" width="62" height="18" rx="9" fill="#FEF3C7" />
          <text x="211" y="60.5" textAnchor="middle" fill="#B45309" fontSize="7.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
            VIP ACCESS
          </text>

          {/* Verified Scan Pill */}
          <rect x="64" y="84" width="172" height="22" rx="6" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
          <circle cx="76" cy="95" r="4" fill="#10B981" />
          <text x="86" y="98" fill="#047857" fontSize="8.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
            GATE CHECK-IN VERIFIED · 0.28s
          </text>
          <text x="226" y="98" textAnchor="end" fill="#059669" fontSize="7.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
            ✓ PASS
          </text>

          {/* Authentic High-Res QR Code Matrix View */}
          <g filter="drop-shadow(0 2px 6px rgba(0,0,0,0.06))">
            <rect x="64" y="114" width="70" height="70" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.2" />

            {/* QR Position Squares */}
            <rect x="72" y="122" width="16" height="16" rx="2" fill="#0F172A" />
            <rect x="75" y="125" width="10" height="10" rx="1" fill="#FFFFFF" />
            <rect x="77" y="127" width="6" height="6" fill="#0F172A" />

            <rect x="110" y="122" width="16" height="16" rx="2" fill="#0F172A" />
            <rect x="113" y="125" width="10" height="10" rx="1" fill="#FFFFFF" />
            <rect x="115" y="127" width="6" height="6" fill="#0F172A" />

            <rect x="72" y="160" width="16" height="16" rx="2" fill="#0F172A" />
            <rect x="75" y="163" width="10" height="10" rx="1" fill="#FFFFFF" />
            <rect x="77" y="165" width="6" height="6" fill="#0F172A" />

            {/* Dynamic QR Data Points */}
            <rect x="96" y="126" width="6" height="6" rx="1" fill="#7C3AED" />
            <rect x="104" y="142" width="6" height="6" rx="1" fill="#10B981" />
            <rect x="92" y="152" width="8" height="8" rx="1" fill="#0F172A" />
            <rect x="112" y="158" width="6" height="6" rx="1" fill="#0F172A" />
            <rect x="118" y="166" width="6" height="6" rx="1" fill="#7C3AED" />

            {/* Glowing Laser Scan Bar */}
            <rect x="64" y="146" width="70" height="3" fill="url(#qrLaserGrad)" />
          </g>

          {/* Attendee Data Right Side */}
          <text x="144" y="128" fill="#0F172A" fontSize="10.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
            Alex Morgan
          </text>
          <text x="144" y="140" fill="#64748B" fontSize="8" fontWeight="500" fontFamily="system-ui, sans-serif">
            Pass ID: #UP-90214
          </text>

          {/* Room Capacity Status */}
          <rect x="144" y="150" width="92" height="34" rx="6" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="0.8" />
          <text x="152" y="163" fill="#334155" fontSize="7.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
            ROOM OCCUPANCY
          </text>
          <text x="152" y="176" fill="#059669" fontSize="8.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
            342 / 500 Inside
          </text>

          {/* Barcode dash line at bottom */}
          <line x1="64" y1="202" x2="236" y2="202" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="5 3" />
        </g>

        {/* Canva Sparkle Stars */}
        <path d="M 270 70 Q 270 78 278 78 Q 270 78 270 86 Q 270 78 262 78 Q 270 78 270 70" fill="#10B981" />
        <circle cx="36" cy="180" r="3" fill="#059669" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Slide Definitions
 * ───────────────────────────────────────────────────────────────────────────── */

interface SlideItem {
  id: string;
  stepNumber: string;
  categoryBadge: string;
  title: string;
  headline: string;
  summary: string;
  bullets: string[];
  illustration: React.ReactNode;
  accentBg: string;
}

const SLIDES: SlideItem[] = [
  {
    id: "agenda",
    stepNumber: "01",
    categoryBadge: "Agenda & Schedules",
    title: "Multi-Track Agenda Builder",
    headline: "Zero-collision conference schedules",
    summary:
      "Build multi-track schedules, map hall stages, and automatically detect room and speaker timing collisions in real time.",
    bullets: [
      "Interactive timeline & calendar grid views",
      "Automated room & hall collision guardrails",
      "Synchronized attendee bookmarks & live updates",
    ],
    illustration: <AgendaVectorIllustration />,
    accentBg: "from-[#F7F5FF] via-[#FAF9FF] to-white",
  },
  {
    id: "speakers",
    stepNumber: "02",
    categoryBadge: "Speakers & Keynotes",
    title: "Keynote & Speaker Directory",
    headline: "Showcase leaders & track assignments",
    summary:
      "Publish speaker bios, company affiliations, and linked session agendas with automated double-booking warnings.",
    bullets: [
      "Rich profiles with bio, company & topic tags",
      "Direct linking to agenda sessions & halls",
      "Instant warning if a speaker is double-booked",
    ],
    illustration: <SpeakerVectorIllustration />,
    accentBg: "from-[#F0F5FF] via-[#F8FAFC] to-white",
  },
  {
    id: "access",
    stepNumber: "03",
    categoryBadge: "Access & Passes",
    title: "Hall Passes & Session Check-In",
    headline: "Fast gate validation with existing passes",
    summary:
      "Cap room capacities, manage attendee seat reservations, and validate hall entrances using existing UrPass QR codes.",
    bullets: [
      "Scan existing UrPass attendee QR codes seamlessly",
      "Live hall capacity tracking & overflow rejection",
      "Sub-second gate check-in with offline fallback",
    ],
    illustration: <AccessVectorIllustration />,
    accentBg: "from-[#EDFDF5] via-[#F6FBF9] to-white",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
 * Main Component
 * ───────────────────────────────────────────────────────────────────────────── */

export default function CorporateWhatsNewCard({
  firstEventId,
}: CorporateWhatsNewCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (!dismissed) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  function handleDismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    setIsVisible(false);
  }

  // Keyboard Navigation: ArrowLeft, ArrowRight, Escape
  useEffect(() => {
    if (!isVisible) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleDismiss();
      } else if (e.key === "ArrowRight") {
        setCurrentSlideIndex((prev) => (prev < SLIDES.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  if (!isMounted || !isVisible) {
    return null;
  }

  const slide = SLIDES[currentSlideIndex];
  const isLastSlide = currentSlideIndex === SLIDES.length - 1;

  function handleNext() {
    if (isLastSlide) {
      handleDismiss();
    } else {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  }

  function handlePrev() {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  }

  return (
    <div
      onClick={handleDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="corporate-modal-title"
    >
      {/* ── Large Rectangular Modal Card (Increased Size: max-w-[880px]) ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[880px] bg-white rounded-3xl shadow-2xl border border-neutral-200/90 overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200 text-neutral-900"
      >
        {/* Subtle Close Button in Top Right */}
        <button
          onClick={handleDismiss}
          type="button"
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-neutral-400 hover:text-neutral-800 shadow-xs border border-neutral-200/70 flex items-center justify-center transition-all cursor-pointer"
          title="Close dialog"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── Left Column: Spacious High-Fidelity Illustration Area (md:w-[380px]) ─ */}
        <div
          className={`w-full md:w-[380px] shrink-0 bg-gradient-to-b ${slide.accentBg} p-6 md:p-8 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-neutral-100 transition-colors duration-500`}
        >
          {/* Active Vector Illustration */}
          <div className="w-full flex items-center justify-center transition-all duration-300">
            {slide.illustration}
          </div>

          {/* Slide Indicator Bar for Mobile */}
          <div className="flex md:hidden items-center gap-1.5 mt-3">
            {SLIDES.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlideIndex ? "w-6 bg-neutral-900" : "w-1.5 bg-neutral-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Right Column: Enterprise Multi-Page Content ─────────────────── */}
        <div className="flex-1 p-7 md:p-10 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Step Counter & Category */}
            <div className="flex items-center justify-between pr-8">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-lg border border-violet-100">
                  {slide.stepNumber} / 03
                </span>
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {slide.categoryBadge}
                </span>
              </div>
            </div>

            {/* Title & Subheading */}
            <div className="space-y-2">
              <h2
                id="corporate-modal-title"
                className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight leading-snug"
              >
                {slide.title}
              </h2>
              <p className="text-sm md:text-base text-neutral-500 leading-relaxed font-normal">
                {slide.summary}
              </p>
            </div>

            {/* Bullet Highlights */}
            <div className="space-y-2.5 pt-1">
              {slide.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-neutral-700 leading-tight font-medium">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Footer Navigation & Action Buttons ─────────────────────────── */}
          <div className="pt-8 mt-8 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Slide Pagination Dots */}
            <div className="hidden md:flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlideIndex(i)}
                  type="button"
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentSlideIndex
                      ? "w-8 bg-neutral-900"
                      : "w-2.5 bg-neutral-200 hover:bg-neutral-300"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              {currentSlideIndex > 0 ? (
                <button
                  onClick={handlePrev}
                  type="button"
                  className="px-4 py-2.5 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  onClick={handleDismiss}
                  type="button"
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 text-xs md:text-sm font-medium transition-colors cursor-pointer"
                >
                  Skip
                </button>
              )}

              {isLastSlide ? (
                <Link
                  href={firstEventId ? `/event/${firstEventId}/agenda` : "/create-event"}
                  onClick={handleDismiss}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs md:text-sm font-semibold transition-colors shadow-xs"
                >
                  <span>{firstEventId ? "Explore Agenda" : "Create Event"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={handleNext}
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs md:text-sm font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
