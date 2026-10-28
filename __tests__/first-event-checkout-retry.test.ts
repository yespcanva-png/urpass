import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { createProviderSubscription, fetchProviderSubscription, fetchProviderPlan } = vi.hoisted(() => ({
  createProviderSubscription: vi.fn(),
  fetchProviderSubscription: vi.fn(),
  fetchProviderPlan: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({ auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }) } }),
}));
vi.mock("@/lib/razorpay", () => ({
  getRazorpayCredentials: () => ({ keyId: "rzp_test" }),
  getRazorpayClient: () => ({
    plans: { fetch: fetchProviderPlan },
    subscriptions: { create: createProviderSubscription, fetch: fetchProviderSubscription },
  }),
  formatRazorpayErrorMessage: () => "Gateway unavailable",
}));
vi.mock("@/lib/billing/razorpay-subscription-offers", () => ({
  isIntroOfferPlan: (slug: string) => slug === "starter",
  getMonthlyRazorpayPlanId: () => "plan_starter",
  getIntroOfferId: () => null,
  getIntroOfferDisclosure: () => null,
}));
vi.mock("@/lib/conversion/first-event", () => ({ recordFirstEventConversion: vi.fn() }));

let pending: { id: string; plan_slug: string; provider_subscription_id: string | null; amount_paise: number } | null;
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: (table: string) => {
      const query = {
        select: () => query, eq: () => query, order: () => query, limit: async () => ({
          data: table === "billing_plan_prices" ? [{ price_paise: 49900, tax_inclusive: false, tax_rate_percent: 18, version: 1 }] : [],
          error: null,
        }),
        maybeSingle: async () => ({ data:
          table === "subscriptions" ? null :
          table === "plans" ? { id: "plan-db", name: "Starter", slug: "starter" } :
          table === "billing_plans" ? { id: "catalog-plan" } :
          table === "subscription_checkout_intents" ? pending : null,
          error: null }),
      };
      return query;
    },
  }),
}));

import { POST } from "@/app/api/billing/subscriptions/route";

function request() {
  return new NextRequest("http://localhost/api/billing/subscriptions", { method: "POST",
    body: JSON.stringify({ planSlug: "starter", billingCycle: "monthly", currency: "INR",
      billingDetails: { billingAddress: "12 Main Road", stateCode: "29", state: "Karnataka" } }) });
}

describe("first-event Razorpay checkout retry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pending = { id: "intent-1", plan_slug: "starter", provider_subscription_id: "sub_existing", amount_paise: 49900 };
    fetchProviderPlan.mockResolvedValue({ item: { amount: 49900 }, period: "monthly", interval: 1 });
    fetchProviderSubscription.mockResolvedValue({ id: "sub_existing", status: "created" });
  });

  it("returns the existing provider subscription without creating another", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ subscriptionId: "sub_existing", reused: true });
    expect(createProviderSubscription).not.toHaveBeenCalled();
  });

  it("does not create a second subscription while the first reservation is unresolved", async () => {
    pending = { ...pending!, provider_subscription_id: null };
    const response = await POST(request());
    expect(response.status).toBe(409);
    expect(createProviderSubscription).not.toHaveBeenCalled();
  });

  it("blocks checkout when Razorpay and the billing catalog disagree", async () => {
    fetchProviderPlan.mockResolvedValue({ item: { amount: 59900 }, period: "monthly", interval: 1 });
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(createProviderSubscription).not.toHaveBeenCalled();
  });
});
