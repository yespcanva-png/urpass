"use server";

import { adminClient } from "@/lib/supabase/admin";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { revalidatePath } from "next/cache";

export async function getOpsBillingData() {
  const isAuth = await isOpsAuthenticated();
  if (!isAuth) {
    return { error: "Unauthorized" };
  }

  const admin = adminClient();

  // 1. Fetch recent customer subscriptions
  const { data: subscriptions } = await admin
    .from("subscriptions")
    .select("id, user_id, status, provider, billing_cycle, current_period_end, cancel_at_period_end, autopay_status, updated_at, plans(name, slug)")
    .order("updated_at", { ascending: false })
    .limit(50);

  // 2. Fetch Managed Service Orders
  const { data: managedOrders } = await admin
    .from("managed_service_orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  // 3. Fetch recent audit logs
  const { data: auditLogs } = await admin
    .from("billing_audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  // 4. Calculate key metrics
  const totalSubscribers = subscriptions?.filter((s) => s.status === "active").length || 0;
  const pastDueSubscribers = subscriptions?.filter((s) => s.status === "past_due" || s.status === "payment_pending").length || 0;
  
  let totalManagedRevenuePaise = 0;
  managedOrders?.forEach((o) => {
    totalManagedRevenuePaise += (o.deposit_paid_paise || 0) + (o.balance_paid_paise || 0);
  });

  return {
    subscriptions: subscriptions || [],
    managedOrders: managedOrders || [],
    auditLogs: auditLogs || [],
    metrics: {
      activeSubscribers: totalSubscribers,
      pastDueSubscribers,
      managedOrdersCount: managedOrders?.length || 0,
      managedRevenueInr: Math.round(totalManagedRevenuePaise / 100),
    },
  };
}

export async function updateManagedOrderStatus(orderId: string, newStatus: string, notes?: string) {
  const isAuth = await isOpsAuthenticated();
  if (!isAuth) return { success: false, error: "Unauthorized" };

  const admin = adminClient();
  const { error } = await admin
    .from("managed_service_orders")
    .update({
      status: newStatus,
      remote_support_notes: notes || undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) return { success: false, error: error.message };

  await admin.from("billing_audit_log").insert({
    account_type: "user",
    action: "managed_order_status_updated",
    entity_type: "managed_order",
    entity_id: orderId,
    new_state: { status: newStatus, notes },
  });

  revalidatePath("/ops/billing");
  return { success: true };
}
