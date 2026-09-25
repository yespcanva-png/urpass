import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { recordAuditLog } from "./audit";
import type { OrgRole } from "@/types";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export interface ProvisioningOptions {
  organizationId: string;
  email: string;
  name?: string;
  defaultRole?: OrgRole;
  ssoConnectionId?: string;
  protocol?: "SAML" | "OIDC";
  sessionIndex?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function jitProvisionAndSignIn(opts: ProvisioningOptions): Promise<{
  success: boolean;
  userId?: string;
  isNewUser?: boolean;
  redirectUrl: string;
  error?: string;
}> {
  const admin = adminClient();
  const normalizedEmail = opts.email.toLowerCase().trim();
  const displayName = opts.name || normalizedEmail.split("@")[0];

  try {
    // 1. Fetch organization & SSO connection to verify JIT provisioning policy
    const [orgRes, ssoRes] = await Promise.all([
      admin.from("organizations").select("id, slug, name").eq("id", opts.organizationId).maybeSingle(),
      admin.from("enterprise_sso_connections").select("*").eq("organization_id", opts.organizationId).maybeSingle(),
    ]);

    if (!orgRes.data) {
      return { success: false, redirectUrl: "/login?error=org_not_found", error: "Organization not found." };
    }
    const org = orgRes.data;
    const sso = ssoRes.data;

    // 2. Find or create Supabase user
    const { data: profileRow } = await admin
      .from("profiles")
      .select("user_id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    let userId = profileRow?.user_id;
    let isNewUser = false;

    if (userId) {
      // Update metadata
      await admin.auth.admin.updateUserById(userId, {
        user_metadata: {
          full_name: displayName,
          last_sso_login: new Date().toISOString(),
          sso_protocol: opts.protocol || sso?.protocol || "SAML",
        },
      });
    } else {
      isNewUser = true;
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: normalizedEmail,
        email_confirm: true,
        user_metadata: {
          full_name: displayName,
          sso_protocol: opts.protocol || sso?.protocol || "SAML",
          sso_organization_id: opts.organizationId,
        },
      });

      if (createErr || !created.user) {
        return {
          success: false,
          redirectUrl: "/login?error=user_creation_failed",
          error: createErr?.message || "Failed to create user account.",
        };
      }
      userId = created.user.id;
    }

    // 3. Check / Provision Organization Membership
    const { data: existingMember } = await admin
      .from("organization_members")
      .select("id, user_id, role, status")
      .eq("organization_id", opts.organizationId)
      .or(`user_id.eq.${userId},invited_email.eq.${normalizedEmail}`)
      .maybeSingle();

    const roleToAssign: OrgRole = (opts.defaultRole || sso?.default_role || "member") as OrgRole;

    if (existingMember) {
      if (existingMember.status !== "active" || !existingMember.user_id) {
        await admin
          .from("organization_members")
          .update({
            user_id: userId,
            status: "active",
            joined_at: new Date().toISOString(),
          })
          .eq("id", existingMember.id);
      }
    } else {
      // If user is not an existing member, verify JIT provisioning setting
      const jitEnabled = sso ? sso.jit_provisioning : true;
      if (!jitEnabled) {
        await recordAuditLog({
          organizationId: opts.organizationId,
          userId,
          actorEmail: normalizedEmail,
          action: "sso.login.rejected_no_jit",
          resourceType: "sso_connection",
          resourceId: sso?.id,
          details: { email: normalizedEmail, reason: "JIT auto-provisioning is disabled" },
          ipAddress: opts.ipAddress,
          userAgent: opts.userAgent,
        });

        return {
          success: false,
          redirectUrl: "/login?error=sso_jit_disabled",
          error: "Your organization requires an explicit administrator invitation. JIT provisioning is disabled.",
        };
      }

      // Provision new member
      await admin.from("organization_members").insert({
        organization_id: opts.organizationId,
        user_id: userId,
        invited_email: normalizedEmail,
        role: roleToAssign,
        status: "active",
        joined_at: new Date().toISOString(),
      });
    }

    // 4. Record session tracking
    await admin.from("enterprise_sessions").insert({
      organization_id: opts.organizationId,
      user_id: userId,
      sso_connection_id: sso?.id || opts.ssoConnectionId || null,
      idp_session_index: opts.sessionIndex || null,
      ip_address: opts.ipAddress || null,
      user_agent: opts.userAgent || null,
      device: parseDevice(opts.userAgent),
      status: "active",
      last_active_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days
    });

    // 5. Audit Log
    await recordAuditLog({
      organizationId: opts.organizationId,
      userId,
      actorEmail: normalizedEmail,
      action: "sso.login.success",
      resourceType: "sso_connection",
      resourceId: sso?.id,
      details: {
        protocol: opts.protocol || sso?.protocol,
        isNewUser,
        role: existingMember ? existingMember.role : roleToAssign,
      },
      ipAddress: opts.ipAddress,
      userAgent: opts.userAgent,
    });

    // 6. Generate magic link and verify OTP into Supabase cookie session
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: normalizedEmail,
    });

    if (linkErr || !linkData?.properties?.hashed_token) {
      return {
        success: false,
        redirectUrl: "/login?error=session_generation_failed",
        error: linkErr?.message || "Failed to generate login token.",
      };
    }

    const serverClient = await createClient();
    const { error: otpErr } = await serverClient.auth.verifyOtp({
      token_hash: linkData.properties.hashed_token,
      type: "email",
    });

    if (otpErr) {
      return {
        success: false,
        redirectUrl: "/login?error=session_verification_failed",
        error: otpErr.message,
      };
    }

    const redirectUrl = `/org/${org.slug}`;
    return {
      success: true,
      userId,
      isNewUser,
      redirectUrl,
    };
  } catch (err: unknown) {
    console.error("[jit-provisioning] Unhandled error:", err);
    return {
      success: false,
      redirectUrl: "/login?error=internal_sso_error",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function parseDevice(userAgent?: string | null): string {
  if (!userAgent) return "Web Browser";
  if (/mobile/i.test(userAgent)) return "Mobile Device";
  if (/macintosh|mac os x/i.test(userAgent)) return "Mac";
  if (/windows/i.test(userAgent)) return "Windows PC";
  if (/linux/i.test(userAgent)) return "Linux PC";
  return "Web Browser";
}
