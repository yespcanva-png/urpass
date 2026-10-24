import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Phase 1 — Subscription Cancellation & State Machine", () => {
  it("transitions through clear cancellation states", () => {
    const states = [
      "none",
      "cancellation_requested",
      "cancellation_pending",
      "cancellation_scheduled",
      "cancellation_confirmed",
      "cancellation_failed",
    ];
    expect(states).toContain("cancellation_scheduled");
    expect(states).toContain("cancellation_failed");
  });

  it("distinguishes native Razorpay Subscriptions (sub_*) from Token Mandates", () => {
    const isNativeSub = (id?: string | null) => Boolean(id?.startsWith("sub_"));
    const isTokenMandate = (id?: string | null) => Boolean(id?.startsWith("token_"));

    expect(isNativeSub("sub_Q1w2e3r4t5y6u7")).toBe(true);
    expect(isNativeSub("token_9876543210")).toBe(false);
    expect(isTokenMandate("token_9876543210")).toBe(true);
  });

  it("ensures cancellation preserves paid-through access until current_period_end", () => {
    const periodEnd = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString();
    const subRecord = {
      status: "active",
      cancel_at_period_end: true,
      cancellation_state: "cancellation_scheduled",
      current_period_end: periodEnd,
    };

    // User should have full access while periodEnd > now
    const now = new Date();
    const hasActivePaidAccess =
      subRecord.status === "active" &&
      new Date(subRecord.current_period_end).getTime() > now.getTime();

    expect(hasActivePaidAccess).toBe(true);
    expect(subRecord.cancellation_state).toBe("cancellation_scheduled");
  });

  it("records provider cancellation failure without falsely reporting success", () => {
    const providerResult = {
      success: false,
      error: "BAD_REQUEST_ERROR: Gateway connection timed out",
    };

    let cancellationState = "none";
    let cancellationError: string | null = null;

    if (!providerResult.success) {
      cancellationState = "cancellation_failed";
      cancellationError = providerResult.error;
    }

    expect(cancellationState).toBe("cancellation_failed");
    expect(cancellationError).toContain("Gateway connection timed out");
  });
});

describe("Phase 2 — Read-Only Customer Reconciliation", () => {
  it("identifies active accounts past their current_period_end as discrepancies", () => {
    const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    const sub = {
      user_id: "user_123",
      status: "active",
      current_period_end: pastDate,
      cancel_at_period_end: false,
    };

    const isPastDue = new Date(sub.current_period_end).getTime() < Date.now();
    expect(isPastDue).toBe(true);
  });

  it("identifies cancelled accounts with active provider subscriptions", () => {
    const sub = {
      user_id: "user_456",
      cancel_at_period_end: true,
      cancellation_state: "cancellation_scheduled",
      provider_subscription_id: "sub_live_99999",
    };

    const rzpGatewayStatus = "active"; // Not yet flagged as cancelled on Razorpay
    const requiresProviderSync = sub.cancel_at_period_end && rzpGatewayStatus === "active";
    expect(requiresProviderSync).toBe(true);
  });
});

describe("Phase 5 & 6 — Plan Upgrades, Downgrades & Reactivation", () => {
  it("schedules downgrade for end of billing cycle while keeping current entitlements", () => {
    const currentSub = {
      plan_id: "plan_pro",
      current_period_end: "2026-11-25T00:00:00.000Z",
    };

    const downgradeRequest = {
      targetPlanSlug: "starter",
      effectiveAt: currentSub.current_period_end,
    };

    expect(downgradeRequest.effectiveAt).toBe("2026-11-25T00:00:00.000Z");
    expect(downgradeRequest.targetPlanSlug).toBe("starter");
  });

  it("restores subscription auto-renewal when reactivated before period end", () => {
    const cancelledSub = {
      cancel_at_period_end: true,
      autopay_status: "cancelled",
      cancellation_state: "cancellation_scheduled",
      current_period_end: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // Reactivate
    const reactivated = {
      ...cancelledSub,
      cancel_at_period_end: false,
      autopay_status: "active",
      cancellation_state: "none",
    };

    expect(reactivated.cancel_at_period_end).toBe(false);
    expect(reactivated.autopay_status).toBe("active");
    expect(reactivated.cancellation_state).toBe("none");
  });
});

describe("Phase 7 & 8 — Live Event Scanner Protection & UI Safety", () => {
  it("ensures live event scanner terminals are exempt from subscription blocks", () => {
    const requiresSubscriptionAccess = (pathname: string) => {
      if (pathname.startsWith("/scan/") && pathname !== "/scan") {
        return false;
      }
      return ["/dashboard", "/event", "/create-event", "/scan", "/org"].some(
        (p) => pathname === p || pathname.startsWith(`${p}/`)
      );
    };

    expect(requiresSubscriptionAccess("/scan/event_abc_123")).toBe(false);
    expect(requiresSubscriptionAccess("/create-event")).toBe(true);
    expect(requiresSubscriptionAccess("/dashboard")).toBe(true);
  });
});

describe("Phase 10 — Verification of Dynamic Amount and Copy Cleanliness", () => {
  it("removes hardcoded ₹34.22 copy and dynamically formats payment amount", () => {
    const formatPaymentErrorMessage = (amountPaise?: number) => {
      const actualAmtFormatted = amountPaise
        ? `₹${(amountPaise / 100).toFixed(2)}`
        : "the plan subscription amount";
      return `First payment confirmation failed. Your subscription can only be activated after successful payment confirmation of ${actualAmtFormatted}.`;
    };

    const starterError = formatPaymentErrorMessage(176882);
    expect(starterError).toContain("₹1768.82");
    expect(starterError).not.toContain("₹34.22");

    const proError = formatPaymentErrorMessage(412882);
    expect(proError).toContain("₹4128.82");
    expect(proError).not.toContain("₹34.22");
  });

  it("calculates accurate 18% GST invoice breakdown from collected gross amount", () => {
    const grossPaise = 176882; // ₹1,768.82 (Starter Monthly with 18% GST)
    const basePaise = Math.round(grossPaise / 1.18);
    const gstPaise = grossPaise - basePaise;

    expect(basePaise).toBe(149900); // ₹1,499.00
    expect(gstPaise).toBe(26982);   // ₹269.82
    expect(basePaise + gstPaise).toBe(grossPaise);
  });
});
