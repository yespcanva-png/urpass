import { NextRequest, NextResponse } from "next/server";
import { revokeOAuthToken } from "@/lib/mcp/oauth";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  let token = "";

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await req.formData();
    token = formData.get("token")?.toString() || "";
  } else {
    try {
      const body = await req.json();
      token = body.token || "";
    } catch {
      // ignore
    }
  }

  if (!token) {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7).trim();
    }
  }

  if (!token) {
    return NextResponse.json(
      { error: "invalid_request", error_description: "Missing token parameter" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const revoked = revokeOAuthToken(token);

  return NextResponse.json({ success: true, revoked }, { headers: CORS_HEADERS });
}
