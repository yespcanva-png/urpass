import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Next.js & external dependencies ─────────────────────────────────────────
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/plan", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/plan")>();
  return {
    ...actual,
    getUserPlan: vi.fn(),
  };
});

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getUserPlan } from "@/lib/plan";
import {
  isFeatureEnabled,
  getEventFeaturesConfig,
  validateFeatureEntitlement,
  assertFeatureEnabled,
  FEATURE_FLAG_DEFINITIONS,
  CORE_FEATURES,
  type EventLike,
} from "@/lib/feature-flags";
import {
  updateEventFeatureFlag,
  getEventFeatureFlagsState,
  executeFeatureGuardedMutation,
} from "@/app/actions/event-features";

describe("Test 00: Event Feature-Flag Foundation & Multi-Tenant Governance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── 1. Existing events continue their normal workflow ───────────────────────────
  describe("1. Existing events continue their normal workflow", () => {
    it("legacy unconfigured events continue to have all core features enabled", () => {
      const legacyEvent: EventLike = {
        id: "legacy-event-001",
        organizer_id: "org-1",
        name: "Legacy Tech Conference 2026",
        custom_pass_design: null,
      };

      // All core features must remain active for legacy unconfigured events
      expect(isFeatureEnabled(legacyEvent, "public_registration")).toBe(true);
      expect(isFeatureEnabled(legacyEvent, "pass_issuance")).toBe(true);
      expect(isFeatureEnabled(legacyEvent, "standard_checkin")).toBe(true);
      expect(isFeatureEnabled(legacyEvent, "basic_ticketing")).toBe(true);
      expect(isFeatureEnabled(legacyEvent, "core_analytics")).toBe(true);

      const config = getEventFeaturesConfig(legacyEvent);
      expect(config.version).toBe(1);
      expect(config.features).toEqual({});
    });

    it("core features remain active even if custom_pass_design contains empty or unrelated object", () => {
      const eventWithDesign: EventLike = {
        id: "legacy-event-002",
        organizer_id: "org-1",
        name: "Annual Music Fest",
        custom_pass_design: {
          primaryColor: "#DC2626",
          template: "dark",
        },
      };

      expect(isFeatureEnabled(eventWithDesign, "public_registration")).toBe(true);
      expect(isFeatureEnabled(eventWithDesign, "standard_checkin")).toBe(true);
    });
  });

  // ── 2. Every new feature is initially disabled unless enabled via migration ─────
  describe("2. Every new feature is initially disabled unless explicitly enabled through migration policy", () => {
    it("new features default to disabled (false) for unconfigured events", () => {
      const freshEvent: EventLike = {
        id: "fresh-event-003",
        organizer_id: "org-1",
        name: "Campus Hackathon 2026",
        custom_pass_design: null,
      };

      expect(isFeatureEnabled(freshEvent, "ai_agenda")).toBe(false);
      expect(isFeatureEnabled(freshEvent, "face_checkin")).toBe(false);
      expect(isFeatureEnabled(freshEvent, "sponsor_deliverables")).toBe(false);
      expect(isFeatureEnabled(freshEvent, "b2b_matchmaking")).toBe(false);
      expect(isFeatureEnabled(freshEvent, "custom_domain")).toBe(false);
      expect(isFeatureEnabled(freshEvent, "advanced_analytics")).toBe(false);
      expect(isFeatureEnabled(freshEvent, "webhooks")).toBe(false);
    });

    it("respects migration policy when dynamic grandfathering is specified", () => {
      const legacyCohortEvent: EventLike = {
        id: "cohort-event-004",
        organizer_id: "org-1",
        name: "Grandfathered Event",
        created_at: "2026-01-01T00:00:00Z",
      };

      // Simulate a custom feature with migration policy
      const customFlagDef = {
        ...FEATURE_FLAG_DEFINITIONS.offline_mesh_sync,
        migrationPolicy: (event: EventLike) => {
          return Boolean(event.created_at && new Date(event.created_at) < new Date("2026-06-01"));
        },
      };

      FEATURE_FLAG_DEFINITIONS.offline_mesh_sync.migrationPolicy = customFlagDef.migrationPolicy;
      expect(isFeatureEnabled(legacyCohortEvent, "offline_mesh_sync")).toBe(true);

      const newCohortEvent: EventLike = {
        id: "cohort-event-005",
        organizer_id: "org-1",
        created_at: "2026-10-01T00:00:00Z",
      };
      expect(isFeatureEnabled(newCohortEvent, "offline_mesh_sync")).toBe(false);
    });
  });

  // ── 3. Organizer A cannot enable or alter Organizer B's event features ──────────
  describe("3. Organizer A cannot enable or alter Organizer B's event features", () => {
    it("blocks cross-organizer mutation attempts and returns unauthorized error", async () => {
      const mockSupabase = {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "organizer-A" } } }) },
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const mockAdminDb = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  id: "event-B",
                  organizer_id: "organizer-B", // Belongs to Organizer B
                  organization_id: null,
                  custom_pass_design: null,
                },
                error: null,
              }),
            };
          }
          return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() };
        }),
      };
      vi.mocked(createAdminClient).mockReturnValue(mockAdminDb as any);

      const res = await updateEventFeatureFlag("event-B", "sponsor_deliverables", true);

      expect(res).toEqual({
        error: "Unauthorized: You do not have permission to modify this event's feature flags.",
      });
    });

    it("allows active organization owner/admin to update organization event features", async () => {
      const mockSupabase = {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "org-admin-user" } } }) },
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      vi.mocked(getUserPlan).mockResolvedValue({
        slug: "business",
        canUse: () => true,
        getLimit: () => 999999,
        maxEvents: 999999,
        maxAttendees: 10000,
        unlimited: true,
        canCSV: true,
        canExport: true,
        canRemoveBranding: true,
        canUseAPI: true,
        canCreatePaidEvents: true,
        canCreateOrganizations: true,
      });

      const updateMock = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });

      const mockAdminDb = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  id: "event-org-1",
                  organizer_id: "org-founder",
                  organization_id: "org-enterprise-id",
                  custom_pass_design: null,
                },
                error: null,
              }),
              update: updateMock,
            };
          }
          if (table === "organization_members") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              maybeSingle: vi.fn().mockResolvedValue({
                data: { role: "admin", status: "active" },
                error: null,
              }),
            };
          }
          return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() };
        }),
      };
      vi.mocked(createAdminClient).mockReturnValue(mockAdminDb as any);

      const res = await updateEventFeatureFlag("event-org-1", "sponsor_deliverables", true);
      expect(res.success).toBe(true);
      expect(res.enabled).toBe(true);
      expect(updateMock).toHaveBeenCalled();
    });
  });

  // ── 4. A subscription without entitlement cannot activate restricted features ───
  describe("4. A subscription without entitlement cannot activate restricted features", () => {
    it("blocks Free tier user from activating custom_pass_design and advanced_analytics", async () => {
      const freePlan = { slug: "free", tier: "FREE" };

      const check1 = validateFeatureEntitlement(freePlan, "custom_pass_design");
      expect(check1.valid).toBe(false);
      expect(check1.error).toContain("requires an upgraded plan");

      const check2 = validateFeatureEntitlement(freePlan, "custom_domain");
      expect(check2.valid).toBe(false);
      expect(check2.error).toContain("requires an upgraded plan");

      const check3 = validateFeatureEntitlement(freePlan, "webhooks");
      expect(check3.valid).toBe(false);
    });

    it("allows Pro or Business tier user to activate entitled features", async () => {
      const proPlan = { slug: "pro", tier: "PRO" };
      const checkProPass = validateFeatureEntitlement(proPlan, "custom_pass_design");
      expect(checkProPass.valid).toBe(true);

      const businessPlan = { slug: "business", tier: "BUSINESS" };
      const checkWebhooks = validateFeatureEntitlement(businessPlan, "webhooks");
      expect(checkWebhooks.valid).toBe(true);

      const checkCustomDomain = validateFeatureEntitlement(businessPlan, "custom_domain");
      expect(checkCustomDomain.valid).toBe(true);
    });

    it("server action rejects activation with entitlement error when user is on Free tier", async () => {
      const mockSupabase = {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-free" } } }) },
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      vi.mocked(getUserPlan).mockResolvedValue({
        slug: "free",
        canUse: () => false,
        getLimit: () => 100,
        maxEvents: 2,
        maxAttendees: 100,
        unlimited: false,
        canCSV: false,
        canExport: false,
        canRemoveBranding: false,
        canUseAPI: false,
        canCreatePaidEvents: false,
        canCreateOrganizations: false,
      });

      const mockAdminDb = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  id: "event-free-owner",
                  organizer_id: "user-free",
                  organization_id: null,
                  custom_pass_design: null,
                },
                error: null,
              }),
            };
          }
          return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() };
        }),
      };
      vi.mocked(createAdminClient).mockReturnValue(mockAdminDb as any);

      const res = await updateEventFeatureFlag("event-free-owner", "custom_pass_design", true);
      expect(res.error).toContain("requires an upgraded plan");
      expect(res.success).toBeUndefined();
    });
  });

  // ── 5. Disabling one feature does not disable unrelated functionality ───────────
  describe("5. Disabling one feature does not disable unrelated functionality", () => {
    it("toggling a single feature leaves other features and core features intact", () => {
      const event: EventLike = {
        id: "multi-feature-event",
        organizer_id: "user-1",
        custom_pass_design: {
          _featureFlags: {
            features: {
              sponsor_deliverables: true,
              ai_agenda: true,
              face_checkin: false,
            },
            version: 3,
            updatedAt: "2026-10-09T12:00:00Z",
          },
        },
      };

      expect(isFeatureEnabled(event, "sponsor_deliverables")).toBe(true);
      expect(isFeatureEnabled(event, "ai_agenda")).toBe(true);
      expect(isFeatureEnabled(event, "face_checkin")).toBe(false);

      // Core functionality remains unaffected
      expect(isFeatureEnabled(event, "public_registration")).toBe(true);
      expect(isFeatureEnabled(event, "standard_checkin")).toBe(true);

      // Simulate updating ai_agenda to false
      const updatedEvent: EventLike = {
        ...event,
        custom_pass_design: {
          ...event.custom_pass_design,
          _featureFlags: {
            features: {
              sponsor_deliverables: true,
              ai_agenda: false, // only this flag modified
              face_checkin: false,
            },
            version: 4,
            updatedAt: "2026-10-09T12:05:00Z",
          },
        },
      };

      expect(isFeatureEnabled(updatedEvent, "ai_agenda")).toBe(false);
      expect(isFeatureEnabled(updatedEvent, "sponsor_deliverables")).toBe(true); // Untouched
      expect(isFeatureEnabled(updatedEvent, "public_registration")).toBe(true); // Untouched
    });
  });

  // ── 6. Concurrent updates do not silently overwrite newer settings ──────────────
  describe("6. Concurrent updates do not silently overwrite newer settings", () => {
    it("detects optimistic concurrency conflicts when expectedVersion is stale", async () => {
      const mockSupabase = {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-organizer" } } }) },
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      // Event is currently at version 3 in the database
      const mockAdminDb = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  id: "event-concurrent",
                  organizer_id: "user-organizer",
                  custom_pass_design: {
                    _featureFlags: {
                      features: { b2b_matchmaking: true },
                      version: 3,
                      updatedAt: "2026-10-09T14:00:00Z",
                    },
                  },
                },
                error: null,
              }),
            };
          }
          return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() };
        }),
      };
      vi.mocked(createAdminClient).mockReturnValue(mockAdminDb as any);

      // Caller sends a stale expectedVersion of 2 (competing write occurred)
      const res = await updateEventFeatureFlag("event-concurrent", "b2b_matchmaking", false, 2);

      expect(res.conflict).toBe(true);
      expect(res.error).toContain("Conflict: Event feature settings were modified by another session.");
      expect(res.config?.version).toBe(3);
    });

    it("succeeds and increments version when expectedVersion matches current version", async () => {
      const mockSupabase = {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-organizer" } } }) },
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      vi.mocked(getUserPlan).mockResolvedValue({
        slug: "pro",
        canUse: () => true,
        getLimit: () => 999999,
        maxEvents: 999999,
        maxAttendees: 2500,
        unlimited: true,
        canCSV: true,
        canExport: true,
        canRemoveBranding: true,
        canUseAPI: true,
        canCreatePaidEvents: true,
        canCreateOrganizations: true,
      });

      let savedDesign: any = null;
      const mockAdminDb = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  id: "event-concurrent",
                  organizer_id: "user-organizer",
                  custom_pass_design: {
                    _featureFlags: {
                      features: { sponsor_deliverables: true },
                      version: 2,
                      updatedAt: "2026-10-09T14:00:00Z",
                    },
                  },
                },
                error: null,
              }),
              update: vi.fn().mockImplementation((payload: any) => {
                savedDesign = payload.custom_pass_design;
                return { eq: vi.fn().mockResolvedValue({ error: null }) };
              }),
            };
          }
          return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() };
        }),
      };
      vi.mocked(createAdminClient).mockReturnValue(mockAdminDb as any);

      const res = await updateEventFeatureFlag("event-concurrent", "sponsor_deliverables", false, 2);

      expect(res.success).toBe(true);
      expect(res.config?.version).toBe(3);
      expect(res.config?.features.sponsor_deliverables).toBe(false);
      expect(savedDesign._featureFlags.version).toBe(3);
    });
  });

  // ── 7. Feature-disabled events cannot access new mutation endpoints ─────────────
  describe("7. Feature-disabled events cannot access new mutation endpoints through direct API requests", () => {
    it("assertFeatureEnabled returns error guard for disabled features", () => {
      const event: EventLike = {
        id: "event-guarded",
        organizer_id: "user-1",
        custom_pass_design: {
          _featureFlags: {
            features: { b2b_matchmaking: false },
            version: 1,
            updatedAt: "2026-10-09T10:00:00Z",
          },
        },
      };

      const guard = assertFeatureEnabled(event, "b2b_matchmaking");
      expect(guard.enabled).toBe(false);
      expect(guard.error).toContain("FEATURE_DISABLED");
    });

    it("executeFeatureGuardedMutation blocks mutations when feature flag is disabled", async () => {
      const mockSupabase = {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }) },
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const mockAdminDb = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: {
              id: "event-api-guard",
              organizer_id: "user-1",
              custom_pass_design: {
                _featureFlags: {
                  features: { ai_agenda: false }, // explicitly disabled
                },
              },
            },
          }),
        }),
      };
      vi.mocked(createAdminClient).mockReturnValue(mockAdminDb as any);

      const res = await executeFeatureGuardedMutation("event-api-guard", "ai_agenda", {
        scheduleName: "Day 1 Multi-Track",
      });

      expect(res.error).toContain("FEATURE_DISABLED");
      expect(res.success).toBeUndefined();
    });

    it("executeFeatureGuardedMutation permits execution once feature is enabled", async () => {
      const mockSupabase = {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }) },
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const mockAdminDb = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: {
              id: "event-api-guard",
              organizer_id: "user-1",
              custom_pass_design: {
                _featureFlags: {
                  features: { ai_agenda: true }, // enabled
                },
              },
            },
          }),
        }),
      };
      vi.mocked(createAdminClient).mockReturnValue(mockAdminDb as any);

      const res = await executeFeatureGuardedMutation("event-api-guard", "ai_agenda", {
        scheduleName: "Day 1 Multi-Track",
      });

      expect(res.success).toBe(true);
      expect((res.result as any).action).toContain("ai_agenda");
    });
  });

  // ── 8. Disabling a module with historical records does not delete those records ───
  describe("8. Disabling a module with historical records does not delete those records", () => {
    it("disabling a module performs non-destructive metadata update without cascade deletion", async () => {
      const mockSupabase = {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-organizer" } } }) },
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      vi.mocked(getUserPlan).mockResolvedValue({
        slug: "pro",
        canUse: () => true,
        getLimit: () => 999999,
        maxEvents: 999999,
        maxAttendees: 2500,
        unlimited: true,
        canCSV: true,
        canExport: true,
        canRemoveBranding: true,
        canUseAPI: true,
        canCreatePaidEvents: true,
        canCreateOrganizations: true,
      });

      const deleteMock = vi.fn();
      const updateMock = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });

      const mockAdminDb = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  id: "event-historical",
                  organizer_id: "user-organizer",
                  custom_pass_design: {
                    template: "vip_gold",
                    _featureFlags: {
                      features: { sponsor_deliverables: true },
                      version: 1,
                    },
                  },
                },
                error: null,
              }),
              update: updateMock,
              delete: deleteMock,
            };
          }
          if (table === "attendees" || table === "passes" || table === "check_ins") {
            return {
              delete: deleteMock,
            };
          }
          return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() };
        }),
      };
      vi.mocked(createAdminClient).mockReturnValue(mockAdminDb as any);

      // Disable sponsor deliverables module
      const res = await updateEventFeatureFlag("event-historical", "sponsor_deliverables", false);

      expect(res.success).toBe(true);
      // Verify no delete calls occurred on any table
      expect(deleteMock).not.toHaveBeenCalled();
      // Verify update only modified event custom_pass_design metadata
      expect(updateMock).toHaveBeenCalled();
      const payload = updateMock.mock.calls[0][0];
      expect(payload.custom_pass_design.template).toBe("vip_gold"); // Historical design intact
      expect(payload.custom_pass_design._featureFlags.features.sponsor_deliverables).toBe(false);
    });
  });
});
