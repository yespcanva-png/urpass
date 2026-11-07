import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAdminFrom = vi.fn();
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: mockAdminFrom,
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null }),
  })),
}));

import {
  getUserPlan,
  getEventEffectivePlan,
  canUseFeature,
  type PlanLimits,
} from "@/lib/plan";
import {
  EVENT_PASSES,
  isEventPassProFeature,
  isEventPassSlug,
} from "@/lib/billing/event-passes";
import {
  isFeatureEnabled,
  validateFeatureEntitlement,
} from "@/lib/feature-flags";

describe("Single Event Pass — Pro Plan Feature Override & Strict Restrictions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null }),
    });
  });
  describe("1. Pass Catalog & Capacity Tiers", () => {
    it("defines exact pass registration capacities advertised to organizers", () => {
      expect(EVENT_PASSES.event.registrations).toBe(250);
      expect(EVENT_PASSES.event_plus.registrations).toBe(1000);
      expect(EVENT_PASSES.event_pro.registrations).toBe(2500);

      expect(isEventPassSlug("event")).toBe(true);
      expect(isEventPassSlug("event_plus")).toBe(true);
      expect(isEventPassSlug("event_pro")).toBe(true);
      expect(isEventPassSlug("unlimited")).toBe(false);
    });

    it("identifies event-scoped Pro features vs account-level features", () => {
      // Event-scoped features that MUST be unlocked for that event
      expect(isEventPassProFeature("remove_branding")).toBe(true);
      expect(isEventPassProFeature("custom_pass_design")).toBe(true);
      expect(isEventPassProFeature("csv_import")).toBe(true);
      expect(isEventPassProFeature("csv_export")).toBe(true);
      expect(isEventPassProFeature("custom_fields_unlimited")).toBe(true);
      expect(isEventPassProFeature("standard_checkin")).toBe(true);
      expect(isEventPassProFeature("paid_events")).toBe(true);
      expect(isEventPassProFeature("advanced_analytics")).toBe(true);

      // Account-level features that MUST NOT be unlocked globally
      expect(isEventPassProFeature("custom_domain")).toBe(false);
      expect(isEventPassProFeature("cross_event_analytics")).toBe(false);
      expect(isEventPassProFeature("team_permissions_advanced")).toBe(false);
      expect(isEventPassProFeature("whatsapp_self_service")).toBe(false);
      expect(isEventPassProFeature("api_access")).toBe(false);
    });
  });

  describe("2. Base User Plan (Free Tier Baseline)", () => {
    it("enforces free tier restrictions for users without subscriptions", async () => {
      // Mock supabase client returning no active subscription
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              in: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
              }),
              maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }),
        }),
      };
      mockAdminFrom.mockImplementation((table: string) => mockSupabase.from(table));

      const plan: PlanLimits = await getUserPlan(mockSupabase, "user-free-123");

      expect(plan.slug).toBe("free");
      expect(plan.canUse("remove_branding")).toBe(false);
      expect(plan.canUse("custom_pass_design")).toBe(false);
      expect(plan.canUse("csv_import")).toBe(false);
      expect(plan.canUse("csv_export")).toBe(false);
      expect(plan.canUse("custom_fields_unlimited")).toBe(false);
      expect(plan.canRemoveBranding).toBe(false);
      expect(plan.canCSV).toBe(false);
      expect(plan.canExport).toBe(false);
      expect(plan.getLimit("custom_fields")).toBe(3);
      expect(plan.getLimit("events_per_month")).toBe(1);
      expect(plan.getLimit("organizer_seats")).toBe(1);

      // canUseFeature helper
      expect(canUseFeature(plan, "removeBranding")).toBe(false);
      expect(canUseFeature(plan, "customPassDesign")).toBe(false);
      expect(canUseFeature(plan, "csvImport")).toBe(false);
      expect(canUseFeature(plan, "csvExport")).toBe(false);
    });
  });

  describe("3. Single Event Pass Pro Plan Feature Override", () => {
    it("grants Pro features strictly to an event with an attached event pass", async () => {
      const mockEventWithPass = {
        id: "evt-wedding-2026",
        organizer_id: "user-free-123",
        event_pass_id: "pass-event-plus-999",
      };

      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({
                    data: mockEventWithPass,
                    error: null,
                  }),
                }),
              }),
            };
          }
          if (table === "event_passes") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({
                    data: {
                      id: "pass-event-plus-999",
                      pass_type: "event_plus",
                      registration_limit: 1000,
                      status: "attached",
                    },
                    error: null,
                  }),
                }),
              }),
            };
          }
          if (table === "subscriptions") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  in: vi.fn().mockReturnValue({
                    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                  }),
                  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
              }),
            };
          }
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
              }),
            }),
          };
        }),
      };
      mockAdminFrom.mockImplementation((table: string) => mockSupabase.from(table));

      const eventPlan = await getEventEffectivePlan(mockSupabase, mockEventWithPass);

      // ── Pro features granted for THIS event ──
      expect(eventPlan.isEventPass).toBe(true);
      expect(eventPlan.passType).toBe("event_plus");
      expect(eventPlan.basePlanSlug).toBe("free");
      expect(eventPlan.slug).toBe("pro");

      // 100% White-label (no watermark)
      expect(eventPlan.canUse("remove_branding")).toBe(true);
      expect(eventPlan.canRemoveBranding).toBe(true);
      expect(canUseFeature(eventPlan, "removeBranding")).toBe(true);

      // 0% platform ticket fee
      expect(eventPlan.platformFeePercent).toBe(0);

      // Sub-second QR gate scanners & analytics
      expect(eventPlan.canUse("standard_analytics")).toBe(true);

      // Custom pass designer & Pass Studio
      expect(eventPlan.canUse("custom_pass_design")).toBe(true);
      expect(canUseFeature(eventPlan, "customPassDesign")).toBe(true);

      // CSV import and export for this event
      expect(eventPlan.canUse("csv_import")).toBe(true);
      expect(eventPlan.canUse("csv_export")).toBe(true);
      expect(eventPlan.canCSV).toBe(true);
      expect(eventPlan.canExport).toBe(true);
      expect(canUseFeature(eventPlan, "csvImport")).toBe(true);
      expect(canUseFeature(eventPlan, "csvExport")).toBe(true);

      // Unlimited custom fields for this event
      expect(eventPlan.canUse("custom_fields_unlimited")).toBe(true);
      expect(eventPlan.getLimit("custom_fields")).toBe(Infinity);

      // Registration capacity elevated to pass limit (1,000)
      expect(eventPlan.getLimit("registrations_per_month")).toBe(1000);
      expect(eventPlan.maxAttendees).toBe(1000);

      // ── STRICT RESTRICTION: Global account limits MUST NOT be elevated ──
      // Organizer cannot create multiple events on Free plan (remains 1)
      expect(eventPlan.getLimit("events_per_month")).toBe(1);
      expect(eventPlan.maxEvents).toBe(1);

      // Organizer seats remain restricted to 1
      expect(eventPlan.getLimit("organizer_seats")).toBe(1);

      // Account-level features remain strictly FALSE
      expect(eventPlan.canUse("cross_event_analytics")).toBe(false);
      expect(eventPlan.canUse("custom_domain")).toBe(false);
      expect(eventPlan.canUse("team_permissions_advanced")).toBe(false);
      expect(eventPlan.canUse("whatsapp_self_service")).toBe(false);
      expect(eventPlan.canUseAPI).toBe(false);
      expect(eventPlan.canCreateOrganizations).toBe(false);
    });

    it("defaults to 250 registrations for standard event pass and 2,500 for event_pro", async () => {
      const mockEventStandard = {
        id: "evt-meetup",
        organizer_id: "user-free-123",
        event_pass_id: "pass-std",
      };

      const mockSupabaseStd = {
        from: vi.fn((table: string) => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              in: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: table === "event_passes" ? { id: "pass-std", pass_type: "event", registration_limit: 250, status: "attached" } : null,
                  error: null,
                }),
              }),
              maybeSingle: vi.fn().mockResolvedValue({
                data: table === "event_passes" ? { id: "pass-std", pass_type: "event", registration_limit: 250, status: "attached" } : null,
                error: null,
              }),
            }),
          }),
        })),
      };
      mockAdminFrom.mockImplementation((table: string) => mockSupabaseStd.from(table));

      const planStd = await getEventEffectivePlan(mockSupabaseStd, mockEventStandard);
      expect(planStd.getLimit("registrations_per_month")).toBe(250);
      expect(planStd.platformFeePercent).toBe(0);

      const mockEventPro = {
        id: "evt-summit",
        organizer_id: "user-free-123",
        event_pass_id: "pass-pro-1",
      };

      const mockSupabasePro = {
        from: vi.fn((table: string) => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              in: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: table === "event_passes" ? { id: "pass-pro-1", pass_type: "event_pro", registration_limit: 2500, status: "attached" } : null,
                  error: null,
                }),
              }),
              maybeSingle: vi.fn().mockResolvedValue({
                data: table === "event_passes" ? { id: "pass-pro-1", pass_type: "event_pro", registration_limit: 2500, status: "attached" } : null,
                error: null,
              }),
            }),
          }),
        })),
      };
      mockAdminFrom.mockImplementation((table: string) => mockSupabasePro.from(table));

      const planPro = await getEventEffectivePlan(mockSupabasePro, mockEventPro);
      expect(planPro.getLimit("registrations_per_month")).toBe(2500);
      expect(planPro.platformFeePercent).toBe(0);
    });
  });

  describe("4. Non-Pass Events for the Same User (Zero Leakage)", () => {
    it("ensures a second event without a pass does NOT inherit Pro features", async () => {
      const mockSecondEventWithoutPass = {
        id: "evt-regular-unlicensed",
        organizer_id: "user-free-123",
        event_pass_id: null,
      };

      const mockSupabase = {
        from: vi.fn((_table?: string) => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              in: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
              }),
              maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }),
        })),
      };
      mockAdminFrom.mockImplementation((table: string) => mockSupabase.from(table));

      const regularPlan = await getEventEffectivePlan(mockSupabase, mockSecondEventWithoutPass);

      expect(regularPlan.isEventPass).toBe(false);
      expect(regularPlan.slug).toBe("free");
      expect(regularPlan.canUse("remove_branding")).toBe(false);
      expect(regularPlan.canUse("custom_pass_design")).toBe(false);
      expect(regularPlan.canUse("csv_import")).toBe(false);
      expect(regularPlan.canUse("csv_export")).toBe(false);
      expect(regularPlan.canRemoveBranding).toBe(false);
      expect(regularPlan.canCSV).toBe(false);
      expect(regularPlan.canExport).toBe(false);
      expect(regularPlan.getLimit("custom_fields")).toBe(3);
      expect(regularPlan.getLimit("registrations_per_month")).toBe(100);
      expect(regularPlan.platformFeePercent).toBe(2.0); // Standard free platform fee applies
    });
  });

  describe("5. Feature Flags Evaluator (isFeatureEnabled)", () => {
    it("enables event-scoped Pro feature flags when event_pass_id is present", () => {
      const eventWithPass = {
        id: "evt-123",
        organizer_id: "usr-456",
        event_pass_id: "pass-789",
      };

      // Event-scoped flags
      expect(isFeatureEnabled(eventWithPass, "white_label_portal")).toBe(true);
      expect(isFeatureEnabled(eventWithPass, "custom_pass_design")).toBe(true);
      expect(isFeatureEnabled(eventWithPass, "csv_management")).toBe(true);
      expect(isFeatureEnabled(eventWithPass, "advanced_entry_tracking")).toBe(true);
      expect(isFeatureEnabled(eventWithPass, "offline_scanning")).toBe(true);
      expect(isFeatureEnabled(eventWithPass, "standard_checkin")).toBe(true);

      // Account-level / unrelated flags remain disabled
      expect(isFeatureEnabled(eventWithPass, "custom_domain")).toBe(false);
      expect(isFeatureEnabled(eventWithPass, "ai_agenda")).toBe(false);
      expect(isFeatureEnabled(eventWithPass, "b2b_matchmaking")).toBe(false);
      expect(isFeatureEnabled(eventWithPass, "sponsor_deliverables")).toBe(false);
    });

    it("keeps Pro flags disabled for an event without event_pass_id", () => {
      const regularEvent = {
        id: "evt-regular",
        organizer_id: "usr-456",
        event_pass_id: null,
      };

      expect(isFeatureEnabled(regularEvent, "white_label_portal")).toBe(false);
      expect(isFeatureEnabled(regularEvent, "custom_pass_design")).toBe(false);
      expect(isFeatureEnabled(regularEvent, "csv_management")).toBe(false);
      expect(isFeatureEnabled(regularEvent, "standard_checkin")).toBe(true); // Core feature remains active
    });

    it("validates feature entitlement against EventEffectivePlan", () => {
      const mockEventPlan: any = {
        slug: "pro",
        isEventPass: true,
        canUse: (feature: string) => feature === "remove_branding",
      };

      const result = validateFeatureEntitlement(mockEventPlan, "white_label_portal");
      expect(result.valid).toBe(true);
    });
  });
});
