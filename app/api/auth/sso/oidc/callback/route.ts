import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  exchangeOidcCode,
  parseJwtPayload,
  fetchOidcUserInfo,
  getOidcCallbackUrl,
} from "@/lib/sso/oidc";
import { getBaseAppUrl } from "@/lib/sso/saml";
import { jitProvisionAndSignIn } from "@/lib/sso/provisioning";
import { recordAuditLog } from "@/lib/sso/audit";

export const dynamic = "force-dynamic";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(req: NextRequest) {
  const appUrl = getBaseAppUrl();
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const idpError = searchParams.get("error");
  const idpErrorDesc = searchParams.get("error_description");

  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;
  const userAgent = req.headers.get("user-agent") || null;

  if (idpError || !code || !state) {
    const msg = encodeURIComponent(idpErrorDesc || idpError || "OIDC authentication was denied or cancelled.");
    return NextResponse.redirect(`${appUrl}/login?error=oidc_failed&msg=${msg}`);
  }

  // Read state cookie
  const cookieVal = req.cookies.get("urpass_oidc_state")?.value;
  if (!cookieVal) {
    return NextResponse.redirect(`${appUrl}/login?error=oidc_missing_state_cookie`);
  }

  let stateData: { orgId: string; state: string; nonce: string };
  try {
    stateData = JSON.parse(Buffer.from(cookieVal, "base64").toString("utf-8"));
  } catch {
    return NextResponse.redirect(`${appUrl}/login?error=oidc_invalid_state_cookie`);
  }

  if (stateData.state !== state) {
    return NextResponse.redirect(`${appUrl}/login?error=oidc_state_mismatch`);
  }

  const orgId = stateData.orgId;
  const admin = adminClient();
  const { data: sso } = await admin
    .from("enterprise_sso_connections")
    .select("*")
    .eq("organization_id", orgId)
    .maybeSingle();

  if (!sso || !sso.oidc_token_endpoint || !sso.oidc_client_id) {
    return NextResponse.redirect(`${appUrl}/login?error=oidc_config_error`);
  }

  const redirectUri = getOidcCallbackUrl();

  // Exchange code for tokens
  const tokenRes = await exchangeOidcCode({
    tokenEndpoint: sso.oidc_token_endpoint,
    clientId: sso.oidc_client_id,
    clientSecret: sso.oidc_client_secret,
    code,
    redirectUri,
  });

  if (tokenRes.error || (!tokenRes.access_token && !tokenRes.id_token)) {
    await recordAuditLog({
      organizationId: orgId,
      action: "sso.login.failed",
      resourceType: "sso_connection",
      resourceId: sso.id,
      details: { error: tokenRes.error, protocol: "OIDC" },
      ipAddress,
      userAgent,
    });

    const msg = encodeURIComponent(tokenRes.error || "Token exchange failed");
    return NextResponse.redirect(`${appUrl}/login?error=oidc_token_exchange_failed&msg=${msg}`);
  }

  let email: string | undefined;
  let name: string | undefined;

  // Extract from id_token first
  if (tokenRes.id_token) {
    const claims = parseJwtPayload(tokenRes.id_token);
    if (claims) {
      email = (claims.email || claims.upn || claims.preferred_username) as string | undefined;
      name = (claims.name || claims.displayName) as string | undefined;
    }
  }

  // Fallback to userinfo endpoint if email not in id_token
  if (!email && sso.oidc_userinfo_endpoint && tokenRes.access_token) {
    const userInfo = await fetchOidcUserInfo({
      userinfoEndpoint: sso.oidc_userinfo_endpoint,
      accessToken: tokenRes.access_token,
    });
    if (userInfo.email) {
      email = userInfo.email;
      name = name || userInfo.name;
    }
  }

  if (!email) {
    const msg = encodeURIComponent("Identity provider did not return an email address.");
    return NextResponse.redirect(`${appUrl}/login?error=oidc_no_email&msg=${msg}`);
  }

  // JIT Provision and sign in
  const provisionResult = await jitProvisionAndSignIn({
    organizationId: orgId,
    email,
    name,
    defaultRole: sso.default_role,
    ssoConnectionId: sso.id,
    protocol: "OIDC",
    ipAddress,
    userAgent,
  });

  if (!provisionResult.success) {
    const err = encodeURIComponent(provisionResult.error || "Failed to provision user");
    return NextResponse.redirect(`${appUrl}/login?error=provisioning_failed&msg=${err}`);
  }

  const finalResponse = NextResponse.redirect(`${appUrl}${provisionResult.redirectUrl}`);
  finalResponse.cookies.delete("urpass_oidc_state");
  return finalResponse;
}
