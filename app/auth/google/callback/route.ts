import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseUrl, getSupabaseAnonKey } from "@/lib/supabase/config";
import { notifyOwnerNewUser, notifyOwnerUserLogin, sendUserWelcomeEmail } from "@/lib/email";
import { resolvePostAuthRedirect } from "@/lib/auth-redirect";

export const dynamic = "force-dynamic";

interface GoogleTokenInfo {
  sub: string;
  email: string;
  email_verified: string;
  name: string;
  picture: string;
  aud: string;
}

function adminClient() {
  return createSupabaseAdmin(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(req: NextRequest) {
  const proto = req.headers.get("x-forwarded-proto") ?? (req.url.startsWith("https") ? "https" : "http");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? (host ? `${proto}://${host}` : new URL(req.url).origin);

  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error || !code) {
      return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=init`);
    }

    // Exchange authorization code for Google tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${origin}/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokenRes.ok || !tokens.id_token) {
      console.error("[google-callback] token exchange error:", tokens);
      return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=token`);
    }

    // Verify the ID token
    const infoRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${tokens.id_token}`
    );
    if (!infoRes.ok) {
      return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=verify`);
    }

    const info: GoogleTokenInfo = await infoRes.json();

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (clientId && info.aud !== clientId) {
      return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=aud`);
    }

    if (info.email_verified !== "true") {
      return NextResponse.redirect(`${origin}/login?error=google_email_unverified`);
    }

    const admin = adminClient();

    // Find or create user
    const { data: profileRow } = await admin
      .from("profiles")
      .select("user_id")
      .eq("email", info.email)
      .maybeSingle();

    const isNewUser = !profileRow?.user_id;

    if (profileRow?.user_id) {
      await admin.auth.admin.updateUserById(profileRow.user_id, {
        user_metadata: {
          full_name: info.name,
          avatar_url: info.picture,
          google_id: info.sub,
        },
      });
      try {
        await notifyOwnerUserLogin({
          name: info.name,
          email: info.email,
          provider: "google",
          userId: profileRow.user_id,
        });
      } catch (e) {
        console.error("[google-callback] notifyOwnerUserLogin error:", e);
      }
    } else {
      const { data: createdUser, error: createErr } = await admin.auth.admin.createUser({
        email: info.email,
        email_confirm: true,
        user_metadata: {
          full_name: info.name,
          avatar_url: info.picture,
          google_id: info.sub,
        },
      });
      if (createErr) {
        console.error("[google-callback] createUser error:", createErr);
        return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=create`);
      }
      try {
        await Promise.allSettled([
          notifyOwnerNewUser({
            name: info.name,
            email: info.email,
            provider: "google",
            userId: createdUser.user?.id,
          }),
          sendUserWelcomeEmail({ to: info.email, name: info.name }),
        ]);
      } catch (e) {
        console.error("[google-callback] notification error:", e);
      }
    }

    // Generate a one-time token and verify it via the server client (sets session cookies)
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: info.email,
    });

    if (linkErr || !linkData?.properties?.hashed_token) {
      console.error("[google-callback] generateLink error:", linkErr);
      return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=link`);
    }

    const target = resolvePostAuthRedirect(
      { get: (k: string) => (k === "next" ? state : null) },
      null
    );
    const destination = target !== "/dashboard"
      ? target
      : (isNewUser ? "/onboarding" : "/dashboard");

    const response = NextResponse.redirect(`${origin}${destination}`);

    const supabase = createServerClient(
      getSupabaseUrl(),
      getSupabaseAnonKey(),
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              req.cookies.set(name, value);
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error: verifyErr } = await supabase.auth.verifyOtp({
      token_hash: linkData.properties.hashed_token,
      type: "email",
    });

    if (verifyErr) {
      console.error("[google-callback] verifyOtp error:", verifyErr);
      return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=otp`);
    }

    return response;
  } catch (err) {
    console.error("[google-callback] unhandled error:", err);
    return NextResponse.redirect(`${origin}/login?error=google_auth_failed&step=crash`);
  }
}
