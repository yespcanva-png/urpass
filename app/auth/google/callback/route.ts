import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseUrl, getSupabaseAnonKey } from "@/lib/supabase/config";
import { notifyOwnerNewUser, notifyOwnerUserLogin, sendUserWelcomeEmail } from "@/lib/email";
import { resolvePostAuthRedirect } from "@/lib/auth-redirect";

export const dynamic = "force-dynamic";

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
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    const proto = req.headers.get("x-forwarded-proto") || "http";
    return `${proto}://${host}`.replace(/\/$/, "");
  }
  return (process.env.NEXT_PUBLIC_APP_URL || "https://urpass.space").replace(/\/$/, "");
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
      return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=init`);
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error("[google-callback] Google client credentials missing");
      return NextResponse.redirect(`${origin}/login?error=google_not_configured`);
    }

    const redirectUri = `${origin}/auth/google/callback`;

    // Exchange authorization code for Google tokens
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
    });

    const tokens = await tokenRes.json();
    if (!tokenRes.ok || !tokens.id_token) {
      console.error("[google-callback] token exchange error:", tokenRes.status, tokens);
      if (tokens.error === "invalid_grant") {
        return NextResponse.redirect(`${origin}/login?error=google_code_expired`);
      }
      return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=token`);
    }

    // Verify the ID token
    const infoRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${tokens.id_token}`
    );
    if (!infoRes.ok) {
      console.error("[google-callback] tokeninfo verification error:", infoRes.status);
      return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=verify`);
    }

    const info: GoogleTokenInfo = await infoRes.json();

    if (clientId && info.aud !== clientId) {
      console.error("[google-callback] aud mismatch. Token aud:", info.aud, "Expected:", clientId);
      return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=aud`);
    }

    const isVerified =
      String(info.email_verified).toLowerCase() === "true" ||
      info.email_verified === true;

    if (!isVerified) {
      return NextResponse.redirect(`${origin}/login?error=google_email_unverified`);
    }

    const admin = adminClient();
    const normalizedEmail = String(info.email || "").toLowerCase().trim();

    if (!normalizedEmail) {
      return NextResponse.redirect(`${origin}/login?error=google_no_email`);
    }

    const fullName = info.name || normalizedEmail.split("@")[0];
    const avatarUrl = info.picture || "";
    const googleId = info.sub || "";

    // Generate secure 32-character ephemeral credential (within Supabase 72-char limit)
    const ephemeralPassword = crypto.randomBytes(16).toString("hex");

    // 1. Find user in profiles table or auth.users
    const { data: profileRow } = await admin
      .from("profiles")
      .select("user_id")
      .ilike("email", normalizedEmail)
      .maybeSingle();

    let userId = profileRow?.user_id;
    let isNewUser = false;

    if (userId) {
      // Existing user: mark email confirmed, set password & update metadata
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
      notifyOwnerUserLogin({
        name: fullName,
        email: normalizedEmail,
        provider: "google",
        userId,
      }).catch((e) => console.error("[google-callback] notifyOwnerUserLogin error:", e));
    } else {
      // Try to create user in auth.users
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
        Promise.allSettled([
          notifyOwnerNewUser({
            name: fullName,
            email: normalizedEmail,
            provider: "google",
            userId,
          }),
          sendUserWelcomeEmail({ to: normalizedEmail, name: fullName }),
        ]).catch((e) => console.error("[google-callback] notification error:", e));
      } else {
        // Fallback: If user already exists in auth.users without a profile record
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
          notifyOwnerUserLogin({
            name: fullName,
            email: normalizedEmail,
            provider: "google",
            userId,
          }).catch((e) => console.error("[google-callback] notifyOwnerUserLogin error:", e));
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
        console.error("[google-callback] profiles upsert error:", e);
      }
    }

    // Determine post-login redirect destination
    const target = resolvePostAuthRedirect(
      { get: (k: string) => (k === "next" ? state : null) },
      null
    );
    const destination = target !== "/dashboard"
      ? target
      : (isNewUser ? "/onboarding" : "/dashboard");

    const response = NextResponse.redirect(`${origin}${destination}`);
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
                ...options,
                path: options?.path || "/",
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
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
        console.error("[google-callback] generateLink error:", linkErr);
        return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=link`);
      }

      const tokenHash = linkData.properties.hashed_token;
      const verificationType = (linkData.properties.verification_type as "magiclink" | "signup" | "email") || "magiclink";

      const { error: verifyErr } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: verificationType,
      });

      if (verifyErr) {
        console.error("[google-callback] verifyOtp error:", verifyErr);
        return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=otp`);
      }
    }

    return response;
  } catch (err) {
    console.error("[google-callback] unhandled error:", err);
    return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=crash`);
  }
}

