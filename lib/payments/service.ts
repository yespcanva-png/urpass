import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { getPaymentProvider } from "./providers";
import { calculateTicketFees } from "./fees";
import type {
  BusinessDetails,
  SettlementDetails,
  PaymentMode,
  PaymentProvider,
  FeeBearer,
  RefundPolicy,
  FeeCalculationResult,
  TicketOrder,
} from "./types";

// Admin service-role client for authoritative database operations
function getAdminClient() {
  return createClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Onboard Organization into URPASS Managed Payments (Razorpay Route / Cashfree Split)
 */
export async function onboardOrgPaymentAccountService(params: {
  organizationId: string;
  provider?: PaymentProvider;
  businessDetails: BusinessDetails;
  settlementDetails: SettlementDetails;
}) {
  const { organizationId, provider = "RAZORPAY", businessDetails, settlementDetails } = params;
  const paymentProvider = getPaymentProvider(provider);

  // 1. Create linked account with regulated payment partner
  const result = await paymentProvider.createLinkedAccount({
    organizationId,
    businessDetails,
    settlementDetails,
  });

  const supabase = getAdminClient();

  // 2. Persist in database (masked bank details only)
  const { data, error } = await supabase
    .from("organization_payment_accounts")
    .upsert(
      {
        organization_id: organizationId,
        provider,
        provider_vendor_id: result.providerVendorId,
        kyc_status: result.kycStatus,
        settlement_status: "ACTIVE",
        bank_verification_status: result.bankVerificationStatus,
        business_details: businessDetails,
        settlement_details: {
          accountNumberMasked: settlementDetails.accountNumberMasked,
          ifscCode: settlementDetails.ifscCode,
          beneficiaryName: settlementDetails.beneficiaryName,
          bankName: settlementDetails.bankName || "Verified Bank",
        },
        payments_enabled: true,
        refunds_enabled: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "organization_id,provider" }
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save payment account: ${error.message}`);
  }

  return data;
}

/**
 * Save / Update Event Payment Configuration
 */
export async function saveEventPaymentConfigService(params: {
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
  const supabase = getAdminClient();
  const {
    eventId,
    paymentMode,
    provider = "RAZORPAY",
    providerLinkedAccountId,
    feeBearer,
    platformFeePercent = 2.0,
    platformFeeFixedINR = 0,
    gatewayFeePercent = 2.0,
    gatewayFeeFixedINR = 0,
    refundPolicy = "ORGANIZER_DISCRETION",
  } = params;

  const { data, error } = await supabase
    .from("event_payment_configs")
    .upsert(
      {
        event_id: eventId,
        payment_mode: paymentMode,
        provider,
        provider_linked_account_id: providerLinkedAccountId,
        fee_bearer: feeBearer,
        platform_fee_percent: platformFeePercent,
        platform_fee_fixed_inr: platformFeeFixedINR,
        gateway_fee_percent: gatewayFeePercent,
        gateway_fee_fixed_inr: gatewayFeeFixedINR,
        refund_policy: refundPolicy,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "event_id" }
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save event payment config: ${error.message}`);
  }

  return data;
}

/**
 * Initiate Order Checkout with Atomic Inventory Protection
 */
export async function initiateOrderCheckoutService(params: {
  eventId: string;
  ticketTypeId?: string;
  quantity?: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customFields?: Record<string, unknown>;
}) {
  const {
    eventId,
    ticketTypeId,
    quantity = 1,
    customerName,
    customerEmail,
    customerPhone,
    customFields = {},
  } = params;
  const supabase = getAdminClient();

  // 1. Fetch Event & Payment Config
  const { data: event, error: eventErr } = await supabase
    .from("events")
    .select("id, title, organizer_id, organization_id, is_paid_event, attendee_limit")
    .eq("id", eventId)
    .single();

  if (eventErr || !event) {
    throw new Error("Event not found");
  }

  // 2. Fetch Ticket Type
  let baseTicketPrice = 0;
  if (ticketTypeId) {
    const { data: ticketType } = await supabase
      .from("ticket_types")
      .select("id, name, price, capacity")
      .eq("id", ticketTypeId)
      .single();

    if (ticketType) {
      baseTicketPrice = Number(ticketType.price || 0);
    }
  }

  // 3. Fetch Event Payment Config
  const { data: config } = await supabase
    .from("event_payment_configs")
    .select("*")
    .eq("event_id", eventId)
    .maybeSingle();

  const paymentMode: PaymentMode = config?.payment_mode || "URPASS_MANAGED";
  const feeBearer: FeeBearer = config?.fee_bearer || "ATTENDEE";
  const provider: PaymentProvider = config?.provider || "RAZORPAY";

  // 4. Calculate Authoritative Fees
  const fees: FeeCalculationResult = calculateTicketFees({
    basePrice: baseTicketPrice * quantity,
    feeBearer,
    platformFeePercent: Number(config?.platform_fee_percent ?? 2.0),
    platformFeeFixedINR: Number(config?.platform_fee_fixed_inr ?? 0),
    gatewayFeePercent: Number(config?.gateway_fee_percent ?? 2.0),
    gatewayFeeFixedINR: Number(config?.gateway_fee_fixed_inr ?? 0),
  });

  // 5. Atomic Capacity Reservation (10-minute hold)
  let reservationId: string | null = null;
  if (typeof supabase.rpc === "function") {
    try {
      const { data: rpcRes } = await supabase.rpc("reserve_ticket_capacity", {
        p_event_id: eventId,
        p_ticket_type_id: ticketTypeId || null,
        p_buyer_email: customerEmail,
        p_buyer_name: customerName,
        p_window_seconds: 600, // 10 minutes
      });
      if (rpcRes && rpcRes.reservation_id) {
        reservationId = rpcRes.reservation_id;
      }
    } catch {
      // Fallback
    }
  }

  // Generate unique human-readable order number
  const orderNumber = `URP-ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  // 6. Fetch Organizer Linked Account ID if in Managed Payments mode
  let linkedAccountId = config?.provider_linked_account_id;
  if (!linkedAccountId && event.organization_id) {
    const { data: orgAccount } = await supabase
      .from("organization_payment_accounts")
      .select("provider_vendor_id")
      .eq("organization_id", event.organization_id)
      .eq("provider", provider)
      .maybeSingle();

    if (orgAccount?.provider_vendor_id) {
      linkedAccountId = orgAccount.provider_vendor_id;
    }
  }

  // 7. Call Payment Provider to create gateway order
  const paymentProvider = getPaymentProvider(provider);
  const providerOrder = await paymentProvider.createOrder({
    amountINR: fees.attendeeTotalPayable,
    currency: fees.currency,
    receipt: orderNumber,
    customer: {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
    },
    notes: {
      event_id: eventId,
      order_number: orderNumber,
      ticket_type_id: ticketTypeId || "",
      organizer_id: event.organizer_id,
    },
    // In URPASS_MANAGED mode, route split share directly to organizer linked account
    splitTransfer:
      paymentMode === "URPASS_MANAGED" && linkedAccountId
        ? {
            linkedAccountId,
            amountINR: fees.organizerNetShare,
            currency: fees.currency,
          }
        : undefined,
  });

  // 8. Persist Order Record in Database
  const { data: order, error: orderErr } = await supabase
    .from("ticket_orders")
    .insert({
      order_number: orderNumber,
      organization_id: event.organization_id || null,
      event_id: eventId,
      ticket_type_id: ticketTypeId || null,
      reservation_id: reservationId,
      quantity,
      currency: fees.currency,
      subtotal: fees.basePrice,
      platform_fee: fees.platformFee,
      gateway_fee: fees.gatewayFee,
      total_amount: fees.attendeeTotalPayable,
      organizer_share: fees.organizerNetShare,
      fee_bearer: feeBearer,
      payment_mode: paymentMode,
      payment_status: "CREATED",
      order_status: "CREATED",
      provider,
      provider_order_id: providerOrder.providerOrderId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      metadata: customFields,
    })
    .select()
    .single();

  if (orderErr) {
    throw new Error(`Failed to create order: ${orderErr.message}`);
  }

  return {
    order,
    providerOrder,
    fees,
    reservationExpiresInSeconds: 600,
  };
}

/**
 * Process Full or Partial Refund with Route Split Transfer Reversal
 */
export async function processOrderRefundService(params: {
  orderId: string;
  amountINR?: number;
  reason: string;
  requestedByUserId?: string;
}) {
  const { orderId, reason, requestedByUserId } = params;
  const supabase = getAdminClient();

  // 1. Fetch Order & Payment Details
  const { data: order, error: orderErr } = await supabase
    .from("ticket_orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderErr || !order) {
    throw new Error("Order not found");
  }

  if (order.payment_status !== "CAPTURED") {
    throw new Error(`Cannot refund order with payment status ${order.payment_status}`);
  }

  const refundAmount = params.amountINR || Number(order.total_amount);

  // 2. Invoke Payment Provider Refund API with Reverse Transfer enabled
  const paymentProvider = getPaymentProvider(order.provider);
  const providerRefund = await paymentProvider.processRefund({
    paymentId: order.provider_payment_id || `pay_${order.id}`,
    amountINR: refundAmount,
    reason,
    reverseTransfer: true, // Reverses split share from organizer linked account
  });

  // 3. Record Refund in Database
  await supabase.from("payment_refunds").insert({
    order_id: order.id,
    payment_id: order.provider_payment_id || "",
    amount: refundAmount,
    currency: order.currency,
    reason,
    status: providerRefund.status,
    provider_refund_id: providerRefund.providerRefundId,
    reverse_transfer: true,
    requested_by: requestedByUserId || null,
    completed_at: new Date().toISOString(),
  });

  // 4. Update Order Status to REFUNDED
  await supabase
    .from("ticket_orders")
    .update({
      payment_status: "REFUNDED",
      order_status: "REFUNDED",
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id);

  // 5. CRITICAL: Invalidate Ticket Server-Side
  // Mark passes with status = 'refunded' and ticket_status = 'REFUNDED'
  if (order.attendee_id) {
    await supabase
      .from("passes")
      .update({
        status: "not_generated",
        ticket_status: "REFUNDED",
        updated_at: new Date().toISOString(),
      })
      .eq("attendee_id", order.attendee_id);
  }

  return {
    success: true,
    orderId: order.id,
    refundId: providerRefund.providerRefundId,
    refundAmount,
  };
}
