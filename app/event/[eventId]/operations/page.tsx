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

export default function LiveOperationsDashboardPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [stats, setStats] = useState<any>({
    totalZones: 0,
    totalCapacity: 0,
    totalOccupancy: 0,
    overallOccupancyPercent: 0,
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
    const interval = setInterval(fetchOpsData, 5000);
    return () => clearInterval(interval);
  }, [eventId]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              LIVE OPERATIONS COMMAND CENTER
            </span>
            <span className="text-xs text-neutral-400">·</span>
            <span className="text-xs text-neutral-500 font-mono">
              Auto-syncs every 5s · Last: {lastRefreshed.toLocaleTimeString()}
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
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Active Gate Scanners</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-emerald-600">{stats.activeScanners}</span>
            <span className="text-xs text-neutral-500 font-medium">online</span>
          </div>
          <p className="mt-3 text-[11px] text-neutral-500 font-medium">
            Sub-0.3s validation speed
          </p>
        </div>

        <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Print Queue Status</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-neutral-900">{stats.queuedBadgePrints}</span>
            <span className="text-xs text-neutral-500 font-medium">pending</span>
          </div>
          <p className="mt-3 text-[11px] text-neutral-500 font-medium">
            Thermal stations operating
          </p>
        </div>

        <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Active Ops Alerts</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl font-black ${stats.unresolvedAlertsCount > 0 ? "text-amber-600" : "text-neutral-900"}`}>
              {stats.unresolvedAlertsCount}
            </span>
            <span className="text-xs text-neutral-500 font-medium">warnings</span>
          </div>
          <p className="mt-3 text-[11px] text-neutral-500 font-medium">
            Automatic capacity tripwires
          </p>
        </div>
      </div>

      {/* Operational Alerts Banner */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Live Incident &amp; Capacity Alerts</h2>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border flex items-start justify-between gap-4 ${
                alert.severity === "critical"
                  ? "bg-red-50 border-red-200 text-red-900"
                  : "bg-amber-50 border-amber-200 text-amber-900"
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${alert.severity === "critical" ? "text-red-600" : "text-amber-600"}`} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">{alert.alertType.replace("_", " ")}</p>
                  <p className="text-xs mt-0.5">{alert.message}</p>
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    {new Date(alert.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-neutral-300">
                Action Required
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Zone Occupancy Meter Section */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Real-Time Zone Occupancy Meters</h2>
            <p className="text-xs text-neutral-500">
              Live capacity limits automatically stop gate entries when zones exceed safe thresholds.
            </p>
          </div>
          <Link
            href={`/event/${eventId}/zones`}
            className="text-xs text-brand font-semibold hover:underline flex items-center gap-1"
          >
            <span>Manage Zones &amp; Floor Plan</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zones.map((zone) => {
            const pct = zone.capacity > 0 ? Math.round((zone.currentOccupancy / zone.capacity) * 100) : 0;
            const isFull = zone.capacity > 0 && zone.currentOccupancy >= zone.capacity;
            const isNearlyFull = pct >= 85 && !isFull;

            return (
              <div key={zone.id} className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: zone.color }} />
                    <span className="font-bold text-neutral-900">{zone.name}</span>
                  </div>
                  <span className={`font-mono font-bold ${isFull ? "text-red-600" : isNearlyFull ? "text-amber-600" : "text-neutral-700"}`}>
                    {zone.currentOccupancy} / {zone.capacity} ({pct}%)
                  </span>
                </div>

                <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFull ? "bg-red-500" : isNearlyFull ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Activity & Audit Stream */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900">Recent Operations &amp; Audit Logs</h2>
          <Link
            href={`/event/${eventId}/operations-analytics`}
            className="text-xs text-brand font-semibold hover:underline flex items-center gap-1"
          >
            <span>Full Audit History &amp; Analytics</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="divide-y divide-neutral-100 text-xs">
          {recentAudits.length === 0 ? (
            <div className="py-8 text-center text-neutral-400">
              No recent audit events. Check-ins, overrides, and badge prints will appear here in real-time.
            </div>
          ) : (
            recentAudits.slice(0, 8).map((audit) => (
              <div key={audit.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-neutral-900">
                    {audit.actorName} performed <strong className="text-brand uppercase">{audit.actionType.replace("_", " ")}</strong>
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Target: {audit.targetType} #{audit.targetId}
                  </p>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {new Date(audit.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
