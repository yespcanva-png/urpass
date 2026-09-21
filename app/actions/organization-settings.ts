"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import {
  organizationSettingsSchema,
  type OrganizationSettingsInput,
} from "@/lib/validations/organization-settings";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type { OrganizationSettings } from "@/types";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function getOrganizationSettings(orgId: string): Promise<OrganizationSettings | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const { data, error } = await supabase
      .from("organization_settings")
      .select("*")
      .eq("organization_id", orgId)
      .maybeSingle();

    if (error || !data) {
      // Default fallback settings
      return {
        id: `settings-${orgId}`,
        organization_id: orgId,
        timezone: "Asia/Kolkata",
        currency: "INR",
        date_format: "DD/MM/YYYY",
        time_format: "12h",
        allowed_domains: [],
        enforce_2fa: false,
        require_approval_for_passes: false,
        email_sender_name: null,
        support_email: null,
        custom_domain: null,
        brand_logo_url: null,
        brand_primary_color: "#6D28D9",
        brand_secondary_color: "#4C1D95",
        default_pass_template: "modern",
        features: {
          workspaces: true,
          locations: true,
          multiGate: true,
          advancedAnalytics: true,
          customPasses: true,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    return data as OrganizationSettings;
  } catch {
    return null;
  }
}

export async function updateOrganizationSettings(
  orgId: string,
  data: OrganizationSettingsInput
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify owner/admin
  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    return { error: "Only organization owners and admins can update organization settings." };
  }

  const parsed = organizationSettingsSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const { error } = await adminClient()
      .from("organization_settings")
      .upsert(
        {
          organization_id: orgId,
          ...parsed.data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "organization_id" }
      );

    if (error) return { error: error.message };

    revalidatePath(`/org`);
    return {};
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to save organization settings." };
  }
}
