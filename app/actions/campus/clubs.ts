"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { clubSchema, type ClubInput } from "@/lib/validations/campus";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type { CampusClub } from "@/types/campus";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
}

type ActionResult<T = undefined> = { error?: string; data?: T };

export async function getCampusClubs(
  institutionId: string,
  departmentId?: string | null
): Promise<CampusClub[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  try {
    let query = supabase
      .from("campus_clubs")
      .select("*, department:campus_departments(id, name, code)")
      .eq("institution_id", institutionId);

    if (departmentId !== undefined) {
      if (departmentId === null) {
        query = query.is("department_id", null);
      } else {
        query = query.eq("department_id", departmentId);
      }
    }

    const { data: clubs, error } = await query.order("name", { ascending: true });

    if (error || !clubs) return [];

    // Fetch event counts for each club
    const enhanced = await Promise.all(
      clubs.map(async (c) => {
        const { count: eventsCount } = await supabase
          .from("events")
          .select("*", { count: "exact", head: true })
          .eq("club_id", c.id);

        return {
          ...(c as unknown as CampusClub),
          events_count: eventsCount ?? 0,
        };
      })
    );

    return enhanced;
  } catch {
    return [];
  }
}

export async function getCampusClub(clubId: string): Promise<CampusClub | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const { data: club, error } = await supabase
      .from("campus_clubs")
      .select("*, department:campus_departments(id, name, code)")
      .eq("id", clubId)
      .maybeSingle();

    if (error || !club) return null;

    const { count: eventsCount } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("club_id", clubId);

    return {
      ...(club as unknown as CampusClub),
      events_count: eventsCount ?? 0,
    };
  } catch {
    return null;
  }
}

export async function createCampusClub(
  institutionId: string,
  data: ClubInput
): Promise<ActionResult<CampusClub>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = clubSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const slug = parsed.data.slug || toSlug(parsed.data.name);

  try {
    const client = process.env.SUPABASE_SERVICE_ROLE_KEY ? adminClient() : supabase;

    const { data: inserted, error } = await client
      .from("campus_clubs")
      .insert({
        institution_id: institutionId,
        department_id: parsed.data.department_id || null,
        name: parsed.data.name,
        slug,
        category: parsed.data.category || "department_club",
        description: parsed.data.description || null,
        color: parsed.data.color || "#8B5CF6",
        faculty_advisor_id: parsed.data.faculty_advisor_id || null,
        lead_student_id: parsed.data.lead_student_id || null,
      })
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") {
        return { error: `Club with slug '${slug}' already exists in this institution.` };
      }
      return { error: error.message };
    }

    revalidatePath("/dashboard/campus/clubs");
    return { data: inserted as CampusClub };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to create club" };
  }
}

export async function updateCampusClub(
  clubId: string,
  data: Partial<ClubInput>
): Promise<ActionResult<CampusClub>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  try {
    const client = process.env.SUPABASE_SERVICE_ROLE_KEY ? adminClient() : supabase;

    const { data: updated, error } = await client
      .from("campus_clubs")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", clubId)
      .select("*")
      .single();

    if (error) return { error: error.message };

    revalidatePath("/dashboard/campus/clubs");
    return { data: updated as CampusClub };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to update club" };
  }
}

export async function deleteCampusClub(clubId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  try {
    const client = process.env.SUPABASE_SERVICE_ROLE_KEY ? adminClient() : supabase;
    const { error } = await client.from("campus_clubs").delete().eq("id", clubId);
    if (error) return { error: error.message };

    revalidatePath("/dashboard/campus/clubs");
    return {};
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to delete club" };
  }
}
