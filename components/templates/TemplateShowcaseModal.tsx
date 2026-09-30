"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { StudioTemplateDefinition } from "@/lib/studio/templates";
import { SINGLE_TEMPLATE_PRICE_INR, ALL_ACCESS_BUNDLE_PRICE_INR } from "@/lib/studio/templates";
import TicketVisualShowcase from "./TicketVisualShowcase";
import {
  X,
  Sparkles,
  Zap,
  CheckCircle2,
  ScanLine,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Ticket,
  CreditCard,
  Printer,
  Maximize2,
  Lock,
  LogIn,
  UserCheck,
  RefreshCw,
} from "lucide-react";

interface TemplateShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: StudioTemplateDefinition | null;
  isUnlocked: boolean;
  isAuthenticated: boolean;
  userEmail?: string;
  onUnlockClick: (template: StudioTemplateDefinition) => void;
  onUnlockBundleClick: () => void;
}

export default function TemplateShowcaseModal({
  isOpen,
  onClose,
  template,
  isUnlocked,
  isAuthenticated,
  userEmail,
  onUnlockClick,
  onUnlockBundleClick,
}: TemplateShowcaseModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"preview" | "scanner" | "specs">("preview");
  const [sampleAttendeeIndex, setSampleAttendeeIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const sampleAttendees = [
    { name: "ARJUN KUMAR", role: "VIP ACCESS", zone: "ZONE A • FRONT ROW" },
    { name: "DR. ROHAN MEHTA", role: "SPEAKER • KEYNOTE", zone: "STAGE VIP ACCESS" },
    { name: "ANANYA RAMESH", role: "STUDENT DELEGATE", zone: "CAMPUS ENTRY" },
    { name: "SARAH CHEN", role: "ALL ACCESS CREW", zone: "BACKSTAGE & LOUNGE" },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setScanSuccess(false);
      setIsScanning(false);
      setShowAuthPrompt(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !template) return null;

  const isFree = template.tier !== "paid";
  const currentAttendee = sampleAttendees[sampleAttendeeIndex];

  function handleTriggerScan() {
    setIsScanning(true);
    setScanSuccess(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
    }, 900);
  }

  function handleUnlockAction() {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    onUnlockClick(template!);
  }

  function handleUnlockBundleAction() {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    onUnlockBundleClick();
  }

  function getFormatLabel(format: string) {
    switch (format) {
      case "printable":
        return {
          title: "Printable Stub Ticket",
          subtitle: "780×340px · 300 DPI Perforated Paper & PDF",
          icon: Ticket,
        };
      case "badge":
        return {
          title: "Conference Lanyard Badge",
          subtitle: "440×640px · PVC Slot Punch & Lanyard Ready",
          icon: CreditCard,
        };
      case "digital":
      default:
        return {
          title: "Digital Mobile Pass",
          subtitle: "380×680px · Apple Wallet & Smartphone Screen",
          icon: Smartphone,
        };
    }
  }

  const formatInfo = getFormatLabel(template.format);
  const FormatIcon = formatInfo.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-neutral-950 text-white flex items-center justify-between border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-600/30 text-violet-300 border border-violet-500/30">
              <FormatIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  {template.name}
                </h3>
                {isFree ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
                    FREE
                  </span>
                ) : isUnlocked ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    UNLOCKED
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-300" />
                    ₹{template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {formatInfo.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content: 2-Column Split */}
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col md:flex-row">
          {/* Left Column: Photorealistic Ticket Presentation */}
          <div className="flex-1 bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden select-none min-h-[380px]">
            {/* Background Ambient Glow */}
            <div
              className="absolute w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: template.thumbnailBg === "#FFFFFF" ? "#6366F1" : template.thumbnailBg }}
            />

            {/* Scan Simulation Success Banner */}
            {scanSuccess && (
              <div className="absolute top-4 inset-x-4 z-30 flex justify-center animate-in slide-in-from-top-2 duration-300">
                <div className="px-4 py-2 rounded-2xl bg-emerald-500 text-white text-xs font-black flex items-center gap-2 shadow-2xl border border-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>VALID PASS &middot; VERIFIED IN 0.18s</span>
                </div>
              </div>
            )}

            {/* Ticket Graphic Render */}
            <div className="relative z-10 w-full flex items-center justify-center">
              <TicketVisualShowcase
                template={template}
                mode="showcase"
                customAttendeeName={currentAttendee.name}
                showScanSimulation={isScanning}
              />
            </div>

            {/* Interactive Preview Switcher Toolbar */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 relative z-10">
              <button
                type="button"
                onClick={() =>
                  setSampleAttendeeIndex((prev) => (prev + 1) % sampleAttendees.length)
                }
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Switch Attendee ({currentAttendee.name.split(" ")[0]})</span>
              </button>

              <button
                type="button"
                onClick={handleTriggerScan}
                disabled={isScanning}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-emerald-500/30 disabled:opacity-50"
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>Test Camera Scan</span>
              </button>
            </div>
          </div>

          {/* Right Column: Template Specifications & 1-Click Actions */}
          <div className="w-full md:w-[380px] p-6 flex flex-col justify-between space-y-6 bg-white shrink-0">
            <div className="space-y-5">
              {/* Auth Prompt Alert if user tried to pay unauthenticated */}
              {showAuthPrompt && !isAuthenticated && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-800">
                    <Lock className="w-4 h-4 text-amber-600" />
                    Account Required to Unlock
                  </div>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Please log in or create a free organizer account so your purchased template is permanently saved to your profile across all devices.
                  </p>
                  <div className="pt-1 flex gap-2">
                    <Link
                      href={`/login?returnTo=/dashboard/templates`}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs text-center transition-all shadow-xs"
                    >
                      Sign In
                    </Link>
                    <Link
                      href={`/signup?returnTo=/dashboard/templates`}
                      className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs text-center transition-all"
                    >
                      Sign Up Free
                    </Link>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                  Design Specifications
                </span>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {template.description}
                </p>
              </div>

              {/* Features List */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block">
                  Included Capabilities
                </span>
                <div className="space-y-2 text-xs text-neutral-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Sub-0.3s camera QR gate validation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Dynamic attendee name, seat & ticket tier</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Custom brand logo & hex accent color override</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Full commercial license for unlimited events</span>
                  </div>
                </div>
              </div>

              {/* Compatible Hardware Scanners */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block">
                  Gate Hardware Compatibility
                </span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className="px-2 py-0.5 rounded-lg bg-neutral-100 text-neutral-700 text-[10px] font-medium">
                    Phone Browsers (Safari / Chrome)
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-neutral-100 text-neutral-700 text-[10px] font-medium">
                    Zebra TC21/TC26
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-neutral-100 text-neutral-700 text-[10px] font-medium">
                    Apple & Google Wallet
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-neutral-200 space-y-2.5">
              {isUnlocked ? (
                <div className="space-y-2">
                  <Link
                    href={`/studio?template=${encodeURIComponent(template.id)}`}
                    className="w-full py-3.5 px-4 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>Customize in Ticket Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/create-event?template=${encodeURIComponent(template.id)}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs flex items-center justify-center transition-all"
                  >
                    <span>Apply to New Event</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleUnlockAction}
                    className="w-full py-3.5 px-4 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Unlock Template — ₹{template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleUnlockBundleAction}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-neutral-900 to-violet-950 hover:from-neutral-800 hover:to-violet-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-violet-500/30"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Unlock All 12 Pro Passes for ₹99</span>
                  </button>

                  <p className="text-[10px] text-center text-neutral-400">
                    Instant Razorpay UPI &middot; Tied permanently to your organizer account
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
