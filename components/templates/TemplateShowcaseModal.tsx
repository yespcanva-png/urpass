"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type StudioTemplateDefinition,
  SINGLE_TEMPLATE_PRICE_INR,
} from "@/lib/studio/templates";
import TicketVisualShowcase from "./TicketVisualShowcase";
import {
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Loader2,
  Smartphone,
  CreditCard,
  Printer,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface TemplateShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: StudioTemplateDefinition | null;
  allTemplates?: StudioTemplateDefinition[];
  onSelectTemplate?: (template: StudioTemplateDefinition) => void;
  onUseTemplate?: (template: StudioTemplateDefinition) => void;
  isUnlocked: boolean;
  isAuthenticated: boolean;
  userEmail?: string;
  onUnlockClick: (template: StudioTemplateDefinition) => void;
  onUnlockBundleClick: () => void;
}

type PreviewFormat = "mobile" | "badge" | "print";

export default function TemplateShowcaseModal({
  isOpen,
  onClose,
  template: initialTemplate,
  allTemplates = [],
  onSelectTemplate,
  onUseTemplate,
  isUnlocked,
  isAuthenticated,
  onUnlockClick,
  onUnlockBundleClick,
}: TemplateShowcaseModalProps) {
  const router = useRouter();
  const [currentTemplate, setCurrentTemplate] = useState<StudioTemplateDefinition | null>(
    initialTemplate
  );
  const [selectedFormat, setSelectedFormat] = useState<PreviewFormat>("mobile");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const previewCanvasRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Sync current template
  useEffect(() => {
    setCurrentTemplate(initialTemplate);
    setSelectedFormat("mobile");
    setZoomLevel(100);
    setIsApplying(false);
    setShowAuthPrompt(false);
  }, [initialTemplate]);

  // Find index for next/previous navigation
  const currentIndex = allTemplates.findIndex(
    (t) => t.id === currentTemplate?.id
  );
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < allTemplates.length - 1;

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      const prev = allTemplates[currentIndex - 1];
      setCurrentTemplate(prev);
      onSelectTemplate?.(prev);
    }
  }, [allTemplates, currentIndex, onSelectTemplate]);

  const handleNext = useCallback(() => {
    if (currentIndex !== -1 && currentIndex < allTemplates.length - 1) {
      const next = allTemplates[currentIndex + 1];
      setCurrentTemplate(next);
      onSelectTemplate?.(next);
    }
  }, [allTemplates, currentIndex, onSelectTemplate]);

  // Keyboard navigation & accessibility trap
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isFullscreen, onClose, handlePrevious, handleNext]);

  if (!isOpen || !currentTemplate) return null;

  const isFree = currentTemplate.tier !== "paid";
  const price = currentTemplate.priceINR ?? SINGLE_TEMPLATE_PRICE_INR;

  // Zoom controls
  function handleZoom(delta: number) {
    setZoomLevel((prev) => {
      const next = prev + delta;
      return Math.min(130, Math.max(60, next));
    });
  }

  function handleResetZoom() {
    setZoomLevel(100);
  }

  function handleFit() {
    setZoomLevel(90);
  }

  function toggleFullscreen() {
    setIsFullscreen((prev) => !prev);
  }

  // Handle template selection / application
  function handleUseTemplate() {
    if (onUseTemplate && currentTemplate) {
      onUseTemplate(currentTemplate);
      return;
    }
    setIsApplying(true);
    // Smooth microinteraction state before routing
    setTimeout(() => {
      router.push(`/studio?template=${encodeURIComponent(currentTemplate!.id)}`);
    }, 280);
  }

  function handleUnlockAction() {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    onUnlockClick(currentTemplate!);
  }

  // Checklist of included fields
  const includedItems = [
    "QR code",
    "Attendee name",
    "Ticket type",
    "Event date",
    "Venue",
    "Ticket ID",
  ];

  const scaleValue = zoomLevel / 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${currentTemplate.name} template preview`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-neutral-950/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={`w-full max-w-[1220px] bg-white border border-neutral-200/90 rounded-[20px] shadow-2xl shadow-neutral-950/10 overflow-hidden flex flex-col md:flex-row my-auto relative transition-all duration-200 ${
          isFullscreen ? "fixed inset-3 max-w-none max-h-none z-50 rounded-xl" : "max-h-[88vh]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-40 w-8 h-8 rounded-lg bg-white/90 hover:bg-neutral-100 border border-neutral-200 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── LEFT PREVIEW SIDE: 68% Canvas ── */}
        <div
          ref={previewCanvasRef}
          className="w-full md:w-[68%] bg-[#F5F6F7] p-4 sm:p-6 md:p-8 flex flex-col justify-between items-center relative border-b md:border-b-0 md:border-r border-neutral-200 overflow-hidden select-none"
        >
          {/* Top Bar inside Canvas: Format Selector + Nav Controls */}
          <div className="w-full flex items-center justify-between gap-3 z-20">
            {/* Format Selector: Mobile | Badge | Print */}
            <div className="inline-flex items-center p-0.5 rounded-lg bg-white border border-neutral-200/90 shadow-2xs">
              <button
                type="button"
                onClick={() => setSelectedFormat("mobile")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedFormat === "mobile"
                    ? "bg-neutral-900 text-white shadow-2xs"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat("badge")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedFormat === "badge"
                    ? "bg-neutral-900 text-white shadow-2xs"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Badge</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat("print")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedFormat === "print"
                    ? "bg-neutral-900 text-white shadow-2xs"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>

            {/* Next / Previous Controls */}
            {allTemplates.length > 1 && (
              <div className="hidden sm:inline-flex items-center gap-1 text-xs text-neutral-600">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={!hasPrevious}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200/90 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!hasNext}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200/90 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer shadow-2xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Centered Ticket / Pass Preview Canvas */}
          <div className="w-full flex-1 flex items-center justify-center py-5 sm:py-8 overflow-hidden min-h-[360px] md:min-h-[460px]">
            <div
              className="drop-shadow-md transition-all duration-150 flex items-center justify-center"
              style={{
                transform: `scale(${scaleValue})`,
                transformOrigin: "center center",
              }}
            >
              <TicketVisualShowcase
                template={currentTemplate}
                mode="showcase"
                format={selectedFormat}
              />
            </div>
          </div>

          {/* Thumbnail Strip & Minimal Canvas Bottom Controls */}
          <div className="w-full pt-3 border-t border-neutral-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            {/* 3 Thumbnails: Mobile Preview, Badge Preview, Print Preview */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedFormat("mobile")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedFormat === "mobile"
                    ? "bg-white border-2 border-neutral-900 text-neutral-900 font-semibold shadow-xs"
                    : "bg-white/80 border border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:bg-white"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                Mobile Preview
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat("badge")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedFormat === "badge"
                    ? "bg-white border-2 border-neutral-900 text-neutral-900 font-semibold shadow-xs"
                    : "bg-white/80 border border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:bg-white"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                Badge Preview
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat("print")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedFormat === "print"
                    ? "bg-white border-2 border-neutral-900 text-neutral-900 font-semibold shadow-xs"
                    : "bg-white/80 border border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:bg-white"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                Print Preview
              </button>
            </div>

            {/* Minimal Zoom Controls: [ − ] 100% [ + ] [ Fit ] [ Fullscreen ] */}
            <div className="inline-flex items-center gap-1.5">
              <div className="inline-flex items-center gap-0.5 bg-white border border-neutral-200 rounded-lg px-1.5 py-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleZoom(-15)}
                  disabled={zoomLevel <= 60}
                  aria-label="Zoom out"
                  className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-bold text-sm"
                >
                  −
                </button>

                <button
                  type="button"
                  onClick={handleResetZoom}
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

              <button
                type="button"
                onClick={handleFit}
                className="px-2.5 py-1 text-[11px] font-medium text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                Fit
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label="Toggle fullscreen"
                className="w-7 h-7 flex items-center justify-center text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
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
                  className="w-full h-10 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Back to Details
                </button>
              </div>
            </div>
          ) : (
            /* Standard Product Information Panel */
            <>
              <div className="space-y-5">
                {/* 1. Template name & Format */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900 tracking-tight leading-snug">
                    {currentTemplate.name}
                  </h3>
                  <p className="text-xs font-medium text-neutral-500 mt-1">
                    {selectedFormat === "mobile"
                      ? "Mobile Pass"
                      : selectedFormat === "badge"
                      ? "Badge Credential"
                      : "Print Ticket"}{" "}
                    • {currentTemplate.category}
                  </p>
                </div>

                {/* 2. Short one-line description */}
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {currentTemplate.description}
                </p>

                {/* 3. Included checklist */}
                <div className="space-y-2 pt-4 border-t border-neutral-100">
                  <span className="text-xs font-semibold text-neutral-900 block">
                    Includes
                  </span>
                  <div className="space-y-2">
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

                {/* 4. Pricing / License block */}
                <div className="pt-4 border-t border-neutral-100 space-y-1">
                  <span className="text-xs font-medium text-neutral-500 block">
                    License
                  </span>
                  {isFree ? (
                    <p className="text-sm font-semibold text-neutral-900">Free</p>
                  ) : isUnlocked ? (
                    <p className="text-sm font-semibold text-neutral-900">
                      Included in All-Access Bundle
                    </p>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        ₹{price} one-time
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Included in the ₹99 All-Access Bundle
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. CTA States */}
              <div className="space-y-2.5 pt-4 border-t border-neutral-100">
                {isUnlocked || isFree ? (
                  /* FREE OR UNLOCKED TEMPLATE FLOW */
                  <>
                    <button
                      type="button"
                      onClick={handleUseTemplate}
                      disabled={isApplying}
                      className="w-full h-11 rounded-lg bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer disabled:opacity-80"
                    >
                      {isApplying ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white/80" />
                          <span>Applying template...</span>
                        </>
                      ) : (
                        <>
                          <span>Use Template</span>
                          <ArrowRight className="w-4 h-4 text-neutral-400" />
                        </>
                      )}
                    </button>

                    <div className="text-center pt-0.5">
                      <Link
                        href={`/studio?template=${encodeURIComponent(currentTemplate.id)}`}
                        className="text-xs text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
                      >
                        Customize in Studio →
                      </Link>
                    </div>
                  </>
                ) : (
                  /* PAID TEMPLATE FLOW */
                  <>
                    <button
                      type="button"
                      onClick={handleUnlockAction}
                      className="w-full h-11 rounded-lg bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
                    >
                      <span>Unlock Template — ₹{price}</span>
                    </button>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        onClick={onUnlockBundleClick}
                        className="text-neutral-500 hover:text-neutral-900 font-medium cursor-pointer transition-colors"
                      >
                        View Bundle
                      </button>

                      <Link
                        href={`/studio?template=${encodeURIComponent(currentTemplate.id)}`}
                        className="text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
                      >
                        Customize in Studio →
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
