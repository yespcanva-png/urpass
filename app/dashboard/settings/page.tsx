import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan";
import { getApiUsage } from "@/app/actions/api-usage";
import { listWebhookEndpoints, getWebhookDeliveries } from "@/app/actions/webhooks";
import SettingsShell, { type SettingsPlan } from "./SettingsShell";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your URPASS account — update your profile, reset your password, and view your plan details.",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: profile },
    plan,
    { data: subData },
    { count: activeEventCount },
    { data: paymentSettings },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
    getUserPlan(supabase, user.id),
    supabase
      .from("subscriptions")
      .select("billing_cycle, current_period_start, current_period_end, cancel_at_period_end, registrations_used, plan:plans(name, price_monthly, slug)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single(),
    supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("organizer_id", user.id)
      .in("status", ["draft", "active"]),
    supabase
      .from("payment_settings")
      .select("razorpay_key_id")
      .eq("user_id", user.id)
      .single(),
  ]);

  const defaultApiUsage = { api_requests: 0, registrations: 0, check_ins: 0, events: 0, year_month: "" };
  const canUseDeveloperTools = plan.canUse("api_access") || plan.canUse("webhooks");
  const [apiUsage, webhookEndpoints, recentDeliveries, { data: apiKeys }] =
    canUseDeveloperTools
      ? await Promise.all([
          getApiUsage(),
          listWebhookEndpoints(),
          getWebhookDeliveries(null, 20),
          supabase
            .from("api_keys")
            .select("id, name, key_prefix, permissions, is_active, last_used_at, expires_at, created_at, environment")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        ])
      : [
          defaultApiUsage,
          [],
          [],
          { data: [] },
        ];

  const fullName = profile?.full_name ?? user?.email?.split("@")[0] ?? "";
  const email    = profile?.email ?? user?.email ?? "";
  const initials = fullName.split(" ").slice(0, 2).map((w: string) => w[0] ?? "").join("").toUpperCase() || "U";

  const planRaw    = Array.isArray(subData?.plan) ? subData.plan[0] : subData?.plan;
  const currentPlan = (planRaw as { name: string; price_monthly: number; slug: string } | null) ?? null;
  const settingsPlan: SettingsPlan = {
    slug: plan.slug,
    maxEvents: plan.maxEvents,
    unlimited: plan.unlimited,
    registrationsPerMonth: plan.getLimit("registrations_per_month"),
    canUseDeveloperTools,
    canUsePayments: plan.canUse("paid_events"),
  };
  const renewalDate = subData?.current_period_end
    ? new Date(subData.current_period_end).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <SettingsShell
      fullName={fullName}
      email={email}
      initials={initials}
      plan={settingsPlan}
      currentPlan={currentPlan}
      renewalDate={renewalDate}
      cancelAtPeriodEnd={subData?.cancel_at_period_end ?? false}
      activeEventCount={activeEventCount ?? 0}
      billingCycle={(subData?.billing_cycle ?? "monthly") as "monthly" | "annual"}
      registrationsUsed={subData?.registrations_used ?? 0}
      existingPaymentKeyId={paymentSettings?.razorpay_key_id ?? null}
      apiUsage={apiUsage}
      apiKeys={(apiKeys ?? []) as Parameters<typeof SettingsShell>[0]["apiKeys"]}
      webhookEndpoints={webhookEndpoints}
      recentDeliveries={recentDeliveries}
    />
  );
}
