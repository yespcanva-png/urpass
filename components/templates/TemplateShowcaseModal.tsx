"use client";

import React, { useEffect, useCallback } from "react";
import Link from "next/link";
import type { StudioTemplateDefinition } from "@/lib/studio/templates";
import { SINGLE_TEMPLATE_PRICE_INR } from "@/lib/studio/templates";
import TicketVisualShowcase from "./TicketVisualShowcase";
import {
  X,
  Check,
  Smartphone,
  CreditCard,
  Ticket,
  ArrowRight,
  Sparkles,
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
  const [showAuthPrompt, setShowAuthPrompt] = React.useState(false);

  // Handle escape key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen && template) {
      document.body.style.overflow = "hidden";
      setShowAuthPrompt(false);
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, template, handleKeyDown]);

  if (!isOpen || !template) return null;

  const isFree = template.tier !== "paid";
  const price = template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR;

  function handleUnlockAction() {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    onUnlockClick(template!);
  }

  function getFormatMeta(format: string) {
    switch (format) {
      case "printable":
        return {
          label: "Printable Stub",
          dim: "780 × 340 px",
          icon: Ticket,
        };
      case "badge":
        return {
          label: "Lanyard Badge",
          dim: "440 × 640 px",
          icon: CreditCard,
        };
      case "digital":
      default:
        return {
          label: "Mobile Pass",
          dim: "380 × 680 px",
          icon: Smartphone,
        };
    }
  }

  const formatMeta = getFormatMeta(template.format);
  const FormatIcon = formatMeta.icon;

  const includedFields = [
    "High-density QR code",
    "Attendee name & organization",
    "Ticket type & category tier",
    "Event schedule & venue",
    "Unique serialized ticket ID",
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${template.name} preview`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-900/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[1160px] bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row my-auto relative animate-in zoom-in-95 duration-150 max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-lg bg-white/90 hover:bg-neutral-100 border border-neutral-200 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── LEFT: 65% Neutral Preview Canvas ── */}
        <div className="w-full md:w-[65%] bg-[#F5F6F7] p-6 sm:p-10 flex flex-col justify-between items-center relative border-b md:border-b-0 md:border-r border-neutral-200 overflow-y-auto">
          {/* Subtle Format Indicator */}
          <div className="w-full flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span className="inline-flex items-center gap-1.5 font-sans font-medium text-neutral-600">
              <FormatIcon className="w-3.5 h-3.5 text-neutral-500" />
              {formatMeta.label}
            </span>
            <span>{formatMeta.dim}</span>
          </div>

          {/* Centered Pass Canvas with subtle shadow */}
          <div className="w-full flex-1 flex items-center justify-center py-6 sm:py-8">
            <div className="drop-shadow-sm select-none">
              <TicketVisualShowcase template={template} mode="showcase" />
            </div>
          </div>

          {/* Minimal Canvas Footer Label */}
          <div className="w-full text-center">
            <span className="text-[11px] text-neutral-400 font-mono">
              Vector SVG preview · Sub-0.3s camera scan ready
            </span>
          </div>
        </div>

        {/* ── RIGHT: 35% Information & Actions Panel ── */}
        <div className="w-full md:w-[35%] p-6 sm:p-8 flex flex-col justify-between bg-white space-y-6 overflow-y-auto">
          {showAuthPrompt ? (
            /* Auth Required View */
            <div className="space-y-4 my-auto text-left">
              <span className="text-xs font-semibold text-brand uppercase tracking-wider block">
                Sign in required
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
            /* Normal Information Panel */
            <>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-medium text-neutral-500">
                      {template.category}
                    </span>
                    <span className="text-neutral-300">·</span>
                    <span className="text-xs font-medium text-neutral-500">
                      {formatMeta.label}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900 tracking-tight leading-snug">
                    {template.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                {/* Included Specifications */}
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <span className="text-xs font-semibold text-neutral-700 block">
                    Includes:
                  </span>
                  <div className="space-y-1.5">
                    {includedFields.map((field, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-neutral-600"
                      >
                        <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0 stroke-[2.5]" />
                        <span>{field}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* License / Price State */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-neutral-500">
                    License
                  </span>
                  <span className="text-sm font-semibold text-neutral-900">
                    {isFree ? "Free forever" : isUnlocked ? "Unlocked on your account" : `₹${price} one-time`}
                  </span>
                </div>
              </div>

              {/* Bottom Actions Area */}
              <div className="space-y-3 pt-4 border-t border-neutral-100">
                {isUnlocked ? (
                  <Link
                    href={`/studio?template=${encodeURIComponent(template.id)}`}
                    className="w-full h-11 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-2xs"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-4 h-4 text-neutral-400" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handleUnlockAction}
                    className="w-full h-11 rounded-lg bg-brand hover:bg-brand-600 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>Unlock Template — ₹{price}</span>
                  </button>
                )}

                <div className="flex items-center justify-between text-xs pt-1">
                  <Link
                    href={`/studio?template=${encodeURIComponent(template.id)}`}
                    className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors"
                  >
                    Customize in Studio →
                  </Link>

                  {!isUnlocked && (
                    <button
                      type="button"
                      onClick={onUnlockBundleClick}
                      className="text-neutral-500 hover:text-neutral-800 text-[11px] underline cursor-pointer"
                    >
                      All 12 for ₹99
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
