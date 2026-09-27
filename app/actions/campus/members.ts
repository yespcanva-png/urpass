"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { campusMemberSchema, type CampusMemberInput } from "@/lib/validations/campus";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type { CampusMember, CampusRole } from "@/types/campus";
import crypto from "crypto";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

type ActionResult<T = undefined> = { error?: string; data?: T };

export async function getCampusMembers(
  institutionId: string,
  filter?: { departmentId?: string; clubId?: string; role?: CampusRole }
): Promise<CampusMember[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  try {
    let query = supabase
      .from("campus_members")
      .select(`
        *,
        department:campus_departments(id, name, code),
        club:campus_clubs(id, name)
      `)
      .eq("institution_id", institutionId);

    if (filter?.departmentId) {
      query = query.eq("department_id", filter.departmentId);
    }
    if (filter?.clubId) {
      query = query.eq("club_id", filter.clubId);
    }
    if (filter?.role) {
      query = query.eq("role", filter.role);
    }

    const { data: members, error } = await query.order("created_at", { ascending: false });

    if (error || !members) return [];

    // Attach profile details if user_id is present
    const enriched = await Promise.all(
      members.map(async (m) => {
        let userProfile = null;
        if (m.user_id) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url, email")
            .eq("user_id", m.user_id)
            .maybeSingle();
          userProfile = profile;
        }

        return {
          ...(m as unknown as CampusMember),
          user_profile: userProfile,
        };
      })
    );

    return enriched;
  } catch {
    return [];
  }
}

export async function inviteCampusMember(
  institutionId: string,
  data: CampusMemberInput
): Promise<ActionResult<CampusMember>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = campusMemberSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const email = parsed.data.invited_email.toLowerCase().trim();

  try {
    const client = process.env.SUPABASE_SERVICE_ROLE_KEY ? adminClient() : supabase;

    // Check if user already exists in auth.users by email
    const { data: existingProfile } = await client
      .from("profiles")
      .select("user_id")
      .eq("email", email)
      .maybeSingle();

    const inviteToken = crypto.randomBytes(24).toString("hex");

    const { data: inserted, error } = await client
      .from("campus_members")
      .insert({
        institution_id: institutionId,
        user_id: existingProfile?.user_id || null,
        department_id: parsed.data.department_id || null,
        club_id: parsed.data.club_id || null,
        role: parsed.data.role,
        invited_email: email,
        status: existingProfile ? "active" : "pending",
        invite_token: existingProfile ? null : inviteToken,
      })
      .select("*")
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/dashboard/campus/team");
    return { data: inserted as CampusMember };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to invite campus member" };
  }
}

export async function updateCampusMemberRole(
  memberId: string,
  role: CampusRole
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  try {
    const client = process.env.SUPABASE_SERVICE_ROLE_KEY ? adminClient() : supabase;
    const { error } = await client
      .from("campus_members")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", memberId);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/campus/team");
    return {};
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to update role" };
  }
}

export async function removeCampusMember(memberId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  try {
    const client = process.env.SUPABASE_SERVICE_ROLE_KEY ? adminClient() : supabase;
    const { error } = await client.from("campus_members").delete().eq("id", memberId);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/campus/team");
    return {};
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to remove member" };
  }
}
