"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { departmentSchema, type DepartmentInput } from "@/lib/validations/campus";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type {
  CampusDepartment,
  CampusDepartmentDetailData,
  CampusEventSummary,
  CampusClub,
  CampusMember,
  CampusApprovalStatus,
} from "@/types/campus";

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

    // Try single-query SQL aggregation RPC
    try {
      const { data: metrics, error: rpcError } = await supabase.rpc(
        "get_campus_department_metrics",
        { p_institution_id: institutionId }
      );
      if (!rpcError && metrics && Array.isArray(metrics)) {
        const metricsMap = new Map<string, { clubs_count: number; events_count: number; students_count: number; organizers_count: number }>();
        for (const m of metrics as Array<{ department_id: string; clubs_count: number; events_count: number; students_count: number; organizers_count: number }>) {
          metricsMap.set(m.department_id, {
            clubs_count: Number(m.clubs_count || 0),
            events_count: Number(m.events_count || 0),
            students_count: Number(m.students_count || 0),
            organizers_count: Number(m.organizers_count || 0),
          });
        }
        return depts.map((d) => {
          const met = metricsMap.get(d.id);
          return {
            ...(d as CampusDepartment),
            clubs_count: met?.clubs_count ?? 0,
            events_count: met?.events_count ?? 0,
            students_count: met?.students_count ?? 0,
            organizers_count: met?.organizers_count ?? 0,
          };
        });
      }
    } catch {
      // Fallback to bulk in-memory grouping
    }

    // High-performance batch aggregation fallback (4 queries total across ALL departments, not 4*N)
    const deptIds = depts.map((d) => d.id);
    const [clubsRes, eventsRes, studentsRes, membersRes] = await Promise.all([
      supabase.from("campus_clubs").select("department_id").in("department_id", deptIds),
      supabase.from("events").select("department_id").in("department_id", deptIds),
      supabase.from("campus_students").select("department_id").in("department_id", deptIds),
      supabase.from("campus_members").select("department_id").in("department_id", deptIds),
    ]);

    const countByDept = (rows: Array<{ department_id: string | null }> | null) => {
      const counts: Record<string, number> = {};
      for (const r of rows ?? []) {
        if (r.department_id) counts[r.department_id] = (counts[r.department_id] || 0) + 1;
      }
      return counts;
    };

    const clubsCountMap = countByDept(clubsRes.data as Array<{ department_id: string }>);
    const eventsCountMap = countByDept(eventsRes.data as Array<{ department_id: string }>);
    const studentsCountMap = countByDept(studentsRes.data as Array<{ department_id: string }>);
    const membersCountMap = countByDept(membersRes.data as Array<{ department_id: string }>);

    return depts.map((d) => ({
      ...(d as CampusDepartment),
      clubs_count: clubsCountMap[d.id] ?? 0,
      events_count: eventsCountMap[d.id] ?? 0,
      students_count: studentsCountMap[d.id] ?? 0,
      organizers_count: membersCountMap[d.id] ?? 0,
    }));
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

export async function getCampusDepartmentDetails(
  departmentId: string,
  academicYear?: string
): Promise<CampusDepartmentDetailData | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const dept = await getCampusDepartment(departmentId);
    if (!dept) return null;

    let eventsQuery = supabase
      .from("events")
      .select(`
        id,
        name,
        event_date,
        venue,
        status,
        approval_status,
        department_id,
        club_id,
        academic_year,
        club:campus_clubs(id, name)
      `)
      .eq("department_id", departmentId);

    if (academicYear) {
      eventsQuery = eventsQuery.eq("academic_year", academicYear);
    }

    const { data: rawEvents } = await eventsQuery.order("event_date", { ascending: false });
    const events = rawEvents ?? [];
    const eventIds = events.map((e) => e.id);

    const [attendeeCounts, checkinCounts, clubsRes, membersRes] = await Promise.all([
      eventIds.length > 0
        ? supabase.from("attendees").select("event_id").in("event_id", eventIds)
        : Promise.resolve({ data: [] }),
      eventIds.length > 0
        ? supabase.from("passes").select("event_id").in("event_id", eventIds).not("checked_in_at", "is", null)
        : Promise.resolve({ data: [] }),
      supabase
        .from("campus_clubs")
        .select("*")
        .eq("department_id", departmentId)
        .order("name", { ascending: true }),
      supabase
        .from("campus_members")
        .select(`
          id,
          institution_id,
          user_id,
          department_id,
          club_id,
          role,
          invited_email,
          status,
          created_at,
          updated_at
        `)
        .eq("department_id", departmentId)
        .order("created_at", { ascending: false }),
    ]);

    const regMap: Record<string, number> = {};
    (attendeeCounts.data ?? []).forEach((row: { event_id: string }) => {
      regMap[row.event_id] = (regMap[row.event_id] || 0) + 1;
    });

    const checkinMap: Record<string, number> = {};
    (checkinCounts.data ?? []).forEach((row: { event_id: string }) => {
      checkinMap[row.event_id] = (checkinMap[row.event_id] || 0) + 1;
    });

    let totalRegs = 0;
    let totalCheckIns = 0;

    const eventSummaries: CampusEventSummary[] = events.map((e: any) => {
      const regs = regMap[e.id] || 0;
      const atts = checkinMap[e.id] || 0;
      totalRegs += regs;
      totalCheckIns += atts;
      const club = Array.isArray(e.club) ? e.club[0] : e.club;

      return {
        id: e.id,
        name: e.name,
        event_date: e.event_date,
        venue: e.venue || "Department Venue",
        status: e.status,
        approval_status: (e.approval_status ?? "not_required") as CampusApprovalStatus,
        department_id: e.department_id,
        department_name: dept.name,
        department_code: dept.code,
        department_color: dept.color,
        club_id: e.club_id,
        club_name: club?.name ?? null,
        registrations_count: regs,
        attendees_count: atts,
        attendance_rate: regs > 0 ? Math.round((atts / regs) * 100) : 0,
      };
    });

    const avgAttendance = totalRegs > 0 ? Math.round((totalCheckIns / totalRegs) * 100) : 0;

    const clubsWithCounts: CampusClub[] = await Promise.all(
      (clubsRes.data ?? []).map(async (c) => {
        const { count: clubEventsCount } = await supabase
          .from("events")
          .select("*", { count: "exact", head: true })
          .eq("club_id", c.id);
        return {
          ...(c as CampusClub),
          events_count: clubEventsCount ?? 0,
        };
      })
    );

    return {
      department: dept,
      stats: {
        eventsThisYear: events.length,
        totalRegistrations: totalRegs,
        totalCheckIns: totalCheckIns,
        averageAttendance: avgAttendance,
      },
      events: eventSummaries,
      clubs: clubsWithCounts,
      organizers: (membersRes.data ?? []) as CampusMember[],
    };
  } catch (err) {
    console.error("Error fetching department details:", err);
    return null;
  }
}
