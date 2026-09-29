"use server";

import {
  notifyOwnerNewUser,
  notifyOwnerUserLogin,
  sendUserWelcomeEmail,
} from "@/lib/email";

export async function sendSignupNotifications({
  name,
  email,
  provider,
  userId,
}: {
  name?: string | null;
  email?: string | null;
  provider: "email" | "google";
  userId?: string | null;
}) {
  if (!email) return;

  await Promise.allSettled([
    notifyOwnerNewUser({ name, email, provider, userId }),
    sendUserWelcomeEmail({ to: email, name }),
  ]);
}

export async function sendLoginNotifications({
  name,
  email,
  provider,
  userId,
  ipAddress,
  userAgent,
}: {
  name?: string | null;
  email?: string | null;
  provider: "email" | "google" | "sso" | "magiclink";
  userId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  if (!email) return;

  let resolvedName = name;
  if (!resolvedName && userId) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", userId)
        .maybeSingle();
      if (profile?.full_name) {
        resolvedName = profile.full_name;
      }
    } catch {
      // Non-critical fallback
    }
  }

  try {
    await notifyOwnerUserLogin({
      name: resolvedName,
      email,
      provider,
      userId,
      ipAddress,
      userAgent,
    });
  } catch (err) {
    console.error("[notifications] sendLoginNotifications error:", err);
  }
}
