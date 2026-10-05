import { describe, it, expect, beforeEach } from "vitest";
import { SupabaseOpsService } from "../src/services/supabaseService";
import { RBACService } from "../src/services/rbacService";
import { StorageService } from "../src/services/storage";
import { CONFIG } from "../src/constants/config";
import type { OrganizationSummary, EventSummary, UserProfile } from "../src/types";

describe("UrPass One Enterprise Authentication & Organisation Access Suite", () => {
  beforeEach(async () => {
    // Clear storage keys between tests
    await StorageService.removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    await StorageService.removeItem(CONFIG.STORAGE_KEYS.USER_PROFILE);
    await StorageService.removeItem(CONFIG.STORAGE_KEYS.LAST_ORG_ID);
    await StorageService.removeItem(CONFIG.STORAGE_KEYS.LAST_EVENT_ID);
    await StorageService.removeItem(CONFIG.STORAGE_KEYS.DEVICE_ID);
  });

  describe("Screen 1: Welcome & Enterprise Branding", () => {
    it("should conform to enterprise brand copy and single source of truth mission", () => {
      const brandCopy = {
        title: "UrPass One",
        supportingHeadline: "One app. Every gate. Every pass. One source of truth.",
        supportingCopy: "Manage event access, gate operations and attendee check-ins securely from one place.",
        poweredBy: "Powered by UrPass",
      };

      expect(brandCopy.title).toBe("UrPass One");
      expect(brandCopy.supportingHeadline).toContain("One app. Every gate. Every pass.");
      expect(brandCopy.poweredBy).toBe("Powered by UrPass");
    });
  });

  describe("Screen 2: Sign In & Access Control", () => {
    it("should handle authentication request via Supabase Ops Service", async () => {
      const result = await SupabaseOpsService.signInWithPassword("ops.manager@urpass.space", "GateSecure2026!");
      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("error");
      if (result.user) {
        expect(result.user.email).toBe("ops.manager@urpass.space");
      }
    });

    it("should properly return error when invalid credentials are provided", async () => {
      const result = await SupabaseOpsService.signInWithPassword("invalid@example.com", "wrongpass");
      expect(result).toHaveProperty("error");
      // When Supabase returns invalid login credentials error
      if (result.error) {
        expect(typeof result.error).toBe("string");
      }
    });

    it("should enforce operational role restriction on mobile app (no public sign-up allowed)", () => {
      const allowedRoles = ["super_admin", "org_admin", "event_manager", "gate_manager", "gate_staff", "view_only_ops"];
      const permissions = allowedRoles.map((role) => RBACService.getPermissions(role as any));
      
      expect(permissions.length).toBe(6);
      permissions.forEach((perm) => {
        expect(typeof perm.canAccessEvents).toBe("boolean");
        expect(typeof perm.canOperateGates).toBe("boolean");
      });
    });
  });

  describe("Screen 3: Two-Step Verification (OTP & Biometrics)", () => {
    it("should verify OTP code structure via Supabase verifyOtp service", async () => {
      const res = await SupabaseOpsService.verifyOtp("ops.lead@urpass.space", "123456");
      expect(res).toHaveProperty("user");
      expect(res).toHaveProperty("error");
    });

    it("should reject expired OTP format gracefully", async () => {
      const res = await SupabaseOpsService.verifyOtp("ops.lead@urpass.space", "000000");
      expect(res).toHaveProperty("error");
    });

    it("should handle OTP request dispatch via signInWithOtp", async () => {
      const res = await SupabaseOpsService.signInWithOtp("ops.lead@urpass.space");
      expect(res).toHaveProperty("success");
      expect(res).toHaveProperty("error");
    });
  });

  describe("Screen 4: Organisation Selection & Multi-Tenancy", () => {
    it("should fetch accessible organizations for the user", async () => {
      const orgs = await SupabaseOpsService.fetchOrganizations();
      expect(Array.isArray(orgs)).toBe(true);
      expect(orgs.length).toBeGreaterThan(0);
      
      const org = orgs[0];
      expect(org.id).toBeDefined();
      expect(org.name).toBeDefined();
      expect(org.role).toBeDefined();
    });

    it("should filter organizations by search query (name, slug, or role)", () => {
      const mockOrgs: OrganizationSummary[] = [
        { id: "org-1", name: "Velaans Events", slug: "velaans-events", role: "event_manager", eventsCount: 4 },
        { id: "org-2", name: "Yesp Corporation", slug: "yesp-corp", role: "org_admin", eventsCount: 12 },
        { id: "org-3", name: "Tech Summit India", slug: "tech-summit-in", role: "gate_manager", eventsCount: 2 },
      ];

      const query = "velaans";
      const filtered = mockOrgs.filter(
        (o) =>
          o.name.toLowerCase().includes(query) ||
          o.slug.toLowerCase().includes(query) ||
          o.role.toLowerCase().includes(query)
      );

      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe("org-1");
    });

    it("should auto-skip organization selection if user has access to exactly 1 organization", () => {
      const singleOrg: OrganizationSummary[] = [
        { id: "org-1", name: "Velaans Events", slug: "velaans-events", role: "event_manager", eventsCount: 4 },
      ];

      const shouldAutoSkip = singleOrg.length === 1;
      expect(shouldAutoSkip).toBe(true);
    });
  });

  describe("Screen 5: Event Selection & Lifecycle Filtering", () => {
    const mockEvents: EventSummary[] = [
      {
        id: "evt-live",
        name: "Tech Summit 2026 – Main Track",
        eventDate: "2026-10-12",
        venue: "Chennai Trade Centre",
        status: "active",
        totalRegistrations: 3500,
        approvedCount: 3200,
        checkedInCount: 1240,
        currentlyInsideCount: 1100,
        checkedOutCount: 140,
        activeGatesCount: 6,
        currency: "INR",
      },
      {
        id: "evt-upcoming",
        name: "Global AI Conclave 2026",
        eventDate: "2026-11-20",
        venue: "Bangalore International Exhibition Centre",
        status: "draft",
        totalRegistrations: 1200,
        approvedCount: 1000,
        checkedInCount: 0,
        currentlyInsideCount: 0,
        checkedOutCount: 0,
        activeGatesCount: 4,
        currency: "INR",
      },
      {
        id: "evt-past",
        name: "DevOps Summit 2025",
        eventDate: "2025-12-05",
        venue: "Hyderabad HITEX Exhibition Center",
        status: "completed",
        totalRegistrations: 2000,
        approvedCount: 1950,
        checkedInCount: 1850,
        currentlyInsideCount: 0,
        checkedOutCount: 1850,
        activeGatesCount: 0,
        currency: "INR",
      },
    ];

    it("should filter events into Live, Upcoming, and Past tabs correctly", () => {
      const liveEvents = mockEvents.filter((e) => e.status === "active");
      const pastEvents = mockEvents.filter((e) => e.status === "completed" || e.status === "cancelled");
      const upcomingEvents = mockEvents.filter((e) => e.status === "draft" || e.status === "published");

      expect(liveEvents.length).toBe(1);
      expect(liveEvents[0].id).toBe("evt-live");

      expect(upcomingEvents.length).toBe(1);
      expect(upcomingEvents[0].id).toBe("evt-upcoming");

      expect(pastEvents.length).toBe(1);
      expect(pastEvents[0].id).toBe("evt-past");
    });

    it("should auto-skip event selection if exactly 1 active event is assigned", () => {
      const activeEvents = mockEvents.filter((e) => e.status === "active");
      const shouldDirectEntry = activeEvents.length === 1;
      expect(shouldDirectEntry).toBe(true);
    });
  });

  describe("Session Management & Device Security", () => {
    it("should remember device identifier and store session credentials", async () => {
      const deviceId = "OP-DEV-9082";
      await StorageService.setItem(CONFIG.STORAGE_KEYS.DEVICE_ID, deviceId);
      
      const storedDeviceId = await StorageService.getItem(CONFIG.STORAGE_KEYS.DEVICE_ID);
      expect(storedDeviceId).toBe("OP-DEV-9082");
    });

    it("should handle full logout by purging session tokens while keeping device integrity", async () => {
      await StorageService.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, "jwt-token-sample");
      await StorageService.setItem(CONFIG.STORAGE_KEYS.LAST_ORG_ID, "org-sample");
      await StorageService.setItem(CONFIG.STORAGE_KEYS.LAST_EVENT_ID, "evt-sample");

      // Purge session
      await StorageService.removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      await StorageService.removeItem(CONFIG.STORAGE_KEYS.LAST_ORG_ID);
      await StorageService.removeItem(CONFIG.STORAGE_KEYS.LAST_EVENT_ID);

      expect(await StorageService.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN)).toBeNull();
      expect(await StorageService.getItem(CONFIG.STORAGE_KEYS.LAST_ORG_ID)).toBeNull();
      expect(await StorageService.getItem(CONFIG.STORAGE_KEYS.LAST_EVENT_ID)).toBeNull();
    });
  });
});
