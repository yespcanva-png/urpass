import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseUrl, getSupabaseAnonKey } from "@/lib/supabase/config";
import { notifyOwnerNewUser, notifyOwnerUserLogin, sendUserWelcomeEmail } from "@/lib/email";
import { resolvePostAuthRedirect } from "@/lib/auth-redirect";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
      global: {
        fetch: (url, options) => {
          return fetch(url, {
            ...options,
            signal: AbortSignal.timeout(8000),
          });
        },
      },
    }
  );
}

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

async function getExistingSessionUser() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      getSupabaseUrl(),
      getSupabaseAnonKey(),
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
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

    if (error) {
      console.warn("[google-callback] Google returned error:", error, errorDescription);
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

    if (!code) {
      const existingUser = await getExistingSessionUser();
      if (existingUser) {
        const target = resolvePostAuthRedirect(
          { get: (k: string) => (k === "next" ? targetPath : null) },
          null
        );
        const res = NextResponse.redirect(`${origin}${target}`);
        res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private, max-age=0");
        return res;
      }
      return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=init`);
    }

    // 1. Check in-memory recent exchange cache (prevents duplicate code replay from double-click or browser prefetching)
    cleanupExchangedCodes();
    const cachedExchange = recentExchangedCodes.get(code);
    if (cachedExchange) {
      const res = NextResponse.redirect(`${origin}${cachedExchange.destination}`);
      res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private, max-age=0");
      res.headers.set("Pragma", "no-cache");
      return res;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

    if (!clientId || !clientSecret) {
      console.error("[google-callback] Google client credentials missing");
      return NextResponse.redirect(`${origin}/login?error=google_not_configured`);
    }

    // 2. Exchange authorization code for Google tokens with strict 8s timeout
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
      signal: AbortSignal.timeout(8000),
    });

    const tokens = await tokenRes.json().catch(() => null);
    if (!tokenRes.ok || !tokens?.id_token) {
      if (tokens?.error === "invalid_grant") {
        console.warn("[google-callback] Authorization code expired or was already redeemed:", code.slice(0, 10) + "...");
        const existingUser = await getExistingSessionUser();
        if (existingUser) {
          const target = resolvePostAuthRedirect(
            { get: (k: string) => (k === "next" ? targetPath : null) },
            null
          );
          const res = NextResponse.redirect(`${origin}${target}`);
          res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private, max-age=0");
          return res;
        }
        return NextResponse.redirect(`${origin}/login?error=google_code_expired`);
      }
      console.error("[google-callback] token exchange error:", tokenRes.status, tokens);
      return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=token`);
    }

    // 3. Fast decode ID token from JWT payload (0ms, no network hop) with tokeninfo fallback
    let info: GoogleTokenInfo | null = decodeGoogleIdToken(tokens.id_token);

    if (!info) {
      try {
        const infoRes = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${tokens.id_token}`,
          { signal: AbortSignal.timeout(6000) }
        );
        if (infoRes.ok) {
          info = await infoRes.json();
        }
      } catch (e) {
        console.warn("[google-callback] tokeninfo fetch warning:", e);
      }
    }

    if (!info || !info.email) {
      return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=verify`);
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
      return NextResponse.redirect(`${origin}/login?error=google_email_unverified`);
    }

    const admin = adminClient();
    const normalizedEmail = String(info.email || "").toLowerCase().trim();

    if (!normalizedEmail) {
      return NextResponse.redirect(`${origin}/login?error=google_no_email`);
    }

    const fullName = (info.name?.trim() || normalizedEmail.split("@")[0]).slice(0, 64);
    const avatarUrl = (info.picture || "").slice(0, 255);
    const googleId = String(info.sub || "").slice(0, 64);

    // Generate secure ephemeral password satisfying all complexity rules
    const ephemeralPassword = crypto.randomBytes(16).toString("hex") + "A1!";

    // 4. User Resolution: Fast lookup existing user or create
    let userId: string | undefined;
    let isNewUser = false;

    const { data: profileRow } = await admin
      .from("profiles")
      .select("user_id")
      .ilike("email", normalizedEmail)
      .maybeSingle();

    if (profileRow?.user_id) {
      userId = profileRow.user_id;
      await admin.auth.admin.updateUserById(profileRow.user_id, {
        password: ephemeralPassword,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          avatar_url: avatarUrl,
          google_id: googleId,
          email_verified: true,
        },
      });
    } else {
      const { data: createdUser, error: createErr } = await admin.auth.admin.createUser({
        email: normalizedEmail,
        password: ephemeralPassword,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          avatar_url: avatarUrl,
          google_id: googleId,
          email_verified: true,
        },
      });

      if (!createErr && createdUser?.user) {
        userId = createdUser.user.id;
        isNewUser = true;
      } else {
        const { data: linkLookup } = await admin.auth.admin.generateLink({
          type: "magiclink",
          email: normalizedEmail,
        });

        if (linkLookup?.user?.id) {
          userId = linkLookup.user.id;
          await admin.auth.admin.updateUserById(linkLookup.user.id, {
            password: ephemeralPassword,
            email_confirm: true,
            user_metadata: {
              full_name: fullName,
              avatar_url: avatarUrl,
              google_id: googleId,
              email_verified: true,
            },
          });
        }
      }
    }

    // 5. Determine post-login redirect destination
    const target = resolvePostAuthRedirect(
      { get: (k: string) => (k === "next" ? targetPath : null) },
      null
    );
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
      secure: process.env.NODE_ENV === "production" || origin.startsWith("https://"),
      sameSite: "lax",
    });

    const cookieStore = await cookies();

    // 6. Establish Session Cookies directly onto response
    const supabase = createServerClient(
      getSupabaseUrl(),
      getSupabaseAnonKey(),
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, {
                path: options?.path || "/",
                maxAge: typeof options?.maxAge === "number" ? options.maxAge : undefined,
                domain: options?.domain || undefined,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production" || origin.startsWith("https://"),
                httpOnly: options?.httpOnly ?? true,
              });
            });
          },
        },
      }
    );

    let sessionEstablished = false;
    if (ephemeralPassword) {
      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: ephemeralPassword,
      });
      if (!signInErr && signInData?.session) {
        sessionEstablished = true;
      } else {
        console.warn("[google-callback] Direct signInWithPassword fallback needed:", signInErr?.message);
      }
    }

    // Fallback: Magic link OTP verification if needed
    if (!sessionEstablished) {
      const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
        type: "magiclink",
        email: normalizedEmail,
      });

      if (!linkErr && linkData?.properties?.hashed_token) {
        const tokenHash = linkData.properties.hashed_token;
        const verificationType = (linkData.properties.verification_type as "magiclink" | "signup" | "email") || "magiclink";

        const { error: verifyErr } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: verificationType,
        });

        if (verifyErr) {
          console.error("[google-callback] verifyOtp fallback error:", verifyErr.message);
          return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=otp`);
        }
      } else {
        console.error("[google-callback] generateLink error:", linkErr?.message || linkErr);
        return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=link`);
      }
    }

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
      ]).catch((e) => {
        console.warn("[google-callback] Non-blocking background sync warning:", e);
      });
    }

    return response;
  } catch (err) {
    console.error("[google-callback] unhandled error:", err instanceof Error ? err.message : String(err));
    return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=crash`);
  }
}
