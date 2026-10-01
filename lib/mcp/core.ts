import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { getUserPlan } from "@/lib/plan";
import { sendPassEmail } from "@/lib/email";
import {
  checkRoomConflict,
  checkSpeakerConflicts,
} from "@/lib/conference/conflict-detection";
import { computeConferenceAnalytics, slugify } from "@/lib/conference/helpers";
import type { EventSession, EventRoom } from "@/types/conference";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export interface McpToolContext {
  userId: string;
}

// ─────────────────────────────────────────────────────────────
// 1. list_events
// ─────────────────────────────────────────────────────────────
export async function mcpListEvents(
  ctx: McpToolContext,
  params: { status?: string; limit?: number; offset?: number } = {}
) {
  const supabase = adminClient();
  const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
  const offset = Math.max(params.offset ?? 0, 0);

  let query = supabase
    .from("events")
    .select(
      "id, name, description, event_date, start_time, end_time, venue, status, is_paid_event, ticket_price, attendee_limit, apply_slug, created_at",
      { count: "exact" }
    )
    .eq("organizer_id", ctx.userId)
    .order("event_date", { ascending: false })
    .range(offset, offset + limit - 1);

  if (params.status) {
    query = query.eq("status", params.status);
  }

  const { data: events, error, count } = await query;
  if (error) throw new Error(`Failed to list events: ${error.message}`);

  return {
    events: events ?? [],
    total: count ?? 0,
    limit,
    offset,
  };
}

// ─────────────────────────────────────────────────────────────
// 2. get_event
// ─────────────────────────────────────────────────────────────
export async function mcpGetEvent(
  ctx: McpToolContext,
  params: { eventId: string }
) {
  const supabase = adminClient();
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.eventId)
    .eq("organizer_id", ctx.userId)
    .single();

  if (error || !event) {
    throw new Error(`Event not found or unauthorized: ${params.eventId}`);
  }

  const [
    { count: totalAttendees },
    { count: approvedAttendees },
    { count: checkedInCount },
    { data: ticketTypes },
  ] = await Promise.all([
    supabase
      .from("attendees")
      .select("*", { count: "exact", head: true })
      .eq("event_id", params.eventId),
    supabase
      .from("attendees")
      .select("*", { count: "exact", head: true })
      .eq("event_id", params.eventId)
      .eq("application_status", "approved"),
    supabase
      .from("check_ins")
      .select("*", { count: "exact", head: true })
      .eq("event_id", params.eventId),
    supabase
      .from("ticket_types")
      .select("*")
      .eq("event_id", params.eventId)
      .order("created_at", { ascending: true }),
  ]);

  return {
    ...event,
    applyUrl: `https://urpass.space/apply/${event.apply_slug || event.id}`,
    stats: {
      totalApplications: totalAttendees ?? 0,
      approved: approvedAttendees ?? 0,
      checkedIn: checkedInCount ?? 0,
      capacity: event.attendee_limit,
      capacityUsedPct: event.attendee_limit
        ? Math.round(((approvedAttendees ?? 0) / event.attendee_limit) * 100)
        : 0,
    },
    ticketTypes: ticketTypes ?? [],
  };
}

// ─────────────────────────────────────────────────────────────
// 3. create_event
// ─────────────────────────────────────────────────────────────
export async function mcpCreateEvent(
  ctx: McpToolContext,
  params: {
    name: string;
    event_date: string;
    start_time: string;
    end_time?: string;
    venue: string;
    description?: string;
    attendee_limit?: number;
    auto_approve?: boolean;
    is_paid_event?: boolean;
    ticket_price?: number;
    event_type?: "physical" | "online" | "hybrid";
    meeting_url?: string;
    meeting_platform?: "zoom" | "google_meet" | "teams" | "custom";
  }
) {
  const supabase = adminClient();
  const plan = await getUserPlan(supabase, ctx.userId);

  // Check plan event limit
  if (!plan.unlimited) {
    const { count } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("organizer_id", ctx.userId)
      .in("status", ["draft", "active"]);

    if ((count ?? 0) >= plan.maxEvents) {
      throw new Error(
        `Plan event limit reached (${plan.maxEvents} events). Please upgrade to create more events.`
      );
    }
  }

  const slugBase = params.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const apply_slug = `${slugBase}-${randomSuffix}`;

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      organizer_id: ctx.userId,
      name: params.name.trim(),
      event_date: params.event_date,
      start_time: params.start_time,
      end_time: params.end_time || null,
      venue: params.venue.trim(),
      description: params.description?.trim() || null,
      attendee_limit: params.attendee_limit ?? Math.min(100, plan.maxAttendees),
      auto_approve: params.auto_approve ?? false,
      is_paid_event: params.is_paid_event ?? false,
      ticket_price: params.ticket_price ?? 0,
      event_type: params.event_type ?? "physical",
      meeting_url: params.meeting_url || null,
      meeting_platform: params.meeting_platform || null,
      apply_slug,
      status: "active",
      application_enabled: true,
    })
    .select("*")
    .single();

  if (error || !event) {
    throw new Error(`Failed to create event: ${error?.message}`);
  }

  return {
    event,
    applyUrl: `https://urpass.space/apply/${event.apply_slug || event.id}`,
    message: "Event created successfully",
  };
}

// ─────────────────────────────────────────────────────────────
// 4. list_attendees
// ─────────────────────────────────────────────────────────────
export async function mcpListAttendees(
  ctx: McpToolContext,
  params: {
    eventId: string;
    status?: "all" | "pending" | "approved" | "rejected";
    query?: string;
    limit?: number;
    offset?: number;
  }
) {
  const supabase = adminClient();
  // Ensure user owns event
  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("id", params.eventId)
    .eq("organizer_id", ctx.userId)
    .single();

  if (!event) throw new Error("Event not found or unauthorized");

  const limit = Math.min(Math.max(params.limit ?? 50, 1), 100);
  const offset = Math.max(params.offset ?? 0, 0);

  let q = supabase
    .from("attendees")
    .select(
      "id, name, email, phone, pass_type, application_status, pass_status, created_at, passes(id, pass_token, status)",
      { count: "exact" }
    )
    .eq("event_id", params.eventId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (params.status && params.status !== "all") {
    q = q.eq("application_status", params.status);
  }

  if (params.query) {
    const term = params.query.trim().toLowerCase();
    q = q.or(`name.ilike.%${term}%,email.ilike.%${term}%`);
  }

  const { data: attendees, error, count } = await q;
  if (error) throw new Error(`Failed to list attendees: ${error.message}`);

  return {
    attendees: attendees ?? [],
    total: count ?? 0,
    limit,
    offset,
  };
}

// ─────────────────────────────────────────────────────────────
// 5. approve_attendee
// ─────────────────────────────────────────────────────────────
export async function mcpApproveAttendee(
  ctx: McpToolContext,
  params: { attendeeId: string; eventId: string }
) {
  const supabase = adminClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, name, event_date, venue, attendee_limit")
    .eq("id", params.eventId)
    .eq("organizer_id", ctx.userId)
    .single();

  if (!event) throw new Error("Event not found or unauthorized");

  // Check capacity
  const { count: approvedCount } = await supabase
    .from("attendees")
    .select("*", { count: "exact", head: true })
    .eq("event_id", params.eventId)
    .eq("application_status", "approved");

  if ((approvedCount ?? 0) >= event.attendee_limit) {
    throw new Error(`Event is at maximum capacity (${event.attendee_limit}).`);
  }

  // Update attendee status
  const { data: attendee, error: attError } = await supabase
    .from("attendees")
    .update({ application_status: "approved" })
    .eq("id", params.attendeeId)
    .eq("event_id", params.eventId)
    .select("id, name, email, pass_type")
    .single();

  if (attError || !attendee) {
    throw new Error(`Failed to approve attendee: ${attError?.message}`);
  }

  // Generate pass if not exists
  let passToken: string | null = null;
  const { data: existingPass } = await supabase
    .from("passes")
    .select("pass_token")
    .eq("attendee_id", attendee.id)
    .eq("event_id", params.eventId)
    .maybeSingle();

  if (existingPass) {
    passToken = existingPass.pass_token;
  } else {
    const { data: newPass, error: passErr } = await supabase
      .from("passes")
      .insert({
        event_id: params.eventId,
        attendee_id: attendee.id,
        pass_type: attendee.pass_type,
      })
      .select("pass_token")
      .single();

    if (!passErr && newPass) {
      passToken = newPass.pass_token;
      await supabase
        .from("attendees")
        .update({ pass_status: "generated" })
        .eq("id", attendee.id);

      sendPassEmail({
        to: attendee.email,
        attendeeName: attendee.name,
        eventName: event.name,
        eventDate: event.event_date,
        venue: event.venue,
        passToken: newPass.pass_token,
        passType: attendee.pass_type,
      }).catch((err: unknown) => console.error("[mcp email]", err));
    }
  }

  return {
    success: true,
    message: `Attendee ${attendee.name} approved successfully`,
    passToken,
    passUrl: passToken ? `https://urpass.space/pass/${passToken}` : null,
  };
}

// ─────────────────────────────────────────────────────────────
// 6. reject_attendee
// ─────────────────────────────────────────────────────────────
export async function mcpRejectAttendee(
  ctx: McpToolContext,
  params: { attendeeId: string; eventId: string }
) {
  const supabase = adminClient();

  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("id", params.eventId)
    .eq("organizer_id", ctx.userId)
    .single();

  if (!event) throw new Error("Event not found or unauthorized");

  const { error } = await supabase
    .from("attendees")
    .update({ application_status: "rejected" })
    .eq("id", params.attendeeId)
    .eq("event_id", params.eventId);

  if (error) throw new Error(`Failed to reject attendee: ${error.message}`);

  return { success: true, message: "Attendee rejected successfully" };
}

// ─────────────────────────────────────────────────────────────
// 7. lookup_pass
// ─────────────────────────────────────────────────────────────
export async function mcpLookupPass(
  ctx: McpToolContext,
  params: { passTokenOrEmail: string; eventId?: string }
) {
  const supabase = adminClient();
  const search = params.passTokenOrEmail.trim();

  let passQuery = supabase
    .from("passes")
    .select("id, pass_token, pass_type, status, generated_at, event_id, attendee_id, events(id, name, organizer_id), attendees(name, email, phone, application_status)");

  if (search.includes("@")) {
    const { data: attendee } = await supabase
      .from("attendees")
      .select("id, event_id")
      .eq("email", search)
      .maybeSingle();

    if (!attendee) throw new Error(`No attendee found with email: ${search}`);
    passQuery = passQuery.eq("attendee_id", attendee.id);
  } else {
    // Strip URL if full pass URL was provided
    const cleanToken = search.replace(/^https?:\/\/[^\/]+\/pass\//, "");
    passQuery = passQuery.eq("pass_token", cleanToken);
  }

  if (params.eventId) {
    passQuery = passQuery.eq("event_id", params.eventId);
  }

  const { data: pass, error } = await passQuery.maybeSingle();
  if (error || !pass) throw new Error("Pass not found");

  const event = pass.events as unknown as { id: string; name: string; organizer_id: string } | null;
  if (!event || event.organizer_id !== ctx.userId) {
    throw new Error("Pass found but you do not have permission to view this event");
  }

  // Get check-in details if checked in
  const { data: checkIn } = await supabase
    .from("check_ins")
    .select("checked_in_at, check_in_method")
    .eq("pass_id", pass.id)
    .maybeSingle();

  return {
    passToken: pass.pass_token,
    passType: pass.pass_type,
    status: pass.status,
    attendee: pass.attendees,
    event: { id: event.id, name: event.name },
    checkInDetails: checkIn || null,
    passUrl: `https://urpass.space/pass/${pass.pass_token}`,
  };
}

// ─────────────────────────────────────────────────────────────
// 8. verify_checkin
// ─────────────────────────────────────────────────────────────
export async function mcpVerifyCheckin(
  ctx: McpToolContext,
  params: { passToken: string; eventId: string; gateId?: string }
) {
  const supabase = adminClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, name")
    .eq("id", params.eventId)
    .eq("organizer_id", ctx.userId)
    .single();

  if (!event) throw new Error("Event not found or unauthorized");

  const cleanToken = params.passToken.trim().replace(/^https?:\/\/[^\/]+\/pass\//, "");

  const { data: pass } = await supabase
    .from("passes")
    .select("id, pass_token, pass_type, status, attendee_id")
    .eq("pass_token", cleanToken)
    .eq("event_id", params.eventId)
    .single();

  if (!pass) throw new Error("Pass not found for this event");

  const { data: attendee } = await supabase
    .from("attendees")
    .select("id, name, email, pass_type, application_status")
    .eq("id", pass.attendee_id)
    .single();

  if (pass.status === "checked_in") {
    return {
      success: false,
      alreadyCheckedIn: true,
      message: `Pass has ALREADY been checked in.`,
      attendee,
      passType: pass.pass_type,
    };
  }

  // Record check-in
  const { error: ciError } = await supabase.from("check_ins").insert({
    pass_id: pass.id,
    event_id: params.eventId,
    attendee_id: pass.attendee_id,
    checked_in_by: ctx.userId,
    gate_id: params.gateId || null,
    check_in_method: "mcp",
  });

  if (ciError && ciError.code === "23505") {
    return {
      success: false,
      alreadyCheckedIn: true,
      message: `Pass has ALREADY been checked in concurrently.`,
      attendee,
      passType: pass.pass_type,
    };
  }

  await supabase.from("passes").update({ status: "checked_in" }).eq("id", pass.id);
  await supabase.from("attendees").update({ pass_status: "checked_in" }).eq("id", pass.attendee_id);

  return {
    success: true,
    message: `Successfully checked in ${attendee?.name || "Attendee"}`,
    attendee,
    passType: pass.pass_type,
    checkedInAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────
// 9. get_event_analytics
// ─────────────────────────────────────────────────────────────
export async function mcpGetEventAnalytics(
  ctx: McpToolContext,
  params: { eventId: string }
) {
  const supabase = adminClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, name, event_date, venue, attendee_limit, is_paid_event, ticket_price")
    .eq("id", params.eventId)
    .eq("organizer_id", ctx.userId)
    .single();

  if (!event) throw new Error("Event not found or unauthorized");

  const [
    { data: attendees },
    { data: checkIns },
    { data: orders },
  ] = await Promise.all([
    supabase
      .from("attendees")
      .select("application_status, pass_status, pass_type, created_at")
      .eq("event_id", params.eventId),
    supabase
      .from("check_ins")
      .select("checked_in_at, check_in_method")
      .eq("event_id", params.eventId),
    supabase
      .from("ticket_orders")
      .select("amount, status, created_at")
      .eq("event_id", params.eventId)
      .eq("status", "paid"),
  ]);

  const list = attendees ?? [];
  const total = list.length;
  const approved = list.filter((a) => a.application_status === "approved").length;
  const pending = list.filter((a) => a.application_status === "pending").length;
  const rejected = list.filter((a) => a.application_status === "rejected").length;
  const checkedIn = (checkIns ?? []).length;

  const totalRevenuePaise = (orders ?? []).reduce((acc, o) => acc + (o.amount || 0), 0);

  return {
    eventName: event.name,
    eventDate: event.event_date,
    metrics: {
      totalApplications: total,
      approved,
      pending,
      rejected,
      checkedIn,
      attendanceRatePct: approved > 0 ? Math.round((checkedIn / approved) * 100) : 0,
      capacity: event.attendee_limit,
      capacityOccupiedPct: event.attendee_limit
        ? Math.round((approved / event.attendee_limit) * 100)
        : 0,
      totalRevenue: `₹${(totalRevenuePaise / 100).toLocaleString("en-IN")}`,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// 10. issue_pass
// ─────────────────────────────────────────────────────────────
export async function mcpIssuePass(
  ctx: McpToolContext,
  params: {
    eventId: string;
    name: string;
    email: string;
    phone?: string;
    passType?: string;
  }
) {
  const supabase = adminClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, name, event_date, venue, attendee_limit")
    .eq("id", params.eventId)
    .eq("organizer_id", ctx.userId)
    .single();

  if (!event) throw new Error("Event not found or unauthorized");

  const pass_type = params.passType || "participant";

  // Create attendee as approved
  const { data: attendee, error: attError } = await supabase
    .from("attendees")
    .insert({
      event_id: params.eventId,
      name: params.name.trim(),
      email: params.email.trim().toLowerCase(),
      phone: params.phone?.trim() || null,
      pass_type,
      application_status: "approved",
      pass_status: "generated",
    })
    .select("id, name, email")
    .single();

  if (attError || !attendee) {
    if (attError?.code === "23505") {
      throw new Error(`Attendee with email ${params.email} is already registered for this event.`);
    }
    throw new Error(`Failed to issue pass: ${attError?.message}`);
  }

  // Create pass
  const { data: pass, error: passError } = await supabase
    .from("passes")
    .insert({
      event_id: params.eventId,
      attendee_id: attendee.id,
      pass_type,
      status: "generated",
    })
    .select("pass_token")
    .single();

  if (passError || !pass) {
    throw new Error(`Failed to generate pass token: ${passError?.message}`);
  }

  sendPassEmail({
    to: attendee.email,
    attendeeName: attendee.name,
    eventName: event.name,
    eventDate: event.event_date,
    venue: event.venue,
    passToken: pass.pass_token,
    passType: pass_type,
  }).catch((err: unknown) => console.error("[mcp issue_pass email]", err));

  return {
    success: true,
    message: `Pass generated and emailed to ${attendee.email}`,
    attendeeId: attendee.id,
    passToken: pass.pass_token,
    passUrl: `https://urpass.space/pass/${pass.pass_token}`,
  };
}

// ─────────────────────────────────────────────────────────────
// Conference Management Tools
// ─────────────────────────────────────────────────────────────

async function verifyOrganizerEvent(
  supabase: ReturnType<typeof adminClient>,
  eventId: string,
  userId: string
) {
  const { data: event, error } = await supabase
    .from("events")
    .select("id, name, organizer_id")
    .eq("id", eventId)
    .single();

  if (error || !event || event.organizer_id !== userId) {
    throw new Error(`Event not found or unauthorized: ${eventId}`);
  }
  return event;
}

// 11. list_sessions
export async function mcpListSessions(
  ctx: McpToolContext,
  params: { eventId: string; date?: string; roomId?: string; trackId?: string; limit?: number }
) {
  const supabase = adminClient();
  await verifyOrganizerEvent(supabase, params.eventId, ctx.userId);

  let query = supabase
    .from("event_sessions")
    .select(`
      id,
      title,
      session_type,
      description,
      session_date,
      start_time,
      end_time,
      capacity,
      registration_required,
      checkin_enabled,
      status,
      room:event_rooms(id, name, capacity),
      track:event_tracks(id, name, color),
      speakers:session_speakers(role, speaker:event_speakers(id, full_name, job_title, company))
    `)
    .eq("event_id", params.eventId)
    .order("session_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (params.date) query = query.eq("session_date", params.date);
  if (params.roomId) query = query.eq("room_id", params.roomId);
  if (params.trackId) query = query.eq("track_id", params.trackId);
  if (params.limit) query = query.limit(params.limit);

  const { data: sessions, error } = await query;
  if (error) throw new Error(`Failed to list sessions: ${error.message}`);

  return {
    eventId: params.eventId,
    total: sessions?.length || 0,
    sessions: sessions || [],
  };
}

// 12. create_session
export async function mcpCreateSession(
  ctx: McpToolContext,
  params: {
    eventId: string;
    title: string;
    session_type?: string;
    session_date: string;
    start_time: string;
    end_time: string;
    room_id?: string;
    track_id?: string;
    capacity?: number;
    registration_required?: boolean;
    description?: string;
  }
) {
  const supabase = adminClient();
  await verifyOrganizerEvent(supabase, params.eventId, ctx.userId);

  if (params.room_id) {
    const { data: existingSessions } = await supabase
      .from("event_sessions")
      .select("id, title, room_id, session_date, start_time, end_time")
      .eq("event_id", params.eventId)
      .eq("room_id", params.room_id)
      .eq("session_date", params.session_date);

    const conflict = checkRoomConflict(
      {
        session_date: params.session_date,
        start_time: params.start_time,
        end_time: params.end_time,
        room_id: params.room_id,
      },
      (existingSessions || []) as EventSession[]
    );

    if (conflict) {
      throw new Error(`Schedule Conflict: ${conflict.message}`);
    }
  }

  const slug = `${slugify(params.title)}-${Date.now().toString(36)}`;

  const { data: session, error } = await supabase
    .from("event_sessions")
    .insert({
      event_id: params.eventId,
      title: params.title.trim(),
      slug,
      session_type: params.session_type || "presentation",
      session_date: params.session_date,
      start_time: params.start_time,
      end_time: params.end_time,
      room_id: params.room_id || null,
      track_id: params.track_id || null,
      capacity: params.capacity || null,
      registration_required: params.registration_required ?? false,
      description: params.description || null,
      status: "published",
    })
    .select("*")
    .single();

  if (error || !session) {
    throw new Error(`Failed to create session: ${error?.message}`);
  }

  return {
    success: true,
    message: `Session "${session.title}" created successfully.`,
    session,
  };
}

// 13. list_rooms
export async function mcpListRooms(
  ctx: McpToolContext,
  params: { eventId: string }
) {
  const supabase = adminClient();
  await verifyOrganizerEvent(supabase, params.eventId, ctx.userId);

  const { data: rooms, error } = await supabase
    .from("event_rooms")
    .select("id, name, location, floor, capacity, checkin_enabled, description")
    .eq("event_id", params.eventId)
    .order("name", { ascending: true });

  if (error) throw new Error(`Failed to list rooms: ${error.message}`);
  return { eventId: params.eventId, rooms: rooms || [] };
}

// 14. list_speakers
export async function mcpListSpeakers(
  ctx: McpToolContext,
  params: { eventId: string }
) {
  const supabase = adminClient();
  await verifyOrganizerEvent(supabase, params.eventId, ctx.userId);

  const { data: speakers, error } = await supabase
    .from("event_speakers")
    .select("id, full_name, job_title, company, bio, linkedin_url, website_url, email, visibility")
    .eq("event_id", params.eventId)
    .order("display_order", { ascending: true });

  if (error) throw new Error(`Failed to list speakers: ${error.message}`);
  return { eventId: params.eventId, speakers: speakers || [] };
}

// 15. assign_speaker
export async function mcpAssignSpeaker(
  ctx: McpToolContext,
  params: { sessionId: string; speakerId: string; role?: string }
) {
  const supabase = adminClient();

  const { data: session } = await supabase
    .from("event_sessions")
    .select("id, event_id, title, session_date, start_time, end_time")
    .eq("id", params.sessionId)
    .single();

  if (!session) throw new Error("Session not found");
  await verifyOrganizerEvent(supabase, session.event_id, ctx.userId);

  const { data: speakerSessions } = await supabase
    .from("session_speakers")
    .select(`
      session_id,
      session:event_sessions (id, title, session_date, start_time, end_time)
    `)
    .eq("speaker_id", params.speakerId);

  const existingSpeakerSessions = (speakerSessions || [])
    .map((s: any) => (Array.isArray(s.session) ? s.session[0] : s.session))
    .filter(Boolean);

  const conflicts = checkSpeakerConflicts(
    session as EventSession,
    [params.speakerId],
    existingSpeakerSessions as EventSession[]
  );

  if (conflicts.length > 0) {
    throw new Error(`Speaker Double-Booking: ${conflicts[0].message}`);
  }

  const { error } = await supabase
    .from("session_speakers")
    .upsert({
      session_id: params.sessionId,
      speaker_id: params.speakerId,
      role: params.role || "speaker",
    });

  if (error) throw new Error(`Failed to assign speaker: ${error.message}`);

  return {
    success: true,
    message: `Speaker assigned to session "${session.title}" as ${params.role || "speaker"}.`,
  };
}

// 16. verify_session_checkin
export async function mcpVerifySessionCheckin(
  ctx: McpToolContext,
  params: { sessionId: string; passToken: string; override?: boolean }
) {
  const supabase = adminClient();

  const { data: session } = await supabase
    .from("event_sessions")
    .select("id, event_id, title, capacity, registration_required, checkin_enabled, room:event_rooms(name, capacity)")
    .eq("id", params.sessionId)
    .single();

  if (!session) throw new Error("Session not found");
  await verifyOrganizerEvent(supabase, session.event_id, ctx.userId);

  let cleanToken = params.passToken.trim();
  if (cleanToken.includes("/pass/")) {
    cleanToken = cleanToken.split("/pass/")[1].split("?")[0];
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanToken);
  let passQuery = supabase
    .from("passes")
    .select("id, pass_token, pass_type, event_id, attendee:attendees(id, name, email, application_status)");

  const { data: pass } = await (isUuid
    ? passQuery.or(`id.eq.${cleanToken},pass_token.eq.${cleanToken}`)
    : passQuery.eq("pass_token", cleanToken)
  ).maybeSingle();

  if (!pass) throw new Error("Invalid QR Pass: Pass not found");
  if (pass.event_id !== session.event_id) throw new Error("Pass registered for a different event");

  const attendee = (pass as any).attendee;
  if (!attendee || attendee.application_status === "rejected") {
    throw new Error("Attendee application rejected or invalid");
  }

  const { data: existingCheckIn } = await supabase
    .from("session_checkins")
    .select("id, checkin_time")
    .eq("session_id", params.sessionId)
    .eq("attendee_id", attendee.id)
    .maybeSingle();

  if (existingCheckIn) {
    return {
      status: "ALREADY_CHECKED_IN",
      message: `Already checked in at ${new Date(existingCheckIn.checkin_time).toLocaleTimeString()}`,
      attendee: { name: attendee.name, email: attendee.email },
      sessionTitle: session.title,
    };
  }

  if (session.registration_required && !params.override) {
    const { data: res } = await supabase
      .from("session_reservations")
      .select("id, status")
      .eq("session_id", params.sessionId)
      .eq("attendee_id", attendee.id)
      .maybeSingle();

    if (!res || res.status !== "reserved") {
      throw new Error(`ACCESS NOT ALLOWED: ${attendee.name} has not reserved a seat in this session.`);
    }
  }

  const checkinTime = new Date().toISOString();
  await supabase
    .from("session_checkins")
    .insert({
      event_id: session.event_id,
      session_id: session.id,
      attendee_id: attendee.id,
      pass_id: pass.id,
      checkin_time: checkinTime,
      checkin_source: "mcp",
      sync_status: "synced",
    });

  const roomObj = Array.isArray(session.room) ? session.room[0] : (session.room as any);

  return {
    status: "CHECKED_IN",
    success: true,
    message: `✓ Checked in: ${attendee.name} to ${session.title}`,
    attendee: { name: attendee.name, email: attendee.email },
    sessionTitle: session.title,
    room: roomObj?.name || "Main Venue",
    checkinTime,
  };
}

// 17. get_conference_analytics
export async function mcpGetConferenceAnalytics(
  ctx: McpToolContext,
  params: { eventId: string }
) {
  const supabase = adminClient();
  await verifyOrganizerEvent(supabase, params.eventId, ctx.userId);

  const { data: sessionsRaw } = await supabase
    .from("event_sessions")
    .select("id, title, room_id, capacity, session_date, start_time, end_time, status")
    .eq("event_id", params.eventId);

  const sessionIds = ((sessionsRaw || []) as Array<{ id: string }>).map((s) => s.id);

  const [
    { data: roomsRaw },
    { count: speakersCount },
    { count: tracksCount },
    { data: reservationsRaw },
    { data: checkinsRaw },
  ] = await Promise.all([
    supabase
      .from("event_rooms")
      .select("id, name, capacity")
      .eq("event_id", params.eventId),

    supabase
      .from("event_speakers")
      .select("id", { count: "exact", head: true })
      .eq("event_id", params.eventId),

    supabase
      .from("event_tracks")
      .select("id", { count: "exact", head: true })
      .eq("event_id", params.eventId),

    sessionIds.length > 0
      ? supabase
          .from("session_reservations")
          .select("session_id, status")
          .in("session_id", sessionIds)
      : Promise.resolve({ data: [] }),

    supabase
      .from("session_checkins")
      .select("session_id, checkin_time")
      .eq("event_id", params.eventId),
  ]);

  const sessions = (sessionsRaw || []) as unknown as EventSession[];
  const rooms = (roomsRaw || []) as unknown as EventRoom[];
  const reservations = (reservationsRaw || []) as Array<{ session_id: string; status: string }>;
  const checkins = (checkinsRaw || []) as Array<{ session_id: string; checkin_time: string }>;

  const analytics = computeConferenceAnalytics(
    sessions,
    rooms,
    speakersCount || 0,
    tracksCount || 0,
    reservations,
    checkins
  );

  return {
    eventId: params.eventId,
    analytics,
  };
}
