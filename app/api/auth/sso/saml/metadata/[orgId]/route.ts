import { NextRequest, NextResponse } from "next/server";
import { generateSpMetadataXml } from "@/lib/sso/saml";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params;
  if (!orgId) {
    return new NextResponse("Missing organization ID", { status: 400 });
  }

  let orgName = "URPASS Organization";
  try {
    const admin = adminClient();
    const { data: org } = await admin
      .from("organizations")
      .select("name")
      .eq("id", orgId)
      .maybeSingle();

    if (org?.name) {
      orgName = org.name;
    }
  } catch (err) {
    console.warn("[saml-metadata] Could not resolve org name:", err);
  }

  const xml = generateSpMetadataXml(orgId, orgName);

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Content-Disposition": `inline; filename="urpass-saml-sp-${orgId}.xml"`,
    },
  });
}
