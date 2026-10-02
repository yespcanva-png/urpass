"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Printer,
  QrCode,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  Settings2,
  FileText,
  Search,
  Plus,
  Trash2,
  RefreshCw,
  Eye,
  Sliders,
  Shield,
  Download,
  Check,
} from "lucide-react";
import {
  BadgeTemplate,
  BadgeRoleType,
  BadgeOrientation,
  BadgeSizePreset,
  BADGE_SIZE_PRESETS,
  BadgePrintQueueItem,
  BadgePrintLog,
} from "@/lib/physical-ops/types";
import { DEFAULT_ROLE_COLORS } from "@/lib/physical-ops/badge-service";
import { createClient } from "@/lib/supabase/client";

export default function BadgesOpsPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [activeTab, setActiveTab] = useState<"studio" | "printing" | "logs">("studio");
  const [templates, setTemplates] = useState<BadgeTemplate[]>([]);
  const [selectedRole, setSelectedRole] = useState<BadgeRoleType>("attendee");
  const [selectedOrientation, setSelectedOrientation] = useState<BadgeOrientation>("portrait");
  const [selectedSizePreset, setSelectedSizePreset] = useState<BadgeSizePreset>("lanyard_100x150");
  const [customWidth, setCustomWidth] = useState(100);
  const [customHeight, setCustomHeight] = useState(150);
  const [headerTitle, setHeaderTitle] = useState("ATTENDEE");
  const [headerColor, setHeaderColor] = useState("#1E293B");
  const [accentColor, setAccentColor] = useState("#3B82F6");
  const [showLanyardSlot, setShowLanyardSlot] = useState(true);
  const [showQrCode, setShowQrCode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Printing state
  const [queue, setQueue] = useState<BadgePrintQueueItem[]>([]);
  const [logs, setLogs] = useState<BadgePrintLog[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState("Zebra ZD621 (Direct Thermal)");
  const [searchQuery, setSearchQuery] = useState("");
  const [reprintModalOpen, setReprintModalOpen] = useState(false);
  const [reprintTarget, setReprintTarget] = useState<BadgePrintQueueItem | null>(null);
  const [reprintReason, setReprintReason] = useState("Lost Badge at Venue");

  const [isBulkQueueing, setIsBulkQueueing] = useState(false);

  const fetchBadgeData = () => {
    fetch(`/api/event/${eventId}/ops`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.badgeTemplates && data.badgeTemplates.length > 0) {
            setTemplates(data.badgeTemplates);
            const def = data.badgeTemplates[0];
            setSelectedRole(def.badgeType);
            setSelectedOrientation(def.orientation);
            setSelectedSizePreset(def.sizePreset);
            setHeaderTitle(def.layout.headerTitle || def.name);
            setHeaderColor(def.layout.headerColor);
            setAccentColor(def.layout.accentColor);
            setShowLanyardSlot(def.layout.showLanyardSlot);
            setShowQrCode(def.layout.showQrCode);
          }
          if (data.printQueue) setQueue(data.printQueue);
          if (data.printLogs) setLogs(data.printLogs);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchBadgeData();

    const supabase = createClient();
    const channel = supabase
      .channel(`badges-realtime-${eventId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "badge_print_queue", filter: `event_id=eq.${eventId}` },
        () => {
          fetchBadgeData();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "badge_print_logs", filter: `event_id=eq.${eventId}` },
        () => {
          fetchBadgeData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const handleRoleChange = (role: BadgeRoleType) => {
    setSelectedRole(role);
    const cfg = DEFAULT_ROLE_COLORS[role];
    if (cfg) {
      setHeaderColor(cfg.headerColor);
      setAccentColor(cfg.accentColor);
      setHeaderTitle(cfg.label);
    }
  };

  const handleSaveTemplate = async () => {
    setIsSaving(true);
    const activeTemplate = templates.find((t) => t.badgeType === selectedRole) || templates[0];
    const sizeConfig = BADGE_SIZE_PRESETS[selectedSizePreset] || BADGE_SIZE_PRESETS.lanyard_100x150;
    const updatedTemplate = {
      ...activeTemplate,
      badgeType: selectedRole,
      orientation: selectedOrientation,
      sizePreset: selectedSizePreset,
      widthMm: sizeConfig.widthMm,
      heightMm: sizeConfig.heightMm,
      layout: {
        ...(activeTemplate?.layout || {}),
        headerTitle,
        headerColor,
        accentColor,
        showLanyardSlot,
        showQrCode,
      },
    };

    try {
      const res = await fetch(`/api/event/${eventId}/ops/print`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_template",
          template: updatedTemplate,
          staffName: "Badge Studio",
        }),
      });
      const data = await res.json();
      setIsSaving(false);
      if (data.success && data.template) {
        setTemplates((prev) =>
          prev.map((t) => (t.badgeType === selectedRole ? data.template : t))
        );
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch {
      setIsSaving(false);
    }
  };

  const handleBulkQueue = async () => {
    setIsBulkQueueing(true);
    try {
      const res = await fetch(`/api/event/${eventId}/ops/print`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bulk_queue" }),
      });
      const data = await res.json();
      setIsBulkQueueing(false);
      if (data.success && data.queue) {
        setQueue(data.queue);
      }
    } catch {
      setIsBulkQueueing(false);
    }
  };

  const handlePrintBadge = (item: BadgePrintQueueItem) => {
    window.print();
    fetch(`/api/event/${eventId}/ops/print`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_status",
        queueId: item.id,
        status: "printed",
        staffName: "Desk Supervisor",
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.item) {
          setQueue((prev) => prev.map((q) => (q.id === item.id ? d.item : q)));
        }
      });
  };

  const handleTriggerReprint = () => {
    if (!reprintTarget) return;
    fetch(`/api/event/${eventId}/ops/print`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "reprint",
        attendee: {
          id: reprintTarget.attendeeId,
          name: reprintTarget.attendeeName,
          company: reprintTarget.attendeeCompany,
          ticketName: reprintTarget.ticketName,
          badgeType: reprintTarget.badgeType,
        },
        reprintReason,
        staffName: "Badge Station #1",
        printerId: selectedPrinter,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          if (d.queueItem) setQueue((prev) => [d.queueItem, ...prev]);
          if (d.reprintLog) setLogs((prev) => [d.reprintLog, ...prev]);
          setReprintModalOpen(false);
        }
      });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-brand/10 text-brand rounded-full">
              STAGE 2 PHYSICAL OPS
            </span>
            <span className="text-xs text-neutral-400">·</span>
            <span className="text-xs text-neutral-500 font-medium">Sprint 1 &amp; 2</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Badge Studio &amp; Printing Station
          </h1>
          <p className="text-sm text-neutral-500">
            Design credentials for VIPs, speakers, and delegates. Dispatch print batches and track reprint audits.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl">
          <button
            onClick={() => setActiveTab("studio")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "studio"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Badge Studio
          </button>
          <button
            onClick={() => setActiveTab("printing")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "printing"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Print Queue
            {queue.filter((q) => q.status === "queued").length > 0 && (
              <span className="w-4 h-4 rounded-full bg-brand text-white text-[9px] flex items-center justify-center font-bold">
                {queue.filter((q) => q.status === "queued").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "logs"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Reprint Audit Logs ({logs.length})
          </button>
        </div>
      </div>

      {activeTab === "studio" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Role / Tier Selector */}
            <div className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">1. Badge Role Preset</h2>
              <div className="grid grid-cols-3 gap-2">
                {(["attendee", "vip", "speaker", "staff", "sponsor", "exhibitor"] as BadgeRoleType[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleChange(r)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all capitalize text-left flex flex-col gap-0.5 ${
                      selectedRole === r
                        ? "border-brand bg-brand/5 text-brand ring-2 ring-brand/20"
                        : "border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white"
                    }`}
                  >
                    <span>{r}</span>
                    <span
                      className="w-3 h-1.5 rounded-full"
                      style={{ backgroundColor: DEFAULT_ROLE_COLORS[r].accentColor }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size & Orientation */}
            <div className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">2. Dimensions &amp; Orientation</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrientation("portrait")}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    selectedOrientation === "portrait"
                      ? "border-brand bg-brand/5 text-brand ring-2 ring-brand/20"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  Portrait (Vertical)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrientation("landscape")}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    selectedOrientation === "landscape"
                      ? "border-brand bg-brand/5 text-brand ring-2 ring-brand/20"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  Landscape (Horizontal)
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-neutral-700">Badge Size Preset</label>
                <select
                  value={selectedSizePreset}
                  onChange={(e) => setSelectedSizePreset(e.target.value as BadgeSizePreset)}
                  className="w-full text-xs font-medium border border-neutral-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                >
                  {Object.entries(BADGE_SIZE_PRESETS).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-neutral-400">
                  {BADGE_SIZE_PRESETS[selectedSizePreset].description}
                </p>
              </div>

              {selectedSizePreset === "custom" && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600">Width (mm)</label>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Number(e.target.value))}
                      className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600">Height (mm)</label>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Number(e.target.value))}
                      className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 mt-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Custom Styling */}
            <div className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">3. Brand Colors &amp; Badging</h2>
              
              <div>
                <label className="text-xs font-semibold text-neutral-700">Header Banner Text</label>
                <input
                  type="text"
                  value={headerTitle}
                  onChange={(e) => setHeaderTitle(e.target.value)}
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-brand/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-neutral-700">Header Color</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={headerColor}
                      onChange={(e) => setHeaderColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-neutral-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={headerColor}
                      onChange={(e) => setHeaderColor(e.target.value)}
                      className="w-full text-xs uppercase font-mono border border-neutral-200 rounded-lg px-2 py-1.5"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700">Accent Color</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-neutral-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-full text-xs uppercase font-mono border border-neutral-200 rounded-lg px-2 py-1.5"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLanyardSlot}
                    onChange={(e) => setShowLanyardSlot(e.target.checked)}
                    className="rounded text-brand focus:ring-brand/20"
                  />
                  <span>Display Lanyard Punch Hole Indicator</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showQrCode}
                    onChange={(e) => setShowQrCode(e.target.checked)}
                    className="rounded text-brand focus:ring-brand/20"
                  />
                  <span>Include Sub-Second Verification QR Code</span>
                </label>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  disabled={isSaving}
                  className="w-full py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Template Saved to Event!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Save Badge Template</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview Column */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 bg-neutral-50 border border-neutral-200 rounded-3xl min-h-[580px]">
            <div className="text-center mb-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                Real-Time Physical Print Preview
              </span>
              <p className="text-xs text-neutral-500">
                Scale: 1:1 screen simulation · Auto-formats to thermal or card printer
              </p>
            </div>

            {/* Badge Card Physical Mockup */}
            <div
              className={`bg-white rounded-2xl shadow-xl border border-neutral-300 relative overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                selectedOrientation === "portrait"
                  ? "w-[300px] h-[450px]"
                  : "w-[440px] h-[300px]"
              }`}
            >
              {/* Lanyard punch hole indicator */}
              {showLanyardSlot && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-neutral-200/90 rounded-full border border-neutral-300 shadow-inner z-20" />
              )}

              {/* Role Header Banner */}
              <div
                className="w-full text-center py-4 px-4 transition-colors"
                style={{ backgroundColor: headerColor }}
              >
                <p className="text-xs font-black tracking-widest text-white uppercase drop-shadow-xs">
                  {headerTitle || "ATTENDEE"}
                </p>
              </div>

              {/* Main Badge Body */}
              <div className="p-6 flex flex-col items-center justify-center text-center flex-1">
                <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase mb-1">
                  DELEGATE CREDENTIAL
                </span>
                <h3 className="text-2xl font-black text-neutral-900 tracking-tight leading-tight">
                  Arunachalam Muruganantham
                </h3>
                <p className="text-sm font-semibold text-neutral-600 mt-1">
                  Chief Technology Officer, Yesp Corp
                </p>

                <div className="mt-3 flex items-center gap-1.5">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    VIP All-Access
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-700">
                    Booth #104
                  </span>
                </div>

                {/* Scannable QR Code */}
                {showQrCode && (
                  <div className="mt-4 p-2 bg-white rounded-xl border border-neutral-200 shadow-xs flex flex-col items-center">
                    <div className="w-24 h-24 bg-neutral-950 rounded-lg p-1.5 flex items-center justify-center">
                      <QrCode className="w-full h-full text-white" />
                    </div>
                    <span className="text-[9px] font-mono font-semibold text-neutral-500 mt-1">
                      PASS-94812
                    </span>
                  </div>
                )}
              </div>

              {/* Event Footer */}
              <div className="py-2.5 px-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-500 font-medium">
                <span className="truncate max-w-[180px]">Global Tech Summit 2026</span>
                <span className="font-mono">GATE A · SEC-1</span>
              </div>
            </div>

            {/* Quick Test Action */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors shadow-2xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4 text-neutral-600" />
                <span>Test Print Sample</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("printing")}
                className="px-4 py-2 rounded-xl bg-brand text-white text-xs font-semibold hover:bg-brand/90 transition-colors shadow-2xs flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>Go to Print Queue</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "printing" && (
        <div className="space-y-4">
          {/* Station Bar */}
          <div className="p-4 bg-white border border-neutral-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Printer className="w-5 h-5 text-brand" />
              <div>
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                  Connected Badge Printer
                </label>
                <select
                  value={selectedPrinter}
                  onChange={(e) => setSelectedPrinter(e.target.value)}
                  className="text-xs font-semibold text-neutral-900 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="Zebra ZD621 (Direct Thermal)">Zebra ZD621 (Station #1 · Main Desk)</option>
                  <option value="Brother QL-820NWB (Lanyard Roll)">Brother QL-820NWB (Station #2 · VIP Lounge)</option>
                  <option value="Evolis Zenius (CR80 PVC Card)">Evolis Zenius (Station #3 · Plastic Card)</option>
                  <option value="Desktop Standard PDF">Desktop Standard / Laser Sheet (AirPrint)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search queue by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>

              <button
                type="button"
                onClick={handleBulkQueue}
                disabled={isBulkQueueing}
                className="px-3.5 py-2 rounded-xl bg-brand/10 border border-brand/20 text-brand text-xs font-semibold hover:bg-brand/20 transition-colors whitespace-nowrap shadow-2xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isBulkQueueing ? "Queueing..." : "Queue All Approved Attendees"}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors whitespace-nowrap shadow-xs"
              >
                Print All Pending ({queue.filter((q) => q.status === "queued").length})
              </button>
            </div>
          </div>

          {/* Queue Table */}
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    <th className="py-3 px-4">Attendee</th>
                    <th className="py-3 px-4">Affiliation / Role</th>
                    <th className="py-3 px-4">Badge Tier</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {queue.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-neutral-400">
                        No badges in print queue. New registrations and walk-in arrivals will populate here automatically.
                      </td>
                    </tr>
                  ) : (
                    queue
                      .filter((q) =>
                        searchQuery
                          ? q.attendeeName.toLowerCase().includes(searchQuery.toLowerCase())
                          : true
                      )
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-neutral-900">
                            {item.attendeeName}
                            <span className="block text-[11px] text-neutral-400 font-normal">
                              {item.attendeeEmail}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-neutral-600">
                            {item.attendeeCompany || "—"}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand/10 text-brand">
                              {item.badgeType}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {item.status === "printed" ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Printed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                Queued
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => handlePrintBadge(item)}
                              className="px-2.5 py-1 rounded-lg bg-neutral-900 text-white text-[11px] font-semibold hover:bg-neutral-800 transition-colors"
                            >
                              Print
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setReprintTarget(item);
                                setReprintModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg border border-neutral-200 text-neutral-700 text-[11px] font-semibold hover:bg-neutral-50 transition-colors"
                            >
                              Reprint
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "logs" && (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900">Reprint Audit &amp; Issuance History</h2>
            <span className="text-xs text-neutral-500">Mandatory fraud &amp; credential tracking</span>
          </div>
          <div className="divide-y divide-neutral-100 text-xs">
            {logs.length === 0 ? (
              <div className="p-12 text-center text-neutral-400">
                Zero reprints recorded. All credentials currently on first issuance.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-neutral-900">{log.attendeeName}</p>
                    <p className="text-[11px] text-neutral-500">
                      Reason: <strong className="text-neutral-700">{log.reprintReason}</strong> · Printed by {log.printedByName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      REPRINT RECORD
                    </span>
                    <span className="block text-[10px] text-neutral-400 mt-1">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Reprint Modal */}
      {reprintModalOpen && reprintTarget && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-900">
              Reprint Badge Credential: {reprintTarget.attendeeName}
            </h3>
            <p className="text-xs text-neutral-500">
              Reprinting triggers an immutable audit log entry to prevent unauthorized ticket duplication.
            </p>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                Mandatory Reason for Reprint
              </label>
              <select
                value={reprintReason}
                onChange={(e) => setReprintReason(e.target.value)}
                className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand/20"
              >
                <option value="Lost Badge at Venue">Lost Badge at Venue</option>
                <option value="Damaged Lanyard / Pouch">Damaged Lanyard / Pouch</option>
                <option value="Name / Affiliation Typo Correction">Name / Affiliation Typo Correction</option>
                <option value="Upgraded to VIP Tier">Upgraded to VIP Tier</option>
                <option value="Printer Jam / Thermal Error">Printer Jam / Thermal Error</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setReprintModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTriggerReprint}
                className="px-4 py-2 rounded-xl bg-brand text-white text-xs font-semibold hover:bg-brand/90 shadow-xs"
              >
                Authorize &amp; Queue Reprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
