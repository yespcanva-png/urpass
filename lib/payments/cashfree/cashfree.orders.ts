/**
 * Cashfree Orders Service
 * Handles order creation with idempotency and order payments status lookup
 */

import { cashfreeRequest, getCashfreeConfig } from "./cashfree.client";
import type {
  CashfreeCreateOrderRequest,
  CashfreeCreateOrderResponse,
  CashfreeOrderPaymentEntity,
} from "./cashfree.types";

export interface CreateOrderParams {
  orderId: string;
  orderAmountINR: number;
  currency?: string;
  customerDetails: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
  };
  orderTags?: {
    eventId?: string;
    organizationId?: string;
    registrationId?: string;
    ticketTypeId?: string;
    [key: string]: string | undefined;
  };
  returnUrl?: string;
  notifyUrl?: string;
  idempotencyKey?: string;
}

/**
 * Creates a Cashfree PG Order (returns payment_session_id for checkout)
 */
export async function createCashfreeOrder(
  params: CreateOrderParams
): Promise<CashfreeCreateOrderResponse> {
  const config = getCashfreeConfig();

  const returnUrl =
    params.returnUrl ||
    `${config.appUrl}/payment/status?order_id=${params.orderId}`;

  const notifyUrl =
    params.notifyUrl ||
    `${config.apiUrl}/api/webhooks/cashfree`;

  const requestBody: CashfreeCreateOrderRequest = {
    order_id: params.orderId,
    order_amount: Math.round(params.orderAmountINR * 100) / 100,
    order_currency: params.currency || "INR",
    customer_details: {
      customer_id: params.customerDetails.customerId,
      customer_name: params.customerDetails.customerName,
      customer_email: params.customerDetails.customerEmail,
      customer_phone: params.customerDetails.customerPhone || "9999999999",
    },
    order_meta: {
      return_url: returnUrl,
      notify_url: notifyUrl,
    },
    order_tags: {
      event_id: params.orderTags?.eventId,
      organization_id: params.orderTags?.organizationId,
      registration_id: params.orderTags?.registrationId,
      ticket_type_id: params.orderTags?.ticketTypeId,
    },
  };

  return cashfreeRequest<CashfreeCreateOrderResponse>(
    "/orders",
    {
      method: "POST",
      body: JSON.stringify(requestBody),
    },
    params.idempotencyKey
  );
}

/**
 * Fetches order details by order_id
 */
export async function getCashfreeOrder(
  orderId: string
): Promise<CashfreeCreateOrderResponse> {
  return cashfreeRequest<CashfreeCreateOrderResponse>(`/orders/${orderId}`, {
    method: "GET",
  });
}

/**
 * Fetches all payment transactions for an order
 * Used for server-side payment verification (payment_status = "SUCCESS")
 */
export async function getCashfreeOrderPayments(
  orderId: string
): Promise<CashfreeOrderPaymentEntity[]> {
  return cashfreeRequest<CashfreeOrderPaymentEntity[]>(
    `/orders/${orderId}/payments`,
    {
      method: "GET",
    }
  );
}
