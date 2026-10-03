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
  Globe,
  Target,
  GraduationCap,
  Copy,
  Check,
  ExternalLink,
  Award,
  TrendingUp,
  Receipt,
  FileDown,
  Eye,
  Pencil,
  X,
} from "lucide-react";
import OpsTerminal from "./OpsTerminal";
import OpsEmailEngine from "./OpsEmailEngine";
import type { OpsInvoiceItem, OpsLogItem } from "@/app/api/ops/telemetry/route";

function getInvoiceSeriesBadge(invoiceNumber: string) {
  if (!invoiceNumber) return null;
  const parts = invoiceNumber.split("/");
  if (parts.length >= 2 && parts[0] === "UP") {
    const docType = parts[1];
    switch (docType) {
      case "SUB":
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            SUB
          </span>
        );
      case "TKT":
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            TKT
          </span>
        );
      case "MS":
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            MS
          </span>
        );
      case "CN":
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            CN
          </span>
        );
      case "DN":
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            DN
          </span>
        );
      case "RCP":
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            RCP
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/10 text-white/70 border border-white/20">
            {docType}
          </span>
        );
    }
  }
  return null;
}

const INDIA_STATES = [
  { code: "33", name: "Tamil Nadu" },
  { code: "29", name: "Karnataka" },
  { code: "32", name: "Kerala" },
  { code: "36", name: "Telangana" },
  { code: "37", name: "Andhra Pradesh" },
  { code: "27", name: "Maharashtra" },
  { code: "07", name: "Delhi" },
  { code: "09", name: "Uttar Pradesh" },
  { code: "24", name: "Gujarat" },
  { code: "08", name: "Rajasthan" },
  { code: "19", name: "West Bengal" },
  { code: "06", name: "Haryana" },
  { code: "03", name: "Punjab" },
  { code: "10", name: "Bihar" },
  { code: "21", name: "Odisha" },
  { code: "23", name: "Madhya Pradesh" },
  { code: "22", name: "Chhattisgarh" },
  { code: "20", name: "Jharkhand" },
  { code: "05", name: "Uttarakhand" },
  { code: "02", name: "Himachal Pradesh" },
  { code: "01", name: "Jammu & Kashmir" },
  { code: "30", name: "Goa" },
  { code: "34", name: "Puducherry" },
  { code: "04", name: "Chandigarh" },
  { code: "38", name: "Ladakh" },
  { code: "35", name: "Andaman & Nicobar Islands" },
  { code: "11", name: "Sikkim" },
  { code: "12", name: "Arunachal Pradesh" },
  { code: "13", name: "Nagaland" },
  { code: "14", name: "Manipur" },
  { code: "15", name: "Mizoram" },
  { code: "16", name: "Tripura" },
  { code: "17", name: "Meghalaya" },
  { code: "18", name: "Assam" },
  { code: "26", name: "Dadra & Nagar Haveli and Daman & Diu" },
  { code: "31", name: "Lakshadweep" },
  { code: "97", name: "Other Territory" },
];

export interface SponsorshipItem {
  id: string;
  eventName: string;
  collegeName: string;
  studentName: string;
  email: string;
  phone?: string;
  expectedAttendees?: string;
  eventDate?: string;
  websiteOrSocial?: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  voucherCode?: string;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface DailyTargetData {
  target: number;
  todaySignups: number;
  todayEvents: number;
  todayCheckIns: number;
  percentAchieved: number;
  remaining: number;
  paceStatus: "accelerating" | "on_track" | "behind";
}

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
  dailyTarget?: DailyTargetData;
  sponsorships?: {
    pendingCount: number;
    totalCount: number;
    items: SponsorshipItem[];
  };
  invoices?: {
    totalCount: number;
    items: OpsInvoiceItem[];
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
  const [activeTab, setActiveTab] = useState<"terminal" | "roster" | "sponsorships" | "invoices" | "emails">("terminal");
  const [userSearch, setUserSearch] = useState("");
  const [sponsorshipFilter, setSponsorshipFilter] = useState<"pending" | "approved" | "all">("pending");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<"all" | "paid" | "pending">("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [sponsorshipToast, setSponsorshipToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Change PIN modal state
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [pinMessage, setPinMessage] = useState("");
  const [pinError, setPinError] = useState("");

  // Accumulated logs state for continuous streaming without dropping or resetting
  const [accumulatedLogs, setAccumulatedLogs] = useState<OpsLogItem[]>([]);

  // IndexNow Push state
  const [indexNowLoading, setIndexNowLoading] = useState(false);
  const [indexNowStatus, setIndexNowStatus] = useState<string | null>(null);

  // Edit invoice number modal state
  const [editingInvoice, setEditingInvoice] = useState<OpsInvoiceItem | null>(null);
  const [editInvoiceNumber, setEditInvoiceNumber] = useState("");
  const [editCustomerName, setEditCustomerName] = useState("");
  const [editCustomerAddress, setEditCustomerAddress] = useState("");
  const [editCustomerGstin, setEditCustomerGstin] = useState("");
  const [editCustomerStateCode, setEditCustomerStateCode] = useState("33");
  const [editInvoiceLoading, setEditInvoiceLoading] = useState(false);
  const [editInvoiceError, setEditInvoiceError] = useState("");
  const [editInvoiceSuccess, setEditInvoiceSuccess] = useState("");

  async function handleUpdateInvoiceNumber(e: React.FormEvent) {
    e.preventDefault();
    if (!editingInvoice) return;
    setEditInvoiceLoading(true);
    setEditInvoiceError("");
    setEditInvoiceSuccess("");

    try {
      const res = await fetch("/api/ops/invoices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: editingInvoice.id,
          invoiceNumber: editInvoiceNumber.trim(),
          customerName: editCustomerName.trim(),
          customerAddress: editCustomerAddress.trim(),
          customerGstin: editCustomerGstin.trim().toUpperCase(),
          customerStateCode: editCustomerStateCode,
          customerState: INDIA_STATES.find((state) => state.code === editCustomerStateCode)?.name || "",
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to update invoice number");
      }

      setEditInvoiceSuccess(`Invoice updated to ${resData.invoiceNumber}`);
      setTimeout(() => {
        setEditingInvoice(null);
        setEditInvoiceSuccess("");
      }, 1200);

      // Re-fetch telemetry so dashboard immediately displays new number
      await fetchTelemetry(false);
    } catch (err: unknown) {
      setEditInvoiceError(err instanceof Error ? err.message : "Failed to update invoice number");
    } finally {
      setEditInvoiceLoading(false);
    }
  }

  async function handlePushIndexNow() {
    setIndexNowLoading(true);
    setIndexNowStatus(null);
    try {
      const res = await fetch("/api/indexnow", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setIndexNowStatus(`Pushed ${json.submittedCount} URLs!`);
      } else {
        setIndexNowStatus("IndexNow Accepted");
      }
    } catch {
      setIndexNowStatus("Triggered");
    } finally {
      setIndexNowLoading(false);
      setTimeout(() => setIndexNowStatus(null), 5000);
    }
  }

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

  async function handleApproveSponsorship(appId: string) {
    setActionLoadingId(appId);
    try {
      const res = await fetch("/api/ops/sponsorships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", applicationId: appId }),
      });
      const json = await res.json();
      if (json.success) {
        setSponsorshipToast({
          message: `Approved! Free Pro Voucher ${json.application?.voucherCode} issued and emailed to ${json.application?.email}.`,
          type: "success",
        });
        fetchTelemetry(false);
      } else {
        setSponsorshipToast({
          message: json.error || "Failed to approve application",
          type: "error",
        });
      }
    } catch {
      setSponsorshipToast({ message: "Network error approving sponsorship.", type: "error" });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setSponsorshipToast(null), 6000);
    }
  }

  async function handleRejectSponsorship(appId: string) {
    if (!confirm("Are you sure you want to reject this sponsorship application?")) return;
    setActionLoadingId(appId);
    try {
      const res = await fetch("/api/ops/sponsorships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", applicationId: appId }),
      });
      const json = await res.json();
      if (json.success) {
        setSponsorshipToast({
          message: "Application rejected.",
          type: "success",
        });
        fetchTelemetry(false);
      } else {
        setSponsorshipToast({
          message: json.error || "Failed to reject application",
          type: "error",
        });
      }
    } catch {
      setSponsorshipToast({ message: "Network error.", type: "error" });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setSponsorshipToast(null), 4000);
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2500);
  }

  function handleCopyVoucher(code: string) {
    handleCopy(code);
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

  const sponsorshipItems = data?.sponsorships?.items || [];
  const invoiceItems = data?.invoices?.items || [];
  const filteredSponsorships = sponsorshipItems.filter((s) => {
    if (sponsorshipFilter === "all") return true;
    return s.status === sponsorshipFilter;
  });

  const filteredInvoices = invoiceItems.filter((inv) => {
    if (invoiceStatusFilter !== "all" && inv.payment_status !== invoiceStatusFilter) {
      return false;
    }
    if (!invoiceSearch.trim()) return true;
    const q = invoiceSearch.toLowerCase();
    return (
      (inv.invoice_number || "").toLowerCase().includes(q) ||
      (inv.customer_name || "").toLowerCase().includes(q) ||
      (inv.customer_email || "").toLowerCase().includes(q) ||
      (inv.customer_gstin || "").toLowerCase().includes(q) ||
      (inv.place_of_supply || "").toLowerCase().includes(q) ||
      (inv.payment_id || "").toLowerCase().includes(q)
    );
  });

  const paidInvoicesCount = invoiceItems.filter((inv) => inv.payment_status === "paid").length;
  const totalInvoicedInr = invoiceItems
    .filter((inv) => (inv.currency || "INR") === "INR" && inv.payment_status === "paid")
    .reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);
  const totalTaxableInr = invoiceItems
    .filter((inv) => (inv.currency || "INR") === "INR" && inv.payment_status === "paid")
    .reduce((acc, curr) => acc + Number(curr.taxable_amount || 0), 0);
  const totalGstInr = invoiceItems
    .filter((inv) => (inv.currency || "INR") === "INR" && inv.payment_status === "paid")
    .reduce((acc, curr) => acc + Number(curr.cgst_amount || 0) + Number(curr.sgst_amount || 0) + Number(curr.igst_amount || 0), 0);

  function formatMoney(amount: number | string | null | undefined, currency: string | null | undefined) {
    const value = Number(amount || 0);
    const code = currency || "INR";
    if (code === "GBP") {
      return `GBP ${value.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `INR ${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function formatDate(date: string | null | undefined) {
    if (!date) return "Not available";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

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
                Real-Time Telemetry · Logins, Signups, Events, Gates & Sponsorships
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
              onClick={handlePushIndexNow}
              disabled={indexNowLoading}
              title="Push all URLs to IndexNow (Bing, Yandex, Seznam, Copilot)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono transition-all cursor-pointer disabled:opacity-50"
            >
              <Globe className={`w-3.5 h-3.5 ${indexNowLoading ? "animate-spin text-indigo-400" : ""}`} />
              <span className="hidden sm:inline">
                {indexNowLoading ? "Pushing..." : indexNowStatus ? indexNowStatus : "IndexNow"}
              </span>
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
        {/* ── 100 Daily Signups Target Tracker Hero ── */}
        <div className="bg-gradient-to-r from-violet-950/70 via-[#130f28] to-neutral-900/90 border border-violet-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40 text-xs font-black tracking-wider uppercase">
                  <Target className="w-3.5 h-3.5 text-violet-400" />
                  Mission Target: 100 Signups / Day
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    (data?.dailyTarget?.percentAchieved ?? 0) >= 80
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : (data?.dailyTarget?.percentAchieved ?? 0) >= 30
                      ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  {data?.dailyTarget?.paceStatus === "accelerating"
                    ? "Pacing Ahead"
                    : data?.dailyTarget?.paceStatus === "on_track"
                    ? "On Track"
                    : "Acquisition Push"}
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                  {data?.dailyTarget?.todaySignups ?? 0}
                  <span className="text-xl sm:text-2xl text-white/40 font-normal"> / 100</span>
                </span>
                <span className="text-lg font-bold text-violet-400 font-mono">
                  ({data?.dailyTarget?.percentAchieved ?? 0}%)
                </span>
              </div>

              <p className="text-xs text-white/60 max-w-2xl leading-relaxed">
                Daily organizer acquisition pipeline driven by 390+ SEO/GEO hubs, 1-click event importer (/switch-to-urpass), ticket generator, and campus fest partnerships.
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-white/10 mt-3 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-400 transition-all duration-500 shadow-sm"
                  style={{ width: `${Math.max(4, Math.min(100, data?.dailyTarget?.percentAchieved ?? 0))}%` }}
                />
              </div>
            </div>

            {/* 4 Quick Metric Gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0">
              <div className="bg-black/30 border border-white/10 rounded-2xl p-3.5 text-center min-w-[120px]">
                <div className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Remaining</div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono mt-0.5">
                  {data?.dailyTarget?.remaining ?? 100}
                </div>
                <div className="text-[10px] text-white/40 mt-0.5">to hit today's 100</div>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-2xl p-3.5 text-center min-w-[120px]">
                <div className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Events Today</div>
                <div className="text-xl sm:text-2xl font-black text-sky-400 font-mono mt-0.5">
                  {data?.dailyTarget?.todayEvents ?? 0}
                </div>
                <div className="text-[10px] text-white/40 mt-0.5">new events created</div>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-2xl p-3.5 text-center min-w-[120px]">
                <div className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Scans Today</div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-0.5">
                  {data?.dailyTarget?.todayCheckIns ?? 0}
                </div>
                <div className="text-[10px] text-white/40 mt-0.5">attendees scanned</div>
              </div>

              <div
                onClick={() => setActiveTab("sponsorships")}
                className="bg-black/30 hover:bg-violet-950/40 border border-violet-500/30 rounded-2xl p-3.5 text-center min-w-[120px] cursor-pointer transition-colors group"
              >
                <div className="text-[10px] uppercase font-bold text-violet-300 tracking-wider flex items-center justify-center gap-1">
                  <GraduationCap className="w-3 h-3 text-violet-400" />
                  Sponsorships
                </div>
                <div className="text-xl sm:text-2xl font-black text-violet-300 font-mono mt-0.5 group-hover:scale-105 transition-transform">
                  {data?.sponsorships?.pendingCount ?? 0}
                </div>
                <div className="text-[10px] text-violet-400/80 mt-0.5 underline">
                  review queue &rarr;
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stat Cards Grid (Health, Active Users, Subscriptions, Gates) ── */}
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

        {/* ── View Switcher: Terminal Logs vs User Health Roster vs Campus Sponsorships ── */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
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

            <button
              onClick={() => setActiveTab("sponsorships")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                activeTab === "sponsorships"
                  ? "bg-violet-500/25 text-violet-200 border border-violet-500/50 shadow-sm"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
              Campus Sponsorships
              {(data?.sponsorships?.pendingCount ?? 0) > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-violet-500 text-white text-[10px] font-bold font-mono">
                  {data?.sponsorships?.pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("emails")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                activeTab === "emails"
                  ? "bg-violet-500/25 text-violet-200 border border-violet-500/50 shadow-sm"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-violet-400" />
              Email Engine
            </button>

            <button
              onClick={() => setActiveTab("invoices")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                activeTab === "invoices"
                  ? "bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-sm"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Receipt className="w-3.5 h-3.5 text-amber-400" />
              Invoices
              {(data?.invoices?.totalCount ?? 0) > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-bold font-mono">
                  {data?.invoices?.totalCount}
                </span>
              )}
            </button>
          </div>

          <div className="text-[11px] font-mono text-white/40 hidden sm:block">
            Last Synced: {data ? new Date(data.timestamp).toLocaleTimeString() : "Syncing..."}
          </div>
        </div>

        {/* ── Toast notification for actions ── */}
        {sponsorshipToast && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
              sponsorshipToast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {sponsorshipToast.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{sponsorshipToast.message}</span>
            </div>
            <button
              onClick={() => setSponsorshipToast(null)}
              className="text-white/40 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

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

        {/* ── Tab 3: Campus Sponsorships Queue ── */}
        {activeTab === "sponsorships" && (
          <div className="bg-[#100c22] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in duration-200">
            {/* Sponsorship Header & Filters */}
            <div className="p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-violet-400" />
                  <h3 className="text-base font-bold text-white">College & Hackathon Sponsorship Queue</h3>
                </div>
                <p className="text-xs text-white/50 mt-1">
                  1-Click approve 100% Free Pro Tier vouchers to onboard campus festival organizing teams.
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSponsorshipFilter("pending")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sponsorshipFilter === "pending"
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-white/5 text-white/60 hover:text-white"
                  }`}
                >
                  Pending ({sponsorshipItems.filter((s) => s.status === "pending").length})
                </button>
                <button
                  onClick={() => setSponsorshipFilter("approved")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sponsorshipFilter === "approved"
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-white/5 text-white/60 hover:text-white"
                  }`}
                >
                  Approved ({sponsorshipItems.filter((s) => s.status === "approved").length})
                </button>
                <button
                  onClick={() => setSponsorshipFilter("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sponsorshipFilter === "all"
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-white/5 text-white/60 hover:text-white"
                  }`}
                >
                  All ({sponsorshipItems.length})
                </button>
              </div>
            </div>

            {/* Application Cards List */}
            <div className="p-5 space-y-4">
              {filteredSponsorships.length === 0 ? (
                <div className="py-12 text-center text-white/40 space-y-3">
                  <GraduationCap className="w-10 h-10 mx-auto text-white/20" />
                  <p className="text-sm">No {sponsorshipFilter} sponsorship applications found.</p>
                  <p className="text-xs text-white/30 max-w-sm mx-auto">
                    College symposium and hackathon organizers can apply for free software sponsorship at{" "}
                    <code className="text-violet-400">/sponsorship</code>.
                  </p>
                </div>
              ) : (
                filteredSponsorships.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-white">{app.eventName}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/40">
                          {app.collegeName}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            app.status === "approved"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : app.status === "pending"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-white/60 font-mono">
                        <div>
                          <span className="text-white/40">Coordinator:</span>{" "}
                          <span className="text-white font-medium">{app.studentName}</span>
                        </div>
                        <div>
                          <span className="text-white/40">Email:</span>{" "}
                          <a href={`mailto:${app.email}`} className="text-violet-400 hover:underline">
                            {app.email}
                          </a>
                        </div>
                        <div>
                          <span className="text-white/40">Attendees:</span>{" "}
                          <span className="text-white">{app.expectedAttendees || "Not specified"}</span>
                        </div>
                      </div>

                      {app.notes && (
                        <p className="text-xs text-white/50 italic bg-black/30 p-2.5 rounded-xl border border-white/5">
                          "{app.notes}"
                        </p>
                      )}

                      {app.voucherCode && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                          <span>Voucher Code: <strong>{app.voucherCode}</strong></span>
                          <button
                            onClick={() => handleCopyVoucher(app.voucherCode!)}
                            title="Copy voucher code"
                            className="p-1 hover:bg-emerald-500/20 rounded cursor-pointer transition-colors"
                          >
                            {copiedCode === app.voucherCode ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {app.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApproveSponsorship(app.id)}
                            disabled={actionLoadingId === app.id}
                            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{actionLoadingId === app.id ? "Approving..." : "1-Click Approve"}</span>
                          </button>
                          <button
                            onClick={() => handleRejectSponsorship(app.id)}
                            disabled={actionLoadingId === app.id}
                            className="px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-xs transition-all disabled:opacity-50 cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {app.status === "approved" && (
                        <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold font-mono">
                          <CheckCircle2 className="w-4 h-4" />
                          Pro Active
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Tab 4: All Tax Invoices ── */}
        {activeTab === "invoices" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#100c22] border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Total Invoiced</span>
                  <Receipt className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {formatMoney(totalInvoicedInr, "INR")}
                </div>
                <span className="text-[11px] text-emerald-400/80 mt-1 font-medium">
                  {paidInvoicesCount} paid transactions
                </span>
              </div>

              <div className="bg-[#100c22] border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Taxable Base</span>
                  <Target className="w-4 h-4 text-violet-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {formatMoney(totalTaxableInr, "INR")}
                </div>
                <span className="text-[11px] text-white/40 mt-1">
                  Excluding 18% GST
                </span>
              </div>

              <div className="bg-[#100c22] border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">GST Collected (18%)</span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-300 font-mono">
                  {formatMoney(totalGstInr, "INR")}
                </div>
                <span className="text-[11px] text-amber-400/70 mt-1">
                  SAC 997331 · TN CGST+SGST / IGST
                </span>
              </div>

              <div className="bg-[#100c22] border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Tax Classification</span>
                  <Award className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-lg font-black text-white font-mono truncate">
                  SAC 997331
                </div>
                <span className="text-[11px] text-white/40 mt-1 truncate">
                  Licensing / Software right to use
                </span>
              </div>
            </div>

            {/* Ledger Container */}
            <div className="bg-[#100c22] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
              {/* Header & Filter Controls */}
              <div className="p-5 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-bold text-white">Tax Invoices Ledger</h3>
                  </div>
                  <p className="text-xs text-white/50 mt-1">
                    GST-compliant financial records. Yesp Corporation (33OPDPS9865F1Z3).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Status Pills */}
                  <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
                    <button
                      onClick={() => setInvoiceStatusFilter("all")}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        invoiceStatusFilter === "all" ? "bg-amber-500 text-neutral-950 font-bold" : "text-white/60 hover:text-white"
                      }`}
                    >
                      All ({invoiceItems.length})
                    </button>
                    <button
                      onClick={() => setInvoiceStatusFilter("paid")}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        invoiceStatusFilter === "paid" ? "bg-emerald-500 text-neutral-950 font-bold" : "text-white/60 hover:text-white"
                      }`}
                    >
                      Paid ({paidInvoicesCount})
                    </button>
                    <button
                      onClick={() => setInvoiceStatusFilter("pending")}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        invoiceStatusFilter === "pending" ? "bg-amber-500 text-neutral-950 font-bold" : "text-white/60 hover:text-white"
                      }`}
                    >
                      Pending ({invoiceItems.length - paidInvoicesCount})
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative min-w-[220px]">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      placeholder="Search invoice, email, GST..."
                      value={invoiceSearch}
                      onChange={(e) => setInvoiceSearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>
              </div>

              {filteredInvoices.length === 0 ? (
                <div className="py-14 text-center text-white/40 space-y-3">
                  <Receipt className="w-10 h-10 mx-auto text-white/20" />
                  <p className="text-sm">No matching invoices found.</p>
                  <p className="text-xs text-white/30">
                    {invoiceSearch ? "Try adjusting your search criteria." : "Invoices will be automatically created upon paid subscriptions."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-white/50 text-[10px] uppercase tracking-wider">
                        <th className="py-3 px-4">Invoice</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Place of Supply</th>
                        <th className="py-3 px-4">Tax Split</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredInvoices.map((invoice) => {
                        const cgst = Number(invoice.cgst_amount || 0);
                        const sgst = Number(invoice.sgst_amount || 0);
                        const igst = Number(invoice.igst_amount || 0);
                        const taxSplit =
                          igst > 0
                            ? `IGST 18% (${formatMoney(igst, invoice.currency)})`
                            : `CGST 9% + SGST 9% (${formatMoney(cgst + sgst, invoice.currency)})`;

                        return (
                          <tr key={invoice.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {getInvoiceSeriesBadge(invoice.invoice_number)}
                                  <span className="font-bold text-white">{invoice.invoice_number}</span>
                                  <button
                                    onClick={() => handleCopy(invoice.invoice_number)}
                                    title="Copy invoice number"
                                    className="text-white/30 hover:text-white transition-colors cursor-pointer"
                                  >
                                    {copiedCode === invoice.invoice_number ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingInvoice(invoice);
                                      setEditInvoiceNumber(invoice.invoice_number);
                                      setEditCustomerName(invoice.customer_name || "");
                                      setEditCustomerAddress(invoice.customer_address || "");
                                      setEditCustomerGstin(invoice.customer_gstin || "");
                                      setEditCustomerStateCode(invoice.state_code || "33");
                                      setEditInvoiceError("");
                                      setEditInvoiceSuccess("");
                                    }}
                                    title="Edit invoice number"
                                    className="text-white/30 hover:text-amber-400 transition-colors p-0.5 cursor-pointer"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                </div>
                                <span className="text-[11px] text-white/40">{formatDate(invoice.invoice_date)}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col gap-1">
                                <span className="font-semibold text-white">{invoice.customer_name || "Valued Customer"}</span>
                                <span className="text-[11px] text-violet-300">{invoice.customer_email}</span>
                                {invoice.customer_gstin && (
                                  <span className="text-[10px] text-white/40">GSTIN {invoice.customer_gstin}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-white/60">
                              <div className="flex flex-col gap-1">
                                <span>{invoice.place_of_supply || "Not provided"}</span>
                                <span className="text-[10px] text-white/35">
                                  State Code: {invoice.state_code || "Not provided"}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-white/70">
                              <div className="flex flex-col gap-0.5">
                                <span>{taxSplit}</span>
                                <span className="text-[10px] text-white/35">SAC 997331</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col gap-1">
                                <span className="font-black text-emerald-300">
                                  {formatMoney(invoice.total_amount, invoice.currency)}
                                </span>
                                <span className="text-[10px] text-white/35">
                                  Taxable {formatMoney(invoice.taxable_amount, invoice.currency)}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`inline-flex w-fit items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                      invoice.payment_status === "paid"
                                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                        : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                                    }`}
                                  >
                                    {invoice.payment_status}
                                  </span>
                                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold font-mono text-white/60">
                                    EFT
                                  </span>
                                </div>
                                {invoice.payment_id && (
                                  <div className="flex items-center gap-1 text-[10px] text-white/35">
                                    <span className="truncate max-w-[130px]">{invoice.payment_id}</span>
                                    <button
                                      onClick={() => handleCopy(invoice.payment_id!)}
                                      title="Copy payment ID"
                                      className="hover:text-white transition-colors"
                                    >
                                      {copiedCode === invoice.payment_id ? (
                                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                                      ) : (
                                        <Copy className="w-2.5 h-2.5" />
                                      )}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingInvoice(invoice);
                                    setEditInvoiceNumber(invoice.invoice_number);
                                    setEditCustomerName(invoice.customer_name || "");
                                    setEditCustomerAddress(invoice.customer_address || "");
                                    setEditCustomerGstin(invoice.customer_gstin || "");
                                    setEditCustomerStateCode(invoice.state_code || "33");
                                    setEditInvoiceError("");
                                    setEditInvoiceSuccess("");
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-white/70 hover:text-amber-200 transition-colors text-[11px] cursor-pointer"
                                  title="Edit invoice number"
                                >
                                  <Pencil className="w-3 h-3 text-amber-400" />
                                  <span>Edit</span>
                                </button>
                                <a
                                  href={`/api/invoices/${invoice.id}/pdf`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors text-[11px]"
                                  title="View invoice PDF"
                                >
                                  <Eye className="w-3 h-3 text-amber-400" />
                                  <span>View</span>
                                </a>
                                <a
                                  href={`/api/invoices/${invoice.id}/pdf?download=1`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 transition-colors text-[11px]"
                                  title="Download invoice PDF"
                                >
                                  <FileDown className="w-3 h-3" />
                                  <span>PDF</span>
                                </a>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tab 5: Communication Engine & Lifecycle Dispatcher ── */}
        {activeTab === "emails" && (
          <div className="animate-in fade-in duration-200">
            <OpsEmailEngine />
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

      {/* ── Edit Invoice Billing Modal ── */}
      {editingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-[#130f24] border border-white/10 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditingInvoice(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Receipt className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Update Invoice Billing</h3>
            </div>

            <p className="text-xs text-white/60 mb-4 leading-relaxed">
              Updating invoice for{" "}
              <span className="text-white font-semibold">
                {editingInvoice.customer_name || editingInvoice.customer_email}
              </span>{" "}
              ({formatMoney(editingInvoice.total_amount, editingInvoice.currency)}).
            </p>

            <form onSubmit={handleUpdateInvoiceNumber} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-white/70 block mb-1.5">
                  Invoice Number (UP/DOC_TYPE/FY/SEQ)
                </label>
                <input
                  type="text"
                  value={editInvoiceNumber}
                  onChange={(e) => setEditInvoiceNumber(e.target.value)}
                  placeholder="UP/SUB/2026-27/000001"
                  required
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-hidden focus:border-amber-400 placeholder-white/30"
                />

                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span className="text-[10px] text-white/40 mr-1">Doc Types:</span>
                  {(["SUB", "TKT", "INV", "MS", "CN", "DN", "RCP"] as const).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        const parts = editInvoiceNumber.split("/");
                        const fy = parts[2] || "2026-27";
                        const seq = parts[3] || "000001";
                        setEditInvoiceNumber(`UP/${code}/${fy}/${seq}`);
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 rounded-2xl bg-black/25 border border-white/10 p-4">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5">
                    Customer / Company Name
                  </label>
                  <input
                    type="text"
                    value={editCustomerName}
                    onChange={(e) => setEditCustomerName(e.target.value)}
                    placeholder="Legal billing name"
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-amber-400 placeholder-white/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5">
                    Billing Address
                  </label>
                  <textarea
                    value={editCustomerAddress}
                    onChange={(e) => setEditCustomerAddress(e.target.value)}
                    placeholder="Registered billing address"
                    rows={3}
                    className="w-full resize-none bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-amber-400 placeholder-white/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1.5">
                      GSTIN
                    </label>
                    <input
                      type="text"
                      value={editCustomerGstin}
                      onChange={(e) => setEditCustomerGstin(e.target.value.toUpperCase())}
                      placeholder="Optional"
                      maxLength={15}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono uppercase focus:outline-hidden focus:border-amber-400 placeholder-white/30"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1.5">
                      Billing State
                    </label>
                    <select
                      value={editCustomerStateCode}
                      onChange={(e) => setEditCustomerStateCode(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-amber-400"
                    >
                      {INDIA_STATES.map((state) => (
                        <option key={state.code} value={state.code} className="bg-[#130f24] text-white">
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="text-[11px] text-white/45">
                  Tamil Nadu invoices print CGST + SGST. Other billing states print IGST only.
                </p>
              </div>

              {editInvoiceError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{editInvoiceError}</span>
                </div>
              )}

              {editInvoiceSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{editInvoiceSuccess}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setEditingInvoice(null)}
                  className="px-3 py-2 rounded-xl text-xs text-white/60 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editInvoiceLoading || !editInvoiceNumber.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                >
                  {editInvoiceLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save to Database</span>
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
