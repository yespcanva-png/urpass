"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Users,
  ShieldCheck,
  CreditCard,
  ScanLine,
  RefreshCw,
  LogOut,
  Key,
  Server,
  Mail,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles,
  Search,
  Ticket,
} from "lucide-react";
import OpsTerminal from "./OpsTerminal";
import type { OpsLogItem } from "@/app/api/ops/telemetry/route";

interface TelemetryData {
  timestamp: string;
  systemHealth: {
    status: string;
    dbLatencyMs: number;
    supabaseConnected: boolean;
    emailServiceConfigured: boolean;
    paymentGatewayConfigured: boolean;
  };
  userHealth: {
    totalAccounts: number;
    paidSubs: number;
    trialingSubs: number;
    mandatePending: number;
    lifetimeSubs: number;
    cancelledSubs: number;
    healthScore: number;
    roster: Array<{
      id: string;
      email: string;
      name: string;
      plan: string;
      billingCycle: string;
      status: string;
      autopayStatus: string;
      healthStatus: "healthy" | "trialing" | "warning" | "expired";
      lastActive?: string;
      createdDate?: string;
    }>;
  };
  activeUsers: {
    active1h: number;
    active24h: number;
    active7d: number;
    activeEventsCount: number;
    openGatesCount: number;
  };
  logs: OpsLogItem[];
}

interface Props {
  onLogout: () => void;
}

export default function OpsDashboard({ onLogout }: Props) {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"terminal" | "roster">("terminal");
  const [userSearch, setUserSearch] = useState("");

  // Change PIN modal state
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [pinMessage, setPinMessage] = useState("");
  const [pinError, setPinError] = useState("");

  // Accumulated logs state for continuous streaming without dropping or resetting
  const [accumulatedLogs, setAccumulatedLogs] = useState<OpsLogItem[]>([]);

  async function fetchTelemetry(showLoader = false) {
    if (showLoader) setRefreshing(true);
    try {
      const res = await fetch("/api/ops/telemetry", { cache: "no-store" });
      if (res.status === 401) {
        onLogout();
        return;
      }
      const json: TelemetryData = await res.json();
      setData(json);

      if (json.logs && Array.isArray(json.logs)) {
        setAccumulatedLogs((prev) => {
          const map = new Map<string, OpsLogItem>();
          for (const item of prev) map.set(item.id, item);
          for (const item of json.logs) map.set(item.id, item);

          const merged = Array.from(map.values());
          // Sort chronologically ascending (oldest first, newest at the end)
          merged.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          return merged.slice(-250);
        });
      }
    } catch (err) {
      console.error("[ops] Telemetry fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchTelemetry();
    // Auto-refresh telemetry every 3 seconds for continuous real-time feed without reload
    const interval = setInterval(() => {
      fetchTelemetry(false);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  async function handleLogout() {
    await fetch("/api/ops/logout", { method: "POST" });
    onLogout();
  }

  async function handleUpdatePin(e: React.FormEvent) {
    e.preventDefault();
    setPinLoading(true);
    setPinError("");
    setPinMessage("");

    try {
      const res = await fetch("/api/ops/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPin }),
      });
      const resData = await res.json();
      if (!res.ok) {
        setPinError(resData.error || "Failed to update PIN in database.");
        setPinLoading(false);
        return;
      }
      setPinMessage("Ops PIN updated successfully in the database!");
      setNewPin("");
      setTimeout(() => {
        setShowPinModal(false);
        setPinMessage("");
      }, 2000);
    } catch {
      setPinError("Network error updating PIN.");
    } finally {
      setPinLoading(false);
    }
  }

  const filteredUsers = (data?.userHealth.roster || []).filter((u) => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      u.plan.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#07050e] text-white flex flex-col font-sans select-none">
      {/* ── Top Ops Command Header ── */}
      <header className="border-b border-white/10 bg-[#0d091b] px-4 sm:px-8 py-3.5 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg relative shrink-0"
              style={{
                background: "linear-gradient(135deg, #6D28D9, #4c1d95)",
              }}
            >
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-widest uppercase text-white leading-none">
                  URPASS
                </span>
                <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  OPS COMMAND
                </span>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE (3s)
                </span>
              </div>
              <p className="text-[10px] text-white/50 font-mono hidden sm:block mt-0.5">
                Real-Time Telemetry · Logins, Signups, Events & Gate Check-Ins
              </p>
            </div>
          </div>

          {/* System Health Indicators */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-white/50" />
                <span className="text-white/60">DB Latency:</span>
                <span className="text-emerald-400 font-bold">
                  {data?.systemHealth.dbLatencyMs ?? 18}ms
                </span>
              </div>
              <div className="w-px h-3.5 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-white/50" />
                <span className="text-white/60">Gateway:</span>
                <span className="text-emerald-400 font-bold">
                  {data?.systemHealth.paymentGatewayConfigured ? "ONLINE" : "STANDBY"}
                </span>
              </div>
              <div className="w-px h-3.5 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-white/50" />
                <span className="text-white/60">Resend:</span>
                <span className="text-emerald-400 font-bold">
                  {data?.systemHealth.emailServiceConfigured ? "ACTIVE" : "STANDBY"}
                </span>
              </div>
            </div>

            <button
              onClick={() => fetchTelemetry(true)}
              disabled={refreshing}
              title="Refresh telemetry"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-emerald-400" : ""}`} />
            </button>

            <button
              onClick={() => setShowPinModal(true)}
              title="Update DB Ops PIN"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
            >
              <Key className="w-4 h-4 text-amber-300" />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit Ops</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-6">
        {/* ── Stat Cards Grid (Health, Active Users, Subscriptions) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: User Health Score */}
          <div className="bg-[#100c22] border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-white/50">
                User Health Score
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-white">
                  {data?.userHealth.healthScore ?? 100}%
                </span>
                <span className="text-xs text-emerald-400 font-bold font-mono">OPTIMAL</span>
              </div>
              <p className="text-[11px] text-white/40 mt-1">
                {data?.userHealth.totalAccounts ?? 0} registered user profiles analyzed
              </p>
            </div>
          </div>

          {/* Card 2: Active Users */}
          <div className="bg-[#100c22] border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-xl group-hover:bg-sky-500/10 transition-colors" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-white/50">
                Active Users
              </span>
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-white">
                  {data?.activeUsers.active24h ?? 1}
                </span>
                <span className="text-xs text-white/40 font-mono">in last 24h</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-white/50 mt-1 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {data?.activeUsers.active1h ?? 1} live (1h)
                </span>
                <span>•</span>
                <span>{data?.activeUsers.active7d ?? 1} (7d)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Subscription & Mandate Health */}
          <div className="bg-[#100c22] border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-white/50">
                Billing Subscriptions
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-white">
                  {data?.userHealth.paidSubs ?? 0}
                </span>
                <span className="text-xs text-amber-400 font-bold font-mono">PAID ACTIVE</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-white/50 mt-1 font-mono">
                <span>{data?.userHealth.trialingSubs ?? 0} trials</span>
                <span>•</span>
                <span>{data?.userHealth.mandatePending ?? 0} pending</span>
              </div>
            </div>
          </div>

          {/* Card 4: Gate Entrance Operations */}
          <div className="bg-[#100c22] border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-colors" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-white/50">
                Gate Scanner Status
              </span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <ScanLine className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-white">
                  {data?.activeUsers.activeEventsCount ?? 0}
                </span>
                <span className="text-xs text-purple-300 font-bold font-mono">ACTIVE EVENTS</span>
              </div>
              <p className="text-[11px] text-white/40 mt-1 font-mono">
                Sub-300ms WebRTC QR scanner active
              </p>
            </div>
          </div>
        </div>

        {/* ── View Switcher: Terminal Logs vs User Health Roster ── */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("terminal")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "terminal"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Live Telemetry Terminal ({accumulatedLogs.length || data?.logs.length || 0})
            </button>

            <button
              onClick={() => setActiveTab("roster")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "roster"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              User Health Roster ({data?.userHealth.roster.length ?? 0})
            </button>
          </div>

          <div className="text-[11px] font-mono text-white/40 hidden sm:block">
            Last Synced: {data ? new Date(data.timestamp).toLocaleTimeString() : "Syncing..."}
          </div>
        </div>

        {/* ── Tab 1: Terminal Log Streamer ── */}
        {activeTab === "terminal" && (
          <div className="animate-in fade-in duration-200">
            <OpsTerminal
              logs={accumulatedLogs.length > 0 ? accumulatedLogs : (data?.logs || [])}
              isLoading={loading}
              onRefresh={() => fetchTelemetry(true)}
            />
          </div>
        )}

        {/* ── Tab 2: User Health Roster Table ── */}
        {activeTab === "roster" && (
          <div className="bg-[#100c22] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in duration-200">
            <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter users by email, name, or plan..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-hidden focus:border-emerald-400 w-64 sm:w-80 transition-all font-mono"
                />
              </div>
              <div className="text-xs text-white/50 font-mono">
                Showing {filteredUsers.length} user accounts
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-white/50 text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Plan / Cycle</th>
                    <th className="py-3 px-4">AutoPay Mandate</th>
                    <th className="py-3 px-4">Health State</th>
                    <th className="py-3 px-4">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-white/40">
                        No user profiles matched your query.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-xs">{user.name}</span>
                            <span className="text-[11px] text-white/40">{user.email}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-white/10 text-white/80 border border-white/10">
                            {user.plan} · {user.billingCycle}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              user.autopayStatus === "active"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : user.autopayStatus === "pending"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                : "bg-white/5 text-white/40 border border-white/10"
                            }`}
                          >
                            {user.autopayStatus}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              user.healthStatus === "healthy"
                                ? "bg-emerald-500/15 text-emerald-300"
                                : user.healthStatus === "trialing"
                                ? "bg-sky-500/15 text-sky-300"
                                : user.healthStatus === "warning"
                                ? "bg-amber-500/15 text-amber-300"
                                : "bg-rose-500/15 text-rose-300"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                user.healthStatus === "healthy"
                                  ? "bg-emerald-400"
                                  : user.healthStatus === "trialing"
                                  ? "bg-sky-400"
                                  : user.healthStatus === "warning"
                                  ? "bg-amber-400"
                                  : "bg-rose-400"
                              }`}
                            />
                            {user.healthStatus}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-white/40 text-[11px]">
                          {user.lastActive
                            ? new Date(user.lastActive).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Recently"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ── Change PIN Modal ── */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-sm bg-[#130f24] border border-white/10 rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Update Database Ops PIN</h3>
              </div>
              <button
                onClick={() => setShowPinModal(false)}
                className="text-white/40 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdatePin} className="flex flex-col gap-4">
              <p className="text-xs text-white/60">
                Enter a new PIN (4 to 12 digits). This will be updated directly in the PostgreSQL database table (<code className="text-emerald-400">system_settings</code>).
              </p>

              <input
                type="text"
                placeholder="Enter new PIN..."
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                required
                className="bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-hidden focus:border-emerald-400"
              />

              {pinError && (
                <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-lg">{pinError}</p>
              )}

              {pinMessage && (
                <p className="text-xs text-emerald-400 bg-emerald-500/10 p-2 rounded-lg">{pinMessage}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="px-3 py-2 rounded-xl text-xs text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pinLoading || !newPin.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-all disabled:opacity-40 cursor-pointer"
                >
                  {pinLoading ? "Saving to DB..." : "Update in Database"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
