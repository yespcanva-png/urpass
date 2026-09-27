"use server";

import { createClient } from "@/lib/supabase/server";
import type { CampusOverviewKPIs, CampusDepartmentStats, CampusAnalyticsFilter } from "@/types/campus";

export async function getCampusOverviewKPIs(
  institutionId: string,
  academicYear?: string
): Promise<CampusOverviewKPIs> {
  const supabase = await createClient();

  try {
    let eventsQuery = supabase
      .from("events")
      .select("id, event_date, status, department_id, club_id")
      .eq("institution_id", institutionId);

    if (academicYear) {
      eventsQuery = eventsQuery.eq("academic_year", academicYear);
    }

    const { data: events } = await eventsQuery;
    const eventList = events ?? [];
    const eventIds = eventList.map((e) => e.id);

    const now = new Date();
    const upcomingEvents = eventList.filter((e) => new Date(e.event_date) >= now).length;

    // Distinct active departments and clubs hosting events
    const activeDepts = new Set(eventList.map((e) => e.department_id).filter(Boolean)).size;
    const activeClubs = new Set(eventList.map((e) => e.club_id).filter(Boolean)).size;

    if (eventIds.length === 0) {
      return {
        totalEvents: 0,
        upcomingEvents: 0,
        totalRegistrations: 0,
        totalAttendees: 0,
        attendanceRate: 0,
        activeDepartments: activeDepts,
        activeClubs: activeClubs,
      };
    }

    // Attendees and Check-ins count across these events
    const [{ count: regCount }, { count: checkedInCount }] = await Promise.all([
      supabase.from("attendees").select("*", { count: "exact", head: true }).in("event_id", eventIds),
      supabase.from("passes").select("*", { count: "exact", head: true }).in("event_id", eventIds).not("checked_in_at", "is", null),
    ]);

    const totalRegs = regCount ?? 0;
    const totalCheckedIn = checkedInCount ?? 0;
    const attendanceRate = totalRegs > 0 ? Math.round((totalCheckedIn / totalRegs) * 100) : 0;

    return {
      totalEvents: eventList.length,
      upcomingEvents,
      totalRegistrations: totalRegs,
      totalAttendees: totalCheckedIn,
      attendanceRate,
      activeDepartments: activeDepts,
      activeClubs: activeClubs,
    };
  } catch {
    return {
      totalEvents: 0,
      upcomingEvents: 0,
      totalRegistrations: 0,
      totalAttendees: 0,
      attendanceRate: 0,
      activeDepartments: 0,
      activeClubs: 0,
    };
  }
}

export async function getCampusDepartmentStats(
  institutionId: string,
  academicYear?: string
): Promise<CampusDepartmentStats[]> {
  const supabase = await createClient();

  try {
    const { data: departments } = await supabase
      .from("campus_departments")
      .select("id, name, code, color")
      .eq("institution_id", institutionId)
      .order("name", { ascending: true });

    if (!departments) return [];

    const stats = await Promise.all(
      departments.map(async (dept) => {
        let eventsQuery = supabase
          .from("events")
          .select("id")
          .eq("department_id", dept.id);

        if (academicYear) {
          eventsQuery = eventsQuery.eq("academic_year", academicYear);
        }

        const { data: deptEvents } = await eventsQuery;
        const eventIds = (deptEvents ?? []).map((e) => e.id);

        const [{ count: clubsCount }, { count: regsCount }, { count: checkinsCount }] =
          await Promise.all([
            supabase.from("campus_clubs").select("*", { count: "exact", head: true }).eq("department_id", dept.id),
            eventIds.length > 0
              ? supabase.from("attendees").select("*", { count: "exact", head: true }).in("event_id", eventIds)
              : Promise.resolve({ count: 0 }),
            eventIds.length > 0
              ? supabase.from("passes").select("*", { count: "exact", head: true }).in("event_id", eventIds).not("checked_in_at", "is", null)
              : Promise.resolve({ count: 0 }),
          ]);

        const regs = regsCount ?? 0;
        const checkedIn = checkinsCount ?? 0;
        const rate = regs > 0 ? Math.round((checkedIn / regs) * 100) : 0;

        return {
          id: dept.id,
          name: dept.name,
          code: dept.code,
          color: dept.color,
          eventsCount: eventIds.length,
          registrationsCount: regs,
          checkedInCount: checkedIn,
          attendanceRate: rate,
          clubsCount: clubsCount ?? 0,
        };
      })
    );

    return stats.sort((a, b) => b.registrationsCount - a.registrationsCount);
  } catch {
    return [];
  }
}

export async function exportCampusAnalyticsCSV(
  institutionId: string,
  academicYear?: string
): Promise<string> {
  const stats = await getCampusDepartmentStats(institutionId, academicYear);

  const headers = [
    "Department Name",
    "Department Code",
    "Clubs Count",
    "Total Events",
    "Total Registrations",
    "Total Attendees",
    "Attendance Rate (%)",
  ];

  const rows = stats.map((s) => [
    `"${s.name}"`,
    `"${s.code}"`,
    s.clubsCount,
    s.eventsCount,
    s.registrationsCount,
    s.checkedInCount,
    `${s.attendanceRate}%`,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}
