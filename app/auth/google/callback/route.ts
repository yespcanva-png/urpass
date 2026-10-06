import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseUrl } from "@/lib/supabase/config";
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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://urpass.space";

  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error || !code) {
      return NextResponse.redirect(`${appUrl}/login?error=google_auth_failed&step=init`);
    }

    // Exchange authorization code for Google tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${appUrl}/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokenRes.ok || !tokens.id_token) {
      console.error("[google-callback] token exchange error:", tokens);
      return NextResponse.redirect(`${appUrl}/login?error=google_auth_failed&step=token`);
    }

    // Verify the ID token
    const infoRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${tokens.id_token}`
    );
    if (!infoRes.ok) {
      return NextResponse.redirect(`${appUrl}/login?error=google_auth_failed&step=verify`);
    }

    const info: GoogleTokenInfo = await infoRes.json();

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (clientId && info.aud !== clientId) {
      return NextResponse.redirect(`${appUrl}/login?error=google_auth_failed&step=aud`);
    }

    if (info.email_verified !== "true") {
      return NextResponse.redirect(`${appUrl}/login?error=google_email_unverified`);
    }

    const admin = adminClient();
    const normalizedEmail = info.email.toLowerCase().trim();

    // Find user across profiles table (case-insensitive)
    const { data: profileRow } = await admin
      .from("profiles")
      .select("user_id")
      .ilike("email", normalizedEmail)
      .maybeSingle();

    let userId = profileRow?.user_id;
    let isNewUser = false;

    if (userId) {
      await admin.auth.admin.updateUserById(userId, {
        email_confirm: true,
        user_metadata: {
          full_name: info.name,
          avatar_url: info.picture,
          google_id: info.sub,
        },
      });
      notifyOwnerUserLogin({
        name: info.name,
        email: normalizedEmail,
        provider: "google",
        userId,
      }).catch((e) => console.error("[google-callback] notifyOwnerUserLogin error:", e));
    } else {
      // User might be new or already registered in auth.users without a profiles entry
      const { data: createdUser, error: createErr } = await admin.auth.admin.createUser({
        email: normalizedEmail,
        email_confirm: true,
        user_metadata: {
          full_name: info.name,
          avatar_url: info.picture,
          google_id: info.sub,
        },
      });

      if (!createErr && createdUser?.user) {
        userId = createdUser.user.id;
        isNewUser = true;
        Promise.allSettled([
          notifyOwnerNewUser({
            name: info.name,
            email: normalizedEmail,
            provider: "google",
            userId,
          }),
          sendUserWelcomeEmail({ to: normalizedEmail, name: info.name }),
        ]).catch((e) => console.error("[google-callback] notification error:", e));
      } else {
        // If createUser returned already registered / email_exists, user is existing.
        // We will retrieve user.id via generateLink below.
      }
    }

    // Generate a magiclink token to log the user in
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: normalizedEmail,
    });

    if (linkErr || !linkData?.properties?.hashed_token) {
      console.error("[google-callback] generateLink error:", linkErr);
      return NextResponse.redirect(`${appUrl}/login?error=google_auth_failed&step=link`);
    }

    if (!userId && linkData.user?.id) {
      userId = linkData.user.id;
      await admin.auth.admin.updateUserById(userId, {
        email_confirm: true,
        user_metadata: {
          full_name: info.name,
          avatar_url: info.picture,
          google_id: info.sub,
        },
      });
      notifyOwnerUserLogin({
        name: info.name,
        email: normalizedEmail,
        provider: "google",
        userId,
      }).catch((e) => console.error("[google-callback] notifyOwnerUserLogin error:", e));
    }

    // Ensure profiles table record is upserted and linked to user_id
    if (userId) {
      try {
        await admin.from("profiles").upsert(
          {
            user_id: userId,
            email: normalizedEmail,
            full_name: info.name,
            avatar_url: info.picture,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      } catch (e) {
        console.error("[google-callback] profiles upsert error:", e);
      }
    }

    // Verify OTP to set the Supabase session cookie on the server client
    const supabase = await createClient();
    const tokenHash = linkData.properties.hashed_token;
    const verificationType = (linkData.properties.verification_type as "magiclink" | "email") || "magiclink";

    let { error: verifyErr } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: verificationType,
    });

    // Fallback across OTP types if needed (handles password-set users and magiclink configs)
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
      console.error("[google-callback] verifyOtp error:", verifyErr);
      return NextResponse.redirect(`${appUrl}/login?error=google_auth_failed&step=otp`);
    }

    const target = resolvePostAuthRedirect(
      { get: (k: string) => (k === "next" ? state : null) },
      null
    );
    const destination = target !== "/dashboard"
      ? target
      : (isNewUser ? "/onboarding" : "/dashboard");

    return NextResponse.redirect(`${appUrl}${destination}`);
  } catch (err) {
    console.error("[google-callback] unhandled error:", err);
    return NextResponse.redirect(`${appUrl}/login?error=google_auth_failed&step=crash`);
  }
}
