import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { validateSamlResponse, getBaseAppUrl } from "@/lib/sso/saml";
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const appUrl = getBaseAppUrl();
  const { orgId } = await params;

  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;
  const userAgent = req.headers.get("user-agent") || null;

  try {
    const formData = await req.formData();
    const samlResponse = formData.get("SAMLResponse")?.toString();

    if (!samlResponse) {
      return NextResponse.redirect(`${appUrl}/login?error=missing_saml_response`);
    }

    const admin = adminClient();
    const { data: sso } = await admin
      .from("enterprise_sso_connections")
      .select("*")
      .eq("organization_id", orgId)
      .maybeSingle();

    if (!sso) {
      return NextResponse.redirect(`${appUrl}/login?error=sso_connection_not_found`);
    }

    // Validate assertion and certificate
    const result = validateSamlResponse(samlResponse, sso.idp_certificate);
    if (!result.valid || !result.email) {
      await recordAuditLog({
        organizationId: orgId,
        actorEmail: result.email || null,
        action: "sso.login.failed",
        resourceType: "sso_connection",
        resourceId: sso.id,
        details: { error: result.error, protocol: "SAML" },
        ipAddress,
        userAgent,
      });

      const errorMsg = encodeURIComponent(result.error || "SAML assertion validation failed");
      return NextResponse.redirect(`${appUrl}/login?error=saml_validation_failed&msg=${errorMsg}`);
    }

    // JIT provision user & set session cookie
    const provisionResult = await jitProvisionAndSignIn({
      organizationId: orgId,
      email: result.email,
      name: result.name,
      defaultRole: sso.default_role,
      ssoConnectionId: sso.id,
      protocol: "SAML",
      sessionIndex: result.sessionIndex,
      ipAddress,
      userAgent,
    });

    if (!provisionResult.success) {
      const err = encodeURIComponent(provisionResult.error || "Failed to provision user");
      return NextResponse.redirect(`${appUrl}/login?error=provisioning_failed&msg=${err}`);
    }

    return NextResponse.redirect(`${appUrl}${provisionResult.redirectUrl}`);
  } catch (err: unknown) {
    console.error("[saml-acs] Unhandled POST error:", err);
    return NextResponse.redirect(`${appUrl}/login?error=saml_server_error`);
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params;
  return new NextResponse(
    `URPASS SAML Assertion Consumer Service endpoint for Organization ${orgId}. Please submit assertions via HTTP POST.`,
    { status: 200, headers: { "Content-Type": "text/plain" } }
  );
}
