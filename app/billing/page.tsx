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
} from "lucide-react";
import CancelButton from "@/components/billing/CancelButton";
import PlanGrid from "@/components/billing/PlanGrid";
import { getUserPlan } from "@/lib/plan";
import UpgradeCelebration from "@/components/billing/UpgradeCelebration";
import FounderCheckoutCta from "@/components/billing/FounderCheckoutCta";
import FounderSpotCounter from "@/components/billing/FounderSpotCounter";

export const metadata: Metadata = {
  title: "Billing",
  description: "Manage your URPASS subscription, upgrade your plan, and view billing details.",
  robots: { index: false, follow: false },
};

// ─── Static V1 plan definitions ───────────────────────────────────────────────
// Source of truth for display. DB plans table is only used for payment lookups.

const PLANS = [
  {
    slug: "free",
    name: "Free",
    desc: "Try URPASS at no cost.",
    priceMonthly: 0,
    annualTotal: 0,
    features: [
      "2 events/month",
      "100 registrations/month",
      "1 organizer",
      "QR passes & check-in",
      "Attendee approval",
      "Basic analytics",
    ],
  },
  {
    slug: "starter",
    name: "Starter",
    desc: "For individual organizers.",
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
  free: 0, starter: 1, pro: 2, business: 3, founder: 4, lifetime: 4,
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
  iconBg,
  iconColor,
  label,
  used,
  limit,
  limitLabel,
  note,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  label: string;
  used: number;
  limit: number;
  limitLabel?: string;
  note?: string;
}) {
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  const warning = pct >= 80 && pct < 100;
  const full = pct >= 100;

  return (
    <div className="bg-white border border-neutral-200/80 rounded-xl p-4 sm:p-5 shadow-xs transition-colors hover:border-neutral-300">
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <p className="text-xs font-semibold text-neutral-800">{label}</p>
      </div>
      <div className="flex items-baseline gap-1.5 mb-2">
        <span className="text-2xl font-bold tracking-tight text-neutral-900 tabular-nums">{used.toLocaleString("en-IN")}</span>
        <span className="text-xs font-medium text-neutral-500">/ {limitLabel ?? limit.toLocaleString("en-IN")}</span>
      </div>
      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden mb-2.5">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.max(pct, 2)}%`,
            background: full ? "#EF4444" : warning ? "#F59E0B" : "#171717",
          }}
        />
      </div>
      {full && (
        <p className="text-xs text-rose-600 font-medium">
          Limit reached — upgrade to continue
        </p>
      )}
      {warning && !full && (
        <p className="text-xs text-amber-600 font-medium">
          {Math.round(pct)}% used — approaching limit
        </p>
      )}
      {!warning && !full && note && (
        <p className="text-xs text-neutral-500">{note}</p>
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
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">Payment History</p>
          <h2 className="text-base font-semibold text-neutral-900 mt-0.5">Tax Invoices</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Official tax invoices and transaction receipts · Secured via Razorpay.</p>
        </div>
      </div>

      <div className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-xs">
        {invoices.length === 0 ? (
          <div className="p-6 sm:p-8 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200/60 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-neutral-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">No invoices yet</p>
              <p className="text-xs text-neutral-500 mt-1">
                Paid invoices will appear here after invoice generation is enabled for payments.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200/60">
            <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_0.9fr_1.3fr] gap-4 px-5 py-3 bg-neutral-50/80 border-b border-neutral-200/60 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              <span>Invoice &amp; Entity</span>
              <span>Date</span>
              <span>Amount</span>
              <span>Payment &amp; Gateway</span>
              <span className="text-right">Actions</span>
            </div>
            {invoices.map((invoice) => {
              const isRzp = invoice.payment_id?.includes("rzp") || invoice.payment_id?.startsWith("pay_");
              return (
                <div key={invoice.id} className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_0.9fr_1.3fr] gap-3 md:gap-4 px-5 py-3.5 md:items-center hover:bg-neutral-50/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-neutral-900 tabular-nums">{invoice.invoice_number}</p>
                      {isRzp && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
                          Razorpay
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {invoice.customer_name || invoice.seller_name || "YESP Corporation"} · {formatInvoiceDate(invoice.invoice_date)}
                    </p>
                  </div>
                  <p className="hidden md:block text-xs font-medium text-neutral-600">
                    {formatInvoiceDate(invoice.invoice_date)}
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 tabular-nums">
                    {formatInvoiceAmount(invoice.total_amount, invoice.currency)}
                  </p>
                  <div>
                    <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                      {formatInvoiceStatus(invoice.payment_status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 md:justify-end">
                    <a
                      href={`/api/invoices/${invoice.id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </a>
                    <a
                      href={`/api/invoices/${invoice.id}/pdf?download=1`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </a>
                  </div>
                </div>
              );
            })}
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
        .select("status, provider, billing_cycle, current_period_start, current_period_end, cancel_at_period_end, registrations_used, trial_used, trial_plan, trial_starts_at, trial_ends_at, is_trial, autopay_mandate_id, autopay_status, has_lifetime_access, lifetime_plan_slug, plan:plans(slug)")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("full_name, email")
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("invoices")
        .select("id, invoice_number, invoice_date, total_amount, currency, payment_status, invoice_status, pdf_url, seller_name, seller_gstin, customer_name, payment_id")
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
  const isTrialExpired = Boolean(sub?.is_trial && sub?.trial_ends_at && new Date(sub.trial_ends_at) < new Date());
  const currentPlanSlug = plan.slug;
  const currentPlanIndex = PLAN_ORDER[currentPlanSlug] ?? 0;
  const trialUsed = sub?.trial_used ?? false;

  const renewalDate = sub?.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString(isUk ? "en-GB" : "en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const userName = profile?.full_name ?? user.email?.split("@")[0] ?? "";
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
    <div className="min-h-screen bg-neutral-950 page-in">
      <Suspense fallback={null}>
        <UpgradeCelebration />
      </Suspense>

      {/* ── Dark hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden px-5 pt-10 pb-16 border-b border-neutral-900 bg-neutral-950">
        <div className="relative max-w-5xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-200">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">Account Management</p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                Billing &amp; Subscription
              </h1>
            </div>
          </div>
          <p className="text-sm text-neutral-400 max-w-xl">
            Review your active plan, resource utilization, and download verified tax invoices.
          </p>

          {/* Current plan strip */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-xs">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold tracking-wider uppercase text-neutral-400 mb-1">Active Plan</p>
              <div className="flex items-center gap-2.5 flex-wrap">
                <p className="text-xl font-bold text-white tracking-tight">{currentPlan.name}</p>
                <p className="text-sm text-neutral-300">
                  {isTrial ? (
                    isUk ? "30-Day Free Trial (£0 today)" : "30-Day Free Trial (₹0 today)"
                  ) : currentPlanSlug === "founder" || currentPlanSlug === "lifetime" ? (
                    isUk ? "£249 One-Time (Lifetime License)" : "₹19,999 One-Time (Lifetime License)"
                  ) : currentPlan.priceMonthly === 0 ? (
                    "Free forever"
                  ) : billingCycle === "annual" ? (
                    isUk
                      ? `£${UK_PLAN_PRICES[currentPlanSlug]?.annual ?? 300}/year`
                      : `₹${currentPlan.annualTotal.toLocaleString("en-IN")}/year`
                  ) : (
                    isUk
                      ? `£${UK_PLAN_PRICES[currentPlanSlug]?.monthly ?? 35}/mo`
                      : `₹${currentPlan.priceMonthly}/mo`
                  )}
                </p>
                {isTrial ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wider uppercase">
                    Free Trial
                  </span>
                ) : currentPlanSlug === "founder" || currentPlanSlug === "lifetime" ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20 tracking-wider uppercase">
                    Lifetime Access
                  </span>
                ) : sub?.has_lifetime_access ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20 tracking-wider uppercase">
                    Lifetime Protected
                  </span>
                ) : billingCycle === "annual" && currentPlanSlug !== "free" ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700 tracking-wider uppercase">
                    Annual
                  </span>
                ) : null}
              </div>
              {isTrial ? (
                <p className="text-xs text-neutral-400 mt-1">
                  {isUk ? (
                    sub?.cancel_at_period_end
                      ? `Free trial ends ${renewalDate} (${sub?.has_lifetime_access ? "reverts to Founder Lifetime" : "reverts to Free"})`
                      : `30-Day Free Trial ends ${renewalDate} · Direct UK activation · No credit card required`
                  ) : (
                    sub?.cancel_at_period_end || sub?.autopay_status === "cancelled"
                      ? `AutoPay cancelled · Free trial ends ${renewalDate} (${sub?.has_lifetime_access ? "reverts to Founder Lifetime" : "reverts to Free"})`
                      : sub?.autopay_status === "active"
                      ? `First payment of ₹${Math.round(currentPlan.priceMonthly * 1.18).toLocaleString("en-IN")} scheduled for ${renewalDate}`
                      : `Free trial ends ${renewalDate} · No card on file (${sub?.has_lifetime_access ? "reverts to Founder Lifetime" : "reverts to Free"})`
                  )}
                </p>
              ) : currentPlanSlug === "founder" || currentPlanSlug === "lifetime" ? (
                <p className="text-xs text-emerald-400/90 mt-1">
                  Permanent operational license · No renewal payments required
                </p>
              ) : currentPlanSlug !== "free" && renewalDate ? (
                <p className="text-xs text-neutral-400 mt-1">
                  {sub?.cancel_at_period_end
                    ? `Cancels ${renewalDate} (${sub?.has_lifetime_access ? "reverts to Founder Lifetime" : "reverts to Free"})`
                    : `Renews ${renewalDate}${sub?.has_lifetime_access ? " · Founder Lifetime protected on cancel" : ""}`}
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {sub && !isTrial && (
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-md border tracking-wider uppercase ${
                  sub.status === "active"
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                    : "bg-amber-400/10 text-amber-300 border-amber-400/20"
                }`}>
                  {sub.status}
                </span>
              )}
              {currentPlanSlug !== "free" && sub && !sub.cancel_at_period_end && sub.autopay_status !== "cancelled" && (
                <CancelButton />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content area ────────────────────────────────────────── */}
      <div className="bg-neutral-50/70 min-h-[60vh]">
        <div className="max-w-5xl mx-auto px-5 pt-8 pb-16">

          {/* Usage */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">Resource Consumption</p>
              <h2 className="text-base font-semibold text-neutral-900 mt-0.5">Monthly Usage</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <UsageTile
              icon={CalendarDays}
              iconBg="bg-neutral-100 border border-neutral-200/60"
              iconColor="text-neutral-700"
              label="Events this month"
              used={eventsThisPeriod ?? 0}
              limit={eventsLimit}
              limitLabel={eventsLimit >= 999_999 ? "∞" : undefined}
              note="Counts events published (not drafts)"
            />
            <UsageTile
              icon={BarChart2}
              iconBg="bg-neutral-100 border border-neutral-200/60"
              iconColor="text-neutral-700"
              label="Registrations this month"
              used={registrationsUsed}
              limit={registrationLimit}
              note="Resets at the start of each billing period"
            />
            <UsageTile
              icon={Users}
              iconBg="bg-neutral-100 border border-neutral-200/60"
              iconColor="text-neutral-700"
              label="Organizer seats"
              used={1}
              limit={organizerLimit}
              note={organizerLimit === 1 ? "Upgrade to add team members" : "Manage team in Settings"}
            />
          </div>

          <InvoiceHistory invoices={invoices} />

          {/* ── Founder Lifetime Plan Callout Banner ── */}
          <div className="relative overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 p-6 sm:p-7 text-white shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-neutral-800 border border-neutral-700 text-neutral-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {currentPlanSlug === "founder" || currentPlanSlug === "lifetime"
                      ? "FOUNDER STATUS ACTIVE"
                      : "FOUNDER DEAL · LIMITED TO 20 ACCOUNTS ONLY"}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {currentPlanSlug === "founder" || currentPlanSlug === "lifetime"
                    ? "You are a URPASS Founding Organizer"
                    : isUk
                    ? "URPASS Founder Lifetime Access — £249 One-Time"
                    : "URPASS Founder Lifetime Access — ₹19,999 One-Time"}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
                  {currentPlanSlug === "founder" || currentPlanSlug === "lifetime"
                    ? "Your account has permanent operational access to all core URPASS event creation, check-in, Ticket Studio, and scanner capabilities with zero recurring renewal fees."
                    : "Permanent access to all currently available URPASS features for a one-time payment. Create your own event landing page on urpass.space and lock in all features for lifetime (Term 2125)."}
                </p>

                {!(currentPlanSlug === "founder" || currentPlanSlug === "lifetime") && (
                  <div className="pt-2 max-w-lg">
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
                {currentPlanSlug === "founder" || currentPlanSlug === "lifetime" ? (
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold text-xs">
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
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors border border-neutral-700"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <PlanGrid
            currentPlanSlug={currentPlanSlug}
            currentPlanIndex={currentPlanIndex}
            userEmail={userEmail}
            userName={userName}
            trialUsed={trialUsed}
            country={country}
          />

          {/* ── Campus & Enterprise Plans ── */}
          <section className="mt-12 pt-10 border-t border-neutral-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200/60 text-[10px] font-bold tracking-wider uppercase text-neutral-700 mb-1.5">
                  <Building2 className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Institution &amp; Campus Licensing</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-neutral-900">
                  {isUk ? "UK Campus & Multi-Society Plans" : "Campus & Enterprise Plans"}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5 max-w-2xl">
                  {isUk
                    ? "Centralized event platform for university Students' Unions, collegiate societies, and sports clubs across the UK."
                    : "Centralized event platform for universities, colleges with multiple departments and clubs, and enterprise organizations."}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 self-start sm:self-auto shrink-0">
                Annual Institution Tiers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Campus Starter Card */}
              <div className="bg-white border border-neutral-200/80 rounded-xl p-6 flex flex-col justify-between shadow-xs hover:border-neutral-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-[10px] font-bold tracking-wider uppercase text-neutral-500">Tier 1 · Campus</p>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/80 uppercase">
                      Colleges &amp; Unions
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900">Campus Starter</h4>
                  <div className="flex items-baseline gap-1 mt-1 mb-2">
                    <span className="text-2xl font-bold tracking-tight text-neutral-900 tabular-nums">
                      {isUk ? "from £149" : "from ₹9,999"}
                    </span>
                    <span className="text-xs text-neutral-500 font-medium">/year</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-5">
                    {isUk
                      ? "For UK universities, Students' Unions, and student societies running regular campus activities."
                      : "For colleges with multiple departments, cultural clubs, and technical fests running recurring events."}
                  </p>
                  <ul className="flex flex-col gap-2 mb-6">
                    {[
                      isUk ? "Unlimited student societies & clubs" : "Unlimited department & club events",
                      "Multi-committee organizer seats",
                      "Cross-department attendee analytics",
                      "Digital pass branding with college crest/logo",
                      isUk ? "UK GDPR & DPA compliant" : "Direct GST tax invoice billing",
                    ].map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs text-neutral-700">
                        <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/contact?subject=Campus%20Starter%20Plan"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Inquire for Campus Starter</span>
                </Link>
              </div>

              {/* University & Enterprise Scale Card */}
              <div className="bg-white border border-neutral-200/80 rounded-xl p-6 flex flex-col justify-between shadow-xs hover:border-neutral-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-[10px] font-bold tracking-wider uppercase text-neutral-500">Tier 2 · Institution</p>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200/60 uppercase">
                      Enterprise &amp; University Scale
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900">University &amp; Enterprise</h4>
                  <div className="flex items-baseline gap-1 mt-1 mb-2">
                    <span className="text-2xl font-bold tracking-tight text-neutral-900">Custom</span>
                    <span className="text-xs text-neutral-500 font-medium">volume pricing</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-5">
                    For multi-campus institutions, university syndicates, and large enterprise networks requiring dedicated SLAs and bespoke compliance.
                  </p>
                  <ul className="flex flex-col gap-2 mb-6">
                    {[
                      "Unlimited organizers, attendees & concurrent check-in lanes",
                      "Dedicated account manager & SLA guarantee",
                      "Enterprise SSO (SAML, Okta, Google Workspace)",
                      "SCIM user provisioning & audit logs",
                      "Custom domains, webhook dispatch & REST API keys",
                      "Priority hardware scanner onboarding & training",
                    ].map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs text-neutral-700">
                        <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/contact?subject=University%20Enterprise%20Plan"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Talk to Enterprise Sales</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 mt-10">
            <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0" />
            <p className="text-xs text-neutral-500 font-medium">
              {isUk
                ? "Direct UK activation · Prices in GBP exclude 20% VAT"
                : "Payments processed securely via Razorpay · Prices exclude 18% GST"}
            </p>
          </div>

          {plan.canUse("api_access") && (
            <div className="flex items-center justify-center mt-3">
              <Link href="/dashboard/developer" className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Developer API Documentation →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
