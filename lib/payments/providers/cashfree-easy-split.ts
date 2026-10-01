import crypto from "crypto";
import type {
  IPaymentProvider,
  CreateProviderOrderParams,
  ProviderOrderResult,
  CreateSplitTransferParams,
  SplitTransferResult,
  ProviderRefundParams,
  ProviderRefundResult,
} from "./interface";
import type {
  BusinessDetails,
  SettlementDetails,
  KycStatus,
  NormalizedPaymentEvent,
  PaymentProvider,
} from "../types";

export class CashfreeEasySplitAdapter implements IPaymentProvider {
  readonly providerName: PaymentProvider = "CASHFREE";

  async createLinkedAccount(params: {
    organizationId: string;
    businessDetails: BusinessDetails;
    settlementDetails: SettlementDetails;
  }): Promise<{
    providerVendorId: string;
    kycStatus: KycStatus;
    bankVerificationStatus: "PENDING" | "VERIFIED" | "FAILED";
    message: string;
  }> {
    const { organizationId, settlementDetails } = params;
    const vendorHash = crypto
      .createHash("sha256")
      .update(`cashfree-${organizationId}-${settlementDetails.accountNumberMasked}`)
      .digest("hex")
      .slice(0, 10);
    const vendorId = `cf_vnd_${vendorHash}`;

    return {
      providerVendorId: vendorId,
      kycStatus: "APPROVED",
      bankVerificationStatus: "VERIFIED",
      message: "Cashfree Easy Split vendor account registered.",
    };
  }

  async createOrder(params: CreateProviderOrderParams): Promise<ProviderOrderResult> {
    const { amountINR, currency = "INR", receipt } = params;
    const mockOrderId = `cf_order_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    return {
      providerOrderId: mockOrderId,
      amount: Math.round(amountINR * 100),
      currency,
    };
  }

  async createSplitTransfer(params: CreateSplitTransferParams): Promise<SplitTransferResult> {
    const mockTransferId = `cf_split_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    return {
      providerTransferId: mockTransferId,
      status: "PROCESSED",
    };
  }

  verifyWebhookSignature(payload: string, signature: string, secret?: string): boolean {
    const webhookSecret = secret || process.env.CASHFREE_WEBHOOK_SECRET || "dummy_secret";
    try {
      const expected = crypto
        .createHmac("sha256", webhookSecret)
        .update(payload)
        .digest("base64");
      return expected === signature;
    } catch {
      return false;
    }
  }

  normalizeWebhookEvent(rawEvent: Record<string, unknown>): NormalizedPaymentEvent | null {
    const eventType = String(rawEvent.type || "");
    const data = (rawEvent.data || {}) as Record<string, unknown>;
    const orderData = (data.order || {}) as Record<string, unknown>;
    const paymentData = (data.payment || {}) as Record<string, unknown>;

    if (eventType === "PAYMENT_SUCCESS_WEBHOOK") {
      return {
        eventType: "PAYMENT_CAPTURED",
        provider: "CASHFREE",
        providerOrderId: String(orderData.order_id || ""),
        providerPaymentId: String(paymentData.cf_payment_id || ""),
        amount: Number(orderData.order_amount || 0),
        currency: String(orderData.order_currency || "INR"),
        paymentMethod: String(paymentData.payment_group || "upi"),
        timestamp: new Date().toISOString(),
        rawPayload: rawEvent,
      };
    }

    return null;
  }

  async processRefund(params: ProviderRefundParams): Promise<ProviderRefundResult> {
    const { amountINR } = params;
    return {
      providerRefundId: `cf_rfnd_${Date.now()}`,
      status: "PROCESSED",
      amount: amountINR,
    };
  }
}
