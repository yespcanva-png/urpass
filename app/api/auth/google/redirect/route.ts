import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { resolvePostAuthRedirect } from "@/lib/auth-redirect";

export const dynamic = "force-dynamic";

function getAppOrigin(req: NextRequest): string {
  const forwardedHost = req.headers.get("x-forwarded-host");
  const host = forwardedHost || req.headers.get("host") || "";
  const forwardedProto = req.headers.get("x-forwarded-proto");

  if (host) {
    const isLocal =
      host.includes("localhost") ||
      host.includes("127.0.0.1") ||
      host.startsWith("192.168.") ||
      host.startsWith("10.");
    const proto = forwardedProto || (isLocal ? "http" : "https");
    return `${proto}://${host}`.replace(/\/$/, "");
  }

  if (req.nextUrl?.origin && req.nextUrl.origin !== "null") {
    return req.nextUrl.origin.replace(/\/$/, "");
  }

  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  return "https://urpass.space";
}

export async function GET(req: NextRequest) {
  const origin = getAppOrigin(req);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();

  if (!clientId) {
    console.error("[google-redirect] NEXT_PUBLIC_GOOGLE_CLIENT_ID not configured");
    return NextResponse.redirect(`${origin}/login?error=google_not_configured`);
  }

  const target = resolvePostAuthRedirect(
    req.nextUrl.searchParams,
    req.headers.get("referer")
  );

  const nonce = crypto.randomBytes(16).toString("hex");
  const redirectUri = `${origin}/auth/google/callback`;
  const statePayload = {
    next: target,
    nonce,
    redirect_uri: redirectUri,
    ts: Date.now(),
  };
  const encodedState = Buffer.from(JSON.stringify(statePayload)).toString("base64url");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    state: encodedState,
  });

  const response = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  );

  // Store short-lived nonce cookie for CSRF protection (10 minutes)
  response.cookies.set("oauth_state_nonce", nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || origin.startsWith("https://"),
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return response;
}
