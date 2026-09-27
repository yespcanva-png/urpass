"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { departmentSchema, type DepartmentInput } from "@/lib/validations/campus";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type { CampusDepartment } from "@/types/campus";

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

export async function getCampusDepartments(institutionId: string): Promise<CampusDepartment[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  try {
    const { data: depts, error } = await supabase
      .from("campus_departments")
      .select("*")
      .eq("institution_id", institutionId)
      .order("name", { ascending: true });

    if (error || !depts) return [];

    // Fetch counts for clubs, events, and students
    const enhanced = await Promise.all(
      depts.map(async (d) => {
        const [
          { count: clubsCount },
          { count: eventsCount },
          { count: studentsCount },
          { count: organizersCount },
        ] = await Promise.all([
          supabase.from("campus_clubs").select("*", { count: "exact", head: true }).eq("department_id", d.id),
          supabase.from("events").select("*", { count: "exact", head: true }).eq("department_id", d.id),
          supabase.from("campus_students").select("*", { count: "exact", head: true }).eq("department_id", d.id),
          supabase.from("campus_members").select("*", { count: "exact", head: true }).eq("department_id", d.id),
        ]);

        return {
          ...(d as CampusDepartment),
          clubs_count: clubsCount ?? 0,
          events_count: eventsCount ?? 0,
          students_count: studentsCount ?? 0,
          organizers_count: organizersCount ?? 0,
        };
      })
    );

    return enhanced;
  } catch {
    return [];
  }
}

export async function getCampusDepartment(departmentId: string): Promise<CampusDepartment | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const { data: dept, error } = await supabase
      .from("campus_departments")
      .select("*")
      .eq("id", departmentId)
      .maybeSingle();

    if (error || !dept) return null;

    const [
      { count: clubsCount },
      { count: eventsCount },
      { count: studentsCount },
      { count: organizersCount },
    ] = await Promise.all([
      supabase.from("campus_clubs").select("*", { count: "exact", head: true }).eq("department_id", departmentId),
      supabase.from("events").select("*", { count: "exact", head: true }).eq("department_id", departmentId),
      supabase.from("campus_students").select("*", { count: "exact", head: true }).eq("department_id", departmentId),
      supabase.from("campus_members").select("*", { count: "exact", head: true }).eq("department_id", departmentId),
    ]);

    return {
      ...(dept as CampusDepartment),
      clubs_count: clubsCount ?? 0,
      events_count: eventsCount ?? 0,
      students_count: studentsCount ?? 0,
      organizers_count: organizersCount ?? 0,
    };
  } catch {
    return null;
  }
}

export async function createCampusDepartment(
  institutionId: string,
  data: DepartmentInput
): Promise<ActionResult<CampusDepartment>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = departmentSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const slug = parsed.data.slug || toSlug(parsed.data.name);

  try {
    const client = process.env.SUPABASE_SERVICE_ROLE_KEY ? adminClient() : supabase;

    const { data: inserted, error } = await client
      .from("campus_departments")
      .insert({
        institution_id: institutionId,
        name: parsed.data.name,
        code: parsed.data.code,
        slug,
        description: parsed.data.description || null,
        color: parsed.data.color || "#6D28D9",
        head_of_department_id: parsed.data.head_of_department_id || null,
      })
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") {
        return { error: `Department code '${parsed.data.code}' or slug '${slug}' already exists in this institution.` };
      }
      return { error: error.message };
    }

    revalidatePath("/dashboard/campus/departments");
    return { data: inserted as CampusDepartment };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to create department" };
  }
}

export async function updateCampusDepartment(
  departmentId: string,
  data: Partial<DepartmentInput>
): Promise<ActionResult<CampusDepartment>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  try {
    const client = process.env.SUPABASE_SERVICE_ROLE_KEY ? adminClient() : supabase;

    const { data: updated, error } = await client
      .from("campus_departments")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", departmentId)
      .select("*")
      .single();

    if (error) return { error: error.message };

    revalidatePath("/dashboard/campus/departments");
    revalidatePath(`/dashboard/campus/departments/${departmentId}`);
    return { data: updated as CampusDepartment };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to update department" };
  }
}

export async function deleteCampusDepartment(departmentId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  try {
    const client = process.env.SUPABASE_SERVICE_ROLE_KEY ? adminClient() : supabase;
    const { error } = await client.from("campus_departments").delete().eq("id", departmentId);
    if (error) return { error: error.message };

    revalidatePath("/dashboard/campus/departments");
    return {};
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to delete department" };
  }
}
