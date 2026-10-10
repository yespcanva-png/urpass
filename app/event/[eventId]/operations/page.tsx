"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Users,
  Smartphone,
  Printer,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Radio,
  ScanLine,
  RefreshCw,
  TrendingUp,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";
import { EventZone, OpsAlert } from "@/lib/physical-ops/types";
import { Stage2OpsAnalytics } from "@/lib/physical-ops/analytics-service";
import { createClient } from "@/lib/supabase/client";

export default function LiveOperationsDashboardPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [stats, setStats] = useState<any>({
    totalZones: 0,
    totalCapacity: 0,
    totalOccupancy: 0,
    overallOccupancyPercent: 0,
    registeredCount: 0,
    checkedInCount: 0,
    queuedBadgePrints: 0,
    activeScanners: 0,
    activeStaff: 0,
    unresolvedAlertsCount: 0,
  });
  const [zones, setZones] = useState<EventZone[]>([]);
  const [alerts, setAlerts] = useState<OpsAlert[]>([]);
  const [recentAudits, setRecentAudits] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<Stage2OpsAnalytics | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  const fetchOpsData = () => {
    setIsRefreshing(true);
    fetch(`/api/event/${eventId}/ops`)
      .then((r) => r.json())
      .then((d) => {
        setIsRefreshing(false);
        if (d.success) {
          if (d.stats) setStats(d.stats);
          if (d.zones) setZones(d.zones);
          if (d.alerts) setAlerts(d.alerts);
          if (d.auditLogs) setRecentAudits(d.auditLogs);
          if (d.analytics) setAnalytics(d.analytics);
          setLastRefreshed(new Date());
        }
      })
      .catch(() => setIsRefreshing(false));
  };

  useEffect(() => {
    fetchOpsData();

    const supabase = createClient();
    const channel = supabase
      .channel(`ops-live-telemetry-${eventId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "check_ins", filter: `event_id=eq.${eventId}` }, () => {
        fetchOpsData();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "zone_scans", filter: `event_id=eq.${eventId}` }, () => {
        fetchOpsData();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "ops_alerts", filter: `event_id=eq.${eventId}` }, () => {
        fetchOpsData();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "badge_print_queue", filter: `event_id=eq.${eventId}` }, () => {
        fetchOpsData();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "event_zones", filter: `event_id=eq.${eventId}` }, () => {
        fetchOpsData();
      })
      .subscribe((status) => {
        setIsLiveConnected(status === "SUBSCRIBED");
      });

    const interval = setInterval(fetchOpsData, 8000);
    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [eventId]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${isLiveConnected ? "bg-emerald-500 animate-pulse" : "bg-brand"}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {isLiveConnected ? "REALTIME BROADCAST CONNECTED" : "LIVE OPERATIONS COMMAND CENTER"}
            </span>
            <span className="text-xs text-neutral-400">·</span>
            <span className="text-xs text-neutral-500 font-mono">
              Last synced: {lastRefreshed.toLocaleTimeString()}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Physical Event Operations Dashboard
          </h1>
          <p className="text-sm text-neutral-500">
            Real-time venue occupancy, access control enforcement, multi-gate throughput, and security alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/scan/${eventId}`}
            target="_blank"
            className="px-4 py-2 rounded-xl bg-brand text-white text-xs font-semibold hover:bg-brand/90 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Launch Gate Scanner</span>
          </Link>
          <button
            onClick={fetchOpsData}
            disabled={isRefreshing}
            className="p-2 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* High-Level Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Venue Occupancy</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-neutral-900">{stats.totalOccupancy}</span>
            <span className="text-xs text-neutral-500 font-medium">/ {stats.totalCapacity || "∞"}</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-neutral-500">
            <span className="text-brand font-bold">{stats.overallOccupancyPercent}%</span>
            <span>venue utilization</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Checked-In / Registered</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-neutral-900">{stats.checkedInCount}</span>
            <span className="text-xs text-neutral-500 font-medium">/ {stats.registeredCount || 0}</span>
          </div>
          <p className="mt-3 text-[11px] text-neutral-500 font-medium">
            {stats.registeredCount > 0
              ? `${Math.round((stats.checkedInCount / stats.registeredCount) * 100)}% attendance rate`
              : "Awaiting registrations"}
          </p>
        </div>

        <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Active Gate Scanners</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-emerald-600">{stats.activeScanners}</span>
            <span className="text-xs text-neutral-500 font-medium">online terminals</span>
          </div>
          <p className="mt-3 text-[11px] text-neutral-500 font-medium">
            Sub-0.3s validation speed
          </p>
        </div>

        <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Print Queue Status</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-neutral-900">{stats.queuedBadgePrints}</span>
            <span className="text-xs text-neutral-500 font-medium">pending badges</span>
          </div>
          <p className="mt-3 text-[11px] text-neutral-500 font-medium">
            Thermal stations operating
          </p>
        </div>
      </div>

      {/* Operational Alerts Feed */}
      {alerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-amber-900">
              Active Security &amp; Congestion Alerts ({alerts.length})
            </h3>
          </div>
          <div className="space-y-2">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="bg-white/80 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      alert.severity === "critical" ? "bg-red-500 animate-ping" : "bg-amber-500"
                    }`}
                  />
                  <span className="font-semibold text-neutral-900">{alert.message}</span>
                  {alert.zoneName && (
                    <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[10px] font-mono text-neutral-600">
                      {alert.zoneName}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-neutral-400 font-mono whitespace-nowrap">
                  {new Date(alert.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zones Live Occupancy Strip */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-bold text-neutral-900">Live Zone Occupancy &amp; Capacity Control</h2>
          </div>
          <Link
            href={`/event/${eventId}/zones`}
            className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
          >
            <span>Manage Zones &amp; Floor Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((zone) => {
            const pct = zone.capacity > 0 ? Math.round((zone.currentOccupancy / zone.capacity) * 100) : 0;
            const isFull = zone.capacity > 0 && zone.currentOccupancy >= zone.capacity;
            const isNearlyFull = pct >= 85 && !isFull;

            return (
              <div
                key={zone.id}
                className="border border-neutral-200 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: zone.color }}
                />
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-neutral-900">{zone.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isFull
                          ? "bg-red-100 text-red-700"
                          : isNearlyFull
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5 text-xs text-neutral-500 mb-2">
                    <span className="text-lg font-black text-neutral-900">{zone.currentOccupancy}</span>
                    <span>/ {zone.capacity} capacity</span>
                  </div>

                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull ? "bg-red-500" : isNearlyFull ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400">
                  <span>Peak: {zone.peakOccupancy} inside</span>
                  <span>{isFull ? "Entry Auto-Blocked" : "Entry Allowed"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Recent Audit Stream & Stage 2 Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Audit Stream */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand" />
              <h2 className="text-sm font-bold text-neutral-900">Live Security &amp; Access Audit Stream</h2>
            </div>
            <Link
              href={`/event/${eventId}/operations-analytics`}
              className="text-xs font-semibold text-brand hover:underline"
            >
              View Full Logs
            </Link>
          </div>

          <div className="space-y-3">
            {recentAudits.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-8">
                No supervisor overrides or manual check-ins recorded yet today.
              </p>
            ) : (
              recentAudits.slice(0, 6).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-neutral-50/60 border border-neutral-100 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        log.actionType.includes("override")
                          ? "bg-amber-500"
                          : log.actionType.includes("reprint")
                          ? "bg-purple-500"
                          : "bg-emerald-500"
                      }`}
                    />
                    <div>
                      <span className="font-semibold text-neutral-900">
                        {log.actionType.replace(/_/g, " ").toUpperCase()}
                      </span>
                      <span className="text-neutral-500 mx-1.5">by</span>
                      <span className="font-medium text-neutral-700">{log.actorName}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Access Ops Navigator */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 mb-1">Operations Modules</h2>
            <p className="text-xs text-neutral-500 mb-4">Direct shortcuts to onsite management tools</p>

            <div className="space-y-2">
              <Link
                href={`/event/${eventId}/operations/group-entry`}
                className="flex items-center justify-between p-3 rounded-2xl border border-purple-200 bg-purple-50/40 hover:border-purple-300 hover:bg-purple-50/70 transition-all text-xs font-semibold text-neutral-800"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-purple-600" />
                  <div>
                    <span className="font-bold text-neutral-900">Group QR Entry</span>
                    <span className="block text-[10px] text-neutral-500 font-normal">Partial entry balances &amp; audit history</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>

              <Link
                href={`/event/${eventId}/desk`}
                className="flex items-center justify-between p-3 rounded-2xl border border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50 transition-all text-xs font-semibold text-neutral-800"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-brand" />
                  <span>Onsite Registration Desk</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>

              <Link
                href={`/event/${eventId}/badges`}
                className="flex items-center justify-between p-3 rounded-2xl border border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50 transition-all text-xs font-semibold text-neutral-800"
              >
                <div className="flex items-center gap-2.5">
                  <Printer className="w-4 h-4 text-emerald-600" />
                  <span>Badge Studio &amp; Printing</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>

              <Link
                href={`/event/${eventId}/access-rules`}
                className="flex items-center justify-between p-3 rounded-2xl border border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50 transition-all text-xs font-semibold text-neutral-800"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>Access Rules Engine</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>

              <Link
                href={`/event/${eventId}/staff-devices`}
                className="flex items-center justify-between p-3 rounded-2xl border border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50 transition-all text-xs font-semibold text-neutral-800"
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>Staff &amp; Hardware Devices</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
            </div>
          </div>

          <div className="p-4 bg-brand/5 border border-brand/10 rounded-2xl text-[11px] text-brand">
            <strong>UrPass Realtime Sync:</strong> Changes made at physical scanner gates or registration desks broadcast across all operations consoles in sub-0.3s.
          </div>
        </div>
      </div>
    </div>
  );
}
