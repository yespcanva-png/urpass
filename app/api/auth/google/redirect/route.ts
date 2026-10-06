import { NextRequest, NextResponse } from "next/server";
import { resolvePostAuthRedirect } from "@/lib/auth-redirect";

export const dynamic = "force-dynamic";

function getAppOrigin(req: NextRequest): string {
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const forwardedHost = req.headers.get("x-forwarded-host");
  if (forwardedHost) {
    const proto = forwardedProto || "https";
    return `${proto}://${forwardedHost}`.replace(/\/$/, "");
  }
  const host = req.headers.get("host");
  if (host) {
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
    const proto = forwardedProto || (isLocal ? "http" : "https");
    return `${proto}://${host}`.replace(/\/$/, "");
  }
  return (process.env.NEXT_PUBLIC_APP_URL || "https://urpass.space").replace(/\/$/, "");
}

export async function GET(req: NextRequest) {
  const origin = getAppOrigin(req);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(`${origin}/login?error=google_not_configured`);
  }

  const target = resolvePostAuthRedirect(
    req.nextUrl.searchParams,
    req.headers.get("referer")
  );

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    state: target,
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  );
}
