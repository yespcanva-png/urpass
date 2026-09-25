import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  generateSpEntityId,
  generateAcsUrl,
  createSamlAuthnRequest,
  getBaseAppUrl,
} from "@/lib/sso/saml";

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

  if (sso.protocol !== "SAML" || !sso.idp_sso_url) {
    return NextResponse.redirect(`${appUrl}/login?error=invalid_sso_protocol`);
  }

  const spEntityId = generateSpEntityId(orgId);
  const acsUrl = generateAcsUrl(orgId);

  const relayState = JSON.stringify({
    orgId,
    email: email || undefined,
    ts: Date.now(),
  });

  const { redirectUrl } = createSamlAuthnRequest({
    spEntityId,
    acsUrl,
    idpSsoUrl: sso.idp_sso_url,
    relayState: Buffer.from(relayState).toString("base64"),
  });

  return NextResponse.redirect(redirectUrl);
}
