import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { buildOidcAuthorizationUrl, getOidcCallbackUrl } from "@/lib/sso/oidc";
import { getBaseAppUrl } from "@/lib/sso/saml";
import crypto from "node:crypto";

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
  const orgId = searchParams.get("orgId");
  const email = searchParams.get("email");

  if (!orgId) {
    return NextResponse.redirect(`${appUrl}/login?error=missing_org_id`);
  }

  const admin = adminClient();
  const { data: sso } = await admin
    .from("enterprise_sso_connections")
    .select("*")
    .eq("organization_id", orgId)
    .maybeSingle();

  if (!sso || sso.status !== "active") {
    return NextResponse.redirect(`${appUrl}/login?error=sso_not_active`);
  }

  if (sso.protocol !== "OIDC" || !sso.oidc_client_id || !sso.oidc_authorization_endpoint) {
    return NextResponse.redirect(`${appUrl}/login?error=invalid_oidc_config`);
  }

  const state = crypto.randomBytes(20).toString("hex");
  const nonce = crypto.randomBytes(20).toString("hex");
  const redirectUri = getOidcCallbackUrl();

  const authUrl = buildOidcAuthorizationUrl({
    authorizationEndpoint: sso.oidc_authorization_endpoint,
    clientId: sso.oidc_client_id,
    redirectUri,
    state,
    nonce,
  });

  const statePayload = JSON.stringify({
    orgId,
    state,
    nonce,
    email: email || undefined,
    created: Date.now(),
  });

  const res = NextResponse.redirect(authUrl);
  res.cookies.set("urpass_oidc_state", Buffer.from(statePayload).toString("base64"), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });

  return res;
}
