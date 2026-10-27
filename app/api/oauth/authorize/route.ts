import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  KNOWN_OAUTH_CLIENTS,
  isValidRedirectUri,
  parseScopes,
  createAuthorizationCode,
} from "@/lib/mcp/oauth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("client_id") || "claude";
  const redirectUri = searchParams.get("redirect_uri");
  const responseType = searchParams.get("response_type") || "code";
  const scope = searchParams.get("scope");
  const state = searchParams.get("state") || "";
  const codeChallenge = searchParams.get("code_challenge") || undefined;
  const codeChallengeMethod = (searchParams.get("code_challenge_method") as "S256" | "plain") || "S256";

  if (!redirectUri) {
    return NextResponse.json(
      { error: "invalid_request", error_description: "Missing redirect_uri parameter" },
      { status: 400 }
    );
  }

  const client = KNOWN_OAUTH_CLIENTS[clientId] || KNOWN_OAUTH_CLIENTS["claude-custom"];
  if (!isValidRedirectUri(client, redirectUri)) {
    return NextResponse.json(
      { error: "invalid_request", error_description: "Invalid redirect_uri for this client" },
      { status: 400 }
    );
  }

  if (responseType !== "code") {
    const errorUrl = new URL(redirectUri);
    errorUrl.searchParams.set("error", "unsupported_response_type");
    if (state) errorUrl.searchParams.set("state", state);
    return NextResponse.redirect(errorUrl.toString());
  }

  // Check if user is authenticated in UrPass
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to login with return path to this authorization endpoint
    const returnUrl = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(new URL(`/login?returnTo=${returnUrl}`, req.url));
  }

  // Redirect to authorization consent screen UI
  const consentUrl = new URL("/oauth/authorize", req.url);
  consentUrl.searchParams.set("client_id", clientId);
  consentUrl.searchParams.set("redirect_uri", redirectUri);
  consentUrl.searchParams.set("scope", scope || "");
  consentUrl.searchParams.set("state", state);
  if (codeChallenge) consentUrl.searchParams.set("code_challenge", codeChallenge);
  if (codeChallengeMethod) consentUrl.searchParams.set("code_challenge_method", codeChallengeMethod);

  return NextResponse.redirect(consentUrl.toString());
}

export async function POST(req: NextRequest) {
  // Direct approval action from consent page or API
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized", message: "Sign in required" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      clientId = "claude",
      redirectUri,
      scope,
      state,
      codeChallenge,
      codeChallengeMethod,
      organizationId,
      action,
    } = body;

    if (!redirectUri) {
      return NextResponse.json({ error: "Missing redirectUri" }, { status: 400 });
    }

    if (action === "deny") {
      const denyUrl = new URL(redirectUri);
      denyUrl.searchParams.set("error", "access_denied");
      denyUrl.searchParams.set("error_description", "User denied authorization request");
      if (state) denyUrl.searchParams.set("state", state);
      return NextResponse.json({ success: false, redirectUrl: denyUrl.toString() });
    }

    const scopes = parseScopes(scope);

    const code = createAuthorizationCode({
      clientId,
      userId: user.id,
      organizationId: organizationId || null,
      scopes,
      redirectUri,
      codeChallenge,
      codeChallengeMethod,
    });

    const successUrl = new URL(redirectUri);
    successUrl.searchParams.set("code", code);
    if (state) successUrl.searchParams.set("state", state);

    return NextResponse.json({
      success: true,
      code,
      redirectUrl: successUrl.toString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "authorization_failed", message: msg }, { status: 500 });
  }
}
