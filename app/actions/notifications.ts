"use server";

import {
  notifyOwnerNewUser,
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
