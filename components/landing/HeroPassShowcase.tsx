"use client";

import { Zap, ShieldCheck, CreditCard, Sparkles, CheckCircle2 } from "lucide-react";

function QRPattern({ className }: { className?: string }) {
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

export default function HeroPassShowcase() {
  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[380px] mx-auto select-none py-6">
      {/* Background ambient glow behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-tr from-brand-600/15 via-purple-400/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Floating Satellite Chip 1: Top-Right (Scan Speed) */}
      <div className="hidden sm:flex absolute -top-1 -right-6 z-20 items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] animate-float">
        <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200/70 flex items-center justify-center shrink-0">
          <Zap className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-neutral-900 leading-none">0.28s Gate Scan</span>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
          </div>
          <span className="text-[9px] text-neutral-500 font-medium">Zero-lag entry</span>
        </div>
      </div>

      {/* Floating Satellite Chip 2: Bottom-Left (Razorpay / Multi-currency) */}
      <div className="hidden sm:flex absolute -bottom-3 -left-6 z-20 items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] animate-float-delayed">
        <div className="w-6 h-6 rounded-lg bg-brand-50 border border-brand-200/70 flex items-center justify-center shrink-0">
          <CreditCard className="w-3.5 h-3.5 text-brand" />
        </div>
        <div className="text-left">
          <span className="text-[11px] font-bold text-neutral-900 leading-none block">Razorpay Direct</span>
          <span className="text-[9px] text-neutral-500 font-medium">0% Ticket Commission</span>
        </div>
      </div>

      {/* Main Luxury Pass Card */}
      <div className="relative bg-white rounded-3xl border border-neutral-200/90 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.12),0_4px_16px_rgba(109,40,217,0.06)] overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
        {/* Holographic foil top strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-brand via-purple-400 via-pink-400 to-amber-300" />

        {/* Executive Header */}
        <div className="bg-gradient-to-b from-neutral-950 to-neutral-900 px-5 sm:px-6 py-4 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand flex items-center justify-center shadow-xs">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-widest uppercase text-white leading-none">URPASS</span>
              <span className="text-[8px] font-semibold text-neutral-400 tracking-wider uppercase mt-0.5">VIP Credential</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>0.28s VERIFIED</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-white via-neutral-50/50 to-white">
          {/* Event Info */}
          <div className="mb-4">
            <span className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">OFFICIAL EVENT PASS</span>
            <h3 className="font-bold text-lg sm:text-xl text-neutral-900 leading-snug tracking-tight mt-0.5">
              Global Tech Summit 2026
            </h3>
            <p className="text-[11px] text-neutral-500 font-medium mt-0.5">Exhibition Center · Main Hall</p>
          </div>

          {/* Ticket Notch & Perforation Line */}
          <div className="relative flex items-center my-4">
            <div className="w-5 h-5 rounded-full bg-neutral-100 -ml-8 shrink-0 border-r border-neutral-200/80 shadow-inner" />
            <div className="flex-1 border-t border-dashed border-neutral-300 mx-2" />
            <div className="w-5 h-5 rounded-full bg-neutral-100 -mr-8 shrink-0 border-l border-neutral-200/80 shadow-inner" />
          </div>

          {/* Attendee Details */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase block">ATTENDEE</span>
              <p className="font-semibold text-sm sm:text-base text-neutral-900">Srinithin S</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase block">STATUS</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-md mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                ADMITTED
              </span>
            </div>
          </div>

          {/* High-res QR code with animated laser scan beam */}
          <div className="relative flex flex-col items-center justify-center p-4 bg-white border border-neutral-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32">
              <QRPattern className="w-full h-full text-neutral-900" />
              {/* Laser beam sweep overlay */}
              <div
                className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#34d399] pointer-events-none"
                style={{ animation: "scanBeam 3s ease-in-out infinite" }}
              />
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[9px] text-neutral-500 font-mono tracking-wider">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>CRYPTOGRAPHIC DYNAMIC QR</span>
            </div>
          </div>

          {/* Gate Verification Telemetry Footer */}
          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-500 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Gate 01 Check-In: 09:41 AM
            </span>
            <span className="font-mono text-neutral-400">ID: URP-84920</span>
          </div>
        </div>
      </div>
    </div>
  );
}
