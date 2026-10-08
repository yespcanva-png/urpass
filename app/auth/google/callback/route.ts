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
    { auth: { autoRefreshToken: false, persistSession: false } }
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

    if (!code) {
      const existingUser = await getExistingSessionUser();
      if (existingUser) {
        return NextResponse.redirect(`${origin}/dashboard`);
      }
      return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=init`);
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

    if (!clientId || !clientSecret) {
      console.error("[google-callback] Google client credentials missing");
      return NextResponse.redirect(`${origin}/login?error=google_not_configured`);
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

    // Exchange authorization code for Google tokens with strict 10s timeout
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
      signal: AbortSignal.timeout(10000),
    });

    const tokens = await tokenRes.json().catch(() => null);
    if (!tokenRes.ok || !tokens?.id_token) {
      console.error("[google-callback] token exchange error:", tokenRes.status, tokens);
      if (tokens?.error === "invalid_grant") {
        const existingUser = await getExistingSessionUser();
        if (existingUser) {
          console.log("[google-callback] Existing active session detected on invalid_grant code replay:", existingUser.id);
          const target = resolvePostAuthRedirect(
            { get: (k: string) => (k === "next" ? targetPath : null) },
            null
          );
          return NextResponse.redirect(`${origin}${target}`);
        }
        return NextResponse.redirect(`${origin}/login?error=google_code_expired`);
      }
      return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=token`);
    }

    // Verify the ID token via Google tokeninfo with JWT decode fallback
    let info: GoogleTokenInfo | null = null;
    try {
      const infoRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${tokens.id_token}`,
        { signal: AbortSignal.timeout(10000) }
      );
      if (infoRes.ok) {
        info = await infoRes.json();
      }
    } catch (e) {
      console.warn("[google-callback] tokeninfo fetch warning:", e);
    }

    if (!info && tokens.id_token) {
      try {
        const parts = tokens.id_token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
          if (payload && payload.sub && payload.email) {
            info = payload as GoogleTokenInfo;
          }
        }
      } catch (e) {
        console.error("[google-callback] JWT decode fallback failed:", e);
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

    const fullName = info.name?.trim() || normalizedEmail.split("@")[0];
    const avatarUrl = info.picture || "";
    const googleId = info.sub || "";

    // Generate secure ephemeral password satisfying all complexity rules
    const ephemeralPassword = crypto.randomBytes(16).toString("hex") + "A1!";

    // 1. Resolve existing user ID (via profiles table or Supabase auth lookup)
    const { data: profileRow } = await admin
      .from("profiles")
      .select("user_id")
      .ilike("email", normalizedEmail)
      .maybeSingle();

    let userId = profileRow?.user_id;
    let isNewUser = false;

    if (!userId) {
      const { data: linkLookup } = await admin.auth.admin.generateLink({
        type: "magiclink",
        email: normalizedEmail,
      });
      if (linkLookup?.user?.id) {
        userId = linkLookup.user.id;
      }
    }

    if (userId) {
      // Existing user: update password, mark email confirmed and sync metadata
      const { error: updateErr } = await admin.auth.admin.updateUserById(userId, {
        password: ephemeralPassword,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          avatar_url: avatarUrl,
          google_id: googleId,
          email_verified: true,
        },
      });

      if (updateErr) {
        console.warn("[google-callback] updateUserById error:", updateErr.message);
      }

      // Non-blocking owner login notification
      try {
        notifyOwnerUserLogin({
          name: fullName,
          email: normalizedEmail,
          provider: "google",
          userId,
        }).catch(() => {});
      } catch {
        // Ignore notification errors
      }
    } else {
      // Try creating new user in Supabase auth
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

        try {
          Promise.allSettled([
            notifyOwnerNewUser({
              name: fullName,
              email: normalizedEmail,
              provider: "google",
              userId,
            }),
            sendUserWelcomeEmail({ to: normalizedEmail, name: fullName }),
          ]).catch(() => {});
        } catch {
          // Ignore notification errors
        }
      } else {
        // Fallback: If user was created concurrently or already exists
        const { data: linkData } = await admin.auth.admin.generateLink({
          type: "magiclink",
          email: normalizedEmail,
        });
        if (linkData?.user?.id) {
          userId = linkData.user.id;
          await admin.auth.admin.updateUserById(userId, {
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

    // Ensure profiles table record is upserted
    if (userId) {
      try {
        await admin.from("profiles").upsert(
          {
            user_id: userId,
            email: normalizedEmail,
            full_name: fullName,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      } catch (e) {
        console.error("[google-callback] profiles upsert error:", e instanceof Error ? e.message : String(e));
      }
    }

    // Determine post-login redirect destination
    const target = resolvePostAuthRedirect(
      { get: (k: string) => (k === "next" ? targetPath : null) },
      null
    );
    const destination = target !== "/dashboard"
      ? target
      : (isNewUser ? "/onboarding" : "/dashboard");

    const response = NextResponse.redirect(`${origin}${destination}`);
    // Clear ephemeral OAuth state nonce cookie safely
    response.cookies.set("oauth_state_nonce", "", {
      path: "/",
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || origin.startsWith("https://"),
      sameSite: "lax",
    });

    const cookieStore = await cookies();

    // Create SSR client configured to write session cookies directly to response
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
              try {
                cookieStore.set(name, value, options);
              } catch {
                // Ignore if in context where cookieStore cannot mutate
              }
              response.cookies.set(name, value, {
                path: options?.path || "/",
                maxAge: typeof options?.maxAge === "number" ? options.maxAge : undefined,
                domain: options?.domain || undefined,
                sameSite: (options?.sameSite as "lax" | "strict" | "none") || "lax",
                secure: process.env.NODE_ENV === "production" || origin.startsWith("https://"),
                httpOnly: options?.httpOnly ?? true,
              });
            });
          },
        },
      }
    );

    // Primary: Direct session sign-in using ephemeral credential
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

    // Fallback: Magic link OTP verification if direct sign-in encountered an issue
    if (!sessionEstablished) {
      const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
        type: "magiclink",
        email: normalizedEmail,
      });

      if (linkErr || !linkData?.properties?.hashed_token) {
        console.error("[google-callback] generateLink error:", linkErr?.message || linkErr);
        return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=link`);
      }

      const tokenHash = linkData.properties.hashed_token;
      const verificationType = (linkData.properties.verification_type as "magiclink" | "signup" | "email") || "magiclink";

      let { error: verifyErr } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: verificationType,
      });

      if (verifyErr && verificationType !== "magiclink") {
        const fb = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "magiclink",
        });
        if (!fb.error) verifyErr = null;
      }

      if (verifyErr && verificationType !== "email") {
        const fb = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "email",
        });
        if (!fb.error) verifyErr = null;
      }

      if (verifyErr) {
        console.error("[google-callback] verifyOtp error:", verifyErr?.message || verifyErr);
        return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=otp`);
      }
    }

    return response;
  } catch (err) {
    console.error("[google-callback] unhandled error:", err instanceof Error ? err.message : String(err));
    return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=crash`);
  }
}


