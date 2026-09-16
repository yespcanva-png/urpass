import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan";
import { getApiUsage } from "@/app/actions/api-usage";
import { listWebhookEndpoints, getWebhookDeliveries } from "@/app/actions/webhooks";
import DeveloperDashboard from "./DeveloperDashboard";

export const metadata: Metadata = {
  title: "Developer API",
  description: "Manage your UrPass API keys, webhooks, and API subscription.",
  robots: { index: false, follow: false },
};

export default async function DeveloperPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const plan = await getUserPlan(supabase, user.id);
  if (!plan.canUse("api_access") && !plan.canUse("webhooks")) redirect("/billing");

  const [apiUsage, webhookEndpoints, recentDeliveries, { data: apiKeys }, { data: profile }] =
    await Promise.all([
      getApiUsage(),
      listWebhookEndpoints(),
      getWebhookDeliveries(null, 20),
      supabase
        .from("api_keys")
        .select("id, name, key_prefix, permissions, is_active, last_used_at, expires_at, created_at, environment")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("full_name, email").eq("user_id", user.id).single(),
    ]);

  return (
    <DeveloperDashboard
      apiUsage={apiUsage}
      apiKeys={(apiKeys ?? []) as Parameters<typeof DeveloperDashboard>[0]["apiKeys"]}
      webhookEndpoints={webhookEndpoints}
      recentDeliveries={recentDeliveries}
    />
  );
}
