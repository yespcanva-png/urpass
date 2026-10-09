"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { revalidatePath } from "next/cache";
import { validateGstin } from "@/lib/validations/gstin";
import { cookies } from "next/headers";
import { sendPasswordResetEmail } from "@/lib/email";
import { getAuthResetRedirectUrl } from "@/lib/auth-redirect";

type ActionResult = { success?: boolean; error?: string };

export async function signOutAction(): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut({ scope: "local" });
  } catch (err) {
    console.warn("[auth] signOutAction warning:", err);
  }

  // Clear all sb-* auth tokens and related cookies from server cookieStore
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    for (const cookie of allCookies) {
      if (
        cookie.name.startsWith("sb-") ||
        cookie.name.startsWith("urpass_") ||
        cookie.name.includes("oauth") ||
        cookie.name.includes("auth-token")
      ) {
        cookieStore.delete(cookie.name);
        cookieStore.set(cookie.name, "", {
          path: "/",
          maxAge: 0,
          expires: new Date(0),
          sameSite: "lax",
        });
      }
    }
  } catch {
    // Non-blocking
  }

  return { success: true };
}

export async function requestPasswordReset(emailInput: string): Promise<ActionResult> {
  const email = emailInput?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  try {
    const { createClient: createSupabaseAdmin } = await import("@supabase/supabase-js");
    const { getSupabaseUrl, getSupabaseServiceRoleKey } = await import("@/lib/supabase/config");
    const admin = createSupabaseAdmin(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const origin = process.env.NEXT_PUBLIC_APP_URL || "https://urpass.space";
    const redirectTo = getAuthResetRedirectUrl(origin);

    // 1. Generate recovery link using admin client
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    });

    if (linkData?.properties?.hashed_token) {
      const tokenHash = linkData.properties.hashed_token;
      const resetUrl = `${origin}/auth/reset-password?token_hash=${encodeURIComponent(tokenHash)}&type=recovery`;

      // Fetch user profile for name if available
      const { data: profile } = await admin
        .from("profiles")
        .select("full_name")
        .ilike("email", email)
        .maybeSingle();

      const name = profile?.full_name || linkData.user?.user_metadata?.full_name || null;

      // Dispatch branded reset email via ZeptoMail SMTP
      await sendPasswordResetEmail({
        to: email,
        resetUrl,
        name,
      });

      return { success: true };
    }

    // Fallback to standard Supabase resetPasswordForEmail
    const supabase = await createClient();
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (resetErr) {
      return { error: resetErr.message };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("[auth] requestPasswordReset error:", err);
    return { error: err instanceof Error ? err.message : "Failed to send reset link." };
  }
}

export async function sendPasswordReset(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) redirect("/login");

  return requestPasswordReset(user.email);
}

export async function updateProfileName(fullName: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const trimmed = fullName.trim();
  if (!trimmed || trimmed.length < 2) return { error: "Name must be at least 2 characters." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: trimmed })
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/settings");
  return { success: true };
}

export interface BillingProfileInput {
  fullName?: string;
  phone?: string | null;
  companyName?: string | null;
  gstin?: string | null;
  billingAddress?: string | null;
}

export async function updateBillingProfile(data: BillingProfileInput): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const updates: Record<string, string | null> = {};

  if (typeof data.fullName === "string") {
    const trimmed = data.fullName.trim();
    if (trimmed.length < 2) return { error: "Full name must be at least 2 characters." };
    updates.full_name = trimmed;
  }

  if (data.gstin !== undefined) {
    const gstin = data.gstin?.trim().toUpperCase() || null;
    if (gstin && !validateGstin(gstin)) {
      return { error: "Invalid GSTIN format. Expected 15-character format (e.g. 29ABCDE1234F1Z5)." };
    }
    updates.gstin = gstin;
  }

  if (data.companyName !== undefined) {
    updates.company_name = data.companyName?.trim() || null;
  }

  if (data.phone !== undefined) {
    updates.phone = data.phone?.trim() || null;
  }

  if (data.billingAddress !== undefined) {
    updates.billing_address = data.billingAddress?.trim() || null;
  }

  if (Object.keys(updates).length === 0) {
    return { success: true };
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/settings");
  revalidatePath("/billing");
  return { success: true };
}
