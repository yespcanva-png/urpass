"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { institutionSchema, type InstitutionInput } from "@/lib/validations/campus";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type { Institution, CampusRole } from "@/types/campus";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

type ActionResult<T = undefined> = { error?: string; data?: T };

export async function getUserInstitutions(): Promise<Institution[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  try {
    // 1. Institutions where user is primary admin
    const { data: adminInsts } = await supabase
      .from("institutions")
      .select("*")
      .eq("primary_admin_id", user.id)
      .eq("status", "active");

    // 2. Institutions where user is a member
    const { data: memberships } = await supabase
      .from("campus_members")
      .select("institution:institutions(*)")
      .eq("user_id", user.id)
      .eq("status", "active");

    const instMap = new Map<string, Institution>();

    (adminInsts ?? []).forEach((inst) => {
      instMap.set(inst.id, inst as Institution);
    });

    (memberships ?? []).forEach((m) => {
      if (m.institution) {
        const inst = m.institution as unknown as Institution;
        instMap.set(inst.id, inst);
      }
    });

    return Array.from(instMap.values());
  } catch {
    return [];
  }
}

export async function getInstitution(institutionId: string): Promise<Institution | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const { data: inst, error } = await supabase
      .from("institutions")
      .select("*")
      .eq("id", institutionId)
      .maybeSingle();

    if (error || !inst) return null;

    // Fetch counts in parallel
    const [
      { count: deptCount },
      { count: clubCount },
      { count: eventCount },
      { count: studentCount },
    ] = await Promise.all([
      supabase.from("campus_departments").select("*", { count: "exact", head: true }).eq("institution_id", institutionId),
      supabase.from("campus_clubs").select("*", { count: "exact", head: true }).eq("institution_id", institutionId),
      supabase.from("events").select("*", { count: "exact", head: true }).eq("institution_id", institutionId),
      supabase.from("campus_students").select("*", { count: "exact", head: true }).eq("institution_id", institutionId),
    ]);

    return {
      ...(inst as Institution),
      departments_count: deptCount ?? 0,
      clubs_count: clubCount ?? 0,
      events_count: eventCount ?? 0,
      students_count: studentCount ?? 0,
    };
  } catch {
    return null;
  }
}

export async function createInstitution(data: InstitutionInput): Promise<ActionResult<Institution>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = institutionSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  let userEmail = user.email ?? "";
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("user_id", user.id)
      .maybeSingle();
    if (profile?.email) userEmail = profile.email;
  } catch {
    // fallback to user.email
  }

  try {
    // Check code uniqueness
    const { count: codeExists } = await supabase
      .from("institutions")
      .select("*", { count: "exact", head: true })
      .eq("institution_code", parsed.data.institution_code);

    if ((codeExists ?? 0) > 0) {
      return { error: "Institution code is already taken. Please use a unique abbreviation." };
    }

    const client = process.env.SUPABASE_SERVICE_ROLE_KEY ? adminClient() : supabase;

    const { data: inserted, error: insertError } = await client
      .from("institutions")
      .insert({
        ...parsed.data,
        primary_admin_id: user.id,
        subscription_tier: "campus",
        status: "active",
      })
      .select("*")
      .single();

    if (insertError || !inserted) {
      return { error: insertError?.message ?? "Failed to create institution" };
    }

    // Add creator as INSTITUTION_ADMIN member
    await client.from("campus_members").insert({
      institution_id: inserted.id,
      user_id: user.id,
      invited_email: userEmail,
      role: "INSTITUTION_ADMIN",
      status: "active",
    });

    revalidatePath("/dashboard/campus");
    return { data: inserted as Institution };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Unexpected error creating institution" };
  }
}

export async function updateInstitution(
  institutionId: string,
  data: Partial<InstitutionInput>
): Promise<ActionResult<Institution>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify user is primary admin or INSTITUTION_ADMIN
  const { data: inst } = await supabase
    .from("institutions")
    .select("id, primary_admin_id")
    .eq("id", institutionId)
    .single();

  if (!inst) return { error: "Institution not found" };

  const isPrimary = inst.primary_admin_id === user.id;
  if (!isPrimary) {
    const { data: member } = await supabase
      .from("campus_members")
      .select("role")
      .eq("institution_id", institutionId)
      .eq("user_id", user.id)
      .eq("status", "active")
      .eq("role", "INSTITUTION_ADMIN")
      .maybeSingle();

    if (!member) {
      return { error: "Unauthorized: only Institution Admins can update settings." };
    }
  }

  try {
    const client = process.env.SUPABASE_SERVICE_ROLE_KEY ? adminClient() : supabase;

    const { data: updated, error } = await client
      .from("institutions")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", institutionId)
      .select("*")
      .single();

    if (error) return { error: error.message };

    revalidatePath("/dashboard/campus");
    revalidatePath("/dashboard/campus/settings");
    return { data: updated as Institution };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to update institution" };
  }
}
