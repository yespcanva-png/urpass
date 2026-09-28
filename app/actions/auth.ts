"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { revalidatePath } from "next/cache";
import { validateGstin } from "@/lib/validations/gstin";

type ActionResult = { success?: boolean; error?: string };

export async function sendPasswordReset(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(user.email!, {
    redirectTo: `${appUrl}/auth/reset-password`,
  });

  if (error) return { error: error.message };
  return { success: true };
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
