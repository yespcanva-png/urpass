import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
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
} from "lucide-react";
import CancelButton from "@/components/billing/CancelButton";
import PlanGrid from "@/components/billing/PlanGrid";
import { getUserPlan } from "@/lib/plan";
import UpgradeCelebration from "@/components/billing/UpgradeCelebration";

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
] as const;

const PLAN_ORDER: Record<string, number> = {
  free: 0, starter: 1, pro: 2, business: 3,
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
    <div className="bg-white border border-neutral-100 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        </div>
        <p className="text-xs font-medium text-neutral-700">{label}</p>
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-bold tracking-tight">{used.toLocaleString("en-IN")}</span>
        <span className="text-sm text-neutral-400">/ {limitLabel ?? limit.toLocaleString("en-IN")}</span>
      </div>
      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.max(pct, 2)}%`,
            background: full ? "#EF4444" : warning ? "#F59E0B" : "#6D28D9",
          }}
        />
      </div>
      {full && (
        <p className="text-xs text-red-500 font-medium">
          Limit reached — upgrade to continue
        </p>
      )}
      {warning && !full && (
        <p className="text-xs text-amber-500 font-medium">
          {Math.round(pct)}% used — approaching limit
        </p>
      )}
      {!warning && !full && note && (
        <p className="text-xs text-neutral-400">{note}</p>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">Invoices</p>
          <p className="text-xs text-neutral-500 mt-1">Official tax invoices &middot; Secured via Razorpay.</p>
        </div>
      </div>

      <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-xs">
        {invoices.length === 0 ? (
          <div className="p-6 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-neutral-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">No invoices yet</p>
              <p className="text-xs text-neutral-500 mt-1">
                Paid invoices will appear here after invoice generation is enabled for payments.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_0.9fr_1.3fr] gap-4 px-5 py-3 bg-neutral-50 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              <span>Invoice & Entity</span>
              <span>Date</span>
              <span>Amount</span>
              <span>Payment & Gateway</span>
              <span className="text-right">Actions</span>
            </div>
            {invoices.map((invoice) => {
              const isRzp = invoice.payment_id?.includes("rzp") || invoice.payment_id?.startsWith("pay_");
              return (
                <div key={invoice.id} className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_0.9fr_1.3fr] gap-3 md:gap-4 px-5 py-4 md:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-neutral-900">{invoice.invoice_number}</p>
                      {isRzp && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          Razorpay
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {invoice.customer_name || invoice.seller_name || "YESP Corporation"} &middot; {formatInvoiceDate(invoice.invoice_date)}
                    </p>
                  </div>
                  <p className="hidden md:block text-sm text-neutral-600">
                    {formatInvoiceDate(invoice.invoice_date)}
                  </p>
                  <p className="text-sm font-semibold text-neutral-900">
                    {formatInvoiceAmount(invoice.total_amount, invoice.currency)}
                  </p>
                  <div>
                    <span className="inline-flex items-center rounded-full border border-green-100 bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700">
                      {formatInvoiceStatus(invoice.payment_status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 md:justify-end">
                    <a
                      href={`/api/invoices/${invoice.id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </a>
                    <a
                      href={`/api/invoices/${invoice.id}/pdf?download=1`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 text-xs font-semibold text-white hover:bg-neutral-700 transition-colors"
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

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: subData }, { data: profile }, { data: invoiceData }, plan] =
    await Promise.all([
      supabase
        .from("subscriptions")
        .select("status, provider, billing_cycle, current_period_start, current_period_end, cancel_at_period_end, registrations_used, trial_used, trial_plan, trial_starts_at, trial_ends_at, is_trial, autopay_mandate_id, autopay_status, plan:plans(slug)")
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
  const isTrial = Boolean(sub?.is_trial && sub?.trial_ends_at && new Date(sub.trial_ends_at) >= new Date());
  const isTrialExpired = Boolean(sub?.is_trial && sub?.trial_ends_at && new Date(sub.trial_ends_at) < new Date());
  const currentPlanSlug = isTrialExpired ? "free" : ((sub?.plan as SubPlan | null)?.slug ?? "free");
  const currentPlanIndex = PLAN_ORDER[currentPlanSlug] ?? 0;
  const trialUsed = sub?.trial_used ?? false;

  const renewalDate = sub?.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString("en-IN", {
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
      <div className="relative overflow-hidden px-5 pt-10 pb-20">
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 75% 60%, #6D28D9 0%, transparent 55%)" }}
        />
        <div className="relative max-w-5xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/80 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>

          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: "linear-gradient(135deg, #6D28D9, #4c1d95)" }}
          >
            <CreditCard className="w-6 h-6 text-white" />
          </div>

          <p className="text-[10px] font-bold tracking-widest uppercase text-brand-200 mb-2">Billing</p>
          <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">
            Plan &amp; subscription
          </h1>
          <p className="text-sm text-white/35 mt-2">Manage your plan and billing details</p>

          {/* Current plan strip */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 bg-white/[0.06] border border-white/[0.08] rounded-2xl px-5 py-4">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 mb-1">Current plan</p>
              <div className="flex items-center gap-2.5 flex-wrap">
                <p className="text-xl font-bold text-white">{currentPlan.name}</p>
                <p className="text-sm text-white/40">
                  {isTrial ? (
                    "30-Day Free Trial (₹0 today)"
                  ) : currentPlan.priceMonthly === 0 ? (
                    "Free forever"
                  ) : billingCycle === "annual" ? (
                    `₹${currentPlan.annualTotal.toLocaleString("en-IN")}/year`
                  ) : (
                    `₹${currentPlan.priceMonthly}/mo`
                  )}
                </p>
                {isTrial ? (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand/30 text-brand-200 border border-brand/50 tracking-wider">
                    FREE TRIAL
                  </span>
                ) : billingCycle === "annual" && currentPlanSlug !== "free" ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand/20 text-brand-200 border border-brand/30 tracking-wide">
                    ANNUAL
                  </span>
                ) : null}
              </div>
              {isTrial ? (
                <p className="text-xs text-white/40 mt-1">
                  {sub?.cancel_at_period_end || sub?.autopay_status === "cancelled"
                    ? `AutoPay cancelled · Free trial ends ${renewalDate} (reverts to Free)`
                    : `First payment of ₹${Math.round(currentPlan.priceMonthly * 1.18).toLocaleString("en-IN")} scheduled for ${renewalDate}`}
                </p>
              ) : currentPlanSlug !== "free" && renewalDate ? (
                <p className="text-xs text-white/30 mt-0.5">
                  {sub?.cancel_at_period_end ? `Cancels ${renewalDate}` : `Renews ${renewalDate}`}
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {sub && !isTrial && (
                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full border tracking-wide uppercase ${
                  sub.status === "active"
                    ? "bg-green-400/10 text-green-300 border-green-400/20"
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

      {/* ── White card ────────────────────────────────────────── */}
      <div className="bg-neutral-50 rounded-t-3xl -mt-8 min-h-[60vh]">
        <div className="max-w-5xl mx-auto px-5 pt-8 pb-12">

          {/* Usage */}
          <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-4">Your usage</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <UsageTile
              icon={CalendarDays}
              iconBg="bg-violet-50 border border-violet-100"
              iconColor="text-violet-600"
              label="Events this month"
              used={eventsThisPeriod ?? 0}
              limit={eventsLimit}
              limitLabel={eventsLimit >= 999_999 ? "∞" : undefined}
              note="Counts events published (not drafts)"
            />
            <UsageTile
              icon={BarChart2}
              iconBg="bg-brand-50 border border-brand-100"
              iconColor="text-brand"
              label="Registrations this month"
              used={registrationsUsed}
              limit={registrationLimit}
              note="Resets at the start of each billing period"
            />
            <UsageTile
              icon={Users}
              iconBg="bg-blue-50 border border-blue-100"
              iconColor="text-blue-600"
              label="Organizer seats"
              used={1}
              limit={organizerLimit}
              note={organizerLimit === 1 ? "Upgrade to add team members" : "Manage team in Settings"}
            />
          </div>

          <InvoiceHistory invoices={invoices} />

          <PlanGrid
            currentPlanSlug={currentPlanSlug}
            currentPlanIndex={currentPlanIndex}
            userEmail={userEmail}
            userName={userName}
            trialUsed={trialUsed}
          />

          {/* Campus / scale CTA */}
          <div className="mt-4 rounded-2xl border border-neutral-200 bg-white overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-neutral-700" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">Campus &amp; Enterprise</p>
                    <p className="text-lg font-bold tracking-tight">Custom pricing</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Running events across a college, company, or multi-team organization? Get institution-wide accounts, dedicated support, and volume pricing.
                </p>
              </div>
              <div className="p-6 flex flex-col justify-center gap-3 md:border-l border-t md:border-t-0 border-neutral-100">
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {["Unlimited organizers", "Institution analytics", "Custom domain", "API & webhooks", "Priority support", "Invoice billing"].map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-neutral-600">
                      <Check className="w-3 h-3 text-brand shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 mt-2 py-2.5 px-5 rounded-xl text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-700 transition-colors w-full md:w-auto"
                >
                  <Mail className="w-4 h-4" />
                  Talk to us
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2.5 mt-10">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
            <p className="text-xs text-neutral-400">
              Payments processed securely via Razorpay · Prices exclude 18% GST
            </p>
          </div>

          {plan.canUse("api_access") && (
            <div className="flex items-center justify-center mt-4">
              <Link href="/dashboard/developer" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-brand transition-colors">
                Developer API →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
