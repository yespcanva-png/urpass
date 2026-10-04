/**
 * URPASS Managed Payments & Marketplace Split-Settlement Architecture
 * Type Definitions
 */

export type PaymentMode = "URPASS_MANAGED" | "ORGANIZER_GATEWAY";
export type PaymentProvider = "RAZORPAY" | "CASHFREE";
export type FeeBearer = "ATTENDEE" | "ORGANIZER" | "SPLIT";
export type RefundPolicy = "NON_REFUNDABLE" | "FLEXIBLE_24H" | "ORGANIZER_DISCRETION";

export type KycStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
export type SettlementStatus = "PENDING" | "ACTIVE" | "PROCESSING" | "SETTLED" | "FAILED" | "SUSPENDED" | "ON_HOLD";
export type BankVerificationStatus = "PENDING" | "VERIFIED" | "FAILED";

export type OrderStatus = "CREATED" | "PROCESSING" | "CONFIRMED" | "CANCELLED" | "REFUNDED";
export type PaymentStatus =
  | "CREATED"
  | "PENDING"
  | "AUTHORIZED"
  | "CAPTURED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type TransferStatus = "PENDING" | "PROCESSED" | "FAILED" | "REVERSED" | "ON_HOLD";
export type RefundStatus = "REQUESTED" | "PROCESSING" | "PROCESSED" | "FAILED";
export type TicketValidationStatus = "VALID" | "USED" | "REFUNDED" | "CANCELLED" | "BLOCKED";

export interface BusinessDetails {
  legalBusinessName: string;
  businessType: "individual" | "partnership" | "llp" | "private_limited" | "public_limited" | "trust" | "society" | "charity" | "ltd";
  pan?: string;
  gstin?: string;
  companyNumber?: string; // UK Companies House Number
  vatNumber?: string; // UK / EU VAT Number
  contactEmail: string;
  contactPhone: string;
  businessAddress?: string;
  countryCode?: "IN" | "GB" | "US";
}

export interface SettlementDetails {
  accountNumberMasked: string; // e.g. "••••4321"
  ifscCode?: string; // India IFSC
  sortCode?: string; // UK Sort Code (6 digits e.g. 20-00-00)
  beneficiaryName: string;
  bankName?: string;
  countryCode?: "IN" | "GB" | "US";
}

export interface OrganizationPaymentAccount {
  id: string;
  organizationId: string;
  provider: PaymentProvider;
  providerVendorId: string | null; // e.g. "acc_Qk8j21" for Razorpay Route
  kycStatus: KycStatus;
  settlementStatus: SettlementStatus;
  bankVerificationStatus: BankVerificationStatus;
  businessDetails: BusinessDetails;
  settlementDetails: SettlementDetails;
  paymentsEnabled: boolean;
  refundsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventPaymentConfig {
  id: string;
  eventId: string;
  paymentMode: PaymentMode;
  provider: PaymentProvider;
  providerLinkedAccountId?: string;
  feeBearer: FeeBearer;
  platformFeePercent: number; // e.g. 2.0%
  platformFeeFixedINR: number; // e.g. ₹0 or ₹20
  gatewayFeePercent: number; // e.g. 2.0%
  gatewayFeeFixedINR: number;
  refundPolicy: RefundPolicy;
  createdAt?: string;
  updatedAt?: string;
}

export type EventPaymentConfigRecord = EventPaymentConfig & {
  event_id?: string;
  payment_mode?: PaymentMode;
  fee_bearer?: FeeBearer;
  platform_fee_percent?: number;
  platform_fee_fixed_inr?: number;
  gateway_fee_percent?: number;
  gateway_fee_fixed_inr?: number;
  refund_policy?: RefundPolicy;
  provider_linked_account_id?: string | null;
  created_at?: string;
  updated_at?: string;
};

export interface FeeCalculationResult {
  basePrice: number; // Gross ticket price
  feeBearer: FeeBearer;
  platformFee: number; // URPASS platform share
  gatewayFee: number; // Payment processing fee
  attendeeTotalPayable: number; // Final amount charged to customer
  organizerNetShare: number; // Net amount transferred to organizer linked account
  currency: string;
}

export interface TicketOrder {
  id: string;
  orderNumber: string;
  organizationId?: string;
  eventId: string;
  ticketTypeId?: string;
  attendeeId?: string;
  reservationId?: string;
  quantity: number;
  currency: string;
  subtotal: number;
  discount: number;
  tax: number;
  platformFee: number;
  gatewayFee: number;
  totalAmount: number;
  organizerShare: number;
  feeBearer: FeeBearer;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  provider: PaymentProvider;
  providerOrderId?: string;
  providerPaymentId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  providerPaymentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: string;
  capturedAt?: string;
  failedAt?: string;
  rawProviderReference?: Record<string, unknown>;
  createdAt: string;
}

export interface PaymentTransfer {
  id: string;
  orderId: string;
  paymentId: string;
  organizationId?: string;
  provider: PaymentProvider;
  linkedAccountId: string;
  grossAmount: number;
  platformFee: number;
  organizerShare: number;
  providerTransferId?: string;
  status: TransferStatus;
  settlementId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRefund {
  id: string;
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  reason: string;
  status: RefundStatus;
  providerRefundId?: string;
  reverseTransfer: boolean;
  requestedBy?: string;
  createdAt: string;
  completedAt?: string;
}

export interface SettlementRecord {
  id: string;
  organizationId: string;
  eventId?: string;
  provider: PaymentProvider;
  providerSettlementId?: string;
  grossAmount: number;
  platformFees: number;
  gatewayFees: number;
  refunds: number;
  adjustments: number;
  netSettlement: number;
  status: SettlementStatus;
  expectedSettlementDate?: string;
  settledAt?: string;
  createdAt: string;
}

export interface NormalizedPaymentEvent {
  eventType:
    | "PAYMENT_CAPTURED"
    | "PAYMENT_FAILED"
    | "TRANSFER_PROCESSED"
    | "TRANSFER_FAILED"
    | "REFUND_PROCESSED"
    | "SETTLEMENT_PROCESSED";
  provider: PaymentProvider;
  providerOrderId?: string;
  providerPaymentId?: string;
  providerTransferId?: string;
  providerRefundId?: string;
  providerSettlementId?: string;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  timestamp: string;
  rawPayload: Record<string, unknown>;
}
