"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Ticket,
  Calendar,
  Building2,
  Clock,
  Layers,
  HelpCircle,
  Zap,
} from "lucide-react";
import { UserIntent, SmartOffer } from "@/lib/smart-offers/types";
import { SMART_OFFERS_CATALOG } from "@/lib/smart-offers/catalog";

type PreviewIntentKey =
  | "first_time"
  | "one_time"
  | "recurring"
  | "large_corporate"
  | "unfinished_setup";

interface PreviewOption {
  key: PreviewIntentKey;
  label: string;
  icon: React.ElementType;
  offer: SmartOffer;
}

const PREVIEW_OPTIONS: PreviewOption[] = [
  {
    key: "first_time",
    label: "First-time organiser",
    icon: Calendar,
    offer: SMART_OFFERS_CATALOG.free_guided_setup,
  },
  {
    key: "one_time",
    label: "One-time event",
    icon: Ticket,
    offer: SMART_OFFERS_CATALOG.single_event_pass,
  },
  {
    key: "recurring",
    label: "Recurring events",
    icon: Layers,
    offer: SMART_OFFERS_CATALOG.paid_plan_comparison,
  },
  {
    key: "large_corporate",
    label: "Large corporate event",
    icon: Building2,
    offer: SMART_OFFERS_CATALOG.business_demo_support,
  },
  {
    key: "unfinished_setup",
    label: "Started but didn't finish setup",
    icon: Clock,
    offer: {
      ...SMART_OFFERS_CATALOG.free_guided_setup,
      title: "Draft Recovery & Guided Setup",
      headline: "Finish setting up your event draft",
      subtext:
        "Your event details are safely saved. Continue configuring your ticket types, custom registration form, and preview your live pass.",
      badge: "Incomplete Setup Detected",
      primaryCtaLabel: "Resume Event Setup",
      primaryCtaUrl: "/create-event?draft=resume",
      secondaryCtaLabel: "Request 24h Setup Help (₹0)",
      secondaryCtaUrl: "/create-event?concierge=free",
      helperNote: "Free guided setup · No credit card or discount required",
    },
  },
];

export default function SmartOfferPreviewSection() {
  const [selectedKey, setSelectedKey] = useState<PreviewIntentKey>("first_time");

  const selectedOption =
    PREVIEW_OPTIONS.find((opt) => opt.key === selectedKey) || PREVIEW_OPTIONS[0];
  const { offer } = selectedOption;
  const Icon = selectedOption.icon;

  return (
    <div className="w-full rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-50 border border-violet-100 text-[11px] font-bold text-violet-700 uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          Smart Offer Preview
        </div>
        <h3 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
          Select a detected organiser intent to preview the personalised offer
        </h3>
        <p className="text-xs sm:text-sm text-neutral-500">
          The engine dynamically matches what the organiser wants to achieve, how ready they are to run an event, and what is preventing them from purchasing.
        </p>
      </div>

      {/* Intent Selector Buttons */}
      <div className="flex flex-wrap gap-2 pt-1">
        {PREVIEW_OPTIONS.map((opt) => {
          const BtnIcon = opt.icon;
          const isSelected = opt.key === selectedKey;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSelectedKey(opt.key)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? "bg-violet-700 text-white shadow-xs"
                  : "bg-neutral-100/80 hover:bg-neutral-200/70 text-neutral-700 border border-neutral-200/60"
              }`}
            >
              <BtnIcon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-neutral-500"}`} />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Offer Live Card Preview */}
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50/90 via-purple-50/50 to-white p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-violet-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-violet-600 text-white">
              <Icon className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-900">
              {selectedOption.label}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-100 text-violet-800 border border-violet-200">
            <Sparkles className="w-3 h-3 text-violet-600" />
            {offer.badge}
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg sm:text-xl font-extrabold text-neutral-950 tracking-tight">
            {offer.headline}
          </h4>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl">
            {offer.subtext}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href={offer.primaryCtaUrl}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
          >
            <span>{offer.primaryCtaLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {offer.secondaryCtaLabel && offer.secondaryCtaUrl && (
            <Link
              href={offer.secondaryCtaUrl}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 text-xs sm:text-sm font-semibold transition-colors"
            >
              <span>{offer.secondaryCtaLabel}</span>
            </Link>
          )}
        </div>

        {offer.helperNote && (
          <div className="pt-2 border-t border-violet-100/70 flex items-center gap-2 text-[11px] text-neutral-500 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 shrink-0" />
            <span>{offer.helperNote}</span>
          </div>
        )}
      </div>

      {/* Footnote */}
      <p className="text-[11px] text-neutral-400 italic text-center sm:text-left">
        Illustrative interface preview; live UrPass engine matches detected visitor signals without coupon popups.
      </p>
    </div>
  );
}
