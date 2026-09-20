"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export interface WebhookEndpoint {
  id: string;
  url: string;
  description: string | null;
  subscribed_events: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  delivery_total?: number;
  delivery_success?: number;
}

export interface WebhookDelivery {
  id: string;
  endpoint_id: string;
  event_type: string;
  payload?: Record<string, unknown> | null;
  response_status: number | null;
  response_body: string | null;
  delivered_at: string;
  attempt: number;
  success: boolean;
  endpoint_url?: string;
}

async function canUseWebhooks(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const plan = await getUserPlan(supabase, userId);
  return plan.canUse("webhooks");
}

export async function createWebhookEndpoint(
  url: string,
  description: string,
  subscribedEvents: string[]
): Promise<{ endpoint?: WebhookEndpoint & { secret: string }; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (!(await canUseWebhooks(supabase, user.id))) {
    return { error: "Developer tools are available on the Pro plan and above." };
  }

  if (!url || !url.startsWith("https://")) {
    return { error: "URL must start with https://" };
  }

  if (subscribedEvents.length === 0) {
    return { error: "Select at least one event type." };
  }

  const secret = crypto.randomBytes(32).toString("hex");

  const { data, error } = await supabase
    .from("webhook_endpoints")
    .insert({
      user_id: user.id,
      url,
      secret,
      description: description || null,
      subscribed_events: subscribedEvents,
    })
    .select("id, url, description, subscribed_events, is_active, created_at, updated_at")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/developer");
  return { endpoint: { ...(data as WebhookEndpoint), secret } };
}

export async function deleteWebhookEndpoint(
  endpointId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (!(await canUseWebhooks(supabase, user.id))) {
    return { error: "Developer tools are available on the Pro plan and above." };
  }

  const { error } = await supabase
    .from("webhook_endpoints")
    .delete()
    .eq("id", endpointId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/developer");
  return {};
}

export async function listWebhookEndpoints(): Promise<WebhookEndpoint[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  if (!(await canUseWebhooks(supabase, user.id))) return [];

  const { data: endpoints } = await supabase
    .from("webhook_endpoints")
    .select("id, url, description, subscribed_events, is_active, created_at, updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!endpoints || endpoints.length === 0) return [];

  // Fetch delivery stats for each endpoint (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const endpointIds = endpoints.map((e) => e.id);

  const { data: deliveries } = await supabase
    .from("webhook_deliveries")
    .select("endpoint_id, success")
    .in("endpoint_id", endpointIds)
    .gte("delivered_at", thirtyDaysAgo);

  const statsMap: Record<string, { total: number; success: number }> = {};
  for (const d of deliveries ?? []) {
    if (!statsMap[d.endpoint_id]) statsMap[d.endpoint_id] = { total: 0, success: 0 };
    statsMap[d.endpoint_id].total++;
    if (d.success) statsMap[d.endpoint_id].success++;
  }

  return endpoints.map((e) => ({
    ...(e as WebhookEndpoint),
    delivery_total: statsMap[e.id]?.total ?? 0,
    delivery_success: statsMap[e.id]?.success ?? 0,
  }));
}

export async function getWebhookDeliveries(
  endpointId: string | null,
  limit = 20
): Promise<WebhookDelivery[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  if (!(await canUseWebhooks(supabase, user.id))) return [];

  if (endpointId) {
    // Verify ownership
    const { data: ep } = await supabase
      .from("webhook_endpoints")
      .select("id")
      .eq("id", endpointId)
      .eq("user_id", user.id)
      .single();

    if (!ep) return [];

    const { data } = await supabase
      .from("webhook_deliveries")
      .select("id, endpoint_id, event_type, payload, response_status, response_body, delivered_at, attempt, success")
      .eq("endpoint_id", endpointId)
      .order("delivered_at", { ascending: false })
      .limit(limit);

    return (data ?? []) as WebhookDelivery[];
  }

  // All endpoints for this user — join via webhook_endpoints
  const { data: endpoints } = await supabase
    .from("webhook_endpoints")
    .select("id, url")
    .eq("user_id", user.id);

  if (!endpoints || endpoints.length === 0) return [];

  const epIds = endpoints.map((e) => e.id);
  const epUrlMap: Record<string, string> = {};
  for (const e of endpoints) epUrlMap[e.id] = e.url;

  const { data } = await supabase
    .from("webhook_deliveries")
    .select("id, endpoint_id, event_type, payload, response_status, response_body, delivered_at, attempt, success")
    .in("endpoint_id", epIds)
    .order("delivered_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((d) => ({
    ...(d as WebhookDelivery),
    endpoint_url: epUrlMap[d.endpoint_id] ?? "",
  }));
}
