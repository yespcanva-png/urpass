import React from "react";
import { Ticket, ScanLine, Users, ShieldCheck, Zap } from "lucide-react";

export default function CareersAbout() {
  return (
    <section className="py-20 sm:py-28 bg-[#0e0c16] border-y border-white/5 relative">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Description Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-[11px] font-bold text-[#c4b5fd] tracking-widest uppercase">
              About Working at UrPass
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              We&apos;re building the <br className="hidden sm:inline" />
              <span className="text-[#a78bfa]">operating system</span> for modern events.
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              UrPass is an event technology platform engineered to make digital ticketing, attendee registration, and gate validation effortless. From intimate tech workshops and university hackathons to multi-thousand attendee international summits, our software powers the critical moments when people gather.
            </p>

            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              We believe event software should be lightning fast, beautifully designed, and bulletproof under pressure. When hundreds of attendees arrive simultaneously at an event gate, our offline-first QR scanning and sub-second pass validation ensure entry lines flow seamlessly.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8">
                <p className="text-xl sm:text-2xl font-bold text-white tabular-nums">&lt; 0.2s</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Gate Verification Speed</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8">
                <p className="text-xl sm:text-2xl font-bold text-white tabular-nums">100%</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Offline-First Scanner Sync</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8 col-span-2 sm:col-span-1">
                <p className="text-xl sm:text-2xl font-bold text-white tabular-nums">Bengaluru</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Headquarters &amp; Hub</p>
              </div>
            </div>
          </div>

          {/* Right Architecture / Product Cards */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/8 hover:border-purple-500/30 transition-colors">
              <div className="flex items-center gap-3.5 mb-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-[#c4b5fd]">
                  <Ticket className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Digital Pass Studio</h3>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Bespoke event passes with dynamic attendee tokens, personalized QR codes, Apple Wallet integration, and automated WhatsApp/email dispatch.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/8 hover:border-purple-500/30 transition-colors">
              <div className="flex items-center gap-3.5 mb-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-300">
                  <ScanLine className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Sub-Second Gate Check-In</h3>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Hardware-accelerated camera scanning that functions even when Wi-Fi drops, keeping festival and summit gates operating with zero delay.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/8 hover:border-purple-500/30 transition-colors">
              <div className="flex items-center gap-3.5 mb-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-sky-300">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Attendee &amp; Team Intelligence</h3>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Multi-seat organizational roles, real-time gate telemetry, cross-event analytics, and white-label pass customization.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
