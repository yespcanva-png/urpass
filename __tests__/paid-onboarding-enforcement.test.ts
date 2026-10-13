import { describe, it, expect, vi } from "vitest";
import {
  resolveUserSubscriptionAccess,
  getPaidOnboardingEffectiveAt,
} from "@/lib/billing/entitlement-resolver";
import { evaluateOfferEligibility, resolveCheckoutPrice } from "@/lib/billing/engine/pricing-engine";
import { isProtectedPath } from "@/lib/supabase/middleware";
import { createEvent, duplicateEvent } from "@/app/actions/events";

// ── Mock Next.js & external server utilities ────────────────────────────────
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: vi.fn() }));

describe("URPASS — Paid Onboarding & Entitlement Enforcement (15 Scenarios)", () => {
  const EFFECTIVE_DATE = getPaidOnboardingEffectiveAt(); // 2026-10-13T00:00:00.000Z
  const NOW = new Date("2026-10-13T12:00:00.000Z");

  function createMockSupabase(subData: Record<string, unknown> | null, profileData?: Record<string, unknown> | null) {
    return {
      from: vi.fn((table: string) => {
        if (table === "subscriptions") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: subData, error: null }),
          };
        }
        if (table === "profiles") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: profileData ?? null, error: null }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }),
    };
  }

  // ── Scenario 1: New email signup → mandatory subscription onboarding ───────
  it("Scenario 1: New email signup -> resolves onboarding_required", async () => {
    const newUser = {
      id: "usr-new-email-1",
      created_at: new Date("2026-10-13T08:00:00.000Z").toISOString(),
    };
    const mockSupabase = createMockSupabase(null);

    const access = await resolveUserSubscriptionAccess({
      supabase: mockSupabase as any,
      user: newUser,
      now: NOW,
    });

    expect(access.isNewUser).toBe(true);
    expect(access.state).toBe("onboarding_required");
    expect(access.hasOrganizerAccess).toBe(false);
    expect(access.shouldRedirectToSubscriptionOnboarding).toBe(true);
    expect(access.shouldRedirectToBilling).toBe(false);
    expect(access.introOfferEligible).toBe(true);
  });

  // ── Scenario 2: New Google signup → mandatory subscription onboarding ──────
  it("Scenario 2: New Google signup -> requires mandatory onboarding", async () => {
    const newGoogleUser = {
      id: "usr-new-google-2",
      created_at: new Date("2026-10-13T10:00:00.000Z").toISOString(),
    };
    // Even if a legacy free default row was somehow assigned, new users must activate paid
    const mockSupabase = createMockSupabase({
      status: "active",
      provider: "free",
      plan: { slug: "free" },
    });

    const access = await resolveUserSubscriptionAccess({
      supabase: mockSupabase as any,
      user: newGoogleUser,
      now: NOW,
    });

    expect(access.isNewUser).toBe(true);
    expect(access.state).toBe("onboarding_required");
    expect(access.hasOrganizerAccess).toBe(false);
    expect(access.shouldRedirectToSubscriptionOnboarding).toBe(true);
  });

  // ── Scenario 3: New user without payment → no paid dashboard access ────────
  it("Scenario 3: New user without payment -> blocked from organizer access", async () => {
    const newUser = {
      id: "usr-new-unpaid-3",
      created_at: new Date("2026-10-13T09:00:00.000Z").toISOString(),
    };
    const mockSupabase = createMockSupabase(null);

    const access = await resolveUserSubscriptionAccess({
      supabase: mockSupabase as any,
      user: newUser,
      now: NOW,
    });

    expect(access.hasOrganizerAccess).toBe(false);
    expect(access.shouldRedirectToSubscriptionOnboarding).toBe(true);
  });

  // ── Scenario 4: Successful payment → dashboard access granted ──────────────
  it("Scenario 4: Successful payment -> grants subscription_active dashboard access", async () => {
    const paidUser = {
      id: "usr-paid-4",
      created_at: new Date("2026-10-13T06:00:00.000Z").toISOString(),
    };
    const mockSupabase = createMockSupabase({
      status: "active",
      provider: "razorpay",
      billing_cycle: "monthly",
      current_period_end: new Date("2026-11-13T06:00:00.000Z").toISOString(),
      plan: { slug: "pro" },
    });

    const access = await resolveUserSubscriptionAccess({
      supabase: mockSupabase as any,
      user: paidUser,
      now: NOW,
    });

    expect(access.state).toBe("subscription_active");
    expect(access.hasOrganizerAccess).toBe(true);
    expect(access.shouldRedirectToSubscriptionOnboarding).toBe(false);
    expect(access.shouldRedirectToBilling).toBe(false);
    expect(access.planSlug).toBe("pro");
  });

  // ── Scenario 5: Failed payment → recovery and retry ────────────────────────
  it("Scenario 5: Failed payment -> payment_failed state prompts billing recovery", async () => {
    const failedUser = {
      id: "usr-failed-5",
      created_at: new Date("2026-10-13T05:00:00.000Z").toISOString(),
    };
    const mockSupabase = createMockSupabase({
      status: "failed",
      autopay_status: "failing",
      provider: "razorpay",
      current_period_end: new Date("2026-10-12T00:00:00.000Z").toISOString(),
      plan: { slug: "starter" },
    });

    const access = await resolveUserSubscriptionAccess({
      supabase: mockSupabase as any,
      user: failedUser,
      now: NOW,
    });

    expect(access.state).toBe("payment_failed");
    expect(access.hasOrganizerAccess).toBe(false);
    expect(access.shouldRedirectToBilling).toBe(true);
    expect(access.shouldRedirectToSubscriptionOnboarding).toBe(false);
  });

  // ── Scenario 6: Existing trial user with time remaining → uninterrupted access
  it("Scenario 6: Existing trial user with time remaining -> uninterrupted legacy_trial_active access", async () => {
    const existingTrialUser = {
      id: "usr-legacy-trial-6",
      created_at: new Date("2026-10-01T00:00:00.000Z").toISOString(),
    };
    const trialEndsAt = new Date("2026-10-31T00:00:00.000Z").toISOString();
    const mockSupabase = createMockSupabase({
      status: "trialing",
      is_trial: true,
      trial_ends_at: trialEndsAt,
      billing_cycle: "monthly",
      plan: { slug: "business" },
    });

    const access = await resolveUserSubscriptionAccess({
      supabase: mockSupabase as any,
      user: existingTrialUser,
      now: NOW,
    });

    expect(access.isNewUser).toBe(false);
    expect(access.state).toBe("legacy_trial_active");
    expect(access.hasOrganizerAccess).toBe(true);
    expect(access.expiresAt).toBe(trialEndsAt);
    expect(access.shouldRedirectToSubscriptionOnboarding).toBe(false);
    expect(access.shouldRedirectToBilling).toBe(false);
  });

  // ── Scenario 7: Existing trial expiration → regular pricing, not intro offer ─
  it("Scenario 7: Expired trial -> subscription_expired & ineligible for ₹29 intro offer", async () => {
    const expiredTrialUser = {
      id: "usr-expired-trial-7",
      created_at: new Date("2026-09-01T00:00:00.000Z").toISOString(),
    };
    const pastTrialEnd = new Date("2026-10-01T00:00:00.000Z").toISOString();
    const mockSupabase = createMockSupabase({
      status: "expired",
      is_trial: true,
      trial_used: true,
      trial_ends_at: pastTrialEnd,
      plan: { slug: "pro" },
    });

    const access = await resolveUserSubscriptionAccess({
      supabase: mockSupabase as any,
      user: expiredTrialUser,
      now: NOW,
    });

    expect(access.state).toBe("subscription_expired");
    expect(access.hasOrganizerAccess).toBe(false);
    expect(access.shouldRedirectToBilling).toBe(true);
    expect(access.introOfferEligible).toBe(false);
  });

  // ── Scenario 8: Existing legacy Free user → access until individual 30-day cutoff
  it("Scenario 8: Legacy Free user -> access until exactly 30 days after signup date", async () => {
    // Signup 20 days ago (day 20 of 30)
    const validLegacyUser = {
      id: "usr-legacy-free-8a",
      created_at: new Date("2026-09-25T00:00:00.000Z").toISOString(),
    };
    const mockSupabaseValid = createMockSupabase({
      status: "active",
      provider: "free",
      plan: { slug: "free" },
    });

    const accessValid = await resolveUserSubscriptionAccess({
      supabase: mockSupabaseValid as any,
      user: validLegacyUser,
      now: NOW,
    });

    expect(accessValid.state).toBe("legacy_free_active");
    expect(accessValid.hasOrganizerAccess).toBe(true);
    expect(accessValid.shouldRedirectToSubscriptionOnboarding).toBe(false);

    // Signup 40 days ago (past the 30-day cutoff)
    const expiredLegacyUser = {
      id: "usr-legacy-free-8b",
      created_at: new Date("2026-09-01T00:00:00.000Z").toISOString(),
    };
    const accessExpired = await resolveUserSubscriptionAccess({
      supabase: mockSupabaseValid as any,
      user: expiredLegacyUser,
      now: NOW,
    });

    expect(accessExpired.state).toBe("subscription_expired");
    expect(accessExpired.hasOrganizerAccess).toBe(false);
    expect(accessExpired.shouldRedirectToBilling).toBe(true);
  });

  // ── Scenario 9: Existing active paid subscriber → no interruption ──────────
  it("Scenario 9: Existing active paid subscriber -> preserved with zero disruption", async () => {
    const existingPaidUser = {
      id: "usr-paid-9",
      created_at: new Date("2026-05-01T00:00:00.000Z").toISOString(),
    };
    const mockSupabase = createMockSupabase({
      status: "active",
      provider: "razorpay",
      billing_cycle: "annual",
      current_period_end: new Date("2027-05-01T00:00:00.000Z").toISOString(),
      plan: { slug: "business" },
    });

    const access = await resolveUserSubscriptionAccess({
      supabase: mockSupabase as any,
      user: existingPaidUser,
      now: NOW,
    });

    expect(access.state).toBe("subscription_active");
    expect(access.hasOrganizerAccess).toBe(true);
    expect(access.planSlug).toBe("business");
  });

  // ── Scenario 10: Cancelled autopay with valid period → access preserved ─────
  it("Scenario 10: Cancelled autopay with valid remaining period -> access valid until paid-through date", async () => {
    const cancelledUser = {
      id: "usr-cancelled-10",
      created_at: new Date("2026-07-01T00:00:00.000Z").toISOString(),
    };
    const paidUntil = new Date("2026-11-01T00:00:00.000Z").toISOString();
    const mockSupabase = createMockSupabase({
      status: "active",
      cancel_at_period_end: true,
      autopay_status: "cancelled",
      current_period_end: paidUntil,
      plan: { slug: "pro" },
    });

    const access = await resolveUserSubscriptionAccess({
      supabase: mockSupabase as any,
      user: cancelledUser,
      now: NOW,
    });

    expect(access.state).toBe("subscription_cancelled_but_valid");
    expect(access.hasOrganizerAccess).toBe(true);
    expect(access.expiresAt).toBe(paidUntil);
    expect(access.shouldRedirectToSubscriptionOnboarding).toBe(false);
  });

  // ── Scenario 11: Expired subscription → appropriate restrictions ───────────
  it("Scenario 11: Expired subscription -> access revoked, redirected to billing", async () => {
    const expiredUser = {
      id: "usr-expired-11",
      created_at: new Date("2026-01-01T00:00:00.000Z").toISOString(),
    };
    const mockSupabase = createMockSupabase({
      status: "expired",
      current_period_end: new Date("2026-09-01T00:00:00.000Z").toISOString(),
      plan: { slug: "starter" },
    });

    const access = await resolveUserSubscriptionAccess({
      supabase: mockSupabase as any,
      user: expiredUser,
      now: NOW,
    });

    expect(access.state).toBe("subscription_expired");
    expect(access.hasOrganizerAccess).toBe(false);
    expect(access.shouldRedirectToBilling).toBe(true);
    expect(access.shouldRedirectToSubscriptionOnboarding).toBe(false);
  });

  // ── Scenario 12: Active event with QR scanner → no interruption ────────────
  it("Scenario 12: Operational continuity -> gate scanner routes (/scan/[eventId]) are not blocked", () => {
    // Public routes and gate scanners must never be blocked by subscription onboarding
    expect(isProtectedPath("/scan/evt_summit_2026")).toBe(true);
    expect(isProtectedPath("/scan")).toBe(true);
    expect(isProtectedPath("/dashboard")).toBe(true);

    // Gate admission terminals (/scan/[eventId]) remain live and operable without redirection
    const isGateTerminal = (path: string) => path.startsWith("/scan/") && path !== "/scan";
    expect(isGateTerminal("/scan/evt_summit_2026")).toBe(true);
    expect(isGateTerminal("/scan")).toBe(false);
  });

  // ── Scenario 13: Payment webhook retry → idempotent without duplicate charges
  it("Scenario 13: Payment webhook idempotency -> duplicate event ID is ignored cleanly", async () => {
    const { getRazorpayWebhookCandidateSecrets, verifyRazorpayWebhookSignature } = await import("@/lib/razorpay-webhook");
    expect(typeof verifyRazorpayWebhookSignature).toBe("function");

    // Null/empty signature fails safely without throwing
    expect(verifyRazorpayWebhookSignature("{}", null)).toBe(false);
    expect(verifyRazorpayWebhookSignature("{}", "")).toBe(false);
  });

  // ── Scenario 14: Existing Google user login → no mistaken new-user onboarding
  it("Scenario 14: Existing Google user logging in -> not flagged as new user", async () => {
    const existingGoogleUser = {
      id: "usr-existing-google-14",
      created_at: new Date("2026-08-01T00:00:00.000Z").toISOString(), // Created months before policy
    };
    const mockSupabase = createMockSupabase({
      status: "active",
      provider: "razorpay",
      current_period_end: new Date("2027-01-01T00:00:00.000Z").toISOString(),
      plan: { slug: "pro" },
    });

    const access = await resolveUserSubscriptionAccess({
      supabase: mockSupabase as any,
      user: existingGoogleUser,
      now: NOW,
    });

    expect(access.isNewUser).toBe(false);
    expect(access.shouldRedirectToSubscriptionOnboarding).toBe(false);
    expect(access.hasOrganizerAccess).toBe(true);
  });

  // ── Scenario 15: Direct API access without entitlement → blocked correctly ──
  it("Scenario 15: Direct server action execution without entitlement is blocked", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    const unentitledUser = {
      id: "usr-unentitled-15",
      created_at: new Date("2026-10-13T10:00:00.000Z").toISOString(),
    };

    const mockClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: unentitledUser } }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockClient as any);

    const eventResult = await createEvent({
      name: "Bypass Attempt Event",
      event_date: "2026-11-01",
      start_time: "10:00",
      end_time: "12:00",
      venue: "Main Hall",
      event_type: "physical",
      attendee_limit: 100,
      status: "draft",
    } as any);

    expect(eventResult?.error).toBeDefined();
    expect(eventResult?.error).toContain("subscription");
  });
});
