import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { headers, cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { detectCountryFromHeaders } from "@/lib/country-config";
import { getUserPlan } from "@/lib/plan";
import UpgradeCelebration from "@/components/billing/UpgradeCelebration";
import BillingClientShell, { type InvoiceItem } from "@/components/billing/BillingClientShell";

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
  {
    slug: "managed_enterprise",
    name: "Managed Service",
    desc: "Single Event License with Dedicated Managed Support.",
    priceMonthly: 6000,
    annualTotal: 6000,
    features: [
      "Dedicated Managed Support & Event Operations",
      "Custom Branding (UrPass Branding Removed)",
      "Single event with unmetered attendees",
      "Custom pass design & branding",
      "Live gate telemetry & attendance analytics",
      "Priority check-in & scanner sync",
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
  managed_enterprise: 5,
  managed_service: 5,
  managed: 5,
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
  free_event_trial_active?: boolean;
  free_event_trial_consumed?: boolean;
  free_event_trial_id?: string | null;
  cancellation_state?: string | null;
  cancellation_error?: string | null;
  cancellation_confirmed_at?: string | null;
  pending_plan_slug?: string | null;
  pending_plan_effective_at?: string | null;
  plan: SubPlan;
}

function BillingShellSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
      <div className="h-10 bg-neutral-200/70 rounded-2xl w-1/3" />
      <div className="h-10 bg-neutral-200/50 rounded-xl w-80" />
      <div className="h-44 bg-white border border-neutral-200/80 rounded-2xl shadow-sm" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="h-28 bg-white border border-neutral-200/80 rounded-2xl shadow-sm" />
        <div className="h-28 bg-white border border-neutral-200/80 rounded-2xl shadow-sm" />
        <div className="h-28 bg-white border border-neutral-200/80 rounded-2xl shadow-sm" />
      </div>
    </div>
  );
}

export default async function BillingPage(props: {
  searchParams?: Promise<{ country?: string; trial?: string; tab?: string; reason?: string; plan?: string }>;
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
          "status, provider, billing_cycle, current_period_start, current_period_end, cancel_at_period_end, registrations_used, trial_used, trial_plan, trial_starts_at, trial_ends_at, is_trial, autopay_mandate_id, autopay_status, has_lifetime_access, lifetime_plan_slug, free_event_trial_active, free_event_trial_consumed, free_event_trial_id, cancellation_state, cancellation_error, cancellation_confirmed_at, pending_plan_slug, pending_plan_effective_at, plan:plans(slug)"
        )
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("full_name, email, phone")
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
      : headerCountry === "IN"
      ? "IN"
      : headerCountry === "GB"
      ? "GB"
      : cookieCountry === "GB" || cookieCountry === "UK"
      ? "GB"
      : "IN";
  const isUk = country === "GB";

  const isTrial = Boolean(sub?.is_trial && sub?.trial_ends_at && new Date(sub.trial_ends_at) >= new Date());
  const currentPlanSlug = plan.slug;
  const currentPlanIndex = PLAN_ORDER[currentPlanSlug] ?? 0;

  // Determine if period end indicates a lifetime / permanent allocation (century date e.g. 2125/2126)
  const isPeriodEndCentury = sub?.current_period_end
    ? new Date(sub.current_period_end).getFullYear() > 2050
    : false;

  const isNivedithaUser = (user.email || "").toLowerCase() === "niveditha@client.urpass.space";

  // Founder / Lifetime accounts never expire, never cancel, and never revert to Free
  const isFounderPlan =
    !isNivedithaUser &&
    (currentPlanSlug === "founder" ||
    currentPlanSlug === "lifetime" ||
    Boolean(sub?.has_lifetime_access) ||
    isPeriodEndCentury);

  const renewalDate = sub?.current_period_end && !isPeriodEndCentury
    ? new Date(sub.current_period_end).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  const userName = profile?.full_name ?? user.email?.split("@")[0] ?? "Organizer";
  const userEmail = profile?.email ?? user.email ?? "";
  const userPhone = profile?.phone ?? user.phone ?? (user.user_metadata?.phone as string) ?? "";
  const currentPlan = isNivedithaUser
    ? {
        name: "Business Plan (with WhatsApp Integration)",
        slug: "business",
        priceMonthly: 2999,
        annualTotal: 35988,
      }
    : PLANS.find(
        (p) =>
          p.slug === currentPlanSlug ||
          (["managed_enterprise", "managed_service", "managed"].includes(currentPlanSlug) &&
            p.slug === "managed_enterprise")
      ) ?? PLANS[0];
  const invoices = (invoiceData ?? []) as InvoiceItem[];

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
    <div className="page-in">
      <Suspense fallback={null}>
        <UpgradeCelebration />
      </Suspense>

      <Suspense fallback={<BillingShellSkeleton />}>
        <BillingClientShell
          currentPlanSlug={currentPlanSlug}
          currentPlanIndex={currentPlanIndex}
          currentPlanName={currentPlan.name}
          priceMonthly={currentPlan.priceMonthly}
          annualTotal={currentPlan.annualTotal}
          isTrial={isTrial}
          isFounderPlan={isFounderPlan}
          renewalDate={renewalDate}
          billingCycle={billingCycle}
          sub={sub}
          invoices={invoices}
          userEmail={userEmail}
          userName={userName}
          userPhone={userPhone}
          country={country}
          eventsThisPeriod={eventsThisPeriod ?? 0}
          eventsLimit={eventsLimit}
          registrationsUsed={registrationsUsed}
          registrationLimit={registrationLimit}
          organizerLimit={organizerLimit}
          planCanUseApi={plan.canUse("api_access")}
          initialTab={searchParams?.tab ?? (searchParams?.plan ? "plans" : "plans")}
          reason={searchParams?.reason}
          autoCheckoutPlan={searchParams?.plan}
        />
      </Suspense>
    </div>
  );
}
