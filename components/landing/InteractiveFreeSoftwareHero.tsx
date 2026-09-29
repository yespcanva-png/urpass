"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  QrCode,
  ScanLine,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCw,
  Users,
  Clock,
  Ticket,
} from "lucide-react";

function SampleQRPattern({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 21 21" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x={0} y={0} width={7} height={7} />
      <rect x={1} y={1} width={5} height={5} fill="white" />
      <rect x={2} y={2} width={3} height={3} />
      <rect x={14} y={0} width={7} height={7} />
      <rect x={15} y={1} width={5} height={5} fill="white" />
      <rect x={16} y={2} width={3} height={3} />
      <rect x={0} y={14} width={7} height={7} />
      <rect x={1} y={15} width={5} height={5} fill="white" />
      <rect x={2} y={16} width={3} height={3} />
      <rect x={8} y={6} width={1} height={1} />
      <rect x={10} y={6} width={1} height={1} />
      <rect x={12} y={6} width={1} height={1} />
      <rect x={6} y={8} width={1} height={1} />
      <rect x={6} y={10} width={1} height={1} />
      <rect x={6} y={12} width={1} height={1} />
      <rect x={8} y={8} width={2} height={2} />
      <rect x={11} y={8} width={1} height={1} />
      <rect x={13} y={8} width={2} height={1} />
      <rect x={16} y={8} width={2} height={2} />
      <rect x={19} y={8} width={2} height={1} />
      <rect x={8} y={11} width={1} height={2} />
      <rect x={10} y={11} width={3} height={1} />
      <rect x={14} y={11} width={1} height={1} />
      <rect x={16} y={11} width={2} height={1} />
      <rect x={19} y={11} width={2} height={2} />
      <rect x={8} y={13} width={3} height={1} />
      <rect x={12} y={13} width={2} height={1} />
      <rect x={15} y={13} width={1} height={1} />
      <rect x={8} y={7} width={1} height={1} />
      <rect x={10} y={7} width={2} height={1} />
      <rect x={13} y={7} width={1} height={1} />
      <rect x={7} y={14} width={1} height={1} />
      <rect x={9} y={14} width={2} height={2} />
      <rect x={12} y={14} width={1} height={1} />
      <rect x={14} y={14} width={3} height={1} />
      <rect x={18} y={14} width={1} height={1} />
      <rect x={20} y={14} width={1} height={1} />
      <rect x={7} y={16} width={2} height={1} />
      <rect x={10} y={16} width={1} height={1} />
      <rect x={12} y={16} width={3} height={2} />
      <rect x={16} y={16} width={1} height={1} />
      <rect x={18} y={16} width={3} height={1} />
      <rect x={7} y={18} width={3} height={1} />
      <rect x={11} y={18} width={2} height={1} />
      <rect x={14} y={18} width={1} height={2} />
      <rect x={16} y={18} width={2} height={1} />
      <rect x={19} y={18} width={2} height={1} />
      <rect x={7} y={20} width={1} height={1} />
      <rect x={9} y={20} width={2} height={1} />
      <rect x={12} y={20} width={1} height={1} />
      <rect x={15} y={20} width={1} height={1} />
      <rect x={17} y={20} width={4} height={1} />
    </svg>
  );
}

export default function InteractiveFreeSoftwareHero() {
  const [attendeeName, setAttendeeName] = useState("Arjun Sharma");
  const [ticketType, setTicketType] = useState("VIP Delegate");
  const [eventTitle, setEventTitle] = useState("India Tech & Innovation Summit");
  const [scanState, setScanState] = useState<"idle" | "scanning" | "validated">("idle");
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const triggerScanSimulation = () => {
    if (scanState === "scanning") return;
    setScanState("scanning");

    // Play subtle audio confirmation chime using Web Audio API if available
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch {
      // Audio autoplay gracefully suppressed
    }

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setCheckInTime(timeStr);
      setScanState("validated");
    }, 450);
  };

  const resetScan = () => {
    setScanState("idle");
    setCheckInTime(null);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      {/* Hero Headline & Direct Proposition */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold tracking-wide mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>PERMANENT FREE TIER · ZERO PLATFORM FEES</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.08] mb-6">
          Free Event Registration Software With QR Check-In
        </h1>

        <p className="text-xl sm:text-2xl font-medium text-neutral-800 tracking-tight mb-4">
          Create. Share. Scan.
        </p>

        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-8">
          The simplest free event software for college fests, workshops, hackathons and meetups. Launch in 2 minutes with automated digital QR passes and instant phone camera scanning.
        </p>

        {/* Primary High-Conversion CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-base px-8 py-4 rounded-xl shadow-lg shadow-neutral-900/10 hover:shadow-neutral-900/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Create My Event Free</span>
            <ArrowRight className="w-4 h-4 text-neutral-300" />
          </Link>
          <a
            href="#live-preview"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-neutral-700 font-medium text-sm px-6 py-4 rounded-xl border border-neutral-200 transition-colors shadow-xs"
          >
            <ScanLine className="w-4 h-4 text-neutral-500" />
            <span>Try Interactive Scanner</span>
          </a>
        </div>

        {/* Unbeatable Microcopy */}
        <p className="mt-4 text-xs sm:text-sm font-semibold text-neutral-500 tracking-wide">
          ₹0 to start · No credit card · QR passes included
        </p>
      </div>

      {/* 3-in-1 Interactive Live Preview Section */}
      <div id="live-preview" className="relative scroll-mt-24">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-100/40 via-purple-100/30 to-emerald-100/40 blur-3xl -z-10 rounded-3xl" />

        <div className="bg-white/95 backdrop-blur-md border border-neutral-200/90 rounded-3xl shadow-xl p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
                  Live Interactive Product Simulation
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Customize attendee details on the left, watch the digital pass update in real-time, then tap the scanner button to simulate gate validation.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto bg-neutral-100/80 px-3 py-1.5 rounded-lg border border-neutral-200/60 text-xs font-medium text-neutral-600">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>0.28s In-Browser Scan Engine</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 1. Form Builder Preview (4 Cols) */}
            <div className="lg:col-span-4 bg-neutral-50/70 border border-neutral-200/80 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-neutral-400" />
                  1. Registration Form
                </span>
                <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Instant Link
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="Enter event name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Attendee Name
                  </label>
                  <input
                    type="text"
                    value={attendeeName}
                    onChange={(e) => setAttendeeName(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="e.g. Priya Sharma"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Pass Type
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["VIP Delegate", "General Pass", "Student Pass"] as const).map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setTicketType(tier)}
                        className={`text-[11px] py-1.5 px-2 rounded-lg font-medium border transition-colors ${
                          ticketType === tier
                            ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                            : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                        }`}
                      >
                        {tier.replace(" Pass", "")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200/60 text-[11px] text-neutral-500 leading-tight">
                  <span className="font-semibold text-neutral-700">Form Features:</span> Custom questions, College ID upload, Phone OTP, Capacity caps, and CSV export.
                </div>
              </div>
            </div>

            {/* 2. Live Generated Digital Pass Ticket Mockup (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 text-neutral-400" />
                  2. Generated QR Pass
                </span>
                <span className="text-[11px] font-medium text-brand-600 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
                  Auto-Issued
                </span>
              </div>

              {/* Physical-style Pass Card */}
              <div className="w-full max-w-[320px] bg-white border-2 border-neutral-900 rounded-2xl shadow-xl overflow-hidden relative transition-all duration-300">
                {/* Header banner */}
                <div className="bg-neutral-900 text-white p-4">
                  <div className="flex items-center justify-between text-[11px] text-neutral-300 mb-1 font-mono uppercase tracking-wider">
                    <span>URPASS SECURE TICKET</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white line-clamp-1">
                    {eventTitle || "URPASS Event"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
                    <Clock className="w-3 h-3" />
                    <span>Gate Opens 09:00 AM · Hall A</span>
                  </div>
                </div>

                {/* Perforated divider with notch circles */}
                <div className="relative py-2 bg-neutral-50 border-y border-dashed border-neutral-300 flex items-center justify-between px-3">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-r-2 border-neutral-900 rounded-full" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-l-2 border-neutral-900 rounded-full" />
                  <span className="text-[10px] font-mono text-neutral-400 tracking-wider pl-4">
                    PASS-REF: #UP-2026-X89
                  </span>
                  <span className="text-[10px] font-bold text-neutral-700 bg-neutral-200/80 px-2 py-0.5 rounded pr-2">
                    {ticketType}
                  </span>
                </div>

                {/* Body & QR Pattern */}
                <div className="p-5 flex flex-col items-center text-center bg-white">
                  <div className="relative p-3 bg-neutral-50 border border-neutral-200 rounded-xl mb-3 shadow-inner">
                    <SampleQRPattern className="w-32 h-32 text-neutral-900" />
                    {scanState === "scanning" && (
                      <div className="absolute inset-0 bg-brand-500/20 border-2 border-brand-500 rounded-xl flex items-center justify-center animate-pulse">
                        <ScanLine className="w-8 h-8 text-brand-600 animate-bounce" />
                      </div>
                    )}
                    {scanState === "validated" && (
                      <div className="absolute inset-0 bg-emerald-600/90 rounded-xl flex flex-col items-center justify-center text-white backdrop-blur-[1px] animate-in fade-in zoom-in duration-200">
                        <CheckCircle2 className="w-10 h-10 text-white mb-1" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">CHECKED IN</span>
                      </div>
                    )}
                  </div>

                  <div className="w-full">
                    <div className="text-base font-extrabold text-neutral-900 truncate">
                      {attendeeName || "Attendee Name"}
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      Valid for 1 Entry · Single Admission
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Live Check-in Scanner Simulation (4 Cols) */}
            <div className="lg:col-span-4 bg-neutral-900 text-white border border-neutral-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-neutral-300" />
                    3. Gate Scanner Simulation
                  </span>
                  <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
                    Web Camera
                  </span>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                    <span>Scanner Status</span>
                    <span className="text-emerald-400 font-mono font-medium">Ready (0.28s)</span>
                  </div>

                  {scanState === "idle" && (
                    <div className="py-6 text-center">
                      <div className="w-12 h-12 mx-auto rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-3 text-neutral-300">
                        <QrCode className="w-6 h-6" />
                      </div>
                      <p className="text-xs text-neutral-300 font-medium">
                        Camera Ready · Point at badge
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        Works on Chrome, Safari, iOS & Android without installing apps
                      </p>
                    </div>
                  )}

                  {scanState === "scanning" && (
                    <div className="py-6 text-center">
                      <div className="w-12 h-12 mx-auto rounded-full bg-brand-900/50 border border-brand-500 flex items-center justify-center mb-3 text-brand-400 animate-spin">
                        <ScanLine className="w-6 h-6" />
                      </div>
                      <p className="text-xs text-brand-300 font-mono font-bold animate-pulse">
                        Scanning & Validating Signature...
                      </p>
                    </div>
                  )}

                  {scanState === "validated" && (
                    <div className="py-4 text-center animate-in fade-in duration-200">
                      <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mb-2.5 text-emerald-400">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <div className="text-sm font-bold text-white mb-1">
                        PASS VALIDATED
                      </div>
                      <div className="text-xs text-emerald-400 font-mono font-medium">
                        Seat Confirmed · Check-In Logged
                      </div>
                      <div className="mt-3 pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 font-mono flex justify-between">
                        <span>Time: {checkInTime}</span>
                        <span className="text-emerald-400">Gate: 01-A</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {scanState === "idle" ? (
                  <button
                    type="button"
                    onClick={triggerScanSimulation}
                    className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <ScanLine className="w-4 h-4" />
                    <span>Tap to Simulate Scan (0.28s)</span>
                  </button>
                ) : scanState === "scanning" ? (
                  <button
                    disabled
                    className="w-full py-3 px-4 bg-neutral-800 text-neutral-400 font-bold text-xs uppercase tracking-wider rounded-xl cursor-wait flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Validating Pass...</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetScan}
                    className="w-full py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset & Test Another Attendee</span>
                  </button>
                )}

                <div className="text-center">
                  <span className="text-[10px] text-neutral-500 font-mono">
                    Detects duplicate scans instantly · Blocks re-entry
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
