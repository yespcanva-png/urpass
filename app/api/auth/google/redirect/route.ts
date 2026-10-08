import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { resolvePostAuthRedirect } from "@/lib/auth-redirect";
import { createClient } from "@/lib/supabase/server";
import {
  GOOGLE_OAUTH_NEXT_COOKIE,
  GOOGLE_OAUTH_NONCE_COOKIE,
} from "@/lib/supabase/auth-cookies";

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

  const supabase = await createClient();

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

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUri,
      scopes: "openid email profile",
      queryParams: {
        prompt: "select_account",
      },
    },
  });

  if (error || !data.url) {
    console.error("[google-redirect] Supabase OAuth URL error:", error?.message);
    return NextResponse.redirect(`${origin}/login?error=google_not_configured`);
  }

  const response = NextResponse.redirect(data.url);

  response.cookies.set(GOOGLE_OAUTH_NONCE_COOKIE, nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || origin.startsWith("https://"),
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  response.cookies.set(
    GOOGLE_OAUTH_NEXT_COOKIE,
    Buffer.from(JSON.stringify(statePayload)).toString("base64url"),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || origin.startsWith("https://"),
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    }
  );

  return response;
}
