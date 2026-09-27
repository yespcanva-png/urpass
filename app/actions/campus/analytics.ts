"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  CampusOverviewKPIs,
  CampusDepartmentStats,
  CampusAnalyticsFilter,
  CampusDashboardData,
  CampusEventSummary,
  CampusTrendPoint,
  Institution,
  CampusApprovalStatus,
} from "@/types/campus";

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

export async function getCampusDashboardData(
  institutionId: string,
  academicYear?: string
): Promise<CampusDashboardData | null> {
  const supabase = await createClient();

  try {
    const { data: inst, error: instError } = await supabase
      .from("institutions")
      .select("*")
      .eq("id", institutionId)
      .maybeSingle();

    if (instError || !inst) return null;

    const [kpis, topDepartments] = await Promise.all([
      getCampusOverviewKPIs(institutionId, academicYear),
      getCampusDepartmentStats(institutionId, academicYear),
    ]);

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
        department:campus_departments(id, name, code, color),
        club:campus_clubs(id, name)
      `)
      .eq("institution_id", institutionId);

    if (academicYear) {
      eventsQuery = eventsQuery.eq("academic_year", academicYear);
    }

    const { data: rawEvents } = await eventsQuery.order("event_date", { ascending: false });
    const events = rawEvents ?? [];
    const eventIds = events.map((e) => e.id);

    const [attendeeCounts, checkinCounts] = await Promise.all([
      eventIds.length > 0
        ? supabase
            .from("attendees")
            .select("event_id")
            .in("event_id", eventIds)
        : Promise.resolve({ data: [] }),
      eventIds.length > 0
        ? supabase
            .from("passes")
            .select("event_id")
            .in("event_id", eventIds)
            .not("checked_in_at", "is", null)
        : Promise.resolve({ data: [] }),
    ]);

    const regMap: Record<string, number> = {};
    (attendeeCounts.data ?? []).forEach((row: { event_id: string }) => {
      regMap[row.event_id] = (regMap[row.event_id] || 0) + 1;
    });

    const checkinMap: Record<string, number> = {};
    (checkinCounts.data ?? []).forEach((row: { event_id: string }) => {
      checkinMap[row.event_id] = (checkinMap[row.event_id] || 0) + 1;
    });

    const eventSummaries: CampusEventSummary[] = events.map((e: any) => {
      const regs = regMap[e.id] || 0;
      const atts = checkinMap[e.id] || 0;
      const dept = Array.isArray(e.department) ? e.department[0] : e.department;
      const club = Array.isArray(e.club) ? e.club[0] : e.club;
      return {
        id: e.id,
        name: e.name,
        event_date: e.event_date,
        venue: e.venue || "Campus Venue",
        status: e.status,
        approval_status: (e.approval_status ?? "not_required") as CampusApprovalStatus,
        department_id: e.department_id,
        department_name: dept?.name ?? null,
        department_code: dept?.code ?? null,
        department_color: dept?.color ?? null,
        club_id: e.club_id,
        club_name: club?.name ?? null,
        registrations_count: regs,
        attendees_count: atts,
        attendance_rate: regs > 0 ? Math.round((atts / regs) * 100) : 0,
      };
    });

    const nowIso = new Date().toISOString().split("T")[0];
    const upcomingEvents = eventSummaries
      .filter((e) => e.event_date >= nowIso && e.status !== "cancelled")
      .sort((a, b) => a.event_date.localeCompare(b.event_date))
      .slice(0, 5);

    const recentEvents = eventSummaries
      .filter((e) => e.event_date < nowIso || e.status === "completed")
      .sort((a, b) => b.event_date.localeCompare(a.event_date))
      .slice(0, 5);

    const monthMap: Record<string, { registrations: number; attendees: number }> = {};
    eventSummaries.forEach((e) => {
      const monthKey = e.event_date ? e.event_date.slice(0, 7) : "Unknown";
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { registrations: 0, attendees: 0 };
      }
      monthMap[monthKey].registrations += e.registrations_count;
      monthMap[monthKey].attendees += e.attendees_count;
    });

    const trends: CampusTrendPoint[] = Object.entries(monthMap)
      .filter(([key]) => key !== "Unknown")
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([dateKey, val]) => {
        let label = dateKey;
        try {
          const [year, month] = dateKey.split("-");
          const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
          label = dateObj.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        } catch {
          // fallback
        }
        return {
          date: label,
          registrations: val.registrations,
          attendees: val.attendees,
        };
      });

    if (trends.length === 0) {
      const now = new Date();
      for (let i = 3; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        trends.push({
          date: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
          registrations: 0,
          attendees: 0,
        });
      }
    }

    return {
      institution: inst as Institution,
      kpis,
      topDepartments,
      upcomingEvents,
      recentEvents,
      trends,
    };
  } catch (err) {
    console.error("Error loading campus dashboard data:", err);
    return null;
  }
}
