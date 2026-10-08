import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { resolvePostAuthRedirect } from "@/lib/auth-redirect";
import { getAppOrigin, getGoogleOAuthCredentials } from "@/lib/supabase/config";
import { logAuth, logAuthError } from "@/lib/auth/logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const origin = getAppOrigin(req);
  const { clientId } = getGoogleOAuthCredentials();
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

  if (!clientId) {
    logAuthError("google_redirect", "Google Client ID not configured", null, { origin, clientIp });
    return NextResponse.redirect(`${origin}/login?error=google_not_configured`);
  }

  const target = resolvePostAuthRedirect(
    req.nextUrl.searchParams,
    req.headers.get("referer")
  );

  logAuth("google_redirect", "Initiating Google OAuth flow", {
    target,
    origin,
    clientIp,
  });

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

  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private, max-age=0");
  response.headers.set("Pragma", "no-cache");

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
