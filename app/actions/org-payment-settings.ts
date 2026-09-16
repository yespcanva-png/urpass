"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function saveOrgPaymentSettings(
  orgId: string,
  orgSlug: string,
  keyId: string,
  keySecret: string
): Promise<{ error?: string; success?: boolean }> {
  const trimmedId = keyId.trim();
  const trimmedSecret = keySecret.trim();

  if (!trimmedId || !trimmedSecret) {
    return { error: "Both Key ID and Key Secret are required." };
  }
  if (!trimmedId.startsWith("rzp_")) {
    return { error: "Key ID must start with rzp_live_ or rzp_test_" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("org_payment_settings").upsert(
    {
      organization_id: orgId,
      razorpay_key_id: trimmedId,
      razorpay_key_secret: trimmedSecret,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "organization_id" }
  );

  if (error) return { error: error.message };
  revalidatePath(`/org/${orgSlug}/settings`);
  return { success: true };
}

export async function removeOrgPaymentSettings(
  orgId: string,
  orgSlug: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("org_payment_settings")
    .delete()
    .eq("organization_id", orgId);

  if (error) return { error: error.message };
  revalidatePath(`/org/${orgSlug}/settings`);
  return {};
}

export async function getOrgPaymentSettings(orgId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("org_payment_settings")
    .select("razorpay_key_id")
    .eq("organization_id", orgId)
    .maybeSingle();
  return data;
}
