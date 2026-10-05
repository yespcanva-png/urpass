/**
 * Cashfree Payments & Easy Split Architecture - Type Definitions
 * Payments API Version: 2026-01-01
 */

export type CashfreeEnv = "sandbox" | "production";

export interface CashfreeConfig {
  env: CashfreeEnv;
  appId: string;
  secretKey: string;
  apiVersion: string;
  baseUrl: string;
  appUrl: string;
  apiUrl: string;
}

export interface CashfreeCustomerDetails {
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_bank_account_number?: string;
  customer_bank_ifsc?: string;
  customer_bank_code?: string;
}

export interface CashfreeOrderMeta {
  return_url?: string;
  notify_url?: string;
  payment_methods?: string;
}

export interface CashfreeOrderTags {
  event_id?: string;
  organization_id?: string;
  registration_id?: string;
  ticket_type_id?: string;
  [key: string]: string | undefined;
}

export interface CashfreeCreateOrderRequest {
  order_id: string;
  order_amount: number; // In decimal INR e.g. 1000.00
  order_currency: "INR" | string;
  customer_details: CashfreeCustomerDetails;
  order_meta?: CashfreeOrderMeta;
  order_tags?: CashfreeOrderTags;
  order_note?: string;
  order_expiry_time?: string;
}

export interface CashfreeCreateOrderResponse {
  cf_order_id: string;
  order_id: string;
  order_amount: number;
  order_currency: string;
  order_status: "ACTIVE" | "PAID" | "EXPIRED" | "TERMINATED";
  payment_session_id: string;
  order_expiry_time?: string;
  customer_details?: CashfreeCustomerDetails;
  order_meta?: CashfreeOrderMeta;
  order_tags?: CashfreeOrderTags;
  created_at?: string;
}

export interface CashfreeOrderPaymentEntity {
  cf_payment_id: string;
  order_id: string;
  payment_status: "SUCCESS" | "FAILED" | "PENDING" | "USER_DROPPED" | "CANCELLED";
  payment_amount: number;
  payment_currency: string;
  payment_message?: string;
  payment_time?: string;
  payment_completion_time?: string;
  payment_group?: "upi" | "card" | "netbanking" | "wallet" | "paylater";
  payment_method?: Record<string, unknown>;
  bank_reference?: string;
  auth_id?: string;
}

export interface CashfreeVendorKycDetails {
  pan?: string;
  gstin?: string;
  cin?: string;
  account_type?: "individual" | "proprietorship" | "partnership" | "pvt_ltd" | "public_ltd" | "llp" | "trust" | "society";
}

export interface CashfreeVendorBankDetails {
  account_number: string;
  ifsc: string;
  account_holder?: string;
}

export interface CashfreeVendorUpiDetails {
  vpa: string;
  account_holder?: string;
}

export interface CashfreeCreateVendorRequest {
  vendor_id: string;
  name: string;
  email: string;
  phone: string;
  verify_account?: boolean;
  dashboard_access?: boolean;
  schedule_option?: number; // 1 = instant/daily, etc.
  bank?: CashfreeVendorBankDetails;
  upi?: CashfreeVendorUpiDetails;
  kyc_details?: CashfreeVendorKycDetails;
  status?: "ACTIVE" | "INACTIVE";
}

export interface CashfreeVendorResponse {
  vendor_id: string;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  name: string;
  email: string;
  phone: string;
  verify_account?: boolean;
  dashboard_access?: boolean;
  schedule_option?: number;
  bank?: CashfreeVendorBankDetails;
  upi?: CashfreeVendorUpiDetails;
  kyc_details?: CashfreeVendorKycDetails;
  created_at?: string;
  updated_at?: string;
}

export interface CashfreeVendorSplitItem {
  vendor_id: string;
  amount?: number; // Absolute amount in decimal INR
  percentage?: number; // Percentage e.g. 98.0
  tags?: Record<string, string>;
}

export interface CashfreeSplitOrderRequest {
  split: CashfreeVendorSplitItem[];
  disable_split?: boolean;
}

export interface CashfreeSplitOrderResponse {
  order_id: string;
  split: Array<{
    vendor_id: string;
    amount?: number;
    percentage?: number;
    split_status?: "SUCCESS" | "FAILED" | "PENDING";
  }>;
  status?: "SUCCESS" | "FAILED" | "SCHEDULED";
  message?: string;
}

export interface CashfreeWebhookHeaders {
  "x-webhook-signature"?: string;
  "x-webhook-timestamp"?: string;
  [key: string]: string | undefined;
}

export interface CashfreeWebhookPayload {
  type: string; // e.g. "PAYMENT_SUCCESS_WEBHOOK", "PAYMENT_FAILED_WEBHOOK"
  event_time?: string;
  data: {
    order?: {
      order_id?: string;
      order_amount?: number;
      order_currency?: string;
      order_tags?: Record<string, string>;
    };
    payment?: {
      cf_payment_id?: string;
      payment_status?: string;
      payment_amount?: number;
      payment_currency?: string;
      payment_message?: string;
      payment_time?: string;
      payment_group?: string;
      bank_reference?: string;
    };
    customer_details?: CashfreeCustomerDetails;
    [key: string]: unknown;
  };
}
