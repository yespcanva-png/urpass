"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Sparkles, Check, ArrowRight, ShieldCheck, Palette, Ticket, EyeOff } from "lucide-react";
import TrialConfirmationModal from "@/components/billing/TrialConfirmationModal";

interface Props {
  userEmail?: string;
  userName?: string;
}

export default function BrandingUpgradeGate({ userEmail, userName }: Props) {
  const [trialModalOpen, setTrialModalOpen] = useState(false);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-neutral-100 p-6 sm:p-8 shadow-sm">
        {/* Top Header Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-purple-600" />
            Pro Plan Entitlement
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            30-Day Free Trial Available
          </span>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 text-white flex items-center justify-center mb-4 shadow-sm">
          <Palette className="w-6 h-6" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">
          Custom Branding & White-Label Passes
        </h1>
        <p className="text-sm text-neutral-500 leading-relaxed mb-6">
          Opt into the <strong>Pro Plan 30-Day Free Trial</strong> to fully customize the appearance of your event passes, upload your organization logo, set custom brand palettes, and remove all &ldquo;Powered by URPASS&rdquo; watermarks.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900">Remove URPASS Branding</p>
              <p className="text-[11px] text-neutral-500">Hide footer watermarks and badges</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900">Custom Organization Logo</p>
              <p className="text-[11px] text-neutral-500">Showcase your brand on all passes</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900">Brand Color Themes</p>
              <p className="text-[11px] text-neutral-500">Header gradients and accent colors</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900">Ticket Studio Visual Designer</p>
              <p className="text-[11px] text-neutral-500">Glassmorphism, 3D cards & templates</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={() => setTrialModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-sm hover:opacity-90 transition-all cursor-pointer"
            style={{ background: "linear-gradient(135deg, #6D28D9, #4c1d95)" }}
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>Start 30-Day Pro Free Trial (£0 / ₹0)</span>
          </button>

          <Link
            href="/billing"
            className="px-5 py-3 rounded-xl text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 transition-colors text-center"
          >
            View All Plans
          </Link>
        </div>

        <p className="text-center text-[11px] text-neutral-400 mt-4">
          Instant activation · ₹0 / £0 charged today · Full Pro feature access · Cancel anytime
        </p>

        <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
          <Link href="/dashboard" className="hover:text-neutral-900 transition-colors">
            ← Back to Dashboard
          </Link>
          <Link href="/pricing" className="hover:text-neutral-900 transition-colors">
            Compare plans →
          </Link>
        </div>
      </div>

      {/* 30-Day Free Trial Modal */}
      <TrialConfirmationModal
        isOpen={trialModalOpen}
        onClose={() => setTrialModalOpen(false)}
        planSlug="pro"
        planName="Pro"
        userEmail={userEmail}
        userName={userName}
      />
    </div>
  );
}
