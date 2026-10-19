import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type {
  OrganizationCommunicationSettings,
  NotificationAutomationRules,
  WhatsAppIntegrationModel,
  WhatsAppSetupStatus,
  WhatsAppSelfServiceConfig,
  WhatsAppManagedServiceRequest,
  WhatsAppTemplateRecord,
} from "./types";
import { encryptCredential, decryptCredential, maskCredential } from "./encryption";
import { isTableMissingError } from "@/lib/org/fallback-store";

function getAdminClient() {
  if (process.env.NODE_ENV === "test") return null;
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return createAdminClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export const DEFAULT_AUTOMATION_RULES: NotificationAutomationRules = {
  registration_confirmed: { email: true, whatsapp: false },
  registration_approved: { email: true, whatsapp: false },
  registration_rejected: { email: true, whatsapp: false },
  ticket_issued: { email: true, whatsapp: false },
  qr_pass_generated: { email: true, whatsapp: false },
  event_reminder: { email: true, whatsapp: false },
  event_updated: { email: true, whatsapp: false },
  event_cancelled: { email: true, whatsapp: false },
};

export const DEFAULT_ORG_COMMUNICATION_SETTINGS = (orgId: string): OrganizationCommunicationSettings => ({
  organization_id: orgId,
  enable_communication: true,
  default_channel: "email",
  email_communication: true,
  whatsapp_communication: false,
  whatsapp_integration_model: "none",
  whatsapp_setup_status: "not_configured",
  automation_rules: DEFAULT_AUTOMATION_RULES,
});

// In-memory fallback cache when table is not yet migrated to DB
const orgSettingsMemoryCache = new Map<string, OrganizationCommunicationSettings>();
const selfServiceMemoryCache = new Map<string, any>();
const managedRequestsMemoryCache = new Map<string, WhatsAppManagedServiceRequest[]>();

/**
 * Resolves a potentially virtual orgId (e.g. personal_${userId}) to a real organization UUID in Postgres.
 */
export async function resolveOrgId(orgId: string): Promise<string> {
  if (!orgId || !orgId.startsWith("personal_")) return orgId;
  const userId = orgId.replace("personal_", "");
  const admin = getAdminClient();
  if (!admin) return orgId;

  try {
    // 1. Check organization_members
    const { data: member } = await admin
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (member?.organization_id) return member.organization_id;

    // 2. Check organizations created_by
    const { data: createdOrg } = await admin
      .from("organizations")
      .select("id")
      .eq("created_by", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (createdOrg?.id) return createdOrg.id;

    // 3. Create default organization if none exists
    const { data: profile } = await admin
      .from("profiles")
      .select("full_name, email")
      .eq("user_id", userId)
      .maybeSingle();

    const name = profile?.full_name?.trim() || "User";
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]/g, "") || "org";
    const slug = `${baseSlug}-${userId.slice(0, 8)}`;

    const { data: newOrg } = await admin
      .from("organizations")
      .insert({
        name: `${name}'s Organization`,
        slug,
        contact_email: profile?.email || null,
        created_by: userId,
        brand_color: "#6D28D9",
      })
      .select("id")
      .maybeSingle();

    if (newOrg?.id) {
      await admin.from("organization_members").insert({
        organization_id: newOrg.id,
        user_id: userId,
        invited_email: profile?.email || "",
        role: "owner",
        status: "active",
      });
      return newOrg.id;
    }
  } catch (err) {
    console.warn("[resolveOrgId] Notice:", err);
  }
  return orgId;
}

/**
 * Retrieves communication settings for an organization
 */
export async function getOrganizationCommunicationSettings(
  orgId: string
): Promise<OrganizationCommunicationSettings> {
  if (!orgId) return DEFAULT_ORG_COMMUNICATION_SETTINGS("default");

  const resolvedOrgId = await resolveOrgId(orgId);

  const admin = getAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from("organization_communication_settings")
        .select("*")
        .eq("organization_id", resolvedOrgId)
        .maybeSingle();

      if (!error && data) {
        const result: OrganizationCommunicationSettings = {
          organization_id: orgId,
          enable_communication: data.enable_communication !== false,
          default_channel: data.default_channel || "email",
          email_communication: data.email_communication !== false,
          whatsapp_communication: !!data.whatsapp_communication,
          whatsapp_integration_model: data.whatsapp_integration_model || "none",
          whatsapp_setup_status: data.whatsapp_setup_status || "not_configured",
          automation_rules: {
            ...DEFAULT_AUTOMATION_RULES,
            ...(data.automation_rules || {}),
          },
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
        orgSettingsMemoryCache.set(orgId, result);
        if (resolvedOrgId !== orgId) {
          orgSettingsMemoryCache.set(resolvedOrgId, { ...result, organization_id: resolvedOrgId });
        }
        return result;
      }
    } catch (err) {
      if (!isTableMissingError(err)) {
        console.warn("[getOrganizationCommunicationSettings] DB read notice:", err);
      }
    }
  }

  // Check memory cache fallback
  if (orgSettingsMemoryCache.has(orgId)) {
    return orgSettingsMemoryCache.get(orgId)!;
  }
  if (resolvedOrgId !== orgId && orgSettingsMemoryCache.has(resolvedOrgId)) {
    return orgSettingsMemoryCache.get(resolvedOrgId)!;
  }

  return DEFAULT_ORG_COMMUNICATION_SETTINGS(orgId);
}

/**
 * Initializes or updates communication settings for an organization
 */
export async function updateOrganizationCommunicationSettings(
  orgId: string,
  updates: Partial<OrganizationCommunicationSettings>
): Promise<{ success: boolean; data?: OrganizationCommunicationSettings; error?: string }> {
  if (!orgId) return { success: false, error: "Missing organization ID" };

  const resolvedOrgId = await resolveOrgId(orgId);
  const current = await getOrganizationCommunicationSettings(resolvedOrgId);
  const merged: OrganizationCommunicationSettings = {
    ...current,
    ...updates,
    organization_id: resolvedOrgId,
    automation_rules: {
      ...current.automation_rules,
      ...(updates.automation_rules || {}),
    },
    updated_at: new Date().toISOString(),
  };

  const admin = getAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from("organization_communication_settings")
        .upsert(
          {
            organization_id: resolvedOrgId,
            enable_communication: merged.enable_communication,
            default_channel: merged.default_channel,
            email_communication: merged.email_communication,
            whatsapp_communication: merged.whatsapp_communication,
            whatsapp_integration_model: merged.whatsapp_integration_model,
            whatsapp_setup_status: merged.whatsapp_setup_status,
            automation_rules: merged.automation_rules,
            updated_at: merged.updated_at,
          },
          { onConflict: "organization_id" }
        )
        .select()
        .maybeSingle();

      if (!error && data) {
        orgSettingsMemoryCache.set(orgId, { ...merged, organization_id: orgId });
        orgSettingsMemoryCache.set(resolvedOrgId, merged);
        return { success: true, data: merged };
      }
    } catch (err) {
      if (!isTableMissingError(err)) {
        console.warn("[updateOrganizationCommunicationSettings] DB upsert notice:", err);
      }
    }
  }

  // Fallback update memory cache
  orgSettingsMemoryCache.set(orgId, { ...merged, organization_id: orgId });
  orgSettingsMemoryCache.set(resolvedOrgId, merged);
  return { success: true, data: merged };
}

/**
 * Retrieves masked self-service WhatsApp config for an organization
 * Never exposes raw access tokens or secrets!
 */
export async function getWhatsAppSelfServiceConfig(
  orgId: string
): Promise<WhatsAppSelfServiceConfig> {
  const admin = getAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from("whatsapp_self_service_configs")
        .select("organization_id, waba_id, phone_number_id, app_id, encrypted_access_token, connection_status, last_verified_at, display_phone_number, verified_name")
        .eq("organization_id", orgId)
        .maybeSingle();

      if (!error && data) {
        return {
          organization_id: data.organization_id,
          waba_id: data.waba_id ? maskCredential(data.waba_id) : null,
          phone_number_id: data.phone_number_id ? maskCredential(data.phone_number_id) : null,
          app_id: data.app_id || null,
          is_configured: Boolean(data.encrypted_access_token && data.phone_number_id),
          display_phone_number: data.display_phone_number || null,
          verified_name: data.verified_name || null,
          connection_status: data.connection_status || "disconnected",
          last_verified_at: data.last_verified_at || null,
          access_token_preview: data.encrypted_access_token ? "••••••••••••••••" : null,
        };
      }
    } catch {}
  }

  const mem = selfServiceMemoryCache.get(orgId);
  if (mem) {
    return {
      organization_id: orgId,
      waba_id: mem.waba_id ? maskCredential(mem.waba_id) : null,
      phone_number_id: mem.phone_number_id ? maskCredential(mem.phone_number_id) : null,
      app_id: mem.app_id || null,
      is_configured: Boolean(mem.encrypted_access_token && mem.phone_number_id),
      display_phone_number: mem.display_phone_number || null,
      verified_name: mem.verified_name || null,
      connection_status: mem.connection_status || "disconnected",
      last_verified_at: mem.last_verified_at || null,
      access_token_preview: mem.encrypted_access_token ? "••••••••••••••••" : null,
    };
  }

  return {
    organization_id: orgId,
    is_configured: false,
    connection_status: "disconnected",
  };
}

/**
 * Saves and verifies self-service WhatsApp credentials
 * Encrypts token and secret before persisting
 */
export async function saveWhatsAppSelfServiceConfig(
  orgId: string,
  input: {
    waba_id: string;
    phone_number_id: string;
    app_id?: string;
    access_token?: string;
    app_secret?: string;
  }
): Promise<{ success: boolean; error?: string; verifiedName?: string }> {
  if (!input.phone_number_id || !input.waba_id) {
    return { success: false, error: "WABA ID and Phone Number ID are required." };
  }

  const admin = getAdminClient();
  let encryptedToken: string | null = null;
  let encryptedSecret: string | null = null;

  if (input.access_token) {
    encryptedToken = encryptCredential(input.access_token.trim());
  } else if (admin) {
    // Retain existing token if not changing
    const { data: existing } = await admin
      .from("whatsapp_self_service_configs")
      .select("encrypted_access_token, encrypted_app_secret")
      .eq("organization_id", orgId)
      .maybeSingle();
    encryptedToken = existing?.encrypted_access_token || null;
    encryptedSecret = existing?.encrypted_app_secret || null;
  }

  if (input.app_secret) {
    encryptedSecret = encryptCredential(input.app_secret.trim());
  }

  if (!encryptedToken) {
    return { success: false, error: "Meta WhatsApp Cloud API Access Token is required." };
  }

  // Verify connection by contacting Meta Graph API
  const rawToken = input.access_token ? input.access_token.trim() : decryptCredential(encryptedToken);
  let verifiedName = "WhatsApp Business Account";
  let displayPhone = "";
  let connectionStatus: "connected" | "failed" = "connected";

  if (rawToken && !rawToken.startsWith("mock_")) {
    try {
      const apiVer = process.env.WHATSAPP_GRAPH_VERSION || "v21.0";
      const res = await fetch(
        `https://graph.facebook.com/${apiVer}/${input.phone_number_id}?fields=verified_name,display_phone_number,quality_rating`,
        {
          headers: { Authorization: `Bearer ${rawToken}` },
        }
      );
      if (res.ok) {
        const metaData = await res.json();
        verifiedName = metaData.verified_name || verifiedName;
        displayPhone = metaData.display_phone_number || "";
      } else {
        const errJson = await res.json().catch(() => null);
        const errMsg = errJson?.error?.message || `Meta Graph API HTTP ${res.status}`;
        return { success: false, error: `Meta Verification Failed: ${errMsg}` };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: `Network exception connecting to Meta API: ${msg}` };
    }
  }

  const now = new Date().toISOString();
  const record = {
    organization_id: orgId,
    waba_id: input.waba_id.trim(),
    phone_number_id: input.phone_number_id.trim(),
    app_id: input.app_id?.trim() || null,
    encrypted_access_token: encryptedToken,
    encrypted_app_secret: encryptedSecret,
    display_phone_number: displayPhone,
    verified_name: verifiedName,
    connection_status: connectionStatus,
    last_verified_at: now,
    updated_at: now,
  };

  if (admin) {
    try {
      await admin
        .from("whatsapp_self_service_configs")
        .upsert(record, { onConflict: "organization_id" });
    } catch {}
  }

  selfServiceMemoryCache.set(orgId, record);

  // Update org communication status to ACTIVE and model to SELF_SERVICE
  await updateOrganizationCommunicationSettings(orgId, {
    whatsapp_integration_model: "self_service",
    whatsapp_setup_status: "active",
    whatsapp_communication: true,
  });

  return { success: true, verifiedName };
}

/**
 * Creates an UrPass Managed WhatsApp Service Request
 */
export async function createManagedWhatsAppServiceRequest(
  orgId: string,
  userId: string,
  input: {
    estimated_monthly_volume: string;
    use_case: string;
    contact_email: string;
    contact_phone: string;
  }
): Promise<{ success: boolean; request?: WhatsAppManagedServiceRequest; error?: string }> {
  if (!input.contact_email || !input.contact_phone || !input.use_case) {
    return { success: false, error: "Please fill in all required contact and use case fields." };
  }

  const resolvedOrgId = await resolveOrgId(orgId);
  const id = `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  const newReq: WhatsAppManagedServiceRequest = {
    id,
    organization_id: resolvedOrgId,
    requested_by: userId,
    status: "pending_review",
    estimated_monthly_volume: input.estimated_monthly_volume,
    use_case: input.use_case,
    contact_email: input.contact_email,
    contact_phone: input.contact_phone,
    currency: "INR",
    created_at: now,
  };

  const admin = getAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from("whatsapp_managed_service_requests")
        .insert({
          organization_id: resolvedOrgId,
          requested_by: userId,
          status: "pending_review",
          estimated_monthly_volume: input.estimated_monthly_volume,
          use_case: input.use_case,
          contact_email: input.contact_email,
          contact_phone: input.contact_phone,
          currency: "INR",
        })
        .select()
        .maybeSingle();

      if (!error && data) {
        newReq.id = data.id;
      }
    } catch {}
  }

  const existingList = managedRequestsMemoryCache.get(resolvedOrgId) || [];
  managedRequestsMemoryCache.set(resolvedOrgId, [newReq, ...existingList]);
  managedRequestsMemoryCache.set(orgId, [newReq, ...existingList]);

  // Update org communication status to PENDING_VERIFICATION (not yet active until paid and activated by admin)
  await updateOrganizationCommunicationSettings(resolvedOrgId, {
    whatsapp_integration_model: "managed",
    whatsapp_setup_status: "pending_verification",
    whatsapp_communication: false, // Remains false until admin activation!
  });

  return { success: true, request: newReq };
}

/**
 * Retrieves managed service requests for an organization
 */
export async function getManagedServiceRequests(
  orgId: string
): Promise<WhatsAppManagedServiceRequest[]> {
  const resolvedOrgId = await resolveOrgId(orgId);
  const admin = getAdminClient();
  if (admin) {
    try {
      let query = admin
        .from("whatsapp_managed_service_requests")
        .select("*");

      if (orgId.startsWith("personal_")) {
        const userId = orgId.replace("personal_", "");
        query = query.or(`organization_id.eq.${resolvedOrgId},requested_by.eq.${userId}`);
      } else {
        query = query.eq("organization_id", resolvedOrgId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as WhatsAppManagedServiceRequest[];
      }
    } catch {}
  }

  return managedRequestsMemoryCache.get(orgId) || managedRequestsMemoryCache.get(resolvedOrgId) || [];
}

/**
 * Retrieves WhatsApp templates for an organization (system + custom)
 */
export async function getWhatsAppTemplatesCatalog(
  orgId?: string
): Promise<WhatsAppTemplateRecord[]> {
  const systemTemplates: WhatsAppTemplateRecord[] = [
    {
      id: "sys-urpass-space",
      name: "urpass_space",
      category: "UTILITY",
      language: "en",
      status: "APPROVED",
      body_text:
        "Hi {{1}},\n\nYour registration for *{{2}}* has been confirmed! ✅\n\n *Date:* {{3}}\n *Venue:* {{4}}\n\n🎟️ Your digital event pass is ready.\n\nPlease use the button below to view your QR pass and present it at the event entrance.\n\nThank you for registering!\n\n*Team UrPass*",
      buttons: [{ type: "URL", text: "View My Pass", url: "https://urpass.space/pass/{{1}}" }],
      is_system: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "sys-urpass-ticket",
      name: "urpass_ticket",
      category: "UTILITY",
      language: "en_US",
      status: "APPROVED",
      body_text:
        "Hi {{1}},\n\nYour registration for *{{2}}* has been confirmed! ✅\n\nDate: {{3}}\nTime: {{4}}\nVenue: {{5}}\n\n🎟️ Your digital event pass is ready.\n\nPlease use the button below to view your QR pass and present it at the event entrance.\n\nWe look forward to seeing you!\n\n*Team UrPass*",
      buttons: [{ type: "URL", text: "View My Event Pass", url: "https://urpass.space/pass/{{1}}" }],
      is_system: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "sys-event-reminder",
      name: "event_reminder_24h",
      category: "UTILITY",
      language: "en_US",
      status: "APPROVED",
      body_text:
        "Reminder: {{1}} is happening tomorrow at {{2}}!\n\n📍 Venue: {{3}}\n🎟️ Ticket ID: {{4}}\n\nPlease have your digital QR pass ready at the entry gate.",
      buttons: [{ type: "URL", text: "Open My Pass", url: "https://urpass.space/pass/{{1}}" }],
      is_system: true,
      created_at: new Date().toISOString(),
    },
  ];

  const admin = getAdminClient();
  if (admin && orgId) {
    try {
      const { data, error } = await admin
        .from("whatsapp_templates")
        .select("*")
        .or(`organization_id.eq.${orgId},is_system.eq.true`)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as WhatsAppTemplateRecord[];
      }
    } catch {}
  }

  return systemTemplates;
}
