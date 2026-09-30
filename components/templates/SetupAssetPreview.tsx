"use client";

import React from "react";
import type { EventSetupTemplate } from "@/lib/templates/event-setups";
import { RealisticLanyardClip } from "./TicketVisualShowcase";
import {
  Calendar,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Users,
  Clock,
  Sparkles,
  Ticket,
} from "lucide-react";

interface SetupAssetPreviewProps {
  template: EventSetupTemplate;
  assetType?: "page" | "form" | "pass" | "badge";
  mode?: "card" | "full";
}

// Micro QR Pattern SVG
function MicroQRSVG({ fgColor = "#0F172A", size = 80 }: { fgColor?: string; size?: number }) {
  return (
    <div
      className="bg-white p-2 rounded-xl border border-neutral-200/90 shadow-2xs flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 21 21" fill={fgColor} className="w-full h-full">
        <rect x={0} y={0} width={7} height={7} />
        <rect x={1} y={1} width={5} height={5} fill="white" />
        <rect x={2} y={2} width={3} height={3} />
        <rect x={14} y={0} width={7} height={7} />
        <rect x={15} y={1} width={5} height={5} fill="white" />
        <rect x={16} y={2} width={3} height={3} />
        <rect x={0} y={14} width={7} height={7} />
        <rect x={1} y={15} width={5} height={5} fill="white" />
        <rect x={2} y={16} width={3} height={3} />
        <rect x={8} y={2} width={2} height={2} />
        <rect x={11} y={3} width={2} height={1} />
        <rect x={8} y={8} width={2} height={2} />
        <rect x={12} y={8} width={3} height={2} />
        <rect x={8} y={12} width={2} height={3} />
        <rect x={12} y={12} width={2} height={2} />
        <rect x={16} y={8} width={2} height={4} />
        <rect x={8} y={17} width={3} height={2} />
        <rect x={13} y={16} width={4} height={2} />
        <rect x={17} y={14} width={2} height={3} />
      </svg>
    </div>
  );
}

export default function SetupAssetPreview({
  template,
  assetType = "pass",
  mode = "full",
}: SetupAssetPreviewProps) {
  const isCard = mode === "card";

  // ─────────────────────────────────────────────────────────────
  // 1. EVENT LANDING PAGE PREVIEW
  // ─────────────────────────────────────────────────────────────
  if (assetType === "page") {
    return (
      <div
        className={`w-full bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-sm flex flex-col justify-between transition-all select-none ${
          isCard ? "h-[220px] p-3.5 text-xs" : "max-w-[420px] mx-auto p-5 text-sm"
        }`}
      >
        {/* Top Browser Bar */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neutral-300" />
            <span className="w-2 h-2 rounded-full bg-neutral-300" />
            <span className="w-2 h-2 rounded-full bg-neutral-300" />
          </div>
          <span className="text-[9px] font-mono text-neutral-400">
            urpass.space/e/{template.id}
          </span>
          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            LIVE
          </span>
        </div>

        {/* Hero Card Container */}
        <div className="space-y-2 flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
              {template.eventPage.badge}
            </span>
          </div>

          <h3
            className={`font-black text-neutral-900 leading-tight line-clamp-2 ${
              isCard ? "text-xs" : "text-base"
            }`}
          >
            {template.eventPage.heroTitle}
          </h3>

          <p
            className={`text-neutral-500 line-clamp-2 leading-relaxed ${
              isCard ? "text-[10px]" : "text-xs"
            }`}
          >
            {template.eventPage.heroSubtitle}
          </p>

          <div className="space-y-1 text-[10px] text-neutral-600 pt-1">
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3 h-3 text-neutral-400 shrink-0" />
              <span className="truncate">{template.eventPage.date}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
              <span className="truncate">{template.eventPage.venue}</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA Mock */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[9px] font-bold text-neutral-700">Instant QR Pass</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white font-bold text-[10px] shadow-2xs hover:bg-neutral-800 transition-colors"
          >
            Register Now →
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. REGISTRATION FORM PREVIEW
  // ─────────────────────────────────────────────────────────────
  if (assetType === "form") {
    return (
      <div
        className={`w-full bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-sm flex flex-col justify-between transition-all select-none ${
          isCard ? "h-[220px] p-3.5" : "max-w-[420px] mx-auto p-5"
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
            <span className="text-[10px] font-bold text-neutral-900 uppercase tracking-wider">
              {template.registrationForm.formTitle}
            </span>
            <span className="text-[9px] font-mono text-neutral-400">
              {template.registrationForm.fields.length} Fields
            </span>
          </div>

          <div className="space-y-2">
            {template.registrationForm.fields.slice(0, isCard ? 3 : 5).map((field, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-bold text-neutral-700">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                </div>
                <div className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200/80 text-[10px] text-neutral-400 truncate">
                  {field.placeholder}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <div className="w-full py-2 px-3 rounded-xl bg-neutral-900 text-white text-center font-bold text-xs shadow-2xs flex items-center justify-center gap-1.5">
            <span>{template.registrationForm.submitButtonText}</span>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3. DIGITAL QR PASS PREVIEW
  // ─────────────────────────────────────────────────────────────
  if (assetType === "pass") {
    return (
      <div
        className={`w-full bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-sm flex flex-col justify-between transition-all select-none ${
          isCard ? "h-[220px] p-3" : "max-w-[340px] mx-auto p-4"
        }`}
      >
        {/* Pass Top Header */}
        <div
          className="p-3 rounded-xl text-white flex items-center justify-between shrink-0"
          style={{ backgroundColor: template.accentColor }}
        >
          <div>
            <span className="text-[8px] font-extrabold tracking-widest uppercase opacity-80 block">
              {template.qrPass.tier}
            </span>
            <span className="text-xs font-bold leading-tight line-clamp-1">
              {template.name}
            </span>
          </div>
          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-white/20 border border-white/30">
            VALID
          </span>
        </div>

        {/* Notch separator if full */}
        {!isCard && (
          <div className="relative h-2.5 bg-white flex items-center my-0.5">
            <div className="absolute -left-5 w-4 h-4 rounded-full bg-neutral-100 border border-neutral-200" />
            <div className="absolute -right-5 w-4 h-4 rounded-full bg-neutral-100 border border-neutral-200" />
            <div className="w-full border-t border-dashed border-neutral-200 mx-1" />
          </div>
        )}

        {/* Pass Body with Attendee & QR */}
        <div className="flex items-center justify-between gap-3 py-1">
          <div className="min-w-0 pr-1 space-y-1">
            <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider block">
              PASS HOLDER
            </span>
            <p className="font-bold text-neutral-900 text-xs sm:text-sm truncate">
              {template.qrPass.attendeeName}
            </p>
            <p className="text-[10px] text-neutral-500 truncate">
              {template.qrPass.role}
            </p>
            <span className="inline-block text-[8px] font-mono font-bold bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded text-neutral-700">
              #{template.qrPass.qrToken}
            </span>
          </div>

          <MicroQRSVG fgColor={template.accentColor} size={isCard ? 65 : 85} />
        </div>

        {/* Status Strip */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[9px] text-neutral-500">
          <div className="flex items-center gap-1 font-medium truncate">
            <Clock className="w-3 h-3 text-neutral-400 shrink-0" />
            <span className="truncate">{template.qrPass.date}</span>
          </div>
          <span className="text-[8px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
            SUB-0.3s SCAN
          </span>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 4. REALISTIC EXECUTIVE LANYARD BADGE PREVIEW
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center w-full select-none">
      {/* Woven Strap & Metallic Clasp Assembly */}
      <RealisticLanyardClip
        strapColor={template.lanyardBadge.strapColor}
        accentLabel={template.lanyardBadge.strapLabel}
        clipColor={template.lanyardBadge.clipColor}
        isSmall={isCard}
      />

      {/* Physical Badge Card */}
      <div
        className={`w-full bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-md flex flex-col justify-between transition-all ${
          isCard ? "h-[195px] max-w-[210px] mx-auto text-center" : "max-w-[280px] mx-auto text-center"
        }`}
      >
        {/* Header Org Tag */}
        <div
          className="py-2 px-3 text-white text-center"
          style={{ backgroundColor: template.lanyardBadge.accessColor }}
        >
          <span className="text-[8px] font-extrabold tracking-widest uppercase block opacity-90">
            {template.lanyardBadge.strapLabel}
          </span>
          <span className="text-[10px] font-bold line-clamp-1">
            {template.name}
          </span>
        </div>

        {/* Hero Attendee Details */}
        <div className="p-3 flex flex-col items-center space-y-1.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-2xs"
            style={{ backgroundColor: template.lanyardBadge.accessColor }}
          >
            {template.lanyardBadge.attendeeName.charAt(0)}
          </div>

          <div>
            <h4 className="text-xs font-black text-neutral-900 leading-tight truncate max-w-[170px]">
              {template.lanyardBadge.attendeeName}
            </h4>
            <p className="text-[9px] text-neutral-500 truncate max-w-[170px]">
              {template.lanyardBadge.organization}
            </p>
          </div>

          <MicroQRSVG fgColor={template.lanyardBadge.accessColor} size={isCard ? 50 : 65} />
        </div>

        {/* Bottom High-Security Access Bar */}
        <div
          className="py-1.5 px-2 text-white text-[8px] font-black tracking-widest uppercase truncate shadow-2xs"
          style={{ backgroundColor: template.lanyardBadge.accessColor }}
        >
          {template.lanyardBadge.accessBarText}
        </div>
      </div>
    </div>
  );
}
