"use server";

import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { REMOTE_MANAGED_PACKAGES, RemoteManagedPackage } from "@/lib/billing/catalog";
import { calculateGst } from "@/lib/billing/tax";
import { getRazorpayClient, verifyRazorpaySignature } from "@/lib/razorpay";
import { createInvoiceForPayment } from "@/lib/invoices";

export interface CreateManagedOrderInput {
  packageCode: "essential" | "pro" | "premium" | "enterprise";
  eventName: string;
  eventDate?: string;
  city?: string;
  estimatedAttendees: number;
  billingName: string;
  billingEmail: string;
  billingPhone: string;
  billingAddress?: string;
  billingGstin?: string;
  billingState?: string;
}

/**
 * 1. Creates a Managed Service Order with 50% Deposit & 50% Balance calculation.
 */
export async function createManagedServiceOrder(input: CreateManagedOrderInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const pkg = REMOTE_MANAGED_PACKAGES.find((p) => p.code === input.packageCode);
  if (!pkg) {
    return { success: false, error: "Invalid managed package selected." };
  }

  if (pkg.code === "enterprise") {
    return {
      success: true,
      isEnterpriseQuote: true,
      message: "Enterprise requests are routed to our engineering operations team for a custom scope quotation.",
    };
  }

  // Calculate base price and 18% GST in paise
  const basePricePaise = pkg.pricePaise;
  const tax = calculateGst(basePricePaise, {
    customerStateCode: input.billingGstin ? input.billingGstin.substring(0, 2) : undefined,
  });

  const totalAmountPaise = tax.totalAmountPaise;
  // 50% deposit and 50% balance
  const depositRequiredPaise = Math.floor(totalAmountPaise / 2);
  const balanceRequiredPaise = totalAmountPaise - depositRequiredPaise;

  const orderNumber = `MNG-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

  const admin = adminClient();
  const { data: order, error } = await admin
    .from("managed_service_orders")
    .insert({
      order_number: orderNumber,
      user_id: user?.id || null,
      package_code: pkg.code,
      event_name: input.eventName,
      event_date: input.eventDate ? new Date(input.eventDate).toISOString() : null,
      city: input.city || null,
      estimated_attendees: input.estimatedAttendees,
      base_price_paise: basePricePaise,
      tax_paise: tax.taxAmountPaise,
      total_amount_paise: totalAmountPaise,
      deposit_required_paise: depositRequiredPaise,
      balance_required_paise: balanceRequiredPaise,
      status: "deposit_pending",
      billing_name: input.billingName,
      billing_email: input.billingEmail,
      billing_phone: input.billingPhone,
      billing_address: input.billingAddress || null,
      billing_gstin: input.billingGstin || null,
      billing_state: input.billingState || null,
    })
    .select()
    .single();

  if (error || !order) {
    console.error("[ManagedBilling] Error creating order:", error);
    return { success: false, error: "Failed to initialize managed service order." };
  }

  // Log audit
  await admin.from("billing_audit_log").insert({
    account_id: user?.id || null,
    account_type: "user",
    actor_id: user?.id || null,
    actor_email: input.billingEmail,
    action: "managed_order_placed",
    entity_type: "managed_order",
    entity_id: order.id,
    new_state: { orderNumber, totalAmountPaise, depositRequiredPaise },
  });

  revalidatePath("/dashboard/billing");
  return {
    success: true,
    orderId: order.id,
    orderNumber: order.order_number,
    depositRequiredPaise,
    totalAmountPaise,
  };
}

/**
 * 2. Creates a Razorpay One-Time Payment Order for 50% Deposit.
 */
export async function createManagedDepositRazorpayOrder(orderId: string) {
  const admin = adminClient();
  const { data: order, error } = await admin
    .from("managed_service_orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    return { success: false, error: "Order not found." };
  }

  if (order.status !== "deposit_pending" && order.status !== "quote_accepted") {
    return { success: false, error: `Order is not eligible for deposit payment (status: ${order.status}).` };
  }

  const razorpay = getRazorpayClient();
  const receipt = `dep_${order.order_number.toLowerCase().replace(/[^a-z0-9_]/g, "_")}`.slice(0, 40);

  try {
    const rzpOrder = await razorpay.orders.create({
      amount: order.deposit_required_paise,
      currency: "INR",
      receipt,
      notes: {
        managed_order_id: order.id,
        order_number: order.order_number,
        payment_type: "deposit",
        package_code: order.package_code,
        customer_email: order.billing_email,
      },
    });

    return {
      success: true,
      razorpayOrderId: rzpOrder.id,
      amountPaise: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      billingName: order.billing_name,
      billingEmail: order.billing_email,
      billingPhone: order.billing_phone,
    };
  } catch (err: any) {
    console.error("[ManagedBilling] Razorpay order creation failed:", err);
    return { success: false, error: err?.message || "Payment gateway communication error." };
  }
}

/**
 * 3. Verifies and records verified deposit payment.
 */
export async function verifyManagedDepositPayment(params: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const isValid = verifyRazorpaySignature(
    params.razorpayOrderId,
    params.razorpayPaymentId,
    params.razorpaySignature
  );

  if (!isValid && process.env.NODE_ENV === "production") {
    return { success: false, error: "Invalid payment signature." };
  }

  const admin = adminClient();
  const { data: order } = await admin
    .from("managed_service_orders")
    .select("*")
    .eq("id", params.orderId)
    .single();

  if (!order) {
    return { success: false, error: "Managed order not found." };
  }

  // Idempotent check
  if (order.status === "deposit_paid" || order.status === "setup_in_progress") {
    return { success: true, message: "Deposit payment already recorded." };
  }

  // Update order status
  await admin
    .from("managed_service_orders")
    .update({
      status: "deposit_paid",
      deposit_paid_paise: order.deposit_required_paise,
      deposit_paid_at: new Date().toISOString(),
      deposit_payment_id: params.razorpayPaymentId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id);

  // Record payment item
  await admin.from("managed_service_order_payments").insert({
    order_id: order.id,
    payment_type: "deposit",
    amount_paise: order.deposit_required_paise,
    provider: "razorpay",
    provider_order_id: params.razorpayOrderId,
    provider_payment_id: params.razorpayPaymentId,
    status: "captured",
    receipt_number: `RCP-DEP-${order.order_number}`,
  });

  // Create invoice record
  try {
    await createInvoiceForPayment({
      userId: order.user_id || "guest",
      organizationId: order.organization_id || undefined,
      baseAmountRupees: Math.round(order.deposit_required_paise / 100),
      description: `Remote Managed Service Deposit (${order.package_code.toUpperCase()})`,
      paymentId: params.razorpayPaymentId,
      currency: "INR",
      docType: "MS",
      customerName: order.billing_name,
      customerEmail: order.billing_email,
      customerAddress: order.billing_address || undefined,
      customerGstin: order.billing_gstin || undefined,
    });
  } catch (invErr) {
    console.error("[ManagedBilling] Invoice generation notice:", invErr);
  }

  // Audit
  await admin.from("billing_audit_log").insert({
    account_id: order.user_id,
    account_type: "user",
    action: "deposit_collected",
    entity_type: "managed_order",
    entity_id: order.id,
    new_state: { paymentId: params.razorpayPaymentId, amountPaise: order.deposit_required_paise },
  });

  revalidatePath("/dashboard/billing");
  return { success: true };
}
