"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { campusStudentSchema, type CampusStudentInput } from "@/lib/validations/campus";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type { CampusStudent, StudentParticipationSummary, StudentParticipationEvent } from "@/types/campus";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

type ActionResult<T = undefined> = { error?: string; data?: T };

export async function getCampusStudents(
  institutionId: string,
  filters?: { search?: string; departmentId?: string; year?: number; section?: string }
): Promise<CampusStudent[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  try {
    let query = supabase
      .from("campus_students")
      .select("*, department:campus_departments(id, name, code)")
      .eq("institution_id", institutionId);

    if (filters?.departmentId) {
      query = query.eq("department_id", filters.departmentId);
    }
    if (filters?.year) {
      query = query.eq("year", filters.year);
    }
    if (filters?.section) {
      query = query.eq("section", filters.section);
    }
    if (filters?.search) {
      const term = filters.search.trim().toLowerCase();
      query = query.or(`name.ilike.%${term}%,roll_number.ilike.%${term}%,email.ilike.%${term}%`);
    }

    const { data: students, error } = await query.order("roll_number", { ascending: true });

    if (error || !students) return [];
    return students as unknown as CampusStudent[];
  } catch {
    return [];
  }
}

export async function getCampusStudent(studentId: string): Promise<CampusStudent | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const { data: student, error } = await supabase
      .from("campus_students")
      .select("*, department:campus_departments(id, name, code)")
      .eq("id", studentId)
      .maybeSingle();

    if (error || !student) return null;

    // Attach participation summary
    const summary = await getStudentParticipationSummary(student.institution_id, student.email);

    return {
      ...(student as unknown as CampusStudent),
      participation: summary,
    };
  } catch {
    return null;
  }
}

export async function createCampusStudent(
  institutionId: string,
  data: CampusStudentInput
): Promise<ActionResult<CampusStudent>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = campusStudentSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const client = process.env.SUPABASE_SERVICE_ROLE_KEY ? adminClient() : supabase;

    const { data: inserted, error } = await client
      .from("campus_students")
      .insert({
        institution_id: institutionId,
        student_id: parsed.data.student_id || null,
        roll_number: parsed.data.roll_number.toUpperCase().trim(),
        name: parsed.data.name.trim(),
        email: parsed.data.email.toLowerCase().trim(),
        phone: parsed.data.phone?.trim() || null,
        department_id: parsed.data.department_id || null,
        year: parsed.data.year || null,
        section: parsed.data.section?.toUpperCase().trim() || null,
      })
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") {
        return { error: `Student with roll number '${parsed.data.roll_number}' already exists.` };
      }
      return { error: error.message };
    }

    revalidatePath("/dashboard/campus/students");
    return { data: inserted as CampusStudent };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to add student" };
  }
}

export async function importCampusStudentsCSV(
  institutionId: string,
  csvContent: string
): Promise<{ added: number; updated: number; errors: string[] }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return { added: 0, updated: 0, errors: ["CSV file is empty or missing headers"] };
  }

  // Parse header
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/['"]/g, ""));
  const rollIdx = headers.findIndex((h) => h.includes("roll") || h === "roll_number" || h === "reg_no");
  const nameIdx = headers.findIndex((h) => h === "name" || h.includes("full_name"));
  const emailIdx = headers.findIndex((h) => h === "email" || h.includes("mail"));
  const deptIdx = headers.findIndex((h) => h.includes("dept") || h.includes("department"));
  const yearIdx = headers.findIndex((h) => h === "year" || h.includes("batch"));
  const secIdx = headers.findIndex((h) => h === "section" || h === "sec");
  const phoneIdx = headers.findIndex((h) => h.includes("phone") || h.includes("mobile"));

  if (rollIdx === -1 || nameIdx === -1 || emailIdx === -1) {
    return {
      added: 0,
      updated: 0,
      errors: ["CSV must contain 'roll_number', 'name', and 'email' columns."],
    };
  }

  // Map departments by code/name
  const { data: depts } = await supabase
    .from("campus_departments")
    .select("id, code, name")
    .eq("institution_id", institutionId);

  const deptMap = new Map<string, string>();
  (depts ?? []).forEach((d) => {
    deptMap.set(d.code.toUpperCase(), d.id);
    deptMap.set(d.name.toLowerCase(), d.id);
  });

  const client = process.env.SUPABASE_SERVICE_ROLE_KEY ? adminClient() : supabase;
  let added = 0;
  let updated = 0;
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
    const roll = cols[rollIdx]?.toUpperCase();
    const name = cols[nameIdx];
    const email = cols[emailIdx]?.toLowerCase();

    if (!roll || !name || !email) continue;

    let departmentId: string | null = null;
    if (deptIdx !== -1 && cols[deptIdx]) {
      const val = cols[deptIdx];
      departmentId = deptMap.get(val.toUpperCase()) ?? deptMap.get(val.toLowerCase()) ?? null;
    }

    const yearVal = yearIdx !== -1 && cols[yearIdx] ? parseInt(cols[yearIdx], 10) : null;
    const year = yearVal && !isNaN(yearVal) && yearVal >= 1 && yearVal <= 5 ? yearVal : null;
    const section = secIdx !== -1 ? cols[secIdx]?.toUpperCase() || null : null;
    const phone = phoneIdx !== -1 ? cols[phoneIdx] || null : null;

    try {
      const { data: existing } = await client
        .from("campus_students")
        .select("id")
        .eq("institution_id", institutionId)
        .eq("roll_number", roll)
        .maybeSingle();

      if (existing) {
        await client
          .from("campus_students")
          .update({
            name,
            email,
            phone,
            department_id: departmentId,
            year,
            section,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
        updated++;
      } else {
        await client.from("campus_students").insert({
          institution_id: institutionId,
          roll_number: roll,
          name,
          email,
          phone,
          department_id: departmentId,
          year,
          section,
        });
        added++;
      }
    } catch (e: unknown) {
      errors.push(`Row ${i + 1} (${roll}): ${e instanceof Error ? e.message : "Insert failed"}`);
    }
  }

  revalidatePath("/dashboard/campus/students");
  return { added, updated, errors };
}

export async function exportCampusStudentsCSV(institutionId: string): Promise<string> {
  const students = await getCampusStudents(institutionId);

  const headers = ["Roll Number", "Name", "Email", "Phone", "Department", "Year", "Section"];
  const rows = students.map((s) => [
    `"${s.roll_number}"`,
    `"${s.name.replace(/"/g, '""')}"`,
    `"${s.email}"`,
    `"${s.phone || ""}"`,
    `"${s.department?.name || ""}"`,
    s.year ? String(s.year) : "",
    `"${s.section || ""}"`,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export async function getStudentParticipationSummary(
  institutionId: string,
  studentEmail: string
): Promise<StudentParticipationSummary> {
  const supabase = await createClient();

  try {
    // Query attendees matching student email for institution events
    const { data: attendees } = await supabase
      .from("attendees")
      .select(`
        id, event_id, status, created_at,
        event:events!inner(id, name, event_date, status, institution_id),
        pass:passes(status, checked_in_at)
      `)
      .eq("email", studentEmail.toLowerCase().trim())
      .eq("events.institution_id", institutionId);

    if (!attendees || attendees.length === 0) {
      return {
        events_registered: 0,
        events_attended: 0,
        events_missed: 0,
        last_attendance: null,
        last_event_name: null,
        attendance_rate: 0,
      };
    }

    let attendedCount = 0;
    let missedCount = 0;
    let lastAttendance: string | null = null;
    let lastEventName: string | null = null;

    attendees.forEach((a) => {
      const pass = Array.isArray(a.pass) ? a.pass[0] : a.pass;
      const event = a.event as unknown as { name: string; status: string };

      if (pass?.checked_in_at) {
        attendedCount++;
        if (!lastAttendance || new Date(pass.checked_in_at) > new Date(lastAttendance)) {
          lastAttendance = pass.checked_in_at;
          lastEventName = event.name;
        }
      } else if (event.status === "ended") {
        missedCount++;
      }
    });

    const rate = attendees.length > 0 ? Math.round((attendedCount / attendees.length) * 100) : 0;

    return {
      events_registered: attendees.length,
      events_attended: attendedCount,
      events_missed: missedCount,
      last_attendance: lastAttendance,
      last_event_name: lastEventName,
      attendance_rate: rate,
    };
  } catch {
    return {
      events_registered: 0,
      events_attended: 0,
      events_missed: 0,
      last_attendance: null,
      last_event_name: null,
      attendance_rate: 0,
    };
  }
}

export async function getStudentParticipationEvents(
  institutionId: string,
  studentEmail: string
): Promise<StudentParticipationEvent[]> {
  const supabase = await createClient();

  try {
    const { data: attendees } = await supabase
      .from("attendees")
      .select(`
        id, event_id, created_at,
        event:events!inner(
          id, name, event_date, venue, status, institution_id,
          department:campus_departments(name),
          club:campus_clubs(name)
        ),
        pass:passes(checked_in_at)
      `)
      .eq("email", studentEmail.toLowerCase().trim())
      .eq("events.institution_id", institutionId)
      .order("created_at", { ascending: false });

    if (!attendees) return [];

    return attendees.map((a) => {
      const pass = Array.isArray(a.pass) ? a.pass[0] : a.pass;
      const event = a.event as unknown as {
        id: string;
        name: string;
        event_date: string;
        venue: string;
        status: string;
        department?: { name: string } | null;
        club?: { name: string } | null;
      };

      return {
        event_id: event.id,
        event_name: event.name,
        event_date: event.event_date,
        venue: event.venue,
        status: event.status,
        registered_at: a.created_at,
        checked_in_at: pass?.checked_in_at ?? null,
        attended: Boolean(pass?.checked_in_at),
        department_name: event.department?.name ?? null,
        club_name: event.club?.name ?? null,
      };
    });
  } catch {
    return [];
  }
}
