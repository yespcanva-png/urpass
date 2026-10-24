import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { getRazorpayClient, isRazorpayConfigured } from "@/lib/razorpay";

export interface ReconciliationDiscrepancy {
  userId: string;
  userEmail?: string | null;
  subscriptionId: string;
  category:
    | "CANCELLED_ACCOUNT_WITH_ACTIVE_PROVIDER_MANDATE"
    | "ACTIVE_STATUS_PAST_PERIOD_END"
    | "MISSING_PROVIDER_IDENTIFIER"
    | "TOKEN_MANDATE_WITHOUT_RECURRING_TRIGGER"
    | "PROVIDER_DISCREPANCY"
    | "MULTIPLE_ACTIVE_AGREEMENTS";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
  description: string;
  recommendedAction: string;
  details: Record<string, unknown>;
}

export interface ReconciliationReport {
  timestamp: string;
  totalSubscriptionsAudited: number;
  activeSubscriptionsCount: number;
  tokenMandatesCount: number;
  nativeSubscriptionsCount: number;
  freePlanCount: number;
  cancelledScheduledCount: number;
  expiredCount: number;
  discrepanciesCount: number;
  discrepancies: ReconciliationDiscrepancy[];
}

function adminClient() {
  return createClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * Executes a non-destructive, read-only reconciliation sweep across all Supabase subscriptions
 * and compares their status against Razorpay state.
 */
export async function runBillingReconciliation(): Promise<ReconciliationReport> {
  const admin = adminClient();
  const now = new Date();

  const { data: allSubscriptions, error } = await admin
    .from("subscriptions")
    .select(`
      id,
      user_id,
      status,
      provider,
      billing_cycle,
      current_period_start,
      current_period_end,
      cancel_at_period_end,
      cancellation_state,
      cancellation_error,
      autopay_mandate_id,
      autopay_status,
      provider_subscription_id,
      provider_customer_id,
      has_lifetime_access,
      is_trial,
      plan:plans(id, name, slug)
    `);

  if (error || !allSubscriptions) {
    throw new Error(`Failed to load subscriptions for reconciliation: ${error?.message}`);
  }

  const discrepancies: ReconciliationDiscrepancy[] = [];
  let activeCount = 0;
  let tokenCount = 0;
  let nativeCount = 0;
  let freeCount = 0;
  let cancelledCount = 0;
  let expiredCount = 0;

  const razorpay = isRazorpayConfigured() ? getRazorpayClient() : null;

  for (const sub of allSubscriptions) {
    const planData = sub.plan as any;
    const planSlug = (Array.isArray(planData) ? planData[0]?.slug : planData?.slug) || "free";
    const status = String(sub.status || "").toLowerCase();
    const isCancelledAtEnd = Boolean(sub.cancel_at_period_end);
    const hasLifetime = Boolean(sub.has_lifetime_access || planSlug === "founder" || planSlug === "lifetime");

    if (planSlug === "free" || sub.provider === "free") {
      freeCount++;
      continue;
    }

    if (hasLifetime) {
      // Lifetime licenses do not renew or expire
      continue;
    }

    const isNativeSub = Boolean(
      sub.provider_subscription_id?.startsWith("sub_") || sub.autopay_mandate_id?.startsWith("sub_")
    );
    const isTokenMandate = Boolean(
      sub.autopay_mandate_id?.startsWith("token_") || (sub.autopay_status === "active" && !isNativeSub)
    );

    if (isNativeSub) nativeCount++;
    if (isTokenMandate) tokenCount++;

    const periodEnd = sub.current_period_end ? new Date(sub.current_period_end) : null;
    const isPastPeriodEnd = periodEnd ? periodEnd.getTime() < now.getTime() : false;

    if (status === "active") {
      if (isPastPeriodEnd) {
        expiredCount++;
        discrepancies.push({
          userId: sub.user_id,
          subscriptionId: sub.id,
          category: "ACTIVE_STATUS_PAST_PERIOD_END",
          severity: "HIGH",
          description: `Subscription is marked status 'active' but current_period_end (${sub.current_period_end}) is in the past.`,
          recommendedAction: "Verify if Razorpay successfully renewed or transition status to 'expired'.",
          details: { current_period_end: sub.current_period_end, plan: planSlug },
        });
      } else {
        activeCount++;
      }
    }

    if (isCancelledAtEnd || sub.cancellation_state === "cancellation_scheduled") {
      cancelledCount++;
      // Check if native Razorpay subscription still shows active on Razorpay
      const nativeId = sub.provider_subscription_id?.startsWith("sub_")
        ? sub.provider_subscription_id
        : sub.autopay_mandate_id?.startsWith("sub_")
        ? sub.autopay_mandate_id
        : null;

      if (nativeId && razorpay) {
        try {
          const rzpSub = await (razorpay.subscriptions as any).fetch(nativeId);
          if (rzpSub?.status === "active" && !rzpSub?.end_at && !rzpSub?.cancel_at_cycle_end) {
            discrepancies.push({
              userId: sub.user_id,
              subscriptionId: sub.id,
              category: "CANCELLED_ACCOUNT_WITH_ACTIVE_PROVIDER_MANDATE",
              severity: "CRITICAL",
              description: `Subscription cancelled in UrPass but Razorpay native subscription ${nativeId} is still active without cancellation flag.`,
              recommendedAction: "Execute razorpay.subscriptions.cancel(id, { cancel_at_cycle_end: 1 }) immediately to prevent unwanted debit.",
              details: { providerId: nativeId, razorpayStatus: rzpSub?.status },
            });
          }
        } catch (fetchErr: any) {
          console.warn("[reconciliation] Could not fetch Razorpay sub:", nativeId, fetchErr?.message);
        }
      }
    }

    // Check for missing provider ID on paid accounts
    if (status === "active" && !sub.provider_subscription_id && !sub.autopay_mandate_id) {
      discrepancies.push({
        userId: sub.user_id,
        subscriptionId: sub.id,
        category: "MISSING_PROVIDER_IDENTIFIER",
        severity: "HIGH",
        description: `Active paid plan (${planSlug}) has no provider_subscription_id or autopay_mandate_id recorded.`,
        recommendedAction: "Cross-reference recent payment records or customer email with Razorpay dashboard to link provider ID.",
        details: { plan: planSlug, status },
      });
    }

    // Token mandate warning
    if (isTokenMandate && sub.autopay_status === "active" && !isPastPeriodEnd) {
      discrepancies.push({
        userId: sub.user_id,
        subscriptionId: sub.id,
        category: "TOKEN_MANDATE_WITHOUT_RECURRING_TRIGGER",
        severity: "MEDIUM",
        description: `Customer is on a token mandate (${sub.autopay_mandate_id}). Because token mandates require merchant-initiated recurring charges, scheduled billing will not fire unless triggered.`,
        recommendedAction: "Migrate customer to native Razorpay Subscription on next billing date or trigger recurring payment via scheduled job.",
        details: { mandateId: sub.autopay_mandate_id, current_period_end: sub.current_period_end },
      });
    }
  }

  return {
    timestamp: now.toISOString(),
    totalSubscriptionsAudited: allSubscriptions.length,
    activeSubscriptionsCount: activeCount,
    tokenMandatesCount: tokenCount,
    nativeSubscriptionsCount: nativeCount,
    freePlanCount: freeCount,
    cancelledScheduledCount: cancelledCount,
    expiredCount: expiredCount,
    discrepanciesCount: discrepancies.length,
    discrepancies,
  };
}
