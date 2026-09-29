"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CreditCard,
  Sparkles,
  Receipt,
  CalendarDays,
  BarChart2,
  Users,
  ShieldCheck,
  ArrowRight,
  Building2,
  Mail,
  Eye,
  Download,
  Check,
  ExternalLink,
} from "lucide-react";
import CancelButton from "./CancelButton";
import PlanGrid from "./PlanGrid";
import { detectCountryClient } from "@/lib/country-config";

const UK_PLAN_PRICES: Record<string, { monthly: number; annual: number }> = {
  free: { monthly: 0, annual: 0 },
  starter: { monthly: 15, annual: 120 },
  pro: { monthly: 35, annual: 300 },
  business: { monthly: 79, annual: 699 },
  founder: { monthly: 249, annual: 249 },
};

export interface InvoiceItem {
  id: string;
  invoice_number: string;
  invoice_date: string;
  total_amount: number | string | null;
  currency: string | null;
  payment_status: string;
  invoice_status: string;
  pdf_url: string | null;
  seller_name?: string | null;
  seller_gstin?: string | null;
  customer_name?: string | null;
  payment_id?: string | null;
}

export interface BillingClientShellProps {
  currentPlanSlug: string;
  currentPlanIndex: number;
  currentPlanName: string;
  priceMonthly: number;
  annualTotal: number;
  isTrial: boolean;
  isFounderPlan: boolean;
  renewalDate: string | null;
  billingCycle: "monthly" | "annual";
  sub: {
    status: string;
    provider: string;
    billing_cycle: string | null;
    current_period_start: string | null;
    current_period_end: string;
    cancel_at_period_end: boolean;
    registrations_used: number | null;
    trial_used?: boolean;
    trial_plan?: string | null;
    trial_starts_at?: string | null;
    trial_ends_at?: string | null;
    is_trial?: boolean;
    autopay_mandate_id?: string | null;
    autopay_status?: string | null;
    has_lifetime_access?: boolean;
    lifetime_plan_slug?: string | null;
  } | null;
  invoices: InvoiceItem[];
  userEmail: string;
  userName: string;
  country: "IN" | "GB";
  eventsThisPeriod: number;
  eventsLimit: number;
  registrationsUsed: number;
  registrationLimit: number;
  organizerLimit: number;
  planCanUseApi: boolean;
  initialTab?: string;
}

function UsageTile({
  icon: Icon,
  label,
  used,
  limit,
  limitLabel,
  note,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  used: number;
  limit: number;
  limitLabel?: string;
  note?: string;
}) {
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  const isHigh = pct >= 80 && pct < 100;
  const isMax = pct >= 100;

  return (
    <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm transition-colors hover:border-neutral-300">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center border border-brand-100/60 text-brand">
            <Icon className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-neutral-800">{label}</p>
        </div>
        <span className="text-[11px] font-semibold text-neutral-400 tabular-nums">
          {limit >= 999_999 ? "Unlimited" : `${Math.round(pct)}%`}
        </span>
      </div>

      <div className="flex items-baseline gap-1.5 mb-2.5">
        <span className="text-2xl font-bold tracking-tight text-neutral-900 tabular-nums">
          {used.toLocaleString("en-IN")}
        </span>
        <span className="text-xs font-medium text-neutral-500">
          / {limitLabel ?? (limit >= 999_999 ? "Unlimited" : limit.toLocaleString("en-IN"))}
        </span>
      </div>

      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.max(pct, limit >= 999_999 ? 100 : 2)}%`,
            backgroundColor: isMax ? "#EF4444" : isHigh ? "#F59E0B" : "#6D28D9",
          }}
        />
      </div>

      {isMax && (
        <p className="text-[11px] font-medium text-rose-600 mt-1">
          Limit reached — upgrade required to continue
        </p>
      )}
      {isHigh && !isMax && (
        <p className="text-[11px] font-medium text-amber-600 mt-1">
          {Math.round(pct)}% utilized — approaching quota
        </p>
      )}
      {!isHigh && !isMax && note && (
        <p className="text-[11px] text-neutral-400 mt-1">{note}</p>
      )}
    </div>
  );
}

function formatInvoiceDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatInvoiceAmount(amount: number | string | null, currency: string | null) {
  const value = typeof amount === "string" ? Number(amount) : amount ?? 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency ?? "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatInvoiceStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function BillingClientShell({
  currentPlanSlug,
  currentPlanIndex,
  currentPlanName,
  priceMonthly,
  annualTotal,
  isTrial,
  isFounderPlan,
  renewalDate,
  billingCycle,
  sub,
  invoices,
  userEmail,
  userName,
  country,
  eventsThisPeriod,
  eventsLimit,
  registrationsUsed,
  registrationLimit,
  organizerLimit,
  planCanUseApi,
  initialTab = "plans",
}: BillingClientShellProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Tab state: "plans" | "overview" | "invoices"
  const [activeTab, setActiveTab] = useState<"plans" | "overview" | "invoices">(() => {
    const urlTab = searchParams.get("tab");
    if (urlTab === "plans" || urlTab === "invoices" || urlTab === "overview") {
      return urlTab;
    }
    return (initialTab as "plans" | "overview" | "invoices") || "plans";
  });

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#plan-catalog" || hash === "#plans") {
      setActiveTab("plans");
    } else if (hash === "#overview") {
      setActiveTab("overview");
    }
  }, []);

  function handleTabChange(tab: "plans" | "overview" | "invoices") {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    router.replace(`/billing?${params.toString()}`, { scroll: false });
  }

  const [resolvedCountry, setResolvedCountry] = useState<"IN" | "GB">(country);

  useEffect(() => {
    try {
      const clientCountry = detectCountryClient();
      if (clientCountry && clientCountry !== resolvedCountry) {
        setResolvedCountry(clientCountry);
      }
    } catch {}
  }, []);

  const isUk = resolvedCountry === "GB";

  // Price formatting
  const formattedPlanPrice = isTrial
    ? isUk
      ? "30-Day Free Trial (£0 today)"
      : "30-Day Free Trial (₹0 today)"
    : isFounderPlan
    ? isUk
      ? "£249 One-Time (Lifetime License)"
      : "₹19,999 One-Time (Lifetime License)"
    : priceMonthly === 0
    ? "Free forever"
    : billingCycle === "annual"
    ? isUk
      ? `£${UK_PLAN_PRICES[currentPlanSlug]?.annual ?? 300}/year`
      : `₹${annualTotal.toLocaleString("en-IN")}/year`
    : isUk
    ? `£${UK_PLAN_PRICES[currentPlanSlug]?.monthly ?? 35}/month`
    : `₹${priceMonthly}/month`;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ── Top Header Bar ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
            <Link href="/dashboard" className="hover:text-neutral-900 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-neutral-600 font-medium">Billing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Billing &amp; Subscriptions
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Manage your plan, track monthly resource quotas, and access official tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-neutral-200/80 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-neutral-800">{currentPlanName} Plan</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-brand-50 text-brand border border-brand-100 uppercase">
              {isTrial ? "Trial" : isFounderPlan ? "Lifetime" : "Active"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ──────────────────────────────────────── */}
      <div className="inline-flex items-center gap-1 bg-neutral-100/90 border border-neutral-200/80 rounded-xl p-1 shadow-xs">
        <button
          type="button"
          onClick={() => handleTabChange("plans")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "plans"
              ? "bg-white text-neutral-900 shadow-xs"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <Sparkles className={`w-4 h-4 ${activeTab === "plans" ? "text-brand" : "text-neutral-400"}`} />
          <span>Plans &amp; Upgrades</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("overview")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "overview"
              ? "bg-white text-neutral-900 shadow-xs"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <CreditCard className={`w-4 h-4 ${activeTab === "overview" ? "text-brand" : "text-neutral-400"}`} />
          <span>Overview &amp; Quotas</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("invoices")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "invoices"
              ? "bg-white text-neutral-900 shadow-xs"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <Receipt className={`w-4 h-4 ${activeTab === "invoices" ? "text-brand" : "text-neutral-400"}`} />
          <span>Tax Invoices</span>
          {invoices.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-brand-50 text-brand border border-brand-100">
              {invoices.length}
            </span>
          )}
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          TAB 1: PLANS & UPGRADES
      ═════════════════════════════════════════════════════════════ */}
      {activeTab === "plans" && (
        <div className="space-y-8 animate-in fade-in-50 duration-150">
          <PlanGrid
            currentPlanSlug={currentPlanSlug}
            currentPlanIndex={currentPlanIndex}
            userEmail={userEmail}
            userName={userName}
            trialUsed={sub?.trial_used ?? false}
            country={resolvedCountry}
          />
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          TAB 2: OVERVIEW & QUOTAS
      ═════════════════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in-50 duration-150">
          {/* Active Subscription Summary Card */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Current Subscription
                  </span>
                  {isTrial ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand border border-brand-100 uppercase">
                      30-Day Free Trial
                    </span>
                  ) : isFounderPlan ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      Founder Lifetime License
                    </span>
                  ) : billingCycle === "annual" && currentPlanSlug !== "free" ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand border border-brand-100 uppercase">
                      Annual Billing
                    </span>
                  ) : null}
                </div>

                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                    {currentPlanName} Plan
                  </h2>
                  <span className="text-sm font-semibold text-neutral-600">
                    {formattedPlanPrice}
                  </span>
                </div>

                {isFounderPlan ? (
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50/80 border border-emerald-200/70 px-2.5 py-1 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Permanent Founder Lifetime Access · Term 2125 · Zero recurring renewal payments</span>
                  </div>
                ) : isTrial ? (
                  <p className="text-xs text-neutral-500">
                    {isUk ? (
                      sub?.cancel_at_period_end
                        ? `Free trial ends ${renewalDate ?? "in 30 days"} (${sub?.has_lifetime_access ? "reverts to Founder Lifetime" : "reverts to Free"})`
                        : `30-Day Free Trial ends ${renewalDate ?? "in 30 days"} · Direct UK activation · No card required`
                    ) : (
                      sub?.cancel_at_period_end || sub?.autopay_status === "cancelled"
                        ? `AutoPay cancelled · Free trial ends ${renewalDate ?? "in 30 days"} (${sub?.has_lifetime_access ? "reverts to Founder Lifetime" : "reverts to Free"})`
                        : sub?.autopay_status === "active"
                        ? `First renewal payment of ₹${Math.round(priceMonthly * 1.18).toLocaleString("en-IN")} scheduled for ${renewalDate ?? "end of trial"}`
                        : `Free trial ends ${renewalDate ?? "in 30 days"} · No card on file (${sub?.has_lifetime_access ? "reverts to Founder Lifetime" : "reverts to Free"})`
                    )}
                  </p>
                ) : currentPlanSlug !== "free" && renewalDate ? (
                  <p className="text-xs text-neutral-500">
                    {sub?.cancel_at_period_end
                      ? `Cancels ${renewalDate} (${sub?.has_lifetime_access ? "reverts to Founder Lifetime" : "reverts to Free"})`
                      : `Renews on ${renewalDate}${sub?.has_lifetime_access ? " · Founder Lifetime protected" : ""}`}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
                {!isFounderPlan && currentPlanSlug !== "free" && sub && !sub.cancel_at_period_end && sub.autopay_status !== "cancelled" && (
                  <CancelButton />
                )}
                <button
                  type="button"
                  onClick={() => handleTabChange("plans")}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs hover:opacity-90 transition-all"
                  style={{ background: "linear-gradient(135deg, #6D28D9, #4c1d95)" }}
                >
                  <span>{currentPlanSlug === "free" ? "Upgrade Plan" : "Change Plan"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Monthly Resource Quotas */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Resource Consumption
                </p>
                <h2 className="text-base font-bold text-neutral-900">Monthly Usage Quotas</h2>
              </div>
              <p className="text-xs text-neutral-500 hidden sm:block">
                Quota resets at the beginning of each billing cycle.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <UsageTile
                icon={CalendarDays}
                label="Events Published"
                used={eventsThisPeriod}
                limit={eventsLimit}
                limitLabel={eventsLimit >= 999_999 ? "∞" : undefined}
                note="Counts published live events (drafts excluded)"
              />
              <UsageTile
                icon={BarChart2}
                label="Registrations Issued"
                used={registrationsUsed}
                limit={registrationLimit}
                limitLabel={registrationLimit >= 999_999 ? "∞" : undefined}
                note="Attendee registrations created this period"
              />
              <UsageTile
                icon={Users}
                label="Organizer Seats"
                used={1}
                limit={organizerLimit}
                note={organizerLimit === 1 ? "1 seat included on current tier" : `${organizerLimit} seats allocated`}
              />
            </div>
          </div>

          {/* Recent Invoices Mini Card */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Billing History
                </p>
                <h3 className="text-sm font-bold text-neutral-900">Tax Invoices &amp; Receipts</h3>
              </div>
              <button
                type="button"
                onClick={() => handleTabChange("invoices")}
                className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 transition-colors"
              >
                <span>View all ({invoices.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {invoices.length === 0 ? (
              <p className="text-xs text-neutral-500 py-2">
                No invoices recorded yet. Invoices and official payment receipts appear automatically after transactions.
              </p>
            ) : (
              <div className="divide-y divide-neutral-100">
                {invoices.slice(0, 3).map((inv) => (
                  <div key={inv.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <Receipt className="w-4 h-4 text-neutral-400 shrink-0" />
                      <div>
                        <p className="font-semibold text-neutral-900">{inv.invoice_number}</p>
                        <p className="text-[11px] text-neutral-400">{formatInvoiceDate(inv.invoice_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-neutral-900 tabular-nums">
                        {formatInvoiceAmount(inv.total_amount, inv.currency)}
                      </span>
                      <a
                        href={`/api/invoices/${inv.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                        title="View PDF"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          TAB 3: TAX INVOICES & RECEIPTS
      ═════════════════════════════════════════════════════════════ */}
      {activeTab === "invoices" && (
        <div className="space-y-6 animate-in fade-in-50 duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Official Billing Records
              </p>
              <h2 className="text-base font-bold text-neutral-900">Tax Invoice History</h2>
            </div>
            <p className="text-xs text-neutral-500">
              Official GST-compliant tax invoices with HSN/SAC codes for corporate accounts.
            </p>
          </div>

          <div className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-sm">
            {invoices.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mb-3 text-neutral-400 border border-neutral-200/60">
                  <Receipt className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-neutral-900">No invoices recorded</p>
                <p className="text-xs text-neutral-500 max-w-sm mt-1">
                  Your official invoices and Razorpay payment receipts will automatically appear here once payments are processed.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      <th className="py-3 px-4">Invoice # &amp; Entity</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs">
                    {invoices.map((invoice) => {
                      const isRzp = invoice.payment_id?.includes("rzp") || invoice.payment_id?.startsWith("pay_");
                      return (
                        <tr key={invoice.id} className="hover:bg-neutral-50/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-neutral-900">{invoice.invoice_number}</span>
                              {isRzp && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-brand-50 text-brand border border-brand-100">
                                  Razorpay
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-400 mt-0.5">
                              {invoice.customer_name || invoice.seller_name || "URPASS Billing"}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 text-neutral-600 font-medium">
                            {formatInvoiceDate(invoice.invoice_date)}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-neutral-900 tabular-nums">
                            {formatInvoiceAmount(invoice.total_amount, invoice.currency)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {formatInvoiceStatus(invoice.payment_status)}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              <a
                                href={`/api/invoices/${invoice.id}/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-neutral-200 text-[11px] font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View</span>
                              </a>
                              <a
                                href={`/api/invoices/${invoice.id}/pdf?download=1`}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-900 text-[11px] font-semibold text-white hover:bg-neutral-800 transition-colors shadow-xs"
                              >
                                <Download className="w-3 h-3" />
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

      {/* ── Corporate Enterprise & Campus Inquiries ─────────────── */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100/60 flex items-center justify-center text-brand">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  {isUk ? "UK Higher Education & Campus" : "Campus & Enterprise Solutions"}
                </p>
                <h3 className="text-base font-bold text-neutral-900">
                  Need institution-wide licensing or custom GST invoicing?
                </h3>
              </div>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed pt-1">
              {isUk
                ? "We support UK universities, multi-society student unions, and sports syndicates with centralized billing, UK GDPR compliance, and dedicated onboarding."
                : "We provide college campuses, multi-department institutions, and event enterprises with bulk organizer seats, official GST purchase orders, and dedicated SLAs."}
            </p>
            <div className="flex items-center gap-4 text-xs text-neutral-500 pt-1 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand" />
                GST Tax Invoices
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand" />
                Multi-Committee Seats
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand" />
                Dedicated Account SLA
              </span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Enterprise Sales</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Corporate Footer Notes ────────────────────────────── */}
      <div className="pt-4 pb-8 border-t border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0" />
          <p>
            {isUk
              ? "Payments secured via Razorpay in GBP (£) · Prices exclude 20% VAT · UK GDPR & DPA compliant"
              : "Payments secured via Razorpay · Prices exclude 18% GST · Input tax credit available on registered invoices"}
          </p>
        </div>
        {planCanUseApi && (
          <Link
            href="/dashboard/developer"
            className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <span>Developer API</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
