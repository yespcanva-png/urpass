"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  Printer,
  Users,
  DoorOpen,
  Filter,
  Download,
  Calendar,
  Layers,
  ArrowUpDown,
} from "lucide-react";
import { Stage2OpsAnalytics } from "@/lib/physical-ops/analytics-service";
import { OpsAuditLog, AuditActionType } from "@/lib/physical-ops/types";

export default function OperationsAnalyticsPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [activeTab, setActiveTab] = useState<"analytics" | "audit">("analytics");
  const [analytics, setAnalytics] = useState<Stage2OpsAnalytics | null>(null);
  const [auditLogs, setAuditLogs] = useState<OpsAuditLog[]>([]);
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(`/api/event/${eventId}/ops`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          if (d.analytics) setAnalytics(d.analytics);
          if (d.auditLogs) setAuditLogs(d.auditLogs);
        }
      });
  }, [eventId]);

  const filteredAudits = auditLogs.filter((log) => {
    if (actionFilter !== "all" && log.actionType !== actionFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.actorName.toLowerCase().includes(q) ||
        log.targetId.toLowerCase().includes(q) ||
        JSON.stringify(log.details).toLowerCase().includes(q)
      );
    }
    return true;
  });

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
            <span className="text-xs text-neutral-500 font-medium">Sprint 10: Analytics &amp; Audit</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Operations Analytics &amp; Immutable Audit Trail
          </h1>
          <p className="text-sm text-neutral-500">
            Granular metrics on badge issuances, gate congestion, capacity overrides, and security access logs.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "analytics"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Ops Analytics
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "audit"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Audit Logs ({auditLogs.length})
          </button>
        </div>
      </div>

      {activeTab === "analytics" && analytics && (
        <div className="space-y-6">
          {/* Analytics Summary Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Badges Printed</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-neutral-900">{analytics.totalBadgePrints}</span>
                <span className="text-xs text-neutral-500">issued</span>
              </div>
              <p className="mt-2 text-[11px] text-neutral-500 font-medium">
                Reprints: <strong className="text-amber-600 font-bold">{analytics.totalReprints}</strong>
              </p>
            </div>

            <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Gate In/Out Flow</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-emerald-600">{analytics.totalEntries}</span>
                <span className="text-xs text-neutral-400">in /</span>
                <span className="text-xl font-bold text-neutral-600">{analytics.totalExits}</span>
                <span className="text-xs text-neutral-400">out</span>
              </div>
              <p className="mt-2 text-[11px] text-neutral-500 font-medium">
                Net venue delta: +{analytics.totalEntries - analytics.totalExits} attendees
              </p>
            </div>

            <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Access Denials</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-red-600">{analytics.rejectedAccessAttempts}</span>
                <span className="text-xs text-neutral-500">blocked</span>
              </div>
              <p className="mt-2 text-[11px] text-neutral-500 font-medium">
                Credential &amp; capacity violations
              </p>
            </div>

            <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Supervisor Overrides</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-neutral-900">{analytics.auditLogSummary.totalOverrides}</span>
                <span className="text-xs text-neutral-500">logged</span>
              </div>
              <p className="mt-2 text-[11px] text-neutral-500 font-medium">
                Capacity &amp; zone bypasses
              </p>
            </div>
          </div>

          {/* Zone Occupancy Breakdown */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-neutral-900">Zone Utilization &amp; Peak Headcounts</h2>
            <div className="divide-y divide-neutral-100 text-xs">
              {analytics.zoneOccupancyBreakdown.map((z) => (
                <div key={z.zoneId} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: z.color }} />
                    <div>
                      <p className="font-bold text-neutral-900">{z.zoneName}</p>
                      <p className="text-[11px] text-neutral-500">
                        Current: <strong>{z.currentOccupancy}</strong> · Capacity: <strong>{z.capacity}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-36 text-right">
                      <span className="font-bold text-neutral-900">{z.occupancyPercent}% Occupancy</span>
                      <div className="w-full h-1.5 bg-neutral-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${z.occupancyPercent >= 100 ? "bg-red-500" : z.occupancyPercent >= 85 ? "bg-amber-500" : "bg-emerald-500"}`}
                          style={{ width: `${Math.min(100, z.occupancyPercent)}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-neutral-400 block">Peak Recorded</span>
                      <span className="font-bold text-neutral-900">{z.peakOccupancy} people</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rejection & Reprint Breakdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-neutral-200 rounded-3xl shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-neutral-900">Denied Access Attempts Breakdown</h3>
              <div className="space-y-2 pt-2">
                {Object.keys(analytics.rejectionBreakdown).length === 0 ? (
                  <p className="text-xs text-neutral-400 py-4">Zero access rejections recorded.</p>
                ) : (
                  Object.entries(analytics.rejectionBreakdown).map(([reason, count]) => (
                    <div key={reason} className="flex justify-between text-xs py-1.5 border-b border-neutral-100">
                      <span className="text-neutral-600">{reason}</span>
                      <strong className="text-red-600 font-bold">{count} scans</strong>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-6 bg-white border border-neutral-200 rounded-3xl shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-neutral-900">Badge Reprint Justification Log</h3>
              <div className="space-y-2 pt-2">
                {Object.keys(analytics.reprintReasons).length === 0 ? (
                  <p className="text-xs text-neutral-400 py-4">Zero badge reprints logged.</p>
                ) : (
                  Object.entries(analytics.reprintReasons).map(([reason, count]) => (
                    <div key={reason} className="flex justify-between text-xs py-1.5 border-b border-neutral-100">
                      <span className="text-neutral-600">{reason}</span>
                      <strong className="text-amber-700 font-bold">{count} reprints</strong>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 bg-white border border-neutral-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Filter Action:</span>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="text-xs font-semibold border border-neutral-200 rounded-xl px-3 py-2 bg-white"
              >
                <option value="all">All Actions</option>
                <option value="capacity_override">Capacity Overrides</option>
                <option value="badge_reprint">Badge Reprints</option>
                <option value="manual_checkin">Manual Check-Ins</option>
                <option value="walkin_registration">Walk-In Registrations</option>
                <option value="payment_status_change">Payment Status Changes</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Search audit trail by actor or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 text-xs border border-neutral-200 rounded-xl px-3 py-2"
            />
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    <th className="py-3 px-4">Action / Event</th>
                    <th className="py-3 px-4">Staff Member / Actor</th>
                    <th className="py-3 px-4">Target Entity</th>
                    <th className="py-3 px-4">Audit Details</th>
                    <th className="py-3 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {filteredAudits.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-neutral-400">
                        No audit logs matching selection.
                      </td>
                    </tr>
                  ) : (
                    filteredAudits.map((log) => (
                      <tr key={log.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-neutral-900">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700">
                            {log.actionType.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-neutral-800">
                          {log.actorName}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-500">
                          {log.targetType} #{log.targetId}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-600 font-mono text-[11px] max-w-xs truncate">
                          {JSON.stringify(log.details)}
                        </td>
                        <td className="py-3.5 px-4 text-right text-[11px] text-neutral-400 font-mono">
                          {new Date(log.createdAt).toLocaleString()}
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
    </div>
  );
}
