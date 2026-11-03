import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CheckoutModal from "@/components/billing/CheckoutModal";
import PaidPlanButton from "@/app/onboarding/first-event/plans/PaidPlanButton";

const { activatePaidSubscription, routerPush } = vi.hoisted(() => ({
  activatePaidSubscription: vi.fn().mockResolvedValue({ success: true }),
  routerPush: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: routerPush, refresh: vi.fn() }) }));
vi.mock("@/app/actions/coupons", () => ({ validateCoupon: vi.fn() }));
vi.mock("@/app/actions/billing", () => ({ activatePaidSubscription }));

function mockRazorpay() {
  let checkoutOptions: Record<string, unknown> | undefined;
  window.Razorpay = class {
    constructor(options: Record<string, unknown>) { checkoutOptions = options; }
    open() {}
  };
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ keyId: "rzp_test", orderId: "order_123", amount: 58882, currency: "INR" }),
  });
  return () => checkoutOptions;
}

describe("single payment checkout", () => {
  it("uses a one-time order from Billing", async () => {
    const options = mockRazorpay();
    render(<CheckoutModal isOpen onClose={vi.fn()} planSlug="starter" planName="Starter"
      billingCycle="monthly" userEmail="buyer@example.com" userName="Buyer"
      userPhone="9876543210" priceMonthly={499} annualTotal={4990} />);

    expect(screen.getByText(/No AutoPay mandate or automatic renewal/i)).toBeInTheDocument();
    await userEvent.type(screen.getByPlaceholderText("Registered billing address"), "1 Main Street");
    await userEvent.click(screen.getByRole("button", { name: /Pay ₹588.82/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      "/api/razorpay/order", expect.objectContaining({ method: "POST" }),
    ));
    expect(options()).toMatchObject({ order_id: "order_123", amount: 58882 });
    expect(options()).not.toHaveProperty("subscription_id");
  });

  it("uses a one-time order for the first event and activates the paid month", async () => {
    const options = mockRazorpay();
    render(<PaidPlanButton plan={{ slug: "starter", name: "Starter", amountPaise: 49900, taxRatePercent: 18 }}
      draftId="draft-1" userEmail="buyer@example.com" userName="Buyer" />);

    await userEvent.click(screen.getByRole("button", { name: "Choose Starter" }));
    await userEvent.type(screen.getByLabelText("Billing address"), "1 Main Street");
    await userEvent.type(screen.getByLabelText("Billing state"), "Tamil Nadu");
    await userEvent.type(screen.getByLabelText("GST state code"), "33");
    await userEvent.click(screen.getByRole("button", { name: "Pay once for one month" }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      "/api/razorpay/order", expect.objectContaining({ method: "POST" }),
    ));
    expect(options()).toMatchObject({ order_id: "order_123" });
    expect(options()).not.toHaveProperty("subscription_id");
    const handler = options()?.handler as (result: Record<string, string>) => Promise<void>;
    await handler({ razorpay_order_id: "order_123", razorpay_payment_id: "pay_123", razorpay_signature: "signed" });
    expect(activatePaidSubscription).toHaveBeenCalledWith("starter", expect.objectContaining({ paymentId: "pay_123" }), "monthly", undefined, expect.anything());
    expect(routerPush).toHaveBeenCalledWith("/event/draft-1/settings");
  });
});
