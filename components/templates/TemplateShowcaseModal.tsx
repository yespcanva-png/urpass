"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { StudioTemplateDefinition } from "@/lib/studio/templates";
import { SINGLE_TEMPLATE_PRICE_INR } from "@/lib/studio/templates";
import TicketVisualShowcase from "./TicketVisualShowcase";
import {
  X,
  Zap,
  CheckCircle2,
  ArrowRight,
  Lock,
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
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

  const createEventUrl = `/create-event?template=${encodeURIComponent(template.id)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] max-h-[90vh] bg-neutral-900 border border-neutral-800 rounded-3xl p-5 text-white shadow-2xl flex flex-col justify-between overflow-y-auto no-scrollbar relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-tight truncate max-w-[240px]">
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
              <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-black uppercase tracking-wider border border-violet-500/30 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-300" />
                ₹{template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Preview"
            className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Centered Sleek Ticket Visual */}
        <div className="py-4 my-auto flex items-center justify-center relative">
          <TicketVisualShowcase
            template={template}
            mode="showcase"
          />
        </div>

        {/* Auth prompt if unauthenticated unlock clicked */}
        {showAuthPrompt && !isAuthenticated && (
          <div className="p-3 mb-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-300">
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In Required</span>
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed">
              Log in to save this unlocked template permanently to your organizer account.
            </p>
            <div className="flex gap-2 pt-1">
              <Link
                href={`/login?returnTo=/dashboard/templates`}
                className="flex-1 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-[11px] text-center transition-colors"
              >
                Sign In
              </Link>
              <Link
                href={`/signup?returnTo=/dashboard/templates`}
                className="flex-1 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-[11px] text-center transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}

        {/* Compact Footer Actions */}
        <div className="pt-3 border-t border-neutral-800 space-y-2 shrink-0">
          <p className="text-[11px] text-neutral-400 text-center leading-relaxed line-clamp-1">
            {template.description}
          </p>

          {isUnlocked ? (
            <div className="space-y-1.5">
              <Link
                href={`/studio?template=${encodeURIComponent(template.id)}`}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>Customize in Ticket Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <div className="text-center">
                <Link
                  href={createEventUrl}
                  className="text-[11px] text-neutral-400 hover:text-white transition-colors underline"
                >
                  Use in New Event
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={handleUnlockAction}
                className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Unlock Template — ₹{template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR}</span>
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleUnlockBundleAction}
                  className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
                >
                  Or unlock all 12 templates for ₹99 &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
