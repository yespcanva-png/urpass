"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Smartphone,
  CreditCard,
  FileText,
  X,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Undo2,
  Redo2,
  Sparkles,
  GripVertical,
} from "lucide-react";
import {
  type TicketDesignConfig,
  type TicketTemplate,
  type TicketShape,
  DEFAULT_TICKET_DESIGN,
  sanitizeTicketDesign,
} from "@/lib/pass-design";
import {
  STUDIO_TEMPLATES,
  type StudioTemplateDefinition,
  convertStudioTemplateToTicketDesign,
} from "@/lib/studio/templates";
import StudioUpgradeModal from "./StudioUpgradeModal";
import { getStudioPlanLimits } from "@/lib/studio/limits";
import type { PlanSlug } from "@/lib/plan";

interface TicketStudioProps {
  initialConfig?: unknown;
  isPro: boolean;
  userPlanTier?: PlanSlug | string;
  eventId?: string;
  eventName?: string;
  eventDate?: string;
  venue?: string;
  backHref?: string;
  ticketCategories?: Array<{ id: string; name: string }>;
}

type TicketOutputFormat = "mobile" | "badge" | "print";

const BRAND_SWATCHES = [
  { name: "Indigo", hex: "#635BFF" },
  { name: "Electric Blue", hex: "#4F46E5" },
  { name: "Emerald", hex: "#059669" },
  { name: "Amber", hex: "#D97706" },
  { name: "Crimson", hex: "#DC2626" },
  { name: "Obsidian", hex: "#18181B" },
];

const DEFAULT_CATEGORIES = [
  { id: "vip", name: "VIP" },
  { id: "general", name: "General" },
  { id: "speaker", name: "Speaker" },
];

const SAMPLE_ATTENDEES = [
  {
    name: "Aarav Mehta",
    ticketType: "VIP Delegate",
    ticketId: "#URP-02891",
    organization: "TechCorp Labs",
    designation: "Product Lead",
    phone: "+91 98765 43210",
    regNumber: "REG-2026-089",
    qrValue: "URP_PASS_AARAV_02891",
    email: "aarav.mehta@example.com",
  },
  {
    name: "Priya Sharma",
    ticketType: "Speaker",
    ticketId: "#URP-07340",
    organization: "Design Hub India",
    designation: "Design Director",
    phone: "+91 91234 56789",
    regNumber: "REG-2026-004",
    qrValue: "URP_PASS_PRIYA_07340",
    email: "priya.sharma@example.com",
  },
  {
    name: "Arun Kumar",
    ticketType: "General Entry",
    ticketId: "#URP-04812",
    organization: "Anna University",
    designation: "Researcher",
    phone: "+91 98401 23456",
    regNumber: "REG-2026-112",
    qrValue: "URP_PASS_ARUN_04812",
    email: "arun.kumar@example.com",
  },
];

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
  userPlanTier,
  eventId,
  eventName = "URPASS Summit 2026",
  eventDate = "12 Oct 2026 | 10:00 AM",
  venue = "Bengaluru",
  backHref = "/dashboard",
  ticketCategories = [],
}: TicketStudioProps) {
  const planTier = userPlanTier || (isPro ? "pro" : "free");
  const limits = getStudioPlanLimits(planTier);

  // 1. Core Config State & History for Undo/Redo
  const [config, setConfig] = useState<TicketDesignConfig>(() =>
    sanitizeTicketDesign(initialConfig || {})
  );

  const [history, setHistory] = useState<TicketDesignConfig[]>([config]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isHistoryNavigating = useRef(false);

  // Track config changes in history
  const updateConfig = useCallback(
    (updater: (prev: TicketDesignConfig) => TicketDesignConfig) => {
      setConfig((prev) => {
        const next = updater(prev);
        if (!isHistoryNavigating.current) {
          setHistory((h) => [...h.slice(0, historyIndex + 1), next]);
          setHistoryIndex((idx) => idx + 1);
        }
        return next;
      });
    },
    [historyIndex]
  );

  function handleUndo() {
    if (historyIndex > 0) {
      isHistoryNavigating.current = true;
      const prev = history[historyIndex - 1];
      setHistoryIndex((idx) => idx - 1);
      setConfig(prev);
      setTimeout(() => {
        isHistoryNavigating.current = false;
      }, 50);
    }
  }

  function handleRedo() {
    if (historyIndex < history.length - 1) {
      isHistoryNavigating.current = true;
      const next = history[historyIndex + 1];
      setHistoryIndex((idx) => idx + 1);
      setConfig(next);
      setTimeout(() => {
        isHistoryNavigating.current = false;
      }, 50);
    }
  }

  // 2. Collapsible Sections in Left Panel
  const [openSections, setOpenSections] = useState({
    template: true,
    branding: true,
    content: true,
    qr: false,
    background: false,
    advanced: false,
  });

  const toggleSection = (sectionKey: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // 3. Preview Controls State
  const [activeFormat, setActiveFormat] = useState<TicketOutputFormat>("mobile");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeAttendeeIndex, setActiveAttendeeIndex] = useState<number>(0);
  const sampleAttendee = SAMPLE_ATTENDEES[activeAttendeeIndex];

  // Mobile viewport view tab
  const [mobileTab, setMobileTab] = useState<"controls" | "preview">("controls");

  // 4. Modals State
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeFeatureName, setUpgradeFeatureName] = useState<string | undefined>(undefined);

  function triggerUpgrade(featureName: string) {
    setUpgradeFeatureName(featureName);
    setUpgradeModalOpen(true);
  }

  // 5. Save & Autosave State
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved" | "error">("saved");
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [isManualSaving, setIsManualSaving] = useState(false);

  // 6. Test Email Modal State
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  // 7. File Upload States
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingSponsorLogo, setIsUploadingSponsorLogo] = useState(false);
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const sponsorLogoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  // Autosave setup
  const isInitialMount = useRef(true);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const performSave = useCallback(
    async (designToSave: TicketDesignConfig, targetEventId: string | null = eventId || null) => {
      setSaveStatus("saving");
      setSaveErrorMessage(null);
      try {
        const response = await fetch("/api/studio/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: targetEventId,
            design: designToSave,
          }),
        });

        const data = await response.json().catch(() => null);
        if (!response.ok || !data?.success) {
          setSaveStatus("error");
          setSaveErrorMessage(data?.error || `Failed to save design (${response.status})`);
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

  // Manual save handler
  async function handleManualSave(asOrgTemplate = false) {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    setIsManualSaving(true);
    await performSave(config, asOrgTemplate ? null : eventId || null);
    setIsManualSaving(false);
  }

  // Upload handler for Logo, Sponsor Logo & Background
  async function handleFileUpload(file: File, type: "logo" | "sponsor" | "background") {
    if (type === "background" && !limits.canUploadBackground) {
      triggerUpgrade("Custom Background Artwork");
      return;
    }
    if (type === "sponsor" && !limits.canUploadSponsorLogo) {
      triggerUpgrade("Sponsor & Partner Logos");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be under 5MB.");
      return;
    }

    setUploadError(null);
    if (type === "logo") setIsUploadingLogo(true);
    else if (type === "sponsor") setIsUploadingSponsorLogo(true);
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
        updateConfig((prev) => ({ ...prev, logoUrl: data.url }));
      } else if (type === "sponsor") {
        updateConfig((prev) => ({ ...prev, sponsorLogoUrl: data.url }));
      } else {
        updateConfig((prev) => ({ ...prev, backgroundImageUrl: data.url }));
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      if (type === "logo") setIsUploadingLogo(false);
      else if (type === "sponsor") setIsUploadingSponsorLogo(false);
      else setIsUploadingBg(false);
    }
  }

  // Categories list
  const categoriesToUse =
    ticketCategories && ticketCategories.length > 0
      ? ticketCategories
      : DEFAULT_CATEGORIES;

  function handleSetCategoryColor(categoryKey: string, hexColor: string) {
    if (!limits.canUseCategoryColors) {
      triggerUpgrade("Multi-Tier Category Colors");
      return;
    }
    updateConfig((prev) => ({
      ...prev,
      categoryColors: {
        ...(prev.categoryColors || {}),
        [categoryKey]: hexColor,
      },
    }));
  }

  // Reset Design to defaults
  function handleResetDesign() {
    if (window.confirm("Reset ticket design back to default settings?")) {
      updateConfig(() => ({
        ...DEFAULT_TICKET_DESIGN,
        primaryColor: "#635BFF",
        template: "event",
        shape: "standard",
      }));
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
      const res = await fetch("/api/studio/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: testEmail,
          eventName,
          config,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        setTestError(data?.error || `Failed to dispatch test pass (${res.status})`);
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

  // Download Sample Pass (Print dialog)
  function handleDownloadSample() {
    window.print();
  }

  // Style attributes based on current template
  const isDark = config.template === "dark";
  const isMinimal = config.template === "minimal";
  const isEvent = config.template === "event";

  const activeColor =
    (sampleAttendee.ticketType && config.categoryColors?.[sampleAttendee.ticketType]) ||
    config.primaryColor;

  const shapeRadius =
    config.shape === "rounded"
      ? "rounded-[24px]"
      : config.shape === "compact"
      ? "rounded-xl"
      : "rounded-2xl";

  const cardBg = isDark ? "bg-[#121216] text-white" : "bg-white text-neutral-900";
  const cardBorder = isDark ? "border-neutral-800" : "border-neutral-200";
  const subtextCls = isDark ? "text-neutral-400" : "text-neutral-500";
  const dividerCls = isDark ? "border-neutral-800" : "border-neutral-100";

  // Rules List
  const rulesList: string[] = [];
  if (config.showSingleEntryRule !== false) rulesList.push("Valid for one entry");
  if (config.showGateNotice !== false) rulesList.push("Keep this QR ready at the gate");
  if (config.customInstruction) rulesList.push(config.customInstruction);

  // Template name detection
  const currentTemplateName =
    config.template === "minimal"
      ? "Minimal Monochrome"
      : config.template === "dark"
      ? "Dark Obsidian"
      : config.template === "modern"
      ? "Corporate Executive"
      : "Standard Event Pass";

  return (
    <div className="flex flex-col h-screen bg-[#F5F6F7] text-neutral-900 overflow-hidden font-sans select-none">
      {/* ─────────────────────────────────────────────────────────────
          TOP APP HEADER
      ───────────────────────────────────────────────────────────── */}
      <header className="h-13 border-b border-neutral-200 bg-white px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        {/* Left: Back & Project Info */}
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 px-2 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="h-4 w-px bg-neutral-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-900">
              Ticket Studio
            </span>
            <span className="text-neutral-400 text-xs hidden sm:inline">/</span>
            <span className="text-xs font-normal text-neutral-500 truncate max-w-[180px] hidden sm:inline">
              {eventName}
            </span>

            {/* Plan Tier Badge */}
            <span
              className={`hidden md:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                limits.isPro
                  ? "bg-violet-50 text-violet-700 border border-violet-200"
                  : "bg-neutral-100 text-neutral-600 border border-neutral-200"
              }`}
            >
              {limits.planTier}
            </span>
          </div>
        </div>

        {/* Center: Undo / Redo & Mobile View Switcher */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="hidden sm:flex items-center gap-0.5 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200/80">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              aria-label="Undo"
              title="Undo"
              className="p-1 rounded text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              aria-label="Redo"
              title="Redo"
              className="p-1 rounded text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Tab Switcher */}
          <div className="flex md:hidden items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200 text-xs font-medium">
            <button
              type="button"
              onClick={() => setMobileTab("controls")}
              className={`px-3 py-1 rounded-md transition-all ${
                mobileTab === "controls"
                  ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Controls
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("preview")}
              className={`px-3 py-1 rounded-md transition-all ${
                mobileTab === "preview"
                  ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Right: Autosave Status & Primary Action */}
        <div className="flex items-center gap-3">
          {/* Quiet Status */}
          <div className="flex items-center gap-1.5 text-xs">
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1.5 text-neutral-400 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1.5 text-neutral-500 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                <span className="hidden sm:inline">Saved</span>
              </span>
            )}
            {saveStatus === "unsaved" && (
              <span className="text-neutral-400 font-normal text-[11px] hidden sm:inline">
                Unsaved changes
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-red-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save error</span>
              </span>
            )}
          </div>

          {/* Top Send Test Action */}
          <button
            type="button"
            onClick={() => setTestModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-neutral-500" />
            <span>Send Test</span>
          </button>

          {/* Top Manual Save */}
          <button
            type="button"
            onClick={() => handleManualSave(false)}
            disabled={isManualSaving || saveStatus === "saving"}
            className="h-9 px-3.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            {isManualSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>{eventId ? "Save & Apply" : "Save Design"}</span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MAIN 2-PANEL EDITOR WORKSPACE
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* ──────── LEFT CONTROL PANEL (35–40% width) ──────── */}
        <aside
          className={`w-full md:w-[380px] lg:w-[410px] xl:w-[430px] shrink-0 border-r border-neutral-200 bg-white flex flex-col h-full overflow-hidden ${
            mobileTab === "controls" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Scrollable Controls Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {uploadError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center justify-between">
                <span>{uploadError}</span>
                <button
                  type="button"
                  onClick={() => setUploadError(null)}
                  className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════
                SECTION 1: TEMPLATE
            ═════════════════════════════════════════════════════════ */}
            <div className="border-b border-neutral-200/80 pb-5">
              <button
                type="button"
                onClick={() => toggleSection("template")}
                className="flex items-center justify-between w-full text-left py-1 cursor-pointer group"
              >
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">
                    1. Template
                  </h3>
                  <p className="text-xs text-neutral-500 font-normal mt-0.5">
                    Selected base layout and structure
                  </p>
                </div>
                {openSections.template ? (
                  <ChevronUp className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
                )}
              </button>

              {openSections.template && (
                <div className="mt-3.5 space-y-3 pt-1">
                  {/* Selected Template Display Box */}
                  <div className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                    <div>
                      <p className="text-xs font-semibold text-neutral-900">
                        {currentTemplateName}
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-0.5 font-normal">
                        Production pass layout
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsTemplateModalOpen(true)}
                      className="px-2.5 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer shadow-2xs"
                    >
                      Change Template
                    </button>
                  </div>

                  {/* Quick Style Switcher */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {[
                      { id: "minimal", label: "Minimal" },
                      { id: "event", label: "Event" },
                      { id: "dark", label: "Dark", pro: true },
                      { id: "modern", label: "Modern" },
                    ].map((tplOpt) => {
                      const isActive = config.template === tplOpt.id;
                      const isLocked = tplOpt.pro && !limits.canUseAllTemplates;
                      return (
                        <button
                          key={tplOpt.id}
                          type="button"
                          onClick={() => {
                            if (isLocked) {
                              triggerUpgrade("Dark Obsidian VIP Theme");
                              return;
                            }
                            updateConfig((prev) => ({
                              ...prev,
                              template: tplOpt.id as TicketTemplate,
                            }));
                          }}
                          className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer relative ${
                            isActive
                              ? "border-neutral-900 bg-neutral-900 text-white font-medium shadow-2xs"
                              : "border-neutral-200 text-neutral-600 hover:border-neutral-300 bg-white text-xs"
                          }`}
                        >
                          <span className="text-xs">{tplOpt.label}</span>
                          {isLocked && (
                            <span className="absolute -top-1.5 -right-1 px-1 py-0.2 rounded text-[8px] font-bold bg-violet-600 text-white">
                              PRO
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ═════════════════════════════════════════════════════════
                SECTION 2: BRANDING
            ═════════════════════════════════════════════════════════ */}
            <div className="border-b border-neutral-200/80 pb-5">
              <button
                type="button"
                onClick={() => toggleSection("branding")}
                className="flex items-center justify-between w-full text-left py-1 cursor-pointer group"
              >
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">
                    2. Branding
                  </h3>
                  <p className="text-xs text-neutral-500 font-normal mt-0.5">
                    Logo mark and primary brand color
                  </p>
                </div>
                {openSections.branding ? (
                  <ChevronUp className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
                )}
              </button>

              {openSections.branding && (
                <div className="mt-3.5 space-y-4 pt-1">
                  {/* Logo Upload Box */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Event Logo
                    </label>

                    {config.logoUrl ? (
                      <div className="flex items-center justify-between p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-md bg-white border border-neutral-200 p-1 flex items-center justify-center overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={config.logoUrl}
                              alt="Event Logo"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-neutral-800">
                              Logo uploaded
                            </p>
                            <p className="text-[11px] text-neutral-400 font-normal">
                              Optimized for pass
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => logoInputRef.current?.click()}
                            disabled={isUploadingLogo}
                            className="px-2.5 py-1 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                          >
                            {isUploadingLogo ? "Uploading..." : "Replace"}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateConfig((prev) => ({ ...prev, logoUrl: null }))}
                            className="p-1 text-neutral-400 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                            title="Remove Logo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                        <div>
                          <p className="text-xs font-medium text-neutral-800">
                            Add your logo
                          </p>
                          <p className="text-[11px] text-neutral-400">
                            PNG, SVG, JPG up to 5MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          disabled={isUploadingLogo}
                          className="px-3 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-800 text-xs font-medium rounded-lg transition-colors cursor-pointer shadow-2xs"
                        >
                          {isUploadingLogo ? "Uploading..." : "Upload Logo"}
                        </button>
                      </div>
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

                  {/* Brand Color Selector */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Brand Color
                    </label>

                    <div className="flex items-center gap-2">
                      {/* Swatch & Hex input */}
                      <div className="h-10 px-2.5 bg-white border border-neutral-200 rounded-lg flex items-center gap-2 flex-1">
                        <label
                          htmlFor="primary-color-picker"
                          className="w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center cursor-pointer shrink-0 overflow-hidden shadow-2xs"
                          title="Pick custom color"
                        >
                          <div
                            className="w-full h-full"
                            style={{ backgroundColor: config.primaryColor }}
                          />
                          <input
                            id="primary-color-picker"
                            type="color"
                            value={config.primaryColor}
                            onChange={(e) =>
                              updateConfig((prev) => ({ ...prev, primaryColor: e.target.value }))
                            }
                            className="sr-only"
                          />
                        </label>

                        <input
                          type="text"
                          value={config.primaryColor}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                              updateConfig((prev) => ({ ...prev, primaryColor: val }));
                            }
                          }}
                          maxLength={7}
                          placeholder="#635BFF"
                          className="w-full text-xs font-mono font-medium text-neutral-800 uppercase focus:outline-hidden"
                        />
                      </div>

                      {/* Swatch dots */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {BRAND_SWATCHES.map((swatch) => (
                          <button
                            key={swatch.hex}
                            type="button"
                            title={swatch.name}
                            onClick={() =>
                              updateConfig((prev) => ({ ...prev, primaryColor: swatch.hex }))
                            }
                            className="w-6 h-6 rounded-full border border-neutral-200/80 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-2xs"
                            style={{ backgroundColor: swatch.hex }}
                          >
                            {config.primaryColor.toLowerCase() === swatch.hex.toLowerCase() && (
                              <Check className="w-3 h-3 text-white stroke-[3]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Multi-Tier Category Accent Colors */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-neutral-700">
                        Category Colors
                      </label>
                      {!limits.canUseCategoryColors && (
                        <span className="text-[10px] font-bold text-violet-600 uppercase">
                          Pro
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {categoriesToUse.map((cat) => {
                        const catColor =
                          config.categoryColors?.[cat.name] || config.primaryColor;
                        return (
                          <div
                            key={cat.id}
                            className="flex items-center justify-between px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                          >
                            <span className="font-medium text-neutral-700">{cat.name}</span>
                            <div className="flex items-center gap-2">
                              <label className="w-4 h-4 rounded-full border border-neutral-300 overflow-hidden cursor-pointer">
                                <input
                                  type="color"
                                  value={catColor}
                                  onChange={(e) => handleSetCategoryColor(cat.name, e.target.value)}
                                  className="sr-only"
                                />
                                <div
                                  className="w-full h-full"
                                  style={{ backgroundColor: catColor }}
                                />
                              </label>
                              <span className="text-[11px] font-mono text-neutral-500 uppercase">
                                {catColor}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sponsor / Partner Logo */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Sponsor Logo (Optional)
                    </label>

                    {config.sponsorLogoUrl ? (
                      <div className="flex items-center justify-between p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded bg-white border border-neutral-200 p-0.5 flex items-center justify-center overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={config.sponsorLogoUrl}
                              alt="Sponsor"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-xs text-neutral-800 font-medium">
                            Sponsor mark active
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => sponsorLogoInputRef.current?.click()}
                            disabled={isUploadingSponsorLogo}
                            className="px-2 py-1 text-xs text-neutral-700 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateConfig((prev) => ({ ...prev, sponsorLogoUrl: null }))
                            }
                            className="p-1 text-neutral-400 hover:text-red-600 rounded-md"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (!limits.canUploadSponsorLogo) {
                            triggerUpgrade("Sponsor & Partner Logos");
                            return;
                          }
                          sponsorLogoInputRef.current?.click();
                        }}
                        disabled={isUploadingSponsorLogo}
                        className="w-full h-10 px-3 border border-neutral-200 hover:border-neutral-300 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-xs font-medium text-neutral-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Upload Sponsor Logo</span>
                      </button>
                    )}

                    <input
                      ref={sponsorLogoInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "sponsor");
                        e.target.value = "";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ═════════════════════════════════════════════════════════
                SECTION 3: TICKET CONTENT
            ═════════════════════════════════════════════════════════ */}
            <div className="border-b border-neutral-200/80 pb-5">
              <button
                type="button"
                onClick={() => toggleSection("content")}
                className="flex items-center justify-between w-full text-left py-1 cursor-pointer group"
              >
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">
                    3. Ticket Content
                  </h3>
                  <p className="text-xs text-neutral-500 font-normal mt-0.5">
                    Select attendee fields displayed on the pass
                  </p>
                </div>
                {openSections.content ? (
                  <ChevronUp className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
                )}
              </button>

              {openSections.content && (
                <div className="mt-3.5 space-y-1.5 pt-1">
                  {[
                    {
                      key: "showAttendeeName",
                      label: "Attendee name",
                      checked: config.showAttendeeName,
                      sample: sampleAttendee.name,
                    },
                    {
                      key: "showTicketType",
                      label: "Ticket type",
                      checked: config.showTicketType,
                      sample: sampleAttendee.ticketType,
                    },
                    {
                      key: "showEventDate",
                      label: "Event date",
                      checked: config.showEventDate !== false,
                      sample: eventDate,
                    },
                    {
                      key: "showVenue",
                      label: "Venue",
                      checked: config.showVenue,
                      sample: venue,
                    },
                    {
                      key: "showTicketId",
                      label: "Ticket ID",
                      checked: config.showTicketId,
                      sample: sampleAttendee.ticketId,
                    },
                    {
                      key: "showOrganization",
                      label: "Company",
                      checked: !!config.showOrganization,
                      sample: sampleAttendee.organization,
                    },
                    {
                      key: "showPhone",
                      label: "Phone number",
                      checked: !!config.showPhone,
                      sample: sampleAttendee.phone,
                    },
                    {
                      key: "showRegistrationNumber",
                      label: "Registration number",
                      checked: !!config.showRegistrationNumber,
                      sample: sampleAttendee.regNumber,
                    },
                  ].map((field) => (
                    <label
                      key={field.key}
                      className="flex items-center justify-between p-2.5 bg-neutral-50/70 hover:bg-neutral-50 border border-neutral-200/80 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3.5 h-3.5 text-neutral-300" />
                        <input
                          type="checkbox"
                          checked={field.checked}
                          onChange={(e) =>
                            updateConfig((prev) => ({
                              ...prev,
                              [field.key]: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 rounded text-neutral-900 border-neutral-300 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-xs font-medium text-neutral-800">
                          {field.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400 font-normal truncate max-w-[120px]">
                        {field.sample}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* ═════════════════════════════════════════════════════════
                SECTION 4: QR / PASS SETTINGS
            ═════════════════════════════════════════════════════════ */}
            <div className="border-b border-neutral-200/80 pb-5">
              <button
                type="button"
                onClick={() => toggleSection("qr")}
                className="flex items-center justify-between w-full text-left py-1 cursor-pointer group"
              >
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">
                    4. QR / Pass Settings
                  </h3>
                  <p className="text-xs text-neutral-500 font-normal mt-0.5">
                    Corner radius and scan readability
                  </p>
                </div>
                {openSections.qr ? (
                  <ChevronUp className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
                )}
              </button>

              {openSections.qr && (
                <div className="mt-3.5 space-y-4 pt-1">
                  {/* Shape Selector */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Pass Corner Shape
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "standard", label: "Standard", desc: "16px radius" },
                        { id: "rounded", label: "Rounded", desc: "24px radius" },
                        { id: "compact", label: "Compact", desc: "12px radius" },
                      ].map((shapeOpt) => {
                        const isActive = (config.shape || "standard") === shapeOpt.id;
                        return (
                          <button
                            key={shapeOpt.id}
                            type="button"
                            onClick={() =>
                              updateConfig((prev) => ({
                                ...prev,
                                shape: shapeOpt.id as TicketShape,
                              }))
                            }
                            className={`py-2 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                              isActive
                                ? "border-neutral-900 bg-neutral-50 font-semibold text-neutral-900"
                                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                            }`}
                          >
                            <p className="text-xs">{shapeOpt.label}</p>
                            <p className="text-[10px] text-neutral-400 font-normal mt-0.5">
                              {shapeOpt.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Contrast & Scan Reliability Warning */}
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Keep sufficient contrast for reliable scanning. URPASS isolates the QR target with a guaranteed safety container.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ═════════════════════════════════════════════════════════
                SECTION 5: BACKGROUND
            ═════════════════════════════════════════════════════════ */}
            <div className="border-b border-neutral-200/80 pb-5">
              <button
                type="button"
                onClick={() => toggleSection("background")}
                className="flex items-center justify-between w-full text-left py-1 cursor-pointer group"
              >
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">
                    5. Background
                  </h3>
                  <p className="text-xs text-neutral-500 font-normal mt-0.5">
                    Ticket backdrop artwork and texture
                  </p>
                </div>
                {openSections.background ? (
                  <ChevronUp className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
                )}
              </button>

              {openSections.background && (
                <div className="mt-3.5 space-y-3 pt-1">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-700">
                      <input
                        type="radio"
                        name="bgMode"
                        checked={!config.backgroundImageUrl}
                        onChange={() =>
                          updateConfig((prev) => ({ ...prev, backgroundImageUrl: null }))
                        }
                        className="w-4 h-4 text-neutral-900 border-neutral-300 focus:ring-0"
                      />
                      <span>No background selected</span>
                    </label>

                    <label
                      onClick={(e) => {
                        if (!limits.canUploadBackground) {
                          e.preventDefault();
                          triggerUpgrade("Custom Background Artwork");
                        }
                      }}
                      className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-700"
                    >
                      <input
                        type="radio"
                        name="bgMode"
                        checked={!!config.backgroundImageUrl}
                        onChange={() => {
                          if (!limits.canUploadBackground) {
                            triggerUpgrade("Custom Background Artwork");
                            return;
                          }
                          if (!config.backgroundImageUrl) {
                            bgInputRef.current?.click();
                          }
                        }}
                        className="w-4 h-4 text-neutral-900 border-neutral-300 focus:ring-0"
                      />
                      <span>Image artwork</span>
                    </label>
                  </div>

                  {config.backgroundImageUrl ? (
                    <div className="flex items-center justify-between p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-8 rounded bg-neutral-200 overflow-hidden border border-neutral-300">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={config.backgroundImageUrl}
                            alt="Background"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs font-medium text-neutral-800">
                          Artwork applied
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => bgInputRef.current?.click()}
                          disabled={isUploadingBg}
                          className="px-2.5 py-1 text-xs text-neutral-700 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50"
                        >
                          {isUploadingBg ? "Uploading..." : "Replace"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateConfig((prev) => ({ ...prev, backgroundImageUrl: null }))
                          }
                          className="p-1 text-neutral-400 hover:text-red-600 rounded-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : null}

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
              )}
            </div>

            {/* ═════════════════════════════════════════════════════════
                SECTION 6: ADVANCED OPTIONS
            ═════════════════════════════════════════════════════════ */}
            <div className="border-b border-neutral-200/80 pb-5">
              <button
                type="button"
                onClick={() => toggleSection("advanced")}
                className="flex items-center justify-between w-full text-left py-1 cursor-pointer group"
              >
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">
                    6. Advanced Options
                  </h3>
                  <p className="text-xs text-neutral-500 font-normal mt-0.5">
                    Admission rules, custom notices & white-label
                  </p>
                </div>
                {openSections.advanced ? (
                  <ChevronUp className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
                )}
              </button>

              {openSections.advanced && (
                <div className="mt-3.5 space-y-4 pt-1">
                  {/* Custom Message */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Custom Message
                    </label>
                    <input
                      type="text"
                      value={config.customMessage || ""}
                      onChange={(e) =>
                        updateConfig((prev) => ({ ...prev, customMessage: e.target.value }))
                      }
                      placeholder="e.g. See you at the keynote!"
                      maxLength={140}
                      className="w-full h-10 px-3 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>

                  {/* Rules Checkboxes */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 text-xs text-neutral-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.showSingleEntryRule !== false}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            showSingleEntryRule: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded text-neutral-900 border-neutral-300 focus:ring-0"
                      />
                      <span>Valid for one entry</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-neutral-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.showGateNotice !== false}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            showGateNotice: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded text-neutral-900 border-neutral-300 focus:ring-0"
                      />
                      <span>Keep this QR ready at the gate</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-neutral-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!config.showTermsLink}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            showTermsLink: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded text-neutral-900 border-neutral-300 focus:ring-0"
                      />
                      <span>Event Terms & Conditions link</span>
                    </label>
                  </div>

                  {/* Custom Instruction */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Custom Admission Note
                    </label>
                    <input
                      type="text"
                      value={config.customInstruction || ""}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          customInstruction: e.target.value,
                        }))
                      }
                      placeholder="e.g. Gate opens 30 minutes before keynote."
                      maxLength={140}
                      className="w-full h-10 px-3 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>

                  {/* Wordmark Status */}
                  <div className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs">
                    <div>
                      <p className="font-medium text-neutral-800">URPASS Wordmark</p>
                      <p className="text-[11px] text-neutral-500 font-normal">
                        {limits.canRemoveBranding
                          ? "White-label active"
                          : "Included on free & starter passes"}
                      </p>
                    </div>
                    {limits.canRemoveBranding ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                        White-Label
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => triggerUpgrade("White-Label (Remove Wordmark)")}
                        className="px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Actions in Control Panel */}
          <div className="p-4 border-t border-neutral-200 bg-white space-y-2 shrink-0">
            <button
              type="button"
              onClick={() => handleManualSave(false)}
              disabled={isManualSaving || saveStatus === "saving"}
              className="w-full h-10 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              {isManualSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>{eventId ? "Save & Apply" : "Save Design"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleManualSave(true)}
              className="w-full h-9 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-medium text-xs transition-colors cursor-pointer"
            >
              {eventId ? "Save as Organisation Template" : "Save as Template"}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleResetDesign}
                className="text-[11px] text-neutral-400 hover:text-neutral-700 font-medium transition-colors cursor-pointer"
              >
                Reset Design to Default
              </button>
            </div>
          </div>
        </aside>

        {/* ──────── RIGHT LARGE LIVE TICKET PREVIEW (60–65% width) ──────── */}
        <main
          className={`flex-1 bg-[#F5F6F7] flex flex-col h-full overflow-hidden ${
            mobileTab === "preview" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Top Preview Controls Toolbar */}
          <div className="h-13 bg-white border-b border-neutral-200 px-4 sm:px-6 flex items-center justify-between shrink-0">
            {/* Output Format Switcher */}
            <div className="inline-flex items-center p-0.5 bg-neutral-100 rounded-lg border border-neutral-200 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveFormat("mobile")}
                className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeFormat === "mobile"
                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Pass</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFormat("badge")}
                className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeFormat === "badge"
                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Lanyard Badge</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFormat("print")}
                className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeFormat === "print"
                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Printable Ticket</span>
              </button>
            </div>

            {/* Attendee Quick Switcher */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-500">
              <span className="text-[11px] font-normal text-neutral-400">Sample:</span>
              <div className="inline-flex items-center bg-neutral-50 border border-neutral-200 rounded-lg p-0.5">
                {SAMPLE_ATTENDEES.map((att, i) => (
                  <button
                    key={att.ticketId}
                    type="button"
                    onClick={() => setActiveAttendeeIndex(i)}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      activeAttendeeIndex === i
                        ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {att.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Zoom Controls: − 100% + Fit */}
            <div className="flex items-center gap-1">
              <div className="inline-flex items-center bg-white border border-neutral-200 rounded-lg px-1.5 py-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                  disabled={zoomLevel <= 75}
                  aria-label="Zoom out"
                  className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-neutral-900 disabled:opacity-30 cursor-pointer font-bold text-sm"
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
                  onClick={() => setZoomLevel((z) => Math.min(125, z + 10))}
                  disabled={zoomLevel >= 125}
                  aria-label="Zoom in"
                  className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-neutral-900 disabled:opacity-30 cursor-pointer font-bold text-sm"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                className="hidden sm:inline-flex px-2 py-1 text-[11px] font-medium text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer"
              >
                Fit
              </button>
            </div>
          </div>

          {/* Canvas Workspace (#F5F6F7 neutral background, subtle shadow) */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-6 sm:p-10 relative">
            <div
              className="transition-transform duration-150 flex items-center justify-center"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "center center",
              }}
            >
              {/* ──────── 1. MOBILE PASS FORMAT ──────── */}
              {activeFormat === "mobile" && (
                <div
                  id="printable-ticket-card"
                  className={`w-[350px] sm:w-[360px] ${shapeRadius} border ${cardBorder} ${cardBg} overflow-hidden shadow-md relative transition-all duration-150`}
                >
                  {config.backgroundImageUrl && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={config.backgroundImageUrl}
                        alt="Background"
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

                  {/* Accent Top Strip */}
                  {(isEvent || config.template === "modern") && (
                    <div
                      className="h-2 w-full relative z-10"
                      style={{ backgroundColor: activeColor }}
                    />
                  )}

                  {/* Card Interior */}
                  <div className="relative z-10 p-6 flex flex-col items-center text-center">
                    {/* Event Logo & Sponsor */}
                    <div className="mb-3.5 flex items-center justify-center gap-3">
                      {config.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={config.logoUrl}
                          alt="Logo"
                          className="h-8 max-w-[130px] object-contain"
                        />
                      ) : (
                        <span
                          className="text-[11px] font-bold tracking-widest uppercase"
                          style={{ color: isDark ? "#ffffff" : "#111827" }}
                        >
                          URPASS
                        </span>
                      )}

                      {config.sponsorLogoUrl && (
                        <>
                          <span className="text-neutral-300 text-xs">×</span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={config.sponsorLogoUrl}
                            alt="Sponsor"
                            className="h-6 max-w-[100px] object-contain opacity-80"
                          />
                        </>
                      )}
                    </div>

                    {/* Event Title */}
                    <h2 className="text-xl font-bold tracking-tight mb-2 uppercase leading-snug max-w-xs">
                      {eventName}
                    </h2>

                    {/* Ticket Type Pill */}
                    {config.showTicketType && (
                      <div className="mb-3">
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full border shadow-2xs"
                          style={{
                            borderColor: `${activeColor}35`,
                            color: activeColor,
                            backgroundColor: `${activeColor}12`,
                          }}
                        >
                          <TicketIcon className="w-3 h-3" />
                          {sampleAttendee.ticketType}
                        </span>
                      </div>
                    )}

                    {/* QR Code Container with High-Contrast Target */}
                    <div className="my-2 p-4 bg-white rounded-2xl shadow-xs border border-neutral-100 flex flex-col items-center justify-center">
                      <div className="w-36 h-36 flex flex-col justify-between">
                        {QR_MATRIX.map((row, rIdx) => (
                          <div key={rIdx} className="flex justify-between w-full h-[7px]">
                            {row.map((cell, cIdx) => (
                              <div
                                key={cIdx}
                                className={`w-[7px] h-[7px] ${
                                  cell === 1 ? "bg-black" : "bg-white"
                                }`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                      <span className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase mt-2">
                        SCAN FOR ENTRY
                      </span>
                    </div>

                    {/* Attendee Name */}
                    {config.showAttendeeName && (
                      <div className="mt-2.5 mb-0.5">
                        <p className="text-base font-semibold tracking-tight">
                          {sampleAttendee.name}
                        </p>
                      </div>
                    )}

                    {/* Dynamic Fields */}
                    {config.showOrganization && sampleAttendee.organization && (
                      <p className={`text-xs font-normal ${subtextCls} mb-0.5`}>
                        {sampleAttendee.organization}
                      </p>
                    )}

                    {config.showPhone && sampleAttendee.phone && (
                      <p className={`text-[11px] font-mono ${subtextCls} mb-0.5`}>
                        {sampleAttendee.phone}
                      </p>
                    )}

                    {config.showRegistrationNumber && sampleAttendee.regNumber && (
                      <div className="my-1">
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                          {sampleAttendee.regNumber}
                        </span>
                      </div>
                    )}

                    {/* Ticket ID */}
                    {config.showTicketId && (
                      <div className="my-1.5 flex items-center justify-center gap-1.5">
                        <span className="text-[9px] font-semibold tracking-wider uppercase text-neutral-400">
                          TICKET ID
                        </span>
                        <span className="text-xs font-mono font-medium tracking-wide">
                          {sampleAttendee.ticketId}
                        </span>
                      </div>
                    )}

                    {/* Date & Venue */}
                    {(config.showEventDate !== false || (config.showVenue && venue)) && (
                      <div
                        className={`w-full border-t ${dividerCls} pt-2.5 mt-2 flex flex-col items-center gap-1`}
                      >
                        {config.showEventDate !== false && eventDate && (
                          <p
                            className={`text-xs font-medium tracking-wide ${subtextCls} flex items-center gap-1.5`}
                          >
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

                    {/* Custom Message */}
                    {config.customMessage && (
                      <div className="mt-2.5 pt-2 border-t border-dashed border-neutral-200 w-full">
                        <p className="text-xs italic opacity-85 max-w-xs mx-auto">
                          &ldquo;{config.customMessage}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Admission Rules */}
                    {rulesList.length > 0 && (
                      <div
                        className={`mt-3 pt-2.5 border-t ${dividerCls} w-full text-[10px] ${subtextCls} leading-relaxed`}
                      >
                        <p className="font-medium">{rulesList.join(" • ")}</p>
                        {config.showTermsLink && (
                          <p className="mt-0.5 underline opacity-70">
                            Event Terms & Conditions apply
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ──────── 2. LANYARD BADGE FORMAT ──────── */}
              {activeFormat === "badge" && (
                <div
                  id="printable-ticket-card"
                  className="w-[330px] sm:w-[340px] bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-md flex flex-col transition-all duration-150"
                >
                  {/* Lanyard punch-hole simulation */}
                  <div className="w-full pt-4 pb-2 flex flex-col items-center">
                    <div className="w-12 h-2.5 rounded-full bg-neutral-200 border border-neutral-300 shadow-inner" />
                  </div>

                  {/* Top Branding */}
                  <div className="px-6 py-3 flex flex-col items-center text-center">
                    {config.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={config.logoUrl}
                        alt="Logo"
                        className="h-7 max-w-[120px] object-contain mb-1"
                      />
                    ) : (
                      <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-1">
                        URPASS CONFERENCE
                      </span>
                    )}
                    <h3 className="text-sm font-semibold text-neutral-800 uppercase tracking-tight line-clamp-1">
                      {eventName}
                    </h3>
                  </div>

                  {/* Large Attendee Name Centerpiece */}
                  <div className="py-6 px-6 text-center border-t border-b border-neutral-100 bg-neutral-50/50">
                    <h1 className="text-2xl font-bold text-neutral-900 tracking-tight leading-snug">
                      {sampleAttendee.name.toUpperCase()}
                    </h1>
                    {config.showOrganization && sampleAttendee.organization && (
                      <p className="text-sm font-medium text-neutral-600 mt-1">
                        {sampleAttendee.organization}
                      </p>
                    )}
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {sampleAttendee.designation}
                    </p>
                  </div>

                  {/* Ticket Category Full-Width Block */}
                  <div
                    className="py-2.5 px-4 text-center"
                    style={{ backgroundColor: activeColor }}
                  >
                    <span className="text-xs font-bold text-white tracking-widest uppercase">
                      {sampleAttendee.ticketType}
                    </span>
                  </div>

                  {/* Bottom Gate QR Section */}
                  <div className="p-5 flex flex-col items-center text-center space-y-2 bg-white">
                    <div className="p-2.5 bg-white border border-neutral-200 rounded-xl shadow-2xs">
                      <div className="w-24 h-24 flex flex-col justify-between">
                        {QR_MATRIX.map((row, rIdx) => (
                          <div key={rIdx} className="flex justify-between w-full h-[4.5px]">
                            {row.map((cell, cIdx) => (
                              <div
                                key={cIdx}
                                className={`w-[4.5px] h-[4.5px] ${
                                  cell === 1 ? "bg-black" : "bg-white"
                                }`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-[10px] font-mono text-neutral-400">
                      {sampleAttendee.ticketId}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      {venue} • {eventDate}
                    </p>
                  </div>
                </div>
              )}

              {/* ──────── 3. PRINTABLE TICKET STUB FORMAT ──────── */}
              {activeFormat === "print" && (
                <div
                  id="printable-ticket-card"
                  className="w-[480px] sm:w-[500px] h-[220px] bg-white rounded-xl border border-neutral-200 shadow-md flex overflow-hidden transition-all duration-150 relative"
                >
                  {/* Left Body (68%) */}
                  <div className="w-[68%] p-5 flex flex-col justify-between border-r-2 border-dashed border-neutral-300 relative">
                    {/* Semi-circular perforation cutouts */}
                    <div className="absolute -top-3.5 -right-3.5 w-7 h-7 rounded-full bg-[#F5F6F7] border border-neutral-200" />
                    <div className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-[#F5F6F7] border border-neutral-200" />

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                          OFFICIAL ADMISSION
                        </span>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
                          style={{
                            backgroundColor: `${activeColor}15`,
                            color: activeColor,
                          }}
                        >
                          {sampleAttendee.ticketType}
                        </span>
                      </div>

                      <h2 className="text-base font-bold text-neutral-900 uppercase tracking-tight line-clamp-1">
                        {eventName}
                      </h2>
                      <p className="text-sm font-semibold text-neutral-800 mt-1">
                        {sampleAttendee.name}
                      </p>
                      {config.showOrganization && sampleAttendee.organization && (
                        <p className="text-xs text-neutral-500 font-normal">
                          {sampleAttendee.organization}
                        </p>
                      )}
                    </div>

                    <div className="border-t border-neutral-100 pt-2 flex items-center justify-between text-xs text-neutral-500">
                      <div>
                        <p className="text-[11px] font-medium text-neutral-700">
                          {eventDate}
                        </p>
                        <p className="text-[10px] text-neutral-400">{venue}</p>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400">
                        {sampleAttendee.ticketId}
                      </span>
                    </div>
                  </div>

                  {/* Right Stub (32%) */}
                  <div className="w-[32%] p-4 bg-neutral-50 flex flex-col items-center justify-between text-center">
                    <span className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">
                      GATE STUB
                    </span>

                    <div className="p-1.5 bg-white border border-neutral-200 rounded-lg shadow-2xs">
                      <div className="w-20 h-20 flex flex-col justify-between">
                        {QR_MATRIX.map((row, rIdx) => (
                          <div key={rIdx} className="flex justify-between w-full h-[3.8px]">
                            {row.map((cell, cIdx) => (
                              <div
                                key={cIdx}
                                className={`w-[3.8px] h-[3.8px] ${
                                  cell === 1 ? "bg-black" : "bg-white"
                                }`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] font-mono text-neutral-500">
                        {sampleAttendee.ticketId}
                      </p>
                      <span className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase">
                        ENTRY PASS
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Preview Helper Actions */}
          <div className="h-11 bg-white border-t border-neutral-200 px-6 flex items-center justify-between shrink-0 text-xs text-neutral-500">
            <span className="text-[11px] text-neutral-400 font-normal">
              Changes reflect live across all formats
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTestModalOpen(true)}
                className="hover:text-neutral-900 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>Send test</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSample}
                className="hover:text-neutral-900 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-neutral-400" />
                <span>Download / Print</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CHANGE TEMPLATE MODAL (Clean, quiet selection)
      ───────────────────────────────────────────────────────────── */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 shrink-0">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">
                  Select a Ticket Template
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Choose from production setups to immediately apply layout and branding structure.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto pr-1">
              {STUDIO_TEMPLATES.map((tpl) => {
                const isPaid = tpl.tier === "paid";
                return (
                  <div
                    key={tpl.id}
                    onClick={() => {
                      const converted = convertStudioTemplateToTicketDesign(tpl);
                      updateConfig((prev) => ({
                        ...prev,
                        ...converted,
                        // Preserve organizer custom uploads
                        logoUrl: prev.logoUrl || converted.logoUrl,
                        sponsorLogoUrl: prev.sponsorLogoUrl || converted.sponsorLogoUrl,
                        backgroundImageUrl:
                          prev.backgroundImageUrl || converted.backgroundImageUrl,
                      }));
                      setIsTemplateModalOpen(false);
                    }}
                    className="p-3.5 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:shadow-xs transition-all cursor-pointer bg-white flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-semibold text-neutral-500 uppercase">
                          {tpl.category}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-neutral-100 text-neutral-600">
                          {isPaid ? "Pro" : "Free"}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-neutral-900">
                        {tpl.name}
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">
                        {tpl.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400 capitalize">{tpl.format}</span>
                      <span className="font-semibold text-neutral-900">Select →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SEND TEST TICKET MODAL
      ───────────────────────────────────────────────────────────── */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-700" />
                <h3 className="text-sm font-semibold text-neutral-900">
                  Send Test Ticket
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              We&apos;ll dispatch an authentic test pass with this design directly to your email address.
            </p>

            {testError && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                {testError}
              </div>
            )}

            {testSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-800 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Test ticket sent! Check your inbox.</span>
              </div>
            )}

            <form onSubmit={handleSendTestTicket} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="organizer@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full h-10 px-3 text-xs border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTestModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingTest}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {isSendingTest ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Pass</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscription Upgrade Modal */}
      <StudioUpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        triggerFeature={upgradeFeatureName}
        currentPlan={limits.planTier}
      />
    </div>
  );
}
