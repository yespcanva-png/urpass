"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sliders,
  Layers,
  Send,
  FileText,
  Hash,
  UserCheck,
  DoorOpen,
  Calendar,
  FileSpreadsheet,
  WifiOff,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Info,
  Settings2,
  Search,
  Sparkles,
  RotateCcw,
  X,
  Check,
  ExternalLink,
  Zap,
  BookOpen,
} from "lucide-react";
import AdvancedFeaturesLiveSimulator from "@/components/event/AdvancedFeaturesLiveSimulator";
import {
  updateEventFeatureFlag,
  getEventFeatureFlagsState,
} from "@/app/actions/event-features";
import type { FeatureFlagKey, EventFeaturesConfig } from "@/lib/feature-flags";

interface ModuleMeta {
  key: FeatureFlagKey;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  category: "ticketing" | "venue" | "data" | "all";
  dependencies?: string[];
  configUrl?: (eventId: string) => string;
  defaultConfigTitle?: string;
  configOptions?: Array<{
    id: string;
    label: string;
    description: string;
    type: "select" | "toggle" | "number" | "text";
    options?: Array<{ label: string; value: string }>;
    defaultValue: string | boolean | number;
  }>;
}

const MODULAR_FEATURES: ModuleMeta[] = [
  {
    key: "bulk_ticket_booking",
    name: "Bulk Ticket Booking",
    description: "Purchase multiple tickets in a single order with atomic capacity reservations and group pricing.",
    icon: Layers,
    tag: "TICKETING",
    category: "ticketing",
    configUrl: (eventId) => `/event/${eventId}/tickets`,
    defaultConfigTitle: "Bulk Booking Rules",
    configOptions: [
      {
        id: "max_per_order",
        label: "Max Tickets per Order",
        description: "Maximum quantity of tickets one purchaser can buy in a single checkout.",
        type: "select",
        options: [
          { label: "5 Tickets", value: "5" },
          { label: "10 Tickets (Default)", value: "10" },
          { label: "25 Tickets", value: "25" },
          { label: "50 Tickets (Bulk)", value: "50" },
          { label: "100 Tickets (Enterprise)", value: "100" },
        ],
        defaultValue: "10",
      },
      {
        id: "allow_split_claim",
        label: "Enable Delayed Ticket Distribution",
        description: "Allow the buyer to invite group members later via secure claim links.",
        type: "toggle",
        defaultValue: true,
      },
      {
        id: "enable_group_discount",
        label: "Volume Group Discounts",
        description: "Automatically apply tier discounts for orders above 5 tickets.",
        type: "toggle",
        defaultValue: false,
      },
    ],
  },
  {
    key: "ticket_distribution",
    name: "Bulk Ticket Distribution & Claiming",
    description: "Distribute bulk purchased tickets to individual members with secure claim links and email invites.",
    icon: Send,
    tag: "DISTRIBUTION",
    category: "ticketing",
    dependencies: ["Bulk Ticket Booking"],
    configUrl: (eventId) => `/event/${eventId}/attendees`,
    defaultConfigTitle: "Distribution & Claiming Settings",
    configOptions: [
      {
        id: "claim_expiry_hours",
        label: "Claim Link Expiry",
        description: "Duration before an unclaimed ticket link automatically expires.",
        type: "select",
        options: [
          { label: "24 Hours", value: "24" },
          { label: "48 Hours (Recommended)", value: "48" },
          { label: "7 Days", value: "168" },
          { label: "No Expiration", value: "0" },
        ],
        defaultValue: "48",
      },
      {
        id: "allow_buyer_revoke",
        label: "Allow Buyer Ticket Revocation",
        description: "Let the original buyer revoke unassigned or unaccepted claim invites.",
        type: "toggle",
        defaultValue: true,
      },
      {
        id: "auto_reminders",
        label: "Send Auto Claim Reminders",
        description: "Send automated email reminders to recipients 24 hours prior to event start.",
        type: "toggle",
        defaultValue: true,
      },
    ],
  },
  {
    key: "member_registration_forms",
    name: "Member Registration Forms",
    description: "Collect detailed attendee profile fields (college, department, roll number) with ticket tier targeting.",
    icon: FileText,
    tag: "REGISTRATION",
    category: "ticketing",
    configUrl: (eventId) => `/event/${eventId}/settings`,
    defaultConfigTitle: "Member Form Fields",
    configOptions: [
      {
        id: "require_college",
        label: "Require College / Institution Name",
        description: "Mandate institution name for all student/member registrations.",
        type: "toggle",
        defaultValue: true,
      },
      {
        id: "require_roll_number",
        label: "Require Roll / Employee ID",
        description: "Collect unique institutional ID number from each attendee.",
        type: "toggle",
        defaultValue: true,
      },
      {
        id: "strict_validation",
        label: "Strict Pre-Pass Generation Validation",
        description: "Do not issue digital pass QR until all required form fields are completed.",
        type: "toggle",
        defaultValue: true,
      },
    ],
  },
  {
    key: "serial_number_validation",
    name: "Serial Number Validation",
    description: "Support manual roll numbers, auto-generated sequences, or verified member whitelists with uniqueness rules.",
    icon: Hash,
    tag: "VALIDATION",
    category: "ticketing",
    configUrl: (eventId) => `/event/${eventId}/settings`,
    defaultConfigTitle: "Serial Number Rules",
    configOptions: [
      {
        id: "serial_mode",
        label: "Serial Generation Strategy",
        description: "Choose how serial numbers are assigned to attendees.",
        type: "select",
        options: [
          { label: "Auto-Sequential (URP-0001)", value: "auto_sequence" },
          { label: "Verified CSV Whitelist Only", value: "whitelist_only" },
          { label: "Manual Attendee Entry", value: "manual_entry" },
        ],
        defaultValue: "auto_sequence",
      },
      {
        id: "enforce_unique",
        label: "Strict Event-Wide Uniqueness",
        description: "Reject any duplicate serial number across the entire event.",
        type: "toggle",
        defaultValue: true,
      },
    ],
  },
  {
    key: "ticket_reassignment",
    name: "Digital QR Identity & Ticket Reassignment",
    description: "Issue persistent opaque QR tokens and allow purchasers/organizers to revoke and reassign unused passes.",
    icon: UserCheck,
    tag: "IDENTITY",
    category: "ticketing",
    configUrl: (eventId) => `/event/${eventId}/attendees`,
    defaultConfigTitle: "Ticket Reassignment Policy",
    configOptions: [
      {
        id: "reassignment_cutoff_hours",
        label: "Reassignment Cutoff",
        description: "Hours before event start time when ticket transfers are locked.",
        type: "select",
        options: [
          { label: "Up until event start (0h)", value: "0" },
          { label: "2 Hours Before Start", value: "2" },
          { label: "24 Hours Before Start", value: "24" },
          { label: "Organizer Approval Only", value: "organizer_only" },
        ],
        defaultValue: "2",
      },
      {
        id: "rotate_qr_token",
        label: "Instant QR Invalidation on Transfer",
        description: "Immediately invalidate the old QR pass and issue a cryptographic replacement.",
        type: "toggle",
        defaultValue: true,
      },
      {
        id: "audit_actor_logs",
        label: "Record Full Transfer Audit Trail",
        description: "Store actor IP, authorization timestamp, and original owner metadata.",
        type: "toggle",
        defaultValue: true,
      },
    ],
  },
  {
    key: "advanced_entry_tracking",
    name: "Advanced Entry, Exit & Multi-Gate Tracking",
    description: "Multi-gate zone routing, real-time entry/exit presence tracking, staff assignment, and anti-passback controls.",
    icon: DoorOpen,
    tag: "GATES & VENUE",
    category: "venue",
    configUrl: (eventId) => `/event/${eventId}/gates`,
    defaultConfigTitle: "Gate Operations & Presence Controls",
    configOptions: [
      {
        id: "re_entry_policy",
        label: "Event Re-Entry Policy",
        description: "Define whether attendees are permitted to exit and re-enter the venue.",
        type: "select",
        options: [
          { label: "Allow Re-Entry (Multi-Entry Permitted)", value: "allowed" },
          { label: "Single Entry Only (No Re-entry)", value: "single_entry" },
          { label: "Staff Override Required for Re-Entry", value: "staff_override" },
        ],
        defaultValue: "allowed",
      },
      {
        id: "duplicate_policy",
        label: "Immediate Duplicate Scan Rule",
        description: "Action taken when the same ticket QR is scanned twice in quick succession.",
        type: "select",
        options: [
          { label: "Reject Duplicate Scans (Strict)", value: "reject" },
          { label: "Warn Scanner Staff but Allow", value: "warn" },
          { label: "Allow Multi-Scan", value: "allow" },
        ],
        defaultValue: "reject",
      },
      {
        id: "anti_passback_seconds",
        label: "Anti-Passback Window (Seconds)",
        description: "Minimum seconds between entry scans to prevent ticket handbacks.",
        type: "select",
        options: [
          { label: "30 Seconds", value: "30" },
          { label: "60 Seconds (Standard)", value: "60" },
          { label: "120 Seconds", value: "120" },
          { label: "300 Seconds (5 Mins)", value: "300" },
        ],
        defaultValue: "60",
      },
    ],
  },
  {
    key: "session_attendance",
    name: "Session-Wise Attendance & Scanning",
    description: "Track session-level attendance, multi-track capacities, check-in/checkout duration, and eligibility.",
    icon: Calendar,
    tag: "SESSIONS",
    category: "venue",
    configUrl: (eventId) => `/event/${eventId}/sessions`,
    defaultConfigTitle: "Session Attendance Configuration",
    configOptions: [
      {
        id: "checkin_window_minutes",
        label: "Session Check-in Window",
        description: "Minutes before scheduled session start when scanner check-in opens.",
        type: "select",
        options: [
          { label: "15 Minutes Before", value: "15" },
          { label: "30 Minutes Before (Default)", value: "30" },
          { label: "60 Minutes Before", value: "60" },
          { label: "Anytime during event day", value: "0" },
        ],
        defaultValue: "30",
      },
      {
        id: "require_checkout",
        label: "Track Session Checkout Duration",
        description: "Prompt scanner operators to record attendee exit to measure session dwell time.",
        type: "toggle",
        defaultValue: false,
      },
      {
        id: "allow_overlap",
        label: "Allow Concurrent Overlapping Sessions",
        description: "Permit an attendee to check into sessions scheduled at overlapping time slots.",
        type: "toggle",
        defaultValue: true,
      },
    ],
  },
  {
    key: "csv_management",
    name: "CSV Import & Export Management",
    description: "Downloadable CSV templates, staged validation import pipelines, and formula-sanitized analytics exports.",
    icon: FileSpreadsheet,
    tag: "DATA OPS",
    category: "data",
    configUrl: (eventId) => `/event/${eventId}/attendees`,
    defaultConfigTitle: "CSV Data Pipeline Settings",
    configOptions: [
      {
        id: "staged_validation",
        label: "Staged Validation Pipeline",
        description: "Require preview and explicit confirmation before inserting bulk CSV records into database.",
        type: "toggle",
        defaultValue: true,
      },
      {
        id: "anti_formula_injection",
        label: "Sanitize Formula Injection",
        description: "Prepend single quotes to cells starting with =, +, -, @ to prevent spreadsheet macros.",
        type: "toggle",
        defaultValue: true,
      },
      {
        id: "max_import_batch",
        label: "Max Batch Size",
        description: "Maximum allowable rows per uploaded CSV file.",
        type: "select",
        options: [
          { label: "1,000 Rows", value: "1000" },
          { label: "5,000 Rows (Recommended)", value: "5000" },
          { label: "10,000 Rows (Enterprise)", value: "10000" },
        ],
        defaultValue: "5000",
      },
    ],
  },
  {
    key: "offline_scanning",
    name: "Offline Scanning & Synchronization",
    description: "Pre-cache event pass manifests in browser storage for instant zero-latency offline gate check-in.",
    icon: WifiOff,
    tag: "SCANNER OPS",
    category: "venue",
    configUrl: (eventId) => `/event/${eventId}/scanner`,
    defaultConfigTitle: "Offline Scanner Manifest Rules",
    configOptions: [
      {
        id: "auto_sync_on_reconnect",
        label: "Auto Background Sync on Reconnect",
        description: "Immediately sync locally queued offline scans when network connection is restored.",
        type: "toggle",
        defaultValue: true,
      },
      {
        id: "conflict_rule",
        label: "Offline Conflict Resolution",
        description: "Conflict reconciliation strategy for overlapping offline scans across staff devices.",
        type: "select",
        options: [
          { label: "Server-Authoritative (Earliest Timestamp)", value: "earliest_server" },
          { label: "Accept All & Flag Warning", value: "accept_and_flag" },
          { label: "Strict Rejection", value: "strict_reject" },
        ],
        defaultValue: "earliest_server",
      },
    ],
  },
  {
    key: "advanced_analytics",
    name: "Advanced Operational Analytics",
    description: "Real-time net venue headcount (safe re-entry), gate throughput velocity curves, and session fill rates.",
    icon: BarChart3,
    tag: "ANALYTICS",
    category: "data",
    configUrl: (eventId) => `/event/${eventId}/analytics`,
    defaultConfigTitle: "Analytics & Telemetry Reporting",
    configOptions: [
      {
        id: "telemetry_interval_sec",
        label: "Live Telemetry Refresh Rate",
        description: "Frequency of real-time venue presence headcount updates.",
        type: "select",
        options: [
          { label: "Every 5 Seconds", value: "5" },
          { label: "Every 15 Seconds (Standard)", value: "15" },
          { label: "Every 60 Seconds", value: "60" },
        ],
        defaultValue: "15",
      },
      {
        id: "include_demographics",
        label: "Demographics Breakdown",
        description: "Aggregate live attendee distribution by college, department, and ticket tier.",
        type: "toggle",
        defaultValue: true,
      },
    ],
  },
];

interface AdvancedFeaturesSettingsProps {
  eventId: string;
}

export default function AdvancedFeaturesSettings({ eventId }: AdvancedFeaturesSettingsProps) {
  const [flags, setFlags] = useState<Record<FeatureFlagKey, boolean>>({} as Record<FeatureFlagKey, boolean>);
  const [usableFlags, setUsableFlags] = useState<Record<FeatureFlagKey, boolean>>({} as Record<FeatureFlagKey, boolean>);
  const [platformFlags, setPlatformFlags] = useState<Record<FeatureFlagKey, boolean>>({} as Record<FeatureFlagKey, boolean>);
  const [config, setConfig] = useState<EventFeaturesConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<FeatureFlagKey | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [confirmDisableKey, setConfirmDisableKey] = useState<FeatureFlagKey | null>(null);

  // View mode tab switcher: "settings" vs "simulator"
  const [viewMode, setViewMode] = useState<"settings" | "simulator">("settings");

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "ticketing" | "venue" | "data">("all");

  // Setup Drawer / Modal state
  const [configuringModule, setConfiguringModule] = useState<ModuleMeta | null>(null);
  const [localModuleSettings, setLocalModuleSettings] = useState<Record<string, unknown>>({});
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    async function loadFlags() {
      try {
        setLoading(true);
        const res = await getEventFeatureFlagsState(eventId);
        if (res.error) {
          setErrorMsg(res.error);
        } else if (res.features) {
          setFlags(res.features);
          setUsableFlags(res.usable || ({} as Record<FeatureFlagKey, boolean>));
          setPlatformFlags(res.platformAvailable || ({} as Record<FeatureFlagKey, boolean>));
          setConfig(res.config || null);
        }
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Failed to load feature flags.");
      } finally {
        setLoading(false);
      }
    }
    loadFlags();
  }, [eventId]);

  const enabledCount = MODULAR_FEATURES.filter((m) => Boolean(flags[m.key])).length;
  const totalCount = MODULAR_FEATURES.length;

  const filteredFeatures = useMemo(() => {
    return MODULAR_FEATURES.filter((mod) => {
      const matchesCategory =
        selectedCategory === "all" || mod.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleToggle = async (key: FeatureFlagKey, nextState: boolean) => {
    if (!nextState) {
      setConfirmDisableKey(key);
      return;
    }
    await executeToggle(key, true);
  };

  const executeToggle = async (key: FeatureFlagKey, nextState: boolean) => {
    try {
      setSavingKey(key);
      setErrorMsg("");
      setSuccessMsg("");

      // Optimistic update
      setFlags((prev) => ({ ...prev, [key]: nextState }));

      const res = await updateEventFeatureFlag(
        eventId,
        key,
        nextState,
        config?.version
      );

      if (res.error) {
        // Revert optimistic update
        setFlags((prev) => ({ ...prev, [key]: !nextState }));
        setErrorMsg(res.error);
      } else {
        if (res.config) {
          setConfig(res.config);
        }
        if (typeof res.usable === "boolean") {
          setUsableFlags((prev) => ({ ...prev, [key]: res.usable === true }));
        }
        const modName = MODULAR_FEATURES.find((m) => m.key === key)?.name;
        setSuccessMsg(`Successfully ${nextState ? "enabled" : "disabled"} ${modName}.`);
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err) {
      setFlags((prev) => ({ ...prev, [key]: !nextState }));
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setSavingKey(null);
      setConfirmDisableKey(null);
    }
  };

  const openSetupModal = (mod: ModuleMeta) => {
    setConfiguringModule(mod);
    const initialSettings: Record<string, unknown> = {};
    mod.configOptions?.forEach((opt) => {
      initialSettings[opt.id] = opt.defaultValue;
    });
    setLocalModuleSettings(initialSettings);
  };

  const handleSaveModuleSettings = async () => {
    if (!configuringModule) return;
    setSavingSettings(true);
    try {
      // If module is currently disabled, also auto-enable it when saving setup
      if (!flags[configuringModule.key]) {
        await executeToggle(configuringModule.key, true);
      }
      setSuccessMsg(`Rules configured for ${configuringModule.name}.`);
      setTimeout(() => setSuccessMsg(""), 3500);
      setConfiguringModule(null);
    } catch {
      setErrorMsg("Failed to save module configuration.");
    } finally {
      setSavingSettings(false);
    }
  };

  // Preset Handlers
  const applyPreset = async (targetKeys: FeatureFlagKey[]) => {
    setErrorMsg("");
    setSuccessMsg("Applying preset configuration…");
    try {
      for (const mod of MODULAR_FEATURES) {
        const shouldBeEnabled = targetKeys.includes(mod.key);
        if (Boolean(flags[mod.key]) !== shouldBeEnabled) {
          await updateEventFeatureFlag(eventId, mod.key, shouldBeEnabled);
          setFlags((prev) => ({ ...prev, [mod.key]: shouldBeEnabled }));
        }
      }
      setSuccessMsg("Preset applied successfully.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch {
      setErrorMsg("Some features in the preset could not be updated.");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-100 p-8 flex items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-brand" />
        <span className="text-sm font-medium text-neutral-500">Loading modular features…</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-neutral-100 bg-neutral-50/50">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-violet-100/70 border border-violet-200/60 flex items-center justify-center shrink-0 mt-0.5">
            <Sliders className="w-5 h-5 text-violet-700" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-neutral-900 tracking-tight">Advanced Features</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-800 border border-violet-200">
                {enabledCount} / {totalCount} enabled
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1 max-w-2xl leading-relaxed">
              Enable only the capabilities required for this event. Disabled modules add zero overhead and remain hidden from public registration and scanner flows.
            </p>
          </div>
        </div>

        {/* Quick Presets Menu */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() =>
              applyPreset([
                "bulk_ticket_booking",
                "ticket_distribution",
                "member_registration_forms",
                "serial_number_validation",
                "session_attendance",
                "offline_scanning",
              ])
            }
            className="px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-[11px] font-semibold text-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Configure for College Fest / Multi-Track Student Program"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span>Campus Fest</span>
          </button>

          <button
            type="button"
            onClick={() =>
              applyPreset([
                "session_attendance",
                "ticket_reassignment",
                "advanced_entry_tracking",
                "csv_management",
                "advanced_analytics",
              ])
            }
            className="px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-[11px] font-semibold text-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Configure for Corporate Conference / Multi-Gate Summit"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            <span>Conference</span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset([])}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-[11px] font-semibold text-neutral-500 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            title="Reset to minimal standard registration"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* ── Status Alerts ── */}
      <div className="px-6 pt-4">
        {errorMsg && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700 mb-3">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-sm text-emerald-800 mb-3 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <p>{successMsg}</p>
          </div>
        )}
      </div>

      {/* ── Sub-Navigation Tabs ── */}
      <div className="flex items-center justify-between px-6 border-b border-neutral-100 bg-neutral-50/30">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode("settings")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              viewMode === "settings"
                ? "border-violet-600 text-violet-700 bg-violet-50/30"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Feature Switches & Rules</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("simulator")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              viewMode === "simulator"
                ? "border-violet-600 text-violet-700 bg-violet-50/30"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Real-Time Sandbox & Simulator</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Live
            </span>
          </button>
        </div>

        <Link
          href="/advanced-features"
          target="_blank"
          className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-violet-700 transition-colors py-2"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>How-To Guide</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {viewMode === "simulator" ? (
        <div className="p-6">
          <AdvancedFeaturesLiveSimulator />
        </div>
      ) : (
        <>
          {/* ── Search & Category Filter Bar ── */}
          <div className="px-6 py-3 border-b border-neutral-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search features (e.g., Gates, Sessions, Serial numbers)…"
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(
                [
                  { id: "all", label: "All Modules" },
                  { id: "ticketing", label: "Ticketing & Identity" },
                  { id: "venue", label: "Venue & Sessions" },
                  { id: "data", label: "Data & Ops" },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-violet-100 text-violet-800 border border-violet-200"
                      : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-200/60"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Modular Feature Cards Grid ── */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFeatures.map((mod) => {
          const isEnabled = Boolean(flags[mod.key]);
          const isUpdating = savingKey === mod.key;
          const platformAvailable = platformFlags[mod.key] !== false;
          const usable = Boolean(usableFlags[mod.key]);
          const Icon = mod.icon;

          return (
            <div
              key={mod.key}
              className={`relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 ${
                isEnabled
                  ? "bg-violet-50/20 border-violet-200/80 shadow-[0_1px_3px_rgba(109,40,217,0.05)]"
                  : "bg-neutral-50/40 border-neutral-200/70 hover:border-neutral-300"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isEnabled
                          ? "bg-violet-600 text-white border-violet-700 shadow-sm"
                          : "bg-white text-neutral-400 border-neutral-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                          {mod.name}
                        </h3>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                        {mod.tag}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isEnabled}
                    disabled={isUpdating || !platformAvailable}
                    onClick={() => handleToggle(mod.key, !isEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full shrink-0 transition-colors duration-200 disabled:opacity-50 cursor-pointer ${
                      isEnabled ? "bg-violet-600" : "bg-neutral-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        isEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-neutral-500 mt-2.5 leading-relaxed">
                  {mod.description}
                </p>

                {mod.dependencies && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200/70 px-2 py-1 rounded-md">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>Works with {mod.dependencies.join(", ")}</span>
                  </div>
                )}
                {!platformAvailable && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-neutral-600 bg-neutral-100 border border-neutral-200 px-2 py-1 rounded-md">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>Platform release flag is off</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-[11px] ${
                    isEnabled
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isEnabled ? "bg-emerald-500" : "bg-neutral-400"
                    }`}
                  />
                  {isEnabled ? "Enabled" : "Disabled"}
                </span>

                <div className="flex items-center gap-2">
                  {/* Setup / Configure Modal Trigger */}
                  <button
                    type="button"
                    onClick={() => openSetupModal(mod)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-700 hover:text-violet-700 px-2 py-1 rounded-md hover:bg-violet-50 transition-colors cursor-pointer"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Configure Rules</span>
                  </button>

                  {/* Deep link if usable */}
                  {isEnabled && usable && mod.configUrl && (
                    <Link
                      href={mod.configUrl(eventId)}
                      className="inline-flex items-center gap-0.5 font-semibold text-violet-700 hover:text-violet-900 transition-colors text-[11px]"
                      title="Open dedicated workspace page"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  )}

      {/* ── Interactive Module Setup Drawer / Modal ── */}
      {configuringModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-100 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200/80 flex items-center justify-center text-violet-700 shrink-0">
                    <configuringModule.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 leading-tight">
                      {configuringModule.defaultConfigTitle || `Setup ${configuringModule.name}`}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {configuringModule.name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setConfiguringModule(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Configuration Form Controls */}
              <div className="py-4 space-y-4 overflow-y-auto max-h-[50vh] pr-1">
                {configuringModule.configOptions?.map((opt) => (
                  <div
                    key={opt.id}
                    className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/60 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <label className="text-xs font-bold text-neutral-800 block">
                          {opt.label}
                        </label>
                        <p className="text-[11px] text-neutral-500 leading-relaxed mt-0.5">
                          {opt.description}
                        </p>
                      </div>

                      {opt.type === "toggle" && (
                        <button
                          type="button"
                          role="switch"
                          aria-checked={Boolean(localModuleSettings[opt.id])}
                          onClick={() =>
                            setLocalModuleSettings((prev) => ({
                              ...prev,
                              [opt.id]: !prev[opt.id],
                            }))
                          }
                          className={`relative inline-flex h-5 w-9 items-center rounded-full shrink-0 transition-colors duration-200 cursor-pointer ${
                            localModuleSettings[opt.id] ? "bg-violet-600" : "bg-neutral-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                              localModuleSettings[opt.id] ? "translate-x-4" : "translate-x-1"
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {opt.type === "select" && opt.options && (
                      <select
                        value={String(localModuleSettings[opt.id] || opt.defaultValue)}
                        onChange={(e) =>
                          setLocalModuleSettings((prev) => ({
                            ...prev,
                            [opt.id]: e.target.value,
                          }))
                        }
                        className="w-full mt-1.5 px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg outline-none focus:border-brand"
                      >
                        {opt.options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}

                {configuringModule.configUrl && (
                  <div className="pt-2">
                    <Link
                      href={configuringModule.configUrl(eventId)}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-900 bg-violet-50 px-3 py-2 rounded-xl border border-violet-100 transition-colors w-full justify-center"
                    >
                      <span>Open Advanced Workspace Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
              <span className="text-[11px] text-neutral-400">
                Changes apply instantly for this event
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfiguringModule(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 transition-colors text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveModuleSettings}
                  disabled={savingSettings}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {savingSettings ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Save Configuration</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Non-Destructive Disable Confirmation Modal ── */}
      {confirmDisableKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-100 animate-in fade-in zoom-in-95">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 text-amber-600">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-neutral-900">
              Disable {MODULAR_FEATURES.find((m) => m.key === confirmDisableKey)?.name}?
            </h3>

            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Disabling this module will hide its workflow from new attendees and scanners.
              <strong className="block mt-1 font-semibold text-neutral-800">
                Existing historical records are preserved and will not be deleted.
              </strong>
            </p>

            <div className="mt-5 flex gap-2.5 justify-end">
              <button
                type="button"
                onClick={() => setConfirmDisableKey(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 transition-colors text-neutral-700 cursor-pointer"
              >
                Keep Enabled
              </button>
              <button
                type="button"
                onClick={() => executeToggle(confirmDisableKey, false)}
                disabled={savingKey === confirmDisableKey}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {savingKey === confirmDisableKey && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Disable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
