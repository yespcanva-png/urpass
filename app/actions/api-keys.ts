"use server";

import { createHash, randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type ActionResult<T = undefined> =
  | (T extends undefined ? { error: string } : { error: string } | { data: T })
  | undefined;

async function canUseApiAccess(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const plan = await getUserPlan(supabase, userId);
  return plan.canUse("api_access");
}

export async function createApiKey(
  name: string,
  environment: "sandbox" | "production" = "production"
): Promise<{ error: string } | { key: string; id: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (!(await canUseApiAccess(supabase, user.id))) {
    return { error: "API access is available on the Pro plan and above." };
  }

  if (!name || name.trim().length < 2) {
    return { error: "Key name must be at least 2 characters." };
  }

  // Check limit: max 10 keys per user per environment
  const { count } = await supabase
    .from("api_keys")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_active", true)
    .eq("environment", environment);

  if ((count ?? 0) >= 10) {
    return { error: `You have reached the maximum of 10 active ${environment} API keys.` };
  }

  const prefix = environment === "sandbox" ? "urp_test_" : "urp_live_";
  const rawKey = `${prefix}${randomBytes(24).toString("hex")}`;
  const keyHash = createHash("sha256").update(rawKey).digest("hex");
  const keyPrefix = rawKey.slice(0, environment === "sandbox" ? 17 : 16);

  const { data, error } = await supabase
    .from("api_keys")
    .insert({
      user_id: user.id,
      name: name.trim(),
      key_hash: keyHash,
      key_prefix: keyPrefix,
      permissions: ["events:read", "attendees:read"],
      environment,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/developer");
  return { key: rawKey, id: data.id };
}

export async function revokeApiKey(keyId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (!(await canUseApiAccess(supabase, user.id))) {
    return { error: "API access is available on the Pro plan and above." };
  }

  const { error } = await supabase
    .from("api_keys")
    .update({ is_active: false })
    .eq("id", keyId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/developer");
}

export async function deleteApiKey(keyId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (!(await canUseApiAccess(supabase, user.id))) {
    return { error: "API access is available on the Pro plan and above." };
  }

  const { error } = await supabase
    .from("api_keys")
    .delete()
    .eq("id", keyId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/developer");
}

export async function rotateApiKey(
  keyId: string
): Promise<{ error: string } | { key: string; id: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (!(await canUseApiAccess(supabase, user.id))) {
    return { error: "API access is available on the Pro plan and above." };
  }

  // Fetch the existing key to get name and environment
  const { data: existing, error: fetchError } = await supabase
    .from("api_keys")
    .select("id, name, environment")
    .eq("id", keyId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !existing) {
    return { error: "API key not found." };
  }

  // Revoke old key
  const { error: revokeError } = await supabase
    .from("api_keys")
    .update({ is_active: false })
    .eq("id", keyId)
    .eq("user_id", user.id);

  if (revokeError) return { error: revokeError.message };

  // Create new key
  const environment = (existing.environment ?? "production") as "sandbox" | "production";
  const prefix = environment === "sandbox" ? "urp_test_" : "urp_live_";
  const rawKey = `${prefix}${randomBytes(24).toString("hex")}`;
  const keyHash = createHash("sha256").update(rawKey).digest("hex");
  const keyPrefix = rawKey.slice(0, environment === "sandbox" ? 17 : 16);

  const { data, error } = await supabase
    .from("api_keys")
    .insert({
      user_id: user.id,
      name: existing.name,
      key_hash: keyHash,
      key_prefix: keyPrefix,
      permissions: ["events:read", "attendees:read"],
      environment,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/developer");
  return { key: rawKey, id: data.id };
}
