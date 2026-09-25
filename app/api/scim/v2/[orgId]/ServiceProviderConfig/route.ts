import { NextRequest, NextResponse } from "next/server";
import { getScimServiceProviderConfig } from "@/lib/sso/scim";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params;
  const baseUrl = `${new URL(req.url).origin}/api/scim/v2/${orgId}`;
  const config = getScimServiceProviderConfig(baseUrl);

  return NextResponse.json(config, {
    headers: { "Content-Type": "application/scim+json" },
  });
}
