import type {
  BusinessDetails,
  SettlementDetails,
  KycStatus,
  NormalizedPaymentEvent,
  PaymentProvider,
} from "../types";

export interface CreateProviderOrderParams {
  amountINR: number;
  currency?: string;
  receipt: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  notes?: Record<string, string>;
  // For Razorpay Route / Marketplace direct transfers during order creation
  splitTransfer?: {
    linkedAccountId: string;
    amountINR: number;
    currency?: string;
  };
}

export interface ProviderOrderResult {
  providerOrderId: string;
  amount: number;
  currency: string;
  keyId?: string;
}

export interface CreateSplitTransferParams {
  paymentId: string;
  linkedAccountId: string;
  amountINR: number;
  currency?: string;
  notes?: Record<string, string>;
}

export interface SplitTransferResult {
  providerTransferId: string;
  status: "PENDING" | "PROCESSED" | "FAILED";
}

export interface ProviderRefundParams {
  paymentId: string;
  amountINR: number;
  reason: string;
  reverseTransfer?: boolean;
}

export interface ProviderRefundResult {
  providerRefundId: string;
  status: "REQUESTED" | "PROCESSING" | "PROCESSED" | "FAILED";
  amount: number;
}

export interface IPaymentProvider {
  readonly providerName: PaymentProvider;

  createLinkedAccount(params: {
    organizationId: string;
    businessDetails: BusinessDetails;
    settlementDetails: SettlementDetails;
  }): Promise<{
    providerVendorId: string;
    kycStatus: KycStatus;
    bankVerificationStatus: "PENDING" | "VERIFIED" | "FAILED";
    message: string;
  }>;

  createOrder(params: CreateProviderOrderParams): Promise<ProviderOrderResult>;

  createSplitTransfer(params: CreateSplitTransferParams): Promise<SplitTransferResult>;

  verifyWebhookSignature(payload: string, signature: string, secret?: string): boolean;

  normalizeWebhookEvent(rawEvent: Record<string, unknown>): NormalizedPaymentEvent | null;

  processRefund(params: ProviderRefundParams): Promise<ProviderRefundResult>;
}
