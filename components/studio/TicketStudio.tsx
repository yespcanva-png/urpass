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
  Smartphone,
  Eye,
  X,
  AlertCircle,
  RefreshCw,
  Palette,
  FileText,
  Award,
  Send,
  Building,
  Phone,
  Hash,
  Copy,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import {
  type TicketDesignConfig,
  type TicketTemplate,
  type TicketShape,
  DEFAULT_TICKET_DESIGN,
  sanitizeTicketDesign,
} from "@/lib/pass-design";

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

// 4 main sections for the simplified Ticket Studio
type StudioSection = "design" | "content" | "branding" | "delivery";

// Curated brand color swatches
const COLOR_SWATCHES = [
  { name: "Indigo", hex: "#635BFF" },
  { name: "Electric Blue", hex: "#4F46E5" },
  { name: "Emerald", hex: "#059669" },
  { name: "Amber", hex: "#D97706" },
  { name: "Crimson", hex: "#DC2626" },
  { name: "Obsidian", hex: "#18181B" },
];

// Default categories if none passed from event
const DEFAULT_CATEGORIES = [
  { id: "general", name: "General" },
  { id: "vip", name: "VIP" },
  { id: "gold", name: "Gold" },
  { id: "backstage", name: "Backstage" },
];

// Sample attendees for previewing real-world dynamic pass data
const SAMPLE_ATTENDEES = [
  {
    name: "Haarishmitha",
    ticketType: "VIP",
    ticketId: "#URP-02891",
    organization: "TechCorp Labs",
    phone: "+91 98765 43210",
    regNumber: "REG-2026-089",
    qrValue: "URP_PASS_HAARISH_02891",
    email: "haarishmitha@example.com",
  },
  {
    name: "Arun Kumar",
    ticketType: "General",
    ticketId: "#URP-04812",
    organization: "Anna University",
    phone: "+91 98401 23456",
    regNumber: "REG-2026-112",
    qrValue: "URP_PASS_ARUN_04812",
    email: "arun.kumar@example.com",
  },
  {
    name: "Priya Sharma",
    ticketType: "Gold",
    ticketId: "#URP-07340",
    organization: "Design Hub India",
    phone: "+91 91234 56789",
    regNumber: "REG-2026-004",
    qrValue: "URP_PASS_PRIYA_07340",
    email: "priya.sharma@example.com",
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
  ticketCategories = [],
}: TicketStudioProps) {
  // 1. Initial State
  const [config, setConfig] = useState<TicketDesignConfig>(() =>
    sanitizeTicketDesign(initialConfig || {})
  );

  // 2. Active Sections & Selected Element
  const [activeSection, setActiveSection] = useState<StudioSection>("design");
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  function handleSelectElement(elementKey: string, targetSection: StudioSection) {
    setSelectedElement(elementKey);
    setActiveSection(targetSection);
    if (mobileTab === "preview") {
      setMobileTab("customize");
    }
  }

  // 3. UI View Mode: Mobile Pass vs Email Delivery Preview
  const [previewMode, setPreviewMode] = useState<"mobile" | "email">("mobile");
  const [mobileTab, setMobileTab] = useState<"customize" | "preview">("customize");
  const [activeAttendeeIndex, setActiveAttendeeIndex] = useState(0);
  const sampleAttendee = SAMPLE_ATTENDEES[activeAttendeeIndex];

  // 4. Save & Autosave Status
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved" | "error">("saved");
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // 5. Test Email Modal State
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  // 6. Upload Loading States
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingSponsorLogo, setIsUploadingSponsorLogo] = useState(false);
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Categories list
  const categoriesToUse =
    ticketCategories && ticketCategories.length > 0
      ? ticketCategories
      : DEFAULT_CATEGORIES;

  // Refs for hidden file inputs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const sponsorLogoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  // Track initial mount to prevent immediate autosave on load
  const isInitialMount = useRef(true);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Execute Save Action via deterministic REST endpoint (immune to server action build-hash rotation)
  const performSave = useCallback(
    async (designToSave: TicketDesignConfig) => {
      setSaveStatus("saving");
      setSaveErrorMessage(null);
      try {
        const response = await fetch("/api/studio/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: eventId || null,
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

  // Manual Immediate Save
  function handleManualSave() {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    startTransition(() => {
      performSave(config);
    });
  }

  // Upload handler for Logo, Sponsor Logo & Background via Supabase Storage CDN endpoint
  async function handleFileUpload(file: File, type: "logo" | "sponsor" | "background") {
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
        setConfig((prev) => ({ ...prev, logoUrl: data.url }));
      } else if (type === "sponsor") {
        setConfig((prev) => ({ ...prev, sponsorLogoUrl: data.url }));
      } else {
        setConfig((prev) => ({ ...prev, backgroundImageUrl: data.url }));
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      if (type === "logo") setIsUploadingLogo(false);
      else if (type === "sponsor") setIsUploadingSponsorLogo(false);
      else setIsUploadingBg(false);
    }
  }

  // Category Colors: Set Accent Color for a Specific Category
  function handleSetCategoryColor(categoryKey: string, hexColor: string) {
    setConfig((prev) => ({
      ...prev,
      categoryColors: {
        ...(prev.categoryColors || {}),
        [categoryKey]: hexColor,
      },
    }));
  }

  // Apply Current Primary Color to All Categories
  function handleApplyToAllCategories() {
    const newCategoryColors: Record<string, string> = {};
    categoriesToUse.forEach((cat) => {
      newCategoryColors[cat.name] = config.primaryColor;
    });
    setConfig((prev) => ({
      ...prev,
      categoryColors: newCategoryColors,
    }));
  }

  // Duplicate / copy design color to another category
  function handleDuplicateCategoryColor(sourceCategory: string, targetCategory: string) {
    const sourceColor =
      config.categoryColors?.[sourceCategory] || config.primaryColor;
    handleSetCategoryColor(targetCategory, sourceColor);
  }

  // Reset Design to defaults
  function handleResetDesign() {
    if (window.confirm("Reset ticket design back to default settings?")) {
      setConfig({
        ...DEFAULT_TICKET_DESIGN,
        primaryColor: "#635BFF",
        template: "event",
        shape: "standard",
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

  // Download Sample Pass (Trigger Print dialog)
  function handleDownloadSample() {
    window.print();
  }

  // Style attributes based on current template
  const isDark = config.template === "dark";
  const isMinimal = config.template === "minimal";
  const isEvent = config.template === "event";

  // Category-specific color override for active sample attendee
  const activeColor =
    (sampleAttendee.ticketType && config.categoryColors?.[sampleAttendee.ticketType]) ||
    config.primaryColor;

  // Shape class
  const shapeRadius =
    config.shape === "rounded"
      ? "rounded-[28px]"
      : config.shape === "compact"
      ? "rounded-xl"
      : "rounded-2xl";

  const paddingCls = config.shape === "compact" ? "p-4 sm:p-5" : "p-6";

  const cardBg = isDark ? "bg-[#121216] text-white" : "bg-white text-neutral-900";
  const cardBorder = isDark ? "border-neutral-800" : "border-neutral-200";
  const subtextCls = isDark ? "text-neutral-400" : "text-neutral-500";
  const dividerCls = isDark ? "border-neutral-800" : "border-neutral-100";

  // Rules List
  const rulesList: string[] = [];
  if (config.showSingleEntryRule) rulesList.push("Valid for one entry");
  if (config.showGateNotice) rulesList.push("Keep this QR ready at the gate");
  if (config.customInstruction) rulesList.push(config.customInstruction);

  return (
    <div className="fixed inset-0 z-50 flex flex-col w-screen h-screen overflow-hidden bg-neutral-100 font-sans select-none">
      {/* Print Styles for Clean Sample Pass Download */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                margin: 10mm;
                size: auto;
              }
              body {
                background: #ffffff !important;
                color: #000000 !important;
              }
              header, aside, .no-print, button {
                display: none !important;
              }
              main {
                background: transparent !important;
                padding: 0 !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                width: 100% !important;
                height: auto !important;
                overflow: visible !important;
              }
              #printable-ticket-card {
                box-shadow: none !important;
                border: 1px solid #d4d4d8 !important;
                max-width: 380px !important;
                width: 380px !important;
                margin: 20px auto !important;
                page-break-inside: avoid !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          `,
        }}
      />

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
            {config.isPublished !== false ? (
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Ready
              </span>
            ) : (
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Draft
              </span>
            )}
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
        {/* ──────── LEFT COLUMN: 4-SECTION CUSTOMIZE PANEL ──────── */}
        <aside
          className={`w-full md:w-[440px] lg:w-[470px] shrink-0 border-r border-neutral-200 bg-white flex flex-col h-full overflow-hidden ${
            mobileTab === "customize" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Section Navigation Tabs: Design → Content → Branding → Delivery */}
          <div className="grid grid-cols-4 border-b border-neutral-200 bg-neutral-50/70 p-1.5 gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setActiveSection("design")}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 text-xs font-bold rounded-lg transition-all ${
                activeSection === "design"
                  ? "bg-white text-neutral-900 shadow-xs border border-neutral-200/80"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/70"
              }`}
            >
              <Palette className="w-3.5 h-3.5 shrink-0" />
              <span>Design</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("content")}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 text-xs font-bold rounded-lg transition-all ${
                activeSection === "content"
                  ? "bg-white text-neutral-900 shadow-xs border border-neutral-200/80"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/70"
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Content</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("branding")}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 text-xs font-bold rounded-lg transition-all ${
                activeSection === "branding"
                  ? "bg-white text-neutral-900 shadow-xs border border-neutral-200/80"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/70"
              }`}
            >
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>Branding</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("delivery")}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 text-xs font-bold rounded-lg transition-all ${
                activeSection === "delivery"
                  ? "bg-white text-neutral-900 shadow-xs border border-neutral-200/80"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/70"
              }`}
            >
              <Send className="w-3.5 h-3.5 shrink-0" />
              <span>Delivery</span>
            </button>
          </div>

          {/* Tab Content Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
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

            {/* ═════════════════════════════════════════════════════════
                SECTION 1: DESIGN
                3 Templates · Brand Color · Shape · Category Colors · BG · QR Safety
            ═════════════════════════════════════════════════════════ */}
            {activeSection === "design" && (
              <div className="space-y-6 animate-in fade-in-50 duration-150">
                {/* 1. 3 Ready-made Styles */}
                <div>
                  <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2.5">
                    3 Design Templates
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
                        <div className="w-full h-1.5 shrink-0" style={{ backgroundColor: config.primaryColor }} />
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

                {/* 2. Primary Brand Color */}
                <div>
                  <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2.5">
                    Brand Color
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
                        htmlFor="primary-color-picker"
                        className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center cursor-pointer hover:bg-neutral-50 relative overflow-hidden shrink-0 shadow-xs"
                        title="Choose custom color"
                      >
                        <div
                          className="w-full h-full rounded-full"
                          style={{ backgroundColor: config.primaryColor }}
                        />
                        <input
                          id="primary-color-picker"
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

                {/* 3. Ticket Shape: Standard / Rounded / Compact */}
                <div>
                  <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                    Ticket Shape
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "standard", label: "Standard", desc: "16px radius" },
                      { id: "rounded", label: "Rounded", desc: "28px radius" },
                      { id: "compact", label: "Compact", desc: "Condensed" },
                    ].map((shapeOpt) => {
                      const isActive = (config.shape || "standard") === shapeOpt.id;
                      return (
                        <button
                          key={shapeOpt.id}
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({ ...prev, shape: shapeOpt.id as TicketShape }))
                          }
                          className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                            isActive
                              ? "border-neutral-900 bg-neutral-50 text-neutral-900 font-bold shadow-2xs"
                              : "border-neutral-200 text-neutral-600 hover:border-neutral-300 font-medium"
                          }`}
                        >
                          <p className="text-xs">{shapeOpt.label}</p>
                          <p className="text-[10px] text-neutral-400 font-normal">{shapeOpt.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Ticket Type Colors (Category Branding) */}
                <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                        Ticket Type Colors
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        Different visual identity for VIP, General, Gold, etc.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleApplyToAllCategories}
                      className="text-[10px] font-bold text-brand hover:underline"
                    >
                      Apply to All
                    </button>
                  </div>

                  <div className="space-y-2 pt-1">
                    {categoriesToUse.map((cat) => {
                      const catColor = config.categoryColors?.[cat.name] || config.primaryColor;
                      return (
                        <div
                          key={cat.id}
                          className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-neutral-200/80"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: catColor }}
                            />
                            <span className="text-xs font-semibold text-neutral-800">
                              {cat.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={catColor}
                              onChange={(e) => handleSetCategoryColor(cat.name, e.target.value)}
                              className="w-6 h-6 rounded cursor-pointer border border-neutral-200"
                              title={`Set color for ${cat.name}`}
                            />
                            <span className="text-[11px] font-mono text-neutral-500 uppercase">
                              {catColor}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Background Image & QR Safety Zone */}
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

                {/* QR Safety Zone Indicator */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900">QR Safety Zone Active</p>
                    <p className="text-[11px] text-emerald-700 leading-relaxed">
                      High-contrast scan card guarantees 100% scannability under direct sunlight or dark gates, regardless of background image.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════
                SECTION 2: CONTENT
                Dynamic Fields · Custom Message · Ticket Rules
            ═════════════════════════════════════════════════════════ */}
            {activeSection === "content" && (
              <div className="space-y-6 animate-in fade-in-50 duration-150">
                {/* 1. Dynamic Ticket Fields */}
                <div>
                  <div className="mb-3">
                    <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Dynamic Ticket Fields
                    </label>
                    <p className="text-[11px] text-neutral-500">
                      Select what appears on pass. URPASS controls layout and positioning automatically.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {/* Attendee Name */}
                    <label className="flex items-center gap-3 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.showAttendeeName}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, showAttendeeName: e.target.checked }))
                        }
                        className="w-4 h-4 rounded-sm text-neutral-900 border-neutral-300 focus:ring-0"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-neutral-800">Attendee Name</p>
                        <p className="text-[10px] text-neutral-400">e.g. Haarishmitha</p>
                      </div>
                    </label>

                    {/* Ticket Type */}
                    <label className="flex items-center gap-3 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.showTicketType}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, showTicketType: e.target.checked }))
                        }
                        className="w-4 h-4 rounded-sm text-neutral-900 border-neutral-300 focus:ring-0"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-neutral-800">Ticket Type</p>
                        <p className="text-[10px] text-neutral-400">e.g. VIP PASS / General Entry pill</p>
                      </div>
                    </label>

                    {/* Event Date & Time */}
                    <label className="flex items-center gap-3 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.showEventDate !== false}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, showEventDate: e.target.checked }))
                        }
                        className="w-4 h-4 rounded-sm text-neutral-900 border-neutral-300 focus:ring-0"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-neutral-800">Event Date & Time</p>
                        <p className="text-[10px] text-neutral-400">e.g. 03 OCT 2026 | 10:00 AM</p>
                      </div>
                    </label>

                    {/* Venue */}
                    <label className="flex items-center gap-3 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.showVenue}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, showVenue: e.target.checked }))
                        }
                        className="w-4 h-4 rounded-sm text-neutral-900 border-neutral-300 focus:ring-0"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-neutral-800">Venue</p>
                        <p className="text-[10px] text-neutral-400">e.g. The Residency, Coimbatore</p>
                      </div>
                    </label>

                    {/* Ticket ID */}
                    <label className="flex items-center gap-3 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.showTicketId}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, showTicketId: e.target.checked }))
                        }
                        className="w-4 h-4 rounded-sm text-neutral-900 border-neutral-300 focus:ring-0"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-neutral-800">Ticket ID</p>
                        <p className="text-[10px] text-neutral-400">e.g. #URP-02891</p>
                      </div>
                    </label>

                    {/* Company / College */}
                    <label className="flex items-center gap-3 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!config.showOrganization}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, showOrganization: e.target.checked }))
                        }
                        className="w-4 h-4 rounded-sm text-neutral-900 border-neutral-300 focus:ring-0"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-neutral-800">Company / College</p>
                        <p className="text-[10px] text-neutral-400">e.g. TechCorp Labs / Anna University</p>
                      </div>
                    </label>

                    {/* Phone Number */}
                    <label className="flex items-center gap-3 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!config.showPhone}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, showPhone: e.target.checked }))
                        }
                        className="w-4 h-4 rounded-sm text-neutral-900 border-neutral-300 focus:ring-0"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-neutral-800">Phone</p>
                        <p className="text-[10px] text-neutral-400">e.g. +91 98765 43210</p>
                      </div>
                    </label>

                    {/* Registration Number */}
                    <label className="flex items-center gap-3 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!config.showRegistrationNumber}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, showRegistrationNumber: e.target.checked }))
                        }
                        className="w-4 h-4 rounded-sm text-neutral-900 border-neutral-300 focus:ring-0"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-neutral-800">Registration Number</p>
                        <p className="text-[10px] text-neutral-400">e.g. REG-2026-089</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 2. Custom Message */}
                <div>
                  <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                    Custom Message
                  </label>
                  <p className="text-[11px] text-neutral-500 mb-2">
                    Small text printed on pass (e.g. “See you at the event!”)
                  </p>
                  <input
                    type="text"
                    value={config.customMessage || ""}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, customMessage: e.target.value }))
                    }
                    placeholder="See you at the event!"
                    maxLength={160}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
                  />
                </div>

                {/* 3. Ticket Rules */}
                <div className="space-y-3 pt-2 border-t border-neutral-200">
                  <div>
                    <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Ticket Rules
                    </label>
                    <p className="text-[11px] text-neutral-500">
                      Admission instructions rendered at the foot of each pass
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 text-xs text-neutral-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.showSingleEntryRule !== false}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, showSingleEntryRule: e.target.checked }))
                        }
                        className="w-4 h-4 rounded-sm text-neutral-900 border-neutral-300 focus:ring-0"
                      />
                      <span>Show &ldquo;Valid for one entry&rdquo;</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-neutral-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.showGateNotice !== false}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, showGateNotice: e.target.checked }))
                        }
                        className="w-4 h-4 rounded-sm text-neutral-900 border-neutral-300 focus:ring-0"
                      />
                      <span>Show &ldquo;Keep this QR ready at the gate&rdquo;</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-neutral-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!config.showTermsLink}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, showTermsLink: e.target.checked }))
                        }
                        className="w-4 h-4 rounded-sm text-neutral-900 border-neutral-300 focus:ring-0"
                      />
                      <span>Show Event Terms link</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-neutral-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!config.showOrganizerContact}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, showOrganizerContact: e.target.checked }))
                        }
                        className="w-4 h-4 rounded-sm text-neutral-900 border-neutral-300 focus:ring-0"
                      />
                      <span>Show Organizer Contact note</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      + Add custom instruction
                    </label>
                    <input
                      type="text"
                      value={config.customInstruction || ""}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, customInstruction: e.target.value }))
                      }
                      placeholder="e.g. Gate opens 30 minutes before keynote."
                      maxLength={160}
                      className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════
                SECTION 3: BRANDING
                Event Logo · Sponsor Logo · White-label Branding
            ═════════════════════════════════════════════════════════ */}
            {activeSection === "branding" && (
              <div className="space-y-6 animate-in fade-in-50 duration-150">
                {/* 1. Event / Organization Logo */}
                <div>
                  <div className="mb-2">
                    <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Event / Company Logo
                    </label>
                    <p className="text-[11px] text-neutral-500">
                      Primary branding with automatic high-resolution CDN optimization
                    </p>
                  </div>

                  {config.logoUrl ? (
                    <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 bg-white border border-neutral-200 rounded-lg flex items-center justify-center p-1 overflow-hidden">
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
                          <span className="text-xs font-bold text-neutral-800">Upload Logo</span>
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

                {/* 2. Sponsor / Co-host Logo */}
                <div>
                  <div className="mb-2">
                    <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Sponsor Logo (Optional)
                    </label>
                    <p className="text-[11px] text-neutral-500">
                      Secondary partner or title sponsor mark displayed alongside main logo
                    </p>
                  </div>

                  {config.sponsorLogoUrl ? (
                    <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 bg-white border border-neutral-200 rounded-lg flex items-center justify-center p-1 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={config.sponsorLogoUrl}
                            alt="Sponsor Logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-800">Sponsor Logo</p>
                          <p className="text-[10px] text-neutral-400">Partner badge active</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => sponsorLogoInputRef.current?.click()}
                          disabled={isUploadingSponsorLogo}
                          className="px-2.5 py-1 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-100 rounded-md transition-colors"
                        >
                          {isUploadingSponsorLogo ? "Uploading..." : "Change"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfig((prev) => ({ ...prev, sponsorLogoUrl: null }))}
                          className="p-1 text-neutral-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                          title="Remove Sponsor Logo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => sponsorLogoInputRef.current?.click()}
                      disabled={isUploadingSponsorLogo}
                      className="w-full p-3.5 border border-dashed border-neutral-300 hover:border-neutral-400 rounded-xl text-center flex items-center justify-center gap-2 transition-colors bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700"
                    >
                      {isUploadingSponsorLogo ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-500" />
                          <span>Uploading sponsor logo...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Upload sponsor / partner logo</span>
                        </>
                      )}
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

                {/* 3. Urpass Wordmark Status */}
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-neutral-800">URPASS Wordmark</p>
                    <p className="text-[10px] text-neutral-500">
                      {isPro ? "Branding hidden automatically on Pro plan" : "Shown on Free plan passes"}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isPro
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                    }`}
                  >
                    {isPro ? "PRO" : "FREE"}
                  </span>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════
                SECTION 4: DELIVERY
                Preview Mode · Status · Send Test · Download · Reset
            ═════════════════════════════════════════════════════════ */}
            {activeSection === "delivery" && (
              <div className="space-y-6 animate-in fade-in-50 duration-150">
                {/* 1. Mobile vs Email Preview Mode */}
                <div>
                  <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                    Mobile / Email Preview Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewMode("mobile")}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        previewMode === "mobile"
                          ? "border-neutral-900 bg-neutral-50 text-neutral-900 font-bold shadow-2xs"
                          : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                      }`}
                    >
                      <Smartphone className="w-4 h-4 mx-auto mb-1 text-neutral-600" />
                      <p className="text-xs">Mobile Pass</p>
                      <p className="text-[10px] text-neutral-400 font-normal">Digital ticket view</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewMode("email")}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        previewMode === "email"
                          ? "border-neutral-900 bg-neutral-50 text-neutral-900 font-bold shadow-2xs"
                          : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                      }`}
                    >
                      <Mail className="w-4 h-4 mx-auto mb-1 text-neutral-600" />
                      <p className="text-xs">Email Ticket</p>
                      <p className="text-[10px] text-neutral-400 font-normal">Attendee inbox view</p>
                    </button>
                  </div>
                </div>

                {/* 2. Design Status (Draft vs Ready) */}
                <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Design Status
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      {config.isPublished !== false
                        ? "Published · Generated passes will use this design"
                        : "Draft · Testing in progress"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setConfig((prev) => ({
                        ...prev,
                        isPublished: prev.isPublished === false ? true : false,
                      }))
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      config.isPublished !== false
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-amber-600 text-white hover:bg-amber-700"
                    }`}
                  >
                    {config.isPublished !== false ? "Ready" : "Draft"}
                  </button>
                </div>

                {/* 3. Send Test Ticket */}
                <div className="p-3.5 bg-white border border-neutral-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-neutral-600" />
                    <p className="text-xs font-bold text-neutral-900">Send Test Ticket</p>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Dispatch an authentic test pass with this design directly to your email.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTestModalOpen(true)}
                    className="w-full py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Test to Organizer</span>
                  </button>
                </div>

                {/* 4. Download Sample Pass */}
                <div>
                  <button
                    type="button"
                    onClick={handleDownloadSample}
                    className="w-full py-2.5 px-3 border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-neutral-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Download Sample Pass (PDF / Print)</span>
                  </button>
                </div>

                {/* 5. Reset Design */}
                <div className="pt-2 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={handleResetDesign}
                    className="w-full py-2 px-3 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Design to Default</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ──────── RIGHT COLUMN: PERMANENT LIVE PREVIEW ──────── */}
        <main
          className={`flex-1 bg-neutral-100/90 flex flex-col h-full overflow-y-auto items-center justify-center p-4 sm:p-6 lg:p-8 ${
            mobileTab === "preview" ? "flex" : "hidden md:flex"
          }`}
          style={{
            backgroundImage: "radial-gradient(#d4d4d8 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          <div className="w-full max-w-[390px] flex flex-col items-center">
            {/* Top Toolbar: Live Preview Label, Email/Mobile Switcher, Sample Attendee Switcher */}
            <div className="w-full flex items-center justify-between mb-3 px-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase text-neutral-400">
                  LIVE PREVIEW
                </span>
                {config.isPublished !== false ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-emerald-100 text-emerald-800">
                    Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-amber-100 text-amber-800">
                    Draft
                  </span>
                )}
              </div>

              {/* Sample Attendee Quick Switcher */}
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-xs p-0.5 rounded-lg border border-neutral-200/80 shadow-2xs">
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
                IF EMAIL VIEW: RENDER EMAIL CLIENT MOCKUP
            ───────────────────────────────────────────────────────── */}
            {previewMode === "email" ? (
              <div className="w-full bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden mb-4">
                {/* Email Client Header */}
                <div className="bg-neutral-100/90 border-b border-neutral-200 px-4 py-2.5 flex flex-col gap-1 text-[11px] text-neutral-500">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-800 truncate">
                      [PASS] {eventName} — Official Entry Ticket
                    </span>
                    <span className="text-[10px] text-neutral-400">10:00 AM</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="font-semibold text-neutral-700">From:</span>
                    <span>URPASS &lt;noreply@urpass.space&gt;</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="font-semibold text-neutral-700">To:</span>
                    <span>{sampleAttendee.email}</span>
                  </div>
                </div>

                {/* Email Body */}
                <div className="p-4 sm:p-5 bg-neutral-50/50 flex flex-col items-center">
                  <p className="text-xs text-neutral-600 mb-3 text-center">
                    Hello <strong className="text-neutral-900">{sampleAttendee.name}</strong>, here is your confirmed entry pass:
                  </p>

                  {/* Render the Ticket Pass inside email */}
                  <div
                    className={`relative w-full ${shapeRadius} border ${cardBorder} ${cardBg} overflow-hidden shadow-md select-none transition-all duration-200`}
                  >
                    {/* Event Accent Strip */}
                    {(isEvent || config.template === "modern") && (
                      <div className="h-2 w-full relative z-10" style={{ backgroundColor: activeColor }} />
                    )}

                    <div className={`relative z-10 ${paddingCls} flex flex-col items-center text-center`}>
                      {/* Logo & Sponsor */}
                      <div className="mb-3 flex items-center justify-center gap-2.5">
                        {config.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={config.logoUrl} alt="Logo" className="h-7 max-w-[110px] object-contain" />
                        ) : (
                          <span className="text-[11px] font-black tracking-widest uppercase">URPASS</span>
                        )}
                        {config.sponsorLogoUrl && (
                          <>
                            <span className="text-neutral-300 text-xs">×</span>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={config.sponsorLogoUrl} alt="Sponsor" className="h-5 max-w-[80px] object-contain opacity-75" />
                          </>
                        )}
                      </div>

                      <h2 className="text-lg font-bold tracking-tight mb-1.5 uppercase leading-snug">
                        {eventName}
                      </h2>

                      {config.showTicketType && (
                        <div className="mb-2.5">
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border"
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

                      {/* QR */}
                      <div className="my-1.5 p-3.5 bg-white rounded-xl shadow-xs border border-neutral-100 flex flex-col items-center">
                        <div className="w-32 h-32 flex flex-col justify-between">
                          {QR_MATRIX.map((row, rIdx) => (
                            <div key={rIdx} className="flex justify-between w-full h-[6px]">
                              {row.map((cell, cIdx) => (
                                <div key={cIdx} className={`w-[6px] h-[6px] ${cell === 1 ? "bg-black" : "bg-white"}`} />
                              ))}
                            </div>
                          ))}
                        </div>
                        <span className="text-[8px] font-black tracking-widest text-neutral-400 uppercase mt-1.5">
                          SCAN FOR ENTRY
                        </span>
                      </div>

                      {config.showAttendeeName && (
                        <p className="text-sm font-bold tracking-tight mt-1">{sampleAttendee.name}</p>
                      )}

                      {config.showTicketId && (
                        <p className="text-[10px] font-mono text-neutral-400 mt-0.5">{sampleAttendee.ticketId}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-[10px] text-neutral-400 text-center mt-3">
                    Add to Apple Wallet / Google Wallet or save this email for venue check-in.
                  </p>
                </div>
              </div>
            ) : (
              /* ─────────────────────────────────────────────────────────
                  MOBILE PASS VIEW (Locked Information Hierarchy):
                  Event logo → Event name → Ticket type → QR → Attendee name → Ticket ID → Date/venue
              ───────────────────────────────────────────────────────── */
              <div
                id="printable-ticket-card"
                className={`relative w-full ${shapeRadius} border ${cardBorder} ${cardBg} overflow-hidden shadow-lg select-none transition-all duration-200`}
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
                {(isEvent || config.template === "modern") && (
                  <div
                    onClick={() => handleSelectElement("accent", "design")}
                    className="h-2 w-full relative z-10 cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: activeColor }}
                    title="Click to customize Template Accent"
                  />
                )}

                {/* Ticket Content Container */}
                <div className={`relative z-10 ${paddingCls} flex flex-col items-center text-center`}>
                  {/* 1. EVENT LOGO & SPONSOR LOGO */}
                  <div
                    onClick={() => handleSelectElement("logo", "branding")}
                    className={`mb-3.5 flex items-center justify-center gap-3 cursor-pointer p-1.5 transition-all ${
                      selectedElement === "logo"
                        ? "ring-2 ring-brand ring-offset-2 rounded-xl"
                        : "hover:ring-1 hover:ring-brand/40 rounded-xl"
                    }`}
                    title="Click to customize Logo & Branding"
                  >
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

                    {config.sponsorLogoUrl && (
                      <>
                        <span className="text-neutral-300 text-xs">×</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={config.sponsorLogoUrl}
                          alt="Sponsor Logo"
                          className="h-6 max-w-[100px] object-contain opacity-80"
                        />
                      </>
                    )}
                  </div>

                  {/* 2. EVENT NAME */}
                  <h2
                    onClick={() => handleSelectElement("eventName", "content")}
                    className={`text-xl font-bold tracking-tight mb-2 uppercase leading-snug max-w-xs cursor-pointer px-2 py-0.5 transition-all ${
                      selectedElement === "eventName"
                        ? "ring-2 ring-brand ring-offset-2 rounded-lg"
                        : "hover:ring-1 hover:ring-brand/40 rounded-lg"
                    }`}
                    title="Click to view Content settings"
                  >
                    {eventName}
                  </h2>

                  {/* 3. TICKET TYPE PILL (if toggled) */}
                  {config.showTicketType && (
                    <div
                      onClick={() => handleSelectElement("ticketType", "design")}
                      className={`mb-3 cursor-pointer p-0.5 transition-all ${
                        selectedElement === "ticketType"
                          ? "ring-2 ring-brand ring-offset-2 rounded-full"
                          : "hover:ring-1 hover:ring-brand/40 rounded-full"
                      }`}
                      title="Click to customize Ticket Type Colors & Templates"
                    >
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border shadow-2xs"
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

                  {/* 4. LARGE CENTERED QR CODE CARD (Clean Contrast Shield) */}
                  <div
                    onClick={() => handleSelectElement("qr", "design")}
                    className={`my-2 flex flex-col items-center cursor-pointer transition-all ${
                      selectedElement === "qr"
                        ? "ring-2 ring-brand ring-offset-2 rounded-2xl"
                        : "hover:ring-1 hover:ring-brand/40 rounded-2xl"
                    }`}
                    title="QR Safety Zone - Click to customize Design & Template"
                  >
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
                    <div
                      onClick={() => handleSelectElement("attendeeName", "content")}
                      className={`mt-2 mb-0.5 cursor-pointer px-2 py-0.5 transition-all ${
                        selectedElement === "attendeeName"
                          ? "ring-2 ring-brand ring-offset-2 rounded-lg"
                          : "hover:ring-1 hover:ring-brand/40 rounded-lg"
                      }`}
                      title="Click to customize Attendee Name & Fields"
                    >
                      <p className="text-base font-bold tracking-tight">
                        {sampleAttendee.name}
                      </p>
                    </div>
                  )}

                  {/* DYNAMIC FIELDS: Organization / College, Phone, Registration Number */}
                  {config.showOrganization && sampleAttendee.organization && (
                    <p
                      onClick={() => handleSelectElement("organization", "content")}
                      className={`text-xs font-medium ${subtextCls} mb-0.5 cursor-pointer hover:underline`}
                      title="Click to customize Dynamic Fields"
                    >
                      {sampleAttendee.organization}
                    </p>
                  )}

                  {config.showPhone && sampleAttendee.phone && (
                    <p
                      onClick={() => handleSelectElement("phone", "content")}
                      className={`text-[11px] font-mono ${subtextCls} mb-0.5 cursor-pointer hover:underline`}
                      title="Click to customize Dynamic Fields"
                    >
                      {sampleAttendee.phone}
                    </p>
                  )}

                  {config.showRegistrationNumber && sampleAttendee.regNumber && (
                    <div
                      onClick={() => handleSelectElement("regNumber", "content")}
                      className="my-1 cursor-pointer"
                      title="Click to customize Dynamic Fields"
                    >
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:ring-1 hover:ring-brand/40">
                        {sampleAttendee.regNumber}
                      </span>
                    </div>
                  )}

                  {/* 6. TICKET ID (if toggled) */}
                  {config.showTicketId && (
                    <div
                      onClick={() => handleSelectElement("ticketId", "content")}
                      className={`my-1.5 flex items-center justify-center gap-1.5 cursor-pointer px-2 py-0.5 transition-all ${
                        selectedElement === "ticketId"
                          ? "ring-2 ring-brand ring-offset-2 rounded-lg"
                          : "hover:ring-1 hover:ring-brand/40 rounded-lg"
                      }`}
                      title="Click to customize Ticket ID"
                    >
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
                    <div
                      onClick={() => handleSelectElement("dateVenue", "content")}
                      className={`w-full border-t ${dividerCls} pt-2.5 mt-2 flex flex-col items-center gap-1 cursor-pointer p-1 transition-all ${
                        selectedElement === "dateVenue"
                          ? "ring-2 ring-brand ring-offset-2 rounded-lg"
                          : "hover:ring-1 hover:ring-brand/40 rounded-lg"
                      }`}
                      title="Click to customize Date & Venue display"
                    >
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

                  {/* 8. CUSTOM MESSAGE */}
                  {config.customMessage && (
                    <div
                      onClick={() => handleSelectElement("customMessage", "content")}
                      className={`mt-2.5 pt-2 border-t border-dashed border-neutral-200/80 w-full cursor-pointer p-1 transition-all ${
                        selectedElement === "customMessage"
                          ? "ring-2 ring-brand ring-offset-2 rounded-lg"
                          : "hover:ring-1 hover:ring-brand/40 rounded-lg"
                      }`}
                      title="Click to edit Custom Message"
                    >
                      <p className="text-xs italic opacity-85 max-w-xs mx-auto">
                        &ldquo;{config.customMessage}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* 9. TICKET RULES STRIP */}
                  {rulesList.length > 0 && (
                    <div
                      onClick={() => handleSelectElement("rules", "content")}
                      className={`mt-3 pt-2.5 border-t ${dividerCls} w-full text-[10px] ${subtextCls} leading-relaxed cursor-pointer p-1 transition-all ${
                        selectedElement === "rules"
                          ? "ring-2 ring-brand ring-offset-2 rounded-lg"
                          : "hover:ring-1 hover:ring-brand/40 rounded-lg"
                      }`}
                      title="Click to customize Ticket Rules"
                    >
                      <p className="font-medium">{rulesList.join(" • ")}</p>
                      {config.showTermsLink && (
                        <p className="mt-0.5 underline opacity-70">
                          Event Terms & Conditions apply
                        </p>
                      )}
                      {config.showOrganizerContact && (
                        <p className="mt-0.5 opacity-70">
                          Need help? Contact organizer
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

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
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
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
