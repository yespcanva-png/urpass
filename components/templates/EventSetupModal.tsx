"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { EventSetupTemplate } from "@/lib/templates/event-setups";
import SetupAssetPreview from "./SetupAssetPreview";
import {
  X,
  Check,
  ArrowRight,
  Sparkles,
  Smartphone,
  Layers,
  FileText,
  DoorOpen,
  Bell,
  Building2,
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  Bookmark,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface EventSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: EventSetupTemplate | null;
}

type SetupTab = "overview" | "registration" | "pass" | "access" | "notifications";

export default function EventSetupModal({
  isOpen,
  onClose,
  template,
}: EventSetupModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SetupTab>("overview");
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavedToOrg, setIsSavedToOrg] = useState(false);

  // Quick creation form state
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [organizerName, setOrganizerName] = useState("");

  useEffect(() => {
    if (isOpen && template) {
      document.body.style.overflow = "hidden";
      setActiveTab("overview");
      setIsCreatingEvent(false);
      setIsSavedToOrg(false);
      setEventName(template.config.eventDefaults.title);
      setEventDate("2026-11-20");
      setEventVenue(template.eventPage.venue);
      setOrganizerName(template.organizationName || "My Organization");
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, template]);

  if (!isOpen || !template) return null;

  function handleQuickSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      router.push(
        `/create-event?template=${encodeURIComponent(template!.id)}&name=${encodeURIComponent(
          eventName
        )}&date=${encodeURIComponent(eventDate)}&venue=${encodeURIComponent(
          eventVenue
        )}&org=${encodeURIComponent(organizerName)}`
      );
    }, 350);
  }

  function handleSaveToOrg() {
    setIsSavedToOrg(true);
    setTimeout(() => setIsSavedToOrg(false), 3000);
  }

  const TABS: Array<{ id: SetupTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: "overview", label: "Overview", icon: Layers },
    { id: "registration", label: "Registration", icon: FileText },
    { id: "pass", label: "Pass", icon: Smartphone },
    { id: "access", label: "Access", icon: DoorOpen },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${template.name} setup blueprint`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-neutral-950/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[1220px] bg-white border border-neutral-200/90 rounded-[20px] shadow-2xl shadow-neutral-950/10 overflow-hidden flex flex-col my-auto relative animate-in zoom-in-95 duration-150 max-h-[88vh]"
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

        {isCreatingEvent ? (
          /* ── FAST CREATE EVENT FROM TEMPLATE FLOW ── */
          <div className="p-6 sm:p-10 max-w-xl mx-auto w-full space-y-6 my-auto">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[11px] font-semibold mb-2">
                <Sparkles className="w-3 h-3 text-neutral-700" />
                <span>Creating Event from {template.name}</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 tracking-tight">
                Event Basics
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Enter your event details. All registration fields, passes, turnstiles, and notification settings will be cloned automatically.
              </p>
            </div>

            <form onSubmit={handleQuickSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-800 block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full h-10 px-3 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-800 block mb-1">
                    Organizer / Host
                  </label>
                  <input
                    type="text"
                    required
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    className="w-full h-10 px-3 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  Venue / Location (or Online)
                </label>
                <input
                  type="text"
                  required
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-2xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingEvent(false)}
                  className="px-4 py-2.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  ← Back to Blueprint
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-11 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer disabled:opacity-80"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Cloning configuration...</span>
                    </>
                  ) : (
                    <>
                      <span>Launch Event Workspace</span>
                      <ArrowRight className="w-4 h-4 text-neutral-400" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ── STANDARD 65% / 35% ENTERPRISE BLUEPRINT MODAL ── */
          <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-y-auto">
            {/* ── LEFT SIDE: 65% Interactive Setup Preview Canvas ── */}
            <div className="w-full md:w-[65%] bg-[#F5F6F7] p-4 sm:p-6 md:p-8 flex flex-col justify-between items-center relative border-b md:border-b-0 md:border-r border-neutral-200 overflow-hidden select-none">
              {/* Segmented Control: Overview | Registration | Pass | Access | Notifications */}
              <div className="w-full flex items-center justify-between gap-2 z-20 pb-3 border-b border-neutral-200/70">
                <div className="inline-flex items-center p-0.5 rounded-lg bg-white border border-neutral-200/90 shadow-2xs overflow-x-auto max-w-full">
                  {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                          isActive
                            ? "bg-neutral-900 text-white shadow-2xs"
                            : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 bg-white/70 px-2.5 py-1 rounded-md border border-neutral-200/60">
                  <span>{template.version}</span>
                  <span>•</span>
                  <span>{template.complexity} Setup</span>
                </div>
              </div>

              {/* Main Content Area based on Tab */}
              <div className="w-full flex-1 flex items-center justify-center py-4 overflow-y-auto min-h-[360px] md:min-h-[460px]">
                {activeTab === "overview" && (
                  /* 1. OVERVIEW: Operational Blueprint Architecture */
                  <div className="w-full max-w-md bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
                    <div className="pb-3 border-b border-neutral-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                          SYSTEM BLUEPRINT
                        </span>
                        <h4 className="text-base font-bold text-neutral-900">{template.name}</h4>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-semibold">
                        {template.config.eventDefaults.expectedAttendees} Capacity
                      </span>
                    </div>

                    {/* Operational Matrix */}
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                          Registration Form Fields
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {template.formFields.map((f, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-neutral-700 font-medium text-[11px]"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                        <span className="font-semibold text-neutral-500">Ticket Types</span>
                        <span className="text-neutral-800 font-medium">
                          {template.config.ticketConfig.ticketTypes.map((t) => t.name).join(" • ")}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                        <span className="font-semibold text-neutral-500">Access Gates</span>
                        <span className="text-neutral-800 font-medium">
                          {template.config.accessConfig.gates.map((g) => g.name).join(", ")}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                        <span className="font-semibold text-neutral-500">Delivery Channels</span>
                        <span className="text-neutral-800 font-medium">
                          {template.config.notificationConfig.emailEnabled && "Instant Email"}
                          {template.config.notificationConfig.whatsAppEnabled && " • WhatsApp QR Pass"}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                        <span className="font-semibold text-neutral-500">Pass Design</span>
                        <span className="text-neutral-800 font-mono font-medium">
                          {template.qrPass.passType}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "registration" && (
                  /* 2. REGISTRATION PREVIEW */
                  <div className="w-full flex items-center justify-center">
                    <SetupAssetPreview template={template} assetType="form" mode="full" />
                  </div>
                )}

                {activeTab === "pass" && (
                  /* 3. PASS PREVIEW */
                  <div className="w-full flex items-center justify-center">
                    <SetupAssetPreview template={template} assetType="pass" mode="full" />
                  </div>
                )}

                {activeTab === "access" && (
                  /* 4. ACCESS & TURNSTILES PREVIEW */
                  <div className="w-full max-w-md bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
                    <div className="pb-3 border-b border-neutral-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900">
                        Gate Turnstile Network
                      </span>
                      <span className="text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Sub-0.3s Scan Active
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {template.config.accessConfig.gates.map((gate, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/60 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-semibold text-neutral-900 block">{gate.name}</span>
                            <span className="text-[11px] text-neutral-500">
                              Permitted Tiers: {gate.allowedTiers.join(", ")}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-neutral-200 text-neutral-700">
                            GATE #{i + 1}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-neutral-100 text-[11px] text-neutral-500 flex items-center justify-between">
                      <span>Offline Scan Timeout:</span>
                      <span className="font-mono text-neutral-800">
                        {template.config.ticketConfig.qrSettings.scanTimeoutMs}ms
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  /* 5. NOTIFICATIONS PREVIEW */
                  <div className="w-full max-w-md space-y-3">
                    {/* Email Card */}
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm text-xs space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                        <span className="font-semibold text-neutral-900">Email Confirmation & Pass</span>
                        <span className="text-[10px] font-mono text-neutral-400">Instant Dispatch</span>
                      </div>
                      <p className="text-[11px] text-neutral-600">
                        &quot;Your accreditation for {template.name} is confirmed. Attached is your Apple/Google Wallet digital pass and calendar invite.&quot;
                      </p>
                    </div>

                    {/* WhatsApp Card */}
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm text-xs space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                        <span className="font-semibold text-neutral-900">WhatsApp Ticket Delivery</span>
                        <span className="text-[10px] font-mono text-emerald-600 font-semibold">Enabled</span>
                      </div>
                      <p className="text-[11px] text-neutral-600">
                        Direct QR barcode image message with dynamic event token and turnstile gate directions sent immediately after registration.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Canvas Footer Note */}
              <div className="w-full pt-3 border-t border-neutral-200/70 flex items-center justify-between text-xs text-neutral-500">
                <span className="text-[11px]">
                  Configured for: {template.bestFor}
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  Zero Commission · Sub-0.3s Camera Scan
                </span>
              </div>
            </div>

            {/* ── RIGHT DETAILS PANEL: 35% Information / Action Summary ── */}
            <div className="w-full md:w-[35%] p-6 sm:p-7 flex flex-col justify-between bg-white space-y-6 overflow-y-auto">
              <div className="space-y-5">
                {/* 1. Template name & Subtitle */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900 tracking-tight leading-snug">
                    {template.name}
                  </h3>
                  <p className="text-xs font-medium text-neutral-500 mt-1">
                    {template.category} • Setup Level: {template.complexity}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {template.subtitle}
                </p>

                {/* 2. Ideal Use Case */}
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/80 text-xs">
                  <span className="font-semibold text-neutral-800 block mb-0.5">
                    Ideal Use Case
                  </span>
                  <p className="text-neutral-600 text-[11px]">{template.bestFor}</p>
                </div>

                {/* 3. What's Configured Checklist */}
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <span className="text-xs font-semibold text-neutral-900 block">
                    What&apos;s Configured
                  </span>
                  <div className="space-y-2">
                    {template.includedFeatures.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-neutral-600"
                      >
                        <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0 stroke-[2.5] mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Setup Level Badge */}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Setup Level</span>
                  <span className="font-semibold text-neutral-900">{template.complexity}</span>
                </div>
              </div>

              {/* 5. Primary Actions */}
              <div className="space-y-2.5 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsCreatingEvent(true)}
                  className="w-full h-11 rounded-lg bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
                >
                  <span>Use Event Template</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className="text-neutral-500 hover:text-neutral-900 font-medium transition-colors cursor-pointer"
                  >
                    Preview configuration
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveToOrg}
                    className="text-neutral-500 hover:text-neutral-900 font-medium transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Bookmark className="w-3 h-3" />
                    <span>{isSavedToOrg ? "Saved to Org!" : "Save to Organization"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
