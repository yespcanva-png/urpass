import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseUrl, getSupabaseAnonKey, getSupabaseServiceRoleKey, getAppOrigin, getGoogleOAuthCredentials } from "@/lib/supabase/config";
import { notifyOwnerNewUser, notifyOwnerUserLogin, sendUserWelcomeEmail } from "@/lib/email";
import { resolvePostAuthRedirect } from "@/lib/auth-redirect";
import { logAuth, logAuthWarn, logAuthError } from "@/lib/auth/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const EXTERNAL_TIMEOUT_MS = 6_000;

// Short-lived in-memory cache of recently exchanged authorization codes (prevents duplicate token exchange errors on double-click/prefetch)
const recentExchangedCodes = new Map<string, { destination: string; ts: number }>();

function cleanupExchangedCodes() {
  const now = Date.now();
  for (const [key, value] of recentExchangedCodes.entries()) {
    if (now - value.ts > 120_000) {
      recentExchangedCodes.delete(key);
    }
  }
}

export function clearRecentExchangedCodes() {
  recentExchangedCodes.clear();
}

interface GoogleTokenInfo {
  sub: string;
  email: string;
  email_verified: string | boolean;
  name?: string;
  picture?: string;
  aud: string;
}

function adminClient() {
  return createSupabaseAdmin(
    getSupabaseUrl(),
    getSupabaseServiceRoleKey(),
    {
      auth: { autoRefreshToken: false, persistSession: false },
      global: {
        fetch: (url, options) => {
          return fetch(url, {
            ...options,
            signal: AbortSignal.timeout(EXTERNAL_TIMEOUT_MS),
          });
        },
      },
    }
  );
}

async function getExistingSessionUser(req: NextRequest) {
  try {
    const supabase = createServerClient(
      getSupabaseUrl(),
      getSupabaseAnonKey(),
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll() {},
        },
      }
    );
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user || null;
  } catch {
    return null;
  }
}

function decodeGoogleIdToken(idToken: string): GoogleTokenInfo | null {
  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) return null;
    const payloadJson = Buffer.from(parts[1], "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson);
    if (payload && typeof payload === "object" && payload.sub && payload.email) {
      return payload as GoogleTokenInfo;
    }
  } catch {
    // Ignore decode errors and fall back to tokeninfo fetch
  }
  return null;
}

export async function GET(req: NextRequest) {
  const origin = getAppOrigin(req);

  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    logAuth("google_callback", "Received Google OAuth callback", {
      origin,
      code: code ? "present" : "missing",
      state: state ? "present" : "missing",
      error: error || undefined,
    });

    if (error) {
      logAuthWarn("google_callback", "Google returned error in callback", { error, errorDescription });
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}`);
    }

    // Resolve state & exact redirect_uri used during the initial authorization redirect
    let redirectUri = `${origin}/auth/google/callback`;
    let targetPath = "/dashboard";
    if (state) {
      try {
        const decodedStr = Buffer.from(state, "base64url").toString("utf8");
        if (decodedStr.startsWith("{") && decodedStr.endsWith("}")) {
          const parsed = JSON.parse(decodedStr);
          if (parsed && typeof parsed === "object") {
            if (parsed.next) targetPath = String(parsed.next);
            if (parsed.redirect_uri && typeof parsed.redirect_uri === "string") {
              redirectUri = parsed.redirect_uri;
            }
          }
        } else {
          targetPath = state;
        }
      } catch {
        try {
          const decodedStr = Buffer.from(state, "base64").toString("utf8");
          if (decodedStr.startsWith("{") && decodedStr.endsWith("}")) {
            const parsed = JSON.parse(decodedStr);
            if (parsed && typeof parsed === "object") {
              if (parsed.next) targetPath = String(parsed.next);
              if (parsed.redirect_uri && typeof parsed.redirect_uri === "string") {
                redirectUri = parsed.redirect_uri;
              }
            }
          } else {
            targetPath = state;
          }
        } catch {
          targetPath = state;
        }
      }
    }

    // Ensure redirectUri strictly uses https in production / non-local domains
    if (redirectUri.startsWith("http://") && !redirectUri.includes("localhost") && !redirectUri.includes("127.0.0.1")) {
      redirectUri = redirectUri.replace(/^http:\/\//, "https://");
    }

    if (!code) {
      const existingUser = await getExistingSessionUser(req);
      if (existingUser) {
        logAuth("google_callback", "No code but user already authenticated, redirecting", {
          userId: existingUser.id,
          targetPath,
        });
        const target = resolvePostAuthRedirect(
          { get: (k: string) => (k === "next" ? targetPath : null) },
          null
        );
        const res = NextResponse.redirect(`${origin}${target}`);
        res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private, max-age=0");
        return res;
      }
      logAuthWarn("google_callback", "Missing authorization code and no active session");
      return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=init`);
    }

    // 1. Check in-memory recent exchange cache (prevents duplicate code replay from double-click or browser prefetching)
    cleanupExchangedCodes();
    const cachedExchange = recentExchangedCodes.get(code);
    if (cachedExchange) {
      logAuth("google_callback", "Duplicate code detected in cache, reusing destination", {
        destination: cachedExchange.destination,
      });
      const res = NextResponse.redirect(`${origin}${cachedExchange.destination}`);
      res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private, max-age=0");
      res.headers.set("Pragma", "no-cache");
      return res;
    }

    const { clientId, clientSecret } = getGoogleOAuthCredentials();

    if (!clientId || !clientSecret) {
      logAuthError("google_callback", "Google client credentials missing in environment", null, {
        clientIdPresent: !!clientId,
        clientSecretPresent: !!clientSecret,
      });
      return NextResponse.redirect(`${origin}/login?error=google_not_configured`);
    }

    // 2. Exchange authorization code for Google tokens with strict 8s timeout
    logAuth("token_exchange", "Exchanging authorization code with Google token endpoint", {
      redirectUri,
    });
    const tokenStartTime = Date.now();
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      signal: AbortSignal.timeout(EXTERNAL_TIMEOUT_MS),
    });

    const tokens = await tokenRes.json().catch(() => null);
    const tokenDuration = Date.now() - tokenStartTime;

    if (!tokenRes.ok || !tokens) {
      logAuthError("token_exchange", "Google token exchange failed", tokens, {
        status: tokenRes.status,
        durationMs: tokenDuration,
      });

      // Graceful fallback for duplicate requests where the session was already established
      const existingUser = await getExistingSessionUser(req);
      if (existingUser) {
        logAuth("google_callback", "Token exchange failed but active session found, redirecting", {
          userId: existingUser.id,
          targetPath,
        });
        const target = resolvePostAuthRedirect(
          { get: (k: string) => (k === "next" ? targetPath : null) },
          null
        );
        const res = NextResponse.redirect(`${origin}${target}`);
        res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private, max-age=0");
        return res;
      }

      const isInvalidGrant =
        tokens?.error === "invalid_grant" ||
        String(tokens?.error_description || "").toLowerCase().includes("bad request");

      if (isInvalidGrant) {
        return NextResponse.redirect(
          `${origin}/login?error=google_session_expired`
        );
      }

      return NextResponse.redirect(
        `${origin}/login?error=google_auth_failed&step=exchange`
      );
    }

    logAuth("token_exchange", "Google token exchange succeeded", { durationMs: tokenDuration });

    // 3. Extract verified user profile from ID token or userinfo endpoint
    let info: GoogleTokenInfo | null = null;
    if (tokens.id_token) {
      info = decodeGoogleIdToken(tokens.id_token);
    }

    if (!info || !info.email) {
      const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
        signal: AbortSignal.timeout(EXTERNAL_TIMEOUT_MS),
      });

      if (!userRes.ok) {
        console.error("[google-callback] userinfo error:", userRes.status);
        return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=userinfo`);
      }

      info = (await userRes.json()) as GoogleTokenInfo;
    }

    if (clientId && info.aud) {
      const normalizedAud = info.aud.replace(".apps.googleusercontent.com", "").trim();
      const normalizedClient = clientId.replace(".apps.googleusercontent.com", "").trim();
      if (normalizedAud !== normalizedClient) {
        console.error("[google-callback] aud mismatch. Token aud:", info.aud, "Expected:", clientId);
        return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=aud`);
      }
    }

    const isVerified =
      String(info.email_verified).toLowerCase() === "true" ||
      info.email_verified === true ||
      String(info.email_verified) === "1";

    if (!isVerified) {
      logAuthWarn("google_callback", "Google user email is not verified");
      return NextResponse.redirect(`${origin}/login?error=google_email_unverified`);
    }

    const normalizedEmail = String(info.email || "").toLowerCase().trim();

    if (!normalizedEmail) {
      logAuthWarn("google_callback", "No email found in Google profile payload");
      return NextResponse.redirect(`${origin}/login?error=google_no_email`);
    }

    // Sanitize user profile fields
    const fullName = (info.name?.trim() || normalizedEmail.split("@")[0]).slice(0, 32);
    const avatarUrl = (info.picture || "").slice(0, 255);

    logAuth("google_identity", "Google identity verified", {
      email: normalizedEmail,
      name: fullName,
      sub: info.sub,
      aud: info.aud,
    });

    const target = resolvePostAuthRedirect(
      { get: (k: string) => (k === "next" ? targetPath : null) },
      null
    );
    const isSecure = process.env.NODE_ENV === "production" || origin.startsWith("https://");

    // 4. User Resolution & Supabase Auth Link Generation.
    // The Google authorization code is exchanged with Google above. Supabase
    // cannot exchange that raw Google code unless Supabase initiated the OAuth
    // flow, so this direct-Google flow creates the Supabase session with a
    // server-generated magic-link token instead.
    const admin = adminClient();
    let userId: string | undefined;
    let isNewUser = false;

    let linkRes = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: normalizedEmail,
    });

    if (linkRes.error || !linkRes.data?.user) {
      logAuth("user_sync", "User not found in Supabase Auth, creating user", { email: normalizedEmail });
      const { data: createdUser, error: createErr } = await admin.auth.admin.createUser({
        email: normalizedEmail,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          avatar_url: avatarUrl,
        },
      });

      if (createErr || !createdUser?.user) {
        logAuthError("user_sync", "Failed to create Supabase user", createErr, { email: normalizedEmail });
        return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=create_user`);
      }

      userId = createdUser.user.id;
      isNewUser = true;
      logAuth("user_sync", "Created new user in Supabase auth", { userId, email: normalizedEmail });

      linkRes = await admin.auth.admin.generateLink({
        type: "magiclink",
        email: normalizedEmail,
      });
    } else {
      userId = linkRes.data.user.id;
      logAuth("user_sync", "Resolved user in Supabase Auth", { userId, email: normalizedEmail });
    }

    if (!linkRes.data?.properties?.hashed_token) {
      logAuthError("session", "Failed generating authentication token link", linkRes.error, { email: normalizedEmail });
      return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=token_gen`);
    }

    const tokenHash = linkRes.data.properties.hashed_token;
    const verificationType = (linkRes.data.properties.verification_type as "magiclink" | "signup" | "email") || "magiclink";

    // 5. Determine post-login redirect destination
    const destination = target !== "/dashboard"
      ? target
      : (isNewUser ? "/onboarding" : "/dashboard");

    // Cache the code -> destination mapping to immediately satisfy any repeat browser/prefetch requests
    recentExchangedCodes.set(code, { destination, ts: Date.now() });

    const response = NextResponse.redirect(`${origin}${destination}`);

    // Set cache control headers to prevent browser bfcache replay
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private, max-age=0");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    // Clear ephemeral OAuth state nonce cookie safely
    response.cookies.set("oauth_state_nonce", "", {
      path: "/",
      maxAge: 0,
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax",
    });

    // 6. Compact single-pass session cookie writer (prevents Nginx 4KB proxy buffer 502 error)
    const supabase = createServerClient(
      getSupabaseUrl(),
      getSupabaseAnonKey(),
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll() {},
        },
      }
    );

    const { data: verifyData, error: verifyErr } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: verificationType,
    });

    if (verifyErr || !verifyData?.session) {
      logAuthError("session", "verifyOtp failed to establish session", verifyErr, { email: normalizedEmail });
      return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=verify_otp`);
    }

    const session = verifyData.session;
    const sessionUser = verifyData.user || session.user;

    // Compact session JSON (keeps cookie under 2.1KB, preventing 8.7KB chunked header overflows in reverse proxies)
    const compactSession = {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      token_type: session.token_type,
      expires_in: session.expires_in,
      expires_at: session.expires_at,
      user: {
        id: sessionUser.id,
        aud: sessionUser.aud,
        email: sessionUser.email,
        role: sessionUser.role,
        app_metadata: sessionUser.app_metadata,
        user_metadata: {
          full_name: fullName,
          avatar_url: avatarUrl,
        },
      },
    };

    const compactCookieValue = "base64-" + Buffer.from(JSON.stringify(compactSession)).toString("base64");
    let supabaseProjectRef = "kxmxxqyxkoseksfaymqm";
    try {
      supabaseProjectRef = new URL(getSupabaseUrl()).hostname.split(".")[0];
    } catch {
      // fallback to project ref
    }
    const baseCookieName = `sb-${supabaseProjectRef}-auth-token`;

    // Set single compact cookie (2.0 KB)
    response.cookies.set(baseCookieName, compactCookieValue, {
      path: "/",
      maxAge: typeof session.expires_in === "number" ? session.expires_in : 60 * 60 * 24 * 7,
      sameSite: "lax",
      secure: isSecure,
      httpOnly: true,
    });

    // Clear any legacy bloated chunked cookies (.0, .1, .2, .3, .4, .5)
    for (let i = 0; i <= 5; i++) {
      response.cookies.set(`${baseCookieName}.${i}`, "", {
        path: "/",
        maxAge: 0,
        sameSite: "lax",
        secure: isSecure,
        httpOnly: true,
      });
    }

    logAuth("session", "Session established successfully -> Redirecting user", {
      email: normalizedEmail,
      userId,
      destination,
      isNewUser,
      cookieSize: compactCookieValue.length,
    });

    // 7. Non-blocking background sync for Profile Upsert & Notifications
    if (userId) {
      Promise.allSettled([
        admin.from("profiles").upsert(
          {
            user_id: userId,
            email: normalizedEmail,
            full_name: fullName,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        ),
        isNewUser
          ? Promise.allSettled([
              notifyOwnerNewUser({
                name: fullName,
                email: normalizedEmail,
                provider: "google",
                userId,
              }),
              sendUserWelcomeEmail({ to: normalizedEmail, name: fullName }),
            ])
          : notifyOwnerUserLogin({
              name: fullName,
              email: normalizedEmail,
              provider: "google",
              userId,
            }),
      ]).then(() => {
        logAuth("notifications", "Dispatched login/welcome notifications", {
          email: normalizedEmail,
          isNewUser,
        });
      }).catch((e) => {
        logAuthWarn("notifications", "Background sync warning", { error: String(e) });
      });
    }

    return response;
  } catch (err) {
    logAuthError("google_callback", "Unhandled error during callback processing", err);
    return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=crash`);
  }
}
