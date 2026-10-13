import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type {
  BillingLifecycleState,
  PlanSlug,
  BillingCycle,
} from "../types/subscription";

function getAdmin() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * Transition subscription state following lifecycle rules:
 * - Failed charge -> 'past_due' with grace period (3 days)
 * - Autopay cancel -> 'ending' (continues until current_period_end)
 * - Expiration -> 'expired' (live-event continuity preserves attendee records & checkin)
 */
export async function transitionSubscriptionLifecycle(params: {
  organizationId: string;
  newState: BillingLifecycleState;
  reason?: string;
  actorUserId?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { organizationId, newState, reason, actorUserId } = params;
  const admin = getAdmin();

  const { data: sub } = await admin
    .from("organization_subscriptions")
    .select("*")
    .eq("organization_id", organizationId)
    .single();

  if (!sub) {
    return { success: false, error: "Organization subscription not found" };
  }

  const updates: Record<string, unknown> = {
    lifecycle_state: newState,
    updated_at: new Date().toISOString(),
  };

  // Grace period handling
  if (newState === "past_due") {
    const graceEnd = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3-day grace
    updates.grace_period_ends_at = graceEnd.toISOString();
  }

  if (newState === "cancelled" || newState === "ending") {
    updates.cancel_at_period_end = true;
    updates.cancelled_at = new Date().toISOString();
  }

  const { error } = await admin
    .from("organization_subscriptions")
    .update(updates)
    .eq("id", sub.id);

  if (error) {
    return { success: false, error: error.message };
  }

  // Audit log entry
  await admin.from("billing_audit_logs").insert({
    organization_id: organizationId,
    actor_user_id: actorUserId ?? null,
    action: `lifecycle_transition_to_${newState}`,
    entity_type: "subscription",
    entity_id: sub.id,
    metadata: {
      previous_state: sub.lifecycle_state,
      new_state: newState,
      reason: reason ?? "Standard lifecycle transition",
    },
  });

  return { success: true };
}

/**
 * Handle successful payment renewal or new activation
 */
export async function handleSuccessfulPaymentCycle(params: {
  organizationId: string;
  planSlug: PlanSlug;
  cycle: BillingCycle;
  amountPaise: number;
  paymentId: string;
  orderId?: string;
}): Promise<void> {
  const { organizationId, planSlug, cycle, amountPaise, paymentId, orderId } = params;
  const admin = getAdmin();

  const now = new Date();
  const periodEnd = new Date(now);
  if (cycle === "annual") {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  }

  // Check if this was an introductory ₹29 cycle
  const isIntroCycle = amountPaise === 2900;

  const { data: existingSub } = await admin
    .from("organization_subscriptions")
    .select("id, intro_offer_cycles_completed, active_offer_id")
    .eq("organization_id", organizationId)
    .maybeSingle();

  const completedCycles = (existingSub?.intro_offer_cycles_completed ?? 0) + (isIntroCycle ? 1 : 0);

  // Update or insert subscription
  const { data: sub } = await admin
    .from("organization_subscriptions")
    .upsert(
      {
        organization_id: organizationId,
        plan_id: (await admin.from("billing_plans").select("id").eq("slug", planSlug).single()).data?.id,
        lifecycle_state: "active",
        billing_cycle: cycle,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        cancel_at_period_end: false,
        intro_offer_cycles_completed: completedCycles,
        intro_offer_eligible: completedCycles < 2 && isIntroCycle,
        autopay_status: "active",
        updated_at: now.toISOString(),
      },
      { onConflict: "organization_id" }
    )
    .select("id")
    .single();

  // Record period
  if (sub?.id) {
    await admin.from("subscription_periods").insert({
      subscription_id: sub.id,
      organization_id: organizationId,
      period_start: now.toISOString(),
      period_end: periodEnd.toISOString(),
      is_intro_cycle: isIntroCycle,
      amount_paise: amountPaise,
      status: "active",
    });
  }

  // Record payment in billing_payments
  await admin.from("billing_payments").insert({
    organization_id: organizationId,
    subscription_id: sub?.id ?? null,
    provider: "razorpay",
    provider_payment_id: paymentId,
    provider_order_id: orderId ?? null,
    amount_paise: amountPaise,
    currency: "INR",
    status: "captured",
    settlement_status: "settled",
  });
}
