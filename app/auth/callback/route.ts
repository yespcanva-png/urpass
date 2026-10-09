import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseUrl, getSupabaseAnonKey } from "@/lib/supabase/config";
import { resolvePostAuthRedirect } from "@/lib/auth-redirect";
import { notifyOwnerNewUser, notifyOwnerUserLogin, sendUserWelcomeEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "recovery" | "signup" | "magiclink" | "email" | null;
  const next = searchParams.get("next");

  const isRecovery = type === "recovery" || (next && next.includes("reset-password"));
  const target = isRecovery
    ? "/auth/reset-password"
    : resolvePostAuthRedirect(searchParams, null);

  const cookieStore = await cookies();
  const response = NextResponse.redirect(`${origin}${target}`);

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
              // Ignore
            }
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  let user = null;

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      user = data.user;
    }
  } else if (tokenHash) {
    const verificationType = type || "recovery";
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: verificationType as any,
    });
    if (!error && data?.user) {
      user = data.user;
    }
  }

  if (user) {
    if (isRecovery) {
      return response;
    }

    // If user was created within the last 15 minutes, notify owner of verified signup
    const createdAt = new Date(user.created_at).getTime();
    const isNew = Date.now() - createdAt < 15 * 60 * 1000;
    if (isNew) {
      try {
        await Promise.allSettled([
          notifyOwnerNewUser({
            name: user.user_metadata?.full_name || null,
            email: user.email || null,
            provider: (user.app_metadata?.provider as "email" | "google") || "email",
            userId: user.id,
          }),
          user.email
            ? sendUserWelcomeEmail({
                to: user.email,
                name: user.user_metadata?.full_name || null,
              })
            : Promise.resolve(),
        ]);
      } catch (e) {
        console.error("[auth/callback] notifyOwnerNewUser error:", e);
      }
    } else {
      try {
        await notifyOwnerUserLogin({
          name: user.user_metadata?.full_name || null,
          email: user.email || null,
          provider: (user.app_metadata?.provider as "email" | "google") || "magiclink",
          userId: user.id,
        });
      } catch (e) {
        console.error("[auth/callback] notifyOwnerUserLogin error:", e);
      }
    }
    return response;
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
