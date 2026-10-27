import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, refreshAccessToken } from "@/lib/mcp/oauth";

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
  let params: Record<string, string> = {};

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await req.formData();
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });
  } else {
    try {
      params = await req.json();
    } catch {
      return NextResponse.json(
        { error: "invalid_request", error_description: "Unable to parse request body" },
        { status: 400, headers: CORS_HEADERS }
      );
    }
  }

  const grantType = params.grant_type;

  if (grantType === "authorization_code") {
    const { code, client_id, redirect_uri, code_verifier } = params;

    if (!code) {
      return NextResponse.json(
        { error: "invalid_request", error_description: "Missing code parameter" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    try {
      const result = exchangeCodeForTokens({
        code,
        clientId: client_id || "claude",
        redirectUri: redirect_uri,
        codeVerifier: code_verifier,
      });

      return NextResponse.json(
        {
          access_token: result.accessToken,
          token_type: result.tokenType,
          expires_in: result.expiresIn,
          refresh_token: result.refreshToken,
          scope: result.scopes.join(" "),
          organization_id: result.organizationId || null,
        },
        { headers: CORS_HEADERS }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        { error: "invalid_grant", error_description: msg },
        { status: 400, headers: CORS_HEADERS }
      );
    }
  }

  if (grantType === "refresh_token") {
    const refreshToken = params.refresh_token;
    if (!refreshToken) {
      return NextResponse.json(
        { error: "invalid_request", error_description: "Missing refresh_token parameter" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    try {
      const result = refreshAccessToken(refreshToken);
      return NextResponse.json(
        {
          access_token: result.accessToken,
          token_type: result.tokenType,
          expires_in: result.expiresIn,
          refresh_token: result.refreshToken,
          scope: result.scopes.join(" "),
        },
        { headers: CORS_HEADERS }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        { error: "invalid_grant", error_description: msg },
        { status: 400, headers: CORS_HEADERS }
      );
    }
  }

  return NextResponse.json(
    { error: "unsupported_grant_type", error_description: `Grant type '${grantType}' not supported` },
    { status: 400, headers: CORS_HEADERS }
  );
}
