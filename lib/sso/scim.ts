/**
 * URPASS SCIM 2.0 Directory Engine (RFC 7643 & RFC 7644)
 *
 * Implements automated identity provisioning, synchronization, and
 * deprovisioning for enterprise Identity Providers (Okta, Entra ID, OneLogin).
 */

import { createHash, randomBytes } from "crypto";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { recordAuditLog } from "@/lib/sso/audit";
import type { OrgRole } from "@/types";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export const SCIM_SCHEMAS = {
  USER: "urn:ietf:params:scim:schemas:core:2.0:User",
  SERVICE_PROVIDER_CONFIG: "urn:ietf:params:scim:schemas:core:2.0:ServiceProviderConfig",
  LIST_RESPONSE: "urn:ietf:params:scim:api:messages:2.0:ListResponse",
  ERROR: "urn:ietf:params:scim:api:messages:2.0:Error",
} as const;

export interface ScimUserResource {
  schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"] | string[];
  id: string;
  externalId?: string;
  userName: string;
  name?: {
    formatted?: string;
    familyName?: string;
    givenName?: string;
  };
  displayName?: string;
  active: boolean;
  emails: Array<{
    value: string;
    primary?: boolean;
    type?: string;
  }>;
  meta: {
    resourceType: "User";
    created: string;
    lastModified: string;
    location: string;
  };
}

export function formatScimUser(
  member: {
    id: string;
    user_id: string;
    status: string;
    created_at: string;
    updated_at?: string | null;
  },
  profile: {
    full_name?: string | null;
    email?: string | null;
  } | null | undefined,
  baseUrl: string
): ScimUserResource {
  const email = profile?.email || `${member.user_id}@placeholder.urpass.in`;
  const fullName = profile?.full_name || "Enterprise User";
  const nameParts = fullName.trim().split(" ");

  return {
    schemas: [SCIM_SCHEMAS.USER],
    id: member.id,
    externalId: member.user_id,
    userName: email,
    name: {
      formatted: fullName,
      givenName: nameParts[0] || "",
      familyName: nameParts.slice(1).join(" ") || "",
    },
    displayName: fullName,
    active: member.status === "active",
    emails: [{ value: email, primary: true, type: "work" }],
    meta: {
      resourceType: "User",
      created: member.created_at,
      lastModified: member.updated_at || member.created_at,
      location: `${baseUrl}/Users/${member.id}`,
    },
  };
}

export function getScimSchemas() {
  const userSchema = {
    id: SCIM_SCHEMAS.USER,
    name: "User",
    description: "Enterprise User Account",
    attributes: [
      { name: "userName", type: "string", multiValued: false, required: true, caseExact: false, mutability: "readWrite", returned: "default", uniqueness: "server" },
      { name: "name", type: "complex", multiValued: false, required: false, subAttributes: [
        { name: "formatted", type: "string", multiValued: false, required: false },
        { name: "familyName", type: "string", multiValued: false, required: false },
        { name: "givenName", type: "string", multiValued: false, required: false }
      ]},
      { name: "displayName", type: "string", multiValued: false, required: false },
      { name: "active", type: "boolean", multiValued: false, required: false },
      { name: "emails", type: "complex", multiValued: true, required: false, subAttributes: [
        { name: "value", type: "string", multiValued: false, required: false },
        { name: "primary", type: "boolean", multiValued: false, required: false },
        { name: "type", type: "string", multiValued: false, required: false }
      ]}
    ]
  };

  const configSchema = {
    id: SCIM_SCHEMAS.SERVICE_PROVIDER_CONFIG,
    name: "ServiceProviderConfig",
    description: "SCIM 2.0 Service Provider Configuration",
    attributes: []
  };

  return {
    schemas: [SCIM_SCHEMAS.LIST_RESPONSE],
    totalResults: 2,
    itemsPerPage: 2,
    startIndex: 1,
    Resources: [userSchema, configSchema]
  };
}

export function hashScimToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateScimToken(): { rawToken: string; tokenHash: string; tokenHint: string } {
  const secret = randomBytes(32).toString("hex");
  const rawToken = `scim_live_${secret}`;
  const tokenHash = hashScimToken(rawToken);
  const tokenHint = `scim_...${secret.slice(-4)}`;
  return { rawToken, tokenHash, tokenHint };
}

export async function verifyScimToken(orgId: string, authHeader: string | null): Promise<boolean> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const tokenHash = hashScimToken(token);

  const admin = adminClient();
  const { data } = await admin
    .from("enterprise_scim_tokens")
    .select("id")
    .eq("organization_id", orgId)
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (!data) return false;

  // Update last used timestamp non-blockingly
  admin
    .from("enterprise_scim_tokens")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id)
    .then();

  return true;
}

export function getScimServiceProviderConfig(baseUrl: string) {
  return {
    schemas: ["urn:ietf:params:scim:schemas:core:2.0:ServiceProviderConfig"],
    documentationUri: "https://urpass.in/docs/enterprise-scim",
    patch: { supported: true },
    bulk: { supported: false, maxOperations: 0, maxPayloadSize: 0 },
    filter: { supported: true, maxResults: 100 },
    changePassword: { supported: false },
    sort: { supported: false },
    etag: { supported: false },
    authenticationSchemes: [
      {
        name: "OAuth Bearer Token",
        description: "Authentication scheme using SCIM API bearer token",
        specUri: "https://tools.ietf.org/html/rfc7644#section-3.2",
        type: "oauthbearertoken",
        primary: true,
      },
    ],
    meta: {
      location: `${baseUrl}/ServiceProviderConfig`,
      resourceType: "ServiceProviderConfig",
      created: "2026-01-01T00:00:00Z",
      lastModified: "2026-01-01T00:00:00Z",
    },
  };
}

export async function scimListUsers(
  orgId: string,
  baseUrl: string,
  filter?: string | null,
  startIndex: number = 1,
  count: number = 50
) {
  const admin = adminClient();

  let query = admin
    .from("organization_members")
    .select("id, user_id, role, status, created_at, updated_at", { count: "exact" })
    .eq("organization_id", orgId);

  // Simple filter parsing for userName eq "email"
  if (filter && filter.includes("eq")) {
    const match = filter.match(/userName\s+eq\s+["']?([^"']+)["']?/i) ||
                  filter.match(/emails\.value\s+eq\s+["']?([^"']+)["']?/i);
    if (match) {
      const emailFilter = match[1].toLowerCase().trim();
      const { data: prof } = await admin
        .from("profiles")
        .select("user_id")
        .eq("email", emailFilter)
        .maybeSingle();

      if (prof) {
        query = query.eq("user_id", prof.user_id);
      } else {
        return {
          schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
          totalResults: 0,
          startIndex,
          itemsPerPage: count,
          Resources: [],
        };
      }
    }
  }

  const offset = Math.max(0, startIndex - 1);
  const { data: members, count: totalResults, error } = await query
    .range(offset, offset + count - 1)
    .order("created_at", { ascending: true });

  if (error || !members) {
    throw new Error(`Failed to list SCIM users: ${error?.message}`);
  }

  const userIds = members.map((m) => m.user_id);
  const { data: profiles } = await admin
    .from("profiles")
    .select("user_id, full_name, email")
    .in("user_id", userIds);

  const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

  const resources: ScimUserResource[] = members.map((m) => {
    const profile = profileMap.get(m.user_id);
    const email = profile?.email || `${m.user_id}@placeholder.urpass.in`;
    const fullName = profile?.full_name || "Enterprise User";
    const nameParts = fullName.split(" ");

    return {
      schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
      id: m.id,
      externalId: m.user_id,
      userName: email,
      name: {
        formatted: fullName,
        givenName: nameParts[0] || "",
        familyName: nameParts.slice(1).join(" ") || "",
      },
      displayName: fullName,
      active: m.status === "active",
      emails: [{ value: email, primary: true, type: "work" }],
      meta: {
        resourceType: "User",
        created: m.created_at,
        lastModified: m.updated_at || m.created_at,
        location: `${baseUrl}/Users/${m.id}`,
      },
    };
  });

  return {
    schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
    totalResults: totalResults || 0,
    startIndex,
    itemsPerPage: resources.length,
    Resources: resources,
  };
}

export async function scimGetUser(orgId: string, memberId: string, baseUrl: string): Promise<ScimUserResource | null> {
  const admin = adminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("id, user_id, role, status, created_at, updated_at")
    .eq("organization_id", orgId)
    .eq("id", memberId)
    .maybeSingle();

  if (!member) return null;

  const { data: profile } = await admin
    .from("profiles")
    .select("user_id, full_name, email")
    .eq("user_id", member.user_id)
    .maybeSingle();

  const email = profile?.email || `${member.user_id}@placeholder.urpass.in`;
  const fullName = profile?.full_name || "Enterprise User";
  const nameParts = fullName.split(" ");

  return {
    schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
    id: member.id,
    externalId: member.user_id,
    userName: email,
    name: {
      formatted: fullName,
      givenName: nameParts[0] || "",
      familyName: nameParts.slice(1).join(" ") || "",
    },
    displayName: fullName,
    active: member.status === "active",
    emails: [{ value: email, primary: true, type: "work" }],
    meta: {
      resourceType: "User",
      created: member.created_at,
      lastModified: member.updated_at || member.created_at,
      location: `${baseUrl}/Users/${member.id}`,
    },
  };
}

export async function scimCreateUser(
  orgId: string,
  baseUrl: string,
  body: Record<string, unknown>
): Promise<ScimUserResource> {
  const admin = adminClient();

  // Extract email & name from SCIM payload
  const userName = (body.userName as string)?.toLowerCase().trim();
  const emails = body.emails as Array<{ value: string; primary?: boolean }> | undefined;
  const targetEmail = (emails?.[0]?.value || userName)?.toLowerCase().trim();

  if (!targetEmail) {
    throw new Error("Missing required userName or email address");
  }

  const nameObj = body.name as { formatted?: string; givenName?: string; familyName?: string } | undefined;
  const fullName = nameObj?.formatted ||
    [nameObj?.givenName, nameObj?.familyName].filter(Boolean).join(" ") ||
    (body.displayName as string) ||
    targetEmail.split("@")[0];

  const active = body.active !== false;

  // 1. Check if auth user already exists in profiles
  let userId: string;
  const { data: existingProfile } = await admin
    .from("profiles")
    .select("user_id")
    .eq("email", targetEmail)
    .maybeSingle();

  if (existingProfile) {
    userId = existingProfile.user_id;
  } else {
    // Create new identity user via Supabase admin
    const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
      email: targetEmail,
      email_confirm: true,
      user_metadata: { full_name: fullName, scim_provisioned: true },
    });

    if (createErr || !newUser.user) {
      throw new Error(`Failed to create SCIM user account: ${createErr?.message}`);
    }
    userId = newUser.user.id;

    // Create profile
    await admin.from("profiles").upsert({
      user_id: userId,
      email: targetEmail,
      full_name: fullName,
    });
  }

  // 2. Fetch default role from SSO connection or default to "member"
  const { data: sso } = await admin
    .from("enterprise_sso_connections")
    .select("default_role")
    .eq("organization_id", orgId)
    .maybeSingle();

  const defaultRole: OrgRole = (sso?.default_role as OrgRole) || "member";

  // 3. Upsert organization member
  const { data: member, error: memberErr } = await admin
    .from("organization_members")
    .upsert(
      {
        organization_id: orgId,
        user_id: userId,
        role: defaultRole,
        status: active ? "active" : "inactive",
      },
      { onConflict: "organization_id,user_id" }
    )
    .select()
    .single();

  if (memberErr || !member) {
    throw new Error(`Failed to create organization member: ${memberErr?.message}`);
  }

  await recordAuditLog({
    organizationId: orgId,
    userId,
    actorEmail: "scim-agent",
    action: "scim.user.provisioned",
    resourceType: "user",
    resourceId: member.id,
    details: { email: targetEmail, role: defaultRole, active },
  });

  return scimGetUser(orgId, member.id, baseUrl) as Promise<ScimUserResource>;
}

export async function scimPatchUser(
  orgId: string,
  memberId: string,
  baseUrl: string,
  operations: Array<{ op: string; path?: string; value: unknown }>
): Promise<ScimUserResource> {
  const admin = adminClient();

  const existing = await scimGetUser(orgId, memberId, baseUrl);
  if (!existing) {
    throw new Error("User not found");
  }

  let newActive = existing.active;

  for (const op of operations) {
    const opType = op.op.toLowerCase();
    const path = op.path?.toLowerCase();

    if (opType === "replace" || opType === "add") {
      if (path === "active") {
        newActive = Boolean(op.value);
      } else if (typeof op.value === "object" && op.value !== null && "active" in op.value) {
        newActive = Boolean((op.value as { active: boolean }).active);
      }
    }
  }

  const updatedStatus = newActive ? "active" : "inactive";

  await admin
    .from("organization_members")
    .update({ status: updatedStatus, updated_at: new Date().toISOString() })
    .eq("id", memberId)
    .eq("organization_id", orgId);

  // If deactivating (deprovisioning), revoke all active sessions immediately!
  if (!newActive) {
    await admin
      .from("enterprise_sessions")
      .update({ status: "revoked" })
      .eq("organization_id", orgId)
      .eq("user_id", existing.externalId);

    await recordAuditLog({
      organizationId: orgId,
      userId: existing.externalId,
      actorEmail: "scim-agent",
      action: "scim.user.deprovisioned",
      resourceType: "user",
      resourceId: memberId,
      details: { email: existing.userName, reason: "Deactivated via SCIM directory sync" },
    });
  }

  return scimGetUser(orgId, memberId, baseUrl) as Promise<ScimUserResource>;
}

export async function scimDeleteUser(orgId: string, memberId: string): Promise<void> {
  const admin = adminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("user_id")
    .eq("id", memberId)
    .eq("organization_id", orgId)
    .maybeSingle();

  if (!member) return;

  await Promise.all([
    admin
      .from("organization_members")
      .delete()
      .eq("id", memberId)
      .eq("organization_id", orgId),
    admin
      .from("enterprise_sessions")
      .update({ status: "revoked" })
      .eq("organization_id", orgId)
      .eq("user_id", member.user_id),
  ]);

  await recordAuditLog({
    organizationId: orgId,
    userId: member.user_id,
    actorEmail: "scim-agent",
    action: "scim.user.deleted",
    resourceType: "user",
    resourceId: memberId,
    details: { reason: "Deleted via SCIM directory sync" },
  });
}
