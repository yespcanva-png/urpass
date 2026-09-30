"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { StudioTemplateDefinition } from "@/lib/studio/templates";
import { SINGLE_TEMPLATE_PRICE_INR, ALL_ACCESS_BUNDLE_PRICE_INR } from "@/lib/studio/templates";
import TicketVisualShowcase from "./TicketVisualShowcase";
import {
  X,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Sliders,
  Smartphone,
  CreditCard,
  Ticket,
  Maximize2,
  Lock,
  Layers,
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
  onUnlockClick,
  onUnlockBundleClick,
}: TemplateShowcaseModalProps) {
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "customize">("preview");

  // Live interactive preview test fields
  const [testEventName, setTestEventName] = useState("");
  const [testAttendeeName, setTestAttendeeName] = useState("");
  const [testVenue, setTestVenue] = useState("");
  const [testDate, setTestDate] = useState("");

  useEffect(() => {
    if (isOpen && template) {
      document.body.style.overflow = "hidden";
      setShowAuthPrompt(false);
      setActiveTab("preview");
      setTestEventName("");
      setTestAttendeeName("");
      setTestVenue("");
      setTestDate("");
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, template]);

  if (!isOpen || !template) return null;

  const isFree = template.tier !== "paid";

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

  function getFormatDetails(format: string) {
    switch (format) {
      case "printable":
        return {
          label: "Printable Stub Ticket",
          dim: "780 × 340 px",
          desc: "High-resolution tear-off stub ticket with dual QR & barcode, ready for thermal or A4 printing.",
          icon: Ticket,
        };
      case "badge":
        return {
          label: "Conference Lanyard Badge",
          dim: "440 × 640 px",
          desc: "Vertical convention badge with punch-hole slot for lanyards, high-visibility name, and NFC wave.",
          icon: CreditCard,
        };
      case "digital":
      default:
        return {
          label: "Digital Mobile Pass",
          dim: "380 × 680 px",
          desc: "Mobile-optimized Apple Wallet format pass accessible directly in browser with sub-0.3s QR check-in.",
          icon: Smartphone,
        };
    }
  }

  const formatMeta = getFormatDetails(template.format);
  const FormatIcon = formatMeta.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl p-5 sm:p-7 text-white shadow-2xl flex flex-col justify-between my-auto relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300">
              <FormatIcon className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  {template.name}
                </h3>
                {isFree ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                    FREE
                  </span>
                ) : isUnlocked ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    UNLOCKED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/30 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    PRO ₹{template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">
                {formatMeta.label} · {formatMeta.dim}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Preview"
            className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Preview vs Interactive Test */}
        <div className="flex items-center justify-between pt-3 pb-2">
          <div className="inline-flex items-center p-1 bg-neutral-900 rounded-xl border border-neutral-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === "preview"
                  ? "bg-white text-neutral-950 shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Full-Scale Showcase
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("customize")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "customize"
                  ? "bg-white text-neutral-950 shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Sliders className="w-3 h-3 text-emerald-500" />
              Live Test Fields
            </button>
          </div>

          <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
            Category: {template.category}
          </span>
        </div>

        {/* Interactive Customization Inputs (if Tab is customize) */}
        {activeTab === "customize" && (
          <div className="my-3 p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs animate-in fade-in duration-150">
            <div>
              <label className="text-[10px] font-semibold text-neutral-400 block mb-1">
                Test Event Name
              </label>
              <input
                type="text"
                placeholder="e.g., TECH CONVERGENCE 2026"
                value={testEventName}
                onChange={(e) => setTestEventName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-hidden focus:border-emerald-500 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-neutral-400 block mb-1">
                Test Attendee Name
              </label>
              <input
                type="text"
                placeholder="e.g., ROHIT SHARMA"
                value={testAttendeeName}
                onChange={(e) => setTestAttendeeName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-hidden focus:border-emerald-500 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-neutral-400 block mb-1">
                Test Venue
              </label>
              <input
                type="text"
                placeholder="e.g., Convention Center, Delhi"
                value={testVenue}
                onChange={(e) => setTestVenue(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-hidden focus:border-emerald-500 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-neutral-400 block mb-1">
                Test Date &amp; Time
              </label>
              <input
                type="text"
                placeholder="e.g., 18 NOV 2026 · 09:30 AM"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-hidden focus:border-emerald-500 text-xs"
              />
            </div>
          </div>
        )}

        {/* Centered Ticket Visual */}
        <div className="py-6 my-auto flex items-center justify-center relative min-h-[300px]">
          <div className="drop-shadow-2xl">
            <TicketVisualShowcase
              template={template}
              mode="showcase"
              customEventName={testEventName || undefined}
              customAttendeeName={testAttendeeName || undefined}
              customVenue={testVenue || undefined}
              customDate={testDate || undefined}
            />
          </div>
        </div>

        {/* Format Explanation Pill */}
        <p className="text-[11px] text-neutral-400 text-center max-w-md mx-auto mb-4 leading-relaxed">
          {formatMeta.desc}
        </p>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {isUnlocked ? (
            <Link
              href={`/studio?template=${encodeURIComponent(template.id)}`}
              className="w-full py-3 px-5 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Open in Visual Ticket Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={handleUnlockAction}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Unlock for ₹{template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR}</span>
              </button>

              <button
                type="button"
                onClick={handleUnlockBundleAction}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs border border-neutral-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Get All 12 for ₹99</span>
              </button>
            </div>
          )}
        </div>

        {/* Auth prompt modal if not logged in */}
        {showAuthPrompt && (
          <div className="absolute inset-0 bg-neutral-950/95 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center justify-center text-center z-30 animate-in fade-in duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              Sign In to Unlock Template
            </h4>
            <p className="text-xs text-neutral-400 max-w-sm mb-6 leading-relaxed">
              Log in to your URPASS organizer account to save and permanently bind this unlocked template to your profile with instant UPI.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <Link
                href={`/login?returnTo=/ticket-templates`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs transition-colors"
              >
                Sign In
              </Link>
              <button
                type="button"
                onClick={() => setShowAuthPrompt(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs border border-neutral-700 transition-colors"
              >
                Back to Preview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
