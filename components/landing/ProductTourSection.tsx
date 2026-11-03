"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ClipboardCheck,
  Palette,
  Users,
  ScanLine,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";

interface TourStep {
  id: string;
  stepNumber: string;
  tabTitle: string;
  tabSubtitle: string;
  icon: typeof ClipboardCheck;
  headline: string;
  description: string;
  url: string;
  badge: string;
  imageSrc: string;
  imageAlt: string;
  keyFeatures: string[];
  metricLabel: string;
  metricValue: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "registration",
    stepNumber: "STEP 01",
    tabTitle: "1. Public Registration",
    tabSubtitle: "Custom form & instant UPI/card checkout",
    icon: ClipboardCheck,
    headline: "Create your event page & accept instant UPI registrations",
    description:
      "Share your unique event URL with attendees. Customize registration forms, set up tiered ticket categories (Early Bird, General, VIP), and collect payments via Google Pay, PhonePe, Paytm, UPI QR, and Cards with zero UrPass platform fees.",
    url: "urpass.space/apply/ai-summit-2026",
    badge: "Public Registration Page",
    imageSrc: "/screenshots/step1-event-registration.png",
    imageAlt: "UrPass Public Event Registration Page with Instant UPI Checkout and Ticket Tiers",
    keyFeatures: [
      "Custom questions, student ID & company fields",
      "Instant UPI QR & card payments with 0% platform fee",
      "Automatic digital pass dispatch to WhatsApp & Email",
    ],
    metricLabel: "Platform Commission",
    metricValue: "0% Fee",
  },
  {
    id: "ticket-studio",
    stepNumber: "STEP 02",
    tabTitle: "2. Pass Designer Studio",
    tabSubtitle: "Visual drag-and-drop ticket canvas",
    icon: Palette,
    headline: "Design gorgeous branded passes in Ticket Studio",
    description:
      "Use our full-screen pass studio to craft stunning digital tickets. Choose between mobile passes, conference badges, and thermal wristbands. Add holographic security foils, dynamic attendee names, custom sponsor logos, and encrypted QR codes.",
    url: "app.urpass.space/studio/pass-designer",
    badge: "Full-Screen Visual Studio",
    imageSrc: "/screenshots/step2-ticket-studio.png",
    imageAlt: "UrPass Ticket Studio Visual Designer with Live Mobile Pass Canvas and Holographic Security Foil",
    keyFeatures: [
      "Live canvas preview for Mobile, Badges & Thermal Prints",
      "Holographic security strips & anti-screenshot protections",
      "Dynamic merge fields for attendee name, tier & seat number",
    ],
    metricLabel: "Customization Freedom",
    metricValue: "100% Brandable",
  },
  {
    id: "dashboard",
    stepNumber: "STEP 03",
    tabTitle: "3. Organizer Command Center",
    tabSubtitle: "Live attendee manifest & gate analytics",
    icon: Users,
    headline: "Manage registrations, approvals & gate turnout in real time",
    description:
      "Keep full visibility over your event capacity. Approve or reject applicants with one click, search attendees instantly, track turnout percentage across all venue entrances, and export audit-ready CSV reports at any time.",
    url: "app.urpass.space/event/ai-summit-2026/attendees",
    badge: "Live Organizer Manifest",
    imageSrc: "/screenshots/step3-organizer-dashboard.png",
    imageAlt: "UrPass Organizer Command Center with Live Attendee Table, Real-Time Stats, and Filter Toolbar",
    keyFeatures: [
      "Real-time check-in stats & turnout percentage tracking",
      "1-click attendee approvals, rejections & VIP categorization",
      "Instant CSV export with timestamps & gate locations",
    ],
    metricLabel: "Live Gate Sync",
    metricValue: "4 Entrances Active",
  },
  {
    id: "scanner",
    stepNumber: "STEP 04",
    tabTitle: "4. Sub-Second QR Scanner",
    tabSubtitle: "0.28s camera verification with offline sync",
    icon: ScanLine,
    headline: "Sub-second camera scan check-in on any smartphone",
    description:
      "Your gate volunteers just open the camera scanner in any mobile browser — zero app installation required. Each QR pass verifies in under 0.3 seconds with glowing green alerts, audio feedback, anti-duplicate fraud blocks, and full offline caching.",
    url: "app.urpass.space/scanner/gate-1",
    badge: "Mobile Gate Scanner",
    imageSrc: "/screenshots/step4-qr-checkin-scanner.png",
    imageAlt: "UrPass Mobile Camera QR Scanner with 0.28s Sub-Second Green Verification and Anti-Duplicate Detection",
    keyFeatures: [
      "0.28-second cryptographic QR verification latency",
      "Anti-passback protection stops duplicate forwarded passes",
      "Works 100% offline if venue WiFi dips, auto-syncing later",
    ],
    metricLabel: "Scan Verification Speed",
    metricValue: "< 0.3 Seconds",
  },
];

export default function ProductTourSection() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = TOUR_STEPS[activeStepIndex];

  return (
    <section id="how-it-works" className="py-16 sm:py-28 px-4 sm:px-8 bg-neutral-950 text-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <AnimateIn>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-violet-500/10 text-violet-300 border border-violet-500/30 mb-3 shadow-2xs">
              <Sparkles className="w-3 h-3 text-violet-400" />
              ACTUAL PRODUCT PREVIEWS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              How to use UrPass from start to finish.
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-2xl mx-auto">
              See the actual screens our organizers use. From public registration with instant UPI payments to pass styling and sub-second QR entry at the gate.
            </p>
          </div>
        </AnimateIn>

        {/* 4 Step Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-10 sm:mb-12">
          {TOUR_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                  isActive
                    ? "bg-neutral-900 border-violet-500 shadow-lg shadow-violet-500/10 ring-1 ring-violet-500/50"
                    : "bg-neutral-900/50 border-neutral-800/80 hover:bg-neutral-900 hover:border-neutral-700 text-neutral-400"
                }`}
              >
                {/* Active progress indicator line */}
                {isActive && (
                  <span className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500" />
                )}
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-violet-600 text-white"
                        : "bg-neutral-800 text-neutral-400 group-hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-extrabold tracking-wider uppercase font-mono ${
                      isActive ? "text-violet-400" : "text-neutral-500"
                    }`}
                  >
                    {step.stepNumber}
                  </span>
                </div>
                <p
                  className={`text-xs sm:text-sm font-bold tracking-tight line-clamp-1 ${
                    isActive ? "text-white" : "text-neutral-300 group-hover:text-white"
                  }`}
                >
                  {step.tabTitle.replace(/^\d+\.\s*/, "")}
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1 hidden sm:block">
                  {step.tabSubtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase: Explainer + Realistic Browser Window Screenshot */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Step Description & Feature Bullets */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="font-mono text-xs font-extrabold tracking-wider text-violet-400 uppercase bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded">
                    {activeStep.stepNumber}
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">
                    {activeStep.badge}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-3">
                  {activeStep.headline}
                </h3>

                <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                  {activeStep.description}
                </p>

                {/* Bullets */}
                <ul className="space-y-3 mb-6">
                  {activeStep.keyFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metric Card & CTA */}
              <div className="pt-5 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                    {activeStep.metricLabel}
                  </p>
                  <p className="text-xl font-extrabold text-white mt-0.5">
                    {activeStep.metricValue}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-md"
                  >
                    <span>Try Free</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/contact?subject=Product%20Tour%20Question"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-400 hover:text-white transition-colors py-2"
                  >
                    <span>Ask a question</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Realistic Browser Frame with High-Res Screenshot */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl relative group">
                {/* Browser Top Navigation Chrome */}
                <div className="bg-neutral-950 px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>

                  <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800/80 px-3 py-1 rounded-md text-[11px] font-mono text-neutral-400 max-w-[280px] sm:max-w-sm truncate">
                    <span className="text-emerald-400 text-xs">🔒</span>
                    <span className="truncate">{activeStep.url}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-500 font-mono">
                    <span>100% SCALE</span>
                  </div>
                </div>

                {/* Screenshot Image Container */}
                <div className="relative aspect-[16/10.4] bg-neutral-950 overflow-hidden">
                  <Image
                    src={activeStep.imageSrc}
                    alt={activeStep.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 700px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.01]"
                    priority
                  />
                  {/* Subtle vignette on edges */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none rounded-b-xl" />
                </div>
              </div>

              {/* Caption pill below the image */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 px-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Interactive product preview · Captured from live UrPass build</span>
                </span>
                <span className="font-mono text-[10px] text-neutral-500">2400 × 1560 Retina</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step Progression Indicators */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {TOUR_STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStepIndex(i)}
              aria-label={`Go to step ${i + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === activeStepIndex ? "w-8 bg-violet-500" : "w-2 bg-neutral-800 hover:bg-neutral-700"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
