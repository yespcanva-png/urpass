import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { headers, cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { detectCountryFromHeaders } from "@/lib/country-config";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  BarChart2,
  Users,
  Building2,
  Mail,
  Check,
  CalendarDays,
  Download,
  Eye,
  FileText,
  Flame,
  ArrowRight,
  Receipt,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import CancelButton from "@/components/billing/CancelButton";
import PlanGrid from "@/components/billing/PlanGrid";
import { getUserPlan } from "@/lib/plan";
import UpgradeCelebration from "@/components/billing/UpgradeCelebration";
import FounderCheckoutCta from "@/components/billing/FounderCheckoutCta";
import FounderSpotCounter from "@/components/billing/FounderSpotCounter";

export const metadata: Metadata = {
  title: "Billing & Subscriptions | URPASS",
  description: "Manage your URPASS subscription, review resource quotas, and access official GST tax invoices.",
  robots: { index: false, follow: false },
};

// ─── Static V1 plan definitions ───────────────────────────────────────────────
const PLANS = [
  {
    slug: "free",
    name: "Free",
    desc: "For organizers starting out.",
    priceMonthly: 0,
    annualTotal: 0,
    features: [
      "2 events/month",
      "100 registrations/month",
      "1 organizer seat",
      "QR passes & check-in",
      "Attendee approval",
      "Basic analytics",
    ],
  },
  {
    slug: "starter",
    name: "Starter",
    desc: "For independent organizers.",
    priceMonthly: 499,
    annualTotal: 4990,
    features: [
      "10 events/month",
      "500 registrations/month",
      "2 organizer seats",
      "CSV import & export",
      "10 custom fields",
      "Standard analytics",
    ],
  },
  {
    slug: "pro",
    name: "Pro",
    desc: "For growing event teams.",
    priceMonthly: 999,
    annualTotal: 9990,
    features: [
      "Unlimited events",
      "2,500 registrations/month",
      "5 organizer seats",
      "Custom pass design & branding",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    slug: "business",
    name: "Business",
    desc: "For organizations at scale.",
    priceMonthly: 2499,
    annualTotal: 24990,
    features: [
      "Unlimited events",
      "10,000 registrations/month",
      "15 organizer seats",
      "Custom domain, API & webhooks",
      "Advanced permissions",
      "Cross-event analytics",
    ],
  },
  {
    slug: "founder",
    name: "Founder Lifetime",
    desc: "Permanent operational access.",
    priceMonthly: 19999,
    annualTotal: 19999,
    features: [
      "Unlimited events forever",
      "Unlimited registrations forever",
      "50 organizer seats",
      "Custom pass design & branding",
      "Advanced & cross-event analytics",
      "Custom domain, API & webhooks",
      "Priority founder support",
      "Zero renewal fees forever",
    ],
  },
] as const;

const PLAN_ORDER: Record<string, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  business: 3,
  founder: 4,
  lifetime: 4,
};

interface SubPlan {
  slug: string;
}

interface Subscription {
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
  plan: SubPlan;
}

interface Invoice {
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
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs transition-colors hover:border-slate-300">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200/60">
            <Icon className="w-4 h-4 text-slate-700" />
          </div>
          <p className="text-xs font-semibold text-slate-800">{label}</p>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 tabular-nums">
          {limit >= 999_999 ? "Unlimited" : `${Math.round(pct)}%`}
        </span>
      </div>

      <div className="flex items-baseline gap-1.5 mb-2.5">
        <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
          {used.toLocaleString("en-IN")}
        </span>
        <span className="text-xs font-medium text-slate-500">
          / {limitLabel ?? limit.toLocaleString("en-IN")}
        </span>
      </div>

      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.max(pct, limit >= 999_999 ? 100 : 2)}%`,
            backgroundColor: isMax ? "#EF4444" : isHigh ? "#F59E0B" : "#0F172A",
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
        <p className="text-[11px] text-slate-500 mt-1">{note}</p>
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

function InvoiceHistory({ invoices }: { invoices: Invoice[] }) {
  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Invoices &amp; Receipts</p>
          <h2 className="text-base font-bold text-slate-900">Tax Invoice History</h2>
        </div>
        <p className="text-xs text-slate-500">Official GST-compliant tax invoices for business accounts.</p>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
        {invoices.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3 text-slate-400 border border-slate-200/60">
              <Receipt className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-900">No invoices recorded</p>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Your official invoices and Razorpay payment receipts will automatically appear here once payments are processed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Invoice # &amp; Entity</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {invoices.map((invoice) => {
                  const isRzp = invoice.payment_id?.includes("rzp") || invoice.payment_id?.startsWith("pay_");
                  return (
                    <tr key={invoice.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{invoice.invoice_number}</span>
                          {isRzp && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              Razorpay
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {invoice.customer_name || invoice.seller_name || "URPASS Billing"}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {formatInvoiceDate(invoice.invoice_date)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 tabular-nums">
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
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </a>
                          <a
                            href={`/api/invoices/${invoice.id}/pdf?download=1`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-900 text-[11px] font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
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
    </section>
  );
}

const UK_PLAN_PRICES: Record<string, { monthly: number; annual: number }> = {
  free: { monthly: 0, annual: 0 },
  starter: { monthly: 15, annual: 120 },
  pro: { monthly: 35, annual: 300 },
  business: { monthly: 79, annual: 699 },
  founder: { monthly: 249, annual: 249 },
};

export default async function BillingPage(props: {
  searchParams?: Promise<{ country?: string; trial?: string }>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: subData }, { data: profile }, { data: invoiceData }, plan] =
    await Promise.all([
      supabase
        .from("subscriptions")
        .select(
          "status, provider, billing_cycle, current_period_start, current_period_end, cancel_at_period_end, registrations_used, trial_used, trial_plan, trial_starts_at, trial_ends_at, is_trial, autopay_mandate_id, autopay_status, has_lifetime_access, lifetime_plan_slug, plan:plans(slug)"
        )
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("full_name, email")
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("invoices")
        .select(
          "id, invoice_number, invoice_date, total_amount, currency, payment_status, invoice_status, pdf_url, seller_name, seller_gstin, customer_name, payment_id"
        )
        .eq("user_id", user.id)
        .order("invoice_date", { ascending: false })
        .limit(12),
      getUserPlan(supabase, user.id),
    ]);

  const sub = subData as Subscription | null;
  const isUkSubscriber = sub?.provider === "uk_direct";

  const [reqHeaders, cookieStore] = await Promise.all([headers(), cookies()]);
  const cookieCountry = cookieStore.get("urpass_country")?.value?.toUpperCase();
  const headerCountry = detectCountryFromHeaders(reqHeaders);
  const requestedCountry = searchParams?.country?.toUpperCase();

  const country: "IN" | "GB" =
    requestedCountry === "GB" || requestedCountry === "UK"
      ? "GB"
      : requestedCountry === "IN"
      ? "IN"
      : isUkSubscriber
      ? "GB"
      : cookieCountry === "GB" || cookieCountry === "UK"
      ? "GB"
      : cookieCountry === "IN"
      ? "IN"
      : headerCountry === "GB"
      ? "GB"
      : "IN";
  const isUk = country === "GB";

  const isTrial = Boolean(sub?.is_trial && sub?.trial_ends_at && new Date(sub.trial_ends_at) >= new Date());
  const currentPlanSlug = plan.slug;
  const currentPlanIndex = PLAN_ORDER[currentPlanSlug] ?? 0;
  const trialUsed = sub?.trial_used ?? false;

  // Determine if period end indicates a lifetime / permanent allocation (century date e.g. 2125/2126)
  const isPeriodEndCentury = sub?.current_period_end
    ? new Date(sub.current_period_end).getFullYear() > 2050
    : false;

  // Founder / Lifetime accounts never expire, never cancel, and never revert to Free
  const isFounderPlan =
    currentPlanSlug === "founder" ||
    currentPlanSlug === "lifetime" ||
    Boolean(sub?.has_lifetime_access) ||
    isPeriodEndCentury;

  const renewalDate = sub?.current_period_end && !isPeriodEndCentury
    ? new Date(sub.current_period_end).toLocaleDateString(isUk ? "en-GB" : "en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const userName = profile?.full_name ?? user.email?.split("@")[0] ?? "Organizer";
  const userEmail = profile?.email ?? user.email ?? "";
  const currentPlan = PLANS.find((p) => p.slug === currentPlanSlug) ?? PLANS[0];
  const invoices = (invoiceData ?? []) as Invoice[];

  const registrationLimit = plan.getLimit("registrations_per_month");
  const registrationsUsed = sub?.registrations_used ?? 0;
  const organizerLimit = plan.getLimit("organizer_seats");
  const eventsLimit = plan.getLimit("events_per_month");
  const billingCycle = (sub?.billing_cycle ?? "monthly") as "monthly" | "annual";

  // Count events published (status=active) created this billing period
  const periodStart = sub?.current_period_start
    ? new Date(sub.current_period_start)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const { count: eventsThisPeriod } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("organizer_id", user.id)
    .eq("status", "active")
    .gte("created_at", periodStart.toISOString());

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 page-in">
      <Suspense fallback={null}>
        <UpgradeCelebration />
      </Suspense>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* ── Top Navigation & Page Title ────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Billing &amp; Subscriptions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage your plan, track monthly resource quotas, and access official tax invoices.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-xs font-semibold text-slate-800">{currentPlan.name} Plan</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                {isTrial ? "Trial" : isFounderPlan ? "Lifetime" : "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Zoho-style Current Plan Card ──────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Subscription</span>
                {isTrial ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                    30-Day Free Trial
                  </span>
                ) : isFounderPlan ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                    Founder Lifetime License
                  </span>
                ) : billingCycle === "annual" && currentPlanSlug !== "free" ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                    Annual Billing
                  </span>
                ) : null}
              </div>

              <div className="flex items-baseline gap-2.5 flex-wrap">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">{currentPlan.name}</h2>
                <span className="text-sm font-semibold text-slate-700">
                  {isTrial ? (
                    isUk ? "30-Day Free Trial (£0 today)" : "30-Day Free Trial (₹0 today)"
                  ) : isFounderPlan ? (
                    isUk ? "£249 One-Time (Lifetime License)" : "₹19,999 One-Time (Lifetime License)"
                  ) : currentPlan.priceMonthly === 0 ? (
                    "Free forever"
                  ) : billingCycle === "annual" ? (
                    isUk
                      ? `£${UK_PLAN_PRICES[currentPlanSlug]?.annual ?? 300}/year`
                      : `₹${currentPlan.annualTotal.toLocaleString("en-IN")}/year`
                  ) : (
                    isUk
                      ? `£${UK_PLAN_PRICES[currentPlanSlug]?.monthly ?? 35}/month`
                      : `₹${currentPlan.priceMonthly}/month`
                  )}
                </span>
              </div>

              {isFounderPlan ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50/80 border border-emerald-200/70 px-2.5 py-1 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Permanent Founder Lifetime Access · Term 2125 · Zero recurring renewal payments</span>
                </div>
              ) : isTrial ? (
                <p className="text-xs text-slate-500">
                  {isUk ? (
                    sub?.cancel_at_period_end
                      ? `Free trial ends ${renewalDate ?? "in 30 days"} (${sub?.has_lifetime_access ? "reverts to Founder Lifetime" : "reverts to Free"})`
                      : `30-Day Free Trial ends ${renewalDate ?? "in 30 days"} · Direct UK activation · No card required`
                  ) : (
                    sub?.cancel_at_period_end || sub?.autopay_status === "cancelled"
                      ? `AutoPay cancelled · Free trial ends ${renewalDate ?? "in 30 days"} (${sub?.has_lifetime_access ? "reverts to Founder Lifetime" : "reverts to Free"})`
                      : sub?.autopay_status === "active"
                      ? `First renewal payment of ₹${Math.round(currentPlan.priceMonthly * 1.18).toLocaleString("en-IN")} scheduled for ${renewalDate ?? "end of trial"}`
                      : `Free trial ends ${renewalDate ?? "in 30 days"} · No card on file (${sub?.has_lifetime_access ? "reverts to Founder Lifetime" : "reverts to Free"})`
                  )}
                </p>
              ) : currentPlanSlug !== "free" && renewalDate ? (
                <p className="text-xs text-slate-500">
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
              <a
                href="#plan-catalog"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <span>{currentPlanSlug === "free" ? "Upgrade Plan" : "Change Plan"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* ── Resource Consumption Meters ───────────────────────── */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resource Consumption</p>
              <h2 className="text-base font-bold text-slate-900">Monthly Usage Quotas</h2>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Quota resets at the beginning of each billing cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <UsageTile
              icon={CalendarDays}
              label="Events Published"
              used={eventsThisPeriod ?? 0}
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

        {/* ── Invoices & Receipts ───────────────────────────────── */}
        <InvoiceHistory invoices={invoices} />

        {/* ── Founder Lifetime Executive Card ────────────────────── */}
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-7 border border-slate-800 text-white shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-400/10 border border-amber-400/30 text-amber-300">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isFounderPlan
                    ? "FOUNDER STATUS ACTIVE"
                    : "FOUNDER DEAL · LIMITED TO 20 ACCOUNTS ONLY"}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {isFounderPlan
                  ? "You have URPASS Founder Lifetime Access"
                  : isUk
                  ? "URPASS Founder Lifetime Access — £249 One-Time"
                  : "URPASS Founder Lifetime Access — ₹19,999 One-Time"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {isFounderPlan
                  ? "Your account has permanent operational access to all core URPASS event creation, check-in, Ticket Studio, and scanner capabilities with zero recurring renewal fees."
                  : "Permanent access to all currently available URPASS features for a one-time payment. Create your own event landing page on urpass.space and lock in all features for lifetime (Term 2125)."}
              </p>

              {!isFounderPlan && (
                <div className="pt-2 max-w-md">
                  <FounderSpotCounter
                    claimedCount={14}
                    totalCount={20}
                    variant="compact"
                    showFeaturesLock={true}
                  />
                </div>
              )}
            </div>

            <div className="shrink-0 flex items-center gap-3">
              {isFounderPlan ? (
                <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-xs">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Lifetime Active
                </span>
              ) : (
                <>
                  <FounderCheckoutCta
                    isLoggedIn={true}
                    userEmail={userEmail}
                    userName={userName}
                    variant="billing"
                  />
                  <Link
                    href="/founder-lifetime-deal"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors border border-white/10"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Subscription Catalog & Passes ─────────────────────── */}
        <div id="plan-catalog" className="pt-2">
          <PlanGrid
            currentPlanSlug={currentPlanSlug}
            currentPlanIndex={currentPlanIndex}
            userEmail={userEmail}
            userName={userName}
            trialUsed={trialUsed}
            country={country}
          />
        </div>

        {/* ── Campus & Custom Enterprise Inquiries ──────────────── */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-slate-700" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {isUk ? "UK Higher Education & Campus" : "Campus & Enterprise Solutions"}
                  </p>
                  <h3 className="text-base font-bold text-slate-900">
                    Need institution-wide licensing or custom GST invoicing?
                  </h3>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {isUk
                  ? "We support UK universities, multi-society student unions, and sports syndicates with centralized billing, UK GDPR compliance, and dedicated onboarding."
                  : "We provide college campuses, multi-department institutions, and event enterprises with bulk organizer seats, official GST purchase orders, and dedicated SLAs."}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  GST Tax Invoices
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Multi-Committee Seats
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Dedicated Account SLA
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Enterprise Sales</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Corporate Footer Notes ────────────────────────────── */}
        <div className="pt-4 pb-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
            <p>
              {isUk
                ? "Direct UK activation · Prices in GBP exclude 20% VAT · UK GDPR & DPA compliant"
                : "Payments secured via Razorpay · Prices exclude 18% GST · Input tax credit available on registered invoices"}
            </p>
          </div>
          {plan.canUse("api_access") && (
            <Link
              href="/dashboard/developer"
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <span>Developer API</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
