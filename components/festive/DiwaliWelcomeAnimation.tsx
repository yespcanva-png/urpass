"use client";

import { useEffect, useState, useRef } from "react";
import { trackLifecycleEvent } from "@/lib/analytics/client";

interface DiwaliWelcomeAnimationProps {
  onComplete: () => void;
}

export default function DiwaliWelcomeAnimation({ onComplete }: DiwaliWelcomeAnimationProps) {
  const [fading, setFading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Accessibility: Check for prefers-reduced-motion
    if (typeof window !== "undefined") {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        try {
          sessionStorage.setItem("urpass_diwali_welcome_seen", "1");
        } catch {}
        onComplete();
        return;
      }
    }

    setMounted(true);
    trackLifecycleEvent("diwali_welcome_shown");

    try {
      sessionStorage.setItem("urpass_diwali_welcome_seen", "1");
    } catch {}

    // 2. Play smoothly for maximum 4 seconds (3.3s full display + 0.7s smooth fade)
    fadeTimerRef.current = setTimeout(() => {
      setFading(true);
    }, 3300);

    timerRef.current = setTimeout(() => {
      trackLifecycleEvent("diwali_welcome_completed");
      onComplete();
    }, 4000);

    // Escape key listener for keyboard accessibility
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (fading) return;
    trackLifecycleEvent("diwali_welcome_skipped");
    setFading(true);
    setTimeout(() => {
      onComplete();
    }, 350);
  };

  if (!mounted) return null;

  return (
    <aside
      aria-label="Happy Diwali from UrPass"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center select-none overflow-hidden transition-opacity duration-700 ease-in-out ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
      }`}
      style={{
        background:
          "radial-gradient(ellipse 90% 80% at 50% 45%, #1f073a 0%, #0d021a 55%, #05010b 100%)",
      }}
    >
      {/* ── Accessible Skip Button ── */}
      <button
        type="button"
        onClick={handleSkip}
        aria-label="Skip welcome animation"
        className="absolute top-5 right-5 sm:top-7 sm:right-8 z-20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-200/90 bg-white/10 hover:bg-white/20 border border-amber-500/30 backdrop-blur-md transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 shadow-lg"
      >
        <span>Skip</span>
        <span aria-hidden="true">✕</span>
      </button>

      {/* ── Rotating Rangoli Watermark Accent ── */}
      <div
        aria-hidden="true"
        className="absolute w-[440px] h-[440px] sm:w-[580px] sm:h-[580px] pointer-events-none opacity-10 animate-[spin_60s_linear_infinite]"
      >
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-amber-400">
          <circle cx="100" cy="100" r="95" strokeWidth="0.75" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="75" strokeWidth="0.75" />
          <circle cx="100" cy="100" r="55" strokeWidth="0.75" strokeDasharray="2 2" />
          <circle cx="100" cy="100" r="35" strokeWidth="0.75" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 100 100)`}>
              <path
                d="M100 10 C105 25, 115 35, 100 55 C85 35, 95 25, 100 10 Z"
                fill="none"
                strokeWidth="0.75"
              />
              <circle cx="100" cy="25" r="2" fill="currentColor" opacity="0.6" />
            </g>
          ))}
        </svg>
      </div>

      {/* ── Floating Sparkles & Light Particles (CSS Keyframes) ── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: "18%", left: "22%", size: 6, delay: "0s" },
          { top: "25%", left: "75%", size: 8, delay: "0.4s" },
          { top: "65%", left: "15%", size: 5, delay: "0.8s" },
          { top: "72%", left: "80%", size: 7, delay: "0.2s" },
          { top: "35%", left: "30%", size: 4, delay: "0.6s" },
          { top: "40%", left: "68%", size: 5, delay: "1.1s" },
          { top: "80%", left: "45%", size: 6, delay: "0.5s" },
          { top: "15%", left: "50%", size: 7, delay: "0.9s" },
        ].map((spark, idx) => (
          <div
            key={idx}
            className="absolute rounded-full bg-amber-300 shadow-[0_0_12px_#fbbf24] animate-pulse"
            style={{
              top: spark.top,
              left: spark.left,
              width: `${spark.size}px`,
              height: `${spark.size}px`,
              animationDelay: spark.delay,
              animationDuration: "1.8s",
            }}
          />
        ))}
      </div>

      {/* ── Central Gold Diya & Festive Animation ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-xl mx-auto">
        {/* Festive Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-sm mb-6 animate-in fade-in zoom-in-95 duration-500">
          <span className="text-amber-400">✨</span>
          <span>UrPass Festive Celebration</span>
          <span className="text-amber-400">✨</span>
        </div>

        {/* Ornate Gold Diya SVG with Living Flame Glow */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-6 flex items-center justify-center">
          {/* Flame Radiant Ambient Glow */}
          <div
            aria-hidden="true"
            className="absolute top-4 w-28 h-28 rounded-full bg-amber-500/30 blur-2xl animate-pulse"
            style={{ animationDuration: "1.4s" }}
          />
          <div
            aria-hidden="true"
            className="absolute top-2 w-20 h-20 rounded-full bg-yellow-400/40 blur-xl animate-pulse"
            style={{ animationDuration: "1.1s" }}
          />

          <svg
            viewBox="0 0 160 160"
            className="w-full h-full drop-shadow-[0_15px_30px_rgba(245,158,11,0.4)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Flame Gradients */}
              <linearGradient id="flameInner" x1="80" y1="20" x2="80" y2="72" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#fef08a" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>

              {/* Diya Brass / Gold Gradients */}
              <linearGradient id="diyaGold" x1="30" y1="80" x2="130" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="30%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>

              <linearGradient id="diyaRim" x1="20" y1="70" x2="140" y2="78" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              <linearGradient id="diyaBase" x1="60" y1="120" x2="100" y2="136" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>

              {/* Flame Glow Filter */}
              <filter id="flameGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* ── Living Flame (Organic SVG Motion) ── */}
            <g className="origin-bottom" style={{ transformOrigin: "80px 72px" }}>
              {/* Outer Flame Glow */}
              <path
                d="M80 18 C85 30, 95 44, 95 56 C95 68, 88 74, 80 74 C72 74, 65 68, 65 56 C65 44, 75 30, 80 18 Z"
                fill="#f97316"
                opacity="0.4"
                filter="url(#flameGlow)"
              />
              {/* Mid Flame */}
              <path
                d="M80 22 C84 32, 92 45, 92 56 C92 66, 86 72, 80 72 C74 72, 68 66, 68 56 C68 45, 76 32, 80 22 Z"
                fill="url(#flameInner)"
                className="animate-[pulse_1.2s_ease-in-out_infinite]"
              />
              {/* Core Hot White Flame */}
              <path
                d="M80 34 C82 40, 86 48, 86 56 C86 62, 83 67, 80 67 C77 67, 74 62, 74 56 C74 48, 78 40, 80 34 Z"
                fill="#ffffff"
                opacity="0.95"
              />
            </g>

            {/* ── Cotton Wick ── */}
            <path
              d="M78 68 C79 64, 81 64, 82 68 L81 74 L79 74 Z"
              fill="#451a03"
            />

            {/* ── Diya Rim / Oil Reservoir ── */}
            <ellipse
              cx="80"
              cy="76"
              rx="46"
              ry="10"
              fill="url(#diyaRim)"
              stroke="#78350f"
              strokeWidth="0.8"
            />
            {/* Oil Pool Interior */}
            <ellipse
              cx="80"
              cy="76"
              rx="42"
              ry="7.5"
              fill="#92400e"
              opacity="0.9"
            />

            {/* ── Diya Bowl Body ── */}
            <path
              d="M34 76 C34 102, 54 122, 80 122 C106 122, 126 102, 126 76 C115 84, 98 88, 80 88 C62 88, 45 84, 34 76 Z"
              fill="url(#diyaGold)"
              stroke="#b45309"
              strokeWidth="1"
            />

            {/* Decorative Etched Patterns on Brass Bowl */}
            <path
              d="M48 88 Q80 102 112 88"
              stroke="#fef08a"
              strokeWidth="1.2"
              fill="none"
              opacity="0.75"
            />
            <path
              d="M56 98 Q80 110 104 98"
              stroke="#fbbf24"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
            <circle cx="80" cy="106" r="2.5" fill="#fef08a" />
            <circle cx="68" cy="101" r="2" fill="#fef08a" opacity="0.8" />
            <circle cx="92" cy="101" r="2" fill="#fef08a" opacity="0.8" />

            {/* ── Diya Pedestal Stand ── */}
            <path
              d="M66 122 L62 130 C62 133, 70 135, 80 135 C90 135, 98 133, 98 130 L94 122 Z"
              fill="url(#diyaBase)"
              stroke="#78350f"
              strokeWidth="0.8"
            />
          </svg>
        </div>

        {/* ── Primary Greeting Typography ── */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-400 drop-shadow-[0_4px_16px_rgba(245,158,11,0.35)] animate-in fade-in slide-in-from-bottom-3 duration-500">
          Happy Diwali from UrPass
        </h1>

        {/* Tagline */}
        <p className="mt-3 text-sm sm:text-lg font-medium text-amber-200/90 tracking-wide max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          Celebrate moments. Create memories.
        </p>

        {/* Secondary Subtext */}
        <p className="mt-1 text-xs sm:text-sm text-purple-300/70 font-normal">
          Empowering Indian events with lightning-fast digital check-ins
        </p>
      </div>
    </aside>
  );
}

