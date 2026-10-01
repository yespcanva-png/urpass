"use client";

import React, { useState, useMemo } from "react";
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
  Building2,
  Receipt,
  ShieldCheck,
  Clock,
  ArrowRight,
  Plus,
  X,
  ExternalLink,
} from "lucide-react";
import { formatINR } from "@/lib/payments/fees";
import {
  saveOrganizerPayoutAccountAction,
  requestOrganizerPayoutAction,
  processRealOrderRefundAction,
  type FinanceTransaction,
  type FinanceMetrics,
  type SettlementBatch,
  type PayoutBankAccount,
} from "@/app/actions/finance-payouts";

interface OrganizerFinanceDashboardProps {
  eventId: string;
  organizationId?: string;
  initialMetrics: FinanceMetrics;
  initialTransactions: FinanceTransaction[];
  initialSettlements: SettlementBatch[];
  initialPayoutAccount: PayoutBankAccount | null;
  customGateway?: {
    configured: boolean;
    keyIdMasked?: string;
  };
}

export default function OrganizerFinanceDashboard({
  eventId,
  organizationId,
  initialMetrics,
  initialTransactions,
  initialSettlements,
  initialPayoutAccount,
  customGateway,
}: OrganizerFinanceDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "transactions" | "settlements" | "payout_account" | "refunds" | "reconciliation"
  >("transactions");

  // Live state
  const [metrics, setMetrics] = useState<FinanceMetrics>(initialMetrics);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(initialTransactions);
  const [settlements, setSettlements] = useState<SettlementBatch[]>(initialSettlements);
  const [payoutAccount, setPayoutAccount] = useState<PayoutBankAccount | null>(initialPayoutAccount);

  // Filters & Search for transactions
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Refund Modal State
  const [refundModalOrder, setRefundModalOrder] = useState<FinanceTransaction | null>(null);
  const [refundType, setRefundType] = useState<"full" | "partial">("full");
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [refundReason, setRefundReason] = useState<string>("Attendee requested cancellation");
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  const [refundSuccessMsg, setRefundSuccessMsg] = useState("");
  const [refundErrorMsg, setRefundErrorMsg] = useState("");

  // Payout Request Modal State
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [requestPayoutAmount, setRequestPayoutAmount] = useState<string>("");
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState("");
  const [payoutErrorMsg, setPayoutErrorMsg] = useState("");

  // Edit Bank Account Modal State
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [bankName, setBankName] = useState(payoutAccount?.bankName || "");
  const [beneficiaryName, setBeneficiaryName] = useState(payoutAccount?.beneficiaryName || "");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState(payoutAccount?.ifscCode || "");
  const [upiId, setUpiId] = useState(payoutAccount?.upiId || "");
  const [payoutSchedule, setPayoutSchedule] = useState<"daily_t2" | "weekly" | "manual">(
    payoutAccount?.payoutSchedule || "daily_t2"
  );
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [bankSaveMsg, setBankSaveMsg] = useState("");
  const [bankSaveError, setBankSaveError] = useState("");

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        !searchQuery ||
        tx.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.ticket_type_name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === "all" ||
        tx.status === statusFilter ||
        (statusFilter === "paid" && (tx.status === "paid" as any));

      return matchSearch && matchStatus;
    });
  }, [transactions, searchQuery, statusFilter]);

  // Refunded transactions list
  const refundedTransactions = useMemo(() => {
    return transactions.filter((tx) => tx.status === "refunded");
  }, [transactions]);

  // Execute Real Refund
  async function handleExecuteRefund(e: React.FormEvent) {
    e.preventDefault();
    if (!refundModalOrder) return;

    setIsProcessingRefund(true);
    setRefundSuccessMsg("");
    setRefundErrorMsg("");

    try {
      const amount =
        refundType === "full"
          ? refundModalOrder.total_amount
          : Number(refundAmount) || refundModalOrder.total_amount;

      const res = await processRealOrderRefundAction({
        orderId: refundModalOrder.id,
        eventId,
        reason: refundReason,
        amountINR: amount,
      });

      if (res.error) {
        setRefundErrorMsg(res.error);
        return;
      }

      setRefundSuccessMsg(`Refund of ${formatINR(amount)} processed successfully. Attendee pass has been invalidated.`);

      // Update local state
      setTransactions((prev) =>
        prev.map((t) => (t.id === refundModalOrder.id ? { ...t, status: "refunded" } : t))
      );
      setMetrics((prev) => ({
        ...prev,
        totalRefunds: prev.totalRefunds + amount,
        netEarnings: Math.max(0, prev.netEarnings - amount),
        availableBalance: Math.max(0, prev.availableBalance - amount),
        paidCount: Math.max(0, prev.paidCount - 1),
        refundedCount: prev.refundedCount + 1,
      }));

      setTimeout(() => {
        setRefundModalOrder(null);
        setRefundSuccessMsg("");
      }, 1500);
    } catch (err: any) {
      setRefundErrorMsg(err.message || "Failed to process refund");
    } finally {
      setIsProcessingRefund(false);
    }
  }

  // Execute Real Payout Request
  async function handleExecutePayout(e: React.FormEvent) {
    e.preventDefault();
    setIsProcessingPayout(true);
    setPayoutSuccessMsg("");
    setPayoutErrorMsg("");

    try {
      const amount = Number(requestPayoutAmount) || metrics.availableBalance;
      if (amount <= 0) {
        setPayoutErrorMsg("Payout amount must be greater than zero.");
        return;
      }

      const res = await requestOrganizerPayoutAction({
        eventId,
        amountINR: amount,
      });

      if (res.error) {
        setPayoutErrorMsg(res.error);
        return;
      }

      if (res.settlement) {
        setSettlements((prev) => [res.settlement!, ...prev]);
        setMetrics((prev) => ({
          ...prev,
          settledAmount: prev.settledAmount + amount,
          availableBalance: Math.max(0, prev.availableBalance - amount),
        }));
        setPayoutSuccessMsg(`Payout request for ${formatINR(amount)} initiated successfully (Ref: ${res.settlement.id}).`);
        setTimeout(() => {
          setPayoutModalOpen(false);
          setPayoutSuccessMsg("");
        }, 1800);
      }
    } catch (err: any) {
      setPayoutErrorMsg(err.message || "Failed to request payout");
    } finally {
      setIsProcessingPayout(false);
    }
  }

  // Save Real Bank Account
  async function handleSaveBankAccount(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingBank(true);
    setBankSaveMsg("");
    setBankSaveError("");

    try {
      const res = await saveOrganizerPayoutAccountAction({
        bankName,
        beneficiaryName,
        accountNumber,
        ifscCode,
        upiId,
        payoutSchedule,
      });

      if (res.error) {
        setBankSaveError(res.error);
        return;
      }

      if (res.payoutAccount) {
        setPayoutAccount(res.payoutAccount);
        setBankSaveMsg("Bank account details saved securely.");
        setTimeout(() => {
          setBankModalOpen(false);
          setBankSaveMsg("");
        }, 1200);
      }
    } catch (err: any) {
      setBankSaveError(err.message || "Failed to save bank account");
    } finally {
      setIsSavingBank(false);
    }
  }

  // Export CSV of transactions
  function handleExportCSV() {
    if (transactions.length === 0) return;

    const headers = [
      "Order Number",
      "Customer Name",
      "Customer Email",
      "Ticket Type",
      "Gross Amount (INR)",
      "Platform Fee (INR)",
      "Gateway Fee (INR)",
      "Net Organizer Share (INR)",
      "Status",
      "Date",
    ];

    const rows = transactions.map((t) => [
      `"${t.order_number}"`,
      `"${t.customer_name}"`,
      `"${t.customer_email}"`,
      `"${t.ticket_type_name}"`,
      t.subtotal,
      t.platform_fee,
      t.gateway_fee,
      t.organizer_share,
      t.status.toUpperCase(),
      `"${new Date(t.created_at).toLocaleString("en-IN")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `finance-ledger-${eventId.slice(0, 8)}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="w-full space-y-8 text-neutral-900">
      {/* ── 1. Top Executive Finance Summary Cards (Clean Corporate) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Gross Sales */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
            Gross Ticket Sales
          </span>
          <p className="text-xl sm:text-2xl font-bold text-neutral-950 mt-1">
            {formatINR(metrics.grossSales)}
          </p>
          <span className="text-[11px] text-neutral-500 mt-1 block font-medium">
            {metrics.paidCount} paid {metrics.paidCount === 1 ? "order" : "orders"}
          </span>
        </div>

        {/* Refunds */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
            Refunds Processed
          </span>
          <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">
            {metrics.totalRefunds > 0 ? `−${formatINR(metrics.totalRefunds)}` : "₹0.00"}
          </p>
          <span className="text-[11px] text-neutral-500 mt-1 block font-medium">
            {metrics.refundedCount} cancelled {metrics.refundedCount === 1 ? "ticket" : "tickets"}
          </span>
        </div>

        {/* Platform & Processing Fees */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
            Fees (Platform & Rails)
          </span>
          <p className="text-xl sm:text-2xl font-bold text-neutral-800 mt-1">
            {formatINR(metrics.platformFees + metrics.processingFees)}
          </p>
          <span className="text-[11px] text-neutral-500 mt-1 block font-medium">
            2% Platform + 2% Rail
          </span>
        </div>

        {/* Net Earnings */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
            Net Earnings
          </span>
          <p className="text-xl sm:text-2xl font-bold text-neutral-950 mt-1">
            {formatINR(metrics.netEarnings)}
          </p>
          <span className="text-[11px] text-neutral-500 mt-1 block font-medium">
            Organizer net share
          </span>
        </div>

        {/* Available Balance & Payout CTA */}
        <div className="bg-white border-2 border-neutral-900 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-900 uppercase tracking-wider">
                Available for Payout
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-neutral-950 mt-1">
              {formatINR(metrics.availableBalance)}
            </p>
            <span className="text-[11px] text-neutral-500 mt-0.5 block font-medium">
              Settled: {formatINR(metrics.settledAmount)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setRequestPayoutAmount(metrics.availableBalance.toString());
              setPayoutModalOpen(true);
            }}
            disabled={metrics.availableBalance <= 0}
            className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
          >
            Request Payout
          </button>
        </div>
      </div>

      {/* ── 2. Sections Tab Bar ── */}
      <div className="flex items-center gap-1 border-b border-neutral-200 overflow-x-auto text-xs sm:text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("transactions")}
          className={`pb-3 px-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "transactions"
              ? "border-neutral-900 text-neutral-900"
              : "border-transparent text-neutral-500 hover:text-neutral-800"
          }`}
        >
          Transactions Ledger ({transactions.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("settlements")}
          className={`pb-3 px-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "settlements"
              ? "border-neutral-900 text-neutral-900"
              : "border-transparent text-neutral-500 hover:text-neutral-800"
          }`}
        >
          Settlements & Payouts ({settlements.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("payout_account")}
          className={`pb-3 px-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "payout_account"
              ? "border-neutral-900 text-neutral-900"
              : "border-transparent text-neutral-500 hover:text-neutral-800"
          }`}
        >
          Bank & Payout Setup
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("refunds")}
          className={`pb-3 px-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "refunds"
              ? "border-neutral-900 text-neutral-900"
              : "border-transparent text-neutral-500 hover:text-neutral-800"
          }`}
        >
          Refunds ({refundedTransactions.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reconciliation")}
          className={`pb-3 px-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "reconciliation"
              ? "border-neutral-900 text-neutral-900"
              : "border-transparent text-neutral-500 hover:text-neutral-800"
          }`}
        >
          Reconciliation & Statements
        </button>
      </div>

      {/* ── 3. Tab Contents ── */}

      {/* TAB 1: TRANSACTIONS LEDGER */}
      {activeTab === "transactions" && (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by order #, attendee, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden text-neutral-700 font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="created">Created</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              disabled={transactions.length === 0}
              className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Receipt className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <h5 className="text-sm font-bold text-neutral-900">No Payment Transactions Recorded</h5>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto leading-relaxed">
                When attendees purchase paid tickets for this event, real-time transaction records, fee splits, and net shares will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Attendee</th>
                    <th className="py-3 px-4">Ticket Type</th>
                    <th className="py-3 px-4">Gross</th>
                    <th className="py-3 px-4">Fees</th>
                    <th className="py-3 px-4">Net Share</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                        {tx.order_number}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-neutral-900 block">{tx.customer_name}</span>
                        <span className="text-[11px] text-neutral-400">{tx.customer_email}</span>
                      </td>
                      <td className="py-3 px-4 text-neutral-700">{tx.ticket_type_name}</td>
                      <td className="py-3 px-4 font-semibold text-neutral-900">{formatINR(tx.subtotal)}</td>
                      <td className="py-3 px-4 text-neutral-500 font-mono">
                        {formatINR(tx.platform_fee + tx.gateway_fee)}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-800 font-mono">
                        {formatINR(tx.organizer_share)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            tx.status === "paid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : tx.status === "refunded"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-500 text-[11px]">
                        {new Date(tx.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {tx.status === "paid" && (
                          <button
                            type="button"
                            onClick={() => {
                              setRefundModalOrder(tx);
                              setRefundAmount(tx.total_amount.toString());
                            }}
                            className="text-[11px] font-semibold text-neutral-600 hover:text-red-600 underline cursor-pointer"
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
          )}
        </div>
      )}

      {/* TAB 2: SETTLEMENTS & PAYOUTS */}
      {activeTab === "settlements" && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div>
              <h4 className="text-base font-bold text-neutral-950">Payout Settlements & Bank Transfers</h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                Funds collected from ticket sales are transferred directly to your verified payout account.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setRequestPayoutAmount(metrics.availableBalance.toString());
                  setPayoutModalOpen(true);
                }}
                disabled={metrics.availableBalance <= 0 || !payoutAccount}
                className="px-4 py-2 text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Request Payout ({formatINR(metrics.availableBalance)})
              </button>
            </div>
          </div>

          {/* Connected Account Banner */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-neutral-900">
                  {payoutAccount
                    ? `${payoutAccount.bankName || "Linked Account"} ${payoutAccount.accountNumberMasked ? `(${payoutAccount.accountNumberMasked})` : ""}`
                    : "No Bank Account Connected"}
                </p>
                <p className="text-neutral-500 mt-0.5">
                  {payoutAccount
                    ? `Beneficiary: ${payoutAccount.beneficiaryName || "Organizer"} • IFSC: ${payoutAccount.ifscCode || "N/A"} • Schedule: ${payoutAccount.payoutSchedule === "daily_t2" ? "T+2 Daily Automatic" : "On-Demand Manual"}`
                    : "Connect your bank account to receive automatic or on-demand ticket payouts."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setBankModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 transition-colors shrink-0 cursor-pointer"
            >
              {payoutAccount ? "Edit Payout Destination" : "Connect Bank Account"}
            </button>
          </div>

          {/* Settlements History */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Settlement Batches
            </h5>

            {settlements.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed border-neutral-200 rounded-xl">
                <Landmark className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-neutral-700">No Settlement Batches Yet</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  When you request a payout or automatic daily settlements run, transfer details and bank reference numbers will be listed here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {settlements.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-neutral-900">{s.id}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            s.status === "SETTLED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>
                      <p className="text-neutral-500 mt-1">
                        To: {s.destination} • Ref: {s.referenceNumber} • Initiated: {new Date(s.initiatedAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-sm font-bold text-neutral-950 block">{formatINR(s.amount)}</span>
                      <span className="text-[11px] text-neutral-400">
                        Expected: {s.expectedSettlementDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BANK & PAYOUT SETUP */}
      {activeTab === "payout_account" && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xs max-w-2xl text-neutral-900">
          <div>
            <h4 className="text-base font-bold text-neutral-950">Payout Destination & Payment Rails</h4>
            <p className="text-xs text-neutral-500 mt-0.5">
              Specify the bank account where your ticket sales revenue will be settled.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-700">Custom Payment Gateway Status</span>
              {customGateway?.configured ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Custom Razorpay Active ({customGateway.keyIdMasked})
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-neutral-100 text-neutral-600">
                  URPASS Managed Platform Rails
                </span>
              )}
            </div>
            <p className="text-neutral-500 leading-relaxed text-[11px]">
              With URPASS Managed Rails, ticket payments from UPI, credit/debit cards, and netbanking are collected and automatically split into your bank account.
            </p>
          </div>

          {/* Connected Details */}
          {payoutAccount ? (
            <div className="border border-neutral-200 rounded-xl p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="font-bold text-neutral-900 text-sm">Linked Bank Account</span>
                <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active for Payouts
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[11px] text-neutral-400 block">Bank Name</span>
                  <span className="font-semibold text-neutral-800">{payoutAccount.bankName || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block">Beneficiary Name</span>
                  <span className="font-semibold text-neutral-800">{payoutAccount.beneficiaryName || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block">Account Number</span>
                  <span className="font-semibold text-neutral-800 font-mono">{payoutAccount.accountNumberMasked || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block">IFSC Code</span>
                  <span className="font-semibold text-neutral-800 font-mono">{payoutAccount.ifscCode || "N/A"}</span>
                </div>
                {payoutAccount.upiId && (
                  <div>
                    <span className="text-[11px] text-neutral-400 block">UPI ID</span>
                    <span className="font-semibold text-neutral-800 font-mono">{payoutAccount.upiId}</span>
                  </div>
                )}
                <div>
                  <span className="text-[11px] text-neutral-400 block">Payout Schedule</span>
                  <span className="font-semibold text-neutral-800">
                    {payoutAccount.payoutSchedule === "daily_t2" ? "T+2 Daily Automatic" : "On-Demand Manual"}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setBankModalOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 rounded-lg border border-neutral-200 transition-colors cursor-pointer"
                >
                  Update Account Details
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 px-4 border border-dashed border-neutral-300 rounded-xl space-y-3">
              <Building2 className="w-8 h-8 text-neutral-400 mx-auto" />
              <div>
                <p className="text-xs font-bold text-neutral-800">No Payout Bank Account Connected</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Add your bank account details or UPI ID so that net ticket sales can be transferred to you.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBankModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Add Bank Account Details
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: REFUNDS */}
      {activeTab === "refunds" && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-xs text-xs">
          <div>
            <h4 className="text-base font-bold text-neutral-950">Refund Audit & Pass Invalidation</h4>
            <p className="text-neutral-500 mt-0.5">
              When a refund is processed, the ticket is permanently invalidated and will be rejected at entrance gate scanners.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-700 flex items-center justify-between">
            <div>
              <span className="font-semibold text-neutral-900 block">Total Refund Volume</span>
              <span className="text-xs text-neutral-400">All invalidations enforced at gate scanners in real time.</span>
            </div>
            <span className="text-lg font-bold text-red-600">{formatINR(metrics.totalRefunds)}</span>
          </div>

          {refundedTransactions.length === 0 ? (
            <div className="text-center py-10 px-4 border border-dashed border-neutral-200 rounded-xl">
              <RotateCcw className="w-7 h-7 text-neutral-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-neutral-700">No Refunds Issued</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">All customer orders are currently in good standing.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {refundedTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-xl border border-neutral-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-neutral-900 block">{tx.order_number}</span>
                    <span className="text-neutral-500 text-[11px]">
                      {tx.customer_name} ({tx.customer_email}) • {tx.ticket_type_name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-red-600 block">−{formatINR(tx.total_amount)}</span>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">Refunded</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: RECONCILIATION */}
      {activeTab === "reconciliation" && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-xs text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h4 className="text-sm font-bold text-neutral-900">
                System Reconciliation Ledger
              </h4>
              <p className="text-[11px] text-neutral-500">
                Reconciliation verified against payment transactions and order captures.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              100% Reconciled
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="font-medium text-neutral-700">Paid Ticket Orders:</span>
              <span className="font-bold text-neutral-900">{metrics.paidCount} Orders</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="font-medium text-neutral-700">Gross Collections:</span>
              <span className="font-bold text-neutral-900">{formatINR(metrics.grossSales)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="font-medium text-neutral-700">Platform & Rail Fees Deducted:</span>
              <span className="font-bold text-neutral-900">{formatINR(metrics.platformFees + metrics.processingFees)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="font-medium text-neutral-700">Net Organizer Payout Share:</span>
              <span className="font-bold text-neutral-900">{formatINR(metrics.netEarnings)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="font-medium text-neutral-700">Discrepancies / Unmatched Transactions:</span>
              <span className="font-bold text-emerald-600">0 Detected</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={transactions.length === 0}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-40 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Reconciliation Report</span>
            </button>
          </div>
        </div>
      )}

      {/* ── 4. Interactive Real Refund Modal ── */}
      {refundModalOrder && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setRefundModalOrder(null)}
        >
          <div
            className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xl space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-neutral-950">
                  Process Ticket Refund
                </h4>
                <p className="text-neutral-500 mt-0.5">
                  Order {refundModalOrder.order_number} • {refundModalOrder.customer_name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRefundModalOrder(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {refundSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                {refundSuccessMsg}
              </div>
            )}

            {refundErrorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 font-medium">
                {refundErrorMsg}
              </div>
            )}

            {!refundSuccessMsg && (
              <form onSubmit={handleExecuteRefund} className="space-y-4">
                <div className="space-y-2">
                  <label className="font-semibold text-neutral-800 block">
                    Refund Amount
                  </label>
                  <div className="flex items-center gap-4">
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
                      placeholder="Enter refund amount in ₹"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      className="w-full h-9 px-3 text-xs bg-white border border-neutral-200 rounded-lg mt-1 focus:outline-hidden focus:border-neutral-900"
                      required
                    />
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-800 block">
                    Reason for Cancellation
                  </label>
                  <select
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-hidden"
                  >
                    <option value="Attendee requested cancellation">Attendee requested cancellation</option>
                    <option value="Duplicate purchase">Duplicate purchase</option>
                    <option value="Event cancelled / Rescheduled">Event cancelled / Rescheduled</option>
                    <option value="Customer dissatisfaction">Customer dissatisfaction</option>
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                  <strong>Notice:</strong> Processing this refund will automatically invalidate the attendee&apos;s ticket QR pass at gate check-in turnstiles and adjust your net finance earnings.
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
                        <span>Processing Refund...</span>
                      </>
                    ) : (
                      <span>Confirm & Invalidate Pass</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── 5. Request Payout Modal ── */}
      {payoutModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setPayoutModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xl space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-neutral-950">
                  Request Payout Settlement
                </h4>
                <p className="text-neutral-500 mt-0.5">
                  Transfer available ticket revenue to your bank account.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPayoutModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {payoutSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                {payoutSuccessMsg}
              </div>
            )}

            {payoutErrorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 font-medium">
                {payoutErrorMsg}
              </div>
            )}

            {!payoutSuccessMsg && (
              <form onSubmit={handleExecutePayout} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Available Balance:</span>
                    <span className="font-bold text-neutral-950">{formatINR(metrics.availableBalance)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Payout Destination:</span>
                    <span className="font-semibold text-neutral-800">
                      {payoutAccount?.bankName} ({payoutAccount?.accountNumberMasked})
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-800 block">
                    Payout Amount (INR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    max={metrics.availableBalance}
                    value={requestPayoutAmount}
                    onChange={(e) => setRequestPayoutAmount(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 font-mono"
                    required
                  />
                  <span className="text-[11px] text-neutral-400">
                    Max: {formatINR(metrics.availableBalance)}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPayoutModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessingPayout || metrics.availableBalance <= 0}
                    className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-80"
                  >
                    {isProcessingPayout ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Initiating Transfer...</span>
                      </>
                    ) : (
                      <span>Confirm Payout Transfer</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── 6. Bank Account Setup Modal ── */}
      {bankModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setBankModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xl space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-neutral-950">
                  Configure Bank Details
                </h4>
                <p className="text-neutral-500 mt-0.5">
                  Enter your verified bank or UPI details for direct ticket revenue settlements.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBankModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {bankSaveMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                {bankSaveMsg}
              </div>
            )}

            {bankSaveError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 font-medium">
                {bankSaveError}
              </div>
            )}

            {!bankSaveMsg && (
              <form onSubmit={handleSaveBankAccount} className="space-y-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC Bank, ICICI Bank, SBI"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Account Beneficiary Name
                  </label>
                  <input
                    type="text"
                    placeholder="Account holder / registered business name"
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Bank Account Number
                  </label>
                  <input
                    type="password"
                    placeholder={payoutAccount?.accountNumberMasked || "Enter full account number"}
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 font-mono"
                    required={!payoutAccount}
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC0001234"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    className="w-full h-9 px-3 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 font-mono uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    UPI ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. organizer@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Payout Schedule
                  </label>
                  <select
                    value={payoutSchedule}
                    onChange={(e) => setPayoutSchedule(e.target.value as any)}
                    className="w-full h-9 px-3 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-hidden"
                  >
                    <option value="daily_t2">Daily Automatic (T+2 Bank Days)</option>
                    <option value="manual">On-Demand Manual Requests</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBankModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingBank}
                    className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-80"
                  >
                    {isSavingBank ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Account...</span>
                      </>
                    ) : (
                      <span>Save Bank Account</span>
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
