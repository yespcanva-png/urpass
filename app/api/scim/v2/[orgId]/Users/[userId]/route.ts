import { NextRequest, NextResponse } from "next/server";
import { verifyScimToken, scimGetUser, scimPatchUser, scimDeleteUser } from "@/lib/sso/scim";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string; userId: string }> }
) {
  const { orgId, userId } = await params;
  const authHeader = req.headers.get("authorization");

  const isAuthorized = await verifyScimToken(orgId, authHeader);
  if (!isAuthorized) {
    return NextResponse.json(
      { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "401", detail: "Unauthorized SCIM bearer token" },
      { status: 401, headers: { "Content-Type": "application/scim+json" } }
    );
  }

  const baseUrl = `${new URL(req.url).origin}/api/scim/v2/${orgId}`;
  const user = await scimGetUser(orgId, userId, baseUrl);

  if (!user) {
    return NextResponse.json(
      { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "404", detail: "User not found" },
      { status: 404, headers: { "Content-Type": "application/scim+json" } }
    );
  }

  return NextResponse.json(user, {
    headers: { "Content-Type": "application/scim+json" },
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string; userId: string }> }
) {
  const { orgId, userId } = await params;
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
    const operations = body.Operations || [];
    const updated = await scimPatchUser(orgId, userId, baseUrl, operations);
    return NextResponse.json(updated, {
      headers: { "Content-Type": "application/scim+json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update user";
    return NextResponse.json(
      { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "400", detail: msg },
      { status: 400, headers: { "Content-Type": "application/scim+json" } }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string; userId: string }> }
) {
  const { orgId, userId } = await params;
  const authHeader = req.headers.get("authorization");

  const isAuthorized = await verifyScimToken(orgId, authHeader);
  if (!isAuthorized) {
    return NextResponse.json(
      { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "401", detail: "Unauthorized SCIM bearer token" },
      { status: 401, headers: { "Content-Type": "application/scim+json" } }
    );
  }

  try {
    await scimDeleteUser(orgId, userId);
    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete user";
    return NextResponse.json(
      { schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], status: "400", detail: msg },
      { status: 400, headers: { "Content-Type": "application/scim+json" } }
    );
  }
}
