import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserPlan } from "@/lib/plan";
import { eventSchema } from "@/lib/validations/event";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null }),
  })),
}));

describe("Branding & Pro Trial Entitlements", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Pro Trial Subscription Detection", () => {
    it("unlocks remove_branding and custom_pass_design when user is on an active 30-day Pro trial", async () => {
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
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

      const plan = await getUserPlan(mockSupabase, "user-pro-trial");
      expect(plan.slug).toBe("pro");
      expect(plan.canUse("remove_branding")).toBe(true);
      expect(plan.canUse("custom_pass_design")).toBe(true);
      expect(plan.canRemoveBranding).toBe(true);
      expect(plan.canUse("api_access")).toBe(true);
      expect(plan.canUse("advanced_analytics")).toBe(true);
    });

    it("unlocks branding when status is active with plan pro", async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: {
            status: "active",
            is_trial: false,
            plan: { slug: "pro" },
          },
        }),
      };

      const plan = await getUserPlan(mockSupabase, "user-pro-paid");
      expect(plan.slug).toBe("pro");
      expect(plan.canUse("remove_branding")).toBe(true);
      expect(plan.canUse("custom_pass_design")).toBe(true);
      expect(plan.canRemoveBranding).toBe(true);
    });

    it("locks branding features for free plan users", async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: null,
        }),
      };

      const plan = await getUserPlan(mockSupabase, "user-free");
      expect(plan.slug).toBe("free");
      expect(plan.canUse("remove_branding")).toBe(false);
      expect(plan.canUse("custom_pass_design")).toBe(false);
      expect(plan.canRemoveBranding).toBe(false);
    });

    it("locks branding features when trial is expired", async () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
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

      const plan = await getUserPlan(mockSupabase, "user-trial-expired");
      expect(plan.slug).toBe("free");
      expect(plan.canUse("remove_branding")).toBe(false);
      expect(plan.canUse("custom_pass_design")).toBe(false);
      expect(plan.canRemoveBranding).toBe(false);
    });
  });

  describe("Event Schema Branding Validation", () => {
    const validBaseEvent = {
      name: "Tech Summit 2026",
      event_date: "2026-11-15",
      start_time: "09:00",
      end_time: "17:00",
      venue: "Convention Center, London",
      attendee_limit: 500,
      description: "Annual Tech Innovation Summit",
      status: "active" as const,
      application_enabled: true,
      auto_approve: true,
      is_paid_event: false,
      ticket_price: 0,
      event_type: "physical" as const,
    };

    it("validates valid event branding fields successfully", () => {
      const result = eventSchema.safeParse({
        ...validBaseEvent,
        event_brand_color: "#4F46E5",
        event_logo_url: "https://images.unsplash.com/photo-12345.png",
        hide_branding: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.event_brand_color).toBe("#4F46E5");
        expect(result.data.event_logo_url).toBe("https://images.unsplash.com/photo-12345.png");
        expect(result.data.hide_branding).toBe(true);
      }
    });

    it("accepts optional/empty branding fields gracefully", () => {
      const result = eventSchema.safeParse({
        ...validBaseEvent,
        event_brand_color: "",
        event_logo_url: "",
        hide_branding: false,
      });

      expect(result.success).toBe(true);
    });

    it("rejects non-hex color strings", () => {
      const result = eventSchema.safeParse({
        ...validBaseEvent,
        event_brand_color: "blue-color",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toMatch(/valid hex color/i);
      }
    });

    it("rejects non-https logo URLs", () => {
      const result = eventSchema.safeParse({
        ...validBaseEvent,
        event_logo_url: "http://insecure.com/logo.png",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toMatch(/valid https url/i);
      }
    });
  });
});
