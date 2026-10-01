"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  onboardOrgPaymentAccountService,
  saveEventPaymentConfigService,
  getEventPaymentConfigService,
  initiateOrderCheckoutService,
  processOrderRefundService,
} from "@/lib/payments/service";
import type {
  BusinessDetails,
  SettlementDetails,
  PaymentMode,
  PaymentProvider,
  FeeBearer,
  RefundPolicy,
} from "@/lib/payments/types";

/**
 * Onboard Organization to URPASS Managed Payments (Razorpay Route / Marketplace)
 */
export async function onboardOrganizationPaymentAccountAction(
  orgId: string,
  businessDetails: BusinessDetails,
  settlementDetails: SettlementDetails,
  provider: PaymentProvider = "RAZORPAY"
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify owner / admin role
  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    return { error: "Only organization owners and admins can configure settlement accounts." };
  }

  try {
    const account = await onboardOrgPaymentAccountService({
      organizationId: orgId,
      provider,
      businessDetails,
      settlementDetails,
    });

    revalidatePath(`/org`);
    return { success: true, account };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to onboard payment account" };
  }
}

/**
 * Fetch Organization Payment Account
 */
export async function getOrganizationPaymentAccountAction(orgId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("organization_payment_accounts")
    .select("*")
    .eq("organization_id", orgId)
    .maybeSingle();

  return data;
}

/**
 * Save / Update Event Payment Config
 */
export async function saveEventPaymentConfigAction(params: {
  eventId: string;
  paymentMode: PaymentMode;
  provider?: PaymentProvider;
  providerLinkedAccountId?: string;
  feeBearer: FeeBearer;
  platformFeePercent?: number;
  platformFeeFixedINR?: number;
  gatewayFeePercent?: number;
  gatewayFeeFixedINR?: number;
  refundPolicy?: RefundPolicy;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify permissions for this event
  const { data: event } = await supabase
    .from("events")
    .select("id, organizer_id, organization_id")
    .eq("id", params.eventId)
    .single();

  if (!event || (event.organizer_id !== user.id && !event.organization_id)) {
    return { error: "Unauthorized to update event payment configuration." };
  }

  try {
    const config = await saveEventPaymentConfigService({
      ...params,
      userId: user.id,
    });
    revalidatePath(`/event/${params.eventId}`);
    revalidatePath(`/event/${params.eventId}/finance`);
    return { success: true, config };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to save payment configuration" };
  }
}

/**
 * Fetch Event Payment Config
 */
export async function getEventPaymentConfigAction(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return await getEventPaymentConfigService(eventId, user?.id);
}

export type InitiateOrderCheckoutActionResult =
  | ({ success: true } & Awaited<ReturnType<typeof initiateOrderCheckoutService>>)
  | { success: false; error: string };

/**
 * Initiate Order Checkout (Public Action for Attendees)
 */
export async function initiateOrderCheckoutAction(params: {
  eventId: string;
  ticketTypeId?: string;
  quantity?: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customFields?: Record<string, unknown>;
}): Promise<InitiateOrderCheckoutActionResult> {
  try {
    const checkoutResult = await initiateOrderCheckoutService(params);
    return { success: true, ...checkoutResult };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Checkout initialization failed" };
  }
}

export type ProcessOrderRefundActionResult =
  | { success: true; orderId: string; refundId: string; refundAmount: number }
  | { success: false; error: string };

/**
 * Process Order Refund
 */
export async function processOrderRefundAction(params: {
  orderId: string;
  amountINR?: number;
  reason: string;
}): Promise<ProcessOrderRefundActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  try {
    const result = await processOrderRefundService({
      ...params,
      requestedByUserId: user.id,
    });
    return {
      success: true as const,
      orderId: result.orderId,
      refundId: result.refundId,
      refundAmount: result.refundAmount,
    };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Refund processing failed" };
  }
}

/**
 * Fetch Organizer Finance Dashboard Metrics
 */
export async function getOrganizerFinanceMetricsAction(eventId?: string, organizationId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let query = supabase.from("ticket_orders").select("*");
  if (eventId) {
    query = query.eq("event_id", eventId);
  } else if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data: orders } = await query;
  const orderList = orders || [];

  const grossSales = orderList
    .filter((o) => o.payment_status === "CAPTURED")
    .reduce((sum, o) => sum + Number(o.subtotal || 0), 0);

  const totalRefunds = orderList
    .filter((o) => o.payment_status === "REFUNDED")
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  const platformFees = orderList
    .filter((o) => o.payment_status === "CAPTURED")
    .reduce((sum, o) => sum + Number(o.platform_fee || 0), 0);

  const processingFees = orderList
    .filter((o) => o.payment_status === "CAPTURED")
    .reduce((sum, o) => sum + Number(o.gateway_fee || 0), 0);

  const netSettlement = orderList
    .filter((o) => o.payment_status === "CAPTURED")
    .reduce((sum, o) => sum + Number(o.organizer_share || 0), 0);

  // Fetch recent transactions
  const transactions = orderList.slice(0, 50);

  return {
    metrics: {
      grossSales,
      totalRefunds,
      platformFees,
      processingFees,
      netSettlement: Math.max(0, netSettlement - totalRefunds),
      ordersCount: orderList.length,
      paidCount: orderList.filter((o) => o.payment_status === "CAPTURED").length,
    },
    transactions,
  };
}
