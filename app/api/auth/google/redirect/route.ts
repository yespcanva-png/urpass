import { NextRequest, NextResponse } from "next/server";
import { resolvePostAuthRedirect } from "@/lib/auth-redirect";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
    return NextResponse.redirect(`${base}/login?error=google_not_configured`);
  }

  // Derive the app origin consistently
  const proto = req.headers.get("x-forwarded-proto") ?? (req.url.startsWith("https") ? "https" : "http");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? (host ? `${proto}://${host}` : new URL(req.url).origin);

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
