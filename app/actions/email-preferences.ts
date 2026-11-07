"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveSetupReminderPreference(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) throw new Error("Sign in to update email settings.");
  const enabled = formData.get("lifecycle_reminders") === "on";
  const { data: existing, error: lookupError } = await supabase.from("email_preferences")
    .select("id").eq("user_id", user.id).maybeSingle();
  if (lookupError) throw new Error("Could not load email settings.");
  const result = existing
    ? await supabase.from("email_preferences").update({ lifecycle_reminders: enabled, email: user.email.toLowerCase() }).eq("user_id", user.id)
    : await supabase.from("email_preferences").insert({
        user_id: user.id, email: user.email.toLowerCase(), lifecycle_reminders: enabled,
        product_updates: false, marketing_offers: false, security_alerts: true,
      });
  if (result.error) throw new Error("Could not save email settings.");
  const { error: metadataError } = await supabase.auth.updateUser({ data: { lifecycle_reminders_opt_in: enabled } });
  if (metadataError) throw new Error("Could not save email settings.");
  revalidatePath("/dashboard/settings/email");
}
