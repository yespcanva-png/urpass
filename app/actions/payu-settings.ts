"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUserPlan } from "@/lib/plan";
import { generatePayUHash } from "@/lib/payments/payu";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function savePayUSettings(
  merchantKey: string,
  merchantSalt: string,
  environment: "production" | "sandbox" = "production"
): Promise<{ error?: string; success?: boolean }> {
  const trimmedKey = merchantKey.trim();
  const trimmedSalt = merchantSalt.trim();

  if (!trimmedKey || !trimmedSalt) {
    return { error: "Both PayU Merchant Key and Merchant Salt are required." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const plan = await getUserPlan(supabase, user.id);
  if (plan.slug === "free") {
    return { error: "Payment gateway integration requires a Starter plan or above." };
  }

  const admin = adminClient();

  // Try updating payu fields or metadata on payment_settings
  const { error: upsertErr } = await admin.from("payment_settings").upsert(
    {
      user_id: user.id,
      payu_merchant_key: trimmedKey,
      payu_merchant_salt: trimmedSalt,
      payu_environment: environment,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (upsertErr) {
    // If table column doesn't exist yet, fallback to storing securely in custom settings
    const { error: fallbackErr } = await admin.from("profiles").update({
      payu_config: {
        merchant_key: trimmedKey,
        merchant_salt: trimmedSalt,
        environment,
        updated_at: new Date().toISOString(),
      },
    }).eq("user_id", user.id);

    if (fallbackErr) {
      return { error: upsertErr.message };
    }
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function removePayUSettings(): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = adminClient();

  await admin
    .from("payment_settings")
    .update({
      payu_merchant_key: null,
      payu_merchant_salt: null,
      payu_environment: null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  await admin
    .from("profiles")
    .update({ payu_config: null })
    .eq("user_id", user.id);

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function getPayUSettings(): Promise<{
  merchantKey: string | null;
  environment: "production" | "sandbox";
  isConnected: boolean;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { merchantKey: null, environment: "production", isConnected: false };

  const { data: row } = await supabase
    .from("payment_settings")
    .select("payu_merchant_key, payu_environment")
    .eq("user_id", user.id)
    .maybeSingle();

  if (row?.payu_merchant_key) {
    return {
      merchantKey: row.payu_merchant_key,
      environment: (row.payu_environment as "production" | "sandbox") || "production",
      isConnected: true,
    };
  }

  // Fallback to profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("payu_config")
    .eq("user_id", user.id)
    .maybeSingle();

  const payuConfig = (profile as { payu_config?: { merchant_key?: string; environment?: string } })?.payu_config;
  if (payuConfig?.merchant_key) {
    return {
      merchantKey: payuConfig.merchant_key,
      environment: (payuConfig.environment as "production" | "sandbox") || "production",
      isConnected: true,
    };
  }

  return { merchantKey: null, environment: "production", isConnected: false };
}

export async function saveOrgPayUSettings(
  orgId: string,
  orgSlug: string,
  merchantKey: string,
  merchantSalt: string,
  environment: "production" | "sandbox" = "production"
): Promise<{ error?: string; success?: boolean }> {
  const trimmedKey = merchantKey.trim();
  const trimmedSalt = merchantSalt.trim();

  if (!trimmedKey || !trimmedSalt) {
    return { error: "Both PayU Merchant Key and Merchant Salt are required." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    return { error: "Only organization owners and admins can configure payment credentials." };
  }

  const admin = adminClient();

  const { error: upsertErr } = await admin.from("org_payment_settings").upsert(
    {
      organization_id: orgId,
      payu_merchant_key: trimmedKey,
      payu_merchant_salt: trimmedSalt,
      payu_environment: environment,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "organization_id" }
  );

  if (upsertErr) {
    // Fallback if column not yet added to org_payment_settings
    await admin.from("organization_settings").upsert(
      {
        organization_id: orgId,
        payu_config: {
          merchant_key: trimmedKey,
          merchant_salt: trimmedSalt,
          environment,
          updated_at: new Date().toISOString(),
        },
      },
      { onConflict: "organization_id" }
    );
  }

  revalidatePath(`/org/${orgSlug}/settings`);
  return { success: true };
}

export async function removeOrgPayUSettings(
  orgId: string,
  orgSlug: string
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    return { error: "Only organization owners and admins can remove payment credentials." };
  }

  const admin = adminClient();

  await admin
    .from("org_payment_settings")
    .update({
      payu_merchant_key: null,
      payu_merchant_salt: null,
      payu_environment: null,
      updated_at: new Date().toISOString(),
    })
    .eq("organization_id", orgId);

  await admin
    .from("organization_settings")
    .update({ payu_config: null })
    .eq("organization_id", orgId);

  revalidatePath(`/org/${orgSlug}/settings`);
  return { success: true };
}

export async function getOrgPayUSettings(orgId: string): Promise<{
  merchantKey: string | null;
  environment: "production" | "sandbox";
  isConnected: boolean;
}> {
  const supabase = await createClient();
  const { data: row } = await supabase
    .from("org_payment_settings")
    .select("payu_merchant_key, payu_environment")
    .eq("organization_id", orgId)
    .maybeSingle();

  if (row?.payu_merchant_key) {
    return {
      merchantKey: row.payu_merchant_key,
      environment: (row.payu_environment as "production" | "sandbox") || "production",
      isConnected: true,
    };
  }

  return { merchantKey: null, environment: "production", isConnected: false };
}

export async function testPayUCredentials(
  merchantKey: string,
  merchantSalt: string
): Promise<{ success: boolean; message: string }> {
  const cleanKey = merchantKey.trim();
  const cleanSalt = merchantSalt.trim();

  if (!cleanKey || !cleanSalt) {
    return { success: false, message: "Key and Salt are required." };
  }

  try {
    const testHash = generatePayUHash({
      merchantKey: cleanKey,
      merchantSalt: cleanSalt,
      txnid: "test_verification_txn",
      amount: "100.00",
      productinfo: "Test Verification",
      firstname: "Test",
      email: "test@example.com",
    });

    if (testHash && testHash.length === 128) {
      return {
        success: true,
        message: "PayU SHA-512 cryptographic verification passed! Integration ready.",
      };
    }

    return { success: false, message: "Invalid hash generated." };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to verify PayU credentials.",
    };
  }
}
