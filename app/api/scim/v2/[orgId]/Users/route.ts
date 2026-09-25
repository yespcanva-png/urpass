import { NextRequest, NextResponse } from "next/server";
import { verifyScimToken, scimListUsers, scimCreateUser } from "@/lib/sso/scim";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params;
  const authHeader = req.headers.get("authorization");

  const isAuthorized = await verifyScimToken(orgId, authHeader);
  if (!isAuthorized) {
    return NextResponse.json(
      { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "401", detail: "Unauthorized SCIM bearer token" },
      { status: 401, headers: { "Content-Type": "application/scim+json" } }
    );
  }

  const url = new URL(req.url);
  const baseUrl = `${url.origin}/api/scim/v2/${orgId}`;
  const filter = url.searchParams.get("filter");
  const startIndex = parseInt(url.searchParams.get("startIndex") || "1", 10);
  const count = parseInt(url.searchParams.get("count") || "50", 10);

  try {
    const result = await scimListUsers(orgId, baseUrl, filter, startIndex, count);
    return NextResponse.json(result, {
      headers: { "Content-Type": "application/scim+json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal SCIM error";
    return NextResponse.json(
      { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "500", detail: msg },
      { status: 500, headers: { "Content-Type": "application/scim+json" } }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params;
  const authHeader = req.headers.get("authorization");

  const isAuthorized = await verifyScimToken(orgId, authHeader);
  if (!isAuthorized) {
    return NextResponse.json(
      { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "401", detail: "Unauthorized SCIM bearer token" },
      { status: 401, headers: { "Content-Type": "application/scim+json" } }
    );
  }

  const baseUrl = `${new URL(req.url).origin}/api/scim/v2/${orgId}`;

  try {
    const body = await req.json();
    const user = await scimCreateUser(orgId, baseUrl, body);
    return NextResponse.json(user, {
      status: 201,
      headers: {
        "Content-Type": "application/scim+json",
        Location: `${baseUrl}/Users/${user.id}`,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create user";
    return NextResponse.json(
      { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "400", detail: msg },
      { status: 400, headers: { "Content-Type": "application/scim+json" } }
    );
  }
}
