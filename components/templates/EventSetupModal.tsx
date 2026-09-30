"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { EventSetupTemplate } from "@/lib/templates/event-setups";
import SetupAssetPreview from "./SetupAssetPreview";
import {
  X,
  Check,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Smartphone,
  CreditCard,
  FileText,
  Globe,
  Sliders,
  ShieldCheck,
  Zap,
  ArrowLeft,
} from "lucide-react";

interface EventSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: EventSetupTemplate | null;
}

export default function EventSetupModal({
  isOpen,
  onClose,
  template,
}: EventSetupModalProps) {
  const router = useRouter();
  const [activeAsset, setActiveAsset] = useState<"page" | "form" | "pass" | "badge">("pass");
  const [isSetupStep, setIsSetupStep] = useState(false);

  useEffect(() => {
    if (isOpen && template) {
      document.body.style.overflow = "hidden";
      setActiveAsset("pass");
      setIsSetupStep(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, template]);

  if (!isOpen || !template) return null;

  function handleCreateEvent() {
    router.push(`/create-event?template=${encodeURIComponent(template!.id)}`);
  }

  const ASSET_TABS: Array<{
    id: "page" | "form" | "pass" | "badge";
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "page", label: "Event Page", icon: Globe },
    { id: "form", label: "Registration", icon: FileText },
    { id: "pass", label: "QR Pass", icon: Smartphone },
    { id: "badge", label: "Lanyard Badge", icon: CreditCard },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[1180px] bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden flex flex-col my-auto relative animate-in zoom-in-95 duration-200 max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 60 / 40 Split Layout */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-y-auto">
          {/* ── Left Side: 60-65% Canva-Style Preview Canvas ── */}
          <div className="w-full lg:w-[62%] bg-[#F6F7F9] p-6 sm:p-10 flex flex-col justify-between items-center relative border-b lg:border-b-0 lg:border-r border-neutral-200/80">
            {/* Visual Header Indicator */}
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                Asset Preview · {ASSET_TABS.find((t) => t.id === activeAsset)?.label}
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                Category: {template.category}
              </span>
            </div>

            {/* Centered Floating Preview Container */}
            <div className="w-full flex-1 flex items-center justify-center py-4 sm:py-6">
              <div className="drop-shadow-xl hover:drop-shadow-2xl transition-all duration-300 w-full flex items-center justify-center">
                <SetupAssetPreview
                  template={template}
                  assetType={activeAsset}
                  mode="full"
                />
              </div>
            </div>

            {/* Canva-Style Thumbnail Asset Switcher Strip */}
            <div className="w-full pt-4 mt-auto">
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                {ASSET_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeAsset === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveAsset(tab.id)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? "bg-white text-neutral-950 border-2 border-brand ring-4 ring-brand/10 shadow-sm"
                          : "bg-white/80 hover:bg-white text-neutral-600 border border-neutral-200"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-brand" : "text-neutral-400"}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right Side: 35-38% Information & Setup Panel ── */}
          <div className="w-full lg:w-[38%] p-6 sm:p-8 flex flex-col justify-between bg-white space-y-6">
            {!isSetupStep ? (
              /* VIEW 1: Template Overview & What's Included */
              <div className="space-y-5">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                    {template.chips.map((chip, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight leading-tight">
                    {template.name}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    {template.subtitle}
                  </p>
                </div>

                {/* Best For Pill */}
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                    BEST FOR
                  </span>
                  <p className="text-xs font-semibold text-neutral-800">
                    {template.bestFor}
                  </p>
                </div>

                {/* What's Included Checklist */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 block">
                    WHAT’S INCLUDED IN THIS ACCELERATOR
                  </span>
                  <div className="space-y-2">
                    {template.includedFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700">
                        <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preconfigured Architecture Specs */}
                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                    <span className="font-bold text-neutral-400 uppercase tracking-wider block text-[8px]">
                      GATE SETUP
                    </span>
                    <span className="font-bold text-neutral-800 truncate block mt-0.5">
                      {template.gateConfig}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                    <span className="font-bold text-neutral-400 uppercase tracking-wider block text-[8px]">
                      APPROVAL FLOW
                    </span>
                    <span className="font-bold text-neutral-800 truncate block mt-0.5">
                      {template.approvalWorkflow}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* VIEW 2: The Setup Confirmation Screen ("The Important Differentiator") */
              <div className="space-y-5 animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={() => setIsSetupStep(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Preview</span>
                </button>

                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2 inline-block">
                    PROVEN SETUP ACCELERATOR
                  </span>
                  <h3 className="text-lg font-black text-neutral-950 tracking-tight">
                    {template.name} Setup Ready
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Your event will be initialized with the following preconfigured schema:
                  </p>
                </div>

                {/* Preconfigured checklist */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5 text-xs">
                  <div className="flex items-start gap-2 text-neutral-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Form Fields: </span>
                      <span className="text-neutral-600">{template.formFields.join(", ")}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-neutral-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Email confirmation: </span>
                      <span className="text-neutral-600">Automated with ICS calendar invite</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-neutral-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">QR attendee pass: </span>
                      <span className="text-neutral-600">Digital wallet pass + printable badge</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-neutral-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Approval workflow: </span>
                      <span className="text-neutral-600">{template.approvalWorkflow}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-neutral-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Gate configuration: </span>
                      <span className="text-neutral-600">{template.gateConfig}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-neutral-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Check-in camera: </span>
                      <span className="text-neutral-600">Sub-0.3s gate scanning</span>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  You can fine-tune every field, color, venue, and time in the next step before publishing.
                </p>
              </div>
            )}

            {/* Bottom Actions Area */}
            <div className="pt-4 border-t border-neutral-100 space-y-2.5">
              {!isSetupStep ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsSetupStep(true)}
                    className="w-full h-12 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Use this template</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <Link
                      href={`/studio?template=${encodeURIComponent(template.id)}`}
                      className="text-neutral-600 hover:text-neutral-900 font-semibold underline"
                    >
                      Customize in Studio
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleCreateEvent()}
                      className="text-neutral-400 hover:text-neutral-700 font-medium"
                    >
                      Skip to Form →
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateEvent}
                  className="w-full h-12 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Create Event with Template →</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
