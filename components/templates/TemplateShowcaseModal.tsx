"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  STUDIO_TEMPLATES,
  type StudioTemplateDefinition,
  SINGLE_TEMPLATE_PRICE_INR,
} from "@/lib/studio/templates";
import TicketVisualShowcase from "./TicketVisualShowcase";
import {
  X,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ArrowRight,
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
  template: initialTemplate,
  isUnlocked,
  isAuthenticated,
  onUnlockClick,
  onUnlockBundleClick,
}: TemplateShowcaseModalProps) {
  const [currentTemplate, setCurrentTemplate] = useState<StudioTemplateDefinition | null>(
    initialTemplate
  );
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Sync when initialTemplate changes
  useEffect(() => {
    setCurrentTemplate(initialTemplate);
    setZoomLevel(100);
    setShowAuthPrompt(false);
  }, [initialTemplate]);

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen && currentTemplate) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentTemplate, handleKeyDown]);

  if (!isOpen || !currentTemplate) return null;

  const isFree = currentTemplate.tier !== "paid";
  const price = currentTemplate.priceINR ?? SINGLE_TEMPLATE_PRICE_INR;

  function handleUnlockAction() {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    onUnlockClick(currentTemplate!);
  }

  function handleFormatSwitch(targetFormat: "digital" | "badge" | "printable") {
    if (currentTemplate?.format === targetFormat) return;
    // Find a template matching the requested format in the same category or best match
    const matchingInCat = STUDIO_TEMPLATES.find(
      (t) => t.format === targetFormat && t.category === currentTemplate?.category
    );
    const fallbackMatching = STUDIO_TEMPLATES.find((t) => t.format === targetFormat);
    const nextTemplate = matchingInCat || fallbackMatching;
    if (nextTemplate) {
      setCurrentTemplate(nextTemplate);
      setZoomLevel(100);
    }
  }

  function getFormatDisplay(format: string) {
    switch (format) {
      case "printable":
        return "Printable Stub";
      case "badge":
        return "Lanyard Badge";
      case "digital":
      default:
        return "Mobile Pass";
    }
  }

  function handleZoom(delta: number) {
    setZoomLevel((prev) => {
      const next = prev + delta;
      return Math.min(130, Math.max(70, next));
    });
  }

  const includedItems = [
    "High-density QR code",
    "Attendee name",
    "Ticket category",
    "Event details",
    "Ticket ID",
  ];

  const scaleValue = zoomLevel / 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${currentTemplate.name} preview`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-900/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[1180px] bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row my-auto relative animate-in zoom-in-95 duration-150 max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-lg bg-white/90 hover:bg-neutral-100 border border-neutral-200 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── PREVIEW SIDE: 68% Canvas ── */}
        <div className="w-full md:w-[68%] bg-[#F6F7F8] p-5 sm:p-8 flex flex-col justify-between items-center relative border-b md:border-b-0 md:border-r border-neutral-200 overflow-hidden">
          {/* Top Segmented Format Switcher */}
          <div className="w-full flex items-center justify-center mb-3">
            <div className="inline-flex items-center p-0.5 bg-neutral-200/60 rounded-lg text-xs font-medium border border-neutral-200">
              <button
                type="button"
                onClick={() => handleFormatSwitch("digital")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  currentTemplate.format === "digital"
                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Mobile
              </button>
              <button
                type="button"
                onClick={() => handleFormatSwitch("badge")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  currentTemplate.format === "badge"
                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Badge
              </button>
              <button
                type="button"
                onClick={() => handleFormatSwitch("printable")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  currentTemplate.format === "printable"
                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Print
              </button>
            </div>
          </div>

          {/* Centered Real Design Canvas Area */}
          <div className="w-full flex-1 flex items-center justify-center py-4 sm:py-6 overflow-hidden min-h-[360px]">
            <div
              className="drop-shadow-sm select-none transition-transform duration-150 flex items-center justify-center"
              style={{ transform: `scale(${scaleValue})`, transformOrigin: "center center" }}
            >
              <TicketVisualShowcase template={currentTemplate} mode="showcase" />
            </div>
          </div>

          {/* Bottom Subtle Zoom Controls */}
          <div className="w-full flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-200/60">
            <span className="text-[11px] font-mono text-neutral-400">
              {getFormatDisplay(currentTemplate.format)}
            </span>

            {/* Zoom Widget: [ − ] [ 100% ] [ + ] */}
            <div className="inline-flex items-center gap-1 bg-white border border-neutral-200 rounded-lg px-1.5 py-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => handleZoom(-15)}
                disabled={zoomLevel <= 70}
                aria-label="Zoom out"
                className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-bold text-sm"
              >
                −
              </button>

              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                className="px-1.5 text-[11px] font-mono font-medium text-neutral-700 hover:text-neutral-900 cursor-pointer"
                title="Reset zoom"
              >
                {zoomLevel}%
              </button>

              <button
                type="button"
                onClick={() => handleZoom(15)}
                disabled={zoomLevel >= 130}
                aria-label="Zoom in"
                className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-bold text-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT DETAILS PANEL: 32% ── */}
        <div className="w-full md:w-[32%] p-6 sm:p-7 flex flex-col justify-between bg-white space-y-6 overflow-y-auto">
          {showAuthPrompt ? (
            /* Auth Required State */
            <div className="space-y-4 my-auto">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                Account Sign In
              </span>
              <h4 className="text-lg font-semibold text-neutral-900 leading-snug">
                Sign in to save this template
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Log in to your URPASS organizer account to bind this template to your profile and reuse it across your events.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href={`/login?returnTo=/ticket-templates`}
                  className="w-full h-10 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs flex items-center justify-center transition-colors"
                >
                  Sign In
                </Link>
                <button
                  type="button"
                  onClick={() => setShowAuthPrompt(false)}
                  className="w-full h-10 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium text-xs transition-colors"
                >
                  Back to Details
                </button>
              </div>
            </div>
          ) : (
            /* Standard Product Information Panel */
            <>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900 tracking-tight leading-snug">
                    {currentTemplate.name}
                  </h3>
                  <p className="text-xs font-medium text-neutral-500 mt-1">
                    {getFormatDisplay(currentTemplate.format)}
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-2.5 leading-relaxed">
                    {currentTemplate.description}
                  </p>
                </div>

                {/* Included Specifications */}
                <div className="space-y-2 pt-3 border-t border-neutral-100">
                  <span className="text-xs font-semibold text-neutral-800 block">
                    Included
                  </span>
                  <div className="space-y-1.5">
                    {includedItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-neutral-600"
                      >
                        <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0 stroke-[2.5]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Block */}
                <div className="pt-3 border-t border-neutral-100">
                  <span className="text-xs font-medium text-neutral-500 block mb-0.5">
                    Pricing
                  </span>
                  <p className="text-sm font-semibold text-neutral-900">
                    {isFree
                      ? "Free"
                      : isUnlocked
                      ? "Included in All-Access Bundle"
                      : `₹${price} one-time`}
                  </p>
                </div>
              </div>

              {/* Bottom Actions Area */}
              <div className="space-y-2.5 pt-4 border-t border-neutral-100">
                {isUnlocked ? (
                  /* Free or Unlocked Template Flow */
                  <>
                    <Link
                      href={`/studio?template=${encodeURIComponent(currentTemplate.id)}`}
                      className="w-full h-11 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-2xs"
                    >
                      <span>Use Template</span>
                      <ArrowRight className="w-4 h-4 text-neutral-400" />
                    </Link>

                    <div className="text-center pt-1">
                      <Link
                        href={`/studio?template=${encodeURIComponent(currentTemplate.id)}`}
                        className="text-xs text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
                      >
                        Customize in Studio →
                      </Link>
                    </div>
                  </>
                ) : (
                  /* Paid Template Flow */
                  <>
                    <button
                      type="button"
                      onClick={handleUnlockAction}
                      className="w-full h-11 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
                    >
                      <span>Unlock Template — ₹{price}</span>
                    </button>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        onClick={onUnlockBundleClick}
                        className="text-neutral-500 hover:text-neutral-800 font-medium cursor-pointer"
                      >
                        View Bundle
                      </button>

                      <Link
                        href={`/studio?template=${encodeURIComponent(currentTemplate.id)}`}
                        className="text-neutral-500 hover:text-neutral-800 font-medium"
                      >
                        Preview in Studio →
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
