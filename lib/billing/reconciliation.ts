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
      plan:plans!subscriptions_plan_id_fkey(id, name, slug)
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
    } else if ((status === "trialing" || sub.is_trial) && isPastPeriodEnd) {
      expiredCount++;
      const nativeId = sub.provider_subscription_id?.startsWith("sub_")
        ? sub.provider_subscription_id
        : sub.autopay_mandate_id?.startsWith("sub_")
        ? sub.autopay_mandate_id
        : null;

      if (nativeId && razorpay) {
        try {
          const rzpSub = await (razorpay.subscriptions as any).fetch(nativeId);
          if (rzpSub?.status === "active" && Number(rzpSub?.paid_count) > 0) {
            discrepancies.push({
              userId: sub.user_id,
              subscriptionId: sub.id,
              category: "PROVIDER_DISCREPANCY",
              severity: "CRITICAL",
              description: `User trial concluded but Razorpay subscription ${nativeId} is ACTIVE with ${rzpSub.paid_count} successful payment(s). Supabase is desynced.`,
              recommendedAction: "Execute reconcileSubscriptionWithRazorpay to sync active status and generate GST invoice.",
              details: { providerId: nativeId, razorpayStatus: rzpSub?.status, paidCount: rzpSub?.paid_count },
            });
          }
        } catch (fetchErr: any) {
          console.warn("[reconciliation] Could not fetch Razorpay trial sub:", nativeId, fetchErr?.message);
        }
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

/**
 * Automatically reconciles a subscription with its live Razorpay gateway state.
 * If the subscription on Razorpay is active and has captured payment(s), updates the Supabase record
 * and creates any missing official tax invoice.
 */
export async function reconcileSubscriptionWithRazorpay(subscriptionIdOrUserId: string): Promise<{
  success: boolean;
  actionTaken: string;
  subscription?: any;
}> {
  const admin = adminClient();
  const razorpay = isRazorpayConfigured() ? getRazorpayClient() : null;
  if (!razorpay) {
    return { success: false, actionTaken: "Razorpay client not configured" };
  }

  // Find subscription by primary key or user_id
  const { data: sub, error } = await admin
    .from("subscriptions")
    .select("*, plans!subscriptions_plan_id_fkey(id, name, slug)")
    .or(`id.eq.${subscriptionIdOrUserId},user_id.eq.${subscriptionIdOrUserId}`)
    .maybeSingle();

  if (error || !sub) {
    return { success: false, actionTaken: `Subscription not found for identifier: ${subscriptionIdOrUserId}` };
  }

  const nativeId = sub.provider_subscription_id?.startsWith("sub_")
    ? sub.provider_subscription_id
    : sub.autopay_mandate_id?.startsWith("sub_")
    ? sub.autopay_mandate_id
    : null;

  if (!nativeId) {
    return { success: false, actionTaken: "No native Razorpay subscription identifier (sub_*) found" };
  }

  try {
    const rzpSub = await (razorpay.subscriptions as any).fetch(nativeId);
    if (!rzpSub) {
      return { success: false, actionTaken: `Failed to fetch subscription ${nativeId} from Razorpay` };
    }

    if (rzpSub.status === "active" && Number(rzpSub.paid_count) > 0) {
      const currentStart = rzpSub.current_start
        ? new Date(rzpSub.current_start * 1000).toISOString()
        : new Date().toISOString();
      const currentEnd = rzpSub.current_end
        ? new Date(rzpSub.current_end * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const updateData: Record<string, any> = {
        status: "active",
        is_trial: false,
        autopay_status: "active",
        cancellation_state: "none",
        cancellation_error: null,
        current_period_start: currentStart,
        current_period_end: currentEnd,
        next_billing_date: currentEnd,
        updated_at: new Date().toISOString(),
        last_reconciled_at: new Date().toISOString(),
      };

      if (sub.current_period_start !== currentStart) {
        updateData.registrations_used = 0;
      }

      const { data: updatedSub, error: updateErr } = await admin
        .from("subscriptions")
        .update(updateData)
        .eq("id", sub.id)
        .select("*")
        .single();

      if (updateErr) throw updateErr;

      // Check invoices
      const invoices = await (razorpay.invoices as any).all({ subscription_id: nativeId });
      const latestPaidInvoice = invoices?.items?.find((inv: any) => inv.status === "paid" && inv.payment_id);

      if (latestPaidInvoice?.payment_id) {
        const { data: existingInv } = await admin
          .from("invoices")
          .select("id")
          .eq("payment_id", latestPaidInvoice.payment_id)
          .maybeSingle();

        if (!existingInv) {
          try {
            const { createInvoiceForPayment } = await import("@/lib/invoices");
            const planData = sub.plans as any;
            const planSlug = (Array.isArray(planData) ? planData[0]?.slug : planData?.slug) || "pro";
            const basePaise = latestPaidInvoice.amount ? Math.round(latestPaidInvoice.amount / 1.18) : 0;
            await createInvoiceForPayment({
              userId: sub.user_id,
              subscriptionId: sub.id,
              paymentId: latestPaidInvoice.payment_id,
              description: `${planSlug.toUpperCase()} Plan (Renewal)`,
              baseAmountRupees: basePaise / 100,
              discountRupees: 0,
              currency: (latestPaidInvoice.currency || "INR").toUpperCase() as "INR" | "GBP",
              docType: "SUB",
              customerEmail: latestPaidInvoice.customer_details?.email || undefined,
              customerName: latestPaidInvoice.customer_details?.name || undefined,
              billingPeriodStart: currentStart,
              billingPeriodEnd: currentEnd,
            });
          } catch (invErr) {
            console.error("[reconcileSubscriptionWithRazorpay] Invoice generation error:", invErr);
          }
        }
      }

      return {
        success: true,
        actionTaken: `Subscription promoted to active (period: ${currentStart} to ${currentEnd})`,
        subscription: updatedSub,
      };
    } else if (rzpSub.status === "cancelled" || rzpSub.status === "halted") {
      await admin
        .from("subscriptions")
        .update({
          status: "expired",
          is_trial: false,
          autopay_status: "cancelled",
          updated_at: new Date().toISOString(),
          last_reconciled_at: new Date().toISOString(),
        })
        .eq("id", sub.id);

      return {
        success: true,
        actionTaken: `Subscription transitioned to expired; Razorpay status is ${rzpSub.status}`,
      };
    }

    return {
      success: true,
      actionTaken: `No sync required. Razorpay status: ${rzpSub.status}, paid_count: ${rzpSub.paid_count}`,
    };
  } catch (err: any) {
    return { success: false, actionTaken: `Razorpay fetch/sync failed: ${err?.message}` };
  }
}
