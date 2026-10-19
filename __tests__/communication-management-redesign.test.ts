import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  encryptCredential,
  decryptCredential,
  maskCredential,
} from "@/lib/communications/encryption";
import {
  DEFAULT_AUTOMATION_RULES,
  DEFAULT_ORG_COMMUNICATION_SETTINGS,
  getOrganizationCommunicationSettings,
  updateOrganizationCommunicationSettings,
} from "@/lib/communications/org-settings";
import { getUserPlan } from "@/lib/plan";

describe("UrPass — Communication Management Redesign", () => {
  describe("1. Master Switch & Default Configuration", () => {
    it("initializes new organization with Email enabled by default and WhatsApp disabled", () => {
      const defaults = DEFAULT_ORG_COMMUNICATION_SETTINGS("org-test-123");

      expect(defaults.organization_id).toBe("org-test-123");
      expect(defaults.enable_communication).toBe(true);
      expect(defaults.default_channel).toBe("email");
      expect(defaults.email_communication).toBe(true);
      expect(defaults.whatsapp_communication).toBe(false);
      expect(defaults.whatsapp_integration_model).toBe("none");
      expect(defaults.whatsapp_setup_status).toBe("not_configured");
    });

    it("has all email triggers enabled by default in automation rules", () => {
      const rules = DEFAULT_AUTOMATION_RULES;

      expect(rules.registration_confirmed.email).toBe(true);
      expect(rules.registration_approved.email).toBe(true);
      expect(rules.ticket_issued.email).toBe(true);
      expect(rules.qr_pass_generated.email).toBe(true);
      expect(rules.event_reminder.email).toBe(true);
      expect(rules.event_cancelled.email).toBe(true);

      // WhatsApp is optional and disabled until configured
      expect(rules.registration_confirmed.whatsapp).toBe(false);
      expect(rules.ticket_issued.whatsapp).toBe(false);
      expect(rules.qr_pass_generated.whatsapp).toBe(false);
    });
  });

  describe("2. Credential Security & Encryption at Rest", () => {
    it("encrypts sensitive tokens and successfully decrypts them", () => {
      const rawToken = "EAABsAedUvQQBS8GN0mHZAZAAkl1wUPc0MxQR2ZAHynRLDLwlEFp5OF08ZCT0zkUUM3e3s";
      const cipherPackage = encryptCredential(rawToken);

      expect(cipherPackage).not.toBe(rawToken);
      expect(cipherPackage).toContain(":"); // Contains iv:authTag:ciphertext

      const decrypted = decryptCredential(cipherPackage);
      expect(decrypted).toBe(rawToken);
    });

    it("masks tokens and account IDs for UI presentation without leaking raw secrets", () => {
      const wabaId = "4589545307957129";
      const masked = maskCredential(wabaId);

      expect(masked).toBe("•••• •••• 7129");
      expect(masked).not.toContain("4589545");
    });
  });

  describe("3. Subscription & Plan Eligibility Enforcement", () => {
    it("denies self-service WhatsApp to Starter and Pro plans", async () => {
      const mockSupabase = {
        from: () => ({
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: {
                  status: "active",
                  plan: { slug: "starter" },
                },
              }),
            }),
          }),
        }),
      };

      const plan = await getUserPlan(mockSupabase, "user-starter-1");
      expect(plan.slug).toBe("starter");
      expect(plan.canWhatsAppSelfService).toBe(false);
    });

    it("denies self-service WhatsApp to Pro plan", async () => {
      const mockSupabase = {
        from: () => ({
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: {
                  status: "active",
                  plan: { slug: "pro" },
                },
              }),
            }),
          }),
        }),
      };

      const plan = await getUserPlan(mockSupabase, "user-pro-1");
      expect(plan.slug).toBe("pro");
      expect(plan.canWhatsAppSelfService).toBe(false);
    });

    it("permits self-service WhatsApp exclusively on Business and higher tiers", async () => {
      const mockSupabase = {
        from: () => ({
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: {
                  status: "active",
                  plan: { slug: "business" },
                },
              }),
            }),
          }),
        }),
      };

      const plan = await getUserPlan(mockSupabase, "user-business-1");
      expect(plan.slug).toBe("business");
      expect(plan.canWhatsAppSelfService).toBe(true);
    });
  });

  describe("4. Organization Settings Persistence & Fallback", () => {
    it("updates organization communication settings in memory store cleanly", async () => {
      const orgId = "org-fallback-test-99";
      const res = await updateOrganizationCommunicationSettings(orgId, {
        whatsapp_integration_model: "managed",
        whatsapp_setup_status: "pending_verification",
      });

      expect(res.success).toBe(true);
      expect(res.data?.whatsapp_integration_model).toBe("managed");
      expect(res.data?.whatsapp_setup_status).toBe("pending_verification");

      const fetched = await getOrganizationCommunicationSettings(orgId);
      expect(fetched.whatsapp_integration_model).toBe("managed");
      expect(fetched.whatsapp_setup_status).toBe("pending_verification");
    });
  });

  describe("5. Ops Activation of UrPass Managed WhatsApp for User", () => {
    it("activates managed whatsapp and enables delivery automation for user", async () => {
      const userOrgId = "personal_user_test_ops_activation_123";

      // Ops enables managed whatsapp for this user
      const res = await updateOrganizationCommunicationSettings(userOrgId, {
        enable_communication: true,
        whatsapp_communication: true,
        whatsapp_integration_model: "managed",
        whatsapp_setup_status: "active",
        automation_rules: {
          registration_confirmed: { email: true, whatsapp: true },
          registration_approved: { email: true, whatsapp: true },
          registration_rejected: { email: true, whatsapp: false },
          ticket_issued: { email: true, whatsapp: true },
          qr_pass_generated: { email: true, whatsapp: true },
          event_reminder: { email: true, whatsapp: true },
          event_updated: { email: true, whatsapp: true },
          event_cancelled: { email: true, whatsapp: true },
        },
      });

      expect(res.success).toBe(true);
      expect(res.data?.whatsapp_communication).toBe(true);
      expect(res.data?.whatsapp_integration_model).toBe("managed");
      expect(res.data?.whatsapp_setup_status).toBe("active");

      // Verify user's communication settings retrieve active status
      const userSettings = await getOrganizationCommunicationSettings(userOrgId);
      expect(userSettings.whatsapp_communication).toBe(true);
      expect(userSettings.whatsapp_integration_model).toBe("managed");
      expect(userSettings.whatsapp_setup_status).toBe("active");
      expect(userSettings.automation_rules.qr_pass_generated.whatsapp).toBe(true);
      expect(userSettings.automation_rules.ticket_issued.whatsapp).toBe(true);
    });
  });
});

