"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  X,
  Check,
  ShieldCheck,
  Palette,
  Moon,
  Building,
  ArrowRight,
  Layers,
} from "lucide-react";

interface StudioUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerFeature?: string;
  currentPlan?: string;
}

const PRO_STUDIO_PERKS = [
  {
    icon: Moon,
    title: "Dark Obsidian & VIP Themes",
    desc: "Luxury dark-mode tickets with radiant neon accents and high contrast.",
  },
  {
    icon: Palette,
    title: "Custom Background Artwork",
    desc: "Upload full-bleed event artwork with built-in high-contrast QR safety zones.",
  },
  {
    icon: ShieldCheck,
    title: "100% White-Label (Remove Wordmark)",
    desc: "Remove the 'Powered by URPASS' branding completely from tickets and emails.",
  },
  {
    icon: Building,
    title: "Sponsor & Co-Branding Badges",
    desc: "Display secondary sponsor logos and institutional partner seals on passes.",
  },
  {
    icon: Layers,
    title: "Custom Geometry & Shapes",
    desc: "Unlock modern 28px rounded pill shapes and condensed mobile card formats.",
  },
  {
    icon: Sparkles,
    title: "Multi-Tier Category Accent Colors",
    desc: "Assign distinct visual identities and colors for VIP, Gold, and Speaker passes.",
  },
];

export default function StudioUpgradeModal({
  isOpen,
  onClose,
  triggerFeature,
  currentPlan = "free",
}: StudioUpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Top Gradient Banner */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-brand p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ticket Studio Pro</span>
          </div>

          <h3 className="text-xl font-extrabold tracking-tight">
            {triggerFeature
              ? `Unlock ${triggerFeature} with Pro`
              : "Upgrade to Ticket Studio Pro"}
          </h3>
          <p className="text-xs text-purple-100 mt-1 leading-relaxed">
            Elevate attendee first impressions with luxury dark themes, custom background artwork, sponsor badges, and 100% white-label passes.
          </p>
        </div>

        {/* Features List */}
        <div className="p-6 space-y-3.5 max-h-[55vh] overflow-y-auto">
          {PRO_STUDIO_PERKS.map((perk) => {
            const Icon = perk.icon;
            return (
              <div
                key={perk.title}
                className="flex items-start gap-3 p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-100"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">{perk.title}</h4>
                  <p className="text-[11px] text-neutral-500 leading-snug mt-0.5">
                    {perk.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left">
            <span className="text-[11px] font-semibold text-neutral-500 block">
              Current plan: <span className="uppercase font-bold text-neutral-800">{currentPlan}</span>
            </span>
            <span className="text-xs font-bold text-neutral-900">
              Pro starts at ₹999/mo · 30-day free trial
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/70 rounded-xl transition-colors"
            >
              Keep Designing
            </button>

            <Link
              href="/pricing?plan=pro"
              className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
            >
              <span>Start 30-Day Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
