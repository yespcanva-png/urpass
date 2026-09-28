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

  try {
    await notifyOwnerUserLogin({
      name,
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
