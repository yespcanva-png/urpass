"use client";

import { useState, useRef } from "react";
import {
  Sparkles,
  Upload,
  X,
  RotateCcw,
  Building,
  Calendar,
  MapPin,
  Type,
  Image as ImageIcon,
  Check,
} from "lucide-react";

export interface CustomBrandData {
  eventName: string;
  hostName: string;
  venue: string;
  date: string;
  logoUrl?: string;
}

interface Props {
  brandData: CustomBrandData;
  onChange: (updated: CustomBrandData) => void;
  onReset: () => void;
}

const PRESETS = [
  {
    label: "College Fest",
    eventName: "DHVANI ANNUAL FEST 2026",
    hostName: "PSG College of Technology",
    venue: "Main Campus Amphitheatre",
    date: "24 OCT 2026 · 09:30 AM",
  },
  {
    label: "Hackathon",
    eventName: "CYBERHACK 36-HOUR SPRINT",
    hostName: "DevClub & Google Developer Groups",
    venue: "Innovation & AI Labs, Block C",
    date: "14 NOV 2026 · GATES OPEN 08:00 AM",
  },
  {
    label: "Concert",
    eventName: "NEON HORIZON WORLD TOUR",
    hostName: "Sunburn & Live Nation",
    venue: "JLN Stadium, Arena Ground",
    date: "05 DEC 2026 · 06:00 PM",
  },
  {
    label: "Tech Summit",
    eventName: "GLOBAL AI & CLOUD FORUM",
    hostName: "Stripe & Tech Innovators",
    venue: "The Leela Palace, Bengaluru",
    date: "18 NOV 2026 · 10:00 AM",
  },
];

export default function LivePassCustomizerToolbar({
  brandData,
  onChange,
  onReset,
}: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid PNG or JPEG image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChange({ ...brandData, logoUrl: result });
      }
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveLogo() {
    onChange({ ...brandData, logoUrl: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function applyPreset(preset: (typeof PRESETS)[number]) {
    onChange({
      ...brandData,
      eventName: preset.eventName,
      hostName: preset.hostName,
      venue: preset.venue,
      date: preset.date,
    });
  }

  return (
    <div className="w-full bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-neutral-950 via-neutral-900 to-violet-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-2">
              <span>Brand Passes in Real-Time</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold uppercase tracking-wider text-amber-200">
                Live Preview
              </span>
            </h3>
            <p className="text-[11px] text-neutral-300">
              Type your event details or upload a logo to see all 12 pass designs update instantly.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Presets Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p)}
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer border border-white/10"
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onReset}
            title="Reset to defaults"
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Input Controls Grid */}
      <div className="p-4 sm:p-6 bg-neutral-50/70 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Event Name */}
        <div className="space-y-1.5">
          <label className="font-bold text-neutral-700 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-violet-600" />
            <span>Event Name</span>
          </label>
          <input
            type="text"
            value={brandData.eventName}
            onChange={(e) => onChange({ ...brandData, eventName: e.target.value })}
            placeholder="e.g. DHVANI 2026 FESTIVAL"
            className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 shadow-2xs"
          />
        </div>

        {/* Host / College / Organization */}
        <div className="space-y-1.5">
          <label className="font-bold text-neutral-700 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-violet-600" />
            <span>Host / College Name</span>
          </label>
          <input
            type="text"
            value={brandData.hostName}
            onChange={(e) => onChange({ ...brandData, hostName: e.target.value })}
            placeholder="e.g. PSG College of Technology"
            className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 shadow-2xs"
          />
        </div>

        {/* Venue & Location */}
        <div className="space-y-1.5">
          <label className="font-bold text-neutral-700 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-violet-600" />
            <span>Venue & City</span>
          </label>
          <input
            type="text"
            value={brandData.venue}
            onChange={(e) => onChange({ ...brandData, venue: e.target.value })}
            placeholder="e.g. Main Auditorium, Chennai"
            className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 shadow-2xs"
          />
        </div>

        {/* Logo Upload Box */}
        <div className="space-y-1.5">
          <label className="font-bold text-neutral-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-violet-600" />
              <span>Event / Club Logo</span>
            </span>
            {brandData.logoUrl && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="text-[10px] text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
              >
                Remove
              </button>
            )}
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleLogoUpload}
            className="hidden"
          />

          {brandData.logoUrl ? (
            <div className="flex items-center gap-2 p-1.5 rounded-xl border border-emerald-300 bg-emerald-50/80 shadow-2xs">
              <img
                src={brandData.logoUrl}
                alt="Uploaded Logo"
                className="w-7 h-7 rounded-lg object-contain bg-white border border-emerald-200 p-0.5"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold text-emerald-900 truncate block">
                  Custom Logo Active
                </span>
              </div>
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mr-1" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 rounded-xl border border-dashed border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-600 font-semibold text-[11px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-violet-600" />
              <span>Upload Club / Event Logo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
