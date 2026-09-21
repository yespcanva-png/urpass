import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserPlan } from "@/lib/plan";

describe("getUserPlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns pro plan and allows custom_pass_design when subscription has pro plan", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          status: "active",
          is_trial: false,
          trial_ends_at: null,
          plan: { slug: "pro" },
        },
      }),
    };

    const plan = await getUserPlan(mockSupabase, "user-pro");
    expect(plan.slug).toBe("pro");
    expect(plan.canUse("custom_pass_design")).toBe(true);
    expect(plan.canUse("remove_branding")).toBe(true);
    expect(plan.canUse("api_access")).toBe(true);
  });

  it("resolves pro plan from trial_plan when status is trialing and trial is active", async () => {
    const futureDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString();
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          status: "trialing",
          is_trial: true,
          trial_plan: "pro",
          trial_ends_at: futureDate,
          plan: null,
        },
      }),
    };

    const plan = await getUserPlan(mockSupabase, "user-trial-pro");
    expect(plan.slug).toBe("pro");
    expect(plan.canUse("custom_pass_design")).toBe(true);
  });

  it("falls back to free plan when trial has expired", async () => {
    const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          status: "trialing",
          is_trial: true,
          trial_plan: "pro",
          trial_ends_at: pastDate,
          plan: null,
        },
      }),
    };

    const plan = await getUserPlan(mockSupabase, "user-expired-trial");
    expect(plan.slug).toBe("free");
    expect(plan.canUse("custom_pass_design")).toBe(false);
  });

  it("returns free plan and disallows custom_pass_design when user is on starter plan", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          status: "active",
          is_trial: false,
          trial_ends_at: null,
          plan: { slug: "starter" },
        },
      }),
    };

    const plan = await getUserPlan(mockSupabase, "user-starter");
    expect(plan.slug).toBe("starter");
    expect(plan.canUse("custom_pass_design")).toBe(false);
    expect(plan.canUse("csv_import")).toBe(true);
  });

  it("returns free plan and disallows custom_pass_design when no subscription is found", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null }),
    };

    const plan = await getUserPlan(mockSupabase, "user-free");
    expect(plan.slug).toBe("free");
    expect(plan.canUse("custom_pass_design")).toBe(false);
  });
});
