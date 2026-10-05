import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resolvePostAuthRedirect } from "@/lib/auth-redirect";
import { notifyOwnerNewUser, notifyOwnerUserLogin, sendUserWelcomeEmail } from "@/lib/email";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const target = resolvePostAuthRedirect(searchParams, null);

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      const user = data.user;
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
      return NextResponse.redirect(`${origin}${target}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
