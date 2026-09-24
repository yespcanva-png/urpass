"use client";

import React, { useState, useEffect, useRef, useTransition, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Upload,
  Trash2,
  Mail,
  Download,
  Loader2,
  Calendar,
  MapPin,
  Ticket as TicketIcon,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Eye,
  X,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  type TicketDesignConfig,
  type TicketTemplate,
  DEFAULT_TICKET_DESIGN,
  sanitizeTicketDesign,
} from "@/lib/pass-design";
import { saveTicketDesign, sendTestTicketEmail } from "@/app/actions/ticket-design";

interface TicketStudioProps {
  initialConfig?: unknown;
  isPro: boolean;
  eventId?: string;
  eventName?: string;
  eventDate?: string;
  venue?: string;
  backHref?: string;
  ticketCategories?: Array<{ id: string; name: string }>;
}

// Curated brand color swatches
const COLOR_SWATCHES = [
  { name: "Indigo", hex: "#635BFF" },
  { name: "Electric Blue", hex: "#4F46E5" },
  { name: "Emerald", hex: "#059669" },
  { name: "Amber", hex: "#D97706" },
  { name: "Crimson", hex: "#DC2626" },
  { name: "Obsidian", hex: "#18181B" },
];

// Sample attendees for previewing real-world pass data
const SAMPLE_ATTENDEES = [
  {
    name: "Haarishmitha",
    ticketType: "VIP PASS",
    ticketId: "#URP-02891",
    qrValue: "URP_PASS_HAARISH_02891",
  },
  {
    name: "Arun Kumar",
    ticketType: "General Entry",
    ticketId: "#URP-04812",
    qrValue: "URP_PASS_ARUN_04812",
  },
  {
    name: "Priya Sharma",
    ticketType: "Speaker",
    ticketId: "#URP-07340",
    qrValue: "URP_PASS_PRIYA_07340",
  },
];

// Visual QR matrix generated deterministically
const QR_MATRIX = [
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1],
];

export default function TicketStudio({
  initialConfig,
  isPro,
  eventId,
  eventName = "URPASS SUMMIT",
  eventDate = "03 OCT 2026 | 10:00 AM",
  venue = "The Residency, Coimbatore",
  backHref = "/dashboard",
}: TicketStudioProps) {
  // 1. Initial State
  const [config, setConfig] = useState<TicketDesignConfig>(() =>
    sanitizeTicketDesign(initialConfig || {})
  );

  // 2. UI View State
  const [mobileTab, setMobileTab] = useState<"customize" | "preview">("customize");
  const [activeAttendeeIndex, setActiveAttendeeIndex] = useState(0);
  const sampleAttendee = SAMPLE_ATTENDEES[activeAttendeeIndex];

  // 3. Save & Autosave Status
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved" | "error">("saved");
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // 4. Test Email Modal State
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  // 5. Upload Loading States
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Refs for hidden file inputs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  // Track initial mount to prevent immediate autosave on load
  const isInitialMount = useRef(true);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Execute Save Action
  const performSave = useCallback(
    async (designToSave: TicketDesignConfig) => {
      setSaveStatus("saving");
      setSaveErrorMessage(null);
      try {
        const res = await saveTicketDesign(eventId || null, designToSave);
        if (res.error) {
          setSaveStatus("error");
          setSaveErrorMessage(res.error);
        } else {
          setSaveStatus("saved");
        }
      } catch (err) {
        setSaveStatus("error");
        setSaveErrorMessage(err instanceof Error ? err.message : "Failed to save design");
      }
    },
    [eventId]
  );

  // Debounced Autosave (800ms)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setSaveStatus("unsaved");

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      performSave(config);
    }, 800);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [config, performSave]);

  // Manual Immediate Save
  function handleManualSave() {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    startTransition(() => {
      performSave(config);
    });
  }

  // Upload handler for Logo & Background via Supabase Storage CDN endpoint
  async function handleFileUpload(file: File, type: "logo" | "background") {
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be under 5MB.");
      return;
    }

    setUploadError(null);
    if (type === "logo") setIsUploadingLogo(true);
    else setIsUploadingBg(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/studio/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || "Failed to upload image. Please try again.");
      }

      if (type === "logo") {
        setConfig((prev) => ({ ...prev, logoUrl: data.url }));
      } else {
        setConfig((prev) => ({ ...prev, backgroundImageUrl: data.url }));
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      if (type === "logo") setIsUploadingLogo(false);
      else setIsUploadingBg(false);
    }
  }

  // Reset Design to defaults
  function handleResetDesign() {
    if (window.confirm("Reset ticket design back to default settings?")) {
      setConfig({
        ...DEFAULT_TICKET_DESIGN,
        primaryColor: "#635BFF",
        template: "event",
      });
    }
  }

  // Send Test Ticket Email
  async function handleSendTestTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!testEmail || !testEmail.includes("@")) {
      setTestError("Please enter a valid email address.");
      return;
    }

    setIsSendingTest(true);
    setTestError(null);
    setTestSuccess(false);

    try {
      const res = await sendTestTicketEmail(testEmail, eventName, config);
      if (res.error) {
        setTestError(res.error);
      } else {
        setTestSuccess(true);
        setTimeout(() => {
          setTestModalOpen(false);
          setTestSuccess(false);
          setTestEmail("");
        }, 2200);
      }
    } catch (err) {
      setTestError(err instanceof Error ? err.message : "Failed to dispatch test pass.");
    } finally {
      setIsSendingTest(false);
    }
  }

  // Download Sample Pass (Trigger Print dialog)
  function handleDownloadSample() {
    window.print();
  }

  // Style attributes based on current template
  const isDark = config.template === "dark";
  const isMinimal = config.template === "minimal";
  const isEvent = config.template === "event";

  const cardBg = isDark ? "bg-[#121216] text-white" : "bg-white text-neutral-900";
  const cardBorder = isDark ? "border-neutral-800" : "border-neutral-200";
  const subtextCls = isDark ? "text-neutral-400" : "text-neutral-500";
  const dividerCls = isDark ? "border-neutral-800" : "border-neutral-100";

  return (
    <div className="fixed inset-0 z-50 flex flex-col w-screen h-screen overflow-hidden bg-neutral-100 font-sans select-none">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP APP BAR
      ───────────────────────────────────────────────────────────── */}
      <header className="h-14 border-b border-neutral-200 bg-white px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 px-2 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>

          <div className="h-4 w-px bg-neutral-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-neutral-900 tracking-tight">
              Ticket Studio
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-neutral-100 text-neutral-600 truncate max-w-[200px]">
              {eventName}
            </span>
          </div>
        </div>

        {/* Center: Mobile Tab Switcher */}
        <div className="flex md:hidden items-center bg-neutral-100 p-0.5 rounded-lg text-xs font-semibold text-neutral-600">
          <button
            type="button"
            onClick={() => setMobileTab("customize")}
            className={`px-3 py-1 rounded-md transition-all ${
              mobileTab === "customize"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Customize
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("preview")}
            className={`px-3 py-1 rounded-md transition-all ${
              mobileTab === "preview"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Live Preview
          </button>
        </div>

        {/* Right: Autosave Status & Manual Save */}
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 text-xs">
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1.5 text-neutral-400 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400" />
                <span>Saving...</span>
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold animate-in fade-in duration-200">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                <span>Saved</span>
              </span>
            )}
            {saveStatus === "unsaved" && (
              <span className="text-neutral-400 font-medium text-[11px]">
                Unsaved changes
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-red-500 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Save failed</span>
              </span>
            )}
          </div>

          {/* Manual Save Button */}
          <button
            type="button"
            onClick={handleManualSave}
            disabled={saveStatus === "saving" || isPending}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            {saveStatus === "saving" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>Save</span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN BODY: 2-COLUMN DESKTOP LAYOUT
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* ──────── LEFT COLUMN: CUSTOMIZE ──────── */}
        <aside
          className={`w-full md:w-[420px] lg:w-[450px] shrink-0 border-r border-neutral-200 bg-white flex flex-col h-full overflow-y-auto ${
            mobileTab === "customize" ? "block" : "hidden md:block"
          }`}
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="text-[11px] font-black tracking-widest text-neutral-400 uppercase">
                CUSTOMIZE
              </span>
              <span className="text-xs text-neutral-400">
                Live updates preview instantly
              </span>
            </div>

            {/* Error Banner if upload fails */}
            {uploadError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between">
                <span>{uploadError}</span>
                <button
                  type="button"
                  onClick={() => setUploadError(null)}
                  className="text-red-500 hover:text-red-700 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* 1. READY-MADE STYLES: Minimal · Event · Dark */}
            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2.5">
                Style
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {/* Minimal */}
                <button
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, template: "minimal" }))}
                  className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
                    isMinimal
                      ? "border-neutral-900 bg-neutral-50 ring-2 ring-neutral-900/10 shadow-xs"
                      : "border-neutral-200 hover:border-neutral-300 bg-white"
                  }`}
                >
                  <div className="w-8 h-10 rounded-md border border-neutral-300 bg-white flex flex-col items-center justify-center p-1 shadow-xs">
                    <div className="w-4 h-0.5 bg-neutral-300 rounded-full mb-1" />
                    <div className="w-4 h-4 bg-neutral-100 rounded-xs flex items-center justify-center">
                      <div className="w-2 h-2 bg-neutral-400 rounded-xs" />
                    </div>
                  </div>
                  <span className={`text-xs font-bold ${isMinimal ? "text-neutral-900" : "text-neutral-600"}`}>
                    Minimal
                  </span>
                </button>

                {/* Event */}
                <button
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, template: "event" }))}
                  className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
                    isEvent
                      ? "border-neutral-900 bg-neutral-50 ring-2 ring-neutral-900/10 shadow-xs"
                      : "border-neutral-200 hover:border-neutral-300 bg-white"
                  }`}
                >
                  <div className="w-8 h-10 rounded-md border border-neutral-300 bg-white overflow-hidden flex flex-col items-center shadow-xs">
                    <div className="w-full h-1.5 bg-brand shrink-0" style={{ backgroundColor: config.primaryColor }} />
                    <div className="flex-1 flex flex-col items-center justify-center p-1">
                      <div className="w-4 h-4 bg-neutral-100 rounded-xs flex items-center justify-center">
                        <div className="w-2 h-2 bg-neutral-800 rounded-xs" />
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold ${isEvent ? "text-neutral-900" : "text-neutral-600"}`}>
                    Event
                  </span>
                </button>

                {/* Dark */}
                <button
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, template: "dark" }))}
                  className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
                    isDark
                      ? "border-neutral-900 bg-neutral-50 ring-2 ring-neutral-900/10 shadow-xs"
                      : "border-neutral-200 hover:border-neutral-300 bg-white"
                  }`}
                >
                  <div className="w-8 h-10 rounded-md border border-neutral-700 bg-[#121216] flex flex-col items-center justify-center p-1 shadow-xs">
                    <div className="w-4 h-0.5 bg-neutral-600 rounded-full mb-1" />
                    <div className="w-4 h-4 bg-neutral-800 rounded-xs flex items-center justify-center border border-neutral-700">
                      <div className="w-2 h-2 rounded-xs" style={{ backgroundColor: config.primaryColor }} />
                    </div>
                  </div>
                  <span className={`text-xs font-bold ${isDark ? "text-neutral-900" : "text-neutral-600"}`}>
                    Dark
                  </span>
                </button>
              </div>
            </div>

            {/* 2. LOGO UPLOADER */}
            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                Logo
              </label>

              {config.logoUrl ? (
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 bg-white border border-neutral-200 rounded-lg flex items-center justify-center p-1 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={config.logoUrl}
                        alt="Event Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-800">Event Logo</p>
                      <p className="text-[10px] text-neutral-400">CDN synced & optimized</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={isUploadingLogo}
                      className="px-2.5 py-1 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-100 rounded-md transition-colors"
                    >
                      {isUploadingLogo ? "Uploading..." : "Change"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, logoUrl: null }))}
                      className="p-1 text-neutral-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                      title="Remove Logo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="w-full p-4 border-2 border-dashed border-neutral-200 hover:border-neutral-400 rounded-xl text-center flex flex-col items-center justify-center gap-1 transition-colors bg-neutral-50/50 hover:bg-neutral-50"
                >
                  {isUploadingLogo ? (
                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
                      <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
                      <span>Uploading logo to CDN...</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 mb-0.5">
                        <Upload className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-neutral-800">Upload logo</span>
                      <span className="text-[10px] text-neutral-400">PNG, SVG, JPG up to 5MB</span>
                    </>
                  )}
                </button>
              )}

              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "logo");
                  e.target.value = "";
                }}
              />
            </div>

            {/* 3. TICKET COLOR SWATCHES + CUSTOM HEX */}
            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2.5">
                Ticket color
              </label>

              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_SWATCHES.map((swatch) => {
                  const isSelected = config.primaryColor.toLowerCase() === swatch.hex.toLowerCase();
                  return (
                    <button
                      key={swatch.hex}
                      type="button"
                      title={swatch.name}
                      onClick={() => setConfig((prev) => ({ ...prev, primaryColor: swatch.hex }))}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-105 relative focus:outline-hidden"
                      style={{ backgroundColor: swatch.hex }}
                    >
                      {isSelected && (
                        <Check className="w-4 h-4 text-white stroke-[3] drop-shadow-xs" />
                      )}
                    </button>
                  );
                })}

                {/* Custom Color Input */}
                <div className="flex items-center gap-1.5 ml-1">
                  <label
                    htmlFor="custom-color-picker"
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center cursor-pointer hover:bg-neutral-50 relative overflow-hidden shrink-0 shadow-xs"
                    title="Choose custom color"
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: config.primaryColor }}
                    />
                    <input
                      id="custom-color-picker"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, primaryColor: e.target.value }))}
                      className="sr-only"
                    />
                  </label>

                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        setConfig((prev) => ({ ...prev, primaryColor: val }));
                      }
                    }}
                    maxLength={7}
                    placeholder="#635BFF"
                    className="w-20 px-2 py-1 text-xs font-mono border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 uppercase"
                  />
                </div>
              </div>
            </div>

            {/* 4. BACKGROUND: None vs Image */}
            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                Background
              </label>

              <div className="flex items-center gap-5 mb-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
                  <input
                    type="radio"
                    name="bgMode"
                    checked={!config.backgroundImageUrl}
                    onChange={() => setConfig((prev) => ({ ...prev, backgroundImageUrl: null }))}
                    className="w-4 h-4 text-neutral-900 border-neutral-300 focus:ring-0"
                  />
                  <span>None</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
                  <input
                    type="radio"
                    name="bgMode"
                    checked={!!config.backgroundImageUrl}
                    onChange={() => {
                      if (!config.backgroundImageUrl) {
                        bgInputRef.current?.click();
                      }
                    }}
                    className="w-4 h-4 text-neutral-900 border-neutral-300 focus:ring-0"
                  />
                  <span>Image</span>
                </label>
              </div>

              {/* Upload area or existing background image preview */}
              {config.backgroundImageUrl ? (
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-12 h-8 rounded bg-neutral-200 overflow-hidden border border-neutral-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={config.backgroundImageUrl}
                          alt="Background"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-semibold text-neutral-800">
                        Artwork active
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => bgInputRef.current?.click()}
                        disabled={isUploadingBg}
                        className="px-2 py-1 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-100 rounded-md transition-colors"
                      >
                        {isUploadingBg ? "Uploading..." : "Change"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, backgroundImageUrl: null }))}
                        className="p-1 text-neutral-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Contrast shield active — QR scannability guaranteed</span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => bgInputRef.current?.click()}
                  disabled={isUploadingBg}
                  className="w-full p-3 border border-neutral-200 hover:border-neutral-300 rounded-xl text-center flex items-center justify-center gap-2 transition-colors bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700"
                >
                  {isUploadingBg ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-500" />
                      <span>Uploading background to CDN...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Upload background image</span>
                    </>
                  )}
                </button>
              )}

              <input
                ref={bgInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "background");
                  e.target.value = "";
                }}
              />
            </div>

            {/* SEPARATOR */}
            <div className="border-t border-neutral-200 pt-4" />

            {/* 5. DISPLAY TOGGLES (CHECKBOXES) */}
            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
                Display
              </label>

              <div className="space-y-3">
                {/* Attendee Name */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showAttendeeName}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, showAttendeeName: e.target.checked }))
                    }
                    className="w-4 h-4 rounded-sm text-neutral-900 border-neutral-300 focus:ring-0"
                  />
                  <div className="text-xs">
                    <p className="font-semibold text-neutral-800">Attendee name</p>
                    <p className="text-[10px] text-neutral-400">Shows registered guest full name</p>
                  </div>
                </label>

                {/* Ticket Type */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showTicketType}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, showTicketType: e.target.checked }))
                    }
                    className="w-4 h-4 rounded-sm text-neutral-900 border-neutral-300 focus:ring-0"
                  />
                  <div className="text-xs">
                    <p className="font-semibold text-neutral-800">Ticket type</p>
                    <p className="text-[10px] text-neutral-400">Shows pass tier pill (e.g. VIP PASS)</p>
                  </div>
                </label>

                {/* Event Date */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showEventDate !== false}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, showEventDate: e.target.checked }))
                    }
                    className="w-4 h-4 rounded-sm text-neutral-900 border-neutral-300 focus:ring-0"
                  />
                  <div className="text-xs">
                    <p className="font-semibold text-neutral-800">Event date</p>
                    <p className="text-[10px] text-neutral-400">Shows formatted date and start time</p>
                  </div>
                </label>

                {/* Venue */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showVenue}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, showVenue: e.target.checked }))
                    }
                    className="w-4 h-4 rounded-sm text-neutral-900 border-neutral-300 focus:ring-0"
                  />
                  <div className="text-xs">
                    <p className="font-semibold text-neutral-800">Venue</p>
                    <p className="text-[10px] text-neutral-400">Shows physical location or online platform</p>
                  </div>
                </label>
              </div>
            </div>

            {/* SEPARATOR */}
            <div className="border-t border-neutral-200 pt-2" />

            {/* 6. RESET DESIGN */}
            <div>
              <button
                type="button"
                onClick={handleResetDesign}
                className="w-full py-2 px-3 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset design</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ──────── RIGHT COLUMN: LIVE PREVIEW ──────── */}
        <main
          className={`flex-1 bg-neutral-100/90 flex flex-col h-full overflow-y-auto items-center justify-center p-4 sm:p-6 lg:p-8 ${
            mobileTab === "preview" ? "flex" : "hidden md:flex"
          }`}
          style={{
            backgroundImage: "radial-gradient(#d4d4d8 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          <div className="w-full max-w-[360px] flex flex-col items-center">
            {/* Live Preview Label & Sample Attendee Pill Switcher */}
            <div className="w-full flex items-center justify-between mb-3 px-1 text-xs">
              <span className="text-[10px] font-black tracking-widest uppercase text-neutral-400">
                LIVE PREVIEW
              </span>

              {/* Sample Attendee Quick Switcher */}
              <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xs p-0.5 rounded-lg border border-neutral-200/80 shadow-2xs">
                {SAMPLE_ATTENDEES.map((att, i) => (
                  <button
                    key={att.ticketId}
                    type="button"
                    onClick={() => setActiveAttendeeIndex(i)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                      activeAttendeeIndex === i
                        ? "bg-neutral-900 text-white shadow-2xs"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {att.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                REALISTIC TICKET PASS (Locked Information Hierarchy):
                Event logo → Event name → Ticket type → QR → Attendee name → Ticket ID → Date/venue
            ───────────────────────────────────────────────────────── */}
            <div
              className={`relative w-full rounded-2xl border ${cardBorder} ${cardBg} overflow-hidden shadow-lg select-none transition-all duration-200`}
              style={{
                boxShadow: isDark
                  ? "0 10px 30px -5px rgba(0, 0, 0, 0.6)"
                  : "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
              }}
            >
              {/* Optional Background Image with automatic contrast shield */}
              {config.backgroundImageUrl && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={config.backgroundImageUrl}
                    alt="Ticket Background Artwork"
                    className="w-full h-full object-cover opacity-15"
                  />
                  <div
                    className={`absolute inset-0 ${
                      isDark
                        ? "bg-gradient-to-b from-[#121216]/90 via-[#121216]/85 to-[#121216]/95"
                        : "bg-gradient-to-b from-white/90 via-white/85 to-white/95"
                    }`}
                  />
                </div>
              )}

              {/* Event Template Top Accent Strip */}
              {isEvent && (
                <div
                  className="h-2 w-full relative z-10"
                  style={{ backgroundColor: config.primaryColor }}
                />
              )}

              {/* Ticket Content Container */}
              <div className="relative z-10 p-6 flex flex-col items-center text-center">
                {/* 1. EVENT LOGO */}
                <div className="mb-3.5 flex items-center justify-center">
                  {config.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={config.logoUrl}
                      alt="Event Logo"
                      className="h-8 max-w-[130px] object-contain"
                    />
                  ) : (
                    <span
                      className="text-[11px] font-black tracking-widest uppercase"
                      style={{ color: isDark ? "#ffffff" : "#111827" }}
                    >
                      URPASS
                    </span>
                  )}
                </div>

                {/* 2. EVENT NAME */}
                <h2 className="text-xl font-bold tracking-tight mb-2 uppercase leading-snug max-w-xs">
                  {eventName}
                </h2>

                {/* 3. TICKET TYPE PILL (if toggled) */}
                {config.showTicketType && (
                  <div className="mb-3">
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border shadow-2xs"
                      style={{
                        borderColor: `${config.primaryColor}35`,
                        color: config.primaryColor,
                        backgroundColor: `${config.primaryColor}12`,
                      }}
                    >
                      <TicketIcon className="w-3 h-3" />
                      {sampleAttendee.ticketType}
                    </span>
                  </div>
                )}

                {/* 4. LARGE CENTERED QR CODE CARD (Clean Contrast Shield) */}
                <div className="my-2 flex flex-col items-center">
                  <div
                    className="p-4 bg-white rounded-2xl shadow-xs border border-neutral-100 flex flex-col items-center justify-center"
                    title={`QR Token: ${sampleAttendee.qrValue}`}
                  >
                    <div className="w-36 h-36 flex flex-col justify-between">
                      {QR_MATRIX.map((row, rIdx) => (
                        <div key={rIdx} className="flex justify-between w-full h-[7px]">
                          {row.map((cell, cIdx) => (
                            <div
                              key={cIdx}
                              className={`w-[7px] h-[7px] ${cell === 1 ? "bg-black" : "bg-white"}`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                    <span className="text-[9px] font-black tracking-widest text-neutral-400 uppercase mt-2">
                      SCAN FOR ENTRY
                    </span>
                  </div>
                </div>

                {/* 5. ATTENDEE NAME (if toggled) */}
                {config.showAttendeeName && (
                  <div className="mt-2 mb-1">
                    <p className="text-base font-bold tracking-tight">
                      {sampleAttendee.name}
                    </p>
                  </div>
                )}

                {/* 6. TICKET ID (if toggled) */}
                {config.showTicketId && (
                  <div className="mb-2 flex items-center justify-center gap-1.5">
                    <span className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">
                      TICKET ID
                    </span>
                    <span className="text-xs font-mono font-semibold tracking-wider">
                      {sampleAttendee.ticketId}
                    </span>
                  </div>
                )}

                {/* 7. DATE & VENUE (if toggled) */}
                {(config.showEventDate !== false || (config.showVenue && venue)) && (
                  <div className={`w-full border-t ${dividerCls} pt-3 mt-2 flex flex-col items-center gap-1`}>
                    {config.showEventDate !== false && eventDate && (
                      <p className={`text-xs font-semibold tracking-wide ${subtextCls} flex items-center gap-1.5`}>
                        <Calendar className="w-3.5 h-3.5 opacity-70 shrink-0" />
                        <span>{eventDate}</span>
                      </p>
                    )}
                    {config.showVenue && venue && (
                      <p className={`text-xs ${subtextCls} flex items-center gap-1.5`}>
                        <MapPin className="w-3.5 h-3.5 opacity-70 shrink-0" />
                        <span className="truncate max-w-[240px]">{venue}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                BOTTOM PREVIEW ACTIONS: Send test · Download sample
            ───────────────────────────────────────────────────────── */}
            <div className="w-full flex items-center justify-center gap-3 mt-5">
              <button
                type="button"
                onClick={() => setTestModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 text-neutral-800 text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                <span>Send test</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSample}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 text-neutral-800 text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-neutral-500" />
                <span>Download sample</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SEND TEST TICKET MODAL
      ───────────────────────────────────────────────────────────── */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Send Test Ticket
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              We&apos;ll send a realistic preview pass with your custom brand colors, logo, and layout directly to your inbox.
            </p>

            {testError && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                {testError}
              </div>
            )}

            {testSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Test ticket sent! Check your inbox.</span>
              </div>
            )}

            <form onSubmit={handleSendTestTicket} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="organizer@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTestModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingTest}
                  className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  {isSendingTest ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send Pass</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
