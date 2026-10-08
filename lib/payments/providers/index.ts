import type { PaymentProvider } from "../types";
import type { IPaymentProvider } from "./interface";
import { RazorpayRouteAdapter } from "./razorpay-route";
import { CashfreeEasySplitAdapter } from "./cashfree-easy-split";
import { PayUAdapter } from "./payu-provider";

export * from "./interface";
export * from "./razorpay-route";
export * from "./cashfree-easy-split";
export * from "./payu-provider";

const razorpayRouteInstance = new RazorpayRouteAdapter();
const cashfreeEasySplitInstance = new CashfreeEasySplitAdapter();
const payUInstance = new PayUAdapter();

/**
 * Factory to get Payment Provider Adapter
 */
export function getPaymentProvider(provider: PaymentProvider = "RAZORPAY"): IPaymentProvider {
  if (provider === "CASHFREE") {
    return cashfreeEasySplitInstance;
  }
  if (provider === "PAYU") {
    return payUInstance;
  }
  return razorpayRouteInstance;
}
