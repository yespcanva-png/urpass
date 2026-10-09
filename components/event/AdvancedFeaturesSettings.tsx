"use client";

import { useState, useEffect } from "react";
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
  TableProperties,
  WifiOff,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Info,
} from "lucide-react";
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
  dependencies?: string[];
  configUrl?: (eventId: string) => string;
}

const MODULAR_FEATURES: ModuleMeta[] = [
  {
    key: "bulk_ticket_booking",
    name: "Bulk Ticket Booking",
    description: "Purchase multiple tickets in a single order with atomic capacity reservations and group pricing.",
    icon: Layers,
    tag: "TICKETING",
    configUrl: (eventId) => `/event/${eventId}/tickets`,
  },
  {
    key: "ticket_distribution",
    name: "Bulk Ticket Distribution & Claiming",
    description: "Distribute bulk purchased tickets to individual members with secure claim links and email invites.",
    icon: Send,
    tag: "DISTRIBUTION",
    dependencies: ["Bulk Ticket Booking"],
    configUrl: (eventId) => `/event/${eventId}/attendees`,
  },
  {
    key: "member_registration_forms",
    name: "Member Registration Forms",
    description: "Collect detailed attendee profile fields (college, department, roll number) with ticket tier targeting.",
    icon: FileText,
    tag: "REGISTRATION",
    configUrl: (eventId) => `/event/${eventId}/settings`,
  },
  {
    key: "serial_number_validation",
    name: "Serial Number Validation",
    description: "Support manual roll numbers, auto-generated sequences, or verified member whitelists with uniqueness rules.",
    icon: Hash,
    tag: "VALIDATION",
    configUrl: (eventId) => `/event/${eventId}/settings`,
  },
  {
    key: "ticket_reassignment",
    name: "Digital QR Identity & Ticket Reassignment",
    description: "Issue persistent opaque QR tokens and allow purchasers/organizers to revoke and reassign unused passes.",
    icon: UserCheck,
    tag: "IDENTITY",
    configUrl: (eventId) => `/event/${eventId}/attendees`,
  },
  {
    key: "advanced_entry_tracking",
    name: "Advanced Entry, Exit & Multi-Gate Tracking",
    description: "Multi-gate zone routing, real-time entry/exit presence tracking, staff assignment, and anti-passback controls.",
    icon: DoorOpen,
    tag: "GATES & VENUE",
    configUrl: (eventId) => `/event/${eventId}/gates`,
  },
  {
    key: "session_attendance",
    name: "Session-Wise Attendance & Scanning",
    description: "Track session-level attendance, multi-track capacities, check-in/checkout duration, and eligibility.",
    icon: Calendar,
    tag: "SESSIONS",
    configUrl: (eventId) => `/event/${eventId}/sessions`,
  },
  {
    key: "csv_management",
    name: "CSV Import & Export Management",
    description: "Downloadable CSV templates, staged validation import pipelines, and formula-sanitized analytics exports.",
    icon: FileSpreadsheet,
    tag: "DATA OPS",
    configUrl: (eventId) => `/event/${eventId}/attendees`,
  },
  {
    key: "google_sheets",
    name: "Google Sheets Integration",
    description: "Connect an organizer Google account and sync selected event records to a spreadsheet.",
    icon: TableProperties,
    tag: "INTEGRATION",
    configUrl: (eventId) => `/event/${eventId}/settings`,
  },
  {
    key: "offline_scanning",
    name: "Offline Scanning & Synchronization",
    description: "Pre-cache event pass manifests in browser storage for instant zero-latency offline gate check-in.",
    icon: WifiOff,
    tag: "SCANNER OPS",
    configUrl: (eventId) => `/event/${eventId}/scanner`,
  },
  {
    key: "advanced_analytics",
    name: "Advanced Operational Analytics",
    description: "Real-time net venue headcount (safe re-entry), gate throughput velocity curves, and session fill rates.",
    icon: BarChart3,
    tag: "ANALYTICS",
    configUrl: (eventId) => `/event/${eventId}/analytics`,
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

  const handleToggle = async (key: FeatureFlagKey, nextState: boolean) => {
    if (!nextState) {
      // Show confirmation dialog explaining non-destructive behavior
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
        setSuccessMsg(`Successfully ${nextState ? "enabled" : "disabled"} ${MODULAR_FEATURES.find((m) => m.key === key)?.name}.`);
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

      {/* ── Modular Feature Cards Grid ── */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {MODULAR_FEATURES.map((mod) => {
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
                    className={`relative inline-flex h-6 w-11 items-center rounded-full shrink-0 transition-colors duration-200 disabled:opacity-50 ${
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

                {isEnabled && !usable && (
                  <span className="text-[11px] font-medium text-amber-700">Needs setup</span>
                )}

                {isEnabled && usable && mod.configUrl && (
                  <a
                    href={mod.configUrl(eventId)}
                    className="inline-flex items-center gap-1 font-medium text-violet-700 hover:text-violet-900 transition-colors"
                  >
                    Configure Rules
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

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
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 transition-colors text-neutral-700"
              >
                Keep Enabled
              </button>
              <button
                type="button"
                onClick={() => executeToggle(confirmDisableKey, false)}
                disabled={savingKey === confirmDisableKey}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
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
