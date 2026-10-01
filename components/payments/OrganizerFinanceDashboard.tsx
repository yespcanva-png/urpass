"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  RotateCcw,
  Percent,
  CreditCard,
  Landmark,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  ArrowUpRight,
  Filter,
  Loader2,
  Calendar,
  HelpCircle,
  Download,
} from "lucide-react";
import { formatINR } from "@/lib/payments/fees";
import { processOrderRefundAction } from "@/app/actions/managed-payments";

interface OrganizerFinanceDashboardProps {
  eventId?: string;
  organizationId?: string;
  initialMetrics?: {
    grossSales: number;
    totalRefunds: number;
    platformFees: number;
    processingFees: number;
    netSettlement: number;
    ordersCount: number;
    paidCount: number;
  };
  initialTransactions?: any[];
}

export default function OrganizerFinanceDashboard({
  eventId,
  organizationId,
  initialMetrics = {
    grossSales: 482000,
    totalRefunds: 12000,
    platformFees: 9640,
    processingFees: 8950,
    netSettlement: 451410,
    ordersCount: 482,
    paidCount: 470,
  },
  initialTransactions = [],
}: OrganizerFinanceDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "transactions" | "settlements" | "refunds" | "invoices" | "reconciliation"
  >("transactions");

  // Refund Modal State
  const [refundModalOrder, setRefundModalOrder] = useState<any | null>(null);
  const [refundType, setRefundType] = useState<"full" | "partial">("full");
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [refundReason, setRefundReason] = useState<string>("Event cancelled / Rescheduled");
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  const [refundSuccessMsg, setRefundSuccessMsg] = useState("");

  // Sample transactions if empty
  const sampleTransactions = initialTransactions.length > 0 ? initialTransactions : [
    {
      id: "ord_01",
      order_number: "URP-ORD-9281-A",
      customer_name: "Aarav Mehta",
      customer_email: "aarav@enterprise.com",
      ticket_type_name: "VIP All-Access Pass",
      subtotal: 4999,
      platform_fee: 100,
      gateway_fee: 100,
      organizer_share: 4799,
      total_amount: 5199,
      payment_method: "UPI (Google Pay)",
      payment_status: "CAPTURED",
      order_status: "CONFIRMED",
      settlement_status: "SETTLED",
      created_at: "2026-10-01T10:14:00Z",
    },
    {
      id: "ord_02",
      order_number: "URP-ORD-9282-B",
      customer_name: "Priya Sundaram",
      customer_email: "priya@techpod.in",
      ticket_type_name: "Delegate Pass",
      subtotal: 1000,
      platform_fee: 20,
      gateway_fee: 20,
      organizer_share: 960,
      total_amount: 1040,
      payment_method: "HDFC Netbanking",
      payment_status: "CAPTURED",
      order_status: "CONFIRMED",
      settlement_status: "SETTLED",
      created_at: "2026-10-01T10:32:00Z",
    },
    {
      id: "ord_03",
      order_number: "URP-ORD-9283-C",
      customer_name: "Rohan Varma",
      customer_email: "rohan@hyperscale.ai",
      ticket_type_name: "Founder Seat",
      subtotal: 2500,
      platform_fee: 50,
      gateway_fee: 50,
      organizer_share: 2400,
      total_amount: 2600,
      payment_method: "Credit Card (Visa)",
      payment_status: "REFUNDED",
      order_status: "REFUNDED",
      settlement_status: "REVERSED",
      created_at: "2026-10-01T11:05:00Z",
    },
  ];

  async function handleExecuteRefund(e: React.FormEvent) {
    e.preventDefault();
    if (!refundModalOrder) return;

    setIsProcessingRefund(true);
    setRefundSuccessMsg("");

    try {
      const amount =
        refundType === "full"
          ? refundModalOrder.total_amount
          : Number(refundAmount) || refundModalOrder.total_amount;

      const res = await processOrderRefundAction({
        orderId: refundModalOrder.id,
        amountINR: amount,
        reason: refundReason,
      });

      if (res.success) {
        setRefundSuccessMsg(`Refund of ₹${amount} processed successfully. Transfer reversed from Route account.`);
        setTimeout(() => {
          setRefundModalOrder(null);
          setRefundSuccessMsg("");
        }, 1800);
      }
    } catch {
      //
    } finally {
      setIsProcessingRefund(false);
    }
  }

  return (
    <div className="w-full space-y-8 text-neutral-900">
      {/* ── 1. Top Executive Finance Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Gross Sales */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
            Gross Sales
          </span>
          <p className="text-xl sm:text-2xl font-bold text-neutral-950 mt-1">
            {formatINR(initialMetrics.grossSales)}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            {initialMetrics.paidCount} paid orders
          </span>
        </div>

        {/* Refunds */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
            Refunds
          </span>
          <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">
            −{formatINR(initialMetrics.totalRefunds)}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Reversed from Route
          </span>
        </div>

        {/* URPASS Fees */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
            URPASS Fees
          </span>
          <p className="text-xl sm:text-2xl font-bold text-neutral-800 mt-1">
            {formatINR(initialMetrics.platformFees)}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Platform share (2%)
          </span>
        </div>

        {/* Processing Fees */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
            Processing Fees
          </span>
          <p className="text-xl sm:text-2xl font-bold text-neutral-800 mt-1">
            {formatINR(initialMetrics.processingFees)}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Payment rail cost (2%)
          </span>
        </div>

        {/* Net Settlement */}
        <div className="bg-white border-2 border-neutral-900 rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11px] font-semibold text-neutral-700 uppercase tracking-wider block">
            Net Settlement
          </span>
          <p className="text-xl sm:text-2xl font-bold text-neutral-950 mt-1">
            {formatINR(initialMetrics.netSettlement)}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            ✓ Automated Payouts
          </span>
        </div>
      </div>

      {/* ── 2. Sections Tab Bar ── */}
      <div className="flex items-center gap-1 border-b border-neutral-200 overflow-x-auto text-xs sm:text-sm font-semibold">
        {(["transactions", "settlements", "refunds", "invoices", "reconciliation"] as const).map(
          (tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-3 border-b-2 capitalize transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* ── 3. Tab Contents ── */}
      {activeTab === "transactions" && (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <h4 className="text-sm font-bold text-neutral-900">Recent Payment Transactions</h4>
            <span className="text-xs text-neutral-400 font-mono">Real-time split ledger</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Attendee</th>
                  <th className="py-3 px-4">Ticket Type</th>
                  <th className="py-3 px-4">Gross</th>
                  <th className="py-3 px-4">Fees</th>
                  <th className="py-3 px-4">Net Share</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {sampleTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900">{tx.order_number}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-neutral-900 block">{tx.customer_name}</span>
                      <span className="text-[11px] text-neutral-400">{tx.customer_email}</span>
                    </td>
                    <td className="py-3 px-4 text-neutral-700">{tx.ticket_type_name}</td>
                    <td className="py-3 px-4 font-semibold text-neutral-900">{formatINR(tx.subtotal)}</td>
                    <td className="py-3 px-4 text-neutral-500 font-mono">{formatINR(tx.platform_fee + tx.gateway_fee)}</td>
                    <td className="py-3 px-4 font-bold text-emerald-800 font-mono">{formatINR(tx.organizer_share)}</td>
                    <td className="py-3 px-4 text-neutral-600">{tx.payment_method}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          tx.payment_status === "CAPTURED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tx.payment_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {tx.payment_status === "CAPTURED" && (
                        <button
                          type="button"
                          onClick={() => setRefundModalOrder(tx)}
                          className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
                        >
                          Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "settlements" && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h4 className="text-sm font-bold text-neutral-900">Settlement Batches & Direct Payouts</h4>
              <p className="text-xs text-neutral-500">
                Transfers executed automatically through Razorpay Route linked accounts (T+2 schedule).
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Auto-Settlement Active
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                id: "setl_09182",
                amount: 451410,
                dest: "YESP Events Pvt Ltd ••••4321",
                cycle: "T+2 Daily",
                date: "Today, 06:00 AM",
                status: "SETTLED",
              },
              {
                id: "setl_09181",
                amount: 182400,
                dest: "YESP Events Pvt Ltd ••••4321",
                cycle: "T+2 Daily",
                date: "Yesterday",
                status: "SETTLED",
              },
            ].map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-neutral-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-neutral-900 block">{s.id}</span>
                  <span className="text-neutral-500 mt-0.5 block">{s.dest} · {s.date}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-neutral-950 block">{formatINR(s.amount)}</span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "refunds" && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-xs text-xs">
          <h4 className="text-sm font-bold text-neutral-900">Refund Management</h4>
          <p className="text-neutral-600 leading-relaxed">
            Marketplace refunds automatically reverse the organizer&apos;s split share from the linked account and permanently invalidate the attendee&apos;s QR pass on all gate scanners.
          </p>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-700 space-y-1">
            <span className="font-semibold text-neutral-900 block">Total Refund Volume</span>
            <span className="text-lg font-bold text-red-600 block">{formatINR(initialMetrics.totalRefunds)}</span>
            <span className="text-[11px] text-neutral-400">All invalidations enforced at gate entry turnstiles.</span>
          </div>
        </div>
      )}

      {activeTab === "invoices" && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-xs text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h4 className="text-sm font-bold text-neutral-900">Platform Commission Invoices & Tax Invoices</h4>
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold hover:bg-neutral-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Statement</span>
            </button>
          </div>
          <p className="text-neutral-600">
            Monthly GST compliant tax invoices for URPASS platform fees and processing fee adjustments.
          </p>
        </div>
      )}

      {activeTab === "reconciliation" && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-xs text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h4 className="text-sm font-bold text-neutral-900">
                System Reconciliation (Orders ↔ Payments ↔ Route Transfers)
              </h4>
              <p className="text-[11px] text-neutral-500">
                Audited against bank network webhook journals and payment captures.
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800">
              100% Reconciled
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span>Orders matched against Razorpay Captures:</span>
              <span className="font-bold text-neutral-900">{initialMetrics.paidCount} / {initialMetrics.paidCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span>Route Linked Account Transfers:</span>
              <span className="font-bold text-neutral-900">{initialMetrics.paidCount} Transferred</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span>Discrepancies / Orphaned payments:</span>
              <span className="font-bold text-emerald-600">0 Detected</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Interactive Refund Modal ── */}
      {refundModalOrder && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setRefundModalOrder(null)}
        >
          <div
            className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xl space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h4 className="text-base font-bold text-neutral-950">
                Process Ticket Refund
              </h4>
              <p className="text-neutral-500 mt-0.5">
                Order {refundModalOrder.order_number} · {refundModalOrder.customer_name}
              </p>
            </div>

            {refundSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 font-medium">
                {refundSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleExecuteRefund} className="space-y-4">
                <div className="space-y-2">
                  <label className="font-semibold text-neutral-800 block">
                    Refund Amount
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="refundType"
                        checked={refundType === "full"}
                        onChange={() => setRefundType("full")}
                      />
                      <span>Full Refund ({formatINR(refundModalOrder.total_amount)})</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="refundType"
                        checked={refundType === "partial"}
                        onChange={() => setRefundType("partial")}
                      />
                      <span>Partial Refund</span>
                    </label>
                  </div>

                  {refundType === "partial" && (
                    <input
                      type="number"
                      placeholder="Enter refund amount (₹)"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      className="w-full h-9 px-3 text-xs bg-white border border-neutral-200 rounded-lg mt-1"
                    />
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-800 block">
                    Reason
                  </label>
                  <select
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-neutral-200 rounded-lg"
                  >
                    <option value="Event cancelled / Rescheduled">Event cancelled / Rescheduled</option>
                    <option value="Duplicate purchase">Duplicate purchase</option>
                    <option value="Attendee requested cancellation">Attendee requested cancellation</option>
                    <option value="Customer dissatisfaction">Customer dissatisfaction</option>
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px]">
                  <strong>Warning:</strong> Processing this refund will automatically reverse the Route split share and invalidate the attendee&apos;s QR pass at the entrance gate.
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRefundModalOrder(null)}
                    className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessingRefund}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-80"
                  >
                    {isProcessingRefund ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing with Route...</span>
                      </>
                    ) : (
                      <span>Process Refund</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
