"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { clubSchema, type ClubInput } from "@/lib/validations/campus";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type {
  CampusClub,
  CampusClubDetailData,
  CampusEventSummary,
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

export async function getCampusClubDetails(
  clubId: string,
  academicYear?: string
): Promise<CampusClubDetailData | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const club = await getCampusClub(clubId);
    if (!club) return null;

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
        department:campus_departments(id, name, code, color)
      `)
      .eq("club_id", clubId);

    if (academicYear) {
      eventsQuery = eventsQuery.eq("academic_year", academicYear);
    }

    const { data: rawEvents } = await eventsQuery.order("event_date", { ascending: false });
    const events = rawEvents ?? [];
    const eventIds = events.map((e) => e.id);

    const [attendeeCounts, checkinCounts, membersRes] = await Promise.all([
      eventIds.length > 0
        ? supabase.from("attendees").select("event_id").in("event_id", eventIds)
        : Promise.resolve({ data: [] }),
      eventIds.length > 0
        ? supabase.from("passes").select("event_id").in("event_id", eventIds).not("checked_in_at", "is", null)
        : Promise.resolve({ data: [] }),
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
        .eq("club_id", clubId)
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
      const dept = Array.isArray(e.department) ? e.department[0] : e.department;

      return {
        id: e.id,
        name: e.name,
        event_date: e.event_date,
        venue: e.venue || "Club Venue",
        status: e.status,
        approval_status: (e.approval_status ?? "not_required") as CampusApprovalStatus,
        department_id: e.department_id,
        department_name: dept?.name ?? null,
        department_code: dept?.code ?? null,
        department_color: dept?.color ?? null,
        club_id: e.club_id,
        club_name: club.name,
        registrations_count: regs,
        attendees_count: atts,
        attendance_rate: regs > 0 ? Math.round((atts / regs) * 100) : 0,
      };
    });

    const avgAttendance = totalRegs > 0 ? Math.round((totalCheckIns / totalRegs) * 100) : 0;

    return {
      club,
      stats: {
        eventsCount: events.length,
        totalRegistrations: totalRegs,
        totalCheckIns: totalCheckIns,
        averageAttendance: avgAttendance,
      },
      events: eventSummaries,
      organizers: (membersRes.data ?? []) as CampusMember[],
    };
  } catch (err) {
    console.error("Error fetching club details:", err);
    return null;
  }
}
