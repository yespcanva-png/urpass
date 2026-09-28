"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Crown, Star, X, CalendarCheck, ShieldCheck, Ticket } from "lucide-react";

interface Particle {
  id: number;
  tx: string;
  ty: string;
  size: number;
  color: string;
  duration: number;
  delay: number;
  top: string;
  left: string;
}

const COLORS = [
  "#F59E0B", "#FCD34D", "#FDE68A", "#FBBF24",
  "#F97316", "#ffffff", "#FEF3C7", "#D97706",
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function generateParticles(): Particle[] {
  return Array.from({ length: 28 }, (_, i) => {
    const angle = (i / 28) * 360 + randomBetween(-8, 8);
    const rad = (angle * Math.PI) / 180;
    const distance = randomBetween(120, 280);
    return {
      id: i,
      tx: `${Math.cos(rad) * distance}px`,
      ty: `${Math.sin(rad) * distance}px`,
      size: randomBetween(5, 12),
      color: COLORS[i % COLORS.length],
      duration: randomBetween(700, 1300),
      delay: randomBetween(0, 180),
      top: "50%",
      left: "50%",
    };
  });
}

export default function UpgradeCelebration() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const isUpgraded = searchParams.get("upgraded") === "true";
  const isTrialActivated =
    searchParams.get("trial_activated") === "true" ||
    searchParams.get("activated") === "true";
  const isFounderClaimed =
    searchParams.get("claim") === "success" ||
    searchParams.get("founder") === "claimed";
  const isPassPurchased = searchParams.get("pass") === "purchased";

  const showCelebration =
    isUpgraded || isTrialActivated || isFounderClaimed || isPassPurchased;

  const planParam = searchParams.get("plan");
  const planName = planParam
    ? planParam
    : isFounderClaimed
    ? "Founder Lifetime"
    : isPassPurchased
    ? "Event"
    : "Pro";

  const [exiting, setExiting] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const [particles] = useState<Particle[]>(generateParticles);

  function handleDismiss() {
    setDismissed(true);
    router.replace("/billing", { scroll: false });
  }

  useEffect(() => {
    if (!showCelebration || dismissed) return;

    const exitT = setTimeout(() => setExiting(true), 3200);
    const hideT = setTimeout(() => {
      setDismissed(true);
      router.replace("/billing", { scroll: false });
    }, 3900);

    return () => {
      clearTimeout(exitT);
      clearTimeout(hideT);
    };
  }, [showCelebration, dismissed, router]);

  if (!showCelebration || dismissed) return null;

  // Determine context-specific messaging
  let badgeText = "PLAN UPGRADED";
  let titleText = `${planName} unlocked`;
  let descText = `Welcome to ${planName}. Your new limits are active.`;
  let MainIcon = Crown;

  if (isFounderClaimed) {
    badgeText = "FOUNDER LIFETIME ACTIVE";
    titleText = "Founder Access Unlocked";
    descText = "Permanent operational access granted with term 2125 and zero recurring fees.";
    MainIcon = ShieldCheck;
  } else if (isPassPurchased) {
    badgeText = "EVENT PASS ACTIVE";
    titleText = `${planName} Pass Unlocked`;
    descText = "Your single event quota is credited and ready to attach to any event.";
    MainIcon = CalendarCheck;
  } else if (isTrialActivated) {
    badgeText = "30-DAY FREE TRIAL ACTIVE";
    titleText = `${planName} Trial Unlocked`;
    descText = `Welcome to ${planName}! Enjoy 30 days of full access without charge.`;
    MainIcon = Crown;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: exiting ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.75)",
        backdropFilter: exiting ? "blur(0px)" : "blur(6px)",
        transition: "background 0.5s ease, backdrop-filter 0.5s ease",
      }}
    >
      {[0, 150, 300].map((delay) => (
        <div
          key={delay}
          className="absolute rounded-full border pointer-events-none"
          style={{
            width: 80,
            height: 80,
            top: "50%",
            left: "50%",
            borderColor: "rgba(245, 158, 11, 0.6)",
            animation: `ring-expand 1.2s cubic-bezier(0.2, 0, 0.8, 1) ${delay}ms both`,
          }}
        />
      ))}

      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            marginTop: -p.size / 2,
            marginLeft: -p.size / 2,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}80`,
            "--tx": p.tx,
            "--ty": p.ty,
            animation: `particle-fly ${p.duration}ms cubic-bezier(0.2, 0, 0.6, 1) ${p.delay}ms both`,
          } as React.CSSProperties}
        />
      ))}

      <div
        className="relative flex flex-col items-center gap-6 px-8 py-9 sm:px-10 sm:py-10 rounded-3xl mx-4 max-w-sm w-full"
        style={{
          background: "linear-gradient(145deg, #1c1917 0%, #292524 100%)",
          border: "1px solid rgba(245,158,11,0.35)",
          boxShadow:
            "0 0 80px rgba(245,158,11,0.2), 0 0 160px rgba(245,158,11,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
          animation: exiting
            ? "pro-card-out 0.5s cubic-bezier(0.4, 0, 1, 1) both"
            : "pro-card-in 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both",
        }}
      >
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          aria-label="Close"
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors border border-neutral-700/60"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div
          className="absolute inset-0 rounded-3xl pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 50% at 50% 0%, #F59E0B, transparent)",
          }}
        />

        <div
          className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #F59E0B, #B45309)",
            boxShadow:
              "0 0 40px rgba(245,158,11,0.5), 0 0 80px rgba(245,158,11,0.2)",
          }}
        >
          <MainIcon className="w-9 h-9 sm:w-10 sm:h-10 text-white" />
        </div>

        <div className="relative text-center flex flex-col items-center gap-2">
          <p
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: "#F59E0B" }}
          >
            {badgeText}
          </p>
          <div className="flex items-center gap-2">
            <Star
              className="w-4 h-4 shrink-0"
              style={{
                color: "#F59E0B",
                animation: "star-spin 2s linear infinite",
              }}
            />
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase text-center">
              {titleText}
            </span>
            <Star
              className="w-4 h-4 shrink-0"
              style={{
                color: "#F59E0B",
                animation: "star-spin 2s linear infinite 1s",
              }}
            />
          </div>
          <p className="text-xs text-white/50 leading-relaxed mt-1 max-w-xs">
            {descText}
          </p>
        </div>

        <div
          className="relative flex items-center gap-2 px-5 py-2 rounded-full border shadow-xs"
          style={{
            background: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
            borderColor: "#F59E0B40",
          }}
        >
          <MainIcon className="w-3.5 h-3.5 text-amber-800" />
          <span className="text-xs font-black tracking-widest uppercase text-amber-800">
            {planName}
          </span>
        </div>
      </div>
    </div>
  );
}
