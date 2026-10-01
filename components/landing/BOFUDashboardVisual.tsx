"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  CreditCard,
  DoorOpen,
  QrCode,
  ScanLine,
  Smartphone,
  Ticket,
  Users,
  Zap,
} from "lucide-react";

interface BOFUDashboardVisualProps {
  currency?: "INR" | "GBP";
}

export default function BOFUDashboardVisual({
  currency = "INR",
}: BOFUDashboardVisualProps) {
  const isUk = currency === "GBP";
  const revenueDisplay = isUk ? "£28,950" : "₹4,82,500";

  const workflowSteps = [
    { name: "Registration", icon: Users, desc: "Custom fields & capacity locks" },
    { name: "Payment", icon: CreditCard, desc: isUk ? "Stripe / Apple Pay / Cards" : "Instant UPI & Razorpay" },
    { name: "Ticket", icon: Ticket, desc: "Anti-duplicate QR code pass" },
    { name: "WhatsApp", icon: Smartphone, desc: isUk ? "Apple Wallet & Email" : "Direct WhatsApp delivery" },
    { name: "QR Scan", icon: ScanLine, desc: "<0.3s phone browser scanning" },
    { name: "Attendance", icon: BarChart3, desc: "Real-time gate telemetry" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10">
      {/* Live Dashboard UI Visual */}
      <div className="bg-neutral-950 text-white rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Top Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                LIVE PRODUCTION EVENT
              </span>
              <h4 className="text-base font-bold text-white">Annual Tech & Cultural Summit 2026</h4>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300">
              Session: Gate Validation Active
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
              Synced
            </span>
          </div>
        </div>

        {/* The 4 Core Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* 1. Ticket Revenue */}
          <div className="bg-neutral-900/90 border border-neutral-800/90 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>Ticket Revenue</span>
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
              {revenueDisplay}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1.5 flex items-center gap-1">
              <span>100% kept · 0% commission</span>
            </div>
          </div>

          {/* 2. Tickets Sold */}
          <div className="bg-neutral-900/90 border border-neutral-800/90 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>Tickets Sold</span>
              <Ticket className="w-4 h-4 text-brand-300" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
              1,284
            </div>
            <div className="text-[11px] text-neutral-400 font-medium mt-1.5">
              100% capacity filled
            </div>
          </div>

          {/* 3. Checked In */}
          <div className="bg-neutral-900/90 border border-neutral-800/90 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>Checked In</span>
              <ScanLine className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
              943
            </div>
            <div className="text-[11px] text-neutral-400 font-medium mt-1.5">
              73.4% arrived · 0 dupes
            </div>
          </div>

          {/* 4. Active Gates */}
          <div className="bg-neutral-900/90 border border-neutral-800/90 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>Active Gates</span>
              <DoorOpen className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono tracking-tight">
              3
            </div>
            <div className="text-[11px] text-neutral-400 font-medium mt-1.5">
              All 3 scanners online
            </div>
          </div>
        </div>

        {/* Live Multi-Gate Scanner Activity Stream */}
        <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800/80 pb-3 mb-3">
            <span className="font-mono text-neutral-300 uppercase tracking-wider font-bold text-[11px]">
              Synchronized Multi-Gate Scan Stream
            </span>
            <span className="text-[11px] font-mono text-emerald-400">Latency: 28ms</span>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between bg-neutral-950/70 border border-neutral-800/60 rounded-xl p-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Gate 1 · Main North Entrance</span>
                <span className="hidden sm:inline text-neutral-400 text-[11px]">Priya Sharma (VIP Delegate)</span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-emerald-400 font-bold uppercase text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">
                  VALID &lt;0.3s
                </span>
                <span className="text-neutral-500 text-[10px]">10:14:02 AM</span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-neutral-950/70 border border-neutral-800/60 rounded-xl p-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Gate 2 · West Lawn Ramp</span>
                <span className="hidden sm:inline text-neutral-400 text-[11px]">Rahul Mehta (General Pass)</span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-emerald-400 font-bold uppercase text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">
                  VALID &lt;0.3s
                </span>
                <span className="text-neutral-500 text-[10px]">10:14:15 AM</span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-neutral-950/70 border border-neutral-800/60 rounded-xl p-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Gate 3 · Auditoria VIP Gate</span>
                <span className="hidden sm:inline text-neutral-400 text-[11px]">Ananya Deshmukh (Speaker Pass)</span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-emerald-400 font-bold uppercase text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">
                  VALID &lt;0.3s
                </span>
                <span className="text-neutral-500 text-[10px]">10:14:28 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* One Workflow Visual */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-brand">One Unified Workflow</span>
          <h3 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            From Registration to Door Entry
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Zero friction for organizers and attendees at every stage of the event lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.name}
                className="relative bg-neutral-50/80 rounded-2xl border border-neutral-200/70 p-4 flex flex-col justify-between hover:border-brand-300 hover:bg-brand-50/20 transition-all text-center group"
              >
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 font-bold block mb-2">
                    0{idx + 1}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center mx-auto mb-3 text-neutral-800 group-hover:text-brand transition-colors shadow-2xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-neutral-900 mb-1">{step.name}</h4>
                  <p className="text-[11px] text-neutral-500 leading-tight">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
