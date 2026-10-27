import { NextResponse } from "next/server";
import { ALL_MCP_SCOPES } from "@/lib/mcp/oauth";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  const metadata = {
    issuer: "https://urpass.space",
    authorization_endpoint: "https://urpass.space/api/oauth/authorize",
    token_endpoint: "https://urpass.space/api/oauth/token",
    revocation_endpoint: "https://urpass.space/api/oauth/revoke",
    response_types_supported: ["code"],
    response_modes_supported: ["query"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256", "plain"],
    token_endpoint_auth_methods_supported: ["none", "client_secret_post", "client_secret_basic"],
    scopes_supported: ALL_MCP_SCOPES,
    service_documentation: "https://urpass.space/docs#mcp",
    ui_locales_supported: ["en"],
  };

  return NextResponse.json(metadata, { headers: CORS_HEADERS });
}
