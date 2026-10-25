"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  FileText,
  Layers,
  ChevronRight,
  Users,
  Zap,
  Headphones,
} from "lucide-react";
import { SELF_SERVICE_PLANS, REMOTE_MANAGED_PACKAGES } from "@/lib/billing/catalog";
import { formatInr } from "@/lib/billing/tax";
import { updateManagedOrderStatus } from "@/app/actions/ops-billing";

interface Props {
  initialData: {
    subscriptions: any[];
    managedOrders: any[];
    auditLogs: any[];
    metrics: {
      activeSubscribers: number;
      pastDueSubscribers: number;
      managedOrdersCount: number;
      managedRevenueInr: number;
    };
  };
}

export default function OpsBillingDashboard({ initialData }: Props) {
  const [tab, setTab] = useState<"managed_orders" | "subscriptions" | "catalog" | "audit">("managed_orders");
  const [orders, setOrders] = useState(initialData.managedOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) =>
    o.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.event_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.billing_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.billing_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdatingId(orderId);
    try {
      const res = await updateManagedOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              URPASS FINANCIAL & BILLING CONTROL
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Billing & Subscriptions Command
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Authoritative management of Razorpay autopay subscriptions, 50% deposit managed orders, and financial audit logs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/ops"
              className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3.5 py-2 rounded-lg hover:text-white transition-colors"
            >
              &larr; Ops Telemetry
            </Link>
            <Link
              href="/ops/campaigns"
              className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3.5 py-2 rounded-lg hover:text-white transition-colors"
            >
              SEO Campaigns
            </Link>
            <Link
              href="/ops/promotions"
              className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3.5 py-2 rounded-lg hover:text-white transition-colors"
            >
              Explore Ads
            </Link>
            <Link
              href="/pricing"
              target="_blank"
              className="text-xs bg-violet-600 hover:bg-violet-500 text-white font-bold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1"
            >
              Live Pricing Page &rarr;
            </Link>
          </div>
        </div>

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Active Subscribers</span>
              <Users className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {initialData.metrics.activeSubscribers}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">SaaS Recurring Mandates</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Managed Orders</span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {initialData.metrics.managedOrdersCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">One-Time Technical Packages</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Managed Revenue</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">
              {formatInr(initialData.metrics.managedRevenueInr)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Verified Deposit & Balance Payments</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Past Due / Attention</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">
              {initialData.metrics.pastDueSubscribers}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Failing mandates or renewals</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab("managed_orders")}
            className={`pb-3 cursor-pointer transition-colors ${
              tab === "managed_orders"
                ? "text-violet-400 border-b-2 border-violet-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Remote Managed Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("subscriptions")}
            className={`pb-3 cursor-pointer transition-colors ${
              tab === "subscriptions"
                ? "text-violet-400 border-b-2 border-violet-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Subscriptions ({initialData.subscriptions.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("catalog")}
            className={`pb-3 cursor-pointer transition-colors ${
              tab === "catalog"
                ? "text-violet-400 border-b-2 border-violet-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Pricing Catalog Config
          </button>
          <button
            type="button"
            onClick={() => setTab("audit")}
            className={`pb-3 cursor-pointer transition-colors ${
              tab === "audit"
                ? "text-violet-400 border-b-2 border-violet-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Audit Trail ({initialData.auditLogs.length})
          </button>
        </div>

        {/* TAB 1: MANAGED ORDERS */}
        {tab === "managed_orders" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders by number, event, customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>
              <span className="text-xs text-slate-500">
                Showing {filteredOrders.length} order(s)
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Event & Customer</th>
                    <th className="py-3 px-4">Package</th>
                    <th className="py-3 px-4">50% Deposit</th>
                    <th className="py-3 px-4">50% Balance</th>
                    <th className="py-3 px-4">Status & Pipeline</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-500">
                        No managed orders found. Orders placed via checkout or inquiry modal will appear here.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-violet-300">
                          {order.order_number}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{order.event_name}</div>
                          <div className="text-[11px] text-slate-400">
                            {order.billing_name} ({order.billing_email})
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-violet-950/60 border border-violet-800/60 text-violet-300">
                            {order.package_code}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">
                            {formatInr(order.deposit_required_paise / 100)}
                          </div>
                          <span
                            className={`text-[10px] font-bold ${
                              order.deposit_paid_paise > 0 ? "text-emerald-400" : "text-amber-400"
                            }`}
                          >
                            {order.deposit_paid_paise > 0 ? "✓ Paid" : "Pending"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">
                            {formatInr(order.balance_required_paise / 100)}
                          </div>
                          <span
                            className={`text-[10px] font-bold ${
                              order.balance_paid_paise > 0 ? "text-emerald-400" : "text-slate-500"
                            }`}
                          >
                            {order.balance_paid_paise > 0 ? "✓ Paid" : "Due before event"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-violet-500"
                          >
                            <option value="quote_pending">Quote Pending</option>
                            <option value="deposit_pending">Deposit Pending</option>
                            <option value="deposit_paid">Deposit Paid</option>
                            <option value="setup_in_progress">Setup In Progress</option>
                            <option value="client_review">Client Review</option>
                            <option value="balance_pending">Balance Pending</option>
                            <option value="balance_paid">Balance Paid</option>
                            <option value="ready_for_event">Ready for Event</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {new Date(order.created_at).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SUBSCRIPTIONS */}
        {tab === "subscriptions" && (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Autopay Mandate</th>
                  <th className="py-3 px-4">Current Period End</th>
                  <th className="py-3 px-4">Cancel at End</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {initialData.subscriptions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-900/60">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {s.user_id?.slice(0, 8)}...
                    </td>
                    <td className="py-3 px-4 font-bold text-white uppercase">
                      {(s.plans as any)?.name || (s.plans as any)?.slug || "Free"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          s.status === "active"
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60"
                            : "bg-amber-950/60 text-amber-400 border border-amber-800/60"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px]">
                      {s.autopay_status === "active" ? (
                        <span className="text-emerald-400 font-semibold">✓ Active Mandate</span>
                      ) : (
                        <span className="text-slate-500">{s.autopay_status || "none"}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {s.current_period_end
                        ? new Date(s.current_period_end).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-[11px]">
                      {s.cancel_at_period_end ? (
                        <span className="text-red-400">Scheduled to cancel</span>
                      ) : (
                        <span className="text-slate-500">Auto-renews</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: PRICING CATALOG CONFIG */}
        {tab === "catalog" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl">
              <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-violet-400" />
                Self-Service Subscriptions (Configured)
              </h3>
              <div className="space-y-4">
                {SELF_SERVICE_PLANS.map((plan) => (
                  <div key={plan.slug} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white">{plan.name}</span>
                      <span className="font-mono text-emerald-400 font-bold">{formatInr(plan.priceMonthlyInr)}/mo</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{plan.tagline}</p>
                    <div className="text-[11px] text-slate-500 flex gap-4">
                      <span>Events: {plan.limits.activeEvents}</span>
                      <span>Attendees: {plan.limits.attendeesPerEvent}</span>
                      <span>Seats: {plan.limits.teamSeats}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl">
              <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                <Headphones className="w-4 h-4 text-violet-400" />
                Remote Managed Packages (Configured)
              </h3>
              <div className="space-y-4">
                {REMOTE_MANAGED_PACKAGES.map((pkg) => (
                  <div key={pkg.code} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white">{pkg.name}</span>
                      <span className="font-mono text-violet-400 font-bold">
                        {pkg.priceInr === 0 ? "Custom Quote" : `${formatInr(pkg.priceInr)}/event`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{pkg.tagline}</p>
                    <div className="text-[11px] text-slate-500 flex gap-4">
                      <span>Capacity: {pkg.maxAttendees}</span>
                      <span>Trainings: {pkg.includedTrainingSessions}</span>
                      <span>50% Deposit / 50% Balance</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT TRAIL */}
        {tab === "audit" && (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4">Entity ID</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {initialData.auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/60">
                    <td className="py-3 px-4 text-violet-300 font-semibold">{log.action}</td>
                    <td className="py-3 px-4 text-slate-400">{log.entity_type}</td>
                    <td className="py-3 px-4 text-slate-500">{log.entity_id?.slice(0, 16)}</td>
                    <td className="py-3 px-4 text-slate-400">{log.actor_email || "system"}</td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(log.created_at).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
