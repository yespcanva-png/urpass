"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { ssoConnectionSchema, type SSOConnectionInput } from "@/lib/validations/sso";
import {
  generateSpEntityId,
  generateAcsUrl,
  validateSamlCertificate,
} from "@/lib/sso/saml";
import { discoverOidcEndpoints } from "@/lib/sso/oidc";
import { recordAuditLog } from "@/lib/sso/audit";
import { revalidatePath } from "next/cache";
import type { EnterpriseSSOConnection, OrgRole } from "@/types";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function getSSOConnection(orgId: string): Promise<EnterpriseSSOConnection | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const { data } = await supabase
      .from("enterprise_sso_connections")
      .select("*")
      .eq("organization_id", orgId)
      .maybeSingle();

    if (!data) {
      // Default initial configuration
      return {
        id: "",
        organization_id: orgId,
        protocol: "SAML",
        name: "Corporate Identity Provider",
        status: "draft",
        domains: [],
        enforce_sso: false,
        jit_provisioning: true,
        default_role: "member" as OrgRole,
        sp_entity_id: generateSpEntityId(orgId),
        acs_url: generateAcsUrl(orgId),
        idp_entity_id: null,
        idp_sso_url: null,
        idp_certificate: null,
        oidc_issuer: null,
        oidc_client_id: null,
        oidc_client_secret: null,
        oidc_authorization_endpoint: null,
        oidc_token_endpoint: null,
        oidc_userinfo_endpoint: null,
        last_tested_at: null,
        last_tested_status: null,
        last_tested_error: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    return data as EnterpriseSSOConnection;
  } catch (err) {
    console.error("[getSSOConnection] error:", err);
    return null;
  }
}

export async function saveSSOConnection(
  orgId: string,
  data: SSOConnectionInput
): Promise<{ success: boolean; error?: string; connection?: EnterpriseSSOConnection }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Authentication required." };

  // Verify owner or admin
  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    return { success: false, error: "Only organization owners and admins can configure Single Sign-On." };
  }

  const parsed = ssoConnectionSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const admin = adminClient();

  // If enforce_sso is requested, check if any of the configured domains is verified
  if (parsed.data.enforce_sso) {
    const { data: verifiedDomains } = await admin
      .from("verified_domains")
      .select("domain")
      .eq("organization_id", orgId)
      .eq("status", "verified");

    const verifiedList = (verifiedDomains || []).map((d) => d.domain.toLowerCase());
    const hasVerifiedDomain = parsed.data.domains.some((d) => verifiedList.includes(d.toLowerCase()));

    if (!hasVerifiedDomain && parsed.data.domains.length > 0) {
      return {
        success: false,
        error: "Cannot enforce SSO: At least one domain must be verified via DNS before enforcing SSO.",
      };
    }
  }

  const spEntityId = generateSpEntityId(orgId);
  const acsUrl = generateAcsUrl(orgId);

  const payload = {
    organization_id: orgId,
    name: parsed.data.name,
    protocol: parsed.data.protocol,
    status: parsed.data.status,
    domains: parsed.data.domains,
    enforce_sso: parsed.data.enforce_sso,
    jit_provisioning: parsed.data.jit_provisioning,
    default_role: parsed.data.default_role,
    sp_entity_id: spEntityId,
    acs_url: acsUrl,
    idp_entity_id: parsed.data.idp_entity_id || null,
    idp_sso_url: parsed.data.idp_sso_url || null,
    idp_certificate: parsed.data.idp_certificate || null,
    oidc_issuer: parsed.data.oidc_issuer || null,
    oidc_client_id: parsed.data.oidc_client_id || null,
    oidc_client_secret: parsed.data.oidc_client_secret || null,
    oidc_authorization_endpoint: parsed.data.oidc_authorization_endpoint || null,
    oidc_token_endpoint: parsed.data.oidc_token_endpoint || null,
    oidc_userinfo_endpoint: parsed.data.oidc_userinfo_endpoint || null,
    updated_at: new Date().toISOString(),
  };

  const { data: saved, error } = await admin
    .from("enterprise_sso_connections")
    .upsert(payload, { onConflict: "organization_id" })
    .select("*")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  // Update enforce_sso in organization_settings
  await admin
    .from("organization_settings")
    .update({ enforce_sso: parsed.data.enforce_sso })
    .eq("organization_id", orgId);

  await recordAuditLog({
    organizationId: orgId,
    userId: user.id,
    actorEmail: user.email,
    action: "sso.configured",
    resourceType: "sso_connection",
    resourceId: saved.id,
    details: {
      protocol: parsed.data.protocol,
      status: parsed.data.status,
      enforce_sso: parsed.data.enforce_sso,
      domains: parsed.data.domains,
      jit_provisioning: parsed.data.jit_provisioning,
    },
  });

  revalidatePath(`/org/[orgSlug]/settings/security`, "page");
  return { success: true, connection: saved as EnterpriseSSOConnection };
}

export async function testSSOConnection(
  orgId: string,
  data?: Partial<SSOConnectionInput>
): Promise<{ success: boolean; message: string; details?: Record<string, unknown> }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Authentication required." };

  const admin = adminClient();

  // If partial data passed, merge with existing
  const { data: existing } = await admin
    .from("enterprise_sso_connections")
    .select("*")
    .eq("organization_id", orgId)
    .maybeSingle();

  const protocol = data?.protocol || existing?.protocol || "SAML";

  let testSuccess = false;
  let testMessage = "";
  const details: Record<string, unknown> = {};

  if (protocol === "SAML") {
    const ssoUrl = data?.idp_sso_url ?? existing?.idp_sso_url;
    const cert = data?.idp_certificate ?? existing?.idp_certificate;
    const entityId = data?.idp_entity_id ?? existing?.idp_entity_id;

    if (!ssoUrl || !ssoUrl.startsWith("http")) {
      testMessage = "Missing or invalid Identity Provider SSO Login URL.";
    } else if (!cert || cert.trim().length === 0) {
      testMessage = "X.509 Certificate is required for SAML authentication.";
    } else {
      const certResult = validateSamlCertificate(cert);
      if (!certResult.valid) {
        testMessage = certResult.error || "Invalid X.509 Certificate.";
      } else {
        testSuccess = true;
        testMessage = "SAML 2.0 configuration and certificate validated successfully.";
        details.certificateSubject = certResult.subject;
        details.certificateIssuer = certResult.issuer;
        details.expiresOn = certResult.validTo;
        details.entityId = entityId || "(none)";
        details.ssoUrl = ssoUrl;
      }
    }
  } else {
    // OIDC Protocol Test
    const issuer = data?.oidc_issuer ?? existing?.oidc_issuer;
    const clientId = data?.oidc_client_id ?? existing?.oidc_client_id;

    if (!issuer || !issuer.startsWith("http")) {
      testMessage = "Missing or invalid OIDC Issuer URL.";
    } else if (!clientId) {
      testMessage = "Client ID is required for OpenID Connect.";
    } else {
      const discovery = await discoverOidcEndpoints(issuer);
      if (!discovery.success) {
        testMessage = discovery.error || "Failed to reach OIDC discovery endpoint.";
      } else {
        testSuccess = true;
        testMessage = "OpenID Connect discovery succeeded. Endpoints are operational.";
        details.issuer = discovery.doc?.issuer;
        details.authorizationEndpoint = discovery.doc?.authorization_endpoint;
        details.tokenEndpoint = discovery.doc?.token_endpoint;
        details.userinfoEndpoint = discovery.doc?.userinfo_endpoint;
      }
    }
  }

  // Update connection with last test result
  if (existing) {
    await admin
      .from("enterprise_sso_connections")
      .update({
        last_tested_at: new Date().toISOString(),
        last_tested_status: testSuccess ? "success" : "failure",
        last_tested_error: testSuccess ? null : testMessage,
      })
      .eq("id", existing.id);
  }

  await recordAuditLog({
    organizationId: orgId,
    userId: user.id,
    actorEmail: user.email,
    action: testSuccess ? "sso.test_success" : "sso.test_failed",
    resourceType: "sso_connection",
    resourceId: existing?.id,
    details: { protocol, message: testMessage, success: testSuccess, ...details },
  });

  return {
    success: testSuccess,
    message: testMessage,
    details,
  };
}

export async function toggleSSOStatus(
  orgId: string,
  newStatus: "active" | "inactive" | "draft"
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Authentication required." };

  const admin = adminClient();
  const { data: existing } = await admin
    .from("enterprise_sso_connections")
    .select("*")
    .eq("organization_id", orgId)
    .maybeSingle();

  if (!existing) {
    return { success: false, error: "SSO Connection not found." };
  }

  // If activating, verify basic config
  if (newStatus === "active") {
    if (existing.protocol === "SAML") {
      if (!existing.idp_sso_url || !existing.idp_certificate) {
        return { success: false, error: "Cannot enable SSO: Missing IdP SSO URL or Certificate." };
      }
    } else {
      if (!existing.oidc_issuer || !existing.oidc_client_id) {
        return { success: false, error: "Cannot enable SSO: Missing OIDC Issuer or Client ID." };
      }
    }
  }

  await admin
    .from("enterprise_sso_connections")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", existing.id);

  await recordAuditLog({
    organizationId: orgId,
    userId: user.id,
    actorEmail: user.email,
    action: `sso.status_${newStatus}`,
    resourceType: "sso_connection",
    resourceId: existing.id,
    details: { newStatus },
  });

  revalidatePath(`/org/[orgSlug]/settings/security`, "page");
  return { success: true };
}

/**
 * Public action for login page to resolve if email belongs to an organization with SSO
 */
export async function lookupSSOByEmail(email: string): Promise<{
  ssoAvailable: boolean;
  enforced: boolean;
  orgId?: string;
  orgSlug?: string;
  orgName?: string;
  protocol?: "SAML" | "OIDC";
  loginUrl?: string;
  allowEmergencyLogin?: boolean;
}> {
  if (!email || !email.includes("@")) {
    return { ssoAvailable: false, enforced: false };
  }

  const domain = email.split("@")[1].toLowerCase().trim();
  const admin = adminClient();

  // 1. Look up verified domain
  const { data: verifiedDomain } = await admin
    .from("verified_domains")
    .select("organization_id, domain")
    .eq("domain", domain)
    .eq("status", "verified")
    .maybeSingle();

  if (!verifiedDomain) {
    return { ssoAvailable: false, enforced: false };
  }

  // 2. Look up organization & SSO connection
  const [orgRes, ssoRes, settingsRes] = await Promise.all([
    admin.from("organizations").select("id, slug, name").eq("id", verifiedDomain.organization_id).maybeSingle(),
    admin.from("enterprise_sso_connections").select("*").eq("organization_id", verifiedDomain.organization_id).maybeSingle(),
    admin.from("organization_settings").select("enforce_sso, allow_emergency_owner_login").eq("organization_id", verifiedDomain.organization_id).maybeSingle(),
  ]);

  if (!orgRes.data || !ssoRes.data || ssoRes.data.status !== "active") {
    return { ssoAvailable: false, enforced: false };
  }

  const org = orgRes.data;
  const sso = ssoRes.data;
  const settings = settingsRes.data;

  const isEnforced = sso.enforce_sso || settings?.enforce_sso || false;
  const allowEmergency = settings?.allow_emergency_owner_login ?? true;

  const loginUrl =
    sso.protocol === "SAML"
      ? `/api/auth/sso/saml/login?orgId=${org.id}&email=${encodeURIComponent(email)}`
      : `/api/auth/sso/oidc/login?orgId=${org.id}&email=${encodeURIComponent(email)}`;

  return {
    ssoAvailable: true,
    enforced: isEnforced,
    orgId: org.id,
    orgSlug: org.slug,
    orgName: org.name,
    protocol: sso.protocol,
    loginUrl,
    allowEmergencyLogin: allowEmergency,
  };
}
